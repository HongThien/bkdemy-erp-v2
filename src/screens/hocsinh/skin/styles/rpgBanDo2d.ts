// SỔ HÌNH BẢN ĐỒ PHIÊU LƯU 2D — style Anime RPG (chuyển nguyên từ phieuluu/ban2d/hinh2d.ts 07/10, số liệu giữ nguyên). Ảnh: public/bk-ui/hs/skin/rpg/phieuluu2d/.
// Nguồn: thế giới = bộ V2 (design/bk-ui-src/Adnventure2D/V2) · nền vùng/chặng + mốc = Đơn 7 (design/DON-HANG-SKIN-HS.md) · nền dạng = scripts/anime-nen-dang.mjs.
import type { BanDo2D } from '../kieu'

export const BAN_DO_RPG: BanDo2D = {
  g: '/bk-ui/hs/skin/rpg/phieuluu2d',
  nenTheGioi: 'the_gioi_bien.jpg',
  /** THẾ GIỚI (Thùy 02/10 chốt): nền biển V2 + 10 LỤC ĐỊA RỜI V2 (cắt sát mép, WebP cạnh dài 640, tỉ lệ ≈1,56) GHÉP ĐÚNG VỊ TRÍ ẢNH GỐC
   *  ⇒ ra đại lục 7 vùng + 3 đảo như ảnh toàn cảnh; khối ít chủ đề chỉ đặt N mảnh đầu, biển vẫn liền.
   *  Cách ra số: tâm = tâm vùng đo trên ảnh gốc; bề rộng tăng tới khi các mảnh đại lục gối lên nhau thành 1 khối (ghép thử ra ảnh, 2 vòng).
   *  (Đã thử rồi bỏ: tấm đất liền 1 lớp; xếp lưới; dò tự động bằng so màu — mảnh ChatGPT vẽ lại có DÁNG khác vùng trong ảnh gốc.) Vẽ mảnh y nhỏ trước. */
  lucDia: [
    { biome: 'rung', x: 20, y: 28, w: 41 },
    { biome: 'anh_dao', x: 17, y: 65, w: 38 },
    { biome: 'thanh_co', x: 39, y: 59, w: 33 },
    { biome: 'dam_lay', x: 57, y: 79, w: 37 },
    { biome: 'sa_mac', x: 60, y: 45, w: 37 },
    { biome: 'bang', x: 41, y: 19, w: 31 },
    { biome: 'nui_lua', x: 62, y: 19, w: 30 },
    { biome: 'bien_dao', x: 87, y: 21, w: 23 },
    { biome: 'troi_sao', x: 88, y: 52, w: 21 },
    { biome: 'dong_gio', x: 87, y: 81, w: 23 },
  ],
  tienToLucDia: 'luc_dia_v2_',
  tlLucDia: 1.56,
  nenVung: ['rung', 'bang', 'nui_lua', 'bien_dao'],
  nenChang: ['rung', 'bang', 'nui_lua', 'bien_dao'],
  nenDang: ['anh_dao', 'bang', 'bien_dao', 'dam_lay', 'nui_lua', 'rung', 'sa_mac'],
  moc: ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'],
  vat: ['be_da', 'co_chinh_phuc', 'may_suong', 'la_ban'],
  /** CHỖ ĐẶT MỐC = tâm các BÃI ĐẤT TRỐNG trong tranh, DÒ TỰ ĐỘNG (02/10): ô 8px, vùng màu phẳng liên thông đủ rộng, soi lại bằng ảnh đánh dấu
   *  (bản đo bằng mắt trước đó lệch ⇒ Thùy chê "lâu đài không vào ô đất"). Chuyên đề thứ i ⇒ bãi i; vùng > 6 chuyên đề ⇒ bố cục chung. */
  choMoc: {
    rung: [{ x: 48.4, y: 77 }, { x: 21.2, y: 36.7 }, { x: 25.7, y: 14.5 }, { x: 58.5, y: 16.9 }, { x: 85.4, y: 36.4 }, { x: 89.6, y: 60.8 }],
    bang: [{ x: 19.5, y: 66.9 }, { x: 19.2, y: 17.5 }, { x: 50, y: 23.8 }, { x: 81.6, y: 16.4 }, { x: 81.2, y: 37.7 }, { x: 74, y: 72.7 }],
    nui_lua: [{ x: 54.4, y: 83.3 }, { x: 17.7, y: 59.5 }, { x: 19.7, y: 23.9 }, { x: 47, y: 42.9 }, { x: 82.4, y: 26.1 }, { x: 81, y: 65.1 }],
    bien_dao: [{ x: 49.4, y: 77.7 }, { x: 26.2, y: 55.8 }, { x: 23.6, y: 28.5 }, { x: 56.3, y: 13.5 }, { x: 86.3, y: 29.3 }, { x: 73.2, y: 74.3 }],
  },
  kit: true, // kit lục địa Đơn 12 (public/bk-ui/hs/skin/rpg/lucdia/) vẽ nét RPG
}
