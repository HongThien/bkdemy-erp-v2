// Bộ kiểm độc lập cho ND-ON9: tính TỪ ĐỀ bằng BigInt, rồi so với đáp số khai ở cuối.
let pass = 0, fail = 0;
function ck(ten, got, want) {
  const g = typeof got === 'bigint' ? got.toString() : String(got);
  const w = typeof want === 'bigint' ? want.toString() : String(want);
  if (g === w) { pass++; console.log('OK   ', ten, '=', g); }
  else { fail++; console.log('FAIL ', ten, 'máy=', g, 'khai=', w); }
}
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
class F {
  constructor(n, d = 1n) { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g; }
  add(o) { return new F(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new F(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new F(this.n * o.n, this.d * o.d); }
  div(o) { return new F(this.n * o.d, this.d * o.n); }
  str() { return this.d === 1n ? this.n.toString() : this.n + '/' + this.d; }
}
// số thập phân chuỗi -> F
const dec = (s) => { const [a, b = ''] = s.replace(',', '.').split('.'); return new F(BigInt(a + b), 10n ** BigInt(b.length)); };

// Câu 1: đếm chữ số 0 của 12 005 000
ck('C1 số chữ số 0', [...'12005000'].filter(c => c === '0').length, 5); // B = 5 chữ số
// Câu 2: phân số thập phân = mẫu là lũy thừa của 10 (mẫu viết ở dạng phân số in, KHÔNG rút gọn)
const isPow10 = (m) => { while (m % 10n === 0n) m /= 10n; return m === 1n; };
const c2 = { A: [3n, 1000n], B: [10n, 3n], C: [4n, 25n], D: [100n, 7n] };
ck('C2 phương án thập phân', Object.entries(c2).filter(([, [, m]]) => isPow10(m)).map(([k]) => k).join(''), 'A');
// Câu 3: phần nguyên của 47,08
ck('C3 phần nguyên', '47,08'.split(',')[0], 47);
// Câu 4: dãy tăng dần
const c4 = { A: ['2,5', '2,05', '2,505', '2,55'], B: ['2,05', '2,505', '2,5', '2,55'], C: ['2,55', '2,505', '2,5', '2,05'], D: ['2,05', '2,5', '2,505', '2,55'] };
const tang = (arr) => arr.every((x, i) => i === 0 || (dec(arr[i - 1]).sub(dec(x))).n < 0n);
ck('C4 dãy tăng', Object.entries(c4).filter(([, a]) => tang(a)).map(([k]) => k).join(''), 'D');
// Câu 5: hình chữ nhật, số cặp cạnh song song (toạ độ số, nhiều kích thước)
function capSongSong(a, b) {
  const P = [[0, 0], [a, 0], [a, b], [0, b]];
  const E = P.map((p, i) => { const q = P[(i + 1) % 4]; return [q[0] - p[0], q[1] - p[1]]; });
  let c = 0;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (E[i][0] * E[j][1] - E[i][1] * E[j][0] === 0) c++;
  return c;
}
const set5 = new Set(); for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) set5.add(capSongSong(a, b));
ck('C5 số cặp song song (mọi kích thước)', [...set5].join(','), 2);
// Câu 6: làm tròn 128,64 đến phần mười (half-up, số nguyên)
const s6 = 12864n; // 128,64 *100
const r6 = (s6 + 5n) / 10n; // *10
ck('C6 làm tròn phần mười', `${r6 / 10n},${r6 % 10n}`, '128,6');
// Câu 7: 7 kg 50 g = ? kg  (g)
const g7 = 7n * 1000n + 50n;
const c7 = { A: 7500n, B: 7005n, C: 7050n, D: 750000n }; // giá trị mỗi phương án tính bằng 1/1000 kg
ck('C7 phương án', Object.entries(c7).filter(([, v]) => v === g7).map(([k]) => k).join(''), 'C');
// Câu 8: đổi diện tích về mm^2
const A = { mm2: 1n, cm2: 100n, dm2: 10000n, m2: 1000000n, ha: 10000n * 1000000n, km2: 1000000n * 1000000n };
ck('C8a 1 m2 = 100 dm2', 1n * A.m2 === 100n * A.dm2 ? 'D' : 'S', 'D');
ck('C8b 6 ha = 6000 m2', 6n * A.ha === 6000n * A.m2 ? 'D' : 'S', 'S');
ck('C8c 2 km2 30 ha = 230 ha', 2n * A.km2 + 30n * A.ha === 230n * A.ha ? 'D' : 'S', 'D');
ck('C8d 500 mm2 = 5 cm2', 500n * A.mm2 === 5n * A.cm2 ? 'D' : 'S', 'D');
// Bài 1 (hỗn số dùng 2 + 1/4 = 9/4)
ck('B1a', new F(1n, 3n).add(new F(3n, 8n)).str(), '17/24');
ck('B1b', new F(2n).add(new F(1n, 4n)).sub(new F(5n, 6n)).str(), '17/12');
{ const x = new F(2n).add(new F(1n, 4n)).sub(new F(5n, 6n)); ck('B1b nguyên+dư', `${x.n / x.d} ${x.n % x.d}/${x.d}`, '1 5/12'); }
ck('B1c', new F(9n, 14n).mul(new F(7n, 6n)).str(), '3/4');
ck('B1d', new F(5n).div(new F(5n, 8n)).str(), '8');
// Bài 2
ck('B2a 1/4 giờ (phút)', new F(1n, 4n).mul(new F(60n)).str(), '15');
ck('B2b 4 m 6 dm (m)', new F(4n).add(new F(6n, 10n)).str(), '23/5'); // 4,6
ck('B2b dạng 4,6', new F(46n, 10n).str(), '23/5');
// 2 tạ 3 kg = (200+3) kg, 1 tạ = 100 kg
ck('B2c 2 tạ 3 kg (tạ)', new F(2n * 100n + 3n, 100n).str(), dec('2,03').str());
ck('B2d 7500 m2 (ha)', new F(7500n, 10000n).str(), dec('0,75').str());
// Bài 3
ck('B3a', 250n * 47n * 4n, 47000n);
ck('B3b trực tiếp', new F(7n, 8n).mul(new F(5n, 11n)).add(new F(7n, 8n).mul(new F(6n, 11n))).str(), '7/8');
{ // kiểm phép biến đổi nhóm thừa số chung: a*b + a*c = a*(b+c), 200 bộ ngẫu nhiên
  let ok = true;
  for (let i = 0; i < 200; i++) {
    const r = () => new F(BigInt(1 + Math.floor(Math.random() * 30)), BigInt(1 + Math.floor(Math.random() * 30)));
    const a = r(), b = r(), c = r();
    if (a.mul(b).add(a.mul(c)).str() !== a.mul(b.add(c)).str()) ok = false;
  }
  ck('B3b nhóm thừa số chung (200 bộ)', ok, true);
  ck('B3a giao hoán 250*4 trước', 47n * (250n * 4n), 47000n);
}
// Bài 4 (kg)
{
  const tong = 3600n; // 3 tấn 600 kg
  const l1 = new F(tong).mul(new F(1n, 3n));
  const con1 = new F(tong).sub(l1);
  const l2 = con1.mul(new F(1n, 4n));
  const con = con1.sub(l2);
  ck('B4a lần 1 (kg)', l1.str(), '1200');
  ck('B4 còn sau lần 1 (kg)', con1.str(), '2400');
  ck('B4 lần 2 (kg)', l2.str(), '600');
  ck('B4b còn (kg)', con.str(), '1800');
  ck('B4b còn (tấn)', con.div(new F(1000n)).str(), dec('1,8').str());
  // cách khác: còn lại = 2/3 * 3/4 = 1/2 tổng
  ck('B4b cách khác 3/4*2/3', new F(tong).mul(new F(2n, 3n)).mul(new F(3n, 4n)).str(), '1800');
}
// Bài 5: vét cạn số tự nhiên x (so sánh ở thang 100)
{
  const hit = (lo, hi) => { const r = []; for (let x = 0n; x <= 1000n; x++) { const X = x * 100n; if (lo < X && X < hi) r.push(x); } return r.join(','); };
  ck('B5a 0,9<x<1,5', hit(90n, 150n), '1');
  ck('B5b 13,99<x<14,01', hit(1399n, 1401n), '14');
}
console.log(`\nTổng: ${pass + fail} phép thử, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
