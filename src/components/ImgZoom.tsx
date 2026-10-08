import { useState } from 'react'
import { createPortal } from 'react-dom'

// Thumbnail ảnh evidence (report/tan/prep) — bấm để phóng to full-screen (Thùy 07-19: "leader duyệt
// chuẩn bị phòng chưa zoom được ảnh mà ops gửi thì duyệt kiểu gì"). Trước là <img> trơn không click được.
// `zoomSrc`: ảnh to khi phóng (mặc định = src) — thumbnail dùng bản thu nhỏ, phóng mới tải bản lớn.
export default function ImgZoom({ src, className, zoomSrc }: { src: string; className?: string; zoomSrc?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <img src={src} className={`${className ?? ''} cursor-zoom-in`} onClick={() => setOpen(true)} />
      {open && createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(false)}>
          <img src={zoomSrc ?? src} className="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain shadow-2xl" onClick={() => setOpen(false)} />
        </div>,
        document.body,
      )}
    </>
  )
}
