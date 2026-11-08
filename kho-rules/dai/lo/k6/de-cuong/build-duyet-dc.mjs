// build-duyet-dc.mjs — trang HTML để CEO DUYỆT các đề cương Toán 6 GKI Hà Nội (luật duyệt Thùy 14/10: mọi lô kèm 1 HTML xem được).
//   node kho-rules/dai/lo/k6/de-cuong/build-duyet-dc.mjs <ra.html> [MA…]     (mặc định: cả 5 đề)
// Mỗi đề: ảnh các trang gốc (bấm xem) → từng câu: đề + hình đề · đáp án · cờ CHƯA CHẮC / ghi chú · lời giải (gập) · hình giải. Công thức: KaTeX (CDN).
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const [RA, ...ARG] = process.argv.slice(2)
if (!RA) { console.error('Dùng: node …/build-duyet-dc.mjs <ra.html> [MA…]'); process.exit(2) }
const ROOT = 'C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K6'
const DS = ARG.length ? ARG : ['NQ-GKI-2026', 'TC-GKI-2026', 'CBQ-GKI-2026', 'NTH-GKI-2026', 'GV2-GKI-2026']
const url = (p) => pathToFileURL(p).href
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// giữ $…$ cho KaTeX; **đậm** → <b>; xuống dòng → <br>
const fmt = (s) => String(s ?? '').split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.endsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'))).join('')
const doan = (md) => String(md ?? '').split(/\n[ \t]*\n/).map((d) => `<p>${fmt(d.trim())}</p>`).join('')

let tong = 0, tongCc = 0
const toc = [], body = []
for (const MA of DS) {
  const LV = join(ROOT, MA), fDe = join(LV, 'de.json')
  if (!existsSync(fDe)) { body.push(`<h2>${MA}</h2><p class="thieu">chưa có de.json</p>`); continue }
  const de = JSON.parse(readFileSync(fDe, 'utf8'))
  const trang = existsSync(join(LV, 'anh')) ? readdirSync(join(LV, 'anh')).filter((f) => /^t-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2))) : []
  const nCc = de.cau.filter((q) => q.canh_bao.some((x) => x.startsWith('CHƯA CHẮC'))).length
  tong += de.cau.length; tongCc += nCc
  toc.push(`<li><a href="#${MA}">${esc(de.nguon)}</a> — ${de.cau.length} câu${nCc ? `, <b class="cc">${nCc} câu chưa chắc</b>` : ''}</li>`)
  const loai = { trac_nghiem: 'TN', tra_loi_ngan: 'TLN', tu_luan: 'Tự luận' }
  let h = `<h2 id="${MA}">${esc(de.ten)}</h2><div class="trang">Trang gốc: ${trang.map((f, i) => `<a href="${url(join(LV, 'anh', f))}" target="_blank">T${i + 1}</a>`).join(' ')} · <a href="${url(join(LV, 'goc.pdf'))}" target="_blank">PDF gốc</a></div>`
  for (const p of de.phan) {
    h += `<h3>${esc(p.ten)}</h3>`
    for (const q of de.cau.filter((c) => c.phan === p.thu_tu)) {
      const cc = q.canh_bao.filter((x) => x.startsWith('CHƯA CHẮC')).map((x) => x.replace(/^CHƯA CHẮC — /, ''))
      const gc = q.canh_bao.filter((x) => !x.startsWith('CHƯA CHẮC'))
      const imgs = (q.anh ?? []).map((a) => `<img src="${url(join(LV, 'img', a))}" alt="hình đề">`).join('')
      const gimgs = (q.anh_giai ?? []).map((a) => `<img src="${url(join(LV, 'img', a))}" alt="hình giải">`).join('')
      const lc = q.lua_chon ? `<ol type="A" class="lc">${q.lua_chon.map((x) => `<li>${fmt(x)}</li>`).join('')}</ol>` : ''
      const mdd = q.menh_de ? `<ul>${q.menh_de.map((m) => `<li>${fmt(typeof m === 'string' ? m : (m.noi_dung ?? JSON.stringify(m)))}</li>`).join('')}</ul>` : ''
      h += `<div class="cau${cc.length ? ' cc-cau' : ''}"><div class="hd"><b>${esc(q.nhan)}</b> <span class="tag">${loai[q.loai_cau] ?? q.loai_cau}</span> <span class="tag k">${q.kho === 'hgt' ? 'Hình' : 'Số'}</span>${q.dap_an && q.dap_an !== '—' ? ` <span class="da">Đáp án: <b>${esc(q.dap_an)}</b></span>` : ''}</div>
<div class="nd">${doan(q.noi_dung)}${lc}${mdd}${imgs}</div>
${cc.map((x) => `<div class="cc">⚠ CHƯA CHẮC — ${fmt(x)}</div>`).join('')}${gc.map((x) => `<div class="gc">ℹ ${fmt(x)}</div>`).join('')}
<details><summary>Lời giải</summary><div class="lg">${doan(q.loi_giai)}${gimgs}</div></details></div>`
    }
  }
  body.push(h)
}

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đề cương Toán 6 GKI — duyệt</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>
body{font:15px/1.6 system-ui,'Segoe UI',sans-serif;max-width:980px;margin:0 auto;padding:16px;color:#1a1a2e;background:#fafafb}
h1{font-size:22px}h2{margin-top:36px;padding:8px 12px;background:#4c6fff;color:#fff;border-radius:8px;font-size:17px}h3{color:#2d3a8c;margin:20px 0 6px}
.trang{margin:6px 0 10px;font-size:13px}.trang a{margin-right:6px}
.cau{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 14px;margin:10px 0}.cc-cau{border-color:#e0a030;background:#fffaf0}
.hd{font-size:14px}.tag{background:#eef;border-radius:4px;padding:0 6px;font-size:11px;color:#446}.tag.k{background:#efe}.da{margin-left:8px;color:#1b7a36}
.nd p{margin:4px 0}.lc{margin:4px 0 4px 18px}img{max-width:100%;max-height:340px;display:block;margin:6px 0;border:1px solid #ddd}
.cc{background:#fff0d6;border-left:4px solid #e0a030;padding:4px 10px;margin:6px 0;font-size:13px}.gc{color:#667;font-size:12.5px;margin:4px 0}
details{margin-top:6px}summary{cursor:pointer;color:#4c6fff;font-size:13px}.lg{border-left:3px solid #7c5cbf;padding:2px 12px;margin-top:6px;background:#f7f4fd}.lg p{margin:6px 0}
.sum{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 16px}.cc b,b.cc{color:#b36b00}.thieu{color:#c0392b}
</style></head><body>
<h1>Đề cương ôn tập giữa kì I Toán 6 (Hà Nội 2026–2027) — năm trường</h1>
<div class="sum"><b>${tong}</b> câu · <b class="cc">${tongCc}</b> câu còn cờ CHƯA CHẮC (nền vàng).<ul>${toc.join('')}</ul>
<small>Trên ERP: Kho đề thi › Đề cương (lọc theo trường). Mọi câu đang ở dạng chờ, chưa duyệt.</small></div>
${body.join('\n')}
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<script>renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})</script>
</body></html>`
writeFileSync(RA, html)
console.log(`✔ ${RA} — ${DS.length} đề · ${tong} câu · ${tongCc} câu chưa chắc`)
