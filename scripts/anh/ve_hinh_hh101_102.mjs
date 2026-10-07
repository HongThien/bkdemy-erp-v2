// ve_hinh_hh101_102.mjs — hình đề cho bài HH00101 (c.g.c) + HH00102 (g.c.g), nhập 07/10 từ "C4. Bài 3" (Word của Thùy).
//   node scripts/anh/ve_hinh_hh101_102.mjs <thu_muc_ra>
// Tên file = mã câu (HHC…); nhiều mã nối bằng '+' = nhiều câu dùng chung 1 hình. Gắn vào DB bằng gan_hinh.mjs.
// Toạ độ đọc từ ảnh gốc rồi CHỈNH CHO KHỚP ĐỀ: hình bình hành dựng đúng (D→C = A→B), cân/đối xứng đúng, O là trung điểm khi đề cho OB=OD…
import { P, seg, tick, angleMark, dot, label, T, svgDoc, luu } from './ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_hh101_102.mjs <thu_muc_ra>'); process.exit(2) }

const diem = (pts) => pts.map(dot).join('')
const nhan = (arr) => arr.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')
const xong = (ten, w, h, body, dx = 0, dy = 0) => luu(dir, ten, w, h, svgDoc(w, h, T(dx, dy, body)))

// 1A — hai tam giác ABC và MNP (không đánh dấu)
{
  const A = P(106, 52), B = P(26, 233), C = P(337, 233), M = P(498, 48), N = P(418, 233), Q = P(733, 233)
  await xong('HHC001912_1A', 780, 290, [seg(A, B), seg(A, C), seg(B, C), seg(M, N), seg(M, Q), seg(N, Q), diem([A, B, C, M, N, Q]),
    nhan([[A, 'A', 0, -14], [B, 'B', -6, 32], [C, 'C', 8, 32], [M, 'M', 0, -14], [N, 'N', -6, 32], [Q, 'P', 8, 32]])].join(''), 15, 25)
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
console.log('Đã vẽ 11 hình vào', dir)
