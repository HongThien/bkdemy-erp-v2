// MathDoc = RichMath + toàn bộ dây nối "cụm": click/gõ tắt/phím tắt cụm → chèn; `$`/Ctrl+M → bảng dựng; click công thức
// → sửa (+ nút "Đổi tên điểm" nếu công thức có tên điểm); cụm-ĐOẠN có TÊN ĐIỂM → bảng đổi tên điểm trước khi chèn (bộ
// điểm nhớ theo bài). Dùng ở 2 chỗ: vùng soạn chính (AppSoan, bộ điểm do App giữ để hiện chip) và ô soạn cụm-đoạn trong
// CumModal (bộ điểm nội bộ).
// 08/09 Thùy: "gõ phím tắt thì ra ĐÚNG công thức đấy; muốn chuyển điểm thì click vào công thức rồi mới có option" →
// cụm CÔNG THỨC chèn thẳng, không hỏi; đổi tên điểm dời sang bảng Sửa công thức. Cụm ĐOẠN vẫn hỏi trước (điểm nằm rải
// trong cả lời văn lẫn nhiều công thức — sửa sau từng công thức thì mất luôn phần chữ).
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { RichMath, type RichMathHandle } from './RichMath'
import { MathBuilder } from './MathBuilder'
import { DoiDiemModal } from './DoiDiemModal'
import { timDiem } from './diem'
import { findCumByCombo, findCumByGoTat, hasBlank, insertRawOf, needsFill, type Cum } from './cum'
import { fixAccentScript } from '../lib/math/latex-fix'

export type DiemMap = Record<string, string>
export type MathDocHandle = RichMathHandle & { useCum: (c: Cum) => void }
type Modal =
  | { kind: 'new'; prefill?: string }
  | { kind: 'edit'; el: HTMLElement; latex: string }
  | { kind: 'diem'; cum: Cum; raw: string; diem: string[] }
  | { kind: 'diem_edit'; el: HTMLElement; raw: string; diem: string[] }   // đổi tên điểm của 1 công thức ĐÃ có trong bài
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
  // Cụm công thức có ô trống → bảng dựng nạp sẵn để điền · cụm ĐOẠN có tên điểm → hỏi đổi tên · còn lại → chèn thẳng
  // (cụm công thức có tên điểm CŨNG chèn thẳng — đổi điểm sau bằng click vào công thức).
  const useCum = (c: Cum) => {
    if (needsFill(c)) { setModal({ kind: 'new', prefill: c.noiDung }); return }
    const raw = insertRawOf(c)
    const diem = c.loai === 'doan' ? timDiem(raw) : []
    if (diem.length) setModal({ kind: 'diem', cum: c, raw, diem })
    else ed.current?.insertRaw(raw)
  }
  // GÕ TẮT CÓ THAM SỐ (Thùy 08/09: "gocabc cho góc ABC, nhưng góc MIN thì không thể đặt phím tắt cho từng góc — hệ
  // phải hiểu `goc` là ký hiệu góc, phần sau là tên góc: goc_ABC"). Luật: từ = <gõ tắt cụm>_<tham số>; cụm phải có ô
  // trống `#?`; tham số tách bằng "," điền lần lượt vào các ô (ss_AB,CD → AB ∥ CD; goc_A_1 → chỉ tách ở "_" ĐẦU nên
  // tham số = A_1). Điền đủ → chèn thẳng; còn ô trống (thiếu tham số) → mở bảng dựng với phần đã điền để gõ nốt.
  // Gõ tắt NGUYÊN (goc) vẫn như cũ → bảng dựng với ô trống.
  const useCumVoi = (c: Cum, args: string[]) => {
    let k = 0
    const filled = c.noiDung.replace(/#\?/g, () => args[k++]?.trim() || '#?')
    if (hasBlank(filled)) { setModal({ kind: 'new', prefill: filled }); return }
    ed.current?.insertRaw(`$${fixAccentScript(filled)}$`)
  }
  const resolveGoTat = (w: string): (() => void) | null => {
    const c = findCumByGoTat(cumsRef.current, w)
    if (c) return () => useCum(c)
    const i = w.indexOf('_')
    if (i <= 0) return null
    const base = findCumByGoTat(cumsRef.current, w.slice(0, i))
    if (!base || base.loai !== 'cong_thuc' || !hasBlank(base.noiDung)) return null
    const args = w.slice(i + 1).split(',')
    return () => useCumVoi(base, args)
  }
  // Nút trong bảng Sửa công thức: chỉ hiện khi công thức có tên điểm. Đổi xong thay đúng khối đó, nhớ bộ điểm cho bài.
  const nutDoiDiem = (el: HTMLElement, latex: string) => {
    const raw = `$${latex}$`
    const diem = timDiem(raw)
    if (!diem.length) return null
    return (
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setModal({ kind: 'diem_edit', el, raw, diem })}
        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700">
        Đổi tên điểm <span className="font-mono text-slate-400">{diem.join(' ')}</span>
      </button>
    )
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
        resolveGoTat={resolveGoTat} />
      {modal?.kind === 'new' && (
        <MathBuilder title="Chèn công thức" initial={modal.prefill ?? ''} cums={cums} onCancel={closeModal}
          onCommit={(latex) => { setModal(null); ed.current?.insertMath(latex); refocus() }} />
      )}
      {modal?.kind === 'edit' && (
        <MathBuilder title="Sửa công thức" initial={modal.latex} cums={cums} commitLabel="Cập nhật" onCancel={() => { modal.el.classList.remove('rm-f--sel'); closeModal() }}
          onCommit={(latex) => { const el = modal.el; setModal(null); ed.current?.replaceMath(el, latex); refocus() }}
          footer={nutDoiDiem(modal.el, modal.latex)} />
      )}
      {modal?.kind === 'diem' && (
        <DoiDiemModal ten={modal.cum.ten} raw={modal.raw} diem={modal.diem} initialMap={map} onCancel={closeModal}
          onCommit={(raw, m) => { setModal(null); setMap({ ...map, ...m }); ed.current?.insertRaw(raw); refocus() }} />
      )}
      {modal?.kind === 'diem_edit' && (
        <DoiDiemModal ten="công thức đang sửa" raw={modal.raw} diem={modal.diem} initialMap={map} commitLabel="Cập nhật"
          onCancel={() => { modal.el.classList.remove('rm-f--sel'); closeModal() }}
          onCommit={(raw, m) => { const el = modal.el; setModal(null); setMap({ ...map, ...m }); ed.current?.replaceMath(el, raw.replace(/^\$|\$$/g, '')); refocus() }} />
      )}
    </>
  )
})
