// Trạm kiểm ND-ON9 — tính lại từ đề (độc lập), phân số BigInt
const g = (a, b) => (b === 0n ? (a < 0n ? -a : a) : g(b, a % b));
const F = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); const k = g(n, d); return [n / k, d / k]; };
const add = (x, y) => F(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const sub = (x, y) => F(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const mul = (x, y) => F(x[0] * y[0], x[1] * y[1]);
const div = (x, y) => F(x[0] * y[1], x[1] * y[0]);
const s = (x) => `${x[0]}/${x[1]}`;
let pass = 0, fail = 0;
const ok = (ten, got, want) => { const t = String(got) === String(want); t ? pass++ : fail++; console.log(`${t ? 'OK  ' : 'FAIL'} ${ten}: ${got} (mong ${want})`); };

// Câu 1
ok('C1 so chu so 0 cua 12005000', [...'12005000'].filter(c => c === '0').length, 5);
// Câu 2: phân số thập phân = mẫu là 10,100,1000...
const pstp = (d) => /^10+$/.test(String(d));
ok('C2', ['A', 'B', 'C', 'D'].filter((_, i) => pstp([1000, 3, 25, 7][i])).join(''), 'A');
// Câu 3
ok('C3', Math.trunc(47.08), 47);
// Câu 4
const day = { A: [2.5, 2.05, 2.505, 2.55], B: [2.05, 2.505, 2.5, 2.55], C: [2.55, 2.505, 2.5, 2.05], D: [2.05, 2.5, 2.505, 2.55] };
ok('C4', Object.keys(day).filter(k => day[k].every((v, i, a) => i === 0 || a[i - 1] < v)).join(''), 'D');
// Câu 6: làm tròn hàng phần mười, dùng số nguyên tránh sai số
ok('C6', (Math.round(12864 / 10) / 10).toString().replace('.', ','), '128,6');
// Câu 7: 7 kg 50 g
ok('C7', String((7000 + 50) / 1000).replace('.', ','), '7,05');
// Câu 8: đơn vị diện tích quy về mm^2
const mm2 = { mm2: 1n, cm2: 100n, dm2: 10000n, m2: 1000000n, ha: 10000000000n, km2: 1000000000000n };
const D8 = [
  1n * mm2.m2 === 100n * mm2.dm2,
  6n * mm2.ha === 6000n * mm2.m2,
  2n * mm2.km2 + 30n * mm2.ha === 230n * mm2.ha,
  500n * mm2.mm2 === 5n * mm2.cm2,
].map(b => (b ? 'Đ' : 'S')).join('');
ok('C8', D8, 'ĐSĐĐ');
// Bài 1
ok('B1a', s(add(F(1, 3), F(3, 8))), '17/24');
ok('B1b', s(sub(F(9, 4), F(5, 6))), '17/12');
ok('B1c', s(mul(F(9, 14), F(7, 6))), '3/4');
ok('B1d', s(div(F(5), F(5, 8))), '8/1');
// Bài 2
ok('B2a', s(mul(F(1, 4), F(60))), '15/1');
ok('B2b', s(add(F(4), F(6, 10))), '23/5'); // 4,6
ok('B2c', s(add(F(2), F(3, 100))), '203/100'); // 2,03
ok('B2d', s(F(7500, 10000)), '3/4'); // 0,75
// Bài 3
ok('B3a', 250 * 47 * 4, 47000);
ok('B3b', s(add(mul(F(7, 8), F(5, 11)), mul(F(7, 8), F(6, 11)))), '7/8');
// Bài 4
const tong = 3600n;
const l1 = mul(F(tong), F(1, 3));
const con1 = sub(F(tong), l1);
const l2 = mul(con1, F(1, 4));
const con2 = sub(con1, l2);
ok('B4a (kg)', s(l1), '1200/1');
ok('B4b (tan)', s(div(con2, F(1000))), '9/5'); // 1,8 tấn
// Bài 5: quét số tự nhiên
const quet = (a, b) => { const r = []; for (let x = 0; x <= 100; x++) if (a < x * 100 && x * 100 < b) r.push(x); return r.join(','); };
ok('B5a', quet(90, 150), '1');
ok('B5b', quet(1399, 1401), '14');
console.log(`\n${pass} OK, ${fail} FAIL`);
