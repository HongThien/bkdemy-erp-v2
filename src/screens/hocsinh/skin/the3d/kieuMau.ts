// Hợp đồng BẢNG MÀU 3D của một style (một bảng màu duy nhất cho cả thế giới — tài liệu design/nghien-cuu-do-hoa-little-habitats.md §2 #1).
// Màn/cảnh 3D CHỈ đọc màu qua đây, không gõ hex trong component (design/STYLE-HS.md). Thêm style = khai đủ bảng này.
export type MauBiome = {
  dat: string    // mặt đất chính
  dat2: string   // đất phụ / đồi
  nui: string    // đá núi
  cay: string    // tán cây
  cay2: string   // tán cây phụ
  than: string   // thân cây / gỗ
  diem: string   // điểm nhấn (hoa, pha lê, dung nham…)
}
export type MauQuai = { than: string; bung: string; diem: string }
export type BangMau3D = {
  troi: string; suong: string                 // nền cảnh + sương mù xa
  matTroi: string; matTroiCuong: number       // đèn chính (giờ vàng)
  hemiTroi: string; hemiDat: string; hemiCuong: number
  nuocNong: string; nuocSau: string; bot: string
  vang: string; cat: string; duong: string; duongVien: string; da: string
  biome: Record<string, MauBiome>
  quai: Record<string, MauQuai>
  hero: { nam: string; nu: string; vien: string; toc: string; da: string; gay: string; phep: string }
}
