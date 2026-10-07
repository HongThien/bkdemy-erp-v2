// BẢNG MÀU 3D — style Khối vuông (07/10, Đơn K3). Style SÁNG: trời hoàng hôn pastel hồng-cam-tím, nắng vàng hồng, nước xanh ngọc, cỏ khối xanh —
// đúng bảng màu PHONG CÁCH CHUNG của design/DON-HANG-STYLE-KHOI.md. Bản đồ 2D chủ yếu là ảnh (skin/styles/khoiBanDo2d.ts); bảng này tô
// phần code vẽ: nền sau tranh, đường mòn, cờ, sương, viền sáng, hình tạm. `quai` = màu quái giữ chỗ của cảnh 3D (cùng loài với RPG).
import type { BangMau3D } from './kieuMau'
import { RPG_3D } from './bangMauRpg'

export const KHOI_3D: BangMau3D = {
  troi: '#c9a7e8', suong: '#f5d6e6',
  matTroi: '#ffe9c7', matTroiCuong: 3.0,
  hemiTroi: '#f7c6a3', hemiDat: '#8b5a2b', hemiCuong: 1.8,
  nuocNong: '#47c1c9', nuocSau: '#2c8fd6', bot: '#ffffff',
  vang: '#f2c94c', cat: '#e9d8a6', duong: '#b8945f', duongVien: '#5f5f5f', da: '#8e8e8e',
  biome: {
    rung:     { dat: '#6dbb45', dat2: '#3f7d26', nui: '#8e8e8e', cay: '#3f7d26', cay2: '#6dbb45', than: '#8b5a2b', diem: '#e04b3c' },
    anh_dao:  { dat: '#6dbb45', dat2: '#3f7d26', nui: '#8e8e8e', cay: '#f5a9c8', cay2: '#e57fa8', than: '#6f4a2b', diem: '#e57fa8' },
    thanh_co: { dat: '#9aa08c', dat2: '#7c8478', nui: '#b0aea0', cay: '#5e8a5a', cay2: '#8aa87a', than: '#6a5a4a', diem: '#f2c94c' },
    dam_lay:  { dat: '#5f7d45', dat2: '#3f5a33', nui: '#5a6350', cay: '#3f6b3a', cay2: '#7aa06a', than: '#5a4a3a', diem: '#b8e060' },
    sa_mac:   { dat: '#e9d08a', dat2: '#d8a85c', nui: '#c08050', cay: '#5f9a3a', cay2: '#a8c06a', than: '#8a6a40', diem: '#e04b3c' },
    bang:     { dat: '#e8f4fb', dat2: '#bcdcf0', nui: '#9ec4e0', cay: '#2f6a4a', cay2: '#cfe9f6', than: '#6f5a48', diem: '#2c8fd6' },
    nui_lua:  { dat: '#5c4a46', dat2: '#3a2e2c', nui: '#2b2424', cay: '#7a4a3a', cay2: '#ff8a3c', than: '#4a3a32', diem: '#ff8a3c' },
    bien_dao: { dat: '#f0dca0', dat2: '#6dbb45', nui: '#b7a98d', cay: '#3f9a4a', cay2: '#89d48a', than: '#9a7a52', diem: '#e04b3c' },
    troi_sao: { dat: '#8a7fd0', dat2: '#6a60b0', nui: '#b0a4f0', cay: '#7fd0e0', cay2: '#c0a0ff', than: '#5a4a90', diem: '#ffe9a0' },
    dong_gio: { dat: '#8fc84a', dat2: '#d8b34a', nui: '#9a9a8c', cay: '#5f9a3a', cay2: '#e8c45a', than: '#8b5a2b', diem: '#e04b3c' },
  },
  quai: RPG_3D.quai,
  hero: { nam: '#3f6b3a', nu: '#2c8fd6', vien: '#f2c94c', toc: '#2b2b2b', da: '#f2cfa8', gay: '#8b5a2b', phep: '#47c1c9' },
}
