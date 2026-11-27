// Hàm chung cho các script k5-HK2-*.mjs (bảng, quạt tròn, ghi báo cáo)
import { writeFileSync, mkdirSync } from 'node:fs'
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const f = (n) => Math.round(n * 100) / 100
export const FONT = "font-family=\"'Times New Roman',Times,serif\""
export const txt = (x, y, s, size = 20, anchor = 'middle', extra = '') =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" fill="#111" stroke="none" ${FONT} font-size="${size}" ${extra}>${s}</text>`

/** Bảng: cols = độ rộng cột, rows = [[ô, ...]] (ô = chuỗi hoặc mảng dòng; '' = ô trống HS điền) */
export function bang(cols, rows, rowH, size = 18, x0 = 10, y0 = 10) {
  let b = ''
  const W = cols.reduce((a, c) => a + c, 0)
  rows.forEach((r, i) => {
    let x = x0
    const y = y0 + (Array.isArray(rowH) ? rowH.slice(0, i).reduce((a, c) => a + c, 0) : i * rowH)
    const h = Array.isArray(rowH) ? rowH[i] : rowH
    r.forEach((c, j) => {
      b += `<rect x="${x}" y="${y}" width="${cols[j]}" height="${h}" fill="#fff" stroke="#222" stroke-width="2"/>`
      const ls = Array.isArray(c) ? c : [c]
      ls.forEach((l, k) => { if (l) b += txt(x + cols[j] / 2, y + h / 2 + size * 0.34 + (k - (ls.length - 1) / 2) * (size + 4), l, size) })
      x += cols[j]
    })
  })
  const H = Array.isArray(rowH) ? rowH.reduce((a, c) => a + c, 0) : rows.length * rowH
  return { body: b, w: W + 2 * x0, h: H + 2 * y0 }
}

/** Quạt tròn: slices = [{pct, fill, label}] theo chiều kim đồng hồ từ 12 giờ */
export function quat(cx, cy, r, slices, size = 22) {
  const tot = slices.reduce((a, s) => a + s.pct, 0)
  if (Math.abs(tot - 100) > 1e-9) throw new Error('tổng % != 100: ' + tot)
  let th = 0, b = ''
  const pt = (t, rr) => [cx + rr * Math.sin(t * Math.PI / 180), cy - rr * Math.cos(t * Math.PI / 180)]
  for (const s of slices) {
    const a = s.pct * 3.6, t2 = th + a
    const [x1, y1] = pt(th, r), [x2, y2] = pt(t2, r)
    b += `<path d="M ${cx} ${cy} L ${f(x1)} ${f(y1)} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${f(x2)} ${f(y2)} Z" fill="${s.fill}" stroke="#222" stroke-width="2"/>`
    const [lx, ly] = pt(th + a / 2, r * 0.64)
    if (s.label) b += txt(lx, ly + size * 0.34, s.label, size)
    th = t2
  }
  return b
}

export async function ra(dirDe, ten, w, h, body) {
  if (w > 760 || h > 450) throw new Error(`${ten} ${w}x${h} vượt khung`)
  console.log(`${ten} ${w}x${h}`)
  await luu(dirDe, ten, w, h, svgDoc(w, h, body))
}
export function baoCao(out, bc, kv, lech) {
  const par = out.replace(/[\\/]moi$/, '')
  mkdirSync(out, { recursive: true })
  writeFileSync(`${par}/bao-cao.json`, JSON.stringify(bc, null, 1))
  writeFileSync(`${par}/khong-ve.json`, JSON.stringify(kv, null, 1))
  if (lech) writeFileSync(`${par}/lech-de.md`, lech)
}
