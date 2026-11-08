# Brief trạm SOÁT — chương Vectơ K12 (22/10)

Bối cảnh + luật + khuôn: `brief-soan.md` (cùng thư mục) — đọc trước. Bạn là người soát ĐỘC LẬP một tệp `ra/J<N>.txt` do trạm soạn viết (tệp của bạn nêu ở cuối prompt). Sửa TRỰC TIẾP trong tệp.

## Với MỖI nhóm và dạng trong tệp
1. **Đúng kiểu dạng:** lý thuyết dạng + cả hai ví dụ phải đúng ĐÚNG bài toán ghi ở "mô tả nhận biết" trong `cau-truc.mjs` — không lẫn kiểu của dạng khác (vd dạng "Tổng và hiệu vectơ trong hình hộp" mà ví dụ trên lăng trụ/chóp ⇒ viết lại). Hai ví dụ phải khác hẳn nhau; ví dụ 2 khó hơn ví dụ 1 một bậc, không vượt khung độ khó của dạng.
2. **Đúng toán — giải LẠI độc lập từng ví dụ** (chạy `node`): với hình khối, đặt toạ độ cụ thể cho các đỉnh rồi tính lại tích vô hướng, góc, độ dài, đồng phẳng, tâm tỉ cự, cực trị… so với đáp số. Bắt lỗi: điều kiện bị bỏ sót, nhầm dấu/góc (góc giữa hai vectơ khác điểm đầu), công thức tích có hướng, đơn vị của lực/công. Sai ⇒ sửa lời giải hoặc thay ví dụ.
3. **Đề tự đủ dữ kiện:** KHÔNG "như hình vẽ"; mọi dữ kiện hình khối nói bằng lời; không `[[HINH]]`.
4. **Lý thuyết:** đúng công thức, đúng chương trình Toán 12 CT 2018; không mặt phẳng/đường thẳng/mặt cầu/góc nhị diện; ##PP 3–6 bước; lý thuyết nhóm không lặp lý thuyết dạng. Các nhóm P1.3, P3.5, P3.6 nguồn thiếu lý thuyết ⇒ soát kỹ tính đúng của phần soạn mới.
5. **Khuôn:** `node kho-rules/dai/lo/k12-vt/kiem.mjs <tệp> <mã,…>` lỗi 0 (ngăn bằng dấu phẩy; bỏ qua "No character metrics").

## Ra
Ghi biên bản `ra/J<N>.soat.md` (≤ 30 dòng): mỗi dạng một dòng "đã sửa gì / sạch"; mục "Cần Thùy xem" nếu có. KHÔNG ghi DB; KHÔNG sửa tệp nào khác ngoài tệp được giao và biên bản. Trả lời cuối ≤ 100 từ.
