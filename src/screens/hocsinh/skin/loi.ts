// ============================================================================
// LỜI CHỮ THEO STYLE (Thùy 03/10): "app có chế độ chọn — ai thích game chọn style game, ai không thích game chọn style mặc định.
// Múa máy thêm từ ngữ được, nhưng BẢN GỐC phải là bản formal."
//  • LOI_FORMAL = bản gốc, trung tính, nghe như app học tập — MỌI style không khai gì đều dùng bản này.
//  • Style game (RPG, Khối vuông…) khai `Skin.loi` ghi đè TỪNG khoá bằng giọng game (chiêu, quái, tuyệt kỹ…). Khoá không ghi đè ⇒ rơi về formal.
// Luật: màn mới có chữ mang giọng game ⇒ thêm khoá vào `LoiHS` + bản FORMAL ở đây trước, rồi mới viết bản game trong style. Không gõ chữ game thẳng trong màn.
// Chỉ đổi CÂU CHỮ — logic/số liệu không phụ thuộc lời (đúng luật đối xứng: màn chạy y hệt ở mọi style).
// ============================================================================
import { useSyncExternalStore } from 'react'
import type { SkinId } from './kieu'

export type LoiHS = {
  /** true ⇒ đang ở style GAME: các màn có chữ hai giọng (vd Hướng dẫn chơi) dùng bản "múa máy" cho phần được phép ghi đè */
  giongGame: boolean
  /** nhãn 4 mức combo: [0/3, 1/3, 2/3, 3/3] */
  chieu: readonly [string, string, string, string]
  /** chữ nhỏ dưới nhãn mức: "2/3 câu đúng · −2 máu · Cầu lửa" */
  chieuChiTiet: (dung: number, tong: number, ten: string) => string
  /** nhãn cạnh 3 ô combo trên thanh trên cùng */
  nhanCombo: string
  /** tên nhóm đội hình (aria + tiêu đề) */
  doiHinh: string
  /** nhãn đối tượng cuối chặng (boss) · đối tượng thường */
  nhanBoss: string
  nhanThuong: (n: number, tong: number) => string
  /** mở màn */
  moMan: (ten: string) => string
  huongDan: (n: number) => string
  /** còn lại / đã xong */
  con: (n: number) => string
  daXong: string
  /** hoàn thành toàn bộ */
  hetDoiHinh: string
  /** MÀN GIỚI THIỆU Luyện dạng yếu */
  yeu: { tieuDe: string; hoi: string; nut: string; dongLuat: (soCau: number) => string; dongDau: string; dangYeu: string }
  /** thẻ kết quả sau lượt trong khung đấu */
  ketQua: { duocTinh: string; ghiNhan: string; luyenTiep: string; veChang: string; veKhu: string }
}

export const LOI_FORMAL: LoiHS = {
  giongGame: false,
  chieu: ['Chưa đạt mức nào', 'Mức 1/3', 'Mức 2/3', 'Hoàn thành tốt 3/3'],
  chieuChiTiet: (dung, tong, ten) => `${dung}/${tong} câu đúng${dung ? ` · tính ${dung} điểm` : ''} · ${ten}`,
  nhanCombo: 'Chuỗi',
  doiHinh: 'Các nhóm câu hỏi',
  nhanBoss: 'CUỐI CHẶNG',
  nhanThuong: (n, tong) => `NHÓM ${n}/${tong}`,
  moMan: (ten) => `Bắt đầu: ${ten}`,
  huongDan: (n) => `Cứ ${n} câu là một lượt tính; đúng cả ${n} câu đạt mức cao nhất`,
  con: (n) => `Còn ${n} điểm`,
  daXong: 'Đã hoàn thành',
  hetDoiHinh: 'Hoàn thành toàn bộ!',
  yeu: {
    tieuDe: 'Luyện dạng yếu',
    hoi: 'Em đã sẵn sàng cho lượt luyện này chưa?',
    nut: 'Bắt đầu luyện',
    dongLuat: (n) => `Mỗi lượt gồm ${n} câu, tập trung vào các dạng em còn yếu. Mục tiêu: đúng từ 7 câu.`,
    dongDau: 'Hãy làm kỹ từng câu: lượt chỉ được tính khi em không bấm quá nhanh.',
    dangYeu: 'Các dạng em đang yếu nhất',
  },
  ketQua: {
    duocTinh: 'Lượt này được tính vào chuỗi và nhiệm vụ.',
    ghiNhan: 'Độ nắm dạng được cập nhật theo kết quả thật khi em quay lại.',
    luyenTiep: 'Luyện tiếp',
    veChang: 'Về chặng đường',
    veKhu: 'Về khu Học tập',
  },
}

/** Giọng GAME — dùng chung cho các style game; style nào muốn giọng riêng thì khai `loi` của mình đè lên. */
export const LOI_GAME: Partial<LoiHS> = {
  giongGame: true,
  chieu: ['Chiêu xịt — quái đánh trả, hồi 1 máu', 'Chiêu nhẹ', 'Chiêu mạnh', 'TUYỆT KỸ!'],
  chieuChiTiet: (dung, tong, ten) => `${dung}/${tong} câu đúng${dung ? ` · −${dung} máu` : ''} · ${ten}`,
  nhanCombo: 'Chiêu',
  doiHinh: 'Đội hình',
  nhanBoss: 'BOSS',
  nhanThuong: (n, tong) => `ELITE ${n}/${tong}`,
  moMan: (ten) => `${ten} xuất hiện!`,
  huongDan: (n) => `Mỗi ${n} câu tung 1 chiêu — đúng cả ${n} là TUYỆT KỸ`,
  con: (n) => `Còn ${n} đòn`,
  daXong: 'Đã bị hạ',
  hetDoiHinh: 'Hạ hết đội hình!',
  yeu: {
    tieuDe: 'Rèn lại điểm yếu',
    hoi: 'Em đã sẵn sàng đối đầu quái vật điểm yếu chưa?',
    nut: 'Vào trận!',
    dongLuat: (n) => `Mỗi câu đúng là một đòn đánh. ${n} câu — đúng từ 7 câu là thắng trận.`,
    dongDau: 'Ra đòn nhanh nhưng đừng bấm bừa — làm quá nhanh thì trận không được ghi nhận.',
    dangYeu: 'Quái vật điểm yếu của em',
  },
  ketQua: {
    duocTinh: 'Lượt này được tính: chuỗi, nhiệm vụ và quái đều ghi nhận.',
    ghiNhan: 'Máu quái và độ nắm dạng cập nhật theo kết quả thật khi em quay lại.',
    luyenTiep: 'Đánh tiếp',
    veChang: 'Về chặng đường',
    veKhu: 'Về khu Học tập',
  },
}

// ── style đang áp (cùng chỗ gắn biến --sk-* ở KhungHS.ganBien) ─────────────────────────────────────────────────────
// Màn cần LỜI mà không cần biết style là gì ⇒ chỉ đọc qua useLoi(), không so sánh id style.
let skinDangAp: SkinId | null = null
const nghe = new Set<() => void>()
export function datSkinDangAp(id: SkinId) { if (skinDangAp === id) return; skinDangAp = id; nghe.forEach((f) => f()) }
/** id style đang áp (null = chưa gắn) — registry.laySkin(null) đọc chỗ này */
export const skinDangApId = (): SkinId | null => skinDangAp
export const layLoi = (rieng?: Partial<LoiHS>): LoiHS => ({ ...LOI_FORMAL, ...rieng })

/** Lời chữ của style đang áp. `loiCuaSkin` truyền từ registry để tránh import vòng (registry ↔ loi). */
export function useSkinDangAp(): SkinId | null {
  return useSyncExternalStore((f) => { nghe.add(f); return () => { nghe.delete(f) } }, () => skinDangAp, () => skinDangAp)
}
