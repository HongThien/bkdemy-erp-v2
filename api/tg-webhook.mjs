// ============================================================================
// SERVERLESS (Vercel) — WEBHOOK bot Telegram TA (spec-bot-telegram-ta.md §3.2, bước B2).
// Telegram POST mỗi update tới đây. File này CHỈ chuyển nguyên update + header secret cho fn_tg_nhan (DB tự so
// secret, ghi tin, xử lý /start <mã>), rồi gửi câu trả lời nếu DB trả về. Mọi luật nằm ở DB (§2.0).
//
// ⚠ Telegram chỉ giữ update 24h và KHÔNG gửi lại tin cũ ⇒ handler phải trả 200 nhanh và không được nuốt lỗi DB
//   im lặng: lỗi DB ⇒ trả 500 để Telegram tự gửi lại (nó thử lại trong ~24h).
//
// Biến môi trường (chỉ project app TA): TG_BOT_TOKEN (để trả lời tin riêng) + VITE_SUPABASE_URL/KEY (đã có).
// Secret webhook KHÔNG ở Vercel — nằm ở DB (he_thong_bi_mat 'tg_webhook') và Telegram; đặt bằng
// scripts/tg/dat-webhook.mjs.
// ============================================================================
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY
const TOKEN = process.env.TG_BOT_TOKEN

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('BK Trợ giảng bot')
  const secret = req.headers['x-telegram-bot-api-secret-token']
  if (!secret) return res.status(401).end()
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Thiếu VITE_SUPABASE_URL/KEY' })
  const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

  const sb = createClient(SB_URL, SB_ANON)
  const { data, error } = await sb.rpc('fn_tg_nhan', { p_secret: String(secret), p_update: update })
  if (error) {
    if (/sai secret/.test(error.message)) return res.status(401).end()
    return res.status(500).json({ error: error.message })   // Telegram sẽ gửi lại
  }
  if (data && TOKEN) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data),
    }).catch(() => {})
  }
  return res.status(200).json({ ok: true })
}
