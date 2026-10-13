// Vẽ lại hình — gói BT-MH058-1 (MH.058 Tam giác vuông - Chân đường cao, Hình 8 · Luyện).
//   node scripts/anh/ve_lai/BT-MH058-1.mjs [<thu_muc_ra>]
import { P, seg, dot, label, labelOut, rightAngle, tick, foot, mid, inter, goc, dist, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH058-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// Dựng chung: ABC vuông tại A (AB : AC = 5 : 7, lệch hẳn), AH ⊥ BC, M trung điểm BC, HD ⊥ AB tại D, HE ⊥ AC tại E
function chung() {
  const k = 50
  const A = P(0, 0), B = P(0, -5 * k), C = P(7 * k, 0)
  const H = foot(A, B, C), M = mid(B, C), D = foot(H, A, B), E = foot(H, A, C)
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, 'A = 90°')
  ok(Math.abs(goc(H, A, C) - 90) < 0.5, 'AH ⊥ BC')
  ok(Math.abs(dist(D, A) - dist(H, E)) < 0.01, 'ADHE hình chữ nhật')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  return { A, B, C, H, M, D, E, G: trongTam([A, B, C]) }
}

// BT.08.058.01 — ADHE là hình chữ nhật. Ảnh cũ thiếu M, AM (có trong giả thiết) → vẽ thêm; thêm ô vuông ở H (AH ⊥ BC cho sẵn)
{
  const { A, B, C, H, M, D, E, G } = chung()
  hinh('BT.08.058.01', [A, B, C, H, M, D, E], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, D), seg(H, E), seg(A, M),
    rightAngle(A, B, C), rightAngle(D, A, H), rightAngle(E, C, H), rightAngle(H, A, C),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(E),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26),
    labelOut(H, 'H', A, 26), labelOut(M, 'M', A, 26), labelOut(D, 'D', H, 26), labelOut(E, 'E', H, 26)])
}

// BT.08.058.02 — AM ⊥ DE (cần đoạn DE; ảnh cũ có gạch BM = MC và hai điểm O = AH ∩ DE, I = AM ∩ DE của lời giải ⇒ giữ như ảnh cũ)
{
  const { A, B, C, H, M, D, E, G } = chung()
  const O = inter(A, H, D, E), I = inter(A, M, D, E)
  hinh('BT.08.058.02', [A, B, C, H, M, D, E], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, D), seg(H, E), seg(A, M), seg(D, E),
    tick(B, M, 2), tick(M, C, 2),
    rightAngle(A, B, C), rightAngle(D, A, H), rightAngle(E, C, H), rightAngle(H, A, C),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(E), dot(O), dot(I), label(O, 'O', -20, 4), label(I, 'I', 6, 30),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26),
    labelOut(H, 'H', A, 26), labelOut(M, 'M', A, 26), labelOut(D, 'D', H, 26), labelOut(E, 'E', H, 26)])
}

await xuatTat(RA)
