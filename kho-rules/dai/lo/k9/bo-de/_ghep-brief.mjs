// _ghep-brief.mjs — dựng kho-rules/dai/lo/k9-bo-de-brief-{soan,soat}.md = _dau-brief.md + brief khối 8 đã đổi tên khối / đường dẫn.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url)), LO = join(HERE, '..', '..')
const dau = readFileSync(join(HERE, '_dau-brief.md'), 'utf8').replace(/\r\n/g, '\n')
for (const kind of ['soan', 'soat']) {
  let s = readFileSync(join(LO, `k8-brief-${kind}.md`), 'utf8').replace(/\r\n/g, '\n')
  if (kind === 'soan') {
    const i = s.indexOf('- **Kiến thức (luật quan trọng nhất của khối 8'), j = s.indexOf('## 5. Tự kiểm trước khi nộp')
    s = s.slice(0, i) + '- **Kiến thức:** xem khối "BẢN ÁP DỤNG KHỐI 9" ở đầu tệp (thay hoàn toàn luật khối 8).\n\n' + s.slice(j)
  }
  s = s.replaceAll('K8', 'K9').replaceAll('k8.md', 'k9.md').replaceAll('lo\\k8\\', 'lo\\k9\\bo-de\\').replaceAll('kho-rules/dai/lo/k8/', 'kho-rules/dai/lo/k9/bo-de/')
    .replaceAll('--khoi 8', '--khoi 9').replaceAll('Toán 8', 'Toán 9').replaceAll('khối 8', 'khối 9').replaceAll('lớp 8', 'lớp 9')
    .replaceAll('lo/k8-brief', 'lo/k9-bo-de-brief').replaceAll('lo\\k8-brief', 'lo\\k9-bo-de-brief')
  s = s.replaceAll('lo\\k9\\bo-de\\GKI-01.soan.md', 'lo\\k8\\GKI-01.soan.md')
  writeFileSync(join(LO, `k9-bo-de-brief-${kind}.md`), dau + s)
}
console.log('✔ k9-bo-de-brief-soan.md, k9-bo-de-brief-soat.md')
