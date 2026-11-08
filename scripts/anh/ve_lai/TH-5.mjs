// Vẽ lại hình — gói TH-5 (câu hình học Toán 7 trong đề thi/đề cương, kho CHƯA có hình).
//   node scripts/anh/ve_lai/TH-5.mjs [<thu_muc_ra>]
// Chỉ vẽ: HHC002845, HHC002910, HHC002911, HHC002913. Các câu còn lại không vẽ (khái niệm/định lí/tiên đề).
import { P, seg, segDash, tick, angleMark, rightAngle, ray, dot, label, num, angleText, mid, lerp, foot, inter, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-5/moi'

// HHC002845 — △ABC, B = 70°, C = 40°; Cx tia đối của CB; Cy phân giác ∠ACx (không ghi ACx, xCy)
{
  const B = P(0, 0), C = P(290, 0)
  const A = inter(B, ray(B, 70, 100), C, ray(C, 140, 100))
  const x = P(C.x + 110, C.y), y = ray(C, 70, 190)               // ACx = 140° ⇒ phân giác ở 70°
  console.assert(Math.abs(goc(B, C, A) - 70) < 0.5 && Math.abs(goc(C, B, A) - 40) < 0.5)
  console.assert(Math.abs(goc(C, A, y) - goc(C, y, x)) < 0.5)
  hinh('HHC002845', [B, C, A, x, y], [
    seg(A, B), seg(B, x), seg(C, A), seg(C, y), dot(A), dot(B), dot(C),
    angleMark(B, C, A, 34), angleText(B, C, A, '70°', 62),
    angleMark(C, B, A, 30), angleText(C, B, A, '40°', 72),
    label(A, 'A', -4, -16), label(B, 'B', -14, 22), label(C, 'C', 4, 28), label(x, 'x', 2, 28), label(y, 'y', 14, -6),
  ])
}

// HHC002910 — △ABC cân tại A (AB = AC; đáy BC ngắn hơn cạnh bên)
{
  const B = P(0, 0), C = P(230, 0), A = P(115, -270)
  console.assert(Math.abs(dist(A, B) - dist(A, C)) < 0.01)
  hinh('HHC002910', [B, C, A], [
    seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    tick(A, B, 1), tick(A, C, 1),
    label(A, 'A', 0, -16), label(B, 'B', -14, 22), label(C, 'C', 14, 22),
  ])
}

// HHC002913 — △ABC vuông tại A
{
  const A = P(0, 0), B = P(270, 0), C = P(0, -195)
  hinh('HHC002913', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    rightAngle(A, B, C, 18),
    label(A, 'A', -16, 22), label(B, 'B', 14, 22), label(C, 'C', -4, -16),
  ])
}

// HHC002911 — △MNP vuông tại M (MN < MP); E ∈ NP, NE = NM; K trung điểm ME; I = NK ∩ MP;
//             EF ∥ MP, F ∈ NI; Q ∈ IP, IQ = FE.  (không đánh dấu IE ⊥ NP, các góc cần chứng minh)
{
  const M = P(0, 0), N = P(0, -210), Pp = P(345, 0)
  const dNP = dist(N, Pp), E = lerp(N, Pp, dist(N, M) / dNP)
  const K = mid(M, E)
  const I = inter(N, K, M, Pp)
  const F = inter(E, P(E.x + 100, E.y), N, I)
  const Q = lerp(I, Pp, dist(F, E) / dist(I, Pp))
  console.assert(Math.abs(dist(N, M) - dist(N, E)) < 0.01 && Math.abs(dist(I, Q) - dist(F, E)) < 0.01)
  console.assert(Q.x > I.x && Q.x < Pp.x && F.y < I.y && F.y > N.y) // Q ∈ IP, F ∈ NI
  hinh('HHC002911', [M, N, Pp, E, K, I, F, Q], [
    seg(M, N), seg(M, Pp), seg(N, Pp), seg(M, E), seg(N, I), seg(I, E), seg(E, F), seg(E, Q),
    dot(M), dot(N), dot(Pp), dot(E), dot(K), dot(I), dot(F), dot(Q),
    rightAngle(M, N, Pp, 18),
    tick(M, N, 1), tick(N, E, 1), tick(M, K, 2), tick(K, E, 2), tick(F, E, 3), tick(I, Q, 3),
    label(M, 'M', -16, 22), label(N, 'N', -16, -8), label(Pp, 'P', 16, 22), label(E, 'E', 18, -12),
    label(K, 'K', -26, 0), label(I, 'I', 0, 32), label(F, 'F', -20, 8), label(Q, 'Q', 4, 32),
  ])
}

await xuatTat(RA)
