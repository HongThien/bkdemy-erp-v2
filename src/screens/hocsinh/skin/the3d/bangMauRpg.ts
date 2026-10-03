// BẢNG MÀU 3D — style Anime RPG ("giờ vàng" kỳ ảo: trời xanh đêm, nắng vàng thấp, nước ngọc). Pastel tiết chế, KHÔNG xanh chuối:
// màu gốc dịu, không khí do ánh sáng + sương tạo ra (nghien-cuu-do-hoa-little-habitats.md §3 chẩn đoán gốc).
import type { BangMau3D } from './kieuMau'

export const RPG_3D: BangMau3D = {
  troi: '#1b2150', suong: '#222c62',
  matTroi: '#ffd9a3', matTroiCuong: 3.1,
  hemiTroi: '#8ea4ee', hemiDat: '#c4b08a', hemiCuong: 1.7,
  nuocNong: '#56c4cf', nuocSau: '#27468f', bot: '#effcff',
  vang: '#e9c77b', cat: '#e6d3a3', duong: '#caa876', duongVien: '#8a6a42', da: '#b9b1a6',
  biome: {
    rung:     { dat: '#7fb069', dat2: '#5e9a55', nui: '#8d9a86', cay: '#4f9a52', cay2: '#7bbf62', than: '#8a6a4a', diem: '#f2b8d0' },
    bang:     { dat: '#dcecf7', dat2: '#b9d6ea', nui: '#a9c4de', cay: '#8cc3d8', cay2: '#cfe9f6', than: '#7e6b60', diem: '#8fd6ff' },
    nui_lua:  { dat: '#6b5a56', dat2: '#4a3b3a', nui: '#3a2e30', cay: '#7a4a3a', cay2: '#b85a3a', than: '#4a3a32', diem: '#ff8a3c' },
    bien_dao: { dat: '#e8d29a', dat2: '#8fcf9a', nui: '#b7a98d', cay: '#58b26a', cay2: '#89d48a', than: '#9a7a52', diem: '#ff9aa8' },
    sa_mac:   { dat: '#e3bd7d', dat2: '#d09a5c', nui: '#b5764a', cay: '#7fa65a', cay2: '#a8c06a', than: '#8a6a40', diem: '#f0e0a0' },
    dam_lay:  { dat: '#6f8a5c', dat2: '#4e6b4e', nui: '#5a6350', cay: '#4a7a56', cay2: '#7aa06a', than: '#5a4a3a', diem: '#b8e060' },
    thanh_co: { dat: '#9a9a8c', dat2: '#7c8478', nui: '#b0aea0', cay: '#5e8a5a', cay2: '#8aa87a', than: '#6a5a4a', diem: '#e9c77b' },
    troi_sao: { dat: '#8a7fd0', dat2: '#6a60b0', nui: '#b0a4f0', cay: '#7fd0e0', cay2: '#c0a0ff', than: '#5a4a90', diem: '#ffe9a0' },
  },
  quai: {
    slime_la:     { than: '#7ed68a', bung: '#2f8a4c', diem: '#3fae5e' },
    slime_lua:    { than: '#ff9068', bung: '#b8321f', diem: '#ffb347' },
    meo_bang:     { than: '#a8e6ff', bung: '#4f8fc0', diem: '#e6f8ff' },
    rua_da:       { than: '#b79a73', bung: '#6b5a40', diem: '#8fbf6a' },
    cu_dem:       { than: '#9a6bd6', bung: '#4a2a80', diem: '#f5e9a0' },
    ca_bong:      { than: '#5fb0e8', bung: '#2f6aa3', diem: '#bfe8ff' },
    nam_ma:       { than: '#d94f8a', bung: '#f4e3c1', diem: '#ffffff' },
    chim_set:     { than: '#ffd24a', bung: '#c4962a', diem: '#fff3a0' },
    tho_gio:      { than: '#e8eef8', bung: '#9aa8c0', diem: '#ffc0d0' },
    be_nham:      { than: '#a3abbd', bung: '#5c6478', diem: '#ffd34d' },
    sao_bien:     { than: '#ff8f7a', bung: '#c4503a', diem: '#ffe0a0' },
    ech_doc:      { than: '#7ad060', bung: '#3a7a2a', diem: '#c060d0' },
    dom_dom:      { than: '#ffe36a', bung: '#8a6a2a', diem: '#fff8c0' },
    soi_bang:     { than: '#8fb8e0', bung: '#4a6a90', diem: '#ffffff' },
    bo_giap:      { than: '#6a8a5a', bung: '#3a4a30', diem: '#e0a040' },
    ma_lua:       { than: '#ff7a50', bung: '#7a2a20', diem: '#ffe070' },
    rong_con:     { than: '#a366dd', bung: '#3d1a6e', diem: '#e9c77b' },
    golem_pha_le: { than: '#7fd0e8', bung: '#3a6a90', diem: '#ffffff' },
    phuong_hoang: { than: '#ff8a3c', bung: '#a8321f', diem: '#ffe070' },
    bach_tuoc:    { than: '#f0e8f8', bung: '#8a7aa0', diem: '#9a80d0' },
  },
  hero: { nam: '#3a56b4', nu: '#8a4ab4', vien: '#e9c77b', toc: '#2a1e3d', da: '#f2cfa8', gay: '#8a6a4a', phep: '#9fd8ff' },
}
