// ============================================================================
// SERVERLESS FUNCTION (Vercel) — NHÂN SỰ đặt lại mật khẩu app cho 1 HS (Thùy 06/10).
// Nằm cạnh api/provision-hs-auth.mjs (nơi tạo tài khoản). Cùng chính sách
// scripts/hs_reset_mk.mjs: mật khẩu = chính mã HS; khối 10/11/12 bị buộc đổi ở lần
// đăng nhập kế (user_metadata.must_change_password). Cần SUPABASE_SERVICE_ROLE trên
// Vercel project phục vụ ERP (cùng biến với cron provision) — KHÔNG tiền tố VITE_.
//
// Xác thực: client gửi `Authorization: Bearer <access_token của nhân sự đang đăng nhập>`;
// quyền = RPC co_quyen_ghi('hs') chạy BẰNG token đó (RLS/hàm DB quyết, không tin client).
// Body: { hoc_sinh_id: uuid }.  Không trả mật khẩu — luôn là mã HS.
// ============================================================================
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
const CAP_3 = ['10', '11', '12']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ POST.' })
  if (!SERVICE_ROLE) return res.status(501).json({ error: 'Project này chưa có SUPABASE_SERVICE_ROLE — mở ERP ở project có biến đó.' })
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL / VITE_SUPABASE_KEY.' })

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập.' })
  const hocSinhId = req.body?.hoc_sinh_id
  if (typeof hocSinhId !== 'string' || !/^[0-9a-f-]{36}$/i.test(hocSinhId)) return res.status(400).json({ error: 'hoc_sinh_id không hợp lệ.' })

  // Quyền: gọi RPC bằng chính phiên của người bấm.
  const asUser = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { autoRefreshToken: false, persistSession: false } })
  const { data: duoc, error: eQ } = await asUser.rpc('co_quyen_ghi', { p_chuc_nang: 'hs' })
  if (eQ) return res.status(401).json({ error: `Không xác thực được: ${eQ.message}` })
  if (duoc !== true) return res.status(403).json({ error: 'Bạn không có quyền ghi mục Học sinh.' })

  const admin = createClient(SB_URL, SERVICE_ROLE, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: hs, error: eH } = await admin.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi').eq('id', hocSinhId).maybeSingle()
  if (eH) return res.status(500).json({ error: `đọc hoc_sinh: ${eH.message}` })
  if (!hs || !hs.ma_hs) return res.status(404).json({ error: 'Không thấy HS hoặc HS chưa có mã.' })

  const { data: tk, error: eT } = await admin.from('tai_khoan').select('id').eq('hoc_sinh_id', hs.id).limit(1)
  if (eT) return res.status(500).json({ error: `đọc tai_khoan: ${eT.message}` })
  if (!tk?.length) return res.status(404).json({ error: 'HS này chưa có tài khoản — bấm "Tạo tài khoản HS mới" trước.' })

  const uid = tk[0].id
  const { data: u, error: eU } = await admin.auth.admin.getUserById(uid)
  if (eU || !u?.user) return res.status(500).json({ error: `đọc Auth: ${eU?.message ?? 'không thấy user'}` })
  const buocDoi = CAP_3.includes(String(hs.khoi))
  const { error: eP } = await admin.auth.admin.updateUserById(uid, {
    password: hs.ma_hs,
    user_metadata: { ...(u.user.user_metadata ?? {}), must_change_password: buocDoi },
  })
  if (eP) return res.status(500).json({ error: `đặt lại mật khẩu: ${eP.message}` })
  return res.status(200).json({ ok: true, ma_hs: hs.ma_hs, buocDoi })
}
