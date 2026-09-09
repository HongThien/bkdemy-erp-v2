// ============================================================================
// SERVERLESS FUNCTION (Vercel) — CRON 10:30 VN hàng ngày: push TIN CHUNG tới MỌI máy đã đăng ký
// của nhân sự đang làm (app PHÁT TRIỂN, CEO chốt 05/09: "tin chung cho tất cả", không cá nhân hoá).
// ----------------------------------------------------------------------------
// Web Push không có broadcast: mỗi máy 1 địa chỉ, server lặp gửi từng máy. File này CHỈ: hỏi DB
// danh sách địa chỉ (fn_pt_push_danh_sach) → gửi cùng 1 payload → ghi kết quả về DB.
//
// Lịch: vercel.json `crons` → 03:30 UTC = 10:30 VN. Vercel tự gọi GET kèm header
// `Authorization: Bearer <CRON_SECRET>` khi project có env CRON_SECRET. Ta dùng CÙNG giá trị đó
// làm secret gọi RPC (he_thong_bi_mat.push_cron) — 1 secret, 2 lớp khoá, KHÔNG service-role
// (CEO 19/08: key đó bỏ qua mọi RLS, không đặt lên Vercel).
//
// ⚠ vercel.json là của CẢ repo ⇒ MỌI Vercel project (erp/hs/ops/ta/gv/chi/pt) đều nhận lịch cron
// này. Chỉ project pt có PUSH_VAPID_PRIVATE ⇒ các project khác vào đây là 204 rồi thoát ngay,
// không gửi trùng.
//
// Cần khai trên Vercel project pt (Project Settings → Environment Variables):
//   CRON_SECRET             = select gia_tri from he_thong_bi_mat where khoa='push_cron'
//   PUSH_VAPID_PRIVATE      = khoá riêng VAPID (sinh 1 lần: npx web-push generate-vapid-keys)
//   VITE_PUSH_VAPID_PUBLIC  = khoá công khai VAPID (CÙNG cặp; bundle browser cũng đọc biến này)
//   PUSH_VAPID_SUBJECT      = mailto:... (tuỳ chọn, mặc định mailto:admin@bkacademy.edu.vn)
//   VITE_SUPABASE_URL / VITE_SUPABASE_KEY (anon — đã có sẵn như mọi project)
//
// Test tay (không đợi 10:30): curl -H "Authorization: Bearer <CRON_SECRET>" https://pt.bkacademy.edu.vn/api/pt-nhac-viec
// ============================================================================
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY
const CRON_SECRET = process.env.CRON_SECRET
const VAPID_PRIVATE = process.env.PUSH_VAPID_PRIVATE
const VAPID_PUBLIC = process.env.VITE_PUSH_VAPID_PUBLIC
const VAPID_SUBJECT = process.env.PUSH_VAPID_SUBJECT || 'mailto:admin@bkacademy.edu.vn'
// Nội dung noti — CEO đặt nguyên văn 05/09. Muốn đổi câu: sửa đúng 1 chỗ này.
const NOI_DUNG = {
  title: 'BK Phát triển',
  body: 'Đến giờ cập nhật Công việc Daily rồi các tình yêu 💜',
  url: '/',
  tag: 'pt-nhac-viec',   // cùng tag → noti hôm sau thay noti hôm trước, không chồng chất
}

export default async function handler(req, res) {
  // Project khác cùng repo (không có khoá riêng) → không phải việc của mình.
  if (!VAPID_PRIVATE || !VAPID_PUBLIC) return res.status(204).end()
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL/VITE_SUPABASE_KEY.' })
  if (!CRON_SECRET) return res.status(500).json({ error: 'Thiếu CRON_SECRET trên Vercel.' })
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) return res.status(401).json({ error: 'Sai secret.' })

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
  const sb = createClient(SB_URL, SB_ANON)

  const { data: ds, error } = await sb.rpc('fn_pt_push_danh_sach', { p_secret: CRON_SECRET })
  if (error) return res.status(500).json({ error: `DB: ${error.message}` })

  const payload = JSON.stringify(NOI_DUNG)
  const ketQua = []   // [{id, ok, ma}] — ghi vết từng thiết bị
  let guiOk = 0, guiLoi = 0
  for (const d of ds ?? []) {
    try {
      await webpush.sendNotification({ endpoint: d.endpoint, keys: { p256dh: d.p256dh, auth: d.auth } }, payload, { TTL: 6 * 3600, urgency: 'normal' })
      ketQua.push({ id: d.id, ok: true, ma: null }); guiOk++
    } catch (e) {
      // 404/410 = endpoint chết (người dùng gỡ app / đổi máy) → DB đánh dấu, lần sau bỏ qua.
      ketQua.push({ id: d.id, ok: false, ma: e?.statusCode ?? null }); guiLoi++
    }
  }
  if (ketQua.length) {
    const { error: e2 } = await sb.rpc('fn_pt_push_ghi_ket_qua', { p_secret: CRON_SECRET, p_ket_qua: ketQua })
    if (e2) return res.status(500).json({ error: `Ghi kết quả: ${e2.message}`, may: ketQua.length, guiOk, guiLoi })
  }
  return res.status(200).json({ may: ketQua.length, guiOk, guiLoi })
}
