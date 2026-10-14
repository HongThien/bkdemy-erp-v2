// Gói vẽ HÌNH THEO Ý — K8-g7 (HLB00172…HLB00182, lớp 8). Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-g7.mjs [<thư mục ra>]
// HLB… = hình giả thiết chung · HLY… = hình của ý có dựng thêm (ý không dựng thêm ⇒ không có tệp).
// HLB00171 (thửa ruộng hình thang cân, không có hình, số liệu mâu thuẫn) cố ý KHÔNG vẽ — xem báo cáo.
import { P, seg, tick, rightAngle, dot, label, hinh, xuatTat, mid, lerp, foot, inter, doiXung, dist, goc, labelOut, trongTam } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g7/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5
// điểm + chấm; [p, tên] đẩy nhãn ra xa tâm cen; [p, tên, dx, dy] đặt tay
const NH = (cen, arr) => arr.flatMap(([p, t, dx, dy]) => [dot(p), dx === undefined ? labelOut(p, t, cen, 22) : label(p, t, dx, dy)])

// ───── HLB00172: △ABC vuông tại A, AB<AC, đường cao AH, trung tuyến AE; D, F hình chiếu của E trên AB, AC; O = AE ∩ DF ─────
{
  const A = P(0, 0), B = P(0, -140), C = P(230, 0)
  const E = mid(B, C), H = foot(A, B, C), D = foot(E, A, B), F = foot(E, A, C), O = inter(A, E, D, F)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(gan(goc(H, A, B), 90), 'AH ⊥ BC'); ok(gan(goc(D, E, A), 90), 'ED ⊥ AB'); ok(gan(goc(F, E, A), 90), 'EF ⊥ AC')
  const cen = trongTam([A, B, C])
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(A, E), seg(E, D), seg(E, F), seg(D, F),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(D, E, A, 11), rightAngle(F, E, A, 11),
    tick(B, E, 1, 0.25), tick(E, C, 1, 0.5),
  ]
  const nhan = NH(cen, [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [H, 'H', 14, -12], [E, 'E', 16, -12], [D, 'D', -18, 6], [F, 'F', 0, 26], [O, 'O', 0, -12]])
  hinh('HLB00172', [A, B, C], [...nen, ...nhan])
  // ý a, b, c, d: không dựng thêm ⇒ không có tệp.
  // ý e (HLY00430): tứ giác DFEH ⇒ nối HD, FH. Đã chứng minh F là trung điểm AC (ý d) ⇒ gạch AF = FC.
  hinh('HLY00430', [A, B, C], [...nen, seg(H, D), seg(F, H), tick(A, F, 2), tick(F, C, 2, 0.5), ...nhan])
  // ý f (HLY00431): M, N: F trung điểm EM và BN. Không dùng D, H, O, AH, DF ⇒ bỏ. KHÔNG nối A, N, M (điều phải chứng minh).
  const M = doiXung(E, F), N = doiXung(B, F)
  ok(gan(dist(F, M), dist(F, E)), 'F trung điểm EM'); ok(gan(dist(F, N), dist(F, B)), 'F trung điểm BN')
  hinh('HLY00431', [A, B, C, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, E), seg(E, M), seg(B, N),
    rightAngle(A, B, C, 14), rightAngle(F, E, A, 11),
    tick(B, E, 1), tick(E, C, 1), tick(A, F, 2), tick(F, C, 2), tick(E, F, 3), tick(F, M, 3), tick(B, F, 4), tick(F, N, 4),
    ...NH(cen, [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, -10], [E, 'E', 18, -12], [F, 'F', -20, 24], [M, 'M', 0, 26], [N, 'N', 16, 22]]),
  ])
}

// ───── HLB00173: △ABC vuông tại A (AC<AB), M trung điểm BC; ME ⊥ AB tại E, MF ⊥ AC tại F ─────
{
  const A = P(0, 0), B = P(230, 0), C = P(0, -140)
  const M = mid(B, C), E = foot(M, A, B), F = foot(M, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, C) < dist(A, B), 'AC < AB')
  const cen = trongTam([A, B, C])
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(M, E), seg(M, F),
    rightAngle(A, B, C, 14), rightAngle(E, M, A, 11), rightAngle(F, M, A, 11),
    tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan = NH(cen, [[A, 'A', -18, 20], [B, 'B', 16, 20], [C, 'C', -4, -14], [M, 'M', 16, -12], [E, 'E', 0, 26], [F, 'F', -18, 6]])
  hinh('HLB00173', [A, B, C], [...nen, ...nhan])
  // ý a: không dựng thêm. ý b (HLY00433): H trên tia MF, FM = FH; tứ giác AHFE ⇒ nối AH, FE, FH
  const H = doiXung(M, F)
  ok(gan(dist(F, H), dist(F, M)), 'FM = FH')
  hinh('HLY00433', [A, B, C, H], [...nen, seg(F, H), seg(A, H), seg(F, E), tick(F, M, 2), tick(F, H, 2), ...nhan, dot(H), label(H, 'H', -4, -14)])
  // ý c (HLY00434): I = EH ∩ AF, J trung điểm ME; nối EH, IJ. AF nằm trên AC.
  const I = inter(E, H, A, F), J = mid(M, E)
  hinh('HLY00434', [A, B, C, H], [
    ...nen, seg(F, H), seg(A, H), seg(F, E), seg(E, H), seg(I, J), tick(F, M, 2), tick(F, H, 2), tick(E, J, 3), tick(J, M, 3),
    ...nhan, dot(H), label(H, 'H', -4, -14), dot(I), label(I, 'I', -14, 20), dot(J), label(J, 'J', 16, 6),
  ])
}

// ───── HLB00174: hình chữ nhật ABCD (AB>AD); AN ⊥ BD, CM ⊥ BD ─────
{
  const A = P(0, 0), B = P(300, 0), C = P(300, -170), D = P(0, -170)
  const N = foot(A, B, D), M = foot(C, B, D)
  ok(dist(A, B) > dist(A, D), 'AB > AD')
  const cen = trongTam([A, B, C, D])
  const goc4 = [rightAngle(A, B, D, 12), rightAngle(B, A, C, 12), rightAngle(C, B, D, 12), rightAngle(D, A, C, 12)]
  const hcn = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(A, N), seg(C, M), ...goc4, rightAngle(N, A, B, 11), rightAngle(M, C, D, 11)]
  const nA = [[A, 'A', -18, 20], [B, 'B', 16, 20], [C, 'C', 16, -8], [D, 'D', -16, -8]]
  hinh('HLB00174', [A, B, C, D], [...hcn, ...NH(cen, [...nA, [N, 'N', -20, 4], [M, 'M', 20, 6]])])
  // ý a: không dựng thêm. ý b (HLY00436): tứ giác ANCM ⇒ nối NC, AM; đã có AN = CM (ý a) ⇒ gạch
  hinh('HLY00436', [A, B, C, D], [...hcn, seg(N, C), seg(A, M), tick(A, N, 1), tick(C, M, 1), ...NH(cen, [...nA, [N, 'N', -20, 4], [M, 'M', 20, 6]])])
  // ý c (HLY00437): K trên tia đối của tia NA, NK = NA; nối BK, DK. Bỏ M, CM (không dùng).
  const K = doiXung(A, N)
  ok(gan(dist(N, K), dist(N, A)), 'NK = NA')
  const hcnC = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(A, N), ...goc4, rightAngle(N, A, B, 11)]
  hinh('HLY00437', [A, B, C, D, K], [...hcnC, seg(N, K), seg(B, K), seg(D, K), tick(A, N, 1), tick(N, K, 1), ...NH(cen, [...nA, [N, 'N', -20, 4], [K, 'K', 16, -10]])])
  // ý d (HLY00438): DKCB hình thang cân ⇒ nối KC; dùng M, CM. Đã chứng minh AN = CM (a), BA = BK (c).
  hinh('HLY00438', [A, B, C, D, K], [
    ...hcn, seg(N, K), seg(B, K), seg(D, K), seg(K, C), tick(A, N, 1), tick(N, K, 1), tick(C, M, 1), tick(A, B, 2), tick(B, K, 2),
    ...NH(cen, [...nA, [N, 'N', -20, 4], [M, 'M', 20, 6], [K, 'K', -4, -14]]),
  ])
}

// ───── HLB00175: △ABC vuông tại A, D ∈ BC, M, N hình chiếu của D trên AB, AC ─────
{
  const A = P(0, 0), B = P(270, 0), C = P(0, -190)
  const D = lerp(B, C, 0.35), M = foot(D, A, B), N = foot(D, A, C), H = foot(A, B, C)
  ok(gan(goc(A, B, C), 90), 'A vuông')
  const cen = trongTam([A, B, C])
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(D, M), seg(D, N),
    rightAngle(A, B, C, 14), rightAngle(M, D, A, 11), rightAngle(N, D, A, 11),
  ]
  const nhan = [[A, 'A', -18, 20], [B, 'B', 16, 20], [C, 'C', -4, -14], [D, 'D', 16, -6], [M, 'M', 0, 26], [N, 'N', -18, 6]]
  hinh('HLB00175', [A, B, C], [...nen, ...NH(cen, nhan)])
  // ý a (HLY00439): câu hỏi AD = MN ⇒ nối AD, MN
  hinh('HLY00439', [A, B, C], [...nen, seg(A, D), seg(M, N), ...NH(cen, nhan)])
  // ý b (HLY00440): kẻ AH; góc MHN ⇒ nối HM, HN. Đã chứng minh AD = MN (a) ⇒ gạch. KHÔNG ô vuông ở H cho góc MHN.
  hinh('HLY00440', [A, B, C], [
    ...nen, seg(A, D), seg(M, N), seg(A, H), seg(H, M), seg(H, N), rightAngle(H, A, C, 11), tick(A, D, 1, 0.75), tick(M, N, 1, 0.25),
    ...NH(cen, nhan), dot(H), label(H, 'H', 16, 8),
  ])
}

// ───── HLB00176: △ABC vuông tại A (AB<AC), M ∈ BC; MD ⊥ AB tại D, ME ⊥ AC tại E ─────
{
  const A = P(0, 0), B = P(0, -140), C = P(230, 0)
  const M = lerp(B, C, 0.6), D = foot(M, A, B), E = foot(M, A, C), H = foot(A, B, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const cen = trongTam([A, B, C])
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(M, D), seg(M, E),
    rightAngle(A, B, C, 14), rightAngle(D, M, A, 11), rightAngle(E, M, A, 11),
  ]
  const nhan = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [D, 'D', -18, 6], [E, 'E', 0, 26], [M, 'M', 16, -10]]
  hinh('HLB00176', [A, B, C], [...nen, ...NH(cen, nhan)])
  // ý a: không dựng thêm. ý b (HLY00442): Ax ∥ DE cắt tia ME tại F; G trên tia MD, D trung điểm MG. KHÔNG nối GA (điều phải chứng minh).
  const dir = P(E.x - D.x, E.y - D.y)               // phương DE
  const Fx = P(E.x, A.y + dir.y / dir.x * E.x)       // Ax ∩ đường ME
  const G = doiXung(M, D)
  ok(gan(Fx.x, E.x), 'F trên đường ME'); ok(Math.abs(Fx.y / Fx.x - dir.y / dir.x) < 1e-9, 'AF ∥ DE')
  ok(gan(dist(D, G), dist(D, M)), 'D trung điểm MG')
  const nhanB = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [D, 'D', -14, -12], [E, 'E', 20, 8], [M, 'M', 16, -10]]
  hinh('HLY00442', [A, B, C, Fx, G], [
    ...nen, seg(D, E), seg(A, Fx), seg(E, Fx), seg(D, G), tick(D, M, 1), tick(D, G, 1),
    ...NH(cen, nhanB), dot(Fx), label(Fx, 'F', 18, 8), dot(G), label(G, 'G', -4, -14),
  ])
  // ý c (HLY00443): AM ∩ DE = O, đường cao AH; góc DHE ⇒ nối HD, HE. Bỏ F, G, Ax (không dùng).
  const O = inter(A, M, D, E)
  ok(gan(goc(H, A, B), 90), 'AH ⊥ BC')
  hinh('HLY00443', [A, B, C], [
    ...nen, seg(D, E), seg(A, M), seg(A, H), seg(H, D), seg(H, E), rightAngle(H, A, C, 11),
    ...NH(cen, nhan), dot(O), label(O, 'O', 0, 30), dot(H), label(H, 'H', 14, -10),
  ])
}

// ───── HLB00177: hình chữ nhật ABCD; H hình chiếu của B trên AC; M, N, P trung điểm AB, AH, DC ─────
{
  const A = P(0, 0), B = P(300, 0), C = P(300, -170), D = P(0, -170)
  const H = foot(B, A, C), M = mid(A, B), N = mid(A, H), P_ = mid(D, C)
  const K = inter(N, P(N.x + 1, N.y), B, H)
  const cen = trongTam([A, B, C, D])
  const goc4 = [rightAngle(A, B, D, 12), rightAngle(B, A, C, 12), rightAngle(C, B, D, 12), rightAngle(D, A, C, 12)]
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, H), ...goc4, rightAngle(H, B, A, 11),
    tick(A, M, 1), tick(M, B, 1), tick(D, P_, 2), tick(P_, C, 2), tick(A, N, 3, 0.5), tick(N, H, 3, 0.5),
  ]
  const nhan = [[A, 'A', -18, 20], [B, 'B', 16, 20], [C, 'C', 16, -8], [D, 'D', -16, -8], [H, 'H', -16, -12], [M, 'M', 0, 26], [N, 'N', -18, -4], [P_, 'P', 0, -14]]
  hinh('HLB00177', [A, B, C, D], [...nen, ...NH(cen, nhan)])
  // ý a (HLY00444): MBCP ⇒ nối MP
  hinh('HLY00444', [A, B, C, D], [...nen, seg(M, P_), ...NH(cen, nhan)])
  // ý b (HLY00445): MN ⊥ AC ⇒ nối MN (không ô vuông — điều phải chứng minh). Bỏ MP.
  hinh('HLY00445', [A, B, C, D], [...nen, seg(M, N), ...NH(cen, nhan)])
  // ý c (HLY00446): NK ∥ AB (K ∈ BH); NKCP ⇒ nối NK, KC, PN. Đã chứng minh MN ⊥ AC (b) ⇒ ô vuông ở N.
  hinh('HLY00446', [A, B, C, D], [
    ...nen, seg(M, N), seg(N, K), seg(K, C), seg(P_, N), rightAngle(N, M, A, 11),
    ...NH(cen, nhan), dot(K), label(K, 'K', 16, 6),
  ])
  // ý d (HLY00447): K trung điểm BH ⇒ chỉ cần MN, NK
  hinh('HLY00447', [A, B, C, D], [
    ...nen, seg(M, N), seg(N, K), rightAngle(N, M, A, 11),
    ...NH(cen, nhan), dot(K), label(K, 'K', 16, 6),
  ])
}

// ───── HLB00178: △ABC vuông tại A (AB<AC), đường cao AH, HM ⊥ AB, HN ⊥ AC; I trung điểm HC; I trung điểm AK ─────
{
  const A = P(0, 0), B = P(0, -140), C = P(230, 0)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C), I = mid(H, C), K = doiXung(A, I), O = inter(M, N, A, H)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const cen = trongTam([A, B, C])
  const goc3 = [rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(M, H, A, 10), rightAngle(N, H, A, 10)]
  const goc_ = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(H, N)]
  const nTam = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [H, 'H', 14, -10], [M, 'M', -18, 6], [N, 'N', 0, 26]]
  const nhanIK = [[I, 'I', 12, 24], [K, 'K', 16, -6]]
  const nenIK = [seg(A, K), tick(H, I, 1), tick(I, C, 1), tick(A, I, 2, 0.5), tick(I, K, 2, 0.5)]
  hinh('HLB00178', [A, B, C, K], [...goc_, ...goc3, ...nenIK, ...NH(cen, [...nTam, ...nhanIK])])
  // ý a (HLY00448): AC ∥ HK ⇒ nối HK
  hinh('HLY00448', [A, B, C, K], [...goc_, ...goc3, ...nenIK, seg(H, K), ...NH(cen, [...nTam, ...nhanIK])])
  // ý b (HLY00449): MN ∩ AH = O. Không dùng I, K ⇒ bỏ.
  hinh('HLY00449', [A, B, C], [...goc_, ...goc3, seg(M, N), ...NH(cen, [...nTam, [O, 'O', -14, -10]])])
  // ý c (HLY00450): MNCK hình thang cân ⇒ nối MN, KC, MK (MK đi qua H). Đã chứng minh AHKC là hình bình hành ⇒ nối HK, KC.
  hinh('HLY00450', [A, B, C, K], [...goc_, ...goc3, ...nenIK, seg(M, N), seg(K, C), seg(H, K), ...NH(cen, [...nTam, ...nhanIK])])
}

// ───── HLB00179: △ABC vuông tại A (AB<AC), đường cao AH, M trung điểm HC, D trên tia đối của tia MA, MD = MA ─────
{
  const A = P(0, 0), B = P(0, -140), C = P(230, 0)
  const H = foot(A, B, C), M = mid(H, C), D = doiXung(A, M)
  const N = mid(A, H), K = mid(C, D)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const cen = trongTam([A, B, C])
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(A, D), rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), tick(H, M, 1), tick(M, C, 1), tick(A, M, 2, 0.5), tick(M, D, 2, 0.5)]
  const nhan = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [H, 'H', 14, -12], [M, 'M', 0, 32], [D, 'D', 16, -6]]
  hinh('HLB00179', [A, B, C, D], [...nen, ...NH(cen, nhan)])
  // ý a (HLY00451): AHDC ⇒ nối HD, DC
  hinh('HLY00451', [A, B, C, D], [...nen, seg(H, D), seg(D, C), ...NH(cen, nhan)])
  // ý b (HLY00452): N, K trung điểm AH, CD; HNCK ⇒ nối NC, KH. Đã chứng minh AHDC bình hành ⇒ giữ HD, DC.
  hinh('HLY00452', [A, B, C, D], [
    ...nen, seg(H, D), seg(D, C), seg(N, C), seg(K, H), tick(A, N, 3), tick(N, H, 3), tick(C, K, 4), tick(K, D, 4),
    ...NH(cen, [...nhan, [N, 'N', -16, 6], [K, 'K', 18, 12]]),
  ])
  // ý c (HLY00453): M trung điểm NK ⇒ nối NK; HD không dùng ⇒ bỏ.
  hinh('HLY00453', [A, B, C, D], [
    ...nen, seg(D, C), seg(N, C), seg(K, H), seg(N, K), tick(A, N, 3), tick(N, H, 3), tick(C, K, 4), tick(K, D, 4),
    ...NH(cen, [...nhan, [N, 'N', -16, 6], [K, 'K', 18, 12]]),
  ])
}

// ───── HLB00180: △ABC vuông tại A (AB>AC), E trung điểm BC; D, H hình chiếu của E trên AB, AC ─────
{
  const A = P(0, 0), B = P(285, 0), C = P(0, -175)
  const E = mid(B, C), D = foot(E, A, B), H = foot(E, A, C), F = doiXung(E, D)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) > dist(A, C), 'AB > AC')
  const cen = trongTam([A, B, C])
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(E, D), seg(E, H),
    rightAngle(A, B, C, 14), rightAngle(D, E, A, 11), rightAngle(H, E, A, 11), tick(B, E, 1), tick(E, C, 1),
  ]
  const nhan = [[A, 'A', -18, 20], [B, 'B', 16, 20], [C, 'C', -4, -14], [E, 'E', 16, -8], [D, 'D', 18, 24], [H, 'H', -18, 6]]
  hinh('HLB00180', [A, B, C], [...nen, ...NH(cen, nhan)])
  // ý a, b: không dựng thêm. ý c (HLY00456): F: D trung điểm EF; AHDF ⇒ nối HD, AF, DF
  hinh('HLY00456', [A, B, C, F], [...nen, seg(D, F), seg(H, D), seg(A, F), tick(E, D, 2), tick(D, F, 2), ...NH(cen, nhan), dot(F), label(F, 'F', 18, 8)])
  // ý d (HLY00457): O = AD ∩ HF ⇒ nối HF (AD nằm trên AB)
  const O = inter(A, D, H, F)
  hinh('HLY00457', [A, B, C, F], [
    ...nen, seg(D, F), seg(H, D), seg(A, F), seg(H, F), tick(E, D, 2), tick(D, F, 2),
    ...NH(cen, nhan), dot(F), label(F, 'F', 18, 8), dot(O), label(O, 'O', -12, 26),
  ])
}

// ───── HLB00181: △ABC vuông tại A (AB<AC), M ∈ BC, BM > MC; N, D hình chiếu của M trên AB, AC ─────
{
  const A = P(0, 0), B = P(0, -140), C = P(230, 0)
  const M = lerp(B, C, 0.58), N = foot(M, A, B), D = foot(M, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC'); ok(dist(B, M) > dist(M, C), 'BM > MC')
  const cen = trongTam([A, B, C])
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(M, D), rightAngle(A, B, C, 14), rightAngle(N, M, A, 11), rightAngle(D, M, A, 11)]
  const nhan = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [M, 'M', 16, -10], [N, 'N', -18, 6], [D, 'D', 8, 26]]
  hinh('HLB00181', [A, B, C], [...nen, ...NH(cen, nhan)])
  // ý a: không dựng thêm. ý b (HLY00459): P trên tia đối của tia NM, NM = NP; APND ⇒ nối NP, AP, ND
  const nhanP = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 18], [M, 'M', 16, -10], [N, 'N', -16, -12], [D, 'D', 24, 20]]
  const P2 = doiXung(M, N)
  ok(gan(dist(N, P2), dist(N, M)), 'NM = NP')
  hinh('HLY00459', [A, B, C, P2], [...nen, seg(N, P2), seg(A, P2), seg(N, D), tick(N, M, 1), tick(N, P2, 1), ...NH(cen, nhanP), dot(P2), label(P2, 'P', -4, -14)])
  // ý c (HLY00460): Q hình chiếu của M trên AP (Q ở phía A của đường AP), O = QM ∩ ND ⇒ nối QM, QA…, QN, ND. Q nằm trên tia đối của tia AP: nối P–Q đi qua A.
  const Q = foot(M, A, P2), O = inter(Q, M, N, D)
  ok(gan(goc(Q, M, A), 90), 'MQ ⊥ AP')
  hinh('HLY00460', [A, B, C, P2, Q], [
    ...nen, seg(N, P2), seg(P2, Q), seg(N, D), seg(M, Q), seg(Q, N), rightAngle(Q, M, A, 11), tick(N, M, 1), tick(N, P2, 1),
    ...NH(cen, nhanP), dot(P2), label(P2, 'P', -4, -14), dot(Q), label(Q, 'Q', 8, 24), dot(O), label(O, 'O', -6, -16),
  ])
}

// ───── HLB00182: △ABC vuông tại A, M trung điểm BC, M trung điểm AD ─────
{
  const A = P(0, 0), B = P(0, -130), C = P(200, 0)
  const M = mid(B, C), D = doiXung(A, M), E = P(400, 0), O = mid(C, D)
  ok(gan(goc(A, B, C), 90), 'A vuông')
  const cen = trongTam([A, B, C])
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), rightAngle(A, B, C, 14), tick(B, M, 1), tick(M, C, 1), tick(A, M, 2, 0.5), tick(M, D, 2, 0.5)]
  const nhan = [[A, 'A', -18, 20], [B, 'B', -16, -8], [C, 'C', 16, 22], [M, 'M', -4, 26], [D, 'D', 16, -8]]
  hinh('HLB00182', [A, B, C, D], [...nen, ...NH(cen, nhan)])
  // ý a (HLY00461): ABDC ⇒ nối BD, DC
  hinh('HLY00461', [A, B, C, D], [...nen, seg(B, D), seg(D, C), ...NH(cen, nhan)])
  // ý b (HLY00462): E trên tia đối của tia CA, CE = CA; BDEC ⇒ nối CE, DE
  ok(gan(dist(C, E), dist(C, A)), 'CE = CA')
  hinh('HLY00462', [A, B, E, D], [
    ...nen, seg(B, D), seg(D, C), seg(C, E), seg(D, E), tick(A, C, 3), tick(C, E, 3),
    ...NH(cen, nhan), dot(E), label(E, 'E', 16, 22),
  ])
  // ý c (HLY00463): O trung điểm CD ⇒ nối BE
  hinh('HLY00463', [A, B, E, D], [
    ...nen, seg(B, D), seg(D, C), seg(C, E), seg(D, E), seg(B, E), tick(A, C, 3), tick(C, E, 3), tick(C, O, 4), tick(O, D, 4),
    ...NH(cen, nhan), dot(E), label(E, 'E', 16, 22), dot(O), label(O, 'O', 16, -10),
  ])
}

await xuatTat(RA)
