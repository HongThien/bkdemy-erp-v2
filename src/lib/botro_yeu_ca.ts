// Data-layer CA BỔ TRỢ YẾU (PLAN-botro-yeu-ca.md) — 2 app, 1 buổi: app HS làm bài · app TA điều hành.
// MỌI logic ở Postgres (fn_btyeu_*, migration 202609030307 + 202609030326); file này chỉ gọi RPC + type.
// KHÔNG tính toán gì ở đây (CLAUDE.md §2.0) — kể cả "đã học cụm nào" cũng do DB derive.
import { supabase } from './supabase'
import type { BaiTestCuaHS, BaiLam } from './testonline'

// ── App HỌC SINH ─────────────────────────────────────────────────────────────
export type CumCaHS = {
  ma_cum: string; ten: string; thu_tu: number; tien_de: string[]
  so_cau_kho: number; so_cau: number; so_dung: number
}
export type DangCaHS = {
  ma_dang: string; ten_dang: string; ten_chuyen_de: string; da_day_truoc: boolean
  diem_luc_mo: number | null; so_cau: number; so_dung: number; cums: CumCaHS[]
}
export type CaCuaToi = {
  buoi_id: string; mon: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  ta_ten: string | null; dangs: DangCaHS[]
  test: { bai_test_id: string; so_cau: number; da_nop: boolean } | null
}
// null = hôm nay em không có ca / chưa được điểm danh có mặt / ca đã hoàn tất.
export async function caCuaToi(): Promise<CaCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_btyeu_ca_cua_toi')
  if (error) throw error
  return (data as CaCuaToi | null) ?? null
}
// 1 LÔ luyện (mặc định 3 câu) trong cụm (null = cả dạng). App tự gọi lô mới khi hết — em luyện tới khi TA bảo next.
export async function sinhLoLuyen(buoiId: string, maDang: string, maCum: string | null, soCau = 3): Promise<{ bai_test_id: string; so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_btyeu_luyen_sinh', { p_buoi: buoiId, p_ma_dang: maDang, p_ma_cum: maCum, p_so_cau: soCau })
  if (error) throw error
  return data as { bai_test_id: string; so_cau: number }
}
// 1 bài cá nhân (test cuối ca / retest) dạng BaiTestCuaHS để đưa thẳng vào LamET (chế độ thi) — RLS
// bai_test_hs_read đã cho em đọc bài có hoc_sinh_id = em (migration 202609030307 §2).
export async function layBaiTestCaNhan(baiTestId: string): Promise<BaiTestCuaHS> {
  const { data, error } = await supabase.from('bai_test').select('*, lop:lop_id(ten_lop)').eq('id', baiTestId).single()
  if (error) throw error
  const { data: lams } = await supabase.from('bai_lam').select('*').eq('bai_test_id', baiTestId).limit(1)
  const t = data as any
  return { ...t, lop_ten: t.lop?.ten_lop ?? '', bai_lam: (lams?.[0] as BaiLam | undefined) ?? null }
}
export type RetestCuaToi = { bai_test_id: string; ngay: string; mon: string; so_cau: number; lop_id: string; da_nop: boolean; nop_at: string | null; buoi_bo_tro_ngay: string | null }
export async function retestCuaToi(): Promise<RetestCuaToi[]> {
  const { data, error } = await supabase.rpc('fn_btyeu_retest_cua_toi')
  if (error) throw error
  return (data as RetestCuaToi[]) ?? []
}

// ── App TRỢ GIẢNG ────────────────────────────────────────────────────────────
export type ViecCaBoTro = {
  buoi_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; mon: string; level: number | null
  diem_danh: string | null; so_dang: number; co_test: boolean; test_da_nop: boolean; danh_gia_xong_at: string | null
}
export type ViecRetest = {
  bai_test_id: string; ngay: string; mon: string; so_cau: number; lop_id: string; ten_lop: string
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; da_nop: boolean; buoi_bo_tro_ngay: string | null
}
// Việc bổ trợ yếu của TÔI: ca tôi đứng (hôm nay + chưa hoàn tất các ngày trước) + retest của lớp tôi là TA đến hạn.
export async function viecBoTroCuaToi(): Promise<{ ca: ViecCaBoTro[]; retest: ViecRetest[] }> {
  const { data, error } = await supabase.rpc('fn_btyeu_viec_cua_toi')
  if (error) throw error
  const d = (data ?? {}) as { ca?: ViecCaBoTro[]; retest?: ViecRetest[] }
  return { ca: d.ca ?? [], retest: d.retest ?? [] }
}

export type CumTienDo = { ma_cum: string | null; ten: string; so_cau: number; so_dung: number; so_goi_y: number; cau_cuoi_at: string | null }
export type DangCaTA = {
  ma_dang: string; ten_dang: string; ten_chuyen_de: string
  day_at: string | null; day_buoi_id: string | null; dong_at: string | null; diem_luc_mo: number | null
  retest_diem: number | null; retest_at: string | null; dat: boolean | null
  so_cau: number; so_dung: number; so_goi_y: number; cau_cuoi_at: string | null; cums: CumTienDo[]
}
export type CaTA = {
  buoi_id: string; mon: string; ngay: string; trang_thai: string; diem_danh: string | null; buoi_hoc_hs_id: string
  nguoi_day_tg: string | null; danh_gia_xong_at: string | null; bo_tro_yeu_id: string
  hs: { id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; level: number | null }
  dangs: DangCaTA[]
  test: { bai_test_id: string; so_cau: number; da_nop: boolean | null; nop_at: string | null; theo_dang: { ma_dang: string; so_cau: number; so_dung: number }[] } | null
  retest: { bai_test_id: string; ngay: string; so_cau: number; da_nop: boolean; nop_at: string | null } | null
  danh_gia: { nhan_xet: string | null; muc_ma: string | null } | null
  so_lan_huy: number
}
export async function caTA(buoiId: string): Promise<CaTA | null> {
  const { data, error } = await supabase.rpc('fn_btyeu_ca_ta', { p_buoi: buoiId })
  if (error) throw error
  return (data as CaTA | null) ?? null
}
export type KetQuaDongCa = { bo_tro_test_id: string | null; retest_id: string | null; retest_ngay: string | null; khong_hoc: boolean; da_dong_truoc?: boolean }
// Đóng ca: chốt dạng đã dạy + sinh test cuối ca + sinh retest tầng 2 (1 transaction, idempotent).
export async function dongCa(buoiId: string): Promise<KetQuaDongCa> {
  const { data, error } = await supabase.rpc('fn_btyeu_dong_ca', { p_buoi: buoiId })
  if (error) throw error
  return data as KetQuaDongCa
}
// Hoàn tất ca: nhận xét + mức; test chưa nộp thì bắt buộc có lý do "không test" (Thùy 03/09).
// Thùy 24/09: buổi xong ⇒ case phải tiến — TA tick dạng ĐÃ DẠY (dangDay). DB đánh dấu dạy + bổ sung retest cho mọi dạng vừa dạy.
export async function hoanTatCa(buoiId: string, nhanXet: string, mucMa: string | null, khongTestLyDo: string | null, dangDay?: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_btyeu_hoan_tat', { p_buoi: buoiId, p_nhan_xet: nhanXet, p_muc_ma: mucMa, p_khong_test_ly_do: khongTestLyDo, p_dang_day: dangDay ?? null })
  if (error) throw error
}

// ── LỊCH BỔ TRỢ của HS (Thùy 09-09: "ca bổ trợ hiện ở app TA nhưng chưa hiện ở app HS") ──────────
// `caCuaToi` chỉ trả ca yếu HÔM NAY đã điểm danh có mặt (để vào luyện) — còn LỊCH (đã xếp, sắp tới, cả 3 loại
// yếu/bù/đuổi) nằm ở `fn_hs_lich_bo_tro` (migration 202609091750). Box "Bổ trợ" màn chính đọc cái này.
export type LoaiBoTro = 'bo_tro_yeu' | 'bu' | 'bo_tro_duoi'
export type LichBoTro = {
  buoi_id: string; loai: LoaiBoTro; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null
  phong: string | null; mon: string | null; nguoi: string | null; diem_danh: string | null
  hom_nay: boolean; vao_ca: boolean // vao_ca = ca yếu hôm nay, đã có mặt, chưa hoàn tất ⇒ bấm "Vào ca" (CaBoTroHS)
}
export const LOAI_BO_TRO_TEN: Record<LoaiBoTro, string> = { bo_tro_yeu: 'Bổ trợ yếu', bu: 'Học bù', bo_tro_duoi: 'Học đuổi' }
export async function lichBoTroCuaToi(): Promise<LichBoTro[]> {
  const { data, error } = await supabase.rpc('fn_hs_lich_bo_tro')
  if (error) throw error
  return (data as LichBoTro[]) ?? []
}

// ── TA CHỈNH KẾT QUẢ CÂU TRẢ LỜI NGẮN (Thùy 19/09) — tự luận biến thành trả lời ngắn khó gõ khớp đáp án ⇒ em đúng mà máy chấm sai.
// Chỉ câu tra_loi_ngan của bài thuộc ca bổ trợ yếu; mọi lần chỉnh có log (bai_lam_cau_sua_log). Migration btyeu_ta_sua_ket_qua_tln.
export type CauTlnTA = {
  bai_lam_cau_id: string; loai_bai: 'bo_tro' | 'bo_tro_test' | 'retest'; ma_dang: string | null; ma_cau: string | null; thu_tu: number
  noi_dung: string | null; anh_de: string | null; dap_an_key: unknown; loi_giai: string | null
  dap_an_hs: unknown; verdict: 'correct' | 'partial' | 'wrong'; cham_boi: string | null; cham_at: string | null; da_sua: boolean
}
export async function cauTlnCuaCa(buoiId: string): Promise<CauTlnTA[]> {
  const { data, error } = await supabase.rpc('fn_btyeu_ta_cau_tln', { p_buoi: buoiId })
  if (error) throw error
  return (data as CauTlnTA[]) ?? []
}
export async function suaKetQuaTln(baiLamCauId: string, dung: boolean, lyDo?: string | null): Promise<{ verdict: 'correct' | 'wrong'; doi: boolean }> {
  const { data, error } = await supabase.rpc('fn_btyeu_ta_sua_ket_qua', { p_bai_lam_cau: baiLamCauId, p_dung: dung, p_ly_do: lyDo ?? null })
  if (error) throw error
  return data as { verdict: 'correct' | 'wrong'; doi: boolean }
}

// ── THEO DÕI CA TRONG NGÀY + IN TÀI LIỆU GIẤY (Thùy 21/09) — migration 202609211729. In = CÙNG logic đưa câu của app (MCQ tuyệt đối,
// né câu đã gặp); bài in là bai_test loai 'bo_tro' có in_giay_at nên tiến độ/test cuối ca thấy như bài app. Kết quả giấy: nhân sự bấm đáp án
// em khoanh, MÁY chấm theo key.
export type CaTheoDoi = {
  buoi_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; trang_thai: string
  nguoi_day_tg: string | null; nguoi_ten: string | null; mon: string; case_id: string; uu_tien: number
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; diem_danh: string | null; buoi_hoc_hs_id: string; level: number
  so_dang: number; so_cau: number; so_dung: number; cau_cuoi_at: string | null
  che_do: CheDoCa | null
  bai_giay: { bai_test_id: string; loai: 'bo_tro' | 'bo_tro_test'; so_cau: number; in_giay_at: string; da_nhap: number }[]
  da_dong: boolean; test_da_nop: boolean; danh_gia_xong_at: string | null
}
export async function caTheoDoi(ngay?: string): Promise<CaTheoDoi[]> {
  const { data, error } = await supabase.rpc('fn_btyeu_ca_theo_doi', { p_ngay: ngay ?? null })
  if (error) throw error
  return (data as CaTheoDoi[]) ?? []
}
export type CauInGiay = {
  id: string; thu_tu: number; ma_cau: string | null; ma_dang: string | null; ten_dang: string
  noi_dung: string | null; lua_chon: string[] | null; anh_de: string | null; dap_an_key: unknown; loi_giai: string | null
  chon: number | null; verdict: 'correct' | 'wrong' | null
}
export type BaiInGiay = {
  bai_test_id: string; loai: 'bo_tro' | 'bo_tro_test'; da_nop: boolean; mon: string; ngay: string; in_giay_at: string | null; buoi_id: string | null
  hs: { id: string; ho_ten: string; ma_hs: string | null; khoi: string | null }
  gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; nguoi_ten: string | null; caus: CauInGiay[]
}
export async function inSinhBaiGiay(buoiId: string, soCauMoiDang = 5): Promise<{ bai_test_id: string; so_cau: number; dang_khong_co_cau: string[] }> {
  const { data, error } = await supabase.rpc('fn_btyeu_in_sinh', { p_buoi: buoiId, p_so_cau: soCauMoiDang })
  if (error) throw error
  return data as { bai_test_id: string; so_cau: number; dang_khong_co_cau: string[] }
}
// Phiếu giấy của 1 ca (cho app TA) — list thô; số câu đã nhập lấy từ fn_btyeu_in_lay khi mở phiếu.
export async function listPhieuGiayCuaCa(buoiId: string): Promise<{ bai_test_id: string; so_cau: number; in_giay_at: string }[]> {
  const { data, error } = await supabase.from('bai_test').select('id, so_cau, in_giay_at')
    .eq('buoi_hoc_id', buoiId).eq('loai', 'bo_tro').not('in_giay_at', 'is', null) // chỉ phiếu LUYỆN; test giấy đi qua khối Đóng ca.order('in_giay_at').limit(50)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({ bai_test_id: r.id, so_cau: r.so_cau, in_giay_at: r.in_giay_at }))
}
// ── 2 CHẾ ĐỘ CA (Thùy 21/09): 'app' = em làm 100% trên iPad · 'giay' = in giấy, TA nhập đáp án em khoanh (cả test cuối ca). TA bấm chọn.
export type CheDoCa = 'app' | 'giay'
export async function layCheDoCa(buoiHocHsId: string): Promise<CheDoCa | null> {
  const { data, error } = await supabase.from('buoi_hoc_hs').select('btyeu_che_do').eq('id', buoiHocHsId).single()
  if (error) throw error
  return ((data as any)?.btyeu_che_do ?? null) as CheDoCa | null
}
export async function datCheDoCa(buoiHocHsId: string, cheDo: CheDoCa): Promise<void> {
  const { error } = await supabase.from('buoi_hoc_hs').update({ btyeu_che_do: cheDo }).eq('id', buoiHocHsId)
  if (error) throw error
}
// Test cuối ca in giấy: đánh dấu in → trả id để lấy nội dung; nộp = câu chưa nhập tính bỏ trống (sai), chuyển da_nop.
export async function inTestGiay(buoiId: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_btyeu_in_test', { p_buoi: buoiId })
  if (error) throw error
  return (data as { bai_test_id: string }).bai_test_id
}
export async function nopTestGiay(baiTestId: string): Promise<{ bo_trong: number; so_dung: number; so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_btyeu_giay_nop', { p_bai_test: baiTestId })
  if (error) throw error
  return data as { bo_trong: number; so_dung: number; so_cau: number }
}
export async function inLayBaiGiay(baiTestId: string): Promise<BaiInGiay> {
  const { data, error } = await supabase.rpc('fn_btyeu_in_lay', { p_bai_test: baiTestId })
  if (error) throw error
  if (!data) throw new Error('Không thấy bài in.')
  return data as BaiInGiay
}
export async function giayNhapKetQua(baiTestCauId: string, chon: number | null): Promise<{ chon: number | null; verdict: 'correct' | 'wrong' | null }> {
  const { data, error } = await supabase.rpc('fn_btyeu_giay_nhap', { p_bai_test_cau: baiTestCauId, p_chon: chon })
  if (error) throw error
  return data as { chon: number | null; verdict: 'correct' | 'wrong' | null }
}

// ── BỔ TRỢ TRONG NGÀY ngoài yếu (Thùy 23/09: tab Đang diễn ra = mọi bổ trợ liên quan ngày đó, kể cả retest). Yếu vẫn qua caTheoDoi.
export type BuoiNgay = { buoi_id: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; trang_thai: string; nguoi: string | null; so_hs: number
  hs: { ho_ten: string; khoi: string | null; diem_danh: string | null; lop_goc?: string | null; lop?: string | null }[] }
export type RetestNgay = { bai_test_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; mon: string; lop: string | null; so_cau: number; ta_lop: string | null; da_nop: boolean; so_dung: number; qua_han: boolean }
export async function boTroTrongNgay(ngay?: string): Promise<{ bu: BuoiNgay[]; duoi: BuoiNgay[]; retest: RetestNgay[] }> {
  const { data, error } = await supabase.rpc('fn_bo_tro_trong_ngay', { p_ngay: ngay ?? null })
  if (error) throw error
  const d = (data ?? {}) as any
  return { bu: d.bu ?? [], duoi: d.duoi ?? [], retest: d.retest ?? [] }
}
