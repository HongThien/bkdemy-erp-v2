// k5v-G09.mjs — kho Đại K5 "Diện tích các hình": 10 hình tam giác (xác định / vẽ đường cao). Hình ĐỀ, không vẽ sẵn đáp án.
//   node scripts/anh/ve_moi/k5v-G09.mjs "<thu_muc_goi>\moi"
import { P, seg, segDash, dot, label, rightAngle, foot, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G09.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const S = (x, y, k) => P(x * k, y * k)
const tri = (a, b, c) => [seg(a, b), seg(b, c), seg(c, a)]
const cosA = (v, p, q) => goc(v, p, q)

// T105100401015 — IHK vuông tại K (KH ngang, I trên), IK & HK là hai đường cao (hai cạnh góc vuông)
{
  const k = 0.55, H = S(60, 630, k), K = S(680, 630, k), I = S(680, 135, k)
  ok('015 vuông tại K', Math.abs(goc(K, H, I) - 90) < 1e-6)
  hinh('T105100401015', [H, K, I], [...tri(H, K, I), rightAngle(K, H, I), label(I, 'I', 0, -14), label(H, 'H', -2, 34), label(K, 'K', 4, 34)])
}
// 016 — ABC nhọn, A trên, BC ngang
{
  const k = 0.5, A = S(310, 105, k), B = S(70, 608, k), C = S(795, 608, k)
  ok('016 nhọn thường', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90 && Math.abs(dist(A, B) - dist(A, C)) > 20 && Math.abs(dist(B, A) - dist(B, C)) > 20)
  hinh('T105100401016', [A, B, C], [...tri(A, B, C), label(A, 'A', 0, -14), label(B, 'B', -4, 34), label(C, 'C', 4, 34)])
}
// 017 — ACD, D tù (đường cao từ A rơi ngoài), CD gần ngang
{
  const k = 0.5, C = S(90, 465, k), D = S(675, 448, k), A = S(845, 82, k)
  ok('017 tù tại D', goc(D, C, A) > 90)
  hinh('T105100401017', [C, D, A], [...tri(C, D, A), label(A, 'A', 6, -12), label(C, 'C', -6, 34), label(D, 'D', 4, 34)])
}
// 018 — ABC, AK ⊥ BC (K trên BC)
{
  const k = 0.55, A = S(222, 115, k), B = S(70, 575, k), C = S(690, 575, k), K = foot(A, B, C)
  ok('018 AK ⊥ BC', Math.abs(goc(K, A, C) - 90) < 1e-6 && K.x > B.x && K.x < C.x)
  hinh('T105100401018', [A, B, C], [...tri(A, B, C), seg(A, K), rightAngle(K, A, C, 12), label(A, 'A', 0, -14), label(B, 'B', -4, 34), label(K, 'K', 0, 34), label(C, 'C', 4, 34)])
}
// 019 — CDE tù tại E, CH ⊥ đường thẳng DE (H ngoài đoạn DE, nét đứt kéo dài)
{
  const k = 0.46, y = 768, D = S(60, y, k), E = S(560, y, k), H = S(710, y, k), C = S(710, 135, k), X = S(905, y, k)
  ok('019 E giữa D và H, tù tại E', E.x > D.x && E.x < H.x && goc(E, D, C) > 90)
  hinh('T105100401019', [D, E, C, X], [...tri(D, E, C), segDash(E, X), seg(C, H), rightAngle(H, C, X, 12), label(C, 'C', 16, -4), label(D, 'D', -4, 34), label(E, 'E', -4, 34), label(H, 'H', 6, 34)])
}
// 020 — tam giác BFA, K ∈ BF, AK ⊥ BF
{
  const k = 0.5, F = S(65, 750, k), A = S(950, 750, k), B = S(360, 170, k), K = foot(A, F, B)
  ok('020 K trong đoạn FB, AK ⊥ FB', Math.abs(goc(K, A, B) - 90) < 1e-6 && K.y < F.y && K.y > B.y)
  hinh('T105100401020', [F, A, B, K], [...tri(F, A, B), seg(A, K), rightAngle(K, B, A, 12), label(B, 'B', 4, -14), label(K, 'K', -22, 8), label(F, 'F', -4, 34), label(A, 'A', 4, 34)])
}
// 021 — STM vuông tại M, SM ⊥ TM
{
  const k = 1.9, T = S(10, 185, k), M = S(195, 185, k), Sx = S(195, 40, k)
  ok('021 vuông tại M', Math.abs(goc(M, T, Sx) - 90) < 1e-6)
  hinh('T105100401021', [T, M, Sx], [...tri(T, M, Sx), rightAngle(M, T, Sx), label(Sx, 'S', 0, -14), label(T, 'T', -2, 34), label(M, 'M', 4, 34)])
}
// 022 — ABC (A tù), C trên-trái
{
  const k = 0.5, A = S(348, 677, k), B = S(775, 677, k), C = S(112, 55, k)
  ok('022 tù tại A', goc(A, B, C) > 90)
  hinh('T105100401022', [A, B, C], [...tri(A, B, C), label(C, 'C', -20, 4), label(A, 'A', -6, 34), label(B, 'B', 6, 34)])
}
// 023 — IJK nhọn, I trên, JK ngang
{
  const k = 0.5, I = S(290, 105, k), J = S(45, 562, k), K = S(780, 562, k)
  ok('023 nhọn thường', goc(I, J, K) < 90 && goc(J, I, K) < 90 && goc(K, I, J) < 90 && Math.abs(dist(I, J) - dist(I, K)) > 20)
  hinh('T105100401023', [I, J, K], [...tri(I, J, K), label(I, 'I', 0, -14), label(J, 'J', -4, 34), label(K, 'K', 4, 34)])
}
// 024 — STU (T tù), S trên-trái
{
  const k = 0.5, Sx = S(105, 48, k), T = S(308, 584, k), U = S(678, 584, k)
  ok('024 tù tại T', goc(T, Sx, U) > 90)
  hinh('T105100401024', [Sx, T, U], [...tri(Sx, T, U), label(Sx, 'S', -20, 4), label(T, 'T', -4, 34), label(U, 'U', 6, 34)])
}
await xuatTat(dir)
