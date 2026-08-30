// Data-layer LUỒNG PH NỘP BTVN BẰNG ẢNH (seam — UI chỉ gọi qua đây; PLAN-app-ta.md, CEO chốt 30/08).
// Chân lý sống trong ERP DB: btvn_nop (lượt nộp HS×buổi) + btvn_nop_anh (xấp ảnh, path bucket
// PRIVATE 'btvn-nop'). PH ghi qua RPC fn_btvn_nop_tao (role ph_nop, server bkdemy-ph) — phía này
// CHỈ đọc + chấm + trả. Trạng thái nộp: HỆ ĐỀ XUẤT (fn_btvn_de_xuat_trang_thai), TA tick tay.
import { supabase } from './supabase'

export const BTVN_NOP_BUCKET = 'btvn-nop'

export type BtvnNopAnh = { id: string; path: string; path_cham: string | null; thu_tu: number }
export type BtvnNop = {
  hoc_sinh_id: string
  buoi_hoc_id: string
  nop_at: string
  tra_at: string | null
  nhan_xet_ma: string[]
  anh: BtvnNopAnh[]
}
export type NhanXetMau = { ma: string; noi_dung: string; thu_tu: number }

// Lượt nộp của cả buổi, kèm ảnh (sort thu_tu chỉ để hiển thị — danh tính là id).
export async function listNopTheoBuoi(buoiId: string): Promise<Record<string, BtvnNop>> {
  const [n, a] = await Promise.all([
    supabase.from('btvn_nop').select('hoc_sinh_id,buoi_hoc_id,nop_at,tra_at,nhan_xet_ma').eq('buoi_hoc_id', buoiId).limit(1000),
    supabase.from('btvn_nop_anh').select('id,hoc_sinh_id,path,path_cham,thu_tu').eq('buoi_hoc_id', buoiId).order('thu_tu').limit(5000),
  ])
  if (n.error) throw n.error
  if (a.error) throw a.error
  const out: Record<string, BtvnNop> = {}
  for (const r of n.data ?? []) out[r.hoc_sinh_id] = { ...r, nhan_xet_ma: r.nhan_xet_ma ?? [], anh: [] }
  for (const r of a.data ?? []) out[r.hoc_sinh_id]?.anh.push({ id: r.id, path: r.path, path_cham: r.path_cham, thu_tu: r.thu_tu })
  return out
}

// Đề xuất trạng thái nộp (nop_dung_han/nop_muon từ nop_at vs deadline BTVN) — TA tick mới ghi.
export async function deXuatTrangThai(buoiId: string): Promise<Record<string, { nopAt: string; deXuat: string }>> {
  const { data, error } = await supabase.rpc('fn_btvn_de_xuat_trang_thai', { p_buoi_hoc_id: buoiId })
  if (error) throw error
  const out: Record<string, { nopAt: string; deXuat: string }> = {}
  for (const r of (data ?? []) as { hoc_sinh_id: string; nop_at: string; de_xuat: string }[])
    out[r.hoc_sinh_id] = { nopAt: r.nop_at, deXuat: r.de_xuat }
  return out
}

// Bucket PRIVATE → hiển thị bằng signed URL (1h). Ký theo lô để 1 xấp ảnh = 1 round-trip.
export async function signUrls(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {}
  const { data, error } = await supabase.storage.from(BTVN_NOP_BUCKET).createSignedUrls(paths, 3600)
  if (error) throw error
  const out: Record<string, string> = {}
  for (const r of data ?? []) if (r.signedUrl && r.path) out[r.path] = r.signedUrl
  return out
}

// Lưu bản TA đánh dấu: upload PNG MỚI (path riêng `cham/`), ảnh gốc immutable, rồi ghi path_cham.
export async function uploadAnhCham(anhId: string, blob: Blob): Promise<string> {
  const path = `cham/${anhId}-${Date.now()}.png`
  const { error } = await supabase.storage.from(BTVN_NOP_BUCKET).upload(path, blob, { contentType: 'image/png', upsert: false })
  if (error) throw error
  const { error: e2 } = await supabase.from('btvn_nop_anh').update({ path_cham: path }).eq('id', anhId)
  if (e2) throw e2
  return path
}

export async function listNhanXetMau(): Promise<NhanXetMau[]> {
  const { data, error } = await supabase.from('btvn_nhan_xet_mau').select('ma,noi_dung,thu_tu').eq('active', true).order('thu_tu').limit(100)
  if (error) throw error
  return data ?? []
}

export async function setNhanXet(buoiId: string, hocSinhId: string, ma: string[]): Promise<void> {
  const { error } = await supabase.from('btvn_nop').update({ nhan_xet_ma: ma })
    .eq('buoi_hoc_id', buoiId).eq('hoc_sinh_id', hocSinhId)
  if (error) throw error
}

// Trả bài 1 HS (mở khoá PH xem bài chấm + đáp án). Guard "đã chấm gì đó" nằm trong fn.
export async function traBai(buoiId: string, hocSinhId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_btvn_tra_bai', { p_hoc_sinh_id: hocSinhId, p_buoi_hoc_id: buoiId })
  if (error) throw error
}

// Đếm lượt nộp app theo LÔ buổi (badge 📱 cho ERP BtvnTab + card Việc-của-tôi).
export async function demNopTheoBuois(buoiIds: string[]): Promise<Record<string, number>> {
  if (!buoiIds.length) return {}
  const { data, error } = await supabase.from('btvn_nop').select('buoi_hoc_id').in('buoi_hoc_id', buoiIds).limit(10000)
  if (error) throw error
  const out: Record<string, number> = {}
  for (const r of data ?? []) out[r.buoi_hoc_id] = (out[r.buoi_hoc_id] ?? 0) + 1
  return out
}
