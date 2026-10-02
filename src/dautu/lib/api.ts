// Gọi các hàm fn_dtv_* (mọi tính toán ở Postgres). Lỗi mạng ⇒ trả null, game vẫn chơi được.
import { sb, coMang } from './sb'
import { datDB, khoHoSo, type HoSoDB, type NvId } from './hoSo'

async function goi<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  if (!coMang) return null
  const { data, error } = await sb.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

export async function luuHoSo(ten: string, nv: NvId) {
  const db = await goi<HoSoDB>('fn_dtv_ho_so_luu', { p_uid: khoHoSo.lay().uid, p_ten: ten, p_nv: nv })
  if (db) datDB(db)
  return db
}

export async function taiHoSo() {
  try {
    const db = await goi<HoSoDB | null>('fn_dtv_ho_so', { p_uid: khoHoSo.lay().uid })
    if (db) datDB(db)
    return db
  } catch { return null }
}

export type CheDo = 'bot' | 'doi' | 'mang' | 'giai' | 'on_tap' | 'noi_tu'
export interface KetQuaGhi { ho_so: HoSoDB; xp_nhan: number; len_cap: boolean }

export async function ghiTran(a: {
  mon: string; cheDo: CheDo; chuDe: string; ketQua: 'thang' | 'thua' | 'hoa' | 'xong'; soDung: number; soCau: number; diem: number; doiThu?: string
}): Promise<KetQuaGhi | null> {
  if (!khoHoSo.lay().db) return null
  try {
    const kq = await goi<KetQuaGhi>('fn_dtv_ghi_tran_mon', {
      p_uid: khoHoSo.lay().uid, p_mon: a.mon, p_che_do: a.cheDo, p_chu_de: a.chuDe, p_ket_qua: a.ketQua,
      p_so_dung: a.soDung, p_so_cau: a.soCau, p_diem: a.diem, p_doi_thu: a.doiThu ?? '',
    })
    if (kq?.ho_so) datDB(kq.ho_so)
    return kq
  } catch { return null }
}

export type TieuChi = 'xp' | 'chuoi_thang' | 'chuoi_ngay'
export interface DongBxh { hang: number; ma: string; ten: string; nv: NvId; cap: number; gt: number }
export async function bangXepHang(tc: TieuChi) {
  return goi<{ top: DongBxh[]; toi: { hang: number; gt: number } | null }>('fn_dtv_bxh', { p_tieu_chi: tc, p_uid: khoHoSo.lay().uid })
}

export async function gopTu(a: { en: string; vi: string; loai: string; vd: string; vdvi: string }) {
  return goi<{ con_lai_hom_nay: number }>('fn_dtv_gop_tu', {
    p_uid: khoHoSo.lay().uid, p_en: a.en, p_vi: a.vi, p_loai: a.loai, p_vd: a.vd, p_vdvi: a.vdvi,
  })
}

export async function tuDaGop() {
  return (await goi<{ en: string; vi: string; loai_tu: string; trang_thai: string; tao_at: string }[]>('fn_dtv_gop_tu_cua_toi', { p_uid: khoHoSo.lay().uid })) ?? []
}

export async function gopY(noiDung: string) {
  await goi('fn_dtv_gop_y', { p_uid: khoHoSo.lay().uid, p_noi_dung: noiDung })
}
