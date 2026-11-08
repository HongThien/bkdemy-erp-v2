# Brief trạm SOÁT (Opus) — nội dung bản đồ K12 mới từ đề thi (03/11)

Bạn độc lập với trạm soạn (Sonnet). Đọc `kho-rules/dai/lo/k12-hs/brief-soat.md` (cách soát + khuôn biên bản) và `kho-rules/dai/lo/k12-de/de-xuat/brief-soan-moi.md` (đọc cả phần BỔ SUNG) rồi áp dụng với các thay đổi:
- Cây = `de-xuat/<CH>.json` (mô tả dạng = ĐÍCH). Tệp soạn = `de-xuat/noi-dung/<CH>-<JOB>.txt` (chép nguyên bản sang `<CH>-<JOB>.goc.txt` TRƯỚC khi sửa); biên bản = `<CH>-<JOB>.soat.md` (dòng đầu `KẾT LUẬN: ĐẠT|CHƯA ĐẠT`; bảng chỗ đã sửa; mục "Cần CEO xem").
- Máy kiểm: `node kho-rules/dai/lo/k12-de/de-xuat/kiem-moi.mjs <CH> <tệp> <mã giao>` tới lỗi 0 (bỏ qua dòng "No character metrics").
- **Đối chiếu ĐỀ THI thật:** `node S\cau-dang.cjs <CH> <id_dạng> 8` (bảng ánh xạ `de-xuat/<CH>-cau.tsv`; vài dạng ghép từ nhiều mã cũ nên câu ánh xạ có thể lẫn). Ví dụ cùng loại và mức với câu đề thật? Lý thuyết bao phủ cách giải đề hay hỏi? **Không có ý nào đề không hỏi** (Thùy: "không đề nào hỏi thì lấy ở đâu ra") — ý thừa thì xoá.
- **Đối chiếu SÁCH (bắt buộc, trạm soạn thường bỏ qua):** sách đã trích chữ ở `S\sach\` (xem `ls`; `S\txt\` hầu như rỗng) + hồ sơ `kho-rules/dai/lo/k12-hs/ho-so/` (chỉ Hàm số); thiếu thì trích từ `G:\Other computers\My Computer\BK ACADEMY\Tài liệu tham khảo\K12\` (NBV NEW FULL · TOAN TU TAM · PNL 2026) bằng `node scripts/docx-doc.mjs "<file>" --out S\sach\<tên>.md` (đừng giải nén rar vào Repo). Công thức / điều kiện / quy ước khớp SGK chưa; kiểu bài sách có & đề hay hỏi mà thiếu thì bổ sung. Ghi vào biên bản đã đối chiếu những file nào.
- **TỰ GIẢI LẠI từng ví dụ** bằng script node viết riêng (độc lập script trạm soạn; script soát đặt ở `S\soat\<CH>-<JOB>\`); mọi hình `[[HINH …]]` phải khớp đề + lời giải (đọc giá trị từ hình bằng công thức vẽ hình). Kiểm: đúng dạng (không lạc dạng anh em) · ví dụ 2 khó hơn ví dụ 1 · lý thuyết nhóm vs dạng không lặp · khung ##PP 3–6 bước · số liệu không tạo ca suy biến/biên ngoài ý · phạm vi Toán 12.
- Sửa thẳng lỗi chắc chắn; chỗ không chắc (mô tả mơ hồ, hai cách hiểu, sách khác nhau) ghi "Cần CEO xem". Cuối tệp soạn giữ `## GHI CHÚ CHO CEO` (cập nhật, xoá điểm đã giải quyết).
- Ranh giới VT/PP toạ độ (Thùy chốt): VT chỉ thao tác quanh vectơ; bài cần phương trình mặt phẳng/đường thẳng/mặt cầu thuộc PP toạ độ.

## Trả lời cuối (≤150 từ)
Kết luận · số chỗ sửa theo loại lỗi · số ví dụ/hình đã tự giải lại · các điểm cần CEO xem.

## LUẬT ĐỒ THỊ — TỈ LỆ 1:1 (Thùy 03/11)
Đồ thị hàm số phải có ĐƠN VỊ HAI TRỤC BẰNG NHAU (máy vẽ `ve.mjs` đã ép như vậy; khung hình tự co theo khoảng x, y). Chọn khoảng x, y cân đối (vd cực trị y=±20 mà x chỉ ±3 thì hình thành dải mỏng và máy báo lỗi "tỉ lệ 1:1 quá nhỏ" — thu hẹp khoảng hiển thị). Chỉ khi hai trục là hai đại lượng KHÁC ĐƠN VỊ (quãng đường–thời gian, chi phí–số lượng, nồng độ–thời gian) mới ghi `"tyle":"tudo"` trong JSON hình. Khi soát hình: dựng lại ảnh SAU thay đổi này và nhìn tỉ lệ, đối chiếu giá trị đọc từ hình.
