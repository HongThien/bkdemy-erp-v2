// kiem_G13.mjs — verify số cho TCHH-3.II.21 và TCHH-3.II.27 (nhóm G13). node kiem_G13.mjs
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
const perp = (a, b, c, e) => Math.abs(dot(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const onSeg = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) <= 1e-9
const same = (a, b) => d(a, b) < 1e-7

// ───────── 21: MNP cân tại P; H trung điểm MN; K hình chiếu H trên PM; qua P ⊥ NK cắt HK tại I ─────────
for (const [m, h, tx] of [[3, 4, 0], [2, 5, 1.5], [5, 3, -2], [1.7, 6, 4], [4, 4.2, 0.3]]) {
  const H = P(tx, 0), M = P(tx + m, 0), N = P(tx - m, 0), Pp = P(tx, h)
  eq(d(Pp, M), d(Pp, N), '21 PM=PN')
  const K = foot(H, Pp, M)
  ok(perp(H, K, Pp, M), '21 HK⊥PM')
  const Q = foot(Pp, N, K)
  const I = inter(Pp, Q, H, K)
  ok(perp(Pp, I, N, K), '21 PI⊥NK')
  // lời giải
  const E = mid(K, M)
  ok(par(H, E, N, K), '21 HE∥NK (đường trung bình △MNK)')
  ok(perp(Pp, I, H, E), '21 PI⊥HE')
  ok(coll(Pp, E, M), '21 E∈PM')
  ok(perp(H, K, Pp, E), '21 HK⊥PE')
  // I là trực tâm △PHE: ba đường cao đồng quy
  ok(perp(E, I, Pp, H), '21 EI⊥PH (I trực tâm △PHE)')
  ok(perp(M, H, Pp, H), '21 MH⊥PH')
  ok(par(E, I, M, H), '21 EI∥MH')
  ok(same(I, mid(H, K)), '21 I trung điểm HK (kết luận)')
  ok(onSeg(K, E, M) && onSeg(H, I, K), '21 E∈KM, I∈HK')
}

// ───────── 27: D, E trung điểm AB, BC; C trung điểm ME; B trung điểm ND; K = AC ∩ DM ─────────
for (const [A, B, C] of [
  [P(1.3, 4), P(0, 0), P(5, 0)], [P(-2, 3), P(0, 0), P(4, 1)], [P(6, 5), P(1, 1), P(3, -2)], [P(0.5, 2.5), P(-1, 0), P(2.5, 0.3)], [P(10, 7), P(2, -3), P(-4, 1)],
]) {
  const D = mid(A, B), E = mid(B, C)
  const M = P(2 * C.x - E.x, 2 * C.y - E.y), N = P(2 * B.x - D.x, 2 * B.y - D.y)
  ok(same(C, mid(E, M)) && same(B, mid(N, D)), '27 dữ kiện dựng M, N')
  const K = inter(A, C, D, M)
  ok(par(D, E, A, C), '27 DE∥AC (đường trung bình △ABC)')
  ok(par(C, K, D, E), '27 CK∥DE')
  ok(same(K, mid(D, M)), '27 K trung điểm DM')
  // BE = EC = CM, MB = 3 BE, ME = 2/3 MB
  eq(d(B, E), d(E, C), '27 BE=EC'); eq(d(E, C), d(C, M), '27 EC=CM')
  eq(d(M, E), 2 / 3 * d(M, B), '27 ME=2/3 MB')
  ok(onSeg(M, E, B), '27 E nằm trên đoạn MB')
  // E là trọng tâm △MND
  const G = P((M.x + N.x + D.x) / 3, (M.y + N.y + D.y) / 3)
  ok(same(G, E), '27 E trọng tâm △MND')
  ok(coll(N, E, K), '27 N, E, K thẳng hàng')
  ok(onSeg(N, E, K), '27 E nằm giữa N và K')
}

console.log(`PASS ${PASS} · FAIL ${FAIL}`)
process.exit(FAIL ? 1 : 0)
