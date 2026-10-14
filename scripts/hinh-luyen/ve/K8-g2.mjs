// Gói vẽ HÌNH THEO Ý — K8-g2. Luật: docs/mau-brief-ve-lai-hinh.md §4 + §5; brief: docs/mau-brief-ve-hinh-theo-y.md
//   node scripts/hinh-luyen/ve/K8-g2.mjs [<thư mục ra>]
import { P, seg, segDash, tick, rightAngle, angleMark, dot, label, num, angleText, hinh, xuatTat, mid, foot, inter, doiXung, lineExt, dist, goc, ray, add } from '../../anh/ve_hinh_lib.mjs'

const RA = process.argv[2] || 'scripts/hinh-luyen/ve/K8-g2/moi'
const ok = (dk, msg) => console.assert(dk, `✘ ${msg}`)
const gan = (a, b, e = 0.5) => Math.abs(a - b) < e
const dots = (...ps) => ps.map(dot)

// ───── HLB00109: △ABC vuông tại A (AB<AC), đường cao AH; HM ⊥ AB, HN ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB<AC')
  ok(gan(goc(H, A, C), 90), 'AH⊥BC'); ok(gan(goc(M, A, H), 90), 'HM⊥AB'); ok(gan(goc(N, A, H), 90), 'HN⊥AC')
  const goc_ = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(H, N), rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(M, A, H, 11), rightAngle(N, A, H, 11)]
  const nhanGoc = [label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(H, 'H', 16, -8), label(M, 'M', -22, 6), label(N, 'N', 0, 26)]
  hinh('HLB00109', [A, B, C], [...goc_, ...dots(A, B, C, H, M, N), ...nhanGoc])

  // ý b (HLY00277): E trung điểm HC; I đối xứng A qua E. N không dùng ở ý này ⇒ bỏ HN, N.
  const E = mid(H, C), I = doiXung(A, E)
  ok(gan(dist(E, I), dist(E, A)), 'E trung điểm AI')
  hinh('HLY00277', [A, B, C, I], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(A, I), seg(H, I), seg(I, C),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(M, A, H, 11),
    tick(H, E, 1), tick(E, C, 1), tick(A, E, 2, 0.45), tick(E, I, 2, 0.55),
    ...dots(A, B, C, H, M, E, I),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(H, 'H', 4, -14), label(M, 'M', -22, 6),
    label(E, 'E', 8, 26), label(I, 'I', 16, 2),
  ])

  // ý c (HLY00278): F = MN ∩ AH; CF ∩ AI = G. Không dùng HI, IC ⇒ bỏ; giữ A–E–I vì G nằm trên AI.
  const F = inter(M, N, A, H), G = inter(C, F, A, I)
  hinh('HLY00278', [A, B, C, I], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(H, N), seg(M, N), seg(A, I), seg(C, F),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 11), rightAngle(M, A, H, 11), rightAngle(N, A, H, 11),
    tick(H, E, 1), tick(E, C, 1), tick(A, E, 2, 0.45), tick(E, I, 2, 0.55),
    ...dots(A, B, C, H, M, N, E, I, F, G),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(H, 'H', 4, -14), label(M, 'M', -22, 6), label(N, 'N', 0, 26),
    label(E, 'E', 10, 26), label(I, 'I', 16, 2), label(F, 'F', -16, 4), label(G, 'G', -4, -12),
  ])
}

// ───── HLB00110: △ABC cân tại A, đường cao AH; I trung điểm AC; I trung điểm HM ─────
{
  const A = P(0, -200), B = P(-140, 0), C = P(140, 0), H = foot(A, B, C)
  const I = mid(A, C), M = doiXung(H, I)
  ok(gan(dist(A, B), dist(A, C)), 'cân A'); ok(gan(goc(H, A, C), 90), 'AH⊥BC')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), rightAngle(H, A, C, 12), tick(A, B, 3), tick(A, C, 3, 0.92), tick(A, I, 1, 0.5), tick(I, C, 1, 0.55), tick(H, I, 2), tick(I, M, 2)]
  const nhan = [label(A, 'A', 0, -14), label(B, 'B', -16, 8), label(C, 'C', 18, 8), label(H, 'H', 0, 26), label(I, 'I', -16, 14), label(M, 'M', 20, -8)]
  hinh('HLB00110', [A, B, C, M], [...nen, ...dots(A, B, C, H, I, M), ...nhan])
  // ý a (HLY00279): tứ giác AHCM ⇒ nối AM, CM
  hinh('HLY00279', [A, B, C, M], [...nen, seg(A, M), seg(C, M), ...dots(A, B, C, H, I, M), ...nhan])
  // ý b (HLY00280): K trung điểm HC; nối KI. AHCM chữ nhật (đã CM ở a): đánh dấu góc vuông.
  const K = mid(H, C)
  hinh('HLY00280', [A, B, C, M], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(A, M), seg(C, M), seg(K, I),
    rightAngle(H, A, C, 12), rightAngle(C, H, M, 12), rightAngle(M, A, C, 12),
    tick(A, I, 1), tick(I, C, 1), tick(H, I, 2), tick(I, M, 2), tick(H, K, 3), tick(K, C, 3),
    ...dots(A, B, C, H, I, M, K),
    label(A, 'A', 0, -14), label(B, 'B', -16, 8), label(C, 'C', 18, 8), label(H, 'H', -6, 26), label(I, 'I', -16, 14), label(M, 'M', 20, -8), label(K, 'K', 4, 26),
  ])
  // ý c (HLY00281): E trung điểm AH. KHÔNG nối B–E–M. K, KI không dùng ⇒ bỏ.
  const E = mid(A, H)
  hinh('HLY00281', [A, B, C, M], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, M), seg(A, M), seg(C, M),
    rightAngle(H, A, C, 12), rightAngle(C, H, M, 12), rightAngle(M, A, C, 12),
    tick(A, B, 3), tick(A, C, 3, 0.22), tick(A, E, 1), tick(E, H, 1),
    ...dots(A, B, C, H, M, E),
    label(A, 'A', 0, -14), label(B, 'B', -16, 8), label(C, 'C', 18, 8), label(H, 'H', 0, 26), label(M, 'M', 20, -8), label(E, 'E', -16, 6),
  ])
}

// ───── HLB00111: sơ đồ đo BC bị chướng ngại vật; D, E trung điểm AB, AC (bài một ý ⇒ không có HLY) ─────
{
  const A = P(0, 0), B = P(-78, -242), C = P(220, -286)
  const D = mid(A, B), E = mid(A, C), O = mid(B, C)
  const vat = `<ellipse cx="${O.x}" cy="${O.y}" rx="62" ry="36" fill="#fff"/>`
  hinh('HLB00111', [A, B, C, P(O.x, O.y - 40), P(O.x, O.y + 40)], [
    segDash(B, C), vat, seg(A, B), seg(A, C), seg(D, E),
    tick(A, D, 1), tick(D, B, 1), tick(A, E, 2), tick(E, C, 2),
    ...dots(A, B, C, D, E),
    label(A, 'A', 0, 30), label(B, 'B', -20, 4), label(C, 'C', 20, 4), label(D, 'D', -22, 8), label(E, 'E', 20, 10),
  ])
}

// ───── HLB00112: △ABC vuông tại A (AB<AC), H trung điểm BC, HM ⊥ AB, HN ⊥ AC ─────
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const H = mid(B, C), M = foot(H, A, B), N = foot(H, A, C), I = foot(A, B, C)
  ok(gan(goc(A, B, C), 90), 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB<AC')
  ok(gan(goc(M, A, H), 90), 'HM⊥AB'); ok(gan(goc(N, A, H), 90), 'HN⊥AC'); ok(gan(goc(I, A, B), 90), 'AI⊥BC')
  const nhan = [label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(H, 'H', 16, -8), label(M, 'M', -22, 6), label(N, 'N', 0, 26)]
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(H, M), seg(H, N), rightAngle(A, B, C, 14), rightAngle(M, A, H, 11), rightAngle(N, A, H, 11), tick(B, H, 1), tick(H, C, 1)]
  hinh('HLB00112', [A, B, C], [...nen, ...dots(A, B, C, H, M, N), ...nhan])
  // ý b (HLY00284): tứ giác MHCN ⇒ nối MN. AMHN chữ nhật (đã CM ở a) ⇒ góc vuông tại H.
  hinh('HLY00284', [A, B, C], [...nen, seg(M, N), rightAngle(H, M, N, 11), ...dots(A, B, C, H, M, N), ...nhan])
  // ý c (HLY00285): AI ⊥ BC; câu hỏi nhắc IM, IN; lời giải dùng AH, MN. KHÔNG ghi góc MIN.
  hinh('HLY00285', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(H, M), seg(H, N), seg(M, N), seg(A, H), seg(A, I), seg(I, M), seg(I, N),
    rightAngle(A, B, C, 14), rightAngle(I, A, C, 10), tick(B, H, 1), tick(H, C, 1),
    ...dots(A, B, C, H, M, N, I),
    label(A, 'A', -18, 20), label(B, 'B', -18, -4), label(C, 'C', 16, 18), label(H, 'H', 18, -4), label(M, 'M', -22, 6), label(N, 'N', 0, 26), label(I, 'I', 14, -14),
  ])
}

// ───── HLB00113: MN ∥ PQ, MQ = NP, M = 80° — hai hình có thể xảy ra (thang cân / bình hành) ─────
{
  const mk = (ox, dx, ten) => {
    const M = P(ox, 0), N = P(ox + 170, 0), Q = add(M, P(115 * Math.cos(80 * Math.PI / 180), 115 * Math.sin(80 * Math.PI / 180)))
    const Pp = P(N.x + dx * (Q.x - M.x), Q.y)
    ok(gan(goc(M, N, Q), 80), '80°'); ok(gan(dist(M, Q), dist(N, Pp)), 'MQ=NP')
    return { M, N, Q, P: Pp, body: [
      seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M), angleMark(M, N, Q, 30), angleText(M, N, Q, '80°', 58, 20), tick(M, Q, 1), tick(N, Pp, 1),
      ...dots(M, N, Pp, Q),
      label(M, 'M', -16, -8), label(N, 'N', 18, -8), label(Pp, 'P', 18, 24), label(Q, 'Q', -18, 24), num(P(ox + 90, 160), ten, 0, 0, 24),
    ] }
  }
  const a = mk(0, -1, 'Hình 1'), b = mk(255, 1, 'Hình 2')
  hinh('HLB00113', [a.M, a.N, a.P, a.Q, b.M, b.N, b.P, b.Q, P(90, 164)], [...a.body, ...b.body], { padDuoi: 40 })
}

// ───── HLB00114: hình thoi ABCD, Â = 3·B̂ ⇒ Â = 135°, B̂ = 45° (dựng đúng; không ghi số đo) ─────
{
  const s = 220, A = P(0, 0), B = P(s, 0), D = ray(A, 135, s), C = add(B, P(D.x - A.x, D.y - A.y))
  ok(gan(goc(A, B, D), 135), 'A=135'); ok(gan(goc(B, A, C), 45), 'B=45'); ok(gan(goc(A, B, D), 3 * goc(B, A, C)), 'A=3B')
  hinh('HLB00114', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), tick(A, B, 1), tick(B, C, 1), tick(C, D, 1), tick(D, A, 1),
    ...dots(A, B, C, D),
    label(A, 'A', -16, 22), label(B, 'B', 18, 22), label(C, 'C', 18, -6), label(D, 'D', -16, -6),
  ])
}

// ───── HLB00115: hình bình hành EFGH, EF=8, FG=6, EG=10 (đúng số ⇒ thực ra là hình chữ nhật; KHÔNG ký hiệu góc vuông), O = EG ∩ FH ─────
{
  const k = 30, E = P(0, 0), F = P(8 * k, 0), G = P(8 * k, -6 * k), H = P(0, -6 * k), O = inter(E, G, F, H)
  ok(gan(dist(E, G), 10 * k), 'EG=10')
  hinh('HLB00115', [E, F, G, H, P(F.x + 90, G.y + 90)], [
    seg(E, F), seg(F, G), seg(G, H), seg(H, E), seg(E, G), seg(F, H),
    ...dots(E, F, G, H, O),
    label(E, 'E', -16, 22), label(F, 'F', 18, 22), label(G, 'G', 18, -6), label(H, 'H', -16, -6), label(O, 'O', 0, -14),
    num(mid(E, F), '8 cm', 0, 30), num(mid(F, G), '6 cm', 44, 8), num(P(E.x + 92, E.y - 26), '10 cm', 0, 0),
  ])
}

// ───── HLB00116: hình bình hành ABCD, Â = 60°, AD = 2AB; M trung điểm BC, N trung điểm AD ─────
{
  const A = P(0, 0), B = P(150, 0), D = ray(A, 60, 300), C = add(B, P(D.x - A.x, D.y - A.y))
  const M = mid(B, C), N = mid(A, D)
  ok(gan(goc(A, B, D), 60), 'A=60'); ok(gan(dist(A, D), 2 * dist(A, B)), 'AD=2AB')
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), angleMark(A, B, D, 34), angleText(A, B, D, '60°', 62, 20), tick(A, N, 1), tick(N, D, 1), tick(B, M, 2), tick(M, C, 2)]
  const nhan = [dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), label(A, 'A', -16, 22), label(B, 'B', 18, 22), label(C, 'C', 18, -6), label(D, 'D', -16, -6), label(M, 'M', 20, 8), label(N, 'N', -20, 8)]
  hinh('HLB00116', [A, B, C, D], [...nen, ...nhan])
  // ý a (HLY00292): tứ giác MCDN ⇒ nối MN
  hinh('HLY00292', [A, B, C, D], [...nen, seg(M, N), ...nhan])
  // ý b (HLY00293): DM cắt AB tại K; AM, DB, KN. MN không dùng ⇒ bỏ. KHÔNG vẽ điểm đồng quy.
  const K = doiXung(D, M)
  ok(Math.abs(K.y - A.y) < 1e-6, 'K trên AB')
  hinh('HLY00293', [A, B, C, D, K], [
    ...nen.slice(0, 4), angleMark(A, B, D, 34), num(ray(A, 45, 76), '60°', 0, 7, 20), ...nen.slice(6),
    seg(M, K), seg(B, K), seg(A, M), seg(D, B), seg(K, N),
    dot(K), label(K, 'K', 18, 22),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N),
    label(A, 'A', -16, 22), label(B, 'B', -2, 26), label(C, 'C', 18, -6), label(D, 'D', -16, -6), label(M, 'M', 20, 8), label(N, 'N', -20, 8),
  ])
}

// ───── HLB00118: hình thang cân ABCD (đáy AB<CD), đường cao AH, BK ─────
{
  const D = P(0, 0), C = P(300, 0), A = P(80, -170), B = P(220, -170)
  const H = foot(A, D, C), K = foot(B, D, C)
  ok(gan(dist(A, D), dist(B, C)), 'cân'); ok(dist(A, B) < dist(C, D), 'AB<CD')
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, H), seg(B, K), rightAngle(H, A, K, 11), rightAngle(K, B, H, 11), tick(A, D, 1), tick(B, C, 1)]
  const nhan = [label(A, 'A', -16, -6), label(B, 'B', 16, -6), label(C, 'C', 18, 22), label(D, 'D', -16, 22), label(H, 'H', -4, 28), label(K, 'K', 12, 28)]
  hinh('HLB00118', [A, B, C, D], [...nen, ...dots(A, B, C, D, H, K), ...nhan])
  // ý c (HLY00297): E đối xứng D qua H; I trung điểm EB. KHÔNG nối AC. DH=CK đã CM ở ý b ⇒ đánh dấu.
  const E = doiXung(D, H), I = mid(E, B)
  hinh('HLY00297', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, H), seg(B, K), seg(B, E), rightAngle(H, A, K, 11), rightAngle(K, B, H, 11),
    tick(D, H, 2), tick(H, E, 2), tick(K, C, 2), tick(E, I, 3), tick(I, B, 3),
    ...dots(A, B, C, D, H, K, E, I),
    label(A, 'A', -16, -6), label(B, 'B', 16, -6), label(C, 'C', 18, 22), label(D, 'D', -16, 22), label(H, 'H', -4, 28), label(K, 'K', 14, 28), label(E, 'E', 2, 28), label(I, 'I', 14, 16),
  ])
}

// ───── HLB00119: sơ đồ con diều (bài một ý ⇒ không có HLY). Số 1,2 m vẽ phóng đại cho đọc được (không đúng tỉ lệ). ─────
{
  const B = P(0, 0), C = P(150, 0), A = P(150, -200), sol = 24
  const gx = (x) => P(x, sol)
  const kite = [seg(P(A.x, A.y - 34), P(A.x + 15, A.y - 17)), seg(P(A.x + 15, A.y - 17), A), seg(A, P(A.x - 15, A.y - 17)), seg(P(A.x - 15, A.y - 17), P(A.x, A.y - 34)), seg(P(A.x, A.y - 34), A), seg(P(A.x - 15, A.y - 17), P(A.x + 15, A.y - 17))]
  hinh('HLB00119', [A, P(A.x, A.y - 64), B, gx(-80), gx(250), P(-35, 62)], [
    seg(gx(-80), gx(250)), seg(B, A), segDash(B, C), segDash(C, A), seg(P(-40, 0), B), seg(P(-34, 0), P(-34, sol)),
    rightAngle(C, B, A, 12), ...kite, dot(B),
    num(P(A.x, A.y - 44), 'Diều', 0, 0, 22), num(B, 'Tay', -30, -12, 22),
    num(mid(A, B), '40 m', -34, 4), num(mid(B, C), '24 m', 0, -12), num(P(-34, sol), '1,2 m', 0, 28),
  ], { pad: 40, padDuoi: 40 })
}

// ───── HLB00120: △ABC nhọn (AB<AC); x qua B ∥ AC, y qua C ∥ AB, x ∩ y = E ─────
{
  const A = P(0, 0), B = P(40, -170), C = P(280, -30), E = add(B, P(C.x - A.x, C.y - A.y))
  ok(dist(A, B) < dist(A, C), 'AB<AC'); ok(gan(goc(A, B, C), goc(A, B, C)) && goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(A, C, B) < 90, 'nhọn')
  const ex = 50, ux = (a, b) => ({ x: (b.x - a.x) / dist(a, b), y: (b.y - a.y) / dist(a, b) })
  const ux1 = ux(E, B), uy1 = ux(E, C)
  const Xe = P(B.x + ux1.x * ex, B.y + ux1.y * ex), Ye = P(C.x + uy1.x * ex, C.y + uy1.y * ex)
  ok(gan(ux1.x * (C.y - A.y) - ux1.y * (C.x - A.x), 0, 1e-6), 'x∥AC'); ok(gan(uy1.x * (B.y - A.y) - uy1.y * (B.x - A.x), 0, 1e-6), 'y∥AB')
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(Xe, E), seg(Ye, E)]
  const nhan = [...dots(A, B, C, E), label(A, 'A', -16, 20), label(B, 'B', 4, -14), label(C, 'C', 20, 14), label(E, 'E', 16, -10), label(Xe, 'x', -10, 4), label(Ye, 'y', -2, 22)]
  hinh('HLB00120', [A, B, C, E, Xe, Ye], [...nen, ...nhan])
  // ý b (HLY00300): M trung điểm BC. KHÔNG nối A–M–E.
  const M = mid(B, C)
  hinh('HLY00300', [A, B, C, E, Xe, Ye], [...nen, tick(B, M, 1), tick(M, C, 1), ...nhan, dot(M), label(M, 'M', -4, 26)])
}

await xuatTat(RA)
