// onthi.ts — Box "Ôn thi giữa kì I" của app HS (Thùy 16/10). Chỉ GỌI RPC (mig 202610161054): HS thấy đề ĐÃ DUYỆT đúng khối của em.
import { supabase } from './supabase'
import type { MenhDe } from './kho/api'

export type TabOnThi = 'de_cuong' | 'de_thi'
export type DeOnThi = { id: string; ten: string; tab: TabOnThi; nguon: string | null; nam: number | null; so_cau: number
  thoi_gian_phut: number; bai_thi_id: string | null; da_nop: boolean }
export type CauOnThi = {
  stt: number; ma_cau: string; loai_cau: string | null; noi_dung: string | null
  lua_chon: string[] | null; menh_de: MenhDe[] | null; dap_an: string | null; loi_giai: string | null
  anh_de: string | null; anh_dap_an: string | null
}
export type DeOnThiXem = { id: string; ten: string; phans: { tieu_de: string | null; cau: CauOnThi[] }[] }

export async function onThiDs(mon: string): Promise<DeOnThi[]> {
  const { data, error } = await supabase.rpc('fn_hs_on_thi_ds', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as DeOnThi[]
}
export async function onThiXem(deId: string): Promise<DeOnThiXem | null> {
  const { data, error } = await supabase.rpc('fn_hs_on_thi_xem', { p_de: deId })
  if (error) throw error
  return (data ?? null) as DeOnThiXem | null
}

// Luyện tập đề cương (pha 1): sinh 1 lượt bai_test loai 'on_thi_luyen' — không ghi mastery.
export async function onThiLuyenSinh(deId: string): Promise<{ baiTestId: string; soCau: number; soBoQua: number }> {
  const { data, error } = await supabase.rpc('fn_hs_on_thi_luyen_sinh', { p_de: deId })
  if (error) throw error
  const d = data as { bai_test_id: string; so_cau: number; so_bo_qua: number }
  return { baiTestId: d.bai_test_id, soCau: d.so_cau, soBoQua: d.so_bo_qua }
}

// Thi thử đề trường (pha 2): sinh / trả lại lượt thi duy nhất của em cho đề (loai 'thi_thu', không ghi mastery).
export async function onThiBatDau(deId: string): Promise<{ baiTestId: string; lai: boolean }> {
  const { data, error } = await supabase.rpc('fn_hs_thi_thu_bat_dau', { p_de: deId })
  if (error) throw error
  const d = data as { bai_test_id: string; lai: boolean }
  return { baiTestId: d.bai_test_id, lai: d.lai }
}

// ── Điểm Thi thử (pha 3): còn câu tự luận chưa chấm ⇒ dang_cham, chỉ lộ phần trắc nghiệm ──
export type DiemThiThu = {
  dang_cham: boolean; so_cho_cham: number; tn_diem: number; tn_toi_da: number; toi_da: number
  diem: number | null; diem_10: number | null; phan: { phan: string; toi_da: number; diem: number }[]
}
export async function onThiDiem(baiTestId: string): Promise<DiemThiThu | null> {
  const { data, error } = await supabase.rpc('fn_hs_thi_thu_diem', { p_bai_test: baiTestId })
  if (error) throw error
  return (data ?? null) as DiemThiThu | null
}

// ── Ảnh tự luận (bucket PRIVATE 'thi-thu-anh', scripts/sql_thi_thu_anh_storage.sql) ──
export const ANH_TL_BUCKET = 'thi-thu-anh'
export const ANH_TL_TOI_DA = 8 // khớp policy thi_thu_anh_hs_insert
export type AnhTuLuan = { id: string; bai_test_cau_id: string; path: string; thu_tu: number }

export async function listAnhTuLuan(baiLamId: string): Promise<AnhTuLuan[]> {
  const { data, error } = await supabase.from('thi_thu_anh').select('id,bai_test_cau_id,path,thu_tu').eq('bai_lam_id', baiLamId).order('thu_tu').limit(200)
  if (error) throw error
  return (data ?? []) as AnhTuLuan[]
}
export async function kyAnhTuLuan(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {}
  const { data, error } = await supabase.storage.from(ANH_TL_BUCKET).createSignedUrls(paths, 3600)
  if (error) throw error
  const out: Record<string, string> = {}
  for (const r of data ?? []) if (r.signedUrl && r.path) out[r.path] = r.signedUrl
  return out
}
// Upload file (đã thu nhỏ) rồi ghi dòng: dòng CHỈ có khi ảnh đã lên thật. Ảnh mồ côi (insert hỏng sau upload) vô hại — bucket private.
export async function nopAnhTuLuan(hocSinhId: string, baiLamId: string, cauId: string, blob: Blob, thuTu: number): Promise<AnhTuLuan> {
  const path = `${hocSinhId}/${baiLamId}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from(ANH_TL_BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  const { data, error: e2 } = await supabase.from('thi_thu_anh').insert({ bai_lam_id: baiLamId, bai_test_cau_id: cauId, path, thu_tu: thuTu }).select('id,bai_test_cau_id,path,thu_tu').single()
  if (e2) throw e2
  return data as AnhTuLuan
}
export async function xoaAnhTuLuan(id: string): Promise<void> {
  const { error } = await supabase.from('thi_thu_anh').delete().eq('id', id)
  if (error) throw error
}

// ── BXH theo đề (pha 4): chỉ gồm bài đã chấm xong; bài của em chưa chấm xong ⇒ dang_cham (không lộ gì). null = không có lượt thi nộp. ──
export type BxhThiThuDong = { hang: number; ma_hs: string; ho_ten: string; diem_10: number; la_toi: boolean }
export type BxhThiThu = { de_id: string; de_ten: string; dang_cham: boolean; tong?: number; toi?: { hang: number; diem_10: number } | null; top?: BxhThiThuDong[] }
export async function onThiBxh(deId: string, top = 20): Promise<BxhThiThu | null> {
  const { data, error } = await supabase.rpc('fn_hs_thi_thu_bxh', { p_de: deId, p_top: top })
  if (error) throw error
  return (data ?? null) as BxhThiThu | null
}
