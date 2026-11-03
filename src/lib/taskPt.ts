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
  // mig 202611031700 (Thùy 03/11): hạn tính theo lúc NGƯỜI LÀM báo xong, không theo lúc cấp trên duyệt ⇒ qua_han chỉ còn task chưa báo xong.
  xong_at: string | null; dung_han: boolean | null
  xin_gia_han: { id: string; han_de_xuat: string; ly_do: string; created_at: string } | null   // đề xuất gia hạn đang chờ người giao
}
export type XinGiaHan = {
  id: string; han_cu: string; han_de_xuat: string; ly_do: string; trang_thai: 'cho' | 'dong_y' | 'tu_choi' | 'huy'
  han_chot: string | null; ghi_chu_quyet: string | null; quyet_at: string | null; created_at: string
  nguoi_xin: { ho_ten: string } | null; nguoi_quyet: { ho_ten: string } | null
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
  const { data, error } = await supabase.rpc('fn_task_bang_v2')
  if (error) throw error
  return (data ?? []) as TaskBang[]
}
export async function listXinGiaHan(taskId: string): Promise<XinGiaHan[]> {
  const { data, error } = await supabase.from('task_xin_gia_han')
    .select('id, han_cu, han_de_xuat, ly_do, trang_thai, han_chot, ghi_chu_quyet, quyet_at, created_at, nguoi_xin:nguoi_xin_id(ho_ten), nguoi_quyet:nguoi_quyet_id(ho_ten)')
    .eq('task_id', taskId).order('created_at').limit(50)
  if (error) throw error
  return (data ?? []) as unknown as XinGiaHan[]
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
// Người làm xin gia hạn → người giao đồng ý (có thể chốt hạn khác, đánh cờ trễ) hoặc không (Thùy 03/11).
export const xinGiaHanTask = async (id: string, hanDeXuat: string, lyDo: string): Promise<void> => {
  await goi('fn_task_xin_gia_han', { p_task: id, p_han_de_xuat: hanDeXuat, p_ly_do: lyDo })
}
export const quyetGiaHanTask = async (xinId: string, dongY: boolean, han: string | null, ghiChu: string | null, coTre: boolean): Promise<void> => {
  await goi('fn_task_quyet_gia_han', { p_xin: xinId, p_dong_y: dongY, p_han: han, p_ghi_chu: ghiChu, p_co_tre: coTre })
}

// Kết quả THÁNG của 1 người (trợ lý tra cứu): task có HẠN trong tháng. Tính ở DB (fn_task_ket_qua_thang).
export type KetQuaThang = { soTask: number; soDuyet: number; ketQuaTB: number | null; soGiaHan: number; soCoTre: number }
export async function ketQuaThang(nhanSuId: string, thang: string): Promise<KetQuaThang> {
  const { data, error } = await supabase.rpc('fn_task_ket_qua_thang', { p_ns: nhanSuId, p_thang: `${thang}-01` })
  if (error) throw error
  const r = (Array.isArray(data) ? data[0] : data) as { so_task: number; so_duyet: number; ket_qua_tb: number | null; so_gia_han: number; so_co_tre: number } | undefined
  return { soTask: r?.so_task ?? 0, soDuyet: r?.so_duyet ?? 0, ketQuaTB: r?.ket_qua_tb != null ? Number(r.ket_qua_tb) : null, soGiaHan: r?.so_gia_han ?? 0, soCoTre: r?.so_co_tre ?? 0 }
}

// Thanh % TOÀN TEAM trên dashboard Việc phát triển (mig 202610141231). Công thức ở DB — client chỉ vẽ.
export type TienDoTeam = { soTask: number; soDangMo: number; soDaDuyet: number; soQuaHan: number; pct: number }
export async function tienDoTeam(): Promise<TienDoTeam> {
  const { data, error } = await supabase.rpc('fn_task_tien_do_team')
  if (error) throw error
  const r = (Array.isArray(data) ? data[0] : data) as { so_task: number; so_dang_mo: number; so_da_duyet: number; so_qua_han: number; pct: number } | undefined
  return { soTask: r?.so_task ?? 0, soDangMo: r?.so_dang_mo ?? 0, soDaDuyet: r?.so_da_duyet ?? 0, soQuaHan: r?.so_qua_han ?? 0, pct: r?.pct ?? 0 }
}
