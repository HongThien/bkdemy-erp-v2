// BẢNG MÀU 3D — style Halloween (25/10). Đêm tím, điểm sáng cam / vàng đèn — đúng bảng màu PHONG CÁCH CHUNG của design/DON-HANG-STYLE-HALLOWEEN.md
// (đo từ ảnh không khí). Bản đồ 2D chủ yếu là ảnh (skin/styles/halloweenBanDo2d.ts); bảng này tô phần code vẽ: nền sau tranh, đường mòn, cờ, sương,
// viền sáng, hình tạm. `quai` = màu quái giữ chỗ của cảnh 3D (cùng loài với RPG).
import type { BangMau3D } from './kieuMau'
import { RPG_3D } from './bangMauRpg'

export const HALLOWEEN_3D: BangMau3D = {
  troi: '#362350', suong: '#52316a',
  matTroi: '#ffe9b8', matTroiCuong: 1.6,
  hemiTroi: '#7a5aa0', hemiDat: '#3d1c23', hemiCuong: 1.4,
  nuocNong: '#3e4f8a', nuocSau: '#1f2550', bot: '#c9b3e0',
  vang: '#ffc063', cat: '#8d7a9a', duong: '#a98fb0', duongVien: '#1e1030', da: '#6e5f80',
  biome: {
    rung:     { dat: '#4a3560', dat2: '#3a2850', nui: '#5a4a6e', cay: '#cc6b2e', cay2: '#e8893f', than: '#5a3a2a', diem: '#ffc063' },
    anh_dao:  { dat: '#4f3566', dat2: '#3f2a55', nui: '#5f4f75', cay: '#e79ad0', cay2: '#c776c0', than: '#5a3a2a', diem: '#ffc063' },
    thanh_co: { dat: '#4a3560', dat2: '#3a2850', nui: '#6e5f80', cay: '#5f7a5a', cay2: '#7fa86a', than: '#5a3a2a', diem: '#ffc063' },
    dam_lay:  { dat: '#3f3a55', dat2: '#2f2c45', nui: '#55506a', cay: '#5f7a5a', cay2: '#7fa86a', than: '#4a3a2a', diem: '#ffe27a' },
    sa_mac:   { dat: '#8d7a9a', dat2: '#6e5f80', nui: '#a08aa8', cay: '#7fa86a', cay2: '#9cc48a', than: '#5a3a2a', diem: '#ffc063' },
    bang:     { dat: '#9aa8e0', dat2: '#7a88c8', nui: '#b8c4ee', cay: '#5f7a8a', cay2: '#c9d4f4', than: '#5a3a2a', diem: '#ffe9b8' },
    nui_lua:  { dat: '#4a2a3a', dat2: '#3a1f2c', nui: '#5a3040', cay: '#e8893f', cay2: '#ffb060', than: '#3a2020', diem: '#ff8a3a' },
    bien_dao: { dat: '#8d7a9a', dat2: '#6e5f80', nui: '#5f4f75', cay: '#5f7a5a', cay2: '#7fa86a', than: '#5a3a2a', diem: '#ffc063' },
    troi_sao: { dat: '#7a5aa0', dat2: '#5f4585', nui: '#8a6ab0', cay: '#c9b3e0', cay2: '#e0d0f0', than: '#4a3a6a', diem: '#ffc063' },
    dong_gio: { dat: '#8a6a3a', dat2: '#6e522a', nui: '#5f4f75', cay: '#c8963a', cay2: '#e0b050', than: '#5a3a2a', diem: '#ffc063' },
  },
  quai: RPG_3D.quai,
  hero: { nam: '#2a1740', nu: '#cc6b2e', vien: '#1e1030', toc: '#2a1740', da: '#f6ead9', gay: '#ffc063', phep: '#ffc063' },
}
