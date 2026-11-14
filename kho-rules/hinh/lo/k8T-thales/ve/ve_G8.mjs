// ve_G8.mjs — hình TCHH CĐ5 Bài 7–12 (trạm G8). Chạy từ h8t:  node ve_G8.mjs   → hinh_G8\
import { P, seg, segDash, tick, angleMark, rightAngle, dot, label, labelOut, mid, lerp, inter, foot, trongTam, hinh, xuatTat, add, vec, mul, dist }
  from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G8'
const sub = (a, b) => vec(b, a)
const sc = (p, k) => P(p.x * k, p.y * k)
const diem = (pts) => pts.map(dot).join('')
const lb = (p, t, from, d = 24) => labelOut(p, t, from, d)
const OPT = { pad: 44, padDuoi: 50 }

// chân phân giác trong từ V xuống XY
const footBis = (V, X, Y) => lerp(X, Y, dist(V, X) / (dist(V, X) + dist(V, Y)))

// ───────── Bài 7 ─────────
{
  const A = P(170, 40), B = P(40, 330), C = P(400, 330)
  const D = footBis(A, B, C), M = footBis(B, C, A), N = footBis(C, A, B)
  const G = trongTam([A, B, C])
  hinh('TCHH-5-7', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, M), seg(C, N),
    angleMark(A, B, D, 34), angleMark(A, D, C, 44),
    angleMark(B, A, M, 34, 2), angleMark(B, M, C, 46, 2),
    angleMark(C, A, N, 40, 3), angleMark(C, N, B, 58, 3),
    diem([A, B, C, D, M, N]),
    lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), lb(D, 'D', G, 22), lb(M, 'M', G, 22), lb(N, 'N', G, 22),
  ], OPT)
  const E = inter(D, add(D, sub(C, A)), A, B)
  hinh('TCHH-5-7_lg', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(D, E),
    angleMark(A, E, D, 34), angleMark(A, D, C, 44), angleMark(D, A, E, 52),
    tick(A, E, 1, 0.5), tick(E, D, 1, 0.5),
    diem([A, B, C, D, E]),
    lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), lb(D, 'D', G, 22), lb(E, 'E', G, 22),
  ], OPT)
}

// ───────── Bài 8 (DE_SAU) ─────────
{
  const A = P(200, 40), B = P(30, 330), C = P(420, 330)
  const D = foot(A, B, C), E = foot(B, A, C), F = foot(C, A, B), H = inter(A, D, B, E)
  const G = trongTam([A, B, C])
  hinh('TCHH-5-8', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F), seg(D, E), seg(E, F), seg(F, D),
    rightAngle(D, A, B, 12), rightAngle(E, B, A, 12), rightAngle(F, C, B, 12),
    diem([A, B, C, D, E, F, H]),
    lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), lb(D, 'D', G, 22), lb(E, 'E', G, 22), lb(F, 'F', G, 22),
    label(H, 'H', 16, 24),
  ], OPT)
}

// ───────── Bài 9 ─────────
{
  const k = 0.85
  const A = sc(P(220, 40), k), B = sc(P(120, 330), k), C = sc(P(440, 330), k)
  const Pp = lerp(A, B, 0.7), N = lerp(A, C, 0.4), M = inter(Pp, N, B, C)
  const G = trongTam([A, B, C])
  const Q = inter(M, N, A, add(A, sub(C, B)))
  const Ptri = [seg(A, B), seg(B, C), seg(C, A), seg(M, B)]
  const nhan = [lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24)]
  // hình chung: tam giác + ba điểm (không vẽ đường thẳng — đó là điều cần chứng minh ở ý b)
  hinh('TCHH-5-9', [A, B, C, M], [Ptri, diem([A, B, C, M, N, Pp]), nhan,
    label(M, 'M', 0, 32), lb(N, 'N', G, 22), lb(Pp, 'P', G, 22)].join(''), OPT)
  // ý a: có đường thẳng MNP, kẻ AQ ∥ BC
  hinh('TCHH-5-9_a_lg', [A, B, C, M, Q], [Ptri, seg(M, Q), seg(A, Q), diem([A, B, C, M, N, Pp, Q]), nhan,
    label(M, 'M', 0, 32), label(N, 'N', 24, 2), label(Pp, 'P', -22, -6), label(Q, 'Q', 12, -14)].join(''), OPT)
  // ý b: M ≠ M′ (giả sử trái lại) — M′ = NP ∩ BC
  const Mp = M
  const M2 = P(M.x - 34, M.y)
  hinh('TCHH-5-9_b_lg', [A, B, C, M2], [seg(A, B), seg(B, C), seg(C, A), seg(M2, B), seg(Mp, N), diem([A, B, C, M2, Mp, N, Pp]), nhan,
    label(M2, 'M', 0, 32), label(Mp, 'M′', 12, 32), label(N, 'N', 24, 2), label(Pp, 'P', -22, -6)].join(''), OPT)
}

// ───────── Bài 10 ─────────
{
  const A = P(220, 40), B = P(60, 330), C = P(380, 330), H = P(220, 330)
  const E = foot(H, A, C), O = mid(H, E), D = mid(E, C)
  const G = trongTam([A, B, C])
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(H, E), seg(A, O), seg(B, E),
    rightAngle(E, H, A, 12), tick(A, B, 1, 0.5), tick(A, C, 1, 0.5), tick(B, H, 2, 0.5), tick(H, C, 2, 0.5), tick(H, O, 3, 0.5), tick(O, E, 3, 0.5)]
  hinh('TCHH-5-10', [A, B, C], [co, diem([A, B, C, H, E, O]),
    lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), label(H, 'H', 0, 34), label(E, 'E', 18, -6), label(O, 'O', -18, 4)].join(''), OPT)
  hinh('TCHH-5-10_lg', [A, B, C], [co, seg(H, D), seg(O, D), seg(A, H), seg(A, D), rightAngle(H, A, C, 12),
    diem([A, B, C, H, E, O, D]),
    lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), label(H, 'H', 0, 34), label(E, 'E', 18, -6), label(O, 'O', -18, 4), label(D, 'D', 20, 8)].join(''), OPT)
}

// ───────── Bài 11 ─────────
{
  const k = 0.8
  const A = sc(P(215, 150), k), B = sc(P(40, 330), k), C = sc(P(400, 330), k), M = sc(P(230, 330), k)
  const dir = sub(M, A)
  const Pp = inter(B, add(B, dir), A, C), Q = inter(C, add(C, dir), A, B)
  const G = trongTam([A, B, C])
  hinh('TCHH-5-11', [A, B, C, M, Pp, Q], [seg(B, Q), seg(C, Pp), seg(B, C), seg(A, M), seg(B, Pp), seg(C, Q),
    diem([A, B, C, M, Pp, Q]),
    label(A, 'A', 0, -16), lb(B, 'B', G, 22), lb(C, 'C', G, 22), label(M, 'M', 0, 32), label(Pp, 'P', -10, -14), label(Q, 'Q', 10, -14)].join(''), OPT)
}

// ───────── Bài 12 ─────────
{
  const A = P(200, 40), B = P(50, 330), C = P(400, 330)
  const D = mid(B, C), E = lerp(A, D, 0.55)
  const M = inter(B, E, A, C), N = inter(C, E, A, B)
  const Pp = inter(E, add(E, sub(C, B)), A, B), Q = inter(E, add(E, sub(C, B)), A, C)
  const G = trongTam([A, B, C])
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, M), seg(C, N), seg(M, N), tick(B, D, 1, 0.5), tick(D, C, 1, 0.5)]
  const nhan = [lb(A, 'A', G, 22), lb(B, 'B', G, 24), lb(C, 'C', G, 24), label(D, 'D', 0, 34), lb(M, 'M', G, 22), lb(N, 'N', G, 22), label(E, 'E', -18, 30)]
  hinh('TCHH-5-12', [A, B, C], [co, diem([A, B, C, D, E, M, N]), nhan].join(''), OPT)
  hinh('TCHH-5-12_lg', [A, B, C], [co, seg(Pp, Q), diem([A, B, C, D, E, M, N, Pp, Q]), nhan,
    label(Pp, 'P', -18, 6), label(Q, 'Q', 18, 6)].join(''), OPT)
}

await xuatTat(OUT)
