// VE4 — 12 hình H073–H084 (xoay chiều, máy biến áp, truyền tải, sóng điện từ). Chạy từ gốc repo.
import { luu } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'anh')

const INK = '#222', BLUE = '#2f5bd3', RED = '#d33a2c', GREEN = '#1f7a4d', CORE = '#e6ecf5', COIL = '#c77d2b'
const f = (n) => Math.round(n * 100) / 100
const esc = (c) => c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c
// markup: *italic*  _{sub}  ^{sup}
function mk(s) {
  let out = '', it = false, i = 0
  while (i < s.length) {
    const c = s[i]
    if (c === '*') { it = !it; out += it ? '<tspan font-style="italic">' : '</tspan>'; i++ }
    else if (c === '_' && s[i + 1] === '{') { const j = s.indexOf('}', i); out += `<tspan dy="5" font-size="0.72em">${s.slice(i + 2, j)}</tspan><tspan dy="-5">​</tspan>`; i = j + 1 }
    else if (c === '^' && s[i + 1] === '{') { const j = s.indexOf('}', i); out += `<tspan dy="-7" font-size="0.72em">${s.slice(i + 2, j)}</tspan><tspan dy="7">​</tspan>`; i = j + 1 }
    else { out += esc(c); i++ }
  }
  if (it) out += '</tspan>'
  return out
}
const tx = (x, y, s, { size = 20, color = INK, anchor = 'middle', bold = false } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" fill="${color}" stroke="none" font-family="Arial, sans-serif" font-size="${size}"${bold ? ' font-weight="bold"' : ''}>${mk(s)}</text>`
const ln = (x1, y1, x2, y2, color = INK, w = 2, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${color}" stroke-width="${w}" ${extra}/>`
const dash = '7 5'
const dln = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, '#999', 1.2, `stroke-dasharray="${dash}"`)
function head(x2, y2, ux, uy, color, L = 11, Wd = 4.6) {
  const bx = x2 - ux * L, by = y2 - uy * L, nx = -uy, ny = ux
  return `<polygon points="${f(x2)},${f(y2)} ${f(bx + nx * Wd)},${f(by + ny * Wd)} ${f(bx - nx * Wd)},${f(by - ny * Wd)}" fill="${color}" stroke="none"/>`
}
function arrow(x1, y1, x2, y2, color = INK, w = 2, L = 11) {
  const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d
  return ln(x1, y1, x2 - ux * (L - 2), y2 - uy * (L - 2), color, w) + head(x2, y2, ux, uy, color, L)
}
const dbl = (x1, y1, x2, y2, color = INK) => arrow(x1, y1, x2, y2, color, 2, 9) + arrow(x2, y2, x1, y1, color, 2, 9)
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/><g stroke-linecap="round" stroke-linejoin="round" fill="none">${body}</g></svg>`
const vecL = (x, y, ch, color = INK, size = 24) => tx(x, y, `*${ch}*`, { size, color }) + ln(x - 7, y - size * 0.86, x + 7, y - size * 0.86, color, 1.6) + head(x + 9, y - size * 0.86, 1, 0, color, 6, 3)
const box = (x, y, w, h, fill = CORE, stroke = INK) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`

// ───────── đồ thị ─────────
const trục = (ox, oy, xr, yt, yb, tName, yName) =>
  arrow(ox - 30, oy, xr, oy, INK, 2) + arrow(ox, yb, ox, yt, INK, 2) + tx(xr - 6, oy + 26, tName) + tx(ox + 20, yt + 12, yName)
function curve(fn, x0, x1, ox, oy, sx, sy, color, w = 2.6) {
  let d = ''
  for (let x = x0; x <= x1 + 1e-9; x += 0.04) d += (d ? ' L ' : 'M ') + f(ox + x * sx) + ' ' + f(oy - fn(x) * sy)
  return `<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none"/>`
}
const O = (ox, oy) => tx(ox - 8, oy + 22, 'O', { anchor: 'end', size: 18 })

// H073: i = I0 cos(ωt + φ), φ = π/3
function h073() {
  const ox = 70, oy = 150, sx = 50, sy = 90, ph = Math.PI / 3
  const i = (x) => Math.cos(x + ph)
  const xmin = 2 * Math.PI / 3, xmax = xmin + 2 * Math.PI
  let b = trục(ox, oy, 505, 22, 282, '*t*', '*i*')
  b += dln(ox, oy - sy, ox + 330, oy - sy) + dln(ox, oy + sy, ox + 330, oy + sy)
  b += tx(ox - 8, oy - sy + 7, '*I*_{0}', { anchor: 'end' }) + tx(ox - 8, oy + sy + 7, '−*I*_{0}', { anchor: 'end' }) + O(ox, oy)
  b += curve(i, 0, xmax + 0.3, ox, oy, sx, sy, RED)
  b += `<circle cx="${ox}" cy="${f(oy - i(0) * sy)}" r="4.5" fill="${RED}" stroke="none"/>`
  const ya = oy + sy + 28
  b += dln(ox + xmin * sx, oy + sy, ox + xmin * sx, ya + 8) + dln(ox + xmax * sx, oy + sy, ox + xmax * sx, ya + 8)
  b += dbl(ox + xmin * sx + 2, ya, ox + xmax * sx - 2, ya) + tx(ox + (xmin + xmax) / 2 * sx, ya + 24, '*T*')
  return svg(530, 300, b)
}
// H074: u = U0 cos ωt (pha ban đầu 0)
function h074() {
  const ox = 70, oy = 160, sx = 50, sy = 80, xmax = 2 * Math.PI
  let b = trục(ox, oy, 495, 20, 280, '*t*', '*u*')
  b += dln(ox, oy - sy, ox + 360, oy - sy) + dln(ox, oy + sy, ox + 360, oy + sy)
  b += tx(ox - 8, oy - sy + 7, '*U*_{0}', { anchor: 'end' }) + tx(ox - 8, oy + sy + 7, '−*U*_{0}', { anchor: 'end' }) + O(ox, oy)
  b += curve((x) => Math.cos(x), 0, xmax + 0.45, ox, oy, sx, sy, BLUE)
  const yt = oy - sy - 24
  b += dln(ox, oy - sy, ox, yt - 8) + dln(ox + xmax * sx, oy - sy, ox + xmax * sx, yt - 8)
  b += dbl(ox + 2, yt, ox + xmax * sx - 2, yt) + tx(ox + xmax * sx / 2, yt - 8, '*T*')
  return svg(520, 300, b)
}
// H075: u = U0 cos ωt (xanh), i = I0 cos(ωt − φ) (đỏ); φ = φu − φi = π/3 > 0
function h075() {
  const ox = 80, oy = 170, sx = 48, sy = 80, ph = Math.PI / 3
  let b = trục(ox, oy, 500, 22, 285, '*t*', '*u, i*')
  b += curve((x) => Math.cos(x), -0.5, 6.7, ox, oy, sx, sy, BLUE) + curve((x) => Math.cos(x - ph), -0.5, 6.7, ox, oy, sx, sy, RED)
  b += tx(ox + 1.75 * sx, oy - sy * 0.3 - 6, '*u*', { color: BLUE, size: 22 }) + tx(ox + 3.0 * sx + 24, oy + sy * 0.55 + 4, '*i*', { color: RED, size: 22 }) + O(ox, oy)
  const ya = oy - sy - 26, xa = ox, xb = ox + ph * sx
  b += dln(xa, oy - sy, xa, ya - 8) + dln(xb, oy - sy, xb, ya - 8)
  b += dbl(xa + 2, ya, xb - 2, ya) + tx((xa + xb) / 2 + 22, ya - 8, 'φ', { size: 22 })
  return svg(520, 300, b)
}

// ───────── máy biến áp ─────────
const sourceAC = (cx, cy, r = 24) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M ${cx - 13} ${cy} C ${cx - 9} ${cy - 14}, ${cx - 3} ${cy - 14}, ${cx} ${cy} S ${cx + 9} ${cy + 14}, ${cx + 13} ${cy}" stroke="${INK}" stroke-width="2" fill="none"/>`
const lamp = (cx, cy, r = 22) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2"/>` +
  ln(cx - r * 0.7, cy - r * 0.7, cx + r * 0.7, cy + r * 0.7) + ln(cx - r * 0.7, cy + r * 0.7, cx + r * 0.7, cy - r * 0.7)
function coilV(x, y0, n, h, side, color = INK) { // side +1 phình sang phải, −1 sang trái
  const r = h / 2; let d = `M ${x} ${y0}`
  for (let k = 0; k < n; k++) d += ` A ${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${x} ${y0 + (k + 1) * h}`
  return `<path d="${d}" stroke="${color}" stroke-width="2.4" fill="none"/>`
}
function h076() {
  let b = box(150, 60, 240, 180) + box(200, 110, 140, 80, '#fff') + tx(270, 156, 'Lõi sắt')
  b += `<rect x="175" y="85" width="190" height="130" fill="none" stroke="${BLUE}" stroke-width="2" stroke-dasharray="${dash}"/>`
  b += head(285, 85, 1, 0, BLUE, 11, 5) + tx(232, 106, 'Φ', { color: BLUE })
  const turns = (x0, x1, y0, y1, n) => { let s = ''; for (let k = 0; k < n; k++) { const y = y0 + (y1 - y0) * k / (n - 1); s += ln(x0, y + 9, x1, y - 9, COIL, 4.5) } return s }
  b += turns(144, 206, 82, 218, 7) + turns(334, 396, 100, 200, 4)
  b += `<path d="M 144 91 L 50 91 L 50 126 M 50 174 L 50 209 L 144 209" stroke="${INK}" stroke-width="2"/>`
  b += `<path d="M 396 109 L 500 109 L 500 128 M 500 172 L 500 191 L 396 191" stroke="${INK}" stroke-width="2"/>`
  b += sourceAC(50, 150) + lamp(500, 150)
  b += tx(104, 157, '*N*_{1}', { size: 22 }) + tx(446, 157, '*N*_{2}', { size: 22 })
  b += tx(98, 266, 'Cuộn sơ cấp', { size: 19 }) + tx(445, 266, 'Cuộn thứ cấp', { size: 19 })
  return svg(540, 285, b)
}
function h077() {
  let b = coilV(185, 60, 6, 28, +1) + coilV(291, 60, 6, 28, -1) + ln(232, 44, 232, 244) + ln(244, 44, 244, 244)
  b += `<path d="M 75 126 L 75 60 L 185 60 M 75 174 L 75 228 L 185 228" stroke="${INK}" stroke-width="2"/>`
  b += `<path d="M 291 60 L 440 60 L 440 118 M 440 182 L 440 228 L 291 228" stroke="${INK}" stroke-width="2"/>`
  b += sourceAC(75, 150) + box(425, 118, 30, 64, '#fff')
  b += tx(30, 157, '*u*_{1}', { size: 22 }) + tx(490, 157, '*u*_{2}', { size: 22 })
  b += tx(142, 157, '*N*_{1}', { size: 22 }) + tx(334, 157, '*N*_{2}', { size: 22 })
  b += arrow(110, 60, 150, 60, RED) + tx(130, 46, '*i*_{1}', { color: RED })
  b += arrow(345, 60, 385, 60, RED) + tx(365, 46, '*i*_{2}', { color: RED })
  b += tx(238, 266, 'Lõi sắt', { size: 18 })
  return svg(520, 285, b)
}
const transSym = (cx, yTop) => coilV(cx - 22, yTop, 3, 22, +1) + coilV(cx + 22, yTop, 3, 22, -1) + ln(cx - 4, yTop - 10, cx - 4, yTop + 76) + ln(cx + 4, yTop - 10, cx + 4, yTop + 76)
function h078() {
  const yt = 90, yb = 156, c1 = 150, c2 = 390
  let b = box(10, 73, 80, 100) + tx(50, 118, 'Nhà', { size: 19 }) + tx(50, 142, 'máy', { size: 19 })
  b += box(445, 73, 100, 100) + tx(495, 114, 'Nơi', { size: 19 }) + tx(495, 138, 'tiêu thụ', { size: 19 })
  b += ln(90, yt, c1 - 22, yt) + ln(90, yb, c1 - 22, yb) + transSym(c1, yt)
  b += ln(c1 + 22, yt, 232, yt) + box(232, yt - 12, 66, 24, '#fff') + ln(298, yt, c2 - 22, yt) + ln(c1 + 22, yb, c2 - 22, yb)
  b += transSym(c2, yt) + ln(c2 + 22, yt, 445, yt) + ln(c2 + 22, yb, 445, yb)
  b += tx(265, yt - 22, '*R*') + arrow(180, yt - 14, 215, yt - 14, RED, 2, 9)
  b += tx(c1, 214, 'Máy tăng áp', { size: 18 }) + tx(c2, 214, 'Máy hạ áp', { size: 18 }) + tx(265, 214, 'Đường dây', { size: 18 })
  return svg(560, 240, b)
}
function h079() {
  let b = `<path d="M 80 104 L 80 60 L 400 60 L 400 85 M 80 156 L 80 205 L 400 205 L 400 175" stroke="${INK}" stroke-width="2"/>`
  b += box(330, 85, 140, 90) + box(190, 47, 90, 26, '#fff')
  b += sourceAC(80, 130) + tx(36, 137, '*U*') + tx(400, 125, 'Tải') + tx(400, 153, '*U*′, *P*′', { size: 18 })
  b += tx(235, 36, '*R*') + tx(235, 102, 'Δ*U* = *IR*', { size: 18 }) + tx(235, 130, 'Δ*P* = *I*^{2}*R*', { size: 18 })
  b += arrow(110, 60, 160, 60, RED) + tx(135, 46, '*I*', { color: RED })
  b += tx(80, 236, 'Nguồn: *P*, *U*', { size: 18 })
  return svg(500, 250, b)
}

// ───────── điện từ trường & sóng điện từ ─────────
const crossS = (cx, cy, r = 9, color = INK) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${color}" stroke-width="1.8"/>` + ln(cx - r * 0.7, cy - r * 0.7, cx + r * 0.7, cy + r * 0.7, color, 1.8) + ln(cx - r * 0.7, cy + r * 0.7, cx + r * 0.7, cy - r * 0.7, color, 1.8)
const dotOut = (cx, cy, r = 9, color = INK) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${color}" stroke-width="1.8"/><circle cx="${cx}" cy="${cy}" r="2.6" fill="${color}" stroke="none"/>`
function h080() {
  const cx = 190, cy = 175
  let b = ''
  for (let gx = -2; gx <= 2; gx++) for (let gy = -2; gy <= 2; gy++) if (Math.hypot(gx, gy) <= 2.3) b += crossS(cx + gx * 34, cy + gy * 34, 8)
  for (const [r, a] of [[92, Math.PI / 4], [128, -Math.PI / 4], [160, 3 * Math.PI / 4]]) {
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${BLUE}" stroke-width="2.2" fill="none"/>`
    // ngược chiều kim đồng hồ (B vào và tăng): tiếp tuyến tại góc a (hệ toán) = (−sin a, cos a); y màn hình xuống ⇒ (−sin a, −cos a)
    b += head(cx + r * Math.cos(a), cy - r * Math.sin(a), -Math.sin(a), -Math.cos(a), BLUE, 12, 5)
  }
  b += crossS(380, 108, 9) + tx(398, 114, '*B* tăng', { anchor: 'start', size: 19 })
  b += ln(370, 150, 390, 150, BLUE, 2.6) + tx(398, 156, '*E* xoáy', { anchor: 'start', size: 19, color: BLUE })
  return svg(520, 355, b)
}
function h081() {
  const y0 = 150
  let b = box(190, 70, 12, 160) + box(298, 70, 12, 160)
  b += tx(172, 108, '+', { size: 28, color: RED }) + tx(328, 108, '−', { size: 28, color: BLUE })
  b += ln(196, 230, 196, 262) + ln(304, 230, 304, 262) + ln(196, 262, 150, 262) + ln(304, 262, 350, 262)
  for (const y of [100, 130, 160, 190]) b += arrow(204, y, 296, y, BLUE, 2.2, 11)
  b += tx(250, 222, '*E* tăng', { size: 19, color: BLUE })
  b += `<ellipse cx="250" cy="${y0}" rx="150" ry="104" stroke="${GREEN}" stroke-width="2.2" stroke-dasharray="${dash}" fill="none"/>`
  b += dotOut(250, y0 - 104, 10, GREEN) + crossS(250, y0 + 104, 10, GREEN)
  b += dotOut(416, 108, 9, GREEN) + tx(432, 114, '*B* ra', { anchor: 'start', size: 19, color: GREEN })
  b += crossS(416, 140, 9, GREEN) + tx(432, 146, '*B* vào', { anchor: 'start', size: 19, color: GREEN })
  return svg(520, 290, b)
}
function h082() {
  let b = `<rect x="12" y="12" width="496" height="206" rx="18" fill="none" stroke="#999" stroke-width="2" stroke-dasharray="${dash}"/>`
  b += `<rect x="36" y="64" width="170" height="86" rx="10" fill="${CORE}" stroke="${GREEN}" stroke-width="2"/><rect x="314" y="64" width="170" height="86" rx="10" fill="${CORE}" stroke="${BLUE}" stroke-width="2"/>`
  b += tx(121, 100, 'Từ trường') + tx(121, 128, 'biến thiên (*B*)', { size: 19 })
  b += tx(399, 100, 'Điện trường') + tx(399, 128, 'biến thiên (*E*)', { size: 19 })
  b += arrow(210, 84, 310, 84, INK, 2.2, 12) + arrow(310, 130, 210, 130, INK, 2.2, 12)
  b += tx(260, 74, 'sinh ra', { size: 18 }) + tx(260, 156, 'sinh ra', { size: 18 })
  b += tx(260, 44, 'Điện từ trường', { size: 21, bold: true }) + tx(260, 196, 'cùng tồn tại, chuyển hoá lẫn nhau', { size: 18 })
  return svg(520, 232, b)
}
function h083() {
  const ox = 110, oy = 180, A = 70, lam = 300, kz = 2 * Math.PI / lam, bx = -0.62, by = 0.62
  let b = arrow(ox - 60, oy, 535, oy, INK, 2) + tx(528, oy + 24, '*z*')
  b += arrow(ox, oy, ox, 36, BLUE, 1.6, 9) + arrow(ox, oy, ox + bx * 120, oy + by * 120, RED, 1.6, 9)
  b += tx(ox - 18, 50, '*E*', { color: BLUE, size: 22 }) + tx(ox + bx * 120 - 18, oy + by * 120 + 10, '*B*', { color: RED, size: 22 })
  for (let z = lam / 8; z <= 400; z += lam / 8) {
    const s = Math.sin(kz * z), x = ox + z
    if (Math.abs(s) < 0.05) continue
    b += arrow(x, oy, x, oy - A * s, BLUE, 1.5, 8) + arrow(x, oy, x + bx * A * s, oy + by * A * s, RED, 1.5, 8)
  }
  let dE = '', dB = ''
  for (let z = 0; z <= 410; z += 4) {
    const s = Math.sin(kz * z); dE += (dE ? ' L ' : 'M ') + f(ox + z) + ' ' + f(oy - A * s); dB += (dB ? ' L ' : 'M ') + f(ox + z + bx * A * s) + ' ' + f(oy + by * A * s)
  }
  b += `<path d="${dE}" stroke="${BLUE}" stroke-width="2.6"/><path d="${dB}" stroke="${RED}" stroke-width="2.6"/>`
  const yl = 292
  b += dln(ox, oy + 8, ox, yl + 8) + dln(ox + lam, oy + 8, ox + lam, yl + 8)
  b += dbl(ox + 2, yl, ox + lam - 2, yl) + tx(ox + lam / 2, yl + 26, 'λ', { size: 22 })
  return svg(540, 330, b)
}
function h084() {
  const ox = 210, oy = 190
  let b = arrow(ox, oy, ox, 50, BLUE, 3.2, 15) + arrow(ox, oy, ox + 230, oy, GREEN, 3.2, 15) + arrow(ox, oy, ox - 110, oy + 110, RED, 3.2, 15)
  b += vecL(ox - 6, 42, 'E', BLUE) + vecL(ox + 244, oy + 36, 'v', GREEN) + vecL(ox - 136, oy + 142, 'B', RED)
  const q = 16
  b += `<path d="M ${ox} ${oy - q} L ${ox + q} ${oy - q} L ${ox + q} ${oy}" stroke="${INK}" stroke-width="1.6"/>`
  b += tx(ox + 130, 100, '*E* ⊥ *B* ⊥ *v*', { size: 21 })
  return svg(520, 340, b)
}

const H = { H073: h073, H074: h074, H075: h075, H076: h076, H077: h077, H078: h078, H079: h079, H080: h080, H081: h081, H082: h082, H083: h083, H084: h084 }
for (const [ma, fn] of Object.entries(H)) {
  const s = fn(), m = s.match(/width="(\d+)" height="(\d+)"/)
  await luu(DIR, ma, +m[1], +m[2], s)
  console.log('ok', ma, m[1], m[2])
}
