# Lệnh chung cho trạm SOẠN / SOÁT (toanmath, 14/11) — đọc cùng brief của batch

Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<B>` = batch, `<MA>` = mã đề, `<K>` = khối, `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<B>\<MA>`.
Brief: `kho-rules/dai/lo/toanmath/batch/<B>/brief-soan.md` (trạm soạn) · `brief-soat.md` (trạm soát) — đọc HẾT.

## Khúc (đề cương dài)
Lệnh giao có thể ghi **khúc N = trang a–b**: làm MỌI câu/bài **BẮT ĐẦU** trong trang a–b (bài bắt đầu ở trang b tràn sang trang sau thì làm trọn bài đó);
bài bắt đầu ở trang trước a (tràn vào a) thuộc khúc trước — KHÔNG làm. Tệp khúc: `<MA>.k<N>.soan.md` (soạn) · `<MA>.k<N>.kiem.md`, `<MA>.k<N>.soat.md`, `<MA>.k<N>.soan.goc.md` (soát).
Mỗi tệp khúc có đủ dòng đầu tệp như brief. PHẦN đặt theo tên mục của đề; khúc bắt đầu giữa một mục ⇒ PHẦN đầu ghi `<tên mục> (tiếp)`. Nhãn câu giữ như in.
Ghi trong `## GHI CHÚ CHO NGƯỜI DUYỆT`: "Khúc N từ <nhãn đầu> đến <nhãn cuối>". Hình cắt tên tiền tố `k<N>_`. Script nháp trong `<LV>\tam\k<N>\`.
Không có khúc ⇒ tệp `<MA>.soan.md` / `.kiem.md` / `.soat.md` như thường.

## Luật chung (đã chốt — đè mọi chỗ khác)
- Ghi tệp SỚM theo từng PHẦN và cập nhật dần (Write lần đầu, Edit nối thêm) — bị ngắt vẫn còn phần đã làm. Làm HẾT, không bỏ dở.
- KHÔNG viết LaTeX qua chuỗi JS (`\t` `\f` `\n` thành ký tự thật) — dùng Write/Edit.
- Đề sai ⇒ giải THEO ĐỀ IN + `**Ghi chú:** đề sai …` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN (+ Ghi chú). KHÔNG tự thêm câu hỏi, tự chọn giá trị, đổi số liệu, giải "bản sửa".
- Hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành SAI hẳn + Ghi chú (Thùy 10/10). Chỉ treo `**Chưa chắc:**` khi thật sự hai cách hiểu hoặc vượt phạm vi.
- Đáp án / lời giải in kèm = nhân chứng: TỰ GIẢI TRƯỚC rồi mới mở; lệch ⇒ tính lại bằng máy, trường sai thì giữ đúng + Ghi chú.
- Đ/S đủ 4 ý a–d. Đáp số một số vừa ô ⇒ `tra_loi_ngan`. Phân kho theo brief (hình không gian ⇒ `hinh_hoc`; Vectơ K10 ⇒ `hgt`).
- Đọc ẢNH phóng to (`pdftoppm -r 260…`) — lớp chữ PDF hay mất ký hiệu / ngoặc / số mũ.
- Thử đáp số bằng script node/python trong `<LV>\tam\`. Cổng: `node scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp> --lam-viec "<LV>" --khoi <K> --chi-kiem` (cwd = repo) tới khi ✔.
- Trạm SOÁT: Pha 0 lập danh sách câu từ ảnh (đúng phạm vi khúc) so tệp; Pha 1 giải mù TRƯỚC khi mở bản soạn (ghi `.kiem.md` dần); Pha 2 soát từng câu, sao bản gốc `.soan.goc.md` trước khi sửa; kiểm mọi hình; biên bản có dòng `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — …`.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG xoá gì. Không chạy `anh-batch.mjs` (người điều phối chạy).
- Trả lời cuối NGẮN: số câu theo dạng thức · (soát: KẾT LUẬN, khớp, đã sửa) · Chưa chắc · đề sai.
- **K10 phân kho (đính chính 14/11):** CHỈ câu Vectơ (khái niệm, tổng–hiệu–tích với số, tích vô hướng, toạ độ vectơ, đẳng thức vectơ, lực–vận tốc) là `hgt`; HỆ THỨC LƯỢNG trong tam giác và mọi phần khác là `dai`. Lệnh giao nào ghi "Vectơ / hệ thức lượng ⇒ hgt" là SAI — theo brief.
- Chỉ sửa phương án khi HAI phương án cùng đúng / in trùng. KHÔNG phương án nào đúng ⇒ giữ nguyên văn, ghi đề sai, treo Chưa chắc — không thay phương án, không "chọn gần nhất".
