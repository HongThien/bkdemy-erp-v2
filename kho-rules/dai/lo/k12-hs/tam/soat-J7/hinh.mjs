import fs from 'node:fs'
import { timHinh, veHinh } from '../../ve.mjs'
const s = fs.readFileSync(new URL('../../ra/J7.txt', import.meta.url), 'utf8')
let html = '<!doctype html><meta charset="utf-8"><style>body{font-family:sans-serif;background:#fff;color:#111}div{display:inline-block;margin:8px;border:1px solid #ccc;padding:4px;vertical-align:top}</style>'
let ma = '', i = 0
for (const line of s.split('\n')) {
  const m = line.match(/^=== (?:N )?(H[\d.]+)/); if (m) ma = m[1]
  for (const h of timHinh(line)) { i++; html += `<div><b>#${i} ${ma}</b><br>${veHinh(h.sp)}</div>` }
}
fs.writeFileSync(new URL('./hinh.html', import.meta.url), html)
console.log('so hinh', i)
