import { pool, form, luu } from './lib.mjs'
const BS = String.fromCharCode(92), P = pool(), out = []
const fr = (b, n, d, dau = '-') => `$${BS}dfrac{${b}^{${n}}${dau}1}{${d}}$`
// ---------- NDB00365: dãy luỹ thừa 1 + b^s + b^2s + ... + b^M = (b^(M+s) - 1)/(b^s - 1) ----------
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB00365')) {
  const seg = (c.noi_dung.split('$')[1] || '').replace(/^[A-Z]\s*=\s*/, '').replace(/\s/g, '')
  const terms = seg.split('+').filter((t) => t && !/^\.+$/.test(t) && !/ldots/.test(t))
  const m1 = (terms[1] || '').match(/^(\d+)(?:\^\{?(\d+)\}?)?$/), mL = (terms[terms.length - 1] || '').match(/^(\d+)\^\{?(\d+)\}?$/)
  if (terms[0] !== '1' || !m1 || !mL || m1[1] !== mL[1]) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const b = +m1[1], s = +(m1[2] || 1), M = +mL[2], n = M + s, d = b ** s - 1
  const dung = fr(b, n, d), khoS = c.dap_an.trim()
  if (dung !== khoS) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${khoS}` }); continue }
  out.push(form(c.ma_cau, khoS, [
    { text: fr(b, n - s, d), rule: 'D27', duong_sai: 'quên cộng thêm bước nhảy vào số mũ (số mũ thiếu một bước)' },
    { text: fr(b, n + s, d), rule: 'D28', duong_sai: 'cộng thừa một bước nhảy vào số mũ' },
    { text: fr(b, n, d, '+'), rule: 'D26', duong_sai: 'nhầm dấu khi trừ hai dãy cho nhau (ra +1 thay vì −1)' },
    s > 1 ? { text: fr(b, n, b - 1), rule: 'D29', duong_sai: 'dùng hệ số (cơ số − 1) thay vì (cơ số luỹ thừa bước nhảy − 1)' } : { text: fr(b, n, b + 1), rule: 'D30', duong_sai: 'nhầm dấu khi tính hệ số (cộng 1 thay vì trừ 1)' },
  ]))
}
luu('k6_b2_daylt', out)
