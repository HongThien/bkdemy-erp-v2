// build-html.mjs — HTML cho Thùy xem kết quả đợt xếp câu K11 (gh2710): 6 câu TRỐNG (bản đồ thiếu dạng) + 98 câu VỪA (nhóm theo dạng đề xuất).
//   node kho-rules/dai/lo/b3/k11-gh2710/build-html.mjs [ra.html]
import { readFileSync, writeFileSync } from 'node:fs'
const D = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/b3/k11-gh2710/'
const RA = process.argv[2] || 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/k11-gh2710-xep-cau.html'
const kq = JSON.parse(readFileSync(D + 'ket_qua.json', 'utf8'))
const cau = new Map()
for (let i = 1; i <= 7; i++) for (const q of JSON.parse(readFileSync(D + `lo-0${i}.json`, 'utf8'))) cau.set(q.ma_cau, q)
const ten = {}
for (const m of readFileSync(D + 'dich.md', 'utf8').matchAll(/^- \*\*(NDB\d+)\*\* · (.+)$/gm)) ten[m[1]] = m[2]
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => esc(s).replace(/\n+/g, '<br>')
const the = (r) => {
  const q = cau.get(r.ma_cau) ?? {}
  const lc = (q.lua_chon ?? []).map((x, i) => `<li><b>${'ABCD'[i]}.</b> ${esc(x)}</li>`).join('')
  const md = (q.menh_de ?? []).map((x, i) => `<li><b>${'abcd'[i]})</b> ${esc(x.noi_dung ?? x)}</li>`).join('')
  return `<section class="c"><div class="t"><b>${r.ma_cau}</b> · ${esc(q.loai ?? '')}${q.co_hinh ? ' · <span class="w">có hình (máy không thấy)</span>' : ''}${q.dap_an ? ` · đáp án <b>${esc(q.dap_an)}</b>` : ''}</div>
<div class="d">${fmt(q.de)}</div>${lc ? `<ul class="lc">${lc}</ul>` : ''}${md ? `<ul class="lc">${md}</ul>` : ''}
<div class="m">${r.dang_bai_id ? `Đề xuất: <b>${r.dang_bai_id}</b> ${esc(ten[r.dang_bai_id] ?? '')}` : '<b>Không dạng nào khớp</b>'} — <i>${esc(r.ly_do)}</i></div></section>`
}
const trong = kq.filter((r) => !r.dang_bai_id)
const vua = kq.filter((r) => r.dang_bai_id && r.chac === 'vua')
const nhom = {}
for (const r of vua) (nhom[r.dang_bai_id] ??= []).push(r)
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>K11 xếp câu — câu trống và câu vừa</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"><script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>:root{--bg:#f6f7f9;--card:#fff;--tx:#1b1f24;--mu:#5b6573;--bd:#d9dee5;--ac:#1f5fbf;--wa:#b4501b}@media (prefers-color-scheme:dark){:root{--bg:#14171b;--card:#1d2127;--tx:#e8ebef;--mu:#9aa5b1;--bd:#333a43;--ac:#7fb0ff;--wa:#f0a070}}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.55 system-ui,sans-serif}main{max-width:900px;margin:0 auto;padding:16px}h1{font-size:22px}h2{font-size:19px;color:var(--ac);border-bottom:2px solid var(--bd);margin-top:28px}h3{font-size:15px;color:var(--wa);margin:18px 0 6px}
.c{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:10px 14px;margin:0 0 10px}.t{color:var(--mu);font-size:14px}.m{margin-top:6px;font-size:14px;color:var(--mu)}.w{color:var(--wa)}.lc{list-style:none;padding:0;margin:6px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 16px}</style></head><body><main>
<h1>K11 — đợt xếp 486 câu vào bản đồ (đã ghi: 382 gán, 98 đề xuất, 6 thiếu dạng)</h1>
<p class="t">Mức cao đã ghi thẳng làm gán (nguồn AI). Dưới đây là phần cần Thùy nhìn: <b>6 câu bản đồ chưa có dạng</b> và <b>${vua.length} câu “vừa”</b> (đang ở hàng duyệt, nhóm theo dạng đề xuất).</p>
<h2>A. ${trong.length} câu không dạng nào khớp (bản đồ thiếu dạng?)</h2>${trong.map(the).join('')}
<h2>B. ${vua.length} câu “vừa” theo dạng đề xuất (${Object.keys(nhom).length} dạng)</h2>
${Object.entries(nhom).sort((a, b) => b[1].length - a[1].length).map(([d, rs]) => `<h3>${d} · ${esc(ten[d] ?? '')} — ${rs.length} câu</h3>${rs.map(the).join('')}`).join('')}
</main></body></html>`
writeFileSync(RA, html)
console.log('A', trong.length, '· B', vua.length, 'câu /', Object.keys(nhom).length, 'dạng ·', (html.length / 1e3).toFixed(0), 'KB →', RA)
