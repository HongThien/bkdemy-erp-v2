// Vẽ lại hình — gói HH00140-2 (Ôn thi giữa kì I, Hình học 9: hệ thức lượng trong tam giác vuông).
//   node scripts/anh/ve_lai/HH00140-2.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, ray, dot, label, num, angleText, sideText, hinh, xuatTat,
  mid, lerp, foot, inter, add, vec, goc, dist, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-2/moi'
const near = (v, w, tol, msg) => console.assert(Math.abs(v - w) < tol, `${msg}: ${v} ≠ ${w}`)

// HHC003097_lg — △ABC vuông tại A, AB = 6, AC = 8, đường cao AH; HE ⊥ AB, HF ⊥ AC; nối EF (hình lời giải: AEHF chữ nhật + hai đường chéo AH, EF)
{
  const u = 36
  const A = P(0, 0), B = P(6 * u, 0), C = P(0, -8 * u)
  const H = foot(A, B, C), E = foot(H, A, B), F = foot(H, A, C)
  near(goc(H, A, B), 90, 0.01, 'AH⊥BC'); near(goc(E, A, H), 90, 0.01, 'HE⊥AB'); near(goc(F, A, H), 90, 0.01, 'HF⊥AC')
  near(dist(B, C) / dist(A, B), 10 / 6, 0.001, 'BC:AB')
  hinh('HHC003097_lg', [A, B, C, H, E, F], [
    seg(C, B), seg(A, C), seg(A, B), seg(A, H), seg(E, F), seg(H, E), seg(H, F),
    rightAngle(A, B, C, 14), rightAngle(F, A, H, 12), rightAngle(E, A, H, 12), rightAngle(H, A, B, 12),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(F),
    label(C, 'C', -16, -8), label(F, 'F', -20, 8), label(H, 'H', 22, -8), label(A, 'A', -18, 30), label(E, 'E', 2, 36), label(B, 'B', 18, 30)], { pad: 44, padDuoi: 50 })
}

// HHC003098 — toà nhà AC ⊥ mặt đất AB, bóng AB = 48 m, tia nắng CB tạo với mặt đất góc 80° (sơ đồ: tranh toà nhà → đoạn AC + chữ "Tòa nhà")
{
  const B = P(-56, 0), A = P(0, 0)
  const C = ray(B, 80, 56 / Math.cos(80 * Math.PI / 180))
  near(goc(B, A, C), 80, 0.01, 'góc B = 80°'); near(goc(A, B, C), 90, 0.01, 'vuông tại A')
  hinh('HHC003098', [A, B, C, P(100, -150)], [
    seg(A, B), seg(A, C), seg(B, C), rightAngle(A, B, C, 14), angleMark(B, A, C, 24),
    dot(A), dot(B), dot(C),
    angleText(B, A, C, '80°', 44, 20),
    sideText(B, A, '48 m', C, 24),
    num(P(A.x + 48, (A.y + C.y) / 2), 'Tòa nhà', 0, 8),
    label(C, 'C', -4, -14), label(B, 'B', -18, 10), label(A, 'A', 26, 30)], { pad: 40, padDuoi: 46 })
}

// HHC003099_lg — △ABC vuông tại A (AB = 10√3, BC = 20 ⇒ B = 30°, AC = 10); D ∈ AC; CE ⊥ BD tại E; M = CE ∩ AB; N = AE ∩ BC;
//   BI ∥ AC, CI ∥ BD; H, K trung điểm MI, BC. Lời giải: HB = HC (HB = HC = MI/2) — hình giữ HK nối sẵn, không ghi HK ⊥ BC.
{
  const k = 19.6
  const A = P(0, 0), B = P(10 * Math.sqrt(3) * k, 0), C = P(0, -10 * k)
  near(goc(B, A, C), 30, 0.01, 'góc B = 30°')
  const D = lerp(A, C, 0.55)
  const E = foot(C, B, D)
  const M = inter(C, E, A, B), N = inter(A, E, B, C)
  const I = inter(B, P(B.x, B.y - 100), C, add(C, vec(B, D)))
  const H = mid(M, I), K = mid(B, C)
  near(goc(E, C, D), 90, 0.01, 'CE⊥BD'); near(goc(B, I, C) + goc(C, B, I), 180 - goc(I, B, C), 0.01, 'tam giác BIC')
  console.assert(M.x < A.x && E.x < A.x && N.y < C.y && D.y < A.y && D.y > C.y, 'thứ tự điểm (A giữa M,B; E giữa M,C; C giữa N,B)')
  near(goc(B, M, I), 90, 0.01, 'MB⊥BI')
  hinh('HHC003099_lg', [M, A, B, C, D, E, N, I, H, K], [
    seg(M, B), seg(A, C), seg(M, C), seg(E, B), seg(N, B), seg(N, A), seg(M, I), seg(C, I), seg(B, I), seg(H, K),
    tick(C, K, 2), tick(K, B, 2), tick(M, H, 1), tick(H, I, 1),
    rightAngle(A, B, C, 14), rightAngle(E, M, D, 12),
    dot(M), dot(A), dot(B), dot(C), dot(D), dot(E), dot(N), dot(I), dot(H), dot(K),
    label(N, 'N', -6, -14), label(C, 'C', 22, -6), label(E, 'E', -22, 6), label(D, 'D', 20, -8), label(K, 'K', 18, -10),
    label(H, 'H', -20, -4), label(I, 'I', 22, -2), label(M, 'M', -4, 34), label(A, 'A', 4, 34), label(B, 'B', 6, 34)], { pad: 44, padDuoi: 52 })
}

// HHC003100 — dốc: △ABC vuông tại C, AB = 4 (đoạn dốc), BC = 0,4 (độ cao) ⇒ sin α = 0,1; góc dốc α tại A
{
  const u = 90
  const al = Math.asin(0.1) * 180 / Math.PI
  const A = P(0, 0), B = ray(A, al, 4 * u)
  const C = P(B.x, 0)
  near(dist(B, C) / dist(A, B), 0.1, 1e-6, 'sin α = 0,1')
  const r = 100
  const mA = bisector(A, B, C, r + 26)
  hinh('HHC003100', [A, B, C], [
    seg(A, B), seg(A, C), seg(B, C), rightAngle(C, A, B, 14), angleMark(A, B, C, r),
    dot(A), dot(B), dot(C),
    num(P(A.x + r + 4, A.y), '<tspan font-style="italic">α</tspan>', 0, 28, 24),
    label(A, 'A', -20, 10), label(B, 'B', 8, -14), label(C, 'C', 16, 30)], { pad: 44, padDuoi: 50 })
}

// HHC003101_lg — △ABC vuông tại A, B = 60°, KB = 2, KC = 6 (BC = 8, AB = 4, AC = 4√3); AK ⊥ BC; BD phân giác (D ∈ AC); DE ⊥ BC
{
  const u = 44
  const B = P(0, 0), K = P(2 * u, 0), C = P(8 * u, 0)
  const A = P(2 * u, -2 * Math.sqrt(3) * u)
  near(goc(B, A, C), 60, 0.01, 'B = 60°'); near(goc(A, B, C), 90, 0.01, 'vuông tại A'); near(dist(A, B), 4 * u, 0.01, 'AB = 4')
  const D = lerp(A, C, 1 / 3)
  near(goc(B, A, D), 30, 0.01, 'ABD = 30° (BD phân giác)')
  const E = foot(D, B, C)
  near(goc(C, B, D), 30, 0.01, 'DBC = 30° (BD phân giác)'); near(goc(C, B, A), 30, 0.01, 'C = 30°')
  near(dist(B, E), 4 * u, 0.01, 'BE = BA')
  hinh('HHC003101_lg', [A, B, C, K, D, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, K), seg(B, D), seg(D, E),
    rightAngle(A, B, C, 14), rightAngle(K, A, C, 12), rightAngle(E, D, C, 12),
    angleMark(B, A, D, 44), angleMark(B, D, E, 58),
    dot(A), dot(B), dot(C), dot(K), dot(D), dot(E),
    label(A, 'A', 0, -16), label(D, 'D', 18, -10), label(B, 'B', -8, 34), label(K, 'K', 0, 36), label(E, 'E', 2, 36), label(C, 'C', 12, 34)], { pad: 44, padDuoi: 52 })
}

// HHC003102 — toà nhà AC ⊥ mặt đất; B đầu bóng (AB = 79 m, góc ABC = 68°); M người đứng, góc AMC = 45° (MB nằm trên mặt đất, M, B, A thẳng hàng)
{
  const u = 1.45
  const A = P(0, 0), B = P(-79 * u, 0)
  const C = P(0, -79 * u * Math.tan(68 * Math.PI / 180))
  const M = P(C.y, 0) // AM = AC (tan 45° = 1); C.y âm ⇒ M nằm bên trái A
  near(goc(B, A, C), 68, 0.01, 'B = 68°'); near(goc(M, A, C), 45, 0.01, 'M = 45°'); near(goc(A, M, C), 90, 0.01, 'tam giác AMC vuông tại A')
  hinh('HHC003102', [M, B, A, C], [
    seg(M, A), seg(M, C), seg(B, C), seg(A, C), rightAngle(A, M, C, 14),
    angleMark(M, A, C, 46), angleMark(B, A, C, 36),
    dot(M), dot(B), dot(A), dot(C),
    angleText(M, A, C, '45°', 82, 20), angleText(B, A, C, '68°', 62, 20),
    sideText(B, A, '79 m', C, 26),
    label(C, 'C', 6, -14), label(M, 'M', -8, 34), label(B, 'B', -18, -12), label(A, 'A', 20, 32)], { pad: 44, padDuoi: 52 })
}

// HHC003103_lg — △ABC vuông tại A (AB < AC), AH ⊥ BC, HI ⊥ AC (I ∈ AC), HD phân giác góc AHC (D ∈ AC), T = HD ∩ AB, K = BD ∩ HI
//   (đường kẻ thêm của lời giải, BM ∥ AH, chỉ có trong chữ → ảnh cũ không có ⇒ không vẽ)
{
  const u = 66
  const H = P(0, 0), A = P(0, -2 * u), B = P(-1 * u, 0), C = P(4 * u, 0)   // AH² = BH·HC (b = 1, c = 4, h = 2)
  near(goc(A, B, C), 90, 0.01, 'vuông tại A'); near(dist(A, H) ** 2, dist(B, H) * dist(H, C), 0.01, 'AH² = BH·HC')
  const I = foot(H, A, C)
  const D = inter(H, P(1, -1), A, C)
  near(goc(H, A, D), 45, 0.01, 'HD phân giác AHC')
  const T = inter(H, D, A, B)
  const K = inter(B, D, H, I)
  console.assert(T.y > B.y && T.x < B.x, 'T ngoài tam giác, trên tia AB phía sau B')
  hinh('HHC003103_lg', [A, B, C, H, I, D, T, K], [
    seg(T, A), seg(A, C), seg(B, C), seg(A, H), seg(H, I), seg(B, D), seg(T, D),
    rightAngle(A, B, C, 14), rightAngle(H, A, B, 14), rightAngle(I, A, H, 12), angleMark(H, A, C, 36),
    dot(A), dot(B), dot(C), dot(H), dot(I), dot(D), dot(T), dot(K),
    label(A, 'A', -4, -16), label(I, 'I', 20, -6), label(D, 'D', 10, 38), label(K, 'K', 22, 26), label(B, 'B', -14, -12),
    label(H, 'H', 6, 34), label(C, 'C', 22, 8), label(T, 'T', -6, 34)], { pad: 44, padDuoi: 52 })
}

// HHC003104 — gấp tờ giấy chữ nhật ABCD: B trùng F ∈ DC, nếp gấp AE (E ∈ BC); EC = 4, FC = 3 ⇒ BE = EF = 5, BC = 9, AB = 15
{
  const u = 25
  const D = P(0, 0), C = P(15 * u, 0), B = P(15 * u, -9 * u), A = P(0, -9 * u)
  const E = P(B.x, -4 * u), F = P(12 * u, 0)
  near(dist(A, F), dist(A, B), 0.01, 'AF = AB'); near(dist(E, F), dist(E, B), 0.01, 'EF = EB'); near(dist(E, F), 5 * u, 0.01, 'EF = 5')
  hinh('HHC003104', [A, B, C, D, E, F, P(C.x + 46, C.y)], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, E), seg(A, F), seg(E, F), rightAngle(C, D, B, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    sideText(E, C, '4 cm', D, 34), sideText(F, C, '3 cm', A, 62),
    label(A, 'A', -20, -4), label(B, 'B', 22, -4), label(E, 'E', 24, 6), label(D, 'D', -20, 28), label(F, 'F', 0, 36), label(C, 'C', 22, 30)], { pad: 44, padDuoi: 72 })
}

await xuatTat(RA)
