import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const t0 = Date.now()
while (Date.now() - t0 < 25 * 60000) {
  const r = (await c.query(`select left(t.ten,34) ten, t.mon, j.status, j.attempt, left(j.error,50) err, t.file_url is not null pdf from linkgen_jobs j join tai_lieu t on t.id=j.tai_lieu_id where t.loai='mt' and t.ten ilike '%tháng 8%' order by t.ten`)).rows
  if (r.every((x) => x.status === 'done' || x.status === 'failed')) { console.log(JSON.stringify(r)); break }
  await new Promise((res) => setTimeout(res, 20000))
}
console.log('kết thúc chờ MT')
await c.end()
