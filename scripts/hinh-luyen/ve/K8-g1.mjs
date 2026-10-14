// Gói vẽ HÌNH THEO Ý — K8-g1 (14 bài lớp 8). Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-g1.mjs [<thư mục ra>]
// HLB… = hình giả thiết chung (bài một ý: toàn bộ đề của ý) · HLY… = hình ý có dựng thêm.
import { P, seg, tick, rightAngle, angleMark, dot, label, num, hinh, xuatTat, mid, lerp, foot, inter, doiXung, dist, goc, ray, labelOut, angleText, trongTam } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g1/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5
const du = (p, a, b) => Math.abs((p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x)) < 1e-6 * (1 + dist(a, b) * dist(a, p)) // p thuộc đường ab
const LO = (p, t, from, d = 22) => labelOut(p, t, from, d)

// ───── HLB00095 (HHC002385) — một ý: A, H, C... AH ⊥ BC tại H; I trung điểm AC và HE ─────
{
  const A = P(0, -140), H = P(0, 0), B = P(-140, 0), C = P(260, 0)
  const I = mid(A, C), E = doiXung(H, I)
  ok(gan(goc(H, A, C), 90), 'AH ⊥ BC')
  const cen = trongTam([A, H, C, E, B])
  hinh('HLB00095', [A, B, C, E], [
    seg(A, B), seg(B, C), seg(A, H), seg(A, C), seg(H, E), seg(A, E), seg(E, C),
    rightAngle(H, A, C, 13), tick(A, I, 1), tick(I, C, 1), tick(H, I, 2), tick(I, E, 2),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(I),
    LO(A, 'A', cen), LO(B, 'B', cen), LO(C, 'C', cen), label(H, 'H', -4, 28), LO(E, 'E', cen), label(I, 'I', 0, -14),
  ])
}

// ───── HLB00097 (HHC002390): △ABC vuông tại A, đường cao AH, trung tuyến AM; HD ⊥ AB, HE ⊥ AC; DE cắt AH ở O, cắt AM ở Q ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const H = foot(A, B, C), M = mid(B, C), D = foot(H, A, B), E = foot(H, A, C)
  const O = inter(D, E, A, H), Q = inter(D, E, A, M)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB<AC (AH≠AM)')
  ok(gan(goc(D, H, A), 90) && gan(goc(E, H, A), 90), 'HD⊥AB, HE⊥AC')
  ok(dist(Q, O) > 15, 'O, Q tách nhau')
  const cen = trongTam([A, B, C])
  const nenTam = [seg(A, B), seg(B, C), seg(C, A), seg(H, D), seg(H, E), rightAngle(A, B, C, 13), rightAngle(D, H, A, 11), rightAngle(E, H, A, 11)]
  const nhanTam = [dot(A), dot(B), dot(C), dot(H), dot(D), dot(E),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(H, 'H', 14, -10), label(D, 'D', -20, 6), label(E, 'E', 0, 26)]
  // hình bài: giả thiết chung đủ (AH, AM, DE, O, Q)
  const bai = [
    ...nenTam, seg(A, H), seg(A, M), seg(D, E), rightAngle(H, A, C, 11), tick(B, M, 1, 0.25), tick(M, C, 1),
    ...nhanTam, dot(M), dot(O), dot(Q), label(M, 'M', 14, -10), label(O, 'O', 0, -22), label(Q, 'Q', 40, 10),
  ]
  hinh('HLB00097', [A, B, C], bai)
  // ý b (HLY00245): K đối xứng A qua E ⇒ nối HK; bỏ AH, AM, O, Q (không dùng); ADHE là hình chữ nhật (ý a) ⇒ ô vuông ở H
  const K = doiXung(A, E)
  ok(gan(dist(E, K), dist(E, A)), 'E trung điểm AK')
  hinh('HLY00245', [A, B, C, K], [
    ...nenTam, seg(D, E), seg(E, K), seg(H, K), rightAngle(H, D, E, 11), tick(A, E, 2), tick(E, K, 2),
    ...nhanTam, dot(K), label(K, 'K', 4, 26),
  ])
  // ý c (HLY00246): AEQ vuông ở Q — hình như hình bài (bỏ K); KHÔNG đánh dấu góc vuông ở Q
  hinh('HLY00246', [A, B, C], [
    ...nenTam, rightAngle(H, A, C, 11),
    seg(A, H), seg(A, M), seg(D, E), tick(B, M, 1, 0.25), tick(M, C, 1),
    ...nhanTam, dot(M), dot(O), dot(Q), label(M, 'M', 14, -10), label(O, 'O', 0, -22), label(Q, 'Q', 40, 10),
  ])
}

// ───── HLB00098 (HHC002391): △ABC cân tại A, đường cao AH, I trung điểm AC ─────
{
  const A = P(0, -260), B = P(-120, 0), C = P(120, 0), H = P(0, 0)
  const I = mid(A, C), K = doiXung(H, I), G = mid(A, B)
  ok(gan(dist(A, B), dist(A, C)), 'cân tại A')
  const cen = trongTam([A, B, C])
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), rightAngle(H, A, C, 13), tick(A, B, 1, 0.14), tick(A, C, 1, 0.14), tick(A, I, 2), tick(I, C, 2)]
  // tick AC nhóm 1 đặt lệch (t=0.3) để khỏi trùng tick AI/IC nhóm 2
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(I),
    LO(A, 'A', cen), LO(B, 'B', cen), LO(C, 'C', cen), label(H, 'H', 0, 28), label(I, 'I', 20, -6)]
  hinh('HLB00098', [A, B, C], [...nen, ...nhan])
  // ý a (HLY00247): câu hỏi nhắc HI ⇒ nối HI
  hinh('HLY00247', [A, B, C], [...nen, seg(H, I), ...nhan])
  // ý b (HLY00248): K trên tia đối IH, IK = IH ⇒ nối HK, AK, CK (tứ giác AHCK)
  ok(gan(dist(I, K), dist(I, H)), 'IK=IH')
  const nenB = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), rightAngle(H, A, C, 13), tick(A, B, 1, 0.14), tick(A, C, 1, 0.14), tick(A, I, 2), tick(I, C, 2)]
  hinh('HLY00248', [A, B, C, K], [
    ...nenB, seg(H, K), seg(A, K), seg(C, K), tick(H, I, 3), tick(I, K, 3),
    ...nhan, dot(K), label(K, 'K', 14, -10),
  ])
  // ý c: AKHB đã đủ cạnh ở hình ý b ⇒ không vẽ
  // ý d (HLY00250): G trung điểm AB; BK, GI. Bỏ CK (không dùng). KHÔNG vẽ điểm đồng quy.
  hinh('HLY00250', [A, B, C, K], [
    ...nenB, seg(H, K), seg(A, K), seg(B, K), seg(G, I), tick(H, I, 3), tick(I, K, 3), tick(A, G, 4), tick(G, B, 4),
    ...nhan, dot(K), dot(G), label(K, 'K', 14, -10), label(G, 'G', -18, -6),
  ])
}

// ───── HLB00099 (HHC002392): △ABC vuông tại A (AB<AC, AC≠2AB), M trung điểm BC; MH ⊥ AC; D trên tia HM, HM = MD ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(290, 0)
  const M = mid(B, C), H = foot(M, A, C), D = doiXung(H, M)
  ok(gan(goc(A, B, C), 90) && dist(A, B) < dist(A, C) && Math.abs(dist(A, C) - 2 * dist(A, B)) > 20, 'AB<AC, AC≠2AB')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, H), seg(M, D), rightAngle(A, B, C, 13), rightAngle(H, M, A, 12), tick(B, M, 1), tick(M, C, 1), tick(H, M, 2), tick(M, D, 2)]
  const nhan = [dot(A), dot(B), dot(C), dot(M), dot(H), dot(D),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(M, 'M', 20, -12), label(H, 'H', 0, 28), label(D, 'D', 0, -14)]
  hinh('HLB00099', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00251): tứ giác BHCD ⇒ nối BH, CD, BD (HC nằm trên AC)
  hinh('HLY00251', [A, B, C, D], [...nen, seg(B, H), seg(C, D), seg(B, D), ...nhan])
  // ý b: ABDH đã đủ cạnh (AB, BD, DH, HA) ⇒ không vẽ
  // ý c (HLY00253): đường qua A // BC cắt đường qua C // AM tại K. Bỏ H, D (không dùng).
  const K = inter(A, P(A.x + C.x - B.x, A.y + C.y - B.y), C, P(C.x + M.x - A.x, C.y + M.y - A.y))
  ok(du(K, A, P(A.x + C.x - B.x, A.y + C.y - B.y)) && gan(dist(A, M), dist(M, C)), 'K đúng, AM=MC')
  hinh('HLY00253', [A, B, C, K], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(A, K), seg(C, K), rightAngle(A, B, C, 13), tick(B, M, 1), tick(M, C, 1),
    dot(A), dot(B), dot(C), dot(M), dot(K),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 8), label(M, 'M', 16, -8), label(K, 'K', 0, 28),
  ])
  // ý d: không dựng thêm ⇒ dùng hình ý c
}

// ───── HLB00100 (HHC002393): hình thoi ABCD có Â = 60°; BH ⊥ AD; E trên tia đối HB, HE = BH; nối EA, ED ─────
{
  const Lc = 170
  const A = P(0, 0), D = P(Lc, 0), B = ray(A, 60, Lc), C = P(B.x + Lc, B.y)
  const H = foot(B, A, D), E = doiXung(B, H)
  ok(gan(goc(A, B, D), 60), 'Â=60°'); ok(gan(dist(H, E), dist(H, B)), 'HE=BH')
  const cen = trongTam([A, B, C, D])
  const nenGoc = [angleMark(A, B, D, 34, 1)]
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, E), seg(E, A), seg(E, D),
    rightAngle(H, B, D, 12), tick(A, B, 1), tick(B, C, 1), tick(C, D, 1), tick(D, A, 1, 0.75), tick(H, B, 2), tick(H, E, 2),
    ...nenGoc, angleText(A, B, D, '60°', 74, 20),
  ]
  const nhan = [dot(A), dot(B), dot(C), dot(D), dot(E), dot(H),
    label(A, 'A', -20, 20), LO(B, 'B', cen, 22), LO(C, 'C', cen, 22), label(D, 'D', 20, 18), LO(E, 'E', cen, 22), label(H, 'H', -14, 28)]
  hinh('HLB00100', [A, B, C, D, E], [...nen, ...nhan])
  // ý a (HLY00255): tứ giác ABDE ⇒ nối BD
  hinh('HLY00255', [A, B, C, D, E], [...nen, seg(B, D), ...nhan])
  // ý b (HLY00256): ABDE là hình thoi (ý a) ⇒ BD = DE = EA = AB. KHÔNG nối E–C.
  const dauB = [tick(B, D, 1), tick(D, E, 1), tick(E, A, 1)]
  hinh('HLY00256', [A, B, C, D, E], [...nen, seg(B, D), ...dauB, ...nhan])
  // ý c (HLY00257): EB = AC ⇒ nối AC
  hinh('HLY00257', [A, B, C, D, E], [...nen.filter((x) => !x.includes('60°')), num(ray(A, 45, 85), '60°', 0, 7, 20), seg(B, D), ...dauB, seg(A, C), ...nhan])
}

// ───── HLB00101 (HHC002397): hình vuông ABCD; E, F, K trung điểm AB, BC, CD ─────
{
  const S = 260
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const E = mid(A, B), F = mid(B, C), K = mid(C, D)
  const M = inter(D, F, C, E), N = inter(A, K, D, F)
  ok(gan(dist(N, D), dist(N, M)), 'N trung điểm DM (kiểm hình)')
  const cen = trongTam([A, B, C, D])
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    rightAngle(A, B, D, 13), rightAngle(B, A, C, 13), rightAngle(C, B, D, 13), rightAngle(D, A, C, 13),
    tick(A, E, 1), tick(E, B, 1), tick(B, F, 1), tick(F, C, 1), tick(C, K, 1), tick(K, D, 1),
  ]
  const nhan = [dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(K),
    label(A, 'A', -18, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 22), label(D, 'D', -18, 22),
    label(E, 'E', 0, -14), label(F, 'F', 20, 8), label(K, 'K', 0, 30)]
  hinh('HLB00101', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00258): tứ giác AECK ⇒ nối EC, KA
  hinh('HLY00258', [A, B, C, D], [...nen, seg(E, C), seg(A, K), ...nhan])
  // ý b (HLY00259): DF cắt CE tại M. Bỏ AK (không dùng). KHÔNG đánh dấu vuông tại M.
  hinh('HLY00259', [A, B, C, D], [...nen, seg(E, C), seg(D, F), ...nhan, dot(M), label(M, 'M', 4, -22)])
  // ý c (HLY00260): AK cắt DF tại N; DF ⊥ CE tại M (ý b) ⇒ ô vuông ở M. KHÔNG nối MK.
  hinh('HLY00260', [A, B, C, D], [
    ...nen, seg(E, C), seg(D, F), seg(A, K), rightAngle(M, F, C, 11),
    ...nhan, dot(M), dot(N), label(M, 'M', 4, -22), label(N, 'N', -18, -4),
  ])
}

// ───── HLB00102 (HHC002400): AC = BD, cắt nhau tại trung điểm O ─────
{
  const O = P(0, 0), A = ray(O, 140, 170), C = doiXung(A, O), B = ray(O, 35, 170), D = doiXung(B, O)
  ok(gan(dist(A, C), dist(B, D)), 'AC=BD')
  const nen = [seg(A, C), seg(B, D), tick(O, A, 1), tick(O, B, 1), tick(O, C, 1), tick(O, D, 1)]
  const nhan = [dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -18, -4), label(B, 'B', 18, -4), label(C, 'C', 18, 22), label(D, 'D', -18, 22), label(O, 'O', 0, -16)]
  hinh('HLB00102', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00261): tứ giác ABCD ⇒ nối AB, BC, CD, DA. Ý b không dựng thêm ⇒ dùng hình ý a.
  hinh('HLY00261', [A, B, C, D], [...nen, seg(A, B), seg(B, C), seg(C, D), seg(D, A), ...nhan])
}

// ───── HLB00104 (HHC002404): △ABC vuông cân tại A, M bất kì trên BC; MN ⊥ AB tại N, MP ⊥ AC tại P ─────
{
  const A = P(0, 0), B = P(0, -250), C = P(250, 0)
  const M = lerp(B, C, 0.36), N = foot(M, A, B), Pp = foot(M, A, C)
  ok(gan(dist(A, B), dist(A, C)) && gan(goc(A, B, C), 90), 'vuông cân')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(M, Pp), rightAngle(A, B, C, 13), rightAngle(N, M, A, 11), rightAngle(Pp, M, A, 11), tick(A, B, 1), tick(A, C, 1)]
  const nhan = [dot(A), dot(B), dot(C), dot(M), dot(N), dot(Pp),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(M, 'M', 16, -8), label(N, 'N', -18, 8), label(Pp, 'P', 0, 28)]
  hinh('HLB00104', [A, B, C], [...nen, ...nhan])
  // ý a: MPAN đủ cạnh ở hình bài ⇒ không vẽ
  // ý b (HLY00267): AM = NP ⇒ nối AM, NP; MPAN là hình chữ nhật (ý a) ⇒ ô vuông ở M. Ý c không dựng thêm.
  hinh('HLY00267', [A, B, C], [...nen, seg(A, M), seg(N, Pp), rightAngle(M, N, Pp, 11), ...nhan])
}

// ───── HLB00105 (HHC002410): hình bình hành ABCD; E, F trung điểm AB, CD ─────
{
  const A = P(0, 0), B = P(300, 0), D = P(90, -170), C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  const E = mid(A, B), F = mid(C, D)
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), tick(A, E, 1), tick(E, B, 1), tick(D, F, 2), tick(F, C, 2)]
  const nhan = [dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', -16, 20), label(B, 'B', 16, 20), label(C, 'C', 16, -6), label(D, 'D', -16, -6), label(E, 'E', 0, 28), label(F, 'F', 0, -14)]
  hinh('HLB00105', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00269): tứ giác AECF ⇒ nối EC, FA. Ý b không dựng thêm.
  hinh('HLY00269', [A, B, C, D], [...nen, seg(E, C), seg(F, A), ...nhan])
}

// ───── HLB00106 (HHC002419): △ABC cân tại A, đường cao AH; I trung điểm AB; I trung điểm HM ─────
{
  const A = P(0, -260), B = P(-120, 0), C = P(120, 0), H = P(0, 0)
  const I = mid(A, B), M = doiXung(H, I), K = mid(H, B), E = mid(A, H)
  ok(gan(dist(A, B), dist(A, C)), 'cân tại A')
  const cen = trongTam([A, B, C])
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), rightAngle(H, A, C, 13), tick(A, B, 1, 0.9), tick(A, C, 1, 0.5), tick(A, I, 2), tick(I, B, 2), tick(H, I, 3), tick(I, M, 3)]
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(I), dot(M),
    LO(A, 'A', cen), LO(B, 'B', cen), LO(C, 'C', cen), label(H, 'H', 14, 26), label(I, 'I', 20, 6), label(M, 'M', -18, -4)]
  hinh('HLB00106', [A, B, C, M], [...nen, ...nhan])
  // ý a (HLY00271): tứ giác AHBM ⇒ nối AM, BM
  hinh('HLY00271', [A, B, C, M], [...nen, seg(A, M), seg(B, M), ...nhan])
  // ý b (HLY00272): K trung điểm HB; nối KI. AHBM là hình chữ nhật (ý a).
  hinh('HLY00272', [A, B, C, M], [...nen, seg(A, M), seg(B, M), seg(K, I), tick(H, K, 4), tick(K, B, 4), ...nhan, dot(K), label(K, 'K', 0, 28)])
  // ý c (HLY00273): E trung điểm AH. Bỏ K, KI (không dùng). KHÔNG nối C–E–M.
  hinh('HLY00273', [A, B, C, M], [...nen, seg(A, M), seg(B, M), tick(A, E, 4), tick(E, H, 4), ...nhan, dot(E), label(E, 'E', 16, 4)])
}

// ───── HLB00107 (HHC002422) — một ý: hình bình hành ABCD có AC ⊥ BD, cắt nhau tại O ─────
{
  const O = P(0, 0), A = P(0, -105), C = P(0, 105), B = P(140, 0), D = P(-140, 0)
  ok(gan(goc(O, A, B), 90), 'AC ⊥ BD')
  hinh('HLB00107', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), rightAngle(O, A, B, 13),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', 0, -14), label(B, 'B', 20, 8), label(C, 'C', 0, 32), label(D, 'D', -20, 8), label(O, 'O', -16, -8),
  ])
}

// ───── HLB00108 (HHC002423) — một ý: hình chữ nhật ABCD, AB = 2BC; AC, BD cắt nhau tại I; E, F trung điểm AB, CD ─────
{
  const A = P(0, 0), B = P(360, 0), C = P(360, 180), D = P(0, 180)
  const E = mid(A, B), F = mid(C, D), I = inter(A, C, B, D)
  ok(gan(dist(A, B), 2 * dist(B, C)), 'AB=2BC')
  hinh('HLB00108', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, F), seg(A, F), seg(E, C), seg(E, D),
    rightAngle(A, B, D, 13), rightAngle(B, A, C, 13), rightAngle(C, B, D, 13), rightAngle(D, A, C, 13),
    tick(A, E, 2), tick(E, B, 2), tick(D, F, 2), tick(F, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(A, 'A', -18, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 22), label(D, 'D', -18, 22),
    label(E, 'E', 0, -14), label(F, 'F', 0, 32), label(I, 'I', 16, 34),
  ])
}

await xuatTat(RA)
