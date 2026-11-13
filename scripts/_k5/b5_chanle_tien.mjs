import { pool, form, luu, nhom3, soTrang } from './lib.mjs'
const P = pool(), out = []
const T = (n) => nhom3(n)
const sau = (c, dung, cand) => { if (String(dung) !== soTrang(c.dap_an)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); out.push(form(c.ma_cau, T(dung), cand.filter((x) => x.v >= 0).map((x) => ({ text: T(x.v), rule: x.rule, duong_sai: x.ds })))) }
// ---- chẵn/lẻ liền trước/sau ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02075' && /^Số (chẵn|lẻ) liền (trước|sau) của số/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/^Số (chẵn|lẻ) liền (trước|sau) của số ([\d ]+) là/), n = +m[3].replace(/\s/g, ''), s = m[2] === 'trước' ? -1 : 1
  const par = m[1] === 'chẵn' ? 0 : 1
  let dung = n + s; while (dung % 2 !== par) dung += s
  sau(c, dung, [
    { v: n + s, rule: 'R425', ds: 'chỉ cộng/trừ 1 nên ra số khác tính chẵn lẻ với yêu cầu' },
    { v: n - s + (n - s) % 2 !== par ? 0 : 0, rule: 'x', ds: '' },
  ].slice(0, 1).concat([
    { v: (() => { let x = n - s; while (x % 2 !== par) x -= s; return x })(), rule: 'R426', ds: 'nhầm chiều liền trước với liền sau' },
    { v: dung + 2 * s, rule: 'R428', ds: 'đi quá một bước 2 đơn vị (lấy số chẵn/lẻ kế tiếp)' },
  ]))
}
// ---- chẵn/lẻ bé nhất / lớn nhất có k chữ số ----
const so = { một: 1, hai: 2, ba: 3, bốn: 4 }
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02075' && /^Số (chẵn|lẻ) (bé|lớn) nhất có \d+ chữ số/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/^Số (chẵn|lẻ) (bé|lớn) nhất có (\d+) chữ số/), k = +m[3], chan = m[1] === 'chẵn', be = m[2] === 'bé'
  const lo = 10 ** (k - 1), hi = 10 ** k - 1
  let dung = be ? lo : hi; while (dung % 2 !== (chan ? 0 : 1)) dung += be ? 1 : -1
  sau(c, dung, [
    { v: be ? lo + (chan ? 1 : 0) : hi - (chan ? 0 : 1) + (chan ? 1 : 0), rule: 'R427', ds: 'đặt chữ số tận cùng sai tính chẵn/lẻ' },
    { v: k === 1 ? -1 : (() => { let x = be ? 10 ** (k - 2) : 10 ** (k - 1) - 1; while (x % 2 !== (chan ? 0 : 1)) x += be ? 1 : -1; return x })(), rule: 'R428', ds: 'lấy số có ít hơn một chữ số so với yêu cầu' },
    { v: be ? lo * 10 + (chan ? 0 : 1) : hi * 10 + 9 - (chan ? 1 : 0), rule: 'R425', ds: 'lấy số có nhiều hơn một chữ số so với yêu cầu' },
  ])
}
// ---- "Số chẵn/lẻ nhỏ nhất có k chữ số là số liền sau của …" ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02075' && /nhỏ nhất có \S+ chữ số là số liền sau của/.test(c.noi_dung))) {
  const m = c.noi_dung.match(/^Số (chẵn|lẻ) nhỏ nhất có (một|hai|ba) chữ số/), k = so[m[2]], chan = m[1] === 'chẵn'
  const lo = 10 ** (k - 1); let v = lo; if (k === 1 && chan) v = 2; else while (v % 2 !== (chan ? 0 : 1)) v++
  if (k === 1 && !chan) v = 1
  const dung = v - 1
  sau(c, dung, [
    { v, rule: 'R425', ds: 'lấy chính số đó thay vì số liền trước của nó' },
    { v: v + 1, rule: 'R426', ds: 'nhầm liền trước với liền sau' },
    { v: v - 2, rule: 'R428', ds: 'lùi hai đơn vị thay vì một' },
  ])
}
luu('k5_b5_chanle', out)
