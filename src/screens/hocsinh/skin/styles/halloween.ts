// ============================================================================
// STYLE "Halloween" — đêm Halloween đáng yêu (Thùy 24/10: "chủ đề halloween, chủ yếu theo kiểu ảnh 1, kết hợp nét chiikawa/usagi"; chốt tên "Halloween",
// cho em thích không khí tối / ma / lễ hội, CHỈ chế độ TỐI; 25/10: "dựng code với bộ hình hiện tại, H5 dùng tạm").
// Đơn hình + luật ĐƯỢC/CẤM + bảng kiểm hàng: design/DON-HANG-STYLE-HALLOWEEN.md (đơn H1–H5). Ảnh gốc ChatGPT (ngoài git, 195 MB): design/bk-ui-src/halloween/ ·
// nén + đo + sinh halloweenHocTap.ts / halloweenSong.ts / halloweenDau.ts: node scripts/halloween-hinh.mjs.
// File cho app: public/bk-ui/hs/skin/halloween/ — bg_<nền>_<ngang|doc>.jpg · o_<ô>.png · b_*.png · corner.png · divider.png · nv_<nam|nu>.webp · song/ · dau/.
// Style TỐI duy nhất · thẻ TÍM ĐÊM viền tím sáng bo tròn lớn, bóng cứng; điểm sáng duy nhất là CAM / VÀNG ĐÈN; 2 bé ma tròn (ma phù thủy · ma bí ngô) đổi tư thế,
// và là người ra trận (bộ đánh `dau` — thay 6 nhân vật anime khi em đang dùng style này).
// Giọng game "đi hù ma lấy kẹo" — LOI_HALLOWEEN. Tương phản (đo 25/10): chữ kem trên thẻ 12:1 · chữ phụ 6,9:1 · màu nhấn cam đèn làm CHỮ trên thẻ 6,3:1 ·
// chữ tím đậm trên nút cam 7,7:1 · chữ trắng trên badge 5,7:1 · chữ tím đậm trên thẻ "Việc tiếp theo" 10:1.
// ⚠ Đơn đề xuất nút CAM CHÁY #b8480f chữ trắng (5,3:1) — soi app thì `acc` còn là màu CHỮ nhấn trên thẻ tím (chuỗi ngày, số liệu) và ở đó cam cháy chỉ 2,5:1
// ⇒ đổi sang cam đèn #ff9a4d + chữ tím đậm trên nút (cùng cách RPG: vàng + chữ tối). Cam bí ngô #cc6b2e cũng không dùng (chữ trắng 3,7:1).
// ============================================================================
import type { Skin } from '../kieu'
import { LOI_HALLOWEEN } from '../loi'
import { HALLOWEEN_3D } from '../the3d/bangMauHalloween'
import { HOC_TAP_HALLOWEEN, CHINH_PHUC_HALLOWEEN } from './halloweenHocTap'
import { BAN_DO_HALLOWEEN, QUAI_HALLOWEEN } from './halloweenBanDo2d'
import { LINH_VAT_HALLOWEEN } from './halloweenSong'
import { DAU_HALLOWEEN } from './halloweenDau'

const A = '/bk-ui/hs/skin/halloween'
const BALOO = "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"
const VIET = "'Be Vietnam Pro', system-ui, sans-serif"
// Tranh đêm: phủ tím rất nhẹ ở trên (tiêu đề chữ kem) và đáy (lưới ô) — vùng giữa giữ nguyên ánh đèn.
const PHU = 'linear-gradient(180deg, rgba(37,24,54,0.42) 0%, rgba(37,24,54,0) 30%, rgba(37,24,54,0) 68%, rgba(37,24,54,0.45) 100%)'
const BG = A + '/bg_' // 6 tranh: bg_<pho_dem|nghia_dia|vuon_bi>_<ngang|doc>.jpg
const tranh = (ten: string, kho: 'ngang' | 'doc', lot: string) => `${PHU}, url(${BG}${ten}_${kho}.jpg) center top / cover no-repeat, ${lot}`
const hinhNen = (id: string, ten: string, lot: string) => ({ id, ten, toi: tranh(id, 'ngang', lot), toiDoc: tranh(id, 'doc', lot) })

export const HALLOWEEN: Skin = {
  id: 'halloween', ten: 'Halloween', moTa: 'Đêm ma đáng yêu', giongGi: 'Halloween · Chiikawa (nét vẽ)',
  font: VIET, fontHead: BALOO, headCase: 'none', headTrack: '0.01em',
  radius: '22px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
  loi: LOI_HALLOWEEN,
  cheDo: ['toi'],
  // Thẻ tím đêm đặc, viền TÍM SÁNG (viền đen của nét vẽ mất trên nền tối) + bóng cứng tím đen. acc = cam ĐÈN, chữ trên nút tím đậm (xem đầu file).
  toi: {
    bg: '#251836', nenTrong: '#2a1a3f', surface: 'rgba(59,37,87,0.96)', surface2: 'rgba(255,192,99,0.14)', ink: '#fff3e0', muted: '#c9b3e0', line: 'rgba(184,157,203,0.35)',
    acc: '#ff9a4d', accInk: '#2a1740', badge: '#c2255c', badgeInk: '#ffffff',
    cardBorder: '2.5px solid #8a62b0', cardShadow: '0 4px 0 #150c22',
  },
  // Phố đêm hiên nhà lên ĐẦU = mặc định (đúng ảnh không khí Thùy gửi).
  hinhNen: [hinhNen('pho_dem', 'Phố đêm', '#251836'), hinhNen('nghia_dia', 'Nghĩa địa trăng', '#2a1d40'), hinhNen('vuon_bi', 'Vườn bí ngô', '#2b1a33')],
  // Mỗi ô 1 đồ vật Halloween, viền tím đen + viền sticker kem (nổi trên thẻ tối). Tự luyện riêng (TSA) dùng chung bút lông vũ.
  anhO: {
    giao_trinh: `${A}/o_tren_lop.png`, et: `${A}/o_et.png`, btvn: `${A}/o_btvn.png`, tu_luyen: `${A}/o_tu_luyen.png`,
    thong_tin: `${A}/o_thong_tin.png`, so_tay: `${A}/o_so_tay.png`, de_thi_thu: `${A}/o_thi_thu.png`,
    bai_tap_giao: `${A}/o_bai_tap_giao.png`, thanh_tuu: `${A}/o_cup.png`, xep_hang: `${A}/o_xep_hang.png`,
    may_man: `${A}/o_may_man.png`, vi_xu: `${A}/o_vi_xu.png`, hoc_tu_dau: `${A}/o_hoc_tu_dau.png`,
    the_gioi: `${A}/o_the_gioi.png`, nhiem_vu: `${A}/o_nhiem_vu.png`, rank: `${A}/o_rank.png`,
    thu_vien: `${A}/o_thu_vien.png`, tro_choi: `${A}/o_tro_choi.png`, tu_luyen_rieng: `${A}/o_tu_luyen.png`,
    // 5 ô khu HỌC TẬP (Đơn H3 #02–#06): bản đồ kho báu · bình thuốc · 2 lá cờ dơi · lâu đài ma · vương miện
    hoc_chu_de: `${A}/o_hoc_chu_de.png`, luyen_yeu: `${A}/o_luyen_yeu.png`, dau_truong: `${A}/o_dau_truong.png`, chinh_phuc: `${A}/o_chinh_phuc.png`, giai_vo_dich: `${A}/o_giai_vo_dich.png`,
  },
  dauThayIcon: '✦',
  // Hình góc ôm góc trên-trái thật (cành trụi + mạng nhện + dơi) ⇒ khai được `goc` (Đáng yêu thì không).
  trangTri: { goc: `${A}/corner.png`, gach: `${A}/divider.png` },
  anhBanner: { lich: `${A}/b_lich.png`, kiemTraLai: `${A}/b_kiem_tra_lai.png` },
  // Thẻ "Việc tiếp theo" / ca bổ trợ = ô cửa sổ SÁNG ĐÈN: vàng đèn, chữ tím đậm.
  theTiep: { bg: '#ffc063', ink: '#2a1740', border: '2.5px solid #1e1030' },
  // Tấm sau tên HS = tím đêm mờ; chế độ tối + nenTen ⇒ bật bóng chữ toàn trang (chữ kem trên tranh có đèn sáng).
  nenTen: 'rgba(37,24,54,0.88)',
  // Bé ma (KHÔNG có người): nam = ma phù thủy (mũ đen dải tím) ôm giỏ bí ngô · nữ = ma bí ngô (mũ bí không tai) cầm đèn lồng nến.
  // Hình tĩnh = đế (lá thu + bí) + thân, cùng khung với 9 tư thế.
  nhanVat: { nam: `${A}/nv_nam.webp`, nu: `${A}/nv_nu.webp` },
  nhanVatLoc: 'none',
  // Bé ma tròn (thân ~80% khung) ⇒ thấp hơn người đứng một chút, bám đáy khung nhìn khi cuộn, bong bóng thoại ngay trên đầu (như Đáng yêu).
  nhanVatBoCuc: { cot: 'minmax(280px, 32%)', cao: 'min(58vh, 560px)', lech: '3%', bong: 0.9, dinh: true },
  homeSong: { linhVat: LINH_VAT_HALLOWEEN },
  // Hoạt cảnh trên tranh nền (Thùy 30/10 — skin/HoatCanhNen.tsx): bí ngô sáng → tắt → sáng · đèn / nến chập chờn · đom đóm · dơi bay · 2 bé ma nhỏ trôi xa ·
  // bé ma chính bồng bềnh. Điểm sáng đo trên tranh NGANG 1505×1045 (lưới % — 30/10); x, y = tâm, r = đường kính quầng (% bề ngang ảnh).
  hoatCanh: {
    diem: {
      pho_dem: { tl: 1505 / 1045, ds: [
        { x: 9.3, y: 69, r: 15, kieu: 'bi', ck: 5.6 }, { x: 16, y: 72.5, r: 10.5, kieu: 'bi', ck: 4.6 }, { x: 12, y: 77.6, r: 6.5, kieu: 'bi', ck: 3.9 },
        { x: 20, y: 36, r: 10, kieu: 'den' }, { x: 31.6, y: 45.6, r: 7, kieu: 'den', ck: 2.9 },
        { x: 4.6, y: 6, r: 4.5, kieu: 'den', ck: 1.9 }, { x: 15.6, y: 13.6, r: 4.5, kieu: 'den', ck: 2.2 }, { x: 25.6, y: 20.4, r: 4.5, kieu: 'den', ck: 2.6 },
        { x: 10.4, y: 10.7, r: 4.5, kieu: 'den', ck: 2.1, mau: 'rgba(196,120,255,.62)' }, { x: 20.6, y: 18, r: 4.5, kieu: 'den', ck: 2.4, mau: 'rgba(196,120,255,.62)' },
      ] },
      nghia_dia: { tl: 1505 / 1045, ds: [
        { x: 18.5, y: 23, r: 34, kieu: 'trang' },
        { x: 8.5, y: 65.6, r: 7.5, kieu: 'nen' }, { x: 24.6, y: 64, r: 6.5, kieu: 'nen', ck: 1.3 }, { x: 93.5, y: 89.5, r: 7.5, kieu: 'nen', ck: 1.7 },
      ] },
      vuon_bi: { tl: 1505 / 1045, ds: [
        { x: 17.7, y: 61, r: 13, kieu: 'bi', ck: 5.4 }, { x: 85.5, y: 92, r: 10, kieu: 'bi', ck: 4.4 },
        { x: 4.6, y: 44, r: 2.6, kieu: 'dom' }, { x: 38.6, y: 54.5, r: 2.6, kieu: 'dom', ck: 3.6 }, { x: 5, y: 77.6, r: 2.6, kieu: 'dom', ck: 2.8 },
        { x: 77.6, y: 79.2, r: 2.6, kieu: 'dom', ck: 3.4 }, { x: 28, y: 50, r: 2.6, kieu: 'dom', ck: 4 },
      ] },
    },
    // Bí ngô trong tranh: màn rộng bị XÉN (đáy tranh rơi ra ngoài), màn hẹp bị bé ma che ⇒ cắt chính cụm bí ngô (phố đêm) + quả bí khoét mặt (vườn bí)
    // thành tiền cảnh 2 góc dưới (scripts/halloween-hinh.mjs phần 6). Điểm sáng: % ảnh cắt (đổi từ số đo trên tranh).
    tienCanh: [
      // cụm trái đứng TRƯỚC bé ma (như ảnh mẫu) — nhỏ, sát mép trái để chỉ che vạt tà, không che giỏ kẹo
      { src: `${A}/tien_canh/bi_trai.webp`, tl: 346 / 303, rong: 'clamp(130px, 10.5vw, 210px)', canh: 'trai', truoc: true, ds: [
        { x: 40.4, y: 48.3, r: 62, kieu: 'bi', ck: 5.6 }, { x: 69.6, y: 60.3, r: 44, kieu: 'bi', ck: 4.6 }, { x: 52.2, y: 77.9, r: 27, kieu: 'bi', ck: 3.9 },
      ] },
      { src: `${A}/tien_canh/bi_phai.webp`, tl: 361 / 230, rong: 'clamp(160px, 15vw, 280px)', canh: 'phai', ds: [
        { x: 39.6, y: 63.6, r: 40, kieu: 'bi', ck: 5 },
      ] },
    ],
    doi: { src: `${A}/song/fx_doi.webp`, so: 6 },
    ma: [`${A}/song/nu/dung.webp`, `${A}/song/nam/vui.webp`],
    nvBong: true,
  },
  // Bé ma ra trận (Đơn H5) — thay 6 nhân vật anime khi em dùng style này (skin/nhanVat.ts).
  dau: DAU_HALLOWEEN,
  // ── Khu Học tập + phiêu lưu (Đơn H3, H4) ──
  hocTap: HOC_TAP_HALLOWEEN,
  chinhPhuc: CHINH_PHUC_HALLOWEEN,
  sanDau: `${A}/dau_truong/nen_san_dau.jpg`,
  the3d: HALLOWEEN_3D,
  banDo2d: BAN_DO_HALLOWEEN,
  quai2d: QUAI_HALLOWEEN,
  game: { nenMenu: `${A}/bg_pho_dem_ngang.jpg`, nenDau: `${A}/hoctap/nen_ngang.jpg`,
    icon: { dau: `${A}/o_dau_truong.png`, giai: `${A}/o_giai_vo_dich.png`, thap: `${A}/o_chinh_phuc.png`, noi_tu: `${A}/o_so_tay.png`, goc: `${A}/o_nhiem_vu.png` } },
}
