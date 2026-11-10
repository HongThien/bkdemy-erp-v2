-- ============================================================================
-- 202611091507 — ta_cong_duyet_theo_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 09/11 "đưa việc duyệt công trợ giảng về trưởng khối cho đúng flow vận hành" (spec-truong-khoi: trưởng khối quyết,
--   Trang hậu kiểm). Trước: chỉ người giữ lá ta_cong_duyet (Thùy · Trang · Lộc) duyệt — Trang tự tay duyệt ~544 dòng tháng 10–11.
-- LUẬT:
--   • Mỗi dòng việc suy ra (môn, khối) — theo thứ tự: lớp · ca trực bổ trợ · buổi (lớp hoặc ca của buổi) · ca trực DUY NHẤT của TA
--     ngày đó (bổ trợ định kì cũ chưa gắn ca; nhiều ca khác khối ⇒ không đoán, để trống — §1.5).
--   • Ai có (môn, khối) đó trong fn_pham_vi_cua_toi() (trưởng khối · trưởng bộ môn của môn · QLCL toàn hệ) duyệt / từ chối được,
--     TRỪ công của chính mình (trưởng khối cũng là TA ⇒ công của họ lên trưởng bộ môn). Ô chưa có trưởng khối ⇒ trưởng bộ môn (đã có
--     trong phạm vi môn).
--   • Ca có mặt (giờ vào/ra): duyệt / chốt giờ được khi MỌI việc còn hiệu lực trong ca thuộc phạm vi mình (và không phải ca của mình).
--     Ca trộn việc 2 khối / việc không có khối (chấm thi, họp, khác, ôn thi chung) ⇒ người giữ ta_cong_duyet như cũ.
--   • Người giữ ta_cong_duyet (Trang · Lộc · Thùy) vẫn duyệt được MỌI dòng = hậu kiểm + phần chung. Thiếu công / nhập hộ / lương: giữ nguyên.
-- MẤT GÌ: không xoá gì. Thêm 4 hàm. Viết lại (create or replace) fn_ta_duyet_cong · fn_ta_doi_chieu · fn_ta_chot_gio ·
--   fn_ta_chot_gio_theo_viec — chữ ký giữ nguyên, nhánh người giữ ta_cong_duyet chạy y như cũ.
-- ============================================================================

-- ── 1. (môn|khối) của một dòng việc — null = không thuộc khối nào ──
create or replace function public._ta_cong_viec_o(p_viec uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select l.mon || '|' || l.khoi from lop l where l.id = cv.lop_id and l.khoi is not null),
    (select c.mon || '|' || c.khoi from ca_bo_tro c where c.id = cv.ca_bo_tro_id and c.khoi is not null),
    (select coalesce(l2.mon || '|' || l2.khoi, c2.mon || '|' || c2.khoi)
       from buoi_hoc b left join lop l2 on l2.id = b.lop_id left join ca_bo_tro c2 on c2.id = b.ca_bo_tro_id where b.id = cv.buoi_hoc_id),
    case when cv.loai_viec = 'bo_tro_dinh_ki' and cv.ca_bo_tro_id is null then
      (select min(s.o) from (select c.mon || '|' || c.khoi o from ca_bo_tro c
                              where c.ngay = cv.ngay and c.trang_thai = 'mo' and c.khoi is not null
                                and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)) s
        having count(distinct s.o) = 1)
    end)
  from ta_cong_viec cv where cv.id = p_viec
$$;

-- ── 2. Phạm vi của người đang đăng nhập dạng 'môn|khối' (một lần mỗi lệnh, khỏi gọi fn_pham_vi_cua_toi từng dòng) ──
create or replace function public._ta_cong_pham_vi()
returns text[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(p.mon || '|' || p.khoi), '{}') from public.fn_pham_vi_cua_toi() p
$$;

-- ── 3. Được duyệt dòng việc / ca này không (người không giữ ta_cong_duyet) ──
create or replace function public._ta_cong_duoc_viec(p_viec uuid, p_pv text[], p_me uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from ta_cong_viec cv where cv.id = p_viec and cv.nhan_su_id is distinct from p_me
                   and public._ta_cong_viec_o(cv.id) = any (p_pv))
$$;

create or replace function public._ta_cong_duoc_ca(p_ca uuid, p_pv text[], p_me uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from ta_cham_cong cc where cc.id = p_ca and cc.nhan_su_id is distinct from p_me)
     and exists (select 1 from ta_cong_viec v where v.cham_cong_id = p_ca and v.trang_thai <> 'tu_choi')
     and not exists (select 1 from ta_cong_viec v where v.cham_cong_id = p_ca and v.trang_thai <> 'tu_choi'
                       and not public._ta_cong_duoc_viec(v.id, p_pv, p_me))
$$;

-- ── 4. Duyệt / từ chối ──
create or replace function public.fn_ta_duyet_cong(p_ca uuid[], p_viec uuid[], p_ket_qua text, p_ly_do text default null)
returns integer language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); v_n integer; v_m integer; v_pv text[]; v_sai int;
begin
  if not public.co_quyen_ghi('ta_cong_duyet') then
    v_pv := public._ta_cong_pham_vi();
    if cardinality(v_pv) = 0 then raise exception 'Không có quyền duyệt công'; end if;
    select count(*) into v_sai from unnest(coalesce(p_viec, '{}')) x(id) where not public._ta_cong_duoc_viec(x.id, v_pv, v_me);
    if v_sai > 0 then raise exception '% việc ngoài phạm vi duyệt của bạn (khác khối, không thuộc khối nào, hoặc công của chính bạn)', v_sai; end if;
    select count(*) into v_sai from unnest(coalesce(p_ca, '{}')) x(id) where not public._ta_cong_duoc_ca(x.id, v_pv, v_me);
    if v_sai > 0 then raise exception '% ca có mặt ngoài phạm vi duyệt của bạn (ca có việc khối khác / việc chung, hoặc ca của chính bạn)', v_sai; end if;
  end if;
  if p_ket_qua not in ('da_duyet', 'tu_choi') then raise exception 'Kết quả duyệt không hợp lệ'; end if;
  if p_ket_qua = 'tu_choi' and btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Từ chối phải có lý do'; end if;
  if p_ket_qua = 'da_duyet' and exists (select 1 from ta_cham_cong where id = any(coalesce(p_ca, '{}')) and ra_at is null and ra_chot is null) then
    raise exception 'Có ca chưa có giờ ra — chốt giờ trước khi duyệt';
  end if;
  update ta_cham_cong set duyet = p_ket_qua, duyet_boi = v_me, duyet_at = now(), ly_do_duyet = p_ly_do
   where id = any(coalesce(p_ca, '{}')) and duyet <> p_ket_qua;
  get diagnostics v_n = row_count;
  update ta_cong_viec set trang_thai = p_ket_qua, duyet_boi = v_me, duyet_at = now(), ly_do_duyet = p_ly_do
   where id = any(coalesce(p_viec, '{}')) and trang_thai <> p_ket_qua;
  get diagnostics v_m = row_count;
  return v_n + v_m;
end $$;

-- ── 5. Đối chiếu: người giữ ta_cong_duyet thấy hết như cũ; trưởng khối/bộ môn thấy việc mình duyệt được + ca chứa chúng ──
create or replace function public.fn_ta_doi_chieu(p_tu date, p_den date default null)
returns table(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date, vao_at timestamptz, ra_at timestamptz,
              vao_chot timestamptz, ra_chot timestamptz, quen_ra boolean, khai_bu boolean, nguon text, loai_viec text, ten_loai text,
              lop_id uuid, ten_lop text, gio_bat_dau time, gio_ket_thuc time, hoc_sinh text, ghi_chu text, khop boolean, co text[],
              lam_ho text, duyet text, ly_do_duyet text)
language plpgsql stable security definer set search_path = public as $$
declare v_pv text[]; v_me uuid := public.current_nhan_su_id();
begin
  if public.co_chuc_nang('ta_cong_duyet') then
    return query select * from public._ta_doi_chieu(p_tu, p_den, null);
    return;
  end if;
  v_pv := public._ta_cong_pham_vi();
  if cardinality(v_pv) = 0 then raise exception 'Không có quyền xem đối chiếu công'; end if;
  return query select d.* from public._ta_doi_chieu(p_tu, p_den, null) d
   where (d.loai_dong = 'viec' and public._ta_cong_duoc_viec(d.id, v_pv, v_me))
      or (d.loai_dong = 'ca' and exists (select 1 from ta_cong_viec v where v.cham_cong_id = d.id and public._ta_cong_duoc_viec(v.id, v_pv, v_me)));
end $$;

-- ── 6. Dòng nào người đang đăng nhập được duyệt — null = mọi dòng (người giữ ta_cong_duyet). Màn duyệt dùng để bật ô chọn. ──
create or replace function public.fn_ta_cong_duoc_duyet(p_tu date, p_den date default null)
returns uuid[] language plpgsql stable security definer set search_path = public as $$
declare v_pv text[]; v_me uuid := public.current_nhan_su_id(); v_den date := coalesce(p_den, p_tu);
begin
  if public.co_quyen_ghi('ta_cong_duyet') then return null; end if;
  v_pv := public._ta_cong_pham_vi();
  if cardinality(v_pv) = 0 then return '{}'; end if;
  return coalesce((select array_agg(x.id) from (
      select cv.id from ta_cong_viec cv where cv.ngay between p_tu and v_den and public._ta_cong_duoc_viec(cv.id, v_pv, v_me)
      union all
      select cc.id from ta_cham_cong cc where cc.ngay between p_tu and v_den and public._ta_cong_duoc_ca(cc.id, v_pv, v_me)) x), '{}');
end $$;

-- ── 7. Chốt giờ ca quên checkout: thêm người duyệt được ca đó ──
create or replace function public.fn_ta_chot_gio(p_id uuid, p_vao timestamptz, p_ra timestamptz)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (public.co_quyen_ghi('ta_cong_duyet') or public._ta_cong_duoc_ca(p_id, public._ta_cong_pham_vi(), public.current_nhan_su_id())) then
    raise exception 'Không có quyền chốt giờ';
  end if;
  if p_ra <= p_vao then raise exception 'Giờ ra phải sau giờ vào'; end if;
  update ta_cham_cong set vao_chot = p_vao, ra_chot = p_ra, trang_thai = 'xong' where id = p_id;
  if not found then raise exception 'Không thấy ca'; end if;
end $$;

create or replace function public.fn_ta_chot_gio_theo_viec(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare c ta_cham_cong; v_bd time; v_kt time; v_vao timestamptz; v_ra timestamptz;
begin
  if not (public.co_quyen_ghi('ta_cong_duyet') or public._ta_cong_duoc_ca(p_id, public._ta_cong_pham_vi(), public.current_nhan_su_id())) then
    raise exception 'Không có quyền chốt giờ';
  end if;
  select * into c from ta_cham_cong where id = p_id for update;
  if c.id is null then raise exception 'Không thấy ca'; end if;
  select min(v.gio_bat_dau), max(v.gio_ket_thuc) into v_bd, v_kt
    from ta_cong_viec v where v.cham_cong_id = p_id and v.trang_thai <> 'tu_choi' and v.gio_bat_dau is not null and v.gio_ket_thuc is not null;
  if v_kt is null then raise exception 'Ca này chưa có việc nào có giờ — chốt giờ tay'; end if;
  v_vao := least(c.vao_at, (c.ngay + v_bd) at time zone 'Asia/Ho_Chi_Minh');
  v_ra  := (c.ngay + v_kt) at time zone 'Asia/Ho_Chi_Minh';
  if v_ra <= v_vao then raise exception 'Việc cuối kết thúc trước giờ vào — chốt giờ tay'; end if;
  update ta_cham_cong set vao_chot = v_vao, ra_chot = v_ra, trang_thai = 'xong' where id = p_id;
  return jsonb_build_object('vao', to_char(v_vao at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), 'ra', to_char(v_ra at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'));
end $$;

revoke execute on function public._ta_cong_viec_o(uuid), public._ta_cong_pham_vi(), public._ta_cong_duoc_viec(uuid, text[], uuid),
  public._ta_cong_duoc_ca(uuid, text[], uuid), public.fn_ta_cong_duoc_duyet(date, date) from public, anon;
grant execute on function public.fn_ta_cong_duoc_duyet(date, date) to authenticated;
