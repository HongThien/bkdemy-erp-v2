-- ============================================================================
-- 202610140032 — home_nhac_viec_ca_nhan_va_bo_cuc
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 14/10: Trang chính ERP thêm 2 vùng + cho mỗi người tự ẩn/hiện box.
--   (1) NHẮC VIỆC CÁ NHÂN — danh sách việc nhân sự tự ghi cho mình, tick tay, KHÔNG liên quan hệ thống,
--       reset mỗi ngày. Danh sách là cố định (mẫu lặp mỗi ngày); "xong hôm nay" là một DÒNG riêng theo
--       (việc, ngày) — thiếu dòng = chưa xong (CLAUDE.md §1.5: thiếu data = không có dòng, không NULL).
--       Qua ngày mới thì không có dòng của ngày đó ⇒ tự về trạng thái chưa xong, không cần job reset.
--   (2) BỐ CỤC HOME — nhan_su.home_bo_cuc jsonb {"an": ["tien_do","nhom:Gamification",…]}: id box người
--       này ẩn. Cùng khuôn menu_yeu_thich / erp_giao_dien (cá nhân, không nhãn môn, đi theo tài khoản).
--       Chừa chỗ cho khoá "thu_tu" (kéo thả đổi vị trí) — chưa dùng.
--   RLS: chỉ chính chủ (current_nhan_su_id()) đọc/ghi — đây là sổ nhắc riêng, quản lý cũng không xem.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ THÊM 2 bảng mới + 1 cột có default.
-- ============================================================================

create table if not exists nhan_su_nhac_viec (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references nhan_su(id) on delete cascade,
  noi_dung    text not null check (length(btrim(noi_dung)) between 1 and 200),
  thu_tu      integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists nhan_su_nhac_viec_ns_idx on nhan_su_nhac_viec (nhan_su_id, thu_tu, created_at);

create table if not exists nhan_su_nhac_viec_xong (
  nhac_viec_id uuid not null references nhan_su_nhac_viec(id) on delete cascade,
  ngay         date not null,   -- ngày VN
  created_at   timestamptz not null default now(),
  primary key (nhac_viec_id, ngay)
);

alter table nhan_su_nhac_viec      enable row level security;
alter table nhan_su_nhac_viec_xong enable row level security;

drop policy if exists nhan_su_nhac_viec_chu on nhan_su_nhac_viec;
create policy nhan_su_nhac_viec_chu on nhan_su_nhac_viec for all to authenticated
  using (nhan_su_id = public.current_nhan_su_id())
  with check (nhan_su_id = public.current_nhan_su_id());

drop policy if exists nhan_su_nhac_viec_xong_chu on nhan_su_nhac_viec_xong;
create policy nhan_su_nhac_viec_xong_chu on nhan_su_nhac_viec_xong for all to authenticated
  using (exists (select 1 from nhan_su_nhac_viec v where v.id = nhac_viec_id and v.nhan_su_id = public.current_nhan_su_id()))
  with check (exists (select 1 from nhan_su_nhac_viec v where v.id = nhac_viec_id and v.nhan_su_id = public.current_nhan_su_id()));

grant select, insert, update, delete on nhan_su_nhac_viec, nhan_su_nhac_viec_xong to authenticated;

comment on table nhan_su_nhac_viec is
  'Việc nhân sự TỰ GHI nhắc mình trên Home ERP (lặp mỗi ngày, tick tay, không liên quan hệ thống). Cá nhân, không nhãn môn.';
comment on table nhan_su_nhac_viec_xong is
  'Đã tick xong việc nhắc vào ngày VN này. Không có dòng = chưa xong (qua ngày mới tự reset).';

alter table nhan_su
  add column if not exists home_bo_cuc jsonb not null default '{}'::jsonb;
comment on column nhan_su.home_bo_cuc is
  'Bố cục Trang chính ERP của người này: {"an":[id box ẩn], "thu_tu":[id box] (chừa, chưa dùng)}. Cá nhân, không nhãn môn.';
