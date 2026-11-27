// k5v-G30.mjs — T1050000001211: hộp chữ nhật đáy vuông 8, cao 16; Hình 1 đứng (nước cao 8), Hình 2 nằm (? cm).
//   node scripts/anh/ve_moi/k5v-G30.mjs "<thu_muc_moi>"
import { P, seg, poly, fill, num, svgDoc, luu } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G30.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }

const U = 14                       // px / cm
const D = P(50, -34)               // véc-tơ độ sâu 8 cm (chiếu xiên)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const BASE = 300
const NUOC = ['#c7e3f6', '#e3f1fb', '#a6cdea'] // mặt trước, mặt trên, mặt bên

function hop(x0, w, h, hn) {       // w,h,hn: cm (rộng, cao, cao nước); trả về { body, pts }
  const W = w * U, H = h * U, N = hn * U
  const A = P(x0, BASE), B = P(x0 + W, BASE), C = P(x0 + W, BASE - H), E = P(x0, BASE - H)
  const A2 = add(A, D), B2 = add(B, D), C2 = add(C, D), E2 = add(E, D)
  const a = P(x0, BASE - N), b = P(x0 + W, BASE - N), a2 = add(a, D), b2 = add(b, D)
  const body = [
    fill([A, B, b, a], NUOC[0]), fill([a, b, b2, a2], NUOC[1]), fill([B, B2, b2, b], NUOC[2]),
    poly([A, B, C, E]), poly([E, C, C2, E2]), poly([B, B2, C2, C]),
    seg(A, B), seg(B, B2), seg(A, A2), seg(A2, B2), seg(E2, A2) ,
  ].join('')
  return { body, A, B, C, E, B2, C2, E2, a, b, a2, b2 }
}

const h1 = hop(100, 8, 16, 8)
const h2 = hop(420, 16, 8, 4)
ok('H1: đáy vuông 8×8, cao 16 (96·… tỉ lệ 112:112:224)', (h1.B.x - h1.A.x) === 112 && (h1.B2.x - h1.B.x) === 50 && (h1.B.y - h1.C.y) === 224)
ok('H1: nước cao đúng nửa hộp (8/16)', (h1.B.y - h1.b.y) * 2 === (h1.B.y - h1.C.y))
ok('H2: đáy 16×8, cao 8; nước cao 4 cm = ½ hộp (thể tích nước 512 = 8·8·8 = 16·8·4)', (h2.B.x - h2.A.x) === 224 && (h2.B.y - h2.C.y) === 112 && (h2.B.y - h2.b.y) === 56 && 8 * 8 * 8 === 16 * 8 * 4)

// mũi tên hai đầu thẳng đứng
function mui(x, y1, y2) {
  const s = (y, d) => `<path d="M ${x - 4} ${y + d * 9} L ${x} ${y} L ${x + 4} ${y + d * 9}" fill="none"/>`
  return seg(P(x, y1), P(x, y2)) + s(y1, 1) + s(y2, -1)
}
const xa = 82, xb = 402
const y1 = h1.C.y, ym = h1.b.y, y0 = BASE
const body = [
  h1.body, h2.body,
  mui(xa, y1, ym), mui(xa, ym, y0),
  num(P(40, 0), '8 cm', 0, (y1 + ym) / 2 + 8), num(P(40, 0), '8 cm', 0, (ym + y0) / 2 + 8),
  mui(xb, h2.b.y, y0), num(P(362, 0), '? cm', 0, (h2.b.y + y0) / 2 + 8),
  num(P(h1.B.x + 80, 0), '8 cm', 0, BASE - 10),
  num(P((h1.A.x + h1.B.x) / 2, 0), '8 cm', 0, BASE + 30),
  num(P((h1.A.x + h1.B.x) / 2 + 25, 0), 'Hình 1', 0, BASE + 66, 24),
  num(P((h2.A.x + h2.B.x) / 2 + 25, 0), 'Hình 2', 0, BASE + 66, 24),
].join('')
// độ sâu 8 cm của Hình 1 nằm gần cạnh sâu bên phải: đặt chữ ngoài hộp
const W = 730, H = 380
await luu(dir, 'T1050000001211', W, H, svgDoc(W, H, body))
console.log('✔ T1050000001211', W + '×' + H)
