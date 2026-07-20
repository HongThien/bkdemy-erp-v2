-- 0103 — Phân công OPS theo CA TRỰC (Sáng/Chiều/Tối), THAY THẾ mô hình cũ "1 slot TKB = 1 người trực"
-- (bảng phan_cong_ops) — Thùy 07-19: "Phân công ops phải theo ca trực, không phải theo từng lớp trong
-- TKB. Trong ca trực sẽ bao gồm các lớp nằm trong thời gian của ca, hệ thống tự fill." Ca CỐ ĐỊNH: Sáng
-- 08:00-12:00 · Chiều 14:00-18:00 · Tối 18:00-21:30 (xem CA_TRUC_DEF trong opsvanhanh.ts — nguồn chuẩn).
--
-- Pure-derive: KHÔNG lưu quan hệ ca↔lớp tĩnh. Hệ thống tự suy "lớp nào thuộc ca nào" từ gio_bat_dau của
-- thoi_khoa_bieu tại thời điểm truy vấn — đổi TKB (thêm/sửa lớp) tự động vào đúng ca, KHÔNG cần re-fill.
--
-- ⚠ bảng phan_cong_ops CŨ GIỮ NGUYÊN — KHÔNG xoá, KHÔNG migrate dữ liệu tự động (nhiều slot cùng ca có
-- thể đang gán KHÁC người nhau — phải người thật chọn 1 người thắng, không tự suy được). Sau khi Thùy
-- phân công lại toàn bộ qua màn Ops mới, hỏi lại có drop phan_cong_ops hay không (Luật xoá).
create table if not exists phan_cong_ca (
  id uuid primary key default gen_random_uuid(),
  thu smallint not null check (thu between 2 and 8),
  ca text not null check (ca in ('sang', 'chieu', 'toi')),
  nhan_su_id uuid not null references nhan_su(id),
  hieu_luc_tu date not null,
  hieu_luc_den date,
  created_at timestamptz not null default now()
);
create index if not exists idx_phan_cong_ca_thu_ca on phan_cong_ca(thu, ca);
create index if not exists idx_phan_cong_ca_nhan_su on phan_cong_ca(nhan_su_id);
