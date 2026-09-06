// Vùng soạn WYSIWYG — chữ và công thức nằm CHUNG một dòng, gõ liền mạch như Word/MathType (Thùy 04/09:
// "chọn công thức nào hiện công thức đấy, không có code LaTeX gì cả").
//   · Chữ: gõ thẳng vào contenteditable (native → IME tiếng Việt Telex/Unikey chạy 100%, KHÔNG qua MathLive).
//   · Công thức: <span.rm-f contenteditable=false> nguyên khối (KaTeX). Click → sửa. Backspace 1 phát xoá cả khối.
//   · Gõ `$` hoặc Ctrl+M → app mở bảng dựng công thức (MathBuilder) → chèn ngay tại con trỏ.
//   · Gõ tắt: "tgbn" rồi Space → thay bằng cụm (app tra bảng cụm qua resolveGoTat).
//   · Phím tắt cụm (Ctrl+Alt+…): app tra bảng qua onCombo.
//   · Undo/Redo TỰ LÀM (stack chuỗi kho) — undo native của trình duyệt vỡ ngay khi ta chèn node bằng tay.
// Mô hình DOM phẳng + serialize/deserialize ở doc.ts. Component KHÔNG biết gì về kho / cụm / DB.
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { ZW, fragmentFrom, mathSpan, renderMath, serialize } from './doc'
import { comboFromEvent } from '../lib/math/phimtat'

export type RichMathHandle = {
  insertMath: (latex: string) => void                 // chèn công thức mới tại con trỏ (hoặc vị trí con trỏ cuối cùng)
  insertRaw: (raw: string) => void                    // chèn 1 đoạn chuỗi kho (text + $…$) tại con trỏ — cụm-đoạn, dán
  replaceMath: (el: HTMLElement, latex: string) => void // thay công thức đang sửa
  getValue: () => string                                // chuỗi kho ($…$)
  getSelectionRaw: () => string                         // đoạn đang bôi đen → chuỗi kho ('' nếu không bôi / ngoài vùng)
  setValue: (raw: string) => void                       // nạp lại toàn bộ (reset lịch sử undo)
  focus: () => void
}
type Props = {
  initial: string
  placeholder?: string
  className?: string
  onChange?: (raw: string) => void
  onEditMath?: (el: HTMLElement, latex: string) => void
  onRequestNew?: (prefill?: string) => void            // gõ $ / Ctrl+M (prefill = cụm có ô trống từ gõ tắt)
  onCombo?: (combo: string) => boolean                  // trả true = đã xử lý (chặn mặc định)
  // Từ vừa gõ → hành động chèn (null = không phải gõ tắt). 2 pha: RichMath xoá từ + đặt con trỏ XONG mới gọi hành động,
  // nên hành động chỉ việc chèn tại con trỏ (insertRaw / mở bảng dựng…) — không phải tự lo xoá chữ.
  resolveGoTat?: (word: string) => (() => void) | null
}
const isBr = (n: Node | null): n is HTMLBRElement => !!n && n instanceof HTMLElement && n.tagName === 'BR'
const HIST_MAX = 200

export const RichMath = forwardRef<RichMathHandle, Props>(function RichMath(
  { initial, placeholder, className, onChange, onEditMath, onRequestNew, onCombo, resolveGoTat }, ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const savedRange = useRef<Range | null>(null)       // range cuối cùng nằm TRONG vùng soạn (giữ khi click ra bảng cụm)
  const hist = useRef<string[]>([initial])
  const hIdx = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const cb = useRef({ onChange, onEditMath, onRequestNew, onCombo, resolveGoTat })
  cb.current = { onChange, onEditMath, onRequestNew, onCombo, resolveGoTat }

  // Chrome cần <br> giữ chỗ ở CUỐI khối để dòng trống cuối (sau Enter) hiện ra + đặt được con trỏ. serialize bỏ nó.
  const ensureTail = () => {
    const r = rootRef.current; if (!r) return
    if (!isBr(r.lastChild)) r.appendChild(document.createElement('br'))
    r.classList.toggle('rm-doc--empty', serialize(r) === '')
  }
  const load = (raw: string) => {
    const r = rootRef.current; if (!r) return
    r.innerHTML = ''
    r.appendChild(fragmentFrom(raw))
    ensureTail()
  }
  const pushHist = (raw: string) => {
    if (hist.current[hIdx.current] === raw) return
    hist.current = hist.current.slice(0, hIdx.current + 1)
    hist.current.push(raw)
    if (hist.current.length > HIST_MAX) hist.current.shift()
    hIdx.current = hist.current.length - 1
  }
  // Báo thay đổi. Gõ chữ liên tục → gom vào 1 mốc undo (400ms); thao tác rời (chèn/xoá công thức, Enter, dán) → mốc ngay.
  const emit = (immediate: boolean) => {
    const r = rootRef.current; if (!r) return
    ensureTail()
    const raw = serialize(r)
    cb.current.onChange?.(raw)
    window.clearTimeout(timer.current)
    if (immediate) pushHist(raw)
    else timer.current = window.setTimeout(() => pushHist(raw), 400)
  }

  useEffect(() => { load(initial) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const h = () => {
      const s = window.getSelection(); const r = rootRef.current
      if (!s || !r || s.rangeCount === 0) return
      const rg = s.getRangeAt(0)
      if (r.contains(rg.commonAncestorContainer)) savedRange.current = rg.cloneRange()
    }
    document.addEventListener('selectionchange', h)
    return () => document.removeEventListener('selectionchange', h)
  }, [])

  // Range để chèn: selection đang trong vùng → dùng; không thì range đã lưu; không nữa → cuối tài liệu (trước <br> đuôi).
  const currentRange = (): Range => {
    const r = rootRef.current!
    const s = window.getSelection()
    if (s && s.rangeCount && r.contains(s.getRangeAt(0).commonAncestorContainer)) return s.getRangeAt(0)
    if (savedRange.current && r.contains(savedRange.current.commonAncestorContainer)) return savedRange.current.cloneRange()
    const rg = document.createRange()
    if (isBr(r.lastChild)) rg.setStartBefore(r.lastChild); else { rg.selectNodeContents(r); rg.collapse(false) }
    rg.collapse(true)
    return rg
  }
  const setCaret = (node: Node, offset: number) => {
    const s = window.getSelection(); if (!s) return
    const rg = document.createRange(); rg.setStart(node, offset); rg.collapse(true)
    s.removeAllRanges(); s.addRange(rg)
    savedRange.current = rg.cloneRange()
  }
  // Con trỏ NGAY SAU 1 node: nếu sau nó chưa có text node thì đệm ZW để caret có chỗ đứng (sau khối nguyên).
  const caretAfter = (node: Node) => {
    let next = node.nextSibling
    if (!next || next.nodeType !== Node.TEXT_NODE) { next = document.createTextNode(ZW); node.parentNode?.insertBefore(next, node.nextSibling) }
    setCaret(next, 0)
  }

  const insertMath = (latex: string) => {
    const r = rootRef.current; if (!r) return
    // Đọc vị trí TRƯỚC khi focus: focus() vào contenteditable làm Chrome đặt lại selection về ĐẦU khối
    // (đã dính: cụm chèn từ bảng dựng nhảy lên đầu bài) — vị trí thật nằm ở savedRange lưu lúc rời vùng soạn.
    const rg = currentRange()
    r.focus()
    rg.deleteContents()
    const span = mathSpan(latex); const zw = document.createTextNode(ZW)
    rg.insertNode(zw); rg.insertNode(span)       // insertNode chèn ở ĐẦU range → span đứng trước zw
    setCaret(zw, 0)                              // caret trước ZW: gõ tiếp là chữ đi sau công thức; Backspace 1 phát = xoá công thức
    emit(true)
  }
  const replaceMath = (el: HTMLElement, latex: string) => {
    renderMath(el, latex, el.dataset.display === '1')
    el.classList.remove('rm-f--sel')
    rootRef.current?.focus()
    caretAfter(el)
    emit(true)
  }
  const go = (d: number) => {
    const i = hIdx.current + d
    if (i < 0 || i >= hist.current.length) return
    hIdx.current = i
    const raw = hist.current[i]
    load(raw)
    const rg = currentRange(); const s = window.getSelection()
    if (s) { s.removeAllRanges(); s.addRange(rg) }
    cb.current.onChange?.(raw)
  }
  const insertText = (t: string) => {
    const rg = currentRange(); rootRef.current?.focus(); rg.deleteContents()
    const n = document.createTextNode(t); rg.insertNode(n)
    setCaret(n, n.length)
  }
  // Space sau 1 "từ" khớp gõ tắt → xoá từ, chèn cụm (cụm có ô trống → mở bảng dựng với cụm nạp sẵn).
  const tryGoTat = (): boolean => {
    const resolve = cb.current.resolveGoTat; if (!resolve) return false
    const s = window.getSelection(); if (!s || !s.rangeCount || !s.isCollapsed) return false
    const rg = s.getRangeAt(0); const n = rg.startContainer
    if (n.nodeType !== Node.TEXT_NODE) return false
    // Ch\u1ED1t offset TR\u01AF\u1EDAC khi xo\u00E1: `rg` l\u00E0 range S\u1ED0NG, DOM \u0111\u1ED5i l\u00E0 n\u00F3 t\u1EF1 d\u1EDDi offset (\u0111\u00E3 d\u00EDnh: ch\u00E8n l\u1EC7ch 2 k\u00FD t\u1EF1 v\u1EC1 tr\u01B0\u1EDBc).
    const off = rg.startOffset
    const before = (n.textContent ?? '').slice(0, off)
    const m = before.match(/([^\s\u200B]+)$/); if (!m) return false
    const word = m[1]
    const act = resolve(word); if (!act) return false
    const at = off - word.length
    const del = document.createRange(); del.setStart(n, at); del.setEnd(n, off); del.deleteContents()
    setCaret(n, at)
    act()
    return true
  }
  // Chèn 1 đoạn chuỗi kho tại con trỏ (cụm-đoạn, dán): text + công thức nguyên khối, con trỏ về cuối đoạn.
  const insertRaw = (raw: string) => {
    const r = rootRef.current; if (!r || !raw) return
    const rg = currentRange(); r.focus(); rg.deleteContents()
    const frag = fragmentFrom(raw); const last = frag.lastChild
    rg.insertNode(frag)
    if (last) { if (last.nodeType === Node.TEXT_NODE) setCaret(last, (last as Text).length); else caretAfter(last) }
    emit(true)
  }
  const getSelectionRaw = (): string => {
    const r = rootRef.current; const s = window.getSelection()
    if (!r || !s || s.rangeCount === 0 || s.isCollapsed) return ''
    const rg = s.getRangeAt(0)
    if (!r.contains(rg.commonAncestorContainer)) return ''
    return serialize(rg.cloneContents()).trim()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing) return              // đang ghép chữ IME → không đụng
    const ctrl = e.ctrlKey || e.metaKey
    const k = e.key.toLowerCase()
    if (ctrl && !e.altKey && k === 'z') { e.preventDefault(); go(e.shiftKey ? 1 : -1); return }
    if (ctrl && !e.altKey && k === 'y') { e.preventDefault(); go(1); return }
    if (ctrl && !e.altKey && !e.shiftKey && k === 'm') { e.preventDefault(); cb.current.onRequestNew?.(); return }
    if (e.key === '$' && !ctrl && !e.altKey) { e.preventDefault(); cb.current.onRequestNew?.(); return }
    if (e.key === 'Enter') { e.preventDefault(); insertText('\n'); emit(true); return }
    if ((e.key === ' ' || e.code === 'Space') && !ctrl && !e.altKey && tryGoTat()) { e.preventDefault(); return }
    const combo = comboFromEvent(e)
    if (combo && cb.current.onCombo?.(combo)) { e.preventDefault(); return }
  }
  // Dán: chỉ lấy text; text có $…$ (copy từ kho) → công thức hiện ngay.
  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    insertRaw(e.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n'))
  }
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest?.('.rm-f') as HTMLElement | null
    if (!el) return
    rootRef.current?.querySelectorAll('.rm-f--sel').forEach((x) => x.classList.remove('rm-f--sel'))
    el.classList.add('rm-f--sel')
    cb.current.onEditMath?.(el, el.dataset.latex ?? '')
  }

  useImperativeHandle(ref, () => ({
    insertMath,
    insertRaw,
    replaceMath,
    getValue: () => (rootRef.current ? serialize(rootRef.current) : ''),
    getSelectionRaw,
    setValue: (raw) => { load(raw); hist.current = [raw]; hIdx.current = 0; cb.current.onChange?.(raw) },
    // Trả focus về vùng soạn ĐÚNG chỗ cũ: sau khi gỡ modal MathLive, selection có thể đã bị đá về body →
    // focus() trần đặt caret về đầu khối; khôi phục savedRange nếu selection không còn trong vùng.
    focus: () => {
      const r = rootRef.current; if (!r) return
      r.focus()
      const s = window.getSelection()
      const inside = !!s && s.rangeCount > 0 && r.contains(s.getRangeAt(0).commonAncestorContainer)
      if (!inside && savedRange.current && r.contains(savedRange.current.commonAncestorContainer) && s) { s.removeAllRanges(); s.addRange(savedRange.current.cloneRange()) }
    },
  }))

  return (
    <div ref={rootRef} className={`rm-doc ${className ?? ''}`} contentEditable suppressContentEditableWarning spellCheck={false}
      data-placeholder={placeholder ?? ''} onInput={() => emit(false)} onKeyDown={onKeyDown} onPaste={onPaste} onClick={onClick} />
  )
})
