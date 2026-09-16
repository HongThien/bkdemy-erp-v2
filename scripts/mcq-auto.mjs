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
import { tinhTuanHoan, layTron, soSanhTimXY, phanTichNguyenTo, chuanHoaFactorText, evalFactorText, nhanBietNguyenToHopSo, chuanHoaTapText, evalTapText, uclnBcnnDinhNghia, tapUcBc, uocBoiCoBan, ucBcCoBan, tongTapHopNhoHon, sapXepSoHuuTi, chuanHoaThuTu, evalThuTu, bacDonThuc, heSoDonThuc, demDonThucTrongDanhSach, demDongDang, phanBienDonThuc, chuanHoaPhanBien, evalPhanBien, congTruDonThucDongDang, chuanHoaDonThucKetQua, evalDonThucKetQua, congTruDaThuc, chuanHoaDaThuc, evalDaThucKetQua, nhanDonThuc, nhanDonDaThuc, nhanDaThuc, chiaDonThuc, chiaDaChoDon, chiaDaThucMotBien, chuanHoaChiaDaThuc, evalChiaDaThucKetQua, dieuKienChiaHetDonThuc, chuanHoaDkChiaHet, evalDkChiaHetKetQua, rutGonBieuThuc, timXQuaRutGon, tinhGiaTriRutGon, khaiTrienBinhPhuong, vietThanhBinhPhuong, hoanThienBinhPhuong, chuanHoaHoanThienBP, evalHoanThienBPKetQua, tachBinhPhuong, chuanHoaTachBinhPhuong, evalTachBinhPhuongKetQua, gtlnGtnnBacHai, gtlnGtnnHaiBien, khaiTrienLapPhuong, tinhGiaTriLapPhuong, vietThanhTichHieuBinhPhuong, tinhGiaTriHieuBinhPhuong, tongHieuLapPhuong, chuanHoaTongHieuLapPhuong, evalTongHieuLapPhuongKetQua, tinhGiaTriApDungLapPhuong, tongBinhLapPhuongHaiBien, tongLapPhuongCongThemHangSo, rutNhanTuChung, chuanHoaRutNhanTuChung, evalRutNhanTuChungKetQua, nhomHangTu, phanTichTamThucBac2, tachHangTuKetHop, phanTichNhamNghiem, timXPhuongTrinhTich2Hang, chuanHoaDanhSachNghiem, evalDanhSachNghiemKetQua, giaiPtBacBaQuaNhom, giaiBptBacNhat, chuanHoaBatDangThuc, evalBatDangThucKetQua, timXTichHaiNhiThuc, giaiPtQuyVeTich, gtlnGtnnBacHaiCoDieuKien, chuanHoaCapNghiem, evalCapNghiemKetQua, giaiHePtBacNhatHaiAn, tinhGiaTriCanThuc, tinhGiaTriCanThucTheoX, chuanHoaCanThucKetQua, evalCanThucKetQuaVal, timDkxdCanThuc, chuanHoaDkxdCanThuc, evalDkxdCanThucKetQua, timXPtCanThucTuyenTinh, timXPhanThucCanBac2, chuanHoaDapSoThucTe, sinhNhieuDapSoThucTe, giaiPtPhanThucBacNhat, chuanHoaPtPhanThucKetQua, evalPtPhanThucKetQua, rutGonPhanThucCan, chuanHoaRutGonCanKetQua, evalRutGonCanKetQuaVal, giaiHePtTongTich, chuanHoaHePtTongTich, evalHePtTongTichKetQua, gtnnAmGm2So, gtnnAmGm2SoNguyen, gtnnAmGm3So, gtlnAmGm3SoTich } from './lib/mini-dang.mjs'

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
    if (s2.t === 'bin' && s2.op === '*') { // hạng tử "hệ_số·x^chẵn" (vd 4x²) — cùng loại ≥0 như x^chẵn trần, KHÔNG tính là "hạng dương chắc chắn"
      const l = strip(s2.a), r = strip(s2.b)
      const powSide = (l.t === 'pow' && l.n % 2 === 0) ? l : (r.t === 'pow' && r.n % 2 === 0) ? r : null
      if (powSide) { const coefSide = powSide === l ? r : l; const cv = ev(coefSide, ctx); if (cv && !isNeg(cv) && cv.p !== 0n) continue }
    }
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
// Mọi hàm dạng TEXT_DANG/SPECIAL_DANG-tự-trả-text (hienThiDaThuc, ghepText, …) trả text TRẦN không có "$" —
// khác texOf() (luôn tự bọc). UI (MathText, xem src/screens/kho/ui.tsx) CHỈ nhận diện "$...$"/"$$...$$"
// làm vùng KaTeX; text trần có "^"/"_" hiện ra caret/underscore thô ngoài đời — PHẢI bọc trước khi ghi DB.
const wrapMath = (t) => (t == null ? t : /^\$.*\$$/s.test(t) ? t : `$${t}$`)
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
  R85: 'Sắp xếp: so sánh nhầm 2 số âm (quên đổi dấu)', R86: 'Sắp xếp: so sánh nhầm 2 số dương (quy đồng sai)',
  R87: 'Sắp xếp: giảm dần thay vì tăng dần', R88: 'Sắp xếp: đặt 0 sai vị trí',
  R89: 'Bậc đơn thức: bỏ sót 1 biến khi cộng số mũ', R90: 'Bậc đơn thức: quên nhân số mũ ngoài luỹ thừa (…)^n',
  R91: 'Bậc đơn thức: lấy tích số mũ thay vì tổng', R92: 'Hệ số đơn thức: bỏ dấu âm',
  R93: 'Hệ số đơn thức: quên luỹ thừa hệ số trong ngoặc', R94: 'Hệ số đơn thức: quên nhân hệ số ngoài',
  R95: 'Đếm đơn thức: đếm nhầm gồm cả đa thức', R96: 'Đếm đơn thức: đếm thiếu 1 đơn thức thật',
  R97: 'Đếm đơn thức: không tính hằng số đơn thuần là đơn thức', R98: 'Đồng dạng: đếm nhầm thêm 1',
  R99: 'Đồng dạng: đếm thiếu 1', R130: 'Đồng dạng: nhầm phải cùng hệ số mới đồng dạng',
  R131: 'Bậc đơn thức: cộng thừa 1 (dự phòng)', R132: 'Hệ số đơn thức: lệch 1 đơn vị (dự phòng)',
  R133: 'Đếm đơn thức: đếm thừa 2 (dự phòng)', R134: 'Đồng dạng: đếm mọi đơn thức hợp lệ, không so phần biến (dự phòng)',
  R105: 'Bậc đa thức: quên gộp hạng tử đồng dạng triệt tiêu trước khi tìm bậc', R106: 'Bậc đa thức: cộng bậc các hạng tử thay vì lấy lớn nhất',
  R107: 'Bậc đa thức: đếm số hạng tử thay vì lấy bậc', R108: 'Bậc đa thức: lệch 1 đơn vị (dự phòng)',
  R109: 'Phần biến: quên nhân số mũ trong ngoặc với luỹ thừa ngoài', R110: 'Phần biến: bỏ sót 1 biến',
  R111: 'Phần biến: sai lệch số mũ của 1 biến',
  R112: 'Hệ số cao nhất: quên khai triển (phân phối) trước khi tìm', R113: 'Hệ số cao nhất: nhầm lấy hạng tử bậc thấp nhất',
  R114: 'Hệ số cao nhất: nhầm dấu khi phân phối', R115: 'Hệ số cao nhất: lệch 1 đơn vị (dự phòng)',
  R116: 'Hệ số đơn thức: nhầm số mũ biến đầu tiên là hệ số', R118: 'Phần biến: hoán đổi nhầm số mũ giữa 2 biến',
  R119: 'Hệ số cao nhất: lấy hệ số hạng tử đầu tiên viết trong đề',
  R120: 'Đếm đơn thức: chỉ tính đơn thức viết đơn giản',
  R121: 'Cộng trừ đơn thức đồng dạng: cộng luôn cả số mũ của biến', R122: 'Cộng trừ đơn thức đồng dạng: đảo ngược phép tính',
  R123: 'Cộng trừ đơn thức đồng dạng: bỏ dấu âm của kết quả', R124: 'Cộng trừ đơn thức đồng dạng: lệch 1 đơn vị (dự phòng)',
  R125: 'Cộng trừ đơn thức đồng dạng: chỉ lấy hạng tử đầu, quên cộng/trừ hạng tử còn lại',
  R126: 'Cộng trừ đa thức: quên đổi dấu khi phá ngoặc trừ (chỉ đổi hạng tử đầu)', R127: 'Cộng trừ đa thức: đảo ngược toàn bộ phép tính',
  R128: 'Cộng trừ đa thức: chỉ lấy đa thức đầu, quên các đa thức còn lại', R129: 'Cộng trừ đa thức: lệch 1 đơn vị ở hệ số bậc cao nhất (dự phòng)',
  R135: 'Nhân đơn thức: nhân số mũ thay vì cộng', R136: 'Nhân đơn thức: cộng hệ số thay vì nhân',
  R137: 'Nhân đơn thức: chỉ lấy nhân tử đầu, quên nhân các nhân tử còn lại', R138: 'Nhân đơn thức: lệch 1 đơn vị ở hệ số (dự phòng)',
  R139: 'Nhân đơn-đa thức: chỉ nhân hạng tử đầu, quên phân phối hết', R140: 'Nhân đơn-đa thức: quên đổi dấu ở các hạng tử sau',
  R141: 'Nhân đơn-đa thức: nhân số mũ biến chung thay vì cộng', R142: 'Nhân đơn-đa thức: lệch 1 đơn vị ở hệ số bậc cao nhất (dự phòng)',
  R143: 'Nhân đa-đa thức: chỉ nhân hạng tử đầu các đa thức sau', R144: 'Nhân đa-đa thức: quên đổi dấu các đa thức sau',
  R145: 'Nhân đa-đa thức: nhân số mũ biến chung thay vì cộng', R146: 'Nhân đa-đa thức: lệch 1 đơn vị ở hệ số bậc cao nhất (dự phòng)',
  R147: 'Chia đơn thức: cộng số mũ thay vì trừ', R148: 'Chia đơn thức: quên đổi dấu hệ số khi mẫu âm',
  R149: 'Chia đơn thức: quên chia hệ số, chỉ trừ số mũ', R150: 'Chia đơn thức: lệch 1 đơn vị ở hệ số (dự phòng)',
  R151: 'Chia đa-đơn thức: chỉ chia hạng tử đầu, quên chia hết', R152: 'Chia đa-đơn thức: cộng số mũ thay vì trừ',
  R153: 'Chia đa-đơn thức: quên chia hệ số từng hạng tử', R154: 'Chia đa-đơn thức: lệch 1 đơn vị ở hệ số bậc cao nhất (dự phòng)',
  R155: 'Chia đa thức dài: dừng sau 1 bước', R156: 'Chia đa thức dài: nhầm dấu khi trừ mỗi bước',
  R157: 'Chia đa thức dài: quên ghi phần dư', R158: 'Chia đa thức dài: lệch 1 đơn vị ở hệ số đầu của thương (dự phòng)',
  R159: 'Điều kiện chia hết: quên xét hạng tử còn lại', R160: 'Điều kiện chia hết: tưởng 1 giá trị, lấy cận dưới',
  R161: 'Điều kiện chia hết: tưởng 1 giá trị, lấy cận trên', R162: 'Điều kiện chia hết: lệch cận dưới 1 đơn vị (dự phòng)',
  R163: 'Điều kiện chia hết: lệch cả khoảng lên 1 đơn vị',
  R164: 'Rút gọn biểu thức: quên đổi dấu khi trừ cụm đã nhân', R165: 'Rút gọn biểu thức: chỉ nhân hạng tử đầu, quên phân phối hết',
  R166: 'Rút gọn biểu thức: nhân số mũ biến chung thay vì cộng', R167: 'Rút gọn biểu thức: lệch 1 đơn vị ở hệ số bậc cao nhất (dự phòng)',
  R168: 'Tìm x: quên đổi dấu khi chuyển vế hằng số', R169: 'Tìm x: chỉ nhân hạng tử đầu, quên phân phối hết',
  R170: 'Tìm x: quên chia hệ số của x', R171: 'Tìm x: lệch nghiệm 1 đơn vị (dự phòng)',
  R172: 'Tính giá trị: chỉ nhân hạng tử đầu, quên phân phối hết', R173: 'Tính giá trị: quên đổi dấu khi trừ cụm đã nhân',
  R174: 'Tính giá trị: hoán đổi nhầm giá trị thế 2 biến', R175: 'Tính giá trị: lệch kết quả 1 đơn vị (dự phòng)',
  R176: 'Tính giá trị: lệch kết quả 1 đơn vị chiều ngược lại (dự phòng)', R177: 'Tính giá trị: sai dấu kết quả cuối cùng',
  R178: 'Bình phương tổng/hiệu: quên hạng tử giữa', R179: 'Bình phương tổng/hiệu: nhầm dấu hạng tử giữa',
  R180: 'Bình phương tổng/hiệu: nhân đôi thay vì bình phương', R181: 'Bình phương tổng/hiệu: lệch 1 đơn vị ở hệ số bậc cao nhất (dự phòng)',
  R182: 'Viết thành bình phương: quên căn hệ số bậc 2', R183: 'Viết thành bình phương: nhầm dấu hạng tự do',
  R184: 'Viết thành bình phương: quên căn hạng tự do', R185: 'Viết thành bình phương: lệch 1 đơn vị hạng tự do (dự phòng)',
  R186: 'Viết thành bình phương: lệch 1 đơn vị hệ số biến',
  R187: 'Hoàn thiện bình phương: quên bình phương B', R188: 'Hoàn thiện bình phương: nhầm dấu hạng tự do',
  R189: 'Hoàn thiện bình phương: quên nhân đôi căn A', R190: 'Hoàn thiện bình phương: lệch 1 đơn vị hạng tự do (dự phòng)',
  R191: 'Hoàn thiện bình phương: lệch 1 đơn vị hệ số biến',
  R192: 'Hoàn thiện bình phương (giữa): quên nhân 2', R193: 'Hoàn thiện bình phương (giữa): nhầm dấu hạng tự do',
  R194: 'Hoàn thiện bình phương (giữa): quên căn A', R195: 'Hoàn thiện bình phương (giữa): lệch 1 đơn vị (dự phòng)',
  R196: 'Hoàn thiện bình phương (đầu): quên bình phương √A', R197: 'Hoàn thiện bình phương (đầu): nhầm dấu hạng tự do',
  R198: 'Hoàn thiện bình phương (đầu): quên nhân đôi căn C', R199: 'Hoàn thiện bình phương (đầu): lệch 1 đơn vị (dự phòng)',
  R200: 'Tách bình phương: quên trừ lại phần thừa', R201: 'Tách bình phương: nhầm dấu p',
  R202: 'Tách bình phương: quên chia 2 khi tìm p', R203: 'Tách bình phương: lệch 1 đơn vị hằng số (dự phòng)',
  R204: 'GTLN-GTNN bậc 2: quên trừ lại phần thừa', R205: 'GTLN-GTNN bậc 2: nhầm dấu phần bù',
  R206: 'GTLN-GTNN bậc 2: quên chia 2 khi tìm p', R207: 'GTLN-GTNN bậc 2: lệch 1 đơn vị (dự phòng)',
  R208: 'GTLN-GTNN 2 biến: quên hạng chéo khi tìm cực trị', R209: 'GTLN-GTNN 2 biến: nhầm dấu điểm cực trị',
  R210: 'GTLN-GTNN 2 biến: quên hệ số 2 trong định thức', R211: 'GTLN-GTNN 2 biến: lệch 1 đơn vị (dự phòng)',
  R212: 'Lập phương: quên 2 hạng tử giữa', R213: 'Lập phương: nhầm dấu 1 hạng tử giữa',
  R214: 'Lập phương: nhân 3 thay vì lập phương', R215: 'Lập phương: lệch 1 đơn vị hệ số bậc cao nhất (dự phòng)',
  R216: 'Hoàn thiện lập phương: quên khai căn', R217: 'Hoàn thiện lập phương: nhầm dấu b',
  R218: 'Hoàn thiện lập phương: quên căn bậc ba A', R219: 'Hoàn thiện lập phương: lệch 1 đơn vị b (dự phòng)',
  R220: 'Hoàn thiện lập phương: lệch 1 đơn vị b chiều ngược lại',
  R221: 'Tính giá trị lập phương: sai dấu kết quả', R222: 'Tính giá trị lập phương: lệch 1 đơn vị (dự phòng)',
  R223: 'Tính giá trị lập phương: lệch 1 đơn vị chiều ngược lại', R224: 'Tính giá trị lập phương: quên hạng tử hằng số',
  R225: 'Hiệu 2 bình phương: hiểu nhầm thành bình phương', R226: 'Hiệu 2 bình phương: quên căn hệ số A',
  R227: 'Hiệu 2 bình phương: quên căn hằng số C', R228: 'Hiệu 2 bình phương: lệch 1 đơn vị hạng tự do (dự phòng)',
  R229: 'Khai triển hiệu 2 bình phương: chỉ nhân hạng đầu', R230: 'Khai triển hiệu 2 bình phương: nhân số mũ thay vì cộng',
  R231: 'Khai triển hiệu 2 bình phương: nhầm dấu trừ thành cộng', R232: 'Khai triển hiệu 2 bình phương: lệch 1 đơn vị (dự phòng)',
  R233: 'Hiệu 2 bình phương: lệch 1 đơn vị hệ số biến',
  R234: 'Nhân nhanh hiệu 2 bình phương: quên trừ bình phương khoảng cách', R235: 'Nhân nhanh hiệu 2 bình phương: nhầm dấu cộng thay vì trừ',
  R236: 'Nhân nhanh hiệu 2 bình phương: lệch 1 đơn vị (dự phòng)', R237: 'Nhân nhanh hiệu 2 bình phương: lệch 1 đơn vị chiều ngược lại',
  R238: 'Tính giá trị hiệu 2 bình phương: sai dấu kết quả', R239: 'Tính giá trị hiệu 2 bình phương: lệch 1 đơn vị (dự phòng)',
  R240: 'Tính giá trị hiệu 2 bình phương: lệch 1 đơn vị chiều ngược lại', R241: 'Tính giá trị hiệu 2 bình phương: quên trừ hạng tử hằng số',
  R242: 'Tổng/hiệu 2 lập phương: nhầm dấu hằng đẳng thức (đổi cả 2 nhân tử)', R243: 'Tổng/hiệu 2 lập phương: quên căn bậc ba hệ số A',
  R244: 'Tổng/hiệu 2 lập phương: nhầm dấu hạng giữa nhân tử 2', R245: 'Tổng/hiệu 2 lập phương: lệch 1 đơn vị hằng số cuối (dự phòng)',
  R246: 'Hoàn thiện tổng lập phương: quên lập phương B (LHS)', R247: 'Hoàn thiện tổng lập phương: nhầm bình phương thay vì lập phương (LHS)',
  R248: 'Hoàn thiện tổng lập phương: nhầm dấu hạng giữa nhân tử 2 (RHS)', R249: 'Hoàn thiện tổng lập phương: lệch 1 đơn vị hằng số cuối RHS (dự phòng)',
  R250: 'Nhân tử 2 (tổng/hiệu lập phương): nhầm dấu hạng giữa', R251: 'Nhân tử 2 (tổng/hiệu lập phương): quên bình phương B',
  R252: 'Nhân tử 2 (tổng/hiệu lập phương): lệch 1 đơn vị hằng số cuối (dự phòng)', R253: 'Nhân tử 2 (tổng/hiệu lập phương): lệch 1 đơn vị hệ số hạng giữa',
  R254: 'Hoàn thiện tổng/hiệu lập phương: nhầm dấu nhân tử đầu', R255: 'Hoàn thiện tổng/hiệu lập phương: quên bình phương B (nhân tử 2)',
  R256: 'Hoàn thiện tổng/hiệu lập phương: lệch 1 đơn vị hằng số cuối (dự phòng)', R257: 'Hoàn thiện tổng/hiệu lập phương: lệch 1 đơn vị hằng số nhân tử đầu',
  R258: 'Hoàn thiện tổng lập phương: lệch 1 đơn vị hệ số hạng giữa RHS',
  R259: 'Tính giá trị ứng dụng lập phương: chỉ nhân hạng đầu, quên phân phối hết', R260: 'Tính giá trị ứng dụng lập phương: hoán đổi nhầm giá trị thế 2 biến',
  R261: 'Tính giá trị ứng dụng lập phương: lệch 1 đơn vị (dự phòng)', R262: 'Tính giá trị ứng dụng lập phương: sai dấu kết quả',
  R263: 'Tìm x ứng dụng hằng đẳng thức: lệch nghiệm x trừ 1 đơn vị (rescue)',
  R264: 'Tổng bình/lập phương 2 biến: quên trừ hạng chéo, chỉ tính $(a+b)^n$', R265: 'Tổng bình/lập phương 2 biến: nhầm dấu, cộng thay vì trừ',
  R266: 'Tổng bình/lập phương 2 biến: quên hệ số nhân của hạng chéo', R267: 'Tổng bình/lập phương 2 biến: lệch 1 đơn vị (dự phòng)',
  R268: 'Tổng bình/lập phương 2 biến: lệch 1 đơn vị chiều ngược lại (rescue)', R269: 'Tổng bình/lập phương 2 biến: nhầm sang công thức bậc kia (rescue)',
  R270: 'a³+b³+K³=3Kab: quên đổi dấu a+b=K', R271: 'a³+b³+K³=3Kab: nhầm dấu hằng số cộng thêm',
  R272: 'a³+b³+K³=3Kab: quên cộng hằng số, chỉ lấy a+b', R273: 'a³+b³+K³=3Kab: lệch 1 đơn vị (dự phòng)',
  R274: 'Rút nhân tử chung: quên rút hệ số chung', R275: 'Rút nhân tử chung: rút chưa lớn nhất (1 ước của GCD)',
  R276: 'Rút nhân tử chung: quên rút 1 biến chung', R277: 'Rút nhân tử chung: nhầm dấu 1 hạng tử trong ngoặc',
  R278: 'Rút nhân tử chung: lệch 1 đơn vị hệ số bậc cao nhất trong ngoặc (dự phòng)', R280: 'Rút nhân tử chung: lệch 1 đơn vị hệ số bậc cao nhất trong ngoặc, chiều ngược lại (rescue)',
  R281: 'Nhóm hạng tử: nhầm dấu khi ghép 2 nhóm', R282: 'Nhóm hạng tử: quên phân tích/rút thêm ở phần còn lại',
  R283: 'Nhóm hạng tử: lệch 1 đơn vị / hiểu nhầm hiệu 2 bình phương thành bình phương (dự phòng)', R284: 'Nhóm hạng tử: lệch 1 đơn vị / hiểu nhầm hiệu 2 bình phương thành bình phương, chiều ngược lại',
  R285: 'Tam thức bậc hai: nhầm dấu 1 nghiệm', R286: 'Tam thức bậc hai: nhầm dấu cả 2 nghiệm',
  R287: 'Tam thức bậc hai: lệch 1 đơn vị ở 1 nghiệm (dự phòng)', R288: 'Tam thức bậc hai: lệch 1 đơn vị ở 1 nghiệm, chiều ngược lại',
  R289: 'Tách hạng tử tổng quát: nhầm dấu khi ghép 2 nhóm', R290: 'Tách hạng tử tổng quát: quên rút thêm ở phần còn lại',
  R291: 'Tách hạng tử tổng quát: lệch 1 đơn vị trong ngoặc còn lại (dự phòng)', R292: 'Tách hạng tử tổng quát: lệch 1 đơn vị trong ngoặc còn lại, chiều ngược lại',
  R293: 'Nhẩm nghiệm: nhầm dấu nghiệm nhẩm được', R294: 'Nhẩm nghiệm: nhầm dấu khi ghép nhóm ở bước phân tích tam thức bậc 2',
  R295: 'Nhẩm nghiệm: lệch 1 đơn vị hệ số ở nhân tử bậc 2 (dự phòng)', R296: 'Nhẩm nghiệm: lệch 1 đơn vị hệ số ở nhân tử bậc 2, chiều ngược lại',
  R297: 'Tìm x pt tích: quên đổi dấu nghiệm thứ nhất', R298: 'Tìm x pt tích: quên đổi dấu nghiệm thứ hai',
  R299: 'Tìm x pt tích: lệch 1 đơn vị nghiệm thứ hai (dự phòng)', R300: 'Tìm x pt tích: lệch 1 đơn vị nghiệm thứ hai, chiều ngược lại',
  R301: 'Giải pt bậc 3 qua nhóm: nhầm dấu 1 nghiệm', R302: 'Giải pt bậc 3 qua nhóm: quên xét 1 trường hợp (chỉ 2/3 nghiệm)',
  R303: 'Giải pt bậc 3 qua nhóm: lệch 1 đơn vị 1 nghiệm (dự phòng)', R304: 'Giải pt bậc 3 qua nhóm: lệch 1 đơn vị 1 nghiệm, chiều ngược lại',
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
  T107010405: ['R36', 'R37', 'R33', 'R34', 'R35'], // Tích các biểu thức bằng 0 (1 thừa số vô nghiệm × 1 thừa số x ở số mũ) — tái dùng nguyên rule đã có
  '07702011103': ['R38', 'R39', 'R40', 'R50', 'R04'], // Viết STP tuần hoàn thành phân số (dạng ĐẶC BIỆT, không qua AST — xem SPECIAL_DANG)
  '0770201102': ['R38', 'R39', 'R40', 'R50', 'R42', 'R49', 'R43', 'R48', 'R44'], // Làm tròn STP (ĐẶC BIỆT — nguồn tuần hoàn dùng chung rule với 07702011103)
  'T107010103': ['R51', 'R45', 'R46', 'R47', 'R85', 'R86', 'R87', 'R88'], // So sánh số hữu tỉ — trộn: tìm x,y nguyên (SPECIAL_DANG) + sắp xếp tăng dần (TEXT_DANG)
  T108010102: ['R89', 'R90', 'R91', 'R105', 'R106', 'R107', 'R131', 'R108'], // Bậc đơn thức/đa thức (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108010103: ['R92', 'R93', 'R94', 'R109', 'R110', 'R111', 'R112', 'R113', 'R114', 'R116', 'R118', 'R119', 'R132', 'R115'], // Hệ số/phần biến/hệ số cao nhất đơn-đa thức (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG+TEXT_DANG
  T108010101: ['R95', 'R96', 'R97', 'R120', 'R133'], // Đếm đơn thức trong danh sách (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108010104: ['R98', 'R99', 'R130', 'R134'], // Đếm đơn thức đồng dạng (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108010201: ['R121', 'R122', 'R123', 'R125', 'R124'], // Cộng trừ đơn thức đồng dạng (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010202: ['R126', 'R127', 'R128', 'R129'], // Cộng trừ đa thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010301: ['R135', 'R136', 'R137', 'R138'], // Nhân đơn thức với đơn thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010302: ['R139', 'R140', 'R141', 'R142'], // Nhân đơn thức với đa thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010303: ['R143', 'R144', 'R145', 'R146'], // Nhân đa thức với đa thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010401: ['R147', 'R148', 'R149', 'R150'], // Chia đơn thức cho đơn thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010402: ['R151', 'R152', 'R153', 'R154'], // Chia đa thức cho đơn thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010403: ['R155', 'R156', 'R157', 'R158'], // Chia đa thức cho đa thức một biến (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010404: ['R159', 'R160', 'R161', 'R162', 'R163'], // Điều kiện chia hết đơn thức (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010501: ['R164', 'R165', 'R166', 'R167'], // Rút gọn biểu thức 1 biến (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108010503: ['R168', 'R169', 'R170', 'R171'], // Tìm x ứng dụng rút gọn biểu thức (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108010504: ['R172', 'R173', 'R174', 'R175', 'R176', 'R177'], // Tính giá trị biểu thức áp dụng rút gọn (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020101: ['R178', 'R179', 'R180', 'R181'], // Khai triển hằng đẳng thức bình phương tổng/hiệu (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108020102: ['R182', 'R183', 'R184', 'R185', 'R186'], // Viết biểu thức thành bình phương (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108020103: ['R187', 'R188', 'R189', 'R190', 'R191', 'R192', 'R193', 'R194', 'R195', 'R196', 'R197', 'R198', 'R199'], // Hoàn thiện biểu thức bình phương (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108020104: ['R200', 'R201', 'R202', 'R203'], // Tách biểu thức thành bình phương (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108020105: ['R204', 'R205', 'R206', 'R207'], // GTLN-GTNN của biểu thức bậc hai (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020201: ['R208', 'R209', 'R210', 'R211'], // GTLN-GTNN 2 biến độc lập (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020202: ['R208', 'R209', 'R210', 'R211'], // GTLN-GTNN 2 biến có hạng chéo (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020203: ['R208', 'R209', 'R210', 'R211'], // GTLN-GTNN 2 biến, sub-shape đơn giản (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020301: ['R212', 'R213', 'R214', 'R215', 'R216', 'R217', 'R218', 'R219', 'R220'], // Lập phương tổng/hiệu (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108020302: ['R221', 'R222', 'R223', 'R224'], // Tính giá trị biểu thức ứng dụng lập phương (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020401: ['R225', 'R226', 'R227', 'R228', 'R233', 'R229', 'R230', 'R231', 'R232'], // Viết đa thức thành tích / hiệu hai bình phương (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108040301: ['R225', 'R226', 'R227', 'R228', 'R233', 'R229', 'R230', 'R231', 'R232'], // Hằng đẳng thức (ôn tập tổng hợp khối 8, 3 câu — TÁI DÙNG NGUYÊN vietThanhTichHieuBinhPhuong/R225-233, test 3/3 khớp) — ĐẶC BIỆT, xem TEXT_DANG
  T108020402: ['R234', 'R235', 'R236', 'R237', 'R238', 'R239', 'R240', 'R241'], // Tính giá trị biểu thức ứng dụng hiệu hai bình phương (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020501: ['R242', 'R243', 'R244', 'R245', 'R246', 'R247', 'R248', 'R249', 'R258', 'R250', 'R251', 'R252', 'R253', 'R254', 'R255', 'R256', 'R257'], // Biến đổi tổng/hiệu thành tích ứng dụng tổng-hiệu 2 lập phương (khối 8) — ĐẶC BIỆT, xem TEXT_DANG
  T108020502: ['R259', 'R260', 'R261', 'R262'], // Tính giá trị biểu thức áp dụng tổng-hiệu 2 lập phương (khối 8) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020601: ['R164', 'R165', 'R166', 'R167'], // Rút gọn biểu thức ứng dụng hằng đẳng thức (khối 8) — TÁI DÙNG NGUYÊN rutGonBieuThuc/R164-167 của T108010501 (test 59/59 khớp), xem TEXT_DANG
  T108020602: ['R168', 'R169', 'R170', 'R171', 'R263'], // Tìm x ứng dụng hằng đẳng thức (khối 8) — TÁI DÙNG timXQuaRutGon/R168-171 của T108010503 + rescue R263, xem SPECIAL_DANG
  T109020101: ['R168', 'R169', 'R170', 'R171', 'R263'], // Phương trình bậc nhất một ẩn cơ bản (khối 9, 51/51 câu — TÁI DÙNG NGUYÊN timXQuaRutGon, test 51/51 khớp) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109020102: ['R168', 'R169', 'R170', 'R171', 'R263'], // Phương trình quy về bậc nhất — dạng đa thức (khối 9, 17/18 câu — TÁI DÙNG NGUYÊN timXQuaRutGon) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109020201: ['R305', 'R306', 'R307', 'R308', 'R309'], // Giải bất phương trình bậc nhất một ẩn (khối 9, 34/34 câu — giaiBptBacNhat, quên/sai đổi chiều + lệch biên) — ĐẶC BIỆT, xem TEXT_DANG
  T109020202: ['R305', 'R306', 'R307', 'R308', 'R309'], // Giải BPT bậc nhất — quy về từ biểu thức phức tạp hơn (khối 9, 28/28 câu — TÁI DÙNG NGUYÊN giaiBptBacNhat) — ĐẶC BIỆT, xem TEXT_DANG
  T109020203: ['R305', 'R306', 'R307', 'R308', 'R309'], // Giải BPT quy về bậc nhất — dạng "phân thức" (thực chất hệ số PHÂN SỐ hằng, không phải mẫu chứa biến) (khối 9, 18/18 câu — TÁI DÙNG NGUYÊN giaiBptBacNhat, sửa parseHangTuBieuThuc hỗ trợ \dfrac{đa thức nhiều hạng}{hằng số}) — ĐẶC BIỆT, xem TEXT_DANG
  T109020103: ['R347', 'R348', 'R349', 'R350'], // Phương trình quy về bậc nhất — mẫu số chứa biến (khối 9, 16/16 câu — hàm MỚI giaiPtPhanThucBacNhat, engine LCD tổng quát) — ĐẶC BIỆT, xem TEXT_DANG
  T109020403: ['R347', 'R348', 'R349', 'R350'], // Phương trình quy về phương trình tích — mẫu số chứa biến (khối 9, 21/21 câu — TÁI DÙNG NGUYÊN giaiPtPhanThucBacNhat) — ĐẶC BIỆT, xem TEXT_DANG
  T109030203: ['R351', 'R352', 'R353', 'R354'], // Rút gọn phân thức chứa căn (khối 9, 39/40 câu — hàm MỚI rutGonPhanThucCan, engine LCD đặt t=√x) — ĐẶC BIỆT, xem TEXT_DANG
  T109010401: ['R355', 'R356', 'R357', 'R358'], // Hệ phương trình đối xứng dạng tổng-tích (khối 9, 4/4 câu — hàm MỚI giaiHePtTongTich, đặt S=x+y,P=xy) — ĐẶC BIỆT, xem TEXT_DANG
  T109080105: ['R359', 'R360', 'R361', 'R362'], // GTNN Ax+B/x, AM-GM 2 số (khối 9, 28/28 câu — hàm MỚI gtnnAmGm2So) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109080107: ['R359', 'R360', 'R361'], // GTNN x+k/x với x nguyên dương (khối 9, 32/32 câu — hàm MỚI gtnnAmGm2SoNguyen, so f(⌊√k⌋) và f(⌈√k⌉)) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109080103: ['R359', 'R360', 'R361', 'R362'], // GTNN x²+C/x hoặc Ax+B/x², AM-GM 3 số (khối 9, 17/17 câu — hàm MỚI gtnnAmGm3So) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109080104: ['R359', 'R360', 'R361', 'R362'], // GTLN x²(K-x) hoặc x(K-x)², AM-GM 3 số (khối 9, 27/27 câu — hàm MỚI gtlnAmGm3SoTich, GTLN=4K³/27) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109020401: ['R310', 'R311', 'R312', 'R313'], // Phương trình tích của 2 nhị thức bậc nhất (khối 9, 32/32 câu — hàm MỚI timXTichHaiNhiThuc) — ĐẶC BIỆT, xem TEXT_DANG
  T109020402: ['R314', 'R315', 'R316', 'R317'], // Phương trình quy về phương trình bậc hai dạng tích (khối 9, 48/48 câu — hàm MỚI giaiPtQuyVeTich, khai triển đầy đủ rồi tìm nghiệm hữu tỉ) — ĐẶC BIỆT, xem TEXT_DANG
  T109080101: ['R204', 'R205', 'R206', 'R207'], // GTLN-GTNN của biểu thức một biến bậc hai (khối 9, 33/33 câu — TÁI DÙNG NGUYÊN gtlnGtnnBacHai của T108020105, mở rộng nhận thêm dạng tích (4-x)(x+2) chưa khai triển) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109080102: ['R318', 'R319', 'R320', 'R321', 'R322'], // GTLN-GTNN của biểu thức bậc hai một biến trên 1 đoạn (khối 9, 27/28 câu — hàm MỚI gtlnGtnnBacHaiCoDieuKien, 1 câu kho sai đáp số bỏ theo §1.5) — ĐẶC BIỆT, xem TEXT_DANG
  T109010201: ['R323', 'R324', 'R325', 'R326'], // Giải hệ phương trình bậc nhất hai ẩn cơ bản (khối 9, 33/33 câu — hàm MỚI giaiHePtBacNhatHaiAn, giải bằng định thức Cramer) — ĐẶC BIỆT, xem TEXT_DANG
  T109010202: ['R323', 'R324', 'R325', 'R326'], // Giải hệ PT đưa về hệ bậc nhất (khối 9, 14/14 câu — TÁI DÙNG NGUYÊN giaiHePtBacNhatHaiAn, mở rộng gộp hạng chéo xy trước khi kiểm bậc) — ĐẶC BIỆT, xem TEXT_DANG
  T109030101: ['R335', 'R336', 'R337', 'R338'], // Rút gọn/tính giá trị biểu thức chứa căn — dạng cơ bản (khối 9, 120/120 câu — hàm MỚI tinhGiaTriCanThuc, engine số vô tỉ) — ĐẶC BIỆT, xem TEXT_DANG
  T109030102: ['R335', 'R336', 'R337', 'R338'], // ...Ứng dụng hằng đẳng thức chứa căn, gồm căn lồng (khối 9, 130/130 câu — TÁI DÙNG NGUYÊN tinhGiaTriCanThuc, engine hỗ trợ sẵn denestSqrt) — ĐẶC BIỆT, xem TEXT_DANG
  T109030201: ['R327', 'R328', 'R329', 'R330'], // Tìm ĐKXĐ của căn thức (khối 9, 60/60 câu — hàm MỚI timDkxdCanThuc) — ĐẶC BIỆT, xem TEXT_DANG
  T109030202: ['R335', 'R336', 'R337', 'R338'], // Tính giá trị căn thức khi biết giá trị biến (khối 9, 65/65 câu — hàm MỚI tinhGiaTriCanThucTheoX, thế x rồi tái dùng engine tinhGiaTriCanThuc) — ĐẶC BIỆT, xem TEXT_DANG
  T109030204: ['R331', 'R332', 'R333', 'R334'], // Tìm x ứng dụng rút gọn căn thức — PT căn cùng nhân tử (x-A) (khối 9, 17/17 câu — hàm MỚI timXPtCanThucTuyenTinh) — ĐẶC BIỆT, xem SPECIAL_DANG
  T109030301: ['R339', 'R340', 'R341', 'R342'], // Tìm x để P (phân thức 1 tầng theo √x) thoả đẳng thức (khối 9, 36/36 câu — hàm MỚI timXPhanThucCanBac2, đặt t=√x rồi giải bậc ≤2 hữu tỉ) — ĐẶC BIỆT, xem TEXT_DANG
  T109010301: ['R343', 'R344', 'R345', 'R346'], T109010302: ['R343', 'R344', 'R345', 'R346'], T109010304: ['R343', 'R344', 'R345', 'R346'], T109010305: ['R343', 'R344', 'R345', 'R346'], T109010306: ['R343', 'R344', 'R345', 'R346'], T109010307: ['R343', 'R344', 'R345', 'R346'], T109010308: ['R343', 'R344', 'R345', 'R346'], T109010309: ['R343', 'R344', 'R345', 'R346'], T109020301: ['R343', 'R344', 'R345', 'R346'], T109020302: ['R343', 'R344', 'R345', 'R346'], T109020303: ['R343', 'R344', 'R345', 'R346'], T109020304: ['R343', 'R344', 'R345', 'R346'], T109020305: ['R343', 'R344', 'R345', 'R346'], T109020306: ['R343', 'R344', 'R345', 'R346'], T109020307: ['R343', 'R344', 'R345', 'R346'], T109090101: ['R343', 'R344', 'R345', 'R346'], T109090102: ['R343', 'R344', 'R345', 'R346'], T109090201: ['R343', 'R344', 'R345', 'R346'], T109090202: ['R343', 'R344', 'R345', 'R346'], T109090301: ['R343', 'R344', 'R345', 'R346'], T109090302: ['R343', 'R344', 'R345', 'R346'], T109090303: ['R343', 'R344', 'R345', 'R346'], T109090304: ['R343', 'R344', 'R345', 'R346'], T109090305: ['R343', 'R344', 'R345', 'R346'], T109090401: ['R343', 'R344', 'R345', 'R346'], // "Bài toán thực tế" — 25 dạng, DÙNG CHUNG rule vì sinh nhiễu trực tiếp từ đáp số kho (xem ANSWER_DANG)
  T14T040101: ['R343', 'R344', 'R345', 'R346'], T14T060103: ['R343', 'R344', 'R345', 'R346'], T14T070101: ['R343', 'R344', 'R345', 'R346'], T14T010101: ['R343', 'R344', 'R345', 'R346'], T14T220101: ['R343', 'R344', 'R345', 'R346'], T14T040102: ['R343', 'R344', 'R345', 'R346'], T14T040103: ['R343', 'R344', 'R345', 'R346'], T14T040201: ['R343', 'R344', 'R345', 'R346'], T14T060102: ['R343', 'R344', 'R345', 'R346'], T14T060101: ['R343', 'R344', 'R345', 'R346'], T14T060104: ['R343', 'R344', 'R345', 'R346'], T14T010106: ['R343', 'R344', 'R345', 'R346'], T14T020101: ['R343', 'R344', 'R345', 'R346'], T14T010103: ['R343', 'R344', 'R345', 'R346'], T14T010102: ['R343', 'R344', 'R345', 'R346'], T14T010104: ['R343', 'R344', 'R345', 'R346'], T14T010105: ['R343', 'R344', 'R345', 'R346'], T14T020103: ['R343', 'R344', 'R345', 'R346'], T14T070102: ['R343', 'R344', 'R345', 'R346'], T14T020102: ['R343', 'R344', 'R345', 'R346'],
  T15T010101: ['R343', 'R344', 'R345', 'R346'], T15T010403: ['R343', 'R344', 'R345', 'R346'], T15T010103: ['R343', 'R344', 'R345', 'R346'], T15T010402: ['R343', 'R344', 'R345', 'R346'], T15T010102: ['R343', 'R344', 'R345', 'R346'], T15T010301: ['R343', 'R344', 'R345', 'R346'], T15T010201: ['R343', 'R344', 'R345', 'R346'], T15T010302: ['R343', 'R344', 'R345', 'R346'], T15T010404: ['R343', 'R344', 'R345', 'R346'], T15T010203: ['R343', 'R344', 'R345', 'R346'], T15T010303: ['R343', 'R344', 'R345', 'R346'], T15T010401: ['R343', 'R344', 'R345', 'R346'], T15T020101: ['R343', 'R344', 'R345', 'R346'], T15T010202: ['R343', 'R344', 'R345', 'R346'], T15T020102: ['R343', 'R344', 'R345', 'R346'], // "Bài toán tư duy" khối 4T/5T — 35 dạng, DÙNG CHUNG rule qua ANSWER_DANG
  T112030103: ['R343', 'R344', 'R345', 'R346'], T112070311: ['R343', 'R344', 'R345', 'R346'], T112070308: ['R343', 'R344', 'R345', 'R346'], T112030102: ['R343', 'R344', 'R345', 'R346'], T112050203: ['R343', 'R344', 'R345', 'R346'], T112030101: ['R343', 'R344', 'R345', 'R346'], T112070307: ['R343', 'R344', 'R345', 'R346'], T112010403: ['R343', 'R344', 'R345', 'R346'], T112040201: ['R343', 'R344', 'R345', 'R346'], T112040202: ['R343', 'R344', 'R345', 'R346'], T112050106: ['R343', 'R344', 'R345', 'R346'], T112010303: ['R343', 'R344', 'R345', 'R346'], // Khối 12 — 12 dạng, DÙNG CHUNG rule qua ANSWER_DANG
  T108020701: ['R264', 'R265', 'R266', 'R267', 'R268', 'R269'], // Tổng bình/lập phương 2 biến qua tổng-tích (khối 8, CHỈ sub-shape 2 biến — CEO chốt 13/09 để lại sub-shape 3 biến) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108020702: ['R270', 'R271', 'R272', 'R273'], // a³+b³+K³=3Kab, a≠b ⇒ a+b=-K (khối 8, CHỈ sub-shape này — 9/15 câu còn lại là Chứng minh hoặc đáp số hằng số 3 không tham số, bỏ tự nhiên) — ĐẶC BIỆT, xem SPECIAL_DANG
  T108030101: ['R274', 'R275', 'R276', 'R277', 'R278', 'R280'], // Phân tích ĐTTNT — rút nhân tử chung (khối 8, 116/147 câu — phần còn lại là kho chưa rút hết GCD hoặc cấu trúc nhóm hạng tử phức tạp hơn, bỏ tự nhiên) — ĐẶC BIỆT, xem TEXT_DANG
  T108030102: ['R281', 'R282', 'R283', 'R284'], // Phân tích ĐTTNT — nhóm hạng tử (khối 8, CHỈ sub-shape "4 hạng, nhóm 2 đầu+2 cuối", 87/110 câu — phần còn lại kho chưa rút hết hoặc cần hằng đẳng thức lập phương, để sau) — ĐẶC BIỆT, xem TEXT_DANG
  T108030103: ['R285', 'R286', 'R287', 'R288'], // Phân tích ĐTTNT — tam thức bậc hai x²+Bx+C (khối 8, CHỈ sub-shape hệ số bậc 2=1, 32/166 câu — phần lớn còn lại cần nhóm hạng tử 2 biến hoặc đặt ẩn phụ, để sau) — ĐẶC BIỆT, xem TEXT_DANG
  T108030104: ['R285', 'R286', 'R287', 'R288', 'R289', 'R290', 'R291', 'R292'], // Phân tích ĐTTNT — tách hạng tử (khối 8, trộn A=1 1 biến + A≠1/2 biến qua tachHangTuKetHop, 93/111 câu — phần còn lại là bậc 4 đặt ẩn phụ hoặc kho lỗi đáp số, để sau) — ĐẶC BIỆT, xem TEXT_DANG
  T108030105: ['R293', 'R294', 'R295', 'R296'], // Phân tích ĐTTNT — nhẩm nghiệm bậc 3 (khối 8, 43/62 câu — phần còn lại là kho sai đáp số hoặc cấu trúc khác 4 hạng, để sau) — ĐẶC BIỆT, xem TEXT_DANG
  T108030602: ['R297', 'R298', 'R299', 'R300'], // Tìm x — phương trình tích qua rút nhân tử chung (khối 8, 42/42 câu) — ĐẶC BIỆT, xem TEXT_DANG
  T108030603: ['R301', 'R302', 'R303', 'R304'], // Giải phương trình bậc ba qua nhóm hạng tử (khối 8, 6/6 câu) — ĐẶC BIỆT, xem TEXT_DANG
  '07702220320302': ['R30', 'R29', 'R28', 'R16', 'R03', 'R18', 'R08', 'R10', 'R04'], // Thực hiện phép tính GTTĐ
  '07702220320320303': ['R21', 'R31', 'R19', 'R20', 'R11', 'R06', 'R10', 'R04'], // Tìm x liên quan GTTĐ
}
const ALL = ['R01', 'R02', 'R03', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21', 'R22', 'R23', 'R26', 'R27', 'R28', 'R29', 'R30', 'R31', 'R32', 'R33', 'R34', 'R35', 'R36', 'R37', 'R38', 'R39', 'R40', 'R42', 'R43', 'R44', 'R45', 'R46', 'R47', 'R48', 'R49', 'R50', 'R51', 'R52', 'R53', 'R54', 'R55', 'R56', 'R57', 'R58', 'R59', 'R60', 'R61', 'R62', 'R63', 'R64', 'R65', 'R66', 'R67', 'R68', 'R69', 'R70', 'R71', 'R72', 'R73', 'R74', 'R75', 'R76', 'R77', 'R78', 'R79', 'R80', 'R81', 'R82', 'R83', 'R84', 'R85', 'R86', 'R87', 'R88', 'R89', 'R90', 'R91', 'R92', 'R93', 'R94', 'R95', 'R96', 'R97', 'R98', 'R99', 'R105', 'R106', 'R107', 'R108', 'R109', 'R110', 'R111', 'R112', 'R113', 'R114', 'R115', 'R116', 'R118', 'R119', 'R120', 'R121', 'R122', 'R123', 'R124', 'R125', 'R126', 'R127', 'R128', 'R129', 'R130', 'R131', 'R132', 'R133', 'R134', 'R135', 'R136', 'R137', 'R138', 'R139', 'R140', 'R141', 'R142', 'R143', 'R144', 'R145', 'R146', 'R147', 'R148', 'R149', 'R150', 'R151', 'R152', 'R153', 'R154', 'R155', 'R156', 'R157', 'R158', 'R159', 'R160', 'R161', 'R162', 'R163', 'R164', 'R165', 'R166', 'R167', 'R168', 'R169', 'R170', 'R171', 'R172', 'R173', 'R174', 'R175', 'R176', 'R177', 'R178', 'R179', 'R180', 'R181', 'R182', 'R183', 'R184', 'R185', 'R186', 'R187', 'R188', 'R189', 'R190', 'R191', 'R192', 'R193', 'R194', 'R195', 'R196', 'R197', 'R198', 'R199', 'R200', 'R201', 'R202', 'R203', 'R204', 'R205', 'R206', 'R207', 'R208', 'R209', 'R210', 'R211', 'R212', 'R213', 'R214', 'R215', 'R216', 'R217', 'R218', 'R219', 'R220', 'R221', 'R222', 'R223', 'R224', 'R225', 'R226', 'R227', 'R228', 'R229', 'R230', 'R231', 'R232', 'R233', 'R234', 'R235', 'R236', 'R237', 'R238', 'R239', 'R240', 'R241', 'R242', 'R243', 'R244', 'R245', 'R246', 'R247', 'R248', 'R249', 'R250', 'R251', 'R252', 'R253', 'R254', 'R255', 'R256', 'R257', 'R258', 'R259', 'R260', 'R261', 'R262', 'R263', 'R264', 'R265', 'R266', 'R267', 'R268', 'R269', 'R270', 'R271', 'R272', 'R273', 'R274', 'R275', 'R276', 'R277', 'R278', 'R280', 'R281', 'R282', 'R283', 'R284', 'R285', 'R286', 'R287', 'R288', 'R289', 'R290', 'R291', 'R292', 'R293', 'R294', 'R295', 'R296', 'R297', 'R298', 'R299', 'R300', 'R301', 'R302', 'R303', 'R304', 'R305', 'R306', 'R307', 'R308', 'R309', 'R310', 'R311', 'R312', 'R313', 'R314', 'R315', 'R316', 'R317', 'R318', 'R319', 'R320', 'R321', 'R322', 'R323', 'R324', 'R325', 'R326', 'R327', 'R328', 'R329', 'R330', 'R331', 'R332', 'R333', 'R334', 'R335', 'R336', 'R337', 'R338', 'R339', 'R340', 'R341', 'R342', 'R343', 'R344', 'R345', 'R346', 'R347', 'R348', 'R349', 'R350', 'R351', 'R352', 'R353', 'R354', 'R355', 'R356', 'R357', 'R358', 'R359', 'R360', 'R361', 'R362', 'R04', 'R24', 'R05']
// Dạng có KHUÔN VĂN BẢN riêng, không phải biểu thức LaTeX chung — mini-solver ở lib/mini-dang.mjs, KHÔNG qua
// mathOf/parse/AST. Mỗi hàm nhận (noiDung, rule) → {value, text?, ds?} | null (rule=null ⇒ đáp số đúng).
const SPECIAL_DANG = { '07702011103': tinhTuanHoan, '0770201102': layTron, T107010103: soSanhTimXY, T106040102: uclnBcnnDinhNghia, T106040202: uclnBcnnDinhNghia, T106010103: tongTapHopNhoHon, T108010102: bacDonThuc, T108010103: heSoDonThuc, T108010101: demDonThucTrongDanhSach, T108010104: demDongDang, T108010503: timXQuaRutGon, T108010504: tinhGiaTriRutGon, T108020105: gtlnGtnnBacHai, T109080101: gtlnGtnnBacHai, T108020201: gtlnGtnnHaiBien, T108020202: gtlnGtnnHaiBien, T108020203: gtlnGtnnHaiBien, T108020302: tinhGiaTriLapPhuong, T108020402: tinhGiaTriHieuBinhPhuong, T108020502: tinhGiaTriApDungLapPhuong, T108020602: timXQuaRutGon, T109020101: timXQuaRutGon, T109020102: timXQuaRutGon, T108020701: tongBinhLapPhuongHaiBien, T108020702: tongLapPhuongCongThemHangSo, T109030204: timXPtCanThucTuyenTinh, T109080105: gtnnAmGm2So, T109080107: gtnnAmGm2SoNguyen, T109080103: gtnnAmGm3So, T109080104: gtlnAmGm3SoTich }
// Dạng ĐÁP SỐ LÀ BIỂU THỨC/TẬP HỢP (không phải 1 giá trị hữu tỉ) — so khớp bằng TEXT chuẩn hoá, KHÔNG qua
// Rat/canonOf (xem mini-dang.mjs: R54 của DẠNG 4 cố ý giữ nguyên giá trị số nhưng sai hình thức, so giá trị sẽ
// coi là trùng đáp án đúng). Mỗi dạng có 1 cặp {canon, val} hàm chuẩn hoá/kiểm riêng — KHÔNG dùng chung 1 cặp
// cho mọi dạng vì cú pháp đáp số khác hẳn nhau (biểu thức \cdot vs danh sách "; ").
// Dạng "BÀI TOÁN THỰC TẾ" — máy KHÔNG đọc-hiểu đề, chỉ sinh nhiễu từ đáp số kho đã duyệt (xem DẠNG 52,
// mini-dang.mjs). Hàm nhận (dap_an, rule) — khác MỌI dict khác trong file này vốn nhận (noi_dung, rule).
const ANSWER_DANG_LIST = ['T109010301', 'T109010302', 'T109010304', 'T109010305', 'T109010306', 'T109010307', 'T109010308', 'T109010309', 'T109020301', 'T109020302', 'T109020303', 'T109020304', 'T109020305', 'T109020306', 'T109020307', 'T109090101', 'T109090102', 'T109090201', 'T109090202', 'T109090301', 'T109090302', 'T109090303', 'T109090304', 'T109090305', 'T109090401',
  // Khối 4T/5T (Toán Tư Duy, 15/09-16/09) — CÙNG kỹ thuật sinh nhiễu từ đáp số kho, không đọc-hiểu đề
  'T14T040101', 'T14T060103', 'T14T070101', 'T14T010101', 'T14T220101', 'T14T040102', 'T14T040103', 'T14T040201', 'T14T060102', 'T14T060101', 'T14T060104', 'T14T010106', 'T14T020101', 'T14T010103', 'T14T010102', 'T14T010104', 'T14T010105', 'T14T020103', 'T14T070102', 'T14T020102',
  'T15T010101', 'T15T010403', 'T15T010103', 'T15T010402', 'T15T010102', 'T15T010301', 'T15T010201', 'T15T010302', 'T15T010404', 'T15T010203', 'T15T010303', 'T15T010401', 'T15T020101', 'T15T010202', 'T15T020102',
  // Khối 12 (16/09) — 12/14 dạng (loại T112040102 biểu thức hàm số, T112020305 đúng/sai — 0% khớp)
  'T112030103', 'T112070311', 'T112070308', 'T112030102', 'T112050203', 'T112030101', 'T112070307', 'T112010403', 'T112040201', 'T112040202', 'T112050106', 'T112010303']
const ANSWER_DANG = Object.fromEntries(ANSWER_DANG_LIST.map((d) => [d, sinhNhieuDapSoThucTe]))
const TEXT_DANG = { T106030302: phanTichNguyenTo, T106030301: nhanBietNguyenToHopSo, T106040104: tapUcBc, T106040204: tapUcBc, T106030101: uocBoiCoBan, T106040101: ucBcCoBan, T106040201: ucBcCoBan, T107010103: sapXepSoHuuTi, T108010103: phanBienDonThuc, T108010201: congTruDonThucDongDang, T108010202: congTruDaThuc, T108010301: nhanDonThuc, T108010302: nhanDonDaThuc, T108010303: nhanDaThuc, T108010401: chiaDonThuc, T108010402: chiaDaChoDon, T108010403: chiaDaThucMotBien, T108010404: dieuKienChiaHetDonThuc, T108010501: rutGonBieuThuc, T108020101: khaiTrienBinhPhuong, T108020102: vietThanhBinhPhuong, T108020103: hoanThienBinhPhuong, T108020104: tachBinhPhuong, T108020301: khaiTrienLapPhuong, T108020401: vietThanhTichHieuBinhPhuong, T108040301: vietThanhTichHieuBinhPhuong, T108020501: tongHieuLapPhuong, T108020601: rutGonBieuThuc, T108030101: rutNhanTuChung, T108030102: nhomHangTu, T108030103: phanTichTamThucBac2, T108030104: tachHangTuKetHop, T108030105: phanTichNhamNghiem, T108030602: timXPhuongTrinhTich2Hang, T108030603: giaiPtBacBaQuaNhom, T109020201: giaiBptBacNhat, T109020202: giaiBptBacNhat, T109020203: giaiBptBacNhat, T109020103: giaiPtPhanThucBacNhat, T109020403: giaiPtPhanThucBacNhat, T109030203: rutGonPhanThucCan, T109010401: giaiHePtTongTich, T109020401: timXTichHaiNhiThuc, T109020402: giaiPtQuyVeTich, T109080102: gtlnGtnnBacHaiCoDieuKien, T109010201: giaiHePtBacNhatHaiAn, T109010202: giaiHePtBacNhatHaiAn, T109030101: tinhGiaTriCanThuc, T109030102: tinhGiaTriCanThuc, T109030201: timDkxdCanThuc, T109030202: tinhGiaTriCanThucTheoX, T109030301: timXPhanThucCanBac2 }
const TEXT_FN = {
  T106030302: { canon: chuanHoaFactorText, val: evalFactorText },
  T106030301: { canon: chuanHoaTapText, val: evalTapText },
  T106040104: { canon: chuanHoaTapText, val: evalTapText },
  T106040204: { canon: chuanHoaTapText, val: evalTapText },
  T106030101: { canon: chuanHoaTapText, val: evalTapText },
  T106040101: { canon: chuanHoaTapText, val: evalTapText },
  T106040201: { canon: chuanHoaTapText, val: evalTapText },
  T107010103: { canon: chuanHoaThuTu, val: evalThuTu },
  T108010103: { canon: chuanHoaPhanBien, val: evalPhanBien },
  T108010201: { canon: chuanHoaDonThucKetQua, val: evalDonThucKetQua },
  T108010202: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108010301: { canon: chuanHoaDonThucKetQua, val: evalDonThucKetQua },
  T108010302: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108010303: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108010401: { canon: chuanHoaDonThucKetQua, val: evalDonThucKetQua },
  T108010402: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108010403: { canon: chuanHoaChiaDaThuc, val: evalChiaDaThucKetQua },
  T108010404: { canon: chuanHoaDkChiaHet, val: evalDkChiaHetKetQua },
  T108010501: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108020101: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108020102: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108020103: { canon: chuanHoaHoanThienBP, val: evalHoanThienBPKetQua },
  T108020104: { canon: chuanHoaTachBinhPhuong, val: evalTachBinhPhuongKetQua },
  T108020301: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108020401: { canon: chuanHoaTachBinhPhuong, val: evalTachBinhPhuongKetQua },
  T108040301: { canon: chuanHoaTachBinhPhuong, val: evalTachBinhPhuongKetQua },
  T108020501: { canon: chuanHoaTongHieuLapPhuong, val: evalTongHieuLapPhuongKetQua },
  T108020601: { canon: chuanHoaDaThuc, val: evalDaThucKetQua },
  T108030101: { canon: chuanHoaRutNhanTuChung, val: evalRutNhanTuChungKetQua },
  T108030102: { canon: chuanHoaRutNhanTuChung, val: evalRutNhanTuChungKetQua },
  T108030103: { canon: chuanHoaRutNhanTuChung, val: evalRutNhanTuChungKetQua },
  T108030104: { canon: chuanHoaRutNhanTuChung, val: evalRutNhanTuChungKetQua },
  T108030105: { canon: chuanHoaRutNhanTuChung, val: evalRutNhanTuChungKetQua },
  T108030602: { canon: chuanHoaDanhSachNghiem, val: evalDanhSachNghiemKetQua },
  T108030603: { canon: chuanHoaDanhSachNghiem, val: evalDanhSachNghiemKetQua },
  T109020201: { canon: chuanHoaBatDangThuc, val: evalBatDangThucKetQua },
  T109020202: { canon: chuanHoaBatDangThuc, val: evalBatDangThucKetQua },
  T109020203: { canon: chuanHoaBatDangThuc, val: evalBatDangThucKetQua },
  T109020103: { canon: chuanHoaPtPhanThucKetQua, val: evalPtPhanThucKetQua },
  T109020403: { canon: chuanHoaPtPhanThucKetQua, val: evalPtPhanThucKetQua },
  T109030203: { canon: chuanHoaRutGonCanKetQua, val: evalRutGonCanKetQuaVal },
  T109010401: { canon: chuanHoaHePtTongTich, val: evalHePtTongTichKetQua },
  T109020401: { canon: chuanHoaDanhSachNghiem, val: evalDanhSachNghiemKetQua },
  T109020402: { canon: chuanHoaDanhSachNghiem, val: evalDanhSachNghiemKetQua },
  T109080102: { canon: chuanHoaDanhSachNghiem, val: evalDanhSachNghiemKetQua },
  T109010201: { canon: chuanHoaCapNghiem, val: evalCapNghiemKetQua },
  T109010202: { canon: chuanHoaCapNghiem, val: evalCapNghiemKetQua },
  T109030101: { canon: chuanHoaCanThucKetQua, val: evalCanThucKetQuaVal },
  T109030102: { canon: chuanHoaCanThucKetQua, val: evalCanThucKetQuaVal },
  T109030201: { canon: chuanHoaDkxdCanThuc, val: evalDkxdCanThucKetQua },
  T109030202: { canon: chuanHoaCanThucKetQua, val: evalCanThucKetQuaVal },
  T109030301: { canon: chuanHoaDanhSachNghiem, val: evalDanhSachNghiemKetQua },
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
  // ── Dạng "BÀI TOÁN THỰC TẾ" — sinh NHIỄU TỪ ĐÁP SỐ, KHÔNG đọc-hiểu đề (CEO 14/09) — hàm nhận `q.dap_an`
  // chứ KHÔNG PHẢI `q.noi_dung` (khác MỌI nhánh khác bên dưới). Vẫn tự đối chiếu lại `chuanHoaDapSoThucTe`
  // như 1 lưới an toàn (bắt lỗi format/parse), dù về bản chất luôn khớp vì res.text bắt nguồn từ chính dap_an.
  const answerFn = ANSWER_DANG[q.dang_chinh]
  if (answerFn) {
    let res; try { res = answerFn(q.dap_an, null) } catch { res = null }
    if (!res || !res.text) { bo.push([q.ma_cau, 'đáp số kho không nhận dạng được (khác 1 số / 2 số / "N hoặc M")']); continue }
    const correctText = chuanHoaDapSoThucTe(q.dap_an), cText = chuanHoaDapSoThucTe(res.text)
    if (cText !== correctText) { lech.push([q.ma_cau, cText, correctText, q.noi_dung.slice(0, 70)]); bo.push([q.ma_cau, `máy ra ${cText} ≠ đáp số kho ${correctText}`]); continue }
    const uu = UU_TIEN[q.dang_chinh] ?? []
    const order = [...uu, ...ALL.filter((r) => !uu.includes(r))]
    const cands = []; const seen = new Set([cText])
    for (const r of order) {
      let rres; try { rres = answerFn(q.dap_an, r) } catch { rres = null }
      if (!rres || !rres.text) continue
      const c = chuanHoaDapSoThucTe(rres.text); if (seen.has(c)) continue
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
      if (i === pi) lua_chon.push({ text: wrapMath(res.text), dung: true })
      else { const d = pick[di++]; lua_chon.push({ text: wrapMath(d.text), dung: false, rule: d.r, duong_sai: d.ds }) }
    }
    out.push({ ma_cau: q.ma_cau, dap_an: pos, lua_chon })
    continue
  }
  // ── Dạng ĐÁP SỐ LÀ BIỂU THỨC (vd phân tích thừa số nguyên tố) — nhánh RIÊNG, so bằng TEXT, không qua parseHuuTi
  // (đáp số kho không phải 1 giá trị hữu tỉ, parseHuuTi sẽ luôn fail và loại hết câu ngay từ đầu nếu đi nhánh cũ).
  // Dạng có NHIỀU SUB-SHAPE trộn lẫn (vd T107010103: vừa "so sánh tìm x,y" qua SPECIAL_DANG, vừa "sắp xếp" qua
  // TEXT_DANG) — nếu textFn(null) không nhận diện được câu này (trả null) thì KHÔNG bỏ ngay, rơi xuống thử nhánh
  // parseHuuTi/SPECIAL_DANG/AST bình thường bên dưới, như thể dạng đó không nằm trong TEXT_DANG.
  const textFn = TEXT_DANG[q.dang_chinh]
  if (textFn) {
    const fn = TEXT_FN[q.dang_chinh]
    let res; try { res = textFn(q.noi_dung, null) } catch { res = null }
    if (res && res.text) {
      const correctText = fn.canon(q.dap_an), nCorrect = fn.val(q.dap_an)
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
        if (i === pi) lua_chon.push({ text: wrapMath(res.text), dung: true })
        else { const d = pick[di++]; lua_chon.push({ text: wrapMath(d.text), dung: false, rule: d.r, duong_sai: d.ds }) }
      }
      out.push({ ma_cau: q.ma_cau, dap_an: pos, lua_chon })
      continue
    }
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
    if (i === pi) lua_chon.push({ text: correctText != null ? wrapMath(correctText) : texOf(correct), dung: true })
    else { const d = pick[di++]; lua_chon.push({ text: d.text != null ? wrapMath(d.text) : texOf(d.v), dung: false, rule: d.r, duong_sai: d.ds }) }
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
