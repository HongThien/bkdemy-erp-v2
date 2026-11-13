import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const out = []
const num = (s) => +String(s).replace(/\s/g, '')
const frac = (t) => [...t.matchAll(/\\dfrac\{(\d+)\}\{(\d+)\}/g)].map((m) => [+m[1], +m[2]])
const T = (n) => (Number.isInteger(n) && n > 0 ? nhom3(n) : null)
const nho = (arr) => arr.filter((d) => d && d.text)
function chot(c, dung, cand) {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  out.push(form(c.ma_cau, nhom3(dung), cand.filter((x) => x.text !== null && x.text !== undefined && x.text !== 'null')))
}
const mk = (v, rule, duong_sai) => ({ text: T(v), rule, duong_sai })
const P = pool()
// ---- NDB02080: tem (trung bình) ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02080' && /sưu tập tem/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/được ([\d ]+) tem, .*?nhiều hơn \S+(?: \S+)? ([\d ]+) tem/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const L = num(m[1]), d = num(m[2]), B = L + d, tong = L + B, dung = tong / 2
  chot(c, dung, [
    mk(tong, 'R408', 'dừng ở tổng số tem của hai bạn, quên chia 2 để tìm trung bình'),
    mk((L + (L - d)) / 2, 'R409', 'hiểu ngược "nhiều hơn" thành "ít hơn" nên tính số tem của bạn kia bằng phép trừ'),
    mk(tong * 2, 'R407', 'dùng sai phép tính ở bước cuối: nhân với 2 thay vì chia cho 2'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
  ])
}
// ---- NDB02080: hình chữ nhật cùng chu vi hình vuông ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02080' && /chu vi bằng chu vi/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/cạnh (\d+) m\..*?giảm chiều dài .*? đi (\d+) m và tăng chiều rộng .*? thêm (\d+) m/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const s = +m[1], a = +m[2], b = +m[3], h = a + b
  if ((2 * s + h) % 2) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  const l = (2 * s + h) / 2, w = 2 * s - l, dung = l * w
  chot(c, dung, [
    mk(4 * s, 'R411', 'nhầm diện tích với chu vi: lấy chu vi mảnh vườn làm đáp số'),
    mk(l, 'R408', 'dừng ở kết quả trung gian (chiều dài) không tính diện tích'),
    mk(l + w, 'R407', 'cộng chiều dài với chiều rộng thay vì nhân để tính diện tích'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
  ])
}
// ---- NDB02089: bán 2 lần ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02089' && /ra chợ bán/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/mang (\d+) quả/), f = frac(c.noi_dung)
  if (!m || f.length !== 2) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const N = +m[1], [[a, b], [p, q]] = f, x1 = N / b * a, rest = N - x1, x2 = rest / q * p, dung = x1 + x2
  if (![x1, x2].every(Number.isInteger)) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  chot(c, dung, [
    mk(N / b + (N - N / b) / q, 'R410', 'tìm phân số của một số mà chỉ chia cho mẫu số, quên nhân với tử số'),
    mk(x2, 'R408', 'chỉ lấy số bán ở lần thứ hai, bỏ sót cộng với lần thứ nhất'),
    mk(N - dung, 'R407', 'tính số còn lại (trừ) thay vì tổng số đã bán (cộng)'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
  ])
}
// ---- NDB02089: tấn kg + phân số ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02089' && /tấn \d+ kg/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/có (\d+) tấn (\d+) kg/), f = frac(c.noi_dung)
  if (!m || f.length !== 1) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const X = +m[1] * 1000 + +m[2], [[a, b]] = f, y = X / b * a
  if (!Number.isInteger(y)) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  const dung = X + y
  chot(c, dung, [
    mk(y, 'R408', 'dừng ở kết quả trung gian (lượng hàng thứ hai), quên cộng với lượng ban đầu'),
    mk(X - y, 'R407', 'dùng phép trừ thay vì phép cộng để tìm tổng'),
    mk(+m[1] + +m[2] + y, 'R413', 'không đổi tấn sang ki-lô-gam khi cộng, cộng thẳng số tấn với số ki-lô-gam'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(X / a * b + X, 'R410', 'tìm phân số của một số bằng cách đảo vai trò tử số và mẫu số'),
  ])
}
// ---- NDB02672: chia thửa ruộng ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02672' && /ha\. Bác/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/diện tích là (\d+) ha.*?lớn hơn .*? là ([\d ]+) m²/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const Tm = +m[1] * 10000, d = num(m[2]), dung = (Tm - d) / 2
  chot(c, dung, [
    mk((Tm + d) / 2, 'R407', 'cộng thay vì trừ: tìm số lớn thay vì số bé'),
    mk(Tm - d, 'R408', 'dừng ở kết quả trung gian (tổng trừ hiệu), quên chia cho 2'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(+m[1] * 10000 - d / 2 - 0 + 0 === dung ? null : Tm / 2, 'R411', 'chia đôi tổng diện tích mà không dùng hiệu'),
  ])
}
// ---- NDB02672: vườn cây ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02672' && /chiều dài \d+ dm/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/chiều dài (\d+) dm.*?dfrac\{(\d+)\}\{(\d+)\}.*?cứ (\d+) cm²/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const L = +m[1], a = +m[2], b = +m[3], k = +m[4], W = L / b * a, area = L * W
  if (!Number.isInteger(W) || (area * 100) % k) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  const dung = area * 100 / k
  chot(c, dung, [
    mk(area * 10 / k, 'R383', 'đổi dm² sang cm² bằng hệ số 10 thay vì 100'),
    mk(area / k, 'R408', 'bỏ bước đổi dm² sang cm² rồi chia luôn cho diện tích một cây'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(2 * (L + W) * 100 / k, 'R411', 'dùng chu vi thay vì diện tích mảnh vườn'),
  ])
}
// ---- NDB02808: lát gạch ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02808')) {
  const m = c.noi_dung.match(/cạnh (\d+) cm.*?chiều dài (\d+) m và chiều rộng (\d+) m/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const e = +m[1], L = +m[2], W = +m[3], dung = L * W * 10000 / (e * e)
  if (!Number.isInteger(dung)) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  chot(c, dung, [
    mk(L * W, 'R408', 'dừng ở diện tích nền phòng, chưa chia cho diện tích một viên gạch'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(2 * (L + W) * 100 / e, 'R411', 'dùng chu vi thay vì diện tích khi tính số viên gạch'),
    mk(L * W * 100 / (e * e), 'R383', 'đổi mét vuông sang xăng-ti-mét vuông bằng hệ số 100 thay vì 10 000'),
  ])
}
luu('k5_b3_loivan', out)
