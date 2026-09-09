// ⭐ MỘT nguồn macro DUY NHẤT cho CẢ ô nhập (MathLive) lẫn mọi chỗ render (KaTeX: preview / trang in /
// test online — tất cả đi qua MathText ở screens/kho/ui.tsx). Soạn thấy sao thì in ra vậy: thêm macro
// ở đây là cả 2 bên cùng hiểu; KHÔNG định nghĩa macro lẻ ở nơi khác.
//
// Cú pháp = macro KaTeX (chuỗi thay thế, tham số #1 #2…). MathLive nhận cùng dạng chuỗi.
export const MATH_MACROS: Record<string, string> = {
  // Tập số — MathLive có sẵn \R \N \Z \Q \C, KaTeX thì KHÔNG → khai ở đây để 2 bên khớp nhau.
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  // Độ (góc) — viết tắt cho dữ liệu cũ do AI sinh; mẫu mới chèn thẳng ^{\circ}.
  '\\dg': '^{\\circ}',
}

// Macro CHỈ cho KaTeX: \placeholder{} là ô trống của MathLive (built-in bên đó, KHÔNG được ghi đè).
// Lúc lưu, MathPopup đã bỏ hết \placeholder → chỉ còn gặp khi preview SỐNG trong lúc điền mẫu.
export const KATEX_ONLY_MACROS: Record<string, string> = {
  // \rule chạy cả math lẫn text (trong \text{…}); \square chỉ có ở math → dùng ô xám đặc.
  '\\placeholder': '\\textcolor{silver}{\\rule[-0.15em]{0.6em}{0.8em}}#1',
}

// KaTeX GHI vào object macros khi gặp \gdef → luôn đưa bản sao mới cho mỗi lần render.
export const katexMacros = () => ({ ...MATH_MACROS, ...KATEX_ONLY_MACROS })
