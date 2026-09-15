// ============================================================================
// SERVERLESS FUNCTION (Vercel) — REALTIME, KHÔNG theo lịch cron. Gọi bởi TRIGGER Postgres
// (net.http_post, xem migration 202609101152_push_realtime_badge.sql) NGAY lúc việc của 1
// người thật sự đổi (giao việc mới, đóng khâu chấm, buổi mới, retest mới...). CEO 10/09:
// "1 lần 1 ngày thì đâu tác dụng gì" — file *-nhac-viec.mjs vẫn còn (nhắc theo giờ cố định,
// mục đích khác: nhắc "nhớ làm", không phải cập nhật số). File này chỉ lo ĐÚNG 1 NGƯỜI, 1 lần.
// ----------------------------------------------------------------------------
// Bảo mật: KHÔNG check CRON_SECRET như *-nhac-viec.mjs (cái đó xác thực Vercel Cron gọi
// đúng giờ). Ở đây khách gọi là chính DB (qua pg_net) — `secret` trong body được hàm
// _push_bao_cap_nhat lấy từ he_thong_bi_mat.push_cron rồi CHÍNH RPC fn_*_push_dem_1 xác
// thực lại (raise exception nếu sai) — request không có secret đúng thì RPC lỗi, không có
// gì được gửi. Không cần lớp check Vercel riêng, không cần env mới.
//
// Cần khai trên Vercel project pt VÀ ta (đã có sẵn từ *-nhac-viec.mjs, không cần thêm):
//   PUSH_VAPID_PRIVATE / VITE_PUSH_VAPID_PUBLIC / PUSH_VAPID_SUBJECT (đúng khoá của TỪNG app)
//   VITE_SUPABASE_URL / VITE_SUPABASE_KEY
//
// Test tay: curl -X POST https://pt.bkacademy.edu.vn/api/push-cap-nhat \
//   -H "Content-Type: application/json" \
//   -d '{"secret":"<push_cron thật>","nhan_su_id":"<uuid>","app":"pt"}'
// ============================================================================
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY
const VAPID_PRIVATE = process.env.PUSH_VAPID_PRIVATE
const VAPID_PUBLIC = process.env.VITE_PUSH_VAPID_PUBLIC
const VAPID_SUBJECT = process.env.PUSH_VAPID_SUBJECT || 'mailto:admin@bkacademy.edu.vn'

export default async function handler(req, res) {
  // Project khác cùng repo (không có khoá riêng) → không phải việc của mình (khuôn *-nhac-viec.mjs).
  if (!VAPID_PRIVATE || !VAPID_PUBLIC) return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL/VITE_SUPABASE_KEY.' })

  const { secret, nhan_su_id, app } = req.body || {}
  if (!secret || !nhan_su_id || (app !== 'pt' && app !== 'ta')) return res.status(400).json({ error: 'thieu secret/nhan_su_id/app' })

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
  const sb = createClient(SB_URL, SB_ANON)

  const demFn = app === 'pt' ? 'fn_pt_push_dem_1' : 'fn_ta_push_dem_1'
  const { data: count, error: eDem } = await sb.rpc(demFn, { p_secret: secret, p_ns: nhan_su_id })
  if (eDem) return res.status(401).json({ error: `sai secret hoặc lỗi đếm: ${eDem.message}` })

  const { data: ds, error } = await sb.rpc('fn_pt_push_danh_sach', { p_secret: secret, p_app: app })
  if (error) return res.status(500).json({ error: `DB: ${error.message}` })
  const devices = (ds ?? []).filter((d) => d.nhan_su_id === nhan_su_id)
  if (!devices.length) return res.status(200).json({ ok: true, count, may: 0 })

  const payload = JSON.stringify({
    title: app === 'pt' ? 'BK Phát triển' : 'BK Trợ giảng',
    body: count > 0 ? `Có ${count} việc đang chờ bạn` : 'Đã xong hết việc, ngon rồi! 🎉',
    url: '/',
    tag: `${app}-cap-nhat`,   // tag RIÊNG với tin nhắc hàng ngày (pt-nhac-viec/ta-nhac-viec) — không thay thế nhau
    count,
  })

  const ketQua = []   // [{id, ok, ma}] — ghi vết từng thiết bị, ĐÚNG khuôn *-nhac-viec.mjs
  let guiOk = 0, guiLoi = 0
  for (const d of devices) {
    try {
      await webpush.sendNotification({ endpoint: d.endpoint, keys: { p256dh: d.p256dh, auth: d.auth } }, payload, { TTL: 3600, urgency: 'normal' })
      ketQua.push({ id: d.id, ok: true, ma: null }); guiOk++
    } catch (e) {
      ketQua.push({ id: d.id, ok: false, ma: e?.statusCode ?? null }); guiLoi++
    }
  }
  if (ketQua.length) await sb.rpc('fn_pt_push_ghi_ket_qua', { p_secret: secret, p_ket_qua: ketQua })
  return res.status(200).json({ ok: true, count, may: ketQua.length, guiOk, guiLoi })
}
