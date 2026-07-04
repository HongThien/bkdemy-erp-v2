// ============================================================================
// dethi.ts — Đề thi (trường/sở), loai='de_thi'. Đi NGƯỢC giáo trình: đề thật → bóc câu
// đổ vào kho + giữ TỔ HỢP LIÊN KẾT (thứ tự + phần gốc) dùng thẳng (dual-membership, spec §1).
// KHÔNG bảng mới: tái dùng tai_lieu/tai_lieu_phan/tai_lieu_cau. Mỗi PHẦN gốc (Phần I/II…) = 1
// tai_lieu_phan(loai_phan='custom', tieu_de="Phần I…") — pattern y hệt ET (1 phan 'custom' câu-theo-thứ-tự),
// chỉ khác đề thi có NHIỀU phan 'custom' (mỗi phần 1 cái) thay vì 1. getTaiLieuFull đã generic, không cần đổi.
// ============================================================================
import { supabase } from './supabase'
import { listPhan, addPhan, getTaiLieuFull, type TaiLieuPhan } from './tailieu'
import type { CauHoi } from './kho/api'

export type DeThiMeta = {
  nguon: string          // trường/sở
  cap: string            // vd 'vao_10', 'thpt_qg' — free text, vocab tái dùng nếu có
  nam: number | null
  thoiGianPhut: number | null
  thangDiem: number
  pdfGocUrl: string | null
}
const EMPTY_META: DeThiMeta = { nguon: '', cap: '', nam: null, thoiGianPhut: null, thangDiem: 10, pdfGocUrl: null }

export type DeThi = {
  id: string; ten: string; khoi: string; mon: string
  cau_hinh: { deThi?: DeThiMeta;[k: string]: unknown }
  created_at?: string; updated_at?: string
}

export async function listDeThi(mon?: string): Promise<DeThi[]> {
  let q = supabase.from('tai_lieu').select('*').eq('loai', 'de_thi').order('created_at', { ascending: false }).limit(1000)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as DeThi[]
}
export async function getDeThi(id: string): Promise<DeThi> {
  const { data, error } = await supabase.from('tai_lieu').select('*').eq('id', id).single()
  if (error) throw error
  return data as DeThi
}
export async function createDeThi(input: { ten: string; khoi: string; mon: string }): Promise<DeThi> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('tai_lieu').insert({
    loai: 'de_thi', ten: input.ten, khoi: input.khoi, mon: input.mon, created_by: user?.id ?? null,
    cau_hinh: { deThi: EMPTY_META },
  }).select().single()
  if (error) throw error
  return data as DeThi
}
export async function renameDeThi(id: string, ten: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu').update({ ten, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteDeThi(id: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu').delete().eq('id', id) // cascade phan + cau (KHÔNG xoá câu ở kho — dual-membership)
  if (error) throw error
}
export function deThiMeta(d: Pick<DeThi, 'cau_hinh'>): DeThiMeta { return { ...EMPTY_META, ...(d.cau_hinh?.deThi ?? {}) } }
export async function updateDeThiMeta(id: string, patch: Partial<DeThiMeta>): Promise<void> {
  const { data: cur, error: e0 } = await supabase.from('tai_lieu').select('cau_hinh').eq('id', id).single()
  if (e0) throw e0
  const cauHinh = { ...(cur as { cau_hinh?: Record<string, unknown> }).cau_hinh, deThi: { ...EMPTY_META, ...((cur as any).cau_hinh?.deThi ?? {}), ...patch } }
  const { error } = await supabase.from('tai_lieu').update({ cau_hinh: cauHinh, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function attachPdfGoc(id: string, url: string): Promise<void> { await updateDeThiMeta(id, { pdfGocUrl: url }) }

// ── PHẦN (Phần I/II…) = tai_lieu_phan loai_phan='custom', mỗi phần giữ CÂU THEO THỨ TỰ GỐC ──
export async function listPhanDeThi(taiLieuId: string): Promise<TaiLieuPhan[]> {
  return (await listPhan(taiLieuId)).filter((p) => p.loai_phan === 'custom')
}
export async function addPhanDeThi(taiLieuId: string, tieuDe: string): Promise<TaiLieuPhan> {
  const phans = await listPhan(taiLieuId)
  const tt = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  return addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt, loai_phan: 'custom', ref_ma: null, tieu_de: tieuDe, noi_dung: null })
}

// Câu của đề thi ĐÚNG THỨ TỰ GỐC (mọi phần, theo thu_tu phần rồi thu_tu câu) — dùng cho in + phát hành online.
export async function getDeThiCaus(taiLieuId: string): Promise<CauHoi[]> {
  const full = await getTaiLieuFull(taiLieuId)
  return full.phans.filter((p) => p.loai_phan === 'custom').flatMap((p) => p.caus)
}

// Danh sách ma_cau hiện có của 1 phần (đúng thứ tự) — dùng để APPEND 1 câu mới vào cuối (giữ thứ tự bóc).
export async function getPhanCauList(phanId: string): Promise<string[]> {
  const { data, error } = await supabase.from('tai_lieu_cau').select('ma_cau').eq('phan_id', phanId).order('thu_tu').limit(1000)
  if (error) throw error
  return (data ?? []).map((r) => r.ma_cau as string)
}
