# Brief KIỂM độc lập — đề thi vào lớp 6 CLC, 10/10

Bạn là NHÂN CHỨNG THỨ HAI cho một đề thi. Người khác đang soạn lời giải từ bản Word; bạn KHÔNG xem bản soạn đó.
Việc của bạn: đối chiếu đề với bản PDF gốc, lấy đáp số in trong sách, và tự tính lại đáp số. Ba việc, ghi vào một tệp JSON.

## Đầu vào
- `<IN>` = đề đã tách từ Word: `cau[]` có `ma_nguon`, `kieu`, `noi_dung`, `lua_chon`, `hinh[]`.
- `<PDF>` = bản PDF lẻ của chính đề đó: phần ĐỀ rồi phần "HƯỚNG DẪN GIẢI CHI TIẾT" (cột Đáp số). Đọc bằng Read (tham số `pages`), đọc HẾT các trang.
  Có đề KHÔNG có PDF (`<PDF>` = "không có") ⇒ bỏ việc 1 và 2, chỉ làm việc 3.

## Việc 1 — đối chiếu ĐỀ từng câu (Word ↔ PDF)
Bản Word là bản chép lại nên có thể sai số liệu, đảo chữ số, mất phương án, mất hình. Với từng câu, so nội dung Word với câu tương ứng trong PDF:
số liệu, đơn vị, tên điểm, phân số, các phương án A–D, có hình hay không. Lệch ⇒ ghi `de_lech` = mô tả ngắn "Word: … / PDF: …".
Chỉ khác cách trình bày (xuống dòng, dấu câu, cách gõ công thức) thì KHÔNG tính là lệch. Không lệch ⇒ `de_lech: null`.
- Lệch về NỘI DUNG (số liệu, phân số, tên điểm, phương án, thiếu/thừa câu chữ) ⇒ thêm `sua_de`: đề ĐÚNG theo PDF, viết lại trọn câu bằng đúng
  cách gõ của `<IN>` (LaTeX trong `$…$`, `\frac{a}{b}`, `\times`): `{ "noi_dung": "...", "lua_chon": { "A": "...", … } }` (chỉ trường cần sửa).
  PDF rõ ràng mới là bản sai (lỗi in vô lí) ⇒ không `sua_de`, nói rõ trong `de_lech`.
- **Hình:** PDF có hình cho câu này mà `<IN>` có `hinh: []` ⇒ `hinh_pdf`: mảng số trang PDF chứa hình của câu (trang trong PHẦN ĐỀ), kèm ghi trong `de_lech`
  "Word thiếu hình". (CEO 10/10: có hình ở PDF thì bù vào.) Câu có bảng số liệu / biểu đồ trong PDF mà Word mất ⇒ cũng ghi như hình.

## Việc 2 — đáp số của sách
Chép **nguyên văn** đáp số in trong PDF cho từng câu vào `dap_so_sach` (cột Đáp số / dòng "Đáp số:" / phương án được chọn).
PDF vỡ phân số khi đọc chữ ⇒ nhìn trang (ảnh) để đọc đúng. Không có ⇒ `null`.

## Việc 3 — tự tính đáp số (KHÔNG chép sách)
Với từng câu, tự giải từ ĐỀ (theo bản bạn cho là đúng sau việc 1) và **tính bằng code** (script node/python, phân số chính xác; hình học thì dựng toạ độ;
bài đếm thì liệt kê/vét cạn). Ghi `dap_so_tinh` (dạng gọn: số + đơn vị; trắc nghiệm ghi cả giá trị và chữ cái, vd `"5 km (B)"`).
Lời giải sẵn trong sách **có chỗ sai** — đừng để nó dẫn dắt: tính xong mới so.
- `khop_sach`: `true` / `false` / `null` (không có đáp số sách).
- Lệch với sách ⇒ `ghi_chu` nêu rõ bạn tin bên nào và vì sao (kèm phép kiểm).
- Câu không tính được (đề thiếu dữ kiện / thiếu hình) ⇒ `dap_so_tinh: null` + `ghi_chu` nêu thiếu gì.

## Đầu ra
Tệp `<RA>` = JSON `{ "<ma_nguon>": { "de_lech": null | "...", "sua_de": {…} (nếu có), "hinh_pdf": [số trang] (nếu có), "dap_so_sach": "..." | null, "dap_so_tinh": "..." | null, "khop_sach": true|false|null, "ghi_chu": "..." | null } }`
— đủ mọi `ma_nguon` của `<IN>`. Viết bằng script (JSON.stringify), không gõ tay.
Không ghi DB, không sửa tệp trong repo, không đọc thư mục bản soạn. Báo cáo ngắn: số câu, các câu lệch đề, các câu đáp số sách sai (theo bạn), câu không tính được.
