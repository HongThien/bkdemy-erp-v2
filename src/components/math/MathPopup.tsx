// Ô nhập công thức (MathLive) — Thùy chốt 09-2026: người dùng KHÔNG gõ LaTeX, KHÔNG thấy LaTeX.
// Chỉ có ĐÚNG 2 cách đưa cấu trúc vào: CLICK mẫu trong bảng, hoặc PHÍM TẮT tự gán (không bộ mặc định).
// Người dùng chỉ gõ chữ + số vào ô trống của mẫu. Tab → ô kế; hết ô → thoát khung. Enter → chèn; Esc → huỷ.
// TẮT: gõ tắt kiểu chữ (sqrt → √), phím "\" (mode LaTeX), "^" "_" (mũ/chỉ số phải qua mẫu), "/" → phân số.
// Định dạng LƯU không đổi: chuỗi LaTeX bọc $…$ (MathTextarea lo phần bọc + chèn vào textarea).
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { MathfieldElement } from 'mathlive'
import { MathText } from '../../screens/kho/ui'
import { MATH_TABS, MATH_TEMPLATES, MATH_TEMPLATE_BY_ID, toPreview, type MathTab, type MathTemplate } from '../../lib/math/templates'
import { comboFromEvent, findTemplateByCombo } from '../../lib/math/phimtat'
import { KEY_BLOCK, insertTemplateInto, readClean, setupMathField, tabNext as mfTabNext } from '../../lib/math/mathfield'
import { usePhimTat } from '../../store/useStore'
import PhimTatModal from './PhimTatModal'

// 05/09: toàn bộ cấu hình MathLive (font, keybinding bỏ, chặn "\" "^" "_", strip placeholder, chèn mẫu, Tab)
// chuyển sang lib/math/mathfield.ts — DÙNG CHUNG với MathBuilder của tool soạn thảo (src/soan).
// Sửa luật gõ thì sửa ở đó, không sửa ở đây. Re-export để chỗ cũ import từ MathPopup vẫn chạy.
export { stripPlaceholders } from '../../lib/math/mathfield'

export type MathPopupProps = {
  initial: string                       // LaTeX đang sửa ('' = công thức mới)
  display: boolean                      // true = $$…$$ (riêng dòng) — giữ nguyên khi sửa công thức cũ
  anchor: { x: number; y: number }      // toạ độ viewport (đặt hộp ngay dưới con trỏ / công thức được click)
  startTemplate?: string                // mở kèm 1 mẫu đã chèn sẵn (từ phím tắt bấm ngay trong textarea)
  onCommit: (latex: string) => void
  onCancel: () => void
}

const W = 640

export default function MathPopup({ initial, display, anchor, startTemplate, onCommit, onCancel }: MathPopupProps) {
  const mfRef = useRef<MathfieldElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [latex, setLatex] = useState(initial)
  const [tab, setTab] = useState<MathTab>('cau_truc')
  const [ptOpen, setPtOpen] = useState(false)
  const [pos, setPos] = useState({ left: anchor.x, top: anchor.y + 6 })
  const phimTat = usePhimTat()
  const phimTatRef = useRef(phimTat); phimTatRef.current = phimTat

  function insertTemplate(id: string) {
    const mf = mfRef.current; const t = MATH_TEMPLATE_BY_ID[id]
    if (!mf || !t) return
    insertTemplateInto(mf, t)
    setLatex(mf.getValue('latex'))
  }
  function commit() {
    const mf = mfRef.current; if (!mf) return
    const clean = readClean(mf)
    if (clean == null) { onCancel(); return }
    onCommit(clean)
  }
  function tabNext(back: boolean) { const mf = mfRef.current; if (mf) mfTabNext(mf, back) }

  useEffect(() => {
    const mf = mfRef.current; if (!mf) return
    const off = setupMathField(mf, initial, () => setLatex(mf.getValue('latex')))
    mf.focus()
    if (initial) mf.executeCommand('moveToMathfieldEnd')
    if (startTemplate) insertTemplate(startTemplate)
    return off
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Kẹp hộp trong viewport (ưu tiên dưới con trỏ; tràn đáy thì đẩy lên).
  useLayoutEffect(() => {
    const el = boxRef.current; if (!el) return
    const h = el.offsetHeight, vw = window.innerWidth, vh = window.innerHeight
    let left = anchor.x, top = anchor.y + 6
    if (left + W + 8 > vw) left = Math.max(8, vw - W - 8)
    if (top + h + 8 > vh) top = Math.max(8, Math.min(anchor.y - h - 30, vh - h - 8))
    setPos({ left, top })
  }, [anchor.x, anchor.y, tab, latex.length === 0])

  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if (ptOpen) return                                   // modal gán phím đang mở: để nó tự xử lý
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); return }
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); commit(); return }
    if (e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); tabNext(e.shiftKey); return }
    if (KEY_BLOCK.has(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); e.stopPropagation(); return }
    const combo = comboFromEvent(e)
    if (combo) {
      const id = findTemplateByCombo(phimTatRef.current, combo)
      if (id) { e.preventDefault(); e.stopPropagation(); insertTemplate(id) }
    }
  }
  const comboOf = (t: MathTemplate) => phimTat[t.id]
  const previewSrc = latex.trim() ? (display ? `$$${latex}$$` : `$${latex}$`) : ''

  return createPortal(
    <div ref={boxRef} className="fixed z-[70] rounded-xl border border-slate-300 bg-white shadow-2xl" style={{ left: pos.left, top: pos.top, width: W, maxWidth: 'calc(100vw - 16px)' }}
      onKeyDownCapture={onKeyDownCapture} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      {/* Tab mẫu */}
      <div className="flex items-center gap-1 border-b border-slate-200 px-2 pt-2">
        {MATH_TABS.map((t) => (
          <button key={t.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setTab(t.id)}
            className={`rounded-t-md px-2.5 py-1 text-[12px] font-semibold ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{t.ten}</button>
        ))}
        <span className="ml-auto pb-1 text-[11px] text-slate-400">click mẫu · hoặc phím đã gán</span>
      </div>
      <div className="flex max-h-[168px] flex-wrap content-start gap-1 overflow-y-auto px-2 py-2">
        {MATH_TEMPLATES.filter((t) => t.tab === tab).map((t) => (
          <TplBtn key={t.id} title={t.ten + (comboOf(t) ? ` — ${comboOf(t)}` : '')} combo={comboOf(t)} onPick={() => insertTemplate(t.id)}>
            <MathText>{`$${toPreview(t)}$`}</MathText>
          </TplBtn>
        ))}
      </div>
      {/* Ô nhập */}
      <div className="px-3 pb-2">
        <math-field ref={mfRef} className="mf-input" />
        <div className="mt-1.5 min-h-[34px] rounded-md border border-dashed border-slate-200 bg-slate-50 px-2 py-1 text-[15px] text-slate-800">
          {previewSrc ? <MathText>{previewSrc}</MathText> : <span className="text-[12px] text-slate-400">Preview — hiện đúng như khi in / test online</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-200 px-3 py-2 text-[11px] text-slate-400">
        <span><b className="text-slate-500">Enter</b> chèn · <b className="text-slate-500">Esc</b> huỷ · <b className="text-slate-500">Tab</b> ô kế</span>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setPtOpen(true)} className="ml-auto rounded border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-700" title="Gán phím tắt cho mẫu (cá nhân)">⌨ Phím tắt</button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onCancel} className="rounded px-2 py-0.5 text-[12px] text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={commit} className="rounded bg-indigo-600 px-3 py-0.5 text-[12px] font-semibold text-white hover:bg-indigo-500">Chèn</button>
      </div>
      {ptOpen && <PhimTatModal onClose={() => { setPtOpen(false); mfRef.current?.focus() }} />}
    </div>,
    document.body,
  )
}

function TplBtn({ title, combo, onPick, children }: { title: string; combo?: string; onPick: () => void; children: ReactNode }) {
  return (
    <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={onPick}
      className="relative flex h-10 min-w-[44px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-[14px] text-slate-800 hover:border-indigo-400 hover:bg-indigo-50">
      {children}
      {combo && <span className="absolute -top-1.5 right-0 rounded bg-indigo-100 px-1 text-[9px] font-semibold leading-3 text-indigo-700">{combo}</span>}
    </button>
  )
}
