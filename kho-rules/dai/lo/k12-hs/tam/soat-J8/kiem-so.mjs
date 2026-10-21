// Soát J8 — kiểm số độc lập (không dùng tam/J8/thu*.mjs)
const ok = (ten, d) => console.log((d ? 'OK  ' : 'SAI ') + ten)
const gan = (a, b, e = 1e-7) => Math.abs(a - b) < e
const dh = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h)
// tiếp tuyến tại x0 khớp y=kx+b
const tt = (f, x0, k, b) => gan(dh(f, x0), k, 1e-5) && gan(f(x0) - dh(f, x0) * x0, b, 1e-5)
// đếm nghiệm phân biệt của g(x)=0 trên [a,b]: đổi dấu + chạm (|g| cực tiểu địa phương ~0)
function nghiem(g, a, b, N = 2e6) {
  const r = []; let xp = a, gp = g(a)
  for (let i = 1; i <= N; i++) {
    const x = a + (b - a) * i / N, gx = g(x)
    if (gp === 0) r.push(xp)
    else if (gp * gx < 0) { let l = xp, h = x; for (let k = 0; k < 80; k++) { const m = (l + h) / 2; (g(l) * g(m) <= 0) ? h = m : l = m } r.push((l + h) / 2) }
    xp = x; gp = gx
  }
  return r
}
// H6.2.1
{ const f = (x) => x ** 3 - 3 * x ** 2 + 2
  ok('6.2.1 VD1a y=9x-25', tt(f, 3, 9, -25))
  ok('6.2.1 VD1b tâm đối xứng x=1 (trung điểm cực trị 0,2), y=-3x+3', tt(f, 1, -3, 3) && gan(f(0) + f(2), 2 * f(1)))
  const g = (x) => (2 * x - 1) / (x + 1)
  ok('6.2.1 VD2a x0=1/2, y=4/3x-2/3', gan(g(0.5), 0) && tt(g, 0.5, 4 / 3, -2 / 3))
  ok('6.2.1 VD2b x0=2, y=x/3+1/3', gan(g(2), 1) && tt(g, 2, 1 / 3, 1 / 3)) }
// H6.2.2
{ const f = (x) => x ** 3 + 3 * x ** 2 - 2, fp = (x) => 3 * x * x + 6 * x
  ok('6.2.2 VD1a nghiệm fp=9 là 1,-3', nghiem((x) => fp(x) - 9, -10, 10).map(Math.round).join() === '-3,1')
  ok('6.2.2 VD1a 9x-7, 9x+25', tt(f, 1, 9, -7) && tt(f, -3, 9, 25))
  ok('6.2.2 VD1b k=24 (vuông góc -1/24)', gan(24 * (-1 / 24), -1) && nghiem((x) => fp(x) - 24, -10, 10).map(Math.round).join() === '-4,2')
  ok('6.2.2 VD1b 24x-30, 24x+78', tt(f, 2, 24, -30) && tt(f, -4, 24, 78))
  const g = (x) => (x + 2) / (x - 1)
  ok('6.2.2 VD2 x0=2 -> -3x+10 (trùng d), x0=0 -> -3x-2', tt(g, 2, -3, 10) && tt(g, 0, -3, -2)) }
// H6.2.3
{ for (const [ten, f, xI, yI, KQ] of [['VD1', (x) => (2 * x + 1) / (x - 1), 1, 2, 6], ['VD2', (x) => (2 * x - 3) / (x - 2), 2, 2, null]]) {
    let sMin = Infinity, aMin = [], tdOk = true, sConst = true
    for (let a = xI - 5; a <= xI + 5; a += 0.001) {
      if (Math.abs(a - xI) < 1e-6) continue
      const k = dh(f, a, 1e-6), yA = k * (xI - a) + f(a), xB = a + (yI - f(a)) / k
      if (!gan((xI + xB) / 2, a, 1e-4) || !gan((yA + yI) / 2, f(a), 1e-3)) tdOk = false
      const S = 0.5 * Math.abs(yA - yI) * Math.abs(xB - xI), AB = Math.hypot(xB - xI, yA - yI)
      if (KQ && !gan(S, KQ, 1e-3)) sConst = false
      if (AB < sMin - 1e-9) { sMin = AB; aMin = [a] } else if (gan(AB, sMin, 1e-6)) aMin.push(a)
    }
    ok(`6.2.3 ${ten} M trung điểm AB`, tdOk)
    if (KQ) ok(`6.2.3 ${ten} S=6 không đổi`, sConst)
    else ok(`6.2.3 VD2 ABmin=2√2 tại a=1,3 (quét: ${sMin.toFixed(6)})`, gan(sMin, 2 * Math.SQRT2, 1e-5) && gan(f(3), 3) && gan(f(1), 1))
  } }
// H6.3.1
{ const f = (x) => (2 * x + 2) / (x - 1); let m1 = Infinity, m2 = Infinity, at = []
  for (let x = -20; x <= 20; x += 1e-4) { if (Math.abs(x - 1) < 1e-6) continue
    const IM = Math.hypot(x - 1, f(x) - 2); if (IM < m1) m1 = IM
    const T = Math.abs(x - 1) + Math.abs(f(x) - 2); if (T < m2) m2 = T }
  ok(`6.3.1 VD1 IMmin=2√2 (${m1.toFixed(6)}), tổng min=4 (${m2.toFixed(6)})`, gan(m1, 2 * Math.SQRT2, 1e-5) && gan(m2, 4, 1e-5) && gan(f(3), 4) && gan(f(-1), 0))
  const g = (x) => (x * x - x + 2) / (x - 1); let m = Infinity
  for (let x = -20; x <= 20; x += 1e-4) { if (Math.abs(x - 1) < 1e-6) continue; const d = Math.abs(x + g(x) - 2) / Math.SQRT2; if (d < m) m = d }
  ok(`6.3.1 VD2 dmin=2√2 (${m.toFixed(6)}), M(2;4), M(0;-2)`, gan(m, 2 * Math.SQRT2, 1e-5) && gan(g(2), 4) && gan(g(0), -2) && nghiem((x) => x + g(x) - 2, -20, 0.999).length + nghiem((x) => x + g(x) - 2, 1.001, 20).length === 0) }
// H6.3.2
{ const f = (x) => (x + 3) / (x - 1), r = []
  for (const u of [Math.SQRT2, 2 * Math.SQRT2]) { const A = [1 + u, f(1 + u)], B = [1 - u, f(1 - u)]; r.push(gan(Math.hypot(A[0] - B[0], A[1] - B[1]), 2 * Math.sqrt(10)) && gan((A[1] + B[1]) / 2, 1)) }
  ok('6.3.2 VD1 hai cặp u=√2, 2√2 cho AB=2√10, đối xứng I', r.every(Boolean) && gan(f(1 + Math.SQRT2), 1 + 2 * Math.SQRT2) && gan(f(1 + 2 * Math.SQRT2), 1 + Math.SQRT2))
  // đủ cặp: h(u)=4u^2+64/u^2-40 với u>0 có đúng 2 nghiệm
  ok('6.3.2 VD1 đúng 2 nghiệm u>0', nghiem((u) => 4 * u * u + 64 / u / u - 40, 0.01, 50).length === 2)
  const g = (x) => (2 * x - 1) / (x - 1); let m = Infinity, arg
  for (let u = 0.02; u <= 4; u += 0.004) for (let v = 0.02; v <= 4; v += 0.004) { const d = Math.hypot(u + v, g(1 + u) - g(1 - v)); if (d < m) { m = d; arg = [u, v] } }
  ok(`6.3.2 VD2 ABmin=2√2 (${m.toFixed(5)}) tại u=v=1 (${arg.map((t) => t.toFixed(3))})`, gan(m, 2 * Math.SQRT2, 1e-4) && gan(g(2), 3) && gan(g(0), 1)) }
// H6.3.3
{ const ds = (f, a, b) => { const r = []; for (let x = a; x <= b; x++) { const y = f(x); if (Number.isFinite(y) && gan(y, Math.round(y), 1e-9)) r.push(`(${x};${Math.round(y)})`) } return r.join(' ') }
  const r1 = ds((x) => (2 * x + 7) / (x - 1), -1000, 1000); console.log('   ', r1)
  ok('6.3.3 VD1 6 điểm', r1 === '(-8;1) (-2;-1) (0;-7) (2;11) (4;5) (10;3)')
  const r2 = ds((x) => (3 * x + 1) / (2 * x - 1), -1000, 1000); console.log('   ', r2)
  ok('6.3.3 VD2 4 điểm', r2 === '(-2;1) (0;-1) (1;4) (3;2)') }
// H6.4.1 VD1: f=x^3-3x, f(x^2-2x)=-1
{ const f = (x) => x ** 3 - 3 * x, t = nghiem((t) => f(t) + 1, -10, 10); console.log('    t =', t.map((v) => v.toFixed(4)))
  ok('6.4.1 VD1 t1∈(-2;-1), t2∈(0;1), t3∈(1;2)', t.length === 3 && t[0] > -2 && t[0] < -1 && t[1] > 0 && t[1] < 1 && t[2] > 1 && t[2] < 2)
  const nx = nghiem((x) => f(x * x - 2 * x) + 1, -10, 10); console.log('    x =', nx.map((v) => v.toFixed(4)))
  ok('6.4.1 VD1 4 nghiệm', nx.length === 4) }
// H6.4.1 VD2: f=x^3-3x^2, f(f(x))=0 — giải CHÍNH XÁC: f(f)=f^2(f-3)=0
{ const f = (x) => x ** 3 - 3 * x ** 2
  // f(x)=0: x^2(x-3)=0 → {0,3}; f(x)=3: x^3-3x^2-3=0, x=y+1: y^3-3y-5=0, Δ=-4p^3-27q^2=108-675<0 ⇒ 1 nghiệm thực (Cardano)
  const D = 25 / 4 - 1, y = Math.cbrt(5 / 2 + Math.sqrt(D)) + Math.cbrt(5 / 2 - Math.sqrt(D)), x3 = y + 1
  console.log('    Cardano: x =', x3, ' f(x)=', f(x3), ' Δ(y^3-3y-5)=', -4 * (-3) ** 3 - 27 * 25)
  const S = [0, 3, x3]
  ok('6.4.1 VD2 tập nghiệm {0;3;x3≈3,2790} phân biệt, mỗi x thoả f(f(x))=0', S.every((x) => gan(f(f(x)), 0, 1e-8)) && new Set(S.map((v) => v.toFixed(6))).size === 3)
  // chặn: ngoài 3 nghiệm này không có nghiệm nào (f(f(x))=0 ⇔ f(x)∈{0,3}); kiểm thêm f(x)-3 đơn điệu tăng trên x>2 và <0 trên x<=2
  let am = true; for (let x = -50; x <= 2; x += 1e-4) if (f(x) - 3 >= 0) am = false
  ok('6.4.1 VD2 f(x)=3 không có nghiệm x≤2 (max f trên (-∞;2] là 0)', am) }
// H6.4.2 VD1: f=x^3-3x^2+2
{ const f = (x) => x ** 3 - 3 * x ** 2 + 2
  const dem = (m) => { const a = new Set([...(m === 0 ? [] : nghiemK((x) => f(x) - m)), ...nghiemK((x) => f(x) + m)].map((v) => v.toFixed(5))); return a.size }
  function nghiemK(g) { // nghiệm của đa thức bậc 3 kể cả kép: đổi dấu của g, hoặc của g' tại điểm g≈0
    const r = nghiem(g, -10, 10); for (const c of [0, 2]) if (gan(g(c), 0, 1e-12)) r.push(c); return r }
  const tb = { 0.5: 6, 1: 6, 0: 3, 2: 4, 3: 2, 1.9: 6 }
  for (const [m, n] of Object.entries(tb)) ok(`6.4.2 VD1 |f|=${m}: ${dem(+m)} nghiệm (chờ ${n})`, dem(+m) === n) }
// H6.4.2 VD2: f=x^3-6x^2+9x-2, f(|x|)=m có 6 nghiệm
{ const f = (x) => x ** 3 - 6 * x ** 2 + 9 * x - 2
  const dem = (m) => { const g = (x) => f(Math.abs(x)) - m; const r = nghiem(g, -10, 10).map((v) => v.toFixed(5)); for (const c of [0, 1, -1, 3, -3]) if (gan(g(c), 0, 1e-12)) r.push(c.toFixed(5)); return new Set(r).size }
  const tot = []; for (let m = -10; m <= 10; m++) if (dem(m) === 6) tot.push(m)
  console.log('    m nguyên cho 6 nghiệm:', tot.join(','), ' | m=-2:', dem(-2), ' m=2:', dem(2))
  ok('6.4.2 VD2 m∈{-1,0,1}, m=-2→3, m=2→4', tot.join() === '-1,0,1' && dem(-2) === 3 && dem(2) === 4)
  ok('6.4.2 VD2 hình: f(0)=-2, CĐ(1;2), CT(3;-2)', gan(f(0), -2) && gan(f(1), 2) && gan(f(3), -2) && gan(dh(f, 1), 0, 1e-6) && gan(dh(f, 3), 0, 1e-6)) }
// Hình H6.4.1 VD1/VD2, H6.4.2 VD1: điểm ghi trên hình là cực trị
{ const c = [[(x) => x ** 3 - 3 * x, [[-1, 2], [1, -2]]], [(x) => x ** 3 - 3 * x ** 2, [[0, 0], [2, -4]]], [(x) => x ** 3 - 3 * x ** 2 + 2, [[0, 2], [2, -2]]]]
  ok('Hình 6.4.x: điểm cực trị đánh dấu đúng công thức', c.every(([f, ps]) => ps.every(([x, y]) => gan(f(x), y) && gan(dh(f, x), 0, 1e-6)))) }
