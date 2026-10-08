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

export const KIEM = {
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
