// ============================================================================
// SERVERLESS (Vercel) — ô HỎI trong Phòng Trưởng bộ môn: vận hành trợ giảng (Thùy 05/11).
// Cùng ranh giới với api/troly.mjs: key AI chỉ ở server (ANTHROPIC_API_KEY / DEEPSEEK_API_KEY /
// MOONSHOT_API_KEY + TROLY_PROVIDER / TROLY_MODEL, tuỳ chọn PHONG_HOI_MODEL); KHÔNG service-role —
// mọi RPC đi bằng token đăng nhập THẬT của người hỏi ⇒ cổng TBM + phạm vi môn chặn ở DB.
// Lõi vòng hỏi: api/_phong_hoi_core.mjs. Log: troly_hoi_dap (boi_canh.phong = 'tbm').
// ============================================================================
import { createClient } from '@supabase/supabase-js'
import { hoiPhong } from './_phong_hoi_core.mjs'

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_ANON = process.env.VITE_SUPABASE_KEY

const homNayVN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!SB_URL || !SB_ANON) return res.status(500).json({ error: 'Server thiếu cấu hình Supabase.' })
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Thiếu đăng nhập — mở lại trang rồi thử lại.' })
  const svc = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: authHeader } } })
  const { data: { user }, error: eUser } = await svc.auth.getUser(authHeader.replace(/^Bearer\s+/i, ''))
  if (eUser || !user) return res.status(401).json({ error: 'Phiên đăng nhập hết hạn — mở lại trang rồi thử lại.' })

  const { phien, cauHoi, lichSu } = req.body ?? {}
  const q = String(cauHoi ?? '').trim()
  if (!q) return res.status(400).json({ error: 'Thiếu câu hỏi.' })
  const ls = Array.isArray(lichSu) ? lichSu.slice(-6) : []

  const goiRpc = async (fn, args) => {
    const { data, error } = await svc.rpc(fn, args)
    if (error) { const e = new Error(error.message); e.code = error.code; throw e }
    return data
  }

  try {
    const ket = await hoiPhong({ goiRpc, cauHoi: q, lichSu: ls, homNay: homNayVN(), env: process.env })
    await svc.from('troly_hoi_dap').insert({
      phien, cau_hoi: q, boi_canh: { phong: 'tbm', pham_vi: ket.phamVi }, lich_su: ls, buoc: ket.buoc,
      trang_thai: 'done', tra_loi: ket.traLoi, usage: ket.usage, model: ket.model, nguoi: user.id, done_at: new Date().toISOString(),
    }).then(() => {}, () => {})
    return res.status(200).json({ traLoi: ket.traLoi, buoc: ket.buoc })
  } catch (e) {
    const thongDiep = e?.message ?? String(e)
    await svc.from('troly_hoi_dap').insert({
      phien, cau_hoi: q, boi_canh: { phong: 'tbm' }, lich_su: ls, trang_thai: 'failed', error: thongDiep, nguoi: user.id, done_at: new Date().toISOString(),
    }).then(() => {}, () => {})
    return res.status(e?.code === '42501' ? 403 : 502).json({ error: thongDiep })
  }
}
