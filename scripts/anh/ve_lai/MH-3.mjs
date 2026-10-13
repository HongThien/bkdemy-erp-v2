// Vẽ lại hình — gói MH-3 (hình CẤU HÌNH của mô hình MH.041 … MH.048, Luyện · hinh_mo_hinh.anh_cau_hinh). Thùy 13/10.
//   node scripts/anh/ve_lai/MH-3.mjs [<thu_muc_ra>]
// Dùng CHUNG bộ điểm gốc với hình bài toán đã vẽ lại của cùng mô hình (BT-MH042-1 / 043-1 / 044-1 / 046-1 / 047-1 / 048-1).
// Ảnh cũ có gì giữ nấy; điểm dựng bằng ray/mid/inter/bisector, không ước mắt.
import { P, seg, segDash, poly, tick, sector, angleMark, rightAngle, ray, dot, label, num, angleText, lerp, mid, inter, bisector, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/MH-3/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const near = (a, b, eps = 0.5) => Math.abs(a - b) < eps

// ───────── MH.041 — hình thang ABCD (AB // CD), BD là phân giác góc D ─────────
// Ảnh cũ: A trên-trái, B trên-phải, D dưới-trái, C dưới-phải; có đường chéo BD; ba cung đơn (tô nhạt) ở góc ADB, BDC, ABD.
// Dựng: AB = AD (hệ quả của phân giác + song song) nên B = A + (AD, 0) ⇒ BD đúng là phân giác góc ADC.
{
  const L = 152, D = P(0, 0)
  const A = ray(D, 56, L), B = P(A.x + L, A.y), C = P(379, 0)
  ok(near(goc(D, A, B), goc(D, B, C), 0.01), 'BD là phân giác góc D')
  ok(near(A.y, B.y, 1e-9) && near(D.y, C.y, 1e-9), 'AB // CD')
  ok(B.x < C.x && dist(A, B) < dist(D, C), 'AB < CD, B nằm trên C')
  hinh('MH.041', [A, B, C, D], [
    sector(D, A, B, 40), sector(D, B, C, 50), sector(B, A, D, 46),
    poly([A, B, C, D]), seg(B, D),
    angleMark(D, A, B, 40), angleMark(D, B, C, 50), angleMark(B, A, D, 46),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 16, -14), label(B, 'B', 14, -14), label(C, 'C', 16, -4), label(D, 'D', -18, 32)])
}

// ───────── MH.042 — hình thang cân ABCD (AB // CD), O = AD ∩ BC ─────────
// Chung với BT-MH042-1: O đỉnh trên, D dưới-trái, C dưới-phải, A ∈ OD, B ∈ OC (AB // CD). Ảnh cũ chỉ có 4 cạnh + OA, OB (không có đường chéo).
{
  const O = P(0, 0), D = P(-170, 270), C = P(170, 270)
  const A = lerp(O, D, 0.46), B = lerp(O, C, 0.46)
  ok(near(A.y, B.y, 1e-9), 'AB // CD')
  ok(near(dist(A, D), dist(B, C), 1e-6), 'AD = BC (hình thang cân)')
  hinh('MH.042', [O, A, B, C, D], [seg(O, D), seg(O, C), seg(D, C), seg(A, B),
    dot(O), dot(A), dot(B), dot(C), dot(D),
    label(O, 'O', 0, -14), label(A, 'A', -22, 6), label(B, 'B', 22, 6), label(D, 'D', -6, 32), label(C, 'C', 6, 32)])
}

// ───────── MH.043 — tam giác cân ABC (AB = AC), E ∈ AB, D ∈ AC, AD = AE ─────────
// Chung với BT-MH043-1: A=(0,-280), B=(-150,0), C=(150,0). Ảnh cũ: có DE; 2 gạch ở AE, AD; 1 gạch ở EB, DC.
{
  const A = P(0, -280), B = P(-150, 0), C = P(150, 0)
  const E = lerp(A, B, 0.44), D = lerp(A, C, 0.44)
  ok(near(dist(A, B), dist(A, C), 1e-6) && near(dist(A, D), dist(A, E), 1e-6), 'AB = AC, AD = AE')
  hinh('MH.043', [A, B, C, D, E], [seg(A, B), seg(A, C), seg(B, C), seg(D, E),
    tick(A, E, 2), tick(A, D, 2), tick(E, B, 1), tick(D, C, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    label(A, 'A', 0, -14), label(B, 'B', -20, 28), label(C, 'C', 20, 28), label(E, 'E', -22, 6), label(D, 'D', 22, 6)])
}

// ───────── MH.044 — hình thang cân ABCD (AB // CD), E, F trung điểm AB, CD, O = AC ∩ BD ─────────
// Chung với BT-MH044-1: AB = 190, DC = 380, cao 150. Ảnh cũ: 2 đường chéo, EF đi qua O; 2 gạch AE = EB, 3 gạch DF = FC.
{
  const DC = 380, AB = 190, H = 150
  const A = P((DC - AB) / 2, 0), B = P((DC - AB) / 2 + AB, 0), C = P(DC, H), D = P(0, H)
  const O = inter(A, C, B, D), E = mid(A, B), F = mid(D, C)
  ok(near(dist(A, D), dist(B, C), 1e-6) && near(dist(A, C), dist(B, D), 1e-6), 'hình thang cân')
  ok(near(goc(E, A, O), 90, 0.01) && near(goc(F, D, O), 90, 0.01) && near(E.x, F.x, 1e-6), 'EF đi qua O, vuông góc đáy')
  hinh('MH.044', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, F),
    tick(A, E, 2), tick(E, B, 2), tick(D, F, 3), tick(F, C, 3),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(O),
    label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30),
    label(E, 'E', 0, -14), label(F, 'F', 16, -10), label(O, 'O', 46, 8)])
}

// ───────── MH.045 — hai đường thẳng song song xx′, yy′ bị cát tuyến cắt tại A, D ─────────
// Ảnh cũ: xx′ ngang qua A, yy′ ngang qua D (song song thật = cùng nằm ngang), cát tuyến nghiêng 45°, kéo dài hai phía; không số đo, không cung.
{
  const H = 125, A = P(0, 0), D = ray(A, 315, H * Math.SQRT2)
  const tL = P(-125, 0), tR = P(215, 0), bL = P(-125, H), bR = P(215, H)
  const up = ray(A, 135, 70), dn = ray(D, 315, 70)
  ok(near(D.x - A.x, H, 1e-6) && near(D.y - A.y, H, 1e-6), 'cát tuyến 45°')
  hinh('MH.045', [tL, tR, bL, bR, up, dn], [seg(tL, tR), seg(bL, bR), seg(up, dn),
    dot(A), dot(D),
    label(P(-70, 0), 'x', 0, 26), label(P(145, 0), 'x′', 0, 26),
    label(P(D.x - 165, H), 'y', 0, -12), label(P(D.x + 40, H), 'y′', 0, -12),
    label(A, 'A', 17, -14), label(D, 'D', -18, 32)])
}

// ───────── MH.046 — Ax // Cy, A–B–C gãy khúc: xAB = 45°, BCy = 40°; góc ABC tô xám + 1 cung ─────────
// Chung với BT-MH046-1 (hình 02): A=(0,0), AB = 200 hướng −45°, BC = 210 (yCB = 40°); Ax, Cy hướng sang phải. Ảnh cũ KHÔNG ghi 85° ⇒ không ghi.
{
  const A = P(0, 0), B = ray(A, -45, 200)
  const C = P(B.x - 210 * Math.cos(40 * Math.PI / 180), B.y + 210 * Math.sin(40 * Math.PI / 180))
  const X = P(300, 0), Y = P(300, C.y)
  ok(near(goc(A, X, B), 45), 'xAB = 45°')
  ok(near(goc(C, Y, B), 40), 'yCB = 40°')
  hinh('MH.046', [A, B, C, X, Y], [
    sector(B, A, C, 44), seg(A, X), seg(C, Y), seg(A, B), seg(B, C), angleMark(B, A, C, 44),
    dot(A), dot(B), dot(C),
    angleText(A, X, B, '45°', 90), angleText(C, Y, B, '40°', 90),
    label(A, 'A', -24, -6), label(B, 'B', 26, 9), label(C, 'C', -16, 36), label(X, 'x', 0, -12), label(Y, 'y', 0, 34)])
}

// ───────── MH.047 — hình bình hành ABCD, M, N trung điểm AB, CD ─────────
// Chung với BT-MH047-1 (W = 310, lệch 70, cao 190). Ảnh cũ: DM, BN; 1 gạch ở AM = MB và DN = NC.
{
  const W = 310, LECH = 70, H = 190
  const A = P(LECH, 0), B = P(LECH + W, 0), C = P(W, H), D = P(0, H)
  const M = mid(A, B), N = mid(D, C)
  ok(near(dist(A, B), dist(D, C), 1e-6) && near(dist(A, D), dist(B, C), 1e-6) && dist(A, B) !== dist(A, D), 'hình bình hành thường')
  hinh('MH.047', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, M), seg(N, B),
    tick(A, M), tick(M, B), tick(D, N), tick(N, C),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N),
    label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30),
    label(M, 'M', 0, -14), label(N, 'N', 0, 32)])
}

// ───────── MH.048 — hình bình hành ABCD, AM, CN là phân giác góc A, C ─────────
// Chung với BT-MH048-1 (W = 310, lệch 90, cao 175; M ∈ CD, N ∈ AB dựng bằng bisector). Ảnh cũ: AM, CN; 2 cung ở CẢ góc A và CẢ góc C (không tô).
{
  const W = 310, LECH = 90, H = 175
  const A = P(LECH, 0), B = P(LECH + W, 0), C = P(W, H), D = P(0, H)
  const M = inter(A, bisector(A, D, B), D, C)
  const N = inter(C, bisector(C, B, D), A, B)
  ok(near(goc(A, D, M), goc(A, M, B), 0.01) && near(goc(C, B, N), goc(C, N, D), 0.01), 'AM, CN là phân giác')
  ok(M.x > D.x && M.x < C.x && N.x > A.x && N.x < B.x, 'M ∈ CD, N ∈ AB')
  hinh('MH.048', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, M), seg(C, N),
    angleMark(A, B, D, 34, 2), angleMark(C, B, D, 34, 2),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N),
    label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30),
    label(M, 'M', 0, 32), label(N, 'N', 0, -14)])
}

await xuatTat(RA)
