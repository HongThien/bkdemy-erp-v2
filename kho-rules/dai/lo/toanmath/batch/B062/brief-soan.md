luat: d6889bbc6d49

# BRIEF SOẠN — khối 9 (cắt từ spec-giai-bai.md, KHÔNG sửa tay)

> VAI: **TRẠM SOẠN (Sonnet)**. Làm theo spec §C2 trạm 3–5: đọc HẾT luật dưới đây MỘT lần cho cả batch → phân dạng từng câu → đọc lý thuyết + ví dụ của dạng → giải → thử đáp số bằng script → chạy cổng.
> Dòng đầu tệp soạn chép đúng: `luat: d6889bbc6d49`

## ĐẦU RIÊNG CỦA BATCH

# ĐẦU RIÊNG BATCH B062 — K9 GIỮA KÌ II (phần `Đề thi/GKII` + `Đề cương/GKII` của batch; đề GKI nằm chung batch KHÔNG thuộc việc này) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B062-NN`. Danh sách: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B062\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `de` / `hd` (trang đề / trang đáp án trong file PDF gốc, DÒ TỰ ĐỘNG ⇒ bạn kiểm lại bằng ảnh trang), `co_chu` (false = SCAN: gõ lại từ ảnh).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B062\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to chỗ không chắc: spec §A11.
- Tệp soạn: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\B062\<MA>.soan.md` (đề cương dài > ~120 câu: chia khúc, spec §A10). Đề cương: đầu tệp có `kieu: de_cuong`. Tên đề: `Đề kiểm tra giữa học kì 2 Toán 9 năm <năm học> — <trường (phường/quận)> (<mã đề>)` (đề cương: `Đề cương ôn tập giữa học kì II Toán 9 — <trường>`); `nam:` = năm đầu năm học; `bo_sach: KNTT` (đề ghi bộ khác ⇒ ghi đúng).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B062/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B062/<MA>" --khoi 9 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B062`. Trạm không tự chạy.

## ⭐ Bản đồ K9 — PHÂN DẠNG TRƯỚC KHI GIẢI (spec §A3; truy vấn từ DB lúc 2026-11-21 09:26 giờ VN)

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
| B062-01 | đề cương | THCS Đa Tốn, Hà Nội · 2024–2025 | 1-8 | — | chữ | đề cương GKII |
| B062-02 | đề cương | THCS Nghĩa Tân, Hà Nội · 2024–2025 | 1-8 | — | chữ | đề cương GKII |
| B062-03 | đề cương | THCS Thọ Lộc, Hà Nội · 2025–2026 | 1-9 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B062-04 | đề cương | Trường Nguyễn Tất Thành, Hà Nội · 2024–2025 | 1-6 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B062-05 | đề cương | THCS Lê Quý Đôn, Hà Nội · 2025–2026 | 1-6 | — | chữ | đề cương GKII |
| B062-06 | đề cương | THCS Thọ Lộc, Hà Nội · 2024–2025 | 1-12 | — | **SCAN** | SCAN (không lớp chữ) — gõ lại từ ảnh trang; trạm tự xác định trang đề/đáp án |
| B062-07 | đề cương | THCS Lê Quý Đôn, Hà Nội · 2024–2025 | 1-6 | — | chữ | đề cương GKII |
| B062-08 | đề cương | THCS Nguyễn Bỉnh Khiêm, Hà Nội · 2024–2025 | 1-4 | — | chữ | đề cương GKII |

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

- Phần 1 không lộ đáp số cuối ở BẤT KỲ đoạn nào, kể cả `**Chú ý:**`; không có đoạn "Thử lại" trong Phần 1.
- `**Chú ý:**` là lời dặn cho HỌC SINH (bẫy, điều kiện) — không nhận xét về sách, về kho, về phân loại.
- Bài nhiều ý giữ chung một câu: các bước Phần 1 ghi "Ý a: …", "Ý b: …"; tổng vẫn 3–6 bước (gộp ý ngắn).
- **Một lời giải = MỘT cách** (cách chính của dạng). Không câu ngoài lề "(sách còn cách khác…)", "(như ví dụ … của sách)". Cách khác đáng dạy ⇒ một câu ở `**Chú ý:**`. Lời giải kho ≠ bài giảng của giáo viên.
- Khuôn Phần 2 theo loại: lời văn = câu lời giải + phép tính (đơn vị) … kết "Vậy …" / `Đáp số:` · tính / tìm $x$ = mở bằng dòng chép nguyên biểu thức, chỉ các dòng biến đổi · lập luận = "Vì … nên …" ngắn, mỗi "Vì … nên …" tự đủ lí do, kết "Vậy …".

---

---

# PHẦN B — mục của khối

---

## Khối 9

### Phạm vi kiến thức

- **Chuẩn: chương trình 2018, SGK Kết nối tri thức (KNTT) Toán 9.** Lời giải viết như học sinh lớp 9 (giỏi) viết vào bài kiểm tra. Lớp 9 học sách mới từ năm học 2024–2025 ⇒ đề 2024–2025 và 2025–2026 cùng phạm vi.
- Thứ tự chương KNTT 9:
  - C1 Phương trình và hệ hai phương trình bậc nhất hai ẩn (thế, cộng đại số, lập phương trình / hệ).
  - C2 Phương trình quy về bậc nhất (tích, chứa ẩn ở mẫu) · Bất đẳng thức · Bất phương trình bậc nhất một ẩn.
  - C3 Căn bậc hai, căn bậc ba.
  - C4 Hệ thức lượng trong tam giác vuông: Bài 11 Tỉ số lượng giác của góc nhọn · Bài 12 Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng.
  - C5 Đường tròn: Mở đầu (đối xứng, vị trí điểm) → Cung và dây → Độ dài cung, quạt, vành khuyên → Đường thẳng và đường tròn (tiếp tuyến) → Hai đường tròn.
  - HK2: C6 Hàm số $y=ax^2$ · Phương trình bậc hai · Viète · Lập phương trình → C7 Tần số, tần số tương đối → C8 Xác suất → Góc nội tiếp → Đường tròn ngoại / nội tiếp tam giác → Tứ giác nội tiếp → Hình tổng hợp → Hình học không gian (trụ – nón – cầu).
- **Luôn được dùng**: toàn bộ lớp 6–8 (hằng đẳng thức, phân tích nhân tử, phân thức, phương trình bậc nhất một ẩn, hàm số bậc nhất, tam giác bằng nhau / cân / đều, trung trực, Pythagore, tứ giác đặc biệt, tam giác đồng dạng, tính chất đường phân giác, trung tuyến ứng với cạnh huyền, căn bậc hai số học lớp 7) — trừ đường trung bình (mục Hình).
- **Không dùng kiến thức của bài sau** [09/10 · Thùy; Đại và Hình]: câu thuộc bài nào chỉ dùng tới hết bài đó (bài đó + mọi bài trước + lớp dưới). Dùng ngầm cũng là vi phạm. Cần kết quả bài sau ⇒ tự lập luận bằng cái đã có; không làm được ⇒ `**Chưa chắc:**` hoặc chuyển câu sang bài sau.
- **Giữa kì I**: C1, C2, C4 (nhiều trường chỉ C1 + C4). C3 căn thức chỉ dùng khi CHÍNH đề đó chạm tới — không chạm thì cấm cả trục căn thức. Đường tròn chỉ mức nhẹ khi đề hỏi (mục Hình, "Theo mốc"). Whitelist = những gì chính đề đó kiểm tra tới.
- **Cuối kì I**: C1–C3 đầy đủ (khai căn tích / thương, đưa thừa số ra / vào dấu căn, trục căn thức, rút gọn, phương trình chứa căn, $|A|$) · C4 · C5 nửa đầu (đường tròn, đường kính – dây, vị trí đường thẳng – đường tròn, tiếp tuyến, hai tiếp tuyến cắt nhau, hai đường tròn; độ dài cung, quạt, vành khuyên khi đề hỏi).
- **Đề khó** (120 phút, chuyên, cụm chuyên môn): bài khó dùng được mọi kiến thức C1–C5 nói trên; vẫn không giải được trong phạm vi ⇒ giải cách đúng nhất + `**Chưa chắc:**`.
- Đề cương: phạm vi khác nhau từng đề ⇒ đọc dòng phạm vi đề tự ghi ("Chương I; II; IV", "Đại số hết bài 6, Hình hết bài 12") và áp đúng phạm vi đó.
- **Giữa kì II** [lô mẫu B055 — 6 đề, 21/11 · Thùy duyệt mẫu]: phạm vi = những gì CHÍNH ĐỀ đó kiểm tra (§A15), thường C1–C3 + C6 (hàm số $y=ax^2$, phương trình bậc hai, Viète) + C7–C8 (thống kê, xác suất) + Hình (đường tròn, góc nội tiếp, tứ giác nội tiếp; có đề thêm hình trụ – nón – cầu). Quy ước rút từ lô mẫu:
  - Đề đã kiểm tra C6 ⇒ bài lập phương trình bậc hai và phương trình bậc hai tham số giải bằng $\Delta$ / $\Delta'$ (b chẵn) / nhẩm nghiệm $a+b+c=0$, $a-b+c=0$; Viète chỉ dùng SAU khi chỉ ra có hai nghiệm; "có hai nghiệm" tính cả nghiệm kép; hệ thức không đối xứng giữa $x_1$, $x_2$ ⇒ giải qua tổng và tích, không tách hai cách gán. (Mô tả dạng NDB00732 còn ghi "phân tích nhân tử" là khuôn HK1 — đề xuất sửa cho trưởng khối.)
  - **Được dùng**: góc nội tiếp (số đo cung, hệ quả, góc chắn nửa đường tròn), kể cả trong đường tròn vừa chứng minh ở ý trước (khi viết "cùng chắn cung …" phải bảo đảm hai đỉnh cùng phía dây); tứ giác nội tiếp **chỉ chiều thuận**; hình trụ khi chính đề ra ("không tính nắp và đáy" ⇒ diện tích xung quanh; $\pi$ theo đề, kết luận "khoảng"). Vẫn CẤM các mục "Đã bỏ khỏi chương trình 2018" ở trên.
  - Chứng minh "bốn điểm cùng thuộc đường tròn / tứ giác nội tiếp": theo khuôn A1/G1 (hai góc vuông cùng nhìn một đoạn ⇒ trung điểm đoạn đó cách đều bốn điểm; hoặc hình chữ nhật). Tâm đường tròn ngoại tiếp tam giác nhọn nằm trong tam giác là tính chất gọi tên được (không ghi "(gt)"). Có thể viết "(góc chung)" kèm một dòng nêu vị trí điểm.
  - **Đề Hình thiếu "tam giác nhọn"**: dựng toạ độ thử cả cấu hình tù; tia / giao điểm mất hoặc hình suy biến ⇒ THÊM "và tam giác … nhọn" vào đề + `**Ghi chú:**`; không lấy vị trí điểm "theo hình vẽ". Thiếu điều kiện chỉ làm suy biến tên gọi mà kết luận vẫn đúng (AB=AC, góc 45°) ⇒ chỉ `**Ghi chú:**`, không sửa đề in. Dấu "<" chặt kiểu $EF<AH$ phải chứng minh "không phải đường kính".
  - Cực trị bài thực tế (hộp, tấm tôn, hàng rào, bể): hoàn thành bình phương / xét hiệu / $4ab=(a+b)^2-(a-b)^2$ — KHÔNG Cô-si dùng thẳng (kể cả Cô-si 3 số như hướng dẫn chấm; ngoại lệ chỉ khi đề nằm ở dạng "ứng dụng Côsi"). Mô tả NDB01209 ghi "dùng Cauchy" mâu thuẫn mục Đại (a) ⇒ trưởng khối quyết, tạm theo mục Đại.
  - Thống kê: kí hiệu nhóm $[a;b)$ được dùng trong bảng tần số ghép nhóm (KNTT chương 7); nhóm cuối viết "từ … đến …" là đoạn đóng; nhóm được hỏi là hợp các nhóm liền nhau ⇒ cộng tần số + `**Ghi chú:**`. Xúc xắc đề không ghi "cân đối, đồng chất" ⇒ coi các mặt đồng khả năng + `**Ghi chú:**`, không treo `**Chưa chắc:**`. So sánh biểu thức với hằng số mà có thể bằng ⇒ kết luận "≥" / "≤" kèm điểm dấu bằng.
  - Hai ý làm tròn nối nhau (quãng đường → tốc độ): ý sau tính từ giá trị CHÍNH XÁC của ý trước. Hướng dẫn chấm làm tròn sai mức đề hỏi ⇒ theo đề + `**Ghi chú:**`.
  - Đáp số phân số có dạng thập phân hữu hạn vừa 4 ô ($-\dfrac52=-2{,}5$) ⇒ `tra_loi_ngan` (§A7 thắng dòng "phân số ⇒ tu_luan" ở mục Loại câu K9).
  - Đề chia "phần riêng" theo hệ (chuẩn / nâng cao) ⇒ nhập cả hai, mỗi hệ một `## PHẦN`, giữ nhãn in. Ý in 1., 2., 3. trong bài số La Mã ⇒ nhập a), b), c). Mỗi câu chỉ MỘT dòng `**Ghi chú:**`.
  - Phân dạng: bản đồ Đại K9 chỉ có nhóm (chưa có dạng) cho hàm số $y=ax^2$ (NNB01075), tần số (NNB01076), xác suất (NNB01077), hình hộp (NNB01078); chưa có nhóm cho phương trình bậc hai / Viète / hình trụ – nón – cầu ⇒ `dang=—` + `THIẾU DẠNG: <tên>` (không tự thêm dạng). Hình K9 chưa có dạng chờ (`HH09000000`) và chưa có bài cho góc nội tiếp / tứ giác nội tiếp / hình tổng hợp ⇒ cổng tạm gán `HH00140`.
- **Cuối kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **Thi vào lớp 10**: chưa có luật — lô mẫu đầu tiên sẽ rút.
  (Luật theo bài của HK2 đã có và áp cho ba mốc này: C6–C8 ở mục Đại; góc nội tiếp, tứ giác nội tiếp, hình tổng hợp ở Sổ tay dạng F, G, H mục Hình.)
- **Đã bỏ khỏi chương trình 2018 — CẤM dùng thẳng ở mọi mốc** (cần thì chứng minh ngay trong bài):
  - Góc tạo bởi tia tiếp tuyến và dây cung; góc có đỉnh ở trong / ngoài đường tròn.
  - Dấu hiệu nhận biết tứ giác nội tiếp (tổng hai góc đối $180^\circ$; hai đỉnh kề cùng nhìn một cạnh dưới góc bằng nhau; góc ngoài bằng góc trong đối). Chỉ còn chiều thuận.
  - Hệ thức lượng về cạnh và đường cao: $AH^2=BH\cdot CH$, $AB^2=BH\cdot BC$, $AH\cdot BC=AB\cdot AC$, $\dfrac1{AH^2}=\dfrac1{AB^2}+\dfrac1{AC^2}$.
  - Phương tích ($MA\cdot MB=MC\cdot MD$ dùng thẳng); $MN=2\sqrt{RR'}$; Ptolemy, Simson, Euler, Menelaus, Ceva.
  - Định lí sin, côsin; $S=\frac12ab\sin C$; tỉ số lượng giác góc tù; công thức cộng, nhân đôi.
  - Công thức khoảng cách hai điểm theo toạ độ (lớp 10); đạo hàm; tổ hợp – chỉnh hợp; định thức; kí hiệu khoảng.
  - Đường trung bình hình thang.
  - "Tứ giác có ba góc vuông là hình chữ nhật" (không phải dấu hiệu SGK) ⇒ viết: tổng các góc tứ giác $360^\circ$ nên góc thứ tư vuông; tứ giác có bốn góc vuông là hình chữ nhật.
- Nội dung HK2 lọt vào đề / đề cương HK1 ⇒ vẫn nhập, giải bằng cách đúng và ngắn nhất trong phạm vi HK1; không được ⇒ dùng cách ngoài phạm vi + `**Ghi chú:** dùng <công cụ> (kiến thức học kì II)`.

### Phân kho

| Câu gì | Kho | Ghi chú |
|---|---|---|
| Phương trình, hệ, bất phương trình, căn thức, lập phương trình / hệ, hàm số $y=ax^2$, thống kê – xác suất | `kho=dai` (`dai_cau_hoi`) | |
| Bài cực trị / tối ưu thực tế bối cảnh hình (hình hộp, máng nước, hàng rào) mà lời giải thuần đại số | `kho=dai` | Có nội dung hình thật (tam giác bằng nhau / Pythagore / đồng dạng) ⇒ Hình |
| Đường tròn, tiếp tuyến, tứ giác nội tiếp, mọi câu hình phẳng (chứng minh, tính trên hình) | `kho=hinh_hoc` (`hinh_hoc_cau_hoi`) | CTO phân xử 15/11. Sách ⇒ phần Học, kho kiểu 1, `dang_chinh` = mã bài HH00105–HH00110 |
| Tỉ số lượng giác góc nhọn, hệ thức lượng: câu thuần tính / biến đổi tỉ số lượng giác, giải tam giác vuông đứng riêng (kể cả bài thực tế tháp, hải đăng, cột cờ, thang) | `kho=hgt` (`hgt_cau_hoi`, bản đồ hgt K9) | Thùy chốt 15/11 |
| Lượng giác nằm trong một bài Hình nhiều ý / có chứng minh | `kho=hinh_hoc` theo bài | Thùy chốt 15/11 |
| Hình học không gian (trụ – nón – cầu) | `kho=dai` — chủ đề NCD00164 của bản đồ Đại 9 | Chưa có luật trình bày |

- **Bài lai** (ý a đại số, ý b hình) ⇒ không tách; ghi `**Ghi chú:**` để người ghép quyết.
- **Hình–Luyện** (`hinh_bai` / `hinh_y`): bài hình tự luận + trả lời ngắn của đề thi / đề cương đẩy từ `hinh_hoc_cau_hoi` (trắc nghiệm, Đúng/Sai KHÔNG lấy; công cụ không đọc `hgt_cau_hoi`). Gắn mô hình: `hai_tt` → Mô hình hai tiếp tuyến · `ba_tt` → Mô hình ba tiếp tuyến · `tt_khac` / không tiếp tuyến ⇒ để trống.

### Đại

**(a) Công cụ được phép / cấm**
- **C1–C5 (cả HK1): KHÔNG công thức nghiệm, $\Delta$, Viète.** Phương trình bậc hai / bậc cao ⇒ đưa về **phương trình tích** bằng phân tích nhân tử (tách hạng tử, nhóm, hằng đẳng thức). Nhân tử bậc hai vô nghiệm ⇒ chứng minh luôn dương bằng hoàn thành bình phương. Nghiệm vô tỉ (chỉ khi không phân tích được trên số hữu tỉ) ⇒ hoàn thành bình phương rồi dùng căn bậc hai số học lớp 7 ($X^2=k$, $k>0$ thì $X=\sqrt k$ hoặc $X=-\sqrt k$).
- **Cô-si (AM–GM), Bunhiacopxki: không dùng thẳng như định lí** — chứng minh từ $(a-b)^2\ge0$ ngay trong bài rồi mới dùng. Ngoại lệ: dạng "ứng dụng Côsi" trên bản đồ ⇒ được dùng, nêu rõ điều kiện các số không âm và khi nào dấu "=" xảy ra.
- **Cực trị / nâng cao**: hoàn thành bình phương $-(x-a)^2+k\le k$, xét hiệu đưa về tổng bình phương, $(a-b)^2\ge0$. Không đạo hàm. Mẫu: $x^2+\dfrac{16}{x}-12=\dfrac{(x-2)^2(x+4)}{x}\ge0$; $\dfrac{a^3}{a^2+b^2}=a-\dfrac{ab^2}{a^2+b^2}$ rồi dùng $a^2+b^2\ge2ab$.
- **Hệ**: không định thức; không dùng "hệ có nghiệm duy nhất khi $\dfrac{a}{a'}\ne\dfrac{b}{b'}$" như công thức thuộc lòng — xét vị trí hai đường thẳng (hệ số góc) hoặc giải trực tiếp. Hệ có ẩn ở mẫu ⇒ điều kiện xác định, đặt ẩn phụ, giải, trả lại ẩn, đối chiếu. Hệ vô nghiệm / vô số nghiệm ⇒ nêu rõ, viết nghiệm tổng quát.
- **Bài tham số**: xét điều kiện hệ có nghiệm duy nhất TRƯỚC, rồi đối chiếu $m$ tìm được với điều kiện (và với mẫu số của điều kiện đề cho).
- **Căn (C3)**: chỉ $\sqrt{A^2}=|A|$, khai căn tích / thương, đưa thừa số ra ngoài – vào trong dấu căn, trục căn thức ở mẫu, căn bậc ba. Không dùng thuật ngữ "căn thức đồng dạng" (nói "cộng các số hạng cùng chứa $\sqrt2$").
- **Viète (C6)**: chỉ dùng **sau khi** chỉ ra phương trình có hai nghiệm ($\Delta\ge0$ hoặc $ac<0$). Nhẩm nghiệm $a+b+c=0$, $a-b+c=0$ được dùng. Dùng $\Delta'$ khi $b$ chẵn.
- **Xác suất (C8)**: liệt kê không gian mẫu (bảng / sơ đồ cây) rồi đếm; phải nói "đồng khả năng".
- **Bất đẳng thức**: mỗi bước ghi tính chất đã dùng trong ngoặc; bất đẳng thức kép chứng minh từng vế; nêu khi nào dấu "=" xảy ra.
- Đặt thừa số chung theo tính chất phân phối là kiến thức lớp 6–7 — không phải vi phạm.

**(b) Trình bày riêng**
- Phần 1 bài nhiều ý: "Ý a: …", "Ý b: …", tổng vẫn 3–6 bước. Bài ngắn tách đúng thao tác thật (xác định dạng → biến đổi → kết luận / đối chiếu). **Không ghi đáp số cuối ở bất kì đâu trong Phần 1, kể cả dòng `**Chú ý:**`.**
- Phần 2: mỗi phép biến đổi / mỗi câu một dòng, không dồn 3–4 phép vào một dòng nối "suy ra". Lời nối "Ta có", "Suy ra", "Do đó".
- **Không dấu $\Leftrightarrow$** nối chuỗi biến đổi; $\Rightarrow$ được dùng.
- **Không "tập nghiệm $S=\{…\}$", không kí hiệu khoảng** — kết luận bằng lời: "Vậy phương trình đã cho có nghiệm là $x=…$" · "Vậy hệ phương trình đã cho có nghiệm duy nhất là $(x;y)=(…;…)$" · "Vậy nghiệm của bất phương trình là $x>…$".
- Trắc nghiệm: Phần 2 = phép tính / lập luận ngắn nhất, dòng cuối `Chọn B.` (trùng `dap_an`).
- Tách ý (§A7, §A7) — danh sách đầy đủ cho K9: bài "Giải phương trình / hệ / bất phương trình", "Tính", "Rút gọn", "Tìm $x$", "Trục căn thức", "So sánh" có nhiều ý **độc lập** ⇒ mỗi ý một câu (đề = câu dẫn viết lại cho số ít + đúng ý đó; nhãn `Bài 1a`). Bài lời văn, cực trị, chung dữ kiện, ý sau dùng ý trước (a) rút gọn $P$; b) tìm $x$ để $P=…$) ⇒ một câu, Phần 2 ghi a) b). "Bài" chỉ là vỏ gom hai bài toán khác hẳn (1) 2) dữ kiện riêng) ⇒ `Bài 4.1`, `Bài 4.2`.
- **Khuôn Phần 2 theo dạng** (dạng chưa có khuôn ⇒ trình bày theo SGK KNTT + `**Ghi chú:** dạng chưa có khuôn`):

| Chương · Dạng | Khuôn Phần 2 | Mấu chốt / bẫy |
|---|---|---|
| C1 Nhận biết PT / hệ bậc nhất hai ẩn, kiểm nghiệm | "… là phương trình bậc nhất hai ẩn vì có dạng $ax+by=c$ với $a=…$, $b=…$ (không đồng thời bằng $0$)" · "Thay $x=…$, $y=…$ vào …, ta được … (đúng / sai)" → "Vậy …" | $0x+0y=c$ không phải; hệ có một PT không bậc nhất hai ẩn thì không phải hệ |
| C1 Nghiệm tổng quát, biểu diễn hình học | Rút $y$ theo $x$ → "Nghiệm tổng quát: $(x;\,ax+b)$ với $x\in\mathbb{R}$ tuỳ ý" → hai điểm thuộc đường thẳng → hình (máy vẽ) | $0x+by=c$ ⇒ song song / trùng $Ox$; $ax+0y=c$ ⇒ song song / trùng $Oy$ |
| C1 Phương pháp thế | "Từ phương trình thứ nhất, ta có $y=…$ (1)." → "Thế vào phương trình thứ hai, ta được …" → giải từng dòng → "Thay $x=…$ vào (1), ta được $y=…$" → "Vậy …" | Chọn ẩn hệ số $\pm1$ để rút; $0x=k\ne0$ vô nghiệm; $0x=0$ vô số nghiệm |
| C1 Cộng đại số | "Nhân hai vế của phương trình thứ nhất với …, ta được hệ …" (`cases`) → "Cộng (trừ) từng vế hai phương trình của hệ mới, ta được …" → tìm ẩn 1 → thế tìm ẩn 2 → "Vậy …" | Đối nhau thì cộng, bằng nhau thì trừ; nhân cả vế phải |
| C1 Hệ quy về bậc nhất | Thu gọn về $ax+by=c$ hoặc "Đặt $u=…$, $v=…$ (điều kiện …)" → giải theo $u,v$ → trả về $x,y$ → đối chiếu → "Vậy …" | Ẩn ở mẫu nêu điều kiện trước |
| C1 Tìm tham số | "Vì … là nghiệm của hệ nên thay $x=…$, $y=…$ ta được …" → giải → "Vậy $m=…$" | Thay vào cả hai phương trình |
| C1 · C6 Lập hệ / lập phương trình | "Gọi … là $x$ (đơn vị; điều kiện)." → biểu diễn các đại lượng → "Theo đề bài ta có phương trình / hệ phương trình: …" → giải đủ → "$x=…$ (thoả mãn điều kiện)" → "Vậy …" đủ mọi đại lượng đề hỏi, có đơn vị | Điều kiện của ẩn; đổi đơn vị; làm chung: năng suất $=\dfrac1{\text{thời gian}}$ |
| C2 Phương trình tích | Đưa về $A\cdot B=0$ → "$A=0$ hoặc $B=0$" → mỗi cái một dòng "• $x-5=0$ suy ra $x=5$" → "Vậy phương trình đã cho có hai nghiệm là …" | Không chia hai vế cho biểu thức chứa ẩn |
| C2 Chứa ẩn ở mẫu | "Điều kiện xác định: $x\ne…$" → quy đồng, khử mẫu → giải → "$x=…$ (thoả mãn / không thoả mãn điều kiện xác định)" → "Vậy …" | Quên đối chiếu ⇒ nghiệm ngoại lai |
| C2 Bất đẳng thức | "Ta có $a>b$" → "Suy ra … (nhân hai vế với …; cộng hai vế với …)" → "Vậy …" | Nhân số âm đổi chiều; xét hiệu đưa về tổng bình phương |
| C2 Bất phương trình bậc nhất | Chép đề → từng dòng (ghi "chuyển vế", "chia hai vế cho $-2<0$ nên đổi chiều") → "Vậy nghiệm của bất phương trình là $x>…$." | Quy đồng mẫu dương rồi khử |
| C3 Điều kiện xác định | "$\sqrt{A}$ xác định khi $A\ge0$" → giải → "Vậy …" | Căn ở mẫu ⇒ $A>0$; $\sqrt{x^2+1}$ xác định với mọi $x$ |
| C3 Tính / rút gọn biểu thức số | Chép đề $=$ … mỗi dấu $=$ một dòng, dòng sau bắt đầu `$=…$` | $\sqrt{A^2}=|A|$ rồi xét dấu; đưa thừa số ra ngoài trước khi cộng trừ |
| C3 Rút gọn chứa chữ + câu hỏi phụ | "Với $x\ge0$, $x\ne1$, ta có:" → $P=…$ từng dòng → "Vậy $P=…$" → b) giải theo $P$, đối chiếu điều kiện | Mẫu chung; đổi dấu khi trừ phân thức |
| C3 Phương trình chứa căn | Điều kiện → bình phương hai vế (hai vế không âm) → giải → đối chiếu → "Vậy …" | $\sqrt A=B$ cần $B\ge0$ |
| C3 Căn bậc ba | $\sqrt[3]{a^3}=a$; tính từng dòng | Căn bậc ba số âm là số âm, không cần điều kiện |
| C6 Hàm số $y=ax^2$ | Thay số từng dòng · tìm $a$: "Vì đồ thị đi qua $A(…;…)$ nên …" · vẽ: bảng giá trị 5 điểm đối xứng → hình (máy vẽ) · giao với đường thẳng: phương trình hoành độ giao điểm | Đối xứng qua $Oy$; $a>0$ bề lõm quay lên |
| C6 Phương trình bậc hai | "Ta có $a=…$, $b=…$, $c=…$" → "$\Delta=b^2-4ac=…$" → "Vì $\Delta>0$ nên phương trình có hai nghiệm phân biệt: $x_1=…$; $x_2=…$" → "Vậy …". Khuyết $b$ / $c$: tích / $x^2=k$ | $\Delta'$ khi $b$ chẵn; nhẩm nghiệm |
| C6 Viète | Chỉ ra có hai nghiệm → "Theo định lí Viète: $x_1+x_2=…$; $x_1x_2=…$" → biến đổi về tổng, tích → thay số → "Vậy …". Có tham số: điều kiện $\Delta$ trước, đối chiếu sau | $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2$ |
| C7 Tần số, tần số tương đối | Bảng bằng `array` · tần số tương đối $=\dfrac{\text{tần số}}{N}\cdot100\%$ từng giá trị · đọc biểu đồ: nêu số liệu rồi tính | Tổng tần số $=N$; tổng tương đối $=100\%$ |
| C8 Xác suất | "Không gian mẫu: $\Omega=\{…\}$, có $n(\Omega)=…$ kết quả đồng khả năng" → "Các kết quả thuận lợi cho biến cố $A$: …, có … kết quả" → "$P(A)=\dfrac{…}{…}$" | Hai bước ⇒ bảng / sơ đồ cây, không sót cặp có thứ tự |

- **Định dạng (cổng `--khoi 9` chặn)**:
  - **Dấu nhân tường minh `\cdot`** — cấm `\times`, cấm dấu chấm làm dấu nhân; số–chữ, chữ–chữ, ngoặc–ngoặc viết liền ($3x$, $(x+1)(x-2)$). Thập phân `$3{,}5$`. Luỹ thừa số âm / phân số có ngoặc. `\sqrt[3]{…}` cho căn bậc ba.
  - Hệ: `$\begin{cases} 2x+y=5 \\ -x+2y=-5 \end{cases}$` (cả hệ một dòng). Điều kiện `$x\ge0$, $x\ne1$`.
  - Bảng (giá trị, tần số, bảng trong đề): `$\begin{array}{|c|c|c|}\hline x & -2 & 0 \\ \hline y & 4 & 0 \\ \hline\end{array}$` — một công thức, một dòng. Không bảng Markdown.
  - Chữ Việt trong công thức bọc `\text{…}`; đơn vị `$10\ \text{cm}$`, `\text{m}^2`, `\text{km/h}`; số lớn ngoài công thức "12 600 000 đồng". Không emoji; `**đậm**` chỉ cho nhãn quy định.
- **Loại câu**: 4 phương án ⇒ `trac_nghiem` (`lua_chon` 4 chuỗi không kèm "A.", `dap_an` chữ cái). `tra_loi_ngan` theo §A10 (`^-?\d+(,\d+)?$`, ≤ 4 kí tự kể cả dấu: `13`, `-1`, `2,5`) đúng dạng đề hỏi. Hai nghiệm, cặp $(x;y)$, phân số, khoảng nghiệm, vô nghiệm, biểu thức, số có đơn vị phải đổi, chứng minh, vẽ đồ thị, nhiều ý ⇒ `tu_luan`. Đúng/Sai nhiều mệnh đề ⇒ `tu_luan`, giữ đủ a)–d), xét từng mệnh đề, `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
- `dap_an` gọn, đúng câu hỏi: `$x=2$` · `$x=-1$; $x=6$` · `$(x;y)=(2;-1)$` · `Vô nghiệm` · `$x>5$` · `$m=4$` · nhiều ý `a) $P=…$; b) $x=9$`.
- **Đồ thị trong lời giải** ⇒ máy vẽ `scripts/kho/do-thi.mjs` (mô tả JSON, máy kiểm điểm nằm trên đường rồi mới vẽ). Hình kèm lời văn Đại (sân vườn chữ L…) chỉ khi bài không hiểu được nếu thiếu hình; hình trang trí ⇒ bỏ. Hình của đề Đại được cắt từ PDF (Hình chung).
- Đề: giữ nguyên ý sách; ví dụ của sách là một bài như mọi bài (đề không ghi "Ví dụ"); bỏ "(1,0 điểm)".
- **Hai vế đồng nhất** ($(5y-4)^2=(4-5y)^2$; vế trái đồng nhất 0) ⇒ nêu rõ "nghiệm đúng với mọi …" (trừ giá trị loại), `tu_luan`.

**(c) Sai lầm cần tránh**
- [13/10] Phần 1 lộ đáp số ở dòng Chú ý ("phương trình vô nghiệm", "loại $x=2$") ⇒ không ghi đáp số cuối ở bất kì đâu trong Phần 1.
- [13/10] dồn 3–4 phép biến đổi vào một dòng ⇒ mỗi phép một dòng.
- [13/10] phương trình chứa ẩn ở mẫu quên điều kiện / quên đối chiếu ⇒ nhận nghiệm ngoại lai.
- [13/10] bất phương trình nhân / chia số âm mà không đổi chiều ⇒ đổi chiều và nói rõ.
- [14/10, 18/10] trục căn thức ở mẫu trong đề giữa kì không chạm C3 ⇒ viết lại bằng công cụ trong phạm vi (vd dùng $\cot$).
- [18/10] tính tiếp từ số đã làm tròn ⇒ giữ giá trị đúng tới bước cuối.
- [18/10] kết quả dùng $\pi\approx3{,}14$ mà ghi như số đúng ⇒ ghi "khoảng".
- [18/10] lí do vòng tròn (lấy điều phải chứng minh làm căn cứ) ⇒ trạm kiểm soát mạch lập luận.
- [13/10] đề cương in dấu "=" thành "−"; hình vẽ lại sai so với sách gốc ⇒ tìm bản gốc trong sách (mục Theo loại nguồn).
- đọc ảnh scan: số mũ nhỏ, dấu trừ, ngoặc, phân số, chỉ số ⇒ phóng to 260–300 dpi, không đoán; chữ trích từ PDF mất căn / phân số / hệ ⇒ ảnh đúng.
- tự sửa dữ kiện đề để ra số đẹp ⇒ cấm.

### Hình

> Luật chung Hình (whitelist theo bài, verify toạ độ, dòng ngắn + căn cứ, vẽ hình, bài–ý): mục "Hình — luật chung mọi khối". Dưới đây chỉ phần riêng K9.

**(a) Công cụ được phép / cấm**
- **Whitelist theo thứ tự bài (phần Học)**: HH00105 Đường tròn (định nghĩa, vị trí điểm, đối xứng, đường kính là dây lớn nhất, góc ở tâm, cung, số đo cung) → HH00106 Độ dài cung → HH00107 Diện tích quạt, viên phân, vành khuyên → HH00108 Vị trí đường thẳng – đường tròn, tiếp tuyến (tính chất + dấu hiệu) → HH00109 Hai tiếp tuyến cắt nhau → HH00110 Vị trí hai đường tròn → (chưa có bài) Góc nội tiếp → Đường tròn ngoại / nội tiếp tam giác → Tứ giác nội tiếp → Hình tổng hợp (dùng được tất cả). Chương IV đứng trước ⇒ tỉ số lượng giác dùng được từ bài đầu.
  - Vd: câu bài Cung và dây không dùng góc nội tiếp ("chắn nửa đường tròn") — so dây bằng "đường kính là dây lớn nhất"; câu bài Mở đầu không dùng tiếp tuyến; ở HH00108 chứng minh $MA=MB$ bằng trung trực, không dùng "hai tiếp tuyến cắt nhau".
- **CHO PHÉP — viết thẳng tên tính chất làm lí do** (từ bài chứa nó trở đi):
  - Đường tròn: định nghĩa, vị trí điểm ($OM$ so với $R$), tâm / trục đối xứng; đường kính là dây lớn nhất; trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền; chiều đảo "tam giác có trung tuyến ứng với một cạnh bằng nửa cạnh ấy thì vuông" (có trong lý thuyết HH00105).
  - Cung: số đo cung nhỏ $=$ góc ở tâm; cung lớn $=360^\circ-$ cung nhỏ; cộng cung; cung bằng nhau.
  - $C=2\pi R$, $l=\dfrac{\pi Rn}{180}$, $S=\pi R^2$, $S_q=\dfrac{\pi R^2n}{360}=\dfrac{lR}{2}$, $S_v=\pi(R^2-r^2)$; viên phân $=$ quạt $-$ tam giác.
  - Đường thẳng – đường tròn: bảng $d$ so với $R$; tiếp tuyến ⊥ bán kính tại tiếp điểm; dấu hiệu (qua điểm của đường tròn và ⊥ bán kính tại đó); hai tiếp tuyến cắt nhau (cách đều hai tiếp điểm · tia tới tâm là phân giác góc hai tiếp tuyến · tia từ tâm là phân giác góc hai bán kính · $MO\perp AB$).
  - Hai đường tròn: bảng $OO'$ so với $R+R'$, $|R-R'|$; tiếp điểm thẳng hàng với hai tâm.
  - Góc nội tiếp $=\frac12$ số đo cung bị chắn; 4 hệ quả (cùng chắn một cung / cung bằng nhau ⇒ bằng nhau; $=\frac12$ góc ở tâm cùng chắn cung (≤ $90^\circ$); chắn nửa đường tròn ⇒ vuông).
  - Tứ giác nội tiếp ⇒ tổng hai góc đối $=180^\circ$ (**chỉ chiều thuận**); hai góc nội tiếp cùng chắn một cung trong tứ giác đã biết nội tiếp.
  - Đường tròn ngoại tiếp tam giác vuông: tâm là trung điểm cạnh huyền (từ bài Đường tròn ngoại tiếp tam giác; trước đó chứng minh qua trung tuyến ứng với cạnh huyền). Tam giác đều cạnh $a$: $R=\dfrac{a\sqrt3}{3}$, $r=\dfrac{a\sqrt3}{6}$. Hình chữ nhật / hình vuông nội tiếp: tâm là giao hai đường chéo, $R=\frac12$ đường chéo.
  - Lớp 7–8 + C4: tam giác bằng nhau, cân / đều, trung trực, Pythagore, tứ giác đặc biệt, tam giác đồng dạng (g.g, c.g.c, c.c.c), tỉ số lượng giác góc nhọn, giải tam giác vuông, ba đường cao đồng quy, trọng tâm.
- **CẤM → thay bằng**:

| Cấm | Thay bằng |
|---|---|
| Góc tạo bởi tia tiếp tuyến và dây cung | Đi vòng qua tam giác đồng dạng / tam giác cân / góc nội tiếp (vd $\widehat{ABD}=\widehat{DCB}$ qua $\triangle ABD\backsim\triangle AEB$) |
| Góc có đỉnh trong / ngoài đường tròn | Góc ngoài tam giác + góc nội tiếp |
| Dấu hiệu tứ giác nội tiếp | Chứng minh **bốn điểm cách đều một điểm** (thường trung điểm cạnh huyền chung) hoặc tứ giác là hình chữ nhật / hình vuông |
| Phương tích, $MA\cdot MB=MC\cdot MD$ dùng thẳng | Cặp tam giác đồng dạng mỗi lần |
| Hệ thức lượng $b^2=ab'$, $h^2=b'c'$, $ah=bc$ dùng thẳng | Cặp tam giác đồng dạng (g.g) rồi suy ra tích; đề bắt chứng minh chính hệ thức đó ⇒ chứng minh từ đồng dạng / tỉ số lượng giác |
| Khoảng cách hai điểm theo toạ độ | Hình chiếu xuống trục + Pythagore |
| $\sin$, $\cos$ góc tù; $S=\frac12ab\sin C$ | Kẻ đường cao, tam giác vuông phụ |
| $MN=2\sqrt{RR'}$; $AB=\sqrt{d^2-(R-R')^2}$ | Kẻ đường vuông góc ⇒ hình chữ nhật + tam giác vuông |
| Ptolemy, Simson, Euler, Menelaus, Ceva | Giải cách khác trong whitelist; không có ⇒ `**Chưa chắc:**` (§A14) |
| "Đường kính ⊥ dây thì đi qua trung điểm dây" như định lí | Qua tam giác cân: "$\triangle OAB$ cân tại $O$ có $OH$ là đường cao nên cũng là trung tuyến" |
| "Hai dây cách đều tâm thì bằng nhau"; "đường nối tâm là trung trực của dây chung" như định lí | Tự chứng minh bằng tam giác bằng nhau (c.c.c) / Pythagore |
| **Đường trung bình của tam giác** [20/10 · Thùy; Hình chung] — chỉ đề trường Ngôi Sao Hoàng Mai được dùng; dùng ngầm ("$NP\parallel BC$ vì $N$, $P$ là trung điểm") cũng là vi phạm | Tam giác đồng dạng c.g.c tỉ số $\dfrac12$ (vd $\triangle KOI\backsim\triangle KAH$ chung góc $K$) hoặc hình bình hành (lấy $F$ sao cho $E$ là trung điểm $DF$) |

- **Theo mốc**:
  - **Giữa kì I có "nhiều điểm thuộc đường tròn"**: chỉ định nghĩa đường tròn + trung tuyến ứng với cạnh huyền (hai chiều). Không góc nội tiếp, không góc ở tâm – số đo cung, không tứ giác nội tiếp, không viện dẫn "đường tròn ngoại tiếp tam giác vuông". Vd: $M$, $N$ thuộc đường tròn đường kính $BC$ ⇒ $\widehat{BMC}=90^\circ$ chứng minh từ $OM=OB=OC$ (tam giác cân, tổng ba góc), không "góc nội tiếp chắn nửa đường tròn".
  - **Cuối kì I**: được C5 nửa đầu (tiếp tuyến, hai tiếp tuyến cắt nhau, hai đường tròn). Vẫn cấm góc nội tiếp, tứ giác nội tiếp, góc tạo bởi tiếp tuyến và dây, định lí sin / côsin, "đường tròn ngoại tiếp tam giác vuông", "góc chắn nửa đường tròn". Công thức $\dfrac{n}{360}$ và "góc ở tâm $=$ số đo cung" dùng được **riêng cho bài đề hỏi độ dài cung / quạt / vành khuyên / số đo cung**. "Bốn điểm cùng thuộc một đường tròn" bằng định nghĩa / trung điểm cạnh huyền.
  - Bài chỉ làm được bằng công cụ ngoài phạm vi (rất hiếm): giải cách ngắn nhất đúng toán + `**Ghi chú:**` nói đã dùng gì.

**(b) Trình bày riêng**
- Dấu nhân `\cdot`. Căn cứ viết tắt `(gt)`, `(cmt)`, `(câu a)` — không "(giả thiết)", "(chứng minh trên)". Tên căn cứ hay dùng ở K9: `(định lí trung tuyến ứng với cạnh huyền)`, `(tính chất hai tiếp tuyến cắt nhau)`, `(trường hợp c.g.c)`, `(bán kính)`, `(hai góc đối đỉnh)`, `(đường kính là dây lớn nhất)`, `(định lí Pythagore)`.
- Ý tính / "nêu cách": Phần 1 card như §A5; mỗi bước câu ngắn có động từ + việc + công cụ ("Tính $MO$ bằng định lí Pythagore trong $\triangle OAM$") — không bước cụt chỉ còn kí hiệu. Ý chứng minh ⇒ Sơ đồ tư duy (§A6). Mẫu K9: `kho-rules/dai/lo/toanmath/batch/B005/B005-01.soan.md` Câu 4.2.
- Trắc nghiệm: Phần 1 ngắn (mấu chốt); Phần 2 lập luận ngắn nhất (câu lí thuyết: một dòng cho mỗi phương án đúng / sai); dòng cuối `Chọn X.`
- Bài tính: mỗi phép tính một dòng; đơn vị trong ngoặc sau kết quả `$OA=6$ (cm)`; kết quả có $\pi$ / căn giữ chính xác tới bước cuối, làm tròn **một lần** (`$\approx22{,}11$`); dòng cuối "Vậy …".
- Bài chứng minh: dòng cuối "Vậy …" nhắc lại đúng điều phải chứng minh; đánh số (1), (2) cho kết quả sẽ ghép.
- Khối so hai tam giác: "Xét … và … có:" → mỗi điều kiện một dòng, kết ";" → "Do đó … (trường hợp)."
- Bài dựng hình (chưa có khuôn chính thức; vẫn nhập): Phần 1 = phân tích; Phần 2 = "Cách dựng" + "Chứng minh".
- **Kí hiệu**: góc `$\widehat{ABC}$` (một chữ `$\widehat{E}$`) · cung `sđ$\overset{\frown}{AB}$`, cung ba chữ `$\overset{\frown}{CnB}$` · `$\triangle ABC$` · `$\backsim$` · `$^\circ$`, phút `$36^\circ52'$` · `$\perp$`, `$\parallel$` (không `//`) · `\dfrac` · `$3{,}6$` · đường tròn `$(O;R)$`, `$(O')$` · đơn vị `(cm)` sau phép tính, `$\text{cm}^2$` trong công thức · trên mặt phẳng toạ độ: $(O;2)$ không kèm "cm".
- **Loại câu**: `trac_nghiem` (4 phương án) · `tra_loi_ngan` theo §A10 · chứng minh ⇒ `tu_luan`, `dap_an` trống · bài có HAI đáp số ⇒ `tu_luan`.
- **Đề tự đủ** (thêm cho K9): dữ kiện chỉ có trên hình sách (điểm nằm giữa, cung nhỏ / lớn, tiếp điểm) ⇒ ghi thẳng vào đề + `**Ghi chú:** đã thêm …`. Sách chỉ có hình không có lời ⇒ viết cấu hình thành lời (suy từ hình, kiểm toạ độ khớp hình) + `**Ghi chú:**` để người duyệt soát.
- **Hình** (bổ sung K9):
  - Thuần lí thuyết / thuần số ⇒ không hình.
  - Lời giải không dựng thêm ⇒ bỏ dòng `**Hình giải:**` (không chép hình đề lần hai). Hình đề là ảnh thật / minh hoạ / thiếu điểm ⇒ vẽ hình giải đủ điểm.
  - **Hình lộ đáp án ⇒ chỉ gắn lời giải** (`_lg`, chỉ `anh_dap_an`): câu "xác định vị trí tương đối / điểm nằm trên–trong–ngoài / số điểm chung", "vẽ hình", "nêu cách dựng".
  - Thang / cột / tháp ⊥ mặt đất ⇒ dựng thẳng đứng. Tiếp tuyến phải thật sự tiếp xúc; tiếp điểm là chấm.
  - Đề có tham số ⇒ verify ≥ 1000 cấu hình ngẫu nhiên (cả nhọn lẫn tù nếu đề không loại).

**(c) Sai lầm cần tránh**
- [09/10] câu bài Cung và dây dùng "góc nội tiếp chắn nửa đường tròn" ⇒ dùng đường kính là dây lớn nhất / trung tuyến bằng nửa cạnh.
- [09/10] chứng minh tiếp tuyến thiếu ý "$B$ thuộc đường tròn", hoặc ⊥ với đoạn không phải bán kính ⇒ đủ HAI ý.
- [09/10] cộng đoạn / cộng góc quên điều kiện "nằm giữa" ⇒ ghi vào đề hoặc chứng minh ở Phần 2. Đề thiếu điều kiện làm hình suy biến (thiếu "nhọn", thiếu $AB<AC$, $d$ không ⊥ $OA$, $M$ khác $A$, $B$) ⇒ thêm điều kiện tối thiểu vào đề + `**Ghi chú:**`.
- [09/10] cộng khoảng cách tới hai dây song song mà quên chứng minh $H$, $O$, $K$ thẳng hàng.
- [09/10] nói "chắn cung $AC$" không nói cung nào khi có hai cung; đọc nhầm cung 3 chữ ($ABC$ là cung $AC$ đi qua $B$); lấy cung nhỏ khi đề hỏi cung lớn.
- [09/10] sai thứ tự đỉnh tương ứng của tam giác đồng dạng ⇒ tỉ số sai.
- [09/10] nhầm $180$ với $360$ trong công thức cung / quạt; nhầm $R$ với $r$ (tự kiểm $r=\frac R2$ ở tam giác đều); làm tròn giữa chừng; quên đổi m → km; $OA^2-OC^2$ nên dùng hằng đẳng thức (máy tính dễ lệch).
- [09/10] sách in sai: đường tròn đường kính $AH$ "tiếp xúc $AB$, $AC$" (thực ra chỉ tiếp xúc $BC$); đề thiếu "tam giác nhọn" ra 2 đáp số (14 hoặc 4) ⇒ kiểm toạ độ; sửa đề theo §A4 hoặc giữ cả hai đáp số ở `tu_luan`.
- [09/10] tứ giác ghi sai thứ tự đỉnh ("$OABC$" tự cắt) ⇒ đổi thứ tự đúng ("$OACB$") + `**Ghi chú:**`.
- [09/10] văn bản trích đảo thứ tự phương án, vỡ dòng, OCR "(0; 3 cm)", "$(l;3)$" ⇒ đọc theo ảnh trang.
- [18/10] "tứ giác có ba góc vuông là hình chữ nhật" ⇒ dẫn qua tổng góc $360^\circ$.
- [18/10, 20/10] dùng thẳng / dùng ngầm đường trung bình, Thalès khi vị trí điểm phụ thuộc hình; bài mà dữ kiện đúng là bài đường trung bình ⇒ tự chứng minh bằng hình bình hành / đồng dạng (trừ đề Hoàng Mai).
- [29/10] đề thiếu "tam giác nhọn" làm đẳng thức sai (mọi cấu hình tù đều sai) ⇒ giải bình thường, ghi đề sai (§A4).
- [03/11] dùng kiến thức HK2 trong đề cương cuối kì I ("đường tròn ngoại tiếp tam giác vuông", "góc chắn nửa đường tròn") ⇒ viết lại bằng trung tuyến ứng với cạnh huyền / tam giác cân.
- [03/11] phân loại tiếp tuyến cho Hình–Luyện: `hai_tt` CHỈ khi thật có hai tiếp tuyến cắt nhau tại một điểm và đề / lời giải dùng tính chất đó; `ba_tt` CHỈ khi có ba tiếp tuyến ($CD=AC+BD$); còn lại `tt_khac` / `khong_tt`. Không xếp bằng từ khoá (quá nhiễu: "cũng" ↔ "cung").
- [03/11] nối nhãn → mã câu theo thứ tự chỉ là ứng viên ⇒ phải có nhân chứng thứ hai là nội dung đề khớp; lệch 1 câu ⇒ bỏ cả đề; chỉ UPDATE khi `mo_hinh_id IS NULL`.

**Sổ tay dạng Hình 9 — 22 dạng** (dạng của tài liệu để học cách giải, không phải bản đồ)

*Nhóm A — Mở đầu về đường tròn*
- **A1 · Chứng minh nhiều điểm cùng thuộc một đường tròn.** Nhận biết: "chứng minh … điểm cùng thuộc một đường tròn", "xác định tâm và bán kính". Cách: tìm MỘT điểm cách đều tất cả — ① các góc vuông cùng nhìn một đoạn ⇒ trung điểm đoạn đó (trung tuyến ứng cạnh huyền; gặp nhiều nhất); ② hình chữ nhật / hình vuông ⇒ giao hai đường chéo; ③ tam giác thường ⇒ giao các trung trực; ④ toạ độ ⇒ khoảng cách tới gốc. Khuôn: `Gọi $I$ là trung điểm của $BC$.` → mỗi tam giác vuông: `Vì … nên $\widehat{BDC}=90^\circ$.` + `Xét $\triangle BDC$ vuông tại $D$ có $DI$ là đường trung tuyến ứng với cạnh huyền nên $DI=\dfrac{BC}{2}=IB=IC$. (1)` → `Từ (1), (2)… suy ra $IB=IC=ID=…$` → `Vậy … cùng thuộc đường tròn tâm $I$, bán kính $\dfrac{BC}{2}$.` Bẫy: không nói vì sao góc vuông; quên tâm + bán kính khi đề hỏi; dùng "tổng hai góc đối $180^\circ$" (cấm).
- **A2 · Vị trí tương đối của điểm và đường tròn.** Cách: tính khoảng cách điểm → tâm, so với $R$. Toạ độ: điểm trên trục đọc thẳng; điểm khác ⇒ hình chiếu + Pythagore; so với căn ⇒ đưa vào căn. Khuôn: `Ta có $OM=2=\sqrt4<\sqrt5$ nên điểm $M$ nằm trong đường tròn $(O;\sqrt5)$.` (mỗi điểm một dòng) · điểm lệch trục: `Gọi $H$ là hình chiếu… Xét $\triangle OHP$ vuông tại $H$ có $OP=\sqrt{OH^2+HP^2}=…$ (định lí Pythagore).` Bẫy: công thức khoảng cách toạ độ (cấm); "vẽ hình" là một phần đáp án ⇒ hình ở lời giải.
- **A3 · Tâm đối xứng, trục đối xứng.** Cách: đối xứng qua điểm ⇔ điểm là trung điểm; qua trục ⇔ trục là trung trực; đường tròn có 1 tâm đối xứng, vô số trục (mọi đường thẳng qua tâm). Khuôn: `Vì $N$ đối xứng với $M$ qua $O$ nên $O$ là trung điểm của $MN$, suy ra $ON=OM=R$, do đó $N\in(O)$.` · trắc nghiệm: mỗi phương án một dòng đúng / sai + lí do → `Chọn X.` Bẫy: "nằm giữa" ≠ "trung điểm".

*Nhóm B — Cung và dây*
- **B1 · So sánh hai đoạn thẳng (dây – đường kính).** Cách: đường kính là dây lớn nhất (dây không qua tâm thì nhỏ hơn hẳn); kết hợp bất đẳng thức tam giác; hai dây là cạnh huyền / cạnh góc vuông. Khuôn: `Vì … nên các dây $AB$, $AC$ không đi qua tâm.` → `Mà $BC$ là đường kính nên $AB<BC$ và $AC<BC$ (đường kính là dây lớn nhất).` → cộng / so. Bẫy: quên chứng minh dây không qua tâm khi cần dấu "<" (không có thì chỉ kết luận "≤").
- **B2 · Nhận biết góc ở tâm, cung.** Cách: góc ở tâm = đỉnh trùng tâm; cung nhỏ nằm trong góc; tên cung 3 chữ: chữ giữa là điểm cung đi qua; cộng góc khi "tia nằm giữa". Khuôn: `Vì tia $OA$ nằm giữa hai tia $OC$, $OB$ nên $\widehat{COB}=\widehat{COA}+\widehat{AOB}=…$` → `Suy ra số đo cung nhỏ $CB$ bằng …` → `sđ$\overset{\frown}{CnB}=360^\circ-…$` Bẫy: lấy nhầm cung nhỏ khi đề hỏi cung lớn.
- **B3 · Tính số đo góc ở tâm, số đo cung.** Cách: đưa về tam giác đặc biệt có hai cạnh là bán kính: dây $=R$ ⇒ đều ($60^\circ$); dây $=R\sqrt2$ ⇒ vuông cân ($90^\circ$); dây $=R\sqrt3$ ⇒ $120^\circ$ (đường cao $=\frac R2$); trung trực của bán kính ⇒ đều. Đồng hồ: 1 giờ ↔ $30^\circ$, 1 phút kim phút ↔ $6^\circ$; biểu đồ quạt: $p\%\cdot360^\circ$. Khuôn: chứng minh tam giác đặc biệt (lí do từng cạnh) → `do đó $\widehat{AOC}=60^\circ$` → `Suy ra sđ$\overset{\frown}{AC}=60^\circ$` → cộng / trừ cung, mỗi cung một dòng. Bẫy: đọc nhầm cung 3 chữ.
- **B4 · Tính độ dài dây, khoảng cách từ tâm đến dây.** Cách: kẻ $OH\perp$ dây ⇒ $H$ trung điểm dây (qua tam giác cân) ⇒ tam giác vuông "bán kính – nửa dây – khoảng cách" ⇒ Pythagore. Hai dây song song: cùng phía ⇒ hiệu, khác phía ⇒ tổng. Khuôn: `Kẻ $OH\perp AB$ tại $H$.` → `Xét $\triangle OAB$ cân tại $O$ ($OA=OB=R$) có $OH$ là đường cao nên $OH$ cũng là đường trung tuyến, suy ra $AH=\dfrac{AB}{2}=…$` → `Xét $\triangle OHA$ vuông tại $H$ có $OH=\sqrt{OA^2-AH^2}=…$` Bẫy: quên chứng minh $H$, $O$, $K$ thẳng hàng trước khi cộng khoảng cách.

*Nhóm C — Độ dài cung, hình quạt, vành khuyên*
- **C1 · Độ dài đường tròn, cung tròn — C2 · Diện tích hình tròn, hình quạt.** Cách: chọn đúng công thức ($l=\frac{\pi Rn}{180}$, $S_q=\frac{\pi R^2n}{360}=\frac{lR}{2}$), thay số, rút gọn phân số trước khi nhân $\pi$; tính ngược $n$ hoặc $R$ từ $l$ / $S$. Bài thực tế: nói rõ đại lượng cần tìm là độ dài cung / diện tích quạt nào. Khuôn: `Quãng đường … bằng độ dài cung $105^\circ$ của đường tròn bán kính $50$ m:` → `$l=\dfrac{\pi\cdot50\cdot105}{180}=\dfrac{175\pi}{6}\approx91{,}6$ (m).` → `Vậy …` Bẫy: $180$ với $360$; quên đổi đơn vị; làm tròn giữa chừng.
- **C3 · Vành khuyên, viên phân, hình ghép.** Cách: phân rã hình: vành khuyên $=\pi(R^2-r^2)$; viên phân $=$ quạt $-$ tam giác (tam giác cân tại tâm: kẻ đường cao, tỉ số lượng giác góc nhọn); hình ghép = cộng / trừ các mảnh, mỗi mảnh một dòng có tên. Khuôn: `Diện tích hình quạt tròn $OAB$ là $S_q=…$` → `Kẻ $OH\perp AB$…` → `Diện tích $\triangle OAB$ là …` → `Diện tích hình viên phân là $S=S_q-S_{OAB}=…\approx…$` Bẫy: $\sin120^\circ$ (cấm — đi qua tam giác vuông); trừ nhầm mảnh.

*Nhóm D — Đường thẳng và đường tròn*
- **D1 · Vị trí tương đối của đường thẳng và đường tròn.** Cách: xác định $d$ (khoảng cách tâm → đường thẳng), so với $R$: $d<R$ cắt (2 điểm chung), $d=R$ tiếp xúc (1), $d>R$ không giao (0). Khuôn: `Vì … nên khoảng cách từ tâm đến đường thẳng $a$ là $d=6$ cm.` → mỗi trường hợp một dòng `$d=6>4$ nên đường tròn và $a$ không giao nhau.` Bẫy: bài thực tế dịch "đè lên / chạm / cắt" sang 3 vị trí ⇒ ghi rõ cách hiểu vào đề (tiếp xúc tính là "có đè").
- **D2 · Chứng minh một đường thẳng là tiếp tuyến.** Cách: dấu hiệu — đường thẳng qua điểm $B\in(O)$ và ⊥ $OB$. Góc vuông lấy từ: tam giác bằng nhau (chuyển góc vuông có sẵn), Pythagore đảo, góc nội tiếp chắn nửa đường tròn (khi đã học), trung tuyến bằng nửa cạnh. Khuôn: … `Suy ra $\widehat{OBC}=\widehat{OAC}=90^\circ$, tức là $CB\perp OB$ tại $B$.` → `Vậy $CB$ là tiếp tuyến của $(O)$ tại $B$.` (đủ HAI ý: ⊥ bán kính và điểm thuộc đường tròn). Bẫy: thiếu ý "$B$ thuộc đường tròn"; ⊥ với đoạn không phải bán kính.
- **D3 · Vận dụng tính chất tiếp tuyến (tính độ dài, góc).** Cách: tiếp tuyến ⊥ bán kính ⇒ tam giác vuông tại tiếp điểm ⇒ Pythagore / tỉ số lượng giác. Bài Trái Đất, hải đăng: $OA=R+h$. Khuôn: `Vì $AC$ là tiếp tuyến của $(O)$ tại $C$ nên $AC\perp OC$.` → `Xét $\triangle OCA$ vuông tại $C$ có $AC^2=OA^2-OC^2=…$ (định lí Pythagore).` → `Suy ra $AC\approx…$ (km).` Bẫy: quên đổi m → km; $OA^2-OC^2$ dùng hằng đẳng thức cho gọn.
- **D4 · Hai tiếp tuyến cắt nhau.** Cách: mỗi điểm có hai tiếp tuyến ⇒ hai đoạn bằng nhau + phân giác. Chu vi "duỗi" bằng cách thay đoạn bằng đoạn bằng nó. $OP\perp AB$ (tam giác $PAB$ cân, $PO$ phân giác). Dạng ba tiếp tuyến: $CD=AC+BD$, $AC\cdot BD=R^2$ (qua đồng dạng). Khuôn: `Vì $EA$, $EM$ là hai tiếp tuyến của $(O)$ cắt nhau tại $E$ nên $EA=EM$.` · `… nên $SO$ là tia phân giác của $\widehat{ASB}$.` → ghép đoạn trên một dòng. Bẫy: quên điều kiện "nằm giữa" khi cộng đoạn.

*Nhóm E — Hai đường tròn*
- **E1 · Vị trí tương đối của hai đường tròn.** Cách: tính $R+R'$, $R-R'$ rồi xếp $OO'$: $>$ tổng ⇒ ngoài nhau · $=$ tổng ⇒ tiếp xúc ngoài · giữa hiệu và tổng ⇒ cắt nhau · $=$ hiệu ⇒ tiếp xúc trong · $<$ hiệu ⇒ đựng nhau. Khuôn: `Ta có $R+R'=…$, mà $OO'=…>…$ nên hai đường tròn ở ngoài nhau.` (mỗi ý một khối). Bẫy: $OO'$ nhỏ ⇒ phải so với hiệu.
- **E2 · Tính độ dài đoạn thẳng (dây chung, tiếp tuyến chung, đoạn nối tâm).** Cách: dây chung ⊥ đoạn nối tâm tại trung điểm dây (tự chứng minh) ⇒ hai tam giác vuông; tiếp tuyến chung ⇒ kẻ đường vuông góc từ tâm nhỏ tạo hình chữ nhật + tam giác vuông ($OO'$ là cạnh huyền, hiệu / tổng bán kính là cạnh góc vuông). Khuôn: `Kẻ $O'H\perp OM$ tại $H$.` → `Xét tứ giác $MNO'H$ có … nên $MNO'H$ là hình chữ nhật.` → `Suy ra $HO'=MN$, $HM=O'N=…$` → `Xét $\triangle OHO'$ vuông tại $H$ có …` Bẫy: dùng thẳng $2\sqrt{RR'}$ (cấm).

*Nhóm F — Góc nội tiếp · đường tròn ngoại tiếp, nội tiếp tam giác*
- **F1 · Tính góc nội tiếp, góc ở tâm.** Cách: chuỗi quy đổi góc nội tiếp ↔ cung ↔ góc ở tâm: góc nội tiếp $=\frac12$ cung bị chắn; cùng chắn một cung ⇒ bằng nhau; chắn nửa đường tròn ⇒ $90^\circ$; "điểm chính giữa cung" ⇒ hai cung bằng nhau. Khuôn: `Vì $\widehat{BAC}$ là góc nội tiếp chắn nửa đường tròn nên $\widehat{BAC}=90^\circ$.` · `Vì $\widehat{ABC}$ là góc nội tiếp chắn cung nhỏ $AC$ nên sđ$\overset{\frown}{AC}=2\widehat{ABC}=…$` · `Vì $\widehat{ETC}$ là góc nội tiếp chắn cung nhỏ $EC$ nên $\widehat{ETC}=\dfrac12$sđ$\overset{\frown}{EC}=…$` Bẫy: nói "chắn cung $AC$" không nói cung nào khi có hai cung.
- **F2 · Góc nội tiếp → tam giác đồng dạng → hệ thức tích.** Cách: đẳng thức tích 4 đoạn chung một đầu mút $E$ ⇒ cặp tam giác chung đỉnh $E$; góc bằng nhau lấy từ góc vuông chắn nửa đường tròn, góc đối đỉnh, góc chung, hai góc nội tiếp cùng chắn một cung. Khuôn: `Xét $\triangle ECA$ và $\triangle EDB$ có:` / `$\widehat{ECA}=\widehat{EDB}=90^\circ$ (…);` / `$\widehat{CEA}=\widehat{DEB}$ (hai góc đối đỉnh).` / `Do đó $\triangle ECA\backsim\triangle EDB$ (g.g).` / `Suy ra $\dfrac{EC}{ED}=\dfrac{EA}{EB}$, hay $EC\cdot EB=EA\cdot ED$.` Bẫy: sai thứ tự đỉnh tương ứng ⇒ tỉ số sai.
- **F3 · Đường tròn ngoại tiếp, nội tiếp tam giác.** Cách: tam giác vuông ⇒ tâm trung điểm cạnh huyền, $R=\frac12$ cạnh huyền; tam giác đều ⇒ $R=\frac{a\sqrt3}{3}$, $r=\frac{a\sqrt3}{6}$ (đi ngược: biết $R$ / $r$ / đường cao ⇒ cạnh); tam giác thường ⇒ giao trung trực / phân giác (chứng minh cách đều). Khuôn: `Bán kính đường tròn ngoại tiếp tam giác đều $MNK$ cạnh $10$ cm là $R=\dfrac{10\sqrt3}{3}$ (cm).` Bẫy: nhầm $R$ với $r$.

*Nhóm G — Tứ giác nội tiếp*
- **G1 · Chứng minh tứ giác nội tiếp / bốn điểm cùng thuộc một đường tròn.** Cách — **chỉ hai cách**: ① hai góc vuông cùng nhìn một cạnh (đối nhau hoặc kề nhau) ⇒ trung điểm cạnh đó cách đều 4 đỉnh — khuôn y hệt A1; ② tứ giác là hình chữ nhật / hình vuông. Nguồn góc vuông hay gặp: tiếp tuyến ⊥ bán kính; trung điểm dây ⇒ ⊥ (tam giác cân); đường cao; góc nội tiếp chắn nửa đường tròn. Mô hình 6 tứ giác nội tiếp của tam giác có ba đường cao: 3 tứ giác có hai góc vuông đối nhau + 3 tứ giác có hai đỉnh kề nhìn một cạnh dưới góc vuông — đều theo ①. Khuôn: như A1, kết `Vậy bốn điểm $A$, $B$, $O$, $E$ cùng thuộc đường tròn tâm $I$, bán kính $\dfrac{AO}{2}$, hay $ABOE$ là tứ giác nội tiếp.` Bẫy: dùng dấu hiệu "tổng hai góc đối $180^\circ$" (cấm).
- **G2 · Tính góc trong tứ giác nội tiếp; dùng tính chất góc.** Cách: tổng hai góc đối $=180^\circ$ (đúng cặp đối theo thứ tự đỉnh); hai góc nội tiếp cùng chắn một cung trong tứ giác đã nội tiếp ⇒ bằng nhau (vd "$DA$ là phân giác của $\widehat{FDE}$"). Khuôn: `Vì tứ giác $DEFG$ nội tiếp đường tròn $(O)$ nên $\widehat{E}+\widehat{G}=180^\circ$ và $\widehat{F}+\widehat{D}=180^\circ$.` → mỗi góc một dòng → `Vậy …` Bẫy: ghép nhầm cặp góc kề.

*Nhóm H — Hình tổng hợp (khuôn đề thi vào 10)*
- **H1 · Bài nhiều ý: a) 4 điểm / tứ giác nội tiếp · b) hệ thức – góc bằng nhau · c) tính toán / chứng minh khó.** Cách: ý a gần như luôn là A1 / G1; ý b là F2 (đồng dạng ⇒ tích) và chuyển góc qua góc nội tiếp; ý c dùng lại cặp đồng dạng / số liệu của ý trước, ghi "(câu a)", "(câu b)". Khuôn: trong mỗi ý theo khuôn của dạng con. Bẫy: góc tạo bởi tiếp tuyến và dây (cấm — đi vòng qua đồng dạng); chứng minh lại từ đầu điều ý trước đã có.

Biến thể còn thiếu mẫu (gặp thì soạn theo cách giải của dạng, kiểm kĩ): A1 tam giác thường (giao trung trực) · B3 đồng hồ, biểu đồ quạt · C3 hình ghép thực tế · D2 tiếp tuyến bằng Pythagore đảo · D4 bài $AC\cdot BD=R^2$ · E2 dây chung · F2 chuyển góc qua hai góc nội tiếp cùng chắn · G1 mô hình tam giác 3 đường cao · H1 ý c khó · trắc nghiệm tính toán.

### Hình giải tích

> Lượng giác K9 = KNTT Chương IV (Bài 11 Tỉ số lượng giác của góc nhọn · Bài 12 Hệ thức giữa cạnh, góc trong tam giác vuông). "Lượng giác mới là hgt, còn đường tròn là hình học" [09/10 · Thùy]. Câu nào vào `hgt`: mục Phân kho (Thùy chốt 15/11). Lượng giác nằm trong bài Hình ⇒ cũng theo luật dưới đây về công cụ.

**(a) Công cụ được phép / cấm**
- **Được dùng**: định nghĩa $\sin,\cos,\tan,\cot$ góc nhọn trong tam giác vuông (đối / huyền, kề / huyền, đối / kề, kề / đối) · tỉ số lượng giác hai góc phụ nhau · bảng góc đặc biệt $30^\circ,45^\circ,60^\circ$ · máy tính cầm tay · **hệ thức cạnh – góc** (cạnh góc vuông $=$ huyền $\cdot\sin$ góc đối $=$ huyền $\cdot\cos$ góc kề $=$ cạnh góc vuông kia $\cdot\tan$ góc đối $=$ cạnh góc vuông kia $\cdot\cot$ góc kề) · Pythagore · tổng ba góc · tam giác đồng dạng · tam giác cân, đều, đường cao.
- **Thứ tự bài** [10/10]: câu thuộc Bài 11 chỉ dùng **định nghĩa** ($\tan B=\dfrac{AC}{AB}$ ⇒ $AC=AB\cdot\tan B$), **không** ghi căn cứ "(hệ thức giữa cạnh và góc)" — đó là Bài 12. Từ Bài 12 mới viện dẫn hệ thức cạnh – góc.
- **CẤM dùng thẳng**:
  - Hệ thức lượng về cạnh và đường cao ⇒ chứng minh qua hai tam giác đồng dạng (vd $\triangle HBA\backsim\triangle ABC$ (g.g) ⇒ $\dfrac{BH}{AB}=\dfrac{AB}{BC}$), hoặc tỉ số lượng giác, hoặc diện tích tính hai cách ($AH\cdot BC=AB\cdot AC$ vì cùng bằng $2S$). Đề bắt chứng minh chính hệ thức đó ⇒ chứng minh từ đồng dạng (vd $AB^2=BI\cdot BC$ bằng $\triangle BIA\backsim\triangle BAC$).
  - Định lí sin, côsin, $\dfrac12ab\sin C$ cho tam giác thường ⇒ kẻ đường cao đưa về tam giác vuông.
  - Tỉ số lượng giác góc tù, công thức cộng, nhân đôi.
  - Đường trung bình của tam giác (như mục Hình).
- **Dùng được nhưng phải ghi căn cứ trong ngoặc** (là bài tập SGK, không phải định lí): $\sin^2\alpha+\cos^2\alpha=1$, $\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}$, $\cot\alpha=\dfrac{\cos\alpha}{\sin\alpha}$, $\tan\alpha\cdot\cot\alpha=1$ — vd "(hệ thức $\sin^2\alpha+\cos^2\alpha=1$)". Bài yêu cầu chứng minh chính các hệ thức này ⇒ chứng minh từ định nghĩa + Pythagore trong một tam giác vuông. $1+\tan^2\alpha=\dfrac1{\cos^2\alpha}$ và hệ thức xa hơn: không dùng thẳng — suy ra từ ba hệ thức trên ngay trong bài.
- "Cho $\sin\alpha$, tính các tỉ số còn lại" ⇒ ưu tiên cách SGK: dựng tam giác vuông có cạnh theo tỉ số đã cho (đối $3k$, huyền $5k$) rồi Pythagore.
- **Làm tròn** (cụ thể hoá §A14): theo đề; đề không nêu ⇒ độ dài 1 chữ số thập phân, góc tới độ + `**Ghi chú:**` nếu cần, không treo `**Chưa chắc:**`. Diện tích / cung không nêu ⇒ giữ đáp số chính xác kèm giá trị gần đúng 2 chữ số thập phân. Đáp số chính xác đẹp ⇒ không làm tròn. Giữ giá trị đúng (căn, phân số) tới bước cuối; tính tiếp từ dữ kiện gốc; dấu `\approx` ở dòng làm tròn. Đề dùng $\pi\approx3{,}14$ ⇒ ghi rõ (kết quả khác $\pi$ máy tính).

**(b) Trình bày riêng**
- Khuôn 2 phần + card như Đại; dòng ngắn + căn cứ như Hình. Nêu rõ **tam giác vuông nào, vuông tại đâu** trước khi viết tỉ số. Dấu nhân `\cdot` (`$AB\cdot\sin C$`).

| Dạng | Khuôn Phần 2 | Mấu chốt / bẫy |
|---|---|---|
| Tính tỉ số lượng giác góc nhọn | (Pythagore tính cạnh thiếu) → "Xét $\triangle ABC$ vuông tại $A$, ta có: $\sin B=\dfrac{AC}{BC}=…$; $\cos B=…$; $\tan B=…$; $\cot B=…$" | Đúng cạnh đối – kề **của góc đang xét**; góc $C$ phụ góc $B$ ⇒ đổi chéo |
| Biết một tỉ số, tính các tỉ số còn lại | "Xét tam giác vuông có … (cạnh đối $3k$, huyền $5k$)" → Pythagore → các tỉ số | Góc nhọn ⇒ mọi tỉ số dương |
| Góc phụ nhau, sắp xếp, so sánh | Đưa về cùng loại tỉ số ($\cos 55^\circ=\sin35^\circ$) → "Vì $…<…<…$ nên $\sin…<\sin…$ (góc nhọn tăng thì $\sin$, $\tan$ tăng; $\cos$, $\cot$ giảm)" | Chiều của $\cos$, $\cot$ ngược lại |
| Tính giá trị biểu thức lượng giác | Chép đề $=$ … (thay góc phụ nhau / giá trị đặc biệt) từng dòng | $\sin^220^\circ+\sin^270^\circ=\sin^220^\circ+\cos^220^\circ$ — nêu căn cứ |
| Tính cạnh trong tam giác vuông | "Xét $\triangle ABC$ vuông tại $A$, ta có: $AC=BC\cdot\sin B$ (hệ thức giữa cạnh và góc)" → thay số → $\approx$ … (cm) | Chọn tỉ số nối cạnh đã biết – cạnh cần tìm – góc đã biết |
| Tính góc | $\tan B=\dfrac{AC}{AB}=…$ ⇒ $\widehat{B}\approx…^\circ$ → $\widehat{C}=90^\circ-\widehat{B}$ | Máy ở chế độ độ |
| Giải tam giác vuông | Nêu đủ **3 yếu tố còn thiếu**, mỗi yếu tố một cụm dòng; kết luận gom lại | Tính từ dữ kiện gốc |
| Tam giác thường / tứ giác | "Kẻ đường cao $AH$ của $\triangle ABC$." → từng tam giác vuông → ghép | Chân đường cao trong hay ngoài cạnh (góc tù) |
| Toán thực tế (chiều cao, khoảng cách, góc nâng, độ dốc) | Mô hình hoá: "Gọi $AB$ là chiều cao tháp, $AC$ là …; $\triangle ABC$ vuông tại $A$, $\widehat{C}=…$" → hệ thức → thay số → làm tròn → "Vậy …" kèm đơn vị | Cộng chiều cao mắt / giác kế; đổi đơn vị; góc nâng – góc hạ so với phương ngang |
| Chứng minh hệ thức | "Vế trái $=$ …" từng dòng → "$=$ Vế phải." → "Vậy …" (từ định nghĩa trong một tam giác vuông cụ thể) | Chọn tam giác vuông chứa góc cần xét |

- Tách ý: bài có tam giác / hình ⇒ không tách, Phần 2 ghi a) b). Bài "Tính giá trị biểu thức / So sánh" thuần số nhiều ý độc lập ⇒ tách như Đại.
- Hình: bài có tam giác, hình thực tế ⇒ **có hình**; hình thực tế (tháp, cây, thang, máy bay) vẽ thành **mô hình tam giác** ghi số liệu đề (nguồn hình theo §A8). Bài thuần số ⇒ không hình. Số liệu chỉ có trên hình (vd $BC=5{,}8$ m, góc $60^\circ$) ⇒ viết thêm vào lời văn. Hình đề cương lệch lời văn ⇒ không đưa hình đó vào đề, lời giải vẽ hình theo lời văn.
- `dap_an`: `$AC\approx7{,}7$ cm` · `$\widehat{B}\approx37^\circ$` · giải tam giác `$BC=10$ cm; $\widehat{B}\approx53^\circ$; $\widehat{C}\approx37^\circ$`. Hai kết quả ⇒ `tu_luan`.

**(c) Sai lầm cần tránh**
- [10/10] câu thuộc Bài 11 ghi căn cứ "(hệ thức giữa cạnh và góc)" ⇒ chỉ dùng định nghĩa.
- [10/10] lời giải sách dùng thẳng hệ thức đường cao ⇒ lời giải sách chỉ là nhân chứng kiểm đáp số; viết lại bằng đồng dạng / tỉ số lượng giác.
- [13/10] viện dẫn $\tan\cdot\cot=1$, $\sin^2+\cos^2=1$ không ghi căn cứ ⇒ ghi căn cứ.
- [13/10] tính tiếp từ số đã làm tròn; bài hai kết quả ghi `tra_loi_ngan` ⇒ tính từ dữ kiện gốc; hai kết quả là `tu_luan`.
- [14/10] trục căn thức khi tính lượng giác ở đề giữa kì ⇒ viết lại bằng $\cot$.
- [24/10] hình ghi $x$, $y$ ngược lời văn / chữ $40^\circ$ mà hình $50^\circ$ ⇒ giải theo một nguồn (thường lời văn), ghi rõ ở `**Ghi chú:**`; hai cách cho hai đáp số khác nhau ⇒ `**Chưa chắc:**`.

### Phân dạng riêng

- Câu Hình đề thi / đề cương: xếp từng câu vào bài đích theo chủ đề (luật "Xếp bài vào bài đích" của Hình chung): hai tiếp tuyến cắt nhau → HH00109 · một tiếp tuyến → HH00108 · quạt / vành khuyên / hình tròn → HH00107 · độ dài cung → HH00106 · đường tròn (tam giác nội tiếp, đường kính) → HH00105 · bài lượng giác nằm trong bài Hình → HH00095 "Các bài toán liên quan đến tỉ số lượng giác" · bộ đề giữa kì I → HH00140 "Ôn thi giữa kì I". **Không có bài "Ôn thi cuối kì"** [18/10 · Thùy] — câu cuối kì xếp theo chủ đề. Không khớp bài nào ⇒ dạng chờ Hình của khối.
- Câu `hgt` K9 xếp vào bản đồ hgt K9 theo §A3 (kiểu bài, dạng sau thắng, nhãn lí do khi để trống).
- Cặp dễ nhầm:
  - Hai tiếp tuyến cắt nhau (HH00109) ↔ một tiếp tuyến (HH00108): HH00109 chỉ khi thật có HAI tiếp tuyến cắt nhau tại một điểm và lời giải dùng tính chất đó [03/11].
  - Tỉ số lượng giác (Bài 11) ↔ hệ thức cạnh – góc (Bài 12): Bài 11 khi chỉ cần định nghĩa; Bài 12 khi giải tam giác vuông / bài thực tế dùng hệ thức.
  - Bài cực trị bối cảnh hình: lời giải thuần đại số ⇒ Đại; có lập luận hình thật ⇒ Hình.

### Theo loại nguồn

**Chung mọi nguồn K9**
- **Thử lại bằng máy theo loại bài** (cụ thể hoá §A4): phương trình / hệ ⇒ thay nghiệm vào ĐỀ (phân số chính xác hoặc sai số $10^{-9}$) + quét lưới tìm nghiệm sót · bất phương trình ⇒ thử hai phía biên + chính biên · tham số ⇒ quét lưới $m$ · rút gọn / đẳng thức ⇒ ≥ 3 bộ số hợp điều kiện · lời văn ⇒ thay đáp số vào từng dữ kiện · lượng giác ⇒ `Math.sin(x*Math.PI/180)` · hình ⇒ toạ độ số, kiểm từng khẳng định · bất đẳng thức ⇒ ≥ 2000 bộ số ngẫu nhiên (cả biên, số âm) · cực trị ⇒ quét số.
- Đề sai (§A4): ngoài `**Ghi chú:**`, thêm một dòng "Lưu ý: …" đầu Phần 2 để học sinh biết đã hiểu đề thế nào.
- Ý đề in thiếu hẳn một vế / không đọc nổi ⇒ giữ ý, `**Chưa chắc:**` nêu lí do, không đáp án (§A14).
- `**Ghi chú:**` chỉ cho lỗi của ĐỀ GỐC / điều người duyệt cần biết — không ghi "bản máy gõ nhầm".
- Câu trùng nguyên văn giữa các phần / các đề ⇒ vẫn nhập mỗi chỗ; máy tự gom, trỏ về câu cũ.
- Khuôn tệp soạn: §A10. Dòng `**Hình:**`, `**Hình giải:**`, `**Ghi chú:**`, `**Chưa chắc:**` đứng sau đề và phương án, trước Phần 1 (hoặc Sơ đồ tư duy).

**Sách tham khảo** (`E:\BK ACADEMY\Tài liệu tham khảo\K9\`)
- Nguồn: `NĐT Toán 9 HK1` (Ngô Đức Tài, *Lý thuyết và phân dạng bài tập Toán 9 HK1*; không lời giải, TN không đáp án) · `NT Toán 9 HK1` (THCS Nguyễn Trãi, *Tài liệu học tập Toán 9 HK1*; ví dụ có "Giải" ⇒ **nguồn khuôn trình bày**) · `TC Toán 9 HK2` (Thầy Cường Pleiku; ví dụ có giải — nguồn khuôn chứng minh 4 điểm) · `CĐ7 Hệ thức lượng` (có lời giải) · `Phiếu BT C4 Toán 9` (có hướng dẫn giải) · `PHL` (Phạm Hoàng Long, KNTT HK1 chương 5; trùng nhiều với NĐT).
- Mã bài: NĐT `C2 B1 D4 VD2` · `C2 B1 TL7` · `C2 B1 TN3` · NT `CĐ2 §C6 B8` · `CĐ2 TN4` · TC `CĐ3 B12`; ý tách thêm chữ `a`, `b`. Truy nguồn từng câu Hình: `kho-rules/hinh/lo/k9-hoc-nguon.json`.
- Tài liệu không lời giải / TN không đáp án ⇒ mọi đáp số cần nhân chứng thứ hai (Opus giải mù + code thử ngược).
- PDF `NT` mất biến MathType ("Gọi và lần lượt là…") ⇒ đọc từ `.doc` hoặc ảnh trang. `pdftotext` mất dấu mũ góc, cung, căn, ∽ ⇒ đối chiếu ảnh trang.
- TN sách sai phương án ⇒ §A4 (vd phương án in nửa dây $\sqrt{95}$ ⇒ sửa thành $2\sqrt{95}$). Câu hỏi không có đáp án duy nhất ⇒ sửa câu hỏi cho có một đáp án ("không thể có bao nhiêu điểm chung") + `**Ghi chú:**` + `**Chưa chắc:**`.
- Kho cũ K9 (câu Đại, câu HGT trước 10/2026) chỉ để lọc trùng (khoá `chuanDe`), không phải mẫu trình bày.
- Bảng điền ô trong sách ⇒ chuyển thành các ý a)–e) theo từng cột.

**Đề thi** (bộ đề giữa kì / cuối kì, toanmath)
- Phần riêng K9 của khuôn §A10: tên đề `Đề kiểm tra <giữa|cuối> học kì 1 Toán 9 năm <năm học> — <trường (phường/quận)> (<mã đề>)` · `nam:` = năm đầu năm học · `bo_sach: KNTT` (đề rõ bộ khác ⇒ ghi đúng) · dòng câu `kho=dai|hinh_hoc|hgt`. Đề không ghi tên trường ⇒ ghi theo phòng / huyện.
- Giữ đúng chữ "Câu" hay "Bài" của đề. Nhãn La Mã (Bài IIa, III.1) ⇒ cổng tự đổi số Ả Rập. Đề in hai lần cùng số bài ⇒ đánh lại + `**Ghi chú:**`. Lời dẫn các ý khác nhau (1a "Giải phương trình", 1b "Giải bất phương trình") ⇒ vẫn MỘT bài trên đề, mỗi ý giữ lời dẫn riêng.
- Bài "học sinh chọn một trong hai ý" ⇒ nhập cả hai. Chỉ trang ĐỀ là đề; bỏ trang quảng cáo cuối. Hai mã đề cùng trường ⇒ soạn nguyên từng đề.
- Hình: nguồn hình đề theo §A8 (gốc ổn ⇒ cắt từ `goc.pdf`, `pdftoppm -r 150`, vào `img\`), mở ảnh kiểm (đúng câu, không cụt, không dính chữ câu khác). Bài hình tự luận đề không cho hình ⇒ vẽ hình giải bằng code.
- Không có hướng dẫn chấm ⇒ lời giải chi tiết đủ khuôn (không viết sơ lược); chỗ không tự kiểm được bằng máy ⇒ `**Chưa chắc:**`.

**Đề cương**
- **Tìm bản gốc của bài trong sách K9 đang có trước khi nhập** (đề cương hay lấy bài từ NĐT / NT rồi in sai) — bản gốc là nhân chứng thứ hai. Vd đề cương in "=" thành "−" ($3(x-5)(x+2)=x^2-5x$, NT trang 4 Bài 1 ý 10); bài sân vườn chữ L = NĐT trang 53 Dạng 5 VD1.
- Đề cương đánh số bài LẠI TỪ 1 ở mỗi phần ⇒ công cụ K9 khoá câu theo (phần, nhãn) (`dc-lib.mjs`, `ghep-chung.mjs`; bản K8 khoá theo nhãn — không dùng lại). Nhãn duy nhất trong một phần; trùng ⇒ `Bài 5.1`, `Bài 5.2` + `**Ghi chú:**`.
- Ghi vào `tai_lieu(loai='de_thi')` + `cau_hinh.deThi.kieu='de_cuong'`, nhóm bài giữ cấu trúc gốc.
- Ý in đánh số 1)–n) hoặc bỏ chữ (a, b, c, d, e, g, h — thiếu f) ⇒ nhập lại liên tiếp a, b, c… đúng thứ tự. Đề in sai số câu ⇒ đánh lại theo thứ tự + `**Ghi chú:**`. Không đánh số bài ⇒ `Bài 1a–1e`. "Bài V" ⇒ `Bài 5`; hai bài con 1), 2) ⇒ `Bài 4.1`, `4.2`.
- Phần trộn trắc nghiệm với tự luận ⇒ tách thành các `## PHẦN` riêng, mỗi phần MỘT loại, giữ tên gốc + "(trắc nghiệm)" / "(tự luận)".
- **Đề cương cuối kì làm hai lượt**: lượt Hình (mọi bài / ý hình, kể cả "tính giá trị biểu thức lượng giác" thuần số và cực trị có hình) rồi lượt Đại (mọi bài còn lại; trước khi gõ liệt kê bài lượt Hình đã lấy để không nhập đôi).
- Đề cương cuối kì: hình đề theo §A8 (gốc ổn giữ, tệ vẽ lại); hình giải vẽ bằng code.
- Hai tệp cùng trường hai năm học trùng nguyên đề ⇒ chỉ ghi một bản.
- Sau mỗi đề cương mới có bài Hình ⇒ chạy lại `nhap_tu_de_thi.mjs` để đẩy vào Hình–Luyện.

**Bản đồ K9 (lý thuyết + ví dụ dạng)** [14/10 · Thùy]
- Lý thuyết của DẠNG (không chép lý thuyết nhóm), thẻ theo §A5: `##TC` (kiến thức cần nhớ, mỗi ý một dòng "- ") · `##PP <tên>` (bắt buộc; 3–6 bước, mỗi dòng một bước trọn ý, không ghi "Bước N") · `##CY` (bẫy thật) · tuỳ chọn `##DN`, `##DL`, `##NX`. Các thẻ cách nhau một dòng trống, trong thẻ không dòng trống. Không để ví dụ trong lý thuyết.
- Mỗi dạng **2 ví dụ** `##VD` có lời giải: ví dụ 1 cơ bản đúng dạng, ví dụ 2 khó hơn một bậc vẫn đúng dạng; khác các ví dụ đã có; số liệu ra kết quả đẹp. Sau đề một dòng trống, lời giải mở bằng `Bài giải:` rồi liền dòng, kết `Vậy …`.
- Bám **mô tả dạng** (đích). Mô tả lệch tên dạng / mơ hồ ⇒ làm theo cách hiểu hợp lí nhất, ghi chú cho trưởng khối; không tự đổi đích.

### Công cụ riêng

| Đường dẫn | Việc |
|---|---|
| `scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp.soan.md> --lam-viec "<LV>" --khoi 9 --chi-kiem` | Cổng khuôn K9 (chặn `\times`, dấu chấm làm dấu nhân; đổi nhãn La Mã; `kho=hinh_hoc` + khối 9 ⇒ gán dạng). Chạy từ thư mục repo tới "✔ đạt cổng" |
| `scripts/kho/de-thi/ghi.mjs --ghi` | Ghi đề + câu một lần (câu trùng tự trỏ câu cũ) |
| `scripts/kho/de-thi/k9-ghi-het.sh` · `k9-cki-ghi-het.sh` · `k9-cki-ghi-de.sh` | Ghi tuần tự bộ đề GKI / CKI K9 (biến `DANG_HINH_K9` = dạng Hình tạm) |
| `scripts/kho/de-thi/k9-ck-ghi-de.sh <MA> [--ghi]` · `k9-ck-ghi-het.sh <MA…>` | Ghi đề cương cuối kì (lượt Hình / Đại); dấu `<LV>/da-ghi.txt` |
| `kho-rules/dai/lo/k9/de-cuong/dc-lib.mjs` · `ghep-chung.mjs <MA> <LV> 9` | Thư viện + ghép đề cương K9, khoá (phần, nhãn); nhận `kho=hinh_hoc`; `DANG_HINH_K9=HH00095` |
| `kho-rules/dai/lo/k9/de-cuong/<MA>.build.mjs` · `<MA>.ghep-brief.mjs` · `GKI26-3TRUONG.ghep-brief.mjs` | Gõ đề → `de.json` + tệp khung từng phần (`lap` = bài in lặp); sinh brief riêng từng trường |
| `kho-rules/dai/lo/k9/bo-de/chuan-bi.mjs` · `ds-de.json` | Tách bộ đề PDF thành từng đề + danh sách (trường, năm, trang) |
| `kho-rules/dai/lo/k9/cki/_ghep-brief.mjs` · `xep-hinh.mjs` | Dựng brief cuối kì; xếp câu Hình cuối kì theo chủ đề (chỉ đổi `dang_chinh`, mã câu bất biến) |
| `kho-rules/dai/lo/k9/ck/chuan-bi.mjs` · `ds.json` · `gan-mo-hinh-tt.mjs [--xep] [--ghi]` | Quét PDF đề cương cuối kì; gắn mô hình tiếp tuyến theo `<MA>.hinh.phanloai.json` |
| `scripts/hinh-luyen/nhap_tu_de_thi.mjs --khoi 9 --loc '<mẫu>' --ghi` | Đẩy bài Hình đề thi / đề cương từ `hinh_hoc_cau_hoi` vào Hình–Luyện (tự bỏ bài đã nhập theo `nguon_ma_cau`) |
| `scripts/kho/de-thi/nhom-bai.mjs` | Gom nhóm bài (Bài – ý) trên đề |
| `scripts/kho/hinh-toado.mjs` (`P, mid, kc, tren, chieu, giaoDT, giaoDTvaTron, giaoHaiTron, tiepDiem, goc, kiem, veNhieu`) | Dựng toạ độ đúng giả thiết, `kiem([...])` mệnh đề, vẽ hình đường tròn. Mẫu 22 hình: `kho-rules/hinh/lo/k9-lo1.mjs` |
| `scripts/kho/hinh-lo.mjs <lô.mjs> --ra <thư mục> [--md bản-xem.md]` | Chạy cả lô hình + kiểm |
| `scripts/kho/do-thi.mjs` | Vẽ đồ thị từ mô tả JSON (kiểm điểm nằm trên đường) |
| `scripts/kho/sach/kiem-p1-card.mjs` (`kiemP1`) · `scripts/kho/cong-ghi.mjs` | Kiểm khuôn card Phần 1 · cổng ghi câu từ sách (biên bản kiểm → `kiem_may`) |
| `kho-rules/dai/lo/k9/ban-do/kiem.mjs "<tệp ra>" <mã dạng,…>` | Kiểm khuôn lý thuyết + ví dụ dạng bản đồ K9 |
| `kho-rules/hinh/lo/k9-hoc/cat-hinh.mjs` · `soat.mjs` · `ghep.mjs` | Cắt hình PDF vector 300 dpi, máy soát, ghép nháp (đường dẫn scratchpad cứng — sửa trước khi dùng lại) |
| `pdftoppm -r 260\|300 -png -singlefile -f <tr> -l <tr> -x -y -W -H "<LV>/goc.pdf" "<LV>/z/<tên>"` | Phóng to chỗ không đọc chắc (toạ độ = 2 × toạ độ ảnh 130 / 150 dpi) |
| Thư mục làm việc ngoài repo | `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\<MA>\`, `…\de-thi\K9\<MA>\`, `…\bdm\k9\` (`goc.pdf`, `trang\`, `img\`, `tam\`, `z\`) |

- Công cụ vẽ / nhập Hình chung (`ve_hinh_lib.mjs`, `bang_hinh.mjs`, `nhap_hh_tu_draft.mjs`, `nhap_lo.mjs`, `gan_hinh.mjs`): bảng "Công cụ Hình" của mục Hình chung. Bài nhiều ý / có sơ đồ tư duy ⇒ `nhap_lo.mjs`, không `nhap_hh_tu_draft.mjs`.

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
| 8 | ✔ (bộ đề 10/10) | ✔ (toanmath 13/11) | — | — | |
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
- **Luật ưu tiên cách giải — nhóm Số chính phương K6 (NDB02800 · NDB02801; Thùy 21/11):** "chứng minh không phải số chính phương" ưu tiên **cách 1** = *chia hết cho số nguyên tố $p$ nhưng không chia hết cho $p^2$*; thứ hai **cách 2** = chữ số tận cùng; thứ ba **cách 3** = số dư khi chia cho 3, 4, 5. **Clone chọn bài chủ yếu thuộc cách 1 và lời giải dùng cách 1**; chỉ khi cách 1 không dùng được mới sang cách 2, 3. Đã bù 60 câu cách 1 (`scripts/kho/clone/k6-scp.mjs`, bộ kiểm BigInt: không là SCP · $p$ nguyên tố · $p\mid A$ · $p^2\nmid A$). Trước đó NDB02800 có 18/30 câu giải bằng chữ số tận cùng, NDB02801 chỉ 8/31 bằng cách 1 — **đã dọn xong cùng ngày** (`k6-scp-sua.mjs`): 26 câu cũ giải được bằng cách 1 → viết lại lời giải theo cách 1; 35 câu không giải được bằng cách 1 (tận cùng · số dư · kẹp · luỹ thừa số mũ lẻ · abcabc · đề không thuộc dạng) → **xoá mềm vào kho rác** (khôi phục: `update dai_cau_hoi set xoa_at = null where ma_cau = …`). Còn NDB02800 = 51 câu, NDB02801 = 35 câu.
