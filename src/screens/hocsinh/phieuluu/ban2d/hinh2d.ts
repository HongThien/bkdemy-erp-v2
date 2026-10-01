// SỔ HÌNH bản đồ phiêu lưu 2D (Đơn 7, `design/DON-HANG-SKIN-HS.md`). Chưa có hình ⇒ trả null, màn vẽ HÌNH TẠM bằng màu biome của style
// (`b.biome`, không gõ màu ở màn). Hình về: nén vào `public/bk-ui/hs/skin/rpg/phieuluu2d/` rồi bật cờ tương ứng ở `KIT2D`.
// Tên file = tên giao của Đơn 7 (bỏ số thứ tự).

export const KIT2D = {
  theGioi: false,  // nen_the_gioi.jpg + luc_dia_<biome>_<1..3>.png
  vung: false,     // nen_vung_<biome>.jpg
  chang: false,    // nen_chang_<biome>.jpg
  moc: false,      // moc_<loai>.png · be_da.png · may_suong.png · la_ban.png · co_chinh_phuc.png
}
const G = '/bk-ui/hs/skin/rpg/phieuluu2d'

export const BIOME = ['rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao'] as const
// lục địa: mỗi biome 3 hình dáng; thứ tự chủ đề quyết định dáng ⇒ 1 khối 10 chủ đề không lặp hình (8 biome × 3)
export const anhNenTheGioi = () => (KIT2D.theGioi ? `${G}/nen_the_gioi.jpg` : null)
export const anhLucDia = (biome: string, thuTu: number) => (KIT2D.theGioi ? `${G}/luc_dia_${biome}_${(Math.floor(thuTu / BIOME.length) % 3) + 1}.png` : null)
export const anhNenVung = (biome: string) => (KIT2D.vung ? `${G}/nen_vung_${biome}.jpg` : null)
export const anhNenChang = (biome: string) => (KIT2D.chang ? `${G}/nen_chang_${biome}.jpg` : null)
export const LOAI_MOC = ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'] as const
export const anhMoc = (i: number) => (KIT2D.moc ? `${G}/moc_${LOAI_MOC[i % LOAI_MOC.length]}.png` : null)
export const anhVat = (ten: 'be_da' | 'may_suong' | 'la_ban' | 'co_chinh_phuc') => (KIT2D.moc ? `${G}/${ten}.png` : null)
// hình tạm cho mốc (emoji) khi chưa có hình Đơn 7
export const EMOJI_MOC = ['🏰', '🗼', '⛺', '🛕', '⛩️', '🌉']
