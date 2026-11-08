// Vẽ lại hình — gói HH00140-4 (Ôn thi giữa kì I, Hình học 9). Luồng vẽ lại hình (Thùy 13/10).
//   node scripts/anh/ve_lai/HH00140-4.mjs [<thu_muc_ra>]
// Quy ước: mỗi hình một khối { }; dựng điểm bằng số đo CỦA ĐỀ (ray/rot/mid/foot/inter…), không chép toạ độ ước mắt từ ảnh cũ.
import { P, seg, rightAngle, angleMark, ray, dot, label, num, angleText, mid, lerp, foot, inter, add, vec, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-4/moi'
const ok = (cond, msg) => { if (!cond) throw new Error('KHÔNG KHỚP ĐỀ: ' + msg) }
const gan = (a, b, t, eps = 0.02) => Math.abs(a - b) < eps * Math.max(1, Math.abs(t ?? b))

// HHC003113 — cây AB (thẳng đứng), bóng AC = 4,5 m, góc ABC = 50° (ảnh cũ chỉ có nhãn A, B, C; số đo nằm trong đề)
{
  const k = 66, A = P(0, 0), C = P(4.5 * k, 0), B = P(0, -4.5 * k / Math.tan(50 * Math.PI / 180))
  ok(Math.abs(goc(B, A, C) - 50) < 0.5, 'góc ABC = 50°')
  hinh('HHC003113', [A, B, C], [seg(A, B), seg(A, C), seg(B, C), dot(A), dot(B), dot(C),
    label(A, 'A', -16, 30), label(B, 'B', -4, -16), label(C, 'C', 16, 30)])
}

// HHC003114_lg — tam giác ABC vuông tại A, đường cao AH, BC = 8, BH = 2 (⇒ AB = 4, AC = 4√3, AH = 2√3);
//   K ∈ AC (K ≠ A, C), D = hình chiếu của A trên BK
{
  const k = 48, B = P(0, 0), C = P(8 * k, 0), H = P(2 * k, 0), A = P(2 * k, -2 * Math.sqrt(3) * k)
  ok(gan(dist(A, B) / k, 4, 4) && gan(dist(A, C) / k, 4 * Math.sqrt(3), 7) && Math.abs(goc(A, B, C) - 90) < 0.5, 'AB = 4, AC = 4√3, góc A = 90°')
  const K = lerp(A, C, 0.55), D = foot(A, B, K)
  ok(Math.abs(goc(D, A, B) - 90) < 0.5, 'AD ⊥ BK')
  hinh('HHC003114_lg', [A, B, C, H, K, D], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(B, K), seg(A, D),
    rightAngle(A, B, C, 14), rightAngle(H, A, B, 14), rightAngle(D, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(K), dot(D),
    label(A, 'A', -4, -16), label(B, 'B', -14, 30), label(C, 'C', 12, 30), label(H, 'H', 0, 34), label(K, 'K', 18, -10), label(D, 'D', 22, 30)])
}

// HHC003115 — hải đăng thẳng đứng, bóng trên mặt đất 20 m, tia nắng hợp mặt đất 35° (ảnh cũ: 35°, 20 m, góc vuông ở chân tháp, không có chữ cái)
{
  const k = 15, C = P(0, 0), A = P(20 * k, 0), B = ray(C, 35, 20 * k / Math.cos(35 * Math.PI / 180))
  ok(gan(A.x - B.x, 0, 1, 0.5) && Math.abs(goc(C, A, B) - 35) < 0.5, 'góc 35°')
  hinh('HHC003115', [A, B, C, P(A.x - 100, -105)], [seg(C, A), seg(A, B), seg(C, B), rightAngle(A, C, B, 14), angleMark(C, A, B, 60),
    angleText(C, A, B, '35°', 100),
    num(mid(C, A), '20 m', 0, 34), num(P(A.x - 58, -105), 'Hải đăng', 0, 7)])
}

// HHC003116_lg — tam giác ABC vuông tại A (AB < AC; vẽ theo số liệu ý a: AB = 6, AC = 8), M trung điểm AC, I = hình chiếu của A trên BM,
//   K = hình chiếu của M trên BC, N = giao của tia AI với đường thẳng qua C vuông góc với AC
{
  const k = 36, A = P(0, 0), B = P(6 * k, 0), C = P(0, -8 * k), M = mid(A, C)
  const I = foot(A, B, M), K = foot(M, B, C), N = inter(A, I, C, P(100, C.y))
  ok(Math.abs(goc(I, A, M) - 90) < 0.5 && Math.abs(goc(K, M, B) - 90) < 0.5, 'AI ⊥ BM, MK ⊥ BC')
  ok(N.x > 0 && Math.abs(goc(C, A, N) - 90) < 0.5, 'CN ⊥ AC, N cùng phía B')
  ok(Math.abs(dist(A, M) - dist(M, C)) < 0.01, 'M trung điểm AC')
  hinh('HHC003116_lg', [A, B, C, M, I, K, N], [seg(A, B), seg(A, C), seg(B, C), seg(B, M), seg(M, K), seg(A, N), seg(C, N),
    rightAngle(A, B, C, 14), rightAngle(C, A, N, 14), rightAngle(K, M, C, 14), rightAngle(I, M, A, 14),
    dot(A), dot(B), dot(C), dot(M), dot(I), dot(K), dot(N),
    label(A, 'A', -16, 30), label(B, 'B', 16, 30), label(C, 'C', -16, -10), label(N, 'N', 8, -16),
    label(M, 'M', -26, 8), label(K, 'K', 26, 4), label(I, 'I', 12, 30)])
}

// HHC003117 — cột cờ AC thẳng đứng, bóng AB = 19 m, góc tới B = 32° (ảnh cũ: B, A, C, 19 m, 32°, và một nhãn chữ nhỏ mờ cạnh AC)
{
  const k = 15, B = P(0, 0), A = P(19 * k, 0), C = P(19 * k, -19 * k * Math.tan(32 * Math.PI / 180))
  ok(Math.abs(goc(B, A, C) - 32) < 0.5, 'góc B = 32°')
  hinh('HHC003117', [A, B, C, P(A.x + 100, A.y)], [seg(B, A), seg(A, C), seg(B, C), angleMark(B, A, C, 56),
    angleText(B, A, C, '32°', 100),
    dot(A), dot(B), dot(C),
    label(B, 'B', -16, 30), label(A, 'A', 16, 30), label(C, 'C', 4, -16),
    num(mid(B, A), '19 m', 0, 34), num(P(A.x + 52, mid(A, C).y), 'Cột cờ', 0, 7)])
}

// HHC003118_lg — △ABC vuông tại A (AB < AC; vẽ theo ý a: AB = 9, AC = 12 ⇒ BC = 15), đường cao AH;
//   M, N = chân đường vuông góc hạ từ H xuống AB, AC; AK ∥ MN, CK ∥ AH (K = giao); I = AH ∩ BK
{
  const k = 24, A = P(0, 0), B = P(9 * k, 0), C = P(0, -12 * k)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  const K = inter(A, add(A, vec(M, N)), C, add(C, vec(A, H))), I = inter(A, H, B, K)
  ok(Math.abs(goc(H, A, B) - 90) < 0.5, 'AH ⊥ BC')
  ok(dist(I, mid(A, H)) < 0.5, 'I là trung điểm AH (tâm hình chữ nhật AMHN)')
  ok(dist(I, mid(M, N)) < 0.5, 'I thuộc MN')
  ok(gan(dist(B, H) / k, 5.4, 5.4) && gan(dist(A, H) / k, 7.2, 7.2), 'BH = 5,4 · AH = 7,2')
  hinh('HHC003118_lg', [A, B, C, H, M, N, K, I], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, M), seg(H, N), seg(M, N), seg(A, K), seg(C, K), seg(B, K),
    rightAngle(A, B, C, 14), rightAngle(N, C, H, 14), rightAngle(M, B, H, 14), rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(K), dot(I),
    label(A, 'A', 16, 30), label(B, 'B', 16, 30), label(C, 'C', 0, -16), label(H, 'H', 18, -8), label(M, 'M', 0, 34),
    label(N, 'N', -20, 6), label(K, 'K', -20, 6), label(I, 'I', -10, 30)])
}

// HHC003119_lg — △DEF vuông tại D, DE = 5, DF = 12 (ảnh cũ: 12 cm, 5 cm, góc vuông ở D; không ghi EF)
{
  const k = 24, D = P(0, 0), E = P(5 * k, 0), F = P(0, -12 * k)
  ok(gan(dist(E, F) / k, 13, 13), 'EF = 13')
  hinh('HHC003119_lg', [D, E, F, P(-86, 0)], [seg(D, E), seg(D, F), seg(E, F), rightAngle(D, E, F, 14), dot(D), dot(E), dot(F),
    label(D, 'D', -16, 30), label(E, 'E', 16, 30), label(F, 'F', 0, -16),
    num(mid(D, F), '12 cm', -46, 7), num(mid(D, E), '5 cm', 0, 36)])
}

// HHC003122 — flycam A cách mặt cầu AH = 120 m; Bx, Cy vuông góc mặt cầu; ABx = 30°, ACy = 45° (⇒ HB = 40√3, HC = 120)
{
  const k = 2.2, H = P(0, 0), A = P(0, -120 * k), B = P(120 * Math.tan(30 * Math.PI / 180) * k, 0), C = P(120 * k, 0)
  const xt = P(B.x, -127 * k), yt = P(C.x, -127 * k), gx = P(-60, 0), gy = P(C.x + 30, 0)
  ok(Math.abs(goc(B, A, xt) - 30) < 0.5 && Math.abs(goc(C, A, yt) - 45) < 0.5, 'ABx = 30°, ACy = 45°')
  hinh('HHC003122', [A, B, C, xt, yt, gx, gy, P(-86, -120 * k / 2)], [seg(gx, gy), seg(A, H), seg(A, B), seg(A, C), seg(B, xt), seg(C, yt),
    rightAngle(H, A, B, 14), rightAngle(B, xt, gy, 14), rightAngle(C, yt, gy, 14),
    angleMark(B, A, xt, 56), angleMark(C, A, yt, 60), angleText(B, A, xt, '30°', 90), angleText(C, A, yt, '45°', 100),
    dot(A), dot(H), dot(B), dot(C),
    label(A, 'A', -22, 8), label(H, 'H', 0, 34), label(B, 'B', 0, 34), label(C, 'C', 0, 34),
    label(xt, 'x', 16, 10), label(yt, 'y', 16, 10),
    num(mid(A, H), '120 m', -52, 7)])
}

await xuatTat(RA)
