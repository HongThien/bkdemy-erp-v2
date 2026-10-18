import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
const { rows } = await c.query(`select tgname, pg_get_triggerdef(t.oid) d from pg_trigger t where tgrelid = 'hinh_hoc_cau_hoi'::regclass and not tgisinternal`)
for (const r of rows) console.log(r.tgname, '|', r.d.slice(0, 230))
const f = await c.query(`select proname from pg_proc where proname ilike '%hinh%chuyen%dang%' or proname ilike '%hh%chuyen%'`)
console.log('hàm chuyển dạng:', f.rows.map((x) => x.proname).join(', '))
await c.end()
