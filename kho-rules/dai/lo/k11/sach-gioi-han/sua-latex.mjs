// sua-latex.mjs — vá lỗi LaTeX hỏng do thoát `\` sai (xem quet-loi-latex.mjs) trong một tệp đơn vị. Sao lưu bản trước ra <tệp>.truoc-latex.json.
//   node kho-rules/dai/lo/k11/sach-gioi-han/sua-latex.mjs <don-vi>.json
// Quy tắc vá (chỉ chuỗi): TAB + "o" → \to · TAB + "ext{" → \text{ · infty / dfrac / sqrt / approx / cdot / neq / geq / leq / frac mất `\` → thêm `\`.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
const f = process.argv[2]
copyFileSync(f, f.replace(/\.json$/, '.truoc-latex.json'))
const ds = JSON.parse(readFileSync(f, 'utf8'))
let n = 0
const va = (s) => {
  let r = s
  r = r.replace(/\to(?![a-z])/g, '\\to').replace(/\text\{/g, '\\text{').replace(/\theta/g, '\\theta')
  for (const l of ['infty', 'dfrac', 'sqrt', 'approx', 'cdot', 'neq', 'geq', 'leq', 'frac', 'pm', 'Rightarrow']) r = r.replace(new RegExp(`(?<![\\\\A-Za-z])${l}(?![A-Za-z])`, 'g'), '\\' + l)
  if (r !== s) n++
  return r
}
const dq = (o) => { for (const k of Object.keys(o)) { if (typeof o[k] === 'string') o[k] = va(o[k]); else if (Array.isArray(o[k])) o[k] = o[k].map((x) => (typeof x === 'string' ? va(x) : (dq(x), x))); else if (o[k] && typeof o[k] === 'object') dq(o[k]) } }
// bỏ qua trường kiem (JS): không vá
for (const q of ds) { const kiem = q.kiem; delete q.kiem; dq(q); if (kiem) q.kiem = kiem }
writeFileSync(f, JSON.stringify(ds, null, 1))
console.log(`đã vá ${n} chuỗi trong ${f.split(/[\\/]/).pop()}`)
