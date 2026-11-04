// Tách BÀI TẬP (có lời giải) từ 3 sách Toán 12 phần Nguyên hàm – Tích phân: Từ Tâm ch.4 (P2) · NBV 12-16/17/18 · PNL ch.4 (bản GV).
//   node kho-rules/dai/lo/k12-de/nhtp-sach/tach-bai-tap.mjs        → bai-tap-sach.json  (mỗi phần tử: nguon, file, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, loi:[])
import fs from 'node:fs'
import path from 'node:path'
import { convertDocx } from '../../../../../scripts/kho/mathtype-thu/doc.mjs'
const K12 = 'E:/BK ACADEMY/Tài liệu tham khảo/K12/'
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
const FILES = []
for (const f of walk(K12 + 'TOAN 12 - TOAN TU TAM/TOÁN 12 - TỪ TÂM/TOAN TU TAM_KHỐI 12_VIP/CHƯƠNG 4-NGUYÊN HÀM TÍCH PHÂN/')) if (/P2\.docx$/i.test(f) && !path.basename(f).startsWith('~$')) FILES.push({ nguon: 'Từ Tâm Toán 12 ch.4', f })
for (const sub of ['12-16. NGUYEN HAM', '12-17. TICH PHAN', '12-18. UNG DUNG TP TINH DIEN TICH-THE TICH']) for (const f of walk(K12 + 'TOAN 12 NBV NEW FULL/TOAN 12 NBV NEW FULL/' + sub)) { const b = path.basename(f); if (/^[B-F]\d?\./.test(b) && !/- CH\.docx$/.test(b) && /\.docx$/.test(b) && !b.startsWith('~$')) FILES.push({ nguon: 'NBV ' + sub.slice(0, 5), f }) }
for (const f of walk(K12 + 'TOAN 12 PNL - 2026/TOÁN 12 - PNL - 2026/CHUONG 4. NGUYEN HAM - TICH PHAN VA UD/')) if (/_GV\.docx$/i.test(f)) FILES.push({ nguon: 'PNL Toán 12 ch.4', f })
const TAG = /\[\[\/?(?:b|u|i|mau(?::[0-9A-Fa-f]+)?|nen(?::\w+)?)\]\]/g
const SYM = /^\[\[sym:[^\]]*\]\]\s*/
const ICON = /^\[\[img:image\d+\.png\]\]$/
const out = []
const MARK = /^(?:»\s*)?(?:Câu|Bài tập|Bài)\s*(\d+)\s*[.:]\s*(.*)$/
for (const { nguon, f } of FILES) {
  const r = await convertDocx(f)
  const raw = r.paragraphs.map((p) => p.replace(SYM, ''))
  const P = raw.map((p) => p.replace(TAG, '').replace(/[ \t]+$/g, ''))
  const gachMap = raw.map((p) => /\[\[u\]\]/.test(p))
  let cur = null
  const dong = () => { if (cur) { out.push(xuLy(cur, nguon, f)) } cur = null }
  for (let i = 0; i < P.length; i++) {
    const p = P[i]
    const m = p.match(MARK)
    if (m && !/^Bài\s*\d+\.?\s*$/.test(p)) { dong(); cur = { so: +m[1], dong: [m[2]], gach: [gachMap[i]] }; continue }
    if (!cur) continue
    if (/^(?:Dạng\s*\d+|B\.|[A-Z]\.\s+[A-ZÀ-Ỵ ]{6,})/.test(p) && /^Dạng/.test(p)) { dong(); continue }
    cur.dong.push(p); cur.gach.push(gachMap[i])
  }
  dong()
}
function xuLy(c, nguon, file) {
  const L = c.dong
  let iLG = L.findIndex((l) => /^(Lời giải|Hướng dẫn giải|Hướng dẫn|Gợi ý|Đáp án)\s*:?\s*$/i.test(l.trim()))
  const de = (iLG >= 0 ? L.slice(0, iLG) : L).filter((l) => !ICON.test(l))
  const lg = iLG >= 0 ? L.slice(iLG + 1).filter((l) => !ICON.test(l)).join('\n').trim() : ''
  const o = { nguon, file: path.basename(file), so: c.so, loi: [] }
  // phương án A–D
  const ln = de.join('\n')
  const mA = [...ln.matchAll(/(?:^|\n|[\t ])([A-D])\.\s*/g)]
  if (mA.length >= 4 && ['A', 'B', 'C', 'D'].every((x, k) => mA[k]?.[1] === x)) {
    const idx = mA.slice(0, 4).map((m) => m.index + (m[0].startsWith('\n') ? 1 : 0))
    const stem = ln.slice(0, mA[0].index).trim()
    const op = [0, 1, 2, 3].map((k) => ln.slice(mA[k].index, k < 3 ? mA[k + 1].index : ln.length).replace(/^[\n\t ]*[A-D]\.\s*/, '').trim())
    o.loai_cau = 'trac_nghiem'; o.noi_dung = stem; o.lua_chon = op
    const ch = lg.match(/Chọn\s*([A-D])/i) || lg.match(/^\s*([A-D])\b/)
    if (ch) o.dap_an = ch[1].toUpperCase()
    else { const k = c.gach.slice(0, de.length).findIndex((g, j) => g && /^[A-D]\./.test(de[j] ?? '')); if (k >= 0) o.dap_an = de[k][0] }
  } else if (/(^|\n)\s*[a-d]\)/.test(ln) && (ln.match(/(^|\n|\t|\s)[a-d]\)/g) || []).length >= 4 && /(đúng|sai)/i.test(ln + lg)) {
    const parts = ln.split(/(?:^|\n|\t|\s{2,})(?=[a-d]\)\s)/)
    const stem = parts[0].trim(); const md = parts.slice(1).map((x) => x.replace(/^[a-d]\)\s*/, '').trim())
    if (md.length === 4) { o.loai_cau = 'dung_sai'; o.noi_dung = stem; o.menh_de = md.map((x) => ({ noi_dung: x })) } else { o.loai_cau = 'tu_luan'; o.noi_dung = ln.trim() }
    o.loi.push('Đ/S: cần đáp án từng ý từ lời giải')
  } else { o.loai_cau = 'tu_luan'; o.noi_dung = ln.trim() }
  if (lg) o.loi_giai = lg
  if (o.loai_cau === 'tu_luan' && /^E\d?\./.test(path.basename(file))) o.loai_cau = 'tra_loi_ngan'   // NBV: tệp E = trả lời ngắn
  if (/EQ-FAILED|omml-equation|\[\[eq|\[\[img:/i.test(ln + lg)) o.loi.push('công thức hỏng hoặc có hình')
  if (!o.noi_dung || o.noi_dung.length < 12) o.loi.push('đề rỗng')
  return o
}
fs.writeFileSync('kho-rules/dai/lo/k12-de/nhtp-sach/bai-tap-sach.json', JSON.stringify(out))
const by = {}; for (const x of out) { const k = x.nguon + ' | ' + x.loai_cau; by[k] = (by[k] || 0) + 1 }
console.log('tệp', FILES.length, 'câu', out.length, 'sạch', out.filter((x) => !x.loi.length).length); console.table(by)
