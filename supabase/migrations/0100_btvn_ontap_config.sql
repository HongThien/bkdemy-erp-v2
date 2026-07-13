-- 0100 — btvn_ontap_config: cấu hình khối ÔN TẬP của BTVN (spec-btvn-ontap.md, Thùy chốt 07-13).
-- Config sống Ở BẢNG RIÊNG (không nhét cau_hinh của doc) vì trichXuatBuoi là XOÁ-RỒI-TẠO khi
-- re-trích — config trong doc sẽ bay theo doc. Key = (nguon_id, nguon_buoi, lop_id): master ×
-- buổi-trong-master × lớp (tai_lieu đã có sẵn 2 cột nguon_id/nguon_buoi trên doc trích → tra ngược được).
-- LƯU Ý kiểm chứng 07-13: tai_lieu_phan KHÔNG có CHECK constraint trên loai_phan (spec gốc tưởng có)
-- → giá trị mới 'ontap' dùng thẳng, không cần ALTER gì.
create table if not exists btvn_ontap_config (
  id uuid primary key default gen_random_uuid(),
  nguon_id uuid not null references tai_lieu(id) on delete cascade,
  nguon_buoi text not null,
  lop_id uuid not null references lop(id) on delete cascade,
  config jsonb not null default '{}'::jsonb, -- { dangs: [{ma_dang, cau_ids[], linesByCau{}}], skipped }
  updated_by uuid,
  updated_at timestamptz not null default now(),
  unique (nguon_id, nguon_buoi, lop_id)
);
alter table btvn_ontap_config enable row level security;
drop policy if exists btvn_ontap_config_member_all on btvn_ontap_config;
create policy btvn_ontap_config_member_all on btvn_ontap_config for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on btvn_ontap_config to authenticated;
