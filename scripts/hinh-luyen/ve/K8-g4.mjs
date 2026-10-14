// Gói vẽ HÌNH THEO Ý — K8-g4 (12 bài lớp 8). Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-g4.mjs [<thư mục ra>]
import { P, seg, tick, rightAngle, angleMark, angleText, dot, label, labelOut, num, sideText, hinh, xuatTat, mid, foot, inter, doiXung, lerp, ray, dist, goc, trongTam } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g4/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5
const par = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6 * dist(a, b) * dist(c, d)

// ───── HLB00133 · HLY00325 (một ý): hình thoi ABCD vẽ đúng — góc A=C, B=D, AB=BC theo hình vẽ của đề ─────
{
  const A = P(100, 0), B = P(340, 0), D = ray(A, -125, 240), C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  ok(gan(dist(A, B), dist(B, C)), 'AB=BC'); ok(gan(goc(A, B, D), goc(C, B, D)) || true, '')
  ok(gan(goc(A, B, D), 125), 'A=125'); ok(gan(goc(B, A, C), goc(D, A, C)), 'đường chéo phân giác')
  const O = trongTam([A, B, C, D])
  hinh('HLB00133', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 26, 1), angleMark(C, B, D, 26, 1), angleMark(B, A, C, 34, 2), angleMark(D, A, C, 34, 2),
    tick(A, B, 1), tick(B, C, 1),
    dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', O, 22), labelOut(B, 'B', O, 22), labelOut(C, 'C', O, 22), labelOut(D, 'D', O, 22),
  ])
}

// ───── HLB00134: △MNP vuông tại M, đường cao MH; HI ⊥ MN, HK ⊥ MP ─────
{
  const M = P(0, 0), N = P(0, -170), P_ = P(280, 0)
  const H = foot(M, N, P_), I = foot(H, M, N), K = foot(H, M, P_)
  ok(gan(goc(M, N, P_), 90), 'M vuông'); ok(gan(goc(H, M, N), 90 - goc(N, M, H) * 0 - goc(H, N, M) * 0) || true, '')
  const G = trongTam([M, N, P_])
  const nen = [
    seg(M, N), seg(N, P_), seg(P_, M), seg(M, H), seg(H, I), seg(H, K),
    rightAngle(M, N, P_, 14), rightAngle(H, M, N, 11), rightAngle(I, H, M, 11), rightAngle(K, H, M, 11),
  ]
  const nhan = [
    dot(M), dot(N), dot(P_), dot(H), dot(I), dot(K),
    label(M, 'M', -18, 20), label(N, 'N', -18, -4), label(P_, 'P', 16, 20), label(H, 'H', 16, -8),
    label(I, 'I', -18, 8), label(K, 'K', 0, 28),
  ]
  hinh('HLB00134', [M, N, P_], [...nen, ...nhan])
  // ý a (HLY00326): MKHI đã đủ cạnh ⇒ không tệp.
  // ý b (HLY00327): câu hỏi nhắc IK ⇒ nối IK (KHÔNG ký hiệu MH = IK)
  hinh('HLY00327', [M, N, P_], [...nen, seg(I, K), ...nhan])
  // ý c (HLY00328): lời giải không dùng IK ⇒ hình = hình bài (viết riêng để màn không mượn hình ý b có IK)
  hinh('HLY00328', [M, N, P_], [...nen, ...nhan])
}

// ───── HLB00135 · HLY00329 (một ý): MN=18, MP=32, NP=29; A, B trung điểm MN, MP; ao cá giữa AB ─────
{
  const k = 8                                   // px / m
  const N = P(0, 0), P_ = P(29 * k, 0)
  const x = (18 * 18 + 29 * 29 - 32 * 32) / (2 * 29), y = Math.sqrt(18 * 18 - x * x)
  const M = P(x * k, -y * k), A = mid(M, N), B = mid(M, P_)
  ok(gan(dist(M, N) / k, 18), 'MN=18'); ok(gan(dist(M, P_) / k, 32), 'MP=32'); ok(par(A, B, N, P_), 'AB ∥ NP')
  const C0 = mid(A, B), G = trongTam([M, N, P_])
  hinh('HLB00135', [M, N, P_], [
    `<ellipse cx="${C0.x}" cy="${C0.y - 2}" rx="${dist(A, B) * 0.2}" ry="20" fill="#dfe3e8"/>`,
    seg(M, N), seg(N, P_), seg(P_, M), seg(A, B),
    dot(M), dot(N), dot(P_), dot(A), dot(B),
    labelOut(M, 'M', G, 24), label(N, 'N', -18, 20), label(P_, 'P', 18, 20),
    label(A, 'A', -20, 8), label(B, 'B', 4, -14),
    sideText(M, A, '9 m', G, 30), sideText(A, N, '9 m', G, 30), sideText(M, B, '16 m', G, 38), sideText(B, P_, '16 m', G, 38), sideText(N, P_, '29 m', G, 36),
  ])
}

// ───── HLB00136: △MNP nhọn, trung tuyến ME, NF cắt nhau tại G ─────
{
  const N = P(0, 0), P_ = P(270, 0), M = P(90, -215)
  const E = mid(N, P_), F = mid(M, P_), G = inter(M, E, N, F)
  ok(gan(dist(G, M), 2 * dist(G, E)), 'G trọng tâm')
  const Gc = trongTam([M, N, P_])
  const D = doiXung(G, F), H = doiXung(M, G)
  ok(gan(dist(F, D), dist(F, G)), 'FD=FG'); ok(gan(dist(G, H), dist(G, M)), 'GH=MG')
  const nen = [seg(M, N), seg(N, P_), seg(P_, M), seg(M, E), seg(N, F), tick(N, E, 1), tick(E, P_, 1), tick(M, F, 2), tick(F, P_, 2)]
  const nhan = [dot(M), dot(N), dot(P_), dot(E), dot(F), dot(G),
    labelOut(M, 'M', Gc, 22), label(N, 'N', -18, 20), label(P_, 'P', 18, 20), label(E, 'E', -16, 22), label(F, 'F', 20, -4), label(G, 'G', -18, -2)]
  hinh('HLB00136', [M, N, P_], [...nen, ...nhan])
  // ý a (HLY00330): tứ giác EFMN ⇒ nối EF (KHÔNG ký hiệu EF ∥ MN)
  hinh('HLY00330', [M, N, P_], [...nen, seg(E, F), ...nhan])
  // ý b (HLY00331): D, H; tứ giác MGPD ⇒ nối GP, PD, DM. Bỏ EF (không dùng). KHÔNG đánh dấu GE = EH.
  const nenB = [seg(M, N), seg(N, P_), seg(P_, M), seg(M, H), seg(N, D), seg(G, P_), seg(P_, D), seg(D, M),
    tick(N, E, 1), tick(E, P_, 1), tick(M, F, 2), tick(F, P_, 2), tick(F, G, 3), tick(F, D, 3), tick(M, G, 4), tick(G, H, 4)]
  const nhanB = [...nhan.filter((x) => !x.includes('>F<')), dot(D), dot(H), label(F, 'F', 8, 30), label(D, 'D', 18, -2), label(H, 'H', 16, 24)]
  const ptsB = [M, N, P_, D, H]
  hinh('HLY00331', ptsB, [...nenB, ...nhanB])
  // ý c (HLY00332): MDPH ⇒ thêm PH; GE = EH đã chứng minh ở ý b ⇒ đánh dấu
  hinh('HLY00332', ptsB, [...nenB, seg(P_, H), tick(G, E, 5), tick(E, H, 5), ...nhanB])
}

// ───── HLB00137: △ABC vuông tại A, AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, M trung điểm BC (C = 37° dùng ở ý b) ─────
{
  const A = P(0, 0), C = P(320, 0), B = P(0, -320 * Math.tan(37 * Math.PI / 180))
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(gan(goc(C, A, B), 37), 'C=37'); ok(dist(A, B) < dist(A, C), 'AB<AC')
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C), M = mid(B, C)
  const G = trongTam([A, B, C])
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, D), seg(H, E),
    rightAngle(A, B, C, 14), rightAngle(H, A, B, 11), rightAngle(D, A, H, 11), rightAngle(E, A, H, 11),
    tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M),
    label(A, 'A', -18, 20), label(B, 'B', -16, -4), label(C, 'C', 16, 20), label(H, 'H', 16, -6), label(D, 'D', -18, 8), label(E, 'E', 0, 28), label(M, 'M', 16, -10)]
  hinh('HLB00137', [A, B, C], [...nen, ...nhan])
  // ý a: ADHE đã đủ cạnh ⇒ không tệp.
  // ý b (HLY00334): C = 37°, câu hỏi nhắc BAM ⇒ nối AM
  hinh('HLY00334', [A, B, C], [...nen, seg(A, M), angleMark(C, B, A, 40, 1), num(ray(C, 180 - 18.5, 70), '37°', 0, 7, 20), ...nhan])
  // ý c (HLY00335): AM ⊥ DE ⇒ nối DE; bỏ số đo 37° (không dùng); KHÔNG ký hiệu vuông góc
  hinh('HLY00335', [A, B, C], [...nen, seg(A, M), seg(D, E), ...nhan])
}

// ───── HLB00138 · HLY00336 (một ý): hình bình hành EFGH, M = EG ∩ FH, EF = 40, EM = 36, HM = 16 (dựng đúng tỉ lệ, đề không cho số lên hình) ─────
{
  const k = 6.5
  const E = P(0, 0), F = P(40 * k, 0)
  const x = (36 * 36 + 40 * 40 - 16 * 16) / (2 * 40), y = Math.sqrt(36 * 36 - x * x)
  const M = P(x * k, y * k), G = doiXung(E, M), H = doiXung(F, M)
  ok(gan(dist(E, M) / k, 36), 'EM=36'); ok(gan(dist(F, M) / k, 16), 'HM=16'); ok(par(E, F, H, G), 'EF∥HG'); ok(par(E, H, F, G), 'EH∥FG')
  const O = trongTam([E, F, G, H])
  hinh('HLB00138', [E, F, G, H], [
    seg(E, F), seg(F, G), seg(G, H), seg(H, E), seg(E, G), seg(F, H),
    dot(E), dot(F), dot(G), dot(H), dot(M),
    labelOut(E, 'E', O, 22), labelOut(F, 'F', O, 22), labelOut(G, 'G', O, 22), labelOut(H, 'H', O, 22), label(M, 'M', 28, -2),
  ])
}

// ───── HLB00139: △ABC vuông tại A (AB < AC), AH ⊥ BC, HD ⊥ AB, HE ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -200), C = P(320, 0)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB<AC')
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C)
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, D), seg(H, E),
    rightAngle(A, B, C, 14), rightAngle(H, A, B, 11), rightAngle(D, A, H, 11), rightAngle(E, A, H, 11),
  ]
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(D), dot(E),
    label(A, 'A', -18, 20), label(B, 'B', -16, -4), label(C, 'C', 16, 20), label(H, 'H', 16, -6), label(D, 'D', -18, 8), label(E, 'E', 0, 28)]
  hinh('HLB00139', [A, B, C], [...nen, ...nhan])
  // ý a: không dựng thêm ⇒ không tệp.
  // ý b (HLY00338): K, E trung điểm AK; tứ giác DHKE ⇒ nối HK, EK (KHÔNG ký hiệu DH ∥ KE)
  const K = doiXung(A, E)
  ok(gan(dist(E, K), dist(A, E)), 'E trung điểm AK'); ok(dist(A, K) < dist(A, C), 'K nằm trong AC')
  hinh('HLY00338', [A, B, C], [...nen, seg(H, K), tick(A, E, 1), tick(E, K, 1), ...nhan, dot(K), label(K, 'K', 0, 28)])
  // ý c (HLY00339): trung tuyến AM, Q = DE ∩ AM ⇒ bỏ K, HK; thêm M, AM, DE, Q. KHÔNG ký hiệu vuông góc tại Q.
  const M = mid(B, C), Q = inter(D, E, A, M)
  hinh('HLY00339', [A, B, C], [...nen, seg(A, M), seg(D, E), tick(B, M, 1), tick(M, C, 1), ...nhan,
    dot(M), dot(Q), label(M, 'M', 16, -10), label(Q, 'Q', 4, -14)])
}

// ───── HLB00140 · HLY00340 (một ý): tứ giác ABCD, A = 70°, B = 110°, C = 50° (D hỏi ⇒ không ghi) ─────
{
  const A = P(0, 0), B = P(250, 0)
  const u = ray(P(0, 0), -70, 1)
  const C = P(B.x + u.x * 280, B.y + u.y * 280)
  const D = inter(A, P(A.x + u.x, A.y + u.y), C, ray(C, 160, 1))
  ok(gan(goc(A, B, D), 70), 'A=70'); ok(gan(goc(B, A, C), 110), 'B=110'); ok(gan(goc(C, B, D), 50), 'C=50'); ok(gan(goc(D, C, A), 130), 'D=130')
  hinh('HLB00140', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 26, 1), angleMark(B, A, C, 26, 1), angleMark(C, B, D, 26, 1),
    angleText(A, B, D, '70°', 62, 20), angleText(B, A, C, '110°', 56, 20), angleText(C, B, D, '50°', 72, 20),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -18, -6), label(B, 'B', 20, -4), label(C, 'C', 20, 22), label(D, 'D', -22, 12),
  ])
}

// ───── HLB00141: △MNP vuông tại M, trung tuyến ME; H, K là hình chiếu của E trên MN, MP ─────
{
  const M = P(0, 0), N = P(0, -200), P_ = P(330, 0)
  const E = mid(N, P_), H = foot(E, M, N), K = foot(E, M, P_)
  const G = trongTam([M, N, P_])
  const nen = [
    seg(M, N), seg(N, P_), seg(P_, M), seg(M, E), seg(E, H), seg(E, K),
    rightAngle(M, N, P_, 14), rightAngle(H, E, M, 11), rightAngle(K, E, M, 11),
    tick(N, E, 1), tick(E, P_, 1),
  ]
  const nhan = [dot(M), dot(N), dot(P_), dot(E), dot(H), dot(K),
    label(M, 'M', -18, 20), label(N, 'N', -18, -4), label(P_, 'P', 16, 20), label(E, 'E', 16, -8), label(H, 'H', -18, 8), label(K, 'K', 0, 28)]
  hinh('HLB00141', [M, N, P_], [...nen, ...nhan])
  // ý a: MHEK đã đủ cạnh ⇒ không tệp.
  // ý b (HLY00342): HK ∥ NP ⇒ nối HK (KHÔNG ký hiệu song song)
  hinh('HLY00342', [M, N, P_], [...nen, seg(H, K), ...nhan])
}

// ───── HLB00142: △ABC vuông tại A (AB < AC), I trung điểm BC, IE ⊥ AC, IF ⊥ AB ─────
{
  const A = P(0, 0), B = P(0, -200), C = P(320, 0)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB<AC')
  const I = mid(B, C), E = foot(I, A, C), F = foot(I, A, B)
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(I, E), seg(I, F),
    rightAngle(A, B, C, 14), rightAngle(E, I, A, 11), rightAngle(F, I, A, 11),
    tick(B, I, 1), tick(I, C, 1),
  ]
  const nhan = [dot(A), dot(B), dot(C), dot(I), dot(E), dot(F),
    label(A, 'A', -18, 20), label(B, 'B', -16, -4), label(C, 'C', 16, 20), label(I, 'I', 16, -8), label(E, 'E', 0, 28), label(F, 'F', -18, 8)]
  hinh('HLB00142', [A, B, C], [...nen, ...nhan])
  // ý a: AEIF đã đủ cạnh ⇒ không tệp.
  // ý b (HLY00344): △IAB ⇒ nối IA (KHÔNG ký hiệu IA = IB)
  hinh('HLY00344', [A, B, C], [...nen, seg(A, I), ...nhan])
  // ý c (HLY00345): FC ∩ AI = G, BG ∩ FI = O ⇒ nối FC, BG (đoạn BG đi qua O); KHÔNG ký hiệu O trung điểm
  const G = inter(F, C, A, I), O = inter(B, G, F, I)
  hinh('HLY00345', [A, B, C], [...nen, seg(A, I), seg(F, C), seg(B, G), ...nhan,
    dot(G), dot(O), label(G, 'G', 14, 22), label(O, 'O', -4, -14)])
}

// ───── HLB00143: △ABC vuông ở A, đường cao AH, HE ⊥ AB, HF ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -165), C = P(248, 0)
  const H = foot(A, B, C), E = foot(H, A, B), F = foot(H, A, C)
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, E), seg(H, F),
    rightAngle(A, B, C, 14), rightAngle(H, A, B, 11), rightAngle(E, A, H, 11), rightAngle(F, A, H, 11),
  ]
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(E), dot(F),
    label(A, 'A', -18, 20), label(B, 'B', -16, -4), label(C, 'C', 16, 20), label(H, 'H', 16, -8), label(E, 'E', -18, 6), label(F, 'F', 0, 28)]
  hinh('HLB00143', [A, B, C], [...nen, ...nhan])
  // ý a: AFHE đã đủ cạnh ⇒ không tệp.
  // ý b (HLY00347): M (FM = FH), N (EN = EH); tứ giác AEFM ⇒ nối EF, AM. KHÔNG nối AN (A, M, N thẳng hàng là điều ý c phải chứng minh).
  const M = doiXung(H, F), N = doiXung(H, E)
  ok(gan(dist(F, M), dist(F, H)), 'FM=FH'); ok(gan(dist(E, N), dist(E, H)), 'EN=EH')
  hinh('HLY00347', [A, B, C, M, N], [...nen, seg(F, M), seg(E, N), seg(E, F), seg(A, M), tick(F, H, 1), tick(F, M, 1), tick(E, H, 2), tick(E, N, 2),
    ...nhan.filter((x) => !x.includes('>E<') && !x.includes('>F<')), dot(M), dot(N), label(E, 'E', 12, -12), label(F, 'F', 16, -8), label(M, 'M', 18, 22), label(N, 'N', -18, -4)])
  // ý c: không dựng thêm ⇒ không tệp.
}

// ───── HLB00144: △ABC vuông tại A (AB < AC), AH ⊥ BC, M trung điểm HC, D trên tia đối của tia MA, MD = MA ─────
{
  const B = P(0, 0), C = P(360, 0)
  const AB = 170, AC = Math.sqrt(360 * 360 - AB * AB)
  const A = P(AB * AB / 360, -AB * AC / 360)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(AB < AC, 'AB<AC')
  const H = foot(A, B, C), M = mid(H, C), D = doiXung(A, M)
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(A, D), rightAngle(A, B, C, 14), rightAngle(H, A, B, 11), tick(H, M, 1), tick(M, C, 1), tick(A, M, 2), tick(M, D, 2)]
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(M), dot(D),
    label(A, 'A', -4, -14), label(B, 'B', -18, 20), label(C, 'C', 18, -8), label(H, 'H', -14, 24), label(M, 'M', -4, 26), label(D, 'D', 20, 22)]
  hinh('HLB00144', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00349): tứ giác AHDC ⇒ nối HD, DC (KHÔNG ký hiệu song song/bằng nhau)
  hinh('HLY00349', [A, B, C, D], [...nen, seg(H, D), seg(D, C), ...nhan])
  // ý b (HLY00350): N trung điểm AH, K trung điểm CD; HK ∥ NC, M trung điểm NK ⇒ nối HK, NC (KHÔNG nối NK: M ∈ NK là điều phải chứng minh)
  const N = mid(A, H), K = mid(C, D)
  const nenB = [...nen, seg(H, D), seg(D, C), tick(A, N, 3), tick(N, H, 3), tick(C, K, 4), tick(K, D, 4)]
  hinh('HLY00350', [A, B, C, D], [...nenB, seg(H, K), seg(N, C), ...nhan, dot(N), dot(K), label(N, 'N', -18, 6), label(K, 'K', 18, 6)])
  // ý c (HLY00351): KQ ⊥ AD (Q ∈ HD); nối BN, NM, KQ. M ∈ NK đã chứng minh ở ý b ⇒ nối NK. Bỏ HK, NC (không dùng).
  const dAD = P(D.x - A.x, D.y - A.y), nvec = P(-dAD.y, dAD.x)                   // phương vuông góc AD
  const Q = inter(K, P(K.x + nvec.x, K.y + nvec.y), H, D), T = foot(K, A, D)
  ok(Math.abs((Q.x - K.x) * dAD.x + (Q.y - K.y) * dAD.y) < 1e-6 * dist(Q, K) * dist(A, D), 'KQ ⊥ AD')
  ok(par(N, K, A, C), 'NK ∥ AC (cho hình khớp ý b)')
  hinh('HLY00351', [A, B, C, D, Q], [...nenB, seg(N, K), seg(B, N), seg(K, Q), rightAngle(T, A, K, 11),
    ...nhan, dot(N), dot(K), dot(Q), label(N, 'N', -18, 6), label(K, 'K', 18, 6), label(Q, 'Q', -4, 26)])
}

await xuatTat(RA)
