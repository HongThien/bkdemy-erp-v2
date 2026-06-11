-- 0016 — bổ sung trường HS: địa chỉ nhà + trường học. (ngay_nhap_hoc đã có ở 0015.)
alter table hoc_sinh add column if not exists dia_chi   text;
alter table hoc_sinh add column if not exists truong_hoc text;
