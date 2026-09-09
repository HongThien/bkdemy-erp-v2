-- Sĩ số tối đa MỖI LỚP theo bậc/hệ (Thùy 22/08): hệ S = 20. Bậc khác NULL = chưa giới hạn.
-- Màn Lớp hiện "sĩ số / tối đa" + cảnh báo (đỏ) khi lớp vượt.
alter table public.lop_bac add column if not exists si_so_toi_da smallint;
update public.lop_bac set si_so_toi_da = 20 where ma = 'S';
