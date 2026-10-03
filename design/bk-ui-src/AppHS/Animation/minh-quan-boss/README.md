# Boss Minh Quân / MQ

Mở `xem-thu.html` bằng trình duyệt để xem chuyển động, đổi tốc độ, dừng hoặc xem từng ảnh. Không cần cài thư viện để xem.

## PNG riêng

Thư mục `assets/` chứa 44 ảnh PNG RGBA nền trong suốt:

| Nhóm | Tệp | Số ảnh |
| --- | --- | --- |
| Nói chuyện | `talk_01.png` đến `talk_06.png` | 6 |
| Gồng và bắn laser từ tay | `laser_01.png` đến `laser_06.png` | 6 |
| Trúng đòn | `hit_01.png` đến `hit_06.png` | 6 |
| Khinh thường khi thắng | `taunt_01.png` đến `taunt_06.png` | 6 |
| Bị hạ gục | `defeat_01.png` đến `defeat_06.png` | 6 |
| Nửa thân trên cho hội thoại | `dialogue_upper.png` | 1 |
| Bắn 1 tên lửa | `missile_single_01.png` đến `missile_single_06.png` | 6 |
| Mưa tên lửa | `missile_rain_01.png` đến `missile_rain_06.png` | 6 |
| Tên lửa FX riêng | `missile_projectile.png` | 1 |

Phát theo thứ tự 01 → 06. Nói chuyện lặp; các chuỗi khác phát một lần. Hạ gục giữ khung 06.

## Đưa vào game

`animation-data.json` chứa đường dẫn PNG, thời gian mỗi ảnh tính bằng ms, kích thước và điểm neo. Các PNG đã căn chân; không cần cắt từ sheet. Các ảnh thường có kích thước 768 × 640, điểm neo (384, 580). Laser dùng canvas rộng 2048 × 640, điểm neo (450, 580) để chứa tia. Khi đổi động tác, đặt điểm neo của ảnh vào cùng vị trí trong game, không căn theo góc trái canvas.

Laser và các hiệu ứng trúng đòn/khói đã nằm trong PNG tương ứng. Chúng chưa được xuất thành lớp FX riêng. Bộ này là animation theo 6 khung vẽ, không phải rig xương; có thay đổi nhỏ ở nét mặt và chi tiết giáp giữa các ảnh. Cần thêm khung trung gian hoặc rig nếu muốn chuyển động mượt hơn.

Hai chiêu tên lửa dùng FX riêng: `missile_projectile.png` hướng mũi sang phải, có thể xoay theo đường bay. Chiêu đơn phóng 1 quả lúc 1000 ms. Mưa tên lửa phóng 6 quả từ 1250 ms, cách nhau 90 ms, bay lên rồi rơi theo đường cong. Tham số trong `animation-data.json`; `missiles.js` chứa cách ghép đường bay và hiệu ứng nổ cho bản xem thử. Nổ là hiệu ứng canvas trong bản xem thử, chưa có PNG nổ riêng.

## Đề xuất tiếp theo

Đứng chờ với lõi MQ thở sáng; nhảy đập đất tạo sóng xung kích; quét laser ngang; mở giáp vai phóng tên lửa; dựng khiên lục giác; quá tải khi chuyển giai đoạn hai.

## Nguồn và kiểm tra

Ảnh gốc và các tư thế được tạo bằng ImageGen tích hợp, dựa trên bản boss MQ đã duyệt. Prompt lưu trong `prompts.json` và `laser-padding-prompt.txt`. Các PNG riêng được tách và căn bằng `export-frames.cjs`; nguồn sheet giữ trong `reference/`.

Prompt hai chiêu tên lửa và projectile lưu trong `missile-prompts.json`. Đã kiểm tra thêm 12 PNG riêng có góc alpha=0, một quả ở chiêu đơn, sáu quả ở chiêu mưa và hiệu ứng rơi/va chạm; không có lỗi JavaScript. Báo cáo bổ sung trong `missile-frame-verification.json`.

Đã kiểm tra 30 khung có alpha, bốn góc trong suốt, không vượt canvas. Bản xem thử tải đủ các chuỗi, chỉnh từng khung hoạt động, nói chuyện phát lặp, hạ gục dừng khung cuối, không lỗi JavaScript, bố cục điện thoại không tràn ngang. Báo cáo nằm trong `frame-verification.json` và `browser-verification.json`.
