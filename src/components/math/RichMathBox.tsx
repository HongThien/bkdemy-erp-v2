// Ô soạn WYSIWYG dùng RichMath TRỰC TIẾP — "tuyệt đối không hiện latex, chỉ hiện công thức sửa được" (Thùy 06/09
// tối, cho chuỗi Hình). Cùng chuỗi kho ($…$) nên tương thích ngược với MathTextarea (value/onChange y hệt); chỉ
// khác BỀ MẶT soạn: không có ô raw-text ở giữa — gõ liền chữ + công thức như Word/MathType, công thức hiện đúng
// hình dạng ngay khi gõ (bấm $ hoặc Ctrl+M mở bảng dựng, click vào công thức đã có để sửa). Vẫn có nút ⤢ mở
// SoanModal full màn (cụm/thư mục/đổi tên điểm) khi cần soạn dài — Lưu ở đó nạp thẳng lại vào đây.
// ⚠ HIỆN CHƯA DÙNG Ở CHUỖI HÌNH (ChuoiSoan): Thùy 06/09 tối (3) chốt "ko giải ở màn hình con đâu, luôn luôn phóng
// to ra làm full màn hình" — nên ChuoiSoan bỏ hẳn ô gõ tại chỗ, chỉ hiện lời giải đã có (rendered) + nút mở
// SoanModal (đã tự WYSIWYG, không cần bọc thêm). Giữ file này lại — cùng chuỗi kho, cùng RichMath — cho lúc nào
// cần một ô WYSIWYG NGẮN/gõ tại chỗ thật (không phải mọi input đều đủ dài để đáng mở full màn).
import { useRef, useState, type ReactNode } from 'react'
import { RichMath, type RichMathHandle } from '../../soan/RichMath'
import { SoanModal } from '../../soan/SoanModal'
import MathPopup from './MathPopup'
import { findTemplateByCombo } from '../../lib/math/phimtat'
import { usePhimTat } from '../../store/useStore'
import '../../soan/soan.css'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  soanTitle?: string
  soanDeBai?: ReactNode
}
type Pop = { initial: string; display: boolean; el?: HTMLElement; anchor: { x: number; y: number }; startTemplate?: string }

export function RichMathBox({ value, onChange, placeholder, className, soanTitle, soanDeBai }: Props) {
  const ref = useRef<RichMathHandle>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pop, setPop] = useState<Pop | null>(null)
  const [soan, setSoan] = useState(false)
  const phimTat = usePhimTat()

  // Toạ độ mở popup: vị trí con trỏ trong contenteditable (Range.getBoundingClientRect() đủ dùng, không cần mirror
  // div như textarea) — dòng trống có thể trả rect toàn 0 → rơi về góc khung soạn.
  const caretXY = (): { x: number; y: number } => {
    const s = window.getSelection()
    if (s && s.rangeCount) {
      const r = s.getRangeAt(0).cloneRange(); r.collapse(true)
      const rect = r.getBoundingClientRect()
      if (rect.left || rect.top) return { x: rect.left, y: rect.bottom + 4 }
    }
    const r = wrapRef.current?.getBoundingClientRect()
    return r ? { x: r.left + 8, y: r.top + 24 } : { x: 200, y: 200 }
  }
  const commit = (latex: string) => {
    if (pop?.el) ref.current?.replaceMath(pop.el, latex)
    else ref.current?.insertMath(latex)
    setPop(null)
  }
  const cancel = () => { setPop(null); setTimeout(() => ref.current?.focus(), 50) }

  return (
    <div ref={wrapRef} className="relative">
      <RichMath ref={ref} initial={value} placeholder={placeholder} className={className}
        onChange={onChange}
        onRequestNew={() => setPop({ initial: '', display: false, anchor: caretXY() })}
        onEditMath={(el, latex) => { const r = el.getBoundingClientRect(); setPop({ initial: latex, display: el.dataset.display === '1', el, anchor: { x: r.left, y: r.bottom + 4 } }) }}
        onCombo={(combo) => { const id = findTemplateByCombo(phimTat, combo); if (!id) return false; setPop({ initial: '', display: false, anchor: caretXY(), startTemplate: id }); return true }} />
      <button type="button" tabIndex={-1} title="Mở trình soạn thảo (full màn: cụm, thư mục, đổi tên điểm)" onMouseDown={(e) => e.preventDefault()} onClick={() => setSoan(true)}
        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-7 items-center justify-center rounded border border-slate-200 bg-white/90 text-[13px] font-bold text-indigo-600 shadow-sm hover:border-indigo-400 hover:bg-indigo-50">⤢</button>
      {soan && (
        <SoanModal initial={value} title={soanTitle} deBai={soanDeBai}
          onSave={(raw) => { onChange(raw); ref.current?.setValue(raw) }} onClose={() => setSoan(false)} />
      )}
      {pop && <MathPopup initial={pop.initial} display={pop.display} anchor={pop.anchor} startTemplate={pop.startTemplate} onCommit={commit} onCancel={cancel} />}
    </div>
  )
}
