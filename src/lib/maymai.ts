// Seam MAY MẮN — vòng quay mỗi ngày (CEO 07/09). Kết quả do SERVER quyết (fn_may_man_quay); client chỉ gọi rồi
// chạy animation tới ô tương ứng. Trạng thái/lịch sử: fn_may_man_cua_toi. Tỉ lệ/trần đọc từ may_man_cau_hinh.
import { supabase } from './supabase'

export type MayManLichSu = { ho_ten: string; anh_url: string | null; tien: number; created_at: string; la_toi: boolean }
export type MayManCuaToi = {
  ngay: string; active: boolean
  hom_nay: { tien: number; vuot_tran: boolean; created_at: string } | null   // null = hôm nay chưa quay
  thang: { toi: number; bk: number; tran: number }
  ti_le: { ti_le_10k: number; ti_le_20k: number; ti_le_50k: number }
  lich_su: MayManLichSu[]
}
export type MayManKetQua = { id: string; ngay: string; tien: number; vuot_tran: boolean }

export async function mayManCuaToi(): Promise<MayManCuaToi> {
  const { data, error } = await supabase.rpc('fn_may_man_cua_toi')
  if (error) throw error
  return data as MayManCuaToi
}
export async function mayManQuay(): Promise<MayManKetQua> {
  const { data, error } = await supabase.rpc('fn_may_man_quay')
  if (error) throw error
  return data as MayManKetQua
}
