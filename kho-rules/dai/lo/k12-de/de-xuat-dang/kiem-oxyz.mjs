// kiem-oxyz.mjs — kiểm hình thức 44 dạng Oxyz viết bổ sung (oxyz-ra-A..E.json) trước khi ghi DB.
import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k12-de/de-xuat-dang/'
const all = [], old = new Map()
for (const k of 'ABCDE') {
  for (const d of JSON.parse(fs.readFileSync(D + `oxyz-vao-${k}.json`, 'utf8'))) old.set(d.id, d)
  all.push(...JSON.parse(fs.readFileSync(D + `oxyz-ra-${k}.json`, 'utf8')))
}
const loi = []
const dem = (s, re) => (s.match(re) || []).length
for (const x of all) {
  const t = x.ly_thuyet + '\n' + x.vi_du
  if (!old.has(x.id)) loi.push(x.id + ' id lạ')
  if (dem(t, /\$/g) % 2) loi.push(x.id + ' số dấu $ lẻ')
  if (/\$\$/.test(t)) loi.push(x.id + ' có $$')
  if (!/##VD/.test(x.vi_du)) loi.push(x.id + ' vi_du thiếu ##VD')
  if (!/Bài giải:/.test(x.vi_du)) loi.push(x.id + ' vi_du thiếu "Bài giải:"')
  if (!/##(TC|PP)/.test(x.ly_thuyet)) loi.push(x.id + ' ly_thuyet thiếu ##TC/##PP')
  if (x.ly_thuyet.length < 250) loi.push(x.id + ' ly_thuyet quá ngắn ' + x.ly_thuyet.length)
  const m = (x.vi_du.match(/##VD/g) || []).length
  if (m < 1) loi.push(x.id + ' không có ví dụ')
  // lời giải không có dòng trống: sau "Bài giải:" đến ##VD kế/hết, không có \n\n
  for (const blk of x.vi_du.split(/##VD/).slice(1)) { const i = blk.indexOf('Bài giải:'); if (i >= 0 && /\n\s*\n/.test(blk.slice(i).trimEnd())) loi.push(x.id + ' lời giải có dòng trống') }
  if (/\\\(|\\\[/.test(t)) loi.push(x.id + ' dùng \\( hoặc \\[')
  if (x.mo_ta != null && x.mo_ta.length < 60) loi.push(x.id + ' mo_ta mới quá ngắn')
}
console.log('dạng:', all.length, 'duy nhất:', new Set(all.map((x) => x.id)).size, '· thiếu so với đầu vào:', [...old.keys()].filter((k) => !all.some((x) => x.id === k)))
console.log('lỗi:', loi.length); for (const l of loi) console.log('  ', l)
console.log('mo_ta mới:', all.filter((x) => x.mo_ta != null).length, '· giữ nguyên của Thùy:', all.filter((x) => x.mo_ta == null).length)
console.log('ví dụ tổng:', all.reduce((s, x) => s + (x.vi_du.match(/##VD/g) || []).length, 0))
