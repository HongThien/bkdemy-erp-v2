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
function rootR(a, k) {
  if (!a) return null
  const ng = a.p < 0n
  if (ng && k % 2 === 0) return null
  const p = iroot(ng ? -a.p : a.p, k), q = iroot(a.q, k)
  if (p == null || q == null) return null
  return R(ng ? -p : p, q)
}

// ── Tokenizer / Parser ────────────────────────────────────────────────────────────────────────────────────────
function mathOf(noiDung) {
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
    if (ch === '^') { i++; while (s[i] === ' ') i++; if (s[i] === '{') { const e = braceArg(); T.push({ k: 'pow', v: e.trim() }) } else { T.push({ k: 'pow', v: s[i] }); i++ } continue }
    if ('+-*:/()='.includes(ch)) { T.push({ k: ch === ':' ? '/' : ch }); i++; continue }
    if (ch === '{' || ch === '}') { T.push({ k: ch === '{' ? '(' : ')' }); i++; continue } // ngoặc nhóm trần {…} (Word xuất) = ngoặc tròn
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
    if (t.k === '(') { const e = expr(); if (!peek() || next().k !== ')') throw new Error('thiếu )'); return { t: 'paren', a: e } }
    if (t.k === '-') return { t: 'neg', a: power() }
    if (t.k === '+') return power()
    throw new Error(`token lạ ${t.k}`)
  }
  function power() {
    let a = atom()
    while (peek()?.k === 'pow') { const n = Number(next().v); if (!Number.isInteger(n) || n < 0 || n > 10000) throw new Error('số mũ lạ'); a = { t: 'pow', a, n } }
    return a
  }
  const juxta = () => { const p = peek(); return p && (p.k === 'x' || p.k === 'frac' || p.k === '(') }
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
const hasX = (n) => !n ? false : n.t === 'x' ? true : n.t === 'eq' ? hasX(n.L) || hasX(n.R) : ['neg', 'paren', 'pow'].includes(n.t) ? hasX(n.a) : n.t === 'bin' || n.t === 'frac' ? hasX(n.a) || hasX(n.b) : false
const countX = (n) => !n ? 0 : n.t === 'x' ? 1 : n.t === 'eq' ? countX(n.L) + countX(n.R) : ['neg', 'paren', 'pow'].includes(n.t) ? countX(n.a) : n.t === 'bin' || n.t === 'frac' ? countX(n.a) + countX(n.b) : 0
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
  if (n.t === 'paren') return peel(n.a, targets, ctx)
  if (n.t === 'neg') return peel(n.a, targets.map(neg), ctx)
  if (n.t === 'pow') {
    const out = []
    for (const t of targets) {
      if (n.n % 2 === 0) {
        if (isNeg(t)) return null
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
function solve(eqn, ctx) {
  if (countX(eqn) > 1) { const s = solveLin(eqn, ctx); if (!s) return null; s.sort(cmp); return s }
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
}
const UU_TIEN = {
  T107010201: ['R06', 'R26', 'R07', 'R04', 'R10'], T107010202: ['R10', 'R08', 'R27', 'R11', 'R26', 'R09', 'R06'], T107010203: ['R19', 'R20', 'R06', 'R26', 'R08', 'R10', 'R04'],
  T107010206: ['R01', 'R06', 'R27', 'R26', 'R04', 'R07', 'R10'], T107010207: ['R23', 'R08', 'R27', 'R10', 'R06', 'R09', 'R26'], T107010301: ['R02', 'R16', 'R03', 'R18', 'R15', 'R17', 'R13', 'R14', 'R06'],
  T107010401: ['R03', 'R12', 'R02', 'R01', 'R16', 'R18', 'R14', 'R08', 'R10', 'R11', 'R04', 'R13'], T107010403: ['R19', 'R01', 'R20', 'R11', 'R12', 'R10', 'R06', 'R08', 'R04'],
  T107010404: ['R21', 'R19', 'R16', 'R22', 'R20', 'R03', 'R02', 'R01'],
}
const ALL = ['R01', 'R02', 'R03', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21', 'R22', 'R23', 'R26', 'R27', 'R04', 'R24', 'R05']
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
    return null
  }
  const v = ev(tree, ctx); if (!v || !ctx.fired) return null
  return { v, fired: ctx.fired }
}

// ── API cho script khác (mcq-clone-doi-so.mjs): tính đáp số 1 đề, format giá trị ────────────────────────────
export function tinh(noiDung) {
  try {
    const tree = parse(mathOf(noiDung))
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
const out = [], bo = [], lech = []
for (const q of pool.cau) {
  if (onlyDang && q.dang_chinh !== onlyDang) continue
  if (debug && q.ma_cau !== debug) continue
  const key = parseHuuTi(q.dap_an); if (!key.ok) { bo.push([q.ma_cau, 'đáp số kho không parse']); continue }
  let tree, treeFlat = null, m
  try { m = mathOf(q.noi_dung); tree = parse(m); try { treeFlat = parse(m, true) } catch { treeFlat = null } }
  catch (e) { bo.push([q.ma_cau, `parse: ${e.message}`]); continue }
  if (tree.t === 'eq' && countX(tree) < 1) { bo.push([q.ma_cau, 'phương trình không có x']); continue }
  if (tree.t !== 'eq' && hasX(tree)) { bo.push([q.ma_cau, 'có x nhưng không có =']); continue }
  let correct; try { correct = tree.t === 'eq' ? solve(tree, { rule: null }) : ev(tree, { rule: null }) } catch { correct = null }
  if (!correct) { bo.push([q.ma_cau, 'không tính được']); continue }
  const cc = canonOf(correct)
  if (cc !== key.canon) { lech.push([q.ma_cau, cc, key.canon, m.slice(0, 70)]); bo.push([q.ma_cau, `máy ra ${cc} ≠ đáp số kho ${key.canon}`]); continue }
  const kind = kindOf(correct)
  const uu = UU_TIEN[q.dang_chinh] ?? []
  const order = [...uu, ...ALL.filter((r) => !uu.includes(r))]
  const cands = []; const seen = new Set([cc])
  for (const r of order) {
    let res; try { res = evalRule(tree, treeFlat, r) } catch { res = null }
    if (!res || !res.v) continue
    let v = res.v; let c = canonOf(v)
    if (seen.has(c) && res.alt) { v = res.alt; c = canonOf(v) }
    if (seen.has(c)) continue
    seen.add(c); cands.push({ r, v, c, k: kindOf(v), ds: res.fired || DS[r] })
  }
  if (debug) { console.log(m); console.log('đúng', cc, kind); for (const c of cands) console.log('  ', c.r, c.c, c.k, '|', c.ds) }
  // chọn 3: ưu tiên không dự phòng; ≥1 cùng kiểu với đáp án; tập → tối đa 2 phương án đơn
  const pick = []
  const okAdd = (c) => {
    if (pick.length >= 3) return false
    if (kind === 'tap' && c.k !== 'tap' && pick.filter((p) => p.k !== 'tap').length >= 2) return false
    if (c.r === 'R24' && pick.some((p) => p.r === 'R24')) return false
    // giữ chỗ cho 1 cùng-kiểu: nếu đã 2 phương án khác kiểu và chưa có cùng kiểu → chỉ nhận cùng kiểu
    if (c.k !== kind && pick.length === 2 && !pick.some((p) => p.k === kind)) return false
    return true
  }
  const chinh = cands.filter((c) => !DU_PHONG.has(c.r)), dp = cands.filter((c) => DU_PHONG.has(c.r))
  for (const c of [...chinh.filter((c) => c.k === kind), ...chinh.filter((c) => c.k !== kind)]) if (okAdd(c)) pick.push(c)
  // sắp lại theo thứ tự ưu tiên rule để đường sai "mạnh" đứng trước
  for (const c of [...dp.filter((c) => c.k === kind), ...dp.filter((c) => c.k !== kind)]) if (okAdd(c)) pick.push(c)
  if (pick.length < 3 || !pick.some((p) => p.k === kind)) { bo.push([q.ma_cau, `chỉ tìm được ${pick.length} distractor hợp lệ (${cands.map((c) => c.r + '=' + c.c).join(', ')})`]); continue }
  pick.sort((a, b) => order.indexOf(a.r) - order.indexOf(b.r))
  const L = ['A', 'B', 'C', 'D']; const pos = L.reduce((mm, l) => (counts[l] ?? 0) < (counts[mm] ?? 0) ? l : mm, 'A'); counts[pos] = (counts[pos] ?? 0) + 1
  const pi = L.indexOf(pos)
  const lua_chon = []; let di = 0
  for (let i = 0; i < 4; i++) {
    if (i === pi) lua_chon.push({ text: texOf(correct), dung: true })
    else { const d = pick[di++]; lua_chon.push({ text: texOf(d.v), dung: false, rule: d.r, duong_sai: d.ds }) }
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
