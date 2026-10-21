// duyet.mjs — dựng trang HTML để Thùy review bản đồ đề xuất K12 Hàm số: cây 4 tầng + mô tả + lý thuyết nhóm + lý thuyết dạng + ví dụ (có hình).
//   node kho-rules/dai/lo/k12-hs/duyet.mjs     → kho-rules/dai/k12-ham-so-ban-do-moi-duyet.html
// Đọc: cau-truc.mjs (cây + mô tả) · ra/J*.txt (bản đã soát) · mục "GHI CHÚ CHO CEO" cuối tệp soạn + "Cần CEO xem" của biên bản soát (J*.soat.md).
// Hiển thị theo luật render của app (src/lib/lythuyetBlocks.ts): đoạn ##TC / ##PP (mỗi dòng một bước) / ##CY / ##VD (đề trong khung, "Bài giải:" ngoài khung).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { CAY, CHU_DE, THONG_KE } from './cau-truc.mjs'
import { docTep } from './kiem.mjs'
import { veHinh } from './ve.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const katex = createRequire(join(DIR, '../../../../package.json'))('katex')
const RA = join(DIR, 'ra')
const tepRa = existsSync(RA) ? readdirSync(RA).filter((f) => /^J\d+\.txt$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))) : []
const moi = {}
for (const f of tepRa) for (const k of docTep(readFileSync(join(RA, f), 'utf8'))) moi[(k.la_nhom ? 'N ' : '') + k.id] = { ...k, tep: f }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (t) => { try { return katex.renderToString(t, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${esc(t)}</code>` } }
const dong = (s) => esc(s)
  .replace(/\$\$([^$]+)\$\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')))
  .replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')))
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
const hinhDong = (x) => {
  const m = x.match(/^\[\[HINH (.*)\]\]\s*$/)
  if (!m) return null
  try { const sp = JSON.parse(m[1]); return `<figure class="hinh">${veHinh(sp)}<figcaption>${sp.loai === 'bbt' ? (sp.hang === 'dau' ? 'Bảng xét dấu' : 'Bảng biến thiên') : 'Đồ thị'}</figcaption></figure>` } catch (e) { return `<p class="loi">Hình lỗi: ${esc(e.message)}</p>` }
}
const dongTrongKhung = (x) => hinhDong(x) ?? `<div>${dong(x)}</div>`
const NHAN = { TC: 'Kiến thức cần nhớ', PP: 'Phương pháp', CY: 'Chú ý', DN: 'Định nghĩa', DL: 'Định lý', NX: 'Nhận xét' }
function noiDung(text) {
  let soVd = 0
  return (text || '').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean).map((d) => {
    const m = d.match(/^##(TC|PP|CY|DN|DL|ĐN|ĐL|NX|VD|BT)[ \t]*([^\n]*)\n?([\s\S]*)$/)
    if (!m) {
      if (/^(\*\*)?(Bài giải|Lời giải|Giải)\s*[:.]?(\*\*)?\s*(\n|$)/.test(d)) return `<div class="giai"><div class="nhan-giai">Bài giải:</div>${d.split('\n').slice(1).map(dongTrongKhung).join('')}</div>`
      return `<p>${d.split('\n').map(dong).join('<br>')}</p>`
    }
    const [, k, td, than] = m
    if (k === 'VD') { soVd++; return `<div class="khung vd"><span class="tag">Ví dụ ${soVd}</span>${than.split('\n').map(dongTrongKhung).join('')}</div>` }
    if (k === 'PP') return `<div class="khung pp"><span class="tag">${esc(td || NHAN.PP)}</span><ol>${than.split('\n').filter((x) => x.trim()).map((x) => `<li>${dong(x.replace(/^(\*\*)?\s*Bước\s*\d+\s*[:.]?\s*(\*\*)?\s*|^[-–]\s+/i, ''))}</li>`).join('')}</ol></div>`
    const lop = { TC: 'tc', CY: 'cy', DN: 'dn', ĐN: 'dn', DL: 'dl', ĐL: 'dl', NX: 'nx', BT: 'tc' }[k]
    return `<div class="khung ${lop}"><span class="tag">${esc(td || NHAN[k] || k)}</span>${than.split('\n').map((x) => `<div>${dong(x.replace(/^[-•]\s+/, '• '))}</div>`).join('')}</div>`
  }).join('')
}

// điểm cần xem: mục cuối tệp soạn + biên bản soát
const canXem = []
for (const f of tepRa) {
  const t = readFileSync(join(RA, f), 'utf8').replace(/\r\n/g, '\n')
  const i = t.search(/^## GHI CHÚ CHO CEO/m)
  if (i >= 0) canXem.push({ nguon: `${f.replace('.txt', '')} · trạm soạn`, text: t.slice(i).split('\n').slice(1).join('\n').trim() })
  const bb = join(RA, f.replace('.txt', '.soat.md'))
  if (existsSync(bb)) { const s = readFileSync(bb, 'utf8').replace(/\r\n/g, '\n'); const j = s.search(/^## Cần CEO xem/m); if (j >= 0) canXem.push({ nguon: `${f.replace('.txt', '')} · trạm soát`, text: s.slice(j).split('\n').slice(1).join('\n').replace(/\n## [\s\S]*$/, '').trim() }) }
}
const lienKet = (s) => dong(s).replace(/\b(H\d(?:\.\d+){1,2})\b/g, (m) => `<a href="#${m}">${m}</a>`)
const xem = canXem.filter((x) => x.text && !/^Không\.?$/i.test(x.text)).map((x) => `<section class="ghi"><h3>${esc(x.nguon)}</h3>${x.text.split('\n').filter((l) => l.trim()).map((l) => `<p>${lienKet(l.replace(/^[-*]\s*/, ''))}</p>`).join('')}</section>`).join('')

// thân theo cây
const tk = THONG_KE()
let html = '', soLtNhom = 0, soLtDang = 0, soVd = 0, soHinh = 0, thieu = 0
const toc = []
CAY.forEach((cd, ci) => {
  html += `<h2 id="${cd.id}">${esc(cd.ten)} <span class="ma">${cd.id}</span></h2>`
  const sub = []
  for (const n of cd.nhom) {
    const mn = moi['N ' + n.id]
    if (mn?.lt) soLtNhom++
    sub.push(`<li><a href="#${n.id}">${esc(n.ten)}</a></li>`)
    html += `<section class="nhom-khoi" id="${n.id}"><h3 class="nhom">Nhóm bài · ${esc(n.ten)} <span class="ma">${n.id}</span> <span class="the ${n.bb ? 'bb' : 'nc'}">${n.bb ? 'bắt buộc' : 'nâng cao'}</span></h3>
<p class="mota-nhom">${dong(n.mo_ta)}</p>
<div class="phan"><div class="phan-t">Lý thuyết nhóm ${mn?.lt ? '' : '<span class="thieu">chưa soạn</span>'}</div>${noiDung(mn?.lt ?? '')}</div>`
    for (const d of n.dang) {
      const [id, ten, mo, hinh] = d
      const m = moi[id]
      if (m?.lt) soLtDang++
      if (m?.vd) { soVd += (m.vd.match(/^##VD/gm) || []).length; soHinh += (m.vd.match(/\[\[HINH/g) || []).length }
      if (!m?.vd) thieu++
      html += `<article class="dang" id="${id}"><header><h4>${esc(ten)}</h4><span class="ma">${id}</span>${hinh !== 'khong' ? `<span class="the hinh-th">cần hình: ${hinh === 'bbt' ? 'bảng biến thiên' : hinh === 'dothi' ? 'đồ thị' : 'bảng + đồ thị'}</span>` : ''}</header>
<div class="mota"><span class="nhan">Mô tả nhận biết</span> ${dong(mo)}</div>
<div class="phan"><div class="phan-t">Lý thuyết dạng ${m?.lt ? '' : '<span class="thieu">chưa soạn</span>'}</div>${noiDung(m?.lt ?? '')}</div>
<div class="phan"><div class="phan-t">Ví dụ ${m?.vd ? '' : '<span class="thieu">chưa soạn</span>'}</div>${noiDung(m?.vd ?? '')}</div></article>`
    }
    html += '</section>'
  }
  toc.push(`<li><a href="#${cd.id}"><strong>${esc(cd.ten)}</strong></a><ul>${sub.join('')}</ul></li>`)
})

const cauTruc = `<table class="ct"><thead><tr><th>Chuyên đề</th><th>Nhóm bài</th><th>Dạng bài</th></tr></thead><tbody>${CAY.map((cd) => cd.nhom.map((n, i) => `<tr>${i === 0 ? `<td rowspan="${cd.nhom.length}"><a href="#${cd.id}">${esc(cd.ten)}</a></td>` : ''}<td><a href="#${n.id}">${esc(n.ten)}</a> ${n.bb ? '' : '<span class="the nc">nâng cao</span>'}</td><td>${n.dang.map((d) => `<a href="#${d[0]}">${esc(d[1])}</a>`).join('<br>')}</td></tr>`).join('')).join('')}</tbody></table>`

const CAU_HOI = [
  ['CĐ7 tách 8 nhóm theo loại mô hình', 'Bản cũ có 10 nhóm thực tế (hai "thùng" 777 câu). Đồng ý cắt theo loại mô hình? Nhóm H7.7 (tốc độ liên quan) chỉ PNL có, kho 0 câu — giữ nâng cao hay bỏ?'],
  ['CĐ6 có thuộc chương Hàm số không', 'Tương giao · tiếp tuyến · điểm di động · phương trình hợp: sách có nhiều (~100 câu nâng cao) nhưng bản cũ không có chuyên đề này. Giữ, chuyển chủ đề khác, hay bỏ?'],
  ['Tham số m và hàm hợp rải trong từng chuyên đề', 'Đề xuất rải (H1.5, H2.4, H3.3, H4.4 …). Hay gom thành một chuyên đề "Bài toán tham số"?'],
  ['Khảo sát chia theo kỹ năng', 'Bản cũ/Từ Tâm/PNL chia theo loại hàm; đề xuất chia theo kỹ năng (vẽ · nhận dạng · hệ số · đọc tính chất), loại hàm xuống dạng bài.'],
  ['Tiệm cận tách theo cách làm', 'Đề xuất 3 nhóm: TCĐ–TCN từ công thức · TCX từ công thức · đọc từ hình; thay cho 7 nhóm cũ (hoặc 1 nhóm như cả 3 tác giả).'],
  ['Nhóm nâng cao đặt bat_buoc = false', 'H1.4 · H2.6 · H3.4 · H6.x · H7.7 — ổn không?'],
  ['Bản nháp hiện có trong ERP', 'ERP đang gom đơn điệu/cực trị/GTLN/tiệm cận vào một chuyên đề "Các đặc trưng của hàm số"; đề xuất này tách thành 4 chuyên đề. Nếu chị muốn giữ gom thì nói.'],
]

const page = `<title>K12 Hàm số — bản đồ mới 4 tầng (đề xuất)</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--tc:#2D9CDB;--pp:#6b7280;--cy:#d97706;--vd:#b23a72;--dn:#c89b52;--dl:#7c5cbf;--nx:#0f9d8a;--nen-mota:#f3f4f6;--moi:#047857;--nen-moi:#ecfdf5;--thieu:#b45309;--bb:#1d4ed8;--nc:#9333ea;--lk:#2563eb}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--nen-mota:#243041;--nen-moi:#0f2f25;--moi:#6ee7b7;--thieu:#fbbf24;--bb:#93c5fd;--nc:#d8b4fe;--lk:#93c5fd;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--nen-mota:#243041;--nen-moi:#0f2f25;--moi:#6ee7b7;--thieu:#fbbf24;--bb:#93c5fd;--nc:#d8b4fe;--lk:#93c5fd;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
a{color:var(--lk)}
.bo{display:grid;grid-template-columns:260px minmax(0,1fr);gap:0;max-width:1240px;margin:0 auto}
aside{position:sticky;top:0;align-self:start;max-height:100vh;overflow:auto;padding:16px 12px 40px 16px;font-size:13px;border-right:1px solid var(--vien)}
aside ul{list-style:none;margin:2px 0 8px;padding-left:12px}aside li{margin:2px 0}aside a{color:var(--chu);text-decoration:none}aside a:hover{text-decoration:underline}
main{padding:20px 16px 80px;min-width:0}
@media (max-width:900px){.bo{display:block}aside{position:static;max-height:none;border-right:0;border-bottom:1px solid var(--vien)}}
h1{font-size:22px;margin:6px 0;text-wrap:balance}h2{font-size:19px;margin:44px 0 6px;padding-bottom:4px;border-bottom:2px solid var(--vien);text-wrap:balance}
h3.nhom{font-size:16px;margin:26px 0 4px}.mota-nhom{color:var(--mo);margin:0 0 8px;max-width:75ch}
p{margin:0 0 6px}.dan{color:var(--mo);max-width:75ch}.ma{color:var(--mo);font:12px ui-monospace,Consolas,monospace;font-weight:400}
.the{font-size:12px;border-radius:999px;padding:1px 9px;font-weight:500;border:1px solid currentColor;margin-left:6px;white-space:nowrap}.the.bb{color:var(--bb)}.the.nc{color:var(--nc)}.the.hinh-th{color:var(--mo)}
a:focus-visible,summary:focus-visible{outline:2px solid var(--tc);outline-offset:2px}
.ghi{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:10px 14px;margin:10px 0}.ghi h3{font-size:14px;margin:0 0 6px;color:var(--mo)}
.dang{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:14px 16px;margin:12px 0;display:flex;flex-direction:column;gap:10px}
.dang header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.dang h4{font-size:15.5px;margin:0}
.mota{background:var(--nen-mota);border-radius:8px;padding:8px 10px}.nhan{color:var(--mo);font-size:13px;margin-right:6px}
.phan{margin-top:2px}.phan-t{font-weight:600;margin-bottom:6px;display:flex;gap:8px;align-items:center}
.nhom-khoi>.phan{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:12px 16px}
.thieu{font-weight:500;font-size:12.5px;border:1px solid var(--thieu);color:var(--thieu);border-radius:6px;padding:1px 8px}
.khung{position:relative;border:1.5px solid var(--k);border-radius:10px;padding:18px 14px 10px;margin:14px 0 8px}.khung>div{max-width:100%;overflow-x:auto}
.khung .tag{position:absolute;top:-11px;left:12px;background:var(--the);color:var(--k);font-size:13px;font-weight:600;padding:0 6px}
.tc{--k:var(--tc)}.pp{--k:var(--pp)}.cy{--k:var(--cy)}.vd{--k:var(--vd)}.dn{--k:var(--dn)}.dl{--k:var(--dl)}.nx{--k:var(--nx)}
.pp ol{margin:0;padding-left:22px}.pp li{margin:2px 0}
.giai{overflow-x:auto;margin:0 0 6px}.nhan-giai{text-align:center;font-weight:700;text-decoration:underline;margin:4px 0}
figure.hinh{margin:8px 0;display:flex;flex-direction:column;align-items:flex-start;gap:2px;overflow-x:auto;color:var(--chu)}figure.hinh figcaption{font-size:12px;color:var(--mo)}
.loi{color:#dc2626;font-weight:600}
table.ct{border-collapse:collapse;width:100%;font-size:13.5px;background:var(--the)}table.ct th,table.ct td{border:1px solid var(--vien);padding:6px 9px;vertical-align:top;text-align:left}table.ct th{background:var(--nen-mota)}
details.cauhoi{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:8px 14px;margin:8px 0}details.cauhoi summary{cursor:pointer;font-weight:600}
math{font-size:1.06em}
</style>
<div class="bo">
<aside><strong>Mục lục</strong><ul><li><a href="#tong-quan">Tổng quan cây 4 tầng</a></li><li><a href="#quyet">Cần chị quyết</a></li><li><a href="#xem">Điểm cần xem khi soạn</a></li>${toc.join('')}</ul></aside>
<main>
<h1>K12 · Hàm số — bản đồ mới 4 tầng (đề xuất)</h1>
<p class="dan">Chủ đề <strong>${esc(CHU_DE.ten)}</strong> (<span class="ma">${CHU_DE.id}</span>) · ${tk.chuyen_de} chuyên đề · ${tk.nhom} nhóm bài · ${tk.dang} dạng bài. Làm đúng khuôn phần <em>Giới hạn lớp 11</em>: mỗi nhóm có lý thuyết chung; mỗi dạng có mô tả nhận biết, lý thuyết riêng, 2 ví dụ có lời giải; ví dụ cần hình thì có hình (đồ thị vẽ từ công thức, bảng biến thiên dựng từ dữ liệu). Nội dung hiện có: <strong>${soLtNhom}</strong>/${tk.nhom} lý thuyết nhóm · <strong>${soLtDang}</strong>/${tk.dang} lý thuyết dạng · <strong>${soVd}</strong> ví dụ · <strong>${soHinh}</strong> hình${thieu ? ` · còn <strong>${thieu}</strong> dạng chưa soạn` : ''}.</p>
<p class="dan">Cơ sở: 3 tác giả (Từ Tâm, NBV, PNL) + 117 đề giữa kì K12 trên ERP + 25 đề GK1/HK1 của NBV. Trang này chỉ để review — <strong>chưa ghi vào DB</strong>. Mã H… là mã tạm; khi chị chốt mới sinh mã NNB/NDB. Thẻ <span class="the bb">bắt buộc</span> / <span class="the nc">nâng cao</span> = đề xuất <code>bat_buoc</code>.</p>
<h2 id="tong-quan">Tổng quan cây 4 tầng</h2>
${cauTruc}
<h2 id="quyet">Cần chị quyết</h2>
${CAU_HOI.map(([t, m]) => `<details class="cauhoi" open><summary>${esc(t)}</summary><p>${dong(m)}</p></details>`).join('')}
<h2 id="xem">Điểm cần xem khi soạn</h2>
${xem || '<p class="dan">Không có.</p>'}
${html}
</main></div>
`
const ra = join(DIR, '..', '..', 'k12-ham-so-ban-do-moi-duyet.html')
writeFileSync(ra, page)
console.log(`${tk.dang} dạng · lý thuyết nhóm ${soLtNhom}/${tk.nhom} · lý thuyết dạng ${soLtDang} · ví dụ ${soVd} · hình ${soHinh} · chưa soạn ${thieu} · ${(page.length / 1024).toFixed(0)} KB → ${ra}`)
