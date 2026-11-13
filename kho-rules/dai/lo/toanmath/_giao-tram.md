# Giao trạm SOẠN / SOÁT một đề toanmath (khuôn chung 13/11/2026)

> Đọc file này trước. Người giao chỉ cho bạn: VAI (SOẠN hoặc SOÁT), `<BATCH>` (vd B010), `<MA>` (vd B010-03), khối, và (nếu có) điểm cần xét kỹ.
> Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2` (thư mục hiện hành khi chạy node). `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\<BATCH>\<MA>`.
> Thư mục batch = `Repo\kho-rules\dai\lo\toanmath\batch\<BATCH>\` (có `ds-de.json`, `brief-soan.md`, `brief-soat.md`).

## Luật chung (Thùy)
- Đáp án / hướng dẫn chấm của trường CHỈ để tham khảo — tự giải trước, lời giải CHI TIẾT đủ 2 phần theo khuôn, không viết sơ lược, không chép hướng dẫn chấm.
- Mọi đáp số thử lại bằng script trong `<LV>\tam\`. Chỗ chưa chắc / đề có cách hiểu khác hợp lý ⇒ `**Chưa chắc:**` — không đoán, không im lặng chọn.
- Kiến thức brief nói "dùng được nếu đề kiểm tra tới; câu nào dùng ⇒ Chưa chắc" thì làm đúng vậy.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào trong repo ngoài tệp của chính `<MA>` nêu dưới, KHÔNG XOÁ bất cứ tệp nào (kể cả nháp).
- Cổng: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/<BATCH>/<MA>.soan.md --lam-viec "<LV>" --khoi <khối> --chi-kiem` (đúng `--khoi` brief ghi) — chạy tới khi "✔ đạt cổng".

## VAI SOẠN
Làm ĐÚNG `brief-soan.md` của batch (đọc HẾT; khối "BẢN ÁP DỤNG BATCH <BATCH>" ở đầu đè lên mọi dòng bên dưới), rồi đọc các tệp brief bảo đọc.
Đầu ra DUY NHẤT trong repo: `batch\<BATCH>\<MA>.soan.md` (+ ảnh vào `<LV>\img\`, script tạm vào `<LV>\tam\`). Trả lời cuối theo brief (≤ 150 từ).

## VAI SOÁT
Làm ĐÚNG `brief-soat.md` của batch (đọc HẾT; khối đầu đè lên bên dưới).
- **Pha 1 GIẢI MÙ:** TUYỆT ĐỐI CHƯA mở `<MA>.soan.md` cho tới khi đã viết xong `<MA>.kiem.md` đủ mọi câu (tự đọc ảnh trang đề, tự giải, thử bằng script).
- **Pha 2 SOÁT:** chép `<MA>.soan.md` → `<MA>.soan.goc.md` TRƯỚC khi sửa; soát từng câu (đúng toán · đúng phạm vi kiến thức khối · khuôn · phân loại · hình — hình giải không được đánh dấu sẵn điều phải chứng minh; vị trí điểm lấy theo hình mà lời giải dùng thì phải chứng minh); sửa thẳng `<MA>.soan.md`; chạy cổng tới khi đạt; viết `<MA>.soat.md`.
- Chỉ ghi 4 tệp `<MA>.*` trong repo (+ `<LV>\tam\`, `<LV>\img\`).
- Trả lời cuối (≤ 150 từ): KẾT LUẬN ĐẠT/CHƯA ĐẠT · số câu khớp Pha 1 · số chỗ sửa (loại lỗi) · danh sách Chưa chắc · hướng dẫn chấm in sai (nếu có).
