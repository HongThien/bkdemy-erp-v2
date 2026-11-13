import { pool, form, luu } from './lib.mjs'
// phân số (a/b) dạng [tử, mẫu] — dùng BigInt-free với nhân chéo
const MASS = { 'tấn': 1000, 'tạ': 100, 'yến': 10, 'kg': 1 }, MASS_SAI = { 'tấn': 100, 'tạ': 10, 'yến': 100, 'kg': 1 }
const TIME = { 'ngày': 1440, 'giờ': 60, 'phút': 1 }, TIME_SAI = { 'ngày': 24 * 100, 'giờ': 100, 'phút': 1 }
const parseSide = (s) => { // "\dfrac{5}{8} tấn 75 tạ" -> [{tu,mau,u}]
  const out = []; const re = /(?:\$?\dfrac\{(\d+)\}\{(\d+)\}\$?|(\d+(?:\s\d{3})*))\s*(tấn|tạ|yến|kg|ngày|giờ|phút)/g; let m
  while ((m = re.exec(s))) out.push(m[1] ? { tu: +m[1], mau: +m[2], u: m[4] } : { tu: +m[3].replace(/\s/g, ''), mau: 1, u: m[4] })
  return out
}
const val = (terms, mass, time) => { // trả [tử, mẫu]
  let tu = 0, mau = 1
  for (const t of terms) { const f = (MASS[t.u] !== undefined ? mass : time)[t.u]; tu = tu * t.mau + t.tu * f * mau; mau = mau * t.mau }
  return [tu, mau]
}
const dau = (l, r) => { const x = l[0] * r[1], y = r[0] * l[1]; return x < y ? '<' : x > y ? '>' : '=' }
const out = []
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02139')) {
  const body = c.noi_dung.replace(/^[^\n]*thích hợp vào chỗ trống\.?\s*/, '')
  const lines = body.split('\n').map((s) => s.trim().replace(/^[a-c]\)\s*/, '')).filter(Boolean)
  const kho = [...c.dap_an.matchAll(/([a-c])\)\s*([<>=])/g)].map((m) => m[2])
  if (lines.length !== kho.length) { out.push({ ma_cau: c.ma_cau, bo: 'số dòng ≠ số ý đáp số' }); continue }
  const rows = lines.map((ln) => { const [L, R] = ln.split(/\.{3,}/).map((x) => x.replace(/\.$/, '')); return [parseSide(L || ''), parseSide(R || '')] })
  if (rows.some(([l, r]) => !l.length || !r.length)) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const tinh = (mass, time) => rows.map(([l, r]) => dau(val(l, mass, time), val(r, mass, time)))
  const dung = tinh(MASS, TIME)
  if (dung.join('') !== kho.join('')) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung.join('')} ≠ kho ${kho.join('')}` }); continue }
  const ghep = rows.map(([l, r]) => (l.concat(r).some((t) => t.mau !== 1) ? null : dau([+l.map((t) => t.tu).join(''), 1], [+r.map((t) => t.tu).join(''), 1])))
  const ghepKq = rows.map((_, i) => ghep[i] ?? dung[i])
  let k = 0; const fmt = (a) => { k = 0; return c.dap_an.replace(/([<>=])/g, () => a[k++]) }
  const sai387 = tinh(MASS_SAI, TIME), sai386 = tinh(MASS, TIME_SAI)
  out.push(form(c.ma_cau, c.dap_an, [
    { text: fmt(sai387), rule: 'R387', duong_sai: 'nhầm hệ số tấn–tạ–yến–kg khi đổi (1 tạ = 10 kg, 1 tấn = 100 kg, 1 yến = 100 kg)' },
    { text: fmt(sai386), rule: 'R386', duong_sai: 'đổi giờ, ngày với hệ số 100 thay vì 60 và 24' },
    { text: fmt(ghepKq), rule: 'R385', duong_sai: 'ghép liền các số thay vì đổi từng phần rồi cộng' },
  ]))
}
luu('k5_b3_sosanh', out)
