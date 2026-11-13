import { pool, form, luu } from './lib.mjs'
import { docSo, chuanVan } from './doc.mjs'
const P = pool(), out = []
const vi = (x) => String(x).replace('.', ',') // số → chuỗi VN
// số thập phân dưới dạng {s:chuỗi VN} làm việc bằng số nguyên × 10^k
const dec = (s) => { const [i, f = ''] = s.split(','); return { v: BigInt(i + f), k: f.length } }
const toS = (v, k) => { let s = (v < 0n ? -v : v).toString().padStart(k + 1, '0'); return (v < 0n ? '-' : '') + (k ? s.slice(0, -k) + ',' + s.slice(-k) : s) }
const align = (a, b) => { const k = Math.max(a.k, b.k); return [a.v * 10n ** BigInt(k - a.k), b.v * 10n ** BigInt(k - b.k), k] }
const trim0 = (s) => (s.includes(',') ? s.replace(/0+$/, '').replace(/,$/, '') : s)
const lech = (s, dir) => { // dịch dấu phẩy: dir>0 sang phải 1 hàng (x10), <0 sang trái (÷10); làm trên chuỗi chữ số
  const d = dec(s); return dir > 0 ? trim0(toS(d.v, Math.max(d.k - 1, 0))) : toS(d.v, d.k + 1) }
const soSach = (x) => trim0(x)
// ---------- NDB02113: nhân với 10^k ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02113')) {
  const m = c.noi_dung.match(/(\d+(?:,\d+)?) \\times (\d+(?:\\,\d+)*)/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = dec(m[1]), f = BigInt(m[2].replace(/\\,/g, '')); const kq = a.v * f
  const dung = trim0(toS(kq, a.k))
  if (dung.replace(/\s/g, '') !== c.dap_an.replace(/\s|\./g, '')) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  const ph = trim0(lech(dung, 1)), tr = lech(dung, -1)
  out.push(form(c.ma_cau, dung, [
    { text: ph, rule: 'R364', duong_sai: 'đặt dấu phẩy lệch sang trái 1 hàng (kết quả bằng 1/10)' },
    { text: dung + '0', rule: 'R363', duong_sai: 'dịch dấu phẩy lệch sang phải 1 hàng (kết quả gấp 10 lần)' },
    { text: dung.length > 1 ? dung.slice(0, -1) : dung + '0', rule: 'R365', duong_sai: 'bỏ sót hoặc viết thừa một chữ số 0' },
    { text: toS(dec(dung).v + 1n, dec(dung).k), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị ở chữ số cuối' },
  ]))
}
// ---------- NDB02107: cộng/trừ ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02107' && /^(Đặt tính rồi tính|Tính): \$/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/\$(\d+(?:,\d+)?)([+-])(\d+(?:,\d+)?)\$/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [x, y, k] = align(dec(m[1]), dec(m[3])), kq = m[2] === '+' ? x + y : x - y, dung = toS(kq, k)
  if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, dung, [
    { text: trim0(toS(kq, k + 1)), rule: 'R364', duong_sai: 'đặt dấu phẩy lệch sang trái 1 hàng' },
    { text: trim0(toS(kq * 10n, k)), rule: 'R363', duong_sai: 'đặt dấu phẩy lệch sang phải 1 hàng' },
    { text: trim0(toS(kq + 1n, k)), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị ở chữ số cuối' },
    { text: trim0(toS(m[2] === '+' ? x - y : x + y, k)), rule: 'R365', duong_sai: 'làm ngược phép tính (cộng thành trừ hoặc trừ thành cộng)' },
  ]))
}
// ---------- NDB02100: viết số thập phân từ lời ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02100' && /^Viết số thập phân gồm/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/gồm (\d+) đơn vị, (\d+) phần trăm và (\d+) phần nghìn/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const dung = `${m[1]},${'0'}${m[2]}${m[3]}`.replace(/^(\d+),0(\d)(\d)$/, '$1,0$2$3')
  if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, dung, [
    { text: `${m[1]},${m[2]}${m[3]}`, rule: 'R365', duong_sai: 'bỏ sót chữ số 0 ở hàng phần mười' },
    { text: `${m[1]},${m[3]}${m[2]}`, rule: 'R364', duong_sai: 'đặt chữ số phần trăm và phần nghìn sai hàng' },
    { text: `${m[1]}0,${m[2]}${m[3]}`, rule: 'R363', duong_sai: 'viết thừa chữ số 0 làm lệch dấu phẩy' },
  ]))
}
// ---------- NDB02100: nêu phần nguyên, phần thập phân, đọc ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02100' && /^Nêu phần nguyên/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/số thập phân (\d+),(\d+),/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const docP = (i, f) => `${docSo(+i)} phẩy ${f.startsWith('0') ? [...f].map((d) => (d === '0' ? 'không' : docSo(+d))).join(' ') : docSo(+f)}`
  // kho đọc phần thập phân như số nguyên nếu ≥2 chữ số không bắt đầu bằng 0
  const docF = (f) => (f[0] !== '0' ? docSo(+f) : f.length === 2 ? `không ${docSo(+f)}` : f.length === 3 ? `không trăm ${f[1] === '0' ? 'linh ' : ''}${docSo(+f)}` : docSo(+f))
  const word = (i, f) => `${docSo(+i)} phẩy ${docF(f)}`
  const [i, f] = [m[1], m[2]]
  const dungS = `${i}; ${f}; ${word(i, f)}.`
  if (chuanVan(dungS) !== chuanVan(c.dap_an)) { out.push({ ma_cau: c.ma_cau, bo: `máy "${dungS}" ≠ kho "${c.dap_an}"` }); continue }
  const w3 = word(i, f).replace(/ linh/, '')
  out.push(form(c.ma_cau, dungS, [
    { text: `${f}; ${i}; ${word(f, i)}.`, rule: 'R367', duong_sai: 'nhầm phần nguyên với phần thập phân (đổi chỗ hai phần)' },
    w3 !== word(i, f) && { text: `${i}; ${f}; ${w3}.`, rule: 'R389', duong_sai: 'đọc phần thập phân thiếu "linh"' },
    { text: `${i}; ${f.replace(/^0+/, '').slice(0, -1) || '0'}; ${word(i, f.replace(/^0+/, '').slice(0, -1) || '0')}.`, rule: 'R365', duong_sai: 'bỏ sót một chữ số của phần thập phân' },
    { text: `${i}; ${f}0; ${word(i, f + '0')}.`, rule: 'R364', duong_sai: 'viết thừa chữ số 0 ở phần thập phân' },
  ]))
}
luu('k5_b4_thapphan', out)
