// duyet.mjs — dựng trang HTML để CEO duyệt lý thuyết + ví dụ của bản đồ mới khối 9 (luật duyệt: mọi lô phải kèm HTML xem được).
//   node kho-rules/dai/lo/k9/ban-do/duyet.mjs            → kho-rules/dai/k9-ban-do-moi-duyet.html
// Đọc: <LV>/dang.json (cây + mô tả + lý thuyết đang có) · <LV>/ra/A*.txt (bản đã soát) · mục "GHI CHÚ CHO CEO" cuối tệp soạn + "Cần CEO xem" của biên bản soát.
// Hiển thị theo đúng luật render của app (src/lib/lythuyetBlocks.ts): đoạn ##TC / ##PP (mỗi dòng một bước) / ##CY / ##VD (đề trong khung, "Bài giải:" ngoài khung).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { docTep } from './kiem.mjs'

const katex = createRequire('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/package.json')('katex')
const LV = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k9'
const DIR = dirname(fileURLToPath(import.meta.url))
const dang = JSON.parse(readFileSync(join(LV, 'dang.json'), 'utf8'))
const tepRa = readdirSync(join(LV, 'ra')).filter((f) => /^A\d+\.txt$/.test(f)).sort()
const moi = Object.fromEntries(tepRa.flatMap((f) => docTep(readFileSync(join(LV, 'ra', f), 'utf8')).map((k) => [k.id, { ...k, tep: f }])))

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (t) => { try { return katex.renderToString(t, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(t)}</code>` } }
const dong = (s) => esc(s).replace(/\$\$([^$]+)\$\$/g, (_, t) => toan(t)).replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
const NHAN = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp', CY: 'Chú ý', DN: 'Định nghĩa', DL: 'Định lý', NX: 'Nhận xét' }
function noiDung(text) {
  let soVd = 0
  return (text || '').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean).map((d) => {
    const m = d.match(/^##(TC|PP|CY|DN|DL|ĐN|ĐL|NX|VD|BT)[ \t]*([^\n]*)\n?([\s\S]*)$/)
    if (!m) {
      if (/^(\*\*)?(Bài giải|Lời giải|Giải)\s*[:.]?(\*\*)?\s*(\n|$)/.test(d)) return `<div class="giai"><div class="nhan-giai">Bài giải:</div>${d.split('\n').slice(1).map((x) => `<div>${dong(x)}</div>`).join('')}</div>`
      return `<p>${d.split('\n').map(dong).join('<br>')}</p>`
    }
    const [, k, td, than] = m
    if (k === 'VD') { soVd++; return `<div class="khung vd"><span class="tag">Ví dụ ${soVd}</span>${than.split('\n').map((x) => `<div>${dong(x)}</div>`).join('')}</div>` }
    if (k === 'PP') return `<div class="khung pp"><span class="tag">${esc(td || NHAN.PP)}</span><ol>${than.split('\n').filter((x) => x.trim()).map((x) => `<li>${dong(x.replace(/^(\*\*)?\s*Bước\s*\d+\s*[:.]?\s*(\*\*)?\s*|^[-–]\s+/i, ''))}</li>`).join('')}</ol></div>`
    const lop = { TC: 'tc', CY: 'cy', DN: 'dn', ĐN: 'dn', DL: 'dl', ĐL: 'dl', NX: 'nx', BT: 'tc' }[k]
    return `<div class="khung ${lop}"><span class="tag">${esc(td || NHAN[k] || k)}</span>${than.split('\n').map((x) => `<div>${dong(x)}</div>`).join('')}</div>`
  }).join('')
}

// điểm cần CEO xem: mục cuối tệp soạn + biên bản soát
const canXem = []
for (const f of tepRa) {
  const t = readFileSync(join(LV, 'ra', f), 'utf8').replace(/\r\n/g, '\n')
  const i = t.search(/^## GHI CHÚ CHO CEO/m)
  if (i >= 0) canXem.push({ nguon: `${f.replace('.txt', '')} · trạm soạn`, text: t.slice(i).split('\n').slice(1).join('\n').trim() })
  const bb = join(LV, 'ra', f.replace('.txt', '.soat.md'))
  if (existsSync(bb)) { const s = readFileSync(bb, 'utf8').replace(/\r\n/g, '\n'); const j = s.search(/^## Cần CEO xem/m); if (j >= 0) canXem.push({ nguon: `${f.replace('.txt', '')} · trạm soát`, text: s.slice(j).split('\n').slice(1).join('\n').replace(/\n## [\s\S]*$/, '').trim() }) }
}
const lienKet = (s) => dong(s).replace(/\b(NDB\d{5})\b/g, '<a href="#$1">$1</a>')
const xem = canXem.filter((x) => x.text && !/^Không\.?$/i.test(x.text)).map((x) => `<section class="ghi"><h3>${esc(x.nguon)}</h3>${x.text.split('\n').filter((l) => l.trim()).map((l) => `<p>${lienKet(l.replace(/^[-*]\s*/, ''))}</p>`).join('')}</section>`).join('')

// thân: theo cây
let html = '', cd0 = '', ch0 = '', n0 = ''
let soLt = 0, soVd = 0
for (const d of dang) {
  if (d.cd_id !== cd0) { cd0 = d.cd_id; ch0 = ''; html += `<h2>${esc(d.cd_ten)}</h2>` }
  if (d.ch_id !== ch0) { ch0 = d.ch_id; n0 = ''; html += `<h3 class="chd">${esc(d.ch_ten)}</h3>` }
  if (d.n_id !== n0) { n0 = d.n_id; html += `<h4 class="nhom">Nhóm: ${esc(d.n_ten)} <span class="ma">${d.n_id}</span></h4>` }
  const m = moi[d.d_id]
  const ltCo = d.d_lt.trim()
  if (m?.lt) soLt++
  if (m?.vd) soVd += (m.vd.match(/^##VD/gm) || []).length
  html += `<article class="dang" id="${d.d_id}"><header><h5>${esc(d.d_ten)}</h5><span class="ma">${d.d_id}</span></header>
<div class="mota"><span class="nhan">Mô tả (chị viết)</span> ${dong(d.d_mo_ta.trim())}</div>
<div class="phan"><div class="phan-t">Lý thuyết ${ltCo ? '<span class="co">đã có từ trước — giữ nguyên</span>' : (m?.lt ? '<span class="moi">mới soạn</span>' : '<span class="thieu">chưa có</span>')}</div>
${ltCo ? `<details><summary>Xem lý thuyết đang có</summary>${noiDung(ltCo)}</details>` : noiDung(m?.lt ?? '')}</div>
<div class="phan"><div class="phan-t">Ví dụ ${m?.vd ? '<span class="moi">mới soạn</span>' : '<span class="thieu">chưa có</span>'}</div>${noiDung(m?.vd ?? '')}</div></article>`
}

const page = `<title>Bản đồ mới khối 9 — lý thuyết, ví dụ</title>
<style>
/* bố cục: một cột đọc theo cây chủ đề → chuyên đề → nhóm → dạng; mỗi dạng một thẻ (mô tả của CEO · lý thuyết · ví dụ); điểm cần xem ở đầu trang */
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--tc:#2D9CDB;--pp:#6b7280;--cy:#d97706;--vd:#b23a72;--dn:#c89b52;--dl:#7c5cbf;--nx:#0f9d8a;--nen-mota:#f3f4f6;--moi:#047857;--nen-moi:#ecfdf5;--thieu:#b45309}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--nen-mota:#243041;--nen-moi:#0f2f25;--moi:#6ee7b7;--thieu:#fbbf24;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--nen-mota:#243041;--nen-moi:#0f2f25;--moi:#6ee7b7;--thieu:#fbbf24;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
main{max-width:920px;margin:0 auto;padding-block:20px 60px;padding-inline:16px}
h1{font-size:22px;margin:6px 0;text-wrap:balance}h2{font-size:19px;margin:40px 0 6px;padding-bottom:4px;border-bottom:2px solid var(--vien);text-wrap:balance}
h3.chd{font-size:16px;margin:24px 0 4px;color:var(--mo)}h4.nhom{font-size:15px;margin:18px 0 6px}
p{margin:0 0 6px}.dan{color:var(--mo);max-width:70ch}.ma{color:var(--mo);font:12px ui-monospace,Consolas,monospace;font-weight:400}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}nav a{color:var(--chu);border:1px solid var(--vien);background:var(--the);border-radius:999px;padding:3px 12px;text-decoration:none;font-size:14px}
a:focus-visible,summary:focus-visible{outline:2px solid var(--tc);outline-offset:2px}
.ghi{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:10px 14px;margin:10px 0}.ghi h3{font-size:14px;margin:0 0 6px;color:var(--mo)}
.dang{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:14px 16px;margin:10px 0;display:flex;flex-direction:column;gap:10px}
.dang header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.dang h5{font-size:15.5px;margin:0}
.mota{background:var(--nen-mota);border-radius:8px;padding:8px 10px}.nhan{color:var(--mo);font-size:13px;margin-right:6px}
.phan-t{font-weight:600;margin-bottom:6px;display:flex;gap:8px;align-items:center}
.moi,.co,.thieu{font-weight:500;font-size:12.5px;border-radius:6px;padding:1px 8px}.moi{background:var(--nen-moi);color:var(--moi)}.co{background:var(--nen-mota);color:var(--mo)}.thieu{color:var(--thieu);border:1px solid var(--thieu)}
.khung{position:relative;border:1.5px solid var(--k);border-radius:10px;padding:18px 14px 10px;margin:14px 0 8px;overflow-x:auto}
.khung .tag{position:absolute;top:-11px;left:12px;background:var(--the);color:var(--k);font-size:13px;font-weight:600;padding:0 6px}
.tc{--k:var(--tc)}.pp{--k:var(--pp)}.cy{--k:var(--cy)}.vd{--k:var(--vd)}.dn{--k:var(--dn)}.dl{--k:var(--dl)}.nx{--k:var(--nx)}
.pp ol{margin:0;padding-left:22px}.pp li{margin:2px 0}
.giai{overflow-x:auto;margin:0 0 6px}.nhan-giai{text-align:center;font-weight:700;text-decoration:underline;margin:4px 0}
details summary{cursor:pointer;color:var(--mo)}
math{font-size:1.06em}
</style>
<main>
<h1>Bản đồ mới khối 9 — lý thuyết và ví dụ</h1>
<p class="dan">Mỗi dạng có mô tả: <strong>${soLt}</strong> lý thuyết mới soạn (dạng đã có lý thuyết thì giữ nguyên), <strong>${soVd}</strong> ví dụ có lời giải. Soạn từ lý thuyết bản đồ cũ, câu trong kho và các quyển sách khối 9 chị gửi; một trạm soát độc lập kiểm toán từng dòng bằng máy. Ba dạng chưa có mô tả (NDB00512, NDB00513, NDB00514) không làm. Khung xám đầu thẻ là mô tả chị viết, để đối chiếu.</p>
<nav><a href="#xem">Cần chị xem</a>${[...new Set(dang.map((d) => d.cd_ten))].map((t, i) => `<a href="#cd${i}">${esc(t)}</a>`).join('')}</nav>
<h2 id="xem">Cần chị xem</h2>
${xem || '<p class="dan">Không có.</p>'}
${html.replace(/<h2>/g, (() => { let i = 0; return () => `<h2 id="cd${i++}">` })())}
</main>
`
const ra = join(DIR, '..', '..', '..', 'k9-ban-do-moi-duyet.html')
writeFileSync(ra, page)
console.log(`${dang.length} dạng · lý thuyết mới ${soLt} · ví dụ ${soVd} · ${(page.length / 1024).toFixed(0)} KB → ${ra}`)
