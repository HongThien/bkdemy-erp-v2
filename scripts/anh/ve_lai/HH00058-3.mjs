// Vẽ lại hình — gói HH00058-3 (Tứ giác, Hình học 8).
//   node scripts/anh/ve_lai/HH00058-3.mjs [<thu_muc_ra>]
import { P, seg, tick, angleMark, rightAngle, sector, dot, label, hinh, xuatTat,
  ray, mid, foot, inter, bisector, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00058-3/moi'
const ok = (c, m) => console.assert(c, m)

// ───────── HHC000610 / HHC000611 — tứ giác MNPQ: N + Q = 180°, PN = PQ; Qy = tia đối của tia QM; lời giải kẻ PF ⊥ QM, PE ⊥ MN.
// Dựng: P trên phân giác góc M (khi đó PF = PE); Q cách chân F một đoạn s về phía M, N cách chân E một đoạn s về phía XA M
// ⇒ PQ = PN và (△PFQ = △PEN) ⇒ góc PQy = góc N ⇒ N + Q = 180°.
function dung() {
  const M = P(0, 0)
  const dQ = -110, dN = -30                          // hướng tia MQ, MN (độ)
  const P_ = ray(M, -70, 297)                        // phân giác góc M (80°) → -70°
  const F0 = foot(P_, M, ray(M, dQ, 100))            // chân đường vuông góc xuống đường MQ
  const E0 = foot(P_, M, ray(M, dN, 100))            // chân đường vuông góc xuống đường MN
  const s = 70
  const Q = ray(M, dQ, dist(M, F0) - s)
  const N = ray(M, dN, dist(M, E0) + s)
  const y = ray(M, dQ, dist(M, F0) + 65)             // đầu mút tia Qy (qua F một đoạn)
  ok(Math.abs(dist(P_, Q) - dist(P_, N)) < 0.01, 'PN = PQ')
  ok(Math.abs(goc(N, M, P_) + goc(Q, M, P_) - 180) < 0.01, 'N + Q = 180°')
  ok(Math.abs(goc(Q, P_, y) - goc(N, M, P_)) < 0.01, 'PQy = N')
  ok(Math.abs(goc(M, P_, Q) - goc(M, P_, N)) < 0.01, 'PM phân giác (hệ quả)')
  return { M, N, P: P_, Q, F: F0, E: E0, y }
}

function veTuGiac(ten, ten4, lg) {
  const { M, N, P: Pp, Q, F, E, y } = dung()
  const [tM, tN, tP, tQ] = ['M', 'N', 'P', 'Q']
  const [tF, tE] = ten4                               // tên chân đường vuông góc trên QM và MN
  const pts = [M, N, Pp, Q, y]
  const body = [
    sector(N, M, Pp, 26), sector(Q, Pp, y, 26),
    seg(M, N), seg(N, Pp), seg(Pp, Q), seg(M, y), seg(M, Pp),
    angleMark(N, M, Pp, 26), angleMark(Q, Pp, y, 26),
    tick(Q, Pp, 2), tick(N, Pp, 2),
  ]
  if (lg) {
    body.push(seg(Pp, F), seg(Pp, E), rightAngle(F, M, Pp, 13), rightAngle(E, M, Pp, 13),
      dot(F), dot(E), label(F, tF, -20, 8), label(E, tE, 18, -10))
  }
  body.push(dot(M), dot(N), dot(Pp), dot(Q),
    label(M, tM, 0, -14), label(N, tN, 20, 0), label(Pp, tP, 0, 32), label(Q, tQ, -22, 4),
    label(y, 'y', -14, 4))
  hinh(ten, pts, body)
}

veTuGiac('HHC000610_de', ['F', 'E'], false)
veTuGiac('HHC000610_lg', ['F', 'E'], true)
veTuGiac('HHC000611_de', ['S', 'R'], false)
veTuGiac('HHC000611_lg', ['S', 'R'], true)

// ───────── HHC000617+618+619 — tứ giác ABCD, phân giác góc A và B cắt nhau tại I.
// Hình dùng chung 3 câu (số đo khác nhau từng câu nên không ghi số trên hình). Dựng theo câu 617 (D − C = 20°, AIB = 60°):
// D = 70°, C = 50°, A = 100°, B = 140° (A + B = 240°).
{
  const D = P(0, 0)
  const A = ray(D, 70, 220)
  const B0 = ray(A, -10, 150)                         // AB hướng -10°: tại A góc trong = 100°
  const C = inter(B0, ray(B0, -50, 100), D, P(100, 0)) // BC hướng -50°, cắt đáy y = 0
  const B = B0
  ok(Math.abs(goc(D, A, C) - 70) < 0.01, 'D = 70°')
  ok(Math.abs(goc(C, B, D) - 50) < 0.01, 'C = 50°')
  ok(Math.abs(goc(A, D, B) - 100) < 0.01, 'A = 100°')
  ok(Math.abs(goc(B, A, C) - 140) < 0.01, 'B = 140°')
  const I = inter(A, bisector(A, D, B, 100), B, bisector(B, A, C, 100))
  ok(Math.abs(goc(I, A, B) - 60) < 0.01, 'AIB = 60°')
  hinh('HHC000617+HHC000618+HHC000619', [A, B, C, D, I], [
    sector(A, B, I, 28), sector(B, A, I, 28),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, I), seg(B, I),
    angleMark(A, B, I, 28), angleMark(B, A, I, 28, 2),
    dot(A), dot(B), dot(C), dot(D), dot(I),
    label(A, 'A', -4, -14), label(B, 'B', 14, -12), label(C, 'C', 22, 10), label(D, 'D', -22, 10), label(I, 'I', 0, 30),
  ])
}

// ───────── HHC000583 / 584 / 598 — tứ giác MNPQ: góc M = góc N, NP = MQ (thang cân MNPQ, MN trên, QP dưới), hai đường chéo MP, NQ.
{
  const M = P(0, 0), N = P(180, 0)
  const Q = ray(M, 180 + 62, 240)                     // góc M = 118°
  const Pp = ray(N, -62, 240)                          // góc N = 118°, NP = MQ
  ok(Math.abs(goc(M, N, Q) - goc(N, M, Pp)) < 0.01, 'M = N')
  ok(Math.abs(dist(N, Pp) - dist(M, Q)) < 0.01, 'NP = MQ')
  ok(Math.abs(Q.y - Pp.y) < 0.01, 'MN // QP (hệ quả)')
  const body = [
    sector(M, N, Q, 30), sector(N, M, Pp, 30),
    seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M), seg(M, Pp), seg(N, Q),
    angleMark(M, N, Q, 30), angleMark(N, M, Pp, 30),
    tick(M, Q, 2), tick(N, Pp, 2),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', -4, -14), label(N, 'N', 4, -14), label(Pp, 'P', 20, 12), label(Q, 'Q', -20, 12),
  ]
  for (const ten of ['HHC000583', 'HHC000584', 'HHC000598']) hinh(ten, [M, N, Pp, Q], body)
}

await xuatTat(RA)
