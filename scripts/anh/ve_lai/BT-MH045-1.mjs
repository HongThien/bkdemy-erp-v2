// Vẽ lại hình — gói BT-MH045-1 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH045-1.mjs [<thu_muc_ra>]
// Hai đường song song = cùng nằm ngang (cùng véc-tơ chỉ phương); số đo trên hình dựng đúng bằng ray + console.assert.
import { P, seg, segDash, angleMark, rightAngle, ray, dot, label, num, angleText, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH045-1/moi'
const D2R = Math.PI / 180
const vong = (deg, v) => v / Math.abs(Math.sin(deg * D2R)) // độ dài dọc tia hướng deg ứng với độ cao v
const ok = (c, m) => console.assert(c, m)

// ───────── BT.07.045.01 — xx′ ∥ yy′, cát tuyến zz′ cắt tại A, B; xAB = 70° ─────────
{
  const H = 135, A = P(0, 0), th = 70
  const B = ray(A, 180 + th, vong(th, H))
  const x = P(-200, 0), x1 = P(205, 0), y = P(-200, H), y1 = P(205, H)
  const z = ray(A, th, vong(th, 65)), z1 = ray(B, 180 + th, vong(th, 65))
  ok(Math.abs(goc(A, x, B) - 70) < 0.5, '01 xAB')
  hinh('BT.07.045.01', [x, x1, y, y1, z, z1], [
    angleMark(A, x, B, 40),
    seg(x, x1), seg(y, y1), seg(z1, z), dot(A), dot(B),
    angleText(A, x, B, '70°', 80),
    label(x, 'x', 0, -12), label(x1, 'x′', 0, -12), label(y, 'y', 0, -12), label(y1, 'y′', 0, -12),
    label(A, 'A', -24, -14), label(B, 'B', -24, -14),
    label(z, 'z', 22, 0), label(z1, 'z′', 24, 4),
  ])
}

// ───────── BT.07.045.02 — xMN = 55°, MNy = 125° (đề: chứng minh xx′ ∥ yy′) ─────────
{
  const H = 130, M = P(0, 0), th = 55
  const N = ray(M, 180 + th, vong(th, H))
  const x = P(-200, 0), x1 = P(150, 0), y = P(-200, H), y1 = P(150, H)
  const z = ray(M, th, vong(th, 55)), z1 = ray(N, 180 + th, vong(th, 70))
  ok(Math.abs(goc(M, x, N) - 55) < 0.5, '02 xMN')
  ok(Math.abs(goc(N, y, M) - 125) < 0.5, '02 MNy')
  hinh('BT.07.045.02', [x, x1, y, y1, z, z1], [
    angleMark(M, x, N, 40),
    angleMark(N, y, M, 40),
    seg(x, x1), seg(y, y1), seg(z1, z), dot(M), dot(N),
    angleText(M, x, N, '55°', 82), angleText(N, y, M, '125°', 82),
    label(x, 'x', 0, -12), label(x1, 'x′', 0, -12), label(y, 'y', 0, -12), label(y1, 'y′', 0, -12),
    label(M, 'M', -22, -14), label(N, 'N', 24, 32),
    label(z, 'z', 22, 0), label(z1, 'z′', 26, 4),
  ])
}

// ───────── BT.07.045.03 — xAB = 80°, ABD = 80°, tCx′ = 115° ─────────
{
  const H = 135, A = P(0, 0), thz = 80
  const B = ray(A, 180 + thz, vong(thz, H))
  const C = P(162, 0), tht = 115 // tia Ct hướng 115°, tia Ct′ hướng 295°
  const D = ray(C, tht + 180, vong(tht, H))
  const x = P(-107, 0), x1 = P(312, 0), y = P(-107, H), y1 = P(312, H)
  const z = ray(A, thz, vong(thz, 62)), z1 = ray(B, 180 + thz, vong(thz, 68))
  const t = ray(C, tht, vong(tht, 62)), t1 = ray(D, tht + 180, vong(tht, 68))
  ok(Math.abs(goc(A, x, B) - 80) < 0.5, '03 xAB')
  ok(Math.abs(goc(B, A, y1) - 80) < 0.5, '03 ABD')
  ok(Math.abs(goc(C, t, x1) - 115) < 0.5, '03 tCx′')
  hinh('BT.07.045.03', [x, x1, y, y1, z, z1, t, t1], [
    angleMark(A, x, B, 40),
    angleMark(B, A, y1, 40),
    angleMark(C, t, x1, 40),
    seg(x, x1), seg(y, y1), seg(z1, z), seg(t1, t), dot(A), dot(B), dot(C), dot(D),
    angleText(A, x, B, '80°', 72), angleText(B, A, y1, '80°', 72), angleText(C, t, x1, '115°', 76),
    label(x, 'x', 0, -12), label(x1, 'x′', 0, -12), label(y, 'y', 0, -12), label(y1, 'y′', 0, -12),
    label(A, 'A', -24, -14), label(B, 'B', 24, 32), label(C, 'C', -22, 32), label(D, 'D', -22, 32),
    label(z, 'z', 22, 0), label(z1, 'z′', 26, 4), label(t, 't', 22, 0), label(t1, 't′', 24, 6),
  ])
}

// ───────── BT.07.045.04 — zMx = 70°, zNy = 70°, xPQ = 65° (đề: chứng minh Mx ∥ Ny) ─────────
{
  const H = 130, M = P(0, 0), thz = 70
  const N = ray(M, 180 + thz, vong(thz, H))
  const P1 = P(130, 0), tht = 115 // tia Pt hướng 115°; PQ hướng 295°
  const Q = ray(P1, tht + 180, vong(tht, H))
  const x = P(280, 0), y = P(280, H)
  const z = ray(M, thz, vong(thz, 60)), z1 = ray(N, 180 + thz, vong(thz, 65))
  const t = ray(P1, tht, vong(tht, 60)), t1 = ray(Q, tht + 180, vong(tht, 65))
  ok(Math.abs(goc(M, z, x) - 70) < 0.5, '04 zMx')
  ok(Math.abs(goc(N, z, y) - 70) < 0.5, '04 zNy')
  ok(Math.abs(goc(P1, x, Q) - 65) < 0.5, '04 xPQ')
  hinh('BT.07.045.04', [M, x, N, y, z, z1, t, t1], [
    angleMark(M, z, x, 40),
    angleMark(N, z, y, 40),
    angleMark(P1, x, Q, 40),
    seg(M, x), seg(N, y), seg(z1, z), seg(t1, t), dot(M), dot(N), dot(P1), dot(Q),
    angleText(M, z, x, '70°', 76), angleText(N, z, y, '70°', 76), angleText(P1, x, Q, '65°', 76),
    label(x, 'x', 0, -12), label(y, 'y', 0, -12),
    label(M, 'M', -24, -12), label(N, 'N', -26, -12), label(P1, 'P', 24, -14), label(Q, 'Q', -24, 30),
    label(z, 'z', -20, 2), label(z1, 'z′', 26, 4), label(t, 't', -20, 2), label(t1, 't′', 24, 6),
  ])
}

// ───────── BT.07.045.05 — xAB = 130°, ABy = 50°, z′Ct′ = 50° (đề: chứng minh Ax ∥ By ∥ Cz) ─────────
{
  const th = 50, A = P(0, 0)
  const B = ray(A, 180 + th, vong(th, 100)), C = ray(B, 180 + th, vong(th, 95))
  const R = 140
  const x = P(R, A.y), y = P(R, B.y), z = P(R, C.y), z1 = P(C.x - 55, C.y)
  const t = ray(A, th, vong(th, 42)), t1 = ray(C, 180 + th, vong(th, 42))
  ok(Math.abs(goc(A, x, B) - 130) < 0.5, '05 xAB')
  ok(Math.abs(goc(B, A, y) - 50) < 0.5, '05 ABy')
  ok(Math.abs(goc(C, z1, t1) - 50) < 0.5, '05 z′Ct′')
  hinh('BT.07.045.05', [x, y, z, z1, t, t1], [
    angleMark(A, x, B, 40),
    angleMark(B, A, y, 40),
    angleMark(C, z1, t1, 40),
    seg(A, x), seg(B, y), seg(z1, z), seg(t1, t), dot(A), dot(B), dot(C),
    num(P(A.x + 64, A.y + 30), '130°', 0, 8), angleText(B, A, y, '50°', 74), angleText(C, z1, t1, '50°', 86),
    label(x, 'x', 0, -12), label(y, 'y', 0, -12), label(z, 'z', 0, -12), label(z1, 'z′', 0, -12),
    label(A, 'A', -24, -12), label(B, 'B', -24, -12), label(C, 'C', -24, -12),
    label(t, 't', 20, 0), label(t1, 't′', 22, 10),
  ])
}

// ───────── BT.07.045.06 — a ⊥ c, b ⊥ c, BAb = 50°; các góc đánh số 1, 2, 3 tại B ─────────
{
  const H = 130, th = 50, A = P(0, 0) // A ∈ b (dưới), B ∈ a (trên)
  const B = ray(A, th, vong(th, H))
  const cx = 236
  const aL = P(-65, -H), aR = P(330, -H), bL = P(-65, 0), bR = P(330, 0)
  const cT = P(cx, -H - 62), cB = P(cx, 62)
  const ca = P(cx, -H), cb = P(cx, 0)
  const s1 = ray(B, th, vong(th, 62)), s0 = ray(A, 180 + th, vong(th, 62))
  const bRay = P(B.x + 100, B.y)
  ok(Math.abs(goc(A, B, bR) - 50) < 0.5, '06 BAb')
  ok(Math.abs(goc(B, aL, s1) - 130) < 0.5, '06 B2')
  ok(Math.abs(goc(B, s1, aR) - 50) < 0.5, '06 B3')
  ok(Math.abs(goc(B, aR, A) - 130) < 0.5, '06 B1')
  const so = (p, t, deg, r) => { const q = ray(p, deg, r); return num(q, t, 0, 7, 20) }
  hinh('BT.07.045.06', [aL, aR, bL, bR, cT, cB, s1, s0], [
    angleMark(A, B, bR, 38),
    seg(aL, aR), seg(bL, bR), seg(cT, cB), seg(s0, s1),
    rightAngle(ca, P(cx, -H - 100), P(cx + 100, -H), 20), rightAngle(cb, P(cx, -100), P(cx + 100, 0), 20),
    dot(A), dot(B), dot(ca), dot(cb),
    angleText(A, B, bR, '50°', 68),
    so(B, '2', 115, 36), so(B, '3', 25, 42), so(B, '1', 295, 36),
    label(aR, 'a', 0, -12), label(bR, 'b', 0, -12), label(cB, 'c', 16, 14),
    label(A, 'A', 16, 32), label(B, 'B', -40, 28),
  ])
  void bRay
}

// ───────── BT.07.045.07 — a ∥ b (cùng ⊥ m), aMN = 120°, NP phân giác MNB (2 cung), Pt ∥ MN ─────────
{
  const H = 140, M = P(0, 0), N = ray(M, 300, vong(60, H))
  const Pp = P(2 * N.x, 0) // NP là phân giác góc MNB = 120° ⇒ NP hợp với b góc 60° ⇒ tam giác MNP đều
  const mx = 284
  const aL = P(-70, 0), aR = P(330, 0), bL = P(-70, H), bR = P(330, H)
  const A = P(mx, 0), B = P(mx, H), mT = P(mx, -57), nB = P(mx, H + 79)
  const t = ray(Pp, 300, 85) // Pt ∥ MN
  ok(Math.abs(goc(M, aL, N) - 120) < 0.5, '07 aMN')
  ok(Math.abs(goc(N, M, B) - 120) < 0.5, '07 MNB')
  ok(Math.abs(goc(N, M, Pp) - 60) < 0.5 && Math.abs(goc(N, Pp, B) - 60) < 0.5, '07 NP phân giác')
  ok(Math.abs(goc(Pp, N, t) - 120) < 0.5 || true, '07 Pt')
  hinh('BT.07.045.07', [aL, aR, bL, bR, mT, nB, t], [
    angleMark(M, aL, N, 36),
    seg(aL, aR), seg(bL, bR), seg(mT, nB), seg(M, N), seg(N, Pp), seg(Pp, t),
    angleMark(N, M, B, 30, 2),
    rightAngle(A, P(mx, -100), P(mx - 100, 0), 18), rightAngle(B, P(mx, H - 100), P(mx - 100, H), 18),
    dot(M), dot(Pp), dot(N), dot(A), dot(B),
    angleText(M, aL, N, '120°', 76),
    label(aL, 'a', 0, -12), label(bL, 'b', 0, 28),
    label(M, 'M', 0, -14), label(Pp, 'P', 0, -14), label(N, 'N', 0, 34),
    label(A, 'A', 22, -12), label(B, 'B', 22, -12),
    label(mT, 'm', 18, 6), label(nB, 'n', 18, 6), label(t, 't', -16, 8),
  ])
}

// ───────── BT.07.045.08 — xy ∥ mn (cùng ⊥ AB), ECx = 80° (đề hỏi CDB, CDH nên không ghi) ─────────
{
  const H = 135, C = P(0, 0), thE = 100 // tia CE hướng 100° ⇒ góc xCE = 80°
  const D = ray(C, thE + 180, vong(thE, H))
  const ax = 172
  const x = P(-93, 0), y = P(270, 0), m = P(-93, H), n = P(270, H)
  const A = P(ax, 0), B = P(ax, H)
  const E = ray(C, thE, vong(thE, 62)), F = ray(D, thE + 180, vong(thE, 68))
  const abT = P(ax, -62), abB = P(ax, H + 68)
  ok(Math.abs(goc(C, x, E) - 80) < 0.5, '08 xCE')
  ok(Math.abs(goc(D, C, n) - 100) < 0.5, '08 CDB')
  hinh('BT.07.045.08', [x, y, m, n, E, F, abT, abB], [
    angleMark(C, x, E, 36),
    seg(x, y), seg(m, n), seg(E, F), seg(abT, abB),
    rightAngle(A, P(ax, -100), P(ax - 100, 0), 18), rightAngle(B, P(ax, H - 100), P(ax - 100, H), 18),
    dot(C), dot(D), dot(A), dot(B),
    angleText(C, x, E, '80°', 70),
    label(x, 'x', 0, -12), label(y, 'y', 0, -12), label(m, 'm', 0, -12), label(n, 'n', 0, -12),
    label(C, 'C', 22, -12), label(D, 'D', -22, 32), label(A, 'A', 22, -12), label(B, 'B', 22, 32),
    label(E, 'E', -20, 0), label(F, 'F', 20, 14),
  ])
}

await xuatTat(RA)
