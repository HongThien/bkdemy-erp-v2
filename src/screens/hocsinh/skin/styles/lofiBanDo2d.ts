// SỔ HÌNH BẢN ĐỒ PHIÊU LƯU 2D + BÉ TINH LINH — style Lo-fi chill (12/10). Ảnh nén bởi scripts/lofi-hinh.mjs vào public/bk-ui/hs/skin/lofi/phieuluu2d/ + quai/.
// Nguồn: Đơn L4 (nền thế giới · 10 đảo · 10 nền vùng · 10 nền dạng · 6 mốc · bệ · sương · cờ · la bàn · 16 bé + 4 boss) + đơn bổ sung 12/10
// (đảo đồng gió · 8 bé đầu · 4 boss · 6 nền dạng vẽ lại có mặt đường ngang). Chưa có: nền chặng (Chang2D dùng nền dạng trước) · kit lục địa Đơn 12.
// 10 nền vùng là cảnh phối cảnh nhiều chi tiết (ít khoảng đất trống) ⇒ điểm màn đấu đang theo bố cục đường chung; muốn đẹp hơn thì khai `choMoc` từng vùng.
import type { BanDo2D } from '../kieu'

const BIOME = ['rung', 'anh_dao', 'thanh_co', 'dam_lay', 'sa_mac', 'bang', 'nui_lua', 'bien_dao', 'troi_sao', 'dong_gio']

export const BAN_DO_LOFI: BanDo2D = {
  g: '/bk-ui/hs/skin/lofi/phieuluu2d',
  nenTheGioi: 'the_gioi.jpg',
  /** Đảo RỜI nổi trên biển mây hoàng hôn (như Khối vuông) ⇒ 2 hàng × 5 cột xếp so le theo thứ tự chủ đề; cùng thứ tự biome với RPG.
   *  Đảo cắt sát rồi đặt giữa khung VUÔNG 640 (tlLucDia = 1). */
  lucDia: [
    { biome: 'rung', x: 11, y: 31, w: 14 }, { biome: 'anh_dao', x: 30.5, y: 69, w: 14 }, { biome: 'thanh_co', x: 50, y: 30, w: 14 },
    { biome: 'dam_lay', x: 69.5, y: 69, w: 14 }, { biome: 'sa_mac', x: 89, y: 31, w: 14 }, { biome: 'bang', x: 11, y: 70, w: 14 },
    { biome: 'nui_lua', x: 30.5, y: 29, w: 14 }, { biome: 'bien_dao', x: 50, y: 70, w: 14 }, { biome: 'troi_sao', x: 69.5, y: 29, w: 14 },
    { biome: 'dong_gio', x: 89, y: 70, w: 14 },
  ],
  tienToLucDia: 'dao_',
  tlLucDia: 1,
  nhanDuoi: 0.5,
  nenVung: BIOME,
  nenChang: [],
  nenDang: BIOME,
  moc: ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'],
  vat: ['be_da', 'co_chinh_phuc', 'may_suong', 'la_ban'],
}

const Q = '/bk-ui/hs/skin/lofi/quai'
/** 16 loài thường + 4 boss (skin/the3d/loai.ts) — "bé tinh linh" tự thiết kế, giữ dáng cơ thể từng loài. */
export const QUAI_LOFI: Record<string, string> = Object.fromEntries(
  ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set', 'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua',
    'rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc'].map((l) => [l, `${Q}/${l}.webp`]),
)
