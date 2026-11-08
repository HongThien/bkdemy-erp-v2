// Tách VÍ DỤ HƯỚNG DẪN (có lời giải) từ Từ Tâm Toán 12 · Chương 4 (Nguyên hàm – Tích phân) — 3 tệp P1 — ra vi-du-tutam.json.
//   node kho-rules/dai/lo/k12-de/nhtp-sach/tach-vi-du-tutam.mjs
import fs from 'node:fs'
import path from 'node:path'
import { convertDocx } from '../../../../../scripts/kho/mathtype-thu/doc.mjs'
const ROOT = 'E:/BK ACADEMY/Tài liệu tham khảo/K12/TOAN 12 - TOAN TU TAM/TOÁN 12 - TỪ TÂM/TOAN TU TAM_KHỐI 12_VIP/CHƯƠNG 4-NGUYÊN HÀM TÍCH PHÂN/'
const FILES = ['C4-B1-NGUYÊN HÀM-P1.docx', 'C4-B2-TÍCH PHÂN-P1.docx', 'C4-B3-ỨNG DỤNG HÌNH HỌC CỦA TÍCH PHÂN-P1.docx']
const TAG = /\[\[\/?(?:b|u|i|mau(?::[0-9A-Fa-f]+)?|nen(?::\w+)?)\]\]/g
const ICON = /^\[\[img:image\d+\.png\]\]$/            // biểu tượng trang trí (lặp lại) — hình thật xử lý riêng
const SYM = /^\[\[sym:[^\]]*\]\]\s*/
const out = []
for (const f of FILES) {
  const r = await convertDocx(ROOT + f)
  const P = r.paragraphs.map((p) => p.replace(TAG, '').replace(SYM, '').replace(/[\t ]+$/g, ''))
  // đếm ảnh để biết ảnh nào là biểu tượng lặp
  const dem = {}; for (const p of P) { const m = p.match(/^\[\[img:(image\d+\.png)\]\]$/); if (m) dem[m[1]] = (dem[m[1]] || 0) + 1 }
  let dang = null, cur = null, mode = null
  const dong = () => { if (cur) { cur.de = cur.de.join('\n').trim(); cur.loi_giai = cur.lg.join('\n').trim(); delete cur.lg; if (cur.de) out.push(cur) } cur = null; mode = null }
  for (let i = 0; i < P.length; i++) {
    const p = P[i]
    const md = p.match(/^Dạng\s+(\d+)\.\s*(.+)$/); if (md) { dong(); dang = `Dạng ${md[1]}. ${md[2].trim()}`; continue }
    if (/^(B\s*$|Các dạng bài tập|C\s*$|Luyện tập|Bài\s+\d+\.?$)/.test(p) && cur) { dong(); continue }
    const mv = p.match(/^Ví dụ\s+(\d+(?:\.\d+)?)\.?\s*(.*)$/)
    if (mv) { dong(); cur = { file: f, dang_sach: dang, nhan: 'Ví dụ ' + mv[1], de: mv[2] ? [mv[2]] : [], lg: [], co_hinh: false }; mode = 'de'; continue }
    if (!cur) continue
    if (/^Lời giải\s*$/.test(p)) { mode = 'lg'; continue }
    if (ICON.test(p)) continue
    const mi = p.match(/^\[\[img:(image\d+\.png)\]\]$/)
    if (mi) { cur.co_hinh = true; continue }
    if (!p.trim()) continue
    ;(mode === 'lg' ? cur.lg : cur.de).push(p)
  }
  dong()
}
fs.writeFileSync('kho-rules/dai/lo/k12-de/nhtp-sach/vi-du-tutam.json', JSON.stringify(out, null, 1))
const by = {}; for (const x of out) by[x.file.slice(0, 12)] = (by[x.file.slice(0, 12)] || 0) + 1
console.log('ví dụ', out.length, by, 'có hình', out.filter((x) => x.co_hinh).length, 'không lời giải', out.filter((x) => !x.loi_giai).length)
