import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
import { docSo, chuanVan } from './doc.mjs'
const P = pool(), out = []
const N = (s) => +String(s).replace(/\s/g, '')
const T = (v) => (Number.isInteger(v) && v > 0 ? nhom3(v) : null)
const mk = (v, rule, duong_sai) => ({ text: T(v), rule, duong_sai })
const nhan = (c, dung, cand) => {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  out.push(form(c.ma_cau, nhom3(dung), cand.filter((x) => x && x.text)))
}
// ---- NDB01770: đặt tính nhân / chia ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01770' && /^Đặt tính rồi tính/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/tính:\s*\$?([\d ]+?)\s*(×|:)\s*([\d ]+?)\s*\$?\.?\s*$/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = N(m[1]), b = N(m[3]), nhanP = m[2] === '×'
  if (!nhanP && a % b) { out.push({ ma_cau: c.ma_cau, bo: 'phép chia không hết (kho ghi số lẻ)' }); continue }
  const dung = nhanP ? a * b : a / b
  const s0 = String(dung), bo0 = s0.replace('0', '')
  nhan(c, dung, nhanP ? [
    mk(dung - 10, 'R375', 'quên cộng phần nhớ ở một hàng (kết quả lệch 10)'),
    mk(dung + a, 'R413', 'tính sai một tích thành phần (lệch đúng một bội của số bị nhân)'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(a + b, 'R415', 'dùng phép cộng thay vì phép nhân'),
  ] : [
    s0.includes('0') ? mk(+bo0, 'R376', 'bỏ sót chữ số 0 ở thương khi hạ chữ số') : null,
    mk(dung + 1, 'R413', 'chia sai một lượt (thương lệch 1 đơn vị)'),
    mk(dung * 10, 'R414', 'viết thương thừa một chữ số 0'),
    mk(a - b, 'R415', 'dùng phép trừ thay vì phép chia'),
  ])
}
// ---- NDB01781: tấn + kg/yến ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01781' && /tấn.*= ?[….\s]*kg/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/(\d+) tấn (?:\$?)(\d+)\$? (kg|yến)/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = +m[1], b = +m[2], f = m[3] === 'yến' ? 10 : 1, dung = a * 1000 + b * f
  nhan(c, dung, [
    mk(a * 100 + b * (f === 10 ? 100 : 1), 'R387', 'nhầm hệ số: 1 tấn = 100 kg (và 1 yến = 100 kg)'),
    mk(+(`${a}${b}`), 'R385', 'ghép liền hai số thay vì đổi từng phần'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(a * 1000, 'R413', 'chỉ đổi phần tấn, quên cộng phần còn lại'),
  ])
}
// ---- NDB01782 ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01782')) {
  let m
  if ((m = c.noi_dung.match(/Điền số thích hợp vào chỗ chấm\.\s*(\d+) thế kỉ/))) {
    const n = +m[1], dung = n * 100
    nhan(c, dung, [mk(n * 10, 'R386', 'dùng hệ số 10 thay vì 100'), mk(n * 1000, 'R388', 'nhân thêm hệ số 10: 1 thế kỉ = 1 000 năm'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(n + 100, 'R415', 'cộng thay vì nhân')])
  } else if ((m = c.noi_dung.match(/(\d+) phút (\d+) giây =/))) {
    const a = +m[1], b = +m[2], dung = a * 60 + b
    nhan(c, dung, [mk(a * 100 + b, 'R386', 'dùng hệ số 100 thay vì 60'), mk(a * 60, 'R413', 'chỉ đổi phần phút, quên cộng số giây'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(+(`${a}${b}`), 'R388', 'ghép liền hai số thay vì đổi')])
  } else out.push({ ma_cau: c.ma_cau, bo: 'khuôn nhiều ý / chưa hỗ trợ' })
}
// ---- NDB01787: m² cm² ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01787')) {
  const m = c.noi_dung.match(/(\d+) m² (\d+) cm² =/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = +m[1], b = +m[2], dung = a * 10000 + b
  nhan(c, dung, [mk(a * 100 + b, 'R384', 'đổi hai bậc dùng 100 thay vì 10 000'), mk(+(`${a}${b}`), 'R385', 'ghép liền hai số thay vì đổi từng phần'), mk(a * 10000, 'R388', 'chỉ đổi phần m², quên cộng phần cm²'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'), mk(a * 1000 + b, 'R383', 'dùng hệ số 10 cho mỗi bậc thay vì 100')])
}
// ---- NDB01785: đọc số đo diện tích ----
const DV = { 'dm': 'đề-xi-mét vuông', 'm': 'mét vuông', 'mm': 'mi-li-mét vuông', 'cm': 'xăng-ti-mét vuông' }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01785')) {
  const t = c.noi_dung.replace(/\$/g, '').replace(/\\ /g, ' ').replace(/\^2/g, '²')
  const m = t.match(/sau:\s*([\d ]+?)\s*(dm|cm|mm|m)²/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const n = N(m[1]), u = m[2]
  const doc = (n, un) => `${docSo(n)} ${DV[un]}`
  const khoCham = /\.$/.test(c.dap_an.trim()), kho = c.dap_an.trim().replace(/\.$/, '')
  if (chuanVan(doc(n, u)) !== chuanVan(kho)) { out.push({ ma_cau: c.ma_cau, bo: `máy "${doc(n, u)}" ≠ kho "${kho}"` }); continue }
  const hoa = /^[A-ZÀ-Ỹ]/.test(kho), fm = (s) => (hoa ? s.charAt(0).toUpperCase() + s.slice(1) : s) + (khoCham ? '.' : '')
  const w = docSo(n); const w389 = / linh/.test(w) ? w.replace(/ linh/, '') : w.replace(/ không trăm/, '')
  const kU = Object.keys(DV).filter((x) => x !== u)[0]
  out.push(form(c.ma_cau, fm(doc(n, u)), [
    { text: fm(doc(n, kU)), rule: 'R394', duong_sai: 'đọc đúng chữ số nhưng nhầm tên đơn vị diện tích' },
    w389 !== w && { text: fm(`${w389} ${DV[u]}`), rule: 'R389', duong_sai: 'đọc sai chữ số 0 (thiếu "linh" hoặc "không trăm")' },
    n >= 1000 && { text: fm(doc(n % 1000, u)), rule: 'R390', duong_sai: 'bỏ sót lớp nghìn khi đọc số' },
    { text: fm(doc(n * 10, u)), rule: 'R391', duong_sai: 'đọc thừa một chữ số 0 (gấp 10 lần)' },
  ]))
}
luu('k4_b1', out)
