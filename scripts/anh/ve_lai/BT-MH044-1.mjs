// Vẽ lại hình — gói BT-MH044-1 (MH.044 Trung điểm cạnh đáy của hình thang cân, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH044-1.mjs [<thu_muc_ra>]
// Quy ước (như ảnh cũ): A trên-trái, B trên-phải, C dưới-phải, D dưới-trái; AB // CD, AB là đáy nhỏ (≈ 1/2 CD).
// Cả 5 hình dùng CHUNG một hình thang cân. O = AC ∩ BD. E, F dựng bằng mid; gạch bằng nhau: 2 gạch cho AE, EB — 3 gạch cho DF, FC.
import { P, seg, tick, dot, label, mid, inter, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH044-1/moi'

// Hình thang cân ABCD: đáy nhỏ AB = 190, đáy lớn DC = 380, cao 150; hai cạnh bên bằng nhau và hai đường chéo bằng nhau (dựng đối xứng)
const DC = 380, AB = 190, H = 150
const A = P((DC - AB) / 2, 0), B = P((DC - AB) / 2 + AB, 0), C = P(DC, H), D = P(0, H)
const O = inter(A, C, B, D)
const E = mid(A, B), F = mid(D, C)
console.assert(Math.abs(dist(A, D) - dist(B, C)) < 1e-6 && Math.abs(dist(A, C) - dist(B, D)) < 1e-6, 'hình thang cân')
console.assert(Math.abs(dist(O, A) - dist(O, B)) < 1e-6 && Math.abs(dist(O, C) - dist(O, D)) < 1e-6, 'OA = OB, OC = OD')
console.assert(Math.abs(goc(E, A, O) - 90) < 0.5 && Math.abs(goc(F, D, O) - 90) < 0.5, 'OE, OF vuông góc đáy')

const khung = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D)]
const tenABCD = [dot(A), dot(B), dot(C), dot(D),
  label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30)]
const tenO = [dot(O), label(O, 'O', 46, 8)]
const gachAB = [tick(A, E, 2), tick(E, B, 2)]
const gachCD = [tick(D, F, 3), tick(F, C, 3)]
const tenE = [dot(E), label(E, 'E', 0, -14)]
const tenF = [dot(F), label(F, 'F', 16, -10)]
const pts = [A, B, C, D]

// BT.08.044.01 — E là trung điểm AB; ảnh cũ có đoạn OE (giữ). Chứng minh OA = OB
// BT.08.044.02 — như trên. Chứng minh OE ⊥ AB (ảnh cũ không có ô vuông góc ⇒ không vẽ)
for (const ten of ['BT.08.044.01', 'BT.08.044.02']) {
  hinh(ten, pts, [...khung, seg(O, E), ...gachAB, ...tenABCD, ...tenE, ...tenO])
}

// BT.08.044.03 — F là trung điểm CD; ảnh cũ có đoạn OF. Chứng minh OC = OD
// BT.08.044.04 — như trên. (Đề ghi "OE ⊥ CD" nhưng hình/đề chỉ có F ⇒ chắc là OF ⊥ CD)
for (const ten of ['BT.08.044.03', 'BT.08.044.04']) {
  hinh(ten, pts, [...khung, seg(O, F), ...gachCD, ...tenABCD, ...tenF, ...tenO])
}

// BT.08.044.05 — E, F là trung điểm AB, CD; ảnh cũ có đoạn EF đi qua O. Chứng minh O, E, F thẳng hàng
hinh('BT.08.044.05', pts, [...khung, seg(E, F), ...gachAB, ...gachCD, ...tenABCD, ...tenE, ...tenF, ...tenO])

await xuatTat(RA)
