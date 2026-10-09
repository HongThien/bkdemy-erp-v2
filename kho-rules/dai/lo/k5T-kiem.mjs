// ============================================================================
// k5T-kiem.mjs — BỘ KIỂM ĐÁP SỐ BẰNG CODE cho các câu 5T (biên bản "kiem-dap-so", cách "code" của cổng ghi ghi-lo.mjs).
//
// Mỗi mục: mã nguồn → hàm TỰ TÍNH LẠI đáp số TỪ ĐỀ (vét cạn / thay ngược / mô phỏng / toạ độ), KHÔNG chép các bước của lời giải.
// Hàm trả mảng giá trị phải có mặt trong `dap_an` sắp ghi (so sau khi chuẩn hoá: bỏ $, khoảng trắng, \dfrac{a}{b} → a/b).
// Câu chưa có hàm ⇒ biên bản "khong_kiem_duoc" (cổng vẫn cho ghi, câu mang cờ — không giả vờ đã kiểm).
// Lô thử S1–S4 (101 câu): hàm chuyển từ 4 bộ kiểm viết lúc giải thử (đều chạy độc lập với lời giải, đã khớp 101/101).
// ============================================================================
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a))
const F = (n, d = 1) => { const k = g(n, d) || 1; return d < 0 ? [-n / k, -d / k] : [n / k, d / k] }
const cong = (a, b) => F(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), tru = (a, b) => F(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const nhan = (a, b) => F(a[0] * b[0], a[1] * b[1]), bangPS = (a, b) => a[0] * b[1] === b[0] * a[1]
const hs = (n, t, m) => F(n * m + t, m)
const ps = (x) => (x[1] === 1 ? `${x[0]}` : `\\dfrac{${x[0]}}{${x[1]}}`)
const honSo = (x) => { const n = Math.floor(x[0] / x[1]), t = x[0] - n * x[1]; return t ? `${n}\\dfrac{${t}}{${x[1]}}` : `${n}` }
const r6 = (x) => Math.round(x * 1e6) / 1e6
const vn = (x) => String(r6(x)).replace('.', ',')                  // số thập phân viết dấu phẩy như đáp án
const tim = (lo, hi, f) => { for (let x = lo; x <= hi; x++) if (f(x)) return x; return null }
const timHet = (lo, hi, f) => { const r = []; for (let x = lo; x <= hi; x++) if (f(x)) r.push(x); return r }
const motNghiem = (ds, ten) => { if (ds.length !== 1) throw new Error(`${ten}: vét cạn ra ${ds.length} nghiệm`); return ds[0] }
const gp = (p) => `${Math.floor(p / 60)}giờ${p % 60}phút`
// hình học: toạ độ thật
const S = (P, Q, R) => Math.abs((Q[0] - P[0]) * (R[1] - P[1]) - (R[0] - P[0]) * (Q[1] - P[1])) / 2
const chia = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]
const tamGiac = (dt) => { const A = [1.3, 7.1], B = [0, 0], C = [9.4, 0]; const k = Math.sqrt(dt / S(A, B, C)); return [A, B, C].map((p) => [p[0] * k, p[1] * k]) }
// sơn mặt: đếm từng khối nhỏ theo số mặt lộ ra ngoài
const demSon = (a, b, c) => { const k = [0, 0, 0, 0]; for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) k[Math.min(3, (x === 0) + (x === a - 1) + (y === 0) + (y === b - 1) + (z === 0) + (z === c - 1))]++; return k }

export const KIEM = {
  // ── LÔ SÁCH 1 (CĐ1–9) ──
  'LT 1.2d': () => [honSo(tru(hs(7, 3, 7), cong(hs(1, 1, 4), hs(3, 3, 7))))],
  'LT 1.4e': () => { for (let q = 1; q <= 20; q++) for (let p = 1; p <= 300; p++) { const Y = F(p, q); if (bangPS(cong(tru(nhan(Y, hs(1, 5, 9)), nhan(Y, [7, 9])), nhan(Y, [5, 9])), [4, 1])) return [`y=${ps(Y)}`] } throw new Error('không tìm được y') },
  'LT 1.6e': () => [2022 * 2024 < 2023 * 2023 ? '\\dfrac{2022}{2023}<\\dfrac{2023}{2024}' : '\\dfrac{2022}{2023}>\\dfrac{2023}{2024}'],
  'LT 2.3': () => { const con = 24 - 24 / 3; return [`${con - con * 5 / 8}`] },
  'LT 2.10': () => [`${tim(1, 2000, (x) => x % 5 === 0 && x - (x * 2 / 5 + 3) === 36)}`],
  'LT 2.20': () => { const a = tim(1, 1000, (x) => 4 * x === 3 * (x + 12)); return [`${2 * a + 12}`] },
  'LT 2.25': () => [`${(8 * 500 / 100) * (5 * 500 / 100)}`],
  'LT 3.4': () => [`${tim(1, 1000, (h) => h / 5 - h / 6 >= 1 - 1e-9)}`],
  'LT 3.10': () => [`${tim(1, 1000, (x) => 5 * x + 3 * x + 30 === 10 * x)}`],
  'LT 4.1b': () => { let s = [0, 1]; for (let k = 1; k <= 35; k += 2) s = cong(s, [2, k * (k + 2)]); return [`B=${ps(s)}`] },
  'LT 4.8b': () => { let s = [0, 1]; for (let d = 5; d <= 1280; d *= 2) s = cong(s, [1, d]); return [`B=${ps(s)}`] },
  'LT 5.1': () => [`${480 / (240 / 16) - 16}`],
  'LT 5.6': () => [`${30 * 12000 / 15000}`],
  'LT 5.14': () => [`${180 / 15 / 6 * 18 * 8}`],
  'LT 6.4': () => { const x3 = (267 + 299) / 2; return [`${tim(1, 3000, (x) => x - (267 + 299 + x3 + x) / 4 === 6)}`] },
  'LT 6.8': () => { const b = tim(0, 46, (b) => (46 - b + 10) - (b - 10) === 4); return [`${b}`, `${46 - b}`] },
  'LT 6.15': () => [`${tim(0, 100, (n) => 34 + n === 4 * (7 + n))}`],
  'LT 6.17': () => { const m = tim(1, 55, (m) => 3 * m * 2 === (55 - m) * 5); return [`${m}`, `${55 - m}`] },
  'LT 7.5': () => { const e = tim(1, 100, (e) => 4 * e + 7 === 6 * e - 5); return [`${e}em`, `${4 * e + 7}`] },
  'LT 7.14': () => { const b = tim(1, 100, (b) => 3 * b + 6 === 4 * (b - 2)); return [`${3 * b + 6}`, `${b}bàn`] },
  'LT 8.3': () => { const d = tim(1, 1000, (d) => d % 9 === 0 && d / 3 + 24 === d * 7 / 9); return [`${d / 3}`, `${d}`] },
  'LT 8.9': () => { const l = tim(1, 1000, (l) => l % 3 === 0 && 7 * (l * 2 / 3 - 6) === 3 * (l + 6)); return [`${l * 2 / 3}`, `${l}`] },
  'LT 8.16': () => { const c = tim(5, 100, (c) => 4 * c - 4 === 7 * (c - 4)); return [`${c}`, `${4 * c}`] },
  'LT 9.2': () => [`${tim(103, 100000, (x) => (x - 102) % 11 === 0 && ((x - 102) / 11 + 26) * 25 === 2025)}`],
  'LT 9.10': () => [`${tim(1, 5000, (n) => { const r1 = n - (n / 5 + 16), r2 = r1 - (r1 * 3 / 10 + 20); return n % 5 === 0 && Math.abs(r2 - (r2 * 3 / 4 + 30)) < 1e-9 })}`],
  'LT 9.12': () => { for (let a = 0; a <= 36; a++) for (let b = 0; a + b <= 36; b++) { const c = 36 - a - b; if (a + 6 - 6 === 12 && b + 6 - 4 === 12 && c - 6 + 4 === 12) return [`${a}`, `${b}`, `${c}`] } throw new Error('không tìm được') },
  // ── LÔ SÁCH 2 (CĐ10–17) ──
  'LT 10.5': () => [timHet(0, 1000, (k) => k / 1000 > 0.00565 && k / 1000 < 0.01).map((k) => vn(k / 1000)).join(';')],
  'LT 10.7b': () => [`y=${timHet(0, 9, (y) => 5700 + y * 10 + 7 > 5726 && 5700 + y * 10 + 7 < 5755).join(';')}`],
  'LT 10.12': () => { const s = new Set(); for (const a of [1, 2, 3, 4]) for (const b of [1, 2, 3, 4]) for (const c of [1, 2, 3, 4]) for (const d of [1, 2, 3, 4]) if (new Set([a, b, c, d]).size === 4) s.add(`${a}${b}${c}${d}`); return [`${s.size}`] },
  'LT 11.3': () => [vn(23694 / 1e4), vn(2304 / 100), vn(2 + 45 / 1e4), vn(5 + 437 / 1e4), `4\\text{m}^212\\text{dm}^2`, `21\\text{km}^2${r6((21.32 - 21) * 1e4)}\\text{dam}^2`],
  'LT 11.7': () => { const dai = 160 / 8 * 5, rong = 160 - dai; return [vn(dai * rong * (200 / 500) / 1000) + 'tấn'] },
  'LT 11.13': () => [vn(120 * 4 / 100)],
  'LT 12.3c': () => [`c=${(3725 + 4842 + 5473 - (725 + 842 + 473)) / 100}`],
  'LT 12.5c': () => [vn(0.6 * 31.17 * 6 + 3 * 18.83 * 1.2)],
  'LT 12.9d': () => [`y=${vn(tim(1, 100000, (k) => Math.abs(k / 1000 / 0.4 - k / 1000 / 0.5 - 1.2) < 1e-9) / 1000)}`],
  'LT 12.10a': () => { const ds = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) if ((a * 100 + 32) + (c * 10 + 7) + (100 + b) === 245) ds.push(`a=${a};b=${b};c=${c}`); return [motNghiem(ds, '12.10a')] },
  'LT 13.4': () => { let n = 0, s = 0; for (let k = 24; k <= 120; k += 3) { n++; s += k } return [`${n}`, vn(s / 10)] },
  'LT 13.10': () => { const nu = tim(1, 256, (x) => x / (256 - x) === 0.6); return [`${256 - nu}`, `${nu}`] },
  'LT 13.24': () => [vn(tim(1, 1e6, (k) => k - k / 10 === 18540) / 1000)],
  'LT 13.41': () => { const t = tim(0, 260, (t) => t + (2598 - t * 10) === 375); return [`${t}`, vn((2598 - t * 10) / 10)] },
  'LT 14.1': () => [0.39, 1.28, 0.308, 16 / 50, 5 / 8, 1 + 3 / 125, 27 / 12].map((x) => vn(x * 100) + '\\%'),
  'LT 14.6b': () => [vn(5.5 - 0.2 + 1.2 * 0.25)],
  'LT 14.11': () => { const t = tim(1, 48, (t) => t % 4 === 0 && t - t / 4 === 48 - t + t / 4); return [`${t}`, `${48 - t}`] },
  'LT 15.3': () => [vn(100 / 80 * 100) + '\\%', vn(100 / 80 * 100 - 100) + '\\%'],
  'LT 15.13': () => { const con = 200 - 200 * 0.25; return [`${con - con * 0.6}`] },
  'LT 15.18': () => [`${70 / 0.35 / 100}tạ`],
  'LT 16.2': () => [vn(500 * 0.024 / 400 * 100) + '\\%'],
  'LT 16.7': () => [vn((700 * 0.12 - 300 * 0.08) / 400 * 100) + '\\%'],
  'LT 16.14': () => [vn(60 * 0.2 / 0.8)],
  'LT 17.6': () => [vn(100 - 125 * 75 / 100) + '\\%'],
  'LT 17.12': () => [vn(100 - 100 / 1.6) + '\\%'],
  'LT 17.20': () => [vn(3 / 8 * 140 + 5 / 8 * 90 - 100) + '\\%'],
  // ── LÔ SÁCH 3 (CĐ18–24) ──
  'LT 18.4': () => [vn(105.6 * 2 / 16)],
  'LT 18.8': () => { const day = (32 + 8) / 2; return [`${day * (32 - day) / 2}`] },
  'LT 18.13': () => { const h = 30 * 2 / 5; return [`${h * 7 / 4 * h / 2}`] },
  'LT 18.16': () => [`${(54 * 2 / 9) * (9 / 3 * 2) / 2}`],
  'LT 19.8': () => { const [A, B, C] = tamGiac(96); return [vn(S(A, chia(B, C, 1 / 3), C))] },
  'LT 19.12': () => { const [A, B, C] = tamGiac(1); return [vn(5 / S(C, chia(B, C, 1 / 2), chia(C, A, 1 / 3)))] },
  'LT 19.16': () => { const [A, B, C] = tamGiac(150); return [vn(S(A, chia(A, C, 2 / 3), chia(A, B, 1 / 2)))] },
  'LT 19.25': () => { const [A, B, C] = tamGiac(48); return [vn(S(chia(A, chia(B, C, 0.37), 1 / 2), B, C))] },
  'LT 20.6': () => { const t = 135 * 2 / 12; return [vn(t / 5 * 2), vn(t / 5 * 3)] },
  'LT 20.10': () => [vn((9 + 16) * (37.8 * 2 / 9) / 2)],
  'LT 20.12': () => [vn(49 * (144.5 * 2 / 17) / 2)],
  'LT 21.3b': () => [vn((25.12 / 3.14 / 2) ** 2 * 3.14)],
  'LT 21.7': () => [vn((6 * 2 / 2 / 2) ** 2 * 3.14)],
  'LT 21.9': () => { const h = 6.908 / 3.14 / 2, R = (3.9 + h) / 2, rb = 3.9 - R; return [vn(R * R * 3.14), vn(rb * rb * 3.14)] },
  'LT 22.5': () => { const dai = tim(3, 100, (d) => d * 3 / 4 === d - 2), rong = dai - 2, stp = (dai + rong) * 2 * 2 + dai * rong * 2; return [`${stp}`, `${stp * 3 / 4}`] },
  'LT 22.25': () => { const a = Math.sqrt(98 / 2); return [`${a ** 3}`] },
  'LT 22.28': () => [vn(50 * 20 * (30 * 5 / 6 - 30 * 4 / 5))],
  'LT 23.6': () => [`${(Math.sqrt(256 / 4) / 2) ** 3}`],
  'LT 23.10b': () => [`${Math.floor(80 / 4) * Math.floor(40 / 4) * Math.floor(30 / 4)}`],
  'LT 23.13': () => {
    const n = Math.sqrt(294 / 6), co = new Set()
    for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) co.add(`${x},${y},${z}`)
    for (const x of [0, n - 1]) for (const y of [0, n - 1]) for (const z of [0, n - 1]) co.delete(`${x},${y},${z}`)
    let mat = 0; for (const k of co) { const [x, y, z] = k.split(',').map(Number); for (const [a, b, c] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) if (!co.has(`${x + a},${y + b},${z + c}`)) mat++ }
    return [`${mat}`]
  },
  'LT 24.1': () => { const k = demSon(6, 6, 6); return [`${k[2]}`, `${k[1]}`] },
  'LT 24.6': () => { const a = tim(3, 60, (a) => demSon(a, a, a)[2] === 180); return [`${a * a * 6}`] },
  'LT 24.9': () => [`${demSon(25, 15, 10)[0]}`],
  // ── LÔ SÁCH 4 (CĐ25–31 + Ôn tập) ──
  'LT 25.5': () => [`${36000 / 3600}m/giây`, `${5 * 3600 / 1000}km/giờ`, `${54000 / 3600}m/giây`, `${vn(21 * 3600 / 1000)}km/giờ`, `${42000 / 60}m/phút`, `${200 * 60 / 1000}km/giờ`],
  'LT 25.7': () => [`${154 / (((8 * 60 + 35) - 6 * 60 - 15) / 60)}`],
  'LT 25.12': () => [gp(7 * 60 + 45 + 40 / 50 * 60 + 45 + 63 / 45 * 60)],
  'LT 26.4': () => { const p = tim(0, 10000, (p) => 100 * p / 60 >= 240); return [gp(7 * 60 + p), `${45 * p / 60}`] },
  'LT 26.8': () => [gp(tim(0, 10000, (p) => 50 * p / 60 >= 40 + 20 * p / 60))],
  'LT 26.12': () => { for (let a = 1; a <= 80; a++) for (let b = 1; b < a; b++) if ((a + b) * 2 === 80 && (a - b) * 8 === 80) return [`${a}`, `${b}`]; throw new Error('không tìm được') },
  'LT 26.14': () => { const p = tim(0, 10000, (p) => 30 * p / 60 + 35 * Math.max(0, p - 60) / 60 >= 186); return [gp(7 * 60 + p), `${30 * p / 60}`] },
  'LT 27.5': () => [vn((30 / 1.5 + 30 / 2) / 2)],
  'LT 27.7': () => [`${r6(1 / ((1 / 10 - 1 / 15) / 2))}`],
  'LT 28.6': () => [`${tim(8, 300, (v) => (v - 7) * 3 === v * 2.5)}`],
  'LT 28.9': () => [`${motNghiem(timHet(1, 2000, (s) => r6(s - s * 60 / 70) === 30), '28.9')}`],
  'LT 29.2': () => [`${r6(160 / (80 / 60 + 80 / 90))}`],
  'LT 29.7': () => [`${72 * 1000 / 3600 * 50 - 800}`],
  'LT 29.10': () => { const v = 480 / (50 - 20); return [vn(v * 3.6), `${v}`, `${v * 20}`] },
  'LT 30.2': () => { const k = tim(0, 14, (k) => 6 * k + 4 * (14 - k) === 68); return [`${14 - k}`, `${k}`] },
  'LT 30.6': () => [`${tim(0, 30, (k) => 3 * k - 3 * (30 - k) === 66)}`],
  'LT 30.11': () => { const o = tim(0, 100, (k) => 4 * k + 2 * (k + 12) === 192); return [`${o}`, `${o + 12}`] },
  'LT 31.2': () => { for (let m = 1; m <= 224; m++) for (let c = 1; c <= 224; c++) if (5 * m + 7 * c === 224 && 4 * m + 9 * c === 220) return [`${m * 1000}`, `${c * 1000}`]; throw new Error('không tìm được') },
  'LT 31.5': () => [`${tim(0, 200, (m) => 5 * (m + 29) + 7 * m === 181)}`],
  'ON 7': () => { let n = 0; for (let k = 1; k <= 330; k++) n += String(k).length; return [`${n}`] },
  'ON 13': () => [`${motNghiem(timHet(0, 9, (x) => (6950 + x) % 2 === 1 && (6950 + x) % 9 === 2), 'ON 13')}`],
  'ON 19': () => [`${tim(1, 100000, (n) => n % 3 === 2 && n % 4 === 3 && n % 5 === 4 && n % 7 === 6)}`],
  'ON 22': () => [`${tim(10, 99, (a) => a * 10 + 8 - a === 521)}`],
  'ON 37': () => [`${tim(1, 200, (t) => 27 * (t + 10) + 35 * t === 30 * (2 * t + 10)) + 10}`],
  'ON 116': () => { let mx = 0; const dq = (i, tong, doi) => { if (i === 3) { if (!doi && tong > mx) mx = tong; return } for (let t = 0; t <= 3; t++) for (let p = 0; p <= 3; p++) dq(i + 1, tong + t + p, doi || (t > 0 && p > 0)) }; dq(0, 0, false); return [`${mx + 1}`] },
  'ON 124': () => {
    const kq = []; for (let d = 0; d < 7; d++) { const chi = (d + 6) % 7 === 0, han = (d + 1) % 7 === 5, dung = [d !== 3, chi, han, !chi && !han]; if (dung.filter(Boolean).length === 1) kq.push(['phong', 'chi', 'hân', 'mai'][dung.indexOf(true)]) }
    return [motNghiem(kq, 'ON 124')]
  },
}

/** Chuẩn hoá để so giá trị máy tính với chuỗi đáp án: bỏ $, khoảng trắng, \dfrac{a}{b} → a/b, \  ; về dạng thường. */
export const chuanDapAn = (s) => String(s).replace(/\\d?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/\$|\\ |\\,|\s+/g, '').replace(/\\left|\\right/g, '').toLowerCase()

/** Chạy kiểm một câu: trả { ket_qua: 'dat'|'khong_dat'|'khong_kiem_duoc', ghi_chu }. */
export function kiemDapSo(maNguon, dapAn) {
  const f = KIEM[maNguon]
  if (!f) return { ket_qua: 'khong_kiem_duoc', ghi_chu: 'chưa có hàm kiểm cho câu này' }
  let can
  try { can = f() } catch (e) { return { ket_qua: 'khong_dat', ghi_chu: `hàm kiểm lỗi: ${e.message}` } }
  const da = chuanDapAn(dapAn)
  const thieu = can.filter((v) => !da.includes(chuanDapAn(v)))
  return thieu.length
    ? { ket_qua: 'khong_dat', ghi_chu: `máy tính ra ${can.join(' ; ')} — đáp án thiếu/khác: ${thieu.join(' ; ')}` }
    : { ket_qua: 'dat', ghi_chu: `máy tự tính lại từ đề: ${can.join(' ; ')}` }
}
