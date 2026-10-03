# Hai chiêu tên lửa của MQ

- `missile_single_01.png` → `missile_single_06.png`: mở giáp vai, ngắm, phóng một quả, thu ống phóng.
- `missile_rain_01.png` → `missile_rain_06.png`: mở hai cụm phóng, phóng loạt, khói và đóng giáp.
- `missile_projectile.png`: FX tên lửa riêng, nền trong suốt, mũi mặc định hướng sang phải. Xoay theo hướng bay trong game.

12 PNG tư thế đều 768 × 640; chân neo ở (384, 580). Sáu khung mỗi chiêu, phát một lần. `missile-clips.json` chứa thứ tự và thời gian. Khi chỉ tải gói tên lửa, đường dẫn trong JSON có tiền tố `assets/`: đặt PNG vào thư mục này hoặc cập nhật đường dẫn phù hợp dự án.

Chiêu đơn: phóng 1 quả tại 1000 ms, bay 650 ms. Mưa tên lửa: phóng 6 quả từ 1250 ms, cách nhau 90 ms, mỗi quả bay 1200 ms theo vòng cung rồi rơi xuống. Đây là thông số mặc định của bản xem thử, có thể thay đổi cho gameplay.

Art tạo bằng ImageGen tích hợp. Hiệu ứng nổ trong bản xem thử được vẽ bằng canvas, chưa có sprite nổ riêng. Các ảnh là 6 khung vẽ chủ đạo, không phải rig xương.
