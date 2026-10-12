// Cỡ IN của ảnh đề theo từng câu (mm, bề rộng). Thùy 12/10: "in qua builder pdf ra ngoài không còn chuẩn" — ảnh không đặt
// width nên trình duyệt tự phóng/thu theo cột + max-height 60mm. Có số ở đây ⇒ ảnh in ĐÚNG bề rộng đó (cao theo tỉ lệ).
import { createContext } from 'react'

/** ma_cau → bề rộng mm. Rỗng/thiếu = để tự động như cũ. Provider đặt ở Doc (PrintView); view in khác không bọc ⇒ {}. */
export const AnhMmCtx = createContext<Record<string, number>>({})

/** Dùng ở Builder để chỉnh: map hiện tại + hàm đặt (null = bỏ, về tự động). */
export const AnhMmEditCtx = createContext<{ map: Record<string, number>; set: (ma: string, mm: number | null) => void }>({ map: {}, set: () => {} })
