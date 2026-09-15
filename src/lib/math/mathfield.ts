// ⭐ MỘT nguồn cấu hình MathLive cho MỌI ô nhập công thức: MathPopup (ERP: ô Đề/Lời giải trong kho)
// và MathBuilder (tool soạn thảo riêng, src/soan). Trước 05/09 toàn bộ nằm trong MathPopup; tách ra để
// tool soạn dùng chung mà KHÔNG kéo store ERP (useStore) vào bundle riêng.
// Quyết định Thùy 09-2026: người dùng KHÔNG gõ LaTeX, KHÔNG thấy LaTeX. Cấu trúc chỉ vào bằng CLICK mẫu
// hoặc PHÍM TẮT tự gán; chữ + số gõ vào ô trống của mẫu. TẮT gõ tắt kiểu chữ, chặn "\" "^" "_".
import { MathfieldElement } from 'mathlive'
import { MATH_MACROS } from './macros'
import { fixAccentScript } from './latex-fix'
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

// Chiều ngược của stripPlaceholders — dùng khi NẠP LẠI công thức đã lưu để sửa. Lúc lưu \placeholder{} đã thành {};
// mở lại thì {} là nhóm RỖNG KHÔNG BỀ RỘNG: \widehat{} hiện cái mũ trên KHÔNG GÌ, không có gì để click/gõ vào
// (Thùy 07/09 tối: "ko thể click vào ô trống trong ký hiệu góc" — đúng ca sửa lại công thức đã chèn). Đổi {} →
// {\placeholder{}} để lại thành ô ▢ bấm/Tab vào được; lưu lại thì stripPlaceholders bỏ đi như cũ (không đổi dữ liệu).
// Lookbehind: KHÔNG đụng `{}` là chính đối số của \placeholder{} (chuỗi đã có ô trống sẵn — đã dính: ra \placeholder{\placeholder{}}).
export const reviveBlanks = (latex: string) => latex.replace(/(?<!\\placeholder)\{\}/g, '{\\placeholder{}}')

// Glyph MathLive vẽ cho \placeholder{} rỗng (U+25A2). DOM trong shadow root KHÔNG có class riêng cho ô trống
// (chỉ ML__cmr) → nhận diện bằng đúng ký tự này.
const PH_GLYPH = '▢'

// Ô trống KHÔNG có gợi ý → nhìn như trang trí, người soạn tưởng "phải click 1 mẫu trước" (Thùy 07/09: "Ko có nút
// tạo công thức mới, bắt buộc phải chọn 1 trong các công thức đã cho") — thật ra gõ thẳng vào đây LUÔN ĐƯỢC, mẫu
// chỉ để chèn nhanh cấu trúc (phân số, căn…). Đặt placeholder để rõ ngay từ cái nhìn đầu.
// \text{…} — không bọc thì MathLive render placeholder Ở CHẾ ĐỘ TOÁN, chữ dính liền mất hết khoảng trắng
// (đã dính thật: "Gõcôngthứctrựctiếptạiđây" khi test tay 07/09).
export const MF_PLACEHOLDER = '\\text{Gõ công thức trực tiếp tại đây…}'

// ⭐ MathLive 0.110: AccentAtom (\widehat \hat \vec \bar \dot … — MỌI dấu MŨ) gán `captureSelection = true` trong
// constructor → với CHUỘT cả khối là 1 đơn vị: bind() không cấp id cho atom con của khối captureSelection → hit-test
// (nearestAtomFromPoint) không thấy chữ dưới mũ → click vào "A" của \widehat{A_1} rơi ra SAU cả khối, Backspace xoá
// nguyên ký hiệu (Thùy 08/09: "copy góc A1 muốn đổi thành B1 nhưng ko thể xoá A viết B, xoá cái là xoá cả ký hiệu").
// Phím ←/→ vẫn vào được (ô ▢ trong mũ vẫn chọn được sau khi chèn) ⇒ thuần bug hit-test chuột. \overline/\sqrt/\frac
// không dính (không captureSelection). MathLive không có option → ghi đè accessor trên prototype: constructor gán true
// → setter bỏ qua, getter luôn false. Class không export → dựng <math-field> tạm ngoài màn, nạp \hat{x}, lấy prototype
// từ atom, gỡ. Chạy 1 lần/trang, TRƯỚC khi ô đầu tiên parse nội dung. Đo sau vá: click A → position 2 (sau A, trong
// mũ) → Backspace → \widehat{_1} → gõ B → \widehat{B_1}. Nâng MathLive thì kiểm lại đúng thao tác này.
let accentPatched = false
function patchAccentSelection() {
  if (accentPatched || typeof document === 'undefined') return
  const t = document.createElement('math-field') as MathfieldElement
  t.style.cssText = 'position:fixed;left:-9999px;top:0'
  document.body.appendChild(t)
  try {
    t.value = '\\hat{x}'
    const acc = (t as unknown as { _mathfield?: { model?: { atoms?: { type: string }[] } } })._mathfield?.model?.atoms?.find((a) => a.type === 'accent')
    if (!acc) return
    Object.defineProperty(Object.getPrototypeOf(acc), 'captureSelection', { configurable: true, get: () => false, set() { /* bỏ qua `true` từ constructor */ } })
    accentPatched = true
  } finally { t.remove() }
}

// Cấu hình 1 <math-field> theo luật trên + nạp giá trị đầu. Trả hàm gỡ listener (gọi trong cleanup effect).
export function setupMathField(mf: MathfieldElement, initial: string, onInput: () => void): () => void {
  patchAccentSelection()                        // trước mf.value: atom dấu mũ parse sau đây mới nhận prototype đã vá
  mf.classList.add('mf-input')                  // React 18 KHÔNG set className lên custom element → gán tay
  mf.placeholder = MF_PLACEHOLDER
  mf.inlineShortcuts = {}                       // TẮT gõ tắt kiểu chữ: "sqrt" phải ra 4 chữ s q r t
  mf.smartMode = false
  mf.smartSuperscript = false
  mf.mathVirtualKeyboardPolicy = 'manual'       // không bật bàn phím ảo
  mf.menuItems = []                             // không menu chuột phải (có mục chèn LaTeX)
  mf.macros = { ...mf.macros, ...MATH_MACROS }  // cùng 1 file macro với KaTeX
  mf.keybindings = mf.keybindings.filter((kb) => !KB_DROP.has(String(Array.isArray(kb.command) ? kb.command[0] : kb.command)))
  mf.value = reviveBlanks(initial)
  mf.addEventListener('input', onInput)
  // CLICK CHUỘT vào ô ▢: hit-test của MathLive với ô trống nằm TRONG ngoặc của 1 lệnh (\widehat{▢}) trả vị trí
  // SAU CẢ KHỐI → con trỏ rơi ra ngoài, gõ thành chữ đứng sau mũ (đo 07/09 tối: click ▢ → position=3 với
  // \widehat{\placeholder{}}, gõ ABC ra \widehat{▢}ABC). Fix chiều 07/09 chỉ lo lúc CHÈN (selectionMode) — người
  // dùng click vào ô là hỏng lại. Tự tìm ô ▢ thứ i nằm dưới con trỏ chuột rồi nhảy vào nó (từ đầu tài liệu, i+1 lần).
  // setTimeout 0: chạy SAU khi MathLive xử lý xong pointerup của chính nó (đặt caret lệch), mình đặt lại sau cùng.
  const onClick = (e: MouseEvent) => {
    const sr = mf.shadowRoot; if (!sr) return
    const boxes = Array.from(sr.querySelectorAll('.ML__latex span')).filter((el) => el.children.length === 0 && el.textContent === PH_GLYPH)
    const i = boxes.findIndex((el) => { const r = el.getBoundingClientRect(); return e.clientX >= r.left - 3 && e.clientX <= r.right + 3 && e.clientY >= r.top - 3 && e.clientY <= r.bottom + 3 })
    if (i < 0) return
    setTimeout(() => { mf.executeCommand('moveToMathfieldStart'); for (let k = 0; k <= i; k++) mf.executeCommand('moveToNextPlaceholder') }, 0)
  }
  mf.addEventListener('click', onClick)
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
  return () => { mf.removeEventListener('input', onInput); mf.removeEventListener('beforeinput', onBeforeInput, true); mf.removeEventListener('click', onClick) }
}

// Chèn 1 đoạn LaTeX (có thể chứa ô trống `#?`) vào vị trí con trỏ của ô.
//   · Đang bôi đen 1 đoạn → đoạn đó vào Ô TRỐNG ĐẦU TIÊN (bôi "x+1" rồi bấm phân số → tử = x+1).
//   · Đang ở mode chữ (trong \text{…}) mà chèn → MathLive nhét LaTeX như chữ thường → luôn về mode toán trước.
//   · textMode = true (mẫu Văn bản): ép sang mode chữ để tiếng Việt có dấu gõ vào thành \text{…}.
export function insertLatexInto(mf: MathfieldElement, latex: string, opts: { textMode?: boolean } = {}) {
  const sel = mf.selectionIsCollapsed ? '' : mf.getValue(mf.selection, 'latex')
  let s = latex
  if (sel && s.includes('#?')) s = s.replace('#?', sel)
  s = reviveBlanks(s.replace(/#\?/g, '\\placeholder{}'))   // {} đã lưu → ô ▢ (xem reviveBlanks)
  const coCho = s.includes('\\placeholder')
  if (mf.mode !== 'math') mf.executeCommand(['switchMode', 'math'])
  mf.insert(s, { format: 'latex', selectionMode: coCho ? 'placeholder' : 'after', focus: true })
  // 07/09 chiều (Thùy báo "chọn ký hiệu Góc, ko điền được chữ vào ô trống"): tái hiện được — ô trống
  // NẰM TRONG ngoặc {} của 1 lệnh (`\widehat{#?}`) mà insert() là THAO TÁC ĐẦU TIÊN vào field còn trống thì
  // `selectionMode:'placeholder'` không bắt được ô trống đó (con trỏ rơi ra NGOÀI, gõ vào thành text sau khối) —
  // placeholder ĐỨNG RIÊNG (`\angle #?`) hoặc field đã có nội dung trước đó thì selectionMode hoạt động đúng.
  // Ép tìm lại placeholder từ ĐẦU tài liệu, không dựa vào selectionMode.
  if (coCho) { mf.executeCommand('moveToMathfieldStart'); mf.executeCommand('moveToNextPlaceholder') }
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

// Giá trị SẠCH để lưu (bỏ ô trống sót; \widehat{A_2} → \widehat{A}_2 — xem latex-fix.ts); null nếu rỗng.
export function readClean(mf: MathfieldElement): string | null {
  const clean = fixAccentScript(stripPlaceholders(mf.getValue('latex')))
  return isBlankLatex(clean) ? null : clean
}
