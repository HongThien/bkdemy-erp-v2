// TRẠM VE5 — 24 hình lý thuyết Vật lý 12 phần hạt nhân (vẽ bằng SVG, xuất PNG 2x)
import { luu } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'anh')

const INK = '#222', BL = '#2f5bd3', RD = '#d33a2c', GR = '#1f7a4d', OR = '#b35c00', GY = '#8a93a3'
const f = (n) => Math.round(n * 100) / 100
const fx = (s) => String(s)
  .replace(/_\{([^}]*)\}/g, '<tspan baseline-shift="sub" font-size="75%">$1</tspan>')
  .replace(/\^\{([^}]*)\}/g, '<tspan baseline-shift="super" font-size="75%">$1</tspan>')
  .replace(/~([^~]*)~/g, '<tspan font-style="italic">$1</tspan>')
const tx = (x, y, s, o = {}) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${o.a || 'middle'}" font-size="${o.sz || 20}" fill="${o.c || INK}" font-weight="${o.b ? 'bold' : 'normal'}" stroke="none" font-family="Arial, sans-serif">${fx(s)}</text>`
const line = (x1, y1, x2, y2, c = INK, w = 2, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`
const head = (x, y, ang, c, h = 10) => {
  const a = Math.PI * 0.86
  const p1 = [x + h * Math.cos(ang + a), y + h * Math.sin(ang + a)], p2 = [x + h * Math.cos(ang - a), y + h * Math.sin(ang - a)]
  return `<polygon points="${f(x)},${f(y)} ${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])}" fill="${c}" stroke="none"/>`
}
const arrow = (x1, y1, x2, y2, c = INK, w = 2.5, h = 11) => {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  return line(x1, y1, x2 - Math.cos(ang) * h * 0.6, y2 - Math.sin(ang) * h * 0.6, c, w) + head(x2, y2, ang, c, h)
}
const polyline = (pts, c, w = 2.5, arrowEnd = true, extra = '') => {
  const d = 'M ' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L ')
  let s = `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`
  if (arrowEnd) { const n = pts.length, a = pts[n - 1], b = pts[Math.max(0, n - 4)]; s += head(a[0], a[1], Math.atan2(a[1] - b[1], a[0] - b[0]), c, 11) }
  return s
}
const ball = (x, y, r, fill, stroke = INK, w = 2, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`
const proton = (x, y, r = 12) => ball(x, y, r, RD, '#8f2018', 1.5) + tx(x, y + r * 0.5, '+', { sz: r * 1.6, c: '#fff', b: true })
const neutron = (x, y, r = 12) => ball(x, y, r, '#98a1b3', '#5d6678', 1.5) + tx(x, y + r * 0.42, '0', { sz: r * 1.2, c: '#fff', b: true })
const electron = (x, y, r = 8) => ball(x, y, r, BL, '#1d3c99', 1.5) + tx(x, y + r * 0.6, '−', { sz: r * 1.9, c: '#fff', b: true })
const rect = (x, y, w, h, fill, stroke = INK, sw = 2) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
const doc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`
const out = async (ten, w, h, body) => { await luu(DIR, ten, w, h, doc(w, h, body)); console.log('ok', ten, w + 'x' + h) }
const dashed = (s) => s.replace('/>', ' stroke-dasharray="6 5"/>')

// kí hiệu hạt nhân  A/Z X  (căn giữa quanh cx, baseline y)
function nuc(cx, y, A, Z, sym, sz = 22, c = INK) {
  const nw = Math.max(String(A).length, String(Z).length) * sz * 0.5, sw = sym.length * sz * 0.62
  const x0 = cx - (nw + sw) / 2
  return tx(x0, y - sz * 0.45, A, { sz: sz * 0.7, a: 'start', c }) + tx(x0, y + sz * 0.3, Z, { sz: sz * 0.7, a: 'start', c }) + tx(x0 + nw + 1, y, sym, { sz, a: 'start', c })
}

// quỹ đạo hạt α trong trường Coulomb đẩy (mô phỏng số). Hạt nhân tại (cx,cy); đi từ trái sang, thông số va chạm b (phía trên)
function scatter(cx, cy, b, b90, xStart, xEnd) {
  const K = b90, pts = []
  let x = xStart - cx, y = -b, vx = 1, vy = 0
  const dt = 0.5
  for (let i = 0; i < 40000; i++) {
    const r = Math.hypot(x, y), a = K / (r * r * r)
    vx += a * x * dt; vy += a * y * dt
    x += vx * dt; y += vy * dt
    if (i % 6 === 0) pts.push([cx + x, cy + y])
    if (x + cx > xEnd || x + cx < xStart - 5 || Math.abs(y) > 400) break
  }
  return pts
}
const clipPts = (pts, x0, y0, x1, y1) => { const o = []; for (const p of pts) { if (p[0] < x0 || p[0] > x1 || p[1] < y0 || p[1] > y1) break; o.push(p) } return o }

// ───────── H085 mô hình bánh mận ─────────
async function H085() {
  const cx = 170, cy = 170, R = 128
  let b = ball(cx, cy, R, '#fbe4e1', INK, 2.5)
  const els = [[-70, -50], [30, -85], [75, -20], [60, 55], [-10, 80], [-75, 40], [-20, -5], [-90, -5]]
  for (let gy = -R; gy <= R; gy += 30) for (let gx = -R; gx <= R; gx += 30) {
    const ox = gx + (Math.round(gy / 30) % 2 ? 15 : 0)
    if (Math.hypot(ox, gy) > R - 16) continue
    if (els.some(([ex, ey]) => Math.hypot(ox - ex, gy - ey) < 24)) continue
    b += tx(cx + ox, cy + gy + 7, '+', { sz: 22, c: '#e08a82', b: true })
  }
  for (const [ex, ey] of els) b += electron(cx + ex, cy + ey, 11)
  b += arrow(330, 95, cx + 100, cy - 60, INK, 1.8, 9) + tx(335, 90, 'Điện tích dương', { a: 'start' }) + tx(335, 113, 'phân bố đều', { a: 'start' })
  b += arrow(330, 255, cx + 62, cy + 62, INK, 1.8, 9) + tx(335, 250, 'Electron (−)', { a: 'start' }) + tx(335, 273, 'nhúng trong quả cầu', { a: 'start' })
  await out('H085', 560, 340, b)
}

// ───────── H086 thí nghiệm tán xạ α ─────────
async function H086() {
  const fx0 = 280, fy = 200, Rs = 150
  const arcPt = (deg, r = Rs) => [fx0 + r * Math.cos(deg * Math.PI / 180), fy - r * Math.sin(deg * Math.PI / 180)]
  const a0 = arcPt(-158), a1 = arcPt(158)
  let b = `<path d="M ${f(a0[0])} ${f(a0[1])} A ${Rs} ${Rs} 0 1 0 ${f(a1[0])} ${f(a1[1])}" fill="none" stroke="#7d8ba8" stroke-width="7"/>`
  b += line(fx0, fy - 42, fx0, fy + 42, '#d9a400', 7)
  b += rect(28, fy - 26, 58, 52, '#9aa3b2', INK, 2) + rect(40, fy - 12, 22, 24, '#f2b24b', INK, 1.5) + tx(51, fy + 6, 'Po', { sz: 15, b: true })
  b += arrow(86, fy, fx0 - 8, fy, OR, 2.5, 10)
  const sc = (deg) => { const p = arcPt(deg, Rs - 12); return arrow(fx0 + 4, fy, p[0], p[1], OR, 2.3, 10) }
  b += arrow(fx0 + 4, fy, fx0 + Rs - 12, fy, OR, 2.5, 10)
  b += sc(12) + sc(-14) + sc(35) + sc(-48) + sc(118) + sc(152)
  b += tx(58, fy - 36, 'Nguồn α') + tx(fx0, fy + 72, 'Lá vàng')
  b += tx(fx0 + 112, fy - 130, 'Màn huỳnh quang', { a: 'start' }) + line(fx0 + 150, fy - 120, fx0 + 118, fy - 100, INK, 1.5)
  b += tx(165, fy - 14, 'chùm hạt α', { c: OR })
  await out('H086', 560, 400, b)
}

// ───────── H087 so sánh Thomson / Rutherford ─────────
async function H087() {
  let b = ''
  const c1 = [135, 150], R1 = 82
  b += ball(c1[0], c1[1], R1, '#fbe4e1')
  for (const [dx, dy] of [[-45, -30], [10, -52], [48, -10], [30, 40], [-20, 52], [-52, 22], [-6, 0]]) b += electron(c1[0] + dx, c1[1] + dy, 9)
  for (const [dx, dy] of [[-28, -14], [28, -34], [-54, -4], [10, 20], [52, 24], [-26, 30], [30, 6], [-4, -34]]) b += tx(c1[0] + dx, c1[1] + dy + 6, '+', { sz: 18, c: '#e08a82', b: true })
  b += polyline([[10, 110], [60, 110], [135, 114], [210, 120], [262, 124]], OR, 2.6)
  b += tx(135, 285, 'Mô hình Thomson', { sz: 21, b: true }) + tx(135, 309, 'α lệch rất ít', { c: OR })
  const c2 = [415, 150], R2 = 82, flip = (pts) => pts.map(([x, y]) => [x, 2 * c2[1] - y])
  b += dashed(ball(c2[0], c2[1], R2, 'none', GY, 1.8))
  for (const [ang, rr] of [[40, 70], [160, 60], [265, 74]]) b += electron(c2[0] + rr * Math.cos(ang * Math.PI / 180), c2[1] - rr * Math.sin(ang * Math.PI / 180), 7)
  b += polyline(clipPts(scatter(c2[0], c2[1], 84, 16, 292, 560), 285, 15, 556, 280), OR, 2.4)
  b += polyline(clipPts(scatter(c2[0], c2[1], 40, 16, 292, 560), 285, 15, 556, 280), OR, 2.4)
  b += polyline(clipPts(flip(scatter(c2[0], c2[1], 5, 16, 292, 560)), 285, 15, 556, 290), OR, 2.4)
  b += ball(c2[0], c2[1], 8, RD, '#8f2018', 1.5)
  b += tx(c2[0] + 12, c2[1] + 28, 'hạt nhân (+)', { sz: 17, a: 'start', c: RD })
  b += tx(415, 285, 'Mô hình Rutherford', { sz: 21, b: true }) + tx(415, 309, 'α lệch góc lớn', { c: OR })
  await out('H087', 560, 325, b)
}

// ───────── H088 mô hình hành tinh nguyên tử ─────────
async function H088() {
  const cx = 270, cy = 190
  let b = `<ellipse cx="${cx}" cy="${cy}" rx="140" ry="52" fill="none" stroke="${GY}" stroke-width="1.8" stroke-dasharray="6 5" transform="rotate(-25 ${cx} ${cy})"/>`
  b += dashed(ball(cx, cy, 95, 'none', GY, 1.8))
  b += electron(cx + 93 * Math.cos(2.1), cy - 93 * Math.sin(2.1), 10) + electron(cx + 95 * Math.cos(-0.5), cy - 95 * Math.sin(-0.5), 10)
  const r25 = -25 * Math.PI / 180, ex = 140 * Math.cos(3.7), ey = 52 * Math.sin(3.7)
  b += electron(cx + ex * Math.cos(r25) - ey * Math.sin(r25), cy + ex * Math.sin(r25) + ey * Math.cos(r25), 10)
  const flip = (pts) => pts.map(([x, y]) => [x, 2 * cy - y])
  b += polyline(clipPts(scatter(cx, cy, 150, 22, 14, 548), 8, 8, 552, 372), OR, 2.4)
  b += polyline(clipPts(scatter(cx, cy, 60, 22, 14, 548), 8, 8, 552, 372), OR, 2.4)
  b += polyline(clipPts(flip(scatter(cx, cy, 4, 22, 14, 548)), 8, 8, 552, 372), OR, 2.4)
  b += ball(cx, cy, 11, RD, '#8f2018', 1.5) + tx(cx, cy + 7, '+', { sz: 20, c: '#fff', b: true })
  const halo = (x, y, s, o) => tx(x, y, s, o).replace('stroke="none"', 'stroke="#fff" stroke-width="5" paint-order="stroke"')
  b += halo(cx + 14, cy + 6, 'hạt nhân', { sz: 18, a: 'start', c: RD }).replace(`x="${f(cx + 14)}" y="${f(cy + 6)}"`, `x="${f(cx + 16)}" y="${f(cy + 8)}"`)
  b += halo(cx + 108, cy - 100, 'electron', { sz: 19, a: 'start', c: BL })
  b += tx(18, cy - 128, 'hạt α', { a: 'start', c: OR })
  await out('H088', 560, 305, b)
}

// ───────── H089 cấu trúc hạt nhân ─────────
function nucleons(cx, cy, r, assign) {
  const pos = [[0, 0]]
  for (let i = 0; i < 6; i++) pos.push([2 * r * 1.02 * Math.cos(i * Math.PI / 3 + 0.3), 2 * r * 1.02 * Math.sin(i * Math.PI / 3 + 0.3)])
  return pos.map((p, i) => (assign[i] === 'p' ? proton : neutron)(cx + p[0], cy + p[1], r)).join('')
}
async function H089() {
  const ax = 105, ay = 160, nx = 400, ny = 160, NR = 100
  let b = ball(ax, ay, 44, 'none', GY, 1.8) + ball(ax, ay, 82, 'none', GY, 1.8)
  b += electron(ax - 44, ay, 8) + electron(ax + 31, ay + 31, 8) + electron(ax + 58, ay - 58, 8) + ball(ax, ay, 5, RD, '#8f2018', 1)
  b += ball(nx, ny, NR, '#fdf1f0', INK, 2)
  b += line(ax + 4, ay - 4, nx - 62, ny - 78, GY, 1.4, 'stroke-dasharray="5 4"') + line(ax + 4, ay + 4, nx - 62, ny + 78, GY, 1.4, 'stroke-dasharray="5 4"')
  b += nucleons(nx, ny, 22, ['p', 'n', 'p', 'n', 'p', 'n', 'n'])
  b += tx(ax, 270, 'Nguyên tử') + tx(ax, 293, '(Z electron ở vỏ)', { sz: 17, c: '#555' })
  b += tx(nx, 290, 'Hạt nhân: ~A~ = ~Z~ + ~N~')
  b += electron(40, 332, 8) + tx(56, 338, 'electron', { sz: 18, a: 'start' }) + proton(190, 332, 10) + tx(206, 338, 'proton (Z)', { sz: 18, a: 'start' }) + neutron(330, 332, 10) + tx(346, 338, 'neutron (N)', { sz: 18, a: 'start' })
  await out('H089', 560, 355, b)
}

// ───────── H090 đồng vị hydrogen ─────────
async function H090() {
  let b = ''
  const cols = [[95, 'p', 'Hydrogen thường', 1], [285, 'pn', 'Đơteri (nặng)', 2], [475, 'pnn', 'Triti (siêu nặng)', 3]]
  for (const [cx, set, name, A] of cols) {
    const cy = 100
    b += dashed(ball(cx, cy, 62, 'none', GY, 1.8)) + electron(cx + 62 * Math.cos(0.9), cy - 62 * Math.sin(0.9), 9)
    const pos = set === 'p' ? [[0, 0]] : set === 'pn' ? [[-11, 0], [11, 0]] : [[-11, 9], [11, 9], [0, -10]]
    const kind = set === 'p' ? ['p'] : set === 'pn' ? ['p', 'n'] : ['p', 'n', 'n']
    pos.forEach((p, i) => { b += (kind[i] === 'p' ? proton : neutron)(cx + p[0], cy + p[1], 11) })
    b += nuc(cx, 215, A, 1, 'H', 26) + tx(cx, 252, name, { sz: 19 }) + tx(cx, 276, `Z = 1, N = ${A - 1}`, { sz: 18, c: '#555' })
  }
  b += proton(150, 316, 9) + tx(165, 322, 'proton', { sz: 17, a: 'start' }) + neutron(260, 316, 9) + tx(275, 322, 'neutron', { sz: 17, a: 'start' }) + electron(380, 316, 8) + tx(394, 322, 'electron', { sz: 17, a: 'start' })
  await out('H090', 560, 340, b)
}

// ───────── H091 năng lượng liên kết ─────────
async function H091() {
  const yTop = 90, yBot = 255
  let b = line(20, yTop, 250, yTop, INK, 2.2) + line(20, yBot, 250, yBot, INK, 2.2)
  for (const [x, dy, k] of [[50, -38, 'p'], [105, -52, 'n'], [165, -42, 'p'], [220, -30, 'n']]) b += (k === 'p' ? proton : neutron)(x, yTop + dy, 14)
  b += nucleons(135, yBot - 40, 12, ['p', 'n', 'p', 'n', 'p', 'n', 'n'])
  b += tx(135, yTop + 28, 'nucleon riêng rẽ') + tx(135, yTop + 52, '~Z~·~m~_{p} + (~A~−~Z~)·~m~_{n}', { sz: 19, c: '#444' })
  b += tx(135, yBot + 28, 'hạt nhân (đã liên kết)') + tx(135, yBot + 52, '~m~ < tổng khối lượng nucleon', { sz: 18, c: '#444' })
  b += arrow(300, yBot - 6, 300, yTop + 6, RD, 3, 12) + tx(316, 150, 'Phải cung cấp ΔE', { a: 'start', c: RD }) + tx(316, 173, 'để phá hạt nhân', { a: 'start', c: RD })
  b += arrow(270, yTop + 6, 270, yBot - 6, GR, 3, 12)
  b += tx(316, 214, 'Toả ΔE khi nucleon', { a: 'start', c: GR }) + tx(316, 237, 'liên kết thành hạt nhân', { a: 'start', c: GR })
  b += tx(316, 100, 'ΔE = Δ~m~·~c~²', { sz: 24, a: 'start', b: true })
  await out('H091', 560, 335, b)
}

// ───────── H092 đồ thị ε theo A ─────────
function smoothPath(pts) {
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}
async function H092() {
  const ox = 70, oy = 310, W = 450, Hh = 260
  const X = (A) => ox + A / 250 * W, Y = (e) => oy - e / 10 * Hh
  let b = ''
  for (const e of [2, 4, 6, 8]) b += line(ox, Y(e), ox + W, Y(e), '#e3e6ec', 1)
  b += `<rect x="${f(X(35))}" y="${f(Y(9.4))}" width="${f(X(95) - X(35))}" height="${f(Y(0) - Y(9.4))}" fill="${GR}" fill-opacity="0.10" stroke="none"/>`
  b += arrow(ox, oy, ox + W + 25, oy, INK, 2, 10) + arrow(ox, oy, ox, oy - Hh - 20, INK, 2, 10)
  for (const A of [50, 100, 150, 200, 250]) b += line(X(A), oy, X(A), oy + 6, INK, 1.5) + tx(X(A), oy + 26, A, { sz: 17 })
  for (const e of [2, 4, 6, 8]) b += line(ox - 6, Y(e), ox, Y(e), INK, 1.5) + tx(ox - 10, Y(e) + 6, e, { sz: 17, a: 'end' })
  const data = [[6, 5.33], [12, 7.68], [20, 8.03], [30, 8.45], [40, 8.55], [56, 8.79], [90, 8.72], [120, 8.5], [160, 8.2], [200, 7.89], [238, 7.57]]
  b += `<path d="${smoothPath(data.map(([A, e]) => [X(A), Y(e)]))}" fill="none" stroke="${BL}" stroke-width="3.2"/>`
  b += ball(X(56), Y(8.79), 5.5, RD, RD, 1) + tx(X(56) + 12, Y(8.79) - 12, 'Fe-56', { sz: 18, a: 'start', c: RD })
  b += ball(X(238), Y(7.57), 5, INK, INK, 1) + tx(X(238) - 8, Y(7.57) + 26, 'U-238', { sz: 18, a: 'end' })
  b += ball(X(6), Y(5.33), 5, INK, INK, 1) + tx(X(6) + 10, Y(5.33) + 22, 'Li-6', { sz: 17, a: 'start' })
  b += tx(X(65), Y(3), 'bền vững nhất', { c: GR, b: true }) + tx(X(65), Y(2), '(A trung bình)', { sz: 18, c: GR })
  b += tx(ox + 4, oy - Hh - 28, 'ε (MeV/nucleon)', { sz: 19, a: 'start' }) + tx(ox + W + 22, oy - 12, '~A~', { sz: 21 })
  await out('H092', 560, 360, b)
}

// ───────── H093 phản ứng hạt nhân Rutherford ─────────
async function H093() {
  let b = ball(55, 150, 19, '#f2b24b', '#a8741a') + arrow(80, 150, 148, 150, OR, 2.6, 11) + ball(185, 150, 30, '#c9d3e6', '#5d6678')
  b += nuc(55, 215, 4, 2, 'He', 24) + tx(55, 242, 'hạt α', { sz: 18 }) + nuc(185, 215, 14, 7, 'N', 24) + tx(185, 242, 'đứng yên', { sz: 18 })
  b += tx(120, 295, 'Trước', { sz: 21, b: true })
  b += arrow(245, 150, 300, 150, INK, 3, 13)
  b += ball(400, 200, 31, '#f4c7c2', '#8f2018') + arrow(425, 222, 455, 250, OR, 2.4, 10)
  b += ball(420, 90, 12, RD, '#8f2018', 1.5) + arrow(432, 80, 490, 48, OR, 2.6, 11)
  b += nuc(400, 280, 17, 8, 'O', 24) + nuc(505, 100, 1, 1, 'H', 22) + tx(505, 126, '(proton)', { sz: 17 })
  b += tx(410, 335, 'Sau', { sz: 21, b: true })
  await out('H093', 560, 350, b)
}

// ───────── H094 năng lượng thu/toả ─────────
async function H094() {
  const panel = (x0, hiBefore) => {
    const yHi = 90, yLo = 215, yB = hiBefore ? yHi : yLo, yA = hiBefore ? yLo : yHi
    let s = line(x0, yB, x0 + 90, yB, INK, 2.5) + line(x0 + 150, yA, x0 + 240, yA, INK, 2.5)
    s += tx(x0 + 45, yB - 36, 'Trước', { sz: 18 }) + tx(x0 + 45, yB - 14, '~m~_{tr}&#160;~c~²', { sz: 19, c: '#444' })
    s += tx(x0 + 195, yA + (hiBefore ? 28 : -28), 'Sau', { sz: 18 }) + tx(x0 + 195, yA + (hiBefore ? 50 : -8), '~m~_{s}&#160;~c~²', { sz: 19, c: '#444' })
    s += arrow(x0 + 90, yB, x0 + 150, yA, hiBefore ? GR : RD, 3, 13)
    return s
  }
  let b = panel(30, true) + panel(310, false)
  b += tx(150, 290, '~W~ > 0', { sz: 24, b: true, c: GR }) + tx(150, 316, 'phản ứng toả năng lượng', { sz: 19, c: GR })
  b += tx(430, 290, '~W~ < 0', { sz: 24, b: true, c: RD }) + tx(430, 316, 'phản ứng thu năng lượng', { sz: 19, c: RD })
  b += tx(150, 45, '~m~_{tr} > ~m~_{s}', { sz: 21 }) + tx(430, 45, '~m~_{tr} < ~m~_{s}', { sz: 21 })
  b += line(280, 25, 280, 330, '#ccd', 1.5, 'stroke-dasharray="5 5"')
  await out('H094', 560, 340, b)
}

// ───────── H095 phân hạch ─────────
async function H095() {
  let b = ball(22, 150, 8, '#98a1b3', '#5d6678', 1.5) + arrow(32, 150, 68, 150, OR, 2.4, 10)
  b += ball(110, 150, 34, '#c9d3e6', '#5d6678') + nuc(110, 158, 235, 92, 'U', 21)
  b += tx(4, 210, 'neutron chậm', { sz: 17, a: 'start' })
  b += arrow(150, 150, 195, 150, INK, 3, 12)
  b += `<circle cx="245" cy="150" r="38" fill="#e8d6ee" stroke="${INK}" stroke-width="2.2" stroke-dasharray="3 3"/>` + nuc(245, 158, 236, 92, 'U*', 21) + tx(245, 212, 'kích thích', { sz: 17 })
  b += arrow(290, 150, 335, 150, INK, 3, 12)
  b += ball(385, 88, 26, '#b9d3c4', '#4a7a5e') + nuc(385, 96, 95, 39, 'Y', 19)
  b += ball(415, 218, 30, '#e3cfb0', '#8a6d3a') + nuc(415, 226, 138, 53, 'I', 19)
  b += arrow(368, 66, 345, 40, GR, 2.2, 9) + arrow(432, 246, 448, 272, GR, 2.2, 9)
  for (const [dy, tag] of [[-48, 0], [0, 1], [48, 2]]) b += ball(445, 153, 6, '#98a1b3', '#5d6678', 1.4) + arrow(452, 153, 535, 153 + dy, OR, 2.2, 9)
  b += tx(500, 215, '3 neutron', { sz: 17 })
  b += tx(280, 305, 'Năng lượng toả ra ≈ 200 MeV', { b: true, c: RD })
  await out('H095', 560, 325, b)
}

// ───────── H096 phản ứng dây chuyền ─────────
async function H096() {
  const cols = [70, 240, 410], R = 22, ys = [[170], [105, 235], [65, 145, 205, 285]]
  let b = arrow(6, 170, 44, 170, OR, 2.4, 10)
  for (let c = 0; c < 2; c++) ys[c].forEach((py, i) => { for (const j of [2 * i, 2 * i + 1]) b += arrow(cols[c] + R, py, cols[c + 1] - R - 2, ys[c + 1][j], OR, 2.2, 9) })
  ys[2].forEach((py) => { b += arrow(cols[2] + R, py, cols[2] + R + 42, py - 12, OR, 2.2, 9) + arrow(cols[2] + R, py, cols[2] + R + 42, py + 12, OR, 2.2, 9) })
  cols.forEach((cx, c) => ys[c].forEach((py) => { b += ball(cx, py, R, '#c9d3e6', '#5d6678') + tx(cx, py + 7, 'U', { b: true }) }))
  b += tx(70, 335, '1 phân hạch', { sz: 18 }) + tx(240, 335, '2 phân hạch', { sz: 18 }) + tx(410, 335, '4 phân hạch', { sz: 18 }) + tx(510, 335, '…', { sz: 22 })
  b += tx(10, 24, '~k~ = 2:', { a: 'start', b: true, c: RD }) + tx(88, 24, 'mỗi phân hạch gây thêm 2 phân hạch', { sz: 18, a: 'start', c: '#444' })
  await out('H096', 540, 355, b)
}

// ───────── lò phản ứng ─────────
function lo(strong) {
  const X0 = 50, Y0 = 62, W = 230, H = 210
  let b = `<defs><pattern id="hx" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#e4e4e4"/><line x1="0" y1="0" x2="0" y2="9" stroke="#9a9a9a" stroke-width="2"/></pattern></defs>`
  b += `<rect x="${X0 - 24}" y="${Y0 - 14}" width="${W + 48}" height="${H + 38}" fill="url(#hx)" stroke="${INK}" stroke-width="2.2"/>`
  b += rect(X0, Y0, W, H, '#8d93a0', INK, 2)
  ;[X0 + 28, X0 + 84, X0 + 140, X0 + 196].forEach((x) => { b += rect(x - 10, Y0 + 14, 20, H - 28, strong ? '#e0302a' : '#c8402f', '#7a1a12', strong ? 3 : 2) })
  ;[[X0 + 56, 130], [X0 + 112, 70], [X0 + 168, 130]].forEach(([x, d]) => { b += rect(x - 6, Y0 - 48, 12, 48 + d, '#3d6fd6', '#1d3c99', 1.8) + rect(x - 13, Y0 - 54, 26, 8, '#555', INK, 1.5) })
  return { b, X0, Y0, W, H }
}
async function H097() {
  const { b: b0, X0, Y0, W, H } = lo(false)
  let b = b0
  b += arrow(345, Y0 + H - 40, X0 + 196 + 12, Y0 + H - 40, INK, 1.6, 8) + tx(350, Y0 + H - 34, 'Thanh uranium', { sz: 18, a: 'start' })
  b += arrow(345, Y0 + 80, X0 + 150, Y0 + 80, INK, 1.6, 8) + tx(350, Y0 + 87, 'Than chì', { sz: 18, a: 'start' }) + tx(350, Y0 + 108, '(chất điều tiết)', { sz: 18, a: 'start' })
  b += arrow(345, Y0 - 16, X0 + 168 + 8, Y0 - 16, INK, 1.6, 8) + tx(350, Y0 - 10, 'Thanh cadmium', { sz: 18, a: 'start' }) + tx(350, Y0 + 11, '(điều khiển)', { sz: 18, a: 'start' })
  b += arrow(345, Y0 + H + 14, X0 + W + 18, Y0 + H + 10, INK, 1.6, 8) + tx(350, Y0 + H + 21, 'Xi măng bảo vệ', { sz: 18, a: 'start' })
  await out('H097', 560, 315, b)
}
async function H099() {
  const { b: b0, X0, Y0, H } = lo(true)
  let b = b0
  b += arrow(345, Y0 + H - 60, X0 + 196 + 12, Y0 + H - 60, RD, 2, 9) + tx(350, Y0 + H - 78, 'Thanh uranium', { sz: 19, a: 'start', c: RD, b: true }) + tx(350, Y0 + H - 54, 'U tự nhiên hoặc', { sz: 17, a: 'start' }) + tx(350, Y0 + H - 34, 'U làm giàu', { sz: 17, a: 'start' }) + tx(350, Y0 + H - 14, '(^{235}U: 2–4%)', { sz: 17, a: 'start' })
  b += tx(350, Y0 + 40, 'Phản ứng dây chuyền', { sz: 17, a: 'start', c: '#444' }) + tx(350, Y0 + 61, 'có kiểm soát', { sz: 17, a: 'start', c: '#444' })
  await out('H099', 560, 315, b)
}
async function H100() {
  let b = rect(130, 40, 320, 250, '#c3c7cf', INK, 2)
  b += rect(40, 100, 60, 130, '#c8402f', '#7a1a12', 2) + rect(470, 100, 60, 130, '#c8402f', '#7a1a12', 2)
  const P = [[100, 160], [200, 160], [250, 215], [305, 165], [340, 110], [392, 185], [468, 222]]
  const w = [3.8, 3, 2.4, 2, 1.7, 1.4]
  for (let i = 0; i < 6; i++) b += polyline([P[i], P[i + 1]], OR, w[i], i === 5)
  for (const [x, y] of [...P.slice(1, 6), [185, 90], [430, 110], [300, 262], [235, 105]]) b += ball(x, y, 11, '#6e7480', '#444', 1.4)
  b += tx(70, 175, 'U', { sz: 24, b: true, c: '#fff' }) + tx(500, 175, 'U', { sz: 24, b: true, c: '#fff' })
  b += tx(140, 144, 'neutron nhanh', { sz: 18, c: OR, b: true, a: 'start' }) + tx(395, 268, 'neutron chậm', { sz: 18, c: OR, b: true })
  b += tx(290, 62, 'Than chì (chất điều tiết)') + tx(70, 90, 'phân hạch', { sz: 17 }) + tx(500, 90, 'phân hạch', { sz: 17 })
  b += tx(280, 318, 'va chạm với nguyên tử C → neutron mất dần động năng', { sz: 17, c: '#444' })
  await out('H100', 560, 335, b)
}
async function H101() {
  const panel = (x0, inside) => {
    let s = rect(x0, 55, 250, 200, '#b5bac4', INK, 2)
    s += rect(x0 + 22, 85, 26, 140, '#c8402f', '#7a1a12', 2) + rect(x0 + 202, 85, 26, 140, '#c8402f', '#7a1a12', 2)
    s += tx(x0 + 35, 211, 'U', { sz: 19, b: true, c: '#fff' }) + tx(x0 + 215, 211, 'U', { sz: 19, b: true, c: '#fff' })
    const top = inside ? 30 : 8, bot = inside ? 225 : 80
    s += rect(x0 + 112, top, 26, bot - top, '#3d6fd6', '#1d3c99', 2) + rect(x0 + 104, top - 8, 42, 8, '#555', INK, 1.5)
    if (inside) s += arrow(x0 + 50, 150, x0 + 106, 150, OR, 2.6, 10) + tx(x0 + 122, 157, '×', { sz: 30, c: RD, b: true }).replace('x="' + f(x0 + 122) + '"', 'x="' + f(x0 + 125) + '"')
    else s += arrow(x0 + 50, 170, x0 + 198, 170, OR, 2.6, 10)
    return s
  }
  let b = `<g transform="translate(0,30)">${panel(20, true) + panel(300, false)}</g>`
  b += tx(145, 315, 'Thanh Cd cắm sâu', { sz: 20, b: true }) + tx(145, 339, 'hấp thụ nhiều neutron', { sz: 18 }) + tx(145, 363, 'phản ứng chậm lại', { sz: 18, c: GR, b: true })
  b += tx(425, 315, 'Rút thanh Cd ra', { sz: 20, b: true }) + tx(425, 339, 'neutron tới thanh U khác', { sz: 18 }) + tx(425, 363, 'phản ứng nhanh lên', { sz: 18, c: RD, b: true })
  await out('H101', 560, 380, b)
}

// ───────── H098 nhiệt hạch ─────────
async function H098() {
  let b = ball(55, 80, 17, '#f4c7c2', '#8f2018') + arrow(80, 92, 150, 128, OR, 2.6, 11) + nuc(55, 125, 2, 1, 'H', 22) + tx(55, 48, 'Đơteri', { sz: 17 })
  b += ball(55, 205, 21, '#f4c7c2', '#8f2018') + arrow(82, 195, 150, 160, OR, 2.6, 11) + nuc(55, 255, 3, 1, 'H', 22) + tx(55, 288, 'Triti', { sz: 17 })
  b += `<polygon points="190,138 200,118 210,134 224,114 228,134 246,128 236,144 252,152 234,158 242,176 224,168 218,186 208,168 192,180 196,160 176,156 194,148" fill="#ffd966" stroke="${OR}" stroke-width="2"/>`
  b += tx(212, 215, 'nhiệt độ rất cao', { sz: 17, c: RD, b: true })
  b += arrow(268, 148, 318, 148, INK, 3, 13)
  b += ball(385, 200, 28, '#f2b24b', '#a8741a') + nuc(385, 208, 4, 2, 'He', 22) + tx(385, 252, 'Helium', { sz: 17 })
  b += arrow(405, 170, 500, 100, OR, 2.6, 11) + ball(515, 90, 9, '#98a1b3', '#5d6678', 1.5) + tx(512, 128, 'neutron', { sz: 17 })
  b += tx(300, 315, 'Toả năng lượng rất lớn', { sz: 21, b: true, c: RD })
  await out('H098', 560, 335, b)
}

// ───────── H102 nhà máy điện hạt nhân ─────────
async function H102() {
  const HOT = '#d33a2c', COLD = '#2f5bd3', STEAM = '#b35c00'
  let b = line(120, 80, 210, 80, HOT, 6) + line(210, 120, 120, 120, COLD, 6)
  b += rect(20, 50, 100, 100, '#c3c7cf', INK, 2.2) + rect(40, 62, 14, 50, '#c8402f', '#7a1a12', 1.5) + rect(70, 62, 14, 50, '#c8402f', '#7a1a12', 1.5) + rect(55, 40, 10, 40, '#3d6fd6', '#1d3c99', 1.5) + rect(85, 40, 10, 40, '#3d6fd6', '#1d3c99', 1.5)
  b += tx(70, 172, 'Lò phản ứng', { sz: 17 })
  b += rect(210, 50, 120, 150, '#eef2f8', INK, 2.2) + `<path d="M 210 80 H 305 V 100 H 240 V 120 H 210" fill="none" stroke="${HOT}" stroke-width="4"/>`
  b += tx(270, 150, 'Bộ trao đổi', { sz: 15 }) + tx(270, 167, 'nhiệt', { sz: 15 }) + tx(270, 184 - 0, '(sinh hơi)', { sz: 15 })
  b += tx(165, 70, 'nước nóng', { sz: 15, c: HOT }) + tx(165, 143, 'nước nguội', { sz: 15, c: COLD })
  b += line(330, 70, 392, 70, STEAM, 6) + head(394, 70, 0, STEAM, 12) + tx(360, 56, 'hơi', { sz: 16, c: STEAM })
  b += `<polygon points="394,50 454,66 454,102 394,118" fill="#dfe3ea" stroke="${INK}" stroke-width="2.2"/>` + tx(424, 38, 'Tua-bin', { sz: 17 })
  b += line(454, 84, 478, 84, INK, 5) + ball(503, 84, 25, '#fff', INK, 2.2) + tx(503, 93, 'G', { sz: 26, b: true }) + tx(503, 130, 'Máy phát', { sz: 16 })
  b += polyline([[528, 84], [548, 84], [548, 44]], '#e0a800', 3, true) + tx(520, 34, 'điện', { sz: 18, b: true, c: '#a8741a' })
  b += line(424, 112, 424, 225, STEAM, 5)
  b += rect(385, 225, 100, 60, '#eaf1fb', INK, 2.2) + tx(435, 260, 'Bình ngưng', { sz: 16 })
  b += polyline([[385, 255], [250, 255], [250, 206]], COLD, 5, false) + head(250, 202, -Math.PI / 2, COLD, 12)
  b = `<g transform="translate(0,10)">${b}</g>`
  await out('H102', 560, 310, b)
}

// ───────── H104 hiện tượng phóng xạ ─────────
async function H104() {
  let b = `<path d="M 100 55 L 122 70 L 145 52 L 160 80 L 188 76 L 178 105 L 205 125 L 175 135 L 185 168 L 155 160 L 145 190 L 122 170 L 95 188 L 92 158 L 62 160 L 75 132 L 45 118 L 76 104 L 58 78 L 90 82 Z" fill="#fde4e1" stroke="${INK}" stroke-width="2.4"/>`
  b += tx(122, 128, '~X~', { sz: 26, b: true }) + tx(122, 225, 'Hạt nhân mẹ') + tx(122, 247, '(không bền)', { sz: 18, c: '#555' })
  b += arrow(215, 125, 290, 125, INK, 3, 13) + tx(252, 105, 'tự phát', { sz: 18 })
  b += ball(345, 125, 40, '#c9d3e6', '#5d6678') + tx(345, 135, '~Y~', { sz: 26, b: true }) + tx(345, 200, 'Hạt nhân con') + tx(345, 222, '(hạt nhân khác)', { sz: 18, c: '#555' })
  b += `<path d="M 395 85 q 10 -14 20 0 t 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="${GR}" stroke-width="2.6"/>` + head(495, 85, 0, GR, 11)
  b += arrow(395, 125, 495, 125, OR, 2.6, 11) + arrow(395, 165, 495, 165, OR, 2.6, 11)
  b += tx(512, 91, 'γ', { sz: 21, a: 'start', c: GR }) + tx(512, 131, 'β', { sz: 21, a: 'start', c: OR }) + tx(512, 171, 'α', { sz: 21, a: 'start', c: OR })
  b += tx(445, 50, 'tia phóng xạ', { sz: 19, c: '#444' })
  await out('H104', 560, 265, b)
}

// ───────── H105 so sánh các tia ─────────
async function H105() {
  const px1 = 70, px2 = 230, xs = 150, ys = 330, yTop = 60, yIn = 260
  let b = rect(px1 - 6, yTop, 6, yIn - yTop, BL, BL, 1) + rect(px2, yTop, 6, yIn - yTop, RD, RD, 1)
  b += tx(px1 - 3, yIn + 26, '−', { sz: 28, c: BL, b: true }) + tx(px2 + 3, yIn + 26, '+', { sz: 28, c: RD, b: true })
  b += line(xs, ys, xs, yIn, '#777', 3) + rect(xs - 26, ys, 52, 28, '#9aa3b2', INK, 2) + tx(xs, ys + 20, 'nguồn', { sz: 14, b: true, c: '#fff' })
  const traj = (D, col, lab) => {
    const a = D / 200 / 200, pts = []
    for (let y = yIn; y >= yTop; y -= 4) pts.push([xs + a * (yIn - y) ** 2, y])
    const slope = 2 * a * (yIn - yTop)
    pts.push([xs + a * (yIn - yTop) ** 2 + slope * 26, yTop - 26])
    const e = pts[pts.length - 1]
    return polyline(pts, col, 2.8, true) + tx(e[0], yTop - 38, lab, { sz: 21, c: col, b: true })
  }
  b += traj(0, GR, 'γ') + traj(-30, OR, 'α') + traj(-72, RD, 'β⁺') + traj(72, BL, 'β⁻')
  b += tx(150, 400, 'Lệch trong điện trường', { sz: 18, c: '#444' })
  const x0 = 310, sx = 440, yP = 265, yAl = 205, yPb = 120
  b += rect(sx - 62, ys, 124, 28, '#9aa3b2', INK, 2) + tx(sx, ys + 20, 'nguồn', { sz: 14, b: true, c: '#fff' })
  b += rect(x0, yP - 2, 230, 4, '#fff', INK, 1.6) + tx(x0 + 3, yP - 9, 'giấy', { sz: 17, a: 'start' })
  b += rect(x0, yAl - 6, 230, 12, '#cfd5de', INK, 1.6) + tx(x0 + 3, yAl - 13, 'nhôm', { sz: 17, a: 'start' })
  b += rect(x0, yPb - 14, 230, 28, '#6a6e78', INK, 1.6) + tx(x0 + 3, yPb - 21, 'chì', { sz: 17, a: 'start' })
  b += polyline([[sx - 40, ys], [sx - 40, yP + 4]], OR, 2.8, true) + tx(sx - 54, yP + 36, 'α', { sz: 21, c: OR, b: true })
  b += polyline([[sx, ys], [sx, yAl + 8]], RD, 2.8, true) + tx(sx - 14, yAl + 36, 'β', { sz: 21, c: RD, b: true })
  b += polyline([[sx + 40, ys], [sx + 40, yPb + 14]], GR, 2.8, false) + tx(sx + 54, yPb + 48, 'γ', { sz: 21, c: GR, b: true })
  b += polyline([[sx + 40, yPb - 14], [sx + 40, yPb - 60]], GR, 1.6, true, 'stroke-dasharray="5 5"')
  b += tx(425, 400, 'Khả năng đâm xuyên', { sz: 18, c: '#444' })
  await out('H105', 560, 415, b)
}

// ───────── đồ thị phóng xạ ─────────
function graph() {
  const ox = 85, oy = 310, W = 430, Hh = 240, xT = 4.3
  const X = (t) => ox + t / xT * W, Y = (v) => oy - v * Hh
  let b = arrow(ox, oy, ox + W + 22, oy, INK, 2, 10) + arrow(ox, oy, ox, oy - Hh - 22, INK, 2, 10)
  b += tx(ox + W + 14, oy + 30, '~t~', { sz: 21 }) + tx(ox - 8, oy + 22, 'O', { sz: 18, a: 'end' })
  let d = ''
  for (let i = 0; i <= 120; i++) { const t = i / 120 * (xT - 0.05); d += (i ? ' L ' : 'M ') + f(X(t)) + ' ' + f(Y(Math.pow(2, -t))) }
  b += `<path d="${d}" fill="none" stroke="${BL}" stroke-width="3.2"/>`
  return { b, X, Y, ox, oy }
}
async function H106() {
  const { b: b0, X, Y, ox, oy } = graph()
  let b = b0
  for (let k = 0; k <= 3; k++) {
    const v = Math.pow(2, -k)
    b += line(ox - 6, Y(v), ox, Y(v), INK, 1.5) + tx(ox - 12, Y(v) + 6, k === 0 ? '~N~_{0}' : `~N~_{0}/${2 ** k}`, { sz: 19, a: 'end' })
    if (k) b += line(ox, Y(v), X(k), Y(v), GY, 1.5, 'stroke-dasharray="5 5"') + line(X(k), Y(v), X(k), oy, GY, 1.5, 'stroke-dasharray="5 5"')
    b += ball(X(k), Y(v), 5.5, RD, RD, 1)
    if (k) b += line(X(k), oy, X(k), oy + 6, INK, 1.5) + tx(X(k), oy + 26, k === 1 ? '~T~' : `${k}~T~`, { sz: 19 })
  }
  b += tx(ox + 8, 38, '~N~ (số hạt nhân chưa phân rã)', { sz: 18, a: 'start' })
  await out('H106', 560, 350, b)
}
async function H107() {
  const { b: b0, X, Y, ox, oy } = graph()
  let b = b0
  const t = 2
  b += line(ox, Y(1), X(4.3), Y(1), GY, 1.5, 'stroke-dasharray="5 5"') + line(ox - 6, Y(1), ox, Y(1), INK, 1.5) + tx(ox - 12, Y(1) + 6, '~N~_{0}', { sz: 19, a: 'end' })
  b += `<rect x="${f(X(t) - 7)}" y="${f(Y(1))}" width="14" height="${f(Y(0.25) - Y(1))}" fill="${RD}" fill-opacity="0.18" stroke="none"/>`
  b += line(X(t), Y(1) + 8, X(t), Y(0.25) - 6, RD, 2.5) + head(X(t), Y(0.25) - 2, Math.PI / 2, RD, 9) + head(X(t), Y(1) + 2, -Math.PI / 2, RD, 9)
  b += line(X(t), Y(0.25) + 6, X(t), oy - 6, GR, 2.5) + head(X(t), oy - 1, Math.PI / 2, GR, 9)
  b += ball(X(t), Y(0.25), 5.5, INK, INK, 1)
  b += tx(X(t) + 14, Y(0.62) + 6, 'Δ~N~ đã phân rã', { sz: 18, a: 'start', c: RD }) + tx(X(t) + 14, Y(0.1) + 6, '~N~(~t~) còn lại', { sz: 18, a: 'start', c: GR })
  b += line(X(t), oy, X(t), oy + 6, INK, 1.5) + tx(X(t), oy + 26, '~t~', { sz: 19 })
  b += tx(ox + 8, 38, '~N~ (khối lượng ~m~ giảm cùng quy luật)', { sz: 18, a: 'start' })
  await out('H107', 560, 350, b)
}
async function H108() {
  const { b: b0, X, Y, ox, oy } = graph()
  let b = b0
  for (let k = 0; k <= 2; k++) {
    const v = Math.pow(2, -k)
    b += line(ox - 6, Y(v), ox, Y(v), INK, 1.5) + tx(ox - 12, Y(v) + 6, k === 0 ? '~H~_{0}' : `~H~_{0}/${2 ** k}`, { sz: 19, a: 'end' })
    if (k) b += line(ox, Y(v), X(k), Y(v), GY, 1.5, 'stroke-dasharray="5 5"') + line(X(k), Y(v), X(k), oy, GY, 1.5, 'stroke-dasharray="5 5"') + line(X(k), oy, X(k), oy + 6, INK, 1.5) + tx(X(k), oy + 26, k === 1 ? '~T~' : '2~T~', { sz: 19 })
    b += ball(X(k), Y(v), 5.5, RD, RD, 1)
  }
  b += tx(ox + 8, 38, '~H~ (Bq = phân rã/giây)', { sz: 18, a: 'start' })
  b += tx(X(2.5), Y(0.62), '~H~ = ~H~_{0}·2^{−~t~/~T~}', { sz: 21, a: 'start', c: BL, b: true })
  await out('H108', 560, 350, b)
}

// ───────── H111 đầu báo khói ─────────
async function H111() {
  const row = (y0, smoke) => {
    const L = 40, Rr = 300, T0 = y0, B0 = y0 + 125, my = T0 + 62
    let s = rect(L, T0, Rr - L, B0 - T0, '#f6f8fc', GY, 1.4) + line(L, T0, L, B0, RD, 7) + line(Rr, T0, Rr, B0, BL, 7)
    s += tx(L + 14, T0 + 22, '+', { sz: 22, c: RD, b: true }) + tx(Rr - 14, T0 + 22, '−', { sz: 22, c: BL, b: true })
    s += rect(145, B0 - 14, 50, 14, '#f2b24b', INK, 1.6) + tx(170, B0 - 3, 'Am', { sz: 13, b: true })
    const sx = 170, sy = B0 - 16, len = smoke ? 40 : 80
    for (const dx of [-0.45, 0, 0.45]) s += arrow(sx, sy, sx + dx * len, sy - len * (dx ? 0.9 : 1), OR, 1.8, 8)
    const ions = [[120, 40], [150, 30], [200, 40], [225, 55], [170, 20], [130, 60], [215, 28]]
    for (let i = 0; i < (smoke ? 3 : 7); i++) {
      const [ix, iy] = ions[i], yy = T0 + iy + 30
      s += ball(ix + 8, yy, 5, RD, RD, 0) + arrow(ix + 15, yy, ix + 30, yy, RD, 1.4, 6) + ball(ix - 8, yy, 5, BL, BL, 0) + arrow(ix - 15, yy, ix - 30, yy, BL, 1.4, 6)
    }
    if (smoke) for (const [ix, iy, r] of [[110, 40, 9], [140, 30, 7], [205, 45, 10], [230, 35, 7], [175, 55, 8], [250, 70, 7], [95, 75, 6], [150, 70, 8]]) s += `<circle cx="${ix + 20}" cy="${T0 + iy}" r="${r}" fill="#9aa0a6" fill-opacity="0.75" stroke="none"/>`
    s += line(Rr + 3, my, 366, my, INK, 2) + ball(400, my, 34, '#fff', INK, 2.2) + tx(400, my - 6, 'A', { sz: 22, b: true })
    const ang = smoke ? -0.6 : 0.9
    s += line(400, my + 20, 400 + 24 * Math.sin(ang), my + 20 - 24 * Math.cos(ang), RD, 3)
    s += line(434, my, 480, my, INK, 2) + line(480, my, 480, B0 + 22, INK, 2) + line(480, B0 + 22, 20, B0 + 22, INK, 2) + line(20, B0 + 22, 20, my, INK, 2) + line(20, my, L - 3, my, INK, 2)
    s += `<rect x="236" y="${B0 + 15}" width="40" height="14" fill="#fff" stroke="none"/>` + line(250, B0 + 12, 250, B0 + 32, INK, 3) + line(262, B0 + 17, 262, B0 + 27, INK, 3)
    return s
  }
  let b = row(30, false) + row(235, true)
  b += tx(400, 148, 'dòng lớn', { sz: 19, c: GR, b: true }) + tx(80, 22, 'Không có khói', { sz: 19, a: 'start', b: true }) + tx(80, 227, 'Có khói', { sz: 19, a: 'start', b: true })
  b += tx(370, 355, 'dòng giảm → báo động', { sz: 18, c: RD, b: true })
  await out('H111', 540, 400, b)
}

const todo = { H085, H086, H087, H088, H089, H090, H091, H092, H093, H094, H095, H096, H097, H098, H099, H100, H101, H102, H104, H105, H106, H107, H108, H111 }
const arg = process.argv.slice(2)
for (const [k, fn] of Object.entries(todo)) if (!arg.length || arg.includes(k)) await fn()
