import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = readFileSync(join(root, '.env'), 'utf8')
const url = (env.match(/^\s*DATABASE_URL_RO\s*=\s*(.+?)\s*$/m) ?? env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m))?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url })
await c.connect()
const { rows } = await c.query(`select ma_cau, noi_dung from public.dai_cau_hoi where noi_dung ilike '%thích hợp vào chỗ chấm%' or noi_dung ilike '%Điền kí hiệu%' limit 10`)
for (const r of rows) { console.log('=== ' + r.ma_cau + ' ==='); console.log(JSON.stringify(r.noi_dung)); console.log() }
console.log('total', rows.length)
await c.end()
