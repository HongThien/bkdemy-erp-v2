// Vẽ lại hình — gói HH00140-9 (Ôn thi giữa kì I, Hình học 9). Thùy giao 13/10.
//   node scripts/anh/ve_lai/HH00140-9.mjs [<thu_muc_ra>]
// Mỗi hình một khối { }; điểm dựng bằng số đo CỦA ĐỀ (ray/foot/inter/mid…), có console.assert tự kiểm.
import { P, seg, segDash, angleMark, rightAngle, tick, ray, mid, lerp, foot, inter, bisector, add, goc, dist,
  dot, label, num, angleText, sideText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-9/moi'
const rad = (d) => d * Math.PI / 180
const ok = (cond, msg) => console.assert(cond, msg)

// HHC003155 — tháp BC (B chân, C đỉnh), A cuối bóng: AB = 26 m, góc A = 30°
{
  const s = 12, A = P(0, 0), B = P(26 * s, 0), C = P(B.x, -26 * s * Math.tan(rad(30)))
  ok(Math.abs(goc(A, B, C) - 30) < 0.5, '3155 góc A')
  hinh('HHC003155', [A, B, C], [seg(A, B), seg(B, C), seg(A, C), angleMark(A, B, C, 46), dot(A), dot(B), dot(C),
    angleText(A, B, C, '30°', 104), num(mid(A, B), '26 m', 0, 34),
    label(A, 'A', -20, -8), label(B, 'B', 4, 34), label(C, 'C', 0, -14)], { pad: 40, padDuoi: 48 })
}

// HHC003156 — hải đăng AB = 42 m (A đỉnh, B chân), C là tàu, góc C = 10° (vẽ đúng tỉ lệ: BC = 42·cot10° ≈ 238 m)
{
  const s = 1.6, C = P(0, 0), AB = 42 * s, BC = 42 / Math.tan(rad(10)) * s
  const B = P(BC, 0), A = P(BC, -AB)
  ok(Math.abs(goc(C, B, A) - 10) < 0.5, '3156 góc C')
  hinh('HHC003156', [A, B, C], [seg(C, B), seg(B, A), seg(C, A), angleMark(C, B, A, 96), dot(A), dot(B), dot(C),
    num(ray(C, 5, 232), '10°', 0, 7, 20), num(P(B.x - 36, -AB / 2), '42 m', 0, 8),
    label(A, 'A', 22, -2), label(B, 'B', 4, 36), label(C, 'C', -2, 36)], { pad: 40, padDuoi: 48 })
}

// HHC003157_lg — △ABC vuông tại A, AB = 3k, AC = 4k (AB<AC); AH ⊥ BC; AK phân giác góc HAC; I trung điểm AC;
// AE ⊥ BI; BP ⊥ AB, P ∈ CE; M đối xứng B qua A. Lời giải: CM, MP, CP, AE, AH, AK, BI.
{
  const k = 38, A = P(0, 0), B = P(3 * k, 0), C = P(0, -4 * k), M = P(-3 * k, 0), I = mid(A, C)
  const H = foot(A, B, C), E = foot(A, B, I)
  const K = inter(A, bisector(A, H, C, 100), H, C)
  const P_ = inter(C, E, B, add(B, P(0, 1)))
  ok(Math.abs(goc(A, H, K) - goc(A, K, C)) < 0.5, '3157 AK phân giác')
  ok(Math.abs(dist(B, P_) - 4.5 * k) < 0.5, '3157 BP = 2AB²/AC')
  ok(Math.abs(goc(M, C, P_) - 90) < 0.5, '3157 CM ⊥ MP')
  ok(Math.abs(goc(E, A, B) - 90) < 0.5, '3157 AE ⊥ BI')
  hinh('HHC003157_lg', [M, B, C, P_, K], [
    seg(C, M), seg(C, B), seg(M, B), seg(C, A), seg(B, P_), seg(M, P_), seg(C, P_),
    seg(I, B), seg(A, E), seg(A, K), seg(A, H),
    tick(A, C, 2, 0.25), tick(I, C, 2, 0.5), tick(M, A, 1), tick(A, B, 1),
    angleMark(A, C, K, 28), angleMark(A, K, H, 22),
    rightAngle(A, B, C, 10), rightAngle(B, A, P_, 10), rightAngle(E, A, B, 9), rightAngle(H, A, B, 9),
    dot(C), dot(I), dot(E), dot(H), dot(K), dot(A), dot(B), dot(M), dot(P_),
    label(C, 'C', 0, -12), label(K, 'K', 16, -8), label(I, 'I', -17, 8), label(E, 'E', 17, -8), label(H, 'H', 18, -3),
    label(B, 'B', 14, -10), label(A, 'A', -15, 26), label(M, 'M', -4, -14), label(P_, 'P', 16, 20)], { pad: 34, padDuoi: 36 })
}

// HHC003158 — máy bay bay từ B theo BC tạo góc 28° với mặt đất; A chân đường cao, AC = độ cao
{
  const B = P(0, 0), A = P(300, 0), C = P(300, -300 * Math.tan(rad(28)))
  ok(Math.abs(goc(B, A, C) - 28) < 0.5, '3158 góc B')
  hinh('HHC003158', [A, B, C], [seg(B, A), seg(A, C), seg(B, C), angleMark(B, A, C, 52), dot(A), dot(B), dot(C),
    angleText(B, A, C, '28°', 112), label(B, 'B', -4, 36), label(A, 'A', 4, 36), label(C, 'C', 4, -14)], { pad: 40, padDuoi: 48 })
}

// HHC003159_lg — △ABC vuông tại A, AB = 9, AC = 12 (tan C = 3/4); AH ⊥ BC; M, N chân đường vuông góc hạ từ H xuống AB, AC;
// AK ∥ MN, CK ∥ AH; I = AH ∩ BK (I là tâm hình chữ nhật AMHN).
{
  const k = 76, A = P(0, 0), B = P(3 * k, 0), C = P(0, -4 * k)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  const dMN = P(M.x - N.x, M.y - N.y), dAH = P(H.x - A.x, H.y - A.y)
  const K = inter(A, add(A, dMN), C, add(C, dAH))
  const I = inter(A, H, B, K)
  ok(dist(I, mid(A, H)) < 0.5, '3159 I trung điểm AH')
  ok(Math.abs(goc(H, A, B) - 90) < 0.5, '3159 AH ⊥ BC')
  hinh('HHC003159_lg', [K, B, C], [
    seg(C, A), seg(A, B), seg(C, B), seg(C, K), seg(K, A), seg(K, B), seg(A, H), seg(N, M), seg(N, H), seg(H, M),
    rightAngle(A, B, C, 14), rightAngle(N, A, H, 12), rightAngle(H, A, B, 12), rightAngle(M, A, H, 12),
    dot(C), dot(K), dot(N), dot(H), dot(I), dot(A), dot(M), dot(B),
    label(C, 'C', 0, -14), label(K, 'K', -17, 6), label(N, 'N', -19, 4), label(H, 'H', 20, -6), label(I, 'I', 4, -14),
    label(A, 'A', -17, 28), label(M, 'M', 0, 34), label(B, 'B', 14, 28)], { pad: 40, padDuoi: 46 })
}

// HHC003160 — thang BC = 3,5 m dựa tường AB, góc chân thang C = 60°, A chân tường (góc vuông)
{
  const s = 90, C = P(0, 0), BC = 3.5 * s, A = P(BC * Math.cos(rad(60)), 0), B = P(A.x, -BC * Math.sin(rad(60)))
  ok(Math.abs(goc(C, A, B) - 60) < 0.5 && Math.abs(goc(A, C, B) - 90) < 0.5, '3160')
  hinh('HHC003160', [C, A, B], [seg(C, A), seg(A, B), seg(C, B), angleMark(C, A, B, 34), rightAngle(A, C, B, 14),
    dot(A), dot(B), dot(C), angleText(C, A, B, '60°', 76), sideText(C, B, '3,5 m', A, 38),
    label(C, 'C', -6, 34), label(A, 'A', 6, 34), label(B, 'B', 14, -12)], { pad: 44, padDuoi: 48 })
}

// HHC003161_lg — △ABC vuông tại A, AB = 12, AC = 16, BC = 20 (sin C = 3/5); AH ⊥ BC; BD ⊥ BC, D ∈ AC;
// K ∈ AC, KM ⊥ HC, KN ⊥ AH.
{
  const k = 20, B = P(0, 0), C = P(20 * k, 0), A = P(7.2 * k, -9.6 * k), D = P(0, -15 * k)
  const H = P(A.x, 0), K = lerp(A, C, 0.4), M = foot(K, B, C), N = foot(K, A, H)
  ok(Math.abs(goc(A, B, C) - 90) < 0.5, '3161 A vuông')
  ok(dist(inter(D, A, B, C), C) < 0.5, '3161 D,A,C thẳng hàng')
  hinh('HHC003161_lg', [D, B, C, A], [
    seg(D, B), seg(B, C), seg(D, C), seg(B, A), seg(A, H), seg(N, K), seg(K, M),
    rightAngle(B, C, D, 13), rightAngle(A, B, C, 13), rightAngle(N, H, K, 11), rightAngle(H, A, C, 11), rightAngle(M, K, C, 11),
    dot(D), dot(A), dot(N), dot(K), dot(B), dot(H), dot(M), dot(C),
    label(D, 'D', -20, 4), label(A, 'A', 6, -14), label(N, 'N', -17, 8), label(K, 'K', 14, -10),
    label(B, 'B', -10, 34), label(H, 'H', 0, 34), label(M, 'M', 4, 34), label(C, 'C', 16, 30)], { pad: 40, padDuoi: 46 })
}

// HHC003162 — tháp AB (A đỉnh, B chân), bóng BC = 72 m, góc C = 60°
{
  const s = 2.2, C = P(0, 0), B = P(72 * s, 0), A = P(B.x, -72 * s * Math.tan(rad(60)))
  ok(Math.abs(goc(C, B, A) - 60) < 0.5, '3162 góc C')
  hinh('HHC003162', [A, B, C], [seg(C, B), seg(B, A), seg(C, A), angleMark(C, B, A, 40), dot(A), dot(B), dot(C),
    angleText(C, B, A, '60°', 82), num(mid(C, B), '72 m', 0, 36),
    label(A, 'A', 18, 4), label(B, 'B', 4, 34), label(C, 'C', -2, 34)], { pad: 40, padDuoi: 52 })
}

await xuatTat(RA)
