// ============================================================================
// STYLE "Đáng yêu" — cảm hứng Chiikawa (Thùy 11/10: "làm giao diện phong cách chiikawa"; tên trong app Thùy chốt "Đáng yêu", làm SONG SONG với Thị trấn;
// 13/10: "dựng Đáng yêu"). Tên làm việc lúc đặt hình là "Nhỏ xinh" ⇒ file đơn / thư mục ảnh gốc / tiền tố `nx_` còn mang tên đó.
// Đơn hình + luật ĐƯỢC/CẤM + bảng kiểm hàng: design/DON-HANG-STYLE-NHO-XINH.md (đơn bổ sung: DON-HANG-NHO-XINH-BO-SUNG.md).
// Ảnh gốc ChatGPT (ngoài git, 183 MB): design/bk-ui-src/nho-xinh/ · nén + đo + sinh dangYeuHocTap.ts / dangYeuSong.ts: node scripts/dang-yeu-hinh.mjs.
// File cho app: public/bk-ui/hs/skin/dang_yeu/ — bg_<nền>_<ngang|doc>.jpg · o_<ô>.png · b_*.png · divider.png · nv_<nam|nu>.webp · song/.
// Style SÁNG duy nhất · giao diện kiểu TRANH VẼ TAY: thẻ trắng sữa VIỀN NÂU DÀY bo tròn lớn, bóng cứng; pastel; linh vật tròn (cánh cụt · cừu) đổi tư thế.
// Giữ giọng game "đánh quái" (bé tí đi đánh quái to tròn) với vài câu đổi cho dễ thương — LOI_DANG_YEU.
// Chưa có: boss riêng giáo viên · bộ khung màn trong (vẽ bằng code) · viền thẻ RUN TAY (khung_the.png / khung_nut.png đã nén sẵn, thẻ đang viền CSS) ·
// hoa văn góc thẻ (hình "góc" về là bụi cây đứng — xoay 180° ở góc đối diện thì ngược, nên không khai `trangTri.goc`).
// ============================================================================
import type { Skin } from '../kieu'
import { LOI_DANG_YEU } from '../loi'
import { DANG_YEU_3D } from '../the3d/bangMauDangYeu'
import { HOC_TAP_DANG_YEU, CHINH_PHUC_DANG_YEU } from './dangYeuHocTap'
import { BAN_DO_DANG_YEU, QUAI_DANG_YEU } from './dangYeuBanDo2d'
import { LINH_VAT_DANG_YEU } from './dangYeuSong'

const A = '/bk-ui/hs/skin/dang_yeu'
const BALOO = "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"
// Mali: chữ tròn hơi vẽ tay, có bộ tiếng Việt (khai ở hs.html) — chỉ dùng cho TIÊU ĐỀ; chữ thường là Baloo 2 cho dễ đọc.
const MALI = "'Mali', 'Baloo 2', system-ui, sans-serif"
// Tranh pastel sáng, chữ nâu ⇒ chỉ phủ kem rất nhẹ ở trên (tiêu đề) và đáy.
const PHU = 'linear-gradient(180deg, rgba(255,253,248,0.38) 0%, rgba(255,253,248,0) 30%, rgba(255,253,248,0) 72%, rgba(255,253,248,0.25) 100%)'
const BG = A + '/bg_' // 6 tranh: bg_<dong_co|pho_nho|hoang_hon>_<ngang|doc>.jpg
const tranh = (ten: string, kho: 'ngang' | 'doc', lot: string) => `${PHU}, url(${BG}${ten}_${kho}.jpg) center top / cover no-repeat, ${lot}`
const hinhNen = (id: string, ten: string, lot: string) => ({ id, ten, sang: tranh(id, 'ngang', lot), sangDoc: tranh(id, 'doc', lot) })

export const DANG_YEU: Skin = {
  id: 'dang_yeu', ten: 'Đáng yêu', moTa: 'Các bé tròn trên đồng cỏ hoa', giongGi: 'Chiikawa · Sumikko',
  font: BALOO, fontHead: MALI, headCase: 'none', headTrack: '0.01em',
  radius: '22px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
  loi: LOI_DANG_YEU,
  cheDo: ['sang'],
  // Thẻ trắng sữa viền nâu (nâu = màu nét vẽ). acc = hồng ĐẬM (chữ trắng trên nút ≈ 4,6:1 — hồng dâu #f07fa0 chỉ ~2,6:1, không đọc được).
  sang: {
    bg: '#e4f1cf', nenTrong: '#fff8ee', surface: 'rgba(255,253,248,0.96)', surface2: 'rgba(255,179,199,0.28)', ink: '#4a342a', muted: '#8a7468', line: 'rgba(74,52,42,0.25)',
    acc: '#c93a6e', accInk: '#ffffff', badge: '#e8506e', badgeInk: '#ffffff',
    cardBorder: '2.5px solid #4a342a', cardShadow: '0 4px 0 rgba(74,52,42,0.18)',
  },
  // Đồng cỏ hoa lên ĐẦU = mặc định (đúng ảnh không khí Thùy gửi).
  hinhNen: [hinhNen('dong_co', 'Đồng cỏ hoa', '#cfe6b0'), hinhNen('pho_nho', 'Phố nhỏ', '#bfe3f2'), hinhNen('hoang_hon', 'Hoàng hôn', '#f8c6c0')],
  // Mỗi ô 1 đồ vật vẽ tròn mập, viền nâu. Chưa vẽ riêng: Tự luyện riêng (TSA) dùng chung bút chì + tẩy.
  anhO: {
    giao_trinh: `${A}/o_tren_lop.png`, et: `${A}/o_et.png`, btvn: `${A}/o_btvn.png`, tu_luyen: `${A}/o_tu_luyen.png`,
    thong_tin: `${A}/o_thong_tin.png`, so_tay: `${A}/o_so_tay.png`, de_thi_thu: `${A}/o_thi_thu.png`,
    bai_tap_giao: `${A}/o_bai_tap_giao.png`, thanh_tuu: `${A}/o_cup.png`, xep_hang: `${A}/o_xep_hang.png`,
    may_man: `${A}/o_may_man.png`, vi_xu: `${A}/o_vi_xu.png`, hoc_tu_dau: `${A}/o_hoc_tu_dau.png`,
    the_gioi: `${A}/o_the_gioi.png`, nhiem_vu: `${A}/o_nhiem_vu.png`, rank: `${A}/o_rank.png`,
    thu_vien: `${A}/o_thu_vien.png`, tro_choi: `${A}/o_tro_choi.png`, tu_luyen_rieng: `${A}/o_tu_luyen.png`,
    // 5 ô khu HỌC TẬP (Đơn N3 #02–#06): bản đồ · bình tưới · 2 lá cờ · ngọn tháp · vương miện
    hoc_chu_de: `${A}/o_hoc_chu_de.png`, luyen_yeu: `${A}/o_luyen_yeu.png`, dau_truong: `${A}/o_dau_truong.png`, chinh_phuc: `${A}/o_chinh_phuc.png`, giai_vo_dich: `${A}/o_giai_vo_dich.png`,
  },
  dauThayIcon: '✿',
  trangTri: { gach: `${A}/divider.png` },
  anhBanner: { lich: `${A}/b_lich.png`, kiemTraLai: `${A}/b_kiem_tra_lai.png` },
  // Thẻ "Việc tiếp theo" / ca bổ trợ = tấm VÀNG BƠ viền nâu.
  theTiep: { bg: '#ffe9a8', ink: '#4a342a', border: '2.5px solid #4a342a' },
  // Tấm sau tên HS (góc trên trái khổ ngang) = tấm trắng sữa. Style sáng ⇒ không bật bóng chữ tối toàn trang.
  nenTen: 'rgba(255,253,248,0.92)',
  // Linh vật (KHÔNG có người): nam = cánh cụt con + cặp chéo + bút chì mập · nữ = cừu bông + nơ + quyển vở. Hình tĩnh = cỏ + thân, cùng khung với 9 tư thế.
  nhanVat: { nam: `${A}/nv_nam.webp`, nu: `${A}/nv_nu.webp` },
  nhanVatLoc: 'none',
  // Linh vật tròn (thân chỉ chiếm ~80% khung) ⇒ thấp hơn người đứng một chút, bám đáy khung nhìn khi cuộn, bong bóng thoại ngay trên đầu.
  nhanVatBoCuc: { cot: 'minmax(280px, 32%)', cao: 'min(58vh, 560px)', lech: '3%', bong: 0.9, dinh: true },
  homeSong: { linhVat: LINH_VAT_DANG_YEU },
  // ── Khu Học tập + phiêu lưu (Đơn N3, N4) ──
  hocTap: HOC_TAP_DANG_YEU,
  chinhPhuc: CHINH_PHUC_DANG_YEU,
  sanDau: `${A}/dau_truong/nen_san_dau.jpg`,
  the3d: DANG_YEU_3D,
  banDo2d: BAN_DO_DANG_YEU,
  quai2d: QUAI_DANG_YEU,
  game: { nenMenu: `${A}/bg_dong_co_ngang.jpg`, nenDau: `${A}/hoctap/nen_ngang.jpg`,
    icon: { dau: `${A}/o_dau_truong.png`, giai: `${A}/o_giai_vo_dich.png`, thap: `${A}/o_chinh_phuc.png`, noi_tu: `${A}/o_so_tay.png`, goc: `${A}/o_nhiem_vu.png` } },
}
