// kiem_G25.mjs — verify bằng toạ độ số cho lô G25 (TCHH CĐ4 Bài 8–13). Chạy: node kiem_G25.mjs
// Mỗi bài dựng toạ độ ĐÚNG dữ kiện đề từ tham số ngẫu nhiên (seed cố định), kiểm từng khẳng định của lời giải; bài có điểm "bất kì" thử nhiều bộ.
let seed = 20251122
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
const U = (a, b) => a + (b - a) * rnd()
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cr = (a, b) => a[0] * b[1] - a[1] * b[0], len = (a) => Math.hypot(a[0], a[1])
const d = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => add(a, mul(sub(b, a), t)), mid = (a, b) => lerp(a, b, 0.5)
const foot = (p, a, b) => { const v = sub(b, a); return add(a, mul(v, dot(sub(p, a), v) / dot(v, v))) }
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c); const k = cr(r, s); if (Math.abs(k) < 1e-12) return null; return add(a, mul(r, cr(sub(c, a), s) / k)) }
const EPS = 1e-7
let tong = 0, hong = 0
const ok = (ten, cond, ghi = '') => { tong++; if (!cond) { hong++; console.log('  FAIL', ten, ghi) } }
const gan = (x, y) => Math.abs(x - y) < EPS * Math.max(1, Math.abs(x), Math.abs(y))
const song2 = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < EPS * Math.max(1, len(sub(b, a)) * len(sub(e, c)))
const thang = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < EPS * Math.max(1, d(a, b) * d(a, c))
const vuong = (a, b, c, e) => Math.abs(dot(sub(b, a), sub(e, c))) < EPS * Math.max(1, len(sub(b, a)) * len(sub(e, c)))
const giua = (p, a, b) => gan(d(a, p) + d(p, b), d(a, b)) && d(a, p) > EPS && d(p, b) > EPS       // p nằm giữa a, b (nghiêm ngặt)
const tren_tia = (p, o, q) => dot(sub(p, o), sub(q, o)) > 0                                       // p thuộc tia oq (p ≠ o)

// ══════ Bài 8 → HH00127: D,J,G,E thẳng hàng (tam giác nhọn) ══════
{
  let so = 0
  while (so < 6) {
    const A = [U(-1, 1), U(2.5, 4)], B = [U(-3, -1.2), 0], C = [U(1.8, 4), 0]
    const ac = (p, q, r) => dot(sub(q, p), sub(r, p)) > 0.05
    if (!(ac(A, B, C) && ac(B, A, C) && ac(C, A, B))) continue
    if (Math.abs(d(A, B) - d(A, C)) < 0.3 || Math.abs(d(A, B) - d(B, C)) < 0.3 || Math.abs(d(A, C) - d(B, C)) < 0.3) continue
    so++
    const H = foot(A, B, C), K = foot(B, A, C), P = foot(C, A, B)
    const O = inter(A, H, B, K)
    const D = foot(H, A, B), E = foot(H, A, C), J = foot(H, B, K), G = foot(H, C, P)
    ok('8 H giữa B,C', giua(H, B, C)); ok('8 O giữa A,H', giua(O, A, H))
    ok('8 O thuộc CP', thang(C, P, O))
    ok('8 HD∥CP', song2(H, D, C, P)); ok('8 HJ∥CK', song2(H, J, C, K)); ok('8 HE∥BK', song2(H, E, B, K)); ok('8 HE∥OK', song2(H, E, O, K)); ok('8 HD∥OP', song2(H, D, O, P))
    ok('8 HG∥BP', song2(H, G, B, P))
    ok('8 BD/BP=BH/BC', gan(d(B, D) / d(B, P), d(B, H) / d(B, C))); ok('8 BJ/BK=BH/BC', gan(d(B, J) / d(B, K), d(B, H) / d(B, C)))
    ok('8 D giữa B,P', giua(D, B, P)); ok('8 J giữa B,K', giua(J, B, K))
    ok('8 DJ∥PK', song2(D, J, P, K))
    ok('8 AD/AP=AH/AO', gan(d(A, D) / d(A, P), d(A, H) / d(A, O))); ok('8 AE/AK=AH/AO', gan(d(A, E) / d(A, K), d(A, H) / d(A, O)))
    ok('8 D trên tia AP, E trên tia AK', tren_tia(D, A, P) && tren_tia(E, A, K))
    ok('8 DE∥PK', song2(D, E, P, K))
    ok('8 D,J,E thẳng hàng', thang(D, J, E))
    ok('8 CE/CK=CH/CB', gan(d(C, E) / d(C, K), d(C, H) / d(C, B))); ok('8 CG/CP=CH/CB', gan(d(C, G) / d(C, P), d(C, H) / d(C, B)))
    ok('8 EG∥KP', song2(E, G, K, P))
    ok('8 E,G,D thẳng hàng', thang(E, G, D))
    ok('8 D,J,G,E thẳng hàng', thang(D, J, G) && thang(D, J, E) && thang(D, G, E))
    ok('8 AD·... AH⊥BC BK⊥AC CP⊥AB', vuong(A, H, B, C) && vuong(B, K, A, C) && vuong(C, P, A, B))
  }
}

// ══════ Bài 9 → KHAC (HH00093): hình vuông EFGH ══════
{
  let n = 0
  for (let i = 0; i < 30 && n < 8; i++) {
    const al = U(0.1, 1.45) * (rnd() < 0.5 ? 1 : -1) - Math.PI / 2            // hướng tia Ex đi xuống, chéo
    const E = [0, 1], F = [1, 1], G = [1, 0], H = [0, 0]
    const dx = [Math.cos(al), Math.sin(al)], dy = [-dx[1], dx[0]]
    const L = (v) => (Math.abs(v[0]) < 0.05 || Math.abs(v[1]) < 0.05) ? null : v
    if (!L(dx) || !L(dy)) continue
    const M = inter(E, add(E, dx), F, G), N = inter(E, add(E, dx), H, G), Pp = inter(E, add(E, dy), F, G), Q = inter(E, add(E, dy), H, G)
    if (!M || !N || !Pp || !Q) continue
    n++
    const I = mid(Pp, N), K = mid(Q, M)
    ok('9 EM=EQ', gan(d(E, M), d(E, Q))); ok('9 EN=EP', gan(d(E, N), d(E, Pp)))
    ok('9 KE=KG', gan(d(K, E), d(K, G))); ok('9 IE=IG', gan(d(I, E), d(I, G)))
    ok('9 F,H,I,K thẳng hàng', thang(F, H, I) && thang(F, H, K))
  }
  ok('9 đủ bộ thử', n >= 8, `n=${n}`)
}

// ══════ Bài 10 → HH00131: hình bình hành, MC, AP, DI đồng quy ══════
{
  for (let so = 0; so < 8; so++) {
    const A = [0, 0], u = [U(3, 6), U(-0.5, 0.5)], w = [U(-1.5, 1.5), U(2, 4)]
    const B = add(A, u), D = add(A, w), C = add(B, w)
    const s = U(0.1, 0.9), t = U(0.1, 0.9)
    const I = add(A, add(mul(u, s), mul(w, t)))
    const M = add(A, mul(u, s)), N = add(D, mul(u, s)), P = add(B, mul(w, t)), Q = add(A, mul(w, t))
    ok('10 I trên MN, PQ', thang(M, N, I) && thang(P, Q, I)); ok('10 MN∥BC, PQ∥AB', song2(M, N, B, C) && song2(P, Q, A, B))
    ok('10 IM=BP, IN=PC, AM=DN', gan(d(I, M), d(B, P)) && gan(d(I, N), d(P, C)) && gan(d(A, M), d(D, N)))
    ok('10 AB=DC', gan(d(A, B), d(D, C)))
    ok('10 DI∦MC (hourglass: I∈đoạn MN, N giữa D,C)', inter(D, I, M, C) !== null && giua(N, D, C) && giua(I, M, N))
    const K = inter(D, I, M, C)
    ok('10 Menelaus △MCN cát tuyến DKI', gan((d(K, M) / d(K, C)) * (d(D, C) / d(D, N)) * (d(I, N) / d(I, M)), 1))
    ok('10 K giữa M,C', giua(K, M, C))
    ok('10 tích △MBC =1', gan((d(P, C) / d(P, B)) * (d(K, M) / d(K, C)) * (d(A, B) / d(A, M)), 1))
    ok('10 A ngoài đoạn MB, P trong BC, K trong MC', giua(M, A, B) && giua(P, B, C) && giua(K, M, C))
    ok('10 A,P,K thẳng hàng', thang(A, P, K))
    ok('10 đồng quy', thang(M, C, K) && thang(A, P, K) && thang(D, I, K))
    ok('10 DI không qua M, C, N', !thang(D, I, M) && !thang(D, I, C) && !thang(D, I, N))
  }
}

// ══════ Bài 11 → HH00131 (cong_cu lớp 9): điểm Gergonne ══════
{
  for (let so = 0; so < 6; so++) {
    const A = [U(-1, 1), U(2.5, 4)], B = [U(-3, -1.2), 0], C = [U(1.8, 4), 0]
    const a = d(B, C), b = d(C, A), c = d(A, B), s = (a + b + c) / 2
    const I = [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)]
    const D = foot(I, B, C), E = foot(I, C, A), F = foot(I, A, B)
    ok('11 tiếp tuyến bằng nhau', gan(d(A, E), d(A, F)) && gan(d(B, F), d(B, D)) && gan(d(C, D), d(C, E)))
    ok('11 độ dài tiếp tuyến = s - cạnh', gan(d(A, E), s - a) && gan(d(B, D), s - b) && gan(d(C, E), s - c))
    ok('11 D,E,F nằm trong cạnh', giua(D, B, C) && giua(E, C, A) && giua(F, A, B))
    ok('11 bán kính bằng nhau', gan(d(I, D), d(I, E)) && gan(d(I, E), d(I, F)))
    ok('11 tích Xê-va =1', gan((d(D, B) / d(D, C)) * (d(E, C) / d(E, A)) * (d(F, A) / d(F, B)), 1))
    const O = inter(A, D, B, E)
    ok('11 AD,BE,CF đồng quy', thang(C, F, O))
  }
}

// ══════ Bài 12 → DE_SAU (HH00129): đề in "hình thang" đúng là hình bình hành ══════
{
  for (let so = 0; so < 4; so++) {
    const A = [0, 0], u = [U(3, 6), U(-0.5, 0.5)], w = [U(-1.5, 1.5), U(2, 4)]
    const B = add(A, u), D = add(A, w), C = add(B, w)
    const P = foot(C, A, B), Q = foot(C, A, D), M = inter(P, Q, B, D)
    ok('12 hình bình hành: CM⊥CA', vuong(C, M, C, A))
  }
  const A = [0, 3], B = [4, 3], D = [-1, 0], C = [6, 0]
  const P = foot(C, A, B), Q = foot(C, A, D), M = inter(P, Q, B, D)
  ok('12 hình thang thường (AB∥CD, AB≠CD): CM KHÔNG vuông CA ⇒ đề in sai', !vuong(C, M, C, A))
}

// ══════ Bài 13 → HH00131: tứ giác lồi, DG, CE, IJ đồng quy, GE ∥ CD ══════
{
  let so = 0
  while (so < 8) {
    const gs = [U(0, 1.4), U(1.6, 3.0), U(3.3, 4.5), U(4.8, 6.1)].map((g) => g + 0.1)
    const rs = gs.map(() => U(2, 4)), pts = gs.map((g, i) => [rs[i] * Math.cos(g), rs[i] * Math.sin(g)])
    const [A, B, C, D] = pts
    const lo = [0, 1, 2, 3].every((i) => cr(sub(pts[(i + 1) % 4], pts[i]), sub(pts[(i + 2) % 4], pts[(i + 1) % 4])) > 0.3) // lồi
    if (!lo) continue
    so++
    const I = mid(A, D), J = mid(B, C)
    const G = mul(add(add(A, B), C), 1 / 3), E = mul(add(add(A, B), D), 1 / 3)
    ok('13 J∉AD', !thang(A, D, J))
    ok('13 G giữa A,J & AG=2GJ', giua(G, A, J) && gan(d(A, G), 2 * d(G, J))); ok('13 E giữa B,I & BE=2EI', giua(E, B, I) && gan(d(B, E), 2 * d(E, I)))
    ok('13 DG∦IJ', inter(D, G, I, J) !== null); ok('13 CE∦IJ', inter(C, E, I, J) !== null)
    const M = inter(D, G, I, J), M2 = inter(C, E, I, J)
    ok('13 Menelaus △AIJ cát tuyến D,G,M', gan((d(M, I) / d(M, J)) * (d(G, J) / d(G, A)) * (d(D, A) / d(D, I)), 1))
    ok('13 MI=MJ (M trung điểm IJ)', gan(d(M, I), d(M, J)) && thang(I, J, M))
    ok('13 Menelaus △BJI cát tuyến C,E,M\'', gan((d(M2, J) / d(M2, I)) * (d(E, I) / d(E, B)) * (d(C, B) / d(C, J)), 1))
    ok("13 M'J=M'I", gan(d(M2, J), d(M2, I)))
    ok('13 đồng quy: M = M\', M ∈ DG, CE, IJ', d(M, M2) < 1e-6 && thang(D, G, M) && thang(C, E, M))
    ok('13 J không phải trung điểm AG; I không phải trung điểm BE... (AG=2GJ ⇒ AJ=1,5AG)', gan(d(A, J), 1.5 * d(A, G)) && gan(d(B, I), 1.5 * d(B, E)))
    ok('13 Menelaus △ADG cát tuyến I,M,J', gan((d(I, A) / d(I, D)) * (d(M, D) / d(M, G)) * (d(J, G) / d(J, A)), 1))
    ok('13 MD/MG=3', gan(d(M, D) / d(M, G), 3)); ok('13 Menelaus △BCE cát tuyến J,M,I', gan((d(M, C) / d(M, E)) * (d(I, E) / d(I, B)) * (d(J, B) / d(J, C)), 1))
    ok('13 MC/ME=3', gan(d(M, C) / d(M, E), 3))
    ok('13 thứ tự D–M–G, C–M–E (đồng hồ cát)', giua(M, D, G) && giua(M, C, E) && giua(M, I, J))
    ok('13 J ngoài đoạn AG; I trong AD; D ngoài đoạn AI', !giua(J, A, G) && giua(I, A, D) && !giua(D, A, I))
    ok('13 GE∥CD', song2(G, E, C, D))
    ok('13 MG/MD=ME/MC=1/3', gan(d(M, G) / d(M, D), 1 / 3) && gan(d(M, E) / d(M, C), 1 / 3))
  }
}

console.log(`\nkiem_G25: ${tong} phép kiểm, ${hong} FAIL`)
process.exit(hong ? 1 : 0)
