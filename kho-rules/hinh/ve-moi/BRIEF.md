# Brief — trạm VẼ HÌNH MỚI cho kho Hình–Học (đề thiếu hình)

Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2` (chạy lệnh từ đây). Việc của bạn: với MỖI mục trong `viec.md` của gói được giao, vẽ **một hình đề** bằng code → PNG.
Luật gốc: `spec-giai-bai.md` §A8 (nguồn hình) và Phần B › Hình › "Vẽ hình" (đọc mục "Vẽ hình" + "Kích thước" + "Sai lầm cần tránh (Hình)" trước khi vẽ). Tóm tắt những điều bắt buộc:

## 1. Hình gì
- Một hình = **hình ĐỀ**: chỉ giả thiết. Bài nhiều ý (`BÀI NHIỀU Ý`): hình gắn vào BÀI ⇒ vẽ **đủ mọi điểm / đoạn / đường mà đề và CÂU HỎI CÁC Ý nêu là dữ kiện dựng** (vd "trên tia đối của AB lấy F, AF = CE" ở ý d thì F nằm trong hình). Nhưng vẫn KHÔNG vẽ điều phải chứng minh / đáp án (xem §3).
- Tên tệp ra = đúng tiêu đề mục `## <tên>.png` (có thể `HHB000444+HHB000900.png` — một tệp gắn cho nhiều bài, giữ nguyên tên).
- Đề có chữ "theo hình …" (mô tả hình bằng lời): dựng đúng mô tả đó. Đề thiếu dữ kiện / mâu thuẫn / không thể dựng ⇒ **KHÔNG vẽ**, ghi lý do trong báo cáo (thà bỏ trống còn hơn vẽ sai). Câu thật sự không có gì để vẽ (chỉ tính số, lý thuyết) ⇒ ghi "KHÔNG CẦN HÌNH: <lý do>".

## 2. Dựng đúng bằng toạ độ
- Thư viện: `scripts/anh/ve_hinh_lib.mjs` (đọc phần xuất `export`): `P seg tick angleMark rightAngle dot label mid foot inter rot ray doiXung reflect bisector lerp dist goc segDash lineExt circle arc poly num bien angleText sideText labelOut hinh xuatTat`. Mẫu: `scripts/anh/ve_hinh_k7_thang_hang.mjs` (5 hình có kiểm dữ kiện) và `scripts/anh/ve_hinh_hh00103055.mjs`.
- **Dựng bằng toạ độ theo ràng buộc của đề** (trung điểm `mid`, chân vuông góc `foot`, giao `inter`, phân giác `bisector`, đối xứng `doiXung`…), KHÔNG ước mắt. Trong script, mỗi dữ kiện của đề có một dòng kiểm bằng số (`ok('AB = AC', …)`); sai ⇒ dừng.
- **Hình tổng quát, không "đặc biệt thêm"**: tam giác thường vẽ LỆCH hẳn (không cân / gần cân / đều nếu đề không nói), tam giác vuông không vuông cân; "AB < AC" vẽ lệch rõ. Điểm "bất kỳ" đặt chỗ không trùng điểm đặc biệt.
- **Vuông tại A ⇒ A góc dưới trái, AB THẲNG ĐỨNG (B phía trên A), AC NẰM NGANG (C bên phải A).**
- Bài có số đo ẩn (`x`, `y`) ⇒ giải ra giá trị thật rồi dựng đúng; ghi `x` / `y` trên hình, KHÔNG ghi đáp số.
- Vị trí tương đối điểm đề không ghi ("tia nằm giữa", "D khác phía A") ⇒ lấy theo lời giải trong `viec.md` (lời giải cho biết hình thật).

## 3. KHÔNG vẽ sẵn đáp án / điều phải chứng minh
- Không ghi số đo cần tìm; không gạch cặp cạnh / đánh dấu cặp góc / ô vuông / ký hiệu song song mà đề **bắt chứng minh**; không nối liền ba điểm phải chứng minh thẳng hàng (hai đoạn chung đỉnh đủ); không vẽ đường phụ của lời giải; không đánh dấu trung điểm nếu đó là điều cần chứng minh.
- **Đánh dấu giả thiết** đề cho: trung điểm, đoạn bằng nhau, góc bằng nhau, góc vuông, số đo, phân giác. Gạch bằng nhau tối đa 3 gạch (nhóm 4+ dùng `tick(…, 4)` = ×). Hai góc kề cùng đánh dấu ⇒ hai bán kính khác nhau. Không đặt gạch trên đoạn CON gây hiểu nhầm.

## 4. Kích thước, kiểu
- Nét đen `#222`, nền trắng, không màu; tên điểm chữ nghiêng (`label`), số đo chữ đứng. Điểm có tên có chấm. Canvas cao ≤ 450 px, rộng ≤ 560 px (thu toạ độ nếu vượt, đừng giảm cỡ chữ); chừa ≥ 35 px dưới nhãn đáy.
- Nhiều hình con trong một đề ("Hình 1, Hình 2") ⇒ MỘT ảnh, xếp ngang, nhãn dưới mỗi hình con.

## 5. Cách làm (theo thứ tự)
1. Đọc `viec.md` của gói; đọc `spec-giai-bai.md` mục Vẽ hình.
2. Viết MỘT script `scripts/anh/ve_moi/<TÊN-GÓI>.mjs` (tạo thư mục nếu chưa có; tên chứa tên gói) gồm mọi hình của gói; chạy: `node scripts/anh/ve_moi/<TÊN-GÓI>.mjs "<gói>/moi"` → `<gói>/moi/<tên>.png|.svg`. **Ghi script SỚM** (đừng đợi vẽ hết). Ghi file bằng công cụ Write (LaTeX/ký tự đặc biệt không qua heredoc).
3. **Mở TỪNG ảnh PNG** (Read) kiểm: nhãn cắt đáy / đè nét / đè nhau, thiếu ký hiệu giả thiết, vẽ sẵn đáp án, khung quá rộng. Sửa tới khi sạch.
4. Báo cáo cuối (≤ 200 từ): mỗi hình MỘT dòng: `<tên>: đạt` | `không vẽ — <lý do>` | `KHÔNG CẦN HÌNH — <lý do>`; kèm chỗ nghi đề / lời giải sai nếu có; số phép kiểm đã chạy.

## 6. Cấm
Không ghi DB, không git, không sửa `ve_hinh_lib.mjs`, không sửa đề / lời giải, không đụng tệp ngoài `scripts/anh/ve_moi/<TÊN-GÓI>.mjs` và thư mục `<gói>/moi/`. Không báo "đã verify" khi chưa chạy script và chưa mở ảnh.
