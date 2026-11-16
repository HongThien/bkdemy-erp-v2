// Kiểm bằng toạ độ số MỌI khẳng định trong lời giải mới của ý b, c (spec-giai-bai.md › Hình › Giải: verify toạ độ trước khi chốt).
// Tam giác ABC vuông tại A, AB < AC, 2.000 bộ số ngẫu nhiên (không cân). Không đụng DB.
let nKiem = 0, nFail = 0
const eq = (a, b, ten) => { nKiem++; if (Math.abs(a - b) > 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))) { nFail++; if (nFail < 6) console.log('FAIL', ten, a, b) } }
const ok = (c, ten) => { nKiem++; if (!c) { nFail++; if (nFail < 6) console.log('FAIL', ten) } }
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]], dot = (u, v) => u[0] * v[0] + u[1] * v[1], cross = (u, v) => u[0] * v[1] - u[1] * v[0]
const len = (u) => Math.hypot(u[0], u[1]), d = (p, q) => len(sub(p, q))
const goc = (p, o, q) => Math.acos(dot(sub(p, o), sub(q, o)) / (d(p, o) * d(q, o))) * 180 / Math.PI
const giao = (p, u, q, v) => { const t = cross(sub(q, p), v) / cross(u, v); return [p[0] + t * u[0], p[1] + t * u[1]] }   // p + t·u ∩ q + s·v
const giua = (x, p, q) => dot(sub(x, p), sub(q, p)) > 1e-9 && dot(sub(x, q), sub(p, q)) > 1e-9   // x nằm giữa p và q (đã thẳng hàng)
for (let lan = 0; lan < 2000; lan++) {
  const b = 1 + Math.random() * 9, c = b * (1.05 + Math.random() * 3)   // AB = b < AC = c
  const A = [0, 0], B = [b, 0], C = [0, c]
  const t = dot(sub(A, B), sub(C, B)) / dot(sub(C, B), sub(C, B)), H = [B[0] + t * (C[0] - B[0]), B[1] + t * (C[1] - B[1])]
  const M = [H[0], 0], N = [0, H[1]]
  const K = giao(A, sub(N, M), C, sub(H, A)), I = giao(A, sub(H, A), B, sub(K, B))
  // ── ý b
  eq(goc(A, H, B), 90, 'AHB=90'); eq(goc(A, M, H), 90, 'AMH=90'); eq(goc(A, N, H), 90, 'ANH=90')
  ok(giua(M, A, B), 'M giữa A,B (góc MAH = HAB là góc chung)'); ok(giua(N, A, C), 'N giữa A,C')
  eq(d(A, M) / d(A, H), d(A, H) / d(A, B), 'AM/AH=AH/AB'); eq(d(M, H) / d(H, B), d(A, M) / d(A, H), 'đồng dạng AMH~AHB cạnh thứ ba')
  eq(d(A, N) / d(A, H), d(A, H) / d(A, C), 'AN/AH=AH/AC'); eq(d(N, H) / d(H, C), d(A, N) / d(A, H), 'đồng dạng ANH~AHC cạnh thứ ba')
  eq(d(A, M) * d(A, B), d(A, H) ** 2, 'AM.AB=AH^2'); eq(d(A, N) * d(A, C), d(A, H) ** 2, 'AN.AC=AH^2'); eq(d(A, M) * d(A, B), d(A, N) * d(A, C), 'AM.AB=AN.AC')
  // ── ý c
  eq(goc(M, H, N), 90, 'MHN=90')
  const O = giao(A, sub(H, A), M, sub(N, M))
  eq(d(O, A), d(O, H), 'O trung điểm AH'); eq(d(O, M), d(O, N), 'O trung điểm MN'); eq(d(O, A), d(O, N), 'OA=ON')
  eq(goc(M, N, A), goc(H, A, C), 'MNA=HAC'); eq(goc(K, A, C), goc(M, N, A), 'KAC=MNA (so le trong)'); eq(goc(K, C, A), goc(H, A, C), 'KCA=HAC (so le trong)')
  ok(cross(sub(K, A), sub(C, A)) * cross(sub(M, N), sub(A, N)) > 0, 'K và M khác phía đối với AC (so le trong thật)')
  ok(cross(sub(K, C), sub(A, C)) * cross(sub(H, A), sub(C, A)) > 0, 'K và H khác phía đối với AC (so le trong thật)')
  eq(d(K, A), d(K, C), 'KA=KC')
  const D = giao(C, sub(K, C), A, sub(B, A)), E = [0, c / 2]
  eq(dot(sub(K, E), sub(C, A)), 0, 'KE ⊥ AC'); eq(cross(sub(K, E), sub(D, A)), 0, 'KE ∥ AD')
  ok(giua(K, C, D), 'K giữa C,D'); eq(d(C, K) / d(C, D), 0.5, 'CK/CD=1/2'); eq(d(D, K), d(K, C), 'DK=KC')
  ok(giua(A, B, D), 'A giữa B,D'); ok(giua(I, B, K), 'I giữa B,K'); ok(giua(H, B, C), 'H giữa B,C'); ok(giua(I, A, H), 'I thuộc đoạn AH')
  eq(cross(sub(I, A), sub(K, D)), 0, 'AI ∥ DK'); eq(cross(sub(H, I), sub(C, K)), 0, 'IH ∥ KC')
  eq(d(A, I) / d(D, K), d(B, I) / d(B, K), 'AI/DK=BI/BK'); eq(d(I, H) / d(K, C), d(B, I) / d(B, K), 'IH/KC=BI/BK')
  eq(d(A, I), d(I, H), 'AI=IH'); eq(d(I, O), 0, 'I trùng O'); eq(cross(sub(I, M), sub(N, M)), 0, 'M,I,N thẳng hàng')
}
console.log('phép kiểm:', nKiem, '· FAIL:', nFail)
process.exitCode = nFail ? 1 : 0
