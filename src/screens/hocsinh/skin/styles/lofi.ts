// ============================================================================
// STYLE "Lo-fi chill" — Thùy 09/10: "giao diện mới: lofi chill … cho những học sinh thích kiểu học 1 mình, chill chill dễ chịu"; 12/10: "dựng code đi".
// Gói trọn: màu sáng + tối · font · dáng thẻ GIẤY · tranh nền · icon ô · banner · trang trí · góc học (người + bàn + mèo) · màn chính "sống".
// Đơn hình + luật ĐƯỢC/CẤM + bảng kiểm hàng: design/DON-HANG-STYLE-LOFI.md (đơn bổ sung: DON-HANG-LOFI-BO-SUNG.md).
// Ảnh gốc ChatGPT (ngoài git, 326 MB): design/bk-ui-src/lofi/ · nén + đo + sinh lofiHocTap.ts / lofiSong.ts: node scripts/lofi-hinh.mjs.
// File cho app: public/bk-ui/hs/skin/lofi/ — bg_<nền>_<chieu|dem>_<ngang|doc>.jpg · o_<ô>.png · b_*.png · corner/divider.png · nv_<nam|nu>[_dem].webp · song/.
// Style ẢNH đầu tiên có CẢ 2 chế độ — cùng một cảnh, khác giờ: SÁNG = nắng chiều · TỐI = đêm, đèn bàn (Thùy chốt 09/10). "Theo máy" ⇒ điện thoại
// bật nền tối thì phòng sang đêm. Lời chữ riêng LOI_LOFI: giữ cấu trúc trận, đổi ẩn dụ "đánh quái" ⇒ "gỡ rối cho bé tinh linh".
// Chưa có: boss riêng giáo viên · bộ khung màn trong (BXH / Nhiệm vụ / Thành tựu — vẽ bằng code) · mưa rơi trên kính cho nền Ngày mưa · nhạc nền.
// ============================================================================
import type { Skin } from '../kieu'
import { LOI_LOFI } from '../loi'
import { LOFI_3D } from '../the3d/bangMauLofi'
import { HOC_TAP_LOFI, CHINH_PHUC_LOFI } from './lofiHocTap'
import { BAN_DO_LOFI, QUAI_LOFI } from './lofiBanDo2d'
import { SONG_LOFI } from './lofiSong'

const A = '/bk-ui/hs/skin/lofi'
// Nunito: tròn, mềm, đủ dấu tiếng Việt (khai ở hs.html). Tiêu đề cùng họ chữ, chỉ đậm hơn — style này không "hét".
const NUNITO = "'Nunito', 'Be Vietnam Pro', system-ui, sans-serif"
// Lớp phủ trên tranh: CHIỀU chữ nâu ⇒ phủ kem nhẹ ở 1/4 trên (tiêu đề đè lên cửa sổ / mây) + đáy; ĐÊM chữ kem ⇒ phủ chàm đậm dần xuống đáy.
const PHU_SANG = 'linear-gradient(180deg, rgba(255,246,232,0.58) 0%, rgba(255,246,232,0.4) 24%, rgba(255,246,232,0) 52%, rgba(255,246,232,0.28) 100%)'
const PHU_TOI = 'linear-gradient(180deg, rgba(24,22,48,0.28) 0%, rgba(24,22,48,0.12) 30%, rgba(24,22,48,0.5) 100%)'
const BG = A + '/bg_' // 12 tranh: bg_<cua_so|mua|san_thuong>_<chieu|dem>_<ngang|doc>.jpg
const tranh = (ten: string, gio: 'chieu' | 'dem', kho: 'ngang' | 'doc') =>
  `${gio === 'dem' ? PHU_TOI : PHU_SANG}, url(${BG}${ten}_${gio}_${kho}.jpg) center top / cover no-repeat, ${gio === 'dem' ? '#1d1b3a' : '#f4ead9'}`
const hinhNen = (id: string, ten: string) =>
  ({ id, ten, sang: tranh(id, 'chieu', 'ngang'), sangDoc: tranh(id, 'chieu', 'doc'), toi: tranh(id, 'dem', 'ngang'), toiDoc: tranh(id, 'dem', 'doc') })

export const LOFI: Skin = {
  id: 'lofi', ten: 'Lo-fi chill', moTa: 'Góc học yên tĩnh, nắng chiều, đèn đêm', giongGi: 'Lofi Girl · study with me',
  font: NUNITO, fontHead: NUNITO, headCase: 'none', headTrack: '0',
  radius: '16px', cardClip: 'none', cardAccentLeft: 'none', blur: 'blur(10px)',
  loi: LOI_LOFI,
  cheDo: ['sang', 'toi'],
  // Thẻ GIẤY kem, chữ nâu cà phê. acc = cam đất ĐẬM (chữ kem trên nút ≈ 4,6:1); badge cam đất — không đỏ chói.
  sang: {
    bg: '#f4ead9', nenTrong: '#f6efe3', surface: 'rgba(255,250,242,0.9)', surface2: 'rgba(214,190,160,0.24)', ink: '#3a2e28', muted: '#76655a', line: 'rgba(90,64,44,0.18)',
    acc: '#b4532e', accInk: '#fffaf2', badge: '#c25a36', badgeInk: '#fffaf2',
    cardBorder: '1px solid rgba(90,64,44,0.14)', cardShadow: '0 6px 18px rgba(80,55,30,0.10)',
  },
  // Kính chàm trong mờ, chữ kem, điểm nhấn = ánh đèn bàn cam.
  toi: {
    bg: '#1d1b3a', nenTrong: '#211e3d', surface: 'rgba(38,33,68,0.8)', surface2: 'rgba(255,176,102,0.1)', ink: '#f2e8da', muted: '#b8aec6', line: 'rgba(255,214,170,0.16)',
    acc: '#ffb066', accInk: '#2a1d12', badge: '#ff9f6b', badgeInk: '#2a1d12',
    cardBorder: '1px solid rgba(255,214,170,0.14)', cardShadow: '0 8px 24px rgba(0,0,0,0.35)',
  },
  // 3 cảnh, mỗi cảnh 2 giờ × 2 khổ. Góc cửa sổ lên ĐẦU = mặc định (đúng ảnh không khí Thùy gửi) — nền duy nhất có mây trôi (homeSong).
  hinhNen: [hinhNen('cua_so', 'Góc cửa sổ'), hinhNen('mua', 'Ngày mưa'), hinhNen('san_thuong', 'Sân thượng')],
  // Mỗi ô 1 đồ vật trên bàn học. Chưa vẽ riêng: Tự luyện riêng (TSA) dùng chung quyển nháp.
  anhO: {
    giao_trinh: `${A}/o_tren_lop.png`, et: `${A}/o_et.png`, btvn: `${A}/o_btvn.png`, tu_luyen: `${A}/o_tu_luyen.png`,
    thong_tin: `${A}/o_thong_tin.png`, so_tay: `${A}/o_so_tay.png`, de_thi_thu: `${A}/o_thi_thu.png`,
    bai_tap_giao: `${A}/o_bai_tap_giao.png`, thanh_tuu: `${A}/o_cup.png`, xep_hang: `${A}/o_xep_hang.png`,
    may_man: `${A}/o_may_man.png`, vi_xu: `${A}/o_vi_xu.png`, hoc_tu_dau: `${A}/o_hoc_tu_dau.png`,
    the_gioi: `${A}/o_the_gioi.png`, nhiem_vu: `${A}/o_nhiem_vu.png`, rank: `${A}/o_rank.png`,
    thu_vien: `${A}/o_thu_vien.png`, tro_choi: `${A}/o_tro_choi.png`, tu_luyen_rieng: `${A}/o_tu_luyen.png`,
    // 5 ô khu HỌC TẬP (Đơn L3 #02–#06): địa cầu · bình tưới · bàn cờ · tháp sách · huy chương
    hoc_chu_de: `${A}/o_hoc_chu_de.png`, luyen_yeu: `${A}/o_luyen_yeu.png`, dau_truong: `${A}/o_dau_truong.png`, chinh_phuc: `${A}/o_chinh_phuc.png`, giai_vo_dich: `${A}/o_giai_vo_dich.png`,
  },
  dauThayIcon: '✿',
  trangTri: { goc: `${A}/corner.png`, gach: `${A}/divider.png` },
  anhBanner: { lich: `${A}/b_lich.png`, kiemTraLai: `${A}/b_kiem_tra_lai.png` },
  // Thẻ "Việc tiếp theo" = TỜ GIẤY NOTE (chiều: vàng kem, chữ nâu) · đêm: giấy note hắt ánh đèn cam trên nền chàm.
  theTiep: {
    sang: { bg: 'linear-gradient(180deg, #fbe2a8 0%, #f4c987 100%)', ink: '#3a2e28', border: '1px solid rgba(150,110,40,0.28)' },
    toi: { bg: 'linear-gradient(100deg, rgba(255,176,102,0.3) 0%, rgba(38,33,68,0.86) 72%)', ink: '#f2e8da', border: '1px solid rgba(255,176,102,0.55)' },
  },
  // Tấm sau tên HS (góc trên trái khổ ngang đè lên cửa sổ): chiều = giấy kem · đêm = kính chàm (có ⇒ chế độ tối bật bóng chữ toàn trang).
  nenTen: { sang: 'rgba(255,250,242,0.86)', toi: 'rgba(29,27,58,0.62)' },
  // Góc học 640px (người + bàn + đèn + mèo, mép bàn mờ dần): nam = kính tròn, áo len xanh rêu, mèo đen · nữ = áo len sọc, mèo xám.
  // Bản đêm = cùng hình phủ chàm + quầng đèn bàn (sinh bằng script, không vẽ riêng).
  nhanVat: { nam: `${A}/nv_nam.webp`, nu: `${A}/nv_nu.webp` },
  nhanVatToi: { nam: `${A}/nv_nam_dem.webp`, nu: `${A}/nv_nu_dem.webp` },
  nhanVatLoc: 'none',
  // Hình gần VUÔNG (rộng hơn một người đứng) ⇒ cột trái rộng hơn, hình thấp hơn, dịch trái cho mép bàn tràn ra ngoài màn như ảnh toàn cảnh đã duyệt.
  nhanVatBoCuc: { cot: 'minmax(320px, 37%)', cao: 'min(64vh, 620px)', lech: '-9%', bong: 0.99, dinh: true },
  homeSong: { ...SONG_LOFI, phuNen: { sang: PHU_SANG, toi: PHU_TOI } },
  // ── Khu Học tập + phiêu lưu (Đơn L3, L4) ──
  hocTap: HOC_TAP_LOFI,
  chinhPhuc: CHINH_PHUC_LOFI,
  sanDau: `${A}/dau_truong/nen_san_dau.jpg`,
  the3d: LOFI_3D,
  banDo2d: BAN_DO_LOFI,
  quai2d: QUAI_LOFI,
  game: { nenMenu: `${A}/bg_san_thuong_chieu_ngang.jpg`, nenDau: `${A}/hoctap/nen_ngang.jpg`,
    icon: { dau: `${A}/o_dau_truong.png`, giai: `${A}/o_giai_vo_dich.png`, thap: `${A}/o_chinh_phuc.png`, noi_tu: `${A}/o_so_tay.png`, goc: `${A}/o_nhiem_vu.png` } },
}
