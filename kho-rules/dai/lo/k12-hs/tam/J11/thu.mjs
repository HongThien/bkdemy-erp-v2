// kiểm số các ví dụ MỚI của J11
const ok = (c, m) => console.log(c ? 'OK  ' : 'LOI ', m)
const d = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)

// H5.3.4 vd2: y=2x^3-3x^2-12x+1, cực trị tại -1, 2; (0;1); CĐ - CT = 27
{
  const f = (x) => 2 * x ** 3 - 3 * x ** 2 - 12 * x + 1
  ok(Math.abs(d(f, -1)) < 1e-4 && Math.abs(d(f, 2)) < 1e-4, 'H5.3.4 y\'(-1)=y\'(2)=0')
  ok(f(0) === 1, 'H5.3.4 y(0)=1')
  ok(f(-1) - f(2) === 27, 'H5.3.4 yCD-yCT=27: ' + f(-1) + ',' + f(2))
  // tổng quát theo a: y'=3a(x+1)(x-2) -> b=-3a/2, c=-6a, d=1
  const g = (a) => (x) => a * x ** 3 - 1.5 * a * x * x - 6 * a * x + 1
  ok(Math.abs(g(1)(-1) - g(1)(2) - 13.5) < 1e-9, 'H5.3.4 hiệu = 13,5a')
}
// H5.4.3 vd2: y=x^3-3m x^2+2
{
  for (const m of [-2, -0.5, 1, 1.7]) {
    const f = (x) => x ** 3 - 3 * m * x * x + 2
    const y0 = f(m)
    ok(Math.abs(y0 - (2 - 2 * m ** 3)) < 1e-9, 'H5.4.3 y0 m=' + m)
    for (const x of [-3, 0.4, 2.2]) ok(Math.abs(f(2 * m - x) + f(x) - 2 * y0) < 1e-9, '  đối xứng x=' + x)
  }
  const f1 = (x) => x ** 3 - 3 * x * x + 2
  ok(f1(1) === 0 && f1(2) === -2, 'H5.4.3 m=1: I(1;0), B(2;-2)')
}
// H5.4.2 vd2 c) m nguyên: BBT -∞ ↗ 4 ↘ 0 ↗ +∞ -> 3 nghiệm khi 0<m<4
// H2.5.1 vd2: y=x^3-3x^2+mx+2, AB: y=(2(m-3)/3)x+(m+6)/3
{
  for (const m of [-6, -2, 0, 1.5, 2.9]) {
    const f = (x) => x ** 3 - 3 * x * x + m * x + 2
    const D = 9 - 3 * m // delta'
    const xs = [(6 - Math.sqrt(36 - 12 * m)) / 6, (6 + Math.sqrt(36 - 12 * m)) / 6]
    ok(D > 0, 'H2.5.1 m=' + m + ' có 2 CT')
    for (const x of xs) ok(Math.abs(f(x) - ((2 * (m - 3)) / 3 * x + (m + 6) / 3)) < 1e-9, '  điểm CT thuộc AB x=' + x.toFixed(3))
  }
  // vd1
  const f = (x) => x ** 3 - 3 * x * x - 9 * x + 1
  ok(f(-1) === -8 * -1 - 2 && f(3) === -8 * 3 - 2, 'H2.5.1 vd1')
}
// M2.1.1 vd2: y=x^3-3m x^2+3x+1 đồng biến (1;+∞) <=> m<=1
{
  const dongBien = (m) => {
    for (let x = 1.0001; x < 60; x += 0.01) if (3 * x * x - 6 * m * x + 3 < -1e-12) return false
    return true
  }
  let sai = 0
  for (let m = -5; m <= 5; m += 0.05) { const kq = dongBien(m); const lt = m <= 1 + 1e-9; if (kq !== lt) { sai++; console.log('lệch m=', m, kq, lt) } }
  ok(sai === 0, 'M2.1.1 vd2 đồng biến (1;+inf) <=> m<=1')
  ok(dongBien(1), 'm=1 đồng biến')
}
// M2.1.1 vd1 (H1.5.1 vd2): y=(m^2-1)x^3+(m-1)x^2-x+4 nghịch biến R <=> -1/2<=m<=1
{
  const nghichBien = (m) => {
    for (let x = -50; x <= 50; x += 0.01) if (3 * (m * m - 1) * x * x + 2 * (m - 1) * x - 1 > 1e-9) return false
    return true
  }
  let sai = 0
  for (let m = -3; m <= 3; m += 0.01) { const mm = Math.round(m * 100) / 100; if (nghichBien(mm) !== (mm >= -0.5 - 1e-9 && mm <= 1 + 1e-9)) { sai++; console.log('lệch', mm) } }
  ok(sai === 0, 'M2.1.1 vd1')
}
// H2.4.2 vd2: cực đại tại x=1 <=> m=2
{
  const cd = (m) => { const f1 = (x) => x * x - 2 * m * x + m * m - m + 1; return Math.abs(f1(1)) < 1e-12 && f1(0.9) > 0 && f1(1.1) < 0 }
  ok(cd(2) && !cd(1), 'M2.1.1 đạt cực đại x=1: m=2')
}
// H2.4.3 vd2: x1+2x2=0, y'=x^2-2mx+2m-3
for (const m of [0.5, -0.75]) {
  const D = m * m - 2 * m + 3, r = Math.sqrt(D), xa = m - r, xb = m + r
  ok(Math.abs(xa + 2 * xb) < 1e-9 || Math.abs(xb + 2 * xa) < 1e-9, 'H2.4.3 m=' + m + ' nghiệm ' + xa + ',' + xb)
}
// H2.4.4 vd1: y=x^3-3x^2+m hai phía Ox <=> 0<m<4 ; đối xứng qua I(1;0) <=> m=2
{
  for (const m of [-1, 0.5, 2, 3.9, 5]) ok(((m * (m - 4)) < 0) === (m > 0 && m < 4), 'H2.4.4 m=' + m)
}
// H2.4.1 vd2: y'=3(m-2)x^2+6x+m; D'=9-3m(m-2)
{
  const D = (m) => 9 - 3 * m * (m - 2)
  ok(D(-1) === 0 && D(3) === 0 && D(0) > 0 && D(4) < 0, 'H2.4.1 Δ\'')
}
