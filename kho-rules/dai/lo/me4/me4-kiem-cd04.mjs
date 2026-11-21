// me4-kiem-cd04.mjs — máy kiểm đáp số CĐ4 (Kỹ thuật thực hiện phép tính). Mỗi hàm TỰ TÍNH TỪ ĐỀ (gõ lại biểu thức đề / vét cạn), không chép lời giải sách.
const so = (x) => String(x)
const gan = (a, b) => Math.abs(a - b) < 1e-9
// vét cạn x tự nhiên trong [0, gh] thoả ok(x)
const timX = (gh, ok) => { const r = []; for (let x = 0; x <= gh; x++) if (ok(x)) r.push(`x=${x}`); return r }
// số viết bằng chữ số lặp: rep(x, 3) = xxx
const rep = (x, n) => Number(String(x).repeat(n))
// số tự nhiên từ các chữ số theo thứ tự
const ghep = (...cs) => Number(cs.join(''))

export const KIEM_CD04 = {
  // ---- Bài 1: tính (biểu thức gõ từ đề) ----
  'CĐ4 · B1a': () => [so(687 + 969 + 313)],
  'CĐ4 · B1b': () => [so(186 - 65 - 35)],
  'CĐ4 · B1c': () => [so(1024 - (1024 - 15))],
  'CĐ4 · B1d': () => [so((368 + 764) - (363 + 759))],
  'CĐ4 · B1e': () => [so(3145 - 246 + 2347 - 145 + 4246 - 347)],
  // ---- Bài 2 ----
  'CĐ4 · B2a': () => [so(92 * 164 - 64 * (82 + 2170 / 217))],
  'CĐ4 · B2b': () => [so((100 + 42) * 42 + (200 - 58) * 58)],
  'CĐ4 · B2c': () => [so(132 * 9 + 132 + 100 * 50)],
  'CĐ4 · B2d': () => [so((56 * 27 + 56 * 35) / 62)],
  'CĐ4 · B2e': () => [so((158 * 129 - 158 * 39) / 180)],
  // ---- Bài 3 ----
  'CĐ4 · B3a': () => [so(8 * 427 * 3 + 6 * 573 * 4)],
  'CĐ4 · B3b': () => [so(86 * 27 - 43 * 54)],
  'CĐ4 · B3c': () => [so((145 * 99 + 145) - (143 * 101 - 143))],
  'CĐ4 · B3d': () => [so(10000 - 47 * 72 - 47 * 28)],
  'CĐ4 · B3e': () => [so(3457 - 27 * 48 - 48 * 73 + 6543)],
  'CĐ4 · B3f': () => [so(326 * 728 + 327 * 272)],
  'CĐ4 · B3g': () => [so(2008 * 867 + 2009 * 133)],
  // ---- Bài 4 ----
  'CĐ4 · B4a': () => [so(1234 * 4 + 1234 * 3 + 1234 * 2 + 1234)],
  'CĐ4 · B4b': () => [so(345 * 123 - 345 - 345 * 22)],
  'CĐ4 · B4c': () => [so(4 * 125 * 25 * 8)],
  'CĐ4 · B4d': () => [so(2 * 8 * 50 * 25 * 125)],
  'CĐ4 · B4e': () => [so(2 * 3 * 4 * 5 * 50 * 25)],
  'CĐ4 · B4f': () => [so(25 * 20 * 125 * 8 - 8 * 20 * 5 * 125)],
  // ---- Bài 5: tìm x, thay ngược vào đề, quét x tự nhiên (x ≥ 1 khi x là số chia) ----
  'CĐ4 · B5a': () => timX(100000, (x) => gan(x - 140 / 35, 270)),
  'CĐ4 · B5b': () => timX(100000, (x) => x >= 1 && gan(357 / (87 / x), 119)),
  'CĐ4 · B5c': () => timX(100000, (x) => (x + 1) + (x + 3) + (x + 5) === 30),
  'CĐ4 · B5d': () => timX(100000, (x) => x >= 25 && 125 + (x - 25) * 5 + x === 150),
  'CĐ4 · B5e': () => timX(100000, (x) => x * 101 - x + 72 * 99 + 72 === 21500),
  'CĐ4 · B5f': () => timX(100000, (x) => x >= 1 && gan(2010 / x - 1307 / x, 37)),
  'CĐ4 · B5g': () => timX(100000, (x) => x >= 1 && gan(180 - ((x + 15) / x) * 20, 100)),
  'CĐ4 · B5h': () => timX(100000, (x) => gan(x / 8 * 32 + x / 3 * 18 - x / 5 * 10, 120)),
  // ---- Bài 6: số 3 chữ số abc, ba chữ số liên tiếp tăng dần; hiệu số đảo − số gốc ----
  'CĐ4 · B6': () => {
    const r = new Set()
    for (let a = 1; a <= 7; a++) { const b = a + 1, c = a + 2; r.add(ghep(c, b, a) - ghep(a, b, c)) }
    if (r.size !== 1) throw new Error('hiệu không cố định: ' + [...r])
    return [so([...r][0])]
  },
  // ---- Bài 7: x là chữ số ----
  'CĐ4 · B7a': () => timX(9, (x) => rep(x, 2) + x + 5 === 101),
  'CĐ4 · B7b': () => timX(9, (x) => rep(x, 3) - rep(x, 2) - x - 25 === 272),
  'CĐ4 · B7c': () => timX(9, (x) => rep(x, 3) + rep(x, 2) + x + x + x + 1 === 1001),
  'CĐ4 · B7d': () => timX(9, (x) => 35655 - rep(x, 3) - rep(x, 2) - x === 34548),
  // ---- Bài 8: so sánh C và D với mọi chữ số a, b từ 1 đến 9 ----
  'CĐ4 · B8a': () => { let bang = true; for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (rep(a, 2) * b !== rep(b, 2) * a) bang = false; if (!bang) throw new Error('C khác D với một số cặp (a, b)'); return ['C=D'] },
  'CĐ4 · B8b': () => { let bang = true; for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (rep(a, 3) * b !== rep(b, 3) * a) bang = false; if (!bang) throw new Error('C khác D với một số cặp (a, b)'); return ['C=D'] },
  // ---- Bài 9: số 4 chữ số, bốn chữ số liên tiếp tăng dần ----
  'CĐ4 · B9': () => {
    const r = new Set()
    for (let a = 1; a <= 6; a++) r.add(ghep(a + 3, a + 2, a + 1, a) - ghep(a, a + 1, a + 2, a + 3))
    if (r.size !== 1) throw new Error('hiệu không cố định: ' + [...r])
    return [so([...r][0])]
  },
  // ---- Bài 10: vét cạn mọi bộ chữ số (a, b, c, d) thoả điều kiện, mọi giá trị abcd − dcba phải bằng nhau ----
  'CĐ4 · B10a': () => {
    const r = new Set()
    for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) for (let d = 0; d <= 9; d++) if (a - d === 5 && b - c === 3) r.add(ghep(a, b, c, d) - ghep(d, c, b, a))
    if (r.size !== 1) throw new Error('hiệu không cố định: ' + [...r])
    return [so([...r][0])]
  },
  'CĐ4 · B10b': () => {
    const r = new Set()
    for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) for (let d = 0; d <= 9; d++) if (a - d === 5 && c - b === 4) r.add(ghep(a, b, c, d) - ghep(d, c, b, a))
    if (r.size !== 1) throw new Error('hiệu không cố định: ' + [...r])
    return [so([...r][0])]
  },
  // ---- Bài 11: y tự nhiên, y < 2023 (số chia 2023 − y > 0), tìm y cho giá trị nhỏ nhất ----
  'CĐ4 · B11': () => { let tot = null, ys = []; for (let y = 0; y < 2023; y++) { const v = 2024 + 2023 / (2023 - y); if (tot === null || v < tot - 1e-12) { tot = v; ys = [y] } else if (gan(v, tot)) ys.push(y) } return ys.map((y) => `y=${y}`) },
  // ---- Bài 12: ABC + BAC = 1660, A và B là chữ số đầu nên khác 0 ----
  'CĐ4 · B12': () => {
    const r = new Set()
    for (let A = 1; A <= 9; A++) for (let B = 1; B <= 9; B++) for (let C = 0; C <= 9; C++) if (ghep(A, B, C) + ghep(B, A, C) === 1660) r.add(A + B + C)
    if (r.size !== 1) throw new Error('tổng không cố định: ' + [...r])
    return [so([...r][0])]
  },
}
