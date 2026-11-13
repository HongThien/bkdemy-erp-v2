import { pool, form, luu } from './lib.mjs'
const P = pool(), out = []
const uoc = (n) => { const r = []; for (let d = 1; d <= n; d++) if (n % d === 0) r.push(d); return r }
const mk = (v, rule, duong_sai) => (v === null ? null : { text: v, rule, duong_sai })
const norm = (s) => s.replace(/\s/g, '')
// ---- NDB00368: tìm 5 bội của n ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB00368')) {
  const m = c.noi_dung.match(/Tìm (\d+) bội của (\d+)/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const k = +m[1], n = +m[2], bs = Array.from({ length: k }, (_, i) => i * n)
  const dung = bs.join('; ')
  if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, dung, [
    mk(Array.from({ length: k }, (_, i) => (i + 1) * n).join('; '), 'R79', 'quên số 0, bắt đầu liệt kê từ chính n'),
    mk(bs.slice(0, -1).join('; '), 'R75', 'liệt kê thiếu phần tử lớn nhất'),
    mk([...bs.slice(0, -1), bs[bs.length - 1] + 1].join('; '), 'R76', 'lẫn nhầm một số liền kề không phải bội'),
    mk(uoc(n).slice(0, k).join('; '), 'R73', 'nhầm bội thành ước'),
  ].filter(Boolean)))
}
// ---- NDB00379/380/381: tìm x để (ax+b) chia hết cho (x-k) ----
for (const c of P.filter((c) => ['NDB00379', 'NDB00380', 'NDB00381'].includes(c.ma_dang_bai) && /chia hết cho/.test(c.noi_dung))) {
  const segs = c.noi_dung.split('$')
  const A = (segs[3] || '').replace(/\s/g, ''), B = (segs[5] || '').replace(/\s/g, '')
  const mb = B.match(/^x-(\d+)$/), ma = A.match(/^(?:(\d*)x)?\+?(\d+)$/)
  if (!mb || !ma) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const k = +mb[1], a = A.includes('x') ? +(ma[1] || 1) : 0, b = +ma[2]
  const N = a * k + b, ds = uoc(N), xs = ds.map((d) => d + k)
  const dung = xs.join(';')
  if (dung !== norm(c.dap_an)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, dung, [
    mk(ds.join(';'), 'R517', 'liệt kê các ước của số bị chia mà quên cộng k'),
    mk(ds.map((d) => d - k).filter((x) => x >= 0).join(';'), 'R518', 'chuyển vế sai dấu: trừ k thay vì cộng k'),
    mk(xs.slice(0, -1).join(';'), 'R75', 'liệt kê thiếu phần tử lớn nhất'),
    mk([...xs, xs[xs.length - 1] + 1].join(';'), 'R76', 'lẫn nhầm một số liền kề không thoả mãn'),
  ].filter((x) => x && x.text !== '')))
}
// ---- NDB00405 / T106040104: n là ước chung, n < C ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB00405')) {
  const m = c.noi_dung.match(/\$(\d+) \\vdots n\$ và \$(\d+) \\vdots n\$ và \$n<(\d+)\$/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [a, b, C] = m.slice(1).map(Number), g = (function f(x, y) { return y ? f(y, x % y) : x })(a, b)
  const uc = uoc(g).filter((d) => d < C), dung = uc.join(';')
  if (dung !== norm(c.dap_an)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, dung, [
    mk(uc.slice(0, -1).join(';'), 'R68', 'bỏ sót phần tử lớn nhất trong danh sách'),
    mk(String(uc[uc.length - 1]), 'R72', 'nhầm sang tìm một số duy nhất (lớn nhất) thay vì liệt kê cả tập'),
    mk('1', 'R71', 'lấy nhầm ước chung nhỏ nhất (luôn bằng 1)'),
    mk(uoc(g).join(';') !== dung ? uoc(g).join(';') : null, 'R69', 'quên điều kiện n < C, liệt kê mọi ước chung'),
  ].filter(Boolean)))
}
luu('k6_b4_boi_x', out)
