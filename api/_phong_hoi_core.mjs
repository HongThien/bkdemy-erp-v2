// ============================================================================
// LÕI Ô HỎI — Phòng Trưởng bộ môn: hỏi dữ liệu VẬN HÀNH TRỢ GIẢNG (Thùy 05/11).
// File bắt đầu bằng "_" ⇒ Vercel không coi là route. Dùng chung cho api/phong-hoi.mjs (app) và
// scripts/phong-hoi-thu.mjs (chạy thử local trên DB thật, trong transaction ROLLBACK).
//
// RANH GIỚI (CLAUDE.md §2.0): danh mục công cụ + mọi phép tính + quyền + PHẠM VI MÔN đều ở Postgres
// (fn_phong_hoi_danh_muc / fn_phong_hoi_goi, mig 202611051536). File này chỉ: gửi danh mục cho model,
// chạy công cụ model chọn bằng ĐÚNG phiên người hỏi (goiRpc), trả kết quả lại cho model, lặp tối đa
// MAX_BUOC lượt. Model chỉ ĐỌC số công cụ trả, không tự đặt phạm vi (DB ghi đè).
// ============================================================================

export const MAX_BUOC = 6
const TRAN_KET_QUA = 60_000 // ký tự JSON mỗi kết quả công cụ đưa lại model

export function cauHinhModel(env) {
  const provider = env.TROLY_PROVIDER?.trim().toLowerCase()
    || (env.DEEPSEEK_API_KEY ? 'deepseek' : env.MOONSHOT_API_KEY ? 'moonshot' : 'anthropic')   // cùng thứ tự api/troly.mjs
  const model = env.PHONG_HOI_MODEL ?? env.TROLY_MODEL
    ?? (provider === 'moonshot' ? 'kimi-k2-turbo-preview' : provider === 'deepseek' ? 'deepseek-chat' : 'claude-sonnet-5-5')
  return { provider, model }
}

function systemPrompt(phamVi, homNay) {
  const mon = Array.isArray(phamVi?.mon) ? phamVi.mon.join(', ') : 'mọi môn'
  return `Bạn là trợ lý dữ liệu của TRƯỞNG BỘ MÔN tại trung tâm BKdemy, ngồi trong "Phòng làm việc" của họ trên phần mềm ERP.
Người hỏi quản bộ môn: ${mon}. Các ô (môn khối) đang học: ${(phamVi?.khoi ?? []).join(', ') || '—'}.
Hôm nay là ${homNay} (giờ Việt Nam).

## Việc của bạn
Trả lời câu hỏi về VẬN HÀNH CỦA TRỢ GIẢNG (TA) trong bộ môn để người hỏi ra quyết định: lương, công & duyệt công,
dữ liệu đã điền sau buổi (điểm danh, ET, BTVN, đánh giá/nhận xét, MT), việc trễ/quá hạn, hiệu suất, gậy;
và BỔ TRỢ của bộ môn (yếu · bù · đuổi · nhẹ · Hình · retest: ca theo tuần, case đang xử lý, HS chưa xếp ca, retest tồn, TA phụ trách ca).

## Luật
- MỌI con số phải lấy từ kết quả công cụ. Không bịa, không đoán. Cần số thì GỌI công cụ (gọi nhiều công cụ / nhiều lượt nếu cần).
- Không tự tính ra chỉ số mới (tỉ lệ, trung bình, xếp hạng) khi công cụ không trả; được đọc lại, so sánh, liệt kê, cộng vài số nhỏ hiển nhiên thì nói rõ là cộng tay.
- Phạm vi môn do hệ thống khoá: bạn chỉ thấy dữ liệu bộ môn của người hỏi. Công cụ báo "ngoai_pham_vi" thì nói đúng như vậy.
- Thiếu dữ liệu thì nói thẳng là thiếu / hệ chưa ghi, KHÁC với "bằng 0". Lương chưa chốt là TẠM TÍNH — luôn nói rõ.
- Tham số tên người/lớp: điền nguyên văn người dùng gõ; không có id. Mốc thời gian tương đối ("tuần này", "tháng trước") tự đổi ra ngày theo hôm nay.
- Câu hỏi mơ hồ tới mức không chọn được công cụ thì hỏi lại 1 câu ngắn.
- Không có công cụ nào GHI dữ liệu: bạn không duyệt công, không sửa gì. Người hỏi muốn duyệt thì chỉ họ sang màn Duyệt công.

## Cách trả lời
Tiếng Việt, ngắn, đi thẳng vào câu trả lời; người/lớp cần chú ý nêu trước. Danh sách nhiều người dùng bảng markdown gọn.
Tiền viết dạng 1.250.000 đ. Ngày viết dd/mm. Cuối câu trả lời ghi 1 dòng nhỏ "Nguồn: <tên công cụ>, <khoảng thời gian>".`
}

const catKetQua = (v) => {
  const s = JSON.stringify(v)
  return s.length > TRAN_KET_QUA ? s.slice(0, TRAN_KET_QUA) + '…(bị cắt — hỏi hẹp lại theo người/lớp/khoảng ngày)' : s
}

// ── Adapter: một vòng gọi model có công cụ ──────────────────────────────────
async function vongAnthropic({ key, model, system, lichSu, cauHoi, tools, chay }) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const claude = new Anthropic({ apiKey: key })
  const messages = []
  for (const l of lichSu) { messages.push({ role: 'user', content: l.hoi }, { role: 'assistant', content: l.dap }) }
  messages.push({ role: 'user', content: cauHoi })
  const aTools = tools.map((t) => ({ name: t.name, description: t.mo_ta, input_schema: t.tham_so }))
  const usage = { input_tokens: 0, output_tokens: 0 }
  for (let i = 0; i <= MAX_BUOC; i++) {
    const res = await claude.messages.create({ model, max_tokens: 4000, system, messages, tools: aTools, ...(i === MAX_BUOC ? { tool_choice: { type: 'none' } } : {}) })
    usage.input_tokens += res.usage?.input_tokens ?? 0; usage.output_tokens += res.usage?.output_tokens ?? 0
    if (res.stop_reason === 'refusal') throw new Error('Model từ chối trả lời.')
    const goi = res.content.filter((b) => b.type === 'tool_use')
    if (!goi.length) return { traLoi: res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim(), usage }
    messages.push({ role: 'assistant', content: res.content })
    const kq = []
    for (const g of goi) kq.push({ type: 'tool_result', tool_use_id: g.id, content: catKetQua(await chay(g.name, g.input ?? {})) })
    messages.push({ role: 'user', content: kq })
  }
  throw new Error('Quá số bước tra cứu.')
}

async function vongOpenAI({ base, key, nha, model, system, lichSu, cauHoi, tools, chay }) {
  const messages = [{ role: 'system', content: system }]
  for (const l of lichSu) { messages.push({ role: 'user', content: l.hoi }, { role: 'assistant', content: l.dap }) }
  messages.push({ role: 'user', content: cauHoi })
  const oTools = tools.map((t) => ({ type: 'function', function: { name: t.name, description: t.mo_ta, parameters: t.tham_so } }))
  const usage = { input_tokens: 0, output_tokens: 0 }
  for (let i = 0; i <= MAX_BUOC; i++) {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, max_tokens: 4000, temperature: 0.2, messages, tools: oTools, tool_choice: i === MAX_BUOC ? 'none' : 'auto' }),
    })
    const j = await res.json().catch(() => null)
    if (!res.ok) throw new Error(`${nha} từ chối: ${j?.error?.message ?? `HTTP ${res.status}`}`)
    usage.input_tokens += j?.usage?.prompt_tokens ?? 0; usage.output_tokens += j?.usage?.completion_tokens ?? 0
    const msg = j?.choices?.[0]?.message
    const goi = msg?.tool_calls ?? []
    if (!goi.length) return { traLoi: (msg?.content ?? '').trim(), usage }
    messages.push({ role: 'assistant', content: msg.content ?? '', tool_calls: goi })
    for (const g of goi) {
      let args = {}
      try { args = JSON.parse(g.function.arguments || '{}') } catch { /* tham số hỏng ⇒ rỗng, công cụ tự báo thiếu */ }
      messages.push({ role: 'tool', tool_call_id: g.id, content: catKetQua(await chay(g.function.name, args)) })
    }
  }
  throw new Error('Quá số bước tra cứu.')
}

// goiRpc(tenHam, thamSo) → data (ném lỗi nếu DB từ chối). env: biến môi trường (key model).
export async function hoiPhong({ goiRpc, cauHoi, lichSu = [], homNay, env }) {
  const dm = await goiRpc('fn_phong_hoi_danh_muc', {})          // cũng là CỔNG: không phải TBM ⇒ DB nổ 42501
  const tools = dm?.cong_cu ?? []
  const buoc = []
  const chay = async (ten, thamSo) => {
    let kq
    try { kq = await goiRpc('fn_phong_hoi_goi', { p_cong_cu: ten, p_tham_so: thamSo }) }
    catch (e) { kq = { loi: 'loi_goi', thong_diep: e?.message ?? String(e) } }
    buoc.push({ cong_cu: ten, tham_so: thamSo, loi: kq?.loi ?? null })
    return kq
  }
  const { provider, model } = cauHinhModel(env)
  const chung = { model, system: systemPrompt(dm?.pham_vi, homNay), lichSu: lichSu.slice(-6), cauHoi, tools, chay }
  let ket
  if (provider === 'deepseek') {
    if (!env.DEEPSEEK_API_KEY) throw new Error('Thiếu DEEPSEEK_API_KEY.')
    ket = await vongOpenAI({ ...chung, base: env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1', key: env.DEEPSEEK_API_KEY, nha: 'DeepSeek' })
  } else if (provider === 'moonshot') {
    if (!env.MOONSHOT_API_KEY) throw new Error('Thiếu MOONSHOT_API_KEY.')
    ket = await vongOpenAI({ ...chung, base: env.MOONSHOT_BASE_URL ?? 'https://api.moonshot.ai/v1', key: env.MOONSHOT_API_KEY, nha: 'Moonshot' })
  } else {
    if (!env.ANTHROPIC_API_KEY) throw new Error('Thiếu ANTHROPIC_API_KEY.')
    ket = await vongAnthropic({ ...chung, key: env.ANTHROPIC_API_KEY })
  }
  if (!ket.traLoi) throw new Error('Model trả về rỗng.')
  return { traLoi: ket.traLoi, buoc, usage: ket.usage, model: `${provider}/${model}`, phamVi: dm?.pham_vi ?? null }
}
