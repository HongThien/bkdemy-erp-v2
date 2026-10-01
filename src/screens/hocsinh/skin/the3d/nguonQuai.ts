// ĐIỂM CẮM QUÁI VẬT. Quái và boss do Thùy thiết kế riêng (01/10: "đừng focus dựng quái vật") — mọi cảnh 3D sinh quái qua `sinhQuai()`,
// không gọi thẳng bộ dựng. Bộ dựng trong quai.ts chỉ là CHỖ GIỮ CHỖ để cảnh chạy được.
// Khi có hình/model thật: viết 1 hàm trả về `Quai` (cùng giao diện: goc, cao, ban, capNhat, trung, hoi, nga, dung, bong, daNga, phaHuy)
// rồi gọi `datNguonQuai(hamMoi)` một lần lúc khởi động — không phải sửa cảnh nào.
import { taoQuai, type Quai } from './quai'
import type { BangMau3D } from './kieuMau'

export type { Quai }
type NhaMay = (loai: string, b: BangMau3D) => Quai
let nha: NhaMay = taoQuai
export const datNguonQuai = (f: NhaMay) => { nha = f }
export const sinhQuai: NhaMay = (loai, b) => nha(loai, b)
