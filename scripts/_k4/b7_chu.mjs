import { pool, form, luu } from './lib.mjs'
const P = pool(), out = []
const lac = (excl) => ['k', 't', 'h', 'z', 'q', 'r'].find((x) => !excl.includes(x))
// giao hoán: a + N = N + ......
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01767' && /Điền chữ thích hợp/.test(c.noi_dung))) {
  const m = c.noi_dung.replace(/[$]/g, '').match(/chỗ chấm:\s*([a-z]) \+ (\d+) = (\d+) \+/)
  if (!m || m[2] !== m[3]) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [x, n] = [m[1], m[2]]
  if (c.dap_an.trim() !== x) { out.push({ ma_cau: c.ma_cau, bo: `máy ${x} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, x, [
    { text: n, rule: 'R490', duong_sai: 'điền số 5 có sẵn thay vì điền chữ' },
    { text: lac([x]), rule: 'R491', duong_sai: 'điền một chữ không có trong biểu thức' },
    { text: `${x} + ${n}`, rule: 'R492', duong_sai: 'điền cả cụm chữ kèm số thay vì chỉ một chữ' },
  ]))
}
// kết hợp: a + b + N = a + (..... + N)
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB01768' && /Tìm chữ thích hợp/.test(c.noi_dung))) {
  const m = c.noi_dung.replace(/[$]/g, '').match(/chỗ chấm:\s*([a-z]) \+ ([a-z]) \+ (\d+) = /)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [a, b, n] = [m[1], m[2], m[3]]
  if (c.dap_an.trim() !== b) { out.push({ ma_cau: c.ma_cau, bo: `máy ${b} ≠ kho ${c.dap_an}` }); continue }
  out.push(form(c.ma_cau, b, [
    { text: a, rule: 'R493', duong_sai: 'lặp lại chữ đã đứng ngoài ngoặc thay vì chữ thứ hai' },
    { text: n, rule: 'R490', duong_sai: 'điền số có sẵn thay vì điền chữ' },
    { text: lac([a, b]), rule: 'R491', duong_sai: 'điền một chữ không có trong biểu thức' },
    { text: `${b} + ${n}`, rule: 'R492', duong_sai: 'điền cả cụm chữ kèm số thay vì chỉ một chữ' },
  ]))
}
luu('k4_b7_chu', out)
