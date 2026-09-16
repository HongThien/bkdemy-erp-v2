// Data-layer HÌNH HỌC · PHASE HỌC KIẾN THỨC (Bài) — spec 16/09 CEO.
//
// CHỈ CÒN 2 THỨ ở file này (CEO chốt chiều 16/09):
//   1. CRUD "Bài" (đơn vị leaf phẳng theo khối) — riêng vì Đại không có khái niệm này.
//   2. Lý thuyết Bài wrapper thành shape LyThuyetApi để plug thẳng `LyThuyetModal` (BanDo.tsx).
//
// KHÔNG viết modal/CRUD câu/cụm/OCR riêng — REUSE HẾT của Đại (DangHub, CauModal, AiImportModal,
// CumBaiTab, LyThuyetModal) qua param `cauTbl='hinh_hoc_cau_hoi'` + CUM_TBL đã map (xem api.ts).
// Schema `hinh_hoc_cau_hoi` đã đổi cột `ma_bai → dang_chinh` + thêm 7 cột compat (mig 202609161648).
import { supabase } from '../supabase'
import { myNhanSuId } from '../giaoviec'
import type { LyThuyet, MapRow } from './api'

const LIMIT = 10000

// ══ BÀI (leaf phẳng theo khối) ═══════════════════════════════════════════════
export type HinhHocBai = {
  ma_bai: string
  khoi: string
  ten_bai: string
  thu_tu: number
  bac_toi_thieu: string | null
  da_duyet: boolean
  duyet_boi: string | null
  duyet_at: string | null
  created_at?: string
}
export type HinhHocBaiInput = { khoi: string; ten_bai: string; thu_tu?: number; bac_toi_thieu?: string | null }

export async function listHinhHocBai(khoi: string): Promise<HinhHocBai[]> {
  const { data, error } = await supabase.from('hinh_hoc_bai')
    .select('*').eq('khoi', khoi).order('thu_tu').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as HinhHocBai[]
}

export async function createHinhHocBai(input: HinhHocBaiInput): Promise<HinhHocBai> {
  let thu_tu = input.thu_tu
  if (thu_tu == null) {
    const { data } = await supabase.from('hinh_hoc_bai').select('thu_tu').eq('khoi', input.khoi).order('thu_tu', { ascending: false }).limit(1)
    thu_tu = ((data?.[0] as { thu_tu?: number } | undefined)?.thu_tu ?? 0) + 1
  }
  const { data, error } = await supabase.from('hinh_hoc_bai')
    .insert({ khoi: input.khoi, ten_bai: input.ten_bai, thu_tu, bac_toi_thieu: input.bac_toi_thieu ?? null }).select().single()
  if (error) throw error
  return data as HinhHocBai
}

export async function updateHinhHocBai(ma_bai: string, patch: Partial<HinhHocBaiInput>): Promise<void> {
  const { error } = await supabase.from('hinh_hoc_bai').update(patch).eq('ma_bai', ma_bai)
  if (error) throw error
}

// FK `hinh_hoc_cau_hoi.dang_chinh` = ON DELETE RESTRICT: còn câu → chặn (UI phải báo).
export async function deleteHinhHocBai(ma_bai: string): Promise<void> {
  const { error } = await supabase.from('hinh_hoc_bai').delete().eq('ma_bai', ma_bai)
  if (error) throw error
}

// Đếm câu theo Bài — RPC ở Postgres (mig 202609161521 + sửa cột ở 202609161648).
// Tránh cap max-rows PostgREST nếu kho lớn (§2.0 CLAUDE.md).
export async function countHinhHocCauByBai(khoi: string): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('count_cau_by_bai_hh', { p_khoi: khoi })
  if (error) throw error
  return (data ?? {}) as Record<string, number>
}

// Adapter Bài → MapRow (spec DangPicker/BanDo 3 tầng): Hình học Bài phẳng, nên 2 tầng cha là DUMMY —
// t1='Khối X · Hình học' · t2='Danh sách Bài' · leaf=Bài. Đủ để tree render mà không phải viết 1 picker mới.
// listMap được `TaiLieuBuilder.DangPicker` gọi khi mở popup chọn dạng cho buổi.
export async function listHinhHocMap(khoi: string): Promise<MapRow[]> {
  const bais = await listHinhHocBai(khoi)
  const t1Ma = `HH.K${khoi}`
  const t2Ma = `${t1Ma}.BAI`
  return bais.map((b) => ({
    leafMa: b.ma_bai, khoi: b.khoi,
    t1Ma, t1Ten: `Hình học · Khối ${khoi}`,
    t2Ma, t2Ten: 'Danh sách Bài',
    leafTen: b.ten_bai, bac: b.bac_toi_thieu ?? '', mucDo: null,
  }))
}

export async function duyetHinhHocBai(ma_bai: string): Promise<void> {
  const nguoiDuyet = await myNhanSuId()
  const { error } = await supabase.from('hinh_hoc_bai')
    .update({ da_duyet: true, duyet_boi: nguoiDuyet, duyet_at: new Date().toISOString() }).eq('ma_bai', ma_bai)
  if (error) throw error
}
export async function boDuyetHinhHocBai(ma_bai: string): Promise<void> {
  const { error } = await supabase.from('hinh_hoc_bai')
    .update({ da_duyet: false, duyet_boi: null, duyet_at: null }).eq('ma_bai', ma_bai)
  if (error) throw error
}

// ══ LÝ THUYẾT (1-1 với Bài) — wrapper cho LyThuyetApi shape của BanDo.tsx ════
// Signature khớp `LyThuyetApi` (BanDo.tsx dùng): list/upsert/remove — chỉ cần đưa cho
// LyThuyetModal là dùng được (paste clipboard + upload PDF + AI OCR đầy đủ, đã có).
export async function listHinhHocLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('hinh_hoc_bai_ly_thuyet').select('*').limit(LIMIT)
  if (error) throw error
  const m: Record<string, LyThuyet> = {}
  for (const r of data ?? []) {
    const row = r as any
    m[row.ma_bai] = { noi_dung: row.noi_dung ?? '', file_url: row.file_url, ten_file: row.ten_file, cap_nhat_at: row.cap_nhat_at }
  }
  return m
}
export async function upsertHinhHocLyThuyet(ma_bai: string, noi_dung: string, file_url: string | null, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('hinh_hoc_bai_ly_thuyet')
    .upsert({ ma_bai, noi_dung, file_url, ten_file, cap_nhat_at: new Date().toISOString() }, { onConflict: 'ma_bai' })
  if (error) throw error
}
export async function deleteHinhHocLyThuyet(ma_bai: string): Promise<void> {
  const { error } = await supabase.from('hinh_hoc_bai_ly_thuyet').delete().eq('ma_bai', ma_bai)
  if (error) throw error
}
