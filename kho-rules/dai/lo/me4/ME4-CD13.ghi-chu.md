# ME4 · CĐ13 — Bài toán về tuổi

Nguồn: PDF `Sách lớp 4 ME.pdf`. Đề: PDF 77–78 (in tr.79–80), bài tập vận dụng B1–B15 (Lý thuyết + 2 ví dụ ở PDF 76–77 không tạo câu). Hướng dẫn: PDF 200–206 (in tr.196–202).

## (a) Số bài / số câu
- 15 bài tập trong đề, không bài nào có nhiều ý a, b. Tệp đề 15 bản ghi. Soạn: 15 câu. Lô dựng được: 15 câu.
- Lưu ý đáp số: B9 có ba số (em út, anh cả, cha); B12 hỏi tuổi cách đây 3 năm (không phải hiện nay); B8 hỏi tuổi vào lúc mẹ gấp 6 lần con (không phải hiện nay).

## (b) HOÃN
- Không có. Không bài nào có hình trong đề; mọi bài đọc được cả đề lẫn hướng dẫn.

## (c) Sách có vẻ in sai / đề lệch đáp án
- Không thấy sai ở đáp số. 15/15 đáp số sách khớp máy tự tính từ đề.
- Sách viết B2 hướng dẫn "2 lần tuổi cha bằng 7 lần tuổi con hay 14/7 tuổi cha bằng 14/2 tuổi con" (đúng, giữ nguyên). B6 và B14 dùng "hiệu giữa 2 lần (3 lần) tuổi mẹ và tổng tuổi các con không đổi" (đúng; mẹ và tổng tuổi các con không có hiệu cố định, nên phải nhân tuổi mẹ lên; Phần 1 nói rõ).
- Hướng dẫn B5 dùng "tuổi cha bằng 7/6 và 3/2 hiệu số tuổi" (phân số của hiệu); giữ đúng như sách, Phần 2 thêm sơ đồ hai thời điểm cho dễ hiểu (không đổi phép tính).

## (d) `thieu_so_do`
- 0. Cả 15 câu đều có `so_do_mo_ta`, `veSoDo` chấp nhận hết (B4, B5, B12, B13 là mảng hai sơ đồ hai thời điểm xếp chồng).
- Sơ đồ B7, B9, B11 có đoạn thêm (`them`), B15 dùng `them_gt` = tuổi em để vẽ đoạn "tuổi em" mà nhãn không lộ số.

## (e) Không có hàm kiểm máy
- Không có. 15/15 câu có hàm kiểm trong `me4-kiem-cd13.mjs` (vét cạn / thay ngược từ đề).

## (f) Kết quả chạy kiểm
- Dựng lô: `✔ 15 câu · máy sửa định dạng 0 · người soát sửa 0 · bỏ 0`.
- Máy kiểm đáp số lên lô: 15/15 `dat`, 0 `khong_dat`, 0 `khong_kiem_duoc`.
- Dạng (`ME4-CD13.dang.json`): 15 câu; `cao`: B1, B2, B4, B5, B6, B9, B12, B14; còn lại `vua` (B3, B7, B8, B10, B11, B13, B15). Không có câu nào `—`. Dạng tuổi mới NDB03503–03506 + NDB01625.
- `ghi_chu_nghi`: 0.
