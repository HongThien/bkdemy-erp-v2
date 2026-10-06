// ============================================================================
// STYLE "Khối vuông" — cảm hứng Minecraft (Thùy 01/10: "giống minecraft nhất có thể, từ khung cảnh đến vật phẩm, không vi phạm bản quyền";
// 03/10: "thêm làm lựa chọn, dựng ngay"). Gói trọn: màu · font · dáng thẻ · tranh nền · icon ô · icon banner · trang trí · nhân vật.
// Đơn hình + luật ĐƯỢC/CẤM: design/DON-HANG-STYLE-KHOI.md · kế hoạch + token: spec-giao-dien-hs.md §10.
// Ảnh gốc ChatGPT (ngoài git, bản chính trên Drive): design/bk-ui-src/khoi/ · ảnh toàn cảnh: khoi/khoi_man_chinh_ipad.png.
// File cho app (đã nén): public/bk-ui/hs/skin/khoi/ — bg_<nền>_ngang|doc.jpg · o_<ô>.png · b_lich.png · corner/divider.png · nv_nam|nu.png.
// Style SÁNG duy nhất (Thùy 01/10: chưa cần bản tối) · giao diện kiểu TÚI ĐỒ: tấm xám đá vát nổi, góc vuông, viền đen 2px.
// CHƯA có bản đồ phiêu lưu / Đấu trường (không khai the3d, sanDau, boss) ⇒ chạy như Tối giản: Tự luyện đi thẳng danh sách thường.
// Hình bản đồ + quái khối vuông đã có (design/bk-ui-src/khoi/phieu-luu/, Đơn K2) — ghép khi luồng bản đồ làm bảng màu 3D cho style này.
// Thiếu icon banner "kiểm tra lại" (#29, Thùy vẽ bù) — banner đang tắt (RETEST_BAT) nên không ảnh hưởng.
// ============================================================================
import type { Skin } from '../kieu'
import { LOI_GAME } from '../loi'

const A = '/bk-ui/hs/skin/khoi'
const BALOO = "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"
// Handjet: chữ pixel CÓ đủ dấu tiếng Việt (đo 01/10 — Press Start 2P / Pixelify / Silkscreen mất dấu). Khai font ở hs.html.
const PIXEL = "'Handjet', 'Baloo 2', system-ui, sans-serif"
// Tranh sáng, chữ TỐI ⇒ phủ sương sáng ở ~1/4 TRÊN (tiêu đề trang "Huy hiệu Toán", "Chào …!", dòng mã HS đặt thẳng lên tán anh đào hồng —
// 03/10 soi thấy không đọc được) + phủ nhẹ phần đáy để thẻ xám tách khỏi cỏ/hoa. Giữa tranh để nguyên cho rực.
const nen = (f: string) =>
  `linear-gradient(180deg, rgba(255,244,248,0.62) 0%, rgba(255,244,248,0.3) 14%, rgba(255,244,248,0) 28%, rgba(255,244,248,0) 58%, rgba(255,244,248,0.4) 100%), url(${A}/${f}.jpg) center top / cover no-repeat, #f7dbe6`

export const KHOI: Skin = {
  id: 'khoi', ten: 'Khối vuông', moTa: 'Thế giới khối, vật phẩm pixel', giongGi: 'Minecraft · Roblox',
  font: BALOO, fontHead: PIXEL, headCase: 'none', headTrack: '0.02em',
  radius: '0px', radiusPill: '0px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
  loi: LOI_GAME,
  cheDo: ['sang'],
  // Túi đồ: tấm xám đá #c6c6c6 · ô lõm xám đậm · vát trắng trên-trái / xám đậm dưới-phải. acc = xanh cỏ ĐẬM (vừa làm nền nút chữ trắng,
  // vừa làm chữ tiêu đề lớn trên tấm xám — xanh cỏ sáng #5fa83a trên xám chỉ ~2:1, không đọc được).
  sang: {
    bg: '#fff4f8', surface: 'rgba(198,198,198,0.96)', surface2: 'rgba(139,139,139,0.5)', ink: '#2b2b2b', muted: '#474747', line: 'rgba(0,0,0,0.35)',
    acc: '#357a20', accInk: '#ffffff', badge: '#e04b3c', badgeInk: '#ffffff',
    cardBorder: '2px solid #1e1e1e', cardShadow: 'inset 2px 2px 0 #ffffff, inset -2px -2px 0 #555555, 0 3px 0 rgba(0,0,0,0.3)',
  },
  // Tranh vẽ riêng 2 khổ: ngang 1672×941 cho iPad/máy tính, dọc 941×1672 cho điện thoại. Anh đào lên ĐẦU = mặc định (Thùy chọn 01/10).
  hinhNen: [
    { id: 'anh_dao', ten: 'Anh đào', sang: nen('bg_anh_dao_ngang'), sangDoc: nen('bg_anh_dao_doc') },
    { id: 'ho_rung', ten: 'Hồ rừng', sang: nen('bg_ho_rung_ngang'), sangDoc: nen('bg_ho_rung_doc') },
    { id: 'tuyet', ten: 'Tuyết', sang: nen('bg_tuyet_ngang'), sangDoc: nen('bg_tuyet_doc') },
  ],
  // Mỗi ô 1 vật phẩm pixel. Thành tựu (khối 9) và Bảng xếp hạng (khối 10–12) không bao giờ cùng lưới ⇒ dùng chung cúp.
  anhO: {
    giao_trinh: `${A}/o_tren_lop.png`, et: `${A}/o_et.png`, btvn: `${A}/o_btvn.png`, tu_luyen: `${A}/o_tu_luyen.png`,
    thong_tin: `${A}/o_thong_tin.png`, so_tay: `${A}/o_so_tay.png`, de_thi_thu: `${A}/o_thi_thu.png`,
    bai_tap_giao: `${A}/o_bai_tap_giao.png`, thanh_tuu: `${A}/o_cup.png`, xep_hang: `${A}/o_cup.png`,
    may_man: `${A}/o_may_man.png`, vi_xu: `${A}/o_vi_xu.png`, hoc_tu_dau: `${A}/o_hoc_tu_dau.png`,
    the_gioi: `${A}/o_the_gioi.png`, nhiem_vu: `${A}/o_nhiem_vu.png`, rank: `${A}/o_rank.png`,
    thu_vien: `${A}/o_bai_tap_giao.png`, tu_luyen_rieng: `${A}/o_tu_luyen.png`,
    tro_choi: `${A}/o_may_man.png`, // 06/10 TẠM — chờ vẽ riêng (Đơn 14) // 03/10 TẠM — chờ vẽ riêng (như rpg.ts)
  },
  dauThayIcon: '■',
  trangTri: { goc: `${A}/corner.png`, gach: `${A}/divider.png` },
  anhBanner: { lich: `${A}/b_lich.png` },
  // Thẻ "Việc tiếp theo" / ca bổ trợ = tấm VÁN GỖ (gỗ đậm để chữ trắng đọc được).
  theTiep: { bg: 'linear-gradient(180deg, #9b7440 0%, #6f5230 100%)', ink: '#ffffff', border: '2px solid #1e1e1e' },
  // Tấm sau tên HS (góc trên trái khổ ngang) = tấm túi đồ xám — tên chữ tối đè lên cây anh đào thì không đọc được (03/10).
  // Style sáng ⇒ registry KHÔNG bật bóng chữ tối toàn trang (chỉ bật khi chế độ tối).
  nenTen: 'rgba(198,198,198,0.92)',
  // Nhân vật 1122×1402 PNG trong suốt ⇒ nén 640×800: nam = nhà thám hiểm + cáo con, nữ = nhà thám hiểm + cú mèo.
  nhanVat: { nam: `${A}/nv_nam.png`, nu: `${A}/nv_nu.png` },
}
