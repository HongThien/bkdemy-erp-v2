-- DỌN (13/11/2026) — Thùy gật "cái gì thừa xoá đi".
-- (1) 25 bảng chung kho_<họ> RỖNG: dựng tối 13/11 để gộp bằng partition, đã tách hết phần ở mig 202611132053, không hàm / view / khoá ngoại nào còn nhắc.
--     KHÔNG đụng kho_cau_dang (bảng tra đang chạy), kho_cau_log, kho_cau_khuon_log.
-- (2) 4 index *_khoa_trung_idx dựng sai biểu thức ('s+' thay vì '\s+', mig 202611112136) — chưa từng được dùng; bản đúng *_khoa_trung2_idx đã có (mig 202611131843).
set local lock_timeout = '5s';
do $k$
declare r record; n bigint;
begin
  for r in select unnest(array['kho_ban_do', 'kho_bdm_cau_thieu_dang', 'kho_bdm_chu_de', 'kho_bdm_chuyen_de', 'kho_bdm_dang_bai', 'kho_bdm_de_xuat', 'kho_bdm_gan_cau', 'kho_bdm_kiem_mau', 'kho_bdm_log', 'kho_bdm_nhom', 'kho_bdm_nhom_tien_de', 'kho_bdm_o', 'kho_bdm_tu_choi', 'kho_cau_form_tn', 'kho_cau_hoi', 'kho_cau_hoi_yeu_cau_giai', 'kho_chuyen_de_ly_thuyet', 'kho_cum_bai', 'kho_cum_tien_de', 'kho_dang_ly_thuyet', 'kho_dang_tien_de', 'kho_de_xuat', 'kho_de_xuat_cau', 'kho_de_xuat_quyet_dinh', 'kho_mcq_rule']) t loop
    if exists (select 1 from pg_inherits i where i.inhparent = ('public.' || r.t)::regclass) then raise exception 'dọn: % còn phần — dừng', r.t; end if;
    execute format('select count(*) from public.%I', r.t) into n;
    if n > 0 then raise exception 'dọn: % còn % dòng — dừng', r.t, n; end if;
  end loop;
end
$k$;
drop table public.kho_ban_do;
drop table public.kho_bdm_cau_thieu_dang;
drop table public.kho_bdm_chu_de;
drop table public.kho_bdm_chuyen_de;
drop table public.kho_bdm_dang_bai;
drop table public.kho_bdm_de_xuat;
drop table public.kho_bdm_gan_cau;
drop table public.kho_bdm_kiem_mau;
drop table public.kho_bdm_log;
drop table public.kho_bdm_nhom;
drop table public.kho_bdm_nhom_tien_de;
drop table public.kho_bdm_o;
drop table public.kho_bdm_tu_choi;
drop table public.kho_cau_form_tn;
drop table public.kho_cau_hoi;
drop table public.kho_cau_hoi_yeu_cau_giai;
drop table public.kho_chuyen_de_ly_thuyet;
drop table public.kho_cum_bai;
drop table public.kho_cum_tien_de;
drop table public.kho_dang_ly_thuyet;
drop table public.kho_dang_tien_de;
drop table public.kho_de_xuat;
drop table public.kho_de_xuat_cau;
drop table public.kho_de_xuat_quyet_dinh;
drop table public.kho_mcq_rule;

drop index if exists public.dai_cau_hoi_khoa_trung_idx;
drop index if exists public.hgt_cau_hoi_khoa_trung_idx;
drop index if exists public.hinh_hoc_cau_hoi_khoa_trung_idx;
drop index if exists public.khtn_cau_hoi_khoa_trung_idx;
