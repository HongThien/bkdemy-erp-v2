import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.table((await c.query(`select loai, trang_thai, count(*) n, count(deadline) co_han, count(*) filter (where deadline < now()) qua_han from bai_test group by 1,2 order by 1,2`)).rows)
console.log('giao_trinh mo, đã có bài làm:', (await c.query(`select count(distinct bt.id) n from bai_test bt join bai_lam bl on bl.bai_test_id=bt.id where bt.loai='giao_trinh' and bt.trang_thai='mo'`)).rows[0].n)
console.table((await c.query(`select l.ten_lop, t.thu, t.gio_bat_dau, t.gio_ket_thuc, t.hieu_luc_tu, t.hieu_luc_den from thoi_khoa_bieu t join lop l on l.id=t.lop_id where l.khoi::text='12' order by 1,2`)).rows)
// thử luật mới bằng SQL thuần (chưa áp): ET 12B1 ngày 23/08 → gio_ket_thuc + 15'
console.table((await c.query(`select bt.ngay::date::text ngay, l.ten_lop, bt.loai, bt.deadline, (bt.ngay::text||' '||coalesce((select gio_ket_thuc from thoi_khoa_bieu t where t.lop_id=bt.lop_id and t.thu=(case when extract(dow from bt.ngay)=0 then 8 else extract(dow from bt.ngay)+1 end) and t.hieu_luc_tu<=bt.ngay and (t.hieu_luc_den is null or bt.ngay<=t.hieu_luc_den) order by gio_ket_thuc desc limit 1), time '23:59')::text)::timestamp at time zone 'Asia/Ho_Chi_Minh' + interval '15 min' as han_moi_et from bai_test bt join lop l on l.id=bt.lop_id where bt.loai='et' order by bt.ngay desc limit 6`)).rows)
await c.end()
