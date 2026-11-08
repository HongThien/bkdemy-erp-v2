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
  buoi_xac_nhan_at: string | null // null = hệ GÁN TẠM buổi, TA phải chốt trước khi trả (CEO 30/08 đêm)
  nhan_xet_ma: string[]
  anh: BtvnNopAnh[]
}
export type NhanXetMau = { ma: string; noi_dung: string; thu_tu: number }

// Lượt nộp của cả buổi, kèm ảnh (sort thu_tu chỉ để hiển thị — danh tính là id).
export async function listNopTheoBuoi(buoiId: string): Promise<Record<string, BtvnNop>> {
  const [n, a] = await Promise.all([
    supabase.from('btvn_nop').select('hoc_sinh_id,buoi_hoc_id,nop_at,tra_at,buoi_xac_nhan_at,nhan_xet_ma').eq('buoi_hoc_id', buoiId).limit(1000),
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

// "Làm lại trang": bỏ bản chấm → PH/TA thấy lại ảnh gốc. Chỉ đổi con trỏ path_cham; file PNG cũ để nguyên
// (bucket không có policy delete — cùng luật với mỗi lần lưu lại đè path mới).
export async function boAnhCham(anhId: string): Promise<void> {
  const { error } = await supabase.from('btvn_nop_anh').update({ path_cham: null }).eq('id', anhId)
  if (error) throw error
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

// Trả bài 1 HS (mở khoá PH xem bài chấm + đáp án). Guard "đã chấm + đã chốt buổi" nằm trong fn.
export async function traBai(buoiId: string, hocSinhId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_btvn_tra_bai', { p_hoc_sinh_id: hocSinhId, p_buoi_hoc_id: buoiId })
  if (error) throw error
}

// TA chốt "đúng buổi này" cho lượt nộp hệ gán tạm.
export async function xacNhanBuoi(buoiId: string, hocSinhId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_btvn_xac_nhan_buoi', { p_hoc_sinh_id: hocSinhId, p_buoi_hoc_id: buoiId })
  if (error) throw error
}

// TA chuyển bài sang buổi khác (chọn tay = chốt luôn; đích đã có nộp thì fn tự GỘP ảnh).
export async function chuyenBuoi(hocSinhId: string, buoiCu: string, buoiMoi: string): Promise<void> {
  const { error } = await supabase.rpc('fn_btvn_chuyen_buoi', { p_hoc_sinh_id: hocSinhId, p_buoi_cu: buoiCu, p_buoi_moi: buoiMoi })
  if (error) throw error
}

// Buổi gần đây của lớp — cho picker "chuyển buổi" (CEO 09/09: hệ gán buổi gần nhất, TA tự gán lại khi nộp
// muộn/bù ⇒ picker phải có MỌI buổi, kèm cờ có phiếu BTVN / đã đóng). Join buổi×tai_lieu không có FK
// (bám lop+ngay) nên nằm ở DB (fn_btvn_buoi_cua_lop, §2.0), client chỉ gọi.
export type BuoiBtvn = { id: string; ngay: string; dong: boolean; co_phieu: boolean }
export async function listBuoiBtvnCuaLop(lopId: string): Promise<BuoiBtvn[]> {
  const { data, error } = await supabase.rpc('fn_btvn_buoi_cua_lop', { p_lop_id: lopId })
  if (error) throw error
  return ((data ?? []) as BuoiBtvn[])
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

// ── CHẤM TỰ ĐỘNG (Claude) — mig 202611071647 + Edge Function `btvn-cham-ai` ──
// Máy chỉ GỢI Ý (bảng nháp btvn_ai_*); TA xác nhận ⇒ fn_btvn_ai_chot ghi gami_grades (luật §1.5).

// TA tải/dán ảnh bài làm cho HS chưa nộp qua app PH (hoặc bổ sung trang thiếu). Ảnh thu nhỏ còn cạnh dài
// ≤ 2000px trước khi lên bucket: đủ nét để đọc chữ viết tay, dưới giới hạn 5MB/ảnh của API, bớt token.
async function thuNho(file: File, canhMax = 2000): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, canhMax / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  return await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Không đọc được ảnh'))), 'image/jpeg', 0.88))
}
export async function taThemAnh(buoiId: string, hocSinhId: string, files: File[]): Promise<void> {
  if (!files.length) return
  const paths: string[] = []
  for (const f of files) {
    const blob = await thuNho(f)
    const path = `ta/${buoiId}/${hocSinhId}/${crypto.randomUUID()}.jpg`
    const { error } = await supabase.storage.from(BTVN_NOP_BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    if (error) throw error
    paths.push(path)
  }
  const { error } = await supabase.rpc('fn_btvn_nop_ta_them', { p_hoc_sinh_id: hocSinhId, p_buoi_hoc_id: buoiId, p_paths: paths })
  if (error) throw error
}

export type AiCau = { problem_id: string; result: 'correct' | 'partial' | 'wrong'; chac: boolean; loai_loi: string | null; nhan_xet: string | null }
export type AiLan = {
  id: string; model: string; rule_version: string; nhan_xet_chung: string | null; created_at: string
  chot_at: string | null; so_cau_sua: number | null; cau: AiCau[]
}

// Gọi máy chấm (30–90 giây). Lỗi trả về dạng câu tiếng Việt đọc được để hiện thẳng cho TA.
export async function chamTuDong(buoiId: string, hocSinhId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('btvn-cham-ai', { body: { buoi_hoc_id: buoiId, hoc_sinh_id: hocSinhId } })
  if (error) {
    let msg = error.message
    try { const j = await (error as { context?: Response }).context?.json(); if (j?.error) msg = j.error } catch { /* giữ msg gốc */ }
    throw new Error(msg)
  }
  return (data as { lan_id: string }).lan_id
}

// Lần chấm máy MỚI NHẤT của 1 HS ở buổi (kèm gợi ý từng câu). Chưa chấm lần nào ⇒ null.
export async function layLanAi(buoiId: string, hocSinhId: string): Promise<AiLan | null> {
  const { data, error } = await supabase.from('btvn_ai_lan')
    .select('id,model,rule_version,nhan_xet_chung,created_at,chot_at,so_cau_sua,btvn_ai_cau(problem_id,result,chac,loai_loi,nhan_xet)')
    .eq('buoi_hoc_id', buoiId).eq('hoc_sinh_id', hocSinhId).order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  const r = data?.[0] as (Omit<AiLan, 'cau'> & { btvn_ai_cau: AiCau[] }) | undefined
  if (!r) return null
  const { btvn_ai_cau, ...lan } = r
  return { ...lan, cau: btvn_ai_cau ?? [] }
}

// TA xác nhận ⇒ ghi Đ/C/S (+ nhận xét từng câu) vào gami_grades. Trả số câu TA đã sửa so với máy.
export async function chotAi(lanId: string, items: { problem_id: string; result: string; nhan_xet: string | null }[]): Promise<number> {
  const { data, error } = await supabase.rpc('fn_btvn_ai_chot', { p_lan_id: lanId, p_items: items })
  if (error) throw error
  return data as number
}

export type LopAi = { lop_id: string; ten_lop: string; mon: string; khoi: string | null; phu_trach: boolean }
// Lớp cho màn chấm tự động: lớp TA phụ trách trước (thứ tự do DB quyết).
export async function lopChamAi(): Promise<LopAi[]> {
  const { data, error } = await supabase.rpc('fn_btvn_ai_lop_cua_toi')
  if (error) throw error
  return (data ?? []) as LopAi[]
}

// ── CHẾ ĐỘ HÀNG ĐỢI (CEO chọn 07/11 — chưa dùng API key): TA "Gửi chấm" ⇒ máy CEO chạy Claude Code
// (/cham-btvn-hang-doi) chấm theo đợt ⇒ gợi ý hiện trên app. Chuyển sang API: gọi chamTuDong thay guiCham.
export async function guiCham(buoiId: string, hocSinhId: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_btvn_ai_yeu_cau', { p_buoi_hoc_id: buoiId, p_hoc_sinh_id: hocSinhId })
  if (error) throw error
  return data as string
}

// Trạng thái máy chấm theo HS ở 1 buổi (suy ở DB): cho_cham = đã gửi mà máy chưa chấm · chot = TA đã xác nhận.
export type AiTrangThai = { yeu_cau_at: string | null; lan_moi_at: string | null; cho_cham: boolean; chot: boolean }
export async function trangThaiAiTheoBuoi(buoiId: string): Promise<Record<string, AiTrangThai>> {
  const { data, error } = await supabase.rpc('fn_btvn_ai_trang_thai', { p_buoi_hoc_id: buoiId })
  if (error) throw error
  const out: Record<string, AiTrangThai> = {}
  for (const r of (data ?? []) as (AiTrangThai & { hoc_sinh_id: string })[]) out[r.hoc_sinh_id] = r
  return out
}

// Công tắc hệ thống bật/tắt nút "Chấm tự động" (he_thong_cong_tac 'btvn_cham_tu_dong', mig 202611081103).
// Đọc lỗi ⇒ coi như TẮT (tính năng mới, hỏng công tắc thì ẩn đi, luồng chấm tay vẫn còn nguyên).
export async function chamTuDongBat(): Promise<boolean> {
  const { data, error } = await supabase.from('he_thong_cong_tac').select('bat').eq('ma', 'btvn_cham_tu_dong').limit(1)
  if (error) return false
  return !!data?.[0]?.bat
}
