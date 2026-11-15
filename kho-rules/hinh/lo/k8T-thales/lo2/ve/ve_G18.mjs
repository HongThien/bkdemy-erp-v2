// ve_G18.mjs — hình VHB2 §13 BT 188–197 (chạy từ thư mục h8t2): node ve_G18.mjs
import { P, seg, segDash, tick, rightAngle, angleMark, dot, label, num, mid, lerp, inter, foot, doiXung, hinh, xuatTat, add, vec } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = new URL('./hinh_G18', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const pts = (arr) => arr.map((q) => dot(q)).join('')
const nhan = (arr) => arr.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')

// ───────── 188: tam giác ABC vuông tại A (AB đứng, AC ngang); D, F ra ngoài; H = AB∩CD, K = AC∩BF
{
  const c = 120, b = 170, A = P(0, 0), B = P(0, -c), C = P(b, 0), D = P(-c, -c), F = P(b, b)
  const H = inter(A, B, C, D), K = inter(A, C, B, F)
  const all = [A, B, C, D, F, H, K]
  hinh('VHB2-188', all, [seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(A, D), seg(C, F), seg(A, F), seg(C, D), seg(B, F),
    rightAngle(A, B, C, 14), rightAngle(B, A, D, 14), rightAngle(C, A, F, 14), tick(A, B, 1, 0.85), tick(B, D, 1, 0.5), tick(A, C, 2, 0.8), tick(C, F, 2, 0.5),
    pts(all), nhan([[A, 'A', -14, 26], [B, 'B', 14, -12], [C, 'C', 20, -8], [D, 'D', -6, -14], [F, 'F', 6, 30], [H, 'H', -16, 8], [K, 'K', 4, -12]])])
}

// ───────── 189: ABCD hình bình hành (dữ kiện buộc), M, N trung điểm CD, CB; E, F chia BD thành ba phần
{
  const A = P(80, 40), B = P(330, 70), D = P(0, 230), C = add(B, vec(A, D))
  const M = mid(C, D), N = mid(C, B), E = lerp(D, B, 1 / 3), F = lerp(D, B, 2 / 3)
  const all = [A, B, C, D, M, N, E, F]
  hinh('VHB2-189', all, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(A, M), seg(A, N),
    tick(C, M, 1), tick(M, D, 1), tick(C, N, 2), tick(N, B, 2), tick(D, E, 3), tick(E, F, 3), tick(F, B, 3),
    pts(all), nhan([[A, 'A', -4, -14], [B, 'B', 14, -8], [C, 'C', 10, 30], [D, 'D', -10, 26], [M, 'M', 0, 32], [N, 'N', 20, 12], [E, 'E', -6, -14], [F, 'F', 16, 10]])])
}

// ───────── 190: hình vuông cạnh 6, BE = 2, CF = 3; M = AE ∩ BF  (u = 32 px / đơn vị)
{
  const u = 32, A = P(20, 20), B = P(20 + 6 * u, 20), C = P(20 + 6 * u, 20 + 6 * u), D = P(20, 20 + 6 * u)
  const E = P(B.x, B.y + 2 * u), F = P(C.x + 3 * u, C.y), M = inter(A, E, B, F)
  const all = [A, B, C, D, E, F, M]
  hinh('VHB2-190', all, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(C, F), seg(A, M), seg(B, F), seg(C, M),
    rightAngle(D, A, C, 14), pts(all), num(mid(A, B), '6', 0, -12), num(P(B.x - 16, mid(B, E).y), '2', 0, 8), num(mid(C, F), '3', 0, 28),
    nhan([[A, 'A', -4, -14], [B, 'B', 4, -14], [C, 'C', -14, 28], [D, 'D', -6, 30], [E, 'E', -16, 6], [F, 'F', 8, 30], [M, 'M', 20, -6]])])
  // hình lời giải: thêm G = AE ∩ DC (CG = 12), H trên tia đối của tia BA với BH = 2, đoạn CH
  const G = P(C.x + 6 * u, C.y), H = P(B.x + 2 * u, B.y)
  const all2 = [A, B, C, D, E, F, M, G, H]
  hinh('VHB2-190_lg', all2, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(C, G), seg(A, G), seg(B, F), seg(B, H), seg(C, H), seg(C, M),
    pts(all2), nhan([[A, 'A', -4, -14], [B, 'B', -12, -14], [C, 'C', -14, 28], [D, 'D', -6, 30], [E, 'E', -16, 6], [F, 'F', 2, 30], [G, 'G', 8, 30], [M, 'M', 20, -6], [H, 'H', 6, -14]])])
}

// ───────── 192: AD phân giác, AM trung tuyến, I ∈ AD, IH ⊥ AB, IK ⊥ AC, N = HK ∩ AM
function dung192() {
  const A = P(60, 20), B = P(20, 320), C = P(420, 320)
  const ab = Math.hypot(A.x - B.x, A.y - B.y), ac = Math.hypot(A.x - C.x, A.y - C.y)
  const D = lerp(B, C, ab / (ab + ac)), M = mid(B, C), I = lerp(A, D, 0.66)
  const H = foot(I, A, B), K = foot(I, A, C), N = inter(H, K, A, M)
  return { A, B, C, D, M, I, H, K, N }
}
{
  const { A, B, C, D, M, I, H, K, N } = dung192()
  const all = [A, B, C, D, M, I, H, K, N]
  hinh('VHB2-192', all, [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(A, M), seg(I, H), seg(I, K), seg(H, K),
    angleMark(A, B, D, 38), angleMark(A, D, C, 52), rightAngle(H, A, I, 12), rightAngle(K, A, I, 12), tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    pts(all), nhan([[A, 'A', 0, -14], [B, 'B', -12, 26], [C, 'C', 12, 26], [D, 'D', -6, 32], [M, 'M', 14, 32], [I, 'I', -16, 4], [H, 'H', -16, 8], [K, 'K', 18, 2], [N, 'N', 16, 22]])])
  // lời giải: EF ∥ BC qua N (E ∈ AB, F ∈ AC), EG ∥ HK (G ∈ AC)
  const v = P(C.x - B.x, C.y - B.y), E = inter(N, P(N.x + v.x, N.y + v.y), A, B), F = inter(N, P(N.x + v.x, N.y + v.y), A, C)
  const G = inter(E, P(E.x + (K.x - H.x), E.y + (K.y - H.y)), A, C)
  const all2 = [...all, E, F, G]
  hinh('VHB2-192_lg', all2, [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(A, M), seg(I, H), seg(I, K), seg(H, K), seg(E, F), seg(E, G), seg(I, E), seg(I, F), seg(I, N),
    rightAngle(H, A, I, 12), rightAngle(K, A, I, 12), pts(all2),
    nhan([[A, 'A', 0, -14], [B, 'B', -12, 26], [C, 'C', 12, 26], [D, 'D', -6, 32], [M, 'M', 14, 32], [I, 'I', 0, 30], [H, 'H', -16, 10], [K, 'K', 20, 12], [N, 'N', 18, -4], [E, 'E', -16, -2], [F, 'F', 18, -6], [G, 'G', 18, -14]])])
}

// ───────── 193: tam giác nhọn ABC, trực tâm H, PQ qua H với HP = HQ, M trung điểm BC
function dung193() {
  const A = P(120, 14), B = P(14, 210), C = P(280, 210)
  const HA = foot(A, B, C), HB = foot(B, A, C), HC = foot(C, A, B)
  const H = inter(A, HA, B, HB), M = mid(B, C)
  const A2 = doiXung(A, H), B2 = doiXung(B, H)
  const Q = inter(A2, B2, A, C), Pp = doiXung(Q, H)
  return { A, B, C, H, M, HA, HB, HC, P: Pp, Q }
}
{
  const { A, B, C, H, M, HA, HB, HC, P: Pp, Q } = dung193()
  const all = [A, B, C, H, M, Pp, Q]
  hinh('VHB2-193', all, [seg(A, B), seg(B, C), seg(C, A), seg(A, HA), seg(B, HB), seg(C, HC), seg(Pp, Q), seg(H, M),
    tick(H, Pp, 1, 0.5), tick(H, Q, 1, 0.5), tick(B, M, 2, 0.5), tick(M, C, 2, 0.5),
    pts(all), nhan([[A, 'A', 0, -14], [B, 'B', -12, 24], [C, 'C', 14, 24], [H, 'H', 12, -10], [M, 'M', 0, 32], [Pp, 'P', -16, 6], [Q, 'Q', 18, 0]])])
  // lời giải: đường thẳng qua C song song PQ cắt AB ở N, cắt AH ở K
  const w = P(Q.x - Pp.x, Q.y - Pp.y), C2 = P(C.x + w.x, C.y + w.y)
  const N = inter(C, C2, A, B), K = inter(C, C2, A, HA)
  const all2 = [...all, N, K, HA]
  hinh('VHB2-193_lg', all2, [seg(A, B), seg(B, C), seg(C, A), seg(A, K), seg(B, HB), seg(C, HC), seg(Pp, Q), seg(N, C), seg(K, M), seg(N, B), seg(H, M),
    pts([A, B, C, H, M, Pp, Q, N, K]),
    nhan([[A, 'A', 0, -14], [B, 'B', -16, -4], [C, 'C', 16, -8], [H, 'H', 14, -8], [M, 'M', 14, -10], [Pp, 'P', -16, 6], [Q, 'Q', 18, 0], [N, 'N', -14, 12], [K, 'K', 16, 14]])])
}

// ───────── 194: hình chữ nhật ABCD, M, N trung điểm AD, BC; E ∈ tia đối của tia DC; K = EM ∩ AC  (đề s=1; lời giải thu nhỏ s=0.5 vì H ở xa)
function h194(ten, s, lg) {
  const A = P(40, 40), B = P(40 + 300 * s, 40), C = P(40 + 300 * s, 40 + 160 * s), D = P(40, 40 + 160 * s)
  const M = mid(A, D), N = mid(B, C), E = P(40 - 110 * s, D.y), K = inter(E, M, A, C)
  const ang = [rightAngle(A, B, D, 12), rightAngle(B, A, C, 12), rightAngle(C, B, D, 12), rightAngle(D, A, C, 12)]
  if (!lg) {
    const all = [A, B, C, D, M, N, E, K]
    hinh(ten, all, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, N), seg(E, C), seg(E, K), seg(A, C), seg(N, K), seg(N, E), ...ang,
      tick(A, M, 1, 0.5), tick(M, D, 1, 0.5), tick(B, N, 2, 0.5), tick(N, C, 2, 0.5), pts(all),
      nhan([[A, 'A', -16, -8], [B, 'B', 14, -8], [C, 'C', 14, 26], [D, 'D', 8, 30], [M, 'M', -16, 6], [N, 'N', 18, 6], [E, 'E', -6, 30], [K, 'K', 14, -8]])])
  } else {
    const I = inter(M, N, A, C), H = inter(K, N, D, C), all = [A, B, C, D, M, N, E, K, I, H]
    hinh(ten, all, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, N), seg(E, H), seg(E, K), seg(A, C), seg(K, H), seg(N, E), ...ang,
      tick(M, I, 1, 0.5), tick(I, N, 1, 0.5), pts(all),
      nhan([[A, 'A', -16, -8], [B, 'B', 14, -8], [C, 'C', -8, 30], [D, 'D', 10, 30], [M, 'M', -16, 6], [N, 'N', 20, -6], [E, 'E', -6, 30], [K, 'K', 14, -8], [I, 'I', 0, 28], [H, 'H', 6, 30]])])
  }
}
h194('VHB2-194', 1, false)
h194('VHB2-194_lg', 0.5, true)

// ───────── 195: hình bình hành ABCD, M ∈ BC, N ∈ tia đối của tia BC, BN = CM; DN, DM cắt AB ở E, F
{
  const D = P(40, 240), C = P(260, 240), A = P(100, 50), B = add(C, vec(D, A))
  const M = lerp(B, C, 0.45), N = lerp(B, C, -0.55)
  const E = inter(D, N, A, B), F = inter(D, M, A, B)
  const all = [A, B, C, D, M, N, E, F]
  const corpo = [seg(A, B), seg(B, F), seg(C, D), seg(D, A), seg(C, N), seg(D, N), seg(D, F), tick(B, N, 1, 0.5), tick(C, M, 1, 0.5), pts(all)]
  const lab = [[A, 'A', -14, -6], [B, 'B', 12, -12], [C, 'C', 6, 30], [D, 'D', -8, 30], [M, 'M', 20, 8], [N, 'N', 6, -12], [E, 'E', -2, 26], [F, 'F', 8, -12]]
  hinh('VHB2-195', all, [...corpo, nhan(lab)])
  hinh('VHB2-195_lg', all, [...corpo, seg(A, N), nhan(lab)])
}

// ───────── 196: hình bình hành ABCD, đường thẳng qua A cắt BD, BC, DC ở E, K, G
{
  const A = P(70, 30), B = P(280, 30), D = P(30, 190), C = P(240, 190)
  const K = lerp(B, C, 0.6), G = inter(A, K, D, C), E = inter(A, K, B, D)
  const all = [A, B, C, D, E, K, G]
  hinh('VHB2-196', all, [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(C, G), seg(A, G), pts(all),
    nhan([[A, 'A', -8, -14], [B, 'B', 12, -10], [C, 'C', -6, 30], [D, 'D', -8, 28], [E, 'E', -2, 28], [K, 'K', 18, 8], [G, 'G', 6, 30]])])
}

// ───────── 197: tam giác đều ABC, AD = CE, M ∈ BC, MH ∥ CD, MK ∥ BE
{
  const B = P(30, 290), C = P(330, 290), A = P(180, 290 - 300 * Math.sqrt(3) / 2)
  const D = lerp(A, B, 0.35), E = lerp(C, A, 0.35), M = lerp(B, C, 0.4)
  const H = inter(M, P(M.x + D.x - C.x, M.y + D.y - C.y), A, B), K = inter(M, P(M.x + E.x - B.x, M.y + E.y - B.y), A, C)
  const all = [A, B, C, D, E, M, H, K]
  hinh('VHB2-197', all, [seg(A, B), seg(B, C), seg(C, A), seg(C, D), seg(B, E), seg(M, H), seg(M, K),
    tick(A, B, 3, 0.72), tick(B, C, 3, 0.5), tick(C, A, 3, 0.72), tick(A, D, 1, 0.5), tick(C, E, 1, 0.5), pts(all),
    nhan([[A, 'A', 0, -14], [B, 'B', -12, 24], [C, 'C', 14, 24], [D, 'D', -16, 2], [E, 'E', 18, 0], [M, 'M', 0, 32], [H, 'H', -18, 8], [K, 'K', 20, 4]])])
}

await xuatTat(OUT)
console.log('Đã vẽ vào', OUT)
