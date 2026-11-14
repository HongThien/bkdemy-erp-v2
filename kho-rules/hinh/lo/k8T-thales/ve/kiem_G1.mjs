// kiem_G1.mjs — verify số các khẳng định của lời giải NDT-H1.19..23 (nhiều bộ toạ độ ngẫu nhiên)
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-7) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const add = (a, b) => P(a.x + b.x, a.y + b.y), sub = (a, b) => P(a.x - b.x, a.y - b.y), mul = (a, k) => P(a.x * k, a.y * k)
const mid = (a, b) => mul(add(a, b), 0.5)
const dot = (u, v) => u.x * v.x + u.y * v.y, cr = (u, v) => u.x * v.y - u.y * v.x
const len = (u) => Math.hypot(u.x, u.y)
const par = (a, b, c, d) => near(cr(sub(b, a), sub(d, c)), 0, 1e-9)      // ab ∥ cd (hoặc trùng)
const perp = (a, b, c, d) => near(dot(sub(b, a), sub(d, c)), 0, 1e-9)
const col = (a, b, c) => near(cr(sub(b, a), sub(c, a)), 0, 1e-9)
const foot = (p, a, b) => { const d = sub(b, a); return add(a, mul(d, dot(sub(p, a), d) / dot(d, d))) }
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c); return add(a, mul(r, cr(sub(c, a), s) / cr(r, s))) }
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (len(sub(p, v)) * len(sub(q, v))))

for (let t = 0; t < 40; t++) {
  // 19
  { const a = R(1, 9), b = R(1, 9), A = P(0, 0), B = P(0, a), C = P(b, 0), M = mid(B, C), N = foot(M, A, B)
    chk('19 MN∥AC', par(M, N, A, C)); chk('19 N trung điểm AB', near(len(sub(N, A)), len(sub(N, B))) && col(A, N, B))
    chk('19 N∈cạnh AB', dot(sub(N, A), sub(N, B)) < 0) }
  // 20 cân tại A (tam giác tuỳ ý, đối xứng qua trục dựng bằng quay)
  { const h = R(1, 9), w = R(1, 9), th = R(0, 6.28), rotp = (p) => P(p.x * Math.cos(th) - p.y * Math.sin(th), p.x * Math.sin(th) + p.y * Math.cos(th))
    const A = rotp(P(0, h)), B = rotp(P(-w, 0)), C = rotp(P(w, 0)), D = mid(A, B), E = mid(A, C)
    chk('20 DE∥BC', par(D, E, B, C)); chk('20 DE=BC/2', near(len(sub(E, D)), len(sub(C, B)) / 2))
    chk('20 góc B=C', near(ang(B, A, C), ang(C, A, B))); chk('20 ∠DBC=∠ABC', near(ang(B, D, C), ang(B, A, C)))
    chk('20 BD=CE (thang cân)', near(len(sub(B, D)), len(sub(C, E)))); chk('20 BDEC lồi/hình thang', cr(sub(D, B), sub(E, D)) * cr(sub(C, E), sub(B, C)) > 0)
    chk('20 BC≠DE', !near(len(sub(E, D)), len(sub(C, B)))) }
  // 21 hình thang AB ∥ CD
  { const A = P(R(0, 3), 4), B = P(R(5, 9), 4), D = P(R(-3, 1), 0), C = P(R(6, 11), 0)
    const M = mid(A, D), N = mid(B, C), K = mid(A, C)
    chk('21a MK∥CD', par(M, K, C, D)); chk('21a MK∥AB', par(M, K, A, B))
    chk('21b KN∥AB', par(K, N, A, B)); chk('21b M,N,K thẳng hàng', col(M, K, N))
    chk('21 MN∥AB, MN=(AB+CD)/2', par(M, N, A, B) && near(len(sub(N, M)), (len(sub(B, A)) + len(sub(C, D))) / 2)) }
  // 22 trung tuyến
  { const A = P(R(-3, 3), R(3, 8)), B = P(R(-9, -2), 0), C = P(R(2, 9), 0)
    const D = mid(A, C), E = mid(A, B), G = inter(B, D, C, E), M = mid(G, B), N = mid(G, C)
    chk('22 G trọng tâm', near(G.x, (A.x + B.x + C.x) / 3) && near(G.y, (A.y + B.y + C.y) / 3))
    chk('22 DE∥BC', par(D, E, B, C)); chk('22 MN∥BC', par(M, N, B, C)); chk('22 DE∥MN', par(D, E, M, N))
    chk('22 DE=BC/2', near(len(sub(E, D)), len(sub(C, B)) / 2)); chk('22 MN=BC/2', near(len(sub(N, M)), len(sub(C, B)) / 2))
    chk('22 DE=MN', near(len(sub(E, D)), len(sub(N, M)))); chk('22 DE≠MN (phân biệt)', !near(D.y, M.y, 1e-6)) }
  // 23 vuông tại A
  { const a = R(1, 9), b = R(1, 9), A = P(0, 0), B = P(0, a), C = P(b, 0), H = foot(A, B, C), M = mid(A, H), N = mid(H, C)
    chk('23 AH⊥BC', perp(A, H, B, C)); chk('23 MN∥AC', par(M, N, A, C)); chk('23 MN⊥AB', perp(M, N, A, B))
    chk('23 AH⊥BN (N∈BC)', col(B, C, N) && perp(A, H, B, N)); chk('23 BM⊥AN', perp(B, M, A, N))
    const Hs = inter(P(N.x, N.y), M, A, H); chk('23 M = giao NM và AH', near(Hs.x, M.x) && near(Hs.y, M.y))
    chk('23 N∈cạnh HC', dot(sub(N, H), sub(N, C)) < 0 && col(H, N, C)) }
}
console.log(`kiem_G1: ${ok} phép kiểm đạt, ${fail} FAIL`)
