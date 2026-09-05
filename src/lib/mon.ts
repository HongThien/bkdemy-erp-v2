// Danh mục MÔN của hệ thống — 1 NGUỒN duy nhất. Thêm môn = sửa đúng ở đây.
// Giá trị = chuỗi hiển thị, khớp lop.mon / ung_vien.mon trong DB.
export const MON_LIST = ['Toán', 'KHTN', 'Tiếng Anh', 'Văn'] as const
export type Mon = typeof MON_LIST[number]
// Team LIÊN-MÔN (thấy nội dung mọi môn) — dùng chung cho hook useMonScope (ERP) và các bundle không có useStore (tool giải bài).
export const CROSS_MON_TEAMS = ['ops', 'media', 'marketing']

// ⚠ File này phải là HẰNG SỐ THUẦN (lib data-layer import nó) — hook useMonScope (scope④ theo môn,
// dính useStore) ĐÃ DỜI sang src/hooks/useMonScope.ts (08-29, app OPS: nằm chung file là mọi bundle
// import MON_LIST đều ăn theo mock/fixtures của useStore).
