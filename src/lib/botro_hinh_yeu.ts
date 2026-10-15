// HÌNH YẾU THEO MÔ HÌNH (Thùy 14/10, bước 1): bổ trợ yếu chỉ đọc số đo theo MÃ DẠNG nên không thấy Hình mô hình.
// Danh sách (HS × bài toán Hình đang yếu), gắn tên mô hình; trợ giảng dạy trên giấy rồi bấm "đã dạy".
// Mọi số + trạng thái tính ở DB (fn_hinh_yeu_theo_mo_hinh · fn_hinh_yeu_danh_dau_day, mig 202610142151 — §2.0); file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'

export type HinhYeuRow = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null; co_case_yeu: boolean
  hinh_baitoan_id: string; bai_ma: string | null; phat_bieu: string
  mo_hinh_id: string; mo_hinh: string
  score: number; n: number; tin: 'cao' | 'tb' | 'thap'; cuoi_do: string | null
  da_day: boolean; da_day_at: string | null; da_day_boi: string | null
  yeu_sau_day: boolean // đã dạy rồi, SAU đó đo lại vẫn yếu
  trong_case: boolean  // bài này đã là một dạng của case bổ trợ yếu đang mở (bước 2, 14/10)
}

// chiCuaToi = chỉ HS thuộc lớp mình được phân công (app TA); mặc định cả trường (quản trị).
export async function hinhYeuTheoMoHinh(chiCuaToi = false): Promise<HinhYeuRow[]> {
  const { data, error } = await supabase.rpc('fn_hinh_yeu_theo_mo_hinh', { p_chi_cua_toi: chiCuaToi })
  if (error) throw error
  return (data as HinhYeuRow[]) ?? []
}

export type KetQuaDanhDau = { da_day: boolean; da_day_at: string; da_day_boi: string | null }
export async function danhDauDaDay(hocSinhId: string, baitoanId: string, daDay: boolean): Promise<KetQuaDanhDau> {
  const { data, error } = await supabase.rpc('fn_hinh_yeu_danh_dau_day', { p_hoc_sinh: hocSinhId, p_baitoan: baitoanId, p_da_day: daDay })
  if (error) throw error
  return data as KetQuaDanhDau
}

// Bước 2 (14/10): đưa bài vào case bổ trợ yếu ĐANG MỞ của em — dạng này học/chấm trên GIẤY. Em chưa có case ⇒ phải duyệt ở "Duyệt bổ trợ" (trần 70/20).
export type KetQuaDuaVaoCase = { ok: boolean; ly_do?: 'chua_co_case'; moi?: boolean; case_id?: string }
export async function duaVaoCase(hocSinhId: string, baitoanId: string): Promise<KetQuaDuaVaoCase> {
  const { data, error } = await supabase.rpc('fn_hinh_yeu_dua_vao_case', { p_hoc_sinh: hocSinhId, p_baitoan: baitoanId })
  if (error) throw error
  return data as KetQuaDuaVaoCase
}

export const TIN_TEN: Record<HinhYeuRow['tin'], string> = { cao: 'đo nhiều', tb: 'đo vừa', thap: 'mới đo ít' }
