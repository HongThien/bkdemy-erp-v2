// BỘ ĐỌC LỜI GIẢI THEO DẤU `=` cho Điền Ô (spec-dien-o.md §0.4, §1) — dùng chung cho script ĐO (_do_dien_o_tp.mjs) và
// script SINH (mcq-dien.mjs) — "hai luồng dùng chung một bộ đọc" (spec §4).
//   tachChuoi(loiGiai)  → đoạn `$…$` → mảnh theo `=` → chuỗi (nối nhãn A=… qua nhiều dòng), kèm OFFSET tuyệt đối
//   timO(chuoi)         → ứng viên ô: số ở mảnh k = giá trị 1 biểu thức con KHÔNG lá của mảnh k−1 (và chưa là lá ở k−1)
//   timToken(raw, v)    → vị trí văn bản của số có giá trị v trong mảnh raw (để đục lỗ đúng chỗ, khoá = văn bản + lần xuất hiện)
//   fmtNhu(token, rat)  → in 1 giá trị theo ĐÚNG kiểu viết của token gốc (125.000 / 230\ 000 / 0,8 / \dfrac)
import { parse, ev, canonOf } from '../mcq-auto.mjs'

// Chuẩn hoá 1 MẢNH biểu thức (giữa 2 dấu `=`) cho parse() của mcq-auto. Không dùng mathOf() vì nó cắt tới dấu ':' đầu
// tiên khi không có `$` (mất "150000 :" của phép chia). Lớp 7 viết tiền "125.000"/"230\ 000" (phân cách nghìn) — nhận
// diện theo KHUÔN \d{1,3}([ .]\d{3})+ chứ không theo dạng. "20\%" → (20/100).
export function chuanManh(s) {
  return String(s).replace(/[−–]/g, '-')
    .replace(/\\left|\\right|\\,|\\;|\\!|\\quad|\\displaystyle|~/g, ' ').replace(/\\ /g, ' ')
    .replace(/\\text\{[^}]*\}/g, ' ')
    .replace(/(\d{1,3})(?:[ .](\d{3}))+(?!\d)/g, (m) => m.replace(/[ .]/g, ''))
    .replace(/(\d+(?:,\d+)?)\s*\\%/g, '($1/100)')
    .replace(/\\cdot|\\times/g, '*').replace(/\\div/g, ':')
    .replace(/\\\{|\[/g, '(').replace(/\\\}|\]/g, ')')
    .replace(/\s+/g, ' ').trim().replace(/[.;,]$/, '').trim()
}
// Ký hiệu KHÔNG phải phép tính số — mảnh chứa nó là "quan hệ/ký hiệu", parser số không đọc được (đếm để biết cần gì).
const KY_HIEU = [['...', /\.\.\.|\\ldots|\\cdots|\\dots/], ['⋮', /\\vdots|\\mid|⋮/], ['∈', /\\in\b|∈/], ['≥≤', /\\ge|\\le|\\geq|\\leq|≥|≤/],
  ['⇒', /\\Rightarrow|\\Leftrightarrow|⇒|⇔/], ['Ư/B()', /\b[UƯB]C?\s*\(/], ['{}', /\\\{|\\\}/], ['chữ', /[a-wyzA-Z]{2,}/], ['^{n}', /\^\{[^}]*[a-z][^}]*\}/], ['array', /\\begin/]]
export function lyDoKhongDoc(manh) {
  const raw = String(manh).replace(/\\(dfrac|frac|tfrac|sqrt|left|right|cdot|times|div|text)/g, '')
  for (const [ten, re] of KY_HIEU) if (re.test(raw)) return ten
  return null
}
export const val = (n) => { try { const v = ev(n, { rule: null }); return v ? canonOf(v) : null } catch { return null } }
// "Lá" = 1 GIÁ TRỊ viết sẵn, không phải phép tính: số, -số, \dfrac{số}{số} (phân số trần — "rút gọn 2/4 → 1/2" không phải ô, spec §1
// "bỏ ô mà bước trước đã là cùng giá trị viết khác"), và ngoặc bọc quanh lá.
const laSo = (n) => !!n && (n.t === 'num' || (n.t === 'neg' && n.a?.t === 'num'))
export const laLa = (n) => !n || n.t === 'x' || laSo(n) || (n.t === 'frac' && laSo(n.a) && laSo(n.b)) || (n.t === 'neg' && n.a?.t === 'frac' && laSo(n.a.a) && laSo(n.a.b)) || (n.t === 'paren' && laLa(n.a))
// mọi biểu thức con KHÔNG phải lá, kèm giá trị (paren bị bỏ qua — nút trong nó đã tính)
export function subs(n, out = []) { if (laLa(n)) return out; if (n.t !== 'paren') { const v = val(n); if (v) out.push({ n, v }) } for (const k of ['a', 'b']) if (n[k]) subs(n[k], out); return out }
export function leaves(n, out = []) { if (!n) return out; if (laLa(n) && n.t !== 'paren') { const v = val(n); if (v) out.push(v); return out } for (const k of ['a', 'b']) if (n[k]) leaves(n[k], out); return out }

// Lời giải → { text (đã chuẩn xuống dòng), dong: [{start,end,text}], chuoi: [{ nhan, tim_x, manh: [{ raw, start, end, dong, tree|null, ly_do }] }] }
export function tachChuoi(loiGiai) {
  const text = String(loiGiai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = []; let p = 0
  for (const l of text.split('\n')) { dong.push({ start: p, end: p + l.length, text: l }); p += l.length + 1 }
  const dongCua = (pos) => dong.findIndex((d) => pos >= d.start && pos <= d.end)
  const chuoi = []; let cur = null
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const inner = m[1], base = m.index + 1
    if (!inner.includes('=')) { chuoi.push({ nhan: null, khong_dau_bang: true, manh: [{ raw: inner.trim(), start: base, end: base + inner.length, dong: dongCua(base), tree: null, ly_do: 'không có =' }] }); cur = null; continue }
    // tách theo `=` GIỮ offset
    const parts = []; let off = 0
    for (const seg of inner.split('=')) { const lead = seg.length - seg.trimStart().length; const raw = seg.trim(); parts.push({ raw, start: base + off + lead, end: base + off + lead + raw.length }); off += seg.length + 1 }
    let nhan = null, timX = false
    if (/^[A-Z]$/.test(parts[0].raw)) nhan = parts.shift().raw
    else if (/^[xy]$/.test(parts[0].raw)) { nhan = parts.shift().raw; timX = true }
    const items = parts.map((pt) => {
      const it = { ...pt, dong: dongCua(pt.start), tree: null, ly_do: null }
      const ly = lyDoKhongDoc(pt.raw); if (ly) { it.ly_do = ly; return it }
      try { it.tree = parse(chuanManh(pt.raw)) } catch (e) { it.ly_do = 'parse: ' + e.message.slice(0, 30) }
      return it
    })
    if (nhan && cur && cur.nhan === nhan) cur.manh.push(...items)
    else { cur = { nhan, tim_x: timX, manh: items }; chuoi.push(cur) }
  }
  return { text, dong, chuoi }
}
// Ứng viên ô trong 1 chuỗi: { k, v, n (nút biểu thức con ở mảnh k−1), la_dap_so (mảnh k là 1 số trần), ca_manh (n là cả mảnh k−1) }
export function timO(chuoi) {
  const o = [], m = chuoi.manh
  for (let k = 1; k < m.length; k++) {
    if (!m[k].tree || !m[k - 1].tree) continue
    const sv = new Map(); for (const s of subs(m[k - 1].tree)) if (!sv.has(s.v)) sv.set(s.v, s.n) // nút NGOÀI CÙNG (duyệt trước) thắng
    const goc = m[k - 1].tree.t === 'paren' ? m[k - 1].tree.a : m[k - 1].tree
    for (const v of new Set(leaves(m[k].tree))) if (sv.has(v)) o.push({ k, v, n: sv.get(v), la_dap_so: laLa(m[k].tree), ca_manh: sv.get(v) === goc })
  }
  return o
}
// Tìm TOKEN số trong mảnh raw có giá trị canonical v → { start, end, token } (offset TƯƠNG ĐỐI trong raw), lần xuất hiện đầu.
// Token: \dfrac{a}{b} | số có nghìn (125.000 / 230\ 000 / 1 100 000) | thập phân 0,8 | số nguyên; dấu '-' đứng trước
// tính vào token nếu trước nó là đầu chuỗi / '(' / '=' (số âm trần), không phải phép trừ.
export function timToken(raw, v) {
  const s = String(raw); let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (ch === '\\' && /^\\[dt]?frac/.test(s.slice(i))) {
      const j = s.indexOf('{', i); let d = 0, k = j, n = 0
      for (; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}') { d--; if (d === 0) { n++; if (n === 2) break; } } }
      if (n === 2) { const tok = s.slice(i, k + 1); const st = lui(s, i); if (thu(s.slice(st, k + 1), v)) return { start: st, end: k + 1, token: s.slice(st, k + 1) }; i = k + 1; continue }
      i++; continue
    }
    if (/\d/.test(ch) && !(i > 0 && /[\d,]/.test(s[i - 1])) && !(i > 1 && s[i - 1] === '.' && /\d/.test(s[i - 2]))) {
      let k = i
      for (;;) {
        while (k < s.length && /\d/.test(s[k])) k++
        if (s[k] === ',' && /\d/.test(s[k + 1] ?? '')) { k++; continue }
        if (s[k] === '.' && /\d/.test(s[k + 1] ?? '')) { k++; continue } // 125.000 (nghìn) hay 0.8 (thập phân chấm) — đều nuốt, giá trị do chuanManh quyết
        if (s.startsWith('\\ ', k) && /^\d{3}(?!\d)/.test(s.slice(k + 2))) { k += 2; continue }
        if (s[k] === ' ' && /^\d{3}(?!\d)/.test(s.slice(k + 1))) { k++; continue }
        break
      }
      const st = lui(s, i)
      if (thu(s.slice(st, k), v)) return { start: st, end: k, token: s.slice(st, k) }
      i = k; continue
    }
    i++
  }
  return null
  function lui(s, i) { let j = i - 1; while (j >= 0 && s[j] === ' ') j--; if (j >= 0 && s[j] === '-') { let q = j - 1; while (q >= 0 && s[q] === ' ') q--; if (q < 0 || '(={'.includes(s[q])) return j } return i }
  function thu(tok, v) { try { return val(parse(chuanManh(tok))) === v } catch { return false } }
}
const group = (s, sep) => s.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
// In giá trị hữu tỉ r theo kiểu viết của token gốc.
export function fmtNhu(token, r) {
  const neg = r.p < 0n, ap = neg ? -r.p : r.p, sg = neg ? '-' : ''
  if (r.q === 1n) {
    const s = String(ap)
    if (/\d\\ \d{3}/.test(token)) return sg + group(s, '\\ ')
    if (/\d \d{3}/.test(token)) return sg + group(s, ' ')
    if (/\d\.\d{3}/.test(token)) return sg + group(s, '.')
    return sg + s
  }
  if (/\\[dt]?frac/.test(token)) return `${sg}\\dfrac{${ap}}{${r.q}}`
  // thập phân hữu hạn ≤ 4 chữ số (mẫu chỉ có 2 và 5) → "0,8" (hoặc "0.8" nếu token gốc dùng dấu chấm thập phân); còn lại → \dfrac
  let q = r.q, n2 = 0, n5 = 0; while (q % 2n === 0n) { q /= 2n; n2++ } while (q % 5n === 0n) { q /= 5n; n5++ }
  if (q === 1n && Math.max(n2, n5) <= 4) { const k = Math.max(n2, n5); const scaled = ap * 10n ** BigInt(k) / r.q; const s = scaled.toString().padStart(k + 1, '0'); return sg + s.slice(0, s.length - k) + (thapPhanCham(token) ? '.' : ',') + s.slice(s.length - k) }
  return `${sg}\\dfrac{${ap}}{${r.q}}`
}
// "0.8"/"25.5" = thập phân dấu CHẤM (không phải nghìn: sau chấm không phải đúng 3 chữ số rồi hết)
const thapPhanCham = (t) => /^-?\d+\.\d+$/.test(String(t).trim()) && !/\.\d{3}$/.test(String(t).trim())
// Hình thức hiển thị của 1 token (so "cùng kiểu"): phan_so / thap_phan / nguyen
export const kieuToken = (t) => (/\\[dt]?frac/.test(t) ? 'phan_so' : /\d,\d/.test(t) || thapPhanCham(String(t).replace(/^\$|\$$/g, '')) ? 'thap_phan' : 'nguyen')
// In nút AST ra LaTeX (để staff thấy ô đang hỏi "phép tính con nào")
export function texNode(n) {
  switch (n.t) {
    case 'num': return n.dec ? (Number(n.v.p) / Number(n.v.q)).toFixed(n.dec).replace('.', ',') : n.v.q === 1n ? `${n.v.p}` : `\\dfrac{${n.v.p}}{${n.v.q}}`
    case 'x': return 'x'
    case 'paren': return `\\left(${texNode(n.a)}\\right)`
    case 'neg': return `-${texNode(n.a)}`
    case 'frac': return `\\dfrac{${texNode(n.a)}}{${texNode(n.b)}}`
    case 'sqrt': return `\\sqrt{${texNode(n.a)}}`
    case 'abs': return `\\left|${texNode(n.a)}\\right|`
    case 'pow': return `${texNode(n.a)}^{${n.n}}`
    case 'bin': return `${texNode(n.a)} ${n.op === '*' ? '\\cdot' : n.op === '/' ? ':' : n.op} ${texNode(n.b)}`
    default: return '?'
  }
}
