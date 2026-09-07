# CLAUDE REBUILD GUIDE

## Mục tiêu
Dựng lại chính xác phong cách của bộ UI 7 màn hình TA app dựa trên các reference PNG trong `references/screens/` và bộ SVG trong `assets/`.

## Quy tắc chung
1. Chỉ dùng SVG cho icon / illustration cố định.
2. Card, tab, button, progress bar, badge số lượng, text label, list item phải code thành component, không convert thành ảnh.
3. Bố cục mobile khung 9:19.5, bo góc lớn, tông màu tươi sáng.
4. Dùng nền trắng / kem rất nhạt, card bo tròn 18-28 px, shadow rất nhẹ.
5. Typography: tiêu đề đậm, text phụ màu xanh xám.

## Token màu gợi ý
- Primary green: #22C55E
- Primary blue: #3B82F6
- Accent yellow: #F7C948
- Accent orange: #F59E0B
- Accent pink: #FB7185
- Soft lilac: #A78BFA
- Background: #F5F8FF
- Text dark: #13204A
- Text secondary: #6B7AAE
- Border: #DCE6F7

## Theo màn hình
### 01 Home
- Dùng `assets/home/hero_student.svg` cho minh hoạ học sinh ở hero card.
- 6 module chính: classwork, ET, BTVN, tự luyện, của tôi, đề thi thử.
- Icon tương ứng: `classwork_book.svg`, `et_document.svg`, `homework_house.svg`, `self_practice_target.svg`, `study_chart.svg`, `mock_exam_locked_doc.svg`.

### 02 Attendance
- Dùng `assets/attendance/header_calendar_badge.svg`.
- Danh sách lớp là component list, mỗi dòng có giờ bên trái, lớp ở giữa, nút xanh `Mở buổi` bên phải.

### 03 Report
- Dùng `assets/report/header_boy.svg` ở phần header phải.
- Empty state dùng `assets/report/empty_envelope.svg`.

### 04 Prep
- Dùng `assets/prep/header_girl.svg` và `assets/prep/broom_large.svg`.
- Empty state là card giữa màn hình với icon chổi lớn.

### 05 Test
- Dùng `assets/test/header_boy_clipboard.svg` và `assets/test/star_large.svg`.
- Empty state dùng phong cách gần giống report/prep.

### 06 Gift
- Dùng icon sản phẩm trong `assets/gift/`.
- Grid sản phẩm là component 2 cột hoặc 3 cột tuỳ màn.
- Mỗi item gồm ảnh sản phẩm SVG, tên, giá điểm, tag nhỏ.

### 07 My
- Avatar dùng `assets/my/my_avatar.svg`, ring dùng `assets/my/progress_ring.svg`.
- Menu list icon: `icon_rank.svg`, `icon_gavel.svg`, `icon_lucky.svg`, `icon_progress.svg`, `icon_shopping.svg`, `icon_guide.svg`.

## Mapping icon nhanh
- Home nav: `assets/common/nav_home.svg`
- Attendance nav: `assets/common/nav_attendance.svg`
- Report nav: `assets/common/nav_report.svg`
- Prep nav: `assets/common/nav_prep.svg`
- Test nav: `assets/common/nav_test.svg`
- Gift nav: `assets/common/nav_gift.svg`
- My nav: `assets/common/nav_my.svg`

## Lưu ý
- Bộ SVG này là asset handoff sạch để code lại giao diện, ưu tiên dựng đúng style tổng thể và cấu trúc UI.
- Nếu cần khớp 100% pixel, hãy đối chiếu thêm 7 PNG reference trong `references/screens/`.
