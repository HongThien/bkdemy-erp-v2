// ============================================================================
// html-cau-cho-quyet.mjs — dựng MỘT trang HTML cho người duyệt xem các câu của một lượt gán-vào-bản-đồ-mới (gan-bdm-nhom.mjs) mà MÁY CHƯA QUYẾT:
// câu ở hàng "đề xuất" (dạng gợi ý, chờ gật) và hàng "thiếu dạng" (nhóm chưa có dạng phù hợp). Mỗi câu: nguồn · đề · đáp số · lời giải (bấm mở) · lý do trạm gán.
//   node scripts/kho/sach/html-cau-cho-quyet.mjs <gan.json> <ra.html> "<tiêu đề>" [--nhom "tên cụm=regex nguồn;tên cụm 2=regex 2"]
// Luật CEO: "mọi lô cần duyệt kèm MỘT file HTML xem được" (cau-can-review-phai-cho-xem-cu-the). KaTeX nạp từ CDN. Chỉ ĐỌC DB.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const a = process.argv.slice(2), [tep, ra, tieuDe] = a.filter((x, i) => !x.startsWith('--') && a[i - 1] !== '--nhom')
const iN = a.indexOf('--nhom'), CUM = iN >= 0 ? a[iN + 1].split(';').map((s) => { const [ten, re] = s.split('='); return { ten, re: new RegExp(re) } }) : []
if (!tep || !ra || !tieuDe) { console.error('Dùng: node scripts/kho/sach/html-cau-cho-quyet.mjs <gan.json> <ra.html> "<tiêu đề>" [--nhom "cụm=regex;…"]'); process.exit(2) }
const g = JSON.parse(readFileSync(tep, 'utf8'))
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
const ids = g.cau.map((c) => c.ma_cau)
const { rows } = await db.query(`select h.ma_cau, h.noi_dung, h.dap_an, h.loi_giai, h.kiem_may, h.loai_cau, h.da_duyet,
    (select json_build_object('dang', d.ten, 'chac', x.chac, 'ly_do', x.ly_do) from dai_bdm_de_xuat x join dai_bdm_dang_bai d on d.id = x.dang_bai_id where x.ma_cau = h.ma_cau) dx,
    (select ly_do from dai_bdm_cau_thieu_dang t where t.ma_cau = h.ma_cau) td
  from dai_cau_hoi h where h.ma_cau = any($1) and h.xoa_at is null`, [ids])
const { rows: dangNhom } = await db.query(`select ten from dai_bdm_dang_bai where nhom_id = $1 order by thu_tu`, [g.nhom_id])
await db.end()
const dl = new Map(rows.map((r) => [r.ma_cau, r]))
const cho = g.cau.map((c) => ({ c, r: dl.get(c.ma_cau) })).filter((x) => x.r && (x.r.dx || x.r.td))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const the = ({ c, r }) => `<article id="${r.ma_cau}">
  <h4><code>${esc(c.ma_nguon)}</code> <small>${r.ma_cau} · ${r.loai_cau === 'tu_luan' ? 'tự luận' : 'trả lời ngắn'}${r.kiem_may === 'nghi' ? ' · <span class="nghi">cổng gắn cờ nghi (đề đã viết lại có chủ ý)</span>' : ''}</small></h4>
  <div class="de">${md(r.noi_dung)}</div>
  <div class="ds"><b>Đáp số:</b> ${esc(r.dap_an)}</div>
  ${r.dx ? `<div class="dx">🔶 Trạm gán đề xuất: <b>${esc(r.dx.dang)}</b> (${r.dx.chac === 'cao' ? 'chắc' : 'chưa chắc'}) — ${esc(r.dx.ly_do)}</div>` : `<div class="td">⬜ Chưa có dạng phù hợp — ${esc((r.td ?? '').replace(/^Chưa có dạng trong nhóm "[^"]*": /, ''))}</div>`}
  <details><summary>Lời giải</summary><div class="lg">${md(r.loi_giai)}</div></details>
</article>`
const dxx = cho.filter((x) => x.r.dx), td = cho.filter((x) => !x.r.dx)
let cum = '', conLai = td
for (const k of CUM) { const t = conLai.filter((x) => k.re.test(x.c.ma_nguon)); conLai = conLai.filter((x) => !k.re.test(x.c.ma_nguon)); if (t.length) cum += `<section id="cum-${esc(k.ten)}"><h2>${esc(k.ten)} <small>(${t.length} câu chưa có dạng)</small></h2>${t.map(the).join('')}</section>` }
if (conLai.length) cum += `<section><h2>Chưa có dạng — nhóm khác <small>(${conLai.length} câu)</small></h2>${conLai.map(the).join('')}</section>`
const tong = g.cau.length, nGan = tong - cho.length
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(tieuDe)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<style>body{font:15px/1.55 system-ui,sans-serif;max-width:900px;margin:0 auto;padding:16px;background:#fafafa;color:#222}h1{font-size:22px}h2{margin-top:32px;border-bottom:2px solid #6366f1;padding-bottom:4px}h2 small,h4 small{color:#666;font-weight:400}
article{background:#fff;border:1px solid #ddd;border-radius:8px;padding:10px 14px;margin:12px 0}h4{margin:0 0 6px}.de{margin:6px 0}.ds{color:#047857}.dx{background:#fff7ed;border-left:4px solid #f59e0b;padding:6px 10px;margin:8px 0}.td{background:#f3f4f6;border-left:4px solid #9ca3af;padding:6px 10px;margin:8px 0}
.lg{background:#f9fafb;padding:8px 12px;margin-top:6px}.nghi{color:#b91c1c}.tom{background:#eef2ff;border-radius:8px;padding:10px 14px}details summary{cursor:pointer;color:#4338ca}code{background:#eef;padding:1px 5px;border-radius:4px}</style></head><body>
<h1>${esc(tieuDe)}</h1>
<div class="tom"><b>Nhóm:</b> ${esc(g.nhom)}<br><b>Dạng bài hiện có (${dangNhom.length}):</b> ${dangNhom.map((d, i) => `${i + 1}. ${esc(d.ten)}`).join(' · ')}<br>
<b>${tong} câu:</b> ${nGan} câu đã gán chắc vào dạng và <b>tự duyệt</b> · <b>${dxx.length}</b> câu máy đề xuất dạng (chờ bạn gật) · <b>${td.length}</b> câu chưa có dạng phù hợp trong nhóm (chờ bạn tạo dạng / nhóm, hoặc chỉ định chỗ).</div>
${dxx.length ? `<section><h2>Đề xuất dạng — chờ bạn gật <small>(${dxx.length} câu)</small></h2>${dxx.map(the).join('')}</section>` : ''}
${cum}
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
</body></html>`
writeFileSync(ra, html)
console.log(`${ra}: ${cho.length} câu (đề xuất ${dxx.length} · chưa có dạng ${td.length}) · ${(html.length / 1024).toFixed(0)} KB`)
