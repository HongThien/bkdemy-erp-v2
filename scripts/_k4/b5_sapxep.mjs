import { pool, form, luu, nhom3 } from './lib.mjs'
const P = pool(), out = []
const nu = (s) => +String(s).replace(/[^\d]/g, '')
// NDB01761: sắp xếp dãy số — chỉ giữ khi máy sắp ra đúng chuỗi kho
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01761' && /(Sắp xếp|Viết các số|theo thứ tự)/.test(c.noi_dung) && !/Điền chữ số/.test(c.noi_dung))) {
  const t = c.noi_dung.replace(/\\,/g, '')
  let seg = t.match(/(?:số sau:|Cho các số:|lần lượt là:)\s*([\s\S]*?)(?:\.\s*|\n)(?:Sắp xếp|Viết các số|Số lít)/)?.[1]
  if (!seg) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const strs = seg.split(';').map((s) => s.replace(/\$/g, '').trim().replace(/\.$/, '')).filter(Boolean)
  const giam = /lớn đến bé|giảm/.test(t)
  const val = strs.map(nu)
  const dungA = [...val].sort((a, b) => (giam ? b - a : a - b))
  const khoV = c.dap_an.split(';').map(nu)
  if (dungA.join() !== khoV.join()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dungA.join(';')} ≠ kho ${c.dap_an}` }); continue }
  const kieu = /\d \d{3}/.test(c.dap_an) ? (v) => nhom3(v) : (v) => String(v)
  const J = (a) => a.map(kieu).join('; ')
  const sw = (a, i) => a.map((x, k) => (k === i ? a[i + 1] : k === i + 1 ? a[i] : x))
  const lex = [...val].sort((a, b) => (giam ? String(b).localeCompare(String(a)) : String(a).localeCompare(String(b))))
  out.push(form(c.ma_cau, J(dungA), [
    { text: J(lex), rule: 'R419', duong_sai: 'so sánh theo từng chữ số từ trái sang, không xét số chữ số của mỗi số' },
    { text: J(sw(dungA, 0)), rule: 'R405', duong_sai: 'đảo thứ tự một cặp liền kề ở đầu dãy' },
    { text: J([...dungA].reverse()), rule: 'R368', duong_sai: 'sắp xếp ngược chiều với yêu cầu của đề' },
  ]))
}
luu('k4_b5', out)
