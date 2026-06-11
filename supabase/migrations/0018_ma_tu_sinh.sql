-- 0018 — mã người-đọc TỰ SINH (gần nhất +1) cho nhân sự + học sinh, giống ma_ph (0017).
create sequence if not exists ns_seq;
alter table nhan_su add column if not exists ma_ns text unique default ('NS' || lpad(nextval('ns_seq')::text, 3, '0'));
update nhan_su set ma_ns = ('NS' || lpad(nextval('ns_seq')::text, 3, '0')) where ma_ns is null; -- backfill người đã nhập

create sequence if not exists hs_seq;
alter table hoc_sinh alter column ma_hs set default ('HS' || lpad(nextval('hs_seq')::text, 4, '0'));
update hoc_sinh set ma_hs = ('HS' || lpad(nextval('hs_seq')::text, 4, '0')) where ma_hs is null;
