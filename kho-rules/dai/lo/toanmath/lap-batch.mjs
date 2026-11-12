// lap-batch.mjs — KHÔNG đọc DB, KHÔNG gọi AI. Chia phần còn lại của bộ toanmath thành BATCH có số hiệu cố định.
//   node kho-rules/dai/lo/toanmath/lap-batch.mjs
// Vào: hang-doi.json (tt chua / nghi_trung_scan) + .nhap-tam/toanmath-word/phan-loai.json (kết quả bóc máy lượt Word).
// Ra : batch.json (danh sách bài từng batch) — KE-HOACH.md đọc số từ đây. Thứ tự batch = thứ tự làm.
// Luật chia: Word ≤ ~200 câu/batch (đã biết số câu) · PDF ≤ 20 bài/batch, cùng khối + cùng loại (đề thi/đề cương/thi vào lớp trên).
//            Bài Word bóc 0 câu ⇒ dồn sang batch PDF cùng khối. Bài scan nghi trùng ⇒ đi cùng batch PDF đề thi khối đó (kiểm trùng trước).
import fs from 'node:fs'; import path from 'node:path'
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(HERE, '../../../..')
const hd = JSON.parse(fs.readFileSync(path.join(HERE, 'hang-doi.json'), 'utf8'))
const pl = JSON.parse(fs.readFileSync(path.join(ROOT, '.nhap-tam/toanmath-word/phan-loai.json'), 'utf8'))
// Noctorium (kiem-noctorium.json): bài đủ 2 nhân chứng trùng ⇒ coi như đã có. K12 ĐỀ CƯƠNG: KHÔNG làm (Thùy 12/11 — đề thi thử K12 đã quá nhiều).
const NOC = path.join(HERE, 'kiem-noctorium.json')
const noc = new Set(fs.existsSync(NOC) ? JSON.parse(fs.readFileSync(NOC, 'utf8')).filter((x) => x.bo_vi_noctorium).map((x) => x.ten_bai) : [])
const boQua = (x) => noc.has(x.ten_bai) || (x.khoi === 'K12' && x.folder.startsWith('Đề cương'))
const plMap = new Map(pl.map((x) => [x.ten_bai, x]))
const loaiF = (f) => f.startsWith('Đề cương') ? 'de_cuong' : f.startsWith('Đề thi') ? 'de_thi' : f.startsWith('Thi thử') ? 'thi_thu' : 'chinh_thuc'
const kyF = (f) => (f.split('/')[1] || '')
const KY = ['GKI', 'CKI', 'GKII', 'CKII', '']
const sortBai = (a, b) => KY.indexOf(kyF(a.folder)) - KY.indexOf(kyF(b.folder)) || a.ten_bai.localeCompare(b.ten_bai)
const B = []
const them = (ma, nhom, ten, bai, ghi) => B.push({ ma, nhom, ten, so_bai: bai.length, so_cau_boc: bai.reduce((s, x) => s + (x.cau ?? 0), 0) || null, ghi_chu: ghi || '', bai })
const ban = (x, cau) => ({ khoi: x.khoi, folder: x.folder, ten_bai: x.ten_bai, dinh_dang: x.dinh_dang, tt: x.tt, cau: cau ?? null, loai_boc: plMap.get(x.ten_bai)?.loai ?? null, files: x.files })

// ── Lượt WORD (đã bóc máy) ─────────────────────────────────────────────
const word = hd.filter((x) => x.tt === 'chua' && x.dinh_dang === 'word' && !boQua(x)).map((x) => ban(x, plMap.get(x.ten_bai)?.chon?.cau ?? 0))
const wordCo = word.filter((x) => x.cau > 0), word0 = word.filter((x) => !x.cau)
const lay = (f) => wordCo.filter(f).sort(sortBai)
const W = [
  ['W1', 'Thử nghiệm — K7 + K10 đề thi (sạch)', lay((x) => ['K7', 'K10'].includes(x.khoi) && loaiF(x.folder) === 'de_thi' && x.loai_boc !== 'hong'), 'Batch đo: tỉ lệ Sonnet–Opus khớp, tỉ lệ trùng kho, thời gian. Xong mới quyết nhịp các batch sau.'],
  ['W2', 'K11 đề thi GKI + CKI (sạch)', lay((x) => x.khoi === 'K11' && loaiF(x.folder) === 'de_thi' && ['GKI', 'CKI'].includes(kyF(x.folder)) && x.loai_boc !== 'hong')],
  ['W3', 'K11 đề thi GKII + đề lỗi công thức K10–K11', lay((x) => (x.khoi === 'K11' && x.folder === 'Đề thi/GKII') || (['K10', 'K11'].includes(x.khoi) && loaiF(x.folder) === 'de_thi' && x.loai_boc === 'hong')), 'Đề lỗi công thức: giải phần sạch, câu hỏng bỏ (không đoán).'],
  ['W4', 'K12 đề thi', lay((x) => x.khoi === 'K12' && loaiF(x.folder) === 'de_thi')],
  ['W5', 'Đề cương K10 + K11', lay((x) => ['K10', 'K11'].includes(x.khoi) && loaiF(x.folder) === 'de_cuong')],
  ['W6', 'Đề cương K12', lay((x) => x.khoi === 'K12' && loaiF(x.folder) === 'de_cuong')],
]
for (const [ma, ten, bai, ghi] of W) if (bai.length) them(ma, 'Word', ten, bai, ghi)

// ── Lượt PDF (bóc bằng Gemini) — K6→K9 đề thi trước, rồi đề cương, rồi K10→K12 ─
const pdf = hd.filter((x) => x.tt === 'chua' && x.dinh_dang === 'pdf' && !boQua(x)).map((x) => ban(x))
const scan = hd.filter((x) => x.tt === 'nghi_trung_scan' && !boQua(x)).map((x) => ban(x))
const word0Ban = word0.map((x) => ({ ...x, ghi: 'Word bóc 0 câu → đọc PDF' }))
let n = 0
const chia = (ten, ds, ghi, cap = 20) => { ds = ds.sort(sortBai); const k = Math.ceil(ds.length / cap); for (let i = 0; i < k; i++) {
  const phan = ds.slice(Math.floor(i * ds.length / k), Math.floor((i + 1) * ds.length / k))
  them(`P${++n}`, 'PDF', k > 1 ? `${ten} (${i + 1}/${k})` : ten, phan, ghi) } }
const KHOI = ['K6', 'K7', 'K8', 'K9']
for (const kh of KHOI) chia(`${kh} đề thi`, [...pdf, ...word0Ban].filter((x) => x.khoi === kh && loaiF(x.folder) === 'de_thi'))
for (const kh of KHOI) { const s = scan.filter((x) => x.khoi === kh); if (s.length) chia(`${kh} đề thi scan nghi trùng`, s, 'Scan: bóc PDF xong so kho trước — trùng thì dừng, không giải.') }
chia('K9 đề chính thức + thi thử vào 10', [...pdf, ...word0Ban].filter((x) => x.khoi === 'K9' && ['thi_thu', 'chinh_thuc'].includes(loaiF(x.folder))))
for (const kh of KHOI) chia(`${kh} đề cương`, [...pdf, ...word0Ban].filter((x) => x.khoi === kh && loaiF(x.folder) === 'de_cuong'), '', 10)
for (const kh of ['K10', 'K11', 'K12']) chia(`${kh} đề thi`, [...pdf, ...word0Ban].filter((x) => x.khoi === kh && loaiF(x.folder) === 'de_thi'))
for (const kh of ['K10', 'K11', 'K12']) { const s = scan.filter((x) => x.khoi === kh && loaiF(x.folder) === 'de_thi'); if (s.length) chia(`${kh} đề thi scan nghi trùng`, s, 'Scan: so kho trước khi giải.') }
for (const kh of ['K10', 'K11', 'K12']) chia(`${kh} đề cương`, [...pdf, ...word0Ban].filter((x) => x.khoi === kh && loaiF(x.folder) === 'de_cuong'), '', 10)
chia('K12 đề chính thức THPT', pdf.filter((x) => x.khoi === 'K12' && loaiF(x.folder) === 'chinh_thuc'))

// ── K12 thi thử — SAU CÙNG (Thùy xếp cuối) ─────────────────────────────
const tt = wordCo.filter((x) => x.khoi === 'K12' && loaiF(x.folder) === 'thi_thu').sort(sortBai)
{ const g = [[]]; let c = 0; for (const x of tt) { if (c + x.cau > 280 && g.at(-1).length) { g.push([]); c = 0 } g.at(-1).push(x); c += x.cau }
  if (g.length > 1 && g.at(-1).reduce((a, x) => a + x.cau, 0) < 60) g.at(-2).push(...g.pop())
  g.forEach((p, i) => them('T', 'Thi thử K12', `K12 thi thử Word (${i + 1}/${g.length})`, p)) }
chia('K12 thi thử PDF', [...pdf, ...word0Ban].filter((x) => x.khoi === 'K12' && loaiF(x.folder) === 'thi_thu'))
const ttScan = scan.filter((x) => x.khoi === 'K12' && loaiF(x.folder) === 'thi_thu'); if (ttScan.length) chia('K12 thi thử scan nghi trùng', ttScan, 'Scan: so kho trước khi giải.')

// kiểm: mọi bài chua/scan có file đều vào đúng 1 batch
const all = B.flatMap((b) => b.bai.map((x) => x.ten_bai)), dup = all.filter((t, i) => all.indexOf(t) !== i)
const can = hd.filter((x) => (x.tt === 'chua' || x.tt === 'nghi_trung_scan') && x.dinh_dang !== 'khong_file' && !boQua(x)).map((x) => x.ten_bai)
const thieu = can.filter((t) => !all.includes(t))
if (dup.length || thieu.length) { console.error('LỆCH', { dup, thieu }); process.exit(1) }
B.forEach((b, i) => { b.ma = 'B' + String(i + 1).padStart(3, '0') })
fs.writeFileSync(path.join(HERE, 'batch.json'), JSON.stringify(B, null, 1))
for (const b of B) console.log(b.ma.padEnd(4), b.nhom.padEnd(12), b.ten.padEnd(46), String(b.so_bai).padStart(3), 'bài', b.so_cau_boc ? `${b.so_cau_boc} câu` : '')
console.log('TỔNG', B.length, 'batch ·', all.length, 'bài')
