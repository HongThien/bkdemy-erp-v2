// VE3 — vẽ bằng code: cảm ứng điện từ, Lenz, dòng Foucault, tạo dòng xoay chiều (H055–H072)
import { luu } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../anh')

const C = { main: '#222', B: '#2f5bd3', I: '#d33a2c', F: '#1f7a4d', v: '#b35c00', N: '#d33a2c', S: '#2f5bd3', fill: '#e6ecf5' }
const f = (n) => Math.round(n * 100) / 100
const FONT = 'Arial, sans-serif'

const line = (x1, y1, x2, y2, col = C.main, w = 2, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${col}" stroke-width="${w}" ${extra}/>`
const head = (x, y, ang, col, L = 12, W = 6) => {
  const c = Math.cos(ang), s = Math.sin(ang)
  const p = (a, b) => `${f(x + a * c - b * s)},${f(y + a * s + b * c)}`
  return `<polygon points="${p(0, 0)} ${p(-L, W)} ${p(-L, -W)}" fill="${col}" stroke="none"/>`
}
const arrow = (x1, y1, x2, y2, col = C.main, w = 2.5, dash = '') => {
  const a = Math.atan2(y2 - y1, x2 - x1)
  return line(x1, y1, x2 - 10 * Math.cos(a), y2 - 10 * Math.sin(a), col, w, dash ? `stroke-dasharray="${dash}"` : '') + head(x2, y2, a, col)
}
// chữ: s có thể chứa <i>..</i>, <sub>…; vector: chữ có mũi tên trên
const txt = (x, y, s, { size = 20, fill = '#111', anchor = 'middle', weight = 'normal' } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" fill="${fill}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" stroke="none">${s}</text>`
const vi = (s) => `<tspan font-style="italic">${s}</tspan>`
const sub = (s) => `<tspan font-size="14" dy="5">${s}</tspan><tspan dy="-5"> </tspan>`
const subn = (s) => `<tspan font-size="14" dy="5">${s}</tspan><tspan dy="-5" font-size="1"> </tspan>`
const vec = (s) => `<tspan font-style="italic">${s}</tspan><tspan>⃗</tspan>`
const rect = (x, y, w, h, fl = 'none', st = C.main, sw = 2, r = 0) => `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="${r}" fill="${fl}" stroke="${st}" stroke-width="${sw}"/>`
const circ = (x, y, r, fl = 'none', st = C.main, sw = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fl}" stroke="${st}" stroke-width="${sw}"/>`
// ⊗ vào trang, ⊙ ra khỏi trang
const into = (x, y, r = 8, col = C.B) => `<g stroke="${col}" stroke-width="1.8" fill="none"><circle cx="${f(x)}" cy="${f(y)}" r="${r}"/>${line(x - r * .7, y - r * .7, x + r * .7, y + r * .7, col, 1.8)}${line(x - r * .7, y + r * .7, x + r * .7, y - r * .7, col, 1.8)}</g>`
const outp = (x, y, r = 8, col = C.B) => `<g><circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${col}" stroke-width="1.8"/><circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${col}"/></g>`
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`
const magnet = (x, y, w, h, nRight) => { // khối N/S nằm ngang
  const a = rect(x, y, w / 2, h, nRight ? C.S : C.N, C.main, 2), b = rect(x + w / 2, y, w / 2, h, nRight ? C.N : C.S, C.main, 2)
  const lt = (cx, t) => txt(cx, y + h / 2 + 7, t, { size: 20, fill: '#fff', weight: 'bold' })
  return a + b + lt(x + w / 4, nRight ? 'S' : 'N') + lt(x + 3 * w / 4, nRight ? 'N' : 'S')
}
// cuộn dây nhìn nghiêng: n vòng elip tâm trên trục ngang
const coil = (x0, step, n, y, rx, ry, col = C.main) => {
  let s = ''
  for (let i = 0; i < n; i++) s += `<ellipse cx="${x0 + i * step}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${col}" stroke-width="2.2"/>`
  return s
}
const gal = (x, y, r = 20) => circ(x, y, r, '#fff') + txt(x, y + 7, 'G', { size: 20, weight: 'bold' })

const hinh = []
const add = (ten, w, h, body) => hinh.push([ten, w, h, svg(w, h, body)])

// ───────── H055_1 nam châm – cuộn dây ─────────
{
  let b = ''
  b += coil(260, 22, 5, 100, 11, 44)
  b += line(260, 144, 260, 235) + line(348, 144, 348, 235) + line(260, 235, 285, 235) + line(323, 235, 348, 235)
  b += gal(304, 235, 19)
  b += magnet(40, 82, 120, 36, true)
  b += arrow(70, 55, 140, 55, C.v, 3) + txt(105, 44, vi('v'), { fill: C.v, size: 22 })
  b += txt(100, 145, 'Nam châm', { size: 19 }) + txt(304, 40, 'Cuộn dây', { size: 19 })
  b += txt(304, 283, 'Điện kế', { size: 19 })
  add('H055_1', 400, 300, b)
}
// ───────── H055_2 hai cuộn dây ─────────
{
  let b = ''
  b += coil(130, 25, 9, 170, 12, 62)                       // B
  b += rect(178, 154, 118, 32, '#cdd3dc', C.main, 1.5)     // lõi sắt
  b += coil(190, 20, 5, 170, 9, 34, C.I)                   // A
  // mạch A (ở trên)
  b += line(190, 136, 190, 24, C.I) + line(190, 24, 330, 24, C.I) + line(380, 24, 470, 24, C.I)
  b += line(330, 24, 330, 24, C.I) + line(330, 24, 345, 12, C.I) + circ(330, 24, 3, C.I, C.I, 1) + circ(380, 24, 3, C.I, C.I, 1) // công tắc hở
  b += line(270, 136, 270, 60, C.I) + line(270, 60, 340, 60, C.I) + rect(340, 50, 80, 20, '#fff', C.I, 2) + arrow(360, 90, 400, 52, C.I, 2) + line(420, 60, 470, 60, C.I)
  b += line(470, 24, 470, 36, C.I) + line(470, 60, 470, 48, C.I) + line(458, 36, 482, 36, C.I, 3) + line(464, 48, 476, 48, C.I, 3)
  b += txt(355, 14, 'K', { size: 18, fill: C.I }) + txt(380, 92, 'biến trở', { size: 16, fill: C.I }) + txt(470, 88, 'nguồn', { size: 16, fill: C.I })
  // mạch B (dưới)
  b += line(130, 232, 130, 300) + line(130, 300, 212, 300) + line(250, 300, 330, 300) + line(330, 232, 330, 300)
  b += gal(231, 300, 19)
  b += txt(70, 170, 'cuộn B', { size: 18 }) + txt(240, 218, 'A', { size: 18, fill: C.I, weight: 'bold' }) + txt(231, 340, 'Điện kế', { size: 18 })
  add('H055_2', 520, 350, b)
}

// ───────── H056 Lenz: 4 hình ─────────
function lenz(ten, { nRight, vDir, B, Bc, Ic, phi }) {
  let b = ''
  const cy = 120, cx = 330
  // vòng dây (elip): nửa sau mờ, nửa trước đậm
  b += `<path d="M ${cx} ${cy - 62} A 20 62 0 0 0 ${cx} ${cy + 62}" fill="none" stroke="#999" stroke-width="2.2" stroke-dasharray="5 4"/>`
  b += `<path d="M ${cx} ${cy - 62} A 20 62 0 0 1 ${cx} ${cy + 62}" fill="none" stroke="${C.main}" stroke-width="3"/>`
  const ax = cx + 20, ay = cy
  b += Ic === 'up' ? head(ax, ay - 12, -Math.PI / 2, C.I, 16, 8) + line(ax, ay + 12, ax, ay - 8, C.I, 3.5) : head(ax, ay + 12, Math.PI / 2, C.I, 16, 8) + line(ax, ay - 12, ax, ay + 8, C.I, 3.5)
  b += txt(cx + 40, cy + (Ic === 'up' ? -30 : 38), vi('I') + subn('c'), { fill: C.I, size: 21, anchor: 'start' })
  // nam châm bên trái
  const mx = vDir === 'right' ? 40 : 100
  b += magnet(mx, cy - 20, 110, 40, nRight)
  // vận tốc
  const vx1 = vDir === 'right' ? mx + 20 : mx + 90, vx2 = vDir === 'right' ? mx + 100 : mx + 10
  b += arrow(vx1, cy - 42, vx2, cy - 42, C.v, 3) + txt((vx1 + vx2) / 2, cy - 52, vi('v'), { fill: C.v, size: 21 })
  // B qua vòng
  const bx1 = B === 'right' ? 230 : 380, bx2 = B === 'right' ? 380 : 230
  b += arrow(bx1, 206, bx2, 206, C.B, 3) + txt(305, 232, vi('B') + ' (từ nam châm)', { fill: C.B, size: 19 })
  const cx1 = Bc === 'right' ? 250 : 360, cx2 = Bc === 'right' ? 360 : 250
  b += arrow(cx1, 38, cx2, 38, C.F, 3, '7 5') + txt(305, 24, vi('B') + subn('c') + ' (cảm ứng)', { fill: C.F, size: 19 })
  b += txt(240, 270, phi, { size: 21, weight: 'bold' })
  add(ten, 480, 290, b)
}
lenz('H056_1', { nRight: true, vDir: 'right', B: 'right', Bc: 'left', Ic: 'up', phi: 'Nam châm lại gần: Φ tăng ⇒ B cảm ứng ngược B' })
lenz('H056_2', { nRight: true, vDir: 'left', B: 'right', Bc: 'right', Ic: 'down', phi: 'Nam châm ra xa: Φ giảm ⇒ B cảm ứng cùng chiều B' })
lenz('H056_3', { nRight: false, vDir: 'right', B: 'left', Bc: 'right', Ic: 'down', phi: 'Nam châm lại gần: Φ tăng ⇒ B cảm ứng ngược B' })
lenz('H056_4', { nRight: false, vDir: 'left', B: 'left', Bc: 'left', Ic: 'up', phi: 'Nam châm ra xa: Φ giảm ⇒ B cảm ứng cùng chiều B' })

// ───────── H057 ⊗ trong vòng dây ─────────
function vong(ten, { phi, ccw }) {
  let b = ''
  const cx = 190, cy = 140, r = 70
  // lưới ⊗ nền
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
    const x = 50 + i * 70, y = 45 + j * 65
    if (Math.hypot(x - cx, y - cy) > r + 14) b += into(x, y, 7, C.B)
  }
  b += circ(cx, cy, r, 'none', C.main, 3)
  // trong vòng: B_c
  if (ccw) b += outp(cx, cy, 15, C.F) + txt(cx, cy + 40, vi('B') + subn('c') + ' ra', { size: 18, fill: C.F })
  else b += into(cx, cy, 15, C.F) + txt(cx, cy + 40, vi('B') + subn('c') + ' vào', { size: 18, fill: C.F })
  b += (ccw ? head(cx + r, cy, -Math.PI / 2, C.I, 18, 9) : head(cx + r, cy, Math.PI / 2, C.I, 18, 9))
  b += txt(cx + r + 14, cy + 6, vi('I') + subn('c'), { size: 21, fill: C.I, anchor: 'start' })
  phi.forEach((t, i) => { b += txt(180, 292 + i * 24, t, { size: 17, weight: 'bold' }) })
  add(ten, 360, 330, b)
}
vong('H057_1', { phi: ['B vào, Φ tăng ⇒ B cảm ứng ra', 'Dòng cảm ứng ngược chiều kim đồng hồ'], ccw: true })
vong('H057_2', { phi: ['B vào, Φ giảm ⇒ B cảm ứng vào', 'Dòng cảm ứng cùng chiều kim đồng hồ'], ccw: false })

// ───────── khung C D M N (H058, H060) ─────────
function khungMN(ten, { nguon }) {
  let b = ''
  const xL = 70, yT = 80, yB = 200, xm = 250, xr = 410
  // vùng B (⊗)
  for (let i = 0; i < 6; i++) for (const y of [100, 180]) b += into(110 + i * 40 + 0, y, 6.5, C.B)
  if (!nguon) b += `<polygon points="${xm},${yT} ${xm + 70},${yT} ${xm + 70},${yB} ${xm},${yB}" fill="${C.fill}" fill-opacity="0.8" stroke="none"/>`
  b += line(xL, yT, xr, yT) + line(xL, yB, xr, yB) + line(xL, yT, xL, yB)
  if (!nguon) b += line(xm + 70, yT, xm + 70, yB, C.main, 1.5, 'stroke-dasharray="6 5"')
  b += line(xm, yT - 18, xm, yB + 18, C.main, 5)
  b += txt(xL - 14, yT - 6, 'C', { size: 20, weight: 'bold' }) + txt(xL - 14, yB + 20, 'D', { size: 20, weight: 'bold' })
  b += txt(xm - 18, yT - 6, 'M', { size: 20, weight: 'bold' }) + txt(xm - 18, yB + 20, 'N', { size: 20, weight: 'bold' })
  b += arrow(xm + 12, 140, xm + 70, 140, C.v, 3.5) + txt(xm + 40, 128, vi('v'), { fill: C.v, size: 22 })
  b += txt(430, 52, vi('B') + ' (vào)', { fill: C.B, size: 19, anchor: 'end' })
  if (!nguon) {
    b += arrow(xm, 228, xm + 70, 228, C.v, 2) + line(xm, 222, xm, 234, C.v, 2) + txt(xm + 35, 256, 'vΔt', { size: 19 })
    b += arrow(xm + 130, 140, xm + 130, yB, C.main, 1.8) + arrow(xm + 130, 140, xm + 130, yT, C.main, 1.8)
    b += txt(xm + 142, 146, vi('l'), { size: 22, anchor: 'start' })
    b += txt(xm + 35, 190, 'ΔS', { size: 19, fill: '#444' })
  } else {
    // điện trở R bên trái và chiều dòng điện
    b += rect(xL - 12, 120, 24, 40, '#fff', C.main, 2) + txt(xL + 30, 146, vi('R'), { size: 20, anchor: 'start' })
    b += arrow(xm, 175, xm, 105, C.I, 3.5)
    b += txt(xm - 12, 163, vi('I'), { fill: C.I, size: 21, anchor: 'end' })
    b += head(330, yT, Math.PI, C.I, 12, 6) + head(330, yB, 0, C.I, 12, 6) + head(xL, 105, Math.PI / 2, C.I, 12, 6)
    b += txt(xm + 20, yT - 8, '+', { size: 26, fill: C.I, weight: 'bold' }) + txt(xm + 20, yB + 28, '−', { size: 26, fill: C.B, weight: 'bold' })
  }
  add(ten, 460, 275, b)
}
khungMN('H058', { nguon: false })
khungMN('H060', { nguon: true })

// ───────── H059 v phân tích ─────────
{
  let b = ''
  const O = { x: 110, y: 200 }, th = 40 * Math.PI / 180, L = 220
  for (let i = 0; i < 5; i++) b += arrow(30, 70 + i * 34, 420, 70 + i * 34, C.B, 1.5).replace(/stroke-width="2.5"/g, 'stroke-width="1.5"')
  b += txt(425, 232 + 0, '', {})
  const T = { x: O.x + L * Math.cos(th), y: O.y - L * Math.sin(th) }
  b += line(T.x, T.y, T.x, O.y, '#777', 1.8, 'stroke-dasharray="6 5"') + line(O.x, O.y - L * Math.sin(th), T.x, T.y, '#777', 1.8, 'stroke-dasharray="6 5"')
  b += arrow(O.x, O.y, T.x, T.y, C.v, 3.5)
  b += arrow(O.x, O.y, T.x, O.y, C.v, 2.5, '8 5')
  b += arrow(O.x, O.y, O.x, O.y - L * Math.sin(th), C.F, 3)
  b += `<path d="M ${O.x + 55} ${O.y} A 55 55 0 0 0 ${O.x + 55 * Math.cos(th)} ${O.y - 55 * Math.sin(th)}" fill="none" stroke="${C.main}" stroke-width="2"/>`
  b += txt(O.x + 78, O.y - 14, 'θ', { size: 22 })
  b += txt(T.x + 10, T.y - 8, vi('v'), { fill: C.v, size: 22, anchor: 'start' })
  b += txt(O.x - 12, O.y - L * Math.sin(th) / 2, vi('v') + subn('1') + ' = vsinθ', { fill: C.F, size: 19, anchor: 'end' })
  b += txt((O.x + T.x) / 2, O.y + 26, vi('v') + subn('2') + ' = vcosθ (∥ B)', { fill: C.v, size: 19 })
  b += txt(425, 55, vi('B'), { fill: C.B, size: 20, anchor: 'end' })
  add('H059', 450, 245, b)
}

// ───────── H061 quy tắc bàn tay phải ─────────
{
  let b = ''
  const skin = '#f4d9bf'
  // B vào lòng bàn tay: ⊗ nền
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { if (i === 3) continue; b += into(40 + i * 78, 80 + j * 62, 6.5, C.B) }
  // cổ tay + bàn tay (lòng bàn tay hướng người xem) + thumb ra phải
  b += rect(160, 240, 60, 50, skin, C.main, 2, 6)
  b += rect(150, 150, 80, 92, skin, C.main, 2, 10)
  for (let k = 0; k < 4; k++) b += rect(150 + k * 20, 70 + (k === 1 || k === 2 ? -14 : 0) + 0, 17, 82 + (k === 1 || k === 2 ? 14 : 0), skin, C.main, 2, 8)
  b += rect(230, 178, 74, 20, skin, C.main, 2, 9)
  b += arrow(304, 188, 372, 188, C.v, 3.5) + txt(338, 174, vi('v'), { fill: C.v, size: 22 })
  b += arrow(190, 56, 190, 18, C.I, 3.5) + txt(212, 30, vi('I') + subn('c'), { fill: C.I, size: 21, anchor: 'start' })
  b += txt(8, 22, 'B vào lòng bàn tay', { size: 16, fill: C.B, anchor: 'start' })
  b += txt(190, 316, 'cổ tay → bốn ngón: chiều dòng điện', { size: 17, fill: C.I })
  add('H061', 400, 330, b)
}

// ───────── H062 dòng xoáy ─────────
{
  let b = ''
  b += rect(70, 50, 280, 190, '#dfe4ea', C.main, 2.5, 8)
  for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) b += into(95 + i * 38, 70 + j * 38, 5.5, C.B)
  for (const [cx, cy, r] of [[135, 145, 30], [210, 145, 30], [285, 145, 30]]) {
    b += circ(cx, cy, r, 'none', C.I, 3) + head(cx + r, cy, -Math.PI / 2, C.I, 14, 7)
  }
  b += txt(210, 30, vi('B') + ' tăng (vào)', { size: 19, fill: C.B })
  b += txt(210, 275, 'Dòng xoáy trong khối kim loại', { size: 18, fill: C.I })
  add('H062', 420, 295, b)
}

// ───────── H063 lò luyện kim ─────────
{
  let b = ''
  b += `<path d="M 120 70 L 140 230 Q 200 250 260 230 L 280 70 Z" fill="#f6efe6" stroke="${C.main}" stroke-width="3"/>`
  b += `<path d="M 126 120 L 140 224 Q 200 242 260 224 L 274 120 Z" fill="#ff9a3c" stroke="none" opacity="0.85"/>`
  b += `<path d="M 126 120 Q 163 112 200 120 Q 237 128 274 120" fill="none" stroke="#c4601a" stroke-width="2"/>`
  // cuộn dây quấn ngoài
  for (let i = 0; i < 6; i++) {
    const y = 90 + i * 25, xl = 120 + (y - 70) * 20 / 160 - 14, xr = 280 - (y - 70) * 20 / 160 + 14
    b += `<path d="M ${f(xl)} ${y} Q 200 ${y + 14} ${f(xr)} ${y}" fill="none" stroke="${C.I}" stroke-width="3"/>`
  }
  b += line(104, 90, 70, 90, C.I, 3) + line(70, 90, 70, 280, C.I, 3) + line(70, 280, 180, 280, C.I, 3)
  b += line(296, 215, 330, 215, C.I, 3) + line(330, 215, 330, 280, C.I, 3) + line(330, 280, 222, 280, C.I, 3)
  b += circ(200, 280, 20, '#fff') + txt(200, 288, '~', { size: 26 })
  b += txt(70, 70, 'Cuộn dây', { size: 18, fill: C.I, anchor: 'middle' })
  b += txt(200, 175, 'Kim loại', { size: 19, fill: '#fff', weight: 'bold' }) + txt(200, 197, 'nóng chảy', { size: 19, fill: '#fff', weight: 'bold' })
  b += txt(330, 165, 'Dòng điện', { size: 18, anchor: 'start', fill: C.I }) + txt(330, 187, 'xoay chiều', { size: 18, anchor: 'start', fill: C.I })
  add('H063', 440, 320, b)
}

// ───────── H065 phanh điện từ ─────────
{
  let b = ''
  // vùng từ trường
  b += rect(150, 190, 140, 112, '#f0f4fb', C.B, 1.5, 4).replace('fill="#f0f4fb"', 'fill="#f0f4fb" stroke-dasharray="6 5"')
  for (const x of [172, 198]) for (const y of [214, 252]) b += into(x, y, 7, C.B)
  b += txt(146, 184, vi('B') + ' (vào)', { size: 17, fill: C.B, anchor: 'end' })
  // con lắc
  const px = 220, py = 36
  b += `<path d="M 100 250 Q 220 316 340 250" fill="none" stroke="#bbb" stroke-width="1.5" stroke-dasharray="5 5"/>`
  b += line(px - 22, py - 6, px + 22, py - 6, C.main, 4) + circ(px, py, 4, C.main)
  b += line(px, py, 245, 205)
  b += rect(215, 205, 75, 70, '#e8c9a0', C.main, 2.5, 3)
  b += circ(252, 240, 18, 'none', C.I, 2.5) + head(252 + 18, 240, -Math.PI / 2, C.I, 11, 6)
  b += arrow(300, 242, 360, 242, C.v, 3.5) + txt(332, 230, vi('v'), { fill: C.v, size: 21 })
  b += arrow(212, 288, 156, 288, C.F, 3.5) + txt(184, 318, vi('F') + subn('cản'), { fill: C.F, size: 20 })
  b += txt(330, 195, 'Tấm đồng', { size: 17, anchor: 'start' }) + txt(375, 285, '', {})
  b += txt(268, 140, 'dòng xoáy', { size: 16, fill: C.I, anchor: 'start' }).replace('x="268"', 'x="268"').replace('y="140"', 'y="132"').replace('<text', '<text opacity="0"')
  add('H065', 440, 330, b)
}

// ───────── H066 lõi ghép lá ─────────
{
  let b = ''
  for (let k = 0; k < 6; k++) {
    const y = 50 + k * 38
    b += rect(110, y, 250, 28, '#dfe4ea', C.main, 2, 3)
    b += rect(150, y + 6, 170, 16, 'none', C.I, 2.5, 8)
    b += head(235, y + 6, 0, C.I, 11, 6)
  }
  b += into(60, 150, 14, C.B) + txt(60, 190, vi('B'), { size: 21, fill: C.B })
  b += txt(235, 28, 'Lá thép silic mỏng, cách điện với nhau', { size: 17 })
  b += txt(235, 300, 'Dòng xoáy chỉ khép kín trong từng lá: rất nhỏ', { size: 17, fill: C.I })
  add('H066', 440, 320, b)
}

// ───────── H067 khung quay ─────────
{
  let b = ''
  const O = { x: 230, y: 150 }, th = 40 * Math.PI / 180
  b += rect(20, 100, 60, 100, C.N, C.main, 2) + txt(50, 160, 'N', { size: 26, fill: '#fff', weight: 'bold' })
  b += rect(380, 100, 60, 100, C.S, C.main, 2) + txt(410, 160, 'S', { size: 26, fill: '#fff', weight: 'bold' })
  for (const y of [115, 150, 185]) b += arrow(90, y, 370, y, C.B, 1.5).replace(/stroke-width="2.5"/g, 'stroke-width="1.5"')
  b += txt(230, 108, vi('B'), { size: 20, fill: C.B })
  // khung (nhìn cạnh): đoạn ⟂ n
  const ux = -Math.sin(th), uy = -Math.cos(th)
  b += line(O.x - 75 * ux, O.y + 75 * uy * -1 * -1 - 0, O.x + 75 * ux, O.y + 75 * uy, C.main, 6).replace(/y1="[^"]+"/, `y1="${f(O.y - 75 * uy)}"`)
  b += arrow(O.x, O.y, O.x + 85 * Math.cos(th), O.y - 85 * Math.sin(th), C.F, 3.5)
  b += txt(O.x + 100 * Math.cos(th) + 8, O.y - 100 * Math.sin(th), vec('n'), { size: 22, fill: C.F, anchor: 'start' })
  b += `<path d="M ${O.x + 50} ${O.y} A 50 50 0 0 0 ${f(O.x + 50 * Math.cos(th))} ${f(O.y - 50 * Math.sin(th))}" fill="none" stroke="${C.main}" stroke-width="2"/>`
  b += txt(O.x + 70, O.y - 8, 'ωt', { size: 18 })
  b += circ(O.x, O.y, 7, '#fff', C.main, 2) + circ(O.x, O.y, 2, C.main, C.main, 1)
  // chiều quay
  b += `<path d="M ${O.x + 40} ${O.y + 52} A 66 66 0 0 0 ${O.x - 20} ${O.y + 64}" fill="none" stroke="${C.v}" stroke-width="0"/>`
  b += `<path d="M ${O.x - 68} ${O.y - 60} A 90 90 0 0 1 ${O.x - 10} ${O.y - 92}" fill="none" stroke="${C.v}" stroke-width="3"/>` + head(O.x - 10, O.y - 92, 0.30, C.v, 12, 6)
  b += txt(O.x - 44, O.y - 100, 'ω', { size: 22, fill: C.v })
  b += txt(O.x - 95, O.y + 100, 'khung dây (nhìn từ trên xuống)', { size: 17, anchor: 'start' }).replace('x="135"', 'x="100"')
  b += txt(O.x - 100, O.y + 56, 'trục quay ⊙', { size: 16, anchor: 'start' })
  add('H067', 460, 280, b)
}

// ───────── đồ thị (H068, H069, H070) ─────────
const sinc = (x0, y0, w, A, T, fn, col, sw = 3) => {
  let d = ''
  for (let i = 0; i <= 200; i++) { const x = w * i / 200; d += `${i ? 'L' : 'M'} ${f(x0 + x)} ${f(y0 - A * fn(2 * Math.PI * x / T))} ` }
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}"/>`
}
function truc(x0, y0, w, h, nhanY, nhanX = 't') {
  return arrow(x0 - 10, y0, x0 + w, y0, C.main, 2) + arrow(x0, y0 + h, x0, y0 - h - 6, C.main, 2) + txt(x0 + w - 4, y0 + 24, vi(nhanX), { size: 21 }) + txt(x0 + 16, y0 - h - 6, nhanY, { size: 21, anchor: 'start' })
}
{
  // H068: Φ = Φ0 cos(ωt+φ), φ = π/3
  const x0 = 70, y0 = 135, A = 85, T = 280, w = 380
  let b = truc(x0, y0, w, A + 10, vi('Φ'))
  b += line(x0, y0 - A, x0 + w - 10, y0 - A, '#999', 1.2, 'stroke-dasharray="5 4"') + line(x0, y0 + A, x0 + w - 10, y0 + A, '#999', 1.2, 'stroke-dasharray="5 4"')
  b += txt(x0 - 8, y0 - A + 6, 'Φ' + subn('0'), { size: 19, anchor: 'end' }) + txt(x0 - 8, y0 + A + 6, '−Φ' + subn('0'), { size: 19, anchor: 'end' })
  b += sinc(x0, y0, 360, A, T, (a) => Math.cos(a + Math.PI / 3), C.B)
  // đỉnh kế tiếp ở t = (2π - π/3)/(2π) T
  const tp = T * (1 - 1 / 6)
  b += line(x0 + tp, y0 - A, x0 + tp, y0, '#999', 1.2, 'stroke-dasharray="5 4"') + txt(x0 + tp, y0 + 22, 'T − φ/ω', { size: 15, fill: '#555' }).replace('T − φ/ω', '')
  b += circ(x0, y0 - A / 2, 4, C.B, C.B, 1) + txt(x0 + 10, y0 - A / 2 - 8, 'Φ₀cosφ', { size: 16, anchor: 'start', fill: C.B })
  b += txt(x0 + 210, 28, 'Φ = Φ₀cos(ωt + φ)', { size: 19, fill: C.B })
  add('H068', 480, 270, b)
}
{
  // H069: Φ và e (φ = 0)
  const x0 = 60, y0 = 135, A = 80, T = 300, w = 400
  let b = truc(x0, y0, w, A + 12, '')
  b += sinc(x0, y0, 390, A, T, Math.cos, C.B) + sinc(x0, y0, 390, A, T, Math.sin, C.I)
  b += line(x0, y0 - A, x0 + T / 4, y0 - A, '#999', 1.2, 'stroke-dasharray="5 4"')
  b += line(x0 + T / 4, y0 - A, x0 + T / 4, y0, '#999', 1.2, 'stroke-dasharray="5 4"')
  b += arrow(x0, y0 - A - 12, x0 + T / 4, y0 - A - 12, C.main, 2) + txt(x0 + T / 8, y0 - A - 22, 'π/2', { size: 18 })
  b += txt(x0 - 6, y0 - A + 6, 'Φ₀', { size: 18, anchor: 'end', fill: C.B })
  b += txt(x0 + 150 - 24, y0 + A + 26, 'Φ', { size: 22, fill: C.B, weight: 'bold' }) + txt(x0 + 225 + 24, y0 + A + 26, 'e', { size: 22, fill: C.I, weight: 'bold' })
  b += txt(x0 + 250, 30, 'e trễ pha π/2 so với Φ', { size: 17 })
  add('H069', 480, 280, b)
}
{
  // H070 elip
  const cx = 210, cy = 135
  let b = arrow(cx - 150, cy, cx + 160, cy, C.main, 2) + arrow(cx, cy + 110, cx, cy - 115, C.main, 2)
  b += txt(cx + 168, cy + 8, 'Φ', { size: 22, anchor: 'start' }) + txt(cx + 16, cy - 105, 'e', { size: 22, anchor: 'start' })
  b += `<ellipse cx="${cx}" cy="${cy}" rx="110" ry="80" fill="${C.fill}" fill-opacity="0.6" stroke="${C.B}" stroke-width="3"/>`
  b += txt(cx + 118, cy + 24, 'Φ₀', { size: 18, anchor: 'start' }) + txt(cx - 118, cy + 24, '−Φ₀', { size: 18, anchor: 'end' })
  b += txt(cx + 8, cy - 86, 'E₀', { size: 18, anchor: 'start' }) + txt(cx + 8, cy + 98, '−E₀', { size: 18, anchor: 'start' })
  const a = 50 * Math.PI / 180, px = cx + 110 * Math.cos(a), py = cy - 80 * Math.sin(a)
  b += line(px, py, px, cy, '#777', 1.5, 'stroke-dasharray="5 4"') + line(px, py, cx, py, '#777', 1.5, 'stroke-dasharray="5 4"') + circ(px, py, 5, C.I, C.I, 1)
  b += txt(px + 8, cy + 20, 'Φ', { size: 17, anchor: 'start' }) + txt(cx - 6, py + 6, 'e', { size: 17, anchor: 'end' })
  b += txt(cx, 262, '(Φ/Φ₀)² + (e/E₀)² = 1', { size: 19, fill: C.B })
  add('H070', 420, 280, b)
}

// ───────── H071 máy phát một pha: p=1, p=2 ─────────
function dongCuon(cx, cy, ang, R = 118) { // cuộn nhỏ (gợi hình xoắn) trên vành stato
  const x = cx + R * Math.cos(ang), y = cy - R * Math.sin(ang), deg = -ang * 180 / Math.PI + 90
  let d = 'M -20 0 '
  for (let i = 0; i < 4; i++) d += `a 5 9 0 1 1 10 0 `.replace('10 0', '10 0')
  return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(deg)})"><rect x="-22" y="-12" width="44" height="24" fill="#fff" stroke="${C.I}" stroke-width="2.5" rx="4"/>` +
    [-12, -4, 4, 12].map((u) => `<line x1="${u}" y1="-12" x2="${u}" y2="12" stroke="${C.I}" stroke-width="2.5"/>`).join('') + '</g>'
}
function roto(cx, cy, cuc) { // cuc: mảng ['N','S',...] góc từ trên theo chiều kim đồng hồ
  let b = ''
  cuc.forEach((k, i) => {
    const ang = Math.PI / 2 - i * 2 * Math.PI / cuc.length
    const x = cx + 52 * Math.cos(ang), y = cy - 52 * Math.sin(ang)
    b += `<g transform="translate(${f(x)},${f(y)}) rotate(${f(-ang * 180 / Math.PI + 90)})"><rect x="-24" y="-24" width="48" height="48" rx="6" fill="${k === 'N' ? C.N : C.S}" stroke="${C.main}" stroke-width="2"/><text x="0" y="8" text-anchor="middle" fill="#fff" font-family="${FONT}" font-size="22" font-weight="bold" stroke="none" transform="rotate(${f(ang * 180 / Math.PI - 90)})">${k}</text></g>`
  })
  b += circ(cx, cy, 8, '#fff', C.main, 2)
  return b
}
{
  const cx = 190, cy = 160
  let b = circ(cx, cy, 118, 'none', C.main, 3) + roto(cx, cy, ['N', 'S'])
  for (const a of [Math.PI / 2, -Math.PI / 2]) b += dongCuon(cx, cy, a, 118)
  b += `<path d="M ${cx - 90} ${cy - 100} A 130 130 0 0 1 ${cx - 40} ${cy - 128}" fill="none" stroke="${C.v}" stroke-width="0"/>`
  add('H071_1', 380, 330, b + txt(cx, 322, '1 cặp cực (p = 1)', { size: 18 }))
}
{
  const cx = 190, cy = 160
  let b = circ(cx, cy, 118, 'none', C.main, 3) + roto(cx, cy, ['N', 'S', 'N', 'S'])
  for (let k = 0; k < 4; k++) b += dongCuon(cx, cy, Math.PI / 2 - k * Math.PI / 2, 118)
  add('H071_2', 380, 330, b + txt(cx, 322, '2 cặp cực (p = 2)', { size: 18 }))
}
// ───────── H072 ba pha ─────────
{
  const cx = 200, cy = 175
  let b = circ(cx, cy, 118, 'none', C.main, 3, ) + roto(cx, cy, ['N', 'S'])
  const angs = [90, 210, 330].map((d) => d * Math.PI / 180)
  angs.forEach((a, i) => {
    b += dongCuon(cx, cy, a, 118)
    const x = cx + 150 * Math.cos(a), y = cy - 150 * Math.sin(a)
    b += txt(x, y + 6, `e${['₁', '₂', '₃'][i]}`, { size: 20, fill: C.I })
  })
  b += txt(cx, 345, 'Ba cuộn lệch nhau 1/3 vòng tròn (120°)', { size: 17 })
  add('H072', 400, 362, b)
}

for (const [ten, w, h, s] of hinh) { await luu(OUT, ten, w, h, s); console.log('ok', ten) }
