import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const r1 = await c.query(`select bt.loai, l.khoi, bc.loai_cau, count(*) n from bai_test bt join lop l on l.id=bt.lop_id join bai_test_cau bc on bc.bai_test_id=bt.id
  where l.khoi::text='12' group by 1,2,3 order by 1,3`)
console.log('LOẠI CÂU trong test lớp 12:'); console.table(r1.rows)
const r2 = await c.query(`select bt.loai, r.nguon, r.trang_thai, count(*) n from bai_test_report r join bai_lam_cau blc on blc.id=r.bai_lam_cau_id
  join bai_test_cau bc on bc.id=blc.bai_test_cau_id join bai_test bt on bt.id=bc.bai_test_id group by 1,2,3 order by 1`)
console.log('BÁO SAI đã có theo loại test:'); console.table(r2.rows)
const r3 = await c.query(`select bt.loai, bc.loai_cau, count(*) n from bai_test bt join bai_test_cau bc on bc.bai_test_id=bt.id where bt.loai='tu_luyen' group by 1,2`)
console.log('LOẠI CÂU tự luyện (mọi lớp):'); console.table(r3.rows)
await c.end()
