// Vẽ lại hình — gói HH08000000-3 (Chưa phân dạng, Hình học 8: câu từ các đề thi giữa kì).
//   node scripts/anh/ve_lai/HH08000000-3.mjs [<thu_muc_ra>]
import { P, seg, segDash, poly, rightAngle, angleMark, sector, tick, dot, label, num, angleText, sideText, hinh, xuatTat,
  mid, foot, inter, add, vec, ray, lerp, doiXung, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-3/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.5, m + ` (${a} ≠ ${b})`)

// ── HHC002433_lg — D trung điểm AB, E trung điểm AC, F đối xứng D qua E (điểm phụ của lời giải).
//    Gạch: AD = DB (1), AE = EC (2), DE = EF (3). Nét: AB, BC, AC, DF, CF.
{
  const A = P(150, 320), B = P(30, 100), C = P(330, 40)
  const D = mid(A, B), E = mid(A, C), F = doiXung(D, E)
  gt(dist(A, D), dist(D, B), 'D trung điểm AB'); gt(dist(A, E), dist(E, C), 'E trung điểm AC')
  gt(dist(D, E), dist(E, F), 'E trung điểm DF')
  gt(dist(B, C), 2 * dist(D, E), 'BC = 2DE (hệ quả)')
  gt(dist(C, F), dist(D, B), 'CF = DB (hệ quả)')
  hinh('HHC002433_lg', [A, B, C, D, E, F], [
    seg(A, B), seg(B, C), seg(A, C), seg(D, F), seg(C, F),
    tick(A, D, 1), tick(D, B, 1), tick(A, E, 2), tick(E, C, 2), tick(D, E, 3), tick(E, F, 3),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', 0, 32), label(B, 'B', -18, -2), label(C, 'C', 6, -14), label(D, 'D', -20, 8),
    label(E, 'E', 20, 28), label(F, 'F', 22, 8),
  ])
}

// ── HHC002434_lg — tam giác ABC vuông tại A (A góc dưới-trái, B bên phải, C phía trên), AB < AC, H trung điểm BC,
//    HM ⊥ AB, HN ⊥ AC, AI ⊥ BC, O = AH ∩ MN. Nét liền: AB, BC, AC, NH, HM, AI, NI, MI; nét đứt: AH, MN.
//    Ảnh cũ chỉ có MỘT gạch lẻ trên MN (nửa OM) ⇒ hiểu là OA = OH = OM = ON (lời giải dùng): đánh đủ 4 nửa đường chéo.
{
  const A = P(0, 0), B = P(210, 0), C = P(0, -280)
  const H = mid(B, C)
  const M = foot(H, A, B), N = foot(H, A, C), I = foot(A, B, C)
  const O = inter(A, H, M, N)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  gt(goc(A, B, C), 90, 'A vuông'); gt(goc(M, A, H), 90, 'HM ⊥ AB'); gt(goc(N, A, H), 90, 'HN ⊥ AC')
  gt(goc(I, A, B), 90, 'AI ⊥ BC')
  gt(dist(O, A), dist(O, M), 'O tâm hình chữ nhật (hệ quả)')
  hinh('HHC002434_lg', [A, B, C, H, M, N, I, O], [
    seg(A, B), seg(B, C), seg(A, C), seg(N, H), seg(H, M), seg(A, I), seg(N, I), seg(M, I),
    segDash(A, H), segDash(M, N),
    tick(C, H, 1), tick(H, B, 1),
    tick(A, O, 1), tick(O, H, 1), tick(M, O, 1), tick(O, N, 1),
    rightAngle(A, B, C, 13), rightAngle(N, A, H, 13), rightAngle(M, A, H, 13), rightAngle(I, A, B, 13),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(I), dot(O),
    label(A, 'A', -18, 28), label(B, 'B', 4, 32), label(C, 'C', 0, -14), label(H, 'H', 20, -8),
    label(M, 'M', 4, 32), label(N, 'N', -20, 8), label(I, 'I', 22, 8), label(O, 'O', -17, 9),
  ])
}

// ── HHC002437 — hình thang cân ABCD (đáy AB dưới, đáy CD trên), ∠ADC = 120° (theo ĐỀ).
//    Ảnh cũ đánh dấu cung ở A (không ghi số) — vênh đề (đề cho góc D = 120°) ⇒ vẽ theo đề: cung + "120°" ở D, không đánh dấu ∠ABC.
{
  const A = P(0, 0), B = P(320, 0)
  const D = ray(A, 60, 170), C = ray(B, 120, 170)
  gt(goc(D, A, C), 120, '∠ADC = 120°')
  gt(goc(A, B, D), 60, '∠DAB = 60°'); gt(goc(B, A, C), 60, '∠ABC = 60° (hệ quả)')
  gt(dist(A, D), dist(B, C), 'hai cạnh bên bằng nhau')
  ok(Math.abs(D.y - C.y) < 0.01, 'CD ∥ AB')
  hinh('HHC002437', [A, B, C, D], [
    sector(D, A, C, 26), seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(D, A, C, 26),
    angleText(D, A, C, '120°', 66),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -18, 20), label(B, 'B', 18, 20), label(C, 'C', 16, -10), label(D, 'D', -16, -10),
  ])
}

// ── HHC002440_lg — hai hình con: hình thang cân (phản ví dụ không xảy ra) và hình bình hành (phản ví dụ của ý b),
//    cùng MN ∥ PQ, MQ = NP, ∠M = 80°. M trên-trái, N trên-phải, Q dưới-trái, P dưới-phải.
{
  const L = 135
  const sub = (ox, ten, kieu) => {
    const M = P(ox, 0), N = P(ox + 172, 0)
    const Q = ray(M, -80, L)
    const Pp = kieu === 'can' ? ray(N, -100, L) : ray(N, -80, L)
    gt(goc(M, N, Q), 80, '∠M = 80°')
    gt(dist(M, Q), dist(N, Pp), 'MQ = NP')
    ok(Math.abs(Q.y - Pp.y) < 0.01, 'PQ ∥ MN')
    if (kieu === 'can') gt(goc(N, M, Pp), 80, 'thang cân: ∠N = 80°')
    else gt(goc(N, M, Pp), 100, 'bình hành: ∠N = 100°')
    const cap = P((M.x + Pp.x + Q.x + N.x) / 4, L + 64)
    return {
      pts: [M, N, Q, Pp, P(cap.x - 62, cap.y), P(cap.x + 62, cap.y)],
      body: [
        seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M),
        tick(M, Q, 1), tick(N, Pp, 1),
        angleMark(M, N, Q, 34), angleText(M, N, Q, '80°', 70),
        dot(M), dot(N), dot(Pp), dot(Q),
        label(M, 'M', -14, -10), label(N, 'N', 16, -10), label(Q, 'Q', -14, 30), label(Pp, 'P', 16, 30),
        num(cap, ten),
      ],
    }
  }
  const a = sub(0, 'Hình thang cân', 'can'), b = sub(245, 'Hình bình hành', 'bh')
  hinh('HHC002440_lg', [...a.pts, ...b.pts], [...a.body, ...b.body])
}

// ── HHC002443_lg — hình bình hành ABCD, ∠BAD = 60°, AD = 2AB; M trung điểm BC, N trung điểm AD, K = DM ∩ AB.
//    Gạch: AN = ND, CM = MB (đôi). Nét: A–B–K (thẳng), AD, DC, CB, DB, DK, AM, NK. Không đánh dấu điểm đồng quy.
{
  const A = P(0, 0), B = P(165, 0)
  const D = ray(A, 60, 330)
  const C = add(D, vec(A, B))
  const M = mid(B, C), N = mid(A, D)
  const K = doiXung(D, M)
  gt(goc(A, B, D), 60, '∠BAD = 60°'); gt(dist(A, D), 2 * dist(A, B), 'AD = 2AB')
  ok(Math.abs(K.y - A.y) < 0.01, 'K ∈ AB'); gt(dist(B, K), dist(A, B), 'BK = AB (hệ quả)')
  gt(goc(B, A, D) + goc(A, D, B) + goc(D, B, A), 180, 'tam giác ABD')
  gt(goc(B, D, A), 90, 'DB ⊥ AB (hệ quả của AD = 2AB, ∠A = 60°)')
  const tuA = P(0, 0)
  hinh('HHC002443_lg', [A, B, C, D, K, M, N], [
    seg(A, K), seg(A, D), seg(D, C), seg(C, B), seg(D, B), seg(D, K), seg(A, M), seg(N, K),
    tick(A, N, 2), tick(N, D, 2), tick(C, M, 2), tick(M, B, 2, 0.72),
    angleMark(A, B, D, 32),
    num(ray(tuA, 14, 86), '60°', 0, 7),
    dot(A), dot(B), dot(C), dot(D), dot(K), dot(M), dot(N),
    label(A, 'A', -18, 26), label(B, 'B', 4, 32), label(C, 'C', 18, -10), label(D, 'D', 0, -14),
    label(K, 'K', 18, 28), label(M, 'M', 20, 6), label(N, 'N', -20, 8),
  ])
}

// ── HHC002452_lg — hình thang cân ABCD (đáy AB trên ngắn, CD dưới dài), AH ⊥ CD, BK ⊥ CD,
//    E đối xứng D qua H, I trung điểm EB. Gạch: DH = HE (1), AD = BC (3), EI = IB (2). Vuông: H, K. Không nối A–I–C.
{
  const D = P(0, 0), H = P(64, 0), K = P(340, 0), C = P(404, 0)
  const A = P(64, -240), B = P(340, -240)
  const E = doiXung(D, H)
  const I = mid(E, B)
  gt(dist(A, D), dist(B, C), 'hình thang cân'); gt(goc(H, A, D), 90, 'AH ⊥ CD'); gt(goc(K, B, C), 90, 'BK ⊥ CD')
  ok(dist(A, B) < dist(D, C), 'AB < CD')
  gt(goc(D, A, C), goc(C, B, D), 'hai góc kề đáy bằng nhau')
  gt(dist(A, B), dist(E, C), 'AB = EC (hệ quả)')
  hinh('HHC002452_lg', [A, B, C, D, E, H, K, I], [
    seg(A, B), seg(A, D), seg(B, C), seg(D, C), seg(A, H), seg(B, K), seg(E, B),
    tick(D, H, 1), tick(H, E, 1), tick(A, D, 3), tick(B, C, 3), tick(E, I, 2), tick(I, B, 2),
    rightAngle(H, A, E, 13), rightAngle(K, B, C, 13),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(K), dot(I),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(C, 'C', 20, 24), label(D, 'D', -16, 28),
    label(H, 'H', 0, 32), label(E, 'E', 4, 32), label(K, 'K', 0, 32), label(I, 'I', 22, 12),
  ])
}

// ── HHC002461 — sơ đồ diều: A = diều, B = tay, C = chân đường thẳng đứng hạ từ A xuống đường ngang qua B.
//    AB = 40 m (dây), BC = 24 m, tay cao 1,2 m so với mặt đất. Dựng đúng tỉ lệ (7,6 px/m): AC = 32 m.
//    Ảnh cũ là tranh bé cầm diều ⇒ chỉ giữ sơ đồ + số đo; không đặt tên A, B, C (đề không có).
{
  const s = 7.6
  const B = P(0, 0), C = P(24 * s, 0), A = P(24 * s, -32 * s)
  gt(dist(A, B), 40 * s, 'AB = 40 m')
  gt(goc(C, A, B), 90, 'vuông tại C')
  const g = 1.2 * s
  const top = P(A.x, A.y - 30)
  const kite = [A, P(A.x + 12, A.y - 15), top, P(A.x - 12, A.y - 15)]
  hinh('HHC002461', [B, C, A, top, P(A.x, top.y - 24), P(-100, g), P(A.x + 24, g + 26)], [
    poly(kite), seg(top, A), seg(kite[1], kite[3]),
    seg(A, B), segDash(B, C), segDash(C, A),
    rightAngle(C, A, B, 14),
    seg(P(-100, g), P(A.x + 24, g)),
    seg(P(-2, 0), P(-38, 0)), seg(P(-30, 0), P(-30, g)),
    dot(B),
    num(P(A.x, top.y - 9), 'Diều'),
    num(P(-18, -9), 'Tay'),
    sideText(A, B, '40 m', C, 38),
    num(P(C.x / 2, -14), '24 m'),
    num(P(-30, g + 28), '1,2 m'),
  ], { pad: 30, padDuoi: 34 })
}

// ── HHC002462_lg — tam giác ABC nhọn, AB < AC; x qua B ∥ AC, y qua C ∥ AB, x ∩ y = E; M trung điểm BC (gạch BM = MC).
//    Nét: AB, AC, BC, đường thẳng x (qua B, E) và y (qua C, E) kéo dài hai phía, nhãn x, y ở đầu dưới. Không nối A–M–E.
{
  const B = P(0, 0), C = P(202, 0), A = P(71, -134)
  const E = add(B, vec(A, C))                      // BE ∥ AC, CE ∥ AB
  const M = mid(B, C)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, 'tam giác nhọn')
  ok(Math.abs((E.x - B.x) * (C.y - A.y) - (E.y - B.y) * (C.x - A.x)) < 1e-6, 'x ∥ AC')
  ok(Math.abs((E.x - C.x) * (B.y - A.y) - (E.y - C.y) * (B.x - A.x)) < 1e-6, 'y ∥ AB')
  gt(dist(A, M), dist(M, E), 'M trung điểm AE (hệ quả)')
  const x0 = lerp(B, E, -0.2), x1 = lerp(B, E, 1.18)
  const y0 = lerp(C, E, -0.2), y1 = lerp(C, E, 1.18)
  hinh('HHC002462_lg', [A, B, C, E, x0, x1, y0, y1, P(x1.x + 20, x1.y + 14), P(y1.x - 20, y1.y + 14)], [
    seg(A, B), seg(A, C), seg(B, C), seg(x0, x1), seg(y0, y1),
    tick(B, M, 1), tick(M, C, 1),
    dot(A), dot(B), dot(C), dot(E), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -20, 6), label(C, 'C', 20, 6), label(M, 'M', 0, -14), label(E, 'E', 22, 0),
    label(x1, 'x', 16, 12), label(y1, 'y', -14, 12),
  ], { padDuoi: 44 })
}

await xuatTat(RA)
