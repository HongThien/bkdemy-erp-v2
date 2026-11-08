// SINH TỰ ĐỘNG bởi scripts/halloween-hinh.mjs — đừng sửa tay. BÉ MA Home của style Halloween (Đơn H1 #11–#12 + H2, 25/10) — hợp đồng LinhVatSong ở skin/kieu.ts.
// Mọi hình cùng khung 512×640, cùng chỗ tà váy chạm đất: co = ĐẾ (bóng + lá thu + bí, vẽ riêng — đứng yên) · dung = thân đứng (tách khỏi lá của hình gốc,
// đã đưa về khung tư thế) · 9 tư thế vẽ riêng (an = nam ăn kẹo mút / nữ thổi nến). soi = đường viền "sôi" bằng bộ lọc SVG.
// Hình hiệu ứng rời (sao · vạch rung · mồ hôi · khói · lá thu · dơi) nén sẵn ở song/fx_*.webp — chưa màn nào dùng.
import type { LinhVatSong } from '../kieu'
const S = '/bk-ui/hs/skin/halloween/song'
export const LINH_VAT_HALLOWEEN: { nam: LinhVatSong; nu: LinhVatSong } = {
  nam: {
    rong: 512, cao: 640, soi: true,
    co: `${S}/nam/co.webp`, dung: `${S}/nam/dung.webp`, chopMat: `${S}/nam/chop_mat.webp`,
    vay: [`${S}/nam/vay_1.webp`, `${S}/nam/vay_2.webp`], vui: `${S}/nam/vui.webp`, lo: `${S}/nam/lo.webp`, ngu: `${S}/nam/ngu.webp`,
    an: [`${S}/nam/an_1.webp`, `${S}/nam/an_2.webp`], mungKhoc: `${S}/nam/mung_khoc.webp`,
  },
  nu: {
    rong: 512, cao: 640, soi: true,
    co: `${S}/nu/co.webp`, dung: `${S}/nu/dung.webp`, chopMat: `${S}/nu/chop_mat.webp`,
    vay: [`${S}/nu/vay_1.webp`, `${S}/nu/vay_2.webp`], vui: `${S}/nu/vui.webp`, lo: `${S}/nu/lo.webp`, ngu: `${S}/nu/ngu.webp`,
    an: [`${S}/nu/an_1.webp`, `${S}/nu/an_2.webp`], mungKhoc: `${S}/nu/mung_khoc.webp`,
  },
}
