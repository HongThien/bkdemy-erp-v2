import { txt, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const d = 56, r = d / 2, H = 64
const L = Math.round(Math.PI * d)   // chu vi đáy = π·d ≈ 176 (hình chữ nhật dài = chu vi đường tròn)
if (Math.abs(L - Math.PI * d) > 1) throw new Error('L khác π·d')
const rect = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" stroke="#222" stroke-width="2" fill="#fff"/>`
const circ = (x, y) => `<circle cx="${x}" cy="${y}" r="${r}" stroke="#222" stroke-width="2" fill="#fff"/>`
const lab = (x, y, t) => txt(x, y, t, 22, 'middle', 'font-weight="bold"')
const row1 = 2 * d + H            // chiều cao hình B = hàng 1
const x1 = 20, x2 = x1 + (2 * d + L) + 50
const y2 = 10 + row1 + 52         // đầu hàng 2
let b = ''
// A: hai hình tròn ở hai đầu NGẮN của hình chữ nhật
const ay = 10 + (row1 - H) / 2
b += circ(x1 + r, ay + H / 2) + rect(x1 + d, ay, L, H) + circ(x1 + d + L + r, ay + H / 2)
b += lab(x1 + (2 * d + L) / 2, ay + H + 28, 'A.')
// B: hai hình tròn ở hai cạnh DÀI (trên, dưới)
b += circ(x2 + 54, 10 + r) + rect(x2, 10 + d, L, H) + circ(x2 + 54, 10 + d + H + r)
b += lab(x2 + L / 2, 10 + row1 + 28, 'B.')
// C: cả hai hình tròn cùng ở cạnh dài trên
b += circ(x1 + 36, y2 + r) + circ(x1 + L - 36, y2 + r) + rect(x1, y2 + d, L, H)
b += lab(x1 + L / 2, y2 + d + H + 28, 'C.')
// D: một hình tròn ở cạnh dài trên, một ở đầu ngắn bên phải
b += circ(x2 + 36, y2 + r) + rect(x2, y2 + d, L, H) + circ(x2 + L + r, y2 + d + H / 2)
b += lab(x2 + (L + d) / 2, y2 + d + H + 28, 'D.')
const W = x2 + L + d + 20, Hh = y2 + d + H + 28 + 36
await ra(OUT, 'T105000000581', W, Hh, b)
baoCao(OUT, [{ ma_cau: 'T105000000581', tep: 'T105000000581.png', nguon: 've_lenh', trang_pdf: 103, ghi_chu: 'Bốn hình khai triển A–D xếp 2×2; hình chữ nhật dài = chu vi đường tròn (π·d); bố cục từng phương án theo sách (A: tròn ở hai đầu ngắn; B: tròn trên và dưới; C: hai tròn cùng cạnh trên; D: một tròn trên, một tròn bên phải)' }], [])
