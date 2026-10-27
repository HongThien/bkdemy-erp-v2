// build-duyet.mjs — trang HTML để Thùy duyệt lô "Củng cố Toán 6 T1 Ch.III → kho Số nguyên" (luật duyệt 14/10: kèm HTML xem được).
//   node kho-rules/dai/lo/k6/so-nguyen-sach/build-duyet.mjs
import { readFileSync, writeFileSync } from 'node:fs'
const D = 'kho-rules/dai/lo/k6/so-nguyen-sach/'
const A = JSON.parse(readFileSync(D + 'tong-hop.json', 'utf8'))
const dang = new Map([...readFileSync(D + 'dich.md', 'utf8').matchAll(/\*\*(NDB\d+)\*\* (.+?) — /g)].map((m) => [m[1], m[2]]))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const giu = A.filter((q) => q.trang === 'giu')
const lech = A.filter((q) => /LỆCH SÁCH|ĐỀ SÁCH IN LỖI|ĐỀ ĐÃ ĐỔI/.test(q.ghi_chu ?? ''))
const dem = (f) => A.filter(f).length
const mau = { cao: '#1b7a36', vua: '#c77700' }
let h = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt: sách Củng cố Ch.III → kho Số nguyên</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>body{font:15px/1.6 system-ui,'Segoe UI',sans-serif;max-width:1050px;margin:0 auto;padding:16px;background:#fafafb;color:#1a1a2e}h1{font-size:22px}h2{margin-top:28px;border-bottom:2px solid #4c6fff;padding-bottom:4px}
.box{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 14px;margin:10px 0}.q{background:#fff;border:1px solid #e1e1ec;border-left:5px solid #4c6fff;border-radius:8px;padding:8px 12px;margin:8px 0}
.q.luyen{border-left-color:#2D9CDB}.q.giang{border-left-color:#b23a72}.q.giu{border-left-color:#c0392b;background:#fff6f4}
.tag{display:inline-block;font-size:11px;border-radius:10px;padding:1px 8px;color:#fff;margin-right:4px}.id{font-size:12px;color:#888}.note{font-size:12.5px;color:#a33;margin-top:4px}.da{color:#1b7a36;font-weight:600}
details>summary{cursor:pointer;color:#4c6fff;font-size:13px}.ok{color:#1b7a36}.bad{color:#c0392b}table{border-collapse:collapse}td,th{border:1px solid #ccd;padding:3px 8px;font-size:13px}</style></head><body>
<h1>Duyệt lô: sách <i>Củng cố Toán 6 tập 1 — Chương III (Số nguyên)</i> → kho</h1>
<div class="box"><b>${A.length} câu</b> từ 6 bài của sách · <b>${dem((q) => q.vai === 'giang')}</b> bài giảng (vai <code>giang</code>, kho TRÊN LỚP) · <b>${dem((q) => q.vai === 'luyen')}</b> bài tập (vai <code>luyen</code>, kho VỀ NHÀ).<br>
<b>Nhập vào kho: ${dem((q) => q.trang === 'vao')} câu</b> (da_duyet=false, dạng bài ghi ở dạng ĐỀ XUẤT) · <b class="bad">giữ lại chờ Thùy: ${giu.length} câu</b> (bên dưới). Mọi câu đã qua: soạn (Sonnet) → soát mù (Opus giải độc lập, đáp số khớp 601/601) → máy kiểm KaTeX + đáp số.</div>
<h2>Cần Thùy quyết (${giu.length} câu giữ lại + các chỗ lệch)</h2><div class="box"><table><tr><th>id</th><th>vấn đề</th></tr>${giu.map((q) => `<tr><td>${esc(q.id)}</td><td>${esc(q.ly_do_giu)}</td></tr>`).join('')}</table></div>
<div class="box"><b>Bản đồ chưa có dạng (gán tạm, mức "vừa"):</b> dãy số nguyên có quy luật (B2-7A/7B — để trống) · "phần dấu – phần số tự nhiên" (B2-1A/1B → NDB01286) · bảng x, y, x+y, x−y (B2-13A/13B/22 → NDB01315) · bài toán có x ở cả hai vế (B4-9A/9B — để trống) · chia hết của tổng luỹ thừa (ÔT-14A/14B, ÔT-27 — để trống). Thêm dạng thì em gán lại.<br>
<b>Khác:</b> ÔT-24 gộp hai ý (chứng minh đẳng thức) · ĐỀ 1 / ĐỀ 2 của Ôn tập có 2 cặp câu trùng (Đ1-B1a=Đ2-B1b, Đ1-B1b=Đ2-B1a), em nhập cả hai · B5-5B-b giữ −16 như đề in · B1-8B-e hai dấu cùng đúng nên để tự luận · B3-1A-b, 1A-d xếp NDB01302 (sách ghi "Bỏ ngoặc rồi tính") dù có thể sang NDB01306.</div>
<h2>Sách in SAI đáp số / đề (${lech.length} câu — em giữ kết quả đúng, đã kiểm máy + soát mù)</h2><div class="box"><table><tr><th>id</th><th>ghi chú</th></tr>${lech.map((q) => `<tr><td>${esc(q.id)}</td><td>${esc((q.ghi_chu ?? '').replace(/^(LỆCH SÁCH|ĐỀ SÁCH IN LỖI|ĐỀ ĐÃ ĐỔI[^—]*)\s*—\s*/, ''))}</td></tr>`).join('')}</table></div>`
for (const f of ['b1', 'b2', 'b3', 'b4', 'b5', 'ot']) {
  const cs = A.filter((q) => q.tep === f)
  h += `<h2>${esc(cs[0].sach)} — ${cs.length} câu</h2>`
  for (const q of cs) {
    const d = q.dang_bai ? `${q.dang_bai} ${esc(dang.get(q.dang_bai) ?? '')}` : '<i>chưa có dạng</i>'
    h += `<div class="q ${q.trang === 'giu' ? 'giu' : q.vai}"><span class="tag" style="background:${q.vai === 'giang' ? '#b23a72' : '#2D9CDB'}">${q.vai === 'giang' ? 'trên lớp' : 'về nhà'}</span><span class="tag" style="background:${mau[q.dang_bai_chac] ?? '#999'}">${q.dang_bai_chac ?? '—'}</span><span class="id">${esc(q.id)} · ${esc(q.loai_cau)} · ${d}</span>${q.trang === 'giu' ? '<b class="bad"> · GIỮ LẠI</b>' : ''}<br>${fmt(q.noi_dung)}${q.lua_chon ? '<br>' + q.lua_chon.map((x) => esc(x)).join(' &nbsp; ') : ''}
<div>Đáp án: <span class="da">${esc(q.dap_an ?? '—')}</span>${q.sach_dap_so ? ` · sách: ${esc(q.sach_dap_so)}` : ''}</div>${q.ghi_chu ? `<div class="note">${esc(q.ghi_chu)}</div>` : ''}${q.dang_bai_ly_do ? `<div class="id">dạng: ${esc(q.dang_bai_ly_do)}</div>` : ''}
<details><summary>Lời giải</summary><div>${fmt(q.loi_giai)}</div></details></div>`
  }
}
h += `<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script><script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script><script>renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})</script></body></html>`
writeFileSync(D + 'so-nguyen-sach-duyet.html', h)
console.log('✔ so-nguyen-sach-duyet.html', (h.length / 1024).toFixed(0) + ' KB')
