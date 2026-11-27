luat: 0758dd9ab51b

# BRIEF KIỂM — khối 8 (cắt từ spec-giai-bai.md, KHÔNG sửa tay)

> VAI: **TRẠM KIỂM (Opus)**. Làm theo spec §C5 + §C2 trạm 6: Pha 1 giải mù phần được giao TRƯỚC khi mở bản soạn → Pha 2 soát → chạy cổng → biên bản có dòng `KẾT LUẬN:`.
> Mã luật hiện hành: `0758dd9ab51b` — tệp soạn mang mã khác ⇒ KẾT LUẬN: CHƯA ĐẠT (soạn theo luật cũ).

## ĐẦU RIÊNG CỦA BATCH

# ĐẦU RIÊNG BATCH B066 — K8 HỌC KÌ II (đề thi GKII / CKII Hà Nội) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B066-NN`. Danh sách: `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B066\ds-de.json` — mỗi mục có `ky` (GKII / CKII), `don_vi` (tên trường viết tạm từ tên tệp, KHÔNG dấu — đọc tên thật trên đề), `nam` (năm đầu năm học), `de` / `hd` (trang đề / trang đáp án trong PDF gốc, DÒ TỰ ĐỘNG ⇒ bạn kiểm lại bằng ảnh trang), `co_chu` (false = SCAN: gõ lại từ ảnh).
- `<LV>` = `C:\Users\Admin\bk-kho-lam-viec\de-thi\toanmath\B066\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to chỗ không chắc: spec §A11.
- Tệp soạn: `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B066\<MA>.soan.md`. Tên đề: `Đề kiểm tra <giữa học kì 2 | cuối học kì 2> Toán 8 năm <năm học> — <trường (phường/quận)> (<mã đề>)` (cột Kì: GKII = giữa, CKII = cuối); `nam:` = năm đầu năm học; `bo_sach:` theo bìa đề (KNTT / CTST / CD…; đề không ghi ⇒ KNTT).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B066/<MA>.soan.md --lam-viec "C:/Users/Admin/bk-kho-lam-viec/de-thi/toanmath/B066/<MA>" --khoi 8 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B066`. Trạm không tự chạy.

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
| B066-01 | GKII | truong thcs gia quat · 2024–2025 | 1-2 | — | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-02 | GKII | truong thcs ly son · 2024–2025 | 1-7 | — | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-03 | GKII | truong thcs phuc loi · 2024–2025 | 1-4 | 5-16 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-04 | GKII | truong ban mai school · 2025–2026 | 1-3 | 4-10 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-05 | GKII | truong thcs chuong duong · 2025–2026 | 1-2 | 3-4 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-06 | GKII | truong thcs khuong thuong · 2025–2026 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-07 | GKII | truong thcs mai dich · 2025–2026 | 1-2 | 3-8 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-08 | GKII | truong thcs nghia tan · 2025–2026 | 1-6 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-09 | GKII | truong thcs ngoc lam · 2025–2026 | 1-10 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-10 | GKII | truong thcs phan chu trinh · 2025–2026 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-11 | GKII | truong thcs phan dinh giot · 2025–2026 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-12 | GKII | truong thcs phuong liet · 2025–2026 | 1-1 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-13 | GKII | xa dong anh · 2025–2026 | 1-1 | 2-5 | chữ | trang đề/đáp án dò tự động — trạm kiểm lại |
| B066-14 | GKII | truong luong the vinh · 2024–2025 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B066-15 | GKII | truong thcs cau giay · 2024–2025 | 1-2 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |

---

# PHẦN A — LUẬT CHUNG (mọi khối, mọi phần)

## A1. Bảy nguyên tắc (Thùy 15/11)

1. **Mỗi khối một bộ luật**: lý thuyết nền · phạm vi kiến thức được dùng · sai lầm cần tránh. Có luật chung (Phần A) và luật riêng theo khối × phần kiến thức (Phần B).
2. **Mỗi lần giải phải đọc lại luật.** Không giải theo trí nhớ của phiên trước. Tệp soạn ghi mã phiên bản luật đã đọc ở dòng đầu (§C4).
3. **Phân dạng TRƯỚC, giải SAU.** Giải là để ra lời giải theo đúng phương pháp của dạng, nên phải biết dạng trước.
4. **Đọc lý thuyết + ví dụ của dạng đã phân rồi mới giải.** Lời giải dùng đúng phương pháp, ký hiệu, mức kiến thức của dạng đó.
5. **Sonnet giải. Opus kiểm một phần** (§C5).
6. **Câu đủ điều kiện "chắc" thì vào kho luôn; câu chưa chắc phải qua duyệt** (trưởng khối). Thùy chấp nhận một tỉ lệ lỗi và hậu kiểm: câu lỗi bị xoá + báo ⇒ thành một dòng ở Phần D.
7. **Giải một loạt tài liệu: đọc luật MỘT lần rồi giải cả batch.** Một batch = một khối, một loại kì / một cuốn sách.

## A2. Phạm vi kiến thức

- Lời giải **chỉ dùng kiến thức của chủ đề đó và các chủ đề đứng trước** trong chương trình của khối (gồm mọi khối dưới). Mốc cụ thể từng khối, từng kì: Phần B.
- Đề kiểm tra tới đâu thì dùng tới đó: đề giữa kì I không dùng công cụ của kì II. Công cụ vượt mốc mà đề buộc phải dùng ⇒ vẫn giải, treo `**Chưa chắc:**`.
- Khối nâng cao (4T, 5T, 8T): theo mục riêng của khối ở Phần B.
- Không ghi "(như VD 8.1 của sách)" hay trỏ về tài liệu gốc trong lời giải — học sinh không có tài liệu đó.

## A3. Phân dạng (làm trước khi giải)

- Đọc **đủ** mô tả + lý thuyết + ví dụ của từng dạng ứng viên rồi mới gán (Thùy 02/11). Chỉ đọc tên dạng mà gán = sai luật.
- Truy vấn bản đồ **ngay đầu batch**, không dùng danh sách lấy từ phiên trước (13/09: bản đồ đổi giữa chừng làm ~60 câu lệch dạng).
- Xếp theo **KIỂU BÀI**: đề cho gì, hỏi gì, giải bằng phương pháp gì — đối chiếu mô tả + ví dụ của dạng. Không xếp theo từ khoá bề mặt. Đọc kỹ dòng **"Lưu ý"** trong mô tả dạng (ranh giới Thùy ghi ở đó).
- **Dạng sau thắng** (Thùy 22–23/10): câu hợp hai dạng / hai nhóm ⇒ xếp vào dạng đứng SAU trong bản đồ, **vẫn mức `cao`** (không hạ `vua` chỉ vì hai dạng cùng hợp). Ngoại lệ duy nhất: nguồn ghi rõ dạng.
- **Câu nhiều cách giải**: chỉ cần MỘT cách giải thuộc một dạng là câu vào được dạng đó; hai dạng cùng có cách hợp lệ ⇒ dạng sau thắng.
- Câu **"chọn mệnh đề / khẳng định đúng"**: dạng quyết bởi phương án ĐÚNG, không bởi phương án nhiễu. Câu nhiều ý: theo ý trọng tâm / phần lớn các ý; các ý rải ≥ 2 dạng khác hẳn ⇒ `vua`.
- Đề phụ thuộc hình mà HÌNH đủ số liệu ⇒ vẫn `cao`; chỉ hạ `vua` khi hình thiếu / không đọc được.
- Mức chắc: **`cao`** = khớp rõ đúng một dạng (sau khi áp "dạng sau thắng") · **`vua`** = còn dạng khác hợp lý, đề thiếu / lỗi, câu trộn dạng · **trống** = không dạng nào khớp, lý do mở đầu bằng đúng một nhãn:
  `THIẾU DẠNG: <tên nên có>` | `KHÔNG THUỘC CHỦ ĐỀ: <chủ đề thật>` | `THIẾU HÌNH: …` | `ĐỀ LỖI: …`. **Gán sai ở mức `cao` là lỗi nặng nhất** (mức cao tự vào kho) — thà `vua` / trống.
- Mã dạng phải có trong bản đồ, chép đúng — không bịa mã. Mỗi câu ghi: mã dạng · mức chắc · một dòng lý do (≤ 25 từ). **Không khớp rõ dạng nào ⇒ để trống** (câu vào dạng chờ của khối, đi làn duyệt) — không ép, không đoán (CLAUDE.md §1.5).
- Không khớp dạng nào nhưng thấy lặp lại nhiều câu cùng kiểu ⇒ ghi **đề xuất dạng mới** (tên · mô tả · câu làm chứng · dạng gần nhất · vì sao không gộp) cho trưởng khối; không tự thêm vào bản đồ.
- **Câu Đúng/Sai**: không gán dạng cho cả câu lẫn từng ý — gán **chủ đề** (kho Đúng/Sai cấp chủ đề, Thùy 18/10). Đọc lý thuyết của chủ đề trước khi giải.
- **Hình**: "dạng" = bài học / mô hình (Phần B, mục Hình).
- Dạng chưa có lý thuyết ⇒ vẫn gán được, nhưng câu **không** được coi là "chắc" (§C6).

## A4. Giải

- Giải theo **phương pháp của dạng** (lý thuyết + ví dụ của dạng) và luật khối. Không theo thói quen của model.
- **Có đáp án / hướng dẫn chấm in kèm ⇒ vẫn TỰ GIẢI TRƯỚC**, sau đó mới mở bản in để đối chiếu. Bản in là nhân chứng, không phải nguồn chép. Lệch ⇒ tính lại bằng máy; bản in sai thì giữ kết quả đúng + `**Ghi chú:**`.
- **Bài nhiều ý dùng lại kết quả ý trước** ("theo câu a)") — không chứng minh lại từ đầu. Chuỗi bài cùng mô hình cũng vậy: giải theo thứ tự, bài sau dùng kết quả bài trước.
- **Thử lại mọi đáp số bằng script** (tính độc lập với lời giải: thay ngược, vét cạn, toạ độ số). Đọc lại lời giải rồi tự gật không tính là thử.
- **Đề sai** (Thùy 24/10): giải bình thường THEO ĐỀ IN, ghi `**Ghi chú:** đề sai …`. Chỉ sửa chữ của đề khi lỗi in HIỂN NHIÊN (+ Ghi chú). Không tự thêm câu hỏi, tự chọn giá trị, đổi số liệu, giải "bản sửa".
- **Hai phương án trắc nghiệm cùng đúng / in trùng** ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10). **Không phương án nào đúng** ⇒ giữ nguyên văn, ghi đề sai, treo `**Chưa chắc:**` — không thay phương án, không "chọn gần nhất".
- **`**Chưa chắc:**`** chỉ dùng khi thật sự có hai cách hiểu hợp lý, vượt phạm vi kiến thức, hoặc không thử lại được. Câu có cờ này luôn đi làn duyệt.
- Text của đề mâu thuẫn hình vẽ ⇒ thử cả hai cách đọc, chọn cách cho bài toán có nghĩa (thường là hình), ghi lại; không tự sửa dữ liệu gốc trong DB.

## A5. Trình bày lời giải

- **Hai phần**: `**Phần 1. Hướng dẫn**` (mấu chốt · các bước nghĩ · chú ý bẫy) và `**Phần 2. Trình bày**` (đúng cái học sinh viết vào bài). Mọi câu đủ hai phần, kể cả trắc nghiệm.
- **Phần 1 dạng card**: `**Mấu chốt:**` một câu → các đoạn `**Bước 1.**` `**Bước 2.**`… → `**Chú ý:**` nếu có.
  **3–6 bước mỗi bài**, mỗi bước một ý trọn vẹn có động từ (≥ 5 chữ ngoài công thức), là bước NGHĨ chứ không chép dòng tính của Phần 2; không bịa bước "Đọc kĩ đề"; không ghi đáp số cuối trong các bước. Dòng trống là ranh giới card.
- **Câu Hình có ý chứng minh ⇒ thay Phần 1 bằng khối `**Sơ đồ tư duy**`** (Thùy 14/11) — khuôn ở §A6.
- **Dòng — cái HỌC SINH THẤY** (Thùy 15/11, Đại và Hình như nhau): mỗi câu lời giải / mỗi phép biến đổi một dòng, các dòng **LIỀN nhau, không có dòng trống xen giữa**;
  chỉ có khoảng cách trước ý `b)`, `c)`, `d)`, giữa các card, giữa Phần 1 và Phần 2. Hình muốn thoáng hơn ⇒ **khoảng cách dòng +20%** ở giao diện; không làm được thì hiện như Đại.
  Luật "giãn dòng" Hình 27/10 đã BỎ (giữ luật dòng ngắn + căn cứ `(gt)` / `(cmt)`).
- **Dòng — cái ghi trong TỆP SOẠN**: mỗi dòng lời giải là một đoạn, các đoạn cách nhau **một** dòng trống (đó là dấu ngắt đoạn cho máy tách card / khúc sơ đồ, không phải khoảng cách hiển thị — màn hình tự gộp liền dòng).
  Không để hai dòng trống liền nhau. Đề bài: không dòng trống trừ trước ý `a)`… và các phương án.
- Phần 2 của bài tính mở bằng dòng chép lại đề.
- **LaTeX**: `\dfrac` (không `\frac`) · nhân `\times` (THPT theo mục khối) · chia `:` · số không chèn dấu cách hàng nghìn · mỗi công thức một cặp `$…$` riêng · góc `\widehat{ABC}` · `\perp` · `\parallel` · `\overline{abc}` không `\text`.
  Đáp án trả lời ngắn là biểu thức ⇒ bọc `$…$`. Không dùng `\(…\)`. Không in nghiêng bằng `*…*` (app không hiện).
- **Lý thuyết / ví dụ ghi vào bản đồ** đúng thẻ `##ĐL / ĐN / TC / CY / PP / VD` của `spec-ban-do-toan.md`. Lý thuyết nhóm và dạng KHÔNG chứa ví dụ — ví dụ (`##VD`) chỉ ghi ở ô ví dụ của dạng.
- **Viết tệp có LaTeX bằng công cụ ghi file (Write/Edit)** — không heredoc, không `node -e`, không chuỗi JS (`\t` `\f` `\n` `\b` thành ký tự điều khiển, `\perp` thành `perp`).
  Script ghép / thay nội dung có LaTeX: **cấm `String.replace(x, chuỗi)`** — trong chuỗi thay, `` $` `` `$'` `$&` là lệnh chép đoạn (15/11: spec bị nhân thành 27.578 dòng). Dùng cắt + nối (`slice`) hoặc `replace(x, () => chuỗi)`.

## A6. Sơ đồ tư duy — câu chứng minh Hình (Thùy 14/11)

- Sơ đồ là **thuộc tính riêng của câu**, lưu tách khỏi lời giải (bảng `hinh_hoc_cau_so_do`), học sinh bấm mới xem. Lời giải chỉ còn Phần 2, chia khúc theo sơ đồ.
- Ô = **mốc trung gian** (kết luận bộ phận), không phải từng dòng trình bày; ô cuối mỗi ý = điều đề hỏi. Ý tính trong cùng câu cũng thành ô.
- Khuôn trong tệp soạn:
  ```
  **Sơ đồ tư duy**

  **Mấu chốt:** <ý then chốt — đường phụ, chọn cặp tam giác nào, vì sao>

  - n1 | a | $ME\parallel AC$ | gt | $ME$ là đường trung bình của $\triangle ABC$
  - n2 | b | $AEMF$ là hình bình hành | n1, gt | $AE\parallel MF$ và $ME\parallel AF$

  **Phần 2. Trình bày**

  a)

  [[so-do:n1]]

  Xét $\triangle ABC$ có: …
  ```
  Mỗi dòng ô: `khoá | ý | mốc | từ (khoá ô đứng trước và/hoặc gt) | lý do`. Mỗi ô đúng một khúc, đúng thứ tự; khúc mở bằng dòng riêng `[[so-do:nK]]`;
  dòng ý `a)` đứng một mình; không chữ nào của Phần 2 nằm ngoài khúc; bỏ các tiêu đề con kiểu "Bước 1: chứng minh…".
- Trạm kiểm xét: mỗi ô là mốc thật · "từ" đúng (ô thật sự dùng ô nào) · khúc chứng minh đúng mốc của ô.
- Câu Hình chỉ tính / trắc nghiệm / trả lời ngắn, và mọi câu Đại: giữ Phần 1 như §A5.

## A7. Tách ý và cấu trúc đề

- **ĐỀ giữ cấu trúc gốc** (Thùy 13/10): Bài 2 có 4 ý a–d thì trong đề vẫn hiện một Bài 2 đủ 4 ý.
- **KHO Đại**: chỉ tách bài **"Tính / thực hiện phép tính"** và **"Tìm $x$"** nhiều ý — mỗi ý một câu. Bài toán lời văn giữ chung một câu, Phần 2 ghi a) b).
- **KHO Hình**: theo mô hình **bài – ý** (Thùy 09/11): bài giữ nguyên, ý là dòng con; hình đề gắn vào BÀI. Chi tiết: Phần B mục Hình.
- **Đúng/Sai đủ 4 ý a–d**; mỗi ý có đáp án và lời giải riêng.
- Đáp số là một số vừa 4 ô ⇒ `tra_loi_ngan` — **áp cả khi câu nằm ở phần tự luận của đề** (thống nhất 15/11; trước đó K10 và K11 làm lệch nhau).

## A8. Hình vẽ, sơ đồ

- AI viết **mô tả có cấu trúc / mã vẽ**, máy render; không để AI vẽ điểm ảnh. Số liệu ⇒ kích thước thật, máy tự kiểm.
- Hình dựng **đúng dữ kiện đề bằng toạ độ**; hình của đề **không vẽ sẵn điều phải chứng minh / đáp án**.
- ⭐ **NGUỒN HÌNH ĐỀ — DÙNG LẠI ẢNH GỐC hay VẼ LẠI** (Thùy 15/11 — thay luật 13/10 "câu Hình học luôn vẽ lại", áp MỌI khối, mọi kho):
  1. **Ảnh gốc ỔN ⇒ GIỮ NGUYÊN** (cắt sạch từ tài liệu: chừa biên trắng nhỏ, đúng câu, đủ nhãn).
  2. **Ảnh gốc QUÁ TỆ ⇒ VẼ LẠI bằng code.** "Quá tệ" = có ít nhất một lỗi sau (ghi đúng mã):
     `a` không đọc chắc nhãn / số / ký hiệu ở cỡ hiển thị trên app · `b` cụt, thiếu phần hình, dính chữ câu khác hoặc lời giải ·
     `c` lộ đáp án / điều phải chứng minh (vẽ sẵn, ghi đáp số, vết khoanh / viết tay) · `d` vênh dữ kiện đề (tên điểm, số đo, vị trí) ·
     `e` scan méo / nghiêng / nền bẩn / vùng tô thành khối đen / chữ chìm che hình · `f` nhiều hình dính nhau, không tách được hình của câu.
     **Không phải "tệ"**: xấu, nét mảnh, khác phong cách hình code, hình GeoGebra có màu — vẫn GIỮ.
  3. **Có LỆNH VẼ LẠI** (Thùy / trưởng khối; theo câu, đề, bài hoặc cả khối) ⇒ vẽ lại dù ảnh gốc ổn.
  4. **Mỗi hình đề mang nhãn nguồn** — trong tệp soạn: `**Hình:** <tệp> | nguon=<goc | ve_lai:<mã a–f> | ve_lenh | ve_moi>`
     (`ve_moi` = đề không có hình, vẽ thêm để minh hoạ). Thiếu nhãn ⇒ trạm kiểm trả lại. Hình lời giải (`**Hình giải:**`) luôn là hình code, không cần nhãn.
  5. Vẽ lại vẫn GIỮ ĐỦ thông tin của ảnh gốc mà đề cần (luật "Vẽ lại" ở Hình chung). Không vẽ lại được cho đúng ⇒ giữ ảnh gốc + `**Chưa chắc:**`. Ảnh cũ bị thay không xoá (lưu URL cũ).
  6. Trạm kiểm xem từng hình đề: nhãn `goc` mà thấy lỗi a–f ⇒ đổi thành vẽ lại; nhãn `ve_lai` mà gốc thật ra ổn ⇒ trả về `goc` (đỡ công vẽ, đỡ sai).
  - Đếm theo khối: §C12.
- Vẽ xong ⇒ **đẩy lên kho ngay** (Thùy 13/11) — máy làm việc chỉ là bản tạm.
- Đọc đề từ **ảnh trang phóng to** — lớp chữ PDF hay mất ký hiệu, ngoặc, số mũ.
- Chi tiết vẽ hình Hình học: Phần B mục "Hình — luật chung".

## A9. Theo loại nguồn

- **Đề thi / đề cương**: một đầu vào → hai đầu ra: câu vào kho + đề lưu cấu trúc (`tai_lieu` đề thi) dùng được ngay trên app. Cấu trúc đề: `spec-kho-cau-hoi.md` §11.
- **Sách tham khảo** (Thùy 27/10): **ví dụ hướng dẫn → KHO TRÊN LỚP** (vai giảng), **bài tập → KHO VỀ NHÀ** (kho câu luyện). Một câu không vào cả hai. Khối / nhánh chưa có kho trên lớp ⇒ để riêng ví dụ, báo.
- **Bài học Hình từ Word bài giảng**: ra đủ bài + lý thuyết + câu + hình; lý thuyết của bài chính là phạm vi kiến thức của bài.
- **Trùng kho**: đo trùng TRƯỚC khi giải; câu trùng trỏ về câu cũ, không đẻ bản sao. Một đề không nhập từ cả hai nguồn Word và PDF (LaTeX hai nguồn khác nhau nên máy không nhận ra trùng).

## A10. Khuôn tệp soạn (`.soan.md`)

- **Dòng đầu**: `luat: <mã phiên bản>` (§C4) — chép từ dòng đầu brief. Cổng chưa kiểm mã (nợ §C10.4); trạm kiểm đối chiếu tay: mã khác mã hiện hành ⇒ CHƯA ĐẠT.
- **Đầu tệp**:
  ```
  # ĐỀ | <tên đề> — <trường / đơn vị> (<mã đề nếu có>)
  nam: <năm đầu năm học>
  bo_sach: <KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <số phút ghi trên đề>      (đề thi; đề cương bỏ dòng này)
  kieu: de_cuong                              (chỉ đề cương / phiếu ôn)
  ```
  `nam` và `bo_sach` đọc từ ảnh đề (tên trường, năm in trên đề, nội dung các câu), không lấy từ tên tệp. Không đoán được bộ sách ⇒ `KNTT` + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`. Tên đề cụ thể từng khối: Phần B.
- **Phần**: `## PHẦN <n> | <tên phần như đề in> | <trac_nghiem | dung_sai | tra_loi_ngan | tu_luan>`. Mỗi vùng in riêng (mỗi "ĐỀ SỐ", mỗi phần, mỗi chương) = một PHẦN; chỉ khai PHẦN thật có câu.
- **Dòng câu**:
  ```
  ### <nhãn> | kho=<dai|hinh_hoc|hgt> | loai=<trac_nghiem|tu_luan|tra_loi_ngan|…> | dap_an=<…> | dang=<mã NDB…/NCD…/HH… | —> | chac=<cao | vua | —>
  ```
  Đủ các trường, đúng thứ tự. `dang` = mã dạng (Đại) / bài đích (Hình) / chủ đề (câu Đúng/Sai) đã phân ở §A3; không khớp ⇒ `—`. `chac` = mức chắc của việc phân dạng; `dang=—` thì `chac=—`. **Trường `dang` / `chac`: cổng chưa đọc, nợ code §C10.6** — cho tới khi xong, vẫn ghi để trạm kiểm và điều phối đọc.
- **Nhãn câu**: giữ ĐÚNG cách đánh số của bản in (`Câu 3`, `Bài 2a`, kể cả tiền tố "Dạng 2 Bài 3a", "Đề 1 Bài 2"); duy nhất trong tệp; trạm kiểm không đổi nhãn. Ý tách theo §A7 mang nhãn `Bài 2a`, `Bài 2b`… (đề không ghi a b thì tự đánh theo thứ tự đọc — đề in 2 cột thì đọc theo HÀNG). "Bài" gom 2 bài toán khác hẳn ⇒ `Bài 4.1`, `Bài 4.2`.
- **Thân câu, đúng thứ tự**:
  1. `**Đề:**` — nguyên văn (đã sửa lỗi in hiển nhiên), xuống dòng đơn; bỏ "(0,5 điểm)", "(1 điểm)"; ô trống viết `…`. Câu tách ý: đề = lời dẫn của bài + đúng ý đó, tự đủ nghĩa.
  2. Phương án (nếu có).
  3. Các dòng tuỳ chọn, mỗi loại MỘT dòng: `**Hình:** <tệp> | nguon=<goc | ve_lai:<a–f> | ve_lenh | ve_moi>` (nhãn nguồn §A8 — cổng báo sai khuôn, nhắc khi thiếu) · `**Hình giải:** <tệp>` · `**Ghi chú:** …` · `**Chưa chắc:** …`.
  4. `**Phần 1. Hướng dẫn**` (hoặc `**Sơ đồ tư duy**` — §A6).
  5. `**Phần 2. Trình bày**`.
- **Cuối tệp**: `## GHI CHÚ CHO NGƯỜI DUYỆT` — câu không nhập + vì sao, bộ sách đoán theo nội dung, phạm vi kiến thức đã áp; không có gì ⇒ ghi `Không`.
- **Khuôn từng loại câu**:
  - **Trắc nghiệm**: đủ 4 dòng `A. ` `B. ` `C. ` `D. ` (phương án là hình ⇒ vẫn 4 dòng, mỗi dòng mô tả hình); `dap_an` = một chữ cái. Giải RA kết quả rồi đối chiếu, loại phương án bằng LÍ DO, không thử từng phương án (trừ bài bản chất là thử chọn). Câu "tìm khẳng định SAI" ⇒ nêu vì sao từng phương án đúng / sai. Dòng cuối Phần 2 đúng là `Chọn X.` (X trùng `dap_an`). Đề chỉ có 2–3 phương án ⇒ giữ như in + `**Ghi chú:**`, không bịa phương án.
  - **Đúng/Sai (khuôn THPT)**: 4 ý a–d; `dap_an` = chuỗi 4 chữ `D`/`S` theo thứ tự (vd `DSSD`); Phần 2 xét từng ý, mỗi ý kết "Đúng." / "Sai." kèm lí do. Thiếu ý trên ảnh ⇒ giữ câu, `**Chưa chắc:**`. Khối THCS nhập Đúng/Sai dạng `tu_luan`: theo mục khối.
  - **Trả lời ngắn**: một số, thập phân dùng DẤU PHẨY (mọi đường vào kho — Thùy 17/11), đếm cả dấu `-` `,`, tối đa 4 ô (§A7); `dap_an` là số thuần, không bọc `$`; đúng đơn vị đề hỏi. Vượt ⇒ `tu_luan` + `**Ghi chú:**`.
  - **Tự luận**: có MỘT kết quả gọn (số, biểu thức, $x=…$, tập nghiệm) ⇒ ghi vào `dap_an`; chứng minh / giải thích / quan hệ hình ⇒ `dap_an=—`.
- **Đề cương dài** (> ~120 câu): điều phối chia **khúc theo trang** (Thùy 14/11): khúc N = trang a–b ⇒ làm mọi câu / bài **BẮT ĐẦU** trong trang a–b (bài tràn sang trang sau làm trọn); bài bắt đầu trước trang a thuộc khúc trước.
  Tệp khúc `<MA>.k<N>.soan.md` (kiểm: `.k<N>.kiem.md`, `.k<N>.soat.md`, `.k<N>.soan.goc.md`), đủ dòng đầu tệp như thường; khúc bắt đầu giữa một mục ⇒ PHẦN đầu ghi `<tên mục> (tiếp)`;
  ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT` "Khúc N từ <nhãn đầu> đến <nhãn cuối>"; hình tiền tố `k<N>_`; script nháp trong `tam\k<N>\`. Mọi khúc ĐẠT ⇒ `ghep-khuc.mjs` ghép thành `<MA>.soan.md`. Nhãn duy nhất trên TOÀN đề.
- **Ký hiệu trong tệp**: hệ `\begin{cases}…\end{cases}` viết trên một dòng; không bảng Markdown, không emoji trong đề và lời giải.

## A11. Đọc đề từ ảnh

- **Ảnh trang là NGUỒN CHÍNH.** Lớp chữ PDF, bản máy gõ (`de.json`), Word chuyển đổi hay mất số mũ, dấu trừ, phân số, ngoặc, sót / gộp câu ⇒ lệch thì **ảnh đúng**.
- **Không đọc chắc thì phóng to, không đoán**: `pdftoppm -r 300 -f <tr> -l <tr> -x <X> -y <Y> -W <rộng> -H <cao> -png -singlefile goc.pdf <ra>` (toạ độ ×2 so với ảnh 150 dpi; ký hiệu chia hết, số mũ rất nhỏ ⇒ 400 dpi). Vẫn không đọc được và hai cách đọc cho đáp số khác nhau ⇒ `**Chưa chắc:**`.
- **Bẫy đọc hay gặp** (mọi khối): số mũ nhỏ ($10^2$ / $10^3$) · dấu trừ trước phân số ($(-2)^3$ ↔ $-2^3$) · hỗn số $2\dfrac{8}{9}$ đọc thành $2-\dfrac{8}{9}$ hoặc thành tích · "không chia hết" ↔ "chia hết" · $\in$ ↔ $\notin$ · `.` nhân ↔ `,` thập phân · gạch trên $\overline{abc}$, chu kì · dấu `|` · căn dài ngắn · chỉ số góc $\widehat{A_1}$ · tên điểm ("AN" ↔ "AB") · "l" ↔ "1" · chữ Kirin "а)" lẫn "a)" Latin trong Word.
- **Chỉ trang ĐỀ là đề**: bỏ hướng dẫn chấm (dùng làm nhân chứng), ma trận / bản đặc tả, trang trắng, quảng cáo, ô họ tên, khung điểm. Vết viết tay, khoanh đáp án, dấu ✗ của học sinh trên ảnh: bỏ qua.
- **Trạm GÕ / CHÉP đề không sửa đề**: gõ đủ và đúng từng chữ, số, ký hiệu như in — đề in lỗi vẫn gõ như in + cảnh báo. **Trạm SOẠN / KIỂM mới sửa** lỗi in hiển nhiên + `**Ghi chú:**` nêu nguyên văn chỗ in + lí do (§A4).
- Đề không có tệp gốc dạng chữ (scan, đề cương chụp) ⇒ gõ lại từ ảnh, rồi một model KHÁC đối chiếu ảnh **trước** khi soạn (người gõ ≠ người đối chiếu).
- Có cả Word và PDF: lấy đề từ một nguồn (§A9), đối chiếu từng câu với nguồn kia; Word chép sai so với PDF (mất phân số, đảo chữ số) ⇒ sửa theo PDF. PDF có hình / bảng mà Word thiếu ⇒ bù.
- Câu vắt hai trang ⇒ dựng đủ cả hai ảnh; dựng dư một trang sau trang cuối của khu (lời giải hay tràn).

## A12. Thử đáp số bằng máy

- Bổ sung §A4 ("thử lại mọi đáp số bằng script"):
  - **Bộ kiểm viết TỪ ĐỀ, trước khi đọc lời giải** — không chép phép tính của lời giải vào script.
  - Script tạm tạo bằng Write vào thư mục tạm của batch — không heredoc, không `node -e` chứa `\` hay dấu huyền. Phân số, số lớn ⇒ BigInt.
  - Không viết hàm kiểm rỗng trả "đạt". Kiểm không được ⇒ ghi cờ `khong_kiem_duoc` thật (câu đó không có nhân chứng máy ⇒ Opus giải mù, §C5).
  - Không báo "đã thử lại" khi chưa chạy script.
- **Cách thử theo loại bài**:

| Loại | Thử |
|---|---|
| Tính, rút gọn, phân tích nhân tử, hằng đẳng thức | thay ≥ 5 bộ số hữu tỉ ngẫu nhiên vào hai vế (BigInt); so cả chuỗi `a=b=c` từng dòng Phần 2 |
| Phương trình, tìm $x$ | thay ngược vào đề + quét nghiệm (hữu tỉ / lưới) để bắt SÓT nghiệm |
| Nghiệm nguyên, số chính phương, chia hết | vét cạn trên khoảng đủ rộng; thử $n$ trên đoạn dài, kể cả biên, số âm, $n=0$ |
| Bất đẳng thức | lưới + ≥ 2000 bộ ngẫu nhiên (chỉ BÁC được, không chứng minh được) + kiểm điểm dấu bằng |
| GTLN / GTNN | lưới số + kiểm giá trị đạt tại điểm dấu bằng |
| "Luôn dương", "không phụ thuộc biến" | bắt buộc chạy máy (lỗi in đề chỉ lộ ở đây) |
| Đếm | vét cạn; kết quả ≤ 12 thì liệt kê thật |
| Hình | toạ độ số (Phần B, mục "Hình — luật chung", phần Giải) |
| Lời văn, thực tế | tính lại từ dữ kiện đề, kiểm từng khả năng biên |

- Máy KHÔNG bắt được: lỗi phạm vi kiến thức (đáp số vẫn đúng), dùng ngầm công cụ cấm, thiếu nghiệm khi chỉ thay ngược ⇒ trạm kiểm đọc từng câu.
- Bộ kiểm có sẵn của từng khối (`k4T-kiem.mjs`, `k5T-kiem.mjs`, `k6-kiem.mjs`, `k8-kiem.mjs`, `k8T-kiem.mjs`…): mục Công cụ riêng của khối ở Phần B.

## A13. Trạm kiểm — Pha 0 / 1 / 2, biên bản, sao bản gốc

- **Pha 0 — đối chiếu đề**: mở ảnh gốc, kiểm bản soạn không SÓT bài / ý / phương án, chép đúng từng số, ký hiệu, đơn vị (§A11).
- **Pha 1 — giải mù**: với phần được giao ở §C5, giải từ ảnh khi CHƯA mở bản soạn; ghi bảng đáp án riêng.
- **Pha 2 — soát**: rồi mới mở bản soạn, so đáp số; soát từng câu theo các loại lỗi: chép đề · đáp số · lập luận · phạm vi kiến thức (whitelist) · định dạng · phân loại (loại câu, kho, dạng) · hình.
- **Lệch đáp số** ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
- **Sao bản gốc** `<MA>.soan.goc.md` TRƯỚC khi sửa (§C5). Chỉ sửa thẳng lỗi CHẮC CHẮN; chỗ không chắc ⇒ giữ / thêm `**Chưa chắc:**`. Cờ `**Chưa chắc:**` của trạm soạn mà trạm kiểm đã kiểm chắc ⇒ xoá, ghi vào biên bản. Phân mức khi chỉ báo, không sửa: `sai` (bắt buộc sửa) · `nen_sua` · `hoi`.
- **Biên bản** `<MA>.kiem.md` (giải mù) và `<MA>.soat.md` (soát): dòng đầu đúng `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`; bảng lỗi theo loại ở trên (số câu sửa mỗi loại); số câu khớp / lệch với đáp án in kèm (nếu có); danh sách cờ đã xoá / thêm. Không viết "đã kiểm tra kỹ".
- Chỉ ghi DB đề có biên bản `KẾT LUẬN: ĐẠT`.
- Sửa của trạm kiểm ghi vào bản soạn (sau khi đã sao gốc) hoặc tệp sửa riêng của dây chuyền (vd `.sua.json`) — không sửa đè tệp chép gốc.

## A14. Ghi chú · Chưa chắc · Lưu ý

- `**Ghi chú:**` chỉ cho: lỗi của ĐỀ GỐC (đã sửa gì, đề sai ở đâu) và điều người duyệt cần biết (quy ước hiểu đề đã dùng, điều kiện đã thêm, làm tròn — §A14). Không ghi chuyện trạm / máy ("bản máy gõ nhầm…").
- `**Chưa chắc:**` nêu lí do cụ thể trong một câu (không đọc chắc ảnh · hai cách hiểu · ngoài phạm vi không có cách trong phạm vi · chưa kiểm được bằng máy · câu khái niệm kì sau — §A14). Không giấu, không ghi tràn lan; cờ thừa ⇒ xoá.
- **Đề sai** (bổ sung §A4): ngoài `**Ghi chú:** Đề sai: …` (sai ở đâu, đúng phải là gì), thêm MỘT dòng `Lưu ý: …` ở **đầu Phần 2** để học sinh đọc thấy ngay.
- Hướng dẫn chấm in sai ⇒ `**Ghi chú:** hướng dẫn chấm ghi …, đúng là …` (§A4). Không chép nguyên văn hướng dẫn chấm làm lời giải.

## A15. Phạm vi kiến thức — bổ sung §A2

- **Dùng NGẦM cũng là vi phạm**: suy ra điều chỉ có nhờ định lí chưa học mà không gọi tên (vd "$NP\parallel BC$ vì $N$, $P$ là trung điểm" = đường trung bình; nhân thẳng thành bình phương = hằng đẳng thức) vẫn là dùng.
- Cần một kết quả chưa có trong phạm vi ⇒ **chứng minh nó ngay trong lời giải** bằng cái đã có rồi mới dùng; Phần 1 / sơ đồ nói rõ "chưa được dùng X nên tự chứng minh". Không làm được ⇒ không dùng công cụ ngoài, `**Chưa chắc:**`.
- Hướng dẫn chấm / lời giải của tài liệu KHÔNG miễn luật phạm vi — chúng hay dùng tắt công cụ ngoài mốc.
- **Giải theo bộ sách của đề**: phạm vi của một đề = những gì chính đề đó kiểm tra tới theo bộ sách trường dùng, xác định bằng cách nhìn TOÀN BỘ đề.
- **Công cụ dùng thì gọi đúng tên, đủ điều kiện** ("áp dụng bất đẳng thức Cô-si cho hai số dương …", "theo định lí Thalès trong tam giác …").
- **Không sửa dữ kiện đề cho số đẹp.**

## A16. Kỷ luật trạm soạn

- Chỉ ghi đúng tệp kết quả của mình. Không ghi DB, không commit, không xoá tệp.
- Ghi tệp nháp SỚM và cập nhật dần — không giữ bài làm trong ngữ cảnh (phiên ngắt là mất).
- Tự chạy cổng `--chi-kiem` của khối trên tệp của mình, sửa tới khi đạt rồi mới nộp.
- Tên script, thư mục tạm, thư mục hình chứa tên nhóm / trạm (nhiều trạm song song không ghi đè nhau).
- Báo cáo nộp ghi: số câu, số câu `**Chưa chắc:**`, số phép thử máy, số FAIL, đã mở ảnh hình chưa. Điều phối không tin báo cáo, tự chạy cổng (§C1).

## A17. Danh tính câu và trùng

- **Nối nhãn ↔ mã câu, đề ↔ lời giải** bằng NỘI DUNG (nhân chứng thứ hai), không bằng thứ tự / số bài. Lệch dù một câu ⇒ bỏ cả lượt nối, báo.
- **Mã câu bất biến**: xếp lại dạng, đổi nhãn hiển thị, ghép vào đề khác không cấp lại mã.
- Mã nguồn của bài trong sách kèm trang PDF (nhãn sách đánh lại từ 1, trùng, nhảy số).
- **Lọc trùng sau chuẩn hoá** (bỏ `$`, ngoặc, `\left`, dấu cách, dấu câu, dòng nguồn đề). **Giống hệt mới là trùng**; khác số, khác form, thêm ý, khác giả thiết = biến thể, giữ.
- Câu lặp nguyên văn TRONG CÙNG một đề vẫn nhập đủ ở mỗi vị trí của đề (đề phải nguyên cấu trúc); máy tự gom về một câu kho.
- **Đề nhiều mã** (chỉ đổi số / đổi thứ tự) ⇒ nhập MỘT mã (mã đầu), ghi mã vào tên đề. Hai đề cùng trường cùng năm trùng ≥ 70% câu (so sau chuẩn hoá, bỏ số) ⇒ một đề; dưới ngưỡng ⇒ hai đề.

## A18. Trình bày — bổ sung §A5

- **⭐ Hết câu là xuống dòng; xuống dòng liên tục, không viết full dòng** [22/11 · Thùy; nguyên tắc trình bày CHUNG — lời giải, lý thuyết, ví dụ, mọi khối, Đại lẫn Hình]: hết một câu (dấu chấm) ⇒ xuống dòng (xuống dòng ĐƠN, không cách dòng trống). Phần lớn dòng chỉ chiếm khoảng nửa bề ngang — khi viết, ngắt dòng liên tục: "Vì … (căn cứ)" một dòng, "nên …" dòng kế, "Mà …", "Do đó …", "Suy ra …", "Vậy …" mỗi cái đứng đầu dòng riêng, công thức kết quả dài thì để riêng một dòng. Cấm đổ cả đoạn thành một dòng dài, cấm hai câu chung một dòng. Hình còn có luật dòng ngắn chi tiết (≲ 60 ký tự, căn cứ trong ngoặc) ở mục "Trình bày (phần riêng của Hình)".
- Phần 1 không lộ đáp số cuối ở BẤT KỲ đoạn nào, kể cả `**Chú ý:**`; không có đoạn "Thử lại" trong Phần 1.
- `**Chú ý:**` là lời dặn cho HỌC SINH (bẫy, điều kiện) — không nhận xét về sách, về kho, về phân loại.
- Bài nhiều ý giữ chung một câu: các bước Phần 1 ghi "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước (gộp ý ngắn).
- **Một lời giải = MỘT cách** (cách chính của dạng). Không câu ngoài lề "(sách còn cách khác…)", "(như ví dụ … của sách)". Cách khác đáng dạy ⇒ một câu ở `**Chú ý:**`. Lời giải kho ≠ bài giảng của giáo viên.
- Khuôn Phần 2 theo loại: lời văn = câu lời giải + phép tính (đơn vị) … kết "Vậy …" / `Đáp số:` · tính / tìm $x$ = mở bằng dòng chép nguyên biểu thức, chỉ các dòng biến đổi · lập luận = "Vì … nên …" ngắn, mỗi "Vì … nên …" tự đủ lí do, kết "Vậy …".

---

---

# PHẦN B — mục của khối

---

## Khối 8

### Phạm vi kiến thức

- Chương trình **KNTT**. Nguồn: 17 file Word theo bài SGK ở `E:\BK ACADEMY\Tài liệu tham khảo\K8\` (khuôn: `I. TÓM TẮT LÝ THUYẾT` → `II. BÀI TẬP VÀ CÁC DẠNG TOÁN` ("Dạng k" + "Phương pháp giải" + cặp bài `kA`/`kB`) → `III. BÀI TẬP TỰ LUYỆN` (`16*` = nâng cao) → `HƯỚNG DẪN GIẢI – ĐÁP SỐ`); có C1, C3, C4 — Chương II không có file theo bài. Ngoài ra: bộ đề giữa kì 1, đề cương các trường Hà Nội, đề cuối kì 1 toanmath. Tài liệu Word theo bài chỉ làm phần Hình (Thùy 09/10); đề thi / đề cương làm cả Đại lẫn Hình.
- **Nguyên tắc gốc [K8-1]**: lời giải viết như HS lớp 8 viết vào vở kiểm tra, **tại đúng thời điểm học bài đó**. Được dùng chữ, số âm, luỹ thừa, `\Rightarrow`. Ranh giới là **"cấm kiến thức của bài sau"**.
- **⭐ LUẬT THỨ TỰ BÀI** (Thùy 09/10: "Đường trung bình là chương sau của Tứ giác, nên lúc làm bài Tứ giác không được dùng đường trung bình"):
  - [K8-2] Whitelist của câu = lý thuyết của CHÍNH BÀI chứa câu + mọi bài TRƯỚC (cả lớp dưới). Bài sau, chương sau = CẤM, kể cả khi dùng thì ngắn hơn.
  - [K8-3] "Lý thuyết của bài" = mục *I. TÓM TẮT LÝ THUYẾT* của file bài đó. Không có trong đó ⇒ chưa được trích dẫn như định lí, dù "hiển nhiên".
  - [K8-4] Cần kết quả chưa có ⇒ CHỨNG MINH NGAY TRONG LỜI GIẢI rồi mới dùng; hướng dẫn / sơ đồ nói rõ "bài này chưa được dùng X nên ta tự chứng minh" (trong sơ đồ: ô riêng). Mẫu đúng: C4 B1 HDG 6A, 6B (kẻ $EF\parallel AB$, chứng minh $DEFB$ là hình bình hành rồi mới suy ra $\dfrac{AD}{AB}=\dfrac{DE}{BC}$). Không chứng minh được ⇒ không dùng công cụ cấm, `**Chưa chắc:**`.
  - [K8-5] HDG tài liệu / hướng dẫn chấm KHÔNG miễn luật này (hay dùng tắt "chứng minh được NH là đường trung bình").
  - [K8-6] Câu Ôn tập chương = whitelist hết chương đó. Câu nguồn không rõ bài = whitelist tới bài muộn nhất mà đề cần.
  - [K8-7] **Dùng NGẦM cũng là vi phạm**: "$NP\parallel BC$ vì $N$, $P$ là trung điểm" = dùng đường trung bình; nhân thẳng $x^2-8x+16$ thành bình phương ở đề chưa học HĐT = dùng ngầm HĐT ⇒ nhân tường minh. Lọc từ khoá (`--cam`) chỉ là lưới thô; trạm kiểm đọc từng câu đối chiếu bảng.
- **Nền trước lớp 8 (dùng mọi bài) [K8-8]**: số hữu tỉ, số thực, căn bậc hai số học, luỹ thừa, tỉ lệ thức + dãy tỉ số bằng nhau, tìm $x$ bằng chuyển vế / thành phần chưa biết, biểu thức đại số, đa thức một biến **kể cả chia đa thức một biến cho đa thức một biến, chia có dư**; đặt thừa số chung theo tính chất phân phối; "tổng các bình phương bằng 0 thì từng số bằng 0"; ước / bội số nguyên, số chính phương (gồm 0). Hình: toàn bộ Hình 6–7 KNTT (góc, song song, tổng ba góc, góc ngoài, tam giác bằng nhau, tam giác cân, trung trực, quan hệ góc–cạnh, đường vuông góc–đường xiên, bất đẳng thức tam giác, đồng quy trung tuyến (trọng tâm, $\dfrac{2}{3}$) / phân giác / trung trực / đường cao).
- **Giữa kì I (KNTT)**: Ch I + phần Ch II đề chạm tới + phần Ch III đề chạm tới (tứ giác → HTC → HBH → HCN → thoi, vuông). Cấm ở mọi đề giữa kì I: đường trung bình (trừ đề Ngôi Sao Hoàng Mai — Hình chung), Thalès, đồng dạng, lượng giác, "phương trình – tập nghiệm", công thức nghiệm, Vi-ét, phân thức. Pythagore, HĐT, phân tích nhân tử, HCN trở lên (kể cả trung tuyến ứng cạnh huyền): chỉ khi chính đề có hỏi tới.
- **Cuối kì I**: KNTT Tập 1 = Ch I · Ch II đủ 7 HĐT + phân tích nhân tử mọi phương pháp ("$A\cdot B=0$" được dùng) · Ch III trọn · Ch IV Thalès thuận + đảo, đường trung bình tam giác, tính chất phân giác · Ch V dữ liệu, bảng, biểu đồ. Cấm: phân thức (Ch VI) · "phương trình", "tập nghiệm", hàm số – đồ thị (Ch VII) · xác suất · đồng dạng, Pythagore (Ch IX) · hình chóp · đường trung bình hình thang. Đề KNTT chạm tới mấy thứ này ⇒ dùng đúng cái đề kiểm tra + `**Ghi chú:**`. Bộ sách khác: mục Theo loại nguồn.
- **Giữa kì II (KNTT, Hà Nội) [K8-40 · luật TẠM 21/11 do điều phối lô mẫu viết trước, người duyệt mẫu sửa]**: phạm vi = Tập 1 trọn (như Cuối kì I: Ch I–V, kể cả Thalès, đường trung bình tam giác, tính chất phân giác, dữ liệu – biểu đồ) **+ phần Tập 2 mà CHÍNH ĐỀ kiểm tra** (Ch VI phân thức đại số · Ch VII phương trình bậc nhất một ẩn, giải bài toán bằng cách lập phương trình, hàm số bậc nhất – đồ thị – hệ số góc · Ch VIII mở đầu xác suất của biến cố · Ch IX tam giác đồng dạng, Pythagore · Ch X hình khối thực tiễn) — đề kiểm tra tới đâu dùng tới đó, đề không chạm thì cấm (như [K8-38]); thứ tự bài trong Tập 2 theo sách. **Bản đồ dạng Đại K8 hiện chỉ phủ Ch I–III** ⇒ câu thuộc Ch IV–X: `dang=—` `chac=—`, lý do mở đầu `THIẾU DẠNG: <tên nên có>`; **không ép vào dạng Ch I–III**. Hình: bài đích có HH00058–66, 111 (tứ giác), HH00142 Thalès, HH00143 đường trung bình, HH00144 phân giác; đồng dạng / hình khối chưa có bài ⇒ `HH08000000`. Bộ sách khác (Cánh Diều, CTST) ⇒ [K8-38]. Chương sau trong năm cấm ở mọi câu Ch I–IV [K8-9, K8-11] CHỈ áp cho đề cuối kì I / giữa kì I; đề giữa kì II không cấm Tập 2 nếu đề kiểm tra tới.
- **Cuối kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút. Chương sau trong năm cấm ở mọi câu Ch I–IV [K8-9, K8-11]: phân thức, phương trình bậc nhất, lập phương trình, hàm số – đồ thị, xác suất, đồng dạng, **Pythagore** (bẫy lớn nhất của Ch III), hình chóp, tỉ số lượng giác.

### Phân kho

- [K8-25] Hình phẳng ⇒ `hinh_hoc_*` (bài khối 8: HH00058–HH00066, HH00111 "Ôn tập chương Tứ giác"; câu hình đề thi / đề cương `kho=hinh_hoc`, dạng chờ `HH08000000`). Không `hgt`. Câu Đại ⇒ `dai_cau_hoi`.
- Ở đề: `hinh_hoc` = tứ giác, hình thang, HBH, HCN, thoi, vuông, góc, Pythagore, hình chóp (thể tích, diện tích xung quanh), bài có vẽ / chứng minh / tính góc – cạnh trên hình, **kể cả câu trắc nghiệm hình**; `dai` = còn lại (kể cả bài thực tế tính biểu thức có bối cảnh mảnh vườn hình chữ nhật; dữ liệu – biểu đồ – thống kê, hàm số – đồ thị, phân thức).
- K8 không có Hình giải tích.

### Đại

**(a) Công cụ được phép / cấm — bảng whitelist Đại (✚ = mới từ bài này)**

| Bài | ✚ Được dùng mới | ⛔ CẤM (học sau) |
|---|---|---|
| C1 B1 Đơn thức | đơn thức, thu gọn, hệ số, phần biến, bậc; đồng dạng; cộng trừ đơn thức đồng dạng | nhân đa thức · mọi HĐT |
| C1 B2 Đa thức | đa thức, hạng tử, thu gọn, bậc (thu gọn trước), giá trị | như trên |
| C1 B3 Cộng trừ đa thức | cộng trừ, quy tắc bỏ ngoặc, giao hoán – kết hợp | như trên |
| C1 B4 Nhân đa thức | đơn × đơn, đơn × đa, đa × đa; phân phối | **HĐT** ⇒ $(x-2)^2$ viết $(x-2)(x-2)$ rồi nhân · phương pháp phân tích nhân tử · "phương trình bậc nhất", "nghiệm", "$S=\{…\}$" |
| C1 B5 Chia đa thức cho đơn thức | chia đơn/đơn, đa/đơn, điều kiện chia hết | chia đa thức NHIỀU biến cho đa thức · phân tích nhân tử |
| C1 Ôn tập | toàn Ch I | Ch II trở đi |
| C2 (HĐT, phân tích nhân tử) | theo thứ tự bài: bài 6 hiệu hai bình phương, bình phương tổng / hiệu · bài 7 lập phương tổng / hiệu · rồi tổng / hiệu hai lập phương · bài 9 phân tích nhân tử; "$A\cdot B=0\Rightarrow A=0$ hoặc $B=0$" chỉ từ bài Phân tích nhân tử (hoặc đề cương ghi rõ trong phạm vi) | bảng theo bài chưa viết — lô mẫu đầu tiên sẽ rút |

- [K8-9] Tìm $x$ ở Ch I giải bằng chuyển vế lớp 7, từng dòng — không gọi "phương trình", không "tập nghiệm"; không $\Delta$, Vi-ét, "định lí Bézout / số dư" (trừ đề cương ghi có). Nghiệm vô tỉ viết $\pm\sqrt{k}$.
- [K8-10] **Ranh giới "phân tích nhân tử"**: đặt thừa số chung theo phân phối ($9ab+6a+3b=3(3ab+2a+b)$) **luôn được dùng**. Bị cấm khi chưa học là các PHƯƠNG PHÁP Ch II: dùng HĐT, nhóm hạng tử, tách hạng tử, thêm bớt.

**(b) Trình bày riêng**
- [K8-16] Bài nhiều ý giữ chung: Phần 1 các bước ghi "Ý a: …", "Ý b: …", tổng vẫn 3–6 bước. Phải tự chứng minh kết quả chưa học thì nói rõ ở Phần 1. Phần 2 không nêu quy tắc.
- [K8-17] Bài "B" và tự luyện (tài liệu chỉ "Tương tự 1A. Đáp số: …" / "HS tự chứng minh") ⇒ viết đủ lời giải theo khuôn bài "A" cùng dạng; đáp số tài liệu là nhân chứng.
- [K8-18] Tách ý (cụ thể hoá §A7): tách bài "Thực hiện phép tính / Tính / Rút gọn / Tính giá trị / Phân tích thành nhân tử / Tìm $x$ / Tìm $m$" có ý dữ kiện RIÊNG; nhãn `Câu 9a` / `Bài 1b` (giữ đúng chữ "Câu" hay "Bài" của đề). Giữ một câu khi các ý chung dữ kiện, ý sau dùng ý trước, lời văn, chứng minh nhiều ý. "Bài" là vỏ gom 2 bài toán khác hẳn ⇒ `Bài 4.1`, `Bài 4.2`.
- [K8-19] **Khuôn Phần 2 — Chương I**:

| Dạng | Khuôn Phần 2 | Mấu chốt / bẫy (Phần 1) |
|---|---|---|
| Nhận diện đơn thức / đa thức | "Các đơn thức là: …" · "… không phải đơn thức vì …" | biến ở mẫu ($\dfrac{1}{x}$) ⇒ không phải đa thức; chia cho SỐ ($\dfrac{x^4}{\sqrt{2}+3}$) vẫn là đơn thức; $a, b$ hằng hay biến — theo đề; số là đơn thức đặc biệt |
| Thu gọn / nhân đơn thức, hệ số – phần biến – bậc | $\left[(-3)\cdot(-2)\right](x^2y\cdot xy)=6x^3y^2$ → "Hệ số là …, phần biến là …, bậc là …" | bậc = tổng số mũ các biến (không tính hệ số, kể cả $2023^2$); số thừa số âm chẵn ⇒ dương |
| Tìm bậc | thu gọn (dòng riêng) → "Bậc của đa thức là …" | thu gọn trước; ra đa thức không ⇒ bậc không xác định, nói rõ; "tìm $m$ để bậc bằng…" xét cả bậc giảm |
| Cộng trừ | chép đề → bỏ ngoặc → nhóm đồng dạng trong ngoặc → kết quả | quên đổi dấu MỌI hạng tử sau dấu "−" |
| Thu gọn đa thức | chép đề → nhóm đồng dạng → kết quả (sắp luỹ thừa giảm nếu đề yêu cầu) | "đồng dạng" = cùng phần biến, không phải cùng bậc |
| Tính giá trị | thu gọn trước → "Với $x=…$ thì giá trị của $P$ là: …" | số âm phải có ngoặc: $(-2)^4$ |
| Tìm đa thức chưa biết | $P+A=B\Rightarrow P=B-A$ → chép $B-A$ → bỏ ngoặc → nhóm → kết quả | tìm $P$ từ tích ⇒ CHIA (B5), không phân tích nhân tử |
| Đơn × đa | chép đề $=$ kết quả | nhân dấu với từng hạng tử |
| Đa × đa | chép đề → dòng khai triển tường minh từng tích → dòng đã tính → thu gọn | tích 3 nhân tử: nhân hai cái đầu trước; bình phương viết thành tích khi chưa học HĐT |
| Tìm $x$ | chép đề → bỏ ngoặc → thu gọn → $-10x=9$ → $x=-\dfrac{9}{10}$ → "Vậy $x=…$" | $x^2$ triệt tiêu hai vế ⇒ còn bậc nhất |
| Không phụ thuộc biến | chép đề → bỏ ngoặc → nhóm theo bậc $(5x^2-5x^2)+(…)x+(…)=-50$ → "Vậy giá trị của $A$ không phụ thuộc vào giá trị của biến." | ra còn biến ⇒ tính sai hoặc đề in lỗi — kiểm bằng máy |
| Chứng minh đẳng thức | "Vế trái $=$ …" → các dòng → "$=$ Vế phải." → "Vậy …" | biến đổi vế phức tạp hơn về vế kia (đề xuất, chưa chốt) |
| Chia đơn/đơn | chép đề $=$ (thương hệ số)(thương từng luỹ thừa) $=$ kết quả | chia hết khi mỗi biến của đơn thức chia có trong đơn thức bị chia với số mũ không lớn hơn |
| Chia đa/đơn | chép đề $=$ tổng các thương $=$ kết quả | chia hết khi MỌI hạng tử chia hết |

- [K8-20] Khuôn khác ở đề / đề cương: bài thực tế: gọi ẩn / điều kiện → lập biểu thức → tính → "Vậy …" · "tìm $m$ để chia hết / tìm dư": tự lập luận $f(x)=g(x)\,q(x)+r(x)$ rồi thay giá trị / so hệ số, hoặc đặt phép chia đa thức một biến; **xét ĐỦ hai chiều**; không gọi "định lí số dư" · nghiệm nguyên $x,y$: đưa về tích bằng một số nguyên, liệt kê đủ ước (cả âm), thử lại · GTNN bằng hoàn thành bình phương: "$\ge$ hằng số" + chỉ ra giá trị đạt dấu "=" · số chính phương / chia hết nâng cao: mỗi bước đúng với MỌI giá trị biến (biên, số âm, $n=0$); $\overline{abc}=100a+10b+c$.
- [K8-21] Loại câu: TN loại dần phương án bằng LÍ DO; `tra_loi_ngan` theo §A10 (biểu thức, phân số, nhiều giá trị, số phải đổi đơn vị ⇒ không); Đúng/Sai nhiều mệnh đề ⇒ `tu_luan` + `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`; "điền vào chỗ trống" không A–D ⇒ theo luật trả lời ngắn / tự luận.
- [K8-22] **Định dạng**: `\left( \right)` của MathType ⇒ `(` `)` · **dấu nhân** [09/10 · Thùy]: giữa hai số (và số với ngoặc) dùng `\cdot`; số–chữ, chữ–chữ, ngoặc–ngoặc viết liền ($3x$, $(x+1)(x-2)$); CẤM `\times` và dấu chấm làm dấu nhân (đề in dấu chấm giữa hai đơn thức = dấu nhân) · dấu ":" ở bài chia hết ⇒ `\vdots` · luỹ thừa số âm / phân số luôn có ngoặc · `2{,}5` · số viết liền trong công thức (ngoài công thức "500 000 đồng") · chữ Việt trong công thức bọc `\text{…}` · `\left|…\right|` · đơn vị `(cm)`, `($cm^2$)`.
- [K8-23] `dap_an`: biểu thức thu gọn sắp theo luỹ thừa giảm của biến chính; tìm $x$ ⇒ `$x=-\dfrac{9}{10}$`; chứng minh ⇒ không đáp án ngắn.

**(c) Sai lầm cần tránh**
- [09/10] HDG C1 B4 10A a) in $-2y$ (đúng $-2yz$) ⇒ đáp số tài liệu chỉ là nhân chứng.
- [09/10] Word có chữ "а)" Kirin (U+0430) lẫn "a)" Latin, nhãn hoa "C)", nhiều ý một dòng cách tab ⇒ chuẩn hoá khi tách bài, không thì ý a) mất im lặng.
- [10/10] trạm kiểm cấm cả đặt thừa số chung ⇒ phân phối luôn được dùng [K8-10].
- [10/10] lỗi nhiều nhất của 39 đề: Phần 1 lộ đáp số; "Chú ý" sai chữ / nói chuyện phân loại kho ⇒ "Chú ý" là lời dặn cho học sinh.
- [10/10] đề in sẵn đáp án vẫn tô sai (GKI-14 Câu 4, GKI-38 Câu 10) ⇒ tự giải trước (§A4).
- [12/10] nghiệm vô tỉ không tự nó là lỗi in ⇒ chỉ nghi khi các ý anh em đều nghiệm đẹp mà ý này không.
- [12/10] bài không có lời giải sơ cấp đầy đủ (dạng Ramanujan–Nagell) ⇒ không bịa chứng minh: nêu phần đã chứng minh, nghiệm tìm được + cách kiểm, `**Chưa chắc:**` nói rõ chỗ hở.
- [12/10] dùng rút căn lớp 9 ở bài thực tế ⇒ căn chỉ ở mức căn bậc hai số học lớp 7.
- [13/10] gắn cờ quá tay ⇒ cờ thừa thì xoá.
- [13/10] lỗi in thật của đề cương (ra hằng số $-4$ mà đề bảo "luôn dương") chỉ lộ nhờ máy ⇒ mọi kết luận "luôn dương / không phụ thuộc biến" phải chạy máy.
- [19/10] dùng ngầm HĐT ở đề cương chưa học HĐT ⇒ nhân tường minh; $2x^3-50x=0$ ⇒ đặt $x$ ra ngoài, $x^2=25$ (căn lớp 7); $F(10)\cdot F(-3)$ thay $b=-7a$, không Vi-ét.
- [19/10] biến ở mẫu ở đề chưa học phân thức ⇒ xử lý như chia cho $x\ne 0$ / bình phương $x+\dfrac{k}{x}$, không rút gọn phân thức.
- [24/10] bài "nhiều nhất / ít nhất" ⇒ nêu rõ điều kiện ("đủ cả hai loại" = mỗi loại ≥ 1; khuyến mãi từ mức ≥ hay >), kiểm biên bằng máy.

### Hình

**(a) Công cụ được phép / cấm — bảng whitelist Hình (KNTT)**

| Bài | ✚ Được dùng mới | ⛔ CẤM (học sau) |
|---|---|---|
| C3 B1 Tứ giác | tứ giác, tứ giác lồi, góc, đỉnh đối, cạnh đối, đường chéo; tổng các góc $=360^\circ$ | hình thang, HBH, HCN, thoi, vuông · đường trung bình · Thalès |
| C3 B2 Hình thang cân | hình thang, đáy, cạnh bên, đường cao; HTC (định nghĩa theo hai góc kề một đáy); tính chất hai cạnh bên bằng nhau, hai đường chéo bằng nhau; dấu hiệu hình thang có hai đường chéo bằng nhau | HBH (phải tự chứng minh qua tam giác bằng nhau) · đường trung bình hình thang (cấm mọi bài) · trung tuyến ứng cạnh huyền |
| C3 B3 Hình bình hành | định nghĩa; cạnh đối, góc đối, đường chéo cắt nhau tại trung điểm; 4 dấu hiệu | đường trung bình tam giác · HCN, thoi, vuông · trung tuyến ứng cạnh huyền |
| C3 B4 Hình chữ nhật | định nghĩa (bốn góc vuông); đường chéo bằng nhau và cắt nhau tại trung điểm; dấu hiệu (HBH có một góc vuông · HBH có hai đường chéo bằng nhau); ✚ trung tuyến ứng cạnh huyền $=\dfrac{1}{2}$ cạnh huyền + chiều đảo | thoi, vuông · đường trung bình · Pythagore |
| C3 B5 Hình thoi, hình vuông | thoi: định nghĩa, đường chéo vuông góc + là phân giác, 3 dấu hiệu; vuông: định nghĩa, tính chất đường chéo, 3 dấu hiệu từ HCN + 2 từ thoi | đường trung bình · Thalès · Pythagore |
| C3 Ôn tập | toàn Ch III | Ch IV trở đi |
| C4 B1 Định lí Thalès | tỉ số hai đoạn, đoạn thẳng tỉ lệ; Thalès thuận (ba cặp tỉ số) + đảo | **hệ quả** $\dfrac{DE}{BC}=\dfrac{AD}{AB}$ — không có trong lý thuyết ⇒ tự chứng minh như HDG 6A/6B · đường trung bình · phân giác · đồng dạng |
| C4 B2 Đường trung bình tam giác | định nghĩa; song song cạnh thứ ba và bằng nửa; chiều đảo | tính chất phân giác · đồng dạng · Pythagore |
| C4 B3 Tính chất phân giác | $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ + chiều đảo; phân giác ngoài | đồng dạng · Pythagore |
| C4 Ôn tập | toàn Ch III–IV | Ch IX |

- [K8-12] "Tứ giác có ba góc vuông là HCN" KHÔNG phải dấu hiệu ⇒ tổng các góc $360^\circ$ nên góc thứ tư vuông; tứ giác có bốn góc vuông là HCN (định nghĩa).
- Lý thuyết K8 thường **cấm đồng dạng, hệ thức lượng, tỉ số diện tích / phương pháp diện tích** trong chuyên đề Thalès · đường trung bình · phân giác [14/11 · Thùy]; cổng nhập chặn chữ "đồng dạng", `\backsim`, "hệ thức lượng", "diện tích" trong lời giải. Đường chéo hình vuông / hình thoi là phân giác — được dùng.
- **⭐ Đường trung bình [K8-15]** (Hình chung, CTO phân xử 15/11):
  - Giữa kì I (đề thi + đề cương) [20/10 · Thùy]: đường trung bình tam giác CHỈ dùng cho đề **Ngôi Sao Hoàng Mai** (định nghĩa, tính chất, chiều đảo; gọi tên rõ). Mọi trường khác KHÔNG dùng ⇒ bài có hai trung điểm hai cạnh tự chứng minh bằng hình bình hành (lấy điểm đối xứng: $F$ sao cho $E$ là trung điểm $DF$) / trọng tâm lớp 7 / tam giác bằng nhau / trung tuyến ứng cạnh huyền; không gọi tên, không dùng ngầm. Không treo `**Chưa chắc:**` vì lí do này.
  - Cuối kì I [14/11 · Thùy: "Cho dùng"]: đề KNTT ĐƯỢC dùng đường trung bình của TAM GIÁC, không treo `**Chưa chắc:**`. Đề Cánh Diều / CTST giữ luật bộ sách (tự chứng minh). Lời giải cũ tự chứng minh bằng HBH vẫn đúng.
  - Luôn cấm: đường trung bình HÌNH THANG. Hệ quả Thalès chưa có trong lý thuyết ⇒ vẫn tự chứng minh, không treo cờ.
- [K8-13] **Chỗ tài liệu Word tự vi phạm whitelist — giải lại, không chép**:

| Bài | HDG tài liệu dùng | Kho phải làm |
|---|---|---|
| C3 B3 — 3B (đồng quy $EL, FM, DN$) và tự luyện 6 | "$LD$ là đường trung bình $\triangle AOB$" / "Tương tự 3B" | chứng minh $LD\parallel OB$, $LD=\dfrac{1}{2}OB$ bằng kéo dài + tam giác bằng nhau + dấu hiệu HBH |
| C3 Ôn tập — 1B c) ($BCDE$ HTC) | bỏ qua bước $ED\parallel BC$ | hai cặp tam giác c.c.c + tổng góc tứ giác + góc trong cùng phía bù nhau |
| C3 Ôn tập — 8b), 8e) | "$AKCM$ là HBH" không nói vì sao $P$ là trung điểm $AC$; "$OPIM$ là HCN" ngầm $NP\parallel BC$ | $P$ trung điểm qua hình thoi $APMN$ + $\triangle PMC$ cân; HCN qua ba góc vuông + tổng góc 360° |
| C4 B1 — 6A, 6B | tự chứng minh hệ quả trước khi dùng | mẫu đúng — làm theo |

**(b) Trình bày riêng**
- [K8-26] Xét theo từng Ý: ý **Tính** (góc, độ dài, tỉ số; "hình gì" kiểu đáp một kết luận) ⇒ Phần 1 bằng lời như Đại; Phần 2 các dòng tính, mỗi dòng kèm lí do; đặt ẩn "Đặt $EC=x$ ($x>0$)". Ý **Chứng minh** (bằng nhau, song song, vuông góc, thẳng hàng, đồng quy, là hình gì, hệ thức, tìm điều kiện) ⇒ Sơ đồ tư duy §A6.
- [K8-27] Cách nghĩ sơ đồ = **phân tích – tổng hợp** (Pappus; Pólya *working backwards*): đứng ở kết luận hỏi "muốn có cái này thì cần cái gì?", lùi tới giả thiết; mỗi nhánh phải chạm giả thiết / điều đã có. Lí do mỗi bước = đúng tên trong whitelist; kết quả chưa học phải tự chứng minh ⇒ ô riêng. Chuỗi dài quá ~6 tầng ⇒ chọn mốc trung gian (vd "$AKCI$ là hình bình hành"). Mấu chốt luôn nói "kẻ gì, vì dấu hiệu nào trong đề". Trình bày đi xuôi; mỗi mũi tên của sơ đồ = đúng một bước trình bày, cùng lí do — không thêm, không bỏ.
- Căn cứ đúng tên, vd `(định lý trung tuyến ứng với cạnh huyền)`, `(tính chất hai đường chéo hình chữ nhật)`, `(dấu hiệu nhận biết hình bình hành)`, `(trường hợp c.g.c)`.
- [K8-32] Định dạng: `\parallel` (tài liệu gõ `//`), tích độ dài $AB\cdot CD$, dấu nhân `\cdot`.
- [K8-33] Hình (Hình chung): hình đề của câu `hinh_hoc` theo §A8 (gốc ổn giữ, tệ / có lệnh vẽ lại); dòng `**Ghi chú:** Đọc hình: …` (dữ kiện đọc trên hình gốc). Bài đề KHÔNG cho hình (và bài yêu cầu vẽ hình / biểu đồ / đồ thị) ⇒ vẽ bằng code, khai `**Hình giải:** giai_<nhãn>.png` — một tệp / bài, đủ mọi điểm của mọi ý, chỉ ở lời giải (`anh_dap_an`); điểm phụ lời giải không dùng ⇒ bỏ. Câu trắc nghiệm hình không cần hình giải. Ảnh jpeg trong HDG file Word là hình của bài.
- [K8-35] HDG Hình của tài liệu rất tắt ("Dễ dàng chứng minh…") ⇒ chỉ là hướng đi; lời giải kho đủ từng bước.

**(c) Sai lầm cần tránh**
- [09/10] HDG ngầm dùng đường trung bình ở C3 B3 3B, tự luyện 6, Ôn tập 1B c, 8b, 8e (soát từ khoá không bắt) ⇒ viết đủ bước thì lộ; tự chứng minh.
- [10/10] một đề phải viết lại vì dùng đường trung bình ở giữa kì I (GKI-21) ⇒ [K8-15].
- [12/10] Bài 13c phải phóng to mới đọc đúng "vuông góc với $AB$" (đọc "AN" thì vô nghiệm) ⇒ tên điểm không chắc thì phóng to.
- [12/10, 19/10] hình sai nhãn / thiếu cạnh / nhãn đè gạch ⇒ soát bằng MỞ ảnh, không đọc script.
- [13/10 · Thùy] đề thiếu điều kiện làm hình suy biến / cộng góc sai chiều (thiếu $AB<AC$, $AB>AD$) ⇒ thêm điều kiện tối thiểu + `**Ghi chú:**`.
- [19/10] câu cần Pythagore đảo (ngoài phạm vi) ⇒ nêu rõ chỗ cần, chọn đáp án theo kết quả đúng, `**Chưa chắc:**`.
- [24/10] đề cương chỉ tới HBH mà bài nhắc HCN / thoi ⇒ làm bằng HBH + tam giác bằng nhau, nêu rõ. $AK=3AD$ ⇒ dùng trọng tâm (hai trung tuyến), không đường trung bình.

### Phân dạng riêng

- Câu Hình xếp vào bài đích theo Hình chung ("kiến thức đứng sau cùng mà lời giải thật sự cần"); câu đề thi chưa có bài đích ⇒ `HH08000000`.
- Đề cương: phạm vi bài theo bảng phạm vi của chính đề cương đó (mục Theo loại nguồn), không suy từ tên bài.

### Theo loại nguồn

**Sách Word theo bài (kho kiểu 1 — Hình) [K8-37]**
- Đường đi: dây chuyền Phần C + mục "Hình — luật chung" (bài học Hình từ Word bài giảng). Lời giao trạm phải chép nguyên bảng whitelist của bài + bảng vi phạm của tài liệu.
- Công thức MathType OLE ⇒ `doc-docx.mjs` (không mất dấu mũ góc); ảnh jpeg bằng `docx_trich.mjs`.
- Ưu tiên bài "B" + tự luyện; lọc trùng với câu Hình 8 cũ (HH00058–66) — bộ 1A/1B phổ biến.

**Đề thi (giữa kì / cuối kì) [K8-38]**
- Whitelist của một ĐỀ = những gì chính đề đó kiểm tra tới theo **bộ sách của trường**, nhìn TOÀN BỘ đề; ghi `bo_sach` (`KNTT` / `Cánh Diều` / `CTST`; không đoán được ⇒ `KNTT`). Đề giữa kì có Pythagore, hình chóp, phân thức ⇒ đề CTST / Cánh Diều — giải bằng đúng kiến thức đề kiểm tra.
- **Cuối kì I Cánh Diều** (Tập 1 = Ch I–V): được dùng đa thức nhiều biến, HĐT, phân tích nhân tử · phân thức · hàm số, mặt phẳng toạ độ, đồ thị, hàm số bậc nhất, hệ số góc · hình chóp tam giác đều / tứ giác đều · Pythagore (thuận, đảo), tứ giác … hình vuông. Cấm: Thalès, đường trung bình, tính chất phân giác · đồng dạng · "phương trình – tập nghiệm" · thống kê – xác suất. Dữ kiện kiểu đường trung bình ⇒ tự chứng minh bằng HBH / tam giác bằng nhau / trọng tâm; cần tỉ số kiểu Thalès ⇒ trọng tâm ($\tfrac23$) hoặc tam giác bằng nhau; không được ⇒ `**Chưa chắc:**`.
- **CTST**: đề có phân thức + hình chóp + Pythagore mà không có hàm số ⇒ `bo_sach: CTST` nếu không thấy dấu hiệu Cánh Diều; cấm Thalès / đường trung bình / đồng dạng / hàm số. Bộ sách đoán theo nội dung ⇒ ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- Đề nhiều mã cùng trường trùng ≥ 70% câu ⇒ chỉ nhập mã đầu; batch toanmath đề nhiều mã chỉ lấy MỘT mã [13/11 · Thùy], ghi mã vào tên đề.
- Tên đề `# ĐỀ | <tên đề> — <trường / phòng> (mã đề …)`; bỏ "(1,0 điểm)"; chỉ trang ĐỀ là đề.
- Câu yêu cầu VẼ biểu đồ / đồ thị (Đại) ⇒ vẽ bằng code thành `**Hình giải:**`; câu chỉ ĐỌC biểu đồ in sẵn ⇒ cắt hình làm `**Hình:**`.

**Đề cương [K8-39]**
- Không có file gốc dạng đề ⇒ gõ lại từ ảnh (`<MA>.build.mjs`) → đối chiếu ảnh bởi model khác → soạn → kiểm → ghi MỘT lần. `cau_hinh.deThi.kieu='de_cuong'`.
- **⭐ Phạm vi MỖI đề cương khác nhau** — đọc dòng "TRỌNG TÂM KIẾN THỨC" ở đầu tệp, không suy từ tên bài; lời giao trạm phải có bảng phạm vi theo đề. Bảng đã lập (giữa kì I, 2026–2027):

| Đề cương | Đại | Hình | Ghi chú |
|---|---|---|---|
| Ngôi Sao Hoàng Mai (NSHM) | Ch I + II (HĐT, phân tích nhân tử; "tích bằng 0" được dùng) | Ch III tới thoi, vuông | được dùng đường trung bình tam giác |
| Lương Thế Vinh (LTV) | Ch I + Ch II đến hết bài 7 (hiệu hai bình phương, bình phương, lập phương tổng / hiệu; được viết ngược chiều). Cấm $A^3\pm B^3$, các phương pháp bài 9 | Ch III đến HCN; thoi, vuông chưa học | bài vượt phạm vi ⇒ hoàn thành bình phương + căn lớp 7, `**Chưa chắc:**` |
| Đoàn Thị Điểm (ĐTĐ) | CHỈ Ch I — $(a+b)^2$ viết $(a+b)(a+b)$ rồi nhân | Ch III trọn | |
| Thành Công (TC) | CHỈ Ch I | tới hình thoi (hình vuông chỉ ở câu trắc nghiệm) | |
| Ngô Quyền (NQ) | Ch I + HĐT hết bài 6 (lập phương chưa học; HĐT bậc hai dùng cả hai chiều) | tới thoi, vuông | |
| Ngọc Thụy (NTH) | CHỈ Ch I | tới hình vuông | "Ví dụ" in lời giải mẫu vẫn là câu của kho, tự giải |
| Giảng Võ 2 (GV2) | Ch I + HĐT hết bài 6 | CHỈ HBH và HCN | hoàn thành bình phương rồi $A^2=81\Rightarrow A=\pm 9$, không phân tích $(t+13)(t-5)$ |
| Thanh Xuân (TX) | Ch I + II đầy đủ (kể cả đặt ẩn phụ) | tới hình vuông | |
| Nam Từ Liêm (NTL) | Ch I + II đầy đủ kể cả tách hạng tử, nhẩm nghiệm; đề ghi "ứng dụng định lí Bézout" ⇒ ĐƯỢC dùng $f(a)=0$ ⇒ chia hết cho $x-a$; $a^3+b^3+c^3-3abc$ | CHỈ hình thang, thang cân, HBH | 2 câu tiếng Anh: đề giữ tiếng Anh, giải tiếng Việt |
| DTK8 (tuyển tập không ghi trường) | CHỈ Ch I; riêng Dạng 5 nâng cao được nhân trực tiếp / nhóm hạng tử / hoàn thành bình phương bằng nhân hai thừa số giống nhau | tới hình vuông | |

- Cấm chung mọi đề cương giữa kì I: Thalès · đồng dạng · Pythagore · lượng giác · phân thức · "phương trình / tập nghiệm" · công thức nghiệm · Vi-ét · đường trung bình hình thang; đường trung bình tam giác theo [K8-15].
- Nhãn giữ nguyên cách đánh số của đề kể cả tiền tố ("Dạng 2 Bài 3a", "Đề 1 Bài 2", "Hình Bài 2a", "ĐMH Bài 4a"). Vết viết tay / khoanh đáp án của HS trên ảnh: bỏ qua. Đề in lời giải mẫu: chỉ gõ ĐỀ. Trắc nghiệm vào PHẦN riêng, đủ 4 phương án (đề chỉ 2–3 phương án ⇒ giữ như in + `**Ghi chú:**`, không bịa). Chia trạm ≤ ~12 câu, bài nâng cao ở trạm ít câu.
- Trắc nghiệm hình "khẳng định đúng / sai" nhiều mệnh đề ⇒ một câu `tu_luan`, đáp = Đúng / Sai từng mệnh đề + lí do ngắn.
- Sau mỗi đề cương mới có câu Hình: chạy lại `nhap_tu_de_thi.mjs` (kiểm trước khi dùng cho K8).

### Công cụ riêng

- `scripts/kho/mathtype-thu/doc-docx.mjs "<file.docx>" --ra <thư mục>` — Word MathType ra LaTeX.
- `scripts/kho/de-thi/boc-pdf.mjs … --khoi 8` — bóc PDF đề (≤ 18 MB / tệp; cần khoá Gemini).
- `node scripts/kho/de-thi/dung-de-tu-soan.mjs <MA>.soan.md --lam-viec "<LV>" --khoi 8 [--chi-kiem]` — cổng (khuôn, card, sơ đồ tư duy, KaTeX, chặn `\times` / dấu chấm làm dấu nhân). `ghi.mjs <LV> [--ghi]` ghi tuần tự. `cap-nhat-loi-giai.mjs` sửa lời giải đã ghi.
- `scripts/kho/de-thi/ghi-nhan-cau.mjs` · `nhom-bai.mjs` — bù nhãn gốc / nhóm bài cho đề đã ghi (khớp bằng NỘI DUNG, lệch là bỏ cả lượt).
- `kho-rules/dai/lo/k8/de-cuong/dc-lib.mjs` · `<MA>.build.mjs` (mẫu `GV2-GKI-2026.build.mjs`) · `ghep-chung.mjs <MA> <LV> <số phần>` (ghép + cổng + de.json + gom chưa chắc).
- `kho-rules/dai/lo/k8-kiem.mjs` — máy tính lại đáp số Đại từ đề (BigInt).
- Mẫu tệp: `kho-rules/dai/lo/k8/GKI-01.soan.md`. Thư mục làm việc: `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K8\<MA>`, `…\de-cuong\K8\<MA>`.

---

---

## Hình — luật chung mọi khối

> Áp cho mọi câu thuộc kho Hình (`hinh_hoc_*`, `hinh_bai`/`hinh_y`) ở mọi khối. Mục "Hình" của từng khối chỉ ghi whitelist và phần riêng.

### Phân kho Hình

| Câu gì | Vào đâu | Ghi chú |
|---|---|---|
| Hình phẳng THCS (tam giác, tứ giác, đường tròn…) — phần HỌC, từ bài giảng / sách / bản soạn | `hinh_hoc_bai` (bài `HH000xx`) · `hinh_hoc_bai_ly_thuyet` · `hinh_hoc_cau_hoi` (câu `HHC…`, `dang_chinh` = `ma_bai`) | [09/10 · Thùy] đường tròn là Hình học phần Học. `hinh_hoc_ban_do` là VIEW — không INSERT. Cột `ma_dang` của `hinh_hoc_bai` / `hinh_hoc_bai_ly_thuyet` là generated — không ghi |
| Bài Hình–Học nhiều ý | 1 dòng `hinh_hoc_bai_y` (`HHB…`: lời dẫn + hình chung) + mỗi ý 1 câu `hinh_hoc_cau_hoi` (`bai_y`, `nhan_y`, `cau_hoi_y`, `da_biet`) | [09/11 · Thùy] — mục "Tách ý" dưới |
| Ví dụ giảng / "Bài trên lớp" của bản soạn | kho trên lớp `hinh_hoc_cau_lop` (`HHL…`, vai giảng mặc định) | [05/11 · Thùy] bài Hình–Học đủ 5 phần: lý thuyết · ví dụ (`##VD`) · mô tả · kho trên lớp · kho luyện |
| "Bài về nhà" của bản soạn | kho luyện `hinh_hoc_cau_hoi` | [05/11 · Thùy] |
| Đề thi thực tế nhiều ý — Hình LUYỆN | `hinh_bai` (`HLB…`, `gia_thiet_chung`) + `hinh_y` (`HLY…`, `gia_thiet_them`, `anh_de` riêng) | [13/10] Không phải `hinh_baitoan` (bài mô hình), không phải `hinh_hoc_bai` |
| Mô hình / bài mô hình / biến thể / cách giải (cành) | `hinh_mo_hinh` · `hinh_baitoan` · `hinh_baitoan_bien_the` · `hinh_cach_giai` | Tầng tham chiếu; cây ở `spec-ban-do-toan.md` |
| Lượng giác, vectơ, toạ độ | `hgt_cau_hoi` | [09/10 · Thùy] Không đưa hình phẳng THCS vào `hgt`. Ranh giới từng khối: mục Phân kho của khối |
| Câu Hình của đề thi / đề cương chưa có bài đích | dạng chờ của khối trong `hinh_hoc_cau_hoi` (`HH07000000`, `HH08000000`…) | [10–12/10 · Thùy] |

- Sơ đồ tư duy của câu chứng minh lưu RIÊNG ở `hinh_hoc_cau_so_do` [14/11 · Thùy].
- **Hình LUYỆN — 2 luật bất biến** [13/10 · Thùy]: (a) không đẻ slot: mô hình chỉ là vỏ, bài mô hình chưa dựng = không có dòng `hinh_baitoan`; (b) đo ở Ý, gán ý → bài mô hình qua `hinh_y.baitoan_id` (nullable, gán sau), không tạo bài mô hình từ màn gán. Ý dùng được khi có câu hỏi + đáp án / lời giải + đã duyệt, không cần `baitoan_id`.
- **Kho bài tự do giữ nguyên văn, chuỗi chuẩn hoá** [09/11 · Thùy]: `hinh_bai` giữ đúng tên điểm như đề gốc. Bài đưa vào CHUỖI mô hình ⇒ đổi tên điểm (cả đề lẫn lời giải) cho khớp bộ điểm của mô hình, không hỏi lại.
- **Cấm ghép ý của 2 bài kho khác nhau vào 1 đề** (khác tên điểm, khác hình); muốn ghép thì đi qua cành (bài mô hình) [13/10].
- **Chỉ nhập bài có lời giải hoặc đáp số trong nguồn, hoặc tự giải được chắc**; sách ghi "bạn đọc tự giải" / mất trang mà không giải chắc được ⇒ giữ câu + `**Chưa chắc:**` nêu lí do (§A14). Dòng "yêu cầu đề" trong bản soạn (chưa có đề) ⇒ tự soạn đề đúng yêu cầu, chọn số cho đáp số đẹp [02/11 · Thùy].
- **Trùng đề**: giống hệt (cùng giả thiết, cùng kết luận, chỉ khác tên điểm / lời dẫn) ⇒ `TRUNG (<câu đã có>)`, không nhập lại. Câu đã có cần ở kho trên lớp ⇒ CHÉP (`hh_lop_chep.mjs`), không xoá gốc. Chỉ "gần giống" ⇒ soạn mới [05/11, 14/11].
- **Xếp bài vào bài đích** [áp Hình 14/11]: bài vào mã `HH` của kiến thức đứng SAU CÙNG mà lời giải THẬT SỰ cần; bài nhiều ý ⇒ cả bài theo ý cần kiến thức muộn nhất. Lời giải không dùng tới kiến thức của bài đang xét ⇒ dời về bài trước (vd bài "phân giác" mà chỉ cần hệ quả Thalès ⇒ bài Thalès).
- Bài cần kiến thức của chuyên đề CHƯA học mà không có lời giải gọn trong whitelist ⇒ `DE_SAU (<mã>)`: chép đề + 1 dòng lí do, không ép giải [14/11 · Thùy].

### Phạm vi kiến thức (whitelist)

- **Whitelist = lý thuyết của CHÍNH bài đó + mọi bài đứng trước** [08/10 · Thùy]. Cấm mọi thứ đứng sau. Nguồn không có phần lý thuyết ⇒ tóm tắt lý thuyết chương làm whitelist trước khi soạn.
- Mọi lí do trong lời giải chỉ gọi tên thứ có trong whitelist. Tính chất quen miệng mà không có trong lý thuyết ⇒ tự chứng minh tại chỗ (vd "tứ giác có ba góc vuông").
- Không giải được trong whitelist ⇒ không dùng công cụ ngoài; ghi `**Chưa chắc:**` hoặc `DE_SAU`.
- Không viện dẫn sách ("bài 212") — kết quả cần dùng phải chứng minh lại hoặc là định lí gọi được tên.
- Ký hiệu đánh dấu góc bằng nhau trên hình gọi là **góc**, không gọi "cung" (cung là kiến thức lớp 9) [07/10].

### Giải

- **Chuỗi bài cùng mô hình**: trước khi giải, query toàn bộ bài cùng `mo_hinh_id` sắp theo `ma`; đọc lời giải bài trước; bài trước thiếu lời giải ⇒ giải bài đó trước, không nhảy cóc. Bài không thật sự phụ thuộc ⇒ giải độc lập, không ép nối.
- **Text mâu thuẫn hình** (bổ sung §A4): verify cả hai cách đọc bằng toạ độ; cách đọc làm bài vô lí hoặc hiển nhiên (tautology) là cách sai. Ghi lại cuối báo cáo: bài nào, lệch gì, vì sao chọn.
- Lỗi in hiển nhiên (điểm chưa định nghĩa, "song song với BC cắt BC") ⇒ sửa + `**Ghi chú:**`; mơ hồ ⇒ giữ nguyên + `**Chưa chắc:**`. Mệnh đề in SAI (toạ độ có phản ví dụ) ⇒ giữ ý, ghi đề sai, `**Chưa chắc:**` [28/10; §A4].
- **Verify bằng toạ độ số TRƯỚC khi chốt — bắt buộc**: dựng toạ độ đúng dữ kiện, bộ số tổng quát (không cân / vuông đặc biệt trừ khi đề cho); kiểm TỪNG khẳng định (bằng nhau, tương ứng đỉnh, song song, vuông góc, thẳng hàng, trung điểm, tỉ số, số đo, đáp số). **Có điểm "bất kỳ" ⇒ ≥ 2 bộ toạ độ; còn lại 1 bộ tổng quát** (Hình chung). Đáp số tính lại từ toạ độ rồi so `dap_an`. FAIL ⇒ sửa, verify lại. Báo cáo ghi số phép kiểm + số FAIL.
- **Thêm điều kiện chống suy biến** khi mệnh đề sai ở ca biên + `**Ghi chú:**` [09/10, 28/10]. Mẫu: "E khác C, D" · "AB < AC" · "góc BAC nhọn" · "M khác B, C" · "AB không song song CD" · "d không song song AB".
- Vị trí điểm đề không ghi ("tia nằm giữa", "K thuộc tia đối…") ⇒ lấy theo hình, nêu cơ sở trong lời giải, ghi `**Ghi chú:**`.
- Nguồn Word: công thức WMF mất dấu mũ góc, đôi khi mất ký tự ⇒ suy từ hình + hướng dẫn; số đo (45°, 60°) phải MỞ ẢNH. Hình nổi trong Word hay lệch chỗ ⇒ đối chiếu nội dung hình với đề. Soát đánh số nhầm.
- Một khẳng định sai trong lời giải là lỗi nặng; không chắc ⇒ `**Chưa chắc:**`, không bịa. Không để lọt chữ tự thoại ("Tôi sai…").

### Trình bày (phần riêng của Hình — dòng trống theo §A5)

- **R1** [30/09 · Thùy]: hết câu (dấu chấm) ⇒ xuống dòng. "Do đó / Suy ra / Vậy" đứng dòng riêng. Dấu `;` không bắt buộc xuống dòng, nhưng mỗi điều kiện của khối "Xét … có:" một dòng.
- **Dòng ngắn + căn cứ** [27/10 · Thùy; mọi lời giải Hình: Học, Luyện, Kho đề thi]:
  - Một dòng ≈ nửa bề ngang, mốc ≲ 60 ký tự hiển thị (trạm kiểm chấp nhận tới ~68). Mỗi dòng một điều kiện / một mệnh đề / một lí do; khẳng định dài tách nhiều dòng; lí do dài xuống dòng riêng.
  - **Mọi mệnh đề có căn cứ trong ngoặc**: dữ kiện ⇒ `(gt)` · đã chứng minh ⇒ `(cmt)` / `(ý a)` · định lí / tính chất / dấu hiệu ⇒ ĐÚNG TÊN trong whitelist. Thiếu căn cứ = chưa đạt.
  - **Tên lí do thống nhất cả batch**: `(định nghĩa đường trung bình)`, `(tính chất đường trung bình)`, `(định nghĩa trung điểm)`, `(dấu hiệu nhận biết hình bình hành)`, `(cạnh chung)`, `(hai góc tương ứng)`, `(hai cạnh tương ứng)`, `(hai góc kề bù)`, `(hai góc đối đỉnh)`, `(hai góc so le trong)`, `(tổng ba góc của tam giác)`, `(tính chất góc ngoài của tam giác)`, `(c.c.c)`, `(c.g.c)`, `(g.c.g)`, `(ch - gn)`, `(ch - cgv)`, `(cgv - cgv)`, `(cgv - gn)`. Không để lí do trống tên kiểu "(định nghĩa)".
- **Khuôn "Xét $\triangle ABC$ và $\triangle DEF$ có:"** — mỗi điều kiện một dòng kèm lí do, kết "Do đó $\triangle …=\triangle …$ (c.g.c)." Viết "(gt)↵nên …" (không "(gt).↵Nên …"). **Thứ tự đỉnh hai tam giác bằng nhau phải khớp tương ứng** (kiểm bằng toạ độ).
- Ý mở bằng `a) ` chữ thường, không in đậm. Kết ý bằng "Vậy …" / "Do đó …".
- Ký hiệu: `\triangle ABC`, `\widehat{ABC}`, `\parallel`, `\perp`, `\Rightarrow`, `^\circ`; thập phân `3{,}5`. Dấu nhân: theo mục khối (K6–K7 dấu chấm `.`; K8 trở lên `\cdot`).
- Tên định lí: "định lí Thalès", "định lí Thalès đảo", "hệ quả của định lí Thalès", "định lí Pythagore" (K8 trở lên; K7 không dùng).
- **Đáp án trả lời ngắn**: `6`, `4,8`, `28/3`; nhiều đáp số `BD=8; DC=12`; "35 hoặc 10" ⇒ `35; 10`; căn thức giữ `$…$`. **Đáp án là một QUAN HỆ** (còn chữ in hoa / ∥ / ⊥) ⇒ câu `tu_luan`, không lưu `dap_an` [14/11].
- **Đề TỰ ĐỦ dữ kiện, không cần nhìn hình** [07/10]: dữ kiện chỉ có trên hình (gạch bằng nhau, góc vuông, số đo) ghi thẳng vào đề dạng "Biết …". Bỏ "(h.19)", "như hình vẽ". Ngoại lệ: dạng đọc hình K7 (mục Khối 7).
- Dòng nguồn đề thi ("(Đề thi HSG Quận 1, 2001–2002)") giữ ở cuối đề. Câu trong kho phải tự đứng — không trỏ câu khác. Đề không chứa gợi ý cách giải.
- Câu TÍNH / trả lời ngắn: Phần 1 như §A5; Phần 2 các dòng tính, mỗi dòng kèm lí do, kết "Vậy …". Câu CHỨNG MINH (mọi khối, kể cả K7 — §A6): Sơ đồ tư duy §A6. Bài–ý: cột ý của sơ đồ luôn `-` (mỗi ý đã là câu riêng). "Tìm điều kiện" có chứng minh hai chiều cũng là câu chứng minh.

### Tách ý — mô hình bài–ý

1. **Hình–Học: BÀI–Ý** [09/11 · Thùy]. Bài nhiều ý = 1 `hinh_hoc_bai_y` (lời dẫn chung = giả thiết, KHÔNG chứa câu hỏi; + hình chung) + **mỗi ý một câu** `hinh_hoc_cau_hoi` có lời giải RIÊNG.
   - Ý sau cần kết quả ý trước ⇒ ghi `da_biet` ("Biết $MNPQ$ là hình bình hành (ý a).") và lời giải dùng nó như giả thiết, căn cứ `(ý a)`.
   - Điểm mới chỉ xuất hiện ở ý nào thì nằm trong `cau_hoi_y` của ý đó.
   - Trigger `trg_a_hh_y_ghep` tự ghép `noi_dung` = lời dẫn + đã biết + câu hỏi ý, ép `anh_de` + `dang_chinh` theo bài, CHẶN sửa thẳng `noi_dung` của ý ⇒ hình đề gắn vào BÀI (`hinh_hoc_bai_y.anh_de`); hình lời giải vẫn `anh_dap_an` từng ý.
   - Câu cũ nhập trước 09/11 vẫn là một câu chứa mọi ý — không sửa lẻ.
2. **Hình–Luyện** [13/10 · Thùy]: `hinh_bai.gia_thiet_chung` = phần đề TRƯỚC ý a + mỗi ý một dòng `hinh_y`. Giả thiết xuất hiện lần đầu ở ý nào thuộc `gia_thiet_them` của ý đó — không đưa ngược lên giả thiết chung. Giả thiết hiệu lực của ý *i* = chung + mọi `gia_thiet_them` của ý ≤ *i* (theo `thu_tu`). Nguyên văn, không đổi tên điểm. Sách gộp 2 câu hỏi trong 1 nhãn ⇒ tách 2 dòng `hinh_y`, `nhan_hien_thi` cùng chữ. In tập ý bất kỳ: ý bỏ chọn nằm trước nở thành "bước" trong lời giải ý được chọn kế tiếp.
3. Hai hình ĐỘC LẬP trong một số bài (vd "Tính x, y" hình a, hình b) ⇒ 2 câu.
4. **Gợi ý câu cho GIÁO TRÌNH Hình = NGUYÊN BÀI, không gợi ý từng ý** [16/11 · Thùy; mig `202611161750` + `202611161752`]:
   - Đơn vị gợi ý = **một bài nhiều ý** (`bai_y`, đủ MỌI ý đang vào kho chuẩn của bài đang xét — a, b, c…) hoặc **một câu đơn**. Không bao giờ trả lẻ một ý của bài nhiều ý.
   - Số lượng `p_n` (mặc định 4 luyện + 4 BTVN) tính theo **CÂU**: lấy nguyên từng bài theo thứ tự xếp cho tới khi đủ ≥ `p_n` câu, **không cắt dở bài** (bài đầu lớn hơn `p_n` vẫn trả đủ ý).
     Thứ tự xếp: ít dùng nhất trước (`so_lan_dung` lớn nhất trong các ý của bài), rồi câu gốc, rồi thứ tự.
   - Bài đã có **BẤT KỲ ý nào** đang chọn trong buổi (kể cả ý chọn tay) ⇒ không gợi ý lại cả bài đó.
   - Áp ở nút gợi ý của phần Học và ở lúc "bài mới tự gợi ý luyện + BTVN" của giáo trình (`fn_tl_hh_goi_y`, `fn_tl_hh_dat_bai` → `_tl_hh_goi_y_nguyen_bai`).
   - **KHÔNG áp cho hàng ET Hình học** (`fn_tl_hh_goi_y_bai` → `_tl_hh_goi_y`): mỗi hàng ET đúng MỘT câu (một mã), vẫn gợi ý theo câu.
   - Hệ quả với bài hiện ở nhiều kho (ý c ở Thẳng hàng, ý a–b ở Tam giác cân — §Khối 7 › Hình): kho nào gợi ý thì gợi ý đủ các ý của bài_y **đang nằm trong kho đó**.

### Vẽ hình

**Nguồn hình** (Hình chung)
- **Dùng lại ảnh gốc hay vẽ lại: theo §A8 "Nguồn hình đề"** (Thùy 15/11 — thay luật 07/10, 13/10 "câu Hình học luôn vẽ lại"): gốc ổn giữ · gốc quá tệ (mã a–f) vẽ lại · có lệnh thì vẽ lại.
  Vẽ thì bằng code (SVG → PNG 2x qua `ve_hinh_lib.mjs`) — không ảnh AI. Đồ thị / bảng của câu Đại, Hình giải tích gốc tệ mà chưa có máy vẽ loại đó ⇒ giữ gốc + `**Chưa chắc:**`.
- MỌI câu vẽ được thì phải có hình, kể cả câu đề dựng bằng lời [07/10 · Thùy]. Chỉ bỏ khi thật sự không có gì để vẽ. Áp cho câu MỚI nhập; câu cũ thiếu hình chỉ vẽ khi có lệnh (§C12).

**Dựng**
- **Dựng ĐÚNG dữ kiện bằng toạ độ, không ước mắt**: trung điểm `mid`, chân vuông góc `foot`, giao `inter`, phân giác `bisector`, quay `rot`/`ray` đúng số đo, đối xứng `doiXung`; song song = cùng véc-tơ chỉ phương; hình bình hành `D→C = A→B`; phân giác ⇒ chia cạnh đối đúng tỉ lệ; "AO = ON, AB ∥ MN" ⇒ đối xứng qua O. `console.assert` cho số đo quan trọng. Đề cho ẩn (`x`, `2x`) / "không đúng tỉ lệ" ⇒ giải ra giá trị thật rồi dựng.
- **KHÔNG vẽ sẵn đáp án / điều phải chứng minh** (luật này THẮNG "ảnh cũ có gì giữ nấy" — Hình chung): không ghi số đo cần tìm (ghi `x` hoặc để trống); không gạch cặp cạnh / đánh dấu cặp góc / ô vuông / ký hiệu song song mà đề bắt chứng minh; không gạch trung điểm cần chứng minh; không nối liền 3 điểm phải chứng minh thẳng hàng; không vẽ đường làm lộ kết luận; không vẽ đường phụ của lời giải vào hình đề. Điều đã chứng minh ở ý TRƯỚC được đánh dấu ở hình ý SAU.
- Giả thiết đề cho thì đánh dấu (trung điểm, góc vuông, đoạn bằng nhau, số đo) ngay từ hình bài.
- **Hình tổng quát không "đặc biệt thêm"**: tam giác thường vẽ LỆCH hẳn (không cân / gần cân), tam giác vuông không vuông cân, hình bình hành không thành chữ nhật / thoi; "AB < AC" vẽ lệch rõ.
- **Tam giác ABC vuông tại A ⇒ A góc dưới trái, AB THẲNG ĐỨNG (B trên A), AC NẰM NGANG (C bên phải A)** [23/10 · Thùy]. Áp mọi hình; thắng luật giữ hướng ảnh cũ.
- **QUY CHUẨN HƯỚNG TAM GIÁC khi VẼ hình (mới hoặc vẽ lại) — áp MỌI KHỐI (Thùy 23/11: "cho tất cả các lớp"):**
  - **Tam giác nhọn:** **A ở trên, BC nằm ngang.**
  - **Tam giác vuông:** **AC nằm ngang, B ở trên** (khớp luật vuông tại A ngay trên: A góc dưới trái, AB đứng).
  - Hình gốc ổn giữ ảnh gốc theo §A8 (không vẽ lại chỉ để xoay); quy chuẩn này dùng khi dựng hình mới / vẽ lại. Đề không có tam giác ⇒ không áp. Máy vẽ (`ve_hinh_lib.mjs`, `hinh-toado.mjs`) và brief vẽ hình phải đặt toạ độ khung ban đầu theo đúng hướng này.
- Câu có hình trong nguồn: giữ bố cục, tên điểm, vị trí tương đối như ảnh gốc (trừ luật vuông tại A).
- Gạch bằng nhau không đặt trên đoạn CON (gạch "AB = AC" rơi lên AD với D ∈ AC ⇒ ngụ ý sai) ⇒ đổi sang đánh dấu hai góc đáy [02/11]. Số đo đặt ngoài cạnh nó thuộc về, không gần đoạn khác.

**Ký hiệu, phong cách**
- Nét đen `#222` dày 2, nền trắng, không màu, không lưới. Tên điểm / tia chữ nghiêng (`label`); số đo chữ đứng (`num`/`angleText`/`sideText`); ẩn số chữ nghiêng (`bien`/`angleBien`). Điểm có tên có chấm `dot`; đầu mút tia không chấm. Chỉ tô xám khi ảnh gốc có tô.
- Hai góc kề nhau cùng đánh dấu ⇒ hai bán kính khác nhau. Góc < 25° ⇒ tăng bán kính. Góc vuông dùng `rightAngle`.
- Gạch bằng nhau tối đa 3 gạch; nhóm 4–6 dùng dấu × (+ gạch) qua `tick(a,b,n)`; n > 6 ⇒ hình quá rậm, tách hình theo ý. Nhóm quan trọng nhất dùng 1 gạch [14/10 · Thùy].
- Dấu phẩy trên `′` (U+2032); chỉ số dưới bằng `<tspan>`; độ `°`.
- Nhiều hình con (a, b, c / phương án A–D) ⇒ MỘT ảnh, xếp ngang (nhiều thì 2 hàng), nhãn dưới mỗi hình con.

**Kích thước** (Hình chung)
- **Canvas cao ≤ 450 px**; hình đơn nên ≈ 520 × 400 (thư viện cảnh báo khi vượt 560 × 420 — thu toạ độ, không lờ, không tự hạ cỡ chữ); ảnh nhiều hình con rộng tới 760 px. App HS giới hạn hình cao 288 px nên khung to thì chữ bé.
- **Chừa ≥ 35 px dưới nhãn đáy**; chữ không đè nét, không đè nhau, không cụt mép.

**Hình ở đề và ở lời giải**
- Phần Học, câu đơn: cùng một hình ghi vào `anh_de` VÀ `anh_dap_an`. Tên tệp không đuôi = cả hai; `_de` = chỉ đề; `_lg` = chỉ lời giải.
- **Hình lời giải riêng `_lg`** khi lời giải kẻ thêm đường / điểm phụ: hình đề không chứa chúng; mọi điểm lời giải nhắc phải có trên `_lg`. Dùng cả cho câu "vẽ hình" / "kết luận gì".
- Bài–ý: hình chung gắn vào BÀI; đường phụ của ý ⇒ `hinh_lg` của ý đó.
- **Hình theo Ý — Hình LUYỆN** [14/10 · Thùy]: `HLB….png` (→ `hinh_bai.anh_de`) = CHỈ giả thiết chung; `HLY….png` (→ `hinh_y.anh_de`) = hình bài + mọi thứ dựng thêm ở các ý trước + ý này (cộng dồn), TRỪ thứ câu hỏi lẫn lời giải của ý này không dùng. Ý không dựng thêm ⇒ không vẽ tệp. Vẽ đủ đoạn câu hỏi nhắc ("tứ giác AECK" ⇒ nối AECK). Bài một ý: chỉ `HLB`.
- Hình cùng một mô hình / chuỗi: dùng CHUNG bộ điểm gốc (một hàm dựng chung), cùng tỉ lệ, cùng hướng.

**Soát + đẩy kho**
- Render xong gom bảng (`bang_hinh.mjs`, `to_soat.mjs`, `ve_lai_bang.mjs`) rồi MỞ ẢNH: nhãn cắt đáy, nhãn đè nét, sai / thiếu ký hiệu, sai dữ kiện, vẽ sẵn đáp án, khung quá rộng. Sửa tới khi sạch. Đừng nối `| head` sau lệnh chạy tệp vẽ (EPIPE làm script chết).
- Đẩy lên kho ngay (§A8): đề thi toanmath `anh-batch.mjs day <BATCH> <MA…>` (phải in "⬆ đẩy … tệp", không LỖI); kho Hình `gan_hinh.mjs … --ghi`. Upload dùng `SUPABASE_SERVICE_ROLE` có sẵn trong `.env.local` (không in ra) — kiểm tên khoá trước, không đòi cấp key.

**Vẽ lại** — khi §A8 cho vẽ lại (gốc tệ hoặc có lệnh) [13/10 · Thùy; phạm vi đổi 15/11]
- Không còn "vẽ lại mọi ảnh không nằm ở `kho-anh/hinh_hoc/`": chỉ ảnh có mã lỗi a–f hoặc có lệnh. Đường đi: `ve_lai_xuat.mjs` → trạm Sonnet → `ve_lai_bang.mjs` (trái cũ | phải mới, mở TỪNG bảng) → `gan_hinh.mjs <gói>/moi --thay --ghi` (URL cũ lưu `scripts/anh/bien_ban/gan-hinh-*.json`; ảnh cũ KHÔNG xoá).
- Hình theo ĐỀ; ảnh cũ vênh đề ⇒ theo đề + ghi báo cáo; không phân xử được ⇒ không vẽ, giữ ảnh cũ, báo. Thà bỏ trống còn hơn vẽ sai.
- Giữ ĐỦ thông tin ảnh cũ mà đề cần (câu "Cho hình vẽ…" sống nhờ hình): mọi nhãn, số đo, ẩn, góc đánh số, ký hiệu giả thiết; vị trí tương đối giữ nguyên. Chỉ THÊM khi đề của chính bài nêu tên mà ảnh thiếu, và ô vuông cho góc vuông đề cho. Ảnh GeoGebra không có ký hiệu ⇒ hình mới cũng không thêm. **Không giữ** đường phụ lời giải, nét / cung của điều phải chứng minh (Hình chung).
- Biến thể vẽ theo đề CỦA BIẾN THỂ; tên tệp uuid chép nguyên từ `viec.md`.
- Tranh minh hoạ thực tế ⇒ sơ đồ tối giản (điểm + chữ ghi tên vật), giữ đủ số đo; câu cần chính bức ảnh hoặc ảnh chụp bài giải tay ⇒ không vẽ, giữ ảnh, báo.
- Trạm vẽ chỉ tạo tệp gói của mình; không sửa `ve_hinh_lib.mjs`, không DB, không git, không sửa đề / lời giải. Báo cáo mỗi hình một dòng (đạt / khác ảnh cũ có chủ ý / không vẽ) + chỗ nghi đề / lời giải sai.
- Hình lượng giác / vectơ (`hgt_cau_hoi`) và hình không gian lớp 11: CÓ vẽ lại theo luật chung 15/11 (§A8), theo kế hoạch từng đợt Thùy duyệt (§C12) — chưa có đợt được duyệt thì chưa vẽ (Thùy 18/11).

### Sai lầm cần tránh (Hình)

- [30/09 → 07/10] hiểu "sau dấu chấm xuống dòng" thành cách một dòng trống ⇒ dòng theo §A5.
- [21/09] tách sai 45 câu theo luật đã hết hiệu lực ⇒ luôn kiểm luật tách ý HIỆN HÀNH (bài–ý 09/11).
- [22/09] nhập docx có "Câu N." + câu dẫn cùng dòng làm RỚT câu dẫn ⇒ lấy cả phần chữ ngay sau "Câu N." trên dòng tiêu đề.
- [07/10] 4 hình nhãn đáy bị cắt; 2 hình cao quá bị thu nhỏ ⇒ chừa ≥ 35 px, cao ≤ 450 px.
- [07/10] điểm O ước mắt bị lệch ⇒ dựng bằng toạ độ theo ràng buộc.
- [08/10] subagent báo "đã verify ✓" mà chưa vẽ, chưa chạy verify, tóm tắt sai đề ⇒ không tin báo cáo; tự chạy cổng lọc từ cấm, mở bảng hình.
- [08/10] Haiku 0/21 câu dùng được (bịa đề từ ảnh WMF, bỏ verify, vi phạm whitelist) ⇒ không giao Haiku đọc ảnh, giải, verify, vẽ (§C1).
- [09/10] in nghiêng `*…*`; lí do "tứ giác có ba góc vuông" không có trong lý thuyết; hình đề vẽ đường chéo lộ kết luận ⇒ ba luật tương ứng ở trên.
- [09/10] đề xuất ghi câu đường tròn Hình 9 vào `hgt_cau_hoi` ⇒ hgt là lượng giác; hình phẳng vào `hinh_hoc_*`.
- [09/10 → 20/10] hướng dẫn của tài liệu ngầm dùng đường trung bình ⇒ tự chứng minh (luật ĐTB ở mục Khối 8).
- [13/10] lỗi trạm vẽ: khung quá rộng, ẩn số viết chữ đứng, hình con một hàng làm nhãn chạm nhau, số đo xa đỉnh ⇒ mở từng bảng.
- [28/10–02/11] 4 trạm gọi 5 tên cho cùng một lí do; gạch bằng nhau trên đoạn con; nhãn số gần sai cạnh; lí do sai chiều ("chia hai vế" thay "nhân hai vế") ⇒ thống nhất tên lí do, mở từng ảnh.
- [02/11] dòng "1 bài cho…, tính…" trong bản soạn bị bỏ vì tưởng ghi chú ⇒ đó là yêu cầu đề: tự soạn đề.
- [13/11] hình chỉ nằm ở máy nhà ⇒ máy công ty không ghi được, làm lại 140 hình ⇒ đẩy kho ngay.
- [14/11] giữa batch mới biết luật sơ đồ tư duy ⇒ đọc luật trình bày mới nhất trước khi giao trạm.
- [15/11] phiên bị ngắt, 6 trạm mất bản nháp ⇒ trạm ghi tệp nháp SỚM.
- [chung] INSERT thêm dòng khi đã có placeholder `la_mac_dinh=true` ⇒ 2 dòng mặc định trùng ⇒ query trước, có placeholder (`loi_giai` NULL) thì UPDATE; đọc lại từ DB sau khi ghi.
- [chung] nhiều trạm song song ghi đè tệp của nhau ⇒ tên script / thư mục hình PHẢI chứa tên nhóm.

### Công cụ Hình

| Đường dẫn | Việc |
|---|---|
| `scripts/anh/docx_trich.mjs "<file.docx>" <ra>` | Trích Word: `van_ban.md` (mỗi đoạn 1 dòng, công thức/hình đánh dấu `⟦imageN.wmf⟧`) + `png/` (WMF → PNG 4x; tự gọi `wmf_sang_png.ps1`) |
| `scripts/anh/ve_hinh_lib.mjs` | Thư viện vẽ: dựng điểm (`mid/foot/inter/rot/ray/bisector/reflect/doiXung/lerp/ngoaiTiep/noiTiep/goc`), nét (`seg/segDash/lineExt/circle/arc/poly`), ký hiệu (`tick/angleMark/rightAngle`), chữ (`label/num/bien/angleText/angleBien/sideText/labelOut`), xuất (`hinh()` + `xuatTat()`, hoặc `svgDoc` + `luu`) |
| `scripts/anh/ve_hinh_hh101_102.mjs` · `scripts/anh/ve_lai/HH00021-1.mjs` · `scripts/hinh-luyen/ve/K8-thu-1.mjs` | Tệp vẽ mẫu: phần Học · vẽ lại · hình theo ý |
| `scripts/anh/bang_hinh.mjs <thư mục> <bảng.png>` · `scripts/hinh-luyen/ve/to_soat.mjs <GÓI>` | Gom hình soát bằng mắt · tờ soát hình theo ý |
| `scripts/anh/nhap_hh_tu_draft.mjs HH000xx draft.md --cam "<regex>" --hinh <dir> --ra <dir>` | Nhập câu phần Học (câu đơn): chuẩn hoá, lọc từ cấm, 1 transaction; `--ghi`; `--lop giang` = kho trên lớp. **Chưa hiểu bài–ý, chưa hiểu sơ đồ tư duy** ⇒ bài nhiều ý / có chứng minh dùng `nhap_lo.mjs` |
| `kho-rules/hinh/lo/k8T-thales/nhap_lo.mjs "<thư mục>" [--chi-kiem]` | Cổng kiểm + nhập lô Hình–Học có bài–ý + sơ đồ tư duy; chặn từ cấm; lặp tới 0 lỗi |
| `kho-rules/hinh/lo/k8-thales/bai-nhieu-y/nhap_bai_y.mjs` | Mẫu nhập bài–ý (chạy thử rollback → `--ghi`; kiểm trùng lời dẫn) |
| `scripts/hinh-k7-cong-goc-them.mjs --dich HH00170\|HH00171\|HH00172 [--ghi]` · `scripts/hinh-k7-thang-hang-goc-khop-the-y.mjs [--ghi]` | Đẩy bài nhiều ý CHƯA tách (dạng chờ K7) vào ba bài Thẳng hàng: bảng `MAP` mã câu → ý thẳng hàng (đã đọc lời giải), tách bài–ý bằng logic `tach.mjs`, tạo thẻ ý ở bài đích, rút câu gốc; script thứ hai đổi `dang_chinh` câu gốc cho khớp thẻ ý + đếm theo công thức màn kho [23/11] |
| `scripts/anh/hh_lop_chep.mjs` | Chép câu sang kho trên lớp (không xoá gốc); sau đó `fn_hh_lop_xep` |
| `scripts/anh/gan_hinh.mjs <thư mục> [--ghi] [--thay] [--bang baitoan\|bienthe\|mohinh\|cachgiai\|hlbai\|hly]` | Upload + gắn hình theo tên tệp (= mã câu; `+` nối nhiều câu; `_de`/`_lg`); không đè trừ `--thay`; lưu biên bản URL cũ |
| `scripts/anh/ve_lai_xuat.mjs --khoi <k> \| --bai … \| --bang …` · `ve_lai_bang.mjs <gói>` | Xuất gói vẽ lại · bảng cũ \| mới |
| `scripts/anh/ve_moi_xuat.mjs --khoi <k> [--chi-duyet] [--bai …] [--moi-goi 6]` + brief `kho-rules/hinh/ve-moi/BRIEF.md` | **Vẽ hình MỚI cho đề thiếu hình** (nhãn `ve_moi`, §A8) [16/11 · Thùy "vẽ hình cho các bài trong kho 7"]: xuất gói theo ĐƠN VỊ = bài nhiều ý (`HHB…`, hình gắn vào BÀI) hoặc câu đơn (`HHC…`); bản chép cùng lời dẫn (bài thẳng hàng) ghép tên `HHBgốc+HHBchép.png`. Trạm Sonnet vẽ → **mở bảng ảnh `bang_hinh.mjs` kiểm TỪNG hình với đề** → gắn: bài nhiều ý `gan_hinh.mjs <thư mục> --bang baiy --nguon ve_moi`, câu đơn `gan_hinh.mjs <thư mục> --nguon ve_moi` (câu đã có hình lời giải mà thiếu hình đề ⇒ đặt tên `…_de.png`). Một gói không trộn bài_y với câu đơn. Câu thuần lý thuyết/trắc nghiệm không có gì để dựng ⇒ trạm ghi "KHÔNG CẦN HÌNH" (không vẽ); bài nhiều ý mà các ý dùng số đo KHÁC nhau ⇒ không gắn hình có ghi số (hình chung của bài mâu thuẫn ý) |
| `kho-rules/dai/lo/toanmath/anh-batch.mjs day <BATCH> <MA…>` | Đẩy hình đề thi lên kho |
| `scripts/kho/de-thi/dung-de-tu-soan.mjs` (`docSoDo`) → `ghi.mjs` | Cổng khuôn đề thi (kể cả sơ đồ tư duy), ghi câu + sơ đồ cùng transaction |
| `pdftoppm -r 150 -png …` | Ảnh trang / phóng to chỗ không rõ |

Mỗi trạm soạn Hình nhận ≤ 6 câu. Lời giao trạm vẽ phải ghi thẳng luật phân xử (không chỉ trỏ tệp khác) [13/10].

---

---

# PHẦN C — DÂY CHUYỀN

## C1. Vai

| Vai | Ai | Làm gì |
|---|---|---|
| Điều phối | Claude chính (phiên làm việc) | Chuẩn bị batch, giao trạm, chạy cổng, ghi DB, cập nhật sổ tình trạng, ghi sổ sai lầm. Không tự giải hàng loạt |
| Trạm soạn | **Sonnet** (subagent) | Đọc luật → phân dạng → đọc lý thuyết dạng → giải → thử đáp số |
| Trạm kiểm | **Opus** (subagent, ngữ cảnh sạch) | Giải mù phần được giao (§C5), rồi soát bản soạn |
| Máy | script | Bóc, đo trùng, cổng khuôn, so đáp số, xếp làn, ghi |
| Duyệt câu chưa chắc | **Trưởng khối** (trở lên) trên ERP | Sửa / duyệt / trả lại |
| Hậu kiểm | Thùy + người dùng kho | Thấy câu lỗi ⇒ xoá + báo ⇒ Phần D |

Haiku không dùng cho đọc đề từ ảnh, giải, vẽ hình (đo 08/10: 19/21 câu hỏng).
Luồng một phiên tự giải – tự kiểm – tự ghi (`auto-giai-scheduler.mjs`) đã ngừng 28/09 — không bật lại, không dựng luồng mới kiểu đó: người làm và người kiểm phải khác model hoặc là máy.
**Không tin báo cáo của subagent** ("đã verify", "hoàn tất") — điều phối tự chạy cổng và đọc tệp đầu ra.

## C2. Một batch đi qua 8 trạm

| # | Trạm | Ai | Ra |
|---|---|---|---|
| 1 | **Chuẩn bị** — chép file về thư mục làm việc, bóc câu (Word: máy đọc thẳng · PDF: máy gõ + ảnh trang) | máy + điều phối | danh sách đề, số câu, cảnh báo bóc |
| 2 | **Đo trùng kho** trước khi giải | máy | câu / đề trùng bị loại khỏi lượt giải |
| 3 | **Nạp luật** — một lần cho cả batch: Phần A + mục khối (Phần B) + bản đồ của khối (dạng · mô tả · lý thuyết · ví dụ) | trạm soạn | mã phiên bản luật ghi ở đầu tệp soạn |
| 4 | **Phân dạng** từng câu (§A3) | Sonnet | dạng + mức chắc + lý do, hoặc để trống |
| 5 | **Giải** theo lý thuyết của dạng (§A4–A8), thử đáp số bằng script | Sonnet | tệp soạn |
| 6 | **Kiểm** — máy so nhân chứng; Opus giải mù phần của mình rồi soát (§C5) | máy + Opus | biên bản kiểm từng câu |
| 7 | **Cổng + xếp làn** (§C6) | máy | 🟢 vào kho · 🟡 hàng duyệt |
| 8 | **Ghi DB** — không chờ lệnh, không cần trang HTML duyệt | điều phối | số câu vào kho / vào hàng duyệt / trỏ câu cũ |

Xong mỗi trạm của mỗi đề ⇒ chạy lại sổ tình trạng (§C8).

## C3. Lô mẫu — duyệt một lần cho mỗi (khối × loại kì)

- Các batch **cùng khối, cùng loại kì** (giữa kì I · cuối kì I · giữa kì II · cuối kì II · thi vào lớp trên) có phạm vi kiến thức và khuôn đề giống nhau ⇒ **duyệt mẫu MỘT lần**, sau đó cả loạt chạy theo mẫu đã duyệt, không dừng hỏi lại.
- Sang loại kì khác của cùng khối (vd từ cuối kì I sang giữa kì II) hoặc sang một cuốn sách mới ⇒ batch đầu tiên lại là lô mẫu.
- Lô mẫu: toàn bộ câu đi làn duyệt (không tự vào kho). Mỗi chỗ người duyệt sửa ⇒ một dòng luật vào mục khối ở Phần B. Lô mẫu qua rồi mới mở làn tự vào kho cho (khối × loại kì) đó.
- Bảng "đã duyệt mẫu" từng khối × loại kì: §C9.

## C4. Rào "đã đọc luật"

- Dòng đầu tệp soạn: `luat: <mã phiên bản>` — mã lấy từ lệnh cắt luật của batch (băm nội dung Phần A + mục khối đang dùng + Hình chung + Phần C).
- Tệp soạn có mã khác mã hiện hành = soạn theo luật cũ, không được lọt. Trạm kiểm đối chiếu mã bằng tay cho tới khi cổng kiểm được (§C10 mục 4).
- Brief giao trạm **không chép lại luật** — chỉ gồm: phần cắt từ file này + danh sách đề + đường dẫn. Không còn brief viết tay theo batch.

## C5. Opus kiểm phần nào

Opus **giải mù** (chưa mở bản soạn) rồi mới soát, cho:
1. mọi câu **không có nhân chứng máy**: chứng minh, câu Hình, tự luận lời văn, đề không có đáp án in;
2. mọi câu Sonnet treo `**Chưa chắc:**` hoặc ghi đề sai;
3. **mẫu ngẫu nhiên 15%** của phần còn lại (máy rút, Sonnet không biết câu nào).

Câu còn lại: nhân chứng là đáp án in kèm hoặc code tính lại — máy so.
**Tỉ lệ lọt** = trong mẫu 15%, số câu Opus ra đáp số khác / tổng mẫu. Lọt > 2% ⇒ batch đó Opus kiểm 100%, và ghi nguyên nhân vào Phần D.
Khi soát, Opus sao bản gốc (`.soan.goc.md`) trước khi sửa — số câu bị sửa là thước đo của trạm soạn.

## C6. Điều kiện TỰ VÀO KHO (làn 🟢)

**(Thùy 18/11 — thay luật 15/11 "đủ cả bốn điều kiện, trong đó đáp số phải có nhân chứng thứ hai trùng khớp + qua cổng khuôn".)** Lời giải của dây chuyền sai rất ít, tỉ lệ chấp nhận được; chỗ phải giữ là PHÂN DẠNG. Câu thành `da_duyet = true` khi đủ **cả ba**:
1. Máy (Claude) gán dạng ở mức tự tin **cao** (câu Đúng/Sai: đã gán chủ đề) — **hoặc dạng do người chỉ định** (luồng bổ sung bài lẻ §C11).
2. Câu **có đáp án đầy đủ** theo loại câu (trắc nghiệm · Đúng/Sai · trả lời ngắn: có đáp án; tự luận: có lời giải).
3. **Không bị máy nghi** (không mang cờ nghi). Câu có `**Chưa chắc:**`, ghi đề sai, hoặc bị trạm kiểm sửa ĐÁP SỐ ⇒ đánh dấu nghi kèm lý do lúc ghi.

KHÔNG đòi "bên thứ hai xác nhận đáp số" làm điều kiện vào kho. Trạm kiểm (§C5) và cổng khuôn (trạm 7 §C2) vẫn là trạm của dây chuyền — tệp soạn không qua cổng thì không ghi — nhưng không phải điều kiện xếp làn. Đáp án của câu đã vào kho được rà lại theo Phần E4.
**Câu CLONE:** Claude kiểm xong thì tự duyệt, không qua hàng duyệt của người (Thùy 18/11).
Thiếu một điều kiện ⇒ **làn 🟡**: ghi `da_duyet = false`, đánh dấu nghi kèm lý do ⇒ hiện ở màn duyệt của **trưởng khối** (chỉ trưởng khối đúng khối trở lên bấm duyệt — Phần E1).
Câu ở dạng chờ luôn là làn 🟡 (DB chặn duyệt câu dạng chờ). **Lô mẫu (§C3) luôn là làn 🟡 — DB thực thi từ 21/11:** lô mẫu khai báo vào sổ `kho_lo_mau` (hàm `fn_kho_lo_mau_dang_ky`, quản lý môn trở lên) với mẫu `ten_de_goc`; còn `duyet_mau_at` rỗng thì trigger `_bdm_tu_duyet_sau_gan` KHÔNG tự duyệt câu thuộc lô đó; quản lý môn duyệt mẫu (`fn_kho_lo_mau_duyet`) xong mới mở làn 🟢 cho lô và các lô sau cùng (khối × loại kì).

**Bảng ĐƯỜNG VÀO KHO (Thùy 21/11 — một chỗ duy nhất; chỗ khác trỏ về đây, đừng chép lại).** Mỗi đường có điều kiện tự duyệt riêng; đường nào ghi `duyet_nguon` gì thì hậu kiểm đo tỉ lệ lọt riêng cho đường đó (`scripts/kho/do-lot.mjs`):

| Đường | Ai/cái gì ghi | Điều kiện câu thành `da_duyet=true` | `duyet_nguon` | Lô mẫu |
|---|---|---|---|---|
| **Batch giải bài / đề thi** (Phần C, `ghi.mjs`) | điều phối ghi, DB tự duyệt | §C6: máy gán dạng mức cao + đủ đáp án + không bị nghi (không đòi nhân chứng đáp số) | `ai` | Có — luôn 🟡 tới khi duyệt mẫu |
| **Clone batch** (§C13, `duyet-nhap-clone.mjs`) | Sonnet sinh, script duyệt | Máy kiểm đáp số theo dạng (bảng `KIEM`) HOẶC Opus giải mù 20%/dạng (≥3 câu; có lệch ⇒ kiểm 100% dạng) — **chặt hơn §C6 vì clone sinh hàng loạt (bài học 08/11, 49/488 sai)** | `ai` | Không áp |
| **Chat trưởng khối** (`spec-quan-ly-chat-luong` §6.5) | trưởng khối bấm "Vào kho" | Dạng mức cao ⇒ vào kho + duyệt luôn (người bấm là người duyệt); dạng vừa/không khớp ⇒ hàng duyệt. **Clone trong chat KHÔNG tự duyệt** — người duyệt trong chat | `nguoi` | Không (người đã nhìn bài) |
| **Bổ sung bài lẻ** (§C11) | Thùy/trưởng khối chỉ định dạng | Dạng người chốt (điều kiện 1 coi là đạt) + đủ điều kiện 2–3 | `ai`/`nguoi` | Không |
| **Nhập sách** (ghép bài + lời giải sách, vd ME 5T) | script nhập | Lời giải sách là nhân chứng đáp số; mục `chua_chac` và bài có hình phải người xem ảnh trước | theo lô | Có (nguồn mới) |
| **Màn Duyệt lời giải AI** | trưởng khối đúng khối bấm | Người duyệt chuẩn hoá rồi ký — **DB khoá từ 21/11**: chỉ trưởng khối đúng (môn × khối) trở lên, `p_nguoi` phải là chính người đăng nhập | `nguoi` | — |

Đổi điều kiện của một đường ⇒ sửa bảng này TRƯỚC, rồi mới sửa code.

## C7. Nhãn dữ liệu và hậu kiểm

- Câu do dây chuyền giải: `nguon_giai = 'ai'`, `giai_method = 'claude_code'`, ghi model soạn; câu tự vào kho ghi `duyet_nguon = 'ai'`. Lời giải chép nguyên văn của người (tài liệu có lời giải, không sửa) mới là `nguon_giai = 'nguoi'`.
- **Hậu kiểm**: ai thấy câu lỗi ⇒ báo sai / xoá (xoá = vào kho rác, mã không cấp lại). **Câu bị báo sai (đề / đáp án sai): Claude tự đọc, tự quyết, tự sửa câu trong kho — KHÔNG có bước người duyệt; người nhận BÁO CÁO (đã sửa gì, vì sao) và hậu kiểm, sai thì người sửa lại sau** (Thùy 18/11; Phần E1). **Chỗ báo sai (Thùy 21/11): MỌI câu trong kho có nút 🚩 ở mọi nơi nhân sự nhìn thấy câu** (kho, builder, tìm câu, bản đồ, phiên Claude) — 5 loại: trình bày · tính sai · sai đề · sai dạng · khác; học sinh báo qua ⚑ khi luyện. Luồng: báo (`fn_kho_bao_sai`) → tự thành nhận xét cho Claude (`kho_nhan_xet`, cùng luồng "✎ Cần sửa" — `docs/quy-trinh-sua-theo-nhan-xet.md`) → Claude sửa/ghi → báo cáo tự đóng; **trưởng khối đúng khối cũng được sửa hoặc xoá luôn nhưng PHẢI báo trước** (`fn_kho_bao_sai_xu_ly` bắt buộc có loại + ghi chú + một dòng "đã làm gì", cùng giao dịch). Mỗi báo cáo đã đóng ⇒ điều phối ghi một dòng Phần D qua `scripts/kho/bao-sai.mjs --ds` rồi `--da-ghi` (cột `ghi_spec_at`): sai gì · lọt ở trạm nào · luật rút ra · có phải quét các câu cùng dạng / cùng batch không. Giới hạn đã biết: ai sửa/xoá câu bằng đường khác (sửa thẳng bảng, script) không bị buộc báo — dấu vết còn ở `kho_cau_log`.
- Lỗi lặp lại cùng kiểu ≥ 3 câu ⇒ không vá từng câu: sửa luật ở Phần A/B, quét lại các câu cùng dạng.
- Không chạy truy vấn nặng 17–22h (giờ học sinh dùng app). Không chạy hai lượt ghi song song (cấp mã câu va nhau).

## C8. Quản lý batch toanmath

- Sổ: `kho-rules/dai/lo/toanmath/TINH-TRANG.md`, **tự sinh** bởi `tinh-trang.mjs` từ tệp của từng đề (soạn · kiểm · soát · khúc · dấu đã ghi) — không sửa tay.
- **Chạy lại sau MỖI việc làm trên batch** (chuẩn bị · giao soạn xong · soát xong · ghép khúc · ghi DB) và commit cùng việc đó. Phiên nào đụng batch mà không cập nhật sổ = làm sai quy trình.
- Tệp duy nhất ghi tay: `batch/<B>/treo.json` — đề treo có chủ đích + lý do + chờ ai quyết.
- Mỗi lượt báo Thùy về toanmath mở đầu bằng 3 số: batch xong / đang dở / chưa chuẩn bị, rồi danh sách đề đang dở theo tình trạng.
- Thứ tự làm (Thùy 12/11): cuối kì trước, khối 9 → 8 → 7 → 6 → 11 → 10 → 12; rồi giữa kì cùng thứ tự; rồi thi vào lớp trên. Đề cương K12 không làm.

## C9. Đã duyệt mẫu (khối × loại kì)

| Khối | Giữa kì I | Cuối kì I | Giữa kì II | Cuối kì II | Thi vào lớp trên |
|---|---|---|---|---|---|
| 6 | ✔ (bộ đề 10/10) | ✔ (toanmath 13/11) | — | — | |
| 7 | — | ✔ (toanmath 13/11) | — | — | |
| 8 | ✔ (bộ đề 10/10) | ✔ (toanmath 13/11) | ⏳ lô mẫu = B066, 15 đề / 171 câu đã ghi 21/11, chờ duyệt mẫu (`kho_lo_mau`) | — | |
| 9 | ✔ (bộ đề 18/10) | ✔ (toanmath 12/11) | ✔ (toanmath B055, Thùy gật 21/11 — chưa bấm `fn_kho_lo_mau_duyet`) | — | — |
| 10 | — | ✔ (toanmath 14/11) | — | — | |
| 11 | — | ✔ (toanmath 14/11) | — | — | |
| 12 | — | ✔ (toanmath 14/11) | ⏳ lô mẫu = B106, B108 (15/11) | — | — |

"✔" = đã có ít nhất một batch Thùy xem và cho ghi theo quy trình cũ; "—" = batch đầu tiên của ô đó là lô mẫu.

**Ngoài bảng (Thùy 21/11):** lô **CLC lớp 6 → khối 5T** (58 đề thi; 720 câu đã ghi vào kho 5T, 344 câu tự duyệt vì khi đó trigger chưa biết lô mẫu) **coi như ĐÃ duyệt mẫu** — không rút duyệt lại 344 câu; 188 câu máy nghi vẫn chờ trưởng khối. Từ 21/11 lô mẫu khai báo vào `kho_lo_mau` (§C6) nên lỗ hổng này đóng.

## C10. Code còn nợ so với luật này (làm xong thì xoá dòng)

| # | Việc | Hiện trạng (rà 18/11) |
|---|---|---|
| 3 | Đề thi và bài học Hình đi qua cổng ghi có biên bản + băm nội dung | Đề thi: `ghi-batch.sh` đã chặn đề chưa "KẾT LUẬN: ĐẠT", chưa băm nội dung, `ghi.mjs` chưa qua `cong-ghi.mjs` · bài học Hình: chưa có |
| 4 | Cổng kiểm dòng `luat:` của tệp soạn (§C4) | Lệnh cắt luật + mã đã có 15/11 (`cat-luat.mjs`, `ghep-brief.mjs`); cổng `dung-de-tu-soan.mjs` chưa đọc `luat:` |
| 5 | Chạy ĐO tỉ lệ lọt định kỳ (§C5): rút mẫu → Opus giải mù → so → ghi sổ | **Công cụ có từ 21/11** (`scripts/kho/do-lot.mjs`, sổ `kho_do_lot`, mig 202611210824). Chưa có lượt đo thật nào; chưa có lịch (ai giao Opus giải mù, bao lâu một lần, đường vào kho nào đo trước) — chờ Thùy chốt cùng E4 |
| 7 | Giao diện: lời giải Hình khoảng cách dòng +20% | Chưa làm |
| 8 | Vá nhãn các câu đề thi đã ghi sai `nguoi` | Đã đếm 18/11: 52.442 câu (Đại 41.355 · HGT 3.872 · Hình 7.215); nhân chứng = 889 tệp `.soan.md` trong repo; chưa vá |
| 9 | Cổng `--khoi 6` và `--khoi 12` nhận `kho=hinh_hoc` | Chưa nhận ⇒ K12 tạm ghi `hgt` + Ghi chú; K6 báo điều phối |
| 10 | `nhap_hh_tu_draft.mjs` (bài học Hình) hiểu mô hình bài–ý + khối Sơ đồ tư duy | Chưa |
| 11 | Đọc trường `dang=` / `chac=` của dòng câu (§A10) khi ghi ⇒ đề xuất / gán dạng (gộp mục 6 cũ "trạm soạn phân dạng trong cùng lượt") | Tệp soạn đã có hai trường, `ghi.mjs` đã nhận `dang_bai` / `dang_bai_chac`; cổng chưa đọc |
| 12 | Hai quy ước dữ liệu dòng (đề thi: đoạn cách dòng trống, màn hình gộp · bài học Hình: `\n` đơn) — thống nhất về một | Chưa |
| 13 | Mọi đường tạo câu có hình đề ghi nhãn nguồn hình, mặc định `goc` (§C12) + lập KẾ HOẠCH vẽ lại hình theo khối × loại hình, có ngân sách token mỗi đợt, Thùy duyệt từng đợt (Thùy 17–18/11) | Chỉ `gan_hinh.mjs` và `ghi.mjs` ghi nhãn; 14.438 / 14.462 hình đề "chưa rõ nguồn" ⇒ checklist chưa dùng được; chưa có kế hoạch vẽ |
| 15 | Quy trình Claude tự xử câu báo sai: tự đọc – tự sửa – báo cáo cho người – ghi vết từng lần sửa (Thùy 18/11 — §C7) | **Làm một nửa 21/11:** báo sai của nhân sự đã nối vào luồng `kho_nhan_xet` (Claude nhặt bằng `nhan-xet.mjs --ds`, sửa, ghi; báo cáo tự đóng) + `bao-sai.mjs` đưa báo cáo đã đóng sang Phần D. **Còn:** lịch chạy (hiện chỉ khi Thùy gọi / tối), báo cáo gửi ai, và báo của HỌC SINH (92 đang mở, 34 đã đóng chưa ghi Phần D) chưa nối sang Claude — hiện chỉ trưởng khối xử |
| 16 | Quy trình rà lại đáp án các câu trong kho (Thùy 18/11 — Phần E4) | Chưa thiết kế |
| 17 | Dọn DB của tool "Giải bài kho chung" đã xoá 27/10 (22 hàm `fn_giaibai_*`, 3 view `v_giaibai_*`, 11 dòng treo) | Chỉ làm khi Thùy gật (Luật xoá) |
| 18 | Clone: nháp không có cột `menh_de` ⇒ gốc Đúng/Sai không clone được; gốc có hình đề cũng không (§C13) | Chưa làm; cổng hiện bỏ qua các gốc này |
| 19 | Clone: lời giải 19 dạng còn MỘT mạch (bám mẫu gốc), chưa tách hai phần theo §A5 | Duyệt bằng `mot_phan`; viết lại khi Thùy yêu cầu |
| 20 | Viết lại lời giải K3 kho cũ sang khuôn hai phần (Khối 3, 20/11) | Đã làm thử 50/2.866 câu (20/11, kết quả tốt: 0 sai đáp số); còn ~2.740 câu chưa có khuôn — chờ Thùy gật khuôn K3 + lệnh quét (§E2 đang cấm quét hàng loạt) |

Cho tới khi các mục trên xong: batch chạy bằng script hiện có, áp luật Phần A/B; câu ghi `da_duyet=false`, rồi DB tự duyệt khi máy gán dạng mức cao cho câu đủ điều kiện §C6 (trigger 05/11) — làn tự vào kho đang chạy bằng đường này.

## C11. Luồng BỔ SUNG BÀI LẺ theo chỉ định (Thùy 15/11)

Dùng khi Thùy (hoặc trưởng khối) đưa một hoặc vài bài và **chỉ định sẵn**: bài vào **dạng nào** và vào **kho trên lớp hay kho về nhà**. Khác batch ở 3 điểm; mọi luật khác của Phần A/B giữ nguyên.

1. **Bỏ trạm phân dạng (§A3, trạm 4 §C2).** Dạng là của người chỉ định ⇒ ghi là **người chốt** (`nguon='nguoi'`, `dang_bai_chot: true`), không đề xuất, không "dạng sau thắng", không đổi dạng.
   Đọc lại bài mà thấy **không khớp** dạng chỉ định (mô tả / phương pháp của dạng không giải được bài) ⇒ **không tự đổi**: hỏi lại người chỉ định một câu ("bài này giải bằng … — dạng X là … — vẫn để X?") rồi mới ghi.
2. **Vẫn đọc luật khối + lý thuyết + ví dụ của ĐÚNG dạng chỉ định** trước khi giải (nguyên tắc 2 và 4 §A1). Lời giải theo phương pháp của dạng đó.
3. **Kho theo chỉ định, không theo luật sách tham khảo (§A9):**

   | Chỉ định | Đại | Hình | Hình giải tích |
   |---|---|---|---|
   | **Trên lớp** (bài giảng) | `dai_cau_lop`, vai `giang`, qua `fn_dai_lop_them` (câu đã có trong kho luyện ⇒ `fn_dai_lop_chep_tu_kho`) | `hinh_hoc_cau_lop` qua `fn_hh_lop_them` (`nhap_hh_tu_draft.mjs --lop giang`; câu đã có ⇒ `fn_hh_lop_chep_tu_kho` / `hh_lop_chep.mjs`) | **chưa có kho trên lớp** ⇒ báo người chỉ định, không tự dồn vào kho về nhà |
   | **Về nhà** (luyện) | `dai_cau_hoi` qua engine nhập (`scripts/_kho_insert.mjs`, trường `dang_bai` + `dang_bai_chot: true`) | `hinh_hoc_cau_hoi` (bài–ý, §A7) | `hgt_cau_hoi` như Đại |

   Không nói rõ trên lớp hay về nhà ⇒ hỏi, không đoán.
4. **Giải và kiểm như thường:** Sonnet soạn (ít bài thì một trạm), thử đáp số bằng script (§A12); Opus giải mù khi không có nhân chứng máy (§C5 — với bài lẻ: mọi bài chứng minh / Hình / không đáp án); đo trùng kho trước khi ghi (trùng ⇒ báo mã câu cũ, kho trên lớp thì chép từ câu cũ).
5. **Vào kho:** điều kiện 1 của §C6 coi là đạt (người chốt dạng); còn điều kiện 2–3 như thường ⇒ đủ thì vào kho luôn, thiếu thì vào hàng duyệt trưởng khối. Báo lại: mã câu · dạng · kho · vào thẳng hay chờ duyệt.
6. Không cần lô mẫu (§C3) — người chỉ định đã nhìn bài. Không ghi vào sổ toanmath.

---

## C12. Bộ đếm HÌNH ĐỀ theo khối (Thùy 15/11 — ĐÃ BUILD, mig 202611152245 + 202611152255)

- **Sổ: `kho-rules/SO-HINH.md`** — tự sinh bởi `node scripts/kho/so-hinh.mjs` (chỉ đọc DB, ~0,2–0,7 s), không sửa tay.
  Theo khối (gộp kho) và theo kho × khối: có hình đề · giữ gốc · vẽ lại (chia mã a–f) · vẽ theo lệnh · vẽ mới · **chưa rõ nguồn** · **lệnh đang chờ**; cuối sổ là danh sách lệnh đang chờ.
  `ghi-batch.sh --ghi` tự dựng lại sổ; lượt ghi hình khác ⇒ chạy tay lệnh trên rồi commit sổ cùng việc đó.
- **Dữ liệu (pure-derive):** `kho_hinh_nguon` — một dòng nhãn lúc GẮN hình (kho · mã câu · URL · nguồn · mã lỗi) · `kho_hinh_lenh_ve` — một dòng mỗi câu được ra lệnh.
  Đếm ở `fn_kho_hinh_dem(mon)`. "Chưa rõ nguồn" = câu có hình đề mà không có nhãn khớp URL hiện tại (ảnh đổi mà không ghi nhãn ⇒ tự rơi về đây). "Đang chờ" = lệnh chưa có nhãn vẽ ghi sau nó.
  Kho đếm: `dai` · `hgt` · `hinh_hoc` · `hinh_hoc_lop` (Hình trên lớp) · `hinh_luyen` (bài Hình luyện) · `hinh_luyen_y` (hình theo ý — khối lấy từ bài cha).
- **Ảnh cũ (trước 15/11, 13.306 hình đề):** để "chưa rõ nguồn" — CHỈ xét khi có lệnh theo khối (Thùy 15/11). Không chạy lượt AI xét hàng loạt khi chưa có lệnh.
- **Mặc định nhãn `goc`** (Thùy 17/11): mọi đường tạo câu có hình đề (đề thi · sách · bài học Hình · nhập trên ERP) ghi nhãn cùng lượt ghi; không khai thì là `goc`. Code chưa đủ — §C10 mục 13.
- **Bộ đếm này là CHECKLIST cho kế hoạch vẽ lại hình** (Thùy 18/11): vẽ lại theo KẾ HOẠCH từng đợt (khối × loại hình, có ngân sách token mỗi đợt), Thùy duyệt từng đợt rồi mới ra lệnh vẽ. Hình lượng giác / vectơ / hình không gian lớp 11 CÓ vẽ lại theo luật chung 15/11 (§A8), cũng theo kế hoạch đó.
- **Ghi nhãn — ở đâu:**
  - Đề thi / đề cương: dòng `**Hình:** <tệp> | nguon=…` trong tệp soạn ⇒ cổng `dung-de-tu-soan.mjs` đọc (sai khuôn ⇒ lỗi; thiếu ⇒ nhắc) ⇒ `ghi.mjs` ghi nhãn cùng transaction (tóm tắt in "nhãn nguồn hình x/y").
  - Gắn / thay hình kho Hình, HGT, Hình luyện (bài + ý), kể cả gói do `nhap_hh_tu_draft.mjs --ra` chép ra (lệnh in sẵn câu gắn kèm `--nguon`): `gan_hinh.mjs <gói> --nguon <goc|ve_lai:<a–f>|ve_lenh|ve_moi> [--thay] --ghi` — **`--thay` không kèm `--nguon` bị chặn**. Gói trộn nhiều nguồn ⇒ tách gói.
  - `anh-batch.mjs` (toanmath) chỉ đẩy hình NHÁP lên thư mục làm việc, không gắn vào câu ⇒ không cần nhãn.
  - Script khác cần ghi nhãn: `import { ghiNhanHinh } from 'scripts/kho/so-hinh.mjs'`, gọi trong CÙNG transaction với lệnh gắn `anh_de`.
- **Ra lệnh vẽ lại** (Thùy / trưởng khối nói trong chat ⇒ điều phối chạy):
  `node scripts/kho/so-hinh.mjs lenh --kho <dai|hgt|hinh_hoc|hinh_hoc_lop|hinh_luyen|hinh_luyen_y> (--khoi <k> | --ma <mã,…> | --de "<tên đề>") --ra-boi "<người>" [--ly-do "…"]` (chạy thử) rồi thêm `--ghi`.
  Vẽ xong gắn bằng `gan_hinh.mjs … --thay --nguon ve_lenh --ghi` ⇒ lệnh tự hết chờ.

## C13. Fill kho bằng CLONE — đường tự duyệt (Thùy 21/11; đã chạy K6–K8 Đại)

**Mục tiêu:** mỗi dạng bản đồ có ≥30 câu dùng được (kho_chuan + đủ hình + đủ đáp án; đo bằng `scripts/do-dang-du-cau.mjs`, chỉ đọc). Fill clone trước, MCQ sau.

- **Luồng:** yêu cầu (`dai_cau_hoi_yeu_cau_clone`) → Sonnet sinh biến thể giữ cấu trúc + các bước của gốc → `hangdoi-clone.mjs --ghi` vào bảng nháp `dai_cau_hoi_clone_cho_duyet` → `scripts/kho/clone/duyet-nhap-clone.mjs` kiểm rồi đưa vào `dai_cau_hoi` (dạng kế thừa từ gốc, `da_duyet=true`, `duyet_nguon='ai'`, `giai_method='clone_doi_so'`, qua `cong-ghi` biên bản). Mặc định chạy thử (ROLLBACK); `--ghi` mới ghi.
- **Hai đường kiểm đáp án (nhân chứng thứ hai độc lập, §C6):**
  1. **Máy kiểm theo dạng** — bảng `KIEM` trong script: mỗi dạng tính được có một hàm tính lại đáp số + kết luận độc lập với Sonnet. Sai đáp số hoặc sai kết luận ⇒ loại.
  2. **Opus giải mù** cho dạng suy luận: Opus chỉ thấy đề, giải xong mới đối chiếu. Rút ngẫu nhiên **20%/dạng (≥3 câu)**; dạng nào có câu lệch ⇒ Opus kiểm **100%** dạng đó, chỉ duyệt câu khớp. Biên bản đưa vào script bằng `--duyet-lo <tệp>` (`{ "<NDB>": { ids, ghi_chu, mot_phan } }`).
- **Loại ngay (đánh `tu_choi_at`, KHÔNG sửa tay):** đề mơ hồ, đề trần thiếu lời dẫn, `\begin{cases}` dùng cho "hoặc", `\{` ngoài `$`, thiếu ngoặc nhóm (`5^{12}`), số hạng tự do sai dấu, lời giải chỉ lặp lại đáp án (NDB01206). Lỗi theo mẫu ⇒ sửa brief sinh rồi sinh lại.
- **Không clone được:** gốc có hình đề, gốc Đúng/Sai (nháp chưa có `menh_de`); dạng 0 gốc ⇒ phải nhập gốc (§C10 mục 18).
- **Bài học vận hành:** mỗi trạm Sonnet một thư mục tạm riêng (dùng chung thì ghi đè nhau); validate cấu trúc output (`kiem-out`) trước khi nạp.
- **Kết quả 21/11 (Đại, dạng đủ 30):** K6 154/163 · K7 60/72 · K8 63/67; ~2.400 câu duyệt, ~46 loại. Còn thiếu: dạng 0 gốc (K6: NDB01224, 01231, 01410, 01619, 01621, 03068 · K7: 00797, 01343, 01345, 01346, 01350 (+01340, 01349 chỉ có nháp) · K8: 01427, 01356:2) và dạng hao do loại (K6: 00367, 00403, 01229 · K7: 00441, 01037, 01344, 01355, 01206 · K8: 00982, 00983). 8T/4T/5T chưa làm. Hình đề K6–K8 do phiên vẽ hình xử lý riêng (commit dede36db).

- **Kết quả K6 chốt 21/11 (sau đợt bù):** **169/171 dạng đủ 30** (đo `do-dang-du-cau.mjs`). Bù bằng `scripts/kho/clone/k6-fill.mjs` + bộ kiểm độc lập `k6-fill-kiem.mjs` (đọc lại đề từ chữ, tính lại bằng BigInt/vét cạn, cố tình sai đều bị bắt):
  · 3 dạng hao do loại (có gốc): NDB00367 · 00403 · 01229 — 22 câu clone qua đường chuẩn (yêu cầu → nháp → `duyet-nhap-clone.mjs`, KIEM thêm 3 mục).
  · 6 dạng 0 gốc: NDB01224 · 01231 · 01410 · 01619 · 01621 · 03068 — **không có nguồn sách trong kho-rules** (chỉ có mô tả/ví dụ dạng) nên soạn **bài lẻ theo chỉ định dạng (§C11)**: bộ sinh bằng code, đáp số tính bằng code, 207 câu `nguon='le'`, `giai_method='claude_code'`, `duyet_nguon='ai'`. **Cách hiểu dạng do người soạn suy từ tên/mô tả — Thùy / trưởng khối K6 nên liếc lại**, nhất là NDB01621 ("Tìm x dùng GTNN của bình phương" — hiểu là tìm x từ điều kiện bình phương ≥ 0: bình phương ≤ 0, tổng bình phương, x làm biểu thức nhỏ nhất/lớn nhất) và NDB03068 (tìm cặp a<b khi biết BCNN và tích).
  · **Không fill được (2 dạng, ngoài phạm vi):** NDB03051 (3 câu) · NDB03052 (2 câu) "Vẽ thêm hình để có trục/tâm đối xứng" — hình đề, do phiên vẽ hình xử lý.
  · NDB01621 đang đúng 30 câu (không dư); mấy dạng khác dư 3–10 câu.
- **Luật số câu theo độ khó (Thùy 21/11):** dạng **độ khó (`muc_do`) ≥ 4 chỉ cần 10–30 câu** — số câu do điều phối (Claude) quyết theo độ biến đổi được của dạng; thiếu thì Thùy bảo clone thêm sau. Dạng độ khó ≤ 3 vẫn đích 30. **K7 21/11** (`scripts/kho/clone/k7-fill.mjs`, bộ kiểm phân số BigInt đọc lại đề): NDB00797 → 15 · 01343 → 14 · 01345 → 15 · 01346 → 20 · 01350 → 14 (độ khó 4–5, soạn bài lẻ theo chỉ định dạng vì 0 gốc) · NDB01037 → 37 · 01206 → 31 · 01355 → 32 (độ khó ≤ 3, bù đủ 30). Giữ nguyên NDB00441 (29) · 01344 (28) vì độ khó 4. **Chưa làm:** NDB01340 (12 câu nháp chờ trưởng khối duyệt) · NDB01349 (hình đề, phiên vẽ hình).
- **K8 Đại 21/11 (`scripts/kho/clone/k8-fill.mjs`):** 64/67 dạng đủ 30. NDB00982 (độ khó 3) bù 12 câu bài lẻ + **sửa 5 câu clone sai đáp án** (xem Phần D); NDB01427 (độ khó 4) soạn 12 câu (trước đó 0 câu dùng được, còn 2 nháp chờ trưởng khối duyệt); NDB00983 (độ khó 5) giữ 13 câu, rà đáp án đúng hết. **Chưa làm:** NDB01356 (hai câu gốc có hình đề — phiên vẽ hình).
- **Luật ưu tiên cách giải — nhóm Số chính phương K6 (NDB02800 · NDB02801; Thùy 21/11):** "chứng minh không phải số chính phương" ưu tiên **cách 1** = *chia hết cho số nguyên tố $p$ nhưng không chia hết cho $p^2$*; thứ hai **cách 2** = chữ số tận cùng; thứ ba **cách 3** = số dư khi chia cho 3, 4, 5. **Clone chọn bài chủ yếu thuộc cách 1 và lời giải dùng cách 1**; chỉ khi cách 1 không dùng được mới sang cách 2, 3. Đã bù 60 câu cách 1 (`scripts/kho/clone/k6-scp.mjs`, bộ kiểm BigInt: không là SCP · $p$ nguyên tố · $p\mid A$ · $p^2\nmid A$). Trước đó NDB02800 có 18/30 câu giải bằng chữ số tận cùng, NDB02801 chỉ 8/31 bằng cách 1 — **đã dọn xong cùng ngày** (`k6-scp-sua.mjs`): 26 câu cũ giải được bằng cách 1 → viết lại lời giải theo cách 1; 35 câu không giải được bằng cách 1 (tận cùng · số dư · kẹp · luỹ thừa số mũ lẻ · abcabc · đề không thuộc dạng) → **xoá mềm vào kho rác** (khôi phục: `update dai_cau_hoi set xoa_at = null where ma_cau = …`). Còn NDB02800 = 51 câu, NDB02801 = 35 câu.
