# Brief GIẢI CHI TIẾT — câu đề thi học kì / khảo sát Toán 12 (mọi chương), Sonnet 05/11

Thùy chốt: K12 KHÔNG cần lời giải kiểu "hướng dẫn", **chỉ cần LỜI GIẢI CHI TIẾT**. Thư mục: `kho-rules/dai/lo/k12-de/de-hoc-ki/`. Mỗi lô `giai-NN.json` (mảng câu: `id`, `loai` = `trac_nghiem` (4 phương án A–D theo thứ tự `lua_chon`) | `tra_loi_ngan`, `de`, `lua_chon`) → ghi `giai-NN.out.json` (đúng số phần tử, đúng thứ tự, Write tool, JSON hợp lệ).

## Cách làm
1. Tự giải từng câu (CT Toán 12, 2018). **Kiểm bằng máy khi tính được** (node: Simpson, đạo hàm số, thử phương án…) — script tạm đặt trong `tam-giai-NN/` (tự tạo). Không dùng `/tmp` chung.
2. `dap_an`: trắc nghiệm = một chữ `"A"|"B"|"C"|"D"` đúng thứ tự `lua_chon`; trả lời ngắn = chuỗi số (dấu chấm thập phân, không đơn vị; làm tròn đúng yêu cầu đề).
3. `loi_giai` = lời giải CHI TIẾT như học sinh trình bày: mỗi bước một dòng (cách nhau `\n`, KHÔNG dòng trống), công thức trong `$…$` (không `$$`), phân số `\dfrac`, nhân `\cdot`, kết luận cuối bằng "Vậy …" (trắc nghiệm: "Chọn X."). Không nhắc "hướng dẫn".
4. `chuong` = chương của câu: `HS` (khảo sát hàm số, đơn điệu/cực trị/GTLN/tiệm cận/đồ thị/tương giao/tiếp tuyến) · `NHTP` (nguyên hàm, tích phân, diện tích, thể tích) · `VT` (vectơ, toạ độ trong KG, tích vô hướng/có hướng) · `XS` (xác suất có điều kiện, Bayes) · `SDT` (số đặc trưng mẫu số liệu ghép nhóm) · `PPTD` (phương trình mặt phẳng, đường thẳng, mặt cầu trong Oxyz) · `KHAC` (lớp 10–11, hình học không gian, hệ thức lượng…).
5. Câu thiếu dữ kiện / cần hình / đề lỗi nặng ⇒ `dap_an: null`, `loi_giai: ""`, `ghi` nêu lý do. Đề lỗi in hiển nhiên mà vẫn giải được ⇒ giải bình thường, `de_sai: true`. **Thà null còn hơn đoán.**
6. Không sửa file khác, không ghi DB, **không xoá gì**.

## Đầu ra mỗi phần tử
`{"id":"X0001","dap_an":"C","loi_giai":"…","chuong":"HS","do_chac":"cao|vua","de_sai":false,"ghi":"≤ 20 từ hoặc rỗng"}` — `do_chac` cao nếu đã kiểm bằng máy hoặc giải 2 cách khớp.
Cuối cùng trả lời ≤ 40 từ: số câu cao/vua/null.
