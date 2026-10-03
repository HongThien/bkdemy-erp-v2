// ============================================================================
// rank.ts — RANK + THỬ THÁCH (spec-thanh-tuu-nhiem-vu.md §0.2–0.3, mig 202609281711).
// Mọi con số (Điểm Rank, bậc, sao, ghế thần, hạng, trần Thử thách) tính ở Postgres — ở đây CHỈ gọi RPC.
// Thử thách = 1 lượt y hệt Tự luyện tổng hợp (L4): SERVER chọn dạng (fn_thu_thach_sinh_tu_dong, mig 202610011547 — HS không còn chọn
// được dạng dễ để lấy Điểm Rank), sinh câu bằng thu_thach_sinh (= tu_luyen_sinh + đánh dấu). Chấm pass / điểm / trần ở trigger lúc nộp.
// ============================================================================
import { supabase } from './supabase'

// Lượt Thử thách hôm nay còn dở (làm tiếp) — hoặc null.
export async function thuThachLuotDo(mon: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('thu_thach_luot_do', { p_mon: mon })
  if (error) throw error
  return (data as string | null) ?? null
}

export async function sinhThuThach(mon: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_thu_thach_sinh_tu_dong', { p_mon: mon })
  if (error) throw error
  return (data as { bai_test_id: string }).bai_test_id
}

export type KetQuaThuThach = {
  so_cau: number; so_dung: number; pass: boolean; pass_can: number
  diem_goc: number; diem: number; hom_nay: number; tran_ngay: number; thang: number; tran_thang: number
}

// Kết quả lượt — RPC tự nộp nếu đã làm đủ câu. null = chưa có (nộp nền của LamBai đang chạy) ⇒ thử lại.
export async function ketQuaThuThach(baiTestId: string, lanThu = 6): Promise<KetQuaThuThach | null> {
  for (let i = 0; i < lanThu; i++) {
    const { data, error } = await supabase.rpc('fn_hs_thu_thach_ket_qua', { p_bai_test: baiTestId })
    if (error) throw error
    if (data) return data as KetQuaThuThach
    await new Promise((r) => setTimeout(r, 700))
  }
  return null
}

export type RankToi = {
  diem_mua: number; bac: number; ten_bac: string; sao: number; nguong_bac: number; nguong_sau: number | null
  ghe: 'God of War' | 'Supreme God' | null; hang_khoi: number; so_em_khoi: number; phong_do: number | null; ten_lop: string
}
export type DuaThangToi = { diem_thang: number; hang: number; so_em_co_diem: number; et: number; btvn: number; mt: number; thu_thach: number }
export type RankCuaToi = {
  mon: string; khoi: string; thang: string
  toi: RankToi | null
  top_mua: { ho_ten: string; ten_lop: string; diem_mua: number; ten_bac: string; sao: number; hang: number; la_toi: boolean }[]
  dua_thang: DuaThangToi | null
  top_dua_thang: { ho_ten: string; ten_lop: string; diem: number; hang: number; la_toi: boolean }[]
  bac: { bac: number; ten: string; nguong: number }[]
  thu_thach: { hom_nay: number; tran_ngay: number; thang: number; tran_thang: number }
}

// null = môn chưa mở rank (rank_cau_hinh.bat) hoặc em chưa ghi danh lớp môn này.
export async function rankCuaToi(mon: string): Promise<RankCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_hs_rank_cua_toi', { p_mon: mon })
  if (error) throw error
  return (data as RankCuaToi | null) ?? null
}

// ── Lên bậc (mig rank_len_bac, 01/10) ─────────────────────────────────────────────────────────
// Bậc là SUY ĐỘNG từ điểm mùa; DB ghi SỰ KIỆN "chạm bậc" (ngày chạm suy từ chuỗi điểm theo ngày). Mở Home/Rank gọi lenBacMoi() ⇒ danh sách bậc
// em chưa xem hoạt cảnh (rỗng nếu không có). Xem xong gọi daXemLenBac(). Bậc đạt từ > 2 ngày trước đã coi là xem (không bật hoạt cảnh dữ liệu cũ).
export type LenBacMoi = { bac: number; ten_bac: string; dat_ngay: string; mon: string }
export async function lenBacMoi(mon: string): Promise<LenBacMoi[]> {
  const { data, error } = await supabase.rpc('fn_hs_len_bac_moi', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as LenBacMoi[]
}
export async function daXemLenBac(mon: string): Promise<void> {
  const { error } = await supabase.rpc('fn_hs_len_bac_da_xem', { p_mon: mon })
  if (error) throw error
}
