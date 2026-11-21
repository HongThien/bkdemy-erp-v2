# ME4 · CĐ15 Bài toán công việc chung — ghi chú trạm

## (a) Số bài / số câu
- Đề: 13 bài tập (B1–B13; B11 có 2 ý a, b). Bản ghi đề: 15 (13 bài + 2 ý).
- Soạn: 14 câu = B1–B10, B12, B13 (12 câu) + B11a + B11b (hai ý độc lập: ý b dùng số 216 thùng và thời gian 8 giờ, 12 giờ có sẵn trong đề, không dùng kết quả ý a). Lô dựng sạch: 14 câu.
- Nguồn: đề PDF 89–96 (trang in 86–91; PDF của sách trộn thứ tự trang và nhân đôi một số trang, tôi dò theo số trang in; trang cuối của đề, PDF 96, là ảnh quét nghiêng nhưng chữ và số đọc chắc); hướng dẫn PDF 212–219 (trang in 208–215).

## (b) HOÃN
Không. Mọi bài đều đọc được cả đề lẫn đáp án, đề không có hình.

## (c) Sách in sai / đề lệch đáp án · bài đã quy sang số phần
- Không thấy sách in sai: cả 14 đáp số sách đều khớp máy tự tính từ đề. B13 trong ảnh đề ghi "13." thiếu chữ "Bài" (chỉ là in thiếu nhãn); tôi coi là Bài 13 (khớp hướng dẫn Bài 13).
- **Sách CĐ15 chỉ giải bằng "Cách 1" (đơn vị là 1, chia cho phân số) ở cả 13 bài hướng dẫn; ví dụ mở đầu mới có "Cách 2" (số phần).** Theo luật Thùy, TOÀN BỘ các câu đã được viết lại bằng SỐ PHẦN BẰNG NHAU, không đổi đáp số, không chia cho phân số. Danh sách các bài đã quy sang số phần (sách chỉ có cách phân số):
  - B1 (6 phần) · B2 (12 phần, mốc 12 giờ vì thời gian làm chung là 12/5 giờ) · B3 (60 phần) · B4 (80 phần) · B5 (336 phần) · B6 (60 phần) · B7 (600 phần) · B8 (60 phần) · B9 (15 phần) · B10 (12 phần) · B11a (24 phần) · B12 (24 phần, đổi 1 tuần = 45 giờ bằng "cứ 5 giờ làm 3 phần") · B13 (36 phần).
  - B11b: sách đã dùng số thùng (216 : 12 = 18, …), không phân số, giữ nguyên phép tính.
- Các lựa chọn số phần là số nhỏ nhất chia hết cho các thời gian đề cho (B5 cần thêm điều kiện để phần còn lại chia hết, ghi trong lời giải). Phép tính cuối nào không chia hết thì giữ phân số của GIỜ như sách ($\dfrac{6}{5}$, $\dfrac{25}{9}$, $\dfrac{12}{5}$ và $\dfrac{15}{2}$ giờ ở B9: sách ghi giờ phân số, không đổi sang số thập phân).
- B6 (trích đề thi): đã bỏ cụm "(Đề thi tuyển sinh vào THCS Amsterdam – 2013)" khỏi nội dung đề; trong soạn không còn tên trường.
- Quy ước hiểu đề (theo cách sách đọc): B5 "tổ 1 làm một mình 60 giờ rồi nghỉ, tổ 2 làm nốt 32 giờ" = hai tổ cùng làm 32 giờ và tổ 1 làm riêng 60 − 32 = 28 giờ; B6 tương tự (hai máy cùng 4 giờ, máy II riêng 9 − 4 = 5 giờ); B13 tương tự (cùng 4 giờ, người thứ nhất riêng 7 − 4 = 3 giờ); B11b hiểu "tổng cộng 216 thùng" là cả công việc.

## (d) thieu_so_do
Không bài nào được đánh dấu `thieu_so_do`. CĐ15 không có sơ đồ đoạn thẳng trong sách và dạng "số phần của công việc" không thuộc nhóm bài có tỉ số / tổng hiệu phải vẽ sơ đồ (§Khối 4T); cả 14 câu `so_do_mo_ta: null`, lời giải không nhắc sơ đồ.

## (e) Không có hàm kiểm máy
Không. Cả 14 câu đều có hàm kiểm: thử thời gian ứng viên (số nguyên hoặc phân số nhỏ), công việc coi là 1, mỗi người làm 1/T mỗi đơn vị thời gian, so bằng phân số chính xác. Cách kiểm này độc lập với cách "số phần" trong lời giải.

## Dạng đã chọn mức `vua` (đáng để trưởng khối nhìn)
- B3, B4, B5, B6: giai đoạn (một người làm trước hoặc nghỉ) + biết thời gian làm chung, hỏi thời gian riêng: chọn NDB03511, gần NDB03510.
- B10: hai vòi cùng chảy vào bể: NDB03508 (tên "hai người làm chung").
- B11b, B13: NDB03510 nhưng dữ kiện là số thùng / một nửa công việc; B12: ba người, mỗi người làm số công việc khác nhau, tính theo tuần rồi đổi giờ: NDB03512, gần NDB03508.
- Ghi chú dạng: bản đồ hiện chưa có dạng "đổi tuần ra giờ" và "chia số thùng theo năng suất"; đề xuất giữ như trên cho tới khi trưởng khối quyết.

## (f) Kết quả chạy
- Dựng lô: `✔ 14 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm đáp số: 14 câu, 14 `dat`, 0 `khong_dat`, 0 `khong_kiem_duoc`.
- Lint trình bày (ký hiệu cấm, 3–6 bước, Mấu chốt, dòng cuối Vậy / Đáp số, lộ đáp số; không dùng "ước", "bội" trong lời giải): sạch.
- `ghi_chu_nghi`: 0.
