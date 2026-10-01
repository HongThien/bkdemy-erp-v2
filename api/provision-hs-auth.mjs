// ============================================================================
// SERVERLESS FUNCTION (Vercel) — CRON hàng ngày: tự tạo tài khoản app cho HS mới
// ghi danh, thay vì phải nhớ chạy tay `scripts/provision_hs_auth.mjs` (CEO 15/09:
// "hệ thống có tự cập nhật ko, t đang thấy là ko" — đúng, không tự động, 17 HS
// từ 18/08 tới 15/09 không có tài khoản vì không ai chạy script). Khuôn giống
// api/ta-nhac-viec.mjs (đọc file đó trước) — chỉ khác: cần SUPABASE_SERVICE_ROLE
// (Admin API tạo Auth user thật) thay vì anon key + RPC, vì claude_build/anon
// không đụng được schema auth (CLAUDE.md §2.1).
// ----------------------------------------------------------------------------
// HS đăng nhập bằng mã HS + PIN; dưới nền = Supabase Auth thật, email tổng hợp
// <ma_hs>@hs.bkdemy.local, password = chính mã HS (giữ NGUYÊN quy ước cũ của
// scripts/provision_hs_auth.mjs — đổi PIN là quyết định riêng, không đụng ở đây).
//
// ⚠ vercel.json là của CẢ repo ⇒ MỌI Vercel project (erp/hs/ops/ta/gv/chi/pt) đều
// nhận lịch cron này. CHỈ project nào có SUPABASE_SERVICE_ROLE mới thật sự chạy —
// project khác vào đây là 204 rồi thoát ngay (không đụng DB). Khuyến nghị đặt biến
// này ở ĐÚNG 1 project (vd bkdemy-erp-v2 — project ops/admin), TUYỆT ĐỐI không đặt
// tên biến có tiền tố VITE_ (sẽ lọt vào bundle client) — đây là service_role, bypass
// MỌI RLS của cả DB.
//
// Cần khai trên Vercel project được chọn (Project Settings → Environment Variables):
//   SUPABASE_SERVICE_ROLE   = Dashboard Supabase → Settings → API → service_role
//   CRON_SECRET             = CÙNG giá trị đã dùng cho pt/ta-nhac-viec (chỉ để Vercel
//                             tự xác thực gọi đúng cron, không phải khoá DB)
//   VITE_SUPABASE_URL       = đã có sẵn như mọi project
//
// Test tay (không đợi cron): curl -H "Authorization: Bearer <CRON_SECRET>" https://<project>.vercel.app/api/provision-hs-auth
// ============================================================================
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
const CRON_SECRET = process.env.CRON_SECRET
const DOMAIN = 'hs.bkdemy.local'

export default async function handler(req, res) {
  // Project khác cùng repo (không có service_role riêng cho việc này) → không phải việc của mình.
  if (!SERVICE_ROLE) return res.status(204).end()
  if (!SB_URL) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL.' })
  if (!CRON_SECRET) return res.status(500).json({ error: 'Thiếu CRON_SECRET trên Vercel.' })
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) return res.status(401).json({ error: 'Sai secret.' })

  const admin = createClient(SB_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } })

  const { data: hs, error } = await admin.from('hoc_sinh').select('id, ma_hs, ho_ten').eq('trang_thai', 'dang_hoc').limit(2000)
  if (error) return res.status(500).json({ error: `đọc hoc_sinh: ${error.message}` })

  const { data: existing, error: eEx } = await admin.from('tai_khoan').select('hoc_sinh_id').not('hoc_sinh_id', 'is', null).limit(2000)
  if (eEx) return res.status(500).json({ error: `đọc tai_khoan: ${eEx.message}` })
  const done = new Set((existing ?? []).map((r) => r.hoc_sinh_id))

  let ok = 0, skip = 0, fail = 0
  const loi = []
  for (const h of hs ?? []) {
    if (!h.ma_hs || done.has(h.id)) { skip++; continue }
    const email = `${h.ma_hs.toLowerCase()}@${DOMAIN}`
    const password = h.ma_hs
    const { data: created, error: e1 } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { ho_ten: h.ho_ten, ma_hs: h.ma_hs, role: 'hoc_sinh' },
    })
    if (e1) {
      if (/already/i.test(e1.message)) skip++ // auth đã có nhưng tai_khoan thiếu → cần link tay, không tự đoán uid
      else { fail++; loi.push({ ma_hs: h.ma_hs, loi: e1.message }) }
      continue
    }
    const { error: e2 } = await admin.from('tai_khoan').upsert({ id: created.user.id, hoc_sinh_id: h.id, email }, { onConflict: 'id' })
    if (e2) { fail++; loi.push({ ma_hs: h.ma_hs, loi: e2.message }); continue }
    ok++
  }
  return res.status(200).json({ tao: ok, boQua: skip, loi: fail, chiTietLoi: loi })
}
