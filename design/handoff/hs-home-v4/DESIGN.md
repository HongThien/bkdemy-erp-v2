# hs-home-v4

## 1) Mục tiêu
Bộ handoff này dành cho Claude để code lại màn hình **Student Home** của app BK Academy bằng **Vite + React**.

Phiên bản này sửa theo đúng yêu cầu mới:
- không dùng asset crop từ mockup cũ;
- backdrop tách riêng, chỉ có mây + màu;
- có 2 biến thể **male** và **female**;
- có thêm **chuông thông báo kèm số** ở góc phải trên cạnh nút chìa khoá;
- có thêm 1 ảnh trạng thái có banner **"Hôm nay có ca bổ trợ"** nằm giữa hero và grid.

## 2) Cấu trúc thư mục
- `assets/backdrop/`
  - `home_backdrop_male.png`
  - `home_backdrop_female.png`
- `assets/characters/`
  - `hero_student_male.png`
  - `hero_student_female.png`
- `assets/decor/`
  - `bottom_books_cup.png`
- `assets/svg/`
  - small UI icons + feature icons + doodles viết tay dạng vector
- `reference/`
  - `home_reference_male_v4.png`
  - `home_reference_female_v4.png`
  - `home_reference_support_banner_v4.png`

## 3) Logic dựng UI
Dùng mô hình:
- **backdrop phía sau** = ảnh nền full màn hình;
- **các item phía trước code bằng React**.

Không dựng UI bằng cách nhúng nguyên screenshot.

### Backdrop
Backdrop chỉ là nền không khí / màu / mây:
- `home_backdrop_male.png`: xanh pastel.
- `home_backdrop_female.png`: hồng tím pastel.

Backdrop **không chứa**:
- chữ viết tay,
- card hero,
- nhân vật,
- grid ô,
- quote footer,
- decor sách/cốc.

### Overlay cần code
1. Header:
- câu chào lớn kiểu viết tay;
- cụm action bên phải gồm:
  - bell button,
  - badge số trên bell,
  - key button,
  - logout button.

2. Hero card:
- avatar vòng tròn + initials;
- tên học sinh;
- dòng ID / lớp / môn;
- pill slogan;
- nhân vật hero đứng bên phải;
- doodle text phụ xung quanh.

3. Banner hỗ trợ (optional state):
- nằm giữa hero và grid;
- chỉ hiện trong state có bổ trợ;
- nội dung mẫu: `Hôm nay có ca bổ trợ` + dòng mô tả ngắn.

4. Feature grid 2 cột:
- Bài tập trên lớp
- ET
- BTVN
- Tự luyện
- Thông tin học tập
- Làm đề thi thử

5. Footer motivation:
- quote lớn kiểu viết tay;
- decor `bottom_books_cup.png` đặt góc phải dưới.

## 4) Asset mapping đề xuất
### Hero
- `assets/characters/hero_student_male.png`
- `assets/characters/hero_student_female.png`

### Decor
- `assets/decor/bottom_books_cup.png`

### Small UI
- `assets/svg/key.svg`
- `assets/svg/bell.svg`
- `assets/svg/crown.svg`
- `assets/svg/badge_notification.svg`
- `assets/svg/arrow_pink.svg`
- `assets/svg/arrow_purple.svg`
- `assets/svg/arrow_orange.svg`
- `assets/svg/arrow_green.svg`
- `assets/svg/arrow_blue.svg`
- `assets/svg/arrow_gray.svg`

### Feature icons
- `assets/svg/icon_classwork_book.svg`
- `assets/svg/icon_et_document.svg`
- `assets/svg/icon_homework_house.svg`
- `assets/svg/icon_self_practice_target.svg`
- `assets/svg/icon_study_info_chart.svg`
- `assets/svg/icon_mock_exam_locked.svg`

### Doodles viết tay
- `assets/svg/doodle_keep_going.svg`
- `assets/svg/doodle_knowledge_power.svg`
- `assets/svg/doodle_review_daily.svg`
- `assets/svg/doodle_small_steps.svg`
- `assets/svg/doodle_understand_progress.svg`
- `assets/svg/doodle_coming_soon.svg`

## 5) Reference nào dùng để làm gì
### `home_reference_male_v4.png`
Reference chính cho layout male:
- header chuẩn,
- bell + key + logout,
- hero xanh,
- grid 6 ô,
- footer quote + decor.

### `home_reference_female_v4.png`
Reference chính cho layout female:
- giữ cấu trúc như male,
- đổi palette và hero nữ,
- dùng để code theme nữ.

### `home_reference_support_banner_v4.png`
Reference cho state đặc biệt:
- có banner `Hôm nay có ca bổ trợ` chèn giữa hero và grid.

## 6) Theme
### Male theme
- primary: `#2F79F6`
- surface: xanh pastel / trắng lạnh
- hero card: xanh dương gradient

### Female theme
- primary: `#E96AA8`
- surface: hồng tím pastel / trắng hồng
- hero card: hồng tím gradient

## 7) Gợi ý component tree
- `StudentHomePage`
  - `HomeBackdrop`
  - `HomeHeader`
  - `HeroCard`
  - `SupportBanner` (optional)
  - `FeatureGrid`
    - `FeatureCard` x6
  - `FooterMotivation`

## 8) Lưu ý cho Claude
- Ưu tiên code bám đúng bố cục trong ảnh reference.
- Có thể dùng `position: absolute` cho backdrop và một số doodle/decor nhỏ, nhưng phần layout chính nên là flex/grid.
- Theme nam/nữ nên đi bằng prop hoặc variant, không copy 2 màn riêng biệt.
- Bell badge là element code riêng, không hard-code dính chết vào ảnh.
- Banner bổ trợ là component độc lập, có thể bật/tắt bằng data.

