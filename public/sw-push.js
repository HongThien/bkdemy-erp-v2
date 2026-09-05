// Handler PUSH cho service worker app PHÁT TRIỂN (pt). Được workbox `importScripts` vào sw.js
// lúc build (vite.config.pt.ts). File thuần JS, KHÔNG qua bundler, KHÔNG import gì.
// Payload do api/pt-nhac-viec.mjs gửi: { title, body, url, tag }.
self.addEventListener('push', (event) => {
  let d = {}
  try { d = event.data ? event.data.json() : {} } catch { d = { body: event.data ? event.data.text() : '' } }
  event.waitUntil(self.registration.showNotification(d.title || 'BK Phát triển', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: d.tag || 'pt-nhac-viec',   // cùng tag → thay thế noti cũ, không chồng chất
    renotify: true,
    data: { url: d.url || '/' },
  }))
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
