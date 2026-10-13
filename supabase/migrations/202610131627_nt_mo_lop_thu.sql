-- ============================================================================
-- nt_mo_lop_thu — MỞ NÔNG TRẠI CHO ĐÚNG 1 LỚP THỬ "TEST · Toán 9" (bước 5 "hoàn thiện game", Thùy 13/10 "tiếp đi")
-- ----------------------------------------------------------------------------
-- Công tắc toàn hệ thống (tinh_nang.mo_tu) vẫn NULL = ĐÓNG với mọi lớp thật. Chỉ ghi đè theo lớp (tinh_nang_lop.mo = true) cho 1 lớp TEST
--   (2 tài khoản test) để kiểm bằng tài khoản HS thật: thăm/giúp/hái nhau, điểm học tập, xu vào ví, giới hạn giờ.
-- CẦN CẢ HAI: 'tro_choi' (ô Trò chơi ở Home HS) và 'nong_trai' (vào thẳng game).
-- HOÀN TÁC: delete from public.tinh_nang_lop where lop_id = '8030bf93-cddc-4f7e-aa4d-95200e193ebc' and ma in ('tro_choi','nong_trai');
-- ============================================================================
insert into public.tinh_nang_lop (ma, lop_id, mo)
select t.ma, '8030bf93-cddc-4f7e-aa4d-95200e193ebc'::uuid, true
from (values ('tro_choi'), ('nong_trai')) t(ma)
where exists (select 1 from public.lop where id = '8030bf93-cddc-4f7e-aa4d-95200e193ebc')
on conflict (ma, lop_id) do update set mo = true, updated_at = now();
