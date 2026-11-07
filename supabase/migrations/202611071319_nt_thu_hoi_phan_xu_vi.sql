-- Thu hồi phân bón bước 3: trừ xu ví thật (xu đã vào ví nhưng game không còn đỡ sau khi rút EXP/xu game).
alter table nt_thu_hoi_phan
  add column if not exists xu_vi_tru integer not null default 0,     -- xu đã trừ khỏi qlht_xu_ledger (số dương)
  add column if not exists xu_vi_xong boolean not null default false; -- đã chạy bước 3 cho em này (chống chạy 2 lần)
