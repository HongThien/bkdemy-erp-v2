# ME4 · CĐ5 Mối quan hệ giữa các thành phần phép tính — ghi chú trạm

## (a) Số bài / số câu
- Đề: 20 bài tập (B10, B11, B12, B15 có ý a, b / a–c). Bản ghi đề: 29 (20 bài + 9 ý).
- Soạn: 25 câu = 16 bài một câu + B10a, B10b, B11a, B11b, B11c, B12a, B12b, B15a, B15b (các ý đều độc lập, mỗi ý tự đủ dữ kiện nên tách mỗi ý một câu).
- Nguồn: đề PDF 25–27 (trang in 27–29); hướng dẫn PDF 127–133 (trang in 123–129). Phần lý thuyết và 2 ví dụ (PDF 23–25) không tạo câu.
- Nhiều bài làm sai khi tính / đặt phép tính (B4, B6, B8, B16–B20): chép đúng số liệu, không đổi phép tính, kết quả máy tự tính khớp sách.

## (b) HOÃN
Không. Đủ đề và đáp án, không hình trong đề.

## (c) Sách in sai / đề lệch đáp án
Không thấy lỗi số liệu; máy tự tính khớp mọi đáp số.
- B3: sách minh hoạ bằng sơ đồ vòng (mũi tên −95, −56, +95, +56); theo BRIEF §4 hình trong lời giải không chép, đã viết bằng chữ + phép tính, `so_do_mo_ta = null`.
- B17: sách nhảy từ "thừa số bị đảo là 9619" sang "thừa số đúng là 1996" không giải thích; Phần 2 thêm một dòng nói rõ cách đổi chỗ lại hai cặp chữ số (không đổi phép tính, không đổi đáp số).

## Dạng đề xuất mới
- 5 câu `dang = —`: B2, B3 (cùng thêm / bớt ở số bị trừ, số trừ rồi hỏi hiệu — NDB01521 ghi rõ chỉ xét phép cộng); B8 (đặt tính trừ sai cột: số trừ gấp 100 lần); B10a, B10b (thương cho bằng phân số của số lớn, tìm hai số). Đề xuất dạng mới "Thay đổi số bị trừ, số trừ trong phép trừ" (B2, B3, dạng gần nhất NDB01521) và "Quan hệ giữa thương, số lớn, số bé" (B10a, B10b, dạng gần nhất NDB03469).
- Mức `vua`: B7, B9 NDB01540 (viết thêm chữ số vào bên phải SỐ TRỪ, đề thuộc phép trừ chứ không phải số cần tìm) · B11c NDB03468 (dư lẻ lớn nhất, thương kém dư 2) · B15a, B15b NDB03463 (thêm / bớt ở một thừa số rồi so tích).

## (d) thieu_so_do
Không bài nào. Hai bài có sơ đồ máy: B9 (số trừ 1 phần, số trừ mới 10 phần + 5, hiệu hai hàng 1490) và B14 (số chia 1 phần, số bị chia 6 phần + 51, tổng 912), đúng tỉ lệ và máy `veSoDo` chấp nhận.

## (e) Không có hàm kiểm máy
Không. Cả 25 câu có hàm kiểm, đều vét cạn theo đề: các thành phần phép tính thay ngược, chữ số của thừa số quét 1000–9999 (B17), a từ 1 đến 9 (B20), số dư lớn nhất theo "d − 1" (B11b, B13)…

## (f) Kết quả chạy
- Dựng lô: `✔ 25 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm đáp số: 25 câu, 25 `dat`, 0 `khong_dat`, 0 `khong_kiem_duoc`.
- Lint trình bày: sạch.
- `ghi_chu_nghi`: 0.
