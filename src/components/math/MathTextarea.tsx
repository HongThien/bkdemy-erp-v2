// Textarea soạn nội dung CÓ công thức — bọc textarea hiện có, dùng CHUNG cho mọi ô soạn đề/lời giải
// (FormBaiToan · CauEditor/DangHub · NhapKho). Không đụng định dạng lưu: vẫn là text có $…$.
//   · Ctrl+M hoặc nút Σ → mở ô công thức (MathPopup) NGAY DƯỚI con trỏ → Enter chèn `$…$` tại con trỏ.
//   · Phím tắt tự gán bấm ngay trong textarea → mở ô công thức với mẫu đó đã chèn sẵn.
//   · Preview KaTeX bên dưới (khi có $): CLICK vào 1 công thức đã render → mở lại để sửa đúng công thức đó.
//   · Nút ⤢ → mở TRÌNH SOẠN THẢO full màn (src/soan — WYSIWYG, cụm/thư mục/đổi tên điểm) với nội dung ô này;
//     Lưu ở đó → nội dung về đúng ô này (form ERP bấm Lưu như thường). Thùy 05/09: "ở ERP muốn giải/soạn/sửa gì
//     có 1 option mở trình soạn thảo, soạn xong bấm save là tự lưu vào đúng chỗ mở ra".
import { forwardRef, useCallback, useLayoutEffect, useRef, useState, type TextareaHTMLAttributes } from 'react'
import { MathText, listMath } from '../../screens/kho/ui'
import { comboFromEvent, findTemplateByCombo } from '../../lib/math/phimtat'
import { usePhimTat } from '../../store/useStore'
import MathPopup from './MathPopup'
import { SoanModal } from '../../soan/SoanModal'

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> & {
  value: string
  onChange: (v: string) => void
  wrapClassName?: string   // class cho khung bọc (vd 'min-h-0 flex-1 flex flex-col' khi textarea phải giãn hết chỗ)
  preview?: boolean        // mặc định true — preview + click-để-sửa
  autoMaxPx?: number       // có = textarea tự co cao theo nội dung (như AutoTextarea cũ), tối đa autoMaxPx rồi cuộn
  soanTitle?: string       // tiêu đề hiện trên trình soạn thảo full màn (vd "Lời giải · DC000123")
}
type Pop = { initial: string; display: boolean; range: [number, number]; anchor: { x: number; y: number }; startTemplate?: string }

// Toạ độ viewport của con trỏ trong textarea (mirror div — textarea không có API caret position).
function caretXY(ta: HTMLTextAreaElement): { x: number; y: number } {
  const st = getComputedStyle(ta)
  const div = document.createElement('div')
  for (const p of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom', 'borderLeftWidth', 'borderTopWidth', 'boxSizing', 'width', 'tabSize', 'textIndent'] as const)
    div.style[p] = st[p]
  Object.assign(div.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word', top: '0', left: '-9999px', height: 'auto' })
  const pos = ta.selectionStart ?? ta.value.length
  div.textContent = ta.value.slice(0, pos)
  const span = document.createElement('span')
  span.textContent = ta.value.slice(pos) || '.'
  div.appendChild(span)
  document.body.appendChild(div)
  const r = ta.getBoundingClientRect()
  const lh = parseFloat(st.lineHeight) || parseFloat(st.fontSize) * 1.4 || 20
  const x = r.left + span.offsetLeft - ta.scrollLeft
  const y = r.top + span.offsetTop - ta.scrollTop + lh
  document.body.removeChild(div)
  return { x: Math.min(Math.max(x, r.left), r.right), y: Math.min(Math.max(y, r.top), r.bottom) }
}

export const MathTextarea = forwardRef<HTMLTextAreaElement, Props>(function MathTextarea(
  { value, onChange, className, wrapClassName, preview = true, autoMaxPx, soanTitle, onKeyDown, ...rest }, fwdRef,
) {
  const [soan, setSoan] = useState(false)
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  useLayoutEffect(() => {
    if (autoMaxPx == null) return
    const el = taRef.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, autoMaxPx)}px`
  }, [value, autoMaxPx])
  const setRef = useCallback((el: HTMLTextAreaElement | null) => {
    taRef.current = el
    if (typeof fwdRef === 'function') fwdRef(el)
    else if (fwdRef) (fwdRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
  }, [fwdRef])
  const [pop, setPop] = useState<Pop | null>(null)
  const phimTat = usePhimTat()

  const open = (startTemplate?: string) => {
    const ta = taRef.current; if (!ta) return
    const a = ta.selectionStart ?? value.length, b = ta.selectionEnd ?? a
    setPop({ initial: '', display: false, range: [a, b], anchor: caretXY(ta), startTemplate })
  }
  const commit = (latex: string) => {
    if (!pop) return
    const [a, b] = pop.range
    let w = pop.display ? `$$${latex}$$` : `$${latex}$`
    // Chèn sát công thức khác → "$5$$\frac34$" (regex $$…$$ dễ hiểu nhầm). Đệm 1 khoảng trắng khi kề dấu $.
    if (a > 0 && value[a - 1] === '$') w = ' ' + w
    if (value[b] === '$') w = w + ' '
    onChange(value.slice(0, a) + w + value.slice(b))
    setPop(null)
    const p = a + w.length
    // setTimeout (không chỉ rAF): MathLive gỡ khỏi DOM còn dọn focus async → focus sớm quá bị cướp lại về body.
    setTimeout(() => { const ta = taRef.current; if (!ta) return; ta.focus(); ta.setSelectionRange(p, p) }, 50)
  }
  const cancel = () => { setPop(null); setTimeout(() => taRef.current?.focus(), 50) }
  const onPreviewClick = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest?.('.mt-f') as HTMLElement | null
    if (!el) return
    const m = listMath(value)[Number(el.dataset.fi)]
    if (!m) return
    const r = el.getBoundingClientRect()
    setPop({ initial: m.latex, display: m.display, range: [m.start, m.end], anchor: { x: r.left, y: r.bottom } })
  }
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'm') { e.preventDefault(); open(); return }
    const combo = comboFromEvent(e)
    if (combo) { const id = findTemplateByCombo(phimTat, combo); if (id) { e.preventDefault(); open(id); return } }
    onKeyDown?.(e)
  }

  return (
    <div className={`relative ${wrapClassName ?? ''}`}>
      <textarea ref={setRef} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKey} className={className} {...rest} />
      <button type="button" tabIndex={-1} title="Chèn công thức (Ctrl+M)" onMouseDown={(e) => e.preventDefault()} onClick={() => open()}
        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-7 items-center justify-center rounded border border-slate-200 bg-white/90 text-[13px] font-bold text-indigo-600 shadow-sm hover:border-indigo-400 hover:bg-indigo-50">Σ</button>
      <button type="button" tabIndex={-1} title="Mở trình soạn thảo (full màn: cụm, thư mục, đổi tên điểm)" onMouseDown={(e) => e.preventDefault()} onClick={() => setSoan(true)}
        className="absolute right-9 top-1.5 z-10 flex h-6 w-7 items-center justify-center rounded border border-slate-200 bg-white/90 text-[13px] font-bold text-indigo-600 shadow-sm hover:border-indigo-400 hover:bg-indigo-50">⤢</button>
      {soan && <SoanModal initial={value} title={soanTitle} onSave={(raw) => onChange(raw)} onClose={() => { setSoan(false); setTimeout(() => taRef.current?.focus(), 50) }} />}
      {preview && value.includes('$') && (
        <div className="mt-1 shrink-0 rounded-md border border-dashed border-indigo-200 bg-indigo-50/30 px-2 py-1 text-[13px] leading-relaxed text-slate-700" title="Click vào một công thức để sửa" onClick={onPreviewClick}>
          <MathText editable>{value}</MathText>
        </div>
      )}
      {pop && <MathPopup initial={pop.initial} display={pop.display} anchor={pop.anchor} startTemplate={pop.startTemplate} onCommit={commit} onCancel={cancel} />}
    </div>
  )
})
