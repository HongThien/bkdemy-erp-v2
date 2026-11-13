// Chuẩn hoá đề lớp 7 cho mcq-auto: dấu '.' nhân → \cdot, \dfrac7{13} → \dfrac{7}{13}. Chỉ ghi ra pool tạm, KHÔNG đụng DB.
import { readFileSync, writeFileSync } from 'node:fs'
import { S } from './lib.mjs'
const BS = String.fromCharCode(92)
const j = JSON.parse(readFileSync(`${S}/pool_k7.json`, 'utf8'))
const chuan = (t) => t.replace(/\$([^$]+)\$/g, (_, m) => {
  let s = m.replace(/\.(?=\s*\S)/g, ` ${BS}cdot `)
  s = s.replace(new RegExp(`${BS}${BS}dfrac(\\d)(\\d)`, 'g'), `${BS}dfrac{$1}{$2}`)
  s = s.replace(new RegExp(`${BS}${BS}dfrac(\\d)\\{`, 'g'), `${BS}dfrac{$1}{`)
  return `$${s}$`
})
let n = 0
for (const c of j.cau) { const t = chuan(c.noi_dung); if (t !== c.noi_dung) n++; c.noi_dung = t }
writeFileSync(`${S}/pool_k7_dot.json`, JSON.stringify(j))
console.log('đã chuẩn hoá', n, 'đề')
