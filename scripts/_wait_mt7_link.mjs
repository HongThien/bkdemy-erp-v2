import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const t0 = Date.now()
while (Date.now() - t0 < 20 * 60000) {
  const r = (await c.query(`select j.status, j.error, t.file_url is not null co_pdf, l.ten_lop from linkgen_jobs j join tai_lieu t on t.id=j.tai_lieu_id join lop l on l.id=t.lop_id where t.loai='mt_buoi' and t.created_at>='2026-09-04' order by l.ten_lop`)).rows
  const s = (await c.query(`select status, count(*) n from linkgen_jobs group by status order by status`)).rows.map(x=>`${x.status}=${x.n}`).join(' ')
  if (r.every((x) => x.status === 'done' || x.status === 'failed')) { console.log('MT jobs:', JSON.stringify(r), '| tổng:', s); break }
  await new Promise((res) => setTimeout(res, 20000))
}
console.log('kết thúc chờ')
await c.end()
