# Brief — soạn LỜI GIẢI chi tiết cho chuỗi bài Hình 8 (mô hình "Hình chữ nhật trong tam giác vuông – Trung điểm M")

Đầu vào: `de.json` (cùng thư mục) — mảng bài: `ma`, `so` (B1…B27), `de_day_du` (giả thiết đầy đủ + câu hỏi), `tien_de` (các bài phải giải trước, ĐÃ chứng minh — được dùng kết quả).

## Kiến thức được dùng (lớp 8, chương TỨ GIÁC — học sinh CHƯA học Định lí Thalès)
- Lớp 7: tam giác bằng nhau (c.c.c, c.g.c, g.c.g, cạnh huyền–cạnh góc vuông, cạnh huyền–góc nhọn), tam giác cân, đường trung trực, tính chất 3 đường trung tuyến (trọng tâm), quan hệ song song (so le, đồng vị), tổng ba góc.
- Lớp 8: tứ giác, hình thang, hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông (định nghĩa + tính chất + dấu hiệu), đối xứng tâm/trục; "trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền" (hệ quả hình chữ nhật).
- **CẤM dùng "đường trung bình của tam giác/hình thang" (kể cả ngầm)** — cần thì tự chứng minh qua hình bình hành / tam giác bằng nhau. Cấm Thalès, tam giác đồng dạng, lượng giác, toạ độ.

## Cách viết
- Được dùng kết quả của các bài trong `tien_de`: ghi rõ "(theo B3)". Không chứng minh lại điều tiền đề đã có. Kết quả không có trong `tien_de` mà cần dùng ⇒ tự chứng minh ngắn gọn.
- Lời giải đầy đủ, chặt chẽ, đúng chuẩn trình bày THCS: mỗi bước có lí do ("vì…", "nên…", "(gt)", "(cmt)").
- Mọi tên điểm, đoạn, góc, biểu thức trong `$…$`; góc viết `$\widehat{ABC}$`, vuông góc `\perp`, song song `\parallel`, độ `90^\circ`, tam giác `\Delta ABC`.
- **Mỗi câu một dòng: xuống dòng bằng MỘT ký tự `\n`. KHÔNG có dòng trống (`\n\n`) ở bất kỳ đâu.** Không đánh số bước, không tiêu đề, không markdown (`**`, `#`, `-`).
- Bài "Tìm điều kiện…": chứng minh cả điều kiện cần (nếu … là hình vuông thì …) và đủ (ngược lại), kết luận "Vậy tam giác $ABC$ … thì …".
- Trước khi viết, DỰNG TOẠ ĐỘ số (vd $A(0,0)$, $B(0,4)$, $C(6,0)$, rồi một bộ khác) để kiểm khẳng định đúng và kiểm từng bước; bài đồng quy/thẳng hàng phải kiểm bằng toạ độ.
- Nếu phát hiện đề SAI hoặc thiếu (khẳng định không đúng với mọi hình hợp giả thiết), KHÔNG bịa lời giải: ghi `"loi_giai": null` và nêu rõ trong `ghi_chu`.

## Đầu ra
Ghi `lg-<phần>.json` cùng thư mục: mảng `[{ "ma": "BT.08.072.01", "so": "B1", "loi_giai": "…", "ghi_chu": "" }]`, đúng thứ tự, đủ số bài được giao. Ghi bằng Write (JSON hợp lệ — nhớ `\\` trong chuỗi JSON cho lệnh LaTeX, vd `"$\\widehat{A}$"`).
CẤM đọc/sửa file khác ngoài `brief.md`, `de.json` và file đầu ra của mình; cấm ghi DB, cấm chạy script ghi. Trả lời cuối: số bài đã giải, bài nào có ghi chú.
