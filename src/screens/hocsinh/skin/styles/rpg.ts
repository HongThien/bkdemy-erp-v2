// ============================================================================
// STYLE "Anime RPG" — gói trọn: màu · font · dáng thẻ · tranh nền · icon ô · icon banner · trang trí.
// Ảnh gốc ChatGPT: design/bk-ui-src/Nền app HS cấp 3_*.png (ảnh 37 = nền dọc Lâu đài) · ảnh toàn cảnh chuẩn:
// design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png. File cho app (đã nén): public/bk-ui/hs/skin/rpg/.
// Quy ước tên file: bg_<nền>_ngang|doc*.jpg · o_<ô>.png · b_<banner>.png · corner.png/divider.png. Xem design/STYLE-HS.md.
// ============================================================================
import type { Skin } from '../kieu'

const A = '/bk-ui/hs/skin/rpg'
const BVP = "'Be Vietnam Pro', system-ui, sans-serif"
// Thùy 29/09: lớp phủ cũ (tối đặc từ 48% xuống) làm nửa dưới đen kịt, không giống ảnh gốc ⇒ chỉ phủ nhẹ phần đáy cho chữ
// trên thẻ vẫn đọc được; thẻ đã có nền trong mờ + blur riêng.
const nen = (f: string) =>
  `linear-gradient(180deg, rgba(20,26,51,0) 0%, rgba(20,26,51,0) 45%, rgba(20,26,51,0.35) 100%), url(${A}/${f}.jpg) center top / cover no-repeat, #141a33`

export const RPG: Skin = {
  id: 'rpg', ten: 'Anime RPG', moTa: 'Trời sao, đảo nổi, viền vàng', giongGi: 'Genshin · Star Rail',
  font: BVP, fontHead: "'Philosopher', 'Be Vietnam Pro', serif", headCase: 'none', headTrack: '0.01em',
  radius: '8px', cardClip: 'none', cardAccentLeft: 'none', blur: 'blur(6px)',
  cheDo: ['toi'],
  toi: { bg: '#141a33', surface: 'rgba(20,26,51,0.72)', surface2: 'rgba(233,199,123,0.12)', ink: '#f3ead0', muted: '#bfb08a', line: 'rgba(233,199,123,0.3)', acc: '#e9c77b', accInk: '#141a33', badge: '#e9c77b', badgeInk: '#141a33', cardBorder: '1px solid rgba(233,199,123,0.35)', cardShadow: 'none' },
  // Tranh vẽ riêng 2 khổ: ngang 1672×941 cho iPad/máy tính, dọc 940×1672 cho điện thoại.
  hinhNen: [
    // Lâu đài lên ĐẦU = mặc định (Thùy 29/09: dùng ảnh 37 — bản dọc sáng hơn, giống ảnh gốc). Id 'bau_troi' giữ — HS đã lưu.
    { id: 'lau_dai', ten: 'Lâu đài', toi: nen('bg_lau_dai_ngang'), toiDoc: nen('bg_lau_dai_doc_sang') },
    { id: 'bau_troi', ten: 'Đảo trời', toi: nen('bg_dao_troi_ngang'), toiDoc: nen('bg_dao_troi_doc') },
    { id: 'dem_sao', ten: 'Đêm sao', toi: 'radial-gradient(1.5px 1.5px at 20% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 70% 30%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 40% 60%, #e9c77b 50%, transparent 51%), radial-gradient(1px 1px at 85% 75%, #fff 50%, transparent 51%), radial-gradient(90% 60% at 50% 0%, #2c3a66 0%, #141a33 70%), #141a33' },
  ],
  // Mỗi ô 1 hình khác nhau. Khối 9 có Thành tựu, khối 10–12 có Bảng xếp hạng (không bao giờ cùng lưới) ⇒ dùng chung cúp.
  anhO: {
    giao_trinh: `${A}/o_tren_lop.png`, et: `${A}/o_et.png`, btvn: `${A}/o_btvn.png`, tu_luyen: `${A}/o_tu_luyen.png`,
    thong_tin: `${A}/o_thong_tin.png`, so_tay: `${A}/o_so_tay.png`, de_thi_thu: `${A}/o_thi_thu.png`,
    bai_tap_giao: `${A}/o_bai_tap_giao.png`, thanh_tuu: `${A}/o_cup.png`, xep_hang: `${A}/o_cup.png`,
    may_man: `${A}/o_ruong.png`, vi_xu: `${A}/o_vi_xu.png`, hoc_tu_dau: `${A}/o_hoc_tu_dau.png`,
    the_gioi: `${A}/o_pha_le.png`, // TẠM (cầu pha lê) — thay bằng tg_o_the_gioi khi kit Đơn 5 về
  },
  dauThayIcon: '✦',
  trangTri: { goc: `${A}/corner.png`, gach: `${A}/divider.png` },
  anhBanner: { lich: `${A}/b_lich.png`, kiemTraLai: `${A}/b_kiem_tra_lai.png` },
  theTiep: { bg: 'linear-gradient(100deg, rgba(233,199,123,0.26) 0%, rgba(20,26,51,0.78) 70%)', ink: '#f3ead0', border: '1px solid rgba(233,199,123,0.7)' },
  nenTen: 'rgba(20,26,51,0.6)',
}
