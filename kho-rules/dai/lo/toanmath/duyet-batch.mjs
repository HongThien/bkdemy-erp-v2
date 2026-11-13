// duyet-batch.mjs — KHÔNG đọc DB. Dựng MỘT trang HTML để Thùy duyệt cả batch (luật duyệt 10/10 + 14/10: ảnh gốc + đề + lời giải).
//   node kho-rules/dai/lo/toanmath/duyet-batch.mjs B001     → kho-rules/dai/lo/toanmath/batch/B001/duyet-B001.html
// Đầu trang: số liệu batch (tong-hop.json) + danh sách "CẦN THÙY QUYẾT" (mọi câu còn **Chưa chắc:**). Mỗi đề: ảnh trang ĐỀ gốc (chỉ trang de),
// kết luận soát, từng câu: đề · hình · đáp án · ghi chú · lời giải Phần 2 + hình giải. Công thức dựng MathML bằng katex (không tải gì từ ngoài).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
const MA = process.argv[2]
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(HERE, '../../../..')
const katex = createRequire(path.join(ROOT, 'package.json'))('katex')
const D = path.join(HERE, 'batch', MA), KV = `${process.env.BK_LV || "C:/Users/WBPC/bk-kho-lam-viec"}/de-thi/toanmath/${MA}`
const ds = JSON.parse(readFileSync(path.join(D, 'ds-de.json'), 'utf8'))
const th = existsSync(path.join(D, 'tong-hop.json')) ? JSON.parse(readFileSync(path.join(D, 'tong-hop.json'), 'utf8')) : null
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toi = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, m) => {
  try { return katex.renderToString(m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'), { output: 'mathml', throwOnError: false }) } catch { return m }
}).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const doan = (t) => t.split(/\n{2,}/).filter((x) => x.trim()).map((x) => `<p>${toi(x.trim())}</p>`).join('')
const anh = (ma, f) => { const p = path.join(KV, ma, 'img', f); return existsSync(p) ? `<img class="hinh" alt="${esc(f)}" src="data:image/png;base64,${readFileSync(p).toString('base64')}">` : `<p class="loi">thiếu hình ${esc(f)}</p>` }
const trangDe = (d) => { const [a, b] = (d.tach ? '1-' + (d.de.includes('-') ? 2 : 1) : d.de).split('-').map(Number); const out = []
  for (let p = a; p <= (b || a); p++) { try { const buf = execFileSync('pdftoppm', ['-r', '80', '-jpeg', '-jpegopt', 'quality=60', '-singlefile', '-f', String(p), '-l', String(p), path.join(KV, d.ma, 'goc.pdf')], { maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] })
    out.push(`<img loading="lazy" alt="trang ${p}" src="data:image/jpeg;base64,${buf.toString('base64')}">`) } catch { break } }
  return out.join('') }

const quyet = [], khoi = []
for (const d of ds) {
  const f = path.join(D, `${d.ma}.soan.md`); if (!existsSync(f)) continue
  const md = readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
  const ten = (md.match(/^# ĐỀ \| (.+)$/m) || [])[1] || d.ma
  const iGc = md.search(/^## GHI CHÚ CHO NGƯỜI DUYỆT/m), gc = iGc >= 0 ? md.slice(iGc).replace(/^## [^\n]*\n/, '') : ''
  const soat = existsSync(path.join(D, `${d.ma}.soat.md`)) ? (/KẾT LUẬN:\s*ĐẠT/.test(readFileSync(path.join(D, `${d.ma}.soat.md`), 'utf8')) ? '<span class="dat">Soát: ĐẠT</span>' : '<span class="loi">Soát: KHÔNG ĐẠT</span>') : '<span class="loi">chưa soát</span>'
  const cs = []
  for (const kc of (iGc >= 0 ? md.slice(0, iGc) : md).split(/^(?=### )/m).slice(1)) {
    const [nhan, ...meta] = kc.split('\n')[0].replace(/^### /, '').split(' | ')
    const mm = Object.fromEntries(meta.map((x) => x.split('=')))
    const truoc = kc.split('**Phần 1. Hướng dẫn**')[0]
    const de = truoc.match(/\*\*Đề:\*\*([\s\S]*?)(?=\n\*\*(Hình|Hình giải|Ghi chú|Chưa chắc)|$)/)?.[1]?.trim() ?? ''
    const hinh = [...truoc.matchAll(/^\*\*Hình:\*\*\s*(.+)$/gm)].flatMap((m) => m[1].split(',').map((s) => s.trim()))
    const hg = [...truoc.matchAll(/^\*\*Hình giải:\*\*\s*(.+)$/gm)].flatMap((m) => m[1].split(',').map((s) => s.trim()))
    const ghi = [...truoc.matchAll(/^\*\*Ghi chú:\*\*\s*(.+)$/gm)].map((m) => m[1])
    const cc = [...truoc.matchAll(/^\*\*Chưa chắc:\*\*\s*(.+)$/gm)].map((m) => m[1])
    const tt = kc.split('**Phần 2. Trình bày**')[1]?.trim() ?? ''
    const id = `${d.ma}-${nhan.replace(/[^\w.]+/g, '')}`
    if (cc.length) quyet.push(`<li><a href="#${id}">${esc(d.ma)} ${esc(nhan)}</a> — ${toi(cc.join(' · '))}</li>`)
    cs.push(`<div class="cau${cc.length ? ' cc' : ''}" id="${id}"><h3>${esc(nhan)} <small>${esc(mm.kho)} · ${esc(mm.loai)}${mm.dap_an && mm.dap_an !== '—' ? ' · đáp án <b>' + esc(mm.dap_an) + '</b>' : ''}</small></h3>
<div class="dd">${toi(de)}</div>${hinh.map((x) => anh(d.ma, x)).join('')}
${ghi.map((x) => `<div class="ghi">Ghi chú: ${toi(x)}</div>`).join('')}${cc.map((x) => `<div class="viec">⚠ Chưa chắc: ${toi(x)}</div>`).join('')}
<details><summary>Lời giải (Phần 2)</summary><div class="gi">${doan(tt)}${hg.map((x) => anh(d.ma, x)).join('')}</div></details></div>`)
  }
  khoi.push(`<section class="de" id="${d.ma}"><h2>${esc(d.ma)} — ${toi(ten)}</h2><p class="meta">${soat} · ${cs.length} câu · ${d.hd ? 'có hướng dẫn chấm' : 'không có hướng dẫn chấm'}</p>
<details class="anh"><summary>Ảnh đề gốc</summary>${trangDe(d)}</details>
${gc.trim() ? `<details><summary>Ghi chú cho người duyệt</summary><div class="gi">${doan(gc)}</div></details>` : ''}
${cs.join('\n')}</section>`)
}
const T = th?.tong
const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt ${MA}</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--nhan:#2D9CDB;--cb:#b45309;--ok:#15803d}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1f2937;--chu:#e5e7eb;--mo:#9ca3af;--vien:#374151;--nhan:#56b4ee;--cb:#fbbf24;--ok:#4ade80}}
body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.55 system-ui,"Segoe UI",sans-serif}
main{max-width:920px;margin:0 auto;padding:16px}h1{font-size:1.3rem}
.box,.de{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 16px;margin:0 0 16px}
.de h2{font-size:1.02rem;margin:0 0 4px;color:var(--nhan)}.meta{color:var(--mo);margin:0 0 6px}h3 small{color:var(--mo);font-weight:400}
.cau{border-top:1px solid var(--vien);padding:8px 0}.cau h3{font-size:.98rem;margin:4px 0}.cc{background:rgba(180,83,9,.05)}
.anh img,.hinh{max-width:100%;border:1px solid var(--vien);border-radius:8px;margin:6px 0;display:block}.hinh{max-height:320px;width:auto}
.viec{border-left:4px solid var(--cb);padding:5px 10px;margin:6px 0}.ghi{color:var(--mo);font-size:.94em;margin:4px 0}
.dat{color:var(--ok);font-weight:600}.loi{color:#dc2626;font-weight:600}details{margin-top:6px}summary{cursor:pointer;color:var(--mo)}.gi p{margin:6px 0}
table{border-collapse:collapse}td,th{padding:3px 10px;border-bottom:1px solid var(--vien);text-align:left}
</style><main>
<h1>Duyệt ${MA} — ${esc(JSON.parse(readFileSync(path.join(HERE, 'batch.json'), 'utf8')).find((b) => b.ma === MA).ten)}</h1>
${T ? `<div class="box"><table><tr><td>Đề</td><td><b>${T.de}</b> (soạn ${T.soan} · soát ${T.soat} · ĐẠT ${T.dat} · soát có sửa ${T.sua})</td></tr>
<tr><td>Câu</td><td><b>${T.cau}</b> (${Object.entries(T.loai).map(([k, v]) => `${k} ${v}`).join(' · ')}) · Hình ${T.hinh}</td></tr>
<tr><td>Đề có hướng dẫn chấm</td><td>${T.co_hd}</td></tr><tr><td>Câu Chưa chắc</td><td>${T.chua_chac.length}</td></tr></table></div>` : ''}
<div class="box"><h2>Cần Thùy quyết (${quyet.length})</h2><ol>${quyet.join('')}</ol></div>
${khoi.join('\n')}</main></html>`
const out = path.join(D, `duyet-${MA}.html`); writeFileSync(out, html)
console.log(`✔ ${out} — ${khoi.length} đề · ${quyet.length} chỗ quyết · ${(html.length / 1048576).toFixed(1)} MB`)
