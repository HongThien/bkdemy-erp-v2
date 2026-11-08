# Brief B3 Hình–Học K11 — xếp câu vào BÀI HỌC của chủ đề «Quan hệ song song trong không gian»

> ## ⛔ LUẬT CỨNG SỐ 1 (Thùy 02/11 — mọi khối)
> Để phân dạng một lượt, PHẢI đọc đủ MÔ TẢ + LÝ THUYẾT + VÍ DỤ của TỪNG bài trong `dich.md` (5 bài, ~32KB). Đọc HẾT từng đoạn tới cuối, không xếp theo tên bài hay từ khoá.
> Thà để trống còn hơn xếp sai: một câu xếp sai ở mức `cao` sẽ được ghi thẳng vào kho.

## Đầu vào (thư mục C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\b3\h11\)
- `dich.md`: 5 bài đích (mã `HH000xx`): HH00087 Đường thẳng và mặt phẳng trong không gian · HH00137 Hai đường thẳng song song · HH00141 Đường thẳng song song với mặt phẳng · HH00147 Tìm giao điểm và tính tỉ lệ cạnh · HH00148 Tìm thiết diện và tính diện tích thiết diện.
- `lo-NN.json`: mảng câu: `ma_cau`, `loai` (trac_nghiem | tu_luan | tra_loi_ngan | dung_sai), `de`, `lua_chon`, `menh_de` (câu Đúng/Sai), `dap_an`, `loi_giai` (cắt 500), `co_hinh` (đề có hình bạn không thấy).

## Cách xếp
1. Xếp theo KIỂU BÀI: đề cho gì, hỏi gì, giải bằng phương pháp gì (xem lời giải nếu có) — đối chiếu với mô tả + lý thuyết + ví dụ của từng bài, đọc kỹ dòng «Lưu ý:» (ranh giới).
2. **Dạng sau thắng**: câu hợp ≥2 bài ⇒ xếp bài đứng SAU trong `dich.md`, mức `cao`. Ngoại lệ: có bằng chứng độc lập khác.
3. Chương này CHỈ có 5 bài trên. Câu thuộc chương khác — QUAN HỆ VUÔNG GÓC (hai đt vuông góc, góc giữa đt/đt-mp, đt vuông góc mp, hai mp vuông góc, góc nhị diện), KHOẢNG CÁCH, THỂ TÍCH/khối đa diện, PHÉP CHIẾU SONG SONG/hình biểu diễn, hoặc không thuộc hình không gian — KHÔNG có bài ⇒ để trống (`dang_bai_id: null`, `chac: null`) và `ly_do` bắt đầu bằng «thuộc <tên chủ đề>: …». Câu vừa song song vừa vuông góc: xét phần việc chính (cách giải thực sự cần); mục tiêu là vuông góc/khoảng cách/thể tích ⇒ trống.
4. Câu Đúng/Sai (4 mệnh đề, `loai = dung_sai`): để trống, `ly_do` «câu Đúng/Sai ⇒ kho riêng cấp chủ đề».
5. Mức chắc: `cao` = khớp rõ đúng một bài (kể cả sau luật dạng-sau-thắng). `vua` = bài hợp nhất còn bài khác cũng có thể, hoặc đề có hình (`co_hinh`) mà nội dung phụ thuộc hình và đề không tự đủ; câu hình mà ĐỀ/lời giải tả đủ dữ kiện thì vẫn `cao`. Trống = không bài nào khớp (xem mục 3).
6. `ly_do`: tiếng Việt, ≤25 từ, RIÊNG cho từng câu (không dùng câu mẫu chung).
7. `can_cu`: trích NGUYÊN VĂN (verbatim, ≤20 chữ) một cụm từ lấy trong mô tả/lý thuyết/ví dụ của bài đã chọn (chứng cứ đã đọc), ưu tiên cụm khớp chính câu đó. Câu trống thì `can_cu: null`.

## Đầu ra
Với mỗi `lo-NN.json` ghi `lo-NN.out.json` cùng thư mục: mảng, MỖI câu đầu vào đúng 1 phần tử, đúng thứ tự, đủ số câu:
`[{"ma_cau":"HHC0…","dang_bai_id":"HH00148","chac":"cao","ly_do":"…","can_cu":"…"}]` (`dang_bai_id` chỉ là 1 trong 5 mã trên hoặc null).
Ghi bằng Write hoặc một script đặt ở thư mục riêng của bạn (scratchpad dùng chung với phiên khác). Làm xong lô nào ghi lô đó. Không ghi DB, không sửa file khác. Cuối cùng báo: mỗi lô bao nhiêu cao / vừa / trống, và xác nhận đã đọc hết dich.md.
