// Vẽ lại hình — gói BT-MH062-1 (MH.062 Tam giác cân, Hình 7 · Luyện).
//   node scripts/anh/ve_lai/BT-MH062-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, dot, label, rightAngle, foot, mid, inter, lerp, doiXung, bisector, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH062-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6 * dist(a, b) * dist(c, d)

// Tam giác cân ABC (AB = AC, đáy BC, A trên, B trái, C phải; chiều cao = 2 × nửa đáy như ảnh cũ — cân hẳn, không đều, không vuông)
// Gốc toạ độ ở chân đường cao D = M (trung điểm BC)
function chung(hb = 100) {
  const H = 2 * hb
  const A = P(0, -H), B = P(-hb, 0), C = P(hb, 0), D = P(0, 0)
  ok(Math.abs(dist(A, B) - dist(A, C)) < 1e-9, 'AB = AC')
  ok(Math.abs(goc(A, B, D) - goc(A, C, D)) < 1e-6, 'AD là phân giác')
  return { A, B, C, D, H, hb }
}
const dd = (...p) => p.map(dot).join('')
const nhanDay = (A, B, C, D) => [label(A, 'A', 0, -14), label(B, 'B', -14, -12), label(C, 'C', 16, -12), label(D, 'D', 0, 36)]

// BT.07.062.01 — AD phân giác góc A (D ∈ BC)
{
  const { A, B, C, D } = chung(140)
  hinh('BT.07.062.01', [A, B, C, D], [seg(A, B), seg(A, C), seg(B, C), seg(A, D), dd(A, B, C, D), nhanDay(A, B, C, D)])
}

// BT.07.062.02 — thêm tia Cx ⊥ BC (nửa mặt phẳng chứa A) và tia Ay ∥ BC; giữ AD như ảnh cũ
{
  const { A, B, C, D, H, hb } = chung(105)
  const x = P(C.x, -H - 0.26 * H), y = P(A.x + 2 * hb, A.y)
  ok(Math.abs(goc(C, x, B) - 90) < 0.01, 'Cx ⊥ BC')
  ok(song2(A, y, B, C), 'Ay ∥ BC')
  hinh('BT.07.062.02', [A, B, C, D, x, y], [seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, x), seg(A, y), dd(A, B, C, D),
    nhanDay(A, B, C, D), label(x, 'x', 18, 8), label(y, 'y', 4, 32)])
}

// BT.07.062.04 — I trung điểm AC, K = Ay ∩ Cx; ảnh cũ có đoạn DK (qua I)
{
  const { A, B, C, D, H, hb } = chung(105)
  const x = P(C.x, -H - 0.26 * H), y = P(A.x + 2 * hb, A.y)
  const K = inter(A, y, C, x), I = mid(A, C)
  ok(dist(I, mid(D, K)) < 1e-6, 'I là trung điểm DK')
  ok(Math.abs(dist(inter(A, C, D, K), I)) < 1e-6, 'DK đi qua I')
  hinh('BT.07.062.04', [A, B, C, D, x, y, K, I], [seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, x), seg(A, y), seg(D, K),
    dd(A, B, C, D, K, I), nhanDay(A, B, C, D), label(K, 'K', 18, -12), label(I, 'I', 20, 8), label(x, 'x', 18, 8), label(y, 'y', 4, 32)])
}

// BT.07.062.05 — D, E trung điểm AC, AB
{
  const { A, B, C } = chung(140)
  const Dm = mid(A, C), E = mid(A, B)
  hinh('BT.07.062.05', [A, B, C, Dm, E], [seg(A, B), seg(A, C), seg(B, C), dd(A, B, C, Dm, E),
    label(A, 'A', 0, -14), label(B, 'B', -14, -12), label(C, 'C', 16, -12), label(Dm, 'D', 20, 2), label(E, 'E', -20, 2)])
}

// BT.07.062.06 — D trung điểm BM, E trung điểm CN (M, N đối xứng B, C qua D, E); BD ∩ CE = I
{
  const { A, B, C } = chung(100)
  const Dm = mid(A, C), E = mid(A, B)
  const M = doiXung(B, Dm), N = doiXung(C, E), I = inter(B, Dm, C, E)
  ok(dist(A, mid(M, N)) < 1e-6, 'A trung điểm MN')
  ok(song2(A, M, B, C) && song2(A, N, B, C), 'MN ∥ BC')
  hinh('BT.07.062.06', [A, B, C, M, N, I], [seg(A, B), seg(A, C), seg(B, C), seg(N, M), seg(B, M), seg(C, N),
    dd(A, B, C, Dm, E, M, N, I),
    label(A, 'A', 0, -14), label(N, 'N', -4, -14), label(M, 'M', 4, -14), label(B, 'B', -16, -6), label(C, 'C', 16, -6),
    label(Dm, 'D', 28, 14), label(E, 'E', -28, 14), label(I, 'I', 4, -14)])
}

// BT.07.062.08 — AH phân giác, D ∈ tia đối BC, E ∈ tia đối CB, BD = CE
{
  const { A, B, C, D: H, hb } = chung(130)
  const Dd = lerp(C, B, 1.25), E2 = lerp(B, C, 1.25) // BD = CE = 0,25·BC
  ok(Math.abs(dist(B, Dd) - dist(C, E2)) < 1e-6, 'BD = CE')
  hinh('BT.07.062.08', [A, B, C, H, Dd, E2], [seg(A, B), seg(A, C), seg(Dd, E2), seg(A, Dd), seg(A, E2), seg(A, H), dd(A, B, C, H, Dd, E2),
    label(A, 'A', 0, -14), label(Dd, 'D', -14, -12), label(B, 'B', -4, -14), label(C, 'C', 4, -14), label(E2, 'E', 14, -12), label(H, 'H', 0, 36)])
}

// BT.07.062.13 — M trung điểm BC, ME ⊥ AB tại E, MF ⊥ AC tại F (ảnh cũ có AM; ô vuông ở E, F vì đề cho ⊥)
function nenEF(hb) {
  const { A, B, C, D: M } = chung(hb)
  const E = foot(M, A, B), F = foot(M, A, C)
  ok(Math.abs(goc(E, A, M) - 90) < 0.01 && Math.abs(goc(F, A, M) - 90) < 0.01, 'ME ⊥ AB, MF ⊥ AC')
  ok(Math.abs(dist(A, E) - dist(A, F)) < 1e-6, 'AE = AF')
  return { A, B, C, M, E, F }
}
{
  const { A, B, C, M, E, F } = nenEF(140)
  hinh('BT.07.062.13', [A, B, C, M, E, F], [seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(M, E), seg(M, F),
    rightAngle(E, A, M), rightAngle(F, A, M), dd(A, B, C, M, E, F),
    label(A, 'A', 0, -14), label(B, 'B', -14, -12), label(C, 'C', 16, -12), label(M, 'M', 0, 36), label(E, 'E', -20, -6), label(F, 'F', 20, -6)])
}

// BT.07.062.14 — K = AM ∩ EF (ảnh cũ có đoạn EF; đề bài này không nêu E, F nên không thêm ô vuông)
{
  const { A, B, C, M, E, F } = nenEF(140)
  const K = inter(A, M, E, F)
  hinh('BT.07.062.14', [A, B, C, M, E, F, K], [seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(M, E), seg(M, F), seg(E, F),
    dd(A, B, C, M, E, F, K),
    label(A, 'A', 0, -14), label(B, 'B', -14, -12), label(C, 'C', 16, -12), label(M, 'M', 0, 36), label(E, 'E', -20, -6), label(F, 'F', 20, -6), label(K, 'K', 16, -12)])
}

await xuatTat(RA)
