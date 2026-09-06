// Seam CHẤM CÔNG TA (CEO 07/09): mặc định CÓ MẶT, lead chỉ ghi ngoại lệ "TA X vắng buổi Y" (đã
// xin phép). Không check-in, không duyệt. Dòng ta_vang chỉ ra đời khi vắng thật (§1.5); bỏ dấu
// vắng = xoá dòng (đây là cờ, không phải ledger tiền). Tiến trình trừ buổi vắng.
import { supabase } from './supabase'
import { myNhanSuId } from './giaoviec'

export type BuoiChamCong = { buoi_id: string; ten_lop: string; ngay: string; gio_bat_dau: string | null; vang: boolean; ly_do: string | null }

export async function listBuoiChamCong(nhanSuId: string, ym: string): Promise<BuoiChamCong[]> {
  const { data, error } = await supabase.rpc('fn_ta_buoi_thang', { p_ns: nhanSuId, p_ym: ym })
  if (error) throw error
  return (data ?? []) as BuoiChamCong[]
}
export async function ghiVang(nhanSuId: string, buoiId: string, lyDo?: string): Promise<void> {
  const me = await myNhanSuId()
  const { error } = await supabase.from('ta_vang')
    .upsert({ buoi_hoc_id: buoiId, nhan_su_id: nhanSuId, ly_do: lyDo?.trim() || null, nguoi_ghi: me }, { onConflict: 'buoi_hoc_id,nhan_su_id' })
  if (error) throw error
}
export async function boVang(nhanSuId: string, buoiId: string): Promise<void> {
  const { error } = await supabase.from('ta_vang').delete().match({ buoi_hoc_id: buoiId, nhan_su_id: nhanSuId })
  if (error) throw error
}
