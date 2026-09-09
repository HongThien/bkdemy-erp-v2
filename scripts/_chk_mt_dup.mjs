import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.table((await c.query(`select t.id, t.ten, l.ten_lop, t.ngay::date::text ngay, t.nguon_id, t.created_at, t.updated_at, t.file_url is not null co_pdf,
  (select count(*) from tai_lieu_phan p join tai_lieu_cau c on c.phan_id=p.id where p.tai_lieu_id=t.id) n_cau
  from tai_lieu t left join lop l on l.id=t.lop_id where t.loai='mt_buoi' and t.created_at>='2026-09-04' order by l.ten_lop, t.created_at`)).rows.map(x=>({id:x.id.slice(0,8), lop:x.ten_lop, ngay:x.ngay, nguon:x.nguon_id?.slice(0,8), created:x.created_at.toISOString().slice(11,16), upd:x.updated_at?.toISOString().slice(11,16), pdf:x.co_pdf, n_cau:x.n_cau})))
console.table((await c.query(`select id, ten, created_at, updated_at from tai_lieu where loai='mt' and khoi::text='7' order by created_at desc limit 3`)).rows.map(x=>({id:x.id.slice(0,8), ten:x.ten, created:x.created_at.toISOString().slice(0,16)})))
console.table((await c.query(`select status, count(*) n, max(updated_at) last from linkgen_jobs group by status`)).rows)
console.log('job done gần nhất:', (await c.query(`select max(updated_at) m from linkgen_jobs where status='done'`)).rows[0].m)
console.log('tai_lieu có file_url gần nhất:', (await c.query(`select ten, updated_at from tai_lieu where file_url is not null order by updated_at desc limit 2`)).rows)
await c.end()
