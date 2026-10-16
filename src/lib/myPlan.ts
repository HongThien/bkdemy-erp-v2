// MyPlan — "Kế hoạch của tôi" (Thùy 16/10, mig 202610161600): thẻ việc / ý tưởng TỰ GHI cho mình, chỉ chính chủ thấy
// (RLS current_nhan_su_id()). CRUD dòng đơn qua PostgREST; giao thẻ thành task/order qua RPC (dùng lại fn_task_giao /
// fn_order_tao). Không xoá cứng: "Bỏ" = trang_thai 'bo' (khôi phục được). xong_at + lịch sử do trigger ở DB, app không ghi.
import { supabase } from './supabase'

export type TrangThaiPlan = 'y_tuong' | 'se_lam' | 'dang_lam' | 'xong' | 'bo'
export type ThePlan = {
  id: string; noi_dung: string; ghi_chu: string | null; trang_thai: TrangThaiPlan
  han: string | null; thu_tu: number; xong_at: string | null; chuyen_thanh: string | null; created_at: string
}
export const COT_PLAN: { id: Exclude<TrangThaiPlan, 'bo'>; ten: string; icon: string; goiY: string }[] = [
  { id: 'y_tuong', ten: 'Ý tưởng · để sau', icon: '💡', goiY: 'Ghi nhanh mọi thứ chợt nghĩ ra — phân loại sau.' },
  { id: 'se_lam', ten: 'Sẽ làm', icon: '📌', goiY: 'Đã quyết làm. Có hạn thì ghi để được nhắc.' },
  { id: 'dang_lam', ten: 'Đang làm', icon: '🔨', goiY: 'Đang làm dở — càng ít thẻ ở đây càng tốt.' },
  { id: 'xong', ten: 'Đã xong', icon: '✅', goiY: 'Nhật ký những gì đã làm, theo tuần.' },
]
const COT = 'id, noi_dung, ghi_chu, trang_thai, han, thu_tu, xong_at, chuyen_thanh, created_at'

/** Thẻ đang mở (ý tưởng · sẽ làm · đang làm) + 300 thẻ xong gần nhất. Thẻ đã bỏ đọc riêng khi mở mục "Đã bỏ". */
export async function listPlan(): Promise<ThePlan[]> {
  const [mo, xong] = await Promise.all([
    supabase.from('nhan_su_plan').select(COT).in('trang_thai', ['y_tuong', 'se_lam', 'dang_lam']).order('thu_tu').order('created_at').limit(1000),
    supabase.from('nhan_su_plan').select(COT).eq('trang_thai', 'xong').order('xong_at', { ascending: false }).limit(300),
  ])
  if (mo.error) throw mo.error
  if (xong.error) throw xong.error
  return [...(mo.data ?? []), ...(xong.data ?? [])] as ThePlan[]
}
export async function listPlanBo(): Promise<ThePlan[]> {
  const { data, error } = await supabase.from('nhan_su_plan').select(COT).eq('trang_thai', 'bo').order('updated_at', { ascending: false }).limit(200)
  if (error) throw error
  return (data ?? []) as ThePlan[]
}

/** Thêm 1 thẻ (chủ = người đang đăng nhập, DB tự gán). Trả dòng vừa tạo để màn vá tại chỗ. */
export async function themThePlan(noiDung: string, trangThai: TrangThaiPlan, thuTu: number, han: string | null = null): Promise<ThePlan> {
  const { data, error } = await supabase.from('nhan_su_plan')
    .insert({ noi_dung: noiDung.trim(), trang_thai: trangThai, thu_tu: thuTu, han }).select(COT).single()
  if (error) throw error
  return data as ThePlan
}

/** Sửa 1 thẻ (nội dung · ghi chú · hạn · trạng thái · thứ tự). Trả dòng sau khi DB ghi (xong_at do trigger đặt). */
export async function suaThePlan(id: string, p: Partial<Pick<ThePlan, 'noi_dung' | 'ghi_chu' | 'trang_thai' | 'han' | 'thu_tu'>>): Promise<ThePlan> {
  const { data, error } = await supabase.from('nhan_su_plan').update(p).eq('id', id).select(COT).single()
  if (error) throw error
  return data as ThePlan
}

/** Giao thẻ thành task cho cấp dưới (cùng luật + cùng thư báo với Việc phát triển). Thẻ ⇒ Đã xong, ghi liên kết. */
export async function giaoTaskTuThe(id: string, nguoiLam: string, han: string): Promise<void> {
  const { error } = await supabase.rpc('fn_plan_giao_task', { p_plan: id, p_nguoi_lam: nguoiLam, p_han: han })
  if (error) throw error
}
/** Giao thẻ thành order cho bất kỳ ai. Thẻ ⇒ Đã xong, ghi liên kết. */
export async function datOrderTuThe(id: string, nguoiNhan: string, han: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_plan_dat_order', { p_plan: id, p_nguoi_nhan: nguoiNhan, p_han: han })
  if (error) throw error
}
export const nhanChuyenThanh = (s: string | null) => (s?.startsWith('task:') ? '↗ Đã giao thành task' : s?.startsWith('order:') ? '↗ Đã đặt thành order' : null)
/** Đọc lại 1 thẻ (sau khi RPC giao đi — lấy trạng thái + liên kết DB vừa ghi để vá tại chỗ). */
export async function docThePlan(id: string): Promise<ThePlan> {
  const { data, error } = await supabase.from('nhan_su_plan').select(COT).eq('id', id).single()
  if (error) throw error
  return data as ThePlan
}
