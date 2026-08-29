// Hỏi–đáp nhân sự — client CHỈ ghi câu hỏi + đọc kết quả. Người trả lời là bot
// Claude Code chạy máy local (scripts/hoidap/bot.mjs): nó đọc repo nên trả lời được
// "vì sao hệ thống làm thế này" — loại câu Trợ lý (đọc bảng sạch số liệu) không với tới.
// RLS: mọi thành viên ĐỌC được mọi câu (tri thức chung — một người hỏi, cả đội đỡ hỏi
// lại), nhưng chỉ INSERT được câu mang tên mình; update/delete không cấp cho client
// (câu trả lời chỉ đến từ bot — xem migration 202608291119).
import { supabase } from './supabase'

export type HoiDapTrangThai = 'pending' | 'processing' | 'done' | 'failed'
export type HoiDap = {
  id: string
  nguoi: string
  cau_hoi: string
  trang_thai: HoiDapTrangThai
  tra_loi: string | null
  error: string | null
  created_at: string
  done_at: string | null
}

export async function guiCauHoi(cauHoi: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Chưa đăng nhập.')
  const { error } = await supabase.from('hoi_dap_nhan_su').insert({ nguoi: user.id, cau_hoi: cauHoi.trim() })
  if (error) throw error
}

// Mới nhất lên đầu — màn hỏi–đáp là dòng thời gian, câu vừa hỏi phải thấy ngay.
export async function listHoiDap(limit = 50): Promise<HoiDap[]> {
  const { data, error } = await supabase.from('hoi_dap_nhan_su')
    .select('id, nguoi, cau_hoi, trang_thai, tra_loi, error, created_at, done_at')
    .order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as HoiDap[]
}

// Heartbeat bot: alive_at quá 10' = bot chết / mất mạng / CLI hết login — UI phải nói
// thẳng "bot mất liên lạc" thay vì để người hỏi nhìn 'pending' chờ mù (chết-im-lặng là
// chế độ lỗi mặc định của daemon local; heartbeat là cách duy nhất người dùng biết).
export const BOT_SONG_TRONG_MS = 10 * 60_000
export async function getBotAliveAt(): Promise<string | null> {
  const { data, error } = await supabase.from('hoi_dap_bot').select('alive_at').eq('id', 1).maybeSingle()
  if (error) return null // bảng chưa có dòng / lỗi mạng → coi như chưa biết, UI hiện "chưa rõ"
  return data?.alive_at ?? null
}
