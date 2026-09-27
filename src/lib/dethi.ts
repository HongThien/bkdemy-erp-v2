// ============================================================================
// dethi.ts — Đề thi (trường/sở), loai='de_thi'. Đi NGƯỢC giáo trình: đề thật → bóc câu
// đổ vào kho + giữ TỔ HỢP LIÊN KẾT (thứ tự + phần gốc) dùng thẳng (dual-membership, spec §1).
// KHÔNG bảng mới: tái dùng tai_lieu/tai_lieu_phan/tai_lieu_cau. Mỗi PHẦN gốc (Phần I/II…) = 1
// tai_lieu_phan(loai_phan='custom', tieu_de="Phần I…") — pattern y hệt ET (1 phan 'custom' câu-theo-thứ-tự),
// chỉ khác đề thi có NHIỀU phan 'custom' (mỗi phần 1 cái) thay vì 1. getTaiLieuFull đã generic, không cần đổi.
// ============================================================================
import { supabase } from './supabase'
import { listPhan, addPhan, getTaiLieuFull, khoCuaMon, type TaiLieuPhan } from './tailieu'
import type { CauHoi, MenhDe } from './kho/api'

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
  duyet_at?: string | null // dấu "Duyệt đề" (fn_de_thi_duyet) — NULL = chưa duyệt
  cau_hinh: { deThi?: DeThiMeta;[k: string]: unknown }
  created_at?: string; updated_at?: string
}

// PAGE_MOI_NHAT/PAGE_SEARCH — cùng chủ trương "20 gần nhất" 09-10 (§tailieu.ts listAllTaiLieu).
const PAGE_MOI_NHAT = 20
const PAGE_SEARCH = 200
export async function listDeThi(mon?: string, opts?: { before?: string; search?: string }): Promise<DeThi[]> {
  let q = supabase.from('tai_lieu').select('*').eq('loai', 'de_thi').order('created_at', { ascending: false })
  if (mon) q = q.eq('mon', mon)
  const s = opts?.search?.trim()
  if (s) q = q.ilike('ten', `%${s}%`).limit(PAGE_SEARCH)
  else { if (opts?.before) q = q.lt('created_at', opts.before); q = q.limit(PAGE_MOI_NHAT) }
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

// ═══════════ DUYỆT ĐỀ + THI TRÊN LỚP (spec-de-thi.md §9, mig 202609272027) ═══════════
// Mọi con số/invariant tính ở Postgres (fn_de_thi_*); client chỉ gọi + hiển thị + ghi dòng đơn khi người duyệt sửa câu.
export type Kho = 'dai' | 'hgt' | 'khtn' | 'hinh_hoc'
// Kho → nhánh cho registry khoCuaMon (§1.6) — không rải tên bảng ở component.
const nhanhCuaKho = (kho: Kho): string | null => (kho === 'hgt' ? 'hinh_gt' : kho === 'hinh_hoc' ? 'hinh_hoc' : null)
export const bangCuaKho = (mon: string, kho: Kho) => khoCuaMon(mon, nhanhCuaKho(kho))
export const nhanhCuaKhoPicker = nhanhCuaKho

export type DeThiCau = {
  stt: number; phan_id: string; phan_thu_tu: number; phan_tieu_de: string; ma_cau: string; kho: Kho
  loai_cau: string | null; dang_chinh: string | null; dap_an: string | null; lua_chon: string[] | null
  menh_de: MenhDe[] | null; da_duyet: boolean; xoa: boolean; co_form: boolean; form_duyet: boolean; diem: number
}
export async function deThiCau(deId: string): Promise<DeThiCau[]> {
  const { data, error } = await supabase.rpc('fn_de_thi_cau', { p_de: deId })
  if (error) throw error
  return ((data ?? []) as DeThiCau[]).map((c) => ({ ...c, diem: Number(c.diem) }))
}
export type LoiDeThi = 'cau_da_xoa' | 'dang_cho' | 'thieu_dap_an' | 'thieu_phuong_an' | 'tln_chua_mcq' | 'thieu_menh_de' | 'md_thieu_dap_an' | 'md_dang_cho' | 'tu_luan_chi_in'
export type DeThiThieu = { tong: number; so_chan: number; so_canh: number; cau: { stt: number; ma_cau: string; kho: Kho; loai_cau: string | null; phan: string; loi: LoiDeThi[]; chan: boolean }[] }
export async function deThiThieu(deId: string): Promise<DeThiThieu> {
  const { data, error } = await supabase.rpc('fn_de_thi_thieu', { p_de: deId })
  if (error) throw error
  return data as DeThiThieu
}
export async function duyetDeThi(deId: string): Promise<{ so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_de_thi_duyet', { p_de: deId })
  if (error) throw error
  return data as { so_cau: number }
}
export async function moDeThi(deId: string, lopId: string, ngay: string, thoiGianPhut: number | null, khoaDapAn: boolean): Promise<string> {
  const { data, error } = await supabase.rpc('fn_de_thi_mo', { p_de: deId, p_lop: lopId, p_ngay: ngay, p_thoi_gian_phut: thoiGianPhut, p_khoa_dap_an: khoaDapAn })
  if (error) throw error
  return data as string
}

// Người duyệt sửa 1 câu (CRUD dòng đơn — staff RLS). ĐS: đổi dạng câu thì stamp cùng dạng vào mọi mệnh đề (quy ước DungSaiBoc).
export async function suaCauDeThi(mon: string, kho: Kho, maCau: string, patch: { dang_chinh?: string; dap_an?: string | null; menh_de?: MenhDe[] }): Promise<void> {
  const { error } = await supabase.from(bangCuaKho(mon, kho).cauTbl).update(patch).eq('ma_cau', maCau)
  if (error) throw error
}
export type FormTLN = { id: string; ma_cau: string; lua_chon: { text: string; dung: boolean; rule?: string | null }[]; dap_an: string; da_duyet: boolean }
export async function listFormTLN(mon: string, kho: Kho, maCaus: string[]): Promise<FormTLN[]> {
  if (!maCaus.length) return []
  const { data, error } = await supabase.from(bangCuaKho(mon, kho).formTnTbl).select('id, ma_cau, lua_chon, dap_an, da_duyet')
    .in('ma_cau', maCaus).is('xoa_at', null).limit(1000)
  if (error) throw error
  return (data ?? []) as FormTLN[]
}
// Lưu 4 phương án người duyệt xác nhận cho câu TLN (đáp án đúng = đáp số). Chưa duyệt — fn_de_thi_duyet duyệt cùng đề.
export async function luuFormTLN(mon: string, kho: Kho, maCau: string, luaChon: string[], dung: number, dapSo: string, formId: string | null): Promise<FormTLN> {
  const row = {
    ma_cau: maCau, lua_chon: luaChon.map((text, i) => ({ text, dung: i === dung })), dap_an: 'ABCD'[dung],
    key_gia_tri: dapSo, nguon: 'nguoi', da_duyet: false, updated_at: new Date().toISOString(),
  }
  const tbl = bangCuaKho(mon, kho).formTnTbl
  const q = formId ? supabase.from(tbl).update(row).eq('id', formId) : supabase.from(tbl).insert(row)
  const { data, error } = await q.select('id, ma_cau, lua_chon, dap_an, da_duyet').single()
  if (error) throw error
  return data as FormTLN
}

// ── Lượt thi (bai_test loai='de_thi') của 1 đề ──
export type LuotThi = { id: string; lop_id: string; ngay: string; thoi_gian_phut: number | null; khoa_reveal: boolean; so_cau: number; created_at: string; lop_ten: string }
export async function listLuotThi(deId: string): Promise<LuotThi[]> {
  const { data, error } = await supabase.from('bai_test').select('id, lop_id, ngay, thoi_gian_phut, khoa_reveal, so_cau, created_at, lop:lop_id(ten_lop)')
    .eq('nguon_tai_lieu_id', deId).eq('loai', 'de_thi').order('created_at', { ascending: false }).limit(100)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({ ...r, lop_ten: r.lop?.ten_lop ?? '?' }))
}
export type KetQuaHS = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; trang_thai: 'chua_lam' | 'dang_lam' | 'da_nop'
  bat_dau_at: string | null; nop_at: string | null; diem: number | null; diem_10: number | null; theo_phan: Record<string, number> | null
}
export type KetQuaLuot = { toi_da: number; thoi_gian_phut: number | null; khoa_reveal: boolean; phan: { phan: string; toi_da: number }[]; hs: KetQuaHS[] }
export async function ketQuaLuot(baiTestId: string): Promise<KetQuaLuot | null> {
  const { data, error } = await supabase.rpc('fn_de_thi_ket_qua', { p_bai_test: baiTestId })
  if (error) throw error
  return data as KetQuaLuot | null
}
export async function thuBaiLuot(baiTestId: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_de_thi_thu_bai', { p_bai_test: baiTestId })
  if (error) throw error
  return data as number
}
export async function datKhoaDapAn(baiTestId: string, khoa: boolean): Promise<void> {
  const { error } = await supabase.from('bai_test').update({ khoa_reveal: khoa }).eq('id', baiTestId)
  if (error) throw error
}
// HS: điểm của chính mình (NULL khi chưa nộp hoặc đáp án còn khoá)
export type DiemCuaToi = { diem: number; toi_da: number; diem_10: number | null; phan: { phan: string; toi_da: number; diem: number }[] }
export async function diemDeThiCuaToi(baiTestId: string): Promise<DiemCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_de_thi_diem_cua_toi', { p_bai_test: baiTestId })
  if (error) throw error
  return data as DiemCuaToi | null
}
