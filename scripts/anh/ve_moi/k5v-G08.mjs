// k5v-G08.mjs — Toán 5, "Nhận diện các loại tam giác, đường cao": vẽ lại 9 hình (T105100401005, 007–014). 006 (cờ đuôi nheo) không vẽ.
//   node scripts/anh/ve_moi/k5v-G08.mjs "<thư mục>/moi"
import { P, seg, dot, label, hinh, xuatTat, labelOut, trongTam, foot, rightAngle, segDash, goc, dist } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G08.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const sc = (pts, k) => pts.map(([x, y]) => P(x * k, y * k))
const dotv = (o, a, b) => (a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)
const nhon = (a, b, c) => goc(a, b, c) < 89 && goc(b, a, c) < 89 && goc(c, a, b) < 89

// tam giác thường: tên đỉnh + toạ độ; nhãn đẩy ra ngoài
function tam(ma, ten, pts, them = [], dung = []) {
  const [A, B, C] = pts, G = trongTam(pts)
  const body = [seg(A, B), seg(B, C), seg(C, A), ...pts.map(dot), ...pts.map((p, i) => labelOut(p, ten[i], G, 26)), ...them]
  hinh(ma, [...pts, ...dung], body)
}

// 005 — tam giác IHK vuông tại K (HK ngang, IK đứng); đề hỏi loại tam giác ⇒ KHÔNG ô vuông
{
  const [H, K, I] = sc([[100, 745], [825, 745], [825, 170]], 0.4)
  ok('005 vuông tại K', Math.abs(dotv(K, H, I)) < 1e-6)
  tam('T105100401005', ['H', 'K', 'I'], [H, K, I])
}
// 007 — tam giác IJK nhọn thường
{
  const [J, I, K] = sc([[45, 263], [127, 57], [373, 263]], 1)
  ok('007 nhọn', nhon(I, J, K))
  tam('T105100401007', ['J', 'I', 'K'], [J, I, K])
}
// 008 — tam giác ACD tù tại D (như ảnh cũ)
{
  const [C, D, A] = sc([[65, 708], [540, 715], [680, 115]], 0.5)
  ok('008 tù tại D', dotv(D, C, A) < 0)
  tam('T105100401008', ['C', 'D', 'A'], [C, D, A])
}
// 009 — tam giác MBN vuông tại N (MN ngang, BN đứng); không ô vuông
{
  const [M, N, B] = sc([[55, 718], [780, 718], [780, 145]], 0.4)
  ok('009 vuông tại N', Math.abs(dotv(N, M, B)) < 1e-6)
  tam('T105100401009', ['M', 'N', 'B'], [M, N, B])
}
// 010 — tam giác HKI nhọn, lệch (K trên, HI ngang)
{
  const H = P(0, 235), I = P(300, 235), K = P(120, 0)
  ok('010 nhọn, 3 cạnh khác nhau', nhon(H, K, I) && Math.abs(dist(K, H) - dist(K, I)) > 15 && Math.abs(dist(K, I) - dist(H, I)) > 3)
  tam('T105100401010', ['H', 'I', 'K'], [H, I, K])
}
// 011 — tam giác STU nhọn (S trên, TU ngang)
{
  const [S, T, U] = sc([[340, 170], [60, 725], [905, 725]], 0.4)
  ok('011 nhọn', nhon(S, T, U))
  tam('T105100401011', ['S', 'T', 'U'], [S, T, U])
}
// 012 — tam giác ABC nhọn lệch, đường cao AH ⊥ BC (ô vuông tại H)
{
  const B = P(0, 235), C = P(300, 235), A = P(110, 0)
  const H = foot(A, B, C)
  ok('012 nhọn', nhon(A, B, C)); ok('012 H nằm giữa B,C', H.x > B.x && H.x < C.x); ok('012 không cân', Math.abs(dist(A, B) - dist(A, C)) > 30)
  ok('012 AH ⊥ BC', Math.abs(dotv(H, A, C)) < 1e-6)
  const G = trongTam([A, B, C])
  hinh('T105100401012', [A, B, C, H], [seg(A, B), seg(B, C), seg(C, A), seg(A, H), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26), label(H, 'H', 0, 34)])
}
// 013 — tam giác MNP tù tại P; đường cao MS ⊥ đường thẳng NP, S nằm ngoài NP (nét đứt P–S)
{
  const k = 0.9
  const N = P(40 * k, 315 * k), Pp = P(250 * k, 315 * k), M = P(312 * k, 58 * k), S = P(312 * k, 315 * k)
  ok('013 tù tại P', dotv(Pp, N, M) < 0)
  ok('013 S ngoài đoạn NP, MS ⊥ NP', S.x > Pp.x && Math.abs(dotv(S, M, N)) < 1e-6)
  const G = trongTam([M, N, Pp])
  hinh('T105100401013', [M, N, Pp, S], [seg(M, N), seg(N, Pp), seg(Pp, M), seg(M, S), segDash(Pp, S), rightAngle(S, M, Pp, 14),
    dot(M), dot(N), dot(Pp), dot(S), labelOut(M, 'M', G, 26), labelOut(N, 'N', G, 26), label(Pp, 'P', -4, 34), label(S, 'S', 0, 34)])
}
// 014 — tam giác EFG nhọn; FT ⊥ EG (T ∈ EG), GJ ⊥ EF (J ∈ EF); không đặt tên giao điểm hai đường cao (đề không nêu)
{
  const [E, F, G] = sc([[345, 150], [70, 690], [885, 690]], 0.5)
  const T = foot(F, E, G), J = foot(G, E, F)
  ok('014 nhọn', nhon(E, F, G))
  ok('014 T, J nằm trong cạnh', T.y > E.y && T.y < G.y && J.y > E.y && J.y < F.y)
  ok('014 FT ⊥ EG', Math.abs(dotv(T, F, E)) < 1e-6); ok('014 GJ ⊥ EF', Math.abs(dotv(J, G, E)) < 1e-6)
  const C = trongTam([E, F, G])
  hinh('T105100401014', [E, F, G, T, J], [seg(E, F), seg(F, G), seg(G, E), seg(F, T), seg(G, J), rightAngle(T, E, F, 13), rightAngle(J, E, G, 13),
    dot(E), dot(F), dot(G), dot(T), dot(J), labelOut(E, 'E', C, 26), labelOut(F, 'F', C, 26), labelOut(G, 'G', C, 26), labelOut(T, 'T', C, 22), labelOut(J, 'J', C, 22)])
}
await xuatTat(dir)
