// Khung 9-slice cho ảnh đã CẮT sạch viền trong suốt (KhungCat — scripts/anime-ui-nv-tt.mjs). Dùng border-image CSS:
// slice lấy theo px trên ảnh đã nén; độ dày góc HIỂN THỊ (vien) theo bảng "Border hiển thị iPad/phone" trong DESIGN.md của kit.
// Ruột khung gần trong suốt ⇒ đặt nền navy mờ phía dưới (RUOT) để chữ sáng đọc rõ.
import type { CSSProperties } from 'react'
import type { KhungCat } from './anhGiaoDien'

export function kieuKhungCat(k: KhungCat, vien: number, them?: CSSProperties): CSSProperties {
  return {
    borderStyle: 'solid', borderWidth: vien,
    borderImage: `url(${k.src}) ${k.t} ${k.r} ${k.b} ${k.l} fill / ${vien}px / 0 stretch`,
    ...them,
  }
}
/** nền ruột khung (navy 92% theo kit) */
export const RUOT = 'rgba(8,18,37,0.92)'
