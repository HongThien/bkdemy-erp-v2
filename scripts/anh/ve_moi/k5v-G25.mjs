// k5v-G25.mjs — Toán 5, "Diện tích các hình": vẽ lại 10 hình (gói G25).
//   node scripts/anh/ve_moi/k5v-G25.mjs "<thu_muc_moi>"
import { P, seg, tick, rightAngle, dot, label, num, sideText, mid, dist, fill, poly, circle, hinh, xuatTat, lerp } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G25.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e
const f = (n) => Math.round(n * 100) / 100
const txt = (x, y, s, size = 22, anchor = 'middle') =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="${size}">${s}</text>`
const segDashed = (a, b) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke-dasharray="7 6"/>`
// thanh đo có gạch chặn hai đầu
function thanh(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy), nx = -dy / l * 7, ny = dx / l * 7
  return seg(a, b) + seg(P(a.x - nx, a.y - ny), P(a.x + nx, a.y + ny)) + seg(P(b.x - nx, b.y - ny), P(b.x + nx, b.y + ny))
}

// ───────── 751: mảnh đất ABCD, 20 px/m ─────────
{
  const u = 18
  const A = P(0, 0), G = P(10 * u, 0), D = P(14 * u, 0)
  const B = P(0, -10 * u), C = P(10 * u, -14 * u), E = P(10 * u, -10 * u)
  ok('751 AB=10 BE=10 CG=14 GD=4', near(dist(A, B), 10 * u) && near(dist(B, E), 10 * u) && near(dist(C, G), 14 * u) && near(dist(G, D), 4 * u))
  ok('751 AG=BE (ABEG chữ nhật)', near(dist(A, G), dist(B, E)))
  const cen = P(150, -140)
  hinh('T105000000751', [A, D, B, C, P(-50, 0), P(10 * u, 30)], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    segDashed(B, E), segDashed(C, G),
    rightAngle(A, B, G), rightAngle(G, A, C), rightAngle(E, B, G, 12),
    label(A, 'A', -20, 26), label(B, 'B', -20, 6), label(C, 'C', 0, -14), label(D, 'D', 16, 26), label(G, 'G', -2, 26), label(E, 'E', -16, -12),
    sideText(A, B, '10 m', cen, 30), sideText(B, E, '10 m', P(100, -250), 22),
    sideText(E, G, '14 m', P(340, -100), 36),
    sideText(G, D, '4 m', P(240, -80), -28),
  ], { pad: 50, padDuoi: 64 })
}

// ───────── 752: cánh diều ABDC, AD ⟂ BC tại I, AD=60, BC=40, I trung điểm BC ─────────
{
  const k = 4.2 // px/cm
  const I = P(0, 0)
  const A = P(0, -20 * k), D = P(0, 40 * k) // AI=20, ID=40 (đề không cho vị trí I trên AD)
  const B = P(-20 * k, 0), C = P(20 * k, 0)
  ok('752 AD=60 cm', near(dist(A, D) / k, 60))
  ok('752 BC=40 cm, I trung điểm', near(dist(B, C) / k, 40) && near(dist(B, I), dist(I, C)))
  ok('752 không phải hình thoi (AI≠ID)', !near(dist(A, I), dist(I, D)))
  hinh('T105000000752', [A, B, C, D], [
    seg(A, B), seg(B, D), seg(D, C), seg(C, A), seg(A, D), seg(B, C),
    rightAngle(I, C, A, 14), tick(B, I, 1), tick(I, C, 1),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 20, 8), label(D, 'D', 0, 30), label(I, 'I', -16, 24),
  ])
}

// ───────── 755: tam giác ABC vuông tại A, AB=3, AC=4, đường tròn tâm O bán kính 1 (nội tiếp), 80 px/cm ─────────
{
  const u = 80
  const A = P(0, 0), C = P(4 * u, 0), B = P(0, -3 * u)
  const O = P(1 * u, -1 * u), r = 1 * u
  // khoảng cách O tới 3 cạnh = 1 cm
  const dBC = Math.abs((C.y - B.y) * O.x - (C.x - B.x) * O.y + C.x * B.y - C.y * B.x) / dist(B, C)
  ok('755 r=1 chạm AB, AC, BC', near(O.x, r) && near(-O.y, r) && near(dBC, r, 1e-6))
  const Ar = P(r, -r)
  hinh('T105000000755', [A, B, C, P(-70, -150)], [
    fill([A, C, B], '#b8d8fa'),
    `<circle cx="${O.x}" cy="${O.y}" r="${r}" fill="#fff"/>`,
    seg(A, B), seg(B, C), seg(C, A),
    seg(P(0, O.y), O), dot(O),
    label(A, 'A', -18, 28), label(B, 'B', -4, -14), label(C, 'C', 18, 28), label(O, 'O', 4, 32),
    txt(O.x / 2 + 30, O.y - 10, '1 cm', 22),
    txt(-40, -1.5 * u + 8, '3 cm', 22),
    txt(2 * u, 40, '4 cm', 22),
  ])
}

// ───────── 771: hình thang đáy 11 và 13, cao 2,5, khoét 3 nửa tròn d=3 ở đáy lớn; 32 px/dm ─────────
{
  const u = 28
  const BL = P(0, 0), BR = P(13 * u, 0)
  const TL = P(1 * u, -2.5 * u), TR = P(12 * u, -2.5 * u)
  ok('771 đáy 13, đáy 11, cao 2,5', near(BR.x - BL.x, 13 * u) && near(TR.x - TL.x, 11 * u) && near(-TL.y, 2.5 * u))
  // nửa tròn tại x = 1..4, 5..8, 9..12 (đường kính 3 dm, khe 1 dm giữa chúng và hai đầu)
  const xs = [1, 5, 9].map((x) => x * u), R = 1.5 * u
  ok('771 ba nửa tròn d=3 + 4 khe 1 dm = 13', near(3 * 3 + 4 * 1, 13))
  let path = `M ${BL.x} ${BL.y} L ${TL.x} ${TL.y} L ${TR.x} ${TR.y} L ${BR.x} ${BR.y}`
  for (let i = 2; i >= 0; i--) path += ` L ${xs[i] + 3 * u} 0 A ${R} ${R} 0 0 0 ${xs[i]} 0`
  path += ' Z'
  const yDim = 36
  hinh('T105000000771', [P(-20, -2.5 * u - 38), P(13 * u + 100, 0), P(0, 70)], [
    `<path d="${path}" fill="#7db3f5"/>`,
    thanh(P(1 * u, -2.5 * u - 28), P(12 * u, -2.5 * u - 28)), txt(6.5 * u, -2.5 * u - 38, '11 dm', 20),
    thanh(P(0, yDim), P(13 * u, yDim)), txt(6.5 * u, yDim + 30, '13 dm', 20),
    thanh(P(13 * u + 44, -2.5 * u), P(13 * u + 44, 0)), txt(13 * u + 54, -1.25 * u + 7, '2,5 dm', 20, 'start'),
    thanh(P(xs[0], -12), P(xs[0] + 3 * u, -12)), txt(xs[0] + 1.5 * u, -20, '3 dm', 18),
  ], { pad: 24, padDuoi: 30 })
}

// ───────── 773: lưới ô vuông 1 cm; hình vuông 4×4 + 4 tam giác (đáy 4, cao 3) ─────────
{
  const c = 30, nx = 12, ny = 10
  const X = (i) => i * c, Y = (j) => j * c
  const sq = [P(X(4), Y(3)), P(X(8), Y(3)), P(X(8), Y(7)), P(X(4), Y(7))]
  const top = P(X(6), Y(0)), bot = P(X(6), Y(10)), lef = P(X(1), Y(5)), rig = P(X(11), Y(5))
  const tams = [[sq[0], sq[1], top], [sq[1], sq[2], rig], [sq[2], sq[3], bot], [sq[3], sq[0], lef]]
  ok('773 hình vuông cạnh 4 ô', near(dist(sq[0], sq[1]), 4 * c) && near(dist(sq[1], sq[2]), 4 * c))
  ok('773 4 tam giác đáy 4 cao 3', near(Math.abs(top.y - sq[0].y), 3 * c) && near(Math.abs(rig.x - sq[1].x), 3 * c) && near(Math.abs(bot.y - sq[2].y), 3 * c) && near(Math.abs(lef.x - sq[3].x), 3 * c))
  let grid = ''
  for (let i = 0; i <= nx; i++) grid += `<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${Y(ny)}" stroke="#8a8a8a" stroke-width="1.2"/>`
  for (let j = 0; j <= ny; j++) grid += `<line x1="0" y1="${Y(j)}" x2="${X(nx)}" y2="${Y(j)}" stroke="#8a8a8a" stroke-width="1.2"/>`
  const kb = P(0, Y(ny) + 26)
  hinh('T105000000773', [P(0, 0), P(X(nx), Y(ny)), P(0, Y(ny) + 40)], [
    grid,
    ...tams.map((t) => fill(t, '#7fc0ee')), fill(sq, '#2f6fd6'),
    ...tams.map((t) => poly(t).replace('fill="none"', 'fill="none" stroke-width="1.6"')),
    poly(sq).replace('fill="none"', 'fill="none" stroke-width="1.6"'),
    // thước 1 cm (một ô)
    seg(P(0, Y(ny) + 22), P(c, Y(ny) + 22)),
    `<path d="M 9 ${Y(ny) + 16} L 0 ${Y(ny) + 22} L 9 ${Y(ny) + 28} M ${c - 9} ${Y(ny) + 16} L ${c} ${Y(ny) + 22} L ${c - 9} ${Y(ny) + 28}"/>`,
    txt(c + 12, Y(ny) + 29, '1 cm', 20, 'start'),
  ], { pad: 20, padDuoi: 30 })
}

// ───────── 780: hình tròn tâm O đường kính AB = 8 cm, phần sơn màu (dạng âm–dương); 35 px/cm ─────────
{
  const R = 4 * 35, r = R / 2
  const O = P(0, 0), A = P(0, -R), B = P(0, R)
  const path = `M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R} A ${r} ${r} 0 0 1 0 0 A ${r} ${r} 0 0 0 0 ${-R} Z`
  hinh('T105000000780', [P(-R, -R), P(R, R)], [
    `<path d="${path}" fill="#4aa3e0" stroke="none"/>`,
    circle(O, R), segDashed(A, B),
    `<path d="M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R}"/><path d="M 0 ${R} A ${r} ${r} 0 0 1 0 0"/><path d="M 0 0 A ${r} ${r} 0 0 0 0 ${-R}"/>`,
    label(A, 'A', 0, -12), label(B, 'B', 0, 30), label(O, 'O', -18, -8),
  ])
}

// ───────── 781: hình thang vuông ABCD, AD=12, AB=18, DC=24, K∈DC, KC=5; 16 px/m ─────────
{
  const u = 16
  const D = P(0, 0), A = P(0, -12 * u), B = P(18 * u, -12 * u), C = P(24 * u, 0), K = P(19 * u, 0)
  ok('781 DC = 4/3 AB = 24', near(dist(D, C) / u, 18 * 4 / 3))
  ok('781 KC=5, K giữa D và C', near(dist(K, C) / u, 5) && K.x > D.x && K.x < C.x)
  ok('781 AB ∥ DC, AD ⟂ DC', near(A.y, B.y) && near(D.y, C.y) && near(A.x, D.x))
  const cen = P(150, -90)
  hinh('T105000000781', [A, B, C, D, P(-40, -100)], [
    fill([A, B, C, D], '#d3f5e5'),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, K),
    rightAngle(D, A, C, 14),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(C, 'C', 18, 26), label(D, 'D', -12, 28), label(K, 'K', -6, 30),
    sideText(A, B, '18 m', cen, 24), sideText(A, D, '12 m', cen, 34), sideText(K, C, '5 m', P(300, -60), 28, 22),
  ], { pad: 46, padDuoi: 64 })
}

// ───────── 784: quạt giấy: nửa tròn bán kính 6, bỏ nửa tròn 3 ở giữa; 40 px/cm ─────────
{
  const u = 34, R = 6 * u, r = 3 * u
  const O = P(0, 0)
  let nan = ''
  for (let k = 1; k <= 8; k++) { const a = Math.PI * k / 9; nan += seg(O, P(-r * Math.cos(a), -r * Math.sin(a))) }
  ok('784 8 nan chia nửa tròn nhỏ thành 9 phần 20°', true)
  const yd = 44
  hinh('T105000000784', [P(-R - 40, -R), P(R + 40, 0), P(0, 90)], [
    `<path d="M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0 L ${r} 0 A ${r} ${r} 0 0 0 ${-r} 0 Z" fill="#5b8def" stroke="none"/>`,
    `<path d="M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0"/><path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0"/>`,
    seg(P(-R - 40, 0), P(R + 40, 0)), nan,
    thanh(P(0, yd), P(r, yd)), thanh(P(r, yd), P(R, yd)),
    txt(r / 2, yd + 32, '3 cm', 22), txt((r + R) / 2, yd + 32, '3 cm', 22),
  ], { pad: 20, padDuoi: 60 })
}

// ───────── 788: hình tròn lớn R=10, hai hình tròn nhỏ r=5 xếp dọc theo đường kính; 18 px/cm ─────────
{
  const u = 16, R = 10 * u, r = 5 * u
  const O = P(0, 0), O1 = P(0, -r), O2 = P(0, r)
  ok('788 hai tròn nhỏ tiếp xúc nhau và tiếp xúc trong tròn lớn', near(dist(O1, O2), 2 * r) && near(dist(O, O1), R - r))
  hinh('T105000000788', [P(-R - 120, -R), P(R, R), P(0, R + 20)], [
    `<circle cx="0" cy="0" r="${R}" fill="#6aa8f7"/>`,
    `<circle cx="0" cy="${-r}" r="${r}" fill="#fff"/><circle cx="0" cy="${r}" r="${r}" fill="#fff"/>`,
    circle(O, R), circle(O1, r), circle(O2, r),
    dot(O1), dot(O2), seg(O1, P(r, -r)), txt(r / 2, -r - 10, '5 cm', 22),
    thanh(P(-R - 40, -R), P(-R - 40, 0)), txt(-R - 46, -R / 2 + 8, '10 cm', 22, 'end'),
  ], { pad: 24, padDuoi: 40 })
}

// ───────── 794: biển cấm đi ngược chiều: tròn r=35, chữ nhật trắng 50×12; 5 px/cm ─────────
{
  const u = 5, R = 35 * u, w = 50 * u, h = 12 * u
  ok('794 hình chữ nhật 50×12 nằm trong tròn r=35', Math.hypot(w / 2, h / 2) < R)
  hinh('T105000000794', [P(-R, -R), P(R, R)], [
    `<circle cx="0" cy="0" r="${R}" fill="#ee5a5a"/>`, circle(P(0, 0), R),
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#fff"/>`,
  ], { pad: 24, padDuoi: 24 })
}

await xuatTat(dir)
