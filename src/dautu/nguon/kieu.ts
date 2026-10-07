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

/** ĐỀ THÁP CHẤM Ở MÁY CHỦ (P1 phase 2): câu phát KHÔNG kèm đáp án (Cau.dung = ''), chấm từng câu ở DB, tầng do DB tính. */
export interface KqCham { dung: boolean; dung_idx: number; giai: string | null; het_gio: boolean; so_dung: number; so_sai: number }
export interface KetThapMayChu {
  ho_so: import('../lib/hoSo').HoSoDB; xp_nhan: number; len_cap: boolean; luot_id: string
  tang: number; sai: number; ms: number
  bxh: { so_nguoi: number; top: { hang: number; ma: string; ten: string; nv: string; tang: number; sai: number; ms: number }[]; toi: { hang: number; tang: number; sai: number; ms: number } | null }
}
/** ĐỀ TRẬN với bot chấm ở máy chủ: phát câu không đáp án; idx -1 = bỏ qua (mất câu để xem đáp án) */
export interface DeTran {
  deId: string; soCau: number
  lay(tu: number, so: number): Promise<Cau[]>
  cham(thuTu: number, idx: number, ms: number): Promise<{ dung: boolean; dung_idx: number; giai: string | null }>
}
export interface DeMayChu {
  deId: string; soCau: number; giayGoc: number; nhom: string
  lay(tu: number, so: number): Promise<Cau[]>
  batDau(): Promise<void>
  /** idx = chỉ số phương án (0–3) · -1 = bỏ qua / hết giờ phía game */
  cham(thuTu: number, idx: number, ms: number): Promise<KqCham>
  ket(): Promise<KetThapMayChu>
}

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
  /** có ⇒ tài khoản học sinh leo tháp bằng ĐỀ CHẤM Ở MÁY CHỦ (môn có kho DB); không có (Tiếng Anh) ⇒ vẫn bản cũ, kết quả do game khai */
  taoDeMayChu?(cheDo: CheDoThap, cap: string, chuDe?: string | null): Promise<DeMayChu>
  /** có ⇒ trận với bot của tài khoản học sinh dùng ĐỀ CHẤM Ở MÁY CHỦ (môn có kho DB) */
  taoDeTran?(c: CauHinhBo): Promise<DeTran>
  /** nhóm bảng xếp hạng tháp: Anh 1 tháp chung (''), môn kho tách theo khối; tháp chủ đề = 'khối|mã chủ đề' (mỗi tháp 1 BXH riêng) */
  nhomThap(cap: string, chuDe?: string | null): string
}
