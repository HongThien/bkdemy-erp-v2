luat: 88e8fce10253

# BRIEF SOẠN — khối 10 (cắt từ spec-giai-bai.md, KHÔNG sửa tay)

> VAI: **TRẠM SOẠN (Sonnet)**. Làm theo spec §C2 trạm 3–5: đọc HẾT luật dưới đây MỘT lần cho cả batch → phân dạng từng câu → đọc lý thuyết + ví dụ của dạng → giải → thử đáp số bằng script → chạy cổng.
> Dòng đầu tệp soạn chép đúng: `luat: 88e8fce10253`

## ĐẦU RIÊNG CỦA BATCH

# ĐẦU RIÊNG BATCH B046 — K10 đề cương cuối kì (3/6) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B046-NN`. Danh sách: `Repo\kho-rules\dai\lo\toanmath\batch\B046\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach` (dấu "?" = suy đoán), `bo_sach_can_cu`,
  `de` (trang có bài **trong file PDF gốc**), `hd` (trang đáp án nếu có), `uoc_cau` (chỉ để chia khúc), `ghi_chu`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B046\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to: spec §A11.
- Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B046\<MA>.soan.md` (khúc: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **cuối kì I** lớp 10 (spec Phần B › Khối 10). Loại: đề cương (đầu tệp có `kieu: de_cuong`).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B046/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B046`. Trạm không tự chạy.

## Ghi chú riêng từng đề cương B046

| MA | Trường · năm học | Bộ sách | Trang có bài tập (`trang\p-N.png`) | Đáp án | Lớp chữ | ~câu | Lưu ý |
|---|---|---|---|---|---|---|---|
| B046-01 | THPT Yên Hòa, Hà Nội · 2024–2025 | KNTT? | 2-25 | **KHÔNG có** | chữ | ~181 | p1 cấu trúc (bỏ), p26 quảng cáo; kho có YH 2026-2027: 0 câu trùng ⇒ giữ |
| B046-02 | THPT Đại Mỗ, Hà Nội · 2025–2026 | KNTT? | 1-8 | **KHÔNG có** | chữ | ~79 | CHỈ Vectơ + Số đặc trưng; TN + tự luận; không đáp án |
| B046-03 | THPT Yên Hòa, Hà Nội · 2025–2026 | KNTT? | 2-33 | **KHÔNG có** | chữ | ~261 | Đề cương dài; kho có YH 2026-2027 (274 câu): 78/262 câu của bản này (≈30%) trùng ⇒ giữ nhưng nhiều khả năng là bản gốc của đề cương kho (xem điểm cần Thùy quyết) |
| B046-04 | THPT Linh Trung, TP Hồ Chí Minh · 2025–2026 | KNTT? | 1-30 | **KHÔNG có** | chữ | ~206 | Nhiều "ĐỀ ÔN TẬP SỐ"; p30 phiếu trống; không đáp án |
| B046-05 | THPT Nguyễn Công Trứ, TP Hồ Chí Minh · 2026–2027 | KNTT | 3-136 | rải rác "Đáp án:/Đáp số:" sau một số câu | chữ | ~984 | SÁCH 136 TRANG theo bài (TN + Đ/S + TLN), rất dài ⇒ điều phối chia khúc; có "Đáp án:/Đáp số:" in ngay sau một số câu (nhân chứng, tự giải trước); p1 mục lục, p2 bìa (bỏ) |
| B046-06 | THPT Cầu Giấy, Hà Nội · 2025–2026 | Cánh Diều? | 1-15 | **KHÔNG có** | **SCAN** | ~170 | SCAN (không lớp chữ) — 15 trang gõ từ ảnh; cùng khung Trần Phú 2025-26 nhưng câu khác; không đáp án |
| B046-07 | THPT Trần Phú (Hoàn Kiếm), Hà Nội · 2025–2026 | Cánh Diều? | 1-25 | **KHÔNG có** | chữ | ~190 | CHỈ phần sau giữa kì (hàm số, hệ thức lượng, vectơ); không đáp án; kho có TP giữa kì 2026-2027 khác nội dung (≤4/21 câu) ⇒ giữ |
| B046-08 | THPT Nguyễn Trãi, Đà Nẵng · 2024–2025 | KNTT | 3-11 | trang 5,8,11 | chữ | ~75 | 3 đề (p3-4, p6-7, p9-10) + CÓ đáp án (p5, p8, p11); p1–2 nội dung kiến thức |
| B046-09 | THPT Trần Phú (Hoàn Kiếm), Hà Nội · 2024–2025 | Cánh Diều? | 1-16 | **KHÔNG có** | chữ | ~131 | Hàm số… ; TN + tự luận; không đáp án |

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
- **Lý thuyết / ví dụ ghi vào bản đồ** đúng thẻ `##ĐL / ĐN / TC / CY / PP / VD` của `spec-format-noidung.md`.
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
- Vẽ xong ⇒ **đẩy lên kho ngay** (Thùy 13/11) — máy làm việc chỉ là bản tạm.
- Đọc đề từ **ảnh trang phóng to** — lớp chữ PDF hay mất ký hiệu, ngoặc, số mũ.
- Chi tiết vẽ hình Hình học: Phần B mục "Hình — luật chung".

## A9. Theo loại nguồn

- **Đề thi / đề cương**: một đầu vào → hai đầu ra: câu vào kho + đề lưu cấu trúc (`tai_lieu` đề thi) dùng được ngay trên app. Cấu trúc đề: `spec-de-thi.md`.
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
  3. Các dòng tuỳ chọn, mỗi loại MỘT dòng: `**Hình:** <tệp>` · `**Hình giải:** <tệp>` · `**Ghi chú:** …` · `**Chưa chắc:** …`.
  4. `**Phần 1. Hướng dẫn**` (hoặc `**Sơ đồ tư duy**` — §A6).
  5. `**Phần 2. Trình bày**`.
- **Cuối tệp**: `## GHI CHÚ CHO NGƯỜI DUYỆT` — câu không nhập + vì sao, bộ sách đoán theo nội dung, phạm vi kiến thức đã áp; không có gì ⇒ ghi `Không`.
- **Khuôn từng loại câu**:
  - **Trắc nghiệm**: đủ 4 dòng `A. ` `B. ` `C. ` `D. ` (phương án là hình ⇒ vẫn 4 dòng, mỗi dòng mô tả hình); `dap_an` = một chữ cái. Giải RA kết quả rồi đối chiếu, loại phương án bằng LÍ DO, không thử từng phương án (trừ bài bản chất là thử chọn). Câu "tìm khẳng định SAI" ⇒ nêu vì sao từng phương án đúng / sai. Dòng cuối Phần 2 đúng là `Chọn X.` (X trùng `dap_an`). Đề chỉ có 2–3 phương án ⇒ giữ như in + `**Ghi chú:**`, không bịa phương án.
  - **Đúng/Sai (khuôn THPT)**: 4 ý a–d; `dap_an` = chuỗi 4 chữ `D`/`S` theo thứ tự (vd `DSSD`); Phần 2 xét từng ý, mỗi ý kết "Đúng." / "Sai." kèm lí do. Thiếu ý trên ảnh ⇒ giữ câu, `**Chưa chắc:**`. Khối THCS nhập Đúng/Sai dạng `tu_luan`: theo mục khối.
  - **Trả lời ngắn**: theo §A10 (dấu phẩy thập phân, đếm cả dấu `-` `,`, ≤ 4 ô); `dap_an` là số thuần, không bọc `$`; đúng đơn vị đề hỏi. Vượt ⇒ `tu_luan` + `**Ghi chú:**`.
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

## Khối 10

### Phạm vi kiến thức

- **SGK gốc: Kết nối tri thức (KNTT) Toán 10.** Đề theo Cánh Diều / CTST ⇒ giải đúng kiến thức đề đó kiểm tra, ghi `bo_sach` đúng. Đề không ghi ⇒ `bo_sach: KNTT`; ảnh ghi bộ khác ⇒ sửa `bo_sach` theo ảnh + `**Ghi chú:**`.
- Thứ tự KNTT 10 Tập 1: C1 Mệnh đề và tập hợp · C2 Bất phương trình và hệ BPT bậc nhất hai ẩn · C3 Hệ thức lượng trong tam giác (giá trị lượng giác góc $0^\circ$–$180^\circ$, định lí côsin, định lí sin, công thức diện tích, giải tam giác) · C4 Vectơ (khái niệm, tổng – hiệu, tích với một số, tích vô hướng, toạ độ vectơ) · C5 Các số đặc trưng của mẫu số liệu **không ghép nhóm** (số gần đúng – sai số, trung bình, trung vị, tứ phân vị, mốt, khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn, giá trị ngoại lệ).
- **Luôn được dùng**: toàn bộ lớp ≤ 9 (hằng đẳng thức, phân tích nhân tử, công thức nghiệm / $\Delta$ / Viète, hệ phương trình, hàm số bậc nhất – bậc hai lớp 9, tỉ số lượng giác góc nhọn, hệ thức lượng trong tam giác vuông, tam giác đồng dạng, đường tròn…).
- **Giữa kì I / đề cương giữa kì**: chỉ tới **hết chương mà chính đề / đề cương ghi trong "giới hạn chương trình"**. Đề cương chỉ tới C1–C2 ⇒ KHÔNG dùng định lí sin / côsin, vectơ — kể cả dùng ngầm [25/10].
- **Cuối kì I**: whitelist = cả KNTT 10 Tập 1 (C1–C5, Vectơ kể cả toạ độ và tích vô hướng) + lớp ≤ 9 [14/11].
- **Hàm số, đồ thị, hàm số bậc hai, dấu tam thức bậc hai** (KNTT Ch VI, Tập 2): CHỈ dùng khi chính đề / đề cương nêu (nhiều trường Hà Nội xếp vào HK1); không nêu ⇒ CẤM.
- Đề / đề cương chỉ gồm một phần chương trình (chỉ Vectơ + Số đặc trưng, chỉ chương III–V…) ⇒ giải đúng phần đề in, không bổ sung.
- Tiêu đề chương V ghi "mẫu số liệu **ghép nhóm**" ⇒ đọc ảnh; nếu thật là ghép nhóm (kiến thức lớp 11) ⇒ `**Chưa chắc:**`, không tự quyết.
- **Giữa kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **Cuối kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **CẤM ở mọi mốc HK1**: đạo hàm · giới hạn · mũ – lôgarit · tích phân · tổ hợp – xác suất (chương sau) · công thức lượng giác chưa học (hạ bậc, tích → tổng…) · định lí ngoài SGK (muốn dùng phải tự chứng minh bằng kiến thức đã học) · L'Hôpital và mọi công cụ ngoài SGK — cấm cả khi dùng ngầm.

### Phân kho

- `kho=hgt` **CHỈ cho câu Vectơ**: khái niệm vectơ, tổng – hiệu – tích với một số, tích vô hướng, toạ độ vectơ, chứng minh đẳng thức vectơ, tìm điểm / quỹ tích theo đẳng thức vectơ, ứng dụng lực – vận tốc (CTO phân xử 15/11).
- `kho=dai` cho MỌI câu còn lại: mệnh đề – tập hợp · BPT – hệ BPT bậc nhất hai ẩn (kể cả tối ưu thực tế) · **hệ thức lượng trong tam giác** (giá trị lượng giác $0^\circ$–$180^\circ$, định lí sin, côsin, diện tích, giải tam giác, đo đạc thực tế) · số đặc trưng · hàm số.
- **Kho `hinh_hoc` KHÔNG dùng ở Khối 10.** Cổng `--khoi 10` nhận `kho=dai|hgt`.
- Câu nhập nhằng ⇒ chọn theo bản chất, nói ở `**Ghi chú:**`. Trạm kiểm không đổi kho trừ khi sai luật trên.

### Đại

**(a) Công cụ được phép / cấm**
- Mệnh đề – tập hợp: `\forall`, `\exists`, `\in`, `\notin`, `\subset`, `\cap`, `\cup`, `\setminus`, `\Rightarrow`, `\Leftrightarrow`; khoảng – đoạn `(a;b)`, `[a;b]`, `(a;+\infty)`. Mệnh đề phủ định viết đầy đủ lượng từ. Số tập con $2^n$; tập con $k$ phần tử viết `C_n^k`; Ven 3 tập = bao hàm – loại trừ.
- BPT bậc nhất hai ẩn: xét miền nghiệm bằng **điểm thử**. **Bài tối ưu: GTLN / GTNN đạt tại một đỉnh của miền nghiệm** — lập hệ, tìm các đỉnh, tính $F$ ở từng đỉnh, đối chiếu điều kiện nguyên nếu đề đòi.
- Hệ thức lượng (kho `dai`): viết định lí đúng dạng ($a^2=b^2+c^2-2bc\cos A$; $\dfrac{a}{\sin A}=2R$; $S=\dfrac12 bc\sin A$…); đổi độ ↔ phút; nêu rõ tam giác nào dùng định lí nào.
- Số đặc trưng: viết rõ bước **sắp xếp** mẫu trước khi lấy trung vị / tứ phân vị. Tứ phân vị theo KNTT: $Q_2$ là trung vị; $Q_1$, $Q_3$ là trung vị của nửa dưới / nửa trên **không chứa** $Q_2$.

**(b) Trình bày riêng**
- Định dạng THPT: dấu nhân **`\cdot`** — CẤM `\times`, CẤM dấu chấm làm dấu nhân (`2.3`, `a.b`). Thập phân trong công thức `2{,}5`. Hệ viết `$\begin{cases} … \\ … \end{cases}$`, cả hệ MỘT dòng. Chữ Việt trong công thức bọc `\text{…}`. Số lớn ngoài công thức viết "12 600 000 đồng". Không bảng Markdown, không emoji.
- $\Leftrightarrow$ dùng cho biến đổi tương đương / mệnh đề tương đương — **mỗi dòng một bước**, không nối quá 2 phép.
- Tập nghiệm BPT / tập hợp viết `\{…\}`, `(a;b)`. Đề in độ `60^0` ⇒ gõ `$60^\circ$`.
- Làm tròn theo yêu cầu đề; đề không nêu ⇒ theo §A14 (đo đạc: 1 chữ số thập phân; góc: đến phút / đến độ) + `**Ghi chú:**`; chỉ làm tròn ở kết quả cuối, không tính tiếp từ số đã làm tròn.
- Tách ý theo §A7 (§A7): "Cho $A$, $B$. Tìm a) $A\cap B$ b) $A\cup B$ c) $A\setminus B$" (chung dữ kiện) ⇒ GIỮ một câu. "Giải các bất phương trình: a) … b) …" mỗi ý độc lập ⇒ coi là loại "Tìm $x$", tách `Bài 1a`, `Bài 1b`.
- Thử máy riêng: tập hợp ⇒ dựng bằng mảng số rồi tính giao / hợp / hiệu · mệnh đề chứa biến ⇒ quét ≥ 2000 giá trị · BPT hai ẩn ⇒ quét lưới điểm · **bài tối ưu ⇒ liệt kê đỉnh + quét lưới nguyên toàn miền** · hệ thức lượng ⇒ `Math.cos(x*Math.PI/180)` + dựng toạ độ số cho tam giác · số đặc trưng ⇒ tính bằng script (tứ phân vị cách KNTT).
- Hình giải cho câu Đại (khi lời giải cần): bài hệ thức lượng thực tế; bài miền nghiệm (đường biên + tô miền, toạ độ đỉnh bằng phép tính, trục `x`, `y` có nhãn); biểu đồ Ven (các vòng + số phần tử từng miền). Không bắt buộc cho TN / Đ/S khái niệm ngắn.

**(c) Sai lầm cần tránh**
- [25/10] phủ định mệnh đề có lượng từ mà không đổi $\forall\leftrightarrow\exists$ / không đảo quan hệ ⇒ phủ định phải đổi lượng từ VÀ đảo quan hệ.
- [25/10] nhầm mệnh đề đảo / phủ định / phản đảo; nhầm chiều "điều kiện cần / đủ" ⇒ viết rõ $P\Rightarrow Q$ rồi mới gọi tên.
- [25/10] coi mệnh đề chứa biến là mệnh đề ⇒ chỉ là mệnh đề sau khi gán giá trị / thêm lượng từ.
- [25/10] nhầm $[a;b)$ trên $\mathbb{R}$ với trên $\mathbb{Z}$; nhầm `(a;b]` / `[a;b)`, `\le` / `<` khi đọc ảnh ⇒ phóng to, không đoán.
- [25/10] miền nghiệm quên xét có / không chứa biên; dùng điểm thử $(0;0)$ khi nó nằm trên đường biên ⇒ chọn điểm thử ngoài biên.
- [25/10] bài tối ưu quên $x,y\ge0$ hoặc điều kiện nguyên ⇒ kiểm đủ đỉnh + điều kiện nguyên; cặp $(x;y)$ kết luận phải thoả MỌI bất phương trình.
- [25/10] góc tù mà lấy $\cos>0$; tìm góc bằng côsin không kiểm $\cos\in[-1;1]$ ⇒ kiểm dấu và miền giá trị.
- [25/10] bài đo đạc hai điểm quan sát đặt sai tam giác ⇒ nêu tam giác + định lí dùng.
- [25/10] tính tiếp từ số đã làm tròn ⇒ giữ giá trị đúng tới cuối.
- [25/10] lấy trung vị / tứ phân vị khi chưa sắp xếp ⇒ sắp xếp trước.
- [25/10] trắc nghiệm "mệnh đề đúng / sai" dừng ở phương án đầu thấy đúng ⇒ xét ĐỦ 4 phương án.

### Hình giải tích

**(a) Công cụ được phép / cấm**
- Ký hiệu: `\overrightarrow{AB}`, `\vec{a}`, `|\overrightarrow{AB}|`, `\vec{a}\cdot\vec{b}`, `\left(\overrightarrow{a},\overrightarrow{b}\right)`.
- Quy tắc ba điểm, quy tắc hình bình hành, tính chất trung điểm, trọng tâm; tích vô hướng; toạ độ vectơ (chỉ khi mốc đã tới C4).

**(b) Trình bày riêng**
- Chứng minh đẳng thức vectơ: **mỗi dòng một phép biến đổi**.
- Bài vectơ chứng minh cần hình ⇒ có `**Hình giải:**` vẽ bằng code.
- Thử máy: gán toạ độ số, kiểm đẳng thức với nhiều bộ điểm; bài tìm điểm theo đẳng thức vectơ **phải** kiểm bằng toạ độ số.

**(c) Sai lầm cần tránh**
- [25/10] nhầm $\overrightarrow{AB}$ với $\overrightarrow{BA}$ ⇒ soát chiều từng vectơ.
- [25/10] $\vec a\cdot\vec b=|\vec a|\cdot|\vec b|\cdot\cos(\vec a,\vec b)$ dùng góc không chung gốc ⇒ đưa hai vectơ về chung gốc rồi mới lấy góc.

### Phân dạng riêng

- Chủ đề Véc tơ (kho `hgt`), cặp dễ nhầm — đọc mô tả + ví dụ để tách: tích vô hướng **theo định nghĩa** / **trong tam giác, tứ giác** / **trong mặt phẳng toạ độ** · biểu diễn vectơ **bằng định nghĩa tích với một số** / **theo các vectơ khác trong tam giác, tứ giác** · toạ độ vectơ **khi biết 2 điểm** / **phép cộng trừ nhân số**.
- Đọc HẾT bảng đích Véc tơ trước câu đầu tiên.
- Để trống vì `KHÔNG THUỘC CHỦ ĐỀ:` — ghi chủ đề thật: phương trình đường thẳng, đường tròn, cônic, hệ thức lượng, tỉ số lượng giác, thống kê…

### Theo loại nguồn

**Đề thi khuôn Bộ 3 phần (THPT — chung K10, K11, K12)**
- Đầu tệp: `# ĐỀ | Đề kiểm tra <kì> Toán 10 năm <năm học> — <trường> (Mã đề <mã>)` · `nam:` · `bo_sach:` · `thoi_gian_phut:` (thường 90). KHÔNG có `kieu: de_cuong`.
- `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` · (`## PHẦN 4 | Tự luận | tu_luan` nếu có). Số câu đúng như đề (không mặc định 12 TN); nhãn giữ như in (mỗi phần đánh lại từ "Câu 1"). Đề gom "Phần I TNKQ" gồm 3 mục ⇒ vẫn tách 3 PHẦN + ghi cách tách.
- Đề nhiều mã ⇒ chỉ lấy MỘT mã (mã đầu). Bảng đáp án gộp nhiều mã ⇒ lấy đúng cột / dòng của mã đang làm.
- Đồ thị, bảng, hình minh hoạ của câu Đại / Hình giải tích ⇒ cắt từ PDF vào `**Hình:**` (Hình chung).

**Đề cương**
- Đầu tệp `kieu: de_cuong`; tên `# ĐỀ | Đề cương ôn tập <kì> Toán 10 năm <năm học> — <trường>`; năm học theo ảnh tiêu đề (`2025–2026`).
- Mỗi vùng in riêng (mỗi "ĐỀ SỐ", mỗi phần, mỗi chương) = một `## PHẦN`, đúng như đề cương chia; nhãn câu giữ như in, duy nhất trong PHẦN.
- Bỏ bìa / mục lục / ma trận / đặc tả / lý thuyết tóm tắt / quảng cáo.
- Một đề cương = một tệp soạn; đề cương dài (> ~120 câu) do điều phối chia khúc.
- Đề cương trùng một phần với đề thật đã có trong kho ⇒ vẫn giữ (trùng xử theo §A9). Câu trùng nguyên văn trong cùng đề cương ⇒ giữ nguyên số câu, giải bình thường (máy gom khi ghi).

**Sách tham khảo K10**: chưa có luật riêng — theo §A9; sách đầu tiên là lô mẫu (§C3).

### Công cụ riêng

- `scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem` — cổng khuôn tệp soạn, sửa tới "✔ đạt cổng".
- `scripts/anh/ve_hinh_lib.mjs` — vẽ hình giải bằng code; mẫu `scripts/anh/ve_hinh_hh101_102.mjs`.
- `kho-rules/dai/lo/toanmath/anh-batch.mjs day <BATCH>` — đẩy hình lên kho sau khi soát (điều phối chạy).
- `kho-rules/dai/lo/b3-hgt/k10-2110/` — bảng đích dạng bài Véc tơ (`bang-dich.md`) + lô xếp dạng (`lo-NN.json` → `out-NN.json`).

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
| Mô hình / bài mô hình / biến thể / cách giải (cành) | `hinh_mo_hinh` · `hinh_baitoan` · `hinh_baitoan_bien_the` · `hinh_cach_giai` | Tầng tham chiếu; cây ở `spec-hinh-cay-nhanh.md` |
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

### Vẽ hình

**Nguồn hình** (Hình chung)
- **Câu Hình học (`hinh_hoc`) ⇒ VẼ LẠI bằng code** (SVG → PNG 2x qua `ve_hinh_lib.mjs`) — không ảnh AI, không ảnh cắt từ sách / PDF [07/10, 13/10 · Thùy]. Đồ thị / bảng / hình minh hoạ của câu Đại, Hình giải tích ⇒ được cắt từ PDF (tạm, chưa có máy vẽ).
- MỌI câu vẽ được thì phải có hình, kể cả câu đề dựng bằng lời [07/10 · Thùy]. Chỉ bỏ khi thật sự không có gì để vẽ.

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

**Vẽ lại hình cắt từ sách** [13/10 · Thùy]
- Mọi ảnh kho Hình không nằm ở `kho-anh/hinh_hoc/` (GeoGebra, quét sách, chụp giấy) thay bằng hình code: `ve_lai_xuat.mjs` → trạm Sonnet → `ve_lai_bang.mjs` (trái cũ | phải mới, mở TỪNG bảng) → `gan_hinh.mjs <gói>/moi --thay --ghi` (URL cũ lưu `scripts/anh/bien_ban/gan-hinh-*.json`; ảnh cũ KHÔNG xoá).
- Hình theo ĐỀ; ảnh cũ vênh đề ⇒ theo đề + ghi báo cáo; không phân xử được ⇒ không vẽ, giữ ảnh cũ, báo. Thà bỏ trống còn hơn vẽ sai.
- Giữ ĐỦ thông tin ảnh cũ mà đề cần (câu "Cho hình vẽ…" sống nhờ hình): mọi nhãn, số đo, ẩn, góc đánh số, ký hiệu giả thiết; vị trí tương đối giữ nguyên. Chỉ THÊM khi đề của chính bài nêu tên mà ảnh thiếu, và ô vuông cho góc vuông đề cho. Ảnh GeoGebra không có ký hiệu ⇒ hình mới cũng không thêm. **Không giữ** đường phụ lời giải, nét / cung của điều phải chứng minh (Hình chung).
- Biến thể vẽ theo đề CỦA BIẾN THỂ; tên tệp uuid chép nguyên từ `viec.md`.
- Tranh minh hoạ thực tế ⇒ sơ đồ tối giản (điểm + chữ ghi tên vật), giữ đủ số đo; câu cần chính bức ảnh hoặc ảnh chụp bài giải tay ⇒ không vẽ, giữ ảnh, báo.
- Trạm vẽ chỉ tạo tệp gói của mình; không sửa `ve_hinh_lib.mjs`, không DB, không git, không sửa đề / lời giải. Báo cáo mỗi hình một dòng (đạt / khác ảnh cũ có chủ ý / không vẽ) + chỗ nghi đề / lời giải sai.
- Chưa có luật vẽ lại cho: khối 11 (hình không gian), `hgt_cau_hoi`.

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

- Dòng đầu tệp soạn: `luat: <mã phiên bản>` — mã lấy từ lệnh cắt luật của batch (băm nội dung Phần A + mục khối đang dùng).
- Cổng từ chối tệp soạn có mã khác mã hiện hành ⇒ luật vừa sửa thì tệp soạn theo luật cũ không lọt.
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

Câu được ghi thẳng `da_duyet = true` khi đủ **cả bốn**:
1. Dạng gán mức **cao**, và dạng đó có lý thuyết (câu Đúng/Sai: đã gán chủ đề).
2. Đáp số có **nhân chứng thứ hai trùng khớp**: đáp án in kèm, hoặc code tính lại, hoặc Opus giải mù.
3. Không có cờ `**Chưa chắc:**`, không ghi đề sai, trạm kiểm không phải sửa ĐÁP SỐ.
4. Qua cổng khuôn (đủ phần, đúng khuôn sơ đồ, công thức render được, không ký tự điều khiển).

Thiếu một điều kiện ⇒ **làn 🟡**: ghi `da_duyet = false`, đánh dấu nghi kèm lý do ⇒ hiện ở màn duyệt của **trưởng khối**.
Câu ở dạng chờ luôn là làn 🟡 (DB chặn duyệt câu dạng chờ). Lô mẫu (§C3) luôn là làn 🟡.
"Tự tin" do model tự khai **không** phải điều kiện — chỉ tính thứ máy kiểm được.

## C7. Nhãn dữ liệu và hậu kiểm

- Câu do dây chuyền giải: `nguon_giai = 'ai'`, `giai_method = 'claude_code'`, ghi model soạn; câu tự vào kho ghi `duyet_nguon = 'ai'`. Lời giải chép nguyên văn của người (tài liệu có lời giải, không sửa) mới là `nguon_giai = 'nguoi'`.
- **Hậu kiểm**: ai thấy câu lỗi ⇒ báo sai / xoá (xoá = vào kho rác, mã không cấp lại). Mỗi câu bị báo ⇒ điều phối ghi một dòng Phần D: sai gì · lọt ở trạm nào · luật rút ra · có phải quét các câu cùng dạng / cùng batch không.
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

## C10. Code còn nợ so với luật này (làm xong thì xoá dòng)

| # | Việc | Hiện trạng 15/11 |
|---|---|---|
| 1 | Lệnh ghi đề (`scripts/kho/de-thi/ghi.mjs`) ghi đúng nhãn AI + model | Đang ghi cứng `nguon_giai='nguoi'` |
| 2 | Xếp làn theo §C6 lúc ghi (4 điều kiện) | Trigger 05/11 chỉ xét "dạng mức cao + có đáp án" |
| 3 | Đề thi và bài học Hình đi qua cổng ghi có biên bản + băm nội dung | Mới có ở đường sách |
| 4 | Lệnh cắt luật theo khối + mã phiên bản ở đầu tệp soạn, cổng kiểm mã (§C4) | Chưa có — brief còn là tệp viết tay |
| 5 | Máy rút mẫu 15% + tính tỉ lệ lọt (§C5) | Chưa có — Opus đang kiểm 100% |
| 6 | Trạm soạn phân dạng trong cùng lượt (dòng đầu câu thêm dạng) | Tệp soạn chưa có trường dạng; phân dạng đang là lượt riêng |
| 7 | Giao diện: lời giải Hình khoảng cách dòng +20% | Chưa làm |
| 8 | Vá nhãn các câu đề thi đã ghi sai `nguoi` | Chưa đếm |
| 9 | Cổng `--khoi 6` và `--khoi 12` nhận `kho=hinh_hoc` | Chưa nhận ⇒ K12 tạm ghi `hgt` + Ghi chú; K6 báo điều phối |
| 10 | `nhap_hh_tu_draft.mjs` (bài học Hình) hiểu mô hình bài–ý + khối Sơ đồ tư duy | Chưa |
| 11 | Đọc trường `dang=` / `chac=` của dòng câu (§A10) khi ghi ⇒ đề xuất / gán dạng | Chưa |
| 12 | Hai quy ước dữ liệu dòng (đề thi: đoạn cách dòng trống, màn hình gộp · bài học Hình: `\n` đơn) — thống nhất về một | Chưa |

Cho tới khi mục 2–6 xong: batch chạy bằng script hiện có, áp luật Phần A/B; câu ghi `da_duyet=false` như cũ (chưa có làn tự vào kho).

---
