// gan_hinh.mjs — LUỒNG GẮN HÌNH ĐỀ: thư mục ảnh đặt tên theo mã câu → upload bucket 'kho-anh' → UPDATE anh_de.
//
//   node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc> [--ghi] [--thay] [--bang baitoan|bienthe|mohinh|cachgiai]
//
// Tên file:  <ma_cau>[+<ma_cau2>…][_ghi_chu].png|jpg|jpeg      vd  HHC001914_2A.png  ·  HHC001924+HHC001935_11.png (2 câu dùng chung 1 hình)
//            đuôi _lg = chỉ gắn hình lời giải (anh_dap_an) · đuôi _de = chỉ gắn hình đề (anh_de) · không đuôi = gắn cả hai
// --thay (luồng vẽ lại hình 13/10): đè hình đã có; URL cũ ghi vào scripts/anh/bien_ban/gan-hinh-<lúc>.json TRƯỚC khi UPDATE, ảnh cũ không bị xoá khỏi bucket.
// Tiền tố mã → bảng: xem BANG bên dưới (thêm dòng khi cần, KHÔNG đoán bảng từ tên).
// --bang (phần LUYỆN của kho Hình, 13/10): bảng đích do NGƯỜI GỌI khai, không suy từ tên tệp — xem LUYEN bên dưới (bảng, cột khoá, cột ảnh):
//     --bang baitoan   tên tệp = <ma bài toán>.png     (BT.07.045.01.png)  → hinh_baitoan.anh_chuan
//     --bang bienthe   tên tệp = <id biến thể>.png     (uuid)              → hinh_baitoan_bien_the.anh
//                      tên tệp = <id biến thể>_lg.png                      → hinh_baitoan_bien_the.anh_loi_giai
//     --bang mohinh    tên tệp = <ma mô hình>.png          (MH.045.png)        → hinh_mo_hinh.anh_cau_hinh   (khoá ma)
//     --bang cachgiai  tên tệp = <id cách giải>.png        (uuid)              → hinh_cach_giai.anh_loi_giai (khoá id)
//   Chỉ ghi ĐÚNG cột khai cho kiểu đó (không tự điền thêm cột ảnh khác), bump updated_at như app. Tên tệp không khớp mẫu khoá ⇒ dừng, không làm gì.
// Không có --ghi: CHẠY THỬ — kiểm từng mã (có/không, đã có hình chưa), không upload, không UPDATE.
// Có --ghi: upload (1 lần/file) rồi UPDATE anh_de VÀ anh_dap_an (cùng 1 hình: hiện ở đề và ở lời giải — Thùy 07/10) của mọi câu
// trong tên file, tất cả trong 1 transaction DB. Không đè hình đã có (anh_de hoặc anh_dap_an) trừ khi --thay. Ảnh chỉ là URL trong DB (không base64) — đúng convention uploadKhoImage (src/lib/kho/api.ts).
// Khoá storage (SUPABASE_SERVICE_ROLE trong .env.local) chỉ dùng trong script này, KHÔNG in ra. Chuỗi DB lấy từ DATABASE_URL (.env).
import pg from 'pg'
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const BANG = { HHC: 'hinh_hoc_cau_hoi', HH: 'hinh_hoc_cau_hoi' } // HH… = mã câu kiểu cũ (HH00087012), cùng bảng
// Cách gắn của một bảng: khoa = cột khoá ghi trong tên tệp · song = điều kiện "dòng còn sống" · cot[kiểu] = các cột ảnh được ghi
// (kiểu: chung = tên không đuôi · de = đuôi _de · lg = đuôi _lg; bảng không khai kiểu nào thì tên tệp kiểu đó bị từ chối) · bump = SET thêm.
const HOC = { khoa: 'ma_cau', song: ' and xoa_at is null', cot: { chung: ['anh_de', 'anh_dap_an'], de: ['anh_de'], lg: ['anh_dap_an'] }, bump: '' }
const LUYEN = {
  baitoan: { bang: 'hinh_baitoan', khoa: 'ma', mau: /^BT\.\d+\.\d+\.\d+$/, song: '', cot: { chung: ['anh_chuan'] }, bump: ', updated_at = now()' },
  bienthe: { bang: 'hinh_baitoan_bien_the', khoa: 'id', mau: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, song: '', cot: { chung: ['anh'], lg: ['anh_loi_giai'] }, bump: ', updated_at = now()' },
  mohinh: { bang: 'hinh_mo_hinh', khoa: 'ma', mau: /^MH\.\d+$/, song: '', cot: { chung: ['anh_cau_hinh'] }, bump: ', updated_at = now()' },
  cachgiai: { bang: 'hinh_cach_giai', khoa: 'id', mau: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, song: '', cot: { chung: ['anh_loi_giai'] }, bump: ', updated_at = now()' },
}
const KIEU = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

const argv = process.argv.slice(2)
const iBang = argv.indexOf('--bang'), TEN_BANG = iBang >= 0 ? argv[iBang + 1] : null
const dir = argv.find((a, i) => !a.startsWith('--') && !(iBang >= 0 && i === iBang + 1))
const GHI = argv.includes('--ghi'), THAY = argv.includes('--thay')
if (iBang >= 0 && !LUYEN[TEN_BANG]) { console.error(`--bang chỉ nhận: ${Object.keys(LUYEN).join(' | ')}`); process.exit(2) }
if (!dir || !existsSync(dir)) { console.error('Dùng: node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc> [--ghi] [--thay] [--bang baitoan|bienthe|mohinh|cachgiai]'); process.exit(2) }
// cach(mã) → cách gắn của mã đó; null = mã không hợp lệ với bảng đang gắn
const cach = TEN_BANG
  ? (m) => (LUYEN[TEN_BANG].mau.test(m) ? LUYEN[TEN_BANG] : null)
  : (m) => (/^[A-Z]+\d+$/.test(m) && BANG[m.replace(/\d+$/, '')] ? { ...HOC, bang: BANG[m.replace(/\d+$/, '')] } : null)

const envFile = {}
for (const f of ['.env.local']) {
  if (!existsSync(f)) continue
  for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) {
    if (!l.includes('=') || l.trim().startsWith('#')) continue
    const i = l.indexOf('='); envFile[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
  }
}

// 1) Đọc tên file → danh sách (file, mã câu[])
const viec = []
for (const ten of readdirSync(dir).sort()) {
  const kieu = KIEU[extname(ten).toLowerCase()]
  if (!kieu) continue
  const ma = ten.replace(/\.[^.]+$/, '').split('_')[0].split('+')
  const sai = ma.filter((m) => !cach(m))
  if (sai.length) { console.error(`❌ ${ten}: mã không hợp lệ${TEN_BANG ? ` với --bang ${TEN_BANG}` : ' hoặc tiền tố chưa khai trong BANG'}: ${sai.join(', ')}`); process.exit(2) }
  // …_lg.png = hình của LỜI GIẢI ⇒ chỉ gắn anh_dap_an · …_de.png = hình ĐỀ của câu có hình lời giải riêng ⇒ chỉ gắn anh_de
  const chiLG = /_lg\.[^.]+$/i.test(ten), chiDE = /_de\.[^.]+$/i.test(ten), kg = chiLG ? 'lg' : chiDE ? 'de' : 'chung'
  const thieu = ma.filter((m) => !cach(m).cot[kg])
  if (thieu.length) { console.error(`❌ ${ten}: bảng ${cach(thieu[0]).bang} không có cột ảnh cho kiểu "${kg}" (đuôi tên tệp sai?)`); process.exit(2) }
  viec.push({ ten, kieu, ma, kg })
}
if (!viec.length) { console.error('Không có file ảnh trong thư mục.'); process.exit(2) }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, statement_timeout: 30000 })
await c.connect()

// 2) Kiểm từng câu
let loi = 0
for (const v of viec) {
  v.dong = []
  for (const m of v.ma) {
    const k = cach(m), moiCot = [...new Set(Object.values(k.cot).flat())]
    const rs = (await c.query(`select ${moiCot.join(', ')} from ${k.bang} where ${k.khoa}::text = $1${k.song}`, [m])).rows
    if (rs.length !== 1) { console.error(`❌ ${v.ten}: ${rs.length ? `${rs.length} dòng trùng khoá` : 'không thấy dòng'} ${k.bang}.${k.khoa} = ${m}`); loi++; continue }
    const r = rs[0], co = k.cot[v.kg].map((cot) => r[cot]).find(Boolean)
    if (co && !THAY) { console.error(`❌ ${v.ten}: ${m} đã có hình (${co.slice(-40)}) — thêm --thay nếu muốn đè`); loi++; continue }
    v.dong.push({ ...k, cot: k.cot[v.kg], ma: m, cu: r })
  }
}
if (loi) { console.error(`\n${loi} lỗi — không làm gì cả.`); await c.end(); process.exit(1) }
console.log(`Kiểm xong ${viec.length} file → ${viec.reduce((s, v) => s + v.dong.length, 0)} câu. ${GHI ? 'GHI THẬT' : 'CHẠY THỬ (thêm --ghi để ghi)'}`)
for (const v of viec) console.log(`  ${v.ten}  →  ${v.dong.map((d) => `${d.ma} (${d.bang}.${d.cot.join(' + ')})`).join(', ')}`)
if (!GHI) { await c.end(); process.exit(0) }

// 3) Upload + UPDATE (1 transaction DB; upload xong mới UPDATE)
const url = envFile.VITE_SUPABASE_URL, key = envFile.SUPABASE_SERVICE_ROLE
if (!url || !key) { console.error('❌ thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(2) }
const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const thang = new Date().toISOString().slice(0, 7)
const daUp = []
for (const v of viec) {
  const path = `hinh_hoc/${thang}/${v.ma[0]}-${randomUUID()}${extname(v.ten).toLowerCase()}`
  const { error } = await sb.storage.from('kho-anh').upload(path, readFileSync(join(dir, v.ten)), { contentType: v.kieu, upsert: false })
  if (error) { console.error(`❌ upload ${v.ten} lỗi: ${error.message} (đã up ${daUp.length} file, DB chưa đổi)`); await c.end(); process.exit(4) }
  daUp.push({ v, link: sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl })
}
// Biên bản TRƯỚC khi đổi DB: URL cũ của từng câu (để hoàn lại được — ảnh cũ vẫn nằm trong bucket, script không xoá gì)
const luc = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'medium' }).format(new Date()).replace(/[: ]/g, '-')
mkdirSync('scripts/anh/bien_ban', { recursive: true })
let tepBB = `scripts/anh/bien_ban/gan-hinh-${luc}.json`
for (let i = 2; existsSync(tepBB); i++) tepBB = `scripts/anh/bien_ban/gan-hinh-${luc}-${i}.json` // chạy nhiều gói liền nhau trong cùng một giây: không đè biên bản trước
// phần Học giữ khuôn cũ (anh_de_cu, anh_dap_an_cu); phần Luyện ghi khoa + cot (các cột bị đổi) + cu (giá trị cũ của MỌI cột ảnh của dòng)
writeFileSync(tepBB, JSON.stringify(daUp.flatMap(({ v, link }) => v.dong.map((d) => (TEN_BANG
  ? { ma: d.ma, bang: d.bang, khoa: d.khoa, tep: v.ten, kieu: v.kg, cot: d.cot, cu: d.cu, moi: link }
  : { ma: d.ma, bang: d.bang, tep: v.ten, kieu: v.kg, anh_de_cu: d.cu.anh_de, anh_dap_an_cu: d.cu.anh_dap_an, moi: link }))), null, 1))
console.log(`Biên bản URL cũ → ${tepBB}`)
await c.query('begin')
try {
  for (const { v, link } of daUp) for (const d of v.dong) {
    const r = await c.query(`update ${d.bang} set ${d.cot.map((cot) => `${cot} = $1`).join(', ')}${d.bump} where ${d.khoa}::text = $2${d.song}`, [link, d.ma])
    if (r.rowCount !== 1) throw new Error(`UPDATE ${d.ma} rowCount=${r.rowCount}`)
  }
  await c.query('commit')
} catch (e) { await c.query('rollback'); console.error('❌ UPDATE lỗi, đã rollback DB (ảnh đã up còn nằm trong bucket):', e.message); await c.end(); process.exit(5) }
for (const { v, link } of daUp) console.log(`✔ ${v.ma.join('+')}  ${link}`)
await c.end()
