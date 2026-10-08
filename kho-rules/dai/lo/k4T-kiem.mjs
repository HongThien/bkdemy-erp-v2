// ============================================================================
// k4T-kiem.mjs — BỘ KIỂM ĐÁP SỐ BẰNG CODE cho các câu 4T (biên bản "kiem-dap-so", cách "code" của cổng ghi).
//
// Mỗi mục: mã nguồn → hàm TỰ TÍNH LẠI đáp số TỪ ĐỀ (vét cạn / thay ngược / mô phỏng), KHÔNG chép các bước của lời giải.
// Hàm trả mảng giá trị phải có mặt trong `dap_an` sắp ghi (so sau khi chuẩn hoá: bỏ $, khoảng trắng, \dfrac{a}{b} → a/b).
// Câu chưa có hàm ⇒ biên bản "khong_kiem_duoc" (cổng vẫn cho ghi, câu mang cờ — không giả vờ đã kiểm).
// ============================================================================
const g = (a, b) => (b ? g(b, a % b) : Math.abs(a))
const P = (n, d = 1) => { const k = g(n, d) || 1; return d < 0 ? [-n / k, -d / k] : [n / k, d / k] }
const cong = (a, b) => P(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), tru = (a, b) => P(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const nhan = (a, b) => P(a[0] * b[0], a[1] * b[1]), chia = (a, b) => P(a[0] * b[1], a[1] * b[0])
const ps = (x) => (x[1] === 1 ? `${x[0]}` : `${x[0]}/${x[1]}`)
const tim = (lo, hi, f) => { const r = []; for (let x = lo; x <= hi; x++) if (f(x)) r.push(x); return r }
const chuSo = (n) => String(n).split('').map(Number)
const khacNhau = (n) => new Set(String(n)).size === String(n).length
const motNghiem = (ds, ten) => { if (ds.length !== 1) throw new Error(`${ten}: vét cạn ra ${ds.length} nghiệm (${ds.slice(0, 5)})`); return ds[0] }
/** số ít nhất phải bốc để CHẮC CHẮN đạt điều kiện = (số bốc nhiều nhất mà vẫn chưa đạt) + 1 — tính bằng vét mọi cách bốc */
const itNhatChacChan = (soLuong, dat) => {
  let maxChuaDat = 0
  const dq = (i, chon) => { if (i === soLuong.length) { const s = chon.reduce((a, b) => a + b, 0); if (!dat(chon) && s > maxChuaDat) maxChuaDat = s; return } for (let k = 0; k <= soLuong[i]; k++) dq(i + 1, [...chon, k]) }
  dq(0, []); return maxChuaDat + 1
}

/**
 * TÌM SỐ theo điều kiện chữ số (chuyên đề 1) — tìm theo từng hàng, lớn nhất thì thử chữ số từ 9 xuống, nhỏ nhất từ 0 lên;
 * cái đầu tiên đi hết là đáp số (thứ tự từ điển = thứ tự số khi cùng số chữ số). Không cho số chữ số (`L` bỏ trống) ⇒
 * lớn nhất = nhiều chữ số nhất còn làm được; nhỏ nhất = ít chữ số nhất.
 * o = { L?, lon, kn (khác nhau), chon (chữ số được dùng), tong, tich, cuoi: 'chan'|'le'|'0', co: { <vị trí từ trái, 0-based>: chữ số } }
 */
export function timSo(o) {
  const chon = o.chon ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const thu = (L) => {
    const kq = []
    const dq = (i, dung, tong, tich) => {
      if (i === L) {
        if (o.tong != null && tong !== o.tong) return false
        if (o.tich != null && tich !== o.tich) return false
        return true
      }
      const conLai = L - i
      if (o.tong != null && (tong > o.tong || o.tong - tong > 9 * conLai)) return false
      if (o.tich != null && (tich === 0 || o.tich % tich !== 0)) return false
      const ds = o.lon ? [...chon].sort((a, b) => b - a) : [...chon].sort((a, b) => a - b)
      for (const d of ds) {
        if (i === 0 && d === 0 && L > 1) continue
        if (o.kn && dung.has(d)) continue
        if (o.co && o.co[i] != null && o.co[i] !== d) continue
        if (i === L - 1 && o.cuoi === 'chan' && d % 2) continue
        if (i === L - 1 && o.cuoi === 'le' && d % 2 === 0) continue
        if (i === L - 1 && o.cuoi === '0' && d !== 0) continue
        kq.push(d); dung.add(d)
        if (dq(i + 1, dung, tong + d, tich * d)) return true
        kq.pop(); if (!kq.includes(d)) dung.delete(d)
      }
      return false
    }
    return dq(0, new Set(), 0, 1) ? Number(kq.join('')) : null
  }
  if (o.L) return thu(o.L)
  const ds = []; for (let L = 1; L <= (o.kn ? Math.min(10, chon.length) : 12); L++) { const v = thu(L); if (v !== null) ds.push(v) }
  if (!ds.length) return null
  return o.lon ? ds[ds.length - 1] : ds[0]
}
/** xoá bớt chữ số, giữ thứ tự: vét mọi dãy con dài `k` (không bắt đầu bằng 0) */
export function dayCon(chuoi, k, lon) {
  let best = null
  const n = chuoi.length
  const dq = (i, cur) => { if (cur.length === k) { if (cur[0] !== '0' && (best === null || (lon ? cur > best : cur < best))) best = cur; return } if (n - i < k - cur.length) return; dq(i + 1, cur + chuoi[i]); dq(i + 1, cur) }
  dq(0, ''); return best
}

/** lịch: tháng dài L ngày, ngày 1 là thứ t1 (0 = Thứ Hai … 6 = Chủ nhật) */
const TEN_THU = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật']
const moiThang = (Ls, f) => { const kq = new Set(); for (const L of Ls) for (let t1 = 0; t1 < 7; t1++) { const thu = (d) => (t1 + d - 1) % 7; const r = f(L, thu); if (r != null) kq.add(r) } return [...kq] }
/** tìm chữ số cho các ô * / chữ cái trong phép tính cột (vét mọi cách điền) — khuon: [ 'a56b7', '6c54d', '95e92' ], phep: '+'|'-' */
const dienChuSo = (khuon, phep) => {
  const bien = [...new Set(khuon.join('').replace(/[0-9]/g, ''))], kq = []
  const dq = (i, gan) => {
    if (i === bien.length) { const so = khuon.map((k) => Number([...k].map((c) => (/\d/.test(c) ? c : gan[c])).join('')))
      if (khuon.some((k, j) => /\D/.test(k[0]) && gan[k[0]] === 0)) return
      if ((phep === '+' ? so[0] + so[1] : so[0] - so[1]) === so[2]) kq.push({ ...gan }); return }
    for (let d = 0; d <= 9; d++) dq(i + 1, { ...gan, [bien[i]]: d })
  }
  dq(0, {}); return kq
}

/** mọi cặp (bé, lớn) có tổng S thoả điều kiện f — vét cạn */
const capTong = (S, f) => { const r = []; for (let a = 0; 2 * a <= S; a++) if (f(a, S - a)) r.push([a, S - a]); return r }

/** số có hai chữ số ab (a ≥ 1) thoả f(a, b, n) — vét cạn */
const hai = (f) => tim(10, 99, (n) => f(Math.floor(n / 10), n % 10, n))
/** đáp án dạng "a=8; b=6": mỗi chữ cái ứng một chữ số của nghiệm */
const chuCai = (ten, n) => [...String(n)].map((d, i) => `${ten[i]}=${d}`)
const tbc = (...a) => a.reduce((x, y) => x + y, 0) / a.length

/** điền chữ số vào khuôn ("83a", "*415*", "2a3b"): mọi số thoả f; chữ số đầu khác 0; mỗi * / chữ cái là một chữ số riêng */
const dien = (khuon, f) => { const r = []; const dq = (i, s) => { if (i === khuon.length) { if (s[0] !== '0' && f(Number(s))) r.push(Number(s)); return } if (/\d/.test(khuon[i])) dq(i + 1, s + khuon[i]); else for (let d = 0; d <= 9; d++) dq(i + 1, s + d) }; dq(0, ''); return r }
/** như dien nhưng trả "a=6", "b=0"… cho từng chữ cái của mọi nghiệm (đáp án viết theo chữ cái) */
const dienChu = (khuon, f) => dien(khuon, f).flatMap((n) => [...khuon].map((c, i) => (/\d/.test(c) ? null : `${c === 'x' ? '*' : c}=${String(n)[i]}`)).filter(Boolean))
const lap3 = (cs) => tim(100, 999, (n) => khacNhau(n) && chuSo(n).every((c) => cs.includes(c)))
const ds7B = { 'LT 10.1': [3745, 8698, 3946, 2970, 3565, 4870], 'LT 10.2': [1725, 3648, 5790, 5687, 3240], 'LT 10.3': [123, 1890, 2010, 3945, 5768, 12846] }
const loc = (k, f) => ds7B[k].filter(f).map(String)

export const KIEM = {
  // ── lô 7B: CĐ 10, 11 — viết từ đề ──
  'VD 10.3': () => dien('43ab', (n) => n % 90 === 0).map(String),
  'LT 10.1a': () => loc('LT 10.1', (n) => n % 2 === 0), 'LT 10.1b': () => loc('LT 10.1', (n) => n % 5 === 0), 'LT 10.1c': () => loc('LT 10.1', (n) => n % 10 === 0),
  'LT 10.2a': () => loc('LT 10.2', (n) => n % 2 === 0 && n % 5), 'LT 10.2b': () => loc('LT 10.2', (n) => n % 5 === 0 && n % 2), 'LT 10.2c': () => loc('LT 10.2', (n) => n % 10 === 0), 'LT 10.2d': () => loc('LT 10.2', (n) => n % 2 && n % 5),
  'LT 10.3a': () => loc('LT 10.3', (n) => n % 2 === 0), 'LT 10.3b': () => loc('LT 10.3', (n) => n % 5 === 0), 'LT 10.3c': () => loc('LT 10.3', (n) => n % 10 === 0),
  'LT 10.3d': () => loc('LT 10.3', (n) => n % 3 === 0), 'LT 10.3e': () => loc('LT 10.3', (n) => n % 9 === 0), 'LT 10.3f': () => loc('LT 10.3', (n) => n % 30 === 0), 'LT 10.3g': () => loc('LT 10.3', (n) => n % 90 === 0),
  'LT 10.4a': () => lap3([0, 1, 3, 5]).filter((n) => n % 2 === 0).map(String), 'LT 10.4b': () => lap3([0, 1, 3, 5]).filter((n) => n % 3 === 0).map(String), 'LT 10.4c': () => lap3([0, 1, 3, 5]).filter((n) => n % 5 === 0).map(String),
  'LT 10.5a': () => lap3([0, 3, 6, 9]).filter((n) => n % 9 === 0).map(String), 'LT 10.5c': () => lap3([0, 3, 6, 9]).filter((n) => n % 90 === 0).map(String),
  'LT 10.6a': () => dien('83a', (n) => n % 2 === 0).map(String), 'LT 10.6b': () => dien('83a', (n) => n % 4 === 0).map(String), 'LT 10.6c': () => dien('83a', (n) => n % 5 === 0).map(String),
  'LT 10.6d': () => dien('83a', (n) => n % 10 === 0).map(String), 'LT 10.6e': () => dien('83a', (n) => n % 3 === 0).map(String), 'LT 10.6f': () => dien('83a', (n) => n % 9 === 0).map(String),
  'LT 10.7a': () => dien('2a3b', (n) => n % 30 === 0).map(String), 'LT 10.7b': () => dien('2a3b', (n) => n % 90 === 0).map(String), 'LT 10.7c': () => dien('2a3b', (n) => n % 45 === 0).map(String),
  'LT 10.8a': () => dien('85a44b', (n) => n % 30 === 0).map(String), 'LT 10.8b': () => dien('3a12b', (n) => n % 90 === 0).map(String),
  'LT 10.8c': () => dien('17a8b', (n) => n % 45 === 0).map(String), 'LT 10.8d': () => dien('45a7b', (n) => n % 90 === 0).map(String),
  'LT 10.9a': () => dien('p415q', (n) => n % 45 === 0).map(String), 'LT 10.9b': () => dien('p7452q', (n) => n % 45 === 0).map(String),
  'LT 10.9c': () => dien('p9651q', (n) => n % 45 === 0).map(String), 'LT 10.9d': () => dien('p40522q', (n) => n % 45 === 0).map(String),
  'LT 10.10': () => dienChu('2141x', (n) => n % 6 === 0),
  'LT 10.11': () => dienChu('1a38b', (n) => n % 45 === 0),
  'LT 10.13': () => dienChu('5a07b', (n) => n % 24 === 0),
  'LT 10.15': () => { const m = String(21 * 22 * 23 * 24 * 25).match(/^637(\d)600$/); if (!m) throw new Error('10.15 khuôn'); return [`*=${m[1]}`] },
  'LT 11.2a': () => dien('56a', (n) => n % 2).map(String), 'LT 11.2b': () => dien('56a', (n) => n % 5 === 0 && n % 2).map(String), 'LT 11.2c': () => dien('56a', (n) => n % 5 === 3).map(String),
  'LT 11.2d': () => dien('56a', (n) => n % 2 === 0 && n % 5 === 4).map(String), 'LT 11.2e': () => dien('56a', (n) => n % 3 === 0 && n % 2).map(String), 'LT 11.2f': () => dien('56a', (n) => n % 3 === 0 && n % 9).map(String),
  'LT 11.5': () => [String(tim(100, 999, (n) => n % 5 === 0).length)], 'LT 11.6': () => [String(tim(100, 999, (n) => n % 3 !== 0).length)],
  'LT 11.7': () => [['vàng', 'xanh', 'đỏ', 'tím', 'hồng'][(253 - 1) % 5]],
  'LT 11.8a': () => [['cam', 'xanh lá', 'trắng'][(100 - 1) % 3]],
  'LT 11.8b': () => { const d = [0, 0, 0]; for (let i = 0; i < 160; i++) d[i % 3]++; return d.map(String) },
  'LT 11.10a': () => { const w = 'ARCHIMEDESACADEMY', dem = (c) => [...w].filter((x) => x === c).length, cum = 60 / dem('H'); return [String(cum * dem('M')), String(cum * dem('A'))] },
  'LT 11.10b': () => { const w = 'ARCHIMEDESACADEMY'; return [50 % [...w].filter((x) => x === 'E').length === 0 ? 'đúng' : 'sai'] },
  'LT 11.11a': () => [String(tim(1, 1000, (n) => n % 30 === 0)[0])], 'LT 11.11b': () => [String(tim(2, 1000, (n) => n % 2 === 1 && n % 3 === 1 && n % 5 === 1)[0])],
  'LT 11.11c': () => [String(tim(10, 99, (n) => n % 2 === 1 && n % 3 === 2 && n % 4 === 3 && n % 5 === 4)[0])],
  'LT 11.13': () => dien('253x', (n) => n % 9 === 1).map(String),
  'LT 11.14': () => dien('a798b', (n) => khacNhau(n) && n % 5 === 2 && n % 9 === 0).map(String),
  'LT 11.15': () => [String(Math.max(...dien('567xyz', (n) => n % 2 === 1 && khacNhau(n) && n % 5 === 1 && n % 9 === 1)))],
  'LT 11.16': () => tim(1000, 9999, (n) => n % 45 === 0 && String(n) === [...String(n)].reverse().join('')).map(String),
  'LT 11.17': () => tim(1000, 9999, (n) => { const [a, b, c, d] = String(n); return n % 30 === 0 && b === d && a === c }).map(String),
  'LT 11.18': () => [String(Math.max(...tim(1000, 9999, (n) => n % 3 === 2 && n % 4 === 3 && n % 5 === 4 && n % 7 === 6)))],
  'LT 11.19': () => { const r = [104, 115, 132, 136, 148], kq = []
    for (let m = 1; m < 32; m++) { const cam = r.filter((_, i) => m & (1 << i)), chanh = r.filter((_, i) => !(m & (1 << i)))
      for (const ban of cam) { const conCam = cam.reduce((a, b) => a + b, 0) - ban, ch = chanh.reduce((a, b) => a + b, 0); if (conCam > 0 && ch === 4 * conCam) kq.push([cam.reduce((a, b) => a + b, 0), ch]) } }
    return motNghiem(kq, '11.19').map(String) },

  // ── lô 7C: CĐ 12, PTL 3, CĐ 13 — viết từ đề ──
  'VD 12.1': () => [String(motNghiem(tim(1, 10000, (A) => A * 10 + 3 === A + 417), 'VD 12.1'))],
  'VD 12.2': () => [String(motNghiem(hai((a, b, n) => 200 + n === 5 * n), 'VD 12.2'))],
  'LT 12.1b': () => [String(motNghiem(tim(1, 10000, (A) => A * 10 + 8 - A === 2816), '12.1b'))],
  'LT 12.2a': () => [String(motNghiem(tim(10, 100000, (N) => N % 10 === 2 && N - Math.floor(N / 10) === 929), '12.2a'))],
  'LT 12.2b': () => [String(motNghiem(tim(10, 100000, (N) => N % 10 === 7 && N - Math.floor(N / 10) === 4075), '12.2b'))],
  'LT 12.5': () => [String(motNghiem(tim(300, 399, (n) => n === 7 * (n - 300)), '12.5'))],
  'LT 12.6': () => [String(motNghiem(tim(9000, 9999, (n) => n === 11 * (n - 9000)), '12.6'))],
  'LT 12.8': () => [String(motNghiem(tim(100, 199, (n) => n + 500 === 5 * n), '12.8'))],
  'LT 12.9': () => [String(motNghiem(tim(100, 999, (n) => { const [a, b, c] = chuSo(n); return a === c && n === 21 * (n % 100) }), '12.9'))],
  'LT 12.10': () => [String(motNghiem(hai((a, b, n) => 3003 + 10 * n - n === 3381), '12.10'))],
  'LT 12.11a': () => chuCai('ab', motNghiem(hai((a, b, n) => n + 774 === 10 * n), '12.11a')),
  'LT 12.11b': () => chuCai('abc', motNghiem(tim(100, 999, (n) => n * 9 === 1000 + n), '12.11b')),
  'LT 12.11c': () => chuCai('ab', motNghiem(hai((a, b, n) => n === 2 * (a + b)), '12.11c')),
  'LT 12.11d': () => chuCai('ab', motNghiem(hai((a, b, n) => n === 6 * (a + b)), '12.11d')),
  'LT 12.12': () => { const ds = hai((a, b, n) => 100 * a + 20 + b - n === 380); return [String(ds.length), String(ds[0]), String(ds[ds.length - 1])] },
  'LT 12.13': () => { const ds = tim(100, 999, (n) => chuSo(n)[1] === 2 && n - (Math.floor(n / 100) * 10 + (n % 10)) === 650); return [String(ds[0]), String(ds[ds.length - 1])] },
  'LT 12.14': () => [String(motNghiem(hai((a, b, n) => 100 * a + b === 9 * n), '12.14'))],
  'LT 12.15': () => [String(motNghiem(tim(100, 999, (n) => { const [a, m, c] = chuSo(n); return m === 6 && n === 12 * (a * 10 + c) }), '12.15'))],
  'LT 12.16': () => [String(motNghiem(hai((a, b, n) => 1000 * a + 120 + b === 85 * n), '12.16'))],
  'LT 12.17': () => [String(motNghiem(hai((a, b, n) => { const s = a + b; return Math.floor(n / s) === 9 && n % s === 1 }), '12.17'))],
  'LT 12.18': () => [String(motNghiem(hai((a, b, n) => { const s = a + b; return Math.floor(n / s) === 5 && n % s === 12 }), '12.18'))],
  'PTL 3.2a': () => tim(17000, 17999, (n) => chuSo(n)[3] === 8 && n % 90 === 0).map(String),
  'PTL 3.2b': () => tim(34000, 34999, (n) => chuSo(n)[3] === 1 && n % 36 === 0).flatMap((n) => [`x=${chuSo(n)[2]}`, `y=${chuSo(n)[4]}`]),
  'PTL 3.3': () => { const w = 'HAPPYTEACHERSDAY'; const ch = w[(1102 - 1) % w.length]; return [ch, 'DAY'] }, // chỉ đếm CHỮ CÁI (dấu nháy không phải chữ cái)
  'PTL 3.4': () => [String(motNghiem(tim(1, 10000, (A) => A * 10 + 2 - A === 4106), 'PTL 3.4'))],
  'PTL 3.5': () => { const cs = (n) => chuSo(n).reduce((a, b) => a + b, 0); const kq = new Set(); for (let B = 9; B <= 9 * 2024; B += 9) kq.add(cs(cs(B))); if (kq.size !== 1) throw new Error('PTL 3.5'); return [String([...kq][0])] },
  'VD 13.1': () => [String(tbc(36, 39, 42, 43))], 'VD 13.2': () => [String(11 * 4 - 9 * 3)], 'VD 13.3': () => [String(tbc(...tim(2, 20, (x) => x % 2 === 0)))],
  'VD 13.4': () => [String(motNghiem(tim(0, 100, (m) => m === tbc(24, 28, m)), 'VD 13.4'))],
  'VD 13.5': () => { const t = motNghiem(tim(0, 200, (t) => t === tbc(39, 41, t) + 8), 'VD 13.5'); return [String(39 + 41 + t)] },
  'VD 13.6': () => [String(motNghiem(tim(0, 100, (c) => c === tbc(36, 34, c) - 4), 'VD 13.6'))],
  'LT 13.1': () => [String(tbc(147, 140, 139, 146, 143))],
  'LT 13.3': () => [String((3 * 5000 + 2 * 4500) / 5 / 100)],
  'LT 13.4': () => [String((3200 * 4 + 3000) / 5)],
  'LT 13.6': () => [String(30 * 3 - 23 * 2)],
  'LT 13.7': () => { const tieu = 15000000 * 3 - 20000000; return [String(tieu / 4), String(tieu / 4 - tieu / 5)] },
  'LT 13.8a': () => [String(tbc(...tim(3, 99, () => true)))], 'LT 13.8b': () => [String(tbc(...tim(12, 2022, (x) => (x - 12) % 3 === 0)))],
  'LT 13.9': () => [String(tbc(...tim(1, 999, (x) => x % 2 === 1)))],
  'LT 13.10': () => { const a = motNghiem(tim(0, 500, (a) => tbc(a, a + 1, a + 2) === 126), '13.10'); return [a, a + 1, a + 2].map(String) },
  'LT 13.11': () => { const a = motNghiem(tim(0, 500, (a) => a % 2 === 0 && a + (a + 2) + (a + 4) === 444), '13.11'); return [a, a + 2, a + 4].map(String) },
  'LT 13.12': () => { const a = motNghiem(tim(0, 1000, (a) => a % 2 === 1 && [0, 2, 4, 6, 8].reduce((s, k) => s + a + k, 0) === 975), '13.12'); return [0, 2, 4, 6, 8].map((k) => String(a + k)) },
  'LT 13.13': () => { const q = motNghiem(tim(0, 2000, (q) => q * 1000 === tbc(340000, 560000, q * 1000)), '13.13'); return [String(340000 + 560000 + q * 1000)] },
  'LT 13.14': () => { const t2 = 142 - 26, t3 = motNghiem(tim(0, 500, (t) => t === tbc(142, t2, t)), '13.14'); return [String(142 + t2 + t3)] },
  'LT 13.15': () => [String(motNghiem(tim(0, 100, (h) => h === tbc(30, 20, h) - 6), '13.15'))],
  'LT 13.16': () => [String(motNghiem(tim(0, 100, (c) => c === tbc(14, 12, c) - 2), '13.16'))],
  'LT 13.18': () => [String(motNghiem(tim(0, 100, (g) => g === tbc(12, 15, g) + 3), '13.18'))],
  'LT 13.20': () => { const x2 = 45 + 10, x3 = motNghiem(tim(0, 500, (x) => x === tbc(45, x2, x) + 6), '13.20'); return [String(45 + x2 + x3)] },

  // ── lô 7A: CĐ 8, PTL 2, CĐ 9 — viết TRƯỚC khi mở bản soạn ──
  'LT 8.2': () => motNghiem(capTong(1005, (a, b) => b === a + 1), '8.2')[0] !== undefined ? capTong(1005, (a, b) => b === a + 1)[0].map(String) : [],
  'LT 8.4': () => capTong(24, (m, a) => a - m === 6)[0].map(String),
  'LT 8.7': () => motNghiem(capTong(346, (b, l) => l === 300 + b && b < 100), '8.7').map(String),
  'LT 8.8': () => motNghiem(capTong(572, (b, l) => l === Number('4' + String(b))), '8.8').map(String),
  'LT 8.11': () => motNghiem(capTong(474, (x, y) => true).flatMap(([x, y]) => [[x, y], [y, x]]).filter(([d1, d2]) => d1 + 40 === d2 + 28 - 16), '8.11').map(String),
  'LT 8.12': () => { const r = []; for (let b = 0; b <= 100; b++) for (let m = 0; m <= 100 - b; m++) { const c = 100 - b - m; if (b === m + c + 20 && m === c + 28) r.push([b, m, c]) } return motNghiem(r, '8.12').map(String) },
  'LT 8.16': () => motNghiem(capTong(852, (a, b) => a % 2 === 1 && b % 2 === 1 && tim(a + 1, b - 1, (x) => x % 2 === 0).length === 5), '8.16').map(String),
  'LT 8.18': () => capTong(2022, (a, b) => b > a && tim(a + 1, b - 1, (x) => x % 2 === 0).length === 8).flat().map(String),
  'PTL 2.1a': () => motNghiem(capTong(600, (a, b) => b - a === 50), 'PTL 2.1a').map(String),
  'PTL 2.1b': () => motNghiem(capTong(51 - 8, (c, b) => b - c === 31), 'PTL 2.1b').map(String),
  'PTL 2.2': () => { const [r, d] = motNghiem(capTong(65, (r, d) => d - r === 35), 'PTL 2.2'); return [String((r * d * 20) / 1000)] },
  'PTL 2.3a': () => [String(3 * 50)], 'PTL 2.3b': () => { let s = 0; for (let i = 1; i <= 50; i++) s += 3 * i; return [String(s)] }, 'PTL 2.3c': () => [String(1203 / 3)],
  'PTL 2.4': () => [String(41 * 50)],
  'VD 9.1': () => [String(124 * 4)], 'VD 9.2': () => [String(324 / 6)],
  'VD 9.3': () => { const x = motNghiem(tim(1, 1000, (x) => x * 3 + x * 2 === 275), 'VD 9.3'); return [String(x * 32)] },
  'LT 9.1': () => [String(motNghiem(tim(0, 5000, (x) => (x + 30) % 25 === 0 && (x + 30) / 25 === 98), '9.1'))],
  'LT 9.2a': () => [String(452 * 2 * 3)],
  'LT 9.2b': () => { const r = []; for (let a = 1; a <= 100; a++) for (let b = 10; b <= 1000; b += 10) if (a * 5 * (b / 10) === 350) r.push(a * b); const s = [...new Set(r)]; if (s.length !== 1) throw new Error('9.2b'); return [String(s[0])] },
  'LT 9.3a': () => [String(324 / 3)], 'LT 9.3b': () => [String(3616 / 16)],
  'LT 9.4': () => { const r = []; for (let b = 1; b <= 500; b++) { const a = 12 * b; const q = a / b; if (a % (2 * b) === 0 && a / (2 * b) === 6 && a % (3 * q) === 0 && a / (3 * q) === 6) r.push([a, b]) } return motNghiem(r, '9.4').map(String) },
  'LT 9.5': () => { const b = (4810 - 2860) / 30; return [String(2860 / b), String(b)] },
  'LT 9.6': () => [String((6270 - 5610) / 6)],
  'LT 9.8': () => { const x = motNghiem(tim(1, 1000, (x) => x * 140 - x * 40 === 1200), '9.8'); return [String(x * 140)] },
  'LT 9.9': () => [String(motNghiem(tim(1, 10000, (x) => x * 103 - x * 13 === 37080), '9.9'))],
  'LT 9.10': () => [String(motNghiem(tim(1, 10000, (x) => x * 281 - x * 218 === 20475), '9.10'))],
  'LT 9.11': () => { const x = motNghiem(tim(1, 10000, (x) => x * (2 + 1 + 5) === 6528), '9.11'); return [String(x * 215)] },
  'LT 9.12': () => { const x = motNghiem(tim(1, 10000, (x) => x * 15 - x * (1 + 5) === 279), '9.12'); return [String(x * 15)] },
  'LT 9.13': () => { const n = 8 * 50 + 3; return [String(Math.floor(n / 24)), String(n % 24)] },
  'LT 9.14': () => { const r = tim(32, 5000, (d) => 4959 % d === 31 && 31 === d - 1); const d = motNghiem(r, '9.14'); return [String(d), String((4959 - 31) / d)] },
  'LT 9.15': () => { const d = motNghiem(tim(2, 2000, (d) => Math.floor(1719 / d) === 19 && 1719 % d === d - 1), '9.15'); return [String(d), String(d - 1)] },
  'LT 9.16': () => { const kq = new Set(); for (let q = 0; q < 50; q++) { const A = 12 * q + 8; kq.add(12 * (q + 2) - A) } if (kq.size !== 1) throw new Error('9.16'); return [String([...kq][0])] },
  'LT 9.17': () => { const kq = new Set(); for (let q = 0; q < 50; q++) { const A = 112 * q + 79; kq.add(`${Math.floor(A / 56) - 2 * q}|${A % 56}`) } if (kq.size !== 1) throw new Error('9.17'); return [[...kq][0].split('|')[1]] },
  'LT 9.18': () => [String(motNghiem(tim(1, 100000, (n) => n % 48 === 17 && Math.floor(n / 12) === 65 && n % 12 !== 0), '9.18'))],
  'LT 9.19': () => [String(motNghiem(tim(1, 100000, (n) => { const a = Math.floor(n / 23); return n % 23 === 20 && a > 0 && n % a === 7 }), '9.19'))],

  // ── lô 6A: VD 2, CĐ 3, PTL 1 ──
  'VD 2.1a': () => [String(tim(100, 999, (n) => chuSo(n).every((c) => [2, 3, 5].includes(c))).length)],
  'VD 2.1b': () => [String(tim(100, 999, (n) => khacNhau(n) && chuSo(n).every((c) => [2, 3, 5].includes(c))).length)],
  'VD 3.1': () => ['160', '120', '30000', '130', '4200', '7m5cm', '300'],
  'VD 3.2a': () => ['7tấn5tạ'], 'VD 3.2b': () => ['6giờ'], 'VD 3.2c': () => ['10dm'],
  'VD 3.3': () => [String(2000 - 600 * 2 - 600)],
  'LT 3.2': () => { const t = { An: 13 * 60, Bình: 60 * 60 / 5, Cường: 700, Dũng: 12 * 60 + 45 }; return [Object.entries(t).sort((a, b) => a[1] - b[1])[0][0]] },
  'LT 3.3a': () => [String(1990 - 100), 'XIX'],
  'LT 3.3b': () => ['XI', String(2023 - 1010), '2023'], // CEO 08/10: tính đến năm 2023 (năm sách in), ghi rõ năm
  'LT 3.5': () => { const r = moiThang([28, 29], (L, thu) => tim(1, L, (d) => thu(d) === 3).length === 5 ? `${TEN_THU[thu(1)]}|${Math.max(...tim(1, L, (d) => thu(d) === 6))}` : null); if (r.length !== 1) throw new Error('3.5'); const [t, cn] = r[0].split('|'); return [t, cn] },
  'LT 3.7': () => { const r = moiThang([28, 29], (L, thu) => tim(1, L, (d) => thu(d) === 4 && d % 2 === 1).length === 3 ? TEN_THU[thu(24)] : null); if (r.length !== 1) throw new Error('3.7'); return r },
  'LT 3.8': () => ['29', '2'],
  'LT 3.9': () => [String((3000 - 800 - 800 / 4) / 1000)],
  'LT 3.10': () => [String((40 * 30) / (6 * 1))],
  'LT 3.11': () => [String((1000 + 2 * 200 - 800) / 200)],
  'LT 3.12': () => { const s = (950 + 1050 + 1100) / 2; return [String(s - 1050), String(s - 1100), String(s - 950)] },
  'LT 3.15': () => { const than = motNghiem(tim(1, 100, (t) => t % 2 === 0 && t === (1 + t / 2) + 1), '3.15'); return [String(1 + (1 + than / 2) + than)] },
  'PTL 1.1a': () => [String(timSo({ L: 5, lon: false, kn: true, cuoi: 'le' }))],
  'PTL 1.1b': () => [String(timSo({ L: 5, lon: true, cuoi: '0', co: { 1: 7 } }))],
  'PTL 1.1c': () => [String(timSo({ L: 3, lon: true, tich: 12 }))],
  'PTL 1.1d': () => [String(timSo({ L: 5, lon: false, tong: 26, cuoi: 'chan' }))],
  'PTL 1.1e': () => [String(timSo({ lon: true, kn: true, tong: 16 }))],
  'PTL 1.2a': () => [String(tim(1000, 9999, (n) => khacNhau(n) && chuSo(n).every((c) => [0, 1, 2, 3].includes(c))).length)],
  'PTL 1.2b': () => [String(tim(1000, 9999, (n) => n % 2 && khacNhau(n) && chuSo(n).every((c) => [0, 1, 2, 3].includes(c))).length)],
  'PTL 1.3': () => [String(10 ** 4)],
  'PTL 1.4': () => { const kg = 25 * 50 * 20; return [String(kg / 1000), String(kg * 17000)] },
  'PTL 1.4a': () => [String((25 * 50 * 20) / 1000)], 'PTL 1.4b': () => [String(25 * 50 * 20 * 17000)],
  // ── lô 6B: CĐ 4 ──
  'VD 4.1': () => [String(105 + (735 - 182))], 'VD 4.2': () => ['15'], 'VD 4.3': () => [String(305 - 21)], 'VD 4.4': () => [String(40 + 13)],
  'LT 4.1a': () => { const [m, n, p] = [57, 21, 1]; return [m + n + p, m + (n + p), m - n - p, m - (n + p)].map(String) },
  'LT 4.1b': () => { const [m, n, p] = [2023, 1995, 5]; return [m + n + p, m + (n + p), m - n - p, m - (n + p)].map(String) },
  'LT 4.2a': () => [String(538 + 853 - 402)], 'LT 4.2b': () => [String(5287 + 287 * 9)], 'LT 4.2c': () => [String((5201 * 6) / 3)], 'LT 4.2d': () => [String((12987 + 11023) * 2)],
  'LT 4.3a': () => [String(motNghiem(tim(0, 200, (b) => 154 - (b + 9) === 125), '4.3a'))],
  'LT 4.3b': () => [String(motNghiem(tim(0, 200, (b) => b * 6 - 25 === 125), '4.3b'))],
  'LT 4.3c': () => [String(motNghiem(tim(0, 2023, (b) => (2023 - b) % 8 === 0 && (2023 - b) / 8 === 125), '4.3c'))],
  'LT 4.3d': () => [String(motNghiem(tim(0, 5000, (b) => b % 5 === 0 && b / 5 + 35 === 125), '4.3d'))],
  'LT 4.4a': () => { const r = dienChuSo(['p876', '2q2r', '77s7'], '-'); if (r.length !== 1) throw new Error(`4.4a: ${r.length} nghiệm`); return [`${r[0].p}876`, `2${r[0].q}2${r[0].r}`, `77${r[0].s}7`] },
  'LT 4.4b': () => { const r = dienChuSo(['1p5q7', '376r', '16s36'], '+'); if (r.length !== 1) throw new Error(`4.4b: ${r.length} nghiệm`); return [`1${r[0].p}5${r[0].q}7`, `376${r[0].r}`, `16${r[0].s}36`] },
  'LT 4.5a': () => [String(2026 - 2024 / 4)], 'LT 4.5b': () => [String(motNghiem(tim(1, 2024, (m) => 2024 % m === 0 && 2026 - 2024 / m === 2018), '4.5b'))],
  'LT 4.6a': () => [String(485 + 136 + 264 + 515)], 'LT 4.6b': () => [String(3456 + 4567 + 6544 + 5433)], 'LT 4.6c': () => [String(732 + 184 + 216 - 132)], 'LT 4.6d': () => [String(636 + 278 - 236 - 178 + 500)],
  'LT 4.7a': () => [String(5492 + (508 - 325))], 'LT 4.7b': () => [String(527 - (186 + 327))], 'LT 4.7c': () => [String(2234 - (234 - 50))], 'LT 4.7e': () => [String(644 - (243 - 156) + 143)], 'LT 4.7f': () => [String(200 - 1 - 2 - 3 - 4)],
  'LT 4.8a': () => [String(19 + 199 + 1999 + 19999)], 'LT 4.8b': () => [String(37 + 397 + 3997 + 39997)], 'LT 4.8c': () => [String(21 + 201 + 2001 + 20001)], 'LT 4.8d': () => [String(55555 - 49 - 499 - 4999)],
  'LT 4.9a': () => [String(7890 - 123 - 456)], 'LT 4.9b': () => [String(3456 - 234 - 567)], 'LT 4.9c': () => [String(56 + 3456 + 456)], 'LT 4.9d': () => [String(1000 + 2567 - 3456)],
  'LT 4.9e': () => [String((51 + 149) / 2)], 'LT 4.9f': () => [String(motNghiem(tim(1, 1525, (x) => 1525 % x === 0 && 1525 / x + 125 === 130), '4.9f'))],
  'LT 4.10': () => [String(34270 + 489 - 345)], 'LT 4.11': () => [String(1995 - 206 + 625)], 'LT 4.12': () => [String(886 + 230)], 'LT 4.13': () => [String(2024 - 405)], 'LT 4.14': () => [String(1234 - 112 - 297)],
  'LT 4.15': () => [String(timSo({ L: 4, lon: true, cuoi: '0' }) - timSo({ L: 4, lon: false, kn: true }))],
  'LT 4.17': () => { const a = motNghiem(tim(0, 80, (a) => 4 * a + (80 - a) === 185), '4.17'); return [String(a), String(80 - a)] },
  'LT 4.18': () => { const b = motNghiem(tim(0, 2000, (b) => 2 * (b + 299) - b === 833), '4.18'); return [String(b + 299), String(b)] },
  'LT 4.19': () => { const b = motNghiem(tim(0, 2000, (b) => (b + 710) - 4 * b === 335), '4.19'); return [String(b + 710), String(b)] },
  'LT 4.20': () => { const r = dienChuSo(['a56b7', '6c54d', '95e92'], '+'); if (r.length !== 1) throw new Error(`4.20: ${r.length} nghiệm`); const g = r[0]; return [`a=${g.a}`, `b=${g.b}`, `c=${g.c}`, `d=${g.d}`, `e=${g.e}`] },
  // ── lô 6C: CĐ 5, 6, 7 ──
  'LT 5.2': () => { const cv = (6 + 12) * 2, c = cv / 4; return [String(c * c)] },
  'LT 5.5': () => { const c = motNghiem(tim(1, 9, (c) => c * c === 81), '5.5'); const d = (c * 4) / 2 - 4; return [String(d * 4)] },
  'LT 5.7': () => { const d = 45 / 5, r = 30 / 2 - d; return [String(d * r)] },
  'LT 5.10': () => { const r = motNghiem(tim(1, 16, (r) => (16 - r) - 3 === r + 3), '5.10'); return [String(r * (16 - r))] },
  'LT 5.11': () => { const r = motNghiem(tim(1, 20, (r) => r + 5 === (20 - r) - 3), '5.11'); return [String(r * (20 - r))] },
  'LT 6.1d': () => ['30', '35', '40'], 'LT 6.1e': () => ['22', '26', '30'], 'LT 6.1f': () => ['39', '46', '53'],
  'LT 6.3': () => { const ds = tim(1845, 2024, () => true); return [ds.filter((x) => x % 2).length, ds.filter((x) => x % 2 === 0).length, ds.filter((x) => x % 10 === 0).length].map(String) },
  'LT 6.7': () => { let A = 0, B = 0; for (let k = 1; k <= 199; k += 2) A += k; for (let k = 100; k >= 5; k -= 5) B += k; return [`A=${A}`, `B=${B}`] },
  'LT 6.8c': () => [String(motNghiem(tim(0, 300, (x) => { let s = 0; for (let k = 1; k <= 34; k += 3) s += x + k; return s === 282 }), '6.8c'))],
  'LT 6.9a': () => { let s = 0; for (let k = 12; k < 22; k++) s += k; return [String(s)] },
  'LT 6.9b': () => { let s = 0; for (let i = 0; i < 12; i++) s += 60 + 2 * i; return [String(s)] },
  'LT 6.9c': () => { let s = 0; for (let i = 0; i < 16; i++) s += 21 + 2 * i; return [String(s)] },
  'LT 6.9d': () => [String(tim(10, 99, (n) => n % 10 === 3).reduce((a, b) => a + b, 0))],
  'LT 6.10': () => [String(tim(10, 99, (n) => n % 4 === 0).length)],
  'LT 6.11': () => [String(tim(100, 999, (n) => n % 5 !== 0).length)],
  'LT 6.15': () => { const a = motNghiem(tim(0, 1380, (a) => a % 2 === 0 && [...Array(20)].reduce((s, _, i) => s + a + 2 * i, 0) === 1380), '6.15'); return [String(a), String(a + 38)] },
  'LT 6.17': () => { let d = 0; for (let p = 1; ; p++) { d += String(p).length; if (d === 492) return [String(p)]; if (d > 492) throw new Error('6.17: không vừa khít') } },
  'LT 6.20': () => { let B = '1000', so = 1000; const vt = []; for (let k = 999; B.length < 421; k--) { B += k; vt.push(k) } let L = 4; let soCua = 1000; for (const k of vt) { if (L >= 421) break; L += 3; soCua = k } return [B[420], String(soCua)] },
  'LT 7.2': () => [String((450 / 5 + 1) * 2)],
  'LT 7.4': () => [String(35 * 50)],
  'LT 7.7': () => [String((1500 / 50 - 1) * 2)],
  'LT 7.11': () => [String(((90 + 45) * 2) / 3)],
  'LT 7.15': () => { const n = 960 / 8 + 1; const bl = tim(0, n - 1, (i) => i % 3 === 0).length; if ((n - 1) % 3) throw new Error('7.15: cuối không phải bằng lăng'); return [String(n - bl)] },

  // ── chuyên đề 1 (lô 5) — viết TRƯỚC khi thấy lời giải, chỉ từ đề ──
  'VD 1.1': () => [String(timSo({ lon: true, kn: true, tong: 19 }))],
  'VD 1.2': () => [String(timSo({ lon: false, kn: true, tong: 19 }))],
  'VD 1.3': () => [String(timSo({ lon: false, tong: 19 }))],
  'LT 1.1a': () => [String(19000000 + 2000 + 34 * 10 + 5)],
  'LT 1.1b': () => [String(25000000 + 34000 + 900 + 78)],
  'LT 1.1c': () => [String(87 * 10000000 + 302000 + 67)],
  'LT 1.2': () => [String(motNghiem(tim(100, 999, (n) => { const [a, b, c] = chuSo(n); return b === 3 * c && b * 2 === a }), '1.2'))],
  'LT 1.3a': () => [String(timSo({ L: 4, lon: true, kn: true, cuoi: 'le' }))],
  'LT 1.3b': () => [String(timSo({ L: 5, lon: false, kn: true, cuoi: 'le' }))],
  'LT 1.3c': () => [String(timSo({ L: 6, lon: true, co: { 1: 1 } }))],
  'LT 1.3d': () => [String(timSo({ L: 5, lon: false, kn: true, cuoi: 'chan', co: { 1: 2 } }))],
  'LT 1.3e': () => [String(timSo({ L: 5, lon: true, kn: true, cuoi: '0', co: { 2: 5 } }))],
  'LT 1.4b': () => [String(timSo({ L: 4, lon: true, kn: true, chon: [0, 2, 5, 9, 6, 8] }))],
  'LT 1.4c': () => [String(timSo({ L: 4, lon: false, kn: true, chon: [0, 2, 5, 9, 6, 8] }))],
  'LT 1.4d': () => [String(timSo({ lon: true, kn: true, cuoi: 'le', chon: [0, 2, 5, 9, 6, 8] }))],
  'LT 1.5a': () => [String(timSo({ L: 2, lon: true, tong: 16 }))],
  'LT 1.5c': () => [String(tim(10, 99, (n) => { const [a, b] = chuSo(n); return Math.abs(a - b) === 4 })[0])],
  'LT 1.5d': () => [String(tim(10, 99, (n) => { const [a, b] = chuSo(n); return (b && a === 2 * b) || (a && b === 2 * a) })[0])],
  'LT 1.6a': () => [String(timSo({ L: 3, lon: false, tong: 14 }))],
  'LT 1.6b': () => [String(timSo({ L: 4, lon: false, tong: 15 }))],
  'LT 1.6c': () => [String(timSo({ L: 5, lon: false, tong: 17 }))],
  'LT 1.6d': () => [String(timSo({ L: 6, lon: false, tong: 32, cuoi: 'chan' }))],
  'LT 1.7a': () => [String(timSo({ L: 3, lon: true, tong: 10 }))],
  'LT 1.7b': () => [String(timSo({ L: 5, lon: true, tong: 30 }))],
  'LT 1.7c': () => [String(timSo({ L: 4, lon: false, kn: true, tong: 9 }))],
  'LT 1.7d': () => [String(timSo({ L: 4, lon: true, kn: true, tong: 25, cuoi: 'chan' }))],
  'LT 1.8a': () => [String(timSo({ lon: true, kn: true, tong: 6 }))],
  'LT 1.8b': () => [String(timSo({ lon: true, kn: true, tong: 17, cuoi: 'le' }))],
  'LT 1.8c': () => [String(timSo({ lon: true, kn: true, tong: 31 }))],
  'LT 1.8d': () => [String(timSo({ lon: true, kn: true, tong: 35, cuoi: 'le' }))],
  'LT 1.9a': () => [String(timSo({ lon: false, kn: true, tong: 12 }))],
  'LT 1.9b': () => [String(timSo({ lon: false, kn: true, tong: 18 }))],
  'LT 1.9d': () => [String(timSo({ lon: false, kn: true, tong: 22, cuoi: 'chan' }))],
  'LT 1.10a': () => tim(10, 99, (n) => chuSo(n).reduce((a, b) => a * b, 1) === 18).map(String),
  'LT 1.10b': () => tim(10, 99, (n) => chuSo(n).reduce((a, b) => a * b, 1) === 40).map(String),
  'LT 1.10c': () => tim(100, 999, (n) => khacNhau(n) && chuSo(n).reduce((a, b) => a * b, 1) === 6).map(String),
  'LT 1.11a': () => [String(timSo({ lon: true, kn: true, tich: 30 }))],
  'LT 1.11b': () => [String(timSo({ lon: true, kn: true, tich: 120 }))],
  'LT 1.11c': () => [String(timSo({ lon: true, kn: true, tich: 420, cuoi: 'chan' }))],
  'LT 1.12a': () => [String(timSo({ lon: false, tich: 40 }))],
  'LT 1.12b': () => [String(timSo({ lon: false, tich: 180 }))],
  'LT 1.12c': () => [String(timSo({ lon: false, tich: 420 }))],
  'LT 1.13a': () => [dayCon('205316795', 4, false)],
  'LT 1.13b': () => [dayCon('205316795', 4, true)],
  'LT 1.14a': () => [dayCon('1234567891011', 13 - 8, false)],
  'LT 1.14b': () => [dayCon('1234567891011', 13 - 8, true)],
  'LT 1.15a': () => [dayCon('2524232221', 10 - 5, true)],
  'LT 1.15b': () => [dayCon('2524232221', 10 - 5, false)],

  // ── lô 1 ──
  'LT 1.5b': () => [String(Math.max(...tim(10, 99, (n) => chuSo(n).reduce((a, b) => a * b, 1) === 24)))],
  'LT 1.9c': () => { // nhỏ nhất, chữ số khác nhau, tổng 40: vét mọi tập chữ số, ít chữ số nhất, xếp tăng (0 không đứng đầu)
    let best = null
    for (let m = 1; m < 1024; m++) { const d = [...Array(10).keys()].filter((k) => m & (1 << k)); if (d.reduce((a, b) => a + b, 0) !== 40) continue
      const s = d.slice().sort((a, b) => a - b); if (s[0] === 0) { const i = s.findIndex((x) => x > 0); [s[0], s[i]] = [s[i], s[0]] }
      const v = Number(s.join('')); if (best === null || String(v).length < String(best).length || (String(v).length === String(best).length && v < best)) best = v }
    return [String(best)] },
  'LT 1.4a': () => [String(Math.max(...tim(100, 999, (n) => n % 2 === 0 && khacNhau(n) && chuSo(n).every((c) => [0, 2, 5, 9, 6, 8].includes(c)))))],
  'PCT 3 I.7': () => [String(tim(1000, 9999, (n) => n % 2 === 1 && khacNhau(n) && chuSo(n).every((c) => [0, 4, 7, 9].includes(c))).length)],
  'LT 4.7d': () => [String(3565 - (2388 - 435))],
  'LT 4.16': () => { const a = motNghiem(tim(0, 20, (x) => x + 5 * (20 - x) === 36), '4.16'); return [String(a), String(20 - a)] },
  'LT 6.6a': () => { const d = [...Array(200)].map((_, i) => 11 + 5 * i); return [String(d[84])] },
  'LT 6.6b': () => { let s = 0; for (let i = 0; i < 100; i++) s += 11 + 5 * i; return [String(s)] },
  'LT 6.6c': () => { const i = [...Array(500)].map((_, k) => 11 + 5 * k).indexOf(951); return [String(i + 1)] },
  'LT 8.6': () => { const con = motNghiem(tim(3, 60, (c) => (c - 3) + (c + 25 - 3) === 35), '8.6'); return [String(con), String(con + 25)] },
  'LT 9.7': () => { const x = motNghiem(tim(1, 1000, (x) => x * 54 - x * 45 === 207), '9.7'); return [String(x * 45)] },
  'LT 12.3': () => [String(motNghiem(tim(10, 99, (n) => 300 + n === 5 * n), '12.3'))],
  'LT 21.5': () => [String(motNghiem(tim(1, 1000, (t) => t % 12 === 0 && t - (t * 7) / 12 === 25), '21.5'))],
  'LT 22.10': () => { const con = motNghiem(tim(0, 35, (c) => 4 * (c + 5) === 35 - c + 5), '22.10'); return [String(con), String(35 - con)] },
  'LT 24.12': () => [String(motNghiem(tim(1, 300, (t) => t % 3 === 0 && t - (2 * t) / 3 - 4 === 6), '24.12'))],
  // ── lô 2 ──
  'LT 3.1': () => { const v = [['1 kg 512 g', 1512], ['1 kg 5 hg', 1500], ['1 kg 51 dag', 1510], ['10 hg 50 g', 1050]]; return [v.sort((a, b) => b[1] - a[1]).map((x) => x[0]).join(';')] },
  'LT 3.6': () => { // mọi tháng 30/31 ngày, mọi thứ của ngày 1: chỉ giữ tháng có đúng 3 thứ Năm là ngày chẵn ⇒ ngày 26 phải là một thứ duy nhất
    const ten = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'], kq = new Set()
    for (const L of [30, 31]) for (let t1 = 0; t1 < 7; t1++) { const thu = (d) => (t1 + d - 1) % 7; const chanNam = tim(1, L, (d) => thu(d) === 3 && d % 2 === 0).length; if (chanNam === 3) kq.add(ten[thu(26)]) }
    if (kq.size !== 1) throw new Error('3.6: không ra một thứ duy nhất'); return [...kq] },
  'LT 3.13': () => [String(motNghiem(tim(0, 1300, (v) => 1300 - v === 2 * (750 - v)), '3.13'))],
  'LT 5.4': () => { const r = motNghiem(tim(1, 32, (r) => 2 * (r + r + 6) === 16 * 4), '5.4'); return [String(r + 6), String(r)] },
  'LT 5.9': () => { const r = motNghiem(tim(1, 22, (r) => 2 * (r + r + 4) === 44), '5.9'); return [String(r * (r + 4))] },
  'LT 5.19': () => { // mô phỏng trên lưới 1 cm: bỏ 4 ô vuông 2×2 ở góc, đếm diện tích + cạnh biên
    const o = (x, y) => x >= 0 && y >= 0 && x < 10 && y < 10 && !((x < 2 || x > 7) && (y < 2 || y > 7))
    let S = 0, C = 0; for (let x = 0; x < 10; x++) for (let y = 0; y < 10; y++) if (o(x, y)) { S++; C += [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([a, b]) => !o(x + a, y + b)).length }
    return [String(C), String(S)] },
  'LT 10.5b': () => tim(100, 999, (n) => khacNhau(n) && chuSo(n).every((c) => [0, 3, 6, 9].includes(c)) && n % 45 === 0).map(String),
  'LT 10.12': () => tim(0, 99, (ab) => (65030 + Math.floor(ab / 10) * 100 + (ab % 10)) % 36 === 0).map((ab) => `a=${Math.floor(ab / 10)},b=${ab % 10}`),
  'LT 10.14': () => { const m = String(18 * 19 * 20 * 21 * 22).match(/^31(\d)0080$/); if (!m) throw new Error('tích không khớp khuôn 31*0080'); return [`*=${m[1]}`] },
  'LT 11.9': () => { const w = 'THANDONGDATVIET'; const ch = w[(352 - 1) % w.length]; const tu = ['THAN', 'DONG', 'DAT', 'VIET']; let i = (352 - 1) % w.length, k = 0; while (i >= tu[k].length) { i -= tu[k].length; k++ } return [ch, ['THẦN', 'ĐỒNG', 'ĐẤT', 'VIỆT'][k]] },
  'LT 11.12': () => [String(tim(2, 10000, (n) => [3, 4, 5, 7].every((k) => n % k === 1))[0])],
  'LT 14.4': () => [String(3 * (240000 / 4) + 375000 / 3)],
  'LT 14.13': () => [String(Math.ceil(204 / (180 / 15)) - 15)],
  'LT 15.4': () => { const a = [35, 34, 23, 48, 56, 87, 32, 45, 31, 49], tb = a.reduce((x, y) => x + y) / a.length; return [String(a.length), String(tb), String(a.filter((x) => x > tb).length)] },
  'LT 15.14a': () => [String(itNhatChacChan([12, 10, 6], (c) => c.every((k) => k > 0)))],
  'LT 15.14b': () => [String(itNhatChacChan([12, 10, 6], (c) => c[2] >= 4))],
  'LT 16.6c': () => [ps(P(135135, 130130))],
  'LT 16.8e': () => { const m = 105, f = [[1, 3], [3, 5], [5, 7]]; return f.map(([a, b]) => { if (m % b) throw new Error('mẫu chung sai'); return `${(a * m) / b}/${m}` }) },
  'LT 17.9c': () => [2026 * 2024 > 2027 * 2023 ? '2026/2023>2027/2024' : '2026/2023<2027/2024'],
  'LT 17.12a': () => [41 * 39 > 37 * 42 ? '41/42>37/39' : '41/42<37/39'],
  // ── lô 3 ──
  'LT 7.5': () => [String((150 / 2) * 45)],
  'LT 7.8': () => { const doan = 540 / 45, cua = doan - 1; return [String(cua * 3 + (cua - 1) * 2)] },
  'LT 7.13': () => { let n = 0; for (let x = 0; x < 96; x += 2) if (!(x > 0 && x < 4)) n++; return [String(n)] }, // cửa ở [0,4] — hai cọc cửa ở 0 và 4
  'LT 13.2': () => [String((270 + (270 - 18) + (270 + 36)) / 3)],
  'LT 13.5': () => [String(33 * 10 - 32 * 9)],
  'LT 13.19': () => [String(motNghiem(tim(0, 200, (ch) => (25 + 21 + ch) % 3 === 0 && ch === (25 + 21 + ch) / 3 + 4), '13.19'))],
  'LT 18.12': () => { const x = tru(cong(P(7, 10), P(1, 4)), P(4, 5)); if (ps(tru(cong(x, P(4, 5)), P(1, 4))) !== '7/10') throw new Error('thử ngược sai'); return [ps(x)] },
  'LT 19.2d': () => [ps(cong(chia(P(5, 4), P(25, 4)), chia(P(5, 2), P(25, 8))))],
  'LT 19.4b': () => [ps(tru(nhan(P(7, 8), P(5, 3)), nhan(P(7, 8), P(2, 3))))],
  'LT 19.6b': () => [ps(cong(tru(chia(P(46, 27), P(7, 8)), chia(P(21, 27), P(7, 8))), chia(P(2, 27), P(7, 8))))],
  'LT 18.14B': () => { let s = P(0); for (let k = 3; k <= 13; k += 2) s = cong(s, P(2, k * (k + 2))); return [`B=${ps(s)}`] },
  'LT 19.15E': () => { let s = P(0); for (let k = 1; k <= 99; k += 2) s = cong(s, P(4, k * (k + 2))); return [`E=${ps(s)}`] },
  'LT 19.15D': () => { let s = P(0); for (let k = 1; k <= 9; k++) s = cong(s, P(1, k * (k + 1))); return [`D=${ps(s)}`] },
  'PTL 5.5b': () => { let p = P(1); for (let k = 2; k <= 20; k++) p = nhan(p, tru(P(1), P(1, k))); return [ps(p)] },
  'LT 20.3': () => { const r = (36 * 5) / 6; return [String((36 + r) * 2), String(36 * r)] },
  'LT 20.13': () => { const l1 = (60 * 3) / 4, l2 = (60 - l1) / 3; return [String(60 - l1 - l2)] },
  'LT 23.4': () => { const b = motNghiem(tim(1, 5000, (b) => 7 * (b + 320) === 9 * b), '23.4'); return [String(b + 320), String(b)] }, // (b+320)/3 = 3b/7
  'LT 23.13': () => [String(motNghiem(tim(1, 100000, (t) => t % 36 === 0 && t - (t * 5) / 9 - t / 4 === 700), '23.13'))],
  'PCT 24 I.8': () => { const a = motNghiem(tim(1, 100, (a) => 35 * a === 49 * 5), 'a'), b = motNghiem(tim(0, 100, (b) => 35 * 14 === 49 * b), 'b'); return [String(a + b)] },
  'PCT 10 I.10': () => { let A = '', k = 1; for (; A.length < 545; k += 2) A += k; let L = 0, so = 1; for (let j = 1; ; j += 2) { L += String(j).length; if (L >= 545) { so = j; break } } return [A[544], String(so)] },
  // ── lô 4 ──
  'LT 8.14': () => { const a = motNghiem(tim(1, 1004, (a) => a % 2 === 1 && (1004 - a) % 2 === 1 && 1004 - a > a && tim(a + 1, 1004 - a - 1, (x) => x % 2 === 1).length === 8), '8.14'); return [String(a), String(1004 - a)] },
  'LT 8.20': () => { const ds = []; for (let d = 1; d < 42; d++) for (let r = 1; r <= d; r++) if (2 * d + r === 42 && d + 2 * r === 39) ds.push(d * r); return [String(motNghiem(ds, '8.20'))] },
  'PTL 2.5': () => [String(motNghiem(tim(0, 615, (a) => a + (a + 30) + (a + 45) === 615), 'PTL 2.5'))],
  'LT 12.1a': () => [String(motNghiem(tim(1, 10000, (A) => A * 10 + 5 - A === 887), '12.1a'))],
  'LT 12.4': () => [String(motNghiem(tim(10, 99, (n) => 800 + n === 51 * n), '12.4'))],
  'PTL 3.1': () => { const x = motNghiem(tim(1, 3000, (x) => x * 5 + x * 3 === 2096), 'PTL 3.1'); return [String(x * 35)] },
  'LT 13.17': () => { const t = motNghiem(tim(1, 200, (k) => { const d = k * 10000 - 20000; return 120000 + 150000 + 170000 + d === 4 * k * 10000 }), '13.17'); return [String(t * 10000 * 4)] },
  'PCT 24 II.2': () => [String(((150 / 100) * 2) * 23000)],
  'LT 21.16': () => [String(motNghiem(tim(1, 10000, (t) => t % 10 === 0 && (t * 2) / 5 - (t * 3) / 10 === 72), '21.16'))],
  'LT 21.19': () => [String(motNghiem(tim(1, 2000, (k) => { const T = k * 1000, C = 125000; for (let A = 0; A <= T; A += 1000) { const B = T - A - C; if (B >= 0 && 8 * A === 5 * (B + C) && 10 * B === 3 * (A + C)) return true } return false }), '21.19') * 1000)],
  'LT 22.9': () => { const r = motNghiem(tim(1, 250, (r) => (250 - r) * 2 === 3 * r), '22.9'); return [String(r * (250 - r))] },
  'LT 23.10': () => { const cam = 48 / 3, h = motNghiem(tim(0, 48, (h) => (48 - cam - h) * 3 === 5 * h), '23.10'); return [String(cam), String(h), String(48 - cam - h)] },
  'LT 22.11': () => { const b = motNghiem(tim(1, 1000, (b) => 9 * (b + 99) === 20 * b), '22.11'); return [String(b), String(b + 99)] },
  'LT 22.14': () => { const b = motNghiem(tim(6, 252, (b) => { const l = 252 - b; return l > b && Math.floor(l / b) === 12 && l % b === 5 }), '22.14'); return [String(b), String(252 - b)] },
  'LT 22.17': () => { const a = motNghiem(tim(5, 85, (a) => 3 * (a - 5) === 2 * (85 - a + 5)), '22.17'); return [String(a), String(85 - a)] },
  'LT 22.19': () => { const b = motNghiem(tim(15, 2000, (b) => 3 * (b + 244 - 15) === 7 * (b - 15)), '22.19'); return [String(b), String(b + 244)] },
  'LT 24.2': () => [String(motNghiem(tim(8, 10000, (x) => (x - 8) % 5 === 0 && ((x - 8) / 5 + 98) * 5 === 2505), '24.2'))],
  'LT 24.16': () => [String(motNghiem(tim(1, 5000, (t) => { if (t % 5) return false; const c1 = t - (t * 2) / 5; if (c1 % 3) return false; return c1 - (c1 / 3 + 20) === 60 }), '24.16'))],
  'LT 24.6': () => { const ds = []; for (let a = 15; a <= 120; a++) for (let b = 0; b <= 120 - a; b++) { const c = 120 - a - b; if (a - 15 === 40 && b + 15 - 10 === 40 && c + 10 === 40) ds.push([a, b, c]) } const [r] = ds; if (ds.length !== 1) throw new Error('24.6'); return r.map(String) },
  'PCT 10 I.9': () => [`x=${motNghiem(tim(0, 1000, (x) => { let s = 0; for (let k = 1; k <= 117; k += 4) s += x + k; return s === 2130 }), 'PCT 10 I.9')}`],
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
