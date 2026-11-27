// k5v-G17.mjs — gói G17, kho Đại K5 "Diện tích các hình" (10 hình, hình thang). Vẽ lại bằng code.
//   node scripts/anh/ve_moi/k5v-G17.mjs "<thu_muc_moi>"
import { P, seg, hinh, xuatTat, dot, label, num, fill, rightAngle, segDash, dist } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G17.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const near = (a, b) => Math.abs(a - b) < 1e-6
const FILL = '#e6ecf5'
const poly = (pts) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length])).join('')
const grid = (c, r, s) => {
  let o = ''
  for (let i = 0; i <= c; i++) o += `<line x1="${i * s}" y1="0" x2="${i * s}" y2="${r * s}" stroke="#c9ccd8" stroke-width="1"/>`
  for (let j = 0; j <= r; j++) o += `<line x1="0" y1="${j * s}" x2="${c * s}" y2="${j * s}" stroke="#c9ccd8" stroke-width="1"/>`
  return o
}
const G = (s) => (c, r) => P(c * s, r * s)

// ───── 657: Hình 1 (hình thang 50/100/45) + Hình 2 (ghép 6 cái) — cùng tỉ lệ 1,6 px/cm
{
  const k = 1.6
  const h = 45 * k, b1 = 50 * k, b2 = 100 * k
  const y1 = 36
  const A = P(25 * k, y1), B = P(25 * k + b1, y1), C = P(b2, y1 + h), D = P(0, y1 + h)
  ok('hình thang: đáy 50/100, cao 45', near(dist(A, B) / k, 50) && near(dist(D, C) / k, 100) && near(D.y - A.y, 45 * k))
  const F = P(A.x, D.y)
  // hình 2
  const ox = 250, top = 0, mid = 72 * 1, bot = 144
  ok('hàng hình 2 cao 45cm ⇒ 72px', near(mid - top, h))
  const X = (x, y) => P(ox + x, y)
  const pts = [X(40, top), X(360, top), X(400, mid), X(360, bot), X(40, bot), X(0, mid)]
  ok('đáy dài 100cm = 160px (x 0..160 trên đường giữa)', near(160 / k, 100))
  ok('đáy ngắn 50cm = 80px (40..120 trên cạnh trên)', near(80 / k, 50))
  const body = [
    fill([A, B, C, D]), fill(pts),
    poly([A, B, C, D]), seg(A, F), rightAngle(F, D, A, 12),
    poly(pts), seg(X(0, mid), X(400, mid)),
    seg(X(120, top), X(160, mid)), seg(X(280, top), X(240, mid)),
    seg(X(120, bot), X(160, mid)), seg(X(280, bot), X(240, mid)),
    num(P((A.x + B.x) / 2, y1 - 12), '50 cm'),
    num(P((D.x + C.x) / 2, D.y + 30), '100 cm'),
    num(P(F.x + 38, (A.y + D.y) / 2 + 7), '45 cm'),
    num(P(b2 / 2, 195), 'Hình 1'), num(P(ox + 200, 195), 'Hình 2'),
  ]
  hinh('T105000000657', [P(-15, -20), P(ox + 415, 0), P(0, 230)], body, { pad: 0, padDuoi: 0 })
}

// ───── 665: thửa ruộng = chữ nhật 30×20 + tam giác 10×20 (8 px/m)
{
  const k = 8
  const A = P(0, 0), B = P(30 * k, 0), C = P(40 * k, 20 * k), D = P(0, 20 * k), E = P(30 * k, 20 * k)
  ok('chữ nhật 30×20, tam giác đáy 10', near(dist(A, B) / k, 30) && near(dist(A, D) / k, 20) && near(dist(E, C) / k, 10))
  const ang = Math.atan2(C.y - B.y, C.x - B.x) * 180 / Math.PI
  const body = [
    poly([A, B, C, D]), seg(B, E),
    num(P(B.x / 2, -14), '30 m'),
    num(P(-38, D.y / 2 + 7), '20 m'),
    num(P(B.x / 2, D.y / 2 + 7), 'Trồng lúa', 0, 0, 24),
    `<text transform="translate(${B.x + 22},${B.y + 108}) rotate(${ang.toFixed(1)})" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="17">Trồng ngô</text>`,
    num(P((E.x + C.x) / 2, D.y + 34), '10 m'),
  ]
  hinh('T105000000665', [P(-80, -45), P(C.x + 20, D.y + 70)], body, { pad: 0, padDuoi: 0 })
}

// ───── 671: lưới 9×7 ô, M(3,2) N(6,2) P(8,5) Q(1,5); MN=3, QP=7, cao 3 (50 px/ô)
{
  const s = 50, g = G(s)
  const M = g(3, 2), N = g(6, 2), Pp = g(8, 5), Q = g(1, 5)
  ok('MN = 3 ô, QP = 7 ô, cao 3 ô', near(N.x - M.x, 3 * s) && near(Pp.x - Q.x, 7 * s) && near(Q.y - M.y, 3 * s))
  const body = [
    grid(9, 7, s), fill([M, N, Pp, Q]), poly([M, N, Pp, Q]),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', -4, -14), label(N, 'N', 6, -14), label(Pp, 'P', 10, 32), label(Q, 'Q', -12, 32),
    `<line x1="${s}" y1="${6.5 * s}" x2="${2 * s}" y2="${6.5 * s}"/><line x1="${s}" y1="${6.5 * s - 8}" x2="${s}" y2="${6.5 * s + 8}"/><line x1="${2 * s}" y1="${6.5 * s - 8}" x2="${2 * s}" y2="${6.5 * s + 8}"/>`,
    num(P(2 * s + 34, 6.5 * s + 7), '1 cm'),
  ]
  hinh('T105000000671', [P(0, 0), P(9 * s, 7 * s)], body, { pad: 0, padDuoi: 0 })
}

// ───── 674: lưới, ABCD: D(1,5) C(8,5) A(2,1) B(5,1) → AB=3, DC=7, cao 4 ô (40 px/ô)
{
  const s = 40, g = G(s)
  const A = g(2, 1), B = g(5, 1), C = g(8, 5), D = g(1, 5)
  ok('AB=3, DC=7, cao 4 ô', near(B.x - A.x, 3 * s) && near(C.x - D.x, 7 * s) && near(D.y - A.y, 4 * s))
  const body = [
    grid(9, 6, s), fill([A, B, C, D]), poly([A, B, C, D]), dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(C, 'C', 10, 32), label(D, 'D', -12, 32),
  ]
  hinh('T105000000674', [P(0, 0), P(9 * s, 6 * s)], body, { pad: 0, padDuoi: 0 })
}

// ───── 697: ba hình thang A, B, C trên lưới 28×7 ô (26 px/ô)
{
  const s = 26, g = G(s)
  const A = [g(1, 4), g(3, 1), g(7, 1), g(7, 4)]
  const B = [g(10, 1), g(15, 2), g(15, 5), g(10, 6)]
  const C = [g(17, 5), g(20, 2), g(26, 2), g(25, 5)]
  ok('A: đáy 6 và 4, cao 3', near(A[3].x - A[0].x, 6 * s) && near(A[2].x - A[1].x, 4 * s) && near(A[0].y - A[1].y, 3 * s))
  ok('B: đáy đứng 5 và 3, cao ngang 5', near(B[3].y - B[0].y, 5 * s) && near(B[2].y - B[1].y, 3 * s) && near(B[1].x - B[0].x, 5 * s))
  ok('C: đáy 6 và 8, cao 3', near(C[1].x - C[0].x, 0 + 3 * s) && near(C[2].x - C[1].x, 6 * s) && near(C[3].x - C[0].x, 8 * s) && near(C[0].y - C[1].y, 3 * s))
  const ctr = (a) => P(a.reduce((t, p) => t + p.x, 0) / 4, a.reduce((t, p) => t + p.y, 0) / 4)
  const body = [grid(28, 7, s), ...[A, B, C].map((a) => fill(a)), ...[A, B, C].map((a) => poly(a)),
    label(ctr(A), 'A', 0, 9), label(ctr(B), 'B', 0, 9), label(ctr(C), 'C', 0, 9)]
  hinh('T105000000697', [P(0, 0), P(28 * s, 7 * s)], body, { pad: 0, padDuoi: 0 })
}

// ───── 704: hình vuông ABCD 6,5 cm, DE=EG=GH=HK=KC=1,3 cm; vẽ AE, AG, AH, AK (40 px/cm)
{
  const k = 40
  const A = P(0, 0), B = P(6.5 * k, 0), C = P(6.5 * k, 6.5 * k), D = P(0, 6.5 * k)
  const st = 1.3 * k
  const E = P(st, D.y), Gp = P(2 * st, D.y), H = P(3 * st, D.y), K = P(4 * st, D.y)
  ok('KC = 1,3 cm; DK = 5,2 cm', near((C.x - K.x) / k, 1.3) && near((K.x - D.x) / k, 5.2))
  const body = [
    poly([A, B, C, D]), seg(A, E), seg(A, Gp), seg(A, H), seg(A, K),
    label(A, 'A', -16, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 30), label(D, 'D', -16, 30),
    label(E, 'E', 0, 30), label(Gp, 'G', 0, 30), label(H, 'H', 0, 30), label(K, 'K', 0, 30),
    num(P(st / 2, D.y + 66), '1,3 cm', 0, 0, 20),
    `<line x1="2" y1="${D.y + 40}" x2="${st - 2}" y2="${D.y + 40}"/><line x1="2" y1="${D.y + 34}" x2="2" y2="${D.y + 46}"/><line x1="${st - 2}" y1="${D.y + 34}" x2="${st - 2}" y2="${D.y + 46}"/>`,
    num(P(B.x + 44, C.y / 2 + 7), '6,5 cm'),
  ]
  hinh('T105000000704', [P(-40, -30), P(C.x + 80, D.y + 110)], body, { pad: 0, padDuoi: 0 })
}

// ───── 736: lưới 10×6, ABCD vuông tại A, D: A(2,1) B(5,1) D(2,5) C(8,5) (40 px/ô)
{
  const s = 40, g = G(s)
  const A = g(2, 1), B = g(5, 1), C = g(8, 5), D = g(2, 5)
  ok('AB=3, DC=6, AD=4 ô', near(B.x - A.x, 3 * s) && near(C.x - D.x, 6 * s) && near(D.y - A.y, 4 * s))
  const body = [
    grid(10, 6, s), fill([A, B, C, D]), poly([A, B, C, D]),
    rightAngle(A, B, D, 12), rightAngle(D, C, A, 12),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -16, -10), label(B, 'B', 8, -14), label(C, 'C', 14, 30), label(D, 'D', -16, 30),
  ]
  hinh('T105000000736', [P(0, 0), P(10 * s, 6 * s)], body, { pad: 0, padDuoi: 0 })
}

// ───── 763: tờ giấy 12×5, cắt tam giác (2,5) ở góc trái, (5,5) ở góc phải (40 px/cm)
{
  const k = 36
  const TL = P(0, 0), TR = P(12 * k, 0), BR = P(12 * k, 5 * k), BL = P(0, 5 * k)
  const L = P(2 * k, 0), R = P(7 * k, 0)
  ok('tam giác trái 2×5, phải 5×5', near(L.x - TL.x, 2 * k) && near(TR.x - R.x, 5 * k) && near(BR.y - TR.y, 5 * k))
  const br = (a, b, t) => `<line x1="${a}" y1="-22" x2="${b}" y2="-22"/><line x1="${a}" y1="-28" x2="${a}" y2="-16"/><line x1="${b}" y1="-28" x2="${b}" y2="-16"/>` + num(P((a + b) / 2, -34), t)
  const body = [
    fill([TL, TR, BR, BL], '#fff3b0'), poly([TL, TR, BR, BL]), segDash(L, BL), segDash(R, BR),
    br(0, 2 * k, '2 cm'), br(7 * k, 12 * k, '5 cm'),
    num(P(-30, 5 * k / 2 + 7), '5 cm'), num(P(6 * k, BL.y + 32), '12 cm'),
  ]
  hinh('T105000000763', [P(-70, -75), P(TR.x + 25, BL.y + 67)], body, { pad: 0, padDuoi: 0 })
}

// ───── 777: hình thang MNPQ, NP=14, MQ=36, NH=17 (12 px/cm), MH=12 cm
{
  const k = 12
  const M = P(0, 17 * k), Q = P(36 * k, 17 * k), N = P(12 * k, 0), Pp = P(26 * k, 0), H = P(12 * k, 17 * k)
  ok('NP=14, MQ=36, NH=17', near((Pp.x - N.x) / k, 14) && near((Q.x - M.x) / k, 36) && near((H.y - N.y) / k, 17))
  const yd = H.y + 56
  const body = [
    fill([M, N, Pp, Q]), poly([M, N, Pp, Q]), seg(N, H), rightAngle(H, Q, N, 12),
    dot(M), dot(N), dot(Pp), dot(Q), dot(H),
    label(M, 'M', -16, 8), label(N, 'N', -6, -14), label(Pp, 'P', 8, -14), label(Q, 'Q', 18, 8), label(H, 'H', 0, 30),
    num(P((N.x + Pp.x) / 2, -14), '14 cm'),
    num(P(N.x + 42, (N.y + H.y) / 2 + 7), '17 cm'),
    `<line x1="0" y1="${yd}" x2="${Q.x}" y2="${yd}"/>`,
    num(P(Q.x / 2, yd + 28), '36 cm'),
  ]
  hinh('T105000000777', [P(-45, -45), P(Q.x + 45, yd + 70)], body, { pad: 0, padDuoi: 0 })
}

// ───── 782: hình thang ABCD, AB=5, DC=9, cao 6 (30 px/cm); chân đường cao cách D 1,5 cm
{
  const k = 30
  const D = P(0, 6 * k), C = P(9 * k, 6 * k), A = P(1.5 * k, 0), B = P(6.5 * k, 0), F = P(1.5 * k, 6 * k)
  ok('AB=5, DC=9, cao 6', near((B.x - A.x) / k, 5) && near((C.x - D.x) / k, 9) && near((F.y - A.y) / k, 6))
  const body = [
    fill([A, B, C, D]), poly([A, B, C, D]), seg(A, F), rightAngle(F, C, A, 12),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -4, -14), label(B, 'B', 8, -14), label(C, 'C', 16, 8), label(D, 'D', -16, 8),
    num(P((A.x + B.x) / 2, -16), '5 cm'),
    num(P((D.x + C.x) / 2, D.y + 34), '9 cm'),
    num(P(A.x + 38, 3 * k + 7), '6 cm'),
  ]
  hinh('T105000000782', [P(-45, -65), P(C.x + 45, D.y + 70)], body, { pad: 0, padDuoi: 0 })
}

await xuatTat(dir)
