// Hệ thống SỰ KIỆN (spec-su-kien.md, Trung thu 26/09). Mọi phép tính ở Postgres (`fn_sk_*`,
// mig 202609260129) — file này CHỈ gọi RPC + nghe realtime. Xu sự kiện là tiền RIÊNG, không phải ví BK.
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

export type SuKien = {
  id: string; ten: string; ngay: string; trang_thai: 'mo' | 'dong'
  cau_hinh: { vong_quay: { xu: number; ti_le: number }[]; toi_da_luot?: number; so_van?: number }
}
export type NguoiHang = { dang_ky_id: string; ten: string; so: number; la_khach: boolean; so_lan_bo_qua: number }
export type NguoiLuot = { dang_ky_id: string; slot: number; ten: string; so: number }
export type PhongTQ = {
  id: string; ten: string; hang_doi: boolean; ma_hub: string | null
  luot: { id: string; game: string; bat_dau_at: string; nguoi: NguoiLuot[] } | null
  co_mat: NguoiHang[]; cho: NguoiHang[]; so_luot_xong: number
}
export type TongQuan = {
  su_kien: SuKien; tong_nguoi: number; tong_khach: number; tong_checkin: number; tong_quay: number
  xu_phat: number; xu_doi: number; phong: PhongTQ[]
}
export type KetQuaTim = {
  nguoi_choi_id: string | null; hoc_sinh_id: string | null; ten: string; so: number | null; lop: string | null
  la_khach: boolean; da_checkin: boolean; xu_quay: number | null; so_du: number
  dang_ky_id: string | null; dang_ky_trang_thai: string | null; phong_ten: string | null
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

export async function listSuKien(): Promise<SuKien[]> {
  const { data, error } = await supabase.from('sk_su_kien').select('*').order('ngay', { ascending: false }).limit(50)
  if (error) throw new Error(error.message)
  return (data ?? []) as SuKien[]
}

export const tongQuan = (suKien: string) => rpc<TongQuan>('fn_sk_tong_quan', { p_su_kien: suKien })
export const tim = (suKien: string, q: string) => rpc<KetQuaTim[]>('fn_sk_tim', { p_su_kien: suKien, p_q: q })
export const nguoiChoiBK = (suKien: string, hs: string) => rpc<string>('fn_sk_nguoi_choi_bk', { p_su_kien: suKien, p_hoc_sinh: hs })
export const checkin = (suKien: string, hs: string) => rpc<string>('fn_sk_checkin', { p_su_kien: suKien, p_hoc_sinh: hs })
export const themKhach = async (suKien: string, ten: string) => (await rpc<{ id: string; so: number }[]>('fn_sk_them_khach', { p_su_kien: suKien, p_ten: ten }))[0]
export const quay = (nguoi: string) => rpc<{ xu: number; da_quay: boolean }>('fn_sk_quay', { p_nguoi: nguoi })
export const dangKy = (phong: string, nguoi: string) => rpc<string>('fn_sk_dang_ky', { p_phong: phong, p_nguoi: nguoi })
export const danhDau = (dangKy: string, hanhDong: 'co_mat' | 'bo_qua' | 'tra_ve' | 'huy') =>
  rpc<{ trang_thai: string; so_lan_bo_qua: number }>('fn_sk_danh_dau', { p_dang_ky: dangKy, p_hanh_dong: hanhDong })
export const batDau = (phong: string, game: string) => rpc<{ luot_id: string; nguoi: NguoiLuot[] }>('fn_sk_bat_dau', { p_phong: phong, p_game: game })
export const ketThuc = (luot: string, ketQua: { slot: number; xu: number }[]) => rpc<{ tong_xu: number }>('fn_sk_ket_thuc', { p_luot: luot, p_ket_qua: ketQua })
export const huyLuot = (luot: string) => rpc<void>('fn_sk_huy_luot', { p_luot: luot })
export const doiQua = (nguoi: string, xu: number, ghiChu: string) => rpc<number>('fn_sk_doi_qua', { p_nguoi: nguoi, p_xu: xu, p_ghi_chu: ghiChu })
export const dieuChinh = (nguoi: string, xu: number, ghiChu: string) => rpc<number>('fn_sk_dieu_chinh', { p_nguoi: nguoi, p_xu: xu, p_ghi_chu: ghiChu })
export const lichSuXu = (nguoi: string) => rpc<{ id: string; so_xu: number; nguon: string; ghi_chu: string | null; at: string }[]>('fn_sk_lich_su_xu', { p_nguoi: nguoi })
export const quayGanDay = (suKien: string, limit = 10) => rpc<{ id: string; ten: string; so: number; xu: number; at: string }[]>('fn_sk_quay_gan_day', { p_su_kien: suKien, p_limit: limit })
export const luuPhong = (suKien: string, id: string | null, ten: string, maHub: string, hangDoi: boolean, thuTu: number) =>
  rpc<string>('fn_sk_luu_phong', { p_su_kien: suKien, p_id: id, p_ten: ten, p_ma_hub: maHub, p_hang_doi: hangDoi, p_thu_tu: thuTu })
export const luuSuKien = (id: string | null, ten: string, ngay: string, cauHinh: SuKien['cau_hinh'] | null, trangThai: 'mo' | 'dong' | null) =>
  rpc<string>('fn_sk_luu_su_kien', { p_id: id, p_ten: ten, p_ngay: ngay, p_cau_hinh: cauHinh, p_trang_thai: trangThai })

// Nghe thay đổi bảng sk_* (realtime) + poll dự phòng — rớt socket không kẹt màn.
// Gom nhiều sự kiện realtime sát nhau thành 1 lần gọi (debounce 250ms).
export function useSkLive(tables: string[], onChange: () => void, pollMs = 5000) {
  const cb = useRef(onChange)
  cb.current = onChange
  const key = tables.join(',')
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null
    const fire = () => { if (t) clearTimeout(t); t = setTimeout(() => cb.current(), 250) }
    const ch = supabase.channel('sk-live-' + key + '-' + Math.random().toString(36).slice(2))
    for (const tb of tables) ch.on('postgres_changes' as never, { event: '*', schema: 'public', table: tb } as never, fire)
    ch.subscribe()
    const iv = setInterval(() => cb.current(), pollMs)
    return () => { if (t) clearTimeout(t); clearInterval(iv); supabase.removeChannel(ch) }
  }, [key, pollMs]) // eslint-disable-line
}

// Tổng quan sống: giữ số liệu cũ khi refetch nền (không bao giờ trắng màn — CLAUDE.md §2).
export function useTongQuan(suKien: string | null) {
  const [tq, setTq] = useState<TongQuan | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const reqId = useRef(0)
  const tai = useCallback(async () => {
    if (!suKien) return
    const my = ++reqId.current
    try {
      const d = await tongQuan(suKien)
      if (my === reqId.current) { setTq(d); setErr(null) }
    } catch (e) { if (my === reqId.current) setErr((e as Error).message) }
  }, [suKien])
  useEffect(() => { setTq(null); tai() }, [tai])
  useSkLive(['sk_dang_ky', 'sk_luot', 'sk_xu', 'sk_checkin', 'sk_nguoi_choi'], tai)
  return { tq, err, tai, setTq }
}

// Tên kênh broadcast của từng game iPad (games-site/*.html) — game id của hub → kênh riêng.
export const GAME_IPAD: { id: string; ten: string; kenh: string }[] = [
  { id: 'dap-chuot', ten: 'Đập Chuột', kenh: 'bk-dapchuot' },
  { id: 'tim-nhan-vat-an', ten: 'Tìm Nhân Vật Ẩn', kenh: 'bk-timnhanvat' },
  { id: 'tim-diem-khac-nhau', ten: 'Tìm Điểm Khác Nhau', kenh: 'bk-timdiem' },
  { id: 'xep-thap', ten: 'Xếp Tháp', kenh: 'bk-xepthap' },
  { id: 'me-cung', ten: 'Mê Cung', kenh: 'bk-mecung' },
]

export const tenNguon: Record<string, string> = { vong_quay: 'Vòng quay', game: 'Game', doi_qua: 'Đổi quà', dieu_chinh: 'Điều chỉnh' }
