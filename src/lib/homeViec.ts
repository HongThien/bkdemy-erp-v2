// Nhắc việc CÁ NHÂN trên Trang chính ERP (mig 202610140032). Sổ riêng của từng người, tick tay, không liên quan
// hệ thống; "xong" là 1 dòng theo (việc, ngày VN) nên qua ngày mới tự về chưa xong — không có job reset.
// CRUD dòng đơn qua PostgREST; RLS chỉ cho chính chủ (current_nhan_su_id()).
import { supabase } from './supabase'
import { homNayVN } from './tuan'

export type NhacViec = { id: string; noi_dung: string; thu_tu: number; xong: boolean }

export async function listNhacViec(): Promise<NhacViec[]> {
  const ngay = homNayVN()
  const [vs, xs] = await Promise.all([
    supabase.from('nhan_su_nhac_viec').select('id, noi_dung, thu_tu').order('thu_tu').order('created_at').limit(200),
    supabase.from('nhan_su_nhac_viec_xong').select('nhac_viec_id').eq('ngay', ngay).limit(500),
  ])
  if (vs.error) throw vs.error
  if (xs.error) throw xs.error
  const xong = new Set((xs.data ?? []).map((r) => (r as { nhac_viec_id: string }).nhac_viec_id))
  return ((vs.data ?? []) as Omit<NhacViec, 'xong'>[]).map((v) => ({ ...v, xong: xong.has(v.id) }))
}

/** Thêm 1 việc; trả dòng vừa tạo để cha vá tại chỗ. `thuTu` = cuối danh sách. */
export async function themNhacViec(nhanSuId: string, noiDung: string, thuTu: number): Promise<NhacViec> {
  const { data, error } = await supabase.from('nhan_su_nhac_viec')
    .insert({ nhan_su_id: nhanSuId, noi_dung: noiDung.trim(), thu_tu: thuTu })
    .select('id, noi_dung, thu_tu').single()
  if (error) throw error
  return { ...(data as Omit<NhacViec, 'xong'>), xong: false }
}

export async function xoaNhacViec(id: string): Promise<void> {
  const { error } = await supabase.from('nhan_su_nhac_viec').delete().eq('id', id)
  if (error) throw error
}

/** Tick / bỏ tick CHO HÔM NAY: xong = có dòng (việc, hôm nay). Idempotent (upsert / delete). */
export async function datXongHomNay(id: string, xong: boolean): Promise<void> {
  const ngay = homNayVN()
  if (xong) {
    const { error } = await supabase.from('nhan_su_nhac_viec_xong').upsert({ nhac_viec_id: id, ngay }, { onConflict: 'nhac_viec_id,ngay' })
    if (error) throw error
  } else {
    const { error } = await supabase.from('nhan_su_nhac_viec_xong').delete().eq('nhac_viec_id', id).eq('ngay', ngay)
    if (error) throw error
  }
}
