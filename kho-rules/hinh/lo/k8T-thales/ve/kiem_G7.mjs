// kiem_G7.mjs — verify số cho TCHH CĐ5 Bài 1–6 (trạm G7). Toạ độ toán học (y hướng lên).
let n = 0, fail = 0
const ok = (cond, msg) => { n++; if (!cond) { fail++; console.log('FAIL:', msg) } }
const eq = (a, b, msg, tol = 1e-7) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)
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
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q))) * 180 / Math.PI
let seed = 12345
const rnd = (a = 0, b = 1) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return a + (b - a) * seed / 0x7fffffff }
const between = (p, a, b) => Math.abs(d(a, p) + d(p, b) - d(a, b)) < 1e-7 * d(a, b)

// ───────── Bài 1 ─────────
for (const [ac, rot] of [[1, 0], [2.3, 0.4], [5, 2]]) {
  const C = P(0, 0), A = P(0, ac)
  const R = (p) => P(p.x * Math.cos(rot) - p.y * Math.sin(rot), p.x * Math.sin(rot) + p.y * Math.cos(rot))
  const cc = R(C), aa = R(A), bc = 3 * ac
  const B = R(P(bc, 0)), D = R(P(2 * ac, 0)), E = R(P(ac, 0))
  eq(d(B, D), d(D, E), 'B1 BD=DE'); eq(d(D, E), d(E, cc), 'B1 DE=EC')
  const s = ang(E, aa, cc) + ang(D, aa, cc) + ang(B, aa, cc)
  eq(s, 90, 'B1 tổng ba góc = 90')
  eq(d(E, aa) ** 2, d(E, D) * d(E, B), 'B1 EA²=ED·EB')
  eq(ang(aa, D, E), ang(B, aa, cc), 'B1 ∠DAE = ∠ABC')
  eq(ang(E, aa, cc), 45, 'B1 ∠AEC = 45')
}

// ───────── Bài 2 ─────────
for (let t = 0; t < 300; t++) {
  const A = P(rnd(-3, 3), rnd(3, 6)), B = P(rnd(-6, -1), 0), C = P(rnd(1, 6), 0)
  let a = rnd(0.1, 1), b = rnd(0.1, 1), c = rnd(0.1, 1); const s = a + b + c; a /= s; b /= s; c /= s
  const O = P(a * A.x + b * B.x + c * C.x, a * A.y + b * B.y + c * C.y)
  const D = inter(A, O, B, C), E = inter(B, O, A, C), F = inter(C, O, A, B)
  ok(between(D, B, C) && between(E, A, C) && between(F, A, B), 'B2 D,E,F trên cạnh')
  const hx = P(1, 0)
  const M = inter(O, add(O, hx), D, F), N = inter(O, add(O, hx), D, E)
  eq(d(O, M), d(O, N), 'B2 OM=ON')
  const A2 = add(A, hx)
  const Pp = inter(B, O, A, A2), Q = inter(C, O, A, A2), I = inter(D, E, A, A2), H = inter(D, F, A, A2)
  eq(A.y, P_y(Pp), 'B2 P∈m'); eq(A.y, P_y(Q), 'B2 Q∈m'); eq(A.y, P_y(I), 'B2 I∈m'); eq(A.y, P_y(H), 'B2 H∈m')
  eq(d(O, M) / d(A, H), d(D, O) / d(D, A), 'B2 OM/AH=DO/DA')
  eq(d(O, N) / d(A, I), d(D, O) / d(D, A), 'B2 ON/AI=DO/DA')
  eq(d(A, H) / d(B, D), d(F, A) / d(F, B), 'B2 AH/BD=FA/FB')
  eq(d(A, Q) / d(B, C), d(F, A) / d(F, B), 'B2 AQ/BC=FA/FB')
  eq(d(A, I) / d(D, C), d(E, A) / d(E, C), 'B2 AI/DC=EA/EC')
  eq(d(A, Pp) / d(B, C), d(E, A) / d(E, C), 'B2 AP/BC=EA/EC')
  eq(d(A, Q) / d(D, C), d(O, A) / d(O, D), 'B2 AQ/DC=OA/OD')
  eq(d(A, Pp) / d(D, B), d(O, A) / d(O, D), 'B2 AP/DB=OA/OD')
  eq(d(A, H), d(A, I), 'B2 AH=AI')
  // vị trí: F giữa A,B ; H nằm trên tia đối FD ; Q trên tia đối FC ; P,I trên tia đối EB, ED ; A trên tia đối OD, Q trên tia đối OC
  ok(between(F, D, H) && between(F, C, Q) && between(E, B, Pp) && between(E, D, I), 'B2 F giữa D,H · F giữa C,Q · E giữa B,P · E giữa D,I')
  ok(between(O, D, A) && between(O, C, Q) && between(O, B, Pp), 'B2 O giữa D,A · C,Q · B,P')
  ok(between(M, D, H) && between(N, D, I) && between(O, D, A), 'B2 M∈DH, N∈DI, O∈DA')
}
function P_y(p) { return p.y }

// ───────── Bài 3 ─────────
for (let t = 0; t < 300; t++) {
  const A = P(rnd(-2, 4), rnd(4, 8)), B = P(rnd(-6, -1), 0), C = P(rnd(2, 7), 0)
  const D = mid(B, C), G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3)
  const r1 = rnd(1.05, 1.95), r2 = 3 - r1
  const M = lerp(A, B, 1 / r1), N = lerp(A, C, 1 / r2)
  ok(Math.abs(cr(sub(M, G), sub(N, G))) < 1e-8, 'B3 M,G,N thẳng hàng')
  eq(d(A, B) / d(A, M) + d(A, C) / d(A, N), 3, 'B3 tổng = 3')
  const v = sub(N, M)
  const Bp = inter(A, D, B, add(B, v)), Cp = inter(A, D, C, add(C, v))
  ok(par(B, Bp, M, N) && par(C, Cp, M, N), 'B3 BB'+"'"+'∥MN, CC'+"'"+'∥MN')
  eq(d(A, B) / d(A, M), d(A, Bp) / d(A, G), "B3 AB/AM=AB'/AG")
  eq(d(A, C) / d(A, N), d(A, Cp) / d(A, G), "B3 AC/AN=AC'/AG")
  const m2 = mid(Bp, Cp); eq(d(m2, D), 0, "B3 D trung điểm B'C'", 1e-7)
  // B', C' cùng phía A trên tia AG
  ok(dot(sub(Bp, A), sub(G, A)) > 0 && dot(sub(Cp, A), sub(G, A)) > 0, "B3 B',C' trên tia AG")
  eq(d(A, Bp) + d(A, Cp), 2 * d(A, D), "B3 AB'+AC'=2AD")
  eq(2 * d(A, D), 3 * d(A, G), 'B3 3AG=2AD')
  // đối xứng tâm D biến B→C và BB'→CC'
  const Bs = P(2 * D.x - Bp.x, 2 * D.y - Bp.y); eq(d(Bs, Cp), 0, "B3 đối xứng tâm D: B'→C'", 1e-7)
}
// trường hợp MN ∥ BC
{
  const A = P(1, 6), B = P(-4, 0), C = P(5, 0), D = mid(B, C), G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3)
  const M = lerp(A, B, 2 / 3), N = lerp(A, C, 2 / 3)
  ok(par(M, N, B, C) && Math.abs(cr(sub(M, G), sub(N, G))) < 1e-8, 'B3 MN∥BC qua G')
  eq(d(A, B) / d(A, M) + d(A, C) / d(A, N), 3, 'B3 MN∥BC tổng = 3')
}

// ───────── Bài 4 ─────────
for (let t = 0; t < 500; t++) {
  const A = P(0, 0), B = P(0, rnd(1, 6)), C = P(rnd(1, 7), 0)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  // đường thẳng qua A: góc theta (đo từ trục x) — mọi hướng trừ trục
  const th = rnd(2, 178) * Math.PI / 180 + (rnd() < 0.5 ? 0 : Math.PI)
  const dir = P(Math.cos(th), Math.sin(th))
  if (Math.abs(dir.x) < 0.02 || Math.abs(dir.y) < 0.02) continue
  const E = inter(A, add(A, dir), H, M), F = inter(A, add(A, dir), H, N)
  ok(par(B, E, C, F), 'B4 BE∥CF (mọi đường qua A)')
  ok(par(H, M, A, C) && par(H, N, A, B), 'B4 HM∥AC, HN∥AB')
  eq(d(M, A), d(H, N), 'B4 MA=HN (AMHN chữ nhật)'); eq(d(M, H), d(A, N), 'B4 MH=AN')
  // cấu hình hình sách: đường thẳng không cắt trong góc BAC (E, F ngoài hai cạnh): dir.x*dir.y<0
  if (dir.x * dir.y < 0) {
    const K = inter(B, E, H, F)
    ok(between(M, E, H), 'B4 M giữa E,H')
    ok(between(B, E, K), 'B4 B giữa E,K')
    ok(between(H, K, F), 'B4 H giữa K,F')
    ok(between(H, B, C), 'B4 H giữa B,C')
    ok(par(M, B, H, K), 'B4 MB∥HK')
    eq(d(E, M) / d(E, H), d(M, A) / d(H, F), 'B4 EM/EH=MA/HF (AM∥HF)')
    eq(d(E, M) / d(E, H), d(H, N) / d(H, F), 'B4 (1) EM/EH=HN/HF')
    eq(d(E, M) / d(E, H), d(M, B) / d(H, K), 'B4 (2) EM/EH=MB/HK')
    eq(d(H, F) / d(H, K), d(H, N) / d(M, B), 'B4 (3) HF/HK=HN/MB')
    eq(d(H, N) / d(A, B), d(C, H) / d(C, B), 'B4 HN/AB=CH/CB')
    eq(d(M, B) / d(A, B), d(B, H) / d(B, C), 'B4 MB/AB=BH/BC')
    eq(d(H, N) / d(M, B), d(C, H) / d(B, H), 'B4 (4) HN/MB=CH/BH')
    eq(d(H, F) / d(H, K), d(H, C) / d(H, B), 'B4 HF/HK=HC/HB')
  }
}

// ───────── Bài 5 ─────────
for (let t = 0; t < 300; t++) {
  const A = P(0, 0), B = P(0, rnd(1, 6)), C = P(rnd(1, 7), 0)
  const D = foot(A, B, C), E = foot(D, A, C), F = foot(D, A, B)
  ok(between(D, B, C) && between(E, A, C) && between(F, A, B), 'B5 D,E,F thuộc cạnh')
  ok(par(D, E, A, B) && par(D, F, A, C), 'B5 DE∥AB, DF∥AC')
  eq(d(C, E) / d(C, A), d(C, D) / d(C, B), 'B5 CE/CA=CD/CB')
  eq(d(B, F) / d(B, A), d(B, D) / d(B, C), 'B5 BF/BA=BD/BC')
  eq(d(A, D) ** 2, d(B, D) * d(C, D), 'B5 AD²=BD·CD')
  eq(d(A, C) ** 2, d(C, D) * d(B, C), 'B5 AC²=CD·BC'); eq(d(A, B) ** 2, d(B, D) * d(B, C), 'B5 AB²=BD·BC')
  eq(d(C, D) / d(B, D), d(A, C) ** 2 / d(A, B) ** 2, 'B5 CD/BD=AC²/AB²')
  eq(d(A, C) ** 3 / d(A, B) ** 3, d(C, E) / d(B, F), 'B5 kết luận AC³/AB³=CE/BF')
}

// ───────── Bài 6 ─────────
for (let t = 0; t < 300; t++) {
  const A = P(rnd(-3, 4), rnd(3, 8)), B = P(rnd(-6, -1), 0), C = P(rnd(2, 7), 0)
  const ub = mul(sub(B, A), 1 / d(A, B)), uc = mul(sub(C, A), 1 / d(A, C))
  const D = inter(A, add(A, add(ub, uc)), B, C)
  eq(ang(A, B, D), ang(A, D, C), 'B6 AD là phân giác')
  const E = inter(D, add(D, sub(C, A)), A, B)
  ok(between(E, A, B), 'B6 E thuộc cạnh AB')
  ok(par(D, E, A, C), 'B6 DE∥AC')
  eq(ang(A, E, D), ang(D, E, A), 'B6 ∠EAD=∠EDA')
  eq(ang(D, E, A), ang(A, D, C), 'B6 ∠EDA=∠DAC (so le trong)')
  eq(d(E, A), d(E, D), 'B6 AE=ED')
  eq(d(A, E) / d(A, B), d(D, C) / d(B, C), 'B6 AE/AB=DC/BC')
  eq(d(E, D) / d(A, C), d(B, D) / d(B, C), 'B6 DE/AC=BD/BC')
  eq(d(A, E) / d(A, C), d(B, D) / d(B, C), 'B6 AE/AC=BD/BC')
  eq(1 / d(A, B) + 1 / d(A, C), 1 / d(A, E), 'B6 kết luận 1/AB+1/AC=1/AE')
}
console.log(`số phép kiểm: ${n} · FAIL: ${fail}`)
