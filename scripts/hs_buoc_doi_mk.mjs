// ============================================================================
// hs_buoc_doi_mk.mjs — Gắn cờ BUỘC ĐỔI MẬT KHẨU cho tài khoản HS.
// ----------------------------------------------------------------------------
// VÌ SAO: `provision_hs_auth.mjs` đặt PIN = CHÍNH mã HS cho toàn bộ tài khoản HS.
// Với cấp 3, bài tập online là PHÉP ĐO CHÍNH (mastery, sắp tới Elo) — mà phép đo chỉ
// có nghĩa nếu quy được về đúng MỘT người. PIN đoán được ⇒ HS đăng nhập hộ nhau ⇒
// mọi con số phía sau vô nghĩa. Cờ này bật cổng `DoiMatKhau` (App.tsx) trước khi HS
// vào app: chưa đặt mật khẩu riêng thì chưa làm được bài.
//
// PHẠM VI MẶC ĐỊNH = CẤP 3 (khối 10/11/12). Cấp 1 CỐ Ý không gắn: cấp 1 dùng chung
// tài khoản với bố mẹ (bài online chỉ là tự luyện, không vào mastery) nên PH cần giữ
// được mật khẩu. Cấp 2 chưa dùng online.
//
// ⚠ CẦN SUPABASE_SERVICE_ROLE trong .env.local (schema auth — claude_build không đụng được).
//
// Dùng:  node scripts/hs_buoc_doi_mk.mjs                  # DRY-RUN, chỉ in ra
//        node scripts/hs_buoc_doi_mk.mjs --write          # gắn cờ thật
//        node scripts/hs_buoc_doi_mk.mjs --khoi 10,11     # giới hạn khối
//        node scripts/hs_buoc_doi_mk.mjs --go HS0001      # chỉ vài mã (test trước)
//        node scripts/hs_buoc_doi_mk.mjs --go HS0001 --bo # GỠ cờ (lỡ gắn nhầm)
//
// Idempotent: HS đã đổi mật khẩu rồi (cờ = false do chính HS đặt) thì KHÔNG gắn lại —
// gắn lại là bắt người ta đổi mật khẩu lần hai vô cớ.
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
const has = (f) => argv.includes(f)
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null }
const WRITE = has('--write')
const BO = has('--bo')                                    // gỡ cờ thay vì gắn
const KHOI = (val('--khoi') ?? '10,11,12').split(',').map((s) => s.trim()).filter(Boolean)
const iGo = argv.indexOf('--go')
const ONLY = iGo >= 0 ? argv.slice(iGo + 1).filter((a) => !a.startsWith('--')) : []

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

// ① HS trong phạm vi + tài khoản auth của họ
let q = admin.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi').eq('trang_thai', 'dang_hoc')
if (ONLY.length) q = q.in('ma_hs', ONLY)
else q = q.in('khoi', KHOI)
const { data: hs, error } = await q.order('ma_hs').limit(2000)
if (error) { console.error('❌ đọc hoc_sinh:', error.message); process.exit(1) }
if (!hs?.length) { console.log('Không có HS nào khớp phạm vi.'); process.exit(0) }

const { data: tks, error: e2 } = await admin.from('tai_khoan').select('id, hoc_sinh_id')
  .in('hoc_sinh_id', hs.map((h) => h.id)).limit(2000)
if (e2) { console.error('❌ đọc tai_khoan:', e2.message); process.exit(1) }
const uidOf = new Map((tks ?? []).map((t) => [t.hoc_sinh_id, t.id]))

console.log(`\n${BO ? 'GỠ' : 'GẮN'} cờ must_change_password · khối [${ONLY.length ? 'theo mã' : KHOI.join(',')}] · ${WRITE ? '⚠ GHI THẬT' : 'DRY-RUN'}\n`)

let ok = 0, chuaCoTK = 0, boQua = 0, loi = 0
for (const h of hs) {
  const uid = uidOf.get(h.id)
  if (!uid) { console.log(`  ⃠  ${h.ma_hs} ${h.ho_ten} — CHƯA CÓ TÀI KHOẢN (chạy provision_hs_auth.mjs trước)`); chuaCoTK++; continue }

  const { data: u, error: e3 } = await admin.auth.admin.getUserById(uid)
  if (e3 || !u?.user) { console.log(`  ✖  ${h.ma_hs} — đọc auth lỗi: ${e3?.message ?? 'không thấy user'}`); loi++; continue }
  const meta = u.user.user_metadata ?? {}
  const dangCo = meta.must_change_password === true
  // Đã tự đổi mật khẩu rồi (cờ false do chính HS đặt) ⇒ không bắt đổi lần nữa.
  const daDoi = meta.must_change_password === false

  if (!BO && dangCo) { boQua++; continue }
  if (!BO && daDoi) { console.log(`  ·  ${h.ma_hs} ${h.ho_ten} — đã tự đổi mật khẩu, bỏ qua`); boQua++; continue }
  if (BO && !dangCo) { boQua++; continue }

  if (!WRITE) { console.log(`  →  ${h.ma_hs} ${h.ho_ten} (khối ${h.khoi})`); ok++; continue }
  const { error: e4 } = await admin.auth.admin.updateUserById(uid, {
    user_metadata: { ...meta, must_change_password: !BO },
  })
  if (e4) { console.log(`  ✖  ${h.ma_hs} — ${e4.message}`); loi++; continue }
  console.log(`  ✔  ${h.ma_hs} ${h.ho_ten} (khối ${h.khoi})`); ok++
}

console.log(`\n${WRITE ? 'Đã ghi' : 'Sẽ ghi'}: ${ok} · bỏ qua: ${boQua} · chưa có TK: ${chuaCoTK} · lỗi: ${loi}`)
if (!WRITE && ok > 0) console.log('Chạy lại kèm --write để áp thật.')
if (chuaCoTK > 0) console.log(`⚠ ${chuaCoTK} HS chưa có tài khoản — chạy: node scripts/provision_hs_auth.mjs`)
