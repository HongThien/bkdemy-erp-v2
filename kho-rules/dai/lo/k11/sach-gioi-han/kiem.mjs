// kiem.mjs — kiểm MỘT hoặc nhiều tệp kết quả của trạm soạn (sách K11 chương Giới hạn). Thoát mã ≠ 0 nếu có lỗi.
//   node kho-rules/dai/lo/k11/sach-gioi-han/kiem.mjs <don-vi>.json [...]
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { quet } from './quet-loi-latex.mjs'
import { kiemP1 } from '../../../../../scripts/kho/sach/kiem-p1-card.mjs'
const require = createRequire('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/package.json')
const katex = require('katex')
const HERE = new URL('.', import.meta.url).pathname.replace(/^\//, '')
const dich = readFileSync(HERE + 'dich.md', 'utf8')
const DANG = new Set([...dich.matchAll(/^- \*\*(NDB\d+)\*\*/gm)].map((m) => m[1]))
const LOAI = ['tu_luan', 'trac_nghiem', 'tra_loi_ngan', 'dung_sai']
let tongLoi = 0
for (const f of process.argv.slice(2)) {
  const loi = []
  let ds
  try { ds = JSON.parse(readFileSync(f, 'utf8')) } catch (e) { console.error(`${f}: JSON hỏng — ${e.message}`); tongLoi++; continue }
  if (!Array.isArray(ds)) { console.error(`${f}: phải là mảng`); tongLoi++; continue }
  const ids = new Set()
  for (const q of ds) {
    const e = (m) => loi.push(`${q.id ?? '?'}: ${m}`)
    if (!q.id || ids.has(q.id)) e('id thiếu / trùng'); ids.add(q.id)
    if (!['giang', 'luyen'].includes(q.vai)) e('vai phải giang|luyen')
    if (!LOAI.includes(q.loai_cau)) e('loai_cau sai')
    if (typeof q.noi_dung !== 'string' || !q.noi_dung.trim()) e('thiếu noi_dung')
    if (q.dang_bai) {
      if (!DANG.has(q.dang_bai)) e(`dang_bai ${q.dang_bai} không có trong dich.md`)
      if (!['cao', 'vua'].includes(q.dang_bai_chac)) e('dang_bai_chac phải cao|vua')
    } else if (q.vai === 'giang') e('vai=giang bắt buộc có dang_bai (kho trên lớp) — không có dạng thì đặt vai=luyen và ghi ghi_chu')
    const lg = q.loi_giai ?? ''
    const i2 = lg.indexOf('**Phần 2. Trình bày**')
    if (!lg.startsWith('**Phần 1. Hướng dẫn**') || i2 < 0) e('loi_giai phải có **Phần 1. Hướng dẫn** rồi **Phần 2. Trình bày**')
    else for (const m of kiemP1(lg.slice(0, i2).trim())) e('Phần 1: ' + m)
    if (q.loai_cau === 'trac_nghiem') {
      if (!Array.isArray(q.lua_chon) || q.lua_chon.length !== 4 || q.lua_chon.some((x) => typeof x !== 'string' || !x.trim())) e('trắc nghiệm cần lua_chon 4 chuỗi (không kèm "A.")')
      if (!/^[ABCD]$/.test(q.dap_an ?? '')) e('dap_an TN phải A|B|C|D')
      else if (i2 >= 0 && !lg.trimEnd().endsWith(`Chọn ${q.dap_an}.`)) e(`dòng cuối lời giải phải là "Chọn ${q.dap_an}."`)
    } else if (q.loai_cau === 'tra_loi_ngan') {
      if (!/^-?\d+(,\d+)?$/.test(q.dap_an ?? '') || String(q.dap_an).length > 4) e(`dap_an TLN «${q.dap_an}» phải là số ≤ 4 ký tự (chữ số, '-', ','); không thì loai_cau=tu_luan`)
    } else if (q.loai_cau === 'dung_sai') {
      if (q.dang_bai) e('câu Đúng/Sai KHÔNG gán dạng (dang_bai=null)')
      if (q.vai !== 'luyen') e('câu Đúng/Sai chỉ vai=luyen')
      if (!Array.isArray(q.menh_de) || q.menh_de.length !== 4 || q.menh_de.some((m) => !m.noi_dung || !['D', 'S'].includes(m.dap_an))) e('Đúng/Sai cần menh_de 4 phần tử {noi_dung, dap_an:"D"|"S"}')
    } else if (q.loai_cau === 'tu_luan' && q.dap_an && q.dap_an !== '—') e('tự luận: dap_an phải là "—"')
    const tat = [q.noi_dung, lg, ...(q.lua_chon ?? []), ...(q.menh_de ?? []).map((m) => m.noi_dung)].filter(Boolean).join('\n')
    if ((tat.match(/\$/g) || []).length % 2) e('số dấu $ lẻ')
    for (const m of tat.matchAll(/\$([^$]+)\$/g)) {
      try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (x) { e(`KaTeX «${m[1].slice(0, 40)}»`) }
      if (/\\times|\\left|\\right/.test(m[1])) e(`cấm \\times \\left \\right trong «${m[1].slice(0, 40)}» (nhân: \\cdot; ngoặc thường)`)
      if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) e(`chữ Việt ngoài \\text{} trong «${m[1].slice(0, 40)}»`)
    }
    if (/\$\$|\\\(|\\\[/.test(tat)) e('chỉ dùng $…$ (không $$, \\( \\[)')
    for (const m of quet(q)) loi.push(m) // LaTeX hỏng do thoát \ sai (TAB, mất dấu \)
    for (const k of q.kiem ?? []) { let r; try { r = (0, eval)(k) } catch (x) { r = 'lỗi ' + x.message } if (r !== true) e(`kiem ✘ ${String(k).slice(0, 70)} → ${r}`) }
  }
  console.log(`${f.split(/[\\/]/).pop()}: ${ds.length} câu · giảng ${ds.filter((q) => q.vai === 'giang').length} · luyện ${ds.filter((q) => q.vai === 'luyen').length} · Đ/S ${ds.filter((q) => q.loai_cau === 'dung_sai').length} · chưa dạng ${ds.filter((q) => !q.dang_bai && q.loai_cau !== 'dung_sai').length} · ${loi.length ? '✘ ' + loi.length + ' lỗi' : '✔ đạt'}`)
  for (const m of loi) console.error('  ' + m)
  tongLoi += loi.length
}
process.exit(tongLoi ? 1 : 0)
