-- 0056 — CHIỀU MÔN Ở NHÂN SỰ: tài khoản nhân sự phân môn (scope④).
-- Thùy chốt: môn vào NGƯỜI (n-n, nhiều môn) → nền cho org-chart-theo-môn + gate kho/tài liệu theo môn.
-- STRICT: chưa gán môn → không thấy môn nào (admin la_admin_he_thong bypass ở client).
create table if not exists nhan_su_mon (
  nhan_su_id uuid not null references nhan_su(id) on delete cascade,
  mon        text not null,                       -- giá trị thuộc MON_LIST (Toán/KHTN/Tiếng Anh/Văn)
  primary key (nhan_su_id, mon)
);
alter table nhan_su_mon enable row level security;
create policy nhan_su_mon_member_all on nhan_su_mon for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on nhan_su_mon to authenticated;
