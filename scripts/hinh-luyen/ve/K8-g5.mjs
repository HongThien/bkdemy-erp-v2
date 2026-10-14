// Gói vẽ HÌNH THEO Ý — K8-g5. Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-g5.mjs [<thư mục ra>]
// HLB… = hình giả thiết chung · HLY… = hình của ý có dựng thêm (ý không dựng thêm ⇒ không có tệp).
import { P, seg, tick, rightAngle, dot, label, num, hinh, xuatTat, mid, foot, inter, doiXung, lerp, sideText, dist, goc, trongTam } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g5/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5
const ganD = (a, b) => Math.abs(a - b) < 0.6
/** nhãn tên điểm đẩy theo hướng (vx,vy) (toạ độ ảnh, y xuống) d px */
const lb = (p, t, vx, vy, d = 24) => { const l = Math.hypot(vx, vy); return label(P(p.x + vx / l * d, p.y + vy / l * d), t, 0, 9) }
const pt = (p, t, vx, vy, d = 24) => dot(p) + lb(p, t, vx, vy, d)
const ra = (v, p, q, s = 13) => rightAngle(v, p, q, s)
const song = (a, b) => Math.abs((a.x * b.y - a.y * b.x)) < 1e-6   // 2 véc-tơ cùng phương

// ───── HLB00145: △ABC vuông cân tại A; M trung điểm BC; D trên tia đối của MA; DE ⊥ AB, DF ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -200), C = P(200, 0), M = mid(B, C), D = lerp(A, M, 1.3)
  const E = foot(D, A, B), F = foot(D, A, C)
  ok(gan(goc(A, B, C), 90) && gan(dist(A, B), dist(A, C)), '145: vuông cân A')
  ok(Math.abs(dist(M, D) - dist(M, A)) > 5, '145: MD ≠ MA')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(D, E), seg(D, F),
    ra(A, B, C, 14), ra(E, D, A, 12), ra(F, D, A, 12),
    tick(A, B, 1, 0.82), tick(A, C, 1, 0.82), tick(B, M, 2), tick(M, C, 2),
  ]
  const nhan = [
    pt(A, 'A', -1, 1), pt(B, 'B', -1, -0.6), pt(C, 'C', 1, 1), pt(M, 'M', -1, 0.3, 26),
    pt(D, 'D', 1, -1), pt(E, 'E', -1, 0), pt(F, 'F', 0, 1, 26),
  ]
  const pts = [A, B, C, D]
  hinh('HLB00145', pts, [...nen, ...nhan])
  // ý a: AEDF đã đủ cạnh ⇒ không vẽ
  // ý b: EF; AEDF là hình vuông (đã chứng minh ở ý a) ⇒ đánh dấu
  const vuong = [ra(D, E, F, 12), tick(A, E, 3), tick(E, D, 3), tick(D, F, 3), tick(F, A, 3)]
  hinh('HLY00353', pts, [...nen, seg(E, F), ...vuong, ...nhan])
  // ý c: MF, EN ⊥ MF tại N; nối AN, ND (câu hỏi nhắc ∠AND)
  const N = foot(E, M, F)
  ok(gan(goc(N, E, F), 90), '145: EN ⊥ MF')
  hinh('HLY00354', [...pts, N], [
    ...nen, seg(E, F), ...vuong, seg(N, F), seg(E, N), ra(N, E, F, 12), seg(A, N), seg(N, D),
    ...nhan, pt(N, 'N', 0, -1, 26),
  ])
}

// ───── HLB00146: bài một ý — △ABC vuông tại A, BC = 8 cm, M trung điểm BC; hỏi AM ─────
{
  const A = P(0, 0), B = P(0, -150), C = P(250, 0), M = mid(B, C)
  ok(gan(goc(A, B, C), 90), '146: vuông A')
  const t = sideText(B, C, '8 cm', A, 30)
  hinh('HLB00146', [A, B, C, P(M.x + 60, M.y - 40)], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), ra(A, B, C, 14), tick(B, M, 1), tick(M, C, 1),
    t, pt(A, 'A', -1, 1), pt(B, 'B', -1, -0.6), pt(C, 'C', 1, 1), pt(M, 'M', 0.15, 1, 28),
  ])
}

// ───── HLB00147: △ABC vuông tại A (AB > AC), trung tuyến AM; MD ⊥ AB tại D, ME ⊥ AC tại E ─────
{
  const A = P(0, 0), B = P(300, 0), C = P(0, -180), M = mid(B, C)
  const D = foot(M, A, B), E = foot(M, A, C), O = mid(M, E)
  ok(gan(goc(A, B, C), 90) && dist(A, B) > dist(A, C), '147: vuông A, AB > AC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(M, D), seg(M, E),
    ra(A, B, C, 14), ra(D, M, A, 12), ra(E, M, A, 12), tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan = [pt(A, 'A', -1, 1), pt(B, 'B', 1, 1), pt(C, 'C', -1, -0.6), pt(M, 'M', 1, -0.7), pt(D, 'D', 0, 1, 26), pt(E, 'E', -1, 0)]
  const pts = [A, B, C]
  hinh('HLB00147', pts, [...nen, ...nhan])
  // ý a: ADME đủ cạnh ⇒ không vẽ
  // ý b: O trung điểm ME; ADME là hình chữ nhật (ý a) ⇒ góc vuông ở M. KHÔNG nối DC.
  hinh('HLY00357', pts, [...nen, ra(M, D, E, 12), tick(M, O, 2), tick(O, E, 2), ...nhan, pt(O, 'O', 0, -1, 22)])
  // ý c: không dùng O ⇒ bỏ; AE = EC (ý b) ⇒ đánh dấu
  hinh('HLY00358', pts, [...nen, ra(M, D, E, 12), tick(A, E, 3), tick(E, C, 3), ...nhan])
}

// ───── HLB00148: △ABC nhọn, AB < BC, AB < AC; M trung điểm AB; MN ∥ BC (N ∈ AC); D ∈ BC, BD = MN ─────
{
  const B = P(0, 0), C = P(300, 0), A = P(90, -190)
  const M = mid(A, B), N = inter(M, P(M.x + 100, M.y), A, C)
  const D = P(B.x + dist(M, N), 0)
  ok(dist(A, B) < dist(B, C) && dist(A, B) < dist(A, C), '148: AB nhỏ nhất')
  ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, '148: nhọn')
  ok(gan(dist(B, D), dist(M, N)) && D.x < C.x, '148: BD = MN')
  const H = foot(A, B, C)
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, N), tick(A, M, 1), tick(M, B, 1), tick(B, D, 2, 0.8), tick(M, N, 2)]
  const nhan = [pt(A, 'A', 0, -1), pt(B, 'B', -1, 1), pt(C, 'C', 1, 1), pt(M, 'M', -1, 0), pt(N, 'N', 1, 0), pt(D, 'D', 0, 1, 26)]
  const pts = [A, B, C]
  hinh('HLB00148', pts, [...nen, ...nhan])
  // ý 1: nối ND (tứ giác BMND)
  hinh('HLY00359', pts, [...nen, seg(N, D), ...nhan])
  // ý 2: AH ⊥ BC; nối HM (tam giác AMH, tứ giác DHMN); BMND là hình bình hành (ý 1) ⇒ đánh dấu ND = BM
  hinh('HLY00360', pts, [
    ...nen, seg(N, D), seg(A, H), seg(H, M), ra(H, A, C, 12), tick(N, D, 1),
    ...nhan, pt(H, 'H', -0.3, 1, 26),
  ])
}

// ───── HLB00149 / HLB00150: △ABC vuông tại A (AB < AC), M trung điểm BC; MH ⊥ AB, MK ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -180), C = P(270, 0), M = mid(B, C)
  const H = foot(M, A, B), K = foot(M, A, C)
  ok(gan(goc(A, B, C), 90) && dist(A, B) < dist(A, C), '149: vuông A, AB < AC')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(M, H), seg(M, K),
    ra(A, B, C, 14), ra(H, M, B, 12), ra(K, M, C, 12), tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan = [pt(A, 'A', -1, 1), pt(B, 'B', -1, -0.6), pt(C, 'C', 1, 1), pt(M, 'M', 1, -0.8), pt(H, 'H', -1, 0), pt(K, 'K', 0, 1, 26)]
  const pts = [A, B, C]
  hinh('HLB00149', pts, [...nen, ...nhan])
  // ý a: AHMK đủ cạnh ⇒ không vẽ
  // ý b: tứ giác CMHK ⇒ nối HK; AHMK là hình chữ nhật (ý a) ⇒ góc vuông ở M
  hinh('HLY00362', pts, [...nen, seg(H, K), ra(M, H, K, 12), ...nhan])
  // ý c: E đối xứng M qua H; O = AM ∩ HK. KHÔNG nối E, O, C (điều phải chứng minh). MH = KC (ý b) ⇒ đánh dấu
  const E = doiXung(M, H), O = inter(A, M, H, K)
  ok(gan(dist(H, E), dist(H, M)), '149: H trung điểm ME')
  ok(gan(dist(M, H), dist(K, C)), '149: MH = KC')
  hinh('HLY00363', [A, B, C, E], [
    ...nen, seg(H, K), seg(A, M), seg(H, E), ra(M, H, K, 12),
    tick(M, H, 2), tick(H, E, 2), tick(K, C, 2),
    ...nhan, pt(E, 'E', -1, 0), pt(O, 'O', 0.1, 1, 26),
  ])

  // ─── HLB00150: cùng bộ điểm, đặt tên D (trên AB), E (trên AC) ───
  const D = H, E2 = K
  const nen2 = [
    seg(A, B), seg(B, C), seg(C, A), seg(M, D), seg(M, E2),
    ra(A, B, C, 14), ra(D, M, B, 12), ra(E2, M, C, 12), tick(B, M, 1), tick(M, C, 1),
  ]
  const nhan2 = [pt(A, 'A', -1, 1), pt(B, 'B', -1, -0.6), pt(C, 'C', 1, 1), pt(M, 'M', 1, -0.8), pt(D, 'D', -1, 0)]
  const eB = pt(E2, 'E', 0, 1, 26)
  hinh('HLB00150', pts, [...nen2, ...nhan2, eB])
  // ý a: không vẽ
  // ý b: tứ giác MBDE ⇒ nối DE; ADME là hình chữ nhật (ý a) ⇒ góc vuông ở M
  hinh('HLY00365', pts, [...nen2, seg(D, E2), ra(M, D, E2, 12), ...nhan2, eB])
  // ý c: K đối xứng M qua E; I = AM ∩ DE. KHÔNG nối B, I, K. ME = DB (ý b) ⇒ đánh dấu
  const K2 = doiXung(M, E2), I = inter(A, M, D, E2)
  ok(gan(dist(E2, K2), dist(E2, M)) && gan(dist(M, E2), dist(D, B)), '150: EK = EM = DB')
  hinh('HLY00366', [A, B, C, K2], [
    ...nen2, seg(D, E2), seg(A, M), seg(E2, K2), ra(M, D, E2, 12),
    tick(M, E2, 2), tick(E2, K2, 2), tick(D, B, 2),
    ...nhan2, pt(E2, 'E', 1, 0.9, 22), pt(K2, 'K', 0, 1, 26), pt(I, 'I', -1, 0.1, 24),
  ])
}

// ───── HLB00153: hình bình hành ABCD, AB = 2AD; M, N trung điểm AB, CD ─────
{
  const A = P(0, 0), B = P(300, 0)
  const D = P(150 * Math.cos(70 * Math.PI / 180), -150 * Math.sin(70 * Math.PI / 180))
  const C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  const M = mid(A, B), N = mid(C, D)
  ok(gan(dist(A, B), 2 * dist(A, D)), '153: AB = 2AD')
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), tick(A, M, 1), tick(M, B, 1), tick(C, N, 1), tick(N, D, 1)]
  const nhan = [pt(A, 'A', -1, 1), pt(B, 'B', 1, 1), pt(C, 'C', 1, -1), pt(D, 'D', -1, -1), pt(M, 'M', 0, 1, 26), pt(N, 'N', 0, -1, 24)]
  const pts = [A, B, C, D]
  hinh('HLB00153', pts, [...nen, ...nhan])
  hinh('HLY00374', pts, [...nen, seg(D, M), seg(B, N), ...nhan])
  // ý b: chỉ cần AN (không dùng DM, BN)
  hinh('HLY00375', pts, [...nen, seg(A, N), ...nhan])
  // ý c: P = AN ∩ DM, Q = CM ∩ BN
  const Pp = inter(A, N, D, M), Q = inter(C, M, B, N)
  hinh('HLY00376', pts, [
    ...nen, seg(A, N), seg(D, M), seg(C, M), seg(B, N),
    ...nhan, pt(Pp, 'P', -1, -0.2, 28), pt(Q, 'Q', 1, 0.05, 28),
  ])
}

// ───── HLB00154: hình chữ nhật ABCD (AD < AB); M, N trung điểm AD, BC ─────
{
  const A = P(0, 0), B = P(270, 0), C = P(270, -210), D = P(0, -210)
  const M = mid(A, D), N = mid(B, C)
  ok(dist(A, D) < dist(A, B), '154: AD < AB')
  const goc4 = [ra(A, B, D, 14), ra(B, A, C, 14), ra(C, B, D, 14), ra(D, A, C, 14)]
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), ...goc4, tick(A, M, 1), tick(M, D, 1), tick(B, N, 1), tick(N, C, 1)]
  const nhan = [pt(A, 'A', -1, 1), pt(B, 'B', 1, 1), pt(C, 'C', 1, -1), pt(D, 'D', -1, -1), pt(M, 'M', -1, 0), pt(N, 'N', 1, 0)]
  hinh('HLB00154', [A, B, C, D], [...nen, ...nhan])
  // ý a: nối MN (tứ giác ABNM)
  hinh('HLY00377', [A, B, C, D], [...nen, seg(M, N), ...nhan])
  // ý b: BK ⊥ BM, K ∈ tia DC; P ∈ DC, DP = CK. Không dùng MN ⇒ bỏ
  const K = inter(B, rot90(B, M), D, C)
  const Pp = P(D.x + dist(C, K), D.y)
  ok(gan(goc(B, M, K), 90) && K.x > C.x, '154: BK ⊥ BM, K sau C')
  ok(gan(dist(D, Pp), dist(C, K)) && Pp.x < C.x, '154: DP = CK')
  const nenB = [...nen, seg(B, M), seg(B, K), seg(C, K), seg(A, Pp), ra(B, M, K, 12), tick(D, Pp, 2), tick(C, K, 2)]
  hinh('HLY00378', [A, B, C, D, K], [...nenB, ...nhan.filter((_, i) => i !== 5), pt(N, 'N', -1, 0, 24), pt(K, 'K', 1, -0.6), pt(Pp, 'P', 0, -1, 24)])
  // ý c: KH ⊥ AB tại H; nối AN, HC (câu hỏi). Không dùng P, AP ⇒ bỏ
  const H = foot(K, A, B)
  hinh('HLY00379', [A, B, C, D, K, H], [
    ...nen, seg(B, M), seg(B, K), seg(C, K), ra(B, M, K, 12),
    seg(B, H), seg(K, H), ra(H, K, A, 12), seg(A, N), seg(H, C),
    ...nhan.filter((_, i) => i !== 5), pt(N, 'N', -0.6, -1, 24), pt(K, 'K', 1, -0.6), pt(H, 'H', 1, 0.8),
  ])
}
function rot90(o, p) { return P(o.x - (p.y - o.y), o.y + (p.x - o.x)) }

// ───── HLB00155: △ABC vuông tại A, đường cao AH; HM ⊥ AB, HN ⊥ AC; O = AH ∩ MN ─────
{
  const A = P(0, 0), B = P(0, -190), C = P(260, 0)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C), O = inter(A, H, M, N)
  ok(gan(goc(A, B, C), 90), '155: vuông A')
  const nen = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(H, N), seg(M, N),
    ra(A, B, C, 14), ra(H, A, C, 11), ra(M, H, B, 11), ra(N, H, C, 11),
  ]
  const nhan = [
    pt(A, 'A', -1, 1), pt(B, 'B', -1, -0.6), pt(C, 'C', 1, 1), pt(H, 'H', 1, -0.7),
    pt(M, 'M', -1, 0), pt(N, 'N', 0, 1, 26), pt(O, 'O', -0.3, 1, 22),
  ]
  const pts = [A, B, C]
  hinh('HLB00155', pts, [...nen, ...nhan])
  // ý a: không vẽ
  // ý b: P ∈ tia NC, AN = PN; I = MP ∩ HN; nối OI (câu hỏi). AMHN là hình chữ nhật (ý a) ⇒ góc vuông ở H
  const Pp = doiXung(A, N), I = inter(M, Pp, H, N)
  ok(gan(dist(A, N), dist(N, Pp)) && Pp.x < C.x, '155: AN = NP')
  hinh('HLY00381', pts, [
    ...nen, seg(N, Pp), seg(H, Pp), seg(M, Pp), seg(O, I), ra(H, M, N, 11), tick(A, N, 1), tick(N, Pp, 1),
    ...nhan, pt(Pp, 'P', 0.3, 1, 26), pt(I, 'I', 1, -0.4, 22),
  ])
  // ý c: đường qua C ∥ AH cắt MH tại E, MN tại F. Không dùng P, I ⇒ bỏ
  const dAH = P(H.x - A.x, H.y - A.y), C2 = P(C.x + dAH.x, C.y + dAH.y)
  const E = inter(M, H, C, C2), F = inter(M, N, C, C2)
  ok(song(P(E.x - C.x, E.y - C.y), dAH) && song(P(F.x - C.x, F.y - C.y), dAH), '155: CE ∥ AH')
  hinh('HLY00382', [A, B, C, E, F], [
    ...nen, seg(H, E), seg(N, F), seg(F, E),
    ...nhan.filter((_, i) => i !== 5), pt(N, 'N', -0.6, 1, 26), pt(E, 'E', 1, -0.5), pt(F, 'F', 0.5, 1, 26),
  ])
}

// ───── HLB00156: △ABC vuông tại A (AB > AC), M trung điểm BC, D ∈ tia đối MA, MD = MA ─────
{
  const A = P(0, 0), B = P(300, 0), C = P(0, -190), M = mid(B, C), D = doiXung(A, M)
  ok(gan(goc(A, B, C), 90) && dist(A, B) > dist(A, C), '156: vuông A, AB > AC')
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), ra(A, B, C, 14)]
  const nhan = [pt(A, 'A', -1, 1), pt(B, 'B', 1, 1), pt(C, 'C', -1, -1), pt(D, 'D', 1, -1), pt(M, 'M', 0, -1, 24)]
  hinh('HLB00156', [A, B, C, D], [...base, tick(B, M, 1), tick(M, C, 1), tick(A, M, 2), tick(M, D, 2), ...nhan])
  // ý a: nối BD, CD (tứ giác ABDC)
  hinh('HLY00383', [A, B, C, D], [...base, seg(B, D), seg(C, D), tick(B, M, 1), tick(M, C, 1), tick(A, M, 2), tick(M, D, 2), ...nhan])
  // ý b: E chân đường vuông góc hạ từ D xuống BC; F: E trung điểm FD. ABDC là hình chữ nhật (ý a), AM = ½BC ⇒ đánh dấu
  const E = foot(D, B, C), F = doiXung(D, E)
  const hcn = [seg(B, D), seg(C, D), ra(B, A, D, 12), ra(C, A, D, 12), ra(D, B, C, 12)]
  const halves = [tick(A, M, 1), tick(M, D, 1), tick(B, M, 1), tick(M, C, 1)]
  hinh('HLY00384', [A, B, C, D, F], [
    ...base, ...hcn, ...halves, seg(D, F), seg(C, F), seg(A, F), ra(E, D, C, 11), tick(D, E, 2), tick(E, F, 2),
    ...nhan, pt(E, 'E', 1, -0.3, 26), pt(F, 'F', 0.3, 1, 26),
  ])
  // ý c: FH ⊥ AB, FK ⊥ AC. KHÔNG nối H, K, E. Không dùng BD, CD, CF ⇒ bỏ. AF ⊥ FD (ý b) ⇒ đánh dấu
  const H = foot(F, A, B), K = foot(F, A, C)
  hinh('HLY00385', [A, B, C, D, F, K, H], [
    ...base, seg(D, F), seg(A, F), seg(F, H), seg(F, K), seg(A, K),
    ra(H, F, A, 11), ra(K, F, A, 11), ra(F, A, D, 11), ...halves, ra(E, D, C, 11), tick(D, E, 2), tick(E, F, 2),
    ...nhan, pt(E, 'E', 1, -0.3, 26), pt(F, 'F', 0.3, 1, 26), pt(H, 'H', -0.3, -1, 24), pt(K, 'K', -1, 0.4),
  ])
}

// ───── HLB00157: hình chữ nhật ABCD; BH ⊥ AC; M, N, P trung điểm AB, AH, CD ─────
{
  const A = P(0, 0), B = P(280, 0), C = P(280, -180), D = P(0, -180)
  const H = foot(B, A, C), M = mid(A, B), N = mid(A, H), Pp = mid(C, D)
  const goc4 = [ra(A, B, D, 14), ra(B, A, C, 14), ra(C, B, D, 14), ra(D, A, C, 14)]
  const nen = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, H), ...goc4, ra(H, B, C, 11),
    tick(A, M, 1), tick(M, B, 1), tick(A, N, 2), tick(N, H, 2), tick(C, Pp, 3), tick(Pp, D, 3),
  ]
  const nhan = [
    pt(A, 'A', -1, 1), pt(B, 'B', 1, 1), pt(C, 'C', 1, -1), pt(D, 'D', -1, -1),
    pt(H, 'H', -0.6, -1, 22), pt(M, 'M', 0, 1, 26), pt(N, 'N', -0.5, -1, 22), pt(Pp, 'P', 0, -1, 24),
  ]
  const pts = [A, B, C, D]
  hinh('HLB00157', pts, [...nen, ...nhan])
  // ý a: nối MP (tứ giác MBCP)
  hinh('HLY00386', pts, [...nen, seg(M, Pp), ...nhan])
  // ý b: nối MN
  hinh('HLY00387', pts, [...nen, seg(M, N), ...nhan])
  // ý c: NK ∥ AB (K ∈ BH); nối NP, CK. Không dùng MN ⇒ bỏ
  const K = inter(N, P(N.x + 100, N.y), B, H)
  ok(gan(K.y, N.y), '157: NK ∥ AB')
  const nenC = [...nen, seg(N, K), seg(N, Pp), seg(C, K)]
  hinh('HLY00388', pts, [...nenC, ...nhan, pt(K, 'K', 1, -0.3, 22)])
  // ý d: nối NB; NP = CK (ý c) ⇒ đánh dấu
  hinh('HLY00389', pts, [...nenC, seg(N, B), tick(N, Pp, 4), tick(C, K, 4), ...nhan, pt(K, 'K', 1, -0.3, 22)])
}

// ───── HLB00158: hình chữ nhật ABCD (AB > AD); AN ⊥ BD, CM ⊥ BD ─────
{
  const A = P(0, 0), B = P(270, 0), C = P(270, -170), D = P(0, -170)
  const N = foot(A, B, D), M = foot(C, B, D)
  ok(dist(A, B) > dist(A, D), '158: AB > AD')
  const goc4 = [ra(A, B, D, 14), ra(B, A, C, 14), ra(C, B, D, 14), ra(D, A, C, 14)]
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(A, N), seg(C, M), ...goc4, ra(N, A, B, 11), ra(M, C, B, 11)]
  const nhan = [pt(A, 'A', -1, 1), pt(B, 'B', 1, 1), pt(C, 'C', 1, -1), pt(D, 'D', -1, -1), pt(N, 'N', 0.5, -0.9, 22), pt(M, 'M', -0.5, 0.9, 22)]
  const pts = [A, B, C, D]
  hinh('HLB00158', pts, [...nen, ...nhan])
  // ý a: không vẽ
  // ý b: tứ giác ANCM ⇒ nối NC, AM; DN = BM (ý a) ⇒ đánh dấu
  hinh('HLY00391', pts, [...nen, seg(N, C), seg(A, M), tick(D, N, 1), tick(M, B, 1), ...nhan])
  // ý c: K đối xứng A qua N; tứ giác DKCB ⇒ nối DK, KC. AN = CM (ý b) ⇒ đánh dấu. Không dùng NC, AM ⇒ bỏ
  const K = doiXung(A, N)
  const nenC = [...nen, seg(N, K), tick(A, N, 2), tick(N, K, 2), tick(C, M, 2)]
  hinh('HLY00392', [A, B, C, D, K], [...nenC, seg(D, K), seg(K, C), ...nhan.filter((_, i) => i !== 4), pt(N, 'N', -1, 0.25, 26), pt(K, 'K', 0, -1, 24)])
  // ý d: P = AM ∩ KC; nối AP, KP, PN, AC, KM (ba đường PN, AC, KM — KHÔNG đánh dấu điểm đồng quy)
  const Pp = inter(A, M, K, C)
  ok(Pp.x > C.x, '158: P sau C')
  hinh('HLY00393', [A, B, C, D, K, Pp], [
    ...nenC, seg(A, Pp), seg(K, Pp), seg(Pp, N), seg(A, C), seg(K, M),
    ...nhan.filter((_, i) => i !== 4), pt(N, 'N', -1, 0.25, 26), pt(K, 'K', 0, -1, 24), pt(Pp, 'P', 1, 0.2, 22),
  ])
}

await xuatTat(RA)
