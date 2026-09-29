// ============================================================================
// TỔNG KẾT TUẦN của trợ lý — dashboard toàn cảnh (CEO 29/09).
//
// Khác báo cáo Sư phạm ở câu hỏi nó trả lời:
//   · Báo cáo Sư phạm: việc NÀO đang hỏng, của AI  → để đi nhắc.
//   · Tổng kết tuần:   cả hệ chạy TỐT TỚI ĐÂU      → mỗi chỉ số so với THƯỜNG ĐẠT của chính nó,
//     xếp hạng giáo viên – TA, phễu bổ trợ, tuyển sinh, kết quả học tập, xu hướng nhiều tuần.
//
// File này CHỈ gọi hàm + khai kiểu. Mọi con số — giá trị, tuần trước, chênh lệch, thường đạt, lọc
// nhiễu, đánh giá — tính ở Postgres (mig 202609291215 · 202609291225 · 202609291251), đúng luật §2.0.
// Thêm chỉ số mới = thêm một dòng vào `_troly_tuan_danh_muc()` ở DB; màn hình tự có.
// ============================================================================
import { supabase } from './supabase'

export type SoKhau = {
  ma: string; ten: string
  tong: number; con_han: number; da_toi_han: number
  dung_chuan: number; cham: number; thieu: number
  chi_tiet: { dong_muon: number; qua_han_chua_dong: number; khong_co_de: number; dong_ma_trong: number; thieu_du_lieu_hs: number }
  pct_dung_chuan: number | null; pct_cham: number | null; pct_thieu: number | null
}
export type TongKhau = Omit<SoKhau, 'ma' | 'ten' | 'chi_tiet'>
export type MocThoiGian = { so_mau: number; tb_ngay: number | null; trung_vi_ngay: number | null; lau_nhat_ngay: number | null }

// Số gốc của tuần — dùng cho phần Detail (thành phần của từng con số). Số để SO SÁNH nằm ở `chi_so`.
export type SoTuan = {
  tu: string; den: string
  quy_mo: { so_buoi: number; so_lop: number; luot_co_mat: number; luot_vang: number; chua_diem_danh: number; chuyen_can_pct: number | null }
  khau: SoKhau[]
  tong_khau: TongKhau
  bo_tro_yeu: {
    can_bo_tro: number; da_len_lich: number; da_bo_tro: number
    luot_xep: number; luot_dien_ra: number; luot_hop_le: number; luot_khong_test: number
    luot_ta_chua_dong_ca: number; luot_cho_hoc: number; su_co: number
    su_co_chi_tiet: { hs_khong_den: number; khong_diem_danh: number; ops_go_khoi_lich: number; huy_ly_do_khac: number }
  }
  thoi_gian: { duyet_den_xep: MocThoiGian; xep_den_dien_ra: MocThoiGian }
  bo_tro_bu: {
    luot_vang: number; khong_bu: number; da_xep: number; da_hoc_bu: number; chua_xep: number; su_co: number
    buoi_bu_luot: number; buoi_bu_co_mat: number; buoi_bu_vang: number; buoi_bu_huy: number
  }
  bo_tro_duoi: {
    can_duoi: number; da_len_lich: number; da_hoc: number; hoan_thanh_trong_tuan: number
    luot_xep: number; luot_da_hoc: number; luot_cho_hoc: number; su_co: number
    su_co_chi_tiet: { hs_khong_den: number; khong_diem_danh: number; huy: number }
    tao_den_xep: MocThoiGian
  }
  tuyen_sinh: {
    ung_vien_moi: number; convert: number; loai: number
    ca_test: number; ca_huy: number; da_test_xong: number; da_cham: number; da_tra_ket_qua: number; ton_dong: number
    test_den_tra: MocThoiGian
  }
  btvn_hs: { nguong_pct: number; so_lop: number; so_lop_duoi_nguong: number; can_co: number; dat: number; chua_nop: number; thieu_thong_tin: number }
  hoc_tap: { hs_et_thap: number; hs_btvn_thap: number; hs_dg_bao_dong: number; hs_btvn_khong_lam: number }
}

// van_de = xấu hơn thường đạt ≥ 2 độ lệch chuẩn · duoi = ≥ 1 · tren = tốt hơn ≥ 1
// khong_xet = chỉ số không có chiều tốt/xấu · chua_du = chưa đủ lần đo · chua_chot = số tuần này còn đổi
export type DanhGia = 'van_de' | 'duoi' | 'binh_thuong' | 'tren' | 'khong_xet' | 'chua_du' | 'chua_chot'

export type ChiSo = {
  ma: string; bang: string; ten: string
  don_vi: string                              // '%', 'ngày', 'case', 'lượt', 'học sinh'…
  chieu_tot: 'len' | 'xuong' | 'khong'
  can_chin: boolean
  gia_tri: number | null; tu_so: number | null; mau_so: number | null
  truoc: number | null; chenh: number | null  // tuần liền trước, và tuần này TRỪ tuần trước
  thuong_dat: number | null; lech: number | null
  so_lan_do: number; so_lan_nhieu: number     // số lần đo dùng để tính thường đạt · số lần bị loại vì nhiễu
  danh_gia: DanhGia | null
  chuoi: { tuan: string; gia_tri: number | null; nhieu: boolean }[]   // các tuần gần nhất, cũ → mới
}

export type DongXepHang = {
  hang: number; ho_ten: string; ma_ns: string | null
  tong: number; dung_chuan: number; cham: number; thieu: number; pct_dung_chuan: number
}

export type LopHocTap = {
  ten_lop: string; mon: string; et_so_luot: number
  et_tb: number | null; et_tb_truoc: number | null; et_chenh: number | null
  btvn_tb: number | null; btvn_tb_truoc: number | null
}

export type TongKetTuan = {
  bo: string; ten: string
  tu: string; den: string          // thứ Hai → Chủ nhật của tuần đang xem
  da_ket_thuc: boolean             // false = tuần còn đang chạy
  da_chin: boolean                 // false = chưa qua 7 ngày sau Chủ nhật, vài chỉ số còn "chưa chốt"
  tao_luc: string
  so: SoTuan
  bang: { ma: string; ten: string }[]
  chi_so: ChiSo[]
  lop_hoc_tap: LopHocTap[]         // lớp tụt điểm ET nhiều nhất đứng đầu
  xep_hang: Record<string, DongXepHang[]>   // khoá = mã khâu
  xep_hang_bo_qua: string[]
  thuong_dat: { tu_tuan: string; so_tuan_toi_thieu: number; he_so_nhieu: number; sigma_luu_y: number; sigma_van_de: number; so_tuan_chua_co_so: number }
  cach_tinh: string[]
  luu: { vua_tinh: boolean; tinh_luc: string; tinh_boi: string | null; tinh_mat_ms: number; so_lan_tinh: number }
}

// `tuan` = một ngày bất kỳ trong tuần muốn xem (YYYY-MM-DD); null = tuần vừa rồi.
// Không tính realtime, cùng luật với báo cáo: DB giữ bản lưu, `tinhLai` thì tính lại và ghi đè.
export async function getTongKetTuan(tuan: string | null, tinhLai = false): Promise<TongKetTuan> {
  const { data, error } = await supabase.rpc('fn_troly_tuan_lay', { p_tuan: tuan, p_tinh_lai: tinhLai })
  if (error) throw error
  return data as TongKetTuan
}

// Cộng ngày trên chuỗi YYYY-MM-DD, chỉ để bấm ‹ › đổi tuần. Dùng Date.UTC, không toISOString (CLAUDE.md §2).
export function congNgay(ngay: string, n: number): string {
  const [y, m, d] = ngay.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + n))
  const hai = (x: number) => String(x).padStart(2, '0')
  return `${t.getUTCFullYear()}-${hai(t.getUTCMonth() + 1)}-${hai(t.getUTCDate())}`
}
