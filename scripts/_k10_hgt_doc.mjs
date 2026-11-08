// Đọc dữ liệu nhúng trong reports/bdm-hgt-k10-de-xuat-2026-10-21.html (đề xuất xếp câu HGT K10 của phiên trước) ra JSON.
import fs from 'node:fs'
const s = fs.readFileSync('reports/bdm-hgt-k10-de-xuat-2026-10-21.html', 'utf8')
const i = s.indexOf('const D=') + 8
let d = 0, k = i, str = false, esc = false
for (; k < s.length; k++) {
  const ch = s[k]
  if (str) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') str = false }
  else if (ch === '"') str = true
  else if (ch === '{') d++
  else if (ch === '}') { d--; if (d === 0) { k++; break } }
}
const D = JSON.parse(s.slice(i, k))
fs.writeFileSync(process.argv[2], JSON.stringify(D))
console.log(Object.keys(D))
for (const key of Object.keys(D)) {
  const v = D[key]
  console.log(key, Array.isArray(v) ? 'array ' + v.length : typeof v, Array.isArray(v) && v[0] ? JSON.stringify(v[0]).slice(0, 500) : '')
}
