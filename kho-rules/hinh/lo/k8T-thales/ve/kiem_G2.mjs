// kiem_G2.mjs — kiểm số cho NDT H1.24–27. node kiem_G2.mjs
let ok = 0, fail = 0
const chk = (ten, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', ten) } }
const eq = (a, b, e = 1e-7) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const V = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })
const dot = (u, v) => u.x * v.x + u.y * v.y
const cr = (u, v) => u.x * v.y - u.y * v.x
const len = (u) => Math.hypot(u.x, u.y)
const D = (a, b) => len(V(a, b))
const M2 = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
const par = (a, b, c, d) => Math.abs(cr(V(a, b), V(c, d))) < 1e-7 * len(V(a, b)) * len(V(c, d))
const perp = (a, b, c, d) => Math.abs(dot(V(a, b), V(c, d))) < 1e-7 * len(V(a, b)) * len(V(c, d))
const col = (a, b, c) => Math.abs(cr(V(a, b), V(a, c))) < 1e-7 * (1 + D(a, b) * D(a, c))
const ang = (v, p, q) => Math.acos(dot(V(v, p), V(v, q)) / D(v, p) / D(v, q)) * 180 / Math.PI
const lineInt = (a, b, c, d) => { const d1 = V(a, b), d2 = V(c, d); const t = cr(V(a, c), d2) / cr(d1, d2); return { x: a.x + t * d1.x, y: a.y + t * d1.y, t } }
const R = (a, b) => a + Math.random() * (b - a)
const Pt = (x, y) => ({ x, y })
const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const kqua = (a, b, c) => { const s = [cr(V(a, b), V(b, c))]; return s[0] }
const loi = (pts) => { let s0 = 0; for (let k = 0; k < pts.length; k++) { const c = cr(V(pts[k], pts[(k + 1) % pts.length]), V(pts[(k + 1) % pts.length], pts[(k + 2) % pts.length])); if (k === 0) s0 = Math.sign(c); else if (Math.sign(c) !== s0) return false } return true }

// ─────────── Bài 24 ───────────
for (let i = 0; i < 6; i++) {
  const A = Pt(R(-3, 3), R(3, 8)), B = Pt(R(-6, -1), 0), C = Pt(R(4, 9), 0)
  const Dd = M2(B, C), E = lerp(A, B, 1 / 3)               // BE = 2AE, E trên AB
  chk('24 BE=2AE', eq(D(B, E), 2 * D(A, E)))
  const Mm = lineInt(A, Dd, C, E); const M = { x: A.x + (Dd.x - A.x) * Mm.t, y: A.y + (Dd.y - A.y) * Mm.t }
  const N = M2(B, E)
  chk('24 AE=EN=NB', eq(D(A, E), D(E, N)) && eq(D(E, N), D(N, B)))
  chk('24 E trung điểm AN', eq(E.x, M2(A, N).x) && eq(E.y, M2(A, N).y))
  chk('24 DN//CE', par(Dd, N, C, E))
  chk('24 EM//DN (M trên CE)', par(E, M, Dd, N))
  chk('24 MA=MD', eq(D(M, A), D(M, Dd)))
  chk('24 M trong đoạn AD', Mm.t > 0 && Mm.t < 1)
}

// ─────────── Bài 25 ───────────
for (let i = 0; i < 6; i++) {
  const Dd = Pt(0, 0), C = Pt(R(5, 10), 0), A = Pt(0, R(3, 7)), B = Pt(R(1, 4.5), A.y)   // AB < CD, Â = D̂ = 90°
  chk('25 AB//CD', par(A, B, Dd, C))
  chk('25 AB⊥AD', perp(A, B, A, Dd))
  const M = M2(B, C), N = M2(A, Dd)
  chk('25 MN//AB (ĐTB hình thang)', par(M, N, A, B))
  chk('25 MN⊥AD', perp(M, N, A, Dd))
  chk('25 MN=(AB+CD)/2', eq(D(M, N), (D(A, B) + D(Dd, C)) / 2))
  chk('25 MA=MD', eq(D(M, A), D(M, Dd)))
}

// ─────────── Bài 26 ───────────
let c26 = 0, cfgM = 0, cfgN = 0
for (let i = 0; i < 4000; i++) {
  const Dd = Pt(0, 0), C = Pt(10, 0), A = Pt(R(-3, 8), R(1, 6))
  const Ln = D(A, Dd), th = R(30, 150) * Math.PI / 180
  const B = Pt(C.x + Ln * Math.cos(th), Ln * Math.sin(th))
  if (!loi([A, B, C, Dd])) continue
  const M = M2(A, B), N = M2(C, Dd)
  if (par(A, Dd, B, C) || par(M, N, A, Dd) || par(M, N, B, C)) continue
  const I = M2(B, Dd)
  chk('26 MI//AD', par(M, I, A, Dd)); chk('26 MI=AD/2', eq(D(M, I), D(A, Dd) / 2))
  chk('26 NI//BC', par(N, I, B, C)); chk('26 NI=BC/2', eq(D(N, I), D(B, C) / 2))
  chk('26 MI=NI', eq(D(M, I), D(N, I)))
  chk('26 IMN=INM', eq(ang(M, I, N), ang(N, I, M)))
  const E = lineInt(M, N, A, Dd), F = lineInt(M, N, B, C)
  const Ep = Pt(E.x, E.y), Fp = Pt(F.x, F.y)
  const sE = 1 - E.t, sF = 1 - F.t      // vị trí dọc N→M: N=0, M=1
  chk('26 E,F cùng phía (cả hai ngoài đoạn MN, cùng bên)', (sE > 1 && sF > 1) || (sE < 0 && sF < 0))
  chk('26 AEM=MFB', eq(ang(Ep, A, M), ang(Fp, M, B), 1e-6))
  if (sE > 1 && sF > 1) {            // cấu hình của hình vẽ: E, F nằm trên tia NM, phía M
    cfgM++
    chk('26 IMN=AEM (đồng vị)', eq(ang(M, I, N), ang(Ep, A, M), 1e-6))
    chk('26 INM=MFB (so le trong)', eq(ang(N, I, M), ang(Fp, M, B), 1e-6))
    chk('26 INM=NFC', eq(ang(N, I, M), ang(Fp, N, C), 1e-6))
    chk('26 tia FM trùng FN (M,N cùng phía F)', dot(V(Fp, M), V(Fp, N)) > 0)
    chk('26 B nằm giữa C và F; A nằm giữa D và E', dot(V(B, C), V(B, Fp)) < 0 && dot(V(A, Dd), V(A, Ep)) < 0)
    chk('26 I và C khác phía đường NF', cr(V(N, M), V(N, I)) * cr(V(N, M), V(N, C)) < 0)
    chk('26 I và D cùng phía... (đồng vị: I, D ở một phía đường EF)', cr(V(N, M), V(N, I)) * cr(V(N, M), V(N, Dd)) > 0)
  } else cfgN++
  c26++
}
console.log('26: số tứ giác thử', c26, '| E,F phía M:', cfgM, '| E,F phía N:', cfgN)

// ─────────── Bài 27a ───────────
for (let i = 0; i < 400; i++) {
  const Dd = Pt(0, 0), C = Pt(R(5, 10), 0), A = Pt(R(-2, 6), R(2, 7)), B = Pt(R(4, 12), R(2, 7))
  if (!loi([A, B, C, Dd])) continue
  const E = M2(A, Dd), F = M2(B, C), M = M2(A, C)
  chk('27a ME//CD', par(M, E, Dd, C)); chk('27a ME=CD/2', eq(D(M, E), D(Dd, C) / 2))
  chk('27a MF//AB', par(M, F, A, B)); chk('27a MF=AB/2', eq(D(M, F), D(A, B) / 2))
  chk('27a EF<=ME+MF', D(E, F) <= D(M, E) + D(M, F) + 1e-9)
  if (!par(A, B, Dd, C)) chk('27a không hình thang ⇒ EF<(AB+CD)/2', D(E, F) < (D(A, B) + D(Dd, C)) / 2 - 1e-9)
}
for (let i = 0; i < 200; i++) {            // hình thang AB // CD (đáy AB, CD)
  const Dd = Pt(0, 0), C = Pt(R(5, 12), 0), h = R(2, 6), A = Pt(R(-2, 6), h), B = Pt(A.x + R(1, 9), h)
  if (!loi([A, B, C, Dd])) continue
  const E = M2(A, Dd), F = M2(B, C), M = M2(A, C)
  chk('27a hình thang: EF=(AB+CD)/2', eq(D(E, F), (D(A, B) + D(Dd, C)) / 2))
  chk('27a hình thang: E,M,F thẳng hàng', col(E, M, F))
  chk('27a hình thang: M giữa E,F', dot(V(M, E), V(M, F)) < 0)
  chk('27a hình thang: EF//AB//CD', par(E, F, A, B) && par(E, F, Dd, C))
}
// thử vét: dò xem có tứ giác lồi không là hình thang mà EF=(AB+CD)/2 không (kiểm "điều kiện cần")
{
  let lech = 0, thu = 0
  for (let i = 0; i < 100000; i++) {
    const Dd = Pt(0, 0), C = Pt(R(3, 10), 0), A = Pt(R(-2, 8), R(1, 8)), B = Pt(R(2, 12), R(1, 8))
    if (!loi([A, B, C, Dd])) continue
    thu++
    const E = M2(A, Dd), F = M2(B, C)
    const dEF = D(E, F), s = (D(A, B) + D(Dd, C)) / 2
    if (Math.abs(dEF - s) < 1e-9 && !par(A, B, Dd, C) && Math.abs(cr(V(A, B), V(Dd, C))) > 1.0) lech++
  }
  chk('27a điều kiện cần: không có tứ giác lồi nào ngoài hình thang đạt EF=(AB+CD)/2 (' + thu + ' thử)', lech === 0)
}

// ─────────── Bài 27b ───────────
for (let i = 0; i < 300; i++) {
  const Dd = Pt(0, 0), CD = R(5, 12), C = Pt(CD, 0), h = R(2, 6), A = Pt(R(-2, 7), h)
  const ab = R(0.5, CD - 0.6), B = Pt(A.x + ab, h)             // AB < CD
  if (!loi([A, B, C, Dd])) continue
  const M = M2(A, B), N = M2(B, Dd), P = M2(A, C), Q = M2(C, Dd), I = M2(A, Dd)
  chk('27b MN//AD, MN=AD/2', par(M, N, A, Dd) && eq(D(M, N), D(A, Dd) / 2))
  chk('27b PQ//AD, PQ=AD/2', par(P, Q, A, Dd) && eq(D(P, Q), D(A, Dd) / 2))
  chk('27b MNQP hbh (M+Q=N+P)', eq(M.x + Q.x, N.x + P.x) && eq(M.y + Q.y, N.y + P.y))
  chk('27b NQ//MP', par(N, Q, M, P))
  chk('27b IN//AB', par(I, N, A, B)); chk('27b IP//CD', par(I, P, Dd, C))
  chk('27b I,N,P thẳng hàng', col(I, N, P)); chk('27b NP//CD', par(N, P, Dd, C))
  chk('27b NP=(CD-AB)/2 >0', eq(D(N, P), (D(Dd, C) - D(A, B)) / 2) && D(N, P) > 1e-9)
  // E: đường qua N ⊥ MN và đường qua P ⊥ MP
  const dN = { x: -(N.y - M.y), y: N.x - M.x }, dP = { x: -(P.y - M.y), y: P.x - M.x }
  const Ee = lineInt(N, { x: N.x + dN.x, y: N.y + dN.y }, P, { x: P.x + dP.x, y: P.y + dP.y })
  const E = Pt(Ee.x, Ee.y)
  chk('27b EN⊥MN, EP⊥MP', perp(E, N, M, N) && perp(E, P, M, P))
  chk('27b EN⊥PQ', perp(E, N, P, Q)); chk('27b EP⊥NQ', perp(E, P, N, Q))
  chk('27b QE⊥NP (E trực tâm)', perp(Q, E, N, P) || D(Q, E) < 1e-9)
  chk('27b QE⊥CD', perp(Q, E, Dd, C) || D(Q, E) < 1e-9)
  chk('27b EC=ED', eq(D(E, C), D(E, Dd)))
  chk('27b Q ∉ NP (NPQ không suy biến)', Math.abs(cr(V(N, P), V(N, Q))) > 1e-9)
}
console.log(`kiem_G2: ${ok} phép kiểm đạt, ${fail} FAIL`)
