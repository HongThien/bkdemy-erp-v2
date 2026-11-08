// ghep-dc09.mjs — ghép DC-09a/b/c/d (đã soát) thành MỘT `DC-09.soan.md`, đánh lại số PHẦN liên tục, gộp mục GHI CHÚ.
//   node kho-rules/dai/lo/k7/ghep-dc09.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const parts = ['a', 'b', 'c', 'd']
let head = ''
let body = ''
let notes = ''
let n = 0
for (const p of parts) {
  const md = readFileSync(join(HERE, `DC-09${p}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const iPhan = md.search(/^## PHẦN /m)
  const iGc = md.search(/^## GHI CHÚ/m)
  if (!head) head = md.slice(0, iPhan).trimEnd() + '\n'
  const than = (iGc >= 0 ? md.slice(iPhan, iGc) : md.slice(iPhan)).trimEnd()
  body += '\n' + than.replace(/^## PHẦN \d+ \|/gm, () => `## PHẦN ${++n} |`) + '\n'
  if (iGc >= 0) notes += `\n### Phần DC-09${p}\n` + md.slice(iGc).replace(/^## GHI CHÚ[^\n]*\n/, '').trim() + '\n'
}
const out = head + body + '\n## GHI CHÚ CHO NGƯỜI DUYỆT\n' + notes
writeFileSync(join(HERE, 'DC-09.soan.md'), out)
const nhan = [...out.matchAll(/^### (.+?) \| /gm)].map((m) => m[1])
const trung = nhan.filter((x, i) => nhan.indexOf(x) !== i)
console.log('PHẦN', n, '· câu', nhan.length, '· nhãn trùng:', trung.length ? trung.join(', ') : 'không')
