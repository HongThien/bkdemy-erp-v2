// gan_hinh_dai.mjs — GẮN / GHI NHÃN hình đề cho kho ĐẠI (dai_cau_hoi). Bổ sung cho gan_hinh.mjs (chưa có tiền tố mã 'T…' của kho Đại).
// spec-giai-bai §A8, §C12; spec-kho-cau-hoi §13. Mọi lượt: CHẠY THỬ (ROLLBACK) trừ khi có --ghi.
//
//   node --env-file=.env scripts/anh/gan_hinh_dai.mjs --manifest <m.json> [--dir <thư mục ảnh>] [--ghi]
//
// manifest = mảng { ma_cau, nguon: 'goc'|'ve_lai', ma_loi?: 'ae', tep?: '<tên png trong --dir>' }
//   · nguon 'goc'    : KHÔNG đổi anh_de, chỉ ghi nhãn (kho_hinh_nguon) khớp URL hiện tại.
//   · nguon 've_lai' : bắt buộc có tep + ma_loi (a–f). Upload bucket kho-anh (chỉ khi --ghi) → UPDATE anh_de (CHỈ anh_de; anh_dap_an giữ nguyên)
//                      → nhãn nguồn. Cùng một transaction. URL cũ ghi vào scripts/anh/bien_ban/gan-hinh-dai-<lúc>.json TRƯỚC khi UPDATE.
//   · Không đè nếu anh_de đã đổi so với lúc rà (--url-cu trong manifest, nếu có): dòng lệch ⇒ bỏ cả lượt.
// Không xoá ảnh cũ khỏi bucket. Không chạy lượt ghi nặng 17–22 h (K22) — script từ chối nếu --ghi trong khung giờ đó (--bat-chap để vượt, chỉ khi Thùy cho phép).
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { ghiNhanHinh } from '../kho/so-hinh.mjs'

const arg = (k) => { const i = process.argv.indexOf(k); return i < 0 ? null : process.argv[i + 1] }
const GHI = process.argv.includes('--ghi')
const man = JSON.parse(fs.readFileSync(arg('--manifest'), 'utf8'))
const dir = arg('--dir')
const gio = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', hour12: false }).format(new Date()))
if (GHI && gio >= 17 && gio < 22 && !process.argv.includes('--bat-chap')) { console.error('❌ 17–22 h VN: không chạy lượt ghi (K22)'); process.exit(3) }

// 27/11: thêm ve_lenh (có lệnh vẽ lại) và ve_moi (đề có hình mà kho thiếu — anh_de đang trống); cùng luồng ve_lai
const CO_TEP = (n) => ['ve_lai', 've_lenh', 've_moi'].includes(n)
let loi = 0
const bao = (m) => { console.error('❌ ' + m); loi++ }
for (const m of man) {
  if (!['goc', 've_lai', 've_lenh', 've_moi'].includes(m.nguon)) bao(`${m.ma_cau}: nguon lạ ${m.nguon}`)
  if (m.nguon === 've_lai' && !/^[a-f]{1,6}$/.test(m.ma_loi || '')) bao(`${m.ma_cau}: ve_lai thiếu mã lỗi a–f`)
  if (CO_TEP(m.nguon)) {
    if (!m.tep || !dir || !fs.existsSync(path.join(dir, m.tep))) bao(`${m.ma_cau}: thiếu tệp ảnh ${m.tep}`)
  }
}
const c = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
await c.connect()
const cu = new Map((await c.query(`select ma_cau, anh_de from dai_cau_hoi where ma_cau = any($1) and xoa_at is null`, [man.map((m) => m.ma_cau)])).rows.map((r) => [r.ma_cau, r.anh_de]))
for (const m of man) {
  if (!cu.has(m.ma_cau)) bao(`${m.ma_cau}: không có câu`)
  else if (m.nguon === 've_moi' ? cu.get(m.ma_cau) : !cu.get(m.ma_cau)) bao(`${m.ma_cau}: ${m.nguon === 've_moi' ? 'đã có anh_de — ve_moi chỉ cho câu chưa có hình' : 'không có anh_de'}`)
  else if (m.url_cu && m.url_cu !== cu.get(m.ma_cau)) bao(`${m.ma_cau}: anh_de đã đổi từ lúc rà`)
}
if (loi) { console.error(`\n${loi} lỗi — không làm gì cả.`); await c.end(); process.exit(1) }
const nVe = man.filter((m) => CO_TEP(m.nguon)).length
console.log(`Kiểm xong ${man.length} câu (giữ gốc ${man.length - nVe} · vẽ lại ${nVe}). ${GHI ? 'GHI THẬT' : 'CHẠY THỬ (ROLLBACK)'}`)

let link = new Map()
if (GHI) {
  const envFile = {}
  for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { if (!l.includes('=') || l.startsWith('#')) continue; const i = l.indexOf('='); envFile[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '') }
  const sb = createClient(envFile.VITE_SUPABASE_URL, envFile.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  const thang = new Date().toISOString().slice(0, 7)
  for (const m of man.filter((x) => CO_TEP(x.nguon))) {
    const p = `hinh_hoc/${thang}/T-${randomUUID()}.png`
    const { error } = await sb.storage.from('kho-anh').upload(p, fs.readFileSync(path.join(dir, m.tep)), { contentType: 'image/png', upsert: false })
    if (error) { console.error(`❌ upload ${m.tep}: ${error.message} (DB chưa đổi)`); await c.end(); process.exit(4) }
    link.set(m.ma_cau, sb.storage.from('kho-anh').getPublicUrl(p).data.publicUrl)
  }
  const luc = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'medium' }).format(new Date()).replace(/[: ]/g, '-')
  fs.mkdirSync('scripts/anh/bien_ban', { recursive: true })
  const bb = `scripts/anh/bien_ban/gan-hinh-dai-${luc}.json`
  fs.writeFileSync(bb, JSON.stringify(man.filter((m) => CO_TEP(m.nguon)).map((m) => ({ ma_cau: m.ma_cau, tep: m.tep, anh_de_cu: cu.get(m.ma_cau), moi: link.get(m.ma_cau) })), null, 1))
  console.log('Biên bản URL cũ →', bb)
}
await c.query('begin')
try {
  for (const m of man) {
    let url = cu.get(m.ma_cau)
    if (CO_TEP(m.nguon)) {
      url = link.get(m.ma_cau) || `https://thu.rollback/${m.ma_cau}.png`
      const r = await c.query(`update dai_cau_hoi set anh_de = $1 where ma_cau = $2 and xoa_at is null and anh_de is not distinct from $3`, [url, m.ma_cau, cu.get(m.ma_cau) ?? null])
      if (r.rowCount !== 1) throw new Error(`UPDATE ${m.ma_cau} rowCount=${r.rowCount}`)
    }
    await ghiNhanHinh(c, { kho: 'dai', ma_cau: m.ma_cau, url, nguon: m.nguon, ma_loi: m.nguon === 've_lai' ? m.ma_loi : null, ghi_boi: 'claude_code:ve-hinh-dai678' })
  }
  if (GHI) { await c.query('commit'); console.log(`✔ đã ghi ${man.length} nhãn · ${nVe} hình đổi`) }
  else { const d = (await c.query(`select nguon, count(*)::int n from kho_hinh_nguon where ghi_boi='claude_code:ve-hinh-dai678' group by 1`)).rows; await c.query('rollback'); console.log('ROLLBACK (thử OK). Trong transaction đã thấy:', JSON.stringify(d)) }
} catch (e) { await c.query('rollback'); console.error('❌ lỗi, đã rollback:', e.message); await c.end(); process.exit(5) }
await c.end()
