// Danh mục MÔN của hệ thống — 1 NGUỒN duy nhất. Thêm môn = sửa đúng ở đây.
// Giá trị = chuỗi hiển thị, khớp lop.mon / ung_vien.mon trong DB.
export const MON_LIST = ['Toán', 'KHTN', 'Tiếng Anh', 'Văn'] as const
export type Mon = typeof MON_LIST[number]
// Môn có GÓC HỌC TẬP trong app Học sinh (Thùy 01/10: "chọn môn Toán, KHTN, Tiếng Anh") — thứ tự = thứ tự nút ở thanh chọn môn.
// Môn có lớp mà không nằm đây (Văn) thì app HS chưa hiện. Mở thêm môn = thêm vào đây (kho câu: `_kho_co_mon` ở DB).
export const MON_APP_HS = ['Toán', 'KHTN', 'Tiếng Anh'] as const
// Team LIÊN-MÔN (thấy nội dung mọi môn) — dùng chung cho hook useMonScope (ERP) và các bundle không có useStore (tool giải bài).
export const CROSS_MON_TEAMS = ['ops', 'media', 'marketing']

// ⚠ File này phải là HẰNG SỐ THUẦN (lib data-layer import nó) — hook useMonScope (scope④ theo môn,
// dính useStore) ĐÃ DỜI sang src/hooks/useMonScope.ts (08-29, app OPS: nằm chung file là mọi bundle
// import MON_LIST đều ăn theo mock/fixtures của useStore).
