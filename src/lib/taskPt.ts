// TASK PHÁT TRIỂN (mig 202610140118) — hệ mới, làm lại từ đầu (Thùy 14/10):
//   họp tuần → cấp trên GIAO task cho CẤP DƯỚI (theo sơ đồ tổ chức) → người làm cập nhật / báo xong →
//   ĐẾN HẠN cấp trên đánh giá: duyệt (ghi % kết quả) hoặc gia hạn / huỷ (có thể đánh cờ trễ deadline = 1 gậy).
// Mọi ghi đi qua fn_task_* (quyền + log + hòm thư cùng transaction). Client chỉ gọi + vẽ.
import { supabase } from './supabase'

export type TrangThaiTask = 'dang_lam' | 'cho_duyet' | 'da_duyet' | 'huy'
export type TaskBang = {
  id: string; tieu_de: string; mo_ta: string | null; trang_thai: TrangThaiTask
  han: string; han_goc: string; so_lan_gia_han: number
  den_han: boolean; qua_han: boolean            // đến hạn ⇒ cấp trên cần đánh giá
  nguoi_lam_id: string; nguoi_lam_ten: string; nguoi_giao_id: string; nguoi_giao_ten: string
  tien_do_bao_cao: number | null; ket_qua_pct: number | null; nhan_xet: string | null
  cap_nhat_cuoi_at: string | null; created_at: string; dong_at: string | null
}
export type TaskLog = {
  id: string; nguoi_id: string; hanh_dong: 'giao' | 'cap_nhat' | 'bao_xong' | 'duyet' | 'gia_han' | 'huy'
  ghi_chu: string | null; pct: number | null; han_cu: string | null; han_moi: string | null; co_tre: boolean | null
  created_at: string; nguoi: { ho_ten: string } | null
}

export const TEN_TASK: Record<TrangThaiTask, string> = {
  dang_lam: 'Đang làm', cho_duyet: 'Chờ duyệt', da_duyet: 'Đã duyệt', huy: 'Đã huỷ',
}
export const dangMoTask = (t: TrangThaiTask) => t === 'dang_lam' || t === 'cho_duyet'

export async function listTaskBang(): Promise<TaskBang[]> {
  const { data, error } = await supabase.rpc('fn_task_bang')
  if (error) throw error
  return (data ?? []) as TaskBang[]
}
export async function listCapDuoi(): Promise<{ nhan_su_id: string; ho_ten: string }[]> {
  const { data, error } = await supabase.rpc('fn_task_cap_duoi')
  if (error) throw error
  return (data ?? []) as { nhan_su_id: string; ho_ten: string }[]
}
export async function listTaskLog(taskId: string): Promise<TaskLog[]> {
  const { data, error } = await supabase.from('task_phat_trien_log')
    .select('id, nguoi_id, hanh_dong, ghi_chu, pct, han_cu, han_moi, co_tre, created_at, nguoi:nguoi_id(ho_ten)')
    .eq('task_id', taskId).order('created_at').limit(200)
  if (error) throw error
  return (data ?? []) as unknown as TaskLog[]
}

const goi = async (fn: string, args: Record<string, unknown>) => {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data
}
export const giaoTask = async (nguoiLam: string, tieuDe: string, moTa: string | null, han: string): Promise<string> =>
  (await goi('fn_task_giao', { p_nguoi_lam: nguoiLam, p_tieu_de: tieuDe, p_mo_ta: moTa, p_han: han })) as string
export const capNhatTask = async (id: string, ghiChu: string | null, pct: number | null): Promise<void> => {
  await goi('fn_task_cap_nhat', { p_task: id, p_ghi_chu: ghiChu, p_pct: pct })
}
export const baoXongTask = async (id: string, ghiChu: string | null): Promise<void> => { await goi('fn_task_bao_xong', { p_task: id, p_ghi_chu: ghiChu }) }
export const duyetTask = async (id: string, pct: number, nhanXet: string | null): Promise<void> => { await goi('fn_task_duyet', { p_task: id, p_pct: pct, p_nhan_xet: nhanXet }) }
export const giaHanTask = async (id: string, hanMoi: string, lyDo: string, coTre: boolean): Promise<void> => {
  await goi('fn_task_gia_han', { p_task: id, p_han_moi: hanMoi, p_ly_do: lyDo, p_co_tre: coTre })
}
export const huyTask = async (id: string, lyDo: string, coTre: boolean): Promise<void> => { await goi('fn_task_huy', { p_task: id, p_ly_do: lyDo, p_co_tre: coTre }) }

// Kết quả THÁNG của 1 người (trợ lý tra cứu): task có HẠN trong tháng. Tính ở DB (fn_task_ket_qua_thang).
export type KetQuaThang = { soTask: number; soDuyet: number; ketQuaTB: number | null; soGiaHan: number; soCoTre: number }
export async function ketQuaThang(nhanSuId: string, thang: string): Promise<KetQuaThang> {
  const { data, error } = await supabase.rpc('fn_task_ket_qua_thang', { p_ns: nhanSuId, p_thang: `${thang}-01` })
  if (error) throw error
  const r = (Array.isArray(data) ? data[0] : data) as { so_task: number; so_duyet: number; ket_qua_tb: number | null; so_gia_han: number; so_co_tre: number } | undefined
  return { soTask: r?.so_task ?? 0, soDuyet: r?.so_duyet ?? 0, ketQuaTB: r?.ket_qua_tb != null ? Number(r.ket_qua_tb) : null, soGiaHan: r?.so_gia_han ?? 0, soCoTre: r?.so_co_tre ?? 0 }
}
