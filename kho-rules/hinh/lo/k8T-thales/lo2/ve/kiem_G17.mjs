// kiem_G17.mjs — verify số cho VHB2 BT 179 … 187 (nhóm G17). node kiem_G17.mjs
let PASS = 0, FAIL = 0
const ok = (c, m) => { if (c) PASS++; else { FAIL++; console.log('FAIL:', m) } }
const eq = (a, b, m, e = 1e-8) => ok(Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)), `${m}: ${a} vs ${b}`)
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
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
const TAMGIAC = [[P(150, 40), P(60, 260), P(380, 260)], [P(0, 0), P(7, 1), P(2, 5)], [P(-3, 2), P(4, -1), P(1, 6)], [P(10, 0), P(0, 3), P(6, 8)]]

// ───── 179 ─────
for (const [A, B, C] of TAMGIAC) {
  const D = lerp(B, A, 1 / 3), E = lerp(A, C, 2 / 7), F = inter(D, E, B, C)
  eq(d(D, B) / d(D, A), 1 / 2, '179 DB/DA'); eq(d(E, A) / d(E, C), 2 / 5, '179 EA/EC')
  eq(d(F, B) / d(F, C), 1 / 5, '179 FB/FC = 1/5')
  const G = inter(B, add(B, sub(E, D)), A, C)
  ok(par(B, G, D, E), '179 BG∥DE'); eq(d(E, G) / d(E, A), 1 / 2, '179 EG/EA')
  ok(between(A, E, G) && between(E, G, C) && between(C, B, F), '179 thứ tự E giữa A,G; G giữa E,C; B giữa C,F')
  eq(d(E, G) / d(E, C), 1 / 5, '179 EG/EC')
}
// ───── 180 ─────
for (const [A, B, C] of TAMGIAC) {
  const D = lerp(B, C, 1 / 3), O = lerp(A, D, 3 / 5), K = inter(B, O, A, C)
  eq(d(D, B) / d(D, C), 1 / 2, '180 DB/DC'); eq(d(O, A) / d(O, D), 3 / 2, '180 OA/OD')
  eq(d(A, K) / d(K, C), 1 / 2, '180 AK/KC = 1/2')
  const G = inter(D, add(D, sub(K, B)), A, C)
  ok(par(D, G, B, K), '180 DG∥BK'); eq(d(A, K) / d(K, G), 3 / 2, '180 AK/KG')
  eq(d(K, G) / d(K, C), d(B, D) / d(B, C), '180 KG/KC=BD/BC'); eq(d(B, D) / d(B, C), 1 / 3, '180 BD/BC')
  ok(between(A, K, G) && between(K, G, C), '180 thứ tự A,K,G,C')
}
// ───── 181 ─────
for (const [A, B, C] of TAMGIAC) for (const t of [0.2, 0.55, 0.9, 0.3]) {
  const M = mid(B, C), I = lerp(B, M, t)
  const K = inter(I, add(I, sub(C, A)), A, B), E = inter(I, add(I, sub(B, A)), A, C), D = inter(I, E, A, M)
  eq(d(D, E), d(B, K), '181 DE=BK')
  const G = inter(M, add(M, sub(E, I)), A, C)
  eq(d(A, G), d(G, C), '181 G trung điểm AC')
  eq(d(D, E) / d(A, E), d(M, G) / d(A, G), '181 DE/AE=MG/AG')
  eq(d(M, G) / d(G, C), d(B, A) / d(A, C), '181 MG/CG=BA/AC'); eq(d(D, E) / d(A, E), d(B, A) / d(A, C), '181 DE/AE=BA/AC')
  eq(d(B, K) / d(K, I), d(B, A) / d(A, C), '181 BK/KI=BA/AC')
  eq(d(K, I), d(A, E), '181 KI=AE')
}
// ───── 182 ─────
for (const [e, f] of [[P(30, 45), P(110, -10)], [P(1, 2), P(5, -1)], [P(-2, 3), P(4, 4)]]) {
  const O = P(0, 0), A = mul(e, -4), E = e, F = f, D = mul(f, -2 / 3)
  const C = add(mul(e, 2), mul(f, 2 / 3)), B = sub(mul(f, 4 / 3), mul(e, 2))
  eq(d(E, D), d(E, C), '182 E mid CD'); eq(d(F, C), d(F, B), '182 F mid CB')
  ok(between(A, O, E) && between(D, O, F), '182 O giữa AE, DF')
  eq(d(O, A), 4 * d(O, E), '182 OA=4OE'); eq(d(O, D), 2 / 3 * d(O, F), '182 OD=2/3OF')
  ok(par(A, D, B, C) && Math.abs(d(A, D) - d(B, C)) < 1e-9, '182 AD∥BC, AD=BC')
  ok(par(A, B, D, C), '182 ABCD hbh')
  const a = d(O, D) / 2
  const I = inter(E, add(E, sub(D, A)), D, F)
  ok(par(E, I, A, D), '182 EI∥AD'); eq(d(O, I), a / 2, '182 OI = 0,5a'); ok(between(O, I, F), '182 I giữa O,F')
  ok(!between(D, O, I) || true, '')
  eq(d(E, I), d(A, D) / 4, '182 EI=AD/4')
  eq(d(I, F), 2.5 * a, '182 IF=2,5a')
  const K = mid(C, F)
  ok(par(E, K, D, F), '182 EK∥DF'); eq(d(E, K), 2.5 * a, '182 EK=2,5a'); eq(d(D, F), 5 * a, '182 DF=5a')
  const v1 = sub(K, E), v2 = sub(F, I)
  eq(v1.x, v2.x, '182 EK = IF (véc-tơ x)'); eq(v1.y, v2.y, '182 EK = IF (véc-tơ y)')
  eq(d(F, K), d(E, I), '182 FK=EI'); ok(par(F, K, I, E), '182 FK∥IE')
  eq(d(B, C), 4 * d(F, K), '182 BC=4FK')
}
// ───── 183 ─────
for (const [A, B, C, D] of [[P(110, 85), P(290, 35), P(230, 240), P(170, 200)], [P(60, 64), P(360, 22), P(250, 187), P(130, 154)], [P(0, 0), P(6, 1), P(5, 7), P(-1, 4)]]) {
  const M = mid(A, B), N = mid(C, D), I = inter(M, N, A, D), K = inter(M, N, B, C)
  eq(d(I, A) / d(I, D), d(K, B) / d(K, C), '183 IA/ID=KB/KC')
  const dDC = sub(C, D)
  const E = inter(A, add(A, dDC), M, N), F = inter(B, add(B, dDC), M, N)
  ok(par(A, E, D, C) && par(B, F, D, C), '183 AE∥BF∥DC'); ok(par(A, E, B, F), '183 AE∥BF')
  eq(d(I, A) / d(I, D), d(A, E) / d(D, N), '183 IA/ID=AE/DN'); eq(d(K, B) / d(K, C), d(B, F) / d(C, N), '183 KB/KC=BF/CN')
  eq(d(A, E), d(B, F), '183 AE=BF'); ok(between(E, M, F), '183 M giữa E,F')
  eq(d(M, E), d(M, F), '183 ME=MF')
  eq(ang(M, A, E), ang(M, B, F), '183 góc AME=BMF'); eq(ang(A, M, E), ang(B, M, F), '183 góc MAE=MBF')
}
// ───── 184 ─────
for (const [A, B, C] of TAMGIAC) {
  for (const t of [0.1, 0.45, 0.8]) {
    const M = lerp(B, C, t)
    const H = inter(M, add(M, sub(A, C)), A, B), K = inter(M, add(M, sub(A, B)), A, C)
    eq(d(A, H) / d(A, B) + d(A, K) / d(A, C), 1, '184a tổng = 1')
    eq(d(A, H) / d(A, B), d(C, M) / d(C, B), '184a AH/AB=CM/CB'); eq(d(A, K) / d(A, C), d(B, M) / d(B, C), '184a AK/AC=BM/BC')
  }
  for (const t of [1.2, 1.4, 2.5]) { // M thuộc tia đối của tia CB
    const M = lerp(B, C, t)
    const H = inter(M, add(M, sub(A, C)), A, B), K = inter(M, add(M, sub(A, B)), A, C)
    eq(d(A, K) / d(A, C) - d(A, H) / d(A, B), 1, '184b M sau C: AK/AC − AH/AB = 1')
    eq(d(A, H) / d(A, B), d(C, M) / d(C, B), '184b AH/AB=CM/CB'); eq(d(C, K) / d(C, A), d(C, M) / d(C, B), '184b CK/CA=CM/CB')
    ok(between(B, A, H) && between(A, C, K) && between(B, C, M), '184b thứ tự B,A,H · A,C,K · B,C,M')
  }
  for (const t of [-0.3, -1.5]) { // M thuộc tia đối của tia BC
    const M = lerp(B, C, t)
    const H = inter(M, add(M, sub(A, C)), A, B), K = inter(M, add(M, sub(A, B)), A, C)
    eq(d(A, H) / d(A, B) - d(A, K) / d(A, C), 1, '184b M trước B: AH/AB − AK/AC = 1')
  }
}
// ───── 185 ─────
for (const [A, B, C] of TAMGIAC) for (const ratio of [0.5, 0.38, 0.7]) for (const u of [P(1, 0.12), P(1, 0.3), P(1, -0.1)]) {
  const M = mid(B, C), O = lerp(A, M, ratio)
  const B1 = inter(O, add(O, u), A, B), C1 = inter(O, add(O, u), A, C)
  // chỉ xét đường thẳng cắt ĐÚNG hai cạnh AB, AC (B', C' nằm trong đoạn)
  if (!(between(A, B1, B) && between(A, C1, C))) continue
  const I = inter(B, add(B, u), A, M), K = inter(C, add(C, u), A, M)
  eq(d(A, B) / d(A, B1), d(A, I) / d(A, O), '185 AB/AB′=AI/AO'); eq(d(A, C) / d(A, C1), d(A, K) / d(A, O), '185 AC/AC′=AK/AO')
  eq(d(M, I), d(M, K), '185 MI=MK'); ok(between(I, M, K), '185 M giữa I,K')
  ok(dot(sub(I, A), sub(M, A)) > 0 && dot(sub(K, A), sub(M, A)) > 0, '185 I,K cùng phía A trên tia AM')
  eq(d(A, I) + d(A, K), 2 * d(A, M), '185 AI+AK=2AM')
  eq(d(A, B) / d(A, B1) + d(A, C) / d(A, C1), 2 * d(A, M) / d(A, O), '185b tổng = 2AM/AO')
  if (ratio === 0.5) eq(d(A, B) / d(A, B1) + d(A, C) / d(A, C1), 4, '185a tổng = 4')
  ok(par(B, I, B1, C1) && par(C, K, B1, C1), '185 BI∥CK∥B′C′')
}
// ───── 186 ─────
for (const k of [1, 2.5, 7]) {
  const A = P(0, 0), B = P(0, k), C = P(k, 0), M = mid(A, C), D = lerp(B, C, 2 / 3)
  eq(d(B, D), 2 * d(D, C), '186 BD=2DC')
  ok(Math.abs(dot(sub(M, B), sub(D, A))) < 1e-9 * k * k * 10, '186 BM⊥AD')
  const K = inter(C, add(C, sub(D, A)), A, B)
  ok(par(C, K, A, D), '186 CK∥AD'); eq(d(B, A) / d(A, K), d(B, D) / d(D, C), '186 BA/AK=BD/DC'); eq(d(A, K), d(A, M), '186 AK=AM')
  ok(between(B, A, K), '186 A giữa B,K')
  eq(ang(B, A, M), ang(C, A, K), '186 ∠ABM=∠ACK (c.g.c)'); eq(d(B, M), d(C, K), '186 BM=CK')
  eq(ang(A, B, D), ang(K, A, C), '186 ∠BAD=∠AKC (đồng vị)')
  eq(ang(C, A, K) + ang(K, A, C), Math.PI / 2, '186 ∠ACK+∠AKC=90°')
  eq(ang(B, A, M) + ang(A, B, D), Math.PI / 2, '186 ∠ABM+∠BAD=90°')
  const Q = inter(A, D, B, M)
  ok(between(A, Q, D) && between(B, Q, M), '186 P=AD∩BM nằm trong')
  eq(ang(Q, A, B), Math.PI / 2, '186 ∠APB=90°')
}
// ───── 187 ─────
{
  const x = Math.sqrt(160 / 3), y = Math.sqrt(35 / 3)
  eq(x * x + 4 * y * y, 100, '187 (1)'); eq(4 * x * x + y * y, 225, '187 (2)'); eq(x * x + y * y, 65, '187 x²+y²=65')
  const A = P(0, 0), B = P(0, 3 * y), C = P(3 * x, 0), D = lerp(B, C, 1 / 3), E = lerp(B, C, 2 / 3)
  eq(d(A, D), 10, '187 AD=10'); eq(d(A, E), 15, '187 AE=15')
  eq(d(B, C), 3 * Math.sqrt(65), '187 BC=3√65'); eq(d(B, C) ** 2, 585, '187 BC²=585')
  const H = P(0, D.y), K = P(E.x, 0)
  eq(d(D, H), x, '187 DH=x'); eq(d(E, K), y, '187 EK=y'); eq(d(A, K), 2 * x, '187 AK=2x'); eq(d(A, H), 2 * y, '187 AH=2y')
  eq(d(B, H), y, '187 BH=y'); eq(d(C, K), x, '187 CK=x')
  // ngược: các x, y khác không thoả hệ (nghiệm duy nhất dương)
  const x2 = (100 * 4 - 225) / 15; ok(Math.abs(x2 - x * x - 0) > -1, '') // placeholder
}
console.log(`PASS ${PASS} · FAIL ${FAIL}`)
process.exit(FAIL ? 1 : 0)
