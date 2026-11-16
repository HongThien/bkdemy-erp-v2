// G15-HH07000000.mjs — hình đề cho các câu đơn bài HH07000000 "Chưa phân dạng — Hình học 7".
//   node scripts/anh/ve_moi/G15-HH07000000.mjs "<gói>/moi"
// HHC003496: KHÔNG CẦN HÌNH (chỉ tính góc từ △ABC=△MNP, hình nào cũng lộ phép tương ứng đỉnh).
// HHC003498 / 003499 / 003508: hai tam giác kèm ký hiệu GIẢ THIẾT (gạch cạnh bằng nhau, cung góc bằng nhau).
import { P, seg, tick, angleMark, dot, label, hinh, xuatTat, dist, rot, goc, lerp, trongTam, labelOut, add } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G15-HH07000000.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const khac = (a, b) => Math.abs(a - b) > 15
const pts = (...a) => a.map(dot).join('')
const scalene = (a, b, c) => khac(dist(a, b), dist(b, c)) && khac(dist(b, c), dist(a, c)) && khac(dist(a, b), dist(a, c))
// dời cả tam giác bằng chuyển động cứng: quay deg quanh trọng tâm rồi đưa trọng tâm tới tam
const dat = (tri, deg, tam) => { const c = trongTam(tri); return tri.map((p) => add(rot(p, c, deg), P(tam.x - c.x, tam.y - c.y))) }
const tam3 = (a, b, c) => [seg(a, b), seg(b, c), seg(c, a)].join('')

// ── HHC003498: △ABC, △MHK có AB = MH, ∠A = ∠M. KHÔNG vẽ AC = MK (là điều cần thêm). Hai tam giác vẽ KHÔNG bằng nhau. ──
{
  const A = P(40, 230), B = P(220, 230), C = P(96, 76)
  const M = P(320, 230), H = P(500, 230)
  const K = P(M.x + (C.x - A.x) * 1.25, M.y + (C.y - A.y) * 1.25)
  ok('3498 AB = MH', eq(dist(A, B), dist(M, H)))
  ok('3498 ∠A = ∠M', eq(goc(A, B, C), goc(M, H, K)))
  ok('3498 (kiểm, KHÔNG gạch) AC ≠ MK', khac(dist(A, C), dist(M, K)))
  ok('3498 tam giác ABC, MHK thường (ba cạnh đôi một khác nhau)', scalene(A, B, C) && scalene(M, H, K))
  hinh('HHC003498', [A, B, C, M, H, K], [
    tam3(A, B, C), tam3(M, H, K),
    tick(A, B, 1), tick(M, H, 1),
    angleMark(A, B, C, 34), angleMark(M, H, K, 34),
    pts(A, B, C, M, H, K),
    label(A, 'A', -16, 22), label(B, 'B', 16, 22), label(C, 'C', -4, -14),
    label(M, 'M', -16, 22), label(H, 'H', 16, 22), label(K, 'K', -4, -14),
  ], { pad: 44 })
}

// ── HHC003499: △DEF, △MNP có DE = MN, ∠E = ∠N, EF = NP (D↔M, E↔N, F↔P). Không viết "bằng nhau" lên hình. ──
{
  const s = 0.8
  const loc = (x, y) => P(40 + x * s, 240 + y * s)
  const E = loc(0, 0), D = loc(30, -190), F = loc(230, -20)
  const [M, N, Pp] = dat([D, E, F], -14, P(390, 170))
  ok('3499 tam giác DEF thường', scalene(D, E, F))
  ok('3499 DE = MN', eq(dist(D, E), dist(M, N)))
  ok('3499 EF = NP', eq(dist(E, F), dist(N, Pp)))
  ok('3499 ∠E = ∠N', eq(goc(E, D, F), goc(N, M, Pp)))
  ok('3499 góc E không đặc biệt (≠ 60°, ≠ 90°)', Math.abs(goc(E, D, F) - 60) > 5 && Math.abs(goc(E, D, F) - 90) > 10)
  const g1 = trongTam([D, E, F]), g2 = trongTam([M, N, Pp])
  hinh('HHC003499', [D, E, F, M, N, Pp], [
    tam3(D, E, F), tam3(M, N, Pp),
    tick(D, E, 1), tick(M, N, 1), tick(E, F, 2), tick(N, Pp, 2),
    angleMark(E, D, F, 30), angleMark(N, M, Pp, 30),
    pts(D, E, F, M, N, Pp),
    labelOut(D, 'D', g1, 22), labelOut(E, 'E', g1, 24), labelOut(F, 'F', g1, 22),
    labelOut(M, 'M', g2, 22), labelOut(N, 'N', g2, 24), labelOut(Pp, 'P', g2, 22),
  ], { pad: 44 })
}

// ── HHC003508: △DEF, △MNP có DE = MN, FD = NP, EF = MP (D↔N, E↔M, F↔P). Tam giác thứ hai là ảnh của DEF qua chuyển động cứng. ──
{
  const s = 0.85
  const loc = (x, y) => P(40 + x * s, 40 + y * s)
  const D = loc(70, 0), E = loc(0, 170), F = loc(230, 200)
  const [N, M, Pp] = dat([D, E, F], 150, P(390, 150))
  ok('3508 tam giác DEF thường', scalene(D, E, F))
  ok('3508 DE = MN', eq(dist(D, E), dist(M, N)))
  ok('3508 FD = NP', eq(dist(F, D), dist(N, Pp)))
  ok('3508 EF = MP', eq(dist(E, F), dist(M, Pp)))
  ok('3508 ba cạnh DE, FD, EF đôi một khác nhau (gạch 1, 2, 3 không nhầm)', scalene(D, E, F))
  const g1 = trongTam([D, E, F]), g2 = trongTam([M, N, Pp])
  hinh('HHC003508', [D, E, F, M, N, Pp], [
    tam3(D, E, F), tam3(M, N, Pp),
    tick(D, E, 1), tick(M, N, 1), tick(F, D, 2), tick(N, Pp, 2), tick(E, F, 3), tick(M, Pp, 3),
    pts(D, E, F, M, N, Pp),
    labelOut(D, 'D', g1, 22), labelOut(E, 'E', g1, 24), labelOut(F, 'F', g1, 24),
    labelOut(M, 'M', g2, 24), labelOut(N, 'N', g2, 22), labelOut(Pp, 'P', g2, 24),
  ], { pad: 44 })
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
