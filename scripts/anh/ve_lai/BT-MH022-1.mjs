// Vẽ lại hình — gói BT-MH022-1 (MH.022 Hình thang cân, Hình 8 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH022-1.mjs [<thu_muc_ra>]
// Hình thang cân ABCD, AB // CD, AB < CD (đáy lớn CD ở dưới). Dựng bằng số đo/độ dài, không ước mắt.
import { P, seg, ray, dot, label, rightAngle, foot, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH022-1/moi'

// Hình thang cân: D, C trên đáy lớn (dài dd); góc nhọn ở D và C = gocDay; chân cạnh bên dài leg
function thang(dd, gocDay, leg) {
  const D = P(0, 0), C = P(dd, 0)
  const A = ray(D, gocDay, leg), B = ray(C, 180 - gocDay, leg)
  console.assert(Math.abs(A.y - B.y) < 1e-6 && Math.abs(dist(A, D) - dist(B, C)) < 1e-6, 'không cân')
  console.assert(Math.abs(goc(D, A, C) - gocDay) < 0.01 && Math.abs(goc(C, B, D) - gocDay) < 0.01)
  console.assert(B.x - A.x > 0, 'AB phải dương (AB < CD)')
  return { A, B, C, D }
}
const tenDinh = ({ A, B, C, D }) => [label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 16, 28), label(D, 'D', -16, 28)]

// BT.08.022.01 — Â = 2Ĉ ⇒ Ĉ = D̂ = 60°, Â = B̂ = 120° (không ghi số đo lên hình: đề hỏi tính)
{
  const t = thang(300, 60, 148), { A, B, C, D } = t
  hinh('BT.08.022.01', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    dot(A), dot(B), dot(C), dot(D), ...tenDinh(t)])
}

// BT.08.022.02 và .03 — thêm đường cao AH, BK (H, K trên CD), ô vuông góc tại H và K (giả thiết cho sẵn)
// (đường AK trên ảnh cũ là đường phụ của lời giải bài .03 — GIỮ như ảnh cũ: vẽ lại không thêm bớt thông tin; góc nhọn ở D, C ≈ 62° như ảnh cũ)
for (const ten of ['BT.08.022.02', 'BT.08.022.03']) {
  const t = thang(330, 62, 180), { A, B, C, D } = t
  const H = foot(A, D, C), K = foot(B, D, C)
  console.assert(Math.abs(goc(H, A, D) - 90) < 0.01 && Math.abs(goc(K, B, C) - 90) < 0.01)
  hinh(ten, [A, B, C, D, H, K], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, H), seg(B, K), seg(A, K),
    rightAngle(H, D, A), rightAngle(K, C, B),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(K), ...tenDinh(t),
    label(H, 'H', 0, 28), label(K, 'K', 0, 28)])
}

await xuatTat(RA)
