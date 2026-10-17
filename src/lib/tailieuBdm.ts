// Giáo trình theo BẢN ĐỒ MỚI (spec-builder-ban-do-moi.md · mig 202610172312).
// Mọi chọn/xếp hạng/đặt buổi ở DB (fn_tl_bdm_*, CLAUDE.md §2.0); file này chỉ gọi hàm + CRUD dòng đơn.
// Danh tính dữ liệu = CÂU (A0): phần lưu mã câu; id nhóm/dạng bài chỉ dựng khung buổi + in.
import { supabase } from './supabase'

// ── Cây chọn (bộ chọn nhóm / dạng bài) ──
export type ChonDangBai = { id: string; ten: string; mo_ta: string; so: number; co_ly_thuyet: boolean; co_vi_du: boolean; so_cau: number }
export type ChonNhom = { id: string; ten: string; mo_ta: string; so: number; co_ly_thuyet: boolean; so_cau_chua_phan: number; dang_bai: ChonDangBai[] }
export type ChonChuyenDe = { id: string; ten: string; so: number; nhom: ChonNhom[] }
export type ChonChuDe = { id: string; ten: string; chuyen_de: ChonChuyenDe[] }
export async function cayChon(khoi: string, nhanh = 'toan'): Promise<ChonChuDe[]> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_cay_chon', { p_khoi: khoi, p_nhanh: nhanh })
  if (error) throw error
  return ((data as { chu_de: ChonChuDe[] })?.chu_de ?? [])
}

// ── Nội dung giáo trình (builder + in) ──
export type KhoiCau = { phan_id: string; caus: string[] }
export type NdDangBai = {
  phan_id: string; id: string; stt: number; hien_lt: boolean; hien_vi_du: boolean
  ten: string | null; mo_ta: string | null; con_tren_ban_do: boolean
  ly_thuyet: string | null; ly_thuyet_file_url: string | null; vi_du: string | null; vi_du_file_url: string | null
  caus: string[]
}
export type NdNhom = {
  phan_id: string; id: string; stt: number; hien_lt: boolean
  ten: string | null; mo_ta: string | null; con_tren_ban_do: boolean
  ly_thuyet: string | null; ly_thuyet_file_url: string | null
  dang_bai: NdDangBai[]; chua_phan: KhoiCau | null; btvn: KhoiCau | null
}
export type NdBuoi = { id: string; tieu_de: string | null; thu_tu: number; nhom: NdNhom[]; chua_khop: KhoiCau | null }
export type NoiDung = {
  tai_lieu: { id: string; ten: string; khoi: string; mon: string; nhanh: string | null; ban_do: 'cu' | 'moi'; luu_tru_tu: string | null; cau_hinh: Record<string, unknown>; updated_at: string }
  buoi: NdBuoi[]
}
export async function noiDung(taiLieuId: string, buoiId?: string | null): Promise<NoiDung> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_noi_dung', { p_tai_lieu: taiLieuId, p_buoi: buoiId ?? null })
  if (error) throw error
  return data as NoiDung
}

// ── Đặt nhóm + dạng bài cho 1 buổi (1 transaction ở DB) — trả lại buổi đó để vá tại chỗ ──
export type ChonBuoi = { nhom: string; dang_bai: string[] }[]
export async function datBuoi(taiLieuId: string, buoiId: string, chon: ChonBuoi): Promise<NdBuoi> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_dat_buoi', { p_tai_lieu: taiLieuId, p_buoi: buoiId, p_chon: chon })
  if (error) throw error
  return (data as NoiDung).buoi[0]
}
// Thay câu của 1 phần (dạng bài / chưa phân / BTVN nhóm) — DB chặn câu đã dùng ở phần khác cùng buổi.
export async function datCau(phanId: string, maCaus: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_tl_bdm_dat_cau', { p_phan: phanId, p_ma_caus: maCaus })
  if (error) throw error
}

// ── Gợi ý câu (luật cũ: rải dạng bài → rải cụm → ít dùng, câu gốc trước) ──
// soLuong: { trac_nghiem: n, tra_loi_ngan: n, tu_luan: n } — tự thêm _tong = tổng để lấp khi loại nào thiếu câu.
export async function goiY(nhomId: string, dangBai: string[] | null, soLuong: Record<string, number>, tru: string[]): Promise<string[]> {
  const tong = Object.values(soLuong).reduce((s, n) => s + n, 0) // tổng ô người gõ (UI), không phải số liệu nghiệp vụ
  const { data, error } = await supabase.rpc('fn_tl_bdm_goi_y', { p_nhom: nhomId, p_dang_bai: dangBai, p_so: { ...soLuong, _tong: tong }, p_tru: tru })
  if (error) throw error
  return (data ?? []) as string[]
}
export const SO_LUYEN_MAC_DINH: Record<string, number> = { trac_nghiem: 1, tra_loi_ngan: 0, tu_luan: 1 }
export const SO_BTVN_MAC_DINH: Record<string, number> = { trac_nghiem: 2, tra_loi_ngan: 1, tu_luan: 1 }

// ── Kho câu của 1 nhóm (cho "✎ Chọn câu") ──
export type CauKho = { ma_cau: string; dang_bai_id: string | null; loai_cau: string; la_goc: boolean; cum: string; so_lan_dung: number }
export async function cauCuaNhom(nhomId: string): Promise<CauKho[]> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_cau', { p_nhom: nhomId })
  if (error) throw error
  return (data ?? []) as CauKho[]
}

// Dạng bài của 1 nhóm theo thứ tự bản đồ (chỉ để đặt tên nhóm câu trong popup chọn câu).
export async function dangBaiCuaNhom(nhomId: string): Promise<{ id: string; ten: string }[]> {
  const { data, error } = await supabase.from('dai_bdm_dang_bai').select('id, ten').eq('nhom_id', nhomId).order('thu_tu').order('id').limit(500)
  if (error) throw error
  return (data ?? []) as { id: string; ten: string }[]
}

// ── Cờ in của 1 phần (CRUD dòng đơn) ──
export async function datCoPhan(phanId: string, patch: { hien_lt?: boolean; hien_vi_du?: boolean }): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').update(patch).eq('id', phanId)
  if (error) throw error
}
// Xoá 1 buổi: xoá mốc buổi — phần con (nhóm → dạng bài/BTVN) + câu tự xoá theo cha_id (cascade ở DB).
export async function xoaBuoi(buoiId: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').delete().eq('id', buoiId).eq('loai_phan', 'buoi')
  if (error) throw error
}

// Mọi mã câu đang có trong 1 buổi (để nạp nội dung câu + né trùng khi gợi ý).
export function cauCuaBuoi(b: NdBuoi): string[] {
  return b.nhom.flatMap((n) => [...n.dang_bai.flatMap((d) => d.caus), ...(n.chua_phan?.caus ?? []), ...(n.btvn?.caus ?? [])]).concat(b.chua_khop?.caus ?? [])
}
// Lỗi RPC → câu người đọc được (P0001 do hàm DB raise đã là tiếng Việt).
export function loiDoc(e: unknown): string {
  const m = (e as { message?: string })?.message ?? String(e)
  return m
}
