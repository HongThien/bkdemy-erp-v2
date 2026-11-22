// kiem-dtb.mjs — máy kiểm các khẳng định trong lý thuyết + ví dụ đường trung bình (lt/lt-dtb.md, lt/vd-dtb.md): toạ độ ngẫu nhiên.
//   node kho-rules/hinh/lo/k8T-thales/lt/kiem-dtb.mjs
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-8) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y), add = (a, b) => P(a.x + b.x, a.y + b.y), lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const len = (u) => Math.hypot(u.x, u.y), cr = (u, v) => u.x * v.y - u.y * v.x, dot = (u, v) => u.x * v.x + u.y * v.y, d = (a, b) => len(sub(a, b))
const mid = (a, b) => lerp(a, b, 0.5)
const par = (a, b, c, e) => near(cr(sub(b, a), sub(e, c)), 0, 1e-7)
const col = (a, b, c) => near(cr(sub(b, a), sub(c, a)), 0, 1e-7 * Math.max(1, d(a, b) * d(a, c)))
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); if (Math.abs(k) < 1e-9) return null; return lerp(a, b, cr(sub(c, a), s) / k) }
const onSeg = (p, a, b) => near(d(a, p) + d(p, b), d(a, b), 1e-9)
const sameSide = (p, q, a, b) => cr(sub(b, a), sub(p, a)) * cr(sub(b, a), sub(q, a)) > 0
for (let t = 0; t < 500; t++) {
  // ── tam giác ──
  const A = P(R(-5, 5), R(2, 7)), B = P(R(-8, -1), R(-1, 1)), C = P(R(1, 8), R(-1, 1))
  const M = mid(A, B), N = mid(A, C)
  chk('MN∥BC', par(M, N, B, C)); chk('MN = BC/2', near(d(M, N), d(B, C) / 2)); chk('AM/AB = AN/AC = 1/2', near(d(A, M) / d(A, B), 0.5) && near(d(A, N) / d(A, C), 0.5))
  { const Nn = inter(M, add(M, sub(C, B)), A, C); chk('dấu hiệu: qua M ∥ BC cắt AC tại trung điểm', d(Nn, N) < 1e-7 && near(d(A, Nn) / d(A, C), 0.5)) }
  // chu vi tam giác trung điểm = nửa chu vi
  { const Mv = mid(A, B), Nv = mid(B, C), Pv = mid(C, A); chk('VD1 chu vi MNP = nửa chu vi', near(d(Mv, Nv) + d(Nv, Pv) + d(Pv, Mv), (d(A, B) + d(B, C) + d(C, A)) / 2)) }
  // ── hình thang ABCD (AB ∥ CD, AB ở trên), lồi ──
  { const h = R(0.5, 4), a = R(-3, 3), p = R(1, 6), dd = R(-8, -1), q = R(1, 10)
    const TA = P(a, h), TB = P(a + p, h), TD = P(dd, 0), TC = P(dd + q, 0)
    if (cr(sub(TB, TA), sub(TC, TB)) * cr(sub(TC, TB), sub(TD, TC)) > 0 && cr(sub(TC, TB), sub(TD, TC)) * cr(sub(TD, TC), sub(TA, TD)) > 0 && cr(sub(TD, TC), sub(TA, TD)) * cr(sub(TA, TD), sub(TB, TA)) > 0) {
      const E = mid(TA, TD), F = mid(TB, TC)
      chk('hình thang: EF∥AB', par(E, F, TA, TB)); chk('hình thang: EF∥CD', par(E, F, TD, TC)); chk('hình thang: EF = (AB+CD)/2', near(d(E, F), (d(TA, TB) + d(TD, TC)) / 2))
      // chứng minh qua K
      const K = inter(TA, F, TD, TC)
      chk('K = B + C − A', d(K, P(TB.x + TC.x - TA.x, TB.y + TC.y - TA.y)) < 1e-7); chk('FA = FK', near(d(F, TA), d(F, K))); chk('AB = CK', near(d(TA, TB), d(TC, K)))
      chk('C giữa D và K', onSeg(TC, TD, K)); chk('DK = CD + AB', near(d(TD, K), d(TD, TC) + d(TA, TB))); chk('A, D cùng phía BC', sameSide(TA, TD, TB, TC)); chk('A, K khác phía BC', !sameSide(TA, K, TB, TC))
      chk('EF đường trung bình tam giác ADK', par(E, F, TD, K) && near(d(E, F), d(TD, K) / 2))
      // đảo: qua E ∥ AB cắt BC tại trung điểm
      const Fx = inter(E, add(E, sub(TB, TA)), TB, TC); chk('đảo hình thang: F trung điểm BC', d(Fx, F) < 1e-7)
      // hai đường chéo
      const Pp = inter(E, F, TA, TC), Q = inter(E, F, TB, TD)
      chk('P trung điểm AC', d(Pp, mid(TA, TC)) < 1e-7); chk('Q trung điểm BD', d(Q, mid(TB, TD)) < 1e-7)
      chk('EP = CD/2', near(d(E, Pp), d(TD, TC) / 2)); chk('EQ = AB/2', near(d(E, Q), d(TA, TB) / 2)); chk('PQ = |CD−AB|/2', near(d(Pp, Q), Math.abs(d(TD, TC) - d(TA, TB)) / 2))
      chk('P, Q thuộc đoạn EF', onSeg(Pp, E, F) && onSeg(Q, E, F))
      if (d(TA, TB) < d(TD, TC)) chk('Q nằm giữa E và P', onSeg(Q, E, Pp))
      chk('dấu = khi hình thang', near(d(E, F), (d(TA, TB) + d(TD, TC)) / 2))
    } }
  // ── tứ giác bất kì (đơn): EF ≤ (AB+CD)/2 ──
  { const QA = P(R(-6, 6), R(-6, 6)), QB = P(R(-6, 6), R(-6, 6)), QC = P(R(-6, 6), R(-6, 6)), QD = P(R(-6, 6), R(-6, 6)), E = mid(QA, QD), F = mid(QB, QC), Pp = mid(QA, QC)
    chk('EF ≤ (AB+CD)/2', d(E, F) <= (d(QA, QB) + d(QC, QD)) / 2 + 1e-9)
    chk('EP = CD/2, PF = AB/2', near(d(E, Pp), d(QC, QD) / 2) && near(d(Pp, F), d(QA, QB) / 2))
    const Ev = mid(QA, QB), Fv = mid(QB, QC), Gv = mid(QC, QD), Hv = mid(QD, QA)
    chk('Varignon: EF∥HG, EF = HG', par(Ev, Fv, Hv, Gv) && near(d(Ev, Fv), d(Hv, Gv))); chk('Varignon: EF = AC/2', near(d(Ev, Fv), d(QA, QC) / 2)); chk('Varignon: EFGH hình bình hành', near(d(Ev, Fv), d(Hv, Gv)) && near(d(Fv, Gv), d(Ev, Hv))) }
  // ── VD3: AM trung tuyến, D trung điểm AM, BD cắt AC tại E ⇒ AE = AC/3 ──
  { const Mt = mid(B, C), Dt = mid(A, Mt), Et = inter(B, Dt, A, C), F = mid(Et, C)
    chk('VD3 MF∥BE', par(Mt, F, B, Et)); chk('VD3 E trung điểm AF', d(Et, mid(A, F)) < 1e-7); chk('VD3 AE = EF = FC', near(d(A, Et), d(Et, F)) && near(d(Et, F), d(F, C))); chk('VD3 AE = AC/3', near(d(A, Et), d(A, C) / 3)) }
  // ── VD6: tam giác vuông tại A, ADME hình chữ nhật ──
  { const Av = P(R(-3, 3), R(-3, 3)), u = R(1, 6), v = R(1, 6), th = R(0, Math.PI), Bv = add(Av, P(u * Math.cos(th), u * Math.sin(th))), Cv = add(Av, P(-v * Math.sin(th), v * Math.cos(th)))
    const Dv = mid(Av, Bv), Ev = mid(Av, Cv), Mv = mid(Bv, Cv)
    chk('VD6 góc A vuông', near(dot(sub(Bv, Av), sub(Cv, Av)), 0, 1e-8)); chk('VD6 DM∥AC, EM∥AB', par(Dv, Mv, Av, Cv) && par(Ev, Mv, Av, Bv))
    chk('VD6 hình bình hành ADME', d(Av, Dv) === d(Av, Dv) && near(d(Dv, Mv), d(Av, Ev)) && near(d(Ev, Mv), d(Av, Dv))); chk('VD6 góc D, E, M vuông', near(dot(sub(Av, Dv), sub(Mv, Dv)), 0, 1e-8) && near(dot(sub(Av, Ev), sub(Mv, Ev)), 0, 1e-8)) }
}
// số trong các ví dụ
const eq = (nhan, a, b) => chk(nhan, near(a, b))
eq('VD1 chu vi', 30 / 2, 15)
{ // VD2: AB = 6, CD = 14 ⇒ EF = 10, EQ = 3, EP = 7, PQ = 4
  const TA = P(110, 60), TB = P(230, 60), TD = P(40, 200), TC = P(320, 200), E = mid(TA, TD), F = mid(TB, TC), Pp = inter(E, F, TA, TC), Q = inter(E, F, TB, TD), s = 20
  eq('VD2 AB', d(TA, TB) / s, 6); eq('VD2 CD', d(TD, TC) / s, 14); eq('VD2 EF', d(E, F) / s, 10); eq('VD2 EQ', d(E, Q) / s, 3); eq('VD2 EP', d(E, Pp) / s, 7); eq('VD2 PQ', d(Pp, Q) / s, 4) }
{ // VD5: AB = 4, CD = 8 ⇒ EF ≤ 6; = 6 khi hình thang
  const TA = P(0, 3), TB = P(4, 3), TD = P(-2, 0), TC = P(6, 0), E = mid(TA, TD), F = mid(TB, TC)
  eq('VD5 AB', d(TA, TB), 4); eq('VD5 CD', d(TD, TC), 8); eq('VD5 EF = 6 khi hình thang', d(E, F), 6) }
console.log(`kiem-dtb: ${ok} phép kiểm đạt, ${fail} FAIL`)
