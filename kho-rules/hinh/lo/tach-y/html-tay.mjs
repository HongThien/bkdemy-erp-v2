// Dựng HTML duyệt cho lượt CẮT TAY (nhap-tay.json do tach-tay.mjs sinh) — chỉ đọc file, không đụng DB.
import fs from 'fs'
const DIR = 'kho-rules/hinh/lo/tach-y/'
const d = JSON.parse(fs.readFileSync(DIR + 'nhap-tay.json', 'utf8'))
const esc = (s) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
const tach = d.filter((o) => o.tach && o.sach), nguyen = d.filter((o) => !o.tach), dang = d.filter((o) => o.tach && !o.sach)
const soY = tach.reduce((s, o) => s + o.ys.length, 0)
let body = `<h2 id="tach">Tách được — ${tach.length} bài → ${soY} ý</h2>`
for (const o of tach) {
  body += `<section class="bai"><div class="dau"><b>${o.ma_cau}</b> · Khối ${o.khoi} · ${esc(o.ten_bai)} · ${o.ys.length} ý (${o.ys.map((y) => y.nhan).join(' · ')})${o.da_duyet ? ' · đã duyệt' : ' · chưa duyệt'}</div>
${o.ghi_chu ? `<div class="canh">✍ ${esc(o.ghi_chu)}</div>` : ''}
${o.buoc ? `<div class="buoc">Bước Phần 1 → ý: ${esc(o.buoc)}</div>` : ''}
<div class="hai"><div class="cot"><div class="nhan">ĐỀ GỐC (cả bài)</div><div class="tx">${esc(o.noi_dung)}</div>${o.anh_de ? `<img src="${o.anh_de}">` : ''}
<details><summary>Lời giải gốc (cả bài)</summary><div class="lg">${esc(o.loi_giai)}</div></details></div>
<div class="cot"><div class="nhan">SAU KHI TÁCH</div><div class="dan">${esc(o.loi_dan)}</div>
${o.ys.map((y) => `<div class="y"><div><b class="ny">${y.nhan})</b> ${esc(y.cau_hoi)}</div><details><summary>Lời giải ý ${y.nhan}</summary><div class="lg">${esc(y.loi_giai)}</div></details></div>`).join('')}
${o.bo_dong?.length ? `<div class="canh">Bỏ dòng tổng kết: ${esc(o.bo_dong.join(' ¦ '))}</div>` : ''}${o.mat_dong?.length ? `<div class="canh">⚠ Dòng gốc không thấy trong ý nào: ${esc(o.mat_dong.join(' ¦ '))}</div>` : ''}</div></div></section>`
}
if (dang.length) body += `<h2 style="color:#b91c1c">Chưa cắt xong — ${dang.length} bài</h2>` + dang.map((o) => `<section class="bai"><b>${o.ma_cau}</b> · thiếu lời giải ý: ${o.ys.filter((y) => !y.loi_giai).map((y) => y.nhan).join(', ')}</section>`).join('')
body += `<h2 id="nguyen" style="color:#b45309">Đề xuất ĐỂ NGUYÊN, không tách — ${nguyen.length} bài</h2>`
for (const o of nguyen) body += `<section class="bai"><div class="dau"><b>${o.ma_cau}</b> · Khối ${o.khoi} · ${esc(o.ten_bai)}${o.da_duyet ? ' · đã duyệt' : ' · chưa duyệt'}</div>
<div class="canh">Lý do: ${esc(o.ly_do)}</div><div class="tx">${esc(o.noi_dung)}</div>${o.anh_de ? `<img src="${o.anh_de}">` : ''}
<details><summary>Lời giải đang lưu</summary><div class="lg">${esc(o.loi_giai)}</div></details></section>`
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tách ý Hình – Học · cắt tay</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>body{font:15px/1.6 system-ui,sans-serif;margin:0;padding:16px;background:#f8fafc;color:#0f172a}h1{font-size:20px}h2{margin-top:28px;color:#0f766e}
.bai{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin:12px 0}.dau{font-size:13px;color:#475569;margin-bottom:8px}
.hai{display:flex;gap:16px}.cot{flex:1;min-width:0}.nhan{font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:.05em;margin-bottom:4px}
img{max-width:260px;max-height:200px;border:1px solid #e2e8f0;border-radius:8px;margin-top:6px;background:#fff;display:block}
.dan{background:#0d9488;color:#fff;border-radius:8px;padding:8px 12px}.y{border:1px solid #e2e8f0;background:#f8fafc;border-radius:8px;padding:6px 10px;margin-top:6px}
.ny{color:#6d28d9}.lg{font-size:14px;color:#334155;padding-top:4px}summary{cursor:pointer;color:#0f766e;font-size:13px}
.canh{margin:6px 0;background:#fef3c7;color:#92400e;border-radius:6px;padding:4px 8px;font-size:13px}.buoc{margin:6px 0;font-size:12px;color:#64748b;font-family:ui-monospace,monospace}
nav a{margin-right:12px}@media(max-width:760px){.hai{flex-direction:column}}</style></head><body>
<h1>Tách ý kho Hình – Học K8 + K9 — cắt TAY 32 bài máy cắt lệch (chưa ghi DB)</h1>
<p>Trái: đề gốc + lời giải gốc. Phải: lời dẫn chung + từng ý, lời giải riêng từng ý (Mấu chốt chung + các bước của ý đó + phần trình bày của ý đó). Chữ lấy nguyên văn từ bản gốc; quyết định tay ghi ở dòng vàng.
Bước Phần 1 gắn nhiều ý ("Ý a và b: …") được đưa vào lời giải của từng ý đó, giữ nguyên chữ.</p>
<nav><a href="#tach">Tách được (${tach.length})</a><a href="#nguyen">Đề xuất để nguyên (${nguyen.length})</a></nav>${body}</body></html>`
fs.writeFileSync(DIR + 'duyet-tach-y-tay.html', html)
console.log('ok', tach.length, 'bài tách ·', soY, 'ý ·', nguyen.length, 'để nguyên ·', dang.length, 'chưa xong')
