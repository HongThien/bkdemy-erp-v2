// ============================================================================
// soan-tu-mau-thu.mjs — chuyển các LÔ THỬ đã CEO duyệt trong k<khối>-mau-thu.md thành BẢN SOẠN (khuôn của lo-tu-soan.mjs),
// để câu lô thử đi đúng một đường với câu giải hàng loạt: lo-tu-soan (KaTeX, hình đề, dạng chờ) → ghi-lo (cổng).
//
//   node scripts/kho/sach/soan-tu-mau-thu.mjs <mau-thu.md> --tieu-de-lo "LÔ SÁCH" --so-do <thư mục so-do> [--dap-an-tay <json>] --ra <soan.json>
//
// Đọc mọi câu dưới các tiêu đề "# <tieu-de-lo> …" (bỏ phần khác của file). Mỗi câu "## Câu N — <mã bài> · <đề>":
//   - ma_nguon = <mã bài> (đúng mã tach-bai: "LT 6.8", "LT 12.3c", "VD 13.2", "ON 22")
//   - loi_giai = "**Phần 1. Hướng dẫn**…**Phần 2. Trình bày**…" — dòng hình sơ đồ "![mô tả](so-do/X.svg)" ⇒ "(mô tả)" (alt, bản in),
//     mô tả JSON sơ đồ lấy từ <so-do>/X.json ⇒ so_do_mo_ta (máy vẽ lại + tự kiểm lúc dựng lô / ghi)
//   - dap_an = dòng "Đáp số:" cuối Phần 2; câu không có dòng đó (bài tính, lập luận) ⇒ phải có trong --dap-an-tay, thiếu thì DỪNG (không đoán)
// Hình ĐỀ (dòng "![Hình đề …](hinh-de/…)" trước Phần 1) không lấy ở đây — lo-tu-soan gắn theo manifest hình đề (--hinh-de).
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const mdTep = a[0], tieuDeLo = lay('--tieu-de-lo'), soDoDir = lay('--so-do'), ra = lay('--ra')
if (!mdTep || !tieuDeLo || !soDoDir || !ra) { console.error('Dùng: node scripts/kho/sach/soan-tu-mau-thu.mjs <mau-thu.md> --tieu-de-lo "LÔ SÁCH" --so-do <dir> [--dap-an-tay <json>] --ra <soan.json>'); process.exit(2) }
const dapAnTay = lay('--dap-an-tay') ? JSON.parse(readFileSync(lay('--dap-an-tay'), 'utf8')) : {}

const dong = readFileSync(mdTep, 'utf8').split(/\r?\n/)
const cau = [], loi = []
let trongLo = false, cur = null
const xong = () => { if (cur) cau.push(cur); cur = null }
for (const d of dong) {
  let m
  if (/^# /.test(d)) { xong(); trongLo = d.startsWith(`# ${tieuDeLo}`); continue }
  if (!trongLo) continue
  if (/^## Bảng tóm tắt|^\*\*Câu hỏi cho CEO/.test(d)) { xong(); continue }
  if ((m = d.match(/^## Câu \d+ — ([A-Z]{2,3} [\dA-Za-z.]+) · /))) { xong(); cur = { ma: m[1], phan: 0, p1: [], p2: [] }; continue }
  if (!cur) continue
  if (/^---\s*$/.test(d)) { xong(); continue }
  if (/^\*\*Phần 1\. Hướng dẫn\*\*/.test(d)) { cur.phan = 1; continue }
  if (/^\*\*Phần 2\. Trình bày\*\*/.test(d)) { cur.phan = 2; continue }
  if (cur.phan === 1) cur.p1.push(d)
  else if (cur.phan === 2) cur.p2.push(d)
}
xong()

const ket = []
for (const c of cau) {
  let soDo = null
  const sach = (ds) => ds.map((l) => {
    const h = l.match(/^!\[(?:Sơ đồ:?\s*)?([^\]]*)\]\(so-do\/([^)]+)\.svg\)\s*$/)
    if (!h) return l
    if (soDo) loi.push(`${c.ma}: có hơn một hình sơ đồ — gộp thành một mô tả mảng`)
    soDo = `${h[2]}.json`
    return `(${h[1]})`
  }).join('\n').replace(/\n{3,}/g, '\n\n').trim()
  const p1 = sach(c.p1), p2 = sach(c.p2)
  if (!p1 || !p2) { loi.push(`${c.ma}: thiếu Phần 1 hoặc Phần 2`); continue }
  let so_do_mo_ta = null
  if (soDo) {
    const f = join(soDoDir, soDo)
    if (!existsSync(f)) { loi.push(`${c.ma}: thiếu file sơ đồ ${f}`); continue }
    so_do_mo_ta = JSON.parse(readFileSync(f, 'utf8'))
  }
  const dongDS = p2.split('\n').reverse().find((l) => /^Đáp số:/.test(l.trim()))
  const dap_an = dongDS ? dongDS.trim().replace(/^Đáp số:\s*/, '') : dapAnTay[c.ma]
  if (!dap_an) { loi.push(`${c.ma}: không có dòng "Đáp số:" và chưa có trong --dap-an-tay`); continue }
  ket.push({ ma_nguon: c.ma, dap_an, loi_giai: `**Phần 1. Hướng dẫn**\n\n${p1}\n\n**Phần 2. Trình bày**\n\n${p2}`, ...(so_do_mo_ta ? { so_do_mo_ta } : {}) })
}
const dem = {}; for (const c of ket) dem[c.ma_nguon] = (dem[c.ma_nguon] || 0) + 1
for (const [k, n] of Object.entries(dem)) if (n > 1) loi.push(`mã "${k}" xuất hiện ${n} lần`)
for (const k of Object.keys(dapAnTay)) if (!ket.some((c) => c.ma_nguon === k)) loi.push(`--dap-an-tay có "${k}" không nằm trong các lô`)
if (loi.length) { console.error(`✘ ${loi.length} lỗi — KHÔNG ghi:`); for (const l of loi) console.error('  ', l); process.exit(1) }
writeFileSync(ra, JSON.stringify(ket, null, 1))
console.log(`✔ ${ket.length} câu · có sơ đồ ${ket.filter((c) => c.so_do_mo_ta).length} · đáp án tay ${Object.keys(dapAnTay).length}`)
console.log('→', ra)
