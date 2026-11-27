// k5-HK1-CK12 — Đề kiểm tra Toán 5 HK1, cuối kì số 12 (sách Qbooks, tr. 51–53)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, seg, dot, label, num, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')
const ok = (c, m) => { if (!c) throw new Error('SAI: ' + m) }

// T105000000462: tam giác ABC trên lưới ô vuông 1 cm (lưới 8 cột × 7 hàng); đọc từ sách:
// A(3,1) B(1,6) C(7,6) H(3,6) tính theo ô: BH=2, HC=4, AH=5 ⇒ S = 15 cm².
const c = 36
const pt = (x, y) => P(x * c, y * c)
const A = pt(3, 1), B = pt(1, 6), C = pt(7, 6), H = pt(3, 6)
ok(dist(B, H) === 2 * c && dist(H, C) === 4 * c && dist(A, H) === 5 * c, 'BH=2, HC=4, AH=5 ô')
ok(dist(B, C) * dist(A, H) / 2 / (c * c) === 15, 'S = 15 cm²')
let g = ''
const grid = (a, b) => `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#9db4cc" stroke-width="1"/>`
for (let i = 0; i <= 8; i++) g += grid(pt(i, 0), pt(i, 7))
for (let j = 0; j <= 7; j++) g += grid(pt(0, j), pt(8, j))
const ax = 8 * c + 16
const arrow =
  seg(P(ax, 0), P(ax, c)) +
  `<path d="M ${ax - 4} 9 L ${ax} 0 L ${ax + 4} 9 M ${ax - 4} ${c - 9} L ${ax} ${c} L ${ax + 4} ${c - 9}"/>` +
  num(P(ax + 38, c / 2 + 7), '1 cm', 0, 0, 20)
const body = [
  g, seg(A, B), seg(A, C), seg(B, C), seg(A, H),
  label(A, 'A', 0, -12), label(B, 'B', -16, 6), label(C, 'C', 18, 8), label(H, 'H', 0, 34),
  arrow,
]
hinh('T105000000462', [P(0, 0), pt(8, 7), P(ax + 70, 0)], body, { pad: 24, padDuoi: 24 })
await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000462', tep: 'T105000000462.png', nguon: 've_lenh', trang_pdf: 51, ghi_chu: 'Lưới ô vuông 8x7, tam giác ABC với đường cao AH (như sách; BH=2, HC=4, AH=5 ô), ghi chú 1 cm bên phải. Không tô màu; không vẽ sẵn diện tích.' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([
  { ma_cau: 'T105000000463', ly_do: 'Sách không có hình hồ (chữ).' },
], null, 1))
