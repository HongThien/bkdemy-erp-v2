// lap-batch.mjs — KHÔNG đọc DB, KHÔNG gọi AI. Chia phần còn lại của bộ toanmath thành BATCH có số hiệu cố định.
//   node kho-rules/dai/lo/toanmath/lap-batch.mjs
// Vào: hang-doi.json (tt chua / nghi_trung_scan) + .nhap-tam/toanmath-word/phan-loai.json (kết quả bóc máy lượt Word).
// Ra : batch.json (danh sách bài từng batch) — KE-HOACH.md đọc số từ đây. Thứ tự batch = thứ tự làm.
// Thứ tự (Thùy 12/11): CUỐI KÌ trước, khối 9 → 8 → 7 → 6 → 11 → 10 → 12; rồi GIỮA KÌ cùng thứ tự khối; rồi thi vào lớp trên (K9 vào 10, K12 chính thức, K12 thi thử sau cùng).
// Trong 1 khối × 1 chặng: đề thi (Word đã bóc ≤280 câu/batch → PDF ≤20 bài/batch → scan nghi trùng) rồi đề cương (≤10 bài/batch). Bài Word bóc 0 câu đi với PDF.
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


const word = hd.filter((x) => x.tt === 'chua' && x.dinh_dang === 'word' && !boQua(x)).map((x) => ban(x, plMap.get(x.ten_bai)?.chon?.cau ?? 0))
const wordCo = word.filter((x) => x.cau > 0)
const pdf = [...hd.filter((x) => x.tt === 'chua' && x.dinh_dang === 'pdf' && !boQua(x)).map((x) => ban(x)), ...word.filter((x) => !x.cau)]
const scan = hd.filter((x) => x.tt === 'nghi_trung_scan' && !boQua(x)).map((x) => ban(x))
let GD = ''
const chia = (ten, ds, cap, nhom, ghi) => { if (!ds.length) return; ds = ds.sort(sortBai); const k = Math.ceil(ds.length / cap); for (let i = 0; i < k; i++) {
  them('', nhom, k > 1 ? `${ten} (${i + 1}/${k})` : ten, ds.slice(Math.floor(i * ds.length / k), Math.floor((i + 1) * ds.length / k)), ghi); B.at(-1).giai_doan = GD } }
const chiaCau = (ten, ds) => { if (!ds.length) return; ds = ds.sort(sortBai); const g = [[]]; let c = 0
  for (const x of ds) { if (c + x.cau > 280 && g.at(-1).length) { g.push([]); c = 0 } g.at(-1).push(x); c += x.cau }
  if (g.length > 1 && g.at(-1).reduce((a, x) => a + x.cau, 0) < 60) g.at(-2).push(...g.pop())
  g.forEach((p, i) => { them('', 'Word', g.length > 1 ? `${ten} — Word (${i + 1}/${g.length})` : `${ten} — Word`, p, p.some((x) => x.loai_boc === 'hong') ? 'Có đề lỗi công thức: giải phần sạch, câu hỏng bỏ.' : ''); B.at(-1).giai_doan = GD }) }
const SCAN = 'Scan: bóc PDF xong so kho trước — trùng thì dừng, không giải.'
const nhomChang = (kh, loai, kys, ten) => { const f = (x) => x.khoi === kh && loaiF(x.folder) === loai && kys.includes(kyF(x.folder))
  chiaCau(ten, wordCo.filter(f)); chia(ten, pdf.filter(f), loai === 'de_cuong' ? 10 : 20, 'PDF'); chia(`${ten} — scan nghi trùng`, scan.filter(f), 20, 'PDF', SCAN) }
const KHOI = ['K9', 'K8', 'K7', 'K6', 'K11', 'K10', 'K12']
for (const [gd, kys, nhan] of [['1. Cuối kì', ['CKI', 'CKII'], 'cuối kì'], ['2. Giữa kì', ['GKI', 'GKII'], 'giữa kì']]) { GD = gd
  for (const kh of KHOI) { nhomChang(kh, 'de_thi', kys, `${kh} đề thi ${nhan}`); nhomChang(kh, 'de_cuong', kys, `${kh} đề cương ${nhan}`) } }
GD = '3. Thi vào lớp trên'
for (const [kh, loai, ten] of [['K9', 'chinh_thuc', 'K9 đề chính thức vào 10'], ['K9', 'thi_thu', 'K9 thi thử vào 10'], ['K12', 'chinh_thuc', 'K12 đề chính thức THPT'], ['K12', 'thi_thu', 'K12 thi thử THPT']]) nhomChang(kh, loai, [''], ten)
B[0].ghi_chu = ('BATCH THỬ — đo tỉ lệ Sonnet–Opus khớp, tỉ lệ trùng kho, thời gian; xong dừng báo Thùy quyết nhịp. ' + B[0].ghi_chu).trim()

// kiểm: mọi bài chua/scan có file đều vào đúng 1 batch
const all = B.flatMap((b) => b.bai.map((x) => x.ten_bai)), dup = all.filter((t, i) => all.indexOf(t) !== i)
const can = hd.filter((x) => (x.tt === 'chua' || x.tt === 'nghi_trung_scan') && x.dinh_dang !== 'khong_file' && !boQua(x)).map((x) => x.ten_bai)
const thieu = can.filter((t) => !all.includes(t))
if (dup.length || thieu.length) { console.error('LỆCH', { dup, thieu }); process.exit(1) }
B.forEach((b, i) => { b.ma = 'B' + String(i + 1).padStart(3, '0') })
fs.writeFileSync(path.join(HERE, 'batch.json'), JSON.stringify(B, null, 1))
for (const b of B) console.log(b.ma.padEnd(4), b.nhom.padEnd(12), b.ten.padEnd(46), String(b.so_bai).padStart(3), 'bài', b.so_cau_boc ? `${b.so_cau_boc} câu` : '')
console.log('TỔNG', B.length, 'batch ·', all.length, 'bài')
