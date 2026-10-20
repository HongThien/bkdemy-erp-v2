// Dựng trang HTML từ kết quả _soat_do_phu_bdm.mjs --json: node scripts/_soat_do_phu_bdm_html.mjs <in.json> <out.html>
import fs from 'node:fs'
const [, , vao, ra] = process.argv
const j = JSON.parse(fs.readFileSync(vao, 'utf8'))
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]))
const KHOI = ['6', '7', '8', '9', '10', '11', '12']
const tong = (a, k) => a.reduce((s, r) => s + r[k], 0)
const hang = Object.fromEntries(j.hang.map((h) => [h.khoi, h]))
let bang = '', chiTiet = ''
for (const k of KHOI) {
  const cds = j.chu_de.filter((r) => r.khoi === k)
  const t = (x) => tong(cds, x), h = hang[k] ?? { de_xuat: 0, thieu_dang: 0, chua_khop: 0 }
  const o = (v, n, xau) => `<td class="${xau ? 'xau' : ''}">${v}${n != null ? `<small>/${n}</small>` : ''}</td>`
  bang += `<tr><th><a href="#k${k}">Khối ${k}${k === '12' ? ' · NH-TP' : ''}</a></th>${o(t('nhom_lt'), t('nhom'), t('nhom_lt') < t('nhom'))}${o(t('dang_lt'), t('dang'), t('dang_lt') < t('dang'))}${o(t('dang_vd'), t('dang'), t('dang_vd') < t('dang'))}${o(t('dang_0cau'), null, t('dang_0cau') > 0)}${o(t('dang_it'), null, t('dang_it') > 0)}<td>${t('cau')}</td><td>${h.de_xuat}</td><td>${h.thieu_dang}</td><td>${h.chua_khop}</td></tr>`
  chiTiet += `<h2 id="k${k}">Khối ${k}</h2>`
  for (const cd of cds) {
    const nhomThieuLt = cd.nhom - cd.nhom_lt
    if (!cd.thieu.length && !nhomThieuLt) continue
    chiTiet += `<h3>${esc(cd.chu_de)} <small>${cd.dang} dạng bài · ${cd.cau} câu${nhomThieuLt ? ` · <b class="xau">${nhomThieuLt} nhóm chưa có lý thuyết nhóm</b>` : ''}</small></h3>`
    if (cd.thieu.length) {
      chiTiet += '<table class="ct"><tr><th>Nhóm</th><th>Dạng bài</th><th>Lý thuyết</th><th>Ví dụ</th><th>Câu luyện</th></tr>'
      for (const d of cd.thieu) chiTiet += `<tr><td>${esc(d.nhom)}</td><td>${esc(d.dang)}</td><td class="${d.lt ? '' : 'xau'}">${d.lt ? '✓' : 'thiếu'}</td><td class="${d.vd ? '' : 'xau'}">${d.vd ? '✓' : 'thiếu'}</td><td class="${d.so_cau < 3 ? 'xau' : ''}">${d.so_cau}</td></tr>`
      chiTiet += '</table>'
    }
  }
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Độ phủ bản đồ mới</title>
<style>body{font:14px/1.5 system-ui,sans-serif;margin:0;padding:16px 24px;color:#1e293b;background:#fafafb}h1{font-size:20px}h2{margin-top:28px;border-bottom:2px solid #6366f1;padding-bottom:4px}h3{font-size:14px;margin:16px 0 6px}h3 small{font-weight:400;color:#64748b}
table{border-collapse:collapse;background:#fff;margin:6px 0}td,th{border:1px solid #e2e8f0;padding:4px 10px;text-align:left}th{background:#f1f5f9}td small{color:#94a3b8}.xau{color:#be123c;font-weight:600}.ct td:nth-child(n+3){text-align:center}p.g{color:#475569;max-width:900px}</style></head><body>
<h1>Độ phủ bản đồ mới cho builder giáo trình — ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</h1>
<p class="g">Đọc đúng cây GV thấy trong bộ chọn builder (<code>fn_tl_bdm_cay_chon</code>), nhánh Toán–Đại; K12 chỉ chủ đề NH-TP. "Câu luyện" = câu dùng được của dạng bài (đã gán, kho chuẩn). Dạng bài &lt; 3 câu thì nút ↻ Gợi ý ra thiếu/trống. Hàng duyệt = câu đã có đề xuất/cờ nhưng CHƯA được người duyệt nên builder chưa lấy được.</p>
<table><tr><th>Khối</th><th>Nhóm có LT</th><th>Dạng bài có LT</th><th>Dạng bài có VD</th><th>Dạng bài 0 câu</th><th>Dạng bài 1–2 câu</th><th>Câu dùng được</th><th>Đề xuất chờ duyệt</th><th>Thiếu dạng</th><th>Chưa khớp</th></tr>${bang}</table>
<p class="g">Bên dưới: chỉ liệt kê dạng bài thiếu Lý thuyết / Ví dụ / &lt; 3 câu, và chủ đề có nhóm chưa có lý thuyết nhóm.</p>${chiTiet}</body></html>`
fs.writeFileSync(ra, html)
console.log('OK ->', ra)
