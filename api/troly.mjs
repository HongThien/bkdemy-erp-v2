// ============================================================================
// SERVERLESS FUNCTION (Vercel) — thay cho `worker/troly.mjs` (CEO 19/08: "không có worker
// là không chạy được hử?" — đúng, và worker đứng-một-mình-24/7 không hợp hạ tầng đang có).
//
// Đổi CÁCH GỌI, KHÔNG đổi RANH GIỚI: key AI vẫn CHỈ nằm ở server — trước là biến môi trường
// đọc từ .env.local của máy chạy worker, giờ là ENV VAR khai trên Vercel (Project Settings →
// Environment Variables), Vercel tiêm vào `process.env` lúc chạy function — KHÔNG BAO GIỜ vào
// bundle browser (đúng bài học "vụ 920k"). Không còn tiến trình polling nào phải bật tay/24-7 —
// function này CHỈ chạy khi có request, do CHÍNH lần deploy Vercel đang có, không thêm hạ tầng.
//
// Cần khai trên Vercel (Project Settings → Environment Variables), TÊN Y HỆT worker cũ:
//   VITE_SUPABASE_URL · SUPABASE_SERVICE_ROLE
//   ANTHROPIC_API_KEY và/hoặc MOONSHOT_API_KEY và/hoặc DEEPSEEK_API_KEY
//   TROLY_PROVIDER / TROLY_MODEL / MOONSHOT_BASE_URL / DEEPSEEK_BASE_URL (tuỳ chọn)
//
// ⚠ Test cục bộ qua `npm run dev` (Vite) KHÔNG chạy được file này — Vite dev server không phục
// vụ /api. Muốn test tay trước khi đẩy thì dùng `vercel dev` (Vercel CLI), hoặc đẩy thẳng lên
// rồi thử trên bản deploy — chưa cấu hình sẵn, hỏi lại nếu cần.
// ============================================================================
import { createClient } from '@supabase/supabase-js'
import { SYSTEM, GIOI_HAN } from '../worker/troly_prompt.mjs'
import { TROLY_TOOLS } from '../src/lib/troly-tools.mjs'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE
const KEY_ANTHROPIC = process.env.ANTHROPIC_API_KEY
const KEY_MOONSHOT = process.env.MOONSHOT_API_KEY
const KEY_DEEPSEEK = process.env.DEEPSEEK_API_KEY
const PROVIDER = process.env.TROLY_PROVIDER ?? (KEY_DEEPSEEK ? 'deepseek' : KEY_MOONSHOT ? 'moonshot' : 'anthropic')
const MOONSHOT_BASE = process.env.MOONSHOT_BASE_URL ?? 'https://api.moonshot.ai/v1'
const DEEPSEEK_BASE = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1'

// Giá USD / 1 triệu token — ⚠ TỰ KIỂM lại ở trang giá từng nhà trước khi tin (đổi liên tục).
const GIA = {
  'claude-sonnet-5': { vao: 2, ra: 10 },
  'claude-haiku-4-5': { vao: 1, ra: 5 },
  'claude-opus-4-8': { vao: 5, ra: 25 },
  'deepseek-chat': { vao: 0.27, ra: 1.10 },
  'deepseek-reasoner': { vao: 0.55, ra: 2.19 },
}
const USD_VND = 26_000
const MODEL = process.env.TROLY_MODEL ?? (PROVIDER === 'moonshot' ? 'kimi-k2-turbo-preview' : PROVIDER === 'deepseek' ? 'deepseek-chat' : 'claude-sonnet-5')

const ANTHROPIC_TOOLS = TROLY_TOOLS.map((t) => ({ name: t.name, description: t.mo_ta, input_schema: t.tham_so }))
const OPENAI_TOOLS = TROLY_TOOLS.map((t) => ({ type: 'function', function: { name: t.name, description: t.mo_ta, parameters: t.tham_so } }))

// ── ADAPTER: ba nhà, một giao diện (khuôn y hệt worker/troly.mjs cũ) ────────
async function goiOpenAICompatible({ base, key, nha, system, messages, maxTokens }) {
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL, max_tokens: maxTokens, temperature: 0.3,
      messages: [{ role: 'system', content: system }, ...messages],
      tools: OPENAI_TOOLS, tool_choice: 'auto',
    }),
  })
  const j = await res.json().catch(() => null)
  if (!res.ok) throw new Error(`${nha} từ chối: ${j?.error?.message ?? `HTTP ${res.status}`}`)
  const ch = j?.choices?.[0]
  if (ch?.finish_reason === 'length') throw new Error('Câu trả lời bị cắt giữa chừng (chạm trần token) — hỏi ngắn lại hoặc nâng trần.')
  const usage = { input_tokens: j?.usage?.prompt_tokens ?? null, output_tokens: j?.usage?.completion_tokens ?? null }
  const tc = ch?.message?.tool_calls?.[0]
  if (tc) {
    let args = {}
    try { args = JSON.parse(tc.function.arguments || '{}') } catch { /* JSON hỏng → coi như không tham số, client tự báo thiếu */ }
    return { type: 'tool', name: tc.function.name, args, usage }
  }
  return { type: 'text', text: ch?.message?.content ?? '', usage }
}

async function goiModel({ system, messages, maxTokens }) {
  if (PROVIDER === 'moonshot') {
    if (!KEY_MOONSHOT) throw new Error('Thiếu MOONSHOT_API_KEY trên Vercel.')
    return goiOpenAICompatible({ base: MOONSHOT_BASE, key: KEY_MOONSHOT, nha: 'Moonshot', system, messages, maxTokens })
  }
  if (PROVIDER === 'deepseek') {
    if (!KEY_DEEPSEEK) throw new Error('Thiếu DEEPSEEK_API_KEY trên Vercel.')
    return goiOpenAICompatible({ base: DEEPSEEK_BASE, key: KEY_DEEPSEEK, nha: 'DeepSeek', system, messages, maxTokens })
  }
  if (!KEY_ANTHROPIC) throw new Error('Thiếu ANTHROPIC_API_KEY trên Vercel.')
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const claude = new Anthropic({ apiKey: KEY_ANTHROPIC })
  const res = await claude.messages.create({ model: MODEL, max_tokens: maxTokens, system, messages, tools: ANTHROPIC_TOOLS })
  if (res.stop_reason === 'refusal') throw new Error('Model từ chối trả lời.')
  if (res.stop_reason === 'max_tokens') throw new Error('Câu trả lời bị cắt giữa chừng (chạm trần token).')
  const usage = { input_tokens: res.usage?.input_tokens ?? null, output_tokens: res.usage?.output_tokens ?? null }
  const toolUse = res.content.find((b) => b.type === 'tool_use')
  if (toolUse) return { type: 'tool', name: toolUse.name, args: toolUse.input ?? {}, usage }
  return { type: 'text', text: res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim(), usage }
}

function tien(usage) {
  const g = GIA[MODEL]
  if (!g || usage?.input_tokens == null) return null
  return Math.round(((usage.input_tokens * g.vao + usage.output_tokens * g.ra) / 1e6) * USD_VND)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!SB_URL || !SB_SERVICE) return res.status(500).json({ error: 'Server thiếu cấu hình Supabase (VITE_SUPABASE_URL/SUPABASE_SERVICE_ROLE trên Vercel).' })

  const { phien, cauHoi, boiCanh, lichSu, nguoi } = req.body ?? {}
  if (!cauHoi || !boiCanh) return res.status(400).json({ error: 'Thiếu cauHoi/boiCanh.' })

  const svc = createClient(SB_URL, SB_SERVICE)
  const lichSuCat = (lichSu ?? []).slice(-6) // giữ 6 lượt gần nhất — đủ mạch, không phình token vô hạn
  const messages = []
  for (const l of lichSuCat) { messages.push({ role: 'user', content: l.hoi }); messages.push({ role: 'assistant', content: l.dap }) }
  messages.push({
    role: 'user',
    content: `BẢNG SẠCH hôm nay (hệ thống tính sẵn — CHỈ ĐỌC, không tự tính lại):\n${JSON.stringify(boiCanh, null, 1)}\n\nCÂU HỎI: ${cauHoi}`,
  })

  try {
    const ket = await goiModel({ system: SYSTEM, messages, maxTokens: GIOI_HAN.maxTokensMacDinh })
    if (ket.type === 'text' && !ket.text.trim()) throw new Error('Model trả về rỗng.')
    const d = tien(ket.usage)
    console.log(`[troly] ${PROVIDER}/${MODEL} · ${ket.type === 'tool' ? `công cụ "${ket.name}"` : 'văn bản'}`
      + ` · vào ${ket.usage.input_tokens ?? '?'} · ra ${ket.usage.output_tokens ?? '?'}`
      + (d != null ? ` · ~${d.toLocaleString('vi-VN')} đ` : ''))

    // Ghi log (boi_canh giữ nguyên để truy lại "vì sao lúc đó nói thế" — xem migration gốc).
    await svc.from('troly_hoi_dap').insert({
      phien, cau_hoi: cauHoi.trim(), boi_canh: boiCanh, lich_su: lichSuCat,
      trang_thai: 'done', usage: ket.usage, model: `${PROVIDER}/${MODEL}`, nguoi: nguoi ?? null, done_at: new Date().toISOString(),
      ...(ket.type === 'tool' ? { cong_cu: ket.name, tham_so: ket.args } : { tra_loi: ket.text }),
    })

    return res.status(200).json(ket.type === 'tool' ? { congCu: ket.name, thamSo: ket.args } : { traLoi: ket.text })
  } catch (e) {
    const thongDiep = e?.message ?? String(e)
    await svc.from('troly_hoi_dap').insert({
      phien, cau_hoi: cauHoi.trim(), boi_canh: boiCanh, lich_su: lichSuCat,
      trang_thai: 'failed', error: thongDiep, nguoi: nguoi ?? null, done_at: new Date().toISOString(),
    }).then(() => {}, () => {}) // log lỗi cũng có thể lỗi (vd mất kết nối) — đừng để nó che mất lỗi gốc
    return res.status(502).json({ error: thongDiep })
  }
}
