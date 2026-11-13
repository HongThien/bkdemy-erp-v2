import { pool, form, luu } from './lib.mjs'
const BS = String.fromCharCode(92), P = pool(), out = []
// ---- bộ tính biểu thức số nguyên có biến: + - * . : ^ ( ) [ ] { }, nhân ngầm (3ab, 2(x+1)) ----
function tinh(src, vars = {}) {
  const s = src.replace(new RegExp(BS + BS + 'cdot', 'g'), '*').replace(new RegExp(BS + BS + '(left|right)', 'g'), '').replace(new RegExp(BS + BS + '[{}]', 'g'), '()'.slice(0, 0))
    .replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/\[/g, '(').replace(/\]/g, ')').replace(/\{/g, '(').replace(/\}/g, ')')
  let i = 0
  const peek = () => s[i]
  function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const o = s[i++]; const t = term(); v = o === '+' ? v + t : v - t } return v }
  function term() {
    let v = unary()
    for (;;) {
      const c = peek()
      if (c === '*' || c === '.') { i++; v *= unary() } else if (c === ':') { i++; const d = unary(); if (d === 0 || v % d !== 0) throw new Error('chia'); v /= d } else if (c && (/[a-z(]/.test(c))) { v *= pow() } else break
    }
    return v
  }
  function unary() { if (peek() === '-') { i++; return -unary() } if (peek() === '+') { i++; return unary() } return pow() }
  function pow() { const b = atom(); if (peek() === '^') { i++; const e = peek() === '{' ? (i++, expr()) : atom(); return b ** e } return b }
  function atom() {
    const c = peek()
    if (c === '(') { i++; const v = expr(); if (peek() !== ')') throw new Error('ngoặc'); i++; return v }
    if (/\d/.test(c)) { let j = i; while (/\d/.test(s[j] || '')) j++; const v = +s.slice(i, j); i = j; return v }
    if (/[a-z]/.test(c)) { i++; if (!(c in vars)) throw new Error('biến ' + c); return vars[c] }
    throw new Error('ký tự ' + c + ' ở ' + i)
  }
  const v = expr(); if (i !== s.length) throw new Error('thừa ' + s.slice(i)); return v
}
const mk = (v, rule, duong_sai) => (v === null || !Number.isFinite(v) ? null : { text: String(v), rule, duong_sai })
const safe = (f) => { try { return f() } catch { return null } }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01311')) {
  const segs = c.noi_dung.split('$')
  let e = (segs[1] || '').replace(/^[A-Z]\s*=\s*/, '')
  const sau = c.noi_dung.replace(/^[^$]*\$[^$]*\$/, '')
  const vars = {}; const abs = {}
  for (const m of sau.replace(/\$/g, '').matchAll(/([a-z])\s*=\s*([^;,.]+(?:\([^)]*\))?)/g)) { const v = safe(() => tinh(m[2])); if (v === null) { vars.__bad = 1 } else { vars[m[1]] = v; abs[m[1]] = Math.abs(v) } }
  if (vars.__bad) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được giá trị biến' }); continue }
  const dung = safe(() => tinh(e, vars))
  if (dung === null || String(dung) !== c.dap_an.trim().replace(/[−–]/g, '-')) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  const terms = e.replace(/\s/g, '').match(/[+-]?(?:\([^()]*(?:\([^()]*\)[^()]*)*\)|[^+-])+/g) || []
  out.push(form(c.ma_cau, String(dung), [
    mk(safe(() => tinh(e, abs)), 'R04', 'bỏ dấu âm của giá trị biến khi thay vào biểu thức'),
    e.includes('-(') ? mk(safe(() => tinh(e.replace(/-\(/g, '+('), vars)), 'R01', 'phá ngoặc có dấu trừ đằng trước mà không đổi dấu các số hạng') : null,
    terms.length > 1 ? mk(safe(() => tinh(terms.slice(0, -1).join(''), vars)), 'R24', 'sót hạng tử cuối của biểu thức') : null,
    mk(safe(() => tinh(e.replace(/[+-]/, (m) => (m === '+' ? '-' : '+')), vars)), 'R52', 'nhầm phép tính: đổi dấu cộng/trừ đầu tiên'),
    mk(dung >= 0 ? dung + 10 : dung - 10, 'R05', 'sai phép cộng/trừ có nhớ (lệch 10)'),
    mk(-dung, 'R10', 'đổi dấu kết quả'),
  ].filter(Boolean)))
}
luu('k6_b3_bieuthuc', out)
