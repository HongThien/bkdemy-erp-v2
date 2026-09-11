// Handler PUSH cho service worker app PHÁT TRIỂN/TRỢ GIẢNG (pt/ta). Được workbox `importScripts`
// vào sw.js lúc build (vite.config.pt.ts / vite.config.ta.ts). File thuần JS, KHÔNG qua bundler,
// KHÔNG import gì. Payload do api/pt-nhac-viec.mjs / api/ta-nhac-viec.mjs gửi: { title, body, url, tag, count }.
// ⭐ BADGE ICON (CEO 10/09): app ĐÓNG cũng phải thấy số — setAppBadge() ngay khi nhận push, không
// đợi mở app. `count` là số THẬT tính sẵn ở DB lúc gửi (fn_pt_push_dem / fn_ta_push_dem) — không
// đoán ở đây. API nằm ở WorkerNavigator (self.navigator), KHÔNG PHẢI self.registration (đã kiểm
// lại theo MDN — nhầm 1 lần trước khi sửa). Trình duyệt không hỗ trợ (hoặc iOS chưa "Thêm vào MH
// chính") thì self.navigator.setAppBadge không tồn tại → bỏ qua, không lỗi.
// ⚠ 11/09: noti hiện đúng (push tới máy, handler chạy) nhưng badge KHÔNG hiện trên iOS dù mọi điều
// kiện đủ (PWA cài, quyền Thông báo + Badges bật) — không debug được vì lỗi trong SW không tới
// được errorBuffer (khác context với trang). Giờ postMessage kết quả thật ra CHO MỌI TAB đang mở —
// main-pt/main-ta lắng nghe rồi console.error() (đã vá bởi initErrorBuffer) để lỗi tự đi kèm lúc
// bấm 🐞 Báo lỗi, đọc được từ bảng bao_loi mà không cần remote-debug qua cáp.
self.addEventListener('push', (event) => {
  let d = {}
  try { d = event.data ? event.data.json() : {} } catch { d = { body: event.data ? event.data.text() : '' } }
  const baoKetQua = (msg) => self.clients.matchAll({ includeUncontrolled: true }).then((list) => {
    for (const c of list) c.postMessage(Object.assign({ type: 'appBadgeResult' }, msg))
  }).catch(() => {})
  const dat = () => {
    if (!self.navigator || !self.navigator.setAppBadge || !self.navigator.clearAppBadge) {
      return baoKetQua({ ok: false, supported: false })
    }
    const n = Number(d.count) || 0
    return (n > 0 ? self.navigator.setAppBadge(n) : self.navigator.clearAppBadge())
      .then(() => baoKetQua({ ok: true, supported: true, count: n }))
      .catch((e) => baoKetQua({ ok: false, supported: true, count: n, error: (e && (e.name + ': ' + e.message)) || String(e) }))
  }
  event.waitUntil(Promise.all([
    self.registration.showNotification(d.title || 'BK Phát triển', {
      body: d.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: d.tag || 'pt-nhac-viec',   // cùng tag → thay thế noti cũ, không chồng chất
      renotify: true,
      data: { url: d.url || '/' },
    }),
    dat(),
  ]))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) {
      if ('focus' in c) { if ('navigate' in c) c.navigate(url).catch(() => {}); return c.focus() }
    }
    return self.clients.openWindow(url)
  }))
})
