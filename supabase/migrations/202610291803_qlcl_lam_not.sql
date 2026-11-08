-- ============================================================================
-- qlcl_lam_not — Thùy 29/10 "làm nốt" (spec-truong-khoi.md):
--  (1) Bỏ mã gõ cứng NS001/NS002 ở xếp hạng Tổng kết tuần ⇒ "không xếp hạng" = người ngồi ghế Lead / Quản lý chất lượng của
--      team qlcl (hiện = Thùy, Trang — theo GHẾ). _troly_bc_gia_dinh: IMMUTABLE → STABLE SECURITY DEFINER (đọc ghế, chạy cả lượt tự động).
--  (2) Hậu kiểm thêm 2 loại (cùng bảng hau_kiem):
--      viec_van_hanh — trưởng khối duyệt việc vận hành TA (viec_van_hanh_duyet) CÓ PHÁN ĐOÁN: chất lượng < 100 hoặc tiến độ ≠ máy đề xuất.
--                      Sửa = nhập lại chất lượng / tiến độ (giá trị cũ giữ trong ghi chú hậu kiểm).
--      ca_nhe        — ca Bổ trợ Nhẹ trưởng khối tạo. Sửa = huỷ ca (fn_btnhe_huy).
--  (3) Dòng chảy dạng yếu 1 ô (spec §4.2): Vào · Ra có bằng chứng · Ra do rớt cửa sổ · Độ phủ đo — so 2 ảnh đầu tuần gần nhất.
-- ============================================================================

-- ── (1) ──
do $$
declare d text;
begin
  select pg_get_functiondef('public._troly_bc_gia_dinh'::regproc) into d;
  if position($x$jsonb_build_array('NS001', 'NS002')$x$ in d) = 0 then raise exception '_troly_bc_gia_dinh đã đổi — dừng, xem lại'; end if;
  d := replace(d, $x$jsonb_build_array('NS001', 'NS002')$x$,
    $x$(select coalesce(jsonb_agg(distinct n.ma_ns), '[]'::jsonb) from vi_tri v join team t on t.id = v.team_id and t.ma = 'qlcl' join nhan_su n on n.id = v.nhan_su_id where not v.tk_tu_dong and v.cap in ('truong', 'pho') and n.ma_ns is not null) /* 29/10: theo ghế Lead/QLCL, thay NS001·NS002 */$x$);
  d := replace(d, E' IMMUTABLE\n', E' STABLE SECURITY DEFINER\n SET search_path TO ''public''\n');
  execute d;
end $$;

-- ── (2) ──
alter table hau_kiem drop constraint hau_kiem_loai_check;
alter table hau_kiem add constraint hau_kiem_loai_check check (loai in ('gay_ledger', 'gay_bo_qua', 'viec_van_hanh', 'ca_nhe'));

create or replace function public.fn_hau_kiem_khac(p_so_ngay integer default 7)
returns jsonb language sql stable security definer set search_path = public as $$
  select case when not public._qlcl_toan_he() then '[]'::jsonb else coalesce(jsonb_agg(x order by x->>'at' desc), '[]'::jsonb) end
  from (
    select jsonb_build_object(
      'loai', 'viec_van_hanh', 'ref_id', d.id, 'at', d.duyet_at,
      'nguoi_quyet', nq.ho_ten, 'nhan_su', ns.ho_ten,
      'mo_ta', coalesce(l.ten_lop, '?') || ' · ' || to_char(b.ngay, 'DD/MM') || ' · ' || d.tab,
      'chat_luong', d.chat_luong, 'tien_do', d.tien_do, 'tien_do_de_xuat', d.tien_do_de_xuat, 'ghi_chu', coalesce(d.ghi_chu, d.tien_do_ly_do),
      'hk', case when h.id is null then null else jsonb_build_object('ket_qua', h.ket_qua, 'ghi_chu', h.ghi_chu, 'at', h.at, 'nguoi', nh.ho_ten) end) x
    from viec_van_hanh_duyet d
    join nhan_su nq on nq.id = d.nguoi_duyet join nhan_su ns on ns.id = d.nhan_su_id
    join buoi_hoc b on b.id = d.buoi_hoc_id left join lop l on l.id = b.lop_id
    left join hau_kiem h on h.loai = 'viec_van_hanh' and h.ref_id = d.id left join nhan_su nh on nh.id = h.nguoi
    where d.duyet_at >= public._hk_tu() and public._hk_can_hau_kiem(d.nguoi_duyet)
      and (d.chat_luong < 100 or d.tien_do <> d.tien_do_de_xuat)
      and (h.id is null or h.at >= now() - make_interval(days => p_so_ngay))
    union all
    select jsonb_build_object(
      'loai', 'ca_nhe', 'ref_id', c.id, 'at', c.created_at,
      'nguoi_quyet', nq.ho_ten, 'nhan_su', null,
      'mo_ta', l.ten_lop || ' · ' || to_char(c.ngay, 'DD/MM') || ' ' || to_char(c.gio_bat_dau, 'HH24:MI') || '–' || to_char(c.gio_ket_thuc, 'HH24:MI')
               || case when c.kieu = 'sau_buoi' then ' · sau buổi' else ' · giờ khác' end,
      'hoc_sinh', (select string_agg(h2.ho_ten, ', ' order by h2.ho_ten) from buoi_hoc b2 join buoi_hoc_hs x on x.buoi_hoc_id = b2.id join hoc_sinh h2 on h2.id = x.hoc_sinh_id where b2.ca_bo_tro_nhe_id = c.id),
      'ta', ta.ho_ten, 'trang_thai', c.trang_thai,
      'hk', case when h.id is null then null else jsonb_build_object('ket_qua', h.ket_qua, 'ghi_chu', h.ghi_chu, 'at', h.at, 'nguoi', nh.ho_ten) end)
    from ca_bo_tro_nhe c
    join nhan_su nq on nq.id = c.truong_khoi_id join lop l on l.id = c.lop_id left join nhan_su ta on ta.id = c.ta_id
    left join hau_kiem h on h.loai = 'ca_nhe' and h.ref_id = c.id left join nhan_su nh on nh.id = h.nguoi
    where c.created_at >= public._hk_tu() and public._hk_can_hau_kiem(c.truong_khoi_id)
      and (h.id is null or h.at >= now() - make_interval(days => p_so_ngay))
  ) s
$$;

-- Sửa duyệt việc vận hành: ghi đè chất lượng / tiến độ + hậu kiểm 'da_sua' kèm giá trị cũ.
create or replace function public.fn_hau_kiem_sua_vvh(p_id uuid, p_chat_luong numeric, p_tien_do numeric, p_ghi_chu text)
returns void language plpgsql security definer set search_path = public as $$
declare d record;
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ Lead / Quản lý chất lượng hậu kiểm.'; end if;
  if p_chat_luong < 0 or p_chat_luong > 100 or p_tien_do < 0 or p_tien_do > 100 then raise exception 'Chất lượng / tiến độ 0–100.'; end if;
  select * into d from viec_van_hanh_duyet where id = p_id for update;
  if d.id is null then raise exception 'Không thấy lượt duyệt.'; end if;
  update viec_van_hanh_duyet set chat_luong = p_chat_luong, tien_do = p_tien_do where id = p_id;
  perform public.fn_hau_kiem_ghi('viec_van_hanh', p_id, 'da_sua',
    concat_ws(' — ', 'Chất lượng ' || d.chat_luong || '→' || p_chat_luong || ' · tiến độ ' || d.tien_do || '→' || p_tien_do, nullif(trim(coalesce(p_ghi_chu, '')), '')));
end $$;

-- fn_hau_kiem_ghi nhận đủ 4 loại (bảng đã nới CHECK; hàm không kiểm loai riêng) — giữ nguyên.

-- ── (3) Dòng chảy dạng yếu 1 ô: so ảnh đầu tuần gần nhất (T) với ảnh trước đó (T0) ──
create or replace function public.fn_qlcl_dong_chay(p_mon text, p_khoi text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_t date; v_t0 date; v_vao int; v_ra_bc int; v_ra_cs int; v_hs int; v_hs_do int;
begin
  if not public.la_thanh_vien() or not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  select max(tuan) into v_t from dang_yeu_dau_tuan where mon = p_mon;
  select max(tuan) into v_t0 from dang_yeu_dau_tuan where mon = p_mon and tuan < v_t;
  -- Độ phủ đo: % em của ô có ≥ 1 lần chấm trong 7 ngày qua (đối trọng của KPI: dạng yếu không được giảm nhờ đo ít đi)
  select count(*), count(*) filter (where exists (select 1 from gami_grades g where g.hoc_sinh_id = h.hoc_sinh_id and g.graded_at >= now() - interval '7 days'))
    into v_hs, v_hs_do from public._qlcl_hs_cua_o(p_mon, p_khoi) h;
  if v_t0 is null then
    return jsonb_build_object('tuan', v_t, 'tuan_truoc', null, 'vao', null, 'ra_bang_chung', null, 'ra_cua_so', null, 'so_hs', v_hs, 'so_hs_co_do', v_hs_do);
  end if;
  with a as (select z.hoc_sinh_id, d->>'ma_dang' ma from dang_yeu_dau_tuan z, jsonb_array_elements(z.dang) d where z.tuan = v_t0 and z.mon = p_mon and z.khoi = p_khoi),
       b as (select z.hoc_sinh_id, d->>'ma_dang' ma from dang_yeu_dau_tuan z, jsonb_array_elements(z.dang) d where z.tuan = v_t and z.mon = p_mon and z.khoi = p_khoi),
       ra as (select a.* from a where not exists (select 1 from b where b.hoc_sinh_id = a.hoc_sinh_id and b.ma = a.ma)
                and exists (select 1 from dang_yeu_dau_tuan z where z.tuan = v_t and z.mon = p_mon and z.hoc_sinh_id = a.hoc_sinh_id)),
       ra_bc as (select ra.* from ra where exists (
                  select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                   where g.hoc_sinh_id = ra.hoc_sinh_id and g.graded_at >= v_t0 and g.graded_at < v_t + 1
                     and public._do_o_bdm(p.ma_cau, p.ma_dang) = ra.ma))
  select (select count(*) from b where not exists (select 1 from a where a.hoc_sinh_id = b.hoc_sinh_id and a.ma = b.ma)),
         (select count(*) from ra_bc), (select count(*) from ra) - (select count(*) from ra_bc)
    into v_vao, v_ra_bc, v_ra_cs;
  return jsonb_build_object('tuan', v_t, 'tuan_truoc', v_t0, 'vao', v_vao, 'ra_bang_chung', v_ra_bc, 'ra_cua_so', v_ra_cs, 'so_hs', v_hs, 'so_hs_co_do', v_hs_do);
end $$;

do $$
declare f text;
begin
  foreach f in array array['public.fn_hau_kiem_khac(integer)', 'public.fn_hau_kiem_sua_vvh(uuid, numeric, numeric, text)', 'public.fn_qlcl_dong_chay(text, text)'] loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
