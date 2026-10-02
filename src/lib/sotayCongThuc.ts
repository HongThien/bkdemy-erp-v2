// ============================================================================
// sotayCongThuc.ts — SỔ TAY CÔNG THỨC (CEO 03/10, spec-so-tay-cong-thuc.md).
//
// Hai phía:
//   · STAFF (màn ERP "Sổ tay", lá `sotay`): CRUD dòng đơn thẳng bảng — RLS `co_chuc_nang/co_quyen_ghi('sotay')`.
//     Mọi luật trạng thái nằm ở TRIGGER DB (mig 202610030214): sửa nội dung thẻ đã duyệt ⇒ tự về chờ duyệt;
//     đổi trạng thái ⇒ tự đóng dấu người xét; mọi thay đổi ⇒ tự ghi nhật ký. Client KHÔNG tự set các cột đó.
//   · HS (app học sinh): chỉ RPC `hs_sotay_tim_ct` (security definer, chỉ thẻ đã duyệt).
// ============================================================================
import { supabase } from './supabase'

export type CtTrangThai = 'cho_duyet' | 'da_duyet' | 'tra_ve'
export const CT_TRANG_THAI: Record<CtTrangThai, { ten: string; cls: string }> = {
  cho_duyet: { ten: 'Chờ duyệt', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  da_duyet: { ten: 'Đã duyệt', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  tra_ve: { ten: 'Trả về', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

export type CtChuDe = { mon: string; khoi: string; ma: string; ten: string; thu_tu: number }
export type CtHinh = { mon: string; khoi: string; ma: string; ten: string; mo_ta: string; url: string | null; cap_nhat_at: string }
export type CtThe = {
  ma: string; mon: string; khoi: string; chu_de: string; thu_tu: number
  ten: string; ten_khac: string[]; noi_dung: string; luu_y: string | null; cau_nho: string | null
  hinh: string | null; nguon: string[]; ct2018: 'co' | 'nghi_van'; ghi_chu_kiem: string | null
  trang_thai: CtTrangThai; ly_do_tra_ve: string | null
  xet_boi: string | null; xet_at: string | null; xoa_at: string | null
  cap_nhat_at: string; cap_nhat_boi: string | null
  xet: { ho_ten: string } | null
}
// Trường người soạn được sửa. Trạng thái/người xét/thời gian do trigger lo — không nằm đây.
export type CtSua = Pick<CtThe, 'ten' | 'ten_khac' | 'noi_dung' | 'luu_y' | 'cau_nho' | 'hinh' | 'chu_de' | 'ct2018' | 'ghi_chu_kiem' | 'nguon'>
export type CtLichSu = {
  id: number; ma_the: string; hanh_dong: string; trang_thai_cu: string | null; trang_thai_moi: string
  ban_cu: Record<string, unknown> | null; ly_do: string | null; actor: string | null; at: string
}
export const HANH_DONG_TEN: Record<string, string> = {
  tao: 'Tạo', sua: 'Sửa', duyet: 'Duyệt', tra_ve: 'Trả về', bo_duyet: 'Bỏ duyệt', xoa: 'Xoá', khoi_phuc: 'Khôi phục',
}

const COT_THE = 'ma,mon,khoi,chu_de,thu_tu,ten,ten_khac,noi_dung,luu_y,cau_nho,hinh,nguon,ct2018,ghi_chu_kiem,trang_thai,ly_do_tra_ve,xet_boi,xet_at,xoa_at,cap_nhat_at,cap_nhat_boi,xet:nhan_su!sotay_cong_thuc_xet_boi_fkey(ho_ten)'

export type CtBo = { chuDe: CtChuDe[]; hinh: CtHinh[]; the: CtThe[] }
// Cả bộ của 1 (môn, khối): vài chục–vài trăm dòng ⇒ tải 1 lần, lọc tại chỗ theo lựa chọn UI.
export async function taiBo(mon: string, khoi: string): Promise<CtBo> {
  const [cd, h, t] = await Promise.all([
    supabase.from('sotay_ct_chu_de').select('*').eq('mon', mon).eq('khoi', khoi).order('thu_tu').limit(200),
    supabase.from('sotay_ct_hinh').select('mon,khoi,ma,ten,mo_ta,url,cap_nhat_at').eq('mon', mon).eq('khoi', khoi).order('ma').limit(1000),
    supabase.from('sotay_cong_thuc').select(COT_THE).eq('mon', mon).eq('khoi', khoi).order('chu_de').order('thu_tu').limit(2000),
  ])
  for (const r of [cd, h, t]) if (r.error) throw r.error
  return { chuDe: (cd.data ?? []) as CtChuDe[], hinh: (h.data ?? []) as CtHinh[], the: (t.data ?? []) as unknown as CtThe[] }
}

// Mỗi lệnh ghi TRẢ VỀ dòng sau khi DB (trigger) xử lý ⇒ màn vá đúng dòng đó tại chỗ (CLAUDE §2: không quét lại cả danh sách).
async function ghi(ma: string, patch: Record<string, unknown>): Promise<CtThe> {
  const { data, error } = await supabase.from('sotay_cong_thuc').update(patch).eq('ma', ma).select(COT_THE).single()
  if (error) throw error
  return data as unknown as CtThe
}
export const luuThe = (ma: string, sua: CtSua) => ghi(ma, sua)
export const duyetThe = (ma: string) => ghi(ma, { trang_thai: 'da_duyet' })
export const traVeThe = (ma: string, lyDo: string) => ghi(ma, { trang_thai: 'tra_ve', ly_do_tra_ve: lyDo })
export const boDuyetThe = (ma: string) => ghi(ma, { trang_thai: 'cho_duyet' })
// Kho rác. toISOString() ở đây là một INSTANT (timestamptz) — luật cấm toISOString chỉ áp cho NGÀY local.
export const xoaThe = (ma: string) => ghi(ma, { xoa_at: new Date().toISOString() })
export const khoiPhucThe = (ma: string) => ghi(ma, { xoa_at: null })

export async function themThe(mon: string, khoi: string, chuDe: string, ten: string, noiDung: string): Promise<CtThe> {
  // `ma` để trống ⇒ trigger cấp CT<khối>-<chủ đề>-<nn> và thứ tự cuối chủ đề.
  const { data, error } = await supabase.from('sotay_cong_thuc')
    .insert({ ma: null, mon, khoi, chu_de: chuDe, ten, noi_dung: noiDung, nguon: ['BK'] })
    .select(COT_THE).single()
  if (error) throw error
  return data as unknown as CtThe
}

export async function datAnhHinh(h: Pick<CtHinh, 'mon' | 'khoi' | 'ma'>, url: string | null): Promise<CtHinh> {
  const { data, error } = await supabase.from('sotay_ct_hinh').update({ url })
    .eq('mon', h.mon).eq('khoi', h.khoi).eq('ma', h.ma).select('mon,khoi,ma,ten,mo_ta,url,cap_nhat_at').single()
  if (error) throw error
  return data as CtHinh
}
export async function themHinh(mon: string, khoi: string, ma: string, ten: string, moTa: string): Promise<CtHinh> {
  const { data, error } = await supabase.from('sotay_ct_hinh').insert({ mon, khoi, ma, ten, mo_ta: moTa })
    .select('mon,khoi,ma,ten,mo_ta,url,cap_nhat_at').single()
  if (error) throw error
  return data as CtHinh
}

export async function lichSu(ma: string): Promise<{ dong: CtLichSu[]; ten: Record<string, string> }> {
  const { data, error } = await supabase.from('sotay_ct_lich_su').select('*').eq('ma_the', ma).order('at', { ascending: false }).limit(100)
  if (error) throw error
  const dong = (data ?? []) as CtLichSu[]
  const ids = [...new Set(dong.map((d) => d.actor).filter((x): x is string => !!x))]
  const ten: Record<string, string> = {}
  if (ids.length) {
    const { data: ns } = await supabase.from('nhan_su').select('id,ho_ten').in('id', ids).limit(100)
    for (const n of (ns ?? []) as { id: string; ho_ten: string }[]) ten[n.id] = n.ho_ten
  }
  return { dong, ten }
}

// ── HS ─────────────────────────────────────────────────────────────────────
export type CtTimRow = {
  ma: string; ten: string; khoi: string; ten_chu_de: string
  noi_dung: string; luu_y: string | null; cau_nho: string | null; hinh_url: string | null
}
export async function soTayTimCt(tuKhoa: string, mon: string, khoi: string | null): Promise<CtTimRow[]> {
  const { data, error } = await supabase.rpc('hs_sotay_tim_ct', { p_tu_khoa: tuKhoa, p_mon: mon, p_khoi: khoi, p_limit: 20 })
  if (error) throw error
  return (data as CtTimRow[] | null) ?? []
}
