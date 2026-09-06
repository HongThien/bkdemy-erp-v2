# APK Android — app Học sinh (hs.bkacademy.edu.vn) + app Trợ giảng (ta.bkacademy.edu.vn)

Tạo 03/09/2026 (HS), 05/09/2026 (TA). App Android = **WebView native (Capacitor 8) trỏ thẳng lên domain production**.

| App | key | appId | Project Android | URL | APK ra |
|---|---|---|---|---|---|
| Học sinh | `hs` | `vn.edu.bkacademy.hs` | `android/` | https://hs.bkacademy.edu.vn | `apk/BKAcademy-HS.apk` |
| Trợ giảng | `ta` | `vn.edu.bkacademy.ta` | `android-ta/` | https://ta.bkacademy.edu.vn | `apk/BKAcademy-TA.apk` |

Danh sách app = `APPS` trong `capacitor.config.ts` (1 file config, chọn app bằng env `CAP_APP`). appId khác nhau ⇒
cài song song 2 app trên cùng máy. Thêm app mới (GV, OPS…): thêm 1 entry vào `APPS` → `npm run build:<app>` →
`CAP_APP=<app> npx cap add android` → `node scripts/android/gen-icons.mjs <app>` → thêm quyền CAMERA vào manifest →
copy `android/app/build.gradle` (đổi appId) + tạo keystore riêng → `npm run apk -- <app>`.

## Vì sao trỏ URL thay vì đóng gói bundle vào APK
- Web deploy (Vercel) lúc nào → user mở app là thấy bản đó, **không phát hành lại APK**, không bắt cài lại.
- Cùng cơ chế PWA đang có (SW autoUpdate) — APK chỉ là "vỏ" có icon ngoài màn hình chính, mở full-screen,
  không thanh địa chỉ, tránh phải "Thêm vào màn hình chính" thủ công trên Chrome.
- Đổi sang bundle offline (không cần mạng để load shell): bỏ khối `server` trong `capacitor.config.ts`
  → mỗi lần đổi code phải build + phát APK mới.

## Build
```bash
npm run apk          # app HS
npm run apk -- ta    # app TA
```
→ `apk/BKAcademy-<APP>.apk` (release, đã ký). Script tự: `build:<app>` → `cap sync android` → `gradle assembleRelease`.
Thêm `--debug` → bản ký debug (test nhanh, đừng phát cho người dùng).

**Máy build cần:** JDK 21 + Android SDK (platform 36, build-tools 36) + Gradle 8.14.3. Máy Thùy đã có bản
**portable** tại `C:\Users\WBPC\android-tools\` (jdk-21…, sdk/, gradle-8.14.3/) — không cài Android Studio,
không cần admin. Máy khác: đặt `JAVA_HOME` + `ANDROID_HOME` rồi chạy lệnh trên (script rơi về `gradlew`).
Lưu ý: gradle wrapper tự tải qua Java HTTP trên máy này chỉ ~85 KB/s (45 phút) — tải zip bằng curl từ
`mirrors.cloud.tencent.com/gradle/` (40 MB/s) rồi giải nén vào `android-tools/` nhanh hơn nhiều.

## Keystore (QUAN TRỌNG — backup ngoài repo)
- HS: `android/keystore/bkacademy-hs.jks` + `android/keystore.properties`.
  TA: `android-ta/keystore/bkacademy-ta.jks` + `android-ta/keystore.properties`. **Cả 4 file .gitignore.**
- Android chỉ cho **cập nhật đè** app khi APK mới cùng chữ ký. **Mất keystore = người dùng phải gỡ app cài lại**
  (mất session đăng nhập). → Copy các file này ra Drive/USB riêng ngay.
- Lên Google Play sau này: dùng đúng keystore này để ký lần đầu (hoặc bật Play App Signing).

## Phát cho người dùng
- Gửi file `.apk` (Zalo/Drive) → mở → Android hỏi "Cho phép cài từ nguồn không xác định" → Cài.
- Muốn có link tải cố định: copy APK vào `public/` (vd `public/BKAcademy-HS.apk`) → deploy →
  `https://hs.bkacademy.edu.vn/BKAcademy-HS.apk`. (Chưa làm — cân nhắc: binary ~5MB vào git mỗi bản.)

## Mỗi lần ra bản mới
1. Tăng `versionCode` (+1) và `versionName` trong `<project>/app/build.gradle` — Android từ chối cài đè nếu
   `versionCode` không lớn hơn bản đang cài.
2. `npm run apk [-- ta]`.
(Chỉ cần khi đổi **vỏ native**: icon, quyền, tên app, URL. Sửa web thì KHÔNG cần — tự cập nhật.)

## Icon / splash
Nguồn duy nhất = `public/icon-512.png` (cùng icon PWA, 2 app dùng chung icon). Đổi icon →
`node scripts/android/gen-icons.mjs <hs|ta>` rồi build lại. Nền splash = `backgroundColor` của app trong `APPS`.

## Quyền đã khai báo
`INTERNET` · `CAMERA` (chụp ảnh bài làm / bài chấm qua `<input type=file capture>`; WebView tự hỏi quyền lúc dùng).

## Đã biết / chưa làm
- Nút Back Android: Capacitor mặc định lùi lịch sử WebView, hết lịch sử thì thoát app.
- Chưa có push notification native (Web Push trong WebView Android **không** chạy — app TA/PT nếu cần nhắc
  việc phải làm FCM qua Capacitor plugin); chưa lên Google Play (cần tài khoản dev $25 + review).
