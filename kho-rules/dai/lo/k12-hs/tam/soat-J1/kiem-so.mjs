// Trạm soát J1 — kiểm số độc lập từng ví dụ (không dùng tam/J1/thu*.mjs)
let bad = 0
const ok = (c, msg) => { if (!c) { bad++; console.log('SAI  ' + msg) } else console.log('ok   ' + msg) }
const d = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)
// dấu của g trên lưới (bỏ điểm gần các điểm cấm), trả về dãy đoạn [dấu, x_đầu, x_cuối]
function dau(g, a, b, n = 200000, cam = []) {
  const out = []
  for (let i = 0; i <= n; i++) {
    const x = a + (b - a) * i / n
    if (cam.some((c) => Math.abs(x - c) < 1e-4)) continue
    const v = g(x); if (!isFinite(v)) continue
    const s = Math.abs(v) < 1e-9 ? 0 : Math.sign(v)
    if (s === 0) continue
    const L = out[out.length - 1]
    if (L && L[0] === s) L[2] = x; else out.push([s, x, x])
  }
  return out.map(([s, u, v]) => `${s > 0 ? '+' : '-'}[${u.toFixed(2)};${v.toFixed(2)}]`).join(' ')
}
const giongDau = (g, a, b, mau, cam) => { const s = dau(g, a, b, 200000, cam); return { s, kq: s.replace(/\[[^\]]*\]/g, '').replace(/ /g, '') === mau } }
// kiểm đạo hàm công thức vs sai phân
const kd = (f, fp, a, b, ten) => { let m = 0; for (let x = a; x <= b; x += 0.0137) { const v = d(f, x), w = fp(x); if (isFinite(v) && isFinite(w)) m = Math.max(m, Math.abs(v - w) / (1 + Math.abs(w))) } ok(m < 1e-4, `${ten}: y' công thức khớp sai phân (sai lệch ${m.toExponential(1)})`) }
// đơn điệu trên khoảng bằng quét: chiều 1 = đồng biến, -1 = nghịch
function donDieu(f, a, b, chieu, n = 4000) { let p = f(a); for (let i = 1; i <= n; i++) { const x = a + (b - a) * i / n, v = f(x); if (!isFinite(v)) return false; if (chieu * (v - p) <= 0) return false; p = v } return true }
// quét m: tập m thoả
function quetM(test, a, b, buoc) { const r = []; for (let m = a; m <= b + 1e-9; m += buoc) { const mm = Math.round(m * 1e6) / 1e6; if (test(mm)) r.push(mm) } return r }
const tom = (r, buoc) => { if (!r.length) return '∅'; const seg = []; let s = r[0], p = r[0]; for (const v of r.slice(1)) { if (v - p > buoc * 1.5) { seg.push([s, p]); s = v } p = v } seg.push([s, p]); return seg.map(([u, v]) => `[${u};${v}]`).join('∪') }

console.log('== H1.1.1')
{ const f = (x) => x ** 3 - 3 * x ** 2 - 9 * x + 5; kd(f, (x) => 3 * (x + 1) * (x - 3), -5, 5, 'VD1')
  const r = giongDau((x) => d(f, x), -10, 10, '+-+'); ok(r.kq, 'VD1 dấu y′ ' + r.s) }
{ const f = (x) => (x * x - 3 * x + 3) / (x - 1); kd(f, (x) => x * (x - 2) / (x - 1) ** 2, -5, 0.9, 'VD2')
  const r = giongDau((x) => d(f, x, 1e-7), -10, 10, '+-+', [1]); ok(r.kq, 'VD2 dấu y′ ' + r.s + ' (cấm 1; đoạn âm gồm (0;1) và (1;2))') }

console.log('== H1.1.2')
{ const f = (x) => Math.sqrt(x * x - 2 * x - 3); kd(f, (x) => (x - 1) / Math.sqrt(x * x - 2 * x - 3), 3.01, 8, 'VD1a')
  ok(donDieu(f, -10, -1, -1) && donDieu(f, 3, 10, 1), 'VD1a nghịch (-∞;-1], đồng [3;+∞)') }
{ const f = (x) => Math.abs(x * x - 4 * x + 3)
  ok(donDieu(f, -10, 1, -1) && donDieu(f, 1, 2, 1) && donDieu(f, 2, 3, -1) && donDieu(f, 3, 10, 1), 'VD1b nghịch(-∞;1) đồng(1;2) nghịch(2;3) đồng(3;+∞)') }
{ ok(donDieu((x) => x ** 3 + 3 * x - 2, -20, 20, 1), 'VD2a đồng biến'); ok(Math.PI / 3 > 1 && donDieu((x) => (Math.PI / 3) ** x, -20, 20, 1), 'VD2b đồng biến')
  ok(!donDieu((x) => Math.log(x * x + 1), -20, 20, 1), 'VD2c không đồng biến'); ok(donDieu((x) => x - Math.sin(x), -20, 20, 1, 40000), 'VD2d đồng biến') }

console.log('== H1.2.1 (BBT) — kiểm logic VD2: f(-3)<2<f(3) khi hai nhánh giảm, lim -∞ là 2, lim +∞ là 2: đúng theo định nghĩa')
{ // dựng một hàm cụ thể khớp bảng VD2: f = 2 + 1/(x-1)?? nhánh trái: x<1: 1/(x-1)<0 → f<2, giảm từ 2 xuống -∞ ✓; nhánh phải giảm từ +∞ xuống 2 ✓
  const f = (x) => 2 + 1 / (x - 1); ok(f(-3) < f(3) && donDieu(f, -20, 0.99, -1) && donDieu(f, 1.01, 20, -1), 'VD2 hàm mẫu khớp bảng: f(-3)<f(3) ⇒ d) sai') }

console.log('== H1.2.2 (đồ thị)')
{ const f = (x) => x ** 3 - 3 * x ** 2 + 2; const r = giongDau((x) => d(f, x), -2, 4, '+-+'); ok(r.kq, 'VD1 dấu f′ ' + r.s); ok(f(0) === 2 && f(2) === -2, 'VD1 đỉnh (0;2) đáy (2;-2)') }
{ const f = (x) => 2 * x * x - x ** 4; const r = giongDau((x) => d(f, x), -2, 2, '+-+-'); ok(r.kq, 'VD2 dấu f′ ' + r.s); ok(f(1) === 1 && f(-1) === 1 && f(0) === 0, 'VD2 đỉnh (±1;1) đáy (0;0)'); ok(!donDieu(f, -1, 1, 1), 'VD2 không đồng biến trên (-1;1)') }

console.log('== H1.3.1')
{ const fp = (x) => (x + 1) ** 2 * (x - 2); const r = giongDau(fp, -3, 3, '-+'); ok(r.kq, "VD2 dấu f' " + r.s + ' (−1 tiếp xúc)'); ok(fp(-1) === 0 && fp(2) === 0, 'VD2 nghiệm −1, 2') }

console.log('== H1.3.2')
{ const r = giongDau((x) => (x + 1) * (x - 2) * (x - 3), -10, 10, '-+-+'); ok(r.kq, 'VD1 ' + r.s) }
{ const fp = (x) => x * (x - 1) ** 2 * (x + 2) ** 3; const r = giongDau(fp, -10, 10, '+-+'); ok(r.kq, 'VD2 ' + r.s)
  // f(1)<f(2): tích phân số f' trên [1;2] > 0
  let s = 0; for (let i = 0; i < 10000; i++) { const x = 1 + (i + 0.5) / 10000; s += fp(x) / 10000 } ok(s > 0, 'VD2b f(2)-f(1)=' + s.toFixed(3) + '>0') }

console.log('== H1.4.1')
{ const fp = (t) => (t + 1) * (t - 3); const gp = (x) => -2 * fp(1 - 2 * x); const r = giongDau(gp, -10, 10, '-+-'); ok(r.kq, 'VD1 g′ ' + r.s) }
{ const fp = (t) => (t + 1) * (t - 2); const gp = (x) => 2 * x * fp(x * x - 2); const r = giongDau(gp, -5, 5, '-+-+-+'); ok(r.kq, 'VD2 g′ ' + r.s) }

console.log('== H1.4.2')
{ const fp = (x) => x * x - 2; const gp = (x) => fp(x) - x; const r = giongDau(gp, -10, 10, '+-+'); ok(r.kq, 'VD1 g′ ' + r.s); ok(fp(-1) === -1 && fp(2) === 2, 'VD1 giao (-1;-1),(2;2)') }
{ const fp = (x) => 3 * x + 1 - x * x; const gp = (x) => 2 * fp(2 * x - 1) - 4 * x; const r = giongDau(gp, -10, 10, '-+-'); ok(r.kq, 'VD2 g′ ' + r.s); ok(Math.abs(gp(0.5)) < 1e-12 && Math.abs(gp(1.5)) < 1e-12, 'VD2 mốc 1/2, 3/2'); ok(fp(0) === 1 && fp(2) === 3, 'VD2 giao (0;1),(2;3)') }

// ---------- tìm m: kiểm điều kiện bằng quét x
const B = 0.25
console.log('== H1.5.1')
{ const t = (m) => { const yp = (x) => x * x + 2 * m * x + m + 6; for (let x = -30; x <= 30; x += 0.001) if (yp(x) < -1e-12) return false; return true }
  console.log('     VD1 tập m (bước 0,25): ' + tom(quetM(t, -10, 10, B), B) + '  — kỳ vọng [-2;3]') }
{ // y = (m²-1)x³+(m-1)x²-x+4 nghịch biến trên ℝ: quét trực tiếp y (hàm hằng sẽ bị loại vì donDieu ngặt)
  const t = (m) => { const y = (x) => (m * m - 1) * x ** 3 + (m - 1) * x * x - x + 4; const yp = (x) => 3 * (m * m - 1) * x * x + 2 * (m - 1) * x - 1; for (let x = -200; x <= 200; x += 0.01) if (yp(x) > 1e-9) return false; return donDieu(y, -50, 50, -1) }
  console.log('     VD2 tập m (bước 0,25): ' + tom(quetM(t, -5, 5, B), B) + '  — kỳ vọng [-0,5;1]'); ok(t(1) && !t(-1) && t(-0.5) && !t(-0.51) && !t(1.01), 'VD2 biên: m=1 nhận (y=−x+4), m=−1 loại, m=−1/2 nhận') }

console.log('== H1.5.2')
{ const t = (m) => { const y = (x) => (m * x + 4) / (x + m); return donDieu(y, -m - 30, -m - 0.01, 1) && donDieu(y, -m + 0.01, -m + 30, 1) }
  console.log('     VD1: ' + tom(quetM(t, -6, 6, B), B) + ' — kỳ vọng (-∞;-2)∪(2;+∞), m=±2 hàm hằng loại'); ok(!t(2) && !t(-2) && t(2.01), 'VD1 biên') }
{ const t = (m) => { const y = (x) => ((m + 1) * x + 2) / (x + m); return donDieu(y, -m - 30, -m - 0.01, -1) && donDieu(y, -m + 0.01, -m + 30, -1) }
  const nguyen = quetM(t, -20, 20, 1); ok(nguyen.join(',') === '-1,0', 'VD2 m nguyên: ' + nguyen.join(',')) }

console.log('== H1.5.3')
{ const t = (m) => { if (-m < -4) return false; /* điểm gián đoạn −m nằm trong khoảng ⇒ hàm không xác định trên cả khoảng */ const y = (x) => (x + 3) / (x + m); return donDieu(y, -60, -4.0001, 1, 20000) }
  console.log('     VD1: ' + tom(quetM(t, 0, 6, 0.05), 0.05) + ' — kỳ vọng (3;4]'); ok(t(4) && !t(3) && !t(4.05) && t(3.05), 'VD1 biên') }
{ const t = (m) => { for (let x = 0.0001; x < 1; x += 0.0001) if (3 * x * x + 6 * x - m > 1e-12) return false; return true }
  console.log('     VD2: ' + tom(quetM(t, 0, 15, B), B) + ' — kỳ vọng [9;+∞)'); ok(t(9) && !t(8.99), 'VD2 biên m=9') }

console.log('== H1.5.4')
{ // VD1: dùng định nghĩa đồng biến trên từng khoảng xác định (quét y), không qua tử số
  const t = (m) => { const y = (x) => (x * x - 2 * x + m) / (x - 1); return donDieu(y, -30, 0.9999, 1, 100000) && donDieu(y, 1.0001, 30, 1, 100000) }
  console.log('     VD1: ' + tom(quetM(t, -5, 5, 0.05), 0.05) + ' — kỳ vọng (-∞;1]'); ok(t(1) && !t(1.05), 'VD1 biên: m=1 (y=x−1, x≠1) nhận') }
{ const t = (m) => { const y = (x) => (x * x - 3 * x + m) / (x - 2); return donDieu(y, -40, 0.9999, 1, 100000) }
  console.log('     VD2: ' + tom(quetM(t, -5, 8, 0.05), 0.05) + ' — kỳ vọng (-∞;3]'); ok(t(3) && !t(3.05), 'VD2 biên m=3') }

console.log('== H1.5.5')
{ const t = (m) => { const y = (x) => (Math.cos(x) - 2) / (Math.cos(x) - m); if (m > 0.5 && m < 1) return false; /* cos x = m có nghiệm trong khoảng ⇒ không xác định */ return donDieu(y, 1e-5, Math.PI / 3 - 1e-5, -1, 20000) }
  console.log('     cos: ' + tom(quetM(t, -3, 3, 0.05), 0.05) + ' — kỳ vọng (-∞;1/2]∪[1;2)'); ok(t(0.5) && t(1) && !t(0.55) && !t(2) && t(1.95), 'cos biên') }
{ const t = (m) => { const y = (x) => (Math.log(x) - 4) / (Math.log(x) - 2 * m); for (let x = 1.0001; x < Math.E ** 2; x += 1e-3) if (Math.abs(Math.log(x) - 2 * m) < 1e-6) return false; return donDieu(y, 1.00001, Math.E ** 2 - 1e-5, 1, 20000) }
  console.log('     ln: ' + tom(quetM(t, -3, 3, 0.05), 0.05) + ' — kỳ vọng (-∞;0]∪[1;2)'); ok(t(0) && t(1) && !t(0.05) && !t(2) && t(1.95), 'ln biên') }

console.log('== H1.5.6')
{ const fp = (t) => t * t + 2 * t - 3; const t = (m) => { for (let x = 1e-4; x < 2; x += 1e-4) if (fp(x + m) > 1e-12) return false; return true }
  console.log('     VD1: ' + tom(quetM(t, -6, 3, 0.05), 0.05) + ' — kỳ vọng [-3;-1]') }
{ const fp = (t) => (t + 2) * (t - 1); const t = (m) => { for (let x = 1e-4; x < 1; x += 1e-4) if ((2 * x - 2) * fp(x * x - 2 * x + m) < -1e-12) return false; return true }
  console.log('     VD2: ' + tom(quetM(t, -4, 4, 0.05), 0.05) + ' — kỳ vọng [-1;1]') }

console.log(bad ? `\n${bad} chỗ SAI` : '\nTất cả ok')
