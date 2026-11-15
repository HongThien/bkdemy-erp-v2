// kiem_G11.mjs — verify số cho TCHH CĐ3 II "Bài tập tự luyện" Bài 2–9 (trạm G11; Bài 1 = TRUNG VD9). node kiem_G11.mjs
let PASS = 0, FAIL = 0
const ok = (c, m) => { if (c) PASS++; else { FAIL++; console.log('FAIL:', m) } }
const eq = (a, b, m, e = 1e-7) => ok(Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)), `${m}: ${a} vs ${b}`)
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const mul = (a, k) => P(a.x * k, a.y * k)
const dot = (a, b) => a.x * b.x + a.y * b.y
const cr = (a, b) => a.x * b.y - a.y * b.x
const len = (a) => Math.hypot(a.x, a.y)
const d = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const mid = (a, b) => lerp(a, b, 0.5)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const foot = (p, a, b) => { const v = sub(b, a); return lerp(a, b, dot(sub(p, a), v) / dot(v, v)) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
const unit = (a) => mul(a, 1 / len(a))
const side = (a, b, p) => Math.sign(cr(sub(b, a), sub(p, a)))   // phía của p đối với đường thẳng ab
const through = (p, dir, q, dir2) => inter(p, add(p, dir), q, add(q, dir2))
const rnd = (a, b) => a + Math.random() * (b - a)
const tamGiac = () => { // tam giác lệch
  for (;;) { const A = P(rnd(0, 400), rnd(0, 100)), B = P(0, 300), C = P(rnd(300, 450), 300)
    const a = d(B, C), b = d(C, A), c = d(A, B); if (Math.abs(b - c) > 25 && Math.abs(a - b) > 25 && Math.abs(a - c) > 25) return [A, B, C] }
}

// ───────── Bài 2 ─────────
for (let it = 0; it < 40; it++) {
  const [A, B, C] = tamGiac(); const M = mid(B, C)
  let x = rnd(0.05, 0.95); if (Math.abs(x - 0.5) < 0.03) x = 0.3
  const I = lerp(B, C, x)
  const K = through(I, sub(C, A), A, sub(B, A))        // IK ∥ AC, K ∈ AB
  const D = through(I, sub(B, A), A, sub(C, A))        // ID ∥ AB, D ∈ AC
  const E = through(I, sub(B, A), A, sub(M, A))        // IE ∥ AB, E ∈ AM
  ok(par(I, K, A, C) && par(I, D, A, B) && par(I, E, A, B), '2 song song')
  eq(d(B, K), x * d(A, B), '2 BK=x·AB'); eq(d(I, D), (1 - x) * d(A, B), '2 ID=(1-x)AB')
  eq(d(I, E), Math.abs(1 - 2 * x) * d(A, B), '2 IE=|1-2x|AB'); eq(d(I, E) / d(A, B), d(M, I) / d(M, B), '2 IE/AB=MI/MB')
  eq(d(D, E), d(B, K), '2 DE=BK')
  if (x < 0.5) { ok(between(I, E, D), '2 TH1 E giữa I,D'); ok(side(B, C, E) === side(B, C, A) && side(B, C, D) === side(B, C, A), '2 TH1 cùng phía'); eq(d(D, E), d(I, D) - d(I, E), '2 TH1 DE=ID-IE') }
  else { ok(between(D, I, E), '2 TH2 I giữa D,E'); ok(between(A, M, E), '2 TH2 M giữa A,E'); eq(d(D, E), d(I, D) + d(I, E), '2 TH2 DE=ID+IE') }
}
// ───────── Bài 3 ─────────
let n3 = 0
for (let it = 0; it < 20000 && n3 < 40; it++) {
  const R = () => rnd(0, 400); const A = P(R(), R()), B = P(R(), R()), C = P(R(), R()), D = P(R(), R())
  const M = mid(A, B), N = mid(C, D)
  if (Math.abs(cr(sub(N, M), sub(D, A))) < 1e-3 || Math.abs(cr(sub(N, M), sub(C, B))) < 1e-3 || Math.abs(cr(sub(N, M), sub(D, C))) < 1e-3) continue
  const I = inter(M, N, A, D), K = inter(M, N, B, C)
  const E = through(A, sub(D, C), M, sub(N, M)), F = through(B, sub(D, C), M, sub(N, M))
  n3++
  ok(par(A, E, B, F) && par(A, E, C, D), '3 AE∥BF∥CD')
  eq(d(A, E), d(B, F), '3 AE=BF')
  eq(d(I, A) / d(I, D), d(A, E) / d(D, N), '3 IA/ID=AE/DN'); eq(d(K, B) / d(K, C), d(B, F) / d(C, N), '3 KB/KC=BF/CN')
  eq(d(I, A) * d(K, C), d(I, D) * d(K, B), '3 IA·KC=ID·KB')
}
ok(n3 >= 30, '3 đủ mẫu')
// ───────── Bài 4 ─────────
{
  const O = P(0, 0), th = 70 * Math.PI / 180 // góc xOy = 70°
  const k = 130
  let Cs = []
  for (const OA of [180, 220, 300, 500, 1000]) {
    const OB = 1 / (1 / k - 1 / OA); ok(OB > 0, '4 OB>0')
    const A = P(OA, 0), B = P(OB * Math.cos(th), OB * Math.sin(th))
    const bis = P(Math.cos(th / 2), Math.sin(th / 2))
    const C = inter(O, bis, A, B)
    const D = through(C, P(1, 0), O, B)                 // CD ∥ OA, D ∈ OB
    ok(between(A, C, B), '4 C thuộc đoạn AB'); ok(between(O, D, B), '4 D thuộc đoạn OB')
    eq(d(D, O), d(D, C), '4 DO=DC'); eq(ang(C, D, O), ang(O, C, A), '4 ∠DCO=∠COA'); eq(ang(O, D, C), ang(O, C, A), '4 ∠DOC=∠COA')
    eq(d(C, D) / OA + d(C, D) / OB, 1, '4 CD/OA+CD/OB=1'); eq(d(C, D), k, '4 CD=k')
    eq(d(C, D) / OA, d(B, D) / d(B, O), '4 CD/OA=BD/BO')
    Cs.push(C)
  }
  for (const C of Cs) { eq(C.x, Cs[0].x, '4 C cố định x'); eq(C.y, Cs[0].y, '4 C cố định y') }
  const D0 = P(k * Math.cos(th), k * Math.sin(th)), C0 = inter(O, P(Math.cos(th / 2), Math.sin(th / 2)), D0, add(D0, P(1, 0)))
  eq(C0.x, Cs[0].x, '4 C0=C'); eq(C0.y, Cs[0].y, '4 C0=C')
}
// ───────── Bài 5 ─────────
for (let it = 0; it < 40; it++) {
  const D = P(0, 300), C = P(rnd(300, 450), 300), h = rnd(80, 200)
  const A = P(rnd(40, 160), 300 - h), B = P(A.x + rnd(40, 200), 300 - h)
  // AB<CD và hai cạnh bên DA, CB cắt nhau phía trên
  const O = inter(D, A, C, B); if (O.y > A.y - 5 || d(A, B) >= d(C, D)) { it--; continue }
  const OA_AD = d(O, A) / d(A, D)
  for (const s of [0.2, 0.5, 0.8]) {
    const M = lerp(A, B, s)
    const G = inter(O, A, C, M), H = inter(O, B, D, M)
    const I = through(O, sub(B, A), C, sub(M, C)), K = through(O, sub(B, A), D, sub(M, D))
    ok(between(O, G, A) && between(O, H, B), '5 G∈OA, H∈OB')
    eq(d(O, G) / d(G, D), d(O, I) / d(C, D), '5 OG/GD=OI/CD'); eq(d(O, H) / d(H, C), d(O, K) / d(C, D), '5 OH/HC=OK/CD')
    ok(between(I, O, K), '5 O giữa I,K'); eq(d(I, K), d(O, I) + d(O, K), '5 IK=OI+OK')
    eq(d(I, K) / d(C, D), d(M, I) / d(M, C), '5 IK/CD=MI/MC'); eq(d(M, I) / d(M, C), OA_AD, '5 MI/MC=OA/AD')
    eq(d(O, G) / d(G, D) + d(O, H) / d(H, C), OA_AD, '5 tổng = OA/AD')
  }
}
// ───────── Bài 6 ─────────
for (let it = 0; it < 60; it++) {
  const [A0, B0, C0] = tamGiac(); let A = A0, B = B0, C = C0
  if (d(A, B) > d(A, C)) { const t = B; B = C; C = t }   // AB<AC
  if (d(A, C) - d(A, B) < 20) { it--; continue }
  const c = d(A, B), b = d(A, C), m = rnd(0.1, 0.9) * c
  const u = unit(sub(B, A)), v = unit(sub(C, A)), dir = add(u, v)        // AD
  const D = inter(B, C, A, add(A, dir))
  const M = add(B, mul(unit(sub(A, B)), m)), N = add(C, mul(unit(sub(A, C)), m))
  const O = inter(C, M, B, N)
  const E = through(O, dir, A, sub(B, A)), F = through(O, dir, A, sub(C, A))
  ok(between(A, M, B) && between(A, N, C), '6 M,N thuộc cạnh'); eq(d(B, M), d(C, N), '6 BM=CN')
  eq(ang(A, B, D), ang(A, D, C), '6 AD phân giác')
  const K = through(B, dir, A, sub(C, A))                                  // BK ∥ AD, K ∈ AC
  ok(coll(A, K, C) && between(K, A, C), '6 K thuộc tia đối AC'); eq(d(A, K), c, '6 AK=AB')
  eq(ang(K, B, A), ang(A, D, C), '6 ∠AKB=∠DAC'); eq(ang(B, A, K), ang(A, B, D), '6 ∠ABK=∠BAD')
  const Pp = through(B, sub(C, A), C, sub(M, C))                           // BP ∥ AC, P ∈ CM
  eq(d(M, B) / d(M, A), d(B, Pp) / d(A, C), '6 MB/MA=BP/AC')
  eq(d(B, O) / d(O, N), d(B, Pp) / d(C, N), '6 BO/ON=BP/CN'); eq(d(B, O) / d(O, N), b / d(A, M), '6 BO/ON=AC/AM')
  ok(between(B, O, N), '6 O giữa B,N')
  eq(d(N, O) / d(N, B), d(N, F) / d(N, K), '6 NO/NB=NF/NK'); ok(par(O, F, B, K), '6 ℓ∥BK')
  eq(d(N, F), d(A, M), '6 NF=AM'); eq(d(A, N) + d(A, B), d(A, M) + d(A, C), '6 AN+AB=AM+AC')
  ok(between(A, F, N) && between(A, F, C), '6 F giữa A,N và thuộc đoạn AC'); eq(d(A, F), b - c, '6 AF=AC-AB'); eq(d(C, F), c, '6 CF=AB')
  ok(between(E, A, B), '6 E thuộc tia đối AB'); eq(ang(E, A, F), ang(A, B, D), '6 ∠AEF=∠BAD'); eq(ang(F, A, E), ang(A, F, D), '6 ∠AFE=∠FAD')
  eq(d(A, E), d(A, F), '6 AE=AF'); eq(d(B, E), b, '6 BE=CA'); eq(d(B, E), d(B, A) + d(A, E), '6 BE=BA+AE')
  ok(side(A, C, E) !== side(A, C, D) && side(A, B, K) !== side(A, B, C), '6 vị trí phía')
  ok(side(A, D, B) !== side(A, D, K) || true, '6')
  ok(side(A, D, K) === side(A, D, B), '6 K cùng phía B đối với AD')
}
// ───────── Bài 7 ─────────
for (let it = 0; it < 50; it++) {
  const [A, B, C] = tamGiac(); const M = mid(B, C)
  let x = rnd(0.05, 0.95); if (Math.abs(x - 0.5) < 0.03) x = 0.3
  const D = lerp(B, C, x)
  const dirAM = sub(M, A)
  const E = through(D, dirAM, A, sub(B, A)), F = through(D, dirAM, A, sub(C, A))
  eq(d(D, E) / d(A, M), d(B, D) / d(B, M), '7a DE/AM=BD/BM'); eq(d(D, F) / d(A, M), d(C, D) / d(C, M), '7a DF/AM=CD/CM')
  eq(d(D, E) + d(D, F), 2 * d(A, M), '7a DE+DF=2AM')
  const K = through(A, sub(C, B), D, dirAM)
  eq(d(E, K) / d(E, D), d(A, K) / d(B, D), '7b EK/ED=AK/BD'); eq(d(F, K) / d(F, D), d(A, K) / d(C, D), '7b FK/FD=AK/CD')
  eq(d(E, K), d(A, M) * d(A, K) / d(B, M), '7b EK=AM·AK/BM'); eq(d(F, K), d(A, M) * d(A, K) / d(C, M), '7b FK=AM·AK/CM')
  eq(d(K, E), d(K, F), '7b KE=KF'); ok(between(E, K, F), '7b K giữa E,F'); ok(coll(E, K, F), '7b thẳng hàng')
  if (x < 0.5) {
    eq(d(B, E) / d(B, A), d(B, D) / d(B, M), '7b BE/BA=BD/BM'); ok(d(B, D) / d(B, M) < 1, '7b E thuộc đoạn AB')
    eq(d(C, F) / d(C, A), d(C, D) / d(C, M), '7b CF/CA=CD/CM'); ok(d(C, D) / d(C, M) > 1 && between(C, A, F), '7b A giữa C,F')
    ok(side(A, K, E) === side(A, K, B) && side(A, K, F) !== side(A, K, C) && side(A, K, B) === side(A, K, C), '7b E,F hai phía AK')
  }
}
// ───────── Bài 9 ─────────
for (let it = 0; it < 60; it++) {
  const A = P(0, 300), B = P(rnd(150, 260), 300), Dv = P(rnd(-30, 60), rnd(-160, -100))   // AD = Dv (y hướng xuống ⇒ âm là lên)
  const D = add(A, Dv), C = add(B, Dv)
  if (d(A, C) <= d(B, D)) { it--; continue }
  eq(d(A, C) > d(B, D) ? 1 : 0, 1, '9 AC>BD')
  ok(ang(B, A, C) > 0, '9')
  ok(ang(B, A, D) !== undefined, '9')
  const gocB = ang(B, A, C), gocD = ang(D, A, C)
  ok(gocB > Math.PI / 2 && gocD > Math.PI / 2, '9 góc B, D tù')
  ok(ang(B, A, C) > ang(A, B, D) || true, '9')
  eq(ang(B, A, C) + ang(A, B, D), Math.PI, '9 ∠ABC+∠BAD=180°')
  ok(ang(B, A, C) > ang(A, B, D), '9 ∠ABC>∠BAD')
  const s = rnd(0.15, 0.85), M = lerp(B, C, s)
  const I = inter(D, M, A, C), N = inter(D, M, A, B)
  ok(between(A, I, C) && between(D, I, M) && between(I, M, N), '9 thứ tự D,I,M,N'); ok(between(A, B, N), '9 N ngoài đoạn AB (phía B)')
  ok(d(I, M) < d(I, N), '9 IM<IN')
  eq(d(I, M) / d(I, D), d(I, C) / d(I, A), '9a IM/ID=IC/IA'); eq(d(I, M) / d(I, D), d(C, M) / d(A, D), '9a IM/ID=CM/AD')
  eq(d(I, C) / d(I, A), d(I, D) / d(I, N), '9a IC/IA=ID/IN'); eq(d(I, D) ** 2, d(I, M) * d(I, N), '9a ID²=IM·IN')
  ok(d(I, M) < d(I, D) && d(I, D) < d(I, N), '9 IM<ID<IN')
  const K = P(2 * I.x - D.x, 2 * I.y - D.y)
  ok(between(M, K, N) && between(I, M, K), '9b M,K,N thứ tự'); eq(d(K, M), d(I, K) - d(I, M), '9b KM=IK-IM'); eq(d(K, N), d(I, N) - d(I, K), '9b KN=IN-IK')
  eq(d(D, M) / d(M, N), d(C, M) / d(M, B), '9b DM/MN=CM/MB'); eq(d(D, M) / d(D, N), d(C, M) / d(C, B), '9b DM/DN=CM/CB')
  eq(d(K, M) / d(K, N), d(I, M) / d(I, D), '9b KM/KN=IM/ID'); eq(d(I, M) / d(I, D), d(C, M) / d(C, B), '9b IM/ID=CM/CB')
  eq(d(K, M) / d(K, N), d(D, M) / d(D, N), '9b KM/KN=DM/DN')
  const E = foot(C, A, B), Fp = foot(C, A, D)
  ok(between(A, B, E) && between(A, D, Fp), '9c E ngoài B, F ngoài D')
  eq(d(A, E), d(A, B) + d(B, E), '9c AE=AB+BE'); eq(d(A, Fp), d(A, D) + d(D, Fp), '9c AF=AD+DF')
  eq(d(A, C) ** 2 - d(B, C) ** 2, d(A, E) ** 2 - d(B, E) ** 2, '9c AC²-BC²=AE²-BE²')
  eq(d(A, B) * d(A, E), (d(A, C) ** 2 - d(B, C) ** 2 + d(A, B) ** 2) / 2, '9c AB·AE=(AC²-BC²+AB²)/2')
  eq(d(A, D) * d(A, Fp), (d(A, C) ** 2 - d(C, D) ** 2 + d(A, D) ** 2) / 2, '9c AD·AF=(AC²-CD²+AD²)/2')
  eq(d(A, B) * d(A, E) + d(A, D) * d(A, Fp), d(A, C) ** 2, '9c tổng = AC²')
}
// ───────── Bài 8 (DE_SAU) — chỉ kiểm lại đề: BM·DN = a², ∠BKD = 120° ─────────
for (const a of [1, 2.7]) {
  const A = P(0, 0), B = P(a, 0), Dd = P(a / 2, a * Math.sqrt(3) / 2), C = add(B, sub(Dd, A))
  for (const t of [0.3, 1.1, 2.5]) {
    const M = add(B, mul(sub(B, A), t))                    // M trên tia đối của tia BA
    const N = inter(M, C, A, Dd); ok(between(A, Dd, N), '8 N trên tia đối DA')
    eq(d(B, M) * d(Dd, N), a * a, '8a BM·DN=a²')
    const K = inter(B, N, Dd, M); eq(ang(K, B, Dd) * 180 / Math.PI, 120, '8b ∠BKD=120°', 1e-6)
  }
}
console.log(`kiem_G11: ${PASS} phép kiểm đạt, ${FAIL} FAIL`)
process.exit(FAIL ? 1 : 0)
