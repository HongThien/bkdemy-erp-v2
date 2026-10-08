// Bản đồ MỚI (nháp) — nhánh Đại. spec-ban-do-4-tang.md §0 + §9.0 · mig 202610081147.
// CEO soạn 4 tầng trên bản nháp (chia tầng · lý thuyết · ví dụ · mô tả); bản đồ đang chạy KHÔNG bị đụng.
// Cây đọc 1 lần qua RPC fn_bdm_cay (đếm/ghép ở DB, §2.0). Ghi = CRUD dòng đơn + RPC chuyển/sắp xếp/nâng/hạ.
import { supabase } from '../supabase'
import type { LyThuyet } from './api'
import type { LyThuyetApi } from '../../screens/kho/branches'

export type BdmDangBai = { id: string; ten: string; mo_ta: string; thu_tu: number; co_vi_du: boolean }
export type BdmNhom = { id: string; ten: string; mo_ta: string; thu_tu: number; co_ly_thuyet: boolean; dang_bai: BdmDangBai[] }
export type BdmO = { chuyen_de_id: string; ten: string; mo_ta: string; thu_tu: number; so_chu_de: number; nhom: BdmNhom[] }
export type BdmChuDe = { id: string; ten: string; thu_tu: number; o: BdmO[] }
export type BdmChuyenDe = { id: string; ten: string; so_chu_de: number; khoi: string[] }
export type BdmCay = { chu_de: BdmChuDe[]; chuyen_de: BdmChuyenDe[]; so_chu_de_theo_khoi: Record<string, number> }

// Lỗi Postgres → câu người đọc được (FK chặn xoá khi còn con · ô trùng).
function loi(e: { code?: string; message?: string } | null): never {
  if (e?.code === '23503') throw new Error('Còn mục con bên trong — chuyển hoặc xoá các mục con trước.')
  if (e?.code === '23505') throw new Error('Đã có sẵn — không thêm trùng.')
  throw new Error(e?.message ?? 'Lỗi không rõ')
}

export async function getCay(khoi: string): Promise<BdmCay> {
  const { data, error } = await supabase.rpc('fn_bdm_cay', { p_khoi: khoi })
  if (error) loi(error)
  return data as BdmCay
}

// ── Chủ đề ──
export async function themChuDe(khoi: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_chu_de').insert({ khoi, ten: ten.trim() })
  if (error) loi(error)
}
export async function suaChuDe(id: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_chu_de').update({ ten: ten.trim() }).eq('id', id)
  if (error) loi(error)
}
export async function xoaChuDe(id: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_chu_de').delete().eq('id', id)
  if (error) loi(error)
}

// ── Chuyên đề (dùng chung) + ô ──
export async function themChuyenDeVaoChuDe(chuDeId: string, a: { chuyenDeId?: string; tenMoi?: string }): Promise<void> {
  let id = a.chuyenDeId
  if (!id) {
    const { data, error } = await supabase.from('dai_bdm_chuyen_de').insert({ ten: (a.tenMoi ?? '').trim() }).select('id').single()
    if (error) loi(error)
    id = (data as { id: string }).id
  }
  const { error } = await supabase.from('dai_bdm_o').insert({ chu_de_id: chuDeId, chuyen_de_id: id })
  if (error) loi(error)
}
export async function suaChuyenDe(id: string, patch: { ten?: string; mo_ta?: string }): Promise<void> {
  const { error } = await supabase.from('dai_bdm_chuyen_de').update(patch).eq('id', id)
  if (error) loi(error)
}
export async function goO(chuDeId: string, chuyenDeId: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_o').delete().match({ chu_de_id: chuDeId, chuyen_de_id: chuyenDeId })
  if (error) loi(error)
}
export async function xoaChuyenDe(id: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_chuyen_de').delete().eq('id', id)
  if (error) loi(error)
}

// ── Nhóm bài (tầng 3) ──
export async function themNhom(chuDeId: string, chuyenDeId: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_nhom').insert({ chu_de_id: chuDeId, chuyen_de_id: chuyenDeId, ten: ten.trim() })
  if (error) loi(error)
}
export async function suaNhom(id: string, patch: { ten?: string; mo_ta?: string }): Promise<void> {
  const { error } = await supabase.from('dai_bdm_nhom').update(patch).eq('id', id)
  if (error) loi(error)
}
export async function xoaNhom(id: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_nhom').delete().eq('id', id)
  if (error) loi(error)
}

// ── Dạng bài (tầng 4) ──
export async function themDangBai(nhomId: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_dang_bai').insert({ nhom_id: nhomId, ten: ten.trim() })
  if (error) loi(error)
}
export async function suaDangBai(id: string, patch: { ten?: string; mo_ta?: string }): Promise<void> {
  const { error } = await supabase.from('dai_bdm_dang_bai').update(patch).eq('id', id)
  if (error) loi(error)
}
export async function xoaDangBai(id: string): Promise<void> {
  const { error } = await supabase.from('dai_bdm_dang_bai').delete().eq('id', id)
  if (error) loi(error)
}

// ── Chuyển · sắp xếp · nâng · hạ (RPC transactional) ──
export type LoaiSapXep = 'chu_de' | 'o' | 'nhom' | 'dang_bai'
export async function sapXep(loai: LoaiSapXep, ids: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_bdm_sap_xep', { p_loai: loai, p_ids: ids })
  if (error) loi(error)
}
export async function chuyenNhom(id: string, chuDeId: string, chuyenDeId: string, thuTuDich: string[] | null): Promise<void> {
  const { error } = await supabase.rpc('fn_bdm_chuyen_nhom', { p_id: id, p_chu_de_id: chuDeId, p_chuyen_de_id: chuyenDeId, p_thu_tu_dich: thuTuDich })
  if (error) loi(error)
}
export async function chuyenDangBai(id: string, nhomId: string, thuTuDich: string[] | null): Promise<void> {
  const { error } = await supabase.rpc('fn_bdm_chuyen_dang_bai', { p_id: id, p_nhom_id: nhomId, p_thu_tu_dich: thuTuDich })
  if (error) loi(error)
}
export async function chuyenO(chuDeCu: string, chuyenDeId: string, chuDeMoi: string): Promise<void> {
  const { error } = await supabase.rpc('fn_bdm_chuyen_o', { p_chu_de_cu: chuDeCu, p_chuyen_de_id: chuyenDeId, p_chu_de_moi: chuDeMoi })
  if (error) loi(error)
}
export async function nangDangBai(id: string, chuDeId: string, chuyenDeId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_bdm_nang_dang_bai', { p_id: id, p_chu_de_id: chuDeId, p_chuyen_de_id: chuyenDeId })
  if (error) loi(error)
}
export async function haNhom(id: string, nhomDich: string): Promise<void> {
  const { error } = await supabase.rpc('fn_bdm_ha_nhom', { p_id: id, p_nhom_dich: nhomDich })
  if (error) loi(error)
}

// ── Lý thuyết (nhóm) · Ví dụ (dạng bài) — cùng shape LyThuyetApi để dùng nguyên LyThuyetModal ──
export async function getLyThuyetNhom(id: string): Promise<LyThuyet> {
  const { data, error } = await supabase.from('dai_bdm_nhom').select('ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file').eq('id', id).single()
  if (error) loi(error)
  const r = data as { ly_thuyet: string; ly_thuyet_file_url: string | null; ly_thuyet_ten_file: string | null }
  return { noi_dung: r.ly_thuyet, file_url: r.ly_thuyet_file_url, ten_file: r.ly_thuyet_ten_file }
}
export async function getViDuDangBai(id: string): Promise<LyThuyet> {
  const { data, error } = await supabase.from('dai_bdm_dang_bai').select('vi_du, vi_du_file_url, vi_du_ten_file').eq('id', id).single()
  if (error) loi(error)
  const r = data as { vi_du: string; vi_du_file_url: string | null; vi_du_ten_file: string | null }
  return { noi_dung: r.vi_du, file_url: r.vi_du_file_url, ten_file: r.vi_du_ten_file }
}
export const lyThuyetNhomApi: LyThuyetApi = {
  list: async () => ({}), // LyThuyetModal không gọi list; màn tải đúng 1 nhóm khi mở (getLyThuyetNhom)
  upsert: async (id, noiDung, fileUrl, tenFile) => {
    const { error } = await supabase.from('dai_bdm_nhom').update({ ly_thuyet: noiDung, ly_thuyet_file_url: fileUrl, ly_thuyet_ten_file: tenFile }).eq('id', id)
    if (error) loi(error)
  },
  remove: async (id) => {
    const { error } = await supabase.from('dai_bdm_nhom').update({ ly_thuyet: '', ly_thuyet_file_url: null, ly_thuyet_ten_file: null }).eq('id', id)
    if (error) loi(error)
  },
}
export const viDuDangBaiApi: LyThuyetApi = {
  list: async () => ({}),
  upsert: async (id, noiDung, fileUrl, tenFile) => {
    const { error } = await supabase.from('dai_bdm_dang_bai').update({ vi_du: noiDung, vi_du_file_url: fileUrl, vi_du_ten_file: tenFile }).eq('id', id)
    if (error) loi(error)
  },
  remove: async (id) => {
    const { error } = await supabase.from('dai_bdm_dang_bai').update({ vi_du: '', vi_du_file_url: null, vi_du_ten_file: null }).eq('id', id)
    if (error) loi(error)
  },
}
