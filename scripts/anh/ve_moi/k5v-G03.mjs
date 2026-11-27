// k5v-G03 — vẽ lại 10 hình kho Đại K5 (góc / vuông góc / song song). Chạy: node k5v-G03.mjs "<gói>\moi"
import { P, seg, dot, label, T, goc, dist, vec, rightAngle, poly, fill } from '../ve_hinh_lib.mjs'
import { ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const ok = (c, m) => { if (!c) throw new Error('KIỂM LỖI: ' + m) }
const near = (a, b, e = 0.5) => Math.abs(a - b) < e
const L = (a, b) => seg(a, b)
const dotp = (v, p, q) => (p.x - v.x) * (q.x - v.x) + (p.y - v.y) * (q.y - v.y)
// khung: tính từ các điểm + lề
function khung(pts, { l = 40, r = 40, t = 40, b = 40 } = {}) {
  const x0 = Math.min(...pts.map((p) => p.x)) - l, y0 = Math.min(...pts.map((p) => p.y)) - t
  const W = Math.ceil(Math.max(...pts.map((p) => p.x)) - x0 + r), H = Math.ceil(Math.max(...pts.map((p) => p.y)) - y0 + b)
  return { x0, y0, W, H }
}
async function xuat(ma, pts, body, lề) {
  const k = khung(pts, lề)
  await ra(OUT, ma, k.W, k.H, T(-k.x0, -k.y0, body))
}
const arrow = (a, b, s = 12) => {   // đầu mũi tên tại b
  const d = vec(a, b), n = Math.hypot(d.x, d.y), u = { x: d.x / n, y: d.y / n }
  const p1 = P(b.x - u.x * s - u.y * s * 0.4, b.y - u.y * s + u.x * s * 0.4), p2 = P(b.x - u.x * s + u.y * s * 0.4, b.y - u.y * s - u.x * s * 0.4)
  return `<path d="M ${b.x} ${b.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z" fill="#222" stroke="#222"/>`
}
const bc = []

// ── 012: tam giác GHK vuông tại G, GI ⟂ HK (I ∈ HK) ──
{
  const H = P(0, 150), K = P(305, 150), I = P(125, 150), G = P(125, 0)
  ok(near(dotp(G, H, K), 0, 1e-6), 'G vuông')
  ok(near(dotp(I, G, K), 0, 1e-6), 'GI ⟂ HK')
  ok(near(goc(G, H, I) + goc(G, I, K), 90, 1e-6), 'HGI+IGK=90')
  ok(goc(H, G, K) < 90 && goc(K, G, H) < 90, 'H,K nhọn')
  ok(Math.abs(dist(H, I) - dist(I, K)) > 30, 'không cân')
  const body = L(G, H) + L(G, K) + L(H, K) + L(G, I)
    + rightAngle(G, H, K, 16) + rightAngle(I, G, K, 14)
    + label(G, 'G', 0, -14) + label(H, 'H', -18, 8) + label(K, 'K', 18, 8) + label(I, 'I', 0, 32)
  await xuat('T105100102012', [G, H, K, I, P(125, -30), P(125, 185)], body)
  bc.push({ ma_cau: 'T105100102012', ghi_chu: 'Tam giác GHK vuông tại G, GI ⟂ HK; ô vuông ở G và ở I (phía IK) như ảnh cũ. Ảnh cũ là tam giác vuông cân, hình mới vẽ lệch (HI=125, IK=180) — số góc không đổi (3 vuông, 4 nhọn, 1 bẹt).' })
}

// ── 013: hình chữ nhật ABED + tam giác vuông BEC (C ∈ tia DE) ──
{
  const A = P(0, 0), B = P(263, 0), D = P(0, 178), E = P(263, 178), C = P(345, 178)
  ok(near(dotp(A, B, D), 0), 'A vuông'); ok(near(dotp(E, B, C), 0), 'E vuông')
  ok(goc(B, E, C) < 90 && goc(C, B, E) < 90, 'B,C nhọn')
  const body = L(A, B) + L(A, D) + L(D, C) + L(B, E) + L(B, C)
    + label(A, 'A', -4, -14) + label(B, 'B', 4, -14) + label(D, 'D', -4, 34) + label(E, 'E', 0, 34) + label(C, 'C', 14, 34)
  await xuat('T105100102013', [A, B, C, D, E], body)
  bc.push({ ma_cau: 'T105100102013', ghi_chu: 'Hình chữ nhật ABED + tam giác BEC vuông tại E, C nằm trên đường DE; không ký hiệu (ảnh cũ không có).' })
}

// ── 014: ngũ giác ABCDE (nhà) : A,E vuông, B,D tù, C nhọn ──
{
  const A = P(0, 0), B = P(250, 0), C = P(347, 86), D = P(250, 173), E = P(0, 173)
  ok(near(goc(A, B, E), 90) && near(goc(E, A, D), 90), 'A,E vuông')
  ok(goc(B, A, C) > 90 && goc(D, C, E) > 90, 'B,D tù')
  ok(goc(C, B, D) < 90, 'C nhọn')
  const body = poly([A, B, C, D, E])
    + label(A, 'A', -4, -14) + label(B, 'B', 0, -14) + label(C, 'C', 22, 9) + label(D, 'D', 0, 36) + label(E, 'E', -4, 36)
  await xuat('T105100102014', [A, B, C, D, E], body)
  bc.push({ ma_cau: 'T105100102014', ghi_chu: 'Ngũ giác ABCDE theo ảnh cũ: A,E vuông; B,D tù (~138°); C nhọn (~83°).' })
}

// ── 015: đường thẳng XY, tia OS ⟂ XY, tia OT (XOT=40°, TOS=50°) ──
{
  const O = P(180, 200), X = P(0, 200), Y = P(360, 200), S = P(180, 20)
  const T_ = P(O.x - 175 * Math.cos(40 * Math.PI / 180), O.y - 175 * Math.sin(40 * Math.PI / 180))
  ok(near(goc(O, X, T_), 40, 1e-6) && near(goc(O, T_, S), 50, 1e-6), 'XOT=40, TOS=50')
  const body = L(X, Y) + L(O, S) + L(O, T_) + arrow(O, X) + arrow(O, Y) + arrow(O, S) + arrow(O, T_) + dot(O)
    + label(X, 'X', 2, 32) + label(Y, 'Y', 0, 32) + label(O, 'O', 0, 32) + label(S, 'S', 0, -12) + label(T_, 'T', -18, -4)
  await xuat('T105100102015', [X, Y, S, T_, P(180, 235)], body)
  bc.push({ ma_cau: 'T105100102015', ghi_chu: 'Đường thẳng XY, tia OS vuông góc XY, tia OT (XOT=40°, TOS=50°); mũi tên đầu tia như ảnh cũ; không ô vuông (ảnh cũ không có).' })
}

// ── 016: tứ giác TKIH (T,I,K nhọn; H tù) ──
{
  const Tt = P(0, 270), K = P(368, 270), I = P(323, 0), H = P(114, 77)
  ok(goc(Tt, H, K) < 90 && goc(I, H, K) < 90 && goc(K, I, Tt) < 90, 'T,I,K nhọn')
  ok(goc(H, Tt, I) > 90, 'H tù')
  const body = poly([Tt, H, I, K]) + [Tt, H, I, K].map(dot).join('')
    + label(Tt, 'T', -20, 8) + label(H, 'H', -20, 4) + label(I, 'I', 18, 4) + label(K, 'K', 20, 8)
  await xuat('T105100102016', [Tt, H, I, K], body)
  bc.push({ ma_cau: 'T105100102016', ghi_chu: 'Tứ giác T-H-I-K theo ảnh cũ: góc T, I, K nhọn, góc H tù; có chấm ở đỉnh như ảnh cũ.' })
}

// ── 017: tam giác nhọn MNP (M trên, NP ngang) ──
{
  const M = P(110, 0), N = P(0, 200), Pp = P(290, 200)
  ok(goc(M, N, Pp) < 90 && goc(N, M, Pp) < 90 && goc(Pp, M, N) < 90, 'nhọn')
  const a = dist(M, N), b = dist(M, Pp), c = dist(N, Pp)
  ok(Math.abs(a - b) > 20 && Math.abs(b - c) > 15 && Math.abs(a - c) > 40, 'lệch')
  const body = poly([M, N, Pp]) + [M, N, Pp].map(dot).join('')
    + label(M, 'M', 0, -14) + label(N, 'N', -20, 8) + label(Pp, 'P', 20, 8)
  await xuat('T105100102017', [M, N, Pp], body, { b: 50 })
  bc.push({ ma_cau: 'T105100102017', ghi_chu: 'Tam giác MNP nhọn, vẽ lệch (M=71°, N=61°, P=48°). Ảnh cũ để MP nằm ngang phía trên, N phía dưới; theo quy chuẩn 23/11 (đỉnh trên, đáy ngang) hình mới đặt M trên, NP ngang — chỉ xoay, số liệu không đổi.' })
}

// ── 018: hình chữ nhật DEHG, PQ ⟂ DE,GH (P ∈ DE, Q ∈ GH) ──
{
  const D = P(0, 0), E = P(340, 0), G = P(0, 200), H = P(340, 200), Pp = P(242, 0), Q = P(242, 200)
  const body = L(D, E) + L(D, G) + L(G, H) + L(E, H) + L(Pp, Q)
    + rightAngle(Pp, E, Q, 14) + rightAngle(Q, H, Pp, 14)
    + label(D, 'D', -16, -4) + label(E, 'E', 18, -4) + label(Pp, 'P', 0, -14) + label(G, 'G', -16, 20) + label(H, 'H', 18, 20) + label(Q, 'Q', 0, 34)
  await xuat('T105100102018', [D, E, G, H, P(0, 235)], body)
  bc.push({ ma_cau: 'T105100102018', ghi_chu: 'Hình chữ nhật DEHG, đoạn PQ nối P∈DE, Q∈GH vuông góc; ô vuông tại P và Q (phía E, H) giữ như ảnh cũ. Lưu ý: hai ô vuông này nằm sẵn trong ảnh cũ nên có thể gợi một phần đáp án — nếu Thùy muốn tuyệt đối không gợi thì bỏ.' })
}

// ── 019: hình thang vuông MNPQ, tô xám như ảnh cũ ──
{
  const M = P(0, 0), N = P(190, 0), Pp = P(250, 190), Q = P(0, 190)
  ok(near(N.y, M.y) && near(Pp.y, Q.y) && near(M.x, Q.x), 'MN∥QP, MQ đứng')
  ok(N.x - M.x !== Pp.x - Q.x, 'không phải hình chữ nhật')
  const body = fill([M, N, Pp, Q], '#e4e4e4') + poly([M, N, Pp, Q])
    + label(M, 'M', -18, -4) + label(N, 'N', 18, -4) + label(Q, 'Q', -18, 20) + label(Pp, 'P', 20, 20)
  await xuat('T105100102019', [M, N, Pp, Q], body)
  bc.push({ ma_cau: 'T105100102019', ghi_chu: 'Hình thang vuông MNPQ (MQ đứng, MN∥QP, NP xiên), tô xám nhạt thay màu vàng ảnh cũ; không ô vuông / ký hiệu (các ý a–d chính là điều phải đoán).' })
}

// ── 020: hình thang MNPQ có đường chéo QN (ảnh cũ tô xanh lá → tô xám nhạt) ──
{
  const M = P(95, 0), N = P(200, 0), Pp = P(272, 195), Q = P(0, 195)
  ok(near(M.y, N.y) && near(Pp.y, Q.y), 'MN∥QP')
  ok(Math.abs((M.x - Q.x) - (Pp.x - N.x)) > 10, 'không cân')
  const body = fill([M, N, Pp, Q], '#e4e4e4') + poly([M, N, Pp, Q]) + L(Q, N)
    + label(M, 'M', -4, -14) + label(N, 'N', 6, -14) + label(Q, 'Q', -20, 20) + label(Pp, 'P', 20, 20)
  await xuat('T105100102020', [M, N, Pp, Q], body)
  bc.push({ ma_cau: 'T105100102020', ghi_chu: 'Hình thang MNPQ (đáy MN ngắn trên, QP dài dưới, không cân) có đường chéo QN như ảnh cũ; tô xám nhạt thay màu xanh. Ảnh cũ là tệp SVG nhúng ảnh JPEG — đã trích ra xem.' })
}

// ── 021: tam giác ABC nhọn + 4 hàng chấm hai bên (hàng trên cao hơn A) ──
{
  const A = P(284, 40), B = P(187, 236), C = P(460, 236)
  ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, 'nhọn')
  ok(Math.abs(dist(A, B) - dist(A, C)) > 20, 'lệch')
  const ys = [23, 80, 137, 194]
  ok(ys[0] < A.y && ys[1] > A.y && ys[3] < B.y, 'hàng 1 cao hơn A; hàng 2–4 giữa A và BC')
  let body = poly([A, B, C])
    + label(A, 'A', 0, -14) + label(B, 'B', -20, 22) + label(C, 'C', 20, 22)
  const xs = [32, 616]
  for (const y of ys) for (const x of xs) body += dot(P(x, y))
  await xuat('T105100102021', [P(10, 0), P(640, 265)], body, { l: 0, r: 0, t: 0, b: 0 })
  bc.push({ ma_cau: 'T105100102021', ghi_chu: 'Tam giác ABC nhọn (A trên, BC ngang), 4 hàng chấm trái–phải cùng độ cao như ảnh cũ: hàng 1 cao hơn A, hàng 2–4 nằm giữa A và BC. Ảnh cũ là tệp SVG nhúng JPEG (đã trích xem); ảnh cũ gần cân, hình mới vẽ lệch. Chấm cyan → chấm đen. Chưa nối cặp chấm nào (HS tự nối).' })
}

baoCao(OUT, bc, [])
