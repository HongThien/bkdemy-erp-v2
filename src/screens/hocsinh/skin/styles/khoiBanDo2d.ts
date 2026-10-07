// SỔ HÌNH BẢN ĐỒ PHIÊU LƯU 2D + QUÁI — style Khối vuông (07/10). Ảnh nén bởi scripts/khoi-hoc-tap.mjs vào public/bk-ui/hs/skin/khoi/phieuluu2d/ + quai/.
// Nguồn: Đơn K2 (nền thế giới · 8 đảo · 8 nền vùng · cổng · cờ · 16 quái + 4 boss) + Đơn K3 #28–#48 (đảo + nền vùng anh đào / đồng gió · 5 mốc ·
// bệ đá · mây sương · 10 nền dạng bài); la bàn = icon ô Thế giới BK (K1 #23). Chưa có: nền chặng (Chang2D dùng nền dạng trước) · kit lục địa Đơn 12.
import type { BanDo2D } from '../kieu'

const BIOME = ['rung', 'anh_dao', 'thanh_co', 'dam_lay', 'sa_mac', 'bang', 'nui_lua', 'bien_dao', 'troi_sao', 'dong_gio']

export const BAN_DO_KHOI: BanDo2D = {
  g: '/bk-ui/hs/skin/khoi/phieuluu2d',
  nenTheGioi: 'the_gioi.jpg',
  /** Đảo khối là ĐẢO RỜI nổi trên biển mây (không ghép thành đại lục như RPG) ⇒ 2 hàng × 5 cột, xếp SO LE theo thứ tự chủ đề
   *  (trên-dưới-trên…) để khối ít chủ đề vẫn trải đều bề ngang. Cùng thứ tự biome với RPG (chủ đề thứ i ⇒ cùng vùng ở mọi style).
   *  Đảo cắt sát rồi đặt giữa khung VUÔNG 640 (tlLucDia = 1) ⇒ đáy đảo ≈ tâm + 0,47 × bề rộng ⇒ nhãn tên đặt ngay dưới (nhanDuoi). */
  lucDia: [
    { biome: 'rung', x: 11, y: 31, w: 13 }, { biome: 'anh_dao', x: 30.5, y: 69, w: 13 }, { biome: 'thanh_co', x: 50, y: 30, w: 13 },
    { biome: 'dam_lay', x: 69.5, y: 69, w: 13 }, { biome: 'sa_mac', x: 89, y: 31, w: 13 }, { biome: 'bang', x: 11, y: 70, w: 13 },
    { biome: 'nui_lua', x: 30.5, y: 29, w: 13 }, { biome: 'bien_dao', x: 50, y: 70, w: 13 }, { biome: 'troi_sao', x: 69.5, y: 29, w: 13 },
    { biome: 'dong_gio', x: 89, y: 70, w: 13 },
  ],
  tienToLucDia: 'dao_',
  tlLucDia: 1,
  nhanDuoi: 0.44,
  nenVung: BIOME,
  nenChang: [],
  nenDang: BIOME,
  moc: ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'],
  vat: ['be_da', 'co_chinh_phuc', 'may_suong', 'la_ban'],
}

const Q = '/bk-ui/hs/skin/khoi/quai'
/** 16 loài thường + 4 boss (skin/the3d/loai.ts) — sinh vật khối tự thiết kế, Đơn K2. */
export const QUAI_KHOI: Record<string, string> = Object.fromEntries(
  ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set', 'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua',
    'rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc'].map((l) => [l, `${Q}/${l}.webp`]),
)
