# ME4 · CĐ4 Kỹ thuật thực hiện phép tính — ghi chú trạm

## (a) Số bài / số câu
- Đề: 12 bài tập (B1 a–e · B2 a–e · B3 a–g · B4 a–f · B5 a–h · B6 · B7 a–d · B8 a–b · B9 · B10 a–b · B11 · B12). Bản ghi đề: 51 (12 bài + 39 ý).
- Soạn: 43 câu. Mọi ý của bài "Tính / Tìm x / So sánh / Tính theo điều kiện" là ý độc lập nên tách mỗi ý một câu; B6, B9, B11, B12 là một câu.
- Bài "Tìm x" (B5 a–h, B7 a–d): đề có chữ x nên dùng ẩn x, viết theo cột (`array`), mỗi ý một câu, Phần 1 nêu quy tắc tìm thành phần chưa biết. B7 dùng $\overline{xx}$ = 11 lần x theo cấu tạo số.
- Nguồn: đề PDF 18–22 (trang in 20–24); hướng dẫn PDF 120–127 (trang in 116–122).

## (b) HOÃN
Không. Đủ đề và đáp án, không hình trong đề.

## (c) Sách in sai / đề lệch đáp án
Không thấy lỗi số liệu. Máy tự tính khớp mọi đáp số. Hai chỗ trình bày của sách phải chuẩn hoá:
- B12: sách dùng dấu mũi tên "→ Loại" ở nhiều dòng; đã viết thành "nên loại trường hợp này" (luật Đ3). Lập luận và đáp số giữ nguyên.
- B1c: sách bỏ ngoặc "1024 − 1024 + 15" mà không nêu quy tắc; Phần 1 đã thêm lời nhắc quy tắc bỏ ngoặc có dấu trừ đứng trước.

## Dạng đề xuất mới
- 6 câu `dang = —`: B1a, B1b, B1c, B1d, B1e (tính thuận tiện bằng phép CỘNG, TRỪ: ghép số tròn, a−b−c = a−(b+c), a−(a−b)…) và B11 (tìm số tự nhiên để biểu thức chứa phép chia nhỏ nhất). Bản đồ 4T chỉ có "tính thuận tiện phân phối phép nhân" (NDB01519) nên không khớp cộng, trừ. Đề xuất dạng mới "Tính thuận tiện: tính chất giao hoán, kết hợp phép cộng, trừ" (5 câu làm chứng B1a–e, dạng gần nhất NDB01519, không gộp được vì không có tích chung thừa số).
- 11 câu NDB01519 mức `vua` (B2a, B2c, B3a, B3b, B3e, B3f, B3g, B4c, B4d, B4e, B4f): phải tách/ghép thừa số mới có thừa số chung, hoặc chỉ có phép nhân thuần ghép 4×25, 8×125… (dạng gần nhất). Có thể cần dạng riêng "Tính thuận tiện: nhân các số ghép tròn".
- B5f: NDB03462 mức `vua` (phân phối của phép chia, cũng có thể xếp NDB03461).

## (d) thieu_so_do
Không bài nào cần sơ đồ đoạn thẳng. 0 câu có `so_do_mo_ta`.

## (e) Không có hàm kiểm máy
Không. Cả 43 câu có hàm kiểm: bài tính gõ lại biểu thức đề; Tìm x quét x tự nhiên rồi thay ngược vào đề; B6, B9, B10, B12 vét cạn mọi bộ chữ số thoả điều kiện (hiệu / tổng không đổi); B8 vét cạn mọi cặp chữ số a, b từ 1 đến 9; B11 quét y từ 0 đến 2022.

## Ghi chú nhỏ
- B5d: lint nghi "Phần 1 chứa đáp số" vì số 25 xuất hiện trong chính biểu thức đề (x − 25); đáp số tình cờ là x = 25 và Phần 1 không nêu "x = 25". Đã rà tay, không lộ đáp số.
- B11: sách bỏ qua điều kiện số chia dương; hàm kiểm quét y < 2023 (để 2023 − y > 0) và cho y = 0.

## (f) Kết quả chạy
- Dựng lô: `✔ 43 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm đáp số: 43 câu, 43 `dat`, 0 `khong_dat`, 0 `khong_kiem_duoc`.
- Lint trình bày: sạch (chỉ có cảnh báo mềm B5d nêu trên).
- `ghi_chu_nghi`: 0.
