// ve_G24.mjs — hình TCHH CĐ4 Bài 2, 4, 5 (trạm G24; Bài 1, 3, 6 → KHAC và Bài 7 → DE_SAU không vẽ).
// Chạy từ h8t3:  node ve_G24.mjs   → hinh_G24\
import { P, seg, segDash, tick, angleMark, rightAngle, dot, label, labelOut, num, lerp, inter, foot, trongTam, hinh, xuatTat, add, vec, mul, dist, goc }
  from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/ad0c1492ee4a551d/6017bd0a-294b-4bab-8639-506812d8ed78/scratchpad/h8t3/hinh_G24'
const sub = (a, b) => vec(b, a)
const diem = (pts) => pts.map(dot).join('')
const lb = (p, t, from, d = 24) => labelOut(p, t, from, d)
const near = (a, b, e = 0.05, m = 'sai dữ kiện') => console.assert(Math.abs(a - b) < e, m, a, b)
const OPT = { pad: 44, padDuoi: 52 }

// ───────── Bài 2: tam giác ABC có ∠B = 120°, BD, CE phân giác trong, AF phân giác ngoài tại A (F ∈ đường thẳng BC) ─────────
{
  const k = 40, ox = 300, oy = 190                       // gốc toạ độ toán học (B) ở (300,190); y hướng lên
  const S = (x, y) => P(ox + k * x, oy - k * y)
  const c = 4.5, a = 4                                    // AB = 4,5 ; BC = 4 ; ∠B = 120°
  const B = S(0, 0), C = S(a, 0), A = S(c * Math.cos(2 * Math.PI / 3), c * Math.sin(2 * Math.PI / 3))
  const AC = dist(A, C), AB = dist(A, B), BC = dist(B, C)
  near(goc(B, A, C), 120, 1e-6, '∠B=120')
  const t = BC * AB / (AC - AB)                           // FB/FC = AB/AC, F nằm ngoài đoạn BC phía B
  const F = P(B.x - t, B.y)
  const D = lerp(A, C, AB / (AB + BC)), E = lerp(A, B, AC / (AC + BC))
  near(dist(F, B) / dist(F, C), AB / AC, 1e-9, 'FB/FC'); near(goc(A, B, F), goc(A, F, P(A.x + (A.x - C.x), A.y + (A.y - C.y))), 1e-6, 'AF phân giác ngoài')
  near(goc(B, A, D), 60, 1e-6, 'BD'); near(goc(C, A, E), goc(C, E, B), 1e-6, 'CE')
  const G = trongTam([A, B, C])
  const Ay = lerp(C, A, 1.17)                             // đầu mút phần kéo dài của CA về phía A (góc ngoài tại A)
  const nhan = [label(A, 'A', 22, -6), lb(C, 'C', G, 24), lb(D, 'D', G, 22), lb(E, 'E', G, 22), label(B, 'B', 14, 34), label(F, 'F', -4, 32)]
  const goc120 = [angleMark(B, A, C, 22), num(P(B.x, B.y - 58), '120°', 0, 0, 20)]
  const dk = [seg(A, B), seg(B, F), seg(B, C), seg(C, A), seg(B, D), seg(C, E), seg(A, F), seg(A, Ay),
    angleMark(B, A, D, 36, 1), angleMark(B, D, C, 46, 1),
    angleMark(C, A, E, 44, 2), angleMark(C, E, B, 62, 2),
    angleMark(A, B, F, 34, 3), angleMark(A, F, Ay, 48, 3)]
  const diemAll = [A, B, C, D, E, F, Ay]
  hinh('TCHH-4-2', diemAll, [dk, goc120, diem([A, B, C, D, E, F]), nhan], OPT)

  // ý a: kẻ tia Bx (đối của BD), các đường vuông góc FP, FQ, FR
  const Bx = lerp(D, B, 1.7)                              // tia đối của tia BD (kéo dài qua B)
  const Pp = foot(F, A, B), Q = foot(F, A, C), R = foot(F, B, D)
  near(dist(F, Pp), dist(F, Q), 1e-6, 'FP=FQ'); near(dist(F, Pp), dist(F, R), 1e-6, 'FP=FR')
  const Q2 = Q   // Q nằm trên phần kéo dài của CA về phía A
  hinh('TCHH-4-2_a_lg', [A, B, C, D, F, Bx, Pp, Q2, R], [
    seg(A, B), seg(B, F), seg(B, C), seg(C, Q2), seg(B, D), seg(B, Bx), seg(A, F), seg(D, F),
    seg(F, Pp), seg(F, Q2), seg(F, R),
    rightAngle(Pp, F, B, 11), rightAngle(Q2, F, A, 11), rightAngle(R, F, B, 11),
    tick(F, Pp, 1, 0.5), tick(F, Q2, 1, 0.5), tick(F, R, 1, 0.5),
    angleMark(B, A, F, 28, 1), angleMark(B, F, Bx, 36, 1),
    diem([A, B, C, D, F, Pp, Q2, R]),
    label(A, 'A', 20, -12), lb(C, 'C', G, 24), lb(D, 'D', G, 22),
    label(B, 'B', 16, 30), label(F, 'F', -4, 32), label(Pp, 'P', -16, -4), label(Q2, 'Q', -14, -8), label(R, 'R', 20, 20), label(Bx, 'x', 18, 18),
  ], OPT)

  const nhanB = [label(A, 'A', 22, -6), lb(C, 'C', G, 24), lb(D, 'D', G, 22), label(E, 'E', -16, 22), label(B, 'B', 14, 34), label(F, 'F', -4, 32)]
  // ý b: cát tuyến F, E, D
  hinh('TCHH-4-2_b_lg', diemAll, [
    seg(A, B), seg(B, F), seg(B, C), seg(C, A), seg(B, D), seg(C, E), seg(A, F), seg(F, D),
    diem([A, B, C, D, E, F]), nhanB,
  ], OPT)
  // kiểm hình: D, E, F thẳng hàng trên hình
  const cr = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
  console.assert(Math.abs(cr(F, E, D)) < 1e-6 * 1e3, 'D,E,F thẳng hàng')
}

// ───────── Bài 4: hình vuông ABCD, F ∈ BC, E = AF ∩ DC (E ngoài đoạn DC), G = DF ∩ BE ─────────
{
  const k = 200, ox = 70, oy = 300
  const S = (x, y) => P(ox + k * x, oy - k * y)
  const D = S(0, 0), C = S(1, 0), B = S(1, 1), A = S(0, 1)
  const f = 0.35
  const F = S(1, f)
  const E = inter(A, F, D, C), G = inter(D, F, B, E)
  near(dist(A, B), dist(B, C), 1e-6); near(goc(B, A, C), 90, 1e-6)
  const K = foot(C, A, E)
  const cen = trongTam([A, B, C, D])
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(C, E), seg(A, E), seg(D, G), seg(B, E)]
  const fx = [rightAngle(A, B, D, 12), rightAngle(B, A, C, 12), rightAngle(C, B, D, 12), rightAngle(D, A, C, 12),
    tick(A, B, 1, 0.5), tick(B, C, 1, 0.2), tick(C, D, 1, 0.5), tick(D, A, 1, 0.5)]
  const nh = [label(A, 'A', -18, 4), label(B, 'B', 18, 4), label(C, 'C', -4, 36), label(D, 'D', -16, 22), label(F, 'F', -14, -16), label(E, 'E', 4, 30), label(G, 'G', 18, -6)]
  hinh('TCHH-4-4', [A, B, C, D, E, G], [base, fx, diem([A, B, C, D, E, F, G]), nh], OPT)
  hinh('TCHH-4-4_lg', [A, B, C, D, E, G, K], [base, seg(C, G), rightAngle(K, C, E, 12), diem([A, B, C, D, E, F, G, K]),
    label(A, 'A', -18, 4), label(B, 'B', 18, 4), label(C, 'C', -4, 36), label(D, 'D', -16, 22), label(F, 'F', -14, -16), label(E, 'E', 4, 30), label(G, 'G', 18, -6), label(K, 'K', 2, 40)], OPT)
}

// ───────── Bài 5: ba đường AA′, BB′, CC′ đồng quy tại O ─────────
{
  const A = P(190, 40), B = P(40, 330), C = P(420, 330)
  const u = 0.30, v = 0.34, w = 0.36
  const O = add(add(mul(A, u), mul(B, v)), mul(C, w))
  const A1 = inter(A, O, B, C), B1 = inter(B, O, C, A), C1 = inter(C, O, A, B)
  near((dist(A, O) / dist(O, A1)), (dist(B1, A) / dist(B1, C)) + (dist(C1, A) / dist(C1, B)), 1e-9, 'OA/OA′')
  const G = trongTam([A, B, C])
  hinh('TCHH-4-5', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, A1), seg(B, B1), seg(C, C1),
    diem([A, B, C, A1, B1, C1, O]),
    lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), lb(A1, 'A′', G, 24), lb(B1, 'B′', G, 24), lb(C1, 'C′', G, 24), label(O, 'O', -30, 8)], OPT)
}

await xuatTat(OUT)
