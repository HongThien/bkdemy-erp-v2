// ds-de-k8.mjs — dựng batch/<ma>/ds-de.json cho các batch ĐỀ THI khối 8 (B012, B064–B068) + chép PDF vào thư mục gốc BK_GOC (K8\Đề thi\<GKI|GKII|CKI|CKII>\…).
// Nguồn PDF: Downloads\<GKI|GKII|CKI|CKII> (không có K8\Đề thi như máy công ty). Dò trang đề / trang đáp án bằng pdftotext (trạm soạn kiểm lại bằng ảnh).
//   BK_GOC=C:/Users/Admin/bk-kho-lam-viec/_goc/K8 node kho-rules/dai/lo/toanmath/ds-de-k8.mjs B066 [B067 …]
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const GOC = process.env.BK_GOC; if (!GOC) { console.error('Thiếu BK_GOC'); process.exit(2) }
const SRC = process.env.BK_DL || 'C:/Users/Admin/Downloads'
const batches = JSON.parse(fs.readFileSync(path.join(HERE, 'batch.json'), 'utf8'))
const txt = (f, p) => { try { return execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', '-f', String(p), '-l', String(p), f, '-'], { maxBuffer: 1 << 26 }).toString('utf8') } catch { return '' } }
for (const MA of process.argv.slice(2)) {
  const b = batches.find((x) => x.ma === MA); if (!b) throw new Error('không có batch ' + MA)
  const out = []; let n = 0
  for (const a of b.bai) {
    n++
    const rel = a.files.find((f) => /\.pdf$/i.test(f)); const parts = rel.split('\\'); const fold = parts[parts.length - 2]; const name = parts[parts.length - 1]
    let from = path.join(SRC, fold, name)
    if (!fs.existsSync(from)) { for (const f of ['GKI', 'GKII', 'CKI', 'CKII']) if (fs.existsSync(path.join(SRC, f, name))) from = path.join(SRC, f, name) }
    if (!fs.existsSync(from)) { console.error('THIẾU file nguồn', MA, name); continue }
    const dest = path.join(GOC, rel.replace(/\\/g, '/')); fs.mkdirSync(path.dirname(dest), { recursive: true }); if (!fs.existsSync(dest)) fs.copyFileSync(from, dest)
    const info = execFileSync('pdfinfo', [from]).toString(); const np = +(info.match(/Pages:\s+(\d+)/)?.[1] || 1)
    let chars = 0, hd = 0
    for (let p = 1; p <= np; p++) { const t = txt(from, p); chars += t.length; if (!hd && p >= 2 && /(hướng dẫn chấm|đáp án|biểu điểm|HƯỚNG DẪN|lời giải)/i.test(t.split('\n').slice(0, 14).join(' '))) hd = p }
    const slug = a.ten_bai; const nam = +(slug.match(/nam-(\d{4})-\d{4}/)?.[1] || 0)
    const dv = slug.replace(/^.*?(?:nam-\d{4}-\d{4}-)/, '').replace(/-ha-noi$/, '').replace(/-/g, ' ')
    const co_chu = chars > 1500
    out.push({ ma: `${MA}-${String(n).padStart(2, '0')}`, ten_bai: slug, don_vi: dv, nam, loai: 'de_thi', ky: fold, de: hd ? `1-${hd - 1}` : `1-${np}`, hd: hd ? `${hd}-${np}` : '', co_chu, ghi_chu: co_chu ? 'trang đề/đáp án dò tự động — trạm kiểm lại' : 'SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án' })
  }
  fs.mkdirSync(path.join(HERE, 'batch', MA), { recursive: true })
  fs.writeFileSync(path.join(HERE, 'batch', MA, 'ds-de.json'), '[\n' + out.map((o) => ' ' + JSON.stringify(o)).join(',\n') + '\n]\n')
  console.log('✔', MA, out.length, 'đề ·', out.filter((o) => !o.co_chu).length, 'scan')
}
