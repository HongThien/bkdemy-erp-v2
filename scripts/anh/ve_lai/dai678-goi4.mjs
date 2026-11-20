// Vẽ lại hình — Đại 6–8 gói 4 (7 hình). node scripts/anh/ve_lai/dai678-goi4.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, label, num, bien, dot } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const MI = '−'
const F = "font-family=\"'Times New Roman',Times,serif\""
const tx = (x, y, t, s = 20, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${F} font-size="${s}">${t}</text>`
const frac = (x, y, a, b, s = 20) => `${tx(x, y - 4, a, s)}<line x1="${x - s * 0.7}" y1="${y + 1}" x2="${x + s * 0.7}" y2="${y + 1}" stroke-width="1.5"/>${tx(x, y + s, b, s)}`
const arrH = (xa, xb, y) => `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke-width="1.5"/><path d="M ${xa} ${y} l 9 -5 v10 z M ${xb} ${y} l -9 -5 v10 z" fill="#222"/>`

// 1. T107000000870 — trục số, mỗi vạch = 1/6; A=-7/6, B=-1/3, O, C=1/2, D=4/3
{
  const W = 560, H = 140, u = 32, y0 = 50
  const X = (k) => 40 + (k + 7) * u
  let b = `<line x1="24" y1="${y0}" x2="${W - 14}" y2="${y0}" stroke-width="2.5"/><path d="M ${W - 6} ${y0} L ${W - 22} ${y0 - 7} L ${W - 22} ${y0 + 7} Z" fill="#222"/>`
  for (let k = -7; k <= 9; k++) b += `<line x1="${X(k)}" y1="${y0 - 6}" x2="${X(k)}" y2="${y0 + 6}" stroke-width="2"/>`
  for (const [k, n] of [[-7, 'A'], [-2, 'B'], [0, 'O'], [3, 'C'], [8, 'D']]) b += `${dot(P(X(k), y0))}${label(P(X(k), y0), n, 0, -18)}`
  b += tx(X(-6), y0 + 30, MI + '1', 22) + frac(X(-3), y0 + 38, MI + '1', '2', 22) + frac(X(2), y0 + 38, '1', '3', 22) + tx(X(6), y0 + 30, '1', 22)
  await luu(RA, 'T107000000870', W, H, svgDoc(W, H, b))
}

// 2. T107000000997 — biểu đồ quạt 30/45/25
{
  const W = 560, H = 400, cx = 280, cy = 220, r = 120
  const defs = `<defs><pattern id="h1" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2.5"/></pattern><pattern id="h2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><circle cx="4" cy="4" r="1.8" fill="#222" stroke="none"/></pattern></defs>`
  const fills = ['url(#h1)', '#c9ced6', 'url(#h2)']
  const data = [['Phục vụ học tập', 30], ['Giải trí', 45], ['Kết nối bạn bè', 25]]
  let a0 = -90, b = ''
  const pt = (a, rr) => [cx + rr * Math.cos(a * Math.PI / 180), cy + rr * Math.sin(a * Math.PI / 180)]
  data.forEach(([n, p], i) => {
    const a1 = a0 + p * 3.6, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r), la = p > 50 ? 1 : 0
    b += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${la} 1 ${x1} ${y1} Z" fill="${fills[i]}" stroke-width="2.5"/>`
    const m = (a0 + a1) / 2, [lx, ly] = pt(m, r + 18), right = lx > cx
    b += tx(lx, ly + (ly < cy ? -26 : 16), n, 19, right ? 'start' : 'end')
    b += tx(lx, ly + (ly < cy ? -6 : 36), p + '%', 19, right ? 'start' : 'end')
    a0 = a1
  })
  b = tx(W / 2, 34, 'THỰC TRẠNG VÀO MẠNG INTERNET CỦA HỌC SINH THCS', 18) + b
  await luu(RA, 'T107000000997', W, H, svgDoc(W, H, defs + b))
}

// 3. T1080000001014 — sân bóng, dài 15x+5y, rộng 10x-5y (THEO ĐỀ; ảnh cũ ghi 10x+5y), lối đi 3 m
{
  const W = 540, H = 330, x0 = 70, y0 = 60, w = 400, h = 220, m = 24
  let b = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#e8e8e8"/><rect x="${x0 + m}" y="${y0 + m}" width="${w - 2 * m}" height="${h - 2 * m}" fill="#fff"/>`
  const cxm = x0 + w / 2, cym = y0 + h / 2
  b += `<line x1="${cxm}" y1="${y0 + m}" x2="${cxm}" y2="${y0 + h - m}" stroke-width="1.5"/><circle cx="${cxm}" cy="${cym}" r="30" stroke-width="1.5"/>`
  b += `<rect x="${x0 + m}" y="${cym - 50}" width="50" height="100" stroke-width="1.5"/><rect x="${x0 + w - m - 50}" y="${cym - 50}" width="50" height="100" stroke-width="1.5"/>`
  b += arrH(x0, x0 + w, y0 - 22) + bien(P(cxm, y0 - 32), '15x + 5y (m)', 0, 0, 22)
  b += `<line x1="${x0 - 22}" y1="${y0}" x2="${x0 - 22}" y2="${y0 + h}" stroke-width="1.5"/><path d="M ${x0 - 22} ${y0} l -5 9 h10 z M ${x0 - 22} ${y0 + h} l -5 -9 h10 z" fill="#222"/>`
  b += `<text x="${x0 - 32}" y="${cym}" text-anchor="middle" fill="#111" stroke="none" ${F} font-size="22" transform="rotate(-90 ${x0 - 32} ${cym})">10<tspan font-style="italic">x</tspan> ${MI} 5<tspan font-style="italic">y</tspan> (m)</text>`
  b += arrH(x0 + w - m, x0 + w, y0 + h + 14) + num(P(x0 + w - m / 2, y0 + h + 38), '3 m', 0, 0, 20)
  b += num(P(cxm - 40, y0 + h + 38), 'Lối đi rộng 3 m ở mỗi cạnh', 0, 0, 18)
  await luu(RA, 'T1080000001014', W, H, svgDoc(W, H, b))
}

// 4. T1080000001016 — 5 cốc
{
  const W = 560, H = 150
  let b = ''
  for (let i = 0; i < 5; i++) {
    const cx = 56 + i * 112, t = 22, bt = 100, tw = 44, bw = 30
    b += `<path d="M ${cx - tw} ${t} L ${cx - bw} ${bt} Q ${cx} ${bt + 8} ${cx + bw} ${bt} L ${cx + tw} ${t}" stroke-width="2.5"/><ellipse cx="${cx}" cy="${t}" rx="${tw}" ry="9" stroke-width="2.5"/>`
    b += num(P(cx, 138), String(i + 1), 0, 0, 26)
  }
  await luu(RA, 'T1080000001016', W, H, svgDoc(W, H, b))
}

// 5. T1080000001289 — khu đất rào ba mặt giáp sông
{
  const W = 540, H = 330, A = P(110, 60), B = P(400, 60), C = P(400, 200), D = P(110, 200)
  let b = `<path d="M ${D.x} ${D.y} L ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y}" stroke-width="6"/>`
  b += `<line x1="20" y1="${D.y}" x2="${W - 20}" y2="${D.y}" stroke-width="2"/>`
  for (let k = 0; k < 3; k++) { const y = 232 + k * 24; let d = `M 40 ${y}`; for (let x = 40; x < 480; x += 40) d += ` q 10 -8 20 0 t 20 0`; b += `<path d="${d}" stroke-width="1.5"/>` }
  b += num(P(270, 302), 'SÔNG', 0, 0, 22)
  b += label(A, 'A', -16, -8) + label(B, 'B', 16, -8) + label(C, 'C', 16, 22) + label(D, 'D', -16, 22)
  b += arrH(A.x, B.x, 38) + bien(P(255, 28), 'x (m)', 0, 0, 22)
  b += bien(P(B.x + 44, 135), 'y (m)', 0, 0, 22) + num(P(255, 138), 'Trồng rau', 0, 0, 22) + num(P(56, 135), 'Lưới sắt', 0, 0, 20)
  await luu(RA, 'T1080000001289', W, H, svgDoc(W, H, b))
}

// 6. T1080000001304 — hệ trục Oxy, M(-2; 1)
{
  const W = 400, H = 300, ox = 220, oy = 160, u = 44
  let b = `<line x1="14" y1="${oy}" x2="${W - 14}" y2="${oy}" stroke-width="2"/><path d="M ${W - 6} ${oy} l -14 -6 v12 z" fill="#222"/>`
  b += `<line x1="${ox}" y1="${H - 12}" x2="${ox}" y2="16" stroke-width="2"/><path d="M ${ox} 8 l -6 14 h12 z" fill="#222"/>`
  for (const k of [-4, -3, -2, -1, 1, 2, 3]) b += `<line x1="${ox + k * u}" y1="${oy - 5}" x2="${ox + k * u}" y2="${oy + 5}" stroke-width="2"/>` + num(P(ox + k * u, oy + 24), String(k).replace('-', MI), 0, 0, 18)
  for (const k of [-2, -1, 1, 2, 3]) b += `<line x1="${ox - 5}" y1="${oy - k * u}" x2="${ox + 5}" y2="${oy - k * u}" stroke-width="2"/>` + num(P(ox - 20, oy - k * u + 6), String(k).replace('-', MI), 0, 0, 18)
  b += label(P(ox, oy), 'O', 14, 24) + label(P(W - 18, oy), 'x', 0, -12) + label(P(ox, 14), 'y', 16, 10)
  b += dot(P(ox - 2 * u, oy - u)) + label(P(ox - 2 * u, oy - u), 'M', -4, -12)
  await luu(RA, 'T1080000001304', W, H, svgDoc(W, H, b))
}

// 7. T1080000001473 — bức tường ABCD, cửa EFGH; AB=3,6; HE=1,6; IF=1,4
{
  const W = 540, H = 330, k = 70, x0 = 80, yT = 50, hw = 3.6 * k, ww = 390
  const B = P(x0, yT), C = P(x0 + ww, yT), A = P(x0, yT + hw), D = P(x0 + ww, yT + hw)
  const E = P(x0 + 290, yT + hw), H_ = P(E.x - 1.6 * k, yT + hw), I = P(E.x, yT), Fp = P(E.x, yT + 1.4 * k), G = P(H_.x, Fp.y)
  let b = `<rect x="${B.x}" y="${B.y}" width="${ww}" height="${hw}" fill="#e8e8e8"/><path d="M ${H_.x} ${H_.y} L ${G.x} ${G.y} L ${Fp.x} ${Fp.y} L ${E.x} ${E.y} Z" fill="#fff"/>`
  b += `<rect x="${B.x}" y="${B.y}" width="${ww}" height="${hw}"/><line x1="${I.x}" y1="${I.y}" x2="${E.x}" y2="${E.y}" stroke-width="1.5"/>`
  b += label(B, 'B', -16, -6) + label(C, 'C', 16, -6) + label(A, 'A', -16, 24) + label(D, 'D', 16, 24) + label(I, 'I', 0, -10)
  b += label(Fp, 'F', 18, 8) + label(G, 'G', -16, 8) + label(H_, 'H', -4, 26) + label(E, 'E', 14, 26)
  b += bien(P((B.x + I.x) / 2, yT - 14), 'x (m)', 0, 0, 22) + num(P(x0 - 34, yT + hw / 2 + 6), '3,6 m', 0, 0, 20)
  b += num(P(I.x + 36, yT + 0.7 * k + 6), '1,4 m', 0, 0, 20) + num(P((H_.x + E.x) / 2 + 14, yT + hw + 26), '1,6 m', 0, 0, 20)
  await luu(RA, 'T1080000001473', W, H, svgDoc(W, H, b))
}
console.log('xong')
