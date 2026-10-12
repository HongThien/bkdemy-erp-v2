KẾT LUẬN: ĐẠT

# GKI-05 — Biên bản soát (trạm soát, 10/10)

Đề: Khảo sát chất lượng giữa học kì 1 Toán 8, năm học 2024 – 2025 — Phòng GD&ĐT huyện Xuân Trường (2 trang, có lớp chữ, in rõ).

- Số câu: **18** (8 trắc nghiệm · 2 Đúng/Sai nhập tự luận · 8 câu tự luận sau khi tách Bài 1 → 1.1 / 1.2a / 1.2b và Bài 5 → 5a / 5b).
- Khớp đáp án Pha 1 (giải mù, `GKI-05.kiem.md`) ngay từ đầu: **18 / 18**. Máy kiểm lại: `<LV>\tam\soat_kiem.mjs` (thay số hai vế; Bài 4 dựng toạ độ 2 bộ).
- Số câu phải sửa: **5** (không câu nào sai đề, không câu nào sai đáp số). Bản trước khi sửa: `GKI-05.soan.goc.md`.
- Chép đề: so từng câu với ảnh trang (phóng 300 dpi Câu 3, Câu 10, Bài 1) — đúng, đủ 15 câu gốc, đủ phương án và các ý.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (3 phần · 18 câu · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 3 | định dạng (dòng Chưa chắc thừa) | Xoá dòng `Chưa chắc`; thêm vào Mấu chốt ý "không chỉ riêng các hằng đẳng thức đáng nhớ" | Đã kiểm chắc: A là phương án duy nhất đúng với mọi $a$, $b$ (máy thay số: B, C, D sai). SGK KNTT định nghĩa hằng đẳng thức là đẳng thức đúng với mọi giá trị của các chữ và lấy đúng kiểu ví dụ $a(a+2)=a^2+2a$ ⇒ A đúng định nghĩa. C sai dấu là phương án nhiễu, không phải lỗi in |
| Câu 9 | lập luận (Phần 1 lộ kết luận) | Bước 2 và Bước 4 bỏ câu "nên ý a đúng" / "nên ý b sai", thay bằng việc cần đối chiếu để kết luận | Phần 1 không được ghi đáp số cuối; kết luận Đúng / Sai nằm ở Phần 2 |
| Bài 4 | hình | Vẽ lại `giai_bai4.png`: thêm $NP$ nét đứt (đường phụ của ý c), thêm gạch $MB=MC$ (giả thiết trung tuyến), hạ thang để chừa lề dưới nhãn $K$ | Lời giải ý c dựa vào $NP$ mà hình không có; giả thiết $M$ là trung điểm của $BC$ chưa được đánh dấu. Không vẽ $AQ$, $AK$ (điều phải chứng minh, theo đề mẫu) |
| Bài 5a | định dạng + kiến thức (cách gọi) | Xoá dòng `Chưa chắc`, chuyển phần cần biết vào `Ghi chú`; "ba phân thức" → "ba phân số"; Bước 2 nói rõ đẳng thức chưa học nên tự chứng minh | Đáp số $\dfrac{1}{9}$ khớp Pha 1 và máy; lời giải tự chứng minh đẳng thức bằng phép nhân đa thức (đúng luật "cần mà chưa học thì tự chứng minh"), không dùng phân tích nhân tử. "Phân thức" là tên chương sau |
| Bài 5b | kiến thức + ghi chú | Viết lại bước đưa $S$ về $200-2(x-10)^2$ theo chiều khai triển $2(x-10)^2$ thay cho "đặt $-2$ làm thừa số chung"; `Ghi chú` bỏ câu "hình do máy cắt lại…", thêm "đề không cho kích thước khu đất" | Cả đề không có câu nào về phân tích nhân tử ⇒ không dùng đặt nhân tử chung (theo cách đề mẫu GKI-01 Câu 13). Ghi chú kiểu "máy cắt…" không dành cho người duyệt |

Ngoài ra sửa hai dòng ở mục `GHI CHÚ CHO NGƯỜI DUYỆT` cho khớp (không còn câu `Chưa chắc`).

## Đã soát, không sửa

- Luật kiến thức: không có đường trung bình, Thalès, đồng dạng, Pythagore, lượng giác — kể cả dùng ngầm. Bài 4b đi bằng hai tam giác vuông bằng nhau (cạnh huyền – góc nhọn, góc đồng vị do $MN\parallel AB$), không cần "trung tuyến ứng với cạnh huyền"; Bài 4c đi bằng hai hình bình hành $QNPA$, $ANPK$ rồi tiên đề Euclid — đã kiểm toạ độ ($Q+P=N+A$, $A+P=N+K$). Bài 4a dùng tổng bốn góc $360^\circ$ rồi "bốn góc vuông", không dùng "ba góc vuông" như một dấu hiệu.
- Bài 4: Phần 1 đi theo chiều phân tích đi lên (6 bước), Phần 2 đi ngược lại, khớp từng mắt xích.
- Phân loại: `kho` đúng (Câu 7, 8, 9, Bài 4 = `hinh_hoc`; còn lại `dai`, kể cả Bài 5b bối cảnh mảnh đất). Trả lời ngắn: Bài 1.1 ($-22$), Bài 5b ($200$) — đúng dạng đề hỏi, vừa 4 ô. Bài 2 ($-\dfrac{7}{6}$), Bài 5a ($\dfrac{1}{9}$) là phân số ⇒ tự luận. Tách ý đúng luật; bài hình không tách.
- Hình: `p2c5_lai.png` (Bài 5b) đúng hình của câu, không cụt; `giai_cau9.png` đúng dữ kiện (bốn nửa đường chéo bằng nhau, không đánh dấu góc vuông).

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào.

Điều người duyệt nên biết (đã nằm trong `Ghi chú` của câu): Bài 5a đề không ghi $x+y+z\neq 0$ (ngầm hiểu vì $A$ có mẫu $(x+y+z)^3$); Bài 5b đề không cho kích thước khu đất.
