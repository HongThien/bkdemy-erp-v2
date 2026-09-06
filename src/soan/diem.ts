// ĐỔI TÊN ĐIỂM trong cụm (Thùy 05/09: "cực kì quan trọng với Hình học") — bổ đề lưu bằng ABC/DEF, bài đang làm là
// MNP/HIK → lúc dùng cụm, đổi hàng loạt. Điểm = 1 chữ IN HOA đứng làm tên điểm:
//   · trong $…$: mọi [A-Z] KHÔNG thuộc lệnh LaTeX (\Rightarrow, \Delta…) và KHÔNG nằm trong nhóm chữ/tập số
//     (\text{…} \mathrm{…} \mathbb{R}…). `\triangle ABC` → A, B, C · `\widehat{A}` → A.
//   · ngoài $…$ (lời văn): từ TOÀN chữ hoa 1–4 ký tự đứng riêng ("tứ giác ABCD", "đường cao AH"). Ranh giới theo
//     Unicode để "Vì"/"Xét" (V + ì) không bị bắt nhầm.
// Thay đồng thời 1 lượt (A→B, B→A hoán đổi vẫn đúng). Tên mới tự do: M · A' · M_1.
import { listMath } from '../screens/kho/ui'

// Nhóm cần BỎ QUA cả phần trong ngoặc (chữ thường / tập số / toán tử) — [A-Z] trong đó không phải điểm.
const LATEX_TOKEN = /\\(?:mathbb|mathrm|text|textrm|textbf|textit|operatorname|mathcal|mathfrak|mathsf)\s*\{[^{}]*\}|\\[a-zA-Z]+|([A-Z])/g
const PROSE_WORD = /(?<![\p{L}\p{N}_])([A-Z]{1,4})(?![\p{L}\p{N}_])/gu

type Walk = (letter: string) => string
function walkLatex(latex: string, f: Walk): string {
  return latex.replace(LATEX_TOKEN, (m, letter?: string) => (letter ? f(letter) : m))
}
function walkProse(text: string, f: Walk): string {
  return text.replace(PROSE_WORD, (_m, w: string) => w.split('').map(f).join(''))
}
// Đi qua toàn bộ chuỗi kho: đoạn $…$ theo luật LaTeX, đoạn chữ theo luật lời văn.
function walk(raw: string, f: Walk): string {
  let out = ''; let pos = 0
  for (const m of listMath(raw)) {
    out += walkProse(raw.slice(pos, m.start), f)
    const inner = walkLatex(m.latex, f)
    out += m.display ? `$$${inner}$$` : `$${inner}$`
    pos = m.end
  }
  return out + walkProse(raw.slice(pos), f)
}

// Danh sách điểm (không trùng, theo thứ tự xuất hiện).
export function timDiem(raw: string): string[] {
  const seen: string[] = []
  walk(raw, (l) => { if (!seen.includes(l)) seen.push(l); return l })
  return seen
}
// Áp bảng đổi tên; chữ không có trong bảng (hoặc map rỗng) giữ nguyên.
export function doiDiem(raw: string, map: Record<string, string>): string {
  return walk(raw, (l) => (map[l] != null && map[l] !== '' ? map[l] : l))
}
// Bảng có đổi gì khác tên gốc không (để hiện chip "Bộ điểm" / quyết định có cần hỏi).
export const coDoi = (map: Record<string, string>) => Object.entries(map).some(([k, v]) => v && v !== k)
