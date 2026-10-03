// ============================================================================
// STYLE "Anime RPG" — gói trọn: màu · font · dáng thẻ · tranh nền · icon ô · icon banner · trang trí.
// Nền + nhân vật bản CHIBI (02/10): design/bk-ui-src/New_anime/ ⇒ bg_*_chibi_*.jpg · nv_*_chibi.png. Ảnh anime cũ: design/bk-ui-src/Nền app HS cấp 3_*.png (ảnh 37 = nền dọc Lâu đài) · ảnh toàn cảnh chuẩn:
// design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png. File cho app (đã nén): public/bk-ui/hs/skin/rpg/.
// Quy ước tên file: bg_<nền>_ngang|doc*.jpg · o_<ô>.png · b_<banner>.png · corner.png/divider.png. Xem design/STYLE-HS.md.
// ============================================================================
import type { Skin } from '../kieu'
import { RPG_3D } from '../the3d/bangMauRpg'

const A = '/bk-ui/hs/skin/rpg'
const BVP = "'Be Vietnam Pro', system-ui, sans-serif"
// Thùy 29/09: lớp phủ cũ (tối đặc từ 48% xuống) làm nửa dưới đen kịt, không giống ảnh gốc ⇒ chỉ phủ nhẹ phần đáy cho chữ
// trên thẻ vẫn đọc được; thẻ đã có nền trong mờ + blur riêng.
const nen = (f: string) =>
  `linear-gradient(180deg, rgba(20,26,51,0) 0%, rgba(20,26,51,0) 45%, rgba(20,26,51,0.35) 100%), url(${A}/${f}.jpg) center top / cover no-repeat, #141a33`
// Thùy 29/09 (tối): bản NGANG trên PC trải cả màn ⇒ đúng mảng lâu đài + đèn sáng nhất, "chói, khó nhìn". Ảnh gốc
// (Nền app HS cấp 3_11.png) tối hơn nhiều: trên còn thấy lâu đài, dưới xanh đêm đậm ⇒ phủ tối cả tấm + đậm dần xuống đáy.
const nenNgang = (f: string) =>
  `linear-gradient(180deg, rgba(20,26,51,0.12) 0%, rgba(20,26,51,0.3) 40%, rgba(16,20,42,0.72) 100%), url(${A}/${f}.jpg) center top / cover no-repeat, #141a33`

export const RPG: Skin = {
  id: 'rpg', ten: 'Anime RPG', moTa: 'Trời sao, đảo nổi, viền vàng', giongGi: 'Genshin · Star Rail',
  font: BVP, fontHead: "'Philosopher', 'Be Vietnam Pro', serif", headCase: 'none', headTrack: '0.01em',
  radius: '8px', cardClip: 'none', cardAccentLeft: 'none', blur: 'blur(6px)',
  cheDo: ['toi'],
  toi: { bg: '#141a33', surface: 'rgba(20,26,51,0.72)', surface2: 'rgba(233,199,123,0.12)', ink: '#f3ead0', muted: '#bfb08a', line: 'rgba(233,199,123,0.3)', acc: '#e9c77b', accInk: '#141a33', badge: '#e9c77b', badgeInk: '#141a33', cardBorder: '1px solid rgba(233,199,123,0.35)', cardShadow: 'none' },
  // Tranh vẽ riêng 2 khổ: ngang 1672×941 cho iPad/máy tính, dọc 940×1672 cho điện thoại.
  hinhNen: [
    // Lâu đài lên ĐẦU = mặc định (Thùy 29/09: dùng ảnh 37 — bản dọc sáng hơn, giống ảnh gốc). Id 'bau_troi' giữ — HS đã lưu.
    { id: 'lau_dai', ten: 'Lâu đài', toi: nenNgang('bg_lau_dai_chibi_ngang'), toiDoc: nen('bg_lau_dai_chibi_doc') },
    { id: 'bau_troi', ten: 'Đảo trời', toi: nenNgang('bg_dao_troi_chibi_ngang'), toiDoc: nen('bg_dao_troi_chibi_doc') },
    { id: 'dem_sao', ten: 'Đêm sao', toi: 'radial-gradient(1.5px 1.5px at 20% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 70% 30%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 40% 60%, #e9c77b 50%, transparent 51%), radial-gradient(1px 1px at 85% 75%, #fff 50%, transparent 51%), radial-gradient(90% 60% at 50% 0%, #2c3a66 0%, #141a33 70%), #141a33' },
  ],
  // Mỗi ô 1 hình khác nhau. Khối 9 có Thành tựu, khối 10–12 có Bảng xếp hạng (không bao giờ cùng lưới) ⇒ dùng chung cúp.
  anhO: {
    giao_trinh: `${A}/o_tren_lop.png`, et: `${A}/o_et.png`, btvn: `${A}/o_btvn.png`, tu_luyen: `${A}/o_tu_luyen.png`,
    thong_tin: `${A}/o_thong_tin.png`, so_tay: `${A}/o_so_tay.png`, de_thi_thu: `${A}/o_thi_thu.png`,
    bai_tap_giao: `${A}/o_bai_tap_giao.png`, thanh_tuu: `${A}/o_cup.png`, xep_hang: `${A}/o_cup.png`,
    may_man: `${A}/o_ruong.png`, vi_xu: `${A}/o_vi_xu.png`, hoc_tu_dau: `${A}/o_hoc_tu_dau.png`,
    the_gioi: `${A}/o_pha_le.png`, // TẠM (cầu pha lê) — thay bằng tg_o_the_gioi khi kit Đơn 5 về
    // 01/10 — 2 ô mới trên màn chính, hình lấy từ kit gamification cùng nét RPG (chưa đặt vẽ riêng): sổ nhiệm vụ (nv_tuan) · khiên Hero.
    // Ô Rank thường hiện BIỂU TƯỢNG BẬC của chính em (HomeCard.anh) — o_rank chỉ là hình dự phòng lúc chưa tải xong.
    nhiem_vu: `${A}/o_nhiem_vu.png`, rank: `${A}/o_rank.png`,
    // 03/10 — TẠM, chờ vẽ riêng: Thư viện BK dùng cuộn thư (hình của ô 'Bài tập được giao' đã bỏ) · ô Tự luyện riêng (TSA khối 12) dùng hình Tự luyện.
    thu_vien: `${A}/o_bai_tap_giao.png`, tu_luyen_rieng: `${A}/o_tu_luyen.png`,
    // 03/10 — TẠM, chờ đơn ChatGPT vẽ riêng: 5 ô khu HỌC TẬP (spec-che-do-game §7) mượn hình có sẵn.
    hoc_chu_de: `${A}/o_pha_le.png`, luyen_yeu: `${A}/o_tu_luyen.png`, dau_truong: `${A}/o_rank.png`, chinh_phuc: `${A}/o_thi_thu.png`, giai_vo_dich: `${A}/o_cup.png`,
  },
  dauThayIcon: '✦',
  trangTri: { goc: `${A}/corner.png`, gach: `${A}/divider.png` },
  // Thẻ câu hỏi màn đấu = "bảng phép" kiểu Genshin/Star Rail: nền đêm đặc, viền vàng KÉP (vàng ngoài · rãnh tối · chỉ vàng mờ trong),
  // góc hoa văn; chữ Baloo 2 (tròn, đậm, có dấu tiếng Việt — gần font chữ tròn của Genshin) thay Be Vietnam Pro (chữ app văn phòng);
  // đáp án = phiến đá có gờ dưới, bấm lún xuống (cảm giác nút game kiểu Prodigy/Brawl).
  tran: {
    font: "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif",
    nen: 'radial-gradient(120% 80% at 50% 0%, rgba(44,58,112,0.97) 0%, rgba(22,28,60,0.98) 60%, rgba(14,18,40,0.98) 100%)',
    vien: '0 0 0 1.5px rgba(233,199,123,0.85), inset 0 0 0 5px rgba(14,18,40,0.9), inset 0 0 0 6px rgba(233,199,123,0.35), 0 10px 28px rgba(0,0,0,0.5)',
    phien: 'linear-gradient(180deg, rgba(64,78,140,0.95) 0%, rgba(40,50,100,0.95) 100%)',
    phienDay: 'rgba(10,12,32,0.95)',
  },
  anhBanner: { lich: `${A}/b_lich.png`, kiemTraLai: `${A}/b_kiem_tra_lai.png` },
  theTiep: { bg: 'linear-gradient(100deg, rgba(233,199,123,0.26) 0%, rgba(20,26,51,0.78) 70%)', ink: '#f3ead0', border: '1px solid rgba(233,199,123,0.7)' },
  nenTen: 'rgba(20,26,51,0.6)',
  the3d: RPG_3D,
  // Sân Đấu trường (Thùy 02/10, kit design/bk-ui-src/AppHS/Animation/chien_dau/ — nén bởi scripts/anime-chien-dau-2d.mjs)
  sanDau: '/bk-ui/hs/skin/rpg/dau_truong/nen_san_dau.jpg',
  // Khu Học tập: 5 đảo lơ lửng trên trời sao — TẠM mượn mảnh lục địa của bản đồ thế giới (Đơn 14 Kit B đặt vẽ 5 đảo riêng).
  hocTap: {
    nen: 'radial-gradient(1.5px 1.5px at 12% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 32% 8%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 58% 22%, #e9c77b 50%, transparent 51%), radial-gradient(1px 1px at 78% 12%, #fff 50%, transparent 51%), radial-gradient(1.4px 1.4px at 90% 38%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 8% 62%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 46% 70%, #e9c77b 50%, transparent 51%), radial-gradient(1px 1px at 70% 84%, #fff 50%, transparent 51%), radial-gradient(60% 45% at 30% 30%, rgba(124,92,214,.35), transparent 70%), radial-gradient(55% 40% at 75% 70%, rgba(64,120,214,.28), transparent 70%), radial-gradient(90% 70% at 50% 0%, #2c3a66 0%, #141a33 70%), #0e1228',
    dao: {
      hoc_chu_de: '/bk-ui/hs/skin/rpg/phieuluu2d/luc_dia_v2_rung.webp', luyen_yeu: '/bk-ui/hs/skin/rpg/phieuluu2d/luc_dia_v2_thanh_co.webp',
      dau_truong: '/bk-ui/hs/skin/rpg/phieuluu2d/luc_dia_v2_nui_lua.webp', chinh_phuc: '/bk-ui/hs/skin/rpg/phieuluu2d/luc_dia_v2_troi_sao.webp',
      giai_vo_dich: '/bk-ui/hs/skin/rpg/phieuluu2d/luc_dia_v2_sa_mac.webp',
    },
  },
  // 02/10 (Thùy): bản CHIBI dễ thương thay bản anime cũ — nam + mèo đen · nữ + cú trắng, PNG trong suốt cắt sát, cao 900px.
  // Ảnh gốc design/bk-ui-src/New_anime/. Bản cũ nv_nam.png / nv_nu.png GIỮ trên đĩa (PWA cũ còn gọi) — dọn sau ≥1 tuần, hỏi Thùy.
  // 02/10 (Thùy): đây là 2 NPC DẪN TRUYỆN (bé trai + mèo đen · bé gái + cú trắng) — Home nói chuyện, tutorial, người dẫn ở Đấu trường. NHÂN VẬT CHÍNH của học sinh là 2 nhà thám hiểm áo choàng xanh (bộ chạy 2D: skin/heroChay.ts).
  nhanVat: { nam: `${A}/nv_nam_chibi.png`, nu: `${A}/nv_nu_chibi.png` },
  // Boss mẫu (01/10): chân dung Thùy vẽ chibi — ChatGPT, ảnh gốc design/bk-ui-src/boss/thuy/ (02..08), nén 1024px (chân dung 512px).
  boss: {
    boss_thuy: {
      ten: 'Thùy', cao: 2.9, dang: 'anh',
      mo3d: { da: '#efc197', toc: '#17141c', kinh: true, ao: '#2a2143', aoLot: '#b88f4a', vien: '#e9c77b', ngoc: '#7a4dff', hao: '#9b6bff', haoGian: '#ffc94d' },
      dung: `${A}/boss_thuy_dung.png`, noi: `${A}/boss_thuy_noi.png`, chieu: `${A}/boss_thuy_chieu.png`,
      trung: `${A}/boss_thuy_trung.png`, gian: `${A}/boss_thuy_gian.png`, ha: `${A}/boss_thuy_ha.png`, chandung: `${A}/boss_thuy_chandung.png`,
    },
  },
}
