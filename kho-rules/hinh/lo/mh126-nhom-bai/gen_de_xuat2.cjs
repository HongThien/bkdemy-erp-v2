// node gen_de_xuat2.cjs <repo> <out.html> <out.json>
const [, , REPO, OUT, OUTJ] = process.argv
process.chdir(REPO)
const fs = require('fs'), path = require('path')
const pg = require(path.join(REPO, 'node_modules/pg'))
const K = require('./ke_hoach_mh126.cjs')
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const tx = (s) => esc(s).replace(/\n/g, '<br>')
;(async () => {
  const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL }); await c.connect()
  const ma = [...new Set([...K.tv.flatMap((t) => t.not), ...K.diTiepGoc, ...K.nhanhMoi.flatMap((n) => n.not), ...K.veMH061, 'BT.07.126.07', 'BT.07.126.09', 'BT.07.126.10'])]
  const rows = (await c.query(`select b.id, b.ma, b.phat_bieu, b.gia_thiet_rieng, g.id cach_id, g.loi_giai,
      (select array_agg(t.ma order by t.ma) from hinh_cach_tien_de td join hinh_baitoan t on t.id = td.tien_de_id where td.cach_id = g.id) tien_de
      from hinh_baitoan b left join hinh_cach_giai g on g.baitoan_id = b.id and g.la_mac_dinh where b.ma = any($1)`, [ma])).rows
  await c.end()
  const by = new Map(rows.map((r) => [r.ma, r]))
  const loi = []
  const moi = {}
  for (const [m, d] of Object.entries(K.doiChu)) {
    const r = by.get(m); let lg = r.loi_giai ?? ''
    if (d.lg === 'MAP') lg = K.doiTenDiem(lg)
    else for (const [a, b] of d.lg) { if (!lg.includes(a)) loi.push(`${m}: không thấy đoạn «${a.slice(0, 40)}»`); lg = lg.replace(a, b) }
    for (const [a, b] of d.lgThayDau ?? []) { if (!lg.includes(a)) loi.push(`${m}: không thấy đoạn «${a.slice(0, 40)}»`); lg = lg.replace(a, b) }
    moi[m] = { phat_bieu: d.pb ?? r.phat_bieu, gia_thiet_rieng: 'rieng' in d ? d.rieng : r.gia_thiet_rieng, loi_giai: lg }
  }
  if (loi.length) { console.error(loi.join('\n')); process.exit(1) }
  const ABC = ['A', 'B', 'C']
  const nut = (m, tag) => {
    const r = by.get(m), n = moi[m], td = m in K.tienDe ? K.tienDe[m] : r.tien_de ?? []
    const pb = n ? n.phat_bieu : r.phat_bieu, rieng = n ? n.gia_thiet_rieng : r.gia_thiet_rieng
    const doiPb = n && (n.phat_bieu !== r.phat_bieu || n.gia_thiet_rieng !== r.gia_thiet_rieng)
    const doiLg = n && n.loi_giai !== r.loi_giai
    const doiTd = m in K.tienDe && JSON.stringify(td) !== JSON.stringify(r.tien_de ?? [])
    return `<details class="not"><summary><span class="ma">${m}</span> ${rieng ? `<i>[${tx(rieng)}]</i> ` : ''}${tx(pb)}
      ${td.length ? `<span class="td">⇐ ${td.join(', ')}</span>` : ''}${tag ? `<span class="tag">${tag}</span>` : ''}
      ${doiPb ? '<span class="doi">đổi tên điểm</span>' : ''}${doiLg ? '<span class="doi">sửa lời giải</span>' : ''}${doiTd ? `<span class="doi">tiền đề cũ: ${(r.tien_de ?? []).join(', ') || '—'}</span>` : ''}</summary>
      ${doiPb ? `<div class="cu"><b>Đề cũ:</b> ${r.gia_thiet_rieng ? `[${tx(r.gia_thiet_rieng)}] ` : ''}${tx(r.phat_bieu)}</div>` : ''}
      <div class="lg ${doiLg ? 'hai' : ''}">${doiLg ? `<div><b>Lời giải cũ</b><br>${tx(r.loi_giai)}</div>` : ''}<div><b>${doiLg ? 'Lời giải mới' : 'Lời giải'}</b><br>${tx(n ? n.loi_giai : r.loi_giai)}</div></div></details>`
  }
  const tvHtml = K.tv.map((t, i) => `<div class="tv"><h4>Thành viên ${i + 1} · cho ${t.cho.map((x) => ABC[x]).join(', ')} ⇒ hỏi ${t.hoi.map((x) => ABC[x]).join(', ')}
    <span class="mut">${t.nut ? `(nhánh ${t.nut} đổi thành thành viên)` : `(mới — ${t.not.length} nốt dời từ ${t.tuMH}, mã giữ nguyên, đổi tên điểm M→E, E→I, K→D)`}</span></h4>
    <div class="gtv">${tx(t.gt)}</div>${t.not.map((m) => nut(m)).join('')}</div>`).join('')
  const nhanhHtml = [
    `<div class="nh"><div class="nht">Nhánh chính «F trên tia đối AB, AF = CE» <span class="mut">(dời cha: từ «BE = BA» sang nút nhóm)</span></div>${nut('BT.07.126.07')}</div>`,
    `<div class="nh"><div class="nht">Nhánh phụ «BA cắt ED tại Q» <span class="mut">(dời cha: từ «DE ⊥ BC» sang nút nhóm)</span></div>${nut('BT.07.126.09')}
      <div class="nh"><div class="nht">Nhánh chính «M là trung điểm QC» <span class="mut">(giữ dưới Q)</span></div>${nut('BT.07.126.10')}</div></div>`,
    ...K.nhanhMoi.map((n) => `<div class="nh"><div class="nht">Nhánh phụ «${esc(n.ten)}» <span class="mut">(mới)</span> — thêm: ${tx(n.gtThem)}</div>${n.not.map((m) => nut(m, 'dời từ MH.061')).join('')}</div>`),
  ].join('')
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gom MH.126 thành nhóm bài</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]})"></script>
<style>
:root{--bg:#f8fafc;--line:#e2e8f0;--txt:#0f172a;--mut:#64748b;--cam:#ea580c;--camnhat:#fff7ed;--teal:#0f766e;--tim:#6d28d9}
body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1100px;margin:0 auto;padding:20px 16px 60px}h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:24px 0 8px;border-bottom:2px solid var(--line);padding-bottom:4px}
.mut{color:var(--mut);font-weight:400;font-size:12px}.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:8px 0}
.nhom{border:2px solid var(--cam);border-radius:12px;padding:10px 12px;background:var(--camnhat)}.sk{display:inline-block;background:#fff;border:1px solid #fdba74;border-radius:6px;padding:1px 7px;margin:2px 4px 2px 0;font-size:12.5px}
.tv{border:1px solid #fdba74;border-radius:10px;background:#fff;padding:8px 10px;margin:8px 0}.tv h4{margin:0 0 4px;font-size:13px;color:var(--cam)}.gtv{font-size:13px;margin-bottom:4px}
.dauRa{background:var(--cam);color:#fff;border-radius:8px;padding:7px 10px;font-weight:600;margin:10px 0 6px}
.nh{border-left:3px solid #c7d2fe;margin:6px 0 6px 10px;padding-left:10px}.nht{font-weight:600;font-size:13px;color:#312e81}
details.not{border-left:3px solid var(--line);margin:3px 0 3px 4px;padding:2px 8px;font-size:13px;background:#fff}details.not summary{cursor:pointer}
.ma{font-family:ui-monospace,monospace;font-size:11px;color:var(--mut)}.td{font-size:11px;color:var(--tim);margin-left:6px}.tag{font-size:11px;background:#e0f2fe;padding:0 6px;border-radius:5px;margin-left:6px}
.doi{font-size:11px;background:#fef3c7;color:#92400e;padding:0 6px;border-radius:5px;margin-left:6px}.cu{color:var(--mut);font-size:12.5px;margin:4px 0}
.lg{margin:6px 0 4px;font-size:12.5px}.lg.hai{display:grid;grid-template-columns:1fr 1fr;gap:10px}.lg.hai>div:first-child{color:var(--mut)}@media(max-width:760px){.lg.hai{grid-template-columns:1fr}}
table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid var(--line);padding:5px 8px;text-align:left;vertical-align:top}th{background:#f1f5f9}
</style></head><body><main>
<h1>Gom MH.126 «Phân giác trong tam giác vuông» (K7) thành nhóm bài</h1>
<p class="mut" style="font-size:13px">Soạn 09/11 · <b>chưa ghi</b>. Không xoá gì: chỉ đổi vai, dời nốt/nhánh, sửa chữ. 0 lượt chấm, 0 ý kho trên mọi nốt liên quan. Bấm vào từng nốt để xem lời giải (cũ ↔ mới).</p>

<h2>Luật dùng để quyết</h2>
<div class="card"><ol style="margin:0;padding-left:18px">
<li><b>Sau nhóm chỉ dựa vào đầu ra.</b> Đầu ra = đủ giả thiết, nên bài đi tiếp chỉ được dùng giả thiết đó, không trỏ vào bài của riêng một cửa. Chỗ nào lời giải cũ ghi "theo B4 / theo B8" ⇒ viết thẳng 3 dòng chứng minh từ đầu ra (vd $DA=DE$ qua $\\triangle ABD=\\triangle EBD$ c.g.c), hoặc ghi "(gt)" nếu đầu ra đã cho sẵn.</li>
<li><b>Chuỗi chuẩn hoá tên điểm:</b> nốt lấy từ đề khác đổi tên điểm cho khớp chuỗi (A, B, C · D ∈ AC · E ∈ BC).</li>
<li><b>Hết giả thiết đủ là hết thành viên:</b> ý nào đứng sau khi đã có đủ A, B, C thì là bài đi tiếp, treo dưới đầu ra.</li>
<li><b>Không xoá:</b> nhánh F, Q chỉ dời cha; 2 nốt nguyên-đề B1, B2 ở gốc (chưa chuẩn hoá, trùng chuỗi BT.07.061.10–12) trả về mô hình cũ MH.061.</li></ol></div>

<h2>Cây sau khi gom</h2>
<div class="nhom">
  <div><b>◈ Nhóm bài</b> = gốc MH.126 · sự kiện: ${K.suKien.map((s, i) => `<span class="sk"><b>${ABC[i]}</b> · ${tx(s)}</span>`).join('')}</div>
  ${tvHtml}
  <div class="dauRa">Đầu ra (giả thiết gốc mới): ${tx(K.dauRa)}</div>
  <div style="font-weight:600;font-size:13px;margin:4px 0">Đi tiếp từ đầu ra</div>
  ${K.diTiepGoc.map((m) => nut(m, 'dời lên nút nhóm')).join('')}
  ${nhanhHtml}
</div>
<p class="mut" style="font-size:13px">Trả về MH.061: ${K.veMH061.join(', ')}.</p>

<h2>Các bước khi ghi (1 transaction)</h2>
<table><tr><th>#</th><th>Việc</th></tr>
<tr><td>1</td><td>Dời B7 (nhánh F) và B9–B10 (nhánh Q → M): nhánh F, Q đổi cha sang gốc MH.126 · B5, B6 dời lên gốc · B1, B2 dời sang MH.061</td></tr>
<tr><td>2</td><td>Gốc MH.126 → nhóm bài với 3 sự kiện A·B·C, giả thiết gốc = đầu ra</td></tr>
<tr><td>3</td><td>MH.166, MH.168 → thành viên (giả thiết nguyên văn như trên, cho/hỏi như trên)</td></tr>
<tr><td>4</td><td>Thêm thành viên 3, dời BT.07.061.17–19 vào; thêm nhánh H, dời BT.07.061.20 vào</td></tr>
<tr><td>5</td><td>Sửa chữ ${Object.keys(K.doiChu).length} nốt (đánh dấu vàng), đổi tiền đề ${Object.keys(K.tienDe).length} nốt — mã mọi nốt giữ nguyên</td></tr>
<tr><td>6</td><td>Kiểm: 0 cờ sai nhánh trên cây · ghép thử "thành viên 1 + F", "thành viên 2 + Q + M", "thành viên 3 + H" in đúng giả thiết</td></tr></table>
</main></body></html>`
  fs.writeFileSync(OUT, html)
  fs.writeFileSync(OUTJ, JSON.stringify({ moi, tienDe: K.tienDe }, null, 1))
  console.log('ok', OUT)
})().catch((e) => { console.error(e); process.exit(1) })
