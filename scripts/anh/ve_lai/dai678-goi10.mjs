// Vẽ lại hình — Đại 6–8 gói 10 (7 hình). node scripts/anh/ve_lai/dai678-goi10.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, label, dot } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const MI = '−'
const F = "font-family=\"'Times New Roman',Times,serif\""
const tx = (x, y, t, s = 16, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${F} font-size="${s}" ${extra}>${t}</text>`
const dec = (v) => String(v).replace('.', ',')

function khung({ W, H, l, r, t, b, ymax, step, ytitle, xtitle, title }) {
  const Y = (v) => H - b - (v / ymax) * (H - b - t)
  let s = ''
  for (let v = 0; v <= ymax; v += step) {
    s += `<line x1="${l}" y1="${Y(v)}" x2="${W - r}" y2="${Y(v)}" stroke="#ddd" stroke-width="1"/>` + tx(l - 8, Y(v) + 5, v, 15, 'end')
  }
  s += `<line x1="${l}" y1="${Y(0)}" x2="${W - r}" y2="${Y(0)}" stroke-width="2"/><line x1="${l}" y1="${Y(0)}" x2="${l}" y2="${t - 8}" stroke-width="2"/>`
  s += tx(W / 2, 24, title, 17) + tx(l, t - 14, ytitle, 15, 'start') + tx(W - r, H - 10, xtitle, 16, 'end', 'font-style="italic"')
  return { Y, s }
}
function doan(W, H, l, r, t, b, ymax, step, ytitle, xtitle, title, pts) {
  const k = khung({ W, H, l, r, t, b, ymax, step, ytitle, xtitle, title })
  const n = pts.length, X = (i) => l + 30 + i * ((W - r - l - 60) / (n - 1))
  let s = k.s
  s += `<path d="M ${pts.map(([, v], i) => `${X(i)} ${k.Y(v)}`).join(' L ')}" stroke-width="3" stroke="#222"/>`
  pts.forEach(([nh, v], i) => {
    s += `<circle cx="${X(i)}" cy="${k.Y(v)}" r="5" fill="#222" stroke="none"/>` + tx(X(i), k.Y(v) - 12, dec(v), 16, 'middle', 'font-weight="bold"') + tx(X(i), H - b + 22, nh, 15)
  })
  return svgDoc(W, H, s)
}

const LT = [['1950', 676], ['1970', 1213], ['1980', 1561], ['1990', 1950], ['2000', 2060], ['2003', 2021]]
for (const ma of ['T1070000001288', 'T1070000001613']) {
  await luu(RA, ma, 560, 400, doan(560, 400, 62, 16, 62, 56, 2500, 500, 'Sản lượng (triệu tấn)', 'Năm', 'SẢN LƯỢNG LƯƠNG THỰC THẾ GIỚI 1950 – 2003', LT))
}
await luu(RA, 'T1070000001559', 560, 400, doan(560, 400, 52, 16, 62, 56, 120, 20, 'Số dân (triệu người)', 'Năm', 'Dân số Việt Nam qua 5 lần tổng điều tra', [['1979', 54.7], ['1989', 64.4], ['1999', 76.3], ['2009', 85.8], ['2019', 96.2]]))
await luu(RA, 'T1070000001561', 560, 400, doan(560, 400, 44, 12, 62, 56, 70, 10, 'Số lượng (li)', 'Ngày', 'Số li trà sữa bán được trong tuần', [['Thứ hai', 42], ['Thứ ba', 35], ['Thứ tư', 20], ['Thứ năm', 35], ['Thứ sáu', 48], ['Thứ bảy', 62], ['Chủ nhật', 50]]))

{
  const W = 560, H = 400, l = 56, r = 16, t = 62, b = 56
  const k = khung({ W, H, l, r, t, b, ymax: 250, step: 50, ytitle: 'Doanh thu (tỷ đồng)', xtitle: 'Năm', title: 'Doanh thu bán hàng và dịch vụ công viên nước Đầm Sen' })
  let s = k.s
  const D = [['2018', 216.7], ['2019', 219.5], ['2020', 84.3], ['2021', 25.2]], sl = (W - l - r) / 4
  D.forEach(([n, v], i) => {
    const cx = l + sl * (i + 0.5), bw = 62
    s += `<rect x="${cx - bw / 2}" y="${k.Y(v)}" width="${bw}" height="${k.Y(0) - k.Y(v)}" fill="#bbb" stroke-width="2"/>` + tx(cx, k.Y(v) - 8, dec(v), 16, 'middle', 'font-weight="bold"') + tx(cx, H - b + 22, n, 16)
  })
  await luu(RA, 'T1070000001488', W, H, svgDoc(W, H, s))
}

{
  const W = 560, H = 420, cx = 280, cy = 215, r = 100
  const defs = `<defs>
<pattern id="p1" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2.5"/></pattern>
<pattern id="p2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><circle cx="4" cy="4" r="1.8" fill="#222" stroke="none"/></pattern>
<pattern id="p3" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="4" x2="8" y2="4" stroke="#222" stroke-width="2.5"/></pattern>
<pattern id="p4" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2.5"/></pattern>
</defs>`
  const data = [['Tây Nguyên', 40, 'url(#p1)'], ['ĐNB', 1.2, '#222'], ['Trung du', 32, 'url(#p2)'], ['ĐBSH', 15, 'url(#p3)'], ['BTB', 2.8, '#888'], ['DHNTB', 9, 'url(#p4)']]
  const pt = (a, rr) => [cx + rr * Math.cos(a * Math.PI / 180), cy + rr * Math.sin(a * Math.PI / 180)]
  let a0 = -90, b = tx(W / 2, 26, 'Diện tích rừng bị cháy theo vùng ở Việt Nam năm 2016', 17)
  // [điểm đặt nhãn (dòng đầu), anchor, các dòng]
  const lab = [
    [P(cx + 150, cy - 40), 'start', ['Tây Nguyên', '40%']],
    [P(cx + 80, cy + 125), 'start', ['Đông Nam Bộ', '1,2%']],
    [P(cx - 60, cy + 125), 'end', ['Trung du và', 'miền núi Bắc Bộ', '32%']],
    [P(cx - 140, cy - 40), 'end', ['Đồng bằng', 'sông Hồng', '15%']],
    [P(cx - 125, cy - 135), 'end', ['Bắc Trung Bộ', '2,8%']],
    [P(cx - 20, cy - 160), 'end', ['Duyên hải', 'Nam Trung Bộ', '9%']],
  ]
  data.forEach(([n, p, fl], i) => {
    const a1 = a0 + p * 3.6, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r), la = p > 50 ? 1 : 0
    b += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${la} 1 ${x1} ${y1} Z" fill="${fl}" stroke-width="2"/>`
    const m = (a0 + a1) / 2, [ex, ey] = pt(m, r)
    const [lp, an, ls] = lab[i]
    const ty = ey > cy + 60 ? lp.y - 6 : (ey < cy - 60 ? lp.y + 17 * (ls.length - 1) + 4 : lp.y + 17 * (ls.length - 1) / 2 - 4)
    b += `<line x1="${ex}" y1="${ey}" x2="${lp.x + (an === 'start' ? -6 : 6)}" y2="${ty}" stroke-width="1.2" stroke="#555"/>`
    ls.forEach((tt, j) => { b += tx(lp.x, lp.y + 12 + j * 17, tt, 15, an, j === ls.length - 1 ? 'font-weight="bold"' : '') })
    a0 = a1
  })
  await luu(RA, 'T1070000001619', W, H, svgDoc(W, H, defs + b))
}

{
  const W = 560, H = 130, u = 31, y0 = 56, X = (k) => 40 + (k + 5) * u
  let b = `<line x1="20" y1="${y0}" x2="${W - 14}" y2="${y0}" stroke-width="2.5"/><path d="M ${W - 6} ${y0} L ${W - 22} ${y0 - 7} L ${W - 22} ${y0 + 7} Z" fill="#222"/>`
  for (let k = -5; k <= 10; k++) b += `<line x1="${X(k)}" y1="${y0 - 8}" x2="${X(k)}" y2="${y0 + 8}" stroke-width="2"/>`
  for (const [k, n] of [[-2, 'A'], [3, 'B'], [7, 'C'], [9, 'D']]) b += `${dot(P(X(k), y0))}${label(P(X(k), y0), n, 0, -16)}`
  for (const [k, n] of [[-5, MI + '1'], [0, '0'], [5, '1'], [10, '2']]) b += tx(X(k), y0 + 32, n, 20)
  await luu(RA, 'T107000000257', W, H, svgDoc(W, H, b))
}
console.log('xong')
