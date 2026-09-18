// CRUD "Thông báo trung tâm gửi PH" (bảng thong_bao_ph, mig ERP_thong_bao_ph.sql).
// PH đọc qua bkdemy-ph fn_ph_thong_bao (FDW). Nhân sự ERP nhập tay ở màn ThongBaoPhScreen.
import { supabase } from './supabase'

export type TbLoai = 'chung' | 'lich' | 'thi' | 'nhac'
export type TbScope = 'toan_bo' | 'khoi' | 'lop' | 'ca_nhan'

export interface ThongBaoPh {
  id: string
  tieu_de: string
  noi_dung: string
  loai: TbLoai
  scope: TbScope
  khoi: string | null
  lop_id: string | null
  hoc_sinh_id: string | null
  hieu_luc_tu: string | null   // 'YYYY-MM-DD'
  hieu_luc_den: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

const LIMIT = 500

export async function listThongBao(): Promise<ThongBaoPh[]> {
  const { data, error } = await supabase
    .from('thong_bao_ph')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(LIMIT)
  if (error) throw error
  return (data ?? []) as ThongBaoPh[]
}

export type ThongBaoInput = {
  tieu_de: string
  noi_dung: string
  loai: TbLoai
  scope: TbScope
  khoi?: string | null
  lop_id?: string | null
  hoc_sinh_id?: string | null
  hieu_luc_tu?: string | null
  hieu_luc_den?: string | null
}

export async function createThongBao(p: ThongBaoInput): Promise<ThongBaoPh> {
  const { data: { user } } = await supabase.auth.getUser()
  // Kỷ luật scope: null hoá field không thuộc scope (tránh dữ liệu rác)
  const clean = normalizeScope(p)
  const { data, error } = await supabase.from('thong_bao_ph').insert({
    ...clean,
    created_by: user?.id ?? null,
  }).select().single()
  if (error) throw error
  return data as ThongBaoPh
}

export async function updateThongBao(id: string, patch: Partial<ThongBaoInput>): Promise<void> {
  const clean = 'scope' in patch ? normalizeScope(patch as ThongBaoInput) : patch
  const { error } = await supabase.from('thong_bao_ph').update(clean).eq('id', id)
  if (error) throw error
}

export async function deleteThongBao(id: string): Promise<void> {
  const { error } = await supabase.from('thong_bao_ph').delete().eq('id', id)
  if (error) throw error
}

// Null-hoá field ngoài scope (chống lỡ tay điền khoi=7 rồi chọn scope='lop' → hỏng CHECK).
function normalizeScope(p: ThongBaoInput): ThongBaoInput {
  const out: ThongBaoInput = { ...p, khoi: null, lop_id: null, hoc_sinh_id: null }
  if (p.scope === 'khoi')    out.khoi = p.khoi ?? null
  if (p.scope === 'lop')     out.lop_id = p.lop_id ?? null
  if (p.scope === 'ca_nhan') out.hoc_sinh_id = p.hoc_sinh_id ?? null
  return out
}
