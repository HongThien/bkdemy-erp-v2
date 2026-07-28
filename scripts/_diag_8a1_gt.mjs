import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const lopId = '1c813018-8ce0-45c1-b3c4-e2fd6ce8cee3'
const { rows } = await c.query(`select loai, ngay::text, ten, nguon_buoi, created_at from tai_lieu where lop_id=$1 and loai in ('giao_trinh_buoi','btvn') and (ngay in ('2026-07-23','2026-08-23')) order by created_at`, [lopId])
console.log('GT + BTVN docs quanh 23/07 & 23/08:'); for (const r of rows) console.log(` ${r.loai.padEnd(16)} ngay=${r.ngay} nguon_buoi=${r.nguon_buoi} | ${r.ten}`)
// nguon_buoi = a2f57265... from config; check its ngay in buoi_hoc? Actually nguon_buoi is master marker. 
console.log('\nBuổi 8A1 tháng 7-8:')
const { rows: b } = await c.query(`select id, ngay::text, trang_thai from buoi_hoc where lop_id=$1 and ngay between '2026-07-20' and '2026-08-25' order by ngay`, [lopId])
console.log(b)
await c.end()
