// Vẽ lại hình — gói HH00138-3 (Ôn thi giữa kì I, Hình học 7: góc đối đỉnh, hai đường thẳng song song, tam giác bằng nhau).
//   node scripts/anh/ve_lai/HH00138-3.mjs [<thu_muc_ra>]
// Mỗi hình một khối { }; điểm dựng bằng số đo CỦA ĐỀ (ray/rot/inter/foot/bisector…), không chép toạ độ ước mắt.
import { P, seg, angleMark, rightAngle, ray, inter, foot, bisector, goc, dist, dot, label, num, bien, angleText, angleBien, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00138-3/moi'
const ok = (cond, msg) => { if (!cond) console.error('✘ SAI DỮ KIỆN:', msg) }

// HHC002778 — a ⊥ c, b ⊥ c, góc BAb = 55°; ý c: Bx phân giác B1 cắt b tại E
{
  const D = 110, B = P(0, 0), A = ray(B, 235, D / Math.sin(55 * Math.PI / 180))   // A trên b, góc BAb = 55°
  const xC = 162, aL = P(-110, 0), aR = P(270, 0), bL = P(-130, D), bR = P(262, D)
  const C1 = P(xC, 0), C2 = P(xC, D), cTop = P(xC, -50), cBot = P(xC, D + 52)
  const tTop = ray(B, 55, 62), tBot = ray(A, 235, 62)
  const bRight = P(A.x + 100, D)
  const Bx = ray(B, -62.5, 100), E = inter(B, Bx, A, bRight), xEnd = ray(B, -62.5, dist(B, E) + 36)
  ok(Math.abs(goc(A, bRight, B) - 55) < 0.5, 'BAb = 55')
  ok(Math.abs(goc(B, P(100, 0), A) - 125) < 0.5, 'B1 = 125')
  ok(Math.abs(goc(B, P(100, 0), Bx) - 62.5) < 0.5, 'Bx phân giác B1')
  hinh('HHC002778', [aL, aR, bL, bR, cTop, cBot, tTop, tBot, xEnd], [
    seg(aL, aR), seg(bL, bR), seg(cTop, cBot), seg(tBot, tTop), seg(B, xEnd),
    rightAngle(C1, aR, cTop), rightAngle(C2, bR, cTop),
    angleMark(A, bRight, B, 36),
    dot(A), dot(B), dot(C1), dot(C2), dot(E),
    num(P(A.x + 68, A.y - 28), '55°', 0, 8),
    num(ray(B, 117.5, 30), '2', 0, 8), num(ray(B, 27.5, 36), '3', 0, 8), num(ray(B, -28, 36), '1', 0, 8),
    label(B, 'B', -32, 30), label(A, 'A', 8, 36), label(E, 'E', -16, 32), label(xEnd, 'x', 16, 12),
    label(aR, 'a', 0, -12), label(bR, 'b', 0, -12), label(cBot, 'c', 16, 6),
  ])
}

// HHC002780 — Hình 3: hai đường thẳng xy và ab cắt nhau tại A
{
  const A = P(0, 0), x = ray(A, 165, 190), y = ray(A, -15, 190), b = ray(A, 50, 150), a = ray(A, 230, 150)
  hinh('HHC002780', [x, y, a, b, P(70, 108)], [
    seg(x, y), seg(a, b), dot(A),
    label(x, 'x', 2, -12), label(y, 'y', 4, 26), label(b, 'b', 16, 4), label(a, 'a', -10, 16),
    label(A, 'A', 14, 38), num(P(70, 100), 'Hình 3', 0, 8),
  ])
}

// HHC002783 — a ∥ b, AB cắt a tại A, cắt b tại B; góc tại B = 45° (giữa tia phải của b và BA); x ở A là góc so le trong
{
  const D = 100, B = P(0, D), A = ray(B, 45, D * Math.SQRT2)   // A trên a (y = 0)
  const aL = P(-90, 0), aR = P(190, 0), bL = P(-90, D), bR = P(190, D)
  const tTop = ray(A, 45, 46), tBot = ray(B, 225, 46), bRight = P(120, D)
  ok(Math.abs(goc(B, bRight, A) - 45) < 0.5, 'góc B = 45')
  ok(Math.abs(A.y) < 1e-6, 'A trên a')
  hinh('HHC002783', [aL, aR, bL, bR, tTop, tBot], [
    seg(aL, aR), seg(bL, bR), seg(tBot, tTop),
    angleMark(A, aL, B, 36), angleMark(B, bRight, A, 36),
    dot(A), dot(B),
    angleText(B, bRight, A, '45°', 78), angleBien(A, aL, B, 'x', 66),
    label(A, 'A', -18, -12), label(B, 'B', 16, 36), label(aR, 'a', 12, -10), label(bR, 'b', 12, -10),
  ])
}

// HHC002785 — hình bình hành MNPQ (MN = PQ, MQ = NP), góc Q = 60°; E ∈ MN, PE ⊥ MN; F ∈ tia QM ∩ đường PE
{
  const Q = P(0, 0), Pp = P(150, 0), M = ray(Q, 60, 90)
  const N = P(M.x + 150, M.y), E = P(Pp.x, M.y)
  const F = inter(Q, M, Pp, E)
  ok(Math.abs(goc(Q, M, Pp) - 60) < 0.5, 'Q = 60')
  ok(Math.abs(dist(M, N) - dist(Q, Pp)) < 0.01 && Math.abs(dist(M, Q) - dist(N, Pp)) < 0.01, 'MN = PQ, MQ = NP')
  ok(E.x > M.x && E.x < N.x, 'E nằm giữa M, N')
  ok(F.y < E.y && E.y < Pp.y, 'E nằm giữa F, P')
  ok(M.y < Q.y && M.y > F.y && Math.abs(goc(F, Q, Pp) - 30) < 0.5, 'M giữa Q, F; góc QFP = 30')
  hinh('HHC002785', [Q, Pp, M, N, F], [
    seg(Q, F), seg(M, N), seg(N, Pp), seg(Q, Pp), seg(M, Pp), seg(Pp, F),
    rightAngle(E, M, F),
    dot(M), dot(N), dot(Pp), dot(Q), dot(E), dot(F),
    label(M, 'M', -24, 2), label(N, 'N', 20, 8), label(Pp, 'P', 14, 32), label(Q, 'Q', -18, 28),
    label(E, 'E', 16, -10), label(F, 'F', 0, -14),
  ])
}

// HHC002788 — hai đường thẳng song song bị cắt bởi một đường thẳng; H3 = K1 = 120°
{
  const th = 38, dn = -82                       // đường song song hướng 38°, cát tuyến hướng xuống −82° ⇒ H3 = 120°
  const H = P(0, 0), K = ray(H, dn, 118)
  const R = 125, Lw = 125
  const hR = ray(H, th, R), hL = ray(H, th + 180, Lw), kR = ray(K, th, R), kL = ray(K, th + 180, Lw)
  const tTop = ray(H, dn + 180, 50), tBot = ray(K, dn, 50)
  const rayH = (ang) => ray(H, ang, 60), rayK = (ang) => ray(K, ang, 60)
  ok(Math.abs(goc(H, rayH(th), rayH(dn)) - 120) < 0.5, 'H3 = 120')
  ok(Math.abs(goc(K, rayK(th + 180), rayK(dn + 180)) - 120) < 0.5, 'K1 = 120')
  // đánh số bốn góc tại mỗi giao điểm: 1 trên-trái, 4 trên-phải, 2 dưới-trái, 3 dưới-phải
  const so = (V, t, ang, r) => num(ray(V, ang, r), t, 0, 8)
  const bis1 = (th + 180 + dn + 180) / 2       // trên-trái
  const bis4 = (th + dn + 180) / 2             // trên-phải
  const bis2 = (th + 180 + dn + 360) / 2       // dưới-trái
  const bis3 = (th + dn) / 2                   // dưới-phải
  hinh('HHC002788', [hR, hL, kR, kL, tTop, tBot], [
    seg(hL, hR), seg(kL, kR), seg(tTop, tBot),
    angleMark(H, rayH(th), rayH(dn), 40), angleMark(K, rayK(th + 180), rayK(dn + 180), 40),
    dot(H), dot(K),
    so(H, '1', bis1, 30), so(H, '4', bis4, 34), so(H, '2', bis2, 34), so(H, '3', bis3, 25),
    so(K, '1', bis1, 25), so(K, '4', bis4, 34), so(K, '2', bis2, 34), so(K, '3', bis3, 30),
    label(H, 'H', -58, 8), label(K, 'K', 56, 8),
  ])
}

// HHC002790 — a ∥ b, c cắt a tại A, b tại B; A1 ở dưới-trái của A (giữa tia trái của a và AB), B1 ở trên-trái của B
{
  const D = 110, A = P(0, 0), B = P(-D / Math.tan(65 * Math.PI / 180), D)    // A1 = 65°, B1 = 115° (đúng đáp án)
  const aL = P(-170, 0), aR = P(125, 0), bL = P(-170 + B.x, D), bR = P(125 + B.x, D)
  const cTop = ray(A, 65, 54), cBot = ray(B, 245, 54)
  ok(Math.abs(goc(A, aL, B) - 65) < 0.5, 'A1 = 65')
  ok(Math.abs(goc(B, bL, A) - 115) < 0.5, 'B1 = 115')
  hinh('HHC002790', [aL, aR, bL, bR, cTop, cBot], [
    seg(aL, aR), seg(bL, bR), seg(cBot, cTop), dot(A), dot(B),
    num(ray(A, 122.5, 30), '2', 0, 8), num(ray(A, 212.5, 38), '1', 0, 8), num(ray(B, 122.5, 30), '1', 0, 8),
    label(A, 'A', 22, 32), label(B, 'B', 22, 34),
    label(aR, 'a', 12, -10), label(bR, 'b', 12, -10), label(cTop, 'c', 16, 6),
  ])
}

// HHC002792 — xy ∩ zt = O, xOt = 60°; ý c: Om phân giác xOz
{
  const O = P(0, 0), L = 140
  const x = ray(O, 150, L), t = ray(O, 210, L), z = ray(O, 30, L), y = ray(O, -30, L)
  const m = bisector(O, x, z, 112)
  ok(Math.abs(goc(O, x, t) - 60) < 0.5, 'xOt = 60')
  ok(Math.abs(goc(O, x, m) - 60) < 0.5 && Math.abs(goc(O, m, z) - 60) < 0.5, 'Om phân giác')
  hinh('HHC002792', [x, t, z, y, m], [
    seg(x, y), seg(t, z), seg(O, m), dot(O),
    angleText(O, x, t, '60°', 62),
    label(x, 'x', -8, -2), label(t, 't', -8, 16), label(z, 'z', 10, -2), label(y, 'y', 12, 16),
    label(m, 'm', 0, -10), label(O, 'O', 0, 34),
  ])
}

// HHC002793 — AB ⊥ xy tại A, AB ⊥ mn tại B, EF cắt xy tại C, mn tại D, xCE = 80°; ý c: DH ⊥ xy tại H
{
  const A = P(0, 0), B = P(0, 155)
  const C = P(-112, 0)
  const dirE = 100                                         // tia CE: góc xCE = 80° (tia Cx hướng 180°)
  const Dd = inter(C, ray(C, dirE, 1), B, P(-1, B.y))      // D = EF ∩ mn
  const xl = P(-195, 0), yr = P(70, 0), ml = P(-195, B.y), nr = P(70, B.y)
  const Ee = ray(C, dirE, 74), Ff = ray(Dd, dirE + 180, 56)
  const aTop = P(0, -46), bBot = P(0, B.y + 46)
  const H = foot(Dd, xl, yr)
  ok(Math.abs(goc(C, xl, Ee) - 80) < 0.5, 'xCE = 80')
  ok(Math.abs(goc(Dd, B, C) - 100) < 0.5, 'CDB = 100')
  ok(Math.abs(goc(Dd, C, H) - 10) < 0.5, 'CDH = 10')
  hinh('HHC002793', [xl, yr, ml, nr, Ee, Ff, aTop, bBot], [
    seg(xl, yr), seg(ml, nr), seg(aTop, bBot), seg(Ee, Ff), seg(H, Dd),
    rightAngle(A, C, aTop), rightAngle(B, Dd, A), rightAngle(H, yr, Dd, 12),
    dot(A), dot(B), dot(C), dot(Dd), dot(H),
    angleText(C, xl, Ee, '80°', 58),
    label(xl, 'x', 8, -10), label(yr, 'y', 4, -10), label(ml, 'm', 8, -10), label(nr, 'n', 4, -10),
    label(Ee, 'E', -6, -12), label(Ff, 'F', 14, 22),
    label(C, 'C', -22, 32), label(H, 'H', 18, -10), label(A, 'A', 16, -10), label(B, 'B', 18, 32), label(Dd, 'D', -20, 32),
  ])
}

await xuatTat(RA)
