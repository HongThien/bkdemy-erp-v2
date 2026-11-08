// build-xem.mjs — dựng trang ĐỀ XUẤT cho chuyên đề "Bất đẳng thức Cauchy (AM–GM)" của bản đồ 8T (Thùy 25/10: đưa chuyên đề BĐT AM-GM
// của sách Mai Thành Luân, Chương 2–3, vào bản đồ). CHƯA ghi DB — chỉ đọc _chuyen-de.txt + nhom*.txt rồi dựng HTML để Thùy xem.
//   node kho-rules/dai/lo/k8T/amgm/build-xem.mjs <tệp_ra.html>
// Khuôn tệp nguồn:  #NHOM <id> | <tên>  ·  #DANG <id|moi> | <tên> | muc=<n> | bac=<X>  ·  @MOTA  ·  @GHICHU  ·  @LT  ·  @VD
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'

const DIR = dirname(fileURLToPath(import.meta.url))
const RA = process.argv[2]
if (!RA) { console.error('Dùng: node build-xem.mjs <tệp_ra.html>'); process.exit(2) }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (tex, chuNhat = false) => { try { return katex.renderToString(tex, { output: 'mathml', throwOnError: true, strict: 'ignore', displayMode: chuNhat }) } catch (e) { console.error('LỖI KaTeX:', tex.slice(0, 80), e.message.slice(0, 80)); return `<code class="loi">${esc(tex)}</code>` } }
const dong = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, t) => toan(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

const THE = { 'ĐL': ['Định lý', 'dl'], 'ĐN': ['Định nghĩa', 'dn'], 'TC': ['Kiến thức cần nhớ', 'tc'], 'CY': ['Chú ý', 'cy'], 'PP': ['Phương pháp giải', 'pp'], 'NX': ['Nhận xét', 'nx'], 'VD': ['Ví dụ', 'vd'] }
/** lý thuyết có thẻ ##XX ⇒ các khối; khối kết thúc ở dòng trống (đúng parser của app) */
function ltHtml(txt) {
  const out = []
  let vd = 0
  for (const kh of txt.trim().split(/\n\s*\n/)) {
    const dongs = kh.split('\n')
    const m = dongs[0].match(/^##(ĐL|ĐN|TC|CY|PP|NX)\s*(.*)$/)
    if (!m) { out.push(`<p class="tran">${dong(kh)}</p>`); continue }
    const [ten, lop] = THE[m[1]]
    const tieuDe = m[2].trim() || ten
    const than = dongs.slice(1)
    if (m[1] === 'PP') out.push(`<div class="khoi ${lop}"><span class="nhan">${esc(tieuDe)}</span><ol>${than.filter((d) => d.trim()).map((d) => `<li>${dong(d.replace(/^[-•]\s*/, ''))}</li>`).join('')}</ol></div>`)
    else if (than.some((d) => /^[-•]\s/.test(d))) out.push(`<div class="khoi ${lop}"><span class="nhan">${esc(tieuDe)}</span><ul>${than.filter((d) => d.trim()).map((d) => `<li>${dong(d.replace(/^[-•]\s*/, ''))}</li>`).join('')}</ul></div>`)
    else out.push(`<div class="khoi ${lop}"><span class="nhan">${esc(tieuDe)}</span>${than.map((d) => `<p>${dong(d)}</p>`).join('')}</div>`)
  }
  return out.join('\n')
}
/** ví dụ: ##VD + đề (liền nhau) + dòng trống + "Bài giải:" + lời giải */
function vdHtml(txt) {
  const kq = []
  let n = 0
  for (const kh of txt.trim().split(/\n(?=##VD)/)) {
    const than = kh.replace(/^##VD\s*\n?/, '').trim()
    const i = than.search(/^Bài giải:/m)
    const de = (i < 0 ? than : than.slice(0, i)).trim(), gi = i < 0 ? '' : than.slice(i + 'Bài giải:'.length).trim()
    kq.push(`<div class="khoi vd"><span class="nhan">Ví dụ ${++n}</span>${de.split('\n').map((d) => `<p>${dong(d)}</p>`).join('')}${gi ? `<div class="giai"><div class="bg">Bài giải:</div>${gi.split('\n').map((d) => `<p>${dong(d)}</p>`).join('')}</div>` : ''}</div>`)
  }
  return kq.join('\n')
}
const mota = (s) => s.trim().split('\n').map((d) => `<p>${dong(d)}</p>`).join('')

// ── đọc nguồn ──────────────────────────────────────────────────────────────
const cd = (() => { const t = readFileSync(join(DIR, '_chuyen-de.txt'), 'utf8'); const id = t.match(/^#CHUYEN_DE\s+(\S+)/m)[1]; return { id, ...tach(t) } })()
function tach(t) {
  const kq = { mota: '', ghichu: '', lt: '', vd: '' }
  let cur = null
  for (const d of t.split('\n')) {
    const k = d.match(/^@(MOTA|GHICHU|LT|VD)\s*$/)
    if (k) { cur = k[1].toLowerCase(); continue }
    if (/^#(NHOM|DANG|CHUYEN_DE)/.test(d)) { cur = null; continue }
    if (cur) kq[cur] += d + '\n'
  }
  return kq
}
const nhoms = []
for (const f of readdirSync(DIR).filter((x) => /^nhom\d+\.txt$/.test(x)).sort()) {
  const t = readFileSync(join(DIR, f), 'utf8').replace(/\r\n/g, '\n')
  const phan = t.split(/\n(?=#(?:NHOM|DANG)\s)/)
  let nhom = null
  for (const p of phan) {
    const dau = p.split('\n')[0]
    const thanP = p.slice(dau.length + 1)
    if (dau.startsWith('#NHOM')) { const [id, ten] = dau.replace('#NHOM', '').split('|').map((x) => x.trim()); nhom = { id, ten, ...tach(thanP), dangs: [] }; nhoms.push(nhom) }
    else if (dau.startsWith('#DANG')) { const [id, ten, ...r] = dau.replace('#DANG', '').split('|').map((x) => x.trim()); nhom.dangs.push({ id, ten, muc: (r.join('|').match(/muc=(\d)/) ?? [])[1], bac: (r.join('|').match(/bac=(\w)/) ?? [])[1], ...tach(thanP) }) }
  }
}
const tongDang = nhoms.reduce((s, n) => s + n.dangs.length, 0), tongVd = nhoms.reduce((s, n) => s + n.dangs.reduce((a, d) => a + (d.vd.match(/^##VD/gm) ?? []).length, 0), 0)
const dangMoi = nhoms.reduce((s, n) => s + n.dangs.filter((d) => d.id === 'moi').length, 0)

const html = `<title>Chuyên đề AM–GM bản đồ 8T</title>
<style>
:root{--nen:#f5f4ef;--giay:#fff;--chu:#23241f;--mo:#6a6c63;--vien:#dad8cf;--nhan:#a3345f;--xanh:#1f6f5c;--cam:#a4571b;--dl:#7c5cbf;--dn:#a87a1f;--tc:#2d7fb8;--vd:#b23a72;--pp:#5d6058;--nx:#1f7a68}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--nen:#181a17;--giay:#22241f;--chu:#e9e8e2;--mo:#a3a69b;--vien:#383b33;--nhan:#e58aae;--xanh:#6fc3ad;--cam:#e2a36a;--dl:#ae96e6;--dn:#d8b25a;--tc:#6bb4e6;--vd:#e58aae;--pp:#a3a69b;--nx:#6fc3ad;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#181a17;--giay:#22241f;--chu:#e9e8e2;--mo:#a3a69b;--vien:#383b33;--nhan:#e58aae;--xanh:#6fc3ad;--cam:#e2a36a;--dl:#ae96e6;--dn:#d8b25a;--tc:#6bb4e6;--vd:#e58aae;--pp:#a3a69b;--nx:#6fc3ad;color-scheme:dark}
body{background:var(--nen);color:var(--chu);font:16px/1.6 "Be Vietnam Pro",system-ui,"Segoe UI",sans-serif;padding-inline:16px;padding-block:28px 70px}
main{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:20px}
h1{font-size:1.6rem;line-height:1.2;margin:0;text-wrap:balance} h2{font-size:1.2rem;margin:26px 0 0;padding-top:16px;border-top:2px solid var(--vien);text-wrap:balance} h3{font-size:1.02rem;margin:0}
.dan{color:var(--mo);margin:0;max-width:70ch}
.so{display:flex;flex-wrap:wrap;gap:8px 26px;margin:0;padding:0;list-style:none;font-variant-numeric:tabular-nums}.so b{font-size:1.4rem;color:var(--xanh);display:block;line-height:1.1}.so span{color:var(--mo);font-size:.85rem}
.the{background:var(--giay);border:1px solid var(--vien);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}
.tren{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}.chip{font-size:.74rem;letter-spacing:.05em;text-transform:uppercase;padding:2px 8px;border-radius:99px;border:1px solid var(--vien);color:var(--mo)}.chip.moi{color:var(--cam);border-color:var(--cam)}.chip.co{color:var(--xanh);border-color:var(--xanh)}
.mota{border-left:3px solid var(--vien);padding-left:10px;color:var(--mo);font-size:.95rem}.mota p,.khoi p{margin:.25em 0}
.ghichu{background:rgba(164,87,27,.09);border:1px solid var(--cam);border-radius:8px;padding:8px 12px;font-size:.92rem}.ghichu b{color:var(--cam)}
.nhomtt{background:var(--giay);border:1px solid var(--vien);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.tieu{font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--mo);margin:2px 0 -4px}
.khoi{position:relative;border:1.5px solid var(--c);border-radius:12px;padding:16px 14px 10px;margin-top:8px;font-size:.96rem}.khoi .nhan{position:absolute;top:-11px;left:12px;background:var(--c);color:#fff;font-size:.78rem;font-weight:600;padding:1px 10px;border-radius:99px}
.khoi.dl{--c:var(--dl)}.khoi.dn{--c:var(--dn)}.khoi.tc{--c:var(--tc)}.khoi.cy{--c:var(--cam)}.khoi.pp{--c:var(--pp)}.khoi.nx{--c:var(--nx)}.khoi.vd{--c:var(--vd)}
.khoi ol,.khoi ul{margin:.2em 0;padding-left:1.4em}.khoi li{margin:.2em 0}
.giai{margin-top:6px;border-top:1px dashed var(--vien);padding-top:4px}.bg{text-align:center;font-weight:700;text-decoration:underline;text-underline-offset:3px;margin:4px 0}
.tran{margin:.3em 0}
math{font-size:1.08em}.loi{color:#c00}
summary{cursor:pointer;color:var(--xanh);font-weight:600}
.bang{overflow-x:auto;background:var(--giay);border:1px solid var(--vien);border-radius:10px}table{border-collapse:collapse;width:100%;font-size:.92rem;min-width:560px}th,td{text-align:left;vertical-align:top;padding:8px 12px;border-bottom:1px solid var(--vien)}th{font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--mo)}tr:last-child td{border-bottom:0}
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap">
<main>
<h1>Chuyên đề Bất đẳng thức Cauchy (AM–GM) — đề xuất cho bản đồ 8T</h1>
<p class="dan">Soạn từ ba chương đầu sách <em>Mai Thành Luân — Bất đẳng thức, điểm rơi và kỹ thuật chứng minh</em>, trọng tâm Chương 2 và 3, ghép vào chuyên đề <strong>${esc('Bất đẳng thức Cauchy(AM - GM) và ứng dụng')}</strong> chị đã dựng sẵn (mã <code>${cd.id}</code>). <strong>Chưa ghi gì vào DB.</strong> Chị xem rồi bảo "ghi" (hoặc sửa chỗ nào) thì tôi mới ghi, và chỉ ghi vào ô còn trống.</p>
<ul class="so"><li><b>${nhoms.length}</b><span>nhóm bài được điền</span></li><li><b>${tongDang}</b><span>dạng bài (${tongDang - dangMoi} có sẵn · ${dangMoi} tôi đề xuất thêm)</span></li><li><b>${tongVd}</b><span>ví dụ có lời giải</span></li><li><b>1</b><span>nhóm bỏ trống (Ngược dấu — Chương 4, chị bảo không dùng)</span></li></ul>
<div class="the"><div class="tren"><h3>Chuyên đề</h3><span class="chip co">${cd.id}</span></div><div class="mota">${mota(cd.mota)}</div>${cd.ghichu ? `<div class="ghichu"><b>Ghi chú:</b> ${esc(cd.ghichu.trim())}</div>` : ''}</div>
${nhoms.map((n, i) => `<h2>Nhóm ${i + 1}. ${esc(n.ten)} <span class="chip co">${n.id}</span></h2>
<div class="nhomtt"><div class="tieu">Mô tả nhóm</div><div class="mota">${mota(n.mota)}</div><div class="tieu">Lý thuyết của nhóm (không chứa ví dụ)</div>${ltHtml(n.lt)}</div>
${n.dangs.map((d) => `<div class="the"><div class="tren"><h3>${esc(d.ten)}</h3><span class="chip ${d.id === 'moi' ? 'moi' : 'co'}">${d.id === 'moi' ? 'dạng đề xuất thêm' : d.id}</span>${d.muc ? `<span class="chip">mức ${d.muc} · bậc ${d.bac}</span>` : ''}</div>
<div class="tieu">Mô tả dạng</div><div class="mota">${mota(d.mota)}</div>${d.ghichu.trim() ? `<div class="ghichu"><b>Ghi chú:</b> ${esc(d.ghichu.trim())}</div>` : ''}
<div class="tieu">Lý thuyết của dạng</div>${ltHtml(d.lt)}
<div class="tieu">Ví dụ (${(d.vd.match(/^##VD/gm) ?? []).length})</div>${d.vd.trim() ? vdHtml(d.vd) : '<p class="dan">Chưa có — xem ghi chú.</p>'}</div>`).join('\n')}`).join('\n')}
<h2>Việc cần chị quyết</h2>
<div class="bang"><table><thead><tr><th>Chỗ</th><th>Tôi làm thế nào</th><th>Chị chọn</th></tr></thead><tbody>
<tr><td>Dạng đề xuất thêm (${dangMoi} dạng)</td><td>Bản đồ chị dựng mới có 5 dạng (4 ở nhóm 1, 1 ở nhóm 2). Sách Chương 2–3 có nhiều kiểu bài nằm ngoài 5 dạng đó, nên tôi đề xuất thêm ${dangMoi} dạng, đánh dấu "dạng đề xuất thêm". Thêm dạng là việc của chị.</td><td>Giữ dạng nào, gộp dạng nào vào dạng có sẵn, bỏ dạng nào.</td></tr>
<tr><td>Nhóm 1: tên "1 biến / nhiều biến", "tổng / tích"</td><td>Tôi hiểu là số biến thực chất và dạng biểu thức cần chặn. Dạng "1 biến dạng tích" sách không có ví dụ nên để trống.</td><td>Hiểu đúng không? Có cho tôi soạn ví dụ ngoài sách không?</td></tr>
<tr><td>Mức độ và bậc tối thiểu</td><td>Các dạng có sẵn đang để trống hai cột này; tôi gợi ý mức 3–5, bậc A (cùng mặt bằng 41 nhóm 8T mới). Số này chỉ là gợi ý.</td><td>Chị chỉnh ở màn Bản đồ.</td></tr>
<tr><td>Nhóm 4 "Ngược dấu"</td><td>Tương ứng Chương 4 của sách; chị bảo chỉ dùng ba chương đầu nên tôi để nguyên.</td><td>Nếu sau này cần, tôi soạn từ Chương 4 (trang 63–82).</td></tr>
<tr><td>Công cụ</td><td>Lời giải chỉ dùng Cô-si, bổ đề tổng nghịch đảo, $(x+y)^2\\ge4xy$, hệ quả bình phương — đều thuộc danh mục §1.2 của luật kiến thức 8T. Mỗi chỗ dùng Cô-si đều nêu điều kiện không âm / dương và điều kiện dấu "=".</td><td>—</td></tr>
</tbody></table></div>
</main>`
writeFileSync(RA, html.replace('$(x+y)^2\\\\ge4xy$', toan('(x+y)^2\\ge4xy')))
console.log('→', RA, (html.length / 1024).toFixed(0), 'KB ·', nhoms.length, 'nhóm ·', tongDang, 'dạng ·', tongVd, 'ví dụ')
