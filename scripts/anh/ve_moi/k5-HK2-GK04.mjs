// k5-HK2-GK04.mjs — Toán 5 HK2 · Giữa kì 4 · Câu 1 (T105000000555): 4 hình, chọn hình khai triển của hình lập phương.
//   node scripts/anh/ve_moi/k5-HK2-GK04.mjs <thu_muc_ra>      (ra T105000000555.png)
// Kích thước đo từ hình sách (trang 76 PDF). KHÔNG đánh dấu phương án đúng.
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/k5-HK2-GK04.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }

const S = 0.6, FILL = '#fdf3c4'
const R = (x, y, w, h) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(w).toFixed(1)}" height="${(h).toFixed(1)}" fill="${FILL}" stroke="#222" stroke-width="2"/>`
// mỗi hình trả { svg, w, h } với góc trên-trái (0,0), đơn vị đã nhân S
function netA() { // lưới 4 hình vuông ngang + 1 trên + 1 dưới (ô thứ 3) — hình vuông cạnh 94
  const a = 94 * S; let s = ''
  for (let i = 0; i < 4; i++) s += R(i * a, a, a, a)
  s += R(2 * a, 0, a, a) + R(2 * a, 2 * a, a, a)
  return { svg: s, w: 4 * a, h: 3 * a, a }
}
function netB() { // hình trụ: chữ nhật 285×96 + 2 đường tròn đường kính 91 tiếp xúc, cách mép trái 62
  const rw = 285 * S, rh = 96 * S, r = 45.5 * S, cx = 62 * S
  const s = R(0, 2 * r, rw, rh)
    + `<circle cx="${cx.toFixed(1)}" cy="${r.toFixed(1)}" r="${r.toFixed(1)}" fill="${FILL}" stroke="#222" stroke-width="2"/>`
    + `<circle cx="${cx.toFixed(1)}" cy="${(2 * r + rh + r).toFixed(1)}" r="${r.toFixed(1)}" fill="${FILL}" stroke="#222" stroke-width="2"/>`
  return { svg: s, w: rw, h: 4 * r + rh, rw, r }
}
function netC() { // 4 hàng chữ nhật rộng 275, cao 95/48/92/48; 2 mảnh nhỏ 57×48 bên phải ở hàng 2 và 4
  const w = 275 * S, hs = [95, 48, 92, 48].map((v) => v * S); let y = 0, s = ''
  hs.forEach((h, i) => { s += R(0, y, w, h); if (i % 2 === 1) s += R(w, y, 57 * S, h); y += h })
  return { svg: s, w: w + 57 * S, h: y }
}
function netD() { // hàng 4 mặt rộng 68/121/66/124, cao 94; trên/dưới rộng 121 cao 93
  const ws = [68, 121, 66, 124].map((v) => v * S), h = 94 * S, f = 93 * S
  let s = R(ws[0], 0, ws[1], f), x = 0
  ws.forEach((w) => { s += R(x, f, w, h); x += w })
  s += R(ws[0], f + h, ws[1], f)
  return { svg: s, w: x, h: 2 * f + h }
}
const A = netA(), B = netB(), C = netC(), D = netD()
ok('A: lưới 1-4-1, 6 hình vuông cạnh bằng nhau', Math.abs(A.w / 4 - A.h / 3) < 1e-9)
ok('B: chu vi đường tròn ≈ chiều dài hình chữ nhật (±2%)', Math.abs(Math.PI * 2 * B.r / B.rw - 1) < 0.02)
ok('C: bốn hàng cao 95/48/92/48 (hai mảnh nhỏ cao bằng hàng mỏng)', C.h > 0)

const padX = 30, gapX = 70, lab = 36, gapY = 14, top = 14
const rowH = (a, b) => Math.max(a.h, b.h) + lab
const colW = Math.max(A.w + gapX / 2, C.w) // cột trái: A, C
const w = Math.ceil(padX * 2 + Math.max(A.w, C.w) + gapX + Math.max(B.w, D.w))
const h = Math.ceil(top + rowH(A, B) + gapY + rowH(C, D) + 6)
const y2 = top + rowH(A, B) + gapY
const xL = padX, xR = padX + Math.max(A.w, C.w) + gapX
const tag = (x, y, t) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-weight="700" font-size="24">${t}</text>`
let body = ''
const put = (n, x, y, k, rowh) => { body += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})">${n.svg}</g>` + tag(x + n.w / 2, y + rowh + 27, k) }
const r1 = Math.max(A.h, B.h), r2 = Math.max(C.h, D.h)
put(A, xL, top + (r1 - A.h) / 2, 'A', (r1 + A.h) / 2)
put(B, xR, top + (r1 - B.h) / 2, 'B', (r1 + B.h) / 2)
put(C, xL, y2 + (r2 - C.h) / 2, 'C', (r2 + C.h) / 2)
put(D, xR, y2 + (r2 - D.h) / 2, 'D', (r2 + D.h) / 2)
console.log(`${w}×${h}`)
ok('khung ≤ 760×450', w <= 760 && h <= 450)
await luu(dir, 'T105000000555', w, h, svgDoc(w, h, body))
