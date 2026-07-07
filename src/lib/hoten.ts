// ⭐ 07-07 Thùy ĐẢO quyết định rút-gọn-2-từ-cuối (06-23→07-06): quá nhiều HS trùng/gần-trùng tên
// khiến rút gọn (kể cả bản "chỉ bung khi trùng CHÍNH XÁC 2 từ cuối" của 07-06) vẫn gây nhầm — QUAY LẠI
// hiện ĐẦY ĐỦ họ tên ở MỌI nơi (không riêng bổ trợ). Giữ NGUYÊN tên hàm + chữ ký (8+ call site khắp
// app) — chỉ đổi thân hàm về full name — để revert lại lần nữa (nếu cần) chỉ sửa 1 chỗ này.
export function tenNganHS(hoTen?: string | null): string {
  return (hoTen ?? '').trim() || '?'
}

// Trả mảng SONG SONG cùng index — nay = full name cho MỌI phần tử (không còn phân biệt trùng/không).
export function tenHienThiDs(hoTens: (string | null | undefined)[]): string[] {
  return hoTens.map((h) => tenNganHS(h))
}
