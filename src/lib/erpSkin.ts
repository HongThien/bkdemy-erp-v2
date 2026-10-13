// VỎ ERP mượn GÓI STYLE của app Học sinh (Thùy 13/10: "dùng theme giống app học sinh") — style Anime RPG:
// trời đêm · viền vàng · icon vẽ tay. KHÔNG chép màu / đường dẫn hình sang đây: đọc thẳng `RPG` (skin/styles/rpg.ts)
// nên style bên HS đổi màu, thay tranh, đổi tên file (thêm tên mới, giữ file cũ — STYLE-HS.md §2) thì vỏ ERP tự theo.
// Phạm vi áp: THANH TRÊN CÙNG + TRANG CHÍNH + trang nhóm (các "màn ngoài" — STYLE-HS.md §2.6). Màn làm việc
// bên trong (bảng, form) GIỮ nền sáng như cũ: đó là chỗ đọc số cả ngày, không phủ tranh.
import type { CSSProperties } from 'react'
import type { Khung9 } from '../screens/hocsinh/skin/kieu'
import { RPG } from '../screens/hocsinh/skin/styles/rpg'

const m = RPG.toi!
const o = RPG.anhO ?? {}
const nen = RPG.hinhNen[0]

export const SKIN_ERP = {
  font: RPG.font,
  fontHead: RPG.fontHead,
  nenNgang: nen.toi ?? m.bg,
  nenDoc: nen.toiDoc ?? nen.toi ?? m.bg,
  nhanVat: RPG.nhanVat?.nam,
  khungMuc: RPG.anhBxh?.khungChon,
  gach: RPG.trangTri?.gach,
}

// Biến màu gắn lên khối gốc (thanh trên / trang chính) — bên trong chỉ dùng `var(--e-*)`, hover vẫn viết được bằng class.
export const BIEN_ERP = {
  '--e-bg': m.bg, '--e-surface': m.surface, '--e-surface2': m.surface2, '--e-ink': m.ink, '--e-muted': m.muted,
  '--e-line': m.line, '--e-acc': m.acc, '--e-acc-ink': m.accInk, '--e-font': RPG.font, '--e-font-head': RPG.fontHead,
} as CSSProperties

// Icon VẼ TAY cho box nhóm — mượn hình có sẵn của style theo NGHĨA (không đặt vẽ mới):
//   Việc của tôi = sổ nhiệm vụ · Vận hành = bảng lớp học · Gamification = cúp · Học thuật = sách phép (kho tri thức)
//   Quản lý chất lượng = kiếm + bia ngắm (đo có trúng đích không) · Core team = huy hiệu khiên (đội nòng cốt)
//   Dashboard = bản đồ + la bàn (nhìn toàn cảnh để quyết).
export const ANH_NHOM: Record<string, string | undefined> = {
  viec: o.nhiem_vu,
  'Vận hành': o.giao_trinh,
  'Gamification': o.thanh_tuu,
  'Học thuật': o.tu_luyen,
  'Quản lý chất lượng': RPG.anhNv?.icon.luyenYeu ?? o.de_thi_thu,
  'Core team': o.rank,
  'Dashboard': o.thong_tin,
}

// Khung 9 mảnh (viền vàng vẽ tay) cho ô mục con — cùng cách `kieuKhung` của màn Bảng xếp hạng HS.
export function kieuKhung9(k: Khung9 | undefined, cao: number): CSSProperties {
  if (!k) return { border: `1px solid ${m.line}`, borderRadius: 10 }
  const vien = Math.round((k.cat * cao) / k.h)
  return { borderStyle: 'solid', borderWidth: vien, borderImage: `url(${k.src}) ${k.cat} fill / ${vien}px / 0 stretch` }
}
