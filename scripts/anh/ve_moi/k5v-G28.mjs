// k5v-G28.mjs — vẽ lại 10 hình kho Đại khối 5 "Diện tích các hình" (tam giác tìm đáy + hình khai triển).
//   node scripts/anh/ve_moi/k5v-G28.mjs "<thu_muc_goi>\moi"
import { writeFileSync } from 'node:fs'
import { P, seg, segDash, rightAngle, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'
import { txt, ra } from './k5-HK2-chung.mjs'

const OUT = process.argv[2]
if (!OUT) { console.error('Dùng: node k5v-G28.mjs <thu_muc_moi>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } console.log('✔', t) }
const dotv = (o, a, b) => (a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)
const S = '#222'
const R = (x, y, w, h) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#fff" stroke="${S}" stroke-width="2"/>`
const C = (x, y, r) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" stroke="${S}" stroke-width="2"/>`
const L = (x1, y1, x2, y2, extra = '') => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${S}" stroke-width="2" ${extra}/>`
const PA = (d, fillc = '#fff') => `<path d="${d}" fill="${fillc}" stroke="${S}" stroke-width="2" stroke-linejoin="round"/>`
const lab = (x, y, t, size = 22) => txt(x, y, t, size, 'middle')

// ───── 3 tam giác tìm đáy khi biết diện tích ─────
function tamGiac(ten, top, left, right, hx, tn, tl, tr, th, markTo) {
  const A = top, B = left, Cc = right, H = P(hx, B.y)
  ok(ten + ': đáy ngang', B.y === Cc.y)
  ok(ten + ': MH vuông góc đáy', Math.abs(dotv(H, A, Cc)) < 1e-9 && H.x === A.x)
  ok(ten + ': tam giác nhọn (H nằm trong đáy)', hx > B.x && hx < Cc.x && dotv(A, B, Cc) > 0 && dotv(B, A, Cc) > 0 && dotv(Cc, A, B) > 0)
  const body = [seg(A, B), seg(B, Cc), seg(Cc, A), segDash(A, H), rightAngle(H, markTo === 'L' ? B : Cc, A, 14),
    label(A, tn[0], 0, -14), label(B, tn[1], -10, 34), label(H, th, 0, 34), label(Cc, tn[2], 10, 34)]
  hinh(ten, [A, B, Cc, P(B.x - 16, B.y + 40), P(Cc.x + 16, B.y + 40)], body)
}
tamGiac('T105000000938', P(250, 0), P(0, 190), P(360, 190), 250, ['M', 'N', 'P'], 0, 0, 'H', 'L')
tamGiac('T105000000939', P(78, 0), P(0, 190), P(350, 190), 78, ['D', 'E', 'G'], 0, 0, 'H', 'R')
tamGiac('T105000000940', P(250, 0), P(0, 190), P(360, 190), 250, ['M', 'N', 'P'], 0, 0, 'H', 'L')
await xuatTat(OUT)

// ───── helpers khai triển ─────
const net = (x0, y0, s, rects) => rects.map(([x, y, w, h]) => R(x0 + x * s, y0 + y * s, w * s, h * s)).join('')
const cells = (x0, y0, u, cs) => cs.map(([c, r]) => R(x0 + c * u, y0 + r * u, u, u)).join('')
const cellsW = (cs) => (Math.max(...cs.map((c) => c[0])) + 1)
const cellsH = (cs) => (Math.max(...cs.map((c) => c[1])) + 1)
const cylV = (x, yTop, d, h) => { const r = d / 2, ry = r * 0.34; return PA(`M ${x} ${yTop + ry} L ${x} ${yTop + ry + h} A ${r} ${ry} 0 0 0 ${x + d} ${yTop + ry + h} L ${x + d} ${yTop + ry}`) + `<ellipse cx="${x + r}" cy="${yTop + ry}" rx="${r}" ry="${ry}" fill="#fff" stroke="${S}" stroke-width="2"/>` }
const cylH = (x, yTop, len, d) => { const r = d / 2, rx = r * 0.34; return PA(`M ${x + rx} ${yTop} L ${x + rx + len} ${yTop} A ${rx} ${r} 0 0 1 ${x + rx + len} ${yTop + d} L ${x + rx} ${yTop + d}`) + `<ellipse cx="${x + rx}" cy="${yTop + r}" rx="${rx}" ry="${r}" fill="#fff" stroke="${S}" stroke-width="2"/>` }
// hộp (lập phương/chữ nhật) vẽ nghiêng: mặt trước (x,yTop,w,h), lệch (ox,-oy)
const box3 = (x, yTop, w, h, ox, oy) => {
  const f = [P(x, yTop), P(x + w, yTop), P(x + w, yTop + h), P(x, yTop + h)]
  return PA(`M ${x} ${yTop} L ${x + ox} ${yTop - oy} L ${x + w + ox} ${yTop - oy} L ${x + w} ${yTop} Z`) +
    PA(`M ${x + w} ${yTop} L ${x + w + ox} ${yTop - oy} L ${x + w + ox} ${yTop + h - oy} L ${x + w} ${yTop + h} Z`) + R(f[0].x, f[0].y, w, h)
}

// ───── T1050000001163: nối đèn lồng – hình khai triển ─────
{
  let b = ''
  const cxs = [120, 360, 600]
  const bar = (cx) => L(cx - 60, 14, cx + 60, 14, 'stroke-width="4"')
  // đèn 1: lập phương
  { const cx = cxs[0], x = cx - 30, y = 82, w = 52, ox = 18, oy = 16
    b += bar(cx) + L(cx, 14, x, y) + L(cx, 14, x + w, y) + L(cx, 14, x + ox, y - oy) + L(cx, 14, x + w + ox, y - oy) + box3(x, y, w, w, ox, oy) }
  // đèn 2: hình trụ
  { const cx = cxs[1], d = 60, r = d / 2, x = cx - r, yTop = 78, ry = r * 0.34, h = 72
    b += bar(cx) + L(cx, 14, x, yTop + ry) + L(cx, 14, x + d, yTop + ry) + L(cx, 14, cx, yTop + 2 * ry) + cylV(x, yTop, d, h) }
  // đèn 3: hình hộp chữ nhật
  { const cx = cxs[2], w = 100, h = 46, ox = 24, oy = 20, x = cx - w / 2 - 10, y = 92
    b += bar(cx) + L(cx, 14, x, y) + L(cx, 14, x + w, y) + L(cx, 14, x + ox, y - oy) + L(cx, 14, x + w + ox, y - oy) + box3(x, y, w, h, ox, oy) }
  cxs.forEach((cx, i) => { b += lab(cx, 204, 'Đèn ' + (i + 1), 22) })
  // khai triển a (hộp chữ nhật 130×70×45), b (lập phương), c (hình trụ)
  const s = 0.6, y0 = 228, band = 160
  const nA = [[45, 0, 130, 45], [0, 45, 45, 70], [45, 45, 130, 70], [175, 45, 45, 70], [220, 45, 130, 70], [45, 115, 130, 45]]
  const u = 65, nB = [[130, 0, u, u], [0, u, u, u], [65, u, u, u], [130, u, u, u], [195, u, u, u], [130, 130, u, u]]
  const d = 75, Lc = 235, hc = 112
  const wA = 350 * s, hA = 160 * s, wB = 260 * s, hB = 195 * s, wC = Lc * s, hC = (2 * d + hc) * s
  const top = (h) => y0 + (band - h) / 2
  b += net(cxs[0] - wA / 2, top(hA), s, nA)
  b += net(cxs[1] - wB / 2, top(hB), s, nB)
  { const x = cxs[2] - wC / 2, y = top(hC)
    b += R(x, y + d * s, Lc * s, hc * s) + C(x + (d / 2) * s, y + (d / 2) * s, (d / 2) * s) + C(x + (d / 2) * s, y + (d + hc + d / 2) * s, (d / 2) * s) }
  ;['a', 'b', 'c'].forEach((t, i) => { b += lab(cxs[i], y0 + band + 26, 'Hình ' + t, 22) })
  ok('1163: hình trụ L ≈ π·d', Math.abs(Lc - Math.PI * d) < 2)
  ok('1163: hộp: 4 mặt bên + 2 đáy kích thước khớp', 45 + 130 + 45 + 130 === 350)
  const H = Math.ceil(y0 + band + 26 + 20)
  ok('1163 cao ≤ 450', H <= 450)
  await ra(OUT, 'T1050000001163', 720, H, b)
}

// ───── T1050000001164: 4 miếng bìa A–D ─────
{
  const Lh = 144, d = 52, h = 70, s = 0.6
  const A = [[0, 0, Lh, d], [0, d, Lh, h], [0, d + h, Lh, d], [0, 2 * d + h, Lh, h], [Lh, d, d, h], [Lh, 2 * d + h, d, h]]
  const B = [[0, 0, d, h], [d, 0, Lh, h], [d + Lh, 0, d, h], [d, h, Lh, d], [d, h + d, Lh, h]]
  const Cn = [[d, 0, Lh, d], [0, d, d, h], [d, d, Lh, h], [d + Lh, d, d, h], [2 * d + Lh, d, Lh, h], [d, d + h, Lh, d]]
  const D = [[0, 0, Lh, d], [0, d, Lh, h], [0, d + h, Lh, d], [0, 2 * d + h, Lh, h]]
  const dims = { A: [Lh + d, 2 * d + 2 * h], B: [2 * d + Lh, 2 * h + d], C: [2 * d + 2 * Lh, 2 * d + h], D: [Lh, 2 * d + 2 * h] }
  const x1 = 20, x2 = x1 + dims.C[0] * s + 60
  const row1B = 12 + dims.A[1] * s, row2B = row1B + 56 + dims.D[1] * s
  let b = ''
  const put = (rects, k, x, bottom) => { b += net(x, bottom - dims[k][1] * s, s, rects); b += lab(x + dims[k][0] * s / 2, bottom + 26, k + '.', 22) }
  put(A, 'A', x1, row1B); put(B, 'B', x2, row1B); put(Cn, 'C', x1, row2B); put(D, 'D', x2, row2B)
  const W = Math.ceil(x2 + dims.B[0] * s + 20), H = Math.ceil(row2B + 26 + 14)
  ok('1164: C gập được: 4 mặt xung quanh (d,h,d,h) + 2 đáy', 2 * d + 2 * Lh === dims.C[0])
  ok('1164: kích cỡ', W <= 760 && H <= 450)
  await ra(OUT, 'T1050000001164', W, H, b)
}

// ───── T1050000001165: A–D, hình trụ khai triển? ─────
{
  const s = 0.7, rw = 190 * s, rh = 128 * s, d = 62 * s, r = d / 2
  const slotW = [rw, rw, rw, rw + d], gap = 38
  const xs = []; let x = 20; slotW.forEach((w) => { xs.push(x); x += w + gap })
  const W = Math.ceil(x - gap + 20), bottom = 12 + d + rh + d
  let b = ''
  // A: hai tròn ở cạnh trên
  { const x0 = xs[0], y = 12 + d; b += R(x0, y, rw, rh) + C(x0 + 43 * s, y - r, r) + C(x0 + 133 * s, y - r, r) }
  // B: một tròn ở cạnh trên
  { const x0 = xs[1], y = 12 + d; b += R(x0, y, rw, rh) + C(x0 + 45 * s, y - r, r) }
  // C: tròn trên + tròn dưới (hai cạnh đối diện)
  { const x0 = xs[2], y = 12 + d; b += R(x0, y, rw, rh) + C(x0 + 42 * s, y - r, r) + C(x0 + 117 * s, y + rh + r, r) }
  // D: tròn trên, tròn bên phải, tròn dưới góc trái
  { const x0 = xs[3], y = 12 + d; b += R(x0, y, rw, rh) + C(x0 + 45 * s, y - r, r) + C(x0 + rw + r, y + 70 * s, r) + C(x0 + 28 * s, y + rh + r, r) }
  ;['A', 'B', 'C', 'D'].forEach((t, i) => { b += lab(xs[i] + slotW[i] / 2, bottom + 28, t + '.', 22) })
  const H = Math.ceil(bottom + 28 + 18)
  ok('1165: kích cỡ', W <= 760 && H <= 450)
  await ra(OUT, 'T1050000001165', W, H, b)
}

// ───── T1050000001166: khai triển + 3 hình trụ A, B, C ─────
{
  const s = 0.8, d = 78 * s, Lc = 245 * s, hc = 48 * s, r = d / 2
  ok('1166: L ≈ π·d', Math.abs(Lc - Math.PI * d) < 2)
  const nx = 20, ny = 70
  let b = R(nx, ny + d, Lc, hc) + C(nx + Lc - r, ny + r, r) + C(nx + Lc - r, ny + d + hc + r, r)
  const bottom = 240, ry = r * 0.34
  const A = { x: nx + Lc + 70, h: 230 * s }, Bc = { x: nx + Lc + 70 + d + 50, h: 48 * s }
  b += cylV(A.x, bottom - A.h - 2 * ry, d, A.h) + lab(A.x + r, bottom + 30, 'A.')
  b += cylV(Bc.x, bottom - Bc.h - 2 * ry, d, Bc.h) + lab(Bc.x + r, bottom + 30, 'B.')
  const Cx = Bc.x + d + 50
  b += cylH(Cx, bottom - d, 230 * s, d) + lab(Cx + (230 * s + 2 * r * 0.34) / 2, bottom + 30, 'C.')
  const W = Math.ceil(Cx + 230 * s + 2 * r * 0.34 + 20), H = bottom + 30 + 18
  ok('1166: kích cỡ', W <= 760 && H <= 450)
  await ra(OUT, 'T1050000001166', W, H, b)
}

// ───── T1050000001201: khai triển + 4 hình A–D ─────
{
  const s = 0.8, d = 90 * s, Lc = Math.PI * 90 * s, hc = 140 * s, r = d / 2
  const nx = 20, ny = 44
  let b = R(nx, ny + d, Lc, hc) + C(nx + Lc / 2, ny + r, r) + C(nx + Lc / 2, ny + d + hc + r, r)
  const ox = 300, cw = 170
  const row0 = 130, row1 = 290
  const lbl = (c, rowB, t) => lab(ox + c * cw + 60, rowB + 28, t + '.')
  // A lập phương
  b += box3(ox + 6, row0 - 70, 70, 70, 22, 22) + lbl(0, row0, 'A')
  // B hình trụ
  { const dd = 66, ry = dd / 2 * 0.34, hh = 70; b += cylV(ox + cw + 10, row0 - hh - 2 * ry, dd, hh) + lbl(1, row0, 'B') }
  // C hộp chữ nhật
  b += box3(ox + 4, row1 - 66, 120, 66, 26, 22) + lab(ox + 70, row1 + 28, 'C.')
  // D hình cầu
  { const rr = 44, cx = ox + cw + 54, cy = row1 - rr
    b += C(cx, cy, rr) + `<path d="M ${cx - rr} ${cy} A ${rr} ${rr * 0.3} 0 0 0 ${cx + rr} ${cy}" fill="none" stroke="${S}" stroke-width="1.2" stroke-dasharray="5 4"/>` + lab(cx, row1 + 28, 'D.') }
  const W = ox + 2 * cw + 20, H = row1 + 28 + 24
  ok('1201: kích cỡ', W <= 760 && H <= 450)
  await ra(OUT, 'T1050000001201', W, H, b)
}

// ───── T1050000001167: 6 hình, tô màu hình khai triển lập phương ─────
const FIG6 = [
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [0, 2], [2, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
  [[3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
]
{
  const u = 38, slot = 210
  let b = ''
  FIG6.forEach((cs, i) => {
    const col = i % 3, row = Math.floor(i / 3), x0 = 20 + col * slot + (slot - 30 - cellsW(cs) * u) / 2, y0 = 12 + row * 165
    b += cells(x0, y0, u, cs) + lab(20 + col * slot + (slot - 30) / 2, y0 + 3 * u + 30, String(i + 1), 22)
  })
  const W = 20 + 3 * slot, H = 12 + 165 + 3 * u + 30 + 18
  ok('1167: số ô 6,6,7,6,6,6', FIG6.map((c) => c.length).join() === '6,6,7,6,6,6')
  ok('1167: kích cỡ', W <= 760 && H <= 450)
  await ra(OUT, 'T1050000001167', W, H, b)
}

// ───── T1050000001168: 4 hình, tô hình KHÔNG phải khai triển ─────
{
  const FIG4 = [
    [[2, 0], [2, 1], [2, 2], [2, 3], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]],
    [[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [2, 2]],
    [[2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
  ]
  ok('1168: số ô 6,6,7,6', FIG4.map((c) => c.length).join() === '6,6,7,6')
  const u = 34, gap = 42
  let x = 20, b = ''
  const top = 12
  FIG4.forEach((cs, i) => {
    const w = cellsW(cs) * u
    b += cells(x, top, u, cs) + lab(x + w / 2, top + 4 * u + 30, String(i + 1), 22)
    x += w + gap
  })
  const W = Math.ceil(x - gap + 20), H = top + 4 * u + 30 + 18
  ok('1168: kích cỡ', W <= 760 && H <= 450)
  await ra(OUT, 'T1050000001168', W, H, b)
}

console.log('xong')
