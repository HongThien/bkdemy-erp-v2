// ve_G23.mjs — vẽ hình VHB2 §15 (VD36, BT 219–228) bằng code (trạm G23). Chạy: node ve_G23.mjs (từ <TH>) → hinh_G23/
import {
  P, seg, segDash, tick, angleMark, rightAngle, dot, label, hinh, xuatTat, lerp, mid, foot, inter, add, mul, dist,
  labelOut, num, sideText, trongTam,
} from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/ad0c1492ee4a551d/6017bd0a-294b-4bab-8639-506812d8ed78/scratchpad/h8t3/hinh_G23'
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const d = (a, b) => dist(a, b)
// tam giác: BC = a nằm ngang (B trái, C phải), AB = c, AC = b; toạ độ SVG (y xuống), tỉ lệ s px / đơn vị
const tri = (a, b, c, s, x0 = 0, y0 = 0) => {
  const x = (c * c - b * b + a * a) / (2 * a), y = Math.sqrt(c * c - x * x)
  return { A: P(x0 + x * s, y0 - y * s), B: P(x0, y0), C: P(x0 + a * s, y0) }
}
const chan = (v, p, q) => lerp(p, q, d(v, p) / (d(v, p) + d(v, q)))        // chân phân giác trong từ v xuống pq
const noiTiep = (A, B, C) => { const x = d(B, C), y = d(C, A), z = d(A, B), t = x + y + z; return P((x * A.x + y * B.x + z * C.x) / t, (x * A.y + y * B.y + z * C.y) / t) }
const LO = (p, t, from, k = 22) => labelOut(p, t, from, k)
const dots = (...ps) => ps.map(dot)

// ───────── VD36: a=5,5 b=6,5 c=4,5 — tam giác lệch ─────────
{
  const { A, B, C } = tri(5.5, 6.5, 4.5, 62, 60, 300)
  const D = chan(A, B, C), I = noiTiep(A, B, C), M = mid(B, C), G = trongTam([A, B, C]), ct = trongTam([A, B, C])
  const goc = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), angleMark(A, B, D, 40, 1), angleMark(A, D, C, 40, 1)]
  const nhan = [LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(D, 'D', ct, 20)]
  hinh('VHB2-VD36', [A, B, C, D], [...goc, ...dots(A, B, C, D), ...nhan])
  hinh('VHB2-VD36_b_lg', [A, B, C, D], [
    ...goc, seg(B, I), angleMark(B, A, I, 40, 2), angleMark(B, I, C, 40, 2), ...dots(A, B, C, D, I), ...nhan, label(I, 'I', 14, -8),
  ])
  hinh('VHB2-VD36_c_lg', [A, B, C, D, M], [
    ...goc, seg(B, I), seg(A, M), segDash(I, G), ...dots(A, B, C, D, I, M, G), LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20),
    label(D, 'D', -8, 28), label(M, 'M', 10, 28), label(I, 'I', -14, -4), label(G, 'G', 17, -4),
  ])
}

// ───────── 219: ABC vuông tại A (AB đứng, AC ngang), BD phân giác, AD=3, DC=5 ─────────
{
  const u = 34, A = P(60, 320), B = P(60, 320 - 6 * u), C = P(60 + 8 * u, 320), D = P(60 + 3 * u, 320)
  const ct = trongTam([A, B, C])
  hinh('VHB2-219', [A, B, C, D], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), rightAngle(A, B, C, 14),
    angleMark(B, A, D, 36, 1), angleMark(B, D, C, 36, 1),
    ...dots(A, B, C, D),
    label(A, 'A', -16, 22), label(B, 'B', -16, 4), label(C, 'C', 18, 10), label(D, 'D', 0, 34),
    num(mid(A, D), '3', 0, 52, 22), num(mid(D, C), '5', 0, 52, 22),
  ])
}

// ───────── 220: AD phân giác, M∈AB, N∈AC, BM=BD, CN=CD ─────────
{
  const { A, B, C } = tri(6.2, 5.8, 4.6, 58, 50, 300)
  const D = chan(A, B, C), ct = trongTam([A, B, C])
  const M = lerp(B, A, d(B, D) / d(B, A)), N = lerp(C, A, d(C, D) / d(C, A))
  hinh('VHB2-220', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(M, N),
    angleMark(A, B, D, 40, 1), angleMark(A, D, C, 40, 1),
    tick(B, M, 1), tick(B, D, 1), tick(C, N, 2), tick(C, D, 2),
    ...dots(A, B, C, D, M, N),
    LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(D, 'D', ct, 20), LO(M, 'M', ct, 20), LO(N, 'N', ct, 20),
  ])
}

// ───────── 221: AB=4, AC=6, AD phân giác, OA:OD=2:1, K=BO∩AC ─────────
{
  const { A, B, C } = tri(7, 6, 4, 52, 50, 300)
  const D = chan(A, B, C), O = lerp(A, D, 2 / 3), ct = trongTam([A, B, C])
  const K = inter(B, O, A, C), E = inter(D, add(D, sub(K, B)), A, C)
  const base = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, K), angleMark(A, B, D, 40, 1), angleMark(A, D, C, 40, 1),
    sideText(A, B, '4', C, 18), num(lerp(A, C, 0.9), '6', 16, -6, 22),
  ]
  hinh('VHB2-221', [A, B, C, D, K], [...base, ...dots(A, B, C, D, O, K),
    LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(D, 'D', ct, 20), label(O, 'O', -14, 6), LO(K, 'K', ct, 20)])
  hinh('VHB2-221_lg', [A, B, C, D, K, E], [...base, seg(D, E), ...dots(A, B, C, D, O, K, E),
    LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(D, 'D', ct, 20), label(O, 'O', -14, 6), LO(K, 'K', ct, 20), LO(E, 'E', ct, 20)])
}

// ───────── 223: AD phân giác, BD=2, DC=4; trung trực của AD cắt đường thẳng BC ở K ─────────
{
  const u = 36, { A, B, C } = tri(6, 5.6, 2.8, u, 230, 250)     // BC = 6, AC = 2·AB
  const D = lerp(B, C, 2 / 6), ct = trongTam([A, B, C])
  const Pm = mid(A, D), dir = P(-(D.y - A.y), D.x - A.x)                         // phương vuông góc với AD
  const K = inter(Pm, add(Pm, dir), B, C)
  const top = add(Pm, mul(sub(Pm, K), 0.28))                                     // kéo trung trực quá P một đoạn
  const E = inter(A, add(A, dir), B, C)
  const base = [
    seg(K, C), seg(A, B), seg(C, A), seg(A, D), seg(K, top), rightAngle(Pm, A, top, 10),
    angleMark(A, B, D, 16, 1), angleMark(A, D, C, 16, 1), tick(A, Pm, 1, 0.6), tick(Pm, D, 1, 0.4),
    num(mid(B, D), '2', 0, -8, 22), num(mid(D, C), '4', 0, -8, 22),
  ]
  const nh = (xs) => xs
  hinh('VHB2-223', [A, B, C, D, K, top], [...base, ...dots(A, B, C, D, K, Pm),
    LO(A, 'A', ct, 18), label(B, 'B', 0, 32), label(C, 'C', 18, 10), label(D, 'D', 0, 32), label(K, 'K', -4, 34), label(Pm, 'P', 24, 22)])
  hinh('VHB2-223_lg', [A, B, C, D, K, top, E], [...base, seg(E, A), ...dots(A, B, C, D, K, Pm, E),
    LO(A, 'A', ct, 18), label(B, 'B', 0, 32), label(C, 'C', 18, 10), label(D, 'D', 0, 32), label(K, 'K', 0, 34), label(Pm, 'P', 24, 22), label(E, 'E', -6, 34)])
}

// ───────── 224: AB=8, AC=12, BC=10; I tâm nội tiếp, G trọng tâm ─────────
{
  const { A, B, C } = tri(10, 12, 8, 30, 60, 330)
  const I = noiTiep(A, B, C), G = trongTam([A, B, C]), D = chan(A, B, C), M = mid(B, C), ct = G
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, I), seg(B, I), seg(C, I),
    sideText(A, B, '8', C, 18), sideText(A, C, '12', B, 18), sideText(B, C, '10', A, 18)]
  const nhan = [LO(A, 'A', ct, 20), LO(B, 'B', ct, 22), LO(C, 'C', ct, 22), label(I, 'I', -16, 2), label(G, 'G', 18, 2)]
  hinh('VHB2-224', [A, B, C], [...base, ...dots(A, B, C, I, G), ...nhan])
  const lg = [seg(A, D), seg(A, M), segDash(I, G), ...dots(A, B, C, I, G, D, M), label(D, 'D', -4, 34), label(M, 'M', 16, 34)]
  hinh('VHB2-224_a_lg', [A, B, C], [...base.slice(0, 5), ...lg, ...nhan, ])
  hinh('VHB2-224_b_lg', [A, B, C], [...base.slice(0, 5), ...lg, ...nhan, ])
}

// ───────── 225: hình bình hành ABCD (A trên trái), phân giác AM, BN ─────────
{
  const A = P(110, 60), B = P(380, 60), Dd = P(30, 220), C = add(B, sub(Dd, A))
  const O = mid(A, C), M = chan(A, Dd, B), N = chan(B, C, A), ct = O
  const hs = [seg(A, B), seg(B, C), seg(C, Dd), seg(Dd, A), seg(A, C), seg(B, Dd), seg(A, M), seg(B, N), seg(M, N),
    angleMark(A, Dd, M, 36, 1), angleMark(A, M, B, 36, 1), angleMark(B, A, N, 36, 2), angleMark(B, N, C, 36, 2)]
  const nh = [LO(A, 'A', ct, 20), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(Dd, 'D', ct, 20), label(M, 'M', -4, 26), label(N, 'N', 18, -8)]
  hinh('VHB2-225', [A, B, C, Dd], [...hs, ...dots(A, B, C, Dd, M, N), ...nh])
  hinh('VHB2-225_lg', [A, B, C, Dd], [...hs, ...dots(A, B, C, Dd, M, N, O), ...nh.slice(0, 5), label(N, 'N', -2, 28), label(O, 'O', 0, -14)])
}

// ───────── 226: BE, CF phân giác cắt nhau ở O (tam giác thường, KHÔNG vuông) ─────────
{
  const { A, B, C } = tri(5.2, 6.4, 4, 62, 50, 300)
  const E = chan(B, A, C), F = chan(C, A, B), O = noiTiep(A, B, C), ct = trongTam([A, B, C])
  hinh('VHB2-226', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, E), seg(C, F),
    angleMark(B, A, E, 38, 1), angleMark(B, E, C, 38, 1), angleMark(C, A, F, 38, 2), angleMark(C, F, B, 38, 2),
    ...dots(A, B, C, E, F, O),
    LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(E, 'E', ct, 20), LO(F, 'F', ct, 20), label(O, 'O', 4, 26),
  ])
}

// ───────── 228: b > c, BD, CE phân giác ─────────
{
  const { A, B, C } = tri(5.6, 6.4, 4.2, 60, 50, 300)
  const D = chan(B, A, C), E = chan(C, A, B), ct = trongTam([A, B, C])
  const K = add(E, sub(D, B))
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, E),
    angleMark(B, A, D, 38, 1), angleMark(B, D, C, 38, 1), angleMark(C, A, E, 38, 2), angleMark(C, E, B, 38, 2)]
  const nh = [LO(A, 'A', ct, 18), LO(B, 'B', ct, 20), LO(C, 'C', ct, 20), LO(E, 'E', ct, 20), label(D, 'D', 16, -8)]
  hinh('VHB2-228', [A, B, C], [...base, ...dots(A, B, C, D, E), ...nh])
  const lg = [...base, seg(E, K), seg(K, D), seg(C, K), ...dots(A, B, C, D, E, K), ...nh, LO(K, 'K', ct, 20)]
  hinh('VHB2-228_b_lg', [A, B, C, K], lg)
  hinh('VHB2-228_c_lg', [A, B, C, K], lg)
}

await xuatTat(OUT)
