// kiem-bode.mjs — máy kiểm các khẳng định trong lý thuyết + ví dụ bổ đề hình thang (lt/lt-bode.md, lt/vd-bode.md): toạ độ ngẫu nhiên.
//   node kho-rules/hinh/lo/k8T-thales/lt/kiem-bode.mjs
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-8) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y), lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const len = (u) => Math.hypot(u.x, u.y), cr = (u, v) => u.x * v.y - u.y * v.x, d = (a, b) => len(sub(a, b))
const par = (a, b, c, e) => near(cr(sub(b, a), sub(e, c)), 0, 1e-7)
const col = (a, b, c) => near(cr(sub(b, a), sub(c, a)), 0, 1e-7 * Math.max(1, d(a, b) * d(a, c)))
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const onSeg = (p, a, b) => near(d(a, p) + d(p, b), d(a, b))
const mid = (a, b) => lerp(a, b, 0.5)
for (let t = 0; t < 400; t++) {
  // hình thang ABCD, AB ∥ CD (nằm ngang), hai cạnh bên cắt nhau: AB ≠ CD
  const h = R(0.5, 3), a = R(-3, 3), p = R(1, 5), dd = R(-6, 0), q = R(1, 8)
  if (Math.abs(p - q) < 0.4) continue
  const A = P(a, h), B = P(a + p, h), D = P(dd, 0), C = P(dd + q, 0)
  // ABCD lồi: AD, BC không cắt nhau trong hình thang
  if (cr(sub(B, A), sub(C, B)) * cr(sub(C, B), sub(D, C)) <= 0) continue
  if (cr(sub(C, B), sub(D, C)) * cr(sub(D, C), sub(A, D)) <= 0 || cr(sub(D, C), sub(A, D)) * cr(sub(A, D), sub(B, A)) <= 0) continue
  const I = inter(A, D, B, C), O = inter(A, C, B, D)
  chk('AB∥CD', par(A, B, D, C))
  // bổ đề 1: đường thẳng qua I cắt AB tại M (M ∈ AB), CD tại N
  for (const k of [R(0.05, 0.95), R(0.05, 0.95)]) {
    const M = lerp(A, B, k), N = inter(I, M, D, C)
    chk('BĐ1 MA/MB = ND/NC', near(d(M, A) / d(M, B), d(N, D) / d(N, C)))
    // chứng minh BĐ1: ND/AM = IN/IM = NC/BM
    chk('BĐ1: ND/AM = IN/IM', near(d(N, D) / d(A, M), d(I, N) / d(I, M))); chk('BĐ1: NC/BM = IN/IM', near(d(N, C) / d(B, M), d(I, N) / d(I, M)))
    chk('BĐ1: AM∥DN, BM∥CN', par(A, M, D, N) && par(B, M, C, N))
    // bổ đề 2: đường thẳng MO cắt CD tại N
    const N2 = inter(M, O, D, C)
    chk('BĐ2 MA/MB = NC/ND', near(d(M, A) / d(M, B), d(N2, C) / d(N2, D)))
    chk('BĐ2: AM/CN = OM/ON', near(d(A, M) / d(C, N2), d(O, M) / d(O, N2))); chk('BĐ2: BM/DN = OM/ON', near(d(B, M) / d(D, N2), d(O, M) / d(O, N2)))
    chk('BĐ2: O giữa A,C và giữa M,N', onSeg(O, A, C) && onSeg(O, M, N2))
  }
  // bổ đề 3: đường thẳng IO
  { const M = inter(I, O, A, B), N = inter(I, O, D, C)
    chk('BĐ3 M trung điểm AB', near(d(M, A), d(M, B))); chk('BĐ3 N trung điểm CD', near(d(N, D), d(N, C)))
    chk('BĐ3 M ∈ đoạn AB, N ∈ đoạn CD', onSeg(M, A, B) && onSeg(N, D, C)) }
  // hệ quả: M, N trung điểm ⇒ I, M, O, N thẳng hàng; và I ∉ AB, O ∉ AB
  { const M = mid(A, B), N = mid(D, C)
    chk('hệ quả I,M,N', col(I, M, N)); chk('hệ quả O,M,N', col(O, M, N)); chk('I ∉ AB, O ∉ AB', !par(I, A, A, B) && !col(O, A, B)) }
  // ví dụ 4: EF qua O ∥ đáy: OE = OF, 1/OE = 1/AB + 1/CD
  { const E = inter(O, P(O.x + 1, O.y), A, D), F = inter(O, P(O.x + 1, O.y), B, C)
    chk('VD4 OE = OF', near(d(O, E), d(O, F))); chk('VD4 1/OE = 1/AB + 1/CD', near(1 / d(O, E), 1 / d(A, B) + 1 / d(C, D)))
    chk('VD4 OE/CD = AO/AC', near(d(O, E) / d(C, D), d(A, O) / d(A, C))); chk('VD4 OF/CD = BO/BD', near(d(O, F) / d(C, D), d(B, O) / d(B, D)))
    chk('VD4 AO/AC = BO/BD', near(d(A, O) / d(A, C), d(B, O) / d(B, D))); chk('VD4 OE/AB = DO/DB', near(d(O, E) / d(A, B), d(D, O) / d(D, B))) }
  // hệ quả 1 (qua I) và hệ quả 2 (qua O): hai chiều. Chiều thuận: M trung điểm AB ⇒ N trung điểm CD; chiều đảo: N trung điểm CD ⇒ M trung điểm AB
  { const M = mid(A, B), N = mid(D, C)
    const n1 = inter(I, M, D, C), n2 = inter(O, M, D, C), m1 = inter(I, N, A, B), m2 = inter(O, N, A, B)
    chk('HQ1 thuận', near(d(n1, C), d(n1, D))); chk('HQ2 thuận', near(d(n2, C), d(n2, D)))
    chk('HQ1 đảo', near(d(m1, A), d(m1, B))); chk('HQ2 đảo', near(d(m2, A), d(m2, B))) }
  // ví dụ 3: N trung điểm CD, đường thẳng qua O cắt AB tại M ⇒ M trung điểm AB
  { const N = mid(D, C), M = inter(N, O, A, B); chk('VD3 M trung điểm AB', near(d(M, A), d(M, B))); chk('VD3 MA/MB = NC/ND', near(d(M, A) / d(M, B), d(N, C) / d(N, D))) }
  // ví dụ 5: tam giác ABC, M trung điểm BC, E∈AB, F∈AC, EF∥BC, BF∩CE=O ⇒ A, O, M thẳng hàng; AM cắt EF tại trung điểm
  { const A3 = P(R(-3, 3), R(2, 5)), B3 = P(R(-6, -1), 0), C3 = P(R(1, 6), 0), k = R(0.2, 0.8)
    const M3 = mid(B3, C3), E3 = lerp(A3, B3, k), F3 = lerp(A3, C3, k), O3 = inter(B3, F3, C3, E3), N3 = inter(A3, M3, E3, F3)
    chk('VD5 EF∥BC', par(E3, F3, B3, C3)); chk('VD5 NE/NF = MB/MC', near(d(N3, E3) / d(N3, F3), d(M3, B3) / d(M3, C3))); chk('VD5 N trung điểm EF', near(d(N3, E3), d(N3, F3)))
    chk('VD5 A,O,M thẳng hàng', col(A3, O3, M3)); chk('VD5 A,M,O,N thẳng hàng', col(A3, O3, N3)) }
}
// số trong các ví dụ — dựng lại bằng toạ độ
const eq = (nhan, a, b) => chk(nhan, near(a, b))
eq('VD1 NC', 4 * 3 / 2, 6); eq('VD2 ND', 8 * 6 / 4, 12)
{ // VD5: AB=6, CD=12 ⇒ OE = OF = 4, EF = 8 (dựng lại bằng toạ độ)
  const A = P(0, 3), B = P(6, 3), D = P(-4, 0), C = P(8, 0), O = inter(A, C, B, D)
  const E = inter(O, P(O.x + 1, O.y), A, D), F = inter(O, P(O.x + 1, O.y), B, C)
  eq('VD5 AB', d(A, B), 6); eq('VD5 CD', d(C, D), 12); eq('VD5 1/OE', 1 / d(O, E), 1 / 6 + 1 / 12); eq('VD5 OE', d(O, E), 4); eq('VD5 OF', d(O, F), 4); eq('VD5 EF', d(E, F), 8) }
{ // VD1: AB=5, CD=10 (A là trung điểm ID); M cách A 2 cm, cách B 3 cm; N: ND=4, NC=6
  const D = P(0, 0), C = P(10, 0), I = P(3, 6), A = lerp(I, D, 0.5), B = lerp(I, C, 0.5)
  eq('VD1 AB', d(A, B), 5); const M = lerp(A, B, 2 / 5), N = inter(I, M, D, C)
  eq('VD1 MA', d(M, A), 2); eq('VD1 MB', d(M, B), 3); eq('VD1 ND', d(N, D), 4); eq('VD1 NC', d(N, C), 6) }
{ // VD2: AB=10, CD=20; MA=4, MB=6; NC=8, ND=12
  const A = P(0, 1), B = P(10, 1), D = P(-5, 0), C = P(15, 0), O = inter(A, C, B, D), M = lerp(A, B, 0.4), N = inter(M, O, D, C)
  eq('VD2 MA', d(M, A), 4); eq('VD2 MB', d(M, B), 6); eq('VD2 NC', d(N, C), 8); eq('VD2 ND', d(N, D), 12) }
console.log(`kiem-bode: ${ok} phép kiểm đạt, ${fail} FAIL`)
