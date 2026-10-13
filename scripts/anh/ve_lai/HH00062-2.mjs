// Vẽ lại hình — gói HH00062-2 (Hình chữ nhật, Hình học 8).
//   node scripts/anh/ve_lai/HH00062-2.mjs [<thu_muc_ra>]
// HHC000579: tam giác ABC vuông ở A (A dưới-trái, B phía trên A, C bên phải); M ∈ BC; MD ⊥ AB (D ∈ AB), ME ⊥ AC (E ∈ AC);
// P, Q đối xứng với M qua AB, AC; I = trung điểm DE. Nét: AB, BC, AC, P–D–M, M–E–Q, DE, AP, AQ, AM nét đứt (qua I).
import { P, seg, segDash, rightAngle, dot, label, hinh, xuatTat,
  lerp, mid, reflect, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00062-2/moi'
const ok = (c, m) => console.assert(c, m)
const gan = (a, b, e = 0.05) => Math.abs(a - b) < e

const k = 0.5
const A = P(0, 0), B = P(0, -320 * k), C = P(480 * k, 0)
const M = lerp(B, C, 0.306)                                // M ∈ BC (vị trí như ảnh cũ)
const D = P(0, M.y), E = P(M.x, 0)                         // chân đường vuông góc hạ từ M xuống AB, AC
const Pp = reflect(M, A, B), Q = reflect(M, A, C)
const I = mid(D, E)
ok(gan(goc(A, B, C), 90), 'góc A = 90°')
ok(gan(dist(B, M) + dist(M, C), dist(B, C), 0.01), 'M ∈ đoạn BC')
ok(gan(goc(D, A, M), 90) && gan(goc(E, A, M), 90) && gan(goc(A, D, E), 90), 'ADME có ba góc vuông ⇒ hình chữ nhật')
ok(gan(dist(D, Pp), dist(D, M)) && gan(dist(E, Q), dist(E, M)), 'D là trung điểm PM, E là trung điểm QM (đối xứng qua AB, AC)')
ok(gan(goc(I, A, M), 180), 'A, I, M thẳng hàng (hệ quả dựng)')

hinh('HHC000579', [A, B, C, M, D, E, Pp, Q, I], [
  seg(A, B), seg(B, C), seg(A, C), seg(Pp, M), seg(M, Q), seg(D, E), seg(A, Pp), seg(A, Q), segDash(A, M),
  rightAngle(D, M, A, 11), rightAngle(E, M, C, 11),
  dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(Pp), dot(Q), dot(I),
  label(B, 'B', -2, -14), label(Pp, 'P', -2, -14), label(D, 'D', 16, -12), label(M, 'M', 4, -14),
  label(I, 'I', 16, 8), label(A, 'A', -16, 22), label(E, 'E', 10, 28), label(C, 'C', 18, 24), label(Q, 'Q', 18, 8),
], { pad: 40, padDuoi: 46 })

await xuatTat(RA)
