// Data-layer BT (tài liệu bổ trợ) — gán theo HỌC SINH, KHÔNG theo lớp (khác ET/MT/Giáo trình).
// Vẫn 1 dòng tai_lieu(loai='bo_tro') + tai_lieu_phan/tai_lieu_cau dùng CHUNG cỗ máy phần/câu/in với
// ET/MT (mig 0093 thêm hoc_sinh_id) — chỉ tách RIÊNG màn hình (Thùy 07-10: nhiều loại lẫn vào Kho
// tài liệu chung sẽ khó tìm). Câu chọn theo dạng YẾU của chính HS — xem getMasteryHS (mastery.ts).
// Chấm BT (Thùy chốt 07-10): LUÔN vào mastery, nguồn 'bt' trọng số 1 (thấp nhất cùng BTVN, nhưng
// KHÔNG qua toggle như BTVN — BT là hệ thống chủ động giao bài nên kết quả phải tự cập nhật).
// bt_grades (mig 0094) — bảng RIÊNG, không tái dùng gami_session_problems/gami_grades vì BT luôn
// đúng 1 HS × N câu (không có buổi/session), khác N-HS×N-câu/1-buổi mà 2 bảng đó phục vụ.
import { supabase } from './supabase'
import { listPhan, addPhan, type TaiLieu, type TaiLieuPhan } from './tailieu'

const LIMIT = 10000

// Tìm HS theo tên/mã (cho bước "Chọn học sinh" khi tạo BT) — kèm LỚP đang học để phân biệt trùng tên.
export async function timHocSinhBT(q: string): Promise<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null; lop: string[] }[]> {
  if (!q.trim()) return []
  const { data, error } = await supabase.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi, hoc_sinh_lop(trang_thai, lop:lop_id(ten_lop))')
    .or(`ho_ten.ilike.%${q.trim()}%,ma_hs.ilike.%${q.trim()}%`).eq('trang_thai', 'dang_hoc').order('ho_ten').limit(8)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    id: r.id, ma_hs: r.ma_hs, ho_ten: r.ho_ten, khoi: r.khoi,
    lop: (r.hoc_sinh_lop ?? []).filter((x: any) => x.trang_thai === 'dang_hoc').map((x: any) => x.lop?.ten_lop).filter(Boolean),
  }))
}
// Môn HS đang học (suy từ lớp đang ghi danh) — BT phải chọn đúng 1 môn để soi mastery (§1.6 CLAUDE.md).
export async function monCuaHS(hocSinhId: string): Promise<string[]> {
  const { data, error } = await supabase.from('hoc_sinh_lop').select('lop:lop_id(mon)').eq('hoc_sinh_id', hocSinhId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (error) throw error
  return [...new Set((data ?? []).map((r: any) => r.lop?.mon).filter(Boolean))] as string[]
}

export type BT = TaiLieu & { hoc_sinh_id: string; hoc_sinh?: { ho_ten: string; ma_hs: string | null } | null }
function mapBT(r: any): BT { return { ...r, hoc_sinh: r.hoc_sinh ?? null } }

export async function getBT(id: string): Promise<BT> {
  const { data, error } = await supabase.from('tai_lieu').select('*, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs)').eq('id', id).single()
  if (error) throw error
  return mapBT(data)
}
// list(hocSinhId) → BT của riêng 1 HS. Không truyền → TOÀN BỘ Kho BT (màn danh sách chính).
export async function listBT(hocSinhId?: string): Promise<BT[]> {
  let q = supabase.from('tai_lieu').select('*, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs)').eq('loai', 'bo_tro').order('created_at', { ascending: false }).limit(LIMIT)
  if (hocSinhId) q = q.eq('hoc_sinh_id', hocSinhId)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map(mapBT)
}
export async function createBT(input: { hocSinhId: string; ten: string; khoi: string; mon: string }): Promise<TaiLieu> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('tai_lieu')
    .insert({ loai: 'bo_tro', ten: input.ten, khoi: input.khoi, mon: input.mon, hoc_sinh_id: input.hocSinhId, created_by: user?.id ?? null })
    .select().single()
  if (error) throw error
  return data as TaiLieu
}
export async function renameBT(id: string, ten: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu').update({ ten, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteBT(id: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu').delete().eq('id', id) // cascade phan + cau
  if (error) throw error
}

// BT dạng-centric: MỖI DẠNG 1 phan (loai_phan='dang', ref_ma=ma_dang) — giống hệt khối "Bài luyện"
// của Giáo trình (TaiLieuBuilder/DangCard) → tái dùng NGUYÊN autoSuggestByLoai/setCauOfPhan/getTaiLieuFull
// (đã tự resolve .dang/.caus cho loai_phan='dang'), có số lượng theo LOẠI CÂU + số dòng tự luận.
export async function addDangBT(taiLieuId: string, maDang: string): Promise<TaiLieuPhan> {
  const phans = await listPhan(taiLieuId)
  const ex = phans.find((p) => p.loai_phan === 'dang' && p.ref_ma === maDang)
  if (ex) return ex
  const thuTu = phans.filter((p) => p.loai_phan === 'dang').length
  return addPhan({ tai_lieu_id: taiLieuId, thu_tu: thuTu, loai_phan: 'dang', ref_ma: maDang, tieu_de: null, noi_dung: null })
}

// ── CHẤM BT (bt_grades, mig 0094) — mirror gradeET/deleteGrade (gami.ts): upsert Đ/C/S per câu,
// xoá dòng khi "bỏ chấm" (anti-NULL — không có state "chưa chấm nhưng có dòng"). ──
export type BTGradeResult = 'correct' | 'partial' | 'wrong'
export type BTGrade = { id: string; tai_lieu_id: string; ma_cau: string; ma_dang: string; result: BTGradeResult; graded_by: string | null; graded_at: string }

export async function getBTGrades(taiLieuId: string): Promise<BTGrade[]> {
  const { data, error } = await supabase.from('bt_grades').select('*').eq('tai_lieu_id', taiLieuId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as BTGrade[]
}
export async function gradeBTCau(taiLieuId: string, maCau: string, maDang: string, result: BTGradeResult): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bt_grades')
    .upsert({ tai_lieu_id: taiLieuId, ma_cau: maCau, ma_dang: maDang, result, graded_by: user?.id ?? null }, { onConflict: 'tai_lieu_id,ma_cau' })
  if (error) throw error
}
export async function deleteBTGrade(taiLieuId: string, maCau: string): Promise<void> {
  const { error } = await supabase.from('bt_grades').delete().match({ tai_lieu_id: taiLieuId, ma_cau: maCau })
  if (error) throw error
}
