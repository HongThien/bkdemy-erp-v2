// SỔ HÌNH BẢN ĐỒ PHIÊU LƯU 2D + QUÁI — style Halloween (25/10). Ảnh nén bởi scripts/halloween-hinh.mjs vào public/bk-ui/hs/skin/halloween/phieuluu2d/ + quai/.
// Nguồn: Đơn H4 (nền thế giới · 10 đảo · 10 nền vùng · 10 nền dạng — đạt ngay lượt đầu, dải đường 72–76% · 6 mốc · bệ · mây · cờ · la bàn · 16 quái + 4 boss).
// Chưa có: nền chặng (Chang2D dùng nền dạng trước) · kit lục địa Đơn 12.
// 10 nền vùng trống ở giữa, vật dồn ra mép ⇒ điểm màn đấu đặt theo bố cục đường chung là vừa.
import type { BanDo2D } from '../kieu'

const BIOME = ['rung', 'anh_dao', 'thanh_co', 'dam_lay', 'sa_mac', 'bang', 'nui_lua', 'bien_dao', 'troi_sao', 'dong_gio']

export const BAN_DO_HALLOWEEN: BanDo2D = {
  g: '/bk-ui/hs/skin/halloween/phieuluu2d',
  nenTheGioi: 'the_gioi.jpg',
  /** Đảo RỜI nổi giữa biển mây đêm ⇒ 2 hàng × 5 cột xếp SO LE theo thứ tự chủ đề (cùng bố cục Đáng yêu, cùng thứ tự biome với RPG):
   *  cột 1·3·5 CAO, cột 2·4 THẤP hơn 10% — nhãn tên rộng tới 290px mà hai cột chỉ cách ~210px; cột ngoài lùi vào 14% để tên dài không bị mép màn cắt. */
  lucDia: [
    { biome: 'rung', x: 14, y: 25, w: 14 }, { biome: 'anh_dao', x: 32, y: 74, w: 14 }, { biome: 'thanh_co', x: 50, y: 25, w: 14 },
    { biome: 'dam_lay', x: 68, y: 74, w: 14 }, { biome: 'sa_mac', x: 86, y: 25, w: 14 }, { biome: 'bang', x: 14, y: 64, w: 14 },
    { biome: 'nui_lua', x: 32, y: 35, w: 14 }, { biome: 'bien_dao', x: 50, y: 64, w: 14 }, { biome: 'troi_sao', x: 68, y: 35, w: 14 },
    { biome: 'dong_gio', x: 86, y: 64, w: 14 },
  ],
  tienToLucDia: 'dao_',
  tlLucDia: 1,
  nhanDuoi: 0.4,
  nenVung: BIOME,
  nenChang: [],
  nenDang: BIOME,
  moc: ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'],
  vat: ['be_da', 'co_chinh_phuc', 'may_suong', 'la_ban'],
}

const Q = '/bk-ui/hs/skin/halloween/quai'
/** 16 loài thường + 4 boss (skin/the3d/loai.ts) — sinh vật Halloween to tròn, mặt "dỗi", tự thiết kế, giữ dáng cơ thể từng loài. */
export const QUAI_HALLOWEEN: Record<string, string> = Object.fromEntries(
  ['slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set', 'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua',
    'rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc'].map((l) => [l, `${Q}/${l}.webp`]),
)
