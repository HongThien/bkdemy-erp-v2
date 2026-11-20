// Vẽ lại hình — gói dai678/goi14 (biểu đồ đường/cột/quạt, trục số, hình chữ L)
//   node scripts/anh/ve_lai/dai678-goi14.mjs <thu_muc_ra>
import { luu } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const FF = `font-family="'Times New Roman',Times,serif"`
const fmt = (v) => String(v).replace('.', ',')
const tx = (x, y, t, { a = 'middle', s = 16, b = false, it = false } = {}) =>
  `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${a}" ${FF} font-size="${s}" ${b ? 'font-weight="bold"' : ''} ${it ? 'font-style="italic"' : ''} fill="#111" stroke="none">${t}</text>`
const svgW = (W, H, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${body}</svg>`

// ---------- khung trục đường/cột ----------
function khung({ W, H, L, R, Tp, B, ymin, ymax, step, yTitle, xTitle, fv = (v) => v }) {
  const ph = H - Tp - B
  const Y = (v) => Tp + ph - ((v - ymin) / (ymax - ymin)) * ph
  let s = ''
  for (let v = ymin; v <= ymax + 1e-9; v += step) {
    s += `<line x1="${L}" y1="${Y(v)}" x2="${W - R}" y2="${Y(v)}" stroke="#ddd" stroke-width="1"/>`
    s += tx(L - 8, Y(v) + 5, fv(v), { a: 'end' })
  }
  s += `<path d="M ${L} ${Tp - 8} V ${Y(ymin)} H ${W - R}" stroke="#222" stroke-width="2" fill="none"/>`
  if (yTitle) s += tx(L, Tp - 16, yTitle, { a: 'start' })
  if (xTitle) s += tx(W - R, H - 6, xTitle, { a: 'end' })
  return { s, Y }
}

// ===== 1502: lực lượng lao động theo quý =====
{
  const W = 560, H = 360, L = 14, R = 14
  const xs = [['Quý I', '2020'], ['Quý II', '2020'], ['Quý III', '2020'], ['Quý IV', '2020'], ['Quý I', '2021'], ['Quý II', '2021'], ['Quý III', '2021'], ['Quý IV', '2021'], ['Quý I', '2022'], ['Quý II', '2022'], ['Quý III', '2022']]
  const ys = [51.2, 49.4, 51.3, 52.1, 51.0, 51.1, 49.1, 50.7, 51.2, 51.6, 51.9]
  const Tp = 78, B = 64, ph = H - Tp - B
  const X = (i) => L + ((W - L - R) * (i + 0.5)) / xs.length
  const Y = (v) => Tp + ph - ((v - 48.5) / (52.5 - 48.5)) * ph
  let s = tx(W / 2, 24, 'Lực lượng lao động theo quý, 2020 – 2022', { b: true, s: 17 }) + tx(W - R, 48, 'Đơn vị tính: triệu người', { a: 'end' })
  s += `<line x1="${L}" y1="${Y(48.5)}" x2="${W - R}" y2="${Y(48.5)}" stroke="#222" stroke-width="2"/>`
  s += `<polyline points="${ys.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
  ys.forEach((v, i) => {
    s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="#222"/>`
    const lo = (i > 0 && ys[i - 1] > v && (i === ys.length - 1 || ys[i + 1] > v))
    s += tx(X(i) + (i === 2 ? -22 : 0), Y(v) + (lo ? 24 : -11), fmt(v.toFixed(1)))
    s += `<line x1="${X(i).toFixed(1)}" y1="${Y(48.5)}" x2="${X(i).toFixed(1)}" y2="${Y(48.5) + 5}" stroke="#222" stroke-width="2"/>`
    s += tx(X(i), Y(48.5) + 22, xs[i][0], { s: 15 }) + tx(X(i), Y(48.5) + 40, xs[i][1], { s: 15 })
  })
  await luu(RA, 'T1070000001502', W, H, svgW(W, H, s))
}

// ===== 1383: khí thải CO2 (cột) — nhãn năm 2015, 2020 lấy theo thứ tự 2000..2023 =====
{
  const W = 560, H = 400
  const xs = [2000, 2005, 2010, 2015, 2020, 2023], ys = [51210, 92370, 151410, 220650, 343184, 372949]
  const k = khung({ W, H, L: 78, R: 14, Tp: 70, B: 56, ymin: 0, ymax: 400000, step: 100000, yTitle: 'Nghìn tấn CO₂', xTitle: 'Năm' })
  const pw = W - 78 - 14, bw = 52
  let s = tx(W / 2, 24, 'Lượng khí thải CO₂ của Việt Nam', { b: true, s: 18 }) + k.s
  ys.forEach((v, i) => {
    const cx = 78 + (pw * (i + 0.5)) / xs.length
    s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${k.Y(v).toFixed(1)}" width="${bw}" height="${(k.Y(0) - k.Y(v)).toFixed(1)}" fill="#cfcfcf" stroke="#222" stroke-width="2"/>`
    s += tx(cx, k.Y(v) - 7, v) + tx(cx, k.Y(0) + 22, xs[i])
  })
  await luu(RA, 'T1080000001383', W, H, svgW(W, H, s))
}

// ===== 296: trục số, M và N =====
{
  const W = 560, H = 190, x0 = 70, u = 140, y = 110
  const X = (v) => x0 + (v + 1) * u
  let s = `<path d="M 24 ${y} H 538" stroke="#222" stroke-width="2.5"/><path d="M 538 ${y} l -12 -6 M 538 ${y} l -12 6" stroke="#222" stroke-width="2.5"/>`
  for (let k = -3; k <= 6; k++) {
    const v = k / 3, xx = X(v)
    if (xx < 40 || xx > 520) continue
    const big = k % 3 === 0
    s += `<line x1="${xx}" y1="${y - (big ? 10 : 8)}" x2="${xx}" y2="${y + (big ? 10 : 8)}" stroke="#222" stroke-width="2"/>`
    if (big) s += `<circle cx="${xx}" cy="${y}" r="5.5" fill="#222"/>` + tx(xx, y + 36, v, { s: 22 })
  }
  s += `<circle cx="${X(-1 / 3)}" cy="${y}" r="5.5" fill="#222"/>` + tx(X(-1 / 3), y - 28, 'M', { s: 26, it: true })
  s += `<circle cx="${X(2 / 3)}" cy="${y}" r="5.5" fill="#222"/>` + tx(X(2 / 3), y - 28, 'N', { s: 26, it: true })
  await luu(RA, 'T107000000296', W, H, svgW(W, H, s))
}

// ===== 631: khu đất chữ L =====
{
  const W = 560, H = 330
  const xl = 130, xr = 460, yt = 70, yb = 250, xk = 325, yk = 160
  const braceH = (xa, xb, y, up) => { const m = (xa + xb) / 2, d = up ? -9 : 9; return `<path d="M ${xa} ${y} q 0 ${d} 9 ${d} H ${m - 9} q 9 0 9 ${d} q 0 ${-d} 9 ${-d} H ${xb - 9} q 9 0 9 ${-d}" fill="none" stroke="#222" stroke-width="1.8"/>` }
  const braceV = (ya, yb2, x, left) => { const m = (ya + yb2) / 2, d = left ? -9 : 9; return `<path d="M ${x} ${ya} q ${d} 0 ${d} 9 V ${m - 9} q 0 9 ${d} 9 q ${-d} 0 ${-d} 9 V ${yb2 - 9} q 0 9 ${-d} 9" fill="none" stroke="#222" stroke-width="1.8"/>` }
  let s = `<rect x="${xl}" y="${yt}" width="${xr - xl}" height="${yb - yt}" fill="none" stroke="#222" stroke-width="2.5"/>`
  s += `<rect x="${xk}" y="${yt}" width="${xr - xk}" height="${yk - yt}" fill="#e3e3e3" stroke="#222" stroke-width="2.5"/>`
  s += tx((xk + xr) / 2, (yt + yk) / 2 + 6, 'NHÀ KHO', { b: true, s: 16 })
  s += tx(225, 165, 'PHẦN ĐẤT HÌNH CHỮ L', { b: true, s: 16 })
  s += braceH(xk, xr, yt - 10, true) + tx((xk + xr) / 2, yt - 30, '<tspan font-style="italic">x</tspan> (m)', { s: 20 })
  s += braceV(yt, yk, xr + 10, false) + tx(xr + 34, (yt + yk) / 2 + 7, '<tspan font-style="italic">y</tspan> (m)', { a: 'start', s: 20 })
  s += braceV(yt, yb, xl - 10, true) + tx(xl - 36, (yt + yb) / 2 + 7, '<tspan font-style="italic">y</tspan> + 3 (m)', { a: 'end', s: 20 })
  s += braceH(xl, xr, yb + 10, false) + tx((xl + xr) / 2, yb + 42, '2<tspan font-style="italic">x</tspan> + 5 (m)', { s: 20 })
  await luu(RA, 'T108000000631', W, H, svgW(W, H, s))
}

// ===== 1556: quạt tai nạn thương tích =====
{
  const W = 560, H = 330, cx = 300, cy = 180, R = 112
  const PAT = `<defs>
<pattern id="p0" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M-1 1 L1 -1 M0 8 L8 0 M7 9 L9 7" stroke="#444" stroke-width="1.6"/></pattern>
<pattern id="p1" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><circle cx="3.5" cy="3.5" r="1.4" fill="#444"/></pattern>
<pattern id="p2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 0 L8 0 M0 4 L8 4 M4 0 L4 8" stroke="#555" stroke-width="1.2"/></pattern>
<pattern id="p3" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d6d6d6"/><path d="M0 8 L8 0 M-1 1 L1 -1 M7 9 L9 7 M0 0 L8 8" stroke="#666" stroke-width="1.2"/></pattern>
<pattern id="p4" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M4 0 L4 8" stroke="#444" stroke-width="2"/></pattern></defs>`
  const parts = [
    { ten: 'Đuối nước', v: 48 },
    { ten: 'Tai nạn giao thông', v: 28 },
    { ten: 'Ngã', v: 2, man: { x: cx - R - 40, y: cy + 14 } },
    { ten: 'Ngộ độc', v: 2, man: { x: cx - R - 40, y: cy - 36 } },
    { ten: 'Thương tích khác', v: 20 }]
  const pt = (deg, r) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)]
  let s = PAT + tx(W / 2, 26, 'Các nguyên nhân gây tai nạn thương tích ở trẻ em Việt Nam', { b: true, s: 17 })
  let a = 0
  parts.forEach((p, i) => {
    const a0 = a, a1 = a + p.v * 3.6; a = a1
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R)
    s += `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="url(#p${i})" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    const am = (a0 + a1) / 2
    const [ex, ey] = pt(am, R)
    if (p.man) {
      s += `<polyline points="${ex.toFixed(1)},${ey.toFixed(1)} ${(cx - R - 20)},${p.man.y} ${p.man.x + 4},${p.man.y}" fill="none" stroke="#222" stroke-width="1.5"/>`
      s += tx(p.man.x, p.man.y + 5, `${p.ten} ${p.v}%`, { a: 'end', s: 17 })
    } else {
      const [ax, ay] = pt(am, R + 8), [bx, by] = pt(am, R + 26)
      const right = Math.sin(am * Math.PI / 180) >= 0
      s += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#222" stroke-width="1.5"/>`
      s += tx(bx + (right ? 5 : -5), by - 2, p.ten, { a: right ? 'start' : 'end', s: 17 }) + tx(bx + (right ? 5 : -5), by + 17, `${p.v}%`, { a: right ? 'start' : 'end', s: 17 })
    }
  })
  await luu(RA, 'T1070000001556', W, H, svgW(W, H, s))
}

// ===== 2311: xếp hạng FIFA Việt Nam / Thái Lan =====
{
  const W = 560, H = 430
  const xs = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
  const vn = [144, 136, 145, 136, 121, 102, 97, 94, 98, 96], tl = [146, 165, 149, 146, 138, 121, 109, 113, 117, 111]
  const L = 56, R = 14, Tp = 86, B = 62
  const k = khung({ W, H, L, R, Tp, B, ymin: 80, ymax: 180, step: 20, yTitle: 'Hạng', xTitle: 'Năm' })
  const X = (i) => L + ((W - L - R) * (i + 0.5)) / xs.length
  let s = tx(W / 2, 22, 'Xếp hạng FIFA của bóng đá nam Việt Nam và Thái Lan trong 10 năm', { b: true, s: 16 }) + k.s
  s += `<line x1="150" y1="50" x2="186" y2="50" stroke="#222" stroke-width="2.5"/><circle cx="168" cy="50" r="5" fill="#222"/>` + tx(194, 55, 'Việt Nam', { a: 'start' })
  s += `<line x1="320" y1="50" x2="356" y2="50" stroke="#222" stroke-width="2.5" stroke-dasharray="7 4"/><rect x="333" y="45" width="10" height="10" fill="#fff" stroke="#222" stroke-width="2.5"/>` + tx(364, 55, 'Thái Lan', { a: 'start' })
  s += `<polyline points="${vn.map((v, i) => `${X(i).toFixed(1)},${k.Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
  s += `<polyline points="${tl.map((v, i) => `${X(i).toFixed(1)},${k.Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-dasharray="7 4" stroke-linejoin="round"/>`
  xs.forEach((x, i) => {
    s += `<circle cx="${X(i).toFixed(1)}" cy="${k.Y(vn[i]).toFixed(1)}" r="4.5" fill="#222"/>`
    s += `<rect x="${(X(i) - 4.5).toFixed(1)}" y="${(k.Y(tl[i]) - 4.5).toFixed(1)}" width="9" height="9" fill="#fff" stroke="#222" stroke-width="2.5"/>`
    s += tx(X(i) + (i === 0 ? -10 : i === 2 ? 18 : 0), k.Y(tl[i]) - (i === 0 ? 14 : 11), tl[i]) + tx(X(i), k.Y(vn[i]) + 23, vn[i])
    s += tx(X(i), k.Y(80) + 22, x)
  })
  await luu(RA, 'T1080000002311', W, H, svgW(W, H, s))
}

// ===== 1560: nhiệt độ Hà Nội =====
{
  const W = 560, H = 380
  const xs = [7, 10, 13, 16, 19], ys = [26, 30, 32, 32, 28]
  const L = 52, R = 20
  const k = khung({ W, H, L, R, Tp: 76, B: 62, ymin: 0, ymax: 35, step: 5, yTitle: 'Nhiệt độ', xTitle: 'Thời điểm (h)' })
  const X = (i) => L + ((W - L - R) * (i + 0.5)) / xs.length
  let s = tx(W / 2, 24, 'Nhiệt độ ở Hà Nội trong ngày 07/05/2021', { b: true, s: 17 }) + tx(W / 2, 46, 'tại một số thời điểm', { b: true, s: 17 }) + k.s
  s += `<polyline points="${ys.map((v, i) => `${X(i).toFixed(1)},${k.Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
  ys.forEach((v, i) => {
    s += `<circle cx="${X(i).toFixed(1)}" cy="${k.Y(v).toFixed(1)}" r="4.5" fill="#222"/>` + tx(X(i), k.Y(v) - 11, v)
    s += `<line x1="${X(i).toFixed(1)}" y1="${k.Y(0)}" x2="${X(i).toFixed(1)}" y2="${k.Y(0) + 5}" stroke="#222" stroke-width="2"/>` + tx(X(i), k.Y(0) + 23, xs[i])
  })
  await luu(RA, 'T1070000001560', W, H, svgW(W, H, s))
}
