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
// hs_khong_den = ca bổ trợ huỷ vì học sinh vắng — thông số RIÊNG, không phải chậm/miss của nhân sự (CEO 29/09)
export type LoaiViec = 'cham' | 'miss' | 'hs_khong_den' | 'xong_muon'

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
// ghi_chu = điều cần biết để đọc đúng con số (vd khâu chưa tới ngày bắt buộc), không phải cảnh báo.
export type MucDoCanhBao = 'cao' | 'vua' | 'thieu_nguon' | 'ghi_chu'
export type CanhBao = {
  ma: string; muc_do: MucDoCanhBao; tieu_de: string; mo_ta: string; so: number
  chi_tiet: { chinh: string; phu: string | null; noi_dung: string }[]
}

// BTVN phần "trợ giảng chấm bài": tỉ lệ nộp ĐẠT CHUẨN theo lớp (CEO 29/09).
// Một em đạt khi đủ cả ba: đã nộp · đã tick thái độ · có điểm chấm. Thiếu thông tin = không đạt.
export type TiLeNopBtvn = {
  nguong_pct: number; so_lop: number; so_lop_duoi_nguong: number; so_buoi: number
  can_co: number; dat: number; chua_nop: number; thieu_thong_tin: number; ti_le_pct: number | null
  lop: {
    ten_lop: string; mon: string; ta_phan_cong: string | null
    so_buoi: number; can_co: number; dat: number; chua_nop: number; thieu_thong_tin: number
    ti_le_pct: number | null; duoi_nguong: boolean
    buoi: {
      ngay: string; han: string | null; da_dong: boolean; dong_luc: string | null
      nguoi_cham: string | null   // người THỰC TẾ chấm — có thể khác TA được phân công
      can_co: number; dat: number; chua_nop: number; thieu_thong_tin: number; ti_le_pct: number | null
      hs: { ho_ten: string; ly_do: string; nhom: 'chua_nop' | 'thieu' }[]   // chỉ em KHÔNG đạt
    }[]
  }[]
  cach_tinh: string[]
}

export type MucBaoCao = {
  ma: string; ten: string
  ti_le_nop?: TiLeNopBtvn       // chỉ mục BTVN có
  cham: number; miss: number; xong_muon: number; hs_khong_den: number
  thong_so: { nhan: string; gia_tri: string | number }[]   // số riêng của mục, không phải chậm/miss
  viec: ViecBaoCao[]
  da_cat: boolean             // danh sách việc bị cắt (số đếm thì luôn đủ)
  canh_bao: CanhBao[]
}

export type BaoCaoTroLy = {
  // Mỗi người quản một mảng thì có một BỘ báo cáo riêng (CEO 29/09: Trang = Sư phạm, Lộc = Vận hành).
  // Hiện mới có bộ 'su_pham'.
  bo: string; ten: string; ghi_chu_bo: string
  tu: string; den: string; so_ngay: number; tao_luc: string
  tong: { cham: number; miss: number; xong_muon: number; hs_khong_den: number; canh_bao: number }
  muc: MucBaoCao[]
  canh_bao_chung: CanhBao[]
  theo_nguoi: { phu_trach: string; cham: number; miss: number; xong_muon: number }[]
  cach_hieu: string[]
  // Báo cáo KHÔNG tính realtime (CEO 29/09): bản này được tính lúc nào, bởi ai, lượt gọi này có tính không.
  luu: { vua_tinh: boolean; tinh_luc: string; tinh_boi: string | null; tinh_mat_ms: number; so_lan_tinh: number }
}

// Trợ lý chỉ mở cho nhóm được cấp (CEO 29/09: Thùy · Thùy Trang · Bảo Lộc). Rào thật nằm trong
// từng hàm `fn_troly_*` ở DB; tab bị ẩn ở NhanSuHome bằng cờ chung với tab Hỏi hệ thống.
//
// ⭐ Báo cáo KHÔNG tính realtime (CEO 29/09). DB giữ một bản lưu cho mỗi (ngày, khoảng):
//   · `tinhLai = false` — lấy bản lưu của hôm nay; hôm nay chưa ai tính thì DB tự tính rồi lưu.
//   · `tinhLai = true`  — tính lại và GHI ĐÈ bản của hôm nay (nút "↻ Tính lại").
// ⚠ ĐỪNG gọi thẳng `fn_troly_bao_cao`: chạy bằng quyền người dùng thì vượt 8 giây và bị huỷ
//   ("statement timeout", đã dính 29/09) — quyền gọi thẳng cũng đã bị thu ở DB.
export async function getBaoCao(soNgay: number, tinhLai = false): Promise<BaoCaoTroLy> {
  const { data, error } = await supabase.rpc('fn_troly_bao_cao_lay', { p_so_ngay: soNgay, p_tinh_lai: tinhLai })
  if (error) throw error
  return data as BaoCaoTroLy
}

// ── Ngày giờ VN, KHÔNG toISOString / new Date('YYYY-MM-DD') (CLAUDE.md §2) ──────
export const homNayVN = (): string => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
export const ddmm = (ngay: string | null | undefined): string => (ngay ? `${ngay.slice(8, 10)}/${ngay.slice(5, 7)}` : '—')
