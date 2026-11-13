import { pool, form, luu } from './lib.mjs'
const P = pool(), out = [], byId = (id) => P.find((c) => c.ma_cau === id)
const mk = (v, rule, duong_sai) => (v === null || !Number.isFinite(v) ? null : { text: String(v), rule, duong_sai })
const khoN = (c) => c.dap_an.trim().replace(/[−–]/g, '-')
const chot = (c, dung, cand) => { if (String(dung) !== khoN(c)) return out.push({ ma_cau: c.ma_cau, bo: `máy ${dung} ≠ kho ${c.dap_an}` }); out.push(form(c.ma_cau, String(dung), cand.filter(Boolean))) }
// ---- bài toán tăng/giảm (độ cao, nhiệt độ) ----
for (const id of ['T1060000001329', 'T1060000001330', 'T1060000001362', 'T1060000001363']) {
  const c = byId(id); if (!c) continue
  const t = c.noi_dung, nums = [...t.matchAll(/\$(-?\d+)/g)].map((m) => +m[1])
  const sai = [...t.matchAll(/(tăng|lên|giảm|xuống)[^$]*\$(\d+)/g)].map((m) => (/giảm|xuống/.test(m[1]) ? -1 : 1) * +m[2])
  const dung = nums[0] + sai.reduce((s, x) => s + x, 0)
  chot(c, dung, [
    mk(nums[0] - sai.reduce((s, x) => s + x, 0), 'R52', 'nhầm phép tính: trừ đi các lần thay đổi thay vì cộng'),
    mk(Math.abs(nums[0]) + sai.reduce((s, x) => s + x, 0), 'R04', 'bỏ dấu âm của vị trí xuất phát'),
    mk(nums[0] + sai[0], 'R24', 'sót các lần thay đổi sau lần đầu tiên'),
    mk(-dung, 'R10', 'đổi dấu kết quả'),
    mk(dung + 10, 'R05', 'sai phép cộng/trừ có nhớ (lệch 10)'),
  ])
}
// ---- 120.(x-12)=0 ----
for (const id of ['T1060000001412', 'T1060000001414']) {
  const c = byId(id); if (!c) continue
  const m = c.noi_dung.match(/(\d+)\.\(x-(\d+)\)=0/); const k = +m[2]
  chot(c, k, [mk(-k, 'R19', 'chuyển vế không đổi dấu'), mk(0, 'R20', 'cho thừa số x bằng 0 thay vì cả biểu thức trong ngoặc'), mk(+m[1], 'R52', 'lấy hệ số làm đáp số'), mk(k + 1, 'R05', 'lệch 1 đơn vị')])
}
// ---- GTNN ----
for (const id of ['T1060000001588', 'T1060000001589']) {
  const c = byId(id); if (!c) continue
  const A = c.noi_dung.split('$')[1].replace(/\s/g, '')
  const m1 = A.match(/^A=-(\d+)\+\(x\+(\d+)\)\^2$/), m2 = A.match(/^B=\(x-(\d+)\)\^2-(\d+)$/)
  const cst = m1 ? -+m1[1] : m2 ? -+m2[2] : null, xm = m1 ? -+m1[2] : m2 ? +m2[1] : null
  if (cst === null) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  chot(c, cst, [mk(-cst, 'R04', 'sai dấu hằng số khi kết luận giá trị nhỏ nhất'), mk(0, 'R24', 'bỏ hằng số, chỉ xét phần bình phương'), mk(xm, 'R52', 'nhầm giá trị nhỏ nhất với giá trị của x làm biểu thức nhỏ nhất'), mk(cst - 1, 'R05', 'lệch 1 đơn vị')])
}
// ---- tính trực tiếp ----
const dem = { T1060000001285: [-127 + 127, [127, -254, 254]], T1060000001287: [-656, [656, 0, -655]], T1060000001323: [6, [-6, 4, 12]], T1060000001556: [0, [12, 126, -126]] }
for (const [id, [dung, sai]] of Object.entries(dem)) {
  const c = byId(id); if (!c) continue
  const r = ['R04', 'R52', 'R24']
  chot(c, dung, sai.map((v, i) => mk(v, r[i], ['sai dấu khi cộng số âm', 'nhầm phép tính', 'sót một hạng tử/thừa số'][i])))
}
luu('k6_b5_le', out)
