// Dựng lại mọi hình trong ra/J1.txt → tam/soat-J1/hinh.html (kèm mã dạng + đề để đối chiếu)
import { readFileSync, writeFileSync } from 'node:fs'
import { veHinh, timHinh } from '../../ve.mjs'
const txt = readFileSync(new URL('../../ra/J1.txt', import.meta.url), 'utf8')
let html = '<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;background:#fff;color:#111;max-width:1100px">'
let ma = '', n = 0
for (const khoi of txt.split(/^=== /m)) {
  const m = khoi.match(/^(N )?(H[\d.]+)/); if (!m) continue; ma = m[2]
  const vds = khoi.split('##VD').slice(1)
  vds.forEach((vd, i) => {
    for (const h of timHinh(vd)) {
      n++
      const de = vd.split('Bài giải:')[0].replace(/\[\[HINH.*\]\]/, '').trim()
      html += `<div style="border:1px solid #ccc;margin:10px 0;padding:8px"><b>#${n} ${ma} — ví dụ ${i + 1}</b><div style="font-size:12px;color:#444;white-space:pre-wrap">${de.replace(/</g, '&lt;')}</div>${veHinh(h.sp)}</div>`
    }
  })
}
writeFileSync(new URL('./hinh.html', import.meta.url), html)
console.log('số hình', n)
