// Tên HS hiển thị gọn = 2 từ cuối (vd "Nguyễn Thị Hồng Anh" → "Hồng Anh").
// Dùng ở các màn VẬN HÀNH (buổi học, chấm bài, ET/BTVN, kết quả, bổ trợ, điểm số, thành tích).
// GIỮ tên đầy đủ ở quản lý Học sinh / form / ô tìm kiếm / ghép phụ huynh (cần nhận diện + sửa).
export function tenNganHS(hoTen?: string | null): string {
  return (hoTen ?? '').trim().split(/\s+/).filter(Boolean).slice(-2).join(' ') || '?'
}
