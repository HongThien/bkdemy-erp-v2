// cực trị bằng quét đổi dấu sai phân
function cuctri(f, a, b, bo = []) {
  const N = 400000, h = 1e-6, r = []
  const d = (x) => (f(x + h) - f(x - h)) / (2 * h)
  let prev = null
  for (let i = 0; i <= N; i++) {
    const x = a + (b - a) * i / N
    if (bo.some((s) => Math.abs(x - s) < 1e-3)) { prev = null; continue }
    const v = d(x), s = Math.sign(v)
    if (prev !== null && s !== 0 && prev !== 0 && s !== prev) r.push([+x.toFixed(3), prev > 0 ? 'CD' : 'CT', +f(x).toFixed(4)])
    if (s !== 0) prev = s
  }
  return r
}
const show = (t, v) => console.log(t, JSON.stringify(v))
show('1.1 vd1 (-1 CD 10; 3 CT -22)', cuctri((x) => x**3-3*x**2-9*x+5, -10, 10))
show('1.1 vd2a none', cuctri((x) => x**3+3*x**2+3*x-5, -10, 10))
show('1.1 vd2b (-1 CD 8, 2 CT -19)', cuctri((x) => 2*x**3-3*x**2-12*x+1, -10, 10))
show('1.2 vd1 (-1 CT 2, 0 CD 3, 1 CT 2)', cuctri((x) => x**4-2*x**2+3, -10, 10))
show('1.2 vd2a (0 CT -1)', cuctri((x) => x**4+4*x**2-1, -10, 10))
show('1.2 vd2b (3 CT -26)', cuctri((x) => x**4-4*x**3+1, -10, 10))
show('1.3 vd1 (-2 CD -4, 2 CT 4)', cuctri((x) => x+4/x, -10, 10, [0]))
show('1.3 vd2a none', cuctri((x) => (2*x-1)/(x+3), -10, 10, [-3]))
show('1.3 vd2b (-1 CD -5, 3 CT 3)', cuctri((x) => (x*x-3*x+6)/(x-1), -10, 10, [1]))
show('1.4 vd1 (1 CT 1)', cuctri((x) => x-Math.log(x), 0.001, 20))
show('1.4 vd2 (0 CD 0, 2 CT -3*cbrt4=' + (-3*Math.cbrt(4)).toFixed(4) + ')', cuctri((x) => Math.cbrt(x*x)*(x-5), -10, 10))
// 2.2.2
show('2.2.2 vd1 (-2 CT -4, 0 CD 0, 2 CT -4)', cuctri((x) => x**4/4-2*x**2, -4, 4))
show('2.2.2 vd2 (1 CD 4, 3 CT 0)', cuctri((x) => x**3-6*x**2+9*x, -1, 5))
// 2.3.2: f' dạng nhân tử -> đổi dấu của f'
const doiDau = (g, a, b) => { const r = []; let p = 0; const N = 600000; for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N, s = Math.sign(g(x)); if (s !== 0 && p !== 0 && s !== p) r.push([+x.toFixed(3), p > 0 ? '+-' : '-+']); if (s !== 0) p = s } return r }
show('2.3.2 vd1 (-2 +-, 0 -+)', doiDau((x) => x*(x-1)**2*(x+2), -5, 5))
show('2.3.2 vd2 (-3 -+, -1 +-, 1 -+)', doiDau((x) => (x*x-1)*(x-2)**2*(x+3)**3, -5, 5))
show('2.3.1 vd2 (-1 +-, 3 -+)', doiDau((x) => (x+1)*(x-1)**2*(x-3)/4, -5, 5))
// 2.3.3
show('2.3.3 vd1 g\'=f\'+2 (-2 -+ only)', doiDau((x) => x**3-3*x+2, -5, 5))
show('2.3.3 vd2a g\'=f\'+1 none', doiDau((x) => x**4-2*x**2+1, -5, 5))
show('2.3.3 vd2b h\'=f\'-1 two (+-, -+)', doiDau((x) => x**4-2*x**2-1, -5, 5))
console.log('min f\' vd2 on [-2,2]:', Math.min(...Array.from({length:4001},(_, i)=>{const x=-2+i/1000;return x**4-2*x**2})))
console.log('f\'(1) vd1', 1-3, ' f\'(-2)', -8+6, ' f\'(-1.5) sample 2.3.1', (-0.5)*(6.25)*(-4.5)/4)
console.log('tich 8*-19=', 8*-19, ' tong 3-1+5=', 3-1+5)
