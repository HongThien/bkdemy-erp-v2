// Vẽ lại hình — gói BT-MH011-1 (MH.011 Tam giác vuông có đường cao AH, Hình 9 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH011-1.mjs [<thu_muc_ra>]
import { P, seg, rightAngle, angleMark, sector, dot, label, hinh, xuatTat, foot, inter, bisector, goc, dist, lerp, rot } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH011-1/moi'
const ok = (v, d, msg) => console.assert(Math.abs(v - d) < 0.5, `${msg}: ${v} ≠ ${d}`)

// ───── 03, 04, 13: ABC vuông tại A, AB = 6, AC = 8 (hoặc 12, 16 — cùng tỉ lệ 3:4), AH ⊥ BC, kẻ HE ⊥ AB, HF ⊥ AC ─────
function tamGiac(AB, AC) {
  const A = P(0, 0), B = P(0, -AB), C = P(AC, 0)
  return { A, B, C, H: foot(A, B, C) }
}
function hinhHaiChan(ten, { M, N, veMN }) {
  const s = 42
  const { A, B, C, H } = tamGiac(6 * s, 8 * s)
  const E = foot(H, A, B), F = foot(H, A, C)
  ok(goc(A, B, C), 90, 'A'); ok(goc(H, A, C), 90, 'AHC'); ok(goc(E, H, A), 90, 'E'); ok(goc(F, H, A), 90, 'F')
  console.assert(Math.abs(dist(A, B) / dist(A, C) - 0.75) < 1e-9, 'tỉ lệ AB:AC')
  hinh(ten, [A, B, C], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(H, E), seg(H, F), veMN ? seg(E, F) : '',
    rightAngle(A, B, C, 14), rightAngle(E, H, A, 12), rightAngle(F, H, C, 12), rightAngle(H, A, C, 11),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(F),
    label(B, 'B', 0, -12), label(A, 'A', -16, 22), label(C, 'C', 18, 8),
    label(H, 'H', 12, -14), label(E, M, -20, 8), label(F, N, 0, 32),
  ])
}
// BT.09.011.03 — chứng minh BH·CH = EF² (EF nối hai chân)
hinhHaiChan('BT.09.011.03', { M: 'E', N: 'F', veMN: true })
// BT.09.011.04 — ảnh cũ giống hệt bài 03 (có EF)
hinhHaiChan('BT.09.011.04', { M: 'E', N: 'F', veMN: true })
// BT.09.011.13 — HM ⊥ AB, HN ⊥ AC (ảnh cũ không nối MN)
hinhHaiChan('BT.09.011.13', { M: 'M', N: 'N', veMN: false })

// ───── 06, 07: ABC vuông tại A, góc B = 60°, HB = 2, HC = 6 (⇒ BC = 8, AB = 4, AC = 4√3), BD phân giác ─────
function tamGiac60(ten, coE) {
  const s = 49 // 1 cm = 49px: AC = 4√3·49 ≈ 339
  const A = P(0, 0), B = P(0, -4 * s), C = P(4 * Math.sqrt(3) * s, 0)
  const H = foot(A, B, C)
  ok(goc(B, A, C), 60, 'góc B'); ok(dist(B, H) / s, 2, 'HB'); ok(dist(H, C) / s, 6, 'HC'); ok(dist(B, C) / s, 8, 'BC')
  const D = inter(B, bisector(B, A, C, 100), A, C)
  ok(goc(B, A, D), 30, 'ABD = 30°'); ok(goc(B, D, C), 30, 'DBC = 30°')
  const E = foot(D, B, C)
  if (coE) ok(goc(D, B, E), 60, 'BDE = 60°')
  const nen = [sector(B, A, D, 34), sector(B, D, C, 42)]
  const net = [seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(B, D), angleMark(B, A, D, 34), angleMark(B, D, C, 42),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 12)]
  const cham = [dot(A), dot(B), dot(C), dot(H), dot(D)]
  const chu = [label(B, 'B', 0, -12), label(A, 'A', -16, 22), label(C, 'C', 18, 8), label(H, 'H', 10, -14), label(D, 'D', 0, 32)]
  if (coE) {
    net.push(seg(D, E), rightAngle(E, D, C, 12)); cham.push(dot(E)); chu.push(label(E, 'E', 10, -14))
  }
  hinh(ten, [A, B, C], [...nen, ...net, ...cham, ...chu])
}
tamGiac60('BT.09.011.06', false)
tamGiac60('BT.09.011.07', true)

// ───── 15, 16: MNP vuông tại M, MP = 3 cm, P = 30° (N trên, M dưới-trái, P phải) ─────
{
  const s = 110, M = P(0, 0), Pp = P(3 * s, 0), N = P(0, -3 * s * Math.tan(Math.PI / 6))
  ok(goc(Pp, M, N), 30, 'P = 30°'); ok(goc(N, M, Pp), 60, 'N = 60°'); console.assert(dist(M, Pp) > dist(M, N), 'MP > MN')
  const I = foot(M, N, Pp), Hh = foot(I, M, N), K = foot(I, M, Pp)
  // BT.09.011.15 — đề chỉ có tam giác MNP; ảnh cũ là hình của cả chuỗi (đã có I, H, K, chưa có G) ⇒ giữ đúng những gì ảnh cũ có
  hinh('BT.09.011.15', [M, N, Pp], [seg(M, N), seg(N, Pp), seg(M, Pp), seg(M, I), seg(I, Hh), seg(I, K),
    rightAngle(M, N, Pp, 14), rightAngle(I, M, Pp, 11), rightAngle(Hh, N, I, 12), rightAngle(K, I, Pp, 12),
    dot(M), dot(N), dot(Pp), dot(I), dot(Hh), dot(K),
    label(N, 'N', 0, -12), label(M, 'M', -16, 22), label(Pp, 'P', 18, 8),
    label(I, 'I', 14, -12), label(Hh, 'H', -20, 8), label(K, 'K', 0, 32)])

  // BT.09.011.16 — MI ⊥ NP, MG phân giác góc PMI (G ∈ NP); ảnh cũ còn H, K (hình chiếu của I, bài 17 mượn hình này)
  const G = inter(M, bisector(M, Pp, I, 100), N, Pp)
  ok(goc(M, Pp, G), 30, 'PMG = 30°'); ok(goc(M, I, G), 30, 'IMG = 30°'); ok(goc(M, I, Pp), 60, 'PMI = 60°'); ok(goc(I, M, Pp), 90, 'MI ⊥ NP')
  console.assert(Math.abs(dist(N, M) - dist(N, G)) < 0.5, 'NM = NG (tam giác MGN cân)')
  hinh('BT.09.011.16', [M, N, Pp], [seg(M, N), seg(N, Pp), seg(M, Pp), seg(M, I), seg(M, G), seg(I, Hh), seg(I, K),
    rightAngle(M, N, Pp, 14), rightAngle(I, M, Pp, 11), rightAngle(Hh, N, I, 12), rightAngle(K, I, Pp, 12),
    dot(M), dot(N), dot(Pp), dot(I), dot(G), dot(Hh), dot(K),
    label(N, 'N', 0, -12), label(M, 'M', -16, 22), label(Pp, 'P', 18, 8),
    label(I, 'I', 14, -12), label(G, 'G', 14, -12), label(Hh, 'H', -20, 8), label(K, 'K', 0, 32)])
}

await xuatTat(RA)
