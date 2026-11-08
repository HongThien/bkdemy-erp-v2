-- XOAY + ĐỔI CHỖ ẢNH BÀI NỘP BTVN (CEO 08/11/2026: "PH hoặc TA đẩy nhầm thứ tự ảnh / ảnh chụp ngang").
-- Ảnh gốc KHÔNG bị sửa (bằng chứng): chỉ lưu GÓC XOAY để hiển thị (xoay) + THỨ TỰ hiển thị (thu_tu — danh tính
-- ảnh là id, CLAUDE.md §2). Máy chấm cũng tự đặt thứ tự + góc xoay khi chấm (scripts/btvn-ai/ghi.mjs gọi 2 hàm này).
-- Bản TA đã vẽ (path_cham) được ghép từ ảnh ĐÃ XOAY ⇒ đứng sẵn; góc xoay chỉ áp cho ảnh gốc khi chưa có path_cham.

alter table btvn_nop_anh add column if not exists xoay smallint not null default 0;
alter table btvn_nop_anh drop constraint if exists btvn_nop_anh_xoay_check;
alter table btvn_nop_anh add constraint btvn_nop_anh_xoay_check check (xoay in (0, 90, 180, 270));

-- Đặt góc xoay (độ, theo chiều kim đồng hồ) để ảnh gốc hiện đứng đúng chiều.
create or replace function public.fn_btvn_anh_xoay(p_anh_id uuid, p_goc integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  if p_goc not in (0, 90, 180, 270) then raise exception 'Góc xoay chỉ 0/90/180/270.'; end if;
  update btvn_nop_anh set xoay = p_goc where id = p_anh_id and bo_at is null;
  if not found then raise exception 'Không thấy ảnh.'; end if;
end $$;
revoke execute on function public.fn_btvn_anh_xoay(uuid, integer) from public, anon;
grant execute on function public.fn_btvn_anh_xoay(uuid, integer) to authenticated;

-- Đổi chỗ ảnh với ảnh liền trước (p_huong = -1) / liền sau (+1) trong xấp ảnh của cùng HS × buổi.
-- Đánh số lại 1..n theo thứ tự hiện tại trước khi đổi (thu_tu có thể trùng/nhảy cóc sau gộp/bỏ ảnh).
create or replace function public.fn_btvn_anh_doi_cho(p_anh_id uuid, p_huong integer)
returns void language plpgsql security definer set search_path = public as $$
declare a record; v_vt integer; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  if p_huong not in (-1, 1) then raise exception 'Hướng chỉ -1 hoặc 1.'; end if;
  select * into a from btvn_nop_anh where id = p_anh_id and bo_at is null;
  if a is null then raise exception 'Không thấy ảnh.'; end if;
  perform 1 from btvn_nop_anh where hoc_sinh_id = a.hoc_sinh_id and buoi_hoc_id = a.buoi_hoc_id for update;

  with ds as (
    select id, row_number() over (order by thu_tu, created_at, id) as vt
    from btvn_nop_anh where hoc_sinh_id = a.hoc_sinh_id and buoi_hoc_id = a.buoi_hoc_id and bo_at is null)
  update btvn_nop_anh x set thu_tu = ds.vt from ds where x.id = ds.id;

  select thu_tu into v_vt from btvn_nop_anh where id = p_anh_id;
  select count(*) into v_n from btvn_nop_anh where hoc_sinh_id = a.hoc_sinh_id and buoi_hoc_id = a.buoi_hoc_id and bo_at is null;
  if v_vt + p_huong < 1 or v_vt + p_huong > v_n then return; end if;   -- đã ở đầu/cuối
  update btvn_nop_anh set thu_tu = v_vt
  where hoc_sinh_id = a.hoc_sinh_id and buoi_hoc_id = a.buoi_hoc_id and bo_at is null and thu_tu = v_vt + p_huong;
  update btvn_nop_anh set thu_tu = v_vt + p_huong where id = p_anh_id;
end $$;
revoke execute on function public.fn_btvn_anh_doi_cho(uuid, integer) from public, anon;
grant execute on function public.fn_btvn_anh_doi_cho(uuid, integer) to authenticated;

-- App PH (FDW) thấy góc xoay: thêm cột CUỐI view (create or replace chỉ thêm được ở cuối, giữ quyền cũ).
-- 0 khi đã có bản chấm (path_cham đứng sẵn). App PH cần đọc cột này để xoay ảnh — việc của repo bkdemy-ph.
create or replace view public.v_btvn_tra_anh as
  select a.hoc_sinh_id, a.buoi_hoc_id, a.thu_tu, coalesce(a.path_cham, a.path) as path,
         case when a.path_cham is null then a.xoay else 0 end::smallint as xoay
  from btvn_nop_anh a
  join btvn_nop n on n.hoc_sinh_id = a.hoc_sinh_id and n.buoi_hoc_id = a.buoi_hoc_id
  where n.tra_at is not null and a.bo_at is null;

-- Máy chấm cần biết góc xoay hiện tại (để không xoay chồng): thêm 'xoay' vào danh sách ảnh.
create or replace function public.fn_btvn_ai_du_lieu(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select jsonb_build_object(
    'lop', l.ten_lop, 'khoi', l.khoi, 'mon', l.mon, 'ngay', b.ngay,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'problem_id', sp.id, 'so', sp.problem_no, 'ma_cau', sp.ma_cau, 'ma_dang', sp.ma_dang,
        'hinh', sp.hinh_baitoan_id is not null, 'hinh_nhan', sp.hinh_nhan,
        'loai_cau', coalesce(d.loai_cau, k.loai_cau),
        'de_bai', coalesce(d.noi_dung, k.noi_dung),
        'lua_chon', coalesce(d.lua_chon, k.lua_chon),
        'menh_de', coalesce(d.menh_de, k.menh_de),
        'dap_an', coalesce(d.dap_an, k.dap_an),
        'loi_giai', coalesce(d.loi_giai, k.loi_giai)) order by sp.problem_no)
      from gami_session_problems sp
      left join dai_cau_hoi d on l.mon = 'Toán' and d.ma_cau = sp.ma_cau
      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau
      where sp.buoi_hoc_id = b.id and sp.phase = 'btvn' and not sp.ngoai_de), '[]'::jsonb),
    'anh', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'path', a.path, 'xoay', a.xoay) order by a.thu_tu, a.created_at)
      from btvn_nop_anh a where a.buoi_hoc_id = b.id and a.hoc_sinh_id = p_hoc_sinh_id and a.bo_at is null), '[]'::jsonb))
  into v
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.id = p_buoi_hoc_id;
  if v is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  return v;
end $$;
