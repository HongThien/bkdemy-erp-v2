// Vẽ lại hình — gói BT-MH061-1 (MH.061 Phân giác trong Tam giác vuông, Hình 7 · Luyện).
//   node scripts/anh/ve_lai/BT-MH061-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, dot, label, labelOut, rightAngle, foot, mid, lerp, inter, bisector, doiXung, goc, dist, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH061-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const gan = (p, q, e = 0.6) => Math.abs(p.x - q.x) < e && Math.abs(p.y - q.y) < e

// Dựng chung: ABC vuông tại A (AB : AC = 1 : 2, AB < AC lệch hẳn), B trên, A dưới trái, C dưới phải như ảnh cũ.
// E (hoặc M) ∈ BC sao cho BE = BA; D (hoặc K) = chân phân giác góc B trên AC; F (hoặc Q, H…) cách A dưới đoạn CE.
function chung() {
  const A = P(0, 0), B = P(0, -120), C = P(240, 0)
  const E = lerp(B, C, dist(A, B) / dist(B, C))
  const D = inter(B, bisector(B, A, C), A, C)
  const F = P(0, dist(C, E))                                  // tia đối của tia AB, AF = CE
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, 'A = 90°')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(Math.abs(dist(B, E) - dist(B, A)) < 0.01, 'BE = BA')
  ok(Math.abs(goc(B, A, D) - goc(B, E, D)) < 0.01 && Math.abs(goc(B, A, C) - 2 * goc(B, A, D)) < 0.01, 'BD phân giác')
  ok(Math.abs(goc(E, D, B) - 90) < 0.5, 'DE ⊥ BC (hệ quả của dựng)')
  ok(gan(inter(F, E, A, C), D), 'F, D, E thẳng hàng (hệ quả của dựng)')
  return { A, B, C, E, D, F, G: trongTam([A, B, C]) }
}

// ── BT.07.061.10 — ảnh cũ: AB, AC, BC, BK, và AE, EK (đoạn của bài sau/lời giải) ⇒ giữ
{
  const { A, B, C, E, D: K, G } = chung()
  hinh('BT.07.061.10', [A, B, C, E, K], [seg(A, B), seg(A, C), seg(B, C), seg(B, K), seg(A, E), seg(E, K),
    rightAngle(A, B, C),
    dot(A), dot(B), dot(C), dot(E), dot(K),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26),
    labelOut(E, 'E', A, 26), label(K, 'K', 4, 30)])
}

// ── BT.07.061.16 — ảnh cũ: AB kéo dài xuống F, AC, BC, BD, AE, FC, đường F–D–E
{
  const { A, B, C, E, D, F, G } = chung()
  hinh('BT.07.061.16', [A, B, C, E, D, F], [seg(B, F), seg(A, C), seg(B, C), seg(B, D), seg(A, E), seg(F, D), seg(D, E), seg(F, C),
    rightAngle(A, B, C),
    dot(A), dot(B), dot(C), dot(E), dot(D), dot(F),
    labelOut(B, 'B', G, 26), label(A, 'A', -22, 8), labelOut(C, 'C', G, 26),
    labelOut(E, 'E', A, 26), label(D, 'D', 14, 28), label(F, 'F', -22, 8)])
}

// ── BT.07.061.17 — M ∈ BC, BA = BM; E trung điểm AM. Ảnh cũ có thêm K (BE ∩ AC) và đoạn KM ⇒ giữ
{
  const { A, B, C, E: M, G } = chung()
  const E = mid(A, M), K = inter(B, E, A, C)
  ok(Math.abs(goc(B, A, E) - goc(B, M, E)) < 0.01, 'tam giác ABE = MBE')
  hinh('BT.07.061.17', [A, B, C, M, E, K], [seg(A, B), seg(A, C), seg(B, C), seg(B, K), seg(A, M), seg(K, M),
    rightAngle(A, B, C),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(K),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26),
    labelOut(M, 'M', A, 26), label(E, 'E', 8, -14), label(K, 'K', 4, 30)])
}

// ── BT.07.061.20 — thêm H trên tia đối của tia KM, KH = KC. Ảnh cũ: đường H–K–M, A–H (tia đối AB), AM, BK, E
{
  const { A, B, C, E: M, G } = chung()
  const E = mid(A, M), K = inter(B, E, A, C)
  const u = P((K.x - M.x) / dist(K, M), (K.y - M.y) / dist(K, M))
  const H = P(K.x + u.x * dist(K, C), K.y + u.y * dist(K, C))
  ok(Math.abs(H.x - A.x) < 0.01 && H.y > 0, 'B, A, H thẳng hàng (hệ quả của dựng)')
  hinh('BT.07.061.20', [A, B, C, M, E, K, H], [seg(B, H), seg(A, C), seg(B, C), seg(B, K), seg(A, M), seg(K, H), seg(K, M),
    rightAngle(A, B, C),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(K), dot(H),
    labelOut(B, 'B', G, 26), label(A, 'A', -22, 8), labelOut(C, 'C', G, 26),
    labelOut(M, 'M', A, 26), label(E, 'E', 8, -14), label(K, 'K', 14, 28), label(H, 'H', 24, 8)])
}

// ── BT.07.061.24 — như .16 nhưng ảnh cũ KHÔNG có FC
{
  const { A, B, C, E, D, F, G } = chung()
  hinh('BT.07.061.24', [A, B, C, E, D, F], [seg(B, F), seg(A, C), seg(B, C), seg(B, D), seg(A, E), seg(F, D), seg(D, E),
    rightAngle(A, B, C),
    dot(A), dot(B), dot(C), dot(E), dot(D), dot(F),
    labelOut(B, 'B', G, 26), label(A, 'A', -22, 8), labelOut(C, 'C', G, 26),
    labelOut(E, 'E', A, 26), label(D, 'D', 14, 28), label(F, 'F', 24, 8)])
}

// ── BT.07.061.26 — DE ⊥ BC (cho sẵn ⇒ ô vuông ở E); Q = tia BA ∩ tia ED. Ảnh cũ: AB–Q, AC, BC, BD, AE, Q–D–E
{
  const { A, B, C, E, D, F, G } = chung()
  const Q = inter(B, A, E, D)
  ok(gan(Q, F), 'Q khớp dựng AF = CE')
  ok(Math.abs(dist(D, Q) - dist(D, C)) < 0.01, 'DQ = DC')
  hinh('BT.07.061.26', [A, B, C, E, D, Q], [seg(B, Q), seg(A, C), seg(B, C), seg(B, D), seg(A, E), seg(Q, D), seg(D, E),
    rightAngle(A, B, C), rightAngle(E, D, C),
    dot(A), dot(B), dot(C), dot(E), dot(D), dot(Q),
    labelOut(B, 'B', G, 26), label(A, 'A', -22, 8), labelOut(C, 'C', G, 26),
    labelOut(E, 'E', A, 26), label(D, 'D', 14, 28), label(Q, 'Q', 24, 8)])
}

// ── BT.07.061.27 — thêm M trung điểm QC. Ảnh cũ: như .26 thêm QC và đường B–D–M
{
  const { A, B, C, E, D, F, G } = chung()
  const Q = inter(B, A, E, D), M = mid(Q, C)
  ok(gan(inter(B, D, Q, C), M), 'B, D, M thẳng hàng (hệ quả của dựng)')
  hinh('BT.07.061.27', [A, B, C, E, D, Q, M], [seg(B, Q), seg(A, C), seg(B, C), seg(B, D), seg(D, M), seg(A, E), seg(Q, D), seg(D, E), seg(Q, C),
    rightAngle(A, B, C), rightAngle(E, D, C),
    dot(A), dot(B), dot(C), dot(E), dot(D), dot(Q), dot(M),
    labelOut(B, 'B', G, 26), label(A, 'A', -22, 8), labelOut(C, 'C', G, 26),
    labelOut(E, 'E', A, 26), label(D, 'D', -20, 22), label(Q, 'Q', 18, 28), label(M, 'M', 20, 20)])
}

// ── BT.07.061.28 — tam giác MAB nhọn, MA < MB; C ∈ MB, MC = MA; ME phân giác (E ∈ AB); F = MA ∩ CE; ảnh cũ có thêm H (trung điểm FB), FB, EH ⇒ giữ
{
  const A = P(0, 0), B = P(269, 0), M = P(68, -203)
  const C = lerp(M, B, dist(M, A) / dist(M, B))
  const E = inter(M, bisector(M, A, B), A, B)
  const F = inter(M, A, C, E)
  const H = mid(F, B)
  ok(dist(M, A) < dist(M, B), 'MA < MB')
  ok(goc(A, M, B) < 90 && goc(M, A, B) < 90 && goc(M, B, A) < 90, 'MAB nhọn')
  ok(Math.abs(dist(M, C) - dist(M, A)) < 0.01, 'MA = MC')
  ok(Math.abs(dist(E, A) - dist(E, C)) < 0.01, 'EA = EC (hệ quả)')
  ok(Math.abs(goc(M, A, E) - goc(M, C, E)) < 0.01, 'ME phân giác: AME = CME')
  const G = trongTam([A, B, M])
  hinh('BT.07.061.28', [A, B, M, C, E, F, H], [seg(M, F), seg(M, B), seg(A, B), seg(M, E), seg(F, E), seg(E, C), seg(F, B), seg(E, H),
    dot(A), dot(B), dot(M), dot(C), dot(E), dot(F), dot(H),
    label(M, 'M', 0, -12), label(A, 'A', -20, 6), label(B, 'B', 22, 8), label(C, 'C', 14, -8),
    label(E, 'E', -18, -8), label(F, 'F', -20, 6), label(H, 'H', 10, 28)])
}

await xuatTat(RA)
