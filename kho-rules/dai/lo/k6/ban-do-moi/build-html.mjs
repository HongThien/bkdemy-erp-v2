// build-html.mjs — trang HTML để CEO DUYỆT lý thuyết (nhóm) + ví dụ (dạng bài) bản đồ mới K6 (luật duyệt Thùy 14/10: mọi lô kèm 1 HTML xem được).
//   node kho-rules/dai/lo/k6/ban-do-moi/build-html.mjs <thư mục goi+out> <ra.html>
// Hiện: cây chuyên đề → nhóm → dạng; lý thuyết nhóm (MỚI / CÓ SẴN) · ví dụ từng dạng (MỚI / CÓ SẴN) · ghi chú trạm soạn + biên bản soát. Công thức: KaTeX (CDN).
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const [DIR, RA] = process.argv.slice(2)
if (!DIR || !RA) { console.error('Dùng: node …/build-html.mjs <thư mục goi+out> <ra.html>'); process.exit(2) }

const goiFiles = readdirSync(join(DIR, 'goi')).filter((f) => /^goi-\d+\.json$/.test(f)).sort((a, b) => parseInt(a.slice(4)) - parseInt(b.slice(4)))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// giữ $…$ nguyên cho KaTeX (chỉ thoát & < trong công thức)
const fmt = (s) => String(s).split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.endsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'))).join('')
const NHAN = { 'ĐN': 'Định nghĩa', 'DN': 'Định nghĩa', 'ĐL': 'Định lý', 'DL': 'Định lý', 'TC': 'Tính chất', 'CY': 'Chú ý', 'PP': 'Phương pháp', 'VD': 'Ví dụ', 'NX': 'Nhận xét', 'BT': 'Bài tập' }
function khoi(text) {
  let nVd = 0
  return String(text).split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean).map((doan) => {
    const dong = doan.split('\n')
    const m = dong[0].trim().match(/^##(ĐN|DN|ĐL|DL|TC|CY|PP|VD|NX|BT)\b[:.]?\s*(.*)$/i)
    if (!m) return `<div class="txt">${dong.map(fmt).join('<br>')}</div>`
    const k = m[1].toUpperCase(), tieuDe = m[2].trim()
    const than = dong.slice(1)
    let nhan = NHAN[k] ?? k
    if (k === 'VD') nhan = `Ví dụ ${++nVd}`
    else if (tieuDe) nhan += ' — ' + tieuDe
    const noi = k === 'PP'
      ? `<ol>${than.filter((x) => x.trim()).map((x) => `<li>${fmt(x.replace(/^\s*(\*\*)?Bước\s*\d+\s*[:.]?(\*\*)?\s*/i, ''))}</li>`).join('')}</ol>`
      : than.map((x) => (/^\*\*(Hướng dẫn giải|Bài giải|Lời giải)[:.]?\*\*$/i.test(x.trim()) || /^(Hướng dẫn giải|Bài giải|Lời giải)[:.]$/.test(x.trim()) ? '<div class="giai">Bài giải:</div>' : `<div>${fmt(x)}</div>`)).join('')
    return `<div class="kh k-${k}"><span class="nhan">${esc(nhan)}</span>${noi}</div>`
  }).join('')
}

let nNhom = 0, nDang = 0, nLtMoi = 0, nVdMoi = 0, nVdCo = 0, nLtCo = 0
const outLd = {}, ketLd = {}
if (existsSync(join(DIR, 'out-ld'))) for (const f of readdirSync(join(DIR, 'out-ld'))) {
  const m = f.match(/^out-(d+).json$/); if (m) { const o = JSON.parse(readFileSync(join(DIR, 'out-ld', f), 'utf8')); Object.assign(outLd, o.ly_thuyet_dang ?? {}); ketLd[m[1]] = o.ghi_chu ?? [] }
}
let nLdMoi = 0
const toc = [], body = [], ghiChu = []
for (const gf of goiFiles) {
  const so = gf.match(/\d+/)[0]
  const goi = JSON.parse(readFileSync(join(DIR, existsSync(join(DIR, 'goi-ld', gf)) ? 'goi-ld' : 'goi', gf), 'utf8'))
  const outP = join(DIR, 'out', `out-${so}.json`)
  const out = existsSync(outP) ? JSON.parse(readFileSync(outP, 'utf8')) : { vi_du: {}, ly_thuyet: {}, ghi_chu: [] }
  const soatP = join(DIR, 'out', `soat-${so}.md`)
  const ket = existsSync(soatP) ? ((readFileSync(soatP, 'utf8').match(/KẾT LUẬN:[^\n]*/) || [''])[0].replace(/\*\*/g, '')) : 'chưa soát'
  for (const g of out.ghi_chu ?? []) ghiChu.push(`Gói ${so}: ${g}`)
  for (const g of ketLd[so] ?? []) ghiChu.push(`Gói ${so} (lý thuyết dạng): ${g}`)
  body.push(`<h2 id="g${so}">Gói ${so} — ${esc(goi.ten)} <span class="ket">${esc(ket)}</span></h2>`)
  toc.push(`<li><a href="#g${so}">Gói ${so}: ${esc(goi.ten)}</a></li>`)
  for (const n of goi.nhom) {
    nNhom++
    const ltMoi = out.ly_thuyet?.[n.id]
    const lt = ltMoi || n.ly_thuyet_hien_co
    if (ltMoi) nLtMoi++; else if (lt) nLtCo++
    const dangs = n.dang.map((d) => {
      nDang++
      const moi = out.vi_du?.[d.id]
      const co = (d.vi_du_hien_co || '').trim()
      if (moi) nVdMoi++; else if (co) nVdCo++
      const ltd = outLd[d.id], ltCo = (d.ly_thuyet_dang_hien_co || '').trim()
      if (ltd) nLdMoi++
      const khoiLt = ltd ? `<div class="ltd"><div class="mini moi">Lý thuyết dạng — MỚI</div>${khoi(ltd)}</div>` : ltCo ? `<div class="ltd"><div class="mini">Lý thuyết dạng — có sẵn</div>${khoi(ltCo)}</div>` : '<div class="thieu">⚠ chưa có lý thuyết dạng</div>'
      const noiDung = [khoiLt, co ? `<div class="mini">có sẵn</div>${khoi(co)}` : '', moi ? `<div class="mini moi">${co ? 'bổ sung mới' : 'MỚI'}</div>${khoi(moi)}` : ''].join('')
      return `<div class="dang"><div class="dt"><b>${esc(d.id)}</b> ${esc(d.ten)}</div>${d.mo_ta ? `<div class="mt">Nhận biết: ${fmt(d.mo_ta)}</div>` : ''}${noiDung || '<div class="thieu">⚠ chưa có ví dụ</div>'}</div>`
    }).join('')
    body.push(`<section class="nhom" id="${n.id}"><h3>${esc(n.id)} · ${esc(n.ten)} <small>${esc(n.chuyen_de ?? '')}</small></h3>
<div class="lt"><div class="lth">Lý thuyết nhóm ${ltMoi ? '<span class="moi">MỚI</span>' : lt ? '<span class="co">có sẵn</span>' : '<span class="thieu">⚠ chưa có</span>'}</div>${lt ? khoi(lt) : ''}</div>${dangs || '<div class="mini">(nhóm chưa có dạng bài)</div>'}</section>`)
  }
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bản đồ mới K6 — lý thuyết + ví dụ</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>
body{font:15px/1.6 system-ui,'Segoe UI',sans-serif;max-width:980px;margin:0 auto;padding:16px;color:#1a1a2e;background:#fafafb}
h1{font-size:22px}h2{margin-top:32px;padding:8px 12px;background:#4c6fff;color:#fff;border-radius:8px;font-size:17px}h2 .ket{float:right;font-size:12px;font-weight:400}
.nhom{background:#fff;border:1px solid #dde;border-radius:10px;padding:12px 16px;margin:14px 0}.nhom h3{margin:0 0 8px;font-size:16px;color:#2d3a8c}.nhom h3 small{color:#888;font-weight:400}
.lt{border-left:4px solid #7c5cbf;padding:4px 12px;margin-bottom:12px;background:#f7f4fd;border-radius:0 8px 8px 0}.lth{font-weight:600;color:#5b3fa0;margin-bottom:6px}
.dang{border-top:1px dashed #ccd;margin-top:10px;padding-top:8px}.dt{color:#b23a72}.mt{font-size:13px;color:#667;margin:2px 0 6px}
.kh{border:1.5px solid #bbb;border-radius:10px;padding:8px 12px;margin:8px 0;position:relative}.kh .nhan{position:absolute;top:-10px;left:10px;background:#fff;padding:0 6px;font-size:12px;font-weight:700}
.k-ĐN{border-color:#c89b52}.k-ĐN .nhan{color:#c89b52}.k-ĐL,.k-DL{border-color:#7c5cbf}.k-ĐL .nhan{color:#7c5cbf}.k-TC{border-color:#2D9CDB}.k-TC .nhan{color:#2D9CDB}
.k-CY{border-color:#e08a2c}.k-CY .nhan{color:#e08a2c}.k-PP{border-color:#889}.k-PP .nhan{color:#667}.k-VD{border-color:#b23a72}.k-VD .nhan{color:#b23a72}.k-NX{border-color:#2aa198}
.giai{text-align:center;text-decoration:underline;font-weight:700;margin:6px 0}.txt{margin:6px 0}
.moi{background:#e6f7ea;color:#1b7a36;border-radius:4px;padding:0 6px;font-size:11px;font-weight:700}.co{background:#eee;color:#666;border-radius:4px;padding:0 6px;font-size:11px}
.mini{font-size:11px;color:#999;margin-top:6px}.mini.moi{background:none;color:#1b7a36;font-weight:700}.thieu{color:#c0392b;font-weight:600}
.ltd{border-left:4px solid #2D9CDB;background:#f2f9fe;padding:4px 10px;margin:6px 0;border-radius:0 8px 8px 0}.sum{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 16px}.gc li{margin:4px 0;font-size:14px}
</style></head><body>
<h1>Bản đồ mới Toán 6 — lý thuyết + ví dụ (14/10)</h1>
<div class="sum"><b>${nNhom}</b> nhóm · <b>${nDang}</b> dạng bài · lý thuyết MỚI <b>${nLtMoi}</b> (có sẵn ${nLtCo}) · ví dụ MỚI <b>${nVdMoi}</b> (dạng đã có sẵn ${nVdCo}) · lý thuyết DẠNG mới <b>${nLdMoi}</b>.
<ul>${toc.join('')}</ul></div>
${ghiChu.length ? `<h2>Điểm trạm soạn / soát còn nghi — cần Thùy xem</h2><ul class="gc">${ghiChu.map((g) => `<li>${fmt(g)}</li>`).join('')}</ul>` : ''}
${body.join('\n')}
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<script>renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})</script>
</body></html>`
writeFileSync(RA, html)
console.log(`✔ ${RA} — ${nNhom} nhóm · ${nDang} dạng · LT mới ${nLtMoi} · VD mới ${nVdMoi}`)
