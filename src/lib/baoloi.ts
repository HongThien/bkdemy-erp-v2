// Data-layer Báo lỗi (auto-report Pha 1). UI KHÔNG gọi supabase trực tiếp — chỉ qua đây.
import { supabase } from './supabase'

export type TrangThaiBaoLoi = 'moi' | 'cho_fix' | 'tu_choi' | 'tu_lam' | 'da_fix' | 'xong' | 'tra_lai'
export type LoaiBaoLoi = 'bug' | 'yeu_cau'
export type BaoLoi = {
  id: string
  loai: LoaiBaoLoi
  mo_ta: string
  route: string | null
  context: Record<string, unknown> | null
  anh_url: string | null
  trang_thai: TrangThaiBaoLoi
  ghi_chu_duyet: string | null
  fix_note: string | null
  branch: string | null
  pr_url: string | null
  commit_sha: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

const LIMIT = 2000

// Tạo report. anh_url best-effort (có thể null nếu upload ảnh hỏng).
export async function createBaoLoi(input: { mo_ta: string; route?: string | null; context?: Record<string, unknown> | null; anh_url?: string | null }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bao_loi').insert({
    mo_ta: input.mo_ta, route: input.route ?? null, context: input.context ?? null,
    anh_url: input.anh_url ?? null, created_by: user?.id ?? null,
  })
  if (error) throw error
}

// Order tính năng (Thùy) — vào thẳng cho_fix: chính người duyệt tạo ra nó, khỏi qua cổng 2.
export async function createOrderTinhNang(moTa: string, route?: string | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bao_loi').insert({
    loai: 'yeu_cau', mo_ta: moTa, route: route ?? null,
    trang_thai: 'cho_fix', created_by: user?.id ?? null,
  })
  if (error) throw error
}

export async function listBaoLoi(trangThai?: TrangThaiBaoLoi): Promise<BaoLoi[]> {
  let q = supabase.from('bao_loi').select('*').order('created_at', { ascending: false }).limit(LIMIT)
  if (trangThai) q = q.eq('trang_thai', trangThai)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as BaoLoi[]
}

// Đổi trạng thái (cổng 2 của Thùy: cho_fix/tu_choi/tu_lam · và các bước sau). Trigger DB tự ghi state-log.
export async function setTrangThaiBaoLoi(id: string, trang_thai: TrangThaiBaoLoi, patch?: { ghi_chu_duyet?: string; fix_note?: string; branch?: string; pr_url?: string; commit_sha?: string }): Promise<void> {
  const { error } = await supabase.from('bao_loi').update({ trang_thai, ...patch }).eq('id', id)
  if (error) throw error
}

export async function deleteBaoLoi(id: string): Promise<void> {
  const { error } = await supabase.from('bao_loi').delete().eq('id', id)
  if (error) throw error
}

// Upload ảnh chụp màn → tái dùng bucket 'kho-anh' (prefix report/). Best-effort: hỏng → trả null (report vẫn gửi được).
export async function uploadReportAnh(blob: Blob): Promise<string | null> {
  try {
    const path = `report/${Date.now()}-${Math.round(performance.now())}.png`
    const { error } = await supabase.storage.from('kho-anh').upload(path, blob, { contentType: 'image/png', upsert: false })
    if (error) return null
    return supabase.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
  } catch { return null }
}
