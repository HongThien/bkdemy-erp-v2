import { pool, form, luu } from './lib.mjs'
const BS = String.fromCharCode(92), P = pool(), out = []
const fr = (a, b) => `${BS}dfrac{${a}}{${b}}`
// ---- NDB02093: viết hỗn số thành tổng ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02093' && /^Viết hỗn số thành tổng/.test(c.noi_dung))) {
  const ms = [...c.noi_dung.split('Mẫu:')[1].split('\n\n')[1].matchAll(/(\d+)\W*dfrac\{(\d+)\}\{(\d+)\}/g)].map((m) => [+m[1], +m[2], +m[3]])
  const kho = [...c.dap_an.matchAll(/\$(\d+) \+ \W*dfrac\{(\d+)\}\{(\d+)\}\$/g)].map((m) => [+m[1], +m[2], +m[3]])
  if (!ms.length || JSON.stringify(ms) !== JSON.stringify(kho)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${JSON.stringify(ms)} ≠ kho ${c.dap_an}` }); continue }
  const f = (g) => ms.map(([w, t, m], i) => `${'ab'[i]}) $${g(w, t, m)}$`).join('  ')
  out.push(form(c.ma_cau, c.dap_an.trim(), [
    { text: f((w, t, m) => `${w} + ${fr(m, t)}`), rule: 'R402', duong_sai: 'đảo tử số và mẫu số của phần phân số' },
    { text: f((w, t, m) => `${t} + ${fr(w, m)}`), rule: 'R401', duong_sai: 'đổi chỗ phần nguyên với tử số' },
    { text: f((w, t, m) => `${w} ${BS}times ${fr(t, m)}`), rule: 'R407', duong_sai: 'dùng phép nhân thay vì phép cộng giữa phần nguyên và phần phân số' },
  ]))
}
// ---- NDB02090: phân số thập phân ----
const HE = { dm: 10, m: 100, kg: 1000, 'tấn': 1000 }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02090')) {
  const ls = [...c.noi_dung.matchAll(/(\d+) (dm|m|kg|tấn) (\d+) (cm|g|kg)/g)].map((m) => [+m[1], m[2], +m[3]])
  const khoL = [...c.dap_an.matchAll(/\$(\d+)\W*dfrac\{(\d+)\}\{(\d+)\}\$/g)].map((m) => [+m[1], +m[2], +m[3]])
  if (ls.length !== 4 || khoL.length !== 4) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề/đáp số' }); continue }
  const mine = ls.map(([w, u, t]) => [w, t, HE[u]])
  if (JSON.stringify(mine) !== JSON.stringify(khoL)) { out.push({ ma_cau: c.ma_cau, bo: `máy ${JSON.stringify(mine)} ≠ kho ${c.dap_an.replace(/\n/g, '/')}` }); continue }
  const f = (g) => mine.map(([w, t, m], i) => `${'abcd'[i]}) $${g(w, t, m)}$`).join('\n')
  out.push(form(c.ma_cau, c.dap_an.trim(), [
    { text: f((w, t, m) => `${w}${fr(m, t)}`), rule: 'R402', duong_sai: 'đảo tử số và mẫu số' },
    { text: f((w, t, m) => `${t}${fr(w, m)}`), rule: 'R401', duong_sai: 'viết ngược phần nguyên và tử số' },
    { text: f((w, t, m) => `${w}${fr(t, m * 10)}`), rule: 'R424', duong_sai: 'chọn mẫu số lệch bậc 10 lần' },
  ]))
}
luu('k5_b6_phanso', out)
