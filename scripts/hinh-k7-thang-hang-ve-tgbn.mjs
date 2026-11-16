// Sửa: 3 bài Thẳng hàng (HH00170–172) thuộc chủ đề "Tam giác bằng nhau" NCD00210, không phải chủ đề mới NCD00255 (Thùy 16/11).
// Chỉ đổi hinh_hoc_bai.chu_de_id của 3 bài. KHÔNG xoá chủ đề NCD00255 (chờ Thùy gật theo Luật xoá).
//   node scripts/hinh-k7-thang-hang-ve-tgbn.mjs [--ghi]
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
try {
  await c.query('begin')
  const cd = (await c.query(`select id, ten from dai_bdm_chu_de where id in ('NCD00210','NCD00255')`)).rows
  if (cd.length !== 2) throw new Error('không thấy đủ 2 chủ đề')
  const r = await c.query(`update hinh_hoc_bai set chu_de_id = 'NCD00210' where khoi = '7' and ma_bai in ('HH00170','HH00171','HH00172') and chu_de_id = 'NCD00255' returning ma_bai, ten_bai, chu_de_id`)
  if (r.rowCount !== 3) throw new Error('cần đúng 3 bài, được ' + r.rowCount)
  console.table(r.rows)
  const con = (await c.query(`select count(*)::int n from hinh_hoc_bai where chu_de_id = 'NCD00255'`)).rows[0].n
  console.log('NCD00255 còn', con, 'bài (giữ nguyên chủ đề rỗng, chờ Thùy quyết)')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('LỖI:', e.message); process.exitCode = 1 }
await c.end()
