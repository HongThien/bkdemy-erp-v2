// ============================================================================
// Xuất 2 PDF từ toan12.mjs để NGƯỜI đọc/duyệt (chưa đụng DB):
//   ① hinh-can-ve-toan12.pdf   — danh sách hình cần vẽ lại, kèm vùng cắt từ trang nguồn làm mẫu
//   ② the-cong-thuc-toan12.pdf — toàn bộ thẻ, có ô tick cho GV duyệt
//
// Chạy:  node scripts/sotay-cong-thuc/xuat-pdf.mjs --nguon <thư mục ảnh trang p01.jpg…p55.jpg>
//   Không có --nguon (hoặc thiếu ảnh) ⇒ vẫn xuất, ô mẫu ghi "không có ảnh mẫu".
// In PDF bằng Edge/Chrome headless (có sẵn trên máy Windows), KaTeX lấy từ node_modules.
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import os from 'node:os'
import katex from 'katex'
import { THE, HINH, CHU_DE, QUYEN } from './toan12.mjs'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'docs', 'so-tay-cong-thuc')
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null }
const NGUON = arg('--nguon')
const HOM_NAY = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Cùng khuôn MathText của app: $…$ là công thức, xuống dòng là dòng mới.
const md = (s) => s == null ? '' : String(s).split('\n').map((line) =>
  line.split(/(\$[^$]+\$)/g).map((p) => p.startsWith('$') && p.endsWith('$') && p.length > 1
    ? katex.renderToString(p.slice(1, -1), { throwOnError: true })
    : esc(p)).join('')).join('<br>')

const anhTrang = new Map()
function dataTrang(trang) {
  if (!NGUON) return null
  if (anhTrang.has(trang)) return anhTrang.get(trang)
  const f = path.join(NGUON, `p${String(trang).padStart(2, '0')}.jpg`)
  const v = fs.existsSync(f) ? `data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}` : null
  anhTrang.set(trang, v)
  return v
}
// Cắt vùng bằng khung overflow:hidden + lề âm (in ra PDF an toàn hơn background-image).
function khungCat(ref) {
  const src = ref && dataTrang(ref.trang)
  if (!src) return `<div class="khong-mau">${ref ? `Không có ảnh mẫu (thiếu ảnh trang ${ref.trang})` : 'Nguồn không có hình này — vẽ mới theo mô tả'}</div>`
  const [x, y, w, h] = ref.vung
  const s = Math.min(1.1, 330 / w, 400 / h)
  return `<div class="cat" style="width:${w * s}px;height:${h * s}px"><img src="${src}" style="width:${904 * s}px;margin-left:${-x * s}px;margin-top:${-y * s}px"></div>
    <div class="nho">Mẫu: quyển TD, trang ${ref.trang}</div>`
}

const CSS = `
  @page { size: A4; margin: 14mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2433; font-size: 12.5px; line-height: 1.5; margin: 0; }
  h1 { font-size: 21px; margin: 0 0 2px; } h2 { font-size: 15px; margin: 18px 0 8px; padding: 5px 9px; background: #1f3b73; color: #fff; border-radius: 5px; }
  .phu { color: #5b6475; margin: 0 0 12px; }
  .hop { border: 1px solid #cdd3df; border-radius: 7px; padding: 10px 12px; margin: 0 0 10px; break-inside: avoid; }
  .dau { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
  .ma { font-family: Consolas, monospace; font-size: 11px; background: #eef1f7; padding: 1px 6px; border-radius: 4px; color: #33405c; }
  .ten { font-weight: 700; font-size: 14px; }
  .the { display: inline-block; font-size: 10.5px; padding: 1px 7px; border-radius: 9px; }
  .t-ok { background: #dff3e8; color: #17663f; } .t-nv { background: #fdf0d8; color: #8a5800; } .t-hinh { background: #e5ecfb; color: #234a9b; }
  .hang { display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: start; margin-top: 6px; }
  .cat { overflow: hidden; border: 1px solid #b9c2d3; border-radius: 4px; background: #fff; }
  .cat img { display: block; }
  .khong-mau { width: 230px; padding: 16px 10px; border: 1.5px dashed #b9c2d3; border-radius: 6px; color: #7a8396; text-align: center; font-size: 11.5px; }
  .nho { color: #7a8396; font-size: 10.5px; margin-top: 3px; }
  .muc { color: #5b6475; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: .3px; margin-top: 7px; }
  .noi { margin: 3px 0 0; } .noi .katex { font-size: 1.06em; }
  .canh { margin-top: 6px; padding: 5px 8px; background: #fdecec; border-left: 3px solid #d64545; color: #8f2424; font-size: 11.5px; }
  .tick { margin-top: 7px; color: #5b6475; font-size: 11.5px; }
  .vang { background: #fff8e6; border: 1px solid #f0d58a; border-radius: 6px; padding: 8px 11px; margin-bottom: 12px; }
  table.tom { border-collapse: collapse; margin: 6px 0 12px; } table.tom td, table.tom th { border: 1px solid #cdd3df; padding: 3px 9px; text-align: left; }
`
const trang = (title, body) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="stylesheet" href="${pathToFileURL(path.join(ROOT, 'node_modules/katex/dist/katex.min.css')).href}">
<style>${CSS}</style></head><body>${body}</body></html>`

// ── ① HÌNH CẦN VẼ ───────────────────────────────────────────────────────────
const theTheoHinh = (ma) => THE.filter((t) => t.hinh === ma)
const coMau = HINH.filter((h) => h.ref).length
const body1 = `
<h1>Sổ tay công thức Toán 12 — Hình cần vẽ lại</h1>
<p class="phu">Đợt 1 · ${HINH.length} hình · ${coMau} hình có mẫu từ quyển nguồn, ${HINH.length - coMau} hình vẽ mới · xuất ${HOM_NAY}</p>
<div class="vang"><b>Cách dùng:</b> mỗi ô là 1 hình. Vẽ theo dòng "Cần vẽ"; ảnh bên phải chỉ để tham khảo bố cục (đừng chép nguyên).
Đặt tên file theo <b>mã hình</b> (vd <span class="ma">H05.png</span>) để ghép vào đúng thẻ. Nền trong suốt hoặc trắng, nét đủ đậm để xem trên điện thoại.</div>
${HINH.map((h) => {
  const dsThe = theTheoHinh(h.ma)
  return `<div class="hop">
    <div class="dau"><span class="ma">${h.ma}</span><span class="ten">${esc(h.ten)}</span></div>
    <div class="hang"><div>
      <div class="muc">Cần vẽ</div><div class="noi">${esc(h.mo_ta)}</div>
      <div class="muc">Dùng cho thẻ</div>
      ${dsThe.map((t) => `<div class="noi"><span class="ma">${t.ma}</span> ${esc(t.ten)}<div style="margin:3px 0 4px 2px">${md(t.noi_dung)}</div></div>`).join('')}
    </div><div>${khungCat(h.ref)}</div></div>
  </div>`
}).join('')}`

// ── ② THẺ CÔNG THỨC (để GV duyệt) ───────────────────────────────────────────
const soNv = THE.filter((t) => t.ct2018 === 'nghi_van').length
const soCanh = THE.filter((t) => t.ghi_chu_kiem).length
const tenNguon = (n) => { const [q, tr] = n.split(':'); return tr ? `${q} tr.${tr}` : q }
const body2 = `
<h1>Sổ tay công thức Toán 12 — Danh sách thẻ để duyệt</h1>
<p class="phu">Đợt 1 · ${THE.length} thẻ · xuất ${HOM_NAY}</p>
<div class="vang">
<b>GV duyệt từng thẻ:</b> tick "Đúng" hoặc ghi chỗ cần sửa. Ưu tiên đọc trước:
<b>${soNv}</b> thẻ nhãn <span class="the t-nv">CT 2018: cần xác nhận</span> (giữ hay bỏ khỏi sổ tay) và
<b>${soCanh}</b> thẻ có khung đỏ (nguồn in sai, đã sửa lại khi chép).<br>
Nguồn: ${Object.entries(QUYEN).map(([k, q]) => `<b>${k}</b> = ${esc(q.ten)} (${esc(q.tac_gia)})`).join(' · ')}.
</div>
<table class="tom"><tr><th>Chủ đề</th><th>Số thẻ</th></tr>
${CHU_DE.map((c) => `<tr><td>${esc(c.ten)}</td><td>${THE.filter((t) => t.chu_de === c.ma).length}</td></tr>`).join('')}</table>
${CHU_DE.map((c) => `<h2>${esc(c.ten)}</h2>` + THE.filter((t) => t.chu_de === c.ma).map((t) => `
  <div class="hop">
    <div class="dau"><span class="ma">${t.ma}</span><span class="ten">${esc(t.ten)}</span>
      ${t.ct2018 === 'co' ? '<span class="the t-ok">CT 2018</span>' : '<span class="the t-nv">CT 2018: cần xác nhận</span>'}
      ${t.hinh ? `<span class="the t-hinh">hình ${t.hinh}</span>` : ''}</div>
    <div class="noi">${md(t.noi_dung)}</div>
    ${t.luu_y ? `<div class="muc">Lưu ý</div><div class="noi">${md(t.luu_y)}</div>` : ''}
    ${t.cau_nho ? `<div class="muc">Câu nhớ</div><div class="noi">${md(t.cau_nho)}</div>` : ''}
    <div class="muc">Tên khác (để tìm)</div><div class="noi">${t.ten_khac.map(esc).join(' · ')}</div>
    ${t.ghi_chu_kiem ? `<div class="canh">${md(t.ghi_chu_kiem)}</div>` : ''}
    <div class="tick">Nguồn: ${t.nguon.map(tenNguon).join(', ')} &nbsp;|&nbsp; ☐ Đúng &nbsp; ☐ Sửa: ………………………………………… &nbsp; ☐ Bỏ</div>
  </div>`).join('')).join('')}`

// ── IN ──────────────────────────────────────────────────────────────────────
// Chrome trước: Edge headless trên máy công ty thoát im lặng, không ra file (đo 03/10).
const TRINH_DUYET = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => fs.existsSync(p))
if (!TRINH_DUYET) throw new Error('Không tìm thấy Edge/Chrome để in PDF')

fs.mkdirSync(OUT, { recursive: true })
for (const [ten, title, body] of [
  ['hinh-can-ve-toan12', 'Hình cần vẽ — Sổ tay công thức Toán 12', body1],
  ['the-cong-thuc-toan12', 'Thẻ công thức — Sổ tay Toán 12', body2],
]) {
  const html = path.join(OUT, `${ten}.html`)
  const pdf = path.join(OUT, `${ten}.pdf`)
  fs.writeFileSync(html, trang(title, body), 'utf8')
  execFileSync(TRINH_DUYET, ['--headless=new', '--disable-gpu', `--user-data-dir=${path.join(os.tmpdir(), 'sotay-pdf-profile')}`, '--no-pdf-header-footer', '--allow-file-access-from-files',
    '--virtual-time-budget=8000', `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore', timeout: 120000 })
  if (!process.argv.includes('--giu-html')) fs.rmSync(html)
  console.log('✔', path.relative(ROOT, pdf), `${(fs.statSync(pdf).size / 1024).toFixed(0)} KB`)
}
