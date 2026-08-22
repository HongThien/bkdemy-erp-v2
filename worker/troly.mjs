// ============================================================================
// WORKER TRỢ LÝ HỎI–ĐÁP — gọi model để TRÒ CHUYỆN trên bảng sạch do client tính.
// ----------------------------------------------------------------------------
// Vòng đời 1 job: `troly_hoi_dap(trang_thai='pending')` → worker nhận ('processing')
//   → gửi BẢNG SẠCH + lịch sử lượt + câu hỏi → nhận VĂN BẢN THƯỜNG → ghi `tra_loi` → 'done'.
//
// Chạy:  node worker/troly.mjs
// Env (.env.local, gitignored):
//   VITE_SUPABASE_URL · SUPABASE_SERVICE_ROLE
//   TROLY_PROVIDER = anthropic | moonshot | deepseek   (mặc định: deepseek nếu có key deepseek,
//                                                        rồi tới moonshot, cuối cùng anthropic)
//   TROLY_MODEL    = tên model của nhà đó
//   ANTHROPIC_API_KEY  và/hoặc  MOONSHOT_API_KEY  và/hoặc  DEEPSEEK_API_KEY
//   MOONSHOT_BASE_URL  (mặc định https://api.moonshot.ai/v1 — bản .cn dùng https://api.moonshot.cn/v1)
//   DEEPSEEK_BASE_URL  (mặc định https://api.deepseek.com/v1)
//   ⚠ KHÔNG key nào được mang tiền tố VITE_ — `VITE_*` bị Vite nhúng thẳng vào bundle
//     browser, key lộ = người lạ đốt tiền (DEVLOG "vụ 920k").
//
// ⭐ VÌ SAO KHÔNG KHOÁ MỘT NHÀ: CEO muốn thử Moonshot/Kimi vì rẻ. Nhưng "rẻ hơn" và "hợp
//   việc này" là hai câu khác nhau, và bài học `danhgia` ghi rõ: *"phải thử mới biết, đừng
//   đoán"*. Nên worker chạy được cả hai trên CÙNG bảng sạch, log token + tiền thật mỗi lượt
//   → so bằng số, không so bằng cảm giác. Đổi nhà = sửa 1 dòng .env.local, không đụng code.
//
// ⭐ RANH GIỚI (doc §4, không mở lại): CODE tính số → bảng sạch. MODEL chỉ đọc rồi nói.
//   Worker này KHÔNG ghi gì vào dữ liệu vận hành — chỉ ghi câu trả lời vào chính job.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { SYSTEM, GIOI_HAN } from './troly_prompt.mjs'
import { TROLY_TOOLS } from '../src/lib/troly-tools.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const POLL_MS = 3000            // chat thì độ trễ cảm nhận được — quét dày hơn danhgia (5s)
const MAX_ATTEMPTS = 2          // hỏi–đáp: thử lại 1 lần là đủ, hỏng nữa thì báo người hỏi lại
const envRaw = (() => { try { return readFileSync(join(root, '.env.local'), 'utf8') } catch { return '' } })()
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? process.env[k]

const SB_URL = env('VITE_SUPABASE_URL')
const SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
if (!SB_URL || !SB_SERVICE) { console.error('Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(1) }

const KEY_ANTHROPIC = env('ANTHROPIC_API_KEY')
const KEY_MOONSHOT = env('MOONSHOT_API_KEY')
const KEY_DEEPSEEK = env('DEEPSEEK_API_KEY')
// .trim().toLowerCase() — gõ "DeepSeek"/"Deepseek" vẫn nhận đúng, không âm thầm rớt xuống Anthropic.
const PROVIDER = env('TROLY_PROVIDER')?.trim().toLowerCase() || (KEY_DEEPSEEK ? 'deepseek' : KEY_MOONSHOT ? 'moonshot' : 'anthropic')
const MOONSHOT_BASE = env('MOONSHOT_BASE_URL') ?? 'https://api.moonshot.ai/v1'
const DEEPSEEK_BASE = env('DEEPSEEK_BASE_URL') ?? 'https://api.deepseek.com/v1'

// Giá USD / 1 triệu token. ⚠ SỐ NÀY PHẢI TỰ KIỂM lại ở trang giá của từng nhà trước khi tin —
// giá đổi liên tục và Claude KHÔNG có nguồn cập nhật. Model không có trong bảng vẫn gọi được,
// nhưng sẽ không ước được tiền (log sẽ nói rõ). Rủi ro bị chặn bởi trần token ra rất thấp
// (chat trả lời ngắn), khác hẳn danhgia sinh JSON dài nên phải từ chối gọi khi chưa biết giá.
const GIA = {
  'claude-sonnet-5': { vao: 2, ra: 10 },
  'claude-haiku-4-5': { vao: 1, ra: 5 },
  'claude-opus-4-8': { vao: 5, ra: 25 },
  'deepseek-chat': { vao: 0.27, ra: 1.10 },      // ⚠ TỰ KIỂM lại ở platform.deepseek.com/api-docs/pricing trước khi tin
  'deepseek-reasoner': { vao: 0.55, ra: 2.19 },  // ⚠ TỰ KIỂM lại — reasoner sinh chain-of-thought, ra tốn hơn hẳn
}
const USD_VND = 26_000

const MODEL = env('TROLY_MODEL') ?? (PROVIDER === 'moonshot' ? 'kimi-k2-turbo-preview' : PROVIDER === 'deepseek' ? 'deepseek-chat' : 'claude-sonnet-5')
const svc = createClient(SB_URL, SB_SERVICE)

// ── CÔNG CỤ TRA CỨU ("Phần 1 — Query", CEO 18/08) ───────────────────────────
// Model CHỈ chọn tên công cụ + điền tham số THÔ — KHÔNG tự query DB (worker chạy service-role,
// bỏ qua RLS; để nó tự trả data là xuyên thẳng qua công siết quyền vừa làm). Client (browser,
// session thật người hỏi) mới là nơi THỰC SỰ chạy query — xem src/lib/troly-tracuu.ts.
const ANTHROPIC_TOOLS = TROLY_TOOLS.map((t) => ({ name: t.name, description: t.mo_ta, input_schema: t.tham_so }))
const OPENAI_TOOLS = TROLY_TOOLS.map((t) => ({ type: 'function', function: { name: t.name, description: t.mo_ta, parameters: t.tham_so } }))

// ── ADAPTER: ba nhà, một giao diện ──────────────────────────────────────────
// Moonshot VÀ DeepSeek đều dùng giao thức TƯƠNG THÍCH OpenAI ⇒ gọi thẳng bằng fetch qua
// CÙNG MỘT hàm dùng chung, chỉ khác base URL/key/tên nhà (để log lỗi rõ ai từ chối).
// Giữ adapter MỎNG: chỉ nhận {system, messages, maxTokens} → trả DẠNG THỐNG NHẤT
// { type:'text', text, usage } hoặc { type:'tool', name, args, usage }. Mọi thứ riêng của
// từng nhà (thinking, cache_control...) cố ý KHÔNG dùng — có thì bản so sánh không còn
// công bằng, mà mục đích lúc này là SO.
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
  if (!res.ok) {
    const msg = j?.error?.message ?? `HTTP ${res.status}`
    // 401/404 = sai key hoặc sai tên model ⇒ thử lại chắc chắn hỏng y hệt.
    throw Object.assign(new Error(`${nha} từ chối: ${msg}`), { khongThuLai: res.status === 401 || res.status === 404 })
  }
  const ch = j?.choices?.[0]
  if (ch?.finish_reason === 'length') throw new Error('Câu trả lời bị cắt giữa chừng (chạm trần token) — hỏi ngắn lại hoặc nâng trần.')
  const usage = { input_tokens: j?.usage?.prompt_tokens ?? null, output_tokens: j?.usage?.completion_tokens ?? null }
  const tc = ch?.message?.tool_calls?.[0]
  if (tc) {
    let args = {}
    try { args = JSON.parse(tc.function.arguments || '{}') } catch { /* model trả JSON hỏng → coi như không tham số, client sẽ tự báo thiếu */ }
    return { type: 'tool', name: tc.function.name, args, usage }
  }
  return { type: 'text', text: ch?.message?.content ?? '', usage }
}

async function goiModel({ system, messages, maxTokens }) {
  if (PROVIDER === 'moonshot') {
    if (!KEY_MOONSHOT) throw Object.assign(new Error('Thiếu MOONSHOT_API_KEY trong .env.local'), { khongThuLai: true })
    return goiOpenAICompatible({ base: MOONSHOT_BASE, key: KEY_MOONSHOT, nha: 'Moonshot', system, messages, maxTokens })
  }
  if (PROVIDER === 'deepseek') {
    if (!KEY_DEEPSEEK) throw Object.assign(new Error('Thiếu DEEPSEEK_API_KEY trong .env.local'), { khongThuLai: true })
    return goiOpenAICompatible({ base: DEEPSEEK_BASE, key: KEY_DEEPSEEK, nha: 'DeepSeek', system, messages, maxTokens })
  }

  if (!KEY_ANTHROPIC) throw Object.assign(new Error('Thiếu ANTHROPIC_API_KEY trong .env.local'), { khongThuLai: true })
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const claude = new Anthropic({ apiKey: KEY_ANTHROPIC })
  const res = await claude.messages.create({ model: MODEL, max_tokens: maxTokens, system, messages, tools: ANTHROPIC_TOOLS })
  if (res.stop_reason === 'refusal') throw Object.assign(new Error('Model từ chối trả lời.'), { khongThuLai: true })
  if (res.stop_reason === 'max_tokens') throw new Error('Câu trả lời bị cắt giữa chừng (chạm trần token).')
  const usage = { input_tokens: res.usage?.input_tokens ?? null, output_tokens: res.usage?.output_tokens ?? null }
  const toolUse = res.content.find((b) => b.type === 'tool_use')
  if (toolUse) return { type: 'tool', name: toolUse.name, args: toolUse.input ?? {}, usage }
  return {
    type: 'text',
    text: res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim(),
    usage,
  }
}

function tien(usage) {
  const g = GIA[MODEL]
  if (!g || usage?.input_tokens == null) return null
  return Math.round(((usage.input_tokens * g.vao + usage.output_tokens * g.ra) / 1e6) * USD_VND)
}

async function traLoi(job) {
  // Lịch sử lượt trước → messages, rồi mới tới câu hỏi mới. Bảng sạch đi kèm câu hỏi MỚI NHẤT
  // (không nhét vào từng lượt cũ): bảng đổi mỗi ngày, gửi lại bản cũ là ép model đọc số hết hạn.
  const messages = []
  for (const l of (job.lich_su ?? [])) {
    messages.push({ role: 'user', content: l.hoi })
    messages.push({ role: 'assistant', content: l.dap })
  }
  messages.push({
    role: 'user',
    content: `BẢNG SẠCH hôm nay (hệ thống tính sẵn — CHỈ ĐỌC, không tự tính lại):
${JSON.stringify(job.boi_canh, null, 1)}

CÂU HỎI: ${job.cau_hoi}`,
  })

  const ket = await goiModel({ system: SYSTEM, messages, maxTokens: GIOI_HAN.maxTokensMacDinh })
  if (ket.type === 'text' && !ket.text.trim()) throw new Error('Model trả về rỗng.')
  const d = tien(ket.usage)
  const nhanLog = ket.type === 'tool' ? `công cụ "${ket.name}"` : 'văn bản'
  console.log(`[troly]   ${PROVIDER}/${MODEL} · ${nhanLog} · vào ${ket.usage.input_tokens ?? '?'} · ra ${ket.usage.output_tokens ?? '?'}`
    + (d != null ? ` · ~${d.toLocaleString('vi-VN')} đ` : ' · (chưa có giá trong bảng — không ước được tiền)'))
  return ket
}

async function chay() {
  const { data: jobs } = await svc.from('troly_hoi_dap')
    .select('*').eq('trang_thai', 'pending').order('created_at').limit(1)
  const job = jobs?.[0]
  if (!job) return

  await svc.from('troly_hoi_dap').update({ trang_thai: 'processing' }).eq('id', job.id)
  console.log(`[troly] job ${job.id.slice(0, 8)} · "${String(job.cau_hoi).slice(0, 60)}"`)
  try {
    const ket = await traLoi(job)
    // type='tool': KHÔNG ghi tra_loi — client thấy cong_cu có giá trị sẽ tự chạy hàm data-layer
    // và tự hiện kết quả (worker không được đụng data, xem chú thích đầu file).
    await svc.from('troly_hoi_dap').update({
      trang_thai: 'done', usage: ket.usage, model: `${PROVIDER}/${MODEL}`, done_at: new Date().toISOString(),
      ...(ket.type === 'tool' ? { cong_cu: ket.name, tham_so: ket.args } : { tra_loi: ket.text }),
    }).eq('id', job.id)
  } catch (e) {
    // ⚠ PHẢI ghi lại `so_lan` khi trả job về 'pending'. Không ghi thì điều kiện bỏ cuộc
    //   KHÔNG BAO GIỜ đúng ⇒ job hỏng quay vòng vô hạn, mỗi vòng một lượt gọi model có
    //   tính tiền. (Bug này có trong bản đầu, bắt được lúc rà lại trước khi cho chạy thật.)
    const soLan = (job.so_lan ?? 0) + 1
    const lastTry = e?.khongThuLai || soLan >= MAX_ATTEMPTS
    await svc.from('troly_hoi_dap').update({
      trang_thai: lastTry ? 'failed' : 'pending',
      so_lan: soLan,
      error: e?.message ?? String(e),
      ...(lastTry ? { done_at: new Date().toISOString() } : {}),
    }).eq('id', job.id)
    console.error(`[troly]   lỗi${lastTry ? ' (bỏ cuộc)' : ' (sẽ thử lại)'}:`, e?.message ?? e)
  }
}

// Job treo 'processing' quá lâu = worker chết giữa chừng ở lần chạy trước. Không dọn thì
// nó nằm đó mãi và người dùng thấy "đang nghĩ" vĩnh viễn — đúng lỗi `danhgia_ai_job` đang
// có một job treo từ 24/07 tới nay vì KHÔNG có bước này.
async function donJobTreo() {
  const cu = new Date(Date.now() - 5 * 60_000).toISOString()
  const { data } = await svc.from('troly_hoi_dap').update({
    trang_thai: 'failed', error: 'Worker dừng giữa chừng — hỏi lại câu này.', done_at: new Date().toISOString(),
  }).eq('trang_thai', 'processing').lt('created_at', cu).select('id')
  if (data?.length) console.log(`[troly] dọn ${data.length} job treo quá 5 phút`)
}

// ── KIỂM KEY NGAY LÚC BẬT ───────────────────────────────────────────────────
// Khuôn của `danhgia.mjs`, bản đầu của file này QUÊN. Hậu quả thật (12/08): worker bật lên
// im ru như bình thường, người dùng hỏi một câu rồi ngồi chờ, job chết trong 0 giây vì
// thiếu key. Sai ở đây KHÔNG phải thiếu tính năng mà là BÁO SAI LÚC — lỗi cấu hình phải
// nổ lúc BẬT, không nổ lúc dùng.
async function kiemKey() {
  try {
    if (PROVIDER === 'moonshot') {
      if (!KEY_MOONSHOT) throw new Error('Thiếu MOONSHOT_API_KEY trong .env.local')
      const r = await fetch(`${MOONSHOT_BASE}/models`, { headers: { authorization: `Bearer ${KEY_MOONSHOT}` } })
      if (!r.ok) throw new Error(`Moonshot từ chối key (HTTP ${r.status})`)
    } else if (PROVIDER === 'deepseek') {
      if (!KEY_DEEPSEEK) throw new Error('Thiếu DEEPSEEK_API_KEY trong .env.local')
      const r = await fetch(`${DEEPSEEK_BASE}/models`, { headers: { authorization: `Bearer ${KEY_DEEPSEEK}` } })
      if (!r.ok) throw new Error(`DeepSeek từ chối key (HTTP ${r.status})`)
    } else {
      if (!KEY_ANTHROPIC) throw new Error('Thiếu ANTHROPIC_API_KEY trong .env.local')
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      await new Anthropic({ apiKey: KEY_ANTHROPIC }).models.list()
    }
  } catch (e) {
    console.error(`❌ ${e?.message ?? e}`)
    console.error('   Worker chỉ đọc .env.local MỘT LẦN lúc bật — sửa file xong phải khởi động lại.')
    process.exit(1)
  }
}
await kiemKey()

console.log(`[troly] worker chạy · ${PROVIDER}/${MODEL} · quét mỗi ${POLL_MS / 1000}s`)
if (!GIA[MODEL]) console.warn(`[troly] ⚠ "${MODEL}" chưa có trong bảng giá — vẫn chạy, nhưng log sẽ không ước được tiền. Tự kiểm giá ở trang của nhà cung cấp rồi thêm vào GIA.`)
await donJobTreo()
let dangChay = false
setInterval(async () => {
  if (dangChay) return
  dangChay = true
  try { await chay() } catch (e) { console.error('[troly] lỗi vòng quét:', e?.message ?? e) }
  finally { dangChay = false }
}, POLL_MS)
