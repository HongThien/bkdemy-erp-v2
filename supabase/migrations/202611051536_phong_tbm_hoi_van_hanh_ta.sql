-- ============================================================================
-- 202611051536 — phong_tbm_hoi_van_hanh_ta
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 — "Phòng làm việc của trưởng bộ môn có thêm 1 luồng liên quan đến vận hành
--   của trợ giảng: lương, dữ liệu đã điền, duyệt công các thứ… trưởng bộ môn có thể hỏi các dữ liệu
--   từ DB để ra quyết định." Bảng đã có trên ERP ⇒ CHỈ làm phần HỎI (Thùy: "chỉ cần làm chỗ hỏi").
--   Chốt: lương xem ĐỦ nhưng CHỈ phần liên quan bộ môn của mình · công/duyệt công xem được.
--
-- THIẾT KẾ:
--   · Cửa DUY NHẤT: fn_phong_hoi_danh_muc() (danh mục cho model) + fn_phong_hoi_goi(tên, tham số).
--     Gác ở cửa: fn_phong_che_do() = 'tbm' (trưởng bộ môn theo cây GV / QLCL toàn hệ / admin).
--     Phạm vi = lớp mà _phong_trong_pham_vi(môn, khối) cho phép (môn ở gốc cây GV — Trang=Toán,
--     anh Ngọc=KHTN, anh Hoà=Tiếng Anh; admin/QLCL toàn hệ = mọi môn). Model KHÔNG chọn được phạm vi:
--     cửa luôn ghi đè tham số `_lop` bằng danh sách lớp của người hỏi (khối chỉ THU HẸP thêm).
--   · KHÔNG viết công thức mới (CLAUDE.md §2.0):
--       lương       → _ta_luong_ky_core (tách nguyên thân fn_ta_luong_ky, bỏ cổng) — kỳ chốt đọc bản chốt.
--       công/duyệt  → _ta_doi_chieu + _ta_buoi_thieu_cong (cùng hàm màn Duyệt công).
--       hiệu suất   → _phong_chi_so_pv (cùng số trên đầu nhân vật trong phòng).
--       việc buổi   → _troly_cc_viec_van_hanh · dữ liệu buổi → _troly_cc_tinh_trang_buoi (công cụ Trợ lý),
--                     vá thêm tham số nội bộ `_lop` (mảng uuid) — CHỈ thu hẹp, không nới; Trợ lý cũ không đổi hành vi.
--   · Lương "chỉ phần liên quan bộ môn": TA có lớp môn khác trong kỳ ⇒ chỉ trả các dòng lớp/ngoài-package
--     thuộc môn mình + tổng tiền lớp môn mình; tổng gross/net để trống kèm ghi chú (03/11 chưa TA nào dạy 2 môn).
--   · Log hỏi–đáp ghi vào troly_hoi_dap (bảng sẵn, policy la_thanh_vien) — không bảng mới.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. fn_ta_luong_ky giữ nguyên chữ ký + cổng + kết quả (thân chuyển vào
--   _ta_luong_ky_core). Hai công cụ Trợ lý thay thân bằng bản y hệt + 1 bộ lọc tuỳ chọn.
-- ============================================================================

-- ── 1. Lõi lương kỳ (tách khỏi fn_ta_luong_ky, KHÔNG đổi logic) ──────────────
create or replace function public._ta_luong_ky_core(p_ky date, p_ns uuid default null)
returns table(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric, ngoai_package numeric,
              gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb, da_chot boolean, lan integer, chot_at timestamptz)
language plpgsql stable security definer set search_path to 'public' as $$
declare v_ky date := date_trunc('month', p_ky)::date; k ta_luong_ky;
begin
  select * into k from ta_luong_ky where ky = v_ky and mo_lai_at is null;
  if k.id is not null then
    return query
    select d.nhan_su_id, d.ho_ten, d.package_lop, d.bo_tro_gio, d.bo_tro_tien, d.ngoai_package, d.gross, d.tien_phat, d.net, d.chi_tiet,
           true, k.lan, k.chot_at
      from ta_luong_ky_dong d where d.ky_id = k.id and (p_ns is null or d.nhan_su_id = p_ns)
     order by d.ho_ten;
  else
    return query
    select l.nhan_su_id, l.ho_ten, l.package_lop, l.bo_tro_gio, l.bo_tro_tien, l.ngoai_package, l.gross, l.tien_phat, l.net, l.chi_tiet,
           false, null::integer, null::timestamptz
      from public._ta_luong_tinh(v_ky, p_ns) l;
  end if;
end $$;
revoke execute on function public._ta_luong_ky_core(date, uuid) from public, anon, authenticated;

create or replace function public.fn_ta_luong_ky(p_ky date, p_ns uuid default null)
returns table(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric, ngoai_package numeric,
              gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb, da_chot boolean, lan integer, chot_at timestamptz)
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not (public.co_chuc_nang('ta_luong') or (p_ns is not null and p_ns = public.current_nhan_su_id())) then
    raise exception 'Không có quyền xem lương trợ giảng';
  end if;
  return query select * from public._ta_luong_ky_core(p_ky, p_ns);
end $$;

-- ── 2. Phạm vi của người hỏi ────────────────────────────────────────────────
-- Lớp (mọi trạng thái — hỏi lịch sử được) trong phạm vi phòng TBM, thu hẹp theo khối nếu có.
create or replace function public._phong_hoi_lop(p_khoi text default null)
returns uuid[] language sql stable security definer set search_path to 'public' as $$
  select coalesce(array_agg(l.id), '{}') from lop l
   where public._phong_trong_pham_vi(l.mon, l.khoi)
     and (nullif(btrim(p_khoi), '') is null or l.khoi = btrim(p_khoi))
$$;
revoke execute on function public._phong_hoi_lop(text) from public, anon, authenticated;

-- TA (vai tg) từng/đang được phân công vào các lớp đó.
create or replace function public._phong_hoi_ta(p_lop uuid[])
returns uuid[] language sql stable security definer set search_path to 'public' as $$
  select coalesce(array_agg(distinct pc.nhan_su_id), '{}') from phan_cong_lop pc
   where pc.vai_tro = 'tg' and pc.lop_id = any(p_lop)
$$;
revoke execute on function public._phong_hoi_ta(uuid[]) from public, anon, authenticated;

-- Tra tên TA trong phạm vi: trả {id, ho_ten} | {loi,...}. Ngoài phạm vi ⇒ báo rõ, không trả dữ liệu.
create or replace function public._phong_hoi_chon_ta(p_ten text, p_ta uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v jsonb;
begin
  v := public._troly_chon_ns(p_ten);
  if v ? 'loi' then return v; end if;
  if not ((v->>'id')::uuid = any(p_ta)) then
    return jsonb_build_object('loi', 'ngoai_pham_vi', 'thong_diep',
      format('%s không phải trợ giảng của lớp nào trong phạm vi bộ môn của bạn.', v->>'ho_ten'));
  end if;
  return v;
end $$;
revoke execute on function public._phong_hoi_chon_ta(text, uuid[]) from public, anon, authenticated;

-- ── 3. Công cụ: danh sách trợ giảng + hiệu suất tháng ──────────────────────
create or replace function public._phong_hoi_cc_tro_giang(p jsonb, p_lop uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_ds uuid[]; v jsonb;
begin
  select coalesce(array_agg(distinct pc.nhan_su_id), '{}') into v_ds
    from phan_cong_lop pc join lop l on l.id = pc.lop_id and l.trang_thai = 'dang_hoc'
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam'
   where pc.vai_tro = 'tg' and pc.lop_id = any(p_lop);
  select jsonb_build_object(
    'tro_giang', coalesce(jsonb_agg(jsonb_build_object(
        'ho_ten', n.ho_ten, 'lop', lp.lop, 'khoi', lp.khoi,
        'hieu_suat_thang', c.hieu_suat, 'hieu_suat_du_3_dau_viec', c.hieu_suat_du,
        'viec_tuan_nay', c.viec_tuan, 'dang_lam', c.dang_lam, 'da_xong', c.da_xong, 'tre_han', c.tre_han, 'qua_han', c.qua_han,
        'gay_thang', c.gay_thang) order by n.ho_ten), '[]'::jsonb),
    'ghi_chu', jsonb_build_array(
      'Chỉ TA đang làm, đang được phân công vào lớp đang học trong phạm vi bộ môn của bạn.',
      'hieu_suat_thang = hiệu suất TA tháng đang chạy (cùng số trên đầu nhân vật trong phòng), chỉ tính lớp trong phạm vi; null = chưa có việc tới hạn để đo.',
      'Việc tuần = chấm BTVN · chấm ET của buổi T2→CN tuần này + việc tồn quá hạn 30 ngày; gậy = gậy tháng này gắn buổi của lớp trong phạm vi.'))
    into v
    from public._phong_chi_so_pv(v_ds, p_lop) c
    join nhan_su n on n.id = c.nhan_su_id
    cross join lateral (
      select string_agg(distinct l.ten_lop, ', ' order by l.ten_lop) as lop, string_agg(distinct l.khoi, ', ' order by l.khoi) as khoi
        from phan_cong_lop pc join lop l on l.id = pc.lop_id and l.trang_thai = 'dang_hoc'
       where pc.nhan_su_id = c.nhan_su_id and pc.vai_tro = 'tg' and pc.lop_id = any(p_lop)) lp;
  return v;
end $$;
revoke execute on function public._phong_hoi_cc_tro_giang(jsonb, uuid[]) from public, anon, authenticated;

-- ── 4. Công cụ: lương trợ giảng (chỉ phần thuộc bộ môn) ─────────────────────
create or replace function public._phong_hoi_cc_luong(p jsonb, p_lop uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_thang text := nullif(btrim(p->>'thang'), '');
  v_ky date; v_ta uuid[]; v_ns jsonb; v_ns_id uuid; v_ten text[]; v jsonb;
begin
  if v_thang is null then v_ky := date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
  elsif v_thang ~ '^\d{4}-\d{2}$' then v_ky := (v_thang || '-01')::date;
  else return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'thang phải dạng YYYY-MM.'); end if;
  -- "Thuộc bộ môn" đối chiếu TOÀN BỘ lớp của môn trong phạm vi (không theo khối) — khối chỉ lọc danh sách TA.
  v_ta := public._phong_hoi_ta(p_lop);
  select coalesce(array_agg(ten_lop), '{}') into v_ten from lop where id = any(public._phong_hoi_lop(null));
  if nullif(btrim(p->>'ten_tro_giang'), '') is not null then
    v_ns := public._phong_hoi_chon_ta(p->>'ten_tro_giang', v_ta);
    if v_ns ? 'loi' then return v_ns; end if;
    v_ns_id := (v_ns->>'id')::uuid;
  end if;

  with l as (select * from public._ta_luong_ky_core(v_ky, v_ns_id)),
  x as (
    select l.*,
      coalesce((select jsonb_agg(e) from jsonb_array_elements(l.chi_tiet->'lop') e where e->>'lop' = any(v_ten)), '[]'::jsonb) as lop_mon,
      coalesce((select jsonb_agg(e) from jsonb_array_elements(l.chi_tiet->'ngoai_package') e where e->>'lop' = any(v_ten)), '[]'::jsonb) as ngoai_mon,
      exists (select 1 from jsonb_array_elements(l.chi_tiet->'lop') e where not (e->>'lop' = any(v_ten)))
        or exists (select 1 from jsonb_array_elements(l.chi_tiet->'ngoai_package') e where e->>'lop' is not null and not (e->>'lop' = any(v_ten)))
        as co_mon_khac
    from l
  ),
  y as (
    select x.* from x
     where x.nhan_su_id = any(v_ta)
        or (nullif(btrim(p->>'khoi'), '') is null and (jsonb_array_length(x.lop_mon) > 0 or jsonb_array_length(x.ngoai_mon) > 0))
  )
  select jsonb_build_object(
    'ky', to_char(v_ky, 'YYYY-MM'),
    'da_chot', coalesce((select bool_and(da_chot) from y), false),
    'lan_chot', (select max(lan) from y),
    'tong_bo_mon', (select jsonb_build_object(
        'so_ta', count(*),
        'gross', sum(gross) filter (where not co_mon_khac),
        'tien_phat', sum(tien_phat) filter (where not co_mon_khac),
        'net', sum(net) filter (where not co_mon_khac),
        'so_ta_day_ca_mon_khac', count(*) filter (where co_mon_khac)) from y),
    'tro_giang', (select coalesce(jsonb_agg(case when not co_mon_khac then jsonb_build_object(
          'ho_ten', ho_ten, 'package_lop', package_lop, 'bo_tro_gio', bo_tro_gio, 'bo_tro_tien', bo_tro_tien,
          'ngoai_package', ngoai_package, 'gross', gross, 'tien_phat', tien_phat, 'net', net,
          'chi_tiet', case when v_ns_id is not null then chi_tiet end)
        else jsonb_build_object(
          'ho_ten', ho_ten, 'day_ca_mon_khac', true,
          'tien_lop_thuoc_bo_mon', (select sum((e->>'tien')::numeric) from jsonb_array_elements(lop_mon) e),
          'so_luong_ngoai_package_thuoc_bo_mon', jsonb_array_length(ngoai_mon),
          'lop_thuoc_bo_mon', lop_mon, 'ngoai_package_thuoc_bo_mon', ngoai_mon,
          'ghi_chu', 'TA này còn lớp/việc của môn khác: chỉ trả các dòng thuộc bộ môn của bạn (tiền lớp đã cộng sẵn ở tien_lop_thuoc_bo_mon; ngoài package xem từng dòng — đơn giá × số lượng). Bổ trợ, tiền phạt và tổng gross/net không tách được theo môn ⇒ xem ở màn Lương TA.')
        end order by ho_ten), '[]'::jsonb) from y),
    'ghi_chu', jsonb_build_array(
      'Cùng số màn Lương TA (fn_ta_luong_ky): kỳ đã chốt = bản chốt bất biến; chưa chốt = TẠM TÍNH, còn đổi khi duyệt thêm công.',
      'gross = package_lop (tiền theo lớp) + bo_tro_tien + ngoai_package; net = gross − tien_phat. Đơn vị: đồng.',
      'Công chưa duyệt KHÔNG được tính vào lương — hỏi công cụ cong_tro_giang để xem công đang chờ duyệt.',
      'chi_tiet (từng lớp: sĩ số TB, bậc, tỉ lệ thời gian, tỉ lệ BTVN; bổ trợ; ngoài package) chỉ trả khi hỏi MỘT trợ giảng.'))
  into v;
  return v;
end $$;
revoke execute on function public._phong_hoi_cc_luong(jsonb, uuid[]) from public, anon, authenticated;

-- ── 5. Công cụ: công & duyệt công ───────────────────────────────────────────
create or replace function public._phong_hoi_cc_cong(p jsonb, p_lop uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_ta uuid[]; v_ns jsonb; v_ns_id uuid; v_tu date; v_den date; v jsonb;
  v_duyet text := lower(coalesce(nullif(btrim(p->>'trang_thai_duyet'), ''), 'tat_ca'));
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  c_tran constant int := 60;
begin
  if v_duyet not in ('cho_duyet', 'da_duyet', 'tu_choi', 'co_co', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai_duyet phải là: cho_duyet | da_duyet | tu_choi | co_co | tat_ca.');
  end if;
  v_ta := public._phong_hoi_ta(p_lop);
  if nullif(btrim(p->>'ten_tro_giang'), '') is not null then
    v_ns := public._phong_hoi_chon_ta(p->>'ten_tro_giang', v_ta);
    if v_ns ? 'loi' then return v_ns; end if;
    v_ns_id := (v_ns->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', v_hom_nay);
  v_tu := public._troly_ngay(p->>'tu_ngay', date_trunc('month', v_den)::date);
  if v_tu > v_den then v_tu := v_den; end if;
  if v_den - v_tu > 92 then v_tu := v_den - 92; end if;

  with d as (
    select dc.*,
      case when dc.loai_dong = 'viec' and dc.gio_bat_dau is not null and dc.gio_ket_thuc is not null
           then round((extract(epoch from (dc.gio_ket_thuc - dc.gio_bat_dau)) / 3600.0)::numeric, 2) end as gio_viec
      from public._ta_doi_chieu(v_tu, v_den, v_ns_id) dc
     where dc.nhan_su_id = any(v_ta) and (dc.lop_id is null or dc.lop_id = any(p_lop))
  ),
  loc as (
    select * from d where v_duyet = 'tat_ca' or (v_duyet = 'co_co' and cardinality(co) > 0) or duyet = v_duyet
  ),
  tc as (
    select t.* from public._ta_buoi_thieu_cong(v_tu, v_den) t
     where t.lop_id = any(p_lop)
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('tro_giang', v_ns->>'ho_ten', 'trang_thai_duyet', v_duyet),
    'tong', (select jsonb_build_object(
        'ca_cho_duyet', count(*) filter (where loai_dong = 'ca' and duyet = 'cho_duyet'),
        'ca_da_duyet', count(*) filter (where loai_dong = 'ca' and duyet = 'da_duyet'),
        'ca_tu_choi', count(*) filter (where loai_dong = 'ca' and duyet = 'tu_choi'),
        'viec_cho_duyet', count(*) filter (where loai_dong = 'viec' and duyet = 'cho_duyet'),
        'viec_da_duyet', count(*) filter (where loai_dong = 'viec' and duyet = 'da_duyet'),
        'viec_tu_choi', count(*) filter (where loai_dong = 'viec' and duyet = 'tu_choi'),
        'dong_co_co', count(*) filter (where cardinality(co) > 0),
        'quen_checkout', count(*) filter (where quen_ra)) from d),
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.cho_duyet desc, g.ho_ten), '[]'::jsonb) from (
        select ho_ten, count(*) filter (where loai_dong = 'ca')::int as so_ca, count(*) filter (where loai_dong = 'viec')::int as so_viec,
               count(*) filter (where duyet = 'cho_duyet')::int as cho_duyet, count(*) filter (where duyet = 'tu_choi')::int as tu_choi,
               count(*) filter (where cardinality(co) > 0)::int as dong_co_co, count(*) filter (where quen_ra)::int as quen_checkout
          from d group by ho_ten) g),
    'theo_co', (select coalesce(jsonb_agg(to_jsonb(g) order by g.so_dong desc), '[]'::jsonb) from (
        select c as co, count(*)::int as so_dong from d, unnest(d.co) c group by c) g),
    'dong', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ho_ten, ngay, loai_dong, ten_loai as loai_viec, ten_lop,
               to_char(coalesce(vao_chot, vao_at) at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI') as vao,
               to_char(coalesce(ra_chot, ra_at) at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI') as ra,
               to_char(gio_bat_dau, 'HH24:MI') as viec_tu, to_char(gio_ket_thuc, 'HH24:MI') as viec_den, gio_viec,
               hoc_sinh, nullif(ghi_chu, '') as ghi_chu, khop as khop_lich, co, lam_ho, duyet, ly_do_duyet
          from loc order by (duyet = 'cho_duyet') desc, cardinality(co) desc, ngay desc, ho_ten limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'buoi_thieu_cong', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', loai, 'ngay', ngay, 'ten', ten, 'gio', to_char(gio_bat_dau, 'HH24:MI') || '–' || to_char(gio_ket_thuc, 'HH24:MI'),
        'nguoi_phu_trach', nguoi_phu_trach) order by ngay desc), '[]'::jsonb) from (select * from tc order by ngay desc limit c_tran) z),
    'ghi_chu', jsonb_build_array(
      'Cùng nguồn màn Duyệt công (_ta_doi_chieu). ca = ca có mặt (checkin/checkout); viec = việc TA đã ghi công trong ca.',
      'duyet: cho_duyet | da_duyet | tu_choi. Chỉ công ĐÃ DUYỆT (cả ca lẫn việc) mới vào lương.',
      'co = cờ mâu thuẫn: quen_ra (quên checkout) · ca_khong_viec · buoi_huy · khong_co_buoi · hai_ta_cung_buoi · truoc_gio_vao · sau_gio_ra · trung_gio · ngoai_gio · thieu_gio · lop_chua_co_ta · ca_bi_tu_choi; khai_bu / nhap_ho / chua_don_gia là thông tin, không phải lỗi.',
      'buoi_thieu_cong = buổi/ca bổ trợ của lớp trong phạm vi đã diễn ra mà CHƯA có TA nào ghi công.',
      'Ca có mặt không gắn lớp: hiện nếu TA thuộc phạm vi bộ môn. Việc của lớp môn khác không hiện.',
      format('"dong" cắt ở %s dòng (chờ duyệt + có cờ trước); tong/theo_nguoi đủ, không cắt. Khoảng tối đa 92 ngày.', c_tran))
  ) into v;
  return v;
end $$;
revoke execute on function public._phong_hoi_cc_cong(jsonb, uuid[]) from public, anon, authenticated;

-- ── 6. Danh mục + cửa gọi ───────────────────────────────────────────────────
create or replace function public.fn_phong_hoi_danh_muc()
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_mon text[];
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn hỏi được' using errcode = '42501'; end if;
  v_mon := public._phong_mon_cua_toi();
  return jsonb_build_object(
    'pham_vi', jsonb_build_object(
      'mon', coalesce(to_jsonb(v_mon), '"mọi môn"'::jsonb),
      'khoi', (select coalesce(jsonb_agg(distinct l.mon || ' ' || l.khoi), '[]'::jsonb) from lop l
                where l.id = any(public._phong_hoi_lop(null)) and l.trang_thai = 'dang_hoc')),
    'cong_cu', $cat$[
  {"name":"tro_giang",
   "mo_ta":"Danh sách TRỢ GIẢNG trong phạm vi bộ môn: lớp, khối, hiệu suất tháng đang chạy, số việc tuần này (đang làm/xong/trễ/quá hạn), gậy tháng. Dùng khi hỏi 'có những TA nào', 'ai hiệu suất thấp', 'ai đang trễ việc'.",
   "tham_so":{"type":"object","properties":{
     "khoi":{"type":"string","description":"Khối, vd 8 hoặc 5T. Bỏ trống = mọi khối trong phạm vi."}}}},
  {"name":"luong_tro_giang",
   "mo_ta":"LƯƠNG trợ giảng theo tháng (chỉ phần thuộc bộ môn của người hỏi): tiền theo lớp, bổ trợ (giờ + tiền), ngoài package, gross, tiền phạt, net; kỳ đã chốt hay tạm tính. Hỏi 1 TA thì có chi tiết từng lớp (sĩ số TB, bậc, tỉ lệ thời gian, tỉ lệ BTVN).",
   "tham_so":{"type":"object","properties":{
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."},
     "ten_tro_giang":{"type":"string","description":"Tên TA nguyên văn người dùng gõ. Bỏ trống = mọi TA."},
     "khoi":{"type":"string","description":"Khối. Bỏ trống = mọi khối."}}}},
  {"name":"cong_tro_giang",
   "mo_ta":"CÔNG & DUYỆT CÔNG của trợ giảng: ca checkin/checkout, việc đã ghi công, trạng thái duyệt (chờ/đã duyệt/từ chối), cờ mâu thuẫn (quên checkout, ngoài giờ, trùng giờ, buổi huỷ…), và buổi/ca bổ trợ đã diễn ra mà CHƯA ai ghi công.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = đầu tháng của den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_tro_giang":{"type":"string"},
     "trang_thai_duyet":{"type":"string","enum":["cho_duyet","da_duyet","tu_choi","co_co","tat_ca"],"description":"Lọc danh sách dòng. co_co = dòng có cờ. Bỏ trống = tat_ca."},
     "khoi":{"type":"string"}}}},
  {"name":"viec_van_hanh",
   "mo_ta":"Việc sau buổi học theo NGƯỜI (GV và trợ giảng): ai còn nợ khâu nào (đánh giá/nhận xét, chấm bài trên lớp, ET, BTVN, MT) của buổi nào, hạn, đã đóng đúng hạn/trễ. vai = tg là trợ giảng.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "ten_lop":{"type":"string"},
     "khoi":{"type":"string"},
     "tu_ngay":{"type":"string","description":"Ngày BUỔI HỌC, YYYY-MM-DD. Bỏ trống = 14 ngày trước den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "trang_thai":{"type":"string","enum":["chua_xong","qua_han","da_xong","tat_ca"],"description":"Bỏ trống = chua_xong."}}}},
  {"name":"tinh_trang_buoi",
   "mo_ta":"DỮ LIỆU ĐÃ ĐIỀN của từng BUỔI HỌC: điểm danh (có mặt/vắng/chưa điểm danh), ET (có đề, đã đóng, bao nhiêu em có điểm), BTVN buổi trước đã nhập chưa, đánh giá + nhận xét, MT; buổi đóng mà không có dữ liệu; lớp có lịch mà chưa mở buổi.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = bằng den_ngay (hỏi 1 ngày)."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_lop":{"type":"string"},
     "khoi":{"type":"string"},
     "chi_buoi_co_van_de":{"type":"boolean","description":"true = chỉ buổi thiếu/đóng khống. Bỏ trống: ≤7 ngày liệt kê hết, dài hơn chỉ buổi có vấn đề."}}}}
]$cat$::jsonb);
end $$;
revoke execute on function public.fn_phong_hoi_danh_muc() from public, anon;
grant execute on function public.fn_phong_hoi_danh_muc() to authenticated;

create or replace function public.fn_phong_hoi_goi(p_cong_cu text, p_tham_so jsonb default '{}'::jsonb)
returns jsonb language plpgsql volatile security definer set search_path to 'public' as $$
declare p jsonb := coalesce(p_tham_so, '{}'::jsonb); v_lop uuid[]; v jsonb;
begin
  -- Gác NGOÀI khối bắt lỗi: bị chặn quyền phải nổ, không nuốt thành "lỗi thực thi".
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn hỏi được' using errcode = '42501'; end if;
  if jsonb_typeof(p) <> 'object' then p := '{}'::jsonb; end if;
  v_lop := public._phong_hoi_lop(p->>'khoi');
  -- Phạm vi do DB đặt, model không chọn được: ghi đè `_lop` (kể cả model tự điền).
  p := (p - '_lop') || jsonb_build_object('_lop', to_jsonb(v_lop));
  begin
    if p_cong_cu in ('viec_van_hanh', 'tinh_trang_buoi') then
      perform set_config('troly.noi_bo', '1', true);   -- công cụ Trợ lý gác bằng troly_duoc_dung(); cửa này đã gác TBM
    end if;
    v := case p_cong_cu
      when 'tro_giang'       then public._phong_hoi_cc_tro_giang(p, v_lop)
      when 'luong_tro_giang' then public._phong_hoi_cc_luong(p, v_lop)
      when 'cong_tro_giang'  then public._phong_hoi_cc_cong(p, v_lop)
      when 'viec_van_hanh'   then public._troly_cc_viec_van_hanh(p)
      when 'tinh_trang_buoi' then public._troly_cc_tinh_trang_buoi(p - 'mon')
      else jsonb_build_object('loi', 'khong_co_cong_cu', 'thong_diep', format('Không có công cụ "%s".', p_cong_cu))
    end;
    perform set_config('troly.noi_bo', '', true);
    return v;
  exception when others then
    perform set_config('troly.noi_bo', '', true);
    return jsonb_build_object('loi', 'loi_thuc_thi', 'thong_diep', sqlerrm);
  end;
end $$;
revoke execute on function public.fn_phong_hoi_goi(text, jsonb) from public, anon;
grant execute on function public.fn_phong_hoi_goi(text, jsonb) to authenticated;

comment on function public.fn_phong_hoi_goi(text, jsonb) is
  'Cửa gọi DUY NHẤT của ô hỏi Phòng Trưởng bộ môn (vận hành trợ giảng, Thùy 05/11). Gác fn_phong_che_do()=tbm; phạm vi lớp đặt ở DB (_phong_hoi_lop), model không chọn được. Thêm công cụ: viết _phong_hoi_cc_<tên>, thêm vào CASE + fn_phong_hoi_danh_muc.';

-- ── 7. Hai công cụ Trợ lý nhận phạm vi lớp `_lop` (chỉ thu hẹp) ─────────────

CREATE OR REPLACE FUNCTION public._troly_cc_viec_van_hanh(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_pv uuid[] := case when jsonb_typeof(p->'_lop') = 'array' then array(select jsonb_array_elements_text(p->'_lop')::uuid) end;  -- phạm vi lớp nội bộ (Phòng TBM), chỉ thu hẹp
  v_ns jsonb; v_ns_id uuid; v_lop jsonb; v_lop_id uuid;
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'chua_xong'));
  v_den date; v_tu date; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_tt not in ('chua_xong', 'qua_han', 'da_xong', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: chua_xong | qua_han | da_xong | tat_ca.');
  end if;
  if nullif(btrim(p->>'ten_nhan_vien'), '') is not null then
    v_ns := public._troly_chon_ns(p->>'ten_nhan_vien');
    if v_ns ? 'loi' then return v_ns; end if;
    v_ns_id := (v_ns->>'id')::uuid;
  end if;
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 14);
  if v_den - v_tu > 120 then v_tu := v_den - 120; end if;

  with t as (
    select f.nhan_su_id, ns.ho_ten, f.ten_lop, f.ngay, f.vai, f.tab, f.dong_at, f.han,
           case when f.dong_at is not null and f.dong_at <= f.han then 'xong_dung_han'
                when f.dong_at is not null then 'xong_tre'
                when f.han < now() then 'chua_xong_qua_han'
                else 'chua_xong_con_han' end as tinh_trang
    from public.fn_viec_buoi_thuong_lh(v_tu, v_den) f
    join nhan_su ns on ns.id = f.nhan_su_id
    where (v_ns_id is null or f.nhan_su_id = v_ns_id)
      and (v_lop_id is null or f.lop_id = v_lop_id)
      and (v_pv is null or f.lop_id = any(v_pv))
  ),
  loc as (
    select * from t
    where v_tt = 'tat_ca'
       or (v_tt = 'chua_xong' and tinh_trang in ('chua_xong_qua_han', 'chua_xong_con_han'))
       or (v_tt = 'qua_han' and tinh_trang = 'chua_xong_qua_han')
       or (v_tt = 'da_xong' and tinh_trang in ('xong_dung_han', 'xong_tre'))
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('nhan_vien', v_ns->>'ho_ten', 'lop', v_lop->>'ten_lop', 'trang_thai', v_tt),
    'tong', (select jsonb_build_object(
        'so_viec', count(*),
        'xong_dung_han', count(*) filter (where tinh_trang = 'xong_dung_han'),
        'xong_tre', count(*) filter (where tinh_trang = 'xong_tre'),
        'chua_xong_qua_han', count(*) filter (where tinh_trang = 'chua_xong_qua_han'),
        'chua_xong_con_han', count(*) filter (where tinh_trang = 'chua_xong_con_han')) from t),
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.chua_xong_qua_han desc, g.ho_ten), '[]'::jsonb) from (
        select ho_ten, count(*)::int as so_viec,
               count(*) filter (where tinh_trang = 'xong_dung_han')::int as xong_dung_han,
               count(*) filter (where tinh_trang = 'xong_tre')::int as xong_tre,
               count(*) filter (where tinh_trang = 'chua_xong_qua_han')::int as chua_xong_qua_han,
               count(*) filter (where tinh_trang = 'chua_xong_con_han')::int as chua_xong_con_han
        from t group by ho_ten) g),
    'theo_khau', (select coalesce(jsonb_agg(to_jsonb(g) order by g.chua_xong_qua_han desc), '[]'::jsonb) from (
        select tab as khau, count(*)::int as so_viec,
               count(*) filter (where tinh_trang = 'chua_xong_qua_han')::int as chua_xong_qua_han,
               count(*) filter (where tinh_trang = 'chua_xong_con_han')::int as chua_xong_con_han
        from t group by tab) g),
    'viec', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ho_ten, vai, tab as khau, ten_lop, ngay as ngay_buoi,
               to_char(han at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') as han,
               to_char(dong_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') as dong_luc,
               tinh_trang
        from loc order by han, ho_ten, ten_lop limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'ghi_chu', jsonb_build_array(
      'Việc suy từ PHÂN CÔNG LỚP × buổi thường đã mở (cùng nguồn với màn Việc của tôi và bảng hiệu suất). khau: danhgia · ingame (chấm bài trên lớp) · et · btvn · mt.',
      'Chưa gồm việc của Ops (điểm danh, report, báo tan, chuẩn bị phòng) và việc phát triển — việc phát triển hỏi công cụ viec_phat_trien.',
      'tong / theo_nguoi / theo_khau đếm TẤT CẢ trạng thái trong khoảng (không theo bộ lọc trang_thai) và không bị cắt; danh sách "viec" mới theo bộ lọc.',
      format('Danh sách "viec" cắt ở %s dòng, hạn cũ nhất trước. Bị cắt thì lọc thêm theo người hoặc lớp.', c_tran))
  ) into v;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public._troly_cc_tinh_trang_buoi(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_pv uuid[] := case when jsonb_typeof(p->'_lop') = 'array' then array(select jsonb_array_elements_text(p->'_lop')::uuid) end;  -- phạm vi lớp nội bộ (Phòng TBM), chỉ thu hẹp
  v_lop jsonb; v_lop_id uuid;
  v_khoi text := nullif(btrim(p->>'khoi'), ''); v_mon text := nullif(btrim(p->>'mon'), '');
  v_den date; v_tu date; v_chi_thieu boolean; v_chi_tiet boolean; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den);
  if v_tu > v_den then v_tu := v_den; end if;
  if v_den - v_tu > 120 then v_tu := v_den - 120; end if;
  -- Khoảng dài mà liệt kê mọi buổi thì trôi mất thứ cần nhìn ⇒ mặc định chỉ buổi có vấn đề.
  v_chi_thieu := coalesce((p->>'chi_buoi_co_van_de')::boolean, v_den - v_tu > 7);
  v_chi_tiet := v_den - v_tu <= 7;   -- khoảng ngắn mới trả đủ cột từng buổi; khoảng dài chỉ trả thứ đang thiếu

  -- ⚠ Gom TRƯỚC rồi join, KHÔNG đếm bằng subquery theo từng buổi: `gami_grades` và `btvn_ket_qua`
  --   không có index dẫn đầu bằng buoi_hoc_id ⇒ subquery tương quan = quét cả bảng × số buổi
  --   (đo 29/09: hỏi 90 ngày mất 17 giây). Đi qua `gami_session_problems` (có index buổi+phase).
  with b as (
    select bh.id, bh.ngay, bh.gio_bat_dau, bh.trang_thai, bh.lop_id, l.ten_lop, l.mon, l.khoi,
           bh.ingame_dong_at, bh.et_dong_at, bh.btvn_dong_at, bh.danh_gia_xong_at, bh.mt_dong_at
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between v_tu and v_den
      and (v_lop_id is null or bh.lop_id = v_lop_id)
      and (v_pv is null or bh.lop_id = any(v_pv))
      and (v_khoi is null or l.khoi = v_khoi) and (v_mon is null or l.mon = v_mon)
  ),
  pv as (  -- buổi thường LIỀN TRƯỚC của cùng lớp — nguồn nghĩa vụ BTVN của buổi này
    select b.id, q.id as truoc_id, q.ngay as truoc_ngay, q.btvn_dong_at as truoc_btvn_dong_at
    from b left join lateral (
      select q.id, q.ngay, q.btvn_dong_at from buoi_hoc q
      where q.lop_id = b.lop_id and q.loai = 'thuong' and q.trang_thai <> 'huy' and q.ngay < b.ngay
      order by q.ngay desc limit 1) q on true
  ),
  tl as (
    select t.lop_id, t.ngay, bool_or(t.loai = 'et') as co_et, bool_or(t.loai = 'btvn') as co_btvn, bool_or(t.loai = 'mt_buoi') as co_mt
    from tai_lieu t
    where t.loai in ('et', 'btvn', 'mt_buoi')
      and (t.lop_id, t.ngay) in (select b.lop_id, b.ngay from b
                                 union select b.lop_id, pv.truoc_ngay from b join pv on pv.id = b.id where pv.truoc_ngay is not null)
    group by t.lop_id, t.ngay
  ),
  de_on as (select distinct bt.lop_id, bt.ngay from bai_test bt where bt.loai = 'et' and bt.ngay between v_tu and v_den),
  de_gsp as (select distinct sp.buoi_hoc_id from gami_session_problems sp
              where sp.phase = 'et' and sp.buoi_hoc_id in (select id from b)),
  et_hs as (
    select u.buoi_hoc_id, count(*)::int as n from (
      select sp.buoi_hoc_id, g.hoc_sinh_id
        from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
       where sp.phase = 'et' and sp.buoi_hoc_id in (select id from b)
      union
      select b.id, bl.hoc_sinh_id
        from b join bai_test bt on bt.loai = 'et' and bt.lop_id = b.lop_id and bt.ngay = b.ngay
        join bai_lam bl on bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') u
    group by u.buoi_hoc_id
  ),
  dd as (
    select h.buoi_hoc_id,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(*) filter (where h.diem_danh in ('vang', 'vang_phep'))::int as vang,
           count(*) filter (where h.diem_danh is null)::int as chua_diem_danh
    from buoi_hoc_hs h where h.buoi_hoc_id in (select id from b) group by h.buoi_hoc_id
  ),
  kq as (
    select k.buoi_hoc_id, count(*)::int as n from btvn_ket_qua k
    where k.buoi_hoc_id in (select id from b union select truoc_id from pv where truoc_id is not null)
    group by k.buoi_hoc_id
  ),
  dg as (
    select d.buoi_hoc_id, count(*)::int as n,
           count(*) filter (where nullif(btrim(d.nhan_xet), '') is not null)::int as n_nx
    from buoi_danh_gia d where d.buoi_hoc_id in (select id from b) group by d.buoi_hoc_id
  ),
  x as (
    select b.*,
      (coalesce(tl.co_et, false) or de_on.lop_id is not null or de_gsp.buoi_hoc_id is not null) as co_de_et,
      coalesce(tl.co_btvn, false) as co_btvn,
      coalesce(tl.co_mt, false) as co_mt,
      coalesce(dd.co_mat, 0) as co_mat, coalesce(dd.vang, 0) as vang, coalesce(dd.chua_diem_danh, 0) as chua_diem_danh,
      coalesce(et_hs.n, 0) as hs_co_diem_et,
      coalesce(kq.n, 0) as hs_co_btvn,
      coalesce(dg.n, 0) as hs_co_danh_gia, coalesce(dg.n_nx, 0) as hs_co_nhan_xet,
      pv.truoc_ngay, pv.truoc_btvn_dong_at,
      coalesce(tlp.co_btvn, false) as truoc_co_btvn,
      coalesce(kqp.n, 0) as truoc_hs_co_btvn
    from b
    join pv on pv.id = b.id
    left join tl on tl.lop_id = b.lop_id and tl.ngay = b.ngay
    left join tl tlp on tlp.lop_id = b.lop_id and tlp.ngay = pv.truoc_ngay
    left join de_on on de_on.lop_id = b.lop_id and de_on.ngay = b.ngay
    left join de_gsp on de_gsp.buoi_hoc_id = b.id
    left join et_hs on et_hs.buoi_hoc_id = b.id
    left join dd on dd.buoi_hoc_id = b.id
    left join kq on kq.buoi_hoc_id = b.id
    left join kq kqp on kqp.buoi_hoc_id = pv.truoc_id
    left join dg on dg.buoi_hoc_id = b.id
  ),
  y as (
    select x.*,
      array_remove(array[
        case when x.co_de_et and x.et_dong_at is null then 'et' end,
        case when x.danh_gia_xong_at is null then 'danh_gia' end,
        case when x.co_mt and x.mt_dong_at is null then 'mt' end,
        case when x.truoc_co_btvn and x.truoc_btvn_dong_at is null then 'btvn_buoi_truoc' end,
        case when x.chua_diem_danh > 0 then 'diem_danh' end
      ], null) as thieu,
      array_remove(array[
        case when x.et_dong_at is not null and x.co_de_et and x.hs_co_diem_et = 0 then 'et' end,
        case when x.danh_gia_xong_at is not null and x.hs_co_danh_gia = 0 then 'danh_gia' end,
        case when x.danh_gia_xong_at is not null and x.hs_co_danh_gia > 0 and x.hs_co_nhan_xet = 0 then 'danh_gia_khong_nhan_xet' end,
        case when x.btvn_dong_at is not null and x.co_btvn and x.hs_co_btvn = 0 then 'btvn' end
      ], null) as dong_ma_khong_co_du_lieu
    from x
  ),
  z as (select * from y where not v_chi_thieu or cardinality(thieu) > 0 or cardinality(dong_ma_khong_co_du_lieu) > 0),
  -- Lớp có LỊCH (TKB) trong khoảng mà buổi CHƯA MỞ — `buoi_hoc` chỉ có dòng khi đã mở.
  chua_mo as (
    select d.ngay::date as ngay, l.ten_lop, l.mon, t.gio_bat_dau
    from generate_series(v_tu::timestamp, least(v_den, v_tu + 7)::timestamp, interval '1 day') d(ngay)
    join thoi_khoa_bieu t on t.thu = extract(isodow from d.ngay)::int + 1
         and t.hieu_luc_tu <= d.ngay::date and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay::date)
    join lop l on l.id = t.lop_id and l.trang_thai = 'dang_hoc'
    where v_den - v_tu <= 7
      and (v_lop_id is null or l.id = v_lop_id)
      and (v_pv is null or l.id = any(v_pv))
      and (v_khoi is null or l.khoi = v_khoi) and (v_mon is null or l.mon = v_mon)
      and not exists (select 1 from buoi_hoc bh where bh.lop_id = t.lop_id and bh.ngay = d.ngay::date and bh.loai = 'thuong')
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('lop', v_lop->>'ten_lop', 'khoi', v_khoi, 'mon', v_mon, 'chi_buoi_co_van_de', v_chi_thieu),
    'tong', (select jsonb_build_object(
        'so_buoi_da_mo', count(*),
        'so_buoi_du_du_lieu', count(*) filter (where cardinality(thieu) = 0 and cardinality(dong_ma_khong_co_du_lieu) = 0),
        'thieu_et', count(*) filter (where 'et' = any(thieu)),
        'thieu_danh_gia', count(*) filter (where 'danh_gia' = any(thieu)),
        'thieu_mt', count(*) filter (where 'mt' = any(thieu)),
        'thieu_btvn_buoi_truoc', count(*) filter (where 'btvn_buoi_truoc' = any(thieu)),
        'chua_diem_danh_du', count(*) filter (where 'diem_danh' = any(thieu)),
        'dong_ma_khong_co_du_lieu', count(*) filter (where cardinality(dong_ma_khong_co_du_lieu) > 0)) from y),
    'theo_lop', (select coalesce(jsonb_agg(to_jsonb(g) order by g.so_buoi_co_van_de desc, g.ten_lop), '[]'::jsonb) from (
        select ten_lop, mon, count(*)::int as so_buoi,
               count(*) filter (where cardinality(thieu) > 0 or cardinality(dong_ma_khong_co_du_lieu) > 0)::int as so_buoi_co_van_de,
               count(*) filter (where 'et' = any(thieu))::int as thieu_et,
               count(*) filter (where 'danh_gia' = any(thieu))::int as thieu_danh_gia,
               count(*) filter (where 'btvn_buoi_truoc' = any(thieu))::int as thieu_btvn_buoi_truoc,
               count(*) filter (where cardinality(dong_ma_khong_co_du_lieu) > 0)::int as dong_ma_khong_co_du_lieu,
               min(ngay) filter (where cardinality(thieu) > 0 or cardinality(dong_ma_khong_co_du_lieu) > 0) as buoi_co_van_de_cu_nhat
        from y group by ten_lop, mon) g
      where not v_chi_thieu or g.so_buoi_co_van_de > 0),
    'buoi', (select coalesce(jsonb_agg(r.dong), '[]'::jsonb) from (
        select case when v_chi_tiet then jsonb_build_object(
                 'ngay', ngay, 'ten_lop', ten_lop, 'mon', mon, 'gio', to_char(gio_bat_dau, 'HH24:MI'),
                 'co_mat', co_mat, 'vang', vang, 'chua_diem_danh', chua_diem_danh,
                 'co_de_et', co_de_et, 'et_da_dong', et_dong_at is not null, 'hs_co_diem_et', hs_co_diem_et,
                 'danh_gia_da_dong', danh_gia_xong_at is not null, 'hs_co_danh_gia', hs_co_danh_gia, 'hs_co_nhan_xet', hs_co_nhan_xet,
                 'buoi_nay_co_giao_btvn', co_btvn,
                 'btvn_den_han_la_cua_buoi', truoc_ngay, 'buoi_truoc_co_giao_btvn', truoc_co_btvn,
                 'btvn_buoi_truoc_da_nhap', truoc_btvn_dong_at is not null, 'btvn_buoi_truoc_so_hs_da_nhap', truoc_hs_co_btvn,
                 'co_mt', co_mt, 'mt_da_dong', mt_dong_at is not null,
                 'thieu', thieu, 'dong_ma_khong_co_du_lieu', dong_ma_khong_co_du_lieu)
               else jsonb_build_object(
                 'ngay', ngay, 'ten_lop', ten_lop, 'thieu', thieu, 'dong_ma_khong_co_du_lieu', dong_ma_khong_co_du_lieu)
               end as dong
        from z order by ngay desc, ten_lop limit c_tran) r),
    'da_cat', (select count(*) > c_tran from z),
    'lop_co_lich_nhung_chua_mo_buoi', (select coalesce(jsonb_agg(to_jsonb(cm) order by cm.ngay, cm.gio_bat_dau), '[]'::jsonb) from chua_mo cm),
    'ghi_chu', jsonb_build_array(
      'Chỉ xét buổi THƯỜNG không bị huỷ. Buổi chỉ có dòng khi ĐÃ MỞ; lớp có lịch mà chưa mở liệt kê riêng (chỉ khi khoảng hỏi ≤ 7 ngày).',
      'thieu.et chỉ tính khi buổi CÓ đề ET gắn vào; buổi không có đề thì không đòi. thieu.danh_gia đòi ở MỌI buổi.',
      'BTVN chấm ở buổi KẾ: "btvn_buoi_truoc" = BTVN giao ở buổi trước của lớp đó, đến hạn nhập vào buổi này.',
      'dong_ma_khong_co_du_lieu = khâu đã bấm đóng nhưng hệ không có dòng dữ liệu nào (hoặc có dòng đánh giá mà không có nhận xét).',
      'Hệ KHÔNG ghi vì sao một khâu thiếu, và báo cáo dừng ở mức lớp/buổi — ai phải làm thì hỏi công cụ viec_van_hanh.',
      format('Danh sách "buoi" cắt ở %s dòng (mới nhất trước); con số ở "tong" và "theo_lop" là ĐỦ, không bị cắt. Khoảng hỏi dài hơn 7 ngày thì mỗi buổi chỉ trả phần đang thiếu — cần đủ cột thì hỏi lại theo lớp hoặc khoảng ngắn hơn.', c_tran))
  ) into v;
  return v;
end $function$;
