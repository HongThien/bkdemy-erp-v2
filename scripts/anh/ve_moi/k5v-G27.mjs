// k5v-G27.mjs — vẽ lại 10 hình K5 "Diện tích các hình" (gói G27)
//   node scripts/anh/ve_moi/k5v-G27.mjs "<thu_muc_moi>"
import { P, seg, segDash, hinh, xuatTat, dot, label, num, rightAngle, circle, dist, foot } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G27.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e

// ───── T105100408006: mảnh đất ABCD, AD=64, AE=72, BE=26, GC=30 (E ∈ BG, AE ⟂ BG, G ∈ DC, BG ⟂ DC)
{
  const s = 3.1
  const D = P(0, 0), G = P(72 * s, 0), C = P(102 * s, 0)
  const A = P(0, -64 * s), E = P(72 * s, -64 * s), B = P(72 * s, -90 * s)
  ok('AD = 64 (đơn vị)', near(dist(A, D) / s, 64))
  ok('AE = 72', near(dist(A, E) / s, 72))
  ok('BE = 26', near(dist(B, E) / s, 26))
  ok('GC = 30', near(dist(G, C) / s, 30))
  ok('EG = AD = 64, BG = 90', near(dist(E, G) / s, 64) && near(dist(B, G) / s, 90))
  ok('AE ⟂ BG, BG ⟂ DC', near(E.y, A.y) && near(B.x, G.x) && near(G.y, C.y))
  hinh('T105100408006', [A, B, C, D, E, G, P(-62, -100)], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    segDash(A, E), segDash(B, G),
    rightAngle(E, A, B, 13), rightAngle(G, E, C, 13),
    dot(E), dot(G),
    label(A, 'A', -18, -4), label(B, 'B', 0, -14), label(C, 'C', 16, 26), label(D, 'D', -16, 26),
    label(E, 'E', -18, 28), label(G, 'G', -2, 30),
    num(P((A.x + D.x) / 2, (A.y + D.y) / 2), '64 m', -38, 8),
    num(P((A.x + E.x) / 2, A.y), '72 m', 0, -10),
    num(P(E.x, (B.y + E.y) / 2), '26 m', -32, 8),
    num(P((G.x + C.x) / 2, G.y), '30 m', 0, 24),
  ], { pad: 52, padDuoi: 60 })
}

// ───── T105100408013: hình vuông ABCD cạnh 8 cm, đường tròn tâm O nội tiếp, tô xanh phần ngoài tròn
{
  const S = 240, r = S / 2
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S), O = P(S / 2, S / 2)
  ok('r = AB/2 (tiếp xúc 4 cạnh)', near(r * 2, dist(A, B)) && near(O.x, r) && near(O.y, r))
  const fillPath = `<path fill-rule="evenodd" d="M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} L ${D.x} ${D.y} Z M ${O.x - r} ${O.y} A ${r} ${r} 0 1 0 ${O.x + r} ${O.y} A ${r} ${r} 0 1 0 ${O.x - r} ${O.y} Z" fill="#a9ddf5" stroke="none"/>`
  hinh('T105100408013', [A, B, C, D], [
    fillPath, seg(A, B), seg(B, C), seg(C, D), seg(D, A), circle(O, r), dot(O),
    label(A, 'A', -16, -8), label(B, 'B', 16, -8), label(C, 'C', 16, 26), label(D, 'D', -16, 26),
    label(O, 'O', 0, 26),
    num(P(S / 2, 0), '8 cm', 0, -12),
  ], { pad: 52, padDuoi: 60 })
}

// ───── Tam giác biết diện tích, tìm đáy: apex trên, đáy ngang, chân đường cao H trong đáy; tam giác nhọn, lệch
const TG = [
  // ma, đỉnh, trái, phải, L, tỉ lệ chân, h, ghi số "9 dm"
  ['T105000000785', 'M', 'N', 'P', 340, 0.42, 190, '9 dm'],
  ['T105000000909', 'D', 'E', 'G', 370, 0.30, 200, null],
  ['T105000000910', 'M', 'N', 'P', 360, 0.62, 200, null],
  ['T105000000933', 'D', 'E', 'G', 350, 0.33, 190, null],
  ['T105000000934', 'M', 'N', 'P', 350, 0.38, 205, null],
  ['T105000000935', 'D', 'E', 'G', 340, 0.68, 185, null],
  ['T105000000936', 'M', 'N', 'P', 360, 0.72, 190, null],
  ['T105000000937', 'D', 'E', 'G', 350, 0.18, 185, null],
]
for (const [ma, ap, tr, ph, L, k, h, so] of TG) {
  const X = P(0, 0), Y = P(L, 0), Hh = P(L * k, 0), M = P(L * k, -h)
  ok(`${ma}: nhọn (chân trong đáy, h² > x·(L−x))`, k > 0.05 && k < 0.95 && h * h > Hh.x * (L - Hh.x))
  ok(`${ma}: không cân`, Math.abs(dist(M, X) - dist(M, Y)) > 25)
  ok(`${ma}: MH ⟂ đáy`, near(foot(M, X, Y).x, Hh.x))
  const hasH = !so
  const sang = k < 0.5 ? 1 : -1 // ô vuông + số về phía cạnh dài
  const body = [
    seg(X, Y), seg(Y, M), seg(M, X), segDash(M, Hh),
    rightAngle(Hh, M, sang > 0 ? Y : X, 14),
    label(M, ap, 0, -14), label(X, tr, -6, 28), label(Y, ph, 6, 28),
  ]
  if (hasH) body.push(label(Hh, ap === 'M' ? 'H' : 'H', 0, 28))
  if (so) body.push(num(P(Hh.x + sang * 34, -h / 2), so, 0, 8))
  hinh(ma, [X, Y, M], body, { pad: 48, padDuoi: 58 })
}
await xuatTat(dir)
