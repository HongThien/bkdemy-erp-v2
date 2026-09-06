// Seam SHOPPING (box "Shopping" trong Của tôi, CEO 07/09): vật phẩm (Trà sữa, Kem, Tokbokki…) mua
// bằng ĐIỂM TÍCH LŨY ĐÃ CHỐT. Giá theo điểm do admin đặt (100 điểm ≈ 1k để định giá, KHÔNG quy ra
// tiền cho nhân sự). Đổi = fn_shop_doi (transactional: kiểm dư → đẻ đơn cho_giao); ai giao/đánh dấu
// đã giao làm ở ERP sau. Không lưu số dư — suy từ chốt tháng − đơn.
import { supabase } from './supabase'

export type ShopVatPham = { id: string; ten: string; mo_ta: string | null; anh_url: string | null; gia_diem: number; active: boolean; thu_tu: number }
export type ShopDon = {
  id: string; nhan_su_id: string; vat_pham_id: string | null; ten_vat_pham: string; gia_diem: number
  trang_thai: 'cho_giao' | 'da_giao' | 'huy'; created_at: string; giao_at: string | null; ghi_chu: string | null
}

export async function listVatPham(): Promise<ShopVatPham[]> {
  const { data, error } = await supabase.from('shop_vat_pham').select('*').eq('active', true).order('thu_tu').order('gia_diem').limit(200)
  if (error) throw error
  return (data ?? []) as ShopVatPham[]
}
export async function listDonCuaToi(): Promise<ShopDon[]> {
  const { data, error } = await supabase.rpc('fn_shop_don_cua_toi')
  if (error) throw error
  return (data ?? []) as ShopDon[]
}
// Trả về đơn vừa tạo; DB ném lỗi nếu không đủ điểm / vật phẩm ngừng bán.
export async function doiVatPham(vatPhamId: string): Promise<ShopDon> {
  const { data, error } = await supabase.rpc('fn_shop_doi', { p_vat_pham: vatPhamId })
  if (error) throw error
  return data as ShopDon
}
