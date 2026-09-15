import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.table((await c.query(`select l.ten_lop, bt.ngay::date::text ngay, to_char(bt.deadline at time zone 'Asia/Ho_Chi_Minh','DD/MM HH24:MI') han, bt.deadline < now() qua_han
  from bai_test bt join lop l on l.id=bt.lop_id where bt.loai='btvn' and bt.trang_thai='mo' order by bt.ngay desc`)).rows)
const arg = process.argv[2]
if (arg === 'fn') {
  const lop = (await c.query(`select id, ten_lop from lop where ten_lop in ('12A1','12B1') order by ten_lop`)).rows
  for (const l of lop) for (const ngay of ['2026-09-03','2026-09-06','2026-01-01'])
    console.log(l.ten_lop, ngay, 'btvn →', (await c.query(`select to_char(han_nop_bai_test($1,$2,'btvn') at time zone 'Asia/Ho_Chi_Minh','DD/MM HH24:MI') h`, [l.id, ngay])).rows[0].h)
}
await c.end()
