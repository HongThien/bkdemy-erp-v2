// ============================================================================
// nhiemvu.ts — NHIỆM VỤ theo môn (spec-thanh-tuu-nhiem-vu.md §0.4, mig 202609281810).
// Hoàn thành / còn treo / chặng / rương / EXP đều SUY ĐỘNG ở Postgres (fn_nhiem_vu_hoan_thanh) — ở đây chỉ gọi RPC.
// ============================================================================
import { supabase } from './supabase'

export type NvNgay = { xong_hom_nay: number; con_mo: number; tien_do: number; xong_thang: number }
export type NvTuan = { xong_tuan_nay: number; con_mo: number; xong_thang: number }
export type NhiemVuCuaToi =
  | { mon: string; mo: false; bat_dau: string }
  | {
      mon: string; mo: true; thang: string; tuan: number
      cau_hinh: {
        song_ngay: number; n2_cau: number; n3_cau: number; t3_ngay: number; m2_ngay: number; ruong_can: number; ruong_exp: number
        cap_diem: number; cap_max: number; exp_cap: number; moc: [number, number][]; vq_can: number
        diem_ngay: number; diem_tuan: number; diem_thang: number
      }
      ngay: Record<'N1' | 'N2' | 'N3', NvNgay>
      tuan_nv: Record<'T1' | 'T2' | 'T3' | 'T4', NvTuan>
      thang_nv: { M1: boolean; M2: boolean; ngay_pass: number }
      ruong: { tuan: number; so_nv: number; mo: boolean }[]
      chang: { diem: number; cap: number; exp: number; so_ruong: number }
      vong_quay: { xong_hom_nay: number; can: number }
    }

// null = môn chưa bật nhiệm vụ.
export async function nhiemVuCuaToi(mon: string): Promise<NhiemVuCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_hs_nhiem_vu_cua_toi', { p_mon: mon })
  if (error) throw error
  return (data as NhiemVuCuaToi | null) ?? null
}
