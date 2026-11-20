// Vẽ lại hình — Đại 6–8 gói 12. node scripts/anh/ve_lai/dai678-goi12.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, label, num, dot } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const MI = '−'
const FF = `font-family="'Times New Roman',Times,serif"`
const tx = (x, y, t, s = 17, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${FF} font-size="${s}" ${extra}>${t}</text>`
const PAT = `<defs>
<pattern id="p0" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M-1 1 L1 -1 M0 8 L8 0 M7 9 L9 7" stroke="#444" stroke-width="1.6"/></pattern>
<pattern id="p1" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><circle cx="4" cy="4" r="1.5" fill="#333"/></pattern>
<pattern id="p2" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><path d="M2 5 H8 M5 2 V8" stroke="#333" stroke-width="1.6"/></pattern>
<pattern id="p3" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d6d6d6"/><path d="M0 8 L8 0 M-1 1 L1 -1 M7 9 L9 7 M0 0 L8 8" stroke="#666" stroke-width="1.2"/></pattern>
</defs>`

// parts: [{ten, v, pat}] theo chiều kim đồng hồ từ đỉnh
function pie(parts, { W = 540, H = 380, R = 112, title = '' } = {}) {
  const cx = W / 2, cy = H / 2 + (title ? 18 : 6)
  let a = 0, body = PAT + (title ? tx(W / 2, 28, title, 19, 'middle', 'font-weight="bold"') : '')
  const pt = (deg, r) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)]
  parts.forEach((p) => {
    const a0 = a, a1 = a + p.v * 3.6; a = a1
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R)
    body += `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="url(#p${p.pat})" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    const am = (a0 + a1) / 2
    const [ex, ey] = pt(am, R + 6), [tx2, ty2] = pt(am, R + 22)
    const right = Math.sin(am * Math.PI / 180) >= 0
    body += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${tx2.toFixed(1)}" y2="${ty2.toFixed(1)}" stroke="#222" stroke-width="1.5"/>`
    const X = tx2 + (right ? 4 : -4), an = right ? 'start' : 'end'
    body += tx(X.toFixed(1), (ty2 - 2).toFixed(1), p.ten, 17, an) + tx(X.toFixed(1), (ty2 + 17).toFixed(1), p.v + '%', 17, an, 'font-weight="bold"')
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${body}</svg>`
}

// 437, 438 — quạt thể thao (đề cho đủ 4 tỉ lệ)
const tt = [{ ten: 'Bóng chuyền', v: 20, pat: 3 }, { ten: 'Bóng đá', v: 40, pat: 4 }, { ten: 'Cầu lông', v: 15, pat: 0 }, { ten: 'Bóng rổ', v: 25, pat: 1 }]
tt[1].pat = 2
const ttSvg = pie(tt, { title: 'Môn thể thao yêu thích của 180 học sinh khối 7' })
await luu(RA, 'T107000000437', 540, 380, ttSvg)
await luu(RA, 'T107000000438', 540, 380, ttSvg)

// 472 — thể loại phim
await luu(RA, 'T107000000472', 540, 380, pie([
  { ten: 'Phim hoạt hình', v: 25, pat: 3 }, { ten: 'Phim hình sự', v: 14, pat: 1 },
  { ten: 'Phim phiêu lưu mạo hiểm', v: 36, pat: 2 }, { ten: 'Phim hài', v: 25, pat: 0 }],
  { title: 'Thể loại phim yêu thích của học sinh khối 7', R: 100 }))

// 477 — đoạn thẳng điểm KHTN
{
  const W = 540, H = 380, L = 70, Rr = 30, Tp = 70, B = 70
  const pw = W - L - Rr, ph = H - Tp - B
  const xs = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'], ys = [7, 5, 5, 7, 8]
  const X = (i) => L + pw * (i + 0.5) / 5, Y = (v) => Tp + ph - v / 9 * ph
  let s = tx(W / 2, 28, 'Điểm bài ôn luyện môn Khoa học tự nhiên của bạn Khanh', 17, 'middle', 'font-weight="bold"')
  s += tx(L, Tp - 22, '(Điểm)', 16)
  for (let v = 0; v <= 9; v++) { s += `<line x1="${L}" y1="${Y(v)}" x2="${W - Rr}" y2="${Y(v)}" stroke="#ddd" stroke-width="1"/>` + tx(L - 10, Y(v) + 5, v, 16, 'end') }
  s += `<path d="M ${L} ${Tp - 10} V ${Y(0)} H ${W - Rr}" stroke="#222" stroke-width="2" fill="none"/>`
  s += `<polyline points="${ys.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
  ys.forEach((v, i) => { s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="#222" stroke="none"/>` + tx(X(i).toFixed(1), (Y(v) - 11).toFixed(1), v, 16) + tx(X(i).toFixed(1), Y(0) + 24, xs[i], 16) })
  await luu(RA, 'T107000000477', W, H, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${s}</svg>`)
}

// 638 — trục số, mỗi vạch = 1/5
{
  const W = 560, H = 130, u = 40, y0 = 60
  const X = (k) => 20 + (k + 5) * u   // k = số vạch tính từ O, từ -5 (=-1) đến 6
  let b = `<line x1="10" y1="${y0}" x2="${W - 14}" y2="${y0}" stroke-width="2.5"/><path d="M ${W - 6} ${y0} L ${W - 22} ${y0 - 7} L ${W - 22} ${y0 + 7} Z" fill="#222"/>`
  for (let k = -5; k <= 6; k++) b += `<line x1="${X(k)}" y1="${y0 - 7}" x2="${X(k)}" y2="${y0 + 7}" stroke-width="2"/>`
  b += num(P(X(-5), y0 - 18), MI + '1', 0, 0, 22) + num(P(X(5), y0 - 18), '1', 0, 0, 22) + label(P(X(0), y0), 'O', 0, -18)
  for (const [k, n] of [[-3, 'C'], [-2, 'D'], [2, 'A'], [6, 'B']]) b += `${dot(P(X(k), y0))}${label(P(X(k), y0), n, 0, 34)}`
  await luu(RA, 'T107000000638', W, H, svgDoc(W, H, b))
}

// 1918 — Oxy, M(1; −2)
{
  const W = 400, H = 340, ox = 150, oy = 110, u = 70
  let b = `<line x1="14" y1="${oy}" x2="${W - 14}" y2="${oy}" stroke-width="2"/><path d="M ${W - 6} ${oy} l -14 -6 v12 z" fill="#222"/>`
  b += `<line x1="${ox}" y1="${H - 30}" x2="${ox}" y2="16" stroke-width="2"/><path d="M ${ox} 8 l -6 14 h12 z" fill="#222"/>`
  b += `<line x1="${ox + u}" y1="${oy - 6}" x2="${ox + u}" y2="${oy + 6}" stroke-width="2"/>` + num(P(ox + u, oy - 14), '1', 0, 0, 22)
  b += `<line x1="${ox - 6}" y1="${oy - u}" x2="${ox + 6}" y2="${oy - u}" stroke-width="2"/>` + num(P(ox - 20, oy - u + 7), '1', 0, 0, 22)
  b += `<line x1="${ox - 6}" y1="${oy + 2 * u}" x2="${ox + 6}" y2="${oy + 2 * u}" stroke-width="2"/>` + num(P(ox - 24, oy + 2 * u + 7), MI + '2', 0, 0, 22)
  b += `<g stroke-dasharray="6 5" stroke-width="1.5"><line x1="${ox + u}" y1="${oy}" x2="${ox + u}" y2="${oy + 2 * u}"/><line x1="${ox}" y1="${oy + 2 * u}" x2="${ox + u}" y2="${oy + 2 * u}"/></g>`
  b += label(P(ox, oy), 'O', -16, 24) + label(P(W - 20, oy), 'x', 0, 28) + label(P(ox, 14), 'y', -16, 14)
  b += dot(P(ox + u, oy + 2 * u)) + label(P(ox + u, oy + 2 * u), 'M', 18, 26)
  b += num(P(ox + 2 * u, H - 8), 'Hình 1', 0, 0, 20)
  await luu(RA, 'T1080000001918', W, H, svgDoc(W, H, b))
}

// 2049 — hai biểu đồ xếp dọc
{
  const W = 540, H = 420, ph0 = 205
  const xs = [2017, 2018, 2019, 2020, 2021], ys = [30, 33, 34, 35, 38]
  function panel(oy, ymin, ymax, step, tag) {
    const L = 64, Rr = 24, Tp = oy + 56, Bt = oy + 150, pw = W - L - Rr
    const X = (i) => L + pw * (i + 0.5) / 5, Y = (v) => Bt - (v - ymin) / (ymax - ymin) * (Bt - Tp)
    let s = tx(W / 2, oy + 20, 'Doanh thu của nhà máy', 17, 'middle', 'font-weight="bold"') + tx(L - 4, oy + 42, 'Doanh thu (tỉ đồng)', 15, 'start')
    for (let v = ymin; v <= ymax; v += step) s += `<line x1="${L}" y1="${Y(v)}" x2="${W - Rr}" y2="${Y(v)}" stroke="#ddd"/>` + tx(L - 8, Y(v) + 5, v, 15, 'end')
    s += `<path d="M ${L} ${Tp - 8} V ${Bt} H ${W - Rr}" stroke="#222" stroke-width="2" fill="none"/>`
    s += `<polyline points="${ys.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
    ys.forEach((v, i) => { s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="#222" stroke="none"/>` + tx((X(i) + (i === 0 ? 14 : 0)).toFixed(1), (Y(v) + (i === 0 ? -8 : -10)).toFixed(1), v, 15) + tx(X(i).toFixed(1), Bt + 20, xs[i], 15) })
    s += tx(L, Bt + 42, tag, 17, 'start', 'font-style="italic"') + tx(W / 2, Bt + 42, 'Năm', 15)
    return s
  }
  const s = panel(0, 30, 38, 2, 'a)') + `<line x1="20" y1="${ph0 - 2}" x2="${W - 20}" y2="${ph0 - 2}" stroke="#bbb" stroke-dasharray="4 4"/>` + panel(ph0, 0, 40, 10, 'b)')
  await luu(RA, 'T1080000002049', W, H, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${s}</svg>`)
}
console.log('xong')
