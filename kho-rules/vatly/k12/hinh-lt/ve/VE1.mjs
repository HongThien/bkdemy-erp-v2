import { luu } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'anh')

const C = { k: '#222', B: '#2f5bd3', R: '#d33a2c', G: '#1f7a4d', O: '#b35c00' }
const mk = (id, c) => `<marker id="${id}" viewBox="0 0 12 10" refX="11" refY="5" markerWidth="12" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L12,5 L0,10 Z" fill="${c}"/></marker>`
const DEFS = `<defs>${mk('ak', C.k)}${mk('aB', C.B)}${mk('aR', C.R)}${mk('aG', C.G)}${mk('aO', C.O)}</defs>`
const M = { [C.k]: 'ak', [C.B]: 'aB', [C.R]: 'aR', [C.G]: 'aG', [C.O]: 'aO' }
const f = (n) => Math.round(n * 100) / 100
const arrow = (x1, y1, x2, y2, c = C.k, w = 2, dash = '') =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} marker-end="url(#${M[c]})"/>`
const line = (x1, y1, x2, y2, c = C.k, w = 2, dash = '') =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`
const txt = (x, y, s, { size = 20, anchor = 'middle', c = '#111', halo = false, it = false } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${size}" fill="${c}" ${it ? 'font-style="italic"' : ''} ${halo ? 'stroke="#fff" stroke-width="5" paint-order="stroke" stroke-linejoin="round"' : ''}>${s}</text>`
const sb = (s, t) => `<tspan font-style="italic">${s}</tspan><tspan font-size="14" dy="5">${t}</tspan><tspan dy="-5"></tspan>`
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Arial, sans-serif">${DEFS}<rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`
const circ = (x, y, r, fill = '#fff', stroke = C.k, w = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`
const rect = (x, y, w, h, fill = 'none', stroke = C.k, sw = 2, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
let seed = 7
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const MOL = '#cfe0ff'

// ---------- H001
{
  let b = rect(15, 20, 360, 290, '#fff', C.k, 2)
  const mols = [[60, 60, 40], [150, 50, 160], [250, 70, 300], [330, 60, 220], [100, 130, 100], [200, 140, 20], [300, 150, 70], [60, 220, 330], [150, 230, 250], [240, 250, 120], [330, 250, 200], [340, 195, 100]]
  for (const [x, y, a] of mols) {
    const r = a * Math.PI / 180
    b += circ(x, y, 12, MOL, C.B)
    b += arrow(x + 12 * Math.cos(r), y - 12 * Math.sin(r), x + 40 * Math.cos(r), y - 40 * Math.sin(r), C.O, 2.5)
  }
  b += txt(233, 118, 'v', { it: true, c: C.O, size: 20, halo: true })
  b += rect(395, 20, 175, 290, '#fff', C.k, 2)
  b += circ(430, 90, 12, MOL, C.B) + circ(535, 90, 12, MOL, C.B)
  b += arrow(445, 90, 482, 90, C.G, 3) + arrow(520, 90, 483, 90, C.G, 3)
  b += txt(482, 138, 'lực hút', { c: C.G })
  b += txt(482, 165, '(ở xa nhau)', { size: 18, c: '#555' })
  b += circ(467, 235, 12, MOL, C.B) + circ(497, 235, 12, MOL, C.B)
  b += arrow(453, 235, 418, 235, C.R, 3) + arrow(511, 235, 546, 235, C.R, 3)
  b += txt(482, 285, 'lực đẩy', { c: C.R })
  await luu(DIR, 'H001', 590, 330, svg(590, 330, b))
}

// ---------- H006
{
  let b = ''
  const panel = (x0, title, pos) => {
    let s = rect(x0, 20, 220, 220, '#fff', C.k, 2)
    for (const [x, y] of pos) s += circ(x0 + x, 20 + y, 13, MOL, C.B)
    return s + txt(x0 + 110, 292, title, { size: 21 })
  }
  const dim = (xa, xb, y) => line(xa, y, xb, y, C.R, 2) + line(xa, y - 7, xa, y + 7, C.R, 2) + line(xb, y - 7, xb, y + 7, C.R, 2)
  const ice = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) ice.push([34 + i * 50, 34 + j * 50])
  b += panel(15, 'Nước đá (rắn)', ice)
  b += dim(15 + 34, 15 + 84, 232) + txt(15 + 59, 258, 'd', { it: true, c: C.R, size: 22 })
  const liq = []; seed = 11
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) liq.push([40 + i * 42 + (rnd() - .5) * 10, 40 + j * 42 + (rnd() - .5) * 10])
  b += panel(265, 'Nước (lỏng)', liq)
  b += dim(265 + 40, 265 + 82, 232) + txt(265 + 61, 258, 'd', { it: true, c: C.R, size: 22 })
  b += txt(250, 328, `${sb('d', 'đá')} &gt; ${sb('d', 'lỏng')}`, { size: 21, c: C.R })
  await luu(DIR, 'H006', 500, 345, svg(500, 345, b))
}

// ---------- H007
{
  let b = ''
  const box = (x, t, fill) => rect(x, 140, 100, 80, fill, C.k, 2, 8) + txt(x + 50, 190, t, { size: 24 })
  b += box(20, 'Rắn', '#e6ecf5') + box(230, 'Lỏng', '#d6e9fb') + box(440, 'Khí', '#f0f0f0')
  const pair = (xa, xb, t1, t2) =>
    arrow(xa + 6, 163, xb - 6, 163, C.R, 3) + txt((xa + xb) / 2, 153, t1, { size: 18, c: C.R }) +
    arrow(xb - 6, 197, xa + 6, 197, C.B, 3) + txt((xa + xb) / 2, 222, t2, { size: 18, c: C.B })
  b += pair(120, 230, 'nóng chảy', 'đông đặc') + pair(330, 440, 'hoá hơi', 'ngưng tụ')
  b += `<path d="M 70 134 Q 280 -10 490 134" fill="none" stroke="${C.R}" stroke-width="3" marker-end="url(#aR)"/>` + txt(280, 100, 'thăng hoa', { size: 18, c: C.R })
  b += `<path d="M 490 226 Q 280 370 70 226" fill="none" stroke="${C.B}" stroke-width="3" marker-end="url(#aB)"/>` + txt(280, 268, 'ngưng kết', { size: 18, c: C.B })
  b += arrow(150, 355, 190, 355, C.R, 3) + txt(200, 361, 'thu nhiệt', { size: 18, c: C.R, anchor: 'start' })
  b += arrow(330, 355, 370, 355, C.B, 3) + txt(380, 361, 'toả nhiệt', { size: 18, c: C.B, anchor: 'start' })
  await luu(DIR, 'H007', 560, 385, svg(560, 385, b))
}

// ---------- H009
{
  let b = ''
  let x0g
  const pan = (x0) => rect(x0, 30, 150, 150, '#fff', C.k, 2)
  const g = (i, j) => [x0g + 22 + i * 36, 52 + j * 36]
  x0g = 15; b += pan(15)
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const [x, y] = g(i, j); b += circ(x, y, 10, MOL, C.B) }
  b += txt(90, 215, `${sb('t', '')} &lt; ${sb('t', 'c')}`, { size: 20 })
  x0g = 205; b += pan(205); seed = 5
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    let [x, y] = g(i, j)
    if (i >= 2 || (i === 1 && j >= 2)) { x += (rnd() - .5) * 14; y += (rnd() - .5) * 14 }
    b += circ(x, y, 10, MOL, C.B)
  }
  b += txt(280, 215, `${sb('t', '')} = ${sb('t', 'c')}`, { size: 20 })
  x0g = 395; b += pan(395); seed = 9
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let [x, y] = g(i, j); x += (rnd() - .5) * 14; y += (rnd() - .5) * 14; b += circ(x, y, 10, MOL, C.B) }
  b += txt(470, 215, 'hết trật tự', { size: 20 })
  b += arrow(168, 105, 202, 105, C.R, 3) + txt(185, 92, 'Q', { it: true, c: C.R, size: 22 })
  b += arrow(358, 105, 392, 105, C.R, 3) + txt(375, 92, 'Q', { it: true, c: C.R, size: 22 })
  await luu(DIR, 'H009', 560, 235, svg(560, 235, b))
}

// ---------- H014
{
  let b = ''
  const boxes = (y) => rect(20, y, 150, 64, '#f9d6d2', C.R, 2, 8) + rect(390, y, 150, 64, '#d6e2f7', C.B, 2, 8)
    + txt(95, y + 40, `Vật nóng ${sb('T', '1')}`, { size: 20 }) + txt(465, y + 40, `Vật lạnh ${sb('T', '2')}`, { size: 20 })
  b += boxes(30)
  b += arrow(180, 62, 380, 62, C.G, 4) + txt(280, 50, 'Q', { it: true, c: C.G, size: 22 })
  b += txt(280, 90, 'tự phát', { size: 20, c: C.G })
  b += boxes(180)
  b += arrow(380, 212, 180, 212, C.k, 3, '8 6') + txt(205, 200, 'Q', { it: true, size: 22 })
  b += line(250, 195, 310, 229, C.R, 5) + line(310, 195, 250, 229, C.R, 5)
  b += txt(280, 268, 'không tự xảy ra', { size: 20, c: C.R })
  b += txt(280, 140, `${sb('T', '1')} &gt; ${sb('T', '2')}`, { size: 20, c: '#555' })
  await luu(DIR, 'H014', 560, 290, svg(560, 290, b))
}

// ---------- H017
{
  let b = ''
  b += rect(20, 110, 100, 90, '#f9d6d2', C.R, 2) + rect(120, 110, 100, 90, '#d6e2f7', C.B, 2)
  b += txt(70, 163, sb('T', '1'), { size: 22 }) + txt(170, 163, sb('T', '2'), { size: 22 })
  b += arrow(50, 85, 190, 85, C.G, 3) + txt(120, 70, 'Q', { it: true, c: C.G, size: 22 })
  b += txt(120, 235, `${sb('T', '1')} &gt; ${sb('T', '2')}`, { size: 20, c: '#555' })
  const ox = 300, oy = 250, yc = 140
  b += arrow(ox, oy, ox + 245, oy, C.k, 2) + arrow(ox, oy, ox, 8, C.k, 2)
  b += txt(ox + 238, oy + 28, 't', { it: true, size: 22 }) + txt(ox + 16, 22, 'T', { it: true, size: 22 })
  const P1 = [], P2 = []
  for (let x = 0; x <= 205; x += 5) { const e = Math.exp(-x / 55); P1.push(`${ox + x},${f(oy - (yc + 75 * e))}`); P2.push(`${ox + x},${f(oy - (yc - 75 * e))}`) }
  b += line(ox, oy - yc, ox + 220, oy - yc, C.k, 1.5, '6 5')
  b += `<polyline points="${P1.join(' ')}" fill="none" stroke="${C.R}" stroke-width="3"/><polyline points="${P2.join(' ')}" fill="none" stroke="${C.B}" stroke-width="3"/>`
  b += txt(ox - 8, oy - yc - 75 + 7, sb('T', '1'), { size: 20, anchor: 'end', c: C.R })
  b += txt(ox - 8, oy - yc + 75 + 7, sb('T', '2'), { size: 20, anchor: 'end', c: C.B })
  b += txt(ox - 8, oy - yc + 7, sb('T', 'cb'), { size: 20, anchor: 'end' })
  b += txt(ox + 130, oy - yc + 48, 'cân bằng nhiệt', { size: 18 })
  await luu(DIR, 'H017', 560, 290, svg(560, 290, b))
}

// ---------- H024
{
  let b = rect(15, 15, 370, 290, '#fff', C.k, 3)
  const mols = [[70, 70, 30], [130, 235, 140], [220, 60, 200], [300, 245, 310], [210, 160, 60], [90, 150, 250]]
  for (const [x, y, a] of mols) {
    const r = a * Math.PI / 180
    b += circ(x, y, 5, '#222', '#222') + arrow(x + 7 * Math.cos(r), y - 7 * Math.sin(r), x + 42 * Math.cos(r), y - 42 * Math.sin(r), C.O, 2.5)
  }
  // va chạm đàn hồi với thành phải: tới rồi bật lại, góc tới = góc phản xạ
  b += circ(270, 95, 5, '#222', '#222')
  b += arrow(277, 98, 383, 139, C.O, 2.5) + arrow(385, 141, 285, 180, C.O, 2.5)
  b += txt(398, 60, 'chất điểm', { size: 19, anchor: 'start' }) + line(394, 54, 228, 58, '#777', 1.5)
  b += txt(398, 150, 'va chạm với', { size: 19, anchor: 'start' }) + txt(398, 172, 'thành bình', { size: 19, anchor: 'start' })
  b += txt(398, 235, 'va chạm đàn hồi', { size: 19, anchor: 'start' })
  await luu(DIR, 'H024', 590, 320, svg(590, 320, b))
}

// ---------- H026
{
  let b = ''
  const ax = (ox, oy, xl, yl) => arrow(ox, oy, ox + 215, oy, C.k, 2) + arrow(ox, oy, ox, oy - 215, C.k, 2)
    + txt(ox + 205, oy + 26, xl, { size: 22 }) + txt(ox - 12, oy - 205, yl, { size: 22, it: true, anchor: 'end' }) + txt(ox - 9, oy + 22, 'O', { size: 20, anchor: 'end' })
  const o1 = [50, 250]
  b += ax(o1[0], o1[1], '<tspan font-style="italic">V</tspan>', 'p')
  const curve = (K, x0, x1) => { const pts = []; for (let x = x0; x <= x1; x += 3) pts.push(`${o1[0] + x},${f(o1[1] - K / x)}`); return pts.join(' ') }
  b += `<polyline points="${curve(5000, 46, 185)}" fill="none" stroke="${C.B}" stroke-width="3"/>`
  b += `<polyline points="${curve(11000, 56, 185)}" fill="none" stroke="${C.R}" stroke-width="3"/>`
  b += txt(o1[0] + 175, o1[1] - 5000 / 185 - 10, sb('T', '1'), { size: 20, c: C.B, halo: true })
  b += txt(o1[0] + 175, o1[1] - 11000 / 185 - 12, sb('T', '2'), { size: 20, c: C.R, halo: true })
  const o2 = [330, 250]
  b += ax(o2[0], o2[1], '1/<tspan font-style="italic">V</tspan>', 'p')
  b += line(o2[0], o2[1], o2[0] + 190, o2[1] - 0.7 * 190, C.B, 3) + line(o2[0], o2[1], o2[0] + 190, o2[1] - 1.1 * 190, C.R, 3)
  b += txt(o2[0] + 198, o2[1] - 0.7 * 190 + 8, sb('T', '1'), { size: 20, c: C.B, anchor: 'start' })
  b += txt(o2[0] + 198, o2[1] - 1.1 * 190 + 8, sb('T', '2'), { size: 20, c: C.R, anchor: 'start' })
  await luu(DIR, 'H026', 570, 300, svg(570, 300, b))
}

// ---------- hộp lập phương
const cube = (fx, fy, l, ox, oy) => {
  const bx = fx + ox, by = fy + oy
  let s = `<polygon points="${fx + l},${fy} ${bx + l},${by} ${bx + l},${by + l} ${fx + l},${fy + l}" fill="#e6ecf5" stroke="none"/>`
  s += line(bx, by, bx, by + l, C.k, 2, '6 5') + line(bx, by + l, bx + l, by + l, C.k, 2, '6 5') + line(bx, by + l, fx, fy + l, C.k, 2, '6 5')
  s += rect(fx, fy, l, l, 'none', C.k, 2.5)
  s += line(fx, fy, bx, by) + line(fx + l, fy, bx + l, by) + line(fx + l, fy + l, bx + l, by + l)
  s += line(bx, by, bx + l, by) + line(bx + l, by, bx + l, by + l)
  return s
}

// ---------- H030
{
  const l = 180, ox = 50, oy = -45, fx = 60, fy = 90
  let b = cube(fx, fy, l, ox, oy)
  const cy = fy + l / 2 + oy / 2
  b += circ(130, cy - 8, 8, '#ffe2b8', C.O, 2.5)
  b += arrow(142, cy - 8, 258, cy - 8, C.O, 3) + txt(205, cy - 20, 'v', { it: true, c: C.O, size: 22, halo: true })
  b += arrow(258, cy + 12, 100, cy + 12, C.O, 3, '8 5') + txt(180, cy + 38, '−<tspan font-style="italic">v</tspan>', { c: C.O, size: 22, halo: true })
  b += arrow(272, cy - 8, 345, cy - 8, C.G, 4) + txt(310, cy - 20, sb('F', '0'), { c: C.G, size: 22 })
  const yd = fy + l + 28
  b += line(fx, yd, fx + l, yd, C.k, 1.5) + line(fx, yd - 7, fx, yd + 7, C.k, 1.5) + line(fx + l, yd - 7, fx + l, yd + 7, C.k, 1.5)
  b += txt(fx + l / 2, yd + 26, 'l', { it: true, size: 22 })
  await luu(DIR, 'H030', 440, 340, svg(440, 340, b))
}

// ---------- H031
{
  const l = 170, ox = 50, oy = -45, fx = 90, fy = 60
  let b = cube(fx, fy, l, ox, oy)
  const cx = fx + l / 2 + ox / 2, cy = fy + l / 2 + oy / 2
  const dbl = (x1, y1, x2, y2) => arrow((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, C.O, 3.5) + arrow((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, C.O, 3.5)
  b += dbl(fx + ox / 2 + 8, cy, fx + l + ox / 2 - 8, cy)
  b += dbl(cx, fy + oy / 2 + 8, cx, fy + l + oy / 2 - 8)
  const a = [fx + l / 2, fy + l / 2], bk = [fx + l / 2 + ox, fy + l / 2 + oy]
  b += dbl(a[0] - 6, a[1] + 5, bk[0] + 6, bk[1] - 5)
  b += txt(cx - 45, cy - 8, 'N/3', { size: 20, c: C.O, halo: true })
  b += txt(cx + 36, cy + 52, 'N/3', { size: 20, c: C.O, halo: true })
  b += txt(bk[0] + 38, bk[1] - 2, 'N/3', { size: 20, c: C.O, halo: true })
  await luu(DIR, 'H031', 420, 290, svg(420, 290, b))
}
console.log('xong')
