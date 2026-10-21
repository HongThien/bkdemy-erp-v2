import { veHinh } from '../../ve.mjs'
import { readFileSync, writeFileSync } from 'node:fs'
const s = readFileSync(new URL('../../ra/J6.txt', import.meta.url), 'utf8')
let h = '<body style="font-family:sans-serif;background:#fff;color:#111">'
let ma = ''
for (const l of s.split(/\r?\n/)) {
  const m = l.match(/^=== (?:N )?(H[\d.]+)/); if (m) ma = m[1]
  const g = l.match(/^\[\[HINH (.*)\]\]\s*$/)
  if (g) h += `<div style="margin:8px;border:1px solid #ccc;padding:6px;display:inline-block;vertical-align:top"><b>${ma}</b><br>${veHinh(JSON.parse(g[1]))}</div>`
}
writeFileSync(new URL('./hinh.html', import.meta.url), h)
console.log('ok')
