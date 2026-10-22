// Thử lại bằng số các ví dụ J3 (P1.5, P2.1, P2.2, P2.3)
const eq = (a, b, tag, eps = 1e-9) => { const ok = Math.abs(a - b) < eps; console.log((ok ? 'OK  ' : 'SAI ') + tag + ' ' + a + ' vs ' + b); if (!ok) process.exitCode = 1 }
const sub = (a, b) => a.map((x, i) => x - b[i])
const add = (a, b) => a.map((x, i) => x + b[i])
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0)
const nrm = (a) => Math.sqrt(dot(a, a))
const sc = (k, a) => a.map((x) => k * x)

// ---- P1.5.1 VD1: 3,4,12 vuông góc
const F = add(add([3, 0, 0], [0, 4, 0]), [0, 0, 12])
eq(nrm(F), 13, 'P1.5.1 VD1 |F|')
// ---- P1.5.1 VD2: đèn chùm 4 xích, ASC=90
{
  const r = 1, A = [r, 0, 0], C = [-r, 0, 0], B = [0, r, 0], D = [0, -r, 0], S = [0, 0, -r]
  const sa = sub(A, S), sc2 = sub(C, S)
  eq(dot(sa, sc2), 0, 'ASC=90')
  eq(nrm(sa), Math.SQRT2 * r, 'l = r√2')
  eq(nrm(sub([0, 0, 0], S)), Math.SQRT2 / 2 * nrm(sa), 'SO = l√2/2')
  const P = 40, T = 40 / (2 * Math.SQRT2)
  eq(T, 10 * Math.SQRT2, 'T=10√2')
  let tot = [0, 0, 0]
  for (const X of [A, B, C, D]) { const v = sub(X, S); tot = add(tot, sc(T / nrm(v), v)) }
  eq(tot[0], 0, 'tong x'); eq(tot[1], 0, 'tong y'); eq(tot[2], P, 'tong z = P')
  console.log('T ≈', T.toFixed(3))
}
// ---- P1.5.2
eq(120 * 25 * Math.cos(Math.PI / 3), 1500, 'P1.5.2 VD1 A')
eq(120 * 25, 3000, 'P1.5.2 VD1 ngang')
{
  const m = 20, g = 9.8, L = 6, al = 30 * Math.PI / 180
  // trọng lực P=(0,0,-mg); dịch chuyển d: xuống dốc: (cosα,0,-sinα)*L
  const P = [0, 0, -m * g], d = [L * Math.cos(al), 0, -L * Math.sin(al)]
  eq(dot(P, d), 588, 'P1.5.2 VD2 trong luc')
  eq(m * g * L * Math.sin(al), 588, 'mgh')
  const fms = sc(-40 / L, d) // ngược hướng d, độ lớn 40
  eq(nrm(fms), 40, '|fms|')
  eq(dot(fms, d), -240, 'ma sat')
  const N = [m * g * Math.sin(al), 0, m * g * Math.cos(al)]
  eq(dot(N, d), 0, 'phan luc 0')
  eq(dot(add(add(P, fms), N), d), 348, 'tong cong')
  // góc giữa P và d
  eq(Math.acos(dot(P, d) / (nrm(P) * nrm(d))) * 180 / Math.PI, 60, 'goc 60')
}
// ---- P2.1.1 VD1
{
  const pts = { A: [3, 0, 0], B: [0, -2, 0], C: [0, 0, 5], D: [1, 0, 4], E: [0, -3, 2], F: [2, 4, -1] }
  const z = (p) => p.map((x) => x === 0)
  const res = { Ox: [], Oy: [], Oz: [], Oxy: [], Oyz: [], Oxz: [], none: [] }
  for (const [n, p] of Object.entries(pts)) {
    const zz = z(p)
    if (zz[1] && zz[2]) res.Ox.push(n); if (zz[0] && zz[2]) res.Oy.push(n); if (zz[0] && zz[1]) res.Oz.push(n)
    if (zz[2]) res.Oxy.push(n); if (zz[0]) res.Oyz.push(n); if (zz[1]) res.Oxz.push(n)
    if (!zz.some(Boolean)) res.none.push(n)
  }
  console.log(JSON.stringify(res))
}
// P2.1.1 VD2: A(m-2; m^2-4; 2m+1)
{
  const A = (m) => [m - 2, m * m - 4, 2 * m + 1]
  console.log('Oz m=2', A(2)); console.log('Oxy m=-1/2', A(-0.5))
  for (const m of [2, -2, -0.5]) console.log('Ox? m=', m, A(m))
}
// P2.1.2 VD2
{
  const M = [2, 4, -5]
  console.log('M1 (Oxz)', [M[0], 0, M[2]], 'M2 (Ox)', [M[0], -M[1], -M[2]], 'N (Oyz)', [-M[0], M[1], M[2]])
}
// P2.1.3 VD2
{
  const OA = [2, -3, 1], BO = [1, 2, -4], OB = sc(-1, BO), AB = sub(OB, OA)
  console.log('B', OB, 'AB', AB)
}
// ---- P2.2.1 VD1 hộp 4,3,5 gốc A
{
  const a = 4, b = 3, c = 5
  const A = [0, 0, 0], B = [a, 0, 0], D = [0, b, 0], Ap = [0, 0, c]
  const C = add(B, D), Cp = add(C, Ap)
  const M = [C[0], C[1], c / 2]
  const Bp = add(B, Ap), Dp = add(D, Ap)
  const I = sc(0.5, add(Ap, Cp))
  console.log('C', C, "C'", Cp, 'M', M, 'I', I, "B'", Bp, "D'", Dp)
  eq(nrm(sub(Cp, A)) ** 2, 16 + 9 + 25, 'AC^2')
}
// P2.2.1 VD2 lập phương 6 gốc C
{
  const C = [0, 0, 0], D = [6, 0, 0], B = [0, 6, 0], Cp = [0, 0, 6]
  const A = add(B, D), Ap = add(A, Cp), Bp = add(B, Cp), Dp = add(D, Cp)
  const K = sc(0.25, add(add(A, B), add(Bp, Ap)))
  const N = add(A, [0, 0, 2])
  console.log('A', A, "A'", Ap, "B'", Bp, "D'", Dp, 'K', K, 'N', N)
  eq(dot(sub(A, B), sub(C, B)), 0, 'ABC vuông') // BA·BC
  eq(nrm(sub(A, B)), 6, 'AB=6')
}
// ---- P2.2.2 VD1 chóp S.ABCD gốc A
{
  const A = [0, 0, 0], B = [3, 0, 0], D = [0, 4, 0], C = [3, 4, 0], S = [0, 0, 5]
  eq(dot(sub(B, A), sub(S, A)), 0, 'AB.AS'); eq(dot(sub(D, A), sub(S, A)), 0, 'AD.AS')
  console.log('M(AM=2)', [0, 0, 2], 'N', [0, 2, 0], 'P', [3, 2, 0])
}
// P2.2.2 VD2 S.ABC gốc B
{
  const B = [0, 0, 0], A = [3, 0, 0], C = [0, 4, 0], S = [3, 0, 6]
  eq(dot(sub(A, B), sub(C, B)), 0, 'BA.BC')
  eq(dot(sub(S, A), sub(A, B)), 0, 'SA.AB'); eq(dot(sub(S, A), sub(C, B)), 0, 'SA.BC')
  eq(nrm(sub(S, A)), 6, 'SA=6')
  const D = add(A, sub(C, B)); console.log('D', D, 'M', [3, 0, 2])
}
// ---- P2.2.3 VD1 lăng trụ đáy đều 4
{
  const s3 = Math.sqrt(3)
  const B = [-2, 0, 0], C = [2, 0, 0], A = [0, 2 * s3, 0]
  eq(nrm(sub(A, B)), 4, 'AB'); eq(nrm(sub(A, C)), 4, 'AC'); eq(nrm(sub(C, B)), 4, 'BC')
  console.log("A'", add(A, [0, 0, 6]))
}
// P2.2.3 VD2 hình thoi 4, BAD=60, SO=3
{
  const s3 = Math.sqrt(3)
  const A = [2 * s3, 0, 0], C = [-2 * s3, 0, 0], B = [0, 2, 0], D = [0, -2, 0], S = [0, 0, 3]
  eq(nrm(sub(A, B)), 4, 'AB'); eq(nrm(sub(B, C)), 4, 'BC'); eq(nrm(sub(C, D)), 4, 'CD'); eq(nrm(sub(D, A)), 4, 'DA')
  const AB = sub(B, A), AD = sub(D, A)
  eq(Math.acos(dot(AB, AD) / (nrm(AB) * nrm(AD))) * 180 / Math.PI, 60, 'BAD=60')
  eq(dot(sub(A, C), sub(B, D)), 0, 'AC⊥BD')
  console.log('AB^2', nrm(AB) ** 2)
}
// ---- P2.3.1 VD1 phòng 8x6x3
console.log('den', [4, 3, 3 - 0.5], 'o cam', [2, 0, 0.4], 'camera', [8, 6, 3])
// P2.3.1 VD2 kho 10x6, tường 3, mái cao 2
console.log('E', [0, 3, 5], 'F', [10, 3, 5], 'M(cách F 4)', [6, 3, 5])
// ---- P2.3.2 VD1 cần trục
{
  const H = [20, 0, 25], K = [12, 9, 0]
  console.log('HK', sub(K, H))
}
// P2.3.2 VD2 giá ba chân
{
  const R = 0.6, s3 = Math.sqrt(3)
  const A = [R, 0, 0], B = [R * Math.cos(2 * Math.PI / 3), R * Math.sin(2 * Math.PI / 3), 0], C = [R * Math.cos(4 * Math.PI / 3), R * Math.sin(4 * Math.PI / 3), 0], S = [0, 0, 1.5]
  eq(B[0], -0.3, 'Bx'); eq(B[1], 0.3 * s3, 'By'); eq(C[1], -0.3 * s3, 'Cy')
  const sa = sub(A, S), sb = sub(B, S), sc3 = sub(C, S)
  eq(nrm(sub(A, B)), nrm(sub(B, C)), 'đều'); eq(nrm(sub(A, B)), R * s3, 'cạnh = 0.6√3')
  console.log('SA', sa, 'SB', sb, 'SC', sc3, 'tong', add(add(sa, sb), sc3))
}
