// day-vao-ban-do.mjs — Thùy 13/11 "Check giải đề thi cuối kì. Đẩy vào bản đồ khối 6".
//   Check: 217 câu có đáp số giải MÙ bằng 6 agent Sonnet (215 khớp, 2 cần ảnh) + 49 câu tự luận/Đ-S Opus soát (47 đúng, 2 cần ảnh); 0 câu sai.
//   Đẩy: (1) 3 câu gán lệch (ℤ nhưng nằm dạng số tự nhiên) → dạng Số nguyên; (2) duyệt 24 câu đã qua check chưa duyệt (duyet_nguon='ai').
//   node kho-rules/dai/lo/k6/ckk-check/day-vao-ban-do.mjs [--ghi]   (mặc định ROLLBACK)
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const DOI = { T106000000033: 'NDB01300', T106000000288: 'NDB01294', T106000000487: 'NDB01315' }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const ten = Object.fromEntries((await q(`select id,ten from dai_bdm_dang_bai where id=any($1)`, [Object.values(DOI)])).map((r) => [r.id, r.ten]))
  console.log('dạng đích:', ten)
  if (Object.keys(ten).length !== 3) throw new Error('thiếu dạng đích')
  for (const [ma, dang] of Object.entries(DOI)) await c.query(`select public._bdm_nguoi_gan_cau('dai',$1,$2)`, [ma, dang])
  // 24 câu chưa duyệt đã gán, thuộc đề cuối kì, đã qua check (không nằm trong danh sách cần ảnh)
  const CAN_ANH = ['T106000000626', 'T106000000641', 'T106000000642', 'T106000000651']
  const ds = (await q(`select c.ma_cau from dai_cau_hoi c where c.ma_cau like 'T106%' and c.xoa_at is null and (c.ten_de_goc ilike '%cuối%kì%' or c.ten_de_goc ilike '%CKI%') and not c.da_duyet and exists(select 1 from dai_bdm_gan_cau g where g.ma_cau=c.ma_cau) and not (c.ma_cau=any($1))`, [CAN_ANH])).map((r) => r.ma_cau)
  console.log('duyệt:', ds.length, 'câu')
  if (ds.length !== 24) throw new Error('kỳ vọng 24, có ' + ds.length)
  const up = await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau=any($1) and not da_duyet`, [ds])
  console.log('đã duyệt', up.rowCount)
  console.table(await q(`select c.ma_cau, g.dang_bai_id, g.nguon, c.da_duyet from dai_cau_hoi c join dai_bdm_gan_cau g on g.ma_cau=c.ma_cau where c.ma_cau=any($1) order by 1`, [Object.keys(DOI)]))
  const con = await q(`select count(*) n from dai_cau_hoi c where c.ma_cau like 'T106%' and c.xoa_at is null and (c.ten_de_goc ilike '%cuối%kì%' or c.ten_de_goc ilike '%CKI%') and not c.da_duyet`)
  console.log('CKI còn chưa duyệt:', con[0].n)
  if (up.rowCount !== 24) throw new Error('duyệt ≠ 24')
  if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
