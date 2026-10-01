# hs-skin-rpg-v1

## 1. Đơn đặt hàng
- App: hs
- Màn: skin-rpg
- Đối tượng: học sinh lớp 9–12, màn Home điện thoại dọc 430px.
- Phạm vi kit: chỉ asset hình ảnh cho skin Anime RPG; bố cục, chữ, thẻ và nút do code dựng.
- Phong cách: anime fantasy game cao cấp, thiết kế gốc; xanh đêm #141a33 / #2c3a66 + vàng cổ #e9c77b / #f4d98f.
- Font chữ giao diện do code vẽ bằng Philosopher; không có chữ trong asset.
- Phiên bản kit: v1.

## 2. Font & bảng màu
| Vai trò | Giá trị |
|---|---|
| Font giao diện | Philosopher (code dựng, không nằm trong asset) |
| Nền chính | #141a33 |
| Nền chuyển | #2c3a66 |
| Vàng cổ | #e9c77b |
| Vàng sáng | #f4d98f |
| Bronze viền | #6b5a33 |
| Accent cyan | dùng cho `ill_rpg_luyen.png` |
| Accent blue | dùng cho `ill_rpg_lop.png` |
| Accent warm red | dùng cho `ill_rpg_btvn.png` |
| Accent amber | dùng cho `ill_rpg_thithu.png` |

## 3. Bảng kiểm kê
| id | Vùng | Phần tử | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|
| 01 | nền | Bầu trời fantasy đêm | BACKDROP | không | chung | `assets/backdrop/backdrop_rpg_sky.png` | 1080×1920; đảo nổi/tàn tích chỉ tập trung vùng trên; 75% dưới tối và ít chi tiết |
| 02 | decor | Hoa văn góc | DECOR | không | chung | `assets/decor/decor_rpg_corner.png` | 512×512 RGBA; top-left; code xoay cho 3 góc còn lại |
| 03 | decor | Đường phân cách vàng | DECOR | không | chung | `assets/decor/decor_rpg_divider.png` | 1024×128 RGBA; sao 4 cánh ở giữa, hai đầu thuôn |
| 04 | body | Bài trên lớp — bút lông + giấy da | ILLUST | không | chung | `assets/illustrations/ill_rpg_lop.png` | 512×512 RGBA; vàng + navy + ánh xanh |
| 05 | body | Bài tập về nhà — thư niêm phong | ILLUST | không | chung | `assets/illustrations/ill_rpg_btvn.png` | 512×512 RGBA; sáp vàng + ribbon |
| 06 | body | Tự luyện — tinh thể | ILLUST | không | chung | `assets/illustrations/ill_rpg_luyen.png` | 512×512 RGBA; lõi cyan, khung vàng |
| 07 | body | Thi thử — rương kho báu | ILLUST | không | chung | `assets/illustrations/ill_rpg_thithu.png` | 512×512 RGBA; rương đóng, trim vàng, keyhole amber |

## 4. Trạng thái & hành vi
- Không có trạng thái riêng trong asset.
- Mọi chữ, số, trạng thái, badge, thẻ và nút do code dựng.
- `decor_rpg_corner.png` được code xoay để dùng đủ bốn góc.
- Các icon chỉ dùng như minh hoạ trong ô chức năng; không chứa text hay frame.

## 5. Thứ tự lớp
nền → decor → thẻ do code → icon minh hoạ → chữ/badge/nút do code.

## 6. Danh sách file trong kit
| Đường dẫn | Kích thước | Loại |
|---|---:|---|
| `assets/backdrop/backdrop_rpg_sky.png` | 1080×1920 | BACKDROP |
| `assets/decor/decor_rpg_corner.png` | 512×512 | DECOR |
| `assets/decor/decor_rpg_divider.png` | 1024×128 | DECOR |
| `assets/illustrations/ill_rpg_lop.png` | 512×512 | ILLUST |
| `assets/illustrations/ill_rpg_btvn.png` | 512×512 | ILLUST |
| `assets/illustrations/ill_rpg_luyen.png` | 512×512 | ILLUST |
| `assets/illustrations/ill_rpg_thithu.png` | 512×512 | ILLUST |
