// ghep-brief.mjs — dựng brief SOẠN/SOÁT cho 1 batch toanmath = đầu riêng của batch (batch/<ma>/_dau-brief.md) + brief gốc đã chạy thật
// (khuôn _ghep-brief.mjs của k9/bo-de: chỉ đổi đường dẫn, không viết lại luật).
//   node kho-rules/dai/lo/toanmath/ghep-brief.mjs B001 k9-cki
// Ra: batch/<ma>/brief-soan.md, batch/<ma>/brief-soat.md
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
const [MA, GOC] = process.argv.slice(2)
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const LO = path.resolve(HERE, '..')
const dau = readFileSync(path.join(HERE, 'batch', MA, '_dau-brief.md'), 'utf8').replace(/\r\n/g, '\n')
const MAP = { 'k9-cki': { lo: ['lo\\k9\\cki\\', 'lo/k9/cki/'], lv: ['K9-cki\\', 'K9-cki/'] } }[GOC]
for (const kind of ['soan', 'soat']) {
  let s = readFileSync(path.join(LO, `${GOC}-brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n')
  s = s.replaceAll(MAP.lo[0], `lo\\toanmath\\batch\\${MA}\\`).replaceAll(MAP.lo[1], `lo/toanmath/batch/${MA}/`)
    .replaceAll(MAP.lv[0], `toanmath\\${MA}\\`).replaceAll(MAP.lv[1], `toanmath/${MA}/`)
    .replaceAll(`lo\\${GOC}-brief-soan.md`, `lo\\toanmath\\batch\\${MA}\\brief-soan.md`).replaceAll(`lo/${GOC}-brief-soan.md`, `lo/toanmath/batch/${MA}/brief-soan.md`)
  writeFileSync(path.join(HERE, 'batch', MA, `brief-${kind}.md`), dau + '\n---\n\n' + s)
}
console.log(`✔ batch/${MA}/brief-soan.md, brief-soat.md (gốc ${GOC})`)
