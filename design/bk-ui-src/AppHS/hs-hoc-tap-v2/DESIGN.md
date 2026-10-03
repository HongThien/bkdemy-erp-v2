# hs-hoc-tap-v2

## 1. Đơn đặt hàng
App hs, màn hoc-tap, cổng vào các chế độ học, iPad ngang 1672×941. Reference v2 kế thừa tỉ lệ demo thứ hai và chỉnh đảo Chinh phục BK thành tháp hắc ám 6 tầng, đỉnh có sấm sét. Chibi game tròn mập, anime 2D vẽ tay, nhìn chéo 3/4 từ trên. Vũ trụ xanh tím sâu, sao dày, ngân hà chéo, tinh vân mềm và hành tinh xa; không mây dày che sao, không chữ/UI trong ảnh.
**Số chế độ lấy từ dữ liệu:** hiện 5, có thể thêm thứ 6, 7 về sau. **Mỗi đảo + công trình + hiệu ứng gắn đảo = một PNG alpha duy nhất. Nền chỉ có vũ trụ. Liên kết không thuộc nền hoặc ảnh đảo.**
Bản toàn cảnh cuối đã được người dùng duyệt. Bộ hoàn thiện giữ reference này và sinh riêng 5 sprite đảo trọn kiến trúc, 2 nền vũ trụ; đường nối và chữ do code.

## 2. Font & bảng màu theo biến thể
Default; tên và chú thích dùng Baloo 2 do code dựng. Nền #080E37–#211047; ánh đường nối vàng #FFD86A và xanh ngọc #75F1FF; chữ #FFF4D8, phụ #C9D6F5. Hắc ám ở riêng đảo tháp: đá #24213D, năng lượng #6E35B8, sét #9DD6FF.

## 3. Bảng kiểm kê
Vị trí gợi ý theo demo 5 chế độ; không gắn cứng chủ đề vào slot khi số lượng thay đổi. Tâm là tâm toàn đảo nhìn thấy, gồm kiến trúc và khối đá, không phải tâm riêng mặt đất.

| id | Phần tử | Vị trí & cỡ | Loại | Động? | File asset / cách dựng |
|---|---|---|---|---|---|
| 01 | Vũ trụ ngang | Phủ 100% khung, sau tất cả | BACKDROP | không | assets/backdrop/troi_sao_hoc_tap.png, 1672×941; chỉ vũ trụ, không đảo/đường nối |
| 02 | Vũ trụ dọc | Phủ 100% khung điện thoại | BACKDROP | không | assets/backdrop/troi_sao_hoc_tap_doc.png, 941×1672; sinh riêng, không crop nền ngang |
| 03 | Đảo học theo chủ đề + quả cầu/rừng | Tâm ≈(51%,45%), rộng ≈33%; lớn nhất, giữa hơi cao | DECOR | bob/chọn | assets/decor/dao_hoc_chu_de.png; một sprite gồm đảo, rừng, quả cầu, rễ/thác/đá vụn/hào quang |
| 04 | Đảo luyện yếu + lò rèn/đe/búa/kiếm | Tâm ≈(23%,73%), rộng ≈22%; trái dưới | DECOR | bob/chọn | assets/decor/dao_luyen_yeu.png; một sprite trọn đảo và công trình |
| 05 | Đảo đấu trường + colosseum/cờ | Tâm ≈(17%,35%), rộng ≈22%; trái trên | DECOR | bob/chọn | assets/decor/dao_dau_truong.png; một sprite trọn đảo và công trình |
| 06 | Đảo chinh phục + tháp hắc ám/sét | Tâm ≈(85%,33%), rộng ≈15%; phải trên, tránh vùng tiêu đề 12% | DECOR | bob/chọn | assets/decor/dao_chinh_phuc.png; một sprite gồm đảo, tháp nhiều tầng, năng lượng và sét đỉnh |
| 07 | Đảo vô địch + bục/cúp/pháo hoa | Tâm ≈(78%,72%), rộng ≈22%; phải dưới | DECOR | bob/chọn | assets/decor/dao_giai_vo_dich.png; một sprite trọn đảo và công trình |
| 08 | Liên kết ánh sáng | Từ mép đảo trung tâm tới mép đảo vệ tinh; sau đảo; nét mảnh | SHAPE | theo layout/bob | Code vẽ đường cong Bézier với stroke gradient vàng/xanh ngọc và glow; không PNG cố định, không vẽ vào backdrop |
| 09 | Tên + chú thích | Ngay dưới mỗi đảo, vùng trống cao ≈8% khung; theo vị trí đảo | TEXT | dữ liệu | Code Baloo 2; không chữ trong sprite |
| 10 | Sáng khi chạm | Halo theo alpha sprite, đè sau/ngoài đảo | SHAPE | chạm/chọn | Code glow; đảo và kiến trúc chuyển động cùng nhau |

## 4. Trạng thái & hành vi
- Tạo danh sách chế độ từ dữ liệu, không kiểm tra hoặc giới hạn cố định đúng 5. Chế độ học theo chủ đề giữ vai trò đảo trung tâm; các chế độ còn lại là vệ tinh.
- **5 đảo:** dùng bố cục demo. **6–7 đảo:** tính lại slot trên cung/ellipse quanh đảo trung tâm, giãn đều khoảng cách, giảm vừa phải cỡ vệ tinh để giữ vùng nhãn. Không chỉ thêm đảo đè vào khoảng trống của layout 5. Mỗi chế độ mới thêm một sprite đảo+công trình và nhãn dữ liệu, không sửa nền.
- Khổ dọc: đảo trung tâm ở trên + 2 hàng đôi cho 4 vệ tinh; thêm vệ tinh thì thêm hàng đôi và cho vùng nội dung cuộn khi cần, không ép tất cả nhỏ đến mức khó chạm. Đây là gợi ý bố cục; chưa có reference dọc.
- Mỗi sprite đảo trọn khối nhấp nhô nhẹ, pha lệch nhau. Rễ, thác, kiến trúc, hào quang và sét đã vẽ cùng ảnh đi theo đảo; không làm kiến trúc đứng yên trong khi mặt đảo di chuyển.
- **Đường nối:** code tính điểm neo theo mép mặt đảo và hướng tới đảo kia; ánh sáng kết thúc dưới mép đảo để giấu mối nối. Mỗi frame/animation cập nhật đầu đường theo vị trí thực của đảo sau bob/scale. Điều chỉnh điểm điều khiển Bézier để né đảo khác và vùng nhãn. Có một đường cho mỗi vệ tinh; không tồn tại đường khi không có đảo đích.
- Khi đổi số đảo/kích thước màn, tính lại bố cục và toàn bộ điểm nối; không dùng tọa độ cầu cố định hoặc ảnh nền có sẵn cầu. Khi chạm, sáng nhẹ theo alpha ảnh; tên/chú thích không bị raster hóa.
- Top ≈12% không đặt đảo/đỉnh/sét; dưới mỗi đảo giữ ≈8% khung cho tên/chú thích. Năng lượng hắc ám và sét giới hạn ở đỉnh tháp, không che sao toàn màn.

## 5. Thứ tự lớp (từ dưới lên)
Vũ trụ → đường nối ánh sáng do code → glow tương tác → các sprite đảo+kết cấu theo độ sâu → tên/chú thích → thanh tiêu đề.
Không có đế đảo tách khỏi kiến trúc trong bộ này. Không có đường nối baked vào nền hoặc sprite. Sprite chừa lề alpha đủ cho rễ, đá vụn, hào quang và sét.

## 6. Danh sách file trong kit
File hiện có: `reference/reference_hoc_tap.png` (reference đã duyệt, 1671×941; khung dựng mục tiêu 1672×941).
Bộ gồm 2 backdrop chỉ vũ trụ và 5 sprite đảo trọn kiến trúc có alpha, cạnh dài ≥1024px; tên file đúng mục 3. Sinh mỗi asset riêng bằng ImageGen theo reference được duyệt, không crop/xóa màu từ reference. Liên kết và chữ do code, không có asset đường nối cố định. 

| File | Kích thước thật | Định dạng / kiểm tra |
|---|---|---|
| assets/backdrop/troi_sao_hoc_tap.png | 1672×941 | RGB, ảnh thường |
| assets/backdrop/troi_sao_hoc_tap_doc.png | 941×1672 | RGB, ảnh thường |
| assets/decor/dao_chinh_phuc.png | 1254×1254 | RGBA, alpha thật; góc trống, kiến trúc và hiệu ứng cùng sprite |
| assets/decor/dao_dau_truong.png | 1254×1254 | RGBA, alpha thật; góc trống, kiến trúc và hiệu ứng cùng sprite |
| assets/decor/dao_giai_vo_dich.png | 1254×1254 | RGBA, alpha thật; góc trống, kiến trúc và hiệu ứng cùng sprite |
| assets/decor/dao_hoc_chu_de.png | 1254×1254 | RGBA, alpha thật; góc trống, kiến trúc và hiệu ứng cùng sprite |
| assets/decor/dao_luyen_yeu.png | 1254×1254 | RGBA, alpha thật; góc trống, kiến trúc và hiệu ứng cùng sprite |
| reference/reference_hoc_tap.png | 1671×941 | RGB, ảnh thường |

Tất cả ảnh đảo được sinh riêng bằng **ImageGen tích hợp** theo prompt: đúng chủ đề/kiến trúc trong reference, một đảo trọn khối, nền alpha, cùng chibi 2D và góc nhìn, không vũ trụ/đường nối/chữ. Nền ngang bỏ đảo và liên kết; nền dọc sinh riêng cùng bảng màu. Phần trắng của đá, cờ, kiếm và tia sét được giữ nguyên, không xóa màu.

Khi scale, tính bề rộng theo alpha-bounds phần ảnh rõ (bỏ qua nhiễu alpha cực thấp); giữ nguyên khung PNG và lề cho hiệu ứng, không dùng object-fit cover hoặc cắt sprite. Tháp cao dùng bề rộng khoảng 15% khung ngang để giữ vùng tiêu đề; tinh chỉnh tâm nếu hiệu ứng sét lấn mép trên. Reference được duyệt rộng 1671px, chênh 1px so với khung 1672px; bố cục dùng phần trăm, backdrop ngang đúng 1672×941.


