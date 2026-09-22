// ============================================================================
// hs_reset_mk.mjs — ĐẶT LẠI mật khẩu cho HS quên pass.
// ----------------------------------------------------------------------------
// Mật khẩu HS nằm ở Supabase Auth (hash) ⇒ KHÔNG xem lại được, chỉ đặt lại được.
// Đặt về ĐÚNG quy ước provision (`provision_hs_auth.mjs`): password = chính mã HS.
//
// Cờ `must_change_password` theo CÙNG chính sách `hs_buoc_doi_mk.mjs`:
//   · cấp 3 (khối 10/11/12) ⇒ bật cờ — pass = mã HS đoán được, mà bài online cấp 3 là
//     phép đo chính ⇒ em phải đặt pass riêng ngay lần đăng nhập tới (cổng `DoiMatKhau`).
//   · khối khác ⇒ không bật — cấp 1 dùng chung tài khoản với bố mẹ.
//   Ép theo ý: --buoc-doi (luôn bật) · --khong-buoc (luôn không bật).
//
// ⚠ CẦN SUPABASE_SERVICE_ROLE trong .env.local (schema auth — claude_build không đụng được).
//
// Dùng:  node scripts/hs_reset_mk.mjs HS0044            # DRY-RUN, chỉ in ra
//        node scripts/hs_reset_mk.mjs HS0044 --write    # đặt lại thật
//        node scripts/hs_reset_mk.mjs HS0044 HS0520 --write
// BẮT BUỘC nêu mã HS — không có chế độ "reset hàng loạt theo khối".
// ============================================================================
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const url = env.VITE_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE
if (!serviceKey) { console.error('❌ Thiếu SUPABASE_SERVICE_ROLE trong .env.local.'); process.exit(1) }

const argv = process.argv.slice(2)
const WRITE = argv.includes('--write')
const EP_BAT = argv.includes('--buoc-doi')
const EP_TAT = argv.includes('--khong-buoc')
const MA = argv.filter((a) => !a.startsWith('--')).map((s) => s.trim().toUpperCase())
if (!MA.length) { console.error('❌ Nêu ít nhất 1 mã HS. Vd: node scripts/hs_reset_mk.mjs HS0044 --write'); process.exit(1) }
if (EP_BAT && EP_TAT) { console.error('❌ --buoc-doi và --khong-buoc loại trừ nhau.'); process.exit(1) }
const CAP_3 = ['10', '11', '12']

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

const { data: hs, error } = await admin.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi, trang_thai').in('ma_hs', MA).order('ma_hs').limit(200)
if (error) { console.error('❌ đọc hoc_sinh:', error.message); process.exit(1) }
for (const m of MA) if (!(hs ?? []).some((h) => h.ma_hs === m)) console.log(`  ⃠  ${m} — KHÔNG có trong hoc_sinh`)
if (!hs?.length) process.exit(1)

const { data: tks, error: e2 } = await admin.from('tai_khoan').select('id, hoc_sinh_id').in('hoc_sinh_id', hs.map((h) => h.id)).limit(200)
if (e2) { console.error('❌ đọc tai_khoan:', e2.message); process.exit(1) }
const uidOf = new Map((tks ?? []).map((t) => [t.hoc_sinh_id, t.id]))

console.log(`\nĐẶT LẠI mật khẩu = mã HS · ${WRITE ? '⚠ GHI THẬT' : 'DRY-RUN'}\n`)

let ok = 0, loi = 0
for (const h of hs) {
  const uid = uidOf.get(h.id)
  if (!uid) { console.log(`  ⃠  ${h.ma_hs} ${h.ho_ten} — CHƯA CÓ TÀI KHOẢN (chạy provision_hs_auth.mjs trước)`); loi++; continue }
  const { data: u, error: e3 } = await admin.auth.admin.getUserById(uid)
  if (e3 || !u?.user) { console.log(`  ✖  ${h.ma_hs} — đọc auth lỗi: ${e3?.message ?? 'không thấy user'}`); loi++; continue }

  const buocDoi = EP_BAT ? true : EP_TAT ? false : CAP_3.includes(String(h.khoi))
  const nhan = `${h.ma_hs} ${h.ho_ten} (khối ${h.khoi}, ${h.trang_thai}) → pass = ${h.ma_hs} · buộc đổi: ${buocDoi ? 'CÓ' : 'không'}`
  if (!WRITE) { console.log(`  →  ${nhan}`); ok++; continue }

  // Mật khẩu + cờ đi CHUNG 1 request (cùng lý do như DoiMatKhau.tsx — không có khe hở giữa hai bước).
  const { error: e4 } = await admin.auth.admin.updateUserById(uid, {
    password: h.ma_hs,
    user_metadata: { ...(u.user.user_metadata ?? {}), must_change_password: buocDoi },
  })
  if (e4) { console.log(`  ✖  ${h.ma_hs} — ${e4.message}`); loi++; continue }
  console.log(`  ✔  ${nhan}`); ok++
}

console.log(`\n${WRITE ? 'Đã đặt lại' : 'Sẽ đặt lại'}: ${ok} · lỗi: ${loi}`)
if (!WRITE && ok > 0) console.log('Chạy lại kèm --write để áp thật.')
