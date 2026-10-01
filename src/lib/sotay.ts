// ============================================================================
// sotay.ts — SỔ TAY KIẾN THỨC (app HS, CEO 18/09): HS tra lý thuyết + bài mẫu của 1 dạng.
//
// TOÀN BỘ đi qua RPC security definer (mig 202609181946) — KHÔNG query bảng kho thẳng.
// Lý do không phải cho gọn: `dai_dang_ly_thuyet`/`hgt_dang_ly_thuyet` bật RLS member-gate,
// tài khoản HS SELECT thẳng sẽ trả 0 DÒNG mà KHÔNG báo lỗi (đúng bẫy CLAUDE.md §2.1) — màn
// hình rỗng trông y hệt "kho chưa có nội dung", debug rất lâu mới ra.
//
// Gom nhóm / đếm / xếp hạng gợi ý đều nằm ở Postgres (§2.0). File này chỉ gọi + ép kiểu.
// ============================================================================
import { supabase } from './supabase'

// Nhánh kho theo từ vựng của REGISTRY SQL (`_kho_ban_do_tbl`): Đại = null, Hình giải tích =
// 'hinh_gt'. ⚠ KHÁC từ vựng `KhoNhanh` bên `lib/kho/api.ts` ('toan' | 'hgt' | 'hinh') — đó là
// nhãn của màn staff. Đừng trộn hai bộ: truyền 'hgt' xuống RPC sẽ âm thầm rơi về bảng Đại.
export type SoTayNhanh = null | 'hinh_gt'
export const SOTAY_NHANH: { id: SoTayNhanh; ten: string }[] = [
  { id: null, ten: 'Đại số' },
  { id: 'hinh_gt', ten: 'Hình học' },
]

// Nhóm độ khó = muc_do 1–5 gộp 3 bậc (CEO 18/09). Gộp Ở DB (`_sotay_nhom`) — client CHỈ đổi
// mã thành nhãn, KHÔNG tự chia lại ngưỡng (công thức 2 nơi = §2.0 cấm).
export type SoTayNhom = 'co_ban' | 'trung_binh' | 'nang_cao'
export const NHOM_TEN: Record<SoTayNhom, string> = { co_ban: 'Cơ bản', trung_binh: 'Trung bình', nang_cao: 'Nâng cao' }
export const NHOM_MAU: Record<SoTayNhom, { chu: string; nen: string }> = {
  co_ban: { chu: '#20A886', nen: '#e7f9ee' },
  trung_binh: { chu: '#E08A1E', nen: '#fff3e0' },
  nang_cao: { chu: '#E0405A', nen: '#ffe3e6' },
}

export type SoTayDang = {
  ma_dang: string; ten_dang: string
  muc_do: number | null; nhom: SoTayNhom | null; mo_ta_ngan: string | null
}
export type SoTayChuyenDe = { ma: string; ten: string; so_dang: number; dangs: SoTayDang[] }
export type SoTayChuDe = { ma: string; ten: string; so_dang: number; con: SoTayChuyenDe[] }
export type SoTayCay = {
  mon: string; nhanh: SoTayNhanh
  khoi: string | null; khoi_hs: string | null; khoi_list: string[]
  so_dang: number
  // Số dạng của khối này CHƯA có lý thuyết nên bị ẩn khỏi sổ tay (§1.5: thiếu data = không có
  // dòng, không phải dòng rỗng). Hiện ra để còn biết độ phủ mà đi lấp, không phải để doạ HS.
  thieu_ly_thuyet: number
  cay: SoTayChuDe[]
}
export type SoTayTimRow = SoTayDang & { khoi: string; ten_chu_de: string; ten_chuyen_de: string }
export type SoTayNoiDung = SoTayDang & {
  khoi: string
  ma_chu_de: string; ten_chu_de: string; ma_chuyen_de: string; ten_chuyen_de: string
  noi_dung: string; cap_nhat_at: string
}

const CAY_RONG: SoTayCay = {
  mon: 'Toán', nhanh: null, khoi: null, khoi_hs: null, khoi_list: [],
  so_dang: 0, thieu_ly_thuyet: 0, cay: [],
}

// Cây lọc Chủ đề → Chuyên đề → Dạng của MỘT khối, lấy 1 lần rồi lọc tại chỗ ở UI.
// khoi = null ⇒ DB tự lấy khối của chính HS (và tự rơi về khối có nội dung nếu khối em còn trống).
export async function soTayCay(mon: string, nhanh: SoTayNhanh, khoi: string | null): Promise<SoTayCay> {
  const { data, error } = await supabase.rpc('hs_sotay_cay', { p_mon: mon, p_nhanh: nhanh, p_khoi: khoi })
  if (error) throw error
  return (data as SoTayCay | null) ?? CAY_RONG
}

// Gợi ý theo ký tự HS gõ. Bỏ dấu + xếp hạng chạy ở DB; `khoi` chỉ để CỘNG ĐIỂM ưu tiên chứ
// không cắt — em gõ trúng tên một dạng ở khối khác thì vẫn phải thấy nó.
export async function soTayTim(tuKhoa: string, mon: string, nhanh: SoTayNhanh, khoi: string | null): Promise<SoTayTimRow[]> {
  const { data, error } = await supabase.rpc('hs_sotay_tim', {
    p_tu_khoa: tuKhoa, p_mon: mon, p_nhanh: nhanh, p_khoi: khoi, p_limit: 20,
  })
  if (error) throw error
  return (data as SoTayTimRow[] | null) ?? []
}

// Nội dung 1 dạng. null = dạng không có lý thuyết đọc được (màn hình phải báo tử tế, đừng vẽ rỗng).
export async function soTayDang(maDang: string, mon: string, nhanh: SoTayNhanh): Promise<SoTayNoiDung | null> {
  const { data, error } = await supabase.rpc('hs_sotay_dang', { p_ma_dang: maDang, p_mon: mon, p_nhanh: nhanh })
  if (error) throw error
  return (data as SoTayNoiDung | null) ?? null
}
