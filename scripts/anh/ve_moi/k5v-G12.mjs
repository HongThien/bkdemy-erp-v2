// k5v-G12.mjs — Toán 5, "Diện tích các hình" (10 hình: lưới tam giác, tam giác vuông, trung điểm, tam giác vuông + đường tròn, HCN + H trên AB)
//   node scripts/anh/ve_moi/k5v-G12.mjs "<thu_muc_goi>\moi"
import { writeFileSync } from 'node:fs'
import { P, seg, hinh, xuatTat, mid, dist, dot, label, num, labelOut, sideText, rightAngle, circle, fill, poly, trongTam, goc } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G12.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const f = (n) => Math.round(n * 100) / 100
const halo = (p, t, dx = 0, dy = 0, italic = true) =>
  `<text x="${f(p.x + dx)}" y="${f(p.y + dy)}" text-anchor="middle" fill="#111" stroke="#fff" stroke-width="5" paint-order="stroke" font-family="'Times New Roman',Times,serif" ${italic ? 'font-style="italic"' : ''} font-size="26">${t}</text>`

// ───── 779: lưới ô vuông, tam giác MNP ─────
{
  const c = 45, G = (i, j) => P(i * c, (8 - j) * c)
  const M = G(1, 1), Pp = G(6, 1), N = G(2, 7)
  ok('MP = 5 ô nằm ngang', near(dist(M, Pp), 5 * c) && M.y === Pp.y)
  ok('chiều cao N→MP = 6 ô', near(M.y - N.y, 6 * c))
  ok('MN xiên, không vuông', N.x !== M.x)
  let g = ''
  for (let k = 0; k <= 8; k++) g += `<line x1="${k * c}" y1="0" x2="${k * c}" y2="${8 * c}" stroke="#c5c9d3" stroke-width="1.5"/><line x1="0" y1="${k * c}" x2="${8 * c}" y2="${k * c}" stroke="#c5c9d3" stroke-width="1.5"/>`
  hinh('T105000000779', [P(0, 0), P(8 * c, 8 * c)], [g, seg(M, Pp), seg(Pp, N), seg(N, M), halo(N, 'N', 0, -12), halo(M, 'M', -18, 26), halo(Pp, 'P', 18, 26)], { pad: 20, padDuoi: 20 })
}

// ───── 791: tam giác vuông tại N, MN = 1,5 dm (đứng), NP = 3,2 dm (ngang) ─────
{
  const s = 80
  const N = P(0, 0), Pp = P(3.2 * s, 0), M = P(0, -1.5 * s)
  ok('NP = 3,2 / MN = 1,5 theo tỉ lệ', near(dist(N, Pp) / dist(N, M), 3.2 / 1.5))
  ok('vuông tại N', near(goc(N, M, Pp), 90, 1e-6))
  hinh('T105000000791', [N, Pp, M, P(-70, 0)], [seg(M, N), seg(N, Pp), seg(Pp, M), rightAngle(N, M, Pp, 16),
    label(M, 'M', 0, -14), label(N, 'N', -20, 24), label(Pp, 'P', 20, 24),
    num(mid(M, N), '1,5 dm', -42, 8), num(mid(N, Pp), '3,2 dm', 0, 32)])
}

// ───── 800: tam giác ABC, M trung điểm BC (không đánh dấu) ─────
{
  const B = P(0, 0), C = P(320, 0), M = mid(B, C), A = P(105, -185)
  ok('M trung điểm BC', near(dist(B, M), dist(M, C)))
  ok('tam giác nhọn lệch (AB≠AC)', dist(A, B) < dist(A, C) - 30 && goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  hinh('T105000000800', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, M), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -18, 22), label(C, 'C', 18, 22), label(M, 'M', 0, 30)])
}

// ───── 809: tam giác ABC, M trung điểm AC, nối BM ─────
{
  const B = P(0, 0), C = P(360, 0), A = P(110, -200), M = mid(A, C)
  ok('M trung điểm AC', near(dist(A, M), dist(M, C)))
  ok('tam giác nhọn lệch', dist(B, A) < dist(B, C) && goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90 && Math.abs(dist(A, B) - dist(A, C)) > 30)
  hinh('T105000000809', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(B, M), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -18, 22), label(C, 'C', 18, 22), label(M, 'M', 20, -6)])
}

// ───── 807 / 816: tam giác vuông ABC (vuông tại A) + hình tròn đường kính BC tâm O ─────
function tamGiacTron(ten, ab, ac, bc, don, s) {
  const A = P(0, 0), C = P(ac * s, 0), B = P(0, -ab * s), O = mid(B, C), r = bc * s / 2
  ok(`${ten}: AB²+AC²=BC²`, near(ab * ab + ac * ac, bc * bc))
  ok(`${ten}: vuông tại A`, near(goc(A, B, C), 90, 1e-6))
  ok(`${ten}: |AB|:|AC|:|BC| đúng tỉ lệ`, near(dist(A, B), ab * s) && near(dist(A, C), ac * s) && near(dist(B, C), bc * s))
  ok(`${ten}: A, B, C nằm trên đường tròn tâm O`, near(dist(O, A), r) && near(dist(O, B), r) && near(dist(O, C), r))
  const pts = [P(O.x - r, O.y - r), P(O.x + r, O.y + r)]
  hinh(ten, pts, [seg(A, B), seg(A, C), seg(B, C), circle(O, r), dot(O), rightAngle(A, C, B, 16),
    label(A, 'A', -18, 20), label(B, 'B', -4, -16), label(C, 'C', 22, 18), label(O, 'O', 6, 28),
    num(P(0, -ab * s / 2), `${ab} ${don}`, 36, 8), num(P(ac * s / 2, 0), `${ac} ${don}`, 0, -12),
    num(P(O.x + 46, O.y - 14), `${bc} ${don}`, 0, 0)], { pad: 44, padDuoi: 44 })
}
tamGiacTron('T105000000807', 6, 8, 10, 'cm', 30)
tamGiacTron('T105000000816', 9, 12, 15, 'dm', 20)

// ───── 949–952: HCN ABCD, H trên AB, tô tam giác HDC ─────
const hcn = (ten, dai, dtich, tH) => {
  const rong = dtich / dai, L = 300, h = L * rong / dai
  const A = P(0, 0), B = P(L, 0), C = P(L, h), D = P(0, h), H = P(L * tH, 0)
  ok(`${ten}: rộng = ${rong}`, near(rong * dai, dtich))
  ok(`${ten}: dài/rộng đúng tỉ lệ`, near(L / h, dai / rong, 1e-6))
  ok(`${ten}: H trong AB, không phải trung điểm`, tH > 0.1 && tH < 0.9 && Math.abs(tH - 0.5) > 0.1)
  hinh(ten, [A, B, C, D], [fill([H, D, C]), seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(H, D), seg(H, C),
    dot(A), dot(B), dot(C), dot(D), dot(H),
    label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 16, 28), label(D, 'D', -16, 28), label(H, 'H', 0, -14)])
}
hcn('T105000000949', 6, 19.2, 0.36)
hcn('T105000000950', 8, 26, 0.62)
hcn('T105000000951', 4, 10.8, 0.28)
hcn('T105000000952', 7, 24.5, 0.7)

await xuatTat(dir)

const bc = [
  ['T105000000779', 'Lưới 8×8 ô, M(1,1) P(6,1) N(2,7): MP = 5 ô, cao 6 ô; tam giác nét đen, lưới xám nhạt'],
  ['T105000000791', 'Vuông tại N, N góc dưới trái, MN đứng 1,5 dm, NP ngang 3,2 dm, đúng tỉ lệ'],
  ['T105000000800', 'ABC nhọn lệch, A trên, BC ngang, M trung điểm BC, nối AM, không đánh dấu bằng nhau (như ảnh cũ)'],
  ['T105000000807', 'Vuông tại A (A dưới trái, AC ngang, B trên), đường tròn đường kính BC tâm O; 6/8/10 cm'],
  ['T105000000809', 'ABC nhọn lệch, A trên, BC ngang, M trung điểm AC, nối BM, không đánh dấu'],
  ['T105000000816', 'Như 807 với 9/12/15 dm'],
  ['T105000000949', 'HCN dài 6, rộng 3,2 (tỉ lệ thật), H trên AB (0,36), tô tam giác HDC như ảnh cũ, không ghi số'],
  ['T105000000950', 'HCN dài 8, rộng 3,25 (tỉ lệ thật), H = 0,62 AB'],
  ['T105000000951', 'HCN dài 4, rộng 2,7 (tỉ lệ thật), H = 0,28 AB'],
  ['T105000000952', 'HCN dài 7, rộng 3,5 (tỉ lệ thật), H = 0,70 AB'],
].map(([ma_cau, ghi_chu]) => ({ ma_cau, ghi_chu }))
const par = dir.replace(/[\\/]moi$/, '')
writeFileSync(`${par}/bao-cao.json`, JSON.stringify(bc, null, 1))
writeFileSync(`${par}/khong-ve.json`, '[]')
