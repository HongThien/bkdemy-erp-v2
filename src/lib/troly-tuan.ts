// ============================================================================
// TỔNG KẾT TUẦN của trợ lý — dashboard toàn cảnh (CEO 29/09).
//
// Khác báo cáo Sư phạm ở câu hỏi nó trả lời:
//   · Báo cáo Sư phạm: việc NÀO đang hỏng, của AI  → để đi nhắc.
//   · Tổng kết tuần:   cả hệ chạy TỐT TỚI ĐÂU      → tỉ lệ đúng chuẩn / chậm / thiếu, xếp hạng
//     giáo viên – TA, phễu bổ trợ, thời gian từng giai đoạn, so với tuần trước.
//
// File này CHỈ gọi hàm + khai kiểu. Mọi con số — kể cả chênh lệch với tuần trước và số gộp các
// khâu — tính ở Postgres (`fn_troly_tuan`, mig 202609291215 + 202609291225), đúng luật §2.0.
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

export type SoTuan = {
  tu: string; den: string
  quy_mo: { so_buoi: number; so_lop: number; luot_co_mat: number; luot_vang: number; chua_diem_danh: number; chuyen_can_pct: number | null }
  khau: SoKhau[]
  tong_khau?: TongKhau          // bản lưu tính trước mig 202609291225 chưa có
  bo_tro_yeu: {
    can_bo_tro: number; da_len_lich: number; da_bo_tro: number
    pct_len_lich: number | null; pct_da_bo_tro: number | null
    luot_xep: number; luot_dien_ra: number; luot_hop_le: number; luot_khong_test: number
    luot_ta_chua_dong_ca: number; luot_cho_hoc: number
    su_co: number; pct_su_co: number | null
    su_co_chi_tiet: { hs_khong_den: number; khong_diem_danh: number; ops_go_khoi_lich: number; huy_ly_do_khac: number }
  }
  thoi_gian: { duyet_den_xep: MocThoiGian; xep_den_dien_ra: MocThoiGian }
  bo_tro_bu: {
    luot_vang: number; khong_bu: number; da_xep: number; da_hoc_bu: number; chua_xep: number; su_co: number
    pct_da_xep: number | null; pct_da_hoc_bu: number | null
    buoi_bu_luot: number; buoi_bu_co_mat: number; buoi_bu_vang: number; buoi_bu_huy: number
  }
  btvn_hs: {
    nguong_pct: number; so_lop: number; so_lop_duoi_nguong: number; so_buoi: number
    can_co: number; dat: number; chua_nop: number; thieu_thong_tin: number; ti_le_pct: number | null
  }
}

export type DongXepHang = {
  hang: number; ho_ten: string; ma_ns: string | null
  tong: number; dung_chuan: number; cham: number; thieu: number; pct_dung_chuan: number
}

type ChenhTiLe = { pct_dung_chuan: number | null; pct_cham: number | null; pct_thieu: number | null }
export type ChenhTuan = {
  so_buoi: number | null; chuyen_can_pct: number | null; btvn_hs_pct: number | null
  tong_khau: ChenhTiLe
  khau: Record<string, ChenhTiLe>
  bo_tro_yeu: { can_bo_tro: number | null; pct_len_lich: number | null; pct_da_bo_tro: number | null; pct_su_co: number | null }
  bo_tro_bu: { pct_da_xep: number | null }
  thoi_gian: { duyet_den_xep: number | null; xep_den_dien_ra: number | null }
}

export type TongKetTuan = {
  bo: string; ten: string
  tu: string; den: string          // thứ Hai → Chủ nhật của tuần đang xem
  da_ket_thuc: boolean             // false = tuần còn đang chạy, số chưa chốt
  tao_luc: string
  so: SoTuan; truoc: SoTuan
  chenh?: ChenhTuan                // tuần xem TRỪ tuần trước; thiếu một bên thì ô đó null
  xep_hang: Record<string, DongXepHang[]>   // khoá = mã khâu
  xep_hang_bo_qua: string[]        // người không đưa vào xếp hạng
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
