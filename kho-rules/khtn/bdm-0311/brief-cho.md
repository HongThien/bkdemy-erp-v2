# Brief: chọn NHÓM cho câu KHTN đang ở "dạng chờ" (03/11/2026) — bước 1/2

Các câu trong lô chưa thuộc nhóm nào trên bản đồ mới KHTN. Việc của bạn CHỈ là chọn **nhóm bài** đúng cho từng câu
(bước 2, một trạm khác sẽ đọc đủ mô tả + lý thuyết + ví dụ để xếp vào dạng). Không ghi DB, không sửa tệp nào ngoài tệp kết quả.
Script phụ (nếu cần) đặt tên riêng có tên lô.

## Đầu vào `<LO>.in.json`
- `danh_muc[]`: mọi nhóm của khối — `nhom_id`, `chu_de`, `chuyen_de`, `nhom`, và `dang[]` (tên + mô tả từng dạng bài) để hiểu phạm vi nhóm.
- `cau[]`: `ma_cau`, `loai`, `de`, `lua_chon?`, `dap_an?`, `loi_giai` (có thể cắt), `co_hinh?`, `de_goc?` (tên đề nguồn).
Đọc HẾT `danh_muc` trước (tệp lớn thì Read từng đoạn tới cuối).

## Cách chọn
1. Chọn nhóm có một dạng bài khớp KIỂU BÀI của câu (đề cho gì, hỏi gì, giải thế nào) — đối chiếu mô tả dạng.
2. `chac`: `cao` khi có đúng một nhóm hợp rõ; `vua` khi phân vân 2 nhóm, đề lỗi/thiếu, hoặc phụ thuộc hình.
3. Không nhóm nào hợp (kiến thức chưa có trên bản đồ khối, câu khác khối, không phải câu hỏi) ⇒ `nhom_id: null`, `ly_do` nói rõ thiếu gì.
4. Câu tổng hợp nhiều chủ đề ⇒ chọn nhóm của ý trọng tâm/ý hỏi cuối; nếu không rõ ⇒ `vua`.

## Đầu ra `<LO>.out.json`
Mảng, mỗi câu đúng 1 phần tử, đúng thứ tự: `[{"ma_cau":"…","nhom_id":"KNB…|null","chac":"cao|vua|null","ly_do":"≤ 20 từ"}]`
Tự kiểm đủ số câu và mọi `nhom_id` có trong `danh_muc`. Trả lời cuối: số cao/vua/trống, chủ đề nào thiếu trên bản đồ.
