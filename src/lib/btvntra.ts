// Bài BTVN ẢNH đã trả — phía HỌC SINH (app HS · Hòm thư; CEO chốt 29/09). Thư "BTVN đã chấm" là SUY RA
// từ btvn_nop.tra_at (không có dòng thong_bao_hs). App HS không đọc được bảng btvn_nop (RLS chỉ nhân sự)
// ⇒ chỉ đi qua RPC security-definer lọc theo em đang đăng nhập (mig 202609291943). Ảnh: signed URL từ
// bucket private, cần policy "btvn_nop_hs_xem_bai_tra" (scripts/sql_btvn_tra_hs_storage.sql).
import { supabase } from './supabase'
import { BTVN_NOP_BUCKET } from './btvnnop'

export type BaiTraHS = {
  buoi_hoc_id: string
  ngay: string
  mon: string | null
  ten_lop: string | null
  nop_at: string
  tra_at: string
  da_xem: boolean
  so_cau: number
  so_dung: number
  so_chua_tron: number
  so_sai: number
}

export type CauTraHS = { problem_no: number; result: 'correct' | 'partial' | 'wrong'; ma_dang: string | null; ten_dang: string | null }

export type ChiTietBaiTraHS = Omit<BaiTraHS, 'da_xem'> & {
  trang_thai_nop: string | null
  thai_do: string | null
  nhan_xet: string[]
  cau: CauTraHS[]
  anh: string[] // path trong bucket — ký URL lúc xem
}

export async function listBaiTraCuaToi(): Promise<BaiTraHS[]> {
  const { data, error } = await supabase.rpc('fn_btvn_tra_cua_toi')
  if (error) throw error
  return (data ?? []) as BaiTraHS[]
}

// null = không phải bài của em / chưa trả.
export async function chiTietBaiTra(buoiHocId: string): Promise<ChiTietBaiTraHS | null> {
  const { data, error } = await supabase.rpc('fn_btvn_tra_chi_tiet_cua_toi', { p_buoi_hoc_id: buoiHocId })
  if (error) throw error
  return (data ?? null) as ChiTietBaiTraHS | null
}

export async function danhDauDaXemBaiTra(buoiHocId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_btvn_tra_da_xem', { p_buoi_hoc_id: buoiHocId })
  if (error) throw error
}

// Số bài đã trả em chưa mở — cộng vào badge chuông Hòm thư.
export async function demBaiTraChuaXem(): Promise<number> {
  const { data, error } = await supabase.rpc('fn_btvn_tra_chua_xem_cua_toi')
  if (error) throw error
  return (data as number | null) ?? 0
}

// Ký URL xem ảnh (1 giờ). Ảnh nào ký không được (chưa có policy HS) ⇒ không có trong kết quả.
export async function kyAnhBaiTra(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {}
  const { data, error } = await supabase.storage.from(BTVN_NOP_BUCKET).createSignedUrls(paths, 3600)
  if (error) throw error
  const out: Record<string, string> = {}
  for (const d of data ?? []) if (d.path && d.signedUrl) out[d.path] = d.signedUrl
  return out
}
