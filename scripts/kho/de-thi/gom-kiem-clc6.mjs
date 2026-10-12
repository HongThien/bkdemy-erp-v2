// ============================================================================
// gom-kiem-clc6.mjs — GOM kết quả của bước KIỂM ĐỘC LẬP (clc6-brief-kiem.md) cho cả bộ đề CLC lớp 6.
//
//   node scripts/kho/de-thi/gom-kiem-clc6.mjs <de.json> <thư mục kiem> [--ra <kiem-tat-ca.json>] [--bao-cao <tệp .md>]
//
// Thư mục kiem chứa <mã-đề>.json (hoặc <mã-đề>.p1.json, .p2.json cho đề chia đôi). Việc của file này:
//   - ghép các phần, đối chiếu ĐỦ ma_nguon với de.json (thiếu / thừa ⇒ nêu);
//   - liệt kê: đề lệch có sua_de · đề lệch không sua_de · hình thiếu (hinh_pdf) · trường lạ về hình · đáp số sách sai · câu không tính được.
// Không gọi AI, không đụng DB. Người (Opus) đọc báo cáo rồi mới viết tệp sửa đề.
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const [fDe, dir] = args.filter((a) => !a.startsWith('--'))
const lay = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const RA = lay('--ra'), BC = lay('--bao-cao')
if (!dir) { console.error('Dùng: node scripts/kho/de-thi/gom-kiem-clc6.mjs <de.json> <dir kiem> [--ra kq.json] [--bao-cao bc.md]'); process.exit(2) }

const de = JSON.parse(readFileSync(fDe, 'utf8'))
const maNguon = (d, c) => `${d.ma} · ${d.danh_so_xuyen_phan || !d.phan.length ? '' : `P${c.phan}.`}${c.so}`
const tep = readdirSync(dir).filter((f) => f.endsWith('.json'))
const tat = {}, thieuDe = [], loi = []
const muc = { sua_de: [], lech_khong_sua: [], hinh_pdf: [], hinh_la: [], sach_sai: [], khong_tinh: [], khong_sach: 0, khop: 0 }
const KHOA_CHUAN = new Set(['de_lech', 'sua_de', 'hinh_pdf', 'dap_so_sach', 'dap_so_tinh', 'khop_sach', 'ghi_chu'])

for (const d of de) {
  const k = d.ma.replace(/\s+/g, '-')
  const ds = tep.filter((f) => f === `${k}.json` || new RegExp(`^${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.p\\d+\\.json$`).test(f))
  if (!ds.length) { thieuDe.push(d.ma); continue }
  const gop = {}
  for (const f of ds) {
    let j
    try { j = JSON.parse(readFileSync(join(dir, f), 'utf8')) } catch (e) { loi.push(`${f}: JSON hỏng — ${e.message}`); continue }
    for (const [m, v] of Object.entries(j)) { if (gop[m]) loi.push(`${d.ma}: ${m} có ở 2 tệp`); gop[m] = v }
  }
  const can = d.cau.map((c) => maNguon(d, c))
  const thieu = can.filter((m) => !gop[m]), thua = Object.keys(gop).filter((m) => !can.includes(m))
  if (thieu.length) loi.push(`${d.ma}: thiếu ${thieu.length} câu — ${thieu.join(', ')}`)
  if (thua.length) loi.push(`${d.ma}: mã lạ — ${thua.join(', ')}`)
  for (const m of can) {
    const v = gop[m]; if (!v) continue
    tat[m] = v
    if (v.sua_de) muc.sua_de.push({ m, lech: v.de_lech, sua: v.sua_de })
    else if (v.de_lech) muc.lech_khong_sua.push({ m, lech: v.de_lech })
    if (v.hinh_pdf?.length) muc.hinh_pdf.push({ m, trang: v.hinh_pdf, lech: v.de_lech })
    const la = Object.keys(v).filter((x) => !KHOA_CHUAN.has(x))
    if (la.length) muc.hinh_la.push({ m, truong: Object.fromEntries(la.map((x) => [x, v[x]])), lech: v.de_lech })
    if (v.dap_so_tinh == null) muc.khong_tinh.push({ m, ghi: v.ghi_chu })
    if (v.khop_sach === false) muc.sach_sai.push({ m, sach: v.dap_so_sach, tinh: v.dap_so_tinh, ghi: v.ghi_chu })
    else if (v.khop_sach === true) muc.khop++
    else muc.khong_sach++
  }
}
const n = Object.keys(tat).length
console.log(`${de.length - thieuDe.length}/${de.length} đề có kết quả kiểm · ${n} câu · khớp sách ${muc.khop} · sách lệch ${muc.sach_sai.length} · không có đáp số sách ${muc.khong_sach} · không tính được ${muc.khong_tinh.length}`)
console.log(`đề lệch có sua_de ${muc.sua_de.length} · lệch không sửa ${muc.lech_khong_sua.length} · thiếu hình (hinh_pdf) ${muc.hinh_pdf.length} · trường lạ ${muc.hinh_la.length}`)
if (thieuDe.length) console.log('CHƯA có kết quả:', thieuDe.join(' · '))
for (const l of loi) console.log('⚠', l)

const cat = (s, k = 400) => String(s ?? '').replace(/\s+/g, ' ').slice(0, k)
let o = `# Kết quả KIỂM ĐỘC LẬP bộ đề CLC lớp 6 — ${n} câu / ${de.length - thieuDe.length} đề\n\n`
o += `Khớp đáp số sách ${muc.khop} · sách lệch ${muc.sach_sai.length} · không có đáp số sách ${muc.khong_sach} · không tính được ${muc.khong_tinh.length}\n`
o += `\n## 1. Đề Word lệch PDF — người kiểm đề nghị sửa (${muc.sua_de.length})\n`
for (const x of muc.sua_de) o += `\n### ${x.m}\n- Lệch: ${cat(x.lech)}\n- Sửa: \`${JSON.stringify(x.sua).slice(0, 900)}\`\n`
o += `\n## 2. Lệch nhưng KHÔNG đề nghị sửa (${muc.lech_khong_sua.length})\n`
for (const x of muc.lech_khong_sua) o += `- **${x.m}** — ${cat(x.lech)}\n`
o += `\n## 3. Word thiếu hình, PDF có (${muc.hinh_pdf.length})\n`
for (const x of muc.hinh_pdf) o += `- **${x.m}** — trang ${x.trang.join(', ')} — ${cat(x.lech, 250)}\n`
o += `\n## 4. Trường ngoài mẫu (thường là hình gắn nhầm) (${muc.hinh_la.length})\n`
for (const x of muc.hinh_la) o += `- **${x.m}** — \`${JSON.stringify(x.truong).slice(0, 300)}\` — ${cat(x.lech, 250)}\n`
o += `\n## 5. Đáp số sách lệch với tự tính (${muc.sach_sai.length})\n`
for (const x of muc.sach_sai) o += `- **${x.m}** — sách: ${cat(x.sach, 120)} · tính: ${cat(x.tinh, 160)} — ${cat(x.ghi, 500)}\n`
o += `\n## 6. Không tính được (${muc.khong_tinh.length})\n`
for (const x of muc.khong_tinh) o += `- **${x.m}** — ${cat(x.ghi, 400)}\n`
if (BC) { writeFileSync(BC, o); console.log('→', BC) }
if (RA) { writeFileSync(RA, JSON.stringify(tat, null, 1)); console.log('→', RA) }
