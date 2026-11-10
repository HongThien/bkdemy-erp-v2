// duyet.mjs — Thùy 10/11 "duyệt vào kho luôn đi": 7 câu Số chính phương (ma-cau.json) → chấp nhận dạng đề xuất (gán 'nguoi'), rút dòng đề xuất, da_duyet=true (duyet_nguon='ai').
//   node kho-rules/dai/lo/k6/so-chinh-phuong/duyet.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const ma = JSON.parse(readFileSync('kho-rules/dai/lo/k6/so-chinh-phuong/ma-cau.json', 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin')
  const ds = (await c.query(`select x.ma_cau, x.dang_bai_id from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau=x.ma_cau where x.ma_cau=any($1) and q.xoa_at is null`, [ma])).rows
  if (ds.length !== 7) throw new Error('đề xuất ' + ds.length + ' ≠ 7')
  for (const r of ds) await c.query(`select public._bdm_nguoi_gan_cau('dai',$1,$2)`, [r.ma_cau, r.dang_bai_id])
  const xo = await c.query(`delete from dai_bdm_de_xuat where ma_cau=any($1)`, [ma])
  const up = await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau=any($1) and not da_duyet`, [ma])
  console.log('rút đề xuất', xo.rowCount, '· duyệt', up.rowCount)
  const s = (await c.query(`select q.ma_cau, q.da_duyet, g.dang_bai_id, g.nguon from dai_cau_hoi q left join dai_bdm_gan_cau g on g.ma_cau=q.ma_cau where q.ma_cau=any($1) order by 1`, [ma])).rows
  console.table(s)
  if (up.rowCount !== 7 || s.some((r) => !r.da_duyet || r.nguon !== 'nguoi')) throw new Error('kết quả không như kỳ vọng')
  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
