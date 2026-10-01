// ============================================================================
// STYLE "Tối giản" — Thùy 02/10: "chế độ tối giản, đơn sắc, không trang trí background gì cả — đơn giản nhất cho những đứa không thích rối mắt".
// Dựng lại từ bản thử 28/09 (đã xoá 29/09, commit 81fde9e2) nhưng gọn hơn: 1 nền TRƠN duy nhất, màu nhấn = màu chữ (đơn sắc), huy hiệu cũng đơn sắc,
// không blur, không hoa văn, không nhân vật. Icon ô = nét mảnh SVG dùng làm MẶT NẠ (anhOMask) ⇒ tô đúng màu chữ ở cả sáng lẫn tối.
// KHÔNG có bản đồ phiêu lưu (không khai the3d) ⇒ Tự luyện đi thẳng danh sách bài thường. Màu đúng/sai/cảnh báo vẫn giữ (MAU ngữ nghĩa).
// 7 em đã chọn toi_gian từ bản thử cũ (hs_giao_dien.skin, đo 02/10) tự về đúng style này.
// ============================================================================
import type { Skin } from '../kieu'

const A = '/bk-ui/hs/skin/toi_gian'
const BVP = "'Be Vietnam Pro', system-ui, sans-serif"

export const TOI_GIAN: Skin = {
  id: 'toi_gian', ten: 'Tối giản', moTa: 'Đơn sắc, nền trơn, không trang trí', giongGi: 'iOS · Notion',
  font: BVP, fontHead: BVP, headCase: 'none', headTrack: '-0.01em',
  radius: '14px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
  cheDo: ['sang', 'toi'],
  sang: { bg: '#f5f5f6', surface: '#ffffff', surface2: '#efeff1', ink: '#16161a', muted: '#6b6e78', line: '#e3e3e7', acc: '#16161a', accInk: '#ffffff', badge: '#16161a', badgeInk: '#ffffff', cardBorder: '1px solid #e6e6ea', cardShadow: 'none' },
  toi: { bg: '#0f0f12', surface: '#18181c', surface2: '#202025', ink: '#f1f1f3', muted: '#8e909a', line: '#2a2a31', acc: '#f1f1f3', accInk: '#0f0f12', badge: '#f1f1f3', badgeInk: '#0f0f12', cardBorder: '1px solid #26262c', cardShadow: 'none' },
  hinhNen: [{ id: 'mac_dinh', ten: 'Trơn', sang: '#f5f5f6', toi: '#0f0f12' }],
  anhOMask: true,
  anhO: {
    giao_trinh: `${A}/o_giao_trinh.svg`, et: `${A}/o_et.svg`, btvn: `${A}/o_btvn.svg`, tu_luyen: `${A}/o_tu_luyen.svg`,
    thong_tin: `${A}/o_thong_tin.svg`, so_tay: `${A}/o_so_tay.svg`, de_thi_thu: `${A}/o_de_thi_thu.svg`,
    bai_tap_giao: `${A}/o_bai_tap_giao.svg`, thanh_tuu: `${A}/o_thanh_tuu.svg`, xep_hang: `${A}/o_xep_hang.svg`,
    may_man: `${A}/o_may_man.svg`, vi_xu: `${A}/o_vi_xu.svg`, hoc_tu_dau: `${A}/o_hoc_tu_dau.svg`,
    the_gioi: `${A}/o_the_gioi.svg`, nhiem_vu: `${A}/o_nhiem_vu.svg`, rank: `${A}/o_rank.svg`,
  },
}
