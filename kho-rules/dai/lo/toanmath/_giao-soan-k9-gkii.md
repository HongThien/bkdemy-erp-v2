# GIAO VIỆC TRẠM SOẠN (Sonnet) — Toán 9 GIỮA KÌ II (đề thi / đề cương). Biến: <B> = batch (vd B056), <MA> = mã đề (vd B056-09).

Soạn MỘT đề thành tệp `.soan.md` đúng luật rồi chạy cổng tới khi đạt.

## BƯỚC 0 — ĐỌC LUẬT ĐỦ MỘT LẦN
Đọc TOÀN BỘ `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\<B>\brief-soan.md` (~1.600 dòng, Read nhiều lượt offset/limit tới hết, không bỏ đoạn nào). Đầu brief có "ĐẦU RIÊNG" (đường dẫn, bản đồ K9, bảng đề) rồi luật spec — trong đó mục **"Giữa kì II" của Khối 9 là LUẬT ĐÃ DUYỆT từ lô mẫu: ÁP ĐÚNG.** Dòng đầu tệp soạn PHẢI là đúng `luat: d6889bbc6d49` (chép từ dòng đầu brief).

## ĐỀ CỦA BẠN
`<MA>` (xem dòng của nó trong bảng đề ở brief).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<B>\<MA>` (`goc.pdf`, `trang\p-N.png` — MỞ ẢNH TRANG bằng Read; ảnh là nguồn chính, lớp chữ PDF chỉ để đối chiếu).
- Tệp soạn: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\<B>\<MA>.soan.md`.
- Cột "Trang đáp án" dò tự động — TỰ XÁC MINH bằng ảnh. Đề không có đáp án in (cột "—", hoặc đề SCAN): TỰ GIẢI toàn bộ, kiểm máy kỹ, câu nào máy không kiểm được ghi cờ thật. Đề SCAN: gõ lại từ ảnh, phóng to chỗ khó (§A11). File ghi "đề cương": đầu tệp có `kieu: de_cuong`, đề dài >~120 câu thì chia khúc theo trang (§A10, ghi `<MA>.k<N>.soan.md`).

## QUY TRÌNH (spec §C2 trạm 3–5)
1. Đọc hết ảnh trang.
2. Phân dạng từng câu TRƯỚC khi giải: mục lục `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\_ban-do-k9\ban-do-k9-muc-luc.md` + đọc ĐỦ mô tả/lý thuyết/ví dụ dạng ứng viên trong `ban-do-k9-chi-tiet.txt` (Grep mã [NDB…]). Dạng sau thắng; không khớp ⇒ `dang=—` + nhãn `THIẾU DẠNG: <tên nên có> (nhóm NNB… gần nhất)` — ĐỪNG tự thêm dạng.
3. TỰ GIẢI trước (đáp án in chỉ là nhân chứng, có thể sai — báo chỗ in sai).
4. Thử mọi đáp số bằng script viết TỪ ĐỀ (§A12; đặt trong `<LV>\tam\`, viết bằng công cụ Write, không heredoc/node -e chứa `\`), không viết hàm kiểm rỗng. Bài Hình: toạ độ số; đề không nói "nhọn" ⇒ thử cả cấu hình tù (luật giữa kì II).
5. Viết tệp theo khuôn §A10 + §A5 + mục Khối 9 (kể cả quy tắc "mỗi câu một dòng `**Ghi chú:**`"). Hình đề: cắt từ goc.pdf vào `<LV>\img\` hoặc vẽ lại bằng code (§A8), dòng `**Hình:** … | nguon=…`; MỞ ẢNH KIỂM từng hình. Viết tệp có LaTeX bằng công cụ Write/Edit (không heredoc, không chuỗi JS).

## QUY TẮC
Chỉ ghi tệp của mình (tệp soạn, script/hình tạm trong `<LV>`). KHÔNG ghi DB, KHÔNG git, KHÔNG xoá tệp, KHÔNG sửa spec/brief/tool. Ghi nháp SỚM, cập nhật dần. Chỗ luật chưa phủ mà phải chọn quy ước ⇒ ghi cuối tệp `## GHI CHÚ CHO NGƯỜI DUYỆT` (kèm bảng nhãn câu → THIẾU DẠNG + mô tả một dòng).

## CỔNG (chạy ở `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`, sửa tới "✔ đạt cổng")
`node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/<B>/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/<B>/<MA>" --khoi 9 --chi-kiem`

## BÁO CÁO CUỐI (≤ 20 dòng)
Số câu · số `**Chưa chắc:**` · số phép thử máy · số FAIL · đã mở ảnh từng hình chưa · cổng đạt (dán dòng cuối) · câu THIẾU DẠNG · quy ước đã chọn · chỗ nghi đề/đáp án in sai. Điều phối tự chạy lại cổng; đừng viết "đã verify" nếu chưa chạy.
