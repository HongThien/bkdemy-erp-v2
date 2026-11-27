// k5-HK1-GK03.mjs — Toán 5 HK1, Giữa kì 3: Câu 3 (T105000000201) tam giác ABC, O thuộc BC, nối AO. Toạ độ đo từ hình sách.
import { P, seg, labelOut, trongTam, lerp, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-GK03.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const col = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
{
  const A = P(20, 171), C = P(270, 171), B = P(102, 2)
  const O = lerp(B, C, 0.395)
  const G = trongTam([A, B, C])
  ok('O thuộc BC, nằm giữa B và C', col(B, C, O) && O.x > B.x && O.x < C.x)
  ok('∠AOC tù', goc(O, A, C) > 90)
  ok('∠AOB nhọn', goc(O, A, B) < 90)
  ok('∠BAC, ∠ABC, ∠ACB nhọn (như sách)', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  ok('∠AOB + ∠AOC = 180°', Math.abs(goc(O, A, B) + goc(O, A, C) - 180) < 1e-6)
  const pts = [A, B, C, O]
  hinh('T105000000201', [A, B, C, O, P(A.x - 22, A.y + 28), P(C.x + 22, C.y + 28), P(B.x, B.y - 30), P(O.x + 28, O.y - 18)], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, O),
    ...pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#222" stroke="none"/>`),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26), labelOut(O, 'O', G, 26),
  ])
}
await xuatTat(dir)
