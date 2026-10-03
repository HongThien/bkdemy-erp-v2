// ============================================================================
// HỢP ĐỒNG 1 STYLE (skin) của app HS — mọi style trong skin/styles/*.ts PHẢI khai đủ kiểu `Skin` này.
// Đọc design/STYLE-HS.md trước khi thêm style hoặc thêm tính năng/màn mới.
// ============================================================================

import type { BangMau3D } from './the3d/kieuMau'
import type { LoiHS } from './loi'


// Thêm style mới: thêm id ở đây + file skin/styles/<id>.ts + đăng ký trong registry.ts + migration nới CHECK hs_giao_dien.skin.
export type SkinId = 'rpg' | 'toi_gian' | 'khoi'
export type CheDo = 'sang' | 'toi' | 'he_thong'
// hieu_ung_game: công tắc của em (mig 202610020037, mặc định bật) — tắt ⇒ không bản đồ phiêu lưu / màn đấu. Không có trường (bản cũ) = bật.
export type GiaoDien = { skin: SkinId; che_do: CheDo; hinh_nen: string; hieu_ung_game?: boolean }

export type Mau = {
  bg: string; surface: string; surface2: string; ink: string; muted: string; line: string
  acc: string; accInk: string; badge: string; badgeInk: string
  cardBorder: string; cardShadow: string
}
// Bảng màu MÀN ĐỌC (tầng cuối tra cứu — xem `Skin.doc`). nen = nền trang · giay = thẻ nội dung · vd = khối ví dụ ·
// nham* = khối "hay nhầm" · luuY* = khối "lưu ý". Màu nhấn KHÔNG ở đây — theo môn (`mauDocMon`).
export type MauDoc = {
  font: string; nen: string; giay: string; ink: string; muted: string; line: string; bong: string
  vd: string; nhamNen: string; nhamVien: string; nhamChu: string; luuYNen: string; luuYChu: string
}
// sangDoc/toiDoc: bản cho màn DỌC (điện thoại) — tranh vẽ riêng khổ 9:16, không có thì dùng bản thường.
export type HinhNen = { id: string; ten: string; sang?: string; toi?: string; sangDoc?: string; toiDoc?: string }

// BOSS RIÊNG (mỗi GV 1 boss — design/FLOW-NPC-BOSS-CUOI.md): 6 tư thế + chân dung, PNG trong suốt cùng khung vuông, chân chạm đáy.
// Khoá của `Skin.boss` = mã boss (`boss_<ma_gv>`) — cũng là `loai_quai` DB trả về. Thiếu boss ở style nào ⇒ rơi về quái thường.
/** Thông số dựng boss CHIBI 3D bằng code (skin/the3d/bossChibi3D.ts) — mỗi GV 1 dòng. Màu lấy từ bảng màu của style. */
export type MoHinhChibi = {
  da: string; toc: string
  /** kính gọng nửa */
  kinh: boolean
  ao: string; aoLot: string; vien: string; ngoc: string
  /** hào quang thường · khi giận (pha 2) */
  hao: string; haoGian: string
}
export type BossAnh = {
  /** Cách dựng boss trong cảnh trận 3D. 'anh' = tấm ảnh 2D quay mặt camera + hoạt ảnh code (quaiAnh.ts) — MẶC ĐỊNH, nhẹ, giống bản vẽ 100%.
   *  'relief' = phù điêu từ chính ảnh (quaiRelief.ts, có khối nhẹ) · 'chibi' = dựng khối bằng code (bossChibi3D.ts, cần mo3d; thô — chỉ để thử). */
  dang?: 'anh' | 'relief' | 'chibi'
  /** có ⇒ MÔ HÌNH dựng bằng khối cơ bản theo thông số này (bossChibi3D.ts); không có cả hai ⇒ tấm ảnh 2D (quaiAnh.ts) */
  mo3d?: MoHinhChibi
  ten: string
  /** chiều cao nhân vật trong cảnh 3D (đơn vị thế giới; quái thường ~1.3–1.6) */
  cao: number
  dung: string; noi: string; chieu: string; trung: string; gian: string; ha: string
  chandung: string
}

export type Skin = {
  id: SkinId
  ten: string
  moTa: string
  giongGi: string
  font: string          // chữ thường
  fontHead: string      // tiêu đề, tên ô, số to (font phải khai thêm ở hs.html)
  headCase: 'none' | 'uppercase'
  headTrack: string
  radius: string        // bo góc thẻ
  // bo góc của thứ dáng VIÊN THUỐC / TRÒN (nút tròn đầu trang, nhãn, badge, chip môn, avatar). Không khai = '999px' (tròn).
  // Style vuông (Khối vuông) khai '0px' — nếu không nút vẫn tròn giữa thẻ vuông (lỗ ① spec-giao-dien-hs §10).
  radiusPill?: string
  cardClip: string      // clip-path thẻ ('none' nếu không cắt góc)
  cardAccentLeft: string // viền trái nhấn — 'none' nếu không
  blur: string          // backdrop-filter của thẻ (skin nền ảnh cần mờ sau thẻ)
  // LỜI CHỮ giọng game (skin/loi.ts): không khai ⇒ bản FORMAL gốc. Khai từng khoá để ghi đè (Thùy 03/10: bản gốc phải formal, style game được múa máy).
  loi?: Partial<LoiHS>
  cheDo: ('sang' | 'toi')[] // chế độ skin hỗ trợ; 1 phần tử = khoá chế độ đó
  sang?: Mau
  toi?: Mau
  hinhNen: HinhNen[]    // phần tử đầu = mặc định
  // id Ô CHỨC NĂNG → icon vẽ riêng của style. MỌI ô trong KHU/KHU_CAP2 (HocSinhApp) phải có — ô mới thêm mà thiếu icon
  // thì `npm run check:style-hs` báo, và app tạm hiện dauThayIcon.
  anhO?: Record<string, string>
  // true ⇒ icon ô là nét đơn sắc dùng làm MẶT NẠ, tô bằng màu chữ của style (style đơn sắc: 1 bộ icon đúng cả sáng lẫn tối)
  anhOMask?: boolean
  // Ô thiếu icon ⇒ hiện DẤU này (màu nhấn) thay vì emoji — emoji lẫn icon vẽ tay trông lệch (Thùy 28/09).
  dauThayIcon?: string
  trangTri?: { goc?: string; gach?: string } // hoa văn góc thẻ "Tiếp theo" + gạch phân cách dưới đầu trang
  anhBanner?: { lich?: string; kiemTraLai?: string } // ảnh vẽ riêng cho thẻ ca bổ trợ + banner bài kiểm tra lại
  // Thẻ "Việc tiếp theo": mặc định tô đặc màu nhấn. Skin nền tối sang (RPG) tô đặc thì thành mảng vàng thô — dùng kiểu riêng.
  theTiep?: { bg: string; ink: string; border: string }
  // Tấm mờ sau tên HS — skin nền ẢNH cần (tên đè lên tia sáng/lâu đài thì không đọc được). Có nenTen + chế độ TỐI ⇒ bật luôn bóng chữ toàn trang.
  nenTen?: string
  // Nhân vật cắt nền (PNG trong suốt) đứng nửa trái Home khổ NGANG (PC/iPad) kèm bong bóng thoại — như ảnh gốc style
  // (RPG: design/bk-ui-src/Nền app HS cấp 3_11.png). Chọn theo giới tính HS; chưa biết ⇒ `nam`. Không có ⇒ Home ngang không vẽ nhân vật.
  nhanVat?: { nam: string; nu: string }
  // Bảng màu 3D của bản đồ phiêu lưu (thế giới · lục địa · chặng đường · màn đấu) — 1 bảng duy nhất cho cả cảnh (skin/the3d/kieuMau.ts).
  the3d?: BangMau3D
  // Boss riêng của từng giáo viên (ảnh 2D chibi, hoạt ảnh bằng code). Khoá = mã boss.
  boss?: Record<string, BossAnh>
  // THẺ CÂU HỎI TRONG MÀN ĐẤU (Thùy 02/10: "viền card + font chưa mang vibe game") — không khai ⇒ dùng thẻ thường của style.
  // font: chữ đề + đáp án · nen/vien: nền + khung thẻ (box-shadow nhiều lớp = viền kép) · phien/phienDay: phiến đáp án + gờ dưới (bấm lún)
  tran?: { font: string; nen: string; vien: string; phien: string; phienDay: string }
  // MÀN ĐỌC — tầng CUỐI của luồng tra cứu (1 mục sổ tay, 1 lý thuyết dạng): màn riêng nền SÁNG trơn, KHÔNG tranh nền
  // (Thùy 03/10: "menu vẫn hiện backdrop, vào lớp cuối cùng phải hiện màn riêng — ô trên nền backdrop rất khó nhìn";
  // mẫu: file gốc KHTN Pocket). Không khai ⇒ dùng DOC_MAC_DINH (registry). Màu nhấn theo MÔN/phân môn: `mauDocMon` (registry).
  doc?: Partial<MauDoc>
  // Nền SÂN ĐẤU TRƯỜNG (Thử thách — ảnh ngang ~2,8:1, mặt sân ở ~60–100% chiều dọc). Không khai ⇒ sân là mảng màu của style (Tối giản).
  sanDau?: string
  // KHU HỌC TẬP kiểu game (Thùy 03/10: "5 ô = mỗi cái 1 lục địa trôi nổi trên bầu trời sao"): nền trời + ảnh ĐẢO cho từng ô (khoá = id ô ở hoctap/HocTapHS.tsx).
  // Không khai ⇒ khu Học tập là lưới ô thường (Tối giản…).
  // nenDoc: nền khổ dọc (điện thoại) · hop: hộp PHẦN NHÌN THẤY của từng đảo trong khung PNG (tỉ lệ) — có ⇒ đặt đảo theo tâm + bề rộng phần này (kit DESIGN.md).
  hocTap?: { nen: string; nenDoc?: string; dao: Record<string, string>; hop?: Record<string, { x0: number; y0: number; x1: number; y1: number }> }
  // MÀN CHINH PHỤC BK (leo tháp — hoctap/ChinhPhucHS.tsx): nền + tháp tổng + 8 mẫu tháp chủ đề + đế đảo + cầu. Không khai ⇒ vào thẳng menu leo tháp của game.
  chinhPhuc?: {
    nen: string; thapTong: string; thapCd: string[]
    /** hộp phần nhìn thấy của tháp trong khung PNG (khoá 'thap_tong' | 'thap_cd_<i>') — chân tháp = đáy hộp */
    hop: Record<string, { x0: number; y0: number; x1: number; y1: number }>
    /** đế đảo: tl = rộng/cao khung · mat = tâm mặt đá (tỉ lệ khung) — chân tháp đặt vào đây */
    deTong: { src: string; tl: number; mat: [number, number] }
    deCd: { src: string; tl: number; mat: [number, number] }
    /** cầu: a/b = 2 đầu cầu (tỉ lệ khung) — kéo dãn từ a tới b */
    cau: { src: string; tl: number; a: [number, number]; b: [number, number] }
  }
}
