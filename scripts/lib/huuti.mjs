// Chuẩn hoá ĐÁP SỐ HỮU TỈ từ text kho (LaTeX lộn xộn) → giá trị chuẩn để SO GIÁ TRỊ, không so chuỗi.
// Spec: spec-mcq-form.md §5.0. Dùng cho verify distractor ≠ key (bắt ca 4/8 vs 1/2, 0,5 vs 1/2, -a/b vs a/-b).
// Thuần JS, không phụ thuộc — test: node --test scripts/lib/
//
// Nhận:  số nguyên · thập phân "0,25"/"0.25" · \dfrac{a}{b} / \frac{a}{b} / \tfrac / a/b · dấu - trước, trong tử,
//        trong mẫu, trong ngoặc \left( \right) · tập nghiệm tách ";" hoặc "hoặc" hoặc "," (khi cả 2 vế parse được
//        và không phải dấu thập phân) · tiền tố "x =" / "x1 =" bị bỏ.
// Trả:   { ok:true, kind:'don'|'tap', values:[{p,q}], canon:'-17/2' | '{-8/27,-1/27}' }  (q>0, tối giản, tập sắp tăng)
//        { ok:false, ly_do }   — KHÔNG đoán (§1.5): chữ, %, đơn vị, căn, nhiều ý a)/b), hỗn số… đều fail.

function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] } return a }
function rat(p, q) {
  if (q === 0n) return null
  if (q < 0n) { p = -p; q = -q }
  const g = gcd(p, q) || 1n
  return { p: p / g, q: q / g }
}
const cmp = (a, b) => { const l = a.p * b.q, r = b.p * a.q; return l < r ? -1 : l > r ? 1 : 0 }
export const ratStr = (r) => (r.q === 1n ? `${r.p}` : `${r.p}/${r.q}`)
export const ratEq = (a, b) => cmp(a, b) === 0

// Làm sạch LaTeX bao ngoài; giữ lại phần số học.
function clean(s) {
  return String(s ?? '')
    .replace(/\$/g, '')
    .replace(/\\left|\\right|\\,|\\;|\\!|\\ |~/g, '')
    .replace(/\\displaystyle/g, '')
    .replace(/[−–]/g, '-')          // unicode minus / en dash
    .replace(/\\cdot/g, '*')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.。]$/, '')          // dấu chấm hết câu
    .trim()
}

// 1 giá trị: trả {p,q} hoặc null.
function parseOne(raw) {
  let s = clean(raw).replace(/ /g, '')
  s = s.replace(/^[a-zA-Z]\d?=/, '')                      // x= / x1=
  if (!s) return null
  // Bóc ngoặc tròn bao toàn bộ: (-5/4)
  while (/^\((.*)\)$/.test(s) && balanced(s.slice(1, -1))) s = s.slice(1, -1)
  // Dấu đứng trước
  let sign = 1n
  while (s[0] === '-' || s[0] === '+') { if (s[0] === '-') sign = -sign; s = s.slice(1) }
  while (/^\((.*)\)$/.test(s) && balanced(s.slice(1, -1))) s = s.slice(1, -1)
  // \dfrac{A}{B}
  let m = s.match(/^\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}$/)
  if (m) return frac(m[1], m[2], sign)
  // A/B
  m = s.match(/^([^/]+)\/([^/]+)$/)
  if (m) return frac(m[1], m[2], sign)
  const v = parseDec(s)
  return v ? rat(sign * v.p, v.q) : null
}
function matchBrace(s, i) { let d = 0; for (let k = i; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}') { d--; if (d === 0) return k } } return -1 }
function balanced(s) { let d = 0; for (const ch of s) { if (ch === '(') d++; else if (ch === ')') { d--; if (d < 0) return false } } return d === 0 }
function frac(a, b, sign) {
  const na = parseSigned(a), nb = parseSigned(b)
  if (!na || !nb) return null
  const r = rat(na.p * nb.q, na.q * nb.p)
  return r ? rat(sign * r.p, r.q) : null
}
function parseSigned(s) {
  s = s.replace(/ /g, '')
  while (/^\((.*)\)$/.test(s)) s = s.slice(1, -1)
  let sign = 1n
  while (s[0] === '-' || s[0] === '+') { if (s[0] === '-') sign = -sign; s = s.slice(1) }
  const m = s.match(/^\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}$/)
  if (m) return frac(m[1], m[2], sign)
  const v = parseDec(s)
  return v ? rat(sign * v.p, v.q) : null
}
// Số nguyên / thập phân (dấu , hoặc .) — KHÔNG nhận "1.000" kiểu phân cách nghìn (mơ hồ → fail).
function parseDec(s) {
  if (/^\d+$/.test(s)) return rat(BigInt(s), 1n)
  const m = s.match(/^(\d*)[,.](\d+)$/)
  if (!m) return null
  const whole = m[1] || '0', dec = m[2]
  return rat(BigInt(whole + dec), 10n ** BigInt(dec.length))
}

// Tách tập nghiệm. "0,25" là thập phân, "1, 2" là tập → chỉ tách theo "," khi có khoảng trắng sau hoặc 2 vế đều parse.
function splitSet(s) {
  s = clean(s)
  if (/;/.test(s)) return s.split(/;/)
  if (/\bhoặc\b|\bhoac\b|\bvà\b|\bva\b|\bor\b/i.test(s)) return s.split(/\bhoặc\b|\bhoac\b|\bvà\b|\bva\b|\bor\b/i)
  if (/,\s/.test(s)) {
    const parts = s.split(/,\s+/)
    if (parts.every((p) => parseOne(p))) return parts
  }
  return [s]
}

export function parseHuuTi(text) {
  let s = clean(text)
  if (!s) return { ok: false, ly_do: 'trống' }
  // "{a; b}" bao ngoài tập nghiệm (khác ngoặc của \dfrac) → bóc; "\pm a" → tập {-a, a}
  if (s[0] === '{' && matchBrace(s, 0) === s.length - 1) s = s.slice(1, -1).trim()
  const pm = s.match(/^\\pm\s*(.+)$/)
  if (pm) s = `-(${pm[1]}); ${pm[1]}`
  if (/[a-wyzA-WYZ]\)/.test(s) || /\b[ab]\)/.test(s)) return { ok: false, ly_do: 'nhiều ý a)/b)' }
  if (/\\sqrt|√/.test(s)) return { ok: false, ly_do: 'có căn' }
  if (/%/.test(s)) return { ok: false, ly_do: 'phần trăm' }
  if (/\\pi|π/.test(s)) return { ok: false, ly_do: 'có π' }
  const parts = splitSet(s).map((p) => p.trim()).filter(Boolean)
  const values = []
  for (const p of parts) {
    const v = parseOne(p)
    if (!v) return { ok: false, ly_do: `không parse được "${p}"` }
    values.push(v)
  }
  if (!values.length) return { ok: false, ly_do: 'trống' }
  if (values.length === 1) return { ok: true, kind: 'don', values, canon: ratStr(values[0]) }
  values.sort(cmp)
  for (let i = 1; i < values.length; i++) if (ratEq(values[i - 1], values[i])) return { ok: false, ly_do: 'tập có giá trị lặp' }
  return { ok: true, kind: 'tap', values, canon: `{${values.map(ratStr).join(',')}}` }
}

// HÌNH THỨC hiển thị của 1 phương án (so "cùng hình thức" — theo TEXT, không theo giá trị):
// 'tap' (≥2 giá trị) · 'phan_so' (có \frac hoặc a/b) · 'thap_phan' (có , hoặc . giữa số) · 'nguyen'.
export function hinhThuc(text) {
  const s = clean(text)
  const p = parseHuuTi(s)
  if (p.ok && p.kind === 'tap') return 'tap'
  if (/\\[dt]?frac|\d\/\d/.test(s)) return 'phan_so'
  if (/\d[,.]\d/.test(s)) return 'thap_phan'
  return 'nguyen'
}
