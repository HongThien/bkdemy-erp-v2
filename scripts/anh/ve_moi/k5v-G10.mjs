// k5v-G10.mjs — kho Đại khối 5, "Diện tích các hình": vẽ lại 10 hình (tam giác, đường cao, lưới ô vuông, hình chữ nhật + tam giác ECD).
//   node scripts/anh/ve_moi/k5v-G10.mjs "<thu_muc_moi>"
import { P, seg, segDash, dot, label, num, rightAngle, foot, hinh, xuatTat, fill, dist, poly } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G10.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b, e = 1e-6) => Math.abs(a - b) < e
const dotv = (o, a, b) => (a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)
const L = (p, t, dx, dy) => label(p, t, dx, dy)

// ── 025: tam giác KMN thường (K trên, MN ngang), không ký hiệu
{
  const M = P(0, 140), N = P(280, 140), K = P(70, 0)
  ok('025: MN ngang', eq(M.y, N.y))
  ok('025: tam giác nhọn lệch (KM≠KN≠MN)', dist(K, M) !== dist(K, N) && dotv(K, M, N) > 0 && dotv(M, K, N) > 0 && dotv(N, K, M) > 0)
  hinh('T105100401025', [M, N, K], [seg(M, N), seg(N, K), seg(K, M), dot(M), dot(N), dot(K),
    L(K, 'K', 0, -14), L(M, 'M', -4, 32), L(N, 'N', 4, 32)])
}
// ── 026: tam giác ABC tù tại B (A trên, BC ngang) như ảnh cũ
{
  const A = P(0, 0), B = P(67, 137), C = P(275, 137)
  ok('026: góc B tù', dotv(B, A, C) < 0)
  ok('026: BC ngang', eq(B.y, C.y))
  hinh('T105100401026', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    L(A, 'A', -6, -14), L(B, 'B', -4, 32), L(C, 'C', 6, 32)])
}
// ── 027: tam giác DEF vuông tại E (ED đứng, EF ngang), có ô vuông tại E (đề có ký hiệu)
{
  const E = P(0, 150), D = P(0, 0), F = P(296, 150)
  ok('027: góc E vuông', eq(dotv(E, D, F), 0))
  ok('027: không vuông cân', !eq(dist(E, D), dist(E, F), 1))
  hinh('T105100401027', [D, E, F], [seg(D, E), seg(E, F), seg(F, D), rightAngle(E, D, F, 16), dot(D), dot(E), dot(F),
    L(D, 'D', 0, -14), L(E, 'E', -16, 28), L(F, 'F', 6, 32)])
}
// ── 028: tam giác KMN, đường cao KH hạ xuống MN (H nằm trong MN), có ô vuông tại H
{
  const M = P(0, 175), N = P(290, 175), K = P(95, 0)
  const H = foot(K, M, N)
  ok('028: KH ⟂ MN', eq(dotv(H, K, N), 0, 1e-6))
  ok('028: H nằm giữa M và N', H.x > M.x && H.x < N.x)
  ok('028: tam giác nhọn', dotv(K, M, N) > 0 && dotv(M, K, N) > 0 && dotv(N, K, M) > 0)
  hinh('T105100401028', [M, N, K], [seg(M, N), seg(N, K), seg(K, M), seg(K, H), rightAngle(H, K, N, 16), dot(K), dot(M), dot(N), dot(H),
    L(K, 'K', 0, -14), L(M, 'M', -6, 32), L(N, 'N', 6, 32), L(H, 'H', 0, 32)])
}
// ── 029: tam giác MKN (K, N đáy dưới), đường cao KG hạ xuống cạnh MN (nằm ngoài ảnh cũ: G trên MN)
{
  const K = P(0, 170), N = P(279, 170), M = P(89, 0)
  const G = foot(K, M, N)
  ok('029: KG ⟂ MN', eq(dotv(G, K, N), 0, 1e-6))
  ok('029: G nằm giữa M và N', (G.x - M.x) * (N.x - G.x) > 0 && G.y > M.y && G.y < N.y)
  ok('029: tam giác nhọn', dotv(K, M, N) > 0 && dotv(M, K, N) > 0 && dotv(N, K, M) > 0)
  hinh('T105100401029', [K, N, M], [seg(K, N), seg(N, M), seg(M, K), seg(K, G), rightAngle(G, K, N, 16), dot(M), dot(K), dot(N), dot(G),
    L(M, 'M', -6, -14), L(K, 'K', -12, 30), L(N, 'N', 8, 30), L(G, 'G', 14, -8)])
}
// ── 030: tam giác KMN tù tại M; đường cao KF nằm ngoài, F trên đường kéo dài NM (nét đứt FM)
{
  const K = P(0, 0), F = P(0, 160), M = P(75, 160), N = P(310, 160)
  ok('030: KF ⟂ FN', eq(dotv(F, K, N), 0))
  ok('030: M nằm giữa F và N', M.x > F.x && M.x < N.x)
  ok('030: góc M tù', dotv(M, K, N) < 0)
  hinh('T105100401030', [K, F, N], [seg(K, F), segDash(F, M), seg(M, N), seg(K, M), seg(K, N), rightAngle(F, K, M, 16), dot(K), dot(F), dot(M), dot(N),
    L(K, 'K', -4, -14), L(F, 'F', -14, 30), L(M, 'M', 0, 32), L(N, 'N', 6, 32)])
}
// ── 031: tam giác MNP, MK ⟂ đường thẳng NP, K nằm ngoài (nét đứt MK, KN)
{
  const M = P(0, 0), K = P(0, 143), N = P(118, 143), P2 = P(272, 143)
  ok('031: MK ⟂ KP', eq(dotv(K, M, P2), 0))
  ok('031: N nằm giữa K và P', N.x > K.x && N.x < P2.x)
  ok('031: góc N tù', dotv(N, M, P2) < 0)
  hinh('T105100401031', [M, K, P2], [segDash(M, K), segDash(K, N), seg(N, P2), seg(M, N), seg(M, P2), rightAngle(K, M, N, 16), dot(M), dot(K), dot(N), dot(P2),
    L(M, 'M', -4, -14), L(K, 'K', -14, 30), L(N, 'N', 0, 32), L(P2, 'P', 6, 32)])
}

// ── lưới ô vuông (đề cho lưới) — hàm dùng chung
const lat = (cols, rows, c, ox = 0, oy = 0) => {
  let s = ''
  for (let i = 0; i <= cols; i++) s += `<line x1="${ox + i * c}" y1="${oy}" x2="${ox + i * c}" y2="${oy + rows * c}" stroke="#bdbdbd" stroke-width="1"/>`
  for (let j = 0; j <= rows; j++) s += `<line x1="${ox}" y1="${oy + j * c}" x2="${ox + cols * c}" y2="${oy + j * c}" stroke="#bdbdbd" stroke-width="1"/>`
  return s
}
// ── 644: ABC, DEG, HIK trên lưới 20×6; đáy 4/3/2 ô, cao 4 ô
{
  const c = 26, G = (x, y) => P(x * c, y * c)
  const B = G(1, 5), C = G(5, 5), A = G(2, 1)
  const E = G(10, 5), Gg = G(13, 5), D = G(8, 1)
  const I = G(16, 5), K = G(18, 5), H = G(16, 1)
  ok('644: ABC đáy 4 ô, cao 4 ô', eq(C.x - B.x, 4 * c) && eq(B.y - A.y, 4 * c))
  ok('644: DEG đáy 3 ô, cao 4 ô, D lệch ngoài đáy', eq(Gg.x - E.x, 3 * c) && eq(E.y - D.y, 4 * c) && D.x < E.x)
  ok('644: HIK đáy 2 ô, cao 4 ô, vuông tại I', eq(K.x - I.x, 2 * c) && eq(I.y - H.y, 4 * c) && H.x === I.x)
  const tri = (a, b, d) => seg(a, b) + seg(b, d) + seg(d, a)
  hinh('T105000000644', [G(0, 0), G(20, 6)], [lat(20, 6, c), tri(A, B, C), tri(D, E, Gg), tri(H, I, K),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(Gg), dot(H), dot(I), dot(K),
    L(A, 'A', 0, -12), L(B, 'B', -14, 24), L(C, 'C', 14, 24), L(D, 'D', -2, -12), L(E, 'E', -2, 26), L(Gg, 'G', 12, 26),
    L(H, 'H', 0, -12), L(I, 'I', -14, 26), L(K, 'K', 14, 26)], { pad: 20, padDuoi: 40 })
}
// ── 658: HAN, SGN, HUI trên lưới 13×5; HAN đáy 4 cao 3; SGN đáy 1 cao 3; HUI đáy UI 3 cao 3
{
  const c = 36, G = (x, y) => P(x * c, y * c)
  const H1 = G(1, 1), A = G(5, 1), N1 = G(3, 4)
  const S = G(6, 1), G2 = G(7, 1), N2 = G(8, 4)
  const U = G(9, 1), I = G(9, 4), H2 = G(12, 2)
  ok('658: HAN đáy 4, cao 3', eq(A.x - H1.x, 4 * c) && eq(N1.y - H1.y, 3 * c))
  ok('658: SGN đáy 1, cao 3', eq(G2.x - S.x, c) && eq(N2.y - S.y, 3 * c))
  ok('658: HUI đáy UI 3, cao (H tới UI) 3', eq(I.y - U.y, 3 * c) && eq(H2.x - U.x, 3 * c))
  const tri = (a, b, d) => seg(a, b) + seg(b, d) + seg(d, a)
  hinh('T105000000658', [G(0, 0), G(13, 5)], [lat(13, 5, c), tri(H1, A, N1), tri(S, G2, N2), tri(H2, U, I),
    dot(H1), dot(A), dot(N1), dot(S), dot(G2), dot(N2), dot(U), dot(I), dot(H2),
    L(H1, 'H', -12, -12), L(A, 'A', 6, -12), L(N1, 'N', 0, 28), L(S, 'S', -8, -12), L(G2, 'G', 10, -12), L(N2, 'N', -2, 28),
    L(U, 'U', 0, -12), L(I, 'I', 14, 28), L(H2, 'H', 16, 8)], { pad: 24, padDuoi: 40 })
}
// ── 667: hình chữ nhật ABCD, E ∈ AB ở 3 vị trí; a = AD, b = DC; tô tam giác ECD
{
  const W = 170, Hh = 95, gap = 44
  const parts = []
  const pts = []
  const lab = (t) => `<tspan font-style="italic">${t}</tspan>`
  ;[0.41, 0.15, 0.85].forEach((te, i) => {
    const ox = i * (W + gap)
    const A = P(ox, 0), B = P(ox + W, 0), C = P(ox + W, Hh), D = P(ox, Hh), E = P(ox + W * te, 0)
    ok(`667: hình ${i + 1}: E ∈ AB`, E.y === A.y && E.x > A.x && E.x < B.x)
    pts.push(A, B, C, D)
    parts.push(fill([A, B, C, D], '#fbe0c3'), fill([E, C, D], '#c5e6cc'),
      seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(E, D), seg(E, C), dot(E),
      L(A, 'A', -4, -12), L(B, 'B', 4, -12), L(E, 'E', 0, -12), L(D, 'D', -6, 30), L(C, 'C', 8, 30))
    if (i === 0) {
      parts.push(`<text x="${ox - 8}" y="${Hh / 2 + 8}" text-anchor="end" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="22">${lab('a')} cm</text>`)
      parts.push(`<text x="${ox + W / 2}" y="${Hh + 30}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="22">${lab('b')} cm</text>`)
    }
  })
  pts.push(P(-58, 0))
  hinh('T105000000667', pts, parts, { pad: 34, padDuoi: 60 })
}
await xuatTat(dir)
