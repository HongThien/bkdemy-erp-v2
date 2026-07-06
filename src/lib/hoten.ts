// Tên HS hiển thị gọn = 2 từ cuối (vd "Nguyễn Thị Hồng Anh" → "Hồng Anh").
// Dùng ở các màn VẬN HÀNH (buổi học, chấm bài, ET/BTVN, kết quả, bổ trợ, điểm số, thành tích).
// GIỮ tên đầy đủ ở quản lý Học sinh / form / ô tìm kiếm / ghép phụ huynh (cần nhận diện + sửa).
export function tenNganHS(hoTen?: string | null): string {
  return (hoTen ?? '').trim().split(/\s+/).filter(Boolean).slice(-2).join(' ') || '?'
}

// Tên hiển thị cho 1 DANH SÁCH (roster lớp/buổi…) — Thùy chốt 07-06: "2 HS trùng tên rút gọn (2 từ
// cuối) PHẢI ghi đủ họ tên, ở MỌI chỗ có danh sách lớp" (tránh nhầm ai với ai trong CÙNG 1 danh sách).
// Trả về mảng SONG SONG (cùng index) với mảng họ-tên đầu vào — người KHÔNG trùng vẫn rút gọn như cũ,
// chỉ người TRÙNG (≥2 người cùng danh sách ra cùng 1 tên rút gọn) mới bung đầy đủ, CẢ HAI/MỌI bên.
export function tenHienThiDs(hoTens: (string | null | undefined)[]): string[] {
  const gon = hoTens.map((h) => tenNganHS(h))
  const dem = new Map<string, number>()
  for (const g of gon) dem.set(g, (dem.get(g) ?? 0) + 1)
  return hoTens.map((h, i) => ((dem.get(gon[i]) ?? 0) > 1 ? (h ?? '').trim() || '?' : gon[i]))
}
