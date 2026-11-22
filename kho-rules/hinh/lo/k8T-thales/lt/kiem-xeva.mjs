// kiem-xeva.mjs — máy kiểm các khẳng định trong lý thuyết + ví dụ Mê-nê-la-uýt / Xê-va (lt/lt-xeva.md, lt/vd-xeva.md): toạ độ ngẫu nhiên.
//   node kho-rules/hinh/lo/k8T-thales/lt/kiem-xeva.mjs
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-8) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y), add = (a, b) => P(a.x + b.x, a.y + b.y), lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const len = (u) => Math.hypot(u.x, u.y), cr = (u, v) => u.x * v.y - u.y * v.x, d = (a, b) => len(sub(a, b))
const par = (a, b, c, e) => near(cr(sub(b, a), sub(e, c)), 0, 1e-7)
const col = (a, b, c) => near(cr(sub(b, a), sub(c, a)), 0, 1e-7 * Math.max(1, d(a, b) * d(a, c)))
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); if (Math.abs(k) < 1e-9) return null; return lerp(a, b, cr(sub(c, a), s) / k) }
const onSeg = (p, a, b) => near(d(a, p) + d(p, b), d(a, b), 1e-9)
const trong = onSeg
const tamGiac = () => { for (;;) { const A = P(R(-5, 5), R(2, 7)), B = P(R(-8, -1), R(-1, 1)), C = P(R(1, 8), R(-1, 1)); if (Math.abs(cr(sub(B, A), sub(C, A))) > 4) return [A, B, C] } }
const mene = (A, B, C, M, N, Pp) => (d(M, B) / d(M, C)) * (d(N, C) / d(N, A)) * (d(Pp, A) / d(Pp, B))
for (let t = 0; t < 600; t++) {
  const [A, B, C] = tamGiac()
  // ── cát tuyến ngẫu nhiên không qua đỉnh ──
  const p0 = P(R(-9, 9), R(-5, 9)), p1 = P(R(-9, 9), R(-5, 9))
  const M = inter(p0, p1, B, C), N = inter(p0, p1, C, A), Pp = inter(p0, p1, A, B)
  if (M && N && Pp && [A, B, C].every((v) => !col(p0, p1, v)) && d(p0, p1) > 1) {
    chk('Mê-nê-la-uýt (thuận)', near(mene(A, B, C, M, N, Pp), 1, 1e-7))
    const ngoai = [!trong(M, B, C), !trong(N, C, A), !trong(Pp, A, B)].filter(Boolean).length
    chk('số điểm ngoài cạnh lẻ (1 hoặc 3)', ngoai === 1 || ngoai === 3)
    const ben = (v) => Math.sign(cr(sub(p1, p0), sub(v, p0)))
    const cat = [ben(B) !== ben(C), ben(C) !== ben(A), ben(A) !== ben(B)].filter(Boolean).length
    chk('d cắt 0 hoặc 2 cạnh', cat === 0 || cat === 2); chk('số điểm ngoài = 3 − số cạnh bị cắt', ngoai === 3 - cat)
    // chứng minh: CK ∥ AB, K ∈ d
    const K = inter(p0, p1, C, add(C, sub(B, A)))
    if (K) {
      chk('CK∥AB', par(C, K, A, B)); chk('MB/MC = BP/CK', near(d(M, B) / d(M, C), d(B, Pp) / d(C, K))); chk('NC/NA = CK/AP', near(d(N, C) / d(N, A), d(C, K) / d(A, Pp)))
      chk('tích hai tỉ số = BP/AP', near((d(M, B) / d(M, C)) * (d(N, C) / d(N, A)), d(B, Pp) / d(A, Pp)))
    }
    // đảo trường hợp 1: P' = MN ∩ AB trùng P
    chk("đảo: P' = P", d(inter(M, N, A, B), Pp) < 1e-6)
  }
  // ── đảo trường hợp 2: MN ∥ AB (cùng hệ số tt từ C) ⇒ M, N cùng trong hoặc cùng ngoài; MB/MC = NA/NC ──
  {
    const tt = [R(0.1, 0.9), R(1.1, 3), R(-3, -0.1)][t % 3], M2 = lerp(C, B, tt), N2 = lerp(C, A, tt)
    chk('đảo 2: MN∥AB', par(M2, N2, A, B)); chk('đảo 2: CM/CB = CN/CA', near(d(C, M2) / d(C, B), d(C, N2) / d(C, A))); chk('đảo 2: MB/MC = NA/NC', near(d(M2, B) / d(M2, C), d(N2, A) / d(N2, C)))
    chk('đảo 2: M, N cùng trong hoặc cùng ngoài cạnh', trong(M2, B, C) === trong(N2, C, A))
  }
  // ── Xê-va: O trong tam giác ──
  {
    const a = R(0.1, 1), b = R(0.1, 1), c = R(0.1, 1), s = a + b + c, O = P((a * A.x + b * B.x + c * C.x) / s, (a * A.y + b * B.y + c * C.y) / s)
    const D = inter(A, O, B, C), E = inter(B, O, C, A), F = inter(C, O, A, B)
    chk('D, E, F thuộc cạnh', trong(D, B, C) && trong(E, C, A) && trong(F, A, B))
    chk('Xê-va', near((d(D, B) / d(D, C)) * (d(E, C) / d(E, A)) * (d(F, A) / d(F, B)), 1, 1e-7))
    // chứng minh bằng hai lần Mê-nê-la-uýt
    chk('(1) tam giác ABD, cát tuyến C-O-F', near((d(C, B) / d(C, D)) * (d(O, D) / d(O, A)) * (d(F, A) / d(F, B)), 1, 1e-7))
    chk('(2) tam giác ADC, cát tuyến B-O-E', near((d(B, D) / d(B, C)) * (d(E, C) / d(E, A)) * (d(O, A) / d(O, D)), 1, 1e-7))
    // đảo: cho D, E trên cạnh, F theo tích = 1 ⇒ đồng quy
    const D3 = lerp(B, C, R(0.1, 0.9)), E3 = lerp(C, A, R(0.1, 0.9)), kF = 1 / ((d(D3, B) / d(D3, C)) * (d(E3, C) / d(E3, A))), F3 = lerp(A, B, kF / (1 + kF))
    chk('đảo Xê-va: FA/FB = kF', near(d(F3, A) / d(F3, B), kF)); const O3 = inter(A, D3, B, E3)
    chk('đảo Xê-va: O trong tam giác', O3 !== null); chk('đảo Xê-va: C, O, F thẳng hàng', col(C, O3, F3))
    const Fp = inter(C, O3, A, B); chk("đảo Xê-va: F' trên cạnh AB", trong(Fp, A, B)); chk("đảo Xê-va: F' = F", d(Fp, F3) < 1e-6)
  }
}
// ── ví dụ: dựng lại bằng toạ độ ──
const eq = (nhan, a, b) => chk(nhan, near(a, b, 1e-7))
{ // VD1: PA:PB = 2:3, NA:NC = 1:3; MB = BC
  const [A, B, C] = [P(1.5, 6), P(0, 0), P(7, 0)], Pp = lerp(A, B, 0.4), N = lerp(A, C, 0.25), M = inter(Pp, N, B, C)
  eq('VD1 PA:PB', d(Pp, A) / d(Pp, B), 2 / 3); eq('VD1 NA:NC', d(N, A) / d(N, C), 1 / 3)
  chk('VD1 M thuộc tia đối của tia BC', d(M, C) > d(B, C) && d(M, C) > d(M, B)); eq('VD1 MB = BC', d(M, B), d(B, C)); eq('VD1 MB/MC', d(M, B) / d(M, C), 1 / 2); eq('VD1 tích', (d(M, B) / d(M, C)) * 3 * (4 / 6), 1)
}
{ // VD2: AF=4, FB=10, BD=6, DC=8, EC=10, EA=3
  const [A, B, C] = tamGiac(), F = lerp(A, B, 4 / 14), D = lerp(B, C, 6 / 14), E = lerp(C, A, 10 / 13), O = inter(A, D, B, E)
  eq('VD2 tích tỉ số', (6 / 8) * (10 / 3) * (4 / 10), 1); chk('VD2 C, O, F thẳng hàng', col(C, O, F)); eq('VD2 EA', 10 / ((8 / 6) * (10 / 4)), 3)
}
{ // VD3: DB = 2DC, E trung điểm AD, F = BE ∩ AC ⇒ FA/FC = 2/3
  for (let t = 0; t < 50; t++) {
    const [A, B, C] = tamGiac(), D = lerp(B, C, 2 / 3), E = lerp(A, D, 0.5), F = inter(B, E, A, C)
    eq('VD3 FA/FC = 2/3', d(F, A) / d(F, C), 2 / 3); eq('VD3 BD/BC = 2/3', d(B, D) / d(B, C), 2 / 3); chk('VD3 F thuộc cạnh AC', trong(F, A, C)); eq('VD3 Mê-nê-la-uýt tam giác ADC', (d(B, D) / d(B, C)) * (d(F, C) / d(F, A)) * (d(E, A) / d(E, D)), 1)
  }
}
{ // VD4: ba trung tuyến đồng quy; VD5: ba phân giác trong đồng quy, tích tỉ số = 1
  for (let t = 0; t < 50; t++) {
    const [A, B, C] = tamGiac(), Dm = lerp(B, C, 0.5), Em = lerp(C, A, 0.5), Fm = lerp(A, B, 0.5)
    chk('VD4 trung tuyến đồng quy', col(inter(A, Dm, B, Em), Fm, C))
    const bis = (V, X, Y) => lerp(X, Y, d(V, X) / (d(V, X) + d(V, Y))), D = bis(A, B, C), E = bis(B, C, A), F = bis(C, A, B)
    eq('VD5 DB/DC = AB/AC', d(D, B) / d(D, C), d(A, B) / d(A, C)); eq('VD5 EC/EA = BC/BA', d(E, C) / d(E, A), d(B, C) / d(B, A)); eq('VD5 FA/FB = CA/CB', d(F, A) / d(F, B), d(C, A) / d(C, B))
    eq('VD5 tích = 1', (d(D, B) / d(D, C)) * (d(E, C) / d(E, A)) * (d(F, A) / d(F, B)), 1); chk('VD5 đồng quy', col(inter(A, D, B, E), F, C))
  }
}
{ // VD6: chân ba phân giác ngoài (tam giác ba cạnh khác nhau) thẳng hàng, đều nằm ngoài cạnh
  for (let t = 0; t < 80; t++) {
    const [A, B, C] = tamGiac(), a = d(B, C), b = d(C, A), c = d(A, B)
    if (Math.abs(a - b) < 0.3 || Math.abs(b - c) < 0.3 || Math.abs(c - a) < 0.3) continue
    const unit = (u) => P(u.x / len(u), u.y / len(u)), ngoaiDir = (V, X, Y) => sub(unit(sub(X, V)), unit(sub(Y, V)))
    const M = inter(A, add(A, ngoaiDir(A, B, C)), B, C), N = inter(B, add(B, ngoaiDir(B, C, A)), C, A), Pp = inter(C, add(C, ngoaiDir(C, A, B)), A, B)
    eq('VD6 MB/MC = AB/AC', d(M, B) / d(M, C), c / b); eq('VD6 NC/NA = BC/BA', d(N, C) / d(N, A), a / c); eq('VD6 PA/PB = CA/CB', d(Pp, A) / d(Pp, B), b / a)
    chk('VD6 ba điểm ngoài cạnh', !trong(M, B, C) && !trong(N, C, A) && !trong(Pp, A, B)); eq('VD6 tích = 1', mene(A, B, C, M, N, Pp), 1); chk('VD6 thẳng hàng', col(M, N, Pp))
  }
}
console.log(`kiem-xeva: ${ok} phép kiểm đạt, ${fail} FAIL`)
