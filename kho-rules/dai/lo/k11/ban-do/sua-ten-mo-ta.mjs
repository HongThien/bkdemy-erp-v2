// sua-ten-mo-ta.mjs — SỬA tên / mô tả dạng + tên nhóm của bản đồ mới K11 theo lời Thùy ("Sửa luôn đi", 19/10).
//   node kho-rules/dai/lo/k11/ban-do/sua-ten-mo-ta.mjs          → chạy thử (ROLLBACK)
//   node kho-rules/dai/lo/k11/ban-do/sua-ten-mo-ta.mjs --ghi    → sao lưu giá trị cũ ra file rồi ghi
// Rào: chỉ sửa khi giá trị HIỆN TẠI còn đúng như lúc đọc (cột `cu`); nếu Thùy đã tự sửa khác đi thì BỎ QUA mục đó và báo.
import pg from 'pg'
import { writeFileSync, mkdirSync } from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const LV = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k11'
const SUA = [
  { bang: 'dang', id: 'NDB00566', cot: 'ten', cu: 'Cộng góc lượng giác sử dụng Hệ thức Chales', moi: 'Cộng góc lượng giác sử dụng Hệ thức Chasles' },
  { bang: 'dang', id: 'NDB00566', cot: 'mo_ta', cu: 'Cộng góc lượng giác sử dụng Hệ thức Chales', moi: 'Cộng góc lượng giác sử dụng Hệ thức Chasles' },
  { bang: 'dang', id: 'NDB00599', cot: 'ten', cu: 'Xét tính tặng giảm của dãy cho bằng cách liệt kê số hạng', moi: 'Xét tính tăng giảm của dãy cho bằng cách liệt kê số hạng' },
  { bang: 'dang', id: 'NDB00599', cot: 'mo_ta', cu: 'Xét tính tặng giảm của dãy cho bằng cách liệt kê số hạng', moi: 'Xét tính tăng giảm của dãy cho bằng cách liệt kê số hạng' },
  { bang: 'dang', id: 'NDB01027', cot: 'ten', cu: 'Nhận diện dãy số cấp số cộng biết số hạng tổng quát', moi: 'Nhận diện dãy số cấp số nhân biết số hạng tổng quát' },
  { bang: 'dang', id: 'NDB01027', cot: 'mo_ta', cu: 'Nhận diện dãy số cấp số cộng biết số hạng tổng quát', moi: 'Nhận diện dãy số cấp số nhân biết số hạng tổng quát' },
  { bang: 'dang', id: 'NDB00618', cot: 'ten', cu: 'Cho sẵn u1, d - Tính tổng n số hạng', moi: 'Cho sẵn u1, q - Tính tổng n số hạng' },
  { bang: 'dang', id: 'NDB00618', cot: 'mo_ta', cu: 'Bài toán thực tế cấp số nhân mà đề bài chuyển về thành dạng cho sẵn u1 và d, yêu cầu tính tổng n số hạng đầu', moi: 'Bài toán thực tế cấp số nhân mà đề bài chuyển về thành dạng cho sẵn u1 và công bội q, yêu cầu tính tổng n số hạng đầu' },
  { bang: 'dang', id: 'NDB00999', cot: 'mo_ta', cu: 'Tìm min max của hàm số lượng giác bậc 2, đề bài không cho thêm điều kiện gì của biến x, đặt ẩn phụ sin/cos/tan/cot = t thì t luôn thuộc đoạn -1;1', moi: 'Tìm min max của hàm số lượng giác bậc 2, đề bài không cho thêm điều kiện gì của biến x, đặt ẩn phụ sin/cos = t thì t luôn thuộc đoạn [-1;1]' },
  { bang: 'nhom', id: 'NNB01539', cot: 'ten', cu: 'Rút gọn biểu thức lượng giác sử dụng công thức cộng', moi: 'Rút gọn biểu thức lượng giác sử dụng công thức lượng giác' },
]
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const T = { dang: 'dai_bdm_dang_bai', nhom: 'dai_bdm_nhom' }
  const sao = []; let ok = 0; const bo = []
  for (const s of SUA) {
    const h = (await c.query(`select ${s.cot} v from ${T[s.bang]} where id=$1`, [s.id])).rows[0]
    if (!h) { bo.push(`${s.id}.${s.cot}: không có dòng`); continue }
    if (h.v === s.moi) { bo.push(`${s.id}.${s.cot}: đã đúng`); continue }
    if (h.v !== s.cu) { bo.push(`${s.id}.${s.cot}: hiện «${h.v}» khác bản đọc lúc soạn — BỎ QUA (Thùy đã tự sửa?)`); continue }
    sao.push({ ...s, hien: h.v })
    ok += (await c.query(`update ${T[s.bang]} set ${s.cot}=$2, updated_at=now() where id=$1 and ${s.cot}=$3`, [s.id, s.moi, s.cu])).rowCount
  }
  console.log(`${GHI ? 'GHI THẬT' : 'CHẠY THỬ'} — sửa ${ok}/${SUA.length} mục`); for (const b of bo) console.log('  ·', b)
  if (GHI && sao.length) { mkdirSync(`${LV}/sao-luu`, { recursive: true }); writeFileSync(`${LV}/sao-luu/truoc-sua-ten-mo-ta-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, JSON.stringify(sao, null, 1)) }
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ Đã ghi.' : 'Đã ROLLBACK.')
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI:', e.message); process.exitCode = 1 } finally { await c.end() }
