// Vẽ lại hình — gói HH00097-1 (Cụng đầu, Hình 7: hai tam giác chung đỉnh / đối đỉnh qua trung điểm M).
//   node scripts/anh/ve_lai/HH00097-1.mjs [<thu_muc_ra>]
// Mọi hình: M là trung điểm của hai đoạn cắt nhau; điểm thứ tư dựng bằng doiXung (đối xứng qua M), không ước mắt.
// Quy ước chung: KHÔNG vẽ sẵn đường nối ba điểm mà đề bắt chứng minh thẳng hàng (AE ở 825; K–A–D ở 832) — ảnh cũ có vẽ, ghi trong báo cáo.
import { P, seg, dot, label, hinh, xuatTat, mid, doiXung, foot, goc, dist, ray } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00097-1/moi'
const ok = (c, m) => console.assert(c, m)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
/** Tạo hàm đổi toạ độ ảnh cũ → toạ độ vẽ (nhân hệ số s) */
const SC = (s) => (x, y) => P(x * s, y * s)

// ── Hình chung: tam giác ABC, M ∈ BC trung điểm, D ∈ tia đối tia MA, MD = MA. Nét: AB, BC, AC, A–M–D, CD.
{
  const S = SC(0.55)
  const A = S(205, 50), B = S(80, 300), C = S(455, 300)
  const M = mid(B, C), D = doiXung(A, M)
  ok(near(dist(M, B), dist(M, C)) && near(dist(M, A), dist(M, D)), 'MB = MC, MA = MD')
  ok(near(goc(M, A, D), 180, 0.1) && near(goc(M, B, C), 180, 0.1), 'A, M, D và B, M, C thẳng hàng')
  hinh('HHC000820+HHC000821+HHC000827+HHC000828+HHC000830+HHC000831+HHC000834+HHC000835', [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, D), seg(C, D),
    dot(A), dot(B), dot(C), dot(M), dot(D),
    label(A, 'A', 16, -10), label(B, 'B', -14, -10), label(C, 'C', 16, -10), label(M, 'M', 16, -12), label(D, 'D', 18, 20),
  ])
}

// ── HHC000822 — như hình chung + I = chân đường vuông góc hạ từ M xuống AC, K = chân đường vuông góc hạ từ M xuống BD.
//    Nét: AB, BC, AC, A–M–D, CD, BD, MI, MK.
{
  const S = SC(0.55)
  const A = S(165, 45), B = S(40, 295), C = S(415, 295)
  const M = mid(B, C), D = doiXung(A, M)
  const I = foot(M, A, C), K = foot(M, B, D)
  ok(near(goc(I, M, A), 90, 0.1) && near(goc(I, M, C), 90, 0.1), 'MI ⊥ AC')
  ok(near(goc(K, M, B), 90, 0.1) && near(goc(K, M, D), 90, 0.1), 'MK ⊥ BD')
  ok(near(goc(M, I, K), 180, 0.1), 'I, M, K thẳng hàng (hệ quả của AC ∥ BD)')
  ok(near(goc(I, A, C), 180, 0.1), 'I nằm giữa A và C')
  hinh('HHC000822', [A, B, C, D, M, I, K], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, D), seg(C, D), seg(B, D), seg(M, I), seg(M, K),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(I), dot(K),
    label(A, 'A', 16, -10), label(B, 'B', -14, -10), label(C, 'C', 16, -10), label(M, 'M', -30, -10), label(D, 'D', 18, 20),
    label(I, 'I', 14, -10), label(K, 'K', -16, 14),
  ])
}

// ── HHC000823 — M trung điểm AB; N ∈ tia đối tia MC, MN = MC. Nét: AB, A–C, C–M–N, BN.
{
  const S = SC(0.55)
  const A = S(57, 300), B = S(430, 300), C = S(182, 50)
  const M = mid(A, B), N = doiXung(C, M)
  ok(near(dist(M, A), dist(M, B)) && near(dist(M, C), dist(M, N)), 'MA = MB, MC = MN')
  hinh('HHC000823', [A, B, C, N, M], [
    seg(A, B), seg(A, C), seg(C, N), seg(B, N),
    dot(A), dot(B), dot(C), dot(M), dot(N),
    label(A, 'A', -14, -10), label(B, 'B', 16, -10), label(C, 'C', 16, -10), label(M, 'M', 16, -12), label(N, 'N', 18, 20),
  ])
}

// ── HHC000824 + 825 — như 823 (M trung điểm AB, N đối xứng C qua M) + E ∈ tia đối tia BN, BE = BN.
//    Nét: AB, AC, C–M–N, E–B–N, BC, CE. (825 thêm F = trung điểm BC; không vẽ đường AE.)
function dungE() {
  const S = SC(0.55)
  const A = S(40, 303), B = S(415, 303), C = S(167, 52)
  const M = mid(A, B), N = doiXung(C, M), E = doiXung(N, B)
  ok(near(dist(B, N), dist(B, E)), 'BE = BN')
  ok(near(E.y, C.y, 0.01), 'CE ∥ AB (E, C cùng độ cao)')
  ok(near(dist(A, C), dist(B, E)) && near(dist(A, B) - dist(C, E), 0, 0.01), 'ABEC là hình bình hành (AC = BE, AB = CE)')
  return { A, B, C, M, N, E }
}
{
  const { A, B, C, M, N, E } = dungE()
  hinh('HHC000824', [A, B, C, N, E, M], [
    seg(A, B), seg(A, C), seg(C, N), seg(E, N), seg(B, C), seg(C, E),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(E),
    label(A, 'A', -14, -10), label(B, 'B', 22, 22), label(C, 'C', 16, -10), label(M, 'M', 16, -12), label(N, 'N', 18, 20), label(E, 'E', 16, -10),
  ])
}
{
  const { A, B, C, M, N, E } = dungE()
  const F = mid(B, C)
  ok(near(goc(F, B, C), 180, 0.1), 'F là trung điểm BC')
  hinh('HHC000825', [A, B, C, N, E, M, F], [
    seg(A, B), seg(A, C), seg(C, N), seg(E, N), seg(B, C), seg(C, E),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(E), dot(F),
    label(A, 'A', -14, -10), label(B, 'B', 22, 22), label(C, 'C', 16, -10), label(M, 'M', 16, -12), label(N, 'N', 18, 20), label(E, 'E', 16, -10), label(F, 'F', 16, -8),
  ])
}

// ── HHC000826 — tam giác ABC vuông tại A, M trung điểm BC (⇒ MA = MB = MC), E ∈ tia đối tia MA, ME = MA. Nét: AB, BC, AC, A–M–E, CE.
{
  const s = 0.52
  const B = P(60 * s, 300 * s), C = P(698 * s, 300 * s)
  const M = mid(B, C), R = dist(B, C) / 2
  const A = ray(M, 127, R)                              // A trên đường tròn đường kính BC ⇒ góc A vuông
  const E = doiXung(A, M)
  ok(near(goc(A, B, C), 90, 0.1), 'tam giác ABC vuông tại A')
  ok(near(dist(M, E), dist(M, A)), 'ME = MA')
  hinh('HHC000826', [A, B, C, E, M], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, E), seg(C, E),
    dot(A), dot(B), dot(C), dot(M), dot(E),
    label(A, 'A', 16, -10), label(B, 'B', -14, -10), label(C, 'C', 16, -10), label(M, 'M', 16, -12), label(E, 'E', 18, 20),
  ])
}

// ── HHC000829 — M trung điểm AC (AB < AC), D ∈ tia đối tia MB, MB = MD. Nét: AB, AC, BC, B–M–D, CD.
{
  const S = SC(0.55)
  const A = S(57, 293), C = S(493, 293), B = S(182, 43)
  const M = mid(A, C), D = doiXung(B, M)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(near(dist(M, B), dist(M, D)), 'MB = MD')
  hinh('HHC000829', [A, B, C, D, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(C, D),
    dot(A), dot(B), dot(C), dot(M), dot(D),
    label(B, 'B', 16, -10), label(A, 'A', -14, -10), label(C, 'C', 16, -10), label(M, 'M', 16, -12), label(D, 'D', 18, 20),
  ])
}

// ── HHC000832 — M trung điểm AC, D đối xứng B qua M (như 829); N trung điểm AB, K ∈ tia đối tia NC, NK = NC.
//    Nét: AB, AC, BC, B–M–D, CD, K–N–C. (Không vẽ K–A–D: đề bắt chứng minh D, A, K thẳng hàng.)
{
  const S = SC(0.52)
  const A = S(323, 317), C = S(722, 317), B = S(437, 89)
  const M = mid(A, C), D = doiXung(B, M)
  const N = mid(A, B), K = doiXung(C, N)
  ok(near(dist(N, K), dist(N, C)), 'NK = NC')
  ok(near(Math.abs((D.x - A.x) * (K.y - A.y) - (D.y - A.y) * (K.x - A.x)), 0, 0.5), 'D, A, K thẳng hàng (hệ quả)')
  hinh('HHC000832', [A, B, C, D, K, M, N], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(C, D), seg(K, C),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(N), dot(K),
    label(A, 'A', -14, -8), label(B, 'B', 16, -10), label(C, 'C', 16, -8), label(M, 'M', -16, 28), label(D, 'D', 18, 20),
    label(N, 'N', -10, -14), label(K, 'K', 14, -10),
  ])
}

await xuatTat(RA)
