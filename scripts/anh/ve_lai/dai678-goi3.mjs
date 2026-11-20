// Vẽ lại hình — gói dai678/goi3 (7 hình: quạt, đoạn thẳng, trục số, bàn cờ).
//   node scripts/anh/ve_lai/dai678-goi3.mjs "<thu_muc_ra>"
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const RA = process.argv[2]
const FONT = `font-family="'Times New Roman',Times,serif"`
const txt = (x, y, t, { size = 22, anchor = 'middle', italic = false, bold = false, fill = '#111' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" stroke="none" ${FONT} font-size="${size}"${italic ? ' font-style="italic"' : ''}${bold ? ' font-weight="bold"' : ''}>${t}</text>`
const f = (n) => Math.round(n * 100) / 100

// ---------- mẫu tô (phân biệt được khi in đen trắng) ----------
const DEFS = `<defs>
<pattern id="p0" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><circle cx="2" cy="2" r="1.3" fill="#222" stroke="none"/><circle cx="6" cy="6" r="1.3" fill="#222" stroke="none"/></pattern>
<pattern id="p1" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 8 L8 0 M-2 2 L2 -2 M6 10 L10 6" stroke="#222" stroke-width="1.4"/></pattern>
<pattern id="p2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 0 L8 8 M-2 6 L2 10 M6 -2 L10 2" stroke="#222" stroke-width="1.4"/></pattern>
<pattern id="p3" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><path d="M0 0 H10 M0 0 V10" stroke="#222" stroke-width="1.4"/></pattern>
<pattern id="p4" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#555"/><path d="M0 3 H6" stroke="#fff" stroke-width="1"/></pattern>
<pattern id="s0" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d6d6d6"/></pattern>
</defs>`

/** Biểu đồ quạt. items: {dong[], pct, fill, lab:{x,y,anchor}?}; lab = vị trí nhãn tuỳ chọn (toạ độ tuyệt đối) */
function pie(W, H, cx, cy, R, tieuDe, items, { gap = 20 } = {}) {
  let a0 = 0, body = DEFS
  const tong = items.reduce((s, i) => s + i.pct, 0)
  tieuDe.forEach((t, i) => { body += txt(W / 2, 30 + i * 26, t, { size: 23, bold: true }) })
  let leader = '', labels = ''
  for (const it of items) {
    const a1 = a0 + it.pct / tong * 360, am = (a0 + a1) / 2
    const P = (a, r) => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)]
    const [x0, y0] = P(a0, R), [x1, y1] = P(a1, R)
    body += `<path d="M ${cx} ${cy} L ${f(x0)} ${f(y0)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)} Z" fill="${it.fill}" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    const [ex, ey] = P(am, R)
    const lab = it.lab || (() => { const [x, y] = P(am, R + gap); return { x, y, anchor: x > cx ? 'start' : 'end' } })()
    if (it.lab) leader += `<path d="M ${f(ex)} ${f(ey)} L ${lab.x + (lab.anchor === 'start' ? -4 : 4)} ${lab.y}" stroke-width="1.5"/>`
    const lines = it.dong
    const lh = 24, y0l = lab.y - (lines.length - 1) * lh / 2 + 7
    lines.forEach((l, k) => { labels += txt(lab.x, f(y0l + k * lh), l, { size: 22, anchor: lab.anchor }) })
    a0 = a1
  }
  return svgDoc(W, H, body + leader + labels)
}

// ---------- T1070000001393 ----------
await luu(RA, 'T1070000001393', 560, 400, pie(560, 400, 280, 225, 120,
  ['Tỉ lệ phần trăm loại trái cây', 'ưa thích của lớp 7E'],
  [{ dong: ['Táo', '35%'], pct: 35, fill: 'url(#p2)' },
   { dong: ['Xoài', '15%'], pct: 15, fill: 'url(#p0)' },
   { dong: ['Dưa hấu', '25%'], pct: 25, fill: 'url(#s0)' },
   { dong: ['Chuối', '25%'], pct: 25, fill: 'url(#p3)' }]))

// ---------- T1070000001588 ----------
await luu(RA, 'T1070000001588', 560, 380, pie(560, 380, 300, 215, 115, [],
  [{ dong: ['Tinh bột', '40%'], pct: 40, fill: 'url(#p2)' },
   { dong: ['Chất đạm', '9<tspan font-style="italic">x</tspan>%'], pct: 45, fill: 'url(#s0)' },
   { dong: ['Chất béo 2<tspan font-style="italic">x</tspan>%'], pct: 10, fill: 'url(#p0)', lab: { x: 160, y: 62, anchor: 'end' } },
   { dong: ['Vitamin và', 'khoáng chất: <tspan font-style="italic">x</tspan>%'], pct: 5, fill: 'url(#p4)', lab: { x: 345, y: 36, anchor: 'start' } }]))

// ---------- T1070000001644 ----------
await luu(RA, 'T1070000001644', 560, 410, pie(560, 410, 280, 235, 120,
  ['Tỉ lệ diện tích các phòng', 'của một ngôi nhà'],
  [{ dong: ['Phòng khách', '30%'], pct: 30, fill: 'url(#p0)' },
   { dong: ['Phòng bếp', '25%'], pct: 25, fill: 'url(#p2)' },
   { dong: ['Phòng ngủ 1', '15%'], pct: 15, fill: 'url(#p4)' },
   { dong: ['Phòng ngủ 2', '22%'], pct: 22, fill: 'url(#p1)' },
   { dong: ['8%'], pct: 8, fill: 'url(#p3)', lab: { x: 190, y: 82, anchor: 'end' } }]))

// ---------- trục số ----------
// T107000000146: đơn vị chia 3; chấm ở -1, 0, 1, 2; M, N nằm trên vạch chia
{
  const x0 = 40, u = 132, y = 80
  let b = `<path d="M 20 ${y} H 510" stroke-width="2.5"/><path d="M 498 ${y - 7} L 512 ${y} L 498 ${y + 7}" stroke-width="2.5"/>`
  for (let k = 0; k <= 9; k++) b += `<path d="M ${x0 + k * u / 3} ${y - 10} V ${y + 10}" stroke-width="2.5"/>`
  for (const [k, t] of [[0, '−1'], [3, '0'], [6, '1'], [9, '2']]) {
    b += `<circle cx="${x0 + k * u / 3}" cy="${y}" r="5" fill="#222" stroke="none"/>` + txt(x0 + k * u / 3, y + 42, t, { size: 26 })
  }
  b += txt(x0 + 2 * u / 3, y - 24, 'M', { size: 28, italic: true }) + txt(x0 + 7 * u / 3, y - 24, 'N', { size: 28, italic: true })
  await luu(RA, 'T107000000146', 540, 150, svgDoc(540, 150, b))
}
// T107000000794: 7 vạch cách đều; vạch 1 = -1, vạch 6 = 0, vạch 7 bên phải 0; A ở vạch 3
{
  const W = 540, x0 = 50, st = 70, y = 80
  let b = `<path d="M 28 ${y} H 520" stroke-width="2.5"/><path d="M 508 ${y - 7} L 522 ${y} L 508 ${y + 7}" stroke-width="2.5"/>`
  for (let i = 0; i < 7; i++) b += `<path d="M ${x0 + i * st} ${y - 10} V ${y + 10}" stroke-width="2.5"/>`
  b += txt(x0, y + 42, '−1', { size: 26 }) + txt(x0 + 5 * st, y + 42, '0', { size: 26 })
  b += `<circle cx="${x0 + 2 * st}" cy="${y}" r="5" fill="#222" stroke="none"/>` + txt(x0 + 2 * st, y - 22, 'A', { size: 28, italic: true })
  await luu(RA, 'T107000000794', W, 150, svgDoc(W, 150, b))
}

// ---------- T107000000404: bàn cờ, viền rộng bằng cạnh một ô (5,5 cm) ----------
{
  const c = 36, v = 36, ox = 70, oy = 50, L = 8 * c + 2 * v
  let b = `<rect x="${ox}" y="${oy}" width="${L}" height="${L}" fill="#fff" stroke-width="2.5"/>`
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2 === 0)
    b += `<rect x="${ox + v + j * c}" y="${oy + v + i * c}" width="${c}" height="${c}" fill="#333" stroke="none"/>`
  b += `<rect x="${ox + v}" y="${oy + v}" width="${8 * c}" height="${8 * c}" fill="none" stroke-width="2"/>`
  b += txt(ox + v + c / 2, oy + v + c / 2 - 1, '30,25', { size: 15, fill: '#fff' }) + txt(ox + v + c / 2, oy + v + c / 2 + 13, 'cm²', { size: 15, fill: '#fff' })
  const midX = ox + L / 2, midY = oy + L / 2
  b += `<path d="M ${midX} ${oy - 22} V ${oy}" stroke-width="1.8"/><path d="M ${midX - 4} ${oy - 8} L ${midX} ${oy} L ${midX + 4} ${oy - 8}" stroke-width="1.8"/>` +
       txt(midX + 44, oy - 20, '5,5 cm', { size: 22 })
  b += `<path d="M ${ox - 22} ${midY} H ${ox}" stroke-width="1.8"/><path d="M ${ox - 8} ${midY - 4} L ${ox} ${midY} L ${ox - 8} ${midY + 4}" stroke-width="1.8"/>` +
       txt(ox - 26, midY - 6, '5,5', { size: 22, anchor: 'end' }) + txt(ox - 26, midY + 18, 'cm', { size: 22, anchor: 'end' })
  await luu(RA, 'T107000000404', 500, L + 80, svgDoc(500, L + 80, b))
}

// ---------- T1070000001394: biểu đồ đoạn thẳng ----------
{
  const W = 560, H = 420, xl = 72, xr = 540, yt = 80, yb = 350, lo = 22, hi = 32
  const X = (m) => xl + 20 + (m - 1) * (xr - xl - 30) / 11
  const Y = (v) => yb - (v - lo) / (hi - lo) * (yb - yt)
  const d = [26.6, 27.6, 29, 30.5, 29.5, 28.5, 28, 28, 27.6, 27.6, 27, 26]
  const vn = (v) => String(v).replace('.', ',')
  let b = txt(W / 2, 26, 'Nhiệt độ trung bình các tháng năm 2020', { size: 22, bold: true }) + txt(W / 2, 50, 'tại TPHCM', { size: 22, bold: true })
  b += txt(xl - 6, yt - 16, '°C', { size: 22, anchor: 'end' })
  for (let v = lo; v <= hi; v += 2) b += `<path d="M ${xl} ${Y(v)} H ${xr}" stroke="#bbb" stroke-width="1"/>` + txt(xl - 10, Y(v) + 7, v, { size: 21, anchor: 'end' })
  b += `<path d="M ${xl} ${yt - 8} V ${yb} H ${xr}" stroke-width="2"/>`
  d.forEach((v, i) => { b += `<path d="M ${X(i + 1)} ${Y(v)} V ${yb}" stroke-width="1.2" stroke-dasharray="5 4" stroke="#555"/>` })
  b += `<path d="M ${d.map((v, i) => `${X(i + 1)} ${Y(v)}`).join(' L ')}" stroke-width="2.5"/>`
  d.forEach((v, i) => {
    b += `<rect x="${X(i + 1) - 4.5}" y="${Y(v) - 4.5}" width="9" height="9" transform="rotate(45 ${X(i + 1)} ${Y(v)})" fill="#222" stroke="none"/>`
    b += txt(X(i + 1), Y(v) - 13, vn(v), { size: 18 })
    b += txt(X(i + 1), yb + 27, i + 1, { size: 21 })
  })
  b += txt((xl + xr) / 2, yb + 58, 'Tháng', { size: 22, bold: true })
  await luu(RA, 'T1070000001394', W, H, svgDoc(W, H, b))
}
console.log('xong')
