# ⚠️ ĐẦU ĐÈ cho brief chuẩn bị batch — ĐỀ THI GIỮA KÌ II TOÁN 12, MÁY CÔNG TY (15/11) — đè lên `_brief-chuan-bi-batch.md`

Làm theo `kho-rules/dai/lo/toanmath/_brief-chuan-bi-batch.md` (quy trình + trả lời cuối), CHỈ khác:

- **Máy công ty:** Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. KHÔNG đặt `BK_GOC`/`BK_LV`, KHÔNG đổi `WBPC`→`Admin`.
  Lệnh: `node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>`; đo trùng `node --env-file=.env kho-rules/dai/lo/toanmath/do-trung-batch.mjs --batch <BATCH>` (chỉ đọc DB) trước khi quyết bỏ/giữ.
- **Phạm vi:** CHỈ bài `folder` = `Đề thi/GKII`, `khoi` = `K12` (B108 còn 9 bài GKI — BỎ, ghi `bo.md` "lượt sau — GKI").
  **Chỉ đề của MỘT trường / sở** — bỏ bộ ôn tập nhiều đề (`10-de-…`, `bo-10-de-…`, `bo-de-tham-khao-…`) ghi `bo.md` "bỏ — bộ ôn tập (Thùy 13/11)". File nhiều mã đề ⇒ chỉ lấy MỘT mã (mã đầu) bằng `tach`.
  Đề đã có trong kho (cùng trường + năm học, nội dung khớp) ⇒ bỏ, ghi bằng chứng. PDF và Word cùng một đề ⇒ DÙNG PDF; Word đáp án = nhân chứng.
  B106 là batch Word (ghi chú "có đề lỗi công thức: giải phần sạch, câu hỏng bỏ") — nếu có PDF cùng đề thì dùng PDF; chỉ có Word thì xử lí như B041 (K10 Word đã chạy 14/11 — xem `batch/B041/` để biết cách đã làm).
- **Mỗi đề = MỘT tệp soạn** `<BATCH>-NN`. `de` = mọi trang có câu hỏi; có đáp án / hướng dẫn chấm ⇒ `hd` (nhân chứng, tự giải trước).
- **`_dau-brief.md` cho từng batch — KHUÔN = `batch/B052/_dau-brief.md` (K12 cuối kì I, 14/11)**: chép khuôn đó, chỉ đổi:
  - Tên đề: `# ĐỀ | Đề kiểm tra giữa học kì 2 Toán 12 năm <năm học> — <don_vi> (Mã đề <ma_de>)`.
  - **Phạm vi = GIỮA HỌC KÌ 2 lớp 12 THEO BỘ SÁCH CỦA ĐỀ** = cả 3 chương học kì 1 (như B052) **+ Chương IV Nguyên hàm – Tích phân** (nguyên hàm, tính chất, nguyên hàm các hàm sơ cấp;
    tích phân, tính chất; ứng dụng: diện tích hình phẳng, thể tích vật thể / khối tròn xoay, bài toán chuyển động – thực tế) **+ Chương V Phương pháp toạ độ trong không gian**
    (phương trình mặt phẳng, đường thẳng, mặt cầu; vị trí tương đối, góc, khoảng cách theo công thức SGK) — tới đâu thì THEO ĐỀ (đề kiểm tra tới đâu là đã học tới đó).
    Đọc ma trận / tiêu đề đề để ghi rõ trong `_dau-brief` đề nào kiểm tra tới đâu.
  - **Công cụ:** dùng đúng công cụ của SGK bộ sách đề. Vectơ pháp tuyến từ hai vectơ chỉ phương: nếu hướng dẫn chấm của chính đề dùng tích có hướng thì được dùng; không có nhân chứng ⇒ tìm bằng hệ phương trình (như B052-09).
    Nguyên hàm từng phần / đổi biến: chỉ khi SGK bộ sách đề có (KNTT 12 KHÔNG dạy từng phần / đổi biến tổng quát) — đề đòi mà SGK không có ⇒ giải bằng cách SGK cho phép nếu được, không thì `**Chưa chắc:**`.
    Câu tích phân / diện tích / thể tích: thử máy bằng tích phân số (script node, Simpson) cho mọi đáp số.
  - **Phân kho:** toạ độ Oxyz, vectơ không gian ⇒ `hgt`; nguyên hàm – tích phân, hàm số, số đặc trưng ⇒ `dai`; hình không gian thuần (không toạ độ) ⇒ `hinh_hoc`.
  - Cổng `--khoi 12 --chi-kiem` (dấu nhân `\cdot`, tên hình `S.ABCD` viết bình thường).
  - Luật chung đã chốt (chép vào `_dau-brief`): đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị / giả thiết;
    hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); KHÔNG phương án nào đúng ⇒ giữ nguyên văn, đề sai, Chưa chắc (không "chọn gần nhất");
    hình cắt / vẽ xong, soát xong ⇒ người điều phối chạy `anh-batch.mjs day <BATCH>`; KHÔNG ghi LaTeX qua chuỗi JS (dùng Write/Edit).
- Sau khi viết `_dau-brief.md`: `node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k11dc` (giống B052 — `_dau-brief` đè phần K11), mở `brief-soan.md` kiểm đường dẫn tệp soạn
  `lo\toanmath\batch\<BATCH>\<MA>.soan.md`, `<LV>` = `de-thi\toanmath\<BATCH>\<MA>`.
- Không ghi DB (chỉ đọc), không commit, không xoá gì. Trả lời cuối: mỗi batch — giữ / bỏ (vì sao), danh sách `ma` + trường + số trang + có đáp án không + scan/chữ + bộ sách + cấu trúc + phạm vi kiến thức + ước số câu.
