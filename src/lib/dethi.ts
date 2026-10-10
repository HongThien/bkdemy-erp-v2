// ============================================================================
// dethi.ts — Đề thi (trường/sở), loai='de_thi'. Đi NGƯỢC giáo trình: đề thật → bóc câu
// đổ vào kho + giữ TỔ HỢP LIÊN KẾT (thứ tự + phần gốc) dùng thẳng (dual-membership, spec §1).
// KHÔNG bảng mới: tái dùng tai_lieu/tai_lieu_phan/tai_lieu_cau. Mỗi PHẦN gốc (Phần I/II…) = 1
// tai_lieu_phan(loai_phan='custom', tieu_de="Phần I…") — pattern y hệt ET (1 phan 'custom' câu-theo-thứ-tự),
// chỉ khác đề thi có NHIỀU phan 'custom' (mỗi phần 1 cái) thay vì 1. getTaiLieuFull đã generic, không cần đổi.
// ============================================================================
import { supabase } from './supabase'
import { listPhan, addPhan, getTaiLieuFull, khoCuaMon, renumberBuoiLop, type TaiLieuPhan } from './tailieu'
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

// Số dòng kẻ để HS viết của câu TỰ LUẬN trên bản in — `cau_hinh.btvnLinesByCau` (key = ma_cau), CÙNG khoá với ET/MT/BTVN nên
// DeThiPrintView đọc sẵn và bản chép cho lớp (fn gán đề chép nguyên cau_hinh) theo luôn. Chưa đặt ⇒ DONG_TU_LUAN_MAC_DINH.
export const DONG_TU_LUAN_MAC_DINH = 4
export function soDongDeThi(d: Pick<DeThi, 'cau_hinh'>): Record<string, number> { return (d.cau_hinh?.btvnLinesByCau ?? {}) as Record<string, number> }
export async function setSoDongDeThi(id: string, patch: Record<string, number>): Promise<void> {
  const { data: cur, error: e0 } = await supabase.from('tai_lieu').select('cau_hinh').eq('id', id).single()
  if (e0) throw e0
  const ch = ((cur as { cau_hinh?: Record<string, unknown> }).cau_hinh ?? {}) as Record<string, unknown>
  const cauHinh = { ...ch, btvnLinesByCau: { ...((ch.btvnLinesByCau as Record<string, number>) ?? {}), ...patch } }
  const { error } = await supabase.from('tai_lieu').update({ cau_hinh: cauHinh, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

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
export type Kho = 'dai' | 'hgt' | 'khtn' | 'hinh_hoc' | 'anh'
// REGISTRY môn → các kho câu của đề (§1.6): màn Kho đề thi lấy danh sách môn + chỗ "thêm câu có sẵn" từ đây,
// KHÔNG `if (mon === …)` ở màn. Thêm môn có đề thi = thêm 1 dòng (kho phải khớp `_de_thi_kho` ở DB).
export const KHO_DE_CUA_MON: Record<string, { kho: Kho; ten: string }[]> = {
  'Toán': [{ kho: 'dai', ten: 'Đại số' }, { kho: 'hgt', ten: 'Hình giải tích' }],
  'KHTN': [{ kho: 'khtn', ten: 'KHTN' }],
  'Tiếng Anh': [{ kho: 'anh', ten: 'Tiếng Anh' }],
}
export const MON_DE_THI = Object.keys(KHO_DE_CUA_MON)
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
export type DeThiThieu = { tong: number; so_chan: number; so_canh: number; so_chua_dang: number; cau: { stt: number; ma_cau: string; kho: Kho; loai_cau: string | null; phan: string; loi: LoiDeThi[]; chan: boolean }[] }
export async function deThiThieu(deId: string): Promise<DeThiThieu> {
  const { data, error } = await supabase.rpc('fn_de_thi_thieu', { p_de: deId })
  if (error) throw error
  return data as DeThiThieu
}
export async function duyetDeThi(deId: string): Promise<{ so_cau: number; so_cau_cho_dang: number }> {
  const { data, error } = await supabase.rpc('fn_de_thi_duyet', { p_de: deId })
  if (error) throw error
  return data as { so_cau: number; so_cau_cho_dang: number }
}
export async function moDeThi(deId: string, lopId: string, ngay: string, thoiGianPhut: number | null, khoaDapAn: boolean): Promise<string> {
  const { data, error } = await supabase.rpc('fn_de_thi_mo', { p_de: deId, p_lop: lopId, p_ngay: ngay, p_thoi_gian_phut: thoiGianPhut, p_khoa_dap_an: khoaDapAn })
  if (error) throw error
  return data as string
}

// ── GÁN ĐỀ VÀO BUỔI CỦA LỚP (spec-de-thi.md §10.7, CEO 01/10) ──
// Đề gán vào buổi thành đúng MỘT tài liệu vận hành của lớp: Giáo trình buổi (bài trên lớp) hoặc BTVN — cùng khuôn với
// "trích xuất buổi" của giáo trình, nên in phiếu / chấm BTVN / mở trên app đi đúng đường sẵn có. Bản gán là BẢN CHÉP
// (sửa đề sau đó không đổi bản đã gán — muốn đổi thì xoá bản gán ở Kho tài liệu rồi gán lại), y như MT gán buổi.
export type LoaiGan = 'giao_trinh_buoi' | 'btvn'
export const TEN_LOAI_GAN: Record<LoaiGan, string> = { giao_trinh_buoi: 'Giáo trình (bài trên lớp)', btvn: 'BTVN' }
// Trả id tài liệu mới + các doc của lớp vừa ĐỔI SỐ BUỔI (gán chèn giữa lịch ⇒ buổi sau dồn số) để caller dựng lại link in.
export async function ganDeThi(deId: string, lopId: string, ngay: string, loai: LoaiGan): Promise<{ taiLieuId: string; doiTen: { id: string; loai: string }[] }> {
  const { data, error } = await supabase.rpc('fn_de_thi_gan', { p_de: deId, p_lop: lopId, p_ngay: ngay, p_loai: loai })
  if (error) throw error
  return { taiLieuId: data as string, doiTen: await renumberBuoiLop(lopId) }
}
export type DeDaGan = { tai_lieu_id: string; loai: LoaiGan; ten: string; lop_id: string; lop_ten: string; ngay: string; created_at: string; bai_test_id: string | null; so_da_lam: number }
export async function listDeDaGan(deId: string): Promise<DeDaGan[]> {
  const { data, error } = await supabase.rpc('fn_de_thi_da_gan', { p_de: deId })
  if (error) throw error
  return (data ?? []) as DeDaGan[]
}

// Người sửa 1 câu ngay trên màn đề (CRUD dòng đơn — staff RLS). Sửa được MỌI thứ của câu: nội dung, phương án, đáp án,
// lời giải, hình, dạng; Đúng/Sai: mỗi MỆNH ĐỀ một dạng riêng (CEO 01/10) — không còn stamp 1 dạng cho cả 4 ý.
// `deId` có ⇒ bump tai_lieu.updated_at (đổi nội dung con phải để lại dấu thời gian ở cha — CLAUDE.md §2).
export type SuaCauPatch = {
  dang_chinh?: string; dap_an?: string | null; menh_de?: MenhDe[]
  noi_dung?: string; lua_chon?: string[] | null; loi_giai?: string | null; anh_de?: string | null; anh_dap_an?: string | null
}
export async function suaCauDeThi(mon: string, kho: Kho, maCau: string, patch: SuaCauPatch, deId?: string): Promise<void> {
  const { error } = await supabase.from(bangCuaKho(mon, kho).cauTbl).update(patch).eq('ma_cau', maCau)
  if (error) throw error
  if (deId) await supabase.from('tai_lieu').update({ updated_at: new Date().toISOString() }).eq('id', deId)
}

// ═══════════ KHO ĐỀ THI (spec-de-thi.md §10.5 K1, mig 202610011501) ═══════════
// 3 tab SUY ĐỘNG ở DB: chờ duyệt (chưa có dấu duyệt) · sẵn sàng (đã duyệt) · đã giao (có bài test trỏ về đề).
export type TabKhoDe = 'cho_duyet' | 'san_sang' | 'da_giao'
export type DeThiDong = {
  id: string; ten: string; khoi: string; mon: string; created_at: string; updated_at: string; duyet_at: string | null
  nguon: string | null; nam: number | null; co_de_goc: boolean
  so_cau: number; so_chan: number; so_chua_dang: number; so_canh_bao_nhap: number; so_luot: number; luot_gan_nhat: string | null
}
export async function demKhoDeThi(mon: string, khoi: string | null): Promise<Record<TabKhoDe, number>> {
  const { data, error } = await supabase.rpc('fn_de_thi_dem', { p_mon: mon, p_khoi: khoi })
  if (error) throw error
  return data as Record<TabKhoDe, number>
}
export async function listKhoDeThi(mon: string, khoi: string | null, tab: TabKhoDe, tim: string, truoc?: string | null): Promise<DeThiDong[]> {
  const { data, error } = await supabase.rpc('fn_de_thi_ds', { p_mon: mon, p_khoi: khoi, p_tab: tab, p_tim: tim || null, p_gioi_han: 25, p_truoc: truoc ?? null })
  if (error) throw error
  return (data ?? []) as DeThiDong[]
}
// Thêm 1 câu ĐÃ CÓ trong kho vào cuối một phần của đề. Câu thuộc kho khác nhánh mặc định của đề ⇒ ghi nhánh của câu vào
// cau_hinh.nhanhByCau (khoá tự nhiên ma_cau) để mọi chỗ resolve (`_de_thi_kho`) tìm đúng bảng.
export async function themCauVaoPhan(deId: string, phanId: string, maCau: string, kho: Kho): Promise<void> {
  const { data: cur, error: e0 } = await supabase.from('tai_lieu').select('cau_hinh, nhanh').eq('id', deId).single()
  if (e0) throw e0
  const row = cur as { cau_hinh: Record<string, unknown> | null; nhanh: string | null }
  const nhanh = nhanhCuaKho(kho)
  const byCau = { ...((row.cau_hinh?.nhanhByCau as Record<string, string> | undefined) ?? {}) }
  if ((nhanh ?? null) !== (row.nhanh ?? null)) { if (nhanh) byCau[maCau] = nhanh; else throw new Error('Đề này mặc định nhánh khác — chưa hỗ trợ thêm câu Đại số vào đề nhánh Hình') }
  const ds = await getPhanCauList(phanId)
  if (ds.includes(maCau)) throw new Error('Câu này đã có trong phần')
  const { error: e1 } = await supabase.from('tai_lieu_cau').insert({ phan_id: phanId, ma_cau: maCau, thu_tu: ds.length })
  if (e1) throw e1
  const { error } = await supabase.from('tai_lieu').update({ cau_hinh: { ...(row.cau_hinh ?? {}), nhanhByCau: byCau }, updated_at: new Date().toISOString() }).eq('id', deId)
  if (error) throw error
}
/** Ghi chú của máy lúc nhập (đáp án 2 nguồn lệch, công thức là ảnh…) — theo ma_cau, do /nhap-de-thi ghi vào cau_hinh. */
export function canhBaoNhap(d: Pick<DeThi, 'cau_hinh'>): Record<string, string[]> {
  const v = (d.cau_hinh?.deThi as { canhBaoCau?: unknown } | undefined)?.canhBaoCau
  return v && typeof v === 'object' ? (v as Record<string, string[]>) : {}
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
