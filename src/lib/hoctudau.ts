// ============================================================================
// hoctudau.ts — "Học từ đầu" (Thùy 19/09): HS có case bổ trợ đuổi ĐANG MỞ học tuần
// tự dạng-theo-dạng trong 1 chuyên đề (đọc lý thuyết · luyện tập vô hạn không tính
// mastery · làm test tính mastery, quyết định mở dạng kế). Mọi phép tính (thứ tự,
// khoá/mở, coverage) chạy Ở SERVER (migration 202609191521 + …1524 + …1526) —
// file này chỉ gọi RPC, không tính gì thêm (CLAUDE.md §2.0).
// ============================================================================
import { supabase } from './supabase'
import type { SinhTuLuyenKetQua } from './tuluyen'

export type DangHTD = {
  ma_chu_de: string; ten_chu_de: string
  ma_chuyen_de: string; ten_chuyen_de: string
  ma_dang: string; ten_dang: string
  tong_cau: number; doc_ly_thuyet: boolean; xong: boolean; mo: boolean
}

// ── BỔ TRỢ ĐUỔI thống nhất (Thùy 15/10) — một nguồn tiến trình cho HS, TA, ERP. Mọi số + trạng thái tính ở DB (fn_duoi_tien_trinh). ──
export type DangDuoiHS = DangHTD & {
  luyen_cau: number; luyen_dung: number; test_lan: number; test_gan_nhat: number | null
  xong_at: string | null; noi_lam: 'nha' | 'ca' | null; mo_tay: boolean
  trang_thai: 'xong' | 'dang_hoc' | 'toi_luot' | 'khoa' | 'giay'
  tren_app: boolean // false = dạng không nằm trong lộ trình app (vd Bài Hình học) ⇒ học + chấm trên giấy với TA
  ma_chuyen_de: string; ten_chuyen_de: string
}
export type BuoiDuoiHS = { buoi_id: string; ngay: string; gio_bat_dau: string | null; trang_thai: string; diem_danh: string | null; xong: boolean }
export type DotDuoiHS = {
  bo_tro_duoi_id: string; mon: string; lop: string | null; so_buoi_du_kien: number | null; created_at: string
  dangs: DangDuoiHS[]; buoi: BuoiDuoiHS[]
  tong: number; xong: number; dang_hoc: number; tai_nha: number; tai_ca: number; giay: number; so_buoi_xong: number
}
// Không tham số = đợt của CHÍNH em (app HS). Nhân sự truyền hocSinhId để xem tiến trình của em đó (app TA / ERP).
export async function duoiTienTrinh(hocSinhId?: string | null): Promise<DotDuoiHS[]> {
  const { data, error } = await supabase.rpc('fn_duoi_tien_trinh', { p_hoc_sinh: hocSinhId ?? null })
  if (error) throw error
  return (data ?? []) as DotDuoiHS[]
}
// TA mở tay dạng đang khoá tuần tự (chỉ nhân sự, chỉ dạng thuộc mục tiêu đuổi đang mở của em).
export async function moTayDangDuoi(hocSinhId: string, mon: string, maDang: string): Promise<void> {
  const { error } = await supabase.rpc('fn_duoi_mo_dang', { p_hoc_sinh: hocSinhId, p_mon: mon, p_ma_dang: maDang })
  if (error) throw error
}

export async function htdCoMo(mon: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('htd_co_mo', { p_mon: mon })
  if (error) throw error
  return !!data
}

export async function htdLoTrinh(mon: string): Promise<DangHTD[]> {
  const { data, error } = await supabase.rpc('htd_lo_trinh', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as DangHTD[]
}

export async function htdLyThuyet(mon: string, maDang: string): Promise<{ noi_dung: string; file_url: string | null }> {
  const { data, error } = await supabase.rpc('htd_ly_thuyet', { p_mon: mon, p_ma_dang: maDang })
  if (error) throw error
  return data as { noi_dung: string; file_url: string | null }
}

// loai: 'htd_luyen' (vô hạn, không tính mastery) · 'htd_test' (1 lượt, tính mastery — trigger DB
// tự ghi "xong dạng" khi nộp, xem trg_htd_test_nop).
// Thùy 03/10: 'bu_luyen' | 'bu_test' = học BÙ — DB chỉ lấy câu trắc nghiệm (_kho_dk_mcq_sql), dạng không có trắc nghiệm thì báo học giấy.
export async function htdSinh(mon: string, maDang: string, loai: 'htd_luyen' | 'htd_test' | 'bu_luyen' | 'bu_test'): Promise<SinhTuLuyenKetQua> {
  const { data, error } = await supabase.rpc('tu_luyen_chu_de_sinh', { p_mon: mon, p_ma_dang: maDang, p_loai: loai })
  if (error) throw error
  return { baiTestId: data.bai_test_id, them: data.them, tong: data.tong }
}

// Dạng KHÔNG có MCQ (mig 202609220900: htdSinh rơi sang câu BẤT KỲ LOẠI thay vì chặn cứng) — trả
// đúng loai_cau từng câu để client biết render TƯƠNG TÁC (trắc nghiệm, máy tự chấm) hay CHỈ ĐỌC
// (mọi loại khác — không auto-chấm, đúng luật CEO 20/09 "không nhánh lùi tự động chấm TLN"; TA chấm
// tay qua fn_botro_cham_tay). 1 bài chỉ có 1 trong 2 loại (RPC sinh không trộn) — client chỉ cần
// xét câu đầu tiên, nhưng trả cả mảng để hiển thị nội dung luôn (khỏi gọi thêm 1 lần).
export type CauHTD = { id: string; thu_tu: number; noi_dung: string | null; lua_chon: string[] | null; loai_cau: string }
export async function htdCauBaiTest(baiTestId: string): Promise<CauHTD[]> {
  const { data, error } = await supabase.from('bai_test_cau').select('id, thu_tu, noi_dung, lua_chon, loai_cau').eq('bai_test_id', baiTestId).order('thu_tu').limit(200)
  if (error) throw error
  return (data ?? []) as CauHTD[]
}
