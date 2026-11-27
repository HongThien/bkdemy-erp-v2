# ĐẦU RIÊNG BATCH B065 — K8 HỌC KÌ II (đề thi GKII / CKII Hà Nội) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B065-NN`. Danh sách: `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B065\ds-de.json` — mỗi mục có `ky` (GKII / CKII), `don_vi` (tên trường viết tạm từ tên tệp, KHÔNG dấu — đọc tên thật trên đề), `nam` (năm đầu năm học), `de` / `hd` (trang đề / trang đáp án trong PDF gốc, DÒ TỰ ĐỘNG ⇒ bạn kiểm lại bằng ảnh trang), `co_chu` (false = SCAN: gõ lại từ ảnh).
- `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B065\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to chỗ không chắc: spec §A11.
- Tệp soạn: `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B065\<MA>.soan.md`. Tên đề: `Đề kiểm tra <giữa học kì 2 | cuối học kì 2> Toán 8 năm <năm học> — <trường (phường/quận)> (<mã đề>)` (cột Kì: GKII = giữa, CKII = cuối); `nam:` = năm đầu năm học; `bo_sach:` theo bìa đề (KNTT / CTST / CD…; đề không ghi ⇒ KNTT).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B065/<MA>.soan.md --lam-viec "C:/Users/Admin/bk-kho-lam-viec/de-thi/toanmath/B065/<MA>" --khoi 8 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B065`. Trạm không tự chạy.

## ⭐ Bản đồ K8 — PHÂN DẠNG TRƯỚC KHI GIẢI (spec §A3)

- Danh mục dạng (mã · chủ đề · chuyên đề · tên): `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\_ban-do-k8\ban-do-k8-muc-luc.md`. Lý thuyết + mô tả + ví dụ đầy đủ của TỪNG dạng: `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\_ban-do-k8\ban-do-k8-chi-tiet.txt` (tìm theo mã `[NDB…]`; đọc ĐỦ mô tả + lý thuyết + ví dụ của dạng ứng viên rồi mới gán — chỉ đọc tên dạng mà gán = sai luật).
- ⚠️ **Bản đồ Đại K8 CHỈ phủ Ch I–III tập 1** (đơn thức – đa thức · hằng đẳng thức · phân tích nhân tử). Mọi câu Đại thuộc Ch V (dữ liệu và biểu đồ) · VI (phân thức đại số) · VII (phương trình bậc nhất, lập phương trình, hàm số bậc nhất) · VIII (xác suất) · X (hình chóp) ⇒ `dang=—` + `chac=—` + lí do mở bằng `THIẾU DẠNG: <tên>`. **Dùng đúng TÊN dạng trong đề xuất của Thùy chờ duyệt** `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\ban-do-moi-k8-hk2-de-xuat.md` (§2–§6; ví dụ `THIẾU DẠNG: Vẽ đồ thị y = ax + b`, `THIẾU DẠNG: Hai đường thẳng song song, cắt nhau, trùng nhau; tìm m`, `THIẾU DẠNG: Rút gọn biểu thức; chứng minh B = …`) để sau khi duyệt bản đồ máy phân lại được; **KHÔNG tự thêm dạng vào bản đồ**, đề xuất đó chỉ để lấy tên. Đừng ép câu HK2 vào dạng Ch I–III (phân thức ≠ đa thức).
- **Hình K8**: câu hợp bài `HH00058–HH00066` / `HH00111` (tứ giác), `HH00142` (Thalès) · `HH00143` (đường trung bình) · `HH00144` (phân giác) thì gán; **tam giác đồng dạng · Pythagore · mọi câu Hình khác của học kì II ⇒ `HH08000000`** (bài chờ; Thùy sẽ dựng bài chờ riêng sau khi duyệt bản đồ — không treo THIẾU DẠNG cho Hình). Hình chóp (tính diện tích xung quanh, thể tích) là Đại: `kho=dai` + `THIẾU DẠNG: Hình chóp …`.
- ⚠️ **Mốc kiến thức: luật Khối 8 "Giữa kì II" [K8-40] của spec (luật TẠM 21/11) — đọc kỹ và ÁP.** Phạm vi = Tập 1 trọn + phần Tập 2 mà CHÍNH ĐỀ kiểm tra (dùng tới đâu đề chạm tới đó). **Cuối kì II chưa có luật riêng: ÁP [K8-40] theo phép tương tự cho cả Ch VI–X (CKII thường ôn trọn Tập 2: phân thức, PT bậc nhất, lập PT, hàm số, xác suất, đồng dạng, Pythagore, hình chóp — đề chạm tới đâu thì được dùng tới đó, bài sau trong năm cấm); chỗ nào luật chưa phủ mà bạn phải chọn quy ước ⇒ ghi `## GHI CHÚ CHO NGƯỜI DUYỆT`.** Hình đề không nói "nhọn" ⇒ thử toạ độ cả cấu hình tù (như K9; thêm "nhọn" vào đề + Ghi chú nếu cấu hình tù suy biến).
- **Bộ sách:** đề ghi CTST / Cánh Diều (không phải KNTT) ⇒ [K8-38]. Đề ghi nhiều mã đề cùng trường: soạn nguyên từng mã (một tệp soạn, các phần `PHẦN` theo mã đề) trừ khi tệp bộ nhiều đề cần tách (ghi cuối tệp). Hướng dẫn chấm in kèm là nhân chứng, KHÔNG phải nguồn chép (§A4): tự giải trước.
- Phân kho: câu hình học `kho=hinh_hoc`; còn lại (thống kê, xác suất, hàm số, phân thức, phương trình, hình chóp) `kho=dai`. Không `hgt` (K8 không có).
- Loại câu K8: Đúng/Sai nhập `tu_luan` (mục Khối 8 "Loại câu" [K8-21]).
- Ảnh hình đề: nguồn hình theo §A8 (gốc ổn ⇒ cắt từ `goc.pdf`, vào `img\`, ghi `**Hình:** <tệp> | nguon=goc`; tệ ⇒ vẽ lại bằng code, `nguon=ve_lai:<a–f>`). Mở ảnh kiểm từng hình. Biểu đồ (cột, tròn, tranh, đoạn thẳng) và đồ thị hàm số = hình đề; bài yêu cầu vẽ đồ thị / biểu đồ ⇒ vẽ hình giải [K8-33].

## Bảng đề

| MA | Kì | Trường · năm học | Trang đề | Trang đáp án | Lớp chữ | Ghi chú |
|---|---|---|---|---|---|---|
| B065-14 | GKII | truong ban mai school · 2024–2025 | 1-3 | 4-9 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B065-15 | GKII | truong thcs chuong duong · 2024–2025 | 1-2 | 3-5 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
