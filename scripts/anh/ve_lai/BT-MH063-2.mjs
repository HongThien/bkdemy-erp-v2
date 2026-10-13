// Vẽ lại hình — gói BT-MH063-2 (MH.063 Cụng đầu, Hình 7 · Luyện): BT.07.063.17, BT.07.063.18
//   node scripts/anh/ve_lai/BT-MH063-2.mjs [<thu_muc_ra>]
import { P, seg, dot, label, rightAngle, mid, foot, goc, dist, doiXung, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH063-2/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const sc = (p, k) => P(p.x * k, p.y * k)
const DIR = { n: [0, -14], s: [0, 30], e: [20, 9], w: [-20, 9], ne: [17, -8], nw: [-17, -8], se: [17, 28], sw: [-17, 28] }
const lab = (p, t, d) => label(p, t, DIR[d][0], DIR[d][1])
const dots = (...ps) => ps.map(dot)
const thang = (a, b, c) => near(dist(a, b) + dist(b, c), dist(a, c), 0.01) // b nằm giữa a, c

// Dựng chung: ABC thường (AB < AC), M trung điểm BC, D đối xứng A qua M, H/K chân đường vuông góc hạ từ A/D xuống BC
function chung(k) {
  const A = sc(P(187, 35), k), B = sc(P(47, 316), k), C = sc(P(470, 316), k)
  const M = mid(B, C), D = doiXung(A, M)
  const H = foot(A, B, C), K = foot(D, B, C)
  ok(near(dist(M, A), dist(M, D)) && thang(A, M, D), 'D trên tia đối MA, MA = MD')
  ok(dist(A, B) < dist(A, C) && goc(A, B, C) > 20 && goc(B, A, C) < 85, 'tam giác thường, không vuông/cân')
  ok(near(goc(H, A, B), 90, 0.5) || near(goc(H, A, C), 90, 0.5), 'AH ⊥ BC')
  ok(near(dist(A, H), dist(D, K)), 'AH = DK (hệ quả)')
  return { A, B, C, M, D, H, K }
}

// BT.07.063.17 — AH ⊥ BC, DK ⊥ BC (đề cho ⇒ có ô vuông)
{
  const { A, B, C, M, D, H, K } = chung(0.55)
  hinh('BT.07.063.17', [A, B, C, M, D, H, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, D), seg(A, H), seg(D, K),
    rightAngle(H, A, M, 11), rightAngle(K, D, C, 11),
    ...dots(A, B, C, M, D, H, K),
    lab(A, 'A', 'n'), lab(B, 'B', 'w'), lab(C, 'C', 'e'), lab(D, 'D', 'se'), lab(M, 'M', 'ne'), lab(H, 'H', 'sw'), lab(K, 'K', 'ne')])
}

// BT.07.063.18 — thêm I trung điểm AC, E đối xứng B qua I (ảnh cũ có AE, BE, EC, và giữ AH, DK của bài trước, không ô vuông)
{
  const { A, B, C, M, D, H, K } = chung(0.5)
  const I = mid(A, C), E = doiXung(B, I)
  ok(near(dist(I, B), dist(I, E)) && thang(B, I, E), 'I trung điểm BE')
  ok(near(goc(C, E, D), 180, 0.5), 'E, C, D thẳng hàng (hệ quả)')
  hinh('BT.07.063.18', [A, B, C, M, D, H, K, I, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, D), seg(A, H), seg(D, K), seg(A, E), seg(B, E), seg(E, C),
    ...dots(A, B, C, M, D, H, K, I, E),
    lab(A, 'A', 'nw'), lab(B, 'B', 'w'), lab(C, 'C', 'se'), lab(D, 'D', 'se'), lab(M, 'M', 'ne'), lab(H, 'H', 'ne'), lab(K, 'K', 'ne'),
    lab(I, 'I', 'n'), lab(E, 'E', 'ne')])
}

await xuatTat(RA)
