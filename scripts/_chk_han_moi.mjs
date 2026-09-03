import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const lop = (await c.query(`select id, ten_lop from lop where ten_lop in ('12A1','12B1') order by ten_lop`)).rows
for (const l of lop) for (const [ngay, loai] of [['2026-09-03','et'],['2026-09-06','et'],['2026-09-03','giao_trinh'],['2026-09-03','btvn'],['2026-01-01','et']]) {
  const r = await c.query(`select han_nop_bai_test($1,$2,$3) at time zone 'Asia/Ho_Chi_Minh' as han`, [l.id, ngay, loai])
  console.log(l.ten_lop, ngay, loai.padEnd(10), '→', r.rows[0].han)
}
console.table((await c.query(`select loai, count(*) n, count(deadline) co_han, count(*) filter (where deadline < now()) qua_han from bai_test where trang_thai='mo' group by 1 order by 1`)).rows)
await c.end()
