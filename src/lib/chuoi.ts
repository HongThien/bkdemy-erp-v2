// Chuỗi làm bài + lượt học thật (spec-v1-app-hs.md §2–§3, hợp đồng §13.4 · mig 202610011501 + 202610011512 + 202610011515).
// Mọi phép tính ở Postgres (_luot_hoc_that, _chuoi_cua) — client chỉ gọi hàm và vẽ.
import { supabase } from './supabase'

// Trạng thái 1 ngày trong dải 7 ngày: hoc = có lượt học thật (kể cả ngày đã được sửa bù) · dong_bang = tự dùng thẻ ·
// nghi = ngày nghỉ của trung tâm/khối (không đứt, không cộng) · cho_sua = lỡ, còn sửa được · dut = đứt · trong = hôm nay chưa làm / trước chuỗi.
export type NgayChuoi = { ngay: string; trang_thai: 'hoc' | 'dong_bang' | 'nghi' | 'trong' | 'cho_sua' | 'dut' }

export type Chuoi = {
  so_ngay: number              // chuỗi hiện tại (0 = đứt / chưa có)
  bat_dau: string | null       // ngày đầu chuỗi hiện tại
  hom_nay_da_tinh: boolean     // hôm nay đã có lượt học thật
  luot_hom_nay: number         // số lượt học thật hôm nay
  ky_luc: number               // chuỗi dài nhất
  the_dong_bang: number        // thẻ đóng băng còn trong tháng (2/tháng, không dồn)
  ngay_cho_sua: string[]       // ngày lỡ còn sửa được (cũ → mới)
  luot_can_bu: number          // cần thêm bấy nhiêu lượt NGOÀI lượt giữ hôm nay để sửa hết
  sua_duoc_den: string | null  // ISO — hết hạn sửa ngày lỡ cũ nhất (hết ngày lỡ + 2, giờ VN)
  moc_tiep: number | null      // mốc kế tiếp: 3 · 7 · 14 · 30 · 50 · 100 · 200 · 365
  bay_ngay: NgayChuoi[]        // 7 ngày gần nhất, cũ → mới (phần tử cuối = hôm nay)
}

export async function chuoiCuaToi(): Promise<Chuoi> {
  const { data, error } = await supabase.rpc('fn_chuoi_cua_toi')
  if (error) throw error
  return data as Chuoi
}

// 1 lượt luyện thêm em vừa nộp có được tính là "lượt học thật" không — màn kết quả báo lý do khi không tính.
export type LyDoKhongTinh = 'it_cau' | 'duoi_nguong' | 'qua_nhanh' | 'khong_phai_luot_luyen'
export type KetQuaLuot = {
  tinh: boolean
  ly_do: LyDoKhongTinh | null
  so_cau?: number; dung?: number; dung_moi?: number; giay_tb?: number; thu_thach?: boolean; mon?: string; ngay?: string
  nguong: { so_cau_toi_thieu: number; ti_le_dung: number; giay_tb_toi_thieu: number }
}
export async function ketQuaLuotHocThat(baiLamId: string): Promise<KetQuaLuot> {
  const { data, error } = await supabase.rpc('fn_luot_hoc_that_ket_qua', { p_bai_lam_id: baiLamId })
  if (error) throw error
  return data as KetQuaLuot
}

// Câu báo cho em khi lượt không tính (nhẹ nhàng, không phạt). Giao diện có thể thay chữ, giữ nghĩa.
export function loiLuotKhongTinh(k: KetQuaLuot): string | null {
  if (k.tinh) return null
  switch (k.ly_do) {
    case 'qua_nhanh': return `Lượt này em làm nhanh quá (dưới ${k.nguong.giay_tb_toi_thieu} giây mỗi câu) nên chưa tính vào chuỗi. Đọc kỹ đề rồi làm lượt mới nhé!`
    case 'duoi_nguong': return `Cần đúng từ ${Math.round(k.nguong.ti_le_dung * 100)}% số câu thì lượt mới được tính. Thử lượt mới nhé!`
    case 'it_cau': return `Lượt có ít hơn ${k.nguong.so_cau_toi_thieu} câu nên chưa được tính.`
    default: return null
  }
}

// ── Ngày nghỉ của chuỗi (trung tâm nhập: lễ/Tết = mọi khối; tuần thi = theo khối). Ghi cần quyền 'huyhieu'. ──
export type NgayNghiChuoi = { id: string; tu: string; den: string; khoi: string[]; ly_do: string; tao_at: string }
export async function dsNgayNghiChuoi(): Promise<NgayNghiChuoi[]> {
  const { data, error } = await supabase.from('chuoi_ngay_nghi').select('id, tu, den, khoi, ly_do, tao_at')
    .is('xoa_at', null).order('tu', { ascending: false }).limit(200)
  if (error) throw error
  return (data ?? []) as NgayNghiChuoi[]
}
export async function themNgayNghiChuoi(tu: string, den: string, khoi: string[], lyDo: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_chuoi_ngay_nghi_ghi', { p_tu: tu, p_den: den, p_khoi: khoi, p_ly_do: lyDo })
  if (error) throw error
  return data as string
}
export async function goNgayNghiChuoi(id: string): Promise<void> {
  const { error } = await supabase.rpc('fn_chuoi_ngay_nghi_go', { p_id: id })
  if (error) throw error
}
