// build-duyet-html.mjs (K11) — dựng MỘT trang HTML để Thùy DUYỆT 4 đề cương K11 (Trần Phú · Việt Đức · Hoàng Văn Thụ · Yên Hòa).
// Luật duyệt (HANDOFF ② "LUẬT DUYỆT"): muốn CEO duyệt / quyết gì thì PHẢI đưa file HTML xem được: ảnh trang đề gốc + đề + đáp số + lời giải.
//
//   node kho-rules/dai/lo/k11/de-cuong/build-duyet-html.mjs [ra.html]
//
// Mục A  "Cần Thùy quyết" = danh sách tay QUYET (bên dưới) — mỗi mục có ảnh TRANG gốc (tìm trang bằng chữ trong lớp chữ PDF).
// Mục B  "Đề in sai / lỗi in đã giải theo số liệu" = mọi câu có Ghi chú nói đề sai / lỗi in, ngoài mục A.
// Mục C  mục lục · Mục D toàn bộ đề + lời giải (KaTeX nạp từ CDN lúc mở trang).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const REPO = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2'
const D = `${REPO}/kho-rules/dai/lo/k11/de-cuong`
const LVR = 'C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K11'
const TXT = 'C:/Users/WBPC/AppData/Local/Temp/claude/C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2/13d71b51-a695-4744-a6a6-058127b977ee/scratchpad/dc'
const RA = process.argv[2] || `${REPO}/kho-rules/dai/k11-de-cuong-4-truong-duyet.html`

const DE = [
  { ma: 'TP-GKI-2026', ten: 'Trần Phú', txt: 'tp', files: 1 },
  { ma: 'VD-GKI-2026', ten: 'Việt Đức', txt: 'vd', files: 3 },
  { ma: 'HVT-GKI-2026', ten: 'Hoàng Văn Thụ', txt: 'hvt', files: 2 },
  { ma: 'YH-HKI-2026', ten: 'Yên Hòa', txt: 'yh', files: 17 },
]
// [ma, số PHẦN, nhãn câu, vấn đề — một–hai câu, trang ảnh (nếu máy không tự tìm được)]
// ĐÃ CHỐT 25/10 (bỏ khỏi mục A): YH P9 Câu 64 (đề là MI ⇒ DSSD) · YH P9 Câu 66 (giữ đề SSDS) · YH P1 Câu 50 (A) · YH P1 Câu 49 (C) · YH P1 Câu 38 (đề cương in sai, đáp B) · HVT P2 Câu 2 (chu kì nhỏ nhất) · HVT P2 Câu 8 (ý b Sai) · VD P4 Câu 3 (đề sai, giữ).
const QUYET = [
  ['YH-HKI-2026', 3, 'Câu 7', 'BỎ CÂU: ảnh đề cương mất dòng đề (chỉ còn 4 phương án tăng/giảm/…) — cần bản Word gốc để bổ sung. Câu này KHÔNG có trong kho.', 19],
  ['YH-HKI-2026', 7, 'Câu 37', 'Hỏi khái niệm đạo hàm (học kì II). Lời giải không tính đạo hàm — giữ câu này trong kho hay bỏ?', 34],
  ['YH-HKI-2026', 7, 'Câu 41', 'Hỏi khái niệm đạo hàm (học kì II). Lời giải rút gọn về hàm bậc nhất, không tính đạo hàm — giữ hay bỏ?', 36],
  ['YH-HKI-2026', 8, 'Câu 67', 'Đề thiếu hình và thiếu cạnh hình vuông ban đầu ⇒ lời giải viết theo cạnh a (ra 2a²). Giữ hay bỏ?'],
  ['YH-HKI-2026', 5, 'Câu 23', 'Ý d: hai nhóm cùng tần số lớn nhất 11 ⇒ công thức mốt ra 10 thuộc [10;15) nên ý d SAI (DDDS). Nếu hiểu “nhóm chứa mốt” là nhóm có tần số lớn nhất thì ý d ĐÚNG (DDDD).'],
  ['YH-HKI-2026', 9, 'Câu 25', 'Ảnh in “RA” ở phương án A và B. Đang đọc là lỗi in của “RS” ⇒ đáp B. Nếu giữ nguyên chữ “RA” thì đáp D.'],
  ['YH-HKI-2026', 9, 'Câu 60', 'Ý d thiếu chữ “phân biệt” — đang chọn SAI theo nghĩa chặt (DSDS); hiểu như SGK thì ĐÚNG (DSDD).'],
  ['VD-GKI-2026', 10, 'Câu 1', 'Ý d: đề in max = 2, tính ra √2 ⇒ ý d SAI (DDDS). Đây là mệnh đề sai hợp lệ hay in nhầm?'],
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => s.split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.endsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'))).join('')
const para = (t) => t.split(/\n{2,}/).filter((x) => x.trim()).map((x) => `<p>${x.split('\n').map(fmt).join('<br>')}</p>`).join('')
const b64 = (p, mime = 'image/png') => `data:${mime};base64,${readFileSync(p).toString('base64')}`
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ')
const LOAI = { trac_nghiem: 'trắc nghiệm', dung_sai: 'Đúng/Sai', tra_loi_ngan: 'trả lời ngắn', tu_luan: 'tự luận' }

const pages = {} // "MA:trang" → data uri
const nhapTrang = (ma, tr) => { const k = `${ma}:${tr}`; if (!pages[k]) { const p = [`p-${tr}.png`, `p-${String(tr).padStart(2, '0')}.png`].map((n) => join(LVR, ma, 'trang', n)).find(existsSync) ?? ''; if (existsSync(p)) pages[k] = b64(p) }; return pages[k] ? k : null }

const cauMap = new Map(), toc = [], body = []
let tong = 0
for (const de of DE) {
  const pagesTxt = existsSync(`${TXT}/${de.txt}.txt`) ? readFileSync(`${TXT}/${de.txt}.txt`, 'utf8').split('\f').map(norm) : []
  let md = ''
  for (let n = 1; n <= de.files; n++) md += '\n' + readFileSync(join(D, `${de.ma}.p${n}.soan.md`), 'utf8').replace(/\r\n/g, '\n').replace(/^## GHI CHÚ[\s\S]*$/m, '')
  const phanTen = {}
  const sec = []
  const hdr = [...md.matchAll(/^## PHẦN (\d+) \| (.+?) \| (\w+)/gm)]
  for (const h of hdr) phanTen[h[1]] = h[2]
  let nCau = 0
  for (const kp of md.split(/^(?=## PHẦN )/m).slice(1)) {
    const h = kp.match(/^## PHẦN (\d+) \| (.+?) \| (\w+)/)
    const ph = +h[1]
    const key = (nhan) => `${de.ma}|${ph}|${nhan}`
    const out = []
    for (const kc of kp.split(/^(?=### )/m).slice(1)) {
      nCau++
      const m = kc.slice(0, kc.indexOf('\n')).match(/^### (.+?) \| (.+)$/)
      const kv = Object.fromEntries(m[2].split('|').map((x) => x.trim().split('=').map((y) => y.trim())).map(([k, ...v]) => [k, v.join('=')]))
      const than = kc.slice(kc.indexOf('\n') + 1)
      const i1 = than.indexOf('**Phần 1. Hướng dẫn**'), i2 = than.indexOf('**Phần 2. Trình bày**')
      const deL = [], lc = [], hinhs = [], notes = []
      let cur = null
      let deTxt = ''
      for (const d of than.slice(0, i1).split('\n')) {
        let x
        if ((x = d.match(/^\*\*Đề:\*\*\s*(.*)$/))) { cur = 'de'; if (x[1]) deL.push(x[1]) }
        else if ((x = d.match(/^([A-D])\.\s+(.+)$/)) && kv.loai === 'trac_nghiem') { cur = 'lc'; lc.push(`<li><b>${x[1]}.</b> ${fmt(x[2])}</li>`) }
        else if ((x = d.match(/^\*\*Hình( giải)?:\*\*\s*(.+)$/))) {
          cur = null
          x[2].split(',').map((s) => s.trim()).filter(Boolean).forEach((f) => {
            const p = join(LVR, de.ma, 'img', f)
            hinhs.push(existsSync(p) ? `<figure><img class="hinh" src="${b64(p)}" alt="${f}"><figcaption>${x[1] ? 'Hình giải (vẽ bằng code)' : 'Hình đề (cắt từ đề cương)'}</figcaption></figure>` : `<p class="loi">thiếu hình ${f}</p>`)
          })
        } else if ((x = d.match(/^\*\*Ghi chú:\*\*\s*(.+)$/))) { cur = null; notes.push(`<div class="ghi">Ghi chú: ${fmt(x[1])}</div>`) }
        else if ((x = d.match(/^\*\*Chưa chắc:\*\*\s*(.+)$/))) { cur = null; notes.push(`<div class="chua">⚠ Chưa chắc: ${fmt(x[1])}</div>`) }
        else if ((cur === 'de' || cur === 'md') && d.trim()) deL.push(d)
      }
      deTxt = deL.join(' ')
      const p1 = than.slice(i1 + '**Phần 1. Hướng dẫn**'.length, i2).trim()
      const p2 = than.slice(i2 + '**Phần 2. Trình bày**'.length).trim()
      const dap = kv.dap_an && kv.dap_an !== '—' ? `<span class="dap">Đáp số: <b>${fmt(kv.dap_an)}</b></span>` : ''
      const id = `${de.ma}-${ph}-${m[1].replace(/\s+/g, '')}`
      const html = `<section class="cau" id="${id}"><div class="tit"><b>${esc(m[1])}</b> <span class="tag">${LOAI[kv.loai] ?? kv.loai}</span> <span class="tag">${kv.kho === 'hinh_hoc' ? 'hình học' : 'đại số'}</span> ${dap}</div>
<div class="de">${deL.map((x) => `<p>${fmt(x)}</p>`).join('')}${lc.length ? `<ul class="lc">${lc.join('')}</ul>` : ''}</div>${hinhs.join('')}${notes.join('')}
<details><summary>Lời giải chi tiết</summary><div class="lg"><div class="ph">Phần 1. Hướng dẫn</div>${para(p1)}<div class="ph">Phần 2. Trình bày</div>${para(p2)}</div></details></section>`
      cauMap.set(key(m[1]), { id, html, notesRaw: notes.join(' '), deTxt, ma: de.ma, ph, nhan: m[1], loai: kv.loai })
      out.push(html)
    }
    sec.push(`<h3>PHẦN ${ph} — ${esc(h[2])}</h3>${out.join('\n')}`)
  }
  tong += nCau
  toc.push(`<li><a href="#${de.ma}">${de.ma}</a> — ${esc(de.ten)} · ${nCau} câu</li>`)
  body.push(`<article id="${de.ma}"><h2>${de.ma} · THPT ${esc(de.ten)}</h2><div class="sub">${nCau} câu</div>${sec.join('\n')}</article>`)
  de.pagesTxt = pagesTxt
}

// tìm trang gốc của câu: cửa sổ 5 từ liên tiếp của đề xuất hiện trong đúng 1 trang của lớp chữ PDF
function timTrang(de, deTxt) {
  const words = deTxt.replace(/\$[^$]*\$/g, ' ').toLowerCase().match(/[a-zà-ỹđ]{3,}/g) ?? []
  for (const w of [5, 4, 6, 3]) {
    for (let i = 0; i + w <= words.length; i++) {
      const s = words.slice(i, i + w).join(' ')
      const hit = []
      de.pagesTxt.forEach((p, k) => { if (p.replace(/[^a-zà-ỹđ ]/g, ' ').replace(/\s+/g, ' ').includes(s)) hit.push(k + 1) })
      if (hit.length === 1) return hit[0]
    }
  }
  return null
}

const dsQuyet = [], daQuyet = new Set()
for (const [ma, ph, nhan, vd, trSan] of QUYET) {
  const c = cauMap.get(`${ma}|${ph}|${nhan}`)
  const de = DE.find((x) => x.ma === ma)
  daQuyet.add(`${ma}|${ph}|${nhan}`)
  const tr = trSan ?? (c ? timTrang(de, c.deTxt) : null)
  const pk = tr ? nhapTrang(ma, tr) : null
  dsQuyet.push(`<section class="qt"><div class="tit"><span class="ma">${ma}</span> · PHẦN ${ph} · <b>${esc(nhan)}</b> ${c ? `· <a href="#${c.id}">xem đề + lời giải ↓</a>` : '· (không có trong kho)'}</div>
<div class="vd">${fmt(vd)}</div>${pk ? `<div class="meta">Ảnh trang ${tr} của đề cương gốc:</div><img class="goc" data-pg="${pk}">` : '<p class="meta">(không tự tìm được trang ảnh — xem đề + lời giải bên dưới)</p>'}</section>`)
}
// mục B: câu có Ghi chú nói đề sai / lỗi in, ngoài mục A
const dsB = []
for (const [k, c] of cauMap) {
  if (daQuyet.has(k)) continue
  if (!/đề sai|lỗi in|in sai|in thiếu|in nhầm|in lỗi|in trùng|thiếu chữ|thiếu dấu/i.test(c.notesRaw)) continue
  const de = DE.find((x) => x.ma === c.ma)
  dsB.push(`<li><b>${c.ma}</b> · PHẦN ${c.ph} · <a href="#${c.id}">${esc(c.nhan)}</a> — ${c.notesRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 260)}</li>`)
}

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đề cương K11 — 4 trường duyệt</title>
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
.sub{color:var(--mu);margin-bottom:8px}
.cau,.qt{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:12px 14px;margin:0 0 12px}
.qt{border-color:var(--wa)}.ma{color:var(--wa);font-weight:700}
.tit{margin-bottom:6px}.tag{font-size:12px;color:var(--mu);border:1px solid var(--bd);border-radius:10px;padding:1px 8px;margin-left:4px}
.dap{margin-left:10px;color:var(--ac)}.meta{color:var(--mu);font-size:14px}.vd{margin:6px 0 8px;font-size:17px}
.de p{margin:4px 0}.lc{list-style:none;padding:0;margin:6px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 16px}
.hinh{max-width:100%;max-height:340px;border:1px solid var(--bd);border-radius:6px;background:#fff;margin:6px 0;display:block}
figure{margin:6px 0}figcaption{font-size:13px;color:var(--mu)}
.goc{max-width:100%;height:auto;border:2px solid var(--wa);border-radius:6px;background:#fff;margin:6px 0;display:block}
.ghi{color:var(--mu);font-size:14px;margin-top:6px}.chua{background:var(--wb);color:var(--wa);border-radius:6px;padding:6px 10px;margin-top:6px;font-size:14px}
details{margin-top:8px}summary{cursor:pointer;color:var(--ac);font-weight:600}
.lg{border-top:1px dashed var(--bd);margin-top:6px;padding-top:6px}.ph{font-weight:700;margin-top:8px}.lg p{margin:6px 0}
.loi{color:#c00}a{color:var(--ac)}ul.b li{margin:4px 0;font-size:14px}
</style></head><body><main>
<h1>Đề cương K11 giữa / học kì I — 4 trường (đã ghi vào Kho đề thi, dạng chờ)</h1>
<div class="sub">${DE.length} đề · ${tong} câu · ${dsQuyet.length} chỗ cần Thùy quyết (mục A, kèm ảnh trang đề cương gốc) · ${dsB.length} câu khác có đề in lỗi đã giải theo số liệu (mục B). Bấm “Lời giải chi tiết” để mở từng câu. Câu muốn đổi thì báo Claude sửa <code>kho-rules/dai/lo/k11/de-cuong/&lt;MÃ&gt;.p&lt;N&gt;.soan.md</code> rồi ghi lại.</div>
<h2>A. ${dsQuyet.length} chỗ cần Thùy quyết</h2>
${dsQuyet.join('\n')}
<h2>B. ${dsB.length} câu đề in sai / lỗi in — đã giải theo số liệu in, đã ghi “đề sai” trong lời giải</h2>
<ul class="b">${dsB.join('')}</ul>
<h2>C. Mục lục các đề</h2><ol>${toc.join('')}</ol>
<h2>D. Toàn bộ đề + lời giải</h2>
${body.join('\n')}
</main>
<script>const PG=${JSON.stringify(pages)};document.querySelectorAll('img[data-pg]').forEach(i=>{i.src=PG[i.dataset.pg]})</script>
</body></html>`
writeFileSync(RA, html)
console.log(DE.length, 'đề ·', tong, 'câu ·', dsQuyet.length, 'chỗ quyết ·', dsB.length, 'câu mục B ·', Object.keys(pages).length, 'trang ảnh ·', (html.length / 1e6).toFixed(1), 'MB →', RA)
for (const q of QUYET) if (!cauMap.has(`${q[0]}|${q[1]}|${q[2]}`)) console.log('  ⚠ không tìm thấy câu', q[0], q[1], q[2])
