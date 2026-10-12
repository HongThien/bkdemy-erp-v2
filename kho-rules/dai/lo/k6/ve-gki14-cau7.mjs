// GKI-14 (Lê Ngọc Hân) Câu 7 — vẽ lại hình "tam giác nào là tam giác đều" đúng tỉ lệ (CEO chốt 10/10: hình scan của đề gốc bị kéo dãn ngang
// ~1,3 lần nên hình a trông không đều). Hình a dựng ĐÚNG ba cạnh bằng nhau; b, c, d giữ dáng như đề gốc và lệch hẳn khỏi tam giác đều.
//   node kho-rules/dai/lo/k6/ve-gki14-cau7.mjs <thư mục img của đề>     → p1c7_ve.png (+ .svg)
import { P, seg, dot, svgDoc, luu } from '../../../../scripts/anh/ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node kho-rules/dai/lo/k6/ve-gki14-cau7.mjs <thư mục img>'); process.exit(2) }
const Y = 250 // đường đáy chung
const dai = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const HINH = [
  { ten: 'a)', d: [P(40, Y), P(220, Y), P(130, Y - 90 * Math.sqrt(3))] },   // đều: cạnh 180, đường cao 90√3
  { ten: 'b)', d: [P(300, Y), P(600, Y), P(360, Y - 140)] },               // ba cạnh khác hẳn nhau
  { ten: 'c)', d: [P(680, Y), P(790, Y), P(735, Y - 195)] },               // cân, đáy ngắn hơn hẳn cạnh bên
  { ten: 'd)', d: [P(880, Y), P(940, Y - 140), P(995, Y - 95)] },          // một cạnh ngắn hơn hẳn hai cạnh kia
]
let body = ''
for (const h of HINH) {
  const [A, B, C] = h.d
  body += seg(A, B) + seg(B, C) + seg(C, A) + dot(A) + dot(B) + dot(C)
  const xGiua = (Math.min(A.x, B.x, C.x) + Math.max(A.x, B.x, C.x)) / 2
  body += `<text x="${xGiua}" y="${Y + 42}" text-anchor="middle" fill="#111" stroke="none" font-family="Arial,Helvetica,sans-serif" font-size="22">${h.ten}</text>`
  console.log(h.ten, 'ba cạnh:', [dai(A, B), dai(B, C), dai(C, A)].map((x) => x.toFixed(1)).join(' · '))
}
await luu(dir, 'p1c7_ve', 1040, 320, svgDoc(1040, 320, body))
console.log('✔ đã vẽ', `${dir}/p1c7_ve.png`)
