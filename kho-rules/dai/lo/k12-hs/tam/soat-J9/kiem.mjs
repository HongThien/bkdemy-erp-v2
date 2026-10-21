// Soát J9 — kiểm độc lập từng ví dụ bằng quét số
const quet = (f, a, b, n = 2e6, int = false) => {
  let best = { mx: -Infinity, xmx: 0, mn: Infinity, xmn: 0 }
  if (int) { for (let x = a; x <= b; x++) { const v = f(x); if (v > best.mx) best = { ...best, mx: v, xmx: x }; if (v < best.mn) best = { ...best, mn: v, xmn: x } } return best }
  for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; const v = f(x); if (!isFinite(v)) continue; if (v > best.mx) best = { ...best, mx: v, xmx: x }; if (v < best.mn) best = { ...best, mn: v, xmn: x } }
  return best
}
const dauKhoang = (f, a, b, n = 20000) => { // dấu của f' bằng sai phân
  const h = 1e-6, d = x => (f(x + h) - f(x - h)) / (2 * h); let out = [], s0 = null, x0 = a
  for (let i = 1; i < n; i++) { const x = a + (b - a) * i / n, s = Math.sign(d(x)); if (s !== s0) { if (s0 !== null) out.push([+x0.toFixed(3), +x.toFixed(3), s0]); s0 = s; x0 = x } }
  out.push([+x0.toFixed(3), b, s0]); return out
}
const log = (t, v) => console.log(t.padEnd(28), JSON.stringify(v))

// H7.1.1
log('7.1.1 vd1', quet(x => -(x ** 3) + 9 * x ** 2, 0, 10))           // max 108@6, min -100@10
log('7.1.1 vd2 nguyen', quet(x => -(x ** 3) + 7 * x ** 2, 1, 6, 0, true)) // max 50@5
// H7.1.2
{ const T = t => -t * t + 8 * t + 10; log('7.1.2 vd1', [T(0), quet(T, 0, 8)]) }
{ const C = t => 30 * t / (t * t + 9); log('7.1.2 vd2', [quet(C, 0, 200), C(6)]) }
// H7.1.3
{ const V = t => t ** 3 - 12 * t * t + 36 * t + 50; log('7.1.3 vd1 dau', dauKhoang(V, 0, 10)); log('7.1.3 vd1', [quet(V, 0, 10), V(0), V(2), V(6), V(10)]) }
{ const K = t => t ** 3 - 3 * t * t - 9 * t + 40; log('7.1.3 vd2 dau', dauKhoang(K, 0, 6)); log('7.1.3 vd2', [quet(K, 0, 6), K(0), K(6)]) }
// H7.2.1
log('7.2.1 vd1', quet(x => x * (12 - 2 * x) ** 2, 0, 6))
{ const C = x => 300 * x * x + 200 * 4 * x * (162 / x / x); log('7.2.1 vd2', quet(C, 0.5, 50)) }
// H7.2.2
log('7.2.2 vd1', quet(x => x * (100 - 2 * x), 0, 50))
log('7.2.2 vd2', quet(x => 2 * x * Math.sqrt(25 - x * x), 0, 5))
// H7.2.3
log('7.2.3 vd1', quet(x => x * x / 16 + (60 - x) ** 2 / 16, 0, 60))
log('7.2.3 vd2', [quet(x => x * x / 16 + (60 - x) ** 2 / (4 * Math.PI), 0, 60), 240 / (4 + Math.PI), 900 / (4 + Math.PI)])
// H7.2.4
log('7.2.4 vd1', [quet(x => 2 * x * (4 - x * x / 4), 0, 4), 4 / Math.sqrt(3), 64 * Math.sqrt(3) / 9])
{ // vd2: giải hệ 216a+36b=0, 8a+4b=16
  const det = 216 * 4 - 36 * 8, a = (0 * 4 - 36 * 16) / det, b = (216 * 16 - 8 * 0) / det
  const f = x => a * x ** 3 + b * x * x
  log('7.2.4 vd2 he', { a, b, fA: f(6), fB: f(2), duong_tren_0_6: quet(f, 0.001, 5.999).mn > 0 })
  log('7.2.4 vd2 S', [quet(x => 0.5 * (6 - x) * f(x), 0, 6), f(3)])
  log('7.2.4 vd2 hinh max f', quet(f, 0, 6))
}
// H7.3.1
{ const T = x => Math.sqrt(9 + x * x) / 3 + (8 - x) / 5; log('7.3.1 vd1', [quet(T, 0, 8), T(0), T(8)]) }
{ const C = x => 5 * Math.sqrt(4 + x * x) + 4 * (10 - x); log('7.3.1 vd2', [quet(C, 0, 10), C(0), C(10)]) }
// H7.3.2
log('7.3.2 vd1', [quet(x => Math.sqrt(x * x + (x * x - 3) ** 2), -10, 10), Math.sqrt(11) / 2, Math.sqrt(2.5)])
log('7.3.2 vd2', [quet(t => Math.hypot(20 - 10 * t, 5 * t), 0, 50), 4 * Math.sqrt(5)])
// H7.3.3 — dựng hình học độc lập: hành lang 1 nằm ngang, rộng a (0<=y<=a, x<=0 ... ) ; kiểm ℓ bằng giao điểm thật
{
  const kiemGoc = (a, b) => {
    // góc trong tại (0,0); hành lang ngang: -a<=y<=0 (rộng a), chạy theo Ox về x<0... dùng mô hình: tường ngoài y=-a và x=b.
    // Đoạn qua (0,0) tạo góc θ với Ox (phương hành lang rộng a): giao tường ngoài y=-a và x=b
    const L = th => { const d = [Math.cos(th), Math.sin(th)]; const t1 = a / Math.sin(th); /* đi ngược tới y=-a */ const t2 = b / Math.cos(th); return t1 + t2 }
    const th = Math.atan(Math.cbrt(a / b))
    return { quet: quet(L, 1e-4, Math.PI / 2 - 1e-4), thetaCongThuc: th, tan: Math.tan(th), cuc: (a ** (2 / 3) + b ** (2 / 3)) ** 1.5 }
  }
  log('7.3.3 vd1', kiemGoc(3, 3)); log('7.3.3 vd2', kiemGoc(27, 64)); log('6√2', 6 * Math.SQRT2)
}
// H7.3.4
{ const phi = (p, q) => x => Math.atan(q / x) - Math.atan(p / x)
  const r1 = quet(phi(1, 4), 0.001, 50); log('7.3.4 vd1', [r1, Math.tan(r1.mx), r1.mx * 180 / Math.PI])
  const r2 = quet(phi(4, 9), 0.001, 100); log('7.3.4 vd2', [r2, Math.tan(r2.mx), r2.mx * 180 / Math.PI]) }
// H7.3.3 hình học thật: hành lang ngang y∈[0;a], hành lang dọc x∈[0;b], góc trong (b;a), tường ngoài y=0 và x=0
for (const [a, b] of [[3, 3], [27, 64]]) {
  const Lthat = th => Math.hypot(b + a / Math.tan(th), a + b * Math.tan(th))
  const Lct = th => a / Math.sin(th) + b / Math.cos(th)
  let lech = 0; for (let i = 1; i < 1000; i++) { const th = i / 1000 * Math.PI / 2; lech = Math.max(lech, Math.abs(Lthat(th) - Lct(th))) }
  const r = quet(Lthat, 1e-4, Math.PI / 2 - 1e-4); log(`7.3.3 that a=${a} b=${b}`, { lech, min: r.mn, tan: Math.tan(r.xmn) })
}
