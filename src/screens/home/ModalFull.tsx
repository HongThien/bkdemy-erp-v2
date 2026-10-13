// Popup lớn dùng chung cho các box thu gọn trên Trang chính: bấm box nhỏ ⇒ mở bản đầy đủ ở đây.
// Đóng bằng ✕, Esc, hoặc bấm ra ngoài.
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export default function ModalFull({ tieuDe, onDong, children, cao = '82vh' }: { tieuDe: string; onDong: () => void; children: ReactNode; cao?: string }) {
  useEffect(() => {
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong() }
    document.addEventListener('keydown', phim)
    return () => document.removeEventListener('keydown', phim)
  }, [onDong])
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-3 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onDong() }}>
      <div className="flex w-[min(1180px,96vw)] flex-col overflow-hidden rounded-2xl bg-[#f5f5f7] shadow-2xl" style={{ height: cao, maxHeight: '94vh' }}>
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-5 py-2.5">
          <h3 className="text-[15px] font-bold text-slate-800">{tieuDe}</h3>
          <button onClick={onDong} title="Đóng (Esc)" className="ml-auto rounded-md px-2 py-1 text-[18px] leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
