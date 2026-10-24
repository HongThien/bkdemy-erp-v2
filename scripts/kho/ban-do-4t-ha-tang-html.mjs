// Dựng trang HTML XEM TRƯỚC cho ban-do-4t-ha-tang.mjs (đọc reports/_ban-do-4t-ha-tang.json do lượt XEM ghi ra).
//   node scripts/kho/ban-do-4t-ha-tang-html.mjs  →  reports/ban-do-4t-ha-tang-xem-truoc.html (tự chứa, mở thẳng bằng trình duyệt)
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const j = JSON.parse(readFileSync(join(GOC, 'reports', '_ban-do-4t-ha-tang.json'), 'utf8'))
const e = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const conMoi = new Set(j.doiMa.dang_con_chuyen.map((x) => x.id))

// SAU: đúng 4 tầng
const sau = j.sau.map((c, i) => `
<details class="cd" ${i < 6 ? 'open' : ''}><summary><span class="t">Chủ đề</span> <b>${e(c.ten)}</b> <i>${c.chuyen_de.length} chuyên đề</i></summary>
${c.chuyen_de.map((h) => `
  <details class="ch"><summary><span class="t">Chuyên đề</span> <b>${e(h.ten)}</b> <i>${h.nhom.length} nhóm</i></summary>
  ${h.nhom.map((n) => `
    <details class="nh" open><summary><span class="t">Nhóm</span> <b>${e(n.ten)}</b> <i>${n.dang.length} dạng</i></summary>
      <ul>${n.dang.map((d) => `<li><span class="t">Dạng</span> ${e(d.ten)}${d.co_lt ? ' <em title="có lý thuyết">📖</em>' : ''}${conMoi.has(d.id) ? ' <em class="du" title="dạng bài cũ nằm dưới nhóm — dời sang cùng nhóm, giữ nguyên mã">↳ dạng bài cũ</em>' : ''}</li>`).join('')}</ul>
    </details>`).join('')}
  </details>`).join('')}
</details>`).join('')

// TRƯỚC: 23 chủ đề cũ
const truoc = j.truoc.map((c) => `
<details><summary><span class="t">Chủ đề</span> <b>${e(c.ten)}</b> <code>${c.id}</code></summary>
${c.chuyen_de.map((h) => `<div class="in1"><span class="t">Chuyên đề</span> ${e(h.ten)} <code>${h.chuyen_de_id}</code>
  ${h.nhom.map((n) => `<div class="in2"><span class="t">Nhóm</span> ${e(n.ten)} <code>${n.id}</code>${n.dang.length ? ` <i>(+${n.dang.length} dạng bài)</i>` : ''}</div>`).join('')}</div>`).join('')}
</details>`).join('')

// DANH SÁCH XOÁ
const hangXoa = j.truoc.flatMap((c) => [
  `<tr class="cd"><td>Chủ đề</td><td>${c.id}</td><td>${e(c.ten)}</td><td>→ thành chuyên đề «${e(c.ten)}»</td></tr>`,
  ...c.chuyen_de.flatMap((h) => [
    `<tr class="ch"><td>Chuyên đề + ô</td><td>${h.chuyen_de_id}</td><td>${e(h.ten)}</td><td>→ thành nhóm «${e(h.ten)}»</td></tr>`,
    ...h.nhom.map((n) => `<tr class="nh"><td>Nhóm</td><td>${n.id}</td><td>${e(n.ten)}</td><td>→ thành dạng «${e(n.ten)}»${n.co_lt ? ' (kèm lý thuyết)' : ''}</td></tr>`)])])

writeFileSync(join(GOC, 'reports', 'ban-do-4t-ha-tang-xem-truoc.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bản đồ 4T — hạ 1 tầng (xem trước)</title>
<style>
:root{--bg:#fafafb;--card:#fff;--tx:#1f2937;--mu:#6b7280;--ln:#e5e7eb;--cd:#4f46e5;--ch:#0891b2;--nh:#059669;--dg:#d97706;--rd:#e11d48}
@media(prefers-color-scheme:dark){:root{--bg:#0f1117;--card:#181b24;--tx:#e5e7eb;--mu:#9ca3af;--ln:#2a2f3a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:16px}
.w{max-width:1100px;margin:0 auto}h1{font-size:20px;margin:0 0 4px}h2{font-size:16px;margin:28px 0 8px}p{margin:6px 0;color:var(--mu)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}
.k{background:var(--card);border:1px solid var(--ln);border-radius:12px;padding:12px}.k b{font-size:22px;display:block}.k span{color:var(--mu);font-size:13px}
.k.ok b{color:var(--nh)}.k.dg b{color:var(--rd)}
details{background:var(--card);border:1px solid var(--ln);border-radius:10px;margin:6px 0;padding:6px 10px}
details details{margin-left:14px;background:transparent;border-color:var(--ln)}
summary{cursor:pointer;padding:3px 0}summary i,.in2 i{color:var(--mu);font-style:normal;font-size:12px;margin-left:6px}
.t{display:inline-block;font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;color:#fff;margin-right:4px;vertical-align:1px}
.cd>summary .t{background:var(--cd)}.ch>summary .t{background:var(--ch)}.nh>summary .t,li .t{background:var(--nh)}
.in1 .t{background:var(--ch)}.in2 .t{background:var(--dg)}details>summary .t{background:var(--cd)}
ul{margin:4px 0 6px 18px;padding:0;list-style:none}li{padding:2px 0}code{font-size:11px;color:var(--mu)}
.in1{margin:6px 0 4px 14px}.in2{margin:2px 0 2px 28px}.du{font-size:12px;color:var(--dg);font-style:normal}
table{width:100%;border-collapse:collapse;font-size:13px;background:var(--card);border:1px solid var(--ln);border-radius:10px;overflow:hidden}
td{padding:4px 8px;border-top:1px solid var(--ln);vertical-align:top}tr.cd td:first-child{color:var(--cd);font-weight:600}tr.ch td:first-child{color:var(--ch)}tr.nh td:first-child{color:var(--dg)}
tr.cd td{background:color-mix(in srgb,var(--cd) 8%,transparent)}
.box{background:var(--card);border:1px solid var(--ln);border-left:4px solid var(--rd);border-radius:10px;padding:10px 14px;margin:14px 0}
@media(max-width:600px){body{padding:12px}td{font-size:12px}}
</style></head><body><div class="w">
<h1>Bản đồ mới 4T — hạ cả cây xuống 1 tầng</h1>
<p>Xem trước (lần chạy thử đã ROLLBACK — <b>DB chưa đổi gì</b>). Chủ đề cũ → chuyên đề · chuyên đề cũ → nhóm · nhóm cũ → dạng; dựng 6 chủ đề mới ở trên.</p>
<div class="cards">
 <div class="k"><b>${j.nTruoc.chu_de} → ${j.nSau.chu_de}</b><span>chủ đề (6 chủ đề mới)</span></div>
 <div class="k"><b>${j.nTruoc.chuyen_de} → ${j.nSau.chuyen_de}</b><span>chuyên đề</span></div>
 <div class="k"><b>${j.nTruoc.nhom} → ${j.nSau.nhom}</b><span>nhóm bài</span></div>
 <div class="k"><b>${j.nTruoc.dang} → ${j.nSau.dang}</b><span>dạng bài (= ${j.nTruoc.nhom} nhóm cũ + ${j.nTruoc.dang} dạng bài cũ)</span></div>
 <div class="k ok"><b>${j.ltTruoc} = ${j.ltTruoc}</b><span>mục có lý thuyết — giữ đủ</span></div>
 <div class="k ok"><b>${j.nDoiUng} = ${j.nDoiUng}</b><span>đối ứng dạng cũ (dai_ban_do) — giữ đủ, trỏ sang dạng bài mới</span></div>
</div>
<h2>SAU khi hạ (cây mới)</h2>
${sau}
<h2>TRƯỚC (cây hiện tại — 23 chủ đề)</h2>
<details><summary>Bấm để mở cây cũ</summary>${truoc}</details>
<h2>Những hàng SẼ BỊ XOÁ khỏi bản đồ nháp (sau khi nội dung đã được chép sang hàng mới)</h2>
<div class="box"><b>${j.xoa.chu_de} chủ đề · ${j.xoa.chuyen_de} chuyên đề · ${j.xoa.o} ô · ${j.xoa.nhom} nhóm bài</b> (cột 2 = mã cũ). Không mất: tên, mô tả, lý thuyết, tệp đính kèm, thứ tự, 77 đối ứng, 11 đối ứng cụm — đều được chép/trỏ sang hàng mới.<br>
<b>Mất:</b> chỉ <u>mã</u> cũ (NCD/NCH/NNB…) — mỗi tầng là một bảng riêng nên hàng mới nhận mã mới. Bảng đổi mã cũ → mới được lưu ở <code>kho-rules/dai/ban-do/4T-ha-tang-doi-ma.json</code>, bản sao lưu trước khi đổi ở <code>4T-ha-tang-truoc.json</code>, và <code>dai_bdm_log</code> tự ghi từng hàng thêm/xoá.<br>
Chưa có câu nào gán vào cây 4T (gán 0 · đề xuất 0 · tiền đề 0 · giáo trình 0) nên không ảnh hưởng dữ liệu đo.</div>
<table><tr><td><b>Tầng</b></td><td><b>Mã cũ</b></td><td><b>Tên</b></td><td><b>Thành</b></td></tr>${hangXoa.join('')}</table>
</div></body></html>`)
console.log('→ reports/ban-do-4t-ha-tang-xem-truoc.html')
