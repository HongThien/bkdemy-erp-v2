// ve_G6.mjs — hình đề + hình lời giải NDT-H3.15..18 (§2 Định lí đảo và hệ quả Thalès). Chạy: node ve_G6.mjs (từ thư mục h8t)
import { P, seg, segDash, tick, rightAngle, dot, label, labelOut, mid, lerp, foot, inter, rot, goc, dist, trongTam, add, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G6'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const par = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) / (dist(a, b) * dist(c, d)) < 1e-6
const NP = { pad: 40, padDuoi: 50 }
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)

// ───── 15: ABC cân tại A; BD ⊥ BC, CD ⊥ AC; BE ⊥ CD; M = AD ∩ BE; EN ⊥ BD ─────
function cau15(s, voiF) {
  const w = 70 * s, h = 100 * s
  const B = P(40, 40 + h), C = P(40 + 2 * w, 40 + h), A = P(40 + w, 40)
  const D = inter(B, P(B.x, B.y + 100), C, rot(A, C, 90))
  const E = foot(B, C, D), M = inter(A, D, B, E), N = foot(E, B, D)
  near(dist(A, B), dist(A, C), 0.01); near(goc(B, D, C), 90); near(goc(C, A, D), 90); near(goc(E, B, D), 90); near(goc(N, E, B), 90)
  const F = voiF ? P(2 * A.x - C.x, 2 * A.y - C.y) : null
  const pts = [A, B, C, D, E, M, N].concat(voiF ? [F] : [])
  const g = trongTam([A, B, C, D])
  const body = [
    seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, D), seg(B, E), seg(A, D), seg(E, N),
    voiF ? segDash(A, F) : '', voiF ? segDash(F, B) : '',
    tick(A, B, 1, 0.5), tick(A, C, 1, 0.5),
    rightAngle(B, D, C), rightAngle(C, A, D), rightAngle(E, B, D), rightAngle(N, E, B),
    dots(...pts),
    lab(A, 'A', g, 20), label(B, 'B', -16, -8), lab(C, 'C', g, 22), lab(D, 'D', g, 22), lab(E, 'E', g, 22), label(M, 'M', 16, -8), label(N, 'N', -18, 8),
    voiF ? lab(F, 'F', g, 22) : '',
  ]
  hinh(voiF ? 'NDT-H3-15_b_lg' : 'NDT-H3-15', pts, body, NP)
}
cau15(1.55, false)
cau15(1.0, true)

// ───── 16a: hình thang ABCD (AB ∥ CD); O = AC ∩ BD; qua O song song AB cắt AD, BC tại M, N ─────
{
  const A = P(130, 50), B = P(290, 50), D = P(40, 230), C = P(420, 230)
  const O = inter(A, C, B, D)
  const M = inter(O, P(O.x + 1, O.y), A, D), N = inter(O, P(O.x + 1, O.y), B, C)
  near(M.y, O.y, 0.01); near(N.y, O.y, 0.01)
  hinh('NDT-H3-16a', [A, B, C, D, O, M, N], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, N),
    dots(A, B, C, D, O, M, N),
    label(A, 'A', -4, -16), label(B, 'B', 6, -16), label(C, 'C', 22, 26), label(D, 'D', -20, 26),
    label(M, 'M', -22, 6), label(N, 'N', 24, 6), label(O, 'O', 4, -14),
  ], NP)
}

// ───── 16b: ABC nhọn, AD ⊥ BC, H ∈ AD, E = BH ∩ AC, F = CH ∩ AB ─────
function cau16b(voiLg) {
  const A = P(250, 40), B = P(60, 300), C = P(380, 300), D = P(250, 300)
  const H = lerp(D, A, 0.42)
  const E = inter(B, H, A, C), F = inter(C, H, A, B)
  near(goc(D, A, B), goc(D, A, B)); near(goc(D, A, C), goc(D, A, C))
  console.assert(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, '16b không nhọn')
  const g = trongTam([A, B, C])
  let pts = [A, B, C, D, H, E, F], extra = '', extraLab = ''
  if (voiLg) {
    const hz = (a) => inter(H, P(H.x + 1, H.y), ...a)
    const M = hz([A, B]), Nn = hz([D, F]), I = hz([D, E]), K = hz([A, C])
    near(Nn.y, H.y, 0.01)
    pts = pts.concat([M, Nn, I, K])
    extra = seg(M, K) + dots(M, Nn, I, K)
    extraLab = label(M, 'M', -20, 4) + label(Nn, 'N', -14, -8) + label(I, 'I', 12, -10) + label(K, 'K', 22, 4)
  }
  hinh(voiLg ? 'NDT-H3-16b_lg' : 'NDT-H3-16b', pts, [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F), seg(D, E), seg(D, F),
    rightAngle(D, A, C), extra,
    dots(A, B, C, D, H, E, F),
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(D, 'D', 2, 28), lab(E, 'E', g, 20), lab(F, 'F', g, 20),
    voiLg ? label(H, 'H', -14, 26) : label(H, 'H', -20, 4), extraLab,
  ], NP)
}
cau16b(false)
cau16b(true)

// ───── tam giác dùng chung cho 17, 18 ─────
const TA = P(170, 40), TB = P(40, 280), TC = P(400, 280)
const gT = trongTam([TA, TB, TC])

// ───── 17a: A', B', C' trên các cạnh BC, CA, AB (không đồng quy — đề chưa cho) ─────
{
  const A = TA, B = TB, C = TC
  const Ap = lerp(B, C, 0.40), Bp = lerp(C, A, 0.55), Cp = lerp(A, B, 0.35)
  hinh('NDT-H3-17a', [A, B, C, Ap, Bp, Cp], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, Ap), seg(B, Bp), seg(C, Cp),
    dots(A, B, C, Ap, Bp, Cp),
    lab(A, 'A', gT, 20), lab(B, 'B', gT, 22), lab(C, 'C', gT, 22), lab(Ap, 'A′', gT, 22), lab(Bp, 'B′', gT, 22), lab(Cp, 'C′', gT, 22),
  ], NP)
}
// hình lời giải 17a: AA′, BB′, CC′ đồng quy tại M; d qua A ∥ BC cắt BB′ tại E, CC′ tại D
{
  const A = TA, B = TB, C = TC
  const M = P(A.x * 0.5 + B.x * 0.2 + C.x * 0.3, A.y * 0.5 + B.y * 0.2 + C.y * 0.3)
  const Ap = inter(A, M, B, C), Bp = inter(B, M, C, A), Cp = inter(C, M, A, B)
  const Dd = inter(A, P(A.x + 1, A.y), C, Cp), Ee = inter(A, P(A.x + 1, A.y), B, Bp)
  near(Dd.y, A.y, 0.01)
  hinh('NDT-H3-17a_lg', [A, B, C, Ap, Bp, Cp, M, Dd, Ee], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, Ap), seg(B, Ee), seg(C, Dd), seg(Dd, Ee),
    dots(A, B, C, Ap, Bp, Cp, M, Dd, Ee),
    label(A, 'A', 6, -14), lab(B, 'B', gT, 22), lab(C, 'C', gT, 22), lab(Ap, 'A′', gT, 22), label(Bp, 'B′', 24, 14), label(Cp, 'C′', -22, 14),
    label(M, 'M', -26, 8), label(Dd, 'D', -6, -14), label(Ee, 'E', 6, -14),
  ], NP)
}

// ───── 17b: C′ trên tia đối của tia AB, B′ ∈ cạnh CA, A′ ∈ cạnh BC (hình thẳng hàng, như đề) ─────
function cau17b(lg) {
  const B = P(60, 330), C = P(420, 330), A = P(210, 190)
  const Cp = lerp(B, A, 1.45), Bp = lerp(C, A, 0.6)
  const Ap = inter(Cp, Bp, B, C)
  const pts = [A, B, C, Ap, Bp, Cp]
  const g = trongTam([A, B, C])
  let ex = '', exl = ''
  if (lg) {
    const M = inter(A, P(A.x + 1, A.y), Cp, Bp)
    pts.push(M)
    ex = segDash(A, M) + dot(M); exl = label(M, 'M', 20, -4)
    console.assert(Math.abs(M.y - A.y) < 0.01)
  }
  hinh(lg ? 'NDT-H3-17b_lg' : 'NDT-H3-17b', pts, [
    seg(B, Cp), seg(B, C), seg(C, A), seg(Cp, Ap), ex,
    dots(A, B, C, Ap, Bp, Cp),
    label(A, 'A', -18, -8), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(Ap, 'A′', 4, 30), label(Bp, 'B′', 20, -8), label(Cp, 'C′', -18, -8), exl,
  ], NP)
}
cau17b(false)
cau17b(true)

// ───── 18a: tứ giác lồi ABCD; AP ∥ BC (P ∈ BD); BQ ∥ AD (Q ∈ AC) ─────
{
  const f = (x, y) => P(40 + 44 * (x + 1), 40 + 44 * (6.2 - y))
  const A = f(0, 4), B = f(5, 6), C = f(6.5, 0), D = f(-1, -1)
  const O = inter(A, C, B, D)
  const Pp = inter(A, P(A.x + (C.x - B.x), A.y + (C.y - B.y)), B, D)
  const Q = inter(B, P(B.x + (D.x - A.x), B.y + (D.y - A.y)), A, C)
  console.assert(par(A, Pp, B, C) && par(B, Q, A, D))
  const g = trongTam([A, B, C, D])
  hinh('NDT-H3-18a', [A, B, C, D, O, Pp, Q], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, Pp), seg(B, Q), seg(Pp, Q),
    dots(A, B, C, D, O, Pp, Q),
    lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 22),
    label(O, 'O', -4, -14), label(Pp, 'P', -8, 28), label(Q, 'Q', 10, 28),
  ], NP)
}

// ───── 18b: O trong tam giác ABC; tia AO, BO, CO cắt BC, AC, AB tại P, Q, R ─────
{
  const A = TA, B = TB, C = TC
  const O = P(A.x * 0.3 + B.x * 0.32 + C.x * 0.38, A.y * 0.3 + B.y * 0.32 + C.y * 0.38)
  const Pp = inter(A, O, B, C), Q = inter(B, O, C, A), R = inter(C, O, A, B)
  hinh('NDT-H3-18b', [A, B, C, O, Pp, Q, R], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, Pp), seg(B, Q), seg(C, R),
    dots(A, B, C, O, Pp, Q, R),
    lab(A, 'A', gT, 20), lab(B, 'B', gT, 22), lab(C, 'C', gT, 22), lab(Pp, 'P', gT, 22), lab(Q, 'Q', gT, 22), lab(R, 'R', gT, 22), label(O, 'O', 14, -14),
  ], NP)
}

// ───── 18c: AA′, BB′, CC′ đồng quy tại M ─────
function cau18c(lg) {
  const A = TA, B = TB, C = TC
  const M = P(A.x * 0.5 + B.x * 0.2 + C.x * 0.3, A.y * 0.5 + B.y * 0.2 + C.y * 0.3)
  const Ap = inter(A, M, B, C), Bp = inter(B, M, C, A), Cp = inter(C, M, A, B)
  const pts = [A, B, C, Ap, Bp, Cp, M]
  let ex = '', exl = ''
  if (lg) {
    const Dd = inter(A, P(A.x + 1, A.y), C, Cp), Ee = inter(A, P(A.x + 1, A.y), B, Bp)
    pts.push(Dd, Ee)
    ex = seg(Dd, C) + seg(Ee, B) + seg(Dd, Ee) + dots(Dd, Ee); exl = label(Dd, 'D', -6, -14) + label(Ee, 'E', 6, -14)
  }
  hinh(lg ? 'NDT-H3-18c_lg' : 'NDT-H3-18c', pts, [
    seg(A, B), seg(B, C), seg(C, A), seg(A, Ap), lg ? '' : seg(B, Bp), lg ? '' : seg(C, Cp), ex,
    dots(A, B, C, Ap, Bp, Cp, M),
    lg ? label(A, 'A', 6, -14) : lab(A, 'A', gT, 20), lab(B, 'B', gT, 22), lab(C, 'C', gT, 22), lab(Ap, 'A′', gT, 22), (lg ? label(Bp, 'B′', 24, 14) : lab(Bp, 'B′', gT, 22)), (lg ? label(Cp, 'C′', -22, 14) : lab(Cp, 'C′', gT, 24)),
    label(M, 'M', lg ? -26 : 26, lg ? 8 : 4), exl,
  ], NP)
}
cau18c(false)
cau18c(true)

// ───── 18d: D trung điểm BC; O ∈ AD; CO ∩ AB = M; BO ∩ AC = N ─────
{
  const A = P(190, 40), B = TB, C = TC
  const D = mid(B, C), O = lerp(A, D, 0.4)
  const M = inter(C, O, A, B), N = inter(B, O, A, C)
  const g = trongTam([A, B, C])
  hinh('NDT-H3-18d', [A, B, C, D, O, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, N), seg(C, M), seg(M, N),
    tick(B, D, 1, 0.5), tick(D, C, 1, 0.5),
    dots(A, B, C, D, O, M, N),
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(D, 'D', 2, 30), lab(M, 'M', g, 22), lab(N, 'N', g, 22), label(O, 'O', 22, 10),
  ], NP)
}

await xuatTat(OUT)
