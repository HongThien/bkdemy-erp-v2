// SoanModal — trình soạn thảo FULL MÀN mở từ bên trong ERP (nút ⤢ ở mọi MathTextarea: đề, lời giải, phương án, lý thuyết…).
// Nhận chuỗi kho của ô đang soạn → người soạn làm việc WYSIWYG → Lưu → trả chuỗi kho về ĐÚNG ô đó → form ERP bấm Lưu như thường.
// z-[90]: nằm trên mọi modal kho (Shell/CauModal z thấp hơn) — mở từ trong modal vẫn nổi lên trên.
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { SoanWorkspace } from './SoanWorkspace'
import './soan.css'

export function SoanModal({ initial, title, deBai, onSave, onClose }: { initial: string; title?: string; deBai?: ReactNode; onSave: (raw: string) => void; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[90] bg-slate-100" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      <SoanWorkspace initial={initial} title={title} deBai={deBai} onClose={onClose} onSave={(raw) => { onSave(raw); onClose() }} />
    </div>,
    document.body,
  )
}
