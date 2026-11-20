// Vẽ lại hình — gói dai678/goi11. node scripts/anh/ve_lai/dai678-goi11.mjs "<thu_muc_ra>"
import { luu } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const FF = `font-family="'Times New Roman',Times,serif"`
const MI = '−'
const T = (x, y, t, s = 18, a = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${a}" ${FF} font-size="${s}" fill="#111" stroke="none" ${extra}>${t}</text>`
const svg = (W, H, b) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${b}</svg>`
const PAT = `<defs>
<pattern id="p0" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M-1 1 L1 -1 M0 8 L8 0 M7 9 L9 7" stroke="#444" stroke-width="1.6"/></pattern>
<pattern id="p1" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><circle cx="3.5" cy="3.5" r="1.4" fill="#444"/></pattern>
<pattern id="p2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 0 L8 0 M0 4 L8 4 M4 0 L4 8" stroke="#555" stroke-width="1.2"/></pattern>
<pattern id="p3" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d6d6d6"/><path d="M0 8 L8 0 M-1 1 L1 -1 M7 9 L9 7 M0 0 L8 8" stroke="#666" stroke-width="1.2"/></pattern>
</defs>`
function pie(parts, title, { W = 540, H = 380, R = 105 } = {}) {
  const cx = W / 2, cy = 180
  const tot = parts.reduce((s, p) => s + p.v, 0)
  let a = 0, body = PAT + T(W / 2, 30, title, 19, 'middle', 'font-weight="bold"')
  parts.forEach((p, i) => {
    const a0 = a, a1 = a + (p.v / tot) * 360; a = a1
    const pt = (d, r) => [cx + r * Math.sin(d * Math.PI / 180), cy - r * Math.cos(d * Math.PI / 180)]
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R)
    body += `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="url(#p${i % 4})" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    const am = (a0 + a1) / 2
    const [ex, ey] = pt(am, R + 6), [tx, ty] = pt(am, R + 22)
    const right = Math.sin(am * Math.PI / 180) >= 0
    body += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="#222" stroke-width="1.5"/>`
    const lines = [p.ten, ...(p.pct ? [p.pct] : [])]
    const mid = Math.abs(Math.sin(am * Math.PI / 180)) < 0.3, dn = Math.cos(am * Math.PI / 180) < 0
    lines.forEach((t, k) => { body += T((tx + (mid ? 0 : right ? 5 : -5)).toFixed(1), (ty + (mid && dn ? 20 : 5) + k * 20 - (!mid && lines.length > 1 ? 8 : 0)).toFixed(1), t, 17, mid ? 'middle' : right ? 'start' : 'end') })
  })
  return svg(W, H, body)
}
function truc({ W = 560, H = 130, x0, u, k0, k1, sub, nhan, tren }) {
  const y = 70, X = (v) => x0 + v * u
  let b = `<line x1="14" y1="${y}" x2="${W - 14}" y2="${y}" stroke="#222" stroke-width="2.5"/><path d="M ${W - 6} ${y} L ${W - 22} ${y - 7} L ${W - 22} ${y + 7} Z" fill="#222"/>`
  for (let i = Math.round(k0 * sub); i <= Math.round(k1 * sub); i++) {
    const v = i / sub, big = i % sub === 0
    b += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#222" stroke-width="2"/>`
    if (big && nhan[v] !== undefined) b += `<circle cx="${X(v)}" cy="${y}" r="4.5" fill="#222"/>`
  }
  for (const [v, t] of Object.entries(nhan)) b += T(X(+v), y + 34, t, 22)
  for (const q of tren) b += T(X(q.x), y - 20, q.t, 26, 'middle', 'font-style="italic"')
  return svg(W, H, b)
}

// 316 — mỗi đơn vị chia 3; M ở -1/3, N ở 2/3 (theo đề + ảnh)
await luu(RA, 'T107000000316', 560, 130, truc({ x0: 190, u: 140, k0: -1, k1: 2.2, sub: 3,
  nhan: { '-1': MI + '1', 0: '0', 1: '1', 2: '2' },
  tren: [{ x: -1 / 3, t: 'M' }, { x: 2 / 3, t: 'N' }] }))

// 396 — mỗi đơn vị chia 2; D=-2, C=-3/2, O=0, A=1/2, B=3/2
await luu(RA, 'T107000000396', 560, 130, truc({ x0: 280, u: 110, k0: -2, k1: 2, sub: 2,
  nhan: { '-1': MI + '1', 0: '0', 1: '1' },
  tren: [{ x: -2, t: 'D' }, { x: -1.5, t: 'C' }, { x: 0, t: 'O' }, { x: 0.5, t: 'A' }, { x: 1.5, t: 'B' }] }))

function duong({ W, H, tieude, xs, ys, ymax, step, yTitle, xTitle, fmtv, bo = [] }) {
  const L = 76, Rr = 24, Tp = 62, B = 64
  const pw = W - L - Rr, ph = H - Tp - B
  const X = (i) => L + (pw * (i + 0.5)) / xs.length
  const Y = (v) => Tp + ph - (v / ymax) * ph
  let s = T(W / 2, 28, tieude, 19, 'middle', 'font-weight="bold"')
  for (let v = 0; v <= ymax + 1e-9; v += step) {
    s += `<line x1="${L}" y1="${Y(v)}" x2="${W - Rr}" y2="${Y(v)}" stroke="#ddd" stroke-width="1"/>` + T(L - 8, Y(v) + 5, String(+v.toFixed(2)).replace('.', ','), 15, 'end')
  }
  s += `<path d="M ${L} ${Tp - 8} V ${Y(0)} H ${W - Rr}" stroke="#222" stroke-width="2" fill="none"/>`
  s += T(L, Tp - 18, yTitle, 15, 'middle') + T(W - Rr, H - 10, xTitle, 15, 'end')
  s += `<polyline points="${ys.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#222" stroke-width="2.5" stroke-linejoin="round"/>`
  ys.forEach((v, i) => {
    s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="#222"/>`
    if (fmtv && !bo.includes(i)) s += T(X(i).toFixed(1), (Y(v) - 10).toFixed(1), String(v).replace('.', ','), 15)
    s += `<line x1="${X(i).toFixed(1)}" y1="${Y(0)}" x2="${X(i).toFixed(1)}" y2="${Y(0) + 5}" stroke="#222" stroke-width="2"/>` + T(X(i).toFixed(1), Y(0) + 22, xs[i], 15)
  })
  return svg(W, H, s)
}
// 358 — không ghi nhãn số trên điểm (câu 2 hỏi đọc giá trị); số liệu nằm trong đề
await luu(RA, 'T107000000358', 560, 380, duong({ W: 560, H: 380, tieude: 'Số bàn thắng Messi ghi được cho câu lạc bộ Barcelona',
  xs: ['2016-2017', '2017-2018', '2018-2019', '2019-2020', '2020-2021'], ys: [54, 45, 51, 31, 38], ymax: 60, step: 5,
  yTitle: 'Số bàn thắng ghi được', xTitle: 'Mùa giải', fmtv: false }))
// 364 — bỏ nhãn ngày 5 (đề hỏi đúng giá trị đó)
await luu(RA, 'T107000000364', 540, 380, duong({ W: 540, H: 380, tieude: 'Chiều cao của cây đậu',
  xs: [1, 2, 3, 4, 5], ys: [0.5, 0.75, 1, 1.4, 2.5], ymax: 3, step: 0.5, yTitle: 'Chiều cao (cm)', xTitle: 'Ngày', fmtv: true, bo: [4] }))

// 391 — bỏ % của Tốt (đề hỏi)
await luu(RA, 'T107000000391', 540, 380, pie([
  { ten: 'Tốt', v: 10, pct: null }, { ten: 'Khá', v: 45, pct: '45%' }, { ten: 'Đạt', v: 25, pct: '25%' }, { ten: 'Chưa đạt', v: 20, pct: '20%' }],
  'Tỉ lệ phần trăm xếp loại học lực của học sinh khối 7'))
// 406
await luu(RA, 'T107000000406', 540, 380, pie([
  { ten: 'Bóng đá', v: 40, pct: '40%' }, { ten: 'Bóng chuyền', v: 20, pct: '20%' }, { ten: 'Cầu lông', v: 15, pct: '15%' }, { ten: 'Bơi lội', v: 25, pct: '25%' }],
  'Tỉ lệ các môn thể thao yêu thích của học sinh lớp 7'))
console.log('xong')
