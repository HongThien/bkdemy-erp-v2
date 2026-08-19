-- ============================================================================
-- THU HẸP QUYỀN ĐỌC CỦA ROLE `fdw_bkdemy_web` — 30 bảng → 4 bảng.
--
-- BỐI CẢNH (đo 15/08): role này là đường FDW cho hệ `bkdemy-web` đọc sang ERP.
-- Nó đang được cấp SELECT trên **30 bảng**, trong khi web CHỈ khai báo 4 foreign table
-- (`erp_lop`, `erp_muc_hoc_phi`, `erp_nhan_su`, `erp_phan_cong_lop` — dựng view
-- `erp_fdw_live_gv_gia`, tức "giáo viên + giá"). Grep toàn bộ repo bkdemy-web: KHÔNG có
-- một chỗ nào chạm `hoa_don`.
--
-- ⇒ 26 bảng cấp thừa, chưa từng dùng, gồm những thứ nặng nhất:
--    · hoa_don (234) · hoa_don_dong (686)        — hoá đơn & dòng thu tiền
--    · phu_huynh · hoc_sinh · hoc_sinh_he_so     — thông tin cá nhân
--    · gami_grades · diem_thi · buoi_danh_gia · btvn_ket_qua · bt_grades — điểm & nhận xét
--    · bao_cao_ph                                — nhận xét gửi phụ huynh
--    · dai_cau_hoi · dai_ban_do · tai_lieu_cau · tai_lieu_phan — kho câu hỏi, nội dung tài liệu
--    · bai_lam · bai_lam_cau · bai_test · bai_test_cau — bài làm + ĐỀ KÈM ĐÁP ÁN test online
--
-- ⚠ PHẢI GỠ CẢ HAI TẦNG. Policy và GRANT là hai cổng độc lập:
--   gỡ policy mà còn GRANT thì bảng nào RLS chưa bật vẫn đọc được; gỡ GRANT mà còn policy
--   thì cấp lại GRANT là hở ngay. Ở đây còn lệch nhau thật: `bao_cao_ph` có GRANT nhưng
--   KHÔNG có policy — nếu chỉ xoá policy thì bảng đó lọt lưới hoàn toàn.
--
-- KHÔNG đụng dữ liệu. Chỉ đổi ai đọc được.
-- Đảo lại được: cấp lại GRANT + tạo lại policy là về như cũ.
-- ============================================================================

do $$
declare
  -- Giữ ĐÚNG 4 bảng web thật sự nhập. Thêm bảng mới cho web thì thêm vào đây, đừng cấp lẻ.
  giu text[] := array['lop', 'muc_hoc_phi', 'nhan_su', 'phan_cong_lop'];
  t record;
begin
  -- ① Gỡ POLICY fdw_* trên mọi bảng ngoài danh sách giữ
  for t in
    select tablename, policyname from pg_policies
    where schemaname = 'public' and policyname like 'fdw_bkdemy_web%'
      and tablename <> all(giu)
  loop
    execute format('drop policy %I on public.%I', t.policyname, t.tablename);
    raise notice 'đã gỡ policy % trên %', t.policyname, t.tablename;
  end loop;

  -- ② Thu hồi GRANT trên mọi bảng ngoài danh sách giữ
  for t in
    select table_name from information_schema.role_table_grants
    where grantee = 'fdw_bkdemy_web' and table_schema = 'public'
      and table_name <> all(giu)
    group by table_name
  loop
    execute format('revoke all on public.%I from fdw_bkdemy_web', t.table_name);
    raise notice 'đã thu hồi GRANT trên %', t.table_name;
  end loop;
end $$;

-- ③ Chốt lại: 4 bảng giữ phải còn NGUYÊN quyền đọc, không được sứt trong lúc dọn.
do $$
declare thieu text;
begin
  select string_agg(x, ', ') into thieu from unnest(array['lop','muc_hoc_phi','nhan_su','phan_cong_lop']) x
  where not exists (
    select 1 from information_schema.role_table_grants
    where grantee='fdw_bkdemy_web' and table_schema='public' and table_name=x and privilege_type='SELECT');
  if thieu is not null then
    raise exception 'HỎNG: web mất quyền đọc bảng đang dùng: %', thieu;
  end if;
end $$;
