// G06-HH00099.mjs — hình đề cho bài HH00099 "Tam giác bằng nhau - Trường hợp thứ nhất" (khối 7).
//   node scripts/anh/ve_moi/G06-HH00099.mjs "<gói>/moi"
// Vẽ: HHB000472, HHB000474, HHB000477, HHC000853, HHC000857.
// KHÔNG vẽ: HHB000476 (bốn ý cho bốn phép tương ứng đỉnh khác nhau, đề không có hình).
import { P, seg, tick, angleMark, dot, label, hinh, xuatTat, dist, mid, inter, ray, doiXung, goc, angleText, lerp } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G06-HH00099.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const cross = (v, a, b) => (a.x - v.x) * (b.y - v.y) - (a.y - v.y) * (b.x - v.x)
const pts = (...a) => a.map(dot).join('')

// ── HHB000472: tứ giác ABCD, AD = CB, DC = BA, đường chéo AC (ΔADC, ΔCBA). KHÔNG ký hiệu song song. ──
{
  const A = P(60, 300), B = P(300, 300), D = P(130, 120)
  const C = P(B.x + (D.x - A.x), B.y + (D.y - A.y))   // D→C = A→B ; C→B = D→A
  ok('472 AD = CB', eq(dist(A, D), dist(C, B)))
  ok('472 DC = BA', eq(dist(D, C), dist(B, A)))
  ok('472 B, D hai phía AC (△ADC, △CBA đối nhau qua trung điểm AC)', cross(A, C, B) * cross(A, C, D) < 0)
  ok('472 hình tổng quát: AB ≠ AD, không vuông', Math.abs(dist(A, B) - dist(A, D)) > 30 && Math.abs(goc(A, B, D) - 90) > 10)
  ok('472 (kiểm, KHÔNG ký hiệu) AB ∥ CD, AD ∥ BC', song2(A, B, C, D) && song2(A, D, B, C))
  ok('472 ABCD lồi đúng thứ tự A-B-C-D', cross(A, B, C) < 0 && cross(B, C, D) < 0 && cross(C, D, A) < 0 && cross(D, A, B) < 0)
  hinh('HHB000472', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C),
    tick(A, D, 1), tick(B, C, 1), tick(D, C, 2), tick(A, B, 2),
    pts(A, B, C, D),
    label(A, 'A', -18, 20), label(B, 'B', 18, 20), label(C, 'C', 18, -6), label(D, 'D', -16, -8),
  ])
}

// ── HHB000474: AB = AC, DB = DC, AD chung (A, D hai phía BC); I trung điểm BC (ý c). KHÔNG ô vuông, KHÔNG gạch góc. ──
{
  const B = P(60, 250), C = P(340, 250), I = mid(B, C)
  const A = P(I.x, 70), D = P(I.x, 340)
  ok('474 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('474 DB = DC', eq(dist(D, B), dist(D, C)))
  ok('474 IB = IC', eq(dist(I, B), dist(I, C)))
  ok('474 I thuộc đoạn BC', thang(B, I, C))
  ok('474 A, D hai phía BC', (A.y - B.y) * (D.y - B.y) < 0)
  ok('474 AB ≠ DB (hai tam giác cân khác nhau, không thành hình thoi)', Math.abs(dist(A, B) - dist(D, B)) > 30)
  ok('474 (kiểm, KHÔNG ký hiệu) A, I, D thẳng hàng, DI ⊥ BC', thang(A, I, D) && eq((D.x - I.x) * (C.x - B.x) + (D.y - I.y) * (C.y - B.y), 0))
  hinh('HHB000474', [A, B, C, D, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(D, B), seg(D, C), seg(A, D),
    tick(A, B, 1), tick(A, C, 1), tick(D, B, 2), tick(D, C, 2), tick(B, I, 3), tick(I, C, 3),
    pts(A, B, C, D, I),
    label(A, 'A', 0, -14), label(B, 'B', -16, 6), label(C, 'C', 18, 6), label(D, 'D', 0, 34), label(I, 'I', 18, -8),
  ])
}

// ── HHB000477: △ABC = △PQR, Â = 40°, B̂ = 35° (ý b). KHÔNG ghi Ĉ (đáp số), KHÔNG gạch cạnh tương ứng (ý a). ──
{
  const A = P(60, 150), B = P(300, 150)
  const C = inter(A, ray(A, 40, 100), B, ray(B, 145, 100))
  const O = P(180, 195)
  const Pp = doiXung(A, O), Q = doiXung(B, O), R = doiXung(C, O)
  ok('477 Â = 40°', Math.abs(goc(A, B, C) - 40) < 1e-6)
  ok('477 B̂ = 35°', Math.abs(goc(B, A, C) - 35) < 1e-6)
  ok('477 △PQR = △ABC (PQ=AB, QR=BC, RP=CA)', eq(dist(Pp, Q), dist(A, B)) && eq(dist(Q, R), dist(B, C)) && eq(dist(R, Pp), dist(C, A)))
  ok('477 (kiểm, KHÔNG ghi) Ĉ = 105°', Math.abs(goc(C, A, B) - 105) < 1e-6)
  ok('477 hai tam giác không chồng nhau', Pp.y > A.y + 40 && Q.y > B.y + 40)
  hinh('HHB000477', [A, B, C, Pp, Q, R], [
    seg(A, B), seg(B, C), seg(C, A), seg(Pp, Q), seg(Q, R), seg(R, Pp),
    angleMark(A, B, C, 46), angleText(A, B, C, '40°', 78),
    angleMark(B, A, C, 46), angleText(B, A, C, '35°', 80),
    pts(A, B, C, Pp, Q, R),
    label(A, 'A', -16, 8), label(B, 'B', 16, 8), label(C, 'C', 0, -14),
    label(Pp, 'P', 18, 8), label(Q, 'Q', -18, 8), label(R, 'R', 0, 32),
  ])
}

// ── HHC000853: △ABC = △A′B′C′ (hai tam giác bằng nhau, không ký hiệu thêm). ──
{
  const A = P(50, 280), B = P(220, 310), C = P(110, 140)
  const dx = 250
  const A2 = P(A.x + dx, A.y), B2 = P(B.x + dx, B.y), C2 = P(C.x + dx, C.y)
  ok('853 ba cạnh tam giác đôi một khác nhau rõ', Math.abs(dist(A, B) - dist(A, C)) > 15 && Math.abs(dist(A, B) - dist(B, C)) > 15 && Math.abs(dist(A, C) - dist(B, C)) > 15)
  ok('853 AB = A′B′, BC = B′C′, CA = C′A′', eq(dist(A, B), dist(A2, B2)) && eq(dist(B, C), dist(B2, C2)) && eq(dist(C, A), dist(C2, A2)))
  ok('853 hai tam giác không chồng nhau', Math.min(A2.x, B2.x, C2.x) > Math.max(A.x, B.x, C.x) + 40)
  hinh('HHC000853', [A, B, C, A2, B2, C2], [
    seg(A, B), seg(B, C), seg(C, A), seg(A2, B2), seg(B2, C2), seg(C2, A2),
    pts(A, B, C, A2, B2, C2),
    label(A, 'A', -16, 18), label(B, 'B', 16, 20), label(C, 'C', -4, -14),
    label(A2, 'A′', -26, 20), label(B2, 'B′', 20, 20), label(C2, 'C′', -2, -14),
  ])
}

// ── HHC000857: ABC có AB = AC, M trung điểm BC; vẽ AM (△ABM, △ACM). Tỉ lệ khớp ý d (BM = 5, AM = 12, AB = 13) nhưng KHÔNG ghi số, KHÔNG ô vuông. ──
{
  const k = 18
  const M = P(180, 290), B = P(M.x - 5 * k, M.y), C = P(M.x + 5 * k, M.y), A = P(M.x, M.y - 12 * k)
  ok('857 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('857 MB = MC', eq(dist(M, B), dist(M, C)))
  ok('857 M thuộc đoạn BC', thang(B, M, C))
  ok('857 tỉ lệ ý d: AB : CM : AM = 13 : 5 : 12', eq(dist(A, B) / k, 13) && eq(dist(C, M) / k, 5) && eq(dist(A, M) / k, 12))
  hinh('HHC000857', [A, B, C, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M),
    tick(A, B, 1), tick(A, C, 1), tick(B, M, 2), tick(M, C, 2),
    pts(A, B, C, M),
    label(A, 'A', 0, -14), label(B, 'B', -16, 8), label(C, 'C', 18, 8), label(M, 'M', 0, 34),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
