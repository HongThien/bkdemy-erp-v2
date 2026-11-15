// ve_G21.mjs — hình đề + hình lời giải VHB1 §2 (Hình thang): VD2, BT 14, 15*, 16a, 17, 18, 19, 20. Chạy: node ve_G21.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, rightAngle, dot, label, labelOut, mid, lerp, foot, inter, rot, goc, dist, trongTam, add, ray, circle, bien, num, sideText, doiXung, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G21'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const par = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) / (dist(a, b) * dist(c, d)) < 1e-6
const NP = { pad: 42, padDuoi: 50 }
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)
const unitv = (a, b) => { const l = dist(a, b); return P((b.x - a.x) / l, (b.y - a.y) / l) }
const sub = (a, b) => P(a.x - b.x, a.y - b.y)

// ───── VD2: ABC, BC = a, trung tuyến BD, CE; BM = MN = NC; I = AM ∩ BD, K = AN ∩ CE ─────
function vd2(lg) {
  const A = P(130, 40), B = P(40, 250), C = P(430, 250)
  const M = lerp(B, C, 1 / 3), N = lerp(B, C, 2 / 3), D = mid(A, C), E = mid(A, B)
  const I = inter(A, M, B, D), K = inter(A, N, C, E)
  const Q = mid(B, C)
  near(dist(B, M), dist(M, N), 1e-6); near(dist(M, N), dist(N, C), 1e-6)
  const g = trongTam([A, B, C])
  const pts = [A, B, C, M, N, D, E, I, K].concat(lg ? [Q] : [])
  const body = [
    seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, E), seg(A, M), seg(A, N),
    tick(A, E, 2, 0.5), tick(E, B, 2, 0.5), tick(A, D, 3, 0.5), tick(D, C, 3, 0.5),
    tick(B, M, 1, 0.5), tick(M, N, 1, 0.5), tick(N, C, 1, 0.5),
    lg ? segDash(E, D) + segDash(E, Q) + segDash(D, Q) : '',
    dots(A, B, C, M, N, D, E, I, K), lg ? dot(Q) : '',
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(M, 'M', 0, 28), label(N, 'N', 0, 28), lab(D, 'D', g, 20), lab(E, 'E', g, 20),
    label(I, 'I', -12, 26), label(K, 'K', 14, 26),
    lg ? label(Q, 'Q', 0, 28) : '',
    sideText(B, C, 'a', A, 52),
  ]
  hinh(lg ? 'VHB1-VD2_lg' : 'VHB1-VD2', pts, body, NP)
}
vd2(false); vd2(true)

// ───── 14a: G trọng tâm, d qua G cắt AB, AC; A', B', C' hình chiếu ─────
const sideOf = (a, b, p) => Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x))
function b14a(lg) {
  const A = P(60, 40), B = P(180, 275), C = P(420, 260)
  const G = trongTam([A, B, C])
  const dir = unitv(P(0, 0), P(1, -0.08))
  const d1 = P(G.x - dir.x * 210, G.y - dir.y * 210), d2 = P(G.x + dir.x * 210, G.y + dir.y * 210)
  console.assert(sideOf(d1, d2, A) !== sideOf(d1, d2, B) && sideOf(d1, d2, B) === sideOf(d1, d2, C), 'd phải cắt AB, AC')
  const Ap = foot(A, d1, d2), Bp = foot(B, d1, d2), Cp = foot(C, d1, d2)
  const I = mid(A, G), Mm = mid(B, C), Ip = foot(I, d1, d2), Mp = foot(Mm, d1, d2)
  const g = trongTam([A, B, C])
  const ra = (v, p) => rightAngle(v, p, add(v, P(dir.x * 20, dir.y * 20)))
  const pts = [A, B, C, G, d1, d2, Ap, Bp, Cp].concat(lg ? [I, Mm, Ip, Mp] : [])
  const body = [
    seg(A, B), seg(B, C), seg(C, A), seg(d1, d2),
    segDash(A, Ap), segDash(B, Bp), segDash(C, Cp),
    ra(Ap, A), ra(Bp, B), ra(Cp, C),
    lg ? seg(A, Mm) + segDash(I, Ip) + segDash(Mm, Mp) + ra(Ip, I) + ra(Mp, Mm) : '',
    dots(A, B, C, G, Ap, Bp, Cp), lg ? dots(I, Mm, Ip, Mp) : '',
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(G, 'G', 14, -10),
    label(Ap, 'A′', -4, 26), label(Bp, 'B′', 16, 28), label(Cp, 'C′', 20, 22),
    label(P(d2.x - 12, d2.y - 12), 'd', 0, 0),
    lg ? label(I, 'I', -14, 4) + label(Mm, 'M', 4, 26) + label(Ip, 'I′', -16, 28) + label(Mp, 'M′', 4, -14) : '',
  ]
  hinh(lg ? 'VHB1-14a_lg' : 'VHB1-14a', pts, body, NP)
}
b14a(false); b14a(true)

// ───── 14b: d nằm ngoài tam giác; A', B', C', G' hình chiếu ─────
function b14b(lg) {
  const A = P(40, 40), B = P(130, 230), C = P(430, 120)
  const G = trongTam([A, B, C])
  const dir = unitv(P(0, 0), P(1, -0.3))
  const O = P(200, 330)
  const E = mid(A, C), M = mid(B, G)
  const allp = [A, B, C, G].concat(lg ? [E, M] : [])
  const feet = allp.map((p) => foot(p, O, add(O, dir)))
  const tmin = Math.min(...feet.map((f) => (f.x - O.x) / dir.x)) - 40, tmax = Math.max(...feet.map((f) => (f.x - O.x) / dir.x)) + 40
  const d1 = P(O.x + dir.x * tmin, O.y + dir.y * tmin), d2 = P(O.x + dir.x * tmax, O.y + dir.y * tmax)
  const [Ap, Bp, Cp, Gp, Ep, Mp] = feet
  const g = trongTam([A, B, C])
  const ra = (v, p) => rightAngle(v, p, add(v, P(dir.x * 20, dir.y * 20)))
  const pts = [A, B, C, G, d1, d2, Ap, Bp, Cp, Gp]
  const body = [
    seg(A, B), seg(B, C), seg(C, A), seg(d1, d2),
    segDash(A, Ap), segDash(B, Bp), segDash(C, Cp), segDash(G, Gp),
    ra(Ap, A), ra(Bp, B), ra(Cp, C), ra(Gp, G),
    lg ? seg(B, E) + segDash(E, Ep) + segDash(M, Mp) + ra(Ep, E) + ra(Mp, M) : '',
    dots(A, B, C, G, Ap, Bp, Cp, Gp), lg ? dots(E, M, Ep, Mp) : '',
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(G, 'G', 14, -8),
    label(Ap, 'A′', 2, 28), label(Bp, 'B′', -6, 30), label(Cp, 'C′', 6, 30), label(Gp, 'G′', 2, 30),
    label(P(d2.x - 14, d2.y - 14), 'd', 0, 0),
    lg ? label(E, 'E', 18, 4) + label(M, 'M', -16, -4) + label(Ep, 'E′', 4, 28) + label(Mp, 'M′', -4, 28) : '',
  ]
  hinh(lg ? 'VHB1-14b_lg' : 'VHB1-14b', pts, body, NP)
}
b14b(false); b14b(true)

// ───── 15*: M, N ∈ AB; tam giác đều AMD, MNE, BNF cùng phía; G trọng tâm DEF ─────
function b15(lg) {
  const A = P(40, 300), M = P(110, 300), N = P(260, 300), B = P(460, 300)
  const apex = (a, b) => { const m = mid(a, b), h = dist(a, b) * Math.sqrt(3) / 2; return P(m.x, m.y - h) }
  const D = apex(A, M), E = apex(M, N), F = apex(N, B)
  near(dist(A, D), dist(A, M), 1e-6); near(dist(M, E), dist(M, N), 1e-6); near(dist(B, F), dist(N, B), 1e-6)
  const G = trongTam([D, E, F])
  const feet = [D, E, F, G].map((p) => P(p.x, 300))
  const pts = [A, B, D, E, F, G]
  const body = [
    seg(A, B), seg(A, D), seg(D, M), seg(M, E), seg(E, N), seg(N, F), seg(F, B), seg(D, E), seg(E, F), seg(F, D),
    dots(A, B, M, N, D, E, F, G),
    label(A, 'A', -16, 22), label(B, 'B', 16, 22), label(M, 'M', 0, 26), label(N, 'N', 0, 26),
    label(D, 'D', -14, -6), label(E, 'E', -2, -14), label(F, 'F', 8, -14), label(G, 'G', 16, 22),
  ]
  if (lg) {
    const [Dp, Ep, Fp, Gp] = feet
    body.push(segDash(D, Dp), segDash(E, Ep), segDash(F, Fp), segDash(G, Gp), dots(Gp),
      label(Gp, "G′", 20, 28))
  }
  hinh(lg ? 'VHB1-15_lg' : 'VHB1-15', pts.concat(lg ? [P(220, 340)] : []), body, NP)
}
b15(false); b15(true)

// ───── 16a: tứ giác ABCD; E, F trung điểm AD, BC; K trung điểm AC ─────
function b16(lg) {
  const A = P(120, 60), B = P(340, 50), C = P(400, 280), D = P(40, 260)
  const E = mid(A, D), F = mid(B, C), K = mid(A, C)
  const g = trongTam([A, B, C, D])
  const body = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    tick(A, E, 1, 0.5), tick(E, D, 1, 0.5), tick(B, F, 2, 0.5), tick(F, C, 2, 0.5),
    lg ? seg(A, C) + segDash(E, K) + segDash(K, F) + tick(A, K, 3, 0.5) + tick(K, C, 3, 0.5) : segDash(E, F),
    dots(A, B, C, D, E, F), lg ? dot(K) : '',
    lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 22), lab(D, 'D', g, 22), lab(E, 'E', g, 20), lab(F, 'F', g, 20),
    lg ? label(K, 'K', 6, 24) : '',
  ]
  hinh(lg ? 'VHB1-16a_lg' : 'VHB1-16a', [A, B, C, D], body, NP)
}
b16(false); b16(true)

// ───── 17: AB = CD; I, K trung điểm AC, BD; đường thẳng IK ─────
function b17(lg) {
  const A = P(100, 60), B = P(320, 80)
  const L = dist(A, B)
  const C = P(400, 300), D = P(C.x - L * Math.cos(10 * Math.PI / 180), C.y + L * Math.sin(10 * Math.PI / 180))
  near(dist(A, B), dist(C, D), 1e-6)
  const I = mid(A, C), K = mid(B, D), Mm = mid(A, D)
  const u = unitv(I, K), e1 = P(I.x - u.x * 70, I.y - u.y * 70), e2 = P(K.x + u.x * 70, K.y + u.y * 70)
  const g = trongTam([A, B, C, D])
  const body = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(e1, e2),
    tick(A, B, 2, 0.5), tick(C, D, 2, 0.5),
    lg ? segDash(Mm, I) + segDash(Mm, K) + dot(Mm) + label(Mm, 'M', -16, 4) : '',
    dots(A, B, C, D, I, K),
    lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 22), lab(D, 'D', g, 22),
    label(I, 'I', -12, -10), label(K, 'K', 12, 24),
  ]
  hinh(lg ? 'VHB1-17_lg' : 'VHB1-17', [A, B, C, D, e1, e2].concat(lg ? [Mm] : []), body, NP)
}
b17(false); b17(true)

// ───── 18: A', B', C', D' trọng tâm; AA', BB', CC', DD' đồng quy ─────
function b18(lg) {
  const A = P(110, 60), B = P(300, 70), C = P(450, 290), D = P(30, 270)
  const cen = (x, y, z) => trongTam([x, y, z])
  const Ap = cen(B, C, D), Bp = cen(A, C, D), Cp = cen(A, B, D), Dp = cen(A, B, C)
  const E = mid(A, C), F = mid(B, D), Mm = mid(E, F)
  const I = mid(C, Ap)
  const g = trongTam([A, B, C, D])
  const body = [seg(A, B), seg(B, C), seg(C, D), seg(D, A)]
  if (!lg) body.push(seg(A, Ap), seg(B, Bp), seg(C, Cp), seg(D, Dp), dots(A, B, C, D, Ap, Bp, Cp, Dp),
    label(Ap, "A′", 14, -6), label(Bp, "B′", -16, 14), label(Cp, "C′", -14, -8), label(Dp, "D′", 16, 16))
  else body.push(seg(A, C), seg(B, D), seg(E, F), seg(A, Ap), segDash(C, F), segDash(E, I),
    dots(A, B, C, D, Ap, E, F, Mm, I), label(Ap, "A′", 14, 24), label(E, 'E', -2, -14), label(F, 'F', -14, 20), label(Mm, 'M', 8, -12), label(I, 'I', 14, 22))
  body.push(lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 22), lab(D, 'D', g, 22))
  hinh(lg ? 'VHB1-18_lg' : 'VHB1-18', [A, B, C, D], body, NP)
}
b18(false); b18(true)

// ───── 19: ABC nhọn, trực tâm H, M trung điểm BC; qua H ⊥ HM cắt AB, AC ở E, F ─────
function b19(kieu) {
  const A = P(300, 40), B = P(40, 300), C = P(430, 310)
  const Ha = foot(A, B, C), Hb = foot(B, A, C), Hc = foot(C, A, B)
  const H = inter(A, Ha, B, Hb)
  const Mm = mid(B, C)
  const hm = unitv(H, Mm), pv = P(-hm.y, hm.x)
  const E = inter(H, add(H, pv), A, B), F = inter(H, add(H, pv), A, C)
  console.assert(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(A, C, B) < 90, '19 không nhọn')
  const D = doiXung(C, H)
  const K = Hb
  const G = inter(D, E, B, H)
  const g = trongTam([A, B, C])
  const body = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, Ha), seg(B, Hb), seg(C, Hc), seg(H, Mm), seg(E, F),
    rightAngle(Ha, A, C), rightAngle(Hb, B, A), rightAngle(Hc, C, A),
    dots(A, B, C, H, Mm, E, F),
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(H, 'H', 18, 4), label(Mm, 'M', 4, 28), lab(E, 'E', g, 20), lab(F, 'F', g, 20),
  ]
  let pts = [A, B, C, E, F]
  let ten = 'VHB1-19'
  if (kieu === 'a' || kieu === 'b') {
    ten = `VHB1-19_${kieu}_lg`
    pts = pts.concat([D])
    body.push(seg(H, D), seg(B, D), dot(D), lab(D, 'D', P(H.x, H.y), 22))
    if (kieu === 'b') { body.push(seg(D, E), dots(G, K), label(G, 'G', -16, -6), label(K, 'K', 16, -6)) }
  }
  hinh(ten, pts, body, NP)
}
b19(null); b19('a'); b19('b')

// ───── 20: B, C trên đường tròn đường kính AD; AD = 8, AB = BC = 2 ─────
function b20(lg) {
  const O = P(280, 190), R = 140
  const th = 2 * Math.asin(1 / 4) * 180 / Math.PI
  const A = P(O.x - R, O.y), D = P(O.x + R, O.y)
  const B = ray(O, 180 - th, R), C = ray(O, 180 - 2 * th, R)
  near(dist(A, B) / 35, 2, 1e-6); near(dist(B, C) / 35, 2, 1e-6)
  const H = inter(A, C, O, B)
  const g = trongTam([A, B, C, D])
  const body = [
    circle(O, R), seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    tick(A, B, 1, 0.5), tick(B, C, 1, 0.5),
    dots(A, B, C, D),
    lab(A, 'A', O, 20), lab(B, 'B', O, 22), lab(C, 'C', O, 22), lab(D, 'D', O, 20),
    sideText(A, B, '2', C, 18), sideText(B, C, '2', A, 18), sideText(A, D, '8', B, 24),
  ]
  const mCD = mid(C, D), vcd = sub(foot(A, C, D), A), l = Math.hypot(vcd.x, vcd.y)
  body.push(bien(P(mCD.x + vcd.x / l * 18, mCD.y + vcd.y / l * 18), 'x', 0, 8))
  if (lg) body.push(segDash(O, B), segDash(A, C), dots(O, H), label(O, 'O', 4, -14), label(H, 'H', 8, 26))
  hinh(lg ? 'VHB1-20_lg' : 'VHB1-20', [A, B, C, D, P(O.x, O.y + R), P(O.x, O.y - R)], body, NP)
}
b20(false); b20(true)

await xuatTat(OUT)
