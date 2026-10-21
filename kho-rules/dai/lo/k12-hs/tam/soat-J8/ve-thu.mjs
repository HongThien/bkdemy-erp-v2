import { veHinh } from '../../ve.mjs'
import { readFileSync, writeFileSync } from 'node:fs'
const s = readFileSync(new URL('../../ra/J8.txt', import.meta.url), 'utf8')
let h = '<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;background:#fff;color:#111">'
let ma = '', n = 0
for (const l of s.split(/\r?\n/)) {
  const m = l.match(/^=== (?:N )?(H[\d.]+)/); if (m) ma = m[1]
  const g = l.match(/^\[\[HINH (.*)\]\]\s*$/)
  if (g) { n++; h += `<div style="margin:8px;border:1px solid #ccc;padding:6px;display:inline-block;vertical-align:top"><b>${ma} — hình ${n}</b><br>${veHinh(JSON.parse(g[1]))}</div>` }
}
writeFileSync(new URL('./hinh.html', import.meta.url), h)
console.log('ok', n)
