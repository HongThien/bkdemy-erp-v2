import type { CapacitorConfig } from '@capacitor/cli'

// APK Android cho app HỌC SINH (hs.bkacademy.edu.vn) — Thùy 03/09/2026.
// Cách làm: WebView native (Capacitor) TRỎ THẲNG lên domain production, KHÔNG đóng gói bundle vào
// APK. Lý do: web deploy lúc nào thì HS mở app là có bản đó ngay (cùng cơ chế SW autoUpdate của
// PWA) — không phải phát hành lại APK / bắt HS cài lại mỗi lần sửa UI. `webDir` vẫn phải trỏ tới
// dist-hs (Capacitor bắt buộc có thư mục web) nhưng runtime KHÔNG dùng khi có `server.url`.
// Muốn chuyển sang bundle offline (không cần mạng để load shell): bỏ khối `server` rồi
// `npm run build:hs && npx cap sync android` — phải phát hành lại APK mỗi lần đổi code.
const config: CapacitorConfig = {
  appId: 'vn.edu.bkacademy.hs',
  appName: 'BK Academy',
  webDir: 'dist-hs',
  backgroundColor: '#f3f5fa',
  server: {
    url: 'https://hs.bkacademy.edu.vn',
    cleartext: false,
    // Host được điều hướng NGAY TRONG WebView (không văng ra Chrome): domain BK + Supabase (auth,
    // storage tài liệu/ảnh). Link ngoài danh sách này mở bằng trình duyệt hệ thống.
    allowNavigation: ['*.bkacademy.edu.vn', '*.supabase.co'],
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
