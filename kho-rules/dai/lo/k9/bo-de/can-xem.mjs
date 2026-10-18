// can-xem.mjs — trang xem cho CEO: mọi câu của bộ đề GKI Toán 9 còn "Chưa chắc" (kèm ảnh trang đề gốc, đề, lời giải đang trong kho).
//   node kho-rules/dai/lo/k9/bo-de/can-xem.mjs      → kho-rules/dai/k9-bo-de-can-xem.html
// Nguồn: kho-rules/dai/lo/k9/bo-de/GKI-NN.soan.md (bản đã soát = bản đã ghi kho). Công thức dựng MathML bằng katex ⇒ không tải gì từ ngoài.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const HERE = dirname(fileURLToPath(import.meta.url)), GOC = join(HERE, '../../../../..')
const katex = createRequire(join(GOC, 'package.json'))('katex')
const KV = 'C:/Users/WBPC/bk-kho-lam-viec/de-thi/K9'
const ds = JSON.parse(readFileSync(join(HERE, 'ds-de.json'), 'utf8'))
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toi = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, m) => {
  try { return katex.renderToString(m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'), { output: 'mathml', throwOnError: false }) } catch { return m }
}).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')

const trang = (ma) => {
  const out = []
  for (let p = 1; p <= 3; p++) {
    try {
      const buf = execFileSync('pdftoppm', ['-r', '75', '-jpeg', '-jpegopt', 'quality=60', '-singlefile', '-f', String(p), '-l', String(p), join(KV, ma, 'goc.pdf')], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] })
      if (buf.length > 1000) out.push(`<img loading="lazy" alt="trang ${p}" src="data:image/jpeg;base64,${buf.toString('base64')}">`)
    } catch { break }
  }
  return out.join('')
}

let tong = 0, soDe = 0
const khoi = []
for (const d of ds) {
  const md = readFileSync(join(HERE, `${d.ma}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const dau = md.search(/^## GHI CHÚ/m)
  const than = dau >= 0 ? md.slice(0, dau) : md
  const cs = []
  for (const kc of than.split(/^(?=### )/m).slice(1)) {
    const nhan = kc.split('\n')[0].replace(/^### /, '').split(' | ')
    const cc = [...kc.matchAll(/^\*\*Chưa chắc:\*\*\s*(.+)$/gm)].map((m) => m[1])
    if (!cc.length) continue
    const de = kc.match(/\*\*Đề:\*\*([\s\S]*?)(?=\n\*\*(Hình|Hình giải|Ghi chú|Chưa chắc|Phần 1)|\n\n)/)?.[1]?.trim() ?? ''
    const tt = kc.split('**Phần 2. Trình bày**')[1]?.trim() ?? ''
    cs.push({ nhan: nhan[0], meta: nhan.slice(1).join(' · '), de, cc, tt })
  }
  if (!cs.length) continue
  soDe++; tong += cs.length
  khoi.push(`<section class="de" id="${d.ma}"><h2>${esc(d.ma)} — ${esc(d.truong)} · ${esc(d.nam)}${d.ghi ? ' · ' + esc(d.ghi) : ''} <small>(PDF gốc trang ${d.tu}–${d.den})</small></h2>
<details class="anh"><summary>Xem ảnh đề gốc</summary>${trang(d.ma)}</details>
${cs.map((c) => `<div class="cau"><h3>${esc(c.nhan)} <small>${esc(c.meta)}</small></h3>
<div class="dd">${toi(c.de)}</div>
${c.cc.map((x) => `<div class="viec">${toi(x)}</div>`).join('')}
<details><summary>Lời giải đang trong kho (Phần 2)</summary><div class="gi">${c.tt.split(/\n\n+/).map((p) => `<p>${toi(p)}</p>`).join('')}</div></details></div>`).join('\n')}
</section>`)
}

const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bộ đề GKI Toán 9 — câu cần xem</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--nhan:#2D9CDB;--cb:#b45309}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1f2937;--chu:#e5e7eb;--mo:#9ca3af;--vien:#374151;--nhan:#56b4ee;--cb:#fbbf24}}
body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.55 system-ui,"Segoe UI",sans-serif}
main{max-width:900px;margin:0 auto;padding:16px}
h1{font-size:1.3rem}.sub{color:var(--mo);margin:-8px 0 16px}
.de{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 16px;margin:0 0 16px}
.de h2{font-size:1.02rem;margin:0 0 8px;color:var(--nhan)}h2 small,h3 small{color:var(--mo);font-weight:400}
.de h3{font-size:.98rem;margin:12px 0 4px}
.anh img{max-width:100%;border:1px solid var(--vien);border-radius:8px;margin:6px 0;display:block}
.dd{margin:4px 0}.viec{border-left:4px solid var(--cb);padding:5px 10px;background:rgba(180,83,9,.07);margin:6px 0}
details{margin-top:6px}summary{cursor:pointer;color:var(--mo)}.gi p{margin:6px 0}
math{font-size:1.05em}
</style><main>
<h1>Bộ đề giữa kì 1 Toán 9 — các câu còn "Chưa chắc"</h1>
<p class="sub">${soDe} đề · ${tong} câu. 58 đề / 531 câu đã vào Kho đề thi (dạng chờ duyệt); câu Hình ở dạng <b>HH00140 Ôn thi giữa kì I</b>. Mỗi thẻ: đề + điều chưa chắc + lời giải đang trong kho; mở "ảnh đề gốc" để đối chiếu.</p>
${khoi.join('\n')}
</main></html>`
const out = join(GOC, 'kho-rules', 'dai', 'k9-bo-de-can-xem.html')
writeFileSync(out, html)
console.log(`✔ ${out} — ${soDe} đề · ${tong} câu · ${(html.length / 1048576).toFixed(1)} MB`)
