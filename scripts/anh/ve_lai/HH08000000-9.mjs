// Vẽ lại hình — gói HH08000000-9 (Chưa phân dạng — Hình học 8): 8 hình LỜI GIẢI (_lg), mỗi hình là một bài riêng.
//   node scripts/anh/ve_lai/HH08000000-9.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, rightAngle, dot, label, hinh, xuatTat,
  lerp, mid, foot, inter, doiXung, goc, dist, add, vec } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-9/moi'
const ok = (c, m) => console.assert(c, m)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const song2 = (a, b, c, d) => near((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x), 0, 0.05)   // ab ∥ cd

// ── HHC002622_lg — ABCD hình chữ nhật (AD<AB), M, N trung điểm AD, BC; BK ⊥ BM, K ∈ tia DC; P ∈ DC, DP = CK; KH ⊥ AB tại H.
{
  const w = 366, h = 222
  const A = P(0, 0), B = P(w, 0), D = P(0, -h), C = P(w, -h)
  const M = mid(A, D), N = mid(B, C)
  const K = inter(B, add(B, P(h / 2, -w)), D, C)                       // BK ⊥ BM
  const H = foot(K, A, B)
  const CK = dist(C, K), Pp = lerp(D, C, CK / dist(D, C))               // DP = CK
  ok(h < w, 'AD < AB')
  ok(near(goc(B, M, K), 90), 'BK ⊥ BM')
  ok(K.x > C.x, 'C nằm giữa D và K')
  ok(near(dist(D, Pp), dist(C, K)), 'DP = CK')
  ok(near(goc(H, A, K), 90) && near(H.y, 0), 'KH ⊥ AB')
  hinh('HHC002622_lg', [A, B, C, D, M, N, K, H, Pp], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    seg(C, K), seg(A, Pp), seg(A, N), seg(M, B), seg(M, N), seg(B, K), seg(C, H), seg(K, H), seg(B, H),
    tick(D, M, 1), tick(M, A, 1), tick(B, N, 2), tick(N, C, 2), tick(D, Pp, 3, 0.5), tick(C, K, 3),
    rightAngle(B, M, K, 14), rightAngle(H, A, K, 14),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), dot(K), dot(H), dot(Pp),
    label(D, 'D', -12, -14), label(Pp, 'P', 2, -14), label(C, 'C', -2, -14), label(K, 'K', 16, -12),
    label(M, 'M', -18, 6), label(N, 'N', -16, -8),
    label(A, 'A', -14, 28), label(B, 'B', -4, 30), label(H, 'H', 6, 30),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC002623_lg — ABC vuông ở A, AH ⊥ BC, HM ⊥ AB, HN ⊥ AC, O = AH ∩ MN; P ∈ tia NC, NP = AN; I = MP ∩ HN;
//    qua C kẻ đường song song AH cắt MH ở E, MN ở F.
{
  const A = P(0, 0), B = P(262, 0), C = P(0, -197)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  const O = inter(A, H, M, N), Pp = lerp(A, N, 2)
  const I = inter(M, Pp, H, N)
  const A2 = add(C, vec(A, H))
  const E = inter(C, A2, M, H), F = inter(C, A2, M, N)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(goc(H, A, B), 90), 'AH ⊥ BC')
  ok(near(goc(M, H, A), 90) && near(goc(N, H, A), 90), 'HM ⊥ AB, HN ⊥ AC')
  ok(near(dist(A, N), dist(N, Pp)) && Pp.y < C.y, 'NP = AN, P ở trên C (tia NC)')
  ok(near(dist(I, H), dist(I, N)), 'I là trung điểm HN (hệ quả)')
  ok(E.y < C.y && C.y < F.y, 'C nằm giữa E, F')
  hinh('HHC002623_lg', [A, B, C, H, M, N, O, Pp, I, E, F], [
    seg(A, B), seg(A, Pp), seg(M, E), seg(N, H), seg(A, H), seg(F, M), seg(F, E), seg(Pp, M), seg(Pp, H), seg(C, B), seg(O, I),
    tick(A, N, 1, 0.45), tick(N, Pp, 1, 0.3),
    rightAngle(A, B, C, 14), rightAngle(M, A, H, 14), rightAngle(N, A, H, 14), rightAngle(H, B, A, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(O), dot(Pp), dot(I), dot(E), dot(F),
    label(E, 'E', 18, -4), label(Pp, 'P', -18, -4), label(C, 'C', -18, -2), label(F, 'F', -20, 4),
    label(H, 'H', 20, -6), label(N, 'N', -18, 6), label(I, 'I', -16, 24), label(O, 'O', -16, 8),
    label(A, 'A', -16, 24), label(M, 'M', 2, 30), label(B, 'B', 6, 30),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC002624_lg — ABC vuông ở A (AB>AC), M trung điểm BC, D đối xứng A qua M ⇒ ABDC hình chữ nhật;
//    E = chân đường vuông góc hạ từ D xuống BC, E trung điểm FD; FH ⊥ AB tại H, FK ⊥ AC tại K; O = AF ∩ HK.
{
  const w = 334, h = 220
  const A = P(0, 0), B = P(w, 0), C = P(0, -h), D = P(w, -h)
  const M = mid(A, D), E = foot(D, B, C), F = doiXung(D, E)
  const H = foot(F, A, B), K = foot(F, A, C), O = inter(A, F, H, K)
  ok(w > h, 'AB > AC')
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(dist(M, B), dist(M, C)), 'M trung điểm BC')
  ok(near(goc(E, D, B), 90) || near(goc(E, D, C) + goc(E, D, B), 90), 'DE ⊥ BC')
  ok(near(dist(E, D), dist(E, F)), 'E trung điểm FD')
  ok(near(goc(H, A, F), 90) && near(goc(K, A, F), 90), 'FH ⊥ AB, FK ⊥ AC')
  ok(near(dist(O, A), dist(O, F)) && near(dist(O, H), dist(O, K)), 'O tâm hình chữ nhật AHFK')
  hinh('HHC002624_lg', [A, B, C, D, M, E, F, H, K, O], [
    seg(C, D), seg(C, K), seg(A, B), seg(B, D), seg(C, B), seg(A, D), seg(D, F), seg(K, F), seg(F, H), seg(H, K), seg(A, F), seg(C, F),
    tick(A, M, 1), tick(M, D, 1), tick(D, E, 2), tick(E, F, 2),
    rightAngle(A, B, C, 14), rightAngle(E, D, B, 14), rightAngle(H, A, F, 14), rightAngle(K, A, F, 14),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(E), dot(F), dot(H), dot(K), dot(O),
    label(C, 'C', -4, -14), label(D, 'D', 14, -12), label(M, 'M', 2, -18), label(E, 'E', 8, 28),
    label(A, 'A', -16, -4), label(H, 'H', 2, -12), label(B, 'B', 14, 28), label(K, 'K', -16, 18),
    label(O, 'O', -2, 28), label(F, 'F', 0, 32),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC002625_lg — ABCD hình chữ nhật; BH ⊥ AC (H ∈ AC); M, N, P trung điểm AB, AH, CD; NK ∥ AB (K ∈ BH).
{
  const w = 380, h = 200
  const A = P(0, 0), B = P(w, 0), D = P(0, h), C = P(w, h)
  const M = mid(A, B), Pp = mid(D, C), H = foot(B, A, C), N = mid(A, H)
  const K = inter(N, add(N, P(1, 0)), B, H)                            // NK ∥ AB
  ok(near(goc(H, B, A), 90), 'BH ⊥ AC')
  ok(song2(N, K, A, B), 'NK ∥ AB')
  ok(near(dist(K, B), dist(K, H)), 'K trung điểm BH (hệ quả)')
  hinh('HHC002625_lg', [A, B, C, D, M, Pp, H, N, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(M, Pp), seg(M, N), seg(N, B), seg(N, K), seg(N, Pp), seg(B, H), seg(K, C),
    tick(A, M, 1), tick(M, B, 1), tick(A, N, 2), tick(N, H, 2), tick(D, Pp, 3), tick(Pp, C, 3),
    rightAngle(A, B, D, 14), rightAngle(B, A, C, 14), rightAngle(C, B, D, 14), rightAngle(D, A, C, 14), rightAngle(H, C, B, 14),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(Pp), dot(H), dot(N), dot(K),
    label(A, 'A', -14, -10), label(M, 'M', 0, -14), label(B, 'B', 14, -10),
    label(N, 'N', -4, 28), label(K, 'K', 18, -2),
    label(D, 'D', -14, 28), label(Pp, 'P', 0, 32), label(H, 'H', -10, 28), label(C, 'C', 16, 28),
  ], { pad: 38, padDuoi: 40 })
}

// ── HHC002626_lg — ABCD hình chữ nhật (AB>AD), AN ⊥ BD, CM ⊥ BD; K ∈ tia đối NA, NK = NA; P = AM ∩ KC.
{
  const w = 285, h = 152
  const A = P(0, 0), B = P(w, 0), D = P(0, h), C = P(w, h)
  const N = foot(A, B, D), M = foot(C, B, D)
  const K = doiXung(A, N), Pp = inter(A, M, K, C)
  ok(w > h, 'AB > AD')
  ok(near(goc(N, A, B) + goc(N, A, D), 90) || near(goc(N, A, M), 90), 'AN ⊥ BD')
  ok(near(goc(M, C, N), 90) || near(goc(M, C, D) + goc(M, C, B), 90), 'CM ⊥ BD')
  ok(near(dist(N, K), dist(N, A)), 'NK = NA')
  ok(near(dist(M, Pp), dist(M, A)) && near(dist(C, Pp), dist(C, K)), 'M, C là trung điểm AP, KP (hệ quả)')
  hinh('HHC002626_lg', [A, B, C, D, N, M, K, Pp], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, K), seg(K, Pp), seg(A, Pp),
    seg(D, K), seg(K, M), seg(C, M), seg(N, Pp), segDash(B, K),
    tick(A, N, 1), tick(N, K, 1),
    rightAngle(A, B, D, 14), rightAngle(B, A, C, 14), rightAngle(C, B, D, 14), rightAngle(D, A, C, 14),
    rightAngle(N, A, B, 12), rightAngle(M, C, D, 12),
    dot(A), dot(B), dot(C), dot(D), dot(N), dot(M), dot(K), dot(Pp),
    label(A, 'A', -14, -10), label(B, 'B', 14, -10), label(M, 'M', -2, -14),
    label(N, 'N', -16, 6), label(D, 'D', -16, 24), label(C, 'C', 18, 28), label(K, 'K', 0, 32), label(Pp, 'P', 20, 4),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC002627_lg — ABC vuông ở A (AB>AC), E trung điểm BC, ED ⊥ AB, EH ⊥ AC; F đối xứng E qua D; EI ⊥ AF tại I; O = AE ∩ DH.
{
  const w = 340, h = 180
  const A = P(0, 0), B = P(w, 0), C = P(0, -h)
  const E = mid(B, C), D = foot(E, A, B), H = foot(E, A, C)
  const F = doiXung(E, D), I = foot(E, A, F), O = mid(A, E)
  ok(w > h, 'AB > AC')
  ok(near(goc(D, E, A), 90), 'ED ⊥ AB')
  ok(near(goc(H, E, A), 90), 'EH ⊥ AC')
  ok(near(goc(I, E, A), 90), 'EI ⊥ AF')
  ok(lerp(A, F, 0.5).x > 0 && (I.x - A.x) / (F.x - A.x) > 0 && (I.x - A.x) / (F.x - A.x) < 1, 'I nằm trên tia AF, trong đoạn AF')
  ok(near(dist(D, I), dist(D, E)), 'DI = DE (hệ quả)')
  ok(near(goc(I, H, D), 90), 'IH ⊥ ID (hệ quả — không đánh dấu)')
  hinh('HHC002627_lg', [A, B, C, E, D, H, F, I, O], [
    seg(C, A), seg(A, B), seg(C, B), seg(H, E), seg(E, F), seg(A, F), seg(I, H), seg(I, D), seg(I, E),
    segDash(H, D), segDash(A, E),
    tick(C, E, 1), tick(E, B, 1), tick(E, D, 2), tick(D, F, 2),
    rightAngle(A, B, C, 14), rightAngle(H, E, A, 14), rightAngle(D, A, E, 14), rightAngle(I, A, E, 12),
    dot(A), dot(B), dot(C), dot(E), dot(D), dot(H), dot(F), dot(I), dot(O),
    label(C, 'C', -14, -4), label(H, 'H', -16, 8), label(E, 'E', 14, -12), label(O, 'O', 2, -12),
    label(A, 'A', -16, 22), label(D, 'D', 20, 26), label(B, 'B', 18, 6), label(I, 'I', -16, 24), label(F, 'F', 16, 26),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC002628_lg — ABC vuông ở A (AB<AC), M, N, Q trung điểm AB, BC, AC; AI ⊥ BC tại I; AK ∥ BC, K ∈ NQ; O = AN ∩ MQ.
{
  const B = P(0, 0), C = P(440, 0), I = P(131, 0), A = P(131, -Math.sqrt(131 * 309))   // AI² = BI·IC ⇒ góc A vuông
  const M = mid(A, B), N = mid(B, C), Q = mid(A, C)
  const K = inter(A, add(A, P(1, 0)), N, Q), O = inter(A, N, M, Q)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(near(goc(I, A, B), 90), 'AI ⊥ BC')
  ok(song2(A, K, B, C), 'AK ∥ BC')
  ok(near(dist(O, M), dist(O, Q)) && near(dist(O, A), dist(O, N)), 'O tâm hình chữ nhật AMNQ (hệ quả)')
  hinh('HHC002628_lg', [A, B, C, I, M, N, Q, K, O], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, I), seg(A, K), seg(K, N), seg(M, Q), seg(M, I), seg(M, N), seg(A, N), seg(I, Q),
    tick(A, M, 1), tick(M, B, 1), tick(B, N, 2), tick(N, C, 2), tick(A, Q, 3), tick(Q, C, 3),
    rightAngle(A, B, C, 14), rightAngle(I, A, C, 14),
    dot(A), dot(B), dot(C), dot(I), dot(M), dot(N), dot(Q), dot(K), dot(O),
    label(A, 'A', -4, -14), label(K, 'K', 16, -8), label(M, 'M', -18, 4), label(O, 'O', 18, -8), label(Q, 'Q', 26, 2),
    label(B, 'B', -8, 28), label(I, 'I', -6, 30), label(N, 'N', 8, 30), label(C, 'C', 14, 28),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC002629_lg — ABC vuông ở A, AH ⊥ BC, HI ⊥ AB, HK ⊥ AC; M trung điểm BC; O = AH ∩ IK, E = AM ∩ IK.
{
  const B = P(0, 0), C = P(440, 0), H = P(118, 0), A = P(118, -Math.sqrt(118 * 322))    // AH² = BH·HC ⇒ góc A vuông
  const I = foot(H, A, B), K = foot(H, A, C), M = mid(B, C)
  const O = inter(A, H, I, K), E = inter(A, M, I, K)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(goc(I, H, A), 90) && near(goc(K, H, A), 90), 'HI ⊥ AB, HK ⊥ AC')
  ok(near(dist(O, A), dist(O, K)), 'OA = OK (hệ quả)')
  ok(near(goc(E, A, K), 90), 'AM ⊥ IK (hệ quả — không đánh dấu)')
  hinh('HHC002629_lg', [A, B, C, H, M, I, K, O, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(I, K), seg(I, H), seg(K, H), seg(A, M),
    tick(B, M, 2, 0.25), tick(M, C, 2),
    rightAngle(A, B, C, 14), rightAngle(I, A, H, 14), rightAngle(K, A, H, 14), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(I), dot(K), dot(O), dot(E),
    label(A, 'A', -2, -14), label(K, 'K', 18, -8), label(E, 'E', 26, 18), label(O, 'O', -16, 4),
    label(I, 'I', -18, 6), label(B, 'B', -8, 28), label(H, 'H', -4, 30), label(M, 'M', 8, 30), label(C, 'C', 14, 28),
  ], { pad: 38, padDuoi: 46 })
}

await xuatTat(RA)
