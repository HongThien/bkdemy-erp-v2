// k5T-kiem-lo9.mjs — hàm kiểm đáp số lô 9 (CĐ26–31), viết TỪ ĐỀ trước khi mở bản soạn (09/10). Gộp vào KIEM ở k5T-kiem.mjs.
// KHÔNG giao soạn (treo cần người): LT 27.1, LT 27.2 (bảng sách đọc lộn) · VD 31.1, VD 31.2 (dòng tiêu đề phương pháp lẫn vào đề) · VD 29.2 (lời giải lẫn trong đề).
// Bài hệ hai/ba đại lượng: dò nghiệm nguyên/thập phân rồi mới so — không giải bằng công thức để khỏi "đúng vì cùng sai".
const r8 = (v) => Math.round(v * 1e8) / 1e8
const vn = (v) => String(r8(v)).replace('.', ',')
const tg = (h, m) => (m ? [`${h}giờ${m}phút`, `${h}giờ${String(m).padStart(2, '0')}phút`] : [`${h}giờ`])
const gio = (t) => { const p = Math.round(t * 60); return [Math.floor(p / 60), p % 60] }                       // giờ thập phân → [giờ, phút]
const luc = (h0, m0, t) => { const p = h0 * 60 + m0 + Math.round(t * 60); return tg(Math.floor(p / 60), p % 60) }  // thời điểm = mốc + t giờ
const do2 = (f, max = 400) => { for (let a = 0; a <= max; a++) for (let b = 0; b <= max; b++) if (f(a, b)) return [a, b]; throw new Error('không có nghiệm') }

export const LO9 = {
  // ── CĐ26 hai động tử ──
  'VD 26.1a': () => [luc(8, 30, 208.5 / (38.6 + 44.8))], 'VD 26.1b': () => [vn(38.6 * 208.5 / (38.6 + 44.8))],
  'VD 26.2': () => { const t = 40 / (60 - 45); return [[...luc(12, 0, t), ...luc(0, 0, t).map((s) => s.replace(/^0giờ/, '2giờ'))], vn(60 * t)] },
  'LT 26.1': () => [`${(54 + 36) * 2}`],
  'LT 26.2': () => [luc(8, 25, 135.8 / (52 + 45))],
  'LT 26.3': () => [luc(6, 30, 150 / 120), vn(55 * 150 / 120)],
  'LT 26.5': () => [`${84 / 2}`, `${(214 - 84) / 2}`],
  'LT 26.6': () => [`${(65 - 45) * 2.5}`],
  'LT 26.7': () => { const [h, m] = gio(8 / 20); return [[`${m}phút`, '0,4giờ']] },
  'LT 26.9': () => { const [a, b] = do2((a, b) => a + b === 114 && (a - b) * 2.5 === 75); return [`${a}`, `${b}`] },
  'LT 26.10': () => { const [a, b] = do2((a, b) => a === 3 * b && (a + b) * 2.25 === 216); return [`${a}`, `${b}`] },
  'LT 26.11': () => [luc(9, 0, 7 / 4), vn(15 * 7 / 4)],
  'LT 26.13': () => { const [a, b] = do2((a, b) => (a + b) * 1.25 === 100 && (a - b) * 5 === 100); return [`${a}`, `${b}`] },
  'LT 26.15': () => [`${60 * 2 + 55 * 1.2}`],
  'LT 26.16': () => [luc(9, 30, (270 - 40 * 1.5) / 90)],
  'LT 26.17': () => [luc(9, 15, 40 * 1.25 / 20)],
  'LT 26.18': () => [`${r8(108 / (1 - 1.5 / 6 - 1.5 / 5))}`],
  'LT 26.19': () => [`${r8(20 / (1 - 2 / 5 - 2 / 4))}`],
  'LT 26.20': () => { const t = 150 / 100; return [[...tg(1, 30), '1,5giờ']] },
  'LT 26.21': () => { for (let p = 1; p < 600; p++) { const t = p / 60; if (Math.abs(80 * t - ((300 - 40 * t) + (300 - 100 * t)) / 2) < 1e-9) return [luc(7, 0, t)] } throw new Error('x') },
  // ── CĐ27 dòng nước ──
  'VD 27.1': () => [`${(40 - 30) / 2}`, `${(40 + 30) / 2}`],
  'VD 27.2': () => [`${(20 + 4) * 1.25}`],
  'LT 27.3': () => [luc(7, 20, 40 / 16)],
  'LT 27.4': () => [`${24 * 50 / 60}`],
  'LT 27.6': () => [`${60 / ((60 / 4 - 60 / 6) / 2)}`],
  // ── CĐ28 tỉ lệ nghịch vận tốc – thời gian ──
  'VD 28.1': () => { for (let s = 1; s < 2000; s++) if (Math.abs(s / 35 - s / 45 - 40 / 60) < 1e-9) return [`${s}`]; throw new Error('x') },
  'VD 28.2': () => { const [a, b] = do2((a, b) => a - b === 18 && a * 5 === b * 7); return [`${a}`, `${b}`, `${a * 5}`] },
  'LT 28.1': () => [`${39 / (19.5 / 1.5)}`],
  'LT 28.2': () => [`${44 * 3 / 66}`],
  'LT 28.3': () => [`${48 * 2 / 3 * 2}`],
  'LT 28.4': () => [vn(100 - 87.5)],
  'LT 28.5': () => [luc(8, 45, 42 * 2.4 / 56)],
  'LT 28.7': () => { for (let s = 1; s < 1000; s++) if (Math.abs(s / 50 + s / 75 - 3.5) < 1e-9) return [`${s}`]; throw new Error('x') },
  'LT 28.8': () => { for (let v = 16; v < 200; v++) if (Math.abs(v * 2 - (v - 15) * 3.2) < 1e-9) return [`${v * 2}`]; throw new Error('x') },
  // ── CĐ29 vận tốc trung bình, xe lửa, vòng tròn ──
  'VD 29.1': () => [vn(2 / (1 / 12 + 1 / 18))],
  'VD 29.3': () => [`${30000 / 60 / 2 - 135}`],
  'LT 29.1': () => [`${(1.5 * 40 + 0.5 * 52) / 2}`],
  'LT 29.3': () => [`${2 / (1 / 12 + 1 / 6)}`],
  'LT 29.4': () => [`${r8(8 / (1 / 3 + 1 / 5))}`],
  'LT 29.5': () => [`${r8((3.5 + 4) / (1 / 3 + 1 / 6))}`],
  'LT 29.6': () => [`${90000 / 3600 * 10}`],
  'LT 29.8': () => [vn(240 / 40 * 3.6 + 14.4)],
  'LT 29.9': () => [`${180 / 12 * 3.6 - 12}`],
  'LT 29.11': () => { const v = (297 - 45) / (35 - 17); return [[`${v}m/giây`, `${v}m/s`, vn(v * 3.6)], `${v * 35 - 297}`] },
  'LT 29.12': () => [vn(2.2 - (6 - 2.2 * 2))],
  'LT 29.13': () => { const s = 2 * 200 * 3.14 / (8 - 6); return [[`${Math.floor(s / 60)}phút${s % 60}giây`, `${s}giây`]] },
  // ── CĐ30 giả thiết tạm ──
  'VD 30.1': () => { const [c, q] = do2((c, q) => c + q === 17 && 10 * c + 3 * q === 100, 17); return [`${c}`, `${q}`] },
  'VD 30.2': () => { const [m, v] = do2((m, v) => m + v === 18 && 4 * m - 2 * v === 12, 18); return [`${m}`, `${v}`] },
  'LT 30.1': () => { const [a, b] = do2((a, b) => a + b === 5 && 16 * a + 29 * b === 119, 5); return [`${a}`, `${b}`] },
  'LT 30.3': () => { const [n, u] = do2((n, u) => n + u === 42 && 3 * n + 4 * u === 144, 42); return [`${n}`, `${u}`] },
  'LT 30.4': () => { for (let t = 0; t <= 55; t++) { const c = 55 - t; if (42000 * t + 60000 * c === 2850000) return [vn(t / 10), vn(c / 10)] } throw new Error('x') },
  'LT 30.5': () => { for (let s = 31; s < 40; s++) if (s % 5 === 0) { const [u, n] = do2((u, n) => u + n === s && 5 * u + 6 * n === 188, s); return [`${n}`, `${u}`] } throw new Error('x') },
  'LT 30.7': () => { const [d] = do2((d, s) => d + s === 45 && 3 * d - 3 * s === 93, 45); return [`${d}`] },
  'LT 30.8': () => { const tran = 7 * 6 / 2; for (let h = 0; h <= tran; h++) if (3 * (tran - h) + 2 * h === 55) return [`${h}`]; throw new Error('x') },
  'LT 30.9': () => { const [x, y] = do2((x, y) => x + y === 52 && 5 * x - 10 * y === 140, 52); return [`${x}`, `${y}`] },
  'LT 30.10': () => { const [a, b] = do2((a, b) => a - b === 25 && 10 * a - 15 * b === 45, 200); return [`${a}`, `${b}`] },
  'LT 30.12': () => { for (let m = 0; m <= 30; m++) for (let a = 0; a + m <= 30; a++) { const b = 30 - m - a; if (2 * m + 4 * (a + b) === 88 && 2 * m + 25 * a + 16 * b === 337) return [`${m}`, `${a}`, `${b}`] } throw new Error('x') },
  'LT 30.13': () => { for (let n = 0; 3 * n <= 24; n++) { const l = 24 - 3 * n; if (8000 * 2 * n + 12000 * n + 25000 * l === 271000) return [`${2 * n}`, `${n}`, `${l}`] } throw new Error('x') },
  'LT 30.14': () => { for (let a = 0; a <= 45; a++) for (let c = 0; a + c <= 45; c++) { const b = 45 - a - c; if (2 * b === a + c && 2 * a + 3 * b + 5 * c === 120) return [`${a}`, `${b}`, `${c}`] } throw new Error('x') },
  // ── CĐ31 khử ── (giá theo nghìn đồng)
  'VD 31.3': () => { const [t, o] = do2((t, o) => 3 * t + 5 * o === 370 && 2 * t - 3 * o === 25, 200); return [`${t}000`, `${o}000`] },
  'LT 31.1': () => { const [c] = do2((c, q) => 2 * c + 3 * q === 185 && 4 * c + 5 * q === 325, 200); return [`${c}000`] },
  'LT 31.3': () => { const [n, d] = do2((n, d) => 65 * n + 30 * d === 280 && 30 * n + 65 * d === 385, 20); return [`${n}`, `${d}`] },
  'LT 31.4': () => { const [b, p] = do2((b, p) => 5 * b === 2 * p && 4 * b + 3 * p === 920, 400); return [`${b}000`, `${p}000`] },
  'LT 31.6': () => { const [s, p] = do2((s, p) => s - p === 165 && 3 * s + 2 * p === 1245, 500); return [`${s}000`, `${p}000`] },
  'LT 31.7': () => { const [s] = do2((s, v) => s - v === 52 && 2 * s - 3 * v === 81, 200); return [`${s}000`] },
  'LT 31.8': () => { const [q, h] = do2((q, h) => 4 * q - 3 * h === 51 && 2 * q - h === 33, 200); return [`${q}`, `${h}`] },
  'LT 31.9': () => { const [v] = do2((v, g) => 4 * v - 2 * g === 56 && 5 * g - 2 * v === 36, 100); return [vn(v / 10)] },
  'LT 31.10': () => { for (let t = 0; t <= 50; t++) for (let b = 0; b <= 50; b++) { const e3 = 45 - 2 * b; if (e3 < 0 || e3 % 3) continue; const e = e3 / 3; if (3 * t + 4 * b + 5 * e === 107 && 6 * t + 8 * b === 144) return [`${t}000`, `${b}000`, `${e}000`] } throw new Error('x') },
}
