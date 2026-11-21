// clc6-ve-lai-html.mjs — trang HTML so sánh hình CŨ (Word) ↔ MỚI (vẽ lại) + câu NTT 2019·1 dựng lại + các đề đã sửa theo quyết định Thùy 21/11.
//   node scripts/kho/clc6-ve-lai-html.mjs <thư mục ảnh cũ>  → docs/ve-lai-hinh-clc-5T.html
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const CU = process.argv[2]; const HD = 'kho-rules/dai/hinh-de/'
const E = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const b64 = (p) => (existsSync(p) ? 'data:image/png;base64,' + readFileSync(p).toString('base64') : null)
const de = JSON.parse(readFileSync('kho-rules/dai/lo/clc6/de-da-sua.json', 'utf8')); const Q = new Map(); for (const x of de) for (const q of x.cau) Q.set(q.ma_nguon, q)
const slug = (s) => s.replace(/ · /g, '-').replace(/[ .]/g, '-')
const H = [['LTV 2018 · 13', 'a'], ['LTV 2019 · 20', 'a'], ['LTV 2020 · 11', 'a'], ['NN 2024 · P1.5', 'a'], ['NN 2024-TT1 · P1.5', 'a'], ['NTL 2024 · P1.10', 'a'], ['NTL 2025 · P1.8', 'a'], ['NTT 2025 · 6', 'a'], ['NTL 2024 · P2.2', 'd'], ['NTT 2019 · 1', 'moi']]
const sel = (id) => `<select data-id="${id}"><option value="">—</option><option value="ok">Đạt</option><option value="sua">Sửa lại</option></select> <input type="text" data-note="${id}" placeholder="ghi chú" size="18">`
let h = ''
for (const [ma, loai] of H) {
  const tep = 'CLC6-' + slug(ma) + '.png'; const q = Q.get(ma)
  const cu = loai === 'moi' ? null : b64(CU + '/' + tep)
  h += `<div class="c"><h3>${E(ma)} <span class="mut small">${loai === 'moi' ? 'DỰNG MỚI' : loai === 'd' ? 'vẽ lại · đề sửa AM = 2/5 AD' : 'vẽ lại · ảnh gốc nhỏ/mờ'}</span></h3><div class="m">${E(q.noi_dung).replace(/\n/g, '<br>')}</div>
  <div class="two">${cu ? `<div><div class="lab">Cũ (Word)</div><div class="im"><img src="${cu}"></div></div>` : ''}<div><div class="lab">Mới</div><div class="im"><img src="${b64(HD + tep)}"></div></div></div>
  ${loai === 'moi' ? `<div class="warn">Câu DỰNG LẠI, không phải đề gốc (đề gốc do HS nhớ lại, chỉ có "Nam gặp biểu tượng nào?", đáp án sách "siêu thị"). Đáp án: <b>Siêu thị</b>. Ghi chú trong kho: "đề dựng lại".</div>` : ''}${sel('H-' + ma)}</div>`
}
const sua = [['LTV 2024 · 2', 'Tìm số tự nhiên KHÁC 0 nhỏ nhất chia hết cho 5 và 7 (bỏ dòng ngoặc) → 35'], ['NTL 2024 · P2.2', 'AM = 2/5 AD → 20 cm²; 5/2; 5/2'], ['AMS 2020 · 8', 'Hỏi "vào năm 2020" → 24 tuổi'], ['TX 2023 · 1', 'Thêm D. 193,28 (đáp án A)'], ['ARC 2022-CB · 25', 'Thêm D. 23 (đáp án C)']]
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CLC → 5T: hình vẽ lại + đề đã sửa</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<style>:root{--bg:#f7f8fa;--card:#fff;--ink:#1c2430;--mut:#5d6b7c;--line:#dfe4ea;--acc:#1f7a4d}@media (prefers-color-scheme:dark){:root{--bg:#12161b;--card:#1a2027;--ink:#e6ebf1;--mut:#94a1b2;--line:#2b3440;--acc:#5fd09a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}main{max-width:1100px;margin:0 auto;padding:20px 16px 90px}h1{font-size:22px;margin:0 0 4px}h2{font-size:18px;margin:30px 0 8px;border-bottom:2px solid var(--acc);padding-bottom:4px}h3{font-size:16px;margin:0 0 6px}
.sub{color:var(--mut)}.mut{color:var(--mut)}.small{font-size:13px}.m{font-size:14px;margin:4px 0 8px}.c{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:12px 0}
.two{display:flex;gap:14px;flex-wrap:wrap}.two>div{flex:1;min-width:260px}.lab{font-size:12px;color:var(--mut);margin-bottom:2px}.im{background:#fff;border:1px solid var(--line);border-radius:6px;padding:6px;display:flex;justify-content:center}.im img{max-width:100%;height:auto}
.warn{background:#fff6e0;border:1px solid #e5c56a;border-radius:6px;padding:6px 10px;margin:8px 0;color:#3b2f00}
select,input[type=text]{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:3px 6px}button{font:inherit;background:var(--acc);color:#fff;border:0;border-radius:8px;padding:8px 14px;cursor:pointer}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:14px}th,td{border:1px solid var(--line);padding:6px 8px;text-align:left}th{background:var(--bg)}
#bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:8px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}</style></head><body><main>
<h1>CLC → 5T: 10 hình vẽ lại / dựng mới + các đề đã sửa</h1>
<p class="sub">21/11/2026 · theo quyết định Thùy: A2 dựng lại câu + vẽ hình · 8 hình vẽ lại · NTL 2024 P2.2 sửa AM = 2/5 AD và vẽ lại. <b>Chưa ghi DB.</b> Duyệt hình xong em chạy ghi 81 câu + dựng 42 đề.</p>
<h2>Đề đã sửa theo quyết định (đã áp vào nguồn)</h2><table><tr><th>Câu</th><th>Sửa</th></tr>${sua.map(([a, b]) => `<tr><td><b>${E(a)}</b></td><td>${E(b)}</td></tr>`).join('')}<tr><td><b>A3, A4, B1–B6</b></td><td>Thêm phương án D (TX 2023·1 và ARC 2022-CB·25) · 6 đề sửa bằng chứng yếu giữ bản sửa (Thùy gật).</td></tr><tr><td><b>LTV 2024 · 19, 20</b></td><td>Không có đề — bỏ qua (chưa tạo câu), đề LTV 2024 còn 18 câu.</td></tr><tr><td><b>C4 (NTT 2020·P1.9) · C5 (NS-HB1 P2.1)</b></td><td>Thùy chưa chọn — em giữ nguyên cách ghi hiện tại (515 000 đồng; 3 3/560 giờ) và đánh dấu "chưa chắc" cho người kiểm.</td></tr></table>
<h2>Hình: cũ ↔ mới</h2>${h}
<div id="bar"><button id="cp">Sao chép quyết định</button><span id="msg" class="mut small"></span></div>
<script>const K='clc-ve-lai-21-11';let st={};try{st=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
document.querySelectorAll('select[data-id]').forEach(s=>{s.value=(st[s.dataset.id]||{}).v||'';s.onchange=()=>{(st[s.dataset.id]??={}).v=s.value;sv()}});document.querySelectorAll('input[data-note]').forEach(i=>{i.value=(st[i.dataset.note]||{}).n||'';i.oninput=()=>{(st[i.dataset.note]??={}).n=i.value;sv()}});
function sv(){try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}}
document.getElementById('cp').onclick=()=>{const L=Object.entries(st).filter(([k,v])=>v.v||v.n).map(([k,v])=>k+': '+(v.v||'—')+(v.n?' — '+v.n:''));const t='Hình CLC→5T:\\n'+(L.join('\\n')||'(chưa chọn)');navigator.clipboard.writeText(t).then(()=>{document.getElementById('msg').textContent='Đã sao chép '+L.length+' dòng.'}).catch(()=>{document.getElementById('msg').textContent=t})};</script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script><script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
</main></body></html>`
writeFileSync('docs/ve-lai-hinh-clc-5T.html', html); console.log('ok', Math.round(html.length / 1024), 'KB')
