import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const P = pool(), out = []
const nu = (s) => +String(s).replace(/[^\d]/g, '')
const mk = (v, rule, duong_sai) => ({ text: Number.isInteger(v) && v > 0 ? nhom3(v) : null, rule, duong_sai })
const nhan = (c, dung, cand) => {
  if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` })
  out.push(form(c.ma_cau, nhom3(dung), cand.filter((x) => x && x.text)))
}
// ---- NDB01791: ba lần bán, lần hai gấp đôi ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01791' && /gấp đôi/.test(c.noi_dung))) {
  const n = (c.noi_dung.match(/\d+/g) || []).map(Number); const [a, b, d] = n, sold = b + 2 * b + d, dung = a - sold
  nhan(c, dung, [mk(sold, 'R408', 'dừng ở tổng số đã bán, chưa trừ khỏi số ban đầu'), mk(a - (b + b + d), 'R413', 'hiểu lần thứ hai bằng lần đầu (bỏ sót "gấp đôi")'), mk(a + sold, 'R407', 'cộng thay vì trừ số đã bán'), mk(dung * 10, 'R414', 'viết kết quả thừa một chữ số 0')])
}
// ---- NDB01760: làm tròn số lớn/nhỏ nhất ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01760')) {
  const list = (c.noi_dung.match(/Cho các số:(.*?)\. Làm/)?.[1] || '').split(';').map(nu).filter(Boolean)
  const lon = /lớn nhất/.test(c.noi_dung), x = lon ? Math.max(...list) : Math.min(...list)
  const h = 100000, r = x % h, ch = (v, hh = h) => { const rr = v % hh; return rr * 2 >= hh ? v - rr + hh : v - rr }
  const dung = ch(x)
  if (`$${dung}$` !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  const W = (v) => (Number.isInteger(v) && v > 0 ? `$${v}$` : null)
  out.push(form(c.ma_cau, `$${dung}$`, [
    { text: W(ch(x, 10000)), rule: 'R395', duong_sai: 'làm tròn đến hàng liền kề nhỏ hơn (chục nghìn) thay vì hàng trăm nghìn' },
    { text: W(ch(x, 1000000)), rule: 'R422', duong_sai: 'làm tròn đến hàng liền kề lớn hơn (triệu)' },
    { text: W(r * 2 >= h ? x - r : x - r + h), rule: 'R396', duong_sai: 'xét sai chữ số quyết định nên làm tròn ngược chiều' },
    { text: W(x - r), rule: 'R397', duong_sai: 'cắt bỏ các chữ số sau hàng làm tròn, luôn làm tròn xuống' },
    { text: W(dung * 10), rule: 'R414', duong_sai: 'viết kết quả thừa một chữ số 0' },
  ].filter((o) => o.text)))
}
// ---- NDB01758: ghép thẻ ----
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])))
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01758' && /Các số có sáu chữ số có thể ghép được là/.test(c.noi_dung))) {
  const cards = [...c.noi_dung.matchAll(/\$(\d\d)\$/g)].map((m) => m[1])
  if (cards.length !== 3) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const list = [...new Set(perms(cards).map((p) => p.join('')).filter((s) => s[0] !== '0'))].sort((a, b) => a - b)
  const dung = list.join('; ')
  if (dung !== c.dap_an.trim()) { out.push({ ma_cau: c.ma_cau, bo: `máy "${dung}" ≠ kho "${c.dap_an}"` }); continue }
  const lead0 = perms(cards).map((p) => p.join('')).find((s) => s[0] === '0')
  out.push(form(c.ma_cau, dung, [
    { text: list.slice(1).join('; '), rule: 'R403', duong_sai: 'liệt kê thiếu một số ghép được' },
    lead0 && { text: [lead0, ...list].join('; '), rule: 'R404', duong_sai: 'liệt kê thừa số bắt đầu bằng chữ số 0 (không đủ sáu chữ số)' },
    { text: list.map((s, i) => (i === 0 ? s.replace('0', '') : s)).join('; '), rule: 'R365', duong_sai: 'bỏ sót chữ số 0 ở một số' },
  ].filter(Boolean)))
}
luu('k4_b4', out)
