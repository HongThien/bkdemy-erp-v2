// Ảnh THU NHỎ qua dịch vụ biến đổi ảnh của Supabase Storage (render/image) — ảnh gốc upload từ điện thoại
// thường 0,2–1,2MB/ảnh; lưới vài chục ảnh là tải hàng chục MB ⇒ màn lag, ảnh không lên (Thùy 08/10, tủ quà).
// Bản thu nhỏ ~15–30KB, tự ra webp khi trình duyệt nhận webp. URL không phải ảnh public của Storage
// (ảnh tĩnh /bk-ui, link ngoài…) thì trả nguyên.
// `rong` = bề rộng PX THẬT cần (đã tính màn retina — thường gấp đôi bề rộng CSS).
const PUBLIC = '/storage/v1/object/public/'
const RENDER = '/storage/v1/render/image/public/'

export function anhNho(url: string | null | undefined, rong: number): string | null {
  if (!url) return null
  if (!url.includes(PUBLIC) || url.includes('?')) return url
  return `${url.replace(PUBLIC, RENDER)}?width=${rong}&quality=70`
}
