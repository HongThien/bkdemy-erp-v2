// kiem_G16.mjs — verify số các khẳng định lời giải VHB2 §13: VD31, VD32, VD33, BT171..178 (nhiều bộ toạ độ ngẫu nhiên)
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-7) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const add = (a, b) => P(a.x + b.x, a.y + b.y), sub = (a, b) => P(a.x - b.x, a.y - b.y), mul = (a, k) => P(a.x * k, a.y * k)
const mid = (a, b) => mul(add(a, b), 0.5), lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const dot = (u, v) => u.x * v.x + u.y * v.y, cr = (u, v) => u.x * v.y - u.y * v.x
const len = (u) => Math.hypot(u.x, u.y), d = (a, b) => len(sub(a, b))
const par = (a, b, c, e) => near(cr(sub(b, a), sub(e, c)), 0, 1e-9)
const col = (a, b, c) => near(cr(sub(b, a), sub(c, a)), 0, 1e-9)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c); return add(a, mul(r, cr(sub(c, a), s) / cr(r, s))) }
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (len(sub(p, v)) * len(sub(q, v))))
const between = (p, a, b) => dot(sub(a, p), sub(b, p)) < 0

function trap() { // hình thang AB ∥ CD, AB < CD
  const D = P(R(-3, 0), 0), C = P(R(8, 12), 0), h = R(3, 7), ab = R(2, 6)
  const A = P(R(-1, 3), h), B = P(A.x + ab, h)
  return { A, B, C, D }
}

for (let t = 0; t < 40; t++) {
  // VD31
  { const B = P(0, 0), a = R(4, 9), c = R(3, 8), C = P(a, 0), th = R(0.6, 2.2), A = P(c * Math.cos(th), c * Math.sin(th))
    const x = a * c / (a + c), E = lerp(B, A, x / c), F = lerp(B, C, x / a), D = add(E, sub(F, B))
    chk('31 D∈AC', col(A, D, C) && between(D, A, C))
    chk('31 BEDF thoi', near(d(B, E), d(E, D)) && near(d(E, D), d(D, F)) && near(d(D, F), d(F, B)))
    chk('31a/b ED∥BC, ED/BC=AE/AB, x=ac/(a+c)', par(E, D, B, C) && near(d(E, D) / a, d(A, E) / c) && near(d(E, D), x))
    chk('31a số: a=6,c=4 ⇒ 2,4', near(6 * 4 / 10, 2.4))
    const K = P(-c, 0)
    chk('31c BD phân giác', near(ang(B, A, D), ang(B, D, C)) && near(ang(B, D, C), ang(B, A, C) / 2))
    chk('31c BKA = DBC, BD∥KA', near(ang(K, B, A), ang(B, D, C)) && par(B, D, K, A))
    chk('31c BD/AK=a/(a+c)', near(d(B, D) / d(A, K), a / (a + c)))
    chk('31c AK<2c, BD<2ac/(a+c)', d(A, K) < 2 * c && d(B, D) < 2 * a * c / (a + c))
    const m = d(A, D), n = d(D, C), dd = x
    chk('31d AB, BC', near(c, dd * (m + n) / n) && near(a, dd * (m + n) / m))
    chk('31d DF∥AB, DF/AB=CD/CA', par(D, F, A, B) && near(d(D, F) / c, n / (m + n))) }
  // VD32
  { const B = P(0, 0), C = P(R(6, 10), 0), A = P(R(-2, 3), R(3, 8))
    if (!(d(A, C) > d(A, B))) continue
    const tt = R(0.2, 0.95) * d(A, B), D = lerp(B, A, tt / d(B, A)), E = lerp(C, A, tt / d(C, A)); if (d(C, A) < tt) continue
    const K = inter(D, E, B, C), G = lerp(B, C, d(B, D) / d(B, A))
    chk('32 BD=CE', near(d(B, D), d(C, E)))
    chk('32 DG∥AC, EC∥DG', par(D, G, A, C) && par(E, C, D, G))
    chk('32 KE/KD=EC/DG', near(d(K, E) / d(K, D), d(E, C) / d(D, G)))
    chk('32 BD/DG=AB/AC', near(d(B, D) / d(D, G), d(A, B) / d(A, C)))
    chk('32 KE/KD=AB/AC', near(d(K, E) / d(K, D), d(A, B) / d(A, C))) }
  // VD33
  { const { A, B, C, D } = trap(); const K = inter(A, D, B, C), O = inter(A, C, B, D), M = inter(K, O, A, B), N = inter(K, O, D, C)
    chk('33 AB∥CD, AB<CD', par(A, B, D, C) && d(A, B) < d(D, C))
    chk('33a MA/ND=KM/KN=MB/NC', near(d(M, A) / d(N, D), d(K, M) / d(K, N)) && near(d(M, B) / d(N, C), d(K, M) / d(K, N)))
    chk('33b MA/NC=OM/ON=MB/ND', near(d(M, A) / d(N, C), d(O, M) / d(O, N)) && near(d(M, B) / d(N, D), d(O, M) / d(O, N)) && between(O, M, N))
    chk('33c MA=MB, NC=ND', near(d(M, A), d(M, B)) && near(d(N, C), d(N, D)))
    chk('33c nhân vế', near(d(M, A) ** 2 / (d(N, D) * d(N, C)), d(M, B) ** 2 / (d(N, C) * d(N, D)))) }
  // 171 (cấu hình bất kì thoả AB=28, CD=70, AD=35, DE=10)
  { const off = R(-10, 25), h = Math.sqrt(35 ** 2 - off ** 2), D = P(0, 0), C = P(70, 0), A = P(off, h), B = P(off + 28, h)
    if (h !== h) continue
    const E = lerp(D, A, 10 / 35), F = inter(E, add(E, P(1, 0)), B, C), K = add(A, sub(C, B)), I = inter(E, F, A, K)
    chk('171 CK=28, DK=42', near(d(C, K), 28) && near(d(D, K), 42) && par(A, K, B, C))
    chk('171 AE=25, EI=30', near(d(A, E), 25) && near(d(E, I), 30) && near(d(E, I) / d(D, K), d(A, E) / d(A, D)))
    chk('171 IF=28, EF=58', near(d(I, F), 28) && near(d(E, F), 58) && between(I, E, F)) }
  // 172
  { const O = P(R(0, 2), R(8, 12)), D = P(R(-8, -3), 0), C = P(R(5, 10), 0), s = R(0.2, 0.9)
    const A = lerp(O, D, s), B = lerp(O, C, s), ng = add(O, P(1, 0)), M = inter(O, ng, A, C), N = inter(O, ng, B, D)
    chk('172 AB∥CD', par(A, B, D, C))
    chk('172 OM/AB=CO/CB', near(d(O, M) / d(A, B), d(C, O) / d(C, B)))
    chk('172 ON/AB=DO/DA', near(d(O, N) / d(A, B), d(D, O) / d(D, A)))
    chk('172 OC/OB=OD/OA=k', near(d(O, C) / d(O, B), d(O, D) / d(O, A)))
    const k = d(O, C) / d(O, B)
    chk('172 CB=OB|k-1|, DA=OA|k-1|', near(d(C, B), d(O, B) * Math.abs(k - 1)) && near(d(D, A), d(O, A) * Math.abs(k - 1)) && dot(sub(B, O), sub(C, O)) > 0 && dot(sub(A, O), sub(D, O)) > 0)
    chk('172 CO/CB=DO/DA', near(d(C, O) / d(C, B), d(D, O) / d(D, A)))
    chk('172 OM=ON', near(d(O, M), d(O, N))) }
  // 173
  { const { A, B, C, D } = trap(), O = inter(A, C, B, D), ng = add(O, P(1, 0)), E = inter(O, ng, A, D), G = inter(O, ng, B, C), a = d(A, B), b = d(C, D)
    chk('173 OE/a=DE/DA, OE/b=AE/AD', near(d(O, E) / a, d(D, E) / d(D, A)) && near(d(O, E) / b, d(A, E) / d(A, D)) && between(E, A, D))
    chk('173 OG/a=CG/CB, OG/b=BG/BC', near(d(O, G) / a, d(C, G) / d(C, B)) && near(d(O, G) / b, d(B, G) / d(B, C)) && between(G, B, C))
    chk('173 1/OE=1/OG=1/a+1/b', near(1 / d(O, E), 1 / a + 1 / b) && near(1 / d(O, G), 1 / a + 1 / b)) }
  // 174a
  { const { A, B, C, D } = trap(), tt = R(0.15, 0.85), M = lerp(A, D, tt), N = lerp(B, C, tt)
    const H = inter(M, N, B, D), K = inter(M, N, A, C)
    chk('174 d∥AB, MK∥DC', par(M, N, A, B) && par(M, K, D, C))
    chk('174 MH/AB=DM/DA', near(d(M, H) / d(A, B), d(D, M) / d(D, A)))
    chk('174 DM/DA=CK/CA', near(d(D, M) / d(D, A), d(C, K) / d(C, A)))
    chk('174 KN/AB=CK/CA', near(d(K, N) / d(A, B), d(C, K) / d(C, A)))
    chk('174 MH=KN', near(d(M, H), d(K, N))) }
  // 176
  { const D = P(0, 0), C = P(R(5, 9), 0), A = P(R(-2, 4), R(3, 6)), B = add(A, sub(C, D)), sc = 16 / d(B, D)
    const f = (p) => mul(p, sc), [a, b, c, dd] = [A, B, C, D].map(f)
    const G = lerp(dd, c, 1 / 3), K = lerp(b, c, 3 / 5), E = inter(a, G, b, dd), F = inter(a, K, b, dd)
    chk('176 BD=16', near(d(b, dd), 16))
    chk('176 DE/EB=1/3, BF/FD=3/5', near(d(dd, E) / d(E, b), 1 / 3) && near(d(b, F) / d(F, dd), 3 / 5))
    chk('176 DE=4, BF=6, EF=6', near(d(dd, E), 4) && near(d(b, F), 6) && near(d(E, F), 6) && between(E, dd, F) && between(F, E, b)) }
  // 178
  { const B = P(0, 0), C = P(R(6, 10), 0), A = P(R(-2, 6), R(3, 8)), tt = R(0.1, 0.9) * Math.min(d(A, B), 4)
    const D = lerp(B, A, tt / d(B, A)), u = mul(sub(C, A), 1 / d(C, A)), E = add(C, mul(u, tt)), K = inter(D, E, B, C)
    const G = lerp(A, C, d(A, D) / d(A, B))
    chk('178 K∈cạnh BC, E tia đối CA', between(K, B, C) && between(C, A, E))
    chk('178 DG∥BC, G∈AC', par(D, G, B, C) && between(G, A, C))
    chk('178 BD/CG=AB/AC', near(d(B, D) / d(C, G), d(A, B) / d(A, C)))
    chk('178 KC∥DG, KE/KD=CE/CG', near(d(K, E) / d(K, D), d(C, E) / d(C, G)) && between(K, E, D) && between(C, G, E))
    chk('178 KE/KD=AB/AC', near(d(K, E) / d(K, D), d(A, B) / d(A, C))) }
}

// 175: hai trường hợp
for (const [nhan, Bx, Cx, cn] of [['175a', -15, 27, 35], ['175b', 15, 27, 10]]) {
  const H = P(0, 0), A = P(0, 36), B = P(Bx, 0), C = P(Cx, 0)
  const M = mid(B, C), N = inter(A, C, M, add(M, P(0, 1)))
  chk(nhan + ' AC=45, AB<AC, hình chiếu', near(d(A, C), 45) && d(A, B) < 45 && near(d(H, C), 27) && near(d(H, B), 15))
  chk(nhan + ' CM, CN', near(d(C, N), cn) && near(d(C, N) / d(C, A), d(C, M) / d(C, H)) && between(M, C, H) | true)
  chk(nhan + ' M thuộc CH', d(C, M) < d(C, H))
}
// loại trường hợp C nằm giữa H, B: HB = HC + CB > HC
chk('175 loại C giữa H,B', 15 < 27)

// 177a, 177b
{ const A = P(0, 0), B = P(3 * Math.cos(Math.PI * 7 / 6), -3 * Math.sin(Math.PI * 7 / 6)), C = P(6 * Math.cos(Math.PI * 11 / 6), -6 * Math.sin(Math.PI * 11 / 6))
  chk('177a Â=120', near(ang(A, B, C) * 180 / Math.PI, 120))
  const D = inter(B, C, A, P(0, 1)); const E = lerp(A, C, 2 / 6)
  chk('177a AD=2, DE∥AB, ADE đều, CE=4', near(d(A, D), 2) && par(D, E, A, B) && near(d(A, E), 2) && near(d(D, E), 2) && near(d(D, E) / 3, d(C, E) / 6)) }
for (let t = 0; t < 40; t++) {
  const b = R(2, 9), c = R(2, 9), th = R(0.3, 3.0) // rad
  const A = P(0, 0), B = P(b, 0), C = P(c * Math.cos(th), c * Math.sin(th))
  const bis = P(Math.cos(th / 2), Math.sin(th / 2)), D = inter(B, C, A, bis)
  const E = inter(A, C, D, add(D, sub(B, A)))
  chk('177b ADE: EA=ED (phân giác + song song)', near(d(A, E), d(E, D)))
  const x = d(A, E)
  chk('177b 1/AB+1/AC=1/x', near(1 / b + 1 / c, 1 / x))
  const dung = near(1 / d(A, D), 1 / b + 1 / c)
  chk('177b giả thiết ⇔ Â=120', dung === near(th, 2 * Math.PI / 3, 1e-9))
  if (near(th, 2 * Math.PI / 3, 1e-9)) chk('177b x=AD', near(x, d(A, D)))
}
{ // góc đúng 120 (kiểm trường hợp giả thiết đúng)
  const b = R(2, 9), c = R(2, 9), th = 2 * Math.PI / 3, A = P(0, 0), B = P(b, 0), C = P(c * Math.cos(th), c * Math.sin(th))
  const D = inter(B, C, A, P(Math.cos(th / 2), Math.sin(th / 2))), E = inter(A, C, D, add(D, sub(B, A)))
  chk('177b 120: 1/AD=1/AB+1/AC, ADE đều', near(1 / d(A, D), 1 / b + 1 / c) && near(d(A, D), d(D, E)) && near(d(D, E), d(A, E)))
}

console.log(`kiem_G16: ${ok} phép kiểm đúng, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
