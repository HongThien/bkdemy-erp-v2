// ve_G3.mjs — hình cho NDT Chương III §1 bài 1–5 (Thalès). Chạy: node ve_G3.mjs (từ thư mục h8t)
import { P, seg, dot, label, num, bien, hinh, xuatTat, lerp, mid, foot, inter, ray, rot, dist, goc, trongTam, add, mul, vec } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G3'
const ok = (c, m) => { if (!c) { console.error('ASSERT FAIL:', m); process.exitCode = 1 } }
const unit = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }
const diem = (...pts) => pts.map(dot).join('')

// chữ số đo cạnh ab, lệch phía xa `from` d px (d âm = phía gần from); isVar: ẩn số in nghiêng
function tx(a, b, t, from, d = 20, isVar = false) {
  const m = mid(a, b), v = unit(P(foot(from, a, b).x - from.x, foot(from, a, b).y - from.y))
  const p = P(m.x + v.x * d, m.y + v.y * d)
  return (isVar ? bien : num)(p, t, 0, 8, 24)
}
// xoay cả hình quanh a sao cho a→b nằm ngang
function ngang(pts, a, b) {
  const ang = Math.atan2(-(b.y - a.y), b.x - a.x) * 180 / Math.PI
  return pts.map((p) => rot(p, a, -ang))
}

// ───────── Bài 1a: AB = 5 dm, CD = 30 dm (tỉ lệ 1:6, 10 px/dm) ─────────
{
  const A = P(40, 50), B = P(90, 50), C = P(40, 140), D = P(340, 140)
  ok(Math.abs(dist(C, D) / dist(A, B) - 6) < 1e-9, '1a tỉ lệ')
  hinh('NDT-H3-1a', [A, B, C, D], [seg(A, B), seg(C, D), diem(A, B, C, D),
    label(A, 'A', 0, -14), label(B, 'B', 0, -14), label(C, 'C', 0, -14), label(D, 'D', 0, -14),
    num(mid(A, B), '5 dm', 0, 30), num(mid(C, D), '30 dm', 0, 30)])
}
// ───────── Bài 1b: MN = 42 cm, PQ = 2,4 m = 240 cm ─────────
{
  const k = 1.25
  const M = P(40, 50), N = P(40 + 42 * k, 50), Pp = P(40, 140), Q = P(40 + 240 * k, 140)
  ok(Math.abs(dist(Pp, Q) / dist(M, N) - 240 / 42) < 1e-9, '1b tỉ lệ')
  hinh('NDT-H3-1b', [M, N, Pp, Q], [seg(M, N), seg(Pp, Q), diem(M, N, Pp, Q),
    label(M, 'M', 0, -14), label(N, 'N', 0, -14), label(Pp, 'P', 0, -14), label(Q, 'Q', 0, -14),
    num(mid(M, N), '42 cm', 0, 30), num(mid(Pp, Q), '2,4 m', 0, 30)])
}
// ───────── Bài 2: 3MN = 5PQ  (MN : PQ = 5 : 3), k = 15 px ─────────
{
  const k = 15
  const M = P(40, 50), N = P(40 + 20 * k, 50), Pp = P(40, 130), Q = P(40 + 12 * k, 130)
  ok(Math.abs(3 * dist(M, N) - 5 * dist(Pp, Q)) < 1e-9, '2: 3MN=5PQ')
  hinh('NDT-H3-2', [M, N, Pp, Q], [seg(M, N), seg(Pp, Q), diem(M, N, Pp, Q),
    label(M, 'M', 0, -14), label(N, 'N', 0, -14), label(Pp, 'P', 0, -14), label(Q, 'Q', 0, -14)])
}
// ───────── Bài 3: M thuộc đoạn AB, AM/MB = 2/7 ─────────
{
  const A = P(40, 60), B = P(400, 60), M = lerp(A, B, 2 / 9)
  ok(Math.abs(dist(A, M) / dist(M, B) - 2 / 7) < 1e-9, '3 tỉ lệ')
  hinh('NDT-H3-3', [A, B, M], [seg(A, B), diem(A, B, M),
    label(A, 'A', 0, -14), label(B, 'B', 0, -14), label(M, 'M', 0, -14)])
}
// ───────── Bài 4a: tam giác PQR, DE ∥ QR, PD=5, DQ=3, PE=8, ER=x(=4,8); k = 26 px/đơn vị ─────────
{
  const k = 26
  const Pp0 = P(0, 0)
  let Q = ray(Pp0, 242, 8 * k), R = ray(Pp0, 300, 12.8 * k)
  ;[Q, R] = ngang([Q, R], Q, R)           // QR nằm ngang (Q, R vừa xoay quanh Q — Q giữ nguyên)
  // ngang() xoay quanh Q nên P cũng phải xoay cùng: làm lại cho cả bộ
  const all = ngang([Pp0, ray(Pp0, 242, 8 * k), ray(Pp0, 300, 12.8 * k)], ray(Pp0, 242, 8 * k), ray(Pp0, 300, 12.8 * k))
  const [Pp, Q2, R2] = all
  const D = lerp(Pp, Q2, 5 / 8), E = lerp(Pp, R2, 5 / 8)
  ok(Math.abs(dist(Pp, D) / dist(D, Q2) - 5 / 3) < 1e-9, '4a PD/DQ')
  ok(Math.abs(dist(Pp, E) - 8 * k) < 1e-6 && Math.abs(dist(E, R2) - 4.8 * k) < 1e-6, '4a PE, ER')
  const cr = (E.x - D.x) * (R2.y - Q2.y) - (E.y - D.y) * (R2.x - Q2.x)
  ok(Math.abs(cr) < 1e-6, '4a DE//QR')
  const G = trongTam([Pp, Q2, R2])
  hinh('NDT-H3-4a', [Pp, Q2, R2], [seg(Pp, Q2), seg(Pp, R2), seg(Q2, R2), seg(D, E), diem(Pp, Q2, R2, D, E),
    label(Pp, 'P', 0, -14), label(Q2, 'Q', -12, 30), label(R2, 'R', 12, 30), label(D, 'D', -20, 8), label(E, 'E', 20, 8),
    tx(Pp, D, '5', G, 20), tx(D, Q2, '3', G, 20), tx(Pp, E, '8', G, 20), tx(E, R2, 'x', G, 20, true)])
}
// ───────── Bài 4b: tam giác SHK, MN ∥ HK, SM=x(=7,2), MH=2,4, SN=9, SK=12; k = 26 ─────────
{
  const k = 26
  const S0 = P(0, 0)
  const H0 = ray(S0, 238, 9.6 * k), K0 = ray(S0, 293, 12 * k)
  const [S, H, K] = ngang([S0, H0, K0], H0, K0)
  const M = lerp(S, H, 0.75), N = lerp(S, K, 0.75)
  ok(Math.abs(dist(S, K) - 12 * k) < 1e-6 && Math.abs(dist(S, N) - 9 * k) < 1e-6, '4b SK, SN')
  ok(Math.abs(dist(M, H) - 2.4 * k) < 1e-6 && Math.abs(dist(S, M) - 7.2 * k) < 1e-6, '4b MH, SM')
  const cr = (N.x - M.x) * (K.y - H.y) - (N.y - M.y) * (K.x - H.x)
  ok(Math.abs(cr) < 1e-6, '4b MN//HK')
  const G = trongTam([S, H, K])
  // đường kích thước "12" dọc SK, nằm ngoài tam giác
  const dir = unit(P(K.x - S.x, K.y - S.y))
  let nrm = P(-dir.y, dir.x)
  if ((G.x - S.x) * nrm.x + (G.y - S.y) * nrm.y > 0) nrm = P(-nrm.x, -nrm.y)
  const S2 = add(S, mul(nrm, 42)), K2 = add(K, mul(nrm, 42))
  const tk = (p) => seg(add(p, mul(nrm, -7)), add(p, mul(nrm, 7)))
  const t12 = num(add(mid(S2, K2), mul(nrm, 24)), '12', 0, 8, 24)
  hinh('NDT-H3-4b', [S, H, K, add(mid(S2, K2), mul(nrm, 30)), S2, K2], [seg(S, H), seg(S, K), seg(H, K), seg(M, N), diem(S, H, K, M, N),
    seg(S2, K2), tk(S2), tk(K2), t12,
    label(S, 'S', 0, -14), label(H, 'H', -12, 30), label(K, 'K', 12, 30), label(M, 'M', -20, 8), label(N, 'N', 20, 8),
    tx(S, M, 'x', G, 20, true), tx(M, H, '2,4', G, 24), tx(S, N, '9', G, -20)])
}
// ───────── Bài 5: góc xAy, B, C ∈ Ax (B giữa A, C); BD ∥ CE; EF ∥ CD ─────────
{
  const A = P(40, 330), X0 = P(40 + 520, 330)
  const Y0 = ray(A, 48, 330)
  const B = P(150, 330), C = P(250, 330)
  const u = ray(P(0, 0), 100, 100)               // hướng của hai đường song song BD, CE (không vuông Ax)
  const E = inter(C, add(C, u), A, Y0), D = inter(B, add(B, u), A, Y0)
  const F = inter(E, add(E, vec(D, C)), A, X0)
  const r1 = dist(A, B) / dist(A, C), r2 = dist(A, D) / dist(A, E), r3 = dist(A, C) / dist(A, F)
  ok(Math.abs(r1 - r2) < 1e-9 && Math.abs(r3 - r2) < 1e-9, '5 tỉ số')
  ok(Math.abs(dist(A, C) ** 2 - dist(A, B) * dist(A, F)) < 1e-6, '5 AC²=AB·AF')
  ok(F.x > C.x && D.y > E.y, '5 thứ tự')
  const X = P(F.x + 50, 330), Y = ray(A, 48, dist(A, E) + 60)
  hinh('NDT-H3-5', [A, X, Y, E, F], [seg(A, X), seg(A, Y), seg(B, D), seg(C, E), seg(C, D), seg(E, F), diem(A, B, C, F, D, E),
    label(A, 'A', -14, 28), label(B, 'B', 0, 32), label(C, 'C', 0, 32), label(F, 'F', 0, 32),
    label(D, 'D', -18, -4), label(E, 'E', -18, -4), label(X, 'x', 10, 8), label(Y, 'y', 16, 4)])
}
await xuatTat(OUT)
console.log('xong ve_G3')
