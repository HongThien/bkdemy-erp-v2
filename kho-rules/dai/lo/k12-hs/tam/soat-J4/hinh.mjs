import { veHinh } from '../../ve.mjs'
import { readFileSync, writeFileSync } from 'node:fs'
const t = readFileSync(process.argv[2], 'utf8').split('\n')
let ma = '', n = 0, h = '<meta charset=utf-8><body style="font-family:sans-serif;background:#fff;color:#111">'
for (const l of t) { const m = l.match(/^=== (?:N )?(\S+)/); if (m) { ma = m[1]; n = 0 }
  if (l.startsWith('##VD')) n++
  const k = l.match(/\[\[HINH (.*)\]\]/); if (k) h += `<div style="display:inline-block;margin:8px;border:1px solid #ccc;padding:6px;vertical-align:top"><b>${ma} VD${n}</b><br>${veHinh(JSON.parse(k[1]))}</div>` }
writeFileSync(process.argv[3], h); console.log('ok')
