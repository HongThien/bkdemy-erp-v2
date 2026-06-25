-- 0053 — Tuyển sinh: lead có thể là HS CŨ học thêm môn (vd đang học Toán → đăng ký Văn).
-- hoc_sinh_goc_id = HS sẵn có. Convert KHÔNG tạo HS/PH mới, chỉ ghi danh HS này vào lớp môn mới.
alter table ung_vien
  add column if not exists hoc_sinh_goc_id uuid references hoc_sinh(id) on delete set null;
