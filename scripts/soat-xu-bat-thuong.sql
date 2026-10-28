-- Soát bất thường sổ xu (28/10). Chạy bằng role đọc: node <script truy vấn> scripts/soat-xu-bat-thuong.sql
-- Trả 1 jsonb: lệch đích/sổ T9–T10 · cộng tay lớn/không lý do/trùng vài giây · giải thưởng trùng · nông trại/tháng · đổi quà không khớp sổ/giá/trùng · HS không học còn xu · chốt lại âm.
set statement_timeout = '120s';
with dich as (
  select '2026-09' thang, * from fn_gami_exp_xu_thang('2026-09')
  union all select '2026-10', * from fn_gami_exp_xu_thang('2026-10')
), so as (
  select hoc_sinh_id, mon, thang, sum(amount) xu from qlht_xu_ledger where loai in ('chot_thang','chot_lai') and thang >= '2026-09' group by 1,2,3
), lech as (
  select coalesce(d.hoc_sinh_id,s.hoc_sinh_id) hs, coalesce(d.mon,s.mon) mon, coalesce(d.thang,s.thang) thang, coalesce(d.xu,0) dich, coalesce(s.xu,0) da
  from dich d full join so s on s.hoc_sinh_id=d.hoc_sinh_id and s.mon is not distinct from d.mon and s.thang=d.thang
  where coalesce(d.xu,0) <> coalesce(s.xu,0)
)
select json_build_object(
 'lech_dich_vs_so', (select json_agg(x) from (select h.ho_ten, l.mon, l.thang, l.dich, l.da from lech l join hoc_sinh h on h.id=l.hs order by abs(l.dich-l.da) desc limit 20) x),
 'so_lech', (select count(*) from lech),
 'cong_tay_lon', (select json_agg(x) from (select h.ho_ten, l.amount, l.ly_do, n.ho_ten nguoi, l.created_at::date ngay from qlht_xu_ledger l join hoc_sinh h on h.id=l.hoc_sinh_id left join nhan_su n on n.id=l.nguoi_tao where l.loai in ('cong_tay','tru_tay') and abs(l.amount) >= 100 order by abs(l.amount) desc) x),
 'cong_tay_khong_ly_do', (select count(*) from qlht_xu_ledger where loai in ('cong_tay','tru_tay') and coalesce(trim(ly_do),'')=''),
 'cong_tay_theo_nguoi', (select json_agg(x) from (select n.ho_ten nguoi, count(*) n, sum(amount) filter (where amount>0) cong, sum(amount) filter (where amount<0) tru, count(distinct hoc_sinh_id) so_hs from qlht_xu_ledger l left join nhan_su n on n.id=l.nguoi_tao where loai in ('cong_tay','tru_tay') group by 1 order by 2 desc) x),
 'cong_tay_trung', (select json_agg(x) from (select h.ho_ten, l.amount, l.ly_do, count(*) n, min(l.created_at) dau, max(l.created_at) cuoi from qlht_xu_ledger l join hoc_sinh h on h.id=l.hoc_sinh_id where loai in ('cong_tay','tru_tay') group by 1,2,3, l.hoc_sinh_id having count(*)>1 and max(l.created_at)-min(l.created_at) < interval '10 minutes') x),
 'giai_thuong_trung', (select json_agg(x) from (select hoc_sinh_id, ref_id, count(*) n from qlht_xu_ledger where loai='giai_thuong' group by 1,2 having count(*)>1) x),
 'giai_thuong_ly_do', (select json_agg(x) from (select ly_do, count(*) n, count(distinct hoc_sinh_id) hs from qlht_xu_ledger where loai='giai_thuong' group by 1) x),
 'nong_trai_thang', (select json_agg(x) from (select h.ho_ten, l.thang, sum(l.amount) xu, count(*) n from qlht_xu_ledger l join hoc_sinh h on h.id=l.hoc_sinh_id where loai='nong_trai' group by 1,2, l.hoc_sinh_id order by 3 desc limit 5) x),
 'doi_qua_khong_khop', (select json_agg(x) from (
    select d.id, d.trang_thai, d.xu_tru, (select sum(amount) from qlht_xu_ledger l where l.ref_id=d.id and l.loai='doi_qua') tru,
           (select sum(amount) from qlht_xu_ledger l where l.ref_id=d.id and l.loai='hoan') hoan
    from qlht_doi_qua d) x where coalesce(tru,0) <> -xu_tru or coalesce(hoan,0) <> case when trang_thai='huy' then xu_tru else 0 end),
 'doi_qua_gia_lech', (select json_agg(x) from (select q.ten, q.gia_xu, d.so_luong, d.xu_tru, count(*) n from qlht_doi_qua d join qlht_qua q on q.id=d.qua_id where d.xu_tru <> q.gia_xu*d.so_luong group by 1,2,3,4) x),
 'doi_qua_trung', (select json_agg(x) from (select h.ho_ten, q.ten, count(*) n, min(d.created_at) dau, max(d.created_at) cuoi from qlht_doi_qua d join hoc_sinh h on h.id=d.hoc_sinh_id join qlht_qua q on q.id=d.qua_id where d.trang_thai<>'huy' group by 1,2,d.hoc_sinh_id,d.qua_id having count(*)>1 and max(d.created_at)-min(d.created_at) < interval '2 minutes') x),
 'hs_khong_hoc_co_xu', (select json_agg(x) from (select h.ho_ten, h.trang_thai, v.so_du, (select max(created_at)::date from qlht_xu_ledger l where l.hoc_sinh_id=h.id and l.amount>0) lan_cuoi_cong from qlht_v_so_du_xu v join hoc_sinh h on h.id=v.hoc_sinh_id where h.trang_thai <> 'dang_hoc' and v.so_du <> 0 order by v.so_du desc) x),
 'chot_lai_am_lon', (select json_agg(x) from (select h.ho_ten, l.mon, l.thang, l.amount, l.exp_snapshot, l.created_at from qlht_xu_ledger l join hoc_sinh h on h.id=l.hoc_sinh_id where loai='chot_lai' and amount <= -5 order by amount limit 15) x),
 'chot_lai_am_theo_ngay', (select json_agg(x) from (select (created_at at time zone 'Asia/Ho_Chi_Minh')::date ngay, count(*) n, sum(amount) xu, count(distinct hoc_sinh_id) hs from qlht_xu_ledger where loai='chot_lai' and amount<0 group by 1 order by 1) x)
)::text
