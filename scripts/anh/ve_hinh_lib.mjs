// ve_hinh_lib.mjs — bộ vẽ HÌNH HỌC PHẲNG bằng code (SVG → PNG 2x qua Chrome headless).
// Dùng cho hình đề bài lớp 6–9 khi ảnh gốc mờ/xấu. Hình hình học vẽ bằng code thì nhãn điểm, gạch bằng nhau, cung góc luôn đúng
// (ChatGPT/ảnh AI hay vẽ sai nhãn). Chrome: biến CHROME_PATH hoặc đường mặc định Windows.
//   import { seg, tick, angleMark, dot, label, T, svgDoc, luu } from './ve_hinh_lib.mjs'
//   Vẽ hàng loạt (13/10): dựng điểm bằng mid/foot/inter/rot/bisector…, xếp hình bằng hinh(ten, pts, body) rồi `await xuatTat(dir)` ở cuối tệp
//   (khung tự tính, Chrome mở một lần). Mẫu: scripts/anh/ve_lai/_mau.mjs.
//   Toạ độ: gốc trên-trái, y hướng xuống (như ảnh). Hình PHẢI khớp dữ kiện đề (đối xứng/song song/bằng nhau dựng đúng, không ước mắt).
import { mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y })
const unit = (v) => { const l = Math.hypot(v.x, v.y); return { x: v.x / l, y: v.y / l } }
const f = (n) => Math.round(n * 100) / 100

export const P = (x, y) => ({ x, y })
export const seg = (a, b) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"/>`

/** Ký hiệu nhóm đoạn bằng nhau số n tại vị trí t (0..1) dọc đoạn a→b.
 *  ⭐ CEO 14/10: KHÔNG dùng 4–5 gạch (xấu, khó đếm). Tối đa 3 gạch; từ nhóm thứ 4 trở đi dùng dấu "x" kết hợp gạch:
 *    n = 1 | 2 | 3   →  1 | 2 | 3 gạch
 *    n = 4           →  ×
 *    n = 5 | 6       →  × kèm 1 | 2 gạch
 *  Nhiều hơn 6 nhóm trong một hình = hình quá rậm ⇒ tách hình (mỗi ý một hình), đừng thêm ký hiệu. */
export function tick(a, b, n = 1, t = 0.5) {
  const d = unit(sub(b, a)); const nr = { x: -d.y, y: d.x }
  const m = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
  const gach = (c) => `<line x1="${f(c.x - nr.x * 7)}" y1="${f(c.y - nr.y * 7)}" x2="${f(c.x + nr.x * 7)}" y2="${f(c.y + nr.y * 7)}"/>`
  const dichDoc = (off) => ({ x: m.x + d.x * off, y: m.y + d.y * off })
  if (n <= 3) {
    let s = ''
    for (let i = 0; i < n; i++) s += gach(dichDoc((i - (n - 1) / 2) * 7))
    return s
  }
  if (n > 6) throw new Error(`tick: nhóm ${n} — quá 6 nhóm đoạn bằng nhau trong một hình, hãy tách hình theo ý`)
  const soGach = n - 4                                    // 0 | 1 | 2 gạch đi kèm dấu x
  const tong = 1 + soGach                                 // dấu x chiếm 1 ô, mỗi gạch 1 ô, cách nhau 9px
  let s = cross(dichDoc((0 - (tong - 1) / 2) * 9), d)
  for (let i = 1; i < tong; i++) s += gach(dichDoc((i - (tong - 1) / 2) * 9))
  return s
}
/** Dấu "x" đặt tại c, hai nét nghiêng ±45° so với hướng đoạn d (đơn vị). Dùng qua tick(n≥4). */
export function cross(c, d, r = 6) {
  const u = { x: (d.x - d.y) / Math.SQRT2, y: (d.y + d.x) / Math.SQRT2 }   // d xoay +45°
  const v = { x: (d.x + d.y) / Math.SQRT2, y: (d.y - d.x) / Math.SQRT2 }   // d xoay −45°
  return `<line x1="${f(c.x - u.x * r)}" y1="${f(c.y - u.y * r)}" x2="${f(c.x + u.x * r)}" y2="${f(c.y + u.y * r)}"/>`
    + `<line x1="${f(c.x - v.x * r)}" y1="${f(c.y - v.y * r)}" x2="${f(c.x + v.x * r)}" y2="${f(c.y + v.y * r)}"/>`
}

/** n cung đánh dấu góc bằng nhau tại v, giữa tia v→p và v→q (cung ngắn). Hai góc kề nhau: dùng 2 bán kính KHÁC nhau. */
export function angleMark(v, p, q, r = 30, n = 1) {
  const u1 = unit(sub(p, v)), u2 = unit(sub(q, v))
  const sweep = (u1.x * u2.y - u1.y * u2.x) > 0 ? 1 : 0
  let s = ''
  for (let i = 0; i < n; i++) {
    const rr = r + i * 6
    s += `<path d="M ${f(v.x + u1.x * rr)} ${f(v.y + u1.y * rr)} A ${rr} ${rr} 0 0 ${sweep} ${f(v.x + u2.x * rr)} ${f(v.y + u2.y * rr)}" fill="none"/>`
  }
  return s
}

/** Ô vuông đánh dấu góc vuông tại v, giữa tia v→p và v→q */
export function rightAngle(v, p, q, s = 14) {
  const u1 = unit(sub(p, v)), u2 = unit(sub(q, v))
  const a = { x: v.x + u1.x * s, y: v.y + u1.y * s }, b = { x: v.x + u2.x * s, y: v.y + u2.y * s }
  const c = { x: a.x + u2.x * s, y: a.y + u2.y * s }
  return `<path d="M ${f(a.x)} ${f(a.y)} L ${f(c.x)} ${f(c.y)} L ${f(b.x)} ${f(b.y)}" fill="none"/>`
}

/** Điểm cách O một đoạn L theo góc ang (độ, ngược chiều kim đồng hồ từ trục +x; y hướng xuống) */
export const ray = (O, ang, L) => P(O.x + L * Math.cos(ang * Math.PI / 180), O.y - L * Math.sin(ang * Math.PI / 180))

export const dot = (p) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="4.5" fill="#222" stroke="none"/>`
export const label = (p, t, dx, dy) =>
  `<text x="${f(p.x + dx)}" y="${f(p.y + dy)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-style="italic" font-size="26">${t}</text>`
export const T = (dx, dy, body) => `<g transform="translate(${dx},${dy})">${body}</g>`

export function svgDoc(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/><g stroke="#222" stroke-width="2" stroke-linecap="round" fill="none">${body}</g></svg>`
}

// ───────── Dựng điểm (toạ độ ảnh, y hướng xuống) — dùng để hình KHỚP dữ kiện đề, không ước mắt ─────────
export const add = (a, b) => P(a.x + b.x, a.y + b.y)
export const vec = (a, b) => sub(b, a)
export const mul = (v, k) => P(v.x * k, v.y * k)
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
/** Điểm chia đoạn a→b theo tỉ số t (t=0 là a, t=1 là b; t ngoài [0,1] = kéo dài) */
export const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
export const mid = (a, b) => lerp(a, b, 0.5)
/** Chân đường vuông góc hạ từ p xuống đường thẳng ab */
export const foot = (p, a, b) => { const d = sub(b, a); return lerp(a, b, ((p.x - a.x) * d.x + (p.y - a.y) * d.y) / (d.x * d.x + d.y * d.y)) }
/** Giao điểm hai ĐƯỜNG THẲNG ab và cd (null nếu song song) */
export function inter(a, b, c, d) {
  const r = sub(b, a), s = sub(d, c), k = r.x * s.y - r.y * s.x
  if (Math.abs(k) < 1e-9) return null
  return lerp(a, b, ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / k)
}
/** Quay p quanh o một góc deg (dương = ngược chiều kim đồng hồ NHƯ NHÌN TRÊN HÌNH) */
export function rot(p, o, deg) {
  const t = deg * Math.PI / 180, dx = p.x - o.x, dy = p.y - o.y
  return P(o.x + dx * Math.cos(t) + dy * Math.sin(t), o.y - dx * Math.sin(t) + dy * Math.cos(t))
}
/** Điểm đối xứng của p qua đường thẳng ab / qua điểm o */
export const reflect = (p, a, b) => { const h = foot(p, a, b); return P(2 * h.x - p.x, 2 * h.y - p.y) }
export const doiXung = (p, o) => P(2 * o.x - p.x, 2 * o.y - p.y)
/** Điểm trên tia phân giác của góc pvq, cách v một đoạn L */
export const bisector = (v, p, q, L = 100) => { const u1 = unit(sub(p, v)), u2 = unit(sub(q, v)); const u = unit(P(u1.x + u2.x, u1.y + u2.y)); return P(v.x + u.x * L, v.y + u.y * L) }
/** Số đo góc pvq (độ, 0..180) — để TỰ KIỂM hình khớp đề */
export const goc = (v, p, q) => { const u1 = unit(sub(p, v)), u2 = unit(sub(q, v)); return Math.acos(Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y))) * 180 / Math.PI }
/** Tâm đường tròn ngoại tiếp / nội tiếp tam giác abc */
export const ngoaiTiep = (a, b, c) => { const m1 = mid(a, b), m2 = mid(a, c); return inter(m1, rot(a, m1, 90), m2, rot(a, m2, 90)) }
export const noiTiep = (a, b, c) => inter(a, bisector(a, b, c), b, bisector(b, a, c))

// ───────── Nét vẽ bổ sung ─────────
export const segDash = (a, b) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke-dasharray="7 6"/>`
/** Đường thẳng qua a, b kéo dài thêm e1 (phía a) và e2 (phía b) px */
export const lineExt = (a, b, e1 = 40, e2 = 40) => { const u = unit(sub(b, a)); return seg(P(a.x - u.x * e1, a.y - u.y * e1), P(b.x + u.x * e2, b.y + u.y * e2)) }
export const circle = (o, r) => `<circle cx="${f(o.x)}" cy="${f(o.y)}" r="${f(r)}" fill="none"/>`
/** Cung tròn tâm o bán kính r, từ điểm p đến điểm q theo cung NGẮN (p, q chỉ cho hướng) */
export const arc = (o, r, p, q) => angleMark(o, p, q, r, 1)
export const poly = (pts) => `<path d="M ${pts.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L ')} Z" fill="none"/>`
/** Tô miền đa giác (không viền) — vẽ TRƯỚC các nét */
export const fill = (pts, color = '#e6ecf5') => `<path d="M ${pts.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L ')} Z" fill="${color}" stroke="none"/>`
/** Tô hình quạt đánh dấu góc pvq (bán kính r) — vẽ TRƯỚC các nét; thường kèm angleMark cùng r để có viền cung */
export function sector(v, p, q, r = 30, color = '#d9dde3') {
  const u1 = unit(sub(p, v)), u2 = unit(sub(q, v)), sweep = (u1.x * u2.y - u1.y * u2.x) > 0 ? 1 : 0
  return `<path d="M ${f(v.x)} ${f(v.y)} L ${f(v.x + u1.x * r)} ${f(v.y + u1.y * r)} A ${r} ${r} 0 0 ${sweep} ${f(v.x + u2.x * r)} ${f(v.y + u2.y * r)} Z" fill="${color}" stroke="none"/>`
}
/** Chữ ĐỨNG (số đo góc, độ dài, "Hình 1"…): 30°, 5 cm, x, 2x + 10° thì dùng num; tên điểm/tia dùng label (nghiêng) */
export const num = (p, t, dx = 0, dy = 0, size = 22) =>
  `<text x="${f(p.x + dx)}" y="${f(p.y + dy)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="${size}">${t}</text>`
/** Như num nhưng cho ẨN SỐ / biểu thức chữ (x, 2y, x + 10°, a): chữ cái tự in nghiêng, số và dấu vẫn đứng */
export const bien = (p, t, dx = 0, dy = 0, size = 24) => num(p, t.replace(/[A-Za-z]+/g, (m) => `<tspan font-style="italic">${m}</tspan>`), dx, dy, size)
/** Ghi số đo t vào TRONG góc pvq, cách đỉnh r px theo tia phân giác. Số đo (65°) dùng angleText; ẩn (x, 2y) dùng angleBien. */
export const angleText = (v, p, q, t, r = 56, size = 22) => { const b = bisector(v, p, q, r); return num(b, t, 0, size * 0.34, size) }
export const angleBien = (v, p, q, t, r = 56, size = 24) => { const b = bisector(v, p, q, r); return bien(b, t, 0, size * 0.34, size) }
/** Nhãn tên điểm p đẩy RA XA điểm `from` (thường là trọng tâm hình) một đoạn d px — khỏi phải dò dx, dy bằng tay */
export function labelOut(p, t, from, d = 24) {
  const v = sub(p, from), l = Math.hypot(v.x, v.y) || 1
  return label(P(p.x + v.x / l * d, p.y + v.y / l * d), t, 0, 9)
}
/** Ghi chữ đứng t cạnh trung điểm đoạn ab, lệch sang phía xa điểm `from` d px (độ dài cạnh: "5 cm", "a") */
export function sideText(a, b, t, from, d = 18, size = 22) {
  const m = mid(a, b), v = sub(foot(from, a, b), from), l = Math.hypot(v.x, v.y) || 1
  return num(P(m.x + v.x / l * d, m.y + v.y / l * d), t, 0, size * 0.34, size)
}
export const trongTam = (pts) => P(pts.reduce((s, p) => s + p.x, 0) / pts.length, pts.reduce((s, p) => s + p.y, 0) / pts.length)

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

// ───────── Xuất hàng loạt: tự tính khung theo các điểm, mở Chrome MỘT lần ─────────
const HANG = []
/** Xếp một hình vào hàng chờ. pts = MỌI điểm của hình (kể cả đầu mút tia/đường kéo dài); khung tự ôm pts + lề (lề dưới rộng hơn cho nhãn đáy). */
export function hinh(ten, pts, body, { pad = 48, padDuoi = 58 } = {}) {
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y)
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad
  const w = Math.ceil(Math.max(...xs) - x0 + pad), h = Math.ceil(Math.max(...ys) - y0 + padDuoi)
  HANG.push({ ten, w, h, svg: svgDoc(w, h, T(f(-x0), f(-y0), Array.isArray(body) ? body.join('') : body)) })
}
/** Ghi mọi hình trong hàng chờ ra <dir>/<ten>.svg + .png (2x). Gọi MỘT lần ở cuối tệp. */
export async function xuatTat(dir) {
  mkdirSync(dir, { recursive: true })
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    const pg = await br.newPage()
    for (const { ten, w, h, svg } of HANG) {
      writeFileSync(`${dir}/${ten}.svg`, svg)
      await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
      await pg.setContent(`<body style="margin:0;background:#fff">${svg}</body>`)
      await pg.screenshot({ path: `${dir}/${ten}.png`, clip: { x: 0, y: 0, width: w, height: h } })
      // app HS hiện hình trong khung hẹp (điện thoại ~360px ngang, cao tối đa 288px): khung to thì CHỮ bị thu nhỏ theo ⇒ giữ hình gọn
      console.log(`✔ ${ten}  ${w}×${h}${h > 420 ? '  ⚠ CAO quá 420px — thu nhỏ toạ độ' : ''}${w > 560 ? '  ⚠ RỘNG quá 560px — thu nhỏ toạ độ (hoặc xếp hình con thành 2 hàng)' : ''}`)
    }
  } finally { await br.close() }
  HANG.length = 0
}

/** Ghi <ten>.svg và <ten>.png (2x) vào thư mục dir */
export async function luu(dir, ten, w, h, svg) {
  mkdirSync(dir, { recursive: true })
  writeFileSync(`${dir}/${ten}.svg`, svg)
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    const pg = await br.newPage()
    await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
    await pg.setContent(`<body style="margin:0;background:#fff">${svg}</body>`)
    await pg.screenshot({ path: `${dir}/${ten}.png`, clip: { x: 0, y: 0, width: w, height: h } })
  } finally { await br.close() }
}
