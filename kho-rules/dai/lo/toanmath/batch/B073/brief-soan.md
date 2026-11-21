luat: da9c2b7f97b6

# BRIEF SOẠN — khối 7 (cắt từ spec-giai-bai.md, KHÔNG sửa tay)

> VAI: **TRẠM SOẠN (Sonnet)**. Làm theo spec §C2 trạm 3–5: đọc HẾT luật dưới đây MỘT lần cho cả batch → phân dạng từng câu → đọc lý thuyết + ví dụ của dạng → giải → thử đáp số bằng script → chạy cổng.
> Dòng đầu tệp soạn chép đúng: `luat: da9c2b7f97b6`

## ĐẦU RIÊNG CỦA BATCH

# ĐẦU RIÊNG BATCH B073 — K7 GIỮA KÌ II (CHỈ phần GKII của batch trộn GKI + GKII; không đụng bài GKI) — LÔ MẪU (§C3)

- `<MA>` = `B073-NN`. Danh sách: `Repo\kho-rules\dai\lo\toanmath\batch\B073\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach`, `de` (trang đề trong file PDF gốc), `hd` (trang đáp án, rỗng nếu không có), `ma_de`/`tach`, `ghi_chu`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B073\<MA>` (`goc.pdf` · `trang\p-N.png` 150 dpi — N là số trang TRONG goc.pdf; bộ nhiều đề thì goc.pdf chỉ còn trang đã tách, xem thực tế thư mục · `img\` · `tam\` · `de.boc.json`). Phóng to: spec §A11.
- Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B073\<MA>.soan.md` (spec §A10). Loại: đề thi (`thoi_gian_phut` = số phút ghi trên đề; không ghi ⇒ 90). Mốc kiến thức: **giữa kì II lớp 7** (spec Phần B › Khối 7, dòng "Giữa kì II" — luật TẠM).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B073/<MA>.soan.md --lam-viec "<LV>" --khoi 7 --chi-kiem`
- Bản đồ dạng K7 (Đại chỉ phủ Ch I–II "Số hữu tỉ", "Số thực"; Hình: HH00099–104, HH00170–172, chờ HH07000000): dump truy vấn 21/11 ở `C:\Users\WBPC\AppData\Local\Temp\claude\ad0c1492ee4a551d\fb1a0473-f033-4d4e-8640-833d19b42010\scratchpad\bdm\dai-k7-full.txt` (tạo lại: `node scripts/kho/bdm-ly-thuyet.mjs 7`); lý thuyết Hình 7: `kho-rules/dai/lo/k7-ly-thuyet-hinh7.md`. **Đọc đủ mô tả + lý thuyết của dạng ứng viên rồi mới gán** (§A3).
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `anh-batch.mjs day B073`. Trạm không tự chạy.
- Mẫu tệp soạn ĐẠT: `batch/B108/B108-01.soan.md` (có `dang=`/`chac=`, K12) và `batch/B018/B018-01.soan.md` (K7 cuối kì I, chưa có hai trường đó), `kho-rules/dai/lo/k7/GKI-32.soan.md`.
- Quy ước đã chốt cho lô này: (1) đề nhiều mã đề ⇒ MỘT mã (mã chọn ở ds-de), không nhập mã còn lại; (2) phần tiếng Anh / phần riêng của hệ khác (Ban Mai hệ T), bài "thưởng điểm" ngoài toán ⇒ không nhập, ghi ở GHI CHÚ CHO NGƯỜI DUYỆT; (3) có đáp án in ⇒ vẫn TỰ GIẢI TRƯỚC, bản in là nhân chứng (§A4); (4) không đáp án in ⇒ ghi rõ ở GHI CHÚ, Opus giải mù toàn bộ; (5) bản đồ Đại K7 không phủ chương ⇒ `dang=—` `chac=—`, lý do mở đầu `THIẾU DẠNG: …`/`KHÔNG THUỘC CHỦ ĐỀ: …` (ghi vào GHI CHÚ CHO NGƯỜI DUYỆT dưới dạng bảng nhãn → lý do → tên dạng nên có); KHÔNG ép vào dạng Ch I–II; (6) bộ sách không ghi ⇒ KNTT + ghi chú; nghi Cánh Diều / CTST rõ ràng ⇒ dừng, báo điều phối (§Khối 7).

## Ghi chú riêng từng đề B073

| MA | Trường · năm học | Mã đề | Trang đề | Trang đáp án | Lớp chữ | Bộ sách | Cấu trúc | Ghi chú của trạm chuẩn bị |
|---|---|---|---|---|---|---|---|---|
| B073-01 | Trường THCS Uy Nỗ, huyện Đông Anh, Hà Nội · 2024–2025 | Đề duy nhất (không ghi mã) | 1-2 | 3-5 | chữ | KNTT (suy đoán — đề không ghi bộ sách; khung ma trận (trang 6) ghi 'Tỉ lệ thức và dãy tỉ số bằng nhau', 'Biểu thức đại số / Đa) | I. 12 TN (3,0đ, 0,5đ/câu) · II. Tự luận 5 câu (Câu 13–17, 7,0đ): C13 tìm x,y từ tỉ lệ thức (a,b); C14 đa thức một biến (a,b,c); C15 bài toán lời tỉ lệ (4:5:6); C16 hình tam giác vuông ABC, phân giác g | PDF 10 trang: 1-2 đề (2 trang, có dấu Hết); 3-5 hướng dẫn chấm; 6-9 khung ma trận + bản đặc tả; 10 quảng cáo 'Xem thêm'. Một đề duy nhất. Có thư mục docx cùng tên (ma trận/đặc tả; đề + đáp án) chỉ làm nhân chứng — chưa đối chiếu nội dung docx. |

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

## Khối 7

### Phạm vi kiến thức

- **Sách chuẩn = KNTT Toán 7** [10/10 · Thùy: "cái nào ko phải KNTT thì bỏ"] ⇒ phân loại bộ sách TRƯỚC khi soạn; đề có hình hộp / lăng trụ ở HK1 là Chân trời sáng tạo (KNTT tập 1 không có lăng trụ) ⇒ không nhập đề; Cánh Diều ⇒ không nhập đề. Đề rõ ràng không phải KNTT ⇒ dừng, báo điều phối. Đề thiếu trang ⇒ không nhập đề.
- Lời giải viết như HS lớp 7 viết vào bài kiểm tra, đúng cách trình bày lý thuyết bản đồ K7 (Đại: `dai_bdm_nhom.ly_thuyet`, Số hữu tỉ `NNB00934–961`, Số thực `NNB00962–973`) hoặc đúng lối lập luận các bài Hình 7 đã nhập. Whitelist Đại = lý thuyết bản đồ K7 trong phạm vi + toàn bộ lớp 6 + tiểu học (chia hết, ước – bội, số nguyên tố dùng được cho bài nâng cao).
- Thứ tự chương KNTT 7 Tập 1: Ch I Số hữu tỉ · Ch II Số thực · Ch III Góc và đường thẳng song song · Ch IV Tam giác bằng nhau · Ch V Thu thập và biểu diễn dữ liệu.
- **Giữa kì I**: Đại = Ch I (so sánh · cộng trừ nhân chia · luỹ thừa · thứ tự phép tính, chuyển vế) + Ch II (số thập phân vô hạn tuần hoàn · làm tròn · số vô tỉ, căn bậc hai · giá trị tuyệt đối · so sánh số thực); bài thực tế (giảm giá, %, chia tiền) và nâng cao của hai chương. Hình = góc đặc biệt, hai đường thẳng song song (và tổng ba góc nếu đề tới); tam giác bằng nhau thường chưa có.
- **Cuối kì I (Ch I–V)**: thêm Ch III đầy đủ · Ch IV (tổng ba góc, hai tam giác bằng nhau, c.c.c · c.g.c · g.c.g, trường hợp bằng nhau của tam giác vuông, tam giác cân, đường trung trực) · Ch V (dữ liệu là số / không là số, bảng thống kê, biểu đồ đoạn thẳng, biểu đồ hình quạt tròn — đọc %, tính số lượng từ %).
- **Giữa kì II (KNTT, Hà Nội) [K7-GKII · luật TẠM 21/11 do điều phối lô mẫu viết trước, người duyệt mẫu sửa]**: phạm vi = Tập 1 trọn (Ch I–V, kể cả tam giác bằng nhau, tam giác cân, đường trung trực, dữ liệu – biểu đồ) **+ phần Tập 2 mà CHÍNH ĐỀ kiểm tra** (Ch VI tỉ lệ thức – dãy tỉ số bằng nhau – đại lượng tỉ lệ thuận / nghịch – bài toán chia tỉ lệ · Ch VII biểu thức đại số, đa thức một biến (bậc, hệ số, sắp xếp, cộng trừ nhân chia, nghiệm) · Ch VIII làm quen biến cố, xác suất của biến cố trong trò chơi đơn giản (kết quả đồng khả năng; xác suất = số kết quả thuận lợi / tổng số kết quả có thể) · Ch IX quan hệ góc – cạnh đối diện trong tam giác, đường vuông góc – đường xiên, bất đẳng thức tam giác, các đường đồng quy khi đề tới) — đề kiểm tra tới đâu dùng tới đó, đề không chạm thì cấm. **Bản đồ dạng Đại K7 hiện chỉ phủ Ch I–II (cộng MỘT dạng thống kê NDB01349 «Biểu đồ/Thống kê» — đọc biểu đồ tròn / cột / đoạn thẳng, thực tế)** ⇒ câu thuộc Ch V–VIII ngoài dạng đó (tỉ lệ thức, tỉ lệ thuận – nghịch, đa thức, xác suất, lập bảng thống kê): `dang=—` `chac=—`, lý do mở đầu `THIẾU DẠNG: <tên nên có>`; **không ép vào dạng Ch I–II**. Hình: bài đích có HH00099–104 (tam giác bằng nhau, cân, trung trực) và HH00170–172 (thẳng hàng); quan hệ góc – cạnh, đường xiên, bất đẳng thức tam giác, đồng quy chưa có bài ⇒ `HH07000000`. Pytago, đồng dạng, Ta-lét, hằng đẳng thức, lượng giác, đường trung bình vẫn CẤM (lớp 8+); hình khối Ch X chỉ dùng nếu đề kiểm tra tới (công thức mục Hình (a)). Bộ sách khác (CTST, Cánh Diều) ⇒ không nhập đề.
- **Cuối kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **CẤM ở HK1**: tỉ lệ thức, dãy tỉ số bằng nhau, tỉ lệ thuận / nghịch (Ch VI) · biểu thức đại số, đa thức (Ch VII) · xác suất (Ch VIII) · quan hệ góc–cạnh, bất đẳng thức tam giác, đường xiên – đường vuông góc, đường đồng quy (Ch IX) · hình khối (Ch X) · hằng đẳng thức, phương trình bậc hai, Pytago, đồng dạng, Ta-lét, lượng giác, đường trung bình (lớp 8+).
- **Câu kiến thức kì 2 trong đề HK1** (tỉ lệ thức, dãy tỉ số, đa thức, hình khối, xác suất…) ⇒ giữ câu, giải bằng công cụ mà đề buộc, `**Chưa chắc:**` nêu lí do (§A14, §A2). Đề có phần đáng kể kì 2 (vd 3,0/10 điểm) ⇒ không nhập đề, ghi lí do ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.

### Phân kho

- Số, số thực, thống kê (Ch V) ⇒ `kho=dai`. Câu Đại có hình đi kèm (trục số có điểm A, B, C…) ⇒ `kho=dai`, cắt hình + `**Hình:** <tên>.png`.
- **Câu Hình K7 (kể cả trong đề thi / đề cương) ⇒ `hinh_hoc_cau_hoi`, `kho=hinh_hoc`** [10–12/10 · Thùy]; đề thi / đề cương chưa có bài đích ⇒ dạng chờ `HH07000000`. Cổng khối 7 chỉ nhận `dai` / `hinh_hoc` — chạy cổng với `--khoi 7`.
- Bản soạn bài giảng: "Bài trên lớp" ⇒ kho trên lớp; "Bài về nhà" ⇒ kho luyện [05/11].
- K7 không có Hình giải tích.

### Đại

**(a) Công cụ được phép**
- **Quy tắc chuyển vế ĐƯỢC DÙNG** (nhóm `NNB00944`) — khác Khối 6.
- Luỹ thừa: $a^m.a^n$, $a^m:a^n$, $(a^m)^n$, luỹ thừa của một tích được dùng. Vd [13/11] $A=(2x-5)^2-(15-6x)^2-|x-y-1|+2024$: viết $15-6x=(-3).(2x-5)$ rồi dùng luỹ thừa của một tích — không hằng đẳng thức.
- Căn bậc hai chỉ đến mức SGK 7: so sánh, căn số chính phương, $x^2=a\Rightarrow x=\pm\sqrt a$; $a\ge0$, $\sqrt a\ge0$.
- Số thập phân vô hạn tuần hoàn → phân số: đúng 2 trường hợp của nhóm `NNB00964` (đặt $A$, nhân 10/100/… rồi trừ) — không công thức tắt.
- Giá trị tuyệt đối: $a\ge0\Rightarrow|a|=a$; $a<0\Rightarrow|a|=-a$.
- Đổi đơn vị làm hiện rõ một dòng, không nhẩm.

**(b) Trình bày riêng**
- Cấu trúc, tách ý, loại câu, Đúng/Sai ⇒ `tu_luan`: y như Khối 6. Bổ sung: bài hình, chứng minh, nâng cao nhiều ý giữ một câu; `tra_loi_ngan` KHÔNG dùng khi đáp số là phân số `\dfrac{a}{b}`; câu hỏi hai số ($x$, $y$) ⇒ `tu_luan`; "điền vào chỗ trống" một số vừa 4 ô ⇒ `tra_loi_ngan`. Nhãn La Mã đổi sang Ả Rập (`Bài IIa` → `Bài 2a`).
- Phần 2 kết `Vậy …` (tự luận) hoặc `Chọn X.` (TN).
- **Khuôn Phần 2 theo nhóm (bản đồ K7)**:

| Nhóm (mã) | Khuôn Phần 2 | Phần 1 nêu |
|---|---|---|
| Nhận biết số hữu tỉ `NNB00934` | `$\dfrac{2}{3}$ là số hữu tỉ` · `$0,25=\dfrac{1}{4}$ suy ra $0,25$ là số hữu tỉ` · hỗn số đổi ra phân số | đưa về $\dfrac{a}{b}$, $a,b\in\mathbb{Z}$, $b\ne0$; mẫu 0 ⇒ không phải |
| Biểu diễn trên trục số `NNB00934` | phân số mẫu dương tối giản → mẫu = số phần chia đoạn đơn vị | — |
| So sánh số hữu tỉ `NNB00935` | `Ta có: $\dfrac{-3}{4}=\dfrac{-9}{12}$; $\dfrac{-2}{3}=\dfrac{-8}{12}$, mà $\dfrac{-9}{12}<\dfrac{-8}{12}$ $\Rightarrow\dfrac{-3}{4}<\dfrac{-2}{3}$.` | mẫu dương → quy đồng → so tử; trung gian / phần bù / cùng tử khi tiện |
| Tính toán số hữu tỉ `NNB00936` | `$\dfrac{3}{-21}+\dfrac{-2}{7}=\dfrac{-1}{7}+\dfrac{-2}{7}=\dfrac{-3}{7}$` — một dòng nối `=` khi ngắn, nhiều dòng `$=\dots$` khi dài | cùng mẫu dương, cộng tử, rút gọn |
| Tìm $x$ cộng trừ nhân chia `NNB00937` | theo cột: `$2\dfrac12:x+\dfrac12=\dfrac38$` → `$\dfrac52:x=\dfrac38-\dfrac12$` → … → `$x=-20$` | cộng trừ trước, nhân chia sau |
| Thực tế số hữu tỉ `NNB00938` | `Giá tiền … sau khi giảm 12% là:` → `$125000.(100\%-12\%)=110000$ (đồng)` … `Vậy …` | giảm giá = nhân $(100\%-p\%)$ |
| Cộng trừ thuận tiện `NNB00939` | chép biểu thức → phá ngoặc → nhóm cặp cùng mẫu / đối nhau | trước ngoặc "−" đổi dấu mọi số hạng |
| Nhân chia thuận tiện `NNB00940` | `$B=\dfrac{-5}{11}.\dfrac{4}{13}+\dfrac{-5}{11}.\dfrac{9}{13}+\dfrac{16}{11}$` → đặt thừa số chung → ngoặc = 1 → … | chia ⇒ nhân nghịch đảo trước |
| Biểu thức luỹ thừa `NNB00941` | `$=3-\dfrac{1}{27}+\dfrac{1}{27}+1$` → `$=3+1$` → `$=4$` | luỹ thừa → nhân chia → cộng trừ; $a^0=1$ |
| Rút gọn luỹ thừa cùng cơ số `NNB00942` | `$\dfrac{2^4.2^6}{(2^5)^2}=\dfrac{2^{10}}{2^{10}}=1$` | — |
| Thứ tự thực hiện phép tính `NNB00943` | mỗi dòng phá MỘT tầng ngoặc từ trong ra | $(\ )\to[\ ]\to\{\ \}$ |
| Tìm $x$ chuyển vế `NNB00944` | `$\dfrac34-2.\left(x+\dfrac12\right)=\dfrac14$` → `$2.\left(x+\dfrac12\right)=\dfrac34-\dfrac14$` → … → `$x=-\dfrac14$` | cô lập biểu thức chứa $x$ từ ngoài vào trong |
| Tìm $x$ luỹ thừa `NNB00945` | `$\left(\dfrac13+x\right)^3=\dfrac{27}{64}$` → `$=\left(\dfrac34\right)^3$` → `$\dfrac13+x=\dfrac34$` → … | đưa vế phải về cùng số mũ; mũ chẵn ⇒ hai trường hợp |
| Tìm $x$ ở số mũ `NNB00947` | `$3^{x+1}-3^x=54$` → `$3^x.(3-1)=54$` … | đặt $3^x$ chung |
| STP hữu hạn / vô hạn tuần hoàn `NNB00962` | `$\dfrac{2}{3}=0,(6)$`; mẫu tối giản chỉ có ước 2 và 5 ⇒ hữu hạn | chu kì viết trong `()` |
| Làm tròn `NNB00963` | `Để làm tròn … đến chữ số thập phân thứ ba, ta so sánh chữ số thập phân thứ bốn với 5. Vì $3<5$ nên … $55,217$.` · độ chính xác 0,05 ⇒ hàng phần mười | $<5$ giữ, $\ge5$ tăng 1 |
| STP tuần hoàn → phân số `NNB00964` | `Đặt $A=3,(63)$.` → `Vì chu kì có hai chữ số nên nhân A với 100.` → `$100A=363,(63)$` → `$100A-A=\dots$` → `$99A=360$` → `$A=\dfrac{40}{11}$` | 2 trường hợp (chu kì bắt đầu ngay / chưa) |
| Số vô tỉ, căn `NNB00965` | `$\sqrt3$ là số vô tỉ.` · `$\sqrt4=2$ là số hữu tỉ.` | — |
| Tính căn `NNB00966` | `Vì $8^2=64$ và $8>0$ nên $\sqrt{64}=8$.` · biểu thức: thay từng căn rồi tính | ngoặc → khai căn, luỹ thừa → nhân chia → cộng trừ |
| Tìm $x$ căn `NNB00967` | `$\sqrt x=10$` → `$x=10^2$` → `$x=100$` | — |
| So sánh số thực `NNB00968` | `Ta có $4=\sqrt{16}$. Vì $\sqrt{15}<\sqrt{16}$ nên $\sqrt{15}<4$.` | $a<b\Rightarrow\sqrt a<\sqrt b$ |
| Tính với $|\ |$ `NNB00969` | phá $|\ |$ trước: `$\left|\dfrac{-4}{5}\right|=\dfrac45$` rồi tính | — |
| Tìm $x$ có $|\ |$ `NNB00970` | `$|x|=\dfrac12$` → `TH1: $x=\dfrac12$` → `TH2: $x=-\dfrac12$` → `Vậy $x\in\left\{\dfrac12;-\dfrac12\right\}$`; vế phải âm ⇒ vô nghiệm | cô lập $|\ |$ trước |

- **Định dạng**: kế thừa K6 — **dấu nhân = dấu chấm** [24/10 · Thùy] (`$\dfrac{-5}{11}.\dfrac{4}{13}$`, `$2.\left(x+\dfrac12\right)$`), cấm `\cdot`/`\times`; thập phân `0,25`; `$12\%$`; số trong công thức viết liền (ngoài công thức "125 000 đồng"); `\sqrt{x}`; `\left|…\right|`; chu kì `$0,(6)$`; hỗn số `2\dfrac{1}{3}`; `\mathbb{Q}`, `\mathbb{Z}`, `\mathbb{N}`, `\mathbb{R}`; số âm trong ngoặc `$(-4)$`; đơn vị `$cm^2$`, `$cm^3$`, `(m)`.
- Bài "vẽ biểu đồ" ⇒ lời giải lập bảng + tả cách vẽ, `**Ghi chú:** lời giải chưa có hình vẽ`.

**(c) Sai lầm cần tránh**
- [10/10] kiến thức lớp 8–9 lọt vào (hằng đẳng thức, Pytago) ⇒ trạm kiểm đối chiếu whitelist từng câu — máy kiểm đáp số không bắt được lỗi kiến thức.
- [10/10] bẫy đọc ảnh K7: số mũ nhỏ, dấu trừ trước phân số ($(-2)^3$ ↔ $-2^3$), dấu `|`, gạch trên chu kì $0,\overline{3}$ / $0,(3)$, hỗn số $2\frac13$ đọc thành tích, $\notin$ đọc thành $\in$, `.` nhân ↔ `,` thập phân, căn dài ngắn, chỉ số góc $\widehat{A_1}$ ⇒ phóng to 300–400 dpi từ `goc.pdf`. Dấu ✗ / gạch bút tay HS trên phiếu không phải chữ đề.
- [14/10 · Thùy] câu hỏi mơ hồ giữa "giá trị" và "cách viết" ⇒ sửa đề cho hết mơ hồ (hỏi "KHÔNG cho ta số hữu tỉ"; "khẳng định nào ĐẦY ĐỦ NHẤT") + `**Ghi chú:**`; bỏ dấu chấm thừa.
- [24/10] "nhiều nhất / ít nhất" số tự nhiên, giảm giá nhiều tầng (giảm tiếp trên giá đã giảm hay giá gốc): đọc kĩ, tính lại bằng máy. Chứng minh bất đẳng thức dãy (kẹp, làm trội): kiểm số hạng đầu / cuối và chiều bất đẳng thức bằng tổng đúng (BigInt phân số). Nâng cao: mỗi bước kẹp / chia hết / số dư đúng với MỌI giá trị biến (kể cả biên, số âm).
- [13/11] dãy $A=5+5^2+…+5^{2022}$ "chia hết cho 806" là mệnh đề SAI ($A$ chia 806 dư 186; 2022 số hạng không chia hết thành nhóm 4) ⇒ không chứng minh điều sai (ghi đề sai theo §A4); đếm số số hạng trước khi ghép nhóm; kiểm mệnh đề chia hết bằng BigInt.

### Hình

**(a) Công cụ được phép — whitelist theo bài** [08/10, 05/11]
- Whitelist Hình K7 = lý thuyết các bài Hình 7 trên ERP (bản đồ Hình–Học K7 có chủ đề NCD00177 Đường thẳng song song · NCD00210 Tam giác bằng nhau — cập nhật 16/11; ba bài Thẳng hàng HH00170–172 nằm TRONG NCD00210, cùng cấp bài với Tam giác cân HH00104) (`hinh_hoc_bai_ly_thuyet` join `hinh_hoc_bai` where `khoi='7'`; dump: `kho-rules/dai/lo/k7-ly-thuyet-hinh7.md`; nguồn sống là DB).
- Nền chung: lớp 6 + lớp 7 trước chương Tam giác bằng nhau: hai góc kề bù (tổng $180^\circ$), đối đỉnh (bằng nhau), góc bẹt; tia phân giác (định nghĩa); tia nằm giữa ⇒ $\widehat{xOz}+\widehat{zOy}=\widehat{xOy}$; so le trong / đồng vị / trong cùng phía; dấu hiệu nhận biết song song; tiên đề Euclid; tính chất hai đường song song; cùng song song / cùng vuông góc với đường thứ ba; định lí, GT–KL; hình bình hành là tứ giác có các cạnh đối song song; tổng ba góc $180^\circ$; tam giác vuông hai góc nhọn phụ nhau; góc ngoài bằng tổng hai góc trong không kề (HH00001); định nghĩa hai tam giác bằng nhau.

| Bài | Được thêm | CẤM |
|---|---|---|
| HH00099 c.c.c | c.c.c | c.g.c, g.c.g, trường hợp tam giác vuông, tam giác cân / đều, trung trực |
| HH00101 c.g.c | + c.g.c | g.c.g, trường hợp riêng tam giác vuông, cân / đều, trung trực |
| HH00102 g.c.g | + g.c.g | trường hợp riêng tam giác vuông, cân / đều, trung trực |
| HH00103 tam giác vuông | + (cgv - cgv), (cgv - gn), (ch - gn), (ch - cgv) — viết tắt đúng như vậy | tam giác cân / đều, trung trực, Pytago |
| HH00104 tam giác cân – trung trực | + tam giác cân (định nghĩa, hai góc đáy, dấu hiệu), vuông cân (45°), đều (60°; dấu hiệu ba cạnh / ba góc / cân có góc 60°), trung trực (ĐỊNH NGHĨA + TÍNH CHẤT thuận) | chiều ĐẢO của trung trực (dù lý thuyết tài liệu có ghi); "trong tam giác cân phân giác / đường cao / trung tuyến trùng nhau"; Pytago, đồng dạng, hình bình hành, đường trung bình, lượng giác |

- Chứng minh một đường là trung trực ⇒ dùng ĐỊNH NGHĨA (vuông góc tại trung điểm, qua tam giác bằng nhau), không chiều đảo. **Ngoại lệ duy nhất: ba bài Thẳng hàng HH00170–172** (xem dưới bảng) [16/11 · Thùy].
- **Chuyên đề Thẳng hàng — ba bài HH00170 · HH00171 · HH00172 trong chủ đề Tam giác bằng nhau (NCD00210), cùng cấp bài với Tam giác cân** [16/11 · Thùy chốt; nội dung từ tài liệu "thẳng hàng.pdf" của Thùy]:

  | Bài | Được thêm | CẤM |
  |---|---|---|
  | HH00170 Phương pháp cùng đường | chứng minh ba điểm cùng thuộc MỘT đường thẳng cho trước: **hai tia cùng là tia phân giác của một góc ⇒ trùng nhau** · **đường trung trực, dùng CẢ chiều thuận lẫn chiều ĐẢO** (điểm cách đều hai đầu đoạn thẳng ⇒ thuộc trung trực; trung điểm thuộc trung trực) | Pytago, đồng dạng, Ta-lét, lượng giác, đường trung bình, quan hệ góc–cạnh, bất đẳng thức tam giác; "trong tam giác cân phân giác / đường cao / trung tuyến trùng nhau" (vẫn phải tự chứng minh) |
  | HH00171 Phương pháp cộng góc | $\widehat{AMD}=180^\circ$ ⇒ $A, M, D$ thẳng hàng (hai góc kề nhau có tổng $180^\circ$ ⇒ hai tia ngoài cùng đối nhau); bài hai góc đối đỉnh bằng nhau dẫn tới ba điểm thẳng hàng. **Phải nêu vì sao tia chung nằm giữa** (hai điểm ở hai phía của đường thẳng đã cho) | như trên |
  | HH00172 Dùng tiên đề Euclide (Ơ-clit) | hệ quả tiên đề Ơ-clit: hai đường cùng qua một điểm và cùng song song với một đường thứ ba thì trùng nhau ⇒ thẳng hàng; thường qua hai cặp tam giác bằng nhau cho góc so le trong | như trên |

  - **Ngoại lệ chiều đảo trung trực CHỈ có hiệu lực trong ba bài này** (và câu xếp vào chúng). Các bài khác (HH00104…) vẫn cấm như bảng trên.
  - Cả ba bài tự có lý thuyết riêng làm whitelist (đúng luật "lý thuyết của chính bài + mọi bài đứng trước"). Nội dung gốc: `scripts/hinh-k7-thang-hang-noidung.mjs`.
  - **Phân dạng câu "chứng minh ba điểm thẳng hàng"** (chờ Thùy xác nhận): xếp vào MỘT trong ba bài theo PHƯƠNG PHÁP của lời giải (cùng đường / cộng góc / tiên đề Ơ-clit); câu nhiều ý mà ý trọng tâm là thẳng hàng thì cả câu theo bài đó; hai phương pháp cùng hợp ⇒ dạng sau thắng (HH00172 > HH00171 > HH00170).
  - Ví dụ của bài (ô ví dụ, không nằm trong lý thuyết) thiếu điều kiện vị trí (khác phía, nằm giữa) ⇒ bổ sung vào đề + ghi trong biên bản nháp (đã làm với bài cộng góc).
- "Tam giác cân: phân giác ở đỉnh cũng là đường cao / trung tuyến" ⇒ tự chứng minh bằng tam giác bằng nhau.
- CẤM cả khối: Pytago, đồng dạng, Ta-lét, lượng giác, đường trung bình, quan hệ góc–cạnh, bất đẳng thức tam giác, đường đồng quy. Tam giác bằng nhau chỉ khi mốc đã dạy tới (CKI có; GKI thường chưa).
- Hình khối ($V=S_{\text{đáy}}.h$, $S_{xq}=C_{\text{đáy}}.h$…) thuộc Ch X tập 2 — không thuộc HK1. Khi tới mốc kì II: `Thể tích hình hộp chữ nhật là: $V=a.b.c=\dots$ ($cm^3$)`; lăng trụ `$S_{\text{đáy}}=\dfrac12.a.h$` rồi `$V=S_{\text{đáy}}.h$`; đổi đơn vị trước khi tính.

**(b) Trình bày riêng**
- Câu Hình K7 được GIẢI (CTO phân xử 15/11). Câu chứng minh ⇒ Sơ đồ tư duy (§A6). Câu tính góc, đọc hình ⇒ Phần 1 bằng lời như §A5: `**Mấu chốt:**` (dấu hiệu trong đề ⇒ chọn cặp tam giác nào, trường hợp nào) → các bước → `**Chú ý:**` (bẫy thứ tự đỉnh, góc xen giữa).
- Dấu nhân dấu chấm `.`. Căn cứ trong ngoặc viết `(gt)`, không `(giả thiết)`.
- Khuôn chứng minh K7: tia phân giác ⇒ nêu tia nằm giữa (theo hình) + hai góc bằng nhau · song song ⇒ so le trong / đồng vị bằng nhau · vuông góc ⇒ hai góc kề bù bằng nhau ⇒ mỗi góc $90^\circ$. **Nêu rõ vì sao tia nằm giữa trước khi cộng góc.**
- Ví dụ đúng khuôn (mỗi dòng một mệnh đề + căn cứ):
  ```
  Vì $AB=AC$ (gt)
  nên $\triangle ABC$ cân tại $A$ (định nghĩa tam giác cân).
  Do đó $\widehat{B}=\widehat{C}$ (tính chất tam giác cân).
  Xét $\triangle ABM$ và $\triangle ACM$ có:
  $AB=AC$ (gt);
  $\widehat{B}=\widehat{C}$ (cmt);
  $BM=CM$ (gt)
  nên $\triangle ABM=\triangle ACM$ (c.g.c).
  ```
- **Câu tính góc**: `tu_luan` khi nhiều đáp số; Phần 2 mỗi phép tính một dòng có lí do, kết "Vậy …"; hình: góc cần tìm ghi `x` hoặc để trống.
- Hình là một phần dữ kiện (số đo góc, kích thước) ⇒ có `**Hình:**` (nguồn theo §A8) VÀ chép số liệu vào phần Đề.
- **Dạng "Viết tam giác bằng nhau và tính chất suy ra"** (bài đọc hình, giảng trên lớp — TL1.k của HH00099/101/102/103) [05/11]:
  - Đề KHÔNG ghi các đẳng thức bằng chữ (ngoại lệ có chủ đích của luật "đề tự đủ dữ kiện"). Khuôn đề: "Quan sát hình vẽ (các cạnh có cùng kí hiệu thì bằng nhau, các góc có cùng kí hiệu thì bằng nhau). a) Viết các yếu tố bằng nhau mà đề bài cho trên hình. b) Viết kết luận hai tam giác bằng nhau (theo đúng thứ tự đỉnh tương ứng) và nêu trường hợp bằng nhau. c) Viết các tính chất suy ra (các cặp cạnh, góc tương ứng còn lại bằng nhau)."
  - Hình phải đúng và ĐỦ mọi ký hiệu như ảnh gốc (số gạch, số cung, ô vuông), không thêm ký hiệu nào. Cạnh chung không ký hiệu — lời giải ghi `(cạnh chung)`.
  - Phần 2: a) "Đề bài cho:" từng đẳng thức `(gt)` · b) "Xét … có:" → "Do đó $\triangle …=\triangle …$ (c.c.c)." · c) "Tính chất suy ra:" ĐỦ mọi cặp tương ứng còn lại, mỗi cặp một dòng; 1–2 dòng hệ quả (phân giác, song song, vuông góc) chỉ khi chắc chắn.
- Lời giải Hình 7 nhập 07–10/10 (HH00099–HH00104 lô đầu, HH00112) chưa có 2 phần — "khi nào hoàn thiện thì sửa một thể", không sửa lẻ [09/10 · Thùy].
- Mẫu lập luận: `HH00112` (23 câu Ôn tập Chương III), `HH00099–104`; mẫu CKI: `kho-rules/dai/lo/k7/CKI-02`, `CKI-11`, `CKI-19`.

**(c) Sai lầm cần tránh**
- [10/10] cộng góc không nêu tia nằm giữa; khẳng định không kèm lí do trong ngoặc ⇒ chưa đạt.
- [10/10] số đo trên hình vẽ nhỏ ⇒ phóng to trước khi chép; số liệu chỉ có trên hình mà không chép vào đề ⇒ sai luật "đề tự đủ dữ kiện".
- [27/10] dòng dài dày đặc ký hiệu ⇒ dòng ngắn (Hình chung).
- [14/10 · Thùy] đề hình thiếu giả thiết cần cho hình (vd thiếu "BD là tia phân giác của góc ABC") ⇒ bổ sung vào đề + `**Ghi chú:**`, không ngầm dùng.

### Theo loại nguồn

**Đề thi (bộ scan GKI / CKI; toanmath)**
- Đề scan 100% (lớp chữ không có / phông hỏng) ⇒ ảnh trang là nguồn duy nhất.
- Bỏ ô họ tên, khung điểm, hướng dẫn chấm, ma trận / đặc tả, trang trắng, quảng cáo.
- `bo_sach: KNTT` luôn; `thoi_gian_phut` = số phút ghi trên đề (không ghi ⇒ 90). Tên đề: `Đề kiểm tra <giữa|cuối> học kì 1 Toán 7 năm <năm học> — <trường> (<mã đề / "đề chính thức">)`.
- Đề nhiều mã / "Đề 1 – Đề 2" trên cùng tệp: theo luật Khối 6 (trùng ≥ 70% ⇒ một mã; khác nội dung ⇒ nhập đủ).
- Đề / câu đã có trong kho ⇒ trỏ câu cũ [24/10 · Thùy].
- Câu có vấn đề cần trưởng khối xem ⇒ kèm ảnh NGUYÊN câu cắt từ đề gốc [10/10 · Thùy]: đủ lời đề, hình, phương án, không cắt vụn; câu vắt 2 trang ⇒ 2 ảnh `_a`, `_b`; kèm số trang PDF gốc + vấn đề nói trong MỘT câu.
- Khuôn tệp như §A10, thêm dòng `thoi_gian_phut:`; phần Đúng/Sai ghi `## PHẦN <n> | Trắc nghiệm đúng sai | tu_luan`.

**Đề cương**
- `kieu: de_cuong`, tab "Đề cương", mã `DC-NN`, không dòng `thoi_gian_phut`, `nam` = năm kiểm tra [11–12/10 · Thùy]. Phiếu bổ sung nâng cao theo tuần nhập như đề cương.
- Câu kì 2 trong đề cương HK1 ⇒ như mục Phạm vi (giữ + `**Chưa chắc:**`).

**Bản đồ kiến thức K7 phần Đại (lý thuyết + ví dụ dạng)** [14/10 · Thùy]
- **KHÔNG BỊA. Không chắc / không có nguồn ⇒ để chuỗi rỗng.** Mọi câu lý thuyết, ví dụ truy được về nguồn thật (ghi `nguon_*`); công thức đúng nhưng không có trong nguồn ⇒ vẫn để trống.
- Thứ tự nguồn: (1) nội dung bản đồ cũ của chính nhóm (cắt đúng phần ứng với DẠNG, chép nguyên văn, sửa tối thiểu) → (2) `E:\BK ACADEMY\Tài liệu tham khảo\K7\` (ưu tiên sách phân dạng KNTT tập 1; rồi Ngô Đức Tài; Lê Minh Khá cho nâng cao; docx công thức WMF chỉ khi PDF không có) → (3) không có ⇒ `""`.
- pdftotext chỉ để TÌM trang; công thức chép từ ảnh. Ví dụ đúng DẠNG; ví dụ dùng kiến thức lớp 8+ ⇒ không đưa. Mỗi ví dụ kèm Hướng dẫn giải đầy đủ, đáp số kiểm bằng máy.
- Định dạng: `##TC` / `##PP` / `##CY`; ví dụ `##VD` + `**Hướng dẫn giải:**`; 1–3 ví dụ khó tăng dần. Dấu nhân trong bản đồ: `\cdot` hoặc `.` đúng như nguồn (không ép chuẩn). Ví dụ ghi ở ô ví dụ của dạng, không ghi trong lý thuyết.

### Công cụ riêng

- `scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp.soan.md> --lam-viec "<LV>" --khoi 7 --chi-kiem` — cổng; **thiếu `--khoi 7` là chạy luật khối 6 và chặn `hinh_hoc`**. Sau đó `ghi.mjs`.
- `node --env-file=.env scripts/kho/bdm-ly-thuyet.mjs 7` — đọc lý thuyết bản đồ K7.
- `kho-rules/dai/lo/k7/phan-loai-bo-sach.A–E.md`, `phan-loai-cki.A–E.md` — mẫu phân loại bộ sách.
- `kho-rules/dai/lo/k7/ghep-dc09.mjs` — ghép các phần đề cương. `sua-cau-de.mjs` — sửa câu của đề đã ghi.
- Mẫu: `kho-rules/dai/lo/k7/GKI-32.soan.md` (đề thi), `DC-03.soan.md` (đề cương), `CKI-02.soan.md`, `CKI-11.soan.md` (cuối kì).
- Script kiểm đáp số: Write vào `<LV>\tam\`; phân số / số lớn dùng BigInt.

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
| 9 | ✔ (bộ đề 18/10) | ✔ (toanmath 12/11) | — | — | — |
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
