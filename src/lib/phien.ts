// PHIÊN CLAUDE của trưởng khối (spec-phong-truong-khoi.md · mig 202611011822).
// Client chỉ: mở phiên / gửi tin / đóng / mở lại qua RPC, và ĐỌC tin để render. Người trả lời là bot Claude Code
// chạy máy Thùy (scripts/phien/bot.mjs) — chữ Claude viết được bot cập nhật dần vào 1 tin vai 'claude'.
// Mọi đếm/gộp (danh sách phiên, đang chạy, tin cuối) ở fn_phien_ds; quyền "trưởng khối trở lên" ở DB.
import { supabase } from './supabase'

export type PhienLoai = 'ban_do' | 'ly_thuyet' | 'nhap_kho' | 'bao_sai' | 'giai_bai'
export type PhienTrangThai = 'mo' | 'dang_dong' | 'dong'
// Khớp CHECK claude_phien_loai_ck. `mo` = đã bật trong bản thử (DB: _phien_loai_dang_mo) — chỉ để ẩn/hiện nút,
// DB vẫn là người chặn thật.
export const PHIEN_LOAI: { id: PhienLoai; ten: string; mo_ta: string; mo: boolean }[] = [
  { id: 'ban_do', ten: '🗺 Bản đồ', mo_ta: 'Phase 1 — Claude dựng nháp, sửa theo lệnh; trưởng khối duyệt các dạng', mo: true },
  { id: 'ly_thuyet', ten: '📘 Lý thuyết dạng', mo_ta: 'Phase 2 — lý thuyết · ví dụ · mô tả nhận biết từng dạng', mo: false },
  { id: 'nhap_kho', ten: '📥 Nhập kho & phân dạng', mo_ta: 'Phase 3 — đẩy câu vào kho, xử lý câu chưa phân được dạng', mo: false },
  { id: 'bao_sai', ten: '⚑ Câu bị báo sai', mo_ta: 'Xử lý câu trợ giảng báo sai', mo: false },
  { id: 'giai_bai', ten: '✍️ Giải bài', mo_ta: 'Thùy phát động', mo: false },
]
export const tenLoai = (l: PhienLoai) => PHIEN_LOAI.find((x) => x.id === l)?.ten ?? l

export type PhienPhamVi = { mon: string; khoi: string; co_ban_do: boolean }
export type PhienItem = {
  id: string; loai: PhienLoai; mon: string; khoi: string; tieu_de: string; trang_thai: PhienTrangThai
  created_at: string; updated_at: string; nguoi_mo_ten: string | null; cua_toi: boolean
  so_tin: number; dang_chay: boolean; tin_cuoi: { vai: TinVai; noi_dung: string; at: string } | null
}
export type TinVai = 'nguoi' | 'claude' | 'he_thong'
export type TinTrangThai = 'cho' | 'dang_xu' | 'xong' | 'loi' | 'dang_viet' | 'dung'
export type PhienTin = {
  id: number; phien_id: string; vai: TinVai; nguoi_gui: string | null; noi_dung: string
  trang_thai: TinTrangThai; loi: string | null; tra_loi_cho: number | null; created_at: string; updated_at: string
}
export type PhienGhi = { id: number; viec: string; tham_so: Record<string, unknown>; ket_qua: Record<string, unknown>; at: string }
export type PhienBot = { may: string; alive_at: string; trang_thai: 'chay' | 'nghi_han_muc' | 'dung'; ghi_chu: string; nghi_toi: string | null }

export const BOT_SONG_TRONG_MS = 3 * 60_000   // heartbeat 60s ⇒ quá 3 phút không thấy = mất liên lạc

export async function getPhamVi(): Promise<PhienPhamVi[]> {
  const { data, error } = await supabase.rpc('fn_phien_pham_vi')
  if (error) throw error
  return (data ?? []) as PhienPhamVi[]
}

export async function listPhien(): Promise<PhienItem[]> {
  const { data, error } = await supabase.rpc('fn_phien_ds', { p_gioi_han: 100 })
  if (error) throw error
  return (data ?? []) as PhienItem[]
}

export async function moPhien(loai: PhienLoai, mon: string, khoi: string, tieuDe?: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_phien_mo', { p_loai: loai, p_mon: mon, p_khoi: khoi, p_tieu_de: tieuDe?.trim() || null })
  if (error) throw error
  return data as string
}

const COT_TIN = 'id, phien_id, vai, nguoi_gui, noi_dung, trang_thai, loi, tra_loi_cho, created_at, updated_at'
export async function listTin(phienId: string): Promise<PhienTin[]> {
  const { data, error } = await supabase.from('claude_phien_tin').select(COT_TIN).eq('phien_id', phienId).order('id').limit(1000)
  if (error) throw error
  return (data ?? []) as PhienTin[]
}

// Trả về tin vừa ghi để màn VÁ TẠI CHỖ (không reload cả danh sách — CLAUDE.md §2 React).
export async function guiTin(phienId: string, noiDung: string): Promise<PhienTin> {
  const { data: id, error } = await supabase.rpc('fn_phien_gui', { p_phien: phienId, p_noi_dung: noiDung })
  if (error) throw error
  const { data, error: e2 } = await supabase.from('claude_phien_tin').select(COT_TIN).eq('id', id).single()
  if (e2) throw e2
  return data as PhienTin
}

export async function dongPhien(phienId: string): Promise<PhienTrangThai> {
  const { data, error } = await supabase.rpc('fn_phien_dong', { p_phien: phienId })
  if (error) throw error
  return data as PhienTrangThai
}

export async function moLaiPhien(phienId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_phien_mo_lai', { p_phien: phienId })
  if (error) throw error
}

export async function listGhi(phienId: string): Promise<PhienGhi[]> {
  const { data, error } = await supabase.from('claude_phien_ghi').select('id, viec, tham_so, ket_qua, at').eq('phien_id', phienId).order('id').limit(500)
  if (error) throw error
  return (data ?? []) as PhienGhi[]
}

export async function getBot(): Promise<PhienBot | null> {
  const { data, error } = await supabase.from('claude_phien_bot').select('may, alive_at, trang_thai, ghi_chu, nghi_toi').eq('id', 1).maybeSingle()
  if (error) throw error
  return (data ?? null) as PhienBot | null
}

export async function getPhien(phienId: string): Promise<{ trang_thai: PhienTrangThai } | null> {
  const { data, error } = await supabase.from('claude_phien').select('trang_thai').eq('id', phienId).maybeSingle()
  if (error) throw error
  return (data ?? null) as { trang_thai: PhienTrangThai } | null
}
