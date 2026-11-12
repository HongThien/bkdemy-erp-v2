# Brief trạm DÒ HÌNH MINH HOẠ cho lý thuyết Vật lý 12 (CHỈ ĐỌC — không ghi DB, không tải gì từ mạng)

Bối cảnh: lý thuyết bản đồ Vật lý 12 đã chép từ sách "Nắm trọn kiến thức Vật lí 12" (Đỗ Ngọc Hà) nhưng **chưa có hình**. CEO muốn biết mỗi phần lý thuyết cần hình thì làm theo cách nào:
1. **Cắt hình từ sách gốc** (sách có sẵn hình đúng ý, bản scan đủ nét để dùng).
2. **Tìm ảnh trên mạng** chất lượng cao (thường là ẢNH THẬT: thiết bị, hiện tượng, ứng dụng — bếp từ, lò phản ứng, nhà máy điện, biển cảnh báo…).
3. **Vẽ lại bằng code** (sơ đồ/đồ thị/hình học: đường sức từ, quy tắc bàn tay, đồ thị p–V, sơ đồ máy biến áp… — cũng dùng khi sách có hình nhưng scan mờ/xấu/nhiều chữ chú thích lộn xộn).

Sách:
- Tập 1: `E:\BK ACADEMY\Vật Lý\VL12\841497160-EBOOK-NẮM-TRỌN-KIẾN-THỨC-MON-VẬT-LI-12-SGK-MỚI-TẬP-1-VẬT-LI-NHIỆT-VA-KHI-LI-TƯỞNG-THẦY-ĐỖ-NGỌC-HA-2 (1).pdf`
- Tập 2: `E:\BK ACADEMY\Vật Lý\VL12\Nắm Trọn Kiến Thức Môn Vật Lý 12 2026 - Tập 2 Từ Trường Và Vật Lý Hạt Nhân (Thầy Đỗ Ngọc Hà).pdf`
Đọc bằng Read với `pages` (≤ 10 trang/lần cho rõ). Chỉ đọc phần **"Kiến thức trọng tâm"** (lý thuyết) quanh các trang được ghi — số trang trạm chép ghi có thể lệch ±3, dò theo nội dung. KHÔNG cần đọc ví dụ / bài tập.

Đầu vào: file khối được giao (`C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\vatly\k12\hinh-lt\khoi-<p>.md`): mỗi nhóm, mỗi khối lý thuyết `K<i>` (đang nằm ở nhóm hay dạng nào) + tiêu đề + đầu nội dung.

## Việc
Với **từng khối**:
1. `can_hinh`: khối này có CẦN hình để học sinh hiểu không? `"can"` (thiếu hình là khó hiểu: đường sức, quy tắc bàn tay, đồ thị, cấu tạo thiết bị, thí nghiệm…) · `"nen"` (có hình thì tốt hơn, không bắt buộc) · `"khong"` (chữ + công thức là đủ: định nghĩa thuần, công thức, bảng số).
2. Nếu `can`/`nen`: sách có hình tương ứng không? Liệt kê `hinh_sach`: `[{trang_pdf, chu_thich (vd "Hình 1-4 Đường sức từ của dòng điện thẳng"), loai: "so_do"|"do_thi"|"anh_that"|"bang", chat_luong: "tot"|"tam"|"xau", ghi}]`. `chat_luong`: tot = nét, nền sạch, cắt ra dùng được ngay; tam = dùng được nhưng có vết scan/hơi mờ; xau = mờ, lệch, lẫn chữ, ảnh đen trắng sạn.
3. `de_xuat`: 1 / 2 / 3 theo luật:
   - Sách có hình đúng ý, chất lượng tot/tam ⇒ **1**.
   - Cần ẢNH THẬT (thiết bị/hiện tượng/ứng dụng) mà sách không có hoặc ảnh sách xấu ⇒ **2**.
   - Cần sơ đồ/đồ thị/hình hình học mà sách không có hoặc hình sách xấu ⇒ **3**.
   - Ghi thêm `co_the` các cách khác cũng làm được (vd sách có sơ đồ tốt ⇒ de_xuat 1, co_the [3]).
   - `so_hinh`: số hình cần cho khối (thường 1; khối so sánh 3 thể rắn/lỏng/khí có thể 3).
4. Hình trong phần lý thuyết của sách mà KHÔNG khớp khối nào ⇒ ghi vào `hinh_le`.

## Đầu ra `...\hinh-lt\do-<p>.json` (Write tool, UTF-8)
```
{ "khoi": [ { "nhom":"LNB…", "k":"K3", "tieu_de":"…", "can_hinh":"can", "so_hinh":1,
              "hinh_sach":[{"trang_pdf":12,"chu_thich":"…","loai":"so_do","chat_luong":"tot","ghi":""}],
              "de_xuat":1, "co_the":[3], "ly_do":"…" } ],
  "hinh_le": [ {"trang_pdf":…, "chu_thich":"…"} ],
  "trang_da_doc": "…" }
```
Mọi khối trong file giao phải có đúng 1 dòng trong `khoi` (kể cả `can_hinh:"khong"` — khi đó `de_xuat: null`). Tự kiểm bằng `node -e` (đường dẫn `C:/Users/...`): parse được, đủ số khối.

## Trả lời cuối (≤ 80 từ)
Số khối cần/nên/không · đếm theo đề xuất 1/2/3 (số khối và số hình) · số hình sách chất lượng xấu · trang đã đọc.
