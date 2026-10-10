KẾT LUẬN: ĐẠT

# Biên bản soát GKI-40 — Phòng GD&ĐT Sơn Động, giữa học kì 1 Toán 8, năm học 2024 – 2025

- **Số câu:** 27 (20 trắc nghiệm · 3 trả lời ngắn · 4 tự luận) — đủ 20 câu + 4 bài của đề, không sót, không thừa.
- **Khớp đáp án Pha 1 ngay từ đầu:** 27/27 (bảng giải mù `GKI-40.kiem.md`, viết trước khi mở bản soạn). Không có đáp số nào phải sửa.
- **Số câu phải sửa:** 8/27 (không câu nào sai đáp số; sửa lập luận / kiến thức / định dạng / hình) + 1 chỗ ở đầu tệp (`bo_sach`).
- **Đề không in đáp án / hướng dẫn chấm** (trang 3 chỉ có Bài 3.2, Bài 4, dòng "Hết") ⇒ chỉ có hai nguồn: trạm soạn và trạm soát.
- **Về việc trạm soạn bị ngắt giữa chừng:** bản soạn thực tế đã đủ — có `tam/kiem.mjs` (trạm soát chạy lại: "TẤT CẢ ĐẠT", gồm cả dựng toạ độ Bài 3.2), có `**Hình giải:**` cho Bài 3.2, có mục `## GHI CHÚ CHO NGƯỜI DUYỆT`. Trạm soát chạy thêm script độc lập `tam/soat_kiem.mjs` (đạt), vẽ lại hình giải, bổ sung mục ghi chú.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ "✔ đạt cổng" sau khi sửa.
- **Bản gốc trước khi sửa:** `GKI-40.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đầu tệp | phân loại | `bo_sach: Cánh Diều` → `CTST` | Cả hai đều là đoán (đề không ghi). Câu 6 và Bài 3.1 giống bài tập sách Chân trời sáng tạo (nhận theo trí nhớ, chưa mở sách đối chiếu) nên CTST có căn cứ hơn. Không ảnh hưởng lời giải — xem mục "Điều người duyệt cần biết" |
| Câu 3 | định dạng | Phương án `C. -3`, `D. -27` → `$-3$`, `$-27$` | Số âm phải nằm trong công thức để hiện đúng dấu trừ |
| Câu 6 | hình | `**Hình:** p1c6_1.png` → `p1c6_lai.png` (cắt lại từ PDF, 150 dpi) | Bản cắt tự động dính mép dưới của dòng chữ đề phía trên hình |
| Câu 8 | định dạng | Phần 1, Bước 1: bỏ chỗ viết "$a-2=a-2$", viết lại thành "có dạng $A^2+AB+B^2$, còn thừa số $a-2$ ứng với $A-B$" | Đẳng thức "$a-2=a-2$" vô nghĩa, làm rối bước nghĩ |
| Câu 13 | lập luận | Phần 2: viết lại phản ví dụ — lấy hình bình hành có $\widehat{A}=60^\circ$, nêu rõ nó là hình thang, tính đủ bốn góc, kết luận hai góc kề mỗi đáy không bằng nhau | Bản gốc viết "hình bình hành $ABCD$ … có $\widehat{A}\ne 90^\circ$" như thể mọi hình bình hành đều thế (hình chữ nhật thì không); phải nói rõ là CHỌN một hình cụ thể, và xét cả đáy $CD$ |
| Bài 2.2 | kiến thức | Mấu chốt: "phương trình chỉ còn là một phép tìm $x$ bậc nhất" → "đẳng thức chỉ còn là bài tìm $x$ quen thuộc của lớp 7" | Giữa kì 1 chưa học "phương trình" (k8.md §1.2, §10) — không dùng từ này |
| Bài 3.1 | lập luận | Phần 2: thêm dòng "Đường nằm ngang qua $B$ cách mặt đất $1{,}2$ m nên điểm $C$ cách mặt đất $1{,}2$ m" trước phép cộng | Bước cộng $32+1{,}2$ chưa có lí do |
| Bài 3.2 | hình | Vẽ lại `giai_bai3_2.png` (sửa `tam/ve.mjs`): $A(175;30)$, $B(90;190)$, $C(330;190)$ ⇒ góc $A\approx 72^\circ$, $B\approx 62^\circ$, $C\approx 46^\circ$; vẽ thêm hai đường thẳng $x$, $y$ kéo dài qua $E$ và ghi tên | Hình cũ có góc $A\approx 88^\circ$ nên $ABEC$ nhìn như hình chữ nhật (đề cho tam giác nhọn), và không có hai đường thẳng $x$, $y$ của đề. Script tự kiểm: $AB<AC$, ba góc nhọn, $BE\parallel AC$, $CE\parallel AB$. Vẫn không vẽ $AE$ (thẳng hàng là điều phải chứng minh) |
| Bài 4 | kiến thức | Phần 2: thêm hai dòng trung gian $(x^2-4xy+4y^2)-(4x-8y)+4+\dots$ và $(x-2y)^2-2 \cdot (x-2y) \cdot 2+2^2+\dots$ trước khi ra $(x-2y-2)^2$; Phần 1 Bước 1–2 viết lại theo đúng mạch đó; thêm `**Chú ý:**` về luỹ thừa bậc chẵn của số âm | Bản gốc nhảy thẳng từ sáu hạng tử sang $(x-2y-2)^2$ — ngầm dùng công thức bình phương của tổng ba số hạng, không có trong bảy hằng đẳng thức của sách. Đã thay số kiểm hai dòng mới bằng máy |
| Ghi chú cuối tệp | — | Cập nhật dòng thử lại bằng máy, dòng bộ sách; thêm dòng về hình Câu 6, hình giải Bài 3.2, cách tách bình phương Bài 4 | Cho khớp với các chỗ sửa trên |

## Đã soát mà không sửa (ghi để người duyệt khỏi soát lại)

- **Đề:** 27 câu chép đúng ảnh (đối chiếu ảnh trang + bản cắt 300 dpi + lớp chữ của PDF): số, số mũ, dấu, phương án, tên điểm.
- **Phân loại:** `kho` đúng (Câu 6 là tính đa thức nên `dai`; Câu 14, 16, 20, Bài 3.1 Pythagore nên `hinh_hoc`). Bài 2 là vỏ gom ba bài toán khác nhau đánh số 1) 2) 3) ⇒ tách `Bài 2.1 / 2.2 / 2.3` đúng luật; Bài 1 (ý b dùng ý a) và Bài 3.2 (hình) giữ chung. `tra_loi_ngan`: Bài 2.2 (`2`), Bài 3.1 (`33,2` — 4 ô, đơn vị mét như hình), Bài 4 (`2`); Bài 2.1 đáp số $10000$ năm chữ số ⇒ `tu_luan` đúng.
- **Kiến thức:** đề có Pythagore, hằng đẳng thức, phân tích nhân tử, hình thang cân, hình bình hành ⇒ các lời giải dùng đúng phạm vi đó. Không có đường trung bình, Thalès, đồng dạng, hình chữ nhật trở lên (kể cả dùng ngầm). Câu 12 dùng đường trung trực (lớp 7) — hợp lệ.
- **Bài 3.2:** Phần 1 đi đúng chiều phân tích đi lên, Phần 2 đi ngược lại, khớp từng mắt xích (định nghĩa hình bình hành → hai đường chéo cắt nhau tại trung điểm → $M$ trùng giao điểm → thẳng hàng).
- **Hình:** `p2b3_1.png` (Bài 3.1) đúng hình con diều, đủ ba số đo 40 m, 24 m, 1,2 m. Tệp `p1c20_1.png` (máy gán nhầm cho Câu 20) không được dùng — Câu 20 không có hình, đúng.

## Câu còn `Chưa chắc`

Không có.

## Điều người duyệt cần biết

- `bo_sach: CTST` là **đoán**, không phải dữ kiện của đề: căn cứ là hai bài giống bài tập sách Chân trời sáng tạo (trạm soát nhận theo trí nhớ, chưa mở sách). Nếu trường dùng Cánh Diều thì chỉ đổi nhãn, lời giải không đổi.
- Bài 3.2: giả thiết "nhọn" và "$AB<AC$" của đề không dùng tới trong chứng minh (bản soạn đã nói ở `**Chú ý:**`).
