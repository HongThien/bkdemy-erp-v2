import { pool, form, luu } from './lib.mjs'
import { norm, soTrong, thayLanLuot } from './core.mjs'
const P = pool(), out = []
const T = (c, arr) => thayLanLuot(c.dap_an, arr).trim()
const kiem = (c, v) => { const k = soTrong(c.dap_an); return k.length === v.length && k.every((x, i) => x === v[i]) }
const sai = (c, v) => out.push({ ma_cau: c.ma_cau, bo: `máy ${v.join('; ')} ≠ kho ${c.dap_an}` })
// ---- NDB02807: lập số từ thẻ ----
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])))
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02807')) {
  const t = norm(c.noi_dung)
  const tc = t.match(/^Viết tất cả các số tròn chục lớn hơn (\d+) và bé hơn (\d+)/)
  if (tc) {
    const lo = +tc[1], hi = +tc[2], v = []
    for (let x = lo + 10 - (lo % 10 || 10) + (lo % 10 === 0 ? 0 : 0); x < hi; x += 10) if (x > lo && x % 10 === 0) v.push(x)
    if (!kiem(c, v)) { sai(c, v); continue }
    const join = (a) => a.join('; ')
    out.push(form(c.ma_cau, c.dap_an.trim(), [
      { text: join(v.filter((_, i) => i !== Math.floor(v.length / 2))), rule: 'R403', duong_sai: 'liệt kê thiếu một số hợp lệ' },
      { text: join([...v, hi]), rule: 'R404', duong_sai: 'liệt kê thừa số bằng đầu mút (không bé hơn hẳn)' },
      { text: join(v.map((x, i) => (i === 0 ? x + 1 : x))), rule: 'R366', duong_sai: 'viết một số không tròn chục (lệch 1 đơn vị)' },
      { text: join([lo, ...v]), rule: 'R404', duong_sai: 'liệt kê thừa số bằng đầu mút (không lớn hơn hẳn)' },
    ]))
    continue
  }
  const dg = t.slice(t.indexOf('thẻ số')).match(/(?:^|[^\d])(\d)(?=\D)/g)
  const digs = (t.slice(t.indexOf('thẻ số') + 6).match(/\b\d\b/g) || []).slice(0, 3).map(Number)
  if (digs.length !== 3 || !dg) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const lon = /lớn nhất/.test(t), be = /bé nhất/.test(t)
  if (lon === be) { out.push({ ma_cau: c.ma_cau, bo: 'không rõ yêu cầu' }); continue }
  const hc = t.match(/hàng chục là (\d)/), lh = t.match(/lớn hơn (\d+)/), bh = t.match(/bé hơn (\d+)/)
  const all = [...new Set(perms(digs).filter((p) => p[0] !== 0).map((p) => p[0] * 100 + p[1] * 10 + p[2]))].sort((a, b) => a - b)
  const dk = (x) => (!hc || Math.floor(x / 10) % 10 === +hc[1]) && (!lh || x > +lh[1]) && (!bh || x < +bh[1])
  const ok = all.filter(dk)
  if (!ok.length) { out.push({ ma_cau: c.ma_cau, bo: 'không có số thỏa điều kiện' }); continue }
  const best = (arr, up) => (up ? arr[arr.length - 1] : arr[0])
  const dung = best(ok, lon)
  if (!kiem(c, [dung])) { sai(c, [dung]); continue }
  const sw = (x) => { const s = String(x).split(''); const y = +(s[0] + s[2] + s[1]); return y !== x && s[2] !== '0' ? y : +(s[1] + s[0] + s[2]) }
  const sec = lon ? ok[ok.length - 2] : ok[1]
  out.push(form(c.ma_cau, T(c, [dung]), [
    { text: T(c, [best(all, lon)]), rule: 'R482', duong_sai: 'bỏ qua điều kiện thêm của đề, chỉ lập số lớn nhất/bé nhất của ba thẻ' },
    { text: T(c, [best(ok, !lon)]), rule: 'R483', duong_sai: 'đọc nhầm yêu cầu: lập số bé nhất thay vì lớn nhất (hoặc ngược lại)' },
    sec !== undefined && { text: T(c, [sec]), rule: 'R487', duong_sai: 'lập số thỏa điều kiện nhưng không phải số lớn nhất/bé nhất' },
    { text: T(c, [sw(dung)]), rule: 'R471', duong_sai: 'đổi chỗ hai chữ số của số tìm được' },
    { text: T(c, [dung + 1]), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị' },
  ].filter(Boolean)))
}
// ---- NDB02055: phân số đơn vị ----
const MAU = { hai: 2, ba: 3, bốn: 4, tư: 4, năm: 5, sáu: 6, bảy: 7, tám: 8, chín: 9, mười: 10 }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02055')) {
  const ws = [...norm(c.noi_dung).matchAll(/một phần (\S+?)(?=[;.,]|$)/g)].map((m) => MAU[m[1]])
  const kho = [...c.dap_an.matchAll(/1\/(\d+)/g)].map((m) => +m[1])
  if (!ws.length || ws.some((x) => !x) || ws.join() !== kho.join()) { out.push({ ma_cau: c.ma_cau, bo: `máy ${ws.join()} ≠ kho ${c.dap_an}` }); continue }
  const f = (arr) => arr.map((n) => `1/${n}`).join('; ')
  const hoan = ws.map((x, i) => (i === 0 ? ws[1] : i === 1 ? ws[0] : x))
  out.push(form(c.ma_cau, c.dap_an.trim(), [
    { text: ws.map((n, i) => `1/${i === 0 ? [7, 8, 9, 10, 11].find((q) => !ws.includes(q)) : n}`).join('; '), rule: 'R366', duong_sai: 'viết sai một mẫu số (lệch 1 đơn vị)' },
    { text: ws.map((n, i) => (i === 2 ? `${n}/1` : `1/${n}`)).join('; '), rule: 'R402', duong_sai: 'đảo tử số và mẫu số' },
    { text: ws.map((n, i) => (i === 3 ? `${n}/${n}` : `1/${n}`)).join('; '), rule: 'R478', duong_sai: 'viết tử số bằng mẫu số' },
  ]))
}
// ---- NDB02070: khối hộp chữ nhật ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02070')) {
  const t = norm(c.noi_dung)
  if (/Số cạnh .* nhiều hơn số đỉnh/.test(t)) {
    if (!kiem(c, [4])) { sai(c, [4]); continue }
    out.push(form(c.ma_cau, c.dap_an.trim(), [
      { text: T(c, [6]), rule: 'R476', duong_sai: 'lấy số mặt (6) thay cho số đỉnh (8)' },
      { text: T(c, [20]), rule: 'R415', duong_sai: 'cộng số cạnh với số đỉnh thay vì trừ' },
      { text: T(c, [5]), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị' },
    ]))
  } else if (/Số mặt cộng với số đỉnh/.test(t)) {
    if (!kiem(c, [14])) { sai(c, [14]); continue }
    out.push(form(c.ma_cau, c.dap_an.trim(), [
      { text: T(c, [20]), rule: 'R476', duong_sai: 'lấy số cạnh (12) thay cho số mặt (6)' },
      { text: T(c, [48]), rule: 'R415', duong_sai: 'nhân số mặt với số đỉnh thay vì cộng' },
      { text: T(c, [13]), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị' },
    ]))
  } else out.push({ ma_cau: c.ma_cau, bo: 'chưa hỗ trợ' })
}
// ---- NDB02038 ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02038')) {
  const t = norm(c.noi_dung)
  let m
  if ((m = t.match(/^Tìm một số, biết rằng thêm (\d+) vào số đó thì được số tròn trăm bé nhất có ba chữ số/))) {
    const x = +m[1], v = 100 - x
    if (!kiem(c, [v])) { sai(c, [v]); continue }
    out.push(form(c.ma_cau, c.dap_an.trim(), [
      { text: T(c, [200 - x]), rule: 'R481', duong_sai: 'lấy nhầm số tròn trăm (200 thay vì 100)' },
      { text: T(c, [100 + x]), rule: 'R412', duong_sai: 'dùng sai phép tính ngược: cộng thay vì trừ' },
      { text: T(c, [v + 1]), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị' },
      { text: T(c, [+String(v).split('').reverse().join('')]), rule: 'R471', duong_sai: 'đảo thứ tự hai chữ số của kết quả' },
    ]))
  } else if ((m = t.match(/(\d+) \+ (\d+) \+\s*\.\.\. = (\d+)/))) {
    const a = +m[1], b = +m[2], s = +m[3], v = s - a - b
    if (!kiem(c, [v])) { sai(c, [v]); continue }
    out.push(form(c.ma_cau, c.dap_an.trim(), [
      { text: T(c, [s - a]), rule: 'R480', duong_sai: 'chỉ trừ một số hạng, bỏ sót số hạng còn lại' },
      { text: T(c, [s + a + b]), rule: 'R412', duong_sai: 'dùng sai phép tính ngược: cộng thay vì trừ' },
      { text: T(c, [v + 1]), rule: 'R366', duong_sai: 'đúng cách làm nhưng lệch 1 đơn vị' },
      { text: T(c, [v + 10]), rule: 'R413', duong_sai: 'tính sai một số thành phần ở hàng chục' },
    ]))
  } else out.push({ ma_cau: c.ma_cau, bo: 'chưa hỗ trợ' })
}
luu('k3_b6_rest', out)
