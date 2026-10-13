// BẢNG MÀU 3D — style Đáng yêu (13/10). Pastel sáng, ngọt: trời xanh nhạt, cỏ non, hồng má, vàng bơ, nét nâu — đúng bảng màu PHONG CÁCH CHUNG của
// design/DON-HANG-STYLE-NHO-XINH.md. Bản đồ 2D chủ yếu là ảnh (skin/styles/dangYeuBanDo2d.ts); bảng này tô phần code vẽ: nền sau tranh, đường mòn, cờ,
// sương, viền sáng, hình tạm. `quai` = màu quái giữ chỗ của cảnh 3D (cùng loài với RPG).
import type { BangMau3D } from './kieuMau'
import { RPG_3D } from './bangMauRpg'

export const DANG_YEU_3D: BangMau3D = {
  troi: '#bfe3f2', suong: '#f4f9ea',
  matTroi: '#fff3d0', matTroiCuong: 2.9,
  hemiTroi: '#d8eef7', hemiDat: '#b7a48f', hemiCuong: 1.9,
  nuocNong: '#a9e0e6', nuocSau: '#6cb6d6', bot: '#fffdf8',
  vang: '#f6cf6b', cat: '#fff0c9', duong: '#f3e3c2', duongVien: '#4a342a', da: '#c9c0b4',
  biome: {
    rung:     { dat: '#cfe6b0', dat2: '#8fbf73', nui: '#c9c0b4', cay: '#8fbf73', cay2: '#b7d98f', than: '#a8795a', diem: '#f07fa0' },
    anh_dao:  { dat: '#cfe6b0', dat2: '#a8d28a', nui: '#d6ccc0', cay: '#ffb3c7', cay2: '#f07fa0', than: '#a8795a', diem: '#f07fa0' },
    thanh_co: { dat: '#cfe6b0', dat2: '#a8d28a', nui: '#e6dcc8', cay: '#8fbf73', cay2: '#b7d98f', than: '#b08a6a', diem: '#f6cf6b' },
    dam_lay:  { dat: '#c2e0a6', dat2: '#8fbf73', nui: '#b9c4b0', cay: '#7fb07a', cay2: '#a8d4a0', than: '#9a7a5c', diem: '#ffb3c7' },
    sa_mac:   { dat: '#fff0c9', dat2: '#f6dca0', nui: '#f1c98f', cay: '#8fbf73', cay2: '#b7d98f', than: '#b08a6a', diem: '#f8b98a' },
    bang:     { dat: '#fbfdff', dat2: '#d8ecf7', nui: '#bcdcee', cay: '#7fb6a6', cay2: '#d8ecf7', than: '#a8795a', diem: '#6c9bd1' },
    nui_lua:  { dat: '#f8cfa6', dat2: '#f1a878', nui: '#d98a6a', cay: '#f8b98a', cay2: '#ffb3c7', than: '#a8795a', diem: '#f07fa0' },
    bien_dao: { dat: '#fff0c9', dat2: '#cfe6b0', nui: '#e6dcc8', cay: '#8fbf73', cay2: '#b7d98f', than: '#b08a6a', diem: '#f8b98a' },
    troi_sao: { dat: '#dcd0f2', dat2: '#b9a6e0', nui: '#c8b8ea', cay: '#bfe3f2', cay2: '#e3d8f7', than: '#8a76b8', diem: '#f6cf6b' },
    dong_gio: { dat: '#f9e39a', dat2: '#f6cf6b', nui: '#d6ccc0', cay: '#b7d98f', cay2: '#f6cf6b', than: '#a8795a', diem: '#f07fa0' },
  },
  quai: RPG_3D.quai,
  hero: { nam: '#6c9bd1', nu: '#f07fa0', vien: '#4a342a', toc: '#4a342a', da: '#fde2cf', gay: '#f6cf6b', phep: '#ffb3c7' },
}
