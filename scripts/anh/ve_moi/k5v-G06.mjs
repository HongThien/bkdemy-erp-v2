// k5v-G06.mjs — Toán 5, "Diện tích các hình" / Xác định đường cao hình tam giác: vẽ lại 10 hình đề (lưới ô vuông + tam giác).
//   node scripts/anh/ve_moi/k5v-G06.mjs "<OUT>"
import { P, seg, segDash, label, num, rightAngle, foot, dist, goc, dot, svgDoc, T, luu, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G06.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e
const GRID = '#c8cad4'

// lưới cols×rows ô, cạnh c, gốc (ox,oy)
const grid = (cols, rows, c, ox, oy) => {
  let s = `<g stroke="${GRID}" stroke-width="1" stroke-linecap="butt">`
  for (let i = 0; i <= cols; i++) s += seg(P(ox + i * c, oy), P(ox + i * c, oy + rows * c))
  for (let j = 0; j <= rows; j++) s += seg(P(ox, oy + j * c), P(ox + cols * c, oy + j * c))
  return s + '</g>'
}
const poly3 = (a, b, c) => seg(a, b) + seg(b, c) + seg(c, a)

// ───────── 721: ba tam giác HAN, SGN, HUI trên lưới (không vẽ đường cao) ─────────
{
  const c = 40, ox = 10, oy = 10, cols = 14, rows = 5
  const g = (col, row) => P(ox + col * c, oy + row * c)
  const H = g(1, 1), A = g(5, 1), N1 = g(3, 4)
  const S = g(6, 1), G = g(7, 1), N2 = g(8, 4)
  const U = g(9, 1), I = g(9, 4), H2 = g(12, 2)
  ok('HA ngang 4 ô', near(H.y, A.y) && near(dist(H, A), 4 * c))
  ok('SG ngang, N2 lệch phải G (tù tại G)', near(S.y, G.y) && goc(G, S, N2) > 90)
  ok('UI đứng', near(U.x, I.x))
  ok('HAN nhọn', goc(H, A, N1) < 90 && goc(A, H, N1) < 90 && goc(N1, H, A) < 90)
  const body = grid(cols, rows, c, ox, oy)
    + poly3(H, A, N1) + poly3(S, G, N2) + poly3(U, I, H2)
    + label(H, 'H', -16, -10) + label(A, 'A', -6, -10) + label(N1, 'N', 0, 30)
    + label(S, 'S', 0, -10) + label(G, 'G', 10, -10) + label(N2, 'N', 6, 30)
    + label(U, 'U', 0, -12) + label(I, 'I', 0, 30) + label(H2, 'H', 20, 8)
  await luu(dir, 'T105000000721', cols * c + 2 * ox, rows * c + 2 * oy, svgDoc(cols * c + 2 * ox, rows * c + 2 * oy, body))
}

// ───────── 723: mẫu tam giác ABC vuông tại A, AH, HN, HM (giả thiết đề) ─────────
{
  const c = 44, ox = 14, oy = 14, cols = 7, rows = 7
  const g = (col, row) => P(ox + col * c, oy + row * c)
  const A = g(1, 6), B = g(1, 1), C = g(6, 6)
  const H = P((B.x + C.x) / 2, (B.y + C.y) / 2)
  const N = P(A.x, H.y), M = P(H.x, A.y)
  ok('AB = AC = 5 ô', near(dist(A, B), 5 * c) && near(dist(A, C), 5 * c))
  ok('H trung điểm BC, AH ⟂ BC', near(goc(H, A, B), 90) && near(goc(H, A, C), 90))
  ok('HN ⟂ AB, HM ⟂ AC', near(N.x, A.x) && near(M.y, A.y) && near(goc(N, A, H), 90) && near(goc(M, A, H), 90))
  const body = grid(cols, rows, c, ox, oy)
    + poly3(A, B, C) + seg(A, H) + seg(H, N) + seg(H, M)
    + rightAngle(N, A, H, 11) + rightAngle(M, C, H, 11) + rightAngle(H, N, M, 11)
    + label(A, 'A', -16, 18) + label(B, 'B', 0, -10) + label(C, 'C', 16, 18)
    + label(H, 'H', 20, 0) + label(N, 'N', -16, 8) + label(M, 'M', 0, 28)
  const w = cols * c + 2 * ox, h = rows * c + 2 * oy
  await luu(dir, 'T105000000723', w, h, svgDoc(w, h, body))
}

// ───────── 739: ABC có AH ⟂ BC, MNP có NQ ⟂ MP, DGE vuông tại G ─────────
{
  const S = 0.55
  const p = (x, y) => P(x * S, y * S)
  const B = p(33, 240), C = p(365, 240), A = p(118, 70), H = P(A.x, B.y)
  const M = p(450, 38), Nn = p(535, 238), Pp = p(870, 238)
  const Q = foot(Nn, M, Pp)
  const D = p(1013, 65), Gg = p(1013, 232), E = p(1265, 232)
  ok('H trên BC, AH ⟂ BC', H.x > B.x && H.x < C.x && near(goc(H, A, C), 90))
  ok('Q trong đoạn MP, NQ ⟂ MP', near(goc(Q, Nn, Pp), 90) && dist(Q, M) + dist(Q, Pp) - dist(M, Pp) < 1e-6)
  ok('DGE vuông tại G', near(goc(Gg, D, E), 90))
  ok('ABC nhọn thường', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90 && Math.abs(dist(A, B) - dist(A, C)) > 20)
  const body = poly3(A, B, C) + seg(A, H) + rightAngle(H, A, C, 11)
    + label(A, 'A', 0, -12) + label(B, 'B', -14, 18) + label(C, 'C', 16, 18) + label(H, 'H', 0, 30)
    + poly3(M, Nn, Pp) + seg(Nn, Q) + rightAngle(Q, Nn, Pp, 11)
    + label(M, 'M', -14, -6) + label(Nn, 'N', -8, 30) + label(Pp, 'P', 16, 18) + label(Q, 'Q', 6, -12)
    + poly3(D, Gg, E) + rightAngle(Gg, D, E, 12)
    + label(D, 'D', -14, -6) + label(Gg, 'G', -10, 30) + label(E, 'E', 18, 18)
  hinh('T105000000739', [A, B, C, M, Nn, Pp, D, Gg, E], body, { pad: 36, padDuoi: 56 })
}

// ───────── 749: ABC, BCM, KBC trên lưới, đáy BC ─────────
{
  const c = 26, ox = 10, oy = 20, cols = 28, rows = 9
  const g = (col, row) => P(ox + col * c, oy + row * c)
  const A1 = g(3, 1), B1 = g(1, 7), C1 = g(7, 7)
  const B2 = g(10, 1), C2 = g(16, 1), M2 = g(18, 5)
  const K3 = g(20, 1), B3 = g(27, 1), C3 = g(27, 6)
  ok('BC ngang 6 ô (ABC, BCM)', near(dist(B1, C1), 6 * c) && near(dist(B2, C2), 6 * c))
  ok('BCM tù tại C', goc(C2, B2, M2) > 90)
  ok('ABC nhọn tại B, C', goc(B1, A1, C1) < 90 && goc(C1, A1, B1) < 90)
  ok('KBC vuông tại B', near(goc(B3, K3, C3), 90))
  const body = grid(cols, rows, c, ox, oy)
    + poly3(A1, B1, C1) + poly3(B2, C2, M2) + poly3(K3, B3, C3)
    + label(A1, 'A', 0, -10) + label(B1, 'B', -14, 22) + label(C1, 'C', 14, 22)
    + label(B2, 'B', -14, -8) + label(C2, 'C', 14, -8) + label(M2, 'M', 14, 22)
    + label(K3, 'K', -14, -8) + label(B3, 'B', 14, -8) + label(C3, 'C', 14, 22)
  const w = cols * c + 2 * ox, h = rows * c + 2 * oy
  await luu(dir, 'T105000000749', w, h, svgDoc(w, h, body))
}

// ───────── 765: MNP, IMN, KMN (đáy MN) ─────────
{
  const S = 0.55
  const p = (x, y) => P(x * S, y * S)
  const M1 = p(60, 268), N1 = p(285, 268), P1 = p(243, 30)
  const M2 = p(650, 90), N2 = p(888, 90), I2 = p(535, 270)
  const K3 = p(1028, 278), M3 = p(1255, 278), N3 = p(1255, 50)
  ok('MNP nhọn, lệch', goc(M1, N1, P1) < 90 && goc(N1, M1, P1) < 90 && goc(P1, M1, N1) < 90 && Math.abs(dist(M1, P1) - dist(N1, P1)) > 20)
  ok('IMN tù tại M', goc(M2, N2, I2) > 90)
  ok('KMN vuông tại M', near(goc(M3, K3, N3), 90))
  const body = poly3(M1, N1, P1) + poly3(M2, N2, I2) + poly3(K3, M3, N3)
    + label(P1, 'P', 0, -10) + label(M1, 'M', -14, 22) + label(N1, 'N', 14, 22)
    + label(M2, 'M', -6, -10) + label(N2, 'N', 14, -8) + label(I2, 'I', -12, 22)
    + label(N3, 'N', 0, -12) + label(K3, 'K', -14, 22) + label(M3, 'M', 14, 22)
  hinh('T105000000765', [M1, N1, P1, M2, N2, I2, K3, M3, N3], body, { pad: 36, padDuoi: 56 })
}

// ───────── 775: ba tam giác không tên ─────────
{
  const S = 0.55
  const p = (x, y) => P(x * S, y * S)
  const a1 = p(35, 228), b1 = p(395, 228), c1 = p(112, 38)
  const a2 = p(530, 224), b2 = p(860, 224), c2 = p(452, 5)
  const a3 = p(960, 5), b3 = p(960, 290), c3 = p(1265, 100)
  ok('T1 nhọn', goc(a1, b1, c1) < 90 && goc(b1, a1, c1) < 90 && goc(c1, a1, b1) < 90)
  ok('T2 tù tại a2', goc(a2, b2, c2) > 90)
  ok('T3 nhọn thường (không cân)', goc(a3, b3, c3) < 90 && goc(b3, a3, c3) < 90 && goc(c3, a3, b3) < 90 && Math.abs(dist(a3, c3) - dist(b3, c3)) > 20)
  hinh('T105000000775', [a1, b1, c1, a2, b2, c2, a3, b3, c3], poly3(a1, b1, c1) + poly3(a2, b2, c2) + poly3(a3, b3, c3), { pad: 30, padDuoi: 40 })
}

// ───────── 959–962: tam giác trên lưới 12×10 ô (cạnh 40) ─────────
const lung = async (ten, v, ten3, extra) => {
  const c = 40, cols = 12, rows = 10
  const g = (col, row) => P(col * c, row * c)
  const [pa, pb, pc] = v.map(([x, y]) => g(x, y))
  const w = cols * c, h = rows * c
  let body = grid(cols, rows, c, 0, 0) + poly3(pa, pb, pc) + dot(pa) + dot(pb) + dot(pc)
  body += extra(g, pa, pb, pc, ten3)
  await luu(dir, ten, w, h, svgDoc(w, h, body))
}
// 959: ABC, BC 7 ô ngang, A cách B 2 ô ngang, cao 5 ô
await lung('T105000000959', [[4, 2], [2, 7], [9, 7]], 'ABC', (g, A, B, C) => {
  ok('959: BC = 7 ô, A cao 5 ô, lệch B 2 ô', near(dist(B, C), 7 * 40) && near(B.y - A.y, 5 * 40) && near(A.x - B.x, 2 * 40))
  ok('959: nhọn', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  return label(A, 'A', 0, -16) + label(B, 'B', -20, 28) + label(C, 'C', 20, 28)
})
// 960: DEG, EG 5 ô ngang, D cách E 3 ô ngang (D bên trái E), cao 5 ô; tù tại E
await lung('T105000000960', [[2, 2], [5, 7], [10, 7]], 'DEG', (g, D, E, G) => {
  ok('960: EG = 5 ô, D cao 5 ô, lệch E 3 ô', near(dist(E, G), 5 * 40) && near(E.y - D.y, 5 * 40) && near(E.x - D.x, 3 * 40))
  ok('960: tù tại E', goc(E, D, G) > 90)
  return label(D, 'D', -16, -12) + label(E, 'E', 0, 32) + label(G, 'G', 20, 28)
})
// 961: MNP vuông tại N, NP 7 ô, MN 5 ô
await lung('T105000000961', [[2, 2], [2, 7], [9, 7]], 'MNP', (g, M, N, Pp) => {
  ok('961: vuông tại N, NP = 7 ô, MN = 5 ô', near(goc(N, M, Pp), 90) && near(dist(N, Pp), 7 * 40) && near(dist(M, N), 5 * 40))
  return rightAngle(N, M, Pp, 14) + label(M, 'M', -14, -12) + label(N, 'N', -18, 30) + label(Pp, 'P', 20, 28)
})
// 962: IKL, KL đứng 7 ô, I cách KL 6 ô, I ở hàng cách K 4 ô
await lung('T105000000962', [[2, 5], [8, 1], [8, 8]], 'IKL', (g, I, K, L) => {
  ok('962: KL đứng 7 ô, I cách KL 6 ô, I cách K 4 ô theo hàng', near(K.x, L.x) && near(dist(K, L), 7 * 40) && near(K.x - I.x, 6 * 40) && near(I.y - K.y, 4 * 40))
  ok('962: nhọn', goc(I, K, L) < 90 && goc(K, I, L) < 90 && goc(L, I, K) < 90)
  return label(I, 'I', -20, 8) + label(K, 'K', 20, -4) + label(L, 'L', 20, 28)
})
await xuatTat(dir)
