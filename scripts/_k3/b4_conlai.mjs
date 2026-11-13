import { pool, form, luu } from './lib.mjs'
import { norm, tok, ev, ltr, doiPhep, soTrong, thayLanLuot } from './core.mjs'
const P = pool(), out = []
let seed = 0
const swapDigits = (v) => { const s = String(v); if (s.length < 2) return null; const r = s.split('').reverse().join(''); return r[0] === '0' || r === s ? null : +r }
const dropZero = (v) => { const s = String(v); return v >= 10 && s.includes('0') ? +s.replace('0', '') || null : null }
// items: [{kind:'mul'|'div'|'add'|'gap'|'expr', a, b, tokens?}] vals: kết quả; trả về danh sách nhiễu {i,nv,rule,ds}
function sinhNhieu(items, vals) {
  const k = vals.length, s = seed++
  const chon = (off, f) => { for (let t = 0; t < k; t++) { const j = (s + off + t) % k, nv = f(j); if (nv !== null && nv !== undefined && Number.isFinite(nv) && nv >= 0 && nv !== vals[j]) return { i: j, nv } } return null }
  const R = []
  const them = (rule, ds, off, f) => { const r = chon(off, f); if (r) R.push({ ...r, rule, ds }) }
  const lam = [
    () => them('R470', 'nhầm sang kết quả liền kề trong bảng nhân/chia', 0, (j) => (items[j].kind === 'mul' ? vals[j] + items[j].a : items[j].kind === 'div' ? vals[j] + 1 : null)),
    () => them('R474', 'chép kết quả của phép tính khác trong cùng dãy', 1, (j) => vals[(j + 1) % k]),
    () => them('R471', 'đảo thứ tự hai chữ số của kết quả', 2, (j) => swapDigits(vals[j])),
    () => them('R473', 'dùng phép đối: nhân thay chia hoặc chia thay nhân', 3, (j) => (items[j].kind === 'mul' ? (items[j].a % items[j].b === 0 ? items[j].a / items[j].b : null) : items[j].kind === 'div' ? (items[j].a * items[j].b <= 10000 ? items[j].a * items[j].b : null) : null)),
    () => them('R415', 'dùng nhầm phép tính (cộng thay nhân, trừ thay chia, ...)', 4, (j) => (items[j].kind === 'mul' || items[j].kind === 'gap' ? items[j].a + items[j].b : items[j].kind === 'div' ? items[j].a - items[j].b : items[j].kind === 'add' ? items[j].a * items[j].b : items[j].tokens ? ev(doiPhep(items[j].tokens)) : null)),
    () => them('R365', 'bỏ sót một chữ số 0 của kết quả', 5, (j) => dropZero(vals[j])),
    () => them('R414', 'viết kết quả thừa một chữ số 0', 6, (j) => vals[j] * 10),
    () => them('R366', 'đúng cách làm nhưng lệch 1 đơn vị', 7, (j) => vals[j] + 1),
    () => them('R413', 'tính sai một tích/tổng thành phần ở một hàng', 8, (j) => (vals[j] >= 100 ? vals[j] + 100 : vals[j] + 10)),
    () => { for (let j = 0; j < k; j++) { const it = items[j]; if (it.tokens && /[*/]/.test(it.tokens.join('')) && /[-+]/.test(it.tokens.join(''))) { const a = ltr(it.tokens), b = ev(it.tokens, 'sw'); if (a !== null && a !== vals[j]) { R.push({ i: j, nv: a, rule: 'R377', ds: 'tính lần lượt từ trái sang phải, không theo thứ tự thực hiện phép tính' }); break } if (b !== null && b !== vals[j]) { R.push({ i: j, nv: b, rule: 'R378', ds: 'làm phép cộng, trừ trước, nhân, chia sau' }); break } } } },
  ]
  const o = lam.map((f, i) => [f, (i + s) % lam.length]).sort((x, y) => x[1] - y[1]).map((x) => x[0]) // xoay thứ tự rule theo câu
  o.forEach((f) => f())
  return R
}
function xuat(c, vals, cand) {
  const kho = soTrong(c.dap_an)
  if (kho.length !== vals.length || kho.some((x, i) => x !== vals[i])) return out.push({ ma_cau: c.ma_cau, bo: `máy ${vals.join('; ')} ≠ kho ${c.dap_an}` })
  const key = (arr) => arr.slice().sort((p, q) => p - q).join(); const seen = new Set([key(vals)])
  const ok = cand.map((x) => ({ arr: vals.map((v, j) => (j === x.i ? x.nv : v)), rule: x.rule, ds: x.ds })).filter((x) => { if (new Set(x.arr).size < x.arr.length) return false; const k2 = key(x.arr); if (seen.has(k2)) return false; seen.add(k2); return true })
  out.push(form(c.ma_cau, c.dap_an.trim(), ok.map((x) => ({ text: thayLanLuot(c.dap_an, x.arr).trim(), rule: x.rule, duong_sai: x.ds }))))
}
const sauDauHai = (t) => t.slice(t.indexOf(':') + 1)
// ---- bảng nhân/chia, tính nhẩm, đặt tính ----
for (const c of P) {
  const t = norm(c.noi_dung)
  if (/^Tính các (tích|thương)|^Tính nhẩm:|^Đặt tính rồi tính:|^Tính: \d/.test(t) && !/Điền dấu/.test(t)) {
    const body = /^Tính các/.test(t) ? t.slice(t.indexOf(':', 12) + 1) : sauDauHai(t)
    const its = [...body.matchAll(/(\d+)\s*([×:])\s*(\d+)/g)].map((m) => ({ kind: m[2] === '×' ? 'mul' : 'div', a: +m[1], b: +m[3] }))
    if (!its.length) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
    const vals = its.map((x) => (x.kind === 'mul' ? x.a * x.b : (x.b && x.a % x.b === 0 ? x.a / x.b : NaN)))
    if (vals.some(Number.isNaN)) { out.push({ ma_cau: c.ma_cau, bo: 'phép chia có dư' }); continue }
    xuat(c, vals, sinhNhieu(its, vals)); continue
  }
  if (/^Tính kết quả mỗi phép/.test(t)) {
    const its = [...t.matchAll(/số (\d+) (thêm|gấp|bớt|giảm) (\d+)/g)].map((m) => ({ kind: m[2] === 'gấp' ? 'gap' : m[2] === 'thêm' ? 'add' : 'sub', a: +m[1], b: +m[3], op: m[2] }))
    const vals = its.map((x) => (x.op === 'gấp' ? x.a * x.b : x.op === 'thêm' ? x.a + x.b : x.a - x.b))
    if (!its.length) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
    xuat(c, vals, sinhNhieu(its, vals)); continue
  }
}
export { out, P, seed, sinhNhieu, xuat, swapDigits, dropZero }
