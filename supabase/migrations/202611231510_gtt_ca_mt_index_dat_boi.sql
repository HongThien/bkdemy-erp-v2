-- K7 (mọi khoá ngoại có index): gtt_ca_mt.dat_boi → nhan_su chưa có index (cổng check:kien-truc báo +1 sau mig 202611231505).
create index if not exists gtt_ca_mt_dat_boi_idx on public.gtt_ca_mt (dat_boi);
