// Giáo trình theo BẢN ĐỒ MỚI (spec-builder-ban-do-moi.md · mig 202610172312).
// Mọi chọn/xếp hạng/đặt buổi ở DB (fn_tl_bdm_*, CLAUDE.md §2.0); file này chỉ gọi hàm + CRUD dòng đơn.
// Danh tính dữ liệu = CÂU (A0): phần lưu mã câu; id nhóm/dạng bài chỉ dựng khung buổi + in.
import { supabase } from './supabase'
import { tieuDeBuoiLop, tenDocBuoi } from './tailieu'

// ── Cây chọn (bộ chọn nhóm / dạng bài) ──
export type ChonDangBai = { id: string; ten: string; mo_ta: string; so: number; co_ly_thuyet: boolean; co_vi_du: boolean; so_cau: number }
export type ChonNhom = { id: string; ten: string; mo_ta: string; so: number; co_ly_thuyet: boolean; so_cau_chua_phan: number; dang_bai: ChonDangBai[] }
export type ChonChuyenDe = { id: string; ten: string; so: number; nhom: ChonNhom[] }
export type ChonChuDe = { id: string; ten: string; chuyen_de: ChonChuyenDe[] }
export async function cayChon(khoi: string, nhanh = 'toan'): Promise<ChonChuDe[]> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_cay_chon', { p_khoi: khoi, p_nhanh: nhanh })
  if (error) throw error
  return ((data as { chu_de: ChonChuDe[] })?.chu_de ?? [])
}

// ── Nội dung giáo trình (builder + in) ──
export type KhoiCau = { phan_id: string; caus: string[] }
export type NdDangBai = {
  phan_id: string; id: string; stt: number; hien_lt: boolean; hien_vi_du: boolean
  ten: string | null; mo_ta: string | null; con_tren_ban_do: boolean
  ly_thuyet: string | null; ly_thuyet_file_url: string | null; vi_du: string | null; vi_du_file_url: string | null
  caus: string[]
}
export type NdNhom = {
  phan_id: string; id: string; stt: number; hien_lt: boolean
  ten: string | null; mo_ta: string | null; con_tren_ban_do: boolean
  ly_thuyet: string | null; ly_thuyet_file_url: string | null
  dang_bai: NdDangBai[]; chua_phan: KhoiCau | null; btvn: KhoiCau | null
}
// on_tap = khối ÔN TẬP trong phiếu BTVN của lớp (loai_phan 'ontap_nhom') — giáo trình gốc luôn rỗng.
// lui_bac có giá trị = phần LUYỆN LẠI buổi trước do máy xếp chồng (1 = buổi liền trước, 2 = buổi trước nữa — mig 202611131635); không có = ôn tập GV chọn tay.
export type NdOnTap = { phan_id: string; id: string; ten: string | null; caus: string[]; lui_bac?: number | null; lui_buoi?: string | null }
export type NdBuoi = { id: string; tieu_de: string | null; thu_tu: number; nhom: NdNhom[]; chua_khop: KhoiCau | null; on_tap?: NdOnTap[] }
export type NoiDung = {
  tai_lieu: { id: string; ten: string; khoi: string; mon: string; nhanh: string | null; ban_do: 'cu' | 'moi'; luu_tru_tu: string | null; cau_hinh: Record<string, unknown>; updated_at: string; lop_id?: string | null }
  buoi: NdBuoi[]
}
/** Nguồn từng câu / bài của 1 tài liệu (mã ⇒ "Đề thi giữa kì 1 năm 2025-2026 — THCS …") — chuyên đề in kèm (Thùy 21/10). Rút gọn tên ở DB. */
export async function nguonCau(taiLieuId: string): Promise<Record<string, string>> {
  const { data, error } = await supabase.rpc('fn_tl_nguon_cau', { p_tai_lieu: taiLieuId }).limit(5000)
  if (error) throw error
  return Object.fromEntries(((data ?? []) as { ma_cau: string; nguon: string }[]).map((r) => [r.ma_cau, r.nguon]))
}
export async function noiDung(taiLieuId: string, buoiId?: string | null): Promise<NoiDung> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_noi_dung', { p_tai_lieu: taiLieuId, p_buoi: buoiId ?? null })
  if (error) throw error
  return data as NoiDung
}

// ── Đặt nhóm + dạng bài cho 1 buổi (1 transaction ở DB) — trả lại buổi đó để vá tại chỗ ──
export type ChonBuoi = { nhom: string; dang_bai: string[] }[]
export async function datBuoi(taiLieuId: string, buoiId: string, chon: ChonBuoi): Promise<NdBuoi> {
  // BTVN của nhóm MỚI thêm: mặc định 5 câu (Thùy 13/11 — 5 · 3 · 2: buổi này · buổi trước · buổi trước nữa)
  const { data, error } = await supabase.rpc('fn_tl_bdm_dat_buoi', { p_tai_lieu: taiLieuId, p_buoi: buoiId, p_chon: chon, p_so_btvn: { ...SO_BTVN_MAC_DINH, _tong: 5 } })
  if (error) throw error
  return (data as NoiDung).buoi[0]
}
// Thay câu của 1 phần (dạng bài / chưa phân / BTVN nhóm) — DB chặn câu đã dùng ở phần khác cùng buổi.
export async function datCau(phanId: string, maCaus: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_tl_bdm_dat_cau', { p_phan: phanId, p_ma_caus: maCaus })
  if (error) throw error
}

// ── Gợi ý câu (luật cũ: rải dạng bài → rải cụm → ít dùng, câu gốc trước) ──
// soLuong: { trac_nghiem: n, tra_loi_ngan: n, tu_luan: n } — tự thêm _tong = tổng để lấp khi loại nào thiếu câu.
export async function goiY(nhomId: string, dangBai: string[] | null, soLuong: Record<string, number>, tru: string[]): Promise<string[]> {
  const tong = Object.values(soLuong).reduce((s, n) => s + n, 0) // tổng ô người gõ (UI), không phải số liệu nghiệp vụ
  const { data, error } = await supabase.rpc('fn_tl_bdm_goi_y', { p_nhom: nhomId, p_dang_bai: dangBai, p_so: { ...soLuong, _tong: tong }, p_tru: tru })
  if (error) throw error
  return (data ?? []) as string[]
}
export const SO_LUYEN_MAC_DINH: Record<string, number> = { trac_nghiem: 1, tra_loi_ngan: 0, tu_luan: 1 }
export const SO_BTVN_MAC_DINH: Record<string, number> = { trac_nghiem: 2, tra_loi_ngan: 1, tu_luan: 2 }   // 5 câu / nhóm
// Số câu mặc định của nút Gợi ý ở phần LUYỆN LẠI: buổi trước 3 câu, buổi trước nữa 2 câu (tương đối — GV đổi số rồi Gợi ý lại).
export const SO_LUI_MAC_DINH: Record<number, Record<string, number>> = {
  1: { trac_nghiem: 1, tra_loi_ngan: 1, tu_luan: 1 },
  2: { trac_nghiem: 1, tra_loi_ngan: 0, tu_luan: 1 },
}

// ── BTVN 3 PHẦN soạn trong giáo trình (Thùy 13/11 · mig 202611131755): buổi này · luyện lại buổi trước · buổi trước nữa ──
// Khung = mỗi buổi → 2 buổi có nhóm đứng ngay trước, bày sẵn nhóm + dạng bài + câu đã chọn. Mọi chọn / kiểm trùng ở DB.
export type KhungO = { nhom: string; ten: string | null; dang_bai: string[]; phan_id: string | null; caus: string[] }
export type KhungLui = { bac: 1 | 2; buoi: string; tieu_de: string | null; nhom: KhungO[] }
export type KhungLe = { phan_id: string; nhom: string; ten: string | null; caus: string[] }
export type KhungBtvn = { tru: string[]; buoi: Record<string, { lui: KhungLui[]; le: KhungLe[] }> }
export async function btvnKhung(taiLieuId: string): Promise<KhungBtvn> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_btvn_khung', { p_tai_lieu: taiLieuId })
  if (error) throw error
  return data as KhungBtvn
}
export async function datCauLui(taiLieuId: string, buoiId: string, luiBuoi: string, nhom: string, maCaus: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_tl_bdm_dat_cau_lui', { p_tai_lieu: taiLieuId, p_buoi: buoiId, p_lui_buoi: luiBuoi, p_nhom: nhom, p_ma_caus: maCaus })
  if (error) throw error
}
export async function boPhanLui(phanId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_tl_bdm_bo_phan_lui', { p_phan: phanId })
  if (error) throw error
}
/** Gợi ý + ghi luôn cho 1 ô luyện lại; trả bộ câu mới (rỗng = hết câu khác, bộ cũ giữ nguyên). */
export async function luiGoiY(taiLieuId: string, buoiId: string, luiBuoi: string, nhom: string, soLuong: Record<string, number>): Promise<string[]> {
  const tong = Object.values(soLuong).reduce((s, n) => s + n, 0) // tổng ô người gõ (UI)
  const { data, error } = await supabase.rpc('fn_tl_bdm_lui_goi_y', { p_tai_lieu: taiLieuId, p_buoi: buoiId, p_lui_buoi: luiBuoi, p_nhom: nhom, p_so: { ...soLuong, _tong: tong } })
  if (error) throw error
  return (data ?? []) as string[]
}
/** Gợi ý cho mọi ô luyện lại còn trống của 1 buổi (3 câu / nhóm buổi trước · 2 câu / nhóm buổi trước nữa). Trả số ô đã điền. */
export async function luiGoiYBuoi(taiLieuId: string, buoiId: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_lui_goi_y_buoi', { p_tai_lieu: taiLieuId, p_buoi: buoiId })
  if (error) throw error
  return (data ?? 0) as number
}

// ── Kho TRÊN LỚP của 1 nhóm (Thùy 22/10 — giáo trình chọn từ cả 2 kho; mig 202610221509) ──
export type CauLopKho = { ma_cau: string; dang_bai_id: string; vai: 'giang' | 'luyen'; loai_cau: string; so_lan_dung: number }
export async function cauLopCuaNhom(nhomId: string): Promise<CauLopKho[]> {
  const { data, error } = await supabase.rpc('fn_dai_lop_cua_nhom', { p_nhom: nhomId })
  if (error) throw error
  return (data ?? []) as CauLopKho[]
}
// ── Kho câu của 1 nhóm (cho "✎ Chọn câu") ──
export type CauKho = { ma_cau: string; dang_bai_id: string | null; loai_cau: string; la_goc: boolean; cum: string; so_lan_dung: number }
export async function cauCuaNhom(nhomId: string): Promise<CauKho[]> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_cau', { p_nhom: nhomId })
  if (error) throw error
  return (data ?? []) as CauKho[]
}

// Dạng bài của 1 nhóm theo thứ tự bản đồ (chỉ để đặt tên nhóm câu trong popup chọn câu).
export async function dangBaiCuaNhom(nhomId: string): Promise<{ id: string; ten: string }[]> {
  // registry môn (Toán · KHTN), mig 202611031655
  const { data, error } = await supabase.from('tl_bdm_dang_bai_v').select('id, ten').eq('nhom_id', nhomId).order('thu_tu').order('id').limit(500)
  if (error) throw error
  return (data ?? []) as { id: string; ten: string }[]
}

// ── Cờ in của 1 phần (CRUD dòng đơn) ──
export async function datCoPhan(phanId: string, patch: { hien_lt?: boolean; hien_vi_du?: boolean }): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').update(patch).eq('id', phanId)
  if (error) throw error
}
// Xoá 1 buổi: xoá mốc buổi — phần con (nhóm → dạng bài/BTVN) + câu tự xoá theo cha_id (cascade ở DB).
export async function xoaBuoi(buoiId: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').delete().eq('id', buoiId).eq('loai_phan', 'buoi')
  if (error) throw error
}

// ── GÁN LỚP (trích 1 buổi gốc → tài liệu của lớp theo ngày) — RIÊNG giáo trình bản đồ mới, không qua trichXuatBuoi cũ ──
// Khung giống hệt giáo trình cũ để bên vận hành (lịch lớp, đánh giá, test online, link PDF) đọc như nhau: tài liệu
// `giao_trinh_buoi` / `btvn` bám (lớp + ngày), nguon_id/nguon_buoi trỏ giáo trình gốc, tên + số buổi = số CỦA LỚP.
// Gán lại cùng (lớp + ngày + loại) = THAY tài liệu cũ (như giáo trình cũ — unique uq_tai_lieu_van_hanh).
// Nội dung đổ bằng fn_tl_bdm_trich_buoi (giữ cây nhóm → dạng bài, 1 transaction).
export type OnTapChon = { nhom: string; caus: string[] }
// ── PHIẾU BTVN 3 PHẦN của lớp (Thùy 13/11, spec-muc-tieu-tuan.md §8.1) ──
// Phiếu = bài của buổi này + phần LUYỆN LẠI buổi trước / buổi trước nữa ĐÃ SOẠN trong giáo trình gốc (builder, chế độ BTVN).
// Gán lớp chỉ chép (fn_tl_bdm_trich_btvn kiểm câu thuộc đúng phần đã soạn) — không tự chia.
export type PhieuXepChong = { nay: OnTapChon[]; lui: { bac: number; buoi: string | null; nhom: string; caus: string[] }[] }
export async function trichBuoiBdm(masterId: string, buoiId: string, o: {
  lopId: string; ngay: string; khoi: string; tenLop: string; tenBuoi: string; loai: 'giao_trinh_buoi' | 'btvn'; onTap?: OnTapChon[]
  /** Phiếu BTVN có phần luyện lại (chỉ loai 'btvn', không phải giáo trình Hình): ghi bằng fn_tl_bdm_trich_btvn. Không truyền = chép trọn BTVN của buổi như cũ. */
  phieu?: PhieuXepChong
}): Promise<{ id: string; loai: string }> {
  const { data: master, error: e0 } = await supabase.from('tai_lieu').select('cau_hinh, theme, mon, nhanh').eq('id', masterId).single()
  if (e0) throw e0
  // Số buổi của LỚP = hạng của ngày trong lịch đã gán (kể cả ngày này) — renumberBuoiLop chốt lại cả lớp sau đó.
  const { data: dsNgay, error: e1 } = await supabase.from('tai_lieu').select('ngay').eq('lop_id', o.lopId).in('loai', ['giao_trinh_buoi', 'btvn']).limit(10000)
  if (e1) throw e1
  const ngays = [...new Set([...((dsNgay ?? []) as { ngay: string | null }[]).map((r) => r.ngay).filter(Boolean) as string[], o.ngay])].sort()
  const stt = ngays.indexOf(o.ngay) + 1
  const tieuDe = tieuDeBuoiLop(o.tenBuoi, stt)
  const { data: { user } } = await supabase.auth.getUser()
  const { error: e2 } = await supabase.from('tai_lieu').delete().eq('loai', o.loai).eq('lop_id', o.lopId).eq('ngay', o.ngay)
  if (e2) throw e2
  const m = master as { cau_hinh: unknown; theme: string; mon: string; nhanh: string | null }
  const { data: doc, error: e3 } = await supabase.from('tai_lieu').insert({
    loai: o.loai, ten: tenDocBuoi(o.loai, o.tenLop, o.ngay, tieuDe), khoi: o.khoi, mon: m.mon, nhanh: m.nhanh, theme: m.theme, cau_hinh: m.cau_hinh ?? {},
    ban_do: 'moi', lop_id: o.lopId, ngay: o.ngay, nguon_id: masterId, nguon_buoi: buoiId, stt_lop: stt, created_by: user?.id ?? null,
  }).select('id, loai').single()
  if (e3) throw e3
  // Giáo trình Hình (Học + Luyện, mig 202610271757) có hàm chép riêng — cùng tham số.
  const xepChong = o.loai === 'btvn' && m.nhanh !== 'hinh' && o.phieu
  const { error: e4 } = xepChong
    ? await supabase.rpc('fn_tl_bdm_trich_btvn', {
      p_master: masterId, p_buoi: buoiId, p_den: (doc as { id: string }).id, p_tieu_de: tieuDe, p_phieu: { ...o.phieu, on_tap: o.onTap ?? [] },
    })
    : await supabase.rpc(m.nhanh === 'hinh' ? 'fn_tl_hinh_trich_buoi' : 'fn_tl_bdm_trich_buoi', {
      p_master: masterId, p_buoi: buoiId, p_den: (doc as { id: string }).id, p_loai: o.loai === 'btvn' ? 'btvn' : 'gt', p_tieu_de: tieuDe, p_on_tap: o.onTap ?? [],
    })
  if (e4) {
    await supabase.from('tai_lieu').delete().eq('id', (doc as { id: string }).id) // vừa tạo, chưa có nội dung ⇒ gỡ để khỏi để lại tài liệu rỗng
    throw e4
  }
  return doc as { id: string; loai: string }
}
// Nhóm có thể ôn trong phiếu BTVN của buổi: nhóm của các buổi TRƯỚC (giáo trình gốc), không có trong buổi này.
// v1 GV chọn tay — chưa xếp theo mastery (mastery còn đo theo nhóm cũ; chờ làm lại mastery theo câu).
export type UngVienOnTap = { nhom: string; ten: string | null; buoi: string | null }
export async function onTapUngVien(masterId: string, buoiId: string): Promise<UngVienOnTap[]> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_on_tap_ung_vien', { p_master: masterId, p_buoi: buoiId })
  if (error) throw error
  return (data ?? []) as UngVienOnTap[]
}
// Ứng viên ôn tập XẾP THEO MASTERY HIỆN TẠI của lớp (Thùy 09/11, mig 202611091506 — fn_tl_bdm_on_tap_xep): tính ngay lúc gọi, ET+MT (BTVN vẫn tham khảo).
// Nhóm lớp đang yếu lên đầu → chưa đo → đã đạt. diem 0–1 (trung bình ô HS × dạng bài của nhóm); null = lớp CHƯA có số đo nhóm này (không phải "yếu").
export type UngVienXep = UngVienOnTap & { so_hs: number; so_hs_do: number; diem: number | null; pct_dat: number | null; muc: 'yeu' | 'can_luyen' | 'dat' | null }
export async function onTapXep(masterId: string, buoiId: string, lopId: string): Promise<{ ds: UngVienXep[]; xepTheoMastery: boolean }> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_on_tap_xep', { p_master: masterId, p_buoi: buoiId, p_lop: lopId })
  if (!error) return { ds: (data ?? []) as UngVienXep[], xepTheoMastery: true }
  // Hàm mới chưa có / quá chậm ⇒ lùi về danh sách cũ (không xếp), đừng chặn GV tạo phiếu.
  const cu = await onTapUngVien(masterId, buoiId)
  return { ds: cu.map((u) => ({ ...u, so_hs: 0, so_hs_do: 0, diem: null, pct_dat: null, muc: null })), xepTheoMastery: false }
}
export const CAP_NHOM_ON_TAP = 2       // tối đa nhóm ôn / phiếu (giữ như ôn tập giáo trình cũ: CAP_DANG = 2)
export const SO_CAU_ON_TAP = 2         // câu / nhóm ôn (như cũ: CAP_CAU_MOI_DANG = 2)

// Mọi mã câu đang có trong 1 buổi (để nạp nội dung câu + né trùng khi gợi ý).
export function cauCuaBuoi(b: NdBuoi): string[] {
  return b.nhom.flatMap((n) => [...n.dang_bai.flatMap((d) => d.caus), ...(n.chua_phan?.caus ?? []), ...(n.btvn?.caus ?? [])]).concat(b.chua_khop?.caus ?? [], (b.on_tap ?? []).flatMap((o) => o.caus))
}
// ── ET theo bản đồ mới (mig 202610202008) — lưu y khuôn ET cũ (tai_lieu loai='et', ban_do='moi'), chỉ khác cách CHỌN câu ──
export type EtDeXuat = { giao_trinh: string | null; dang_bai: { id: string; nhom_id: string; ten: string }[] }
/** Dạng bài đã dạy buổi đó (giáo trình buổi bản đồ mới của lớp + ngày) — điền sẵn kế hoạch ET. */
export async function etDeXuat(lopId: string, ngay: string): Promise<EtDeXuat> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_et_de_xuat', { p_lop: lopId, p_ngay: ngay })
  if (error) throw error
  return data as EtDeXuat
}
/** Câu → dạng bài / nhóm (mở lại ET đã lưu). */
export async function etViTri(khoi: string, maCaus: string[]): Promise<{ ma_cau: string; dang_bai_id: string | null; nhom_id: string | null }[]> {
  if (!maCaus.length) return []
  const { data, error } = await supabase.rpc('fn_tl_bdm_et_vi_tri', { p_khoi: khoi, p_ma: maCaus })
  if (error) throw error
  return (data ?? []) as { ma_cau: string; dang_bai_id: string | null; nhom_id: string | null }[]
}
/** Đề 2 & 3 (cùng dạng bài + cùng cụm + cùng form; thiếu thì trùng trong cụm). base theo thứ tự đề gốc. */
export async function etMaDe(khoi: string, base: { ma_cau: string; dang_bai: string; form: string }[]): Promise<{ etMaDe: Record<string, string[]>; etFormByCau: Record<string, string> }> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_et_ma_de', { p_khoi: khoi, p_base: base })
  if (error) throw error
  return data as { etMaDe: Record<string, string[]>; etFormByCau: Record<string, string> }
}
/** N câu ít dùng nhất của 1 dạng bài (né p_tru) — luật gợi ý chung của builder mới. */
// loai: chỉ lấy câu đúng loại kho (vd MT khối 12 khuôn THPT — Phần I chỉ trắc nghiệm, Phần III chỉ trả lời ngắn).
export async function goiYDangBai(nhomId: string, dangBaiId: string, n: number, tru: string[], loai?: string | null): Promise<string[]> {
  const { data, error } = await supabase.rpc('fn_tl_bdm_goi_y', { p_nhom: nhomId, p_dang_bai: [dangBaiId], p_so: loai ? { [loai]: n } : { _tong: n }, p_tru: tru })
  if (error) throw error
  return (data ?? []) as string[]
}

// Lỗi RPC → câu người đọc được (P0001 do hàm DB raise đã là tiếng Việt).
export function loiDoc(e: unknown): string {
  const m = (e as { message?: string })?.message ?? String(e)
  return m
}
