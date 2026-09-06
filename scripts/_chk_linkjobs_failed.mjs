import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.table((await c.query(`select j.status, j.attempt, left(j.error,110) err, t.loai, left(t.ten,30) ten, j.updated_at from linkgen_jobs j join tai_lieu t on t.id=j.tai_lieu_id where j.status in ('failed','processing') order by j.updated_at desc`)).rows.map(x=>({...x, updated_at:x.updated_at.toISOString().slice(0,16)})))
console.log('pending theo ngày:'); console.table((await c.query(`select created_at::date::text ngay, count(*) n from linkgen_jobs where status='pending' group by 1 order by 1`)).rows)
await c.end()
