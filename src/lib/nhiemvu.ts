// ============================================================================
// nhiemvu.ts — NHIỆM VỤ theo môn (Thùy chốt 06/10, mig 202610061915; spec-kinh-te-nhiem-vu.md §1–§9).
// Điều kiện duy nhất = lượt LUYỆN DẠNG YẾU đạt (học thật + đúng ≥70%). Hoàn thành · EXP · ĐHT · trần đều SUY ở Postgres
// (fn_nhiem_vu_hoan_thanh / fn_hs_nhiem_vu_cua_toi) — ở đây chỉ gọi RPC. ĐHT = điểm học tập để chơi game (sổ dht_tieu, số dư replay ở DB).
// ============================================================================
import { supabase } from './supabase'

export type DhtCuaToi = { so_du: number; tran: number; tong_kiem: number; tong_tieu: number; mat_do_vuot_tran: number; kiem_thang: number }
export type NhiemVuCuaToi =
  | { mon: string; mo: false; bat_dau: string }
  | {
      mon: string; mo: true; ym: string; tuan_so: number
      cau_hinh: {
        dat_ti_le: number; lan_ngay: number; exp_luot: number; dht_luot: number
        w1_ngay: number; w1_exp: number; w1_dht: number; w2_luot: number; w2_exp: number; w2_dht: number
        m1_ngay: number; m1_exp: number; m1_dht: number; tran_exp: number; dht_so_du_max: number
      }
      ngay: { luot_hom_nay: number; con_lai: number; luot_thang: number }
      tuan: { ngay_co_luot: number; luot: number; w1_xong: boolean; w2_xong: boolean }
      thang: { ngay_co_luot: number; m1_xong: boolean }
      exp_thang: number; dht_thang: number
      dht: DhtCuaToi
      vong_quay: { du: boolean; da_quay: boolean }
    }

// null = môn chưa bật nhiệm vụ.
export async function nhiemVuCuaToi(mon: string): Promise<NhiemVuCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_hs_nhiem_vu_cua_toi', { p_mon: mon })
  if (error) throw error
  return (data as NhiemVuCuaToi | null) ?? null
}

export async function dhtCuaToi(): Promise<DhtCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_dht_cua_toi')
  if (error) throw error
  return (data as DhtCuaToi | null) ?? null
}

// Game TIÊU ĐHT — máy chủ kiểm số dư rồi ghi sổ; trả số dư mới.
export async function dhtTieu(so: number, nguon: string, thamChieu?: string): Promise<DhtCuaToi> {
  const { data, error } = await supabase.rpc('fn_dht_tieu', { p_so: so, p_nguon: nguon, p_tham_chieu: thamChieu ?? null })
  if (error) throw error
  return data as DhtCuaToi
}
