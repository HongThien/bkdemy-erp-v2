# ME4 · CĐ11 — Bài toán về tỉ số, tổng tỉ, hiệu tỉ

Nguồn: PDF `Sách lớp 4 ME.pdf`. Đề: PDF 67–70 (in tr.69–72), bài tập vận dụng B1–B20. Hướng dẫn: PDF 187–194 (in tr.183–190). Phần Lý thuyết + Ví dụ (PDF 64–67) không tạo câu.

## (a) Số bài / số câu
- 20 bài tập trong đề. Bài 4 có 2 ý a, b, ý b dùng kết quả ý a (tổng số học sinh) nên gộp một câu (`gop_y: true`, mã `CĐ11 · B4`). Bài 3 hỏi hai tỉ số nhưng không đánh ý a, b nên một câu.
- Tệp đề có 22 bản ghi (20 bài + B4a + B4b). Soạn: 20 câu. Lô dựng được: 20 câu.

## (b) HOÃN
- Không có. Không bài nào có hình trong đề; mọi bài đọc được cả đề lẫn hướng dẫn.

## (c) Sách có vẻ in sai / đề lệch đáp án
- Không thấy sai ở đáp số. Các đáp số sách đều khớp máy tự tính từ đề.
- Lưu ý nhỏ (không sửa): đề B2 cho thêm điều kiện về số thứ hai ($\frac12$ số thứ hai) nhưng hướng dẫn chỉ dùng số thứ nhất và số thứ ba. Giữ đúng như sách.
- Đề B19 kết bằng dấu hỏi lần hai ("… 120 000 đồng?") theo nguyên văn sách.
- Hướng dẫn B14 viết "mệnh giá đó chỉ có thể là 5000 đồng" không nêu lí do; Phần 1 (Chú ý) bổ sung lí do 75000 không chia hết cho 50000 và 20000 (không đổi phép tính, không đổi đáp số).

## (d) `thieu_so_do`
- 0. Cả 20 câu đều có `so_do_mo_ta` (máy `veSoDo` chấp nhận hết).
- Ghi chú về cách vẽ: sách chỉ có sơ đồ ở Ví dụ, phần hướng dẫn B1–B20 viết bằng chữ. Sơ đồ ở đây dựng từ chính số phần trong lời giải sách (B1–B3 chỉ tỉ số nên `gia_tri_phan` = 1 và không ghi nhãn tổng). B4–B7 sách giải bằng phân số của cả (số), sơ đồ quy cùng mẫu cho thấy các phần (B4: 21 phần mỗi phần 2 em; B5: 6 phần mỗi phần 12 m; B6: 3 phần + 7 phần mỗi phần 14; B7: ba sơ đồ xếp chồng một tổ với ba tổ còn lại). Nhãn tổng dùng dấu "?" khi tổng là điều cần tìm.

## (e) Không có hàm kiểm máy
- Không có. 20/20 câu có hàm kiểm trong `me4-kiem-cd11.mjs` (vét cạn / thay ngược từ đề).

## (f) Kết quả chạy kiểm
- Dựng lô: `✔ 20 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm đáp số lên lô: 20/20 `dat`, 0 `khong_dat`, 0 `khong_kiem_duoc`.
- Dạng (`ME4-CD11.dang.json`): 20 câu; `cao`: B1, B2, B4, B5, B7, B8; còn lại `vua`. Không có câu nào `—`.
- `ghi_chu_nghi`: 0.
