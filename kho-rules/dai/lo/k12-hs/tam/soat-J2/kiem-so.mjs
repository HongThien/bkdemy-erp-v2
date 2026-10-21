// Trạm soát J2 — kiểm số độc lập: tìm cực trị bằng quét lưới (đổi dấu sai phân), đối chiếu đáp số.
const cbrt = Math.cbrt
const d = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)
function cuctri(f, a, b, N = 200000, bo = []) {
  // quét giá trị: x là cực đại/tiểu nếu f(x) lớn/nhỏ hơn hai lân cận lưới
  const out = []
  const st = (b - a) / N
  for (let i = 1; i < N; i++) {
    const x = a + i * st
    if (bo.some((p) => Math.abs(x - p) < 2 * st)) continue
    const y0 = f(x - st), y1 = f(x), y2 = f(x + st)
    if (!isFinite(y0) || !isFinite(y1) || !isFinite(y2)) continue
    if (y1 > y0 && y1 >= y2) out.push(['CĐ', +x.toFixed(4), +y1.toFixed(4)])
    if (y1 < y0 && y1 <= y2) out.push(['CT', +x.toFixed(4), +y1.toFixed(4)])
  }
  return out
}
function daus(g, a, b, N = 400000) {
  // điểm g đổi dấu
  const out = []
  const st = (b - a) / N
  let prev = Math.sign(g(a))
  for (let i = 1; i <= N; i++) {
    const x = a + i * st, s = Math.sign(g(x))
    if (s !== 0 && prev !== 0 && s !== prev) out.push([+x.toFixed(4), prev > 0 ? '+→-' : '-→+'])
    if (s !== 0) prev = s
  }
  return out
}
const T = (ten, v) => console.log(ten.padEnd(34), JSON.stringify(v))

// H2.1.1
T('2.1.1 VD1 x^3-3x^2-9x+5', cuctri((x) => x ** 3 - 3 * x * x - 9 * x + 5, -10, 10))
T('2.1.1 VD2a x^3+3x^2+3x-5', cuctri((x) => x ** 3 + 3 * x * x + 3 * x - 5, -10, 10))
const f2b = (x) => 2 * x ** 3 - 3 * x * x - 12 * x + 1
T('2.1.1 VD2b', cuctri(f2b, -10, 10), ); T('  tich', f2b(-1) * f2b(2))
// H2.1.2
T('2.1.2 VD1 x^4-2x^2+3', cuctri((x) => x ** 4 - 2 * x * x + 3, -5, 5))
T('2.1.2 VD2a x^4+4x^2-1', cuctri((x) => x ** 4 + 4 * x * x - 1, -5, 5))
T('2.1.2 VD2b x^4-4x^3+1', cuctri((x) => x ** 4 - 4 * x ** 3 + 1, -5, 5))
// H2.1.3
T('2.1.3 VD1 x+4/x', cuctri((x) => x + 4 / x, -10, 10, 200001, [0]))
T('2.1.3 VD2a (2x-1)/(x+3)', cuctri((x) => (2 * x - 1) / (x + 3), -10, 10, 200001, [-3]))
const f13b = (x) => (x * x - 3 * x + 6) / (x - 1)
T('2.1.3 VD2b', cuctri(f13b, -10, 10, 200001, [1]))
T('  y\' tại 0 so công thức', [d(f13b, 0), ((0 - 3) * (0 + 1)) / 1])
// H2.1.4
T('2.1.4 VD1 x-lnx', cuctri((x) => x - Math.log(x), 0.001, 10))
const f14b = (x) => cbrt(x * x) * (x - 5)
T('2.1.4 VD2 cbrt(x^2)(x-5)', cuctri(f14b, -5, 10))
T('  -3cbrt4', -3 * cbrt(4))
T('  y\'(3) so 5(x-2)/(3cbrt x)', [d(f14b, 3), (5 * 1) / (3 * cbrt(3))])
T('  y\'(-1)', [d(f14b, -1), (5 * -3) / (3 * cbrt(-1))])
// H2.2.2 hình
T('2.2.2 VD1 x^4/4-2x^2', cuctri((x) => x ** 4 / 4 - 2 * x * x, -4, 4))
T('2.2.2 VD2 x^3-6x^2+9x', cuctri((x) => x ** 3 - 6 * x * x + 9 * x, -1, 5))
// H2.3.1 VD2: f' vẽ
const fp31 = (x) => ((x + 1) * (x - 1) ** 2 * (x - 3)) / 4
T('2.3.1 VD2 đổi dấu f\'', daus(fp31, -2, 4))
T('  min f\' trên (1;3)', cuctri(fp31, -2, 4))
// H2.3.2
T('2.3.2 VD1 đổi dấu', daus((x) => x * (x - 1) ** 2 * (x + 2), -10, 10))
T('2.3.2 VD2 đổi dấu', daus((x) => (x * x - 1) * (x - 2) ** 2 * (x + 3) ** 3, -10, 10))
// H2.3.3
const fp1 = (x) => x ** 3 - 3 * x
T('2.3.3 VD1 g\'=f\'+2 đổi dấu', daus((x) => fp1(x) + 2, -10, 10))
T('  f\' đáy/đỉnh', cuctri(fp1, -3, 3))
const fp2 = (x) => x ** 4 - 2 * x * x
T('2.3.3 VD2 f\' cực trị', cuctri(fp2, -2, 2))
T('  a) f\'+1 đổi dấu', daus((x) => fp2(x) + 1, -10, 10))
T('  b) f\'-1 đổi dấu', daus((x) => fp2(x) - 1, -10, 10))
T('  sqrt(1+sqrt2)', Math.sqrt(1 + Math.SQRT2))
