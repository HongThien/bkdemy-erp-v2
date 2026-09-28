// Thế giới BK — mạng xã hội KHOE nội bộ của HS (spec-the-gioi-bk.md · mig 202609290108). Chỉ gọi hàm Postgres:
// tin SUY từ sự kiện thật ở DB (_the_gioi_tin), lọc kênh/quyền/riêng tư ở DB — client chỉ vẽ.
import { supabase } from './supabase'

export type KenhId = 'tg' | 'ban' | 'lop'
export type NguoiTG = { an: boolean; id?: string; ten?: string; lop?: string; anh?: string; ma?: string }
export type KhenTG = {
  dem: { icon: string; ma: string; so: number }[]
  tong: number
  cau: { cau: string; nguoi: NguoiTG; la_em: boolean }[]
  cua_toi: { icon: string; icon_ma: string; cau: string; cau_ma: string } | null
  thay_co: string[]
}
export type TinTG = {
  khoa: string
  tang: 'S' | 'A' | 'B'
  nhom: 'hoc' | 'game' | 'mayman' | 'noluc'
  kieu: 'nhat_buoi' | 'game_nhat' | 'doi_thang' | 'tra_sua' | 'huy_hieu' | 'giai_thang' | 'no_luc' | string
  mon: string
  at: string
  lop: string | null
  chi_tiet: Record<string, unknown>
  ghim?: boolean
  nguoi: NguoiTG | null
  doi: { so: number; thanh_vien?: NguoiTG[] } | null
  cua_toi: boolean
  la_ban: boolean
  da_an?: boolean
  khen: KhenTG
}
export type GopTG = { kieu: string; so: number; ds: TinTG[] }
export type KenhTG = { toi: { hien: 'ten' | 'ma'; so_ban: number; loi_moi: number }; tin: TinTG[]; gop: GopTG[] }
export type LoiMoiTG = { id: string; nguoi: NguoiTG; ban_chung: number }
export type BanBeTG = { ban: NguoiTG[]; loi_moi: LoiMoiTG[]; da_gui: string[] }
export type GoiYTG = { id: string; nguoi: NguoiTG; ly_do: string | null; trang_thai: 'da_gui' | 'cho_em' | null }
export type DanhMucTG = { ma: string; loai: 'icon' | 'cau'; noi_dung: string; nhom: string[]; thu_tu: number }

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

export const layKenh = (k: KenhId) => rpc<KenhTG>('fn_the_gioi_kenh', { p_kenh: k })
export const guiKhen = (khoa: string, icon: string, cau: string) => rpc<KhenTG>('fn_the_gioi_khen', { p_khoa: khoa, p_icon: icon, p_cau: cau })
export const anTin = (khoa: string, an: boolean) => rpc<void>('fn_the_gioi_an_tin', { p_khoa: khoa, p_an: an })
export const datHien = (hien: 'ten' | 'ma') => rpc<void>('fn_the_gioi_cai_dat', { p_hien: hien })
export const banBeCuaToi = () => rpc<BanBeTG>('fn_ban_be_cua_toi')
export const goiYKetBan = (tim: string) => rpc<GoiYTG[]>('fn_ban_be_goi_y', { p_tim: tim })
export const guiKetBan = (hs: string) => rpc<'da_gui' | 'da_la_ban'>('fn_ban_be_gui', { p_hs: hs })
export const traLoiKetBan = (loiMoi: string, dongY: boolean) => rpc<void>('fn_ban_be_tra_loi', { p_loi_moi: loiMoi, p_dong_y: dongY })

// Danh mục icon + câu (admin sửa ở DB theo trend — câu đã ẩn không cho chọn mới).
export async function layDanhMuc(): Promise<DanhMucTG[]> {
  const { data, error } = await supabase.from('the_gioi_danh_muc').select('ma, loai, noi_dung, nhom, thu_tu').is('an_at', null).order('thu_tu').limit(200)
  if (error) throw error
  return (data ?? []) as DanhMucTG[]
}
