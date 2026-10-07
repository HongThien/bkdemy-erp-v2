// ve_hinh_hh101_102.mjs — hình đề cho bài HH00101 (c.g.c) + HH00102 (g.c.g), nhập 07/10 từ "C4. Bài 3" (Word của Thùy).
//   node scripts/anh/ve_hinh_hh101_102.mjs <thu_muc_ra>
// Tên file = mã câu (HHC…); nhiều mã nối bằng '+' = nhiều câu dùng chung 1 hình. Gắn vào DB bằng gan_hinh.mjs.
// Toạ độ đọc từ ảnh gốc rồi CHỈNH CHO KHỚP ĐỀ: hình bình hành dựng đúng (D→C = A→B), cân/đối xứng đúng, O là trung điểm khi đề cho OB=OD…
import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from './ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_hh101_102.mjs <thu_muc_ra>'); process.exit(2) }

const diem = (pts) => pts.map(dot).join('')
const nhan = (arr) => arr.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')
const xong = (ten, w, h, body, dx = 0, dy = 0) => luu(dir, ten, w, h, svgDoc(w, h, T(dx, dy, body)))

// 1A — hai tam giác ABC và MNP (không đánh dấu)
{
  const A = P(106, 52), B = P(26, 233), C = P(337, 233), M = P(498, 48), N = P(418, 233), Q = P(733, 233)
  await xong('HHC001912_1A', 780, 318, [seg(A, B), seg(A, C), seg(B, C), seg(M, N), seg(M, Q), seg(N, Q), diem([A, B, C, M, N, Q]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 32], [C, 'C', 8, 32], [M, 'M', 0, -14], [N, 'N', -6, 32], [Q, 'P', 8, 32]])].join(''), 15, 25)
}
// 7A — hai tam giác ABC và MNP (giống hình 1A)
{
  const A = P(106, 52), B = P(26, 233), C = P(337, 233), M = P(498, 48), N = P(418, 233), Q = P(733, 233)
  await xong('HHC001927_7A', 780, 318, [seg(A, B), seg(A, C), seg(B, C), seg(M, N), seg(M, Q), seg(N, Q), diem([A, B, C, M, N, Q]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 32], [C, 'C', 8, 32], [M, 'M', 0, -14], [N, 'N', -6, 32], [Q, 'P', 8, 32]])].join(''), 15, 25)
}
// 1B + 7B — hai tam giác ABC và A′B′C′ (dùng chung)
{
  const A = P(106, 52), B = P(26, 233), C = P(337, 233), A2 = P(498, 48), B2 = P(418, 233), C2 = P(733, 233)
  await xong('HHC001913+HHC001928_1B', 790, 318, [seg(A, B), seg(A, C), seg(B, C), seg(A2, B2), seg(A2, C2), seg(B2, C2), diem([A, B, C, A2, B2, C2]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 32], [C, 'C', 8, 32], [A2, 'A′', 0, -14], [B2, 'B′', -6, 32], [C2, 'C′', 12, 32]])].join(''), 15, 25)
}
// 2A — AB = AC, ∠BAH = ∠CAH
{
  const A = P(200, 50), B = P(30, 330), C = P(370, 330), H = P(200, 330)
  await xong('HHC001914_2A', 400, 380, [seg(A, B), seg(A, C), seg(B, C), seg(A, H), tick(A, B), tick(A, C),
    angleMark(A, B, H, 34), angleMark(A, H, C, 50), diem([A, B, C, H]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 30], [C, 'C', 6, 30], [H, 'H', 0, 30]])].join(''))
}
// 3A — AB ∥ CD, AB = CD, đường chéo AC
{
  const A = P(138, 28), B = P(512, 28), D = P(18, 320), C = P(392, 320)
  await xong('HHC001916_3A', 560, 385, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), tick(A, B, 1, 0.66), tick(D, C, 1, 0.6), diem([A, B, C, D]),
    nhan([[A, 'A', -2, -14], [B, 'B', 16, -8], [C, 'C', 8, 34], [D, 'D', -8, 34]])].join(''), 15, 18)
}
// 3B — MN ∥ PQ, MN = PQ, đường chéo QN
{
  const M = P(143, 55), N = P(500, 55), Q = P(22, 322), R = P(379, 322)
  await xong('HHC001917_3B', 560, 390, [seg(M, N), seg(N, R), seg(R, Q), seg(Q, M), seg(Q, N), tick(M, N, 1, 0.45), tick(Q, R, 1, 0.58), diem([M, N, Q, R]),
    nhan([[M, 'M', -2, -14], [N, 'N', 16, -8], [Q, 'Q', -8, 34], [R, 'P', 8, 34]])].join(''), 15, 18)
}
// 8A — ∠MAH = ∠NAH (1 cung), ∠AMH = ∠ANH (2 cung); đối xứng qua AH
{
  const A = P(265, 58), M = P(70, 306), N = P(460, 306), H = P(265, 490)
  await xong('HHC001929_8A', 540, 570, [seg(A, M), seg(A, N), seg(M, H), seg(N, H), seg(A, H),
    angleMark(A, M, H, 36), angleMark(A, H, N, 52), angleMark(M, A, H, 34, 2), angleMark(N, A, H, 34, 2), diem([A, M, N, H]),
    nhan([[A, 'A', 0, -14], [M, 'M', -26, 8], [N, 'N', 26, 8], [H, 'H', 0, 38]])].join(''), 20, 22)
}
// 8B — C, D đối xứng qua AB (không đánh dấu; số đo nằm trong đề)
{
  const A = P(45, 155), B = P(560, 155), C = P(185, 56), D = P(185, 254)
  await xong('HHC001930_8B', 610, 320, [seg(A, C), seg(C, B), seg(A, D), seg(D, B), seg(A, B), diem([A, B, C, D]),
    nhan([[A, 'A', -8, 32], [B, 'B', 12, 30], [C, 'C', 0, -14], [D, 'D', 0, 36]])].join(''), 15, 20)
}
// 9A — AB ∥ CD, OB = OD (O là trung điểm AC và BD), chỉ vẽ AB, CD, AC, BD
{
  const A = P(110, 40), B = P(390, 40), D = P(40, 400), C = P(320, 400), O = P(215, 220)
  await xong('HHC001931_9A', 430, 450, [seg(A, B), seg(D, C), seg(A, C), seg(B, D), tick(O, B), tick(O, D), diem([A, B, C, D, O]),
    nhan([[A, 'A', -4, -14], [B, 'B', 4, -14], [C, 'C', 8, 32], [D, 'D', -6, 32], [O, 'O', 20, 8]])].join(''))
}
// 9B — AB ∥ MN, AO = ON; theo g.c.g hình đối xứng qua O: N = 2O−A, M = 2O−B
{
  const A = P(126, 36), B = P(30, 196), O = P(304, 128), N = P(482, 220), M = P(578, 60)
  await xong('HHC001932_9B', 640, 290, [seg(A, B), seg(B, M), seg(A, N), seg(M, N), tick(A, O), tick(O, N), diem([A, M, B, N, O]),
    nhan([[A, 'A', -8, -14], [M, 'M', 16, -8], [B, 'B', -10, 32], [N, 'N', 10, 34], [O, 'O', 6, 30]])].join(''), 20, 25)
}
// 10A — AB ∥ CD, AD ∥ BC (hình bình hành vẽ đúng), đường chéo AC
{
  const A = P(140, 50), B = P(502, 50), D = P(22, 320), C = P(384, 320)
  await xong('HHC001933_10A', 560, 385, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), diem([A, B, C, D]),
    nhan([[A, 'A', -4, -14], [B, 'B', 16, -8], [C, 'C', 8, 34], [D, 'D', -10, 34]])].join(''), 15, 18)
}
// 10B — MN ∥ PQ, MQ ∥ NP, đường chéo NQ
{
  const M = P(138, 57), N = P(497, 57), Q = P(22, 326), R = P(381, 326)
  await xong('HHC001934_10B', 560, 395, [seg(M, N), seg(N, R), seg(R, Q), seg(Q, M), seg(Q, N), diem([M, N, Q, R]),
    nhan([[M, 'M', -4, -14], [N, 'N', 16, -8], [Q, 'Q', -10, 34], [R, 'P', 8, 34]])].join(''), 15, 18)
}
// 11 (11a + 11b dùng chung) — AH là phân giác ∠BAC, KHÔNG ghi AB = AC (đó là đáp án); H chia BC theo đúng tỉ lệ AB/AC
{
  const A = P(252, 58), B = P(33, 395), C = P(475, 395), H = P(253.4, 395)
  await xong('HHC001924+HHC001935_11', 530, 455, [seg(A, B), seg(A, C), seg(B, C), seg(A, H), angleMark(A, B, H, 34), angleMark(A, H, C, 50), diem([A, B, C, H]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 34], [C, 'C', 8, 34], [H, 'H', 0, 36]])].join(''), 15, 18)
}

// ───── Các câu đề dựng bằng lời (Word chỉ có hình trong phần đáp án hoặc không có) — hình dựng theo đúng giả thiết đề ─────
// 2B — MN = MP, MI phân giác, ME = MF (E∈MN, F∈MP)
{
  const M = P(200, 40), N = P(40, 320), Q = P(360, 320), I = P(200, 320)
  const E = P(M.x + 0.45 * (N.x - M.x), M.y + 0.45 * (N.y - M.y)), F = P(M.x + 0.45 * (Q.x - M.x), M.y + 0.45 * (Q.y - M.y))
  await xong('HHC001915_2B', 400, 385, [seg(M, N), seg(M, Q), seg(N, Q), seg(M, I), seg(E, I), seg(F, I),
    tick(M, N, 1, 0.75), tick(M, Q, 1, 0.75), tick(M, E, 2), tick(M, F, 2), angleMark(M, N, I, 34), angleMark(M, I, Q, 50), diem([M, N, Q, I, E, F]),
    nhan([[M, 'M', 0, -14], [N, 'N', -8, 32], [Q, 'P', 8, 32], [I, 'I', 0, 34], [E, 'E', -18, 6], [F, 'F', 18, 6]])].join(''), 15, 25)
}
// 4A — Ot phân giác góc xOy, OA = OB, M ∈ Ot
{
  const O = P(50, 200), X = ray(O, 35, 320), Y = ray(O, -35, 320), Tt = ray(O, 0, 330)
  const A = ray(O, 35, 220), B = ray(O, -35, 220), M = ray(O, 0, 150)
  await xong('HHC001918_4A', 440, 440, [seg(O, X), seg(O, Y), seg(O, Tt), seg(A, B), seg(A, M), seg(B, M), tick(O, A, 1, 0.5), tick(O, B, 1, 0.5),
    angleMark(O, X, Tt, 40), angleMark(O, Tt, Y, 56), diem([O, A, B, M]),
    nhan([[O, 'O', -16, 8], [A, 'A', -8, -14], [B, 'B', -8, 32], [M, 'M', -16, -12], [X, 'x', 14, -6], [Y, 'y', 14, 12], [Tt, 't', 16, 8]])].join(''), 20, 30)
}
// 4B — Om phân giác góc xOy, cung tròn tâm O cắt Ox, Oy tại M, N (OM = ON), H ∈ Om
{
  const O = P(50, 200), X = ray(O, 35, 320), Y = ray(O, -35, 320), Mm = ray(O, 0, 330)
  const M = ray(O, 35, 170), N = ray(O, -35, 170), H = ray(O, 0, 230)
  await xong('HHC001919_4B', 440, 440, [seg(O, X), seg(O, Y), seg(O, Mm), seg(H, M), seg(H, N), angleMark(O, M, N, 170), tick(O, M, 1, 0.5), tick(O, N, 1, 0.5),
    angleMark(O, X, Mm, 40), angleMark(O, Mm, Y, 56), diem([O, M, N, H]),
    nhan([[O, 'O', -16, 8], [M, 'M', -4, -14], [N, 'N', -4, 34], [H, 'H', 8, 30], [X, 'x', 14, -6], [Y, 'y', 14, 12], [Mm, 'm', 16, 8]])].join(''), 20, 30)
}
// 5A — M = 2A−B, N = 2A−C (đối xứng tâm A), H ∈ BC, K ∈ MN với MK = BH (K = 2A−H)
{
  const A = P(300, 170), B = P(160, 290), C = P(420, 290), M = P(440, 50), N = P(180, 50)
  const H = P(238, 290), K = P(2 * A.x - H.x, 2 * A.y - H.y)
  await xong('HHC001920_5A', 600, 385, [seg(B, M), seg(C, N), seg(B, C), seg(N, M), seg(K, H),
    tick(A, B, 1), tick(A, M, 1), tick(A, C, 2), tick(A, N, 2), tick(M, K, 3), tick(B, H, 3), diem([A, B, C, M, N, H, K]),
    nhan([[A, 'A', -18, 8], [B, 'B', -8, 32], [C, 'C', 8, 32], [M, 'M', 14, -8], [N, 'N', -14, -8], [H, 'H', 0, 34], [K, 'K', 0, -14]])].join(''), 20, 30)
}
// 5B — E = 2B−A, F = 2B−C, M ∈ AC, N = 2B−M ∈ FE (AM = NE)
{
  const B = P(300, 160), A = P(160, 50), C = P(430, 90), E = P(2 * B.x - A.x, 2 * B.y - A.y), F = P(2 * B.x - C.x, 2 * B.y - C.y)
  const M = P(A.x + 0.3 * (C.x - A.x), A.y + 0.3 * (C.y - A.y)), N = P(2 * B.x - M.x, 2 * B.y - M.y)
  await xong('HHC001921_5B', 560, 375, [seg(A, E), seg(C, F), seg(A, C), seg(F, E), seg(M, N),
    tick(B, A, 1), tick(B, E, 1), tick(B, C, 2), tick(B, F, 2), tick(A, M, 3, 0.5), tick(N, E, 3, 0.5), diem([A, B, C, E, F, M, N]),
    nhan([[A, 'A', -12, -12], [C, 'C', 14, -4], [E, 'E', 14, 32], [F, 'F', -14, 30], [B, 'B', 14, -12], [M, 'M', 0, -14], [N, 'N', 0, 34]])].join(''), 25, 30)
}
// 6A — AB = AC, M trung điểm BC, H ∈ tia đối BM, K ∈ tia đối CM, BH = CK
{
  const A = P(300, 40), H = P(100, 260), B = P(190, 260), M = P(300, 260), C = P(410, 260), K = P(500, 260)
  await xong('HHC001922_6A', 600, 330, [seg(A, H), seg(A, K), seg(H, K), seg(A, M), tick(A, B, 3), tick(A, C, 3), tick(B, M, 2), tick(M, C, 2), tick(H, B, 1), tick(C, K, 1), diem([A, H, B, M, C, K]),
    nhan([[A, 'A', 0, -14], [H, 'H', -4, 32], [B, 'B', 0, 32], [M, 'M', 0, 32], [C, 'C', 0, 32], [K, 'K', 4, 32]])].join(''), 10, 28)
}
// 6B — AB = AC, H trung điểm BC, E ∈ BH, F ∈ CH, HE = HF
{
  const A = P(300, 40), B = P(160, 260), C = P(440, 260), H = P(300, 260), E = P(250, 260), F = P(350, 260)
  await xong('HHC001923_6B', 600, 330, [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(A, E), seg(A, F), tick(A, B, 3, 0.45), tick(A, C, 3, 0.45), tick(B, H, 2), tick(H, C, 2),
    tick(H, E, 1), tick(H, F, 1), diem([A, B, C, H, E, F]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 32], [C, 'C', 6, 32], [H, 'H', 0, 32], [E, 'E', -4, 32], [F, 'F', 4, 32]])].join(''), 10, 28)
}
// 12 — d đi qua A, d ∥ BC, M ∈ d, AM = BC, M và C cùng phía so với AB (ABCM là hình bình hành vẽ đúng)
{
  const B = P(100, 280), C = P(380, 280), A = P(220, 110), M = P(500, 110)
  await xong('HHC001925_12', 600, 375, [seg(P(40, 110), P(545, 110)), seg(A, B), seg(B, C), seg(C, A), seg(M, C), tick(A, M, 1), tick(B, C, 1), diem([A, B, C, M]),
    nhan([[A, 'A', -10, -14], [M, 'M', 6, -14], [B, 'B', -8, 32], [C, 'C', 8, 32], [P(555, 110), 'd', 14, 8]])].join(''), 10, 28)
}
// 13 — OA = OB, OC = OD, A nằm giữa O và C, B nằm giữa O và D, I = AD ∩ BC
{
  const O = P(60, 230), X = ray(O, 30, 330), Y = ray(O, -30, 330)
  const A = ray(O, 30, 120), B = ray(O, -30, 120), C = ray(O, 30, 260), D = ray(O, -30, 260)
  const t = (230 - A.y) / (D.y - A.y), I = P(A.x + t * (D.x - A.x), 230)
  await xong('HHC001936_13', 410, 460, [seg(O, X), seg(O, Y), seg(A, D), seg(B, C), tick(O, A, 1, 0.5), tick(O, B, 1, 0.5), tick(A, C, 2), tick(B, D, 2), diem([O, A, B, C, D, I]),
    nhan([[O, 'O', -16, 8], [A, 'A', -4, -14], [B, 'B', -4, 34], [C, 'C', 8, -12], [D, 'D', 8, 34], [I, 'I', 14, 28], [X, 'x', 14, -4], [Y, 'y', 14, 14]])].join(''), 20, 28)
}
// 14 — △ABC vuông tại A, M trung điểm AC, D ∈ tia đối MB sao cho MD = MB, đường thẳng qua B ∥ AC cắt tia DC tại N
{
  const A = P(100, 260), C = P(400, 260), B = P(100, 60), M = P(250, 260), D = P(400, 460), N = P(400, 60)
  await xong('HHC001937_14', 480, 540, [seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(C, D), seg(C, N), seg(B, N), rightAngle(A, B, C), tick(A, M, 1, 0.5), tick(M, C, 1, 0.5), tick(B, M, 2, 0.5), tick(M, D, 2, 0.5),
    diem([A, B, C, D, M, N]),
    nhan([[A, 'A', -16, 24], [B, 'B', -12, -12], [C, 'C', 18, 18], [M, 'M', -10, 30], [D, 'D', 14, 30], [N, 'N', 16, -6]])].join(''), 25, 28)
}
// 15 — E trung điểm BC và AD, AH ⊥ BC, H trung điểm AK
{
  const B = P(75, 225), C = P(315, 225), A = P(150, 45), E = P(195, 225), D = P(2 * E.x - A.x, 2 * E.y - A.y), H = P(150, 225), K = P(150, 405)
  await xong('HHC001926_15', 400, 485, [seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(A, K), seg(B, D), seg(C, K), rightAngle(H, A, C),
    tick(B, E, 1), tick(E, C, 1), tick(A, E, 2, 0.5), tick(E, D, 2, 0.5), tick(A, H, 3, 0.5), tick(H, K, 3, 0.5), diem([A, B, C, D, E, H, K]),
    nhan([[A, 'A', -4, -14], [B, 'B', -14, 8], [C, 'C', 16, -2], [E, 'E', 14, -10], [H, 'H', -14, -10], [D, 'D', 12, 32], [K, 'K', -10, 34]])].join(''), 25, 28)
}
// 16 — E trung điểm BC và AD, EI ⊥ AC, EK ⊥ BD (ABDC là hình bình hành vẽ đúng nên AC ∥ BD)
{
  const B = P(75, 225), C = P(315, 225), A = P(135, 60), E = P(195, 225), D = P(2 * E.x - A.x, 2 * E.y - A.y)
  const dd = P(C.x - A.x, C.y - A.y), tt = ((E.x - A.x) * dd.x + (E.y - A.y) * dd.y) / (dd.x ** 2 + dd.y ** 2)
  const I = P(A.x + tt * dd.x, A.y + tt * dd.y), K = P(2 * E.x - I.x, 2 * E.y - I.y)
  await xong('HHC001938_16', 385, 475, [seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(C, D), seg(A, D), seg(I, K), rightAngle(I, E, A), rightAngle(K, E, B),
    tick(B, E, 1), tick(E, C, 1), tick(A, E, 2, 0.5), tick(E, D, 2, 0.5), diem([A, B, C, D, E, I, K]),
    nhan([[A, 'A', -8, -12], [B, 'B', -14, 8], [C, 'C', 16, 4], [E, 'E', -14, -12], [D, 'D', 8, 34], [I, 'I', 16, -6], [K, 'K', -16, 22]])].join(''), 25, 28)
}
console.log('Đã vẽ 26 hình (27 câu) vào', dir)
