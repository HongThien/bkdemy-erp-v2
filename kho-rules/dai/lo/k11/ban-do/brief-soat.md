# Brief trạm SOÁT — lý thuyết + ví dụ bản đồ mới khối 11 (14/10)

> Trạm soát chạy Opus (khác trạm soạn Sonnet). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11` · `<LUOT>` = B1…B6 · Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.

Bạn soát nội dung lý thuyết + ví dụ mà trạm soạn đã viết cho một số dạng bài của bản đồ kiến thức mới khối 11 (Toán; Lượng giác, Dãy số – CSC – CSN). Nội dung sẽ hiện cho giáo viên và học sinh, in vào giáo trình.
KHÔNG ghi DB, KHÔNG sửa tệp nào trong Repo. Bạn sửa thẳng vào `<LV>\ra\<LUOT>.txt` và ghi biên bản `<LV>\ra\<LUOT>.soat.md`.

## 1. Đọc
1. `Repo\kho-rules\dai\lo\k11\ban-do\brief-soan.md` (khuôn, luật, phạm vi) và `Repo\kho-rules\dai\k11.md` §3–§4.
2. Với mỗi dạng của lượt: hồ sơ `<LV>\<mã dạng>.md` (mô tả của CEO = đích) và `<LV>\nhom-<mã nhóm>.md`.
3. Tệp soạn `<LV>\ra\<LUOT>.txt`. TRƯỚC khi sửa lần đầu, chép nguyên bản sang `<LV>\ra\<LUOT>.goc.txt`.

## 2. Soát từng dạng
- **Đúng dạng:** lý thuyết và 2 ví dụ đúng loại bài mô tả của CEO nói (không lạc sang dạng anh em); ví dụ 2 khó hơn ví dụ 1; không chép lại ví dụ đã có trong lý thuyết dạng / nhóm.
- **Đúng toán — kiểm bằng máy, không đọc lướt:** viết script node (hoặc python) trong `<LV>\tam\soat-<LUOT>\`: thay đáp số vào đề, kiểm TỪNG dòng biến đổi (≥ 3 giá trị của biến), quét lưới tìm nghiệm sót / sai miền
  (PTLG: họ nghiệm so với nghiệm quét số trên đoạn đề), kiểm min–max bằng quét số, dãy số / CSC / CSN tính trực tiếp số hạng. Lý thuyết: từng công thức, điều kiện xác định, dấu, họ nghiệm, chu kỳ phải đúng.
- **Đúng phạm vi:** KHÔNG đạo hàm / giới hạn / công thức chưa học; ví dụ chỉ dựa kiến thức tới bài của dạng + lớp ≤ 10. Công thức ngoài SGK 11 (vd $\tan 3x$, nhân ba) chỉ được dùng nếu lời giải TỰ SUY ra từ công thức cộng / nhân đôi ngay trong bài — nếu không, sửa hoặc thay ví dụ.
- **Đủ dữ kiện bằng chữ:** đề không được tham chiếu hình / đồ thị không có — nếu có thì viết lại cho tự đủ.
- **Trình bày:** lời giải như HS viết vào vở — điều kiện, mỗi phép biến đổi một dòng, kết luận bằng lời; họ nghiệm đủ $k\in\mathbb{Z}$; `##PP` 3–6 bước trọn ý, không "Bước N"; `##CY` là bẫy thật.
- **Khuôn:** chạy máy kiểm (từ Repo) tới lỗi 0:
  `node kho-rules/dai/lo/k11/ban-do/kiem.mjs "C:/Users/WBPC/bk-kho-lam-viec/bdm/k11/ra/<LUOT>.txt" <danh sách mã dạng>`

Sửa thẳng lỗi bạn **chắc chắn**. Chỗ không chắc (mô tả mơ hồ, hai cách hiểu) ⇒ để nguyên và ghi vào "Cần CEO xem". Mục `## GHI CHÚ CHO CEO` cuối tệp: giữ, bổ sung, xoá điểm bạn đã giải quyết.

## 3. Biên bản `<LV>\ra\<LUOT>.soat.md`
- Dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`.
- Số dạng · số ví dụ đã kiểm bằng máy · số chỗ đã sửa.
- Bảng `| Dạng | Phần (lý thuyết / ví dụ 1 / ví dụ 2) | Loại lỗi (toán / lạc dạng / phạm vi / trình bày / khuôn) | Sửa gì |`.
- Mục `## Cần CEO xem` (mỗi điểm: mã dạng + một câu).

## 4. Trả lời cuối (≤ 150 từ)
Kết luận · số chỗ sửa theo loại lỗi · các điểm cần CEO xem.
