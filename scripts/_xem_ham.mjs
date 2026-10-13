// Xem thân hàm DB đang chạy (chỉ đọc). Chạy: node scripts/_xem_ham.mjs ten_ham [ten_ham2 …]
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
for (const n of process.argv.slice(2)) {
  const r = await c.query(`select pg_get_functiondef(p.oid) d from pg_proc p join pg_namespace s on s.oid=p.pronamespace and s.nspname='public' where p.proname=$1`, [n])
  for (const x of r.rows) console.log(`\n===== ${n} =====\n${x.d}`)
  if (!r.rowCount) console.log(`\n===== ${n} ===== (không thấy)`)
}
await c.query('ROLLBACK'); await c.end()
