# Bảng giá THÚ CƯNG — Game Nông Trại (Thùy 23/10: "dùng các loại pet đã làm · làm bảng giá")

> Nguồn dữ liệu: `js/data.js` (repo game `BKGame/NongTrai`, hằng `THU`) — sửa giá/cấp ở đó rồi `node scripts/dong-bo-nong-trai.mjs`. Giá = **ĐIỂM HỌC TẬP (ĐHT)**, chỉ khi chơi theo tài khoản.
> Mua ở màn **🐾 Thú cưng**; xem 3D bằng thư viện `thu-cung.js` của BK World (loài đã làm sẵn ở `BKGame/BatThu`).

## Đối chiếu độ khó kiếm
- Nhiệm vụ ngày: 2 lượt × 40 ĐHT = **80 ĐHT/ngày** (làm đủ). Cấp nông trại đi theo số NGÀY CHĂM (bot chăm: cấp 5/10/15 ở ngày ~15/31/61, cấp 18 sau 90 ngày) ⇒ cấp mua tối đa đặt **17**, đủ để mọi bé mua được trong 3 tháng.
- Giá đặt theo cỡ/độ hiếm: bé nhỏ rẻ, thú lớn đắt; cả bộ 13 bé = **1.270 ĐHT ≈ 16 ngày nhiệm vụ đủ**.

## Bảng giá

| # | Bé | Hệ | Cấp mua | Giá (ĐHT) | Ghi chú |
|---|---|---|---|---|---|
| 1 | 🐶 Chó | — | 1 | 15 | **Có việc:** đuổi kẻ hái trộm (mô hình trong vườn). Bài hướng dẫn tặng 1 chú |
| 2 | 🐱 Mèo | — | 5 | 30 | **Có việc:** tha quà về mỗi ngày (mô hình trong vườn) |
| 3 | 🐦 Chim | — | 7 | 45 | **Có việc:** bắt sâu giúp mỗi sáng; mỗi lần chơi tốn 1 lúa mì |
| 4 | 😺 Mèo Bông | Thường | 6 | 40 | bạn đồng hành |
| 5 | 🦔 Nhím Điện | Điện | 8 | 60 | bạn đồng hành |
| 6 | 🐧 Cánh Cụt Nước | Nước | 8 | 60 | bạn đồng hành |
| 7 | 🐔 Gà Lửa | Lửa | 9 | 70 | bạn đồng hành |
| 8 | 🐑 Cừu Mây | Nước | 10 | 90 | bạn đồng hành |
| 9 | 🦊 Cáo Lửa | Lửa | 11 | 100 | bạn đồng hành |
| 10 | 🐵 Khỉ Lá | Cỏ | 12 | 120 | bạn đồng hành |
| 11 | 🐮 Bò Tuyết | Băng | 13 | 140 | bạn đồng hành |
| 12 | 🦁 Sư Tử Lửa | Lửa | 15 | 220 | bạn đồng hành — thú lớn |
| 13 | 🐘 Voi Rừng | Cỏ | 17 | 280 | bạn đồng hành — thú lớn nhất |
| | **Tổng** | | | **1.270** | |

**Bạn đồng hành** (loài số 4–13): chưa có kỹ năng, không có mô hình ngoài vườn; chơi 1 lần/ngày (+5 thiện cảm, mốc ★20/50/100 như chó/mèo/chim) và xem 3D ngay trong màn Thú cưng. Muốn cho từng loài một kỹ năng (vd Cừu Mây tăng len/sữa, Cáo Lửa đuổi trộm) thì quyết riêng — chưa làm.

## Loài chưa dùng
Trong thư viện BK World còn Sói Nguyệt, Băng Thần Mã (to/dữ — thư viện thú cưng đã chủ ý bỏ), Thiên Kình, Eidrolon, Ophydia (khuôn khác chưa vào thư viện thú cưng). Thêm sau = 1 dòng trong `THU` nếu thư viện xuất được.
