// Thế giới BK — mạng xã hội KHOE nội bộ của HS (spec-the-gioi-bk.md · mig 202609290108). Chỉ gọi hàm Postgres:
// tin SUY từ sự kiện thật ở DB (_the_gioi_tin), lọc kênh/quyền/riêng tư ở DB — client chỉ vẽ.
import { supabase } from './supabase'

export type KenhId = 'tg' | 'ban' | 'lop'
export type NguoiTG = { an: boolean; id?: string; ten?: string; lop?: string; anh?: string; ma?: string }
// Tương tác kiểu FACEBOOK (mig 202609290148): ① thả cảm xúc (1 / em / tin) · ② bình luận = câu soạn sẵn hoặc sticker.
export type BinhLuanTG = { id: string; at: string; loai: 'cau' | 'sticker'; ma: string; noi_dung: string; nguoi: NguoiTG; la_em: boolean; an: boolean }
export type KhenTG = {
  dem: { icon: string; ma: string; nhan: string; so: number }[]
  tong: number
  ten: { la_em: boolean; nguoi: NguoiTG }[]            // 2 người đứng đầu (em → bạn bè → mới nhất)
  cua_toi: { icon: string; icon_ma: string; nhan: string } | null
  so_bl: number
  bl: BinhLuanTG | null                                 // 1 bình luận xem trước dưới thẻ
  thay_co: string[]
}
export type ThaTG = { icon: string; icon_ma: string; nhan: string; la_em: boolean; la_ban: boolean; nguoi: NguoiTG }
export type ChiTietTG = { chu_tin: boolean; tha: ThaTG[]; bl: BinhLuanTG[]; khen: KhenTG }
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
  khoe?: { dang_at: string; cau: string | null; la_em: boolean } | null // có ⇒ tin này lên kênh vì HS BẤM KHOE (mig 202609291239)
}
export type GopTG = { kieu: string; so: number; so_bl?: number; ds: TinTG[] }
export type KenhTG = { toi: { hien: 'ten' | 'ma'; so_ban: number; loi_moi: number }; tin: TinTG[]; gop: GopTG[] }
export type LoiMoiTG = { id: string; nguoi: NguoiTG; ban_chung: number }
export type BanBeTG = { ban: NguoiTG[]; loi_moi: LoiMoiTG[]; da_gui: string[] }
export type GoiYTG = { id: string; nguoi: NguoiTG; ly_do: string | null; trang_thai: 'da_gui' | 'cho_em' | null }
export type DanhMucTG = { ma: string; loai: 'icon' | 'cau' | 'sticker'; noi_dung: string; nhan?: string | null; nhom: string[]; thu_tu: number }

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

// Rank tạm khoá (Thùy 06/10): tin "lên bậc" (kieu='len_bac') do DB vẫn sinh — lọc ở đây để học sinh không thấy Rank qua Thế giới BK.
const RANK_BAT = () => { try { return localStorage.getItem('hs_rank') === '1' } catch { return false } }
const bo = (t: TinTG) => t.kieu === 'len_bac' && !RANK_BAT()
const locKenh = (k: KenhTG): KenhTG => (RANK_BAT() ? k : { ...k, tin: k.tin.filter((t) => !bo(t)), gop: k.gop.map((g) => ({ ...g, ds: g.ds.filter((t) => !bo(t)) })).filter((g) => g.kieu !== 'len_bac' && g.ds.length > 0) })
export const layKenh = (k: KenhId) => rpc<KenhTG>('fn_the_gioi_kenh', { p_kenh: k }).then(locKenh)
export const thaCamXuc = (khoa: string, icon: string | null) => rpc<KhenTG>('fn_the_gioi_tha', { p_khoa: khoa, p_icon: icon })   // null = bỏ thả
export const guiBinhLuan = (khoa: string, ma: string) => rpc<{ bl: BinhLuanTG; khen: KhenTG }>('fn_the_gioi_binh_luan', { p_khoa: khoa, p_ma: ma })
export const goBinhLuan = (id: string) => rpc<KhenTG>('fn_the_gioi_go_binh_luan', { p_id: id })
export const anBinhLuan = (id: string, an: boolean) => rpc<KhenTG>('fn_the_gioi_an_binh_luan', { p_id: id, p_an: an })
export const layChiTiet = (khoa: string) => rpc<ChiTietTG>('fn_the_gioi_chi_tiet', { p_khoa: khoa })
export const anTin = (khoa: string, an: boolean) => rpc<void>('fn_the_gioi_an_tin', { p_khoa: khoa, p_an: an })
export const datHien = (hien: 'ten' | 'ma') => rpc<void>('fn_the_gioi_cai_dat', { p_hien: hien })
export const banBeCuaToi = () => rpc<BanBeTG>('fn_ban_be_cua_toi')
export const goiYKetBan = (tim: string) => rpc<GoiYTG[]>('fn_ban_be_goi_y', { p_tim: tim })
export const guiKetBan = (hs: string) => rpc<'da_gui' | 'da_la_ban'>('fn_ban_be_gui', { p_hs: hs })
export const traLoiKetBan = (loiMoi: string, dongY: boolean) => rpc<void>('fn_ban_be_tra_loi', { p_loi_moi: loiMoi, p_dong_y: dongY })

// Danh mục cảm xúc + câu + sticker (admin sửa ở DB theo trend — mục đã ẩn không cho chọn mới).
export async function layDanhMuc(): Promise<DanhMucTG[]> {
  const { data, error } = await supabase.from('the_gioi_danh_muc').select('ma, loai, noi_dung, nhan, nhom, thu_tu').is('an_at', null).order('thu_tu').limit(200)
  if (error) throw error
  return (data ?? []) as DanhMucTG[]
}

// Thẻ Thế giới BK trên MÀN CHÍNH (thay thẻ "Việc cần làm" — Thùy 29/09): tương tác mới 24h trên tin của em · lời mời · ≤2 tin nổi bật.
// ĐĂNG BÀI KHOE (Thùy 29/09 — tính năng chính): thành tích đạt trong 3 ngày, chưa khoe · tối đa 3 bài / em / ngày.
export type ThanhTichKhoe = Pick<TinTG, 'khoa' | 'tang' | 'nhom' | 'kieu' | 'mon' | 'at' | 'chi_tiet' | 'lop'>
export type ChoKhoe = { gioi_han: number; da_khoe_hom_nay: number; tin: ThanhTichKhoe[] }
export const layChoKhoe = () => rpc<ChoKhoe | null>('fn_the_gioi_cho_khoe').then((c) => (c ? { ...c, tin: c.tin.filter((t) => !bo(t as TinTG)) } : c))
export const dangKhoe = (khoa: string, cau: string | null) => rpc<{ gioi_han: number; da_khoe_hom_nay: number }>('fn_the_gioi_khoe', { p_khoa: khoa, p_cau: cau })
export const goKhoe = (khoa: string) => rpc<void>('fn_the_gioi_go_khoe', { p_khoa: khoa })

export type TheGioiHome = { tuong_tac: { so: number; so_nguoi: number; nguoi: NguoiTG | null }; loi_moi: number; tin: TinTG[]; cho_khoe?: ChoKhoe | null }
export const theGioiHome = () => rpc<TheGioiHome | null>('fn_the_gioi_home').then((h) => (h ? { ...h, tin: h.tin.filter((t) => !bo(t)) } : h))
