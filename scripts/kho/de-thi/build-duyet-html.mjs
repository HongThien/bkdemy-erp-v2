// Dựng MỘT trang HTML để CEO DUYỆT cả lô đề (đề + hình + đáp số + lời giải + ảnh gốc câu cần quyết) — luật duyệt Thùy 14/10, xem HANDOFF.md ②.
// Dùng: node scripts/kho/de-thi/build-duyet-html.mjs <prefix> "<tiêu đề>" <ra.html> <MA1,MA2,...> ["ghi chú đề đã loại"]
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const [PRE, TIEU, RA, DS, LOAI = ''] = process.argv.slice(2)
const D = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/k7'
const LVR = 'C:/Users/WBPC/bk-kho-lam-viec/de-thi/K7'
const MAS = DS.split(',')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => s.split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.endsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'))).join('')
const para = (t) => t.split(/\n{2,}/).filter((x) => x.trim()).map((x) => `<p>${x.split('\n').map(fmt).join('<br>')}</p>`).join('')
const b64 = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '')

const toc = [], quyet = [], body = []
let tongCau = 0, tongChua = 0
for (const ma of MAS) {
  const md = readFileSync(join(D, `${ma}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const soat = existsSync(join(D, `${ma}.soat.md`)) ? readFileSync(join(D, `${ma}.soat.md`), 'utf8').replace(/\r\n/g, '\n') : ''
  const tieu = (md.match(/^# ĐỀ \| (.+)$/m) || [, ma])[1]
  const ket = (soat.match(/KẾT LUẬN:[^\n]*/) || [''])[0].replace(/\*\*/g, '')
  const sec = []
  let nCau = 0, nChua = 0
  const iGhi = md.search(/^## GHI CHÚ/m)
  const ghi = iGhi >= 0 ? md.slice(iGhi).replace(/^## GHI CHÚ CHO NGƯỜI DUYỆT\n?/, '') : ''
  for (const kp of (iGhi >= 0 ? md.slice(0, iGhi) : md).split(/^(?=## PHẦN )/m).slice(1)) {
    const h = kp.match(/^## PHẦN (\d+) \| (.+?) \| (\w+)/)
    sec.push(`<h3>${esc(h[2])}</h3>`)
    for (const kc of kp.split(/^(?=### )/m).slice(1)) {
      nCau++
      const dong = kc.slice(0, kc.indexOf('\n'))
      const m = dong.match(/^### (.+?) \| (.+)$/)
      const kv = Object.fromEntries(m[2].split('|').map((x) => x.trim().split('=').map((y) => y.trim())).map(([k, ...v]) => [k, v.join('=')]))
      const than = kc.slice(kc.indexOf('\n') + 1)
      const i1 = than.indexOf('**Phần 1. Hướng dẫn**'), i2 = than.indexOf('**Phần 2. Trình bày**')
      const de = [], lc = [], hinhs = [], notes = []
      let cur = null, coChua = false
      for (const d of than.slice(0, i1).split('\n')) {
        let x
        if ((x = d.match(/^\*\*Đề:\*\*\s*(.*)$/))) { cur = 'de'; if (x[1]) de.push(x[1]) }
        else if ((x = d.match(/^([A-D])\.\s+(.+)$/)) && kv.loai === 'trac_nghiem') { cur = 'lc'; lc.push(`<li><b>${x[1]}.</b> ${fmt(x[2])}</li>`) }
        else if ((x = d.match(/^\*\*Hình:\*\*\s*(.+)$/))) {
          cur = null
          x[1].split(',').map((s) => s.trim()).filter(Boolean).forEach((f) => {
            const p = join(LVR, ma, 'img', f)
            hinhs.push(existsSync(p) ? `<img class="hinh" src="${b64(p)}" alt="${f}">` : `<p class="loi">thiếu hình ${f}</p>`)
          })
        } else if ((x = d.match(/^\*\*Ghi chú:\*\*\s*(.+)$/))) { cur = null; notes.push(`<div class="ghi">Ghi chú: ${fmt(x[1])}</div>`) }
        else if ((x = d.match(/^\*\*Chưa chắc:\*\*\s*(.+)$/))) { cur = null; nChua++; coChua = true; notes.push(`<div class="chua">⚠ Chưa chắc: ${fmt(x[1])}</div>`) }
        else if (cur === 'de' && d.trim()) de.push(d)
      }
      const p1 = than.slice(i1 + '**Phần 1. Hướng dẫn**'.length, i2).trim()
      const p2 = than.slice(i2 + '**Phần 2. Trình bày**'.length).trim()
      const dap = kv.dap_an && kv.dap_an !== '—' ? `<span class="dap">Đáp số: <b>${fmt(kv.dap_an)}</b></span>` : ''
      const id = `${ma}-${slug(m[1])}`
      sec.push(`<section class="cau${coChua ? ' coc' : ''}" id="${id}"><div class="tit"><b>${esc(m[1])}</b> <span class="tag">${kv.loai === 'trac_nghiem' ? 'trắc nghiệm' : kv.loai === 'tra_loi_ngan' ? 'trả lời ngắn' : 'tự luận'}</span> <span class="tag">${kv.kho === 'hinh_hoc' ? 'hình học' : 'đại số'}</span> ${dap}</div>
<div class="de">${de.map((x) => `<p>${fmt(x)}</p>`).join('')}${lc.length ? `<ul class="lc">${lc.join('')}</ul>` : ''}${hinhs.join('')}</div>${notes.join('')}
<details><summary>Lời giải chi tiết</summary><div class="lg"><div class="ph">Phần 1. Hướng dẫn</div>${para(p1)}<div class="ph">Phần 2. Trình bày</div>${para(p2)}</div></details></section>`)
    }
  }
  // thẻ cần quyết: bảng "ẢNH CHO CEO" của biên bản soát
  const i = soat.indexOf('## ẢNH CHO CEO')
  if (i >= 0) {
    for (const l of soat.slice(i).split('\n')) {
      if (!l.startsWith('|') || /^\|[-| ]+\|$/.test(l) || l.includes('| Câu |')) continue
      const c = l.split('|').slice(1, -1).map((x) => x.trim())
      if (c.length < 4) continue
      const anh = [...c[1].matchAll(/`([^`]+)`/g)].map((x) => x[1].replace(/^can-xem[\\/]/, ''))
      quyet.push({ ma, tieu, cau: c[0], anh, trang: c[2], vd: c[3] })
    }
  }
  tongCau += nCau; tongChua += nChua
  toc.push(`<li><a href="#${ma}">${ma}</a> — ${esc(tieu)} · ${nCau} câu${nChua ? ` · <span class="w">${nChua} chưa chắc</span>` : ''}${ket ? ` · ${esc(ket.replace('KẾT LUẬN: ', ''))}` : ''}</li>`)
  body.push(`<article id="${ma}"><h2>${ma} · ${esc(tieu)}</h2><div class="sub">${nCau} câu${ket ? ' · ' + esc(ket) : ''}</div>${sec.join('\n')}${ghi.trim() ? `<h3>Ghi chú cho người duyệt</h3><div class="note">${para(ghi.replace(/^- /gm, '• '))}</div>` : ''}</article>`)
}
const anhCanXem = (n) => { const p = join(D, 'can-xem', n); return existsSync(p) ? `<img class="goc" src="${b64(p)}" alt="${n}">` : `<p class="loi">thiếu ảnh ${n}</p>` }
const idOf = (ma, cau) => `${ma}-${slug(cau)}`
const quyetHtml = quyet.map((q, k) => `<section class="qt"><div class="tit">${k + 1}. <span class="ma">${q.ma}</span> · ${esc(q.cau)} · <a href="#${idOf(q.ma, q.cau)}">xem đề + lời giải ↓</a></div>
<div class="meta">${esc(q.tieu)} · trang ${esc(q.trang)} của file PDF gốc</div><div class="vd">${fmt(q.vd)}</div>${q.anh.map(anhCanXem).join('')}</section>`).join('\n')

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TIEU)}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f6f7f9;--card:#fff;--tx:#1b1f24;--mu:#5b6573;--bd:#d9dee5;--ac:#1f5fbf;--wa:#b4501b;--wb:#fff4e8}
@media (prefers-color-scheme:dark){:root{--bg:#14171b;--card:#1d2127;--tx:#e8ebef;--mu:#9aa5b1;--bd:#333a43;--ac:#7fb0ff;--wa:#f0a070;--wb:#2b2218}}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.55 system-ui,sans-serif}
main{max-width:960px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0}h2{font-size:20px;margin:34px 0 4px;color:var(--ac);border-bottom:2px solid var(--bd);padding-bottom:4px}
h3{font-size:16px;margin:18px 0 8px;color:var(--mu)}
.sub{color:var(--mu);margin-bottom:8px}.w{color:var(--wa);font-weight:600}
.cau,.qt,.note{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:12px 14px;margin:0 0 12px}
.coc{border-color:var(--wa)}.ma{color:var(--wa);font-weight:700}
.tit{margin-bottom:6px}.tag{font-size:12px;color:var(--mu);border:1px solid var(--bd);border-radius:10px;padding:1px 8px;margin-left:4px}
.dap{margin-left:10px;color:var(--ac)}.meta{color:var(--mu);font-size:14px}.vd{margin:6px 0 8px}
.de p{margin:4px 0}.lc{list-style:none;padding:0;margin:6px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 16px}
.hinh{max-width:100%;max-height:320px;border:1px solid var(--bd);border-radius:6px;background:#fff;margin:6px 0;display:block}
.goc{max-width:100%;height:auto;border:2px solid var(--wa);border-radius:6px;background:#fff;margin:6px 0;display:block}
.ghi{color:var(--mu);font-size:14px;margin-top:6px}.chua{background:var(--wb);color:var(--wa);border-radius:6px;padding:6px 10px;margin-top:6px;font-size:14px}
details{margin-top:8px}summary{cursor:pointer;color:var(--ac);font-weight:600}
.lg{border-top:1px dashed var(--bd);margin-top:6px;padding-top:6px}.ph{font-weight:700;margin-top:8px}.lg p{margin:6px 0}
.loi{color:#c00}a{color:var(--ac)}
</style></head><body><main>
<h1>${esc(TIEU)}</h1>
<div class="sub">${MAS.length} đề · ${tongCau} câu · ${tongChua} câu còn “Chưa chắc” · ${quyet.length} chỗ cần quyết (ảnh gốc ở ngay dưới). Bấm “Lời giải chi tiết” để mở từng câu. Sửa trong <code>kho-rules/dai/lo/k7/&lt;MÃ&gt;.soan.md</code> rồi báo Claude ghi lại.${LOAI ? `<br>Đã loại khỏi lần ghi: ${esc(LOAI)}.` : ''}</div>
<h2>A. ${quyet.length} chỗ cần Thùy quyết</h2>
${quyetHtml || '<p>Không có.</p>'}
<h2>B. Mục lục các đề</h2><ol>${toc.join('')}</ol>
<h2>C. Toàn bộ đề + lời giải</h2>
${body.join('\n')}
</main></body></html>`
writeFileSync(RA, html)
console.log(MAS.length, 'đề ·', tongCau, 'câu ·', quyet.length, 'chỗ quyết ·', (html.length / 1e6).toFixed(1), 'MB')
