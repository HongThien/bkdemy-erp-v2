// Vẽ lại hình — gói HH00026-1 (Phân giác trong tam giác vuông, Hình 7).
//   node scripts/anh/ve_lai/HH00026-1.mjs [<thu_muc_ra>]
// Tam giác ABC vuông tại A (A góc dưới-trái, B phía trên A, C bên phải); BD (hay BK) = phân giác góc B; E ∈ BC, BE = BA.
import { P, seg, angleMark, rightAngle, sector, dot, label, hinh, xuatTat,
  lerp, mid, inter, bisector, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00026-1/moi'
const ok = (c, m) => console.assert(c, m)

/** Dựng tam giác vuông tại A với AB = ab, AC = ac; trả A, B, C, D (chân phân giác góc B trên AC), E (BE = BA trên BC) */
function dung(ab, ac) {
  const A = P(0, 0), B = P(0, -ab), C = P(ac, 0)
  const D = inter(B, bisector(B, A, C, 100), A, C)
  const E = lerp(B, C, ab / dist(B, C))
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, 'góc A phải vuông')
  ok(Math.abs(dist(B, E) - dist(B, A)) < 0.01, 'BE = BA')
  ok(Math.abs(goc(B, A, D) - goc(B, A, C) / 2) < 0.01, 'BD phân giác (ABD = ABC/2)')
  ok(Math.abs(goc(B, A, D) - goc(B, E, D)) < 0.01, 'ABD = EBD')
  return { A, B, C, D, E }
}

// ── HHC000766 — hình đề: K = chân phân giác góc B trên AC, E ∈ BC, BE = BA. Nét: AB, BC, AC, BK, AE, EK.
{
  const { A, B, C, D: K, E } = dung(200, 400)
  hinh('HHC000766', [A, B, C, K, E], [
    seg(A, B), seg(B, C), seg(A, C), seg(B, K), seg(A, E), seg(E, K),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(K), dot(E),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(K, 'K', 0, 30), label(E, 'E', 18, -10),
  ])
}

// ── Hình chung (D, E): bản trong ảnh cũ — tô + một cung ở góc B (cả góc ABC), góc vuông A.
{
  const { A, B, C, D, E } = dung(200, 400)
  const ten = 'HHC000767+HHC000768+HHC000769+HHC000770+HHC000771+HHC000774+HHC000775+HHC000777+HHC000778+HHC000779+HHC000781+HHC000785+HHC000786+HHC000788+HHC000789'
  hinh(ten, [A, B, C, D, E], [
    sector(B, A, C, 44), seg(A, B), seg(B, C), seg(A, C), seg(B, D), seg(A, E), seg(D, E),
    angleMark(B, A, C, 44), rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 0, 30), label(E, 'E', 18, -10),
  ])
}

// ── HHC000772 — F ∈ tia đối của tia AB, AF = CE. Nét: B–A–F, BC, AC, BD, AE, E–D–F, FC.
{
  const { A, B, C, D, E } = dung(160, 320)
  const F = P(0, dist(C, E))                         // AF = CE, F ở phía dưới A trên đường AB
  ok(Math.abs(dist(A, F) - dist(C, E)) < 0.01, 'AF = CE')
  ok(Math.abs(goc(D, F, E) - 180) < 0.1, 'F, D, E thẳng hàng (hệ quả của giả thiết)')
  hinh('HHC000772', [A, B, C, D, E, F], [
    seg(B, F), seg(B, C), seg(A, C), seg(B, D), seg(A, E), seg(F, E), seg(F, C),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 16, 28), label(E, 'E', 18, -10), label(F, 'F', -20, 10),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC000773 — AB < AC, M ∈ BC với BA = BM, E = trung điểm AM. Nét: AB, BC, AC, AM, BK (K = BE ∩ AC), KM.
{
  const { A, B, C, E: M } = dung(200, 400)
  const E = mid(A, M)
  const K = inter(B, E, A, C)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(Math.abs(dist(B, A) - dist(B, M)) < 0.01, 'BA = BM')
  hinh('HHC000773', [A, B, C, M, E, K], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, M), seg(B, K), seg(K, M),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(K),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(M, 'M', 4, -14), label(E, 'E', -16, -2), label(K, 'K', 4, 32),
  ])
}

// ── HHC000776 — như 773 (M ∈ BC, BM = BA; K = phân giác B ∩ AC; E = BK ∩ AM) và H ∈ tia đối của tia KM, KH = KC.
//    Nét: B–A–H, BC, AC, AM, BK, M–K–H.
{
  const { A, B, C, E: M, D: K } = dung(150, 300)
  const E = inter(B, K, A, M)
  const H = lerp(K, M, -dist(K, C) / dist(K, M))      // KH = KC, H nằm phía đối của M qua K
  ok(Math.abs(dist(K, H) - dist(K, C)) < 0.01, 'KH = KC')
  ok(Math.abs(H.x - A.x) < 0.01, 'H nằm trên đường AB (hệ quả: B, A, H thẳng hàng)')
  hinh('HHC000776', [A, B, C, M, E, K, H], [
    seg(B, H), seg(B, C), seg(A, C), seg(A, M), seg(B, K), seg(M, H),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(K), dot(H),
    label(A, 'A', -20, 8), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(M, 'M', 4, -14), label(E, 'E', -16, -2), label(K, 'K', 20, 26), label(H, 'H', 22, 10),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC000780 — như 772 nhưng KHÔNG có đoạn FC. Nét: B–A–F, BC, AC, BD, AE, E–D–F.
{
  const { A, B, C, D, E } = dung(160, 320)
  const F = P(0, dist(C, E))
  ok(Math.abs(goc(D, F, E) - 180) < 0.1, 'F, D, E thẳng hàng')
  hinh('HHC000780', [A, B, C, D, E, F], [
    seg(B, F), seg(B, C), seg(A, C), seg(B, D), seg(A, E), seg(F, E),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 16, 28), label(E, 'E', 18, -10), label(F, 'F', 22, 10),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC000782 — Q = tia BA ∩ tia ED. Nét: B–A–Q, BC, AC, BD, AE, E–D–Q.
{
  const { A, B, C, D, E } = dung(160, 320)
  const Q = inter(E, D, B, A)
  ok(Q.y > A.y, 'Q nằm trên tia BA, phía dưới A')
  ok(Math.abs(dist(D, Q) - dist(D, C)) < 0.01, 'DQ = DC (hệ quả)')
  hinh('HHC000782', [A, B, C, D, E, Q], [
    seg(B, Q), seg(B, C), seg(A, C), seg(B, D), seg(A, E), seg(Q, E),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(Q),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 16, 28), label(E, 'E', 18, -10), label(Q, 'Q', 22, 10),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC000783 — như 782 + M = trung điểm QC; nét thêm QC, D–M (B, D, M thẳng hàng là điều phải chứng minh).
{
  const { A, B, C, D, E } = dung(160, 320)
  const Q = inter(E, D, B, A)
  const M = mid(Q, C)
  ok(Math.abs(goc(D, B, M) - 180) < 0.1, 'B, D, M thẳng hàng (hệ quả)')
  hinh('HHC000783', [A, B, C, D, E, Q, M], [
    seg(B, M), seg(B, C), seg(A, C), seg(B, Q), seg(A, E), seg(Q, E), seg(Q, C),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(Q), dot(M),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 32, 24), label(E, 'E', 18, -10), label(Q, 'Q', 22, 10), label(M, 'M', 22, 18),
  ], { pad: 40, padDuoi: 46 })
}

await xuatTat(RA)
