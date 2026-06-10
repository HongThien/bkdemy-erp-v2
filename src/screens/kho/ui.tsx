// Primitives UI gu SaaS — dùng chung cho mọi nhánh bản đồ (Đại / Hình).
import type { ReactNode } from 'react'
import katex from 'katex'

// Render text có LaTeX ($…$ inline, $$…$$ block) thành công thức đẹp.
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Lưới an toàn: lệnh toán đứng TRẦN ngoài $…$ (AI quên bọc $) → đổi sang ký tự Unicode để vẫn hiện đúng.
// (Bên trong $…$ do KaTeX lo, hàm này CHỈ chạy trên phần text ngoài công thức.)
const UNI: [RegExp, string][] = [
  [/\\infty/g, '∞'], [/\\leq/g, '≤'], [/\\geq/g, '≥'], [/\\neq/g, '≠'], [/\\le\b/g, '≤'], [/\\ge\b/g, '≥'], [/\\ne\b/g, '≠'], [/\\approx/g, '≈'], [/\\equiv/g, '≡'],
  [/\\times/g, '×'], [/\\cdot/g, '·'], [/\\div/g, '÷'], [/\\pm/g, '±'], [/\\mp/g, '∓'], [/\\circ/g, '°'],
  [/\\Leftrightarrow/g, '⇔'], [/\\iff/g, '⇔'], [/\\implies/g, '⇒'], [/\\Rightarrow/g, '⇒'], [/\\rightarrow/g, '→'], [/\\to\b/g, '→'],
  [/\\cup/g, '∪'], [/\\cap/g, '∩'], [/\\subset/g, '⊂'], [/\\notin/g, '∉'], [/\\in\b/g, '∈'],
  [/\\forall/g, '∀'], [/\\exists/g, '∃'], [/\\varnothing/g, '∅'], [/\\emptyset/g, '∅'],
  [/\\ldots/g, '…'], [/\\cdots/g, '…'], [/\\dots/g, '…'],
  [/\\alpha/g, 'α'], [/\\beta/g, 'β'], [/\\gamma/g, 'γ'], [/\\pi/g, 'π'], [/\\Delta/g, 'Δ'],
]
// Đổi ký hiệu toán TRẦN (ngoài $…$) → Unicode. Chạy TRƯỚC bước cắt dòng để "\neq" trần không bị nuốt "\n".
const uni = (t: string) => { let s = t; for (const [re, u] of UNI) s = s.replace(re, u); return s }
const tex = (s: string, display: boolean) => {
  // \frac hiển thị bé (scriptstyle khi inline) → đổi sang \dfrac cho phân số to, đẹp.
  const fixed = s.replace(/\\frac(?![a-zA-Z])/g, '\\dfrac')
  try { return katex.renderToString(fixed, { displayMode: display, throwOnError: false, output: 'html' }) }
  catch { return esc(s) }
}
const MATH_RE = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g
// Tách raw thành các DÒNG html. Xuống dòng (\n thật, "\\n" literal, CRLF) CHỈ tính ở phần TEXT ngoài $…$.
// → KHÔNG bao giờ đụng lệnh LaTeX ("\neq", "\nabla"…) vì chúng nằm TRONG $…$. Hết mơ hồ "\neq" vs "\nVì".
// Render 1 phần TEXT (ngoài $…$): lệnh CÓ NGOẶC "\dfrac{6}{5}" (AI quên bọc $) → katex; phần còn lại esc.
// (lệnh KHÔNG ngoặc như "\neq" đã được uni() đổi Unicode trước đó; "\nVì" không có ngoặc nên không đụng.)
function renderInline(s: string): string {
  const re = /\\[a-zA-Z]+(?:\{[^{}]*\})+/g
  let out = '', last = 0, m: RegExpExecArray | null
  while ((m = re.exec(s))) { out += esc(s.slice(last, m.index)); out += tex(m[0], false); last = re.lastIndex }
  return out + esc(s.slice(last))
}
// **đậm** (markdown) → <b>…</b>; phần còn lại render công thức trần + esc.
function renderText(s: string): string {
  const re = /\*\*([^*]+?)\*\*/g
  let out = '', last = 0, m: RegExpExecArray | null
  while ((m = re.exec(s))) { out += renderInline(s.slice(last, m.index)); out += '<b>' + renderInline(m[1]) + '</b>'; last = re.lastIndex }
  return out + renderInline(s.slice(last))
}
// Nhãn đầu dòng (Ví dụ, Quy tắc, Lưu ý…) → tự bọc **…** để IN ĐẬM.
const LABEL_RE = /^(\s*)(Ví dụ|VD|Quy tắc|Lưu ý|Chú ý|Nhận xét|Định nghĩa|Định lí|Định lý|Tính chất|Hệ quả|Ghi nhớ|Phương pháp|Bài toán|Mẹo|Dấu hiệu|Cách giải|Kết luận|Bước \d+)(\s*\d*)(\s*[:.])/u
const autoBold = (line: string) => line.replace(LABEL_RE, (_m, sp: string, kw: string, num: string, p: string) => `${sp}**${kw}${num}${p}**`)
function buildLines(raw: string): string[] {
  const lines: string[] = ['']
  const pushText = (txt: string) => {
    const t = uni(txt.replace(/<br\s*\/?>/gi, '\n'))        // <br> → xuống dòng; ký hiệu trần → Unicode
    const parts = t.replace(/\\n|\r\n?|\n/g, '\n').split('\n') // rồi cắt mọi kiểu xuống dòng
    const curEmpty = lines[lines.length - 1] === ''           // chỉ auto-đậm khi ĐẦU dòng thật
    lines[lines.length - 1] += renderText(curEmpty ? autoBold(parts[0]) : parts[0])
    for (let i = 1; i < parts.length; i++) lines.push(renderText(autoBold(parts[i])))
  }
  let last = 0, m: RegExpExecArray | null
  MATH_RE.lastIndex = 0
  while ((m = MATH_RE.exec(raw))) {
    if (m.index > last) pushText(raw.slice(last, m.index))
    lines[lines.length - 1] += m[1] != null ? tex(m[1], true) : tex(m[2]!, false) // math luôn nằm TRONG dòng hiện tại
    last = MATH_RE.lastIndex
  }
  if (last < raw.length) pushText(raw.slice(last))
  return lines
}
export function MathText({ children, className }: { children: string | null | undefined; className?: string }) {
  const lines = buildLines(children ?? '')
  // 1 dòng → inline (căn baseline đẹp); nhiều dòng → block từng dòng (phân số không đè).
  if (lines.length <= 1) return <span className={`katex-text ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: lines[0] || '' }} />
  return <div className={`katex-text ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: lines.map((l) => `<div class="mline">${l || '&nbsp;'}</div>`).join('') }} />
}

export const inp = 'w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

// Đọc ẢNH từ clipboard (nút "📋 Dán") — dùng Async Clipboard API (cần https/localhost). Không có ảnh → null.
export async function readClipboardImageFile(): Promise<File | null> {
  if (!navigator.clipboard?.read) throw new Error('Trình duyệt không hỗ trợ đọc clipboard')
  const items = await navigator.clipboard.read()
  for (const it of items) {
    const type = it.types.find((t) => t.startsWith('image/'))
    if (type) { const blob = await it.getType(type); return new File([blob], `clipboard.${type.split('/')[1] || 'png'}`, { type }) }
  }
  return null
}

// Bậc lớp = ô vuông 1 chữ, MÀU ĐẶC riêng từng bậc (S/A/B/C đều có màu, không xám).
export function BacChip({ bac, size = 'md' }: { bac: string; size?: 'sm' | 'md' }) {
  const tone: Record<string, string> = {
    S: 'bg-violet-600', A: 'bg-blue-600', B: 'bg-teal-600', C: 'bg-amber-600',
  }
  const dim = size === 'sm' ? 'h-5 w-5 text-[11px]' : 'h-8 w-8 text-[15px]'
  return (
    <span className={`inline-flex ${dim} items-center justify-center rounded-lg font-bold text-white shadow-sm ${tone[bac] ?? 'bg-slate-500'}`}
      title={`Bậc ${bac} — từ lớp ${bac} trở lên học`}>
      {bac}
    </span>
  )
}

// Độ khó 1→5 = ramp ẤM (xanh lá → đỏ). Border + chip cùng hệ màu.
export const MUCDO_TONE: Record<number, { border: string; chip: string }> = {
  1: { border: 'border-emerald-300', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  2: { border: 'border-lime-300', chip: 'bg-lime-50 text-lime-700 ring-lime-200' },
  3: { border: 'border-amber-300', chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  4: { border: 'border-orange-300', chip: 'bg-orange-50 text-orange-700 ring-orange-200' },
  5: { border: 'border-rose-300', chip: 'bg-rose-50 text-rose-700 ring-rose-200' },
}
export const mucDoTone = (m: number | null | undefined) =>
  (m != null && MUCDO_TONE[m]) || { border: 'border-slate-200', chip: 'bg-slate-50 text-slate-600 ring-slate-200' }

export const Code = ({ children }: { children: ReactNode }) => (
  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-slate-600">{children}</span>
)

export function Shell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[680px] max-w-[94vw] rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-5 text-base font-semibold text-slate-900">{title}</h3>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">{label}</span>
      {children}
    </label>
  )
}

export const Row = ({ children }: { children: ReactNode }) => <div className="flex items-center gap-2">{children}</div>

export function Seg<T extends string | number>({ options, value, onChange, render }: {
  options: T[]; value: T; onChange: (v: T) => void; render?: (o: T) => ReactNode
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button key={String(o)} type="button" onClick={() => onChange(o)}
          className={`h-10 flex-1 rounded-lg border text-sm font-semibold transition ${
            value === o
              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
              : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/40'
          }`}>{render ? render(o) : o}</button>
      ))}
    </div>
  )
}

export function Ghost({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className="shrink-0 rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:border-indigo-300 hover:text-indigo-700">{children}</button>
}

export function Actions({ onClose, onSave, disabled, saving, label }: { onClose: () => void; onSave: () => void; disabled: boolean; saving: boolean; label: string }) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
      <button onClick={onSave} disabled={disabled} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40">
        {saving ? 'Đang lưu…' : label}
      </button>
    </div>
  )
}
