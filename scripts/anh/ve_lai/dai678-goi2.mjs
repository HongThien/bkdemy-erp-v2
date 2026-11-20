// Vẽ lại hình — gói dai678/goi2 (biểu đồ quạt / đoạn thẳng, Thống kê 7)
//   node scripts/anh/ve_lai/dai678-goi2.mjs <thu_muc_ra>
import { luu } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const FF = `font-family="'Times New Roman',Times,serif"`
const PAT = `<defs>
<pattern id="p0" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M-1 1 L1 -1 M0 8 L8 0 M7 9 L9 7" stroke="#444" stroke-width="1.6"/></pattern>
<pattern id="p1" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><circle cx="3.5" cy="3.5" r="1.4" fill="#444"/></pattern>
<pattern id="p2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 0 L8 0 M0 4 L8 4 M4 0 L4 8" stroke="#555" stroke-width="1.2"/></pattern>
<pattern id="p3" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d6d6d6"/><path d="M0 8 L8 0 M-1 1 L1 -1 M7 9 L9 7 M0 0 L8 8" stroke="#666" stroke-width="1.2"/></pattern>
</defs>`
const fmt = (v) => String(v).replace('.', ',')

// pie: parts = [{ten, v (phần trăm thật), pct (chuỗi nhãn % hoặc null)}]
function pie(parts, { W = 520, H = 330, R = 110, start = 0 } = {}) {
  const cx = W / 2, cy = H / 2 + 6
  const tot = parts.reduce((s, p) => s + p.v, 0)
  let a = start, body = PAT
  parts.forEach((p, i) => {
    const a0 = a, a1 = a + (p.v / tot) * 360; a = a1
    const pt = (deg, r) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)]
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R)
    body += `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="url(#p${i % 4})" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    const am = (a0 + a1) / 2
    const [ex, ey] = pt(am, R + 8), [tx, ty] = pt(am, R + 24)
    const right = Math.sin(am * Math.PI / 180) >= 0
    body += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="#222" stroke-width="1.5"/>`
    const lines = [p.ten, ...(p.pct ? [p.pct] : [])]
    lines.forEach((t, k) => {
      body += `<text x="${(tx + (right ? 4 : -4)).toFixed(1)}" y="${(ty + 5 + (k - (lines.length - 1) / 2 * 0) * 19 + (k === 0 && lines.length > 1 ? -2 : 0)).toFixed(1)}" text-anchor="${right ? 'start' : 'end'}" ${FF} font-size="17" fill="#111" stroke="none">${t}</text>`
    })
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${body}</svg>`
}

// đường: nhãn trục ngang (đều nhau), giá trị, trục dọc 0..ymax bước step
function duong({ W = 540, H = 340, tieude, xs, ys, ymax, step, yTitle, xTitle, fmtv = fmt }) {
  const L = 62, Rr = 24, Tp = 56, B = 62
  const pw = W - L - Rr, ph = H - Tp - B
  const X = (i) => L + (xs.length === 1 ? pw / 2 : (pw * (i + 0.5)) / xs.length)
  const Y = (v) => Tp + ph - (v / ymax) * ph
  let s = `<text x="${W / 2}" y="26" text-anchor="middle" ${FF} font-size="19" font-weight="bold" fill="#111" stroke="none">${tieude}</text>`
  for (let v = 0; v <= ymax; v += step) {
    s += `<line x1="${L}" y1="${Y(v)}" x2="${W - Rr}" y2="${Y(v)}" stroke="#ddd" stroke-width="1"/>`
    s += `<text x="${L - 8}" y="${Y(v) + 5}" text-anchor="end" ${FF} font-size="15" fill="#111" stroke="none">${v}</text>`
  }
  s += `<path d="M ${L} ${Tp - 6} V ${Y(0)} H ${W - Rr}" stroke="#222" stroke-width="2" fill="none"/>`
  s += `<text x="${L}" y="${Tp - 14}" text-anchor="middle" ${FF} font-size="15" fill="#111" stroke="none">${yTitle}</text>`
  s += `<text x="${W - Rr}" y="${H - 8}" text-anchor="end" ${FF} font-size="15" fill="#111" stroke="none">${xTitle}</text>`
  s += `<polyline points="${ys.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
  ys.forEach((v, i) => {
    s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="#222" stroke="none"/>`
    s += `<text x="${X(i).toFixed(1)}" y="${(Y(v) - 10).toFixed(1)}" text-anchor="middle" ${FF} font-size="15" fill="#111" stroke="none">${fmtv(v)}</text>`
    s += `<line x1="${X(i).toFixed(1)}" y1="${Y(0)}" x2="${X(i).toFixed(1)}" y2="${Y(0) + 5}" stroke="#222" stroke-width="2"/>`
    s += `<text x="${X(i).toFixed(1)}" y="${Y(0) + 22}" text-anchor="middle" ${FF} font-size="15" fill="#111" stroke="none">${xs[i]}</text>`
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${s}</svg>`
}

// 1031 — 4 phường, chưa ghi %; chia theo số tạ thật
await luu(RA, 'T1070000001031', 540, 330, pie([
  { ten: 'Đại Kim', v: 132, pct: '?' }, { ten: 'Định Công', v: 154, pct: '?' },
  { ten: 'Đền Lừ', v: 161, pct: '?' }, { ten: 'Hoàng Liệt', v: 170, pct: '?' }], { W: 540 }))

// 1043 — đường; trục ngang theo từng năm có số liệu (cách đều như ảnh cũ)
await luu(RA, 'T1070000001043', 560, 340, duong({ W: 560, tieude: 'Sản lượng khai thác dầu ở Việt Nam',
  xs: [1986, 1991, 1993, 1995, 1997, 2000, 2002], ys: [2.7, 4, 6, 8, 10, 17, 19.36], ymax: 25, step: 5, yTitle: 'Triệu tấn', xTitle: 'Năm' }))

// 1044 — Cờ vua không ghi %, phần còn lại 30%
await luu(RA, 'T1070000001044', 540, 330, pie([
  { ten: 'Bóng đá', v: 35, pct: '35%' }, { ten: 'Cầu lông', v: 15, pct: '15%' },
  { ten: 'Đá cầu', v: 20, pct: '20%' }, { ten: 'Cờ vua', v: 30, pct: null }], { W: 540 }))

// 1129 — nhiệt độ Hà Nội
await luu(RA, 'T1070000001129', 560, 340, duong({ W: 560, tieude: 'Nhiệt độ trung bình tháng ở Hà Nội',
  xs: [1,2,3,4,5,6,7,8,9,10,11,12], ys: [17,17,20,24,27,28,29,28,27,25,21,18], ymax: 30, step: 5, yTitle: 'Nhiệt độ (°C)', xTitle: 'Tháng' }))

// 1391 — Cam ?% (phần còn lại 28%)
await luu(RA, 'T1070000001391', 540, 330, pie([
  { ten: 'Quýt', v: 35, pct: '35%' }, { ten: 'Bưởi', v: 20, pct: '20%' },
  { ten: 'Táo', v: 17, pct: '17%' }, { ten: 'Cam', v: 28, pct: '?%' }], { W: 540 }))

// 1392 — 4 đội, ghi tên ngay cạnh phần
await luu(RA, 'T1070000001392', 540, 330, pie([
  { ten: 'Hươu Vàng', v: 24, pct: '24%' }, { ten: 'Sóc Nâu', v: 46, pct: '46%' },
  { ten: 'Gấu Đen', v: 14, pct: '14%' }, { ten: 'Thỏ Trắng', v: 16, pct: '16%' }], { W: 540 }))
