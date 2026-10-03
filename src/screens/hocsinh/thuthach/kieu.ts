// THỬ THÁCH = ĐẤU TRƯỜNG 3 TRẬN (spec-thu-thach-dau-truong.md). Hợp đồng dữ liệu màn Đấu trường — demo dùng dữ liệu giả cùng hình dạng này,
// khi Số liệu có RPC (§7) thì chỉ đổi nguồn, màn không đổi.
export type DoKho = 'thap' | 'vua' | 'cao'

/** 1 câu trắc nghiệm của trận. `dung` = chỉ số đáp án đúng (demo / sau này server trả sau khi em chọn). Không xáo đáp án (luật giấy = app). */
export interface CauTT { id: string; de: string; dapAn: string[]; dung: number; doKho: DoKho }

export const SO_TRAN = 3
export const SO_CAU_TRAN = 5
/** Ngưỡng thắng từng trận: 60% · 80% · 100% của 5 câu. CHỈ ĐỂ HIỂN THỊ (vạch "hạ gục", nhãn "cần 3/5") — thắng/thua thật do server chấm (spec §7). */
export const NGUONG: readonly number[] = [3, 4, 5]
export const NHAN_DO_KHO: Record<DoKho, string> = { thap: 'Dễ', vua: 'Vừa', cao: 'Khó' }

export interface KetThucLuot {
  /** kết quả từng trận ĐÃ ĐÁNH (thua là dừng ⇒ độ dài ≤ 3, phần tử cuối false) */
  thang: boolean[]
  lyDo: 'vuot' | 'thua' | 'bo_cuoc'
}
