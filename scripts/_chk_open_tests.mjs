import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('.env').DATABASE_URL }); await c.connect()
const r = await c.query(`
  select bt.id, bt.loai, bt.trang_thai, l.ten_lop, count(*) filter (where btc.loai_cau='trac_nghiem') as n_tn
  from bai_test bt join lop l on l.id=bt.lop_id
  left join bai_test_cau btc on btc.bai_test_id=bt.id
  where bt.trang_thai='mo'
  group by bt.id, bt.loai, bt.trang_thai, l.ten_lop
  order by bt.created_at desc limit 10
`)
console.log(r.rows)
await c.end()
