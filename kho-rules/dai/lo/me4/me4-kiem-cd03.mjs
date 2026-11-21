// me4-kiem-cd03.mjs — máy kiểm đáp số CĐ3 (Trung bình cộng). Mỗi hàm TỰ TÍNH TỪ ĐỀ (vét cạn / thay ngược), không chép lời giải sách.
const tbc = (a) => a.reduce((s, x) => s + x, 0) / a.length
const day = (dau, cuoi, buoc) => { const r = []; for (let x = dau; x <= cuoi; x += buoc) r.push(x); return r }
const so = (x) => String(x)

// vét cạn nguyên tới `gh`: trả các (x) thoả `ok`
const tim = (gh, ok) => { const r = []; for (let x = 0; x <= gh; x++) if (ok(x)) r.push(x); return r }

export const KIEM_CD03 = {
  'CĐ3 · B1a': () => [so(tbc([10, 17, 24, 37]))],
  'CĐ3 · B1b': () => [so(tbc(day(1, 25, 3)))],
  'CĐ3 · B1c': () => [so(tbc(day(2, 38, 4)))],
  'CĐ3 · B1d': () => [so(tbc(day(1, 2015, 1)))],
  'CĐ3 · B1e': () => [so(tbc(day(5, 2005, 5)))],
  // số thứ ba c: (12+40+c)/3 = 25
  'CĐ3 · B2': () => tim(1000, (c) => (12 + 40 + c) / 3 === 25).map(so),
  // số thứ ba c, số thứ hai 2c, số thứ nhất 4c: TBC 35
  'CĐ3 · B3': () => tim(1000, (c) => (c + 2 * c + 4 * c) / 3 === 35).map(so),
  // 5 số chẵn liên tiếp bắt đầu từ n chẵn, TBC 126
  'CĐ3 · B4': () => { const r = []; for (let n = 0; n <= 400; n += 2) { const d = [n, n + 2, n + 4, n + 6, n + 8]; if (tbc(d) === 126) r.push(...d) } return r.map(so) },
  // cô giáo tuổi c: (30*11 + c)/31 = 12
  'CĐ3 · B5': () => tim(100, (c) => (30 * 11 + c) / 31 === 12).map(so),
  // Hùng = TBC(An,Bình)+6; Dũng d: d = TBC(4 bạn)
  'CĐ3 · B6': () => { const hung = (18 + 16) / 2 + 6; return tim(300, (d) => d * 4 === 18 + 16 + hung + d).map(so) },
  // Long = 10, Quý q: q = TBC(3 bạn) + 6
  'CĐ3 · B7': () => tim(300, (q) => q === (20 + 10 + q) / 3 + 6).map(so),
  // gói thêm g: TBC 6 gói = TBC 5 gói + 40
  'CĐ3 · B8': () => { const t = 700 + 800 + 800 + 850 + 900; return tim(5000, (g) => (t + g) / 6 === t / 5 + 40).map(so) },
  // 5A a, 5B b: a+b = 470, a+80 = b+40
  'CĐ3 · B9': () => { const r = []; for (let a = 0; a <= 470; a++) { const b = 470 - a; if (a + 80 === b + 40) r.push(a, b) } return r.map(so) },
  // ba số a,b,c: tổng 72, a+b=42, b+c=52
  'CĐ3 · B10': () => { const r = []; for (let a = 0; a <= 72; a++) for (let b = 0; b <= 72; b++) { const c = 72 - a - b; if (c >= 0 && a + b === 42 && b + c === 52) r.push(a, b, c) } return r.map(so) },
  // 4 số a,b,c,d: tổng 100, a+b+c=66, b+c+d=60; hỏi TBC(b,c)
  'CĐ3 · B11': () => { const r = new Set(); for (let a = 0; a <= 100; a++) for (let b = 0; b <= 100; b++) for (let c = 0; c <= 100; c++) { const d = 100 - a - b - c; if (d >= 0 && a + b + c === 66 && b + c + d === 60) r.add((b + c) / 2) } return [...r].map(so) },
  // hai số a,b: a+b=114; a+3b=210
  'CĐ3 · B12': () => { const r = []; for (let a = 0; a <= 114; a++) { const b = 114 - a; if (a + 3 * b === 210) r.push(a, b) } return r.map(so) },
  // 4C = c: TBC(28,c) - TBC(28,26,c) = 2
  'CĐ3 · B13': () => tim(500, (c) => (28 + c) / 2 - (28 + 26 + c) / 3 === 2).map(so),
}
