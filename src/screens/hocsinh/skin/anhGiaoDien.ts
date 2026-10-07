// KIỂU DỮ LIỆU ảnh giao diện từ các kit Đơn 15–18 (Nhiệm vụ · Thành tựu): khung 9-slice CẮT theo sourceRect (bỏ vùng trong suốt quanh khung) + icon đã nén.
// Style nào khai `anhNv` / `anhTt` (RPG) thì 2 màn vẽ bằng ảnh; style không khai ⇒ màn tự vẽ bằng code (khung đơn sắc) như trước.
/** Khung 9-slice đã cắt sạch viền trong suốt: w×h = kích thước ảnh sau khi cắt+nén; l/r/t/b = độ dày góc (px trên ảnh đã nén). */
export type KhungCat = { src: string; w: number; h: number; l: number; r: number; t: number; b: number }
export type AnhNv = {
  khoi: KhungCat; tieuDe: KhungCat; vi: KhungCat; nhiemVu: KhungCat; nut: KhungCat
  icon: { so: string; ngay: string; tuan: string; thang: string; luyenYeu: string; chamDeu: string; luyenNhieu: string; benBi: string; quay: string; ngocDht: string; tinhTheExp: string }
}
export type AnhTt = {
  thanhTuu: KhungCat; tongKet: KhungCat; nutNhan: KhungCat; nhanQua: KhungCat
  icon: { huyHieu: string; album: string; tinhTheExp: string; giaiTienBo: string; theoMa: Record<string, string> }
}
