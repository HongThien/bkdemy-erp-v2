// ve_hinh_lib.mjs — bộ vẽ HÌNH HỌC PHẲNG bằng code (SVG → PNG 2x qua Chrome headless).
// Dùng cho hình đề bài lớp 6–9 khi ảnh gốc mờ/xấu. Hình hình học vẽ bằng code thì nhãn điểm, gạch bằng nhau, cung góc luôn đúng
// (ChatGPT/ảnh AI hay vẽ sai nhãn). Chrome: biến CHROME_PATH hoặc đường mặc định Windows.
//   import { seg, tick, angleMark, dot, label, T, svgDoc, luu } from './ve_hinh_lib.mjs'
//   Toạ độ: gốc trên-trái, y hướng xuống (như ảnh). Hình PHẢI khớp dữ kiện đề (đối xứng/song song/bằng nhau dựng đúng, không ước mắt).
import { mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y })
const unit = (v) => { const l = Math.hypot(v.x, v.y); return { x: v.x / l, y: v.y / l } }
const f = (n) => Math.round(n * 100) / 100

export const P = (x, y) => ({ x, y })
export const seg = (a, b) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"/>`

/** n gạch bằng nhau tại vị trí t (0..1) dọc đoạn a→b */
export function tick(a, b, n = 1, t = 0.5) {
  const d = unit(sub(b, a)); const nr = { x: -d.y, y: d.x }
  const m = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
  let s = ''
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * 7
    const c = { x: m.x + d.x * off, y: m.y + d.y * off }
    s += `<line x1="${f(c.x - nr.x * 7)}" y1="${f(c.y - nr.y * 7)}" x2="${f(c.x + nr.x * 7)}" y2="${f(c.y + nr.y * 7)}"/>`
  }
  return s
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

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

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
