import { pool, form, luu } from './lib.mjs'
const BS = String.fromCharCode(92), P = pool(), out = []
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const primes = (n) => { const r = []; for (let p = 2; p * p <= n; p++) if (n % p === 0) { r.push(p); while (n % p === 0) n /= p } if (n > 1) r.push(n); return r }
const fac = (n) => { const r = {}; for (let p = 2; p * p <= n; p++) while (n % p === 0) { r[p] = (r[p] || 0) + 1; n /= p } if (n > 1) r[n] = (r[n] || 0) + 1; return r }
const kho = (c) => c.dap_an.trim().replace(/[−–]/g, '-')
const mk = (text, rule, duong_sai) => (text === null ? null : { text: String(text), rule, duong_sai })

// ---------- NDB00404: chia nhóm bằng ƯCLN ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB00404')) {
  const khoS = c.dap_an.trim()
  if (/^a\./.test(khoS)) { // tấm hình chữ nhật cắt hình vuông
    const seg = c.noi_dung.split('$')[1] || ''
    const [L, W] = (seg.match(/\d+/g) || []).map(Number)
    const m = khoS.match(/^a\.\s*([\d; ]+)\s*\n\s*b\.\s*(\d+)(.*)$/s)
    if (!L || !W || !m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề/đáp số' }); continue }
    const g = gcd(L, W), ds = []; for (let d = 1; d <= g; d++) if (g % d === 0) ds.push(d)
    const soMieng = (L / g) * (W / g)
    if (ds.join('; ') !== m[1].trim() || String(soMieng) !== m[2]) { out.push({ ma_cau: c.ma_cau, bo: `máy ${ds.join('; ')} / ${soMieng} ≠ kho ${khoS.replace(/\n/g, '/')}` }); continue }
    const sua = (list, n) => `a. ${list.join('; ')}\nb. ${n}${m[3]}`
    const thieu = ds.filter((_, i) => i !== Math.floor(ds.length / 2))
    let ex = g + 1; while (g % ex === 0 || (L % ex === 0 && W % ex === 0)) ex++
    const them = [...ds, ex].sort((a, b) => a - b)
    const ps = primes(g), g2 = g / ps[0]
    out.push(form(c.ma_cau, khoS, [
      mk(sua(thieu, soMieng), 'R403', 'liệt kê thiếu một ước chung'),
      mk(sua(them, soMieng), 'R404', 'liệt kê thừa một số không phải ước chung'),
      g2 !== g ? mk(sua(ds, (L / g2) * (W / g2)), 'R510', 'chọn cạnh là ước chung chưa lớn nhất nên số miếng cắt ra nhiều hơn') : null,
    ].filter(Boolean)))
    continue
  }
  const nums = (c.noi_dung.match(/\d+/g) || []).map(Number)
  const dk = khoS.match(/\d+/g).map(Number), k = dk.length - 1
  const a0 = nums.slice(-k), g = a0.length ? a0.reduce(gcd) : 0
  const a = dk.slice(1).map((x) => x * g) // thứ tự theo đáp số kho (đề có thể nêu nữ trước, đáp số nam trước)
  if (k < 2 || a0.length !== k || dk[0] !== g || [...a].sort((x, y) => x - y).join() !== [...a0].sort((x, y) => x - y).join()) { out.push({ ma_cau: c.ma_cau, bo: `máy g=${g} ${a0} ≠ kho ${khoS}` }); continue }
  const thay = (g2) => { let i = 0; return khoS.replace(/\d+/g, () => (i++ === 0 ? g2 : a[i - 2] / g2)) }
  const ps = primes(g)
  out.push(form(c.ma_cau, khoS, [
    g / ps[0] !== g ? mk(thay(g / ps[0]), 'R510', 'chọn ước chung chưa lớn nhất (bỏ thừa số nguyên tố nhỏ nhất)') : null,
    ps.length > 1 ? mk(thay(g / ps[ps.length - 1]), 'R511', 'chọn ước chung chưa lớn nhất (bỏ thừa số nguyên tố lớn nhất)') : null,
    mk(thay(1), 'R512', 'chọn ước chung nhỏ nhất là 1'),
  ].filter(Boolean)))
}

// ---------- NDB01622: đếm số ước ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01622')) {
  const seg = (c.noi_dung.split('$')[1] || '').trim()
  let n = 1
  for (const t of seg.split('.')) { const m = t.trim().match(/^(\d+)(?:\^(\d+))?$/); if (!m) { n = 0; break } n *= (+m[1]) ** (+(m[2] || 1)) }
  if (!n) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const f = Object.values(fac(n)), dung = f.reduce((s, e) => s * (e + 1), 1)
  if (String(dung) !== kho(c)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, String(dung), [
    mk(f.reduce((s, e) => s * e, 1), 'R514', 'đếm ước bằng tích các số mũ, quên cộng 1'),
    mk(f.reduce((s, e) => s + e, 0) + 1, 'R515', 'đếm ước bằng tổng các số mũ cộng 1'),
    mk(dung - 2, 'R516', 'bỏ sót cả ước 1 và chính số đó'),
    mk(dung - 1, 'R516', 'bỏ sót ước 1 hoặc chính số đó'),
    mk(dung + 1, 'R05', 'đếm thừa 1 ước'),
  ].filter((x) => x && Number(x.text) > 0)))
}

// ---------- NDB01296: tổng các số nguyên thoả điều kiện ----------
const reTong = new RegExp(`(-?)(\\d+)\\s*(<|${BS}${BS}le)\\s*x\\s*(<|${BS}${BS}le)\\s*(\\d+)`)
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01296')) {
  const m = c.noi_dung.match(reTong)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const lo = (m[1] ? -1 : 1) * +m[2] + (m[3] === '<' ? 1 : 0), hi = +m[5] - (m[4] === '<' ? 1 : 0)
  const xs = []; for (let x = lo; x <= hi; x++) xs.push(x)
  const dung = xs.reduce((s, x) => s + x, 0)
  if (String(dung) !== kho(c)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, String(dung), [
    mk(dung - xs[xs.length - 1], 'R24', 'sót số lớn nhất trong các số nguyên thoả điều kiện'),
    mk(xs.reduce((s, x) => s + Math.abs(x), 0), 'R04', 'cộng các số âm lấy dấu sai (cộng giá trị tuyệt đối)'),
    mk(dung + xs.length, 'R05', 'cộng lệch: thêm số lượng các số hạng vào tổng'),
    mk(-dung, 'R10', 'đổi dấu kết quả'),
    mk(dung - xs[0], 'R52', 'bỏ sót số nhỏ nhất trong các số nguyên thoả điều kiện'),
  ].filter(Boolean)))
}

// ---------- NDB01298: số đối của tổng ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01298' && /^Tìm số đối của tổng/.test(c.noi_dung))) {
  const seg = (c.noi_dung.split('$')[1] || '').replace(/\s/g, '')
  const m = seg.match(/^\(?(-?\d+)\)?\+\(?(-?\d+)\)?$/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = +m[1], b = +m[2], dung = -(a + b)
  if (String(dung) !== kho(c)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, String(dung), [
    mk(a + b, 'R04', 'tìm tổng mà không lấy số đối (sai dấu)'),
    mk(-(a - b), 'R52', 'nhầm phép cộng thành phép trừ rồi lấy số đối'),
    mk(-b, 'R24', 'sót hạng tử thứ nhất của tổng'),
    mk(-a, 'R24', 'sót hạng tử thứ hai của tổng'),
  ].filter((x) => x)))
}
luu('k6_b1_uoc_tong', out)
