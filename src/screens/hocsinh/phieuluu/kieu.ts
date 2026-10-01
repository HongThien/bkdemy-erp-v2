// Kiểu dữ liệu để VẼ bản đồ phiêu lưu (spec-v1-app-hs.md §4.5, hợp đồng §13.4). Trạng thái/số liệu do Postgres tính — client chỉ vẽ.
// `tuBanDoPL()` đổi dữ liệu thật của `fn_ban_do_phieu_luu` sang kiểu này; trang xem mẫu dùng `mau.ts` (dữ liệu giả cùng hình dạng).
import type { BanDoPL } from '../../../lib/phieuluu'
import { chonDoiHinh, loaiHopLe } from '../skin/the3d/loai'

export type TrangThai = 'chua_do' | 'yeu' | 'dat'
export type QuaiV = { loai: string; boss: boolean }
export type ChangV = {
  ma: string
  ten: string
  muc_do: number
  trang_thai: TrangThai
  mastery: number | null
  da_day: boolean
  /** số cụm THẬT (mỗi cụm là 1 elite; cụm khó nhất là boss cuối) */
  so_cum: number
  /** đội hình: cụm thật + con tạm cho đủ 3, tối đa 7; quái cuối là boss */
  quai: QuaiV[]
  /** số đòn còn cần tới "đạt" — DB sẽ trả (chia đều cho đội hình); chưa có thì null */
  hp: number | null
  /** số câu một lượt = số cụm × 2 kẹp 5–10 — DB sẽ trả; chưa có thì null */
  so_cau_luot: number | null
}
export type VungV = { ma: string; ten: string; chang: ChangV[] }
export type LucDiaV = { ma: string; ten: string; biome: string; vung: VungV[] }
export type BanDoV = { mon: string; luc_dia: LucDiaV[] }

/** Đếm để HIỂN THỊ nhãn (x/y chặng đạt) và chọn dấu hiệu — chỉ đếm phần tử đang vẽ, không phải luật nghiệp vụ. */
export function thongKe(l: LucDiaV) {
  const c = l.vung.flatMap((v) => v.chang), dat = c.filter((x) => x.trang_thai === 'dat').length, yeu = c.filter((x) => x.trang_thai === 'yeu')
  const trangThai: 'dat' | 'yeu' | 'fog' = c.length && dat === c.length ? 'dat' : yeu.length || dat > 0 ? 'yeu' : 'fog'
  return { dat, tong: c.length, trangThai, loai: yeu[0]?.quai[yeu[0].quai.length - 1]?.loai ?? null, khoi: c.length > 0 && c.filter((x) => x.muc_do >= 4).length * 2 > c.length }
}
export function thongKeVung(v: VungV) {
  const dat = v.chang.filter((x) => x.trang_thai === 'dat').length, yeu = v.chang.find((x) => x.trang_thai === 'yeu')
  const trangThai: 'dat' | 'yeu' | 'fog' = v.chang.length && dat === v.chang.length ? 'dat' : yeu || dat > 0 ? 'yeu' : 'fog'
  return { dat, tong: v.chang.length, trangThai, loai: yeu ? yeu.quai[yeu.quai.length - 1].loai : null }
}

/** Dữ liệu thật từ DB → kiểu vẽ. Đội hình tạm: DB chưa trả đội hình mới (spec §13.6 đã ghi yêu cầu) nên tạm ghép ở đây theo luật ≥3, ≤7. */
export function tuBanDoPL(bd: BanDoPL): BanDoV {
  return {
    mon: bd.mon,
    luc_dia: bd.luc_dia.map((l) => ({
      ma: l.ma, ten: l.ten, biome: l.biome,
      vung: l.khu_vuc.map((v) => ({
        ma: v.ma, ten: v.ten,
        chang: v.man.map((m) => {
          const soCum = m.quai.filter((q) => q.ma !== m.ma_dang).length
          return {
            ma: m.ma_dang, ten: m.ten, muc_do: m.muc_do ?? 3, trang_thai: m.trang_thai, mastery: m.mastery, da_day: m.da_day, so_cum: soCum,
            quai: chonDoiHinh(m.ma_dang, soCum).map((q, i, a) => (i === a.length - 1 ? q : { ...q, loai: loaiHopLe(q.loai, m.ma_dang + i) })),
            hp: null, so_cau_luot: null,
          }
        }),
      })),
    })),
  }
}
