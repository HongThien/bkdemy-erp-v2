// kiem_G23.mjs — verify toạ độ số cho VHB2 §15 (VD36, BT 219–228). Toạ độ toán học (y hướng lên). Chạy: node kiem_G23.mjs (từ <TH>)
let n = 0, fail = 0
const ok = (c, m) => { n++; if (!c) { fail++; console.log('FAIL:', m) } }
const eq = (a, b, m, tol = 1e-7) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${m}: ${a} vs ${b}`)
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const mul = (v, k) => P(v.x * k, v.y * k)
const dot = (u, v) => u.x * v.x + u.y * v.y
const cr = (u, v) => u.x * v.y - u.y * v.x
const len = (v) => Math.hypot(v.x, v.y)
const d = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const mid = (a, b) => lerp(a, b, 0.5)
const foot = (p, a, b) => { const v = sub(b, a); return lerp(a, b, dot(sub(p, a), v) / dot(v, v)) }
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-7 * len(sub(b, a)) * len(sub(e, c))
const ang = (v, p, q) => Math.acos(Math.max(-1, Math.min(1, dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q))))) * 180 / Math.PI
const between = (p, a, b) => Math.abs(d(a, p) + d(p, b) - d(a, b)) < 1e-7 * d(a, b) && d(a, p) > 1e-9 && d(p, b) > 1e-9
// chân phân giác trong từ v xuống cạnh pq : điểm chia pq theo tỉ số vp : vq
const chanPG = (v, p, q) => lerp(p, q, d(v, p) / (d(v, p) + d(v, q)))
const noiTiep = (a, b, c) => { const x = d(b, c), y = d(c, a), z = d(a, b), s = x + y + z; return P((x * a.x + y * b.x + z * c.x) / s, (x * a.y + y * b.y + z * c.y) / s) }
const trongTam = (a, b, c) => P((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3)
const tamGiac = (a, b, c, rot = 0, off = P(0, 0)) => { // BC = a nằm trên trục x, rồi quay + dời
  const B = P(0, 0), C = P(a, 0), x = (c * c - b * b + a * a) / (2 * a), y = Math.sqrt(c * c - x * x), A = P(x, y)
  const R = (p) => add(P(p.x * Math.cos(rot) - p.y * Math.sin(rot), p.x * Math.sin(rot) + p.y * Math.cos(rot)), off)
  return [R(A), R(B), R(C)]
}
let seed = 20251122
const rnd = (a = 0, b = 1) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return a + (b - a) * seed / 0x7fffffff }
const hopLe = (a, b, c) => a + b > c + 1e-6 && a + c > b + 1e-6 && b + c > a + 1e-6

// ───────── VD36 ─────────
for (let t = 0; t < 300; t++) {
  const a = rnd(3, 8), b = rnd(3, 8), c = rnd(3, 8)
  if (!hopLe(a, b, c)) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const D = chanPG(A, B, C)
  eq(ang(A, B, D), ang(A, D, C), 'VD36 AD phân giác')
  eq(d(B, D), a * c / (b + c), 'VD36a BD'); eq(d(D, C), a * b / (b + c), 'VD36a DC')
  const I = noiTiep(A, B, C)
  ok(between(I, A, D), 'VD36 I thuộc AD')
  eq(ang(B, A, I), ang(B, I, D), 'VD36 BI phân giác góc ABD (=ABC)')
  eq(d(A, I) / d(I, D), (b + c) / a, 'VD36b AI/ID')
  eq(d(A, I) / d(I, D), d(A, B) / d(B, D), 'VD36b AI/ID=AB/BD')
}
for (let t = 0; t < 300; t++) { // ý c: b + c = 2a, b ≠ c
  const a = rnd(3, 8), b = rnd(2, 2 * a - 2)
  const c = 2 * a - b
  if (!hopLe(a, b, c) || Math.abs(b - c) < 0.3) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const D = chanPG(A, B, C), M = mid(B, C), I = noiTiep(A, B, C), G = trongTam(A, B, C)
  eq(d(A, I) / d(I, D), 2, 'VD36c AI/ID=2'); eq(d(A, G) / d(G, M), 2, 'VD36c AG/GM=2')
  ok(d(D, M) > 1e-6, 'VD36c D≠M')
  ok(par(I, G, B, C), 'VD36c IG∥BC')
  eq(d(A, I) / d(A, D), d(A, G) / d(A, M), 'VD36c AI/AD=AG/AM')
}

// ───────── 219 ─────────
for (const y of [2]) {
  const A = P(0, 0), B = P(0, 3 * y), C = P(8, 0)
  const D = chanPG(B, A, C)
  eq(d(B, C), 5 * y, '219 BC=5y'); eq(d(A, D), 3, '219 AD=3'); eq(d(D, C), 5, '219 DC=5'); eq(d(A, B), 6, '219 AB'); eq(d(B, C), 10, '219 BC')
}
{ const y = Math.sqrt(64 / 16); eq(y, 2, '219 y=2 (từ 25y²=9y²+64)') }

// ───────── 220 ─────────
for (let t = 0; t < 300; t++) {
  const a = rnd(3, 8), b = rnd(3, 8), c = rnd(3, 8)
  if (!hopLe(a, b, c)) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const D = chanPG(A, B, C)
  const M = lerp(B, A, d(B, D) / d(B, A)), N = lerp(C, A, d(C, D) / d(C, A))
  ok(between(M, A, B) && between(N, A, C), '220 M,N trên cạnh')
  eq(d(B, M), d(B, D), '220 BM=BD'); eq(d(C, N), d(C, D), '220 CN=CD')
  ok(par(M, N, B, C), '220 MN∥BC')
  eq(d(B, M) / d(B, A), d(C, N) / d(C, A), '220 BM/AB=CN/AC')
  eq(d(A, M) / d(A, B), d(A, N) / d(A, C), '220 AM/AB=AN/AC')
}

// ───────── 221 ─────────
for (let t = 0; t < 300; t++) {
  const a = rnd(2.5, 9.5), c = 4, b = 6
  if (!hopLe(a, b, c)) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const D = chanPG(A, B, C), O = lerp(A, D, 2 / 3)
  eq(d(A, O) / d(O, D), 2, '221 OA:OD=2:1')
  const K = inter(B, O, A, C); ok(between(K, A, C), '221 K trên AC')
  eq(d(A, K) / d(K, C), 4 / 5, '221 AK/KC=4/5')
  const E = inter(D, add(D, sub(K, B)), A, C)   // DE ∥ BK
  ok(between(E, K, C), '221 E giữa K,C'); ok(par(D, E, B, K), '221 DE∥BK')
  eq(d(A, K) / d(K, E), 2, '221 AK/KE=2'); eq(d(K, E) / d(K, C), 2 / 5, '221 KE/KC=2/5')
  eq(d(C, E) / d(C, K), d(C, D) / d(C, B), '221 CE/CK=CD/CB'); eq(d(C, D) / d(C, B), 3 / 5, '221 CD/CB=3/5')
  eq(d(D, B) / d(D, C), 2 / 3, '221 DB/DC=2/3')
}
// đọc ngược (OD:OA = 2:1) cho đáp số khác ⇒ chứng tỏ cần đọc OA:OD = 2:1 (khớp sách 4/5)
{ const a = 7, [A, B, C] = tamGiac(a, 6, 4), D = chanPG(A, B, C), O = lerp(A, D, 1 / 3), K = inter(B, O, A, C); ok(Math.abs(d(A, K) / d(K, C) - 4 / 5) > 0.05, '221 cách đọc ngược cho đáp số khác') }

// ───────── 222 (DE_SAU) ─────────
for (let t = 0; t < 300; t++) {
  const a = rnd(3, 9), b = rnd(3, 9), c = rnd(3, 9)
  if (!hopLe(a, b, c)) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const M = mid(B, C), m = d(A, M)
  const Dd = chanPG(M, A, B), E = chanPG(M, A, C)
  eq(ang(M, A, Dd), ang(M, Dd, B), '222 MD phân giác AMB'); eq(ang(M, A, E), ang(M, E, C), '222 ME phân giác AMC')
  ok(par(Dd, E, B, C), '222a DE∥BC')
  eq(d(Dd, E), 2 * a * m / (a + 2 * m), '222b DE')
  const I = inter(A, M, Dd, E)
  eq(d(M, I), a * m / (a + 2 * m), '222c MI'); eq(d(Dd, I), d(I, E), '222 I trung điểm DE')
  eq(ang(M, Dd, E), 90, '222 góc DME=90')
}
{ // 222d: DE là đường trung bình ⇔ ABC vuông tại A
  const A = P(0, 0), B = P(0, 3), C = P(4, 0), M = mid(B, C), Dd = chanPG(M, A, B), E = chanPG(M, A, C)
  eq(d(A, Dd), d(Dd, B), '222d AD=DB (vuông tại A)'); eq(d(Dd, E), d(B, C) / 2, '222d DE=BC/2')
  const [A2, B2, C2] = tamGiac(5, 6, 4), M2 = mid(B2, C2), D2 = chanPG(M2, A2, B2)
  ok(Math.abs(d(A2, D2) - d(D2, B2)) > 1e-3, '222d không vuông ⇒ D không là trung điểm')
}

// ───────── 223 ─────────
for (let t = 0; t < 300; t++) {
  const x = rnd(2.2, 5.8) // AB = x, AC = 2x, BC = 6
  const [A, B, C] = tamGiac(6, 2 * x, x, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  if (!hopLe(6, 2 * x, x)) continue
  const D = chanPG(A, B, C)
  eq(d(B, D), 2, '223 BD=2'); eq(d(D, C), 4, '223 DC=4')
  // phân giác ngoài tại A: hướng = vuông góc với phân giác trong
  const u = sub(D, A), w = P(-u.y, u.x), E = inter(A, add(A, w), B, C)
  ok(between(B, E, C) && between(B, E, D), '223 E–B–D–C: B giữa E, C')
  eq(d(E, B) / d(E, C), 1 / 2, '223 EB/EC=1/2'); eq(d(E, B), 6, '223 EB=6'); eq(d(E, D), 8, '223 ED=8')
  eq(dot(sub(E, A), sub(D, A)), 0, '223 AE⊥AD', 1e-6)
  const Pm = mid(A, D), K = inter(Pm, add(Pm, w), B, C)   // trung trực của AD // AE
  eq(dot(sub(K, A), sub(K, A)), dot(sub(K, D), sub(K, D)), '223 K cách đều A, D')
  eq(d(K, D), 4, '223 KD=4'); eq(d(D, K) / d(D, E), 1 / 2, '223 DK/DE=1/2'); ok(between(K, D, E), '223 K giữa D,E')
}

// ───────── 224 ─────────
for (const rot of [0, 1.3, 4.1]) {
  const [A, B, C] = tamGiac(10, 12, 8, rot, P(rot, -rot))
  const D = chanPG(A, B, C), M = mid(B, C), I = noiTiep(A, B, C), G = trongTam(A, B, C)
  eq(d(B, D), 4, '224 BD=4'); eq(d(B, M), 5, '224 BM=5'); eq(d(D, M), 1, '224 DM=1'); ok(between(D, B, M), '224 D giữa B,M')
  eq(d(A, I) / d(I, D), 2, '224 AI/ID=2'); eq(d(A, B) / d(B, D), 2, '224 AB/BD=2'); eq(d(A, G) / d(G, M), 2, '224 AG/GM=2')
  ok(par(I, G, B, C), '224a IG∥BC'); eq(d(I, G), 2 / 3, '224b IG=2/3'); eq(d(I, G) / d(D, M), d(A, I) / d(A, D), '224 IG/DM=AI/AD'); eq(d(A, I) / d(A, D), 2 / 3, '224 AI/AD=2/3')
}

// ───────── 225 ─────────
let soTH = [0, 0]
for (let t = 0; t < 400; t++) {
  const a = rnd(2, 9), b = rnd(2, 9), th = rnd(40, 130) * Math.PI / 180
  if (Math.abs(a - b) < 0.25) continue
  const rot = rnd(0, 6)
  const R = (p) => P(p.x * Math.cos(rot) - p.y * Math.sin(rot) + 1, p.x * Math.sin(rot) + p.y * Math.cos(rot) - 2)
  const A = R(P(0, 0)), B = R(P(a, 0)), Dd = R(P(b * Math.cos(th), b * Math.sin(th))), C = add(B, sub(Dd, A))
  const O = mid(A, C); eq(d(O, mid(B, Dd)), 0, '225 O trung điểm BD', 1e-6)
  const M = chanPG(A, Dd, B), N = chanPG(B, C, A)
  ok(between(M, Dd, B) && between(N, C, A), '225 M∈BD, N∈AC')
  eq(ang(A, B, M), ang(A, M, Dd), '225 AM phân giác BAD'); eq(ang(B, A, N), ang(B, N, C), '225 BN phân giác ABC')
  eq(d(Dd, M) / d(M, B), b / a, '225 DM/MB=b/a'); eq(d(C, N) / d(N, A), b / a, '225 CN/NA=b/a')
  const k = 2 * b / (a + b)
  eq(d(Dd, M), k * d(Dd, O), '225 DM=k·DO'); eq(d(C, N), k * d(C, O), '225 CN=k·CO')
  const q = Math.abs(a - b) / (a + b)
  eq(d(O, M), q * d(O, Dd), '225 OM=|a−b|/(a+b)·OD'); eq(d(O, N), q * d(O, C), '225 ON=…·OC')
  ok(par(M, N, C, Dd), '225 MN∥CD')
  if (a > b) { ok(between(M, Dd, O) && between(N, C, O), '225 a>b: M giữa D,O; N giữa C,O'); soTH[0]++ }
  else { ok(between(O, Dd, M) && between(O, C, N), '225 a<b: O giữa D,M và giữa C,N'); soTH[1]++ }
}
ok(soTH[0] > 50 && soTH[1] > 50, `225 đủ hai trường hợp ${soTH}`)
{ // hình thoi ⇒ M = N = O (suy biến)
  const A = P(0, 0), B = P(4, 0), Dd = P(1.5, 2.5), C = add(B, sub(Dd, A)); const a = d(A, B), b = d(A, Dd)
  const Dd2 = P(4 * Math.cos(1), 4 * Math.sin(1)), C2 = add(B, sub(Dd2, A)); eq(d(A, Dd2), 4, '225 thoi'); const M = chanPG(A, Dd2, B), O = mid(A, C2); eq(d(M, O), 0, '225 hình thoi: M=O', 1e-6)
}

// ───────── 226 ─────────
for (let t = 0; t < 300; t++) {
  const a = rnd(3, 9), b = rnd(3, 9), c = rnd(3, 9)
  if (!hopLe(a, b, c)) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const E = chanPG(B, A, C), F = chanPG(C, A, B), O = inter(B, E, C, F)
  eq(d(C, E), a * b / (a + c), '226 CE=ab/(a+c)'); eq(d(B, F), a * c / (a + b), '226 BF=ac/(a+b)')
  eq(d(B, O) / d(O, E), (a + c) / b, '226 BO/OE'); eq(d(B, O) / d(B, E), (a + c) / (a + b + c), '226 BO/BE')
  eq(d(C, O) / d(O, F), (a + b) / c, '226 CO/OF'); eq(d(C, O) / d(C, F), (a + b) / (a + b + c), '226 CO/CF')
  const tich = d(B, O) / d(B, E) * d(C, O) / d(C, F)
  eq(tich, (a + c) * (a + b) / (a + b + c) ** 2, '226 tích')
  eq(2 * (a + b) * (a + c) - (a + b + c) ** 2, a * a - b * b - c * c, '226 đồng nhất: 2(a+b)(a+c)−(a+b+c)² = a²−b²−c²')
  ok(Math.abs(tich - 0.5) > 1e-4 || Math.abs(a * a - b * b - c * c) < 1e-3, '226 tích = 1/2 ⇒ a²=b²+c²')
}
for (const [b, c] of [[3, 4], [5, 12], [1, 1], [2.5, 6]]) { // tam giác vuông tại A ⇒ tích = 1/2
  const a = Math.hypot(b, c), tich = (a + c) * (a + b) / (a + b + c) ** 2
  eq(tich, 0.5, '226 vuông ⇒ tích 1/2')
  const A = P(0, 0), B = P(0, c), C = P(b, 0), E = chanPG(B, A, C), F = chanPG(C, A, B), O = inter(B, E, C, F)
  eq(d(B, O) / d(B, E) * d(C, O) / d(C, F), 0.5, '226 toạ độ vuông: tích 1/2')
}

// ───────── 227 (DE_SAU) — kiểm số lý do ─────────
{
  // AB=14, AC=35, AD=12 : BD/DC=2/5, AD² = AB·AC − BD·DC ⇒ BC
  const BCsq = 49 * (490 - 144) / 10  // BD=2t, DC=5t, BC=7t, 144=490−10t² ⇒ t²=34.6, BC²=49·34.6
  const BC = Math.sqrt(BCsq), s = (14 + 35 + BC) / 2, S = Math.sqrt(s * (s - 14) * (s - 35) * (s - BC))
  eq(S, 235.2, '227 diện tích 235,2', 1e-4)
  const [A, B, C] = tamGiac(BC, 35, 14), D = chanPG(A, B, C)
  eq(d(A, D), 12, '227 AD=12'); const E = inter(D, add(D, sub(B, A)), A, C)  // DE ∥ AB
  eq(d(E, A), 10, '227 EA=10'); eq(d(E, D), 10, '227 ED=10 (tam giác ADE cân tại E)')
}

// ───────── 228 ─────────
let dem228 = 0
for (let t = 0; t < 600; t++) {
  const a = rnd(3, 9), b = rnd(3, 9), c = rnd(2, 8)
  if (!(b > c + 0.15) || !hopLe(a, b, c)) continue
  const [A, B, C] = tamGiac(a, b, c, rnd(0, 6), P(rnd(-3, 3), rnd(-3, 3)))
  const D = chanPG(B, A, C), E = chanPG(C, A, B)      // D∈AC (BD phân giác B), E∈AB (CE phân giác C)
  eq(ang(B, A, D), ang(B, D, C), '228 BD phân giác B'); eq(ang(C, A, E), ang(C, E, B), '228 CE phân giác C')
  eq(d(C, D), a * b / (a + c), '228a CD'); eq(d(B, E), a * c / (a + b), '228a BE')
  ok(d(C, D) > d(B, E), '228a CD>BE')
  ok(a * b / (a + c) > a * c / (a + c) && a * c / (a + c) > a * c / (a + b), '228a chuỗi bất đẳng thức')
  const K = add(E, sub(D, B))                          // BEKD hình bình hành: vec EK = vec BD
  eq(d(D, K), d(B, E), '228b DK=BE'); eq(d(E, K), d(B, D), '228b EK=BD')
  ok(par(D, K, B, E) && par(E, K, B, D), '228b hbh'); ok(par(D, K, A, B), '228b DK∥AB')
  ok(Math.abs(cr(sub(K, D), sub(C, D))) > 1e-6, '228b K không thuộc AC')
  const gB = ang(B, A, C), gC = ang(C, A, B)            // góc ABC, ACB
  eq(ang(K, E, D), ang(B, E, D), '228b ∠EKD=∠EBD'); eq(ang(B, E, D), ang(B, A, D), '228b ∠EBD=∠ABD (E∈tia BA)')
  eq(ang(B, A, D), gB / 2, '228b ∠ABD=B/2'); eq(ang(C, E, A), gC / 2, '228b ∠ECD=∠ECA=C/2')
  ok(gB > gC, '228b ∠B>∠C (b>c)')
  const aDKC = ang(K, D, C), aDCK = ang(C, D, K)
  ok(aDKC > aDCK, '228b ∠DKC>∠DCK (CD>DK)')
  const gEKD = ang(K, E, D), gECD = ang(C, E, D)
  ok(gEKD > gECD, '228b ∠EKD>∠ECD')
  const gEKC = ang(K, E, C), gECK = ang(C, E, K)
  eq(gEKC, gEKD + aDKC, '228b ∠EKC=∠EKD+∠DKC (tia KD trong góc EKC)', 1e-6)
  eq(gECK, gECD + aDCK, '228b ∠ECK=∠ECD+∠DCK (tia CD trong góc ECK)', 1e-6)
  ok(gEKC > gECK, '228b ∠EKC>∠ECK'); ok(d(C, E) > d(E, K), '228b CE>EK'); ok(d(C, E) > d(B, D), '228c CE>BD')
  const Pp = inter(E, K, A, C)                         // n4: P = EK ∩ AC
  ok(between(Pp, A, D), '228b P giữa A,D'); ok(between(Pp, E, K), '228b P giữa E,K'); ok(between(D, Pp, C), '228b D giữa P,C')
  eq(d(E, Pp) / d(B, D), d(A, E) / d(A, B), '228b EP/BD=AE/AB'); ok(d(A, E) / d(A, B) < 1, '228b AE/AB<1')
  const sd = (p, q, r) => Math.sign(cr(sub(q, p), sub(r, p)))   // phía của r đối với đường pq
  ok(sd(A, B, D) === sd(A, B, K) && sd(A, B, D) === sd(A, B, Pp), '228b D,K,P cùng phía đối với AB')
  const s0 = sd(E, C, K)
  ok(sd(E, C, D) === s0 && sd(C, K, D) === s0 && sd(K, E, D) === s0, '228b D trong tam giác ECK')
  dem228++
}
ok(dem228 > 100, `228 đủ bộ thử (${dem228})`)

console.log(`kiem_G23: ${n} phép kiểm, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
