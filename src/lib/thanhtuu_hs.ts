// Seam THÀNH TỰU — HS xem giải thưởng đã CÔNG BỐ của mình. `giai_thuong` staff-only (schema.md
// §quyền), nên đọc qua RPC security definer (fn_hs_thanh_tuu_cua_toi, mig 202609112330).
// Sau này thêm huy hiệu/mốc học tập thì gộp vào cùng 1 hàm hoặc thêm RPC riêng.
import { supabase } from './supabase'
import type { LoaiGiai } from './traogiai'
import { LOAI_GIAI_TEN } from './traogiai'

export type ThanhTuuHS = {
  id: string
  thang: string      // 'YYYY-MM'
  loai_giai: LoaiGiai
  lop_id: string | null
  ten_lop: string | null
  mon: string
  cong_bo_at: string
}

export async function thanhTuuCuaToi(): Promise<ThanhTuuHS[]> {
  const { data, error } = await supabase.rpc('fn_hs_thanh_tuu_cua_toi')
  if (error) throw error
  return (data ?? []) as ThanhTuuHS[]
}

// Icon + màu theo loại giải — dùng lại thứ tự và tên từ traogiai.ts để không lệch nhãn.
export const THANH_TUU_ICON: Record<LoaiGiai, string> = { xuat_sac: '🏆', tien_bo: '🚀', cham_chi: '🌟' }
export const THANH_TUU_MAU: Record<LoaiGiai, { nen: string; chu: string; vien: string }> = {
  xuat_sac: { nen: 'linear-gradient(135deg,#fff8e0,#ffe9a8)', chu: '#b3800c', vien: '#ffd76a' },
  tien_bo:  { nen: 'linear-gradient(135deg,#e7f0ff,#c9dcff)', chu: '#1e4dc0', vien: '#8fb1f0' },
  cham_chi: { nen: 'linear-gradient(135deg,#eaf9ee,#c9edd3)', chu: '#1f7a3a', vien: '#8fd2a1' },
}
export { LOAI_GIAI_TEN }
