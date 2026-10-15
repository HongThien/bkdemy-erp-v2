// Edge Function `dang-ky-test` (project Supabase ERP) — cửa DUY NHẤT web bkacademy.edu.vn chạm ERP.
// spec-dang-ky-test.md · mig 202610151355.
//   GET  → dữ liệu form (lớp/môn/thời lượng/trường/lịch đang mở) — KHÔNG có dữ liệu cá nhân.
//   POST → ghi đăng ký (fn_ts_dang_ky_test_web: kiểm hợp lệ + chống spam theo IP/SĐT ở DB).
// Web chỉ biết URL này, không giữ key ERP nào. Service role chỉ nằm trong biến môi trường của function.
// Deploy: dán file này vào Dashboard → Edge Functions → tên `dang-ky-test`, TẮT "Verify JWT"
//   (hoặc `supabase functions deploy dang-ky-test --no-verify-jwt`).
// Một file, không import — để dán thẳng vào Dashboard được.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const ORIGIN_OK = [
  /^https:\/\/(www\.)?bkacademy\.edu\.vn$/,
  /^https:\/\/bkdemy-web[a-z0-9-]*\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
]

function cors(origin: string | null): Record<string, string> {
  const ok = origin && ORIGIN_OK.some((r) => r.test(origin))
  return {
    'Access-Control-Allow-Origin': ok ? origin! : 'https://bkacademy.edu.vn',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Vary': 'Origin',
  }
}

async function rpc(fn: string, body: unknown): Promise<{ ok: boolean; status: number; data: any }> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify(body),
  })
  const text = await r.text()
  let data: any = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { ok: r.ok, status: r.status, data }
}

const json = (data: unknown, status: number, h: Record<string, string>) =>
  new Response(JSON.stringify(data), { status, headers: { ...h, 'Content-Type': 'application/json; charset=utf-8' } })

Deno.serve(async (req) => {
  const h = cors(req.headers.get('origin'))
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h })

  if (req.method === 'GET') {
    const r = await rpc('fn_ts_dk_form', { p_so_ngay: 14, p_som_phut: 60 })
    if (!r.ok) return json({ error: 'Không tải được lịch test, bố mẹ thử lại sau ít phút.' }, 502, h)
    // Bỏ phần nội bộ (lớp×môn chưa khai thời lượng) trước khi ra ngoài
    const { thieu_thoi_luong: _bo, ...congKhai } = r.data ?? {}
    return json(congKhai, 200, { ...h, 'Cache-Control': 'public, max-age=60' })
  }

  if (req.method === 'POST') {
    let body: any
    try { body = await req.json() } catch { return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400, h) }
    // Bẫy bot: ô ẩn `website` người thật không thấy nên không điền. Bot điền ⇒ báo thành công giả, không ghi.
    if (body?.website) return json({ ok: true, mon: [] }, 200, h)
    const p = {
      ho_ten_hs: String(body?.ho_ten_hs ?? '').slice(0, 100),
      sdt_ph: String(body?.sdt_ph ?? '').slice(0, 20),
      lop: String(body?.lop ?? ''),
      truong: String(body?.truong ?? '').slice(0, 150),
      truong_tu_go: body?.truong_tu_go === true,
      mon: Array.isArray(body?.mon) ? body.mon.slice(0, 4).map((m: any) => ({
        mon: String(m?.mon ?? ''), khung_id: String(m?.khung_id ?? ''), ngay: String(m?.ngay ?? ''), gio_bat_dau: String(m?.gio_bat_dau ?? ''),
      })) : [],
    }
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null
    const r = await rpc('fn_ts_dang_ky_test_web', { p, p_ip: ip })
    if (r.ok) return json({ ok: true, ho_ten_hs: r.data?.ho_ten_hs, mon: r.data?.mon ?? [] }, 200, h)
    // Lỗi nghiệp vụ (raise exception ở DB, mã P0001) = câu đã viết cho PH đọc. Lỗi khác ⇒ câu chung.
    const loiPH = r.data?.code === 'P0001' && typeof r.data?.message === 'string'
    console.error('dang-ky-test', r.status, JSON.stringify(r.data))
    return json({ error: loiPH ? r.data.message : 'Chưa gửi được, bố mẹ thử lại hoặc nhắn Zalo cho trung tâm giúp con nhé.' }, loiPH ? 400 : 502, h)
  }

  return json({ error: 'Method not allowed' }, 405, h)
})
