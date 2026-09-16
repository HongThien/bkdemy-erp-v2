-- ============================================================================
-- fn_test_dau_vao_thong_ke — THỐNG KÊ số ca test đầu vào (tab "Thống kê" cạnh "Phân công", CEO 15/09).
-- ----------------------------------------------------------------------------
-- Đếm ở Postgres (§2.0), client chỉ gọi + render. Lọc: môn (bắt buộc) · tháng 'YYYY-MM' (null = mọi tháng) ·
-- khối (null = mọi khối). Nhóm: chưa chọn khối ⇒ mỗi dòng = 1 khối; đã chọn khối ⇒ mỗi dòng = 1 tháng.
-- Luôn kèm dòng 'Tổng' cuối. Cột: tong · dang_test · hoan_thanh (đã điểm danh xong) · cho_cham · da_cham ·
-- cho_tra · da_tra · da_vao_lop (ứng viên đã convert thành HS). Ngày = ca_test.ngay (ngày VN, cột date).
-- MẤT GÌ (Luật xoá): không — chỉ create function + grant.
-- ============================================================================
create or replace function public.fn_test_dau_vao_thong_ke(p_mon text, p_thang text default null, p_khoi text default null)
returns table (nhom text, tong integer, dang_test integer, hoan_thanh integer, cho_cham integer, da_cham integer,
               cho_tra integer, da_tra integer, da_vao_lop integer)
language sql stable as $$
  with ca as (
    select ct.id, ct.trang_thai, ct.cham_xong_at, ct.tra_bai_xong_at, uv.khoi, uv.trang_thai as uv_tt,
           to_char(ct.ngay, 'YYYY-MM') as thang
    from public.ca_test ct join public.ung_vien uv on uv.id = ct.ung_vien_id
    where ct.mon = p_mon
      and (p_thang is null or to_char(ct.ngay, 'YYYY-MM') = p_thang)
      and (p_khoi is null or uv.khoi = p_khoi)
  ),
  g as (
    select case when p_khoi is null then coalesce(khoi, '?') else thang end as nhom,
           count(*)::int as tong,
           (count(*) filter (where trang_thai = 'dang_test'))::int as dang_test,
           (count(*) filter (where trang_thai = 'hoan_thanh'))::int as hoan_thanh,
           (count(*) filter (where trang_thai = 'hoan_thanh' and cham_xong_at is null))::int as cho_cham,
           (count(*) filter (where cham_xong_at is not null))::int as da_cham,
           (count(*) filter (where cham_xong_at is not null and tra_bai_xong_at is null))::int as cho_tra,
           (count(*) filter (where tra_bai_xong_at is not null))::int as da_tra,
           (count(*) filter (where uv_tt = 'da_convert'))::int as da_vao_lop
    from ca group by 1
  ),
  all_rows as (
    select * from g
    union all
    select 'Tổng', coalesce(sum(tong), 0)::int, coalesce(sum(dang_test), 0)::int, coalesce(sum(hoan_thanh), 0)::int,
           coalesce(sum(cho_cham), 0)::int, coalesce(sum(da_cham), 0)::int, coalesce(sum(cho_tra), 0)::int,
           coalesce(sum(da_tra), 0)::int, coalesce(sum(da_vao_lop), 0)::int
    from g
  )
  select * from all_rows
  order by (nhom = 'Tổng'), nullif(regexp_replace(nhom, '\D', '', 'g'), '')::bigint nulls last, nhom;
$$;
grant execute on function public.fn_test_dau_vao_thong_ke(text, text, text) to authenticated;
