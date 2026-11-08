// Trích "nhân chứng" (T Từ Tâm · N NBV · P PNL · Đ đề thi) của từng dạng v1 từ bản đề xuất đầu (md) → in JSON. CHỈ ĐỌC.
import { readFileSync } from 'node:fs'
const md = readFileSync('kho-rules/dai/ban-do-moi-k12-ham-so-de-xuat.md', 'utf8').replace(/\r\n/g, '\n')
const kq = {}
for (const l of md.split('\n')) {
  const m = l.match(/^-\s+D(\d+(?:\.\d+){2})\s+(.*)$/)
  if (!m) continue
  const rest = m[2]
  const tags = [...rest.matchAll(/\(([^()]*)\)\s*$/g)].map((x) => x[1]).pop() ?? ''
  const set = new Set([...tags.replace(/[;,]/g, ' ').split(/\s+/)].filter((t) => /^[TNPĐ]$/.test(t)))
  kq['H' + m[1]] = { nhan_chung: [...set].join(''), mot_nguon: /⚠/.test(rest) }
}
console.log(Object.keys(kq).length, 'dạng v1 có nhân chứng')
console.log(JSON.stringify(kq))
