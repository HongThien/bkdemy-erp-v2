// Soát J7 — kiểm độc lập bằng số
let loi = 0
const ok = (c, msg) => { if (!c) { loi++; console.log('SAI:', msg) } else console.log('ok :', msg) }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e
const d1 = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h)
// cực trị bằng quét đổi dấu đạo hàm
function cucTri(f, a, b, n = 200000) {
  const r = []; let prev = d1(f, a)
  for (let i = 1; i <= n; i++) { const x = a + (b - a) * i / n, g = d1(f, x); if (Number.isFinite(g) && Number.isFinite(prev) && prev * g < 0) r.push({ x: +x.toFixed(4), y: +f(x).toFixed(4), loai: prev > 0 ? 'CD' : 'CT' }); prev = g }
  return r
}
function nghiem(f, a, b, n = 400000) { // đổi dấu + chạm
  const r = []; let px = a, pv = f(a)
  for (let i = 1; i <= n; i++) { const x = a + (b - a) * i / n, v = f(x); if (Number.isFinite(v) && Number.isFinite(pv) && (pv * v < 0 || v === 0) && Math.abs(v - pv) < 1) r.push(+x.toFixed(4)); px = x; pv = v }
  return r
}
const soNghiem = (f, m, a, b) => { // f(x)=m, kể cả chạm cực trị
  const g = (x) => f(x) - m; let c = nghiem(g, a, b).length
  for (const t of cucTri(f, a, b)) if (near(t.y, m, 1e-3)) c++
  return c
}

// H5.3.1 VD1
{ const f = x => x ** 3 - 6 * x * x + 9 * x + 1; const c = cucTri(f, -1, 5); console.log('531a', c, f(0)); ok(c.length === 2 && near(c[0].x, 1, 1e-3) && near(c[1].x, 3, 1e-3) && f(0) === 1, 'H5.3.1 VD1 cực trị 1,3; d=1') }
// H5.3.1 VD2
{ const f = x => -(x ** 3) - 3 * x * x + 2; const c = cucTri(f, -4, 2); console.log('531b', c); ok(near(c[0].x, -2, 1e-3) && near(c[0].y, -2, 1e-3) && c[0].loai === 'CT' && near(c[1].x, 0, 1e-3) && near(c[1].y, 2, 1e-3), 'H5.3.1 VD2 CT(-2;-2) CĐ(0;2); a<0 b=-3<0 c=0 d=2') }
// H5.3.2
{ const f = x => (2 * x - 4) / (x - 1); ok(f(0) === 4 && f(2) === 0 && near(f(1e6), 2, 1e-5), 'H5.3.2 VD1 Oy 4, Ox 2, TCN 2; a+b+d=-3'); ok(2 - 4 - 1 === -3, 'tổng') }
{ const f = x => (-2 * x + 2) / (x + 1); ok(f(0) === 2 && near(f(1e7), -2, 1e-5) && Math.abs(f(-1 + 1e-9)) > 1e6, 'H5.3.2 VD2 Oy 2, TCN -2, TCĐ -1') }
// H5.3.3 công thức chia tổng quát: kiểm ngẫu nhiên
for (let t = 0; t < 5; t++) {
  const a = Math.random() * 6 - 3 || 1, b = Math.random() * 6 - 3, c = Math.random() * 6 - 3, d = Math.random() * 6 - 3
  const x = 0.37 + t, lhs = (a * x * x + b * x + c) / (x + d), rhs = a * x + (b - a * d) + (c - d * (b - a * d)) / (x + d)
  ok(near(lhs, rhs, 1e-9), 'H5.3.3 công thức chia đa thức tổng quát #' + t)
}
{ const f = x => (x * x + 3) / (x - 1); ok(near(f(1e6) - (1e6 + 1), 0, 1e-4) && f(0) === -3, 'H5.3.3 VD1 TCX y=x+1, Oy -3') }
{ const f = x => (2 * x * x - 3 * x) / (x - 2); ok(near(f(1e6) - (2e6 + 1), 0, 1e-4) && f(0) === 0, 'H5.3.3 VD2 TCX y=2x+1, qua O; a+b+c+d=-3'); console.log('533b ct', cucTri(f, -2, 1.99), cucTri(f, 2.01, 6)) }
// H5.3.4
{ const f = x => x ** 3 - 6 * x * x + 9 * x + 1; const c = cucTri(f, -5, 8); ok(c[0].loai === 'CD' && near(c[0].y, 5, 1e-3) && c[1].loai === 'CT' && near(c[1].y, 1, 1e-3), 'H5.3.4 VD1') }
{ const f = x => (x * x + 3) / (x - 1); const c = cucTri(f, 1.0001, 10); ok(c.length === 1 && c[0].loai === 'CT' && near(c[0].x, 3, 1e-3) && near(c[0].y, 6, 1e-3), 'H5.3.4 VD2 CT(3;6)') }
// H5.4.1 VD1
{ const f = x => -(x ** 3) + 3 * x * x - 2; const c = cucTri(f, -3, 5); console.log('541a', c, nghiem(f, -3, 5)); ok(c[0].loai === 'CT' && near(c[0].y, -2, 1e-3) && c[1].loai === 'CD' && near(c[1].y, 2, 1e-3) && nghiem(f, -3, 5).length === 3, 'H5.4.1 VD1') }
{ const f = x => (x + 2) / (x - 1); ok(f(0) === -2 && f(-2) === 0 && f(2) === 4 && d1(f, 3) < 0 && d1(f, -3) < 0, 'H5.4.1 VD2') }
// H5.4.2 VD1
{ const f = x => -(x ** 3) + 3 * x; ok(soNghiem(f, 1, -5, 5) === 3 && soNghiem(f, -2, -5, 5) === 2 && soNghiem(f, 3, -5, 5) === 1, 'H5.4.2 VD1 số nghiệm 3/2/1')
  let s3 = [], s1 = []; for (let m = -4; m <= 4; m += 0.25) { const k = soNghiem(f, m, -6, 6); if (k === 3) s3.push(m); if (k === 1) s1.push(m) }
  console.log('542a 3 nghiệm:', s3.join(' '), '| 1 nghiệm:', s1.join(' ')) }
// H5.4.2 VD2: dựng hàm cụ thể khớp BBT: f = x^3-3x^2+4 (CĐ 0 tại 4, CT 2 tại 0)
{ const f = x => x ** 3 - 3 * x * x + 4; const c = cucTri(f, -3, 5); ok(near(c[0].y, 4, 1e-3) && near(c[1].y, 0, 1e-3), 'H5.4.2 VD2 hàm đại diện khớp BBT')
  let s2 = []; for (let m = -2; m <= 6; m += 0.25) if (soNghiem(f, m, -6, 8) === 2) s2.push(m); console.log('542b 2 nghiệm m=', s2)
  ok(soNghiem(f, 2.5, -6, 8) === 3, '2f-5=0: 3 nghiệm'); ok(soNghiem(f, 1, -6, 8) + soNghiem(f, -1, -6, 8) === 4, '|f|=1: 4 nghiệm') }
// H5.4.3 VD1
{ const f = x => x ** 3 - 3 * x * x + 4 * x - 2; let odd = true; for (let X = -3; X <= 3; X += 0.1) if (!near(f(1 + X) + f(1 - X), 0, 1e-9)) odd = false; ok(odd && f(0) === -2 && f(2) === 2, 'H5.4.3 VD1 I(1;0), B(2;2)') }
// H5.4.3 VD2 mới
{ const f = x => (2 * x + 1) / (x - 1); let odd = true; for (let X = 0.1; X <= 5; X += 0.1) if (!near(f(1 + X) + f(1 - X), 4, 1e-9)) odd = false
  const P = []; for (let x = -1000; x <= 1000; x++) if (x !== 1 && Number.isInteger(f(x))) P.push([x, f(x)])
  console.log('543b điểm nguyên', JSON.stringify(P)); ok(odd && P.length === 4, 'H5.4.3 VD2 tâm (1;2), 4 điểm nguyên') }
// H6.1.1 VD1: quét m
{ const f = x => x ** 3 - 3 * x * x + 2; let bad = []; for (let m = -8; m <= 8; m += 0.125) { const g = x => f(x) - m * (x - 1); const r = nghiem(g, -30, 30); const k = new Set(r.map(v => v.toFixed(2))).size; const want = m > -3 ? 3 : (m === -3 ? 1 : 1); if ((k === 3) !== (m > -3)) bad.push([m, k]) } ok(bad.length === 0, 'H6.1.1 VD1 m>-3 (quét) ' + JSON.stringify(bad.slice(0, 5))) }
// H6.1.1 VD2
{ const f = x => x ** 3 - 3 * x; let s = []; for (let m = -3; m <= 2; m += 0.125) { let k = 0; const N = 300000; let pv = f(0) - m; if (pv === 0) k++; for (let i = 1; i <= N; i++) { const x = 3 * i / N, v = f(x) - m; if (v === 0 || pv * v < 0) k++; pv = v } if (near(m, -2)) k = 1; if (k === 2) s.push(m) } console.log('611b m có 2 nghiệm trên [0;3]:', s.join(' ')); ok(s[0] > -2 && s[s.length - 1] === 0, 'H6.1.1 VD2 -2<m<=0') }
// H6.1.2 VD1
{ const m = 1; const r = nghiem(x => x ** 3 - 3 * x * x + 2 * x - m * x, -10, 10); console.log('612a', r); const nz = r.filter(v => Math.abs(v) > 1e-3); ok(r.length === 3 && near(nz[0] ** 2 + nz[1] ** 2, 7, 1e-3), 'H6.1.2 VD1 m=1') }
// H6.1.2 VD2: quét m tìm CSN
{ let tim = []; for (let m = -30; m <= 30; m += 0.5) { const r = nghiem(x => x ** 3 - 7 * x * x + m * x - 8, -50, 50); if (r.length === 3) { const s = [...r].sort((a, b) => a - b); if (near(s[0] * s[2], s[1] ** 2, 1e-2)) tim.push(m) } } console.log('612b m CSN:', tim); ok(tim.length === 1 && tim[0] === 14, 'H6.1.2 VD2 m=14 duy nhất') }
// H6.1.3 VD1
for (const m of [-1, 7]) { const r = nghiem(x => (2 * x - 1) / (x + 1) - (x + m), -50, 50).filter(v => Math.abs(v + 1) > 1e-2); const AB = Math.hypot(r[1] - r[0], r[1] - r[0]); ok(r.length === 2 && near(AB, 2 * Math.SQRT2, 1e-3), 'H6.1.3 VD1 m=' + m + ' AB=' + AB.toFixed(4)) }
{ let tim = []; for (let m = -20; m <= 20; m += 0.5) { const r = nghiem(x => (2 * x - 1) / (x + 1) - (x + m), -100, 100).filter(v => Math.abs(v + 1) > 1e-2); if (r.length === 2 && near(Math.hypot(r[1] - r[0], r[1] - r[0]), 2 * Math.SQRT2, 1e-2)) tim.push(m) } console.log('613a quét:', tim) }
// H6.1.3 VD2 mới
{ let tim = []; for (let m = -20; m <= 20; m += 0.5) { const r = nghiem(x => (x + 3) / (x - 1) - (2 * x + m), -100, 100).filter(v => Math.abs(v - 1) > 1e-2); if (r.length === 2) { const G = [(r[0] + r[1]) / 3, (2 * r[0] + m + 2 * r[1] + m) / 3]; if (near(G[0] + 2 * G[1] - 2, 0, 1e-3)) tim.push(m) } else console.log('m', m, 'không 2 giao', r) } console.log('613b quét:', tim); ok(tim.length === 1 && tim[0] === -1, 'H6.1.3 VD2 m=-1') }
console.log(loi ? `\n${loi} LỖI` : '\nTẤT CẢ ĐÚNG')
