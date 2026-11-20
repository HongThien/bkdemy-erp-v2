// Vẽ lại hình — gói dai678/goi6 (Đại 6–8): vườn/sân/tấm bìa/hệ trục/khối gỗ.
//   node scripts/anh/ve_lai/dai678-goi6.mjs "<thu_muc_ra>"
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || './moi'
const FT = `font-family="'Times New Roman',Times,serif"`
const txt = (x, y, t, { size = 24, anchor = 'middle' } = {}) => {
  const s = t.split(/(\(m\)|3 m|cm)/).map((q, i) => i % 2 ? q : q.replace(/[A-Za-z]+/g, (m) => `<tspan font-style="italic">${m}</tspan>`)).join('')
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${FT} font-size="${size}">${s}</text>`
}
const L = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`
const head = (x, y, dx, dy, s = 9) => {
  const l = Math.hypot(dx, dy); dx /= l; dy /= l
  const bx = x - dx * s, by = y - dy * s, px = -dy * s * 0.45, py = dx * s * 0.45
  return `<path d="M ${x} ${y} L ${bx + px} ${by + py} L ${bx - px} ${by - py} Z" fill="#222" stroke="none"/>`
}
const arrow2 = (x1, y1, x2, y2) => L(x1, y1, x2, y2) + head(x1, y1, x1 - x2, y1 - y2) + head(x2, y2, x2 - x1, y2 - y1)
const rect = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`
const y2 = (x, y) => `<tspan font-style="italic">y</tspan><tspan font-size="15" dy="-9">2</tspan><tspan dy="9">+1</tspan>`

// T108000000233 và T108000000659: vườn vuông, mảnh chữ nhật ở góc trên phải
async function vuon(ten, fx, fy, nhan, cx, cy, dv) {
  const W = 420, H = 340, l = 50, t = 50, s = 230, r = l + s, b = t + s
  const rx = l + s * fx, ry = b - s * fy
  let body = rect(l, t, s, s) + rect(rx, t, r - rx, ry - t, 'fill="#e3e3e3"')
  body += txt((rx + r) / 2, (t + ry) / 2 - 6, nhan[0], { size: 22 }) + txt((rx + r) / 2, (t + ry) / 2 + 22, nhan[1], { size: 22 })
  body += arrow2(l, t - 22, rx, t - 22) + L(l, t - 30, l, t - 4, 'stroke-dasharray="4 3"') + L(rx, t - 30, rx, t - 4, 'stroke-dasharray="4 3"')
  body += txt((l + rx) / 2, t - 30, `${cx} (${dv})`, { size: 22 })
  body += arrow2(r + 24, ry, r + 24, b) + L(r + 6, ry, r + 32, ry, 'stroke-dasharray="4 3"')
  body += txt(r + 34, (ry + b) / 2 + 8, `${cy} (${dv})`, { size: 22, anchor: 'start' })
  body += txt((l + r) / 2, b + 34, `x (${dv})`, { size: 24 })
  await luu(RA, ten, W, H, svgDoc(W, H, body))
}
await vuon('T108000000233', 0.6, 0.3, ['Mảnh đất', 'làm nhà'], 25, 15, 'm')
await vuon('T108000000659', 0.6, 0.4, ['Mảnh đất', 'trồng rau'], 15, 10, 'm')

// T108000000251 và T108000000632: sân vận động có lối đi 3 m
async function san(ten) {
  const W = 440, H = 400, l = 60, t = 60, w = 200, h = 280, r = l + w, b = t + h, g = 48
  let body = rect(l, t, w, h, 'fill="#e9e9e9"') + rect(l + g, t + g, w - 2 * g, h - 2 * g, 'fill="#fff"')
  const cx = l + w / 2, cy = t + h / 2
  body += L(l + g, cy, r - g, cy) + `<circle cx="${cx}" cy="${cy}" r="24"/>` + `<circle cx="${cx}" cy="${cy}" r="2.5" fill="#222"/>`
  body += rect(cx - 40, t + g, 80, 38) + rect(cx - 20, t + g, 40, 16) + rect(cx - 40, b - g - 38, 80, 38) + rect(cx - 20, b - g - 16, 40, 16)
  body += arrow2(cx + 70, t, cx + 70, t + g) + txt(cx + 62, t + g / 2 + 8, '3 m', { size: 22, anchor: 'end' })
  body += arrow2(cx + 70, b - g, cx + 70, b) + txt(cx + 62, b - g / 2 + 8, '3 m', { size: 22, anchor: 'end' })
  body += arrow2(l, cy + 50, l + g, cy + 50) + txt(l + g / 2, cy + 42, '3 m', { size: 22 })
  body += arrow2(r - g, cy + 50, r, cy + 50) + txt(r - g / 2, cy + 42, '3 m', { size: 22 })
  body += arrow2(l, t - 22, r, t - 22) + txt(cx, t - 32, 'x − y', { size: 24 })
  body += arrow2(r + 34, t, r + 34, b) + txt(r + 44, cy + 8, 'x + y', { size: 24, anchor: 'start' })
  await luu(RA, ten, W, H, svgDoc(W, H, body))
}
await san('T108000000251'); await san('T108000000632')

// T108000000321: tấm bìa, cắt 4 góc
{
  const W = 560, H = 320, l = 120, t = 60, w = 360, h = 190, r = l + w, b = t + h, s = 56
  let body = rect(l, t, w, h)
  for (const [x, y] of [[l, t], [r - s, t], [l, b - s], [r - s, b - s]]) body += rect(x, y, s, s, 'fill="#cfcfcf"')
  body += L(l + s, t + s, r - s, t + s, 'stroke-dasharray="8 6"') + L(l + s, b - s, r - s, b - s, 'stroke-dasharray="8 6"')
  body += arrow2(l, t - 26, r, t - 26) + txt((l + r) / 2, t - 36, 'x + 43', { size: 24 })
  body += arrow2(l - 28, t, l - 28, b) + txt(l - 38, (t + b) / 2 + 8, 'x + 30', { size: 24, anchor: 'end' })
  body += `<text x="${r + 8}" y="${t + s / 2 + 8}" fill="#111" stroke="none" ${FT} font-size="22">${y2()}</text>`
  body += `<text x="${r - s / 2}" y="${b + 30}" text-anchor="middle" fill="#111" stroke="none" ${FT} font-size="22">${y2()}</text>`
  await luu(RA, 'T108000000321', W, H, svgDoc(W, H, body))
}

// T1080000002435: hệ trục Oxy, điểm A(2;-3), B(-2;1) — không vẽ đường chiếu
{
  const W = 340, H = 340, u = 46, ox = 170, oy = 170
  let body = L(ox - 3.6 * u, oy, ox + 3.6 * u, oy) + head(ox + 3.6 * u, oy, 1, 0) + L(ox, oy + 3.6 * u, ox, oy - 3.6 * u) + head(ox, oy - 3.6 * u, 0, -1)
  for (const k of [-3, -2, -1, 1, 2, 3]) {
    body += L(ox + k * u, oy - 5, ox + k * u, oy + 5) + L(ox - 5, oy - k * u, ox + 5, oy - k * u)
    body += txt(ox + k * u, oy + 26, String(k).replace('-', '−'), { size: 20 })
    body += txt(ox - 12, oy - k * u + 7, String(k).replace('-', '−'), { size: 20, anchor: 'end' })
  }
  body += txt(ox - 12, oy + 24, 'O', { size: 24, anchor: 'end' }) + txt(ox + 3.6 * u, oy - 12, 'x', { size: 24 }) + txt(ox + 14, oy - 3.5 * u + 6, 'y', { size: 24, anchor: 'start' })
  const pt = (x, y, n, dx, dy) => `<circle cx="${ox + x * u}" cy="${oy - y * u}" r="4.5" fill="#222" stroke="none"/>` + txt(ox + x * u + dx, oy - y * u + dy, n, { size: 26 })
  body += pt(2, -3, 'A', 16, 8) + pt(-2, 1, 'B', -14, -8)
  await luu(RA, 'T1080000002435', W, H, svgDoc(W, H, body))
}

// T108000000892: khối gỗ lập phương cạnh x, cắt bỏ khối lập phương nhỏ ở góc trên-phải-trước
{
  const W = 540, H = 360, l = 40, t = 110, s = 200, c = 80, ux = 80, uy = -64, X = s, B = s
  const k = (x, y, z) => [l + x + z * ux / s, t + y + z * uy / s]
  const p = (x, y, z) => k(x, y, z).map((v) => Math.round(v * 10) / 10).join(' ')
  const poly = (pts, fill) => `<path d="M ${pts.map(([x, y, z]) => p(x, y, z)).join(' L ')} Z" fill="${fill}"/>`
  let body = ''
  body += poly([[0, 0, s], [X, 0, s], [X, 0, c], [X - c, 0, c], [X - c, 0, 0], [0, 0, 0]], '#f0f0f0')
  body += poly([[0, 0, 0], [X - c, 0, 0], [X - c, c, 0], [X, c, 0], [X, B, 0], [0, B, 0]], '#fff')
  body += poly([[X, c, 0], [X, B, 0], [X, B, s], [X, 0, s], [X, 0, c], [X, c, c]], '#d9d9d9')
  body += poly([[X - c, c, 0], [X, c, 0], [X, c, c], [X - c, c, c]], '#bdbdbd')
  body += poly([[X - c, 0, c], [X, 0, c], [X, c, c], [X - c, c, c]], '#cfcfcf')
  body += poly([[X - c, 0, 0], [X - c, 0, c], [X - c, c, c], [X - c, c, 0]], '#e2e2e2')
  const [lx, ly] = k(0, s / 2, 0)
  body += txt(lx - 14, ly + 8, 'x', { size: 26, anchor: 'end' })
  const [hx, hy] = k(X - c / 2, c / 2, c / 2)
  body += txt(W - 20, 40, 'V = 1728 cm³', { size: 24, anchor: 'end' })
  body += L(W - 120, 52, hx + 4, hy - 4) + head(hx + 4, hy - 4, hx - W + 120, hy - 52)
  await luu(RA, 'T108000000892', W, H, svgDoc(W, H, body))
}
console.log('xong')
