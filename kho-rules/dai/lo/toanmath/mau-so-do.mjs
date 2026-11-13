// mau-so-do.mjs — trang MẪU sơ đồ tư duy (Thùy 14/11): gom vài câu Hình đã có khối "**Sơ đồ tư duy**" thành một trang để duyệt.
//   BK_LV=C:/Users/Admin/bk-kho-lam-viec node kho-rules/dai/lo/toanmath/mau-so-do.mjs "B010/B010-12:Câu 4.2" "B011/B011-06:Bài 4" …
// Ra: kho-rules/dai/lo/toanmath/mau-so-do-tu-duy.html (không đọc DB).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { docKhoiSoDo, htmlSoDo, htmlDoanLoiGiai, CSS_SO_DO } from './so-do-html.mjs'
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const katex = createRequire(path.join(path.resolve(HERE, '../../../..'), 'package.json'))('katex')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toi = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, m) => {
  try { return katex.renderToString(m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'), { output: 'mathml', throwOnError: false }) } catch { return m }
}).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const LV = `${process.env.BK_LV || 'C:/Users/WBPC/bk-kho-lam-viec'}/de-thi/toanmath`
const out = []
for (const a of process.argv.slice(2)) {
  const [tep, nhan] = a.split(':'), [batch, ma] = tep.split('/')
  const md = readFileSync(path.join(HERE, 'batch', batch, `${ma}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const ten = (md.match(/^# ĐỀ \| (.+)$/m) || [])[1] || ma
  const kc = md.split(/^(?=### )/m).find((k) => k.startsWith(`### ${nhan} |`))
  if (!kc) throw new Error(`không thấy ${a}`)
  const sd = docKhoiSoDo(kc); if (!sd) throw new Error(`${a} chưa có sơ đồ tư duy`)
  const truoc = kc.split('**Sơ đồ tư duy**')[0]
  const de = truoc.match(/\*\*Đề:\*\*([\s\S]*?)(?=\n\*\*(Hình|Hình giải|Ghi chú|Chưa chắc)|$)/)?.[1]?.trim() ?? ''
  const hg = [...truoc.matchAll(/^\*\*Hình giải:\*\*\s*(.+)$/gm)].flatMap((m) => m[1].split(',').map((s) => s.trim()))
  const anh = hg.map((f) => { const p = path.join(LV, batch, ma, 'img', f); return existsSync(p) ? `<img class="hinh" alt="hình giải" src="data:image/png;base64,${readFileSync(p).toString('base64')}">` : '' }).join('')
  const tt = kc.split('**Phần 2. Trình bày**')[1].trim()
  out.push(`<section class="de"><h2>${esc(ma)} · ${esc(nhan)}</h2><p class="meta">${toi(ten)}</p><div class="dd">${toi(de)}</div>${anh}
${htmlSoDo(sd, toi, ma.replace(/\W/g, '') + nhan.replace(/\W/g, ''))}<h3>Lời giải chi tiết</h3><div class="gi">${htmlDoanLoiGiai(tt, sd, toi)}</div></section>`)
}
const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mẫu sơ đồ tư duy</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--nhan:#2D9CDB;--cb:#b45309;--ok:#15803d}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1f2937;--chu:#e5e7eb;--mo:#9ca3af;--vien:#374151;--nhan:#56b4ee;--cb:#fbbf24;--ok:#4ade80}}
body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.55 system-ui,"Segoe UI",sans-serif}
main{max-width:920px;margin:0 auto;padding:16px}h1{font-size:1.3rem}
.de{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 16px;margin:0 0 16px}
.de h2{font-size:1.05rem;margin:0;color:var(--nhan)}.meta{color:var(--mo);margin:2px 0 8px}h3{font-size:1rem;margin:14px 0 4px}
.hinh{max-width:100%;max-height:320px;border:1px solid var(--vien);border-radius:8px;margin:6px 0;display:block}.gi p{margin:6px 0}
${CSS_SO_DO}
</style><main><h1>Mẫu sơ đồ tư duy — ${out.length} câu Hình</h1>
<p class="meta">Sơ đồ lưu riêng, ẩn mặc định (bấm "Xem sơ đồ tư duy"). Lời giải chi tiết chia khúc theo sơ đồ xuôi, mỗi khúc mở bằng dải ghi số ô và mốc của khúc đó.</p>
${out.join('\n')}</main></html>`
const f = path.join(HERE, 'mau-so-do-tu-duy.html'); writeFileSync(f, html)
console.log(`✔ ${f} — ${out.length} câu`)
