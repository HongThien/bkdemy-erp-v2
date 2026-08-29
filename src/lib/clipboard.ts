// Đọc ẢNH từ clipboard (nút "📋 Dán") — dùng Async Clipboard API (cần https/localhost). Không có ảnh → null.
// Tách khỏi screens/kho/ui.tsx (08-29, app OPS): ui.tsx import katex ở module-level nên màn nào chỉ cần
// mỗi hàm này (OpsReport/Prep) cũng kéo nguyên KaTeX vào bundle — app OPS không render công thức nào.
// ui.tsx re-export lại từ đây, chỗ import cũ không phải đổi.
export async function readClipboardImageFile(): Promise<File | null> {
  if (!navigator.clipboard?.read) throw new Error('Trình duyệt không hỗ trợ đọc clipboard')
  const items = await navigator.clipboard.read()
  for (const it of items) {
    const type = it.types.find((t) => t.startsWith('image/'))
    if (type) { const blob = await it.getType(type); return new File([blob], `clipboard.${type.split('/')[1] || 'png'}`, { type }) }
  }
  return null
}
