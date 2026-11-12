// VE2 — hình minh hoạ từ trường / lực từ / Lorentz / từ thông (vẽ bằng SVG, xuất PNG 2x)
import puppeteer from 'puppeteer-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(HERE, '../anh')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const INK = '#222', BC = '#2f5bd3', IC = '#d33a2c', FC = '#1f7a4d', VC = '#b35c00', FILL = '#e6ecf5', EC = '#7a3db8'
const f = (n) => Math.round(n * 100) / 100
const FONT = 'Arial, sans-serif'

// ---------- nguyên liệu ----------
const md = (s) => s
  .replace(/\*(.+?)\*/g, '<tspan font-style="italic">$1</tspan>')
  .replace(/_\{(.+?)\}/g, '<tspan baseline-shift="sub" font-size="72%">$1</tspan>')
function t(x, y, s, { size = 20, col = INK, anchor = 'middle', bold = false, halo = true } = {}) {
  return `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" fill="${col}"${bold ? ' font-weight="bold"' : ''}${halo ? ' stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round"' : ''}>${md(s)}</text>`
}
function head(x, y, dx, dy, col, s = 11) {
  const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l
  const nx = -dy, ny = dx
  return `<polygon points="${f(x)},${f(y)} ${f(x - dx * s + nx * s * 0.42)},${f(y - dy * s + ny * s * 0.42)} ${f(x - dx * s - nx * s * 0.42)},${f(y - dy * s - ny * s * 0.42)}" fill="${col}" stroke="none"/>`
}
function arrow(x1, y1, x2, y2, col = INK, w = 3, hs = 12, dash = '') {
  const l = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / l, dy = (y2 - y1) / l
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2 - dx * hs * 0.8)}" y2="${f(y2 - dy * hs * 0.8)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` + head(x2, y2, dx, dy, col, hs)
}
const ln = (x1, y1, x2, y2, col = INK, w = 2, dash = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`
const rect = (x, y, w, h, fill = 'none', col = INK, sw = 2, r = 0) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" stroke="${col}" stroke-width="${sw}"/>`
const circ = (x, y, r, fill = 'none', col = INK, sw = 2, dash = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" stroke="${col}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
const poly = (pts, fill = 'none', col = INK, sw = 2) => `<polygon points="${pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ')}" fill="${fill}" stroke="${col}" stroke-width="${sw}" stroke-linejoin="round"/>`
// ⊙ (ra khỏi trang) và ⊗ (vào trang)
const sOut = (x, y, r = 9, col = BC) => circ(x, y, r, '#fff', col, 2) + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.32)}" fill="${col}"/>`
const sIn = (x, y, r = 9, col = BC) => circ(x, y, r, '#fff', col, 2) + ln(x - r * 0.62, y - r * 0.62, x + r * 0.62, y + r * 0.62, col, 2) + ln(x - r * 0.62, y + r * 0.62, x + r * 0.62, y - r * 0.62, col, 2)
const cross = (x, y, r = 7, col = BC) => ln(x - r, y - r, x + r, y + r, col, 2) + ln(x - r, y + r, x + r, y - r, col, 2)

const figs = []
function fig(ten, w, h, body) { figs.push({ ten, w, h, body }) }
const svgOf = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`

// ---------- đường sức nam châm thanh (mô hình hai cực điểm) ----------
function trace(a, phi) {
  const field = (p) => {
    const nx = p.x - a, sx = p.x + a, y = p.y
    const rn = Math.hypot(nx, y) ** 3, rs = Math.hypot(sx, y) ** 3
    return { x: nx / rn - sx / rs, y: y / rn - y / rs }
  }
  let p = { x: a + 0.03 * Math.cos(phi), y: 0.03 * Math.sin(phi) }
  const pts = [p]
  const st = 0.025
  for (let i = 0; i < 9000; i++) {
    let b = field(p); let l = Math.hypot(b.x, b.y)
    const m = { x: p.x + (st / 2) * b.x / l, y: p.y + (st / 2) * b.y / l }
    b = field(m); l = Math.hypot(b.x, b.y)
    p = { x: p.x + st * b.x / l, y: p.y + st * b.y / l }
    pts.push(p)
    if (Math.hypot(p.x + a, p.y) < 0.04) return pts
    if (Math.hypot(p.x, p.y) > 14) return null
  }
  return null
}
const deg = (d) => d * Math.PI / 180
function lines(a, angles) { return angles.map((d) => trace(a, deg(d))).filter(Boolean) }
function bbox(ls, extra = []) {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9
  for (const l of ls) for (const p of l) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y) }
  for (const p of extra) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y) }
  return { x0, x1, y0, y1 }
}
function fitTf(ls, w, h, mx = 30, my = 30, extra = []) {
  const b = bbox(ls, extra)
  const s = Math.min((w - 2 * mx) / (b.x1 - b.x0), (h - 2 * my) / (b.y1 - b.y0))
  const cx = w / 2 - s * (b.x0 + b.x1) / 2, cy = h / 2 - s * (b.y0 + b.y1) / 2
  return { s, tx: (x) => cx + s * x, ty: (y) => cy + s * y }
}
function pathD(pts, tf) { return 'M ' + pts.map((p) => `${f(tf.tx(p.x))} ${f(tf.ty(p.y))}`).join(' L ') }
function lenArr(pts) { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return c }
function atFrac(pts, fr) { const c = lenArr(pts); const L = c[c.length - 1]; const tg = L * fr; let i = 1; while (i < c.length - 1 && c[i] < tg) i++; return { i, p: pts[i], d: { x: pts[i + 1 > pts.length - 1 ? i : i + 1].x - pts[i - 1].x, y: pts[i + 1 > pts.length - 1 ? i : i + 1].y - pts[i - 1].y } } }
const A_MAG = 1.0, HALF = 1.5, HH = 0.3
function magnet(tf, label = true, inside = false) {
  const x0 = tf.tx(-HALF), x1 = tf.tx(HALF), y0 = tf.ty(-HH), y1 = tf.ty(HH), xm = tf.tx(0)
  let s = `<rect x="${f(x0)}" y="${f(y0)}" width="${f(xm - x0)}" height="${f(y1 - y0)}" fill="${BC}" stroke="${INK}" stroke-width="2"/>`
  s += `<rect x="${f(xm)}" y="${f(y0)}" width="${f(x1 - xm)}" height="${f(y1 - y0)}" fill="${IC}" stroke="${INK}" stroke-width="2"/>`
  if (label) s += `<text x="${f((x0 + xm) / 2)}" y="${f((y0 + y1) / 2 + 8)}" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="bold" fill="#fff">S</text><text x="${f((xm + x1) / 2)}" y="${f((y0 + y1) / 2 + 8)}" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="bold" fill="#fff">N</text>`
  if (inside) {
    for (const dy of [-0.225, 0.225]) {
      const ya = tf.ty(dy), xa = tf.tx(-HALF + 0.12), xb = tf.tx(HALF - 0.12)
      s += arrow(xa, ya, xb, ya, '#fff', 2.2, 9)
    }
  }
  return s
}
function fieldPaths(ls, tf, fracs = [0.5], col = BC, w = 2.2) {
  let s = ''
  for (const l of ls) {
    s += `<path d="${pathD(l, tf)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`
    for (const fr of fracs) {
      const a = atFrac(l, fr)
      s += head(tf.tx(a.p.x), tf.ty(a.p.y), a.d.x, a.d.y, col, 11)
    }
  }
  return s
}

// ---------- bàn tay trái ----------
function hand(ox, oy, { fingerLab, fingerCol, thumbLab, thumbCol, extra = '' }) {
  const skin = '#f6dfc8'
  let s = ''
  // cổ tay
  s += rect(ox - 50, oy + 22, 54, 56, skin, INK, 2, 6)
  // bốn ngón (ngón trỏ ở trên)
  const lens = [96, 110, 102, 82]
  for (let i = 0; i < 4; i++) s += rect(ox + 80, oy + 4 + i * 24, lens[i], 21, skin, INK, 2, 10)
  // lòng bàn tay
  s += rect(ox, oy, 100, 100, skin, INK, 2, 14)
  // ngón cái hướng lên
  s += `<path d="M ${ox + 14} ${oy + 2} L ${ox + 14} ${oy - 62} Q ${ox + 14} ${oy - 78} ${ox + 32} ${oy - 78} Q ${ox + 50} ${oy - 78} ${ox + 50} ${oy - 62} L ${ox + 50} ${oy + 2}" fill="${skin}" stroke="${INK}" stroke-width="2"/>`
  s += rect(ox + 14, oy - 2, 36, 8, skin, 'none', 0)
  // ⊗ trên lòng bàn tay
  s += sIn(ox + 52, oy + 52, 15, BC)
  s += arrow(ox + 32, oy - 82, ox + 32, oy - 128, thumbCol, 3.4, 13)
  s += arrow(ox + 190, oy + 52, ox + 256, oy + 52, fingerCol, 3.4, 13)
  s += t(ox + 62, oy - 108, thumbLab, { size: 20, col: thumbCol, anchor: 'start', bold: true })
  s += t(ox + 262, oy + 112, fingerLab, { size: 20, col: fingerCol, bold: true })
  s += t(ox + 52, oy + 126, '*B* vào lòng bàn tay', { size: 19, col: BC, bold: true })
  return s + extra
}

// ================== VẼ ==================

// ---- H032: cảm ứng từ — vectơ B tiếp tuyến đường sức, kim nam châm thử
{
  const w = 520, h = 340
  const ls = lines(A_MAG, [92, 125, 158, -92, -125, -158])
  const tf = fitTf(ls, w, h, 30, 64)
  let b = fieldPaths(ls, tf, [0.5, 0.82], BC, 2)
  b += magnet(tf, true)
  // vị trí kim thử trên đường sức phía trên (ls[1]) tại phân số 0.62
  const l = ls[3], a = atFrac(l, 0.13)
  const px = tf.tx(a.p.x), py = tf.ty(a.p.y)
  const dl = Math.hypot(a.d.x, a.d.y), dx = a.d.x / dl, dy = a.d.y / dl
  // kim: nửa Nam (xanh) phía sau, nửa Bắc (đỏ) phía trước theo chiều B
  const L = 26, wd = 7
  const nx = -dy, ny = dx
  const half = (sx, sy, ex, ey, col) => poly([[sx + nx * wd, sy + ny * wd], [ex + nx * wd, ey + ny * wd], [ex - nx * wd, ey - ny * wd], [sx - nx * wd, sy - ny * wd]], col, INK, 1.6)
  b += half(px - dx * L, py - dy * L, px, py, BC) + half(px, py, px + dx * L, py + dy * L, IC)
  b += arrow(px + dx * L, py + dy * L, px + dx * (L + 62), py + dy * (L + 62), '#173a9c', 4, 15)
  b += t(px + dx * (L + 62) + dx * 20, py + dy * (L + 62) + dy * 20 + 8, '*B*', { size: 26, col: '#173a9c', bold: true })
  const sg = nx > 0 ? 1 : -1
  b += t(px - dx * (L - 6) + sg * nx * 20, py - dy * (L - 6) + sg * ny * 20 + 6, 'S', { size: 18, col: BC, bold: true })
  b += t(px + dx * (L - 6) + sg * nx * 20, py + dy * (L - 6) + sg * ny * 20 + 6, 'N', { size: 18, col: IC, bold: true })
  fig('H032', w, h, b)
}

// ---- H033_1: từ phổ (mạt sắt)
{
  const w = 520, h = 340
  const angs = []; for (let d = 30; d <= 168; d += 9) { angs.push(d); angs.push(-d) }
  const ls = lines(A_MAG, angs)
  const tf = fitTf(lines(A_MAG, [70, -70]), w, h, 10, 14)
  let b = rect(0, 0, w, h, '#fff', 'none', 0)
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (const l of ls) {
    const c = lenArr(l); const L = c[c.length - 1]
    // bước theo quãng đường thật để hạt đều theo chiều dài
    const stepU = 0.1
    for (let u = 0.08; u < L - 0.05; u += stepU * (0.8 + rnd() * 0.5)) {
      let i = 1; while (i < c.length - 1 && c[i] < u) i++
      const p = l[i], q = l[Math.min(i + 3, l.length - 1)], r = l[Math.max(i - 3, 0)]
      const dxx = q.x - r.x, dyy = q.y - r.y, ll = Math.hypot(dxx, dyy) || 1
      const x = tf.tx(p.x), y = tf.ty(p.y)
      if (x < 6 || x > w - 6 || y < 6 || y > h - 6) continue
      const ux = dxx / ll, uy = dyy / ll
      b += `<line x1="${f(x - ux * 4.5)}" y1="${f(y - uy * 4.5)}" x2="${f(x + ux * 4.5)}" y2="${f(y + uy * 4.5)}" stroke="#444" stroke-width="1.7" stroke-linecap="round"/>`
    }
  }
  b += magnet(tf, true)
  fig('H033_1', w, h, b)
}

// ---- H033_2: đường sức từ, tiếp tuyến tại mỗi điểm là phương của B
{
  const w = 520, h = 340
  const ls = lines(A_MAG, [95, 135, -95, -135])
  const tf = fitTf(ls, w, h, 36, 78)
  let b = fieldPaths(ls, tf, [0.5, 0.82], BC, 2.2)
  b += magnet(tf, true)
  // điểm M trên đường sức 105° phía trên, vẽ tiếp tuyến
  const l = ls[2], a = atFrac(l, 0.22)
  const px = tf.tx(a.p.x), py = tf.ty(a.p.y), dl = Math.hypot(a.d.x, a.d.y), dx = a.d.x / dl, dy = a.d.y / dl
  b += ln(px - dx * 60, py - dy * 60, px + dx * 30, py + dy * 30, INK, 1.8, '6 5')
  b += arrow(px, py, px + dx * 58, py + dy * 58, '#173a9c', 4, 15)
  b += circ(px, py, 5, INK, INK, 1)
  b += t(px + 20, py - 6, '*M*', { size: 22 })
  b += t(px + dx * 78, py + dy * 78 - 2, '*B*', { size: 26, col: '#173a9c', bold: true })
  fig('H033_2', w, h, b)
}

// ---- H033_3: kim nam châm thử, chiều B là chiều S → N
{
  const w = 440, h = 272
  let b = circ(220, 118, 92, '#f5f7fb', INK, 2) + circ(220, 118, 4, INK, INK, 1)
  const wd = 14
  b += poly([[130 + 25, 118 - wd], [220, 118 - wd], [220, 118 + wd], [130 + 25, 118 + wd]], BC, INK, 2)
  b += poly([[220, 118 - wd], [310 - 25, 118 - wd], [310 - 25, 118 + wd], [220, 118 + wd]], IC, INK, 2)
  b += poly([[155, 104], [128, 118], [155, 132]], BC, INK, 2) + poly([[285, 104], [312, 118], [285, 132]], IC, INK, 2)
  b += t(177, 124, 'S', { size: 22, col: '#fff', bold: true, halo: false }) + t(263, 124, 'N', { size: 22, col: '#fff', bold: true, halo: false })
  b += arrow(130, 252, 330, 252, '#173a9c', 4, 15)
  b += t(342, 260, '*B*', { size: 26, col: '#173a9c', bold: true, anchor: 'start' })
  b += t(230, 234, 'chiều từ S sang N của kim', { size: 19, col: INK, halo: false })
  fig('H033_3', w, h, b)
}

// ---- H034: đặc điểm đường sức: khép kín, dày/thưa
{
  const w = 540, h = 360
  const ls = lines(A_MAG, [62, 85, 110, 135, 160, -62, -85, -110, -135, -160])
  const tf = fitTf(ls, w, h, 24, 24)
  let b = fieldPaths(ls, tf, [0.5], BC, 2)
  b += magnet(tf, true, true)
  // nhãn dày / thưa
  const dp = { x: tf.tx(1.12), y: tf.ty(-0.62) }, tp = atFrac(ls[5], 0.68).p
  b += ln(dp.x + 46, dp.y - 34, dp.x + 4, dp.y - 3, '#173a9c', 1.6) + t(dp.x + 70, dp.y - 38, 'dày', { size: 21, col: '#173a9c', bold: true })
  b += ln(tf.tx(tp.x) - 46, tf.ty(tp.y) - 24, tf.tx(tp.x) - 3, tf.ty(tp.y) - 2, '#173a9c', 1.6) + t(tf.tx(tp.x) - 76, tf.ty(tp.y) - 28, 'thưa', { size: 21, col: '#173a9c', bold: true })
  fig('H034', w, h, b)
}

// ---- H035_1: mặt phẳng vuông góc dây: đường tròn đồng tâm
{
  const w = 400, h = 340, cx = 200, cy = 170
  let b = ''
  for (const r of [42, 84, 126]) {
    b += circ(cx, cy, r, 'none', BC, 2.2)
    // mũi tên ngược chiều kim đồng hồ (dòng điện ra khỏi trang) tại góc 45° và 225°
    for (const ang of [45, 225]) {
      const a = deg(ang), px = cx + r * Math.cos(a), py = cy - r * Math.sin(a)
      const tx = -Math.sin(a), ty = -Math.cos(a)   // tiếp tuyến ngược chiều kim đồng hồ (màn hình y xuống)
      b += head(px, py, tx, ty, BC, 12)
    }
  }
  b += sOut(cx, cy, 14, IC) + `<circle cx="${cx}" cy="${cy}" r="5" fill="${IC}"/>`
  b += t(cx + 17, cy - 15, '*I*', { size: 20, col: IC, bold: true })
  b += t(cx + 92, cy + 112, '*B*', { size: 24, col: BC, bold: true })
  fig('H035_1', w, h, b)
}

// ---- H035_2: ký hiệu ⊙ ⊗ đường sức từ hai bên dây thẳng đứng
{
  const w = 440, h = 320, cx = 220
  let b = rect(cx - 8, 30, 16, 220, '#cfd4da', INK, 2)
  b += arrow(cx, 250, cx, 12, IC, 3.4, 13).replace('M', 'M')
  b += t(cx + 22, 36, '*I*', { size: 24, col: IC, bold: true, anchor: 'start' })
  for (const d of [52, 112, 172]) for (const y of [90, 150, 210]) {
    b += sOut(cx - d, y, 10, BC) + sIn(cx + d, y, 10, BC)
  }
  b += sOut(120, 292, 10, BC) + t(138, 299, '*B* ra khỏi trang', { size: 19, col: BC, anchor: 'start' })
  b += sIn(290, 292, 10, BC) + t(308, 299, '*B* vào trang', { size: 19, col: BC, anchor: 'start' })
  fig('H035_2', w, h, b)
}

// ---- H036: quy tắc nắm tay phải (dòng điện thẳng)
{
  const w = 440, h = 400, cx = 180
  let b = ''
  // dây dẫn
  b += rect(cx - 4, 40, 8, 330, '#cfd4da', INK, 2)
  // đường sức: elip, nửa sau nét đứt (cho thấy sau dây) nửa trước nét liền
  const ry = 26
  for (const [r, y] of [[88, 300], [120, 130]]) {
    b += `<path d="M ${cx - r} ${y} A ${r} ${ry} 0 0 1 ${cx + r} ${y}" fill="none" stroke="${BC}" stroke-width="2.2" stroke-dasharray="6 5"/>`
    b += `<path d="M ${cx - r} ${y} A ${r} ${ry} 0 0 0 ${cx + r} ${y}" fill="none" stroke="${BC}" stroke-width="2.4"/>`
    b += head(cx + r * 0.55, y + ry * 0.84, 1, 0.2, BC, 13)
    b += head(cx - r * 0.55, y - ry * 0.84, -1, -0.2, BC, 11)
  }
  // bàn tay nắm (nắm đấm) quanh dây ở giữa
  const skin = '#f6dfc8'
  b += `<rect x="${cx - 52}" y="196" width="104" height="66" rx="22" fill="${skin}" stroke="${INK}" stroke-width="2"/>`
  for (let i = 0; i < 4; i++) b += `<path d="M ${cx - 38 + i * 25} 206 Q ${cx - 26 + i * 25} 232 ${cx - 38 + i * 25} 256" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  // ngón cái dọc theo dây hướng lên
  b += `<path d="M ${cx - 4} 200 L ${cx - 4} 128 Q ${cx - 4} 112 ${cx + 12} 112 Q ${cx + 28} 112 ${cx + 28} 128 L ${cx + 28} 200 Z" fill="${skin}" stroke="${INK}" stroke-width="2"/>`
  b += arrow(cx + 12, 100, cx + 12, 44, IC, 3.6, 14)
  b += t(cx + 36, 62, '*I*', { size: 24, col: IC, bold: true, anchor: 'start' })
  b += t(cx + 44, 156, 'ngón cái', { size: 19, col: INK, anchor: 'start', bold: true })
  b += t(cx + 44, 178, 'chỉ chiều *I*', { size: 19, col: IC, anchor: 'start' })
  // chiều đường sức
  b += t(cx + 142, 322, 'bốn ngón', { size: 19, col: INK, anchor: 'start', bold: true })
  b += t(cx + 142, 344, 'chỉ chiều *B*', { size: 19, col: '#173a9c', anchor: 'start' })
  fig('H036', w, h, b)
}

// ---- H037: dòng điện tròn (mặt cắt chứa trục)
{
  const w = 520, h = 340, cy = 170, cx = 260, R = 56
  let b = ''
  const pathLoop = (yin, yout, xe = 120, d = 120) => `M ${cx - xe} ${cy + yin} L ${cx + xe} ${cy + yin} C ${cx + xe + d} ${cy + yin}, ${cx + xe + d} ${cy + yout}, ${cx} ${cy + yout} C ${cx - xe - d} ${cy + yout}, ${cx - xe - d} ${cy + yin}, ${cx - xe} ${cy + yin}`
  for (const [yi, yo] of [[-24, -135], [24, 135]]) {
    b += `<path d="${pathLoop(yi, yo)}" fill="none" stroke="${BC}" stroke-width="2.2"/>`
    b += head(cx + 52, cy + yi, 1, 0, BC, 12) + head(cx - 70, cy + yo, -1, 0, BC, 12)
  }
  b += ln(cx - 190, cy, cx + 190, cy, BC, 2.2) + head(cx + 62, cy, 1, 0, BC, 12) + head(cx - 150, cy, 1, 0, BC, 12) + head(cx + 190, cy, 1, 0, BC, 12)
  // mặt phẳng vòng dây
  b += ln(cx, cy - R - 30, cx, cy + R + 30, '#9aa3ad', 2, '6 5')
  b += sOut(cx, cy - R, 12, IC) + sIn(cx, cy + R, 12, IC)
  b += t(cx + 26, cy - R + 6, '*I*', { size: 22, col: IC, bold: true, anchor: 'start' })
  b += t(cx + 26, cy + R + 8, '*I*', { size: 22, col: IC, bold: true, anchor: 'start' })
  b += t(cx + 96, cy - 10, '*B*', { size: 24, col: '#173a9c', bold: true })
  fig('H037', w, h, b)
}

// ---- H038: ống dây hình trụ (mặt cắt chứa trục)
{
  const w = 540, h = 340, cx = 270, cy = 170
  let b = ''
  const xs = [-80, -40, 0, 40, 80], Y = 44
  const pathLoop = (yin, yout, xe = 100, d = 110) => `M ${cx - xe} ${cy + yin} L ${cx + xe} ${cy + yin} C ${cx + xe + d} ${cy + yin}, ${cx + xe + d} ${cy + yout}, ${cx} ${cy + yout} C ${cx - xe - d} ${cy + yout}, ${cx - xe - d} ${cy + yin}, ${cx - xe} ${cy + yin}`
  for (const [yi, yo] of [[-22, -128], [22, 128]]) {
    b += `<path d="${pathLoop(yi, yo)}" fill="none" stroke="${BC}" stroke-width="2.2"/>`
    b += head(cx + 40, cy + yi, 1, 0, BC, 12) + head(cx - 60, cy + yo, -1, 0, BC, 12)
  }
  b += ln(cx - 200, cy, cx + 200, cy, BC, 2.2) + head(cx + 25, cy, 1, 0, BC, 12) + head(cx - 150, cy, 1, 0, BC, 12) + head(cx + 200, cy, 1, 0, BC, 12)
  b += rect(cx - 100, cy - Y, 200, 2 * Y, 'none', '#9aa3ad', 1.6, 0).replace('fill="none"', 'fill="none" stroke-dasharray="6 5"')
  for (const x of xs) b += sOut(cx + x, cy - Y, 11, IC) + sIn(cx + x, cy + Y, 11, IC)
  b += t(cx, cy - Y - 28, '*I*', { size: 22, col: IC, bold: true })
  b += circ(cx - 126, cy, 15, BC, BC, 1) + t(cx - 126, cy + 7, 'S', { size: 19, col: '#fff', bold: true, halo: false }) + circ(cx + 126, cy, 15, IC, IC, 1) + t(cx + 126, cy + 7, 'N', { size: 19, col: '#fff', bold: true, halo: false })
  b += t(cx + 176, cy - 12, '*B*', { size: 22, col: '#173a9c', bold: true })
  fig('H038', w, h, b)
}

// ---- H039: lực từ lên dây dẫn đặt trong từ trường
{
  const w = 460, h = 300
  let b = ''
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) b += sIn(60 + i * 68, 40 + j * 72, 9, '#9db3ea')
  b += ln(60, 150, 400, 150, INK, 7)
  b += arrow(220, 150, 330, 150, IC, 3.6, 14)
  b += t(340, 134, '*I*', { size: 24, col: IC, bold: true, anchor: 'start' })
  b += arrow(150, 150, 150, 50, FC, 4, 15)
  b += t(168, 70, '*F*', { size: 26, col: FC, bold: true, anchor: 'start' })
  b += t(420, 40, '*B*', { size: 24, col: '#173a9c', bold: true })
  b += t(420, 66, '(vào)', { size: 17, col: '#173a9c' })
  fig('H039', w, h, b)
}

// ---- khối 3 trục vuông góc (oblique): x phải, "vào trang" lên-phải, y lên
function trio(w, h, ox, oy, o) {
  // mặt phẳng chứa x và z(vào trang) tô nhạt
  const zx = 78, zy = -56      // hướng "vào trang" trên hình
  let b = poly([[ox - 150, oy], [ox + 150, oy], [ox + 150 + zx, oy + zy], [ox - 150 + zx, oy + zy]], FILL, '#9db3ea', 1.4)
  b += o.wire ? ln(ox - 150, oy, ox + 150, oy, INK, 7) : ''
  b += arrow(ox, oy, ox + 140, oy, o.xCol, 3.8, 14)
  b += arrow(ox, oy, ox + zx * 1.15, oy + zy * 1.15, BC, 3.8, 14)
  b += arrow(ox, oy, ox, oy - 140, FC, 3.8, 14)
  b += circ(ox, oy, 4, INK, INK, 1)
  if (o.charge) b += circ(ox, oy, 10, '#fff', INK, 2) + t(ox, oy + 6, '+', { size: 17, halo: false, bold: true })
  // góc vuông
  const q = 16
  b += `<path d="M ${ox + q} ${oy} L ${ox + q} ${oy - q} L ${ox} ${oy - q}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  b += `<path d="M ${ox} ${oy - q} L ${ox + q * 0.78 * 0.9} ${oy - q + q * -0.56 * 0.9 + 0} " fill="none" stroke="none"/>`
  b += t(ox + 158, oy + 36, o.xLab, { size: 24, col: o.xCol, bold: true, anchor: 'start' })
  b += t(ox + zx * 1.15 + 18, oy + zy * 1.15 - 4, '*B*', { size: 24, col: '#173a9c', bold: true, anchor: 'start' })
  b += t(ox - 14, oy - 148, '*F*', { size: 26, col: FC, bold: true, anchor: 'end' })
  b += t(ox + zx * 1.15 + 18, oy + zy * 1.15 + 20, '(vào trang)', { size: 16, col: '#173a9c', anchor: 'start' })
  return b
}

// ---- H040: phương lực từ vuông góc với dây và B
{
  const w = 480, h = 320
  fig('H040', w, h, trio(w, h, 190, 250, { wire: true, xCol: IC, xLab: '*I*' }))
}

// ---- H041: quy tắc bàn tay trái
{
  const w = 460, h = 330
  fig('H041', w, h, hand(40, 150, { fingerLab: 'chiều *I*', fingerCol: IC, thumbLab: 'chiều *F*', thumbCol: FC }))
}

// ---- H042: độ lớn lực từ — phân tích B
{
  const w = 500, h = 310, ox = 130, oy = 230, th = 40
  const Lb = 230, bx = ox + Lb * Math.cos(deg(th)), by = oy - Lb * Math.sin(deg(th))
  let b = ln(40, oy, 460, oy, INK, 7)
  b += arrow(340, oy, 420, oy, IC, 3.6, 14) + t(432, oy + 30, '*I*', { size: 24, col: IC, bold: true })
  b += ln(bx, by, bx, oy, '#8aa4ee', 2.2, '6 5') + ln(bx, oy, ox, oy, '#8aa4ee', 0, '')
  b += arrow(ox, oy, bx, by, BC, 4, 15)
  b += arrow(ox, oy, bx, oy - 4 + 4, '#8aa4ee', 3, 12, '').replace(/stroke="#8aa4ee"/g, 'stroke="#6b86d6"')
  b += `<path d="M ${ox + 60} ${oy} A 60 60 0 0 0 ${ox + 60 * Math.cos(deg(th))} ${oy - 60 * Math.sin(deg(th))}" fill="none" stroke="${INK}" stroke-width="1.8"/>`
  b += t(ox + 82, oy - 12, 'θ', { size: 22, anchor: 'middle' })
  b += `<path d="M ${bx - 14} ${oy} L ${bx - 14} ${oy - 14} L ${bx} ${oy - 14}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  b += t(bx + 10, by - 8, '*B*', { size: 26, col: '#173a9c', bold: true, anchor: 'start' })
  b += t(bx + 12, (by + oy) / 2 + 8, '*B*_{⊥}', { size: 22, col: '#173a9c', anchor: 'start' })
  b += t((ox + bx) / 2 - 8, oy + 36, '*B*_{∥}', { size: 22, col: '#173a9c' })
  fig('H042', w, h, b)
}

// ---- H043_1: lực Lorentz vuông góc v và B
{
  const w = 480, h = 320
  fig('H043_1', w, h, trio(w, h, 190, 250, { charge: true, xCol: VC, xLab: '*v*' }))
}

// ---- H043_2: quy tắc bàn tay trái cho điện tích
{
  const w = 460, h = 360
  fig('H043_2', w, h, hand(40, 150, {
    fingerLab: 'chiều chuyển động', fingerCol: VC, thumbLab: 'chiều *F* (q > 0)', thumbCol: FC,
    extra: t(230, 340, 'điện tích âm: *F* ngược chiều ngón cái', { size: 19, col: FC }),
  }))
}

// ---- H044: v hợp với B góc θ
{
  const w = 500, h = 310, ox = 130, oy = 230, th = 40
  const Lb = 230, bx = ox + Lb * Math.cos(deg(th)), by = oy - Lb * Math.sin(deg(th))
  let b = circ(ox, oy, 8, '#fff', INK, 2) + t(ox, oy + 5, '+', { size: 16, halo: false, bold: true })
  b += arrow(ox, oy, ox + 250, oy, VC, 3.8, 14) + t(ox + 262, oy + 8, '*v*', { size: 24, col: VC, bold: true, anchor: 'start' })
  b += ln(bx, by, bx, oy, '#8aa4ee', 2.2, '6 5')
  b += arrow(ox, oy, bx, by, BC, 4, 15)
  b += `<path d="M ${ox + 60} ${oy} A 60 60 0 0 0 ${ox + 60 * Math.cos(deg(th))} ${oy - 60 * Math.sin(deg(th))}" fill="none" stroke="${INK}" stroke-width="1.8"/>`
  b += t(ox + 84, oy - 12, 'θ', { size: 22 })
  b += `<path d="M ${bx - 14} ${oy} L ${bx - 14} ${oy - 14} L ${bx} ${oy - 14}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
  b += t(bx + 10, by - 8, '*B*', { size: 26, col: '#173a9c', bold: true, anchor: 'start' })
  b += t(bx + 12, (by + oy) / 2 + 8, '*B*_{⊥}', { size: 22, col: '#173a9c', anchor: 'start' })
  b += circ(ox - 56, oy - 56, 14, '#fff', FC, 2.4) + `<circle cx="${ox - 56}" cy="${oy - 56}" r="4.5" fill="${FC}"/>`
  b += t(ox - 78, oy - 52, '*F*', { size: 24, col: FC, bold: true, anchor: 'end' })
  b += t(ox - 56, oy - 80, '(ra khỏi trang)', { size: 16, col: FC })
  fig('H044', w, h, b)
}

// ---- H045: chuyển động tròn đều trong từ trường đều
{
  const w = 440, h = 400, cx = 220, cy = 190, r = 108
  let b = ''
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) {
    const x = 50 + i * 68, y = 40 + j * 74
    if (i === 5 && j === 0) continue
    if (Math.hypot(x - cx, y - cy) > r - 14 && Math.hypot(x - cx, y - cy) < r + 14) continue
    b += sIn(x, y, 8, '#aebfef')
  }
  b += circ(cx, cy, r, 'none', INK, 2.4)
  // mũi tên chiều quay ngược chiều kim đồng hồ
  for (const ang of [200, 20]) {
    const a = deg(ang), px = cx + r * Math.cos(a), py = cy - r * Math.sin(a)
    b += head(px, py, -Math.sin(a), -Math.cos(a), INK, 13)
  }
  const qx = cx, qy = cy + r
  b += ln(cx, cy, qx, qy, '#777', 1.6, '6 5') + circ(cx, cy, 3.5, INK, INK, 1)
  b += t(cx + 16, cy + 56, '*r*', { size: 24, bold: true, anchor: 'start' })
  b += arrow(qx, qy, qx + 96, qy, VC, 3.8, 14) + t(qx + 108, qy + 8, '*v*', { size: 24, col: VC, bold: true, anchor: 'start' })
  b += arrow(qx, qy, qx, qy - 70, FC, 3.8, 14) + t(qx - 18, qy - 40, '*F*', { size: 24, col: FC, bold: true, anchor: 'end' })
  b += circ(qx, qy, 10, '#fff', INK, 2) + t(qx, qy + 5, '+', { size: 15, halo: false, bold: true })
  b += t(396, 30, '*B*', { size: 22, col: '#173a9c', bold: true }) + t(396, 52, '(vào)', { size: 16, col: '#173a9c' })
  fig('H045', w, h, b)
}

// ---- H046: ống tia âm cực (đèn hình CRT)
{
  const w = 560, h = 320
  let b = ''
  // vỏ thuỷ tinh: cổ hẹp rồi loe ra
  b += `<path d="M 90 128 L 250 128 L 440 36 L 440 284 L 250 172 L 90 172 Z" fill="#f2f6fb" stroke="${INK}" stroke-width="2.2"/>`
  // màn huỳnh quang
  b += `<path d="M 440 36 Q 458 160 440 284" fill="none" stroke="#2b8a3e" stroke-width="7"/>`
  // súng điện
  b += rect(40, 138, 52, 24, '#9aa3ad', INK, 2, 3) + ln(92, 150, 100, 150, INK, 2)
  // chùm electron
  b += ln(100, 150, 262, 150, '#7a3db8', 3)
  b += head(180, 150, 1, 0, '#7a3db8', 11)
  b += ln(262, 150, 442, 92, '#7a3db8', 3) + head(342, 121, 1, -0.32, '#7a3db8', 11)
  b += ln(262, 150, 442, 214, '#7a3db8', 2, '7 6')
  // cuộn lệch hướng (trên + dưới)
  b += rect(212, 98, 60, 26, '#d9a35c', INK, 2, 5) + rect(212, 176, 60, 26, '#d9a35c', INK, 2, 5)
  for (let i = 0; i < 5; i++) b += ln(222 + i * 11, 98, 222 + i * 11, 124, INK, 1.2) + ln(222 + i * 11, 176, 222 + i * 11, 202, INK, 1.2)
  b += t(66, 190, 'Súng điện', { size: 19, col: INK, bold: true })
  b += t(66, 212, '(e⁻)', { size: 19, col: '#7a3db8' })
  b += t(242, 70, 'Cuộn lệch hướng', { size: 19, bold: true })
  b += ln(242, 78, 242, 96, '#777', 1.4)
  b += t(168, 232, 'Chùm electron', { size: 19, col: '#7a3db8', bold: true }) + ln(168, 214, 168, 156, '#7a3db8', 1.4)
  b += t(420, 312, 'Màn huỳnh quang', { size: 19, col: '#2b8a3e', bold: true })
  b += ln(446, 296, 452, 262, '#2b8a3e', 1.4)
  fig('H046', w, h, b)
}

// ---- H047: máy quang phổ khối
{
  const w = 540, h = 420, x1 = 150, yP = 170, yS = 60
  let b = ''
  // vùng từ trường (dưới đường yP)
  b += rect(40, yP, 480, 236, '#f3f6fc', 'none', 0)
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) b += sIn(64 + i * 60, yP + 196 - j * 52 + 4, 7, '#aebfef')
  // tấm có khe S3 (và là tấm ảnh bên phải)
  b += ln(40, yP, x1 - 8, yP, INK, 5) + ln(x1 + 8, yP, 500, yP, INK, 5)
  b += ln(40, yS, x1 - 8, yS, INK, 5) + ln(x1 + 8, yS, x1 + 60, yS, INK, 5)
  // nguồn điện U
  b += ln(70, yS, 70, 100, INK, 2) + ln(55, 100, 85, 100, INK, 3.5) + ln(62, 110, 78, 110, INK, 3.5) + ln(70, 110, 70, yP, INK, 2)
  b += t(48, 112, '*U*', { size: 22, anchor: 'end', bold: true })
  b += t(x1, yS - 12, '*S*_{1}', { size: 22, bold: true })
  b += t(x1 + 24, yP - 10, '*S*_{3}', { size: 22, bold: true, anchor: 'start' })
  // hạt đi từ S1 xuống S3
  b += ln(x1, yS + 2, x1, yP + 10, VC, 3) + head(x1, 120, 0, 1, VC, 11)
  // hai bán kính
  for (const [r, col, lab] of [[78, '#d2691e', '*m*_{1}'], [124, '#7a3db8', '*m*_{2}']]) {
    b += `<path d="M ${x1} ${yP} A ${r} ${r} 0 0 0 ${x1 + 2 * r} ${yP}" fill="none" stroke="${col}" stroke-width="3"/>`
    b += circ(x1 + 2 * r, yP + 0, 5, col, col, 1)
    b += t(x1 + 2 * r, yP + 34, lab, { size: 21, col, bold: true })
    b += head(x1 + r * 1.707 - r * 0, yP + r * 0.707, 0.7, -0.7, col, 11)
  }
  b += t(436, yP - 12, 'tấm ảnh', { size: 19, bold: true })
  b += t(480, 400, '*B*', { size: 22, col: '#173a9c', bold: true }) + t(480 - 0, 400, '', {})
  b += sIn(448, 392, 8, '#2f5bd3') + t(462, 398, '*B* vào', { size: 17, col: '#173a9c', anchor: 'start' })
  b = b.replace(t(480, 400, '*B*', { size: 22, col: '#173a9c', bold: true }), '')
  fig('H047', w, h, b)
}

// ---- H048_1: cyclotron nhìn từ trên
{
  const w = 520, h = 420, cx = 260, cy = 178, R = 136, g = 9
  let b = ''
  // hai hộp D
  b += `<path d="M ${cx - g} ${cy - R} A ${R} ${R} 0 0 0 ${cx - g} ${cy + R} Z" fill="#eef2f8" stroke="${INK}" stroke-width="2.4"/>`
  b += `<path d="M ${cx + g} ${cy - R} A ${R} ${R} 0 0 1 ${cx + g} ${cy + R} Z" fill="#eef2f8" stroke="${INK}" stroke-width="2.4"/>`
  for (const [x, y] of [[cx - 98, cy - 80], [cx - 98, cy + 80], [cx + 98, cy - 80], [cx + 98, cy + 80], [cx - 122, cy], [cx + 122, cy]]) b += sIn(x, y, 8, '#aebfef')
  // quỹ đạo xoắn
  const rs = [1, 2, 3, 4, 5].map((n) => 29 * Math.sqrt(n))
  let y = cy - 0; const segs = []
  // tính tổng độ dịch để căn giữa
  let yy = 0, ymin = 0, ymax = 0
  rs.forEach((r, k) => { yy += (k % 2 === 0 ? -1 : 1) * (k % 2 === 0 ? 2 * r : 2 * r); ymin = Math.min(ymin, yy); ymax = Math.max(ymax, yy) })
  const y0 = cy - (ymin + ymax) / 2
  y = y0
  let d = `M ${cx} ${f(y)}`
  rs.forEach((r, k) => {
    const dir = k % 2 === 0 ? -1 : 1            // nửa vòng thứ k: lên (D2) hay xuống (D1)
    const ny = y + dir * 2 * r
    const sweep = k % 2 === 0 ? 1 : 1
    d += ` A ${f(r)} ${f(r)} 0 0 ${sweep} ${cx} ${f(ny)}`
    y = ny
  })
  b += `<path d="${d}" fill="none" stroke="${VC}" stroke-width="3"/>`
  // mũi tên trên vài cung
  b += head(cx + rs[0], y0 - rs[0], 0, -1, VC, 11) + head(cx - rs[1], y0 - 2 * rs[0] + rs[1], 0, 1, VC, 11)
  b += circ(cx, y0, 5, VC, VC, 1)
  b += t(cx - 70, cy - R + 62, '*D*_{1}', { size: 24, bold: true }) + t(cx + 70, cy - R + 62, '*D*_{2}', { size: 24, bold: true })
  b += t(cx + 130, cy - R - 2, '*B* vào', { size: 18, col: '#173a9c' })
  // nguồn xoay chiều
  b += ln(cx - g - 20, cy + R - 4, cx - g - 20, 392, INK, 2) + ln(cx + g + 20, cy + R - 4, cx + g + 20, 392, INK, 2)
  b += ln(cx - g - 20, 392, cx - 26, 392, INK, 2) + ln(cx + g + 20, 392, cx + 26, 392, INK, 2)
  b += circ(cx, 392, 24, '#fff', INK, 2) + `<path d="M ${cx - 14} 392 q 7 -12 14 0 t 14 0" fill="none" stroke="${INK}" stroke-width="2"/>`
  b += t(cx + 48, 399, '*U*', { size: 22, bold: true, anchor: 'start' })
  fig('H048_1', w, h, b)
}

// ---- H048_2: cyclotron — mặt cắt đứng, nam châm
{
  const w = 520, h = 380, cx = 260
  let b = ''
  b += rect(90, 20, 340, 52, '#f8e1de', INK, 2) + t(cx, 55, 'N', { size: 26, col: IC, bold: true, halo: false })
  b += rect(90, 252, 340, 52, '#dde7fb', INK, 2) + t(cx, 288, 'S', { size: 26, col: BC, bold: true, halo: false })
  b += rect(110, 100, 128, 124, '#eef2f8', INK, 2, 4) + rect(282, 100, 128, 124, '#eef2f8', INK, 2, 4)
  b += t(174, 168, '*D*_{1}', { size: 24, bold: true }) + t(346, 168, '*D*_{2}', { size: 24, bold: true })
  // hạt và đường bay giữa khe
  b += arrow(cx - 26, 188, cx + 24, 188, VC, 3.4, 12) + circ(cx - 38, 188, 7, '#fff', INK, 2)
  b += arrow(cx, 82, cx, 242, '#173a9c', 3.2, 13, '7 6')
  b += t(cx + 16, 98, '*B*', { size: 24, col: '#173a9c', bold: true, anchor: 'start' })
  // nguồn xoay chiều nối hai hộp (dây đi vòng ngoài nam châm)
  b += `<path d="M 110 162 L 66 162 L 66 346 L ${cx - 22} 346 M 410 162 L 454 162 L 454 346 L ${cx + 22} 346" fill="none" stroke="${INK}" stroke-width="2"/>`
  b += circ(cx, 346, 21, '#fff', INK, 2) + `<path d="M ${cx - 12} 346 q 6 -11 12 0 t 12 0" fill="none" stroke="${INK}" stroke-width="2"/>`
  b += t(cx + 50, 338, '*U*', { size: 22, bold: true })
  fig('H048_2', w, h, b)
}

// ---- H049: máy phát MHD
{
  const w = 560, h = 340
  let b = ''
  b += rect(110, 100, 340, 150, '#f3f6fc', INK, 1.4, 0)
  b += rect(150, 90, 260, 10, '#555', INK, 1.5) + rect(150, 250, 260, 10, '#555', INK, 1.5)
  b += t(130, 86, '*A*', { size: 24, bold: true }) + t(130, 284, '*B*', { size: 24, bold: true })
  b += arrow(22, 175, 104, 175, VC, 4, 15) + t(62, 150, 'plasma', { size: 19, col: VC, bold: true })
  b += t(62, 204, '*v*', { size: 22, col: VC, bold: true })
  b += arrow(456, 175, 506, 175, VC, 3.6, 14)
  for (const x of [170, 230, 290, 430]) for (const y of [160, 190]) b += sIn(x, y, 7, '#aebfef')
  for (let i = 0; i < 5; i++) { b += circ(172 + i * 60, 118, 9, '#fff', IC, 2) + t(172 + i * 60, 124, '+', { size: 17, col: IC, bold: true, halo: false }) }
  for (let i = 0; i < 5; i++) { b += circ(202 + i * 60, 232, 9, '#fff', BC, 2) + t(202 + i * 60, 238, '−', { size: 17, col: BC, bold: true, halo: false }) }
  b += arrow(307, 116, 307, 236, EC, 3.4, 13) + t(318, 182, '*E*', { size: 24, col: EC, bold: true, anchor: 'start' })
  b += sIn(80, 318, 9, BC) + t(98, 325, '*B* vào trang', { size: 18, col: '#173a9c', anchor: 'start' })
  // mạch ngoài
  b += `<path d="M 250 90 L 250 30 L 538 30 L 538 224 M 538 290 L 538 316 L 250 316 L 250 260" fill="none" stroke="${INK}" stroke-width="2"/>`
  b += rect(518, 224, 40, 66, '#fff', INK, 2) + t(538, 266, '*R*', { size: 22, bold: true, halo: false })
  fig('H049', w, h, b)
}

// ---- H050: lưu lượng kế điện từ
{
  const w = 560, h = 330, cy = 165
  let b = ''
  b += rect(40, cy - 50, 360, 100, '#eef3fa', INK, 2.4)
  b += rect(30, cy - 62, 14, 124, '#9aa3ad', INK, 2) + rect(396, cy - 62, 14, 124, '#9aa3ad', INK, 2)
  b += circ(220, cy, 84, 'none', '#aebfef', 1.6, '6 5')
  for (const [dx, dy] of [[-40, -22], [0, -26], [40, -22], [-40, 22], [0, 26], [40, 22], [0, 0]]) b += sIn(220 + dx, cy + dy, 7, '#aebfef')
  b += arrow(54, cy, 124, cy, VC, 3.4, 13) + t(88, cy - 14, '*v*', { size: 22, col: VC, bold: true })
  b += arrow(320, cy, 388, cy, VC, 3.4, 13)
  // điện cực
  b += rect(212, cy - 50, 16, 14, '#444', INK, 1.5) + rect(212, cy + 36, 16, 14, '#444', INK, 1.5)
  b += circ(190, cy - 36, 8, '#fff', IC, 2) + t(190, cy - 30, '+', { size: 16, col: IC, bold: true, halo: false })
  b += circ(250, cy + 36, 8, '#fff', BC, 2) + t(250, cy + 42, '−', { size: 16, col: BC, bold: true, halo: false })
  // dây đến vôn kế
  b += `<path d="M 220 ${cy - 50} L 220 50 L 490 50 L 490 ${cy - 30}" fill="none" stroke="${INK}" stroke-width="2"/>`
  b += `<path d="M 220 ${cy + 50} L 220 280 L 490 280 L 490 ${cy + 30}" fill="none" stroke="${INK}" stroke-width="2"/>`
  b += circ(490, cy, 30, '#fff', INK, 2.4) + t(490, cy + 8, 'V', { size: 24, bold: true, halo: false })
  b += t(318, 40, 'điện cực', { size: 18, bold: true, anchor: 'start' }).replace('x="318"', 'x="238"')
  b += sIn(60, 292, 9, BC) + t(78, 299, '*B* vào trang', { size: 18, col: '#173a9c', anchor: 'start' })
  fig('H050', w, h, b)
}

// ---- H051: từ thông — mặt S vuông góc với đường sức
{
  const w = 480, h = 300
  let b = ''
  for (const y of [70, 110, 150, 190, 230]) b += ln(30, y, 440, y, BC, 2.2) + head(100, y, 1, 0, BC, 11) + head(440, y, 1, 0, BC, 11)
  b += poly([[240, 52], [296, 28], [296, 224], [240, 248]], 'rgba(230,236,245,0.82)', INK, 2)
  b += t(268, 270, '*S*', { size: 24, bold: true, halo: false })
  b += t(66, 52, '*B*', { size: 26, col: '#173a9c', bold: true })
  b += `<path d="M 228 160 L 228 148 L 240 148" fill="none" stroke="${INK}" stroke-width="0"/>`
  fig('H051', w, h, b)
}

// ---- H052: cảm ứng từ là mật độ từ thông
{
  const w = 560, h = 300
  let b = ''
  const panel = (x0, ys, lab) => {
    let s = ''
    for (const y of ys) s += ln(x0, y, x0 + 230, y, BC, 2.2) + head(x0 + 230, y, 1, 0, BC, 11) + head(x0 + 70, y, 1, 0, BC, 11)
    const cx = x0 + 120
    s += poly([[cx, 40], [cx + 36, 24], [cx + 36, 210], [cx, 226]], 'rgba(230,236,245,0.8)', INK, 2)
    s += t(cx + 16, 250, '*S*', { size: 22, bold: true, halo: false })
    s += t(x0 + 115, 284, lab, { size: 20, col: '#173a9c', bold: true })
    return s
  }
  b += panel(20, [62, 90, 118, 146, 174, 202], '*B* lớn: nhiều đường sức')
  b += panel(300, [90, 175], '*B* nhỏ: ít đường sức')
  fig('H052', w, h, b)
}

// ---- H053: mặt phẳng không vuông góc với đường sức từ
{
  const w = 500, h = 340, cx = 230, cy = 170, al = 35, L = 100
  const ca = Math.cos(deg(al)), sa = Math.sin(deg(al))
  const ex = sa, ey = ca       // hướng mặt phẳng (nhìn cạnh)
  const p1 = [cx + L * ex, cy + L * ey], p2 = [cx - L * ex, cy - L * ey]
  let b = ''
  for (const y of [60, 110, 170, 230, 280]) b += ln(24, y, 470, y, BC, 1.8) + head(90, y, 1, 0, BC, 10) + head(470, y, 1, 0, BC, 10)
  // hình chiếu S'
  const xs = 400
  b += ln(p1[0], p1[1], xs, p1[1], '#777', 1.4, '5 5') + ln(p2[0], p2[1], xs, p2[1], '#777', 1.4, '5 5')
  b += ln(xs, p2[1], xs, p1[1], FC, 6)
  b += t(xs + 14, cy + 6, "*S*'", { size: 24, col: FC, bold: true, anchor: 'start' })
  b += ln(p1[0], p1[1], p2[0], p2[1], INK, 6)
  b += t(p1[0] - 30, p1[1] + 14, '*S*', { size: 24, bold: true })
  // pháp tuyến n
  b += arrow(cx, cy, cx + 78 * ca, cy - 78 * sa, INK, 3, 12)
  b += t(cx + 90 * ca + 6, cy - 90 * sa - 4, '*n*', { size: 22, bold: true, anchor: 'start' })
  b += ln(cx, cy, cx + 100, cy, '#555', 1.6, '5 5')
  b += `<path d="M ${cx + 54} ${cy} A 54 54 0 0 0 ${cx + 54 * ca} ${cy - 54 * sa}" fill="none" stroke="${INK}" stroke-width="1.8"/>`
  b += t(cx + 36, cy - 10, 'α', { size: 20 })
  b += t(60, 46, '*B*', { size: 26, col: '#173a9c', bold: true })
  fig('H053', w, h, b)
}

// ---- H054: đồ thị Φ = NBS cos α
{
  const w = 540, h = 320, ox = 74, oy = 160, A = 92, W = 400
  const X = (a) => ox + W * a / 360, Y = (v) => oy - A * v
  let b = ln(ox - 8, oy, ox + W + 24, oy, INK, 2) + head(ox + W + 28, oy, 1, 0, INK, 12) + ln(ox, oy + A + 26, ox, oy - A - 26, INK, 2) + head(ox, oy - A - 30, 0, -1, INK, 12)
  b += ln(ox, Y(1), ox + W, Y(1), '#bbb', 1.2, '5 5') + ln(ox, Y(-1), ox + W, Y(-1), '#bbb', 1.2, '5 5')
  let d = ''
  for (let a = 0; a <= 360; a += 3) d += `${a === 0 ? 'M' : 'L'} ${f(X(a))} ${f(Y(Math.cos(deg(a))))} `
  b += `<path d="${d}" fill="none" stroke="${BC}" stroke-width="3.2"/>`
  for (const a of [0, 180, 360]) b += circ(X(a), Y(Math.cos(deg(a))), 6, IC, IC, 1)
  for (const a of [90, 270]) b += circ(X(a), oy, 6, '#fff', FC, 2.4)
  for (const a of [90, 180, 270, 360]) b += ln(X(a), oy - 5, X(a), oy + 5, INK, 1.6)
  for (const a of [0, 90, 180, 270, 360]) b += t(X(a) + (a === 0 ? -8 : a === 90 ? -6 : a === 270 ? 6 : 0), oy + 24, `${a}°`, { size: 17, anchor: a === 0 || a === 90 ? 'end' : a === 270 ? 'start' : 'middle' })
  b += t(ox - 10, Y(1) + 6, '*NBS*', { size: 19, anchor: 'end' }) + t(ox - 10, Y(-1) + 6, '−*NBS*', { size: 19, anchor: 'end' })
  b += t(ox + W + 26, oy + 28, 'α', { size: 24 }) + t(ox + 22, oy - A - 28, 'Φ', { size: 24 })
  fig('H054', w, h, b)
}

// ---------- xuất PNG ----------
mkdirSync(OUT, { recursive: true })
const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
try {
  const pg = await br.newPage()
  for (const g of figs) {
    if (g.w > 560 || g.h > 420) throw new Error(`${g.ten} quá khung ${g.w}x${g.h}`)
    await pg.setViewport({ width: g.w, height: g.h, deviceScaleFactor: 2 })
    await pg.setContent(`<body style="margin:0;background:#fff">${svgOf(g.w, g.h, g.body)}</body>`)
    await pg.screenshot({ path: `${OUT}/${g.ten}.png`, clip: { x: 0, y: 0, width: g.w, height: g.h } })
  }
} finally { await br.close() }
console.log('xong', figs.length, 'hình')
