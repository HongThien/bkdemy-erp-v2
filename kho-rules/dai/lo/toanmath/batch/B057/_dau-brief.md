# ĐẦU RIÊNG BATCH B057 — K9 GIỮA KÌ II (phần `Đề thi/GKII` + `Đề cương/GKII` của batch; đề GKI nằm chung batch KHÔNG thuộc việc này) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B057-NN`. Danh sách: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B057\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `de` / `hd` (trang đề / trang đáp án trong file PDF gốc, DÒ TỰ ĐỘNG ⇒ bạn kiểm lại bằng ảnh trang), `co_chu` (false = SCAN: gõ lại từ ảnh).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B057\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to chỗ không chắc: spec §A11.
- Tệp soạn: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B057\<MA>.soan.md` (đề cương dài > ~120 câu: chia khúc, spec §A10). Đề cương: đầu tệp có `kieu: de_cuong`. Tên đề: `Đề kiểm tra giữa học kì 2 Toán 9 năm <năm học> — <trường (phường/quận)> (<mã đề>)` (đề cương: `Đề cương ôn tập giữa học kì II Toán 9 — <trường>`); `nam:` = năm đầu năm học; `bo_sach: KNTT` (đề ghi bộ khác ⇒ ghi đúng).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B057/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B057/<MA>" --khoi 9 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B057`. Trạm không tự chạy.

## ⭐ Bản đồ K9 — PHÂN DẠNG TRƯỚC KHI GIẢI (spec §A3; truy vấn từ DB lúc 2026-11-21 09:27 giờ VN)

- Danh mục dạng (mã · chủ đề · chuyên đề · tên): `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\_ban-do-k9\ban-do-k9-muc-luc.md`. Lý thuyết + mô tả + ví dụ đầy đủ của TỪNG dạng: `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\_ban-do-k9\ban-do-k9-chi-tiet.txt` (tìm theo mã `[NDB…]`; đọc ĐỦ mô tả + lý thuyết + ví dụ của dạng ứng viên rồi mới gán — chỉ đọc tên dạng mà gán = sai luật).
- Mã dạng: Đại / hgt = `NDB…` (mục lục). Hình = mã bài `HH…` theo mục "Phân dạng riêng" của Khối 9 (HH00105–HH00110, HH00095…). Câu **không khớp rõ dạng nào** ⇒ `dang=—` + `chac=—` + MỘT dòng lí do mở bằng đúng một nhãn `THIẾU DẠNG: <tên nên có>` | `KHÔNG THUỘC CHỦ ĐỀ: …` | `THIẾU HÌNH: …` | `ĐỀ LỖI: …` (ghi ở dòng `**Ghi chú:**` hoặc ngay sau `chac=—`; chép lí do vào mục `## GHI CHÚ CHO NGƯỜI DUYỆT` dạng bảng "nhãn câu → nhãn lí do"). **Không tự thêm dạng vào bản đồ.**
- ⚠️ **Bản đồ Đại K9 HIỆN CHỈ CÓ NHÓM, CHƯA CÓ dạng** cho: hàm số bậc hai $y=ax^2$ (nhóm NNB01075; phương trình bậc hai + Viète chưa có cả nhóm) · tần số / tần số tương đối / biểu đồ (NNB01076) · xác suất (NNB01077) · hình hộp chữ nhật (NNB01078; trụ – nón – cầu chưa có). Câu thuộc các nội dung này ⇒ `dang=—`, `THIẾU DẠNG: <tên dạng nên có> (nhóm NNB… gần nhất)` (gom lại ở GHI CHÚ CHO NGƯỜI DUYỆT: nhãn câu + tên dạng nên có + mô tả một dòng) — điều phối tổng hợp thành đề xuất cho trưởng khối. Hình K9: câu hợp bài `HH00105–HH00110` / `HH00095` thì gán; góc nội tiếp, tứ giác nội tiếp, đường tròn ngoại – nội tiếp, hình tổng hợp, hình trụ – nón – cầu **chưa có bài đích** ⇒ `dang=—` + `THIẾU DẠNG: <tên bài nên có>`.
- ⚠️ **Mốc kiến thức GIỮA KÌ II: ĐÃ CÓ LUẬT (lô mẫu B055 duyệt 21/11) — đọc kỹ mục "Giữa kì II" trong mục Khối 9 ở dưới và ÁP ĐÚNG** (phạm vi theo chính đề; được dùng Δ/Δ′ / nhẩm nghiệm / Viète sau khi chỉ ra hai nghiệm; góc nội tiếp, tứ giác nội tiếp chiều thuận; hình trụ khi đề ra; đề Hình thiếu "nhọn" ⇒ thử toạ độ cả cấu hình tù rồi thêm "nhọn" + Ghi chú; cực trị không Cô-si dùng thẳng; …). Đề khó / chuyên: bài khó dùng được mọi kiến thức tới C8; không giải được trong phạm vi ⇒ giải cách đúng nhất + `**Chưa chắc:**`. Chỗ nào luật chưa phủ mà bạn phải chọn quy ước mới ⇒ ghi vào `## GHI CHÚ CHO NGƯỜI DUYỆT` (điều phối sẽ gom thành luật).
- **Đề ghi "hệ chuẩn / hệ nâng cao" hoặc nhiều mã đề cùng trường:** soạn nguyên từng phần; Bài "chọn một trong hai ý" ⇒ nhập cả hai. Hướng dẫn chấm in kèm là nhân chứng, KHÔNG phải nguồn chép (§A4): tự giải trước.
- Phân kho: mọi câu hình học (đường tròn, góc nội tiếp, chứng minh hình, tính trên hình) `kho=hinh_hoc`; tỉ số lượng giác / giải tam giác vuông `kho=hgt`; còn lại (kể cả thống kê, xác suất, hàm số, hình trụ – nón – cầu) `kho=dai`.
- Loại câu K9: Đúng/Sai nhập `tu_luan` (Khối 9 mục "Loại câu"); tách ý chỉ theo danh sách K9 (§Khối 9 Đại (b) "Tách ý").
- Ảnh hình đề: nguồn hình theo §A8 (gốc ổn ⇒ cắt từ `goc.pdf`, vào `img\`, ghi `**Hình:** <tệp> | nguon=goc`; tệ ⇒ vẽ lại bằng code, `nguon=ve_lai:<a–f>`). Mở ảnh kiểm từng hình.

## Bảng đề

| MA | Loại | Trường · năm học | Trang đề | Trang đáp án | Lớp chữ | Ghi chú |
|---|---|---|---|---|---|---|
| B057-01 | đề thi | THCS Tây Mỗ 3, Hà Nội · 2025–2026 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-02 | đề thi | THPT chuyên Hà Nội – Amsterdam · 2025–2026 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-03 | đề thi | THCS Cổ Đông, Hà Nội · 2024–2025 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-04 | đề thi | THCS Nghĩa Tân, Hà Nội · 2024–2025 | 1-4 | — | chữ | không dò thấy trang đáp án — trạm kiểm lại |
| B057-05 | đề thi | THCS Ngọc Lâm, Hà Nội · 2024–2025 | 1 | — | **SCAN** | mã đề 901; file có 2 mã (T901 trang 1, T902 trang 2), soạn thành 2 đề riêng (B057-05 / B057-16) — goc.pdf đã tách riêng theo mã đề (trang 1 = đề, không có đáp án) |
| B057-06 | đề thi | THCS Nguyễn Du, Hà Nội · 2024–2025 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-07 | đề thi | THCS Phan Đình Giót, Hà Nội · 2024–2025 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-08 | đề thi | THCS Phúc Đồng, Hà Nội · 2024–2025 | 1-4 | — | chữ | không dò thấy trang đáp án — trạm kiểm lại |
| B057-09 | đề thi | THCS Ba Đình, Hà Nội · 2025–2026 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-10 | đề thi | THCS Cầu Diễn, Hà Nội · 2025–2026 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-11 | đề thi | THCS Đức Giang, Hà Nội · 2025–2026 | 1-1 | 2-3 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B057-12 | đề thi | THCS Nghĩa Tân, Hà Nội · 2025–2026 | 1-2 | 3-6 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B057-13 | đề thi | THCS Kiêu Kỵ, Hà Nội · 2025–2026 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-14 | đề thi | THCS Lê Hồng Phong, Hà Nội · 2025–2026 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-15 | đề thi | THCS Nguyễn Trường Tộ, Hà Nội · 2025–2026 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B057-16 | đề thi | THCS Ngọc Lâm, Hà Nội · 2024–2025 | 1 | — | **SCAN** | mã đề 902 (cùng file với B057-05) — goc.pdf đã tách riêng theo mã đề (trang 1 = đề, không có đáp án) |
