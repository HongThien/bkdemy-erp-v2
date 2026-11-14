// HTML duyệt lô k4T-5dang (đề · đáp án · lời giải 2 phần · kết quả bộ kiểm + bản giải mù).
//   node scripts/kho/clone/k4T-5dang-html.mjs <lo.json> [--mu <mu.json>] [--out reports/k4T-5dang-duyet.html]
import { readFileSync, writeFileSync } from 'node:fs'
import { katexCss, mathHtml, esc } from '../../lib/html-tu-chua.mjs'
import { kiemCau } from './k4T-5dang-kiem.mjs'
const a = process.argv.slice(2), opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d }
const lo = JSON.parse(readFileSync(a[0], 'utf8'))
const mu = new Map((opt('--mu') ? JSON.parse(readFileSync(opt('--mu'), 'utf8')) : []).map((x) => [x.id, x.dap_an]))
const nums = (s) => (String(s).replace(/\$/g, '').match(/\d+/g) || []).map(Number).join(',')
const TEN = { NDB01547: 'Tỉ số nhiều đại lượng — quy về đại lượng nhỏ nhất', NDB01548: 'Tỉ số nhiều đại lượng — tỉ số đôi một', NDB01549: 'Tỉ số nhiều đại lượng — phân số của các đại lượng bằng nhau', NDB01553: 'Quy đồng tử số 2 phân số', NDB01577: 'Tìm x áp dụng dãy phân số hiệu – tích' }
const dong = (s) => String(s).split('\n\n').map((x) => `<div class="d">${mathHtml(x).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')}</div>`).join('')
let html = '', dTr = '', nHong = 0, nLech = 0
for (const c of lo) {
  if (c.dang !== dTr) { dTr = c.dang; html += `<h2>${esc(TEN[c.dang] ?? c.dang)} <small>${c.dang} · ${lo.filter((x) => x.dang === c.dang).length} câu</small></h2>` }
  const loi = kiemCau(c), m = mu.get(c.id), lech = m != null && nums(m) !== nums(c.dap_an)
  if (loi.length) nHong++; if (lech) nLech++
  html += `<details${loi.length || lech ? ' open' : ''}><summary><b>#${c.id}</b> ${mathHtml(c.noi_dung)} <span class="da">→ ${mathHtml(c.dap_an)}</span>${loi.length ? ' <span class="x">✘ bộ kiểm</span>' : ' <span class="ok">✔</span>'}${m == null ? '' : lech ? ` <span class="x">✘ giải mù: ${mathHtml(m)}</span>` : ' <span class="ok">mù khớp</span>'}</summary>
${loi.length ? `<div class="loi">${loi.map(esc).join('<br>')}</div>` : ''}<div class="lg">${dong(c.loi_giai)}</div></details>`
}
const out = opt('--out', 'reports/k4T-5dang-duyet.html')
writeFileSync(out, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>4T 5 dạng — duyệt câu</title><style>${katexCss()}
:root{--bg:#fafafb;--c:#fff;--tx:#1f2937;--mu:#6b7280;--ln:#e5e7eb}@media(prefers-color-scheme:dark){:root{--bg:#0f1117;--c:#181b24;--tx:#e5e7eb;--mu:#9ca3af;--ln:#2a2f3a}}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.6 system-ui,"Segoe UI",sans-serif;padding:16px}main{max-width:900px;margin:0 auto}h1{font-size:21px}h2{font-size:18px;margin-top:30px;border-top:3px solid var(--ln);padding-top:12px}small{color:var(--mu);font-weight:400}
details{background:var(--c);border:1px solid var(--ln);border-radius:10px;margin:8px 0;padding:8px 12px}summary{cursor:pointer}.da{color:#2563eb;font-weight:600}.ok{color:#059669;font-size:12px}.x{color:#dc2626;font-size:12px;font-weight:600}
.lg{border-top:1px dashed var(--ln);margin-top:8px;padding-top:6px}.d{margin:6px 0}.loi{color:#dc2626;font-size:14px;margin-top:6px}@media(max-width:600px){body{padding:12px}}</style></head><body><main>
<h1>4T — câu soạn mới cho 5 dạng sách không có bài (chờ duyệt)</h1>
<p>${lo.length} câu · máy sinh theo mẫu bám mô tả + lý thuyết + ví dụ của dạng · bộ kiểm độc lập (đọc lại số từ đề, vét cạn / tính phân số chính xác): ${lo.length - nHong}/${lo.length} đạt · giải mù (model khác chỉ thấy đề): ${mu.size ? `${mu.size - nLech}/${mu.size} khớp` : 'chưa có'}.
Bấm từng câu để xem lời giải. Chưa ghi vào kho — nói <b>"ghi"</b> thì mới ghi (câu sẽ được gán dạng và tự duyệt lên app).</p>${html}</main></body></html>`)
console.log('→', out, '· bộ kiểm hỏng', nHong, '· mù lệch', nLech)
