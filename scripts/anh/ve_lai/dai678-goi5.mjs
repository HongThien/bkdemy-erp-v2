// Vẽ lại hình — gói dai678/goi5 (Đại 6–8: hộp bìa, biểu đồ tranh, quạt, đoạn thẳng).
//   node scripts/anh/ve_lai/dai678-goi5.mjs "<thu_muc_ra>"
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const RA = process.argv[2]
const FONT = `font-family="'Times New Roman',Times,serif"`
const txt = (x, y, t, { size = 21, anchor = 'middle', bold = false, halo = false, rot = 0 } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#222" stroke="${halo ? '#fff' : 'none'}" ${halo ? 'stroke-width="5" paint-order="stroke" stroke-linejoin="round"' : ''} ${FONT} font-size="${size}" ${bold ? 'font-weight="bold"' : ''}${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${t}</text>`
const it = (s) => `<tspan font-style="italic">${s}</tspan>`
const sq = (s = 21) => `<tspan dy="-${Math.round(s * 0.4)}" font-size="${Math.round(s * 0.7)}">2</tspan><tspan dy="${Math.round(s * 0.4)}">`

// ---------- mẫu tô (phân biệt được khi in đen trắng) ----------
const PAT = `<defs>
<pattern id="d1" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff" stroke="none"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2"/></pattern>
<pattern id="d2" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="8" height="8" fill="#fff" stroke="none"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2"/></pattern>
<pattern id="dot" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff" stroke="none"/><circle cx="4" cy="4" r="1.7" fill="#222" stroke="none"/></pattern>
<pattern id="hz" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff" stroke="none"/><line x1="0" y1="4" x2="8" y2="4" stroke="#222" stroke-width="2"/></pattern>
<pattern id="vt" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff" stroke="none"/><line x1="4" y1="0" x2="4" y2="8" stroke="#222" stroke-width="2"/></pattern>
<pattern id="cx" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#fff" stroke="none"/><path d="M0 0V9M0 0H9" stroke="#222" stroke-width="1.6"/></pattern>
<pattern id="gr" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#cfcfcf" stroke="none"/></pattern>
<pattern id="wh" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#fff" stroke="none"/></pattern>
</defs>`

const R2 = (n) => Math.round(n * 100) / 100
const ptAt = (cx, cy, r, deg) => [R2(cx + r * Math.sin(deg * Math.PI / 180)), R2(cy - r * Math.cos(deg * Math.PI / 180))]

// slices: [{v, pat}] bắt đầu từ 12 giờ, theo chiều kim đồng hồ. Trả về {svg, mids}
function pie(cx, cy, r, slices) {
  const tong = slices.reduce((s, x) => s + x.v, 0)
  let a = 0, out = '', mids = []
  for (const s of slices) {
    const b = a + (s.v / tong) * 360
    const [x0, y0] = ptAt(cx, cy, r, a), [x1, y1] = ptAt(cx, cy, r, b)
    out += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${b - a > 180 ? 1 : 0} 1 ${x1} ${y1} Z" fill="url(#${s.pat})" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    mids.push((a + b) / 2)
    a = b
  }
  return { svg: out, mids }
}
// nhãn ngoài có đường dẫn
function ngoai(cx, cy, r, deg, t, size = 21) {
  const [x0, y0] = ptAt(cx, cy, r + 2, deg), [x1, y1] = ptAt(cx, cy, r + 16, deg)
  const right = Math.sin(deg * Math.PI / 180) >= 0
  const x2 = x1 + (right ? 10 : -10)
  return `<polyline points="${x0},${y0} ${x1},${y1} ${x2},${y1}" stroke="#222" stroke-width="1.4"/>` +
    txt(x2 + (right ? 5 : -5), R2(y1 + size * 0.34), t, { size, anchor: right ? 'start' : 'end' })
}
const trong = (cx, cy, r, deg, t, size = 21) => { const [x, y] = ptAt(cx, cy, r, deg); return txt(x, R2(y + size * 0.34), t, { size, halo: true }) }
const swatch = (x, y, pat) => `<rect x="${x}" y="${y}" width="34" height="22" fill="url(#${pat})" stroke="#222" stroke-width="1.8"/>`

// ================= T1080000001474 — tấm bìa cắt 4 góc =================
{
  const W = 540, H = 350, x0 = 80, y0 = 56, w = 360, h = 240, s = 74
  const sqr = (x, y) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="url(#gr)" stroke="#222" stroke-width="2"/>`
  const x1 = x0 + w, y1 = y0 + h
  const mui = (ax, ay, bx, by) => {
    // mũi tên hai đầu
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux
    const hd = (px, py, sg) => `M ${R2(px + sg * (ux * 10 + nx * 5))} ${R2(py + sg * (uy * 10 + ny * 5))} L ${px} ${py} L ${R2(px + sg * (ux * 10 - nx * 5))} ${R2(py + sg * (uy * 10 - ny * 5))}`
    return `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke-width="1.6"/><path d="${hd(ax, ay, 1)}" stroke-width="1.6"/><path d="${hd(bx, by, -1)}" stroke-width="1.6"/>`
  }
  const body = PAT +
    `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" stroke-width="2.4"/>` +
    sqr(x0, y0) + sqr(x1 - s, y0) + sqr(x0, y1 - s) + sqr(x1 - s, y1 - s) +
    // đường gấp (nét đứt) nối các cạnh trong của 4 hình vuông
    `<g stroke-dasharray="9 7" stroke-width="1.8"><line x1="${x0 + s}" y1="${y0 + s}" x2="${x1 - s}" y2="${y0 + s}"/><line x1="${x0 + s}" y1="${y1 - s}" x2="${x1 - s}" y2="${y1 - s}"/><line x1="${x0 + s}" y1="${y0 + s}" x2="${x0 + s}" y2="${y1 - s}"/><line x1="${x1 - s}" y1="${y0 + s}" x2="${x1 - s}" y2="${y1 - s}"/></g>` +
    mui(x0, 28, x1, 28) + mui(40, y0, 40, y1) +
    txt((x0 + x1) / 2, 22, `${it('x')} + 43`) +
    txt(26, (y0 + y1) / 2, `${it('x')} + 30`, { rot: -90 }) +
    txt(x1 + 8, y1 - s / 2 + 7, `${it('y')}${sq()} + 1</tspan>`, { anchor: 'start' }).replace('</text>', '</text>') +
    txt(x1 - s / 2, y1 + 28, `${it('y')}${sq()} + 1</tspan>`)
  await luu(RA, 'T1080000001474', W, H, svgDoc(W, H, body))
}

// ================= T1080000001475 — biểu đồ tranh =================
{
  const W = 520, H = 250, x0 = 20, c1 = 220, x1 = 500, y0 = 20, rh = 62
  const mat = (cx, cy) => `<g><circle cx="${cx}" cy="${cy}" r="19" stroke-width="2"/><circle cx="${cx - 7}" cy="${cy - 5}" r="2.2" fill="#222" stroke="none"/><circle cx="${cx + 7}" cy="${cy - 5}" r="2.2" fill="#222" stroke="none"/><path d="M ${cx - 10} ${cy + 3} Q ${cx} ${cy + 16} ${cx + 10} ${cy + 3}" stroke-width="2"/></g>`
  const rows = [['Tiếng Anh', 2], ['Võ thuật', 3], ['Nghệ thuật', 2]]
  let b = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${rh * 3}" stroke-width="2.4"/><line x1="${c1}" y1="${y0}" x2="${c1}" y2="${y0 + rh * 3}"/>`
  rows.forEach(([n, k], i) => {
    const cy = y0 + rh * i + rh / 2
    if (i) b += `<line x1="${x0}" y1="${y0 + rh * i}" x2="${x1}" y2="${y0 + rh * i}"/>`
    b += txt(x0 + 14, cy + 8, n, { size: 24, anchor: 'start' })
    for (let j = 0; j < k; j++) b += mat(c1 + 50 + j * 78, cy)
  })
  b += txt((x0 + x1) / 2, y0 + rh * 3 + 36, 'Hình 5.6', { size: 22 })
  await luu(RA, 'T1080000001475', W, H, svgDoc(W, H, b))
}

// ================= T1080000001478 — cơ cấu GDP VN 2021 =================
{
  const W = 520, H = 418, cx = 260, cy = 150, r = 88
  const sl = [{ v: 12.36, pat: 'dot' }, { v: 37.86, pat: 'd1' }, { v: 40.95, pat: 'wh' }, { v: 8.83, pat: 'gr' }]
  const lab = ['12,36%', '37,86%', '40,95%', '8,83%']
  const { svg, mids } = pie(cx, cy, r, sl)
  let b = PAT + txt(W / 2, 28, 'Cơ cấu GDP Việt Nam năm 2021', { size: 23, bold: true }) + svg
  mids.forEach((m, i) => { b += ngoai(cx, cy, r, m, lab[i]) })
  const leg = [['dot', 'Nông, lâm nghiệp và thuỷ sản'], ['d1', 'Công nghiệp và xây dựng'], ['wh', 'Dịch vụ'], ['gr', 'Thuế sản phẩm trừ trợ cấp sản phẩm']]
  leg.forEach(([p, t], i) => { b += swatch(30, 258 + i * 31, p) + txt(76, 276 + i * 31, t, { size: 21, anchor: 'start' }) })
  b += txt(W / 2, 408, 'Hình 5.20', { size: 20 })
  await luu(RA, 'T1080000001478', W, H, svgDoc(W, H, b))
}

// ================= T1080000001659 — gia cầm trong trang trại =================
{
  const W = 470, H = 290, cx = 140, cy = 130, r = 105
  // thứ tự theo chú giải Lợn – Vịt – Gà (từ 12 giờ, chiều kim đồng hồ): 21% – 32% – 47%
  const sl = [{ v: 21, pat: 'd1' }, { v: 32, pat: 'dot' }, { v: 47, pat: 'wh' }]
  const { svg, mids } = pie(cx, cy, r, sl)
  let b = PAT + svg
  ;['21%', '32%', '47%'].forEach((t, i) => { b += trong(cx, cy, r * 0.64, mids[i], t, 22) })
  ;[['d1', 'Lợn'], ['dot', 'Vịt'], ['wh', 'Gà']].forEach(([p, t], i) => { b += swatch(300, 80 + i * 44, p) + txt(346, 98 + i * 44, t, { size: 23, anchor: 'start' }) })
  b += txt(cx, 270, 'Hình 2', { size: 20 })
  await luu(RA, 'T1080000001659', W, H, svgDoc(W, H, b))
}

// ================= T1080000001811 — xuất khẩu gạo 2022 =================
{
  const W = 460, H = 370, cx = 230, cy = 140, r = 95
  const sl = [{ v: 45.2, pat: 'wh' }, { v: 26.8, pat: 'd1' }, { v: 9, pat: 'dot' }, { v: 19, pat: 'vt' }]
  const lab = ['45,2%', '26,8%', '9%', '19%']
  const { svg, mids } = pie(cx, cy, r, sl)
  let b = PAT + svg
  mids.forEach((m, i) => { b += ngoai(cx, cy, r, m, lab[i]) })
  const leg = [['wh', 'Gạo trắng'], ['d1', 'Gạo thơm'], ['dot', 'Gạo nếp'], ['vt', 'Gạo khác']]
  leg.forEach(([p, t], i) => { const x = 70 + (i % 2) * 190, y = 280 + Math.floor(i / 2) * 40; b += swatch(x, y, p) + txt(x + 46, y + 19, t, { size: 22, anchor: 'start' }) })
  await luu(RA, 'T1080000001811', W, H, svgDoc(W, H, b))
}

// ================= T1080000001909 — quạt máy bán được trong năm =================
{
  const W = 540, H = 400, px0 = 74, pxEnd = 505, pyBase = 340, pyTop = 120
  const val = [25, 35, 30, 120, 140, 150, 130, 140, 80, 50, 35, 20]
  const X = (m) => R2(px0 + (m - 1) * 36 + 22), Y = (v) => R2(pyBase - (v / 150) * (pyBase - pyTop))
  let b = txt(W / 2, 28, 'Số lượng quạt máy bán được', { size: 22, bold: true }) + txt(W / 2, 54, 'trong năm vừa qua', { size: 22, bold: true })
  // trục
  b += `<line x1="${px0}" y1="${pyBase}" x2="${pxEnd}" y2="${pyBase}" stroke-width="2"/><path d="M ${pxEnd - 10} ${pyBase - 5} L ${pxEnd} ${pyBase} L ${pxEnd - 10} ${pyBase + 5}" stroke-width="2"/>`
  b += `<line x1="${px0}" y1="${pyBase}" x2="${px0}" y2="${pyTop - 30}" stroke-width="2"/><path d="M ${px0 - 5} ${pyTop - 20} L ${px0} ${pyTop - 30} L ${px0 + 5} ${pyTop - 20}" stroke-width="2"/>`
  ;[0, 50, 100, 150].forEach((v) => { b += `<line x1="${px0 - 5}" y1="${Y(v)}" x2="${px0}" y2="${Y(v)}" stroke-width="1.8"/><line x1="${px0}" y1="${Y(v)}" x2="${pxEnd - 12}" y2="${Y(v)}" stroke="#cfcfcf" stroke-width="1"/>` + txt(px0 - 9, Y(v) + 7, String(v), { size: 21, anchor: 'end' }) })
  b += txt(px0 + 6, pyTop - 38, 'Số lượng', { size: 21, anchor: 'start' }).replace('font-size="21"', 'font-size="21" font-style="italic"')
  b += txt(pxEnd - 4, pyBase + 52, 'Tháng', { size: 21, anchor: 'end' }).replace('font-size="21"', 'font-size="21" font-style="italic"')
  val.forEach((v, i) => { b += `<line x1="${X(i + 1)}" y1="${pyBase}" x2="${X(i + 1)}" y2="${pyBase + 5}" stroke-width="1.8"/>` + txt(X(i + 1), pyBase + 27, String(i + 1), { size: 21 }) })
  b += `<polyline points="${val.map((v, i) => `${X(i + 1)},${Y(v)}`).join(' ')}" stroke="#222" stroke-width="2.4" stroke-linejoin="round"/>`
  val.forEach((v, i) => { b += `<circle cx="${X(i + 1)}" cy="${Y(v)}" r="4.5" fill="#222" stroke="none"/>` })
  // nhãn giá trị (vị trí từng điểm để không đè đường)
  const pos = { 1: [0, -11, 'middle'], 2: [0, -11, 'middle'], 3: [0, 26, 'middle'], 4: [-8, -10, 'end'], 5: [0, -11, 'middle'], 6: [0, -11, 'middle'], 7: [0, 28, 'middle'], 8: [0, -11, 'middle'], 9: [9, -4, 'start'], 10: [9, -7, 'start'], 11: [9, -8, 'start'], 12: [0, -11, 'middle'] }
  val.forEach((v, i) => { const [dx, dy, an] = pos[i + 1]; b += txt(X(i + 1) + dx, Y(v) + dy, String(v), { size: 20, anchor: an, halo: true }) })
  await luu(RA, 'T1080000001909', W, H, svgDoc(W, H, b))
}

// ================= T1080000001911 — mục đích vào Internet =================
{
  const W = 520, H = 320, cx = 150, cy = 170, r = 108
  const sl = [{ v: 35, pat: 'dot' }, { v: 40, pat: 'hz' }, { v: 25, pat: 'cx' }]
  const { svg, mids } = pie(cx, cy, r, sl)
  let b = PAT + txt(W / 2, 28, 'Mục đích vào mạng Internet', { size: 23, bold: true }) + svg
  ;['35%', '40%', '25%'].forEach((t, i) => { b += trong(cx, cy, r * 0.6, mids[i], t, 23) })
  ;[['dot', 'Phục vụ học tập'], ['hz', 'Kết nối bạn bè'], ['cx', 'Giải trí']].forEach(([p, t], i) => { b += swatch(290, 110 + i * 44, p) + txt(334, 128 + i * 44, t, { size: 22, anchor: 'start' }) })
  await luu(RA, 'T1080000001911', W, H, svgDoc(W, H, b))
}
console.log('xong')
