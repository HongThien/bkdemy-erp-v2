// kiem_G4.mjs — verify bằng toạ độ cho NDT-H3.6 … H3.9 (trạm G4). Chạy: node kiem_G4.mjs
let ok = 0, fail = 0
const chk = (ten, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', ten) } }
const eq = (ten, a, b, e = 1e-9) => chk(`${ten}: ${a} vs ${b}`, Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)))
const P = (x, y) => ({ x, y })
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const mul = (a, k) => P(a.x * k, a.y * k)
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const mid = (a, b) => lerp(a, b, 0.5)
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const cross = (a, b) => a.x * b.y - a.y * b.x
const dot = (a, b) => a.x * b.x + a.y * b.y
const par = (a, b, c, d) => Math.abs(cross(sub(b, a), sub(d, c))) < 1e-7
const thang = (a, b, c) => Math.abs(cross(sub(b, a), sub(c, a))) < 1e-7
// giao hai đường thẳng ab, cd
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c), k = cross(r, s); return lerp(a, b, cross(sub(c, a), s) / k) }
// tham số t của p trên đường thẳng a→b (p = a + t(b-a))
const tp = (p, a, b) => dot(sub(p, a), sub(b, a)) / dot(sub(b, a), sub(b, a))
const trong = (p, a, b) => { const t = tp(p, a, b); return t > 1e-9 && t < 1 - 1e-9 }

// ───────── BÀI 6 ─────────
for (const [A, B, C] of [[P(90, 200), P(0, 0), P(340, 0)], [P(250, 160), P(-20, 10), P(300, -30)]]) {
  const G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3)
  const D = inter(G, add(G, sub(B, A)), B, C)
  const M = mid(B, C)
  chk('6: A,G,M thẳng hàng', thang(A, G, M))
  eq('6: AG = 2/3 AM', dist(A, G), 2 / 3 * dist(A, M))
  eq('6: MG = 1/3 AM', dist(M, G), dist(A, M) / 3)
  chk('6: GD // AB', par(G, D, A, B))
  chk('6: D thuộc đoạn BM', trong(D, B, M))
  eq('6: BD/BM = AG/AM', dist(B, D) / dist(B, M), dist(A, G) / dist(A, M))
  eq('6: BD/BM = 2/3', dist(B, D) / dist(B, M), 2 / 3)
  eq('6: BD = BC/3', dist(B, D), dist(B, C) / 3)
}

// ───────── BÀI 7 ─────────
for (const [tE, tF] of [[0.4, 0.45], [0.7, 0.3], [0.55, 0.8]]) {
  const A = P(0, 0), D = P(260, 0), B = P(70, 150), C = add(B, sub(D, A))
  const E = lerp(A, B, tE), F = lerp(A, D, tF)
  const O = inter(E, F, A, C)
  chk('7: O thuộc đoạn AC', trong(O, A, C))
  const I = mid(A, C)
  // d qua E,F,O ; đường qua B và qua D song song d
  const dd = sub(F, E)
  const M = inter(B, add(B, dd), A, C), N = inter(D, add(D, dd), A, C)
  chk('7: M thuộc tia AC', tp(M, A, C) > 0)
  chk('7: N thuộc tia AC', tp(N, A, C) > 0)
  chk('7: BM // d', par(B, M, E, F)); chk('7: DN // d', par(D, N, E, F))
  eq('7: AM = CN', dist(A, M), dist(C, N))
  // đối xứng tâm I: M -> N
  chk('7: I là trung điểm MN', dist(mid(M, N), I) < 1e-7)
  eq('7: AM + AN = AC', dist(A, M) + dist(A, N), dist(A, C))
  eq('7: AB/AE = AM/AO', dist(A, B) / dist(A, E), dist(A, M) / dist(A, O))
  eq('7: AD/AF = AN/AO', dist(A, D) / dist(A, F), dist(A, N) / dist(A, O))
  eq('7: tổng = AC/AO', dist(A, B) / dist(A, E) + dist(A, D) / dist(A, F), dist(A, C) / dist(A, O))
  chk('7: O giữa A và M (OE//BM, E thuộc AB)', trong(O, A, M))
}

// ───────── BÀI 8 ─────────
for (const [A, B, C, tN] of [[P(90, 200), P(0, 0), P(340, 0), 0.55], [P(200, 220), P(-30, 20), P(300, -10), 0.3], [P(40, 190), P(0, 0), P(280, 40), 0.8]]) {
  const M = mid(B, C), N = lerp(A, M, tN)
  const D = inter(C, N, A, B), E = inter(B, N, A, C)
  chk('8: D thuộc đoạn AB', trong(D, A, B)); chk('8: E thuộc đoạn AC', trong(E, A, C))
  const F = P(2 * M.x - N.x, 2 * M.y - N.y)
  chk('8: BNCF hbh (đường chéo cắt nhau tại trung điểm)', dist(mid(B, C), mid(N, F)) < 1e-7)
  chk('8: BN // FC', par(B, N, F, C)); chk('8: NC // BF', par(N, C, B, F))
  chk('8: DN // BF', par(D, N, B, F)); chk('8: NE // FC', par(N, E, F, C))
  chk('8: N thuộc đoạn AF', trong(N, A, F))
  eq('8: AD/BD = AN/NF', dist(A, D) / dist(B, D), dist(A, N) / dist(N, F))
  eq('8: AE/CE = AN/NF', dist(A, E) / dist(C, E), dist(A, N) / dist(N, F))
  eq('8: AD/BD = AE/CE', dist(A, D) / dist(B, D), dist(A, E) / dist(C, E))
}

// ───────── BÀI 9 ─────────
for (const tF of [0.4, 0.35, 0.62, 0.5, 0.66]) {
  const A = P(0, 0), D = P(300, 0), B = P(80, 150), C = add(B, sub(D, A))
  const O = mid(A, C)
  chk('9: O cũng là trung điểm BD', dist(O, mid(B, D)) < 1e-7)
  const M = mid(B, O), N = mid(A, O), F = lerp(A, B, tF)
  const E = inter(F, M, B, C), K = inter(F, N, A, D)
  chk('9: E thuộc đoạn BC', trong(E, B, C)); chk('9: K thuộc đoạn AD', trong(K, A, D))
  chk('9: E thuộc tia FM', tp(M, F, E) > 0); chk('9: K thuộc tia FN', tp(N, F, K) > 0)
  const BA = dist(B, A), BF = dist(B, F), AF = dist(A, F), BC = dist(B, C), BE = dist(B, E), AK = dist(A, K), AD = dist(A, D)
  // ý a
  eq('9a: BA/BF + BC/BE = 4', BA / BF + BC / BE, 4)
  const dd = sub(E, F)
  const I = inter(A, add(A, dd), B, D), L = inter(C, add(C, dd), B, D)
  chk('9a: AI // EF', par(A, I, E, F)); chk('9a: CL // EF', par(C, L, E, F))
  chk('9a: O là trung điểm IL', dist(mid(I, L), O) < 1e-7)
  eq('9a: OI = OL', dist(O, I), dist(O, L))
  chk('9a: I, L thuộc tia BM', tp(I, B, M) > 0 && tp(L, B, M) > 0)
  eq('9a: BA/BF = BI/BM', BA / BF, dist(B, I) / dist(B, M))
  eq('9a: BC/BE = BL/BM', BC / BE, dist(B, L) / dist(B, M))
  eq('9a: BI + BL = 2BO', dist(B, I) + dist(B, L), 2 * dist(B, O))
  eq('9a: BO = 2BM', dist(B, O), 2 * dist(B, M))
  // vai trò đối xứng: AB/AF + AD/AK = 4
  eq('9: AB/AF + AD/AK = 4', BA / AF + AD / AK, 4)
  // ý b
  eq('9b: BF + AF = AB', BF + AF, BA)
  eq('9b: AD = BC', AD, BC)
  eq('9b: tổng = 8', BA / BF + BC / BE + BA / AF + AD / AK, 8)
  chk('9b: BE + AK >= BC', BE + AK >= BC - 1e-9)
  const lhs = BA * (1 / BF + 1 / AF) + BC * (1 / BE + 1 / AK)
  const rhs = 4 + 4 * BC / (BE + AK)
  chk('9b: 8 = lhs >= rhs', lhs >= rhs - 1e-9 && Math.abs(lhs - 8) < 1e-9)
  // bài toán phụ 1/x+1/y >= 4/(x+y)
  chk('9b: bài toán phụ cho (BF,AF)', 1 / BF + 1 / AF >= 4 / (BF + AF) - 1e-12)
  chk('9b: bài toán phụ cho (BE,AK)', 1 / BE + 1 / AK >= 4 / (BE + AK) - 1e-12)
  // đẳng thức giữa tạp: dấu bằng khi F là trung điểm
  if (tF === 0.5) eq('9b: F trung điểm ⇒ BE+AK = BC', BE + AK, BC)
}
// điều kiện ngầm: F phải nằm giữa 1/4 và 3/4 AB để E, K thuộc cạnh
{
  const A = P(0, 0), D = P(300, 0), B = P(80, 150), C = add(B, sub(D, A)), O = mid(A, C), M = mid(B, O)
  const N = mid(A, O)
  const F1 = lerp(A, B, 0.3), K1 = inter(F1, N, A, D)
  chk('9: AF<AB/3 ⇒ K ngoài cạnh AD (F phải ở giữa đoạn AB: AB/3 ≤ AF ≤ 2AB/3)', !trong(K1, A, D))
  const F2 = lerp(A, B, 0.7), E2 = inter(F2, M, B, C)
  chk('9: BF<AB/3 ⇒ E ngoài cạnh BC', !trong(E2, B, C))
}
// bài toán phụ ngẫu nhiên
for (let i = 0; i < 2000; i++) { const x = Math.random() * 10 + 0.01, y = Math.random() * 10 + 0.01; chk('phụ', 1 / x + 1 / y >= 4 / (x + y) - 1e-12) }
console.log(`PASS ${ok} · FAIL ${fail}`)
