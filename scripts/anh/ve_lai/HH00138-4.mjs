// Vẽ lại hình — gói HH00138-4 (Ôn thi giữa kì I, Hình học 7). Luồng vẽ lại hình (Thùy 13/10).
//   node scripts/anh/ve_lai/HH00138-4.mjs [<thu_muc_ra>]
// Quy ước: dựng điểm bằng số đo CỦA ĐỀ (ray/rot/inter/lerp…), không chép toạ độ ước mắt từ ảnh cũ.
import { P, seg, tick, angleMark, rightAngle, ray, rot, inter, lerp, goc, dist, dot, label, num, bien, angleText, angleBien, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00138-4/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, `${ten}: ${v} ≠ ${e}`)

// HHC002827 — cd ⊥ mn tại C; ab ∥ cd (hình đề không ghi song song, nhưng 45° + 135° đúng số đo ⇒ ab ∥ cd); xy cắt ab tại A, cd tại B
{
  const C = P(0, 0), B = P(250, 0), A = ray(B, 135, 148.5)            // góc xBc = 45° ⇒ BA hợp BC 45°
  const c = P(-40, 0), d = P(310, 0), a = P(-40, A.y), b = P(310, A.y)
  const m = P(0, A.y - 60), n = P(0, 75)
  const x = ray(B, 135, 233.3), y = ray(B, -45, 85)
  ok(goc(B, C, A), 45, 'xBc'); ok(goc(A, a, y), 135, 'aAy')
  hinh('HHC002827', [c, d, a, b, m, n, x, y], [
    seg(c, d), seg(a, b), seg(m, n), seg(x, y), rightAngle(C, d, n),
    dot(A), dot(B), dot(C),
    angleText(A, a, y, '135°', 50), angleText(B, C, A, '45°', 64),
    label(A, 'A', 24, -10), label(B, 'B', 24, -10), label(C, 'C', 24, -10),
    label(m, 'm', 20, 8), label(n, 'n', 20, 8), label(a, 'a', -16, 8), label(b, 'b', 18, 8),
    label(c, 'c', -16, 8), label(d, 'd', 18, 8), label(x, 'x', -14, -2), label(y, 'y', 18, 20)])
}

// HHC002808 — AB = AC, MB = MC (cùng ký hiệu thì bằng nhau); M nằm trong tam giác, nối MA, MB, MC
{
  const A = P(0, 0), B = P(-95, 210), C = P(95, 210), M = P(0, 100)
  ok(dist(A, B), dist(A, C), 'AB=AC'); ok(dist(M, B), dist(M, C), 'MB=MC')
  hinh('HHC002808', [A, B, C, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(M, B), seg(M, C),
    tick(A, B, 2), tick(A, C, 2), tick(M, B, 1), tick(M, C, 1),
    dot(A), dot(B), dot(C), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 20, 8), label(M, 'M', 0, 38)])
}

// HHC002828 — Ox, Oy đối nhau; Oz phía trên; yOz = 50°; đánh dấu "?" ở góc xOz
{
  const O = P(0, 0), x = P(-150, 0), y = P(150, 0), z = ray(O, 50, 170)
  ok(goc(O, y, z), 50, 'yOz')
  hinh('HHC002828', [x, y, z, O], [
    seg(x, y), seg(O, z), dot(O),
    angleText(O, y, z, '50°', 76), angleBien(O, x, z, '?', 62, 28),
    label(x, 'x', 0, 32), label(O, 'O', 0, 32), label(y, 'y', 0, 32), label(z, 'z', -16, 0)])
}

// HHC002829 — hình chữ nhật ABCD, hai đường chéo AC, BD cắt nhau tại O
{
  const A = P(0, 0), B = P(300, 0), C = P(300, 170), D = P(0, 170), O = inter(A, C, B, D)
  hinh('HHC002829', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -18, -6), label(B, 'B', 18, -6), label(C, 'C', 18, 28), label(D, 'D', -18, 28), label(O, 'O', 0, 36)])
}

// HHC002830 — Oz là phân giác xOy, xOz = 32° ⇒ xOy = 64°: Oy ở 0°, Oz ở 32°, Ox ở 64°
{
  const O = P(0, 0), y = ray(O, 0, 220), z = ray(O, 32, 220), x = ray(O, 64, 220)
  ok(goc(O, x, z), 32, 'xOz'); ok(goc(O, z, y), 32, 'zOy')
  hinh('HHC002830', [O, x, y, z], [
    seg(O, x), seg(O, y), seg(O, z), dot(O),
    angleMark(O, x, z, 34), angleMark(O, z, y, 46),
    angleText(O, x, z, '32°', 98),
    label(O, 'O', -4, 32), label(x, 'x', -16, -2), label(y, 'y', 0, 32), label(z, 'z', 0, -14)])
}

// HHC002831 — AB ∥ CD; ABD = 70°, BCD = 75°; x = DBC, y = BDC. Giải: y = 70°, x = 35° ⇒ dựng theo giá trị thật (định lý sin)
{
  const D = P(0, 0), C = P(170, 0)
  const BD = 170 * Math.sin(75 * Math.PI / 180) / Math.sin(35 * Math.PI / 180)
  const B = ray(D, 70, BD), A = P(B.x - 150, B.y)                        // A cùng hàng ngang với B ⇒ AB ∥ CD
  ok(goc(B, A, D), 70, 'ABD'); ok(goc(C, D, B), 75, 'BCD')       // goc(đỉnh, p, q)
  ok(goc(D, B, C), 70, 'y = BDC'); ok(goc(B, D, C), 35, 'x = DBC')
  hinh('HHC002831', [A, B, C, D], [
    seg(A, B), seg(B, D), seg(B, C), seg(D, C), dot(A), dot(B), dot(C), dot(D),
    angleText(B, A, D, '70°', 62), angleBien(B, D, C, 'x', 100), angleBien(D, B, C, 'y', 50), angleText(C, D, B, '75°', 66),
    label(A, 'A', -4, -16), label(B, 'B', 18, -12), label(C, 'C', 18, 26), label(D, 'D', -18, 26)])
}

// số góc đánh số (1, 2) — chữ nghiêng cỡ nhỏ
const nho = (p, t) => `<text x="${p.x.toFixed(1)}" y="${(p.y + 7).toFixed(1)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-style="italic" font-size="20">${t}</text>`

// HHC002832 — a ⊥ d, b ⊥ d; ACD = 70°, DEF = 110° (⇒ a ∥ b ∥ c). e cắt a, b, c tại C, D, E
{
  const A = P(0, 0), B = P(0, 95), F = P(0, 190)
  const t = Math.tan(70 * Math.PI / 180), xe = (y) => 235 - y / t        // đường e hợp a góc 70° (ACD = 70°)
  const C = P(xe(0), 0), D = P(xe(95), 95), E = P(xe(190), 190)
  const eTop = P(xe(-40), -40), eBot = P(xe(215), 215)
  const dTop = P(0, -40), dBot = P(0, 215), aL = P(-70, 0), aR = P(290, 0), bL = P(-70, 95), bR = P(290, 95), cL = P(-70, 190), cR = P(290, 190)
  ok(goc(C, A, D), 70, 'ACD'); ok(goc(E, D, F), 110, 'DEF'); ok(goc(D, B, C), 110, 'D1')
  // vị trí số 1, 2 quanh D
  const b1 = ray(D, 128, 34), b2 = ray(D, 40, 34)
  hinh('HHC002832', [dTop, dBot, aL, aR, bL, bR, cL, cR, eTop, eBot], [
    seg(dTop, dBot), seg(aL, aR), seg(bL, bR), seg(cL, cR), seg(eTop, eBot),
    rightAngle(A, P(0, -50), P(50, 0), 20), rightAngle(B, P(0, 25), P(50, 95), 20),
    angleMark(C, A, D, 30), angleMark(E, D, F, 26, 2),
    dot(A), dot(B), dot(F), dot(C), dot(D), dot(E),
    angleText(C, A, D, '70°', 54), angleText(E, D, F, '110°', 62),
    nho(b1, '1'), nho(b2, '2'),
    label(dTop, 'd', 20, 8), label(aR, 'a', 20, 0), label(bR, 'b', 20, 0), label(cR, 'c', 20, 0), label(eTop, 'e', -20, 6),
    label(A, 'A', -20, 26), label(B, 'B', -20, 26), label(F, 'F', -20, 26),
    label(C, 'C', 24, 28), label(D, 'D', 24, 28), label(E, 'E', 24, 28)])
}

// HHC002833 — A, B, C thẳng hàng; AH, BE; BAH và CBE là cặp góc đồng vị (ảnh cũ: AH ∥ BE, H–E–C thẳng hàng, mỗi góc một cung)
{
  const A = P(0, 0), B = P(105, 0), C = P(310, 0)
  const H = ray(A, -30, 142), E = inter(B, P(B.x + (H.x - A.x), B.y + (H.y - A.y)), H, C)
  ok(goc(A, B, H), 30, 'BAH'); ok(goc(B, C, E), 30, 'CBE')
  hinh('HHC002833', [A, B, C, H, E], [
    seg(A, C), seg(A, H), seg(B, E), seg(H, C),
    angleMark(A, B, H, 34), angleMark(B, C, E, 34),
    dot(A), dot(B), dot(C), dot(H), dot(E),
    label(A, 'A', -20, 4), label(B, 'B', 0, -14), label(C, 'C', 22, 4), label(H, 'H', 0, 36), label(E, 'E', 12, 34)])
}

await xuatTat(RA)
