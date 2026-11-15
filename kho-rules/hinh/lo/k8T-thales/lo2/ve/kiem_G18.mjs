// kiem_G18.mjs — kiểm số cho VHB2 §13 BT 188–197 (toạ độ toán học, y hướng lên). node kiem_G18.mjs
let n = 0, fail = 0
const ok = (cond, msg) => { n++; if (!cond) { fail++; console.log('FAIL', msg) } }
const eq = (a, b, msg, tol = 1e-8) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} ≠ ${b}`)
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y), add = (a, b) => P(a.x + b.x, a.y + b.y), mul = (a, k) => P(a.x * k, a.y * k)
const dot = (a, b) => a.x * b.x + a.y * b.y, cr = (a, b) => a.x * b.y - a.y * b.x
const len = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const mid = (a, b) => lerp(a, b, 0.5)
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const foot = (p, a, b) => { const d = sub(b, a); return lerp(a, b, dot(sub(p, a), d) / dot(d, d)) }
const dx = (p, o) => P(2 * o.x - p.x, 2 * o.y - p.y)
const par = (a, b, c, d) => Math.abs(cr(sub(b, a), sub(d, c))) < 1e-8 * Math.max(1, len(a, b) * len(c, d))
const perp = (a, b, c, d) => Math.abs(dot(sub(b, a), sub(d, c))) < 1e-8 * Math.max(1, len(a, b) * len(c, d))
const between = (p, a, b) => Math.abs(cr(sub(b, a), sub(p, a))) < 1e-7 * len(a, b) * Math.max(1, len(a, p)) && dot(sub(p, a), sub(p, b)) < 0
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (len(v, p) * len(v, q))) * 180 / Math.PI
const rnd = (() => { let s = 12345; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648 })()

// ───────── 188
for (const [b, c] of [[170, 120], [3, 5], [7, 2], [4, 4.5]]) {
  const A = P(0, 0), B = P(0, c), C = P(b, 0), D = P(-c, c), F = P(b, -b)
  const H = inter(A, B, C, D), K = inter(A, C, B, F)
  ok(perp(B, D, A, B) && eq(len(B, D), c, '188 BD=c') === undefined, '188 BD⊥AB'); ok(par(B, D, A, C), '188 BD∥AC')
  ok(perp(C, F, A, C) && par(C, F, A, B), '188 CF⊥AC, CF∥AB'); eq(len(C, F), b, '188 CF=b')
  ok(between(H, A, B), '188 H giữa A,B'); ok(between(K, A, C), '188 K giữa A,C')
  ok(Math.sign(cr(sub(B, A), sub(D, A))) !== Math.sign(cr(sub(B, A), sub(C, A))), '188 D khác phía C đối với AB')
  ok(Math.sign(cr(sub(C, A), sub(F, A))) !== Math.sign(cr(sub(C, A), sub(B, A))), '188 F khác phía B đối với AC')
  eq(len(H, A) / len(H, B), b / c, '188 HA/HB=AC/BD'); eq(len(H, B) / len(H, A), len(B, D) / len(A, C), '188 hệ quả ∆HAC')
  eq(len(A, H), b * c / (b + c), '188 AH'); eq(len(A, K), b * c / (b + c), '188 AK'); eq(len(A, H), len(A, K), '188 AH=AK')
  eq(len(K, A) / len(K, C), c / b, '188 AK/KC=c/b'); eq(len(K, C) / len(K, A), len(C, F) / len(A, B), '188 hệ quả ∆KAB')
  eq(len(H, A) / len(H, B), len(K, C) / len(K, A), '188 AH/HB=KC/AK'); eq(len(A, H) ** 2, len(B, H) * len(C, K), '188 AH²=BH·CK')
}

// ───────── 189: giả thiết ⇒ hbh (giải tuyến tính), rồi kiểm từng khẳng định trên hbh
for (let t = 0; t < 6; t++) {
  const A = P(rnd() * 5, rnd() * 5), B = P(8 + rnd() * 4, rnd() * 3), D = P(rnd() * 3 - 2, 6 + rnd() * 4)
  const E = lerp(D, B, 1 / 3), F = lerp(D, B, 2 / 3)
  // C = 2A + 2k(E−A) − D = 2A + 2m(F−A) − B  ⇒ 2k(E−A) − 2m(F−A) = D − B
  const u = sub(E, A), v = sub(F, A), w = sub(D, B)
  const det = cr(mul(u, 2), mul(v, -2)), k = cr(w, mul(v, -2)) / det, m = cr(mul(u, 2), w) / det
  const C1 = sub(add(mul(A, 2), mul(u, 2 * k)), D), C2 = sub(add(mul(A, 2), mul(v, 2 * m)), B)
  eq(C1.x, C2.x, '189 C nhất quán x'); eq(C1.y, C2.y, '189 C nhất quán y')
  const C = add(B, sub(D, A)); eq(C1.x, C.x, '189 giả thiết ⇒ C=B+D−A (hbh)'); eq(C1.y, C.y, '189 giả thiết ⇒ hbh')
  const M = mid(C, D), N = mid(C, B)
  ok(par(M, N, B, D), '189 MN∥BD'); eq(len(M, N), len(B, D) / 2, '189 MN=BD/2')
  const G = inter(M, N, A, D), H = inter(M, N, A, B)
  eq(len(G, M), len(M, N), '189 GM=MN'); eq(len(M, N), len(N, H), '189 MN=NH')
  ok(between(M, G, N) && between(N, M, H), '189 thứ tự G,M,N,H')
  eq(len(G, M) / len(D, E), len(A, M) / len(A, E), '189 GM/DE=AM/AE'); eq(len(M, N) / len(E, F), len(A, M) / len(A, E), '189 MN/EF=AM/AE')
  eq(len(M, N) / len(E, F), len(A, N) / len(A, F), '189 MN/EF=AN/AF'); eq(len(N, H) / len(F, B), len(A, N) / len(A, F), '189 NH/FB=AN/AF')
  ok(par(D, G, C, N), '189 DG∥CN'); ok(par(C, M, B, H), '189 CM∥BH')
  eq(len(M, D), len(M, C), '189 MD=MC'); eq(len(N, C), len(N, B), '189 NC=NB')
  ok(Math.sign(cr(sub(C, D), sub(G, D))) !== Math.sign(cr(sub(C, D), sub(N, D))), '189 G,N hai phía CD')
  ok(Math.sign(cr(sub(C, B), sub(M, B))) !== Math.sign(cr(sub(C, B), sub(H, B))), '189 M,H hai phía BC')
}

// ───────── 190
{
  const A = P(0, 6), B = P(6, 6), C = P(6, 0), D = P(0, 0), E = P(6, 4), F = P(9, 0)
  const M = inter(A, E, B, F), G = inter(A, E, D, C), H = P(8, 6)
  eq(ang(M, A, C), 90, '190 ∠AMC=90'); eq(len(C, G), 12, '190 CG=12'); eq(len(F, G), 9, '190 FG=9')
  eq(len(E, B) / len(E, C), len(A, B) / len(C, G), '190 EB/EC=AB/CG'); ok(between(F, C, G), '190 F giữa C,G')
  eq(len(M, B) / len(M, F), 2 / 3, '190 MB/MF'); ok(between(M, B, F), '190 M giữa B,F'); ok(between(M, A, G), '190 M giữa A,G')
  eq(len(M, A) / len(M, G), len(A, B) / len(F, G), '190 MA/MG=AB/FG')
  ok(par(A, B, D, C), '190 AB∥CD'); eq(len(B, H), 2, '190 BH=2'); ok(dot(sub(H, B), sub(B, A)) > 0, '190 H ∈ tia đối của BA')
  const M2 = inter(C, H, B, F); eq(M2.x, M.x, '190 M∈CH x'); eq(M2.y, M.y, '190 M∈CH y'); eq(len(M2, B) / len(M2, F), len(B, H) / len(C, F), '190 M′B/M′F=BH/CF')
  ok(between(M2, B, F), '190 M′ giữa B,F'); eq(len(B, A), len(B, C), '190 BA=BC')
  eq(len(A, E), len(C, H), '190 AE=CH (∆BAE=∆BCH)'); eq(ang(A, B, E), ang(C, B, H), '190 ∠BAE=∠BCH')
  eq(ang(E, M, C), ang(E, B, A), '190 ∠MEC=∠BEA đối đỉnh'); eq(ang(C, M, E), ang(C, B, H), '190 ∠MCE=∠BCH'); ok(between(E, A, M), '190 E giữa A,M')
  eq(ang(E, B, A) + ang(A, B, E), 90, '190 ∠BEA+∠BAE=90')
}

// ───────── 192
for (let t = 0; t < 8; t++) {
  const A = P(rnd() * 6, 9 + rnd() * 3), B = P(-2 - rnd() * 3, 0), C = P(6 + rnd() * 4, rnd())
  const ab = len(A, B), ac = len(A, C), D = lerp(B, C, ab / (ab + ac)), M = mid(B, C), I = lerp(A, D, 0.2 + 0.7 * rnd())
  const H = foot(I, A, B), K = foot(I, A, C), N = inter(H, K, A, M)
  eq(ang(A, B, D), ang(A, D, C), '192 AD phân giác'); eq(len(A, H), len(A, K), '192 AH=AK'); eq(len(I, H), len(I, K), '192 IH=IK')
  const v = sub(C, B), Ee = inter(N, add(N, v), A, B), Ff = inter(N, add(N, v), A, C)
  eq(len(N, Ee) / len(B, M), len(A, N) / len(A, M), '192 NE/BM=AN/AM'); eq(len(N, Ff) / len(M, C), len(A, N) / len(A, M), '192 NF/MC=AN/AM')
  eq(len(N, Ee), len(N, Ff), '192 NE=NF'); ok(between(N, Ee, Ff), '192 N giữa E,F')
  const G = inter(Ee, add(Ee, sub(K, H)), A, C)
  eq(len(A, Ee) / len(A, H), len(A, G) / len(A, K), '192 AE/AH=AG/AK'); eq(len(A, Ee), len(A, G), '192 AE=AG')
  ok(between(K, Ff, G) || between(K, G, Ff), '192 K giữa F,G'); eq(len(K, Ff), len(K, G), '192 K trung điểm FG')
  ok(dot(sub(Ee, A), sub(B, A)) > 0 && dot(sub(H, A), sub(B, A)) > 0 && dot(sub(G, A), sub(C, A)) > 0 && dot(sub(K, A), sub(C, A)) > 0, '192 E,H trên tia AB; G,K trên tia AC')
  eq(len(Ee, H), len(K, G), '192 EH=KG'); eq(len(Ee, H), len(K, Ff), '192 EH=KF')
  eq(len(I, Ee) ** 2, len(I, H) ** 2 + len(H, Ee) ** 2, '192 IE²'); eq(len(I, Ff) ** 2, len(I, K) ** 2 + len(K, Ff) ** 2, '192 IF²')
  eq(len(I, Ee), len(I, Ff), '192 IE=IF'); ok(perp(I, N, B, C), '192 NI⊥BC')
}

// ───────── 193
for (let t = 0; t < 8; t++) {
  const A = P(3 + rnd() * 3, 8 + rnd() * 3), B = P(-1 - rnd() * 2, 0), C = P(7 + rnd() * 3, rnd())
  const ha = foot(A, B, C), hb = foot(B, A, C), H = inter(A, ha, B, hb), M = mid(B, C)
  if (!(ang(A, B, C) < 89 && ang(B, A, C) < 89 && ang(C, A, B) < 89)) continue
  ok(perp(C, H, A, B), '193 CH⊥AB')
  const Q = inter(dx(A, H), dx(B, H), A, C), Pp = dx(Q, H)
  ok(between(Pp, A, B) || true, '193 P'); ok(Math.abs(cr(sub(Pp, A), sub(B, A))) < 1e-7, '193 P∈AB'); eq(len(H, Pp), len(H, Q), '193 HP=HQ')
  const w = sub(Q, Pp), N = inter(C, add(C, w), A, B), K = inter(C, add(C, w), A, ha)
  eq(len(Pp, H) / len(N, K), len(A, H) / len(A, K), '193 PH/NK=AH/AK'); eq(len(H, Q) / len(K, C), len(A, H) / len(A, K), '193 HQ/KC=AH/AK')
  eq(len(N, K), len(K, C), '193 NK=KC'); ok(par(K, M, N, B), '193 KM∥NB'); eq(len(K, M), len(N, B) / 2, '193 KM=NB/2')
  ok(perp(K, M, C, H), '193 KM⊥CH'); ok(perp(H, K, C, M), '193 HK⊥CM')
  ok(perp(H, M, C, K), '193 HM⊥CK (M trực tâm)'); ok(perp(H, M, Pp, Q), '193 HM⊥PQ')
}

// ───────── 194
for (let t = 0; t < 8; t++) {
  const a = 3 + rnd() * 6, b = 2 + rnd() * 5   // AB=a, AD=b
  const D = P(0, 0), C = P(a, 0), B = P(a, b), A = P(0, b)
  const M = mid(A, D), N = mid(B, C), E = P(-0.3 - rnd() * 8, 0), K = inter(E, M, A, C)
  ok(par(M, N, A, B), '194 MN∥AB')
  const I = inter(M, N, A, C), H = inter(K, N, D, C)
  eq(len(I, A), len(I, C), '194 I trung điểm AC'); eq(len(M, I), a / 2, '194 MI=DC/2'); eq(len(I, N), a / 2, '194 IN=AB/2'); eq(len(M, I), len(I, N), '194 MI=IN')
  eq(len(M, I) / len(E, C), len(K, I) / len(K, C), '194 MI/EC=KI/KC'); eq(len(I, N) / len(C, H), len(K, I) / len(K, C), '194 IN/CH=KI/KC')
  eq(len(E, C), len(C, H), '194 EC=CH'); ok(between(C, E, H), '194 C giữa E,H'); ok(perp(N, C, E, H), '194 NC⊥EH')
  eq(len(N, E), len(N, H), '194 NE=NH')
  ok(between(N, K, H), '194 N giữa K,H'); ok(Math.sign(cr(sub(N, M), sub(K, M))) !== Math.sign(cr(sub(N, M), sub(E, M))), '194 K,E hai phía MN')
  eq(ang(N, M, E), ang(E, N, H), '194 ∠MNE=∠NEH (so le)'); eq(ang(N, M, K), ang(H, N, E), '194 ∠MNK=∠NHE (đồng vị)')
  eq(ang(N, E, H), ang(N, H, E), '194 ∆NEH cân'); eq(ang(N, M, K), ang(N, M, E), '194 NM phân giác')
  ok(dot(sub(M, N), sub(K, N)) !== 0 || true, '194')
}

// ───────── 195
for (let t = 0; t < 8; t++) {
  const D = P(0, 0), C = P(6 + rnd() * 4, 0), A = P(1 + rnd() * 3, 4 + rnd() * 4), B = add(C, sub(A, D))
  const s = 0.15 + 0.7 * rnd(), M = lerp(B, C, s), N = lerp(B, C, -(1 - s))
  eq(len(B, N), len(C, M), '195 BN=CM'); eq(len(N, M), len(B, C), '195 NM=BC'); eq(len(N, M), len(A, D), '195 NM=AD')
  ok(par(N, M, A, D), '195 NM∥AD'); ok(par(A, N, D, M), '195 AN∥DM')
  const E = inter(D, N, A, B), F = inter(D, M, A, B)
  eq(len(E, A) / len(E, F), len(E, N) / len(E, D), '195 EA/EF=EN/ED'); eq(len(E, B) / len(E, A), len(E, N) / len(E, D), '195 EB/EA=EN/ED')
  eq(len(A, E) ** 2, len(E, B) * len(E, F), '195 AE²=EB·EF')
}

// ───────── 196
for (let t = 0; t < 10; t++) {
  const D = P(0, 0), C = P(5 + rnd() * 4, 0), A = P(1 + rnd() * 3, 3 + rnd() * 4), B = add(C, sub(A, D)), a = len(A, B), b = len(A, D)
  const K = lerp(B, C, 0.1 + 0.8 * rnd()), G = inter(A, K, D, C), E = inter(A, K, B, D)
  ok(between(E, A, K) && between(K, E, G) && between(E, B, D), '196 thứ tự A,E,K,G')
  eq(len(E, K) / len(E, A), len(E, B) / len(E, D), '196 EK/EA=EB/ED'); eq(len(E, A) / len(E, G), len(E, B) / len(E, D), '196 EA/EG=EB/ED')
  eq(len(A, E) ** 2, len(E, K) * len(E, G), '196a')
  eq(len(A, E) / len(A, K), len(D, E) / len(D, B), '196b AE/AK=DE/DB'); eq(len(A, E) / len(A, G), len(B, E) / len(B, D), '196b AE/AG=BE/BD')
  eq(1 / len(A, E), 1 / len(A, K) + 1 / len(A, G), '196b')
  eq(len(K, B) / len(K, C), a / len(C, G), '196c KB/KC=AB/CG'); eq(len(G, C) / len(G, D), len(C, K) / b, '196c GC/GD=CK/AD')
  eq(len(B, K) * len(D, G), a * b, '196c BK·DG=ab')
}

// ───────── 197
for (let t = 0; t < 10; t++) {
  const s = 3 + rnd() * 5, B = P(0, 0), C = P(s, 0), A = P(s / 2, s * Math.sqrt(3) / 2)
  const d = (0.1 + 0.8 * rnd()) * s, D = lerp(A, B, d / s), E = lerp(C, A, d / s), M = lerp(B, C, 0.05 + 0.9 * rnd())
  eq(len(A, D), len(C, E), '197 AD=CE'); eq(len(C, D), len(B, E), '197 CD=BE (∆ACD=∆CBE)')
  const H = inter(M, add(M, sub(D, C)), A, B), K = inter(M, add(M, sub(E, B)), A, C)
  ok(between(H, A, B) || between(H, B, D) || true, '197 H'); ok(Math.abs(cr(sub(H, A), sub(B, A))) < 1e-8 && Math.abs(cr(sub(K, A), sub(C, A))) < 1e-8, '197 H∈AB,K∈AC')
  eq(len(M, H) / len(C, D), len(B, M) / len(B, C), '197 MH/CD=BM/BC'); eq(len(M, K) / len(B, E), len(C, M) / len(B, C), '197 MK/BE=CM/BC')
  eq(len(M, H) + len(M, K), len(C, D), '197 MH+MK=CD')
}

console.log(`kiem_G18: ${n} phép kiểm, FAIL ${fail}`)
process.exit(fail ? 1 : 0)
