// me4-kiem-cd10.mjs — máy kiểm đáp số CĐ10 "Phân số" (ME4). Mọi hàm tính TỪ ĐỀ bằng phân số BigInt chính xác
// (thay ngược, quét lưới hữu tỉ, vét cạn), không chép lời giải / đáp án của sách.
// Với các dãy có dấu "…": máy dựng dãy theo quy luật rồi KIỂM nó khớp đúng các số hạng đề in (đầu và cuối) trước khi cộng.

const dung = (dk, msg) => { if (!dk) throw new Error(msg) }
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
class Q {
  constructor(n, d = 1n) { n = BigInt(n); d = BigInt(d); dung(d !== 0n, 'mẫu bằng 0'); if (d < 0n) { n = -n; d = -d } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g }
  add(o) { o = q(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { o = q(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { o = q(o); return new Q(this.n * o.n, this.d * o.d) }
  div(o) { o = q(o); return new Q(this.n * o.d, this.d * o.n) }
  cmp(o) { o = q(o); const a = this.n * o.d, b = o.n * this.d; return a < b ? -1 : a > b ? 1 : 0 }
  eq(o) { return this.cmp(o) === 0 }
  lt(o) { return this.cmp(o) < 0 }
  toString() { return this.d === 1n ? String(this.n) : `${this.n}/${this.d}` }
}
const q = (n, d = 1n) => (n instanceof Q ? n : new Q(n, d))
const tong = (ds) => ds.reduce((s, x) => s.add(x), q(0))
const tich = (ds) => ds.reduce((s, x) => s.mul(x), q(1))
const dayso = (tu, den, buoc = 1) => { const r = []; for (let k = tu; k <= den; k += buoc) r.push(k); return r }
/** kiểm dãy dựng theo quy luật khớp các mẫu số đề in (các mẫu in ra, theo thứ tự đầu dãy + mẫu cuối) */
const khopMau = (mau, dauIn, cuoiIn) => { dung(dauIn.every((v, i) => mau[i] === v), `quy luật lệch số hạng đầu: ${mau.slice(0, dauIn.length)}`); dung(mau[mau.length - 1] === cuoiIn, `quy luật lệch số hạng cuối: ${mau[mau.length - 1]}`) }
const pq = (a, b) => `${a}/${b}`

// phân số in trong đề (giữ nguyên dạng chưa rút gọn) để so sánh
const soSanh = (a, b) => { const x = q(a[0], a[1]), y = q(b[0], b[1]); const c = x.cmp(y); return [`${pq(...a)}${c < 0 ? '<' : c > 0 ? '>' : '='}${pq(...b)}`] }

// quét x hữu tỉ p/q (q ≤ 60, p ≤ 300) thoả f(x) = rhs ; trả danh sách x đã rút gọn (không trùng)
function quet(f, ten) {
  const ra = new Map()
  for (let d = 1n; d <= 60n; d++) for (let p = 0n; p <= 300n; p++) { const x = new Q(p, d); try { if (f(x)) ra.set(x.toString(), x) } catch { /* x không hợp lệ (chia 0) */ } }
  dung(ra.size === 1, `${ten}: tìm thấy ${ra.size} nghiệm (${[...ra.keys()].join(' ; ')})`)
  return [`${ten}=${[...ra.keys()][0]}`]
}
// quét số tự nhiên x trong [0, 3000] thoả dk ; trả "x=a" mỗi nghiệm
const tuNhien = (ten, dk, tu = 0, den = 3000) => { const r = []; for (let x = tu; x <= den; x++) if (dk(BigInt(x))) r.push(`${ten}=${x}`); dung(r.length > 0, `${ten}: không có nghiệm`); return r }

export const KIEM_CD10 = {
  // ---- Bài 1: rút gọn ----
  'CĐ10 · B1a': () => [[49, 28], [22, 55], [18, 24], [26, 39], [80, 64]].map(([a, b]) => q(a, b).toString()),
  'CĐ10 · B1b': () => [[549, 1281], [3672, 4284], [252525, 808080], [165165165n, 462462462n]].map(([a, b]) => q(a, b).toString()),

  // ---- Bài 2–4: tìm x, y, a, b, c, d ----
  'CĐ10 · B2a': () => tuNhien('x', (x) => q(3, 7).eq(q(x, 21))),
  'CĐ10 · B2b': () => tuNhien('x', (x) => q(x, 8).eq(q(18, 72))),
  'CĐ10 · B2c': () => tuNhien('x', (x) => q(x + 5n, 8).eq(q(9, 12))),
  'CĐ10 · B2d': () => tuNhien('x', (x) => x > 0n && q(60).div(q(x, 3)).eq(12), 1),
  'CĐ10 · B3': () => { const kq = []; for (let x = 1n; x <= 200n; x++) for (let y = 0n; y <= 200n; y++) if (q(2, x).eq(q(y, 6)) && q(y, 6).eq(q(12, 18))) kq.push(`x=${x}`, `y=${y}`); dung(kq.length === 2, 'số nghiệm'); return kq },
  'CĐ10 · B4': () => {
    const kq = {}
    for (let a = 1n; a <= 300n; a++) if (q(4, 6).eq(q(6, a))) kq.a = a
    for (let b = 0n; b <= 300n; b++) if (q(4, 6).eq(q(b, 15))) kq.b = b
    for (let c = 1n; c <= 300n; c++) if (q(4, 6).eq(q(18, c))) kq.c = c
    for (let d = 0n; d <= 300n; d++) if (q(4, 6).eq(q(d, 30))) kq.d = d
    return ['a', 'b', 'c', 'd'].map((k) => `${k}=${kq[k]}`)
  },

  // ---- Bài 5: tìm phân số bằng phân số cho trước ----
  'CĐ10 · B5a': () => [3n, 12n, 24n].map((t) => { const m = []; for (let k = 1n; k <= 1000n; k++) if (q(t, k).eq(q(6, 12))) m.push(k); dung(m.length === 1, 'mẫu không duy nhất'); return pq(t, m[0]) }),
  'CĐ10 · B5b': () => { const kq = []; for (let m = 16; m < 50; m++) for (let t = 1; t <= 100; t++) if (q(t, m).eq(q(5, 8))) kq.push(pq(t, m)); return kq },
  'CĐ10 · B5c': () => { const kq = []; for (let t = 10; t <= 99; t++) if (t % 3 === 0 && t % 4 === 0) for (let m = 1; m <= 1000; m++) if (q(t, m).eq(q(68, 119))) kq.push(pq(t, m)); return kq },

  // ---- Bài 6: bớt cùng số ở mẫu ----
  'CĐ10 · B6': () => { const kq = []; for (let s = 0n; s < 12n; s++) if (q(8, 12n - s).eq(q(4, 3))) kq.push(String(s)); dung(kq.length === 1, 'số nghiệm'); return kq },

  // ---- Bài 7: lập phân số từ các số có ba chữ số khác nhau tạo bởi 2;0;3;4;6, giá trị 1/2 ----
  'CĐ10 · B7': () => {
    const cs = [2, 0, 3, 4, 6], so = []
    for (const a of cs) for (const b of cs) for (const c of cs) if (a !== 0 && a !== b && b !== c && a !== c) so.push(100 * a + 10 * b + c)
    const kq = []
    for (const t of so) for (const m of so) if (t !== m && q(t, m).eq(q(1, 2))) kq.push(pq(t, m))
    return kq
  },

  // ---- Bài 8: tìm số tự nhiên x ----
  'CĐ10 · B8a': () => tuNhien('x', (x) => x > 0n && q(2, x).cmp(q(1, 2)) > 0, 1),
  'CĐ10 · B8b': () => tuNhien('x', (x) => x > 0n && q(1).cmp(q(11, x)) < 0 && q(11, x).cmp(2) < 0, 1),
  'CĐ10 · B8c': () => tuNhien('x', (x) => q(8, 202).lt(q(x * 6n, 303)) && q(x * 6n, 303).lt(q(9, 101))),

  // ---- Bài 9: phân số nằm giữa — mẫu chung nhỏ nhất để đủ số phân số, liệt kê tử số liên tiếp ----
  'CĐ10 · B9a': () => { for (let k = 1; k <= 100; k++) { const mau = 9 * k, l = []; for (let t = 1; t < 10 * mau; t++) if (q(7, 9).lt(q(t, mau)) && q(t, mau).lt(q(8, 9))) l.push(pq(t, mau)); if (l.length >= 7) { dung(l.length === 7, 'không đúng 7'); return l } } throw new Error('không thấy') },
  'CĐ10 · B9b': () => { for (let k = 1; k <= 100; k++) { const mau = 4 * k, l = []; for (let t = 1; t < 10 * mau; t++) if (q(1).lt(q(t, mau)) && q(t, mau).lt(q(5, 4))) l.push(pq(t, mau)); if (l.length >= 8) { dung(l.length === 8, 'không đúng 8'); return l } } throw new Error('không thấy') },

  // ---- Bài 10: chữ số x ----
  'CĐ10 · B10': () => { const kq = []; for (let x = 0; x <= 9; x++) if (q(24507 * 10 + x, 1945).lt(q(735213, 5835))) kq.push(`x=${x}`); return kq },
  // ---- Bài 11: thêm x vào cả tử và mẫu ----
  'CĐ10 · B11': () => tuNhien('x', (x) => q(39n + x, 64n + x).eq(q(3, 4))),
  // ---- Bài 12: so sánh với 1 ----
  'CĐ10 · B12': () => { const c = q(1991 * 1999, 1995 * 1995).cmp(1); return [c < 0 ? 'Bé hơn 1' : c > 0 ? 'Lớn hơn 1' : 'Bằng 1'] },

  // ---- Bài 13: 156 / (327 − x), x tự nhiên, mẫu phải là số tự nhiên khác 0 nên x ≤ 326 ----
  'CĐ10 · B13a': () => { let tot = null, vt = null; for (let x = 0n; x <= 326n; x++) { const v = q(156, 327n - x); if (!tot || v.cmp(tot) > 0) { tot = v; vt = x } } return [`x=${vt}`, tot.toString()] },
  'CĐ10 · B13b': () => { let tot = null, vt = null; for (let x = 0n; x <= 326n; x++) { const v = q(156, 327n - x); if (!tot || v.cmp(tot) < 0) { tot = v; vt = x } } return [`x=${vt}`, tot.toString()] },

  // ---- Bài 14: so sánh hai phân số (giữ dạng đề in) ----
  'CĐ10 · B14a': () => soSanh([997, 999], [1993, 1995]),
  'CĐ10 · B14b': () => soSanh([13, 27], [27, 41]),
  'CĐ10 · B14c': () => soSanh([27, 13], [41, 27]),
  'CĐ10 · B14d': () => soSanh([15, 11], [25, 21]),
  'CĐ10 · B14e': () => soSanh([27, 13], [35, 17]),
  'CĐ10 · B14f': () => soSanh([42, 211], [63, 314]),

  // ---- Bài 15: tìm x — quét lưới hữu tỉ p/q (q ≤ 60, p ≤ 300), thay ngược vào đề ----
  'CĐ10 · B15a': () => quet((x) => tong([q(1, 2), q(1, 3), q(1, 4)]).mul(x).eq(q(1).add(q(2, 3)).add(q(1, 2))), 'x'),
  'CĐ10 · B15b': () => quet((x) => tong([q(1, 2), q(1, 3)]).sub(q(1, 4)).div(x).eq(q(1, 6).add(q(1, 9)).sub(q(1, 12))), 'x'),
  'CĐ10 · B15c': () => quet((x) => q(4, 7).add(q(2, 3)).div(x.add(q(1, 2))).eq(q(8, 7).add(q(4, 3))), 'x'),
  'CĐ10 · B15d': () => quet((x) => q(3, 5).add(q(2, 7).div(x)).eq(1), 'x'),
  'CĐ10 · B15e': () => quet((x) => q(6, 5).sub(x.div(q(1, 2))).eq(q(1, 2)), 'x'),

  // ---- Bài 16: \overline{2ab}/19 − m/n, quên chữ số 2 ở tử số của số bị trừ, kết quả sai = 29/38; tìm hiệu đúng ----
  'CĐ10 · B16': () => {
    const dung_ = new Map()
    for (let ab = 10; ab <= 99; ab++) for (let n = 1; n <= 200; n++) for (let m = 0; m <= 400; m++) {
      if (q(ab, 19).sub(q(m, n)).eq(q(29, 38))) dung_.set(q(200 + ab, 19).sub(q(m, n)).toString(), 1)
    }
    dung(dung_.size === 1, `hiệu đúng không duy nhất: ${[...dung_.keys()]}`)
    return [...dung_.keys()]
  },

  // ---- Bài 17: tính ----
  'CĐ10 · B17a': () => [tong([q(3, 5), q(4, 7), q(2, 5), q(1, 7), q(2, 7)]).toString()],
  'CĐ10 · B17b': () => [q(17, 12).add(q(9, 7)).sub(q(8, 7).sub(q(7, 12))).toString()],
  'CĐ10 · B17c': () => [q(7, 8).div(q(14, 3).add(q(7, 2))).add(q(4, 28)).toString()],
  'CĐ10 · B17d': () => [tong([q(175, 100), q(18, 21), q(45, 32), q(5, 4), q(1, 7)]).sub(q(13, 32)).toString()],

  // ---- Bài 18: giá trị biểu thức (nhân chia từ trái sang phải) ----
  'CĐ10 · B18a': () => [q(2).mul(q(3, 16)).mul(q(4, 15)).mul(5).toString()],
  'CĐ10 · B18b': () => [q(6, 7).mul(q(14, 9)).mul(q(3, 18)).toString()],
  'CĐ10 · B18c': () => [tich([q(13, 14), q(17, 4), q(56, 15), q(70, 39), q(21, 34), q(25, 49)]).toString()],
  'CĐ10 · B18d': () => [q(1 * 3 * 5 + 2 * 6 * 10 + 3 * 9 * 15, 3 * 5 * 12 + 6 * 10 * 24 + 9 * 15 * 36).toString()],
  'CĐ10 · B18e': () => { const tu = ((1248n * 625n) / 5n) * 4n * 2n, mau = (((2n * 312n * 125n) / 25n)) * 10n; return [q(tu, mau).toString()] },

  // ---- Bài 19: tích dãy (1 ± 1/…) ----
  'CĐ10 · B19a': () => [tich(dayso(91, 647).map((k) => q(1).add(q(1, k)))).toString()],
  'CĐ10 · B19b': () => [tich(dayso(97, 1000).map((k) => q(1).sub(q(1, k)))).toString()],
  'CĐ10 · B19c': () => { const mau = dayso(1, 99).map((k) => k * (k + 2)); khopMau(mau, [3, 8, 15], 9999); return [tich(mau.map((m) => q(1).add(q(1, m)))).toString()] },
  'CĐ10 · B19d': () => { const mau = dayso(1, 100).map((k) => k * (k + 8)); khopMau(mau, [9, 20, 33], 10800); return [tich(mau.map((m) => q(1).add(q(7, m)))).toString()] },

  // ---- Bài 20: tính tổng dãy ----
  'CĐ10 · B20a': () => { const mau = []; for (let k = 0, p = 1; k <= 7; k++, p *= 5) mau.push(p); khopMau(mau, [1, 5, 25, 125, 625], 78125); return [tong(mau.map((m) => q(1, m))).toString()] },
  'CĐ10 · B20b': () => { const mau = []; for (let k = 0, p = 3; k <= 7; k++, p *= 2) mau.push(p); khopMau(mau, [3, 6, 12, 24], 384); return [tong(mau.map((m) => q(5, m))).toString()] },
  'CĐ10 · B20c': () => { const mau = dayso(1, 49, 2).map((k) => k * (k + 2)); khopMau(mau, [3, 15], 49 * 51); return [tong(mau.map((m) => q(4, m))).toString()] },
  'CĐ10 · B20d': () => { const mau = dayso(2, 98, 3).map((k) => k * (k + 3)); khopMau(mau, [10, 40, 88], 98 * 101); return [tong(mau.map((m) => q(1, m))).toString()] },
  'CĐ10 · B20e': () => { const mau = dayso(4, 34, 5).map((k) => k * (k + 5)); khopMau(mau, [36, 126, 266], 34 * 39); return [tong(mau.map((m) => q(3, m))).toString()] },

  // ---- Bài 21: tìm y — tổng nhiều ngoặc (y + 1/2^k) = 1 ----
  'CĐ10 · B21a': () => y1d([2, 4, 8, 16]),
  'CĐ10 · B21b': () => { const p = dayso(1, 10).map((k) => 2 ** k); khopMau(p, [2, 4, 8], 1024); return y1d(p) },

  // ---- Bài 22: chứng tỏ tổng nhỏ hơn 1 / 1/2 — máy tính tổng đúng rồi so sánh ----
  'CĐ10 · B22a': () => { const mau = dayso(1, 11).map((k) => 2 ** k); khopMau(mau, [2, 4, 8], 2048); return [tong(mau.map((m) => q(1, m))).lt(1) ? 'A<1' : 'không'] },
  'CĐ10 · B22b': () => { const mau = []; for (let k = 1, p = 3; k <= 8; k++, p *= 3) mau.push(p); khopMau(mau, [3, 9, 27], 6561); return [tong(mau.map((m) => q(1, m))).lt(q(1, 2)) ? 'B<1/2' : 'không'] },

  // ---- Bài 23: tính tổng dãy ----
  'CĐ10 · B23a': () => { const mau = dayso(2, 98, 2).map((k) => (k * (k + 2)) / 2); khopMau(mau, [4, 12, 24, 40], 4900); return [tong(mau.map((m) => q(1, m))).toString()] },
  'CĐ10 · B23b': () => b23(),
  'CĐ10 · B23c': () => { const mau = dayso(1, 21, 4).map((k) => 2 * k * (k + 4)); khopMau(mau, [10, 90, 234], 1050); return [tong(mau.map((m) => q(3, m))).toString()] },
  'CĐ10 · B23d': () => { const mau = dayso(1, 41, 5).map((k) => k * (k + 5)); khopMau(mau, [6, 66, 176, 336], 1886); return [tong(mau.map((m) => q(1, m))).toString()] },
  'CĐ10 · B23e': () => { const mau = dayso(1, 10).map((k) => 2 ** k); const tu = mau.map((m) => m + 1); dung(tu[0] === 3 && tu[1] === 5 && tu[2] === 9 && tu[3] === 17 && tu[9] === 1025 && mau[9] === 1024, 'quy luật lệch'); return [tong(mau.map((m, i) => q(tu[i], m))).toString()] },
  'CĐ10 · B23f': () => { const mau = []; for (let k = 0, p = 1; k <= 9; k++, p *= 3) mau.push(p); dung(mau[1] === 3 && mau[2] === 9 && mau[3] === 27 && mau[8] === 6561 && mau[9] === 19683, 'quy luật lệch'); return [tong(mau.map((m, i) => (i % 2 === 0 ? q(1, m) : q(-1, m)))).toString()] },

  // ---- Bài 24: tìm y ----
  'CĐ10 · B24a': () => { const mau = dayso(1, 22, 3).map((k) => k * (k + 3)); khopMau(mau, [4, 28, 70], 550); return [`y=${q(1).div(tong(mau.map((m) => q(1, m)))).toString()}`] },
  'CĐ10 · B24b': () => { const mau = dayso(1, 11).map((k) => k * (k + 1)); khopMau(mau, [2, 6, 12, 20], 132); return [`y=${tong(mau.map((m) => q(1, m))).div(tong([2, 4, 8, 16].map((m) => q(1, m)))).toString()}`] },

  // ---- Bài 25: tìm y (số tự nhiên) trong tổng dãy ----
  'CĐ10 · B25a': () => { const kq = []; for (let y = 1; y <= 600; y += 3) { const mau = dayso(1, y, 3).map((k) => k * (k + 3)); if (mau.slice(0, 4).join() !== '4,28,70,130' && mau.length >= 4) throw new Error('quy luật lệch'); if (tong(mau.map((m) => q(1, m))).eq(q(34, 103))) kq.push(`y=${y}`) } dung(kq.length === 1, 'nghiệm'); return kq },
  'CĐ10 · B25b': () => { const kq = []; for (let y = 2; y <= 5000; y++) { const mau = dayso(2, y).map((k) => (k * (k + 1)) / 2); if (mau.slice(0, 4).join() !== '3,6,10,15' && mau.length >= 4) throw new Error('quy luật lệch'); if (tong(mau.map((m) => q(1, m))).eq(q(2009, 2011))) kq.push(`y=${y}`) } dung(kq.length === 1, 'nghiệm'); return kq },
}

// B23b: 1/2 + 1/14 + 1/35 + 1/65 + … + 1/4850. Mẫu thứ i = (k·(k+3)) / 2 · ... — máy dựng: số hạng = 2/(k(k+3)) với k = 1; 4; 7; …; 97 rồi kiểm 4 số hạng đầu và số cuối khớp đề in.
function b23() {
  const ks = dayso(1, 97, 3)
  const hang = ks.map((k) => q(2, k * (k + 3)))   // 2/(1·4)=1/2 ; 2/(4·7)=1/14 ; 2/(7·10)=1/35 ; 2/(10·13)=1/65 ; … ; 2/(97·100)=1/4850
  dung(hang[0].eq(q(1, 2)) && hang[1].eq(q(1, 14)) && hang[2].eq(q(1, 35)) && hang[3].eq(q(1, 65)) && hang[hang.length - 1].eq(q(1, 4850)), 'quy luật B23b lệch đề')
  return [tong(hang).toString()]
}


// tìm y = 1/d (d số tự nhiên ≤ 12000) thoả tổng các (y + 1/m) = 1 — thay ngược, không giải đại số
function y1d(mau) { const ra = []; for (let d = 1n; d <= 12000n; d++) { const y = q(1, d); if (tong(mau.map((m) => y.add(q(1, m)))).eq(1)) ra.push(y.toString()) } dung(ra.length === 1, `nghiệm: ${ra}`); return [`y=${ra[0]}`] }