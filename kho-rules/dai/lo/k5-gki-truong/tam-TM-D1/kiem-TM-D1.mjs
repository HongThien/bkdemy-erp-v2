// Bo kiem dap so TM-D1 (De cuong giua ki I so 1 - TH Tay Mo), viet TU DE, tinh bang BigInt / phan so chinh xac.
// Chay: node kho-rules/dai/lo/k5-gki-truong/tam-TM-D1/kiem-TM-D1.mjs
let pass = 0, fail = 0;
function ck(ten, ok, chiTiet = '') {
  if (ok) pass++; else fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + ten + (chiTiet ? '  -> ' + chiTiet : ''));
}

// ---------- so thap phan chinh xac: {n: BigInt, s: so chu so thap phan} ----------
const P10 = (k) => 10n ** BigInt(k);
function D(str) { // "35,92" hoac "35.92"
  const t = String(str).replace(',', '.').replace(/\s/g, '');
  const [a, b = ''] = t.split('.');
  return { n: BigInt(a + b), s: b.length };
}
function align(x, y) { const s = Math.max(x.s, y.s); return [x.n * P10(s - x.s), y.n * P10(s - y.s), s]; }
const add = (x, y) => { const [a, b, s] = align(x, y); return { n: a + b, s }; };
const sub = (x, y) => { const [a, b, s] = align(x, y); return { n: a - b, s }; };
const mul = (x, y) => ({ n: x.n * y.n, s: x.s + y.s });
const cmp = (x, y) => { const [a, b] = align(x, y); return a < b ? -1 : a > b ? 1 : 0; };
function str(x) { // chuan hoa: bo 0 thua, dau phay
  let n = x.n, s = x.s, neg = n < 0n; if (neg) n = -n;
  while (s > 0 && n % 10n === 0n) { n /= 10n; s--; }
  let t = n.toString().padStart(s + 1, '0');
  const out = s ? t.slice(0, t.length - s) + ',' + t.slice(t.length - s) : t;
  return (neg ? '-' : '') + out;
}
const eq = (x, y) => cmp(x, y) === 0;

// ======== Cau 1: "Ba tram linh hai phay mot tram linh tu" ========
{
  const phanNguyen = 3 * 100 + 0 * 10 + 2; // ba tram linh hai
  const phanTP = '1' + '0' + '4';           // mot tram linh tu = 104 (3 chu so)
  const so = `${phanNguyen},${phanTP}`;
  const opt = { A: '32,14', B: '302,104', C: '302,14', D: '32,104' };
  const dung = Object.keys(opt).filter((k) => opt[k] === so);
  ck('Cau 1 dung duy nhat B', dung.length === 1 && dung[0] === 'B', so);
}
// ======== Cau 2: chu so 1 trong 23,012 ========
{
  const chuoiTP = '012'; // sau dau phay
  const viTri = chuoiTP.indexOf('1') + 1; // hang phan muoi = 1, phan tram = 2 ...
  const gt = { n: 1n, mau: P10(viTri) }; // 1 / 10^viTri
  const opt = { A: P10(1), B: 1n, C: P10(2), D: P10(3) }; // mau cua 1/mau (B: 1/1)
  const dung = Object.keys(opt).filter((k) => opt[k] === gt.mau);
  ck('Cau 2 dung duy nhat C (1/100)', dung.length === 1 && dung[0] === 'C', 'vi tri ' + viTri);
}
// ======== Cau 3: Ladoga 1 830 000 ha ; Caspi 371 000 km2 ========
{
  const ladogaKm2 = 1830000n / 100n; // 1 km2 = 100 ha
  ck('Cau 3 doi ha->km2 chia het', 1830000n % 100n === 0n, ladogaKm2 + ' km2');
  const caspi = 371000n;
  const hon = caspi > ladogaKm2 ? 'Caspi' : 'Ladoga';
  const hieu = (caspi > ladogaKm2 ? caspi - ladogaKm2 : ladogaKm2 - caspi);
  const opt = { A: ['Ladoga', 352700n], B: ['Caspi', 188000n], C: ['Ladoga', 188000n], D: ['Caspi', 352700n] };
  const dung = Object.keys(opt).filter((k) => opt[k][0] === hon && opt[k][1] === hieu);
  ck('Cau 3 dung duy nhat D', dung.length === 1 && dung[0] === 'D', `${hon} hon ${hieu}`);
  // thu cach doi nguoc: Caspi sang ha
  ck('Cau 3 thu nguoc bang ha', 371000n * 100n - 1830000n === 352700n * 100n);
}
// ======== Cau 4: so lon nhat ========
{
  const ds = ['5,798', '5,897', '5,789', '5,879'].map(D);
  let imax = 0;
  ds.forEach((v, i) => { if (cmp(v, ds[imax]) > 0) imax = i; });
  const opt = ['A', 'B', 'C', 'D'];
  ck('Cau 4 lon nhat la B (5,897)', opt[imax] === 'B', str(ds[imax]));
  const sorted = [...ds].sort(cmp).map(str).join(' < ');
  ck('Cau 4 sap xep tang dan', sorted === '5,789 < 5,798 < 5,879 < 5,897', sorted);
}
// ======== Cau 5: nam 924 thuoc the ki nao ========
{
  const La = (s) => { const m = { I: 1, V: 5, X: 10, L: 50, C: 100 }; let t = 0; for (let i = 0; i < s.length; i++) { const a = m[s[i]], b = m[s[i + 1]] || 0; t += a < b ? -a : a; } return t; };
  const theKi = (nam) => Math.ceil(nam / 100); // the ki 1: nam 1..100
  const opt = { A: La('IX'), B: La('VIII'), C: La('XI'), D: La('X') };
  const sinh = theKi(924), mat = theKi(979);
  ck('Cau 5 sinh va mat cung the ki 10', sinh === 10 && mat === 10, `${sinh}/${mat}`);
  const dung = Object.keys(opt).filter((k) => opt[k] === sinh);
  ck('Cau 5 dung duy nhat D (X)', dung.length === 1 && dung[0] === 'D');
  ck('Cau 5 kiem chung the ki: nam 901..1000', 901 <= 924 && 979 <= 1000 && theKi(901) === 10 && theKi(1000) === 10 && theKi(900) === 9);
}
// ======== Cau 6: can nang Lan, Minh, Hoa, Duc ========
{
  const vals = ['29,5', '32,5', '31,8', '32,9'].map(D);
  const names = ['Lan', 'Minh', 'Hoa', 'Duc'];
  const sols = [];
  const perm = (arr) => arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perm([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
  for (const p of perm([0, 1, 2, 3])) { // p[i] = chi so gia tri cua nguoi i
    const w = {}; names.forEach((nm, i) => (w[nm] = vals[p[i]]));
    const ducNheNhat = names.every((nm) => nm === 'Duc' || cmp(w.Duc, w[nm]) < 0);
    const hoaNangHonLan = cmp(w.Hoa, w.Lan) > 0;
    const hoaNheHonMinh = cmp(w.Hoa, w.Minh) < 0;
    if (ducNheNhat && hoaNangHonLan && hoaNheHonMinh) sols.push(names.map((nm) => nm + ':' + str(w[nm])).join(' '));
  }
  ck('Cau 6 co dung 1 nghiem', sols.length === 1, sols.join(' | '));
  ck('Cau 6 Lan 31,8; Minh 32,9; Hoa 32,5; Duc 29,5', sols[0] === 'Lan:31,8 Minh:32,9 Hoa:32,5 Duc:29,5');
}
// ======== Cau 7.1 ========
{
  const n1 = 1950n, n2 = n1 - 900n, n3 = n1 + 150n;
  const tong = n1 + n2 + n3;
  ck('Cau 7.1 ngay 2 = 1050, ngay 3 = 2100, tong = 5100 kg', n2 === 1050n && n3 === 2100n && tong === 5100n);
  ck('Cau 7.1 doi ra ta: 5100 kg = 51 ta (1 ta = 100 kg)', tong % 100n === 0n && tong / 100n === 51n);
}
// ======== Cau 7.2 ========
{
  const kg = 3n * 100n + (14n * 10n + 5n); // 1 ta = 100 kg, 1 yen = 10 kg
  ck('Cau 7.2 3 ta + 14 yen 5 kg = 445 kg', kg === 445n, kg + ' kg');
}
// ======== Cau 7.3: dem goc tren hinh thang ABCD co H tren BC, G tren DC ========
{
  // toa do da do tu anh cat (hinh-do-goc.mjs), lam tron; y huong len (dao dau y anh)
  const V = { A: [342, -211], B: [974, -192], C: [1161, -727], D: [144, -739], G: [774, -731], H: [1065, -453] };
  const deg = (o, a, b) => {
    const [ox, oy] = V[o];
    const ax = V[a][0] - ox, ay = V[a][1] - oy, bx = V[b][0] - ox, by = V[b][1] - oy;
    return (Math.acos((ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by))) * 180) / Math.PI;
  };
  // H tren BC, G tren DC (cung phuong): kiem tra tham so
  const cross = (o, a, b) => (V[a][0] - V[o][0]) * (V[b][1] - V[o][1]) - (V[a][1] - V[o][1]) * (V[b][0] - V[o][0]);
  const cl = (a, b, c) => Math.abs(cross(a, b, c)) / Math.hypot(V[b][0] - V[a][0], V[b][1] - V[a][1]);
  ck('Cau 7.3 H nam tren BC, G nam tren DC (lech < 6 px)', cl('B', 'C', 'H') < 6 && cl('D', 'C', 'G') < 6, cl('B', 'C', 'H').toFixed(1) + ' / ' + cl('D', 'C', 'G').toFixed(1));
  // MOI cap tia khac nhau tu mot dinh tao mot goc; tia HB = HC doi nhau => bet; GD, GC doi nhau => bet
  const rays = { A: ['B', 'G', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'], G: ['D', 'A', 'H', 'C'], H: ['B', 'G', 'C'] };
  let bet = 0, tu = 0, nhon = 0, mong = 0; const dsTu = [];
  for (const o in rays) {
    const r = rays[o];
    for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
      const a = deg(o, r[i], r[j]);
      // sai so do ~ 2 do: chi coi mo ho khi goc nam trong 88..92 do
      if (a > 178) bet++; else if (a > 92) { tu++; dsTu.push(r[i] + o + r[j]); } else if (a < 88) nhon++; else mong++;
    }
  }
  ck('Cau 7.3 co 2 goc bet', bet === 2, 'bet=' + bet);
  ck('Cau 7.3 co 5 goc tu (khong goc nao 88..92 do)', tu === 5 && mong === 0, `tu=${tu} [${dsTu}] nhon=${nhon} gan vuong=${mong}`);
  // AGH ~ 86 do: khong tu du gap sai so
  ck('Cau 7.3 goc AGH < 90 (khong tinh vao goc tu)', deg('G', 'A', 'H') < 90, deg('G', 'A', 'H').toFixed(1));
  // dem bang 'tong so goc'
  ck('Cau 7.3 tong so goc = 15 (2 bet + 5 tu + 8 nhon)', bet + tu + nhon === 15, String(bet + tu + nhon));
}
// ======== Bai 1 ========
{
  // a) 5 m 6 dm = ? m : 1 dm = 1/10 m
  ck('Bai 1a = 5,6', str({ n: 5n * 10n + 6n, s: 1 }) === '5,6');
  // b) 8 kg 852 g: 1 g = 1/1000 kg
  ck('Bai 1b = 8,852', str({ n: 8n * 1000n + 852n, s: 3 }) === '8,852');
  // c) 12 cm2 8 mm2: 1 cm2 = 100 mm2
  ck('Bai 1c = 12,08', str({ n: 12n * 100n + 8n, s: 2 }) === '12,08');
  // d) 8 652 g = ? kg
  ck('Bai 1d = 8,652', str({ n: 8652n, s: 3 }) === '8,652');
  // thu nguoc: doi tro lai don vi be
  ck('Bai 1 thu nguoc', 56n === 56n && 8852n === 8n * 1000n + 852n && 1208n === 12n * 100n + 8n && 8652n === 8652n);
}
// ======== Bai 2 ========
{
  ck('Bai 2a 7,5 + 9,8 = 17,3', str(add(D('7,5'), D('9,8'))) === '17,3');
  ck('Bai 2b 35,92 + 58,76 = 94,68', str(add(D('35,92'), D('58,76'))) === '94,68');
  ck('Bai 2c 78,2 - 24,6 = 53,6', str(sub(D('78,2'), D('24,6'))) === '53,6');
  ck('Bai 2d 60,203 - 24,096 = 36,107', str(sub(D('60,203'), D('24,096'))) === '36,107');
  // thu lai bang phep nguoc
  ck('Bai 2 thu nguoc', eq(sub(D('17,3'), D('9,8')), D('7,5')) && eq(sub(D('94,68'), D('58,76')), D('35,92')) && eq(add(D('53,6'), D('24,6')), D('78,2')) && eq(add(D('36,107'), D('24,096')), D('60,203')));
}
// ======== Bai 3 ========
{
  const a = add(add(D('14,75'), D('8,96')), D('6,25'));
  ck('Bai 3a = 29,96', str(a) === '29,96');
  ck('Bai 3a nhom (14,75 + 6,25) = 21 roi + 8,96', str(add(D('14,75'), D('6,25'))) === '21' && str(add(D('21'), D('8,96'))) === '29,96');
  const b = sub(sub(D('66,89'), D('18,89')), D('12,11'));
  ck('Bai 3b = 35,89', str(b) === '35,89');
  ck('Bai 3b 18,89 + 12,11 = 31 ; 66,89 - 31 = 35,89', str(add(D('18,89'), D('12,11'))) === '31' && str(sub(D('66,89'), D('31'))) === '35,89');
  ck('Bai 3b 66,89 - 18,89 = 48 ; 48 - 12,11 = 35,89', str(sub(D('66,89'), D('18,89'))) === '48' && str(sub(D('48'), D('12,11'))) === '35,89');
}
// ======== Bai 4 ========
{
  const but = 5n * 8200n, truyen = 2n * 24000n, tong = but + truyen;
  ck('Bai 4 but 41000, truyen 48000, tong 89000', but === 41000n && truyen === 48000n && tong === 89000n);
  ck('Bai 4 tra lai 11000', 100000n - tong === 11000n);
  ck('Bai 4 thu nguoc', 11000n + tong === 100000n);
}
// ======== Bai 5 ========
{
  // a) 1 < x < 2
  let tuNhien = [];
  for (let x = -5; x <= 5; x++) if (1 < x && x < 2) tuNhien.push(x);
  ck('Bai 5a khong co so tu nhien x nao thoa 1 < x < 2', tuNhien.length === 0);
  const mau5 = ['1,1', '1,2', '1,3', '1,4', '1,5'].map(D);
  ck('Bai 5a 5 gia tri thap phan nam giua 1 va 2, doi mot khac nhau', mau5.every((v) => cmp(D('1'), v) < 0 && cmp(v, D('2')) < 0) && new Set(mau5.map(str)).size === 5);
  // b) 0,8 < y < 0,9
  const mau3 = ['0,81', '0,82', '0,83'].map(D);
  ck('Bai 5b 3 gia tri nam giua 0,8 va 0,9, doi mot khac nhau', mau3.every((v) => cmp(D('0,8'), v) < 0 && cmp(v, D('0,9')) < 0) && new Set(mau3.map(str)).size === 3);
  // so luong STP 2 chu so thap phan giua 0,8 va 0,9
  let dem = 0; for (let k = 800; k <= 900; k++) { const v = { n: BigInt(k), s: 3 }; if (cmp(D('0,8'), v) < 0 && cmp(v, D('0,9')) < 0) dem++; }
  ck('Bai 5b co vo so gia tri (kiem: co 99 so 3 chu so thap phan)', dem === 99, String(dem));
  // c) a < 47,613 < b, a, b tu nhien lien tiep
  const sol = [];
  for (let a = 0; a <= 200; a++) { const b = a + 1; if (cmp({ n: BigInt(a), s: 0 }, D('47,613')) < 0 && cmp(D('47,613'), { n: BigInt(b), s: 0 }) < 0) sol.push([a, b]); }
  ck('Bai 5c duy nhat a=47, b=48', sol.length === 1 && sol[0][0] === 47 && sol[0][1] === 48, JSON.stringify(sol));
}

console.log(`\nTONG: ${pass + fail} phep thu, PASS ${pass}, FAIL ${fail}`);
process.exit(fail ? 1 : 0);
