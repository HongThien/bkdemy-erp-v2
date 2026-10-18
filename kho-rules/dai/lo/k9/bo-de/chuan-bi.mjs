// chuan-bi.mjs — tách BO_DE_GKI_9_24MB.pdf thành từng đề: <LV>/GKI-NN/{goc.pdf, trang/p-N.png (150 dpi), img/, tam/, de.boc.json}
//   node kho-rules/dai/lo/k9/bo-de/chuan-bi.mjs            (chạy lại an toàn: đề nào đã có goc.pdf thì bỏ qua)
// Không dùng Gemini (boc-pdf): đề K9 này toàn bản scan, trạm soạn gõ lại từ ảnh trang. `de.boc.json` chỉ giữ file + sha256 cho dung-de-tu-soan / ghi.mjs.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const GOC = 'C:/Users/WBPC/bk-kho-lam-viec/de-thi/K9-bo-de/goc-bo.pdf'
const KV = 'C:/Users/WBPC/bk-kho-lam-viec/de-thi/K9'
const ds = JSON.parse(readFileSync(join(HERE, 'ds-de.json'), 'utf8'))
const run = (c, a) => execFileSync(c, a, { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 })
const tmp = join(KV, '_tach'); mkdirSync(tmp, { recursive: true })
run('pdfseparate', [GOC, join(tmp, 'tr-%d.pdf')])
let n = 0
for (const d of ds) {
  const LV = join(KV, d.ma)
  if (existsSync(join(LV, 'goc.pdf'))) continue
  for (const s of ['trang', 'img', 'tam']) mkdirSync(join(LV, s), { recursive: true })
  const trs = []; for (let p = d.tu; p <= d.den; p++) trs.push(join(tmp, `tr-${p}.pdf`))
  if (trs.length === 1) writeFileSync(join(LV, 'goc.pdf'), readFileSync(trs[0]))
  else run('pdfunite', [...trs, join(LV, 'goc.pdf')])
  run('pdftoppm', ['-r', '150', '-png', join(LV, 'goc.pdf'), join(LV, 'trang', 'p')])
  const sha = createHash('sha256').update(readFileSync(join(LV, 'goc.pdf'))).digest('hex')
  writeFileSync(join(LV, 'de.boc.json'), JSON.stringify({ file: `BO_DE_GKI_9_24MB.pdf (trang ${d.tu}–${d.den}) — ${d.ma}`, sha256: sha, ten: d.ma, khoi: '9' }, null, 1))
  n++
}
console.log(`✔ ${n} đề mới · tổng ${ds.length} · ${readdirSync(KV).filter((x) => x.startsWith('GKI-')).length} thư mục`)
