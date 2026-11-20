// Vẽ lại hình — Đại 6–8 gói 7 (7 hình). node scripts/anh/ve_lai/dai678-goi7.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, num, label, dot } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const MI = '−'
const F = "font-family=\"'Times New Roman',Times,serif\""
const tx = (x, y, t, s = 18, anchor = 'middle', w = 'normal') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${F} font-size="${s}" font-weight="${w}">${t}</text>`
const C = (v) => `${v.toString().replace('-', MI)}°<tspan font-style="italic">C</tspan>`

// bảng ngang: tiêu đề hàng 1, hàng 2 nhãn + giá trị
function bang(ten, h1, h2, cols, vals) {
  const W = 560, x0 = 4, lw = 88, cw = (W - 8 - lw) / cols.length, rh = 46, H = rh * 2 + 8
  let b = `<rect x="${x0}" y="4" width="${W - 8}" height="${rh * 2}" stroke-width="2"/>`
  b += `<line x1="${x0}" y1="${4 + rh}" x2="${W - 4}" y2="${4 + rh}" stroke-width="1.5"/>`
  for (let i = 0; i <= cols.length; i++) { const x = x0 + (i === 0 ? 0 : lw + (i - 1) * cw) + (i === 0 ? 0 : cw); if (i < cols.length) b += `<line x1="${x0 + lw + i * cw}" y1="4" x2="${x0 + lw + i * cw}" y2="${4 + rh * 2}" stroke-width="1.5"/>` }
  b += `<line x1="${x0 + lw}" y1="4" x2="${x0 + lw}" y2="${4 + rh * 2}" stroke-width="1.5"/>`
  b += tx(x0 + lw / 2, 4 + rh / 2 + 6, h1, 16) + tx(x0 + lw / 2, 4 + rh * 1.5 + 6, h2, 15.5)
  cols.forEach((c, i) => {
    const cx = x0 + lw + (i + 0.5) * cw
    b += tx(cx, 4 + rh / 2 + 6, c, 15.5) + tx(cx, 4 + rh * 1.5 + 6, vals[i], 18)
  })
  return luu(RA, ten, W, H, svgDoc(W, H, b))
}
await bang('T106000000029', 'Hành tinh', 'Nhiệt độ (°<tspan font-style="italic">C</tspan>)', ['Sao Thổ', 'Sao Mộc', 'Sao Hải Vương', 'Sao Hỏa'], [-140, -120, -200, -80].map(C))
await bang('T1060000002493', 'Hành tinh', 'Nhiệt độ', ['Sao Mộc', 'Sao Hải Vương', 'Sao Hỏa', 'Sao Thiên Vương'], [-150, -220, -180, -214].map(C))
await bang('T106000000531', 'Chất', 'Nhiệt độ (°<tspan font-style="italic">C</tspan>)', ['Oxygen', 'Rượu', 'Thủy Ngân', 'Chlorine'], [-219, -114, -39, -102].map(C))

// 2009 — 4 hành tinh
{
  const W = 560, H = 210, names = ['Sao Thủy', 'Sao Kim', 'Sao Thiên Vương', 'Sao Hỏa'], t = [-184, -220, -224, -87]
  const fills = ['#d4d4d4', '#bdbdbd', '#e6e6e6', '#cfcfcf']
  let b = ''
  names.forEach((n, i) => {
    const cx = 70 + i * 140, cy = 70
    if (i === 2) b += `<ellipse cx="${cx}" cy="${cy}" rx="62" ry="16" transform="rotate(-18 ${cx} ${cy})" stroke-width="2.5"/>`
    b += `<circle cx="${cx}" cy="${cy}" r="42" fill="${fills[i]}" stroke-width="2.5"/>`
    if (i === 2) b += `<path d="M ${cx - 60} ${cy + 12} A 62 16 -18 0 0 ${cx + 60} ${cy - 12}" stroke-width="0"/>`
    b += tx(cx, 148, n, 17) + tx(cx, 180, C(t[i]), 20)
  })
  await luu(RA, 'T1060000002009', W, H, svgDoc(W, H, b))
}

// 2494 — trục số: A=5, B=-4, C=8, D=-12
{
  const W = 560, H = 130, u = 21, y0 = 52, X = (k) => 30 + (k + 13) * u
  let b = `<line x1="12" y1="${y0}" x2="${W - 12}" y2="${y0}" stroke-width="2.5"/><path d="M ${W - 4} ${y0} L ${W - 20} ${y0 - 7} L ${W - 20} ${y0 + 7} Z" fill="#222"/>`
  for (let k = -13; k <= 11; k++) b += `<circle cx="${X(k)}" cy="${y0}" r="3.6" fill="#222" stroke="none"/>`
  for (const k of [-12, -10, -8, -6, -4, -2, -1, 0, 1, 2, 3, 5, 7, 8, 10]) b += tx(X(k), y0 - 16, String(k).replace('-', MI), 15, 'middle', 'bold')
  for (const [k, n] of [[-12, 'D'], [-4, 'B'], [5, 'A'], [8, 'C']]) b += tx(X(k), y0 + 40, n, 22, 'middle', 'bold')
  await luu(RA, 'T1060000002494', W, H, svgDoc(W, H, b))
}

// 3044 — 4 rổ
{
  const W = 560, H = 350
  const rs = [[19, -3, -2], [6, 9, -4], [25, -5, -7], [-2, -6, 22]]
  let b = ''
  rs.forEach((r, i) => {
    const cx = 150 + (i % 2) * 260, cy = 74 + Math.floor(i / 2) * 176
    b += `<ellipse cx="${cx}" cy="${cy}" rx="118" ry="62" stroke-width="3"/>`
    const pos = [[18, -22], [-48, 0], [24, 26]]
    r.forEach((v, j) => {
      const x = cx + [10, -50, 30][j], y = cy + [-24, 0, 26][j] 
      b += `<circle cx="${x}" cy="${y}" r="24" stroke="#1c7a1c" stroke-width="2.5"/>` + tx(x, y + 7, String(v).replace('-', MI), 21, 'middle', 'bold')
    })
    b += tx(cx, cy + 88, 'Rổ ' + (i + 1), 19)
  })
  await luu(RA, 'T1060000003044', W, H, svgDoc(W, H, b))
}

// 454 — 18 viên bi (2 hàng x 9, không vẽ hộp)
{
  const W = 560, H = 150
  let b = ''
  for (let i = 0; i < 18; i++) {
    const x = 44 + (i % 9) * 59, y = 42 + Math.floor(i / 9) * 62
    b += `<circle cx="${x}" cy="${y}" r="22" fill="#d9dde3" stroke-width="2.5"/><path d="M ${x - 11} ${y - 7} A 13 13 0 0 1 ${x - 2} ${y - 14}" stroke="#fff" stroke-width="3"/>`
  }
  await luu(RA, 'T106000000454', W, H, svgDoc(W, H, b))
}
console.log('xong')
