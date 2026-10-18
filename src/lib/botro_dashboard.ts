// DASHBOARD BỔ TRỢ theo TUẦN (Thùy 13/10): mỗi tuần "chốt" bao nhiêu ca yếu · bù · đuổi, thực tế đã chạy bao nhiêu.
// Đơn vị = 1 lượt học sinh trong 1 ca. Mọi phép đếm + phân loại trạng thái ở DB (fn_bo_tro_dashboard_tuan, mig 202610131134 — §2.0);
// file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'

export type LoaiBT = 'bo_tro_yeu' | 'bu' | 'bo_tro_duoi' | 'bo_tro_hinh'
// go = đã gỡ khỏi lịch (đổi lịch) — KHÔNG tính vào "chốt"
export type TtLuot = 'hoan_tat' | 'dang_do' | 'vang' | 'khong_dien_ra' | 'qua_han' | 'cho' | 'go'
export type SoLoai = { chot: number; da_chay: number; hoan_tat: number; dang_do: number; vang: number; khong_dien_ra: number; qua_han: number; cho: number; go: number }
export type LuotBT = {
  loai: LoaiBT; tt: TtLuot; buoi_id: string; ngay: string; gio_bat_dau: string | null
  ho_ten: string; ma_hs: string | null; lop: string | null; nguoi: string | null; ly_do: string | null
}
export type TuanBT = { tu: string; den: string; dang_chay: boolean; tuong_lai: boolean; tong: { chot: number; da_chay: number }; loai: Record<LoaiBT, SoLoai>; ds: LuotBT[] }

// p_den = một ngày bất kỳ thuộc tuần CUỐI muốn xem (null = tuần này); trả `soTuan` tuần, mới nhất trước.
export async function dashboardBoTroTuan(den?: string | null, soTuan = 3): Promise<TuanBT[]> {
  const { data, error } = await supabase.rpc('fn_bo_tro_dashboard_tuan', { p_den: den ?? null, p_so_tuan: soTuan })
  if (error) throw error
  return (data as TuanBT[]) ?? []
}
