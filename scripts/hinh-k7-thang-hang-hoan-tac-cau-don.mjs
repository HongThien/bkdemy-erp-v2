// Thùy 16/11: HHC000786, HHC000819… "thiếu đề" (câu cuối chuỗi, đề ghép giả thiết đầu chuỗi + ý cuối, thiếu ý a–b nên điểm M, F, E… chưa được định nghĩa; vài câu ghép nhầm giả thiết chuỗi khác).
// Hoàn tác việc chuyển 10 câu ĐƠN vào HH00170–172 (hinh-k7-day-thang-hang.mjs): trả dang_chinh về bài cũ theo bien-ban-truoc.json. Không sửa đề, không xoá. 9/10 câu đã có bản đầy đủ (bài–ý) ở thẳng hàng.
//   node scripts/hinh-k7-thang-hang-hoan-tac-cau-don.mjs [--ghi]
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { bien } from './kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const bb = JSON.parse(readFileSync('kho-rules/hinh/k7-thang-hang/bien-ban-truoc.json', 'utf8')).filter((x) => !x.bai_y)
if (bb.length !== 10) throw new Error('cần 10 câu đơn, có ' + bb.length)
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
try {
  await c.query('begin')
  for (const x of bb) {
    const r = await c.query(`update hinh_hoc_cau_hoi set dang_chinh = $2 where ma_cau = $1 and dang_chinh in ('HH00170','HH00171','HH00172') returning ma_cau`, [x.ma_cau, x.dang_chinh])
    if (r.rowCount !== 1) throw new Error(`${x.ma_cau} không còn ở bài thẳng hàng`)
    console.log(x.ma_cau, '→', x.dang_chinh)
  }
  const t = (await c.query(`select dang_chinh, count(*)::int n from hinh_hoc_cau_hoi where dang_chinh in ('HH00170','HH00171','HH00172') and xoa_at is null and bai_y is null group by 1`)).rows
  console.log('câu đơn còn ở thẳng hàng:', JSON.stringify(t))
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('LỖI:', e.message); process.exitCode = 1 }
await c.end()
