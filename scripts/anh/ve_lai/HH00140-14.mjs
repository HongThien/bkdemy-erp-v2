// Vẽ lại hình — gói HH00140-14 (Ôn thi giữa kì I, Hình học 9: hệ thức lượng trong tam giác vuông).
//   node scripts/anh/ve_lai/HH00140-14.mjs [<thu_muc_ra>]
import { P, seg, segDash, angleMark, rightAngle, tick, ray, mid, foot, inter, goc, dist, dot, label, num, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-14/moi'
const rad = (d) => d * Math.PI / 180
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / dist(a, b) // khoảng cách c tới đường ab

// HHC003199 — tháp Eiffel: tam giác vuông tại chân tháp, góc 62° ở đầu bóng, bóng 172 m
{
  const A = P(0, 0), B = P(150, 0), C = ray(A, 62, 150 / Math.cos(rad(62)))
  console.assert(Math.abs(goc(A, B, C) - 62) < 0.1 && Math.abs(goc(B, A, C) - 90) < 0.1)
  hinh('HHC003199', [A, B, C, P(B.x + 110, C.y)], [seg(A, B), seg(B, C), seg(A, C), angleMark(A, B, C, 38), rightAngle(B, A, C),
    dot(A), dot(B), dot(C), angleText(A, B, C, '62°', 78),
    num(mid(A, B), '172 m', 0, 36), num(P(B.x + 52, (B.y + C.y) / 2), 'Tháp', 0, -2, 20), num(P(B.x + 52, (B.y + C.y) / 2), 'Eiffel', 0, 20, 20)])
}

// HHC003200_lg — Δ ABC vuông tại A (AB=6, AC=8 ⇒ tỉ lệ 3:4), M trung điểm AC, I = chân đường vuông góc hạ từ A xuống BM,
// K = hình chiếu của M trên BC, N = giao của tia AI với đường qua C vuông góc AC
{
  const k = 35, A = P(0, 0), B = P(6 * k, 0), C = P(0, -8 * k), M = mid(A, C)
  const I = foot(A, B, M), K = foot(M, B, C), N = inter(A, I, C, P(100, C.y))
  console.assert(Math.abs(goc(I, A, M) - 90) < 0.1 && Math.abs(goc(K, M, B) - 90) < 0.1 && Math.abs(goc(C, A, N) - 90) < 0.1)
  console.assert(thang(M, K, N) < 0.01, 'M K N phải thẳng hàng')
  hinh('HHC003200_lg', [A, B, C, N], [seg(A, C), seg(A, B), seg(B, C), seg(B, M), seg(M, K), seg(A, N), seg(C, N),
    tick(A, M, 1), tick(M, C, 1),
    rightAngle(A, B, C), rightAngle(C, A, N), rightAngle(K, M, B), rightAngle(I, M, A),
    dot(A), dot(B), dot(C), dot(N), dot(M), dot(K), dot(I),
    label(A, 'A', -20, 30), label(B, 'B', 6, 32), label(C, 'C', -6, -16), label(N, 'N', 8, -16),
    label(M, 'M', -22, 9), label(K, 'K', 20, 6), label(I, 'I', 20, 10)])
}

// HHC003201 — máy bay cất cánh: Δ ABC vuông tại C, góc A = 30°
{
  const A = P(0, 0), C = P(340, 0), B = ray(A, 30, 340 / Math.cos(rad(30)))
  console.assert(Math.abs(goc(A, C, B) - 30) < 0.1 && Math.abs(goc(C, A, B) - 90) < 0.1)
  hinh('HHC003201', [A, B, C, P(10, -100)], [seg(A, B), seg(A, C), seg(B, C), angleMark(A, C, B, 60), rightAngle(C, A, B),
    dot(A), dot(B), dot(C), angleText(A, C, B, '30°', 98),
    num(P(60, -76), 'Máy bay', 0, 0, 20),
    label(A, 'A', -18, 30), label(B, 'B', 4, -16), label(C, 'C', 6, 32)])
}

// HHC003202_lg — Δ ABC vuông tại A (AB=6, AC=8, BC=10), M trung điểm AC, H = chân đường vuông góc hạ từ A xuống BM,
// I = chân đường vuông góc hạ từ M xuống BC, K = giao của đường MI với đường qua C vuông góc AC
{
  const k = 35, A = P(0, 0), B = P(0, -6 * k), C = P(8 * k, 0), M = mid(A, C)
  const H = foot(A, B, M), I = foot(M, B, C), K = inter(M, I, C, P(C.x, -100))
  console.assert(Math.abs(goc(H, A, M) - 90) < 0.1 && Math.abs(goc(I, M, C) - 90) < 0.1 && Math.abs(goc(C, A, K) - 90) < 0.1)
  console.assert(thang(A, H, K) < 0.01, 'A H K phải thẳng hàng')
  hinh('HHC003202_lg', [A, B, C, K], [seg(A, B), seg(A, C), seg(B, C), seg(B, M), seg(A, H), seg(M, K), seg(C, K),
    tick(A, M, 1), tick(M, C, 1),
    rightAngle(A, B, C), rightAngle(H, A, M), rightAngle(I, M, C), rightAngle(C, A, K),
    dot(A), dot(B), dot(C), dot(M), dot(H), dot(I), dot(K),
    label(A, 'A', -20, 8), label(B, 'B', -4, -16), label(C, 'C', 4, 32), label(M, 'M', 0, 34),
    label(H, 'H', -4, -14), label(I, 'I', 22, -2), label(K, 'K', 22, -6)])
}

// HHC003204 — cột đèn cao 7 m, bóng 14 m; tòa nhà bóng 272 m; hai tia nắng song song (tan góc nắng = 1/2); 272 m vẽ rút ngắn
{
  const g = 0
  const lampTop = P(0, -40), lampEnd = P(80, g)                       // cột 40, bóng 80 (1:2)
  const bl = P(100, g), br = P(172, g), blt = P(100, -120), btop = P(172, -120), bend = P(412, g) // nhà cao 120, bóng 240 (1:2)
  console.assert(Math.abs((lampEnd.x - lampTop.x) / (g - lampTop.y) - 2) < 1e-9 && Math.abs((bend.x - btop.x) / (g - btop.y) - 2) < 1e-9)
  hinh('HHC003204', [P(-28, -150), P(428, g), P(0, 56), P(412, 56)], [
    seg(P(-28, g), P(428, g)),
    seg(P(0, g), lampTop), dot(lampTop),
    segDash(P(-28, -54), lampEnd),
    seg(bl, br), seg(br, btop), seg(blt, btop), seg(bl, blt),
    segDash(P(132, -140), bend),
    num(P(136, -78), 'Tòa', 0, 0, 20), num(P(136, -54), 'nhà', 0, 0, 20),
    num(P(-22, -14), '7 m', 0, 0, 20),
    seg(P(0, 26), P(80, 26)), seg(P(0, 21), P(0, 31)), seg(P(80, 21), P(80, 31)), num(P(40, 26), '14 m', 0, 28),
    seg(P(172, 26), P(412, 26)), seg(P(172, 21), P(172, 31)), seg(P(412, 21), P(412, 31)), num(P(292, 26), '272 m', 0, 28)], { pad: 30 })
}

// HHC003205_lg — Δ ABC vuông tại A (AB=2, BC=4), D thuộc tia BA với BD=3, BH ⊥ CD tại K (H thuộc AC), DH cắt BC tại E
{
  const k = 80, A = P(0, 0), B = P(2 * k, 0), C = P(0, -Math.sqrt(12) * k), D = P(-1 * k, 0)
  const K = foot(B, C, D), H = inter(B, K, C, A), E = inter(D, H, B, C)
  console.assert(Math.abs(goc(B, A, C) - 60) < 0.1 && Math.abs(dist(B, C) - 4 * k) < 0.01 && Math.abs(dist(B, D) - 3 * k) < 0.01)
  console.assert(Math.abs(goc(E, D, B) - 90) < 0.1 && Math.abs(dist(B, E) - 1.5 * k) < 0.01 && Math.abs(goc(K, C, B) - 90) < 0.1)
  hinh('HHC003205_lg', [A, B, C, D], [seg(D, B), seg(C, A), seg(B, C), seg(D, C), seg(B, K), seg(D, E),
    rightAngle(A, B, C), rightAngle(K, C, B),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(K), dot(E),
    label(A, 'A', 6, 34), label(B, 'B', 10, 30), label(C, 'C', 0, -16), label(D, 'D', -16, 30),
    label(H, 'H', 20, -24), label(K, 'K', -18, 6), label(E, 'E', 20, -4),
    num(P(A.x + 80, 0), '2 cm', 0, 32), num(P(mid(B, C).x + 30, mid(B, C).y - 8), '4 cm', 0, 0)])
}

// HHC003206 — cột cờ AB, bóng BC, tia nắng AC tạo với mặt đất góc 50°
{
  const C = P(0, 0), B = P(200, 0), A = ray(C, 50, 200 / Math.cos(rad(50)))
  console.assert(Math.abs(goc(C, B, A) - 50) < 0.1 && Math.abs(goc(B, C, A) - 90) < 0.1)
  hinh('HHC003206', [P(-50, 0), P(270, 0), A, P(300, A.y)], [seg(P(-50, 0), P(270, 0)), seg(A, B), seg(A, C), angleMark(C, B, A, 45),
    dot(A), dot(B), dot(C), angleText(C, B, A, '50°', 84),
    num(P(B.x + 48, (A.y + B.y) / 2), 'Cột cờ', 0, 0, 20),
    label(A, 'A', 0, -16), label(B, 'B', 10, 32), label(C, 'C', -4, 32)])
}

// HHC003207_lg — Δ ABC vuông tại A (AB=5, AC=12, BC=13), đường cao AH, HE ⊥ AB, HF ⊥ AC
{
  const k = 28, B = P(0, 0), C = P(13 * k, 0), bh = 25 / 13 * k, ah = 60 / 13 * k
  const A = P(bh, -ah), H = P(bh, 0), E = foot(H, A, B), F = foot(H, A, C)
  console.assert(Math.abs(dist(A, B) - 5 * k) < 0.01 && Math.abs(dist(A, C) - 12 * k) < 0.01 && Math.abs(goc(A, B, C) - 90) < 0.1)
  console.assert(Math.abs(goc(E, H, A) - 90) < 0.1 && Math.abs(goc(F, H, A) - 90) < 0.1)
  hinh('HHC003207_lg', [A, B, C], [seg(B, C), seg(A, B), seg(A, C), seg(A, H), seg(H, E), seg(H, F),
    rightAngle(A, B, C), rightAngle(H, A, C), rightAngle(E, B, H), rightAngle(F, C, H),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(F),
    label(A, 'A', -4, -16), label(B, 'B', -16, 30), label(C, 'C', 6, 32), label(H, 'H', -6, 34),
    label(E, 'E', -20, -2), label(F, 'F', 14, -14)])
}

await xuatTat(RA)
