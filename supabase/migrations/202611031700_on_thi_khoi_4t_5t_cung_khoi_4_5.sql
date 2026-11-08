-- ============================================================================
-- on_thi_khoi_4t_5t_cung_khoi_4_5
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 03/11: "đẩy các đề thi giữa kì khối 4 5 lên app của các khối 4 5 4T 5T"): box Ôn thi chỉ cho HS thấy đề ĐÚNG KHỐI
--   (tai_lieu.khoi = khối của lớp em). Lớp 4T / 5T có khoi = '4T' / '5T' ⇒ không bao giờ khớp đề khối '4' / '5' (đề trường ra cho cả khối).
-- SỬA: _hs_on_thi_khoi trả '4' cho em lớp 4T và '5' cho em lớp 5T (cùng chương trình khối 4 / 5). Chỉ 2 khối này — 8T… giữ nguyên.
--   Hàm chỉ được 4 hàm Ôn thi dùng (fn_hs_on_thi_ds / _xem / _luyen_sinh · fn_hs_thi_thu_bat_dau); các hàm đó so khối với tai_lieu.khoi nên tự đúng.
-- MẤT GÌ (Luật xoá): không mất gì — create or replace 1 hàm. Đề vẫn phải ĐƯỢC DUYỆT (fn_de_thi_duyet) mới hiện cho HS.
-- ============================================================================

create or replace function public._hs_on_thi_khoi(p_mon text)
returns text language sql stable security definer set search_path to 'public' as $$
  select case when l.khoi in ('4T', '5T') then left(l.khoi, 1) else l.khoi end
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1
$$;
