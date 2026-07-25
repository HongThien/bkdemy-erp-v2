import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const lopId = '1c813018-8ce0-45c1-b3c4-e2fd6ce8cee3'
const { rows: tkb } = await c.query(`select thu, gio_bat_dau::text, hieu_luc_tu::text, hieu_luc_den::text from thoi_khoa_bieu where lop_id=$1 order by thu`, [lopId])
console.log('TKB 8A1 (thu: 2=T2..8=CN):', tkb)
// dow of 23/07 and 23/08 (0=Sun..6=Sat in JS; here compute via pg)
const { rows: dows } = await c.query(`select '2026-07-23'::date d1, extract(dow from '2026-07-23'::date) w1, '2026-08-23'::date d2, extract(dow from '2026-08-23'::date) w2`)
console.log('DOW (0=CN,1=T2..6=T7):', dows[0])
await c.end()
