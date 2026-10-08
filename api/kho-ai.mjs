// ============================================================================
// SERVERLESS FUNCTION (Vercel) — CỬA GỌI AI CHO MÀN KHO (Gemini · DeepSeek · Claude).
//
// VÌ SAO (Thùy 08/10): trước đây `src/lib/kho/api.ts` gọi thẳng 3 nhà từ TRÌNH DUYỆT bằng key
// `VITE_GEMINI_KEY` / `VITE_DEEPSEEK_KEY` / `VITE_ANTHROPIC_API_KEY` ⇒ Vite nhúng nguyên key vào
// file JS, ai mở web bấm F12 là đọc được (đo thật: dist/ có nguyên key sk-ant-… 108 ký tự).
// Giờ key CHỈ nằm ở server (env Vercel, KHÔNG tiền tố VITE_); trình duyệt chỉ gửi prompt + file.
//
// Đây là PROXY MỎNG: nhận đúng body mà client trước kia tự gửi cho nhà AI, gắn key, chuyển đi,
// trả NGUYÊN response (status + JSON) về. Mọi logic parse / đếm tiền / retry RECITATION vẫn ở
// client như cũ — đổi đường đi, không đổi hành vi.
//
// Cần khai trên Vercel (Project Settings → Environment Variables), KHÔNG tiền tố VITE_:
//   GEMINI_API_KEY · DEEPSEEK_API_KEY (đã có sẵn — dùng chung với trợ lý) · ANTHROPIC_API_KEY
//
// Xác thực: client gửi `Authorization: Bearer <access_token>`; quyền = RPC co_quyen_ghi chạy
// BẰNG token đó, đủ 1 trong các chức năng học thuật dưới (admin hệ thống tự qua). Không đăng
// nhập / không quyền ⇒ chặn — để cửa này không thành chỗ người ngoài mượn gọi AI miễn phí.
//
// ⚠ Vercel giới hạn BODY request ~4,5MB. File gửi kèm (ảnh/PDF base64) lớn hơn thì client
//   báo lỗi trước khi gửi (xem KHO_AI_BODY_MAX ở src/lib/kho/api.ts) — tách file / từng trang.
// ⚠ `npm run dev` (Vite) KHÔNG phục vụ /api — dev cục bộ trỏ VITE_KHO_AI_URL về bản deploy
//   (xem src/lib/kho/api.ts), hoặc chạy `vercel dev`.
// ============================================================================
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY // anon/publishable — công khai, không phải secret
const KEY = {
  gemini: process.env.GEMINI_API_KEY,
  deepseek: process.env.DEEPSEEK_API_KEY,
  claude: process.env.ANTHROPIC_API_KEY,
}
const TEN_BIEN = { gemini: 'GEMINI_API_KEY', deepseek: 'DEEPSEEK_API_KEY', claude: 'ANTHROPIC_API_KEY' }
// Model hợp lệ theo từng nhà — chặn dùng cửa này gọi model lạ/đắt ngoài danh sách.
const MODEL_OK = {
  gemini: /^gemini-[a-z0-9.\-]+$/,
  deepseek: /^deepseek-(chat|reasoner)$/,
  claude: /^claude-[a-z0-9.\-]+$/,
}
// Chức năng học thuật được dùng AI Kho (fixtures.ts: bdkt = Bản đồ kiến thức · nhapkho · lamtailieu).
const CHUC_NANG = ['bdkt', 'nhapkho', 'lamtailieu']

async function duocDung(token) {
  const asUser = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { autoRefreshToken: false, persistSession: false } })
  for (const cn of CHUC_NANG) {
    const { data, error } = await asUser.rpc('co_quyen_ghi', { p_chuc_nang: cn })
    if (error) return { ok: false, loi: `Không xác thực được: ${error.message}`, ma: 401 }
    if (data === true) return { ok: true }
  }
  return { ok: false, loi: 'Bạn không có quyền dùng AI của Kho (cần quyền ghi Bản đồ kiến thức / Nhập kho / Làm tài liệu).', ma: 403 }
}

async function chuyen(nha, model, body) {
  const key = KEY[nha]
  if (nha === 'gemini') {
    return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body),
    })
  }
  if (nha === 'deepseek') {
    return fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` }, body: JSON.stringify({ ...body, model }),
    })
  }
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ ...body, model }),
  })
}

export default async function handler(req, res) {
  // Dev cục bộ (Vite ở localhost) gọi sang bản deploy qua VITE_KHO_AI_URL ⇒ cần CORS cho đúng localhost.
  // Bản deploy gọi cùng tên miền nên không cần. Không mở cho tên miền lạ.
  const origin = req.headers.origin
  if (origin && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    if (req.method === 'OPTIONS') return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ POST.' })
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Server thiếu VITE_SUPABASE_URL / VITE_SUPABASE_KEY.' })

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập — mở lại trang rồi thử lại.' })

  const { nha, model, body } = req.body ?? {}
  if (!(nha in KEY)) return res.status(400).json({ error: `nha không hợp lệ: ${nha}` })
  if (typeof model !== 'string' || !MODEL_OK[nha].test(model)) return res.status(400).json({ error: `model không hợp lệ cho ${nha}: ${model}` })
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Thiếu body.' })
  if (!KEY[nha]) return res.status(501).json({ error: `Server chưa có ${TEN_BIEN[nha]} trên Vercel.` })

  const q = await duocDung(token)
  if (!q.ok) return res.status(q.ma).json({ error: q.loi })

  try {
    const r = await chuyen(nha, model, body)
    const text = await r.text()
    res.status(r.status).setHeader('content-type', r.headers.get('content-type') || 'application/json')
    return res.send(text)
  } catch (e) {
    return res.status(502).json({ error: `Không gọi được ${nha}: ${e?.message ?? String(e)}` })
  }
}
