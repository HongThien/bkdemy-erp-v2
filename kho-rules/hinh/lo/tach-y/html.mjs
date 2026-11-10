// Dựng HTML duyệt tách ý từ nhap.json (máy cắt) — chỉ đọc file, không đụng DB.
import fs from 'fs'
const d = JSON.parse(fs.readFileSync('kho-rules/hinh/lo/tach-y/nhap.json', 'utf8'))
const sach = d.filter((o) => o.sach)
const esc = (s) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
const theoKhoi = {}; for (const o of sach) (theoKhoi[o.khoi] ??= []).push(o)
let body = ''
for (const [k, ds] of Object.entries(theoKhoi)) {
  body += `<h2 id="k${k}">Khối ${k} — ${ds.length} bài</h2>`
  for (const o of ds) {
    body += `<section class="bai"><div class="dau"><b>${o.ma_cau}</b> · ${esc(o.ten_bai)} · ${o.ys.length} ý${o.da_duyet ? ' · đã duyệt' : ''}</div>
<div class="hai"><div class="cot"><div class="nhan">ĐỀ GỐC (cả bài)</div><div class="tx">${esc(o.noi_dung)}</div>${o.anh_de ? `<img src="${o.anh_de}">` : ''}</div>
<div class="cot"><div class="nhan">SAU KHI TÁCH</div><div class="dan">${esc(o.loi_dan)}</div>
${o.ys.map((y) => `<div class="y"><div><b class="ny">${y.nhan})</b> ${esc(y.cau_hoi)}</div><details><summary>Lời giải ý ${y.nhan}</summary><div class="lg">${esc(y.loi_giai)}</div></details></div>`).join('')}
${o.lg_dau ? `<div class="canh">⚠ Lời giải có đoạn trước ý a (sẽ mất nếu không xử lý): ${esc(o.lg_dau)}</div>` : ''}</div></div></section>`
  }
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tách ý Hình – Học</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>body{font:15px/1.6 system-ui,sans-serif;margin:0;padding:16px;background:#f8fafc;color:#0f172a}h1{font-size:20px}h2{margin-top:28px;color:#0f766e}
.bai{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin:12px 0}.dau{font-size:13px;color:#475569;margin-bottom:8px}
.hai{display:flex;gap:16px}.cot{flex:1;min-width:0}.nhan{font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:.05em;margin-bottom:4px}
.tx{white-space:normal}img{max-width:260px;max-height:200px;border:1px solid #e2e8f0;border-radius:8px;margin-top:6px;background:#fff}
.dan{background:#0d9488;color:#fff;border-radius:8px;padding:8px 12px}.y{border:1px solid #e2e8f0;background:#f8fafc;border-radius:8px;padding:6px 10px;margin-top:6px}
.ny{color:#6d28d9}.lg{font-size:14px;color:#334155;padding-top:4px}summary{cursor:pointer;color:#0f766e;font-size:13px}.canh{margin-top:6px;background:#fef3c7;color:#92400e;border-radius:6px;padding:4px 8px;font-size:13px}
nav a{margin-right:12px}@media(max-width:760px){.hai{flex-direction:column}}</style></head><body>
<h1>Tách ý kho Hình – Học — máy cắt (${sach.length} bài sạch, chưa ghi DB)</h1>
<p>Trái: đề gốc như đang lưu (1 câu cả bài). Phải: sau khi tách = lời dẫn chung + từng ý (mỗi ý thành 1 câu, lời giải của riêng ý đó). Chưa có dòng "Đã biết".</p>
<nav>${Object.entries(theoKhoi).map(([k, ds]) => `<a href="#k${k}">Khối ${k} (${ds.length})</a>`).join('')}</nav>${body}</body></html>`
fs.writeFileSync('kho-rules/hinh/lo/tach-y/duyet-tach-y-may.html', html)
console.log('ok', sach.length, 'bài; có đoạn lời giải trước ý a:', sach.filter((o) => o.lg_dau).length)
