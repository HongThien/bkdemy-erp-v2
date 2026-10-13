// Vẽ lại hình — gói BT-MH063-1 (MH.063 Cụng đầu, Hình 7 · Luyện): BT.07.063.03/04/05/06/07/10/13/14
//   node scripts/anh/ve_lai/BT-MH063-1.mjs [<thu_muc_ra>]
import { P, seg, dot, label, rightAngle, mid, foot, goc, dist, doiXung, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH063-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const sc = (p, k) => P(p.x * k, p.y * k)
const DIR = { n: [0, -14], s: [0, 30], e: [20, 9], w: [-20, 9], ne: [17, -8], nw: [-17, -8], se: [17, 28], sw: [-17, 28] }
const lab = (p, t, d) => label(p, t, DIR[d][0], DIR[d][1])
const dots = (...ps) => ps.map(dot)
const thang = (a, b, c) => near(dist(a, b) + dist(b, c), dist(a, c), 0.01) // b nằm giữa a, c

// ───── BT.07.063.03 — ABC thường, M trung điểm BC, D đối xứng A qua M; MI ⊥ AC (I ∈ AC), MK ⊥ BD (K ∈ BD) ─────
{
  const k = 0.6
  const A = sc(P(165, 43), k), B = sc(P(40, 295), k), C = sc(P(415, 295), k)
  const M = mid(B, C), D = doiXung(A, M)
  const I = foot(M, A, C), K = foot(M, B, D)
  ok(near(dist(M, A), dist(M, D)), 'MA = MD'); ok(thang(B, M, C), 'M ∈ BC')
  ok(near(goc(I, M, A), 90, 0.5) && near(goc(K, M, B), 90, 0.5), 'MI ⊥ AC, MK ⊥ BD')
  ok(near(goc(M, I, K), 180, 0.5), 'I, M, K thẳng hàng (hệ quả)')
  hinh('BT.07.063.03', [A, B, C, D, I, K, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(M, D), seg(B, D), seg(C, D), seg(M, I), seg(M, K),
    rightAngle(I, A, M, 11), rightAngle(K, B, M, 11),
    ...dots(A, B, C, D, I, K, M),
    lab(A, 'A', 'n'), lab(B, 'B', 'w'), lab(C, 'C', 'e'), lab(D, 'D', 'se'), label(M, 'M', 21, 28), lab(I, 'I', 'ne'), lab(K, 'K', 'sw')])
}

// ───── Dựng chung cho BT.04/05/06: ABC thường, M trung điểm AB, N đối xứng C qua M ─────
function chung45() {
  const k = 0.6
  const A = sc(P(57, 300), k), B = sc(P(431, 300), k), C = sc(P(182, 50), k)
  const M = mid(A, B), N = doiXung(C, M)
  ok(near(dist(M, C), dist(M, N)), 'MC = MN'); ok(thang(C, M, N), 'M ∈ CN')
  return { A, B, C, M, N }
}
// BT.07.063.04
{
  const { A, B, C, M, N } = chung45()
  hinh('BT.07.063.04', [A, B, C, M, N], [
    seg(A, B), seg(A, C), seg(C, N), seg(N, B), ...dots(A, B, C, M, N),
    lab(A, 'A', 'w'), lab(B, 'B', 'e'), lab(C, 'C', 'n'), lab(M, 'M', 'ne'), lab(N, 'N', 's')])
}
// BT.07.063.05 — thêm E trên tia đối BN: BE = BN; ảnh cũ có đoạn BC, CE, BE
{
  const { A, B, C, M, N } = chung45()
  const E = doiXung(N, B)
  ok(thang(N, B, E) && near(dist(B, E), dist(B, N)), 'E trên tia đối BN, BN = BE')
  ok(near(dist(A, B), dist(E, C), 0.01), 'ABEC hình bình hành (AB = EC, hệ quả)')
  hinh('BT.07.063.05', [A, B, C, M, N, E], [
    seg(A, B), seg(A, C), seg(C, N), seg(N, E), seg(B, C), seg(C, E), ...dots(A, B, C, M, N, E),
    lab(A, 'A', 'w'), lab(B, 'B', 'se'), lab(C, 'C', 'nw'), lab(M, 'M', 'ne'), lab(N, 'N', 's'), lab(E, 'E', 'ne')])
}
// BT.07.063.06 — thêm F trung điểm BC, đoạn AE (ảnh cũ có AE, F)
{
  const { A, B, C, M, N } = chung45()
  const E = doiXung(N, B), F = mid(B, C)
  ok(near(goc(F, A, E), 180, 0.5), 'A, F, E thẳng hàng (hệ quả)')
  hinh('BT.07.063.06', [A, B, C, M, N, E, F], [
    seg(A, B), seg(A, C), seg(C, N), seg(N, E), seg(B, C), seg(C, E), seg(A, E), ...dots(A, B, C, M, N, E, F),
    lab(A, 'A', 'w'), lab(B, 'B', 'se'), lab(C, 'C', 'nw'), lab(M, 'M', 'ne'), lab(N, 'N', 's'), lab(E, 'E', 'ne'), lab(F, 'F', 'n')])
}

// ───── BT.07.063.07 — ABC vuông tại A, M trung điểm BC, E trên tia đối MA: ME = MA ─────
{
  const k = 0.58
  const B = sc(P(60, 300), k), C = sc(P(698, 300), k), A = sc(P(185, 300 - Math.sqrt(319 ** 2 - 194 ** 2)), k)
  const M = mid(B, C), E = doiXung(A, M)
  ok(near(goc(A, B, C), 90, 0.5), 'Â = 90°'); ok(dist(A, B) < dist(A, C), 'lệch hẳn')
  ok(near(dist(M, E), dist(M, A)) && thang(A, M, E), 'E trên tia đối MA, ME = MA')
  hinh('BT.07.063.07', [A, B, C, M, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, E), seg(E, C), rightAngle(A, B, C, 14), ...dots(A, B, C, M, E),
    lab(A, 'A', 'n'), lab(B, 'B', 'w'), lab(C, 'C', 'e'), lab(M, 'M', 'ne'), lab(E, 'E', 'se')])
}

// ───── Dựng chung cho BT.10/13/14: ABC (AB < AC), M trung điểm AC, D đối xứng B qua M ─────
function chung10(k) {
  const A = sc(P(323, 317), k), B = sc(P(437, 90), k), C = sc(P(722, 317), k)
  const M = mid(A, C), D = doiXung(B, M)
  ok(dist(A, B) < dist(A, C), 'AB < AC'); ok(near(dist(M, B), dist(M, D)) && thang(B, M, D), 'MB = MD, D trên tia đối MB')
  ok(goc(A, B, C) > 5, 'tam giác không suy biến')
  return { A, B, C, M, D }
}
// BT.07.063.10
{
  const { A, B, C, M, D } = chung10(0.68)
  hinh('BT.07.063.10', [A, B, C, M, D], [
    seg(A, B), seg(B, C), seg(A, C), seg(B, D), seg(C, D), ...dots(A, B, C, M, D),
    lab(A, 'A', 'w'), lab(B, 'B', 'n'), lab(C, 'C', 'e'), lab(M, 'M', 'ne'), lab(D, 'D', 'se')])
}
// BT.07.063.13 — thêm N trung điểm AB, K trên tia đối NC: NC = NK (ảnh cũ nối K–A–D và K–N–C)
{
  const { A, B, C, M, D } = chung10(0.55)
  const N = mid(A, B), K = doiXung(C, N)
  ok(thang(C, N, K) && near(dist(N, K), dist(N, C)), 'K trên tia đối NC, NK = NC')
  ok(thang(K, A, D), 'D, A, K thẳng hàng (hệ quả)')
  hinh('BT.07.063.13', [A, B, C, M, D, N, K], [
    seg(A, B), seg(B, C), seg(A, C), seg(B, D), seg(C, D), seg(K, C), seg(K, D), ...dots(A, B, C, M, D, N, K),
    lab(A, 'A', 'w'), lab(B, 'B', 'n'), lab(C, 'C', 'e'), label(M, 'M', -16, 30), lab(D, 'D', 'se'), label(N, 'N', -26, 22), lab(K, 'K', 'n')])
}
// BT.07.063.14 — thêm F chân đường cao từ A xuống BC, E chân đường cao từ C xuống AD (ảnh cũ có cả N, K, đường K–A–D của bài trước)
{
  const { A, B, C, M, D } = chung10(0.55)
  const N = mid(A, B), K = doiXung(C, N)
  const F = foot(A, B, C), E = foot(C, A, D)
  ok(near(goc(F, A, C), 90, 0.5) && near(goc(E, C, A), 90, 0.5), 'AF ⊥ BC, CE ⊥ AD')
  ok(thang(A, E, D), 'E nằm giữa A và D')
  ok(thang(B, F, C), 'F nằm giữa B và C')
  hinh('BT.07.063.14', [A, B, C, M, D, N, K, E, F], [
    seg(A, B), seg(B, C), seg(A, C), seg(B, D), seg(C, D), seg(K, C), seg(K, D), seg(A, F), seg(C, E),
    rightAngle(F, A, C, 11), rightAngle(E, C, A, 11),
    ...dots(A, B, C, M, D, N, K, E, F),
    lab(A, 'A', 'w'), lab(B, 'B', 'n'), lab(C, 'C', 'e'), label(M, 'M', -16, 30), lab(D, 'D', 'se'), label(N, 'N', -26, 22), lab(K, 'K', 'n'),
    lab(E, 'E', 'sw'), lab(F, 'F', 'ne')])
}

await xuatTat(RA)
