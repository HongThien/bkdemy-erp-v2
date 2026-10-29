// ap-dung.mjs — áp .fix.json của lượt rà clone DeepSeek (29/10) vào dai_cau_hoi. Chỉ clone (nguon='clone'), UPDATE noi_dung/dap_an/loi_giai.
//   node kho-rules/dai/lo/k6/ra-nang-cao/ap-dung.mjs [--ghi]      (d232: KHÔNG áp — clone đúng, agent chỉ đổi đề cho khớp khuôn)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k6/ra-nang-cao/'
const GHI = process.argv.includes('--ghi')
const fix = ['d365', 'd367'].flatMap((f) => JSON.parse(readFileSync(D + f + '.fix.json', 'utf8')))
for (const x of fix) for (const e of x.kiem ?? []) { const r = (0, eval)(e); if (r !== true) { console.error('✘ kiem', x.ma_cau, e, r); process.exit(3) } }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin'); let n = 0
  for (const x of fix) n += (await c.query(`update dai_cau_hoi set noi_dung=$2, dap_an=$3, loi_giai=$4 where ma_cau=$1 and nguon='clone' and xoa_at is null`, [x.ma_cau, x.noi_dung, x.dap_an, x.loi_giai])).rowCount
  console.log('sửa', n, '/', fix.length, fix.map((x) => x.ma_cau).join(' '))
  if (n !== fix.length) throw new Error('lệch số câu')
  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
