// Vẽ lại hình — gói HH08000000-7 (Hình học 8, câu từ đề giữa kì): 7 hình (HHC002529 = ảnh chụp cái bàn → không vẽ).
//   node scripts/anh/ve_lai/HH08000000-7.mjs [<thu_muc_ra>]
import { P, seg, tick, rightAngle, dot, label, num, hinh, xuatTat,
  lerp, mid, foot, inter, doiXung, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-7/moi'
const ok = (c, m) => console.assert(c, m)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const song = (a, b, c, d) => { const u = P(b.x - a.x, b.y - a.y), v = P(d.x - c.x, d.y - c.y); return near(u.x * v.y - u.y * v.x, 0, 0.5) }

// ── HHC002528_lg — ABC vuông tại A (AB < AC), I trung điểm BC, IE ⊥ AC, IF ⊥ AB, G = FC ∩ AI, O = BG ∩ FI.
{
  const k = 0.47
  const A = P(0, 0), B = P(480 * k, 0), C = P(0, -660 * k)
  const I = mid(B, C), E = foot(I, A, C), F = foot(I, A, B)
  const G = inter(C, F, A, I), O = inter(B, G, F, I)
  ok(near(goc(A, B, C), 90) && dist(A, B) < dist(A, C), 'A vuông, AB < AC')
  ok(near(goc(E, A, I), 90) && near(goc(F, A, I), 90), 'IE ⊥ AC, IF ⊥ AB')
  ok(near(goc(O, B, G), 180, 0.1), 'O ∈ BG')
  hinh('HHC002528_lg', [A, B, C, E, F, G, I, O], [
    seg(C, A), seg(A, B), seg(B, C), seg(E, I), seg(I, F), seg(C, F), seg(A, I), seg(B, G),
    rightAngle(A, B, C, 14), rightAngle(E, A, I, 14), rightAngle(F, A, I, 14),
    tick(C, I, 1), tick(I, B, 1),
    dot(A), dot(B), dot(C), dot(E), dot(F), dot(G), dot(I), dot(O),
    label(A, 'A', -14, 28), label(B, 'B', 8, 30), label(C, 'C', 10, -14), label(E, 'E', -20, 8),
    label(F, 'F', 0, 30), label(I, 'I', 16, -8), label(G, 'G', -18, 6), label(O, 'O', 20, -4),
  ], { pad: 36, padDuoi: 44 })
}

// ── HHC002533 — ba hình con: Hình 1 (hình thoi: hai đường chéo cắt nhau tại trung điểm, vuông góc), Hình 2 (hình bình hành: AB=CD, AD=BC),
//    Hình 3 (tứ giác có 3 góc vuông A, B, D).
{
  const k = 0.95, g = 70, h = 100 * k                               // k: thu nhỏ để cả 3 hình con vào khung ≤ 560px
  // Hình 1 — hình thoi dựng đúng: AB = AD, hai đường chéo vuông góc tại O (không đánh dấu thêm gì ngoài đề)
  const off = 50 * k, s = Math.hypot(off, h)
  const A1 = P(0, 0), B1 = P(s, 0), D1 = P(off, h), C1 = P(s + off, h), O1 = mid(A1, C1)
  ok(near(dist(A1, B1), dist(A1, D1)), 'Hình 1: AB = AD')
  ok(near(dist(O1, A1), dist(O1, C1)) && near(dist(O1, B1), dist(O1, D1)), 'Hình 1: O trung điểm hai đường chéo')
  ok(near(goc(O1, A1, B1), 90), 'Hình 1: AC ⊥ BD')
  // Hình 2 — hình bình hành: D→C = A→B
  const x2 = s + off + g
  const A2 = P(x2, 0), B2 = P(x2 + 170 * k, 0), D2 = P(x2 + 40 * k, h), C2 = P(x2 + 210 * k, h)
  ok(near(dist(A2, B2), dist(D2, C2)) && near(dist(A2, D2), dist(B2, C2)), 'Hình 2: AB = CD, AD = BC')
  // Hình 3 — hình chữ nhật (đề ghi 3 góc vuông A, B, D)
  const x3 = 150 * k, y3 = h + 105                                   // Hình 3 xuống hàng dưới để nhãn ba hình không chạm nhau
  const A3 = P(x3, y3), B3 = P(x3 + 150 * k, y3), D3 = P(x3, y3 + h), C3 = P(x3 + 150 * k, y3 + h)
  ok(near(goc(A3, B3, D3), 90) && near(goc(B3, A3, C3), 90) && near(goc(D3, A3, C3), 90), 'Hình 3: A, B, D vuông')
  const cap = (x, t, y = 0) => num(P(x, y + h + 62), t, 0, 0, 22)
  const pts = [A1, B1, C1, D1, A2, B2, C2, D2, A3, B3, C3, D3, P(x3 + 150 * k, y3 + h + 62)]
  hinh('HHC002533', pts, [
    // Hình 1
    seg(A1, B1), seg(B1, C1), seg(C1, D1), seg(D1, A1), seg(A1, C1), seg(B1, D1),
    tick(A1, O1, 2), tick(O1, C1, 2), tick(B1, O1, 1), tick(O1, D1, 1), rightAngle(O1, B1, C1, 12),
    dot(O1), label(A1, 'A', -12, -10), label(B1, 'B', 14, -10), label(C1, 'C', 14, 26), label(D1, 'D', -12, 26),
    cap((A1.x + C1.x) / 2, 'Hình 1'),
    // Hình 2
    seg(A2, B2), seg(B2, C2), seg(C2, D2), seg(D2, A2),
    tick(A2, B2, 1), tick(D2, C2, 1), tick(A2, D2, 2), tick(B2, C2, 2),
    label(A2, 'A', -12, -10), label(B2, 'B', 14, -10), label(C2, 'C', 14, 26), label(D2, 'D', -12, 26),
    cap((A2.x + C2.x) / 2, 'Hình 2'),
    // Hình 3
    seg(A3, B3), seg(B3, C3), seg(C3, D3), seg(D3, A3),
    rightAngle(A3, B3, D3, 14), rightAngle(B3, A3, C3, 14), rightAngle(D3, A3, C3, 14),
    label(A3, 'A', -12, -10), label(B3, 'B', 14, -10), label(C3, 'C', 14, 26), label(D3, 'D', -12, 26),
    cap((A3.x + C3.x) / 2, 'Hình 3', y3),
  ], { pad: 34, padDuoi: 22 })
}

// ── HHC002534_lg — ABC vuông ở A, AH ⊥ BC, HE ⊥ AB, HF ⊥ AC, M đối xứng H qua F, N đối xứng H qua E.
{
  const k = 0.46
  const A = P(0, 0), B = P(603 * k, 0), C = P(0, -393 * k)
  const H = foot(A, B, C), E = foot(H, A, B), F = foot(H, A, C)
  const M = doiXung(H, F), N = doiXung(H, E)
  ok(near(goc(A, B, C), 90), 'A vuông')
  ok(near(goc(H, A, B), 90) && near(goc(H, A, C), 90), 'AH ⊥ BC')
  ok(near(goc(E, A, H), 90) && near(goc(F, A, H), 90), 'HE ⊥ AB, HF ⊥ AC')
  ok(near(dist(F, H), dist(F, M)) && near(dist(E, H), dist(E, N)), 'FH = FM, EH = EN')
  ok(goc(A, M, N) > 179.5, 'A, M, N thẳng hàng (hệ quả của dựng)')
  hinh('HHC002534_lg', [A, B, C, E, F, H, M, N], [
    seg(C, A), seg(A, B), seg(C, B), seg(M, H), seg(H, N), seg(A, H), seg(F, E), seg(M, A),
    rightAngle(A, B, C, 14), rightAngle(F, A, H, 14), rightAngle(E, A, H, 14), rightAngle(H, A, B, 12),
    tick(M, F, 1), tick(F, H, 1), tick(H, E, 2), tick(E, N, 2),
    dot(A), dot(C), dot(B), dot(E), dot(F), dot(H), dot(M), dot(N),
    label(A, 'A', 14, 28), label(B, 'B', 10, 30), label(C, 'C', 10, -14), label(E, 'E', -18, 30),
    label(F, 'F', -22, -8), label(H, 'H', 18, -10), label(M, 'M', -12, -14), label(N, 'N', 20, 22),
  ], { pad: 36, padDuoi: 44 })
}

// ── HHC002538_lg — ABC vuông tại A, đường cao AH, M trung điểm HC, D đối xứng A qua M, N, K trung điểm AH, CD,
//    BN ∩ HD = E, KQ ⊥ AD (cắt AD tại X, không đặt tên) với Q ∈ HD.
{
  const k = 0.47
  const B = P(0, 0), H = P(185 * k, 0), C = P(805 * k, 0)
  const A = P(H.x, -Math.sqrt(dist(B, H) * dist(H, C)))               // AH² = BH·HC ⇒ góc A vuông
  const M = mid(H, C), D = doiXung(A, M), N = mid(A, H), K = mid(C, D)
  const E = inter(B, N, H, D)
  const X = foot(K, A, D), Q = inter(K, X, H, D)
  ok(near(goc(A, B, C), 90) && dist(A, B) < dist(A, C), 'A vuông, AB < AC')
  ok(song(A, H, C, D) && near(dist(A, H), dist(C, D)), 'AHDC hình bình hành')
  ok(near(goc(H, A, B), 90) && near(goc(X, K, A), 90), 'AH ⊥ BC, KQ ⊥ AD')
  ok(goc(M, N, K) > 179.5, 'N, M, K thẳng hàng (hệ quả)')
  ok(song(N, K, H, D), 'NK ∥ HD (hệ quả)')
  ok(goc(Q, H, D) > 179.5 && dist(H, Q) < dist(H, D), 'Q nằm giữa H và D')
  hinh('HHC002538_lg', [A, B, C, D, E, H, K, M, N, Q], [
    seg(B, C), seg(A, B), seg(A, C), seg(A, H), seg(A, D), seg(C, D), seg(E, D), seg(N, C), seg(N, K), seg(H, K), seg(K, Q), seg(B, N),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 14), rightAngle(X, K, D, 12),
    tick(A, N, 3), tick(N, H, 3), tick(C, K, 4), tick(K, D, 4), tick(A, M, 2), tick(M, D, 2), tick(H, M, 1), tick(M, C, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(K), dot(M), dot(N), dot(Q),
    label(A, 'A', 0, -14), label(B, 'B', -6, 30), label(C, 'C', 18, -2), label(D, 'D', 18, 20), label(E, 'E', 24, 6),
    label(H, 'H', -4, 30), label(K, 'K', 18, 6), label(M, 'M', 2, 30), label(N, 'N', -18, 6), label(Q, 'Q', -10, 30),
  ], { pad: 34, padDuoi: 44 })
}

// ── HHC002541_lg — ABC vuông cân tại A, M trung điểm BC, D ∈ tia đối của tia MA (MD ≠ MA), DE ⊥ AB, DF ⊥ AC,
//    I = AD ∩ EF, EN ⊥ MF tại N.
{
  const k = 0.6
  const A = P(0, 0), B = P(480 * k, 0), C = P(0, 480 * k)
  const M = mid(B, C), D = lerp(A, M, 4 / 3)                           // D bất kì ngoài M (đề: MD ≠ MA)
  const E = foot(D, A, B), F = foot(D, A, C), I = mid(A, D)
  const N = foot(E, F, M)
  ok(near(goc(N, E, F), 90), 'EN ⊥ FN (tam giác ENF vuông tại N)')
  ok(near(goc(A, B, C), 90) && near(dist(A, B), dist(A, C)), 'ABC vuông cân tại A')
  ok(dist(M, D) > 1 && !near(dist(M, D), dist(M, A), 1), 'MD ≠ MA')
  ok(near(goc(A, E, D), 45) && near(goc(A, F, D), 45), 'đường chéo AD (hệ quả của dựng)')
  hinh('HHC002541_lg', [A, B, C, D, E, F, I, M, N], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(E, F), seg(E, D), seg(F, D), seg(F, N), seg(E, N),
    rightAngle(A, B, C, 14), rightAngle(E, A, D, 14), rightAngle(F, A, D, 14), rightAngle(N, E, F, 12),
    tick(B, M, 1, 0.25), tick(M, C, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I), dot(M), dot(N),
    label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 0, 32), label(D, 'D', 20, 28), label(E, 'E', 0, -14),
    label(F, 'F', -20, 8), label(I, 'I', 20, -6), label(M, 'M', 28, 17), label(N, 'N', 20, 8),
  ], { pad: 36, padDuoi: 44 })
}

// ── HHC002544_lg — ABC vuông tại A (AB > AC), trung tuyến AM, MD ⊥ AB, ME ⊥ AC, O trung điểm ME.
{
  const k = 0.45
  const A = P(0, 0), B = P(800 * k, 0), C = P(0, -500 * k)
  const M = mid(B, C), D = foot(M, A, B), E = foot(M, A, C), O = mid(M, E)
  ok(near(goc(A, B, C), 90) && dist(A, B) > dist(A, C), 'A vuông, AB > AC')
  ok(near(goc(D, A, M), 90) && near(goc(E, A, M), 90), 'MD ⊥ AB, ME ⊥ AC')
  hinh('HHC002544_lg', [A, B, C, D, E, M, O], [
    seg(C, A), seg(A, B), seg(B, C), seg(A, M), seg(E, M), seg(M, D),
    rightAngle(A, B, C, 14), rightAngle(D, A, M, 14), rightAngle(E, A, M, 14),
    tick(C, M, 1), tick(M, B, 1), tick(E, O, 2), tick(O, M, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(O),
    label(A, 'A', -18, 18), label(B, 'B', 14, 30), label(C, 'C', 0, -14), label(D, 'D', 0, 32),
    label(E, 'E', -20, 6), label(M, 'M', 20, -8), label(O, 'O', 0, -14),
  ], { pad: 36, padDuoi: 44 })
}

// ── HHC002549_lg — ABC nhọn (AB < BC, AB < AC), M trung điểm AB, MN ∥ BC (N ∈ AC), D ∈ BC với BD = MN, AH ⊥ BC.
{
  const k = 0.55
  const B = P(0, 0), C = P(748 * k, 0), A = P(203 * k, -407 * k)
  const H = foot(A, B, C), M = mid(A, B)
  const N = inter(M, P(M.x + 100, M.y), A, C)                           // MN ∥ BC
  const D = P(B.x + dist(M, N), 0)                                       // BD = MN, D ∈ BC
  ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, 'tam giác nhọn')
  ok(dist(A, B) < dist(B, C) && dist(A, B) < dist(A, C), 'AB < BC, AB < AC')
  ok(near(dist(B, D), dist(M, N)) && song(M, N, B, C), 'BD = MN, MN ∥ BC')
  ok(H.x > B.x && H.x < D.x, 'H nằm giữa B và D')
  hinh('HHC002549_lg', [A, B, C, D, H, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(M, N), seg(M, H), seg(N, D),
    rightAngle(H, A, C, 14),
    tick(A, M, 1), tick(M, B, 1), tick(M, N, 2), tick(B, D, 2, 0.4),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -8, 30), label(C, 'C', 16, 30), label(D, 'D', 4, 30), label(H, 'H', -8, 30),
    label(M, 'M', -20, 8), label(N, 'N', 20, 4),
  ], { pad: 36, padDuoi: 44 })
}

await xuatTat(RA)
