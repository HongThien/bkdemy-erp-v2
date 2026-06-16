-- Elo + EXP TÁCH THEO MÔN (Thùy chốt): mỗi HS có Elo riêng từng môn. Backfill môn từ buổi→lớp (data cũ = Toán).
-- gami_elo: thêm mon, đổi unique (hoc_sinh_id) → (hoc_sinh_id, mon).
alter table gami_elo_history add column if not exists mon text;
update gami_elo_history h set mon = l.mon
  from buoi_hoc b join lop l on l.id = b.lop_id where b.id = h.buoi_hoc_id and h.mon is null;

alter table gami_exp_ledger add column if not exists mon text;
update gami_exp_ledger x set mon = l.mon
  from buoi_hoc b join lop l on l.id = b.lop_id where b.id = x.ref_buoi_hoc_id and x.mon is null;

alter table gami_elo add column if not exists mon text;
update gami_elo e set mon = (
  select h.mon from gami_elo_history h where h.hoc_sinh_id = e.hoc_sinh_id and h.mon is not null
  order by h.created_at desc limit 1
) where e.mon is null;
update gami_elo set mon = 'Toán' where mon is null; -- fallback (HS có elo nhưng chưa có history)
alter table gami_elo alter column mon set not null;
alter table gami_elo drop constraint if exists gami_elo_hoc_sinh_id_key;
alter table gami_elo add constraint gami_elo_hs_mon_key unique (hoc_sinh_id, mon);
