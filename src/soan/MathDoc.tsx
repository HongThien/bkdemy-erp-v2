// MathDoc = RichMath + toàn bộ dây nối "cụm": click/gõ tắt/phím tắt cụm → chèn; `$`/Ctrl+M → bảng dựng; click công thức
// → sửa; cụm có TÊN ĐIỂM → bảng đổi tên điểm trước khi chèn (bộ điểm nhớ theo bài). Dùng ở 2 chỗ: vùng soạn chính
// (AppSoan, bộ điểm do App giữ để hiện chip) và ô soạn cụm-đoạn trong CumModal (bộ điểm nội bộ).
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { RichMath, type RichMathHandle } from './RichMath'
import { MathBuilder } from './MathBuilder'
import { DoiDiemModal } from './DoiDiemModal'
import { timDiem } from './diem'
import { findCumByCombo, findCumByGoTat, insertRawOf, needsFill, type Cum } from './cum'

export type DiemMap = Record<string, string>
export type MathDocHandle = RichMathHandle & { useCum: (c: Cum) => void }
type Modal =
  | { kind: 'new'; prefill?: string }
  | { kind: 'edit'; el: HTMLElement; latex: string }
  | { kind: 'diem'; cum: Cum; raw: string; diem: string[] }
type Props = {
  initial: string; cums: Cum[]; className?: string; placeholder?: string; onChange?: (raw: string) => void
  diemMap?: DiemMap; onDiemMap?: (m: DiemMap) => void   // bộ điểm của bài (không truyền → tự giữ nội bộ)
}

export const MathDoc = forwardRef<MathDocHandle, Props>(function MathDoc({ initial, cums, className, placeholder, onChange, diemMap, onDiemMap }, ref) {
  const ed = useRef<RichMathHandle>(null)
  const [modal, setModal] = useState<Modal | null>(null)
  const [localMap, setLocalMap] = useState<DiemMap>({})
  const map = diemMap ?? localMap
  const setMap = (m: DiemMap) => { if (onDiemMap) onDiemMap(m); else setLocalMap(m) }
  const cumsRef = useRef(cums); cumsRef.current = cums

  // MathLive gỡ khỏi DOM còn dọn focus ASYNC → trả focus bằng setTimeout (không chỉ rAF), bài học HANDOFF.
  const refocus = () => setTimeout(() => ed.current?.focus(), 60)
  const closeModal = () => { setModal(null); refocus() }
  // Cụm công thức có ô trống → bảng dựng nạp sẵn để điền · có tên điểm → hỏi đổi tên · còn lại → chèn thẳng.
  const useCum = (c: Cum) => {
    if (needsFill(c)) { setModal({ kind: 'new', prefill: c.noiDung }); return }
    const raw = insertRawOf(c)
    const diem = timDiem(raw)
    if (diem.length) setModal({ kind: 'diem', cum: c, raw, diem })
    else ed.current?.insertRaw(raw)
  }

  useImperativeHandle(ref, () => ({
    useCum,
    insertMath: (l) => ed.current?.insertMath(l),
    insertRaw: (r) => ed.current?.insertRaw(r),
    replaceMath: (el, l) => ed.current?.replaceMath(el, l),
    getValue: () => ed.current?.getValue() ?? '',
    getSelectionRaw: () => ed.current?.getSelectionRaw() ?? '',
    setValue: (r) => ed.current?.setValue(r),
    focus: () => ed.current?.focus(),
  }))

  return (
    <>
      <RichMath ref={ed} initial={initial} placeholder={placeholder} className={className} onChange={onChange}
        onEditMath={(el, latex) => setModal({ kind: 'edit', el, latex })}
        onRequestNew={(prefill) => setModal({ kind: 'new', prefill })}
        onCombo={(combo) => { const c = findCumByCombo(cumsRef.current, combo); if (!c) return false; useCum(c); return true }}
        resolveGoTat={(w) => { const c = findCumByGoTat(cumsRef.current, w); return c ? () => useCum(c) : null }} />
      {modal?.kind === 'new' && (
        <MathBuilder title="Chèn công thức" initial={modal.prefill ?? ''} cums={cums} onCancel={closeModal}
          onCommit={(latex) => { setModal(null); ed.current?.insertMath(latex); refocus() }} />
      )}
      {modal?.kind === 'edit' && (
        <MathBuilder title="Sửa công thức" initial={modal.latex} cums={cums} commitLabel="Cập nhật" onCancel={() => { modal.el.classList.remove('rm-f--sel'); closeModal() }}
          onCommit={(latex) => { const el = modal.el; setModal(null); ed.current?.replaceMath(el, latex); refocus() }} />
      )}
      {modal?.kind === 'diem' && (
        <DoiDiemModal ten={modal.cum.ten} raw={modal.raw} diem={modal.diem} initialMap={map} onCancel={closeModal}
          onCommit={(raw, m) => { setModal(null); setMap({ ...map, ...m }); ed.current?.insertRaw(raw); refocus() }} />
      )}
    </>
  )
})
