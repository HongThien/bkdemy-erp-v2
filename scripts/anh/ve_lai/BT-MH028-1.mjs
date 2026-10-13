// Vẽ lại hình — gói BT-MH028-1 (MH.028 Tứ giác có tổng hai góc đối bằng 180; Hình 8 · Luyện · bài toán)
//   node scripts/anh/ve_lai/BT-MH028-1.mjs [<thu_muc_ra>]
// Đề: tứ giác ABCD, B + D = 180°, CB = CD, Dx là tia đối của tia DA. Dựng: AC là phân giác góc A (hệ quả của đề), B/D lệch (CB = CD nhưng B ≠ D).
import { P, seg, tick, angleMark, sector, ray, dot, label, hinh, xuatTat, lerp, dist, goc } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH028-1/moi'

// Điểm chung của cả chuỗi: A đỉnh, AC phân giác của góc DAB (α = 39° mỗi bên), C ở xa A, D gần A (góc D tù), B xa A (góc B nhọn), CD = CB.
function dung() {
  const S = 290, al = 39
  const A = P(0, 0), dirAC = -69.6
  const C = ray(A, dirAC, S)
  const r = 0.675 * S, H = S * Math.cos(al * Math.PI / 180), d = Math.sqrt(r * r - (S * Math.sin(al * Math.PI / 180)) ** 2)
  const D = ray(A, dirAC - al, H - d), B = ray(A, dirAC + al, H + d)
  console.assert(Math.abs(dist(C, D) - dist(C, B)) < 0.01, 'CD = CB')
  console.assert(Math.abs(goc(B, A, C) + goc(D, A, C) - 180) < 0.01, 'B + D = 180°')
  console.assert(dist(A, D) < dist(A, B) - 40, 'D, B lệch')
  const x = lerp(A, D, 1.55) // Dx: tia đối của tia DA
  return { A, B, C, D, x }
}

function chung({ A, B, C, D, x }, extra = []) {
  return [seg(A, B), seg(B, C), seg(C, D), seg(D, x), seg(A, D), ...extra, tick(C, D, 2), tick(C, B, 2),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', 24, 4), label(C, 'C', 0, 34), label(D, 'D', -24, 4), label(x, 'x', -16, 6)]
}

// BT.08.028.01 — chứng minh CDx = CBA: ảnh cũ có cung ở hai góc này (chỉ ra hai góc cần so) ⇒ giữ như ảnh cũ, không thêm bớt
{
  const p = dung(), { A, B, C, D, x } = p
  hinh('BT.08.028.01', [A, B, C, D, x], [sector(D, C, x, 28), sector(B, C, A, 28), angleMark(D, C, x, 28), angleMark(B, C, A, 28), ...chung(p)])
}

// BT.08.028.02 — chứng minh AC là phân giác góc BAD; giữ cung CDx = CBA như ảnh cũ (kết quả của câu trước), đường AC
{
  const p = dung(), { A, B, C, D, x } = p
  hinh('BT.08.028.02', [A, B, C, D, x], [sector(D, C, x, 28), sector(B, C, A, 28), angleMark(D, C, x, 28), angleMark(B, C, A, 28),
    ...chung(p, [seg(A, C)])])
}

await xuatTat(RA)
