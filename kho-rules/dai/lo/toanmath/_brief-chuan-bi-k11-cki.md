# ⚠️ ĐẦU ĐÈ cho brief chuẩn bị batch — ĐỀ THI CUỐI KÌ I TOÁN 11, CHỈ ĐỀ TRƯỜNG, MÁY CÔNG TY (13/11) — đè lên `_brief-chuan-bi-batch.md`

Làm theo `kho-rules/dai/lo/toanmath/_brief-chuan-bi-batch.md` (quy trình + trả lời cuối), CHỈ khác:

- **Máy công ty:** Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. KHÔNG đặt `BK_GOC`/`BK_LV`, KHÔNG đổi `WBPC`→`Admin`. Lệnh: `node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>`.
- **Phạm vi = 4 batch B031 · B032 · B033 · B034, CHỈ bài `folder = Đề thi/CKI` VÀ là ĐỀ CỦA MỘT TRƯỜNG / SỞ** (Thùy 13/11: "Chỉ đề trường"):
  - **BỎ** các bộ ôn tập nhiều đề (tên bắt đầu `10-de-…`, `bo-de-…`) — ghi vào `bo.md` mục "bỏ — bộ ôn tập (Thùy 13/11)". **BỎ** mọi bài CKII trong B033 (lượt sau).
  - Còn lại 15 bài: B031 ×8 (có cả PDF lẫn Word — DÙNG PDF), B032 ×4, B033 ×3, B034 ×1 (scan nghi trùng).
- **Mỗi batch một `ds-de.json`** (giữ mã batch: `B031-NN`, `B032-NN`…). Đọc PDF xác định trang ĐỀ và trang ĐÁP ÁN / HƯỚNG DẪN CHẤM; file nhiều mã đề ⇒ **chỉ lấy MỘT mã (mã đầu)**
  bằng `tach` (vd "Mã đề 111"). File Word đáp án (`Dap an…docx`, `ĐÁP ÁN…docx` trong thư mục cùng tên bài) là nhân chứng — ghi đường dẫn vào trường mới `"dap_an_word"` của mục đó nếu có.
  Đề scan (Lê Quý Đôn TP HCM, Tây Thạnh, Trần Phú Hà Nội…): xem ảnh trang. B034 Trần Phú Hà Nội: so với kho (đề thi khối 11 cùng trường + năm) theo bước 2 của brief gốc — trùng ⇒ bỏ.
- **`_dau-brief.md` cho từng batch** (cùng nội dung, đổi mã batch) — khuôn: B005 `_dau-brief.md` nhưng cho THPT:
  - `<MA>`/`<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<BATCH>\<MA>`; tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\<BATCH>\<MA>.soan.md` — **MỘT ĐỀ = MỘT TỆP**
    (brief gốc là đề cương chia khúc `.p<P>` và có bước `ghep-k11.mjs` — BỎ, không chia khúc, không chạy ghep-k11). Cổng: `node scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp soạn> --lam-viec "<LV>" --khoi 11 --chi-kiem`.
  - **Đầu tệp đề thi** (thay khuôn đề cương): `# ĐỀ | Đề kiểm tra cuối học kì 1 Toán 11 năm <năm học> — <don_vi> (<mã đề>)`, `nam: <năm đầu>`, `bo_sach: <KNTT|Cánh Diều|CTST>`, `thoi_gian_phut: <theo đề, thường 90>` — **KHÔNG có dòng `kieu: de_cuong`**.
  - **PHẦN theo đúng đề:** PHẦN I trắc nghiệm · PHẦN II Đúng/Sai · PHẦN III trả lời ngắn · (PHẦN IV tự luận nếu có), số câu đúng như đề; Đ/S đủ 4 ý a–d.
  - **Phạm vi = cuối học kì 1 lớp 11 THEO BỘ SÁCH CỦA ĐỀ** (đọc từ tiêu đề / nội dung): KNTT C1–C5 như brief gốc §1 (LG & PTLG · dãy số, CSC, CSN · số đặc trưng mẫu ghép nhóm ·
    quan hệ song song · giới hạn, liên tục); Cánh Diều / CTST: các chương học kì 1 tương ứng (cùng chủ đề, thứ tự khác) — ghi rõ trong `_dau-brief`. CẤM như brief gốc
    (đạo hàm, mũ–logarit, L'Hôpital…).
  - **Đáp án trường = nhân chứng, tự giải trước** (như B001): mở trang đáp án / Word đáp án SAU khi tự giải; lệch ⇒ tính lại bằng máy, đáp án trường sai thì giữ đúng + `**Ghi chú:**`.
  - Phân kho: `kho=hinh_hoc` cho hình học không gian (quan hệ song song, giao tuyến, thiết diện…); còn lại `kho=dai`.
  - **Hình:** cắt / vẽ xong, soát xong ⇒ người điều phối chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day <BATCH>` (hình sống trên kho — Thùy 13/11).
- Sau khi viết `_dau-brief.md` mỗi batch, chạy `node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k11dc` (gốc = brief đề cương K11, đã tự bỏ hậu tố `.p<P>`), rồi mở
  `batch/<BATCH>/brief-soan.md` kiểm: đường dẫn tệp soạn là `lo\toanmath\batch\<BATCH>\<MA>.soan.md`, `<LV>` là `de-thi\toanmath\<BATCH>\<MA>`.
- Trả lời cuối: mỗi batch — số bài giữ / bỏ (vì sao), danh sách `ma` + trường + mã đề + có đáp án (PDF/Word) hay không + scan/chữ + bộ sách.
