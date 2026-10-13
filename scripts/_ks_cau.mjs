// Xem thô 1 câu (chỉ đọc). node scripts/_ks_cau.mjs hinh_hoc_cau_hoi HHC002386
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const [tbl, ma] = process.argv.slice(2)
if (!/^[a-z_]+$/.test(tbl)) throw new Error('tên bảng')
const r = (await c.query(`select * from ${tbl} where ma_cau = $1`, [ma])).rows[0]
for (const [k, v] of Object.entries(r)) if (v != null && v !== '') console.log(`── ${k} ──\n${typeof v === 'object' ? JSON.stringify(v) : v}\n`)
await c.query('ROLLBACK'); await c.end()
