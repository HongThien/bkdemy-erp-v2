// ĐIỂM CẮM QUÁI VẬT. Quái và boss do Thùy thiết kế riêng (01/10: "đừng focus dựng quái vật") — mọi cảnh 3D sinh quái qua `sinhQuai()`,
// không gọi thẳng bộ dựng. Bộ dựng trong quai.ts chỉ là CHỖ GIỮ CHỖ để cảnh chạy được.
// Khi có hình/model thật: viết 1 hàm trả về `Quai` (cùng giao diện: goc, cao, ban, capNhat, trung, hoi, nga, dung, bong, daNga, phaHuy)
// rồi gọi `datNguonQuai(hamMoi)` một lần lúc khởi động — không phải sửa cảnh nào.
import { taoQuai, type Quai } from './quai'
import type { BangMau3D } from './kieuMau'
import { taoQuaiAnh } from './quaiAnh'
import { taoBossChibi3D } from './bossChibi3D'
import { TEN_LOAI } from './loai'
import { laySkin } from '../registry'

export type { Quai }
type NhaMay = (loai: string, b: BangMau3D) => Quai
let nha: NhaMay = taoQuai
export const datNguonQuai = (f: NhaMay) => { nha = f }
// Boss RIÊNG của giáo viên (`Skin.boss[loai]`, mã `boss_<ma_gv>`): dựng từ ảnh 2D của style đang dùng; không có ⇒ nguồn mặc định.
export const sinhQuai: NhaMay = (loai, b) => {
  const anh = laySkin(null).boss?.[loai]
  if (!anh) return nha(loai, b)
  return anh.mo3d ? taoBossChibi3D(loai, anh.mo3d, anh.cao) : taoQuaiAnh(loai, anh)
}
/** Tên hiển thị của quái/boss: boss riêng lấy theo style, còn lại bảng TEN_LOAI. */
export const tenQuai = (loai: string): string => laySkin(null).boss?.[loai]?.ten ?? TEN_LOAI[loai] ?? loai
