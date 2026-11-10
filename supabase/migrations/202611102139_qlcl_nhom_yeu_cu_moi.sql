-- ============================================================================
-- 202611102139 — qlcl_nhom_yeu_cu_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 10/11, xem box "Học sinh yếu" ở Phòng trưởng khối): "Chỉ cần 3 cột kia là được. Nhưng phải tách ra 2 phần riêng:
--   phần cũ đang xử lý và nhóm mới thêm do học kiến thức tuần này. Học sinh bổ trợ được 1 nhóm yếu nhưng đi học kiến thức mới lại có
--   2 nhóm yếu thì hệ thống không thể hiện là thêm 1 nhóm yếu được. Phải hiện cột riêng."
-- ⇒ So TẬP nhóm, không so SỐ nhóm (CLAUDE.md §2 "cảnh báo lệch phải so NỘI DUNG"). Mỗi em:
--     A = nhóm yếu lúc đầu tuần (dang_yeu_dau_tuan, tuần này) · B = nhóm yếu hiện tại (dang_yeu_hien_tai)
--     CŨ đang xử lý = B ∩ A (đã yếu từ đầu tuần, vẫn còn yếu) · MỚI tuần này = B \ A (đầu tuần chưa yếu, giờ yếu)
--     (A \ B = đã gỡ — chưa hiện, Thùy chưa yêu cầu; trả kèm số tổng để sau dùng.)
--   Mỗi phần đếm số EM theo số nhóm: ≥3 · 2 · 1 — đếm riêng từng cột. 1 em có thể nằm ở cả 2 phần (vd cũ 1 + mới 2).
--   Ô chưa có ảnh đầu tuần ⇒ không tách được ⇒ cột cũ/mới trả NULL (màn ghi "chưa chốt"), không đoán.
--   Lưu ý tuần này: ảnh đầu tuần chụp 09/11 theo luật cũ (nhóm CÓ dạng yếu) ⇒ A rộng hơn ⇒ "mới" tuần này có thể thấp hơn thật; từ tuần sau cùng luật.
-- Vẫn chỉ đọc 2 bảng chụp — không tính mastery lúc mở (§2.0).
--
-- MẤT GÌ (Luật xoá): DROP + tạo lại fn_qlcl_nhom_yeu() vì đổi kiểu trả về (create or replace không đổi được cột trả).
--   Chỉ là hàm đọc, không dữ liệu nào mất; người gọi duy nhất = src/lib/qlcl.ts (sửa cùng đợt). _dy_so_nhom giữ nguyên.
-- ============================================================================

-- tập nhóm (khác nhau) trong 1 danh sách dạng yếu; dạng không quy được nhóm thì là nhóm của chính nó (cùng luật _dy_so_nhom)
create or replace function public._dy_nhom_ds(p_dang jsonb)
returns text[] language sql stable set search_path to 'public' as $$
  select coalesce(array_agg(distinct coalesce(hh.ma_bai, db.nhom_id, e->>'ma_dang')), '{}')
    from jsonb_array_elements(coalesce(p_dang, '[]'::jsonb)) e
    left join hinh_hoc_bai hh on hh.ma_bai = e->>'ma_dang'
    left join dai_bdm_dang_bai db on db.id = e->>'ma_dang'
$$;
revoke execute on function public._dy_nhom_ds(jsonb) from public, anon;

drop function if exists public.fn_qlcl_nhom_yeu();
create function public.fn_qlcl_nhom_yeu()
returns table(mon text, khoi text, so_hs integer, so_hs_yeu integer,
              so_nhom_yeu integer, dau_tuan_nhom_yeu integer, co_anh_dau_tuan boolean,
              cu_3 integer, cu_2 integer, cu_1 integer,
              moi_3 integer, moi_2 integer, moi_1 integer, so_nhom_da_go integer)
language sql stable security definer set search_path to 'public' as $$
  with o as (select p.mon, p.khoi from public.fn_pham_vi_cua_toi() p where public.la_thanh_vien()),
  co_anh as (select distinct z.mon, z.khoi from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay()),
  hs as (select o.mon, o.khoi, h.hoc_sinh_id from o cross join lateral public._qlcl_hs_cua_o(o.mon, o.khoi) h),
  em as (   -- mỗi em: tập nhóm hiện tại (b) · tập nhóm đầu tuần (a)
    select hs.mon, hs.khoi, hs.hoc_sinh_id,
           public._dy_nhom_ds(d.dang) b,
           public._dy_nhom_ds(z.dang) a,
           (d.hoc_sinh_id is not null) co_ht, (z.hoc_sinh_id is not null) co_dt
      from hs
      left join dang_yeu_hien_tai d on d.mon = hs.mon and d.hoc_sinh_id = hs.hoc_sinh_id
      left join dang_yeu_dau_tuan z on z.tuan = public._qlcl_tuan_nay() and z.mon = hs.mon and z.khoi = hs.khoi and z.hoc_sinh_id = hs.hoc_sinh_id
     where d.hoc_sinh_id is not null or z.hoc_sinh_id is not null
  ),
  dem as (
    select em.mon, em.khoi, em.co_ht, em.co_dt,
           cardinality(em.b) n_ht, cardinality(em.a) n_dt,
           (select count(*) from unnest(em.b) x where x = any(em.a))::int n_cu,
           (select count(*) from unnest(em.b) x where not (x = any(em.a)))::int n_moi,
           (select count(*) from unnest(em.a) x where not (x = any(em.b)))::int n_go
      from em
  )
  select o.mon, o.khoi,
         (select count(*)::int from hs where hs.mon = o.mon and hs.khoi = o.khoi),
         (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_ht > 0),
         (select coalesce(sum(n_ht), 0)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi),
         case when ca.mon is not null then (select coalesce(sum(n_dt), 0)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi) end,
         ca.mon is not null,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_cu >= 3) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_cu = 2) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_cu = 1) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_moi >= 3) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_moi = 2) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_moi = 1) end,
         case when ca.mon is not null then (select coalesce(sum(n_go), 0)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi) end
    from o left join co_anh ca on ca.mon = o.mon and ca.khoi = o.khoi
   order by o.mon, o.khoi
$$;
revoke execute on function public.fn_qlcl_nhom_yeu() from public, anon;
grant execute on function public.fn_qlcl_nhom_yeu() to authenticated;
