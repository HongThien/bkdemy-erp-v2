// Trạm soát J3 — kiểm số độc lập (không dùng tam/J3/thu.mjs).
const d = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)
const T = (ten, v) => console.log(ten.padEnd(30), typeof v === 'string' ? v : JSON.stringify(v))
// cực trị bằng quét giá trị
function cuctri(f, a = -20, b = 20, N = 400000) {
  const out = [], st = (b - a) / N
  for (let i = 1; i < N; i++) {
    const x = a + i * st, y0 = f(x - st), y1 = f(x), y2 = f(x + st)
    if (![y0, y1, y2].every(isFinite)) continue
    if (y1 > y0 && y1 >= y2) out.push(['CĐ', +x.toFixed(3), +y1.toFixed(3)])
    if (y1 < y0 && y1 <= y2) out.push(['CT', +x.toFixed(3), +y1.toFixed(3)])
  }
  return out
}
// đổi dấu của g (g giải tích)
function doiDau(g, a = -20, b = 20, N = 400000) {
  const out = [], st = (b - a) / N
  let p = Math.sign(g(a))
  for (let i = 1; i <= N; i++) {
    const x = a + i * st, s = Math.sign(g(x))
    if (s && p && s !== p) out.push(+x.toFixed(3))
    if (s) p = s
  }
  return out
}
const so2 = (f, a = -20, b = 20) => cuctri(f, a, b).length
const R = (lo, hi, st, ok) => { const r = []; for (let m = lo; m <= hi + 1e-9; m += st) if (ok(+m.toFixed(4))) r.push(+m.toFixed(4)); return r }
const khoang = (arr, st) => { // gom các m thoả thành khoảng
  const r = []; let s = null, p = null
  for (const m of arr) { if (s === null) s = m; else if (Math.abs(m - p - st) > 1e-6) { r.push([s, p]); s = m } p = m }
  if (s !== null) r.push([s, p]); return r
}

// H2.4.1
T('2.4.1 VD1 m có 2 CT', khoang(R(-10, 10, 0.01, (m) => so2((x) => x ** 3 - 3 * x ** 2 + m * x - 1) === 2), 0.01))
T('2.4.1 VD2a có CĐ,CT', khoang(R(-10, 10, 0.01, (m) => so2((x) => (m - 2) * x ** 3 + 3 * x ** 2 + m * x - 5) === 2), 0.01))
T('2.4.1 VD2b 0 cực trị', khoang(R(-10, 10, 0.01, (m) => so2((x) => (m - 2) * x ** 3 + 3 * x ** 2 + m * x - 5) === 0), 0.01))
T('2.4.1 m=2', cuctri((x) => 3 * x ** 2 + 2 * x - 5))
// H2.4.2
T('2.4.2 VD1 a=-2,b=-7', cuctri((x) => x ** 3 - 2 * x ** 2 - 7 * x + 1))
for (const m of [1, 2]) T('2.4.2 VD2 m=' + m, cuctri((x) => x ** 3 / 3 - m * x ** 2 + (m * m - m + 1) * x + 1))
T('2.4.2 VD2 quét m CĐ tại 1', R(-10, 10, 0.01, (m) => cuctri((x) => x ** 3 / 3 - m * x ** 2 + (m * m - m + 1) * x + 1, -20, 20, 200000).some((c) => c[0] === 'CĐ' && Math.abs(c[1] - 1) < 2e-3)))
// H2.4.3
const ng = (A, B, C) => { const D = B * B - 4 * A * C; if (D <= 0) return null; return [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)] }
T('2.4.3 VD1', R(-10, 10, 0.001, (m) => { const r = ng(3, -6, m); return r && Math.abs(r[0] ** 2 + r[1] ** 2 - 6) < 2e-3 }))
T('2.4.3 VD2', R(-10, 10, 0.0025, (m) => { const r = ng(1, -2 * m, 2 * m - 3); return r && (Math.abs(r[0] + 2 * r[1]) < 3e-3 || Math.abs(r[1] + 2 * r[0]) < 3e-3) }))
// H2.4.4
T('2.4.4 VD1 hai phía Ox', khoang(R(-10, 10, 0.01, (m) => { const c = cuctri((x) => x ** 3 - 3 * x ** 2 + m, -5, 5, 20000); return c.length === 2 && c[0][2] * c[1][2] < 0 }), 0.01))
T('2.4.4 VD1b đối xứng qua I(1;0)', R(-10, 10, 0.01, (m) => { const c = cuctri((x) => x ** 3 - 3 * x ** 2 + m, -5, 5, 20000); return Math.abs(c[0][1] + c[1][1] - 2) < 1e-2 && Math.abs(c[0][2] + c[1][2]) < 1e-2 }))
T('2.4.4 VD2 cách đều y=x-1', R(-10, 10, 0.01, (m) => { const f = (x) => x ** 3 - 3 * m * x ** 2 + 3 * (m * m - 1) * x - m ** 3 + 3 * m; const c = cuctri(f, -20, 20, 40000); const dd = (p) => Math.abs(p[1] - p[2] - 1); return c.length === 2 && Math.abs(dd(c[0]) - dd(c[1])) < 2e-2 }))
T('2.4.4 VD2 m=0 cực trị', cuctri((x) => x ** 3 - 3 * x))
// H2.4.5
const tp = (a, b, c) => { const c3 = cuctri((x) => a * x ** 4 + b * x ** 2 + c, -10, 10, 200000); return c3 }
T('2.4.5 VD1 vuông cân', R(-5, 5, 0.01, (m) => { const c = tp(1, -2 * m, m - 1); if (c.length !== 3) return false; const [B, A, C] = c; const v = (B[1] - A[1]) * (C[1] - A[1]) + (B[2] - A[2]) * (C[2] - A[2]); return Math.abs(v) < 2e-2 }))
T('2.4.5 VD2 S=4√2', R(-5, 8, 0.01, (m) => { const c = tp(1, -2 * (m - 1), m - 2); if (c.length !== 3) return false; const [B, A, C] = c; const S = Math.abs((B[1] - A[1]) * (C[2] - A[2]) - (C[1] - A[1]) * (B[2] - A[2])) / 2; return Math.abs(S - 4 * Math.SQRT2) < 2e-2 }))
// H2.4.6
T('2.4.6 VD1', khoang(R(-10, 10, 0.01, (m) => so2((x) => (x * x + m * x + 1) / (x + 1)) === 2), 0.01))
T('2.4.6 VD2 m=2', (() => { const c = cuctri((x) => (x * x + 2 * x + 2) / (x - 1)); return [c, Math.hypot(c[0][1] - c[1][1], c[0][2] - c[1][2])] })())
T('2.4.6 VD2 quét AB=10', R(-3, 10, 0.01, (m) => { const c = cuctri((x) => (x * x + 2 * x + m) / (x - 1), -20, 20, 100000); return c.length === 2 && Math.abs(Math.hypot(c[0][1] - c[1][1], c[0][2] - c[1][2]) - 10) < 2e-2 }))
// H2.5.1
T('2.5.1 VD1', cuctri((x) => x ** 3 - 3 * x ** 2 - 9 * x + 1).map((c) => [c, -8 * c[1] - 2]))
T('2.5.1 VD2', cuctri((x) => (x * x - 2 * x + 4) / (x - 1)).map((c) => [c, 2 * c[1] - 2]))
// H2.5.2
T('2.5.2 VD1', cuctri((x) => x ** 3 - 3 * x ** 2 + 2))
T('2.5.2 VD2 S=2', R(0.01, 10, 0.01, (m) => { const c = cuctri((x) => x ** 3 - 3 * m * x + 1, -10, 10, 40000); return c.length === 2 && Math.abs(Math.abs(c[0][1] * c[1][2] - c[1][1] * c[0][2]) / 2 - 2) < 2e-2 }))
// H2.5.3
T('2.5.3 VD1 hệ số góc AB', [1, 2, 3].map((m) => { const c = cuctri((x) => x ** 3 - 3 * m * x + 1); return [m, (c[1][2] - c[0][2]) / (c[1][1] - c[0][1])] }))
T('2.5.3 VD2 đối xứng qua d', R(-10, 10, 0.01, (m) => { const c = cuctri((x) => x ** 3 - 3 * x ** 2 + m, -5, 5, 20000); const [A, B] = c; const I = [(A[1] + B[1]) / 2, (A[2] + B[2]) / 2]; const perp = (B[1] - A[1]) * 2 + (B[2] - A[2]) * 1; return Math.abs(I[0] - 2 * I[1] + 3) < 1e-2 && Math.abs(perp) < 1e-2 }))
// H2.6.1
const f1 = (x) => x ** 3 - 3 * x ** 2 + 1
T('2.6.1 VD1 |f|, f(|x|)', [so2((x) => Math.abs(f1(x)), -5, 5), so2((x) => f1(Math.abs(x)), -5, 5)])
const f2 = (x) => x ** 3 - 3 * x + 2 // CĐ(-1;4), CT(1;0)
T('2.6.1 VD2 f mẫu', cuctri(f2))
T('2.6.1 VD2 |f|, f(|x|)', [so2((x) => Math.abs(f2(x)), -5, 5), so2((x) => f2(Math.abs(x)), -5, 5)])
// H2.6.2
const fp1 = (t) => t * (t - 1) * (t - 2)
T('2.6.2 VD1 điểm cực trị g', doiDau((x) => (2 * x - 2) * fp1(x * x - 2 * x)))
const fp2 = (t) => (t + 4) * (t - 5)
T('2.6.2 VD2 điểm cực trị g', doiDau((x) => (2 * x - 4) * fp2(x * x - 4 * x)))
// H2.6.3
const fp3 = (t) => t * (t - 4)
const n3 = (m) => doiDau((x) => (2 * x - 2) * fp3(x * x - 2 * x + m), -10, 12, 220001).length
T('2.6.3 VD1 số CT theo m nguyên', Object.fromEntries(R(-3, 7, 1, () => true).map((m) => [m, n3(m)])))
T('2.6.3 VD1 m (bước .05) có 3 CT', khoang(R(-5, 8, 0.05, (m) => n3(m) === 3), 0.05))
const fp4 = (t) => t * (t - 2)
const n4 = (m) => doiDau((x) => 3 * (x * x - 1) * fp4(x ** 3 - 3 * x + m), -6, 6.0001, 240001).length
T('2.6.3 VD2 số CT m∈[-5;5]', Object.fromEntries(R(-5, 5, 1, () => true).map((m) => [m, n4(m)])))
T('2.6.3 VD2 m (bước .05) 6 CT', khoang(R(-6, 6, 0.05, (m) => n4(m) === 6), 0.05))
