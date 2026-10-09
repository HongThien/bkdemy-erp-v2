// k5T-kiem-lo6.mjs — hàm kiểm đáp số lô 6 (CĐ7–12), viết TỪ ĐỀ trước khi mở bản soạn (09/10). Gộp vào KIEM ở k5T-kiem.mjs.
// Giá trị trả về là chuỗi, hoặc MẢNG các cách viết tương đương (có một cách khớp là đạt). Số thập phân tính bằng số nguyên (×10^k).
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a))
const F = (n, d = 1) => { const k = g(n, d) || 1; return d < 0 ? [-n / k, -d / k] : [n / k, d / k] }
const C = (...xs) => xs.reduce((s, x) => F(s[0] * x[1] + x[0] * s[1], s[1] * x[1]), [0, 1])
const T = (a, b) => F(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const N = (...xs) => xs.reduce((s, x) => F(s[0] * x[0], s[1] * x[1]), [1, 1])
const D = (a, b) => F(a[0] * b[1], a[1] * b[0])
const p = (t, m) => F(t, m), hs = (n, t, m) => F(n * m + t, m)
const bang = (a, b) => a[0] * b[1] === b[0] * a[1]
const ps = (x) => (x[1] === 1 ? `${x[0]}` : `\\dfrac{${x[0]}}{${x[1]}}`)
const hon = (x) => { const n = Math.floor(x[0] / x[1]), t = x[0] - n * x[1]; return t ? `${n}\\dfrac{${t}}{${x[1]}}` : `${n}` }
const r6 = (v) => Math.round(v * 1e6) / 1e6
const vn = (v) => String(r6(v)).replace('.', ',')
const tpPS = (x) => { const v = x[0] / x[1]; return Math.abs(v * 1e6 - Math.round(v * 1e6)) < 1e-9 ? vn(v) : null }
const PS = (x) => [...new Set([ps(x), hon(x), tpPS(x)].filter(Boolean))]
const tim = (lo, hi, f) => { for (let x = lo; x <= hi; x++) if (f(x)) return x; return null }
const timHet = (lo, hi, f) => { const r = []; for (let x = lo; x <= hi; x++) if (f(x)) r.push(x); return r }
const ds2 = (ds) => [ds.join(';'), ds.join(',')]
const dau = (a, b) => (a < b ? '<' : a > b ? '>' : '=')                // so hai số nguyên (đã quy cùng đơn vị nhỏ)
const motNghiem = (ds, ten) => { if (ds.length !== 1) throw new Error(`${ten}: vét cạn ra ${ds.length} nghiệm`); return ds[0] }
// tính ngược/mô phỏng chia kẹo: mỗi người lần lượt cho mỗi bạn còn lại số bằng số bạn đó đang có (nhân đôi) — tìm số ban đầu bằng vét cạn
const chiaGapDoi = (bd) => { const x = [...bd]; for (let i = 0; i < x.length; i++) for (let j = 0; j < x.length; j++) if (j !== i) { x[i] -= x[j]; x[j] *= 2 } return x }

export const LO6 = {
  // ── CĐ7 hai hiệu số ──
  'VD 7.1': () => { const e = tim(1, 200, (e) => 2 * e + 5 === 3 * e - 5); return [`${e}em`, `${2 * e + 5}`] },
  'LT 7.1': () => { const t = tim(1, 200, (t) => 8 * t + 16 === 10 * t); return [`${10 * t}`, `${t}túi`] },
  'LT 7.2': () => { const h = tim(1, 200, (h) => 3 * h + 54 === 5 * h); return [`${h}`, `${5 * h}`] },
  'LT 7.3': () => { const x = tim(1, 200, (x) => 25 * x === 27 * x - 16); return [`${x}xe`, `${25 * x}`] },
  'LT 7.4': () => { const n = tim(1, 200, (n) => 3000 * n + 30000 === 5000 * n); return [`${n}`, [`${3000 * n}`, `${3000 * n / 1000}nghìn`]] },
  'LT 7.6': () => { const h = tim(1, 200, (h) => 8 * h + 8 === 10 * h - 16); return [`${h}`, `${8 * h + 8}`] },
  'LT 7.7': () => [`${tim(1, 100000, (d) => d * 4 - 3 * 120 === d * 3 + 2 * 120)}`],                 // d/30 − 3 = d/40 + 2 (nhân 120)
  'LT 7.8': () => { const h = tim(1, 200, (h) => 8 * h + 36 === 10 * h + 4); return [`${8 * h + 36}`, `${h}`] },
  'LT 7.9': () => [`${tim(1, 100000, (d) => 6 * d - 5 * d === (5 - 3) * 300)}`],                        // d/50 − d/60 = 2 (nhân 300)
  'LT 7.10': () => { const n = tim(1, 200, (n) => 6 * n + 3 === 5 * n + 15); return [`${n}`, `${6 * n + 3}`] },
  'LT 7.11': () => { const n = tim(1, 200, (n) => 3 * n + 8 === 4 * n + 2); return [`${n}`, `${3 * n + 8}`] },
  'LT 7.12': () => { const L = tim(1, 100000, (L) => L % 480 === 0 && L / 120 - 6 === L / 160 - 2); return [`${L / 120 - 6}`, `${L}`] },
  'LT 7.13': () => { const n = tim(1, 200, (n) => 25 * n - 5 === 30 * n - 45); return [`${25 * n - 5}`] },
  'LT 7.15': () => { const n = tim(1, 200, (n) => 15 * n + 30 === 20 * (n - 2)); return [`${n}`, `${15 * n + 30}`] },
  'LT 7.16': () => { const n = tim(1, 200, (n) => 40000 * n + 160000 === 50000 * (n - 3)); return [`${n}`, [`${40000 * n + 160000}`, `${(40000 * n + 160000) / 1000}nghìn`]] },
  'LT 7.17': () => { const b = tim(1, 200, (b) => 3 * b + 5 === 4 * (b - 1)); return [`${3 * b + 5}`, `${b}`] },
  'LT 7.18': () => [`${tim(2, 200, (n) => 15 * (n + 1) === 20 * (n - 1))}`],
  'LT 7.19': () => { const h = tim(3, 200, (h) => 10 * h + 6 === 12 * (h - 2) + 6); return [`${10 * h + 6}`] },
  'LT 7.20': () => { const n = tim(3, 200, (n) => 6 * n + 4 === 8 * (n - 2) + 6); return [`${n}`, `${6 * n + 4}`] },
  // ── CĐ8 hai tỉ số ──
  'VD 8.1': () => { const b = tim(1, 2000, (b) => b % 35 === 0 && b * 3 / 7 - 48 === b / 5); return [`${b * 3 / 7}`, `${b}`] },
  'VD 8.2': () => { const a = tim(1, 1000, (a) => a % 2 === 0 && 5 * a / 2 > 4 && 2 * (a + 4) === 5 * a / 2 - 4); return [`${a}`, `${5 * a / 2}`] },   // (a+4):(b−4) = 1:2
  'VD 8.3': () => { const a = tim(7, 1000, (a) => a % 2 === 0 && 5 * a / 2 - 6 === 3 * (a - 6)); return [`${a}`, `${5 * a / 2}`] },
  'LT 8.1': () => [`${tim(1, 1000, (b) => b % 4 === 0 && (b / 4 + 12) * 4 === 3 * b)}`],
  'LT 8.2': () => { const n = tim(1, 200, (n) => 3 * n === 2 * (n + 5)); return [`${4 * n}`] },
  'LT 8.4': () => [[`${3 * tim(1, 1e6, (b) => 5 * 3 * b === 3 * (b + 80000))}`, `${3 * tim(1, 1e6, (b) => 5 * 3 * b === 3 * (b + 80000)) / 1000}nghìn`]],
  'LT 8.5': () => [`${tim(1, 1000, (t) => t % 12 === 0 && t / 4 + 6 === t / 3)}`],
  'LT 8.6': () => { const a = tim(1, 1000, (a) => a % 3 === 0 && 3 * (a + 8) === 4 * (a * 4 / 3 - 8)); return [`${a}`, `${a * 4 / 3}`] },
  'LT 8.7': () => { const nam = tim(1, 2000, (n) => 3 * (n + 16) === 2 * (2 * n - 16)); return [`${3 * nam}`] },
  'LT 8.8': () => { const nu = tim(3, 200, (n) => 3 * n + 2 === 5 * (n - 2)); return [`${3 * nu}`, `${nu}`] },
  'LT 8.10': () => { const a = tim(21, 2000, (a) => a % 4 === 0 && a * 5 / 4 + 20 === 5 * (a - 20)); return [`${a}`, `${a * 5 / 4}`] },
  'LT 8.11': () => { const t = tim(1, 2000, (t) => t % 3 === 0 && 11 * (t + 6) === 10 * (t * 4 / 3 - 6)); return [PS(p(t, t * 4 / 3)).concat([`\\dfrac{${t}}{${t * 4 / 3}}`])] },
  'LT 8.12': () => [`${4 * tim(1, 200, (n) => 11 * (n + 5) === 4 * (4 * n))}`],
  'LT 8.13': () => { for (let n = 4; n < 500; n++) for (let g0 = 2; g0 < 500; g0++) if (n - 4 === 2 * (g0 + 4) && n + 2 === 4 * (g0 - 2)) return [`${n}`, `${g0}`]; throw new Error('?') },
  'LT 8.14': () => { for (let a = 4; a < 500; a++) for (let b = 2; b < 500; b++) if (8 * (a + 2) === 5 * (b - 2) && 9 * (a - 4) === 4 * (b + 4)) return [`${a}`, `${b}`]; throw new Error('?') },
  'LT 8.15': () => { const t = tim(5, 2000, (t) => t % 4 === 0 && 5 * (t - 4) === 2 * (t * 9 / 4 - 4)); return [[`\\dfrac{${t}}{${t * 9 / 4}}`]] },
  'LT 8.17': () => [`${tim(1, 200, (h) => h % 15 === 0 && h / 3 - 4 === h / 5)}`],
  'LT 8.18': () => { const nu = tim(5, 2000, (n) => n % 4 === 0 && 12 * (n * 3 / 4 - 4) === 5 * (n * 7 / 4 - 8)); return [`${nu * 7 / 4}`] },
  'LT 8.19': () => { const a = tim(1, 2000, (a) => a % 4 === 0 && 12 * (a + 5) === 5 * (a * 11 / 4 + 5)); return [`${a}`, `${a * 11 / 4}`] },
  'LT 8.20': () => { const c = tim(8, 200, (c) => 5 * (c - 4) - (c - 4) === 8 * (c - 7) - (c - 7)); return [`${c}`] },
  // ── CĐ9 tính ngược ──
  'VD 9.1': () => [`${tim(1, 1e5, (x) => (3 * x - 300) / 5 === 60)}`],
  'VD 9.2': () => [`${tim(1, 1e4, (n) => n % 20 === 0 && (n * 3 / 5) * (1 / 4) === 6)}`],
  'VD 9.3': () => { for (let a = 0; a <= 108; a++) for (let b = 0; a + b <= 108; b++) { const c = 108 - a - b; if (a - 10 === 36 && b + 10 - 8 === 36 && c + 8 === 36) return [`${a}`, `${b}`, `${c}`] } throw new Error('?') },
  'LT 9.1': () => [`${tim(1, 1e5, (x) => (6 * x + 1320) % 4 === 0 && (6 * x + 1320) / 4 - 804 === 720)}`],
  'LT 9.3': () => { const x = D(C(T(p(10, 1), [0, 1]), [0, 1]), [1, 1]); const kq = T(C(N(D(p(10, 1), D(p(4, 7), p(2, 7))), [1, 1]), p(2, 5)), p(1, 15)); return [PS(kq)] },
  'LT 9.4': () => [[`${tim(81, 1e4, (t) => (t - 80) / 2 - 4 === 40)}`, `${tim(81, 1e4, (t) => (t - 80) / 2 - 4 === 40)}nghìn`]],
  'LT 9.5': () => [`${tim(1, 1e4, (x) => x % 4 === 0 && x + x / 2 + 3 * x / 4 + 1 === 244)}`],
  'LT 9.6': () => [`${tim(1, 1e5, (n) => n % 8 === 0 && n * 3 / 4 / 2 === 150)}`],
  'LT 9.7': () => [`${tim(1, 1e4, (n) => n % 7 === 0 && n * 6 / 7 * 5 / 6 * 4 / 5 * 3 / 4 * 2 / 3 / 2 === 4)}`],
  'LT 9.8': () => [`${tim(1, 1e5, (n) => n % 5 === 0 && (n * 3 / 5) * 2 / 3 - 16 === 40)}`],
  'LT 9.9': () => [`${tim(1, 1e5, (s) => { const c1 = s - (s / 3 - 2), c2 = c1 - (c1 / 2 - 3); return s % 3 === 0 && Math.abs(c2 - (c2 * 8 / 9 + 6)) < 1e-9 })}`],
  'LT 9.11': () => { const l = tim(0, 24, (l) => l - 5 + 2 === 24 - l + 5 - 2); return [`${l}`, `${24 - l}`] },
  'LT 9.13': () => { const h = tim(0, 60, (h) => 60 - h + 10 - 4 === 2 * (h - 10 + 4)); return [`${h}`, `${60 - h}`] },
  'LT 9.14': () => { for (let k = 0; k <= 24; k++) for (let h = 0; k + h <= 24; h++) { const b = 24 - k - h; let K = k, H = h, B = b; K -= H; H *= 2; H -= B; B *= 2; B -= K; K *= 2; if (K === 8 && H === 8 && B === 8 && Math.min(k, h, b) >= 0) return [`${k}`, `${h}`, `${b}`] } throw new Error('?') },
  'LT 9.15': () => { for (let a = 0; a <= 210; a++) for (let b = 0; a + b <= 210; b++) { const c = 210 - a - b, A = a - 20, B = b + 20 - 50, Cc = c + 50; if (Cc === 2 * B && B === 2 * A) return [`${a}`, `${b}`, `${c}`] } throw new Error('?') },
  'LT 9.16': () => { for (let a = 0; a <= 120; a++) for (let q = 0; a + q <= 120; q++) { const x = chiaGapDoi([a, q, 120 - a - q]); if (x.every((v) => v === 40)) return [`${a}`, `${q}`, `${120 - a - q}`] } throw new Error('?') },
  'LT 9.17': () => { for (let a = 0; a <= 256; a++) for (let b = 0; a + b <= 256; b++) for (let c = 0; a + b + c <= 256; c++) { const x = chiaGapDoi([a, b, c, 256 - a - b - c]); if (x.every((v) => v === 64)) return [`${a}`, `${b}`, `${c}`, `${256 - a - b - c}`] } throw new Error('?') },
  'LT 9.18': () => { for (let a = 0; a <= 48; a++) { const b = 48 - a; if (a % 3) continue; const a1 = a - a / 3, b1 = b + a / 3; if (b1 % 5) continue; if (a1 + b1 / 5 === 24 && b1 - b1 / 5 === 24) return [`${a}`, `${b}`] } throw new Error('?') },
  'LT 9.19': () => { for (let a = 0; a <= 54; a += 3) for (let b = 0; a + b <= 54; b++) { const c = 54 - a - b; const A1 = a - a / 3, B1 = b + a / 3; if (B1 % 4) continue; const B2 = B1 - B1 / 4, C2 = c + B1 / 4; if (C2 % 10) continue; if (A1 + C2 / 10 === 18 && B2 === 18 && C2 - C2 / 10 === 18) return [`${a}`, `${b}`, `${c}`] } throw new Error('?') },
  // ── CĐ10 số thập phân ──
  'VD 10.3': () => [ds2(timHet(0, 100, (x) => 1308 < x * 1000 && x * 10 < 61))],
  'LT 10.1': () => [p(2, 10), p(78, 1000), p(3, 10000), p(478, 100), p(2025, 1000), hs(2, 34, 100), hs(1, 3, 10), hs(31, 45, 1000), p(3, 5), p(9, 4), hs(18, 7, 8), hs(7, 6, 25)].map((x) => vn(x[0] / x[1])),
  'LT 10.2': () => [['1\\dfrac{4}{10}'], ['10\\dfrac{8}{100}'], ['125\\dfrac{2}{10000}'], ['3003\\dfrac{621}{1000}']],
  'LT 10.3': () => ['\\dfrac{15}{100}', '\\dfrac{56}{1000}', '\\dfrac{2502}{1000}', '\\dfrac{300441}{10000}'],
  'LT 10.4a': () => [vn(9 + 0.2 + 0.02 + 0.009)], 'LT 10.4b': () => [vn(51 + 0.4 + 0.007)], 'LT 10.4c': () => [vn(2 + 0.003)],
  'LT 10.4d': () => [vn(24 + 0.18)], 'LT 10.4e': () => [vn(0.01)], 'LT 10.4f': () => [vn(200 + 8 + 0.02)],
  'LT 10.6a': () => [ds2(timHet(0, 200, (x) => 6 < 10 * x && 10 * x < 15))],
  'LT 10.6b': () => [ds2(timHet(0, 200, (x) => 7832 < 100 * x && 10 * x < 801))],
  'LT 10.6c': () => [ds2(timHet(0, 200, (x) => 56 < 10 * x && 10 * x < 81))],
  'LT 10.6d': () => [ds2(timHet(0, 200, (x) => 1308 < 1000 * x && 10 * x < 61))],
  'LT 10.7a': () => [ds2(timHet(0, 9, (y) => 456202 + 10 * y < 456254))].map((v) => v.map((s) => 'y=' + s)),   // 45,62y2 ×10000 so với 456254
  'LT 10.8a': () => { const m = Math.floor(24.306); return [`m=${m}`, `n=${m + 1}`] },
  'LT 10.8b': () => { const m = Math.floor(10.299); return [`m=${m}`, `n=${m + 1}`] },
  'LT 10.8c': () => { const m = motNghiem(timHet(0, 100, (m) => m * 10 < 313 && 313 < (m + 1) * 10 && (m + 1) * 10 < 321), '10.8c'); return [`m=${m}`, `n=${m + 1}`] },
  'LT 10.8d': () => { const m = motNghiem(timHet(0, 100, (m) => 7499 < m * 100 && m * 100 < 7508 && 7508 < (m + 1) * 100), '10.8d'); return [`m=${m}`, `n=${m + 1}`] },
  // ── CĐ11 đơn vị đo ── (đổi về đơn vị nhỏ nhất bằng số nguyên)
  'LT 11.1': () => [vn((8000 + 600) / 1000) + 'km', vn((20 + 2) / 10) + 'dm', vn((14000 + 4000 / 10 * 1 + 300 / 10) / 100), vn((5000 + 700 + 60) / 100) + 'dm', '13km140m', '6km60m', '2dm2cm2mm', `${10375}m`],
  'LT 11.2': () => [vn((12000 + 102) / 1000) + 'kg', vn((8000 + 400 + 3) / 1000) + 'tấn', '12tấn56yến', '99tạ2yến5kg', vn((4370 + 3) / 1000) + 'tấn', vn((20000 + 5000 + 5) / 10000) + 'yến', '77yến8kg', '32kg70dag6g'],
  'LT 11.4': () => [vn(2 + 15 / 60) + 'giờ', vn(1 + 45 / 60) + 'giờ', `1phút${r6(0.15 * 60)}giây`, vn(4 + 54 / 60) + 'giờ', vn(3 + 36 / 60) + 'giờ', `2giờ${r6(0.55 * 60)}phút`],
  'LT 11.5': () => [dau(124500, 12450), dau(8000, 75000), dau(36, 350), dau(1080, 200), dau(90, 95)],                   // 6 ô; ô cuối "5 hm 80" thiếu đơn vị — không kiểm
  'LT 11.6a': () => { const cm = 213 + 450 - 120; return [[`${Math.floor(cm / 100)}m${cm % 100}cm`, vn(cm / 100) + 'm', `${cm}cm`]] },
  'LT 11.6b': () => { const hg = 23 * 2 - 25; return [[`${Math.floor(hg / 10)}kg${hg % 10}hg`, vn(hg / 10) + 'kg', `${hg}hg`]] },
  'LT 11.6c': () => { const cm2 = 1700 / 4 + 47; return [[`${cm2}\\text{cm}^2`, vn(cm2 / 100) + '\\text{dm}^2', `${cm2}cm^2`, `${cm2}`]] },
  'LT 11.6d': () => [`${15 / 6 * 4}phút`],
  'LT 11.8': () => { const v = 900 * 500 / (50 * 50); return [`${v}`, `${v * 38000}`] },
  'LT 11.9': () => [`${0.8 * 1000 * (0.8 * 1000 * 5 / 8) / 10000}`],
  'LT 11.10': () => [vn((3000 - 900 - 900 * 3 / 2) / 1000)],
  'LT 11.11': () => [`${((46 + 24) * 2 - 2) * 30000}`],
  'LT 11.12': () => { const c = 48 / 4; return [vn(c * c / 2 / 4 * 15 / 100)] },
  // ── CĐ12 phép tính với số thập phân ── (×10000 cho số nguyên)
  'LT 12.1a': () => [dau(55555, 55557)],
  'LT 12.1b': () => { const kq = new Set(); for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) kq.add(dau(1015 + 100 * a + 405 + 10 * b + 580 + c, 100 * a + 10 * b + c + 2000)); return [motNghiem([...kq], '12.1b')] },
  'LT 12.1c': () => { const kq = new Set(); for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) kq.add(dau(100 * a + 48 + 303 + 10 * b + 570 + c, 100 * a + 10 * b + c + 920)); return [motNghiem([...kq], '12.1c')] },
  'LT 12.2a': () => [vn((128 + 65 + 472 + 435) / 100)], 'LT 12.2b': () => [vn((3276 + 5615 - 276 + 1385) / 100)],
  'LT 12.2c': () => [vn((4923 - 2417 + 1077 + 5417) / 100)], 'LT 12.2d': () => [vn(5.6 + 2.75 + 7.125 + 4.25 + 2.875 + 5.4)],
  'LT 12.3a': () => [vn((1310 - 768 + 690 - 232) / 100)], 'LT 12.3b': () => [vn((4137 - 217 + 2156 + 863 - 783 - 156) / 100)],
  'LT 12.3d': () => [vn((4318 + 3764 + 606 - (318 + 764 - 394)) / 100)],
  'LT 12.4a': () => [vn(25 * 2022 * 4 / 1000)], 'LT 12.4b': () => [vn(25 * 125 * 8 * 4 / 1e5)], 'LT 12.4c': () => [vn((957 * 100 - 90300) / 1000)],
  'LT 12.4d': () => [vn((18621 * 1000 + 31379000) / 1e5)], 'LT 12.4e': () => [vn((25 * 84 + 1627) / 100)], 'LT 12.4f': () => [vn((19280 - 1928) / 10)],
  'LT 12.4g': () => [vn((2680 + 3700) / 10000)], 'LT 12.4h': () => [vn((690 + 2310) / 10000)],
  'LT 12.5a': () => [vn(17 * (63 + 37) / 100)], 'LT 12.5b': () => [vn(425 * (67 - 66) / 100)], 'LT 12.5d': () => [vn((8 * 234 * 3 - 24 * 34) / 100)],
  'LT 12.5e': () => [vn((1345 * 467 / 1e5 + 2.1) * ((84 - 12 * 7) / 10))], 'LT 12.5f': () => [vn(1830 * ((12 * 27 + 12 * 73 - 1200) / 100))],
  'LT 12.6a': () => [PS(C(T(hs(1, 1, 6), p(6, 10)), p(16, 30)))], 'LT 12.6b': () => [PS(T(C(p(7, 30), hs(1, 4, 15)), p(8, 10)))],
  'LT 12.6c': () => [PS(T(C(D(hs(2, 2, 5), [2, 1]), p(18, 10)), p(9, 4)))], 'LT 12.6d': () => [PS(T(C(N(p(312, 100), p(1, 2)), N(p(16, 10), p(3, 4))), N(p(36, 10), p(5, 9))))],
  'LT 12.7a': () => [`y=${vn(6 / 0.4)}`], 'LT 12.7b': () => [`y=${vn(105 / 4.2)}`], 'LT 12.7c': () => [`y=${vn((3000 - 159) / 100)}`], 'LT 12.7d': () => [`y=${vn(3.75 / 0.75)}`],
  'LT 12.8a': () => [`y=${tim(1, 1000, (y) => bang(D(p(11, 12), T(p(2, 5), p(1, y))), p(5, 2)))}`],
  'LT 12.8b': () => { for (let q = 1; q <= 30; q++) for (let pp = 1; pp <= 500; pp++) { const y = F(pp, q); if (y[1] === q && bang(D(N(p(3, 2), y), [2, 1]), hs(2, 1, 7))) return [PS(y).map((s) => 'y=' + s)] } throw new Error('?') },
  'LT 12.8c': () => [`y=${vn(81 / 10 - 1.1)}`], 'LT 12.8d': () => [`y=${vn((13 + 2 / 3 - 1 - 2 / 3) * 0.5 - 4)}`],
  'LT 12.9a': () => [`y=${vn(18.9 / 10)}`], 'LT 12.9b': () => [`y=${vn(14.7 / 36.75)}`], 'LT 12.9c': () => [`y=${vn(1.8 / 15)}`],
  'LT 12.9e': () => [`y=${vn(2.5 / 20)}`], 'LT 12.9f': () => [`y=${vn(19.98 / 99.9)}`], 'LT 12.9g': () => [`y=${vn(25.3 / 10)}`], 'LT 12.9h': () => [`y=${vn((10.3 - 10) / 3)}`],
  'LT 12.10b': () => { const ds = []; for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) for (let d = 0; d <= 9; d++) if ((10000 + a * 1000 + b * 10) + (2000 + c * 100 + 96) + (7000 + 20 + d) === 20020) ds.push(`a=${a};b=${b};c=${c};d=${d}`); return [motNghiem(ds, '12.10b')] },
  'LT 12.11a': () => { const ds = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) if ((100 * a + 10 * b + c) * 41 === 15000 + 100 * a + 10 * b + c) ds.push(`a=${a};b=${b};c=${c}`); return [motNghiem(ds, '12.11a')] },
  'LT 12.11b': () => { const ds = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) { const ab = 10 * a + b; if (bang(D(p(101 * ab, 100), p(ab, 10)), p(10 * ab + a, 10))) ds.push(`a=${a};b=${b}`) } return [motNghiem(ds, '12.11b')] },   // ab,ab : a,b = ab,a
  'LT 12.12': () => { const ds = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) for (let d = 1; d <= 9; d++) if ((100 * a + 10 * b + c) * 5 === 100 * d + 10 * a + d) ds.push(vn((100 * a + 10 * b + c) / 100)); return [motNghiem([...new Set(ds)], '12.12')] },
  'LT 12.13': () => { const ds = []; for (let a = 0; a <= 9; a++) for (let b = 1; b <= 9; b++) if ((300 + 10 * a + b) * b === 1600 + 10 * a + b) ds.push(vn((10 * a + b) / 10)); return [motNghiem([...new Set(ds)], '12.13')] },
}
