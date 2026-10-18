// chuyen-tiep-tuyen.mjs — chuyển các câu kho Hình mà ĐỀ nói về "hai tiếp tuyến cắt nhau" (từ MỘT điểm ngoài đường tròn) vào dạng HH00109
//   node …/chuyen-tiep-tuyen.mjs          chạy thử (ROLLBACK)      ·      node …/chuyen-tiep-tuyen.mjs --ghi     ghi thật
// Thùy 18/10: "đẩy thêm các bài liên quan đến hai tiếp tuyến cắt nhau vào bài Hai tiếp tuyến cắt nhau ở phần Hình – học lớp 9". Chỉ đổi dang_chinh (mã câu bất biến); guard theo dạng cũ.
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const DANH_SACH = [ // [ma_cau, dạng cũ phải đang đứng]
  ['HHC002110', 'HH00108'], // AB tiếp tuyến, chứng minh AC cũng là tiếp tuyến (từ A kẻ hai tiếp tuyến AB, AC)
  ['HHC002131', 'HH00108'], // AB tiếp tuyến, AC = AB ⇒ AC tiếp tuyến (đã duyệt)
  ['HHC002137', 'HH00108'], // từ M kẻ MA tiếp tuyến, chứng minh MB cũng là tiếp tuyến
  ['HHC002134', 'HH00108'], // hai tiếp tuyến AM, AN của (O;R) — diện tích hình giới hạn bởi hai tiếp tuyến và cung
  ['HHC002027', 'HH00110'], // hai tiếp tuyến chung MN, PQ cắt nhau tại A (dây curoa); AO là phân giác nhờ tính chất hai tiếp tuyến cắt nhau
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  await c.query('begin')
  for (const [ma, cu] of DANH_SACH) {
    const r = await c.query(`update hinh_hoc_cau_hoi set dang_chinh = 'HH00109' where ma_cau = $1 and dang_chinh = $2 and xoa_at is null returning ma_cau, da_duyet`, [ma, cu])
    console.log(`${ma}: ${cu} → HH00109 ${r.rowCount ? '✔' + (r.rows[0].da_duyet ? ' (câu đã duyệt)' : '') : '✘ KHÔNG đổi (dạng cũ khác / đã xoá)'}`)
  }
  const n = await c.query(`select count(*) from hinh_hoc_cau_hoi where dang_chinh = 'HH00109' and xoa_at is null`)
  console.log(`HH00109 sau khi đổi: ${n.rows[0].count} câu`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ Đã ghi.' : 'Đã ROLLBACK — thêm --ghi để ghi thật.')
} catch (e) { await c.query('rollback'); console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
