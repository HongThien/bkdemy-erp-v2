// Vẽ lại hình — gói BT-MH046-1 (MH.046 Ba đường thẳng song song · Luyện · bài toán 02–09).
//   node scripts/anh/ve_lai/BT-MH046-1.mjs [<thu_muc_ra>]
// Mọi số đo dựng bằng ray/rot; hình "gãy khúc" Ax ∥ Cy dựng đúng bằng số đo cho trên hình (cát tuyến AB, BC).
import { P, seg, angleMark, sector, ray, dot, label, angleText, rightAngle, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH046-1/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, ten + ' lệch: ' + v + ' ≠ ' + e)
const R = (p, dx, dy) => P(p.x + dx, p.y + dy)

// Ô vuông góc tô xám (ảnh cũ 04 tô)
function rightAngleFill(v, p, q, s = 14) {
  const u1 = P(p.x - v.x, p.y - v.y), u2 = P(q.x - v.x, q.y - v.y)
  const l1 = Math.hypot(u1.x, u1.y), l2 = Math.hypot(u2.x, u2.y)
  const a = P(v.x + u1.x / l1 * s, v.y + u1.y / l1 * s), b = P(v.x + u2.x / l2 * s, v.y + u2.y / l2 * s)
  const c = P(a.x + u2.x / l2 * s, a.y + u2.y / l2 * s)
  return `<path d="M ${v.x} ${v.y} L ${a.x} ${a.y} L ${c.x} ${c.y} L ${b.x} ${b.y} Z" fill="#d9dde3" stroke="none"/>`
}

// ───────── 02 — Ax ∥ Cy: xAB = 45°, ABC = 85°, yCB = 40° (Ax, Cy hướng sang phải) ─────────
{
  const A = P(0, 0), B = ray(A, -45, 200)
  const C = P(B.x - 210 * Math.cos(40 * Math.PI / 180), B.y + 210 * Math.sin(40 * Math.PI / 180))
  const X = P(300, 0), Y = P(300, C.y)
  ok(goc(A, X, B), 45, '02 xAB'); ok(goc(C, Y, B), 40, '02 yCB'); ok(goc(B, A, C), 85, '02 ABC')
  hinh('BT.07.046.02', [A, B, C, X, Y], [
    sector(B, A, C, 44), seg(A, X), seg(C, Y), seg(A, B), seg(B, C), angleMark(B, A, C, 44),
    dot(A), dot(B), dot(C),
    angleText(A, X, B, '45°', 80), angleText(B, A, C, '85°', 84), angleText(C, Y, B, '40°', 90),
    label(A, 'A', -24, -6), label(B, 'B', 26, 9), label(C, 'C', -16, 36), label(X, 'x', 0, -12), label(Y, 'y', 0, 34)])
}

// ───────── 03 — Ax ∥ Cy: xAB = 35°, ABC = 80°, BCy = 135° (Ax hướng sang trái, Cy sang phải) ─────────
{
  const A = P(0, 0), B = ray(A, 215, 220), C = ray(B, -45, 200)
  const X = P(-240, 0), Y = P(C.x + 170, C.y)
  ok(goc(A, X, B), 35, '03 xAB'); ok(goc(B, A, C), 80, '03 ABC'); ok(goc(C, B, Y), 135, '03 BCy')
  hinh('BT.07.046.03', [A, B, C, X, Y], [
    seg(A, X), seg(C, Y), seg(A, B), seg(B, C), angleMark(B, A, C, 44), angleMark(C, B, Y, 40),
    dot(A), dot(B), dot(C),
    angleText(A, X, B, '35°', 110), angleText(B, A, C, '80°', 80), angleText(C, B, Y, '135°', 78),
    label(A, 'A', 28, 0), label(B, 'B', -26, 10), label(C, 'C', -8, 36), label(X, 'x', 0, -12), label(Y, 'y', 0, -12)])
}

// ───────── 04 / 11-chung — BD ⊥ DE, CE ⊥ DE: ABD = 160°, ACE = 130° (đề hỏi BAC) ─────────
// dựng A: BA hợp tia BD góc 160°, CA hợp tia CE góc 130°; C ngay dưới B (như ảnh cũ)
function dungBDE() {
  const H = 200, B = P(0, 0), C = P(0, H)
  const A = ray(B, 200, 137)
  const A2 = ray(C, 130, 200)
  console.assert(Math.hypot(A.x - A2.x, A.y - A2.y) < 0.6, 'A không khớp: ' + JSON.stringify([A, A2]))
  const D = P(220, 0), E = P(220, H)
  return { A, B, C, D, E, Dt: P(220, -40), Et: P(220, H + 40), Bx: P(262, 0), Cx: P(262, H) }
}
{
  const { A, B, C, D, E, Dt, Et, Bx, Cx } = dungBDE()
  ok(goc(B, A, D), 160, '04 ABD'); ok(goc(C, A, E), 130, '04 ACE'); ok(goc(A, B, C), 70, '04 BAC (đáp án)')
  hinh('BT.07.046.04', [A, B, C, D, E, Dt, Et, Bx, Cx], [
    rightAngleFill(D, B, Dt), rightAngleFill(E, C, D),
    seg(B, Bx), seg(C, Cx), seg(Dt, Et), seg(A, B), seg(A, C),
    rightAngle(D, B, Dt), rightAngle(E, C, D),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    angleText(B, A, D, '160°', 44), angleText(C, A, E, '130°', 50),
    label(A, 'A', -26, 6), label(B, 'B', 0, -16), label(C, 'C', 0, 38), label(D, 'D', 22, 34), label(E, 'E', 22, 34)],
  { pad: 44, padDuoi: 50 })
}

// ───────── 05 — AM ⊥ MN, CN ⊥ MN: BAM = 22°, BCN = 32° (đề hỏi ABC) ─────────
// dựng chung cho 05 và 12 (bài 12 ở gói BT-MH046-2 dùng cùng cách dựng)
function dungAMNC() {
  const A = P(0, 0), B = ray(A, -22, 215)
  const C = P(B.x - 255 * Math.cos(32 * Math.PI / 180), B.y + 255 * Math.sin(32 * Math.PI / 180))
  const M = P(300, 0), N = P(300, C.y)
  return { A, B, C, M, N, Mt: P(300, -40), Nb: P(300, C.y + 40), X: P(342, 0), Y: P(342, C.y) }
}
{
  const { A, B, C, M, N, Mt, Nb, X, Y } = dungAMNC()
  ok(goc(A, M, B), 22, '05 BAM'); ok(goc(C, N, B), 32, '05 BCN'); ok(goc(B, A, C), 54, '05 ABC (đáp án)')
  hinh('BT.07.046.05', [A, B, C, M, N, Mt, Nb, X, Y], [
    seg(A, X), seg(C, Y), seg(Mt, Nb), seg(A, B), seg(B, C),
    angleMark(A, M, B, 50, 1), angleMark(C, N, B, 50, 2),
    rightAngle(M, A, Mt), rightAngle(N, C, M),
    dot(A), dot(B), dot(C), dot(M), dot(N),
    angleText(A, M, B, '22°', 108), angleText(C, N, B, '32°', 108),
    label(A, 'A', -26, 4), label(B, 'B', 26, 9), label(C, 'C', -10, 38), label(M, 'M', 24, 34), label(N, 'N', 24, 34)],
  { pad: 40, padDuoi: 48 })
}

// ───────── 06 / 09 — a ∥ b: aMN = 100°, NPb = 120° (và MNP = 40° ở bài 09) ─────────
function dungMNP() {
  const M = P(0, 0), N = ray(M, 80, 290), P1 = ray(N, -60, 168)
  return { M, N, Pp: P1, a: P(-150, 0), b: P(P1.x + 130, P1.y) }
}
{
  const { M, N, Pp, a, b } = dungMNP()
  ok(goc(M, a, N), 100, '06 aMN'); ok(goc(Pp, N, b), 120, '06 NPb'); ok(goc(N, M, Pp), 40, '06 MNP (đáp án)')
  hinh('BT.07.046.06', [M, N, Pp, a, b], [
    seg(a, M), seg(M, N), seg(N, Pp), seg(Pp, b),
    dot(M), dot(N), dot(Pp),
    angleText(M, a, N, '100°', 72), angleText(Pp, N, b, '120°', 72),
    label(M, 'M', -6, 38), label(N, 'N', 0, -16), label(Pp, 'P', 0, 38), label(a, 'a', 0, -14), label(b, 'b', 0, -14)])
  // 09 — thêm cung + số 40° ở N, cung ở M và P
  hinh('BT.07.046.09', [M, N, Pp, a, b], [
    seg(a, M), seg(M, N), seg(N, Pp), seg(Pp, b),
    angleMark(M, a, N, 36), angleMark(N, M, Pp, 46), angleMark(Pp, N, b, 36),
    dot(M), dot(N), dot(Pp),
    angleText(M, a, N, '100°', 84), angleText(N, M, Pp, '40°', 106), angleText(Pp, N, b, '120°', 84),
    label(M, 'M', -6, 38), label(N, 'N', 0, -16), label(Pp, 'P', 0, 38), label(a, 'a', 0, -14), label(b, 'b', 0, -14)])
}

// ───────── 07 — Ax ∥ Cy: xAB = 35°, BCy = 135° (đề hỏi ABC; ảnh cũ không có cung) ─────────
{
  const A = P(0, 0), B = ray(A, 215, 240), C = ray(B, -45, 200)
  const X = P(-250, 0), Y = P(C.x + 170, C.y)
  ok(goc(A, X, B), 35, '07 xAB'); ok(goc(C, B, Y), 135, '07 BCy'); ok(goc(B, A, C), 80, '07 ABC (đáp án)')
  hinh('BT.07.046.07', [A, B, C, X, Y], [
    seg(A, X), seg(C, Y), seg(A, B), seg(B, C),
    dot(A), dot(B), dot(C),
    angleText(A, X, B, '35°', 112), angleText(C, B, Y, '135°', 78),
    label(A, 'A', 28, 0), label(B, 'B', -26, 10), label(C, 'C', -8, 36), label(X, 'x', 0, -12), label(Y, 'y', 0, -12)])
}

// ───────── 08 — Ax ∥ Cy: xAB = 40°, ABC = 60° (đề hỏi BCy; ảnh cũ có cung đôi ở C, không ghi số) ─────────
{
  const A = P(0, 0), B = ray(A, -40, 280)
  const C = P(B.x - 270 * Math.cos(20 * Math.PI / 180), B.y + 270 * Math.sin(20 * Math.PI / 180)) // BCy = 20° (giải ra từ đề)
  const X = P(320, 0), Y = P(320, C.y)
  ok(goc(A, X, B), 40, '08 xAB'); ok(goc(B, A, C), 60, '08 ABC'); ok(goc(C, Y, B), 20, '08 BCy (đáp án)')
  hinh('BT.07.046.08', [A, B, C, X, Y], [
    seg(A, X), seg(C, Y), seg(A, B), seg(B, C), angleMark(C, Y, B, 70, 2),
    dot(A), dot(B), dot(C),
    angleText(A, X, B, '40°', 100), angleText(B, A, C, '60°', 86),
    label(A, 'A', -26, -4), label(B, 'B', 26, 9), label(C, 'C', -10, 38), label(X, 'x', 0, -12), label(Y, 'y', 0, 36)])
}

await xuatTat(RA)
