// kiem_G5 — kiểm bằng toạ độ số các khẳng định của lời giải bài NĐT H3.10–14. Chạy: node kiem_G5.mjs
let tong = 0, loi = 0
const eq = (a, b, m, e = 1e-9) => { tong++; if (!(Math.abs(a - b) < e)) { loi++; console.log('FAIL', m, a, b) } }
const ok = (c, m) => { tong++; if (!c) { loi++; console.log('FAIL', m) } }
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const cr = (u, v) => u.x * v.y - u.y * v.x
const dot = (u, v) => u.x * v.x + u.y * v.y
const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-9 * (1 + d(a, b) * d(c, e))
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const rnd = (() => { let s = 12345; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296 })()

// ── Bài 10: AD=12 DB=10 AE=13,2 EC=11 BF=9 FC=10,8
{
  const AB = 22, AC = 24.2, BC = 19.8
  const ax = (AB * AB - AC * AC + BC * BC) / (2 * BC), ay = Math.sqrt(AB * AB - ax * ax)
  const B = P(0, 0), C = P(BC, 0), A = P(ax, ay)
  const D = lerp(A, B, 12 / 22), E = lerp(A, C, 13.2 / 24.2), F = lerp(B, C, 9 / 19.8)
  eq(d(A, D), 12, 'AD'); eq(d(D, B), 10, 'DB'); eq(d(A, E), 13.2, 'AE'); eq(d(E, C), 11, 'EC'); eq(d(B, F), 9, 'BF'); eq(d(F, C), 10.8, 'FC')
  eq(12 / 10, 6 / 5, 'AD/DB'); eq(13.2 / 11, 6 / 5, 'AE/EC'); eq(10 / 12, 5 / 6, 'BD/DA'); eq(9 / 10.8, 5 / 6, 'BF/FC')
  ok(par(D, E, B, C), 'DE//BC'); ok(par(D, F, A, C), 'DF//AC')
  // các cặp còn lại không song song (trong {DE,DF,AB,BC,CA}) — ngoài hai cặp trên
  const L = { DE: [D, E], DF: [D, F], AB: [A, B], BC: [B, C], CA: [C, A] }
  const names = Object.keys(L); const song = []
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if (par(...L[names[i]], ...L[names[j]])) song.push(names[i] + '//' + names[j])
  eq(song.length, 2, 'đúng 2 cặp song song'); ok(song.includes('DE//BC') && song.includes('DF//CA'), 'tập cặp = {DE//BC, DF//AC}')
  ok(!par(E, F, A, B), 'EF không // AB')
}

// ── Bài 11: AD=5 DB=7,5 DE=6,4, x=BC
for (const bx of [2, 4.5, 9]) {
  const by = Math.sqrt(12.5 * 12.5 - bx * bx)
  const B = P(0, 0), C = P(16, by * 0), A = P(bx, by)
  const D = lerp(A, B, 0.4), E = lerp(A, C, 0.4)
  eq(d(A, B), 12.5, 'AB'); eq(d(A, D), 5, 'AD'); eq(d(D, B), 7.5, 'DB'); ok(par(D, E, B, C), 'DE//BC')
  eq(d(D, E), 6.4, 'DE=6,4 khi BC=16'); eq(6.4 * 12.5 / 5, 16, 'x=16'); eq(d(B, C), 16, 'x')
}

// ── Bài 12: AD/DB=AE/EC ⇒ DE∥BC, AD/AB=DE/BC (ngẫu nhiên nhiều bộ)
for (let i = 0; i < 6; i++) {
  const A = P(rnd() * 5, 8 + rnd() * 5), B = P(-3 - rnd() * 4, 0), C = P(6 + rnd() * 6, 0)
  const t = 0.15 + rnd() * 0.7                          // AD/AB = t ⇒ AD/DB = t/(1-t) = AE/EC
  const D = lerp(A, B, t), E = lerp(A, C, t)
  eq(d(A, D) / d(D, B), d(A, E) / d(E, C), 'gt tỉ lệ')
  ok(par(D, E, B, C), 'DE//BC'); eq(d(A, D) / d(A, B), d(D, E) / d(B, C), 'AD/AB=DE/BC')
}

// ── Bài 13: hbh ABCD, Ax cắt BD ở M, BC ở N, CD ở K
for (let i = 0; i < 8; i++) {
  const A = P(rnd() * 3, 5), B = P(5 + rnd() * 4, 5), D = P(-2 + rnd() * 4, 0)
  const C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  // hướng tia: qua điểm N trên BC (0<u<1) để N nằm trong cạnh
  const u = 0.15 + rnd() * 0.7, N0 = lerp(B, C, u)
  const M = inter(A, N0, B, D), N = inter(A, N0, B, C), K = inter(A, N0, D, C)
  ok(par(A, B, D, K) && par(A, D, B, N), 'AB//DK, AD//BN')
  eq(d(M, B) / d(M, D), d(M, A) / d(M, K), 'MB/MD=MA/MK', 1e-7)
  eq(d(M, B) / d(M, D), d(M, N) / d(M, A), 'MB/MD=MN/MA', 1e-7)
  eq(d(M, A) ** 2, d(M, N) * d(M, K), 'MA²=MN·MK', 1e-7)
  // thứ tự: M giữa B,D; M giữa A,N (A,M,N,K theo thứ tự); K ngoài đoạn CD phía C
  const tpar = (p, a, b) => dot(sub(p, a), sub(b, a)) / dot(sub(b, a), sub(b, a))
  ok(tpar(M, B, D) > 0 && tpar(M, B, D) < 1, 'M giữa B,D')
  ok(tpar(M, A, K) > 0 && tpar(N, A, K) > tpar(M, A, K) && tpar(N, A, K) < 1, 'A,M,N,K thứ tự')
  ok(tpar(K, D, C) > 1, 'K ngoài đoạn CD, phía C')
}

// ── Bài 14: AM trung tuyến, đường song song BC cắt AB, AM, AC ở D, N, E
for (let i = 0; i < 6; i++) {
  const A = P(rnd() * 6 - 1, 7 + rnd() * 4), B = P(-4 - rnd() * 3, 0), C = P(5 + rnd() * 5, 0)
  const M = lerp(B, C, 0.5), t = 0.2 + rnd() * 0.6
  const D = lerp(A, B, t), E = lerp(A, C, t), N = lerp(A, M, t)
  ok(par(D, E, B, C), 'DE//BC')
  ok(Math.abs(cr(sub(N, D), sub(E, D))) < 1e-9, 'D,N,E thẳng hàng')
  eq(d(D, N) / d(B, M), d(A, N) / d(A, M), 'DN/BM=AN/AM')
  eq(d(N, E) / d(M, C), d(A, N) / d(A, M), 'NE/MC=AN/AM')
  eq(d(B, M), d(M, C), 'BM=MC'); eq(d(D, N), d(N, E), 'DN=NE')
  const tt = dot(sub(N, D), sub(E, D)) / dot(sub(E, D), sub(E, D)); eq(tt, 0.5, 'N trung điểm DE')
  // D,E khác phía đường thẳng AM
  ok(cr(sub(M, A), sub(D, A)) * cr(sub(M, A), sub(E, A)) < 0, 'D,E khác phía AM')
}

console.log(`kiem_G5: ${tong} phép kiểm, FAIL = ${loi}`)
process.exit(loi ? 1 : 0)
