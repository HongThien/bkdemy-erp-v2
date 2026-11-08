// Trạm soát J4 — kiểm số độc lập từng ví dụ (không dùng thu.mjs của trạm soạn)
const ok = (c, s) => console.log((c ? 'OK  ' : 'SAI ') + s)
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e
const scan = (f, a, b, N = 200000) => { let mx = -Infinity, mn = Infinity, xM, xm; for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N, y = f(x); if (y > mx) { mx = y; xM = x } if (y < mn) { mn = y; xm = x } } return { mx, mn, xM, xm } }
const roots = (f, a, b, N = 100000) => { const r = []; let p = f(a); for (let i = 1; i <= N; i++) { const x = a + (b - a) * i / N, y = f(x); if (p === 0 || p * y < 0) r.push(+x.toFixed(4)); p = y } return r }
const d = (f) => (x) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6
let s

// H3.1.1
s = scan(x => x ** 3 - 3 * x + 1, -2, 1); ok(near(s.mx, 3) && near(s.mn, -1) && s.mx + s.mn === 2, `H3.1.1 VD1 M=${s.mx} m=${s.mn}`)
s = scan(x => -(x ** 4) + 2 * x * x + 1, -1, 2); ok(near(s.mx, 2) && near(s.mn, -7), `H3.1.1 VD2 M=${s.mx} m=${s.mn} M-m=${s.mx - s.mn}`)
console.log('   VD2 f(0)=', 1, ' rìa hình y=-7: f(2)=', -16 + 8 + 1, ' f(-2.5)=', -(2.5 ** 4) + 2 * 6.25 + 1)

// H3.1.3 VD1: f' = -3x^2+6x ; f = -x^3+3x^2
{ const fp = x => -3 * x * x + 6 * x, f = x => -(x ** 3) + 3 * x * x
  ok(near(d(f)(1.3), fp(1.3), 1e-4), 'H3.1.3 VD1 f khớp f′'); ok(f(0) === f(3), `H3.1.3 VD1 f(0)=f(3)=${f(0)}`)
  console.log('   nghiệm f′ trên [-1,3.5]:', roots(fp, -0.999, 3.5), ' dấu f′(1)=', fp(1), ' f′(2.5)=', fp(2.5))
  s = scan(f, 0, 3); console.log('   max tại', s.xM.toFixed(3), ' min =', s.mn, 'tại', s.xm) }
// H3.1.3 VD2: f' = x^2-4x+3 ; f = x^3/3-2x^2+3x
{ const fp = x => x * x - 4 * x + 3, f = x => x ** 3 / 3 - 2 * x * x + 3 * x
  ok(near(d(f)(2.2), fp(2.2), 1e-4), 'H3.1.3 VD2 f khớp f′')
  ok(near(f(1), f(4)) && near(f(0) + f(1), f(3) + f(4)) && near(f(1) - f(3), 4 / 3), `H3.1.3 VD2 giả thiết: f0=${f(0)} f1=${f(1)} f3=${f(3)} f4=${f(4)}`)
  s = scan(f, 0, 4); ok(near(s.mx - s.mn, 4 / 3, 1e-6), `H3.1.3 VD2 M-m=${s.mx - s.mn}`)
  // Họ hàm bất kì f = F + C: các giả thiết không phụ thuộc C ⇒ đủ dữ kiện, không mâu thuẫn.
}

// H3.2.1
s = scan(x => x ** 3 - 3 * x * x - 9 * x + 5, -2, 4); ok(near(s.mx, 10) && near(s.mn, -22), `H3.2.1 VD1 ${s.mx} ${s.mn}`)
s = scan(x => x ** 4 - 4 * x * x + 3, -1, 3); ok(near(s.mx, 48) && near(s.mn, -1, 1e-6), `H3.2.1 VD2 ${s.mx} ${s.mn} tại ${s.xm}`)
// H3.2.2
s = scan(x => (2 * x + 1) / (x - 1), 2, 4); ok(near(s.mx, 5) && near(s.mn, 3), `H3.2.2 VD1 ${s.mx} ${s.mn}`)
s = scan(x => (x * x - 3 * x + 6) / (x - 1), 2, 6); ok(near(s.mx, 24 / 5) && near(s.mn, 3), `H3.2.2 VD2 ${s.mx} ${s.mn} tại ${s.xm}; y(2)=4`)
{ const f = x => (x * x - 3 * x + 6) / (x - 1); ok(near(d(f)(4), (16 - 8 - 3) / 9, 1e-5), 'H3.2.2 VD2 công thức y′') }
// H3.2.3
s = scan(x => x + Math.sqrt(4 - x * x), -2, 2); ok(near(s.mx, 2 * Math.SQRT2) && near(s.mn, -2), `H3.2.3 VD1 ${s.mx} ${s.mn} tại xM=${s.xM}`)
s = scan(x => Math.sqrt(x + 3) + Math.sqrt(6 - x), -3, 6); ok(near(s.mx, 3 * Math.SQRT2) && near(s.mn, 3), `H3.2.3 VD2 ${s.mx} ${s.mn} xM=${s.xM}`)
// H3.2.4
s = scan(x => x - 2 * Math.sin(x), 0, Math.PI); ok(near(s.mx, Math.PI) && near(s.mn, Math.PI / 3 - Math.sqrt(3)), `H3.2.4 VD1 ${s.mx} ${s.mn} (${(Math.PI / 3 - Math.sqrt(3)).toFixed(4)})`)
s = scan(x => x * x - 2 * Math.log(x), 1 / Math.E, Math.E); ok(near(s.mx, Math.E ** 2 - 2) && near(s.mn, 1), `H3.2.4 VD2 ${s.mx} ${s.mn}; y(1/e)=${(Math.E ** -2 + 2).toFixed(4)}`)
// H3.2.5 VD1
s = scan(x => x + 4 / x, 1e-4, 1e4, 2000000); ok(near(s.mn, 4, 1e-6) && s.mx > 1e3, `H3.2.5 VD1a min=${s.mn} tại ${s.xm}; giá trị gần 0+: ${1e-4 + 4e4}`)
{ const f = x => x / (x * x + 1); s = scan(f, -1e4, 1e4, 4000000); ok(near(s.mx, 0.5, 1e-9) && near(s.mn, -0.5, 1e-9), `H3.2.5 VD1b max=${s.mx} tại ${s.xM.toFixed(3)} min=${s.mn} tại ${s.xm.toFixed(3)}; f(1e6)=${f(1e6)}`)
  ok(near(d(f)(0.5), (1 - 0.25) / (1.25 ** 2), 1e-6), 'H3.2.5 VD1b công thức y′'); console.log('   nghiệm y′:', roots(d(f), -5, 5)) }

// H3.3.1 VD1: quét m
{ const sol = []; for (let i = -1000; i <= 1000; i++) { const m = i / 50; s = scan(x => (x + m) / (x - 1), 2, 4, 2000); if (near(s.mn, 3, 1e-9)) sol.push(m) } ok(sol.join() === '5', `H3.3.1 VD1 m = ${sol}`) }
{ const sol = []; for (let i = -1000; i <= 1000; i++) { const m = i / 50; s = scan(x => x ** 3 - 3 * x + m, 0, 2, 4000); if (near(s.mx, 3 * s.mn, 1e-9)) sol.push(m) } ok(sol.join() === '4', `H3.3.1 VD2 m = ${sol}`) }
// H3.3.2
{ const sol = []; for (let i = -1000; i <= 1000; i++) { const m = i / 50; s = scan(x => Math.abs(x ** 3 - 3 * x + m), 0, 2, 4000); if (near(s.mx, 3, 1e-9)) sol.push(m) } ok(sol.join() === '-1,1', `H3.3.2 VD1 m = ${sol}`) }
{ let best = Infinity, bm; for (let i = -2000; i <= 2000; i++) { const m = i / 100; s = scan(x => Math.abs(x * x - 4 * x + m), -1, 3, 4000); if (s.mx < best - 1e-12) { best = s.mx; bm = m } } ok(near(best, 4.5, 1e-9) && near(bm, -0.5), `H3.3.2 VD2 min max = ${best} tại m=${bm}`) }
// Kiểm công thức lý thuyết H3.3.2 cho min|f+m| (3 trường hợp) trên f=x^3-3x [0;2] (K=2,k=-2) và f=x^2-4x [-1;3] (K=5,k=-4)
for (const [f, a, b, K, k] of [[x => x ** 3 - 3 * x, 0, 2, 2, -2], [x => x * x - 4 * x, -1, 3, 5, -4]]) {
  let bad = 0
  for (let i = -800; i <= 800; i++) { const m = i / 40; s = scan(x => Math.abs(f(x) + m), a, b, 4000)
    const mxF = m >= -(K + k) / 2 ? m + K : -(m + k), mnF = m >= -k ? m + k : m <= -K ? -(m + K) : 0
    if (!near(s.mx, mxF, 1e-6) || !near(s.mn, mnF, 1e-5)) bad++ }
  ok(bad === 0, `H3.3.2 lý thuyết max/min|f+m| theo trường hợp (K=${K},k=${k}) sai ${bad}`) }
// H3.3.3
s = scan(x => x ** 3 - 3 * x * x - 9 * x, -2, 4); ok(near(s.mx, 5), `H3.3.3 VD1 max f=${s.mx}`)
s = scan(x => Math.sqrt(x - 1) + Math.sqrt(5 - x), 1, 5); ok(near(s.mx, 2 * Math.SQRT2) && near(s.mn, 2), `H3.3.3 VD2 [${s.mn};${s.mx}]`)

// H3.4.1 VD1: f trừu tượng theo BBT (+,-,+; cực trị -1 → 4, 3 → -2). Dựng f mẫu: f' = k(t+1)(t-3), f(-1)=4, f(3)=-2
{ // f(t) = a(t^3/3 - t^2 - 3t) + c ; f(-1)-f(3) = a(5/3 - (-9)) = a*32/3 = 6 ⇒ a = 18/32
  const a = 18 / 32, F = t => t ** 3 / 3 - t * t - 3 * t, c = 4 - a * F(-1), f = t => a * F(t) + c
  ok(near(f(-1), 4) && near(f(3), -2), 'H3.4.1 VD1 hàm mẫu khớp BBT')
  s = scan(x => f(2 * Math.sin(x) + 1), 0, 2 * Math.PI); ok(near(s.mx, 4, 1e-6) && near(s.mn, -2, 1e-6), `H3.4.1 VD1 max g=${s.mx} tại x=${s.xM.toFixed(4)} (3π/2=${(1.5 * Math.PI).toFixed(4)}) min=${s.mn} tại ${s.xm.toFixed(4)}`) }
// H3.4.1 VD2: f' = t^2-2t-3, f(-1)=2
{ const F = t => t ** 3 / 3 - t * t - 3 * t, c = 2 - F(-1), f = t => F(t) + c
  s = scan(x => f(2 * x - x * x), -10, 10, 2000000); ok(near(s.mx, 2, 1e-8), `H3.4.1 VD2 max g=${s.mx} tại x=${s.xM.toFixed(4)} (1±√2 = ${(1 + Math.SQRT2).toFixed(4)}, ${(1 - Math.SQRT2).toFixed(4)})`)
  console.log('   g(1+√2)=', f(2 * (1 + Math.SQRT2) - (1 + Math.SQRT2) ** 2), ' g(1-√2)=', f(2 * (1 - Math.SQRT2) - (1 - Math.SQRT2) ** 2)) }
// H3.4.2
s = scan(x => x * x * (4 - x), 0, 4); ok(near(s.mx, 256 / 27) && near(s.mn, 0), `H3.4.2 VD1 ${s.mx} tại ${s.xM} min ${s.mn}`)
s = scan(th => { const x = Math.SQRT2 * Math.cos(th), y = Math.SQRT2 * Math.sin(th); return x + y + x * y }, 0, 2 * Math.PI, 2000000); ok(near(s.mx, 3) && near(s.mn, -1.5), `H3.4.2 VD2 ${s.mx} ${s.mn}`)
{ const x = (-1 + Math.sqrt(3)) / 2, y = (-1 - Math.sqrt(3)) / 2; ok(near(x * x + y * y, 2) && near(x + y + x * y, -1.5), 'H3.4.2 VD2 điểm đạt min: x,y=(-1±√3)/2') }
