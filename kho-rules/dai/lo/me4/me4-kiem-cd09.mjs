// me4-kiem-cd09.mjs — máy kiểm đáp số CĐ9 "Dãy số" (ME4). Mọi hàm tính TỪ ĐỀ (dựng dãy, vét cạn, mô phỏng), không chép lời giải / đáp án của sách.
// Với bài "tìm quy luật": máy thử một quy luật rồi KIỂM nó tái tạo đúng các số đã cho của đề, sau đó mới sinh ba số tiếp theo.

const dung = (dk, msg) => { if (!dk) throw new Error(msg) }

/** Quy luật cho trước: f(mảng các số đã có) -> số kế tiếp. Kiểm f tái tạo đúng các số hạng đề cho (từ số hạng thứ `batDau`), rồi sinh thêm k số. */
function viet(de, f, k = 3, batDau = 1) {
  const a = de.slice(0, batDau)
  for (let i = batDau; i < de.length; i++) { dung(f(a) === de[i], `quy luật không khớp số hạng thứ ${i + 1}`); a.push(de[i]) }
  const them = []
  for (let i = 0; i < k; i++) { const x = f(a); a.push(x); them.push(x) }
  return [them.join(';')]
}
const sau = (a, n = 1) => a[a.length - n]

/** Dãy cách đều: dựng danh sách số hạng, từ số đầu, khoảng cách d, n số hạng. */
const cachDeu = (dau, d, n) => Array.from({ length: n }, (_, i) => dau + i * d)
const chuSo = (n) => String(n).length
const noi = (tu, den, loc = () => true) => { let s = ''; for (let i = tu; i <= den; i++) if (loc(i)) s += i; return s }
const dem = (s, c) => [...s].filter((x) => x === c).length

export const KIEM_CD09 = {
  // ---- Bài 1: tìm quy luật, viết thêm 3 số hạng ----
  'CĐ9 · B1a': () => viet([1, 3, 4, 7, 11, 18], (a) => sau(a) + sau(a, 2), 3, 2),
  'CĐ9 · B1b': () => viet([0, 2, 4, 6, 12, 22], (a) => sau(a) + sau(a, 2) + sau(a, 3), 3, 3),
  'CĐ9 · B1c': () => viet([0, 3, 7, 12], (a) => sau(a) + a.length + 2, 3, 1),   // số cộng thêm lần lượt 3, 4, 5, …
  'CĐ9 · B1d': () => viet([1, 2, 6, 24], (a) => sau(a) * (a.length + 1), 3, 1),
  'CĐ9 · B1e': () => viet([100, 93, 85, 76], (a) => sau(a) - (a.length + 6), 3, 1),   // số trừ đi lần lượt 7, 8, 9, …
  'CĐ9 · B1f': () => viet([10, 13, 18, 26], (a) => sau(a) + sau(a, 2) - 5, 3, 2),
  'CĐ9 · B1g': () => viet([0, 1, 4, 9, 16], (a) => (a.length) * (a.length), 3, 1),
  'CĐ9 · B1h': () => viet([1, 3, 3, 9, 27], (a) => sau(a) * sau(a, 2), 3, 2),
  'CĐ9 · B1i': () => viet([1, 1, 3, 5, 17], (a) => sau(a) * sau(a, 2) + 2, 3, 2),

  // ---- Bài 2: dãy cách đều có 10 số hạng, biết 3 số hạng cuối ----
  'CĐ9 · B2a': () => { const d = 36 - 32; dung(40 - 36 === d, 'không cách đều'); const a = []; for (let v = 40, i = 0; i < 10; i++, v -= d) a.unshift(v); return [a[0]] },
  'CĐ9 · B2b': () => { const d = 49 - 44; dung(54 - 49 === d, 'không cách đều'); const a = []; for (let v = 54, i = 0; i < 10; i++, v -= d) a.unshift(v); return [a[0]] },

  // ---- Bài 3: ô trống, tổng 3 ô liên tiếp = 2014; vét cạn ô đầu rồi suy các ô sau theo cửa sổ ----
  'CĐ9 · B3': () => {
    const kq = []
    for (let x = 0; x <= 2014; x++) {
      const a = [x, 996]
      for (let i = 0; i + 2 < 10; i++) a.push(2014 - a[i] - a[i + 1])
      if (a[5] === 496 && a.every((v) => v >= 0)) kq.push(a.join(';'))
    }
    dung(kq.length === 1, `có ${kq.length} cách điền`)
    return kq
  },

  // ---- Bài 4 ----
  'CĐ9 · B4a': () => { const a = cachDeu(1, 5, 32); dung(a.slice(0, 6).join() === '1,6,11,16,21,26', 'dãy lệch đề'); return [a[31]] },
  'CĐ9 · B4b': () => { const a = [1]; while (a.length < 50) a.push(sau(a) + a.length); dung(a.slice(0, 6).join() === '1,2,4,7,11,16', 'dãy lệch đề'); return [a[49]] },
  'CĐ9 · B4c': () => { const a = [3]; while (a.length < 30) a.push(sau(a) + 2 * a.length - 1); dung(a.slice(0, 5).join() === '3,4,7,12,19', 'dãy lệch đề'); return [a[29]] },
  'CĐ9 · B4d': () => { const d = 601 - 595; dung(595 - 589 === d, 'không cách đều'); const a = []; for (let v = 601, i = 0; i < 100; i++, v -= d) a.unshift(v); return [a[59]] },

  // ---- Bài 5: đếm bằng vét cạn ----
  'CĐ9 · B5a': () => { let c = 0; for (let n = 100; n <= 999; n++) if (n % 5 === 0) c++; return [c] },
  'CĐ9 · B5b': () => { let c = 0; for (let n = 1; n <= 2024; n++) if (n % 2 === 0 && n % 3 !== 0) c++; return [c] },
  'CĐ9 · B5c': () => { let c = 0, t = 0; for (let n = 100; n <= 999; n++) if (n % 3 === 2) { c++; t += n } return [c, t] },

  // ---- Bài 6: dãy 4; 9; 14; 19; 24 ----
  'CĐ9 · B6a': () => viet([4, 9, 14, 19, 24], (a) => sau(a) + 5, 3, 1),
  'CĐ9 · B6b': () => { const a = cachDeu(4, 5, 150); dung(a.slice(0, 5).join() === '4,9,14,19,24', 'dãy lệch đề'); return [a[149]] },
  'CĐ9 · B6c': () => { const a = cachDeu(4, 5, 500); return [a.includes(2023) ? 'Có' : 'Không'] },

  // ---- Bài 7–9: đếm chữ số khi viết liền ----
  'CĐ9 · B7a': () => { let s = 0; for (let n = 1; n <= 1000; n++) s += chuSo(n); return [s] },
  'CĐ9 · B7b': () => { let s = 0; for (let n = 0; n <= 2024; n += 2) s += chuSo(n); return [s] },
  'CĐ9 · B8': () => { let s = 0; for (let n = 1; n <= 238; n++) s += chuSo(n); return [s] },
  'CĐ9 · B9': () => { let s = 0, n = 0; while (s < 234) { n++; s += chuSo(n) } dung(s === 234, 'không khớp đúng 234 chữ số'); return [n] },
  // Bài 10: dãy 1, 2, 3, … viết liền, lấy chữ số thứ 2024 (đề in "1235678…" thiếu chữ số 4 — hiểu là các số tự nhiên liên tiếp)
  'CĐ9 · B10': () => [noi(1, 2000)[2023]],

  // ---- Bài 11–12: đếm chữ số ----
  'CĐ9 · B11a': () => [noi(1, 2023).length],
  'CĐ9 · B11b': () => { const s = noi(1, 2023); return [dem(s, '5'), dem(s, '1')] },
  'CĐ9 · B12': () => [dem(noi(1, 2024), '0')],

  // ---- Bài 13: mô phỏng xoá ----
  'CĐ9 · B13': () => {
    let con = Array.from({ length: 252 }, (_, i) => i + 1)
    con = con.filter((n) => !(n % 2 === 0 && n % 5 !== 0))
    con = con.filter((n) => !(n % 5 === 0 && n % 2 !== 0))
    return [con.length]
  },

  // ---- Bài 14: dãy 12; 16; 20; … ----
  'CĐ9 · B14a': () => { const a = cachDeu(12, 4, 90); return [a[89]] },
  'CĐ9 · B14b': () => {
    const a = cachDeu(12, 4, 600), ra = []
    for (const x of [2022, 2023, 2024, 2025]) if (a.includes(x)) ra.push(x, a.indexOf(x) + 1)
    return ra.map(String)
  },
  'CĐ9 · B14c': () => [cachDeu(12, 4, 50).reduce((s, v) => s + v, 0)],

  // ---- Bài 15: viết liền các số chẵn 2, 4, 6, … ; chữ số thứ 2000 ----
  'CĐ9 · B15': () => { const s = noi(2, 4000, (n) => n % 2 === 0); dung(s.startsWith('24681012141618202224'), 'chuỗi lệch đề'); return [s[1999]] },

  // ---- Bài 16: tổng 10 + 11 + … + x = 5106 ----
  'CĐ9 · B16': () => { const kq = []; for (let x = 10, t = 0; t <= 5106; x++) { t += x; if (t === 5106) kq.push(x) } dung(kq.length === 1, 'số nghiệm khác 1'); return kq },

  // ---- Bài 17: số 123456789101112… ----
  // a) có đoạn đúng 4 chữ số 1 liền nhau (đoạn cực đại có độ dài 4) không?
  'CĐ9 · B17a': () => { const s = noi(1, 30000); return [/(?:^|[^1])1111(?:[^1]|$)/.test(s) ? 'Có' : 'Không'] },
  // b) "từ chữ số thứ k" theo đúng cách đếm của đề: đề nói ba chữ số 1 liền nhau xuất hiện "từ chữ số thứ 11" — máy xác định cách đếm này
  //    (số chữ số đứng trước nhóm = 11) từ chính đề rồi áp cho nhóm năm chữ số 2.
  'CĐ9 · B17b': () => {
    const s = noi(1, 3000)
    const dau1 = s.indexOf('111')           // vị trí (từ 0) của nhóm ba chữ số 1 đầu tiên = số chữ số đứng trước nhóm
    dung(dau1 === 11, 'cách đếm của đề khác dự kiến')
    return [s.indexOf('22222')]
  },

  // ---- Bài 18–19: nhóm chữ cái lặp ----
  'CĐ9 · B18a': () => ['VUIHOCTOAN'.repeat(300)[2111]],
  'CĐ9 · B18b': () => {
    const mau = ['Đỏ', 'Cam', 'Vàng', 'Lục', 'Lam', 'Tím'], s = 'VUIHOCTOAN'.repeat(400)
    const viTri = (c, k) => { let d = 0; for (let i = 0; i < s.length; i++) if (s[i] === c && ++d === k) return i }
    return [`V:${mau[viTri('V', 150) % 6]}`, `O:${mau[viTri('O', 135) % 6]}`]
  },
  'CĐ9 · B19a': () => [('QUYETTAMHOCGIOI'.repeat(200))[1999]],
  // đếm đúng tại lúc đã viết đến chữ T thứ 100 (dãy dừng ngay ở chữ T đó)
  'CĐ9 · B19b': () => {
    const s = 'QUYETTAMHOCGIOI'.repeat(100); let t = 0, cut = -1
    for (let i = 0; i < s.length; i++) if (s[i] === 'T' && ++t === 100) { cut = i; break }
    const dau = s.slice(0, cut + 1)
    return [dem(dau, 'I'), dem(dau, 'A')].map(String)
  },
  'CĐ9 · B19c': () => {
    const mau = ['Xanh', 'Đỏ', 'Tím', 'Vàng', 'Nâu'], tieng = ['QUYET', 'TAM', 'HOC', 'GIOI']
    const dsTieng = Array.from({ length: 4000 }, (_, i) => tieng[i % 4])
    let y = 0, idx = -1
    for (let i = 0; i < dsTieng.length && idx < 0; i++) for (const ch of dsTieng[i]) if (ch === 'Y' && ++y === 500) idx = i
    return [mau[2022 % 5], mau[idx % 5]]
  },

  // ---- Bài 20: bảng 4 cột xếp ngoằn ngoèo ----
  'CĐ9 · B20': () => {
    const cot = 'ABCD'
    for (let r = 0; r < 600; r++) for (let c = 0; c < 4; c++) {
      const v = r * 4 + (r % 2 === 0 ? c : 3 - c) + 1
      if (v === 2023) return [`Cột ${cot[c]}`]
    }
    throw new Error('không thấy 2023')
  },
}
