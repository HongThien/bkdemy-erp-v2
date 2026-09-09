import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const t0 = Date.now()
while (Date.now() - t0 < 10 * 60000) {
  const r = (await c.query(`select j.status, j.attempt, j.error, t.file_url from linkgen_jobs j join tai_lieu t on t.id=j.tai_lieu_id where t.id='5fc924b8-b961-454c-b11a-8cb4535848a5'`)).rows[0]
  if (!r || r.status === 'done' || r.status === 'failed') { console.log('9K1:', JSON.stringify(r)); break }
  await new Promise((res) => setTimeout(res, 15000))
}
await c.end()
