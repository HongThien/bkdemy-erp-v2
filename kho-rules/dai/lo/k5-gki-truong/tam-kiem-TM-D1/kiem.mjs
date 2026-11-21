// Thử đáp số TM-D1 độc lập — tính bằng số nguyên (đơn vị nhỏ nhất) để chính xác.
let fail = 0;
const ok = (ten, a, b) => { const d = a === b; if (!d) fail++; console.log(d ? 'OK  ' : 'FAIL', ten, a, b); };
// Câu 1: 302 + 104/1000
ok('C1', 302 * 1000 + 104, 302104); // 302,104 (B)
// Câu 2: 23,012 -> chữ số 1 ở hàng phần trăm
const s = '23,012'.split(',')[1]; ok('C2 hang', s.indexOf('1') + 1, 2); // 2 = phần trăm -> 1/100 (C)
// Câu 3: 1 830 000 ha -> km2 (1 km2 = 100 ha)
const lad = 1830000 / 100, cas = 371000;
ok('C3 Ladoga km2', lad, 18300); ok('C3 hieu', cas - lad, 352700); // Caspi lớn hơn 352 700 (D)
// Câu 4
const c4 = [5798, 5897, 5789, 5879]; ok('C4 max', Math.max(...c4), 5897); // B
// Câu 5: năm 924..979 thuộc thế kỉ
const tk = n => Math.floor((n - 1) / 100) + 1; ok('C5 924', tk(924), 10); ok('C5 979', tk(979), 10); // X (D)
// Câu 6: vét cạn hoán vị
const w = [295, 325, 318, 329]; const per = a => a.length < 2 ? [a] : a.flatMap((x, i) => per([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
const sol = per(w).filter(([L, M, H, D]) => D < L && D < M && D < H && H > L && H < M);
console.log('C6 nghiem', JSON.stringify(sol)); ok('C6 so nghiem', sol.length, 1);
// Câu 7.1 (kg)
const d1 = 1950, d2 = d1 - 900, d3 = d1 + 150; ok('C7.1 kg', d1 + d2 + d3, 5100); ok('C7.1 ta x100', (d1 + d2 + d3), 51 * 100);
// Câu 7.2
ok('C7.2', 3 * 100 + 14 * 10 + 5, 445);
// Bài 1 (đơn vị nhỏ nhất)
ok('B1a dm', 5 * 10 + 6, 56); // 5,6 m
ok('B1b g', 8 * 1000 + 852, 8852); // 8,852 kg
ok('B1c mm2', 12 * 100 + 8, 1208); // 12,08 cm2
ok('B1d g', 8652, 8652); // 8,652 kg
// Bài 2 (phần nghìn)
ok('B2a', 7500 + 9800, 17300); ok('B2b', 35920 + 58760, 94680); ok('B2c', 78200 - 24600, 53600); ok('B2d', 60203 - 24096, 36107);
// Bài 3 (phần trăm)
ok('B3a', 1475 + 896 + 625, 2996); ok('B3b', 6689 - 1889 - 1211, 3589);
// Bài 4
ok('B4', 100000 - (5 * 8200 + 2 * 24000), 11000);
// Bài 5
const nat = []; for (let x = 0; x < 10; x++) if (1 < x && x < 2) nat.push(x); ok('B5a so tu nhien', nat.length, 0);
const ys = [81, 82, 83].every(y => 80 < y && y < 90); ok('B5b', ys, true);
const a = Math.floor(47.613); ok('B5c', `${a},${a + 1}`, '47,48');
console.log('FAIL =', fail);
