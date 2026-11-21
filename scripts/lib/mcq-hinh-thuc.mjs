// Cổng HÌNH THỨC cho form MCQ (đọc thuần, 21/11 — Thùy bắt lỗi ABCD/đề, mẫu mù K6 sót 6/47): trả danh sách lý do lỗi cho (đề, 4 phương án). Form lỗi KHÔNG được máy ký duyệt.
export function loiHinhThuc(de, lc) {
  const ly = []
  const d = String(de || '')
  const nho = (s) => String(s).replace(/\$/g, '').trim()
  const danhSach = lc.some((x) => nho(x).includes(';'))
  if (((d.match(/\?/g) || []).length >= 2 || /(hay không|thừa hay thiếu)/i.test(d)) && !danhSach && lc.every((x) => /^\$?-?[\d\s\,.{}]+\$?$/.test(String(x).trim()))) ly.push('đề nhiều câu hỏi, phương án chỉ một số trần')
  if ((d.match(/\$[^$]*\$/g) || []).some((m) => /(?<![\\\w])[a-zA-Z]\s*:\s*\d+/.test(m)) && !/(tỉ lệ|tỷ lệ|tỉ số|tỷ số)/i.test(d)) ly.push('dùng ":" thay ký hiệu chia hết')
  if (lc.some((x) => /\b[a-z]\s*:\s*\d+/.test(nho(x)) )) ly.push('phương án dùng ":" như chia hết')
  for (const x of lc) { const p = nho(x).split(/\s*;\s*/).filter(Boolean); if (p.length > 1 && new Set(p).size < p.length) { ly.push('phương án có phần tử lặp'); break } }
  if (lc.some((x) => /^\s*[a-dA-D][.)]\s|\n/.test(String(x)))) ly.push('phương án có nhãn ý / xuống dòng')
  if (lc.some((x) => /^\s*[A-D]\s*[.:)]/.test(String(x)))) ly.push('phương án mang nhãn A–D')
  if (/^\s*[A-D][.)]\s|\n\s*[A-D][.)]\s/.test(d)) ly.push('đề chứa nhãn A–D')
  // (mẫu mù 141 form K6, 21/11) đề hỏi ≥ 2 ý mà phương án là cặp "a; b" không nhãn ⇒ học sinh không biết số nào trả lời ý nào
  if ((d.match(/\?/g) || []).length >= 2 && lc.some((x) => /;/.test(String(x))) && !lc.some((x) => /[A-Za-zÀ-ỹ]{3,}\s*[:=]/.test(nho(x)))) ly.push('đề nhiều ý, phương án cặp không nhãn')
  // phương án là số/danh sách mà không bọc $…$ trong khi cả bộ câu kia bọc
  if (lc.some((x) => /\d/.test(String(x)) && !/\$/.test(String(x)) && !/[A-Za-zÀ-ỹ]{4,}/.test(String(x)))) ly.push('phương án không bọc $')
  // dãy "-...-..." (nhiều dấu chấm lửng liền nhau) — người đọc không biết quy luật
  if (/(\.{3}|\\dots|\\cdots)\s*[-+]\s*(\.{3}|\\dots|\\cdots)/.test(d)) ly.push('dãy có hai dấu chấm lửng liền nhau')
  // (mẫu mù form gốc K6, 21/11) dấu "." làm phép nhân (đọc nhầm số thập phân; VN dùng "," cho thập phân): 237.28, }.7, ).(
  if ((d.match(/\$[^$]*\$/g) || []).some((m) => /\d\.\d|[)\]}]\.\s*[\d(\[a-zA-Z\\]|[\d}]\.\s*[(\[a-zA-Z\\]|[a-zA-Z]\.\s*[\d(\[]/.test(m))) ly.push('dấu "." làm phép nhân')
  // đề hỏi hai ẩn (x, y) mà phương án là cặp "a; b" không ghi x=, y=
  if (/\$x\$\s*,\s*\$y\$|\bx\s*,\s*y\b/.test(d) && lc.some((x) => /;/.test(String(x))) && !lc.some((x) => /[xy]\s*=/.test(String(x)))) ly.push('đề hai ẩn, phương án cặp không ghi x=, y=')
  // đề "chọn trong các số sau: a; b; c; d" mà phương án không thuộc danh sách đề cho
  { const m = d.match(/(?:trong các số|trong các giá trị|trong các số sau)[^:]*:\s*([^?]*)/i)
    if (m) { const tap = new Set((m[1].match(/-?\d+(?:[.,]\d+)?/g) || [])); if (tap.size >= 3 && lc.some((x) => { const n = String(x).replace(/[$\\\s]/g, '').match(/^-?\d+(?:[.,]\d+)?$/); return n && !tap.has(n[0]) })) ly.push('phương án không thuộc danh sách đề cho') } }
  return ly
}
