// Dựng trang HTML để CEO xem 52 hình mới + 34 câu không vẽ (gói TH-1…TH-9, Thùy 19/10)
//   node scripts/anh/ve_thieu_hinh_html.mjs <ra.html>
import pg from 'pg'
import fs from 'node:fs'
import { bien } from '../kho/cau-hinh.mjs'
const RA = process.argv[2] || 'kho-rules/dai/lo/k7/hinh-moi-bo-sung.html'
const DIR = 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/'
const KHONG = {
  HHC002602: 'bốn phương án A–D mô tả bốn tình huống khác nhau, không có điểm đặt tên',
  HHC002775: 'phát biểu tiên đề Euclid, không có điểm đặt tên', HHC002776: 'câu khái niệm "chứng minh định lí"',
  HHC002779: 'dấu hiệu so le trong — vẽ đúng dữ kiện thì lộ đáp án (a ∥ b)', HHC002786: 'tính chất song song/vuông góc — hình đúng dữ kiện tự cho thấy đáp án',
  HHC002787: 'dấu hiệu đồng vị — hình bắt buộc có a ∥ b, lộ đáp án', HHC002796: 'giống HHC002779, hình lộ đáp án',
  HHC002784: 'hỏi đỉnh tương ứng — hai tam giác bằng nhau lộ đáp án', HHC002789: 'thuần thuật ngữ (giả thiết, kết luận)', HHC002791: 'bốn phương án là khẳng định bằng chữ, không có điểm đặt tên',
  HHC002797: 'phát biểu tiên đề Euclid', HHC002803: 'phát biểu tính chất góc so le trong', HHC002809: 'điền điều kiện cho m, n, p — hình lộ đáp án',
  HHC002816: 'phát biểu dấu hiệu song song, không có điểm/góc đặt tên', HHC002826: 'định nghĩa "Oc là phân giác khi…" — hình lộ điều kiện nằm giữa', HHC002834: 'định nghĩa song song/cắt nhau', HHC002836: 'a ⊥ c, b ⊥ c — hình lộ a ∥ b',
  HHC002837: 'định nghĩa "chứng minh định lí"', HHC002839: 'phát biểu hai góc đối đỉnh', HHC002841: 'tiên đề Euclid, đáp án chỉ là số', HHC002842: 'xác định giả thiết/kết luận của định lí bằng chữ',
  HHC002912: 'cạnh/góc tương ứng giữa hai tam giác — đánh dấu thì lộ đáp án', HHC002914: 'điền chỗ trống tiên đề Euclid',
  HHC002917: 'đỉnh tương ứng △ABC = △DEF — hình lộ cái cần suy', HHC002921: 'thuần khái niệm cạnh/góc tương ứng', HHC002924: 'tiên đề Euclid — vẽ đường song song gợi sẵn đáp án', HHC002925: 'thứ tự đỉnh trong c.c.c, thuần ký hiệu', HHC002926: 'định nghĩa đường trung trực, bốn phương án chữ',
  HHC002933: 'tiên đề Euclid', HHC002934: 'định lí dạng "Nếu… thì…"', HHC002935: 'định nghĩa hai tam giác bằng nhau', HHC002936: 'định nghĩa đường trung trực, phương án chữ',
  HHC002947: 'tiên đề Euclid', HHC002958: 'định nghĩa — hình dựng đúng trùng đáp án D',
}
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
const ds = JSON.parse(fs.readFileSync(DIR + 'TH-chung.json', 'utf8'))
const tong = new Map(ds.map((x) => [x.ma, x]))
const ve = []
for (let n = 1; n <= 9; n++) for (const f of fs.readdirSync(`${DIR}TH-${n}/moi`).filter((x) => x.endsWith('.png'))) ve.push({ ma: f.replace('.png', ''), n })
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => String(s ?? '').split(/(\$[^$]+\$)/g).map((p) => (p.startsWith('$') && p.length > 1 ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : esc(p).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'))).join('').replace(/\n/g, '<br>')
const the = []
for (const v of ve.sort((a, b) => a.ma.localeCompare(b.ma))) {
  const { rows: [q] } = await c.query('select noi_dung, lua_chon, dap_an, loi_giai, loai_cau from hinh_hoc_cau_hoi where ma_cau=$1', [v.ma])
  const lc = Array.isArray(q.lua_chon) ? `<ul class="lc">${q.lua_chon.map((x, k) => `<li><b>${'ABCD'[k]}.</b> ${fmt(typeof x === 'string' ? x : JSON.stringify(x))}</li>`).join('')}</ul>` : ''
  const img = `data:image/png;base64,${fs.readFileSync(`${DIR}TH-${v.n}/moi/${v.ma}.png`).toString('base64')}`
  the.push(`<section class="c"><div class="t"><b>${v.ma}</b> <span class="g">${esc((tong.get(v.ma)?.de ?? '').slice(0, 90))} · câu ${tong.get(v.ma)?.stt ?? ''}</span></div><div class="g2"><div><p>${fmt(q.noi_dung)}</p>${lc}<p class="d">Đáp án: <b>${fmt(q.dap_an ?? '—')}</b></p><details><summary>Lời giải</summary><div class="lg">${fmt(q.loi_giai ?? '')}</div></details></div><img src="${img}"></div></section>`)
}
const khong = Object.entries(KHONG).map(([m, l]) => `<tr><td>${m}</td><td>${esc((tong.get(m)?.de ?? '').slice(0, 70))}</td><td>${esc(l)}</td></tr>`).join('')
fs.writeFileSync(RA, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hình vẽ bổ sung — đề Toán 7</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"><script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>:root{--bg:#f6f7f9;--c:#fff;--t:#1b1f24;--m:#5b6573;--b:#d9dee5;--a:#1f5fbf}@media(prefers-color-scheme:dark){:root{--bg:#14171b;--c:#1d2127;--t:#e8ebef;--m:#9aa5b1;--b:#333a43;--a:#7fb0ff}}
body{margin:0;background:var(--bg);color:var(--t);font:16px/1.55 system-ui,sans-serif}main{max-width:1000px;margin:0 auto;padding:16px}h1{font-size:22px}h2{font-size:19px;color:var(--a);margin-top:28px}
.c{background:var(--c);border:1px solid var(--b);border-radius:10px;padding:10px 14px;margin:0 0 12px}.t{margin-bottom:6px}.g{color:var(--m);font-size:13px}.g2{display:grid;grid-template-columns:1fr minmax(240px,42%);gap:14px;align-items:start}
@media(max-width:700px){.g2{grid-template-columns:1fr}}img{max-width:100%;border:1px solid var(--b);border-radius:6px;background:#fff}.lc{list-style:none;padding:0;margin:4px 0;display:grid;grid-template-columns:1fr 1fr;gap:2px 12px}.d{color:var(--a);margin:4px 0}
details summary{cursor:pointer;color:var(--a);font-weight:600}.lg{border-top:1px dashed var(--b);margin-top:6px;padding-top:6px;font-size:15px}table{border-collapse:collapse;width:100%;font-size:14px}td{border:1px solid var(--b);padding:4px 8px;vertical-align:top}</style></head><body><main>
<h1>Hình vẽ bổ sung cho đề thi / đề cương Toán 7</h1>
<p class="g">${the.length} hình mới (vẽ bằng code, đã gắn lên ERP ở cả đề lẫn lời giải) · ${Object.keys(KHONG).length} câu không vẽ (lý do ở cuối). Mỗi thẻ: đề + đáp án + hình mới; bấm "Lời giải" để mở. Hình khác ý muốn thì báo mã câu (HHC…).</p>
<h2>A. ${the.length} hình mới</h2>${the.join('')}
<h2>B. ${Object.keys(KHONG).length} câu không vẽ</h2><p class="g">Câu khái niệm thuần (không có điểm đặt tên) hoặc vẽ đúng dữ kiện thì lộ luôn đáp án. Muốn vẽ câu nào thì báo mã, tôi vẽ hình minh hoạ (không đánh dấu kết luận).</p><table>${khong}</table>
</main></body></html>`)
console.log(the.length, 'hình ·', Object.keys(KHONG).length, 'không vẽ')
await c.end()
