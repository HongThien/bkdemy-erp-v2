// k5v-G11.mjs — vẽ lại 10 hình K5 "Diện tích hình tam giác" (gói G11).
//   node scripts/anh/ve_moi/k5v-G11.mjs "<thư mục gói>\moi"
import { writeFileSync } from 'node:fs'
import { P, seg, dot, label, num, rightAngle, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G11.mjs <thu_muc_moi>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } }
const near = (a, b, e = 0.6) => Math.abs(a - b) < e
const area = (pts) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p.x * q.y - q.x * p.y }, 0)) / 2
const pg = (pts, fillc, sw = 2) => `<path d="M ${pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')} Z" fill="${fillc}" stroke="#222" stroke-width="${sw}" stroke-linejoin="round"/>`
const SIZE = 22
// đường kích thước nằm ngang (có hai gạch đầu) tại y, từ x1 đến x2
const dimH = (x1, x2, y) => `${seg(P(x1, y), P(x2, y))}${seg(P(x1, y - 5), P(x1, y + 5))}${seg(P(x2, y - 5), P(x2, y + 5))}`

// ───────── T105000000712: hình vuông ABCD 6,5 cm, E G H K trên DC cách nhau 1,3 cm ─────────
{
  const k = 36, S = 6.5 * k
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const px = (i) => P(i * 1.3 * k, S)
  const [E, G, H, K] = [1, 2, 3, 4].map(px)
  ok('712 DE=EG=GH=HK=KC=1,3', near(E.x - D.x, 46.8) && near(G.x - E.x, 46.8) && near(H.x - G.x, 46.8) && near(K.x - H.x, 46.8) && near(C.x - K.x, 46.8))
  ok('712 DC = 5 × 1,3 = 6,5', near(C.x - D.x, 5 * 1.3 * k))
  const body = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, E), seg(A, G), seg(A, H), seg(A, K),
    label(A, 'A', -16, -8), label(B, 'B', 16, -8), label(D, 'D', -2, 28), label(E, 'E', 0, 28), label(G, 'G', 0, 28), label(H, 'H', 0, 28), label(K, 'K', 0, 28), label(C, 'C', 0, 28),
    dimH(D.x, E.x, S + 40), num(P((D.x + E.x) / 2, S + 40), '1,3 cm', 0, 28, 20),
    num(P(S + 44, S / 2), '6,5 cm', 0, 8, SIZE)]
  hinh('T105000000712', [A, B, C, D, P(-20, -30), P(S + 90, S / 2), P(0, S + 75)], body, { pad: 20, padDuoi: 36 })
}

// ───────── T105000000737 / T105000000743: tam giác vuông, hai cạnh góc vuông bằng nhau ─────────
function vuong(ten, canh, kk, don) {
  const L = canh * kk
  const O = P(0, L), T = P(0, 0), R = P(L, L)
  ok(ten + ' hai cạnh góc vuông bằng nhau', near(O.y - T.y, R.x - O.x))
  const body = [seg(T, O), seg(O, R), seg(R, T), rightAngle(O, T, R, 16),
    num(P(-34, L / 2), `${canh} ${don}`, 0, 8, SIZE), num(P(L / 2, L + 34), `${canh} ${don}`, 0, 0, SIZE)]
  hinh(ten, [T, O, R, P(-80, L / 2), P(L / 2, L + 40)], body, { pad: 20, padDuoi: 36 })
}
vuong('T105000000737', 6, 36, 'm')
vuong('T105000000743', 8, 28, 'm')

// ───────── T105000000746: hình chữ nhật MNPQ 20 × 10 cm, nối M với P ─────────
{
  const k = 18
  const M = P(0, 0), N = P(20 * k, 0), Pp = P(20 * k, 10 * k), Q = P(0, 10 * k)
  ok('746 MN=QP=20, MQ=NP=10', near(N.x - M.x, 360) && near(Pp.x - Q.x, 360) && near(Q.y - M.y, 180) && near(Pp.y - N.y, 180))
  const body = [seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M), seg(M, Pp),
    label(M, 'M', -16, -8), label(N, 'N', 16, -8), label(Pp, 'P', 16, 26), label(Q, 'Q', -16, 26),
    num(P(-48, 90), '10 cm', 0, 8, SIZE), num(P(180, 180 + 30), '20 cm', 0, 8, SIZE)]
  hinh('T105000000746', [M, N, Pp, Q, P(-90, 90), P(180, 220), P(0, -40), P(410, 0)], body, { pad: 20, padDuoi: 36 })
}

// ───────── T105000000776: tam giác ABC vuông tại B, AB = 1,6 dm, BC = 3,5 dm ─────────
{
  const k = 80
  const B = P(0, 1.6 * k), A = P(0, 0), C = P(3.5 * k, 1.6 * k)
  ok('776 AB:BC = 1,6:3,5', near((B.y - A.y) / (C.x - B.x), 1.6 / 3.5, 1e-6))
  const body = [seg(A, B), seg(B, C), seg(C, A), rightAngle(B, A, C, 14),
    label(A, 'A', -4, -10), label(B, 'B', -18, 26), label(C, 'C', 16, 26),
    num(P(-52, 64), '1,6 dm', 0, 8, SIZE), num(P(140, 128 + 40), '3,5 dm', 0, 8, SIZE)]
  hinh('T105000000776', [A, B, C, P(-100, 64), P(140, 190), P(0, -40), P(330, 0)], body, { pad: 20, padDuoi: 36 })
}

// ───────── T105000000761: hình chữ nhật ABCD, AD = 3 cm, DH = HI = … = NC = 1,3 cm (7 đoạn) ─────────
{
  const k = 40, W = 7 * 1.3 * k, Hh = 3 * k
  const A = P(0, 0), B = P(W, 0), C = P(W, Hh), D = P(0, Hh)
  const pt = (i) => P(i * 1.3 * k, Hh)
  const [H, I, K, L, M, N] = [1, 2, 3, 4, 5, 6].map(pt)
  ok('761 DC = 7 × 1,3 = 9,1', near(C.x - D.x, 7 * 1.3 * k))
  ok('761 AD = 3', near(D.y - A.y, 3 * k))
  const body = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, H), seg(B, N),
    ...[H, I, K, L, M, N].map(dot),
    label(A, 'A', -16, -8), label(B, 'B', 16, -8), label(D, 'D', -6, 28), label(H, 'H', 0, 28), label(I, 'I', 0, 28), label(K, 'K', 0, 28), label(L, 'L', 0, 28), label(M, 'M', 0, 28), label(N, 'N', 0, 28), label(C, 'C', 6, 28),
    dimH(D.x, H.x, Hh + 40), num(P((D.x + H.x) / 2, Hh + 40), '1,3 cm', 0, 28, 20),
    num(P(-40, Hh / 2), '3 cm', 0, 8, SIZE)]
  hinh('T105000000761', [A, B, C, D, P(-80, Hh / 2), P(0, Hh + 75), P(0, -40), P(W + 40, 0)], body, { pad: 20, padDuoi: 36 })
}

// ───────── lưới ô vuông ─────────
const luoi = (cols, rows, c) => {
  let s = ''
  for (let i = 0; i <= cols; i++) s += `<line x1="${i * c}" y1="0" x2="${i * c}" y2="${rows * c}" stroke="#c9c9d6" stroke-width="1"/>`
  for (let j = 0; j <= rows; j++) s += `<line x1="0" y1="${j * c}" x2="${cols * c}" y2="${j * c}" stroke="#c9c9d6" stroke-width="1"/>`
  return s
}
// ───────── T105000000757: 3 tam giác A, B, C trên lưới (ô 1 cm) ─────────
{
  const c = 33, cols = 21, rows = 8
  const g = (x, y) => P(x * c, y * c)
  const TA = [g(1, 7), g(7, 7), g(2, 3)], TB = [g(9, 7), g(13, 7), g(8, 2)], TC = [g(15, 7), g(18, 7), g(15, 1)]
  const cm2 = (t) => area(t) / (c * c)
  ok('757 A = 12 cm²', near(cm2(TA), 12, 1e-6)); ok('757 B = 10 cm²', near(cm2(TB), 10, 1e-6)); ok('757 C = 9 cm²', near(cm2(TC), 9, 1e-6))
  const body = [luoi(cols, rows, c), pg(TA, '#fdf08f'), pg(TB, '#f8a8d4'), pg(TC, '#7fd0fa'),
    label(g(3.1, 6.05), 'A', 0, 0), label(g(10.05, 6.05), 'B', 0, 0), label(g(15.85, 6.05), 'C', 0, 0),
    seg(g(19, 7), g(20, 7)), '<rect x="'+(19.5*c-30)+'" y="'+(7*c+6)+'" width="60" height="26" fill="#fff" stroke="none"/>', num(g(19.5, 7), '1 cm', 0, 26, 20)]
  hinh('T105000000757', [g(0, 0), g(cols, rows)], body, { pad: 8, padDuoi: 36 })
}
// ───────── T105000000778: tam giác ABC trên lưới (chỉ ABC — đề không nhắc MNP) ─────────
{
  const c = 40, cols = 10, rows = 8
  const g = (x, y) => P(x * c, y * c)
  const B = g(1, 7), C = g(9, 7), A = g(3, 2)
  ok('778 BC = 8 ô, cao = 5 ô', near(C.x - B.x, 8 * c) && near(B.y - A.y, 5 * c))
  ok('778 S = 20 cm²', near(area([A, B, C]) / (c * c), 20, 1e-6))
  const body = [luoi(cols, rows, c), seg(B, C), seg(A, B), seg(A, C),
    label(A, 'A', 0, -12), label(B, 'B', -2, 28), label(C, 'C', 2, 28),
    // thước 1 cm: ô dọc ở hàng cuối bên trái, ô ngang ở dưới lưới
    seg(P(-14, 7 * c), P(-14, 8 * c)), seg(P(-19, 7 * c), P(-9, 7 * c)), seg(P(-19, 8 * c), P(-9, 8 * c)), num(P(-52, 7.5 * c), '1 cm', 0, 7, 20),
    dimH(0, c, rows * c + 16), num(P(c / 2, rows * c + 16), '1 cm', 0, 28, 20)]
  hinh('T105000000778', [g(0, 0), g(cols, rows), P(-90, 7.5 * c), P(c / 2, rows * c + 50)], body, { pad: 8, padDuoi: 36 })
}

// ───────── tangram ─────────
const rotv = (v, deg) => { const t = deg * Math.PI / 180; return P(v.x * Math.cos(t) - v.y * Math.sin(t), v.x * Math.sin(t) + v.y * Math.cos(t)) }
const addp = (a, b) => P(a.x + b.x, a.y + b.y)
const sc = (v, s) => P(v.x * s, v.y * s)
// tam giác vuông cân: đỉnh góc vuông R, cạnh góc vuông len theo hướng u (đơn vị) — v vuông góc (quay +90° trong toạ độ y xuống)
const tamVuong = (R, u, len) => { const v = P(-u.y, u.x); return [R, addp(R, sc(u, len)), addp(R, sc(v, len))] }

// ───── T105000000754: tờ giấy vuông ABCD cạnh 12 cm cắt thành 7 mảnh (Hình 1) và ghép con cá (Hình 2) ─────
{
  const k = 15, r = k / 18.333
  const m = (x, y) => P(x * k, y * k)
  const col = { xanh: '#8fd3f7', tim: '#c2a8e0', luc: '#c6e48b', cam: '#fdc97e', hong: '#f7b0cd', vang: '#fdf08f', nau: '#bdb28f' }
  const A = m(0, 0), B = m(12, 0), C = m(12, 12), D = m(0, 12), O = m(6, 6), M = m(12, 6), N = m(6, 12), Pq = m(9, 3)
  const h1 = [
    [[A, B, O], col.xanh], [[A, D, O], col.tim], [[B, M, Pq], col.luc], [[Pq, M, m(9, 9), O], col.cam],
    [[M, C, N], col.nau], [[O, m(3, 9), m(9, 9)], col.hong], [[D, m(3, 9), m(9, 9), N], col.vang]]
  const tong = h1.reduce((s, [p]) => s + area(p), 0) / (k * k)
  ok('754 tổng diện tích 7 mảnh = 144', near(tong, 144, 1e-6))
  const dt = h1.map(([p]) => area(p) / (k * k))
  ok('754 diện tích mảnh: 36,36,9,18,18,9,18', [36, 36, 9, 18, 18, 9, 18].every((v, i) => near(dt[i], v, 1e-6)))
  ok('754 M, N là trung điểm BC, CD', near(M.y, (B.y + C.y) / 2) && near(N.x, (C.x + D.x) / 2))
  ok('754 tam giác MCN: MC = NC = 6', near(C.y - M.y, 6 * k) && near(C.x - N.x, 6 * k))
  // Hình 2 (toạ độ gốc ở thang 18,333 px/cm, rồi đổi sang k)
  const S3 = Math.SQRT2 * 6 * 18.333 // cạnh góc vuông mảnh lớn... (hyp 12 => cạnh 8,485)
  const lg = 6 * Math.SQRT2 * 18.333, sm = 3 * Math.SQRT2 * 18.333, md = 6 * 18.333
  const uM = rotv(P(1, 0), -14.9) // hướng một cạnh góc vuông của mảnh nâu
  const raw = [
    [[P(715, 190), P(935, 190), P(825, 80)], col.tim],
    [[P(834.4, 80), P(990, 80), P(990, 80 + lg)], col.xanh],
    [[P(995, 80), P(995, 80 + sm), P(995 + sm, 80 + sm)], col.luc],
    [[P(995, 80 + sm + 5), P(995 + sm, 80 + sm + 5), P(995 + sm, 80 + 2 * sm + 5), P(995, 80 + 2 * sm + 5)], col.cam],
    [[P(937, 275), P(937, 275 - sm), P(937 - sm, 275)], col.hong],
    [[P(910, 75), P(910 + sm, 75), P(910, 75 - sm), P(910 - sm, 75 - sm)], col.vang],
    [tamVuong(P(707, 193), rotv(P(-1, 0), 14.7), md), col.nau]]
  // sửa mảnh vàng: bình hành đáy ngắn sm, cạnh xiên 6 cm dịch (-sm,-sm)
  raw[5][0] = [P(910, 75), P(910 + sm, 75), P(910, 75 - sm), P(910 - sm, 75 - sm)]
  // mảnh nâu (đuôi): đỉnh vuông (707,193), một cạnh hướng trái-lên, cạnh kia hướng xuống
  const nau = (() => { const R = P(707, 193); const u = P(-0.968, -0.253); const v = P(-0.253, 0.968); return [R, addp(R, sc(u, md)), addp(R, sc(v, md))] })()
  raw[6][0] = nau
  const xs = raw.flatMap(([p]) => p.map((q) => q.x)), ys = raw.flatMap(([p]) => p.map((q) => q.y))
  const x0 = Math.min(...xs), y0 = Math.min(...ys), hh = (Math.max(...ys) - y0) * r
  const X2 = 12 * k + 70 // lề trái Hình 2
  const to2 = (p) => P((p.x - x0) * r + X2, (p.y - y0) * r)
  // kiểm: mảnh nâu hình 2 = tam giác vuông cân cạnh 6 cm
  const nb = nau.map(to2)
  const dd = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) / k
  ok('754 H2: mảnh nâu cạnh 6,6,8,49', near(dd(nb[0], nb[1]), 6, 0.05) && near(dd(nb[0], nb[2]), 6, 0.05) && near(dd(nb[1], nb[2]), 6 * Math.SQRT2, 0.05))
  ok('754 H2: diện tích mảnh khớp H1', raw.every(([p], i) => near(area(p.map(to2)) / (k * k), [36, 36, 9, 18, 9, 18, 18][i], 0.4)))
  const y1 = (hh - 12 * k) / 2
  const T1 = (p) => P(p.x, p.y + y1)
  const body = [
    ...h1.map(([p, c]) => pg(p.map(T1), c)),
    label(T1(A), 'A', -14, -8), label(T1(B), 'B', 14, -8), label(T1(C), 'C', 14, 26), label(T1(D), 'D', -14, 26), label(T1(M), 'M', 16, 9), label(T1(N), 'N', 0, 28),
    ...raw.map(([p, c]) => pg(p.map(to2), c)),
    num(P(6 * k, hh + 40), 'Hình 1', 0, 0, 22), num(P(X2 + (Math.max(...xs) - x0) * r / 2, hh + 40), 'Hình 2', 0, 0, 22)]
  hinh('T105000000754', [P(-20, -10), P(X2 + (Math.max(...xs) - x0) * r + 12, hh + 55)], body, { pad: 12, padDuoi: 36 })
}

// ───── T105000000769: tờ giấy vuông ABCD cạnh 20 cm, M trung điểm AB, N trung điểm BC; Hình 2 con chim ─────
{
  const k = 7.6, r = k / 12
  const m = (x, y) => P(x * k, y * k)
  const xanh = '#5aa9e6', xn = '#8fd0f5', den = '#4a4a4a'
  const A = m(0, 0), B = m(20, 0), C = m(20, 20), D = m(0, 20), O = m(10, 10), M = m(10, 0), N = m(20, 10)
  const h1 = [
    [[A, D, O], xanh, 100], [[D, C, O], xanh, 100], [[A, M, m(5, 5)], xanh, 25], [[M, m(15, 5), O, m(5, 5)], xn, 50],
    [[M, B, N], xanh, 50], [[m(15, 5), N, C, m(15, 15)], den, 50], [[O, m(15, 5), m(15, 15)], xanh, 25]]
  h1.forEach(([p, , a], i) => ok(`769 H1 mảnh ${i} diện tích ${a}`, near(area(p) / (k * k), a, 1e-6)))
  ok('769 H1 tổng = 400', near(h1.reduce((s, [p]) => s + area(p), 0) / (k * k), 400, 1e-6))
  ok('769 M, N trung điểm AB, BC', near(M.x, (A.x + B.x) / 2) && near(N.y, (B.y + C.y) / 2))
  ok('769 tam giác MBN: BM = BN = 10', near(B.x - M.x, 10 * k) && near(N.y - B.y, 10 * k))
  // Hình 2 — thang gốc 12 px/cm
  const s0 = 12, lg = 10 * Math.SQRT2 * s0, sm = 5 * Math.SQRT2 * s0, md = 10 * s0
  const t = 2 * Math.PI / 180
  const uA = P(Math.cos(t), Math.sin(t)), vA = P(-Math.sin(t), Math.cos(t))
  const RA = P(830, 0)
  const LA = [RA, addp(RA, sc(uA, lg)), addp(RA, sc(vA, lg))]
  const LB = [P(682, 390), P(802, 270), P(802, 510)]
  const sq = [P(767.85, 174.85), P(767.85 + sm, 174.85), P(767.85 + sm, 174.85 + sm), P(767.85, 174.85 + sm)]
  const pgm = [P(683, 90), P(683, 90 + sm), P(683 + sm, 90 + 2 * sm), P(683 + sm, 90 + sm)]
  const SL = [P(683 - sm, 90), P(683, 90), P(683, 90 + sm)]
  const SR = [P(767.85 + sm, 174.85), P(767.85 + sm, 174.85 + sm), P(767.85 + 2 * sm, 174.85 + sm)]
  const RM = P(942, 262), uM = P(0.968, -0.258), vM = P(0.258, 0.968)
  const MR = [RM, addp(RM, sc(uM, md)), addp(RM, sc(vM, md))]
  const raw = [[LA, xanh, 100], [LB, xanh, 100], [sq, xn, 50], [pgm, den, 50], [SL, xanh, 25], [SR, xanh, 25], [MR, xanh, 50]]
  raw.forEach(([p, , a], i) => ok(`769 H2 mảnh ${i} diện tích ${a}`, near(area(p) / (s0 * s0), a, 0.6)))
  const xs = raw.flatMap(([p]) => p.map((q) => q.x)), ys = raw.flatMap(([p]) => p.map((q) => q.y))
  const x0 = Math.min(...xs), y0 = Math.min(...ys), hh = (Math.max(...ys) - y0) * r, ww = (Math.max(...xs) - x0) * r
  const X2 = 20 * k + 70
  const to2 = (p) => P((p.x - x0) * r + X2, (p.y - y0) * r)
  const y1 = (hh - 20 * k) / 2
  const T1 = (p) => P(p.x, p.y + y1)
  const body = [
    ...h1.map(([p, c]) => pg(p.map(T1), c, 1.5)),
    label(T1(A), 'A', -14, -8), label(T1(M), 'M', 0, -10), label(T1(B), 'B', 14, -8), label(T1(N), 'N', 18, 9), label(T1(C), 'C', 14, 26), label(T1(D), 'D', -14, 26),
    ...raw.map(([p, c]) => pg(p.map(to2), c, 1.5)),
    num(P(10 * k, hh + 40), 'Hình 1', 0, 0, 22), num(P(X2 + ww / 2, hh + 40), 'Hình 2', 0, 0, 22)]
  hinh('T105000000769', [P(-20, -10), P(X2 + ww + 12, hh + 55)], body, { pad: 12, padDuoi: 36 })
}

await xuatTat(dir)
