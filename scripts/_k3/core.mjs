import { form } from './lib.mjs'
const BS = String.fromCharCode(92)
export const norm = (t) => t.split(BS + 'times').join('×').split(BS + 'cdot').join('×').split(BS + 'div').join(':').split(BS + 'dots').join('...').split(BS + 'ldots').join('...').split('$').join(' ').replace(/−|–/g, '-').replace(/÷/g, ':').replace(/ +/g, ' ').replace(/ ([.,;])/g, '$1').trim()
// ---- tính biểu thức (Number, chỉ nhận kết quả nguyên không âm) ----
const PREC = { std: { '+': 1, '-': 1, '*': 2, '/': 2 }, sw: { '+': 2, '-': 2, '*': 1, '/': 1 } }
export function tok(s) {
  const t = s.replace(/×/g, '*').replace(/:/g, '/').replace(/\s+/g, ''); const out = []
  const re = /\d+|[-+*/()]/g; let m, last = 0
  while ((m = re.exec(t))) { if (m.index !== last) return null; out.push(m[0]); last = re.lastIndex }
  return last === t.length ? out : null
}
export function ev(tokens, mode = 'std') { // precedence climbing; null nếu không nguyên/âm
  if (!tokens) return null
  const P = PREC[mode === 'sw' ? 'sw' : 'std']; let i = 0
  const prim = () => { const t = tokens[i++]; if (t === '(') { const v = expr(0); if (tokens[i++] !== ')') return NaN; return v } return /^\d+$/.test(t) ? +t : NaN }
  const expr = (min) => { let l = prim(); while (i < tokens.length && P[tokens[i]] >= min && P[tokens[i]]) { const op = tokens[i++]; const r = expr(P[op] + 1); l = op === '+' ? l + r : op === '-' ? l - r : op === '*' ? l * r : (r !== 0 && l % r === 0 ? l / r : NaN) } return l }
  const v = expr(1); return Number.isInteger(v) && v >= 0 && i === tokens.length ? v : null
}
export function ltr(tokens) { // tính lần lượt từ trái sang phải, bỏ ngoặc
  const t = tokens.filter((x) => x !== '(' && x !== ')'); let v = +t[0]
  for (let i = 1; i < t.length; i += 2) { const op = t[i], r = +t[i + 1]; v = op === '+' ? v + r : op === '-' ? v - r : op === '*' ? v * r : (r !== 0 && v % r === 0 ? v / r : NaN) }
  return Number.isInteger(v) && v >= 0 ? v : null
}
export function doiPhep(tokens) { // đổi phép tính cuối cùng sang phép "nhầm": + ↔ -, * → +, / → *
  const idx = tokens.map((x, i) => (['+', '-', '*', '/'].includes(x) ? i : -1)).filter((i) => i >= 0); if (!idx.length) return null
  const j = idx[idx.length - 1], o = tokens[j], n = { '+': '-', '-': '+', '*': '+', '/': '-' }[o]
  const t2 = [...tokens]; t2[j] = n; return t2
}
// ---- dựng form cho câu nhiều thành phần ----
export const soTrong = (s) => [...s.matchAll(/\d+/g)].map((m) => +m[0])
export const thayLanLuot = (s, arr) => { let k = 0; return s.replace(/\d+/g, () => String(arr[k++])) }
const bo10 = (v) => { const s = String(v); return /0/.test(s.slice(0, -1)) ? +s.replace(/0(?=\d)/, '') : null }
// comps: [{v, tokens?, dang?: '+','-','*','/', loai}] ; khoStr: đáp số kho (khuôn để thay số)
export function dungForm(c, vals, comps, rotate = 0) {
  const kho = soTrong(c.dap_an)
  if (kho.length !== vals.length || kho.some((x, i) => x !== vals[i])) return { ma_cau: c.ma_cau, bo: `máy ${vals.join('; ')} ≠ kho ${c.dap_an}` }
  const k = vals.length, pick = (r) => (r + rotate) % k
  const mod = (i, nv) => thayLanLuot(c.dap_an, vals.map((x, j) => (j === i ? nv : x)))
  const cand = []
  const add = (i, nv, rule, duong_sai) => { if (nv === null || nv === undefined || !Number.isFinite(nv) || nv < 0 || nv === vals[i]) return; const arr2 = vals.map((x, j) => (j === i ? nv : x)); if (new Set(arr2).size < arr2.length) return; if (cand.some((q) => q.key === arr2.slice().sort((a, b) => a - b).join())) return; cand.push({ text: mod(i, nv), rule, duong_sai, key: arr2.slice().sort((a, b) => a - b).join() }) }
  const mid = (cmp) => comps[cmp] || {}
  let i
  i = pick(0); const v0 = vals[i], lenH = String(v0).length
  add(i, v0 >= 100 ? v0 + 100 : v0 + 10, 'R413', 'tính sai một tích/tổng thành phần ở một hàng nên kết quả lệch ở hàng đó')
  i = pick(1); add(i, vals[i] * 10, 'R414', 'viết kết quả thừa một chữ số 0 (gấp 10 lần)')
  i = pick(2); { const cp = comps[i] || {}; if (cp.tokens) { const t2 = doiPhep(cp.tokens); add(i, ev(t2), 'R415', 'dùng nhầm phép tính ở bước cuối (cộng thay trừ, trừ thay cộng, nhân thay cộng, chia thay nhân)') } }
  i = pick(3); add(i, vals[i] + 1, 'R366', 'đúng cách làm nhưng lệch 1 đơn vị so với kết quả đúng')
  for (let r = 0; r < k; r++) { const j = pick(r), cp = comps[j] || {}
    if (cp.tokens && /[*/]/.test(cp.tokens.join('')) && /[-+]/.test(cp.tokens.join(''))) { add(j, ltr(cp.tokens), 'R377', 'tính lần lượt từ trái sang phải, không theo thứ tự thực hiện phép tính'); add(j, ev(cp.tokens, 'sw'), 'R378', 'làm phép cộng, trừ trước, nhân, chia sau') }
    if (cp.loai === 'cong' && vals[j] >= 10) add(j, vals[j] - 10, 'R375', 'quên nhớ sang hàng chục khi cộng')
    if (cp.loai === 'tru' && vals[j] >= 0) add(j, vals[j] + 10, 'R375', 'quên mượn khi trừ nên kết quả lớn hơn đúng 10')
    if (cp.loai === 'chia') add(j, bo10(vals[j]), 'R376', 'bỏ sót chữ số 0 ở thương')
    if (cp.sai !== undefined) add(j, cp.sai, 'R412', 'dùng sai phép tính ngược (cộng thay trừ, nhân thay chia...)') }
  return form(c.ma_cau, c.dap_an.trim(), cand)
}
// tiện ích: biểu thức từ chuỗi
export function bieuThuc(s) {
  const t = tok(s); const v = ev(t); if (v === null) return null
  const ops = t.filter((x) => ['+', '-', '*', '/'].includes(x))
  const loai = ops.length === 1 ? ({ '+': 'cong', '-': 'tru', '*': 'nhan', '/': 'chia' })[ops[0]] : ops.length === 2 && !t.includes('(') && ops.every((o) => o === '+') ? 'cong' : undefined
  return { v, tokens: t, loai }
}
