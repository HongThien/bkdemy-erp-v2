// kiem_G21.mjs — verify số cho VHB1 VD2, BT 14, 15*, 16a, 17, 18, 19, 20 (nhóm G21). node kiem_G21.mjs
let PASS = 0, FAIL = 0
const ok = (cond, msg) => { if (cond) PASS++; else { FAIL++; console.log('FAIL:', msg) } }
const eq = (a, b, msg, e = 1e-7) => ok(Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)

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
const cen = (...ps) => P(ps.reduce((s, p) => s + p.x, 0) / ps.length, ps.reduce((s, p) => s + p.y, 0) / ps.length)
const sgn = (a, b, p) => Math.sign(cr(sub(b, a), sub(p, a)))
const dd = (p, a, b) => d(p, foot(p, a, b))   // khoảng cách từ p đến đường thẳng ab
const angLines = (a, b, c, e) => { const t = Math.abs(dot(sub(b, a), sub(e, c))) / (len(sub(b, a)) * len(sub(e, c))); return Math.acos(Math.min(1, t)) }  // góc nhọn giữa hai đường thẳng
let seed = 12345
const rnd = (lo, hi) => { seed = (seed * 1103515245 + 12345) % 2147483648; return lo + (hi - lo) * seed / 2147483648 }
const convex = (A, B, C, D) => { const s = [sgn(A, B, C), sgn(B, C, D), sgn(C, D, A), sgn(D, A, B)]; return s.every((x) => x === s[0]) }
const tri = () => { for (;;) { const A = P(rnd(0, 10), rnd(5, 12)), B = P(rnd(-6, 0), rnd(0, 2)), C = P(rnd(6, 14), rnd(0, 2)); if (Math.abs(cr(sub(B, A), sub(C, A))) > 8) return [A, B, C] } }
const quad = () => { for (;;) { const A = P(rnd(-3, 4), rnd(5, 10)), B = P(rnd(5, 12), rnd(5, 10)), C = P(rnd(7, 13), rnd(-2, 3)), D = P(rnd(-6, 1), rnd(-2, 3)); if (convex(A, B, C, D)) return [A, B, C, D] } }

// ───────── VD2 ─────────
for (let i = 0; i < 30; i++) {
  const [A, B, C] = tri(); const a = d(B, C)
  const M = lerp(B, C, 1 / 3), N = lerp(B, C, 2 / 3), D = mid(A, C), E = mid(A, B)
  const I = inter(A, M, B, D), K = inter(A, N, C, E), Q = mid(B, C)
  ok(par(D, N, A, M), 'VD2 DN∥AM')
  ok(par(E, M, A, N), 'VD2 EM∥AN')
  eq(d(I, B), d(I, D), 'VD2 I trung điểm BD'); ok(between(B, I, D), 'VD2 I giữa B,D')
  eq(d(K, C), d(K, E), 'VD2 K trung điểm CE'); ok(between(C, K, E), 'VD2 K giữa C,E')
  ok(par(E, D, B, C), 'VD2 ED∥BC'); eq(d(E, D), a / 2, 'VD2 ED=a/2'); eq(d(B, Q), d(E, D), 'VD2 BQ=ED')
  ok(Math.abs(cr(sub(Q, B), sub(D, E))) < 1e-9 * a * a && dot(sub(Q, B), sub(D, E)) > 0, 'VD2 BQ, ED song song cùng hướng ⇒ BQDE hbh')
  eq(d(I, E), d(I, Q), 'VD2 I trung điểm EQ'); ok(coll(E, I, Q), 'VD2 E,I,Q thẳng hàng')
  ok(par(I, K, Q, C), 'VD2 IK∥QC'); eq(d(I, K), d(Q, C) / 2, 'VD2 IK=QC/2'); eq(d(Q, C), a / 2, 'VD2 QC=a/2')
  eq(d(I, K), a / 4, 'VD2 IK=a/4')
}

// ───────── 14a, 14b ─────────
for (let i = 0; i < 40; i++) {
  const [A, B, C] = tri(); const G = cen(A, B, C)
  // đường thẳng d qua G: chọn hướng ngẫu nhiên, giữ nếu cắt AB, AC (A một phía, B, C phía kia)
  const th = rnd(0, Math.PI), dr = P(Math.cos(th), Math.sin(th)), G2 = add(G, dr)
  if (!(sgn(G, G2, A) !== sgn(G, G2, B) && sgn(G, G2, B) === sgn(G, G2, C))) continue
  const Ap = dd(A, G, G2), Bp = dd(B, G, G2), Cp = dd(C, G, G2)
  eq(Ap, Bp + Cp, '14a AA′=BB′+CC′')
  const Mm = mid(B, C), I = mid(A, G)
  ok(coll(A, G, Mm) && between(A, G, Mm), '14a A,G,M')
  eq(d(A, G), 2 * d(G, Mm), '14a AG=2GM'); eq(d(I, G), d(G, Mm), '14a IG=GM'); eq(d(G, mid(I, Mm)), 0, '14a G trung điểm IM')
  ok(sgn(G, G2, I) !== sgn(G, G2, Mm), '14a I, M hai phía d')
  eq(dd(I, G, G2), dd(Mm, G, G2), '14a II′=MM′'); eq(dd(I, G, G2), Ap / 2, '14a II′=AA′/2'); eq(dd(Mm, G, G2), (Bp + Cp) / 2, '14a MM′=(BB′+CC′)/2')
}
let n14 = 0
for (let i = 0; i < 40; i++) {
  const [A, B, C] = tri(); const G = cen(A, B, C)
  const th = rnd(0, Math.PI), dr = P(Math.cos(th), Math.sin(th))
  const O = P(rnd(-3, 5), -rnd(2, 6)), O2 = add(O, dr)
  if (!(sgn(O, O2, A) === sgn(O, O2, B) && sgn(O, O2, B) === sgn(O, O2, C))) continue
  n14++
  const Ap = dd(A, O, O2), Bp = dd(B, O, O2), Cp = dd(C, O, O2), Gp = dd(G, O, O2)
  eq(Ap + Bp + Cp, 3 * Gp, '14b AA′+BB′+CC′=3GG′')
  const E = mid(A, C), M = mid(B, G)
  eq(d(B, M), d(M, G), '14b BM=MG'); eq(d(M, G), d(G, E), '14b MG=GE'); ok(coll(B, G, E) && between(M, G, E), '14b G trung điểm ME')
  eq(dd(M, O, O2), (Bp + Gp) / 2, '14b MM′=(BB′+GG′)/2'); eq(dd(E, O, O2), (Ap + Cp) / 2, '14b EE′=(AA′+CC′)/2')
  eq(Gp, (dd(M, O, O2) + dd(E, O, O2)) / 2, '14b GG′=(MM′+EE′)/2')
  eq(dd(M, O, O2) + dd(E, O, O2), 2 * Gp, '14b MM′+EE′=2GG′')
}
ok(n14 > 5, '14b đủ mẫu: ' + n14)

// ───────── 15* ─────────
for (let i = 0; i < 30; i++) {
  const a = rnd(0.5, 3), b = rnd(0.5, 3), c = rnd(0.5, 4), x0 = rnd(-2, 2)
  const A = P(x0, 0), M = P(x0 + a, 0), N = P(x0 + a + b, 0), B = P(x0 + a + b + c, 0), AB = a + b + c
  const apex = (u, v) => P((u.x + v.x) / 2, d(u, v) * Math.sqrt(3) / 2)
  const D = apex(A, M), E = apex(M, N), F = apex(N, B), G = cen(D, E, F)
  eq(D.y + E.y + F.y, Math.sqrt(3) / 2 * AB, '15 tổng khoảng cách = (√3/2)AB')
  eq(G.y, Math.sqrt(3) / 6 * AB, '15 d(G,AB) = √3/6·AB'); eq(G.y, (D.y + E.y + F.y) / 3, '15 d(G)=tổng/3')
  const Pp = mid(E, F), R = mid(D, G)
  eq(d(D, G), 2 * d(G, Pp), '15 DG=2GP'); eq(d(R, G), d(G, Pp), '15 RG=GP'); eq(d(G, mid(R, Pp)), 0, '15 G trung điểm RP')
  eq(Pp.y, (E.y + F.y) / 2, '15 PP′'); eq(R.y, (D.y + G.y) / 2, '15 RR′'); eq(G.y, (R.y + Pp.y) / 2, '15 GG′=(RR′+PP′)/2')
  // đường cao tam giác đều cạnh s là s√3/2 (Pythagore)
  eq(Math.hypot(a, 0) * Math.sqrt(3) / 2, Math.sqrt(a * a - (a / 2) ** 2), '15 đường cao tam giác đều')
}

// ───────── 16a ─────────
for (let i = 0; i < 60; i++) {
  const [A, B, C, D] = quad()
  const E = mid(A, D), F = mid(B, C), K = mid(A, C)
  ok(par(E, K, D, C), '16a EK∥CD'); eq(d(E, K), d(C, D) / 2, '16a EK=CD/2'); ok(par(K, F, A, B), '16a KF∥AB'); eq(d(K, F), d(A, B) / 2, '16a KF=AB/2')
  ok(d(E, F) <= (d(A, B) + d(C, D)) / 2 + 1e-9, '16a EF≤(AB+CD)/2')
  ok(d(E, F) < (d(A, B) + d(C, D)) / 2 - 1e-9, '16a (tứ giác ngẫu nhiên) EF<… chặt')   // không là hình thang
}
for (let i = 0; i < 20; i++) { // hình thang AB∥CD
  const y1 = rnd(3, 8), y0 = 0, A = P(rnd(0, 3), y1), B = P(A.x + rnd(2, 6), y1), D = P(rnd(-3, 0), y0), C = P(D.x + rnd(3, 9), y0)
  if (!convex(A, B, C, D)) continue
  const E = mid(A, D), F = mid(B, C)
  eq(d(E, F), (d(A, B) + d(C, D)) / 2, '16a hình thang: EF=(AB+CD)/2')
}

// ───────── 17 ─────────
let n17 = 0
for (let i = 0; i < 80; i++) {
  const A = P(rnd(-3, 4), rnd(5, 10)), B = P(rnd(5, 12), rnd(5, 10)), L = d(A, B), th = rnd(0, Math.PI * 2)
  const C = P(rnd(7, 13), rnd(-2, 3)), D = add(C, P(L * Math.cos(th), L * Math.sin(th)))
  if (!convex(A, B, C, D)) continue
  n17++
  const I = mid(A, C), K = mid(B, D), Mm = mid(A, D)
  ok(par(Mm, I, D, C), '17 MI∥CD'); eq(d(Mm, I), d(C, D) / 2, '17 MI=CD/2'); ok(par(Mm, K, A, B), '17 MK∥AB'); eq(d(Mm, K), d(A, B) / 2, '17 MK=AB/2')
  eq(d(Mm, I), d(Mm, K), '17 MI=MK')
  if (len(sub(K, I)) < 1e-9) continue
  const t1 = angLines(I, K, A, B), t2 = angLines(I, K, C, D)
  eq(t1, t2, '17 góc nhọn IK với AB = với CD')
  if (!coll(Mm, I, K)) {
    const phi = Math.acos(dot(sub(Mm, K), sub(I, K)) / (d(Mm, K) * d(I, K)))
    eq(phi, Math.acos(dot(sub(Mm, I), sub(K, I)) / (d(Mm, I) * d(K, I))), '17 ∠MKI=∠MIK'); ok(phi < Math.PI / 2, '17 góc đáy nhọn'); eq(t1, phi, '17 góc nhọn = ∠MKI')
  }
}
ok(n17 > 10, '17 đủ mẫu: ' + n17)

// ───────── 18 ─────────
for (let i = 0; i < 60; i++) {
  const [A, B, C, D] = quad()
  const Ap = cen(B, C, D), Bp = cen(A, C, D), Cp = cen(A, B, D), Dp = cen(A, B, C)
  const E = mid(A, C), F = mid(B, D), M = mid(E, F)
  ok(coll(A, Ap, M) && coll(B, Bp, M) && coll(C, Cp, M) && coll(D, Dp, M), '18 bốn đường đồng quy tại M')
  ok(coll(C, Ap, F) && between(C, Ap, F), '18 A′ ∈ CF'); eq(d(C, Ap), 2 * d(Ap, F), '18 CA′=2A′F')
  const I = mid(C, Ap)
  eq(d(C, I), d(I, Ap), '18 CI=IA′'); eq(d(I, Ap), d(Ap, F), '18 IA′=A′F'); eq(d(I, Ap), d(Ap, F), '18 A′ trung điểm IF'); ok(coll(I, Ap, F) && between(I, Ap, F), '18 A′ giữa I,F')
  ok(par(E, I, A, Ap), '18 EI∥AA′')
  // B′ : cùng cách làm, đổi vai (A,C)->(D,B) ... B′ = trọng tâm ACD ∈ DE, DB′=2B′E
  ok(coll(D, Bp, E) && eq(d(D, Bp), 2 * d(Bp, E), '18 DB′=2B′E') === undefined, '18 B′ ∈ DE')
  ok(coll(A, Cp, F) && eq(d(A, Cp), 2 * d(Cp, F), '18 AC′=2C′F') === undefined, '18 C′ ∈ AF')
  ok(coll(B, Dp, E) && eq(d(B, Dp), 2 * d(Dp, E), '18 BD′=2D′E') === undefined, '18 D′ ∈ BE')
}

// ───────── 19 ─────────
let n19 = 0, nEF = 0
for (let i = 0; i < 300; i++) {
  const [A, B, C] = tri()
  const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
  if (!(ang(A, B, C) < 1.5 && ang(B, A, C) < 1.5 && ang(C, A, B) < 1.5)) continue
  const H = inter(A, foot(A, B, C), B, foot(B, A, C))
  const M = mid(B, C), hm = sub(M, H), pv = P(-hm.y, hm.x), Hp = add(H, pv)
  const E = inter(H, Hp, A, B), F = inter(H, Hp, A, C)
  const D = sub(mul(H, 2), C)
  n19++
  eq(d(H, D), d(H, C), '19 HD=HC'); ok(between(C, H, D), '19 H giữa C,D')
  ok(par(M, H, B, D), '19 MH∥BD (đường trung bình ΔCBD)'); eq(d(M, H), d(B, D) / 2, '19 MH=BD/2')
  ok(Math.abs(dot(sub(B, D), sub(E, F))) < 1e-8 * d(B, D) * d(E, F), '19 BD⊥EF')
  ok(Math.abs(dot(sub(A, B), sub(H, D))) < 1e-8 * d(A, B) * d(H, D), '19 AB⊥HD')
  const G = inter(D, E, B, H), K = foot(B, A, C)
  ok(Math.abs(dot(sub(D, E), sub(B, H))) < 1e-8 * d(D, E) * d(B, H), '19 E trực tâm ΔDBH: DE⊥BH')
  ok(Math.abs(dot(sub(B, E), sub(D, H))) < 1e-8, '19 BE⊥DH'); ok(Math.abs(dot(sub(H, E), sub(D, B))) < 1e-8, '19 HE⊥DB')
  ok(coll(B, H, K) && between(G, H, K), '19 H giữa G,K')
  eq(d(H, G), d(H, K), '19 HG=HK')
  ok(Math.abs(dot(sub(C, K), sub(B, H))) < 1e-8, '19 CK⊥BH'); ok(Math.abs(dot(sub(F, K), sub(B, H))) < 1e-8 * Math.max(1, d(F, K)), '19 FK⊥BH')
  eq(d(H, E), d(H, F), '19 HE=HF')
  if (between(E, H, F)) nEF++
}
ok(n19 > 20, '19 đủ mẫu ' + n19); ok(nEF === n19, `19 H luôn nằm giữa E,F: ${nEF}/${n19}`)

// ───────── 20 ─────────
{
  const R = 4, th = 2 * Math.asin(1 / 4)
  const O = P(0, 0), A = P(-R, 0), D = P(R, 0)
  const pt = (t) => P(R * Math.cos(Math.PI - t), R * Math.sin(Math.PI - t))
  const B = pt(th), C = pt(2 * th)
  eq(d(A, B), 2, '20 AB=2'); eq(d(B, C), 2, '20 BC=2'); eq(d(A, D), 8, '20 AD=8'); ok(convex(A, B, C, D), '20 ABCD lồi')
  const H = inter(A, C, O, B)
  const CD = d(C, D); eq(CD, 7, '20 CD=7')
  eq(d(H, A), d(H, C), '20 H trung điểm AC'); ok(Math.abs(dot(sub(B, O), sub(C, A))) < 1e-9, '20 OB⊥AC')
  ok(par(O, H, D, C), '20 OH∥CD'); eq(d(O, H), CD / 2, '20 OH=CD/2'); ok(between(O, H, B), '20 H giữa O,B'); eq(d(B, H), 4 - d(O, H), '20 BH=4−x/2')
  eq(d(A, B) ** 2 - d(B, H) ** 2, d(O, A) ** 2 - d(O, H) ** 2, '20 AB²−BH²=OA²−OH²')
  // giải phương trình 4 − (4 − x/2)² = 16 − (x/2)² ⇒ x = 7
  const x = 7; eq(4 - (4 - x / 2) ** 2, 16 - (x / 2) ** 2, '20 phương trình tại x=7')
  // tìm nghiệm: 4 − 16 + 4x − x²/4 = 16 − x²/4 ⇒ 4x = 28
  eq(4 - 16 + 4 * 1 - 0, -8, '20 vp (kiểm khai triển)')
  // AC² tính hai cách
  eq(d(A, C) ** 2, 4 * (16 - (CD / 2) ** 2), '20 AC²=4AH²')
  // các cấu hình khác: B, C cùng phía AD là bắt buộc để ABCD là tứ giác (không tự cắt): thử B, C hai phía
  const Bd = P(B.x, -B.y)
  ok(!convex(A, Bd, C, D), '20 B, C khác phía AD không cho tứ giác lồi')
}

console.log(`PASS ${PASS} · FAIL ${FAIL}`)
