# Brief trạm BÙ VÍ DỤ — lấy BÀI TẬP TỰ LUYỆN của sách + LỜI GIẢI ở phần B

Đọc TRƯỚC brief chung: `C:\Users\WBPC\AppData\Local\Temp\claude\24d31512a800046e\2841adcf-1e74-4adc-8c3a-09e8d60a01a7\scratchpad\vl\brief-ebook.md` (sách, luật cứng, định dạng `##VD` / "Bài giải:", LaTeX, danh sách mã `nut-nhiet-khi.md`). Mọi luật ở đó vẫn áp.

Khác lượt trước: lượt trước chỉ chép "Ví dụ mẫu" có lời giải ngay trong chủ đề. Nhiều dạng chưa có ví dụ. Sách có **"Bài tập tự luyện"** cuối mỗi chủ đề, và **lời giải/đáp án ở phần B "ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI"** (cuối sách). Việc của bạn: với mỗi dạng được giao, chọn **tối đa 3 bài tự luyện** khớp đúng dạng (đọc mô tả nhận biết của dạng trong nut-nhiet-khi.md), chép ĐỀ từ trang chủ đề + LỜI GIẢI từ phần B **đúng chủ đề, đúng phần (①②③ trắc nghiệm / đúng sai / trả lời ngắn), đúng số câu**.

Luật thêm:
- Ghép đề ↔ lời giải theo (chủ đề, phần, số câu) — kiểm 2 lần, sai ghép là hỏng dữ liệu. Không chắc ghép đúng ⇒ bỏ bài đó.
- Trắc nghiệm mà phần B chỉ có bảng đáp án (không giải thích): vẫn dùng được cho dạng NHẬN BIẾT, lời giải ghi đúng `Chọn X.` (không tự thêm giải thích); dạng TÍNH thì cần lời giải có bước, chỉ có chữ cái ⇒ bỏ.
- Bỏ câu Đúng–Sai; bỏ câu cần hình/đồ thị mới hiểu.
- Dạng nào cả chủ đề không có bài khớp ⇒ để trống, ghi lý do.

Đầu ra `V\ebook\<TRAM>.json` cùng khuôn brief chung (chỉ mảng `dang`, có thể có `nhom` nếu được giao lý thuyết). Mỗi `dang` thêm trường `"nguon":"BT tự luyện chủ đề X phần Y câu Z — đề tr.PDF a, giải tr.PDF b"` cho từng ví dụ (nối bằng " | ").
Trả lời cuối ≤ 80 từ: dạng đã có ví dụ (số), dạng vẫn trống + lý do, chỗ ghép không chắc.
