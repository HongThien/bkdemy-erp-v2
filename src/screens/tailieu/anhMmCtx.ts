// Tuỳ chọn IN của ảnh đề theo từng câu (Thùy 12/10): bề rộng + ẩn/hiện. Trước đây ảnh không đặt width ⇒ trình duyệt tự phóng/thu
// theo cột + max-height 60mm ⇒ "tự phóng to rất xấu" và ảnh cầm thước in sai cm.
import { createContext } from 'react'

/** ma_cau → bề rộng mm khi IN (đã quy từ % ảnh gốc). Rỗng/thiếu = tự động. Provider đặt ở Doc (PrintView); view in khác không bọc ⇒ {}. */
export const AnhMmCtx = createContext<Record<string, number>>({})
/** ma_cau → in hình NỬA PHẢI (đề + ý bên trái) hay dưới đề — xem anhPhaiCua (lib/tailieu). View in không bọc ⇒ dưới như cũ. */
export const AnhPhaiCtx = createContext<(ma: string) => boolean>(() => false)

/** Builder: mm + % hiện tại, hàm đặt (null = về tự động) và cờ "3 chế độ hình" (Hình học Bài có thêm ô trống; nhánh khác chỉ hiện/ẩn). */
export const AnhMmEditCtx = createContext<{
  mm: Record<string, number>
  pct: Record<string, number>
  set: (ma: string, v: { pct: number; mm: number } | null) => void
  baChe: boolean
  phai?: (ma: string) => boolean                  // vị trí hình hiện tại (đã tính mặc định theo nhánh)
  setPhai?: (ma: string, v: boolean) => void      // có ⇒ AnhMmCtl hiện nút "Hình phải / Hình dưới"
}>({ mm: {}, pct: {}, set: () => {}, baChe: false })
