// Gói vẽ HÌNH THEO Ý — K8-g6 (12 bài lớp 8). Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-g6.mjs [<thư mục ra>]
// HLB… = hình giả thiết chung (bài một ý: toàn bộ đề) · HLY… = hình của ý có dựng thêm điểm/đường.
import { P, seg, segDash, tick, rightAngle, dot, label, hinh, xuatTat, mid, foot, inter, doiXung, reflect, lerp, lineExt, dist, goc } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g6/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5

// ───── HLB00159 (HHC002627): △ABC vuông tại A (AB > AC), E trung điểm BC, D,H là chân vuông góc từ E xuống AB, AC ─────
{
  const k = 0.9
  const A = P(0, 0), B = P(340 * k, 0), C = P(0, -200 * k)
  const E = mid(B, C), D = foot(E, A, B), H = foot(E, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) > dist(A, C), 'AB > AC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(E, D), seg(E, H),
    rightAngle(A, B, C, 14), rightAngle(D, E, B, 12), rightAngle(H, E, C, 12),
    tick(B, E, 1), tick(E, C, 1),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(E), dot(D), dot(H),
    label(A, 'A', -18, 20), label(B, 'B', 16, 18), label(C, 'C', -4, -14), label(E, 'E', 16, -8),
    label(H, 'H', -22, 6),
  ]
  const nhanD = label(D, 'D', 0, 26)
  hinh('HLB00159', [A, B, C], [...nen, ...nhan, nhanD])
  // ý a (HLY00394), ý b (HLY00395): không dựng thêm gì ⇒ không tệp.
  // ý c (HLY00396): F: D trung điểm EF; EI ⊥ AF tại I; nối IH, ID (KHÔNG ký hiệu IH ⊥ ID — điều phải chứng minh)
  const F = doiXung(E, D), I = foot(E, A, F)
  ok(gan(dist(D, F), dist(D, E)), 'D trung điểm EF'); ok(gan(goc(I, E, A), 90), 'EI ⊥ AF')
  ok((I.x - A.x) * (F.x - A.x) + (I.y - A.y) * (F.y - A.y) > 0, 'I trên tia AF')
  // D là trung điểm AB (đã chứng minh ở ý b) ⇒ đánh dấu; ADEH hình chữ nhật (ý a) ⇒ góc vuông tại E
  hinh('HLY00396', [A, B, C, F], [
    ...nen, seg(E, F), seg(A, F), seg(E, I), seg(I, H), seg(I, D),
    rightAngle(I, E, F, 11), rightAngle(E, D, H, 11), tick(A, D, 3), tick(D, B, 3), tick(E, D, 2), tick(D, F, 2),
    ...nhan, label(D, 'D', 20, 24), dot(F), dot(I), label(F, 'F', 14, 22), label(I, 'I', 4, 32),
  ])
  // ý d (HLY00397): không dựng thêm gì ⇒ không tệp (dùng hình ý c)
}

// ───── HLB00160 (HHC002628): △ABC vuông tại A (AB < AC); M, N, Q trung điểm AB, BC, AC; AI ⊥ BC tại I ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const M = mid(A, B), N = mid(B, C), Q = mid(A, C), I = foot(A, B, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, I),
    rightAngle(A, B, C, 14), rightAngle(I, A, C, 11),
    tick(A, M, 1), tick(M, B, 1), tick(B, N, 2, 0.8), tick(N, C, 2), tick(A, Q, 3), tick(Q, C, 3),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(Q), dot(I),
    label(A, 'A', -18, 20), label(B, 'B', -4, -14), label(C, 'C', 16, 18), label(M, 'M', -20, 8),
    label(N, 'N', 16, -8), label(I, 'I', 16, -12),
  ]
  const nhanQ = label(Q, 'Q', 0, 26)
  hinh('HLB00160', [A, B, C], [...nen, ...nhan, nhanQ])
  // ý a (HLY00398): tứ giác AMNQ ⇒ nối MN, NQ
  const hcn = [seg(M, N), seg(N, Q)]
  hinh('HLY00398', [A, B, C], [...nen, ...hcn, ...nhan, nhanQ])
  // ý b (HLY00399): qua A kẻ // BC cắt NQ tại K; nối MQ (câu hỏi). AMNQ hình chữ nhật (ý a) ⇒ góc vuông tại M, N, Q.
  const dBC = P(C.x - B.x, C.y - B.y)
  const K = inter(N, Q, A, P(A.x + dBC.x, A.y + dBC.y))
  ok(gan(K.x, Q.x), 'K trên NQ'); ok(K.y > Q.y, 'K ở phía tia NQ')
  const hcnMark = [rightAngle(M, A, N, 11), rightAngle(Q, A, N, 11), rightAngle(N, M, Q, 11)]
  const Ae = lerp(A, K, -0.25)
  hinh('HLY00399', [A, B, C, K, Ae], [
    ...nen, ...hcn, ...hcnMark, seg(M, Q), seg(Q, K), seg(Ae, K),
    ...nhan, label(Q, 'Q', -18, 26), dot(K), label(K, 'K', 18, 14),
  ])
  // ý c (HLY00400): tứ giác INQM ⇒ nối MI (MQ có từ ý b). Bỏ K và AK (ý này không dùng).
  hinh('HLY00400', [A, B, C], [
    ...nen, ...hcn, ...hcnMark, seg(M, Q), seg(M, I), ...nhan, nhanQ,
  ])
  // ý d (HLY00401): MI ⊥ QI ⇒ nối MI, QI (KHÔNG ký hiệu góc vuông tại I — điều phải chứng minh)
  hinh('HLY00401', [A, B, C], [
    ...nen, ...hcn, ...hcnMark, seg(M, Q), seg(M, I), seg(Q, I), ...nhan, nhanQ,
  ])
}

// ───── HLB00161 (HHC002629): △ABC vuông tại A, AH ⊥ BC; HI ⊥ AB tại I, HK ⊥ AC tại K ─────
{
  const A = P(0, 0), B = P(0, -260), C = P(330, 0)
  const H = foot(A, B, C), I = foot(H, A, B), K = foot(H, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(gan(dist(B, H) + dist(H, C), dist(B, C)), 'H nằm trong BC'); ok(gan(goc(H, A, B), 90), 'AH ⊥ BC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, I), seg(H, K),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(I, H, B, 11), rightAngle(K, H, C, 11),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(H), dot(I), dot(K),
    label(A, 'A', -18, 20), label(B, 'B', -4, -14), label(C, 'C', 16, 18), label(H, 'H', 16, -6),
    label(I, 'I', -18, 8), label(K, 'K', 0, 26),
  ]
  hinh('HLB00161', [A, B, C], [...nen, ...nhan])
  // ý a (HLY00402): AH = IK ⇒ nối IK (KHÔNG ký hiệu bằng nhau — điều phải chứng minh)
  hinh('HLY00402', [A, B, C], [...nen, seg(I, K), ...nhan])
  // ý b (HLY00403): M trung điểm BC; AH = IK (đã chứng minh ở ý a) ⇒ đánh dấu
  const M = mid(B, C)
  ok(dist(B, H) < dist(B, M), 'H nằm giữa B, M')
  const nenB = [...nen, seg(I, K), tick(A, H, 2, 0.72), tick(I, K, 2, 0.28), tick(B, M, 1), tick(M, C, 1)]
  const nhanB = [...nhan, dot(M), label(M, 'M', 18, -2)]
  hinh('HLY00403', [A, B, C], [...nenB, ...nhanB])
  // ý c (HLY00404): AM ⊥ IK ⇒ nối AM (KHÔNG ký hiệu vuông góc). AIHK hình chữ nhật (ý a) ⇒ góc vuông tại H trong hình chữ nhật.
  hinh('HLY00404', [A, B, C], [...nenB, seg(A, M), ...nhanB])
}

// ───── HLB00162 (HHC002630): hình chữ nhật ABCD; I, K ∈ CD, DI = CK; qua I ⊥ AI cắt BC tại N; O trung điểm AN ─────
{
  const W = 300, Hh = 170, a = 80
  const A = P(0, 0), B = P(W, 0), C = P(W, -Hh), D = P(0, -Hh)
  const I = P(a, -Hh), K = P(W - a, -Hh)
  const dAI = P(I.x - A.x, I.y - A.y), dir = P(-dAI.y, dAI.x)         // ⊥ AI
  const N = inter(I, P(I.x + dir.x, I.y + dir.y), B, C)
  const O = mid(A, N)
  ok(gan(dist(D, I), dist(C, K)), 'DI = CK'); ok(gan(goc(I, A, N), 90), 'AI ⊥ IN')
  ok(N.y < 0 && N.y > -Hh, 'N thuộc đoạn BC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, I), seg(I, N), seg(A, N),
    rightAngle(A, B, D, 12), rightAngle(B, A, C, 12), rightAngle(C, B, D, 12), rightAngle(D, A, C, 12), rightAngle(I, A, N, 11),
    tick(D, I, 1), tick(K, C, 1), tick(A, O, 2), tick(O, N, 2),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(D), dot(I), dot(K), dot(N), dot(O),
    label(A, 'A', -18, 20), label(B, 'B', 18, 20), label(C, 'C', 18, -6), label(D, 'D', -18, -6),
    label(I, 'I', 0, -14), label(K, 'K', 0, -14), label(N, 'N', 18, 8), label(O, 'O', 4, -12),
  ]
  hinh('HLB00162', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00405): OC = OD ⇒ nối OC, OD (KHÔNG ký hiệu bằng nhau)
  hinh('HLY00405', [A, B, C, D], [...nen, seg(O, C), seg(O, D), ...nhan])
  // ý b (HLY00406): △AKN vuông tại K ⇒ nối AK, KN; OC = OD (ý a) đã chứng minh ⇒ đánh dấu
  hinh('HLY00406', [A, B, C, D], [...nen, seg(O, C), seg(O, D), tick(O, C, 3, 0.3), tick(O, D, 3, 0.3), seg(A, K), seg(K, N), ...nhan])
  // ý c (HLY00407): NM ⊥ AD tại M; △BKM ⇒ nối BM, KM. △AKN vuông tại K (ý b) ⇒ góc vuông tại K. OC, OD ý này không dùng ⇒ bỏ.
  const M = foot(N, A, D)
  ok(gan(M.x, A.x), 'M thuộc AD')
  hinh('HLY00407', [A, B, C, D], [
    ...nen, seg(A, K), seg(K, N), rightAngle(K, A, N, 11), seg(N, M), rightAngle(M, A, N, 11), seg(B, M), seg(K, M), seg(B, K),
    ...nhan, dot(M), label(M, 'M', -18, 8),
  ])
}

// ───── HLB00163 (HHC002631): △ABC vuông tại A, M trung điểm BC, D ∈ AM, DE ⊥ AB, DF ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -230), C = P(340, 0)
  const M = mid(B, C), D = lerp(A, M, 0.62), E = foot(D, A, B), F = foot(D, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(D, E), seg(D, F),
    rightAngle(A, B, C, 14), rightAngle(E, D, B, 11), rightAngle(F, D, C, 11), tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(F),
    label(A, 'A', -18, 20), label(B, 'B', -4, -14), label(C, 'C', 16, 18), label(M, 'M', 16, -8),
    label(D, 'D', -2, -14), label(E, 'E', -18, 8), label(F, 'F', 0, 26),
  ]
  hinh('HLB00163', [A, B, C], [...nen, ...nhan])
  // ý a (HLY00408): không dựng thêm ⇒ không tệp.
  // ý b (HLY00409): EF ∥ BC ⇒ nối EF. AEDF hình chữ nhật (ý a) ⇒ góc vuông tại D.
  hinh('HLY00409', [A, B, C], [...nen, seg(E, F), rightAngle(D, E, F, 9), ...nhan])
  // ý c (HLY00410): không dựng thêm ⇒ không tệp.
}

// ───── HLB00164 (HHC002640, bài MỘT ý — vẽ toàn bộ đề): △ABC vuông tại A, trung tuyến AM; AB trung trực MH (E = MH ∩ AB); AC trung trực MK (F = MK ∩ AC) ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const M = mid(B, C), H = reflect(M, A, B), K = reflect(M, A, C), E = foot(M, A, B), F = foot(M, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(gan(dist(M, E), dist(E, H)), 'E trung điểm MH'); ok(gan(dist(M, F), dist(F, K)), 'F trung điểm MK')
  hinh('HLB00164', [A, B, C, H, K], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(M, H), seg(M, K), seg(B, H), seg(H, A), seg(C, K), seg(K, A),
    rightAngle(A, B, C, 14), rightAngle(E, M, B, 11), rightAngle(F, M, C, 11),
    tick(B, M, 1), tick(M, C, 1), tick(M, E, 2), tick(E, H, 2), tick(M, F, 3), tick(F, K, 3),
    dot(A), dot(B), dot(C), dot(M), dot(H), dot(K), dot(E), dot(F),
    label(A, 'A', -20, 24), label(B, 'B', -4, -14), label(C, 'C', 16, -6), label(M, 'M', 16, -8),
    label(H, 'H', -20, 8), label(K, 'K', 0, 28), label(E, 'E', -16, -10), label(F, 'F', -16, 26),
  ])
}

// ───── HLB00165 (HHC002641, bài MỘT ý): △ABC cân tại A; D ∈ BC; đường ⊥ BC tại D cắt AC, AB tại M, N; H, K trung điểm BC, MN ─────
{
  const A = P(0, -170), B = P(-130, 0), C = P(130, 0), Hh = mid(B, C)
  const D = P(60, 0)
  const M = inter(D, P(D.x, D.y - 100), A, C), N = inter(D, P(D.x, D.y - 100), A, B), K = mid(M, N)
  ok(gan(dist(A, B), dist(A, C)), 'cân tại A'); ok(N.y < A.y && M.y < 0 && M.y > A.y, 'N ngoài, M trong')
  hinh('HLB00165', [A, B, C, N], [
    seg(B, N), seg(A, C), seg(B, C), seg(N, D), seg(A, K), seg(A, Hh),
    rightAngle(D, N, C, 11), tick(A, B, 1, 0.78), tick(A, C, 1, 0.78), tick(B, Hh, 2), tick(Hh, C, 2), tick(M, K, 3), tick(K, N, 3),
    dot(A), dot(B), dot(C), dot(Hh), dot(D), dot(M), dot(N), dot(K),
    label(A, 'A', -18, -2), label(B, 'B', -16, 16), label(C, 'C', 16, 16), label(Hh, 'H', -16, 26), label(D, 'D', 14, 26),
    label(M, 'M', 22, -6), label(N, 'N', 0, -14), label(K, 'K', 18, -4),
  ])
}

// ───── HLB00166 (HHC002642): △ABC, trung tuyến BD, CE cắt tại G; H, K trung điểm GB, GC ─────
{
  const A = P(70, -230), B = P(0, 0), C = P(330, 0)
  const D = mid(A, C), E = mid(A, B), G = inter(B, D, C, E), H = mid(G, B), K = mid(G, C)
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, E),
    tick(A, E, 1), tick(E, B, 1), tick(A, D, 2), tick(D, C, 2), tick(B, H, 3), tick(H, G, 3), tick(C, K, 3, 0.5), tick(K, G, 3),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(G), dot(H), dot(K),
    label(A, 'A', 0, -14), label(B, 'B', -16, 18), label(C, 'C', 16, 18), label(D, 'D', 18, -6), label(E, 'E', -18, -2),
    label(G, 'G', 0, -12), label(H, 'H', 12, 26), label(K, 'K', -14, 28),
  ]
  hinh('HLB00166', [A, B, C], [...nen, ...nhan])
  // ý a (HLY00413): tứ giác DEHK ⇒ nối DE, EH, HK, KD
  hinh('HLY00413', [A, B, C], [...nen, seg(D, E), seg(E, H), seg(H, K), seg(K, D), ...nhan])
  // ý b (HLY00414): không dựng thêm ⇒ không tệp.
}

// ───── HLB00167 (HHC002643): △ABC vuông tại A, M ∈ BC; qua M kẻ // AB, // AC cắt AC, AB tại E, F ─────
{
  const A = P(0, 0), B = P(0, -200), C = P(310, 0)
  const M = lerp(B, C, 0.62), E = P(M.x, 0), F = P(0, M.y)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(Math.abs(dist(A, B) - dist(A, C)) > 50, 'không cân')
  hinh('HLB00167', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(M, E), seg(M, F), rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(F),
    label(A, 'A', -18, 20), label(B, 'B', -4, -14), label(C, 'C', 16, 18), label(M, 'M', 16, -8),
    label(E, 'E', 0, 26), label(F, 'F', -18, 8),
  ])
  // ý a (HLY00415), ý b (HLY00416): không dựng thêm ⇒ không tệp.
}

// ───── HLB00168 (HHC002644): △ABC vuông tại A; E, G, F trung điểm AB, BC, AC; qua E // BF cắt GF tại I ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const E = mid(A, B), G = mid(B, C), F = mid(A, C)
  const I = inter(E, P(E.x + (F.x - B.x), E.y + (F.y - B.y)), G, F)
  ok(gan(goc(A, B, C), 90), 'A vuông')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(B, F), seg(E, I), seg(G, I),
    rightAngle(A, B, C, 14), tick(A, E, 1), tick(E, B, 1), tick(B, G, 2), tick(G, C, 2), tick(A, F, 3, 0.36), tick(F, C, 3),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(E), dot(G), dot(F), dot(I),
    label(A, 'A', -18, 20), label(B, 'B', -4, -14), label(C, 'C', 16, 18), label(E, 'E', -18, 8),
    label(G, 'G', 16, -8), label(F, 'F', -18, 26), label(I, 'I', 16, 20),
  ]
  hinh('HLB00168', [A, B, C, I], [...nen, ...nhan])
  // ý a (HLY00417): tứ giác AEGF ⇒ nối EG
  hinh('HLY00417', [A, B, C, I], [...nen, seg(E, G), ...nhan])
  // ý b (HLY00418): không dựng thêm ⇒ không tệp.
  // ý c (HLY00419): tứ giác AGCI ⇒ nối AG, AI, CI. AEGF hình chữ nhật (ý a) ⇒ ba góc vuông E, G, F.
  hinh('HLY00419', [A, B, C, I], [
    ...nen, seg(E, G), seg(A, G), seg(A, I), seg(C, I),
    rightAngle(E, A, G, 11), rightAngle(G, E, F, 11), rightAngle(F, A, G, 11),
    ...nhan,
  ])
}

// ───── HLB00169 (HHC002645): hình chữ nhật ABCD, AB = 2BC; I, K trung điểm AB, DC ─────
{
  const A = P(0, 0), B = P(300, 0), C = P(300, -150), D = P(0, -150)
  const I = mid(A, B), K = mid(D, C)
  ok(gan(dist(A, B), 2 * dist(B, C)), 'AB = 2BC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    rightAngle(A, B, D, 12), rightAngle(B, A, C, 12), rightAngle(C, B, D, 12), rightAngle(D, A, C, 12),
    tick(A, I, 1), tick(I, B, 1), tick(D, K, 2), tick(K, C, 2),
  ]
  const nhan = [
    dot(A), dot(B), dot(C), dot(D), dot(I), dot(K),
    label(A, 'A', -18, 20), label(B, 'B', 18, 20), label(C, 'C', 18, -6), label(D, 'D', -18, -6),
    label(I, 'I', 0, 28), label(K, 'K', 0, -14),
  ]
  hinh('HLB00169', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00420): AIKD, BIKC ⇒ nối IK
  hinh('HLY00420', [A, B, C, D], [...nen, seg(I, K), ...nhan])
  // ý b (HLY00421): △DIC ⇒ nối DI, IC. Hình vuông (ý a) ⇒ IK ⊥ DC (góc vuông tại K).
  hinh('HLY00421', [A, B, C, D], [
    ...nen, seg(I, K), seg(D, I), seg(I, C), rightAngle(K, I, D, 11), rightAngle(K, I, C, 11), ...nhan,
  ])
  // ý c (HLY00422): S, R tâm các hình vuông ⇒ nối IS, SK, KR, RI. △DIC vuông tại I (ý b) ⇒ góc vuông tại I.
  const S = mid(A, K), R = mid(B, K)
  ok(gan(dist(S, I), dist(S, K)), 'S tâm AIKD')
  hinh('HLY00422', [A, B, C, D], [
    ...nen, seg(I, K), seg(D, I), seg(I, C), seg(S, K), seg(R, K),
    rightAngle(I, D, C, 12), ...nhan, dot(S), dot(R), label(S, 'S', -20, 24), label(R, 'R', 20, 24),
  ])
}

// ───── HLB00170 (HHC002646, bài MỘT ý): △ABC vuông tại A có BC = 2AB ─────
{
  const A = P(0, 0), B = P(0, -140), C = P(Math.sqrt(280 * 280 - 140 * 140), 0)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(gan(dist(B, C), 2 * dist(A, B)), 'BC = 2AB')
  hinh('HLB00170', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C),
    label(A, 'A', -18, 20), label(B, 'B', -4, -14), label(C, 'C', 16, 18),
  ])
}

await xuatTat(RA)
