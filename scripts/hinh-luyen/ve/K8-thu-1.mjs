// Gói vẽ HÌNH THEO Ý — lô thử K8-thu-1 (4 bài lớp 8). Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-thu-1.mjs [<thư mục ra>]
// HLB… = hình giả thiết chung · HLY… = hình của ý có dựng thêm (ý không dựng thêm ⇒ không có tệp, màn dùng hình phía trước).
import { P, seg, tick, rightAngle, dot, label, hinh, xuatTat, mid, foot, inter, doiXung, lineExt, dist, goc } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-thu-1/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5

// ───── HLB00103 (gốc HHC002401): △ABC vuông tại A, AB < AC, trung tuyến AM; MN ⊥ AC tại N, MP ⊥ AB tại P ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const M = mid(B, C), N = foot(M, A, C), P_ = foot(M, A, B)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(M, N), seg(M, P_),
    rightAngle(A, B, C, 14), rightAngle(N, M, C, 12), rightAngle(P_, M, B, 12),
    tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(P_),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(M, 'M', 10, -12),
    label(N, 'N', 0, 26), label(P_, 'P', -16, -12),
  ]
  hinh('HLB00103', [A, B, C], [...nen, ...nhan])
  // ý c (HLY00265): Q trên tia đối của tia NM, N là trung điểm MQ; K trên tia đối của tia PM, P là trung điểm MK. KHÔNG nối QK (điều phải chứng minh).
  const Q = doiXung(M, N), K = doiXung(M, P_)
  ok(gan(dist(N, Q), dist(N, M)), 'N trung điểm MQ'); ok(gan(dist(P_, K), dist(P_, M)), 'P trung điểm MK')
  hinh('HLY00265', [A, B, C, Q, K], [
    ...nen, seg(N, Q), seg(P_, K), tick(M, N, 2), tick(N, Q, 2), tick(M, P_, 3), tick(P_, K, 3),
    ...nhan, dot(Q), dot(K), label(Q, 'Q', 0, 26), label(K, 'K', -22, 6),
  ])
}

// ───── HLB00152 (gốc HHC002574): △ABC vuông tại A, M trung điểm BC; D, E là hình chiếu của M trên AB, AC ─────
{
  const A = P(0, 0), B = P(0, -220), C = P(330, 0)
  const M = mid(B, C), D = foot(M, A, B), E = foot(M, A, C)
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(M, D), seg(M, E),
    rightAngle(A, B, C, 14), rightAngle(D, M, B, 12), rightAngle(E, M, C, 12),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(M, 'M', 10, -12),
    label(D, 'D', -22, 6), label(E, 'E', 0, 26),
  ]
  hinh('HLB00152', [A, B, C], [...nen, tick(B, M, 1), tick(M, C, 1), ...nhan])
  // ý b (HLY00371): câu hỏi nhắc DE ⇒ nối DE
  hinh('HLY00371', [A, B, C], [...nen, seg(D, E), tick(B, M, 1), tick(M, C, 1), ...nhan])
  // ý c (HLY00372): P trung điểm BM, Q trung điểm MC ⇒ BC chia 4 phần bằng nhau; nối DP, EQ (KHÔNG đánh dấu song song — điều phải chứng minh)
  const P_ = mid(B, M), Q = mid(M, C)
  hinh('HLY00372', [A, B, C], [
    ...nen, seg(D, E), seg(D, P_), seg(E, Q),
    tick(B, P_, 1), tick(P_, M, 1), tick(M, Q, 1), tick(Q, C, 1),
    ...nhan, dot(P_), dot(Q), label(P_, 'P', 12, -10), label(Q, 'Q', 12, -10),
  ])
  // ý d: tứ giác DPQE đã đủ cạnh ở hình ý c ⇒ không vẽ thêm
}

// ───── HLB00096 (gốc HHC002386): hình bình hành ABCD (AB > BC); E, K trung điểm CD, AB; BD cắt AC tại O ─────
{
  const A = P(0, 0), B = P(300, 0), D = P(90, -170), C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  const K = mid(A, B), E = mid(C, D), O = inter(A, C, B, D)
  ok(dist(A, B) > dist(B, C), 'AB > BC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    tick(A, K, 1), tick(K, B, 1), tick(D, E, 2), tick(E, C, 2),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(D), dot(K), dot(E), dot(O),
    label(A, 'A', -16, 20), label(B, 'B', 16, 20), label(C, 'C', 16, -6), label(D, 'D', -16, -6),
    label(K, 'K', 0, 26), label(E, 'E', 0, -14), label(O, 'O', 0, -14),
  ]
  hinh('HLB00096', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00242): tứ giác AECK ⇒ nối AE, CK
  hinh('HLY00242', [A, B, C, D], [...nen, seg(A, E), seg(C, K), ...nhan])
  // ý b: chứng minh E, O, K thẳng hàng ⇒ KHÔNG nối EK; không dựng thêm gì ⇒ dùng hình ý a
}

// ───── HLB00151 (gốc HHC002564): △ABC vuông tại A (AB > AC), đường cao AH; HN ⊥ AB tại N, HM ⊥ AC tại M; MN cắt AH tại O ─────
{
  const A = P(0, 0), B = P(340, 0), C = P(0, -200)
  const H = foot(A, B, C), N = foot(H, A, B), M = foot(H, A, C), O = inter(M, N, A, H)
  ok(dist(A, B) > dist(A, C), 'AB > AC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, N), seg(H, M), seg(M, N),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(N, H, B, 11), rightAngle(M, H, C, 11),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(H), dot(N), dot(M), dot(O),
    label(A, 'A', -18, 18), label(B, 'B', 14, 20), label(C, 'C', -20, -4), label(H, 'H', 12, -12),
    label(N, 'N', 0, 26), label(M, 'M', -22, 4), label(O, 'O', -18, 4),
  ]
  hinh('HLB00151', [A, B, C], [...nen, ...nhan])
  // ý 2 (HLY00368): F trên tia AC, M trung điểm AF; I = HM ∩ FN. Câu hỏi nhắc FH và tứ giác AOIF ⇒ nối FN, FH, OI.
  const F = doiXung(A, M), I = inter(H, M, F, N)
  ok(gan(dist(M, F), dist(M, A)), 'M trung điểm AF')
  hinh('HLY00368', [A, B, C, F], [
    ...nen, seg(C, F), seg(F, N), seg(F, H), seg(O, I), tick(A, M, 2), tick(M, F, 2),
    ...nhan, dot(F), dot(I), label(F, 'F', -20, -4), label(I, 'I', 10, -12),
  ])
  // ý 3 (HLY00369): E trung điểm BC; qua A vẽ xy ⊥ OE. Không dùng F, I của ý 2 ⇒ bỏ cho gọn. KHÔNG vẽ điểm đồng quy (điều phải chứng minh).
  const E = mid(B, C)
  const d = { x: -(E.y - O.y), y: E.x - O.x }, l = Math.hypot(d.x, d.y)
  const X = P(A.x + d.x / l * 70, A.y + d.y / l * 70), Y = P(A.x - d.x / l * 230, A.y - d.y / l * 230)
  ok(Math.abs(((X.x - Y.x) * (E.x - O.x) + (X.y - Y.y) * (E.y - O.y))) < 1e-6, 'xy ⊥ OE')
  hinh('HLY00369', [A, B, C, X, Y], [
    ...nen, seg(O, E), seg(X, Y), tick(B, E, 1), tick(E, C, 1, 0.78),
    ...nhan, dot(E), label(E, 'E', 12, -12), label(X, 'x', 8, 18), label(Y, 'y', -16, 0),
  ])
}

// ───── mẫu ký hiệu đoạn bằng nhau (§4): nhóm 1–3 gạch, nhóm 4–6 dùng dấu x ─────
{
  const ds = [1, 2, 3, 4, 5, 6].map((n, i) => ({ n, a: P(0, i * 46), b: P(220, i * 46) }))
  hinh('MAU_ky_hieu_bang_nhau', ds.flatMap((x) => [x.a, x.b]), ds.map((x) => seg(x.a, x.b) + tick(x.a, x.b, x.n) + label(x.a, 'nhóm ' + x.n, -60, 7)).join(''), { pad: 120 })
}

await xuatTat(RA)
