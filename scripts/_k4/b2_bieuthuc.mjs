import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const P = pool(), out = []
const T = (v) => (Number.isInteger(v) && v > 0 ? nhom3(v) : null)
const mk = (v, rule, duong_sai) => ({ text: T(v), rule, duong_sai })
const nhan = (c, dung, cand) => {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  out.push(form(c.ma_cau, nhom3(dung), cand.filter((x) => x && x.text)))
}
// ---- bộ tính biểu thức, 3 chế độ ưu tiên (ngoặc luôn tính trước) ----
function tinh(src, mode) {
  const tk = src.match(/\d+|[-+*/()]/g); let i = 0
  const prim = () => { const t = tk[i++]; if (t === '(') { const v = expr(); i++; return v } return +t }
  const apply = (a, o, b) => (o === '+' ? a + b : o === '-' ? a - b : o === '*' ? a * b : a / b)
  function expr() {
    if (mode === 'trai') { let v = prim(); while (i < tk.length && tk[i] !== ')') { const o = tk[i++]; v = apply(v, o, prim()) } return v }
    if (mode === 'cong') { // cộng/trừ ưu tiên hơn nhân/chia
      const mul = () => { let v = prim(); while (i < tk.length && '+-'.includes(tk[i])) { const o = tk[i++]; v = apply(v, o, prim()) } return v }
      let v = mul(); while (i < tk.length && '*/'.includes(tk[i])) { const o = tk[i++]; v = apply(v, o, mul()) } return v }
    const term = () => { let v = prim(); while (i < tk.length && '*/'.includes(tk[i])) { const o = tk[i++]; v = apply(v, o, prim()) } return v }
    let v = term(); while (i < tk.length && '+-'.includes(tk[i])) { const o = tk[i++]; v = apply(v, o, term()) } return v
  }
  return expr()
}
// ---- NDB01766 ----
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB01766')) {
  let s = c.noi_dung.replace(/^[^:]*:\s*/, '').replace(/\$/g, '').replace(/\\,/g, '').replace(/\\times/g, '*').replace(/−/g, '-').replace(/×/g, '*').replace(/:/g, '/').replace(/[. ]+$/, '').replace(/(\d) (\d)/g, '$1$2').replace(/(\d) (\d)/g, '$1$2')
  if (!/^[\d+\-*/() ]+$/.test(s)) { out.push({ ma_cau: c.ma_cau, bo: `không đọc được biểu thức "${s}"` }); continue }
  const dung = tinh(s, 'chuan')
  if (!Number.isInteger(dung)) { out.push({ ma_cau: c.ma_cau, bo: 'kho ghi số lẻ' }); continue }
  nhan(c, dung, [
    mk(tinh(s, 'trai'), 'R377', 'tính lần lượt từ trái sang phải, bỏ qua nhân chia trước'),
    mk(tinh(s, 'cong'), 'R378', 'làm cộng trừ trước, nhân chia sau'),
    mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0'),
    mk(dung + 10, 'R413', 'tính sai một tổng thành phần (lệch một chục)'),
  ])
}
// ---- NDB02155 lời văn ----
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02155' && !/^Viết số thích hợp/.test(c.noi_dung))) {
  const n = (c.noi_dung.match(/\d+/g) || []).map(Number)
  let dung, cand
  if (/cả hai khối|^Có \d+ túi/.test(c.noi_dung) && n.length === 3 && /cả/.test(c.noi_dung)) {
    const [a, b, k] = n
    dung = (a + b) * k
    cand = [mk(a * k + b, 'R381', 'chỉ nhân thừa số chung với một hạng tử rồi cộng hạng tử còn lại'), mk(a * b + k, 'R415', 'nhân hai số lượng túi rồi cộng số vật'), mk(a + b + k, 'R407', 'cộng thay vì nhân'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0')]
  } else if (n.length === 3 && /(đã|đưa|chuyển|xuất|bán|dùng)/.test(c.noi_dung) && /còn lại/.test(c.noi_dung)) {
    const [a, b, d] = n; dung = (a - d) * b
    cand = [mk(a * b, 'R408', 'bỏ sót bước trừ: tính tổng ban đầu'), mk((a + d) * b, 'R407', 'cộng thay vì trừ số đã lấy đi'), mk(a * b - d, 'R381', 'chỉ nhân một hạng tử rồi trừ số lượng'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0')]
  } else { out.push({ ma_cau: c.ma_cau, bo: 'khuôn lời văn chưa hỗ trợ' }); continue }
  nhan(c, dung, cand)
}
luu('k4_b2', out)
