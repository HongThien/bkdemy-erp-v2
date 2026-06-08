// Primitives UI gu SaaS — dùng chung cho mọi nhánh bản đồ (Đại / Hình).
import type { ReactNode } from 'react'
import katex from 'katex'

// Render text có LaTeX ($…$ inline, $$…$$ block) thành công thức đẹp.
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Lưới an toàn: lệnh toán đứng TRẦN ngoài $…$ (AI quên bọc $) → đổi sang ký tự Unicode để vẫn hiện đúng.
// (Bên trong $…$ do KaTeX lo, hàm này CHỈ chạy trên phần text ngoài công thức.)
const UNI: [RegExp, string][] = [
  [/\\infty/g, '∞'], [/\\leq/g, '≤'], [/\\geq/g, '≥'], [/\\neq/g, '≠'], [/\\le\b/g, '≤'], [/\\ge\b/g, '≥'], [/\\ne\b/g, '≠'],
  [/\\times/g, '×'], [/\\cdot/g, '·'], [/\\div/g, '÷'], [/\\pm/g, '±'], [/\\circ/g, '°'], [/\\sqrt/g, '√'],
  [/\\Leftrightarrow/g, '⇔'], [/\\Rightarrow/g, '⇒'], [/\\rightarrow/g, '→'], [/\\to\b/g, '→'],
  [/\\cup/g, '∪'], [/\\cap/g, '∩'], [/\\subset/g, '⊂'], [/\\notin/g, '∉'], [/\\in\b/g, '∈'],
  [/\\forall/g, '∀'], [/\\exists/g, '∃'], [/\\varnothing/g, '∅'], [/\\emptyset/g, '∅'],
  [/\\alpha/g, 'α'], [/\\beta/g, 'β'], [/\\gamma/g, 'γ'], [/\\pi/g, 'π'], [/\\Delta/g, 'Δ'],
]
const escText = (t: string) => { let s = esc(t); for (const [re, u] of UNI) s = s.replace(re, u); return s }
const tex = (s: string, display: boolean) => {
  // \frac hiển thị bé (scriptstyle khi inline) → đổi sang \dfrac cho phân số to, đẹp.
  const fixed = s.replace(/\\frac(?![a-zA-Z])/g, '\\dfrac')
  try { return katex.renderToString(fixed, { displayMode: display, throwOnError: false, output: 'html' }) }
  catch { return esc(s) }
}
function lineToHtml(s: string): string {
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g
  let out = '', last = 0, m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    out += escText(s.slice(last, m.index))
    out += m[1] != null ? tex(m[1], true) : tex(m[2]!, false)
    last = re.lastIndex
  }
  return out + escText(s.slice(last))
}
// Mỗi dòng (tách bởi \n thật hoặc literal "\n") = 1 block → phân số dòng trên KHÔNG đè dòng dưới.
// Chỉ coi "\n" + KHÔNG-phải-chữ-cái là xuống dòng. "\neq", "\nabla", "\ni"… là LaTeX → giữ nguyên.
const NL = /\\n(?![a-zA-Z])|\r\n?/g
const HAS_NL = /\n|\\n(?![a-zA-Z])/
function mathToHtml(s: string): string {
  return (s ?? '').replace(NL, '\n').split('\n')
    .map((line) => `<div class="mline">${lineToHtml(line) || '&nbsp;'}</div>`).join('')
}
export function MathText({ children, className }: { children: string | null | undefined; className?: string }) {
  const s = children ?? ''
  // 1 dòng → inline (căn baseline đẹp); nhiều dòng → block từng dòng (phân số không đè).
  if (!HAS_NL.test(s)) return <span className={`katex-text ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: lineToHtml(s) }} />
  return <div className={`katex-text ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: mathToHtml(s) }} />
}

export const inp = 'w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

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
