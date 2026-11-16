// Thử hàm hiển thị src/lib/kho/giaThietY.ts trên TOÀN BỘ ý Hình–Học đang có (chỉ đọc DB): đếm, tìm khúc nghi cắt nhầm, in mẫu.
// Kiểm bất biến: ghép các khúc lại phải còn đủ mọi công thức $…$ của đề ý, đúng thứ tự (không mất, không đảo chữ toán).
// Dùng: node --env-file=.env kho-rules/hinh/lo/tach-y/da-biet/thu-tach-de-y.mjs
import pg from 'pg'
import { tachGiaThietCauHoi } from '../../../../../src/lib/kho/giaThietY.ts'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL }); await c.connect()
await c.query('set default_transaction_read_only = on')
const rows = (await c.query(`select q.ma_cau, q.nhan_y, q.cau_hoi_y, b.khoi from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai = q.dang_chinh where q.bai_y is not null and q.xoa_at is null order by q.ma_cau`)).rows
await c.end()
const toan = (s) => [...s.matchAll(/\$[^$]*\$/g)].map((m) => m[0]).join('|')
let coGt = 0, toanCauHoi = 0, matToan = 0, khongCauHoi = 0; const nghi = [], mau = []
for (const r of rows) {
  const ks = tachGiaThietCauHoi(r.cau_hoi_y)
  if (toan(ks.map((k) => k.text).join(' ')) !== toan(r.cau_hoi_y)) { matToan++; if (matToan < 4) console.log('MẤT / ĐẢO công thức:', r.ma_cau) }
  if (!ks.some((k) => !k.gt)) khongCauHoi++
  if (ks.some((k) => k.gt)) { coGt++; if (coGt % 97 === 1) mau.push({ r, ks }) } else toanCauHoi++
  for (const k of ks) if (k.gt && /\?|chứng minh|chứng tỏ|suy ra|thẳng hàng|đồng quy/i.test(k.text)) nghi.push(`${r.ma_cau} ý ${r.nhan_y}: «${k.text.slice(0, 150)}»`)
  for (const k of ks) if (!k.gt && /^(gọi|lấy|kẻ|vẽ|dựng|trên|qua|từ)\s/i.test(k.text) && !/chứng minh|tính|so sánh|tìm|\?|hỏi|xác định|chứng tỏ/i.test(k.text)) nghi.push(`${r.ma_cau} ý ${r.nhan_y}: câu hỏi mà giống giả thiết «${k.text.slice(0, 150)}»`)
}
console.log('ý xét:', rows.length, '· có khúc giả thiết được tô:', coGt, '· cả đề là câu hỏi (không tô):', toanCauHoi, '· ý không còn khúc câu hỏi nào:', khongCauHoi, '· mất / đảo công thức:', matToan)
console.log('nghi cắt nhầm:', nghi.length); for (const x of nghi.slice(0, 25)) console.log('  ', x)
console.log('\nMẪU:'); for (const { r, ks } of mau.slice(0, 9)) console.log(`# ${r.ma_cau} K${r.khoi} ý ${r.nhan_y}\n` + ks.map((k) => (k.gt ? '   [GT] ' : '   [HỎI] ') + k.text.slice(0, 190)).join('\n'))
