// me4-kiem-cd01.mjs — máy kiểm đáp số CĐ1 "Viết số theo điều kiện cho trước" (ME4). Mọi hàm tính TỪ ĐỀ bằng vét cạn / tham lam có kiểm chéo; không chép lời giải sách.

// ---------- công cụ chung ----------
const cacHoanVi = (mang) => {
  if (mang.length <= 1) return [mang.slice()]
  const ra = []
  mang.forEach((x, i) => {
    const con = mang.slice(0, i).concat(mang.slice(i + 1))
    for (const p of cacHoanVi(con)) ra.push([x, ...p])
  })
  return ra
}
const cacTapCon = (mang) => {
  const ra = []
  for (let m = 0; m < 1 << mang.length; m++) ra.push(mang.filter((_, i) => m >> i & 1))
  return ra
}
const gtri = (cs) => BigInt(cs.join(''))
const tong = (cs) => cs.reduce((a, b) => a + b, 0)
const tich = (cs) => cs.reduce((a, b) => a * b, 1)

/** Số có n chữ số KHÁC NHAU, lớn nhất / nhỏ nhất (chan/le tuỳ chọn, dau = chữ số đầu cho trước): vét cạn theo thứ tự chữ số (DFS). */
function soKhacNhau(n, { chan = false, le = false, dau = null, lon = true } = {}) {
  const thuTu = lon ? [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const dung = new Set()
  const cs = []
  function dfs() {
    if (cs.length === n) {
      const cuoi = cs[n - 1]
      return !((chan && cuoi % 2) || (le && cuoi % 2 === 0))
    }
    for (const d of thuTu) {
      if (dung.has(d)) continue
      if (cs.length === 0 && (d === 0 || (dau !== null && d !== dau))) continue
      dung.add(d); cs.push(d)
      if (dfs()) return true
      dung.delete(d); cs.pop()
    }
    return false
  }
  if (!dfs()) throw new Error('không có số thoả mãn')
  return cs.join('')
}

/** Mọi số (BigInt) tạo bởi một dãy con có đúng `giu` chữ số của chuỗi s (giữ nguyên thứ tự). Vét cạn, dùng cho chuỗi ngắn. */
function moiSoXoaBot(s, giu) {
  const n = s.length, ra = []
  const chon = []
  const dfs = (i) => {
    if (chon.length === giu) { ra.push(chon.map((j) => s[j]).join('')); return }
    if (i === n || chon.length + (n - i) < giu) return
    chon.push(i); dfs(i + 1); chon.pop(); dfs(i + 1)
  }
  dfs(0)
  return ra
}
const lonNhat = (ds) => ds.reduce((m, x) => (BigInt(x) > BigInt(m) ? x : m)).replace(/^0+(?=\d)/, '')
const beNhat = (ds) => ds.reduce((m, x) => (BigInt(x) < BigInt(m) ? x : m)).replace(/^0+(?=\d)/, '')

/** Tham lam (ngăn xếp) cho chuỗi dài: giữ đúng `giu` chữ số để dãy lớn nhất / nhỏ nhất theo thứ tự từ điển (cùng độ dài). */
function thamLam(s, giu, lon) {
  let can = s.length - giu
  const st = []
  for (const c of s) {
    while (can > 0 && st.length && (lon ? st[st.length - 1] < c : st[st.length - 1] > c)) { st.pop(); can-- }
    st.push(c)
  }
  return st.slice(0, giu).join('')
}

// các số tạo bởi tập chữ số khác nhau thoả điều kiện — dùng cho B4, B5, B6
function cacSoKhacNhauTheoTapCon(loc, { chan = false } = {}) {
  const ra = []
  for (const tap of cacTapCon([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (!tap.length || !loc(tap)) continue
    for (const p of cacHoanVi(tap)) {
      if (p[0] === 0 && p.length > 1) continue
      if (chan && p[p.length - 1] % 2) continue
      ra.push(p.join(''))
    }
  }
  return ra
}
// số nhỏ nhất / lớn nhất có tổng chữ số = S (chữ số được lặp); lớn nhất khi mọi chữ số khác 0
function nhoNhatTheoTong(S) {
  for (let L = 1; L <= S; L++) {
    if (S > 9 * L) continue
    let con = S; let kq = ''
    for (let i = 0; i < L; i++) {
      for (let d = i === 0 ? 1 : 0; d <= 9; d++) { if (con - d >= 0 && con - d <= 9 * (L - 1 - i)) { kq += d; con -= d; break } }
    }
    return kq
  }
}
function lonNhatTongKhac0(S) {
  for (let L = S; L >= 1; L--) {
    let con = S; let kq = ''
    for (let i = 0; i < L; i++) {
      for (let d = 9; d >= 1; d--) { if (con - d >= L - 1 - i && con - d <= 9 * (L - 1 - i)) { kq += d; con -= d; break } }
    }
    if (kq.length === L && con === 0) return kq
  }
}

export const KIEM_CD01 = {
  'CĐ1 · B1a': () => [soKhacNhau(3, { le: true, lon: false })],
  'CĐ1 · B1b': () => [soKhacNhau(4)],
  'CĐ1 · B1c': () => [soKhacNhau(7, { le: true, lon: false })],
  'CĐ1 · B1d': () => [soKhacNhau(10, { chan: true, lon: false })],
  'CĐ1 · B2a': () => [soKhacNhau(8)],
  'CĐ1 · B2b': () => [soKhacNhau(6, { le: true })],
  'CĐ1 · B2c': () => [soKhacNhau(5, { chan: true, lon: false })],
  'CĐ1 · B2d': () => [soKhacNhau(7, { dau: 8, lon: false })],
  'CĐ1 · B3a': () => {
    // mỗi chữ số lớn hơn chữ số liền sau đúng 2 đơn vị: mọi dãy giảm đều 2
    let tot = 0n
    for (let d = 1; d <= 9; d++) { const cs = []; for (let x = d; x >= 0; x -= 2) cs.push(x); for (let k = 1; k <= cs.length; k++) if (gtri(cs.slice(0, k)) > tot) tot = gtri(cs.slice(0, k)) }
    return [String(tot)]
  },
  'CĐ1 · B3b': () => {
    // cách đọc 1: hai chữ số đầu là 1;1. cách đọc 2: số có đúng hai chữ số 1. Hai cách phải cho cùng một số.
    const moi = []
    for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) {
      const cs = [a, b]
      for (;;) { moi.push(cs.slice()); const s = cs[cs.length - 1] + cs[cs.length - 2]; if (s > 9) break; cs.push(s) }
    }
    const hon3 = moi.filter((cs) => cs.length >= 3)
    const c1 = hon3.filter((cs) => cs[0] === 1 && cs[1] === 1).map(gtri)
    const c2 = hon3.filter((cs) => cs.filter((x) => x === 1).length === 2).map(gtri)
    const m1 = c1.reduce((m, x) => (x > m ? x : m)), m2 = c2.reduce((m, x) => (x > m ? x : m))
    if (m1 !== m2) throw new Error(`hai cách đọc cho hai số khác nhau: ${m1} / ${m2}`)
    return [String(m1)]
  },
  'CĐ1 · B4a': () => {
    const ds = cacSoKhacNhauTheoTapCon((t) => tong(t) === 35)
    return [lonNhat(ds), beNhat(ds)]
  },
  'CĐ1 · B4b': () => [nhoNhatTheoTong(52)],
  'CĐ1 · B4c': () => [lonNhatTongKhac0(7)],
  'CĐ1 · B4d': () => {
    const ds = cacSoKhacNhauTheoTapCon((t) => tong(t) === 34)
    return [lonNhat(ds), beNhat(ds)]
  },
  'CĐ1 · B5a': () => {
    // vét cạn mọi số tới 7 chữ số (tích 120 không thể có nhiều chữ số hơn mà nhỏ hơn)
    for (let n = 1; n < 10000000; n++) { const s = String(n); if (tich([...s].map(Number)) === 120) return [s] }
  },
  'CĐ1 · B5b': () => {
    const ds = cacSoKhacNhauTheoTapCon((t) => !t.includes(0) && tich(t) === 120)
    return [lonNhat(ds)]
  },
  'CĐ1 · B6a': () => {
    const ds = cacSoKhacNhauTheoTapCon((t) => !t.includes(0) && tich(t) === 40)
    return [lonNhat(ds), beNhat(ds)]
  },
  'CĐ1 · B6b': () => {
    const ds = cacSoKhacNhauTheoTapCon((t) => !t.includes(0) && tich(t) === 60, { chan: true })
    return [lonNhat(ds), beNhat(ds)]
  },
  'CĐ1 · B6c': () => {
    const ds = cacSoKhacNhauTheoTapCon((t) => !t.includes(0) && tich(t) === 720)
    return [beNhat(ds)]
  },
  'CĐ1 · B7a': () => { const ds = moiSoXoaBot('121416182022', 6); return [lonNhat(ds)] },
  'CĐ1 · B7b': () => { const ds = moiSoXoaBot('121416182022', 6); return [beNhat(ds)] },
  'CĐ1 · B8a': () => { const s = Array.from({ length: 15 }, (_, i) => i + 1).join(''); const ds = moiSoXoaBot(s, s.length - 8); return [lonNhat(ds)] },
  'CĐ1 · B8b': () => { const s = Array.from({ length: 15 }, (_, i) => i + 1).join(''); const ds = moiSoXoaBot(s, s.length - 8); return [beNhat(ds)] },
  'CĐ1 · B9a': () => { const s = Array.from({ length: 10 }, (_, i) => 20 - i).join(''); return [lonNhat(moiSoXoaBot(s, 8))] },
  'CĐ1 · B9b': () => { const s = Array.from({ length: 10 }, (_, i) => 20 - i).join(''); return [beNhat(moiSoXoaBot(s, 8))] },
  'CĐ1 · B9c': () => { const s = Array.from({ length: 10 }, (_, i) => 20 - i).join(''); return [lonNhat(moiSoXoaBot(s, 8).filter((x) => Number(x[7]) % 2 === 0))] },
  'CĐ1 · B9d': () => { const s = Array.from({ length: 10 }, (_, i) => 20 - i).join(''); return [beNhat(moiSoXoaBot(s, 8).filter((x) => Number(x[7]) % 2 === 1))] },
  'CĐ1 · B10a': () => [String(Array.from({ length: 16 }, (_, i) => 2000 + i).join('').length)],
  'CĐ1 · B10b': () => {
    const s = Array.from({ length: 16 }, (_, i) => 2000 + i).join('')
    const be = thamLam(s, s.length - 20, false), lon = thamLam(s, s.length - 20, true)
    // kiểm chéo tham lam với vét cạn trên một chuỗi ngắn cùng kiểu (2000..2005, xoá 8) để chắc hàm tham lam đúng
    const ngan = Array.from({ length: 6 }, (_, i) => 2000 + i).join('')
    const dsn = moiSoXoaBot(ngan, ngan.length - 8)
    if (BigInt(thamLam(ngan, ngan.length - 8, true)) !== BigInt(lonNhat(dsn)) || BigInt(thamLam(ngan, ngan.length - 8, false)) !== BigInt(beNhat(dsn))) throw new Error('tham lam lệch vét cạn')
    return [be.replace(/^0+(?=\d)/, ''), lon]
  },
}
