// TÊN LOÀI QUÁI + chọn đội hình — KHÔNG import three (React dùng ở bundle chính, không kéo three vào).
// Quái vật do Thùy thiết kế riêng; file này chỉ giữ danh sách loài mà DB gán (_phieu_luu_bo) và quy tắc chọn đội hình của chặng.
import { bam } from './hinhHoc'

export type KeHoach = 'slime' | 'thu' | 'rua' | 'chim' | 'ca' | 'sao' | 'nam' | 'golem' | 'con'
export const KE_HOACH: Record<string, KeHoach> = {
  slime_la: 'slime', slime_lua: 'slime', ma_lua: 'slime', ech_doc: 'slime', rong_con: 'slime',
  meo_bang: 'thu', tho_gio: 'thu', soi_bang: 'thu', bach_tuoc: 'thu',
  rua_da: 'rua', bo_giap: 'rua', cu_dem: 'chim', chim_set: 'chim', phuong_hoang: 'chim',
  ca_bong: 'ca', sao_bien: 'sao', nam_ma: 'nam', be_nham: 'golem', golem_pha_le: 'golem', dom_dom: 'con',
}
/** 16 loài thường (không kể tên boss của DB — boss giờ là loài thường + vương miện). */
export const LOAI_THUONG = ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set', 'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua']
const TEN_BOSS_DB = new Set(['rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc'])
/** Chuẩn hoá tên loài từ DB: tên boss cũ → 1 loài thường theo mã (boss = loài thường + vương miện). */
export function loaiHopLe(loai: string, ma: string): string {
  if (TEN_BOSS_DB.has(loai) || !KE_HOACH[loai]) return LOAI_THUONG[bam(ma) % LOAI_THUONG.length]
  return loai
}
export const TEN_LOAI: Record<string, string> = {
  slime_la: 'Slime Lá', slime_lua: 'Slime Lửa', meo_bang: 'Mèo Băng', rua_da: 'Rùa Đá', cu_dem: 'Cú Đêm', ca_bong: 'Cá Bóng', nam_ma: 'Nấm Ma', chim_set: 'Chim Sét',
  tho_gio: 'Thỏ Gió', be_nham: 'Bé Nham', sao_bien: 'Sao Biển', ech_doc: 'Ếch Độc', dom_dom: 'Đom Đóm', soi_bang: 'Sói Băng', bo_giap: 'Bọ Giáp', ma_lua: 'Ma Lửa',
  rong_con: 'Rồng Con', golem_pha_le: 'Golem Pha Lê', phuong_hoang: 'Phượng Hoàng', bach_tuoc: 'Bạch Tuộc',
}


/** Đội hình của 1 chặng (dạng): cụm thật + con tạm cho đủ 3, tối đa 7 (spec-v1-app-hs §4.5). Quái cuối = boss (loài thường + vương miện).
 *  Elite khác loài boss và khác nhau từng đôi một. Tất định theo mã dạng. */
export function chonDoiHinh(maDang: string, soCum: number): { loai: string; boss: boolean }[] {
  const n = Math.min(7, Math.max(3, soCum)), boss = LOAI_THUONG[bam(maDang) % LOAI_THUONG.length]
  const pool = LOAI_THUONG.filter((l) => l !== boss), out: { loai: string; boss: boolean }[] = []
  for (let i = 0; i < n - 1; i++) out.push({ loai: pool[(bam(maDang + 'e') + i * 5) % pool.length], boss: false })
  out.push({ loai: boss, boss: true })
  return out
}
