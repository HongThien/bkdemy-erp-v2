// Vẽ lại hình — gói HH00140-12 (Ôn thi giữa kì I, Hình học 9). Thùy 13/10.
//   node scripts/anh/ve_lai/HH00140-12.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, ray, rot, mid, lerp, foot, inter, bisector, goc, dist, dot,
  label, num, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-12/moi'
const RAD = Math.PI / 180
const ok = (v, mong, tenGoc, dung = 0.5) => console.assert(Math.abs(v - mong) < dung, `${tenGoc}: ${v} ≠ ${mong}`)

// HHC003183 — cây: AB = cây (thẳng đứng), AC = bóng 5 m, góc ABC = 50° (tia nắng BC hợp phương thẳng đứng BA)
{
  const A = P(0, 0), C = P(300, 0), B = P(0, -300 / Math.tan(50 * RAD))
  ok(goc(B, A, C), 50, 'ABC')
  hinh('HHC003183', [A, B, C, P(-60, 0)], [seg(A, B), seg(B, C), seg(A, C), dot(A), dot(B), dot(C),
    angleText(B, A, C, '50°', 82),
    label(A, 'A', -16, 28), label(B, 'B', 0, -14), label(C, 'C', 16, 28), num(A, 'Cây', -34, -110)])
}

// HHC003184 — tàu ngầm: A trên mặt nước, B trên mặt nước, C sâu 220 m dưới B (vuông tại B), góc A = 23°
{
  const A = P(0, 0), BC = 130, B = P(BC / Math.tan(23 * RAD), 0), C = P(B.x, BC)
  ok(goc(A, B, C), 23, 'A')
  hinh('HHC003184', [A, B, C, P(B.x + 90, 60), P(A.x - 10, -20)], [seg(A, B), seg(A, C), seg(B, C), rightAngle(B, A, C),
    angleText(A, B, C, '23°', 108),
    label(A, 'A', -18, 26), label(B, 'B', 18, -10), label(C, 'C', 16, 26),
    num(P(B.x, BC / 2), '220 m', 52, 8), num(A, 'Tàu ngầm', 36, -16)])
}

// HHC003185_lg — ABC vuông tại A (AB < AC), AH ⊥ BC, D: BD ⊥ BC, D ∈ CA; M trung điểm BC; BE ⊥ AM; F = BE ∩ AC
{
  const B = P(0, 0), C = P(360, 0), gocC = 37                      // C < 45° ⇒ AB < AC
  const A = ray(B, 90 - gocC, 360 * Math.cos((90 - gocC) * RAD))
  ok(goc(A, B, C), 90, 'BAC')
  const D = inter(B, P(0, -100), C, A), H = foot(A, B, C), M = mid(B, C), E = foot(B, A, M), F = inter(B, E, A, C)
  ok(goc(E, B, M), 90, 'BEM'); ok(goc(B, D, C), 90, 'DBC')
  console.assert(dist(A, B) < dist(A, C), 'AB<AC')
  console.assert(F.x > A.x && F.x < C.x, 'F giữa A, C')
  hinh('HHC003185_lg', [B, C, D, A, H, M, E, F], [
    seg(B, D), seg(D, C), seg(B, C), seg(B, A), seg(A, H), seg(A, M), seg(B, F),
    rightAngle(B, D, C), rightAngle(A, B, C), rightAngle(H, A, C), rightAngle(E, B, M),
    tick(B, M, 1), tick(M, C, 1),
    dot(B), dot(C), dot(D), dot(A), dot(H), dot(M), dot(E), dot(F),
    label(D, 'D', -26, 8), label(A, 'A', 22, -12), label(B, 'B', -16, 32), label(C, 'C', 16, 34),
    label(H, 'H', -4, 34), label(M, 'M', 16, 34), label(E, 'E', 20, -12), label(F, 'F', 22, -12)])
}

// HHC003186_lg — ABC vuông tại A, AB = 4, AC = 4√3; AH ⊥ BC; HD ⊥ AB, HE ⊥ AC; M ∈ (EC); AI ⊥ BM
{
  const A = P(0, 0), AB = 230, B = P(0, -AB), C = P(AB * Math.sqrt(3), 0)
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C), M = lerp(A, C, 0.63), I = foot(A, B, M)
  ok(goc(A, B, C), 90, 'BAC'); ok(goc(H, A, B), 90, 'AHB'); ok(goc(I, A, B), 90, 'AIB')
  ok(goc(B, A, C), 60, 'B', 0.5)
  console.assert(E.x < M.x && M.x < C.x, 'M giữa E, C')
  hinh('HHC003186_lg', [A, B, C, H, D, E, M, I], [
    seg(B, A), seg(A, C), seg(B, C), seg(A, H), seg(D, H), seg(H, E), seg(A, I), seg(B, M),
    rightAngle(A, B, C), rightAngle(D, A, H), rightAngle(E, A, H), rightAngle(H, A, B), rightAngle(I, A, B),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M), dot(I),
    label(B, 'B', -8, -16), label(D, 'D', -26, 8), label(H, 'H', 20, -14), label(I, 'I', 34, 10),
    label(A, 'A', -18, 30), label(E, 'E', 0, 36), label(M, 'M', 0, 36), label(C, 'C', 24, 30)])
}

// HHC003187 — toà nhà: A trên mặt đất, H chân toà nhà (AH = 36 m), B đỉnh; góc BAH = 55°; vuông tại H
{
  const A = P(0, 0), H = P(210, 0), B = P(210, -210 * Math.tan(55 * RAD))
  ok(goc(A, H, B), 55, 'BAH')
  hinh('HHC003187', [P(-40, 0), P(H.x + 130, 0), B], [seg(P(-40, 0), P(H.x + 130, 0)), seg(A, B), segDash(B, H), rightAngle(H, A, B),
    dot(A), dot(B), dot(H),
    angleText(A, H, B, '55°', 84),
    num(P((A.x + H.x) / 2, 0), '36 m', 0, 36),
    label(A, 'A', -4, -14 + 44), label(B, 'B', 18, -8), label(H, 'H', 0, 44), num(P(H.x + 62, -150), 'Tòa nhà', 0, 0)])
}

// HHC003188 — hải đăng: AC = 42 m thẳng đứng, tàu ở B, góc B = 10° (ảnh cũ không đặt tên điểm)
{
  const B = P(0, 0), AB = 400, A = P(AB, 0), C = P(AB, -AB * Math.tan(10 * RAD))
  ok(goc(B, A, C), 10, 'B')
  hinh('HHC003188', [B, A, C, P(B.x, 40), P(A.x, 40)], [seg(B, A), seg(B, C), seg(A, C),
    angleText(B, A, C, '10°', 205),
    num(P(A.x, (A.y + C.y) / 2), '42 m', -36, 7),
    num(B, 'Tàu cá', 0, 34), num(A, 'Hải đăng', 0, 34)])
}

// HHC003189_lg — MNP vuông tại M, MP > MN, P = 30°; MI ⊥ NP; MG phân giác góc PMI; IH ⊥ MN, IK ⊥ MP
{
  const M = P(0, 0), MP = 380, Pp = P(MP, 0), N = P(0, -MP * Math.tan(30 * RAD))
  const I = foot(M, N, Pp), Gh = bisector(M, I, Pp, 100), G = inter(M, Gh, N, Pp), H = foot(I, M, N), K = foot(I, M, Pp)
  ok(goc(Pp, M, N), 30, 'P'); ok(goc(M, N, Pp), 90, 'M'); ok(goc(I, M, Pp), 90, 'MIP')
  ok(goc(M, I, G), goc(M, G, Pp), 'IMG = GMP', 0.01)
  console.assert(dist(M, Pp) > dist(M, N), 'MP>MN')
  hinh('HHC003189_lg', [N, M, Pp, I, G, H, K], [
    seg(N, M), seg(M, Pp), seg(N, Pp), seg(M, I), seg(M, G), seg(I, H), seg(I, K),
    rightAngle(M, N, Pp), rightAngle(H, M, I), rightAngle(K, M, I), rightAngle(I, M, Pp),
    angleMark(M, I, G, 92), angleMark(M, G, Pp, 80),
    dot(N), dot(H), dot(M), dot(K), dot(Pp), dot(I), dot(G),
    angleText(Pp, M, N, '30°', 108),
    label(N, 'N', 0, -16), label(H, 'H', -26, 8), label(M, 'M', -14, 36), label(K, 'K', 0, 38),
    label(Pp, 'P', 16, 34), label(I, 'I', 20, -12), label(G, 'G', 22, -12)])
}

// HHC003190 — A nóc toà nhà (AB = 60 m), CD trạm; góc nhìn lên CAH = 46°, nhìn xuống HAD = 35°; AH ngang, H ∈ CD
{
  const k = 1.9, AB = 60 * k
  const A = P(0, 0), B = P(0, AB), H = P(AB / Math.tan(35 * RAD), 0), D = P(H.x, AB), C = P(H.x, -H.x * Math.tan(46 * RAD))
  ok(goc(A, H, C), 46, 'CAH'); ok(goc(A, H, D), 35, 'HAD')
  hinh('HHC003190', [A, B, D, C, H], [
    seg(A, B), seg(B, D), seg(C, D), seg(A, C), seg(A, D), segDash(A, H), rightAngle(H, A, D),
    dot(A), dot(B), dot(D), dot(C), dot(H),
    angleText(A, H, C, '46°', 100), angleText(A, H, D, '35°', 100),
    label(A, 'A', -20, 6), label(B, 'B', -14, 30), label(D, 'D', 14, 32), label(C, 'C', 0, -16), label(H, 'H', 22, 6)])
}

await xuatTat(RA)
