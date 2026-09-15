import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const tbls = (await c.query(`select table_name from information_schema.tables where table_schema='public' and table_name like 'hinh_%' order by 1`)).rows.map(r=>r.table_name)
console.log('bảng hinh_*:', tbls.join(', '))
for (const t of ['hinh_gt_buoi','hinh_gt_bai']) if (tbls.includes(t)) {
  const cols = (await c.query(`select column_name from information_schema.columns where table_name=$1 order by ordinal_position`, [t])).rows.map(r=>r.column_name)
  console.log(t, 'cols:', cols.join(','))
}
const r = await c.query(`select b.id, l.ten_lop, b.ngay::date::text ngay, (select count(*) from hinh_gt_bai x where x.buoi_id=b.id) n_bai from hinh_gt_buoi b join lop l on l.id=b.lop_id where b.ngay>='2026-09-03' order by b.ngay desc limit 10`).catch(e=>({rows:[], err:e.message}))
console.table(r.rows); if (r.err) console.log('ERR', r.err)
console.log('cau_hinh.hinhByMa của master 0cf120be:', JSON.stringify((await c.query(`select cau_hinh->'hinhByMa' h, cau_hinh->'phanBac' pb from tai_lieu where id::text like '0cf120be%'`)).rows[0]))
await c.end()
