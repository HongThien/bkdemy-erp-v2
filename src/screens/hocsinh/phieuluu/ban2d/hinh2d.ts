// SỔ HÌNH bản đồ phiêu lưu 2D (Đơn 7, `design/DON-HANG-SKIN-HS.md`). Ảnh nào CHƯA có ⇒ trả null, màn vẽ HÌNH TẠM bằng màu biome của style
// (`b.biome`, không gõ màu ở màn) — nên ghép DẦN được: về ảnh nào khai ảnh đó, phần còn lại vẫn chạy.
// Ảnh về: nén vào `public/bk-ui/hs/skin/rpg/phieuluu2d/` (lục địa WebP 640² trong suốt · nền JPG 1672×941) rồi khai vào CO_SAN dưới.
// Tên file = tên giao của Đơn 7 (bỏ số thứ tự).
const G = '/bk-ui/hs/skin/rpg/phieuluu2d'

export const BIOME = ['rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao'] as const

/** Ảnh ĐÃ CÓ (02/10: Thùy gửi #04–#10; #11 thành cổ, #12 đảo trời ChatGPT giao trùng ảnh đầm lầy ⇒ chưa có, chờ vẽ lại). */
const CO_SAN = {
  nenTheGioi: true,
  /** biome → các hình dáng đã có (Đơn 7: mỗi biome tối đa 3 dáng _1 _2 _3) */
  lucDia: { rung: [1], bang: [1], nui_lua: [1], bien_dao: [1], sa_mac: [1], dam_lay: [1] } as Record<string, number[]>,
  nenVung: [] as string[],
  nenChang: [] as string[],
  moc: false, // moc_<loai>.png · be_da.png · may_suong.png · la_ban.png · co_chinh_phuc.png
}

/** THẾ GIỚI = 1 BỨC TRANH LIỀN (Thùy 02/10: ghép nền biển + lục địa rời thì "không khớp, không giống ảnh toàn cảnh").
 *  Code chỉ phủ lớp giao diện (nhãn, cờ, sương, quầng sáng, nhân vật) lên đúng chỗ từng lục địa vẽ sẵn trong tranh.
 *  o = các lục địa trong tranh theo THỨ TỰ ĐƯỜNG ĐI (chủ đề thứ i của khối ⇒ ô i): tâm x,y (% khung 16:9) + bán kính r (% bề rộng).
 *  Khối có ÍT chủ đề hơn ⇒ ô thừa phủ tối "chưa khai phá"; NHIỀU hơn ⇒ rơi về cách ghép mảnh. Đo trên ảnh có lưới 10% (02/10). */
export type OTranh = { x: number; y: number; r: number; biome: string }
export const TOAN_CANH_THE_GIOI: { anh: string; o: OTranh[] } | null = {
  anh: `${G}/the_gioi_toan_canh.jpg`, // Đơn 7 #01 (8 lục địa)
  o: [
    { x: 37, y: 42, r: 15, biome: 'rung' },
    { x: 17, y: 72, r: 13, biome: 'sa_mac' },
    { x: 49, y: 77, r: 13, biome: 'dam_lay' },
    { x: 78, y: 75, r: 12, biome: 'thanh_co' },
    { x: 79, y: 45, r: 13, biome: 'bien_dao' },
    { x: 83, y: 17, r: 11, biome: 'troi_sao' },
    { x: 52, y: 16, r: 11, biome: 'nui_lua' },
    { x: 18, y: 14, r: 12, biome: 'bang' },
  ],
}

export const anhNenTheGioi = () => (CO_SAN.nenTheGioi ? `${G}/nen_the_gioi.jpg` : null)
// lục địa: thứ tự chủ đề quyết định dáng (vòng 2 của cùng biome lấy dáng kế) ⇒ 1 khối nhiều chủ đề ít lặp hình; biome chưa có ảnh ⇒ hình tạm
export const anhLucDia = (biome: string, thuTu: number) => {
  const ds = CO_SAN.lucDia[biome]
  if (!ds?.length) return null
  return `${G}/luc_dia_${biome}_${ds[Math.floor(thuTu / BIOME.length) % ds.length]}.webp`
}
export const anhNenVung = (biome: string) => (CO_SAN.nenVung.includes(biome) ? `${G}/nen_vung_${biome}.jpg` : null)
export const anhNenChang = (biome: string) => (CO_SAN.nenChang.includes(biome) ? `${G}/nen_chang_${biome}.jpg` : null)
export const LOAI_MOC = ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'] as const
export const anhMoc = (i: number) => (CO_SAN.moc ? `${G}/moc_${LOAI_MOC[i % LOAI_MOC.length]}.png` : null)
export const anhVat = (ten: 'be_da' | 'may_suong' | 'la_ban' | 'co_chinh_phuc') => (CO_SAN.moc ? `${G}/${ten}.png` : null)
// hình tạm cho mốc (emoji) khi chưa có hình Đơn 7
export const EMOJI_MOC = ['🏰', '🗼', '⛺', '🛕', '⛩️', '🌉']
