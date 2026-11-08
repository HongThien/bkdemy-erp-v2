// Edge Function `btvn-cham-ai` — chấm BTVN tự động bằng Claude cho app trợ giảng (mig 202611071647).
//   POST { buoi_hoc_id, hoc_sinh_id }  (header Authorization: Bearer <JWT của TA>)
//   → đọc câu + ảnh bằng chính JWT của TA (fn_btvn_ai_du_lieu, RLS/quyền như TA) → gọi Claude
//   → ghi GỢI Ý vào bảng nháp (fn_btvn_ai_ghi). KHÔNG ghi gami_grades — TA xác nhận mới ghi (fn_btvn_ai_chot).
// Biến môi trường (Dashboard → Edge Functions → Secrets):
//   ANTHROPIC_API_KEY (bắt buộc) · CLAUDE_MODEL (mặc định claude-opus-5-5) · CLAUDE_EFFORT (mặc định medium)
//   SUPABASE_URL, SUPABASE_ANON_KEY (Supabase tự có).
// Deploy: `supabase functions deploy btvn-cham-ai` (BẬT Verify JWT — chỉ nhân sự đăng nhập mới gọi được).
// Luật chấm: spec-quy-tac-cham.md (RULE_VERSION bên dưới — đổi rule thì tăng version).

import Anthropic from 'npm:@anthropic-ai/sdk@0.113.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const MODEL = Deno.env.get('CLAUDE_MODEL') ?? 'claude-opus-5-5'
const EFFORT = Deno.env.get('CLAUDE_EFFORT') ?? 'medium'
const RULE_VERSION = 'v0.1-2026-11-07'
const MAX_ANH = 16
const MAX_BYTES = 5 * 1024 * 1024 // giới hạn 1 ảnh của API

const cors = (origin: string | null): Record<string, string> => ({
  'Access-Control-Allow-Origin': origin ?? '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Vary': 'Origin',
})
const json = (data: unknown, status: number, h: Record<string, string>) =>
  new Response(JSON.stringify(data), { status, headers: { ...h, 'Content-Type': 'application/json; charset=utf-8' } })

// Quy tắc chấm rút gọn từ spec-quy-tac-cham.md v0.1 (phần BTVN). Giữ CỐ ĐỊNH để prompt cache trúng.
const QUY_TAC = `Bạn là người chấm bài tập về nhà (BTVN) môn Toán cho trung tâm BK Academy. Bạn nhận ảnh bài làm viết tay của MỘT học sinh và danh sách câu của phiếu BTVN (có thể kèm đề, đáp án, lời giải từ kho). Chấm từng câu theo quy tắc sau.

KẾT QUẢ MỖI CÂU
- correct (Đ): kết quả đúng, hướng làm đúng, lập luận đủ. Lỗi nhãn/ký hiệu nhỏ không làm sai lập luận vẫn là Đ (ghi nhận xét).
- partial (C): hướng đúng nhưng có lỗi thật: sai một bước tính, dòng trung gian sai dù cuối đúng, thiếu lý do then chốt, thiếu kết luận, chưa phân tích/rút gọn hết (ví dụ còn nhân tử chung trong ngoặc, còn a² − b² chưa tách), làm dở.
- wrong (S): sai phương pháp, kết quả sai mà không có hướng đúng, bỏ trống câu có chỗ làm trên phiếu, gạch xoá hết không còn lời giải.
- Câu chỉ điền một dòng kết quả: đúng ⇒ correct; bằng đề bài nhưng chưa phân tích hết ⇒ partial; không bằng đề bài ⇒ wrong.

ĐỌC BÀI
- Tự giải câu trước rồi mới so; đề có thể in sẵn trên phiếu trong ảnh. Nếu có đáp án kho, đối chiếu nhưng đáp án kho có thể sai ⇒ chac=false.
- Chỉ chấm cái nhìn thấy rõ. Phần học sinh gạch xoá: bỏ qua. Chữ viết tay nhập nhằng (x/z, H/N, 3/5, 6/8…) mà mọi cách đọc hợp lý đều khớp đáp án đúng ⇒ không trừ.
- Chữ số/dấu quyết định kết quả mà không đọc chắc, trắc nghiệm khoanh 2 đáp án, ảnh cắt mất một phần câu ⇒ vẫn đưa kết quả nghiêng nhất nhưng chac=false.
- Câu KHÔNG có trên ảnh (thiếu trang/ảnh) ⇒ KHÔNG đưa câu đó vào danh sách cau.
- Ảnh có thể xoay ngang/lộn ngược, thứ tự lộn xộn: tự xoay để đọc; thu_tu_anh = danh sách id ảnh theo đúng thứ tự trang của phiếu.

NHẬN XÉT
- nhan_xet mỗi câu partial/wrong: 1 dòng tiếng Việt dạng "<lỗi> vì: <lý do>. Đúng: <đáp án>" — nói lỗi trước, đủ để học sinh hiểu. Câu correct: để trống, trừ khi có lỗi nhãn nhỏ cần nhắc.
- loai_loi: một trong ket_qua_sai | sai_phuong_phap | dong_giua_sai | sai_mot_buoc | thieu_ly_do | thieu_ket_luan | chua_phan_tich_het | sai_dau | nhan_ky_hieu | don_vi | dieu_kien | trinh_bay. Chỉ gán khi chắc; không chắc để chuỗi rỗng.
- nhan_xet_chung: MỘT dòng nhận xét chung gửi phụ huynh (con làm tốt gì, sai kiểu gì, cần lưu ý gì), không liệt kê chi tiết từng câu, không ghi điểm.
- chac=true chỉ khi bạn chắc ≥ 90% kết quả câu đó.`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['thu_tu_anh', 'nhan_xet_chung', 'cau'],
  properties: {
    thu_tu_anh: { type: 'array', items: { type: 'string' } },
    nhan_xet_chung: { type: 'string' },
    cau: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['problem_id', 'result', 'chac', 'loai_loi', 'nhan_xet'],
        properties: {
          problem_id: { type: 'string' },
          result: { type: 'string', enum: ['correct', 'partial', 'wrong'] },
          chac: { type: 'boolean' },
          loai_loi: { type: 'string' },
          nhan_xet: { type: 'string' },
        },
      },
    },
  },
}

async function rpc(jwt: string, fn: string, body: unknown) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON_KEY, Authorization: `Bearer ${jwt}` },
    body: JSON.stringify(body),
  })
  const text = await r.text()
  let data: any = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!r.ok) throw new Error(`${fn}: ${typeof data === 'object' ? data?.message ?? text : text}`)
  return data
}

function b64(buf: Uint8Array): string {
  let s = ''
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000))
  return btoa(s)
}

async function taiAnh(jwt: string, path: string) {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/btvn-nop/${path.split('/').map(encodeURIComponent).join('/')}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${jwt}` },
  })
  if (!r.ok) throw new Error(`Không tải được ảnh ${path} (${r.status})`)
  const buf = new Uint8Array(await r.arrayBuffer())
  if (buf.length > MAX_BYTES) throw new Error('Có ảnh lớn hơn 5MB — chụp lại hoặc giảm kích thước ảnh.')
  let mt = (r.headers.get('content-type') ?? '').split(';')[0].trim()
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mt)) mt = path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
  return { mt, data: b64(buf) }
}

const cat = (s: unknown, n: number) => (typeof s === 'string' && s.length > n ? s.slice(0, n) + '…' : s)

Deno.serve(async (req) => {
  const h = cors(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h })
  if (req.method !== 'POST') return json({ error: 'Chỉ nhận POST.' }, 405, h)

  const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!jwt) return json({ error: 'Chưa đăng nhập.' }, 401, h)
  let body: any
  try { body = await req.json() } catch { return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400, h) }
  const { buoi_hoc_id, hoc_sinh_id } = body ?? {}
  if (!buoi_hoc_id || !hoc_sinh_id) return json({ error: 'Thiếu buổi hoặc học sinh.' }, 400, h)

  try {
    const d = await rpc(jwt, 'fn_btvn_ai_du_lieu', { p_buoi_hoc_id: buoi_hoc_id, p_hoc_sinh_id: hoc_sinh_id })
    const anh: { id: string; path: string }[] = d.anh ?? []
    const cau: any[] = d.cau ?? []
    if (!anh.length) return json({ error: 'Chưa có ảnh bài làm của em này.' }, 400, h)
    if (!cau.length) return json({ error: 'Buổi này chưa có lưới câu BTVN — mở màn chấm BTVN của buổi một lần để hệ dựng lưới.' }, 400, h)
    if (anh.length > MAX_ANH) return json({ error: `Tối đa ${MAX_ANH} ảnh một lần chấm.` }, 400, h)

    const imgs = await Promise.all(anh.map((a) => taiAnh(jwt, a.path)))
    const content: any[] = []
    anh.forEach((a, i) => {
      content.push({ type: 'text', text: `Ảnh id=${a.id}` })
      content.push({ type: 'image', source: { type: 'base64', media_type: imgs[i].mt, data: imgs[i].data } })
    })
    const dsCau = cau.map((c) => ({
      problem_id: c.problem_id, so: c.so, hinh: c.hinh ? `Bài hình ${c.hinh_nhan ?? ''}`.trim() : undefined,
      loai_cau: c.loai_cau ?? undefined, de_bai: cat(c.de_bai, 1200) ?? undefined,
      dap_an: cat(c.dap_an, 600) ?? undefined, loi_giai: cat(c.loi_giai, 1500) ?? undefined,
    }))
    content.push({ type: 'text', text:
      `Lớp ${d.lop} (khối ${d.khoi}), môn ${d.mon}, BTVN buổi ngày ${d.ngay}.\n` +
      `Danh sách câu của phiếu (problem_id dùng để trả kết quả; "so" là số câu in trên phiếu):\n${JSON.stringify(dsCau)}\n` +
      `Chấm theo quy tắc và trả JSON đúng schema.` })

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })
    const params: any = {
      model: MODEL,
      max_tokens: 16000,
      system: [{ type: 'text', text: QUY_TAC, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content }],
      output_config: { effort: EFFORT, format: { type: 'json_schema', schema: SCHEMA } },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    }
    const res: any = await client.beta.messages.create(params)
    if (res.stop_reason === 'refusal') return json({ error: 'Máy từ chối chấm bài này — chấm tay giúp.' }, 502, h)
    if (res.stop_reason === 'max_tokens') return json({ error: 'Bài quá dài, máy chưa chấm xong — thử chia bớt ảnh.' }, 502, h)
    const txt = (res.content ?? []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
    let out: any
    try { out = JSON.parse(txt) } catch { return json({ error: 'Máy trả kết quả không đọc được — bấm chấm lại.' }, 502, h) }

    const okPid = new Set(cau.map((c) => c.problem_id))
    const okAnh = new Set(anh.map((a) => a.id))
    const ketQua = (out.cau ?? []).filter((c: any) => okPid.has(c.problem_id))
    const thuTu = (out.thu_tu_anh ?? []).filter((id: string) => okAnh.has(id))
    const lanId = await rpc(jwt, 'fn_btvn_ai_ghi', {
      p_buoi_hoc_id: buoi_hoc_id, p_hoc_sinh_id: hoc_sinh_id, p_model: res.model ?? MODEL, p_rule_version: RULE_VERSION,
      p_nhan_xet_chung: out.nhan_xet_chung ?? '', p_thu_tu_anh: thuTu.length === anh.length ? thuTu : null,
      p_cau: ketQua, p_tokens_in: res.usage?.input_tokens ?? null, p_tokens_out: res.usage?.output_tokens ?? null,
    })
    return json({ lan_id: lanId, so_cau: ketQua.length, tong_cau: cau.length }, 200, h)
  } catch (e) {
    console.error(e)
    const msg = e instanceof Anthropic.RateLimitError ? 'Máy chấm đang quá tải — thử lại sau 1 phút.'
      : e instanceof Anthropic.APIError ? `Lỗi máy chấm (${e.status}).`
      : (e as Error).message
    return json({ error: msg }, 500, h)
  }
})
