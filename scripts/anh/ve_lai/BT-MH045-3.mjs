// Vẽ lại hình — gói BT-MH045-3 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH045-3.mjs [<thu_muc_ra>]
import { P, seg, angleMark, ray, rot, lerp, goc, dot, label, num, angleText, rightAngle, bisector, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH045-3/moi'

// ───── BT.07.045.17 / .18 / .19 — a ∥ b (cùng vuông góc GK), cát tuyến DH qua H ∈ a, E ∈ b; HEF = 120° ─────
// Ảnh cũ ghi mức "Cho hình vẽ" (không ghi 120° trên hình). Đề cho HEF = 120° ⇒ cát tuyến nghiêng đúng 60° so với b.
function hinhHEF(ten, { phanGiac = false } = {}) {
  const S = 105
  const G = P(0, 0), K = P(0, S)
  const H = P(103, 0)
  const E = P(H.x + S / Math.tan(Math.PI / 3), S)      // đường HE nghiêng 60° ⇒ HEF = 120°
  const I = P(227, 0), F = P(263, S)
  const D = ray(E, -60, 80)                            // D trên tia HE, phía dưới E
  const top = ray(H, 120, 75), bot = ray(D, -60, 40)   // đầu mút đường thẳng DH
  const a0 = P(-68, 0), a1 = P(283, 0), b0 = P(-68, S), b1 = P(283, S)
  const v0 = P(0, -70), v1 = P(0, S + 75)
  console.assert(Math.abs(goc(E, H, F) - 120) < 0.01, ten + ' HEF')
  const pts = [a0, a1, b0, b1, v0, v1, top, bot]
  const body = [
    seg(a0, a1), seg(b0, b1), seg(v0, v1), seg(top, bot),
    rightAngle(G, P(60, 0), K, 14), rightAngle(K, P(0, 0), P(60, S), 14),
    dot(G), dot(K), dot(H), dot(I), dot(E), dot(F), dot(D),
    label(a0, 'a', 14, -12), label(b0, 'b', 14, -12), label(a1, 'l', -2, -12),
    label(G, 'G', -20, -10), label(H, 'H', 16, -12), label(I, 'I', 0, -14),
    label(K, 'K', -20, -10), label(E, 'E', -18, 30), label(F, 'F', 8, 30), label(D, 'D', -20, 22),
  ]
  if (phanGiac) {
    // Hx phân giác GHE (= 120°) ⇒ 60° mỗi nửa; Ey phân giác HEF (= 120°) ⇒ 60° mỗi nửa
    const x = ray(H, 240, 85), y = ray(E, 60, 85)
    console.assert(Math.abs(goc(H, G, x) - 60) < 0.01 && Math.abs(goc(H, x, E) - 60) < 0.01, ten + ' Hx')
    console.assert(Math.abs(goc(E, H, y) - 60) < 0.01 && Math.abs(goc(E, y, F) - 60) < 0.01, ten + ' Ey')
    pts.push(x, y)
    body.push(seg(H, x), seg(E, y), label(x, 'x', -14, 12), label(y, 'y', 16, -4))
  }
  hinh(ten, pts, body)
}
hinhHEF('BT.07.045.17')
hinhHEF('BT.07.045.18')
hinhHEF('BT.07.045.19', { phanGiac: true })

// ───── BT.07.045.20 / .21 — mn ∥ xy, đường cdc cắt mn tại A, xy tại B; ABy = 60° (ghi 60°, không cung) ─────
function hinhABy(ten, { phanGiac = false } = {}) {
  const S = 125
  const A = P(0, 0), B = P(-S / Math.tan(Math.PI / 3), S)    // AB nghiêng 60° so với xy
  const m = P(-200, 0), n = P(115, 0), x = P(-220, S), y = P(125, S)
  const d = ray(A, 60, 75), c = ray(B, 240, 85)
  const yB = P(B.x + 60, S), aB = ray(B, 60, 60)
  console.assert(Math.abs(goc(B, A, yB) - 60) < 0.01, ten + ' ABy')
  const pts = [m, n, x, y, d, c]
  const body = [
    seg(m, n), seg(x, y), seg(c, d), dot(A), dot(B),
  ]
  body.push(angleText(B, yB, aB, '60°', 54))
  body.push(label(m, 'm', -22, 8), label(n, 'n', 24, 8), label(x, 'x', -22, 8), label(y, 'y', 24, 8),
    label(A, 'A', -20, -12), label(B, 'B', -18, -12), label(d, 'd', 18, -4), label(c, 'c', -2, 32))
  if (phanGiac) {
    // At phân giác nAB (= 120°) ⇒ tAB = 60°; Bz phân giác cBy (= 120°) ⇒ zBy = 60°
    const nA = P(60, 0), t = ray(A, -60, 85), z = ray(B, -60, 85)
    console.assert(Math.abs(goc(A, nA, B) - 120) < 0.01, ten + ' nAB')
    console.assert(Math.abs(goc(A, t, B) - 60) < 0.01 && Math.abs(goc(A, nA, t) - 60) < 0.01, ten + ' At')
    console.assert(Math.abs(goc(B, c, yB) - 120) < 0.01, ten + ' cBy')
    console.assert(Math.abs(goc(B, z, yB) - 60) < 0.01, ten + ' Bz')
    pts.push(t, z)
    body.push(seg(A, t), seg(B, z), label(t, 't', 14, 14), label(z, 'z', 14, 14))
  }
  hinh(ten, pts, body)
}
hinhABy('BT.07.045.20')
hinhABy('BT.07.045.21', { phanGiac: true })

// ───── BT.07.045.22 — mn ⊥ cd tại C; ab ∥ cd; xy cắt ab tại A, cd tại B; xBc = 45°, aAy = 135° ─────
{
  const S = 125
  const G = P(0, 0), C = P(0, S)                          // G = giao mn–ab (ảnh cũ có chấm, chưa đặt tên)
  const A = P(160, 0), B = P(160 + S, S)                  // xy nghiêng 45° so với ab, cd
  const a0 = P(-72, 0), a1 = P(345, 0), c0 = P(-72, S), c1 = P(345, S)
  const m = P(0, -75), n = P(0, S + 75)
  const x = ray(A, 135, 100), y = ray(B, -45, 84)
  console.assert(Math.abs(goc(B, x, P(0, S)) - 45) < 0.01, 'xBc')
  console.assert(Math.abs(goc(A, a0, y) - 135) < 0.01, 'aAy')
  hinh('BT.07.045.22', [a0, a1, c0, c1, m, n, x, y], [
    seg(a0, a1), seg(c0, c1), seg(m, n), seg(x, y),
    rightAngle(C, m, c1, 14),
    dot(G), dot(A), dot(B), dot(C),
    angleText(A, a0, y, '135°', 56),
    angleText(B, x, c0, '45°', 66),
    label(a0, 'a', 8, -12), label(a1, 'b', -6, -12), label(c0, 'c', 8, -12), label(c1, 'd', -6, -12),
    label(m, 'm', 20, 8), label(n, 'n', 20, 6),
    label(A, 'A', 18, -12), label(B, 'B', 18, -12), label(C, 'C', -20, -10),
    label(x, 'x', 14, -6), label(y, 'y', -14, 16),
  ])
}

// ───── BT.07.045.25 — a ∥ b cùng vuông góc c; cát tuyến qua A ∈ a, B ∈ b, góc B1 = 75°; góc đánh số 1-2-3-4 tại A và B ─────
{
  const S = 125
  const A = P(0, 0), B = P(-S / Math.tan(75 * Math.PI / 180), S)
  const a0 = P(-120, 0), a1 = P(270, 0), b0 = P(-120, S), b1 = P(270, S)
  const up = ray(A, 75, 70), down = ray(B, 255, 70)
  const cx = 150, c0 = P(cx, -75), c1 = P(cx, S + 75)
  const Ac = P(cx, 0), Bc = P(cx, S)
  console.assert(Math.abs(goc(B, A, P(B.x + 50, S)) - 75) < 0.01, 'B1')
  // bốn góc quanh O (tia: u = lên theo cát tuyến, r = phải, l = trái, d = xuống)
  const bonGoc = (O, r = 36) => {
    const u = ray(O, 75, 60), rr = ray(O, 0, 60), l = ray(O, 180, 60), d = ray(O, 255, 60)
    return [angleText(O, u, rr, '1', r, 20), angleText(O, u, l, '2', r, 20), angleText(O, l, d, '3', r, 20), angleText(O, d, rr, '4', r, 20)]
  }
  const uB = ray(B, 75, 60), rB = ray(B, 0, 60)
  hinh('BT.07.045.25', [a0, a1, b0, b1, up, down, c0, c1], [
    seg(a0, a1), seg(b0, b1), seg(up, down), seg(c0, c1),
    rightAngle(Ac, P(cx, S / 2), P(cx - 60, 0), 14), rightAngle(Bc, P(cx, S + 60), P(cx - 60, S), 14),
    angleMark(B, uB, rB, 52),
    dot(A), dot(B),
    ...bonGoc(A, 34), ...bonGoc(B, 34),
    angleText(B, uB, rB, '75°', 84),
    label(A, 'A', -46, -30), label(B, 'B', 8, 60),
    label(a1, 'a', -6, -12), label(b1, 'b', -6, -12), label(c0, 'c', 16, 8),
  ])
}

// ───── Hình chung của BT.07.045.26 / .27 / .28 (cùng một ảnh cũ) ─────
// a ∥ b; c cắt a tại A, b tại C (ACD = 80°); d cắt a tại B, b tại D (EBD = BDC = 50°); AF ∥ BD (F ∈ b).
// Ảnh cũ có sẵn AF, F (điểm của bài 28) nên giữ cho cả ba bài.
function hinhChung(ten) {
  const S = 120, t50 = Math.tan(50 * Math.PI / 180), t80 = Math.tan(80 * Math.PI / 180)
  const A = P(0, 0), C = P(-S / t80, S)
  const B = P(185, 0), D = P(185 + S / t50, S)
  const E = P(275, 0), F = P(S / t50, S)
  const a0 = P(-80, 0), a1 = P(330, 0), b0 = P(-80, S), b1 = P(330, S)
  const cT = ray(A, 80, 80), cB = ray(C, 260, 40)
  const dT = ray(B, 130, 80), dB = ray(D, -50, 46)
  const fB = ray(F, -50, 47)
  console.assert(Math.abs(goc(C, A, P(C.x + 50, S)) - 80) < 0.01, ten + ' ACD')
  console.assert(Math.abs(goc(B, E, D) - 50) < 0.01, ten + ' EBD')
  console.assert(Math.abs(goc(D, B, P(D.x - 50, S)) - 50) < 0.01, ten + ' BDC')
  console.assert(Math.abs(goc(A, B, C) - 100) < 0.01 && Math.abs(goc(A, F, C) - 50) < 0.01, ten + ' BAC/FAC')
  const rC = P(C.x + 60, S), rB = P(B.x + 60, 0), lD = P(D.x - 60, S)
  hinh(ten, [a0, a1, b0, b1, cT, cB, dT, dB, fB], [
    seg(a0, a1), seg(b0, b1), seg(cB, cT), seg(dT, dB), seg(A, fB),
    angleMark(C, A, rC, 32), angleMark(B, rB, D, 32), angleMark(D, lD, B, 32),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    angleText(C, A, rC, '80°', 66),
    angleText(B, rB, D, '50°', 66),
    angleText(D, lD, B, '50°', 66),
    label(a0, 'a', 0, -12), label(b0, 'b', 0, -12), label(cT, 'c', -20, 4),
    label(dT, 'd', 18, 6),
    label(A, 'A', 18, -12), label(B, 'B', 4, -14), label(E, 'E', 0, -14),
    label(C, 'C', -18, -10), label(D, 'D', 16, -12), label(F, 'F', -14, 30),
  ])
}

hinhChung('BT.07.045.26')

await xuatTat(RA)
