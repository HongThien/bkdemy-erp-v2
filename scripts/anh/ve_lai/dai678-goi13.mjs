// Vẽ lại hình — Đại 6–8 gói 13 (7 hình). node scripts/anh/ve_lai/dai678-goi13.mjs "<thu_muc_ra>"
import { svgDoc, luu, P, label, num, bien } from '../ve_hinh_lib.mjs'
const RA = process.argv[2]
const F = "font-family=\"'Times New Roman',Times,serif\""
const tx = (x, y, t, s = 18, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#111" stroke="none" ${F} font-size="${s}" ${extra}>${t}</text>`
const arrH = (xa, xb, y) => `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke-width="1.5"/><path d="M ${xa} ${y} l 9 -5 v10 z M ${xb} ${y} l -9 -5 v10 z" fill="#222"/>`
const arrV = (x, ya, yb) => `<line x1="${x}" y1="${ya}" x2="${x}" y2="${yb}" stroke-width="1.5"/><path d="M ${x} ${ya} l -5 9 h10 z M ${x} ${yb} l -5 -9 h10 z" fill="#222"/>`
const defsHat = `<defs><pattern id="h1" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="2.5"/></pattern><pattern id="h2" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><circle cx="4" cy="4" r="1.8" fill="#222" stroke="none"/></pattern><pattern id="h3" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#222" stroke-width="1.5"/></pattern><pattern id="h4" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="M0 4H8M4 0V8" stroke="#222" stroke-width="1.2"/></pattern></defs>`
const start = (s) => s.replace('text-anchor="middle"', 'text-anchor="start"')

// biểu đồ cột nước uống: cam 12, dừa 8, chanh 11, mía 5
function cot(ten, hienSo) {
  const W = 560, H = 420, ox = 70, oy = 340, top = 60, u = (oy - top) / 14, bw = 80
  let b = defsHat
  for (let k = 2; k <= 14; k += 2) b += `<line x1="${ox}" y1="${oy - k * u}" x2="${W - 20}" y2="${oy - k * u}" stroke="#ccc" stroke-width="1"/>`
  b += `<line x1="${ox}" y1="${oy}" x2="${W - 24}" y2="${oy}" stroke-width="2.5"/><path d="M ${W - 14} ${oy} l -14 -7 v14 z" fill="#222"/>`
  b += `<line x1="${ox}" y1="${oy}" x2="${ox}" y2="${top - 14}" stroke-width="2.5"/><path d="M ${ox} ${top - 24} l -7 14 h14 z" fill="#222"/>`
  for (let k = 0; k <= 14; k += 2) b += `<line x1="${ox - 6}" y1="${oy - k * u}" x2="${ox}" y2="${oy - k * u}" stroke-width="2"/>` + tx(ox - 12, oy - k * u + 6, k, 17, 'end')
  b += tx(ox + 4, 28, 'Số người chọn', 17, 'start', 'font-weight="bold"')
  b += tx(W - 20, oy + 56, 'Loại nước', 16, 'end', 'font-weight="bold"')
  const d = [['Nước cam', 12], ['Nước dừa', 8], ['Nước chanh', 11], ['Nước mía', 5]]
  d.forEach(([n, v], i) => {
    const cx = ox + 70 + i * 120
    b += `<rect x="${cx - bw / 2}" y="${oy - v * u}" width="${bw}" height="${v * u}" fill="url(#h1)" stroke-width="2"/>`
    if (hienSo) b += tx(cx, oy - v * u - 8, v, 18, 'middle', 'font-weight="bold"')
    b += tx(cx, oy + 26, n, 17)
  })
  return luu(RA, ten, W, H, svgDoc(W, H, b))
}
await cot('T1080000002310', false)
await cot('T1080000002499', true)

// 277 — sân vuông cạnh a, mở rộng mỗi bên 1 m
{
  const W = 420, H = 400, X0 = 40, Y0 = 50, S = 300, m = 40, in0 = X0 + m, inS = S - 2 * m
  let b = defsHat
  b += `<rect x="${X0}" y="${Y0}" width="${S}" height="${S}" fill="#d9dde3" stroke-width="2.5"/><rect x="${in0}" y="${Y0 + m}" width="${inS}" height="${inS}" fill="#fff" stroke-width="2.5"/>`
  b += num(P(in0 + inS / 2, Y0 + m + inS / 2 - 4), 'Sân ban đầu', 0, 0, 20)
  b += arrH(in0, in0 + inS, Y0 + m + inS - 24) + bien(P(in0 + inS / 2, Y0 + m + inS - 32), 'a (m)', 0, 0, 20)
  b += arrH(X0 + S - m, X0 + S, Y0 + S / 2) + start(num(P(X0 + S + 12, Y0 + S / 2 + 6), '1 m', 0, 0, 18))
  b += num(P(W / 2, 30), 'Phần tô xám: phần sân mở rộng thêm', 0, 0, 17)
  await luu(RA, 'T108000000277', W, H, svgDoc(W, H, b))
}

// 584 — Hình 1 chữ nhật x·y, Hình 2 tam giác đáy x, cao y
{
  const W = 560, H = 270
  let b = ''
  const r = { x: 40, y: 40, w: 200, h: 120 }
  b += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" stroke-width="2.5"/>`
  b += label(P(r.x, r.y), 'A', -16, -4) + label(P(r.x + r.w, r.y), 'B', 16, -4) + label(P(r.x, r.y + r.h), 'C', -16, 22) + label(P(r.x + r.w, r.y + r.h), 'D', 16, 22)
  b += bien(P(r.x + r.w / 2, r.y + r.h + 28), 'x', 0, 0, 22) + bien(P(r.x - 24, r.y + r.h / 2 + 8), 'y', 0, 0, 22)
  b += num(P(r.x + r.w / 2, 235), 'Hình 1', 0, 0, 20)
  const N = P(300, 160), Pp = P(530, 160), M = P(430, 40), Hh = P(430, 160)
  b += `<path d="M ${N.x} ${N.y} L ${Pp.x} ${Pp.y} L ${M.x} ${M.y} Z" stroke-width="2.5"/><line x1="${M.x}" y1="${M.y}" x2="${Hh.x}" y2="${Hh.y}" stroke-width="2"/>`
  b += `<path d="M ${Hh.x - 12} ${Hh.y} v -12 h 12" stroke-width="1.5"/>`
  b += label(M, 'M', 0, -10) + label(N, 'N', -16, 22) + label(Pp, 'P', 16, 22)
  b += bien(P((N.x + Pp.x) / 2 - 40, 188), 'x', 0, 0, 22) + bien(P(Hh.x - 18, 105), 'y', 0, 0, 22)
  b += num(P((N.x + Pp.x) / 2, 235), 'Hình 2', 0, 0, 20)
  await luu(RA, 'T108000000584', W, H, svgDoc(W, H, b))
}

// 865 — vườn chữ nhật: cạnh dài 2y+12, cạnh rộng 2x; khu hoa cao y+1
{
  const W = 560, H = 400, x0 = 150, y0 = 40, w = 260, h = 280, hh = 90
  let b = defsHat
  b += `<rect x="${x0}" y="${y0}" width="${w}" height="${h - hh}" fill="url(#h3)" stroke-width="2.5"/><rect x="${x0}" y="${y0 + h - hh}" width="${w}" height="${hh}" fill="url(#h2)" stroke-width="2.5"/>`
  b += `<rect x="${x0 + 55}" y="${y0 + 75}" width="150" height="34" fill="#fff" stroke="none"/>` + num(P(x0 + w / 2, y0 + 100), 'Khu trồng cỏ', 0, 0, 20)
  b += `<rect x="${x0 + 55}" y="${y0 + h - hh + 28}" width="150" height="34" fill="#fff" stroke="none"/>` + num(P(x0 + w / 2, y0 + h - hh + 52), 'Khu trồng hoa', 0, 0, 20)
  b += arrV(x0 - 26, y0, y0 + h) + bien(P(x0 - 40, y0 + h / 2), '2y + 12 (m)', 0, 0, 20).replace('text-anchor="middle"', `text-anchor="middle" transform="rotate(-90 ${x0 - 40} ${y0 + h / 2})"`)
  b += arrV(x0 + w + 26, y0 + h - hh, y0 + h) + start(bien(P(x0 + w + 40, y0 + h - hh / 2), 'y + 1 (m)', 0, 0, 20))
  b += arrH(x0, x0 + w, y0 + h + 28) + bien(P(x0 + w / 2, y0 + h + 56), '2x (m)', 0, 0, 20)
  await luu(RA, 'T108000000865', W, H, svgDoc(W, H, b))
}

// 983 — Hình 1: ba tấm kính A (x·x), B (1·x), C (y·x)
{
  const W = 560, H = 300, hgt = 160, y0 = 40
  const d = [['A', 'x', 'x', 150], ['B', '1', 'x', 60], ['C', 'y', 'x', 200]]
  let b = '', cx = 44
  for (const [n, wl, hl, wd] of d) {
    b += `<rect x="${cx}" y="${y0}" width="${wd}" height="${hgt}" stroke-width="2.5" fill="#f2f4f7"/>`
    b += tx(cx + wd / 2, y0 + hgt / 2 + 8, n, 24, 'middle', 'font-weight="bold"')
    b += bien(P(cx + wd / 2, y0 + hgt + 28), wl, 0, 0, 22) + bien(P(cx - 14, y0 + hgt / 2 + 8), hl, 0, 0, 22)
    cx += wd + 36
  }
  b += num(P(W / 2, 282), 'Hình 1 (đơn vị: m)', 0, 0, 20)
  await luu(RA, 'T108000000983', W, H, svgDoc(W, H, b))
}

// 1083 — quạt tròn đội bóng
{
  const W = 560, H = 420, cx = 280, cy = 225, r = 120
  const fills = ['url(#h1)', '#d4d8de', 'url(#h2)', 'url(#h4)']
  const data = [['Hươu Vàng', 24], ['Sóc Nâu', 46], ['Gấu Đen', 14], ['Thỏ Trắng', 16]]
  let a0 = -90, b = defsHat
  const pt = (a, rr) => [cx + rr * Math.cos(a * Math.PI / 180), cy + rr * Math.sin(a * Math.PI / 180)]
  data.forEach(([n, p], i) => {
    const a1 = a0 + p * 3.6, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r), la = p > 50 ? 1 : 0
    b += `<path d="M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${la} 1 ${x1} ${y1} Z" fill="${fills[i]}" stroke-width="2.5"/>`
    const m = (a0 + a1) / 2, [lx, ly] = pt(m, r + 20), right = lx > cx
    const up = ly < cy - 40, dn = ly > cy + 40
    const yy = up ? ly - 24 : dn ? ly + 16 : ly - 8
    b += tx(lx, yy, n, 18, right ? 'start' : 'end') + tx(lx, yy + 21, p + '%', 18, right ? 'start' : 'end')
    a0 = a1
  })
  b += tx(W / 2, 30, 'Cổ động viên các đội bóng (50 học sinh)', 18)
  await luu(RA, 'T1070000001083', W, H, svgDoc(W, H, b))
}
console.log('xong')
