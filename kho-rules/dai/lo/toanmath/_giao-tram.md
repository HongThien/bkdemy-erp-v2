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

- ⭐⭐ **SƠ ĐỒ TƯ DUY (Thùy 14/11) — đè lên khuôn Phần 1 của brief khối:** câu `kho=hinh_hoc` có ý **chứng minh** ⇒ KHÔNG viết `**Phần 1. Hướng dẫn**`;
  viết khối `**Sơ đồ tư duy**` (Mấu chốt + một dòng mỗi ô `- nK | ý | mốc | từ | lý do`, theo thứ tự xuôi), rồi `**Phần 2. Trình bày**` chia khúc:
  dòng ý `a)` đứng một mình, mỗi khúc mở bằng dòng riêng `[[so-do:nK]]`, mỗi ô đúng một khúc. Khuôn đầy đủ: `Repo\kho-rules\README.md` §3 "SƠ ĐỒ TƯ DUY";
  mẫu: `batch\B010\B010-12.soan.md` Câu 4.2, `batch\B011\B011-06.soan.md` Bài 4, `batch\B005\B005-01.soan.md` Câu 4.2. Câu Hình chỉ tính / TN / trả lời ngắn và câu Đại: giữ Phần 1 như cũ.
  Trạm SOÁT kiểm thêm: mỗi ô là một mốc thật (không phải một dòng trình bày), "từ" đúng (ô thật sự dùng ô nào), lý do trong whitelist, khúc chứng minh đúng mốc của ô.

## VAI SOẠN
Làm ĐÚNG `brief-soan.md` của batch (đọc HẾT; khối "BẢN ÁP DỤNG BATCH <BATCH>" ở đầu đè lên mọi dòng bên dưới), rồi đọc các tệp brief bảo đọc.
Đầu ra DUY NHẤT trong repo: `batch\<BATCH>\<MA>.soan.md` (+ ảnh vào `<LV>\img\`, script tạm vào `<LV>\tam\`). Trả lời cuối theo brief (≤ 150 từ).

## VAI SOÁT
Làm ĐÚNG `brief-soat.md` của batch (đọc HẾT; khối đầu đè lên bên dưới).
- **Pha 1 GIẢI MÙ:** TUYỆT ĐỐI CHƯA mở `<MA>.soan.md` cho tới khi đã viết xong `<MA>.kiem.md` đủ mọi câu (tự đọc ảnh trang đề, tự giải, thử bằng script).
- **Pha 2 SOÁT:** chép `<MA>.soan.md` → `<MA>.soan.goc.md` TRƯỚC khi sửa; soát từng câu (đúng toán · đúng phạm vi kiến thức khối · khuôn · phân loại · hình — hình giải không được đánh dấu sẵn điều phải chứng minh; vị trí điểm lấy theo hình mà lời giải dùng thì phải chứng minh); sửa thẳng `<MA>.soan.md`; chạy cổng tới khi đạt; viết `<MA>.soat.md`.
- Chỉ ghi 4 tệp `<MA>.*` trong repo (+ `<LV>\tam\`, `<LV>\img\`).
- Trả lời cuối (≤ 150 từ): KẾT LUẬN ĐẠT/CHƯA ĐẠT · số câu khớp Pha 1 · số chỗ sửa (loại lỗi) · danh sách Chưa chắc · hướng dẫn chấm in sai (nếu có).
