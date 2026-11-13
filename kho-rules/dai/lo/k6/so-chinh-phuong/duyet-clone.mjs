// duyet-clone.mjs — Thùy 14/11 "duyệt luôn đi": duyệt 37 clone Số chính phương (clone-ma-cau.json), đã gán dạng 'nguoi' lúc ghi.
//   node kho-rules/dai/lo/k6/so-chinh-phuong/duyet-clone.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
import { readFileSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const ma = JSON.parse(readFileSync('kho-rules/dai/lo/k6/so-chinh-phuong/clone-ma-cau.json', 'utf8')).clone
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
try {
  await c.query('begin')
  const chk = (await c.query(`select count(*) n, count(*) filter(where g.nguon='nguoi' and g.dang_bai_id in ('NDB02800','NDB02801','NDB03050')) co_dang, count(*) filter(where q.nguon='clone' and q.parent_ma_cau is not null) co_cha from dai_cau_hoi q join dai_bdm_gan_cau g on g.ma_cau=q.ma_cau where q.ma_cau=any($1) and q.xoa_at is null and not q.da_duyet`, [ma])).rows[0]
  console.log('chưa duyệt, đủ điều kiện:', chk)
  if (ma.length !== 37 || Number(chk.n) !== 37 || Number(chk.co_dang) !== 37 || Number(chk.co_cha) !== 37) throw new Error('không khớp kỳ vọng 37')
  const up = await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau=any($1) and not da_duyet`, [ma])
  console.log('đã duyệt', up.rowCount)
  console.table((await c.query(`select g.dang_bai_id d, count(*) n, count(*) filter(where q.da_duyet) duyet from dai_bdm_gan_cau g join dai_cau_hoi q on q.ma_cau=g.ma_cau where g.dang_bai_id in ('NDB02800','NDB02801','NDB03050') and q.xoa_at is null group by 1 order by 1`)).rows)
  if (up.rowCount !== 37) throw new Error('duyệt ≠ 37')
  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
