// Vẽ lại hình — gói HH00058-2 (Tứ giác, Hình học 8).
//   node scripts/anh/ve_lai/HH00058-2.mjs [<thu_muc_ra>]
// Ghi chú: HHC000587 — đề dùng tên R, S, T (L ở hình lời giải); ảnh cũ dùng E, F, I, K và vênh với lời giải (xem báo cáo).
import { P, seg, angleMark, sector, tick, dot, label, num, bien, angleText, labelOut, hinh, xuatTat,
  ray, lerp, inter, bisector, goc, dist, trongTam, circle } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00058-2/moi'
const ok = (c, m) => console.assert(c, m)
const gan = (a, b, d = 0.5) => Math.abs(a - b) < d

// ── HHC000595 — tứ giác MNPQ: Q = 100°, N = 60°, góc ngoài tại P (giữa PN và tia kéo dài của QP) = 60°. M = ? (= 80°).
{
  const Q = P(0, 0)
  const Pp = P(250, 0)
  const M = ray(Q, 100, 165)                       // ∠MQP = 100°
  const hN = Q.y - M.y                              // MN ∥ QP (vì ∠N = ∠ngoài P = 60°), N cách QP một đoạn hN
  const N = ray(Pp, 60, hN / Math.sin(60 * Math.PI / 180))
  const X = P(Pp.x + 120, 0)                        // đầu tia kéo dài QP về phía P
  ok(gan(N.y, M.y, 0.01), 'MN nằm ngang')
  ok(gan(goc(Q, M, Pp), 100), '∠Q = 100°')
  ok(gan(goc(N, M, Pp), 60), '∠N = 60°')
  ok(gan(goc(Pp, N, X), 60), 'góc ngoài tại P = 60°')
  ok(gan(goc(M, Q, N), 80), '∠M = 80° (đáp số)')
  const r = 68
  hinh('HHC000595', [M, N, Pp, Q, X], [
    seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M), seg(Pp, X),
    angleMark(M, N, Q, 44), angleMark(N, M, Pp, r), angleMark(Pp, N, X, r), angleMark(Q, M, Pp, r),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', -4, -14), label(N, 'N', 6, -14), label(Pp, 'P', 0, 32), label(Q, 'Q', -6, 32),
    angleText(M, N, Q, '?', 28),
    angleText(N, M, Pp, '60°', 46),
    angleText(Pp, N, X, '60°', 46),
    angleText(Q, M, Pp, '100°', 36),
  ])
}

// ── HHC000596 — tứ giác ABCD: A = 120°, B = C = D (= 80°, hai cung mỗi góc). Ẩn: B, C, D.
{
  const A = P(0, 0), B = P(300, 0)
  const D = ray(A, 240, 180)                        // ∠A = 120°
  const C = inter(B, ray(B, 260, 100), D, ray(D, 340, 100))   // ∠B = 80° (BC hướng 260°), ∠D = 80° (DC hướng 340°)
  ok(gan(goc(A, B, D), 120), '∠A = 120°')
  ok(gan(goc(B, A, C), 80), '∠B = 80°')
  ok(gan(goc(D, A, C), 80), '∠D = 80°')
  ok(gan(goc(C, B, D), 80), '∠C = 80°')
  const ctr = trongTam([A, B, C, D])
  hinh('HHC000596', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(B, A, C, 30, 2), angleMark(C, B, D, 30, 2), angleMark(D, A, C, 30, 2),
    dot(A), dot(B), dot(C), dot(D),
    angleText(A, B, D, '120°', 66),
    angleText(B, A, C, '?', 62), angleText(C, B, D, '?', 62), angleText(D, A, C, '?', 62),
    labelOut(A, 'A', ctr, 24), labelOut(B, 'B', ctr, 24), labelOut(C, 'C', ctr, 24), labelOut(D, 'D', ctr, 24),
  ])
}

// ── HHC000586 — tứ giác ABCD nội tiếp (A + C = 180°). E = AD ∩ BC, F = AB ∩ DC. IF, IE = phân giác ∠BFC, ∠CED.
//    Dùng chung toạ độ nền cho _de và _lg; _lg thêm K = FI ∩ BC (đường FI kéo dài tới K).
function dung586() {
  const O = P(0, 0), R = 110
  const B = ray(O, 195, R), C = ray(O, 345, R), D = ray(O, 33, R), A = ray(O, 99, R)
  const F = inter(B, A, C, D), E = inter(A, D, B, C)
  const I = inter(F, bisector(F, B, C, 100), E, bisector(E, C, D, 100))
  const K = inter(F, I, B, C)
  // kiểm: A + C = 180°, thứ tự điểm, IE ⊥ IF (kết luận — chỉ dùng để tự kiểm, không vẽ ra)
  const gA = goc(A, B, D), gC = goc(C, B, D)
  ok(gan(gA + gC, 180), 'A + C = 180°')
  ok(gan(goc(F, B, I), goc(F, I, C)), 'FI phân giác ∠BFC')
  ok(gan(goc(E, C, I), goc(E, I, D)), 'EI phân giác ∠CED')
  ok(gan(goc(I, E, F), 90), 'IE ⊥ IF (hệ quả)')
  ok(F.y < A.y && F.y < D.y && E.x > C.x, 'F ở trên, E ở bên phải C')
  return { A, B, C, D, E, F, I, K }
}
{
  const { A, B, C, D, E, F, I } = dung586()
  const ctr = trongTam([A, B, C, D])
  const dem = (extra) => [
    sector(F, B, C, 46), sector(E, C, D, 50),
    seg(F, B), seg(F, C), seg(B, E), seg(A, E), seg(F, I), seg(I, E),
    angleMark(F, B, C, 46, 1), angleMark(E, C, D, 50, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    labelOut(A, 'A', ctr, 24), labelOut(B, 'B', ctr, 24), labelOut(C, 'C', ctr, 24),
    labelOut(D, 'D', ctr, 24), label(E, 'E', 22, 10), label(F, 'F', 0, -14), label(I, 'I', 16, -6),
    ...extra,
  ]
  hinh('HHC000586_de', [A, B, C, D, E, F, I], dem([]))
}
{
  const { A, B, C, D, E, F, I, K } = dung586()
  const ctr = trongTam([A, B, C, D])
  hinh('HHC000586_lg', [A, B, C, D, E, F, I, K], [
    sector(F, B, C, 46), sector(E, C, D, 50),
    seg(F, B), seg(F, C), seg(B, E), seg(A, E), seg(F, K), seg(I, E),
    angleMark(F, B, C, 46, 1), angleMark(E, C, D, 50, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I), dot(K),
    labelOut(A, 'A', ctr, 24), labelOut(B, 'B', ctr, 24), labelOut(C, 'C', ctr, 24),
    labelOut(D, 'D', ctr, 24), label(E, 'E', 22, 10), label(F, 'F', 0, -14), label(I, 'I', 16, -6),
    label(K, 'K', 0, 32),
  ])
}

// ── HHC000587 — tứ giác MNPQ; R = MQ ∩ NP, S = MN ∩ QP; T = giao hai phân giác ∠NSP, ∠NRM; (lời giải) L = ST ∩ NP.
//    Bố cục theo lời giải: S ở đỉnh trên, N–P–R nằm trên đường đáy (N trái dưới, R ngoài cùng bên phải).
function dung587() {
  const k = 0.74
  const pt = (x, y) => P(x * k, y * k)
  const N = pt(58, 434), Pp = pt(321, 434), R = pt(582, 434), S = pt(279, 67)
  const M = lerp(N, S, 0.516)
  const Q = inter(Pp, S, M, R)                      // Q ∈ PS, MQ đi qua R
  const T = inter(S, bisector(S, N, Pp, 100), R, bisector(R, N, M, 100))
  const L = inter(S, T, N, Pp)
  const gN = goc(N, M, Pp), gQ = goc(Q, M, Pp)
  ok(gan(goc(T, R, S), (gN + gQ) / 2), '∠RTS = (N + Q)/2 (hệ quả)')
  ok(M.x < Q.x && Q.y < Pp.y && Q.y > S.y && N.x < Pp.x && Pp.x < R.x, 'bố cục')
  ok(L.x > N.x && L.x < R.x && T.y > S.y && T.y < L.y, 'S–T–L, L trên đoạn NR')
  return { M, N, Pp, Q, R, S, T, L }
}
{
  const { M, N, Pp, Q, R, S, T } = dung587()
  hinh('HHC000587_de', [M, N, Pp, Q, R, S, T], [
    seg(S, N), seg(S, Pp), seg(N, R), seg(M, R), seg(S, T), seg(T, R),
    dot(M), dot(N), dot(Pp), dot(Q), dot(R), dot(S), dot(T),
    label(S, 'S', 0, -14), label(M, 'M', -26, 6), label(N, 'N', -6, 32), label(Pp, 'P', 4, 32),
    label(R, 'R', 20, 10), label(Q, 'Q', 18, -6), label(T, 'T', -14, -6),
  ])
}
{
  const { M, N, Pp, Q, R, S, T, L } = dung587()
  hinh('HHC000587_lg', [M, N, Pp, Q, R, S, T, L], [
    seg(S, N), seg(S, Pp), seg(N, R), seg(M, R), seg(S, L), seg(T, R),
    dot(M), dot(N), dot(Pp), dot(Q), dot(R), dot(S), dot(T), dot(L),
    label(S, 'S', 0, -14), label(M, 'M', -26, 6), label(N, 'N', -6, 32), label(Pp, 'P', 4, 32),
    label(R, 'R', 20, 10), label(Q, 'Q', 18, -6), label(T, 'T', -14, -6), label(L, 'L', -4, 32),
  ])
}

// ── HHC000581 / HHC000582 — tứ giác MNPQ có N + Q = 180° (⇒ nội tiếp), PN = PQ; Qy = tia đối của tia QM.
//    Hai ảnh cũ cùng bố cục (581 gắn nhãn M N P Q; 582 gắn nhãn A B C D = M N P Q, khác vị trí M một chút).
//    Bỏ 2 cung đánh dấu ∠PQy và ∠PNM của ảnh cũ: đó chính là điều phải chứng minh.
function dungTuGiacNoiTiep(angM) {
  const O = P(0, 0), Rr = 150
  const Pp = ray(O, 270, Rr), Q = ray(O, 191.3, Rr), N = ray(O, 348.7, Rr), M = ray(O, angM, Rr)
  const Y = lerp(M, Q, 1 + 85 / dist(M, Q))
  ok(gan(goc(N, M, Pp) + goc(Q, M, Pp), 180), 'N + Q = 180°')
  ok(gan(dist(Pp, N), dist(Pp, Q), 0.01), 'PN = PQ')
  ok(Y.y > Q.y, 'y nằm phía dưới Q')
  return { M, N, Pp, Q, Y, O }
}
for (const [ten, angM, L] of [['HHC000581', 130.8, ['M', 'N', 'P', 'Q']], ['HHC000582', 113.3, ['M', 'N', 'P', 'Q']]]) {
  const { M, N, Pp, Q, Y, O } = dungTuGiacNoiTiep(angM)
  hinh(ten, [M, N, Pp, Q, Y], [
    seg(M, Y), seg(M, N), seg(N, Pp), seg(Pp, Q), ...(ten === 'HHC000581' ? [seg(M, Pp)] : []),
    tick(Pp, Q, 2), tick(Pp, N, 2),
    dot(M), dot(N), dot(Pp), dot(Q),
    labelOut(M, L[0], O, 24), labelOut(N, L[1], O, 24), labelOut(Pp, L[2], O, 24), labelOut(Q, L[3], O, 24),
    label(Y, 'y', -16, 6),
  ])
}

await xuatTat(RA)
