// VỎ ERP mượn GÓI STYLE của app Học sinh (Thùy 13/10: "dùng theme giống app học sinh" · "vẫn phải cho chọn hình nền").
// 5 lựa chọn = đúng 5 style trong `skin/registry.ts` (Anime RPG · Khối vuông · Lo-fi chill · Đáng yêu · Tối giản); mỗi nhân sự
// tự chọn style + hình nền của style đó + sáng/tối (nếu style có cả hai) — lưu `nhan_su.erp_giao_dien`.
// KHÔNG chép màu / đường dẫn hình sang đây: dùng lại `bienCss()` của app HS ⇒ mọi thứ trong vỏ ERP đọc biến `--sk-*`
// y như màn HS, style bên HS đổi màu / thay tranh / thêm style mới thì vỏ ERP tự theo.
// Phạm vi áp: THANH TRÊN CÙNG + TRANG CHÍNH + trang nhóm (các "màn ngoài" — STYLE-HS.md §2.6). Màn làm việc bên trong
// (bảng, form) GIỮ nền sáng như cũ: đó là chỗ đọc số cả ngày, không phủ tranh.
import { useMemo, type CSSProperties } from 'react'
import { SKINS, SKIN_MAC_DINH, bienCss, cheDoThat, layHinhNen, type Skin } from '../screens/hocsinh/skin/registry'
import { useStore, type GiaoDienErp } from '../store/useStore'
import { useIsMobile } from '../hooks/useIsMobile'

export const skinErp = (id: string | null | undefined): Skin => SKINS.find((s) => s.id === id) ?? SKINS.find((s) => s.id === SKIN_MAC_DINH)!
export const cheDoErp = (skin: Skin, gd: GiaoDienErp): 'sang' | 'toi' => cheDoThat(skin, gd.che_do ?? skin.cheDo[0], false)

// Icon cho box nhóm — mượn icon Ô CHỨC NĂNG của style theo NGHĨA (mọi style đều có đủ các ô này: check:style-hs kiểm):
//   Việc của tôi = Nhiệm vụ · Vận hành = Trên lớp · Gamification = Thành tựu (cúp) · Học thuật = Tự luyện (sách)
//   Quản lý chất lượng = Luyện dạng yếu (ngắm trúng đích) · Core team = Rank (huy hiệu đội) · Dashboard = Thông tin học tập (bản đồ/số liệu).
function anhNhom(skin: Skin): Record<string, string | undefined> {
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
      nenId: layHinhNen(skin, gd.nen).id,
      // Gắn lên khối gốc (thanh trên / trang chính): bên trong chỉ dùng `var(--sk-*)`.
      bien: bienCss(skin, cd, gd.nen, doc) as CSSProperties,
      anhNhom: anhNhom(skin),
      iconMatNa: !!skin.anhOMask,   // style đơn sắc: icon là mặt nạ, tô bằng màu chữ
      nhanVat: nv?.nam,
      nhanVatLoc: skin.nhanVatLoc,
      gach: skin.trangTri?.gach,
    }
  }, [gd, doc])
}
