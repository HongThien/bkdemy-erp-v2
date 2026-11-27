// k5-HK1-CK07 — Đề kiểm tra Toán 5 HK1, cuối kì số 7 (sách Qbooks, tr. 36–38)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, seg, dot, label, num, rightAngle, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')

// ── T105000000134: hình bình hành ABCD, AE = EC = 5,4 cm, CD = 9 cm (AF ⊥ DC, CE ⊥ AB) ──
const s = 34
const A = P(3.6 * s, 0), E = P(9 * s, 0), B = P(12.6 * s, 0)
const D = P(0, 5.4 * s), F = P(3.6 * s, 5.4 * s), C = P(9 * s, 5.4 * s)
const ok = (c, m) => { if (!c) throw new Error('SAI: ' + m) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
ok(eq(dist(A, B), 9 * s) && eq(dist(D, C), 9 * s), 'AB = CD = 9')
ok(eq(dist(A, E), 5.4 * s) && eq(dist(E, C), 5.4 * s), 'AE = EC = 5,4')
ok(eq(B.x - C.x, A.x - D.x) && eq(B.y - C.y, A.y - D.y), 'AD ∥ BC (D→A = C→B)')
ok(eq((C.x - E.x) * (A.x - E.x) + (C.y - E.y) * (A.y - E.y), 0), 'CE ⊥ AB')
ok(eq((A.x - F.x) * (C.x - F.x) + (A.y - F.y) * (C.y - F.y), 0), 'AF ⊥ DC')
ok(F.x > D.x && F.x < C.x, 'F nằm trên DC')

const body1 = [
  seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(A, F), seg(C, E),
  rightAngle(E, A, C), rightAngle(F, A, C),
  dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
  label(A, 'A', -4, -14), label(E, 'E', 0, -14), label(B, 'B', 6, -14),
  label(D, 'D', -6, 28), label(F, 'F', 0, 30), label(C, 'C', 8, 30),
]
hinh('T105000000134', [A, B, C, D, E, F], body1)

// ── T105000000135: bảng lượng mưa (ô trống: lượng mưa trung bình) ──
const cw = [92, 88, 88, 88, 146], rh = 52, hh = 62
const xs = [0]; for (const w of cw) xs.push(xs[xs.length - 1] + w)
const Wt = xs[5], Ht = hh + rh * 2
let b2 = ''
b2 += `<rect x="0" y="0" width="${Wt}" height="${Ht}"/>`
for (let i = 1; i < 5; i++) b2 += seg(P(xs[i], 0), P(xs[i], Ht))
b2 += seg(P(0, hh), P(Wt, hh)) + seg(P(0, hh + rh), P(Wt, hh + rh))
const cx = (i) => (xs[i] + xs[i + 1]) / 2
b2 += num(P(cx(1), hh / 2 + 7), 'Đo lần 1', 0, 0, 19)
b2 += num(P(cx(2), hh / 2 + 7), 'Đo lần 2', 0, 0, 19)
b2 += num(P(cx(3), hh / 2 + 7), 'Đo lần 3', 0, 0, 19)
b2 += num(P(cx(4), hh / 2 - 4), 'Lượng mưa', 0, 0, 19) + num(P(cx(4), hh / 2 + 18), 'trung bình', 0, 0, 19)
const hang = [['Tháng Hai', '15,8 mm', '21,3 mm', '11,2 mm'], ['Tháng Ba', '21,4 mm', '29,8 mm', '20,2 mm']]
hang.forEach((r, k) => {
  const yc = hh + rh * k + rh / 2 + 7
  r.forEach((t, i) => { b2 += num(P(cx(i), yc), t, 0, 0, 19) })
  // ô đáp án để trống: chỉ có đơn vị
  b2 += `<rect x="${cx(4) - 58}" y="${hh + rh * k + 11}" width="62" height="30"/>` + num(P(cx(4) + 40, yc), 'mm', 0, 0, 19)
})
hinh('T105000000135', [P(0, 0), P(Wt, Ht)], b2, { pad: 24, padDuoi: 24 })

await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000134', tep: 'T105000000134.png', nguon: 've_lenh', trang_pdf: 37, ghi_chu: 'Hình bình hành ABCD, AE=EC=5,4, CD=9; AF⊥DC, CE⊥AB (đo bằng số: DF=EB=3,6). Không tô màu; giữ ô vuông tại E, F như sách.' },
  { ma_cau: 'T105000000135', tep: 'T105000000135.png', nguon: 've_lenh', trang_pdf: 37, ghi_chu: 'Bảng đo lượng mưa tháng 2, 3; ô Lượng mưa trung bình để trống (chỉ có đơn vị mm).' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([
  { ma_cau: 'T105000000129', ly_do: 'Sách không có hình (đề chữ về tờ giấy tam giác).' },
], null, 1))
