// Vẽ lại hình — Đại 6–8 gói 9 (7 hình). node scripts/anh/ve_lai/dai678-goi9.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, label, num, dot } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const MI = '−'
const F = "font-family=\"'Times New Roman',Times,serif\""
const tx = (x, y, t, s = 16, anchor = 'middle', bold = false) => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${F} font-size="${s}"${bold ? ' font-weight="bold"' : ''}>${t}</text>`

const DEFS = `<defs>
<pattern id="h1" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2.5"/></pattern>
<pattern id="h2" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#fff"/><circle cx="4.5" cy="4.5" r="1.6" fill="#222" stroke="none"/></pattern>
<pattern id="h3" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#fff"/><path d="M0 4.5H9M4.5 0V9" stroke="#222" stroke-width="1.3"/></pattern>
<pattern id="h4" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2.5"/></pattern>
<pattern id="h5" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#d3d6dc"/><path d="M0 4.5H9" stroke="#222" stroke-width="1.5"/></pattern>
</defs>`
const FILLS = ['url(#h1)', 'url(#h2)', 'url(#h3)', 'url(#h4)', 'url(#h5)']

// data: [[dòng tên[], nhãn %|null, patternIdx]] theo chiều kim đồng hồ từ 12 giờ; pct dùng để tính góc
function pie(ten, data, { title, r = 105, W = 560, H = 370, cy = 200 } = {}) {
  const cx = W / 2
  let b = ''
  if (title) b += tx(cx, 36, title, 19, 'middle', true)
  const pt = (a, rr) => [cx + rr * Math.cos(a * Math.PI / 180), cy + rr * Math.sin(a * Math.PI / 180)]
  let a0 = -90
  data.forEach(([lines, pctLabel, pat, p]) => {
    const a1 = a0 + p * 3.6, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r)
    b += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${p > 50 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${FILLS[pat]}" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
    const m = (a0 + a1) / 2, [lx, ly] = pt(m, r + 14), right = lx >= cx
    const L = [...lines, ...(pctLabel ? [pctLabel] : [])]
    const lh = 19, top = ly + 5 - (L.length - 1) * lh * (Math.sin(m * Math.PI / 180) > 0.3 ? 0 : Math.sin(m * Math.PI / 180) < -0.3 ? 1 : 0.5)
    L.forEach((t, i) => { b += tx(lx + (right ? 4 : -4), top + i * lh, t, 17, right ? 'start' : 'end', i === L.length - 1 && pctLabel === t) })
    a0 = a1
  })
  return luu(RA, ten, W, H, svgDoc(W, H, DEFS + b))
}

// 1. T1070000001086 — biểu đồ đoạn thẳng
{
  const W = 560, H = 420, L = 56, R = 540, yb = 340, yt = 70
  const vals = [['Chủ nhật', 50], ['Thứ Hai', 42], ['Thứ Ba', 35], ['Thứ Tư', 20], ['Thứ Năm', 35], ['Thứ Sáu', 48], ['Thứ Bảy', 62]]
  const Y = (v) => yb - (v / 70) * (yb - yt)
  const X = (i) => L + 38 + i * ((R - L - 60) / 6)
  let b = tx(W / 2, 28, 'Số li trà sữa bán được trong tuần của tiệm Trân Châu', 17, 'middle', true)
  for (let v = 0; v <= 70; v += 10) b += `<line x1="${L}" y1="${Y(v)}" x2="${R}" y2="${Y(v)}" stroke="#ccc" stroke-width="1"/>` + tx(L - 8, Y(v) + 5, v, 16, 'end')
  b += `<line x1="${L}" y1="${yt - 6}" x2="${L}" y2="${yb}" stroke-width="2"/><line x1="${L}" y1="${yb}" x2="${R}" y2="${yb}" stroke-width="2"/>`
  b += `<polyline fill="none" stroke-width="3" points="${vals.map(([, v], i) => `${X(i)},${Y(v)}`).join(' ')}"/>`
  vals.forEach(([n, v], i) => {
    b += `<line x1="${X(i)}" y1="${Y(v)}" x2="${X(i)}" y2="${yb}" stroke-width="1.3" stroke-dasharray="5 4"/>` + dot(P(X(i), Y(v)))
    b += tx(X(i), Y(v) - 12, v, 17, 'middle', true)
    b += tx(X(i), yb + 22, n, 15)
  })
  b += tx(W / 2, H - 12, '(Số li trà sữa theo từng ngày trong tuần)', 15)
  await luu(RA, 'T1070000001086', W, H, svgDoc(W, H, b))
}

// 2. T1070000001157
await pie('T1070000001157', [[['Bơi thành thạo'], '45%', 1, 45], [['Biết bơi nhưng', 'chưa thành thạo'], '35%', 0, 35], [['Chưa biết bơi'], '20%', 2, 20]], { title: 'Kết quả phổ cập bơi sau một năm triển khai' })
// 3. T1070000001286 (thứ tự theo ảnh cũ: Bơ tỏi 12, Donut 25, Gato 44, Kem chuối 12, Lưỡi mèo 7)
await pie('T1070000001286', [[['Bánh mì Bơ tỏi'], '12%', 3, 12], [['Bánh Donut'], '25%', 2, 25], [['Bánh Gato'], '44%', 4, 44], [['Bánh Kem chuối'], '12%', 0, 12], [['Bánh Lưỡi mèo'], '7%', 1, 7]], { title: 'Lượng bánh bán ra trong một ngày' })
// 4. T1070000001331 (TB không ghi %: đề hỏi)
await pie('T1070000001331', [[['Điểm giỏi'], '35%', 0, 35], [['Điểm khá'], '45%', 2, 45], [['Điểm trung bình'], null, 1, 20]])
// 5. T1070000001539
await pie('T1070000001539', [[['Nước chanh'], '13%', 1, 13], [['Nước cam'], '13%', 3, 13], [['Nước suối'], '34%', 2, 34], [['Trà sữa'], '40%', 0, 40]], { title: 'Tỉ lệ phần trăm loại thức uống yêu thích của học sinh khối 7' })
// 6. T1070000001540
await pie('T1070000001540', [[['Đồ dùng học tập'], '50%', 1, 50], [['Quần áo'], '20%', 0, 20], [['Đồ chơi'], '30%', 2, 30]], { title: 'Quà tặng của lớp 7A' })
// 7. T1070000001541
await pie('T1070000001541', [[['Điểm trung bình'], null, 1, 20], [['Điểm giỏi'], '35%', 0, 35], [['Điểm khá'], '45%', 2, 45]])
console.log('xong')
