// Soát J10 độc lập: quét số mịn cho từng ví dụ
const d = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h);
const argmax = (f, a, b, N = 200000, sgn = 1) => { let bx = a, bv = -Infinity; for (let i = 0; i <= N; i++) { const x = a + (b - a) * i / N; const v = sgn * f(x); if (v > bv) { bv = v; bx = x; } } return [bx, sgn * bv]; };
const intmax = (f, a, b, sgn = 1) => { let bx = a, bv = -Infinity; for (let x = a; x <= b; x++) { const v = sgn * f(x); if (v > bv) { bv = v; bx = x; } } return [bx, sgn * bv]; };
const ok = (ten, got, exp, tol = 1e-3) => console.log((Math.abs(got - exp) <= tol ? 'OK ' : 'SAI') + ' ' + ten + ' got=' + got + ' exp=' + exp);
const sgnScan = (f, a, b, N = 2000) => { let out = [], prev = null; for (let i = 1; i < N; i++) { const x = a + (b - a) * i / N, s = Math.sign(f(x)); if (s !== prev) { out.push([+x.toFixed(3), s]); prev = s; } } return out; };

// H7.4.1 vd1
{ const R = x => (200 - 10 * x) * (100 + 10 * x); const [x, v] = argmax(R, 0, 20); ok('7.4.1a x', x, 5); ok('7.4.1a R', v, 22500); ok('7.4.1a khai trien', R(3), -100 * 9 + 3000 + 20000); }
// H7.4.1 vd2
{ const L = x => (50 - 2 * x) * (1900 + 100 * x); const [x, v] = intmax(L, 0, 25); ok('7.4.1b x', x, 3); ok('7.4.1b L', v, 96800); ok('7.4.1b khai trien', L(7), -200 * 49 + 1200 * 7 + 95000); }
// H7.4.2 vd1
{ const L = x => -0.02 * x * x + 50 * x - (10 * x + 4000); const [x, v] = argmax(L, 0, 2000); ok('7.4.2a x', x, 1000, 0.1); ok('7.4.2a L', v, 16000); }
// H7.4.2 vd2 (moi): R=x(200-x), C=x^3/3-10x^2+120x+500, thue 17, 0<=x<=30
{ const L = x => x * (200 - x) - (x ** 3 / 3 - 10 * x * x + 120 * x + 500) - 17 * x; const [x, v] = argmax(L, 0, 30); ok('7.4.2b x', x, 21, 0.01); ok('7.4.2b L', v, 1705); ok('L(0)', L(0), -500); ok('L(30)', L(30), 490); ok("L'(21)", d(L, 21), 0); ok("L'(-3)", d(L, -3), 0);
  const C = x => x ** 3 / 3 - 10 * x * x + 120 * x + 500; console.log('C dong bien tren [0;30]?', sgnScan(x => d(C, x), 0, 30)); }
// H7.4.2 vd2 (cu)
{ const L = x => -0.02 * x * x + 35 * x - 4000; const [x, v] = argmax(L, 0, 800); ok('7.4.2b-cu x', x, 800); ok('7.4.2b-cu L', v, 11200); }
// H7.4.3
{ const f = x => x + 10 + 2500 / x; const [x, v] = argmax(f, 0.01, 1000, 2e6, -1); ok('7.4.3a x', x, 50, 0.01); ok('7.4.3a', v, 110); }
{ const f = x => (x ** 3 - 12 * x * x + 60 * x + 486) / x; const [x, v] = argmax(f, 0.01, 100, 2e6, -1); ok('7.4.3b x', x, 9, 0.01); ok('7.4.3b', v, 87); console.log('dau Cbar\'', sgnScan(x => d(f, x), 0.01, 100)); ok('phan tich', 2 * (5 - 9) * (25 + 15 + 27), 2 * 125 - 12 * 25 - 486); }
// H7.4.4
{ const C = n => 200 * n + 192 * (8000 / (30 * n)); const [n, v] = intmax(C, 1, 200, -1); ok('7.4.4a n', n, 16); ok('7.4.4a C', v, 6400); ok('51200/n', 192 * 8000 / 30, 51200); }
{ const C = n => 200 * n + 7.5 * (3000 / n) / 2; const [n, v] = intmax(C, 1, 200, -1); ok('7.4.4b n', n, 8); ok('7.4.4b C', v, 3006.25); ok('C(7)', C(7), 3007.142857, 1e-4); const [nr] = argmax(C, 0.5, 50, 1e6, -1); ok('nghiem thuc', nr, 7.5, 1e-3); }
// H7.5.1
{ const s = t => t ** 3 - 6 * t * t + 9 * t + 2; const v = t => d(s, t), a = t => d(v, t, 1e-4); ok('v(4)', v(4), 9); ok('a(4)', a(4), 12, 1e-2); console.log('dau v', sgnScan(v, 0, 6)); }
{ const s = t => 2 * t ** 3 - 15 * t * t + 36 * t; const v = t => 6 * t * t - 30 * t + 36, a = t => 12 * t - 30; ok("v=s'", d(s, 1.7), v(1.7)); console.log('dau v', sgnScan(v, 0, 4), 'dau v*a', sgnScan(t => v(t) * a(t), 0, 4));
  let dist = 0, N = 400000; for (let i = 0; i < N; i++) dist += Math.abs(s(4 * (i + 1) / N) - s(4 * i / N)); ok('quang duong', dist, 34); }
// H7.5.2
{ const v = t => -3 * t * t + 18 * t + 5; ok("v=s'", d(t => -(t ** 3) + 9 * t * t + 5 * t, 2), v(2)); const [t, m] = argmax(v, 0, 8); ok('7.5.2a t', t, 3, 1e-3); ok('7.5.2a vmax', m, 32); }
{ const s = t => -(t ** 4) / 4 + 2 * t ** 3 + t, v = t => -(t ** 3) + 6 * t * t + 1, a = t => -3 * t * t + 12 * t; ok("v=s'", d(s, 1.3), v(1.3)); ok("a=v'", d(v, 1.3), a(1.3)); const [ta, am] = argmax(a, 0, 6); ok('amax t', ta, 2, 1e-3); ok('amax', am, 12); const [tv, vm] = argmax(v, 0, 6); ok('vmax t', tv, 4, 1e-3); ok('vmax', vm, 33); }
// H7.6.1
{ const f = t => (30 * t + 20) / (t + 4); ok("f'(6)", d(f, 6), 1); ok("f'(16)", d(f, 16), 0.25); }
{ const C = x => 0.01 * x * x + 20 * x + 1500; ok("C'(100)", d(C, 100), 22); ok('C(101)-C(100)', C(101) - C(100), 22.01); ok("C'(500)", d(C, 500), 30); }
// H7.6.2
{ const f = t => 1200 / (1 + Math.exp(4 - t)); const g = t => d(f, t); const [t, m] = argmax(g, 0, 30, 300000); ok('logistic t', t, 4, 1e-3); ok('logistic max', m, 300, 1e-3); ok('f(4)', f(4), 600); console.log("dau g'", sgnScan(t => d(g, t, 1e-3), 0, 10)); }
{ const f = t => 45 * t * t - t ** 3; const g = t => d(f, t); const [t, m] = argmax(g, 0, 25); ok('dich t', t, 15, 1e-3); ok('dich max', m, 675, 1e-3); ok('f(15)', f(15), 6750); ok('g(25)', g(25), 375, 1e-3); console.log('f dong bien?', sgnScan(g, 0, 25)); }
// H7.7.1 — mo phong thoi gian thuc
{ const x = t => 6 + 0.5 * t, y = t => Math.sqrt(100 - x(t) ** 2); ok("thang y'", d(y, 0), -0.375); }
{ const xp = 600, x = t => 8 + xp * t, dd = t => Math.sqrt(x(t) ** 2 + 36); ok("radar d'", d(dd, 0, 1e-7), 480, 1e-3); }
// H7.7.2 — mo phong: V(h)=pi h^3/12; tim h(t) tu V=V0+2t
{ const Vh = h => Math.PI * h ** 3 / 12; const h = V => Math.cbrt(12 * V / Math.PI); const V0 = Vh(4); ok("non h'", d(t => h(V0 + 2 * t), 0), 1 / (2 * Math.PI)); console.log('1/(2pi)=', 1 / (2 * Math.PI)); }
{ const R = 6; // the tich chom cau tinh bang tich phan so (doi chieu cong thuc cho trong de)
  const Vnum = h => { let s = 0, N = 100000; for (let i = 0; i < N; i++) { const z = h * (i + 0.5) / N; const r2 = R * R - (R - z) ** 2; s += Math.PI * r2 * h / N; } return s; };
  const Vf = h => Math.PI * h * h * (3 * R - h) / 3; ok('chom cau cong thuc', Vnum(3), Vf(3), 1e-4);
  const hOf = V => { let lo = 0, hi = R; for (let k = 0; k < 100; k++) { const m = (lo + hi) / 2; Vf(m) < V ? lo = m : hi = m; } return (lo + hi) / 2; };
  const V0 = Vf(3); ok("ban cau h'", d(t => hOf(V0 + 18 * t), 0, 1e-5), 2 / (3 * Math.PI), 1e-5); console.log('2/(3pi)=', 2 / (3 * Math.PI)); }
// H7.8.1
{ const N = t => 8000 * t / (t + 10); ok('N(1e9)', N(1e9), 8000, 1e-2); ok('N(40)', N(40), 6400); console.log('N-8000 dau', sgnScan(t => N(t) - 8000, 0, 1e4)); }
{ const P = t => (40 * t * t + 30) / (2 * t * t + 5); ok('P(inf)', P(1e6), 20, 1e-6); ok('P(sqrt15)', P(Math.sqrt(15)), 18); ok('P=20-70/(..)', P(2.2), 20 - 70 / (2 * 4.84 + 5)); console.log("P' dau", sgnScan(t => d(P, t), 0, 50)); }
// H7.8.2
{ const C = t => (500 * 20 + 25 * t * 30) / (500 + 25 * t); ok('C(inf)', C(1e9), 30, 1e-4); ok('C=30-200/(t+20)', C(7), 30 - 200 / 27); }
{ const Cb = x => (2 * x * x + 10 * x + 300) / x; ok('TCX', Cb(1e6) - (2e6 + 10), 0, 1e-3); console.log('Cb(1e-6)=', Cb(1e-6)); }
// H7.8.3
{ const C = p => 1.5 * p / (100 - p); ok('C50', C(50), 1.5); ok('C90', C(90), 13.5); ok('C99', C(99), 148.5); ok('C80', C(80), 6); ok("C'", d(C, 70), 150 / 900); }
{ const C = p => 8 * p / (100 - p); ok('C90', C(90), 72); ok('C95', C(95), 152); ok("C'90", d(C, 90), 8); ok("C'95", d(C, 95), 32, 1e-3); }
