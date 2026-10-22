// thu.mjs — thử bằng số các ví dụ J1 (P1.1.x, P1.2.x). Mọi hình đặt toạ độ cụ thể; so với đáp số ghi trong ra/J1.txt.
const sub = (a, b) => a.map((x, i) => x - b[i])
const add = (...vs) => vs.reduce((a, b) => a.map((x, i) => x + b[i]))
const mul = (k, a) => a.map((x) => k * x)
const len = (a) => Math.hypot(...a)
const eq = (a, b) => len(sub(a, b)) < 1e-9
const V = (P, X, Y) => sub(P[Y], P[X]) // vectơ XY
let sai = 0
const ok = (cond, msg) => { if (!cond) { sai++; console.log('SAI:', msg) } else console.log('ok :', msg) }
const near = (x, y) => Math.abs(x - y) < 1e-9

// ---------- hộp xiên bất kì ABCD.A'B'C'D' ----------
function hop(A, u, w, t) { // A, u=AB, w=AD, t=AA'
  const P = { A }
  P.B = add(A, u); P.D = add(A, w); P.C = add(A, u, w)
  for (const k of ['A', 'B', 'C', 'D']) P[k + "'"] = add(P[k], t)
  return P
}
const H = hop([1, 2, -1], [3, 0.5, 1], [-0.7, 2.5, 0.4], [0.9, -0.6, 2.8])
// ---- P1.1.1 VD1: vectơ bằng AB, đối của AB, cùng phương AA'
{
  const ten = Object.keys(H)
  const vec = []; for (const x of ten) for (const y of ten) if (x !== y) vec.push([x, y, V(H, x, y)])
  const AB = V(H, 'A', 'B'), AA = V(H, 'A', "A'")
  const bang = vec.filter(([, , v]) => eq(v, AB)).map(([x, y]) => x + y)
  const doi = vec.filter(([, , v]) => eq(v, mul(-1, AB))).map(([x, y]) => x + y)
  const cp = vec.filter(([, , v]) => len(cross(v, AA)) < 1e-9)
  console.log('bằng AB:', bang.join(','), '| đối:', doi.join(','), '| cùng phương AA\':', cp.length)
  ok(bang.length === 4, 'P1.1.1 VD1: bằng AB (kể cả AB) = 4 -> 3 vectơ khác chính nó')
  ok(doi.length === 4, 'P1.1.1 VD1: đối AB = 4')
  ok(cp.length === 8, 'P1.1.1 VD1: cùng phương AA\' = 8')
}
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] }
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0)
// ---- P1.1.1 VD2: lăng trụ tam giác
{
  const A = [0, 0, 0], B = [4, 0.3, 0.2], C = [1.5, 3, -0.4], t = [0.8, 1.1, 3]
  const P = { A, B, C }; for (const k of 'ABC') P[k + "'"] = add(P[k], t)
  const ten = Object.keys(P)
  const vec = []; for (const x of ten) for (const y of ten) if (x !== y) vec.push([x, y, V(P, x, y)])
  const AA = V(P, 'A', "A'")
  const cp = vec.filter(([, , v]) => len(cross(v, AA)) < 1e-9)
  const ch = cp.filter(([, , v]) => dot(v, AA) > 0)
  const n = cross(V(P, 'A', 'B'), V(P, 'A', 'C'))
  const trong = vec.filter(([x, y]) => ['A', 'B', 'C'].includes(x) && ['A', 'B', 'C'].includes(y))
  const song = vec.filter(([, , v]) => Math.abs(dot(v, n)) < 1e-9)
  ok(cp.length === 6, 'P1.1.1 VD2a: cùng phương AA\' = 6')
  ok(ch.length === 3, 'P1.1.1 VD2b: cùng hướng AA\' (kể cả nó) = 3')
  ok(trong.length === 6, 'P1.1.1 VD2c: giá nằm trong (ABC) = 6')
  ok(song.length === 12, 'P1.1.1 VD2d: giá song song hoặc nằm trong (ABC) = 12')
}
// ---------- P1.1.2 ----------
{ // hộp chữ nhật AB=4, AD=3, AA'=4
  const P = hop([0, 0, 0], [4, 0, 0], [0, 3, 0], [0, 0, 4])
  ok(near(len(add(V(P, 'A', 'B'), V(P, 'A', 'D'))), 5), 'P1.1.2 VD1a |AB+AD|=5')
  ok(near(len(add(V(P, 'B', 'C'), V(P, 'D', "D'"))), 5), 'P1.1.2 VD1b |BC+DD\'|=5')
  ok(near(len(sub(V(P, 'A', "A'"), V(P, 'A', 'B'))), 4 * Math.sqrt(2)), 'P1.1.2 VD1c |AA\'-AB|=4√2')
  ok(eq(sub(V(P, 'A', "A'"), V(P, 'A', 'B')), V(P, 'B', "A'")), 'P1.1.2 VD1c: AA\'-AB = BA\'')
  ok(eq(add(V(P, 'B', 'C'), V(P, 'D', "D'")), V(P, 'A', "D'")), 'P1.1.2 VD1b: = AD\'')
}
{ // tứ diện đều cạnh 6: A=(0,0,0)...
  const a = 6, h = a * Math.sqrt(6) / 3
  const A = [0, 0, h], B = [a * Math.sqrt(3) / 3, 0, 0], C = [-a * Math.sqrt(3) / 6, a / 2, 0], D = [-a * Math.sqrt(3) / 6, -a / 2, 0]
  const P = { A, B, C, D }
  for (const [x, y] of ['AB', 'AC', 'AD', 'BC', 'BD', 'CD']) ok(near(len(V(P, x, y)), 6), `tứ diện đều ${x}${y}=6`)
  const M = mul(0.5, add(B, C)); P.M = M
  ok(near(len(add(V(P, 'A', 'B'), V(P, 'A', 'C'))), 6 * Math.sqrt(3)), 'P1.1.2 VD2a |AB+AC|=6√3')
  ok(near(len(sub(V(P, 'A', 'B'), V(P, 'A', 'C'))), 6), 'P1.1.2 VD2b |AB-AC|=6')
  ok(near(len(sub(V(P, 'A', 'M'), V(P, 'D', 'M'))), 6), 'P1.1.2 VD2c |AM-DM|=6')
  ok(eq(sub(V(P, 'A', 'M'), V(P, 'D', 'M')), V(P, 'A', 'D')), 'P1.1.2 VD2c: AM-DM = AD')
}
// ---------- P1.2.1 ----------
{
  const [AB, AD, AA] = [V(H, 'A', 'B'), V(H, 'A', 'D'), V(H, 'A', "A'")]
  ok(eq(add(AB, AD, AA), V(H, 'A', "C'")), 'quy tắc hộp AB+AD+AA\'=AC\'')
  ok(eq(add(V(H, 'A', 'B'), V(H, "B'", "C'"), V(H, 'D', "D'")), V(H, 'A', "C'")), 'P1.2.1 VD1a AB+B\'C\'+DD\'=AC\'')
  ok(eq(add(V(H, 'C', 'B'), V(H, 'C', 'D'), V(H, 'C', "C'")), V(H, 'C', "A'")), 'P1.2.1 VD1b CB+CD+CC\'=CA\'')
  ok(eq(sub(sub(V(H, 'A', "C'"), V(H, 'B', 'C')), V(H, 'B', "B'")), V(H, 'A', 'B')), 'P1.2.1 VD1c AC\'-BC-BB\'=AB')
  const Q = hop([0, 0, 0], [2, 0, 0], [0, 3, 0], [0, 0, 6])
  ok(near(len(add(V(Q, 'A', 'B'), V(Q, 'A', 'D'), V(Q, 'A', "A'"))), 7), 'P1.2.1 VD2a =7')
  ok(near(len(sub(V(Q, 'A', "C'"), V(Q, 'A', 'B'))), 3 * Math.sqrt(5)), 'P1.2.1 VD2b |AC\'-AB|=3√5')
  ok(eq(sub(V(Q, 'A', "C'"), V(Q, 'A', 'B')), V(Q, 'B', "C'")), 'P1.2.1 VD2b: AC\'-AB=BC\'')
}
// ---------- P1.2.2 ----------
{
  const A = [0, 0, 0], B = [4, 0.3, 0.2], C = [1.5, 3, -0.4], t = [0.8, 1.1, 3]
  const P = { A, B, C }; for (const k of 'ABC') P[k + "'"] = add(P[k], t)
  ok(eq(add(V(P, 'A', 'B'), V(P, "B'", "C'"), V(P, 'C', "C'")), V(P, 'A', "C'")), 'P1.2.2 VD1a =AC\'')
  ok(near(len(add(sub(V(P, 'B', "C'"), V(P, 'B', 'C')), V(P, "A'", 'A'))), 0), 'P1.2.2 VD1b = 0')
  const M = mul(0.5, add(B, C)), Mp = mul(0.5, add(P["B'"], P["C'"]))
  ok(eq(sub(Mp, M), V(P, 'A', "A'")), 'P1.2.2 VD1c MM\'=AA\' với M\' trung điểm B\'C\'')
  // lăng trụ đáy hình thang AB=2DC
  const D = [0, 0, 0], Cc = [2, 0, 0.3], Aa = [-1, 3, 0.1], Bb = add(Aa, mul(2, sub(Cc, D)))
  const T = { D, C: Cc, A: Aa, B: Bb }; const tt = [0.4, 0.7, 2.5]
  for (const k of 'ABCD') T[k + "'"] = add(T[k], tt)
  ok(eq(V(T, "A'", "B'"), mul(2, V(T, 'D', 'C'))), 'P1.2.2 VD2a A\'B\'=2DC')
  ok(eq(sub(V(T, "A'", "B'"), V(T, "D'", "C'")), V(T, 'D', 'C')), 'P1.2.2 VD2b A\'B\'-D\'C\'=DC')
  ok(eq(sub(sub(V(T, 'A', "C'"), V(T, 'D', "D'")), V(T, 'B', 'C')), V(T, 'A', 'B')), 'P1.2.2 VD2c AC\'-DD\'-BC=AB')
}
// ---------- P1.2.3 ----------
{ // chóp đáy hbh
  const A = [0, 0, 0], B = [4, 1, 0.5], D = [-1, 3, 0.2], S = [1, 1, 5]
  const C = add(B, sub(D, A)); const P = { A, B, C, D, S }
  ok(eq(add(V(P, 'S', 'A'), V(P, 'A', 'B'), V(P, 'C', 'D')), V(P, 'S', 'A')), 'P1.2.3 VD1a =SA')
  ok(eq(add(sub(V(P, 'S', 'C'), V(P, 'S', 'A')), V(P, 'D', 'B')), mul(2, V(P, 'A', 'B'))), 'P1.2.3 VD1b =2AB')
  const Q = { S: [0, 0, 0], A: [2, 1, 3], B: [-1, 4, 2], C: [3, -2, 5] }
  const a = V(Q, 'S', 'A'), b = V(Q, 'S', 'B'), c = V(Q, 'S', 'C')
  ok(eq(V(Q, 'B', 'C'), sub(c, b)), 'P1.2.3 VD2a BC=c-b')
  ok(eq(add(V(Q, 'A', 'B'), V(Q, 'A', 'C')), add(b, c, mul(-2, a))), 'P1.2.3 VD2b AB+AC=b+c-2a')
  ok(eq(sub(V(Q, 'A', 'B'), V(Q, 'C', 'B')), sub(c, a)), 'P1.2.3 VD2c AB-CB=c-a')
}
// ---------- P1.2.4 ----------
{
  const R = { A: [1, 2, 3], B: [-2, 0, 5], C: [4, 1, -1], D: [0, -3, 2] }
  ok(eq(add(V(R, 'A', 'C'), V(R, 'B', 'D')), add(V(R, 'A', 'D'), V(R, 'B', 'C'))), 'P1.2.4 VD1a AC+BD=AD+BC')
  ok(eq(sub(V(H, 'B', "B'"), V(H, 'C', 'A')), V(H, 'A', "C'")), 'P1.2.4 VD1b BB\'-CA=AC\'')
  // hai hbh bất kì
  const A = [0, 0, 0], B = [3, 1, 0], D = [1, 2, 1], A2 = [2, -1, 4], B2 = [5, 3, 2], D2 = [-1, 1, 6]
  const C = add(B, sub(D, A)), C2 = add(B2, sub(D2, A2))
  const P = { A, B, C, D, a: A2, b: B2, c: C2, d: D2 }
  ok(eq(add(V(P, 'A', 'a'), V(P, 'C', 'c')), add(V(P, 'B', 'b'), V(P, 'D', 'd'))), 'P1.2.4 VD2a AA\'+CC\'=BB\'+DD\'')
  const O = mul(0.5, add(A, C)), O2 = mul(0.5, add(A2, C2))
  ok(eq(add(V(P, 'A', 'a'), V(P, 'C', 'c')), mul(2, sub(O2, O))), 'P1.2.4 VD2b AA\'+CC\'=2OO\'')
}
// ---------- P1.2.5 ----------
{
  const A = [0, 0, 0], B = [4, 1, 0.5], D = [-1, 3, 0.2], S = [1, 1, 5]; const C = add(B, sub(D, A))
  const O = mul(0.5, add(A, C)); const P = { A, B, C, D, S, O }
  ok(eq(add(V(P, 'S', 'A'), V(P, 'S', 'B'), V(P, 'S', 'C'), V(P, 'S', 'D')), mul(4, V(P, 'S', 'O'))), 'P1.2.5 VD1a 4SO')
  const R = { A: [1, 2, 3], B: [-2, 0, 5], C: [4, 1, -1], D: [0, -3, 2] }
  const G = mul(1 / 3, add(R.B, R.C, R.D))
  ok(eq(add(V(R, 'A', 'B'), V(R, 'A', 'C'), V(R, 'A', 'D')), mul(3, sub(G, R.A))), 'P1.2.5 VD1b k=3')
  const M = mul(0.5, add(R.A, R.B)), N = mul(0.5, add(R.C, R.D)), Gg = mul(0.5, add(M, N))
  ok(eq(sub(N, M), mul(0.5, add(V(R, 'A', 'D'), V(R, 'B', 'C')))), 'P1.2.5 VD2a MN=1/2(AD+BC)')
  const gs = (X) => sub(X, Gg)
  ok(len(add(gs(R.A), gs(R.B), gs(R.C), gs(R.D)).map((x) => x)) < 1e-9 || true, '')
  ok(len(add(sub(R.A, Gg), sub(R.B, Gg), sub(R.C, Gg), sub(R.D, Gg))) < 1e-9, 'P1.2.5 VD2b GA+GB+GC+GD=0')
  const Pp = [3.3, -1.2, 0.7]
  ok(eq(add(sub(R.A, Pp), sub(R.B, Pp), sub(R.C, Pp), sub(R.D, Pp)), mul(4, sub(Gg, Pp))), 'P1.2.5 VD2c 4PG')
}
// ---------- P1.2.6 ----------
{
  const [AB, AD, AA] = [V(H, 'A', 'B'), V(H, 'A', 'D'), V(H, 'A', "A'")]
  const lin = (m, n, p) => add(mul(m, AB), mul(n, AD), mul(p, AA))
  ok(eq(V(H, 'B', "D'"), lin(-1, 1, 1)), 'P1.2.6 VD1a BD\'=-a+b+c')
  const Mc = mul(0.5, add(H.C, H["C'"]))
  ok(eq(sub(Mc, H.A), lin(1, 1, 0.5)), 'P1.2.6 VD1b AM=a+b+c/2 (M trung điểm CC\')')
  const N = mul(0.5, add(H["B'"], H["D'"]))
  ok(eq(sub(N, H.A), lin(0.5, 0.5, 1)), 'P1.2.6 VD1c AN=a/2+b/2+c (N trung điểm B\'D\')')
  // tứ diện
  const R = { A: [1, 2, 3], B: [-2, 0, 5], C: [4, 1, -1], D: [0, -3, 2] }
  const a = V(R, 'A', 'B'), b = V(R, 'A', 'C'), c = V(R, 'A', 'D')
  const L = (m, n, p) => add(mul(m, a), mul(n, b), mul(p, c))
  const M2 = add(R.C, mul(1 / 3, sub(R.D, R.C)))  // CM = 1/3 CD
  const N2 = mul(0.5, add(R.B, M2))
  const G2 = mul(1 / 3, add(R.B, R.C, R.D))
  ok(eq(sub(M2, R.A), L(0, 2 / 3, 1 / 3)), 'P1.2.6 VD2a AM=2/3 b+1/3 c')
  ok(eq(sub(N2, R.A), L(1 / 2, 1 / 3, 1 / 6)), 'P1.2.6 VD2b AN=1/2 a+1/3 b+1/6 c')
  ok(eq(sub(G2, N2), L(-1 / 6, 0, 1 / 6)), 'P1.2.6 VD2c NG=-1/6 a+1/6 c')
  ok(eq(sub(G2, N2), mul(1 / 6, V(R, 'B', 'D'))), 'P1.2.6 VD2c: NG = 1/6 BD')
}
console.log(sai ? `\n${sai} SAI` : '\nTất cả khớp')
process.exit(sai ? 1 : 0)
