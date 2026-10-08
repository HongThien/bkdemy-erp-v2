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

/**
 * TÍNH BIỂU THỨC PHÂN SỐ viết bằng LaTeX của sách (\frac, \times, :, \left( \right), số tự nhiên) — phân số chính xác.
 * Biến (vd y) thay bằng giá trị bien. Dùng để kiểm CĐ18–19 mà không tính tay.
 */
export function tinh(latex, bien = {}) {
  let s = String(latex).replace(/\$/g, '').replace(/\\left|\\right/g, '').replace(/\\times/g, '*').replace(/\\cdot/g, '*').replace(/\s+/g, '').replace(/\\,|\\ /g, '')
  // \frac{X}{Y} (lồng được) ⇒ ((X)/(Y))
  const doc = (str, i) => { let d = 0, j = i; do { if (str[j] === '{') d++; else if (str[j] === '}') d--; j++ } while (d > 0 && j < str.length); return [str.slice(i + 1, j - 1), j] }
  const boFrac = (str) => { let out = '', i = 0; while (i < str.length) { const m = str.slice(i).match(/^\\d?frac/); if (m) { const [a, j] = doc(str, i + m[0].length); const [b, k] = doc(str, j); out += `((${boFrac(a)})/(${boFrac(b)}))`; i = k } else { out += str[i]; i++ } } return out }
  s = boFrac(s).replace(/:/g, '/').replace(/[{}]/g, '')
  for (const [k, v] of Object.entries(bien)) s = s.replace(new RegExp(k, 'g'), `(${v[0]}/${v[1]})`)
  if (/[^0-9+\-*/().]/.test(s)) throw new Error(`biểu thức lạ: ${s}`)
  let p = 0
  const so = () => { if (s[p] === '(') { p++; const v = cong_(); p++; return v } let j = p; while (/\d/.test(s[j])) j++; const v = P(Number(s.slice(p, j))); p = j; return v }
  const nhan_ = () => { let v = so(); while (s[p] === '*' || s[p] === '/') { const o = s[p++]; const w = so(); v = o === '*' ? nhan(v, w) : chia(v, w) } return v }
  const cong_ = () => { let v = nhan_(); while (s[p] === '+' || s[p] === '-') { const o = s[p++]; const w = nhan_(); v = o === '+' ? cong(v, w) : tru(v, w) } return v }
  const v = cong_(); if (p !== s.length) throw new Error(`đọc dở: ${s.slice(p)}`); return v
}
/** giải "vế trái chứa y (bậc nhất) = vế phải" bằng thay y = 0 và y = 1 */
export function giaiY(trai, phai, ten = 'y') {
  const f0 = tinh(trai, { [ten]: [0, 1] }), f1 = tinh(trai, { [ten]: [1, 1] }), r = tinh(phai)
  const y = chia(tru(r, f0), tru(f1, f0))
  if (ps(tinh(trai, { [ten]: y })) !== ps(r)) throw new Error('giải y: thử ngược sai (không bậc nhất?)')
  return y
}

/** như giaiY nhưng ẩn nằm ở SỐ CHIA (a : y …) ⇒ bậc nhất theo 1/y; thử ngược bắt buộc */
export function giaiYChia(trai, phai, ten = 'y') {
  const theoZ = (z) => tinh(trai, { [ten]: [z[1], z[0]] }) // y = 1/z
  const f1 = theoZ([1, 1]), f2 = theoZ([2, 1]), r = tinh(phai), k = tru(f2, f1), b = tru(f1, k)
  const z = chia(tru(r, b), k), y = [z[1], z[0]]
  if (ps(tinh(trai, { [ten]: y })) !== ps(r)) throw new Error('giải y (số chia): thử ngược sai')
  return y
}
/** các số tự nhiên x với a < x < b (a, b là biểu thức) */
const giuaTN = (a, b) => { const A = tinh(a), B = tinh(b), ra = []; for (let x = Math.floor(A[0] / A[1]) + 1; x * B[1] < B[0]; x++) ra.push(String(x)); return ra }
const tong = (n0, n1, f) => { let s = P(0); for (let k = n0; k <= n1; k++) s = cong(s, f(k)); return s }

// ── trợ giúp CĐ 16–17 (rút gọn, quy đồng, so sánh) ──
const ucln = (a, b) => (b ? ucln(b, a % b) : a)
const toiGianP = (a, b) => ucln(a, b) === 1
const quyDong = (...f) => { const m = f.reduce((s, [, b]) => s * b / ucln(s, b), 1); return f.map(([a, b]) => `${a * m / b}/${m}`) } // mẫu chung NHỎ NHẤT
const ss = ([a, b], [c, d], cach = '') => { const s = a * d - c * b; return `${a}/${b}${s > 0 ? '>' : s < 0 ? '<' : '='}${c}/${d}` }
const xep = (f, giam = false) => [...f].sort((x, y) => (giam ? -1 : 1) * (x[0] * y[1] - y[0] * x[1])).map(([a, b]) => `${a}/${b}`).join(giam ? '>' : '<')
const nhomBang = (f) => { const g = new Map(); for (const [a, b] of f) { const k = ps(P(a, b)); g.set(k, [...(g.get(k) ?? []), `${a}/${b}`]) } return [...g.values()].filter((x) => x.length > 1).map((x) => x.join('=')) }

// ── trợ giúp CĐ 20–21 (tìm phân số của một số / tìm một số biết phân số của nó) ──
const cua = (p, x) => nhan(p, typeof x === 'number' ? P(x) : x) // p của x
const tuPhan = (p, v) => chia(typeof v === 'number' ? P(v) : v, p) // biết p của A là v ⇒ A
const conLai = (...p) => p.reduce((s, x) => tru(s, x), P(1))
const so = (x) => ps(x)

// ── trợ giúp phiếu cuối tuần ──
const tongCS = (n) => chuSo(n).reduce((a, b) => a + b, 0)
const tichCS = (n) => chuSo(n).reduce((a, b) => a * b, 1)
/** số LỚN NHẤT có các chữ số khác nhau thoả điều kiện trên TẬP chữ số (vét mọi tập con của 0–9, xếp giảm dần) */
const lonNhatKhacNhau = (dk) => { let best = -1; for (let m = 1; m < 1024; m++) { const d = []; for (let i = 9; i >= 0; i--) if (m & (1 << i)) d.push(i); if (d[0] === 0 && d.length > 1) continue; if (!dk(d)) continue; const v = Number(d.join('')); if (v > best) best = v } return best }
const demSoTu = (chu, k, dk = () => true) => { let n = 0; const di = (s, dung) => { if (s.length === k) { if (s[0] !== '0' && dk(Number(s))) n++; return } for (const c of chu) if (!dung.has(c)) { dung.add(c); di(s + c, dung); dung.delete(c) } }; di('', new Set()); return n }
const tongSoTu = (chu, k) => { let t = 0; const di = (s, dung) => { if (s.length === k) { if (s[0] !== '0') t += Number(s); return } for (const c of chu) if (!dung.has(c)) { dung.add(c); di(s + c, dung); dung.delete(c) } }; di('', new Set()); return t }

// ── trợ giúp lô 11: bài có HÌNH trong đề — dữ kiện là TOẠ ĐỘ / SỐ ĐẾM đọc từ hình gốc của sách (kho-rules/dai/hinh-de/), máy tính phần còn lại ──
/** diện tích đa giác (toạ độ ô lưới, công thức dây giày) — kiểm đếm "ô nguyên + nửa ô" của lời giải */
const dtDaGiac = (d) => Math.abs(d.reduce((s, [x, y], i) => { const [u, v] = d[(i + 1) % d.length]; return s + x * v - u * y }, 0)) / 2
/** hoán vị (vét cạn) */
const hoanVi = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r])))
const thangHang = ([ax, ay], [bx, by], [cx, cy]) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax) === 0
/** ĐẾM TAM GIÁC trong hình gồm các đoạn thẳng đã vẽ: ba điểm đôi một nằm trên cùng một đoạn đã vẽ và không thẳng hàng */
const demTamGiac = (doan) => {
  const diem = [...new Map(doan.flat().map((p) => [p.join(','), p])).values()]
  const tren = ([x, y], [[ax, ay], [bx, by]]) => thangHang([ax, ay], [bx, by], [x, y]) && x >= Math.min(ax, bx) && x <= Math.max(ax, bx) && y >= Math.min(ay, by) && y <= Math.max(ay, by)
  const noi = (p, q) => doan.some((s) => tren(p, s) && tren(q, s))
  let n = 0
  for (let i = 0; i < diem.length; i++) for (let j = i + 1; j < diem.length; j++) for (let k = j + 1; k < diem.length; k++) {
    const [p, q, r] = [diem[i], diem[j], diem[k]]
    if (!thangHang(p, q, r) && noi(p, q) && noi(q, r) && noi(p, r)) n++
  }
  return n
}
/** các GÓC (độ) có đỉnh tại một điểm của hình: mỗi tia = một hướng đi theo đoạn đã vẽ từ đỉnh đó; bỏ góc bẹt */
const cacGoc = (doan, dinh) => {
  const huong = new Map()
  for (const [a, b] of doan) for (const [p, q] of [[a, b], [b, a]]) {
    const trong = thangHang(a, b, dinh) && dinh[0] >= Math.min(a[0], b[0]) && dinh[0] <= Math.max(a[0], b[0]) && dinh[1] >= Math.min(a[1], b[1]) && dinh[1] <= Math.max(a[1], b[1])
    if (!trong || (q[0] === dinh[0] && q[1] === dinh[1])) continue
    const goc = Math.round(Math.atan2(q[1] - dinh[1], q[0] - dinh[0]) * 1800 / Math.PI) / 10
    huong.set(goc, true)
  }
  const h = [...huong.keys()], ra = []
  for (let i = 0; i < h.length; i++) for (let j = i + 1; j < h.length; j++) { let d = Math.abs(h[i] - h[j]); if (d > 180) d = 360 - d; if (d < 179.5) ra.push(d) }
  return ra
}
const gocDinh = (P, Q, R) => { const a = Math.atan2(P[1] - Q[1], P[0] - Q[0]), b = Math.atan2(R[1] - Q[1], R[0] - Q[0]); let d = Math.abs(a - b) * 180 / Math.PI; return d > 180 ? 360 - d : d }
const songSong = ([a, b], [c, d]) => (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]) === 0

export const KIEM = {
  // ── lô 11: 32 bài có HÌNH trong đề (Opus đọc hình gốc 08/10 — số trong mảng/toạ độ là ĐỌC TỪ HÌNH, phần còn lại máy tính) ──
  // LT 3.4 (image25): đĩa trái 4 ngũ giác + 3 hình tròn, nhãn "2 kg" dưới đĩa trái; đĩa phải 1 hình vuông + 2 tròn + 3 ngũ giác; cân thăng bằng
  'LT 3.4': () => { const T = 400, ng = motNghiem(tim(1, 2000, (n) => 4 * n + 3 * T === 2000), '3.4 ngũ giác'); return [String(motNghiem(tim(1, 2000, (v) => v + 2 * T + 3 * ng === 2000), '3.4 vuông'))] },
  // LT 3.14: biển 60 (image28 chỉ minh hoạ, số đã có trong đề). Với tốc độ tối đa, trong 1/10 giờ đi được 60:10 km; người lái đi 5 km
  'LT 3.14': () => [5 <= 60 / 10 ? 'có' : 'không'],
  // PTL 1.5 (image99): tam giác 6 ô — 3 ô đỉnh, 3 ô giữa cạnh. Vét cạn; nghiệm phải duy nhất (sai khác quay/lật)
  'PTL 1.5': () => { const ds = new Set(); for (const [a, b, c, x, y, z] of hoanVi([2, 3, 4, 5, 6, 7])) if (a + x + b === 14 && b + y + c === 14 && c + z + a === 14) ds.add([a, b, c].sort().join(';')); return [motNghiem([...ds], 'PTL 1.5')] },
  // LT 5.13 (image108): đa giác tô màu trên lưới, đỉnh (cột, hàng) đọc từ hình; ô cạnh 1 cm
  'LT 5.13': () => [String(dtDaGiac([[1, 1], [1, 3], [2, 4], [3, 5], [4, 4], [5, 4], [6, 5], [7, 4], [8, 3], [8, 1], [7, 2], [6, 3], [5, 2], [4, 2], [3, 3], [2, 2]]))],
  // LT 5.15 (image109): cạnh trên 12, xuống 4, bậc 5 cm, ngang 4, xuống 2, đáy 3 ⇒ chỗ thụt vào rộng 12−4−3
  'LT 5.15': () => { const thut = 12 - 4 - 3; return [String(dtDaGiac([[0, 0], [12, 0], [12, 11], [12 - 3, 11], [12 - 3, 9], [thut, 9], [thut, 4], [0, 4]]))] },
  // LT 5.17 (image110): ngoài 16 × 9, viền 2 cm mỗi phía, phần tô màu = viền
  'LT 5.17': () => [String(16 * 9 - (16 - 2 * 2) * (9 - 2 * 2))],
  // LT 5.19 (image111): cắt 4 góc vuông 2 cm khỏi hình vuông 10 cm — đi quanh mép phần còn lại
  'LT 5.19': () => { const d = [[2, 0], [8, 0], [8, 2], [10, 2], [10, 8], [8, 8], [8, 10], [2, 10], [2, 8], [0, 8], [0, 2], [2, 2]]; const cv = d.reduce((s, [x, y], i) => { const [u, v] = d[(i + 1) % d.length]; return s + Math.abs(u - x) + Math.abs(v - y) }, 0); return [String(cv), String(dtDaGiac(d))] },
  // LT 5.20 (image113): đa giác tô vàng trên lưới, đỉnh (cột, hàng) đọc từ hình; mỗi ô 1 cm²
  'LT 5.20': () => [String(dtDaGiac([[1, 2], [8, 2], [10, 1], [10, 3], [5, 5], [5, 3]]))],
  // LT 6.13 (image119): hình sau = hình trước + nối trung điểm các cạnh của tam giác ở GIỮA vừa tạo. Dựng thật tới hình 12 rồi đếm tam giác
  'LT 6.13': () => {
    const S = 1 << 14, doan = [[[0, 0], [S, 0]], [[S, 0], [S / 2, S]], [[S / 2, S], [0, 0]]]
    let giua = [[0, 0], [S, 0], [S / 2, S]]; const dem = [demTamGiac(doan)]
    for (let h = 2; h <= 12; h++) { const [p, q, r] = giua, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; giua = [m(p, q), m(q, r), m(r, p)]; doan.push([giua[0], giua[1]], [giua[1], giua[2]], [giua[2], giua[0]]); if (h <= 4) dem.push(demTamGiac(doan)) }
    if (dem.join() !== '1,5,9,13') throw new Error(`6.13 đếm hình 1–4: ${dem}`)
    return [String(demTamGiac(doan))]
  },
  // VD 15.2 (image218): 4A..4F = 45; 66; 84; 49; 72; 98 (khớp lời giải sách)
  'VD 15.2a': () => [String(tbc(45, 66, 84, 49, 72, 98))], 'VD 15.2b': () => [String([45, 66, 84, 49, 72, 98].filter((x) => x > 60).length)],
  // LT 15.5 (image221–224): số hình tròn ô tô 8, xe máy 12, xe đạp điện 6, xe đạp 4; mỗi hình 5 xe
  'LT 15.5a': () => [String(12 * 5)], 'LT 15.5b': () => { const d = { 'xe ô tô': 8, 'xe máy': 12, 'xe đạp điện': 6, 'xe đạp': 4 }, m = Math.min(...Object.values(d)); return [Object.keys(d).find((k) => d[k] === m), String(m * 5)] },
  'LT 15.5c': () => [String((12 - 8) * 5)],
  // LT 15.6 (image225–230): số hình kem vani 3, sô-cô-la 6, dâu 4, sầu riêng 11, xoài 6; mỗi hình 5 chiếc
  'LT 15.6a': () => { const d = { vani: 3, 'sô-cô-la': 6, 'dâu': 4, 'sầu riêng': 11, 'xoài': 6 }; return [Object.keys(d).find((k) => d[k] === Math.max(...Object.values(d)))] },
  'LT 15.6b': () => { const d = { vani: 3, 'sô-cô-la': 6, 'dâu': 4, 'sầu riêng': 11, 'xoài': 6 }, k = Object.keys(d), cap = []; for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) if (d[k[i]] === d[k[j]]) cap.push([k[i], k[j]]); return motNghiem(cap, '15.6b') },
  'LT 15.6c': () => [String((3 + 6 + 4 + 11 + 6) * 5)],
  // LT 15.8 (image231): tháng 1–6 = 100; 124; 148; 128; 156; 214 — giữ cả bài (ý c dùng tổng của ý b, như LT 15.4)
  'LT 15.8': () => { const d = [100, 124, 148, 128, 156, 214], t = d.reduce((a, b) => a + b, 0); return [`tháng ${d.indexOf(Math.max(...d)) + 1}`, String(t), String(t / 6 - 10)] },
  // LT 15.9 (image232): chiều cao cột tính bằng số khoảng kẻ ngang: T2..CN = 2; 3; 4; 4; 5; 4; 6
  'LT 15.9': () => { const h = [2, 3, 4, 4, 5, 4, 6], k = 150 / (h[6] - h[1]); return [String(h[5] * k)] },
  // LT 15.10 (image233): tháng 1–6 = 3; 5; 3; 4; 6; 6 khoảng kẻ
  'LT 15.10': () => { const h = [3, 5, 3, 4, 6, 6], k = (45 * 6) / h.reduce((a, b) => a + b, 0); return [String(h[3] * k)] },
  // PCT 24 I.5 (image788): 2 hàng × 7 ô; tô hàng trên 6 ô (trừ ô thứ 4), hàng dưới 3 ô (ô 3–5)
  'PCT 24 I.5': () => [`${6 + 3}/${2 * 7}`],
  // PCT 2 I.9 (image998): thẻ 0; 1; 4; 5; 8; 9 — dùng cả 6 thẻ, số gần 500000 nhất
  'PCT 2 I.9': () => { const ds = hoanVi([0, 1, 4, 5, 8, 9]).filter((p) => p[0]).map((p) => Number(p.join(''))), m = Math.min(...ds.map((n) => Math.abs(n - 500000))); return [String(motNghiem(ds.filter((n) => Math.abs(n - 500000) === m), 'PCT 2 I.9'))] },
  // PCT 2 I.10 (image999): ○○○○ − ○○○○, chữ số 1–8 mỗi chữ số một lần, hiệu nhỏ nhất (lớn hơn 0)
  'PCT 2 I.10': () => { let m = Infinity; for (const p of hoanVi([1, 2, 3, 4, 5, 6, 7, 8])) { const a = Number(p.slice(0, 4).join('')), b = Number(p.slice(4).join('')); if (a > b && a - b < m) m = a - b } return [String(m)] },
  // PCT 3 I.3 (image1004): O (497;570), OA nằm ngang sang phải, B (757;118) — toạ độ ảnh; thước đo vạch trong chỉ 60
  'PCT 3 I.3': () => [String(Math.round(gocDinh([1040, 570], [497, 570], [757, 118])))],
  // PCT 4 I.3 (image1013): ngũ giác A(568;212) B(930;612) C(930;1438) D(170;1438) E(170;612)
  'PCT 4 I.3': () => { const d = [[568, 212], [930, 612], [930, 1438], [170, 1438], [170, 612]]; return [String(d.filter((p, i) => gocDinh(d[(i + 4) % 5], p, d[(i + 1) % 5]) > 90.5).length)] },
  // PCT 5 I.10: hình cân đĩa chỉ minh hoạ (không chứa dữ kiện)
  'PCT 5 I.10': () => { const le = motNghiem(tim(1, 100, (l) => 2 * l === 4 * 1), 'lê'); return [String(3 * le)] },
  // PCT 7 I.10 (image1043): Jessica, Joan, Chloe, Alison, Kelly nhận 1;2;3;4;5 rồi 5;4;3;2;1 rồi lặp lại
  'PCT 7 I.10': () => { const ten = ['Jessica', 'Joan', 'Chloe', 'Alison', 'Kelly'], luot = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4], so = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1]; let da = 0; for (let i = 0; ; i++) { da += so[i % 10]; if (da >= 136) return [ten[luot[i % 10]]] } },
  // PCT 8 I.10 (image1051): tăng mỗi chiều 4 cm — phần tăng không phụ thuộc chiều dài/rộng cụ thể (thử mọi cặp có nửa chu vi 108)
  'PCT 8 I.10': () => { const t = new Set(tim(1, 107, (r) => true).map((r) => (108 - r + 4) * (r + 4) - (108 - r) * r)); return [String(motNghiem([...t], 'PCT 8 I.10'))] },
  // PCT 8 II.2 (image1054): đáy 21, cạnh trái 12, bậc bên phải: ngang 6, cao 6
  'PCT 8 II.2': () => [String(dtDaGiac([[0, 0], [21 - 6, 0], [21 - 6, 12 - 6], [21, 12 - 6], [21, 12], [0, 12]]))],
  // PCT 14 I.1 (image1105): E(100;126) G(682;126) H(982;597) I(100;597), cạnh EG, GH, HI, IE
  'PCT 14 I.1': () => { const E = [100, 126], G = [682, 126], H = [982, 597], I = [100, 597], c = { EG: [E, G], GH: [G, H], HI: [H, I], IE: [I, E] }, k = Object.keys(c), ra = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (songSong(c[k[i]], c[k[j]])) ra.push(k[i], k[j]); if (ra.length !== 2) throw new Error(`14 I.1: ${ra}`); return ra },
  // PCT 14 I.2 (image1106): A(557;212) B(930;592) C(930;1418) D(172;1418) E(172;592) — cạnh nào vuông góc AE (lệch ≤ 1° do vẽ tay)
  'PCT 14 I.2': () => { const A = [557, 212], B = [930, 592], C = [930, 1418], D = [172, 1418], E = [172, 592], c = { AB: [A, B], BC: [B, C], CD: [C, D], DE: [D, E] }; return [motNghiem(Object.keys(c).filter((k) => { const [p, q] = c[k], g0 = Math.abs(Math.atan2(q[1] - p[1], q[0] - p[0]) - Math.atan2(E[1] - A[1], E[0] - A[0])) * 180 / Math.PI % 180; return Math.abs(g0 - 90) <= 1 }), '14 I.2')] },
  // PCT 14 I.3 (image1107): lục giác (6 đỉnh)
  'PCT 14 I.3': () => [`${6} cạnh`, `${6} góc`],
  // PCT 14 I.6 (image1108): lập phương cạnh a cắt đôi theo đường giữa ⇒ khối a × a × a/2 (ba kích thước không bằng nhau ⇒ không phải lập phương)
  'PCT 14 I.6': () => { const a = 2, k = [a, a, a / 2]; return [new Set(k).size === 1 ? 'lập phương' : 'hộp chữ nhật'] }, // "hình/khối hộp chữ nhật" đều được
  // PCT 15 I.4 (image1110): C, B, E thẳng hàng, B nằm giữa; hình thoi có 4 cạnh bằng nhau ⇒ CB = AD, BE = EF
  'PCT 15 I.4': () => [String(4 + 6)],
  // PCT 15 I.6 (image1111): ô lưới A(3;3) B(6;1) C(8;3) (cột; hàng) — D là đỉnh thứ tư của hình bình hành với 3 điểm đã có
  'PCT 15 I.6': () => { const A = [3, 3], B = [6, 1], C = [8, 3]; if (thangHang(A, B, C)) throw new Error('15 I.6 thẳng hàng'); const ds = new Set([[A[0] + C[0] - B[0], A[1] + C[1] - B[1]], [A[0] + B[0] - C[0], A[1] + B[1] - C[1]], [B[0] + C[0] - A[0], B[1] + C[1] - A[1]]].map(String)); return [String(ds.size)] },
  // PCT 17 I.6 (image1130): kim giờ chỉ số 5, kim phút chỉ số 12 ⇒ góc = 5 × 30°
  'PCT 17 I.6': () => { const g0 = 5 * 30; return [g0 < 90 ? 'nhọn' : g0 === 90 ? 'vuông' : g0 < 180 ? 'tù' : 'bẹt'] },
  // PCT 17 I.7 (image1131): tứ giác T(298;18) L(18;430) R(1080;428) D(298;850) + 2 đường chéo TD, LR cắt nhau tại O(298;430)
  'PCT 17 I.7': () => { const T = [298, 18], L = [18, 430], R = [1080, 430], D = [298, 850], O = [298, 430], doan = [[T, L], [L, D], [D, R], [R, T], [T, D], [L, R]]; return [String([T, L, R, D, O].flatMap((p) => cacGoc(doan, p)).filter((g0) => g0 < 89.5).length)] },
  // ── lô 10E: Phiếu cuối tuần 29–35 ──
  'PCT 29 I.1': () => [so(chia(P(1, 5), P(1, 25)))], 'PCT 29 I.2': () => [6 * 11 > 9 * 7 ? '>' : '<'],
  'PCT 29 I.3': () => { const A = tinh('\\frac{3}{7}\\times\\frac{11}{5}-\\frac{3}{7}\\times\\frac{1}{5}'), B = P(7, 8), s = A[0] * B[1] - B[0] * A[1]; return [s < 0 ? 'A<B' : s > 0 ? 'A>B' : 'A=B'] },
  'PCT 29 I.4': () => [so(tinh('\\frac{2\\times 35\\times 6}{5\\times 7\\times 12}'))], 'PCT 29 I.5': () => [so(giaiYChia('\\frac{13}{6}-\\frac{7}{24}:x', '\\frac{2}{9}', 'x'))],
  'PCT 29 I.6': () => [String(tbc(11, 18, 25, 32, 39, 46, 53))], 'PCT 29 I.7': () => giuaTN('\\frac{48}{11}\\times\\frac{121}{24}', '\\frac{100}{21}\\times\\frac{126}{25}'),
  'PCT 29 I.8': () => { const t = 240 / (12 + 8); return [String(12 * t), String(8 * t)] }, 'PCT 29 I.9': () => { const c = P(4, 5); if (so(nhan(c, c)) !== '16/25') throw new Error('29 I.9'); return [so(nhan(c, P(4)))] },
  'PCT 29 I.10': () => { const iii = conLai(P(2, 5), P(1, 3)); return [so(tuPhan(tru(P(2, 5), iii), 20))] },
  'PCT 29 II.1a': () => [so(tinh('\\frac{17}{12}+\\frac{9}{7}-(\\frac{27}{21}-\\frac{7}{12})'))], 'PCT 29 II.1b': () => [so(tinh('\\frac{7}{8}:\\frac{14}{9}\\times\\frac{3}{18}'))],
  'PCT 29 II.1c': () => [so(tinh('\\frac{8}{19}:\\frac{7}{3}+\\frac{7}{19}:\\frac{7}{3}+\\frac{4}{19}:\\frac{7}{3}'))], 'PCT 29 II.1d': () => [so(tinh('\\frac{13}{14}\\times\\frac{17}{4}\\times\\frac{56}{15}\\times\\frac{70}{39}:\\frac{34}{21}\\times\\frac{25}{49}'))],
  'PCT 29 II.2': () => [so(cua(conLai(P(2, 5)), 25 * 18))], 'PCT 29 II.3': () => { let p = P(1); for (let k = 2; k <= 100; k++) p = nhan(p, cong(P(1), P(1, k * k - 1))); return [so(p)] },
  'PCT 30 I.1': () => [so(cua(P(2, 5), 10))], 'PCT 30 I.2': () => [so(giaiY('y\\times\\frac{3}{2}+y', '\\frac{5}{4}'))], 'PCT 30 I.3': () => [String((4 * 28) / 8)], 'PCT 30 I.4': () => [so(cua(P(7, 9), 12 * 12))],
  'PCT 30 I.5': () => [so(cua(conLai(P(2, 3)), 42))], 'PCT 30 I.6': () => [13 * 17 > 23 * 7 ? '>' : '<'], 'PCT 30 I.7': () => [so(P(20, 30))], 'PCT 30 I.8': () => [so(P(1, 4))], // 2 đồng xu: SS, SN, NS, NN
  'PCT 30 I.9': () => [so(giaiY('(y-\\frac{3}{7})\\times\\frac{14}{9}', '\\frac{5}{6}'))], 'PCT 30 I.10': () => [String(motNghiem(tim(0, 51, (k) => 5 * (51 - k) === 3 * (61 + k)), '30 I.10'))],
  'PCT 30 II.1a': () => [so(cua(P(3, 4), 52))], 'PCT 30 II.1b': () => [so(cua(P(5, 9), 72))], 'PCT 30 II.1c': () => [so(cua(P(2, 9), 27))], 'PCT 30 II.1d': () => [so(cua(P(4, 7), 252))],
  'PCT 30 II.2': () => { const c = motNghiem(tim(0, 100, (c) => 5 * c === c + 28), '30 II.2'); return [String(c + 3), String(c + 28 + 3)] },
  'PCT 30 II.3': () => { const n = motNghiem(tim(0, 500, (n) => 7 * n === 6 * (n + 12)), '30 II.3'); return [String(n), String(n + 12)] },
  'PCT 31 I.1': () => [so(cua(P(1, 3), P(6, 5)))], 'PCT 31 I.2': () => [so(tinh('1-\\frac{3}{8}+\\frac{1}{4}'))], 'PCT 31 I.3': () => [String(motNghiem(tim(3, 100, (x) => (x - 3) * 36 === 15 * 12), '31 I.3'))],
  'PCT 31 I.4': () => tim(1, 100, (b) => 3 * 6 > b && 3 * 5 < b).map((b) => `3/${b}`), 'PCT 31 I.5': () => [String(136 - 125)],
  'PCT 31 I.6': () => [so(tru(P(3, 5), cua(P(1, 2), P(3, 5))))], // phần bánh còn lại của miếng 3/5 (cách hiểu đã chọn, ghi cho CEO)
  'PCT 31 I.7': () => { const r = (72 / 2 - 6) / 2; return [so(cua(conLai(P(4, 7)), r * (r + 6)))] }, 'PCT 31 I.8': () => [String(11 * 3 - 13 * 2)],
  'PCT 31 I.9': () => [so(cua(conLai(P(2, 5), P(1, 4)), 240))], 'PCT 31 I.10': () => [so(tong(0, 4, (i) => P(2, (2 * i + 1) * (2 * i + 3))))],
  'PCT 31 II.1a': () => [so(tuPhan(P(2, 3), 24))], 'PCT 31 II.1b': () => [so(tuPhan(P(5, 6), 120))], 'PCT 31 II.1c': () => [so(tuPhan(P(7, 9), 91))], 'PCT 31 II.1d': () => [so(tuPhan(P(11, 3), 121))],
  'PCT 31 II.2': () => { const t = tuPhan(tru(P(3, 5), P(2, 7)), 77); return [so(cua(cong(P(3, 5), P(2, 7)), t))] },
  'PCT 31 II.3': () => { const d3 = 40 * 3 / 5, d4 = (40 - d3) / 4, d56 = (d3 + d4) / 4; return [String(40 - d3 - d4 - d56)] }, // ngày 5 và 6 GỘP = 1/4 bốn ngày đầu (cách hiểu đã chọn)
  'PCT 32 I.1': () => [xep([[22, 23], [19, 19], [21, 20]]).split('<')[0]], 'PCT 32 I.2': () => [String(motNghiem(tim(0, 13, (x) => (13 - x) * 32 === 28 * 8), '32 I.2'))],
  'PCT 32 I.3': () => [so(tinh('\\frac{23}{24}-\\frac{3}{8}+\\frac{1}{4}'))], 'PCT 32 I.4': () => [2023 * 2023 > 2021 * 2025 ? 'A>B' : 'A<B'], 'PCT 32 I.5': () => [String(tbc(10, 9, 9, 10, 8, 8, 9, 10, 8, 9))],
  'PCT 32 I.6': () => [String((60 + 40) * 2)], 'PCT 32 I.7': () => [so(cua(conLai(P(2, 5), P(1, 4)), 200000))],
  'PCT 32 I.8': () => [String(motNghiem(tim(0, 31, (k) => 5 * (31 - k) === 2 * (53 + k)), '32 I.8'))],
  'PCT 32 I.9': () => { const a = motNghiem(tim(1, 200, (a) => a % 2 === 1 && tim(a + 1, 3 * a - 1, (x) => x % 2 === 0).length === 13), '32 I.9'); return [String(a), String(3 * a)] },
  'PCT 32 I.10': () => [String(Math.max(...tim(100, 999, (n) => { const [, b, c] = chuSo(n); return tongCS(n) === 12 && c === 3 * b && b > 0 })))],
  'PCT 32 II.1': () => [so(P(12, 30 - 12))], 'PCT 32 II.2': () => [String(40 + 40 * 4 / 5)],
  'PCT 32 II.3': () => { const t = motNghiem(tim(0, 500, (t) => 2 * (t + 45 + 6) === 5 * (t - 6)), '32 II.3'); return [String(t + 45), String(t)] },
  'PCT 33 I.1': () => [so(tinh('\\frac{7}{9}\\times\\frac{25}{28}\\times\\frac{4}{5}'))], 'PCT 33 I.2': () => [7 * 10000 + 25 < 725 * 100 ? '<' : '>'], 'PCT 33 I.3': () => [String((30 / 5) * 7)],
  'PCT 33 I.4': () => [String(tim(1000, 9999, (n) => khacNhau(n) && tongCS(n) === 17)[0])], 'PCT 33 I.5': () => [so(tuPhan(P(5, 7), 105))], 'PCT 33 I.6': () => [40 * 55 < 41 * 57 ? 'A<B' : 'A>B'],
  'PCT 33 I.7': () => [String((2 * 55 + 3 * 50) / 5)], 'PCT 33 I.8': () => [String(15 + 12 + 1)], 'PCT 33 I.9': () => [so(tuPhan(conLai(P(3, 4)), 120))],
  'PCT 33 I.10': () => [so(tuPhan(cua(conLai(P(5, 9)), conLai(P(2, 5))), 24))],
  'PCT 33 II.1a': () => [String((7 * 18) / 9)], 'PCT 33 II.1b': () => [String((125 * 2) / 5)],
  'PCT 33 II.2': () => { const c = motNghiem(tim(0, 50, (c) => c + 7 * c + 8 === 48), '33 II.2'); return [String(c), String(7 * c)] },
  'PCT 33 II.3': () => { const t = motNghiem(tim(1, 99, (t) => t % 7 === 0 && t % 6 === 0 && t % 4 === 0), '33 II.3'); return [t / 7, t / 6, t / 4, t - t / 7 - t / 6 - t / 4].map(String) },
  'PCT 34 I.1': () => [String(63 * 69 + 79 * 69 - 42 * 69)], 'PCT 34 I.2': () => [so(tinh('\\frac{13}{24}+\\frac{15}{16}:\\frac{9}{24}'))], 'PCT 34 I.3': () => [so(cua(P(3, 10), 200))], 'PCT 34 I.4': () => [so(tuPhan(P(4, 7), 64))],
  'PCT 34 I.5': () => { const h = motNghiem(tim(5, 48, (h) => 48 - h + 5 === 2 * (h - 5)), '34 I.5'); return [String(h), String(48 - h)] },
  'PCT 34 I.6': () => [String(motNghiem(tim(100, 999, (n) => { const [a, b, c] = chuSo(n); return a + b + c === 18 && a === b + c - 2 && c === b + 4 }), '34 I.6'))],
  'PCT 34 I.7': () => [String(motNghiem(tim(10, 99, (n) => n === (Math.floor(n / 10) + (n % 10)) * 8 + 3), '34 I.7'))], 'PCT 34 I.8': () => [String((33 - 6 - 3) / 2)],
  'PCT 34 I.9': () => [so(tuPhan(cua(conLai(P(1, 2)), conLai(P(1, 4))), 150))], 'PCT 34 I.10': () => [so(tong(3, 9, (k) => P(1, k * (k + 1))))],
  'PCT 34 II.1a': () => [so(tinh('\\frac{5}{12}+\\frac{13}{11}+\\frac{7}{12}-\\frac{2}{11}'))], 'PCT 34 II.1b': () => [so(tinh('\\frac{7}{28}:\\frac{5}{9}-\\frac{7}{28}\\times\\frac{4}{5}'))],
  'PCT 34 II.2': () => [String(72 * 2 / 4), String(72 * 2 / 4 * 3)], 'PCT 34 II.3': () => [so(tuPhan(cua(conLai(P(3, 4)), conLai(P(2, 5))), 6))],
  'PCT 35 I.1': () => [String(2387 + 3457 + 1613 - 457)], 'PCT 35 I.2': () => { const be = tuPhan(P(6), P(11, 8)); const x = chia(P(11, 8), P(6)); return [so(x), so(nhan(x, P(5)))] },
  'PCT 35 I.3': () => [so(nhan(P(3, 4), P(4)))], 'PCT 35 I.4': () => [String(motNghiem(tim(100, 999, (x) => x * 10 + 1 + 1000 + x === 3707), '35 I.4'))],
  'PCT 35 I.5': () => [so(tuPhan(conLai(P(2, 3), P(1, 5)), 20000))], 'PCT 35 I.6': () => tim(100, 999, (n) => n % 45 === 0 && String(n) === [...String(n)].reverse().join('')).map(String),
  'PCT 35 I.7': () => [String(90 - 15 + 8), String(90 + 15 - 8)], 'PCT 35 I.8': () => [so(tuPhan(cua(conLai(P(4, 9)), conLai(P(2, 5))), 60))],
  'PCT 35 I.9': () => [String(motNghiem(tim(0, 1000, (a) => 8 * (41 + a) === 5 * (71 + a)), '35 I.9'))], 'PCT 35 I.10': () => [String(tim(1, 2024, (n) => n % 3 !== 0).length)],
  'PCT 35 II.1': () => [String(motNghiem(tim(80, 1000, (x) => (x - 80) * 25 + 77 === 702), '35 II.1'))],
  'PCT 35 II.2': () => { const s = 2150 - 890, h = motNghiem(tim(0, s, (h) => 4 * (s - h) === 3 * h), '35 II.2'); return [String(s - h), String(h)] },
  'PCT 35 II.3': () => { const nha = P(5, 9); return [so(tuPhan(conLai(nha, cua(P(11, 25), nha)), 108))] },
  // ── lô 10D: Phiếu cuối tuần 22–28 ──
  'PCT 22 I.1': () => [String(18625 / 125)], 'PCT 22 I.2': () => [String(1880 / 40)], 'PCT 22 I.3': () => [String(Math.ceil(1072 / 25))], 'PCT 22 I.4': () => [String(864 / 12 + 336 / 12)],
  'PCT 22 I.5': () => [String(1320 / 66)], 'PCT 22 I.6': () => [String(954 / 9)], 'PCT 22 I.7': () => [String(Math.max(...tim(100, 999, khacNhau)) / 7)], 'PCT 22 I.8': () => [String((252 * 35) / 210)],
  'PCT 22 I.9': () => [String((3150 + 3150 / 5) / 7)], 'PCT 22 I.10': () => [String(motNghiem(tim(2, 2022, (d) => 288 * d + d - 1 === 2022), '22 I.10'))],
  'PCT 22 II.1a': () => [String(105 * 214)], 'PCT 22 II.1b': () => [String(1242 / 27)], 'PCT 22 II.1c': () => [String(Math.floor(8872 / 22)), String(8872 % 22)], 'PCT 22 II.1d': () => [String(Math.floor(945 / 221)), String(945 % 221)],
  'PCT 22 II.2': () => [String((552 / 23) * 7)], 'PCT 22 II.3': () => [String(motNghiem(tim(0, 200, (n) => 3 * (n + 4) === 36 + 44 + n), '22 II.3'))],
  'PCT 23 I.1': () => [String(9548 - 6448 / 31)], 'PCT 23 I.2': () => [String(motNghiem(tim(1, 882, (y) => 2882 - 882 / y === 2833), '23 I.2'))], 'PCT 23 I.3': () => [String(8 * 7 + 6)],
  'PCT 23 I.4': () => [String((1216 * 3) / 24)], 'PCT 23 I.5': () => [String([30, 35, 32, 33, 31, 29, 28, 32].reduce((a, b) => a + b))], 'PCT 23 I.6': () => { const d = [33, 32, 30, 29, 31, 34, 35]; return [String(tbc(Math.min(...d), Math.max(...d)))] },
  'PCT 23 I.7': () => [String(2075 / 25 - 64)], 'PCT 23 I.8': () => [String((96000 / 4) * 5 + (72000 / 6) * 2)], 'PCT 23 I.9': () => [String(motNghiem(tim(0, 500, (t) => 3 * (t - 2) === 40 + 30 + t), '23 I.9'))],
  'PCT 23 I.10': () => { const a = motNghiem(tim(1, 1375, (a) => a % 2 === 1 && 11 * a + 110 === 1375), '23 I.10'); return [String(a + 20)] },
  // PCT 23 II.1a (sắp xếp ngày theo quãng đường): soát tay — thứ tự Thứ tư < Thứ sáu < Thứ hai < Thứ ba < Thứ năm
  'PCT 23 II.1b': () => [String(tbc(4600, 4620, 4254, 5000, 4376))], 'PCT 23 II.2': () => [String((448 / 32) * 15)],
  'PCT 23 II.3': () => [String(tim(11, 66, (n) => { const a = Math.floor(n / 10), b = n % 10; return a >= 1 && a <= 6 && b >= 1 && b <= 6 && a + b === 8 }).length)], // 2 xúc xắc phân biệt (như LT 15.13)
  'PCT 24 I.1': () => [String(tbc(28, 30, 33, 34, 35))], 'PCT 24 I.2': () => [String((300000 / 5) * 8)],
  'PCT 24 I.3': () => { const d = [28, 22, 19, 24, 32, 30, 31]; return [['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật'][d.indexOf(Math.max(...d))]] },
  'PCT 24 I.4': () => [String((480 / 24) * (24 - 15))], 'PCT 24 I.6': () => ['12/13'], 'PCT 24 I.7': () => [ps(P(54, 78))], 'PCT 24 I.9': () => [String(tim(1, 24, (a) => 24 % a === 0).length)],
  'PCT 24 I.10': () => [String(tim(1, 99, (b) => toiGianP(5, b)).length)],
  'PCT 24 II.1a': () => { const f = [[3, 12], [11, 19], [15, 45], [9, 25], [36, 54]]; return f.map(([a, b]) => `${a}/${b}`) }, 'PCT 24 II.1b': () => [[3, 12], [15, 45], [36, 54]].map(([a, b]) => ps(P(a, b))),
  ...(() => { const d = [30, 32, 31, 34, 35, 36, 30, 32, 31, 33, 28], t = tbc(...d); return { 'PCT 24 II.3a': () => [String(d.length)], 'PCT 24 II.3b': () => [String(t)], 'PCT 24 II.3c': () => [String(d.filter((x) => x > t).length)] } })(),
  'PCT 25 I.1': () => [String(tbc(7, 8, 9, 10, 9, 9, 10, 10, 10, 8, 9, 9))], 'PCT 25 I.2': () => [String(108 / (72 / 6))], 'PCT 25 I.3': () => [String(23 * 3 - 18 - 24)],
  'PCT 25 I.4': () => [String((9 * 13600 + 7 * 12400) / 16)], 'PCT 25 I.5': () => [ps(P(56, 72))], 'PCT 25 I.6': () => [[[12, 15], [20, 100], [16, 32], [9, 24]].filter(([a, b]) => a * 8 === 3 * b).map(([a, b]) => `${a}/${b}`)[0]],
  'PCT 25 I.7': () => [String((3 * 24) / 4 + 5)], 'PCT 25 I.8': () => [ps(P(12 * 7 * 4, 36 * 6))], 'PCT 25 I.9': () => { const t = (375 * 2 - 500) / 2; return [ps(P(t, t + 500))] },
  'PCT 25 I.10': () => ['1/30', '1/42'], 'PCT 25 II.1a': () => [String((3 * 24) / 8)], 'PCT 25 II.1b': () => [String((5 * 36) / 6 - 5)], 'PCT 25 II.1c': () => [String((12 * 40) / 15 - 4)],
  'PCT 25 II.2': () => { const m = motNghiem(tim(1, 27, (m) => m - 7 === 27 - m), '25 II.2'); return [`${27 - m}/${m}`] },
  'PCT 25 II.3a': () => [ps(tinh('\\frac{24\\times 45}{3\\times 5\\times 8\\times 9}'))], 'PCT 25 II.3b': () => [ps(tinh('\\frac{3636\\times 54}{4848\\times 45}'))],
  'PCT 26 I.1': () => ['<'], 'PCT 26 I.2': () => ['9/8'], 'PCT 26 I.3': () => nhomBang([[8, 12], [20, 8], [14, 21], [12, 16]]), 'PCT 26 I.4': () => [String(3 * 24)], 'PCT 26 I.5': () => [`${(7 / 42) * 48}/48`],
  'PCT 26 I.6': () => [xep([[3, 4], [7, 8], [13, 16]], true).split('>')[0]], 'PCT 26 I.7': () => [xep([[1, 3], [4, 7], [2, 9]]).split('<')[0]], 'PCT 26 I.8': () => [ss([2023, 2025], [2025, 2027])],
  'PCT 26 I.9': () => [xep([[3, 2], [7, 8], [6, 5], [3, 4]], true)], 'PCT 26 I.10': () => [String(tim(0, 12, (n) => 4 * n > 12 && 8 * n < 60).length)],
  'PCT 26 II.1a': () => quyDong([3, 4], [11, 12]), 'PCT 26 II.1b': () => quyDong([3, 7], [5, 9]), 'PCT 26 II.1c': () => quyDong([1, 2], [3, 5], [11, 20]),
  'PCT 26 II.2': () => [String(motNghiem(tim(0, 53, (m) => (53 - m) * 9 === 5 * 90), '26 II.2'))], 'PCT 26 II.3': () => [2023 * 2024 > 2022 * 2025 ? 'A>1' : 'A<1'],
  'PCT 27 I.1': () => [ps(tinh('\\frac{1}{9}+\\frac{2}{9}+\\frac{5}{9}'))], 'PCT 27 I.2': () => [ps(giaiY('y+\\frac{1}{5}', '\\frac{9}{10}'))], 'PCT 27 I.3': () => [ps(tinh('\\frac{1}{4}+\\frac{1}{2}'))],
  'PCT 27 I.4': () => [ps(tinh('\\frac{1}{4}+\\frac{1}{4}+\\frac{1}{5}'))], 'PCT 27 I.5': () => [ps(tinh('\\frac{7}{20}+\\frac{5}{8}+\\frac{13}{20}+\\frac{11}{8}'))], 'PCT 27 I.6': () => [ps(tinh('\\frac{1}{4}+\\frac{1}{5}+\\frac{3}{10}'))],
  'PCT 27 I.7': () => tim(0, 20, (n) => n > 5 && n < 8).map(String), 'PCT 27 I.8': () => [ps(giaiY('y-2-\\frac{7}{8}', '\\frac{9}{4}'))],
  'PCT 27 I.9': () => [ps(tinh('\\frac{30\\times 25\\times 7\\times 8}{75\\times 8\\times 12\\times 14}'))], 'PCT 27 I.10': () => [ps(tong(0, 4, (i) => P(2, (5 + 2 * i) * (7 + 2 * i))))],
  'PCT 27 II.1a': () => [ps(tinh('\\frac{1}{2}+\\frac{2}{5}+\\frac{3}{10}'))], 'PCT 27 II.1b': () => [ps(tinh('\\frac{5}{4}-\\frac{7}{12}+\\frac{3}{8}'))], 'PCT 27 II.1c': () => [ps(tinh('\\frac{11}{5}-\\frac{7}{15}-\\frac{4}{3}'))],
  'PCT 27 II.2': () => [ps(tinh('\\frac{7}{4}-\\frac{1}{2}-(\\frac{1}{2}+\\frac{1}{8})'))],
  'PCT 27 II.3a': () => [ps(tinh('\\frac{8}{27}+\\frac{4}{15}+\\frac{19}{27}+\\frac{11}{15}'))], 'PCT 27 II.3b': () => [ps(tinh('\\frac{66}{30}+\\frac{12}{7}+\\frac{27}{81}-\\frac{5}{25}+\\frac{6}{9}-\\frac{10}{14}'))],
  'PCT 28 I.1': () => [String(tbc(138, 142, 144, 140))], 'PCT 28 I.2': () => [String((96 / 8) * 5)], 'PCT 28 I.3': () => [xep([[3, 2], [18, 4], [20, 12]], true).split('>')[0]], 'PCT 28 I.4': () => [ss([9, 10], [3, 4])],
  'PCT 28 I.5': () => [ps(tinh('\\frac{11}{12}+\\frac{5}{18}'))], 'PCT 28 I.6': () => [ps(P(4, 6))], 'PCT 28 I.7': () => [String(motNghiem(tim(0, 100, (n) => 3 * (n + 2) === 16 + 14 + n), '28 I.7'))],
  'PCT 28 I.8': () => { const bao = 400 / (8 - 6); return [String((8 * bao) / 100), String((6 * bao) / 100)] }, 'PCT 28 I.9': () => [`${(17 + 5) / 2}/${(17 - 5) / 2}`],
  'PCT 28 I.10': () => { const t = 2021 * 2022 + 18, m = 2020 * 2024 - 2000; return [t === m ? 'B=1' : t > m ? 'B>1' : 'B<1'] },
  'PCT 28 II.1a': () => [ps(tinh('2\\times\\frac{3}{16}\\times\\frac{4}{15}\\times 5'))], 'PCT 28 II.1b': () => [ps(tinh('\\frac{6}{7}\\times\\frac{14}{9}\\times\\frac{3}{18}'))],
  'PCT 28 II.1c': () => [ps(tinh('\\frac{9}{13}\\times\\frac{1}{3}+\\frac{9}{13}\\times\\frac{1}{4}+\\frac{7}{12}\\times\\frac{4}{13}'))], 'PCT 28 II.1d': () => [ps(tinh('\\frac{5}{8}\\times\\frac{5}{6}+\\frac{2}{3}\\times\\frac{10}{16}-\\frac{5}{8}\\times\\frac{1}{2}'))],
  'PCT 28 II.2': () => [ps(tinh('\\frac{1}{8}+\\frac{1}{6}+2\\times\\frac{1}{6}'))], 'PCT 28 II.3': () => [ps(tong(0, 20, (i) => P(2, (1 + 4 * i) * (5 + 4 * i))))],
  // ── lô 10C: Phiếu cuối tuần 15–21 ──
  'PCT 15 I.1': () => [String([752, 2875, 10349, 98586].filter((x) => x % 5 === 0))], 'PCT 15 I.2': () => [String([918, 2020, 2022, 4653].filter((x) => x % 3 === 0 && x % 9 !== 0))],
  'PCT 15 I.3': () => [String(Math.min(...tim(1000, 9999, (n) => khacNhau(n) && chuSo(n).every((c) => [0, 2, 5, 4].includes(c)) && n % 10 === 0)))],
  'PCT 15 I.5': () => [String(motNghiem(tim(57, 64, (n) => n % 5 === 0 && n % 2 === 0), '15 I.5'))], 'PCT 15 I.7': () => [String(chuSo(11 * 13 * 19 * 23 * 27)[3])],
  'PCT 15 I.8': () => [String(Math.max(...tim(1000, 9999, (n) => n % 2 === 1 && tongCS(n) === 19 && n % 5 === 0)))],
  'PCT 15 I.9': () => tim(0, 99, (ab) => { const a = Math.floor(ab / 10), b = ab % 10, n = 50370 + a * 1000 + b; return khacNhau(n) && n % 15 === 0 }).map((ab) => String(50370 + Math.floor(ab / 10) * 1000 + (ab % 10))),
  'PCT 15 I.10': () => [String(tim(1000, 9999, (n) => khacNhau(n) && n % 5 === 0 && chuSo(n).every((c) => c % 2 === 1)).length)],
  'PCT 15 II.1': () => { const t = Math.max(...tim(100, 999, (n) => n % 2 === 0)), h = Math.min(...tim(100, 999, (n) => n % 5 === 0)); return [String((t + h) / 2), String((t - h) / 2)] },
  'PCT 15 II.2': () => [String(tim(39, 2023, (n) => n % 3 !== 0).length)],
  'PCT 15 II.3': () => tim(0, 99, (ab) => (20370 + Math.floor(ab / 10) * 1000 + (ab % 10)) % 45 === 0).map((ab) => String(20370 + Math.floor(ab / 10) * 1000 + (ab % 10))),
  'PCT 16 I.1': () => ['3', '8', '9'], 'PCT 16 I.2': () => ['5000000'], 'PCT 16 I.3': () => ['700000'], 'PCT 16 I.4': () => [String(7642 + 1291 + 1358 + 2709)], 'PCT 16 I.5': () => [String(22223 % 9)],
  'PCT 16 I.6': () => tim(750, 759, (n) => n % 5 === 2).map(String), 'PCT 16 I.7': () => { const n = motNghiem(tim(89000, 89999, (n) => Math.floor(n / 10) % 10 === 5 && n % 10 === 0 && n % 9 === 1), '16 I.7'); return [String(Math.floor(n / 100) % 10), String(n % 10)] }, // 89x5y: x hàng trăm, y hàng đơn vị
  'PCT 16 I.8': () => [String(motNghiem(tim(31, 49, (n) => n % 5 === 0 && n % 9 === 0), '16 I.8'))],
  'PCT 16 I.9': () => { const d = (350 / 2 + 25) / 2, r = 350 / 2 - d; return [String((d * r * 2) / 1000)] },
  'PCT 16 I.10': () => [String(tim(1, 1000, (n) => n % 2 === 1 && n % 3 === 2 && n % 5 === 4)[0])],
  'PCT 16 II.1a': () => [String(108 * 54 + 45)], 'PCT 16 II.1b': () => [String((254 - 16) / 14)],
  'PCT 16 II.2a': () => [String([...'HAPPYNEWYEAR'].filter((c) => c === 'P').length * 70)], 'PCT 16 II.2b': () => { const w = 'HAPPYNEWYEAR', c = w[(2022 - 1) % w.length]; return [c, 'NEW'] },
  'PCT 16 II.3': () => [String(tim(1, 2023, (n) => n % 9 !== 0).length)],
  'PCT 17 I.1': () => [String([3578, 4290, 10235, 729180, 54279, 6549].filter((x) => x % 90 === 0))], 'PCT 17 I.2': () => [String(motNghiem(tim(0, 9, (a) => (75029 + a * 100) % 9 === 4), '17 I.2'))],
  'PCT 17 I.3': () => [String(tim(0, 9, (a) => (4609 + a * 10) % 3 === 1).length)], 'PCT 17 I.4': () => [String(Math.floor(5432 / 12)), String(5432 % 12)],
  'PCT 17 I.5': () => { const a = 235900 - (200100 - 30500), b = 235900 - 200100 - 30500; return [a > b ? '>' : a < b ? '<' : '='] },
  'PCT 17 I.8': () => { const mau = [...Array(2).fill('đỏ'), ...Array(3).fill('xanh'), ...Array(3).fill('vàng'), 'trắng']; return [mau[(250 - 1) % mau.length]] },
  'PCT 17 I.9': () => tim(100, 999, (n) => n % 15 === 0 && String(n) === [...String(n)].reverse().join('')).map(String),
  'PCT 17 I.10': () => { const ro = [15, 16, 18, 19, 20, 31], tong = ro.reduce((a, b) => a + b), kq = new Set(); for (const r of ro) { const ban = ro.filter((x) => x !== r), s = tong - r; if (s % 3) continue; for (let m = 0; m < 32; m++) { const ga = ban.filter((_, i) => m & (1 << i)).reduce((a, b) => a + b, 0); if (ga * 3 === s) kq.add(r) } } return [String(motNghiem([...kq], '17 I.10'))] },
  'PCT 17 II.1a': () => [String(98765 + 12328)], 'PCT 17 II.1b': () => [String(52347 + 8997)], 'PCT 17 II.1c': () => [String(32708 - 11239)], 'PCT 17 II.1d': () => [String(46127 - 9898)],
  'PCT 17 II.2a': () => { const d = [0, 0, 0, 0, 0]; for (let i = 0; i < 349; i++) d[i % 5]++; return d.map(String) }, 'PCT 17 II.2b': () => [['vàng', 'xanh', 'đỏ', 'tím', 'trắng'][(349 - 1) % 5]],
  'PCT 17 II.3': () => [String(tim(2, 10000, (n) => [2, 3, 5, 7].every((k) => n % k === 1))[0])],
  'PCT 18 I.1': () => [String(6000000 + 700000 + 800 + 50 + 3)], 'PCT 18 I.2': () => [String(8 * 1000 + 23)], 'PCT 18 I.3': () => [String(27182 + 3755 - 7182 - 755)],
  'PCT 18 I.4': () => { const a = 51 * 100 + 78; return [a < 5179 ? '<' : a > 5179 ? '>' : '='] }, 'PCT 18 I.5': () => [String((2 * 60 + 24 + 3 * 60 + 36) / 60)],
  'PCT 18 I.6': () => [String((800 * 600) / (40 * 40))], 'PCT 18 I.7': () => { const r = 1664 / 52; return [String(((52 + r) * 2) / 2)] },
  'PCT 18 I.8': () => [String(motNghiem(tim(0, 10000, (x) => 10 * x + 4 - x === 517), '18 I.8'))], 'PCT 18 I.9': () => [String(motNghiem(tim(10, 99, (x) => 400 + x === 17 * x), '18 I.9'))],
  'PCT 18 I.10': () => [String(motNghiem(tim(10, 99, (n) => n === (Math.floor(n / 10) + (n % 10)) * 8 + 3), '18 I.10'))],
  ...(() => { const A = () => String(2345 + 5342 + 23546 + 655 + 4658 - 3546), B = () => String(8 * 2024 * 125 * 4 * 25); return { 'PCT 18 II.1': () => [A(), B()], 'PCT 18 II.1A': () => [A()], 'PCT 18 II.1B': () => [B()] } })(),
  'PCT 18 II.2a': () => { const x = motNghiem(tim(10, 99, (x) => x * 10 + 3 - x === 408), '18 II.2a'); return [String(Math.floor(x / 10)), String(x % 10)] },
  'PCT 18 II.2b': () => { const x = motNghiem(tim(100, 999, (x) => 2000 + x === 17 * x), '18 II.2b'); return chuSo(x).map(String) },
  'PCT 18 II.3': () => [String(motNghiem(tim(10, 99, (x) => x + 300 + x === 414), '18 II.3'))],
  'PCT 19 I.1': () => [String(215432 * 5)], 'PCT 19 I.2': () => [String(tbc(42, 48, 60))], 'PCT 19 I.3': () => [String(1237 + 545 * 5)], 'PCT 19 I.4': () => [String(126 * 3)],
  'PCT 19 I.5': () => [String(3684 * 3 * 3)], 'PCT 19 I.6': () => [String(75 * 2 - 15)], 'PCT 19 I.7': () => [String(tbc(50, 45, 46))], 'PCT 19 I.8': () => [String(458 * 2 - 518)],
  'PCT 19 I.9': () => [String((1800 * 2 + 1500) / 3)], 'PCT 19 I.10': () => { let d = 0; const r = []; for (let n = 1; n <= 2000; n++) { d += String(n).length; if (d === 2 * n) r.push(n) } return [String(motNghiem(r, '19 I.10'))] },
  'PCT 19 II.1a': () => [String(tbc(210, 306, 378))], 'PCT 19 II.1b': () => [String(tbc(15, 20, 25, 30, 35))], 'PCT 19 II.1c': () => [String(tbc(1, 4, 7, 10, 13, 16, 19))],
  'PCT 19 II.1d': () => [String(tbc(...tim(15, 2025, (n) => n % 5 === 0)))], 'PCT 19 II.2': () => [String((2 * 32 + 6 * 48) / 8)], 'PCT 19 II.3': () => [String((235 * 9 + 45) / 9)],
  'PCT 20 I.1': () => [String(tbc(60, 72, 78))], 'PCT 20 I.2': () => [String(tbc(14, 21, 28, 35, 42, 49, 56))],
  'PCT 20 I.3': () => { const h = Math.min(...tim(100, 999, khacNhau)), t = 186 * 2; return [String((t + h) / 2), String((t - h) / 2)] },
  'PCT 20 I.4': () => [String(416 * 3 - 296 - 367)], 'PCT 20 I.5': () => { const a = motNghiem(tim(0, 200, (a) => a % 2 === 0 && a + 4 === 52), '20 I.5'); return [0, 2, 4, 6, 8].map((k) => String(a + k)) },
  'PCT 20 I.6': () => [String(motNghiem(tim(0, 2000, (c) => c === (255 + 179 + c) / 3 + 36), '20 I.6'))], 'PCT 20 I.7': () => [String(151 + 4)],
  'PCT 20 I.8': () => [String(motNghiem(tim(0, 200, (c) => 3 * c === 37 + 41 + c), '20 I.8'))], 'PCT 20 I.9': () => [String(motNghiem(tim(0, 200, (t) => 3 * (t + 4) === 26 + 24 + t), '20 I.9'))],
  'PCT 20 I.10': () => { const s = 68 * 3, a = 89 * 3 - s, b = (127 * 3 - s) / 3; return [String(a), String(b), String(s - a - b)] },
  'PCT 20 II.1a': () => [String(2024 * 101 - 2024)], 'PCT 20 II.1b': () => [String(175 * 100 - 125 * 100)], 'PCT 20 II.1c': () => [String(25 * 234 * 4)], 'PCT 20 II.1d': () => [String(80 * 8 * 5 * 125)],
  'PCT 20 II.2': () => { const x1 = 425, x2 = x1 + 56, x3 = x2 + 38; return [String(tbc(x1, x2, x3))] },
  'PCT 20 II.3': () => [String(motNghiem(tim(0, 1000, (c) => 3 * (c - 6) === 46 + 62 + c), '20 II.3'))],
  'PCT 21 I.1': () => [String(215 * 123)], 'PCT 21 I.2': () => ['='], 'PCT 21 I.3': () => [String(10 * 5 * 20)], 'PCT 21 I.4': () => [String(2000 + 24)], 'PCT 21 I.5': () => [String((360 / 12) * 5)],
  'PCT 21 I.6': () => [String(45 * (7 - 4))], 'PCT 21 I.7': () => [String((144 / 3 + 12) * 2)], 'PCT 21 I.8': () => [String(Math.floor(630 / (150 / 6))), String(630 % (150 / 6))],
  'PCT 21 I.9': () => [String(((216 / 9) * 8) / 6)], 'PCT 21 I.10': () => [String(200 / (200 / 8 - 5))],
  'PCT 21 II.1a': () => [String(65 * 123 + 14)], 'PCT 21 II.1b': () => [String((2024 - 1998) * 15)], 'PCT 21 II.2': () => [String((110000 / 5) * 4 + 128000 / 4)],
  'PCT 21 II.3': () => [String(motNghiem(tim(1, 225, (k) => 225 % k === 0 && (225 - 15) % k === 0 && 225 / k - (225 - 15) / k === 3).map((k) => 225 / k), '21 II.3'))],
  // ── lô 10B: Phiếu cuối tuần 8–14 ──
  'PCT 8 I.1': () => [String(9 * 100 + 18)], 'PCT 8 I.2': () => { const a = 56 * 100 + 40, b = 50 * 100 + 64 * 10; return [a > b ? '>' : a < b ? '<' : '='] },
  'PCT 8 I.3': () => [String(8 * 10000 + 312)], 'PCT 8 I.4': () => [String(36 * (36 / 3))], 'PCT 8 I.5': () => [String((160 / 4) ** 2)], 'PCT 8 I.6': () => [String((12 * 60 + 15 + 7 * 60 + 45) / 60)],
  'PCT 8 I.7': () => { const d = 108 / 3; return [String(d), String(126 / 2 - d)] }, 'PCT 8 I.8': () => [String(((120 + 80) * 2 * 5) / 1000)],
  'PCT 8 I.9': () => { const r = 168 / 8; return [String((120 / 2 - r) * r)] },
  'PCT 8 II.1a': () => { const m2 = (3 * 1000000 + 25) * 8; return [`${Math.floor(m2 / 1000000)}km^2${m2 % 1000000}m^2`] }, 'PCT 8 II.1b': () => [String((2 * 100 + 96) / 4)],
  'PCT 8 II.3': () => [String((200 * 30 * 30) / 10000)],
  'PCT 9 I.1': () => ['6000000'], 'PCT 9 I.2': () => [String(558 + 893), String(893 + 558 + 893)], 'PCT 9 I.3': () => ['1 kg 212'],
  'PCT 9 I.4': () => [String(1520 + (375 - 5) * 11)], 'PCT 9 I.5': () => [String((432 - 412) * 12)], 'PCT 9 I.6': () => [String((9000 + 9000 - 500) / 100)],
  'PCT 9 I.7': () => [String((2024 - 2) / 3 + 1)], 'PCT 9 I.8': () => { let s = 0, i = 0; for (let k = 100; k >= 4; k -= 4, i++) s += i % 2 === 0 ? k : -k; return [String(s)] },
  'PCT 9 I.9': () => [String(motNghiem(tim(1, 100, (k) => 2 * (k + 1) === 4 * 4), '9 I.9'))], // CN rộng = a, dài = k·a: 2(k+1)a = 4·4a
  'PCT 9 I.10': () => { let n = 0; for (let m = 0; m < 1024; m++) { const d = tim(0, 9, (i) => m & (1 << i)); if (d.length === 8 && d[0] !== 0) n++ } return [String(n)] }, // tăng dần ⇒ mỗi tập 8 chữ số cho đúng 1 số; có 0 thì 0 đứng đầu ⇒ loại
  'PCT 9 II.1': () => [String(100000 - 8 * 8000 - 2 * 15000)], 'PCT 9 II.2a': () => [String((126 + 24) * 34)], 'PCT 9 II.2b': () => [String(35 * 105 - 2024)],
  'PCT 9 II.3': () => [String(tongSoTu('531', 3))],
  'PCT 10 I.1': () => [String(756 / 12)], 'PCT 10 I.2': () => [String(8568 / 204 + 96)], 'PCT 10 I.3': () => [String((2023 - 1) / 3 + 1)], 'PCT 10 I.4': () => [String(2024 - 11 * 2)],
  'PCT 10 I.5': () => [String(tim(1, 100, () => true).reduce((s, k) => s + 2 * k, 0))], 'PCT 10 I.6': () => ['36', '49', '64'],
  'PCT 10 I.7': () => [String(tim(15, 114, () => true).reduce((s, k) => s + k, 0))], 'PCT 10 I.8': () => [String(tim(100, 999, (n) => n % 3 === 0).length)],
  'PCT 10 II.1a': () => [String(280 / 20 + 120 / 20)], 'PCT 10 II.1b': () => [String(432 / (4 * 9))], 'PCT 10 II.1c': () => [String((18 * 25) / 6)], 'PCT 10 II.1d': () => [String((275 - 125) / 25)],
  'PCT 10 II.2a': () => [String(2 * 80)], 'PCT 10 II.2b': () => [String(tim(1, 80, () => true).reduce((s, k) => s + 2 * k, 0))], 'PCT 10 II.2c': () => [String(2024 / 2)],
  'PCT 10 II.3': () => [String(tim(3, 320, () => true).reduce((s, x) => s + String(x).length, 0))],
  'PCT 11 I.1': () => [String(27650 / 5 / 2)], 'PCT 11 I.2': () => [String(6 * 100 + 7 + 53)], 'PCT 11 I.3': () => ['XV'], 'PCT 11 I.4': () => [String(77 - 70)],
  'PCT 11 I.5': () => [String((2022 + 56) / 2), String((2022 - 56) / 2)], 'PCT 11 I.6': () => [String(3000 + 3000 - 200)],
  'PCT 11 I.7': () => { const n = 56 * 10 / 2, d = (n + 82) / 2; return [String(d * (n - d))] }, // tính bằng dm (82 dm không chia hết thành m)
  'PCT 11 I.8': () => [String((2000 / 50 + 1) * 2)], 'PCT 11 I.9': () => [String(((36 + 28) * 2) / 4)], 'PCT 11 I.10': () => [String((1200 / 15 + 1 + 1) / 2)],
  'PCT 11 II.1a': () => [String(2485 / 5 + 1515 / 5)], 'PCT 11 II.1b': () => [String(9372 / 9 - 372 / 9 + 72 / 9 + 1000)], 'PCT 11 II.1c': () => [String(80 * 7 * 125 * 4)], 'PCT 11 II.1d': () => [String((500 * 54) / (5 * 9))],
  'PCT 11 II.2a': () => [String(4 + 29 * 3)], 'PCT 11 II.2b': () => [String(tim(0, 29, () => true).reduce((s, k) => s + 4 + 3 * k, 0))],
  'PCT 11 II.3': () => [String((160 / 2) * 50)],
  'PCT 12 I.1': () => [String((1920 - 1248) / 12)], 'PCT 12 I.2': () => [String(48 * 35)], 'PCT 12 I.3': () => [String(124 * 12 + 180 / 12)], 'PCT 12 I.4': () => [String((12 + 18) * 35)],
  'PCT 12 I.5': () => { const n = 172 / 2, d = (n + 26) / 2; return [String(d * (n - d))] }, 'PCT 12 I.6': () => [String(1679 + 584)],
  'PCT 12 I.7': () => { const t1 = motNghiem(tim(0, 1750, (t) => (t - 65) - (1750 - t + 65) === 20), '12 I.7'); return [String(t1)] },
  'PCT 12 I.8': () => { const tong = 55 - 12, c = (tong + 9) / 2; return [String(c), String(tong - c)] },
  'PCT 12 I.9': () => { const a = motNghiem(tim(0, 420, (a) => 3 * a + 9 === 420), '12 I.9'); return [String(a), String(a + 3), String(a + 6)] },
  'PCT 12 I.10': () => [String((31 - 10 - 3) / 2)],
  'PCT 12 II.1a': () => [String(7642 + 1191 + 1358 + 3809)], 'PCT 12 II.1b': () => [String(6753 + 4201 - 1456 + 1247 + 2456)],
  'PCT 12 II.2': () => { const d = (72 / 2 + 8) / 2; return [String(d * (72 / 2 - d))] },
  'PCT 12 II.3': () => { const ha = motNghiem(tim(0, 165, (h) => h + 12 + 14 === 165 - h + 9), '12 II.3'); return [String(ha), String(165 - ha)] },
  'PCT 13 I.1': () => [String(16528 - 6528 / 204)], 'PCT 13 I.2': () => [String((182 + 24) / 2), String((182 - 24) / 2)], 'PCT 13 I.3': () => [String((13 - 5) / 2)],
  'PCT 13 I.4': () => { const m = (380 / 2 - 12) / 2; return [String(m), String(m + 12)] }, 'PCT 13 I.5': () => { const r = (196 / 2 - 2) / 2; return [String(r * (r + 2))] },
  'PCT 13 I.6': () => { const r = []; for (let a = 1900; a <= 2067; a++) { const b = 3967 - a; if (b <= a) continue; if (tim(a + 1, b - 1, (x) => x % 2 === 0).length === 3) r.push(b) } return [String(motNghiem(r, '13 I.6'))] },
  'PCT 13 I.7': () => [String(tim(1, 2022, () => true).reduce((s, k) => s + ((2022 - k) % 4 < 2 ? k : -k), 0))],
  'PCT 13 I.8': () => { const a = motNghiem(tim(0, 1012, (a) => 2024 - a - a - 1 === 7), '13 I.8'); return [String(a), String(2024 - a)] },
  'PCT 13 I.9': () => { const a = motNghiem(tim(0, 768, (a) => tim(a + 1, 1537 - a - 1, (x) => x % 2 === 1).length === 16), '13 I.9'); return [String(a), String(1537 - a)] },
  'PCT 13 I.10': () => { const r = []; for (let d = 1; d < 40; d++) for (let w = 1; w < d; w++) if (2 * (2 * d + w) === 66 && 2 * (d + 2 * w) === 60 && d - w === 3) r.push(d * w); return [String(motNghiem(r, '13 I.10'))] },
  'PCT 13 II.1a': () => [String(6075 / 45 - 1575 / 45)], 'PCT 13 II.1b': () => [String(12 * 44 * 3 + 4 * 56 * 9)],
  'PCT 13 II.2': () => { const a = motNghiem(tim(1, 1011, (a) => a % 2 === 1 && tim(a + 1, 2024 - a - 1, (x) => x % 2 === 1).length === 12), '13 II.2'); return [String(a), String(2024 - a)] },
  'PCT 13 II.3': () => { const t3 = (724 - 290) / 2, t2 = (724 - t3 - 17) / 2; return [String(t2 + 17), String(t2), String(t3)] },
  'PCT 14 I.4': () => [String((825 * 2) / 3)], 'PCT 14 I.5': () => [String((2025 * 3) / 5)], 'PCT 14 I.7': () => [String(102 * 28 - 45)],
  'PCT 14 I.8': () => { const b = (4977 - 4473) / 8; return [String(4473 / b), String(b)] }, 'PCT 14 I.9': () => [String(24 + 1), String((3549 - 24) / 25)],
  'PCT 14 I.10': () => [String(2028 / (3 + 3))], 'PCT 14 II.1': () => [String(48 * (48 / 3))], 'PCT 14 II.2': () => [String(330 * 15 + 315 * 20)],
  'PCT 14 II.3': () => [String((315 / (32 - 23)) * 23)],
  // ── lô 10A: Phiếu cuối tuần 1–7 — tính / vét cạn từ đề ──
  'PCT 1 I.1': () => [String(6 * 10000 + 5 * 100 + 4 * 10 + 3)], 'PCT 1 I.2': () => [String(80000 - 5000)], 'PCT 1 I.3': () => [String(Math.max(90900, 91090, 89900, 91009) - Math.min(90900, 91090, 89900, 91009))],
  'PCT 1 I.4': () => [String((4 + 1) * 2023)], 'PCT 1 I.5': () => [String(motNghiem(tim(0, 10000, (x) => x - 1024 / 8 === 1895), '1 I.5'))],
  'PCT 1 I.6': () => [String(1235 + 1545 + 720)], 'PCT 1 I.7': () => [String(9 * 1059 + (9 - 4))], 'PCT 1 I.8': () => ['>'], // a8b2 > a7b3 với mọi a, b
  'PCT 1 I.9': () => [String(motNghiem(tim(1000, 9999, (n) => { const [a, b, c, d] = chuSo(n); return khacNhau(n) && b === 2 * a && c === 2 * b && d === c - 3 }), '1 I.9'))],
  'PCT 1 I.10': () => { let d = 0; const r = []; for (let x = 1; x <= 300; x++) { d += chuSo(x).filter((c) => c === 1).length; if (d === 33) r.push(x) } return r.map(String) },
  'PCT 1 II.1a': () => [String(32516 + 75438)], 'PCT 1 II.1b': () => [String(80000 - 45015)], 'PCT 1 II.1c': () => [String(3205 * 6)], 'PCT 1 II.1d': () => [String(6750 / 9)],
  'PCT 1 II.2': () => { const t1 = 11645, t2 = t1 - 542, t3 = 34469 - t1 - t2; return [String(t3 - t1)] },
  'PCT 1 II.3': () => { let s = 1; for (let k = 2023; k >= 3; k -= 2) s += k - (k - 1); return [String(s)] },
  'PCT 2 I.1': () => [String(2024 * 5 - 24 * 5)], 'PCT 2 I.2': () => [String(Math.max(876145, 86745, 86754, 876514))], 'PCT 2 I.3': () => [String(Math.round(38631 / 1000) * 1000)],
  'PCT 2 I.4': () => [String(motNghiem(tim(0, 100000, (y) => 2125 + y * 5 === 90000), '2 I.4'))], 'PCT 2 I.5': () => [String(10001 - 9998)],
  'PCT 2 I.6': () => [String(motNghiem(tim(100000, 999999, (n) => khacNhau(n) && tongCS(n) === 24).slice(-1), '2 I.6'))],
  'PCT 2 I.7': () => [String(tim(1, 99999, (n) => khacNhau(n) && tongCS(n) === 29)[0])],
  'PCT 2 I.8': () => [String(Math.max(...tim(1, 9999999, (n) => khacNhau(n) && tichCS(n) === 48)))],
  'PCT 2 II.1a': () => [String(14526 + 24186)], 'PCT 2 II.1b': () => [String(76123 - 50357)],
  'PCT 2 II.2a': () => [String(tim(1, 99999, (n) => tongCS(n) === 22)[0])], 'PCT 2 II.2b': () => [String(lonNhatKhacNhau((d) => d.reduce((a, b) => a + b) === 18))],
  'PCT 2 II.2c': () => [String(lonNhatKhacNhau((d) => d.reduce((a, b) => a + b) === 38))],
  'PCT 2 II.3': () => tim(1000, 9999, (n) => { const [a, b, c, d] = chuSo(n); return khacNhau(n) && a === b + c + d && b === c + d }).map(String),
  'PCT 3 I.1': () => [String((10685 - 10000 - 85) / 100)], 'PCT 3 I.2': () => [String(Math.max(...tim(100000, 999999, (n) => n % 2 === 1 && khacNhau(n))) - 1)],
  'PCT 3 I.4': () => [String((500 - 408) * 8)], 'PCT 3 I.5': () => { const d1 = 592, d2 = d1 - 35, d3 = d2 - 20; return [String(d1 + d2 + d3)] },
  'PCT 3 I.6': () => [String(demSoTu('1368', 4))], 'PCT 3 I.8': () => [String(tim(100, 999, (n) => khacNhau(n) && n % 10 === 5).length)],
  'PCT 3 I.9': () => [String(tongSoTu('127', 3))], 'PCT 3 I.10': () => [String(tim(1000, 9999, (n) => tongCS(n) === 4).length)],
  'PCT 3 II.1a': () => [String(1235 + 3963 / 3)], 'PCT 3 II.1b': () => [String(motNghiem(tim(0, 10000, (y) => 2086 + y - 1048 === 2755), '3 II.1b'))],
  'PCT 3 II.1c': () => [String(motNghiem(tim(0, 1000, (y) => 4912 - y * 5 === 1727), '3 II.1c'))], 'PCT 3 II.1d': () => [String((905 + 64 * 3 - 192) * 7)],
  'PCT 3 II.2': () => [String(demSoTu('12345', 4, (n) => n < 4000))], 'PCT 3 II.3': () => [String(tim(1, 80, () => true).reduce((s, x) => s + String(x).length, 0))],
  'PCT 4 I.1': () => ['205924'], 'PCT 4 I.2': () => [String(821005 - 800000 - 20000 - 5)],
  'PCT 4 I.4': () => [String(Math.max(...tim(10000, 99999, (n) => chuSo(n).filter((c) => c === 3).length === 1)))],
  'PCT 4 I.5': () => [String([38794, 5831, 108943, 20877, 46800].filter((x) => x > 20000 && x < 90000).length)], 'PCT 4 I.6': () => [String(demSoTu('149', 3))],
  'PCT 4 I.7': () => [String(lonNhatKhacNhau((d) => d.reduce((a, b) => a + b) === 17))], 'PCT 4 I.8': () => [String(tim(1000, 9999, (n) => khacNhau(n) && tongCS(n) === 6).length)],
  'PCT 4 I.9': () => [String(tim(100, 999, (n) => String(n) === [...String(n)].reverse().join('')).length)], 'PCT 4 I.10': () => [String(demSoTu('01479', 4, (n) => n % 2 === 0))],
  'PCT 4 II.1a': () => [String(64 + 1234 * 4)], 'PCT 4 II.1b': () => [String((2701 - 2024) * 5)], 'PCT 4 II.1c': () => [String(509 * 9 - 2700)],
  'PCT 4 II.1d': () => [String(motNghiem(tim(0, 10000, (y) => y * 9 - y * 5 === 2400), '4 II.1d'))],
  'PCT 4 II.2a': () => [String(demSoTu('02369', 4))], 'PCT 4 II.2b': () => [String(demSoTu('02369', 4, (n) => n % 2 === 1))],
  'PCT 4 II.3': () => { let best = 0; for (let a = 1; a <= 9; a++) for (let b = a + 1; b <= 9; b++) if (a + b === 5) for (let c = 1; c <= 9; c++) for (let d = c + 1; d <= 9; d++) if (c + d === 7 && new Set([a, b, c, d]).size === 4) { const con = tim(1, 9, (x) => ![a, b, c, d].includes(x)).sort((x, y) => y - x); best = Math.max(best, Number(con.join(''))) } return [String(best)] },
  'PCT 5 I.1': () => [String(3 * 100 + 105)], 'PCT 5 I.2': () => { const g = { '2 kg 1 hg': 2100, '2 kg 125 g': 2125, '2 kg 12 dag': 2120, '20hg 10g': 2010 }; return [Object.entries(g).sort((x, y) => y[1] - x[1])[0][0]] },
  'PCT 5 I.3': () => { const p = 4 * 60 + 35 + 2 * 60 + 25; return [p % 60 ? `${Math.floor(p / 60)} giờ ${p % 60} phút` : `${p / 60} giờ`] },
  'PCT 5 I.4': () => [705 < 6 * 100 + 145 ? '<' : 705 > 745 ? '>' : '='], 'PCT 5 I.5': () => [String(2 * 500 - (350 + 420 + 144))],
  'PCT 5 I.6': () => { const te = 3 * 10 + 8; return [String(te + te - 12)] },
  'PCT 5 I.7': () => [['thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật', 'thứ Hai', 'thứ Ba', 'thứ Tư'][(31 - 8) % 7]],
  'PCT 5 I.8': () => [String((80 * 60) / (2 * 2))], 'PCT 5 I.9': () => { const r = motNghiem(tim(1, 100, (c) => c * c === 900), '5 I.9'), d = (4 * 34) / 2 - r; return [String(d * r)] },
  'PCT 5 II.1a': () => [String(3 * 1000 + 50)], 'PCT 5 II.1b': () => [String(7 * 1000 + 8 * 10)], 'PCT 5 II.1c': () => [String(3 * 60 + 25)], 'PCT 5 II.1d': () => [String(4 * 1000 + 5 * 100)],
  'PCT 5 II.1e': () => [String(2 * 100 + 95)], 'PCT 5 II.1f': () => [String(Math.floor(320 / 100)), String(320 % 100)], 'PCT 5 II.1g': () => [String(Math.floor(45168 / 100)), String(45168 % 100)],
  'PCT 5 II.1h': () => [String(240 / 60)],
  'PCT 5 II.2': () => { const d = 350 / 2 - 75; return [String(d * 75 * 3)] },
  // PCT 5 II.3: bài cân đĩa (nêu cách làm) — không có hàm, soát tay
  'PCT 6 I.1': () => [String(49 * 103)], 'PCT 6 I.2': () => ['77'], 'PCT 6 I.3': () => [56 * 731 < 40963 ? '<' : 56 * 731 > 40963 ? '>' : '='],
  'PCT 6 I.4': () => [String(432 + 125 * 18)], 'PCT 6 I.5': () => [String(motNghiem(tim(0, 1000, (y) => 1631 + 5 * y === 2801), '6 I.5'))],
  'PCT 6 I.6': () => [String(953 * Math.min(...tim(100, 999, (n) => khacNhau(n) && chuSo(n).every((c) => [0, 2, 5].includes(c)))))],
  'PCT 6 I.7': () => [String(10000 - 7 * 1235)], 'PCT 6 I.8': () => [String(92 * 3 * 12)], 'PCT 6 I.9': () => [String(999 + 124 + 89)], 'PCT 6 I.10': () => [String(tongSoTu('1234', 3))],
  'PCT 6 II.1a': () => [String(277315 + 829350 + 722685)], 'PCT 6 II.1b': () => [String(473125 + 68241 - 73125 + 31759)], 'PCT 6 II.1c': () => [String(2024 * 321 - 2024 * 21)], 'PCT 6 II.1d': () => [String(4048 * 53 - 2024 * 6)],
  'PCT 6 II.2': () => [String(195 * 10 + 120 * 15)], 'PCT 6 II.3': () => [String(motNghiem(tim(0, 100000, (x) => 5 * x + 15 === 175175), '6 II.3'))],
  'PCT 7 I.1': () => ['5972361'], 'PCT 7 I.2': () => [String(Math.min(730256, 730562, 725306, 725630))], 'PCT 7 I.3': () => [40305 < 40350 ? '<' : '>'], 'PCT 7 I.4': () => ['43215'],
  'PCT 7 I.5': () => [String(278 * 26 + 278 - 26)], 'PCT 7 I.6': () => [String(15 * (52 / 2 - 15))], 'PCT 7 I.7': () => [String(4 * motNghiem(tim(1, 100, (c) => c * c === 400), '7 I.7'))],
  'PCT 7 I.8': () => { const c = 28 / 4; return [String((c + 2 + 3 + c) * 2)] }, 'PCT 7 I.9': () => { const d = (56 - 24) / 4, r = 56 / d; return [String((d + r) * 2)] },
  'PCT 7 II.1a': () => { const kg = 2280 + 4890; return [`${Math.floor(kg / 1000)}tấn${kg % 1000}kg`] }, 'PCT 7 II.1b': () => { const ta = 42 + 35 - 54; return [`${Math.floor(ta / 10)}tấn${ta % 10}tạ`] },
  'PCT 7 II.1c': () => { const ta = 34 * 3 + 15; return [`${Math.floor(ta / 10)}tấn${ta % 10}tạ`] }, 'PCT 7 II.1d': () => { const g = 3002 * 5 / 2; return [`${Math.floor(g / 1000)}kg${g % 1000}g`] },
  'PCT 7 II.2': () => { const r = 32 / 4, d = 48 / 2 - r; return [String(d * r)] },
  'PCT 7 II.3': () => { const t = (7050 + 7180 + 7030) / 2; return [String(t - 7180), String(t - 7030), String(t - 7050)] },
  // ── lô 9B: CĐ 22 (tỉ số, tổng–tỉ, hiệu–tỉ), CĐ 23, PTL 6, CĐ 24 (tính ngược, chuyển qua lại) — vét cạn/tính từ đề ──
  'VD 22.1': () => [so(P(32 - 12, 12))], 'VD 22.2': () => { const a = motNghiem(tim(0, 96, (a) => 5 * a === 3 * (96 - a)), '22.2'); return [String(a), String(96 - a)] },
  'VD 22.3': () => { const b = motNghiem(tim(0, 1000, (b) => 5 * (b + 58) === 7 * b), '22.3'); return [String(b + 58), String(b)] },
  'VD 22.4': () => { const c = motNghiem(tim(0, 100, (c) => c + 27 + 3 === 4 * (c + 3)), '22.4'); return [String(c), String(c + 27)] },
  'LT 22.1': () => [so(P(15, 50 - 15))], 'LT 22.2': () => [so(P(12, 12 + 16))], 'LT 22.3': () => [so(P(9 + 5, 9 + 26 + 5))],
  'LT 22.4': () => { const a = motNghiem(tim(0, 215, (a) => 3 * a === 2 * (215 - a)), '22.4'); return [String(a), String(215 - a)] },
  'LT 22.5': () => [String(motNghiem(tim(0, 32, (n) => 5 * n === 3 * (32 - n)), '22.5'))],
  'LT 22.6': () => { const b = motNghiem(tim(0, 2000, (b) => 5 * (b + 136) === 9 * b), '22.6'); return [String(b + 136), String(b)] },
  'LT 22.7': () => { const e = motNghiem(tim(0, 100, (e) => 5 * e === 2 * (e + 6)), '22.7'); return [String(e), String(e + 6)] },
  'LT 22.8': () => { const b = motNghiem(tim(0, 150, (b) => 7 * b === 3 * (150 - b)), '22.8'); return [String(b), String(150 - b)] },
  'LT 22.12': () => { const b = motNghiem(tim(0, 216, (b) => 7 * b === 216 - b), '22.12'); return [String(b), String(216 - b)] },
  'LT 22.13': () => { const c = motNghiem(tim(1, 288, (c) => 5 * c + c === 288), '22.13'); return [String(5 * c), String(c)] },
  'LT 22.15': () => { const a = motNghiem(tim(0, 396, (a) => a + 10 * a === 396), '22.15'); return [String(a), String(10 * a)] },
  'LT 22.16': () => [String(motNghiem(tim(1, 1000, (x) => 10 * x - x === 2115).map((x) => 10 * x), '22.16'))],
  'LT 22.18': () => { const d = motNghiem(tim(1, 60, (d) => 2 * (d + 1) === 3 * (60 - d - 1)), '22.18'); return [String(d), String(60 - d)] },
  'LT 22.20': () => { const nu = motNghiem(tim(0, 100, (x) => 19 * (x + 2) === 15 * (x + 4 + 2)), '22.20'); return [String(nu + 4), String(nu)] },
  'VD 23.1': () => { const n1 = cua(P(1, 3), 180), n2 = cua(P(2, 3), tru(P(180), n1)); return [so(tru(tru(P(180), n1), n2))] },
  'VD 23.2': () => [so(tuPhan(conLai(P(1, 3), P(2, 5)), 320))], 'VD 23.3': () => [so(chia(P(2, 7), P(1, 4)))],
  'LT 23.1': () => [so(chia(P(1, 4), P(3, 8)))], 'LT 23.2': () => [so(chia(P(1, 3), P(2, 5)))], 'LT 23.3': () => [so(P(3, 2))],
  'LT 23.5': () => { const x = motNghiem(tim(0, 140, (x) => 3 * (140 - x) === 4 * x), '23.5'); return [String(140 - x), String(x)] },
  'LT 23.6': () => [so(cua(conLai(P(3, 10), P(1, 4)), 100000))],
  'LT 23.7': () => { const x1 = cua(P(2, 5), 1400), x2 = cua(P(3, 5), tru(P(1400), x1)); return [so(x1), so(x2), so(tru(tru(P(1400), x1), x2))] },
  'LT 23.8': () => { const bb = cua(P(1, 3), 30), cv = cua(P(3, 2), bb); return [so(tru(tru(P(30), bb), cv))] },
  'LT 23.9': () => { const v = cua(P(4, 9), 45), x = cua(P(3, 4), v); return [so(v), so(x), so(tru(tru(P(45), v), x))] },
  'LT 23.11': () => [so(cong(cong(tuPhan(P(2, 5), 4), tuPhan(P(3, 4), 15)), tuPhan(P(1, 5), 1)))],
  'LT 23.12': () => [so(tuPhan(conLai(P(4, 15), P(2, 5)), 55))],
  'LT 23.14': () => [so(tuPhan(cua(conLai(P(1, 4)), conLai(P(3, 7))), 75))], 'LT 23.15': () => [so(tuPhan(cua(conLai(P(3, 5)), conLai(P(1, 4))), 60))],
  'PTL 6.1': () => [so(P(50 - 45, 45))],
  'PTL 6.2': () => { const s = cua(P(2, 5), 160); return [so(cong(s, cua(P(2, 3), tru(P(160), s))))] },
  'PTL 6.3': () => [so(tuPhan(conLai(P(1, 3), P(3, 7)), 150))],
  'PTL 6.4': () => { const h = Math.max(...tim(100, 999, (n) => n % 10 === 0)), b = motNghiem(tim(0, 5000, (b) => 9 * b === 4 * (b + h)), '6.4'); return [String(b), String(b + h)] },
  'PTL 6.5': () => { const r = motNghiem(tim(1, 25, (r) => r + 4 * r === 25), '6.5'); return [String(4 * r * r)] },
  'VD 24.1': () => [String(motNghiem(tim(0, 1000, (x) => (3 * x + 10) === 20 * 5), '24.1'))],
  'VD 24.2': () => [so(tuPhan(cua(conLai(P(2, 5)), conLai(P(1, 3))), 30))],
  'VD 24.3': () => { const r = []; for (let a = 0; a <= 200; a++) for (let b = 0; b <= a; b++) { const A = a - b, B = 2 * b; if (B >= A && B - A === 35 && 2 * A === 30) r.push([a, b]) } const [a, b] = motNghiem(r, '24.3'); return [String(a), String(b)] },
  'LT 24.1': () => [String(motNghiem(tim(0, 1000, (x) => (x + 12) * 8 - 70 === 250), '24.1'))],
  'LT 24.3': () => [so(giaiY('(y+\\frac{6}{7}):\\frac{3}{5}-\\frac{1}{2}', '\\frac{3}{2}'))],
  'LT 24.4': () => { const h = motNghiem(tim(0, 36, (h) => h - 7 + 5 === 36 - h + 7 - 5), '24.4'); return [String(h), String(36 - h)] },
  'LT 24.5': () => [String(25 + 11 - 12), String(25 - 11), String(25 + 12)],
  'LT 24.7': () => { const m = 90 / 3; return [String(m + 5 - 10), String(m - 5 + 7), String(m - 7 + 10)] },
  'LT 24.8': () => { const t1 = motNghiem(tim(0, 90, (t) => 90 - t + 14 - 5 === 2 * (t - 14 + 5)), '24.8'); return [String(t1), String(90 - t1)] },
  'LT 24.9': () => { const h1 = motNghiem(tim(0, 24, (h) => 7 * (h - 5 + 2) === 5 * (24 - h + 5 - 2)), '24.9'); return [String(h1), String(24 - h1)] },
  'LT 24.10': () => { const r = []; for (let t = 0; t <= 40; t++) { const q = 40 - t; if (t < q) continue; const T = t - q, Q = 2 * q; if (2 * T === 20 && Q - T === 20) r.push(t) } const t = motNghiem(r, '24.10'); return [String(t), String(40 - t)] },
  'LT 24.11': () => { const r = []; for (let v = 0; v <= 48; v++) for (let n = 0; n + v <= 48; n++) { let V = v, N = n, M = 48 - v - n; V -= N; N *= 2; N -= M; M *= 2; M -= V; V *= 2; if (V >= 0 && N >= 0 && M >= 0 && V === 16 && N === 16 && M === 16) r.push([v, n]) } const [v, n] = motNghiem(r, '24.11'); return [String(v), String(n), String(48 - v - n)] },
  'LT 24.13': () => { const t = tuPhan(cua(conLai(P(2, 5)), conLai(P(3, 8))), 18); return [so(cua(P(3, 8), t)), so(cua(cua(P(2, 5), conLai(P(3, 8))), t))] },
  'LT 24.14': () => [so(tuPhan(cua(conLai(P(3, 4)), conLai(P(2, 3))), 30000))],
  'LT 24.15': () => [so(tuPhan(cua(conLai(P(2, 3)), conLai(P(2, 5))), 42))],
  'LT 24.17': () => [String(motNghiem(tim(0, 1000, (x) => { if (x % 2) return false; const r = x / 2 + 6; return r % 3 === 0 && r - r / 3 - 4 === 12 }), '24.17'))],
  // ── lô 9A: CĐ 20 (phân số của một số), CĐ 21 (tìm một số biết giá trị phân số của nó) ──
  // VD 20.1, VD 20.2: sách in sẵn phép tính + đáp số trong đề ⇒ không ghi (như VD 10.1/10.2)
  'VD 20.3': () => [so(cua(conLai(P(1, 4), P(1, 3)), 144))],
  'LT 20.1': () => [[P(8, 13), 91], [P(9, 2), 82], [P(1, 4), 488], [P(2, 3), 204], [P(5, 4), P(1, 3)], [P(6, 5), P(5, 7)]].map(([p, x]) => so(cua(p, x))),
  'LT 20.2': () => [so(cua(P(5, 8), 40))], 'LT 20.4': () => [so(cua(conLai(P(3, 5)), 25))], 'LT 20.5': () => [so(cua(conLai(P(2, 3)), 15 * 100))],
  'LT 20.6': () => { const d = P(3, 5), r = cua(P(3, 4), d); return [so(nhan(cong(d, r), P(2))), so(nhan(d, r))] },
  'LT 20.7': () => { const r = P(1, 4), d = cua(P(7, 2), r); return [so(nhan(cong(d, r), P(2))), so(nhan(d, r))] },
  'LT 20.8': () => [so(cua(conLai(P(2, 5)), 25 * 18))], 'LT 20.9': () => [so(cong(P(45000), cua(P(4, 5), 45000)))],
  'LT 20.10': () => [so(cua(conLai(P(2, 7), P(2, 5)), 35))], 'LT 20.11': () => [so(cua(conLai(P(7, 12), P(2, 9)), 36))],
  'LT 20.12': () => [so(chia(cua(conLai(P(3, 4)), 16), P(4, 5)))],
  'LT 20.14': () => { const n1 = P(3, 5); return [so(conLai(n1, cua(P(2, 7), n1)))] },
  'LT 20.15': () => { const ao = P(4, 7); return [so(cong(ao, cua(P(4, 5), conLai(ao))))] },
  'LT 20.16': () => [so(cua(conLai(P(5, 6)), conLai(P(3, 5))))],
  'LT 20.17': () => { const an = cua(P(1, 3), 600000), binh = cua(P(1, 4), 600000); return [so(tru(tru(P(600000), an), binh))] }, // 1/2 phần còn lại ⇒ 1/3 tổng; 1/3 ⇒ 1/4 tổng
  'VD 21.1': () => [so(tuPhan(P(3, 8), 24))], 'VD 21.2': () => [so(tuPhan(conLai(P(1, 5), P(2, 7)), 18))],
  'VD 21.3': () => [so(tuPhan(cua(conLai(P(6, 11)), conLai(P(1, 4))), 60))], 'VD 21.4': () => [so(tuPhan(tru(P(7, 10), P(4, 15)), 39))],
  'LT 21.1a': () => [so(tuPhan(P(5, 5), 45))], 'LT 21.1b': () => [so(tuPhan(P(2, 3), 72))], 'LT 21.1c': () => [so(tuPhan(P(3, 5), 195))],
  'LT 21.1d': () => [so(tuPhan(P(3, 8), 54))], 'LT 21.1e': () => [so(tuPhan(P(2, 7), P(9, 7)))], 'LT 21.1f': () => [so(tuPhan(P(4, 7), P(4, 9)))],
  'LT 21.2': () => { const t = tuPhan(P(3, 5), 24); return [so(tru(t, P(24)))] },
  'LT 21.3': () => { const d = tuPhan(P(3, 5), 18); return [so(nhan(d, P(18)))] },
  'LT 21.4': () => { const t = tuPhan(P(1, 2), 160); return [so(cua(P(3, 8), t)), so(cua(conLai(P(1, 2), P(3, 8)), t))] },
  'LT 21.6': () => [so(tuPhan(conLai(P(3, 5)), 96))], 'LT 21.7': () => [so(tuPhan(conLai(P(2, 3), P(4, 15)), 12))],
  'LT 21.8': () => { const t = tuPhan(conLai(P(1, 3), P(4, 9)), 40); return [so(t), so(cua(P(1, 3), t)), so(cua(P(4, 9), t))] },
  'LT 21.9': () => { const t = tuPhan(conLai(P(1, 4), P(3, 8)), 120000); return [so(t), so(cua(tru(P(3, 8), P(1, 4)), t))] },
  'LT 21.10': () => { const t = tuPhan(conLai(P(3, 8), P(2, 5)), 18); return [so(cua(P(3, 8), t)), so(cua(P(2, 5), t))] },
  'LT 21.11': () => [so(tuPhan(cua(conLai(P(3, 7)), conLai(P(1, 3))), 112))],
  'LT 21.12': () => [so(tuPhan(cua(conLai(P(2, 3)), conLai(P(2, 7))), 35))],
  'LT 21.13': () => { const c1 = conLai(P(4, 11)), t = tuPhan(cua(conLai(P(3, 7)), c1), 1120); return [so(cua(P(4, 11), t)), so(cua(cua(P(3, 7), c1), t)), '1120'] },
  'LT 21.14': () => { const n1 = P(2, 11); return [so(tuPhan(conLai(n1, cua(P(5, 6), n1)), 66))] },
  'LT 21.15': () => { const s = P(5, 21), c = cua(P(3, 5), s), t = tuPhan(conLai(s, c), 78); return [so(cua(s, t)), so(cua(c, t))] },
  'LT 21.17': () => { const iii = conLai(P(4, 15), P(1, 3)); return [so(tuPhan(tru(iii, P(1, 3)), 11))] },
  'LT 21.18': () => { const n1 = P(4, 9), n2 = cua(P(3, 5), conLai(n1)), t = tuPhan(tru(n1, n2), 100); return [so(t), so(cua(n1, t)), so(cua(n2, t))] },
  // ── lô 8B: CĐ 16 (tính chất cơ bản, rút gọn, quy đồng), CĐ 17 (so sánh phân số) ──
  'VD 16.1': () => [[51, 57], [1313, 3939], [123123, 246246]].map(([a, b]) => ps(P(a, b))),
  'VD 16.2': () => quyDong([12, 37], [5, 2]), 'VD 16.3': () => quyDong([3, 4], [5, 6]),
  'LT 16.1a': () => [String(motNghiem(tim(0, 1000, (y) => y * 49 === 56 * 7), '16.1a'))], 'LT 16.1b': () => [String(motNghiem(tim(0, 1000, (y) => y * 35 === 42 * 5), '16.1b'))],
  'LT 16.1c': () => [String(motNghiem(tim(1, 1000, (y) => 4 * 15 === 12 * y), '16.1c'))], 'LT 16.1d': () => [String(motNghiem(tim(0, 1000, (y) => 7 * 18 === 14 * (y + 4)), '16.1d'))],
  'LT 16.2a': () => [String(motNghiem(tim(0, 1000, (y) => y * 8 === 5 * 24), '16.2a'))], 'LT 16.2b': () => [String(motNghiem(tim(3, 1000, (y) => 36 * 11 === 6 * (y - 2)), '16.2b'))],
  'LT 16.2d': () => [String(motNghiem(tim(1, 32, (y) => 32 % y === 0 && 6 * 16 === 12 * (32 / y)), '16.2d'))],
  'LT 16.3a': () => nhomBang([[2, 5], [4, 15], [8, 20], [8, 25], [10, 25], [12, 20]]), 'LT 16.3b': () => nhomBang([[4, 8], [25, 40], [1, 2], [12, 24], [5, 8], [9, 10]]),
  'LT 16.4a': () => [[8, 32], [3, 5], [15, 24], [7, 5], [18, 20], [59, 60]].filter(([a, b]) => toiGianP(a, b)).map(([a, b]) => `${a}/${b}`),
  'LT 16.4b': () => [[12, 15], [8, 20], [9, 14], [25, 70], [14, 18], [19, 15]].filter(([a, b]) => toiGianP(a, b)).map(([a, b]) => `${a}/${b}`),
  'LT 16.4c': () => [[31, 47], [62, 95], [90, 2078], [93, 140], [23, 46]].filter(([a, b]) => toiGianP(a, b)).map(([a, b]) => `${a}/${b}`),
  'LT 16.4d': () => [[7, 48], [17, 120], [24, 168], [56, 8008], [11, 72]].filter(([a, b]) => toiGianP(a, b)).map(([a, b]) => `${a}/${b}`),
  'LT 16.5a': () => [[6, 9], [35, 25], [49, 28], [8, 16]].map(([a, b]) => ps(P(a, b))), 'LT 16.5b': () => [[85, 125], [12, 32], [90, 100], [81, 72]].map(([a, b]) => ps(P(a, b))),
  'LT 16.5c': () => [[45, 27], [25, 50], [12, 21], [24, 56]].map(([a, b]) => ps(P(a, b))), 'LT 16.5d': () => [[22, 121], [196, 28], [26, 169], [22, 187]].map(([a, b]) => ps(P(a, b))),
  'LT 16.6a': () => [ps(P(1212, 3636))], 'LT 16.6b': () => [ps(P(1212, 4848))], 'LT 16.6d': () => [ps(P(123123, 369369))],
  // LT 16.7 A–H: biểu thức độc lập có tên ⇒ tách theo chữ cái (như 19.15)
  'LT 16.7A': () => [ps(tinh('\\frac{2\\times 5\\times 7}{5\\times 7\\times 3}'))], 'LT 16.7B': () => [ps(tinh('\\frac{3\\times 5\\times 7\\times 9}{5\\times 7\\times 3\\times 6}'))],
  'LT 16.7C': () => [ps(tinh('\\frac{12\\times 15\\times 17}{6\\times 34\\times 45}'))], 'LT 16.7D': () => [ps(tinh('\\frac{11\\times 15\\times 24}{8\\times 22\\times 30}'))],
  'LT 16.7E': () => [ps(tinh('\\frac{21\\times 35}{9\\times 7\\times 5\\times 3}'))], 'LT 16.7F': () => [ps(tinh('\\frac{30\\times 5\\times 11\\times 9}{25\\times 9\\times 12\\times 22}'))],
  'LT 16.7G': () => [ps(tinh('\\frac{195195\\times 196}{195\\times 196196}'))], 'LT 16.7H': () => [ps(tinh('\\frac{2023\\times 20242024}{20232023\\times 2024}'))],
  'LT 16.8a': () => quyDong([5, 7], [4, 9]), 'LT 16.8b': () => quyDong([3, 4], [5, 17]), 'LT 16.8c': () => quyDong([11, 8], [7, 24]), 'LT 16.8d': () => quyDong([13, 16], [5, 8]),
  'LT 16.8f': () => quyDong([4, 5], [5, 10], [7, 30]),
  'LT 16.9a': () => [`${4 * 3}/9`, `${3 * 9}/9`], 'LT 16.9b': () => [`${7 * 24}/24`, `${7 * 3}/24`, `${7 * 40}/40`, `${7 * 5}/40`],
  'LT 16.10': () => [`${5 * 63}/63`, `${8 * 7}/63`, `${17 * 3}/63`],
  'LT 16.11': () => tim(1, 9, (a) => a % 2 === 1).map((a) => `${a}/${a * 3}`),
  'LT 16.12': () => tim(1, 19, (a) => toiGianP(a, 20 - a)).map((a) => `${a}/${20 - a}`),
  'LT 16.13': () => tim(1, 10, (a) => 10 % a === 0).map((a) => `${a}/${10 / a}`),
  'LT 16.14': () => tim(1, 100, (k) => 16 * k < 100).map((k) => `${7 * k}/${9 * k}`),
  'LT 16.15': () => { const cs = new Set('12468'), ra = []; for (let t = 1; t < 50; t++) for (let m = t + 1; t + m < 50; m++) { const s = `${t}${m}`; if (m === 2 * t && [...s].every((c) => cs.has(c)) && new Set(s).size === s.length) ra.push(`${t}/${m}`) } return ra },
  'VD 17.1': () => [ss([3, 5], [2, 3])], 'VD 17.2': () => [ss([2, 9], [3, 7])], 'VD 17.3': () => [ss([2025, 2024], [2024, 2023])], 'VD 17.4': () => [ss([2023, 2024], [2024, 2025])], 'VD 17.5': () => [ss([2023, 2026], [2024, 2025])],
  ...(() => { const f = [[5, 6], [7, 17], [9, 4], [8, 12], [34, 21], [35, 35]], t = (p) => f.filter(([a, b]) => p(a - b)).map(([a, b]) => `${a}/${b}`); return { 'LT 17.1a': () => t((d) => d < 0), 'LT 17.1b': () => t((d) => d > 0), 'LT 17.1c': () => t((d) => d === 0) } })(),
  'LT 17.2': () => [[3, 4], [1, 3], [21, 19], [2024, 2024], [27, 5]].map(([a, b]) => `${a}/${b}${a < b ? '<' : a > b ? '>' : '='}1`),
  'LT 17.3': () => tim(1, 9, (a) => a < 10 - a).map((a) => `${a}/${10 - a}`), // tử số 0 không tính (phân số "khác 0" như 16.12)
  'LT 17.4a': () => [xep([[4, 9], [3, 9], [7, 9], [5, 9]])], 'LT 17.4b': () => [xep([[27, 45], [18, 45], [31, 45], [34, 45]])],
  'LT 17.4c': () => [xep([[3, 5], [3, 8], [3, 11], [3, 13]])], 'LT 17.4d': () => [xep([[11, 15], [11, 23], [11, 19], [11, 27]])],
  'LT 17.5a': () => [ss([5, 6], [11, 30])], 'LT 17.5b': () => [ss([7, 8], [5, 9])], 'LT 17.5d': () => [ss([22, 9], [17, 6])],
  'LT 17.6a': () => [ss([2, 7], [4, 9])], 'LT 17.6b': () => [ss([4, 17], [3, 10])], 'LT 17.6c': () => [ss([18, 13], [36, 25])], 'LT 17.6d': () => [ss([6, 11], [8, 15])],
  'LT 17.7a': () => [ss([6, 7], [9, 8])], 'LT 17.7b': () => [ss([5, 17], [28, 21])], 'LT 17.7c': () => [ss([2023, 2024], [12, 11])], 'LT 17.7d': () => [ss([15, 8], [7, 9])],
  'LT 17.8a': () => [ss([10, 21], [9, 23])], 'LT 17.8b': () => [ss([40, 46], [41, 45])], 'LT 17.8c': () => [ss([72, 73], [71, 74])], 'LT 17.8d': () => [ss([203, 2024], [204, 2023])],
  'LT 17.9a': () => [ss([100, 99], [101, 100])], 'LT 17.9d': () => [ss([52, 47], [61, 56])],
  'LT 17.10a': () => [ss([176, 175], [203, 201])], 'LT 17.10b': () => [ss([20, 19], [19, 16])], 'LT 17.10c': () => [ss([249, 217], [27, 11])], 'LT 17.10d': () => [ss([135, 133], [1515, 1313])],
  'LT 17.11a': () => [ss([11, 14], [13, 16])], 'LT 17.11b': () => [ss([103, 107], [91, 95])], 'LT 17.11c': () => [ss([99, 100], [97, 98])], 'LT 17.11d': () => [ss([205, 207], [2023, 2025])],
  'LT 17.12b': () => [ss([23, 24], [57, 59])], 'LT 17.12c': () => [ss([2008, 2010], [2024, 2028])], 'LT 17.12d': () => [ss([1008, 1010], [2023, 2027])],
  'LT 17.13': () => [xep([[4, 5], [5, 6], [6, 7], [7, 8]], true)], 'LT 17.14': () => [xep([[8, 5], [11, 8], [16, 13], [14, 11], [21, 18], [5, 2]])],
  // LT 17.15a–c, 17.16a–b: đề mở (chọn một bộ ví dụ) — không có hàm, soát tay
  'LT 17.16c': () => tim(1, 100, (b) => 3 * 8 > b && 3 * 7 < b).map((b) => `3/${b}`), 'LT 17.16d': () => tim(1, 100, (b) => 4 * 5 > b && 4 * 4 < b).map((b) => `4/${b}`),
  // ── lô 8D: CĐ 19 (nhân chia phân số, dãy phân số), PTL 5 — máy tính biểu thức trên đề ──
  'VD 19.1a': () => [ps(tinh('\\frac{2\\times 3\\times 4}{3\\times 4\\times 5}'))], 'VD 19.1b': () => [ps(tinh('\\frac{8}{9}\\times\\frac{4}{11}+\\frac{8}{9}\\times\\frac{5}{11}+\\frac{8}{9}\\times\\frac{2}{11}'))],
  'VD 19.2': () => { const r = tinh('\\frac{3}{8}:\\frac{7}{8}'); return [ps(nhan(cong(P(7, 8), r), P(2)))] }, // sách in nhầm 45/28 (lấy diện tích làm chiều dài)
  'VD 19.3a': () => [ps(tong(2, 19, (k) => P(1, k * (k + 1))))], 'VD 19.3b': () => [ps(tong(1, 7, (k) => P(1, 2 ** k)))],
  'LT 19.1a': () => [ps(tinh('\\frac{2}{5}\\times\\frac{1}{2}:\\frac{1}{3}'))], 'LT 19.1b': () => [ps(tinh('\\frac{2}{3}\\times\\frac{10}{21}\\times\\frac{3}{2}'))],
  'LT 19.1c': () => [ps(tinh('\\frac{1}{2}\\times\\frac{1}{5}+\\frac{1}{5}'))], 'LT 19.1d': () => [ps(tinh('\\frac{2}{7}:\\frac{2}{3}-\\frac{1}{7}'))],
  'LT 19.1e': () => [ps(tinh('\\frac{2}{9}:\\frac{2}{3}\\times\\frac{1}{2}'))], 'LT 19.1f': () => [ps(tinh('\\frac{21}{5}\\times 12\\times\\frac{5}{21}'))],
  'LT 19.2a': () => [ps(tinh('\\frac{5}{2}\\times\\frac{23}{81}\\times\\frac{2}{5}'))], 'LT 19.2b': () => [ps(tinh('\\frac{5}{17}\\times\\frac{21}{4}\\times\\frac{34}{15}\\times\\frac{1}{7}'))],
  'LT 19.2c': () => [ps(tinh('\\frac{3}{17}\\times\\frac{21}{5}:\\frac{3}{17}:\\frac{1}{5}'))],
  'LT 19.3a': () => [ps(giaiYChia('\\frac{2}{7}:y', '\\frac{14}{5}'))], 'LT 19.3b': () => [ps(giaiY('y\\times\\frac{2}{5}', '\\frac{5}{2}'))],
  'LT 19.3c': () => [ps(giaiY('y:\\frac{5}{4}', '\\frac{44}{5}:\\frac{5}{2}'))], 'LT 19.3d': () => [ps(giaiY('\\frac{16}{27}\\times y:\\frac{2}{9}', '\\frac{10}{27}'))],
  'LT 19.4a': () => [ps(tinh('\\frac{1}{5}\\times\\frac{3}{4}+\\frac{1}{5}\\times\\frac{1}{4}'))], 'LT 19.4c': () => [ps(tinh('\\frac{7}{15}\\times\\frac{5}{9}+\\frac{5}{9}\\times\\frac{7}{15}+\\frac{5}{9}\\times\\frac{1}{15}'))],
  'LT 19.4d': () => [ps(tinh('\\frac{7}{16}\\times\\frac{99}{24}-\\frac{25}{8}\\times\\frac{14}{32}'))],
  'LT 19.5a': () => [ps(giaiY('y\\times\\frac{2}{7}+y\\times\\frac{5}{7}', '\\frac{24}{15}'))], 'LT 19.5b': () => [ps(giaiY('y\\times\\frac{21}{15}-y\\times\\frac{9}{15}', '\\frac{8}{5}+\\frac{2}{3}'))],
  'LT 19.5c': () => [ps(giaiYChia('\\frac{22}{5}:y+\\frac{18}{5}:y', '\\frac{12}{35}\\times\\frac{7}{2}'))], 'LT 19.5d': () => [ps(giaiY('y:\\frac{15}{13}-y:\\frac{15}{12}', '\\frac{2}{3}:\\frac{5}{7}'))],
  'LT 19.6a': () => [ps(tinh('\\frac{18}{13}\\times\\frac{24}{29}-\\frac{1}{13}\\times\\frac{24}{29}-\\frac{4}{13}\\times\\frac{24}{29}'))],
  'LT 19.6c': () => [ps(tinh('\\frac{11}{12}\\times\\frac{9}{19}-\\frac{22}{24}\\times\\frac{6}{19}+\\frac{11}{12}\\times\\frac{16}{19}'))],
  'LT 19.6d': () => [ps(tinh('\\frac{20}{23}\\times\\frac{4}{5}+\\frac{30}{23}\\times\\frac{4}{5}-\\frac{8}{46}\\times\\frac{4}{5}'))],
  'LT 19.7': () => [ps(nhan(P(7, 8), P(4))), ps(nhan(P(7, 8), P(7, 8)))],
  'LT 19.8': () => { const r = P(5, 9), d = nhan(r, P(2)); return [ps(nhan(cong(d, r), P(2))), ps(nhan(d, r))] },
  'LT 19.9': () => [ps(tinh('\\frac{18}{5}:3\\times 2'))],
  'LT 19.10a': () => giuaTN('\\frac{6}{16}:\\frac{3}{16}', '\\frac{20}{21}:\\frac{4}{21}'), 'LT 19.10b': () => giuaTN('\\frac{57}{4}\\times\\frac{32}{24}', '\\frac{100}{21}:\\frac{25}{126}'),
  'LT 19.10c': () => giuaTN('\\frac{8}{21}\\times\\frac{7}{2}', '\\frac{11}{8}\\times 4'), 'LT 19.10d': () => giuaTN('\\frac{2}{3}\\times 6', '1\\times 6'),
  'LT 19.11a': () => [ps(giaiYChia('\\frac{3}{5}:\\frac{7}{9}:\\frac{x}{11}', '\\frac{3}{7}:\\frac{5}{11}:\\frac{10}{9}', 'x'))],
  'LT 19.11b': () => [ps(giaiY('\\frac{x}{13}:\\frac{16}{7}:\\frac{15}{23}', '\\frac{23}{13}:\\frac{15}{7}:\\frac{16}{11}', 'x'))],
  'LT 19.12a': () => [ps(tinh('\\frac{15\\times 14-1}{13\\times 15+14}'))], 'LT 19.12b': () => [ps(tinh('\\frac{2022\\times 2024+1}{2022\\times 2023+2023}'))],
  // câu TÁCH theo chữ cái (đề = "Tính: $X=…$", deTachChu trong lo-tu-soan)
  'LT 18.14A': () => [ps(tong(2, 9, (k) => P(1, k * (k + 1))))], 'LT 18.14C': () => [ps(tong(0, 5, (i) => P(3, (1 + 3 * i) * (4 + 3 * i))))],
  'LT 19.13A': () => [ps(tong(1, 10, (k) => P(1, 2 ** k)))], 'LT 19.13B': () => [ps(tong(0, 6, (k) => P(1, 3 * 2 ** k)))],
  'LT 19.14A': () => [ps(tong(1, 6, (k) => P(1, 3 ** k)))], 'LT 19.14B': () => [ps(tong(1, 5, (k) => P(1, 4 ** k)))], 'LT 19.14C': () => [ps(tong(1, 5, (k) => P(1, 5 ** k)))],
  'LT 19.15A': () => [ps(tong(3, 20, (k) => P(1, k * (k + 1))))], 'LT 19.15B': () => [ps(tong(0, 14, (i) => P(2, (2 * i + 1) * (2 * i + 3))))],
  'LT 19.15C': () => [ps(tong(0, 19, (i) => P(4, (4 * i + 3) * (4 * i + 7))))],
  'LT 19.15F': () => [ps(tong(1, 100, (k) => P((k % 2 ? 1 : -1) * (2 * k + 1), k * (k + 1))))],
  'PTL 5.1a': () => [ps(P(2323, 2424))], 'PTL 5.1b': () => [ps(P(4848, 9696))], 'PTL 5.1c': () => [ps(P(125125, 120120))], 'PTL 5.1d': () => [ps(P(121212, 161616))],
  ...Object.fromEntries([['a', [7, 9], [5, 7]], ['b', [56, 57], [35, 33]], ['c', [12, 67], [6, 43]], ['d', [102, 157], [105, 151]], ['e', [79, 83], [101, 105]], ['f', [421, 418], [258, 255]]]
    .map(([y, a, b]) => [`PTL 5.2${y}`, () => { const s = a[0] * b[1] - b[0] * a[1]; return [`${a[0]}/${a[1]}${s > 0 ? '>' : s < 0 ? '<' : '='}${b[0]}/${b[1]}`] }])),
  // PTL 5.3 (đề mở: 6 phân số giữa 3/8 và 5/8) — không có hàm, soát tay
  'PTL 5.4a': () => [ps(tinh('\\frac{4}{6}+\\frac{7}{13}+\\frac{17}{9}+\\frac{19}{13}+\\frac{1}{9}+\\frac{14}{6}'))], 'PTL 5.4b': () => [ps(tinh('\\frac{7}{9}-\\frac{4}{17}+\\frac{11}{9}+\\frac{21}{17}'))],
  'PTL 5.4c': () => [ps(tinh('\\frac{13}{18}\\times\\frac{13}{17}+\\frac{13}{18}\\times\\frac{21}{17}'))], 'PTL 5.4d': () => [ps(tinh('\\frac{5}{12}:\\frac{15}{16}-\\frac{5}{12}\\times\\frac{1}{15}'))],
  'PTL 5.5a': () => [ps(tinh('\\frac{195}{197}\\times\\frac{190}{193}\\times\\frac{97}{95}\\times\\frac{193}{195}\\times\\frac{197}{194}'))],
  'PTL 5.5c': () => [ps(tong(0, 27, (i) => P(2, (2 * i + 1) * (2 * i + 3))))], 'PTL 5.5d': () => [ps(tong(2, 10, (k) => P(1, k * (k + 1))))],
  // ── lô 8A: CĐ 14 (rút về đơn vị), CĐ 15 (dãy số liệu, khả năng), PTL 4 — máy tính từ số liệu đề ──
  'VD 14.1': () => [String(448 / 8 * 6)], 'VD 14.2': () => [String(2100 / (15 / 5))],
  'LT 14.1': () => [String(981 / 9 * 3)], 'LT 14.2': () => [String(96 / 8 * (8 - 2))], 'LT 14.3': () => [String(594 / 11 * (11 + 3))],
  'LT 14.5': () => [String(240 / 6 * 4 / 5)],
  'LT 14.6': () => { const x = motNghiem(tim(1, 1000, (x) => 9 * x - 6 * x === 222), '14.6'); return [String(9 * x), String(6 * x)] },
  'LT 14.7': () => { const lan = motNghiem(tim(1, 100, (n) => n * (4 + 5) === 72), '14.7'); return [String(4 * lan), String(5 * lan)] },
  'LT 14.8': () => [String(48 / (7 - 1) * (4 - 1))], // số lần cưa = số đoạn − 1
  'LT 14.9': () => [String(294 / (42 / 3))], 'LT 14.10': () => [String(720 / (240 / (4 * 3)))],
  'LT 14.11': () => [String((850 - 694) / (10 / 5))], 'LT 14.12': () => [String((65000 + 26000) / (65000 / 5))],
  'LT 14.14': () => [String(217 / (25 / 5 + 2))], 'LT 14.15': () => [String(40 * 6 / (150 / 5))],
  'LT 14.16': () => [String(motNghiem(tim(1, 1000, (n) => 770 % n === 0 && 770 / n * (n + 3) === 875), '14.16'))],
  'LT 14.17': () => [String(1080 / ((1080 - 990) / 5))],
  'LT 14.18': () => [String(motNghiem(tim(1, 300, (k) => 228 % k === 0 && (228 + 12) % k === 0 && (228 + 12) / k - 228 / k === 2).map((k) => 228 / k), '14.18'))], // số xe không đổi
  'LT 14.19': () => [String(120 / ((120 - 95) / 5))],
  'LT 14.20': () => [String(motNghiem(tim(4, 200, (b) => 10 * (b - 3) === 8 * b), '14.20'))],
  'VD 15.1a': () => [String([40, 43, 45, 48, 44, 45, 39, 40].length)], 'VD 15.1b': () => [String(tbc(40, 43, 45, 48, 44, 45, 39, 40))],
  'VD 15.1c': () => [String(tbc(...[40, 43, 45, 48, 44, 45, 39, 40].sort((a, b) => b - a).slice(0, 3)))],
  'VD 15.3': () => [String(4 * 3 / 2)],
  'LT 15.1a': () => [String([8, 10, 8, 9, 9, 10, 9, 9, 8, 10].length)], 'LT 15.1b': () => [String(tbc(8, 10, 8, 9, 9, 10, 9, 9, 8, 10))],
  'LT 15.2a': () => { const d = [432, 567, 689, 512, 568, 799, 801]; return [['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật'][d.indexOf(Math.max(...d))]] },
  'LT 15.2b': () => [String(tbc(432, 567, 689, 512, 568, 799, 801))],
  'LT 15.3a': () => [String([132, 137, 134, 132, 135, 140, 138, 140].length)], 'LT 15.3b': () => [String(tbc(132, 137, 134, 132, 135, 140, 138, 140))],
  'LT 15.7a': () => [String(7 + 14 + 7)], 'LT 15.7b': () => [String((8 * 7 + 9 * 14 + 10 * 7) / (7 + 14 + 7))],
  'LT 15.11': () => [String(4 * 3 / 2)],
  'LT 15.12a': () => ['đỏ', 'vàng', 'xanh'], 'LT 15.12b': () => ['xanh'],
  // 2 con xúc xắc PHÂN BIỆT (con thứ nhất ra a, con thứ hai ra b) — cách hiểu đã ghi cho CEO
  'LT 15.13a': () => [String(6 * 6)], 'LT 15.13b': () => [String(6)], 'LT 15.13c': () => [String(6 * 6 - 6)],
  'LT 15.15': () => { let best = 0; for (let r = 0; r <= 30; r++) for (let v = 0; v <= 30; v++) for (let x = 0; x <= 30; x++) if (v + x <= 9 && r + v <= 10 && r + x <= 11) best = Math.max(best, r + v + x); return [String(best)] },
  'PTL 4.1': () => [String(tbc(130, 130, 150, 150, 150))],
  'PTL 4.2': () => [String(motNghiem(tim(0, 200, (d) => d === tbc(30, 33, 34, d) + 2), 'PTL 4.2'))],
  'PTL 4.3': () => [String((64000 - 24000) / (64000 / 8))], 'PTL 4.4': () => [String(280 / (25 / 5 + 2))],
  'PTL 4.5': () => { const d = [8, 8, 9, 9, 10, 10, 10, 8, 9, 9], t = tbc(...d); return [String(d.length), String(t), String(d.filter((x) => x < t).length)] },
  // ── lô 8C: CĐ 18 — máy tính biểu thức trên chính đề ──
  'VD 18.1a': () => [ps(tinh('\\frac{2}{3}+\\frac{3}{4}'))], 'VD 18.1b': () => [ps(tinh('\\frac{3}{4}-\\frac{2}{3}'))],
  'VD 18.2a': () => [ps(tinh('\\frac{3}{4}+\\frac{7}{5}-\\frac{3}{10}'))], 'VD 18.2b': () => [ps(tinh('\\frac{14}{3}-(\\frac{10}{3}-\\frac{7}{3})+4'))],
  'LT 18.1': () => ['\\frac{2}{3}+\\frac{11}{12}', '\\frac{9}{4}+\\frac{17}{20}', '\\frac{23}{6}+\\frac{19}{54}', '\\frac{25}{72}+\\frac{5}{8}', '\\frac{43}{6}+\\frac{45}{8}', '\\frac{5}{9}+\\frac{7}{15}', '1+\\frac{2}{3}', '\\frac{3}{5}+1'].map((e) => ps(tinh(e))),
  'LT 18.2': () => ['\\frac{11}{6}-\\frac{5}{12}', '\\frac{39}{100}-\\frac{8}{25}', '\\frac{13}{12}-\\frac{15}{16}', '\\frac{3}{8}-\\frac{5}{18}', '\\frac{7}{6}-\\frac{4}{9}', '\\frac{8}{15}-\\frac{2}{9}', '\\frac{9}{8}-1', '3-\\frac{16}{11}'].map((e) => ps(tinh(e))),
  'LT 18.3a': () => [ps(tinh('\\frac{1}{2}+\\frac{1}{3}+\\frac{1}{6}'))], 'LT 18.3b': () => [ps(tinh('\\frac{4}{7}+\\frac{3}{4}+\\frac{2}{7}'))], 'LT 18.3c': () => [ps(tinh('\\frac{1}{6}+\\frac{5}{24}+\\frac{2}{3}'))], 'LT 18.3d': () => [ps(tinh('\\frac{1}{2}+\\frac{5}{16}-\\frac{1}{4}'))],
  'LT 18.4a': () => [ps(tinh('1-(\\frac{1}{5}+\\frac{1}{2})'))], 'LT 18.4b': () => [ps(tinh('\\frac{2}{3}+\\frac{1}{2}-\\frac{5}{6}'))], 'LT 18.4c': () => [ps(tinh('\\frac{5}{12}+\\frac{5}{6}-\\frac{3}{4}'))], 'LT 18.4d': () => [ps(tinh('\\frac{7}{5}-\\frac{4}{15}-\\frac{2}{3}'))],
  'LT 18.5a': () => [ps(tinh('\\frac{11}{6}+\\frac{5}{8}-\\frac{7}{12}'))], 'LT 18.5b': () => [ps(tinh('\\frac{5}{2}-\\frac{11}{12}+\\frac{9}{14}'))], 'LT 18.5c': () => [ps(tinh('\\frac{7}{6}+\\frac{5}{12}-\\frac{1}{18}-1'))], 'LT 18.5d': () => [ps(tinh('3+\\frac{11}{4}-\\frac{1}{12}-\\frac{3}{16}'))],
  'LT 18.6a': () => [ps(tinh('\\frac{13}{6}+\\frac{5}{8}-(\\frac{7}{6}-\\frac{3}{8})'))], 'LT 18.6b': () => [ps(tinh('(\\frac{3}{5}+\\frac{1}{4})-(\\frac{3}{2}-\\frac{7}{5})'))], 'LT 18.6c': () => [ps(tinh('\\frac{5}{4}-(\\frac{1}{2}+\\frac{3}{8})'))], 'LT 18.6d': () => [ps(tinh('(3-\\frac{5}{3})-(2-\\frac{7}{5})'))],
  'LT 18.7a': () => [ps(giaiY('\\frac{11}{7}-\\frac{5}{7}+y', '\\frac{5}{4}'))], 'LT 18.7b': () => [ps(giaiY('\\frac{19}{20}-y', '\\frac{8}{5}-\\frac{3}{4}'))],
  'LT 18.7c': () => [ps(giaiY('\\frac{9}{5}-y-\\frac{11}{25}', '\\frac{1}{15}'))], 'LT 18.7d': () => [ps(giaiY('\\frac{16}{27}-\\frac{2}{9}+y', '1'))],
  'LT 18.8a': () => [ps(tinh('\\frac{3}{4}+\\frac{2}{5}+\\frac{1}{4}+\\frac{3}{5}'))], 'LT 18.8b': () => [ps(tinh('\\frac{10}{7}+\\frac{4}{9}+\\frac{4}{7}+\\frac{5}{9}'))], 'LT 18.8c': () => [ps(tinh('\\frac{1}{15}+\\frac{5}{18}+\\frac{4}{15}+\\frac{7}{18}'))],
  'LT 18.8d': () => [ps(tinh('\\frac{5}{8}+\\frac{5}{12}-\\frac{1}{8}+\\frac{1}{12}'))], 'LT 18.8e': () => [ps(tinh('\\frac{6}{5}+\\frac{8}{22}+\\frac{4}{5}+\\frac{7}{11}+\\frac{5}{21}+\\frac{32}{42}'))], 'LT 18.8f': () => [ps(tinh('\\frac{75}{100}+\\frac{18}{21}+\\frac{19}{32}+\\frac{1}{4}+\\frac{3}{21}+\\frac{13}{32}'))],
  'LT 18.9a': () => [ps(tinh('\\frac{1515}{1818}+2+\\frac{1212}{3636}+\\frac{2}{3}'))], 'LT 18.9b': () => [ps(tinh('\\frac{124124}{186186}+\\frac{4}{5}+\\frac{1313}{6565}-\\frac{2}{3}'))],
  'LT 18.10a': () => [ps(tinh('\\frac{3}{2}+\\frac{4}{7}-(\\frac{5}{6}+\\frac{4}{7})-\\frac{1}{6}'))], 'LT 18.10b': () => [ps(tinh('\\frac{14}{9}+\\frac{1}{4}+\\frac{12}{16}-\\frac{14}{18}'))],
  'LT 18.10c': () => [ps(tinh('\\frac{25}{100}+\\frac{18}{23}+\\frac{24}{32}-\\frac{3}{4}+\\frac{5}{23}-\\frac{2}{8}'))], 'LT 18.10d': () => [ps(tinh('\\frac{8}{20}+\\frac{6}{9}+\\frac{3}{4}+\\frac{3}{5}+\\frac{1}{3}+\\frac{5}{20}'))],
  'LT 18.11': () => [ps(tinh('\\frac{1}{5}+\\frac{1}{6}'))],
  'LT 18.13': () => [ps(giaiY('y+\\frac{1}{8}+\\frac{1}{6}', '\\frac{1}{2}'))],
  'LT 18.14': () => { let A = P(0), C = P(0); for (let k = 2; k <= 9; k++) A = cong(A, P(1, k * (k + 1))); for (let k = 1; k <= 16; k += 3) C = cong(C, P(3, k * (k + 3))); return [`A=${ps(A)}`, `C=${ps(C)}`] },
  'LT 18.15': () => { let M = P(0); for (let k = 1; k <= 7; k++) M = cong(M, P(1, k * (k + 1))); return [M[0] < M[1] ? 'M<1' : 'M>1', ps(M)] },

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
  // ── phiếu cuối tuần: khớp CÁCH GHI đáp án của bản soạn (số không đổi) + câu GỘP ý (lô 10B–10D) ──
  'PCT 15 I.9': () => tim(0, 99, (ab) => { const a = Math.floor(ab / 10), b = ab % 10, n = 50370 + a * 1000 + b; return khacNhau(n) && n % 15 === 0 }).map((ab) => `a=${Math.floor(ab / 10)},b=${ab % 10}`),
  'PCT 15 II.3': () => tim(0, 99, (ab) => (20370 + Math.floor(ab / 10) * 1000 + (ab % 10)) % 45 === 0).map((ab) => `a=${Math.floor(ab / 10)},b=${ab % 10}`),
  'PCT 26 I.3': () => nhomBang([[8, 12], [20, 8], [14, 21], [12, 16]]).flatMap((g) => g.split('=')),
  'PCT 26 I.9': () => [xep([[3, 2], [7, 8], [6, 5], [3, 4]], true).replace(/>/g, ';')], // thứ tự đúng, ghi cách nhau " ; "
  'PCT 28 I.4': () => [9 * 4 > 3 * 10 ? '>' : '<'],
  'PCT 23 II.1a': () => { const d = { 'thứ hai': 4600, 'thứ ba': 4620, 'thứ tư': 4254, 'thứ năm': 5000, 'thứ sáu': 4376 }; return [Object.entries(d).sort((x, y) => x[1] - y[1]).map(([k]) => k).join(';')] },
  'PCT 10 II.2': () => [String(2 * 80), String(tim(1, 80, () => true).reduce((s, k) => s + 2 * k, 0)), String(2024 / 2)],
  'PCT 11 II.2': () => [String(4 + 29 * 3), String(tim(0, 29, () => true).reduce((s, k) => s + 4 + 3 * k, 0))],
  'PCT 24 II.1': () => [...KIEM['PCT 24 II.1a'](), ...KIEM['PCT 24 II.1b']()],
  'PCT 24 II.3': () => [...KIEM['PCT 24 II.3a'](), ...KIEM['PCT 24 II.3b'](), ...KIEM['PCT 24 II.3c']()],
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
