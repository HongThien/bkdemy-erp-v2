// CÂY NHÁNH BÀI của Hình luyện (spec-hinh-cay-nhanh.md). Data-layer + thuật toán XẾP CHỖ.
//
// Ranh giới (CLAUDE.md §2.0):
//   · SỐ HIỂN THỊ (1.6.1.1), GIẢ THIẾT HIỆU LỰC, CỜ SAI NHÁNH  ⇒ hàm Postgres `fn_hl_*` — ở đây chỉ GỌI.
//   · MỌI thao tác sửa cây ⇒ RPC `fn_hl_re_nhanh / chuyen_bai / doi_thu_tu / doi_neo` (1 transaction).
//   · XẾP CHỖ trên màn (`xepCay`) là hiển thị thuần ⇒ chạy ở client, không ghi gì.
// MÃ GỐC BẤT BIẾN (CLAUDE.md §2): khoá ở mọi chỗ là `id`/`ma`; `so` chỉ để người đọc.
import { supabase } from '../supabase'
import type { BaiToan, Luoi, MoHinh } from './hinh'

// ══════════════════ KIỂU ══════════════════
/** Một dòng kết quả RPC: bài + số hiển thị + nhánh chứa nó. */
export type BaiCay = { id: string; ma: string; so: string; mo_hinh_id: string; thu_tu: number | null }
export type KetQuaCay = { goc: string; nhanh_moi: string | null; bai: BaiCay[] }
export type SaiNhanh = { baitoan_id: string; ma: string; tien_de_id: string; ma_tien_de: string }

// ══════════════════ ĐỌC ══════════════════
export async function soHienThiCay(gocId: string): Promise<BaiCay[]> {
  const { data, error } = await supabase.rpc('fn_hl_so_hien_thi', { p_goc: gocId })
  if (error) throw error
  return ((data ?? []) as { baitoan_id: string; mo_hinh_id: string; so: string; ma: string }[])
    .map((r) => ({ id: r.baitoan_id, ma: r.ma, so: r.so, mo_hinh_id: r.mo_hinh_id, thu_tu: null }))
}
export async function saiNhanhCay(gocId: string): Promise<SaiNhanh[]> {
  const { data, error } = await supabase.rpc('fn_hl_sai_nhanh', { p_goc: gocId })
  if (error) throw error
  return (data ?? []) as SaiNhanh[]
}
export async function giaThietHieuLuc(baiToanId: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_hl_gia_thiet_hieu_luc', { p_baitoan: baiToanId })
  if (error) throw error
  return (data as string | null) ?? ''
}
/** Một dòng mô hình/nhánh — dùng để vá sau khi RPC tạo nhánh mới hoặc đổi neo. */
export async function layMoHinh(id: string): Promise<MoHinh | null> {
  const { data, error } = await supabase.from('hinh_mo_hinh').select('*').eq('id', id).limit(1).maybeSingle()
  if (error) throw error
  return (data as MoHinh | null) ?? null
}

// ══════════════════ GHI (RPC) ══════════════════
const kq = (data: unknown) => data as KetQuaCay
export async function reNhanh(baiIds: string[], ten: string, giaThietThem: string): Promise<KetQuaCay> {
  const { data, error } = await supabase.rpc('fn_hl_re_nhanh', { p_bai_ids: baiIds, p_ten: ten, p_gia_thiet_them: giaThietThem })
  if (error) throw error
  return kq(data)
}
export async function chuyenBaiCay(baiId: string, nhanhId: string): Promise<KetQuaCay> {
  const { data, error } = await supabase.rpc('fn_hl_chuyen_bai', { p_bai: baiId, p_nhanh: nhanhId })
  if (error) throw error
  return kq(data)
}
export async function doiThuTuCay(baiId: string, viTri: number): Promise<KetQuaCay> {
  const { data, error } = await supabase.rpc('fn_hl_doi_thu_tu', { p_bai: baiId, p_vi_tri: viTri })
  if (error) throw error
  return kq(data)
}
export async function doiNeoCay(nhanhId: string, baiMoiId: string): Promise<KetQuaCay> {
  const { data, error } = await supabase.rpc('fn_hl_doi_neo', { p_nhanh: nhanhId, p_bai_moi: baiMoiId })
  if (error) throw error
  return kq(data)
}
/** Sửa tên / giả thiết thêm của một nhánh — CRUD dòng đơn. Mã nhánh không đổi. */
export async function suaNhanh(id: string, v: { ten: string; gia_thiet_them: string | null }): Promise<void> {
  const { error } = await supabase.from('hinh_mo_hinh')
    .update({ ten: v.ten, gia_thiet_them: v.gia_thiet_them, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

// ══════════════════ CẤU TRÚC CÂY (từ snapshot lưới) ══════════════════
/** Nhánh nào thuộc cây của `gocId`: leo `neo_baitoan_id` → mô hình chứa bài neo, tới khi gặp gốc. */
export function nhanhCuaCay(moHinh: MoHinh[], baiToan: Pick<BaiToan, 'id' | 'mo_hinh_id'>[], gocId: string): MoHinh[] {
  const mhCuaBai = new Map(baiToan.map((b) => [b.id, b.mo_hinh_id]))
  const byId = new Map(moHinh.map((m) => [m.id, m]))
  const gocCua = (id: string): string => {
    let cur = id
    for (let i = 0; i < 64; i++) {
      const neo = byId.get(cur)?.neo_baitoan_id
      const len = neo ? mhCuaBai.get(neo) : undefined
      if (!len) return cur
      cur = len
    }
    return cur
  }
  return moHinh.filter((m) => m.id === gocId || (m.neo_baitoan_id && gocCua(m.id) === gocId))
}
/** Các mô hình là GỐC cây (không neo). Mô hình con kiểu cũ (có cha trong `canh`) cũng là gốc riêng. */
export const gocCayCua = (L: Luoi) => L.moHinh.filter((m) => !m.neo_baitoan_id)

// ══════════════════ XẾP CHỖ (spec §4.2) ══════════════════
// Chỉ hai hướng: XUỐNG và SANG PHẢI. Thân = hàng 0. Nhánh = một HÀNG NGANG: thẻ giả thiết thêm ở cột bài mẹ,
// bài chạy sang phải. Ưu tiên 1: nhánh có bài mẹ càng ở PHÍA SAU càng gần hàng 1. Ưu tiên 2: nhánh phía
// trước không đè nhánh phía sau — vướng thì lùi xuống hàng dưới (hành lang thẳng xuống được giữ chỗ).
// Hành lang bị chặn mới dời cả hàng sang phải.
export type O = { c: number; r: number }
export type BoCuc = {
  bai: Map<string, O>                                   // baiId → ô
  nhanh: Map<string, O & { len: number }>               // nhanhId → ô của THẺ GIẢ THIẾT (đầu hàng) + độ dài hàng
  gap: Map<string, O>                                   // nhanhId đang gập → ô của thẻ "▸ N bài"
  conCu: Map<string, O>                                 // mô hình con kiểu cũ (card đi vào) → ô, cuối thân
  soCot: number; soHang: number
}
export function xepCay(a: {
  gocId: string
  lan: Map<string, string[]>          // nhanhId (kể cả gốc) → bài theo thứ tự
  neo: Map<string, string>            // nhanhId → bài mẹ
  mhCuaBai: Map<string, string>       // bài → nhánh chứa nó
  gapLai: Set<string>                 // nhánh người dùng gập
  conCu: string[]                     // mô hình con kiểu cũ của gốc
}): BoCuc {
  const occ = new Set<string>()
  const k = (c: number, r: number) => `${c},${r}`
  const bai = new Map<string, O>(), nhanh = new Map<string, O & { len: number }>(), gap = new Map<string, O>(), conCu = new Map<string, O>()

  const than = a.lan.get(a.gocId) ?? []
  than.forEach((id, i) => { bai.set(id, { c: i, r: 0 }); occ.add(k(i, 0)) })
  a.conCu.forEach((id, i) => { conCu.set(id, { c: than.length + i, r: 0 }); occ.add(k(than.length + i, 0)) })

  const chaCua = (n: string) => { const b = a.neo.get(n); return b ? a.mhCuaBai.get(b) : undefined }
  const doSau = (n: string) => { let d = 0, cur: string | undefined = n; while (cur && cur !== a.gocId && d < 64) { cur = chaCua(cur); d++ } return d }
  const anVi = (n: string) => {           // có tổ tiên đang gập ⇒ không vẽ
    let cur = chaCua(n)
    for (let i = 0; cur && cur !== a.gocId && i < 64; i++) { if (a.gapLai.has(cur)) return true; cur = chaCua(cur) }
    return false
  }
  const ds = [...a.neo.keys()].filter((n) => !anVi(n))
  const sauMax = ds.reduce((m, n) => Math.max(m, doSau(n)), 0)
  for (let d = 1; d <= sauMax; d++) {
    const lop = ds.filter((n) => doSau(n) === d && bai.has(a.neo.get(n)!))
      .sort((x, y) => { const p = bai.get(a.neo.get(x)!)!, q = bai.get(a.neo.get(y)!)!; return q.c - p.c || q.r - p.r })
    for (const n of lop) {
      const me = bai.get(a.neo.get(n)!)!
      const baiN = a.lan.get(n) ?? []
      const daGap = a.gapLai.has(n)
      const len = 1 + (daGap ? 1 : baiN.length)
      let at: O | null = null
      for (let dc = 0; dc <= 8 && !at; dc++) {
        const col = me.c + dc
        for (let r = me.r + 1; r < me.r + 200; r++) {
          let hanhLang = true
          for (let y = me.r + 1; y < r; y++) if (occ.has(k(col, y))) { hanhLang = false; break }
          if (!hanhLang) break                                   // xuống bị chặn ⇒ thử cột bên phải
          let trong = true
          for (let i = 0; i < len; i++) if (occ.has(k(col + i, r))) { trong = false; break }
          if (trong) { at = { c: col, r }; break }
        }
      }
      if (!at) at = { c: me.c + 9, r: me.r + 1 }                 // không tới được (cây quá rậm) — vẫn vẽ, không mất bài
      for (let y = me.r + 1; y < at.r; y++) occ.add(k(at.c, y))
      for (let i = 0; i < len; i++) occ.add(k(at.c + i, at.r))
      nhanh.set(n, { ...at, len })
      if (daGap) gap.set(n, { c: at.c + 1, r: at.r })
      else baiN.forEach((id, i) => bai.set(id, { c: at!.c + 1 + i, r: at!.r }))
    }
  }
  let soCot = than.length + a.conCu.length, soHang = 1
  const xet = (o: O, w = 1) => { soCot = Math.max(soCot, o.c + w); soHang = Math.max(soHang, o.r + 1) }
  bai.forEach((o) => xet(o)); nhanh.forEach((o) => xet(o, o.len)); gap.forEach((o) => xet(o))
  return { bai, nhanh, gap, conCu, soCot, soHang }
}

// ══════════════════ TẠO / SỬA (mig 202610140141) ══════════════════
/** Mô hình GỐC mới cho Hình luyện — sinh ra với phan='luyen'. Trả id. */
export async function taoMoHinhLuyen(khoi: string, ten: string, giaThiet: string, anh: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('fn_hl_tao_mo_hinh', { p_khoi: khoi, p_ten: ten, p_gia_thiet: giaThiet, p_anh: anh })
  if (error) throw error
  return data as string
}
export type BaiNhap = { phatBieu: string; giaThietRieng: string | null; loiGiai: string | null; anh: string | null; tienDe: string[] }
/** Thêm bài vào CUỐI một làn (thân hoặc nhánh) — bài + cách giải mặc định + tiền đề trong 1 transaction. */
export async function themBaiCay(nhanhId: string, b: BaiNhap): Promise<KetQuaCay & { bai_moi: string }> {
  const { data, error } = await supabase.rpc('fn_hl_them_bai', {
    p_nhanh: nhanhId, p_phat_bieu: b.phatBieu, p_gia_thiet_rieng: b.giaThietRieng, p_loi_giai: b.loiGiai, p_anh: b.anh, p_tien_de: b.tienDe })
  if (error) throw error
  return data as KetQuaCay & { bai_moi: string }
}
/** Sửa bài — mã KHÔNG đổi. */
export async function suaBaiCay(baiId: string, b: BaiNhap): Promise<KetQuaCay & { bai_moi: string }> {
  const { data, error } = await supabase.rpc('fn_hl_sua_bai', {
    p_bai: baiId, p_phat_bieu: b.phatBieu, p_gia_thiet_rieng: b.giaThietRieng, p_loi_giai: b.loiGiai, p_anh: b.anh, p_tien_de: b.tienDe })
  if (error) throw error
  return data as KetQuaCay & { bai_moi: string }
}

// ══════════════════ KHO LUYỆN · "CHƯA PHÂN MÔ HÌNH" (mig 202610140230) ══════════════════
export type YKho = {
  id: string; ma_y: string; thu_tu: number; nhan: string | null; noi_dung: string; gia_thiet_them: string | null
  dap_an: string | null; loi_giai: string | null; anh_loi_giai: string | null; anh_de: string | null
  da_duyet: boolean; baitoan_id: string | null
}
export type BaiKho = {
  id: string; ma_bai: string; khoi: string | null; nguon: string | null; nguon_ma_cau: string | null
  de_bai: string; gia_thiet_chung: string | null; huong_dan: string | null; anh_de: string | null; can_tach_tay: boolean
  mo_hinh_id: string | null   // mô hình luyện đã gán cho CẢ BÀI (null = chưa)
  loai_cau: LoaiCauHL         // mô hình luyện CHỈ lấy 'tu_luan'; loại khác ở "kho riêng" (mig 202610181623)
  bo_qua_at: string | null; bo_qua_ly_do: string | null; bo_qua_ten: string | null   // "Bỏ qua" = không duyệt vào kho, kèm lý do
  y: YKho[]
}
export type LoaiCauHL = 'tu_luan' | 'trac_nghiem' | 'dung_sai' | 'tra_loi_ngan'
export const NHAN_LOAI_CAU_HL: Record<LoaiCauHL, string> = { tu_luan: 'Tự luận', trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng/Sai', tra_loi_ngan: 'Trả lời ngắn' }
/** Ba hàng của màn: chờ duyệt (tự luận) · đã bỏ qua · kho riêng (không phải tự luận) */
export type CheDoHL = 'cho' | 'bo_qua' | 'khac'
export type BaiMoHinhLuyen = {
  baitoan_id: string; ma: string; so: string; phat_bieu: string
  goc_id: string; goc_ma: string; goc_ten: string; nhanh_id: string; nhanh_ten: string
}
/** Bài kho còn ít nhất 1 ý chưa gán bài mô hình — hàng "chưa phân mô hình" của Duyệt kho. Phân trang ở DB. */
export async function khoChuaPhanMoHinh(khoi: string, gioiHan = 30, boQua = 0, cheDo: CheDoHL = 'cho'): Promise<BaiKho[]> {
  const { data, error } = await supabase.rpc('fn_hl_kho_chua_phan', { p_khoi: khoi, p_gioi_han: gioiHan, p_bo_qua: boQua, p_che_do: cheDo })
  if (error) throw error
  return (data ?? []) as BaiKho[]
}
/** Số bài của hai hàng phụ trong một khối: đã bỏ qua · kho riêng (không tự luận). Đếm ở DB. */
export async function demHangPhuHL(khoi: string): Promise<{ bo_qua: number; khac: number }> {
  const { data, error } = await supabase.rpc('fn_hl_dem_hang_phu', { p_khoi: khoi })
  if (error) throw error
  const r = ((data ?? []) as { bo_qua: number | string; khac: number | string }[])[0]
  return { bo_qua: Number(r?.bo_qua ?? 0), khac: Number(r?.khac ?? 0) }
}
/** "Bỏ qua": không duyệt bài vào kho — BẮT BUỘC có lý do (DB từ chối nếu trống). */
export async function boQuaBaiKho(baiId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_bo_qua_bai', { p_bai: baiId, p_ly_do: lyDo })
  if (error) throw error
}
export async function khoiPhucBaiKho(baiId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_khoi_phuc_bai', { p_bai: baiId })
  if (error) throw error
}
/** Đổi loại câu của bài (vd máy xếp nhầm trắc nghiệm → đưa về tự luận). */
export async function doiLoaiBaiKho(baiId: string, loai: LoaiCauHL): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_doi_loai_bai', { p_bai: baiId, p_loai: loai })
  if (error) throw error
}
export async function demChuaPhanMoHinh(): Promise<{ khoi: string | null; so_bai: number; so_y: number }[]> {
  const { data, error } = await supabase.rpc('fn_hl_dem_chua_phan')
  if (error) throw error
  return ((data ?? []) as { khoi: string | null; so_bai: number | string; so_y: number | string }[])
    .map((r) => ({ khoi: r.khoi, so_bai: Number(r.so_bai), so_y: Number(r.so_y) }))
}
/** Mọi bài của các mô hình LUYỆN trong khối (kèm số hiển thị) — để chọn khi gán ý. */
export async function baiMoHinhLuyen(khoi: string): Promise<BaiMoHinhLuyen[]> {
  const { data, error } = await supabase.rpc('fn_hl_bai_mo_hinh_luyen', { p_khoi: khoi })
  if (error) throw error
  return (data ?? []) as BaiMoHinhLuyen[]
}
/** Gán ý vào bài mô hình (null = gỡ). DB chỉ nhận bài của mô hình luyện. */
export async function ganYVaoBai(yId: string, baiToanId: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_gan_y', { p_y: yId, p_baitoan: baiToanId })
  if (error) throw error
}
/** Duyệt (hoặc bỏ duyệt) MỌI ý của một bài kho trong 1 lần ghi + ghi vết người duyệt trên bài (mig 202610141115). */
export async function duyetBaiKho(baiId: string, duyet: boolean): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_duyet_bai', { p_bai: baiId, p_duyet: duyet })
  if (error) throw error
}

// ══════════════════ GÁN BÀI KHO → MÔ HÌNH (mig 202610141237) ══════════════════
export type MoHinhLuyen = { id: string; ma: string; ten: string; chu_de_id: string | null; so_bai: number }
/** Mô hình LUYỆN gốc của một khối (kèm số bài cả cây) — để gán bài kho, kể cả mô hình chưa có bài. */
export async function moHinhLuyenCuaKhoi(khoi: string): Promise<MoHinhLuyen[]> {
  const { data, error } = await supabase.rpc('fn_hl_mo_hinh_luyen', { p_khoi: khoi })
  if (error) throw error
  return ((data ?? []) as (MoHinhLuyen & { so_bai: number | string })[]).map((r) => ({ ...r, so_bai: Number(r.so_bai) }))
}
/** Gán (null = gỡ) bài kho vào một mô hình luyện. */
export async function ganBaiVaoMoHinh(baiId: string, moHinhId: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_gan_bai_mo_hinh', { p_bai: baiId, p_mo_hinh: moHinhId })
  if (error) throw error
}

// ── Kho (các CHUỖI) của một mô hình luyện — CEO 14/10 "kho là các chuỗi bài, mỗi chuỗi 1 dòng" ──
export type YChuoi = {
  id: string; ma_y: string; nhan: string | null; noi_dung: string; dap_an: string | null; loi_giai: string | null
  anh_de: string | null; da_duyet: boolean; baitoan_id: string | null; so: string | null; ma_bai_mh: string | null; ngoai_mo_hinh: boolean
}
export type ChuoiKho = {
  id: string; ma_bai: string; nguon: string | null; nguon_ma_cau: string | null; de_bai: string | null
  gia_thiet_chung: string | null; anh_de: string | null; gan_ca_bai: boolean; y: YChuoi[]
}
/** Bài kho thuộc mô hình: gán cả bài vào mô hình, hoặc có ý gán vào một bài của cây. */
export async function khoCuaMoHinh(moHinhId: string): Promise<ChuoiKho[]> {
  const { data, error } = await supabase.rpc('fn_hl_kho_cua_mo_hinh', { p_mo_hinh: moHinhId, p_gioi_han: 200 })
  if (error) throw error
  return (data ?? []) as ChuoiKho[]
}
export type DemKho = { so_chuoi: number; so_y: number; so_y_da_gan: number }
export async function demKhoMoHinh(khoi: string): Promise<Map<string, DemKho>> {
  const { data, error } = await supabase.rpc('fn_hl_dem_kho_mo_hinh', { p_khoi: khoi })
  if (error) throw error
  return new Map(((data ?? []) as { mo_hinh_id: string; so_chuoi: number | string; so_y: number | string; so_y_da_gan: number | string }[])
    .map((r) => [r.mo_hinh_id, { so_chuoi: Number(r.so_chuoi), so_y: Number(r.so_y), so_y_da_gan: Number(r.so_y_da_gan) }]))
}

// ── NHÓM MÔ HÌNH (mig 202610181651, Thùy 18/10): Chủ đề → Nhóm mô hình → Mô hình. Nhóm chỉ GOM (không kế thừa, không đo riêng).
export type NhomMoHinh = { id: string; chu_de_id: string; ten: string; mo_ta: string; thu_tu: number }
export async function nhomMoHinhCuaChuDe(chuDeId: string): Promise<NhomMoHinh[]> {
  const { data, error } = await supabase.from('hinh_nhom_mo_hinh').select('id, chu_de_id, ten, mo_ta, thu_tu').eq('chu_de_id', chuDeId).order('thu_tu').limit(500)
  if (error) throw error
  return (data ?? []) as NhomMoHinh[]
}
export async function themNhomMoHinh(chuDeId: string, ten: string, moTa = ''): Promise<NhomMoHinh> {
  const { data, error } = await supabase.from('hinh_nhom_mo_hinh').insert({ chu_de_id: chuDeId, ten: ten.trim(), mo_ta: moTa.trim() })
    .select('id, chu_de_id, ten, mo_ta, thu_tu').single()
  if (error) throw error
  return data as NhomMoHinh
}
export async function suaNhomMoHinh(id: string, v: { ten: string; mo_ta: string }): Promise<void> {
  const { error } = await supabase.from('hinh_nhom_mo_hinh').update({ ten: v.ten.trim(), mo_ta: v.mo_ta.trim(), updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function sapNhomMoHinh(ids: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_nhom_mh_sap', { p_ids: ids })
  if (error) throw error
}
/** Chỉ xoá được nhóm RỖNG (DB chặn nhóm còn mô hình). */
export async function xoaNhomMoHinh(id: string): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_nhom_mh_xoa', { p_id: id })
  if (error) throw error
}
/** Tạo mô hình luyện ngay trong nhóm (khối + chủ đề theo nhóm), 1 transaction. */
export async function taoMoHinhTrongNhom(nhomId: string, ten: string, giaThiet: string, anh: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('fn_hl_tao_mo_hinh_trong_nhom', { p_nhom: nhomId, p_ten: ten, p_gia_thiet: giaThiet, p_anh: anh })
  if (error) throw error
  return data as string
}
/** Chuyển mô hình sang nhóm khác (DB tự khớp chủ đề theo nhóm). */
export async function doiNhomMoHinh(moHinhId: string, nhomId: string): Promise<void> {
  const { error } = await supabase.from('hinh_mo_hinh').update({ nhom_mh_id: nhomId, updated_at: new Date().toISOString() }).eq('id', moHinhId)
  if (error) throw error
}

// ── NHÃN DẠNG BÀI / BỔ ĐỀ cho từng Ý (mig 202610191644, Thùy 19/10) — để lọc + làm tài liệu, không đo.
// Luật khối ở DB: nhãn.khoi ≤ khối của bài. Claude gợi ý (hinh_y_nhan_de_xuat) → người nhận/bác.
export type LoaiNhanY = 'dang' | 'bo_de'
export type NhanY = { y_id: string; loai: LoaiNhanY; nhan_id: string; nguon: 'nguoi' | 'ai' }
export type DeXuatNhanY = { id: number; y_id: string; loai: LoaiNhanY; nhan_id: string; ly_do: string }
export async function nhanCuaCacY(yIds: string[]): Promise<{ nhan: NhanY[]; deXuat: DeXuatNhanY[] }> {
  const nhan: NhanY[] = [], deXuat: DeXuatNhanY[] = []
  for (let i = 0; i < yIds.length; i += 100) {
    const lo = yIds.slice(i, i + 100)
    const [a, b, d] = await Promise.all([
      supabase.from('hinh_y_dang').select('y_id, dang_id, nguon').in('y_id', lo).limit(5000),
      supabase.from('hinh_y_bo_de').select('y_id, bo_de_id, nguon').in('y_id', lo).limit(5000),
      supabase.from('hinh_y_nhan_de_xuat').select('id, y_id, loai, nhan_id, ly_do').in('y_id', lo).limit(5000),
    ])
    if (a.error) throw a.error; if (b.error) throw b.error; if (d.error) throw d.error
    for (const r of a.data ?? []) nhan.push({ y_id: r.y_id, loai: 'dang', nhan_id: r.dang_id, nguon: r.nguon })
    for (const r of b.data ?? []) nhan.push({ y_id: r.y_id, loai: 'bo_de', nhan_id: r.bo_de_id, nguon: r.nguon })
    deXuat.push(...((d.data ?? []) as DeXuatNhanY[]))
  }
  return { nhan, deXuat }
}
export async function datNhanY(yId: string, loai: LoaiNhanY, nhanId: string, bat: boolean): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_y_nhan_dat', { p_y: yId, p_loai: loai, p_nhan: nhanId, p_bat: bat })
  if (error) throw error
}
export async function quyetDeXuatNhanY(id: number, nhan: boolean, lyDo = ''): Promise<void> {
  const { error } = await supabase.rpc('fn_hl_y_nhan_quyet', { p_de_xuat: id, p_nhan: nhan, p_ly_do: lyDo })
  if (error) throw error
}
