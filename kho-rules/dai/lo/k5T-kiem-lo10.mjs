// k5T-kiem-lo10.mjs — hàm kiểm đáp số lô 10 (Ôn tập I–XIII), viết TỪ ĐỀ trước khi mở bản soạn (09/10). Gộp vào KIEM ở k5T-kiem.mjs.
// Không có hàm: ON 79 ("tỉ số phần trăm số HS nam và số HS nữ" — hiểu nam:nữ = 125% hay mỗi loại so với cả lớp, soát tay) ·
// ON 94 (ý b hỏi CF mà đề không có điểm F — cần hình, không giao soạn).
// Bài "Tính A=…, B=…" không đánh nhãn a) b) (ON 1, 2, 3, 10, 11) là MỘT câu ⇒ hàm trả mọi giá trị, dạng "A=…".
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a))
const ps = (t, m) => { const k = g(t, m); t /= k; m /= k; return m === 1 ? `${t}` : `\\dfrac{${t}}{${m}}` }
const hon = (t, m) => { const k = g(t, m); t /= k; m /= k; const n = Math.floor(t / m), r = t % m; return r ? (n ? `${n}\\dfrac{${r}}{${m}}` : `\\dfrac{${r}}{${m}}`) : `${n}` }
const r8 = (v) => Math.round(v * 1e8) / 1e8
const vn = (v) => String(r8(v)).replace('.', ',')
const PS = (t, m) => [...new Set([ps(t, m), hon(t, m)])]
const tim = (lo, hi, f) => { for (let x = lo; x <= hi; x++) if (f(x)) return x; throw new Error('không có nghiệm') }
const timHet = (lo, hi, f) => { const o = []; for (let x = lo; x <= hi; x++) if (f(x)) o.push(x); return o }
const tg = (h, m) => [`${h}giờ${m}phút`, `${h}giờ`]
const gan = (chu, v) => (Array.isArray(v) ? v.map((x) => `${chu}=${x}`) : [`${chu}=${v}`])

export const LO10 = {
  // ── I. Tính toán ──
  'ON 1': () => [gan('A', '54,73'), gan('B', '15'), gan('C', '86,8'), gan('D', '105,25'), gan('E', '2'), gan('F', '60'), gan('G', '350'), gan('H', '412000'), gan('I', '2023')],
  'ON 2': () => [gan('A', '3'), gan('B', '0'), gan('C', '0'), gan('D', '0')],
  'ON 3': () => [gan('A', '1'), gan('B', '3'), gan('C', PS(37, 6)), gan('D', ['0,325', ...PS(13, 40)])],
  'ON 4a': () => ['y=0,4'], 'ON 4b': () => ['y=92069'], 'ON 4c': () => [gan('y', PS(17, 20))], 'ON 4d': () => ['y=27'], 'ON 4e': () => ['y=105'], 'ON 4f': () => ['y=100'],
  // ── II. Dãy số ──
  'ON 5a': () => ['17', '20', '23'], 'ON 5b': () => ['632'], 'ON 5c': () => ['2024', '675'], 'ON 5d': () => ['15050'],
  'ON 6a': () => ['100'], 'ON 6b': () => ['50,5'],
  'ON 8a': () => [`${(85 + 194) * 110 / 2}`], 'ON 8b': () => [`${(1 + 355) * 60 / 2}`],
  'ON 9a': () => [`${7 + 49 * 3}`], 'ON 9b': () => [`${2 + 49 * 50 / 2}`], 'ON 9c': () => ['2500'],
  'ON 10': () => [gan('A', PS(63, 64)), gan('B', PS(3280, 6561)), gan('C', PS(2021, 2022)), gan('D', PS(2020, 2021))],
  'ON 11': () => [gan('M', PS(100, 51)), gan('N', PS(10, 23)), gan('P', [hon(45 * 512 + 511, 512), ps(45 * 512 + 511, 512)]), gan('Q', PS(42, 43))],
  // ── III. Chia hết ──
  'ON 12a': () => { const a = timHet(0, 9, (a) => (13 + a) % 3 === 0); return [...a.map((x) => `a=${x}`), 'b=0'] },
  'ON 12b': () => [`a=${tim(0, 9, (a) => (4 + 2 * a) % 9 === 0)}`, 'b=0'],
  'ON 12c': () => [`a=${tim(0, 9, (a) => (25 + a) % 9 === 0)}`, 'b=8'],
  'ON 12d': () => { const c = []; for (let b = 0; b <= 9; b++) for (let a = 0; a <= 9; a++) if ((40 + b) % 4 === 0 && (13 + a + b) % 9 === 0) c.push([a, b]); return c.map(([a, b]) => [`a=${a};b=${b}`, `a=${a},b=${b}`, `${a}`]) },
  'ON 14': () => { const n = timHet(1, 9, (a) => (a * 10000 + 2760 + 2) % 9 === 0).map((a) => a * 10000 + 2762); return n.map(String) },
  'ON 15a': () => { const o = []; for (const a of [2, 7, 9]) for (const b of [0, 2, 7, 9]) for (const c of [0, 2, 7, 9]) if (new Set([a, b, c]).size === 3 && (100 * a + 10 * b + c) % 6 === 0) o.push(100 * a + 10 * b + c); return o.map(String) },
  'ON 15b': () => { const o = []; for (const a of [2, 7, 9]) for (const b of [0, 2, 7, 9]) for (const c of [0, 2, 7, 9]) if (new Set([a, b, c]).size === 3 && (100 * a + 10 * b + c) % 15 === 0) o.push(100 * a + 10 * b + c); return o.map(String) },
  'ON 16': () => [`${timHet(10, 99, (x) => x % 15 === 0).length}`],
  'ON 17': () => [`${timHet(10, 99, (x) => x % 3 !== 0).length}`],
  'ON 18': () => [`${tim(2, 10000, (x) => [3, 4, 5, 7].every((d) => x % d === 1))}`],
  'ON 20': () => { const t = [15, 16, 18, 19, 20, 31], s = t.reduce((a, b) => a + b); return [`${t.find((x) => (s - x) % 3 === 0)}`] },
  'ON 21': () => { const r = [45, 56, 60, 66, 75, 85, 92], s = r.reduce((a, b) => a + b), con = r.find((x) => (s - x) % 4 === 0), ga = (s - con) / 4 + con; return [`${ga}`, `${s - ga}`] },
  // ── IV. Cấu tạo số ──
  'ON 23': () => [`${tim(10, 99, (x) => 500 + x === 26 * x)}`],
  'ON 24': () => { for (let x = 10; x <= 99; x++) for (let d = 1; d <= 9; d++) if (100 * d + x === 7 * x) return [`${x}`, `${d}`]; throw new Error('x') },
  'ON 25': () => [`${tim(10, 99, (x) => 100 * Math.floor(x / 10) + (x % 10) === 7 * x)}`],
  'ON 26': () => timHet(10, 99, (x) => { const s = Math.floor(x / 10) + (x % 10); return x === 7 * s + 6 && 6 < s }).map(String),
  'ON 27': () => [`${tim(10, 99, (x) => { const m = 100 * Math.floor(x / 10) + 20 + (x % 10); return m === 7 * x + 26 && 26 < x })}`],
  'ON 28a': () => { const n = tim(100, 999, (x) => 10 * x + 2 === x + 4016); return [`a=${Math.floor(n / 100)}`, `b=${Math.floor(n / 10) % 10}`, `c=${n % 10}`] },
  'ON 28b': () => { const n = tim(10, 99, (x) => 7 * x === 300 + x); return [`a=${Math.floor(n / 10)}`, `b=${n % 10}`] },
  'ON 28c': () => { const n = tim(0, 99, (x) => 600 + x === 5 * (100 + x)); return [`a=${Math.floor(n / 10)}`, `b=${n % 10}`] },
  'ON 28d': () => { for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) if (Math.abs(101 * a + 10 * b + b / 10 + a + b / 10 - 142.8) < 1e-9) return [`a=${a}`, `b=${b}`]; throw new Error('x') },
  'ON 29': () => [`${tim(1000, 9999, (n) => n + Math.floor(n / 10) + Math.floor(n / 100) + Math.floor(n / 1000) === 3132)}`],
  // ── V. Trung bình cộng ──
  'ON 30': () => [`${(65 * 3 + 80 * 2) / 5}`],
  'ON 31': () => [`${154 * 3 - 158 * 2}`],
  'ON 32': () => ['54'],
  'ON 33': () => ['2019', '2021', '2023', '2025', '2027', '2029'],
  'ON 34': () => [vn((12 + 15 + 1.2) / 2 + 1.2)],
  'ON 35': () => [`${(120 + 78 - 16) / 2 - 16}`],
  'ON 36': () => { const tbc = (320 + 450 + 370 - 120) / 3; return [[`${tbc * 4}000`, `${tbc * 4}nghìn`]] },
  // ── VI. Tổng – hiệu – tỉ ──
  'ON 38': () => [vn((185 + 15.6) / 2), vn((185 - 15.6) / 2)],
  'ON 39': () => { const nam = (140 - 8) / 2; return [`${nam + 8 - 12}`, `${nam}`] },
  'ON 40': () => [`${tim(0, 100, (n) => 36 + n === 4 * (6 + n))}`],
  'ON 41': () => [`${(240 - 12) / 2}`, `${(240 + 12) / 2}`],
  'ON 42': () => { const x = tim(0, 137, (x) => 4 * (x + 3) === 137 - x); return [`${x}`, `${137 - x}`] },
  'ON 43': () => [vn(117.45 / 0.9)],
  'ON 44': () => { const nu = tim(0, 234, (n) => 5 * n === 8 * (234 - n)); return [`${234 - nu}`, `${nu}`] },
  'ON 45': () => ['48', '40'],
  'ON 46': () => { const be = tim(1, 368, (b) => 10 * b + 8 === 368 && 8 < b); return [`${be}`, `${368 - be}`] },
  'ON 47': () => { const p = 1890 / 14; return [`${2 * p}`, `${3 * p}`, `${9 * p}`] },
  'ON 48': () => { for (let a = 0; a < 300; a++) for (let b = 0; b < 300; b++) if (a - 6 === b + 6 && 3 * (b - 6) === a + 6) return [`${a}`, `${b}`]; throw new Error('x') },
  // ── VII. Ba bài toán phân số ──
  'ON 49': () => [`${80 + 48 + 60}`],
  'ON 50': () => [`${392 - 168 - 140}`],
  'ON 51': () => [`${300 - 120 - 60}`],
  'ON 52': () => [`${(300 - 60 - 45) / 5 * 3}`],
  'ON 53': () => ['40'],
  'ON 54': () => ['180'],
  'ON 55': () => ['1125'],
  'ON 56': () => { const t = tim(3, 3000, (t) => { if (t % 3) return false; const a = t / 3 + 8, r = t - a; return r % 3 === 0 && r - (r / 3 + 24) === 96 }); return [`${t / 3 + 8}`] },
  // ── VIII. Hai tỉ số ──
  'ON 57': () => { const x = tim(1, 2000, (x) => x % 35 === 0 && 7 * (x * 2 / 5 + 24) === 4 * x); return [`${x + x * 2 / 5}`] },
  'ON 58': () => { const t = tim(1, 2000, (t) => t % 7 === 0 && 3 * (t * 2 / 7 + 16) === 4 * (t * 5 / 7 - 16)); return [`${t * 2 / 7}`, `${t * 5 / 7}`] },
  'ON 59': () => { const k = tim(1, 200, (k) => 3 * (7 * k + 27) === 2 * (15 * k + 27)); return [[`\\dfrac{${7 * k}}{${15 * k}}`, `${7 * k}/${15 * k}`]] },  // phân số CHƯA rút gọn mới là đáp số
  'ON 60': () => { const con = tim(1, 200, (c) => Math.abs(2.2 * c - 25 - 8.2 * (c - 25)) < 1e-9); const h = 2.2 * con - con; return [`${r8(h / 2)}`] },
  // ── IX. Hai hiệu số ──
  'ON 61': () => { const e = tim(1, 100, (e) => 5 * e + 2 === 7 * e - 4); return [`${5 * e + 2}`, `${e}`] },
  'ON 62': () => { const e = tim(1, 100, (e) => 5 * e + 60 === 7 * e + 2); return [`${5 * e + 60}`, `${e}`] },
  'ON 63': () => { const d = tim(1, 100, (d) => 48 * d + 69 === 56 * d + 13); return [`${48 * d + 69}`] },
  'ON 64': () => { const b = tim(1, 100, (b) => 3 * b + 5 === 4 * (b - 1)); return [`${3 * b + 5}`, `${b}`] },
  'ON 65': () => { const p = tim(3, 100, (p) => 16 * p + 4 === 20 * (p - 2)); return [`${16 * p + 4}`] },
  // ── X. Tỉ lệ, công việc chung ──
  'ON 66': () => ['200000'], 'ON 67': () => [`${40 * 28 / 16 - 40}`],
  'ON 68': () => [[...tg(5 + 42 * 24 / 21, 0), `${5 + 42 * 24 / 21}`]],
  'ON 69': () => [`${30 * 360 / 540}`], 'ON 70': () => ['3'], 'ON 71': () => [`${17 * 10 * 36 / 45}`],
  'ON 72': () => [['2giờ', '2']], 'ON 73': () => [['1giờ']], 'ON 74': () => [['6giờ']], 'ON 75': () => [['15giờ']],
  'ON 76': () => [['60phút', '1giờ']], 'ON 77': () => [['6giờ']], 'ON 78': () => [['12giờ']],
  // ── XI. Tỉ số phần trăm ──
  'ON 80': () => ['20000'],
  'ON 81': () => [`${75 * 28 / 100}`, `${75 * 48 / 100}`],
  'ON 82': () => ['9', '12', '4'],
  'ON 83': () => ['13,6\\%'],
  'ON 84': () => ['30\\%'],
  'ON 85': () => ['10100250'],
  'ON 86': () => ['180000'],
  'ON 87': () => ['3,92\\%'],
  'ON 88': () => ['50'],
  'ON 89': () => ['20'],
  // ── XII. Hình học ──
  'ON 103': () => ['26', '46'],
  'ON 104': () => ['1272', '3024'],
  'ON 105': () => ['1440'],
  'ON 106': () => [`${r8((10.5 * 4 + 2 * (10.5 + 4) * 2.5) / 0.25)}`],
  'ON 107': () => ['1,24'],
  'ON 108': () => ['729'],
  'ON 109': () => ['90'],
  'ON 110': () => ['8', '36', '54', '27'],
  'ON 111': () => ['864'],
  // ── XIII. Tư duy ──
  'ON 112': () => [`${15 + 9 + 1}`],
  'ON 113': () => [`${3 * 2 + 1}`],
  'ON 114': () => [`${11 + 9 + 7 + 4 + 1}`],
  'ON 115': () => [`${4 * 3 / 2 + 1}`],
  'ON 117': () => [`${2 * 2 + 4 * 2 + 5 + 1}`],
  'ON 118': () => [`${7 * 2 + 6 + 4 + 1}`],
  'ON 122': () => [['Văn dạy Anh', 'Văn dạy môn Anh', 'Văn: Anh'], ['Toán dạy Văn', 'Toán dạy môn Văn', 'Toán: Văn'], ['Anh dạy Toán', 'Anh dạy môn Toán', 'Anh: Toán']],
  'ON 123': () => [['luật sư'], ['Mỹ']],
  'ON 125': () => [['Cường']],
}
// ON 94 (09/10): hình có F thật ra bị tach-bai gắn nhầm sang ON 93 ⇒ vá ảnh, đưa vào lô bài có hình. F = giao DE với tia BC; Menelaus ⇒ BF = 2 CF ⇒ BC = CF
LO10['ON 94a'] = () => ['30']
LO10['ON 94b'] = () => [['bc/cf=1', 'bc=cf', 'bc:cf=1', 'cf=bc']]
