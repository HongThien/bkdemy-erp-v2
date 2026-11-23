// Duyệt 6 bài chuyên đề mới HH00183–188 (Thùy 23/11 "Mày duyệt luôn"). duyet_boi để NULL (do Claude duyệt theo lệnh Thùy, không giả danh người).
//   node scripts/kho/hh-k8-duyet-6-chuyen-de-moi.mjs [--ghi]
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const MA = ['HH00183', 'HH00184', 'HH00185', 'HH00186', 'HH00187', 'HH00188']
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
await c.query('begin')
const n = (await c.query(`update hinh_hoc_bai set da_duyet = true, duyet_at = now(), duyet_boi = null where ma_bai = any($1) and khoi = '8' and not da_duyet`, [MA])).rowCount
console.log('duyệt:', n, '/ 6')
const r = (await c.query(`select ma_bai, da_duyet from hinh_hoc_bai where ma_bai = any($1) order by 1`, [MA])).rows
console.log(JSON.stringify(r))
if (n !== 6 || r.some((x) => !x.da_duyet)) { await c.query('rollback'); console.error('LỖI → ROLLBACK') ; process.exitCode = 1 }
else { await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? 'ĐÃ GHI' : '(chạy thử — ROLLBACK)') }
await c.end()
