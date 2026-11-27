// k5v-G05.mjs — Toán 5, "Diện tích các hình" / Nhận diện tam giác, đường cao: vẽ lại 8 hình (683, 692, 696, 701, 708, 709, 715, 716, 719).
//   node scripts/anh/ve_moi/k5v-G05.mjs "<thư mục gói>\moi"
import { P, seg, segDash, hinh, xuatTat, label, rightAngle, foot, dist, goc } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G05.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const dotv = (o, a, b) => (a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)
const onSeg = (p, a, b) => { const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / dist(a, b) ** 2; return t > 0.02 && t < 0.98 }
const near0 = (v) => Math.abs(v) < 1e-6 * 1e3
const OFF = { u: [0, -12], d: [0, 28], l: [-18, 9], r: [18, 9], ul: [-14, -10], ur: [14, -10], dl: [-16, 26], dr: [16, 26] }
const lab = (p, t, d) => label(p, t, OFF[d][0], OFF[d][1])
const tri = (a, b, c) => [seg(a, b), seg(b, c), seg(c, a)]
const map = (s, ox, oy) => (p) => P(ox + p.x * s, oy + p.y * s)

// ── 683: tam giác ABC, BH ⟂ AC tại H ──
{
  const m = map(1.2, 0, 0)
  const A = m(P(278, 40)), B = m(P(40, 215)), C = m(P(365, 215))
  const H = foot(B, A, C)
  ok('683 H nằm giữa A, C', onSeg(H, A, C))
  ok('683 BH ⟂ AC', Math.abs(dotv(H, B, A)) < 1e-6 || Math.abs(dotv(H, B, C)) < 1e-6)
  ok('683 tam giác nhọn', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  hinh('T105000000683', [A, B, C, H], [...tri(A, B, C), seg(B, H), rightAngle(H, B, A, 14), lab(A, 'A', 'u'), lab(B, 'B', 'dl'), lab(C, 'C', 'dr'), lab(H, 'H', 'r')])
}

// ── 692: ba tam giác (DEG có GH ⟂ DE; MNK có MI ⟂ KN kéo dài; ABC vuông tại B) ──
{
  const m = map(0.45, 0, 0), m2 = map(0.45, 34, 0)
  const D = m(P(135, 68)), E = m(P(20, 297)), G = m(P(435, 293))
  const H = foot(G, D, E)
  ok('692 H trên cạnh DE', onSeg(H, D, E))
  ok('692 GH ⟂ DE', Math.abs(dotv(H, G, D)) < 1e-6)
  const K = m2(P(540, 290)), N = m2(P(890, 290)), M = m2(P(1025, 65)), I = m2(P(1025, 290))
  ok('692 N giữa K và I (I ngoài cạnh KN)', onSeg(N, K, I))
  ok('692 MI ⟂ KN', Math.abs(dotv(I, M, K)) < 1e-6)
  ok('692 góc N tù', goc(N, M, K) > 90)
  const A = m2(P(1158, 42)), B = m2(P(1158, 290)), C = m2(P(1360, 290))
  ok('692 ABC vuông tại B', Math.abs(dotv(B, A, C)) < 1e-6)
  hinh('T105000000692', [D, E, G, K, N, M, I, A, B, C], [
    ...tri(D, E, G), seg(G, H), rightAngle(H, G, D, 11), lab(D, 'D', 'u'), lab(E, 'E', 'dl'), lab(G, 'G', 'dr'), lab(H, 'H', 'l'),
    ...tri(M, N, K), segDash(N, I), segDash(M, I), rightAngle(I, M, N, 11), lab(M, 'M', 'u'), lab(K, 'K', 'dl'), lab(N, 'N', 'd'), lab(I, 'I', 'dr'),
    ...tri(A, B, C), rightAngle(B, A, C, 11), lab(A, 'A', 'u'), lab(B, 'B', 'dl'), lab(C, 'C', 'dr'),
  ])
}

// ── 696: tam giác DEG, DH ⟂ đường thẳng EG, H trên phần kéo dài về phía E ──
{
  const m = map(1.1, 0, 0)
  const D = m(P(75, 45)), H = m(P(75, 215)), E = m(P(190, 215)), G = m(P(348, 215))
  ok('696 DH ⟂ HG', Math.abs(dotv(H, D, G)) < 1e-6)
  ok('696 E giữa H và G', onSeg(E, H, G))
  ok('696 góc E tù', goc(E, D, G) > 90)
  hinh('T105000000696', [D, H, E, G], [seg(D, E), seg(E, G), seg(G, D), seg(D, H), segDash(H, E), rightAngle(H, D, E, 14), lab(D, 'D', 'ul'), lab(H, 'H', 'dl'), lab(E, 'E', 'd'), lab(G, 'G', 'dr')])
}

// ── 701: tam giác MNP vuông tại P ──
{
  const m = map(1.3, 0, 0)
  const N = m(P(55, 213)), P_ = m(P(288, 213)), M = m(P(288, 45))
  ok('701 vuông tại P', Math.abs(dotv(P_, M, N)) < 1e-6)
  ok('701 không vuông cân', Math.abs(dist(P_, M) - dist(P_, N)) > 20)
  hinh('T105000000701', [N, P_, M], [...tri(M, N, P_), rightAngle(P_, M, N, 16), lab(M, 'M', 'ur'), lab(N, 'N', 'dl'), lab(P_, 'P', 'dr')])
}

// ── 708: 5 miếng bìa tam giác vuông cân giống nhau xếp thành con cá (không ký hiệu góc/cạnh) ──
{
  const m = map(0.85, 0, 0)
  const top = m(P(0, 0)), L = m(P(-150, 150)), R = m(P(150, 150)), BL = m(P(-300, 300)), C = m(P(0, 300)), BR = m(P(300, 300)), TL = m(P(-150, 450)), TR = m(P(150, 450))
  const tris = [[top, L, R], [L, BL, C], [R, C, BR], [L, R, C], [C, TL, TR]]
  const cạnh = (t) => [dist(t[0], t[1]), dist(t[1], t[2]), dist(t[2], t[0])].map((x) => x.toFixed(2)).sort().join()
  ok('708 5 tam giác bằng nhau (3 cạnh sắp xếp)', new Set(tris.map(cạnh)).size === 1)
  ok('708 mỗi miếng có 1 góc vuông', tris.every((t) => [0, 1, 2].some((i) => Math.abs(dotv(t[i], t[(i + 1) % 3], t[(i + 2) % 3])) < 1e-6)))
  const body = [seg(top, L), seg(top, R), seg(L, R), seg(L, BL), seg(R, BR), seg(BL, BR), seg(L, C), seg(R, C), seg(C, TL), seg(C, TR), seg(TL, TR)]
  hinh('T105000000708', [top, BL, BR, TL, TR], body, { pad: 22, padDuoi: 22 })
}

// ── lưới ô vuông cho 709, 716 ──
const U = 40
function luoi(cols, rows) {
  let s = '<g stroke="#b9bec6" stroke-width="1">'
  for (let i = 0; i <= cols; i++) s += seg(P(i * U, 0), P(i * U, rows * U))
  for (let j = 0; j <= rows; j++) s += seg(P(0, j * U), P(cols * U, j * U))
  return s + '</g>'
}
const G_ = (c, r) => P(c * U, r * U)
const slope = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })

// ── 709: lưới, DEG và IKL ──
{
  const D = G_(2, 1), E = G_(6, 3), G = G_(1, 4), K = G_(9, 2), L = G_(11, 1), I = G_(14, 4)
  ok('709 đỉnh trên mắt lưới', [D, E, G, K, L, I].every((p) => p.x % U === 0 && p.y % U === 0))
  ok('709 DEG nhọn (để chân đường cao trong cạnh)', goc(D, E, G) < 90 && goc(E, D, G) < 90 && goc(G, D, E) < 90)
  ok('709 IKL: góc K, I nhọn (chân đường cao từ L nằm trong KI)', goc(K, L, I) < 90 && goc(I, K, L) < 90 && onSeg(foot(L, K, I), K, I))
  hinh('T105000000709', [G_(0, 0), G_(16, 5)], [luoi(16, 5), ...tri(D, E, G), ...tri(K, L, I), lab(D, 'D', 'u'), lab(E, 'E', 'r'), lab(G, 'G', 'dl'), lab(K, 'K', 'l'), lab(L, 'L', 'u'), lab(I, 'I', 'dr')], { pad: 36, padDuoi: 44 })
}

// ── 716: lưới, DGE (đáy GE, tù tại G) và ILK (đáy IL ngang, tù tại L) ──
{
  const D = G_(1, 1), E = G_(6, 3), G = G_(3, 4), I = G_(9, 1), L = G_(13, 1), K = G_(14, 4)
  ok('716 đỉnh trên mắt lưới', [D, E, G, I, L, K].every((p) => p.x % U === 0 && p.y % U === 0))
  ok('716 góc G (DGE) tù', goc(G, D, E) > 90)
  ok('716 góc L (ILK) tù', goc(L, I, K) > 90)
  ok('716 IL nằm ngang, K cách L đúng 1 ô ngang', I.y === L.y && K.x - L.x === U)
  hinh('T105000000716', [G_(0, 0), G_(16, 5)], [luoi(16, 5), ...tri(D, E, G), ...tri(I, L, K), lab(D, 'D', 'ul'), lab(E, 'E', 'r'), lab(G, 'G', 'dl'), lab(I, 'I', 'ul'), lab(L, 'L', 'u'), lab(K, 'K', 'dr')], { pad: 36, padDuoi: 44 })
}

// ── 715: BCD (đáy BD) và OPQ (đáy PQ) ──
{
  const m = map(0.55, 0, 0)
  const B = m(P(80, 288)), C = m(P(322, 100)), D = m(P(445, 288))
  const O = m(P(828, 62)), P_ = m(P(684, 172)), Q = m(P(1085, 288))
  const f1 = foot(C, B, D), f2 = foot(O, P_, Q)
  ok('715 BCD: chân đường cao từ C trong BD', onSeg(f1, B, D))
  ok('715 OPQ: chân đường cao từ O trong PQ', onSeg(f2, P_, Q))
  ok('715 BCD không cân', Math.abs(dist(B, C) - dist(D, C)) > 15)
  hinh('T105000000715', [B, C, D, O, P_, Q], [...tri(B, C, D), ...tri(O, P_, Q), lab(B, 'B', 'dl'), lab(C, 'C', 'u'), lab(D, 'D', 'dr'), lab(O, 'O', 'u'), lab(P_, 'P', 'l'), lab(Q, 'Q', 'dr')])
}

// ── 719: BCD (đáy CD, tù tại C) và MNP (đáy MN, tù tại M) ──
{
  const m = map(0.55, 0, 0)
  const B = m(P(60, 55)), C = m(P(185, 250)), D = m(P(518, 250))
  const P_ = m(P(675, 78)), M = m(P(782, 248)), N = m(P(1140, 188))
  ok('719 góc C (BCD) tù', goc(C, B, D) > 90)
  ok('719 góc M (MNP) tù', goc(M, P_, N) > 90)
  ok('719 chân đường cao từ B rơi ngoài đoạn CD', !onSeg(foot(B, C, D), C, D))
  ok('719 chân đường cao từ P rơi ngoài đoạn MN', !onSeg(foot(P_, M, N), M, N))
  hinh('T105000000719', [B, C, D, P_, M, N], [...tri(B, C, D), ...tri(P_, M, N), lab(B, 'B', 'ul'), lab(C, 'C', 'd'), lab(D, 'D', 'dr'), lab(P_, 'P', 'ul'), lab(M, 'M', 'd'), lab(N, 'N', 'r')])
}

await xuatTat(dir)
