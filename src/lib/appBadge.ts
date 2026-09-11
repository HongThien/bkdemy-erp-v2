// Badge số trên ICON app ngoài màn hình chính (kiểu Zalo/Messenger) — Badging API chuẩn web.
// CEO 10/09: pilot cho pt + ta trước. Chỉ set số THẬT đã tính xong ở màn hình (không đoán số khi
// app đóng — §1.5 "thà bỏ trống còn hơn đánh sai"). Safari/iOS chỉ nhận khi đã "Thêm vào MH chính"
// (iOS 16.4+); trình duyệt không hỗ trợ thì các hàm này no-op, không lỗi.
// ⚠ 11/09: badge không hiện trên máy CEO dù đủ điều kiện (đã cài PWA, đã cấp quyền Thông báo +
// Badges) — trước đây lỗi bị NUỐT im lặng (.catch(() => {})), không cách nào biết thật sự xảy ra
// gì trên máy đó. Giờ LOG vào errorBuffer (console.error đã vá ở initErrorBuffer) — lỗi tự đi kèm
// khi bấm 🐞 Báo lỗi, đọc được từ xa qua bảng bao_loi, không cần debug tay qua cáp.
let daBaoKhongHoTro = false
export function setAppBadgeCount(n: number) {
  const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> }
  if (!nav.setAppBadge || !nav.clearAppBadge) {
    if (!daBaoKhongHoTro) { daBaoKhongHoTro = true; console.error(`appBadge: navigator.setAppBadge không tồn tại (API không hỗ trợ trên trình duyệt/iOS này).`) }
    return
  }
  const p = n > 0 ? nav.setAppBadge(n) : nav.clearAppBadge()
  p.catch((e) => console.error(`appBadge: setAppBadgeCount(${n}) lỗi — ${e?.name ?? ''}: ${e?.message ?? String(e)}`))
}
