// Badge số trên ICON app ngoài màn hình chính (kiểu Zalo/Messenger) — Badging API chuẩn web.
// CEO 10/09: pilot cho pt + ta trước. Chỉ set số THẬT đã tính xong ở màn hình (không đoán số khi
// app đóng — §1.5 "thà bỏ trống còn hơn đánh sai"). Safari/iOS chỉ nhận khi đã "Thêm vào MH chính"
// (iOS 16.4+); trình duyệt không hỗ trợ thì các hàm này no-op, không lỗi.
export function setAppBadgeCount(n: number) {
  const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> }
  if (!nav.setAppBadge || !nav.clearAppBadge) return
  if (n > 0) nav.setAppBadge(n).catch(() => {})
  else nav.clearAppBadge().catch(() => {})
}
