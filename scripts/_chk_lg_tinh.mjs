// Đối chiếu DÒNG CUỐI lời giải với đáp số (máy hoặc tay) — bắt lỗi chép/lệch giữa lời giải và đáp số.
import { readFileSync } from 'node:fs'
import { parseHuuTi } from './lib/huuti.mjs'
import { tinh } from './mcq-auto.mjs'
const j = JSON.parse(readFileSync('scripts/mcq-lo/tinh-docx-lop7.json', 'utf8'))
let bad = 0, n = 0
for (const q of j.cau) {
  if (q.trung) continue
  n++
  const last = q.lg.split('\n').pop()
  const may = tinh(q.nd)
  const ref = may.ok ? may.canon : q.da ? parseHuuTi(q.da).canon : null
  // lấy phần sau dấu "=" hoặc "\in" cuối cùng
  let s = last.replace(/\\left\\\{|\\right\\\}|\\in/g, ' ')
  const i = Math.max(s.lastIndexOf('='), s.lastIndexOf('  '))
  s = s.slice(i + 1).replace(/\$/g, '').trim()
  const l = parseHuuTi(s)
  if (!l.ok || l.canon !== ref) { bad++; console.log('KHÁC', q.stt, '| cuối lg:', JSON.stringify(last), '→', l.ok ? l.canon : l.ly_do, '| đáp số:', ref) }
}
console.log(`${n} câu · dòng cuối lời giải ≠ đáp số: ${bad}`)
