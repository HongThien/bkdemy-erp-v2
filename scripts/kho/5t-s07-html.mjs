// 5t-s07-html.mjs — trang HTML để Thùy chốt BẬC TỐI THIỂU (S/A/B/C/D) và MỨC ĐỘ (1–5) cho các dạng 5T còn trống (S07). Chỉ ĐỌC (số liệu từ dump JSON), không ghi DB.
//   node scripts/kho/5t-s07-html.mjs <dump.json>  → docs/s07-bac-muc-do-5T.html
import { readFileSync, writeFileSync } from 'node:fs'
const rows = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const E = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const mode = (a) => { const m = {}; for (const x of a) m[x] = (m[x] || 0) + 1; const e = Object.entries(m).sort((p, q) => q[1] - p[1]); return e.length ? e[0][0] : null }
const co = rows.filter((r) => r.muc_do && r.bac_toi_thieu)
const theo = (key) => { const g = {}; for (const r of co) (g[r[key]] ??= []).push(r); return g }
const gNhom = theo('nhom'), gCd = theo('chuyen_de'), gChu = theo('chu_de')
const heur = (ten) => /cơ bản|đổi đơn vị|nhận biết|công thức/i.test(ten) ? 2 : /kép|nâng cao|tổng hợp|phức|hai tỉ số|khử|đường tròn|nhiều lần/i.test(ten) ? 4 : null
const gợi = (r) => {
  for (const [g, ten] of [[gNhom[r.nhom], 'cùng nhóm'], [gCd[r.chuyen_de], 'cùng chuyên đề'], [gChu[r.chu_de], 'cùng chủ đề']]) {
    if (g?.length) { const h = heur(r.ten); return { muc: h ?? Number(mode(g.map((x) => x.muc_do))), bac: mode(g.map((x) => x.bac_toi_thieu)), co_so: ten + (h ? ' + tên dạng' : ''), manh: ten === 'cùng nhóm' ? 2 : 1 } }
  }
  return { muc: heur(r.ten) ?? 3, bac: 'B', co_so: 'mặc định (chưa có dạng cùng nhóm nào được chốt)', manh: 0 }
}
const trong = rows.filter((r) => !(r.muc_do && r.bac_toi_thieu))
const sel = (id, opts, sug) => `<select data-id="${id}">${['', ...opts].map((o) => `<option value="${o}">${o || '—'}</option>`).join('')}</select>`
let h = '', cur = '', n = 0
for (const r of rows) {
  if (r.chu_de !== cur) { cur = r.chu_de; h += `<tr><th colspan="7">${E(cur)}</th></tr>` }
  if (r.muc_do && r.bac_toi_thieu) { h += `<tr class="da"><td>${E(r.nhom)}</td><td>${E(r.ten)}</td><td>${r.n_cau}</td><td colspan="2" class="mut">đã chốt: mức độ ${r.muc_do} · bậc ${r.bac_toi_thieu}</td><td></td><td></td></tr>`; continue }
  const g = gợi(r); n++
  h += `<tr><td>${E(r.nhom)}</td><td><b>${E(r.ten)}</b><div class="small mut">${r.id}</div></td><td>${r.n_cau}</td><td class="sug s${g.manh}">mức độ <b>${g.muc}</b> · bậc <b>${g.bac}</b><div class="small">${E(g.co_so)}</div></td>
  <td><select data-m="${r.id}"><option value="">—</option>${[1, 2, 3, 4, 5].map((v) => `<option value="${v}" ${'' }>${v}</option>`).join('')}</select></td>
  <td><select data-b="${r.id}"><option value="">—</option>${['S', 'A', 'B', 'C', 'D'].map((v) => `<option value="${v}">${v}</option>`).join('')}</select></td>
  <td><button class="mini" data-nhan="${r.id}" data-muc="${g.muc}" data-bac="${g.bac}">Nhận gợi ý</button></td></tr>`
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>5T: bậc tối thiểu + mức độ (S07)</title>
<style>:root{--bg:#f7f8fa;--card:#fff;--ink:#1c2430;--mut:#5d6b7c;--line:#dfe4ea;--acc:#1f7a4d}@media (prefers-color-scheme:dark){:root{--bg:#12161b;--card:#1a2027;--ink:#e6ebf1;--mut:#94a1b2;--line:#2b3440;--acc:#5fd09a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}main{max-width:1200px;margin:0 auto;padding:20px 16px 90px}h1{font-size:22px;margin:0 0 4px}.sub{color:var(--mut)}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:14px}th,td{border:1px solid var(--line);padding:5px 8px;vertical-align:top;text-align:left}th{background:var(--bg)}tr.da td{background:var(--bg)}.mut{color:var(--mut)}.small{font-size:12px}
.sug.s2{background:#e8f6ee}.sug.s1{background:#fff6e0}.sug.s0{background:#fde9e9}@media (prefers-color-scheme:dark){.sug.s2{background:#16301f}.sug.s1{background:#35290f}.sug.s0{background:#3a1b1b}}
select{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:3px 6px}button{font:inherit;background:var(--acc);color:#fff;border:0;border-radius:8px;padding:8px 14px;cursor:pointer}button.mini{padding:2px 8px;font-size:12px}
#bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:8px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:10px 0}</style></head><body><main>
<h1>5T — chốt BẬC TỐI THIỂU và MỨC ĐỘ cho ${n} dạng còn trống</h1>
<p class="sub">21/11/2026 · S07. Hiện ${rows.length - n}/${rows.length} dạng đã chốt. Cột "gợi ý" lấy theo dạng đã chốt cùng nhóm (xanh = có ≥1 dạng cùng nhóm), cùng chuyên đề (vàng) hoặc mặc định (đỏ — gần như chưa có cơ sở). <b>Chưa ghi gì vào DB.</b></p>
<div class="card"><b>Cách dùng.</b> Mỗi dòng chọn mức độ (1–5) và bậc tối thiểu (S/A/B/C/D), hoặc bấm "Nhận gợi ý". Dòng bỏ trống = giữ trống. Xong bấm "Sao chép" rồi dán cho em; em ghi vào bản đồ (thử ROLLBACK trước). Gợi ý chỉ là điểm xuất phát, chỉ Thùy chốt được.<br>
<button id="all">Nhận gợi ý cho các dòng XANH (cùng nhóm)</button></div>
<table><tr><th>Nhóm</th><th>Dạng</th><th>Câu</th><th>Gợi ý</th><th>Mức độ</th><th>Bậc</th><th></th></tr>${h}</table>
<div id="bar"><button id="cp">Sao chép quyết định</button><span id="msg" class="mut small"></span></div>
<script>const K='5t-s07';let st={};try{st=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(st))}catch(e){}};
document.querySelectorAll('select[data-m]').forEach(s=>{s.value=(st[s.dataset.m]||{}).m||'';s.onchange=()=>{(st[s.dataset.m]??={}).m=s.value;sv()}});
document.querySelectorAll('select[data-b]').forEach(s=>{s.value=(st[s.dataset.b]||{}).b||'';s.onchange=()=>{(st[s.dataset.b]??={}).b=s.value;sv()}});
function nhan(b){const id=b.dataset.nhan;(st[id]??={}).m=b.dataset.muc;st[id].b=b.dataset.bac;document.querySelector('select[data-m="'+id+'"]').value=b.dataset.muc;document.querySelector('select[data-b="'+id+'"]').value=b.dataset.bac;sv()}
document.querySelectorAll('button[data-nhan]').forEach(b=>b.onclick=()=>nhan(b));
document.getElementById('all').onclick=()=>document.querySelectorAll('tr:has(.sug.s2) button[data-nhan]').forEach(nhan);
document.getElementById('cp').onclick=()=>{const L=Object.entries(st).filter(([k,v])=>v.m||v.b).map(([k,v])=>k+': mức độ '+(v.m||'—')+', bậc '+(v.b||'—'));const t='5T S07 quyết định:\\n'+(L.join('\\n')||'(chưa chọn)');navigator.clipboard.writeText(t).then(()=>{document.getElementById('msg').textContent='Đã sao chép '+L.length+' dòng.'}).catch(()=>{document.getElementById('msg').textContent=t})};</script>
</main></body></html>`
writeFileSync('docs/s07-bac-muc-do-5T.html', html)
const dem = { xanh: 0, vang: 0, do: 0 }; for (const r of trong) { const g = gợi(r); dem[['do', 'vang', 'xanh'][g.manh]]++ }
console.log({ tong: rows.length, trong: n, ...dem, kb: Math.round(html.length / 1024) })
