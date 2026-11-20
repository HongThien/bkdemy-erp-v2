// Vẽ lại hình — Đại 6–8 gói 8 (7 hình). node scripts/anh/ve_lai/dai678-goi8.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, dot } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const MI = '−'
const F = "font-family=\"'Times New Roman',Times,serif\""
const tx = (x, y, t, s = 18, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${F} font-size="${s}" ${extra}>${t}</text>`
const ln = (x1, y1, x2, y2, w = 2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${w}" ${extra}/>`

// bảng: cols = [{w, al}], rows = mảng mảng chuỗi (hàng 0 = tiêu đề)
function bang(x0, y0, cols, rows, rh = 44, s = 18) {
  let b = ''
  const tw = cols.reduce((a, c) => a + c.w, 0)
  rows.forEach((r, i) => {
    let x = x0
    cols.forEach((c, j) => {
      const cx = c.al === 'l' ? x + 10 : x + c.w / 2
      b += tx(cx, y0 + i * rh + rh / 2 + s * 0.35, r[j], s, c.al === 'l' ? 'start' : 'middle', i === 0 ? 'font-weight="bold"' : '')
      x += c.w
    })
  })
  for (let i = 0; i <= rows.length; i++) b += ln(x0, y0 + i * rh, x0 + tw, y0 + i * rh, i === 0 || i === rows.length || i === 1 ? 2.2 : 1.5)
  let x = x0
  for (let j = 0; j <= cols.length; j++) { b += ln(x, y0, x, y0 + rows.length * rh, 1.8); if (j < cols.length) x += cols[j].w }
  return b
}

// 1. T106000000626 — bảng nhiệt độ nóng chảy
{
  const W = 560, H = 150
  const cols = [{ w: 128 }, { w: 100 }, { w: 100 }, { w: 130 }, { w: 98 }]
  const rows = [['Hành tinh', 'Sao Thổ', 'Sao Mộc', 'Sao Hải Vương', 'Sao Hỏa'], ['Nhiệt độ (°C)', MI + '140°C', MI + '120°C', MI + '200°C', MI + '80°C']]
  await luu(RA, 'T106000000626', W, H, svgDoc(W, H, bang(2, 28, cols, rows, 48, 16)))
}

// 2. T107000000073 — trục số, vạch cách 1/3; A cách −1 một khoảng về bên trái
{
  const W = 560, H = 140, u = 33, y0 = 56, X = (k) => 34 + (k + 7) * u
  let b = ln(14, y0, W - 12, y0, 2.5) + `<path d="M ${W - 4} ${y0} L ${W - 20} ${y0 - 7} L ${W - 20} ${y0 + 7} Z" fill="#222"/>`
  for (let k = -7; k <= 8; k++) b += ln(X(k), y0 - 7, X(k), y0 + 7, 2)
  b += dot(P(X(-4), y0)) + tx(X(-4), y0 - 16, 'A', 22, 'middle', 'font-style="italic"')
  b += tx(X(-3), y0 + 32, MI + '1', 20) + tx(X(0), y0 + 32, '0', 20) + tx(X(6), y0 + 32, '2', 20)
  await luu(RA, 'T107000000073', W, H, svgDoc(W, H, b))
}

// 3. T107000000079 — bảng giá rau
{
  const W = 560, H = 270
  const cols = [{ w: 58 }, { w: 168, al: 'l' }, { w: 136 }, { w: 190 }]
  const rows = [['STT', 'Loại hàng', 'Số lượng (kg)', 'Giá đơn vị (đồng/kg)'], ['1', 'Bắp cải', '1', '8 000'], ['2', 'Giá đỗ', '1,5', '25 000'], ['3', 'Rau ngót', '0,5', '12 000'], ['4', 'Rau muống', '2,5', '9 000']]
  await luu(RA, 'T107000000079', W, H, svgDoc(W, H, tx(W / 2, 30, 'Bảng giá rau của nhà hàng VIET TASTE', 18) + bang(2, 48, cols, rows, 44, 16)))
}

// biểu đồ đoạn thẳng
function duong({ ten, ymin, ymax, buoc, vals, W = 560, H = 420, nhan, tieuY }) {
  const L = 58, R = W - 20, T = 70, B = H - 62
  const Y = (v) => B - (v - ymin) / (ymax - ymin) * (B - T), X = (i) => L + 22 + i * ((R - L - 44) / 11)
  let b = tx(W / 2, 28, ten, 17, 'middle', 'font-weight="bold"') + (tieuY ? tx(L - 8, T - 18, tieuY, 16, 'end') : '')
  for (let v = ymin; v <= ymax + 1e-9; v += buoc) b += ln(L, Y(v), R, Y(v), 1, 'stroke="#bbb"') + tx(L - 8, Y(v) + 5, String(v), 16, 'end')
  b += ln(L, T, L, B, 2) + ln(L, B, R, B, 2)
  b += `<path d="M ${vals.map((v, i) => `${X(i)} ${Y(v)}`).join(' L ')}" stroke-width="2.5"/>`
  vals.forEach((v, i) => {
    b += `<circle cx="${X(i)}" cy="${Y(v)}" r="5" fill="#222" stroke="none"/>` + tx(X(i), B + 22, String(i + 1), 16)
    if (nhan) b += tx(X(i), Y(v) - 12, String(v).replace('.', ','), 15)
  })
  b += tx((L + R) / 2, H - 14, 'Tháng', 17)
  return svgDoc(W, H, b)
}

// 4. T1070000001042 — nhiệt độ Hà Nội 2021 (giá trị đọc từ hình cũ, ảnh gốc không ghi số)
await luu(RA, 'T1070000001042', 560, 420, duong({ ten: 'Nhiệt độ trung bình các tháng trong năm 2021 tại Hà Nội', ymin: 0, ymax: 35, buoc: 5, vals: [16.5, 17, 20, 23.5, 27, 24.5, 28.5, 27.5, 26.5, 24, 20.5, 17.5], tieuY: '(°C)' }))

// 7. T1070000001085 — TPHCM 2020 có ghi số
await luu(RA, 'T1070000001085', 560, 420, duong({ ten: 'Nhiệt độ trung bình các tháng năm 2020 tại TPHCM (°C)', ymin: 22, ymax: 32, buoc: 2, vals: [26.6, 27.6, 29, 30.5, 29.5, 28.5, 28, 28, 27.6, 27.6, 27, 26], nhan: true, tieuY: '(°C)' }))

// biểu đồ quạt (bắt đầu 12 giờ, chiều kim đồng hồ); p = null => in "?%" nhưng góc theo goc
function quat({ tieu, data, W = 560, H = 420, cx = 280, cy = 220, r = 125 }) {
  const defs = `<defs><pattern id="h1" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#fff"/><line x1="0" y1="0" x2="0" y2="9" stroke="#222" stroke-width="2.5"/></pattern><pattern id="h2" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#fff"/><circle cx="4.5" cy="4.5" r="2" fill="#222" stroke="none"/></pattern><pattern id="h3" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff"/><line x1="0" y1="5" x2="10" y2="5" stroke="#222" stroke-width="2.5"/></pattern></defs>`
  const fills = ['url(#h1)', '#cfd3d9', 'url(#h2)', 'url(#h3)']
  const pt = (a, rr) => [cx + rr * Math.cos(a * Math.PI / 180), cy + rr * Math.sin(a * Math.PI / 180)]
  let a0 = -90, b = tx(W / 2, 30, tieu, 17, 'middle', 'font-weight="bold"')
  data.forEach(([n, goc, hien], i) => {
    const a1 = a0 + goc * 3.6, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r)
    b += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${goc > 50 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${fills[i]}" stroke-width="2.5"/>`
    const m = (a0 + a1) / 2, [lx, ly] = pt(m, r + 14), right = lx > cx
    const up = ly < cy - 20, dn = ly > cy + 20
    b += tx(lx, ly + (up ? -26 : dn ? 18 : -8), n, 18, right ? 'start' : 'end')
    b += tx(lx, ly + (up ? -6 : dn ? 38 : 12), hien, 18, right ? 'start' : 'end')
    a0 = a1
  })
  return svgDoc(W, H, defs + b)
}
// 5. T1070000001082 — Quýt 35, Bưởi 20, Táo 17, Cam ? (phần còn lại, không in số của Cam)
await luu(RA, 'T1070000001082', 560, 420, quat({ tieu: 'Tỉ lệ phần trăm loại quả bán ra trong ngày', data: [['Quýt', 35, '35%'], ['Bưởi', 20, '20%'], ['Táo', 17, '17%'], ['Cam', 28, '?%']] }))
// 6. T1070000001084 — lớp 7E
await luu(RA, 'T1070000001084', 560, 420, quat({ tieu: 'Tỉ lệ phần trăm loại trái cây ưa thích của lớp 7E', data: [['Táo', 35, '35%'], ['Xoài', 15, '15%'], ['Dưa hấu', 25, '25%'], ['Chuối', 25, '25%']] }))
console.log('xong')
