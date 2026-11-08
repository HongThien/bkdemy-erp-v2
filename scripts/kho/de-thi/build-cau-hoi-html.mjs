// Dựng MỘT trang HTML "câu hỏi chờ CEO trả lời" (Thùy 20/10: "các câu hỏi cần t trả lời đưa vào 1 file html để t check").
// Phần 1 = quyết định chung (chọn bằng nút) · Phần 2 = từng chỗ "Chưa chắc" kèm ảnh nguyên câu (Giữ như bản soạn / Sửa + ghi chú).
// Có nút "Sao chép câu trả lời" → CEO dán lại cho Claude. Lựa chọn lưu trong trình duyệt (localStorage, try/catch).
//   QUYET_JSON=<tệp> node scripts/kho/de-thi/build-duyet-html.mjs …   (sinh danh sách chỗ cần quyết)
//   node scripts/kho/de-thi/build-cau-hoi-html.mjs <quyet.json> <quyet-chung.json> <ra.html>
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const [QJ, CJ, RA] = process.argv.slice(2)
if (!QJ || !CJ || !RA) { console.error('Dùng: build-cau-hoi-html.mjs <quyet.json> <quyet-chung.json> <ra.html>'); process.exit(2) }
const D = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/k7'
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => String(s ?? '').split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'))).join('').replace(/\n/g, '<br>')
const img = (n) => { const p = join(D, 'can-xem', n); return existsSync(p) ? `<img src="data:image/png;base64,${readFileSync(p).toString('base64')}" alt="${esc(n)}">` : '' }
const chung = JSON.parse(readFileSync(CJ, 'utf8'))
const quyet = JSON.parse(readFileSync(QJ, 'utf8')).filter((q) => !['CKI-33', 'CKI-28', 'CKI-09'].includes(q.ma))

const p1 = chung.map((c, i) => `<section class="c" data-k="${c.id}"><div class="t"><b>${i + 1}. ${esc(c.tieu)}</b> <span class="tag">${esc(c.nhom)}</span></div><div class="v">${fmt(c.noi)}</div>${(c.anh || []).map(img).join('')}
<div class="o">${c.lc.map((l, k) => `<label><input type="radio" name="${c.id}" value="${esc(l)}"> ${esc(l)}</label>`).join('')}</div><input class="gc" placeholder="ghi chú (nếu có)" data-g="${c.id}"></section>`).join('')

const p2 = quyet.map((q, i) => { const id = `Q${i + 1}`; return `<section class="c" data-k="${id}" data-nhan="${esc(q.ma + ' · ' + q.cau)}"><div class="t"><b>${i + 1}. ${esc(q.ma)} · ${esc(q.cau)}</b> <span class="tag">${esc((q.tieu || '').slice(0, 60))}${q.trang ? ' · trang ' + esc(q.trang) : ''}</span></div><div class="v">${fmt(q.vd)}</div>${(q.anh || []).map(img).join('')}
<div class="o"><label><input type="radio" name="${id}" value="giữ như bản soạn"> Giữ như bản soạn</label><label><input type="radio" name="${id}" value="sửa"> Sửa (ghi ở ô dưới)</label><label><input type="radio" name="${id}" value="bỏ câu"> Bỏ câu này</label></div><input class="gc" placeholder="ghi chú / cách sửa" data-g="${id}"></section>` }).join('')

writeFileSync(RA, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>K7 — câu hỏi chờ Thùy trả lời</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"><script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>:root{--bg:#f6f7f9;--c:#fff;--t:#1b1f24;--m:#5b6573;--b:#d9dee5;--a:#1f5fbf;--ok:#1a7f4b}@media(prefers-color-scheme:dark){:root{--bg:#14171b;--c:#1d2127;--t:#e8ebef;--m:#9aa5b1;--b:#333a43;--a:#7fb0ff;--ok:#5fcf93}}
body{margin:0;background:var(--bg);color:var(--t);font:16px/1.55 system-ui,sans-serif}main{max-width:900px;margin:0 auto;padding:16px 16px 140px}h1{font-size:22px}h2{font-size:19px;color:var(--a);margin:28px 0 8px}
.c{background:var(--c);border:1px solid var(--b);border-radius:10px;padding:10px 14px;margin:0 0 12px}.c.xong{border-color:var(--ok)}.t{margin-bottom:4px}.tag{font-size:12px;color:var(--m);border:1px solid var(--b);border-radius:10px;padding:1px 8px;margin-left:4px}.v{margin:4px 0 8px}
img{max-width:100%;border:2px solid #b4501b;border-radius:6px;background:#fff;margin:4px 0;display:block}.o{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:6px}.o label{cursor:pointer}.gc{width:100%;box-sizing:border-box;margin-top:6px;padding:6px 8px;border:1px solid var(--b);border-radius:6px;background:var(--bg);color:var(--t)}
.bar{position:fixed;left:0;right:0;bottom:0;background:var(--c);border-top:2px solid var(--a);padding:8px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}.bar button{background:var(--a);color:#fff;border:0;border-radius:8px;padding:8px 14px;font-size:15px;cursor:pointer}textarea{width:100%;height:90px;margin-top:6px}</style></head><body><main>
<h1>Toán 7 — câu hỏi chờ Thùy trả lời</h1>
<p style="color:var(--m)">Chọn từng mục (lưu tự động trong trình duyệt). Xong bấm <b>Sao chép câu trả lời</b> ở thanh dưới rồi dán cho Claude. Mục chưa chọn = chưa quyết. Mỗi chỗ có ảnh nguyên câu từ đề gốc; xem đề + lời giải đầy đủ ở <code>K7-duyet-tat-ca.html</code> và <code>DC-GKI-moi-duyet.html</code>.</p>
<h2>Phần 1. Quyết định chung (${chung.length})</h2>${p1}
<h2>Phần 2. Từng chỗ "Chưa chắc" của đề / đề cương (${quyet.length})</h2>${p2}
</main><div class="bar"><button id="cp">Sao chép câu trả lời</button><span id="dem" style="color:var(--m)"></span><textarea id="kq" readonly style="display:none"></textarea></div>
<script>
const LS='k7-tra-loi-v1';let st={};try{st=JSON.parse(localStorage.getItem(LS)||'{}')}catch(e){}
const luu=()=>{try{localStorage.setItem(LS,JSON.stringify(st))}catch(e){}}
const cards=[...document.querySelectorAll('.c[data-k]')]
const cap=()=>{let n=0;cards.forEach(c=>{const k=c.dataset.k;const x=st[k];c.classList.toggle('xong',!!(x&&x.v));if(x&&x.v)n++});document.getElementById('dem').textContent='Đã chọn '+n+'/'+cards.length}
cards.forEach(c=>{const k=c.dataset.k;const x=st[k]||{};
 c.querySelectorAll('input[type=radio]').forEach(r=>{if(x.v===r.value)r.checked=true;r.addEventListener('change',()=>{st[k]=Object.assign(st[k]||{},{v:r.value});luu();cap()})});
 const g=c.querySelector('.gc');if(x.g)g.value=x.g;g.addEventListener('input',()=>{st[k]=Object.assign(st[k]||{},{g:g.value});luu()})});
cap()
document.getElementById('cp').onclick=()=>{const out=[];cards.forEach(c=>{const k=c.dataset.k,x=st[k];if(!x||(!x.v&&!x.g))return;const ten=c.querySelector('.t b').textContent.trim();out.push(ten+' → '+(x.v||'(chưa chọn)')+(x.g?' | ghi chú: '+x.g:''))});
 const s=out.join('\\n')||'(chưa trả lời mục nào)';const ta=document.getElementById('kq');ta.style.display='block';ta.value=s;ta.select();try{navigator.clipboard.writeText(s)}catch(e){document.execCommand('copy')}}
</script></body></html>`)
console.log('phần 1:', chung.length, '· phần 2:', quyet.length)
