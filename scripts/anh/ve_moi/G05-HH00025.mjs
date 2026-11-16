// G05-HH00025.mjs — gói 6 mục của bài HH00025 / HH00099 (khối 7).
//   node scripts/anh/ve_moi/G05-HH00025.mjs "<gói>/moi"
// VẼ:        HHB000467, HHB000468
// KHÔNG VẼ:  HHC000748 (K không xác định, ý c cụt, lẫn mảnh đề khác), HHC000752 (ý d mâu thuẫn với dựng hình — xem kiểm bên dưới)
// KHÔNG CẦN HÌNH: HHB000465, HHB000466 (bài ký hiệu; điều kiện các ý loại trừ nhau, không có hình để vẽ)
import { P, seg, tick, angleMark, dot, label, hinh, xuatTat, dist, lerp, inter, goc, ray, num } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G05-HH00025.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const pts = (...a) => a.map(dot).join('')

// ── Chẩn đoán HHC000752 (KHÔNG vẽ): dựng đúng đề rồi thử "B, A, H thẳng hàng" ──
{
  const A = P(60, 300), B = P(60, 130), C = P(320, 300)
  const M = lerp(B, C, dist(B, A) / dist(B, C))
  const E = lerp(A, M, 0.5)
  const bk = P(B.x + (E.x - B.x) * 10, B.y + (E.y - B.y) * 10)
  const K = inter(B, bk, A, C)
  const u = P((M.x - K.x) / dist(M, K), (M.y - K.y) / dist(M, K))
  const H = P(M.x + u.x * dist(M, C), M.y + u.y * dist(M, C))          // tia đối của tia MK, MH = MC
  const cross = (B.x - A.x) * (H.y - A.y) - (B.y - A.y) * (H.x - A.x)
  nKiem++
  console.log(`ℹ 752 dựng đúng đề: AB<AC ${dist(A, B) < dist(A, C)}, BA=BM ${eq(dist(B, A), dist(B, M))}, KM⊥BC ${Math.abs((K.x - M.x) * (C.x - B.x) + (K.y - M.y) * (C.y - B.y)) < 1e-6}`)
  console.log(`ℹ 752 B,A,H thẳng hàng? tích có hướng = ${cross.toFixed(1)} (≠ 0 ⇒ MÂU THUẪN, không vẽ)`)
  const Hd = P(M.x - u.x * dist(A, C), M.y - u.y * dist(A, C))          // thử "MH = AC trên tia MK"
  console.log(`ℹ 752 thử MH = AC trên tia MK: tích có hướng = ${((B.x - A.x) * (Hd.y - A.y) - (B.y - A.y) * (Hd.x - A.x)).toFixed(6)} (=0 ⇒ đề gốc có lẽ là cách dựng này)`)
}

// ── HHB000467: △ABC, △MNP; Â = M̂, B̂ = N̂, AB = MN, AC = MP, BC = NP. (Ĉ = P̂ và △ABC = △MNP là điều phải chứng minh ⇒ không đánh dấu.) ──
{
  const A = P(0, 160), B = P(180, 185), C = P(40, 30)
  const dx = 250
  const M = P(A.x + dx, A.y), N = P(B.x + dx, B.y), Pp = P(C.x + dx, C.y)
  ok('467 ABC thường (ba cạnh đôi một khác nhau rõ)', Math.abs(dist(A, B) - dist(A, C)) > 30 && Math.abs(dist(A, B) - dist(B, C)) > 15 && Math.abs(dist(A, C) - dist(B, C)) > 30)
  ok('467 AB = MN', eq(dist(A, B), dist(M, N)))
  ok('467 AC = MP', eq(dist(A, C), dist(M, Pp)))
  ok('467 BC = NP', eq(dist(B, C), dist(N, Pp)))
  ok('467 Â = M̂', eq(goc(A, B, C), goc(M, N, Pp)))
  ok('467 B̂ = N̂', eq(goc(B, A, C), goc(N, M, Pp)))
  ok('467 (kiểm, KHÔNG đánh dấu) Ĉ = P̂', eq(goc(C, A, B), goc(Pp, M, N)))
  ok('467 tên khớp: A↔M, B↔N, C↔P (△ABC dựng cùng thứ tự đỉnh với △MNP)', true)
  hinh('HHB000467', [A, B, C, M, N, Pp], [
    seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(N, Pp), seg(Pp, M),
    tick(A, B, 1), tick(M, N, 1), tick(A, C, 2), tick(M, Pp, 2), tick(B, C, 3), tick(N, Pp, 3),
    angleMark(A, B, C, 32, 1), angleMark(M, N, Pp, 32, 1),
    angleMark(B, A, C, 32, 2), angleMark(N, M, Pp, 32, 2),
    pts(A, B, C, M, N, Pp),
    label(A, 'A', -18, 18), label(B, 'B', 16, 20), label(C, 'C', 0, -14),
    label(M, 'M', -18, 18), label(N, 'N', 16, 20), label(Pp, 'P', 0, -14),
  ], { pad: 44 })
}

// ── HHB000468: △ABC, △DEF; Â = 30°, B̂ = 40°, F̂ = 110°, D̂ = 30°; AB = DE, AC = DF, BC = FE. (Ĉ, Ê là số cần tính ⇒ không ghi.) ──
{
  const L = 190
  const A = P(0, 175), B = P(L, 175)
  const C = inter(A, ray(A, 30, 400), B, ray(B, 140, 400))
  const dx = 270
  const D = P(A.x + dx, A.y), E = P(B.x + dx, B.y), F = P(C.x + dx, C.y)
  ok('468 Â = 30°', Math.abs(goc(A, B, C) - 30) < 1e-6)
  ok('468 B̂ = 40°', Math.abs(goc(B, A, C) - 40) < 1e-6)
  ok('468 D̂ = 30°', Math.abs(goc(D, E, F) - 30) < 1e-6)
  ok('468 F̂ = 110°', Math.abs(goc(F, D, E) - 110) < 1e-6)
  ok('468 AB = DE', eq(dist(A, B), dist(D, E)))
  ok('468 AC = DF', eq(dist(A, C), dist(D, F)))
  ok('468 BC = FE', eq(dist(B, C), dist(F, E)))
  ok('468 (kiểm, KHÔNG ghi) Ĉ = 110°, Ê = 40°', Math.abs(goc(C, A, B) - 110) < 1e-6 && Math.abs(goc(E, D, F) - 40) < 1e-6)
  ok('468 ba cạnh đôi một khác nhau rõ', Math.abs(dist(A, B) - dist(A, C)) > 30 && Math.abs(dist(A, B) - dist(B, C)) > 30 && Math.abs(dist(A, C) - dist(B, C)) > 15)
  hinh('HHB000468', [A, B, C, D, E, F], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E), seg(E, F), seg(F, D),
    tick(A, B, 1), tick(D, E, 1), tick(A, C, 2), tick(D, F, 2), tick(B, C, 3), tick(E, F, 3),
    angleMark(A, B, C, 36), angleMark(B, A, C, 36), angleMark(D, E, F, 36), angleMark(F, D, E, 44),
    num(P(A.x + 68, A.y - 6), '30°', 0, 0, 20), num(P(B.x - 60, B.y - 6), '40°', 0, 0, 20), num(P(D.x + 68, D.y - 6), '30°', 0, 0, 20), num(P(F.x + 4, F.y + 32), '110°', 0, 0, 20),
    pts(A, B, C, D, E, F),
    label(A, 'A', -18, 18), label(B, 'B', 16, 20), label(C, 'C', 0, -14),
    label(D, 'D', -18, 18), label(E, 'E', 16, 20), label(F, 'F', 0, -14),
  ], { pad: 44 })
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
