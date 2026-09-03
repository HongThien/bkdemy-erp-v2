# APK Android — app Học sinh (hs.bkacademy.edu.vn)

Tạo 03/09/2026. App Android = **WebView native (Capacitor 8) trỏ thẳng lên `https://hs.bkacademy.edu.vn`**.

## Vì sao trỏ URL thay vì đóng gói bundle vào APK
- Web deploy (Vercel) lúc nào → HS mở app là thấy bản đó, **không phát hành lại APK**, không bắt HS cài lại.
- Cùng cơ chế PWA đang có (SW autoUpdate) — APK chỉ là "vỏ" có icon ngoài màn hình chính, mở full-screen,
  không thanh địa chỉ, tránh HS phải "Thêm vào màn hình chính" thủ công trên Chrome.
- Đổi sang bundle offline (không cần mạng để load shell): bỏ khối `server` trong `capacitor.config.ts`
  → mỗi lần đổi code phải build + phát APK mới.

## Build
```bash
npm run apk
```
→ `apk/BKAcademy-HS.apk` (release, đã ký). Script tự: `build:hs` → `cap sync android` → `gradlew assembleRelease`.
`npm run apk -- --debug` → bản ký debug (test nhanh, đừng phát cho HS).

**Máy build cần:** JDK 21 + Android SDK (platform 36, build-tools 36) + Gradle 8.14.3. Máy Thùy đã có bản
**portable** tại `C:\Users\WBPC\android-tools\` (jdk-21…, sdk/, gradle-8.14.3/) — không cài Android Studio,
không cần admin. Máy khác: đặt `JAVA_HOME` + `ANDROID_HOME` rồi chạy lệnh trên (script rơi về `gradlew`).
Lưu ý: gradle wrapper tự tải qua Java HTTP trên máy này chỉ ~85 KB/s (45 phút) — tải zip bằng curl từ
`mirrors.cloud.tencent.com/gradle/` (40 MB/s) rồi giải nén vào `android-tools/` nhanh hơn nhiều.

## Keystore (QUAN TRỌNG — backup ngoài repo)
- `android/keystore/bkacademy-hs.jks` + `android/keystore.properties` (mật khẩu) — **cả 2 .gitignore**.
- Android chỉ cho **cập nhật đè** app khi APK mới cùng chữ ký. **Mất keystore = HS phải gỡ app cài lại**
  (mất session đăng nhập). → Copy 2 file này ra Drive/USB riêng ngay.
- Lên Google Play sau này: dùng đúng keystore này để ký lần đầu (hoặc bật Play App Signing).

## Phát cho HS
- Gửi file `.apk` (Zalo/Drive) → HS mở → Android hỏi "Cho phép cài từ nguồn không xác định" → Cài.
- Muốn có link tải cố định: copy APK vào `public/` của bundle HS (vd `public/BKAcademy-HS.apk`) →
  deploy → `https://hs.bkacademy.edu.vn/BKAcademy-HS.apk`. (Chưa làm — cân nhắc: binary ~5MB vào git mỗi bản.)

## Mỗi lần ra bản mới
1. Tăng `versionCode` (+1) và `versionName` trong `android/app/build.gradle` — Android từ chối cài đè nếu
   `versionCode` không lớn hơn bản đang cài.
2. `npm run apk`.
(Chỉ cần khi đổi **vỏ native**: icon, quyền, tên app, URL. Sửa web thì KHÔNG cần — tự cập nhật.)

## Icon / splash
Nguồn duy nhất = `public/icon-512.png` (cùng icon PWA). Đổi icon → `npm run apk:icons` rồi build lại.

## Quyền đã khai báo
`INTERNET` · `CAMERA` (HS chụp ảnh bài làm qua `<input type=file capture>`; WebView tự hỏi quyền lúc dùng).

## Đã biết / chưa làm
- Nút Back Android: Capacitor mặc định lùi lịch sử WebView, hết lịch sử thì thoát app.
- Chưa có push notification, chưa lên Google Play (cần tài khoản dev $25 + review).
