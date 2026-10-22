# Brief — viết lại nội dung các dạng của "Các loại hàm số" cho MỖI HÀM CHỈ FOCUS VÀO HÀM ĐÓ (22/10, lần 2)

Thùy phản hồi bản v3: *"Chỗ tâm đối xứng hàm bậc 3 sao lại có cả lý thuyết ví dụ của các hàm khác… 'Hàm nhất biến hoặc bậc ba đơn điệu trên một khoảng' sao lại có kiểu cấu trúc dạng như này. **Hàm số nào thì mọi thứ chỉ focus vào hàm số đó thôi.** Ví dụ đang lung tung lẫn lộn giữa các hàm. Check lại. … Các bài toán liên quan đến m nhét chung vào 1 dạng — Tìm tham số để hàm số thỏa mãn điều kiện."*

## Luật cứng
1. Nhóm `P2.1` = **chỉ hàm bậc ba** · `P2.2` = **chỉ hàm bậc nhất trên bậc nhất** · `P2.3` = **chỉ hàm bậc hai trên bậc nhất**. Trong lý thuyết dạng và MỌI ví dụ của một dạng thuộc nhóm hàm nào thì **chỉ xuất hiện hàm đó** — không nhắc, không so sánh, không lấy ví dụ của hàm khác (kể cả câu "tương tự hàm phân thức…" trong ##TC/##CY).
2. Dạng "Tìm tham số để hàm số … thoả mãn điều kiện" (mã `M2.x.1`) **gom mọi bài toán chứa tham số của hàm đó** vào MỘT dạng: lý thuyết nêu các điều kiện thường gặp (đơn điệu trên ℝ / trên khoảng / trên từng khoảng xác định, cực trị, đạt cực trị tại điểm cho trước, hệ thức hai điểm cực trị, vị trí hai điểm cực trị, tiệm cận…) mỗi điều kiện một ý ngắn; **ví dụ 4–5 bài** phủ các loại điều kiện khác nhau, ĐÚNG hàm của nhóm.
3. Ví dụ không thuộc hàm của nhóm ⇒ **bỏ** và **viết ví dụ mới đúng hàm** (tự tính, kiểm lại kết quả bằng `node` trước khi ghi). Ví dụ đúng hàm của nhóm thì giữ (có thể chỉnh lại câu chữ), kể cả khối hình `[[HINH {...}]]`.
4. Không dạy "khảo sát và vẽ đồ thị" như một quy trình; không có "hàm trùng phương".
5. Đọc đơn điệu / cực trị từ đồ thị KHÔNG là dạng của phần này.

## Việc phải làm (đọc `kho-rules/dai/lo/k12-hs/cau-truc.mjs` — nhóm P2.1/P2.2/P2.3 — để lấy đúng **tên + mô tả** từng dạng)
- Với mỗi mã dạng `H…` được giao: tìm khối `=== <mã>` trong `ra/J*.txt` (grep), đọc lý thuyết + ví dụ cũ. Giữ phần đúng hàm; sửa/viết lại phần lẫn hàm; đảm bảo khớp **mô tả mới** trong `cau-truc.mjs` (tên dạng đã đổi, ví dụ: H5.4.3 nay chỉ là "Điểm uốn và tâm đối xứng của đồ thị hàm bậc ba").
- Với dạng gom `M2.x.1`: nguồn ví dụ/lý thuyết nằm ở các dạng v1 được gom (xem `GOM_VAO` trong `cau-truc.mjs`: M2.1.1 ← H1.5.1, H2.4.1–2.4.4 · M2.2.1 ← H1.5.2, H1.5.3, H4.4.2 · M2.3.1 ← H1.5.4, H2.4.6, H4.4.2); chỉ lấy phần ĐÚNG hàm của nhóm, bổ sung ví dụ mới cho đủ 4–5 bài.
- Khuôn tệp, độ dài, định dạng: như `brief-soan.md` (cùng thư mục; bỏ qua phần về đường dẫn máy khác) + mẫu `mau.txt` + `spec-format-noidung.md`. Mỗi dạng: `@ly_thuyet:` (##TC, ##PP 3–6 bước mỗi dòng một bước, ##CY) rồi `@vi_du:` (##VD đề ⏎⏎ `Bài giải:` ⏎ lời giải liền dòng… `Vậy …`). Không `$$`, dùng `\dfrac`, `\cdot`. Hình (nếu ví dụ cần): một dòng `[[HINH {json}]]` theo `ve.mjs`; ví dụ mới nên ưu tiên loại KHÔNG cần hình.
- Ghi tệp bằng công cụ Write (không heredoc). Ra đúng một tệp theo lượt: `ra/J11.txt` (P2.1) · `ra/J12.txt` (P2.2) · `ra/J13.txt` (P2.3). Chỉ chứa các khối DẠNG (không có khối nhóm).
- Kiểm: `node kho-rules/dai/lo/k12-hs/kiem.mjs kho-rules/dai/lo/k12-hs/ra/<J1x>.txt <danh sách mã dạng>` phải **lỗi 0** (bỏ qua "No character metrics"). Chạy từ thư mục repo `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2`.
- KHÔNG ghi DB; KHÔNG sửa tệp nào khác ngoài tệp ra của lượt và thư mục nháp `kho-rules/dai/lo/k12-hs/tam/<J1x>/`.
- Trả lời cuối ≤ 120 từ: mỗi dạng giữ/viết lại/viết mới mấy ví dụ; chỗ nào còn nghi lẫn hàm; lỗi 0 chưa.

## Giao việc
- **J11 — P2.1 Hàm bậc ba:** `H5.2.1, H5.3.1, H5.3.4, H5.4.3, H5.4.2, H2.5.1, H2.5.2, H2.5.3, M2.1.1`
- **J12 — P2.2 Hàm bậc nhất trên bậc nhất:** `H5.2.2, H5.3.2, H4.5.1, M2.2.1`
- **J13 — P2.3 Hàm bậc hai trên bậc nhất:** `H5.2.3, H5.3.3, M2.3.1`
Các dạng nhận diện (`H5.2.x`) và hệ số (`H5.3.x`) có hình trong ví dụ cũ — nếu ví dụ cũ đúng hàm thì GIỮ NGUYÊN khối (kể cả hình).
