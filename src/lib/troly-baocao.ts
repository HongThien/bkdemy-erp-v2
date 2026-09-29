// ============================================================================
// BÁO CÁO của trợ lý — LOGIC 3 LUỒNG (CEO chốt 29/09):
//   1. Có bao nhiêu việc đang CHẬM / đang MISS.
//   2. Nút "Detail": bấm mới hiện từng việc — ngày nào, do ai phụ trách.
//   3. Cảnh báo rủi ro / bất thường nếu có.
//
// File này CHỈ gọi hàm + khai kiểu. Mọi con số tính ở Postgres (`fn_troly_bao_cao`,
// mig 202609290956) — đúng luật §2.0. Đừng thêm reduce/filter().length nghiệp vụ ở đây hay ở
// màn hình: cần số mới thì thêm vào hàm DB.
// ============================================================================
import { supabase } from './supabase'

// cham = quá hạn chưa đóng · miss = hỏng về nội dung · xong_muon = đã xong nhưng sau hạn (đếm riêng)
export type LoaiViec = 'cham' | 'miss' | 'xong_muon'

export type ViecBaoCao = {
  loai: LoaiViec
  ngay: string                // ngày của buổi / ca / lượt vắng sinh ra việc
  doi_tuong: string           // lớp, hoặc "học sinh · lớp"
  viec: string
  phu_trach: string | null    // từ phân công lớp — cùng nguồn màn Việc của tôi
  han: string | null          // 'DD/MM HH:mm' giờ VN
  xong_luc: string | null
  tinh_trang: string
}

// thieu_nguon = dòng báo cáo CEO cần mà hệ CHƯA CÓ dữ liệu — nêu lý do, không bịa số.
export type MucDoCanhBao = 'cao' | 'vua' | 'thieu_nguon'
export type CanhBao = {
  ma: string; muc_do: MucDoCanhBao; tieu_de: string; mo_ta: string; so: number
  chi_tiet: { chinh: string; phu: string | null; noi_dung: string }[]
}

export type MucBaoCao = {
  ma: string; ten: string
  cham: number; miss: number; xong_muon: number
  viec: ViecBaoCao[]
  da_cat: boolean             // danh sách việc bị cắt (số đếm thì luôn đủ)
  canh_bao: CanhBao[]
}

export type BaoCaoTroLy = {
  tu: string; den: string; so_ngay: number; tao_luc: string
  tong: { cham: number; miss: number; xong_muon: number; canh_bao: number }
  muc: MucBaoCao[]
  canh_bao_chung: CanhBao[]
  theo_nguoi: { phu_trach: string; cham: number; miss: number; xong_muon: number }[]
  cach_hieu: string[]
}

// Trợ lý chỉ mở cho nhóm được cấp (CEO 29/09: Thùy · Thùy Trang · Bảo Lộc). Rào thật nằm trong
// từng hàm `fn_troly_*` ở DB; tab bị ẩn ở NhanSuHome bằng cờ chung với tab Hỏi hệ thống.
// `den` = 'YYYY-MM-DD' (bỏ trống = hôm nay) · `soNgay` = độ dài khoảng nhìn lại.
export async function getBaoCao(den: string | null, soNgay: number): Promise<BaoCaoTroLy> {
  const { data, error } = await supabase.rpc('fn_troly_bao_cao', { p_den: den, p_so_ngay: soNgay })
  if (error) throw error
  return data as BaoCaoTroLy
}

// ── Ngày giờ VN, KHÔNG toISOString / new Date('YYYY-MM-DD') (CLAUDE.md §2) ──────
export const ddmm = (ngay: string | null | undefined): string => (ngay ? `${ngay.slice(8, 10)}/${ngay.slice(5, 7)}` : '—')
