// SINH TỰ ĐỘNG phiên bản trắc nghiệm (distractor theo lỗi) cho câu TÍNH TOÁN / TÌM X lớp 7 — spec-mcq-form.md §5.
//   node scripts/mcq-auto.mjs pool.json --out kq.json [--dang T107010401] [--debug T107010403052]
// pool.json = kết quả `mcq-sinh.mjs --list`. Sau đó: `mcq-sinh.mjs --verify kq.json` rồi `--ghi`.
//
// VÌ SAO máy tính thay vì tính tay: 460 câu × 4 phép tính — tay sai lặt vặt là chuyện chắc chắn; máy tính đúng
// (đáp án đúng PHẢI khớp đáp số kho — nếu lệch thì BỎ câu, không đoán §1.5; lệch cũng là cách phát hiện ĐÁP SỐ KHO SAI)
// và mỗi distractor là KẾT QUẢ THẬT của một đường tính sai áp nhất quán lên biểu thức (misconception-based, spec §4).
//
// Mô hình: parse LaTeX → AST → eval(AST, rule) với rule làm méo ĐÚNG MỘT quy tắc toán tại mọi nút áp dụng được.
// Tìm x: 1 lần xuất hiện x, bóc dần từ gốc (peel); rule tìm-x (R19/R20/R21/R22/R16-căn) can thiệp lúc bóc, rule số
// (R03/R06/R08/R10/R11/…) can thiệp lúc tính hằng VÀ lúc gộp hằng với vế kia (binVal dùng chung). Kết quả tập → "a; b".
// Hình thức: đáp án đúng phải có ≥1 distractor CÙNG kiểu (nguyên/phân số/tập); kiểu khác được phép (xem verify).
import { readFileSync, writeFileSync } from 'node:fs'
import { parseHuuTi } from './lib/huuti.mjs'
import { tinhTuanHoan, layTron, soSanhTimXY, phanTichNguyenTo, chuanHoaFactorText, evalFactorText, nhanBietNguyenToHopSo, chuanHoaTapText, evalTapText, uclnBcnnDinhNghia, tapUcBc, uocBoiCoBan, ucBcCoBan, tongTapHopNhoHon } from './lib/mini-dang.mjs'

// ── Rat (BigInt) ──────────────────────────────────────────────────────────────────────────────────────────────
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] } return a }
const R = (p, q = 1n) => { if (q === 0n) return null; if (q < 0n) { p = -p; q = -q } const g = gcd(p, q) || 1n; return { p: p / g, q: q / g } }
const add = (a, b) => (a && b) ? R(a.p * b.q + b.p * a.q, a.q * b.q) : null
const sub = (a, b) => (a && b) ? R(a.p * b.q - b.p * a.q, a.q * b.q) : null
const mul = (a, b) => (a && b) ? R(a.p * b.p, a.q * b.q) : null
const div = (a, b) => (a && b && b.p !== 0n) ? R(a.p * b.q, a.q * b.p) : null
const neg = (a) => a ? R(-a.p, a.q) : null
const abs = (a) => a ? R(a.p < 0n ? -a.p : a.p, a.q) : null
const isNeg = (a) => !!a && a.p < 0n
const isInt = (a) => !!a && a.q === 1n
const eq = (a, b) => !!a && !!b && a.p === b.p && a.q === b.q
const cmp = (a, b) => { const l = a.p * b.q, r = b.p * a.q; return l < r ? -1 : l > r ? 1 : 0 }
const powR = (a, n) => {
  if (!a) return null; if (n === 0) return R(1n)
  if (n > 60 && !((a.p === 1n || a.p === -1n || a.p === 0n) && a.q === 1n)) return null // (−1)^2023 được, 3^2023 thì không
  if (n > 60) return R(a.p === -1n && n % 2 === 1 ? -1n : a.p === 0n ? 0n : 1n)
  let p = 1n, q = 1n; for (let i = 0; i < n; i++) { p *= a.p; q *= a.q } return R(p, q)
}
const str = (r) => r.q === 1n ? `${r.p}` : `${r.p}/${r.q}`
const fmtV = (r) => r ? str(r) : '?'
function iroot(n, k) {
  if (n < 0n) return null; if (n < 2n) return n
  let lo = 0n, hi = n
  while (lo < hi) { const mid = (lo + hi + 1n) / 2n; let m = 1n; for (let i = 0; i < k; i++) m *= mid; if (m <= n) lo = mid; else hi = mid - 1n }
  let m = 1n; for (let i = 0; i < k; i++) m *= lo
  return m === n ? lo : null
}
// base^k = target (base nguyên dương >1, target nguyên dương) — tìm k bằng cách NHÂN DẦN (không log thật, đủ cho
// lớp 7: đề luôn cho target LÀ MỘT LUỸ THỪA ĐẸP của base). Không tìm được trong 200 bước ⇒ không phải (bỏ, không đoán).
function discreteLog(base, target) {
  let acc = R(1n), k = 0
  while (k <= 200) { if (eq(acc, target)) return k; acc = mul(acc, base); k++ }
  return null
}
function rootR(a, k) {
  if (!a) return null
  const ng = a.p < 0n
  if (ng && k % 2 === 0) return null
  const p = iroot(ng ? -a.p : a.p, k), q = iroot(a.q, k)
  if (p == null || q == null) return null
  return R(ng ? -p : p, q)
}

// ── Tokenizer / Parser ────────────────────────────────────────────────────────────────────────────────────────
// opts.chamLaNhan: lớp 6 (số tự nhiên) viết phép nhân bằng DẤU CHẤM (`9.6 − 81:3³` = 54 − 3), không phải số thập phân —
// bật theo DẠNG (whitelist trong kho-quet-dapso.mjs), mặc định tắt để lớp 5/7 vẫn đọc "9.6" là 9,6.
function mathOf(noiDung, opts = {}) {
  let s = String(noiDung ?? '').replace(/\r/g, ' ')
  const n = (s.match(/\$/g) || []).length
  if (n >= 2) { // "Tìm $x$ biết: $…$" → nhiều đoạn $…$ → lấy đoạn DÀI NHẤT (biểu thức); đoạn lẻ cuối (mở không đóng) cũng tính
    const segs = s.split('$'); const maths = segs.filter((_, i) => i % 2 === 1); if (segs.length % 2 === 0) maths.push(segs[segs.length - 1])
    s = maths.reduce((a, b) => (b.length > a.length ? b : a), '')
  }
  else if (n === 1) s = s.slice(s.indexOf('$') + 1)
  else s = s.replace(/^[^:]*:/, '')
  s = s.replace(/\\left|\\right|\\,|\\;|\\!|\\quad|\\displaystyle|~/g, ' ')
    .replace(/\\ /g, ' ').replace(/[−–]/g, '-').replace(/\\cdot|\\times/g, '*').replace(/\\div/g, ':')
    .replace(/\\\{|\[/g, '(').replace(/\\\}|\]/g, ')')
    .replace(/\\text\{[^}]*\}/g, ' ').replace(/\s+/g, ' ').trim().replace(/[.;]$/, '').trim()
  s = s.replace(/^[A-Z]\s*=\s*/, '')
  if (opts.chamLaNhan) s = s.replace(/(\d)\s*\.\s*(?=[\dx(])/g, '$1*') // chấm trước NGOẶC hoặc x cũng là nhân ("1.(3-1)", "5.x^3"), không chỉ trước số
  return s
}
function tokenize(s) {
  const T = []; let i = 0
  const braceArg = () => {
    if (s[i] !== '{') throw new Error('thiếu { sau \\frac')
    let d = 0, j = i
    for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (d === 0) break } }
    if (d !== 0) throw new Error('ngoặc { } lệch')
    const inner = s.slice(i + 1, j); i = j + 1; return inner
  }
  while (i < s.length) {
    const ch = s[i]
    if (ch === ' ') { i++; continue }
    if (/\d/.test(ch)) { const m = s.slice(i).match(/^\d+(?:[.,]\d+)?/); T.push({ k: 'num', v: m[0] }); i += m[0].length; continue }
    if (s.startsWith('\\dfrac', i) || s.startsWith('\\frac', i) || s.startsWith('\\tfrac', i)) {
      i += s.startsWith('\\frac', i) ? 5 : 6
      while (s[i] === ' ') i++
      const a = braceArg(); while (s[i] === ' ') i++; const b = braceArg()
      T.push({ k: 'frac', a, b }); continue
    }
    if (s.startsWith('\\sqrt', i)) {
      i += 5; while (s[i] === ' ') i++
      if (s[i] === '[') throw new Error('sqrt bậc khác 2 chưa hỗ trợ')
      const a = braceArg(); T.push({ k: 'sqrt', a }); continue
    }
    if (ch === '^') { i++; while (s[i] === ' ') i++; if (s[i] === '{') { const e = braceArg(); T.push({ k: 'pow', v: e.trim() }) } else { T.push({ k: 'pow', v: s[i] }); i++ } continue }
    if ('+-*:/()='.includes(ch)) { T.push({ k: ch === ':' ? '/' : ch }); i++; continue }
    if (ch === '{' || ch === '}') { T.push({ k: ch === '{' ? '(' : ')' }); i++; continue } // ngoặc nhóm trần {…} (Word xuất) = ngoặc tròn
    // GIÁ TRỊ TUYỆT ĐỐI |…|: '|' mở/đóng giống hệt nhau — tìm '|' đóng gần nhất ở ĐỘ SÂU NGOẶC 0 (không đếm { }, chỉ ( )
    // vì {} luôn đã cân trong \frac/\sqrt trước đó; không hỗ trợ | lồng | — dữ liệu pool này không có).
    if (ch === '|') {
      let depth = 0, j = i + 1
      for (; j < s.length; j++) { if (s[j] === '(') depth++; else if (s[j] === ')') depth--; else if (s[j] === '|' && depth === 0) break }
      if (j >= s.length || s[j] !== '|') throw new Error('thiếu | đóng giá trị tuyệt đối')
      const a = s.slice(i + 1, j); i = j + 1; T.push({ k: 'abs', a }); continue
    }
    if (ch === 'x') { T.push({ k: 'x' }); i++; continue }
    throw new Error(`ký tự lạ "${s.slice(i, i + 8)}"`)
  }
  return T
}
// flat=true: mọi + - * / cùng ưu tiên, trái→phải (R12) — luỹ thừa vẫn dính số, ngoặc vẫn tôn trọng.
function parse(s, flat = false) {
  const T = tokenize(s); let i = 0
  const peek = () => T[i], next = () => T[i++]
  const numVal = (v) => { const m = v.match(/^(\d*)[.,](\d+)$/); return m ? { v: R(BigInt((m[1] || '0') + m[2]), 10n ** BigInt(m[2].length)), dec: m[2].length } : { v: R(BigInt(v)), dec: 0 } }
  function atom() {
    const t = next(); if (!t) throw new Error('hết biểu thức sớm')
    if (t.k === 'num') {
      const nv = numVal(t.v)
      // HỖN SỐ: số nguyên dính ngay \dfrac (2\dfrac{3}{4}) = 2 + 3/4 — không phải phép nhân
      if (peek()?.k === 'frac' && nv.dec === 0) { const f = next(); const fv = ev({ t: 'frac', a: parse(f.a), b: parse(f.b) }, { rule: null }); if (!fv || isNeg(fv)) throw new Error('hỗn số lạ'); return { t: 'num', v: add(nv.v, fv), dec: 0, mixed: { whole: nv.v, frac: fv } } }
      return { t: 'num', v: nv.v, dec: nv.dec }
    }
    if (t.k === 'x') return { t: 'x' }
    if (t.k === 'frac') return { t: 'frac', a: parse(t.a, flat), b: parse(t.b, flat) }
    if (t.k === 'sqrt') return { t: 'sqrt', a: parse(t.a, flat) }
    if (t.k === 'abs') return { t: 'abs', a: parse(t.a, flat) }
    if (t.k === '(') { const e = expr(); if (!peek() || next().k !== ')') throw new Error('thiếu )'); return { t: 'paren', a: e } }
    if (t.k === '-') return { t: 'neg', a: power() }
    if (t.k === '+') return power()
    throw new Error(`token lạ ${t.k}`)
  }
  function power() {
    let a = atom()
    while (peek()?.k === 'pow') {
      const tok = next()
      // Số mũ TRẦN là số nguyên (đường cũ) — không thì thử số mũ CHỨA X (vd 3^x=27, hoặc 2^{x-1}=... khối 6):
      // parse LẠI chuỗi số mũ như 1 biểu thức con (giống cách \frac parse a/b) — cơ số a là hằng, số mũ là CẢ
      // BIỂU THỨC exp; peel() sẽ tìm k rồi BÓC TIẾP exp=k (vd "x-1"=k) bằng chính peel() — không xử riêng từng dạng.
      if (/^\d+$/.test(tok.v)) { const n = Number(tok.v); if (!Number.isInteger(n) || n > 10000) throw new Error('số mũ lạ'); a = { t: 'pow', a, n }; continue }
      let expTree; try { expTree = parse(tok.v, flat) } catch { throw new Error('số mũ lạ') }
      if (!hasX(expTree)) throw new Error('số mũ lạ')
      a = { t: 'powx', a, exp: expTree }
      break
    }
    return a
  }
  const juxta = () => { const p = peek(); return p && (p.k === 'x' || p.k === 'frac' || p.k === '(' || p.k === 'sqrt' || p.k === 'abs') }
  function unary() { const p = peek(); if (p?.k === '-') { next(); return { t: 'neg', a: unary() } } if (p?.k === '+') { next(); return unary() } return power() }
  function term() {
    let a = unary()
    for (;;) {
      const p = peek()
      if (p && (p.k === '*' || p.k === '/')) { next(); a = { t: 'bin', op: p.k, a, b: unary() } }
      else if (juxta()) a = { t: 'bin', op: '*', a, b: unary() }
      else return a
    }
  }
  function expr() {
    if (flat) {
      let a = unary()
      for (;;) {
        const p = peek()
        if (p && '+-*/'.includes(p.k)) { next(); a = { t: 'bin', op: p.k, a, b: unary() } }
        else if (juxta()) a = { t: 'bin', op: '*', a, b: unary() }
        else return a
      }
    }
    let a = term()
    while (peek() && (peek().k === '+' || peek().k === '-')) { const op = next().k; a = { t: 'bin', op, a, b: term() } }
    return a
  }
  const L = expr()
  if (peek()?.k === '=') { next(); const Rr = expr(); if (i !== T.length) throw new Error('dư token'); return { t: 'eq', L, R: Rr } }
  if (i !== T.length) throw new Error(`dư token "${T[i].k}"`)
  return L
}
const hasX = (n) => !n ? false : n.t === 'x' ? true : n.t === 'powx' ? hasX(n.a) || hasX(n.exp) : n.t === 'eq' ? hasX(n.L) || hasX(n.R) : ['neg', 'paren', 'pow', 'sqrt', 'abs'].includes(n.t) ? hasX(n.a) : n.t === 'bin' || n.t === 'frac' ? hasX(n.a) || hasX(n.b) : false
const countX = (n) => !n ? 0 : n.t === 'x' ? 1 : n.t === 'powx' ? countX(n.a) + countX(n.exp) : n.t === 'eq' ? countX(n.L) + countX(n.R) : ['neg', 'paren', 'pow', 'sqrt', 'abs'].includes(n.t) ? countX(n.a) : n.t === 'bin' || n.t === 'frac' ? countX(n.a) + countX(n.b) : 0
const strip = (n) => n.t === 'paren' ? strip(n.a) : n
function flatten(n, s = 1, out = []) { if (n.t === 'bin' && (n.op === '+' || n.op === '-')) { flatten(n.a, s, out); flatten(n.b, n.op === '+' ? s : -s, out) } else out.push({ s, n }); return out }
const fmtDec = (n) => (Number(n.v.p) / Number(n.v.q)).toString().replace('.', ',')

// ── Phép 2 ngôi trên GIÁ TRỊ, có rule (dùng chung cho eval và peel) ───────────────────────────────────────────
function binVal(op, a, b, ctx) {
  const rule = ctx.rule
  const fire = (s) => { if (!ctx.fired) ctx.fired = s }
  if (!a || !b) return null
  if (op === '+' || op === '-') {
    if (rule === 'R06' && !isInt(a) && !isInt(b)) {
      const q = op === '+' ? a.q + b.q : a.q - b.q; if (q <= 0n) return null
      const v = R(op === '+' ? a.p + b.p : a.p - b.p, q); fire(`${fmtV(a)} ${op} ${fmtV(b)}: cộng/trừ tử với tử, mẫu với mẫu = ${fmtV(v)}`); return v
    }
    if (rule === 'R07' && !isInt(a) && !isInt(b) && a.q !== b.q) {
      const l = a.q * b.q / gcd(a.q, b.q); const v = R(op === '+' ? a.p + b.p : a.p - b.p, l); fire(`${fmtV(a)} ${op} ${fmtV(b)}: quy đồng mẫu ${l} nhưng giữ nguyên tử = ${fmtV(v)}`); return v
    }
    return op === '+' ? add(a, b) : sub(a, b)
  }
  if (op === '*') {
    if (rule === 'R10' && (isNeg(a) || isNeg(b))) { const v = neg(mul(a, b)); fire(`${fmtV(a)}·${fmtV(b)} lấy dấu sai = ${fmtV(v)}`); return v }
    return mul(a, b)
  }
  // '/'
  if (rule === 'R08' && !isInt(b)) { const v = mul(a, b); fire(`${fmtV(a)} : ${fmtV(b)} tính như ${fmtV(a)}·${fmtV(b)} (không nghịch đảo) = ${fmtV(v)}`); return v }
  if (rule === 'R09' && !isInt(a)) { const v = mul(div(R(1n), a), b); fire(`${fmtV(a)} : ${fmtV(b)}: nghịch đảo nhầm phân số bị chia = ${fmtV(v)}`); return v }
  if (rule === 'R10' && (isNeg(a) || isNeg(b))) { const v = neg(div(a, b)); fire(`${fmtV(a)} : ${fmtV(b)} lấy dấu sai = ${fmtV(v)}`); return v }
  return div(a, b)
}

// ── Eval với rule ─────────────────────────────────────────────────────────────────────────────────────────────
function ev(n, ctx) {
  const rule = ctx.rule
  const fire = (s) => { if (!ctx.fired) ctx.fired = s }
  switch (n.t) {
    case 'num': {
      if (rule === 'R11' && n.dec) { const v = R(n.v.p, n.v.q * 10n); fire(`đổi ${fmtDec(n)} thành ${fmtV(v)}`); return v }
      if (rule === 'R27' && n.mixed) { const v = mul(n.mixed.whole, n.mixed.frac); fire(`đổi hỗn số ${fmtV(n.mixed.whole)} ${fmtV(n.mixed.frac)} thành ${fmtV(n.mixed.whole)}·${fmtV(n.mixed.frac)} = ${fmtV(v)}`); return v }
      return n.v
    }
    case 'x': return null
    case 'powx': return null // x ở số mũ — không tính được khi KHÔNG biết x (chỉ dùng khi bóc x, xem peel())
    case 'paren': return ev(n.a, ctx)
    case 'neg': {
      const inner = strip(n.a)
      if (rule === 'R15' && inner.t === 'pow' && inner.n % 2 === 0) { const b = ev(inner.a, ctx); if (b && !isNeg(b)) { fire(`coi −${fmtV(b)}^${inner.n} là (−${fmtV(b)})^${inner.n} = ${fmtV(powR(b, inner.n))}`); return powR(b, inner.n) } }
      if (rule === 'R01' && inner.t === 'bin' && (inner.op === '+' || inner.op === '-')) {
        const terms = flatten(inner); fire('bỏ ngoặc sau dấu trừ mà không đổi dấu các hạng tử sau')
        let acc = neg(ev(terms[0].n, ctx)); for (let k = 1; k < terms.length; k++) { const v = ev(terms[k].n, ctx); acc = terms[k].s > 0 ? add(acc, v) : sub(acc, v) }
        return acc
      }
      return neg(ev(n.a, ctx))
    }
    case 'frac': {
      let a = ev(n.a, ctx), b = ev(n.b, ctx)
      if (rule === 'R26' && (isNeg(b) || isNeg(a)) && !(isNeg(a) && isNeg(b))) { fire(`${fmtV(a)}/${fmtV(b)}: bỏ qua dấu âm ở ${isNeg(b) ? 'mẫu' : 'tử'}, coi như ${fmtV(abs(a))}/${fmtV(abs(b))}`); return div(abs(a), abs(b)) }
      return div(a, b)
    }
    case 'sqrt': {
      const inner = ev(n.a, ctx); if (!inner) return null
      if (rule === 'R29') { fire(`quên khai căn, giữ nguyên ${fmtV(inner)} dưới dấu căn`); return inner }
      if (rule === 'R28') { const v = div(inner, R(2n)); fire(`coi √${fmtV(inner)} = ${fmtV(inner)} : 2 = ${fmtV(v)} (chia đôi thay vì khai căn)`); return v }
      if (rule === 'R16' && !isInt(inner)) {
        const p = iroot(inner.p < 0n ? -inner.p : inner.p, 2); if (p == null) return null
        const v = R(inner.p < 0n ? -p : p, inner.q); fire(`√${fmtV(inner)}: chỉ khai căn tử, giữ nguyên mẫu = ${fmtV(v)}`); return v
      }
      return rootR(inner, 2)
    }
    case 'abs': {
      const inner = ev(n.a, ctx); if (!inner) return null
      if (rule === 'R30' && isNeg(inner)) { fire(`|${fmtV(inner)}| giữ nguyên dấu âm bên trong = ${fmtV(inner)}`); return inner }
      return abs(inner)
    }
    case 'pow': {
      const base = strip(n.a)
      const bv = ev(n.a, ctx); if (!bv) return null
      if (rule === 'R14' && n.n === 0) { fire(`coi ${fmtV(bv)}^0 = 0`); return R(0n) }
      if (rule === 'R02' && n.n >= 2) { const v = mul(bv, R(BigInt(n.n))); fire(`coi (${fmtV(bv)})^${n.n} = ${fmtV(bv)}·${n.n} = ${fmtV(v)}`); return v }
      if (rule === 'R03' && n.n % 2 === 0 && n.n >= 2 && isNeg(bv)) { const v = neg(powR(abs(bv), n.n)); fire(`coi (${fmtV(bv)})^${n.n} = ${fmtV(v)}`); return v }
      if (rule === 'R18' && n.n % 2 === 1 && n.n >= 3 && isNeg(bv)) { const v = powR(abs(bv), n.n); fire(`coi (${fmtV(bv)})^${n.n} = ${fmtV(v)}`); return v }
      if (rule === 'R16' && !isInt(bv) && n.n >= 2) { const v = R(powR(R(bv.p), n.n).p, bv.q); fire(`(${fmtV(bv)})^${n.n}: chỉ nâng tử, ra ${fmtV(v)}`); return v }
      if (rule === 'R17' && base.t === 'pow') { const inner = ev(base.a, ctx); const v = powR(inner, base.n + n.n); fire(`(a^${base.n})^${n.n} = a^${base.n + n.n}`); return v }
      return powR(bv, n.n)
    }
    case 'bin': {
      const { op } = n
      const rb = strip(n.b)
      // a − (−b) → a − b (bỏ ngoặc quên đổi dấu, dạng 1 hạng tử)
      if (op === '-' && rule === 'R01' && rb.t === 'neg' && n.b.t === 'paren') { const a = ev(n.a, ctx), b = ev(rb.a, ctx); fire(`${fmtV(a)} − (−${fmtV(b)}) tính thành ${fmtV(a)} − ${fmtV(b)}`); return sub(a, b) }
      if (op === '-' && rule === 'R01' && rb.t === 'bin' && (rb.op === '+' || rb.op === '-') && n.b.t === 'paren') {
        const a = ev(n.a, ctx); const terms = flatten(rb); fire('bỏ ngoặc sau dấu trừ mà không đổi dấu các hạng tử sau')
        let acc = sub(a, ev(terms[0].n, ctx)); for (let k = 1; k < terms.length; k++) { const v = ev(terms[k].n, ctx); acc = terms[k].s > 0 ? add(acc, v) : sub(acc, v) }
        return acc
      }
      if (op === '+' && rule === 'R23' && strip(n.a).t === 'bin' && strip(n.a).op === '*' && rb.t === 'bin' && rb.op === '*') {
        const A = strip(n.a); const a1 = ev(A.a, ctx), a2 = ev(A.b, ctx), b1 = ev(rb.a, ctx), b2 = ev(rb.b, ctx)
        for (const [c, o1, c2, o2] of [[a1, a2, b1, b2], [a1, a2, b2, b1], [a2, a1, b1, b2], [a2, a1, b2, b1]]) if (eq(c, c2)) { const v = mul(c, mul(o1, o2)); fire(`a·b + a·c = a·(b·c) với a = ${fmtV(c)}`); return v }
      }
      if (op === '*' && rule === 'R13' && rb.t === 'pow') { const a = ev(n.a, ctx); const base = ev(rb.a, ctx); const v = powR(mul(a, base), rb.n); fire(`${fmtV(a)}·${fmtV(base)}^${rb.n}: nhân trước rồi mới luỹ thừa = ${fmtV(v)}`); return v }
      if (op === '*' && rule === 'R23' && rb.t === 'bin' && (rb.op === '+' || rb.op === '-') && n.b.t === 'paren') {
        const a = ev(n.a, ctx); const terms = flatten(rb); let acc = mul(a, ev(terms[0].n, ctx)); for (let k = 1; k < terms.length; k++) { const v = ev(terms[k].n, ctx); acc = terms[k].s > 0 ? add(acc, v) : sub(acc, v) }
        fire(`${fmtV(a)}·(…): chỉ nhân với hạng tử đầu trong ngoặc`); return acc
      }
      // a^m : a^n CÙNG CƠ SỐ, số mũ lớn (vd (1/5)^2024:(1/5)^2023): rút gọn thành a^(m-n) TRƯỚC khi tính, không
      // tính riêng từng luỹ thừa khổng lồ rồi chia (powR() chặn n>60 cho cơ số ≠ ±1/0 — không phải lỗi, là chặn
      // TÍNH SAI CÁCH: phải rút gọn bằng quy tắc, không phải nhân tay hàng nghìn lần). Áp DÙ rule nào (đây là cách
      // TÍNH ĐÚNG, không phải 1 đường sai) — không có rule nào khác pattern-match đúng "a^m : a^n" nên không đụng.
      {
        const la = strip(n.a)
        if (op === '/' && la.t === 'pow' && rb.t === 'pow') {
          const baseA = ev(la.a, ctx), baseB = ev(rb.a, ctx)
          if (baseA && baseB && eq(baseA, baseB)) {
            const d = la.n - rb.n
            const v = d >= 0 ? powR(baseA, d) : div(R(1n), powR(baseA, -d))
            if (v) return v
          }
        }
      }
      // R52: NHẦM PHÉP TÍNH — cho câu chỉ có 1 phép tính trần (vd "32·7", "255:7"), không âm/không lồng để các
      // rule khác bắt được lỗi gì — nhân nhầm thành cộng, chia nhầm thành nhân (2 lỗi kinh điển của HS yếu).
      if (rule === 'R52' && (op === '*' || op === '/')) {
        const a = ev(n.a, ctx), b = ev(n.b, ctx)
        if (a && b) {
          const v = op === '*' ? add(a, b) : mul(a, b)
          fire(op === '*' ? `nhầm phép nhân thành phép cộng: ${fmtV(a)}+${fmtV(b)}=${fmtV(v)}` : `nhầm phép chia thành phép nhân: ${fmtV(a)}·${fmtV(b)}=${fmtV(v)}`)
          return v
        }
      }
      return binVal(op, ev(n.a, ctx), ev(n.b, ctx), ctx)
    }
  }
  return null
}

// ── Tìm x: bóc dần ─────────────────────────────────────────────────────────────────────────────────────────────
function peel(n, targets, ctx) {
  const rule = ctx.rule
  const fire = (s) => { if (!ctx.fired) ctx.fired = s }
  if (n.t === 'x') return targets
  if (n.t === 'powx') {
    // base^(…) = T ⇒ (…) = log_base(T) — CHỈ nhận base nguyên dương >1 và T nguyên dương (vế phải LUÔN là 1
    // luỹ thừa đẹp của cơ số, vd 3^x=27 ⇒ x=3, 2^(x-1)=2^3·4=2^5 ⇒ x-1=5). Số mũ (…) có thể là BIỂU THỨC (khối
    // 6: 2^{x-1}, 2^{x+1}…) chứ không chỉ x trần (khối 7) — tìm k = log_base(T) rồi BÓC TIẾP (…) = k bằng
    // chính peel() (tái dùng mọi rule R19/R20… của biểu thức tuyến tính, không viết riêng).
    const base = ev(n.a, ctx); if (!base || !isInt(base) || base.p <= 1n) return null
    const ks = []
    for (const t of targets) {
      if (!isInt(t) || t.p <= 0n) return null
      if (rule === 'R36') { fire(`${fmtV(base)}^(…) = ${fmtV(t)} quên phép luỹ thừa, coi (…) = ${fmtV(t)}`); ks.push(t); continue }
      if (rule === 'R37') { const v = div(t, base); if (!v) return null; fire(`${fmtV(base)}^(…) = ${fmtV(t)} coi luỹ thừa là nhân, (…) = ${fmtV(t)} : ${fmtV(base)} = ${fmtV(v)}`); ks.push(v); continue }
      const k = discreteLog(base, t); if (k == null) return null
      ks.push(R(BigInt(k)))
    }
    const res = []; for (const k of ks) { const s = peel(n.exp, [k], ctx); if (!s) return null; res.push(...s) }
    return res
  }
  if (n.t === 'paren') return peel(n.a, targets, ctx)
  if (n.t === 'neg') return peel(n.a, targets.map(neg), ctx)
  if (n.t === 'pow') {
    const out = []
    for (const t of targets) {
      if (n.n % 2 === 0) {
        if (isNeg(t)) return null
        if (rule === 'R34') { fire(`(…)^${n.n} = ${fmtV(t)} quên khai căn, coi (…) = ${fmtV(t)}`); out.push(t); continue }
        let r
        if (rule === 'R16') { const p = iroot(t.p, n.n); if (p == null) return null; r = R(p, t.q); fire(`căn bậc ${n.n} của ${fmtV(t)}: chỉ lấy căn tử = ${fmtV(r)}`) }
        else r = rootR(t, n.n)
        if (!r) return null
        if (rule === 'R21') { fire(`(…)^${n.n} = ${fmtV(t)} chỉ lấy nghiệm dương ${fmtV(r)}, thiếu nghiệm âm`); out.push(r) } else out.push(r, neg(r))
      } else {
        let r
        if (rule === 'R16') { const p = iroot(t.p < 0n ? -t.p : t.p, n.n); if (p == null) return null; r = R(t.p < 0n ? -p : p, t.q); fire(`căn bậc ${n.n} của ${fmtV(t)}: chỉ lấy căn tử = ${fmtV(r)}`) }
        else r = rootR(t, n.n)
        if (!r) return null
        if (rule === 'R22' && isNeg(r)) { fire(`căn bậc ${n.n} của ${fmtV(t)} lấy thành ${fmtV(abs(r))} (mất dấu âm)`); r = abs(r) }
        out.push(r)
      }
    }
    const res = []; for (const t of out) { const s = peel(n.a, [t], ctx); if (!s) return null; res.push(...s) }
    return res
  }
  if (n.t === 'sqrt') {
    // √(…) = T ⇒ (…) = T² (căn LUÔN không âm — T âm thì vô nghiệm, 1 nhánh duy nhất, không ± như luỹ thừa chẵn).
    const out = []
    for (const t of targets) {
      if (isNeg(t)) return null
      if (rule === 'R28') { const sq = mul(t, R(2n)); fire(`√(…) = ${fmtV(t)} ⇒ (…) = ${fmtV(t)}·2 = ${fmtV(sq)} (nhân đôi thay vì bình phương 2 vế)`); out.push(sq) }
      else if (rule === 'R35') { fire(`√(…) = ${fmtV(t)} quên bình phương 2 vế, coi (…) = ${fmtV(t)}`); out.push(t) }
      else out.push(mul(t, t))
    }
    const res = []; for (const t of out) { const s = peel(n.a, [t], ctx); if (!s) return null; res.push(...s) }
    return res
  }
  if (n.t === 'abs') {
    // |…| = T ⇒ (…) = T hoặc (…) = −T (T âm thì vô nghiệm). R21 tái dùng: chỉ lấy 1 trường hợp, giống thiếu nghiệm âm.
    // R31: đổi dấu cả 2 vế (nhầm quy tắc chuyển vế) ⇒ chỉ ra nghiệm ÂM, mất nghiệm dương — chiều ngược lại R21.
    const out = []
    for (const t of targets) {
      if (isNeg(t)) return null
      if (rule === 'R21') { fire(`|…| = ${fmtV(t)} chỉ lấy (…) = ${fmtV(t)}, thiếu trường hợp (…) = ${fmtV(neg(t))}`); out.push(t) }
      else if (rule === 'R31') { fire(`|…| = ${fmtV(t)} nhầm sang (…) = ${fmtV(neg(t))} (đổi dấu cả biểu thức), mất nghiệm (…) = ${fmtV(t)}`); out.push(neg(t)) }
      else out.push(t, neg(t))
    }
    const res = []; for (const t of out) { const s = peel(n.a, [t], ctx); if (!s) return null; res.push(...s) }
    return res
  }
  if (n.t === 'frac' || n.t === 'bin') {
    const xa = hasX(n.a), xb = hasX(n.b)
    if (xa && xb) return null
    const op = n.t === 'frac' ? '/' : n.op
    const otherNode = xa ? n.b : n.a
    const other = ev(otherNode, ctx); if (!other) return null
    const xs = xa ? n.a : n.b
    if (rule === 'R01' && op === '-' && xb && n.b.t === 'paren' && strip(n.b).t === 'bin' && ['+', '-'].includes(strip(n.b).op)) {
      const terms = flatten(strip(n.b)); const xi = terms.findIndex((t) => hasX(t.n)); if (xi < 0) return null
      fire('bỏ ngoặc sau dấu trừ mà không đổi dấu các hạng tử sau')
      const out = []
      for (const T of targets) {
        let rest = R(0n); for (let k = 0; k < terms.length; k++) if (k !== xi) { const v = ev(terms[k].n, ctx); if (!v) return null; const s = k === 0 ? -1 : terms[k].s; rest = s > 0 ? add(rest, v) : sub(rest, v) }
        const sx = xi === 0 ? -1 : terms[xi].s
        const val = sub(sub(T, other), rest); out.push(sx > 0 ? val : neg(val))
      }
      const res = []; for (const t of out) { const s = peel(terms[xi].n, [t], ctx); if (!s) return null; res.push(...s) }
      return res
    }
    const nt = targets.map((T) => {
      switch (op) {
        case '+': if (rule === 'R19') { fire(`chuyển ${fmtV(other)} sang vế kia mà không đổi dấu`); return binVal('+', T, other, ctx) } return binVal('-', T, other, ctx)
        case '-': if (xa) { if (rule === 'R19') { fire(`chuyển ${fmtV(other)} sang vế kia mà không đổi dấu`); return binVal('-', T, other, ctx) } return binVal('+', T, other, ctx) }
                  if (rule === 'R19') { fire('chuyển vế mà không đổi dấu'); return binVal('+', other, T, ctx) } return binVal('-', other, T, ctx)
        case '*': if (rule === 'R20') { fire(`x·${fmtV(other)} = ${fmtV(T)} ⇒ x = ${fmtV(other)} : ${fmtV(T)} (chia ngược)`); return binVal('/', other, T, ctx) } return binVal('/', T, other, ctx)
        case '/': if (xa) { if (rule === 'R20') { fire(`x : ${fmtV(other)} = ${fmtV(T)} ⇒ x = ${fmtV(T)} : ${fmtV(other)} (chia ngược)`); return binVal('/', T, other, ctx) } return binVal('*', T, other, ctx) }
                  if (rule === 'R20') { fire(`${fmtV(other)} : x = ${fmtV(T)} ⇒ x = ${fmtV(other)}·${fmtV(T)} (chia ngược)`); return binVal('*', other, T, ctx) } return binVal('/', other, T, ctx)
      }
    })
    if (nt.some((v) => !v)) return null
    return peel(xs, nt, ctx)
  }
  return null
}
// x xuất hiện NHIỀU lần, bậc 1 (3x + 2 = x − 1; 2/3x − 2/5 = 1/2x − 1/3): biểu diễn mỗi vế = a + b·x rồi giải.
// Phần hằng tính qua ev(ctx) nên rule số (R06/R10/R11…) vẫn áp; R19/R20 áp ở bước chuyển vế/chia.
function lin(n, ctx) {
  if (!hasX(n)) { const v = ev(n, ctx); return v ? { a: v, b: R(0n) } : null }
  switch (n.t) {
    case 'x': return { a: R(0n), b: R(1n) }
    case 'paren': return lin(n.a, ctx)
    case 'neg': { const l = lin(n.a, ctx); return l ? { a: neg(l.a), b: neg(l.b) } : null }
    case 'bin': case 'frac': {
      const op = n.t === 'frac' ? '/' : n.op
      const A = lin(n.a, ctx), B = lin(n.b, ctx); if (!A || !B) return null
      if (op === '+') return { a: add(A.a, B.a), b: add(A.b, B.b) }
      if (op === '-') return { a: sub(A.a, B.a), b: sub(A.b, B.b) }
      if (op === '*') { if (A.b.p === 0n) return { a: mul(A.a, B.a), b: mul(A.a, B.b) }; if (B.b.p === 0n) return { a: mul(B.a, A.a), b: mul(B.a, A.b) }; return null }
      if (op === '/') { if (B.b.p !== 0n) return null; return { a: div(A.a, B.a), b: div(A.b, B.a) } }
      return null
    }
    default: return null // pow của biểu thức có x → không phải bậc 1
  }
}
function solveLin(eqn, ctx) {
  const rule = ctx.rule
  const fire = (s) => { if (!ctx.fired) ctx.fired = s }
  const L = lin(eqn.L, ctx), Rr = lin(eqn.R, ctx); if (!L || !Rr) return null
  // b_L x + a_L = b_R x + a_R  ⇒  (b_L − b_R) x = a_R − a_L
  let bx = sub(L.b, Rr.b), c = sub(Rr.a, L.a)
  if (rule === 'R19') { fire('chuyển vế (gom x một bên, số một bên) mà không đổi dấu'); bx = add(L.b, Rr.b); c = add(Rr.a, L.a) }
  if (!bx || bx.p === 0n) return null
  if (rule === 'R20') { fire(`${fmtV(bx)}·x = ${fmtV(c)} ⇒ x = ${fmtV(bx)} : ${fmtV(c)} (chia ngược)`); return c.p === 0n ? null : [div(bx, c)] }
  return [div(c, bx)]
}
// ── Tìm x trong TÍCH các biểu thức bằng 0: (A)(B)=0 ⇒ A=0 hoặc B=0 ─────────────────────────────────────────────
// Khó thật sự KHÔNG phải chia cho 0 — là phải CHỨNG MINH 1 thừa số không bao giờ = 0 (vd x²+4>0 mọi x) để loại nó,
// chỉ giải thừa số còn lại; ngược lại nếu solve() cứ thử giải CẢ 2 thừa số như bình thường sẽ ra "nghiệm" sai vì
// x²+4=0 vô nghiệm thật (không phải không tính được) — phải NHẬN RA nó vô nghiệm rồi bỏ qua, không phải bó tay.
function flattenMul(n, out = []) { const s = strip(n); if (s.t === 'bin' && s.op === '*') { flattenMul(s.a, out); flattenMul(s.b, out) } else out.push(s); return out }
// Chỉ nhận diện ĐÚNG hình dạng đang gặp trong kho: tổng các hạng tử TOÀN DẤU CỘNG, mỗi hạng tử hoặc là luỹ thừa
// bậc CHẴN (≥0 luôn) hoặc hằng số DƯƠNG — không đoán cho hình dạng lạ (có dấu trừ ở bất kỳ đâu ⇒ không kết luận).
function neverZero(f, ctx) {
  const terms = flatten(strip(f)); if (terms.length < 2) return false
  let coHangDuong = false
  for (const t of terms) {
    if (t.s < 0) return false
    const s2 = strip(t.n)
    if (s2.t === 'pow' && s2.n % 2 === 0) continue
    const v = ev(s2, ctx); if (v && !isNeg(v) && v.p !== 0n) { coHangDuong = true; continue }
    return false
  }
  return coHangDuong
}
// √x xuất hiện ⇒ miền xác định x ≥ 0 cho CẢ phương trình (không chỉ riêng thừa số chứa nó).
function hasSqrtOfX(n) {
  if (!n) return false
  if (n.t === 'sqrt' && strip(n.a).t === 'x') return true
  if (n.t === 'eq') return hasSqrtOfX(n.L) || hasSqrtOfX(n.R)
  if (['neg', 'paren', 'pow', 'abs'].includes(n.t)) return hasSqrtOfX(n.a)
  if (n.t === 'bin' || n.t === 'frac') return hasSqrtOfX(n.a) || hasSqrtOfX(n.b)
  return false
}
// R33: HS KHÔNG nhận ra thừa số vô nghiệm (vd x²+4=0) — cứ chuyển vế bình thường ra (…)^n = −hằng, rồi bỏ qua dấu
// âm khi khai căn (không biết căn bậc chẵn của số âm là vô lí), ra nghiệm ẢO ±căn(hằng). Chỉ áp được khi hằng số
// chuẩn hoá đúng CHÍNH LÀ hình dạng neverZero đã nhận diện (tổng toàn dấu cộng: 1 luỹ thừa chẵn + 1 hằng dương).
function solveFactorR33(f, ctx) {
  const fire = (s) => { if (!ctx.fired) ctx.fired = s }
  const terms = flatten(strip(f))
  const powT = terms.find((t) => strip(t.n).t === 'pow' && strip(t.n).n % 2 === 0)
  if (!powT) return null
  let hangSo = R(0n)
  for (const t of terms) { if (t === powT) continue; const v = ev(strip(t.n), { rule: null }); if (!v) return null; hangSo = t.s > 0 ? add(hangSo, v) : sub(hangSo, v) }
  if (isNeg(hangSo) || hangSo.p === 0n) return null
  const powNode = strip(powT.n)
  const canBac = rootR(hangSo, powNode.n); if (!canBac) return null // hằng không phải luỹ thừa đúng bậc ⇒ HS cũng không "khai căn gọn" được, bỏ
  fire(`(…)^${powNode.n} + ${fmtV(hangSo)} = 0 không nhận ra vô nghiệm, chuyển vế (…)^${powNode.n} = −${fmtV(hangSo)} rồi bỏ qua dấu âm, khai căn ra (…) = ±${fmtV(canBac)}`)
  const res = []; for (const t of [canBac, neg(canBac)]) { const s = peel(powNode.a, [t], ctx); if (!s) return null; res.push(...s) }
  return res
}
function solveProduct(eqn, ctx) {
  const rule = ctx.rule
  const fire = (s) => { if (!ctx.fired) ctx.fired = s }
  const zero = ev(eqn.R, { rule: null }); if (!zero || zero.p !== 0n) return null // chỉ bắt dạng (…)=0, không đoán dạng khác
  const factors = flattenMul(eqn.L)
  const withX = factors.filter((f) => hasX(f)); if (withX.length < 2) return null // ≤1 thừa số có x: nhánh peel bình thường đã lo được
  let sols = [], daGiaiDuoc = false
  for (const f of withX) {
    if (neverZero(f, { rule: null })) {
      if (rule === 'R33') { const s = solveFactorR33(f, ctx); if (s) { sols.push(...s); daGiaiDuoc = true } }
      continue // chứng minh được luôn khác 0 ⇒ (trừ R33 cố tình giải nhầm) bỏ, không đóng góp nghiệm THẬT
    }
    if (countX(f) !== 1) return null // thừa số phức (x nhiều chỗ trong 1 thừa số) — ngoài phạm vi, bỏ CẢ câu, không đoán
    const s = solve({ t: 'eq', L: f, R: { t: 'num', v: R(0n), dec: 0 } }, ctx); if (!s) return null
    sols.push(...s); daGiaiDuoc = true
  }
  if (!daGiaiDuoc || !sols.length) return null
  if (hasSqrtOfX(eqn)) {
    if (rule === 'R32') fire('quên áp điều kiện miền (x≥0), giữ luôn cả nghiệm âm') // KHÔNG lọc — đúng ý lỗi R32
    else sols = sols.filter((v) => !isNeg(v)) // miền x≥0 do có √x ở đâu đó trong phương trình
  }
  if (!sols.length) return null
  sols.sort(cmp)
  const uniq = []; for (const s of sols) if (!uniq.some((u) => eq(u, s))) uniq.push(s)
  return uniq
}
function solve(eqn, ctx) {
  if (countX(eqn) > 1) {
    const p = solveProduct(eqn, ctx); if (p) return p
    const s = solveLin(eqn, ctx); if (!s) return null; s.sort(cmp); return s
  }
  const xl = hasX(eqn.L), xr = hasX(eqn.R)
  if (xl === xr) return null
  const xs = xl ? eqn.L : eqn.R, cs = xl ? eqn.R : eqn.L
  const T = ev(cs, ctx); if (!T) return null
  const sols = peel(xs, [T], ctx); if (!sols || !sols.length) return null
  sols.sort(cmp)
  const uniq = []; for (const s of sols) if (!uniq.some((u) => eq(u, s))) uniq.push(s)
  return uniq
}
const sorted = (v) => [...v].sort(cmp)
const canonOf = (v) => Array.isArray(v) ? (v.length === 1 ? str(v[0]) : `{${sorted(v).map(str).join(',')}}`) : str(v)
const texR = (r) => r.q === 1n ? `${r.p}` : `${r.p < 0n ? '-' : ''}\\dfrac{${r.p < 0n ? -r.p : r.p}}{${r.q}}`
const texOf = (v) => `$${Array.isArray(v) ? sorted(v).map(texR).join('; ') : texR(v)}$`
const kindOf = (v) => Array.isArray(v) && v.length > 1 ? 'tap' : isInt(Array.isArray(v) ? v[0] : v) ? 'nguyen' : 'phan_so'

// ── Rule → đường sai mặc định + thứ tự ưu tiên theo dạng ──────────────────────────────────────────────────────
const DS = {
  R01: 'phá ngoặc sau dấu trừ mà không đổi dấu', R02: 'coi luỹ thừa là phép nhân với số mũ', R03: 'số âm mũ chẵn vẫn ra âm',
  R04: 'cộng/trừ số khác dấu rồi lấy dấu kết quả sai', R05: 'tính nhầm ở bước cộng/trừ cuối (lệch 1 đơn vị tử số)',
  R06: 'cộng/trừ phân số bằng cách cộng tử với tử, mẫu với mẫu', R07: 'quy đồng mẫu nhưng quên nhân tử',
  R08: 'chia phân số mà không nghịch đảo (tính như nhân)', R09: 'nghịch đảo nhầm phân số bị chia thay vì phân số chia',
  R10: 'lấy dấu của phép nhân/chia sai', R11: 'đổi số thập phân sang phân số sai mẫu', R12: 'tính trái sang phải, bỏ ưu tiên nhân chia trước cộng trừ',
  R13: 'nhân trước rồi mới luỹ thừa', R14: 'coi luỹ thừa mũ 0 bằng 0', R15: 'coi −a² là (−a)²', R16: 'luỹ thừa/căn phân số chỉ làm với tử, quên mẫu',
  R17: 'lẫn cộng với nhân số mũ', R18: 'số âm mũ lẻ ra dương', R19: 'chuyển vế mà không đổi dấu', R20: 'chia ngược khi tìm x',
  R21: 'x² = k chỉ lấy nghiệm dương, thiếu nghiệm âm', R22: 'căn bậc lẻ của số âm lấy thành số dương', R23: 'phân phối sai', R24: 'sót hạng tử/thừa số cuối',
  R26: 'bỏ qua dấu âm ở mẫu hoặc tử của phân số', R27: 'đổi hỗn số sai (coi phần nguyên nhân với phần phân số)',
  R28: 'chia đôi số dưới dấu căn (hoặc bình phương sai thành nhân đôi khi tìm x)', R29: 'quên khai căn, giữ nguyên số dưới dấu căn',
  R30: 'bỏ dấu giá trị tuyệt đối mà giữ nguyên số âm bên trong',
  R31: '|…| = k đổi dấu cả biểu thức, chỉ ra nghiệm âm (mất nghiệm dương)',
  R32: 'quên áp điều kiện miền (x≥0…), giữ luôn cả nghiệm âm không hợp miền',
  R33: 'không nhận ra 1 thừa số vô nghiệm trong tích=0, cứ giải bỏ qua dấu ra nghiệm ảo',
  R34: 'quên khai căn khi giải (…)^2=k, coi (…)=k',
  R35: 'quên bình phương 2 vế khi giải √(…)=k, coi (…)=k',
  R36: 'x ở số mũ: quên phép luỹ thừa, coi a^x=k ⇒ x=k', R37: 'x ở số mũ: coi luỹ thừa là nhân, x=k:a',
  R38: 'STP tuần hoàn: coi tuần hoàn từ đầu, bỏ qua phần không lặp', R39: 'STP tuần hoàn: quên nhân 10^p ở mẫu',
  R40: 'STP tuần hoàn: quên cộng phần nguyên', R42: 'làm tròn: đếm thiếu 1 chữ số vị trí',
  R43: 'làm tròn: chặt cụt thay vì làm tròn', R44: 'làm tròn: hiểu sai độ chính xác (không nhân đôi bước)',
  R45: 'so sánh tìm x,y: quy đồng sai mẫu', R46: 'so sánh tìm x,y: liệt kê lố lên 1 số',
  R47: 'so sánh tìm x,y: liệt kê lố xuống 1 số', R48: 'làm tròn: luôn làm tròn lên bất kể chữ số kế tiếp',
  R49: 'làm tròn: đếm thừa 1 chữ số vị trí', R50: 'STP tuần hoàn: sai mẫu, dùng 10^q thay vì 10^q−1',
  R51: 'so sánh tìm x,y: lấy thẳng 2 số đầu-cuối bất đẳng thức',
  R52: 'nhầm phép tính — nhân thành cộng, chia thành nhân',
  R53: 'phân tích thừa số nguyên tố: nhầm số mũ', R54: 'phân tích thừa số nguyên tố: thừa số chưa phải số nguyên tố (chưa phân tích hết)',
  R55: 'phân tích thừa số nguyên tố: bỏ sót 1 thừa số', R56: 'phân tích thừa số nguyên tố: nhầm sang số nguyên tố khác',
  R57: 'nhận biết nguyên tố/hợp số: nhầm 0 hoặc 1 vào danh sách', R58: 'nhận biết nguyên tố/hợp số: lẫn 1 số thuộc nhóm ngược lại vào danh sách',
  R59: 'nhận biết nguyên tố/hợp số: bỏ sót 1 số đúng trong danh sách', R60: 'nhận biết nguyên tố/hợp số: đổi chỗ 1 số đúng bằng 1 số sai',
  R61: 'nhận biết nguyên tố/hợp số: liệt kê tuốt cả danh sách đề bài, không lọc',
  R62: 'ƯCLN/BCNN: nhầm ƯCLN thành BCNN (hoặc ngược lại)', R63: 'ƯCLN/BCNN: sai quy tắc số mũ ở thừa số chung',
  R64: 'ƯCLN/BCNN: bỏ sót 1 thừa số khi nhân lại', R65: 'ƯCLN/BCNN: nhân trực tiếp các số, không rút gọn (chỉ BCNN)',
  R66: 'ƯCLN/BCNN (tập theo khoảng): sai ƯCLN/BCNN gốc rồi liệt kê lại', R67: 'ƯCLN/BCNN (tập theo khoảng): nhầm khoảng mở thành đóng',
  R68: 'ƯCLN/BCNN (tập theo khoảng): bỏ sót 1 phần tử đúng', R69: 'ƯCLN/BCNN (tập theo khoảng): quên điều kiện/chỉ xét 1 phần',
  R70: 'ƯCLN/BCNN: tính nhầm bằng hiệu 2 số (a−b)', R71: 'ƯCLN/BCNN: lấy nhầm ước/bội chung nhỏ nhất/đầu tiên (1 hoặc 0)',
  R72: 'ƯCLN/BCNN (tập theo khoảng): nhầm sang tìm 1 số duy nhất thay vì liệt kê cả tập',
  R73: 'Ước/Bội: nhầm Ước thành Bội (hoặc ngược lại)', R74: 'Ước/Bội: nhầm biên đóng/mở của khoảng',
  R75: 'Ước/Bội: bỏ sót phần tử lớn nhất', R76: 'Ước/Bội: lẫn nhầm 1 số liền kề không phải ước/bội thật',
  R77: 'ƯC/BC: nhầm BCNN thành ƯCLN', R78: 'ƯC/BC: chỉ liệt kê bội của 1 trong 2 số',
  R79: 'ƯC/BC: quên số 0, bắt đầu liệt kê từ chính BCNN', R80: 'ƯC/BC: nhân trực tiếp 2 số làm BCNN',
  R81: 'Tổng tập {x<K}: quên x<K nghiêm ngặt, cộng luôn cả K', R82: 'Tổng tập {x<K}: dùng công thức Gauss nhưng quên chia đôi',
  R83: 'Tổng tập {x<K}: cộng thiếu phần tử lớn nhất', R84: 'Tổng tập {x<K}: nhầm đếm số phần tử với tính tổng',
}
const UU_TIEN = {
  T107010201: ['R06', 'R26', 'R07', 'R04', 'R10'], T107010202: ['R10', 'R08', 'R27', 'R11', 'R26', 'R09', 'R06'], T107010203: ['R19', 'R20', 'R06', 'R26', 'R08', 'R10', 'R04'],
  T107010206: ['R01', 'R06', 'R27', 'R26', 'R04', 'R07', 'R10'], T107010207: ['R23', 'R08', 'R27', 'R10', 'R06', 'R09', 'R26'], T107010301: ['R02', 'R16', 'R03', 'R18', 'R15', 'R17', 'R13', 'R14', 'R06'],
  T107010401: ['R03', 'R12', 'R02', 'R01', 'R16', 'R18', 'R14', 'R08', 'R10', 'R11', 'R04', 'R13'], T107010403: ['R19', 'R01', 'R20', 'R11', 'R12', 'R10', 'R06', 'R08', 'R04'],
  T107010404: ['R21', 'R19', 'R16', 'R22', 'R20', 'R03', 'R02', 'R01'],
  // Pool 3 — khối 6, số tự nhiên (11/09, whitelist kho-quet-dapso.mjs — chamLaNhan bắt buộc). Không có phân
  // số/âm nên rule liên quan (R06-R11,R16,R21,R22,R26,R27) tự nhiên KHÔNG fire, không cần loại tay.
  T106020201: ['R04', 'R24', 'R05'], // Cộng trừ (thường, không "thuận tiện" nên không có gì để R01/R23 bắt)
  T106020202: ['R01', 'R23', 'R04', 'R24'], // Cộng trừ (thuận tiện)
  T106020203: ['R19', 'R04', 'R24'], // Tìm x cộng trừ
  T106020301: ['R52', 'R10', 'R20', 'R24'], // Nhân chia
  T106020302: ['R23', 'R01', 'R52', 'R24'], // Nhân chia (thuận tiện)
  T106020303: ['R19', 'R20', 'R01', 'R24'], // Tìm x nhân chia
  T106020401: ['R02', 'R13', 'R14', 'R17', 'R12'], // Luỹ thừa tính toán
  T106020402: ['R02', 'R23', 'R13', 'R14', 'R17'], // Luỹ thừa (thuận tiện)
  T106020403: ['R36', 'R37', 'R19', 'R20', 'R02', 'R13'], // Tìm x luỹ thừa (có câu số mũ chứa x)
  T106020501: ['R12', 'R01', 'R02', 'R13', 'R14'], // Biểu thức chứa ngoặc
  T106020503: ['R19', 'R20', 'R01', 'R36', 'R37', 'R22', 'R16'], // Tìm x biểu thức chứa ngoặc (có câu số mũ chứa x, luỹ thừa lẻ)
  T106030302: ['R53', 'R54', 'R55', 'R56'], // Phân tích thừa số nguyên tố (ĐẶC BIỆT — đáp số là biểu thức, xem TEXT_DANG)
  T106030301: ['R57', 'R58', 'R59', 'R60', 'R61'], // Nhận biết nguyên tố/hợp số (ĐẶC BIỆT — đáp số là tập hợp số, xem TEXT_DANG)
  T106040102: ['R62', 'R63', 'R64', 'R70', 'R71'], // Tìm ƯCLN (định nghĩa/phân tích, 2 hoặc 3 số) — ĐẶC BIỆT, xem SPECIAL_DANG
  T106040202: ['R62', 'R63', 'R64', 'R65', 'R70', 'R71'], // Tìm BCNN (định nghĩa/phân tích, 2 hoặc 3 số) — ĐẶC BIỆT, xem SPECIAL_DANG
  T106040104: ['R62', 'R63', 'R64', 'R70', 'R71', 'R68', 'R69', 'R72', 'R66', 'R67'], // Tìm n lớn nhất / n<C / C<n<D qua ƯCLN — ĐẶC BIỆT, xem TEXT_DANG
  T106040204: ['R62', 'R63', 'R64', 'R65', 'R70', 'R71', 'R68', 'R69', 'R72', 'R66', 'R67'], // Tìm n nhỏ nhất / D<n<E qua BCNN — ĐẶC BIỆT, xem TEXT_DANG
  T106030101: ['R73', 'R75', 'R76', 'R74'], // Ước/Bội cơ bản của 1 số — ĐẶC BIỆT, xem TEXT_DANG
  T106040101: ['R73', 'R75', 'R76', 'R74'], // Tìm ƯC(a;b) — ĐẶC BIỆT, xem TEXT_DANG
  T106040201: ['R77', 'R78', 'R80', 'R79'], // Tìm BC(a;b) — ĐẶC BIỆT, xem TEXT_DANG
  T106010103: ['R81', 'R82', 'R83', 'R84'], // Tổng các phần tử của {x<K} — ĐẶC BIỆT, xem SPECIAL_DANG
  // Pool 2A (08/09 tiếp — spec-mcq-form.md khảo sát, mở rộng engine với √/|…|):
  '07702202202': ['R29', 'R28', 'R16', 'R03', 'R14', 'R08', 'R04', 'R10', 'R11'], // Thực hiện phép tính Căn bậc hai
  '077022022203': ['R36', 'R37', 'R33', 'R32', 'R34', 'R35', 'R28', 'R19', 'R20', 'R16', 'R11', 'R06', 'R10'], // Tìm x liên quan Căn bậc hai (nhiều câu là tích=0, vài câu x ở số mũ)
  '07702011103': ['R38', 'R39', 'R40', 'R50', 'R04'], // Viết STP tuần hoàn thành phân số (dạng ĐẶC BIỆT, không qua AST — xem SPECIAL_DANG)
  '0770201102': ['R38', 'R39', 'R40', 'R50', 'R42', 'R49', 'R43', 'R48', 'R44'], // Làm tròn STP (ĐẶC BIỆT — nguồn tuần hoàn dùng chung rule với 07702011103)
  'T107010103': ['R51', 'R45', 'R46', 'R47'], // So sánh số hữu tỉ — nhánh tìm x,y nguyên (ĐẶC BIỆT)
  '07702220320302': ['R30', 'R29', 'R28', 'R16', 'R03', 'R18', 'R08', 'R10', 'R04'], // Thực hiện phép tính GTTĐ
  '07702220320320303': ['R21', 'R31', 'R19', 'R20', 'R11', 'R06', 'R10', 'R04'], // Tìm x liên quan GTTĐ
}
const ALL = ['R01', 'R02', 'R03', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21', 'R22', 'R23', 'R26', 'R27', 'R28', 'R29', 'R30', 'R31', 'R32', 'R33', 'R34', 'R35', 'R36', 'R37', 'R38', 'R39', 'R40', 'R42', 'R43', 'R44', 'R45', 'R46', 'R47', 'R48', 'R49', 'R50', 'R51', 'R52', 'R53', 'R54', 'R55', 'R56', 'R57', 'R58', 'R59', 'R60', 'R61', 'R62', 'R63', 'R64', 'R65', 'R66', 'R67', 'R68', 'R69', 'R70', 'R71', 'R72', 'R73', 'R74', 'R75', 'R76', 'R77', 'R78', 'R79', 'R80', 'R81', 'R82', 'R83', 'R84', 'R04', 'R24', 'R05']
// Dạng có KHUÔN VĂN BẢN riêng, không phải biểu thức LaTeX chung — mini-solver ở lib/mini-dang.mjs, KHÔNG qua
// mathOf/parse/AST. Mỗi hàm nhận (noiDung, rule) → {value, text?, ds?} | null (rule=null ⇒ đáp số đúng).
const SPECIAL_DANG = { '07702011103': tinhTuanHoan, '0770201102': layTron, T107010103: soSanhTimXY, T106040102: uclnBcnnDinhNghia, T106040202: uclnBcnnDinhNghia, T106010103: tongTapHopNhoHon }
// Dạng ĐÁP SỐ LÀ BIỂU THỨC/TẬP HỢP (không phải 1 giá trị hữu tỉ) — so khớp bằng TEXT chuẩn hoá, KHÔNG qua
// Rat/canonOf (xem mini-dang.mjs: R54 của DẠNG 4 cố ý giữ nguyên giá trị số nhưng sai hình thức, so giá trị sẽ
// coi là trùng đáp án đúng). Mỗi dạng có 1 cặp {canon, val} hàm chuẩn hoá/kiểm riêng — KHÔNG dùng chung 1 cặp
// cho mọi dạng vì cú pháp đáp số khác hẳn nhau (biểu thức \cdot vs danh sách "; ").
const TEXT_DANG = { T106030302: phanTichNguyenTo, T106030301: nhanBietNguyenToHopSo, T106040104: tapUcBc, T106040204: tapUcBc, T106030101: uocBoiCoBan, T106040101: ucBcCoBan, T106040201: ucBcCoBan }
const TEXT_FN = {
  T106030302: { canon: chuanHoaFactorText, val: evalFactorText },
  T106030301: { canon: chuanHoaTapText, val: evalTapText },
  T106040104: { canon: chuanHoaTapText, val: evalTapText },
  T106040204: { canon: chuanHoaTapText, val: evalTapText },
  T106030101: { canon: chuanHoaTapText, val: evalTapText },
  T106040101: { canon: chuanHoaTapText, val: evalTapText },
  T106040201: { canon: chuanHoaTapText, val: evalTapText },
}
// Dạng khối 6 số tự nhiên: dấu CHẤM giữa 2 số là phép NHÂN (không phải thập phân) — khớp whitelist kho-quet-dapso.mjs.
const CHAM_LA_NHAN = new Set(['T106020201', 'T106020202', 'T106020203', 'T106020301', 'T106020302', 'T106020303', 'T106020401', 'T106020402', 'T106020403', 'T106020501', 'T106020503'])
const DU_PHONG = new Set(['R24', 'R05']) // chỉ dùng khi thiếu, tối đa 1 R24 (DB đánh du_phong) + 1 R05

function evalRule(tree, treeFlat, rule) {
  const ctx = { rule, fired: null }
  const correct = tree.t === 'eq' ? solve(tree, { rule: null }) : ev(tree, { rule: null })
  if (rule === 'R05') {
    const bump = (r, d) => (r.q === 1n ? add(r, R(d)) : R(r.p + d, r.q))
    const c0 = Array.isArray(correct) ? (correct.length === 1 ? correct[0] : null) : correct
    if (!c0) return null
    const away = c0.p < 0n ? -1n : 1n
    return { v: bump(c0, away), alt: bump(c0, -away), fired: DS.R05 }
  }
  if (tree.t === 'eq') {
    if (rule === 'R12') { if (!treeFlat) return null; const v = solve(treeFlat, { rule: null }); return v ? { v, fired: 'tính các vế trái sang phải, bỏ ưu tiên nhân chia' } : null }
    if (rule === 'R04') { if (!correct) return null; return { v: correct.map(neg), fired: 'lấy dấu kết quả sai khi chuyển vế / cộng trừ' } }
    if (rule === 'R24') return null
    const v = solve(tree, ctx); if (!v || !ctx.fired) return null
    return { v, fired: ctx.fired }
  }
  if (rule === 'R12') { if (!treeFlat) return null; const v = ev(treeFlat, { rule: null }); return v ? { v, fired: 'tính lần lượt trái sang phải, bỏ ưu tiên nhân chia' } : null }
  if (rule === 'R04') { const terms = flatten(strip(tree)); if (!correct || terms.length < 2 || correct.p === 0n) return null; return { v: neg(correct), fired: 'kết quả cộng/trừ lấy dấu sai' } }
  if (rule === 'R24') {
    const root = strip(tree); const terms = flatten(root)
    if (terms.length >= 2) { const last = terms[terms.length - 1]; const lv = ev(last.n, { rule: null }); if (!correct || !lv || lv.p === 0n) return null; return { v: last.s > 0 ? sub(correct, lv) : add(correct, lv), fired: `sót hạng tử cuối (${last.s > 0 ? '+' : '−'}${fmtV(lv)})` } }
    if (root.t === 'bin' && root.op === '*') { const v = ev(root.a, { rule: null }); return v ? { v, fired: `quên nhân với ${fmtV(ev(root.b, { rule: null }))}` } : null }
    if (root.t === 'bin' && root.op === '/') { const v = ev(root.a, { rule: null }); return v ? { v, fired: `quên chia cho ${fmtV(ev(root.b, { rule: null }))}, giữ nguyên số bị chia` } : null }
    if (root.t === 'frac') { const v = ev(root.a, { rule: null }); return v ? { v, fired: `quên chia cho ${fmtV(ev(root.b, { rule: null }))}, giữ nguyên tử` } : null }
    return null
  }
  const v = ev(tree, ctx); if (!v || !ctx.fired) return null
  return { v, fired: ctx.fired }
}

// ── API cho script khác (mcq-clone-doi-so.mjs): tính đáp số 1 đề, format giá trị ────────────────────────────
export function tinh(noiDung, opts = {}) {
  try {
    const tree = parse(mathOf(noiDung, opts))
    if (tree.t === 'eq' && countX(tree) < 1) return { ok: false, ly_do: 'không có x' }
    if (tree.t !== 'eq' && hasX(tree)) return { ok: false, ly_do: 'có x không có =' }
    const v = tree.t === 'eq' ? solve(tree, { rule: null }) : ev(tree, { rule: null })
    if (!v) return { ok: false, ly_do: 'không tính được' }
    return { ok: true, value: v, canon: canonOf(v) }
  } catch (e) { return { ok: false, ly_do: e.message } }
}
export const texOfValue = texOf
export { parse, mathOf, ev, solve, canonOf }

// ── Main ──────────────────────────────────────────────────────────────────────────────────────────────────────
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) main()
function main() {
const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const pool = JSON.parse(readFileSync(args[0], 'utf8'))
const onlyDang = opt('--dang'), debug = opt('--debug')
const counts = { ...pool.phan_bo_dap_an_hien_co }
const ruleUsed = {} // đếm số lần mỗi rule ĐÃ được chọn trong CẢ LÔ này — nền cho xoay vòng (Thùy 09/09).
const out = [], bo = [], lech = []
for (const q of pool.cau) {
  if (onlyDang && q.dang_chinh !== onlyDang) continue
  if (debug && q.ma_cau !== debug) continue
  // ── Dạng ĐÁP SỐ LÀ BIỂU THỨC (vd phân tích thừa số nguyên tố) — nhánh RIÊNG, so bằng TEXT, không qua parseHuuTi
  // (đáp số kho không phải 1 giá trị hữu tỉ, parseHuuTi sẽ luôn fail và loại hết câu ngay từ đầu nếu đi nhánh cũ).
  const textFn = TEXT_DANG[q.dang_chinh]
  if (textFn) {
    const fn = TEXT_FN[q.dang_chinh]
    const correctText = fn.canon(q.dap_an), nCorrect = fn.val(q.dap_an)
    let res; try { res = textFn(q.noi_dung, null) } catch { res = null }
    if (!res || !res.text) { bo.push([q.ma_cau, 'không tính được']); continue }
    const cText = fn.canon(res.text), nOurs = fn.val(res.text)
    if (nOurs == null || nCorrect == null || nOurs !== nCorrect || cText !== correctText) {
      lech.push([q.ma_cau, cText, correctText, q.noi_dung.slice(0, 70)]); bo.push([q.ma_cau, `máy ra ${cText} ≠ đáp số kho ${correctText}`]); continue
    }
    const uu = UU_TIEN[q.dang_chinh] ?? []
    const order = [...uu, ...ALL.filter((r) => !uu.includes(r))]
    const cands = []; const seen = new Set([cText])
    for (const r of order) {
      let rres; try { rres = textFn(q.noi_dung, r) } catch { rres = null }
      if (!rres || !rres.text) continue
      const c = fn.canon(rres.text); if (seen.has(c)) continue
      seen.add(c); cands.push({ r, c, ds: rres.ds || DS[r], text: rres.text })
    }
    if (debug) { console.log(q.noi_dung); console.log('đúng', cText); for (const c of cands) console.log('  ', c.r, c.c, '|', c.ds) }
    const byXoayVong = (a, b) => (ruleUsed[a.r] ?? 0) - (ruleUsed[b.r] ?? 0) || order.indexOf(a.r) - order.indexOf(b.r)
    const pick = [...cands].sort(byXoayVong).slice(0, 3)
    if (pick.length < 3) { bo.push([q.ma_cau, `chỉ tìm được ${pick.length} distractor hợp lệ (${cands.map((c) => c.r + '=' + c.c).join(', ')})`]); continue }
    for (const p of pick) ruleUsed[p.r] = (ruleUsed[p.r] ?? 0) + 1
    pick.sort((a, b) => order.indexOf(a.r) - order.indexOf(b.r))
    const L = ['A', 'B', 'C', 'D']; const pos = L.reduce((mm, l) => (counts[l] ?? 0) < (counts[mm] ?? 0) ? l : mm, 'A'); counts[pos] = (counts[pos] ?? 0) + 1
    const pi = L.indexOf(pos)
    const lua_chon = []; let di = 0
    for (let i = 0; i < 4; i++) {
      if (i === pi) lua_chon.push({ text: res.text, dung: true })
      else { const d = pick[di++]; lua_chon.push({ text: d.text, dung: false, rule: d.r, duong_sai: d.ds }) }
    }
    out.push({ ma_cau: q.ma_cau, dap_an: pos, lua_chon })
    continue
  }
  const key = parseHuuTi(q.dap_an); if (!key.ok) { bo.push([q.ma_cau, 'đáp số kho không parse']); continue }
  const special = SPECIAL_DANG[q.dang_chinh]
  let correct, correctText = null, tree = null, treeFlat = null, m = null
  if (special) {
    let sres; try { sres = special(q.noi_dung, null) } catch { sres = null }
    if (!sres || !sres.value) { bo.push([q.ma_cau, 'không tính được']); continue }
    correct = sres.value; correctText = sres.text ?? null
  } else {
    try { const opts = CHAM_LA_NHAN.has(q.dang_chinh) ? { chamLaNhan: true } : {}; m = mathOf(q.noi_dung, opts); tree = parse(m); try { treeFlat = parse(m, true) } catch { treeFlat = null } }
    catch (e) { bo.push([q.ma_cau, `parse: ${e.message}`]); continue }
    if (tree.t === 'eq' && countX(tree) < 1) { bo.push([q.ma_cau, 'phương trình không có x']); continue }
    if (tree.t !== 'eq' && hasX(tree)) { bo.push([q.ma_cau, 'có x nhưng không có =']); continue }
    try { correct = tree.t === 'eq' ? solve(tree, { rule: null }) : ev(tree, { rule: null }) } catch { correct = null }
    if (!correct) { bo.push([q.ma_cau, 'không tính được']); continue }
  }
  const cc = canonOf(correct)
  if (cc !== key.canon) { lech.push([q.ma_cau, cc, key.canon, (m ?? q.noi_dung).slice(0, 70)]); bo.push([q.ma_cau, `máy ra ${cc} ≠ đáp số kho ${key.canon}`]); continue }
  const kind = kindOf(correct)
  const uu = UU_TIEN[q.dang_chinh] ?? []
  const order = [...uu, ...ALL.filter((r) => !uu.includes(r))]
  const cands = []; const seen = new Set([cc])
  for (const r of order) {
    let res
    if (special) { let sres; try { sres = special(q.noi_dung, r) } catch { sres = null }; res = sres && sres.value ? { v: sres.value, fired: sres.ds, text: sres.text } : null }
    else { try { res = evalRule(tree, treeFlat, r) } catch { res = null } }
    if (!res || !res.v) continue
    let v = res.v; let c = canonOf(v)
    if (seen.has(c) && res.alt) { v = res.alt; c = canonOf(v) }
    if (seen.has(c)) continue
    seen.add(c); cands.push({ r, v, c, k: kindOf(v), ds: res.fired || DS[r], text: res.text })
  }
  if (debug) { console.log(m ?? q.noi_dung); console.log('đúng', cc, kind); for (const c of cands) console.log('  ', c.r, c.c, c.k, '|', c.ds) }
  // chọn 3: ưu tiên không dự phòng; ĐÚNG 1 cùng-kiểu bắt buộc (không vét hết); tập → tối đa 2 phương án đơn.
  // XOAY VÒNG (Thùy 09/09, sau ca R33 gần như không bao giờ lọt vì luôn bị rule cùng-kiểu khác chiếm hết chỗ):
  // rule đã chốt quan trọng thì phải CÓ CƠ HỘI xuất hiện — sắp theo SỐ LẦN ĐÃ DÙNG trong lô (ít dùng trước),
  // UU_TIEN chỉ còn là tiêu chí phá hoà, không phải thứ tự cứng nữa.
  const pick = []
  const okAdd = (c) => {
    if (pick.length >= 3) return false
    if (kind === 'tap' && c.k !== 'tap' && pick.filter((p) => p.k !== 'tap').length >= 2) return false
    if (c.r === 'R24' && pick.some((p) => p.r === 'R24')) return false
    if (c.k !== kind && pick.length === 2 && !pick.some((p) => p.k === kind)) return false
    return true
  }
  const byXoayVong = (a, b) => (ruleUsed[a.r] ?? 0) - (ruleUsed[b.r] ?? 0) || order.indexOf(a.r) - order.indexOf(b.r)
  const chinh = cands.filter((c) => !DU_PHONG.has(c.r)), dp = cands.filter((c) => DU_PHONG.has(c.r))
  // Bước 1: đủ ĐÚNG 1 cùng-kiểu (bắt buộc theo verify, KHÔNG vét hết — chỗ trước đây R33 hiếm khi lọt vì bị vét hết).
  const dungKieu = [...chinh].filter((c) => c.k === kind).sort(byXoayVong)[0]
  if (dungKieu) pick.push(dungKieu)
  // Bước 2: xoay vòng toàn bộ ứng viên chính còn lại (mọi kiểu) cho đủ 3.
  for (const c of chinh.filter((c) => c !== dungKieu).sort(byXoayVong)) if (okAdd(c)) pick.push(c)
  // Bước 3: hết ứng viên chính mới tới dự phòng (R24/R05) — vẫn xoay vòng trong nhóm dự phòng.
  for (const c of dp.sort(byXoayVong)) if (okAdd(c)) pick.push(c)
  if (pick.length < 3 || !pick.some((p) => p.k === kind)) { bo.push([q.ma_cau, `chỉ tìm được ${pick.length} distractor hợp lệ (${cands.map((c) => c.r + '=' + c.c).join(', ')})`]); continue }
  for (const p of pick) ruleUsed[p.r] = (ruleUsed[p.r] ?? 0) + 1
  pick.sort((a, b) => order.indexOf(a.r) - order.indexOf(b.r))
  const L = ['A', 'B', 'C', 'D']; const pos = L.reduce((mm, l) => (counts[l] ?? 0) < (counts[mm] ?? 0) ? l : mm, 'A'); counts[pos] = (counts[pos] ?? 0) + 1
  const pi = L.indexOf(pos)
  const lua_chon = []; let di = 0
  for (let i = 0; i < 4; i++) {
    if (i === pi) lua_chon.push({ text: correctText ?? texOf(correct), dung: true })
    else { const d = pick[di++]; lua_chon.push({ text: d.text ?? texOf(d.v), dung: false, rule: d.r, duong_sai: d.ds }) }
  }
  out.push({ ma_cau: q.ma_cau, dap_an: pos, lua_chon })
}
for (const [mm, r] of bo) out.push({ ma_cau: mm, bo: r })
if (!debug) writeFileSync(opt('--out', 'kq.json'), JSON.stringify(out, null, 1), 'utf8')
console.log(`Sinh ${out.length - bo.length} · bỏ ${bo.length} · phân bố ${JSON.stringify(counts)}`)
if (lech.length) { console.log(`\nMÁY ≠ KHO (${lech.length}) — soi tay:`); for (const l of lech) console.log('  ', l.join(' | ')) }
const byReason = {}; for (const [, r] of bo) { const k = r.replace(/\(.*\)/, '').replace(/máy ra .*/, 'máy ≠ kho').slice(0, 40); byReason[k] = (byReason[k] ?? 0) + 1 }
console.log('\nLý do bỏ:', byReason)
}
