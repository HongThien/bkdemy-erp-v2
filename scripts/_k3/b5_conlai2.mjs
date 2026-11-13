import { form, luu } from './lib.mjs'
import { norm, tok, ev, soTrong, thayLanLuot } from './core.mjs'
import { out, P, sinhNhieu, xuat, swapDigits, dropZero } from './b4_conlai.mjs'
let seed = 0
const rep = (a, j, v) => a.map((x, i) => (i === j ? v : x))
function xuatArr(c, vals, cand, join) { // cand: [{arr, rule, ds}] — mỗi arr là cả danh sách giá trị
  const kho = soTrong(c.dap_an)
  if (kho.length !== vals.length || kho.some((x, i) => x !== vals[i])) return out.push({ ma_cau: c.ma_cau, bo: `máy ${vals.join('; ')} ≠ kho ${c.dap_an}` })
  const text = (arr) => (arr.length === vals.length ? thayLanLuot(c.dap_an, arr) : join(arr))
  const key = (arr) => arr.slice().sort((p, q) => p - q).join(); const seen = new Set([key(vals)])
  out.push(form(c.ma_cau, c.dap_an.trim(), cand.filter((x) => { if (!(x.arr && x.arr.every((v) => v !== null && Number.isFinite(v) && v >= 0))) return false; if (new Set(x.arr).size < x.arr.length) return false; const k2 = key(x.arr); if (seen.has(k2)) return false; seen.add(k2); return true }).map((x) => ({ text: text(x.arr).trim(), rule: x.rule, duong_sai: x.ds }))))
}
// ---- NDB02049: tìm số bị chia / số chia ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02049')) {
  const t = norm(c.noi_dung).replace(/\.{2,}/g, '...')
  const its = [...t.matchAll(/(\d+|\.\.\.)\s*:\s*(\d+|\.\.\.)\s*=\s*(\d+)/g)].map((m) => (m[1] === '...' ? { loai: 'sbc', d: +m[2], q: +m[3] } : { loai: 'sc', N: +m[1], q: +m[3] }))
  if (!its.length) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const vals = its.map((x) => (x.loai === 'sbc' ? x.d * x.q : (x.N % x.q === 0 ? x.N / x.q : NaN)))
  if (vals.some(Number.isNaN)) { out.push({ ma_cau: c.ma_cau, bo: 'không chia hết' }); continue }
  const s = seed++, k = vals.length, cand = []
  const j = (o) => (s + o) % k
  const x = (o) => its[j(o)]
  cand.push({ arr: rep(vals, j(0), x(0).loai === 'sbc' ? x(0).d : x(0).q), rule: 'R479', ds: 'chép luôn một số đã cho làm đáp số, không thực hiện phép tính ngược' })
  cand.push({ arr: rep(vals, j(1), x(1).loai === 'sbc' ? x(1).d + x(1).q : x(1).N - x(1).q), rule: 'R412', ds: 'dùng sai phép tính ngược (cộng thay nhân, trừ thay chia)' })
  cand.push({ arr: rep(vals, j(2), x(2).loai === 'sbc' ? (x(2).q % x(2).d === 0 ? x(2).q / x(2).d : null) : x(2).N * x(2).q), rule: 'R473', ds: 'dùng phép đối: chia thay nhân hoặc nhân thay chia' })
  cand.push({ arr: rep(vals, j(3), swapDigits(vals[j(3)])), rule: 'R471', ds: 'đảo thứ tự hai chữ số của kết quả' })
  cand.push({ arr: rep(vals, j(4), vals[j(4)] + 1), rule: 'R366', ds: 'đúng cách làm nhưng lệch 1 đơn vị' })
  cand.push({ arr: rep(vals, j(5), vals[j(5)] + 10), rule: 'R413', ds: 'tính sai một tích/tổng thành phần ở một hàng' })
  xuatArr(c, vals, cand.filter((q) => q.arr.every((v) => v !== null)), (a) => a.join('; '))
}
// ---- NDB02780: dãy phép tính / biểu thức ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02780')) {
  const t = norm(c.noi_dung)
  if (/^Bắt đầu từ/.test(t)) {
    const m = t.match(/^Bắt đầu từ (\d+)/), ops = [...t.matchAll(/(nhân|chia) (\d+)/g)].map((q) => ({ op: q[1], b: +q[2] }))
    let v = +m[1]; const vals = [], its = []
    for (const o of ops) { const a = v; v = o.op === 'nhân' ? v * o.b : (v % o.b === 0 ? v / o.b : NaN); vals.push(v); its.push({ kind: o.op === 'nhân' ? 'mul' : 'div', a, b: o.b }) }
    if (!ops.length || vals.some(Number.isNaN)) { out.push({ ma_cau: c.ma_cau, bo: 'không tính được' }); continue }
    xuat(c, vals, sinhNhieu(its, vals)); continue
  }
  if (/^Thực hiện dãy phép tính/.test(t)) {
    const m = t.match(/bắt đầu từ (\d+) : (\d+)/), ops = [...t.matchAll(/, rồi (nhân|chia) (\d+)/g)].map((q) => ({ op: q[1], b: +q[2] }))
    if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
    let v = +m[1] / +m[2], prev = v, last = null
    for (const o of ops) { prev = v; v = o.op === 'nhân' ? v * o.b : (v % o.b === 0 ? v / o.b : NaN); last = o }
    if (Number.isNaN(v) || !last) { out.push({ ma_cau: c.ma_cau, bo: 'không tính được' }); continue }
    const nghich = last.op === 'nhân' ? (prev % last.b === 0 ? prev / last.b : null) : prev * last.b
    xuatArr(c, [v], [
      { arr: [nghich], rule: 'R473', ds: 'đổi nhầm phép tính cuối: nhân thay chia hoặc chia thay nhân' },
      { arr: [v * 10], rule: 'R414', ds: 'viết kết quả thừa một chữ số 0' },
      { arr: [dropZero(v)], rule: 'R365', ds: 'bỏ sót một chữ số 0 của kết quả' },
      { arr: [prev], rule: 'R408', ds: 'dừng ở kết quả trung gian, bỏ sót phép tính cuối' },
      { arr: [v + 100], rule: 'R413', ds: 'tính sai một tích/tổng thành phần ở một hàng' },
    ], (a) => a.join('; ')); continue
  }
  if (/^Tính giá trị của biểu thức/.test(t)) {
    const body = t.slice(t.indexOf(':') + 1).replace(/\.$/, ''), ex = body.split(';').map((x) => x.trim()).filter(Boolean)
    const its = ex.map((e) => ({ kind: 'expr', tokens: tok(e) })), vals = its.map((x) => ev(x.tokens))
    if (vals.some((x) => x === null)) { out.push({ ma_cau: c.ma_cau, bo: 'không tính được' }); continue }
    xuat(c, vals, sinhNhieu(its, vals)); continue
  }
}
// ---- NDB02045/46: hai số tiếp theo ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02045' || c.ma_dang_bai === 'NDB02046')) {
  const t = norm(c.noi_dung).replace(/\.{2,}/g, '...'), nums = soTrong(t.slice(t.indexOf(':')))
  if (nums.length !== 3) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const [a, b, d3] = nums, d = b - a
  if (d3 - b !== d) { out.push({ ma_cau: c.ma_cau, bo: 'dãy không đều' }); continue }
  const n1 = d3 + d, n2 = d3 + 2 * d, dd = d > 0 ? d + 1 : d - 1
  xuatArr(c, [n1, n2], [
    { arr: [d3 + dd, d3 + 2 * dd], rule: 'R475', ds: 'tìm sai bước nhảy (lệch 1 đơn vị bước)' },
    { arr: [n1, d3 + 3 * d], rule: 'R485', ds: 'số thứ hai nhảy gấp ba bước' },
    { arr: [n2, n1], rule: 'R405', ds: 'viết hai số theo thứ tự đảo ngược' },
    { arr: [n1, n2 + 1], rule: 'R366', ds: 'đúng cách làm nhưng lệch 1 đơn vị' },
  ], (a) => a.join('; '))
}
// ---- NDB02031: số liên tiếp ----
for (const c of P.filter((c) => c.ma_dang_bai === 'NDB02031')) {
  const t = norm(c.noi_dung).replace(/\.{2,}/g, '...')
  if (/ba số liên tiếp/.test(t)) {
    const parts = t.slice(t.indexOf(':') + 1).replace(/\.$/, '').split(',').map((x) => x.trim()), p = parts.findIndex((x) => /^\d+$/.test(x)), x = +parts[p]
    const v = [0, 1, 2].map((i) => x + i - p)
    const q = p === 0 ? 2 : 0
    xuatArr(c, v, [
      { arr: [0, 1, 2].map((i) => x + 2 * (i - p)), rule: 'R475', ds: 'đếm cách 2 đơn vị thay vì liên tiếp' },
      { arr: [0, 1, 2].map((i) => x - (i - p)), rule: 'R426', ds: 'đếm ngược chiều (nhầm liền trước với liền sau)' },
      { arr: [0, 1, 2].map((i) => x + i - q), rule: 'R486', ds: 'đặt số đã cho vào sai vị trí trong ba số' },
      { arr: [v[0], v[2], v[1]], rule: 'R405', ds: 'viết đảo thứ tự hai số' },
      { arr: [v[0], v[1], v[2] + 1], rule: 'R366', ds: 'đúng cách làm nhưng lệch 1 đơn vị ở số cuối' },
    ], (a) => a.join(', '))
  } else {
    const items = t.slice(t.indexOf(':') + 1).replace(/\.$/, '').split(',').map((x) => x.trim()), known = items.map((x, i) => (/^\d+$/.test(x) ? [i, +x] : null)).filter(Boolean)
    const at = (i) => known[0][1] + i - known[0][0]
    if (known.some(([i, v]) => at(i) !== v)) { out.push({ ma_cau: c.ma_cau, bo: 'dãy không liên tiếp' }); continue }
    const vals = items.map((x, i) => (x === '...' ? at(i) : null)).filter((x) => x !== null)
    xuatArr(c, vals, [
      { arr: vals.map((v, i) => (i === 1 ? vals[2] : i === 2 ? vals[1] : v)), rule: 'R405', ds: 'đảo thứ tự hai số liền kề' },
      { arr: rep(vals, vals.length - 1, vals[vals.length - 1] + 1), rule: 'R366', ds: 'đúng cách làm nhưng lệch 1 đơn vị ở số cuối' },
      { arr: vals.map((v, i) => (i >= 3 ? v + 1 : v)), rule: 'R486', ds: 'đếm lệch một số từ giữa dãy' },
      { arr: vals.map((v, i) => (i === 0 ? v - 1 : v)), rule: 'R413', ds: 'viết sai một số thành phần ở đầu dãy' },
    ], (a) => a.join(', '))
  }
}
luu('k3_b4_conlai', out)
