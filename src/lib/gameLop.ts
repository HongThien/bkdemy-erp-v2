// XẾP HẠNG BUỔI + GAME TRONG BUỔI HỌC (spec-game-buoi-hoc.md §5b, Thùy 27/09).
// Mọi luật/tính toán ở Postgres (mig 202609272045): gợi ý hạng, kiểm số giải, rút EXP, ghi sổ EXP. File này CHỈ gọi RPC
// và nói chuyện với màn TV game qua Realtime (kênh `bk-lop:<buổi>`); TV chỉ diễn đúng kết quả DB đã rút.
import { supabase } from './supabase'

export type GiaiHS = {
  hoc_sinh_id: string; ho_ten: string
  diem: number | null        // tổng điểm bài trên lớp của buổi (null = chưa chấm câu nào)
  hang_goi_y: number | null  // dense_rank theo điểm — BẰNG ĐIỂM là CÙNG HẠNG
  giai: 1 | 2 | 3            // 3 = Giải 3 (suy động: có mặt mà không Nhất/Nhì)
  game: string | null; exp: number | null // lượt game đã chơi (null = chưa chơi)
  qua: string | null; qua_trao_at: string | null // quà đặc biệt (🧋 trà sữa) trúng ở lượt đó; trao_at null = chưa trao tay
}
export type GiaiBuoi = {
  buoi_id: string; mon: string | null
  da_chot: boolean; chot_at: string | null
  so_co_mat: number; toi_da_nhi: 1 | 2; co_du_lieu: boolean; so_da_choi: number; so_qua_chua_trao: number
  giai_lech: { hoc_sinh_id: string; giai: 1 | 2 }[] // có giải nhưng nay không còn có mặt
  hs: GiaiHS[]
}
export type KetQuaLuot = { da_choi: boolean; game: string; giai: 1 | 2 | 3; exp: number; min: number; max: number; qua: string | null; ho_ten: string }

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

export const tinhHinhGiai = (buoi: string) => rpc<GiaiBuoi>('fn_buoi_giai_tinh_hinh', { p_buoi: buoi })
export const chotGiai = (buoi: string, nhat: string, nhi: string[]) => rpc<GiaiBuoi>('fn_buoi_giai_chot', { p_buoi: buoi, p_nhat: nhat, p_nhi: nhi })
export const moLaiGiai = (buoi: string) => rpc<GiaiBuoi>('fn_buoi_giai_mo_lai', { p_buoi: buoi })
export const choiLuot = (buoi: string, hs: string, game: string) => rpc<KetQuaLuot>('fn_buoi_game_choi', { p_buoi: buoi, p_hoc_sinh: hs, p_game: game })
// Khép quà đặc biệt: GV/OPS đã trao tay (trà sữa…). Mig 202609281021.
export const traoQua = (buoi: string, hs: string) => rpc<GiaiBuoi>('fn_buoi_game_qua_trao', { p_buoi: buoi, p_hoc_sinh: hs })
export const TEN_QUA: Record<string, string> = { tra_sua: '🧋 Trà sữa' }

// Game có bản lớp. `co_luat=false` ⇒ chưa có bảng thưởng (Thùy chưa viết luật) — hiện nhưng khoá.
// Chiếm Đất (Thùy 28/09): 3 loại ô = 3 mức giải (Giải 3 ★ · Nhì ★★ · Nhất ★★★), EXP y Mở Rương, chọn ô bất kì.
// Bắn Quà (Thùy 28/09, spec-game-ban-qua.md §7): game KỸ NĂNG — cả lớp chơi 1 ván trên TV (cá nhân / đội), không mở từng bạn:
//   `ca_lop=true` ⇒ màn Buổi học hiện khung ván (BanQuaLop) thay cho nút "Mở cho bạn này".
export const GAME_LOP: { id: string; ten: string; file: string; co_luat: boolean; ca_lop?: boolean }[] = [
  { id: 'mo_ruong', ten: '🎁 Mở Rương', file: 'mo-ruong.html', co_luat: true },
  { id: 'chiem_dat', ten: '🏯 Chiếm Đất', file: 'chiem-dat.html', co_luat: true },
  { id: 'ban_qua', ten: '🎯 Bắn Quà', file: 'ban-qua.html', co_luat: true, ca_lop: true },
  { id: 'doan_so', ten: '🎲 Đoán Số', file: 'doan-so.html', co_luat: false },
]

// ---------- Bắn Quà bản lớp (mig 202609281425) — mọi rút/tính ở DB; TV chỉ chơi + gửi điểm thô về ----------
export type BanQuaHS = {
  hoc_sinh_id: string; ho_ten: string; giai: 1 | 2 | 3; doi: number | null; dan: string[]; thu_tu: number; co_mat: boolean
  diem: number | null; exp: number | null; qua: string | null // null = chưa chốt
}
export type BanQuaVan = { che_do: 'canhan' | 'doi'; so_doi: number | null; phut: number | null; chot_at: string | null; created_at: string }
export type BanQuaDoi = { doi: number; sat_thuong: number; hang: number; ruong: 'vang' | 'bac'; exp: number }
export type BanQuaTinhHinh = { buoi_id: string; van: BanQuaVan | null; hs: BanQuaHS[]; doi: BanQuaDoi[] }
export type BanQuaKetQua = { hs: Record<string, number>; doi?: Record<string, number> } // TV gửi về: điểm từng HS · sát thương từng đội
export const banQuaTinhHinh = (buoi: string) => rpc<BanQuaTinhHinh>('fn_ban_qua_tinh_hinh', { p_buoi: buoi })
export const banQuaChiaDoi = (buoi: string, soDoi: number) => rpc<Record<string, number>>('fn_ban_qua_chia_doi', { p_buoi: buoi, p_so_doi: soDoi })
export const banQuaBatDau = (buoi: string, cheDo: 'canhan' | 'doi', soDoi: number | null, phut: number | null, doi: Record<string, number>) =>
  rpc<BanQuaTinhHinh>('fn_ban_qua_bat_dau', { p_buoi: buoi, p_che_do: cheDo, p_so_doi: soDoi, p_phut: phut, p_doi: doi })
export const banQuaChot = (buoi: string, kq: BanQuaKetQua) => rpc<BanQuaTinhHinh>('fn_ban_qua_chot', { p_buoi: buoi, p_kq: kq })
export const TEN_DOI = ['Đỏ', 'Xanh', 'Vàng', 'Tím'], MAU_DOI = ['#ff5c5c', '#3d9bff', '#ffbf2e', '#b36bff']
// Trang game (project Vercel bkdemy-games). Đặt VITE_GAMES_URL nếu dùng domain riêng.
export const GAMES_URL = ((import.meta as any).env?.VITE_GAMES_URL as string | undefined) || 'https://bkdemy-games.vercel.app'
export const linkTV = (file: string, buoi: string) => `${GAMES_URL.replace(/\/$/, '')}/${file}?che_do=lop&buoi=${buoi}`
export const kenhTV = (buoi: string) => 'bk-lop:' + buoi
export const TEN_GIAI: Record<1 | 2 | 3, string> = { 1: '🥇 Nhất', 2: '🥈 Nhì', 3: '🎖 Giải 3' }
