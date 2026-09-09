import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const cols = (await c.query(`select column_name from information_schema.columns where table_name='linkgen_jobs' order by ordinal_position`)).rows.map(r=>r.column_name)
console.log('linkgen_jobs cols:', cols.join(','))
const r = await c.query(`select j.*, t.ten, t.loai, l.ten_lop from linkgen_jobs j join tai_lieu t on t.id=j.tai_lieu_id left join lop l on l.id=t.lop_id where j.created_at >= '2026-09-03' order by j.created_at desc limit 12`)
console.table(r.rows.map(x=>({tl:x.tai_lieu_id.slice(0,8), ten:x.ten.slice(0,28), loai:x.loai, lop:x.ten_lop, status:x.status ?? x.trang_thai, attempts:x.attempts ?? x.so_lan, err:(x.error ?? x.loi ?? '').slice(0,160), created:x.created_at.toISOString().slice(5,16), upd:(x.updated_at??x.created_at).toISOString().slice(5,16)})))
const cols2 = (await c.query(`select column_name from information_schema.columns where table_name='hinh_linkgen_jobs' order by ordinal_position`)).rows.map(r=>r.column_name)
console.log('hinh_linkgen_jobs cols:', cols2.join(','))
const h = await c.query(`select * from hinh_linkgen_jobs where created_at >= '2026-09-03' order by created_at desc limit 8`).catch(e=>({rows:[],err:e.message}))
console.table(h.rows.map(x=>({buoi:String(x.buoi_id).slice(0,8), phan:x.phan, status:x.status, err:(x.error??'').slice(0,160), created:x.created_at?.toISOString().slice(5,16)}))); if (h.err) console.log('ERR', h.err)
await c.end()
