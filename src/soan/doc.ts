// Tài liệu soạn thảo WYSIWYG ↔ chuỗi lưu kho. Mô hình PHẲNG: 1 div contenteditable chứa xen kẽ
//   · text node (chữ thường, có thể chứa "\n" — CSS white-space:pre-wrap nên xuống dòng hiện đúng)
//   · <span class="rm-f" contenteditable="false" data-latex="…"> = 1 công thức NGUYÊN KHỐI (KaTeX render bên trong)
// Định dạng LƯU không đổi so với kho: text có $…$ / $$…$$ (in / ET / test online / AI đọc y như cũ).
// Người soạn KHÔNG bao giờ thấy chuỗi này — chỉ máy dịch qua lại lúc nạp / lưu.
import { tex, listMath } from '../screens/kho/ui'

// Ký tự trống không-bề-rộng đặt NGAY SAU mỗi công thức → con trỏ có chỗ đứng sau khối nguyên (Chrome không
// đặt được caret sát sau phần tử contenteditable=false ở cuối dòng). Bỏ hết khi serialize.
export const ZW = '\u200B'

// GỘP công thức liền kề lúc LƯU (Thùy 08/09: "góc ABC = 50° — LaTeX là 1 công thức, ở đây thành 2 mảnh riêng; có
// cách gộp không, hệ tự ghép?"). Hai công thức inline mà GIỮA chúng chỉ có toán tử/quan hệ/số/khoảng trắng → thành 1
// công thức (khoảng cách quanh dấu = chuẩn KaTeX, không bao giờ gãy dòng giữa 2 vế, click sửa 1 lần). Giữa có CHỮ
// hoặc DẤU PHẨY ("$x$ và $y$", "$a$, $b$") = câu văn → giữ nguyên. Chỉ chạy lúc LƯU (không lúc gõ — con trỏ không bị
// nhảy); `$$…$$` không đụng. Ký hiệu Unicode gõ ngoài công thức được dịch sang LaTeX khi vào trong.
const GIUA_RE = /^[\s=+\-<>≤≥≠·×:/°%\d.]*$/
const giuaToLatex = (s: string) => s.replace(/≤/g, '\\le ').replace(/≥/g, '\\ge ').replace(/≠/g, '\\ne ').replace(/·/g, '\\cdot ').replace(/×/g, '\\times ').replace(/°/g, '^\\circ ').replace(/%/g, '\\% ').replace(/\s+/g, ' ').trim()
export function gopCongThuc(raw: string): string {
  const ms = listMath(raw)
  if (ms.length < 2) return raw
  let out = ''; let pos = 0; let i = 0
  while (i < ms.length) {
    const m = ms[i]
    out += raw.slice(pos, m.start)
    if (m.display) { out += raw.slice(m.start, m.end); pos = m.end; i++; continue }
    let latex = m.latex; let end = m.end
    while (i + 1 < ms.length && !ms[i + 1].display) {
      const giua = raw.slice(end, ms[i + 1].start)
      if (!GIUA_RE.test(giua)) break
      const g = giuaToLatex(giua)
      latex = g ? `${latex} ${g} ${ms[i + 1].latex}` : giua ? `${latex} ${ms[i + 1].latex}` : `${latex}${ms[i + 1].latex}`
      end = ms[i + 1].end; i++
    }
    out += `$${latex}$`; pos = end; i++
  }
  return out + raw.slice(pos)
}

export function renderMath(el: HTMLElement, latex: string, display: boolean) {
  el.dataset.latex = latex
  if (display) el.dataset.display = '1'; else delete el.dataset.display
  el.innerHTML = tex(latex, display)
}
export function mathSpan(latex: string, display = false): HTMLSpanElement {
  const s = document.createElement('span')
  s.className = 'rm-f'
  s.contentEditable = 'false'
  renderMath(s, latex, display)
  return s
}

// Chuỗi kho → fragment DOM (nạp bài / dán text có $…$).
export function fragmentFrom(raw: string): DocumentFragment {
  const f = document.createDocumentFragment()
  let pos = 0
  for (const m of listMath(raw)) {
    if (m.start > pos) f.appendChild(document.createTextNode(raw.slice(pos, m.start)))
    f.appendChild(mathSpan(m.latex, m.display))
    f.appendChild(document.createTextNode(ZW))
    pos = m.end
  }
  if (pos < raw.length) f.appendChild(document.createTextNode(raw.slice(pos)))
  return f
}

// DOM → chuỗi kho. <br> = xuống dòng (Chrome tự chèn <br> giữ chỗ cuối khối; bỏ đúng 1 "\n" cuối nếu do <br> cuối tạo).
// Khối lạ (div/p do dán/IME) → coi như ranh giới dòng rồi đi tiếp vào trong — không bao giờ mất chữ.
export function serialize(root: Node): string {
  let out = ''
  const walk = (n: Node) => {
    for (const c of Array.from(n.childNodes)) {
      if (c.nodeType === Node.TEXT_NODE) { out += (c.textContent ?? '').replace(/\u200B/g, ''); continue }
      if (!(c instanceof HTMLElement)) continue
      if (c.classList.contains('rm-f')) {
        const l = c.dataset.latex ?? ''
        out += c.dataset.display === '1' ? `$$${l}$$` : `$${l}$`
        continue
      }
      if (c.tagName === 'BR') { out += '\n'; continue }
      if (/^(DIV|P)$/.test(c.tagName) && out && !out.endsWith('\n')) out += '\n'
      walk(c)
    }
  }
  walk(root)
  if (root.lastChild instanceof HTMLElement && root.lastChild.tagName === 'BR' && out.endsWith('\n')) out = out.slice(0, -1)
  return out
}
