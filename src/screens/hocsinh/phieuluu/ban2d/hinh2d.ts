// SỔ HÌNH bản đồ phiêu lưu 2D. Ảnh nào CHƯA có ⇒ trả null, màn vẽ HÌNH TẠM bằng màu biome của style (`b.biome`, không gõ màu ở màn)
// — ghép DẦN được: về ảnh nào khai ảnh đó, phần còn lại vẫn chạy. Ảnh nén vào `public/bk-ui/hs/skin/rpg/phieuluu2d/` rồi khai vào CO_SAN dưới.
// Nguồn: thế giới = bộ V2 (design/bk-ui-src/Adnventure2D/V2) · nền vùng/chặng + mốc = Đơn 7 (design/DON-HANG-SKIN-HS.md).
const G = '/bk-ui/hs/skin/rpg/phieuluu2d'

/** Ảnh ĐÃ CÓ cho tầng lục địa + chặng (Đơn 7 #13–#21: nền vùng + nền chặng 4 biome đầu · mốc thành) + vật nhỏ (V2: cờ · mây sương · la bàn). */
const CO_SAN = {
  nenVung: ['rung', 'bang', 'nui_lua', 'bien_dao'] as string[],
  nenChang: ['rung', 'bang', 'nui_lua', 'bien_dao'] as string[],
  /** mốc công trình đã có (Đơn 7 #21–#26: thanh · thap · trai · den · cong · cau) — vòng lại trong số đã có */
  moc: ['thanh'] as string[],
  /** vật nhỏ đã có (bệ đá chưa có) */
  vat: ['co_chinh_phuc', 'may_suong', 'la_ban'] as string[],
}

/** THẾ GIỚI (Thùy 02/10 chốt): nền biển V2 + 10 LỤC ĐỊA RỜI V2 (cắt sát mép, WebP cạnh dài 640, tỉ lệ ≈1,56) GHÉP ĐÚNG VỊ TRÍ ẢNH GỐC
 *  ⇒ ra đại lục 7 vùng + 3 đảo như ảnh toàn cảnh; khối ít chủ đề chỉ đặt N mảnh đầu, biển vẫn liền.
 *  (Đã thử rồi bỏ: tấm đất liền 1 lớp — không bỏ bớt vùng được, phải phủ mây; xếp lưới — rời rạc, không giống ảnh gốc.) */
export const anhNenTheGioi = () => `${G}/the_gioi_bien.jpg`
const LUC_DIA_V2 = ['rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'anh_dao', 'dong_gio']
/** lục địa rời V2 (null nếu biome chưa có ⇒ hình tạm) */
export const anhLucDiaV2 = (biome: string) => (LUC_DIA_V2.includes(biome) ? `${G}/luc_dia_v2_${biome}.webp` : null)
export const TI_LE_LUC_DIA_V2 = 1.56
/** VỊ TRÍ GHÉP 10 lục địa rời để thành ĐÚNG bố cục ảnh toàn cảnh (Thùy 02/10: "vẫn xếp liền nhau dựa trên hình gốc, vị trí giống y ảnh gốc").
 *  Theo THỨ TỰ ĐƯỜNG ĐI (chủ đề thứ i ⇒ mảnh i). x,y = TÂM mảnh, w = bề rộng mảnh — đều % khung 16:9.
 *  Cách ra số: tâm = tâm vùng đo trên ảnh gốc; bề rộng tăng tới khi các mảnh đại lục gối lên nhau thành 1 khối (ghép thử ra ảnh, 2 vòng).
 *  (Dò tự động bằng so màu đã thử — sai: mảnh rời do ChatGPT vẽ lại có DÁNG khác vùng trong ảnh gốc, so màu ra cỡ lệch.) Vẽ mảnh y nhỏ trước, y lớn đè lên. */
export const VI_TRI_LUC_DIA_V2: { biome: string; x: number; y: number; w: number }[] = [
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
]
/** Chủ đề thứ i lấy biome của mảnh i trên bản đồ ⇒ đi vào trong đúng cảnh vùng vừa bấm. Chỉ đổi phần VẼ, không đụng dữ liệu DB. */
export function ganBiomeTheoTranh<T extends { luc_dia: { biome: string }[] }>(bd: T): T {
  if (bd.luc_dia.length > VI_TRI_LUC_DIA_V2.length) return bd
  return { ...bd, luc_dia: bd.luc_dia.map((l, i) => ({ ...l, biome: VI_TRI_LUC_DIA_V2[i].biome })) }
}

/** CHỖ ĐẶT MỐC trên từng nền vùng: các KHOẢNG ĐẤT TRỐNG vẽ sẵn trong tranh, đo trên ảnh lưới 5% (02/10), xếp theo 1 vòng đường đi
 *  (chuyên đề thứ i ⇒ chỗ i). Vùng có NHIỀU chuyên đề hơn số chỗ ⇒ rơi về bố cục chung (boCucDuong). Toạ độ = % khung 16:9 của nền. */
export const CHO_MOC_VUNG: Record<string, { x: number; y: number }[]> = {
  rung: [{ x: 45, y: 80 }, { x: 45, y: 57 }, { x: 22, y: 37 }, { x: 25, y: 13 }, { x: 55, y: 13 }, { x: 85, y: 11 }, { x: 85, y: 37 }, { x: 82, y: 61 }],
  bang: [{ x: 20, y: 65 }, { x: 17, y: 18 }, { x: 52, y: 20 }, { x: 80, y: 11 }, { x: 78, y: 35 }, { x: 80, y: 70 }, { x: 60, y: 72 }],
  nui_lua: [{ x: 45, y: 85 }, { x: 15, y: 58 }, { x: 20, y: 23 }, { x: 50, y: 43 }, { x: 82, y: 25 }, { x: 85, y: 58 }, { x: 80, y: 76 }, { x: 62, y: 63 }],
  bien_dao: [{ x: 48, y: 77 }, { x: 28, y: 55 }, { x: 25, y: 30 }, { x: 58, y: 15 }, { x: 82, y: 30 }, { x: 80, y: 44 }, { x: 75, y: 75 }],
}
export const anhNenVung = (biome: string) => (CO_SAN.nenVung.includes(biome) ? `${G}/nen_vung_${biome}.jpg` : null)
export const anhNenChang = (biome: string) => (CO_SAN.nenChang.includes(biome) ? `${G}/nen_chang_${biome}.jpg` : null)
export const LOAI_MOC = ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'] as const
export const anhMoc = (i: number) => (CO_SAN.moc.length ? `${G}/moc_${CO_SAN.moc[i % CO_SAN.moc.length]}.webp` : null)
export const anhVat = (ten: 'be_da' | 'may_suong' | 'la_ban' | 'co_chinh_phuc') => (CO_SAN.vat.includes(ten) ? `${G}/${ten}.webp` : null)
// hình tạm cho mốc (emoji) khi chưa có hình Đơn 7
export const EMOJI_MOC = ['🏰', '🗼', '⛺', '🛕', '⛩️', '🌉']
