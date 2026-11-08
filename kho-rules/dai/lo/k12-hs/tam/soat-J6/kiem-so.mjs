// Soát J6 — kiểm số độc lập (không dùng tam/J6/thu.mjs)
let loi = 0
const ok = (c, msg) => { if (!c) { loi++; console.log('  ✗ ' + msg) } else console.log('  ✓ ' + msg) }
const gan = (a, b, e = 1e-6) => Math.abs(a - b) < e
const d = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h)
// đếm tiệm cận của phân thức P/Q bằng số: TCĐ = nghiệm Q (quét) mà |f| bùng nổ; TCN: giới hạn hữu hạn ở ±∞
function demTC(P, Q, A, B, C) {
  // nghiệm mẫu Ax^2+Bx+C bằng công thức, rồi kiểm bằng số f bùng nổ
  const D = B * B - 4 * A * C, ngQ = D < -1e-12 ? [] : Math.abs(D) < 1e-12 ? [-B / (2 * A)] : [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)]
  let tcd = 0
  for (const r of ngQ) { const v = Math.abs(P(r + 1e-7) / Q(r + 1e-7)); if (v > 1e3) tcd++ }
  const L1 = P(1e7) / Q(1e7), L2 = P(-1e7) / Q(-1e7)
  let tcn = 0
  if (Number.isFinite(L1) && Math.abs(L1) < 1e5) tcn = 1
  if (Number.isFinite(L2) && Math.abs(L2) < 1e5 && !(tcn && gan(L1, L2, 1e-3))) tcn++
  return tcd + tcn
}
console.log('H4.4.1 VD1: (2x+1)/(x^2-2x+m) đúng 3 TC ⇔ m<1, m≠-5/4')
for (let m = -5; m <= 3; m += 0.125) {
  const n = demTC((x) => 2 * x + 1, (x) => x * x - 2 * x + m, 1, -2, m)
  const ky = m < 1 && m !== -1.25
  if ((n === 3) !== ky) ok(false, `m=${m} đếm ${n}`)
}
ok(demTC((x) => 2 * x + 1, (x) => x * x - 2 * x - 1.25, 1, -2, -1.25) === 2, 'm=-5/4 còn 2 TC')
console.log('H4.4.1 VD2: (2x-1)/(x^2-2mx+3m-2) đúng 2 TC ⇔ m∈{7/8;1;2}')
const tim = []
for (let k = -400; k <= 400; k++) { const m = k / 8; if (demTC((x) => 2 * x - 1, (x) => x * x - 2 * m * x + 3 * m - 2, 1, -2 * m, 3 * m - 2) === 2) tim.push(m) }
ok(JSON.stringify(tim) === JSON.stringify([0.875, 1, 2]), 'quét m bước 1/8 trong [-50;50]: ' + tim.join(','))
console.log('H4.4.2')
{ const f = (x) => (4 * x - 1) / (-2 * x + 2); ok(Math.abs(f(1 + 1e-7)) > 1e5 && gan(f(1e8), -2, 1e-6), 'VD1 a=4,b=-2: TCĐ x=1, TCN y=-2') }
{ const f = (x) => (2 * x * x + x + 2) / (x + 1); ok(gan(f(1e6) - (2 * 1e6 - 1), 0, 1e-4) && gan(f(-1e6) - (2 * -1e6 - 1), 0, 1e-4), 'VD2 a=2,b=1: TCX y=2x-1') }
console.log('H4.5.1')
{ const f = (x) => (2 * x - 1) / (x + 3); ok(gan(f(-3 + 0.7) + f(-3 - 0.7), 4, 1e-9), 'a) đối xứng qua (-3;2)') }
{ const f = (x) => (x * x - 3 * x + 3) / (x - 2); ok(gan(f(2 + 0.7) + f(2 - 0.7), 2, 1e-9), 'b) đối xứng qua (2;1)') }
{ const m = 1, f = (x) => (m * x - 1) / (x + m - 1); ok(gan(f(0 + 0.7) + f(0 - 0.7), 2, 1e-9) && gan(1, 2 * 0 + 1), 'VD2 m=1: I(0;1) ∈ y=2x+1') }
for (let m = -5; m <= 5; m += 0.25) { const I = [1 - m, m]; if (gan(I[1], 2 * I[0] + 1) !== (m === 1)) ok(false, 'quét m ' + m) }
console.log('H4.5.2')
{ const f = (x) => (3 * x - 2) / (x + 1); let s = new Set(); for (const x of [-7, -2, -0.3, 0, 4, 11]) s.add(Math.round(Math.abs(x + 1) * Math.abs(f(x) - 3) * 1e9) / 1e9); ok(s.size === 1 && s.has(5), 'VD1 tích = 5') }
{ const f = (x) => (2 * x + 1) / (x - 1); let best = [1e9, 0]; for (let x = 1.0001; x < 20; x += 1e-5) { const t = (x - 1) + Math.abs(f(x) - 2); if (t < best[0]) best = [t, x] }
  ok(gan(best[0], 2 * Math.sqrt(3), 1e-6) && gan(best[1], 1 + Math.sqrt(3), 1e-3) && gan(f(best[1]), 2 + Math.sqrt(3), 1e-3), `VD2 min tổng ${best[0].toFixed(6)} tại x=${best[1].toFixed(4)}`) }
console.log('H4.5.3')
{ const f = (x) => (2 * x - 1) / (x - 3); ok(Math.abs(f(3 + 1e-7)) > 1e5 && gan(f(1e8), 2, 1e-6), 'VD1 TCĐ 3, TCN 2 ⇒ S=6') }
for (const m of [3, -5]) { const f = (x) => (x * x + m * x + 1) / (x - 1); const X = 1e6; const k = (f(2 * X) - f(X)) / X, b = f(X) - k * X; const S = 0.5 * (b * b) / Math.abs(k); ok(gan(S, 8, 1e-3), `VD2 m=${m}: TCX y=${k.toFixed(3)}x+${b.toFixed(3)}, S=${S.toFixed(4)}`) }
{ const nghiem = []; for (let m = -20; m <= 20; m += 0.01) { const S = (m + 1) ** 2 / 2; if (Math.abs(S - 8) < 0.005 && m + 2 !== 0) nghiem.push(Math.round(m)) } ok(JSON.stringify([...new Set(nghiem)]) === '[-5,3]', 'quét m: ' + [...new Set(nghiem)]) }
console.log('H4.5.4')
{ const f = (x) => (x * x + x + 1) / (x - 1); const X = 1e6; const k = (f(2 * X) - f(X)) / X; ok(gan(Math.atan(k) * 180 / Math.PI, 45, 1e-3), 'VD1 TCX hệ số góc 1, góc với TCĐ = 90−45 = 45°') }
{ const f = (x) => (2 * x * x + 3 * x + 4) / (x + 1); const X = 1e6; const k1 = (f(2 * X) - f(X)) / X, b = f(X) - k1 * X; const k2 = -3; const g = Math.abs(Math.atan(k1) - Math.atan(k2)) * 180 / Math.PI; ok(gan(k1, 2, 1e-4) && gan(b, 1, 1e-3) && gan(Math.min(g, 180 - g), 45, 1e-3), 'VD2 góc ' + Math.min(g, 180 - g).toFixed(4)) }
// khảo sát: quét cực trị, đơn điệu
function khaoSat(f, a, b, ten) {
  const ct = []; let truoc = d(f, a)
  for (let x = a; x <= b; x += 1e-3) { const v = d(f, x + 1e-3); if (Number.isFinite(v) && Number.isFinite(truoc) && truoc * v < 0 && Math.abs(f(x)) < 1e2 && Math.abs(f(x + 1e-3) - f(x)) < 0.1) ct.push([Math.round(x * 100) / 100, Math.round(f(x) * 100) / 100, truoc > 0 ? 'CĐ' : 'CT']); truoc = v }
  console.log('  ' + ten + ' cực trị:', JSON.stringify(ct)); return ct
}
console.log('H5.1.1')
{ const f = (x) => x ** 3 - 3 * x * x + 2; ok(JSON.stringify(khaoSat(f, -5, 5, 'VD1')) === '[[0,2,"CĐ"],[2,-2,"CT"]]', 'VD1 CĐ(0;2) CT(2;-2)'); ok(gan(f(1 + 0.6) + f(1 - 0.6), 0), 'tâm I(1;0)'); ok(gan(f(1 + Math.sqrt(3)), 0, 1e-9) && gan(f(1 - Math.sqrt(3)), 0, 1e-9), 'Ox 1±√3') }
{ const f = (x) => -(x ** 3) + 3 * x + 2; ok(JSON.stringify(khaoSat(f, -5, 5, 'VD2 mới')) === '[[-1,0,"CT"],[1,4,"CĐ"]]', 'VD2 mới CT(-1;0) CĐ(1;4)'); ok(gan(f(0.6) + f(-0.6), 4), 'tâm I(0;2)'); ok(f(2) === 0 && f(-1) === 0, 'Ox -1 (kép), 2') }
{ const f = (x) => -(x ** 3) + 3 * x * x - 3 * x + 2; ok(khaoSat(f, -5, 5, 'VD2 cũ').length === 0, 'VD2 cũ không cực trị') }
console.log('H5.1.2')
{ const f = (x) => (2 * x - 1) / (x + 1); ok(f(-1 - 1e-7) > 1e5 && f(-1 + 1e-7) < -1e5 && d(f, 3) > 0 && d(f, -3) > 0 && gan(f(1e9), 2, 1e-6), 'VD1 giới hạn, đồng biến'); ok(f(0) === -1 && f(0.5) === 0, 'giao trục') }
{ const f = (x) => (-x + 3) / (2 * x - 2); ok(f(1 - 1e-7) < -1e5 && f(1 + 1e-7) > 1e5 && d(f, 3) < 0 && d(f, -3) < 0 && gan(f(1e9), -0.5, 1e-6), 'VD2 giới hạn, nghịch biến'); ok(f(0) === -1.5 && f(3) === 0, 'giao trục') }
console.log('H5.1.3')
{ const f = (x) => (x * x - x + 1) / (x - 1); ok(JSON.stringify(khaoSat(f, -5, 5, 'VD1')) === '[[0,-1,"CĐ"],[2,3,"CT"]]', 'VD1'); ok(f(1 - 1e-7) < -1e5 && f(1 + 1e-7) > 1e5 && gan(f(1e7) - 1e7, 0, 1e-5), 'giới hạn, TCX y=x') }
{ const f = (x) => (-(x * x) + 2 * x) / (x - 1); ok(khaoSat(f, -5, 5, 'VD2 mới').length === 0, 'VD2 mới không cực trị'); ok(f(1 - 1e-7) < -1e5 && f(1 + 1e-7) > 1e5 && gan(f(1e7) - (-1e7 + 1), 0, 1e-5) && gan(f(-1e7) - (1e7 + 1), 0, 1e-5), 'giới hạn, TCX y=-x+1'); let nb = true; for (let x = -5; x < 5; x += 0.01) if (Math.abs(x - 1) > 0.02 && d(f, x) >= 0) nb = false; ok(nb, 'nghịch biến từng khoảng'); ok(f(0) === 0 && f(2) === 0, 'Ox 0 và 2'); ok(gan(f(1.6) + f(0.4), 0), 'tâm I(1;0)') }
console.log('H5.2.1')
{ const opts = { a: (x) => x ** 3 - 3 * x + 1, b: (x) => -(x ** 3) + 3 * x + 1, c: (x) => x ** 3 + 3 * x + 1, d: (x) => x ** 3 - 3 * x * x + 1 }; const khop = Object.entries(opts).filter(([, f]) => f(-1) === 3 && f(1) === -1 && f(0) === 1 && d(f, -1) ** 2 < 1e-8 && d(f, 1) ** 2 < 1e-8).map((e) => e[0]); ok(khop.join() === 'a', 'VD1 chỉ a) khớp') }
{ const opts = { a: (x) => x ** 3 - 3 * x * x + 3 * x + 3, b: (x) => -(x ** 3) + 3 * x * x - 3 * x + 3, c: (x) => -(x ** 3) + 3 * x + 3, d: (x) => -(x ** 3) + 3 * x * x - 3 * x - 1 }; const khop = Object.entries(opts).filter(([, f]) => f(0) === 3 && f(1) === 2 && f(2) === 1 && khaoSat(f, -5, 5, '').length === 0 && d(f, 3) < 0).map((e) => e[0]); ok(khop.join() === 'b', 'VD2 chỉ b) khớp') }
console.log('H5.2.2')
{ const g = (x) => (2 * x - 1) / (x + 1); const opts = { a: g, b: (x) => (2 * x + 1) / (x - 1), c: (x) => (x - 2) / (x + 1), d: (x) => (2 * x - 1) / (x - 1) }; const khop = Object.entries(opts).filter(([, f]) => [-4.3, -2, 0.5, 2.7].every((x) => gan(f(x), g(x)))).map((e) => e[0]); ok(khop.join() === 'a', 'VD1') }
{ const g = (x) => (-x + 1) / (x - 2); const opts = { a: (x) => (x - 1) / (x - 2), b: (x) => (-x + 3) / (x - 2), c: (x) => (-x - 1) / (x - 2), d: g }
  for (const [k, f] of Object.entries(opts)) console.log(`   ${k}: TCN ${f(1e9).toFixed(3)}, TCĐ 2? ${Math.abs(f(2 + 1e-7)) > 1e5}, f(1)=${f(1)}, y' tại 0: ${d(f, 0).toFixed(3)}`)
  const khop = Object.entries(opts).filter(([, f]) => gan(f(1e9), -1, 1e-6) && f(1) === 0 && d(f, 0) > 0).map((e) => e[0]); ok(khop.join() === 'd', 'VD2 mới chỉ d) khớp') }
console.log('H5.2.3')
{ const g = (x) => (x * x - x + 1) / (x - 1); const opts = { a: g, b: (x) => (x * x - x + 1) / (x + 1), c: (x) => (x * x + x + 1) / (x - 1), d: (x) => (-(x * x) + x - 1) / (x - 1) }; const khop = Object.entries(opts).filter(([, f]) => [-2.3, 0.5, 3.1].every((x) => gan(f(x), g(x)))).map((e) => e[0]); ok(khop.join() === 'a', 'VD1') }
{ const g = (x) => (x * x - x - 1) / (x - 1); ok(khaoSat(g, -5, 5, 'VD2').length === 0 && g(0) === 1, 'VD2 hàm đúng không cực trị, y(0)=1'); const b = (x) => (x * x - x + 1) / (x - 1); ok(khaoSat(b, -5, 5, 'b').length === 2 && b(0) === -1, 'b) có 2 cực trị') }
console.log(loi ? `LỖI ${loi}` : 'TẤT CẢ ĐÚNG')
