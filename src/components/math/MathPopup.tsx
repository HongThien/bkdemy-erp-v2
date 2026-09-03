// Ô nhập công thức (MathLive) — Thùy chốt 09-2026: người dùng KHÔNG gõ LaTeX, KHÔNG thấy LaTeX.
// Chỉ có ĐÚNG 2 cách đưa cấu trúc vào: CLICK mẫu trong bảng, hoặc PHÍM TẮT tự gán (không bộ mặc định).
// Người dùng chỉ gõ chữ + số vào ô trống của mẫu. Tab → ô kế; hết ô → thoát khung. Enter → chèn; Esc → huỷ.
// TẮT: gõ tắt kiểu chữ (sqrt → √), phím "\" (mode LaTeX), "^" "_" (mũ/chỉ số phải qua mẫu), "/" → phân số.
// Định dạng LƯU không đổi: chuỗi LaTeX bọc $…$ (MathTextarea lo phần bọc + chèn vào textarea).
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MathfieldElement } from 'mathlive'
import { MathText } from '../../screens/kho/ui'
import { MATH_MACROS } from '../../lib/math/macros'
import { MATH_TABS, MATH_TEMPLATES, MATH_TEMPLATE_BY_ID, hasPlaceholder, toPreview, type MathTab, type MathTemplate } from '../../lib/math/templates'
import { comboFromEvent, findTemplateByCombo } from '../../lib/math/phimtat'
import { usePhimTat } from '../../store/useStore'
import PhimTatModal from './PhimTatModal'

// Font: MathLive dùng đúng họ font KaTeX mà app đã nạp qua katex.min.css → không tải lại từ CDN/thư mục.
MathfieldElement.fontsDirectory = null
MathfieldElement.soundsDirectory = null

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>
    }
  }
}

// Bỏ MỌI keybinding mặc định của MathLive có tác dụng CHÈN cấu trúc / đổi mode / sửa ma trận
// (alt+v → căn, "/" → phân số, "\" → LaTeX, ctrl+6 → mũ…). Chỉ giữ di chuyển · xoá · chọn · undo · clipboard.
const KB_DROP = new Set([
  'insert', 'switchMode', 'toggleVirtualKeyboard', 'toggleKeystrokeCaption', 'toggleContextMenu',
  'moveToSuperscript', 'moveToSubscript', 'moveToOpposite', 'addRowAfter', 'addRowBefore', 'addColumnAfter',
  'addColumnBefore', 'removeRow', 'removeColumn', 'commit', 'complete', 'moveToNextPlaceholder', 'moveToPreviousPlaceholder',
])
// Phím gõ thẳng vào ô mà MathLive tự đổi thành cấu trúc → CHẶN (cấu trúc chỉ vào qua mẫu/phím gán).
const KEY_BLOCK = new Set(['\\', '^', '_'])

// Bỏ ô trống còn sót khi lưu: \placeholder{} → {} (KaTeX không biết \placeholder; {} render rỗng, không lỗi).
export function stripPlaceholders(latex: string): string {
  const ARG = '(\\{[^{}]*\\}|[0-9a-zA-Z])'
  return latex
    .replace(/\\placeholder(?:\[[^\]]*\])?\{([^{}]*)\}/g, '{$1}')
    .replace(/\{\{\}\}/g, '{}')                       // \frac{a}{\placeholder{}} → \frac{a}{} (không ra {{}})
    // MathLive tiết kiệm ngoặc: \frac34, \sqrt2 → chuẩn hoá \frac{3}{4}, \sqrt{2} (dễ đọc, khớp dữ liệu cũ).
    .replace(new RegExp(`\\\\(frac|dfrac|tfrac|binom)${ARG}${ARG}`, 'g'), (_m, c: string, x: string, y: string) => `\\${c}{${x.replace(/^\{|\}$/g, '')}}{${y.replace(/^\{|\}$/g, '')}}`)
    .replace(new RegExp(`\\\\sqrt${ARG}`, 'g'), (_m, x: string) => `\\sqrt{${x.replace(/^\{|\}$/g, '')}}`)
    .trim()
}
const isBlank = (latex: string) => latex.replace(/[{}\s]/g, '') === ''

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
    // Đang bôi đen 1 đoạn → đoạn đó vào Ô TRỐNG ĐẦU TIÊN của mẫu (bôi "x+1" rồi bấm phân số → tử = x+1).
    const sel = mf.selectionIsCollapsed ? '' : mf.getValue(mf.selection, 'latex')
    let s = t.latex
    if (sel && hasPlaceholder(t)) s = s.replace('#?', sel)
    s = s.replace(/#\?/g, '\\placeholder{}')
    // Đang ở mode chữ (trong \text{…}) mà chèn mẫu → MathLive nhét LaTeX như chữ thường. Luôn về mode toán trước.
    if (mf.mode !== 'math') mf.executeCommand(['switchMode', 'math'])
    mf.insert(s, { format: 'latex', selectionMode: s.includes('\\placeholder') ? 'placeholder' : 'after', focus: true })
    // Mẫu Văn bản: ô trống trong \text{} vẫn ở mode toán (chữ nghiêng, mất khoảng trắng, mất \text) → ép sang
    // mode text để tiếng Việt có dấu gõ vào thành \text{với mọi x}. Rời khỏi \text{} (Tab) tự về mode toán.
    if (t.tab === 'van_ban') mf.executeCommand(['switchMode', 'text'])
    setLatex(mf.getValue('latex'))
  }
  function commit() {
    const mf = mfRef.current; if (!mf) return
    const clean = stripPlaceholders(mf.getValue('latex'))
    if (isBlank(clean)) { onCancel(); return }
    onCommit(clean)
  }
  // Tab: còn ô trống PHÍA SAU con trỏ → nhảy tới; hết → thoát ra sau khung đang đứng (moveAfterParent).
  function tabNext(back: boolean) {
    const mf = mfRef.current; if (!mf) return
    const rest = back ? mf.getValue(0, mf.position, 'latex') : mf.getValue(mf.position, mf.lastOffset, 'latex')
    if (rest.includes('\\placeholder')) mf.executeCommand(back ? 'moveToPreviousPlaceholder' : 'moveToNextPlaceholder')
    else {
      mf.executeCommand(back ? 'moveToPreviousChar' : 'moveAfterParent')
      // Đang trong \text{…} ở tầng gốc: moveAfterParent không có "cha" để thoát → tự trả về mode toán
      // (Tab = "thoát khung chữ", chữ gõ tiếp là biến/số).
      if (mf.mode !== 'math') mf.executeCommand(['switchMode', 'math'])
    }
  }

  useEffect(() => {
    const mf = mfRef.current; if (!mf) return
    mf.classList.add('mf-input')                  // React 18 KHÔNG set className lên custom element → gán tay
    mf.inlineShortcuts = {}                       // TẮT gõ tắt kiểu chữ: "sqrt" phải ra 4 chữ s q r t
    mf.smartMode = false
    mf.smartSuperscript = false
    mf.mathVirtualKeyboardPolicy = 'manual'       // không bật bàn phím ảo
    mf.menuItems = []                             // không menu chuột phải (có mục chèn LaTeX)
    mf.macros = { ...mf.macros, ...MATH_MACROS }  // cùng 1 file macro với KaTeX
    mf.keybindings = mf.keybindings.filter((kb) => !KB_DROP.has(String(Array.isArray(kb.command) ? kb.command[0] : kb.command)))
    mf.value = initial
    const onInput = () => setLatex(mf.getValue('latex'))
    mf.addEventListener('input', onInput)
    // Chặn "\" "^" "_" cả ở tầng beforeinput (IME / dán / gõ không qua keydown) — đi kèm onKeyDownCapture ở dưới.
    const onBeforeInput = (e: Event) => {
      // MathLive tự phát beforeinput GIẢ (isTrusted=false, data = LaTeX) mỗi lần insert() → bỏ qua, chỉ bắt gõ thật.
      if (!e.isTrusted) return
      const d = (e as InputEvent).data
      if (!d || !/[\\^_]/.test(d)) return
      e.preventDefault(); e.stopImmediatePropagation()
      const clean = d.replace(/[\\^_]/g, '')            // dán / IME nhiều ký tự: chỉ bỏ ký tự cấm, giữ phần còn lại
      if (clean) mf.executeCommand(['typedText', clean])
    }
    mf.addEventListener('beforeinput', onBeforeInput, true)
    mf.focus()
    if (initial) mf.executeCommand('moveToMathfieldEnd')
    if (startTemplate) insertTemplate(startTemplate)
    return () => { mf.removeEventListener('input', onInput); mf.removeEventListener('beforeinput', onBeforeInput, true) }
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
