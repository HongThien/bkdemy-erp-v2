# ME4 · CĐ8 — Cấu tạo số

Nguồn: `Sách lớp 4 ME.pdf`. Đề: PDF 39–42 (in tr.43–44, phần B "Bài tập áp dụng"; Bài 1 nằm cuối tr.43, Bài 2–15 ở tr.44). Hướng dẫn: PDF 146–152 (in tr.144–150). Trang quét sạch, đọc được hết, không có trang rách.

## (a) Số bài / số câu
- Bài tập thấy trong đề: **15** (Bài 1–15). Không bài nào có ý a, b nên mỗi bài là 1 bản ghi đề.
- Bản ghi đề `ME4-CD08.bai.json`: 15.
- Câu đưa vào soạn / lô: **15**, không câu `gop_y`.

## (b) HOÃN
Không có. Cả 15 bài đều có đáp số rõ trong sách, không bài nào có hình trong ĐỀ.

## (c) Chỗ sách có vẻ in sai / đề–đáp án lệch / cần người xem
- **B5** (câu có `ghi_chu_nghi`): "Tìm một số tự nhiên bằng 9 lần chữ số hàng đơn vị của nó". Số 0 cũng thoả (0 = 9 × 0); sách chỉ nêu 45. Lời giải ở Phần 2 ghi rõ "ta tìm số khác 0" và giữ đáp án sách (45). Máy chỉ xét số từ 1 trở lên.
- Không có chỗ đề–đáp án lệch khác. Mọi đáp số máy tự tính từ đề (vét cạn trên mọi số, không dùng ẩn chữ số) đều khớp sách, và đều là nghiệm DUY NHẤT trong phạm vi vét (B15 có đúng 2 cặp như sách).
- Sách dùng "→" và dấu "↪" trong lời giải; đã đổi sang chữ ("suy ra", "nên", "do đó") theo luật Thùy 21/11. Dòng "Thử lại: …" của sách được giữ ở cuối Phần 2 (Phần 1 không có đoạn thử lại).
- Phần 2 đúng lời giải sách dùng ẩn chữ số $\overline{abc}$ (được phép); B1 dùng $\overline{A3}$ với $A$ là số có thể nhiều chữ số (sách nêu rõ). Có thêm vài dòng nối ý rất ngắn mà không đổi phép tính / đáp số: B1 thêm các dòng "$A\times 9+3=1794$", "$A\times 9=1794-3$" thay cho bước gộp một dòng của sách; B5 thêm câu "số có một chữ số bằng 9 lần chính nó chỉ khi bằng 0".

## (d) `thieu_so_do`
Không câu nào (CĐ8 không có bài tổng–hiệu / số phần).

## (e) Không có hàm kiểm máy
Không. Cả 15 câu đều có hàm vét cạn trong `me4-kiem-cd08.mjs`.

## (f) Kết quả chạy kiểm (lần cuối)
- Dựng lô: `✔ 15 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm lên lô: **15 `dat`**, **0 `khong_dat`**, **0 `khong_kiem_duoc`**.
- `ghi_chu_nghi`: 1 (B5). `thieu_so_do`: 0.
- Dạng (`ME4-CD08.dang.json`): NDB03479 cho B1 · NDB01540 cho B2, B3 (cao) và B8 (`vua`: viết thêm hai chữ số vào bên phải) · NDB03478 cho B4 · NDB03481 cho B5 · NDB03482 cho B6, B7 · NDB03480 cho B9 · NDB03483 cho B10 · NDB03484 cho B11, B12 · NDB03485 cho B13, B15 (cao) và B14 (`vua`).
