// gan_hinh.mjs — LUỒNG GẮN HÌNH ĐỀ: thư mục ảnh đặt tên theo mã câu → upload bucket 'kho-anh' → UPDATE anh_de.
//
//   node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc> [--ghi] [--thay]
//
// Tên file:  <ma_cau>[+<ma_cau2>…][_ghi_chu].png|jpg|jpeg      vd  HHC001914_2A.png  ·  HHC001924+HHC001935_11.png (2 câu dùng chung 1 hình)
// Tiền tố mã → bảng: xem BANG bên dưới (thêm dòng khi cần, KHÔNG đoán bảng từ tên).
// Không có --ghi: CHẠY THỬ — kiểm từng mã (có/không, đã có hình chưa), không upload, không UPDATE.
// Có --ghi: upload (1 lần/file) rồi UPDATE anh_de VÀ anh_dap_an (cùng 1 hình: hiện ở đề và ở lời giải — Thùy 07/10) của mọi câu
// trong tên file, tất cả trong 1 transaction DB. Không đè hình đã có (anh_de hoặc anh_dap_an) trừ khi --thay. Ảnh chỉ là URL trong DB (không base64) — đúng convention uploadKhoImage (src/lib/kho/api.ts).
// Khoá storage (SUPABASE_SERVICE_ROLE trong .env.local) chỉ dùng trong script này, KHÔNG in ra. Chuỗi DB lấy từ DATABASE_URL (.env).
import pg from 'pg'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const BANG = { HHC: 'hinh_hoc_cau_hoi' }
const KIEU = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

const argv = process.argv.slice(2)
const dir = argv.find((a) => !a.startsWith('--'))
const GHI = argv.includes('--ghi'), THAY = argv.includes('--thay')
if (!dir || !existsSync(dir)) { console.error('Dùng: node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc> [--ghi] [--thay]'); process.exit(2) }

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
  const sai = ma.filter((m) => !/^[A-Z]+\d+$/.test(m) || !BANG[m.replace(/\d+$/, '')])
  if (sai.length) { console.error(`❌ ${ten}: mã không hợp lệ hoặc tiền tố chưa khai trong BANG: ${sai.join(', ')}`); process.exit(2) }
  viec.push({ ten, kieu, ma })
}
if (!viec.length) { console.error('Không có file ảnh trong thư mục.'); process.exit(2) }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, statement_timeout: 30000 })
await c.connect()

// 2) Kiểm từng câu
let loi = 0
for (const v of viec) {
  v.dong = []
  for (const m of v.ma) {
    const bang = BANG[m.replace(/\d+$/, '')]
    const r = (await c.query(`select ma_cau, anh_de, anh_dap_an from ${bang} where ma_cau = $1 and xoa_at is null`, [m])).rows[0]
    if (!r) { console.error(`❌ ${v.ten}: không thấy câu ${m}`); loi++; continue }
    const co = r.anh_de || r.anh_dap_an
    if (co && !THAY) { console.error(`❌ ${v.ten}: ${m} đã có hình (${co.slice(-40)}) — thêm --thay nếu muốn đè`); loi++; continue }
    v.dong.push({ bang, ma: m })
  }
}
if (loi) { console.error(`\n${loi} lỗi — không làm gì cả.`); await c.end(); process.exit(1) }
console.log(`Kiểm xong ${viec.length} file → ${viec.reduce((s, v) => s + v.dong.length, 0)} câu. ${GHI ? 'GHI THẬT' : 'CHẠY THỬ (thêm --ghi để ghi)'}`)
for (const v of viec) console.log(`  ${v.ten}  →  ${v.ma.join(', ')}`)
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
await c.query('begin')
try {
  for (const { v, link } of daUp) for (const d of v.dong) {
    const r = await c.query(`update ${d.bang} set anh_de = $1, anh_dap_an = $1 where ma_cau = $2 and xoa_at is null`, [link, d.ma])
    if (r.rowCount !== 1) throw new Error(`UPDATE ${d.ma} rowCount=${r.rowCount}`)
  }
  await c.query('commit')
} catch (e) { await c.query('rollback'); console.error('❌ UPDATE lỗi, đã rollback DB (ảnh đã up còn nằm trong bucket):', e.message); await c.end(); process.exit(5) }
for (const { v, link } of daUp) console.log(`✔ ${v.ma.join('+')}  ${link}`)
await c.end()
