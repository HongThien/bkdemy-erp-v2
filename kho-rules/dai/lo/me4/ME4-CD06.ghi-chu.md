# ME4 · CĐ6 — Tìm hai số biết tổng và hiệu của hai số đó

Nguồn: `Sách lớp 4 ME.pdf`. Đề: PDF 30–32 (in tr.32–34, phần B "Bài tập vận dụng"). Hướng dẫn: PDF 133–139 (in tr.129–135). Trang quét sạch, đọc được hết, không có trang rách.

## (a) Số bài / số câu
- Bài tập thấy trong đề: **16** (Bài 1–16).
- Bản ghi đề `ME4-CD06.bai.json`: 25 (16 bài + 9 bản ghi ý: B6 a b, B9 a b, B12 a–e).
- Câu đưa vào soạn / lô: **21** = 13 bài đơn (B1–5, 7, 8, 10, 11, 13–16) + B6a, B6b + B9 (1 câu gộp a, b) + B12a–e.
  - B6: ý a và ý b độc lập về phép tính (ý b không dùng kết quả ý a) nên tách 2 câu.
  - B9: ý b dùng kết quả ý a (Huy có 15 viên) nên giữ 1 câu chung, `gop_y: true`.
  - B12: 5 ý độc lập, 5 câu.

## (b) HOÃN
Không có. Cả 16 bài đều có đáp số rõ trong sách; không bài nào có hình trong ĐỀ (sách không in sơ đồ cho phần B của CĐ6).

## (c) Chỗ sách có vẻ in sai / đề–đáp án lệch / cần người xem
- **B6b** (câu có `ghi_chu_nghi`): đề viết "Học kì 1, Huy hơn Hoàng 6 quyển. Sau đó Huy mua thêm 5, Hoàng mua thêm 9 …", ý b hỏi "sau kì 1 Huy viết hết ít hơn Hoàng 5 quyển thì bạn nào còn nhiều vở hơn". Đáp án sách: Huy nhiều hơn Hoàng **11** quyển, tính từ hiệu LÚC ĐẦU (6) cộng 5, bỏ qua việc mua thêm 5 và 9 ở đề. Nếu hiểu "sau kì 1" là sau khi đã mua thì Huy 18, Hoàng 16, Huy hơn 2 + 5 = 7 quyển. Đã giữ nguyên đáp án và lập luận của sách (11). Máy không phân xử được hai cách hiểu nên câu này không có hàm kiểm.
- Không phát hiện chỗ đề–đáp án lệch khác. Mọi đáp số khác máy tự tính từ đề đều khớp sách.
- Lưu ý khác: B13 sách chỉ nói "có tất cả 16 số chẵn liên tiếp tạo 15 khoảng cách" mà không giải thích vì sao; ở Phần 2 giữ nguyên ý sách, thêm một câu "tổng là số lẻ nên hai số gồm một số lẻ và một số chẵn" (có sẵn ở dòng đầu của lời giải sách). Máy xét cả hai trường hợp (số bé chẵn hay lẻ) đều ra duy nhất cặp 996 và 1027.

## (d) `thieu_so_do`
Không câu nào. Mọi câu tổng–hiệu đều có `so_do_mo_ta` (máy `veSoDo` chấp nhận hết, đúng tỉ lệ, nhãn tổng khớp). Bài B3 và B9 mô tả bằng MẢNG 2 sơ đồ (hai dòng "Ta có sơ đồ:"). Sách không in sơ đồ cho CĐ6 phần B; sơ đồ là phần thêm theo luật khối 4T (bài tổng–hiệu phải có sơ đồ), không đổi phép tính của sách.

## (e) Không có hàm kiểm máy
- `CĐ6 · B6b` (đề có hai cách hiểu, xem mục c).
- Còn lại 20/21 câu có hàm kiểm trong `me4-kiem-cd06.mjs` (vét cạn / thay ngược từ đề).

## (f) Kết quả chạy kiểm (lần cuối)
- Dựng lô: `✔ 21 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm lên lô: **20 `dat`**, **0 `khong_dat`**, **1 `khong_kiem_duoc`** (CĐ6 · B6b).
- `ghi_chu_nghi`: 1 (B6b). `thieu_so_do`: 0.
- Dạng (`ME4-CD06.dang.json`): NDB01626 (cho nhận) cho B7, B8, B9, B11 · NDB01627 (tăng giảm đại lượng) cho B1, B2, B4, B6a, B6b, B10 · NDB01541 cho B3, B14 · NDB03503 cho B5 · NDB01624 cho B12a–e, B13 · NDB03471 cho B15, B16. Mức `vua` ở B1, B2, B3, B6a, B6b, B10, B12e, B14 (xem lý do từng câu trong tệp dạng); không có dạng riêng cho "hiệu ẩn qua câu thêm/bớt để bằng nhau" và cho "tổng từ trung bình cộng".
