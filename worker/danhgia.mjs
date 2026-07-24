// ============================================================================
// WORKER ĐÁNH GIÁ HỌC TẬP — gọi CLAUDE API để PHÁN trên stat sheet.
// ----------------------------------------------------------------------------
// Vòng đời 1 job: `danhgia_ai_job(trang_thai='pending')` → worker nhận ('processing')
//   → gửi stat sheet (do CLIENT tính, đã đóng băng) cho Claude
//   → nhận JSON có cấu trúc (phân loại + lý do + đề xuất level + độ tin)
//   → ghi `ket_qua` + `usage` → 'done'. Lỗi: attempt+1, quá MAX_ATTEMPTS → 'failed'.
//
// Chạy:  node worker/danhgia.mjs
// Env (.env.local, gitignored): VITE_SUPABASE_URL · SUPABASE_SERVICE_ROLE · ANTHROPIC_API_KEY
//   ⚠ ANTHROPIC_API_KEY KHÔNG có tiền tố VITE_ — cố ý: `VITE_*` bị Vite nhúng
//     thẳng vào bundle browser. Key Anthropic lộ = ai cũng đốt tiền được.
//     (Bài học DEVLOG "vụ 920k": gọi nhầm model đắt đã cháy tiền một lần rồi.)
//
// ⭐ RANH GIỚI VAI (spec §0, không mở lại):
//   · CODE tính số → stat sheet sạch. Claude KHÔNG tự cộng trừ trên nhiều dòng raw.
//   · CLAUDE đọc stat sheet → phân loại / xếp ưu tiên / viết lý do / nêu độ tin.
//   · NGƯỜI duyệt mới đổi state (PLAN §1.F). Worker này KHÔNG ghi `hs_level`.
//   · Kênh ③④ là phán đoán NGƯỜI — Claude bê nguyên, KHÔNG xét lại.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM, SCHEMA } from './danhgia_prompt.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const POLL_MS = 5000
const MAX_ATTEMPTS = 3
const envRaw = readFileSync(join(root, '.env.local'), 'utf8')
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '')
const SB_URL = env('VITE_SUPABASE_URL')
const SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
const ANTHROPIC_KEY = env('ANTHROPIC_API_KEY') ?? process.env.ANTHROPIC_API_KEY
if (!SB_URL || !SB_SERVICE) { console.error('Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(1) }
if (!ANTHROPIC_KEY) { console.error('Thiếu ANTHROPIC_API_KEY trong .env.local (KHÔNG đặt tên VITE_* — sẽ lọt vào bundle browser)'); process.exit(1) }

// ⚠ PHẢI đặt SAU khi có hàm env() — đặt trước là TDZ, worker chết ngay khi khởi động.
// Đổi model KHÔNG cần sửa code: đặt DANHGIA_MODEL / DANHGIA_EFFORT trong .env.local.
//   claude-opus-4-8  — mạnh nhất, đắt nhất (~2.900 đ/lượt)
//   claude-sonnet-5  — ~40% giá Opus; nhiều khả năng ĐỦ cho việc này (phần khó
//                      đã do code làm; model chỉ đọc bảng sạch + áp luật + viết ngắn)
//   claude-haiku-4-5 — rẻ nhất; nghi ngờ hụt ở khoản HIỆU CHỈNH ĐỘ TIN (biết khi nào
//                      bằng chứng mỏng mà nói thẳng) — phải thử mới biết, đừng đoán
// effort: high → nghĩ nhiều → token suy nghĩ (tính giá output) là khoản tốn nhất.
//   Hạ xuống 'medium' là cách giảm tiền mạnh nhất mà không đổi model.
const MODEL = env('DANHGIA_MODEL') ?? process.env.DANHGIA_MODEL ?? 'claude-opus-4-8'
const EFFORT = env('DANHGIA_EFFORT') ?? process.env.DANHGIA_EFFORT ?? 'high'


const svc = createClient(SB_URL, SB_SERVICE) // service role: đọc/ghi job, không vướng RLS
const claude = new Anthropic({ apiKey: ANTHROPIC_KEY })

async function phan(job) {
  // Model do NGƯỜI chọn trên màn hình (cột `model_chon`) — để Thùy tự so Sonnet vs Opus
  // trên cùng dữ liệu. Không chọn thì rơi về mặc định của worker.
  const model = job.model_chon ?? MODEL
  const res = await claude.messages.create({
    model,
    max_tokens: 16000,
    // Adaptive thinking: Claude tự quyết nghĩ sâu tới đâu. effort high vì đây là
    // việc phán đoán về học sinh thật — sai thì ảnh hưởng người, không phải chỉ tốn token.
    thinking: { type: 'adaptive' },
    output_config: { effort: EFFORT, format: { type: 'json_schema', schema: SCHEMA } },
    // ⚠ cache_control ở đây HIỆN CHƯA CÓ TÁC DỤNG và đó là chuyện bình thường:
    //   Opus 4.8 chỉ cache tiền tố từ 4096 token trở lên; system prompt + schema
    //   của ta mới ~1540 token → dưới ngưỡng, API lặng lẽ KHÔNG cache (không báo lỗi).
    //   Giữ lại vì (a) vô hại, (b) prompt dài thêm là tự động có hiệu lực.
    //   Muốn biết đã cache chưa: xem `usage.cache_read_input_tokens` trong log —
    //   bằng 0 mãi nghĩa là vẫn dưới ngưỡng.
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: `Lớp: ${job.stat_sheet?.ten_lop ?? '(không rõ)'} · Môn: ${job.mon} · Kỳ: ${job.stat_sheet?.cua_so ?? '(không rõ)'}

STAT SHEET (do hệ thống tính sẵn — chỉ đọc, không tự tính lại):
${JSON.stringify(job.stat_sheet, null, 1)}`,
    }],
  })

  // stop_reason phải xem TRƯỚC khi đọc content: refusal → content rỗng; max_tokens → JSON cụt.
  if (res.stop_reason === 'refusal') {
    throw new Error(`Claude từ chối trả lời (${res.stop_details?.category ?? 'không rõ lý do'})`)
  }
  if (res.stop_reason === 'max_tokens') {
    throw new Error('Kết quả bị cắt giữa chừng (max_tokens) — lớp quá đông, cần chia nhỏ stat sheet')
  }
  const text = res.content.find((b) => b.type === 'text')?.text
  if (!text) throw new Error('Không có khối text nào trong phản hồi')
  return { ketQua: JSON.parse(text), usage: res.usage, model: res.model }
}

async function chay() {
  const { data: jobs } = await svc.from('danhgia_ai_job').select('*')
    .eq('trang_thai', 'pending').order('updated_at').limit(1)
  const job = jobs?.[0]
  if (!job) return

  // Nhận job NGAY (atomic-ish: chỉ nhận nếu vẫn còn pending) — chống 2 worker cùng ăn 1 job.
  const { data: claimed } = await svc.from('danhgia_ai_job')
    .update({ trang_thai: 'processing', updated_at: new Date().toISOString() })
    .eq('id', job.id).eq('trang_thai', 'pending').select('id')
  if (!claimed?.length) return // worker khác nhận mất rồi

  const soHS = job.stat_sheet?.hoc_sinh?.length ?? 0
  console.log(`[danhgia] job ${job.id.slice(0, 8)} · ${soHS} HS · ${job.model_chon ?? MODEL} · đang hỏi…`)
  const t0 = Date.now()
  try {
    const { ketQua, usage, model } = await phan(job)
    await svc.from('danhgia_ai_job').update({
      trang_thai: 'done', ket_qua: ketQua, usage, model, error: null,
      updated_at: new Date().toISOString(), done_at: new Date().toISOString(),
    }).eq('id', job.id)
    const u = usage ?? {}
    console.log(`[danhgia] ✓ ${((Date.now() - t0) / 1000).toFixed(1)}s · vào ${u.input_tokens} (cache đọc ${u.cache_read_input_tokens ?? 0}) · ra ${u.output_tokens}`)
  } catch (e) {
    const attempt = (job.attempt ?? 0) + 1
    const hong = attempt >= MAX_ATTEMPTS
    await svc.from('danhgia_ai_job').update({
      trang_thai: hong ? 'failed' : 'pending', attempt, error: String(e?.message ?? e),
      updated_at: new Date().toISOString(),
    }).eq('id', job.id)
    console.error(`[danhgia] ✗ lần ${attempt}${hong ? ' (bỏ cuộc)' : ''}: ${e?.message ?? e}`)
  }
}

console.log(`[danhgia] worker chạy · model ${MODEL} · quét mỗi ${POLL_MS / 1000}s`)
let dangChay = false
setInterval(async () => {
  if (dangChay) return // 1 job 1 lúc — gọi Claude tốn tiền, không chồng lệnh
  dangChay = true
  try { await chay() } catch (e) { console.error('[danhgia] lỗi vòng quét:', e?.message ?? e) }
  finally { dangChay = false }
}, POLL_MS)
