import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.log('btvn_ket_qua:', (await c.query(`select column_name||':'||data_type x from information_schema.columns where table_name='btvn_ket_qua' order by ordinal_position`)).rows.map(r=>r.x).join(', '))
console.log('CHECK:', (await c.query(`select pg_get_constraintdef(oid) d from pg_constraint where conrelid='btvn_ket_qua'::regclass and contype='c'`)).rows.map(r=>r.d).join(' | '))
console.log('UNIQUE:', (await c.query(`select pg_get_constraintdef(oid) d from pg_constraint where conrelid='btvn_ket_qua'::regclass and contype='u'`)).rows.map(r=>r.d).join(' | '))
console.table((await c.query(`
select bt.ngay::date::text ngay, l.ten_lop, bt.so_cau, to_char(bt.deadline at time zone 'Asia/Ho_Chi_Minh','DD/MM HH24:MI') han,
  (select count(*) from bai_lam bl where bl.bai_test_id=bt.id and bl.trang_thai='da_nop') da_nop,
  (select count(distinct bl.hoc_sinh_id) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id=bl.id where bl.bai_test_id=bt.id and blc.verdict is not null) hs_co_do,
  (select count(*) from bai_lam_cau blc join bai_lam bl on bl.id=blc.bai_lam_id where bl.bai_test_id=bt.id and blc.verdict is not null) phep_do,
  b.id is not null co_buoi, b.btvn_dong_at is not null btvn_dong,
  (select count(*) from gami_session_problems p where p.buoi_hoc_id=b.id and p.phase='btvn') o_btvn,
  (select count(*) from gami_grades g join gami_session_problems p on p.id=g.problem_id where g.buoi_hoc_id=b.id and p.phase='btvn') diem_btvn,
  (select count(*) from btvn_ket_qua k where k.buoi_hoc_id=b.id and k.trang_thai_nop is not null) kq_nop
from bai_test bt join lop l on l.id=bt.lop_id
left join buoi_hoc b on b.lop_id=bt.lop_id and b.ngay=bt.ngay and b.trang_thai<>'huy'
where bt.loai='btvn' order by bt.ngay desc limit 12`)).rows)
await c.end()
