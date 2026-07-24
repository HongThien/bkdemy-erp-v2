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

// ── HÀNG RÀO CHI PHÍ ─────────────────────────────────────────────────────────
// Mọi con số dưới đây ĐO THẬT, không ước: lớp 11B1 (4 em) → vào 6.245 · ra 5.025
// token ⇒ ~1.256 token ra mỗi em (đã gồm token suy nghĩ).
const TOK_MOI_EM = 1300      // token ra mỗi em
const TOK_NEN = 1500         // phần tổng quan + cảnh báo cả lớp
const HE_SO_AN_TOAN = 1.6    // chừa chỗ cho em có nhiều dạng bất thường
const TRAN_TOKEN_RA = 40_000 // trần cứng, chặn ca sinh chữ chạy loạn
const TRAN_TIEN_1_LUOT = 25_000 // đ — vượt thì DỪNG, báo người, không âm thầm tiêu
const USD_VND = 26_000
const GIA = { // USD / 1 triệu token
  'claude-opus-4-8': { vao: 5, ra: 25 },
  'claude-opus-4-7': { vao: 5, ra: 25 },
  'claude-sonnet-5': { vao: 2, ra: 10 },
  'claude-sonnet-4-6': { vao: 3, ra: 15 },
  'claude-haiku-4-5': { vao: 1, ra: 5 },
}
// ⚠ Haiku 4.5 KHÔNG hỗ trợ adaptive thinking (API trả 400 "adaptive thinking is not
//   supported on this model"). Gửi kèm `thinking` cho model không hỗ trợ = job chết.
const CO_ADAPTIVE = new Set(['claude-opus-4-8', 'claude-opus-4-7', 'claude-sonnet-5', 'claude-sonnet-4-6', 'claude-fable-5'])

async function phan(job) {
  // Model do NGƯỜI chọn trên màn hình (cột `model_chon`) — để Thùy tự so Sonnet vs Opus
  // trên cùng dữ liệu. Không chọn thì rơi về mặc định của worker.
  const model = job.model_chon ?? MODEL
  const gia = GIA[model]
  if (!gia) throw Object.assign(new Error(`Model "${model}" không có trong bảng giá — từ chối gọi để khỏi tiêu tiền mù.`), { khongThuLai: true })

  const soHS = job.stat_sheet?.hoc_sinh?.length ?? 0
  const vaoUoc = Math.round(JSON.stringify(job.stat_sheet).length / 3.2) + 1600 // +system+schema
  const raUoc = TOK_NEN + TOK_MOI_EM * soHS
  // max_tokens theo CỠ LỚP, không để cố định 64.000: trần cố định nghĩa là một lượt
  // chạy loạn có thể sinh 64k token = ~41.600 đ trên Opus.
  const maxTokens = Math.min(TRAN_TOKEN_RA, Math.max(8000, Math.round(raUoc * HE_SO_AN_TOAN)))
  const tienUoc = Math.round(((vaoUoc * gia.vao + raUoc * gia.ra) / 1e6) * USD_VND)
  const tienToiDa = Math.round(((vaoUoc * gia.vao + maxTokens * gia.ra) / 1e6) * USD_VND)

  // Lớp đông tới mức nhu cầu vượt TRẦN CỨNG → gọi cũng chắc chắn bị cắt giữa chừng.
  // Chặn từ đầu thay vì trả tiền cho một kết quả hỏng đã biết trước.
  if (raUoc > TRAN_TOKEN_RA) {
    throw Object.assign(new Error(
      `Lớp quá đông: ${soHS} em cần ~${raUoc.toLocaleString('vi-VN')} token ra, vượt trần cứng ` +
      `${TRAN_TOKEN_RA.toLocaleString('vi-VN')}. Gọi cũng sẽ bị cắt giữa chừng — cần chia nhỏ lớp.`), { khongThuLai: true })
  }
  if (tienToiDa > TRAN_TIEN_1_LUOT) {
    throw Object.assign(new Error(
      `Chặn trước khi gọi: lượt này có thể tốn tới ${tienToiDa.toLocaleString('vi-VN')} đ ` +
      `(${soHS} em, ${model}) — vượt trần ${TRAN_TIEN_1_LUOT.toLocaleString('vi-VN')} đ. ` +
      `Chọn model rẻ hơn, hoặc chia nhỏ lớp.`), { khongThuLai: true })
  }
  console.log(`[danhgia]   ước ~${tienUoc.toLocaleString('vi-VN')} đ (tối đa ${tienToiDa.toLocaleString('vi-VN')} đ) · trần token ra ${maxTokens.toLocaleString('vi-VN')}`)
  // ⚠ max_tokens là trần cho TOÀN BỘ phần sinh ra, GỒM CẢ token suy nghĩ.
  //   Đo thật: 4 em → 5.025 token ra. Lớp 15 em vượt 16.000 → JSON đứt giữa chừng.
  //   Nâng lên 64.000 thì BẮT BUỘC dùng streaming: gọi thường với max_tokens lớn sẽ
  //   treo tới khi đứt kết nối HTTP (SDK cũng chặn). Streaming không đổi kết quả,
  //   chỉ giữ kết nối sống; `finalMessage()` trả về đúng object như messages.create.
  const stream = claude.messages.stream({
    model,
    max_tokens: maxTokens,
    // Adaptive thinking: Claude tự quyết nghĩ sâu tới đâu. effort high vì đây là
    // việc phán đoán về học sinh thật — sai thì ảnh hưởng người, không phải chỉ tốn token.
    // Model không hỗ trợ (Haiku) thì BỎ HẲN trường này, gửi kèm là 400.
    ...(CO_ADAPTIVE.has(model) ? { thinking: { type: 'adaptive' } } : {}),
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

  const res = await stream.finalMessage()

  // stop_reason phải xem TRƯỚC khi đọc content: refusal → content rỗng; max_tokens → JSON cụt.
  // ⚠ Gắn cờ `khongThuLai` cho lỗi TẤT ĐỊNH — thử lại chắc chắn hỏng y hệt mà vẫn
  //   sinh đủ token rồi vứt. Đã dính: lớp 15 em bị cắt, worker thử 3 lần, đốt ~15.000 đ
  //   cho ba lần hỏng giống nhau.
  if (res.stop_reason === 'refusal') {
    throw Object.assign(new Error(`Claude từ chối trả lời (${res.stop_details?.category ?? 'không rõ lý do'})`), { khongThuLai: true })
  }
  if (res.stop_reason === 'max_tokens') {
    throw Object.assign(new Error(`Kết quả bị cắt giữa chừng: sinh ${res.usage?.output_tokens} token, chạm trần 64.000. Lớp quá đông — cần chia nhỏ stat sheet.`), { khongThuLai: true })
  }
  const text = res.content.find((b) => b.type === 'text')?.text
  if (!text) throw new Error('Không có khối text nào trong phản hồi')
  const tienThat = Math.round(((res.usage.input_tokens * gia.vao + res.usage.output_tokens * gia.ra) / 1e6) * USD_VND)
  // In cả ƯỚC lẫn THẬT: lệch nhiều nghĩa là hằng số TOK_MOI_EM sai, phải chỉnh —
  // không để ước lượng trôi khỏi thực tế rồi hàng rào chi phí thành vô nghĩa.
  return { ketQua: JSON.parse(text), usage: res.usage, model: res.model, tienThat, tienUoc, soHS }
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
    const { ketQua, usage, model, tienThat, tienUoc, soHS: n } = await phan(job)
    await svc.from('danhgia_ai_job').update({
      trang_thai: 'done', ket_qua: ketQua, usage, model, error: null,
      updated_at: new Date().toISOString(), done_at: new Date().toISOString(),
    }).eq('id', job.id)
    const u = usage ?? {}
    const lech = tienUoc ? Math.round((tienThat / tienUoc - 1) * 100) : 0
    console.log(`[danhgia] ✓ ${((Date.now() - t0) / 1000).toFixed(1)}s · vào ${u.input_tokens} · ra ${u.output_tokens} · ${tienThat.toLocaleString('vi-VN')} đ (ước ${tienUoc.toLocaleString('vi-VN')} đ, lệch ${lech > 0 ? '+' : ''}${lech}%) · ${Math.round(u.output_tokens / Math.max(n, 1))} token/em`)
    if (Math.abs(lech) > 40) console.log(`[danhgia]   ⚠ ước lệch >40% — chỉnh hằng số TOK_MOI_EM trong worker cho khớp thực tế`)
  } catch (e) {
    const attempt = (job.attempt ?? 0) + 1
    // Lỗi TẤT ĐỊNH (bị cắt / bị từ chối) → hỏng luôn, KHÔNG thử lại: kết quả y hệt
    // mà mỗi lần vẫn sinh đủ token và vẫn tính tiền.
    const hong = e?.khongThuLai === true || attempt >= MAX_ATTEMPTS
    await svc.from('danhgia_ai_job').update({
      trang_thai: hong ? 'failed' : 'pending', attempt, error: String(e?.message ?? e),
      updated_at: new Date().toISOString(),
    }).eq('id', job.id)
    console.error(`[danhgia] ✗ lần ${attempt}${e?.khongThuLai ? ' (lỗi tất định — không thử lại)' : hong ? ' (bỏ cuộc)' : ''}: ${e?.message ?? e}`)
  }
}

// ── KIỂM KEY NGAY LÚC KHỞI ĐỘNG ────────────────────────────────────────────
// ⚠ Worker đọc .env.local ĐÚNG MỘT LẦN lúc khởi động. Sửa key trong file mà không
//   khởi động lại thì nó vẫn dùng key cũ trong bộ nhớ — đã dính: worker bật từ lúc
//   key còn là placeholder, sau đó key thật được cắm nhưng worker vẫn 401 mãi.
//   `models.list()` KHÔNG tốn token → kiểm được miễn phí, chết sớm còn hơn để mỗi
//   job đốt 3 lượt thử rồi mới báo 'failed'.
if (!/^sk-ant-/.test(ANTHROPIC_KEY) || ANTHROPIC_KEY.length < 90 || ANTHROPIC_KEY.includes('...')) {
  console.error(`❌ ANTHROPIC_API_KEY trông không giống key thật (dài ${ANTHROPIC_KEY.length} ký tự${ANTHROPIC_KEY.includes('...') ? ', còn dấu "..."' : ''}).`)
  console.error('   Key thật dài ~108 ký tự, bắt đầu bằng sk-ant-. Console chỉ hiện đầy đủ 1 lần lúc tạo —')
  console.error('   nếu đã lỡ, tạo key mới ở console.anthropic.com → Settings → API keys.')
  process.exit(1)
}
try {
  await claude.models.list()
} catch (e) {
  console.error('❌ Key bị Anthropic từ chối:', e?.error?.error?.message ?? e?.message ?? e)
  console.error('   Nếu vừa sửa .env.local thì nhớ KHỞI ĐỘNG LẠI worker — nó chỉ đọc file 1 lần lúc bật.')
  process.exit(1)
}

console.log(`[danhgia] worker chạy · model mặc định ${MODEL} · quét mỗi ${POLL_MS / 1000}s`)
let dangChay = false
setInterval(async () => {
  if (dangChay) return // 1 job 1 lúc — gọi Claude tốn tiền, không chồng lệnh
  dangChay = true
  try { await chay() } catch (e) { console.error('[danhgia] lỗi vòng quét:', e?.message ?? e) }
  finally { dangChay = false }
}, POLL_MS)
