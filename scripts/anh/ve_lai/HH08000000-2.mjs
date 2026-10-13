// Vẽ lại hình — gói HH08000000-2 (Hình học 8, câu lấy từ các đề giữa kì; phần lớn là hình LỜI GIẢI _lg).
//   node scripts/anh/ve_lai/HH08000000-2.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, tick, dot, label, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, doiXung, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-2/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const g90 = (v, p, q, m) => ok(Math.abs(goc(v, p, q) - 90) < 0.01, m)

// ── HHC002401_lg — ABC vuông tại A (AB < AC; A góc dưới-trái, C phía trên, B bên phải), M trung điểm BC,
//    MN ⊥ AC, MP ⊥ AB; Q đối xứng M qua N, K đối xứng M qua P. Nét phụ: AM, NP (đứt).
//    Gạch: BM = MC (3), QN = NM (1), MP = PK (2). Vuông: A, N, P.
{
  const A = P(0, 0), B = P(140, 0), C = P(0, -210)
  const M = mid(B, C)
  const N = foot(M, A, C), Pp = foot(M, A, B)
  const Q = doiXung(M, N), K = doiXung(M, Pp)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  g90(N, M, A, 'MN ⊥ AC'); g90(Pp, M, A, 'MP ⊥ AB')
  gt(dist(N, Q), dist(N, M), 'N trung điểm MQ'); gt(dist(Pp, K), dist(Pp, M), 'P trung điểm MK')
  gt(Q.y, N.y, 'Q cùng đường MN'); gt(K.x, Pp.x, 'K cùng đường MP')
  hinh('HHC002401_lg', [A, B, C, M, N, Pp, Q, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(Q, M), seg(M, K), segDash(N, Pp),
    tick(M, C, 3, 0.5), tick(M, B, 3, 0.5), tick(Q, N, 1, 0.5), tick(N, M, 1, 0.5), tick(M, Pp, 2, 0.5), tick(Pp, K, 2, 0.5),
    rightAngle(A, B, C, 14), rightAngle(N, M, A, 14), rightAngle(Pp, A, M, 14),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(Pp), dot(Q), dot(K),
    label(A, 'A', -20, 26), label(B, 'B', 14, 26), label(C, 'C', 0, -14), label(M, 'M', 22, -8), label(N, 'N', -20, -10),
    label(Pp, 'P', -18, 28), label(Q, 'Q', -4, -14), label(K, 'K', 0, 36),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC002404_lg — ABC vuông cân tại A (A trên-trái, C bên phải, B phía dưới), M ∈ BC (giữa B và H), MN ⊥ AB, MP ⊥ AC.
//    Nét phụ: AM, NP (hai đường chéo), AH ⊥ BC (đứt). Vuông: A, N, P, H.
{
  const L = 270
  const A = P(0, 0), C = P(L, 0), B = P(0, L)
  const H = foot(A, B, C)
  const M = lerp(B, C, 0.35)
  const N = foot(M, A, B), Pp = foot(M, A, C)
  gt(dist(A, B), dist(A, C), 'cân tại A')
  g90(N, M, A, 'MN ⊥ AB'); g90(Pp, M, A, 'MP ⊥ AC'); g90(H, A, B, 'AH ⊥ BC')
  ok(dist(B, M) < dist(B, H), 'M nằm giữa B và H')
  hinh('HHC002404_lg', [A, B, C, H, M, N, Pp], [
    seg(A, B), seg(A, C), seg(B, C), seg(M, N), seg(M, Pp), seg(A, M), seg(N, Pp), segDash(A, H),
    rightAngle(A, C, B, 14), rightAngle(N, A, M, 14), rightAngle(Pp, A, M, 14), rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(Pp),
    label(A, 'A', -20, -10), label(C, 'C', 20, -10), label(B, 'B', -6, 36), label(H, 'H', 26, 24),
    label(M, 'M', 24, 24), label(N, 'N', -20, 10), label(Pp, 'P', 0, -14),
  ])
}

// ── HHC002410_lg — hình bình hành ABCD (A, B trên; D, C dưới), E trung điểm AB, F trung điểm CD; nét AF, EC.
//    Gạch: AE = EB (1), DF = FC (2).
{
  const A = P(80, 0), B = P(376, 0), D = P(0, 208)
  const C = add(D, vec(A, B))
  const E = mid(A, B), F = mid(D, C)
  gt(dist(A, B), dist(D, C), 'AB = DC'); gt(dist(A, D), dist(B, C), 'AD = BC')
  hinh('HHC002410_lg', [A, B, C, D, E, F], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, F), seg(E, C),
    tick(A, E, 1, 0.5), tick(E, B, 1, 0.5), tick(D, F, 2, 0.5), tick(F, C, 2, 0.5),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', 0, -14), label(E, 'E', 0, -14), label(B, 'B', 20, -10),
    label(D, 'D', -18, 34), label(F, 'F', -6, 38), label(C, 'C', 8, 38),
  ])
}

// ── HHC002419_lg — ABC cân tại A, AH ⊥ BC (C trái, H, K, B phải), I trung điểm AB, M đối xứng H qua I (AHBM chữ nhật),
//    K trung điểm HB, E trung điểm AH. Nét: AC, CB, AH, AB, HM, AM, MB.
//    Gạch: AB = AC (1: ở AC và gần A trên AB), AI = IB (2), HI = IM (3), AE = EH (5), HK = KB (4). Vuông: H.
{
  const H = P(0, 0), C = P(-165, 0), B = P(165, 0), A = P(0, -215)
  const I = mid(A, B), M = doiXung(H, I), K = mid(H, B), E = mid(A, H)
  gt(dist(A, B), dist(A, C), 'cân tại A'); g90(H, A, B, 'AH ⊥ BC')
  gt(I.x, mid(A, B).x, 'I trung điểm AB'); gt(I.x, mid(H, M).x, 'I trung điểm HM')
  gt(dist(A, M), dist(H, B), 'AM = HB (hệ quả)')
  hinh('HHC002419_lg', [A, B, C, H, I, M, K, E], [
    seg(A, C), seg(C, B), seg(A, H), seg(A, B), seg(H, M), seg(A, M), seg(M, B),
    tick(A, C, 1, 0.5), tick(A, B, 1, 0.1),
    tick(A, I, 2, 0.5), tick(I, B, 2, 0.5), tick(H, I, 3, 0.5), tick(I, M, 3, 0.5),
    tick(A, E, 5, 0.5), tick(E, H, 5, 0.5), tick(H, K, 4, 0.5), tick(K, B, 4, 0.5),
    rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(I), dot(M), dot(K), dot(E),
    label(A, 'A', -2, -14), label(M, 'M', 6, -14), label(C, 'C', -4, 38), label(H, 'H', 0, 38),
    label(K, 'K', 0, 38), label(B, 'B', 8, 38), label(E, 'E', -20, 8), label(I, 'I', 20, 8),
  ])
}

// ── HHC002423 — hình chữ nhật ABCD (A, B trên; D, C dưới) có AB = 2BC; I = AC ∩ BD; E, F trung điểm AB, CD.
//    Nét: cạnh, AC, BD, AF, DE, EC, EF. Gạch: AE = EB (1), DF = FC (2). Vuông: A, B, D (như ảnh cũ).
{
  const A = P(0, 0), B = P(340, 0), D = P(0, 170), C = P(340, 170)
  const E = mid(A, B), F = mid(D, C), I = inter(A, C, B, D)
  gt(dist(A, B), 2 * dist(B, C), 'AB = 2BC'); g90(A, B, D, 'A vuông'); g90(B, A, C, 'B vuông')
  hinh('HHC002423', [A, B, C, D, E, F, I], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, F), seg(D, E), seg(E, C), seg(E, F),
    tick(A, E, 2, 0.5), tick(E, B, 2, 0.5), tick(D, F, 2, 0.5), tick(F, C, 2, 0.5),
    rightAngle(A, B, D, 14), rightAngle(B, A, C, 14), rightAngle(D, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(A, 'A', -14, -10), label(E, 'E', 0, -14), label(B, 'B', 14, -10),
    label(D, 'D', -16, 34), label(F, 'F', 0, 40), label(C, 'C', 16, 34), label(I, 'I', 18, 28),
  ])
}

// ── HHC002424_lg — ABC vuông tại A (AB < AC; A dưới-trái, C phía trên, B bên phải), AH ⊥ BC, HM ⊥ AB, HN ⊥ AC,
//    E trung điểm HC, I đối xứng A qua E, F = MN ∩ AH, G = CF ∩ AI. Nét: AB, AC, CB, AI, CI, MI (qua H), NH, AH, MN, CF.
//    Gạch: CE = EH (1), AE = EI (2). Vuông: A, M, N, và AH ⊥ BC tại H.
{
  const k = 0.45
  const A = P(0, 0), B = P(368 * k, 0), C = P(0, -460 * k)
  const H = foot(A, B, C)
  const M = foot(H, A, B), N = foot(H, A, C)
  const E = mid(H, C), I = doiXung(A, E)
  const F = inter(A, H, M, N), G = inter(C, F, A, I)
  ok(dist(A, B) < dist(A, C), 'AB < AC'); g90(H, A, B, 'AH ⊥ BC')
  g90(M, A, H, 'HM ⊥ AB'); g90(N, A, H, 'HN ⊥ AC')
  gt(F.x, mid(A, H).x, 'F trung điểm AH')
  gt(dist(A, G), dist(A, I) / 3, 'AG = AI/3 (hệ quả)')
  gt(I.x, M.x, 'M, H, I thẳng hàng (hệ quả)')
  hinh('HHC002424_lg', [A, B, C, H, M, N, E, I, F, G], [
    seg(A, B), seg(A, C), seg(C, B), seg(A, I), seg(C, I), seg(M, I), seg(N, H), seg(A, H), seg(M, N), seg(C, F),
    tick(C, E, 1, 0.5), tick(E, H, 1, 0.5), tick(A, E, 2, 0.84), tick(E, I, 2, 0.5),
    rightAngle(A, B, C, 14), rightAngle(M, A, H, 14), rightAngle(N, A, H, 14), rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(E), dot(I), dot(F), dot(G),
    label(A, 'A', -18, 26), label(B, 'B', 6, 36), label(C, 'C', -20, -6), label(H, 'H', 22, 16), label(M, 'M', 2, 38),
    label(N, 'N', -20, 4), label(E, 'E', 22, 10), label(I, 'I', 20, -4), label(F, 'F', -22, 8), label(G, 'G', -20, 6),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC002432_lg — ABC cân tại A, AH ⊥ BC (B trái, H, K, C phải), I trung điểm AC, M đối xứng H qua I (AHCM chữ nhật),
//    K trung điểm HC, E trung điểm AH. Nét: AB, BC, AH, AC, AM, MC, HM, IK.
//    Gạch: AI = IC (1), HI = IM (2), HK = KC (3), AE = EH (4). Vuông: H.
{
  const H = P(0, 0), B = P(-150, 0), C = P(150, 0), A = P(0, -220)
  const I = mid(A, C), M = doiXung(H, I), K = mid(H, C), E = mid(A, H)
  gt(dist(A, B), dist(A, C), 'cân tại A'); g90(H, A, C, 'AH ⊥ BC')
  gt(M.x, C.x, 'M ngay trên C (hệ quả)')
  g90(K, I, H, 'IK ⊥ HC (hệ quả)')
  hinh('HHC002432_lg', [A, B, C, H, I, M, K, E], [
    seg(A, B), seg(B, C), seg(A, H), seg(A, C), seg(A, M), seg(M, C), seg(H, M), seg(I, K),
    tick(A, I, 1, 0.5), tick(I, C, 1, 0.5), tick(H, I, 2, 0.5), tick(I, M, 2, 0.5),
    tick(H, K, 3, 0.5), tick(K, C, 3, 0.5), tick(A, E, 4, 0.5), tick(E, H, 4, 0.5),
    rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(I), dot(M), dot(K), dot(E),
    label(A, 'A', -2, -14), label(M, 'M', 6, -14), label(B, 'B', -4, 38), label(H, 'H', 0, 38),
    label(K, 'K', 0, 38), label(C, 'C', 8, 38), label(E, 'E', -20, 8), label(I, 'I', 20, 8),
  ])
}

// ── HHC002433_de — sơ đồ chướng ngại: tam giác ABC (B trên-trái, C trên-phải, A phía dưới), BC đứt đoạn băng qua chỗ vật cản (vệt nước);
//    D trung điểm AB, E trung điểm AC; đo DE. Gạch: AD = DB (1), AE = EC (2).
{
  const B = P(0, 40), C = P(270, 0), A = P(70, 260)
  const D = mid(A, B), E = mid(A, C)
  const O = lerp(B, C, 0.5), cx = O.x, cy = O.y + 14
  // vệt nước: đường cong kín trơn qua các điểm
  const ring = [P(-58, -4), P(-34, -26), P(6, -30), P(44, -18), P(62, 6), P(48, 30), P(8, 36), P(-30, 30)]
    .map((p) => P(cx + p.x, cy + p.y))
  const m = (a, b) => `${((a.x + b.x) / 2).toFixed(2)} ${((a.y + b.y) / 2).toFixed(2)}`
  let d = `M ${m(ring[ring.length - 1], ring[0])}`
  for (let i = 0; i < ring.length; i++) d += ` Q ${ring[i].x.toFixed(2)} ${ring[i].y.toFixed(2)} ${m(ring[i], ring[(i + 1) % ring.length])}`
  const ao = `<path d="${d} Z" fill="#fff"/>`
  hinh('HHC002433_de', [A, B, C, D, E, ...ring], [
    segDash(B, C), ao, seg(A, B), seg(A, C), seg(D, E),
    tick(A, D, 1, 0.5), tick(D, B, 1, 0.5), tick(A, E, 2, 0.5), tick(E, C, 2, 0.5),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    label(B, 'B', -20, 4), label(C, 'C', 18, 0), label(A, 'A', 0, 40), label(D, 'D', -20, 8), label(E, 'E', 20, 4),
  ])
}

await xuatTat(RA)
