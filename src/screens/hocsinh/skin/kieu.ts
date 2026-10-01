// ============================================================================
// HỢP ĐỒNG 1 STYLE (skin) của app HS — mọi style trong skin/styles/*.ts PHẢI khai đủ kiểu `Skin` này.
// Đọc design/STYLE-HS.md trước khi thêm style hoặc thêm tính năng/màn mới.
// ============================================================================

import type { BangMau3D } from './the3d/kieuMau'


// Thêm style mới: thêm id ở đây + file skin/styles/<id>.ts + đăng ký trong registry.ts + migration nới CHECK hs_giao_dien.skin.
export type SkinId = 'rpg'
export type CheDo = 'sang' | 'toi' | 'he_thong'
export type GiaoDien = { skin: SkinId; che_do: CheDo; hinh_nen: string }

export type Mau = {
  bg: string; surface: string; surface2: string; ink: string; muted: string; line: string
  acc: string; accInk: string; badge: string; badgeInk: string
  cardBorder: string; cardShadow: string
}
// sangDoc/toiDoc: bản cho màn DỌC (điện thoại) — tranh vẽ riêng khổ 9:16, không có thì dùng bản thường.
export type HinhNen = { id: string; ten: string; sang?: string; toi?: string; sangDoc?: string; toiDoc?: string }

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
  cardClip: string      // clip-path thẻ ('none' nếu không cắt góc)
  cardAccentLeft: string // viền trái nhấn — 'none' nếu không
  blur: string          // backdrop-filter của thẻ (skin nền ảnh cần mờ sau thẻ)
  cheDo: ('sang' | 'toi')[] // chế độ skin hỗ trợ; 1 phần tử = khoá chế độ đó
  sang?: Mau
  toi?: Mau
  hinhNen: HinhNen[]    // phần tử đầu = mặc định
  // id Ô CHỨC NĂNG → icon vẽ riêng của style. MỌI ô trong KHU/KHU_CAP2 (HocSinhApp) phải có — ô mới thêm mà thiếu icon
  // thì `npm run check:style-hs` báo, và app tạm hiện dauThayIcon.
  anhO?: Record<string, string>
  // Ô thiếu icon ⇒ hiện DẤU này (màu nhấn) thay vì emoji — emoji lẫn icon vẽ tay trông lệch (Thùy 28/09).
  dauThayIcon?: string
  trangTri?: { goc?: string; gach?: string } // hoa văn góc thẻ "Tiếp theo" + gạch phân cách dưới đầu trang
  anhBanner?: { lich?: string; kiemTraLai?: string } // ảnh vẽ riêng cho thẻ ca bổ trợ + banner bài kiểm tra lại
  // Thẻ "Việc tiếp theo": mặc định tô đặc màu nhấn. Skin nền tối sang (RPG) tô đặc thì thành mảng vàng thô — dùng kiểu riêng.
  theTiep?: { bg: string; ink: string; border: string }
  // Tấm mờ sau tên HS — skin nền ẢNH cần (tên đè lên tia sáng/lâu đài thì không đọc được). Có nenTen ⇒ bật luôn bóng chữ toàn trang.
  nenTen?: string
  // Nhân vật cắt nền (PNG trong suốt) đứng nửa trái Home khổ NGANG (PC/iPad) kèm bong bóng thoại — như ảnh gốc style
  // (RPG: design/bk-ui-src/Nền app HS cấp 3_11.png). Chọn theo giới tính HS; chưa biết ⇒ `nam`. Không có ⇒ Home ngang không vẽ nhân vật.
  nhanVat?: { nam: string; nu: string }
  // Bảng màu 3D của bản đồ phiêu lưu (thế giới · lục địa · chặng đường · màn đấu) — 1 bảng duy nhất cho cả cảnh (skin/the3d/kieuMau.ts).
  the3d?: BangMau3D
}
