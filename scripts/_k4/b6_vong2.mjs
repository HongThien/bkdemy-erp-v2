import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const P = pool(), out = []
const num = (s) => +String(s).replace(/[^0-9]/g, '')
const fmtFor = (c) => { if (c.dap_an.trim().startsWith('$')) return (t) => '$' + String(t).replace(/ /g, '') + '$'; const sp = /\d \d{3}/.test(c.dap_an); return (t) => (sp ? nhom3(t) : String(t)) }
function chot(c, dung, cand) {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  const f = fmtFor(c)
  out.push(form(c.ma_cau, f(dung), cand.filter((x) => x.v != null && Number.isFinite(x.v) && x.v >= 0 && Number.isInteger(x.v) && x.v !== dung).map((x) => ({ text: f(x.v), rule: x.rule, duong_sai: x.ds }))))
}
// ---- thứ tự tiếng Việt ----
const CS = { 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'tư': 4, 'năm': 5, 'lăm': 5, 'sáu': 6, 'bảy': 7, 'tám': 8, 'chín': 9, 'mốt': 1 }
function vn(w) { w = w.trim(); if (w === 'nhất') return 1; const t = w.split(' '); let n = 0
  if (t[0] === 'mười') { n = 10; if (t[1]) n += CS[t[1]] } else if (t[1] === 'mươi') { n = CS[t[0]] * 10; if (t[2]) n += CS[t[2]] } else n = CS[t[0]]
  return n }
// (1) dãy gấp đôi
for (const c of P.filter((c) => /theo quy tắc/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/Biết rằng ở \S+(?: \S+)? thứ ([^,]+), [^0-9]*?(\d[0-9 ]*)[^.]*\. Hỏi .*? thứ ([^?]+)\?/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = vn(m[1]), V = num(m[2]), b = vn(m[3]), d = b - a, dung = V * 2 ** d
  chot(c, dung, [
    { v: V * 2 ** (d - 1), rule: 'R408', ds: 'dừng ở số của vị trí liền trước, bỏ một lần nhân đôi' },
    { v: V * 2 * d, rule: 'R415', ds: 'nhân với 2 rồi nhân với số bước thay vì nhân đôi từng bước' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: V + 2 * d, rule: 'R407', ds: 'cộng thay vì nhân đôi' },
  ])
}
// (2) giá 1 kg / chia 4 phần
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01770' && /Sau khi mua (\d+) kg/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/ có ([0-9 ]+) đồng\. Sau khi mua (\d+) kg [^.]*còn ([0-9 ]+) đồng/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const X = num(m[1]), k = +m[2], Y = num(m[3]), dung = (X - Y) / k
  chot(c, dung, [
    { v: X - Y, rule: 'R408', ds: 'dừng ở số tiền đã mua, chưa chia cho số ki-lô-gam' },
    { v: (X - Y) * k, rule: 'R407', ds: 'nhân thay vì chia để tìm giá 1 ki-lô-gam' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: X / k, rule: 'R415', ds: 'chia cả số tiền ban đầu cho số ki-lô-gam, quên trừ số tiền còn lại' },
  ])
}
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01770' && /bốn phần bằng nhau/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/có ([0-9 ]+) kg/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const N = num(m[1]), dung = N - N / 4
  chot(c, dung, [
    { v: N / 4, rule: 'R408', ds: 'dừng ở một phần (số trên xe đầu), chưa tính phần còn lại' },
    { v: N + N / 4, rule: 'R407', ds: 'cộng thay vì trừ để tìm phần còn lại' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: N / 3 * 2, rule: 'R415', ds: 'chia cho 3 thay vì 4 rồi lấy 2 phần' },
  ])
}
// (3) năm nhuận
const SN = { hai: 2, ba: 3, 'bốn': 4, 'năm': 5 }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02804')) {
  const m = c.noi_dung.match(/Trong (hai|ba|bốn|năm) năm/), nh = /có hai năm nhuận/.test(c.noi_dung) ? 2 : 1
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const n = SN[m[1]], dung = 365 * n + nh
  chot(c, dung, [
    { v: 365 * n, rule: 'R408', ds: 'quên cộng thêm ngày của năm nhuận (tính mọi năm 365 ngày)' },
    { v: 366 * n, rule: 'R407', ds: 'coi mọi năm đều là năm nhuận (366 ngày)' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: dung - 365, rule: 'R415', ds: 'tính thiếu một năm' },
  ])
}
// (4) lát sân
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02670')) {
  let m = c.noi_dung.match(/cạnh (\d+) m.*?chiều dài (\d+) dm, gấp (\d+) lần chiều rộng/)
  let s, d, k
  if (m) { s = +m[1] * 10; d = +m[2]; k = +m[3] } else {
    const m2 = c.noi_dung.match(/cạnh (\d+) m.*?chiều dài (\d+) dm và chiều rộng (\d+) dm/)
    if (!m2) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
    s = +m2[1] * 10; d = +m2[2]; k = +m2[2] / +m2[3]
  }
  const dung = (s * s) / (d * (d / k))
  chot(c, dung, [
    { v: s * s, rule: 'R408', ds: 'dừng ở diện tích sân, chưa chia cho diện tích một tấm gạch' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: (s * s) / (d * d), rule: 'R415', ds: 'tính diện tích tấm gạch như hình vuông cạnh bằng chiều dài' },
    { v: 4 * s / d, rule: 'R411', ds: 'dùng chu vi sân thay vì diện tích' },
  ])
}
// (5) biểu thức chứa chữ
const chuoi = (e) => e.replace(/×/g, '*').replace(/:/g, '/').replace(/−/g, '-').replace(/ /g, '')
const tokens = (e) => chuoi(e).match(/\d+|[*/+-]/g)
const traiPhai = (t) => { let v = +t[0]; for (let i = 1; i < t.length; i += 2) { const x = +t[i + 1]; v = t[i] === '+' ? v + x : t[i] === '-' ? v - x : t[i] === '*' ? v * x : v / x } return v }
const nhanChiaTruoc = (t) => { const r = []; for (let i = 0; i < t.length; i++) { if ((t[i] === '*' || t[i] === '/') && r.length) { const L = +r.pop(); const op = t[i]; const R = +t[++i]; r.push(String(op === '*' ? L * R : L / R)) } else r.push(t[i]) } return r }
const congTruTruoc = (t) => { const idx = t.findIndex((x) => x === '*' || x === '/'); if (idx < 0) return traiPhai(t); const L = traiPhai(t.slice(0, idx)), R = traiPhai(t.slice(idx + 1)); return t[idx] === '*' ? L * R : L / R }
const WORD = { một: 1, hai: 2, ba: 3, bốn: 4 }
function giaTriBien(def) {
  let m = def.match(/^([0-9 ]+)$/); if (m) return num(m[1])
  m = def.match(/số (chẵn|lẻ)?\s*(nhỏ|bé|lớn) nhất có (một|hai|ba|bốn) chữ số( khác nhau)?/); if (!m) return null
  const k = WORD[m[3]], lo = 10 ** (k - 1), hi = 10 ** k - 1, be = m[2] !== 'lớn'
  for (let x = be ? lo : hi; be ? x <= hi : x >= lo; x += be ? 1 : -1) { if (m[1] === 'chẵn' && x % 2) continue; if (m[1] === 'lẻ' && !(x % 2)) continue; if (m[4] && new Set(String(x)).size !== String(x).length) continue; return x }
  return null
}
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01763')) {
  const m = c.noi_dung.match(/biểu thức (a [^v]*?) với (.*)\.$/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const expr = m[1].trim(), vals = {}
  for (const d of m[2].split(/;|, (?=[ab] )/)) { const mm = d.trim().match(/^([ab])(?: = | là )(.*)$/); if (!mm) { vals.bad = 1; continue } const v = giaTriBien(mm[2].trim()); if (v == null) vals.bad = 1; else vals[mm[1]] = v }
  if (vals.bad || vals.a == null || vals.b == null) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được biến' }); continue }
  const sub = expr.replace(/a/g, vals.a).replace(/b/g, vals.b).replace(/(\d) (\d{3})/g, '$1$2')
  const t = tokens(sub), dung = traiPhai(nhanChiaTruoc(t))
  chot(c, dung, [
    { v: traiPhai(t), rule: 'R377', ds: 'tính lần lượt từ trái sang phải, không ưu tiên nhân chia' },
    { v: congTruTruoc(t), rule: 'R378', ds: 'làm phép cộng trừ trước, nhân chia sau' },
    { v: (() => { const r = nhanChiaTruoc(t); const i = t.findIndex((x) => x === '*' || x === '/'); return i < 0 ? null : t[i] === '*' ? +t[i - 1] * +t[i + 1] : +t[i + 1] === 0 ? null : +t[i - 1] / +t[i + 1] })(), rule: 'R408', ds: 'dừng ở kết quả trung gian của phép nhân/chia, chưa cộng trừ' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
  ])
}
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01764')) {
  const m = c.noi_dung.match(/m=(\d+).*?n=(\d+).*?p=(\d+)/); if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [mm, n, p] = [+m[1], +m[2], +m[3]], dung = mm + n + p
  chot(c, dung, [
    { v: mm + n, rule: 'R408', ds: 'chỉ cộng hai số đầu, bỏ sót số thứ ba' },
    { v: mm + n * p, rule: 'R415', ds: 'nhân thay vì cộng ở trong ngoặc' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: Math.abs(mm - (n + p)), rule: 'R407', ds: 'trừ thay vì cộng trong ngoặc' },
  ])
}
// (6) k × (a+b+c)
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02155')) {
  const m = c.noi_dung.match(/a = (\d+), b = (\d+), c = (\d+).*?biểu thức (\d+) × \(a \+ b \+ c\)/); if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [a, b, cc, k] = m.slice(1).map(Number), s = a + b + cc, dung = k * s
  chot(c, dung, [
    { v: k * a + b + cc, rule: 'R377', ds: 'bỏ ngoặc: chỉ nhân với số hạng đầu, cộng nguyên các số còn lại' },
    { v: s, rule: 'R408', ds: 'dừng ở tổng trong ngoặc, chưa nhân với thừa số ngoài' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: k + s, rule: 'R415', ds: 'cộng thay vì nhân với tổng trong ngoặc' },
  ])
}
// (7) A - (B + C) - D
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01766' && /\(/.test(c.noi_dung))) {
  const raw = c.noi_dung.replace(/Tính giá trị của biểu thức:/, '').replace(/[$]/g, '').split(String.fromCharCode(92) + ',').join('').replace(/ /g, '')
  const m = raw.match(/^(\d+)[-−]\((\d+)\+(\d+)\)[-−](\d+)\.?$/); if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [A, B, C, D] = m.slice(1).map(Number), dung = A - (B + C) - D
  chot(c, dung, [
    { v: A - B + C - D, rule: 'R407', ds: 'bỏ ngoặc không đổi dấu: trừ B rồi cộng C' },
    { v: A - (B + C), rule: 'R408', ds: 'dừng ở kết quả trước phép trừ cuối' },
    { v: dung * 10, rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
    { v: A - B - C + D, rule: 'R415', ds: 'cộng thay vì trừ ở bước cuối' },
  ])
}
// (8) viết số gồm ...
const VI = { 'chục triệu': 1e7, 'triệu': 1e6, 'chục nghìn': 1e4, 'nghìn': 1e3, 'trăm': 100, 'chục': 10, 'đơn vị': 1, 'trăm nghìn': 1e5, 'trăm triệu': 1e8 }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01756' && /^Viết số gồm/.test(c.noi_dung))) {
  const re = /(\d+) (trăm triệu|chục triệu|triệu|trăm nghìn|chục nghìn|nghìn|trăm|chục|đơn vị)/g; let m, n = 0
  const txt = c.noi_dung.replace(/[$]/g, '')
  while ((m = re.exec(txt))) n += +m[1] * VI[m[2]]
  const s = String(n)
  let n1 = null; for (let i = 0; i < s.length - 1 && n1 === null; i++) if (s[i] === '0' && s[i + 1] !== '0') n1 = +(s.slice(0, i) + s[i + 1] + '0' + s.slice(i + 2))
  chot(c, n, [
    { v: n1, rule: 'R391', ds: 'đặt chữ số 0 sai hàng' },
    { v: +s.slice(0, -3), rule: 'R390', ds: 'bỏ sót một lớp (nhóm 3 chữ số) cuối' },
    { v: +s.replace('0', ''), rule: 'R365', ds: 'bỏ sót một chữ số 0' },
    { v: n * 10, rule: 'R414', ds: 'viết thừa một chữ số 0' },
  ])
}
// (9) giá trị chữ số
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01759' && /Giá trị của chữ số/.test(c.noi_dung))) {
  const m = c.noi_dung.replace(/[$]/g, '').match(/chữ số (\d) trong số (\d+)/); if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [d, s] = [m[1], m[2]]; if (s.split(d).length !== 2) { out.push({ ma_cau: c.ma_cau, bo: 'chữ số lặp' }); continue }
  const pos = s.length - 1 - s.indexOf(d), dung = +d * 10 ** pos
  chot(c, dung, [
    { v: +d, rule: 'R494', ds: 'chỉ viết chữ số, quên nhân với giá trị của hàng' },
    { v: dung / 10, rule: 'R365', ds: 'bỏ sót một chữ số 0' },
    { v: dung * 10, rule: 'R393', ds: 'nhầm sang hàng liền kề cao hơn' },
  ])
}
// (10) làm tròn hàng trăm nghìn
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01760' && /^Điền vào chỗ trống: Làm tròn số/.test(c.noi_dung))) {
  const m = c.noi_dung.replace(/[$]/g, '').match(/số (\d+) đến hàng trăm nghìn/); if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const n = +m[1], h = 1e5, r = n % h, up = n - r + h, down = n - r, dung = r * 2 >= h ? up : down
  chot(c, dung, [
    { v: Math.round(n / 1e4) * 1e4, rule: 'R395', ds: 'làm tròn đến hàng liền kề nhỏ hơn (chục nghìn)' },
    { v: Math.round(n / 1e6) * 1e6, rule: 'R422', ds: 'làm tròn đến hàng liền kề lớn hơn (triệu)' },
    { v: dung === up ? down : up, rule: 'R396', ds: 'xét sai chữ số quyết định nên làm tròn ngược chiều' },
    { v: down, rule: 'R397', ds: 'cắt bỏ chữ số, luôn làm tròn xuống' },
  ])
}
// (11) hai số chẵn liên tiếp
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01790')) {
  const m = c.noi_dung.replace(/[$]/g, '').match(/tổng là (\d+)/); const S = +m[1], a = (S - 2) / 2, dung = `${a} và ${a + 2}`
  if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, dung, [
    { text: `${S / 2} và ${S / 2 + 2}`, rule: 'R408', duong_sai: 'quên trừ hiệu 2 trước khi chia đôi tổng' },
    { text: `${a - 2} và ${a}`, rule: 'R407', duong_sai: 'lấy hai số chẵn liên tiếp liền trước cặp đúng' },
    { text: `${S / 2} và ${S / 2}`, rule: 'R409', duong_sai: 'lấy hai số bằng nhau (mỗi số bằng nửa tổng), bỏ qua điều kiện liên tiếp' },
  ]))
}
luu('k4_b6_vong2', out)
