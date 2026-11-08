// k5T-pt-html.mjs — trang HTML cho Thùy xem lô clone phần trăm 5T (đề · đáp án · lời giải 2 phần), gom theo dạng và loại.
//   node scripts/kho/clone/k5T-pt-html.mjs <lo.json> <ra.html>
import { readFileSync, writeFileSync } from 'node:fs'
const [vao, ra] = process.argv.slice(2)
if (!vao || !ra) { console.error('Dùng: node scripts/kho/clone/k5T-pt-html.mjs <lo.json> <ra.html>'); process.exit(2) }
const lo = JSON.parse(readFileSync(vao, 'utf8'))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')
const TEN_DANG = { NDB02771: 'Bài toán cơ bản về bán hàng', NDB02772: 'Bài toán cho lãi theo giá bán', NDB02773: 'Bài toán giảm giá' }
const TEN_LOAI = { gia_goc: 'Hỏi GIÁ GỐC', lai: 'Hỏi LÃI (tiền lãi)', gia_ban: 'Hỏi GIÁ BÁN', ti_le_lai: 'Hỏi TỈ LỆ LÃI', ti_le_ban: 'Hỏi TỈ LỆ BÁN', theo_gia_ban: 'Lãi tính theo GIÁ BÁN', giam_gia_1: 'Kiểu 1 · ngày thường lãi p%, giảm d% ⇒ còn lãi bao nhiêu', giam_gia_2: 'Kiểu 2 · giảm d%, còn lãi q% ⇒ ngày thường lãi bao nhiêu' }
const nhom = new Map()
for (const c of lo) { const k = c.dang + '|' + c.loai; if (!nhom.has(k)) nhom.set(k, []); nhom.get(k).push(c) }
let n = 0
const khoi = [...nhom.entries()].map(([k, ds]) => {
  const [dang, loai] = k.split('|')
  return `<h2>${esc(TEN_DANG[dang])} <small>${dang}</small> — ${esc(TEN_LOAI[loai] ?? loai)} <span class="sl">${ds.length} câu</span></h2>` + ds.map((c) => {
    n++
    return `<details class="cau"><summary><span class="stt">${n}</span> ${esc(c.noi_dung)} <span class="da">➜ ${esc(c.dap_an)}</span></summary><div class="lg">${md(c.loi_giai)}</div></details>`
  }).join('')
}).join('')
writeFileSync(ra, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>5T Tỉ số phần trăm — câu mới sinh</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<style>body{font:15px/1.55 system-ui,sans-serif;max-width:980px;margin:0 auto;padding:16px;color:#1b1f23;background:#fff}h1{font-size:20px}h2{font-size:16px;margin:26px 0 8px;padding:8px 10px;background:#eef3fb;border-left:4px solid #2f6fdb;border-radius:4px}h2 small{color:#667}.sl{float:right;color:#2f6fdb;font-weight:600}
.cau{border:1px solid #dde3ea;border-radius:6px;margin:6px 0;background:#fafbfc}.cau summary{cursor:pointer;padding:8px 10px}.stt{display:inline-block;min-width:26px;color:#fff;background:#2f6fdb;border-radius:10px;text-align:center;font-size:12px;padding:0 5px;margin-right:6px}.da{color:#0b7a3b;font-weight:600;margin-left:6px;white-space:nowrap}.lg{padding:10px 14px;border-top:1px dashed #cfd8e3;background:#fff}
@media(prefers-color-scheme:dark){body{background:#14181d;color:#e6e9ee}h2{background:#1d2735}.cau{background:#1a2027;border-color:#2b3541}.lg{background:#161b21}}</style></head><body>
<h1>5T · Tỉ số phần trăm — ${lo.length} câu mới sinh theo mẫu (chờ Thùy duyệt)</h1>
<p>Mỗi câu: đề → đáp án (chữ xanh) → bấm mở lời giải 2 phần. Đáp số và từng phép tính trong Phần 2 đã được máy tính lại độc lập.</p>
${khoi}
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
</body></html>`)
console.log('→', ra, lo.length, 'câu')
