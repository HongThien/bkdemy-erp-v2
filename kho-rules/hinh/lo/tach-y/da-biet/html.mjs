// Dựng HTML đề xuất dòng "Đã biết" từ de-xuat.json (do ra.mjs sinh) — chỉ đọc file, không đụng DB.
import fs from 'fs'
const DIR = 'kho-rules/hinh/lo/tach-y/da-biet/'
const d = JSON.parse(fs.readFileSync(DIR + 'de-xuat.json', 'utf8'))
const esc = (s) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
const theoKhoi = {}; for (const o of d.deXuat) (theoKhoi[o.khoi] ??= []).push(o)
let body = ''
for (const [k, ds] of Object.entries(theoKhoi)) {
  const bai = new Map(); for (const o of ds) { if (!bai.has(o.ma_bai_y)) bai.set(o.ma_bai_y, []); bai.get(o.ma_bai_y).push(o) }
  body += `<h2 id="k${k}">Khối ${k} — ${ds.length} ý của ${bai.size} bài</h2>`
  for (const [ma, ys] of bai) {
    const o0 = ys[0], thieu = new Map(ys.map((o) => [o.nhan_y, o]))
    body += `<section class="bai"><div class="dau"><b>${ma}</b> (gốc ${o0.ma_cau_goc ?? '—'}) · ${esc(o0.ten_bai)}</div>
<div class="hai"><div class="cot">${o0.anh_de ? `<img src="${o0.anh_de}">` : ''}<div class="dan">${esc(o0.loi_dan)}</div></div><div class="cot">
${o0.cac_y.map((y) => { const t = thieu.get(y.nhan); return `<div class="y${t ? ' co' : ''}">${t ? `<div class="db">＋ Đã biết${t.viet_boi ? ' <i>(viết tay)</i>' : ''}: ${esc(t.da_biet)}</div>` : ''}<div><b class="ny">${y.nhan})</b> ${esc(y.cau_hoi)}</div>${t ? `<div class="ghi">${t.ma_cau} · thiếu điểm ${t.diem_thieu.map((p) => `$${p}$`).join(', ')}${t.da_duyet ? ' · đã duyệt' : ''}</div>` : ''}</div>` }).join('')}
</div></div></section>`
  }
}
const phu = (ten, mau, ds, f) => ds.length ? `<h2 style="color:${mau}">${ten} — ${ds.length} ý</h2>` + ds.map((o) => `<section class="bai"><div class="dau"><b>${o.ma_cau}</b> · Khối ${o.khoi} · ý ${o.nhan_y} · ${esc(o.ten_bai)}</div><div class="canh">${esc(f(o))}</div><div class="dan">${esc(o.loi_dan)}</div>${o.cac_y.map((y) => `<div class="y"><b class="ny">${y.nhan})</b> ${esc(y.cau_hoi)}</div>`).join('')}</section>`).join('') : ''
body += phu('Không thêm (có lý do)', '#64748b', d.boQua, (o) => o.ly_do)
body += phu('Còn cần viết tay', '#b91c1c', d.vietTay, (o) => 'Điểm đặt tên trong câu yêu cầu: ' + o.viet_tay.map((t) => `${t.diem} (ý ${t.y})`).join(', '))
const tong = Object.entries(d.dem).map(([k, v]) => `K${k}: ${v.y_thieu}/${v.y} ý ở ${v.bai_thieu}/${v.bai} bài`).join(' · ')
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hình – Học · đề xuất dòng Đã biết</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>body{font:15px/1.6 system-ui,sans-serif;margin:0;padding:16px;background:#f8fafc;color:#0f172a}h1{font-size:20px}h2{margin-top:28px;color:#0f766e}
.bai{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;margin:12px 0}.dau{font-size:13px;color:#475569;margin-bottom:8px}
.hai{display:flex;gap:16px}.cot{flex:1;min-width:0}.cot:first-child{flex:0 0 34%}
img{max-width:100%;max-height:200px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px;background:#fff;display:block}
.dan{background:#0d9488;color:#fff;border-radius:8px;padding:8px 12px}.y{border:1px solid #e2e8f0;background:#f8fafc;border-radius:8px;padding:6px 10px;margin-bottom:6px;color:#64748b}
.y.co{border-color:#f59e0b;background:#fffbeb;color:#0f172a}.db{background:#fde68a;border-radius:6px;padding:3px 8px;margin-bottom:4px;font-weight:600}.db i{font-weight:400;color:#92400e}
.ny{color:#6d28d9}.ghi{font-size:12px;color:#94a3b8}.canh{margin:6px 0;background:#fef3c7;color:#92400e;border-radius:6px;padding:4px 8px;font-size:13px}
nav a{margin-right:12px}@media(max-width:760px){.hai{flex-direction:column}}</style></head><body>
<h1>Hình – Học K7 · K8 · 8T · K9 — ý dùng điểm dựng ở ý trước: đề xuất dòng "Đã biết" (${d.deXuat.length} ý, chưa ghi DB)</h1>
<p>Ý viền vàng = đề của ý đang dùng điểm chỉ được dựng ở ý trước. Dòng vàng đậm "＋ Đã biết" là phần sẽ chèn giữa lời dẫn và câu hỏi của ý — <b>nguyên văn</b> phần giả thiết của ý trước, kèm "(ý …)".
Ý xám = không đổi. ${tong}.</p>
<p>Máy rà theo TÊN ĐIỂM. Không rà: ý sau dùng <i>kết quả</i> của ý trước, số liệu chỉ cho ở ý trước, tên tia / đường thẳng chữ thường. Bài "Cho hình vẽ bên" (điểm nằm trên hình) không tính.</p>
<nav>${Object.entries(theoKhoi).map(([k, ds]) => `<a href="#k${k}">Khối ${k} (${ds.length})</a>`).join('')}</nav>${body}</body></html>`
fs.writeFileSync(DIR + 'de-xuat-da-biet.html', html)
console.log('ok', d.deXuat.length, 'ý đề xuất ·', d.boQua.length, 'bỏ qua ·', d.vietTay.length, 'còn viết tay')
