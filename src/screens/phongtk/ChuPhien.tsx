// Hiện chữ trong phiên Claude: an toàn (escape hết), đủ cho cách Claude viết trong chat —
// **đậm**, `mã`, gạch đầu dòng, công thức $…$ / $$…$$ (KaTeX), và dòng thao tác "> 🗺 …" bot chèn
// (hiện mờ, nhỏ — để người thấy Claude đang làm gì mà không lẫn với câu trả lời).
// Cố ý KHÔNG dùng MathText của kho: nó tự in đậm chữ VIẾT HOA và tách "Phần 2" — đúng cho đề/lời giải, sai cho chat.
import katex from 'katex'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function toan(tex: string, khoi: boolean): string {
  try { return katex.renderToString(tex, { throwOnError: false, displayMode: khoi }) } catch { return esc(tex) }
}

function dong(s: string): string {
  // Tách công thức trước để ** và ` bên trong công thức không bị hiểu nhầm.
  const out: string[] = []
  const re = /\$\$([^$]+)\$\$|\$([^$\n]+)\$/g
  let i = 0, m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    out.push(chu(s.slice(i, m.index)))
    out.push(m[1] != null ? toan(m[1], true) : toan(m[2], false))
    i = m.index + m[0].length
  }
  out.push(chu(s.slice(i)))
  return out.join('')
}
function chu(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 text-[12px] text-slate-700">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

export default function ChuPhien({ text }: { text: string }) {
  const html = text.split('\n').map((l) => {
    if (/^>\s?/.test(l)) {
      const t = l.replace(/^>\s?/, '')
      return `<div class="my-0.5 text-[12px] leading-snug text-slate-400">${esc(t)}</div>`
    }
    if (/^#{1,4}\s/.test(l)) return `<div class="mt-2 font-semibold text-slate-800">${dong(l.replace(/^#{1,4}\s/, ''))}</div>`
    if (/^\s*[-*]\s/.test(l)) return `<div class="pl-4 -indent-3">• ${dong(l.replace(/^\s*[-*]\s/, ''))}</div>`
    if (/^\s*\d+[.)]\s/.test(l)) return `<div class="pl-4 -indent-3">${dong(l.trim())}</div>`
    if (!l.trim()) return '<div class="h-2"></div>'
    return `<div>${dong(l)}</div>`
  }).join('')
  return <div className="text-[14px] leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: html }} />
}
