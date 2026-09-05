import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.table((await c.query(`
select bt.ngay::date::text ngay, l.ten_lop, bt.so_cau, bt.co_nhieu_ma_de,
  (select count(*) from bai_lam bl where bl.bai_test_id=bt.id and bl.trang_thai='da_nop') da_nop,
  (select count(*) from bai_lam_cau blc join bai_lam bl on bl.id=blc.bai_lam_id where bl.bai_test_id=bt.id and blc.verdict is not null) phep_do,
  b.id is not null as co_buoi, b.et_dong_at is not null as et_dong,
  (select count(*) from gami_session_problems p where p.buoi_hoc_id=b.id and p.phase='et') o_et,
  (select count(*) from gami_session_problems p where p.buoi_hoc_id=b.id and p.phase='et' and p.ma_cau is not null) o_co_ma_cau,
  (select count(*) from gami_grades g join gami_session_problems p on p.id=g.problem_id where g.buoi_hoc_id=b.id and p.phase='et') diem_et,
  (select count(*) from bai_test_cau bc where bc.bai_test_id=bt.id and bc.bien_the=1 and bc.ma_cau is null) cau_khong_ma
from bai_test bt join lop l on l.id=bt.lop_id
left join buoi_hoc b on b.lop_id=bt.lop_id and b.ngay=bt.ngay and b.trang_thai<>'huy'
where bt.loai='et' order by bt.ngay desc`)).rows)
// khớp ma_cau giữa ô ET và câu snapshot cho test gần nhất có buổi
console.table((await c.query(`
select bt.ngay::date::text ngay, l.ten_lop, count(distinct bc.ma_cau) cau_test, count(distinct p.ma_cau) o_buoi,
  count(distinct bc.ma_cau) filter (where p.ma_cau is not null) khop
from bai_test bt join lop l on l.id=bt.lop_id
join bai_test_cau bc on bc.bai_test_id=bt.id and bc.bien_the=1
left join buoi_hoc b on b.lop_id=bt.lop_id and b.ngay=bt.ngay and b.trang_thai<>'huy'
left join gami_session_problems p on p.buoi_hoc_id=b.id and p.phase='et' and p.ma_cau=bc.ma_cau
where bt.loai='et' group by 1,2 order by 1 desc`)).rows)
await c.end()
