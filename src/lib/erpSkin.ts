// VỎ ERP mượn GÓI STYLE của app Học sinh (Thùy 13/10: "dùng theme giống app học sinh" · "vẫn phải cho chọn hình nền").
// 5 lựa chọn = 1 MẶC ĐỊNH (giao diện ERP như cũ: nền sáng, thẻ trắng — `NHU_CU` dưới đây) + 4 style có tranh nền của app HS
// (Anime RPG · Khối vuông · Lo-fi chill · Đáng yêu — lấy từ `skin/registry.ts`). Mỗi nhân sự tự chọn style + hình nền của
// style đó + sáng/tối (nếu style có cả hai) — lưu `nhan_su.erp_giao_dien`. Chưa chọn gì ⇒ Mặc định.
// KHÔNG chép màu / đường dẫn hình sang đây: dùng lại `bienCss()` của app HS ⇒ mọi thứ trong vỏ ERP đọc biến `--sk-*`
// y như màn HS, style bên HS đổi màu / thay tranh / thêm style mới thì vỏ ERP tự theo.
// Phạm vi áp: THANH TRÊN CÙNG + TRANG CHÍNH + trang nhóm (các "màn ngoài" — STYLE-HS.md §2.6). Màn làm việc bên trong
// (bảng, form) GIỮ nền sáng như cũ: đó là chỗ đọc số cả ngày, không phủ tranh.
import { useMemo, type CSSProperties } from 'react'
import { SKINS, bienCss, cheDoThat, layHinhNen, type Skin } from '../screens/hocsinh/skin/registry'
import { useStore, type GiaoDienErp } from '../store/useStore'
import { useIsMobile } from '../hooks/useIsMobile'

// Style của vỏ ERP = style app HS, chỉ khác `id` không bị bó trong danh sách id của HS (ERP có thêm style riêng "mac_dinh").
export type SkinErp = Omit<Skin, 'id'> & { id: string }

// GIAO DIỆN "NHƯ CŨ" của ERP (Thùy 13/10: "không có giao diện như cũ à") — khai như MỘT style để đi chung đường với các style
// kia (không rẽ nhánh `if` trong màn): thanh trên trắng, nền trang xám nhạt #f5f5f7, thẻ trắng viền mảnh, màu nhấn chàm,
// font của ERP, không tranh nền, không nhân vật, icon box là emoji. Đây là NƠI ĐỊNH NGHĨA màu của style này (như 1 file
// trong skin/styles/) nên được gõ mã màu; các màn vẫn chỉ đọc `--sk-*`.
const NHU_CU: SkinErp = {
  id: 'mac_dinh', ten: 'Mặc định', moTa: 'Giao diện ERP như cũ: nền sáng, thẻ trắng', giongGi: 'ERP trước 13/10',
  font: 'inherit', fontHead: 'inherit', headCase: 'none', headTrack: '0',
  radius: '16px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
  cheDo: ['sang'],
  sang: {
    bg: '#ffffff', surface: '#ffffff', surface2: '#f1f5f9', ink: '#1e293b', muted: '#64748b', line: '#e2e8f0',
    acc: '#4f46e5', accInk: '#ffffff', badge: '#4f46e5', badgeInk: '#ffffff',
    cardBorder: '1px solid #e2e8f0', cardShadow: '0 1px 3px rgba(15,23,42,0.07)',
  },
  hinhNen: [{ id: 'tron', ten: 'Trơn', sang: '#f5f5f7' }],
}
// Style HS KHÔNG đưa vào bảng chọn của ERP: Tối giản — cũng là nền trơn, trùng vai với Mặc định (Thùy đếm 5 = 1 mặc định + 4 tranh).
const KHONG_DUA_VAO_ERP = new Set<string>(['toi_gian'])
export const SKINS_ERP: SkinErp[] = [NHU_CU, ...SKINS.filter((s) => !KHONG_DUA_VAO_ERP.has(s.id))]

// id lạ / đã bỏ / chưa chọn ⇒ Mặc định (phần tử đầu).
export const skinErp = (id: string | null | undefined): SkinErp => SKINS_ERP.find((s) => s.id === id) ?? SKINS_ERP[0]
export const cheDoErp = (skin: SkinErp, gd: GiaoDienErp): 'sang' | 'toi' => cheDoThat(skin as Skin, gd.che_do ?? skin.cheDo[0], false)

// Icon cho box nhóm — mượn icon Ô CHỨC NĂNG của style theo NGHĨA (mọi style đều có đủ các ô này: check:style-hs kiểm):
//   Việc của tôi = Nhiệm vụ · Vận hành = Trên lớp · Gamification = Thành tựu (cúp) · Học thuật = Tự luyện (sách)
//   Quản lý chất lượng = Luyện dạng yếu (ngắm trúng đích) · Core team = Rank (huy hiệu đội) · Dashboard = Thông tin học tập (bản đồ/số liệu).
function anhNhom(skin: SkinErp): Record<string, string | undefined> {
  const o = skin.anhO ?? {}
  return {
    viec: o.nhiem_vu,
    'Vận hành': o.giao_trinh,
    'Gamification': o.thanh_tuu,
    'Học thuật': o.tu_luyen,
    'Quản lý chất lượng': skin.anhNv?.icon.luyenYeu ?? o.luyen_yeu ?? o.de_thi_thu,
    'Core team': o.rank,
    'Dashboard': o.thong_tin,
  }
}

export function useSkinErp() {
  const gd = useStore((s) => s.erpGiaoDien)
  const doc = useIsMobile()
  return useMemo(() => {
    const skin = skinErp(gd.skin)
    const cd = cheDoErp(skin, gd)
    const nv = (cd === 'toi' ? skin.nhanVatToi : undefined) ?? skin.nhanVat
    return {
      skin, cd, gd,
      nenId: layHinhNen(skin as Skin, gd.nen).id,
      // Gắn lên khối gốc (thanh trên / trang chính): bên trong chỉ dùng `var(--sk-*)`.
      bien: bienCss(skin as Skin, cd, gd.nen, doc) as CSSProperties,
      anhNhom: anhNhom(skin),
      iconMatNa: !!skin.anhOMask,   // style đơn sắc: icon là mặt nạ, tô bằng màu chữ
      nhanVat: nv?.nam,
      nhanVatLoc: skin.nhanVatLoc,
      gach: skin.trangTri?.gach,
    }
  }, [gd, doc])
}
