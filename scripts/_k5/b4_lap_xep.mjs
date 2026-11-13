import { pool, form, luu } from './lib.mjs'
import { docSo, chuanVan } from './doc.mjs'
const P = pool(), out = []
const cmp = (a, b) => Number(a.replace(',', '.')) - Number(b.replace(',', '.'))
// ---------- NDB02105 lập số thập phân ----------
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])))
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02105')) {
  const seg = (c.noi_dung.match(/thẻ ([^,]*?)(?:dấu phẩy)?, hãy/) || [])[1]
  if (!seg) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  let d = seg.split(';').map((s) => s.trim()).filter((s) => /^\d$/.test(s))
  let list
  if (/bé hơn 1/.test(c.noi_dung)) { const i0 = d.indexOf('0'); const r = d.filter((_, i) => i !== i0); list = [...new Set(perms(r).map((p) => '0,' + p.join('')))] }
  else if (/phần nguyên gồm một chữ số, phần thập phân gồm hai chữ số/.test(c.noi_dung) && d.length === 3) list = [...new Set(perms(d).map((p) => p[0] + ',' + p[1] + p[2]))]
  else { out.push({ ma_cau: c.ma_cau, bo: 'khuôn đề chưa hỗ trợ' }); continue }
  list.sort(cmp)
  const dung = list.join('; ')
  const khoSet = c.dap_an.split(';').map((x) => x.trim()).sort(cmp).join('; ')
  if (dung !== khoSet) { out.push({ ma_cau: c.ma_cau, bo: `máy "${dung}" ≠ kho "${c.dap_an}"` }); continue }
  const mid = Math.floor(list.length / 2)
  const thieu = list.filter((_, i) => i !== mid)
  const lap = list[0].slice(0, -1) + list[0][0] // lặp lại chữ số đầu => dùng một thẻ hai lần
  const them = [...list, lap].sort(cmp)
  const k0 = list.findIndex((s) => /,.*0/.test(s) && !/,0$/.test(s))
  const a365 = k0 >= 0 ? list.map((s, i) => (i === k0 ? s.replace(/0/g, (z, p) => (p > s.indexOf(',') ? '' : z)) : s)) : list.map((s, i) => (i === 0 ? s.replace(',', ',0') : s))
  out.push(form(c.ma_cau, dung, [
    { text: thieu.join('; '), rule: 'R403', duong_sai: 'liệt kê thiếu một số hợp lệ' },
    { text: them.join('; '), rule: 'R404', duong_sai: 'liệt kê thừa một số không hợp lệ (dùng một thẻ hai lần)' },
    { text: a365.join('; '), rule: 'R365', duong_sai: 'bỏ sót hoặc viết thừa chữ số 0 ở một số' },
  ]))
}
// ---------- NDB02093 đọc hỗn số ----------
const hoa = (s) => s.charAt(0).toUpperCase() + s.slice(1)
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02093' && /^Đọc hỗn số/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/(\d+)\W*dfrac\{(\d+)\}\{(\d+)\}/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [w, t, M] = [+m[1], +m[2], +m[3]]
  const doc = (w, t, M) => `${hoa(docSo(w))} và ${docSo(t)} phần ${docSo(M)}.`
  const dung = doc(w, t, M)
  if (chuanVan(dung) !== chuanVan(c.dap_an)) { out.push({ ma_cau: c.ma_cau, bo: `máy "${dung}" ≠ kho "${c.dap_an}"` }); continue }
  const M2 = M >= 1000 ? M / 10 : M * 10
  out.push(form(c.ma_cau, dung, [
    { text: doc(w, M, t), rule: 'R402', duong_sai: 'đảo tử số và mẫu số khi đọc' },
    { text: `${hoa(docSo(t))} phần ${docSo(M)} và ${docSo(w)}.`, rule: 'R401', duong_sai: 'đọc phần phân số trước, phần nguyên sau' },
    { text: doc(w, t, M2), rule: 'R424', duong_sai: 'đọc nhầm mẫu số lệch bậc 10 lần' },
  ]))
}
luu('k5_b4_lapxep', out)
