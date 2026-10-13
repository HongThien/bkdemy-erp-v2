// Vẽ lại hình — gói HH00096-1 (Tam giác cân, Hình 7).
//   node scripts/anh/ve_lai/HH00096-1.mjs [<thu_muc_ra>]
// Tam giác ABC cân tại A dựng ĐỐI XỨNG qua trục đứng (AB = AC đúng), đáy BC nằm ngang phía dưới.
import { P, seg, rightAngle, dot, label, hinh, xuatTat,
  mid, lerp, foot, inter, doiXung, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00096-1/moi'
const ok = (c, m) => console.assert(c, m)

/** Tam giác cân tại A: đáy BC = bc, chiều cao h; A ở (0, 0), đáy ở y = h */
function dung(bc, h) {
  const A = P(0, 0), B = P(-bc / 2, h), C = P(bc / 2, h)
  const D = P(0, h)                                       // chân đường cao = trung điểm BC = chân phân giác
  ok(Math.abs(dist(A, B) - dist(A, C)) < 0.01, 'AB = AC')
  ok(Math.abs(dist(B, D) - dist(C, D)) < 0.01, 'D là trung điểm BC')
  ok(Math.abs(goc(A, B, D) - goc(A, C, D)) < 0.01, 'AD là phân giác góc A')
  ok(Math.abs(goc(D, A, B) - 90) < 0.01, 'AD ⊥ BC')
  return { A, B, C, D }
}

// ── HHC000790 — D = chân phân giác góc A trên BC. Nét: AB, AC, BC, AD.
{
  const { A, B, C, D } = dung(280, 280)
  hinh('HHC000790', [A, B, C, D], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 0, 34),
  ])
}

// ── HHC000791 — như 790 + tia Cx ⊥ BC (nửa mặt phẳng chứa A) + tia Ay ∥ BC (về phía C).
{
  const { A, B, C, D } = dung(250, 250)
  const xEnd = P(C.x, A.y - 55)                           // Cx ⊥ BC: thẳng đứng, đi lên qua phía trên A
  const yEnd = P(A.x + 250, A.y)                          // Ay ∥ BC: nằm ngang, hướng về phía C
  ok(Math.abs(goc(C, B, xEnd) - 90) < 0.01, 'Cx ⊥ BC')
  hinh('HHC000791', [A, B, C, D, xEnd, yEnd], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, xEnd), seg(A, yEnd),
    rightAngle(C, B, xEnd, 14),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -6, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 0, 34),
    label(xEnd, 'x', 16, 6), label(yEnd, 'y', 4, 28),
  ], { pad: 40, padDuoi: 50 })
}

// ── Hình chung (792 … 816): bản trong ảnh cũ — tam giác cân, M trên BC, nét AM. (Ảnh cũ chỉ có A, B, C, M.)
{
  const { A, B, C, D: M } = dung(280, 280)
  const ten = 'HHC000792+HHC000796+HHC000798+HHC000799+HHC000800+HHC000801+HHC000804+HHC000806+HHC000807+HHC000808+HHC000809+HHC000810+HHC000811+HHC000812+HHC000813+HHC000814+HHC000815+HHC000816'
  hinh(ten, [A, B, C, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M),
    dot(A), dot(B), dot(C), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(M, 'M', 0, 34),
  ])
}

// ── HHC000793 — như 791 + K = Ay ∩ Cx, I = trung điểm AC; nét thêm DK (qua I).
{
  const { A, B, C, D } = dung(250, 250)
  const xEnd = P(C.x, A.y - 55)
  const yEnd = P(A.x + 250, A.y)
  const K = inter(A, yEnd, C, xEnd)
  const I = mid(A, C)
  ok(Math.abs(K.x - C.x) < 0.01 && Math.abs(K.y - A.y) < 0.01, 'K = Ay ∩ Cx')
  ok(Math.abs(goc(I, D, K) - 180) < 0.01, 'I nằm trên DK (và là trung điểm DK)')
  ok(Math.abs(dist(I, D) - dist(I, K)) < 0.01, 'ID = IK')
  hinh('HHC000793', [A, B, C, D, K, xEnd, yEnd], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, xEnd), seg(A, yEnd), seg(D, K),
    rightAngle(C, B, xEnd, 14),
    dot(A), dot(B), dot(C), dot(D), dot(K), dot(I),
    label(A, 'A', -14, -12), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 0, 34),
    label(K, 'K', 16, -8), label(I, 'I', 20, 8),
    label(xEnd, 'x', 16, 6), label(yEnd, 'y', 4, 28),
  ], { pad: 40, padDuoi: 50 })
}

// ── HHC000794 — D, E = trung điểm AC, AB. Nét: AB, AC, BC (không có BD, CE như ảnh cũ).
{
  const { A, B, C } = dung(280, 280)
  const D = mid(A, C), E = mid(A, B)
  ok(Math.abs(dist(A, D) - dist(D, C)) < 0.01 && Math.abs(dist(A, E) - dist(E, B)) < 0.01, 'D, E là trung điểm')
  hinh('HHC000794', [A, B, C, D, E], [
    seg(A, B), seg(A, C), seg(B, C),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 22, 0), label(E, 'E', -22, 0),
  ])
}

// ── HHC000795 — D, E = trung điểm AC, AB; D là trung điểm BM, E là trung điểm CN; I = BD ∩ CE.
//    Nét: N–A–M, AB, AC, BC, B–D–M, C–E–N.
{
  const { A, B, C } = dung(210, 210)
  const D = mid(A, C), E = mid(A, B)
  const M = doiXung(B, D), N = doiXung(C, E)
  const I = inter(B, M, C, N)
  ok(Math.abs(M.y - A.y) < 0.01 && Math.abs(N.y - A.y) < 0.01, 'M, A, N thẳng hàng (AM ∥ BC)')
  ok(Math.abs(dist(A, M) - dist(B, C)) < 0.01 && Math.abs(dist(A, N) - dist(B, C)) < 0.01, 'AM = AN = BC')
  hinh('HHC000795', [A, B, C, M, N, D, E, I], [
    seg(N, M), seg(A, B), seg(A, C), seg(B, C), seg(B, M), seg(C, N),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(D), dot(E), dot(I),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8),
    label(M, 'M', 6, -14), label(N, 'N', -6, -14),
    label(D, 'D', 24, 14), label(E, 'E', -24, 14), label(I, 'I', 0, -12),
  ], { pad: 40, padDuoi: 50 })
}

// ── HHC000797 — H = chân phân giác góc A trên BC (đáy); D ∈ tia đối tia BC, E ∈ tia đối tia CB, BD = CE.
//    Nét: AB, AC, AD, AE, AH, đoạn D–E (đáy). Không ghi vuông góc tại H (đề chưa cho).
{
  const BH = 120
  const { A, B, C, D: H } = dung(2 * BH, 240)
  const D = P(B.x - 60, B.y), E = P(C.x + 60, C.y)
  ok(Math.abs(dist(B, D) - dist(C, E)) < 0.01, 'BD = CE')
  ok(D.x < B.x && E.x > C.x, 'D, E nằm ngoài đoạn BC, mỗi bên một phía')
  hinh('HHC000797', [A, D, E, B, C, H], [
    seg(A, B), seg(A, C), seg(A, D), seg(A, E), seg(A, H), seg(D, E),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H),
    label(A, 'A', 0, -14), label(B, 'B', -8, -14), label(C, 'C', 8, 34), label(D, 'D', -16, -10), label(E, 'E', 18, -10), label(H, 'H', 0, 34),
  ])
}

// ── HHC000802 — M = trung điểm BC (chân đường cao), ME ⊥ AB tại E, MF ⊥ AC tại F. Nét: AB, AC, BC, AM, ME, MF.
{
  const { A, B, C, D: M } = dung(260, 260)
  const E = foot(M, A, B), F = foot(M, A, C)
  ok(Math.abs(goc(E, M, A) - 90) < 0.01 && Math.abs(goc(F, M, A) - 90) < 0.01, 'ME ⊥ AB, MF ⊥ AC')
  ok(Math.abs(dist(A, E) - dist(A, F)) < 0.01, 'AE = AF (hệ quả)')
  ok(dist(A, E) < dist(A, B) && dist(A, F) < dist(A, C), 'E ∈ AB, F ∈ AC')
  hinh('HHC000802', [A, B, C, M, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(M, E), seg(M, F),
    rightAngle(E, A, M, 12), rightAngle(F, A, M, 12),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(F),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(M, 'M', 0, 34),
    label(E, 'E', -20, -2), label(F, 'F', 20, -2),
  ])
}

await xuatTat(RA)
