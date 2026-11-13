// chuan-bi-batch.mjs — KHÔNG đọc DB, KHÔNG gọi AI. Dựng thư mục làm việc cho từng đề của 1 batch toanmath (khuôn k9/bo-de/chuan-bi.mjs):
//   <LV>/<MA>/{goc.pdf, trang/p-N.png (150 dpi), img/, tam/, de.boc.json}   với LV = C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/<batch>
//   node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs B001
// Vào: batch/<ma>/ds-de.json — mỗi đề: ma, ten_bai, don_vi, nam, de (trang đề "a-b"), hd (trang hướng dẫn chấm, "" nếu không), tach (bộ nhiều đề).
// goc.pdf: đề đơn = NGUYÊN file (sha256 = file gốc ⇒ do-toanmath.mjs nhận ra bài đã có sau khi ghi) · bộ nhiều đề = chỉ trang của đề đó (sha256 riêng, vì
// ghi.mjs chặn trùng theo sha256). Chạy lại an toàn: đề nào đã có goc.pdf thì bỏ qua.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
const MA = process.argv[2]
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const GOC = process.env.BK_GOC || 'E:/BK ACADEMY/Tài liệu tham khảo'
const KV = `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/${MA}`
const batch = JSON.parse(readFileSync(path.join(HERE, 'batch.json'), 'utf8')).find((b) => b.ma === MA)
const ds = JSON.parse(readFileSync(path.join(HERE, 'batch', MA, 'ds-de.json'), 'utf8'))
const run = (c, a) => execFileSync(c, a, { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 })
let n = 0
for (const d of ds) {
  const LV = path.join(KV, d.ma); if (existsSync(path.join(LV, 'goc.pdf'))) continue
  const bai = batch.bai.find((x) => x.ten_bai === d.ten_bai); if (!bai) throw new Error('không thấy bài trong batch: ' + d.ten_bai)
  const src = path.join(GOC, bai.files.find((f) => /\.pdf$/i.test(f)))
  for (const s of ['trang', 'img', 'tam']) mkdirSync(path.join(LV, s), { recursive: true })
  if (d.tach) { const [a, b] = d.de.split('-').map(Number); run('pdfseparate', ['-f', a, '-l', b || a, src, path.join(LV, 'tam', 'tr-%d.pdf')].map(String))
    const trs = []; for (let p = a; p <= (b || a); p++) trs.push(path.join(LV, 'tam', `tr-${p}.pdf`))
    if (trs.length === 1) copyFileSync(trs[0], path.join(LV, 'goc.pdf')); else run('pdfunite', [...trs, path.join(LV, 'goc.pdf')]) }
  else copyFileSync(src, path.join(LV, 'goc.pdf'))
  run('pdftoppm', ['-r', '150', '-png', path.join(LV, 'goc.pdf'), path.join(LV, 'trang', 'p')])
  const sha = createHash('sha256').update(readFileSync(path.join(LV, 'goc.pdf'))).digest('hex')
  writeFileSync(path.join(LV, 'de.boc.json'), JSON.stringify({ file: `toanmath ${bai.folder}/${d.ten_bai}.pdf${d.tach ? ` (trang ${d.de}) — ${d.tach}` : ''}`, sha256: sha, ten: d.ma, khoi: bai.khoi.slice(1) }, null, 1))
  n++
}
console.log(`✔ ${n} đề mới · tổng ${ds.length} · ${KV}`)
