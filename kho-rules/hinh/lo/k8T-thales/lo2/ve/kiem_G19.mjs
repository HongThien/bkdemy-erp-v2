// kiem_G19.mjs — verify số cho VHB2 §13 BT 198–207 (trạm G19). Chạy: node kiem_G19.mjs
// Dựng toạ độ số ĐỘC LẬP với ve_G19.mjs; mỗi bài thử nhiều bộ toạ độ ngẫu nhiên (điểm "bất kì").
let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) pass++; else { fail++; console.log('FAIL', msg) } }
const near = (a, b, msg, eps = 1e-7) => ok(Math.abs(a - b) < eps * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)
const V = (x, y) => ({ x, y })
const sub = (a, b) => V(a.x - b.x, a.y - b.y), add = (a, b) => V(a.x + b.x, a.y + b.y), mul = (a, k) => V(a.x * k, a.y * k)
const dot = (a, b) => a.x * b.x + a.y * b.y, cr = (a, b) => a.x * b.y - a.y * b.x
const len = (a) => Math.hypot(a.x, a.y), d = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => add(a, mul(sub(b, a), t)), mid = (a, b) => lerp(a, b, 0.5)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const foot = (p, a, b) => lerp(a, b, dot(sub(p, a), sub(b, a)) / dot(sub(b, a), sub(b, a)))
const par = (a, b, c, e, msg) => near(cr(sub(b, a), sub(e, c)), 0, msg + ' (song song)', 1e-6)
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const N = 8 // số bộ ngẫu nhiên mỗi bài

// ───── 198 ─────
for (let it = 0; it < N; it++) {
  const s = R(2, 9), rot = R(0, 6.28)
  const B = V(0, 0), C = V(s, 0), A = V(s / 2, s * Math.sqrt(3) / 2)
  const rr = (p) => V(p.x * Math.cos(rot) - p.y * Math.sin(rot), p.x * Math.sin(rot) + p.y * Math.cos(rot))
  const [a, b, c] = [A, B, C].map(rr)
  const G = V((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3)
  // M bất kì trong tam giác (toạ độ trọng tâm ngẫu nhiên), M ≠ G
  let u = R(0.05, 1), v = R(0.05, 1), w = R(0.05, 1); const S = u + v + w; u /= S; v /= S; w /= S
  const M = add(add(mul(a, u), mul(b, v)), mul(c, w))
  if (d(M, G) < 1e-3) continue
  const A1 = inter(G, M, b, c), B1 = inter(G, M, a, c), C1 = inter(G, M, a, b)
  const sum = d(A1, M) / d(A1, G) + d(B1, M) / d(B1, G) + d(C1, M) / d(C1, G)
  near(sum, 3, '198 tổng 3')
  const D = mid(b, c), E = mid(c, a), F = mid(a, b)
  const D1 = foot(M, b, c), E1 = foot(M, c, a), F1 = foot(M, a, b)
  const h = d(a, D)
  near(d(G, D), h / 3, '198 GD=h/3'); near(d(G, E), h / 3, '198 GE'); near(d(G, F), h / 3, '198 GF')
  ok(dot(sub(G, D), sub(c, b)) < 1e-6 * s * s, '198 GD⊥BC')
  near(d(A1, M) / d(A1, G), d(M, D1) / d(G, D), '198 Thalès A′')
  near(d(B1, M) / d(B1, G), d(M, E1) / d(G, E), '198 Thalès B′')
  near(d(C1, M) / d(C1, G), d(M, F1) / d(G, F), '198 Thalès C′')
  near(d(M, D1) + d(M, E1) + d(M, F1), h, '198 MD′+ME′+MF′=h')
  // PQ ∥ BC qua M
  const P = inter(M, add(M, sub(c, b)), a, b), Q = inter(M, add(M, sub(c, b)), a, c), K = inter(M, add(M, sub(c, b)), a, D)
  near(d(a, P), d(a, Q), '198 APQ cân'); near(d(P, Q), d(a, P), '198 APQ đều')
  near(d(M, F1), d(P, M) * Math.sqrt(3) / 2, '198 MF′=PM√3/2'); near(d(M, E1), d(M, Q) * Math.sqrt(3) / 2, '198 ME′=MQ√3/2')
  near(d(P, F1), d(P, M) / 2, '198 PF′=PM/2')
  near(d(a, K), d(P, Q) * Math.sqrt(3) / 2, '198 AK'); near(d(M, D1), d(K, D), '198 MD′=KD')
  near(d(a, K) + d(K, D), h, '198 AK+KD=AD')
  near(d(M, F1) + d(M, E1), d(a, K), '198 ME′+MF′=AK')
}

// ───── 199 ─────
for (let it = 0; it < N; it++) {
  const s = R(2, 9), k = R(0.2, 4)
  const A = V(0, 0), B = V(0, s), C = V(s, 0)
  const t = k / (1 + k) // DA/AB
  const D = lerp(A, B, t), E = lerp(B, C, t), F = lerp(C, A, t)
  near(d(D, A) / d(D, B), k, '199 DA/DB'); near(d(E, B) / d(E, C), k, '199 EB/EC'); near(d(F, C) / d(F, A), k, '199 FC/FA')
  const H = foot(E, A, B)
  par(E, H, A, C, '199 HE∥AC')
  near(d(H, E), d(D, A), '199 HE=DA'); near(d(B, H), d(D, A), '199 BH=DA'); near(d(C, F), d(D, A), '199 CF=DA')
  near(d(A, H), d(D, B), '199 AH=DB'); near(d(A, F), d(D, B), '199 AF=DB'); near(d(A, H), d(A, F), '199 AH=AF')
  near(d(A, E), d(D, F), '199 AE=DF')
  near(dot(sub(E, A), sub(F, D)), 0, '199 AE⊥DF', 1e-6)
  // tam giác AHE = FAD : AH=FA, góc vuông, HE=AD
  near(d(H, E), d(A, D), '199 HE=AD'); near(d(A, H), d(F, A), '199 AH=FA')
  // ∠HAE = ∠AFD
  const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
  near(ang(A, H, E), ang(F, A, D), '199 ∠HAE=∠AFD')
}

// ───── 203 ─────
for (let it = 0; it < N; it++) {
  const th = R(0.3, 2.8), kk = R(1, 6) // góc xOy, k
  const ux = V(1, 0), uy = V(Math.cos(th), Math.sin(th))
  const O = V(0, 0)
  const Dfix = mul(uy, kk), Cfix = add(Dfix, mul(ux, kk))
  for (let j = 0; j < 4; j++) {
    const OA = R(kk * 1.05, kk * 8)           // 1/OB = 1/k − 1/OA > 0 ⇒ OA > k
    const OB = 1 / (1 / kk - 1 / OA)
    const A = mul(ux, OA), B = mul(uy, OB)
    near(1 / OA + 1 / OB, 1 / kk, '203 gt')
    near(cr(sub(B, A), sub(Cfix, A)), 0, '203 AB qua C cố định', 1e-6)
    // C = AB ∩ phân giác
    const bis = add(ux, uy)
    const Cz = inter(A, B, O, bis)
    near(Cz.x, Cfix.x, '203 C x'); near(Cz.y, Cfix.y, '203 C y')
    const D = inter(Cz, add(Cz, ux), O, uy)
    near(d(O, D), d(D, Cz), '203 OD=DC'); near(d(O, D), kk, '203 a=k')
    near(d(D, Cz) / OA, d(B, D) / OB, '203 Thalès DC/OA=BD/BO')
    ok(d(O, D) < OB, '203 D thuộc đoạn OB')
  }
}

// ───── 204 ─────
for (let it = 0; it < N; it++) {
  const h = R(2, 5), x0 = R(-1, 1)
  const D = V(0, 0), C = V(R(6, 12), 0), A = V(x0 + R(0, 2), h), B = add(A, V(R(2, 5), 0)) // AB ∥ DC, ngang
  const lenAB = d(A, B), lenCD = d(C, D)
  const E = lerp(D, A, 1 / 3), F = lerp(B, C, 1 / 3)
  near(d(D, E) / d(D, A), 1 / 3, '204 DE/DA'); near(d(B, F) / d(B, C), 1 / 3, '204 BF/BC')
  const M = inter(E, F, B, D), Nn = inter(E, F, A, C)
  // M, N nằm giữa E, F
  const tM = dot(sub(M, E), sub(F, E)) / dot(sub(F, E), sub(F, E)), tN = dot(sub(Nn, E), sub(F, E)) / dot(sub(F, E), sub(F, E))
  ok(tM > 0 && tM < 1 && tN > 0 && tN < 1, '204 M, N nằm giữa E, F')
  near(d(E, M), d(Nn, F), '204 EM=NF')
  // các bước
  const Pp = inter(E, add(E, sub(B, A)), B, D), Rr = inter(F, add(F, sub(B, A)), B, D)
  near(d(D, Pp) / d(D, B), 1 / 3, '204 DP/DB=1/3'); near(d(E, Pp), lenAB / 3, '204 EP=AB/3')
  near(d(B, Rr) / d(B, D), 1 / 3, '204 BR/BD=1/3'); near(d(F, Rr), lenCD / 3, '204 FR=CD/3')
  near(d(E, M) / d(M, F), lenAB / lenCD, '204 EM/MF=AB/CD')
  const P2 = inter(E, add(E, sub(B, A)), A, C), R2 = inter(F, add(F, sub(B, A)), A, C)
  near(d(E, P2), 2 / 3 * lenCD, '204 EP′=2/3 DC'); near(d(F, R2), 2 / 3 * lenAB, '204 FR′=2/3 AB')
  near(d(A, E) / d(A, D), 2 / 3, '204 AE/AD'); near(d(C, F) / d(C, B), 2 / 3, '204 CF/CB')
  near(d(Nn, F) / d(Nn, E), lenAB / lenCD, '204 NF/NE=AB/CD')
  near(d(M, F), d(Nn, E), '204 MF=NE')
}
// thử thêm hình thang không có đáy ngang (đáy bất kì hướng)
for (let it = 0; it < 4; it++) {
  const th = R(0, 3), u = V(Math.cos(th), Math.sin(th)), nrm = V(-u.y, u.x)
  const D = V(0, 0), C = mul(u, R(6, 12)), A = add(mul(nrm, R(2, 5)), mul(u, R(-1, 2))), B = add(A, mul(u, R(2, 5)))
  const E = lerp(D, A, 1 / 3), F = lerp(B, C, 1 / 3)
  const M = inter(E, F, B, D), Nn = inter(E, F, A, C)
  near(d(E, M), d(Nn, F), '204 (đáy xiên) EM=NF')
}

// ───── 205a ─────
for (let it = 0; it < N; it++) {
  const A = V(R(-3, 3), R(3, 8)), B = V(R(-8, -2), 0), C = V(R(2, 8), 0)
  const A1 = lerp(B, C, 1.5), B1 = lerp(C, A, 0.25)
  near(d(B, A1) / d(A1, C), 3, '205a BA′:A′C=3'); near(d(C, B1) / d(B1, A), 1 / 3, '205a CB′:B′A=1:3')
  ok(dot(sub(A1, C), sub(C, B)) > 0, '205a A′ trên tia đối của tia CB')
  const C1 = inter(A1, B1, A, B)
  near(d(C1, A), d(C1, B), '205a C′A=C′B'); near(d(A, B) / 2, d(C1, A), '205a C′ trung điểm')
  const K = inter(C, add(C, sub(B, A)), A1, B1)
  near(d(C, K) / d(B, C1), d(A1, C) / d(A1, B), '205a CK/BC′=A′C/A′B'); near(d(A1, C) / d(A1, B), 1 / 3, '205a =1/3')
  near(d(C, K) / d(A, C1), d(B1, C) / d(B1, A), '205a CK/AC′=B′C/B′A'); near(d(B1, C) / d(B1, A), 1 / 3, '205a =1/3 (2)')
  near(d(C, K) / d(B, C1), 1 / 3, '205a CK/BC′'); near(d(C, K) / d(A, C1), 1 / 3, '205a CK/AC′')
}

// ───── 206b ─────
const inSeg = (p, a, b) => { const t = dot(sub(p, a), sub(b, a)) / dot(sub(b, a), sub(b, a)); return t > 0 && t < 1 }
let dem = 0
for (let it = 0; it < 4000 && dem < N * 3; it++) {
  const A = V(R(-2, 2), R(3, 8)), B = V(R(-8, -2), 0), C = V(R(2, 8), 0), O = V(R(-12, 12), R(-12, 14))
  const A1 = inter(O, A, B, C), B1 = inter(O, B, C, A), C1 = inter(O, C, A, B)
  if (![A1, B1, C1].every((p) => isFinite(p.x) && isFinite(p.y))) continue
  const ngoai = [inSeg(A1, B, C), inSeg(B1, C, A), inSeg(C1, A, B)].filter((v) => !v).length
  if (ngoai !== 2) continue
  dem++
  const prod = (d(A, B1) / d(B1, C)) * (d(C, A1) / d(A1, B)) * (d(B, C1) / d(C1, A))
  near(prod, 1, '206b tích =1 (cấu hình hai điểm ngoài)', 1e-6)
  const dir = sub(C, B)
  const Nn = inter(A, add(A, dir), B, B1), M = inter(A, add(A, dir), C, C1)
  near(d(A, B1) / d(B1, C), d(A, Nn) / d(B, C), '206b AB′/B′C=AN/BC', 1e-6)
  near(d(B, C1) / d(C1, A), d(B, C) / d(A, M), '206b BC′/C′A=BC/AM', 1e-6)
  near(d(C, A1) / d(A1, B), d(M, A) / d(A, Nn), '206b CA′/A′B=MA/AN', 1e-6)
  // MA/CA′ = OA/OA′ = AN/A′B
  near(d(M, A) / d(C, A1), d(O, A) / d(O, A1), '206b MA/CA′=OA/OA′', 1e-6)
  near(d(A, Nn) / d(A1, B), d(O, A) / d(O, A1), '206b AN/A′B=OA/OA′', 1e-6)
}
ok(dem >= N, '206b số cấu hình thử ' + dem)

// ───── hình khớp đề: toạ độ hình trong ve_G19.mjs (đối chiếu ngắn) ─────
{
  // 205a: B = (30,270), C = (290,270), A′ = B + 1.5(C−B), B′ = C + 0.25(A−C) ⇒ C′ là trung điểm AB (đã in ở ve_G19)
  const A = V(120, 40), B = V(30, 270), C = V(290, 270)
  const A1 = lerp(B, C, 1.5), B1 = lerp(C, A, 0.25), C1 = inter(A1, B1, A, B)
  near(C1.x, mid(A, B).x, 'hình 205a C′ trung điểm x'); near(C1.y, mid(A, B).y, 'hình 205a C′ y')
}
console.log(`PASS ${pass} · FAIL ${fail}`)
process.exit(fail ? 1 : 0)
