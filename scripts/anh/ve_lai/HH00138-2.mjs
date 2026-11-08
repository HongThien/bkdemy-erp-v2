// Vẽ lại hình — gói HH00138-2 (Ôn thi giữa kì I, Hình học 7: song song, góc). Thùy 13/10.
//   node scripts/anh/ve_lai/HH00138-2.mjs [<thu_muc_ra>]
// HHC002774 (ảnh chụp 3 cây cầu thật, câu hỏi cần chính bức ảnh) KHÔNG vẽ.
import { P, seg, lineExt, angleMark, rightAngle, ray, rot, lerp, inter, dot, label, num, angleText, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00138-2/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${e}`)

// HHC002695 — a ∥ b; xAO = 35°, yBO = 55° (x, y hướng sang phải); O giữa hai đường
{
  const H = 150, A = P(0, 0)
  const dA = 55 / Math.sin(35 * Math.PI / 180)
  const O = ray(A, -35, dA)
  const dB = (H - 55) / Math.sin(55 * Math.PI / 180)
  const B = P(O.x - dB * Math.cos(55 * Math.PI / 180), H)
  const ax = P(120, 0), by = P(B.x + 120, H)
  ok(goc(A, ax, O), 35, 'xAO'); ok(goc(B, by, O), 55, 'yBO'); ok(goc(O, A, B), 90, 'AOB')
  const a0 = P(-40, 0), a1 = P(215, 0), b0 = P(-40, H), b1 = P(215, H)
  hinh('HHC002695', [a0, a1, b0, b1, O], [seg(a0, a1), seg(b0, b1), seg(A, O), seg(O, B), dot(A), dot(O), dot(B),
    label(A, 'A', -8, -14), label(O, 'O', 18, 8), label(B, 'B', -4, 34), label(a1, 'a', 20, 8), label(b1, 'b', 20, 8),
    angleText(A, ax, O, '35°', 64), angleText(B, by, O, '55°', 52)])
}

// HHC002696 — tam giác ABC (ABC = 53°, ACB = 73° ⇒ BAC = 54°); xy qua A ∥ MN ∥ BC; M ∈ AB, N ∈ AC
{
  const B = P(0, 0), C = P(250, 0)
  const A = inter(B, ray(B, 53, 100), C, ray(C, 107, 100))
  const M = lerp(A, B, 0.52), N = lerp(A, C, 0.52)
  ok(goc(A, B, C), 54, 'BAC')
  const X = 330, xl = P(-80, A.y), yr = P(X, A.y), zl = P(-80, M.y), kr = P(X, N.y)
  hinh('HHC002696', [xl, yr, B, C, A], [seg(xl, yr), seg(zl, kr), seg(A, B), seg(A, C), seg(B, C), dot(A), dot(B), dot(C), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -14, 30), label(C, 'C', 14, 30), label(M, 'M', 20, 28), label(N, 'N', -20, 28),
    label(xl, 'x', 0, -10), label(yr, 'y', 0, -10), label(zl, 'z', 0, -10), label(kr, 'k', 0, -10),
    angleText(A, xl, B, '53°', 62), angleText(M, A, zl, '127°', 62), angleText(N, C, kr, '73°', 62), angleText(C, B, A, '73°', 80)])
}

// HHC002697 — BAC = 100°, ACB = 40°; E trên tia đối của AB; AD là phân giác của CAE (nằm ngang)
{
  const B = P(0, 0), C = P(300, 0)
  const A = inter(B, ray(B, 40, 100), C, ray(C, 140, 100))
  const E = lerp(B, A, 1.55)
  const D = P(A.x + 120, A.y)
  ok(goc(A, B, C), 100, 'BAC'); ok(goc(C, B, A), 40, 'ACB'); ok(goc(A, C, D), 40, 'CAD'); ok(goc(A, D, E), 40, 'DAE')
  const D2 = P(A.x + 125, A.y)
  hinh('HHC002697', [B, C, A, E, D2], [seg(B, C), seg(B, E), seg(A, C), seg(A, D2), dot(A), dot(B), dot(C), dot(D), dot(E),
    label(A, 'A', -18, -8), label(B, 'B', -16, 8), label(C, 'C', 18, 8), label(D, 'D', 4, 28), label(E, 'E', -16, -4),
    angleText(A, B, C, '100°', 50), angleText(C, B, A, '40°', 92)])
}

// HHC002698 — a ∥ b (suy ra từ 123° ⇒ 57°), c cắt a tại A, b tại B; d ⊥ a tại D, cắt b tại C; góc B = 57°
{
  const H = 140, B = P(0, H), A = ray(B, 57, H / Math.sin(57 * Math.PI / 180))
  const D = P(A.x + 105, 0), C = P(D.x, H)
  const cEnd = P(A.x + (A.x - B.x) / H * 60, -60), cBot = P(B.x - (A.x - B.x) / H * 45, H + 45)
  const dTop = P(D.x, -55), dBot = P(D.x, H + 50)
  const a0 = P(-60, 0), a1 = P(D.x + 70, 0), b0 = P(-60, H), b1 = P(D.x + 70, H)
  hinh('HHC002698', [a0, a1, b0, b1, cEnd, cBot, dTop, dBot], [seg(a0, a1), seg(b0, b1), seg(cBot, cEnd), seg(dTop, dBot), dot(A), dot(B), dot(C), dot(D),
    rightAngle(D, A, C, 14),
    label(a0, 'a', -14, -6), label(b0, 'b', -14, -6), label(cEnd, 'c', 16, 6), label(dTop, 'd', 16, 8),
    label(A, 'A', 20, 26), label(B, 'B', -2, 34), label(C, 'C', -18, 26), label(D, 'D', -16, -10),
    angleText(B, P(B.x + 100, H), A, '57°', 74),
    num(P((a0.x + a1.x) / 2, H + 85), '(H2)', 0, 0, 20)])
}

// HHC002699 — e ∥ f (60° đồng vị), Am đối AC, Dt đối DB; mAB = 60°, DBe = 75°, ACD = 60°
{
  const H = 100, A = P(0, 0), B = P(170, 0)
  const C = ray(A, 240, H / Math.sin(60 * Math.PI / 180))      // C ở dưới-trái A, AC nghiêng 60°
  const D = ray(B, -75, H / Math.sin(75 * Math.PI / 180))      // D ở dưới-phải B, BD nghiêng 75° so với e
  const m = ray(A, 60, 65), t = ray(D, -75, 60)
  const e0 = P(-110, 0), e1 = P(300, 0), f0 = P(-110, H), f1 = P(300, H)
  ok(goc(A, m, B), 60, 'mAB'); ok(goc(B, D, e1), 75, 'DBe'); ok(goc(C, A, D), 60, 'ACD')
  const C2 = ray(C, 240, 50), B2 = ray(B, 105, 60)   // đường AC kéo dài qua C, đường BD kéo dài qua B (như ảnh cũ)
  hinh('HHC002699', [e0, e1, f0, f1, m, t, C2, B2], [seg(e0, e1), seg(f0, f1), seg(C2, m), seg(B2, t), dot(A), dot(B), dot(C), dot(D),
    angleMark(A, m, B, 28), angleMark(B, D, e1, 28), angleMark(C, A, f1, 28),
    label(m, 'm', -16, 4), label(e1, 'e', 20, 8), label(f1, 'f', 20, 8), label(t, 't', -16, 8),
    label(A, 'A', -4, -14), label(B, 'B', 18, -10), label(C, 'C', -24, 22), label(D, 'D', -18, 24),
    angleText(A, m, B, '60°', 56), angleText(B, D, e1, '75°', 62), angleText(C, A, f1, '60°', 56)])
}

// HHC002700 — đường gấp khúc BAD giữa BC và DE; ABC = 118°, BAD = 112°, ADE = 50°
{
  const B = P(0, 0), C = P(220, 0)
  const A = ray(B, -118, 105)
  const D = ray(A, -50, 160)
  const E = P(D.x - 240, D.y)
  ok(goc(B, A, C), 118, 'ABC'); ok(goc(A, B, D), 112, 'BAD'); ok(goc(D, A, E), 50, 'ADE')
  hinh('HHC002700', [B, C, A, D, E], [seg(B, C), seg(B, A), seg(A, D), seg(D, E), dot(A), dot(B), dot(C), dot(D), dot(E),
    label(B, 'B', -4, -14), label(C, 'C', 22, 8), label(A, 'A', -22, 8), label(D, 'D', 24, 18), label(E, 'E', -22, 8),
    angleText(B, A, C, '118°', 62), angleText(A, B, D, '112°', 56), angleText(D, A, E, '50°', 78)])
}

// HHC002701 — a ∥ b ∥ c: NMa = 145°, MNb = 145°, MNP = 85°, NPc = 50°
{
  const M = P(0, 0), N = ray(M, -145, 130), P0 = ray(N, -50, 130)
  ok(goc(M, N, ray(M, 0, 100)), 145, 'NMa'); ok(goc(N, M, ray(N, 180, 100)), 145, 'MNb')
  ok(goc(N, M, P0), 85, 'MNP'); ok(goc(P0, N, ray(P0, 180, 100)), 50, 'NPc')
  const a1 = P(180, 0), b1 = P(N.x - 120, N.y), c0 = P(N.x - 120, P0.y), c1 = P(180, P0.y)
  hinh('HHC002701', [a1, b1, c0, c1, M], [seg(M, a1), seg(N, b1), seg(c0, c1), seg(M, N), seg(N, P0), dot(M), dot(N), dot(P0),
    label(M, 'M', -4, -14), label(N, 'N', -18, 30), label(P0, 'P', 4, 34),
    label(a1, 'a', 0, -12), label(b1, 'b', 0, -12), label(c0, 'c', 0, 34),
    angleText(M, N, a1, '145°', 60), angleText(N, M, b1, '145°', 60), angleText(N, M, P0, '85°', 52), angleText(P0, N, c0, '50°', 78)])
}

await xuatTat(RA)
