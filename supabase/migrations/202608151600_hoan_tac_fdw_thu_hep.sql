-- ============================================================================
-- HOÀN TÁC `202608151030_fdw_web_thu_hep.sql` — trả role `fdw_bkdemy_web` về NGUYÊN TRẠNG.
--
-- LÝ DO: sau khi thu hẹp 30 → 4 bảng, app phụ huynh báo lỗi tra cứu tài khoản (CEO, 15/08).
--
-- ⚠ SAI Ở ĐÂU: tao kết luận "web chỉ dùng 4 bảng" từ việc GREP REPO `bkdemy-web` — chỉ thấy
--   4 foreign table khai trong file .sql. Nhưng foreign table tạo thẳng qua Supabase Dashboard
--   (hoặc ở project khác) thì KHÔNG nằm trong repo ⇒ grep không thấy. "Không thấy trong repo"
--   KHÔNG PHẢI bằng chứng "không dùng" — đúng lớp lỗi CLAUDE.md §2.1 đã ghi cho ca "0 dòng".
--   Cách kiểm ĐÚNG lẽ ra là hỏi chính DB: quan sát query thật của role đó (pg_stat_statements /
--   log), hoặc thu hẹp TỪNG BẢNG MỘT rồi chờ, chứ không cắt 26 bảng trong một nhát.
--
-- Khôi phục ĐÚNG hiện trạng trước migration: 30 bảng có GRANT SELECT, 29 bảng có policy
-- (riêng `bao_cao_ph` vốn CÓ grant mà KHÔNG có policy — giữ nguyên sự lệch đó, không "sửa
-- cho đẹp", vì đây là lượt hoàn tác chứ không phải lượt thiết kế).
-- ============================================================================

-- ① Trả lại GRANT SELECT trên 26 bảng đã thu hồi
grant select on public.bai_lam, public.bai_lam_cau, public.bai_test, public.bai_test_cau,
  public.bao_cao_ph, public.bt_grades, public.btvn_ket_qua, public.buoi_danh_gia,
  public.buoi_hoc, public.buoi_hoc_hs, public.dai_ban_do, public.dai_cau_hoi,
  public.diem_thi, public.gami_grades, public.gami_session_problems,
  public.hoa_don, public.hoa_don_dong, public.hoc_sinh, public.hoc_sinh_he_so,
  public.hoc_sinh_lop, public.ky_thi, public.phu_huynh,
  public.tai_lieu, public.tai_lieu_cau, public.tai_lieu_phan, public.thoi_khoa_bieu
  to fdw_bkdemy_web;

-- ② Trả lại POLICY. Hai tên khác nhau theo đúng bản gốc: `_select` cho nhóm dựng sớm,
--    `_read` cho nhóm còn lại. Giữ nguyên tên cũ để lần sau so sánh còn khớp.
do $$
declare
  t text;
  ds_select text[] := array['hoc_sinh_lop', 'thoi_khoa_bieu'];   -- lop/muc_hoc_phi/nhan_su/phan_cong_lop chưa bị gỡ
  ds_read text[] := array[
    'bai_lam','bai_lam_cau','bai_test','bai_test_cau','bt_grades','btvn_ket_qua',
    'buoi_danh_gia','buoi_hoc','buoi_hoc_hs','dai_ban_do','dai_cau_hoi','diem_thi',
    'gami_grades','gami_session_problems','hoa_don','hoa_don_dong','hoc_sinh',
    'hoc_sinh_he_so','ky_thi','phu_huynh','tai_lieu','tai_lieu_cau','tai_lieu_phan'];
begin
  foreach t in array ds_select loop
    execute format('drop policy if exists fdw_bkdemy_web_select on public.%I', t);
    execute format('create policy fdw_bkdemy_web_select on public.%I for select to fdw_bkdemy_web using (true)', t);
  end loop;
  foreach t in array ds_read loop
    execute format('drop policy if exists fdw_bkdemy_web_read on public.%I', t);
    execute format('create policy fdw_bkdemy_web_read on public.%I for select to fdw_bkdemy_web using (true)', t);
  end loop;
end $$;

-- ③ Chốt: phải về đúng 30 bảng có grant như trước khi thu hẹp.
do $$
declare n int;
begin
  select count(distinct table_name) into n from information_schema.role_table_grants
  where grantee='fdw_bkdemy_web' and table_schema='public';
  if n <> 30 then
    raise exception 'HOÀN TÁC CHƯA ĐỦ: mới có % bảng, kỳ vọng 30', n;
  end if;
end $$;
