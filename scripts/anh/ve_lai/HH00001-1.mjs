// Vẽ lại hình — gói HH00001-1 (Tổng ba góc của một tam giác, Hình 7).
//   node scripts/anh/ve_lai/HH00001-1.mjs [<thu_muc_ra>]
// Mọi số đo dựng đúng bằng ray/inter; ẩn x, y, z giải ra giá trị thật rồi dựng, trên hình vẫn ghi chữ.
import { P, seg, angleMark, ray, inter, dot, label, num, angleText, rightAngle, goc, dist, trongTam, labelOut, hinh, xuatTat, angleBien } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00001-1/moi'
const ok = (v, mong, ten) => console.assert(Math.abs(v - mong) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${mong}`)

// HH00001001 — góc 80° (trái-đáy), 45° (phải-đáy), x ở đỉnh (x = 55°)
{
  const L = 320, B1 = P(0, 0), B2 = P(L, 0)
  const A = inter(B1, ray(B1, 80, 100), B2, ray(B2, 180 - 45, 100))
  ok(goc(A, B1, B2), 55, '001 x')
  hinh('HH00001001', [B1, B2, A], [seg(B1, B2), seg(B2, A), seg(A, B1),
    angleText(B1, B2, A, '80°', 72), angleText(B2, B1, A, '45°', 86), angleBien(A, B1, B2, 'x', 70)])
}

// HH00001002 — vuông ở đáy-trái, 30° ở đỉnh, y ở đáy-phải (y = 60°)
{
  const M = P(0, 0), V = ray(M, 90, 285)
  const N = inter(M, ray(M, 0, 100), V, ray(V, -90 + 30, 100)) // góc tại V giữa VM (xuống) và VN = 30°
  ok(goc(V, M, N), 30, '002 30°'); ok(goc(N, M, V), 60, '002 y')
  hinh('HH00001002', [M, V, N], [seg(M, V), seg(V, N), seg(N, M), rightAngle(M, V, N, 16),
    angleText(V, M, N, '30°', 104), angleBien(N, M, V, 'y', 70)])
}

// HH00001003 — z (tù, đáy-trái), 30° ở đỉnh trái, 25° ở đáy-phải (z = 125°)
{
  const L = 258, B1 = P(0, 0), B2 = P(L, 0)
  const A = inter(B1, ray(B1, 125, 100), B2, ray(B2, 180 - 25, 100))
  ok(goc(A, B1, B2), 30, '003 30°'); ok(goc(B1, A, B2), 125, '003 z')
  hinh('HH00001003', [B1, B2, A], [seg(B1, B2), seg(B2, A), seg(A, B1),
    angleText(A, B1, B2, '30°', 100), angleBien(B1, A, B2, 'z', 40), angleText(B2, B1, A, '25°', 104)])
}

// HH00001004 — tam giác ABC, A = 120°, B = C = x (x = 30°)
{
  const L = 245, A = P(0, 0), C = ray(A, 0, L), B = ray(A, 120, L)
  ok(goc(B, A, C), 30, '004 x(B)'); ok(goc(C, A, B), 30, '004 x(C)')
  const G = trongTam([A, B, C])
  hinh('HH00001004', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    angleMark(A, C, B, 30), angleText(A, C, B, '120°', 70),
    angleMark(B, A, C, 50), angleBien(B, A, C, 'x', 84),
    angleMark(C, A, B, 50), angleBien(C, A, B, 'x', 84),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26)])
}

// HH00001005 — tam giác MNP vuông tại M, P = 2y, N = y (y = 30°)
{
  const M = P(0, 0), Pp = ray(M, 90, 180), N = ray(M, 0, 180 * Math.tan(60 * Math.PI / 180))
  ok(goc(Pp, M, N), 60, '005 2y'); ok(goc(N, M, Pp), 30, '005 y')
  const G = trongTam([M, Pp, N])
  hinh('HH00001005', [M, Pp, N], [seg(M, Pp), seg(Pp, N), seg(N, M), dot(M), dot(Pp), dot(N),
    rightAngle(M, Pp, N, 15),
    angleMark(Pp, M, N, 42), angleBien(Pp, M, N, '2y', 74),
    angleMark(N, M, Pp, 48), angleBien(N, M, Pp, 'y', 100),
    labelOut(M, 'M', G, 26), labelOut(Pp, 'P', G, 26), labelOut(N, 'N', G, 26)])
}

// HH00001006 — A vuông; góc ngoài tại C (BCm) = 150°; x = B = 60°, y = C = 30°
{
  const L = 280, B = P(0, 0), C = P(L, 0)
  const A = inter(B, ray(B, 60, 100), C, ray(C, 150, 100))
  ok(goc(A, B, C), 90, '006 A'); ok(goc(B, A, C), 60, '006 x'); ok(goc(C, A, B), 30, '006 y')
  const u = P((C.x - A.x) / dist(A, C), (C.y - A.y) / dist(A, C))
  const m = P(C.x + u.x * 110, C.y + u.y * 110)
  ok(goc(C, B, m), 150, '006 150°')
  hinh('HH00001006', [B, C, A, m], [seg(B, A), seg(A, m), seg(B, C), dot(A), dot(B), dot(C),
    rightAngle(A, B, C, 14),
    angleMark(B, A, C, 40), angleBien(B, A, C, 'x', 74),
    angleMark(C, A, B, 44), angleBien(C, A, B, 'y', 84),
    angleMark(C, B, m, 34), angleText(C, B, m, '150°', 62),
    label(A, 'A', 6, -16), label(B, 'B', -14, 34), label(C, 'C', 22, -18), label(m, 'm', 8, 30)])
}

// HH00001007 — N = x, P = 4x, góc ngoài tại M (tMN) = 100° ⇒ x = 20°, P = 80°
{
  const L = 330, N = P(0, 0), Pp = P(L, 0)
  const M = inter(N, ray(N, 20, 100), Pp, ray(Pp, 180 - 80, 100))
  ok(goc(N, Pp, M), 20, '007 x'); ok(goc(Pp, N, M), 80, '007 4x')
  const u = P((M.x - Pp.x) / dist(Pp, M), (M.y - Pp.y) / dist(Pp, M))
  const t = P(M.x + u.x * 90, M.y + u.y * 90)
  ok(goc(M, t, N), 100, '007 100°')
  hinh('HH00001007', [N, Pp, M, t], [seg(N, M), seg(M, Pp), seg(Pp, N), seg(M, t), dot(N), dot(Pp), dot(M),
    angleMark(M, t, N, 36), angleText(M, t, N, '100°', 74),
    angleMark(N, Pp, M, 80), angleBien(N, Pp, M, 'x', 120),
    angleMark(Pp, N, M, 40), angleBien(Pp, N, M, '4x', 68),
    label(M, 'M', 26, -2), label(N, 'N', -6, 34), label(Pp, 'P', 12, 34), label(t, 't', -14, 8)])
}

// HH00001008 — P = 50°, góc MIN = 80°, góc ngoài tại N = 100°; x = PMI = 30°, y = IMN = 20°
{
  const L = 264, M = P(0, 0), N = P(L, 0)
  const Pp = inter(M, ray(M, 50, 100), N, ray(N, 100, 100)) // M = x + y = 50°, N (trong) = 80°
  const I = inter(M, ray(M, 20, 100), N, Pp)
  ok(goc(Pp, M, N), 50, '008 P'); ok(goc(I, M, N), 80, '008 80°'); ok(goc(N, M, Pp), 80, '008 N trong')
  ok(goc(M, Pp, I), 30, '008 x'); ok(goc(M, I, N), 20, '008 y'); ok(goc(M, Pp, N), 50, '008 x+y')
  const m = P(N.x + 90, 0)
  hinh('HH00001008', [M, N, Pp, I, m], [seg(M, m), seg(M, Pp), seg(Pp, N), seg(M, I), dot(M), dot(N), dot(Pp), dot(I),
    angleMark(Pp, M, N, 36), angleText(Pp, M, N, '50°', 80),
    angleMark(I, M, N, 28), angleText(I, M, N, '80°', 58),
    angleMark(N, m, Pp, 34), angleText(N, m, Pp, '100°', 72),
    angleMark(M, Pp, I, 76), angleBien(M, Pp, I, 'x', 104),
    angleMark(M, I, N, 56), angleBien(M, I, N, 'y', 118),
    label(Pp, 'P', 0, -14), label(I, 'I', 24, 8), label(M, 'M', -12, 34), label(N, 'N', 0, 38), label(m, 'm', -4, 34)])
}

await xuatTat(RA)
