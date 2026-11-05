// BÁO CÁO HỌC KÌ gửi phụ huynh (spec-bao-cao-ky.md, Thùy chốt 04/11) — data-layer.
// Mọi con số tính ở DB (fn_bc_ky_tinh — mig 202611041652); đã công bố thì đọc SNAPSHOT (fn_bc_ky_xem), không tính lại.
// Client chỉ: list kì, CRUD dòng nhập (điểm dự đoán · sai số · nhận xét), gọi RPC công bố / mở lại.
import { supabase } from './supabase'

export type KyHoc = { id: string; ten: string; tu_thang: string; den_thang: string }

// n = số LẦN đánh giá (luật mới 04/11: đếm theo lần, 60 ngày); hang/tong = hạng % trong khối × môn (em có lần đánh giá ở đơn vị đó)
export type BcKyDonVi = { ma: string; ten: string; p: number | null; n: number; n_toi_da: number; muc?: 'co_ban' | 'nang_cao' | null; hang?: number | null; tong?: number | null }
export type BcKyChuDe = BcKyDonVi & { chuyen_de: BcKyDonVi[] }
export type BcKyLanThi = { loai: 'mt_sat_hach' | 'khao_sat_thang'; nhan: string; thang: string; ngay: string; diem: number; tb: number; chenh: number; n_mau: number; hang: number }
// Khuôn jsonb của fn_bc_ky_tinh (phiên bản 2, mig 202611041727 — 5 phần) = cũng là snapshot lúc công bố (tự đủ để dựng app PH / PDF).
export type BcKyData = {
  phien_ban: number; tinh_luc: string; cong_bo_at?: string
  so_lieu_chot_at?: string   // có ⇒ số liệu đọc bản CHỐT (mig 202611051704), không tính lại
  hs: { id: string; ho_ten: string; ma_hs: string | null }
  lop: { id: string | null; ten: string | null; khoi: string | null }
  mon: string; gv: string | null
  ky: KyHoc
  danh_gia: { tu: string; den: string; n_chu_de: number; n_chuyen_de: number; chu_de: BcKyChuDe[] }
  thi: BcKyLanThi[]
  hang_ky: { hang: number; tong: number; hang_tb: number; diem_tb: number; so_lan: number } | null
  thai_do: {
    chuyen_can: { vang: number; vang_phep: number; co_mat: number; tong: number } | null
    // nhóm KHÔNG TRÙNG (cộng = tong): dat_chuan · dung_han_chua_nt · nop_muon · khong_lam · xin_phep · chua_ghi; khong_nghiem_tuc/chong_doi đếm chồng (ghi chú)
    btvn: { tong: number; dat_chuan: number; dung_han_chua_nt: number; chua_ghi: number; khong_lam: number; nop_muon: number; xin_phep: number; khong_nghiem_tuc: number; chong_doi: number } | null
  }
  nang_luc: { diem: number | null; sai_so: number | null }
  nhan_xet: string | null          // ô "nhận xét thêm" (không bắt buộc)
  ke_hoach: string | null          // ô "viết thêm" của kế hoạch
  // phiên bản 3 (mig 202611051600 — thang nhận xét, Thùy 05/11); snapshot cũ không có ⇒ undefined
  nhan_xet_chon?: BcKyNxTo[]
  ke_hoach_chon?: string[]
  goi_y?: BcKyGoiY
  phu_luc: { cot: { nhan: string; ngay: string }[]; hs: { ten: string; lop: string | null; la_em: boolean; diem: (number | null)[]; hang_tb: number; hang: number }[] }
}
export type MucDo = 'tot' | 'on' | 'chua_tot'
export type MucDoChon = MucDo | 'chua_du'
// them = nhận xét thêm của GV cho riêng mục to này (Thùy 05/11, mig 202611051853)
export type BcKyNxTo = { ma: string; ten: string; them?: string | null; con: { ma: string; ten: string; muc_do: MucDoChon; noi_dung: string | null }[] }
export type BcKyGoiYMuc = { muc_do: MucDo | null; khoa: string | null; so: Record<string, number | boolean | null> }
export type BcKyGoiY = { du_doan: number | null; sai_so: number | null; so_lan: number; muc: Record<string, BcKyGoiYMuc> }
export type NxChon = Record<string, { muc_do: MucDoChon; lc: string | null }>
export type BcKyXem = { cong_bo_at: string | null; du_lieu: BcKyData }
export type BcKyNhap = { diem_du_doan: number | null; sai_so: number | null; nhan_xet: string | null; ke_hoach: string | null; nx_chon: NxChon; kh_chon: string[]; nx_them: Record<string, string>; cong_bo_at: string | null }
export const BC_KY_NHAP_TRONG: BcKyNhap = { diem_du_doan: null, sai_so: null, nhan_xet: null, ke_hoach: null, nx_chon: {}, kh_chon: [], nx_them: {}, cong_bo_at: null }

export async function listKyHoc(): Promise<KyHoc[]> {
  const { data, error } = await supabase.from('ky_hoc').select('id, ten, tu_thang, den_thang').order('tu_thang', { ascending: false }).limit(50)
  if (error) throw error
  return (data ?? []) as KyHoc[]
}
// Chỉ admin hệ thống tạo được (RLS ky_hoc_them) — người khác nhận lỗi từ DB.
export async function themKyHoc(ten: string, tu_thang: string, den_thang: string): Promise<KyHoc> {
  const { data, error } = await supabase.from('ky_hoc').insert({ ten, tu_thang, den_thang }).select('id, ten, tu_thang, den_thang').single()
  if (error) throw error
  return data as KyHoc
}

export async function xemBcKy(hsId: string, mon: string, kyId: string): Promise<BcKyXem> {
  const { data, error } = await supabase.rpc('fn_bc_ky_xem', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as BcKyXem
}
export async function getBcKyNhap(hsId: string, mon: string, kyId: string): Promise<BcKyNhap> {
  const { data, error } = await supabase.from('bao_cao_ph_ky').select('diem_du_doan, sai_so, nhan_xet, ke_hoach, nx_chon, kh_chon, nx_them, cong_bo_at')
    .eq('hoc_sinh_id', hsId).eq('mon', mon).eq('ky_id', kyId).maybeSingle()
  if (error) throw error
  return (data as BcKyNhap) ?? { ...BC_KY_NHAP_TRONG }
}
export async function luuBcKyNhap(hsId: string, mon: string, kyId: string, patch: Partial<Pick<BcKyNhap, 'diem_du_doan' | 'sai_so' | 'nhan_xet' | 'ke_hoach' | 'nx_chon' | 'kh_chon' | 'nx_them'>>): Promise<void> {
  const { error } = await supabase.from('bao_cao_ph_ky').upsert({ hoc_sinh_id: hsId, mon, ky_id: kyId, ...patch }, { onConflict: 'hoc_sinh_id,mon,ky_id' })
  if (error) throw error
}
export async function congBoBcKy(hsId: string, mon: string, kyId: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_bc_ky_cong_bo', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as string
}
export async function moLaiBcKy(hsId: string, mon: string, kyId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_bc_ky_mo_lai', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
}
// Chốt số liệu 1 em (chỉ admin — DB chặn người khác). Đã chốt thì ghi đè, bản cũ vào log.
export async function chotSoLieuBcKy(hsId: string, mon: string, kyId: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_bc_ky_chot_hs', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as string
}
// Công bố cả lớp trong 1 transaction ở DB — chỉ em đã đủ điểm dự đoán + sai số + mọi mục nhận xét (_bc_ky_thieu).
export async function congBoLopBcKy(lopId: string, mon: string, kyId: string): Promise<{ cong_bo: number; bo_qua: number }> {
  const { data, error } = await supabase.rpc('fn_bc_ky_cong_bo_lop', { p_lop: lopId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as { cong_bo: number; bo_qua: number }
}
// Trạng thái cả lớp cho cột trái: đã công bố / đang nhập (có dòng) — không dòng = chưa nhập gì.
export async function listBcKyTrangThai(hsIds: string[], mon: string, kyId: string): Promise<Record<string, 'cong_bo' | 'nhap'>> {
  if (!hsIds.length) return {}
  const { data, error } = await supabase.from('bao_cao_ph_ky').select('hoc_sinh_id, cong_bo_at')
    .eq('mon', mon).eq('ky_id', kyId).in('hoc_sinh_id', hsIds).limit(500)
  if (error) throw error
  const out: Record<string, 'cong_bo' | 'nhap'> = {}
  for (const r of (data ?? []) as { hoc_sinh_id: string; cong_bo_at: string | null }[]) out[r.hoc_sinh_id] = r.cong_bo_at ? 'cong_bo' : 'nhap'
  return out
}

// ── THANG NHẬN XÉT (danh mục — Thùy sửa trên ERP; spec §D, mig 202611051600) ──
// Mã gốc do DB cấp; xoá = đặt xoa_at (kho rác — báo cáo lưu MÃ). Ghi chỉ admin (RLS); mọi người đọc.
export type NxMuc = { ma: string; cha: string | null; ten: string; thu_tu: number; goi_y: 'btvn' | 'can_than' | 'tien_bo_diem' | null; nguong_tot: number | null; nguong_chua_tot: number | null }
export type NxLuaChon = { ma: string; muc_ma: string; muc_do: MucDo; noi_dung: string; khoa_goi_y: string | null; thu_tu: number }
export type KhMau = { ma: string; muc_ma: string | null; noi_dung: string; thu_tu: number }
export type DanhMucNx = { muc: NxMuc[]; lc: NxLuaChon[]; kh: KhMau[] }
const COT_MUC = 'ma, cha, ten, thu_tu, goi_y, nguong_tot, nguong_chua_tot'
const COT_LC = 'ma, muc_ma, muc_do, noi_dung, khoa_goi_y, thu_tu'
const COT_KH = 'ma, muc_ma, noi_dung, thu_tu'
const so = <T extends { thu_tu: number; ma: string }>(a: T[]) => a.sort((x, y) => x.thu_tu - y.thu_tu || x.ma.localeCompare(y.ma))
export async function getDanhMucNx(): Promise<DanhMucNx> {
  const [m, l, k] = await Promise.all([
    supabase.from('bc_ky_nx_muc').select(COT_MUC).is('xoa_at', null).limit(500),
    supabase.from('bc_ky_nx_lua_chon').select(COT_LC).is('xoa_at', null).limit(2000),
    supabase.from('bc_ky_kh_mau').select(COT_KH).is('xoa_at', null).limit(1000),
  ])
  if (m.error) throw m.error; if (l.error) throw l.error; if (k.error) throw k.error
  const num = (v: unknown) => v == null ? null : Number(v)
  return {
    muc: so(((m.data ?? []) as NxMuc[]).map((x) => ({ ...x, nguong_tot: num(x.nguong_tot), nguong_chua_tot: num(x.nguong_chua_tot) }))),
    lc: so((l.data ?? []) as NxLuaChon[]),
    kh: so((k.data ?? []) as KhMau[]),
  }
}
export async function laAdminBcKy(): Promise<boolean> {
  const { data, error } = await supabase.rpc('_bc_ky_la_admin')
  if (error) return false
  return !!data
}
export async function themNxMuc(v: Pick<NxMuc, 'cha' | 'ten' | 'thu_tu'>): Promise<NxMuc> {
  const { data, error } = await supabase.from('bc_ky_nx_muc').insert(v).select(COT_MUC).single()
  if (error) throw error
  return data as NxMuc
}
export async function suaNxMuc(ma: string, patch: Partial<Pick<NxMuc, 'ten' | 'thu_tu' | 'nguong_tot' | 'nguong_chua_tot'>>): Promise<void> {
  const { error } = await supabase.from('bc_ky_nx_muc').update(patch).eq('ma', ma)
  if (error) throw error
}
export async function themNxLuaChon(v: Pick<NxLuaChon, 'muc_ma' | 'muc_do' | 'noi_dung' | 'thu_tu'>): Promise<NxLuaChon> {
  const { data, error } = await supabase.from('bc_ky_nx_lua_chon').insert(v).select(COT_LC).single()
  if (error) throw error
  return data as NxLuaChon
}
export async function suaNxLuaChon(ma: string, patch: Partial<Pick<NxLuaChon, 'noi_dung' | 'thu_tu'>>): Promise<void> {
  const { error } = await supabase.from('bc_ky_nx_lua_chon').update(patch).eq('ma', ma)
  if (error) throw error
}
export async function themKhMau(v: Pick<KhMau, 'muc_ma' | 'noi_dung' | 'thu_tu'>): Promise<KhMau> {
  const { data, error } = await supabase.from('bc_ky_kh_mau').insert(v).select(COT_KH).single()
  if (error) throw error
  return data as KhMau
}
export async function suaKhMau(ma: string, patch: Partial<Pick<KhMau, 'noi_dung' | 'thu_tu'>>): Promise<void> {
  const { error } = await supabase.from('bc_ky_kh_mau').update(patch).eq('ma', ma)
  if (error) throw error
}
// Xoá = đưa vào kho rác (không xoá cứng — báo cáo cũ trỏ bằng mã).
export async function boVaoKhoRac(bang: 'bc_ky_nx_muc' | 'bc_ky_nx_lua_chon' | 'bc_ky_kh_mau', ma: string): Promise<void> {
  const { error } = await supabase.from(bang).update({ xoa_at: new Date().toISOString() }).eq('ma', ma)
  if (error) throw error
}
