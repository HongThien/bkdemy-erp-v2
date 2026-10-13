// SINH TỰ ĐỘNG bởi scripts/dang-yeu-hinh.mjs — đừng sửa tay. LINH VẬT Home của style Đáng yêu (Đơn N1 #11–#12 + N2, 13/10) — hợp đồng LinhVatSong ở skin/kieu.ts.
// Mọi hình cùng khung 512×640, cùng chỗ đặt chân: co = cỏ + hoa dưới chân (đứng yên) · dung = thân đứng (tách từ hình gốc, đã đưa về khung tư thế) ·
// 9 tư thế vẽ riêng. soi = đường viền "sôi" (line boil) bằng bộ lọc SVG. Hình hiệu ứng rời (hoa · sao · vạch rung · mồ hôi · bụi · cỏ) nén sẵn ở song/fx_*.webp — chưa màn nào dùng.
import type { LinhVatSong } from '../kieu'
const S = '/bk-ui/hs/skin/dang_yeu/song'
export const LINH_VAT_DANG_YEU: { nam: LinhVatSong; nu: LinhVatSong } = {
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
