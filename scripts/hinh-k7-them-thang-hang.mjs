// Bản đồ Hình–Học lớp 7: thêm chủ đề "Thẳng hàng" + 3 bài (Thùy 16/11):
//   Phương pháp cùng đường · Phương pháp cộng góc · Dùng tiên đề Euclide.
// Làm đúng như app (createHinhHocBai): insert hinh_hoc_bai(khoi, ten_bai, thu_tu, chu_de_id), da_duyet mặc định false, ma_dang tự sinh = ma_bai.
// Chủ đề = dai_bdm_chu_de (khoi '7', nhanh 'hinh'). Chưa có lý thuyết / ví dụ — bài rỗng chờ điền.
//   node scripts/hinh-k7-them-thang-hang.mjs          # chạy thử (ROLLBACK)
//   node scripts/hinh-k7-them-thang-hang.mjs --ghi
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const CHU_DE = 'Thẳng hàng'
const BAI = ['Phương pháp cùng đường', 'Phương pháp cộng góc', 'Dùng tiên đề Euclide']

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const da = (await c.query(`select id from dai_bdm_chu_de where khoi = '7' and nhanh = 'hinh' and ten = $1`, [CHU_DE])).rows
  if (da.length) throw new Error(`đã có chủ đề "${CHU_DE}" (${da[0].id}) — dừng, xem tay`)
  const trung = (await c.query(`select ma_bai from hinh_hoc_bai where khoi = '7' and ten_bai = any($1)`, [BAI])).rows
  if (trung.length) throw new Error('đã có bài trùng tên: ' + trung.map((x) => x.ma_bai).join(', '))
  const cd = (await c.query(`insert into dai_bdm_chu_de (khoi, ten, nhanh, kho) values ('7', $1, 'hinh', 'dai') returning id, thu_tu`, [CHU_DE])).rows[0]
  console.log(`chủ đề ${cd.id} (thứ tự ${cd.thu_tu}) ${CHU_DE}`)
  let tt = (await c.query(`select coalesce(max(thu_tu), 0)::int m from hinh_hoc_bai where khoi = '7'`)).rows[0].m
  for (const ten of BAI) {
    const b = (await c.query(`insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, chu_de_id) values ('7', $1, $2, $3) returning ma_bai, ma_dang, thu_tu`, [ten, ++tt, cd.id])).rows[0]
    console.log(`  ${b.ma_bai} (dạng ${b.ma_dang}, thứ tự ${b.thu_tu}) ${ten}`)
  }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
