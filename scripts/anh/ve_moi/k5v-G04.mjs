// k5v-G04.mjs — Toán 5, "Diện tích các hình": vẽ lại 10 hình (hình bình hành / hình thoi / góc nhọn / đường cao trên lưới).
//   node scripts/anh/ve_moi/k5v-G04.mjs "<thư mục gói>\moi"
import { P, seg, dot, label, num, hinh, xuatTat, lerp, mid, dist, goc, sideText } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G04.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b, e = 0.6) => Math.abs(a - b) < e
const par = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const T_ = (p, t) => label(p, t, 0, -12)      // nhãn phía trên
const B_ = (p, t) => label(p, t, 0, 28)       // nhãn phía dưới
const L_ = (p, t) => label(p, t, -20, 9)
const R_ = (p, t) => label(p, t, 20, 9)

// ─── hình bình hành: top-left A, top-right B, bottom-right C, bottom-left D (cùng bộ tỉ lệ với ảnh cũ) ───
function hbh(sc) { // sc: hệ số so với ảnh 1774-wide
  const H = 600 * sc, ab = 1014 * sc, off = 416 * sc
  const D = P(0, H), C = P(ab, H), A = P(off, 0), B = P(off + ab, 0)
  return { A, B, C, D }
}
// 023 và 029: hình bình hành ABCD không ký hiệu gì thêm
for (const ten of ['T105100102023', 'T105100102029']) {
  const { A, B, C, D } = hbh(0.3)
  ok(ten + ' AB ∥ DC', par(A, B, D, C)); ok(ten + ' AD ∥ BC', par(A, D, B, C))
  ok(ten + ' không thoi / không chữ nhật', !eq(dist(A, B), dist(A, D), 5) && Math.abs(goc(A, B, D) - 90) > 10)
  hinh(ten, [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -14, -12), label(B, 'B', 14, -12), label(C, 'C', 14, 28), label(D, 'D', -14, 28)], { pad: 36 })
}

// 026 / 027 / 028: hình bình hành chia đôi bởi đoạn song song cạnh bên; (tên: top-trái, trên giữa, top-phải, dưới-trái, dưới giữa, dưới-phải)
function chia(ten, [a, m, b, d, n, c]) {
  const D = P(0, 191), C = P(320, 191), A = P(130, 0), B = P(450, 0)
  const M = lerp(A, B, 0.5), N = lerp(D, C, 0.5)
  ok(ten + ' MN ∥ AD ∥ BC', par(M, N, A, D) && par(M, N, B, C))
  ok(ten + ' M∈AB, N∈DC', eq(M.y, A.y) && eq(N.y, D.y))
  ok(ten + ' ABCD không đặc biệt', !eq(dist(A, B), dist(A, D), 5) && Math.abs(goc(A, B, D) - 90) > 10)
  hinh(ten, [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, N),
    dot(A), dot(M), dot(B), dot(C), dot(N), dot(D),
    label(A, a, -4, -14), label(M, m, 0, -14), label(B, b, 8, -14), label(D, d, -10, 30), label(N, n, 0, 30), label(C, c, 10, 30)], { pad: 36 })
}
chia('T105100102026', ['A', 'M', 'B', 'D', 'N', 'C'])
chia('T105100102027', ['E', 'I', 'F', 'H', 'K', 'G'])
chia('T105100102028', ['P', 'U', 'Q', 'S', 'V', 'R'])

// 022: hình bình hành ACEG, H trung điểm AG, D trung điểm CE, B∈AC, F∈GE sao cho BDFH là hình thoi (B, F ở giữa theo phương ngang)
{
  const G = P(0, 210), E = P(320, 210), A = P(146, 0), C = P(466, 0)
  const H = mid(A, G), D = mid(C, E)
  const B = P(mid(H, D).x, 0), F = P(mid(H, D).x, 210)
  ok('022 ACEG là hình bình hành', par(A, C, G, E) && par(A, G, C, E))
  ok('022 HD ∥ AC, HD = AC', par(H, D, A, C) && eq(dist(H, D), dist(A, C)))
  ok('022 BDFH là hình thoi', eq(dist(B, D), dist(D, F)) && eq(dist(D, F), dist(F, H)) && eq(dist(F, H), dist(H, B)))
  ok('022 B ∈ AC, F ∈ GE', B.x > A.x && B.x < C.x && F.x > G.x && F.x < E.x)
  ok('022 BDFH không phải hình vuông', Math.abs(dist(B, F) - dist(H, D)) > 20)
  hinh('T105100102022', [A, C, G, E], [seg(A, C), seg(C, E), seg(E, G), seg(G, A), seg(B, D), seg(D, F), seg(F, H), seg(H, B), seg(H, D),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H),
    label(A, 'A', 0, -14), label(B, 'B', 0, -14), label(C, 'C', 4, -14), label(H, 'H', -20, 9), label(D, 'D', 22, 9),
    label(G, 'G', -8, 30), label(F, 'F', 0, 30), label(E, 'E', 8, 30)], { pad: 40 })
}

// 024: hình thoi ABCD, O giao hai đường chéo; AB = 10, AO = 8, OD = 6 (cm), tỉ lệ 24 px / cm
{
  const k = 24, O = P(0, 0)
  const A = P(-8 * k, 0), C = P(8 * k, 0), B = P(0, -6 * k), D = P(0, 6 * k)
  ok('024 AB = 10 cm (AO=8, BO=6, 3-4-5)', eq(dist(A, B), 10 * k) && eq(dist(B, C), 10 * k) && eq(dist(C, D), 10 * k) && eq(dist(D, A), 10 * k))
  ok('024 AO = 8 cm, OD = 6 cm', eq(dist(A, O), 8 * k) && eq(dist(O, D), 6 * k))
  hinh('T105100102024', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -20, 9), label(C, 'C', 20, 9), label(B, 'B', 0, -14), label(D, 'D', 0, 30), label(O, 'O', 17, -9),
    sideText(A, B, '10 cm', O, 30), sideText(A, O, '8 cm', B, 24), sideText(O, D, '6 cm', A, 36)], { pad: 40 })
}

// 025: hình thoi ABCD, O giao hai đường chéo (không số đo, không ký hiệu)
{
  const s = 1.2, O = P(0, 0)
  const A = P(-172 * s, 0), C = P(172 * s, 0), B = P(0, -72 * s), D = P(0, 72 * s)
  ok('025 bốn cạnh bằng nhau', eq(dist(A, B), dist(B, C)) && eq(dist(B, C), dist(C, D)) && eq(dist(C, D), dist(D, A)))
  ok('025 không phải hình vuông', Math.abs(dist(A, C) - dist(B, D)) > 50)
  ok('025 OA ≠ OB', Math.abs(dist(O, A) - dist(O, B)) > 50)
  hinh('T105100102025', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -20, 9), label(C, 'C', 20, 9), label(B, 'B', 0, -14), label(D, 'D', 0, 30), label(O, 'O', 17, -9)], { pad: 40 })
}

// T105110104001: hình chữ nhật chia bởi đường chéo TL–BR và đoạn TR–D (D ∈ đường chéo). Ảnh cũ không có nhãn.
{
  const W = 380, H = 152, t = 0.659
  const TL = P(0, 0), TR = P(W, 0), BR = P(W, H), BL = P(0, H), D = P(W * t, H * t)
  ok('001 tỉ lệ ≈ 2,5:1 như ảnh cũ', eq(W / H, 2.5, 0.03))
  ok('001 D ∈ đường chéo TL–BR', Math.abs((BR.x - TL.x) * (D.y - TL.y) - (BR.y - TL.y) * (D.x - TL.x)) < 1e-6)
  // đếm góc nhọn: ở mỗi đỉnh, các góc giữa hai tia kề nhau trong hình (không tính góc tạo bởi hai tia xa nhau gồm nhiều góc nhỏ)
  const at = (v, rays) => { // rays theo thứ tự quay; đếm góc giữa các cặp tia KỀ NHAU
    let n = 0; for (let i = 0; i + 1 < rays.length; i++) { const g = goc(v, rays[i], rays[i + 1]); if (g < 89.9) n++ }; return n
  }
  const nhon = at(TL, [TR, BR, BL]) + at(TR, [TL, D, BR]) + at(BR, [TR, TL, BL]) + at(D, [TL, TR, BR]) /* quanh D: TL-D-TR, TR-D-BR */ + at(BL, [TL, BR])
  ok('001 tổng 7 góc nhọn (2+2+2+1+0)', nhon === 7)
  hinh('T105110104001', [TL, TR, BR, BL], [seg(TL, TR), seg(TR, BR), seg(BR, BL), seg(BL, TL), seg(TL, BR), seg(TR, D)], { pad: 36, padDuoi: 36 })
}

// T105000000649: ba tam giác trên lưới ô vuông (ABC, DEG, HIK), đáy BC, EG, IK nằm ngang
{
  const c = 32, COLS = 19, ROWS = 6
  const X = (i) => i * c, Y = (j) => j * c // j tính từ trên xuống; đáy ở hàng 5
  // ô: B(1,5) C(5,5) A(2,1); E(10,5) G(13,5) D(8,1); I(16,5) K(18,5) H(16,1)
  const Bp = P(X(1), Y(5)), Cp = P(X(5), Y(5)), Ap = P(X(2), Y(1))
  const Ep = P(X(10), Y(5)), Gp = P(X(13), Y(5)), Dp = P(X(8), Y(1))
  const Ip = P(X(16), Y(5)), Kp = P(X(18), Y(5)), Hp = P(X(16), Y(1))
  ok('649 BC = 4 ô, A cao 4 ô, A lệch 1 ô so với B (nhọn)', Cp.x - Bp.x === 4 * c && Bp.y - Ap.y === 4 * c && Ap.x > Bp.x && Ap.x < Cp.x)
  ok('649 DEG: EG = 3 ô, D lệch ra ngoài đoạn EG (tù tại E)', Gp.x - Ep.x === 3 * c && Dp.x < Ep.x && goc(Ep, Dp, Gp) > 90)
  ok('649 HIK: vuông tại I, IK = 2 ô, HI = 4 ô', eq(goc(Ip, Hp, Kp), 90, 0.01) && Kp.x - Ip.x === 2 * c && Ip.y - Hp.y === 4 * c)
  let grid = ''
  for (let i = 0; i <= COLS; i++) grid += `<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${Y(ROWS)}" stroke="#c9ced6" stroke-width="1"/>`
  for (let j = 0; j <= ROWS; j++) grid += `<line x1="0" y1="${Y(j)}" x2="${X(COLS)}" y2="${Y(j)}" stroke="#c9ced6" stroke-width="1"/>`
  const tam = (a, b, cc) => [seg(a, b), seg(b, cc), seg(cc, a)]
  hinh('T105000000649', [P(0, 0), P(X(COLS), Y(ROWS))], [grid, ...tam(Ap, Bp, Cp), ...tam(Dp, Ep, Gp), ...tam(Hp, Ip, Kp),
    dot(Ap), dot(Bp), dot(Cp), dot(Dp), dot(Ep), dot(Gp), dot(Hp), dot(Ip), dot(Kp),
    label(Ap, 'A', -4, -12), label(Bp, 'B', -16, 22), label(Cp, 'C', 18, 22),
    label(Dp, 'D', -4, -12), label(Ep, 'E', -4, 26), label(Gp, 'G', 18, 22),
    label(Hp, 'H', -4, -12), label(Ip, 'I', -16, 22), label(Kp, 'K', 18, 22)], { pad: 8, padDuoi: 8 })
}
await xuatTat(dir)
