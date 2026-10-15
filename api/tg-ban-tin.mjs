// ============================================================================
// SERVERLESS (Vercel) — CRON 08:00 VN: bản tin việc tồn của TA lên nhóm Telegram (spec-bot-telegram-ta.md §3.1, B3).
// Lịch: vercel.json "0 1 * * *" (01:00 UTC). Chỉ project app TA có TG_BOT_TOKEN ⇒ project khác 204 rồi thoát.
// Chỉ đăng vào nhóm tg_nhom.vai='ta_chung' AND ban_tin_bat = true; chạy lại không đăng trùng (tg_ban_tin).
// Test tay: curl -H "Authorization: Bearer <CRON_SECRET>" https://ta.bkacademy.edu.vn/api/tg-ban-tin
// ============================================================================
import { createClient } from '@supabase/supabase-js'
import { dangBanTin } from './_tg_lib.mjs'

export const config = { maxDuration: 300 }

const TOKEN = process.env.TG_BOT_TOKEN
const CRON_SECRET = process.env.CRON_SECRET

export default async function handler(req, res) {
  if (!TOKEN) return res.status(204).end()
  if (!CRON_SECRET) return res.status(500).json({ error: 'Thiếu CRON_SECRET' })
  if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) return res.status(401).json({ error: 'Sai secret' })
  const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY)
  const rpc = async (fn, args) => { const { data, error } = await sb.rpc(fn, args); if (error) throw new Error(`${fn}: ${error.message}`); return data }
  const tg = async (method, body) => {
    const r = await (await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).json()
    if (!r.ok) throw new Error(`Telegram ${method}: ${r.description}`)
    return r.result
  }
  try { return res.status(200).json(await dangBanTin({ rpc, tg, secret: CRON_SECRET })) }
  catch (e) { return res.status(500).json({ error: String(e?.message ?? e) }) }
}
