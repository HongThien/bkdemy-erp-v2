// BẢNG MÀU 3D — style Lo-fi chill (12/10). Tông hoàng hôn ấm: trời cam đào → tím nhạt, nắng vàng mật, cỏ rêu, gỗ nâu — đúng bảng màu PHONG CÁCH CHUNG
// của design/DON-HANG-STYLE-LOFI.md. Bản đồ 2D chủ yếu là ảnh (skin/styles/lofiBanDo2d.ts); bảng này tô phần code vẽ: nền sau tranh, đường mòn, cờ,
// sương, viền sáng, hình tạm. `quai` = màu quái giữ chỗ của cảnh 3D (cùng loài với RPG).
import type { BangMau3D } from './kieuMau'
import { RPG_3D } from './bangMauRpg'

export const LOFI_3D: BangMau3D = {
  troi: '#e9a98a', suong: '#f6d9c4',
  matTroi: '#ffd59a', matTroiCuong: 2.8,
  hemiTroi: '#f4c7a6', hemiDat: '#7a5a44', hemiCuong: 1.7,
  nuocNong: '#7fc7c4', nuocSau: '#3f7f9a', bot: '#fff6ea',
  vang: '#f0a35e', cat: '#ecd9b4', duong: '#c9a57a', duongVien: '#7a5a44', da: '#a59a8c',
  biome: {
    rung:     { dat: '#8aa868', dat2: '#5f7f4a', nui: '#948c7c', cay: '#4f7a48', cay2: '#86a862', than: '#7a5638', diem: '#f0a35e' },
    anh_dao:  { dat: '#93ad70', dat2: '#68874f', nui: '#9a9084', cay: '#efb0c4', cay2: '#dc8ea8', than: '#73503a', diem: '#dc8ea8' },
    thanh_co: { dat: '#a5a085', dat2: '#847f6c', nui: '#b4ab98', cay: '#66875a', cay2: '#93a877', than: '#6e5a46', diem: '#f0a35e' },
    dam_lay:  { dat: '#6f8658', dat2: '#4c6444', nui: '#646a54', cay: '#4a6e46', cay2: '#84a06c', than: '#5e4a38', diem: '#f2b8c8' },
    sa_mac:   { dat: '#e6c98c', dat2: '#d2a462', nui: '#bf8356', cay: '#74995a', cay2: '#a9bd72', than: '#8a6843', diem: '#c96f4a' },
    bang:     { dat: '#e8eef2', dat2: '#c2d6e2', nui: '#a8c0d2', cay: '#4a6e58', cay2: '#d3e6ee', than: '#73604e', diem: '#ffd59a' },
    nui_lua:  { dat: '#6a544c', dat2: '#463732', nui: '#352b2a', cay: '#7d4c3a', cay2: '#f08a4a', than: '#4d3c33', diem: '#f08a4a' },
    bien_dao: { dat: '#efdcae', dat2: '#8fb878', nui: '#b9ab90', cay: '#5c9a62', cay2: '#93c88c', than: '#977756', diem: '#c96f4a' },
    troi_sao: { dat: '#8a80c2', dat2: '#6a62a4', nui: '#aaa0dc', cay: '#8cc4cf', cay2: '#bba6ea', than: '#5c4e88', diem: '#ffe2a8' },
    dong_gio: { dat: '#a3bd62', dat2: '#dcb85a', nui: '#a09a88', cay: '#6f9652', cay2: '#e6c66a', than: '#7a5638', diem: '#c96f4a' },
  },
  quai: RPG_3D.quai,
  hero: { nam: '#566b3a', nu: '#b4532e', vien: '#f0a35e', toc: '#2e2622', da: '#f3d2b0', gay: '#7a5638', phep: '#ffd59a' },
}
