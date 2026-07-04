// ============================================================================
// provision_hs_auth.mjs — Tạo tài khoản Supabase Auth cho HỌC SINH (chạy 1 lần/lô).
// ----------------------------------------------------------------------------
// HS đăng nhập bằng mã HS + PIN; dưới nền = Supabase Auth THẬT với email tổng hợp
// <ma_hs>@hs.bkdemy.local, password = PIN → auth.uid() thật → RLS chạy.
// tai_khoan.hoc_sinh_id link auth.uid ↔ hoc_sinh (mig 0063).
//
// ⚠ CẦN SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API → service_role).
//   claude_build KHÔNG đụng schema auth → phải qua admin API này.
//   Bỏ vào .env.local dòng: SUPABASE_SERVICE_ROLE=eyJ...  (KHÔNG commit)
//
// Dùng:  node scripts/provision_hs_auth.mjs            # tất cả HS đang học chưa có TK
//        node scripts/provision_hs_auth.mjs HS0001 HS0002   # chỉ vài mã (test)
// PIN mặc định = 6 số cuối của id? KHÔNG — dùng PIN = ma_hs (đơn giản, đổi sau).
// ============================================================================
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const url = env.VITE_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE
if (!serviceKey) { console.error('❌ Thiếu SUPABASE_SERVICE_ROLE (Dashboard → Settings → API). Thêm vào .env.local.'); process.exit(1) }

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
const DOMAIN = 'hs.bkdemy.local'
const only = process.argv.slice(2) // mã HS cụ thể (test), rỗng = tất cả

// 1) HS đang học
let q = admin.from('hoc_sinh').select('id, ma_hs, ho_ten').eq('trang_thai', 'dang_hoc')
if (only.length) q = q.in('ma_hs', only)
const { data: hs, error } = await q.limit(2000)
if (error) { console.error('❌ đọc hoc_sinh', error.message); process.exit(1) }

// 2) TK đã có (bỏ qua)
const { data: existing } = await admin.from('tai_khoan').select('hoc_sinh_id').not('hoc_sinh_id', 'is', null).limit(2000)
const done = new Set((existing ?? []).map((r) => r.hoc_sinh_id))

let ok = 0, skip = 0, fail = 0
for (const h of hs ?? []) {
  if (done.has(h.id)) { skip++; continue }
  const email = `${h.ma_hs.toLowerCase()}@${DOMAIN}`
  const password = h.ma_hs // PIN = mã HS (test); production nên random + phát riêng
  const { data: created, error: e1 } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { ho_ten: h.ho_ten, ma_hs: h.ma_hs, role: 'hoc_sinh' },
  })
  if (e1) {
    // đã tồn tại auth user? tìm lại để link tai_khoan
    if (/already/i.test(e1.message)) { console.log('~ auth đã có', email, '→ cần link tay nếu thiếu tai_khoan'); skip++ }
    else { console.error('❌', email, e1.message); fail++ }
    continue
  }
  const uid = created.user.id
  const { error: e2 } = await admin.from('tai_khoan').upsert({ id: uid, hoc_sinh_id: h.id, email }, { onConflict: 'id' })
  if (e2) { console.error('❌ tai_khoan', email, e2.message); fail++; continue }
  ok++
  if (ok % 25 === 0) console.log(`... ${ok} tạo`)
}
console.log(`\nXong: ${ok} tạo · ${skip} bỏ qua (đã có) · ${fail} lỗi. Domain=@${DOMAIN}, PIN=mã HS.`)
