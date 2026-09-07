# hs-bai-tap-tren-lop-v1

## 1. Đơn đặt hàng
- **App:** hs
- **Màn:** bai-tap-tren-lop
- **Mô tả màn:** danh sách bài tập trên lớp của học sinh, điện thoại dọc khoảng 430px.
- **Phần tử ĐỘNG:** số bài chưa làm; tab đang chọn; tên bài/môn/lớp; ngày buổi học; số câu; badge `mới`; CTA/trạng thái của từng bài.
- **Trạng thái trong kit:** trạng thái thường với tab `Chưa làm` đang active và 1 bài mới.
- **Biến thể:** nam / nữ, cùng bố cục.
- **Phong cách:** pastel tròn mềm, 3D-flat nhẹ, nhiều khoảng thở; mỗi trang chỉ có **1 câu quote**.
- **Giữ nguyên:** nút quay lại, 2 tab `Chưa làm / Hoàn thành`, dạng card bài tập, thông tin buổi + số câu, CTA `Bắt đầu`, badge `mới`.
- **Phiên bản kit:** v1.

## 2. Font & bảng màu theo biến thể
- Font UI: **Baloo 2**.
- Font quote/viết tay: **Itim**.

| Vai trò | Nam | Nữ |
|---|---|---|
| Primary | `#1673D8` | `#F23886` |
| Nền | xanh pastel rất nhạt | hồng pastel rất nhạt |
| Chữ chính | `#0F1745` | `#0F1745` |
| Chữ phụ | `#6E7EAA` | `#756F9F` |
| Tab nền | `#DDE8F7` | `#F2DDEC` |
| Tab active | trắng | trắng |
| CTA | xanh đậm | hồng đậm |
| Card | trắng / trắng xanh | trắng / trắng hồng |
| Shadow | `rgba(76,108,170,.10)` | `rgba(182,96,145,.10)` |

## 3. Bảng kiểm kê
| id | Vùng | Phần tử | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|
| 01 | top | Status bar hệ thống | TEXT/GLYPH hệ thống | động | chung | — | Không dựng bằng asset; để OS/webview xử lý. |
| 02 | top | Nút quay lại — nền | SHAPE | — | chung | — | Nền trắng, bo 16–18px, bóng rất nhẹ. |
| 03 | top | Mũi tên quay lại | GLYPH | — | chung | `assets/svg/back.svg` | Nét xanh tím. |
| 04 | top | Tiêu đề `Bài tập trên lớp` | TEXT | tĩnh | chung | — | Baloo 2, 800, navy, rất to. |
| 05 | top | Gạch nhấn dưới tiêu đề (nữ) / khoảng thở (nam) | SHAPE | — | theo màu | — | Chỉ là accent mảnh; không asset. |
| 06 | top | Trang trí máy bay giấy (nam) | GLYPH | — | nam | `assets/svg/paper_plane.svg` | Nhỏ, phía trên/phải. Nữ có thể ẩn. |
| 07 | top | Sparkle vàng nhỏ | GLYPH | — | chung | `assets/svg/sparkle.svg` | Dùng tiết chế, không lặp dày. |
| 08 | body | Thanh tab nền | SHAPE | — | theo màu | — | Pill dài, bo lớn, pastel. |
| 09 | body | Tab `Chưa làm` | SHAPE+TEXT | động | chung | — | Active: nền trắng; số `(N)` động; Baloo 2 semibold. |
| 10 | body | Tab `Hoàn thành` | SHAPE+TEXT | động | chung | — | Inactive: nền trong, chữ xám; khi chọn thì đổi active. |
| 11 | body | Card bài tập — nền | SHAPE | — | chung | — | Trắng, bo 26–30px, shadow mềm. |
| 12 | body | Icon sách tím bookmark hồng | ILLUST | — | chung | `assets/illustrations/ill_classwork_book.png` | 3D-flat pastel; đặt trong ô nền pastel nhỏ. |
| 13 | body | Ô nền icon | SHAPE | — | theo màu | — | Nam xanh tím nhạt; nữ hồng tím nhạt. |
| 14 | body | Tên bài `Bài tập Toán · 11A1` | TEXT | **động** | chung | — | Baloo 2 700/800, navy, 1 dòng. |
| 15 | body | Dòng `Buổi 19/08/2026 · 87 câu` | TEXT | **động** | chung | — | Baloo 2, chữ phụ. |
| 16 | body | Badge `mới` — nền | SHAPE | **động** | theo màu | — | Pill xanh nhạt; nếu không mới thì ẩn. |
| 17 | body | Badge `mới` — chữ | TEXT | **động** | chung | — | Baloo 2 semibold, xanh. |
| 18 | body | CTA `Bắt đầu →` | TEXT | **động** | theo màu | — | Nam xanh, nữ hồng; có thể đổi theo trạng thái. |
| 19 | body | Chevron phải của card | GLYPH | — | chung | `assets/svg/chevron_right.svg` | Có thể đặt trong vòng tròn SHAPE nhạt. |
| 20 | body | Vùng trống giữa card và footer | SHAPE/SPACE | — | chung | — | Giữ nhiều khoảng thở; không chèn thêm quote. |
| 21 | footer | Quote duy nhất | TEXT | tĩnh | theo biến thể | — | **Nam:** `Cố gắng hôm nay để tốt hơn ngày mai!` · **Nữ:** `Cố lên bạn nhé!`; Itim, 1 cụm duy nhất trên trang. |
| 22 | footer | Gạch chân/heart/sparkle quanh quote | SHAPE/GLYPH | — | theo màu | — | Dùng rất ít, để quote là điểm nhấn duy nhất. |
| 23 | footer | Cụm sách + cốc + cây | DECOR | — | nam/nữ | `assets/decor/decor_books_cup_default.png` (nam) · `assets/decor/decor_books_cup_female.png` (nữ, bổ sung 08/09) | Góc phải dưới; chỉ dùng như trang trí. |
| 24 | nền | Backdrop | BACKDROP | — | nam | `assets/backdrop/backdrop_male.png` | Nền xanh pastel + mây, không UI. |
| 25 | nền | Backdrop | BACKDROP | — | nữ | `assets/backdrop/backdrop_female.png` | Nền hồng pastel + mây, không UI. |

## 4. Trạng thái & hành vi
- Reference nam: `reference/reference_male.png`.
- Reference nữ: `reference/reference_female.png`.
- Cả hai dùng cùng cấu trúc: header → tabs → card bài → khoảng thở → quote/decor footer.
- Khi chọn `Hoàn thành`: chỉ đổi tab active và data list; không đổi bố cục tổng thể.
- `mới` là badge động: ẩn nếu bài không còn mới.
- Card có thể có nhiều item; list nối tiếp theo cùng style và khoảng cách.
- Nhấn card hoặc `Bắt đầu` → co nhẹ 0.98 trong ~100ms rồi điều hướng; điện thoại không dùng hover.
- Nếu list rỗng, giữ header + tabs + backdrop; phần body thay bằng empty-state do app hiện có/kit khác, không tự thêm chức năng mới trong kit này.
- Mỗi biến thể chỉ có **1 quote**; không thêm các doodle chữ khác.

## 5. Thứ tự lớp
Từ dưới lên:
1. `BACKDROP`.
2. Decor footer và glyph trang trí nhỏ.
3. Các SHAPE: tab bar, card, icon box, badge background, button background.
4. Illustration sách.
5. TEXT động/tĩnh.
6. Chevron/glyph nổi và trạng thái nhấn.

## 6. Danh sách file trong kit
| Đường dẫn | Loại | Kích thước / ghi chú |
|---|---|---|
| `reference/reference_male.png` | reference | 941×1672, biến thể nam đã duyệt |
| `reference/reference_female.png` | reference | 941×1672, biến thể nữ đã duyệt |
| `assets/backdrop/backdrop_male.png` | BACKDROP | 941×1672, RGB |
| `assets/backdrop/backdrop_female.png` | BACKDROP | 941×1672, RGB |
| `assets/illustrations/ill_classwork_book.png` | ILLUST | 1254×1254, PNG alpha |
| `assets/decor/decor_books_cup_default.png` | DECOR | 1254×1254, PNG alpha |
| `assets/svg/back.svg` | GLYPH | vector thật |
| `assets/svg/chevron_right.svg` | GLYPH | vector thật |
| `assets/svg/paper_plane.svg` | GLYPH | vector thật |
| `assets/svg/sparkle.svg` | GLYPH | vector thật |
