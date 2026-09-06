// ============================================================================
// SERVERLESS FUNCTION (Vercel) — CRON 23:30 VN hàng tối: push TIN CHUNG tới MỌI máy đã đăng ký
// của nhân sự đang làm cho app TRỢ GIẢNG (ta). CEO 06/09: "TA cũng cần push để không miss việc,
// giống app pt" — khuôn Y HỆT api/pt-nhac-viec.mjs (đọc kỹ file đó trước, chỉ khác giờ/app/nội dung).
// ----------------------------------------------------------------------------
// Web Push không có broadcast: mỗi máy 1 địa chỉ, server lặp gửi từng máy. File này CHỈ: hỏi DB
// danh sách địa chỉ CỦA APP TA (fn_pt_push_danh_sach(secret, 'ta') — mig 202609061913 thêm cột
// `app` vào push_dang_ky để 2 app không gửi nhầm/gửi trùng địa chỉ của nhau) → gửi cùng 1 payload
// → ghi kết quả về DB.
//
// Lịch: vercel.json `crons` → 16:30 UTC = 23:30 VN. Vercel tự gọi GET kèm header
// `Authorization: Bearer <CRON_SECRET>` khi project có env CRON_SECRET.
//
// ⚠ vercel.json là của CẢ repo ⇒ MỌI Vercel project (erp/hs/ops/ta/gv/chi/pt) đều nhận CẢ 2
// lịch cron (pt lẫn ta). Chỉ project ta có PUSH_VAPID_PRIVATE riêng của NÓ ⇒ dự án khác vào
// đây là 204 rồi thoát ngay, không gửi trùng. Khoá VAPID của ta PHẢI KHÁC khoá của pt — Web
// Push gắn chết 1 subscription với ĐÚNG cặp khoá lúc subscribe, gửi sai khoá bị push service
// từ chối.
//
// Cần khai trên Vercel project ta (Project Settings → Environment Variables):
//   CRON_SECRET             = select gia_tri from he_thong_bi_mat where khoa='push_cron'
//                             (CÙNG giá trị với project pt — chỉ là secret gọi RPC nội bộ,
//                             không phải khoá VAPID, dùng chung vô hại)
//   PUSH_VAPID_PRIVATE      = khoá riêng VAPID CỦA TA (sinh lần nữa: npx web-push generate-vapid-keys
//                             — KHÔNG dùng lại cặp khoá của pt)
//   VITE_PUSH_VAPID_PUBLIC  = khoá công khai VAPID CỦA TA (cùng cặp; bundle browser cũng đọc biến này)
//   PUSH_VAPID_SUBJECT      = mailto:... (tuỳ chọn, mặc định mailto:admin@bkacademy.edu.vn)
//   VITE_SUPABASE_URL / VITE_SUPABASE_KEY (anon — đã có sẵn như mọi project)
//
// Test tay (không đợi 23:30): curl -H "Authorization: Bearer <CRON_SECRET>" https://ta.bkacademy.edu.vn/api/ta-nhac-viec
// ============================================================================
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY
const CRON_SECRET = process.env.CRON_SECRET
const VAPID_PRIVATE = process.env.PUSH_VAPID_PRIVATE
const VAPID_PUBLIC = process.env.VITE_PUSH_VAPID_PUBLIC
const VAPID_SUBJECT = process.env.PUSH_VAPID_SUBJECT || 'mailto:admin@bkacademy.edu.vn'
// Nội dung noti — CEO 06/09 chốt tin chung, khuôn giọng như app pt. Muốn đổi câu: sửa đúng 1 chỗ này.
const NOI_DUNG = {
  title: 'BK Trợ giảng',
  body: 'Nhớ kiểm tra & chấm hết ET/BTVN/bài trên lớp hôm nay nha các tình yêu 💜',
  url: '/',
  tag: 'ta-nhac-viec',   // cùng tag → noti hôm sau thay noti hôm trước, không chồng chất
}

export default async function handler(req, res) {
  // Project khác cùng repo (không có khoá riêng của ta) → không phải việc của mình.
  if (!VAPID_PRIVATE || !VAPID_PUBLIC) return res.status(204).end()
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL/VITE_SUPABASE_KEY.' })
  if (!CRON_SECRET) return res.status(500).json({ error: 'Thiếu CRON_SECRET trên Vercel.' })
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) return res.status(401).json({ error: 'Sai secret.' })

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
  const sb = createClient(SB_URL, SB_ANON)

  const { data: ds, error } = await sb.rpc('fn_pt_push_danh_sach', { p_secret: CRON_SECRET, p_app: 'ta' })
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
