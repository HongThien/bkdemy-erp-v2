// Khảo sát (chỉ đọc): chủ đề Bản đồ mới theo vùng + tên CHECK của cột nhanh. Chạy: node scripts/_ks_bdm_vung.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
console.table((await c.query(`select khoi, nhanh, count(*)::int so, string_agg(ten, ' | ') ten from dai_bdm_chu_de group by 1,2 order by 1,2`)).rows.map(r => ({ ...r, ten: r.ten.slice(0, 70) })))
console.table((await c.query(`select cl.relname bang, k.conname, pg_get_constraintdef(k.oid) def from pg_constraint k join pg_class cl on cl.oid=k.conrelid where k.contype='c' and cl.relname in ('dai_bdm_chu_de','dai_bdm_chuyen_de') and pg_get_constraintdef(k.oid) ilike '%nhanh%'`)).rows)
await c.query('ROLLBACK'); await c.end()
