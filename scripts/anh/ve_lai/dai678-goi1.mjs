// Vẽ lại hình — gói dai678/goi1 (Đại 6–7: bàn cờ, bảng nhiệt độ, trục số, bánh răng)
//   node scripts/anh/ve_lai/dai678-goi1.mjs "<thu_muc_ra>"
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const RA = process.argv[2]
const FF = `font-family="'Times New Roman',Times,serif"`
const tx = (x, y, t, s = 16, it = false, anchor = 'middle') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${FF} font-size="${s}"${it ? ' font-style="italic"' : ''}>${t}</text>`
const ln = (a, b, c, d, w = 2) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke-width="${w}"/>`
const MI = '\u2212'
const arrow = (x0, x1, y) => ln(x0, y, x1, y) + `<path d="M ${x1 - 12} ${y - 6} L ${x1} ${y} L ${x1 - 12} ${y + 6}" stroke-width="2"/>`
const tk = (x, y, h = 7) => ln(x, y - h, x, y + h)
const frac = (x, y, n, d, s = 16) =>
  tx(x, y - 3, n, s) + ln(x - s * 0.7, y + 1, x + s * 0.7, y + 1, 1.5) + tx(x, y + s, d, s)

// 1) T106000000149 — bàn cờ: 5 ô đầu có 1, 2, 4, 8, 16 hạt gạo
{
  const S = 100, x0 = 30, y0 = 30, w = 560 - 0, h = 170
  let b = ''
  for (let i = 0; i < 5; i++) b += `<rect x="${x0 + i * S}" y="${y0}" width="${S}" height="${S}" fill="${i % 2 ? '#c4c4c4' : '#fff'}" stroke-width="2"/>`
  const pos = (n) => {
    const out = [], c = Math.ceil(Math.sqrt(n)), r = Math.ceil(n / c), cw = S / c, ch = S / r
    for (let k = 0; k < n; k++) out.push([(k % c + 0.5) * cw, (Math.floor(k / c) + 0.5) * ch, ((k * 47) % 60) - 30])
    return out
  }
  ;[1, 2, 4, 8, 16].forEach((n, i) => {
    for (const [px, py, a] of pos(n)) {
      const rx = n > 8 ? 8 : 11, ry = n > 8 ? 3.4 : 4.5
      b += `<ellipse cx="${x0 + i * S + px}" cy="${y0 + py}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x0 + i * S + px} ${y0 + py})" fill="#fff" stroke-width="1.5"/>`
    }
  })
  for (let i = 0; i < 5; i++) b += tx(x0 + i * S + S / 2, y0 + S + 24, `ô ${i + 1}`, 15)
  await luu(RA, 'T106000000149', 560, 170, svgDoc(560, 170, b))
}

// 2) T1060000001628 — bảng nhiệt độ
{
  const W = 400, H = 240, x0 = 20, y0 = 20, c1 = 230, rh = 40
  const rows = [['Thành phố', 'Nhiệt độ'], ['Hà Nội', `18°C`], ['Bắc Kinh', `${MI}3°C`], ['Moskva', `${MI}13°C`], ['Washington D.C', `5°C`]]
  let b = `<rect x="${x0}" y="${y0}" width="${W - 40}" height="${rh * 5}" stroke-width="2"/>` + ln(x0 + c1, y0, x0 + c1, y0 + rh * 5)
  for (let i = 1; i < 5; i++) b += ln(x0, y0 + i * rh, W - 20, y0 + i * rh, i === 1 ? 2 : 1.2)
  rows.forEach((r, i) => { b += tx(x0 + 12, y0 + i * rh + 27, r[0], 22, false, 'start') + tx(x0 + c1 + 12, y0 + i * rh + 27, r[1], 22, false, 'start') })
  await luu(RA, 'T1060000001628', W, H, svgDoc(W, H, b))
}

// 3) T1060000002019 — ba trục số
{
  const W = 560, H = 290
  let b = ''
  // a: A,B,C,D tại -4,-2,1,4; ghi -3, 0, 2
  {
    const y = 60, x = (v) => 60 + (v + 4) * 52
    b += tx(14, y + 5, 'a)', 17, false, 'start') + arrow(48, 548, y)
    for (let v = -4; v <= 4; v++) b += tk(x(v), y)
    ;[[-4, 'A'], [-2, 'B'], [1, 'C'], [4, 'D']].forEach(([v, n]) => (b += tx(x(v), y - 16, n, 20, true)))
    ;[[-3, `${MI}3`], [0, '0'], [2, '2']].forEach(([v, n]) => (b += tx(x(v), y + 28, n, 17)))
  }
  // b: -5..5 có nhãn đủ
  {
    const y = 160, x = (v) => 60 + (v + 5) * 45
    b += tx(14, y + 5, 'b)', 17, false, 'start') + arrow(48, 548, y)
    for (let v = -5; v <= 5; v++) b += tk(x(v), y) + tx(x(v), y + 28, v < 0 ? MI + -v : String(v), 17)
  }
  // c: -5..5, chỉ ghi -3, 4, 5
  {
    const y = 250, x = (v) => 60 + (v + 5) * 45
    b += tx(14, y + 5, 'c)', 17, false, 'start') + arrow(48, 548, y)
    for (let v = -5; v <= 5; v++) b += tk(x(v), y)
    ;[[-3, `${MI}3`], [4, '4'], [5, '5']].forEach(([v, n]) => (b += tx(x(v), y + 28, n, 17)))
  }
  await luu(RA, 'T1060000002019', W, H, svgDoc(W, H, b))
}

// 4) T1060000002441 — hai bánh răng (20 và 15 răng), đánh dấu x ở răng đang khớp
{
  const K = 1.3, R1 = 80 * K, R2 = 60 * K, hh = 6 * K, n1 = 20, n2 = 15
  const c1 = { x: 30 + R1 + hh, y: 30 + R1 + hh }, c2 = { x: c1.x + R1 + R2, y: c1.y }
  const W = Math.ceil(c2.x + R2 + hh + 30), H = Math.ceil(c1.y + R1 + hh + 30)
  const gear = (c, R, n, a0) => {
    const p = (2 * Math.PI) / n, pts = []
    for (let i = 0; i < n; i++) {
      const a = a0 + i * p
      const q = [[-0.27, R - hh], [-0.16, R + hh * 0.9], [0.16, R + hh * 0.9], [0.27, R - hh]]
      for (const [k, r] of q) pts.push(`${(c.x + r * Math.cos(a + k * p)).toFixed(1)} ${(c.y - r * Math.sin(a + k * p)).toFixed(1)}`)
    }
    return `<path d="M ${pts.join(' L ')} Z" fill="#eef3fa" stroke-linejoin="round"/>`
  }
  const xm = (x, y) => `<path d="M ${x - 5} ${y - 5} L ${x + 5} ${y + 5} M ${x - 5} ${y + 5} L ${x + 5} ${y - 5}" stroke-width="2.5"/>`
  const p2 = (2 * Math.PI) / n2
  // bánh I: răng ở góc 0 (hướng sang phải); bánh II: khe ở góc 180°, răng kề trên ở 180° - p2/2
  const aI = 0, aII = Math.PI - p2 / 2
  let b = gear(c1, R1, n1, 0) + gear(c2, R2, n2, aII + p2 * 0) // răng II ở aII + k·p2 (khe ở 180°)
  b += `<circle cx="${c1.x}" cy="${c1.y}" r="${R1 - 28}" fill="none" stroke-width="1.5"/><circle cx="${c2.x}" cy="${c2.y}" r="${R2 - 24}" fill="none" stroke-width="1.5"/>`
  b += `<circle cx="${c1.x}" cy="${c1.y}" r="5" fill="#222"/><circle cx="${c2.x}" cy="${c2.y}" r="5" fill="#222"/>`
  b += tx(c1.x, c1.y - 20, 'Bánh xe I', 19) + tx(c2.x, c2.y - 18, 'Bánh xe II', 17)
  b += xm(c1.x + R1 - hh - 10, c1.y) + xm(c2.x + (R2 - hh - 8) * Math.cos(aII), c2.y - (R2 - hh - 8) * Math.sin(aII))
  await luu(RA, 'T1060000002441', W, H, svgDoc(W, H, b))
}

// 5) T1060000002900 — trục số có điểm tại mọi số nguyên -13..11; nhãn số phía trên, tên điểm phía dưới
{
  const W = 570, H = 110, y = 52, x = (v) => 42 + (v + 13) * 20
  let b = arrow(14, 560, y)
  for (let v = -13; v <= 11; v++) b += `<circle cx="${x(v)}" cy="${y}" r="3.8" fill="#222" stroke="none"/>`
  for (const v of [-12, -10, -8, -6, -4, -2, -1, 0, 1, 2, 3, 5, 7, 8, 10]) b += tx(x(v), y - 14, v < 0 ? MI + -v : String(v), 15)
  ;[[-12, 'D'], [-4, 'B'], [5, 'A'], [8, 'C']].forEach(([v, n]) => (b += tx(x(v), y + 32, n, 20, true)))
  await luu(RA, 'T1060000002900', W, H, svgDoc(W, H, b))
}

// 6) T107000000071 — trục số, vạch cách đều, theo vị trí cho trong đề (đơn vị = 1/6 đoạn từ 0 đến 1)
{
  const W = 560, H = 130, y = 62, x = (v) => 40 + (v + 8) * 28
  let b = arrow(14, 552, y)
  for (let v = -8; v <= 9; v++) b += tk(x(v), y)
  ;[[-7, 'A'], [-2, 'B'], [0, 'O'], [3, 'C'], [8, 'D']].forEach(([v, n]) => (b += tx(x(v), y - 16, n, 20, true)))
  b += tx(x(-6), y + 28, `${MI}1`, 17) + frac(x(-3), y + 26, `${MI}1`, '2') + frac(x(2), y + 26, '1', '3') + tx(x(6), y + 28, '1', 17)
  await luu(RA, 'T107000000071', W, H, svgDoc(W, H, b))
}
console.log('xong')
