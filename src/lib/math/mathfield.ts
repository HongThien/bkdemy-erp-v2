// ⭐ MỘT nguồn cấu hình MathLive cho MỌI ô nhập công thức: MathPopup (ERP: ô Đề/Lời giải trong kho)
// và MathBuilder (tool soạn thảo riêng, src/soan). Trước 05/09 toàn bộ nằm trong MathPopup; tách ra để
// tool soạn dùng chung mà KHÔNG kéo store ERP (useStore) vào bundle riêng.
// Quyết định Thùy 09-2026: người dùng KHÔNG gõ LaTeX, KHÔNG thấy LaTeX. Cấu trúc chỉ vào bằng CLICK mẫu
// hoặc PHÍM TẮT tự gán; chữ + số gõ vào ô trống của mẫu. TẮT gõ tắt kiểu chữ, chặn "\" "^" "_".
import { MathfieldElement } from 'mathlive'
import { MATH_MACROS } from './macros'
import type { MathTemplate } from './templates'

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
export const KEY_BLOCK = new Set(['\\', '^', '_'])

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
export const isBlankLatex = (latex: string) => latex.replace(/[{}\s]/g, '') === ''

// Cấu hình 1 <math-field> theo luật trên + nạp giá trị đầu. Trả hàm gỡ listener (gọi trong cleanup effect).
export function setupMathField(mf: MathfieldElement, initial: string, onInput: () => void): () => void {
  mf.classList.add('mf-input')                  // React 18 KHÔNG set className lên custom element → gán tay
  mf.inlineShortcuts = {}                       // TẮT gõ tắt kiểu chữ: "sqrt" phải ra 4 chữ s q r t
  mf.smartMode = false
  mf.smartSuperscript = false
  mf.mathVirtualKeyboardPolicy = 'manual'       // không bật bàn phím ảo
  mf.menuItems = []                             // không menu chuột phải (có mục chèn LaTeX)
  mf.macros = { ...mf.macros, ...MATH_MACROS }  // cùng 1 file macro với KaTeX
  mf.keybindings = mf.keybindings.filter((kb) => !KB_DROP.has(String(Array.isArray(kb.command) ? kb.command[0] : kb.command)))
  mf.value = initial
  mf.addEventListener('input', onInput)
  // Chặn "\" "^" "_" cả ở tầng beforeinput (IME / dán / gõ không qua keydown) — đi kèm chặn keydown ở component.
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
  return () => { mf.removeEventListener('input', onInput); mf.removeEventListener('beforeinput', onBeforeInput, true) }
}

// Chèn 1 đoạn LaTeX (có thể chứa ô trống `#?`) vào vị trí con trỏ của ô.
//   · Đang bôi đen 1 đoạn → đoạn đó vào Ô TRỐNG ĐẦU TIÊN (bôi "x+1" rồi bấm phân số → tử = x+1).
//   · Đang ở mode chữ (trong \text{…}) mà chèn → MathLive nhét LaTeX như chữ thường → luôn về mode toán trước.
//   · textMode = true (mẫu Văn bản): ép sang mode chữ để tiếng Việt có dấu gõ vào thành \text{…}.
export function insertLatexInto(mf: MathfieldElement, latex: string, opts: { textMode?: boolean } = {}) {
  const sel = mf.selectionIsCollapsed ? '' : mf.getValue(mf.selection, 'latex')
  let s = latex
  if (sel && s.includes('#?')) s = s.replace('#?', sel)
  s = s.replace(/#\?/g, '\\placeholder{}')
  if (mf.mode !== 'math') mf.executeCommand(['switchMode', 'math'])
  mf.insert(s, { format: 'latex', selectionMode: s.includes('\\placeholder') ? 'placeholder' : 'after', focus: true })
  if (opts.textMode) mf.executeCommand(['switchMode', 'text'])
}
// Mẫu Văn bản: ô trống trong \text{} vẫn ở mode toán (chữ nghiêng, mất khoảng trắng, mất \text) → ép sang
// mode chữ để tiếng Việt có dấu gõ vào thành \text{với mọi x}. Rời khỏi \text{} (Tab) tự về mode toán.
export const insertTemplateInto = (mf: MathfieldElement, t: MathTemplate) =>
  insertLatexInto(mf, t.latex, { textMode: t.tab === 'van_ban' })

// Tab: còn ô trống PHÍA SAU con trỏ → nhảy tới; hết → thoát ra sau khung đang đứng (moveAfterParent).
export function tabNext(mf: MathfieldElement, back: boolean) {
  const rest = back ? mf.getValue(0, mf.position, 'latex') : mf.getValue(mf.position, mf.lastOffset, 'latex')
  if (rest.includes('\\placeholder')) mf.executeCommand(back ? 'moveToPreviousPlaceholder' : 'moveToNextPlaceholder')
  else {
    mf.executeCommand(back ? 'moveToPreviousChar' : 'moveAfterParent')
    // Đang trong \text{…} ở tầng gốc: moveAfterParent không có "cha" để thoát → tự trả về mode toán.
    if (mf.mode !== 'math') mf.executeCommand(['switchMode', 'math'])
  }
}

// Giá trị SẠCH để lưu (bỏ ô trống sót); null nếu rỗng.
export function readClean(mf: MathfieldElement): string | null {
  const clean = stripPlaceholders(mf.getValue('latex'))
  return isBlankLatex(clean) ? null : clean
}
