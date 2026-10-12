// Tuỳ chọn IN của ảnh đề theo từng câu (Thùy 12/10): bề rộng + ẩn/hiện. Trước đây ảnh không đặt width ⇒ trình duyệt tự phóng/thu
// theo cột + max-height 60mm ⇒ "tự phóng to rất xấu" và ảnh cầm thước in sai cm.
import { createContext } from 'react'

/** ma_cau → bề rộng mm khi IN (đã quy từ % ảnh gốc). Rỗng/thiếu = tự động. Provider đặt ở Doc (PrintView); view in khác không bọc ⇒ {}. */
export const AnhMmCtx = createContext<Record<string, number>>({})

/** Builder: mm + % hiện tại, hàm đặt (null = về tự động) và cờ "3 chế độ hình" (Hình học Bài có thêm ô trống; nhánh khác chỉ hiện/ẩn). */
export const AnhMmEditCtx = createContext<{
  mm: Record<string, number>
  pct: Record<string, number>
  set: (ma: string, v: { pct: number; mm: number } | null) => void
  baChe: boolean
}>({ mm: {}, pct: {}, set: () => {}, baChe: false })
