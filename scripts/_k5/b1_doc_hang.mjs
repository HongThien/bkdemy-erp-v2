import { pool, form, luu } from './lib.mjs'
// ---------- đọc số tiếng Việt (quy ước kho: "không trăm", "linh") ----------
const CS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
function doc3(n, dau) { // n 1..999; dau = lớp đầu (không đọc "không trăm")
  const t = Math.floor(n / 100), c = Math.floor(n / 10) % 10, d = n % 10, o = []
  if (t > 0) o.push(CS[t] + ' trăm'); else if (!dau) o.push('không trăm')
  if (c > 1) o.push(CS[c] + ' mươi'); else if (c === 1) o.push('mười'); else if (d > 0 && !(dau && t === 0)) o.push('linh')
  if (d > 0) o.push(c > 1 && d === 1 ? 'mốt' : (c >= 1 && d === 5 ? 'lăm' : CS[d]))
  return o.join(' ')
}
const LOP = ['', ' nghìn', ' triệu', ' tỷ']
export function docSo(n) {
  if (n === 0) return 'không'
  const g = []; let x = n; while (x > 0) { g.push(x % 1000); x = Math.floor(x / 1000) }
  const o = []
  for (let i = g.length - 1; i >= 0; i--) if (g[i] > 0) o.push(doc3(g[i], i === g.length - 1) + LOP[i])
  return o.join(' ')
}
const chuanVan = (s) => s.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim()
const VI = { 'trăm triệu': 1e8, 'chục triệu': 1e7, 'triệu': 1e6, 'trăm nghìn': 1e5, 'chục nghìn': 1e4, 'nghìn': 1e3, 'trăm': 100, 'chục': 10, 'đơn vị': 1 }
const out = []
// ---------- NDB02071 ----------
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02071')) {
  const re = /(\d+) (trăm triệu|chục triệu|triệu|trăm nghìn|chục nghìn|nghìn|trăm|chục|đơn vị)/g
  const sau = c.noi_dung.split('gồm:')[1] || ''; let m, n = 0, k = 0
  while ((m = re.exec(sau))) { n += +m[1] * VI[m[2]]; k++ }
  const [so, van] = c.dap_an.split(';').map((s) => s.trim())
  if (!k || String(n) !== so.replace(/\s/g, '') || chuanVan(docSo(n)) !== chuanVan(van)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${n} / "${docSo(n)}" ≠ kho "${c.dap_an}"` }); continue }
  const fmt = (v, w) => `${v}; ${w}`
  const s = String(n)
  // R391: dồn/nhảy chữ số 0 sang hàng bên cạnh (đổi chỗ một chữ số 0 với chữ số khác 0 kề nó)
  let n1 = null
  for (let i = 0; i < s.length - 1 && n1 === null; i++) if (s[i] === '0' && s[i + 1] !== '0' ) { n1 = +(s.slice(0, i) + s[i + 1] + '0' + s.slice(i + 2)) }
  for (let i = s.length - 1; i > 0 && n1 === null; i--) if (s[i] === '0' && s[i - 1] !== '0') { n1 = +(s.slice(0, i - 1) + '0' + s[i - 1] + s.slice(i + 1)) }
  // R390: bỏ lớp giữa (thiếu 1 nhóm 3 chữ số) — số có ≥3 nhóm; nếu không thì thừa một nhóm 000
  const gs = []; let x = s; while (x.length) { gs.unshift(x.slice(-3)); x = x.slice(0, -3) }
  const n2 = gs.length >= 3 ? +(gs[0] + gs.slice(2).join('')) : +(s + '000')
  // R389: giữ đúng số, đọc sai chữ 0
  let w3 = van.replace(/ linh/, '')
  if (w3 === van) w3 = van.replace(/ không trăm/, '')
  const ds = [
    n1 !== null && { text: fmt(n1, docSo(n1)), rule: 'R391', duong_sai: 'viết đúng các chữ số khác 0 nhưng đặt chữ số 0 sai hàng' },
    { text: fmt(n2, docSo(n2)), rule: 'R390', duong_sai: gs.length >= 3 ? 'bỏ sót một lớp (nhóm 3 chữ số) khi viết số' : 'viết thừa một nhóm 000' },
    w3 !== van && { text: fmt(n, w3.replace(/^./, (ch) => ch)), rule: 'R389', duong_sai: 'đọc sai chữ số 0 (thiếu "linh" hoặc "không trăm")' },
  ]
  out.push(form(c.ma_cau, fmt(n, van.replace(/\.$/, '')), ds))
}
// ---------- NDB02072 ----------
const HANG = ['đơn vị', 'chục', 'trăm', 'nghìn', 'chục nghìn', 'trăm nghìn', 'triệu', 'chục triệu', 'trăm triệu']
const lopCua = (h) => ['đơn vị', 'nghìn', 'triệu'][Math.floor(h / 3)]
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02072')) {
  const m = c.noi_dung.match(/Trong số ([\d ]+), chữ số (\d)/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const so = m[1].replace(/\s/g, ''), ch = m[2]
  if (so.split(ch).length !== 2) { out.push({ ma_cau: c.ma_cau, bo: 'chữ số xuất hiện nhiều lần — mơ hồ' }); continue }
  const h = so.length - 1 - so.indexOf(ch)
  const dung = `${HANG[h]}, ${lopCua(h)}`
  if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy "${dung}" ≠ kho "${c.dap_an}"` }); continue }
  const hk = h + 1 <= 8 ? h + 1 : h - 1
  const lopK = ['đơn vị', 'nghìn', 'triệu'], li = Math.floor(h / 3), lk = li < 2 ? li + 1 : li - 1
  const ds = [
    HANG[h] !== lopCua(h) && { text: `${lopCua(h)}, ${HANG[h]}`, rule: 'R392', duong_sai: 'trả lời tên lớp ở chỗ hàng và ngược lại' },
    { text: `${HANG[hk]}, ${lopCua(hk)}`, rule: 'R393', duong_sai: 'chữ số đúng nhưng hàng lệch sang hàng liền kề' },
    { text: `${HANG[h]}, ${lopK[lk]}`, rule: 'R423', duong_sai: 'gọi đúng hàng nhưng nói sai lớp chứa hàng đó' },
  ]
  out.push(form(c.ma_cau, dung, ds))
}
luu('k5_b1_docso_hang', out)
