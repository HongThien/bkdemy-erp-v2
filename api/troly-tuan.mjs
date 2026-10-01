// ============================================================================
// SERVERLESS FUNCTION (Vercel) — CRON 07:00 VN sáng THỨ HAI: tự tính TỔNG KẾT TUẦN của tuần vừa
// rồi, lưu vào DB, rồi báo cho ĐÚNG những người được dùng trợ lý (CEO 29/09: "tự tính sáng thứ
// Hai và gửi thông báo cho ba người").
// ----------------------------------------------------------------------------
// File này KHÔNG tính gì. Nó chỉ: gọi `fn_troly_tuan_tu_dong` (tính + lưu ở Postgres, trả câu tóm
// tắt + danh sách máy nhận) → gửi Web Push → ghi kết quả gửi về DB. Khuôn Y HỆT
// api/pt-nhac-viec.mjs — đọc file đó trước.
//
// Lịch: vercel.json `crons` → `0 0 * * 1` = 00:00 UTC thứ Hai = 07:00 VN.
//
// ⚠ vercel.json là của CẢ repo ⇒ MỌI Vercel project đều nhận lịch này. Để chỉ MỘT project chạy
// (tránh tính 2 lần, gửi 2 lần), route chỉ làm việc ở project có khai `TROLY_PUSH_APP`.
// Máy nhận thông báo là máy đã đăng ký nhận tin của app đó (bảng push_dang_ky, cột app), nên
// khoá VAPID dùng để gửi phải là khoá của CHÍNH app đó — vì thế route chạy ngay trên project ấy.
//
// Cần khai trên Vercel project pt (Project Settings → Environment Variables):
//   TROLY_PUSH_APP  = pt            ← khai thêm; các biến dưới đã có sẵn cho pt-nhac-viec
//   TROLY_ERP_URL   = (tuỳ chọn) địa chỉ ERP để bấm thông báo là mở thẳng; bỏ trống = mở app pt
//   CRON_SECRET · PUSH_VAPID_PRIVATE · VITE_PUSH_VAPID_PUBLIC · VITE_SUPABASE_URL · VITE_SUPABASE_KEY
//
// Ai chưa đăng ký nhận tin ở app đó thì KHÔNG nhận được thông báo (tổng kết vẫn được tính và lưu,
// mở ERP là thấy). Kết quả trả về nêu tên những người đó ở `chua_dang_ky_nhan`.
//
// Test tay: curl -H "Authorization: Bearer <CRON_SECRET>" https://pt.bkacademy.edu.vn/api/troly-tuan
// ============================================================================
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY
const CRON_SECRET = process.env.CRON_SECRET
const VAPID_PRIVATE = process.env.PUSH_VAPID_PRIVATE
const VAPID_PUBLIC = process.env.VITE_PUSH_VAPID_PUBLIC
const VAPID_SUBJECT = process.env.PUSH_VAPID_SUBJECT || 'mailto:admin@bkacademy.edu.vn'
const APP = process.env.TROLY_PUSH_APP
const ERP_URL = process.env.TROLY_ERP_URL || '/'

export default async function handler(req, res) {
  // Project không được giao việc này → thoát ngay, không tính, không gửi.
  if (!APP || !VAPID_PRIVATE || !VAPID_PUBLIC) return res.status(204).end()
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL/VITE_SUPABASE_KEY.' })
  if (!CRON_SECRET) return res.status(500).json({ error: 'Thiếu CRON_SECRET trên Vercel.' })
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) return res.status(401).json({ error: 'Sai secret.' })

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
  const sb = createClient(SB_URL, SB_ANON)

  const { data: d, error } = await sb.rpc('fn_troly_tuan_tu_dong', { p_secret: CRON_SECRET, p_app: APP })
  if (error) return res.status(500).json({ error: `DB: ${error.message}` })

  const payload = JSON.stringify({ title: d.tieu_de, body: d.noi_dung, url: ERP_URL, tag: 'troly-tuan', count: d.so_van_de ?? 0 })
  const ketQua = []   // [{id, ok, ma}] — ghi vết từng thiết bị
  let guiOk = 0, guiLoi = 0
  for (const m of d.nguoi_nhan ?? []) {
    try {
      await webpush.sendNotification({ endpoint: m.endpoint, keys: { p256dh: m.p256dh, auth: m.auth } }, payload, { TTL: 24 * 3600, urgency: 'normal' })
      ketQua.push({ id: m.id, ok: true, ma: null }); guiOk++
    } catch (e) {
      // 404/410 = endpoint chết (người dùng gỡ app / đổi máy) → DB đánh dấu, lần sau bỏ qua.
      ketQua.push({ id: m.id, ok: false, ma: e?.statusCode ?? null }); guiLoi++
    }
  }
  if (ketQua.length) {
    const { error: e2 } = await sb.rpc('fn_pt_push_ghi_ket_qua', { p_secret: CRON_SECRET, p_ket_qua: ketQua })
    if (e2) return res.status(500).json({ error: `Ghi kết quả: ${e2.message}`, may: ketQua.length, guiOk, guiLoi })
  }
  return res.status(200).json({
    tuan: `${d.tu} → ${d.den}`, tom_tat: d.noi_dung,
    may: ketQua.length, guiOk, guiLoi, chua_dang_ky_nhan: d.chua_dang_ky_nhan ?? [],
  })
}
