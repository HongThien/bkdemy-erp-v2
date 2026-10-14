// Gói vẽ HÌNH THEO Ý — K8-g3 (lớp 8). Luật: docs/mau-brief-ve-hinh-theo-y.md + docs/mau-brief-ve-lai-hinh.md §4 + §5.
//   node scripts/hinh-luyen/ve/K8-g3.mjs [<thư mục ra>]
import { P, seg, tick, rightAngle, angleMark, angleText, num, sideText, dot, label, labelOut, hinh, xuatTat, mid, foot, inter, doiXung, lerp, ray, add, vec, rot, dist, goc, trongTam } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g3/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b) => Math.abs(a - b) < 0.5
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6 * dist(a, b) * dist(c, d)
const L = (p, t, c, d = 24) => labelOut(p, t, c, d)
const nhanDinh = (ps, c) => ps.map(([p, t]) => dot(p) + L(p, t, c))

// ───── HLB00121 (HHC002468): ABCD có AB∥CD, AD=BC, góc A=60°. HLY00304 (ý d): nếu A=90° ─────
// Hình vẽ theo phản ví dụ (hình bình hành) — vẫn thoả mọi giả thiết; KHÔNG ký hiệu AB∥CD là điều đã cho nên chỉ ghi nhãn.
{
  const A = P(0, 0), B = P(270, 0), D = ray(A, -60, 140), C = add(B, vec(A, D))
  ok(gan(goc(A, B, D), 60), 'A=60'); ok(song2(A, B, D, C), 'AB∥CD'); ok(gan(dist(A, D), dist(B, C)), 'AD=BC')
  const c = trongTam([A, B, C, D])
  hinh('HLB00121', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 30), angleText(A, B, D, '60°', 66),
    tick(A, D, 1), tick(B, C, 1),
    ...nhanDinh([[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']], c),
  ])
  // ý d: A = 90° — hình chữ nhật AB=4, AD=3 (phản ví dụ)
  const a = P(0, 0), b = P(240, 0), d = P(0, 180), cc = P(240, 180)
  const c2 = trongTam([a, b, cc, d])
  hinh('HLY00304', [a, b, cc, d], [
    seg(a, b), seg(b, cc), seg(cc, d), seg(d, a), rightAngle(a, b, d, 15),
    tick(a, d, 1), tick(b, cc, 1),
    ...nhanDinh([[a, 'A'], [b, 'B'], [cc, 'C'], [d, 'D']], c2),
  ])
}

// ───── HLB00122 (HHC002469): hình thoi ABCD, A = 2B (bài một ý) ⇒ A=120°, B=60° dựng đúng, KHÔNG ghi số ─────
{
  const A = P(0, 0), B = P(200, 0), D = ray(A, -120, 200), C = add(B, vec(A, D))
  ok(gan(goc(A, B, D), 120), 'A=120'); ok(gan(goc(B, A, C), 60), 'B=60 (A=2B)')
  ok(gan(dist(A, B), dist(B, C)) && gan(dist(B, C), dist(C, D)) && gan(dist(C, D), dist(D, A)), 'hình thoi')
  const c = trongTam([A, B, C, D])
  hinh('HLB00122', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    tick(A, B, 1), tick(B, C, 1), tick(C, D, 1), tick(D, A, 1),
    ...nhanDinh([[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']], c),
  ])
}

// ───── HLB00123 (HHC002470): hình bình hành ABCD, AC∩BD=O; AB=7, BC=5, AC=10 (bài một ý) ─────
{
  const s = 34, A = P(0, 0), B = P(7 * s, 0)
  const cosA = (49 + 100 - 25) / (2 * 7 * 10), angA = Math.acos(cosA) * 180 / Math.PI
  const C = ray(A, angA, 10 * s), D = add(C, vec(B, A)), O = inter(A, C, B, D)
  ok(gan(dist(A, B) / s, 7) && Math.abs(dist(B, C) / s - 5) < 0.02 && Math.abs(dist(A, C) / s - 10) < 0.02, 'AB=7, BC=5, AC=10')
  ok(song2(A, B, D, C) && song2(A, D, B, C), 'bình hành')
  const c = trongTam([A, B, C, D])
  const nhanCanh = (a, b, t, t0, from, d = 20) => { const m = lerp(a, b, t0), h = foot(from, a, b), v = vec(from, h), l = Math.hypot(v.x, v.y); return num(P(m.x + v.x / l * d, m.y + v.y / l * d), t, 0, 7.5, 22) }
  hinh('HLB00123', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    nhanCanh(A, B, '7 cm', 0.5, O, 22), nhanCanh(B, C, '5 cm', 0.5, O, 28), nhanCanh(A, C, '10 cm', 0.25, D, 22),
    ...nhanDinh([[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']], c), dot(O), label(O, 'O', 4, -14),
  ])
}

// ───── HLB00124 (HHC002471): △ABC vuông tại A, đường cao AH; HD⊥AB, HE⊥AC ─────
{
  const A = P(0, 0), B = P(0, -190), C = P(300, 0)
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, D), seg(H, E),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 10), rightAngle(D, H, A, 11), rightAngle(E, H, A, 11)]
  const c = trongTam([A, B, C])
  const nhan = [dot(A), dot(B), dot(C), dot(H), dot(D), dot(E),
    L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(H, 'H', 12, -10), L(D, 'D', c), L(E, 'E', c)]
  hinh('HLB00124', [A, B, C], [...nen, ...nhan])
  // ý b (HLY00308): O trung điểm HC; G đối xứng A qua O. KHÔNG nối H–G (D, H, G thẳng hàng là điều phải chứng minh).
  const O = mid(H, C), G = doiXung(A, O)
  ok(gan(dist(A, O), dist(O, G)) && gan(dist(H, O), dist(O, C)), 'O trung điểm HC, AG')
  hinh('HLY00308', [A, B, C, G], [...nen, seg(A, G), tick(H, O, 1), tick(O, C, 1), tick(A, O, 2), tick(O, G, 2), ...nhan, dot(O), dot(G), label(O, 'O', 4, 26), label(G, 'G', 18, 8)])
}

// ───── HLB00125 (HHC002472): tứ giác ABCD, A=105°, B=90°, D=86° (hình bên) ─────
{
  const A = P(0, 0), B = ray(A, 52, 180), D = ray(A, -53, 180)
  const C = inter(B, ray(B, -38, 100), D, ray(D, 41, 100))
  ok(gan(goc(A, B, D), 105), 'A=105'); ok(gan(goc(B, A, C), 90), 'B=90'); ok(gan(goc(D, A, C), 86), 'D=86'); ok(gan(goc(C, B, D), 79), 'C=79 (không ghi)')
  const c = trongTam([A, B, C, D])
  hinh('HLB00125', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    rightAngle(B, A, C, 14), angleMark(A, B, D, 32), angleText(A, B, D, '105°', 78), angleMark(D, A, C, 34), angleText(D, A, C, '86°', 70),
    ...nhanDinh([[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']], c),
  ])
}

// ───── HLB00126 (HHC002473): △ABC vuông tại A (AB<AC), M bất kì trên BC, MD⊥AB, ME⊥AC ─────
{
  const A = P(0, 0), B = P(0, -150), C = P(240, 0)
  const M = lerp(B, C, 0.55), D = foot(M, A, B), E = foot(M, A, C)
  ok(dist(A, B) < dist(A, C), 'AB<AC')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, D), seg(M, E), rightAngle(A, B, C, 14), rightAngle(D, M, A, 12), rightAngle(E, M, A, 12)]
  const c = trongTam([A, B, C])
  const nhan = [dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(M, 'M', 14, -12), L(D, 'D', c), L(E, 'E', c)]
  hinh('HLB00126', [A, B, C], [...nen, ...nhan])
  // ý b (HLY00311): Ax∥DE cắt tia ME tại F; G trên tia MD, D trung điểm MG. KHÔNG nối G–F (A trung điểm GF là điều phải chứng minh).
  const F = inter(A, add(A, vec(D, E)), E, M), G = doiXung(M, D), X = lerp(A, F, 1.3)
  ok(song2(A, F, D, E), 'Ax∥DE'); ok(gan(dist(D, G), dist(D, M)), 'D trung điểm MG')
  const nenB = [...nen, rightAngle(M, D, E, 12), seg(D, E), seg(E, F), seg(F, X), seg(A, F), seg(D, G), tick(M, D, 1), tick(D, G, 1)]
  hinh('HLY00311', [A, B, C, F, G, X], [...nenB, ...nhan.filter((x) => !x.includes('>D</text>')), label(D, 'D', -14, -14), dot(F), dot(G), label(F, 'F', -4, 26), label(G, 'G', -20, 8), label(X, 'x', 16, 8)])
  // ý c (HLY00312): AM cắt DE tại O; đường cao AH; hỏi góc DHE ⇒ nối DH, EH. Bỏ F, G (ý này không dùng).
  const H = foot(A, B, C), O = inter(A, M, D, E)
  ok(dist(H, M) > 5, 'H khác M')
  hinh('HLY00312', [A, B, C], [
    ...nen, rightAngle(M, D, E, 12), seg(A, M), seg(D, E), seg(A, H), seg(D, H), seg(E, H), rightAngle(H, A, C, 9),
    ...nhan, dot(O), dot(H), label(O, 'O', 14, -10), label(H, 'H', 4, -14),
  ])
}

// ───── HLB00128 (HHC002475): ABCD có A=50°, B=123°, D=20° (bài một ý) — góc C không ghi ─────
{
  // dựng theo hướng đi: AB (0°) → BC (57°) → CD (70°) → DA (230°); xoay cho DA nằm ngang, thu nhỏ cho vừa khung
  const A0 = P(0, 0), B0 = ray(A0, 0, 220), C0 = ray(B0, 57, 250)
  const D0 = inter(A0, ray(A0, 50, 100), C0, ray(C0, 70, 100))
  const k = 0.55, xf = (p) => { const q = rot(p, A0, -50); return P(q.x * k, q.y * k) }
  const A = xf(A0), B = xf(B0), C = xf(C0), D = xf(D0)
  ok(gan(goc(A, B, D), 50), 'A=50'); ok(gan(goc(B, A, C), 123), 'B=123'); ok(gan(goc(D, A, C), 20), 'D=20'); ok(gan(goc(C, B, D), 167), 'C=167 (không ghi)')
  const c = trongTam([A, B, C, D])
  hinh('HLB00128', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 40), angleText(A, B, D, '50°', 84),
    angleMark(B, A, C, 28), num(P(B.x + 36, B.y + 34), '123°', 0, 0, 22),
    angleMark(D, A, C, 60), num(P(D.x + 6, D.y + 38), '20°', 0, 0, 22),
    dot(A), dot(B), dot(C), dot(D), L(A, 'A', c), label(B, 'B', -22, 14), L(C, 'C', c), label(D, 'D', 16, -12),
  ])
}

// ───── HLB00129 (HHC002479): △ABC vuông tại A (AB<AC), AH cao; HM⊥AB, HN⊥AC; I trung điểm HC; K đối xứng A qua I ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C), I = mid(H, C), K = doiXung(A, I), O = inter(M, N, A, H)
  ok(dist(A, B) < dist(A, C), 'AB<AC'); ok(gan(dist(A, I), dist(I, K)), 'I trung điểm AK')
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), rightAngle(A, B, C, 14), rightAngle(H, A, C, 9)]
  const c = trongTam([A, B, C])
  const nhanCoBan = [dot(A), dot(B), dot(C), dot(H), L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(H, 'H', 4, -14)]
  const hm = [seg(H, M), seg(H, N), rightAngle(M, H, A, 11), rightAngle(N, H, A, 11), dot(M), dot(N), L(M, 'M', c), L(N, 'N', c)]
  hinh('HLB00129', [A, B, C, K], [...base, ...hm, seg(A, K), tick(H, I, 1), tick(I, C, 1), tick(A, I, 2), tick(I, K, 2),
    ...nhanCoBan, dot(I), dot(K), label(I, 'I', 14, 26), label(K, 'K', 20, 0)])
  // ý a (HLY00315): tứ giác AHKC ⇒ nối HK, KC
  hinh('HLY00315', [A, B, C, K], [...base, ...hm, seg(A, K), seg(H, K), seg(K, C), tick(H, I, 1), tick(I, C, 1), tick(A, I, 2), tick(I, K, 2),
    ...nhanCoBan, dot(I), dot(K), label(I, 'I', 14, 26), label(K, 'K', 20, 0)])
  // ý b (HLY00316): MN cắt AH tại O; hỏi MH∥AC, góc OMH, HKC ⇒ giữ HM, HN, MN, HK, KC; bỏ I, AK (ý này không dùng). KHÔNG ký hiệu MH∥AC.
  hinh('HLY00316', [A, B, C, K], [...base, ...hm, seg(M, N), seg(H, K), seg(K, C),
    ...nhanCoBan, dot(K), dot(O), label(K, 'K', 20, 0), label(O, 'O', -18, 4)])
  // ý c (HLY00317): D = CO ∩ AK; O trung điểm AH (đã chứng minh ở ý b). Bỏ M, N, HK, KC.
  const D = inter(C, O, A, K)
  ok(gan(dist(A, O), dist(O, H)), 'O trung điểm AH')
  hinh('HLY00317', [A, B, C, K], [...base, seg(A, K), seg(C, O), tick(A, O, 3), tick(O, H, 3), tick(H, I, 1), tick(I, C, 1), tick(A, I, 2), tick(I, K, 2),
    ...nhanCoBan, dot(I), dot(K), dot(O), dot(D), label(I, 'I', 14, 26), label(K, 'K', 20, 0), label(O, 'O', -18, 4), label(D, 'D', 4, -14)])
}

// ───── HLB00130 (HHC002480): △ABC, D, E trung điểm AB, AC; BC=5; ∠ADE=70°, ∠DAE=60° (ý a: không dựng thêm trên hình; điểm F chỉ ở lời giải) ─────
{
  const B = P(0, 0), C = P(300, 0)
  const A = inter(B, ray(B, 70, 100), C, ray(C, 130, 100)), D = mid(A, B), E = mid(A, C)
  ok(gan(goc(A, D, E), 60), 'DAE=60'); ok(gan(goc(D, A, E), 70), 'ADE=70')
  const c = trongTam([A, B, C])
  hinh('HLB00130', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E),
    tick(A, D, 1), tick(D, B, 1), tick(A, E, 2), tick(E, C, 2),
    angleMark(A, D, E, 34), angleText(A, D, E, '60°', 58), angleMark(D, A, E, 30), angleText(D, A, E, '70°', 46),
    sideText(B, C, '5 cm', A, 24),
    ...nhanDinh([[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E']], c),
  ])
}

// ───── HLB00131 (HHC002481): △ABC vuông tại A (AB<AC), M trung điểm BC; MD⊥AB, ME⊥AC ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const M = mid(B, C), D = foot(M, A, B), E = foot(M, A, C), H = foot(A, B, C)
  ok(dist(A, B) < dist(A, C), 'AB<AC'); ok(dist(H, M) > 5, 'H khác M')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, D), seg(M, E), rightAngle(A, B, C, 14), rightAngle(D, M, A, 12), rightAngle(E, M, A, 12), tick(B, M, 1, 0.3), tick(M, C, 1)]
  const c = trongTam([A, B, C])
  const nhan = [dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(M, 'M', 14, -12), L(D, 'D', c), L(E, 'E', c)]
  hinh('HLB00131', [A, B, C], [...nen, ...nhan])
  // ý a (HLY00320): hỏi AM = DE ⇒ nối AM, DE (không ký hiệu bằng nhau)
  hinh('HLY00320', [A, B, C], [...nen, seg(A, M), seg(D, E), ...nhan])
  // ý b (HLY00321): DMCE ⇒ nối DE; AM không dùng ⇒ bỏ
  hinh('HLY00321', [A, B, C], [...nen, rightAngle(M, D, E, 12), seg(D, E), ...nhan])
  // ý c (HLY00322): AH cao; HMED, HD⊥HE ⇒ nối DE, DH, EH
  hinh('HLY00322', [A, B, C], [...nen, rightAngle(M, D, E, 12), seg(D, E), seg(A, H), seg(D, H), seg(E, H), rightAngle(H, A, C, 9),
    ...nhan, dot(H), label(H, 'H', 14, -12)])
}

// ───── HLB00132 (HHC002490): △ABC vuông tại A (AB<AC), trung tuyến AM; MN⊥AC, MP⊥AB ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const M = mid(B, C), N = foot(M, A, C), P_ = foot(M, A, B)
  ok(dist(A, B) < dist(A, C), 'AB<AC')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(M, P_), rightAngle(A, B, C, 14), rightAngle(N, M, A, 12), rightAngle(P_, M, A, 12)]
  const c = trongTam([A, B, C])
  const nhan = [dot(A), dot(B), dot(C), dot(M), dot(N), dot(P_), L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(M, 'M', 14, -12), L(N, 'N', c), label(P_, 'P', -16, -12)]
  hinh('HLB00132', [A, B, C], [...nen, seg(A, M), tick(B, M, 1), tick(M, C, 1), ...nhan])
  // ý b (HLY00324): Q đối xứng M qua N, K đối xứng M qua P. KHÔNG nối QK; bỏ AM, BM=MC (ý này không dùng).
  const Q = doiXung(M, N), K = doiXung(M, P_)
  ok(gan(dist(N, Q), dist(N, M)) && gan(dist(P_, K), dist(P_, M)), 'N, P trung điểm')
  hinh('HLY00324', [A, B, C, Q, K], [...nen, rightAngle(M, N, P_, 12), seg(N, Q), seg(P_, K), tick(M, N, 2), tick(N, Q, 2), tick(M, P_, 3), tick(P_, K, 3),
    ...nhan.filter((x) => !x.includes('>N</text>') && !x.includes('>P</text>')), label(N, 'N', 18, 24), label(P_, 'P', -14, 28), dot(Q), dot(K), label(Q, 'Q', 4, 28), label(K, 'K', -22, 8)])
}

await xuatTat(RA)
