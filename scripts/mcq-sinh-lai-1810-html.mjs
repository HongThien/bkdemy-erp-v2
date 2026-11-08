// Trang DUYỆT cho lô sinh lại 18/10 (form TN đọc sai đáp số) + danh sách nghi vấn — chỉ ĐỌC DB (tên rule).
//   node --env-file=.env scripts/mcq-sinh-lai-1810-html.mjs <ds.json> <kq.json> <ra.json> <ra.html>
// ds.json/kq.json: scripts/mcq-sinh-lai-1810.mjs --ds + mcq-auto.mjs --out · ra.json: scripts/mcq-ra-key.mjs --json
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
const [fDs, fKq, fRa, fOut] = process.argv.slice(2)
const ds = JSON.parse(readFileSync(fDs, 'utf8')), kq = new Map(JSON.parse(readFileSync(fKq, 'utf8')).map((x) => [x.ma_cau, x]))
const ra = JSON.parse(readFileSync(fRa, 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const rule = Object.fromEntries((await c.query('select ma, ten from dai_mcq_rule')).rows.map((r) => [r.ma, r.ten]))
const lg = Object.fromEntries((await c.query('select ma_cau, loi_giai from dai_cau_hoi where ma_cau = any($1)', [ds.map((x) => x.ma_cau)])).rows.map((r) => [r.ma_cau, r.loi_giai]))
await c.end()

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fixTex = (s) => { s = String(s ?? ''); return (s.match(/\$/g) || []).length % 2 ? s + '$' : s }
const tx = (s) => esc(fixTex(s)).replace(/\n/g, '<br>')
const tapLoi = (x) => {
  const d = String(x.dap_an_kho).replace(/\$/g, '')
  if (/\d \d{3}(?!\d)/.test(d)) return ['nghin', 'Cách hàng nghìn đọc thành phép nhân ("30 000" → 0)']
  if (/\d,\d/.test(d)) return ['phay', 'Phẩy thập phân đọc thành dấu ngăn cách ("12,61" → "12;61")']
  return ['doi', 'Đáp số kho đã sửa SAU khi sinh form — form cũ còn đáp số cũ']
}
const nhomLoi = { phay: 0, nghin: 0, doi: 0 }
const theoDang = new Map()
for (const x of ds) { const [k] = tapLoi(x); nhomLoi[k]++; if (!theoDang.has(x.dang)) theoDang.set(x.dang, []); theoDang.get(x.dang).push(x) }

const pa = (lc, cu) => `<ol class="pa">${(lc || []).map((l, i) => `<li class="${l.dung ? 'dung' : ''}"><b>${'ABCD'[i]}.</b> ${tx(l.text)}${l.dung ? ' <span class="tag ok">đúng</span>' : l.rule ? ` <span class="tag" title="${esc(l.duong_sai)}">${esc(l.rule)} · ${esc(rule[l.rule] ?? '')}</span>` : ''}</li>`).join('')}</ol>`
let toc = '', body = ''
for (const [dang, xs] of theoDang) {
  toc += `<a href="#${dang}">${dang} <small>${esc(xs[0].ten_dang)}</small> <b>${xs.length}</b></a>`
  body += `<h2 id="${dang}">${dang} — ${esc(xs[0].ten_dang)} <small>(${xs.length} câu)</small></h2>`
  for (const x of xs) {
    const m = kq.get(x.ma_cau), [k, ten] = tapLoi(x)
    body += `<section class="cau" data-loi="${k}" data-duyet="${x.da_duyet ? 1 : 0}">
<h3>${x.ma_cau} <span class="tag ${k}">${ten}</span>${x.da_duyet ? ' <span class="tag">đã duyệt trước đó</span>' : ' <span class="tag">chưa từng duyệt</span>'}${x.n_lam ? ` <span class="tag warn">${x.n_lam} lượt HS đã làm</span>` : ''}</h3>
<div class="de">${tx(x.de)}</div>
<div class="kho">Đáp số kho: <b>${tx(x.dap_an_kho)}</b></div>
<div class="hai"><div><div class="nhan moi">MỚI (chờ duyệt)</div>${m ? pa(m.lua_chon) : '<i>không sinh được</i>'}</div>
<div><div class="nhan cu">CŨ (sẽ vào kho rác)</div>${pa(x.lua_chon_cu)}</div></div>
${lg[x.ma_cau] ? `<details><summary>Lời giải kho</summary><div class="lg">${tx(lg[x.ma_cau])}</div></details>` : ''}
</section>`
  }
}
// ── Nghi vấn (KHÔNG sửa, chờ Thùy) ──
const phanSo = ra.PHAN_SO.filter((x) => x.da_duyet)
const theoDangPS = {}; for (const x of phanSo) (theoDangPS[x.dang + ' — ' + x.ten_dang] ??= []).push(x)
let nv = `<h2 id="nghi-van">Nghi vấn — đề/đáp số là SỐ THẬP PHÂN hoặc HỖN SỐ mà phương án là PHÂN SỐ (${phanSo.length} form đã duyệt)</h2>
<p class="meta">Không sửa gì. Giá trị phương án đúng vẫn bằng đáp số kho (cột "giá trị") — vấn đề là <b>hình thức</b>: đề bảo viết số thập phân/hỗn số mà 4 lựa chọn đều là phân số ⇒ HS không được kiểm đúng kỹ năng (ca T105040103023 đã dựng lại tay). Thùy chọn: sinh lại theo khuôn số thập phân/hỗn số, hay giữ (dạng mà đề thật sự hỏi phân số).</p>`
for (const [k, xs] of Object.entries(theoDangPS)) {
  nv += `<h3>${esc(k)} <small>(${xs.length})</small></h3><table><tr><th>Mã câu</th><th>Đề</th><th>Đáp số kho</th><th>Phương án</th><th>HS làm</th></tr>`
  for (const x of xs) nv += `<tr><td>${x.ma_cau}</td><td>${tx(x.de)}</td><td>${tx(x.dap_an_kho)}</td><td>${x.phuong_an.map(tx).join('<br>')}</td><td>${x.n_lam || ''}</td></tr>`
  nv += '</table>'
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt form TN sinh lại</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#fff;--fg:#1a1a1a;--mu:#666;--bd:#ddd;--ok:#e7f6ea;--okb:#2e7d32;--old:#fdf0f0;--tag:#f1f1f4}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#16171a;--fg:#e8e8ea;--mu:#9a9aa2;--bd:#33343a;--ok:#1d3323;--okb:#7bd389;--old:#3a2222;--tag:#2a2b31}}
body{background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,Segoe UI,Arial;max-width:1100px;margin:20px auto;padding:0 16px}
h1{font-size:21px}h2{font-size:17px;margin-top:34px;border-bottom:2px solid var(--bd);padding-bottom:4px}h3{font-size:14px;margin:0 0 6px}
.meta{color:var(--mu);font-size:13px}small{color:var(--mu);font-weight:normal}
.toc{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.toc a{border:1px solid var(--bd);border-radius:8px;padding:3px 8px;text-decoration:none;color:inherit;font-size:13px}
.loc{position:sticky;top:0;background:var(--bg);padding:8px 0;border-bottom:1px solid var(--bd);z-index:2;font-size:14px}
.cau{border:1px solid var(--bd);border-radius:10px;padding:12px 14px;margin:12px 0}.de{margin:4px 0 6px}.kho{margin-bottom:8px}
.hai{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:700px){.hai{grid-template-columns:1fr}}
.nhan{font-size:12px;font-weight:600;margin-bottom:2px}.nhan.moi{color:var(--okb)}.nhan.cu{color:#c62828}
.pa{margin:0;padding-left:18px}.pa li{padding:2px 4px;border-radius:5px}.pa li.dung{background:var(--ok)}
.hai>div:last-child .pa{opacity:.75}.hai>div:last-child .pa li{background:var(--old)}
.tag{display:inline-block;background:var(--tag);border-radius:6px;padding:0 6px;font-size:12px;color:var(--mu)}.tag.ok{color:var(--okb)}.tag.warn{color:#b26a00}
.tag.phay,.tag.nghin{color:#c62828}.tag.doi{color:#6a1b9a}
details{margin-top:6px;font-size:13px}.lg{color:var(--mu)}
table{border-collapse:collapse;width:100%;font-size:13px;margin:6px 0 18px}td,th{border:1px solid var(--bd);padding:4px 6px;vertical-align:top;text-align:left}
</style></head><body>
<h1>Duyệt form trắc nghiệm sinh lại — Toán (Đại), 18/10</h1>
<p class="meta">${ds.length} câu có form máy sinh đọc sai đáp số kho (${nhomLoi.phay} phẩy thập phân · ${nhomLoi.nghin} cách hàng nghìn · ${nhomLoi.doi} đáp số kho đổi sau khi sinh form).
${ds.filter((x) => x.da_duyet).length} form từng được duyệt, ${ds.filter((x) => !x.da_duyet).length} chưa từng duyệt. Form MỚI viết số đúng khuôn của đáp số kho (phẩy thập phân <code>{,}</code>, giữ số 0 sau dấu phẩy, cách hàng nghìn), phương án nhiễu theo lỗi thật (R363–R370). Tất cả đã qua cổng kiểm máy mới (so chữ số + giá trị với đáp số kho). Form mới đang <b>chưa duyệt</b> — duyệt trên app như mọi form.
Câu sửa tay (9 câu HS báo) không nằm trong trang này. Cuối trang: <a href="#nghi-van">danh sách nghi vấn</a>.</p>
<div class="loc">Lọc: <label><input type="radio" name="l" value="" checked> tất cả</label> <label><input type="radio" name="l" value="phay"> phẩy thập phân</label> <label><input type="radio" name="l" value="nghin"> hàng nghìn</label> <label><input type="radio" name="l" value="doi"> đáp số kho đổi</label></div>
<div class="toc">${toc}<a href="#nghi-van">Nghi vấn <b>${phanSo.length}</b></a></div>
${body}${nv}
<script>document.querySelectorAll('input[name=l]').forEach(r=>r.onchange=()=>{const v=r.value;document.querySelectorAll('.cau').forEach(s=>s.style.display=!v||s.dataset.loi===v?'':'none')})</script>
</body></html>`
writeFileSync(fOut, html)
console.log('→', fOut, Math.round(html.length / 1024) + ' KB', nhomLoi)
