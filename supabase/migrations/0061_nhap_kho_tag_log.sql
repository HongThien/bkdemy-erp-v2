-- 0061 — LUỒNG NHẬP KHO (ingest-first): log gán dạng + mô tả ngắn dạng.
-- (1) mo_ta_ngan: định nghĩa 1 dòng/dạng, distill từ lý thuyết, CACHE → nạp vào prompt phân loại (grounded
--     classify, ~0 token biên). Sinh/ sửa khi viết lý thuyết. Áp cho cả Toán (dai_) lẫn KHTN (khtn_).
-- (2) kho_tag_log: append-only, ghi lúc ĐẨY KHO. 1 bảng phục vụ CẢ:
--     · precision@1 = count(final=ai) / count(*)  (đo độ chính xác AI gán dạng)
--     · nguồn vòng-học = các dòng final<>ai (cặp nhầm) → distiller sau (khi đủ volume).
--     §1.5-ok: dòng chỉ sinh khi có sự kiện THẬT (1 đề xuất + 1 quyết định), KHÔNG NULL rác.
alter table dai_ban_do  add column if not exists mo_ta_ngan text;
alter table khtn_ban_do add column if not exists mo_ta_ngan text;

create table if not exists kho_tag_log (
  id            uuid primary key default gen_random_uuid(),
  mon           text not null,                         -- 'toan' | 'khtn' (dispatch kho)
  ma_cau        text,                                  -- câu đã lưu (null nếu bỏ qua trước khi lưu)
  loai_field    text not null default 'dang',          -- 'dang' | 'loai_cau'
  ai_value      text,                                  -- AI đề xuất (ma_dang / loai_cau); null = AI không đoán được
  final_value   text,                                  -- người chốt
  ai_confidence real,                                  -- 0..1 (null với loai_cau)
  da_verify     boolean not null default false,        -- có chạy verify lý thuyết không
  nguoi_id      uuid,                                  -- ai duyệt (nhan_su.id)
  created_at    timestamptz not null default now()
);
create index if not exists kho_tag_log_mon_idx on kho_tag_log (mon, loai_field);

alter table kho_tag_log enable row level security;
create policy kho_tag_log_member_all on kho_tag_log
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on kho_tag_log to authenticated;
