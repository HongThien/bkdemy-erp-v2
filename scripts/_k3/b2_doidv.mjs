import { pool, form, luu } from './lib.mjs'
import { norm, soTrong, thayLanLuot } from './core.mjs'
const MM = { mm: 1, cm: 10, dm: 100, m: 1000 }
const out = []; let rot = 0
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02058')) {
  const t = norm(c.noi_dung).replace(/\.{3,}/g, '...')
  const m = t.match(/(\d+) (mm|cm|dm|m)(?: (\d+) (mm|cm|dm|m))? ?= ?\.\.\. ?(mm|cm|dm|m)/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const a = +m[1], ua = m[2], b = m[3] ? +m[3] : null, ub = m[4], ut = m[5]
  const tot = a * MM[ua] + (b !== null ? b * MM[ub] : 0), r = MM[ut]
  if (tot % r) { out.push({ ma_cau: c.ma_cau, bo: 'không nguyên' }); continue }
  const dung = tot / r
  if (String(dung) !== soTrong(c.dap_an).join('')) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); continue }
  const F = (v) => thayLanLuot(c.dap_an, [v])
  // R388: nhân thay chia / chia thay nhân với đúng hệ số
  const fac = Math.max(MM[ua], MM[ut]) / Math.min(MM[ua], MM[ut])
  const lenNho = MM[ut] < MM[ua] // đổi sang đơn vị nhỏ hơn => nhân; sai = chia
  const tuA = a * MM[ua] / MM[ut] // phần đầu quy đổi
  const r388 = b === null ? (lenNho ? (a % fac ? null : a / fac) : a * fac) : null
  const ghep = b !== null ? +(`${a}${b}`) : null
  const cand = [
    { text: r388 !== null ? F(r388) : null, rule: 'R388', duong_sai: 'đổi nhầm chiều: chia thay vì nhân (hoặc nhân thay vì chia) với hệ số đổi' },
    { text: F(dung * 10), rule: 'R414', duong_sai: 'viết kết quả thừa một chữ số 0 (gấp 10 lần)' },
    { text: ghep !== null ? F(ghep) : null, rule: 'R385', duong_sai: 'ghép liền hai số thay vì đổi từng phần rồi cộng' },
    { text: dung >= 10 ? F(Math.floor(dung / 10)) : F(dung + 10), rule: 'R413', duong_sai: 'đổi sai hệ số một bậc (lệch 10 lần)' },
    { text: F(dung + 1), rule: 'R366', duong_sai: 'lệch 1 đơn vị so với kết quả đúng' },
  ].filter((x) => x.text && x.text !== c.dap_an)
  out.push(form(c.ma_cau, c.dap_an.trim(), cand, rot++ % 4))
}
luu('k3_b2_doidv', out)
