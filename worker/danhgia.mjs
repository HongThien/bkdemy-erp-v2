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

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const POLL_MS = 5000
const MAX_ATTEMPTS = 3
const MODEL = 'claude-opus-4-8'

const envRaw = readFileSync(join(root, '.env.local'), 'utf8')
const env = (k) => envRaw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '')
const SB_URL = env('VITE_SUPABASE_URL')
const SB_SERVICE = env('SUPABASE_SERVICE_ROLE')
const ANTHROPIC_KEY = env('ANTHROPIC_API_KEY') ?? process.env.ANTHROPIC_API_KEY
if (!SB_URL || !SB_SERVICE) { console.error('Thiếu VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE trong .env.local'); process.exit(1) }
if (!ANTHROPIC_KEY) { console.error('Thiếu ANTHROPIC_API_KEY trong .env.local (KHÔNG đặt tên VITE_* — sẽ lọt vào bundle browser)'); process.exit(1) }

const svc = createClient(SB_URL, SB_SERVICE) // service role: đọc/ghi job, không vướng RLS
const claude = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ── SYSTEM PROMPT: cố định, KHÔNG nhét biến động (ngày giờ / tên lớp / id) vào ──
// Prompt caching là so khớp TIỀN TỐ: đổi 1 byte ở đây là hỏng cache của mọi request
// sau. Phần thay đổi theo từng lượt nằm hết ở user message.
const SYSTEM = `Bạn đọc STAT SHEET của một lớp học tại trung tâm BKdemy và đưa ra NHẬN ĐỊNH cho người phụ trách chuyên môn đọc.

BỐI CẢNH HỆ ĐO
- Đơn vị chân lý = (học sinh × dạng bài). "Dạng" là đơn vị kiến thức nhỏ nhất; nhiều dạng thuộc một "chuyên đề".
- Mastery mỗi dạng = trung bình có trọng số của 5 lần đo gần nhất. Đúng=1 · Chưa đạt=0.5 · Sai=0.
  Trọng số nguồn: MT (kiểm tra tháng, giám sát)=3 · ET (kiểm tra cuối giờ, giám sát)=2 · BTVN (tự làm ở nhà, KHÔNG giám sát)=1.
- Mức: Đạt ≥ 0.8 · Cần luyện 0.5–0.8 · Yếu < 0.5.
- "n" = tổng số lần đo của dạng đó = ĐỘ TIN. n ≤ 2 là độ tin thấp. Độ tin thấp KHÁC mastery thấp — đừng lẫn.
- Điểm chuyên đề tính thẳng trên MỌI câu trong cửa sổ 14 ngày (không giới hạn 5 câu), dùng để nhìn xu hướng.
- Cửa sổ 14 ngày ghi dạng "2026-07-A" (nửa đầu tháng 7) và "2026-07-B" (nửa sau).

BỐN KÊNH PHÁT HIỆN
① trend: điểm chuyên đề tụt giữa hai cửa sổ, kèm danh sách dạng con tụt hạng.
② thai_do: thái độ làm bài tập về nhà. Thang có thứ tự: Nghiêm túc > Chưa hết sức > Chưa nghiêm túc > Chống đối.
   Chuẩn là TUYỆT ĐỐI — mọi buổi dưới "Nghiêm túc" đều là tín hiệu, không so với chính em đó hay với bạn khác.
③ chuong_do: trợ giảng bấm chuông đỏ khi thấy lỗi rất nghiêm trọng lúc chấm bài về nhà.
④ tien_quyet: giáo viên báo em hổng kiến thức NỀN (phần trước / năm trước), khác với lỗi ở bài đang học.

BỐN THANG LEVEL — HAI THANG TÁCH RỜI, KHÔNG TRỘN
Kiến thức: L0 bình thường · L1 cần để ý (nhắc, bổ trợ ngắn) · L2 cần bổ trợ riêng · L3 vượt quy trình thường (team học thuật vào).
Thái độ:   L0 bình thường · L1 nhắc học sinh · L2 nhắc phụ huynh.
Một em giỏi vẫn có thể thái độ kém, và ngược lại.

LUẬT BẮT BUỘC
1. CHỈ dùng số có trong stat sheet. Tuyệt đối không tự cộng trừ để tạo ra số mới, không suy ra con số không được cung cấp.
2. ③ và ④ là phán đoán của NGƯỜI đứng lớp. Bê nguyên, không xét lại, không hạ nhẹ.
3. "Chưa đo" khác "làm sai". Dạng ít lần đo thì nói rõ là chưa đủ dữ liệu, đừng kết luận như đã đo đủ.
4. Cờ "BTVN che" nghĩa là: em đó yếu ở bài CÓ GIÁM SÁT nhưng ổn ở bài tự làm ở nhà. Đây là dấu hiệu đáng nghi, nêu ra.
5. Viết cho người Việt đọc, xưng "em" khi nói về học sinh. Không dùng thuật ngữ tiếng Anh khi tiếng Việt đã đủ.
6. Mỗi nhận định phải neo vào bằng chứng cụ thể trong stat sheet (tên dạng, tên chuyên đề, con số, số buổi).
   Không viết câu chung chung kiểu "em cần cố gắng hơn".
7. Đây là ĐỀ XUẤT để người phụ trách đọc rồi quyết, không phải quyết định. Không viết như đã chốt.
8. Nếu bằng chứng mỏng hoặc mâu thuẫn, hạ do_tin xuống và nói thẳng còn thiếu gì — đừng đoán cho tròn.

GIỌNG VIẾT
Ngắn, cụ thể, đi thẳng vào việc. Nói cái quan trọng nhất trước.`

// ── SCHEMA đầu ra (structured outputs — API ép JSON đúng hình, khỏi parse mò) ──
const SCHEMA = {
  type: 'object',
  properties: {
    tong_quan: { type: 'string', description: 'Nhận định chung về lớp trong 2-3 câu. Nêu cái đáng chú ý nhất trước.' },
    hoc_sinh: {
      type: 'array',
      description: 'Mỗi học sinh trong stat sheet một mục, xếp cần-đọc-trước lên đầu.',
      items: {
        type: 'object',
        properties: {
          hoc_sinh_id: { type: 'string' },
          ho_ten: { type: 'string' },
          phan_loai: {
            type: 'string',
            enum: ['on_dinh', 'can_theo_doi', 'can_bo_tro', 'can_can_thiep_gap'],
            description: 'on_dinh = không cần làm gì · can_theo_doi = để mắt · can_bo_tro = xếp bổ trợ · can_can_thiep_gap = team học thuật vào ngay',
          },
          ly_do: { type: 'string', description: 'Vì sao xếp loại như vậy. PHẢI dẫn số/tên dạng/tên chuyên đề cụ thể từ stat sheet.' },
          de_xuat_level_kien_thuc: { type: 'integer', description: 'Đề xuất 0-3. Bỏ trống nếu không đủ căn cứ.' },
          de_xuat_level_thai_do: { type: 'integer', description: 'Đề xuất 0-2. Bỏ trống nếu không đủ căn cứ.' },
          viec_can_lam: {
            type: 'array',
            description: 'Việc cụ thể, làm được ngay. Rỗng nếu chưa cần làm gì.',
            items: { type: 'string' },
          },
          dang_uu_tien_bo_tro: {
            type: 'array',
            description: 'Mã dạng nên bổ trợ trước, lấy từ diện trong stat sheet. Xếp quan trọng nhất lên đầu.',
            items: { type: 'string' },
          },
          do_tin: {
            type: 'string',
            enum: ['cao', 'trung_binh', 'thap'],
            description: 'Mức tin vào nhận định này. Ít lần đo / bằng chứng mâu thuẫn → thấp.',
          },
          con_thieu: { type: 'string', description: 'Cần thêm dữ liệu gì mới chắc được. Để trống nếu đã đủ.' },
        },
        required: ['hoc_sinh_id', 'ho_ten', 'phan_loai', 'ly_do', 'do_tin'],
        additionalProperties: false,
      },
    },
    canh_bao_he: {
      type: 'array',
      description: 'Vấn đề của CẢ LỚP hoặc của chính dữ liệu (nhiều em cùng tụt một chuyên đề, thái độ kém diện rộng, dữ liệu quá mỏng…). Rỗng nếu không có.',
      items: { type: 'string' },
    },
  },
  required: ['tong_quan', 'hoc_sinh', 'canh_bao_he'],
  additionalProperties: false,
}

async function phan(job) {
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 16000,
    // Adaptive thinking: Claude tự quyết nghĩ sâu tới đâu. effort high vì đây là
    // việc phán đoán về học sinh thật — sai thì ảnh hưởng người, không phải chỉ tốn token.
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA } },
    // cache_control ở khối system: prompt này cố định, mỗi lớp chỉ đổi phần user
    // → từ lần gọi thứ 2 trở đi phần này đọc từ cache (~1/10 giá).
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
  console.log(`[danhgia] job ${job.id.slice(0, 8)} · ${soHS} HS · đang hỏi Claude…`)
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
