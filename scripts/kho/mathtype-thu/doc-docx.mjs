// ============================================================================
// doc-docx.mjs — đọc 1 file Word có công thức MathType ra chữ + LaTeX, KHÔNG qua OCR, KHÔNG gọi AI.
// BẢN THỬ (spike P0, 28/09) — chưa qua bộ đề chấm. Đọc README.md cạnh file này trước khi tin kết quả.
//
//   node scripts/kho/mathtype-thu/doc-docx.mjs "<file.docx>" [--ra <thư mục>]
//
// In tóm tắt ra màn hình. Có --ra thì ghi thêm <tên>.txt (văn bản đọc được) và <tên>.bao-cao.json.
// Công thức nào gặp thứ chưa hiểu thì đánh dấu HỎNG kèm lý do — không đoán, không lặng lẽ bỏ qua.
// ============================================================================
import { createRequire } from 'node:module'
import { writeFileSync, mkdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { convertDocx } from './doc.mjs'

const require = createRequire(import.meta.url)
const katex = require('katex')

const args = process.argv.slice(2)
const tep = args.find((a) => !a.startsWith('--'))
const iRa = args.indexOf('--ra')
const thuMucRa = iRa >= 0 ? args[iRa + 1] : null
if (!tep) { console.error('Dùng: node scripts/kho/mathtype-thu/doc-docx.mjs "<file.docx>" [--ra <thư mục>]'); process.exit(2) }

const t0 = Date.now()
const { paragraphs, nhan, equations, fallbackEquations, stats } = await convertDocx(tep)
const dem = { tong: equations.length, doi_duoc: 0, rong: 0, hong: 0, katex_dat: 0, katex_hong: 0 }
const lyDoHong = {}
const hong = []
for (const e of equations) {
  if (!e.ok) { dem.hong++; lyDoHong[e.reason] = (lyDoHong[e.reason] || 0) + 1; hong.push({ bin: e.bin, ly_do: e.reason, vi_tri: e.offset }); continue }
  dem.doi_duoc++
  if (e.empty) { dem.rong++; continue }
  const canhBao = console.warn
  console.warn = () => {}
  try { katex.renderToString(e.latex, { throwOnError: true }); dem.katex_dat++ }
  catch (err) { dem.katex_hong++; hong.push({ bin: e.bin, ly_do: 'KaTeX: ' + String(err.message).slice(0, 120), latex: e.latex }) }
  finally { console.warn = canhBao }
}
const vanBan = paragraphs.join('\n')
const tomTat = {
  tep: basename(tep),
  so_doan: paragraphs.length,
  cong_thuc_trong_van_ban: dem,
  cong_thuc_ban_sao_fallback_khong_dua_vao: fallbackEquations.length,
  ly_do_hong: lyDoHong,
  // Đánh số tự động: đã dựng lại nhãn từ numbering.xml; [[#]] chỉ còn khi numId không tra được
  so_doan_danh_so_tu_dong: nhan.filter(Boolean).length,
  nhan_cau_dung_lai: nhan.filter((n) => n && /Câu\s*\d+/i.test(n.text)).length,
  so_tu_dong_bi_mat_nhan: (vanBan.match(/\[\[#\]\]/g) || []).length,
  // Định dạng chữ giữ lại: [[u]] gạch chân · [[b]] đậm · [[mau:RRGGBB]] · [[nen:màu]]
  doan_co_gach_chan: paragraphs.filter((p) => p.includes('[[u]]')).length,
  chu_trang_giau: stats.runsWhiteText,
  ky_hieu_chua_doi: (vanBan.match(/\[\[sym:/g) || []).length,
  anh_thuong: (vanBan.match(/\[\[img:/g) || []).length,
  thong_ke_tai_lieu: stats,
  ms: Date.now() - t0,
}
console.log(JSON.stringify(tomTat, null, 2))
if (thuMucRa) {
  mkdirSync(thuMucRa, { recursive: true })
  const ten = basename(tep, extname(tep))
  writeFileSync(join(thuMucRa, ten + '.txt'), paragraphs.map((p, i) => `[${String(i + 1).padStart(4, '0')}] ${p}`).join('\n') + '\n', 'utf8')
  writeFileSync(join(thuMucRa, ten + '.bao-cao.json'), JSON.stringify({ ...tomTat, hong }, null, 2), 'utf8')
}
process.exit(dem.hong + dem.katex_hong > 0 ? 1 : 0)
