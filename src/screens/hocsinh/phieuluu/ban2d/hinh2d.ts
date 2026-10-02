// SỔ HÌNH bản đồ phiêu lưu 2D (Đơn 7, `design/DON-HANG-SKIN-HS.md`). Ảnh nào CHƯA có ⇒ trả null, màn vẽ HÌNH TẠM bằng màu biome của style
// (`b.biome`, không gõ màu ở màn) — nên ghép DẦN được: về ảnh nào khai ảnh đó, phần còn lại vẫn chạy.
// Ảnh về: nén vào `public/bk-ui/hs/skin/rpg/phieuluu2d/` (lục địa WebP 640² trong suốt · nền JPG 1672×941) rồi khai vào CO_SAN dưới.
// Tên file = tên giao của Đơn 7 (bỏ số thứ tự).
const G = '/bk-ui/hs/skin/rpg/phieuluu2d'

export const BIOME = ['rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao'] as const

/** Ảnh ĐÃ CÓ (02/10 sáng: Thùy gửi đủ #01–#21 Đơn 7 — 8 lục địa · nền vùng + nền chặng 4 biome đầu · mốc thành). */
const CO_SAN = {
  nenTheGioi: true,
  /** biome → các hình dáng đã có (Đơn 7: mỗi biome tối đa 3 dáng _1 _2 _3) */
  lucDia: { rung: [1], bang: [1], nui_lua: [1], bien_dao: [1], sa_mac: [1], dam_lay: [1], thanh_co: [1], troi_sao: [1] } as Record<string, number[]>,
  nenVung: ['rung', 'bang', 'nui_lua', 'bien_dao'] as string[],
  nenChang: ['rung', 'bang', 'nui_lua', 'bien_dao'] as string[],
  /** mốc công trình đã có (Đơn 7 #21–#26: thanh · thap · trai · den · cong · cau) — vòng lại trong số đã có */
  moc: ['thanh'] as string[],
  /** vật nhỏ đã có (V2 02/10: cờ · mây sương · la bàn; bệ đá chưa có) */
  vat: ['co_chinh_phuc', 'may_suong', 'la_ban'] as string[],
}

/** THẾ GIỚI = 1 BỨC TRANH LIỀN (Thùy 02/10: ghép nền biển + lục địa rời thì "không khớp, không giống ảnh toàn cảnh").
 *  Bản V2 (02/10 sáng, design/bk-ui-src/Adnventure2D/V2): 1 ĐẠI LỤC chia 7 vùng + 3 đảo riêng; giao 2 lớp khớp tranh toàn cảnh:
 *  `nen` = biển trống (ảnh exec-0542a1b4) · `dat` = toàn bộ đất liền nền trong suốt (exec-2c2c3568). Code chỉ phủ lớp giao diện.
 *  o = 10 vùng theo THỨ TỰ ĐƯỜNG ĐI (chủ đề thứ i của khối ⇒ vùng i): tâm x,y (% khung 16:9) + bán kính r (% bề rộng) + biome của vùng trong tranh
 *  (ĐI VÀO bên trong dùng biome này — khớp cảnh thế giới; không theo biome DB). Đo trên ảnh ghép có lưới 5% (02/10 — ChatGPT không giao DESIGN.md).
 *  Khối ÍT chủ đề hơn ⇒ vùng thừa phủ sương "chưa khai phá" (vùng dính liền đại lục, không bỏ đi được); NHIỀU hơn ⇒ rơi về ghép mảnh. */
/** hop = hộp chứa MẢNH VÙNG (cắt từ lớp đất theo ô Voronoi quanh tâm vùng — pixel gốc, khớp tuyệt đối) dùng cho hiệu ứng rê chuột: nhích lên + sáng. % khung. */
export type OTranh = { x: number; y: number; r: number; biome: string; hop?: { x: number; y: number; w: number; h: number } }
/** ảnh mảnh vùng (the_gioi_vung_<biome>.webp) */
export const anhManhVung = (biome: string) => `${G}/the_gioi_vung_${biome}.webp`
export const TOAN_CANH_THE_GIOI: { nen: string; dat: string; o: OTranh[] } | null = {
  nen: `${G}/the_gioi_bien.jpg`,
  dat: `${G}/the_gioi_dat.webp`,
  o: [
    { x: 17, y: 25, r: 11, biome: 'rung', hop: { x: 0, y: 2.98, w: 35.29, h: 44.63 } },
    { x: 14, y: 63, r: 10, biome: 'anh_dao', hop: { x: 0, y: 43.78, w: 29.07, h: 46.97 } },
    { x: 40, y: 63, r: 9, biome: 'thanh_co', hop: { x: 27.69, y: 40.06, w: 25, h: 51.22 } },
    { x: 57, y: 78, r: 9, biome: 'dam_lay', hop: { x: 38.76, y: 61.64, w: 34.57, h: 35.07 } },
    { x: 60, y: 45, r: 10, biome: 'sa_mac', hop: { x: 41.99, y: 28.48, w: 36.72, h: 37.83 } },
    { x: 42, y: 18, r: 9, biome: 'bang', hop: { x: 29.67, y: 1.49, w: 23.68, h: 39.11 } },
    { x: 62, y: 20, r: 8, biome: 'nui_lua', hop: { x: 52.39, y: 6.06, w: 22.13, h: 25.4 } },
    { x: 87, y: 21, r: 8, biome: 'bien_dao', hop: { x: 74.34, y: 7.23, w: 25.12, h: 31.56 } },
    { x: 88, y: 52, r: 7, biome: 'troi_sao', hop: { x: 75.9, y: 37.51, w: 22.73, h: 27.31 } },
    { x: 87, y: 80, r: 8, biome: 'dong_gio', hop: { x: 72.79, y: 63.12, w: 26.38, h: 30.5 } },
  ],
}
/** Chế độ toàn cảnh áp dụng ⇒ gán biome theo VÙNG TRONG TRANH cho từng chủ đề (đi vào trong đúng cảnh vùng vừa bấm). Chỉ đổi phần VẼ, không đụng dữ liệu. */
export function ganBiomeTheoTranh<T extends { luc_dia: { biome: string }[] }>(bd: T): T {
  const tc = TOAN_CANH_THE_GIOI
  if (!tc || bd.luc_dia.length > tc.o.length) return bd
  return { ...bd, luc_dia: bd.luc_dia.map((l, i) => ({ ...l, biome: tc.o[i].biome })) }
}

/** CÁCH VẼ THẾ GIỚI (Thùy 02/10 chốt: "ghép rời"): nền biển V2 + 10 LỤC ĐỊA RỜI V2 (#3–#12 bộ V2, cắt sát mép, WebP cạnh dài 640, tỉ lệ ≈1,55).
 *  Khối ít chủ đề ⇒ chỉ đặt N lục địa, biển vẫn liền. TOAN_CANH_THE_GIOI (tấm đất liền) chỉ còn dùng để gán biome theo thứ tự đường đi. */
export const THE_GIOI_GHEP_ROI = true
const LUC_DIA_V2 = ['rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'anh_dao', 'dong_gio']
/** lục địa rời V2 (null nếu biome chưa có) + tỉ lệ ngang/dọc để dựng hộp đúng dáng */
export const anhLucDiaV2 = (biome: string) => (LUC_DIA_V2.includes(biome) ? `${G}/luc_dia_v2_${biome}.webp` : null)
export const TI_LE_LUC_DIA_V2 = 1.56
/** VỊ TRÍ GHÉP 10 lục địa rời V2 để thành ĐÚNG bố cục ảnh toàn cảnh (Thùy 02/10: "vẫn xếp liền nhau dựa trên hình gốc, vị trí giống y ảnh gốc").
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

export const anhNenTheGioi = () => (THE_GIOI_GHEP_ROI ? `${G}/the_gioi_bien.jpg` : CO_SAN.nenTheGioi ? `${G}/nen_the_gioi.jpg` : null)
// lục địa: thứ tự chủ đề quyết định dáng (vòng 2 của cùng biome lấy dáng kế) ⇒ 1 khối nhiều chủ đề ít lặp hình; biome chưa có ảnh ⇒ hình tạm
export const anhLucDia = (biome: string, thuTu: number) => {
  const ds = CO_SAN.lucDia[biome]
  if (!ds?.length) return null
  return `${G}/luc_dia_${biome}_${ds[Math.floor(thuTu / BIOME.length) % ds.length]}.webp`
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
