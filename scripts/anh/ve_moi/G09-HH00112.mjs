// G09-HH00112.mjs — gói G09 (kho Hình–Học khối 7). Chỉ HHC002089 cần hình (tam giác ABC bất kỳ);
//   HHC002602 / HHC002775 / HHC002776 / HHC002784 / HHC002789 là câu lý thuyết thuần ⇒ KHÔNG CẦN HÌNH.
//   node scripts/anh/ve_moi/G09-HH00112.mjs "<gói>/moi"
import { P, seg, dot, label, hinh, xuatTat, dist, goc } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G09-HH00112.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const pts = (...a) => a.map(dot).join('')

// ── HHC002089: tam giác ABC bất kỳ (định lí tổng ba góc). Hình đề chỉ có tam giác — KHÔNG vẽ xy ∥ BC (đường phụ của lời giải). ──
{
  const A = P(120, 60), B = P(40, 250), C = P(460, 250)
  ok('2089 tam giác không suy biến (A không thuộc BC)', Math.abs(A.y - B.y) > 100)
  const ab = dist(A, B), ac = dist(A, C), bc = dist(B, C)
  ok('2089 tam giác thường: ba cạnh đôi một khác nhau rõ', Math.abs(ab - ac) > 60 && Math.abs(ab - bc) > 60 && Math.abs(ac - bc) > 25)
  const gA = goc(A, B, C), gB = goc(B, A, C), gC = goc(C, A, B)
  ok('2089 không có góc vuông / 60° (tam giác tổng quát)', [gA, gB, gC].every((g) => Math.abs(g - 90) > 5 && Math.abs(g - 60) > 5))
  ok('2089 ba góc tổng 180° (kiểm số)', Math.abs(gA + gB + gC - 180) < 1e-6)
  hinh('HHC002089', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A),
    pts(A, B, C),
    label(A, 'A', -4, -14), label(B, 'B', -18, 18), label(C, 'C', 18, 18),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
