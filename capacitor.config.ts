import type { CapacitorConfig } from '@capacitor/cli'

// APK Android cho các app mobile của BK — Thùy 03/09/2026 (HS), 05/09/2026 (TA).
// Cách làm: WebView native (Capacitor) TRỎ THẲNG lên domain production, KHÔNG đóng gói bundle vào
// APK. Lý do: web deploy lúc nào thì user mở app là có bản đó ngay (cùng cơ chế SW autoUpdate của
// PWA) — không phải phát hành lại APK / bắt cài lại mỗi lần sửa UI. `webDir` vẫn phải trỏ tới
// dist-* (Capacitor bắt buộc có thư mục web) nhưng runtime KHÔNG dùng khi có `server.url`.
// Muốn chuyển sang bundle offline (không cần mạng để load shell): bỏ khối `server` rồi
// `npm run build:<app> && npx cap sync android` — phải phát hành lại APK mỗi lần đổi code.
//
// 1 repo — NHIỀU app: chọn app bằng env `CAP_APP` (mặc định `hs`). Mỗi app 1 project Android riêng
// (`android/` cho HS — giữ tên cũ vì đã commit; `android-ta/`…), appId riêng ⇒ cài song song trên
// cùng máy. Dùng: `CAP_APP=ta npx cap sync android` (script `npm run apk -- ta` đã set sẵn).
export const APPS = {
  hs: {
    appId: 'vn.edu.bkacademy.hs',
    appName: 'BK Academy',
    webDir: 'dist-hs',
    url: 'https://hs.bkacademy.edu.vn',
    backgroundColor: '#f3f5fa',
    androidPath: 'android',
    build: 'build:hs',
  },
  ta: {
    appId: 'vn.edu.bkacademy.ta',
    appName: 'BK Trợ giảng',
    webDir: 'dist-ta',
    url: 'https://ta.bkacademy.edu.vn',
    backgroundColor: '#f5f5f7',
    androidPath: 'android-ta',
    build: 'build:ta',
  },
} as const

export type AppKey = keyof typeof APPS

const key = (process.env.CAP_APP ?? 'hs') as AppKey
const app = APPS[key]
if (!app) throw new Error(`CAP_APP="${key}" không hợp lệ — chọn: ${Object.keys(APPS).join(', ')}`)

const config: CapacitorConfig = {
  appId: app.appId,
  appName: app.appName,
  webDir: app.webDir,
  backgroundColor: app.backgroundColor,
  server: {
    url: app.url,
    cleartext: false,
    // Host được điều hướng NGAY TRONG WebView (không văng ra Chrome): domain BK + Supabase (auth,
    // storage tài liệu/ảnh). Link ngoài danh sách này mở bằng trình duyệt hệ thống.
    allowNavigation: ['*.bkacademy.edu.vn', '*.supabase.co'],
  },
  android: {
    path: app.androidPath,
    allowMixedContent: false,
  },
}

export default config
