// B3 — dựng HTML DUYỆT cho các câu máy đề xuất ĐỔI DẠNG (câu đã có dòng gán, máy khớp lại ra dạng khác). CHỈ ĐỌC DB, không ghi gì.
//   node scripts/bdm-b3-doi-dang-html.mjs <doi-dang.json> <ra.html> [khối]
// doi-dang.json = mảng {ma_cau, cu, cu_ten, moi, moi_ten, chac, ly_do} (sinh từ so sánh ket_qua.json với dai_bdm_gan_cau).
// Quy tắc Thùy 22/10: câu đổi dạng ⇒ 100% phải duyệt, không ghi thẳng. Trang có Giữ / Đổi / Dạng khác + "Sao chép câu trả lời".
import pg from 'pg'
import fs from 'node:fs'
const [IN, OUT, KHOI = '8'] = process.argv.slice(2)
if (!IN || !OUT) { console.error('Dùng: node scripts/bdm-b3-doi-dang-html.mjs <doi-dang.json> <ra.html> [khối]'); process.exit(2) }
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? env }); await c.connect()
const doi = JSON.parse(fs.readFileSync(IN, 'utf8'))
const duong = Object.fromEntries((await c.query(`select d.id, ch.ten||' › '||n.ten nhom from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chuyen_de ch on ch.id=n.chuyen_de_id`)).rows.map((r) => [r.id, r.nhom]))
const mo = Object.fromEntries((await c.query(`select id, left(regexp_replace(mo_ta,'\\s+',' ','g'),220) mo_ta from dai_bdm_dang_bai`)).rows.map((r) => [r.id, r.mo_ta]))
const q = Object.fromEntries((await c.query(`select ma_cau, noi_dung, loai_cau, lua_chon, dap_an, left(coalesce(loi_giai,''),900) lg, anh_de from dai_cau_hoi where ma_cau = any($1)`, [doi.map((d) => d.ma_cau)])).rows.map((r) => [r.ma_cau, r]))
await c.end()
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => String(s ?? '').split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p))).join('').replace(/\n/g, '<br>')
const cards = doi.map((d, i) => {
  const x = q[d.ma_cau]
  return `<section class="c" data-k="${d.ma_cau}" data-nhan="${esc(d.ma_cau)}">
<div class="t"><b>${i + 1}. ${esc(d.ma_cau)}</b> <span class="tag">${esc(x.loai_cau)}</span> <span class="tag">máy: ${d.chac === 'cao' ? 'CAO' : 'VỪA'}</span>${x.anh_de ? ' <span class="tag w">đề có hình</span>' : ''}</div>
<div class="v">${fmt(x.noi_dung)}${x.lua_chon ? '<br>' + esc(JSON.stringify(x.lua_chon)) : ''}</div>
${x.dap_an ? `<div class="s">Đáp án: ${fmt(x.dap_an)}</div>` : ''}${x.lg ? `<details><summary>Lời giải (rút gọn)</summary><div class="s">${fmt(x.lg)}</div></details>` : ''}
<div class="so"><div class="b cu"><div class="h">Đang gán (AI gán trước)</div><b>${esc(d.cu.slice(3))} ${esc(d.cu_ten)}</b><div class="p">${esc(duong[d.cu])}</div><div class="mt">${esc(mo[d.cu])}</div></div>
<div class="b moi"><div class="h">Máy đề xuất sau khi sửa bản đồ</div><b>${esc(d.moi.slice(3))} ${esc(d.moi_ten)}</b><div class="p">${esc(duong[d.moi])}</div><div class="mt">${esc(mo[d.moi])}</div><div class="ld">Lý do: ${esc(d.ly_do)}</div></div></div>
<div class="o"><label><input type="radio" name="${d.ma_cau}" value="giữ ${d.cu}"> Giữ dạng đang gán</label><label><input type="radio" name="${d.ma_cau}" value="đổi sang ${d.moi}"> Đổi sang dạng máy đề xuất</label><label><input type="radio" name="${d.ma_cau}" value="dạng khác"> Dạng khác (ghi mã bên dưới)</label></div><input class="gc" placeholder="ghi chú / mã dạng khác" data-g="${d.ma_cau}"></section>`
}).join('\n')
const LS = 'doi-dang-' + KHOI + '-' + Date.now().toString(36)
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>K${KHOI} — duyệt đổi dạng</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"><script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>:root{--bg:#f6f7f9;--c:#fff;--t:#1b1f24;--m:#5b6573;--b:#d9dee5;--a:#1f5fbf;--ok:#1a7f4b;--cu:#fff4e5;--moi:#e8f3ff}@media(prefers-color-scheme:dark){:root{--bg:#14171b;--c:#1d2127;--t:#e8ebef;--m:#9aa5b1;--b:#333a43;--a:#7fb0ff;--ok:#5fcf93;--cu:#3a2f1c;--moi:#1c2f45}}
body{margin:0;background:var(--bg);color:var(--t);font:16px/1.55 system-ui,sans-serif}main{max-width:960px;margin:0 auto;padding:16px 16px 120px}h1{font-size:22px}
.c{background:var(--c);border:1px solid var(--b);border-radius:10px;padding:10px 14px;margin:0 0 14px}.c.xong{border-color:var(--ok)}.tag{font-size:12px;color:var(--m);border:1px solid var(--b);border-radius:8px;padding:0 6px}.tag.w{color:#b4501b}
.v{margin:6px 0}.s{font-size:14px;color:var(--m);margin:4px 0}.so{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0}@media(max-width:700px){.so{grid-template-columns:1fr}}
.b{border-radius:8px;padding:8px 10px;border:1px solid var(--b)}.b.cu{background:var(--cu)}.b.moi{background:var(--moi)}.h{font-size:12px;color:var(--m);text-transform:uppercase}.p{font-size:13px;color:var(--m)}.mt{font-size:13px;margin-top:4px}.ld{font-size:13px;margin-top:6px;border-top:1px dashed var(--b);padding-top:4px}
.o{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:6px}.o label{cursor:pointer}.gc{width:100%;box-sizing:border-box;margin-top:6px;padding:6px;border:1px solid var(--b);border-radius:6px;background:var(--bg);color:var(--t)}
.bar{position:fixed;left:0;right:0;bottom:0;background:var(--c);border-top:2px solid var(--a);padding:8px 16px;display:flex;gap:10px;align-items:center}.bar button{background:var(--a);color:#fff;border:0;border-radius:8px;padding:8px 14px;font-size:15px;cursor:pointer}</style></head><body><main>
<h1>Toán ${KHOI} — duyệt ${doi.length} câu bị máy đề xuất ĐỔI DẠNG</h1>
<p style="color:var(--m)">Các câu này đang được AI gán vào một dạng; sau khi bản đồ được cập nhật, máy xếp lại thì ra dạng KHÁC. Theo quy tắc của Thùy, mọi câu đổi dạng đều phải duyệt — <b>chưa có gì được ghi vào DB</b>. Chọn từng câu (lưu tự động trong trình duyệt), xong bấm <b>Sao chép câu trả lời</b> rồi dán cho Claude.</p>
${cards}</main><div class="bar"><button id="doi">Đổi hết sang dạng máy</button><button id="giu">Giữ hết dạng đang gán</button><button id="cp">Sao chép câu trả lời</button><span id="dem" style="color:var(--m)"></span></div>
<script>
const LS='${LS}';let st={};try{st=JSON.parse(localStorage.getItem(LS)||'{}')}catch(e){}
const luu=()=>{try{localStorage.setItem(LS,JSON.stringify(st))}catch(e){}}
const cards=[...document.querySelectorAll('.c[data-k]')]
const cap=()=>{let n=0;cards.forEach(c=>{const x=st[c.dataset.k];c.classList.toggle('xong',!!(x&&x.v));if(x&&x.v)n++});document.getElementById('dem').textContent='Đã chọn '+n+'/'+cards.length}
cards.forEach(c=>{const k=c.dataset.k;const x=st[k]||{};c.querySelectorAll('input[type=radio]').forEach(r=>{if(x.v&&r.value===x.v)r.checked=true;r.onchange=()=>{st[k]=Object.assign(st[k]||{},{v:r.value});luu();cap()}});const g=c.querySelector('.gc');g.value=x.g||'';g.oninput=()=>{st[k]=Object.assign(st[k]||{},{g:g.value});luu()}});cap()
const hang=(p)=>{cards.forEach(c=>{const r=[...c.querySelectorAll('input[type=radio]')].find(x=>x.value.startsWith(p));if(r){r.checked=true;st[c.dataset.k]=Object.assign(st[c.dataset.k]||{},{v:r.value})}});luu();cap()}
document.getElementById('doi').onclick=()=>hang('đổi sang');document.getElementById('giu').onclick=()=>hang('giữ ');
document.getElementById('cp').onclick=()=>{const t=cards.map(c=>{const x=st[c.dataset.k]||{};return c.dataset.nhan+': '+(x.v||'(chưa quyết)')+(x.g?' — '+x.g:'')}).join('\\n');navigator.clipboard.writeText(t).then(()=>alert('Đã sao chép '+cards.length+' dòng'),()=>{prompt('Sao chép:',t)})}
</script></body></html>`
fs.writeFileSync(OUT, html)
console.log('ok', doi.length, '→', OUT)
