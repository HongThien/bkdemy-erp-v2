// Vẽ lại hình — gói BT-MH045-2 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH045-2.mjs [<thu_muc_ra>]
// Ba nhóm hình, mỗi nhóm CHUNG một hàm dựng (ảnh cũ của các bài cùng nhóm là một ảnh):
//   09           : xx′ ∥ yy′ ∥ tt′, đường n ⊥ qua A, H, K, cát tuyến zz′ qua A, B, C (xAC = 50°)
//   10 – 13      : a, b, c song song, d ⊥ (A, B, F), cát tuyến e qua C, D, E (70° tại C, 110° tại E); bài 13 thêm điểm I
//   14 – 16      : DA ∥ BC, DAB = 30°, AEF = 30° (EF ∥ BC), ACB = 60°
import { P, seg, angleMark, ray, dot, label, num, angleText, rightAngle, goc, inter, lerp, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH045-2/moi'

// ───────────────── 09 ─────────────────
{
  const A = P(0, 0), H = P(0, 80), K = P(0, 175)
  const X0 = -235, X1 = 112
  const zDown = ray(A, 230, 330)              // tia Az′ : xAC = 50° ⇒ AC hợp tia Ax (hướng trái) góc 50°
  const C = inter(A, zDown, K, P(1, 175)), B = inter(A, zDown, H, P(1, 80))
  const zEnd = ray(A, 50, 78)                 // tia Az (phía đối)
  const zDownEnd = ray(A, 230, 294)   // kéo qua tt′ một đoạn
  const nTop = P(0, -58), nBot = P(0, 228)
  console.assert(Math.abs(goc(A, P(-100, 0), C) - 50) < 0.01, '09 xAC')
  console.assert(Math.abs(goc(H, A, P(100, 80)) - 90) < 0.01, '09 AHy′')
  console.assert(Math.abs(goc(K, A, P(100, 175)) - 90) < 0.01, '09 AKt′')
  hinh('BT.07.045.09', [P(X0, 0), P(X1, 175), zEnd, zDownEnd, nTop, nBot], [
    seg(P(X0, 0), P(X1, 0)), seg(P(X0, 80), P(X1, 80)), seg(P(X0, 175), P(X1, 175)),
    seg(nTop, nBot), seg(zEnd, zDownEnd),
    angleMark(A, P(-100, 0), C, 34),
    rightAngle(H, A, P(100, 80), 14), rightAngle(K, H, P(100, 175), 14),
    dot(A), dot(B), dot(C), dot(H), dot(K),
    angleText(A, P(-100, 0), C, '50°', 78),
    label(P(X0 + 14, 0), 'x', 0, -10), label(P(X1 - 10, 0), 'x′', 0, -10),
    label(P(X0 + 14, 80), 'y', 0, 30), label(P(X1 - 10, 80), 'y′', 0, 30),
    label(P(X0 + 14, 175), 't', 0, 30), label(P(X1 - 10, 175), 't′', 0, 30),
    label(A, 'A', -22, -10), label(B, 'B', 4, 30), label(C, 'C', 4, 30),
    label(H, 'H', 20, 30), label(K, 'K', 20, 30),
    label(zEnd, 'z', 16, -2), label(zDownEnd, 'z′', 2, 30),
  ])
}

// ───────────────── 10 – 13 ─────────────────
// a, b, c nằm ngang cách nhau 85 và 90; d thẳng đứng qua A, B, F; e hợp tia sang trái của a góc 70° (hướng lên-phải 70°).
function nhom2(ten, { co_I = false } = {}) {
  const yA = 0, yB = 85, yC = 175
  const E = P(176, yC)
  const eTop = ray(E, 70, (yC + 45) / Math.sin(70 * Math.PI / 180))
  const eBot = ray(E, 250, 58)
  const C = inter(E, eTop, P(0, yA), P(1, yA)), D = inter(E, eTop, P(0, yB), P(1, yB))
  const A = P(0, yA), B = P(0, yB), F = P(0, yC)
  const X0 = -50, X1 = 312
  const dTop = P(0, -45), dBot = P(0, yC + 45)
  const cL = P(C.x - 100, C.y), eL = P(E.x - 100, E.y), dL = P(D.x - 100, D.y)
  console.assert(Math.abs(goc(C, cL, D) - 70) < 0.01, ten + ' 70°')
  console.assert(Math.abs(goc(E, eL, D) - 110) < 0.01, ten + ' 110°')
  console.assert(Math.abs(goc(D, dL, C) - 110) < 0.01 && Math.abs(goc(D, C, P(D.x + 100, D.y)) - 70) < 0.01, ten + ' D1 D2')
  let I = null, extra = []
  if (co_I) {
    // I = giao phân giác góc BDE (từ D, hướng 215°) và phân giác góc DEF (từ E, hướng 125°)
    I = inter(D, ray(D, 215, 100), E, ray(E, 125, 100))
    console.assert(Math.abs(goc(I, D, E) - 90) < 0.01, ten + ' DIE')
    extra = [seg(D, I), seg(E, I), dot(I), label(I, 'I', -16, -8)]
  }
  hinh(ten, [P(X0, yA), P(X1, yC), dTop, dBot, eTop, eBot], [
    seg(P(X0, yA), P(X1, yA)), seg(P(X0, yB), P(X1, yB)), seg(P(X0, yC), P(X1, yC)),
    seg(dTop, dBot), seg(eBot, eTop),
    angleMark(C, cL, D, 34),
    angleMark(E, eL, D, 28, 2),
    rightAngle(A, dTop, P(1, yA), 14), rightAngle(B, A, P(1, yB), 14),
    dot(A), dot(B), dot(F), dot(C), dot(D), dot(E), ...extra,
    angleText(C, cL, D, '70°', 58),
    num(P(E.x - 62, E.y - 14), '110°', 0, 8, 22),
    num(P(D.x - 22, D.y - 9), '1', 0, 0, 20), num(P(D.x + 22, D.y - 9), '2', 0, 0, 20),
    label(A, 'A', -20, 30), label(B, 'B', -20, 30), label(F, 'F', -20, 30),
    label(C, 'C', 20, 30), label(D, 'D', 20, 30), label(E, 'E', 20, 30),
    label(dTop, 'd', 16, 4), label(eTop, 'e', 16, 6),
    label(P(X1 - 12, yA), 'a', 0, -10), label(P(X1 - 12, yB), 'b', 0, -10), label(P(X1 - 12, yC), 'c', 0, -10),
  ])
}
nhom2('BT.07.045.10')
nhom2('BT.07.045.11')
nhom2('BT.07.045.12')
nhom2('BT.07.045.13', { co_I: true })

// ───────────────── 14 – 16 ─────────────────
// BC nằm ngang (dài 340), DAB = 30° ⇒ AB dốc 30°, ACB = 60° ⇒ AC dốc 60° (A là đỉnh vuông của tam giác ABC, đúng theo số đo đề).
function nhom3(ten) {
  const B = P(0, 0), Cc = P(340, 0)
  const A = inter(B, ray(B, 30, 100), Cc, ray(Cc, 120, 100))
  const D = P(56, A.y)
  const E = lerp(B, A, 0.39)
  const F = inter(E, P(E.x + 100, E.y), A, Cc)
  console.assert(Math.abs(goc(A, D, B) - 30) < 0.01, ten + ' DAB')
  console.assert(Math.abs(goc(E, A, F) - 30) < 0.01, ten + ' AEF')
  console.assert(Math.abs(goc(Cc, A, B) - 60) < 0.01, ten + ' ACB')
  hinh(ten, [D, A, B, Cc], [
    seg(D, A), seg(A, Cc), seg(Cc, B), seg(B, D), seg(A, B), seg(E, F),
    angleMark(A, D, B, 40), angleMark(E, A, F, 40), angleMark(Cc, A, B, 40),
    dot(D), dot(A), dot(B), dot(Cc), dot(E), dot(F),
    angleText(A, D, B, '30°', 78), angleText(E, A, F, '30°', 95), angleText(Cc, A, B, '60°', 80),
    label(D, 'D', -6, -14), label(A, 'A', 6, -14), label(B, 'B', -6, 32), label(Cc, 'C', 8, 32),
    label(E, 'E', -20, 4), label(F, 'F', 20, 6),
  ])
}
nhom3('BT.07.045.14')
nhom3('BT.07.045.15')
nhom3('BT.07.045.16')

await xuatTat(RA)
