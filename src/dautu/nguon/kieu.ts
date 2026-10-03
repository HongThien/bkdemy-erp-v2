// CHỖ CẮM CONTENT của khung game (Thùy 03/10: "mỗi môn có kho content riêng, đều MCQ — bản chất chỉ đổi chỗ cắm content").
// 6 chế độ (luyện tập · PvP · đấu đôi · giải 8 người · leo tháp ×2) KHÔNG biết môn: chỉ làm việc với `Cau` + `NguonCau`.
// Thêm môn = viết 1 NguonCau và đăng ký ở nguon/index.ts — không sửa trọng tài, mạng, giải, tháp, màn trận.

/** 1 phương án trả lời. `id` duy nhất trong câu. */
export interface PhuongAn { id: string; text: string }

/** 1 câu trong trận — TỰ ĐỦ để hiện (máy khách online không cần tra kho). */
export interface Cau {
  id: string
  de: string // đề (Toán/KHTN có LaTeX $…$; Anh chữ thường) — hiện bằng ChuMon theo môn
  anh?: string | null // ảnh đề (hình vẽ)
  nhan?: string // dòng nhỏ trên đề: "Chọn đáp án đúng:"…
  phu?: string // dòng phụ dưới đề: phiên âm · loại từ / tên dạng
  doc?: string // chữ tiếng Anh cần đọc to (chỉ môn có phát âm)
  opts: PhuongAn[] // đúng 4
  dung: string // id phương án đúng
  dao?: boolean // câu đảo chiều (Anh: Việt → Anh)
  giai?: string | null // lời giải / câu ví dụ — hiện sau khi chốt câu
  tuId?: string // Anh: id từ trong kho từ ⇒ cập nhật sổ nhớ từ
}

export interface CapNguon { id: string; ten: string; mo?: string }
export interface ChuDeNguon { id: string; ten: string; icon: string; mau?: string; phu?: string }
export interface CauHinhBo { cap: string; chuDe: string; soCau: number; tiLeDao?: number; uuTien?: string[] }
export type CheDoThap = 'song_con' | 'vo_tan'

export interface NguonCau {
  mon: string // nhãn môn (CLAUDE §1.6) — 'Tiếng Anh' | 'Toán' | 'KHTN'
  ten: string
  icon: string
  giayMoiCau: number // thời gian 1 câu trong trận (ngưỡng điểm tốc độ co giãn theo số này)
  giayThap: number // Vô tận: thời gian câu đầu; mỗi 10 tầng −10%, sàn 30%
  coDaoChieu: boolean // có kiểu đố Anh→Việt / Việt→Anh
  coNhoTu: boolean // có sổ nhớ từ + Nối từ + Góc luyện tập (riêng Anh)
  capMacDinh: string
  tenCap: string // "Cấp độ" / "Khối"
  dsCap(): Promise<CapNguon[]>
  dsChuDe(cap: string): Promise<ChuDeNguon[]>
  taoBoDe(o: CauHinhBo): Promise<Cau[]>
  /** chuDe: tháp CHỦ ĐỀ (Chinh phục BK) — null = tháp tổng của khối */
  taoThap(cheDo: CheDoThap, ngay: string, cap: string, chuDe?: string | null): Promise<Cau[]>
  /** nhóm bảng xếp hạng tháp: Anh 1 tháp chung (''), môn kho tách theo khối; tháp chủ đề = 'khối|mã chủ đề' (mỗi tháp 1 BXH riêng) */
  nhomThap(cap: string, chuDe?: string | null): string
}
