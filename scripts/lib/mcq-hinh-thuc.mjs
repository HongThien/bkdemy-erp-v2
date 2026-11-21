// Cổng HÌNH THỨC cho form MCQ (đọc thuần, 21/11 — Thùy bắt lỗi ABCD/đề, mẫu mù K6 sót 6/47): trả danh sách lý do lỗi cho (đề, 4 phương án). Form lỗi KHÔNG được máy ký duyệt.
export function loiHinhThuc(de, lc) {
  const ly = []
  const d = String(de || '')
  const nho = (s) => String(s).replace(/\$/g, '').trim()
  const danhSach = lc.some((x) => nho(x).includes(';'))
  if (((d.match(/\?/g) || []).length >= 2 || /(hay không|thừa hay thiếu)/i.test(d)) && !danhSach && lc.every((x) => /^\$?-?[\d\s\,.{}]+\$?$/.test(String(x).trim()))) ly.push('đề nhiều câu hỏi, phương án chỉ một số trần')
  if (/\b[a-z]\s*:\s*\d+/.test(d.replace(/\$/g, ' ').replace(/\frac|\dfrac/g, '')) && /(chia hết|\vdots|⋮)/i.test(d + lc.join(' ')) ) ly.push('dùng ":" thay ký hiệu chia hết')
  if (lc.some((x) => /\b[a-z]\s*:\s*\d+/.test(nho(x)) )) ly.push('phương án dùng ":" như chia hết')
  for (const x of lc) { const p = nho(x).split(/\s*;\s*/).filter(Boolean); if (p.length > 1 && new Set(p).size < p.length) { ly.push('phương án có phần tử lặp'); break } }
  if (lc.some((x) => /^\s*[a-dA-D][.)]\s|\n/.test(String(x)))) ly.push('phương án có nhãn ý / xuống dòng')
  if (lc.some((x) => /^\s*[A-D]\s*[.:)]/.test(String(x)))) ly.push('phương án mang nhãn A–D')
  if (/^\s*[A-D][.)]\s|\n\s*[A-D][.)]\s/.test(d)) ly.push('đề chứa nhãn A–D')
  return ly
}
