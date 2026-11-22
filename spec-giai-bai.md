# spec-giai-bai.md — LUẬT DUY NHẤT cho việc đưa tài liệu vào kho: phân dạng · giải · kiểm · ghi

> **Thùy chốt 15/11/2026. Từ hôm nay CHỈ dùng file này.** Mọi luật giải bài / giải đề / nhập kho viết ở nơi khác (file khối cũ, brief theo lô,
> README kho-rules, spec luồng kho cũ, ghi nhớ của Claude) đều hết hiệu lực; chỗ nào còn sót mà trái file này ⇒ file này đúng.
> **Mọi cập nhật về sau — luật mới, sai lầm mới, chú ý mới — ghi vào ĐÂY** (đúng phần, kèm ngày + ai chốt), không mở file luật thứ hai.
> Nhãn **"CTO phân xử 15/11"** = chỗ các file cũ nói ngược nhau, Claude chọn theo bản mới nhất / quyết định 15/11 của Thùy; Thùy sửa là thành luật của Thùy.
> Cụm **"chờ Thùy xác nhận"** = đang chạy theo cách ghi tại chỗ, cần Thùy gật hoặc sửa.
> **Cập nhật 18/11 (Thùy):** điều kiện tự vào kho đổi (§C6) · báo sai Claude tự xử (§C7) · thêm Khối 3 · thêm **Phần E** (luật duyệt trên ERP, quét kho, rà đáp án kho). Đã gộp `spec-kho-chuan.md` → Phần E; `PLAN-giaibai.md` lỗi thời (app "Giải bài kho chung" đã xoá 27/10).
>
> | Phần | Nội dung | Ai đọc, lúc nào |
> |---|---|---|
> | **A** | Luật CHUNG mọi khối, mọi phần kiến thức | Mọi trạm, đầu mỗi batch |
> | **B** | Luật theo KHỐI, trong khối chia theo phần kiến thức **Đại · Hình · Hình giải tích** | Trạm làm khối nào đọc mục khối đó |
> | **C** | DÂY CHUYỀN: thứ tự trạm, ai làm, điều kiện tự vào kho, quản lý batch | Người điều phối (Claude chính) |
> | **D** | SỔ SAI LẦM: lỗi hậu kiểm bắt được → luật | Ghi mỗi khi có câu bị báo sai |
> | **E** | DUYỆT TRÊN ERP · quét lại kho cũ · rà đáp án kho (không phát cho trạm giải) | Người duyệt, điều phối |
>
> Ba phần kiến thức = ba kho: **Đại** (`dai_*`) · **Hình** (`hinh_hoc_*` — hình phẳng THCS, hình không gian) · **Hình giải tích** (`hgt_*` — lượng giác, vectơ, toạ độ).

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

# PHẦN B — LUẬT THEO KHỐI (Đại · Hình · Hình giải tích)

> Mục khối chỉ ghi phần KHÁC / RIÊNG so với Phần A. Cái gì Phần A, C đã nói (2 phần lời giải, card 3–6 bước, dòng, LaTeX chung, dạng sau thắng, đề sai, nhân chứng, làn vào kho) thì không chép lại ở đây.
> Ngày ghi dạng dd/mm là năm 2026. "Thùy" = người chốt luật. Câu `**Chưa chắc:**` luôn về hàng duyệt của trưởng khối (§C6).

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

## Khối 3

> **Khung riêng của Khối 3 (CTO soạn 20/11 theo phản hồi của nhân sự: "đáp án khối 3 chưa có khung như khối 4, 5" — CHỜ trưởng khối 3 / Thùy duyệt; lô mẫu K3 đầu tiên (§C3) sẽ chỉnh).**
> Luật sách đề / đề cương (khuôn tệp, tách ý, loại câu, hình, bẫy đọc ảnh) vẫn **dùng Khối 4 → Khối 5**; bảng CẤM tiểu học ở Khối 4T. Mục này thêm cái Khối 3 còn THIẾU: **khuôn đáp án hai phần + khuôn theo chuyên đề** (như Khối 4T làm cho 24 chuyên đề).
> **Hiện trạng kho (đo 20/11):** K3 có 2.866 câu; chỉ **75 câu (2,6 %)** có lời giải hai phần `Phần 1. Hướng dẫn` / `Phần 2. Trình bày` (K4: 963/4.514 · K5: 1.369/5.421). 2.790 câu còn lại là lời giải một khối từ kho cũ (`kho_cu`, AI giải), dấu nhân gõ `×`, không Mấu chốt / Bước. Đây là chỗ nhân sự phản hồi.

### Phạm vi kiến thức

- Bộ sách: Toán 3 Kết nối tri thức. Bản đồ K3 hiện có **6 chuyên đề** (đều thuộc học kì I): 1 Ôn tập và bổ sung · 2 Bảng nhân, bảng chia · 3 Làm quen với hình phẳng, hình khối · 4 Phép nhân, phép chia trong phạm vi 100 · 5 Đơn vị đo độ dài, khối lượng, dung tích, nhiệt độ · 6 Phép nhân, phép chia trong phạm vi 1000.
- Chương trình lớp 3 + kiến thức lớp 1–2. **CẤM**: kiến thức lớp 4 trở lên (số có hơn 5 chữ số, phân số ngoài "một phần mấy", số thập phân, chu vi–diện tích công thức nếu bản đồ chưa có chuyên đề đó) + mọi điều cấm tiểu học (bảng CẤM ở Khối 4T).
- Học kì II (số đến 10 000 và 100 000, chu vi – diện tích, phân số, thống kê, xác suất…) **chưa có trong bản đồ** ⇒ chưa có khuôn; thêm khi bản đồ có, lô mẫu đầu tiên của chuyên đề đó rút luật.

### Phân kho

- Mọi câu `kho=dai`.

### Đại

**(a) Công cụ được phép:** bảng nhân – chia 2…9 · đặt tính (viết phép tính hàng ngang, nêu "đặt tính thẳng hàng" ở Phần 1) · gấp lên / giảm đi / so sánh "gấp mấy lần" bằng phép nhân – chia · quy tắc tìm thành phần chưa biết (đề có sẵn chữ $x$ thì dùng chữ đó) · đường gấp khúc = tổng các đoạn · một phần mấy = chia đều. **Sơ đồ đoạn thẳng KHÔNG bắt buộc** ở K3 (khác 4T), chỉ vẽ khi đề in sơ đồ hoặc bài "gấp / giảm / so sánh" mà hình giúp hiểu rõ — dùng máy vẽ `so-do-doan-thang.mjs`, đúng tỉ lệ.

**(b) Trình bày riêng — KHUNG HAI PHẦN như K4/K5 (§A5)**
- **Phần 1. Hướng dẫn** dạng card: `**Mấu chốt:**` một câu (quy tắc / bảng / ý nghĩa phép tính) → `**Bước 1.**`… **3–5 bước**, câu ngắn, từ ngữ của trẻ 8–9 tuổi, mỗi bước một ý trọn; không ghi đáp số cuối; `**Chú ý:**` nếu có bẫy (dư, đơn vị, thứ tự thực hiện).
- **Phần 2. Trình bày** (đúng cái học sinh viết vào vở):
  - Lời văn: `Bài giải` → mỗi bước **một câu lời giải + một phép tính + đơn vị trong ngoặc** (`$24 : 6 = 4$ (kg)`) → `Đáp số: 4 kg`. Bài hai bước: hai cặp "câu lời giải – phép tính". Câu lời giải theo mẫu sách: "Số bạn nữ là:", "Số quả cam còn lại là:", "Cả hai thùng có số lít là:".
  - Tính / tính giá trị biểu thức: mở bằng dòng chép nguyên biểu thức, mỗi dòng một bước theo thứ tự (trong ngoặc trước · nhân chia trước, cộng trừ sau · cùng cấp từ trái sang phải).
  - Điền số / điền dấu / so sánh: ghi giá trị từng vế rồi `Vậy …` (vd `$7 \times 6 = 42$ và $6 \times 7 = 42$ nên $7 \times 6 = 6 \times 7$`).
  - Tìm $x$: `$x \times 3 = 24$` / `$x = 24 : 3$` / `$x = 8$` (mỗi dòng một bước; quy tắc nói ở Phần 1; **không** viết "chuyển vế").
  - Trắc nghiệm: mọi câu đủ hai phần; dòng cuối Phần 2 là `Chọn X.`; trả lời ngắn có đơn vị: `dap_an` = số kèm đơn vị đúng câu hỏi.
- **LaTeX / ký hiệu:** nhân `\times` (không gõ `×`), chia `:`, mỗi công thức một cặp `$…$`; số không có dấu cách hàng nghìn **trong** công thức (`$1000$`), đề in `1 000` thì giữ như in **ngoài** công thức. Đơn vị: `cm`, `dm`, `m`, `mm`, `km`, `g`, `kg`, `ml`, `l`, `°C` viết chữ thường đứng; đơn vị mũ `$cm^2$`.
- **Khuôn theo chuyên đề** (Phần 2 · điều Phần 1 phải nói):

| CĐ | Khuôn Phần 2 | Phần 1 phải nói |
|---|---|---|
| 1 Ôn tập và bổ sung | đọc – viết – phân tích số `$567 = 500 + 60 + 7$`; so sánh số: so hàng trăm → chục → đơn vị rồi kết `Vậy …`; cộng trừ: chép phép tính, ghi kết quả; tìm thành phần: theo cột như trên | muốn so sánh hai số: so chữ số cùng hàng từ trái sang; cộng trừ có nhớ: đặt thẳng hàng, nhớ sang hàng liền trước; số hạng chưa biết = tổng − số hạng đã biết; số bị trừ = hiệu + số trừ |
| 2 Bảng nhân, bảng chia | đọc bảng: `$6 \times 7 = 42$`; chia: `$42 : 6 = 7$`; thừa số chưa biết: `$x = 42 : 6$`; một phần mấy: `Một phần ba của 12 là: $12 : 3 = 4$` | nhân = cộng nhiều số bằng nhau; chia = chia đều / chia nhóm; thừa số chưa biết = tích : thừa số đã biết; số bị chia chưa biết = thương × số chia; "một phần $n$" = chia cho $n$ |
| 3 Hình phẳng, hình khối | lập luận ngắn + kết luận ("Điểm S nằm trên đoạn thẳng UV, ở giữa hai đầu nên S nằm giữa U và V"); hình tròn: `Đường kính gấp đôi bán kính: $9 \times 2 = 18$ (cm)`; đường gấp khúc: cộng các đoạn `$9 + 36 + 9 = 54$ (cm)`; bài vẽ: **mô tả từng bước vẽ** ("Vẽ đường tròn tâm K, bán kính 2 cm. Lấy điểm P trên đường tròn, nối K với P được bán kính KP…") | góc vuông dùng ê ke; trung điểm chia đoạn thành hai phần bằng nhau; tâm – bán kính – đường kính (đường kính = 2 bán kính, đi qua tâm); khối lập phương (6 mặt, 12 cạnh, 8 đỉnh) và hộp chữ nhật |
| 4 Nhân, chia trong phạm vi 100 | gấp lên: `Số … là: $6 \times 4 = 24$`; giảm đi: `$24 : 4 = 6$`; so sánh gấp mấy lần: `$20 : 5 = 4$` → `Vậy … gấp … 4 lần`; bài 2 bước: bước 1 tìm cái chưa biết, bước 2 trả lời câu hỏi chính | "gấp lên $n$ lần" = nhân $n$; "giảm đi $n$ lần" = chia $n$; "gấp mấy lần" = lấy số lớn chia số bé; bài hai bước: bước đầu tìm gì để bước sau làm được |
| 5 Đơn vị đo | đổi từng dòng `$1\ m = 100\ cm$`, `$2\ kg = 2000\ g$`; nhiều đơn vị: đổi về cùng đơn vị ở dòng đầu rồi tính; nhiệt độ: đọc vạch nhiệt kế, ghi `$37\ °C$` | $1\ m = 10\ dm = 100\ cm$; $1\ km = 1000\ m$; $1\ kg = 1000\ g$; $1\ l = 1000\ ml$; chỉ cộng trừ khi cùng đơn vị |
| 6 Nhân, chia trong phạm vi 1000 | nhân số 2–3 chữ số với số 1 chữ số: ghi phép tính và kết quả, bài lời văn có câu lời giải; chia: `$37 : 5 = 7$ (dư $2$)`; kiểm tra: `$7 \times 5 + 2 = 37$` | nhân từ hàng đơn vị, nhớ sang hàng liền trước; chia từ hàng cao; **số dư luôn bé hơn số chia**; muốn kiểm tra phép chia có dư: thương × số chia + dư |

- **Luật rút từ lô thử 20/11 (Opus soát):** (1) **Không có bước rỗng**: cấm "Đọc đề: …" (chép số liệu), "Viết câu lời giải, phép tính và đáp số", "Ghi số …" — thà ít bước thật còn hơn thêm bước cho đủ 3. Bước 1 nói Ý NGHĨA (nhóm bằng nhau / chia đều / giảm đi), bước cuối nói câu lời giải + đơn vị. (2) **Không đánh số chồng** ("**Bước 2.** Bước 1: …"). (3) **Bài đặt tính: cách tính theo từng hàng (mượn / nhớ) nằm ở Phần 1, KHÔNG ghi kết quả cuối; Phần 2 chỉ phép tính hàng ngang + kết quả.** (4) Bước và dòng Chú ý không chép phép tính / kết quả của Phần 2. (5) Một chuỗi dấu bằng không trộn đơn vị với số trần (`$2 \times 1000 = 2000$` rồi `Vậy $2$ l $= 2000$ ml`). (6) Câu cùng mẫu (đếm bớt …) trình bày giống nhau, có dòng thử lại số đã cho.
- **Kiểm riêng** (ngoài §A4): bài nhân – chia ⇒ nhân lại / chia lại ra đề · chia có dư ⇒ dư < số chia và thương × số chia + dư = số bị chia · đổi đơn vị ⇒ đổi ngược lại · bài lời văn hai bước ⇒ thay đáp số vào đề xem có đúng điều kiện.

**(c) Sai lầm cần tránh**
- [20/11 — đo trên kho] lời giải kho cũ một khối, dấu `×` Unicode, không Mấu chốt / Bước, không `Đáp số:` ⇒ mọi câu K3 mới và câu K3 viết lại phải theo khuôn hai phần ở trên.
- Dùng từ "ước", "bội", "chuyển vế", ký hiệu `⇒ ⇔` trong lập luận (bảng CẤM) ⇒ viết bằng chữ: "nên", "vậy".
- Thiếu đơn vị trong ngoặc sau phép tính lời văn; `Đáp số` thiếu đơn vị.
- Bài chia có dư viết thương sai chỗ (`$37 : 5 = 7,2$`) ⇒ lớp 3 chỉ có thương nguyên và dư.

### Hình

- Dùng luật Khối 5 / Khối 4 (dòng `**Hình:**`, hình trang trí không đưa vào, bài yêu cầu vẽ ⇒ mô tả các bước vẽ ở Phần 2). Hình lớp 3: điểm, đoạn thẳng, góc vuông, hình tròn, khối lập phương – hộp chữ nhật, đường gấp khúc. Hình không gian chỉ nhận biết, chưa tính thể tích.

### Theo loại nguồn

- **Tài liệu khối 3 đầu tiên là lô mẫu** (§C3): toàn bộ câu đi làn duyệt; mỗi chỗ người duyệt sửa ⇒ một dòng luật vào mục này. Trưởng khối 3 duyệt **khuôn ở trên** ở lô mẫu này.
- Tên đề / khuôn tệp: như Khối 4 (đổi "Toán 4" ⇒ "Toán 3").

### Công cụ riêng

- Cổng kiểm `dung-de-tu-soan.mjs … --khoi 3 --chi-kiem` (cổng nhận mã khối bất kỳ; luật khối 3 cắt bằng `cat-luat.mjs 3`).
- **Viết lại câu K3 kho cũ sang khuôn hai phần:** **lô thử 50 câu ĐÃ GHI 20/11 (Thùy cho làm thử)** — 8–9 câu mỗi chuyên đề; máy thử 164 phép tính + đối chiếu đáp án kho; Opus giải mù 48/48 khớp (2 bài vẽ không so được), 0 lỗi lập luận, 19 lỗi khuôn đã sửa (luật rút ở trên). Trước/sau + biên bản: `kho-rules/dai/lo/k3-khuon-thu/`. Phần còn lại (~2.740 câu) CHƯA làm — Thùy 18/11 chốt "chưa quét lại kho cũ hàng loạt" (§E2); xin lệnh riêng (§C10 mục 18).
- **Câu cần trưởng khối 3 xem (Opus báo, chưa sửa):** gán dạng có vẻ lệch — `T1030000001499`, `T1030000001493` (đường gấp khúc đang ở "Biểu thức chưa cộng trừ hỗn hợp") · `T103000000280`, `T103000000278` (bảng nhân, chia 7 đang ở "So sánh số tự nhiên"); đáp án `T103000000280` gõ dấu `×` Unicode.

---

## Khối 4

> Chương trình thường (sách đề "Đề kiểm tra Toán 4" Qbooks, đề cương). **Dùng luật Khối 5** cho toàn bộ luật sách đề (khuôn tệp, tách ý, loại câu, hình, bẫy đọc ảnh) và **dùng luật Khối 4T** cho bảng CẤM tiểu học + khuôn giải theo chuyên đề; dưới đây chỉ ghi điểm khác.

### Phạm vi kiến thức

- Bộ sách: Toán 4 Kết nối tri thức.
- **Giữa kì I** (Thùy 08/11 chọn các đề giữa kì 1): Toán 4 KNTT học kì 1 — số đến lớp triệu, làm tròn, so sánh; góc nhọn / tù / bẹt, đo góc; hai đường thẳng vuông góc / song song; yến – tạ – tấn, giây – thế kỉ, $dm^2$ – $m^2$ – $mm^2$; cộng trừ, giao hoán – kết hợp; biểu thức chứa chữ; trung bình cộng; tìm hai số biết tổng và hiệu; rút về đơn vị… + kiến thức lớp 3.
- **Cuối kì I**: như giữa kì I tới hết học kì 1 — chưa có luật chi tiết, lô mẫu đầu tiên sẽ rút.
- **Giữa kì II / cuối kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **CẤM**: kiến thức lớp 5 (số thập phân; phân số chưa học ở HK1 lớp 4 trừ khi đề có) + mọi điều cấm tiểu học (bảng CẤM ở Khối 4T).

### Phân kho

- Mọi câu `kho=dai`.

### Đại

- (a)(b) Dùng luật Khối 5: không sơ đồ ở lô sách đề; tách ý chỉ bài Đặt tính / Tính / Tính thuận tiện / Tìm $x$; trắc nghiệm kết `Chọn X.`.
- Số tự nhiên lớn **ngoài** công thức viết có khoảng cách lớp như đề in (`64 412`); **trong** công thức viết liền (`$64412>64214$`).
- (c) Sai lầm: [08/11] trạm soạn hay đọc nhầm hỗn số / hàng / số nhiều chữ số và tự gọi hình mang số liệu là "trang trí" ⇒ phóng to 300 dpi, kiểm từng hình.

### Hình

- Dùng luật Khối 5 (dòng `**Hình:**`, hình trang trí không đưa vào, bài yêu cầu vẽ). Kiến thức hình lớp 4 như mục Hình của Khối 4T.
- Bảng cần điền trong đề ⇒ `**Ghi chú:**` mô tả bảng gốc (vd "Đề gốc cho một bảng hai cột 'Tên góc' và 'Số đo góc' để HS điền").

### Theo loại nguồn

- Sách đề / đề cương: như Khối 5. Tên đề: `# ĐỀ | Đề kiểm tra giữa kì số <n> — Toán 4 học kì 1 (sách Đề kiểm tra Toán 4, Qbooks)`; đề cương thêm `kieu: de_cuong`, tên `# ĐỀ | Ôn tập giữa học kì I Toán 4 — Đề 8`.
- `thoi_gian_phut` không cần soát (đặt chung lúc ghi).

### Công cụ riêng

- `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k4/<MA>.soan.md --lam-viec "<LV>" --khoi 4 --chi-kiem` — cổng kiểm.
- Đề mẫu: `kho-rules/dai/lo/k5/HK1-GK01.soan.md`; đề cương mẫu `kho-rules/dai/lo/k4-k5-de-cuong/L4-DE8.soan.md`.

---

## Khối 4T

> Khối nâng cao tiểu học. Nguồn: sách "Toán arc 4 quyển 1 2023" (Archimedes). Chuẩn trình bày = các "Bài làm" trong VÍ DỤ của sách. Luật đạt v1 ngày 08/10.

> **Sách thứ hai "250+ Bài toán chọn lọc lớp 4" (ME, TKBooks, 15 chuyên đề, 242 bài tập) — ĐÃ CHỐT [21/11 · Thùy]** (đề xuất + ví dụ: `docs/de-xuat-4T-me-ban-do-va-spec.html`). Nhập sách = ghép bài với hướng dẫn cùng số (KHÔNG giải lại), vẫn chạy máy kiểm đáp số `k4T-kiem.mjs`; trang quét rách / đáp án không đọc được ⇒ để trống, chuyển trưởng khối. Nguồn: `E:\BK ACADEMY\Tài liệu tham khảo\4T\Sách lớp 4 ME.pdf` (ảnh quét; số trang PDF = số trang in − 2; đề tr.7–92, hướng dẫn từ tr.93). `ten_de_goc = "Toán 4 ME · CĐ<n> · B<m><ý>"`.
> **Sáu điểm Thùy chốt 21/11:** **(Đ1)** Phần VÍ DỤ (lý thuyết / ví dụ mẫu của dạng) ghi đủ cả hai cách nếu sách có hai cách; câu trong kho (Phần 2 lời giải) chỉ ghi MỘT cách — cách ngắn hơn · **(Đ2)** công việc chung: chuẩn là quy về số phần bằng nhau (mốc = bội chung nhỏ nhất của các thời gian); Phần 2 không chia cho phân số; Phần 1 được nhắc "trong 1 giờ làm được 1/4 công việc" để giải thích · **(Đ3)** cấm dấu "→" trong lập luận (dù ME dùng) — viết chữ "nên / suy ra / số còn lại là" · **(Đ4)** đáp số bài xoá chữ số: bỏ số 0 đứng đầu (CĐ1 B9–10 sách ghi "01111111 hay 1111111" ⇒ kho ghi 1111111 + Ghi chú) · **(Đ5)** "Hai hiệu số" và "Công việc chung" là hai CHUYÊN ĐỀ mới trong chủ đề "Các bài toán lời văn", không mở chủ đề mới · **(Đ6)** gộp dạng NDB01527 (1 câu `T14T000000035`) vào NDB00649 "1 đầu". Chuẩn trình bày ME thêm vào luật 4T: khung "Phân tích" hỏi–đáp ở Phần 1 · dòng "Nhận xét:" đầu Phần 2 khi cần nêu loại bài · khuôn đếm "Trường hợp 1 / 2" (chọn hàng bị ràng buộc trước) · sơ đồ hai đoạn có phần chênh nét đứt cho hai hiệu số.
> **Bản đồ 4T từ ME — Thùy duyệt P01–P31 theo đề xuất (21/11):** thêm khoảng 74 dạng mới (nhóm mới + 2 chuyên đề mới), đổi tên NDB01507 · 00652–56 · 01540 · 01550/51 · nhóm NNB01713 · NNB01727 · một dạng trùng tên 01562 (P28: ĐỔI TÊN, KHÔNG gộp, KHÔNG xoá), tách dạng "tuổi" NDB01625 và "viết thêm chữ số" NDB01540 thành nhiều dạng (mã cũ giữ cho dạng đầu). Ghi bằng `scripts/kho/sach/ghi-ban-do-4t-me.mjs` (chạy thử ROLLBACK, rồi `--ghi`). Việc xếp lại câu cũ vào dạng tách mới: làm riêng, từng nhóm, liệt kê trước. **Tình trạng DB: xem dòng "Tình trạng 4T-ME" ngay dưới.**
> **Tình trạng 4T-ME [21/11 tối]:** bản đồ ĐÃ GHI DB (+3 chuyên đề · +21 nhóm · +74 dạng, 104 → 177; 14 đổi tên; NDB01625 sang nhóm "Bài toán về tuổi"; NDB01527 gộp vào NDB00649) · **sách ME ĐÃ NHẬP KHO**: 242 bài tập → 398 câu (sau tách ý) qua `scripts/kho/sach/ghi-lo.mjs --chua-gan-dang` từ `kho-rules/dai/lo/me4/` (BRIEF.md = quy trình): 396 câu vào kho (2 câu CĐ8 B8, B10 trùng câu 5T `T15T0000001786/87` nên không chèn), `da_duyet=false`, 92 câu có sơ đồ máy vẽ; 2 bài HOÃN vì hình đề (CĐ2 B19, B20). Máy kiểm đáp số `me4-kiem.mjs` (397 hàm tự tính từ đề): 396/398 đạt; kiểm độc lập: 77 câu mẫu đối chiếu ảnh sách (đáp án 77/77 đúng, đề 76/77 — CĐ9 B10 sách in thiếu chữ số 4, đã chép theo lời giải) · 92 sơ đồ model khác xem ảnh (83 khớp, 9 mang cờ nghi: CĐ6 B4/B8/B9/B10/B11, CĐ11 B1/B3/B6/B11) · gán dạng hai trạm mù: 342 câu khớp ⇒ ĐỀ XUẤT dạng (`dai_bdm_de_xuat`, chờ duyệt); **bản đồ bổ sung 9 dạng (Thùy duyệt 21/11: 186 dạng; `ghi-ban-do-4t-me-bo-sung.mjs`) rồi gán mù lại 56 câu còn lại ⇒ thêm 26 đề xuất (`me4-gan-bo-sung.mjs`): 368/396 câu có đề xuất, 28 câu còn ở dạng chờ vì hai trạm lệch hoặc chưa có dạng (CĐ4 B11, CĐ5 B7–B9, CĐ6 B1/B14, CĐ7 B5b/B17/B18, CĐ10 B2d/B6/B14f/B21a, CĐ11 B14–B16/B18/B19, CĐ12 B6/B7/B11/B13, CĐ13 B4/B12/B13, CĐ14 B6, CĐ3 B12).** Lô mẫu `Toán 4 ME · %` khai báo vào `kho_lo_mau` rồi **Thùy duyệt mẫu luôn 21/11 ("ME4T duyệt luôn", đánh dấu bằng `me4-duyet-mau-va-gan.mjs`, `duyet_mau_boi` rỗng vì lệnh qua chat)**; 363 đề xuất mức cao chuyển thành gán `ai` ⇒ trigger tự duyệt **353 câu vào kho chuẩn** (10 câu cờ nghi ở lại hàng duyệt trưởng khối). Còn 5 đề xuất mức vừa + 28 câu dạng chờ về trưởng khối. Đo lại 21/11 tối: 4T 186 dạng, dạng rỗng 74 → 8, dạng dưới 30 = 139 (tăng vì thêm 83 dạng mới; mỗi dạng mới chỉ được ~4–5 câu ME nên vẫn cần clone), thiếu 3229 câu để đủ 30. 11 câu mang cờ: 9 sơ đồ + CĐ9 B19b (đề mơ hồ, máy ra 98;49, sách 100;50) + CĐ6 B6b (đáp án sách 11 nghi, máy không kiểm). Cờ nghi riêng của trạm soạn: CĐ2 B13 (sách 170, đếm đủ ra 180), CĐ6 B6b, CĐ8 B5, CĐ9 B10/B19b. **CĐ15 sách chỉ có cách chia phân số ⇒ 14 câu đã viết lại bằng số phần bằng nhau (Đ2), đáp số giữ nguyên.** Luật tự mâu thuẫn chờ Thùy: Đ2 ghi "bội chung nhỏ nhất" nhưng bảng CẤM tiểu học cấm chữ "bội/ước" (trạm viết "số nhỏ nhất chia hết cho…"). Còn nợ: dạng bản đồ vẫn thiếu cho CĐ7 B17 (chọn phần còn lại theo tính chất chia hết), CĐ11 B14 (bài mệnh giá tiền), CĐ9 B4b–c (số hạng thứ n dãy không cách đều) · xếp lại câu cũ của NDB01540/01625 · lý thuyết/ví dụ 74 dạng mới · hình đề CĐ2 B19–B20 · bảng `dai_bdm_cay_nho` 4T chờ làm mới.

### Phạm vi kiến thức

- Không chia theo mốc kì: phạm vi = chuyên đề đang xét + các chuyên đề đứng trước trong sách + kiến thức lớp 4 thường.
- **Nguyên tắc gốc**: lời giải viết **như một học sinh lớp 4 giỏi viết vào vở**, đúng kiến thức lớp 4; phụ huynh đọc phải hiểu. Sách 4T không có số thập phân, số âm, phương trình. Bước chỉ giải được bằng đại số ⇒ đổi sang cách tiểu học (sơ đồ đoạn thẳng, số phần bằng nhau, tính ngược, lập bảng, thử chọn có lập luận). Không đổi được ⇒ `**Chưa chắc:**`.
- **24 chuyên đề (CĐ) theo thứ tự sách**: 1 Viết số theo điều kiện · 2 Đếm số và chữ số · 3 Đo lường · 4 Kỹ năng tính toán · 5 Chu vi, diện tích · 6 Dãy số cách đều · 7 Trồng cây · 8 Tổng–hiệu · 9 Lời văn nhân chia · 10 Dấu hiệu chia hết · 11 Chia có dư · 12 Cấu tạo số · 13 Trung bình cộng · 14 Rút về đơn vị · 15 Thống kê, xác suất · 16 Phân số · 17 So sánh phân số · 18 Cộng trừ phân số · 19 Nhân chia phân số · 20 Giá trị phân số của một số · 21 Tìm số biết giá trị phân số · 22 Tỉ số, tổng–tỉ, hiệu–tỉ · 23 Bài toán cơ bản về phân số · 24 Tính ngược.
- **Bảng CẤM tiểu học** (áp cả 4, 5, 5T):

| Cấm | Thay bằng |
|---|---|
| `⇒ ⇔ ∈ { } ∀ ≤ ≥` trong lập luận | chữ: "nên", "vậy", "suy ra", "không lớn hơn" |
| Tự đặt ẩn $x$ rồi chuyển vế đổi dấu / chia hai vế | sơ đồ đoạn thẳng · số phần · tính ngược từ cuối |
| Số âm, luỹ thừa, số thập phân, phần trăm | — (4T chưa học) |
| Công thức tổ hợp ($A^k_n$, "chỉnh hợp") | đếm theo từng hàng: "Chữ số hàng trăm có … cách chọn…" |
| "đồng dư", "mod" | "chia cho 9 dư bấy nhiêu thì tổng chữ số chia 9 dư bấy nhiêu" |
| "ước", "bội" (lớp 6) [08/10] | "12 chia hết cho chữ số đó" |
| "quy đồng rồi so tử" viết tắt | ghi rõ nhân cả tử lẫn mẫu: $\dfrac{3}{5}=\dfrac{3\times 3}{5\times 3}=\dfrac{9}{15}$ |
| Diện tích tam giác bằng công thức (lớp 5) | tam giác vuông trên lưới = một nửa hình chữ nhật / nửa ô vuông; hình ghép ⇒ chia thành hình chữ nhật / lấy hình lớn trừ phần bỏ đi |
| Công thức vận tốc $v=s:t$ (lớp 5) | "trong $1$ giờ đi được…" / "trong $\dfrac{1}{10}$ giờ … thì đi được…" |

### Phân kho

- Mọi câu `kho=dai`, kể cả bài có hình.

### Đại

**(a) Công cụ được phép (vì sách làm vậy)**
- **Cấu tạo số (CĐ12)**: được "Gọi số cần tìm là $A$ / $\overline{ab}$ ($a$ khác $0$; $a,b<10$)", viết $\overline{A3}=A\times 10+3$, rồi "Bớt cả hai vế đi $A$" (ghi trong ngoặc) → $A\times 9=414$ → $A=414:9$. Không "chuyển vế", không viết $9A$ (viết $A\times 9$).
- **Tìm $y$ / tìm $m$ (CĐ4, 16, 18, 19)**: đề có sẵn chữ thì dùng chữ đó; viết theo cột, mỗi dòng một bước `$\begin{array}{l} m=35-20 \\ m=15 \end{array}$`. Quy tắc thành phần chưa biết nêu ở Phần 1.
- **Đếm số (CĐ2)**: nhân các số cách chọn $3\times 2\times 1=6$ (số), kèm giải thích từng hàng.
- Sách có "Cách 1 / Cách 2": Phần 2 chỉ trình bày MỘT cách. Dãy phân số mẫu gấp đôi (CĐ19) ⇒ cách "$2\times B-B$" (như Khối 5T dòng F).
- Bài **có tỉ số / số phần** (tổng–hiệu, tổng–tỉ, hiệu–tỉ, TBC, tính ngược) ⇒ PHẢI có dòng `Ta có sơ đồ:` + HÌNH sơ đồ đoạn thẳng do máy vẽ (Thùy 07/10); dòng mô tả bằng lời (`Tuổi con: 1 phần; Tuổi mẹ: 4 phần`) ghi ngay sau làm alt. Hình lưu `anh_dap_an`. Sơ đồ phải đúng tỉ lệ số liệu (`gia_tri_phan` bắt buộc).

**(b) Trình bày riêng**
- Lời văn: `Bài giải` → mỗi bước 1 câu lời giải + 1 phép tính (đơn vị) → `Đáp số: …`. Câu lời giải theo mẫu sách: "Số ki-lô-gam gạo loại II là:", "Tổng số phần bằng nhau là:".
- Lập luận (viết số, chữ số, chia hết): lập luận ngắn + kết luận, như VD 1.1 ("Số tự nhiên lớn nhất khi nó nhiều chữ số nhất và chữ số lớn nhất đứng ở hàng cao nhất… Ta có: $19=0+1+2+3+4+9$. Sắp xếp… được số cần tìm là 943210.").
- Tính / tính thuận tiện / tìm $y$: chỉ các dòng biến đổi, mở bằng dòng chép nguyên biểu thức.
- Câu trắc nghiệm Phần I phiếu cuối tuần (sách chỉ đòi đáp số) vẫn đủ 2 phần (Thùy 08/10).
- Đơn vị trong ngoặc sau phép tính `$448:8=56$ (kg)`; `Đáp số: 336 kg táo`; đơn vị có mũ `$cm^2$`. `\overline{abc}` (sách gõ `\overline{\text{abc}}` ⇒ chuẩn hoá). `dap_an` bài lời văn = số kèm đơn vị đúng câu hỏi.
- Bài có mốc "nay / hiện nay" phụ thuộc năm ⇒ tính đến **năm sách in (2023)**, ghi rõ năm trong lời giải + đáp số [08/10].
- **Khuôn theo chuyên đề** (Phần 2 · mấu chốt / bẫy nói ở Phần 1):

| CĐ | Khuôn Phần 2 | Phần 1 phải nói |
|---|---|---|
| 1 Viết số theo điều kiện | lập luận "lớn nhất khi NHIỀU chữ số nhất, chữ số lớn đứng hàng cao" / "nhỏ nhất khi ÍT chữ số nhất, chữ số nhỏ đứng hàng cao" → `Ta có: 19 = 9+8+2` → "Sắp xếp… được số cần tìm là …" | tổng cho trước: lớn nhất ⇒ chọn chữ số nhỏ (0;1;2;…); nhỏ nhất ⇒ chọn chữ số lớn. "Khác nhau" ⇒ không lặp. Số nhỏ nhất không bắt đầu bằng 0. Chẵn/lẻ ⇒ xét hàng đơn vị trước. Tích chữ số ⇒ tách thừa số 1 chữ số |
| 2 Đếm số và chữ số | "Gọi số có ba chữ số có dạng $\overline{abc}$ ($a$ khác $0$)" → mỗi hàng "có … cách chọn" → phép nhân `(số)` | có chữ số 0 ⇒ hàng cao nhất bớt 1 cách; "khác nhau" ⇒ hàng sau bớt dần; lẻ/chẵn ⇒ chọn hàng đơn vị trước |
| 3 Đo lường | đổi từng dòng `1 kg 6 hg = 160 dag`; lời văn đổi về cùng đơn vị ở dòng đầu | khối lượng / độ dài liền kề gấp 10; diện tích gấp 100. Năm 1990 ⇒ thế kỉ XX. Lịch 7 ngày một vòng |
| 4 Kỹ năng tính toán | `Nếu m=105, n=182 thì …=…=…`; tìm $m$ theo cột; thay đổi thành phần: 1 câu nêu quy luật → 1 phép tính → `Đáp số` | $a-(b-c)=a-b+c$; thêm vào số trừ ⇒ hiệu giảm; gấp một số hạng lên $k$ lần ⇒ tổng tăng $(k-1)$ lần số hạng đó |
| 5 Chu vi, diện tích | `Bài giải` từng bước, đơn vị `(cm)`, `($cm^2$)` | chu vi bằng nhau ⇒ nửa chu vi = dài + rộng; "tăng rộng 4 cm thành hình vuông" ⇒ dài − rộng = 4 |
| 6 Dãy số cách đều | **chỉ dòng phép tính kết quả** (Thùy 07/10): `Số hạng thứ 85 của dãy là: $11+(85-1)\times 5=431$` · `Số số hạng của dãy là: $(199-1):2+1=100$` · `Tổng … là: $(11+506)\times 100:2=25850$`. KHÔNG dòng "Khoảng cách là", "số khoảng cách là" | ba công thức từ "khoảng cách × số khoảng"; số khoảng = số số hạng − 1; hỏi "X là số hạng thứ mấy" phải kiểm X thuộc dãy |
| 7 Trồng cây | `Số khoảng cách: 450:5=90 (khoảng)` → `Số cây một bên: 90+1=91` → hai bên `×2`. Số khoảng cách được ghi; "khoảng cách giữa hai cây" không ghi | 2 đầu trồng: cây = khoảng + 1; 1 đầu: = khoảng; không đầu: = khoảng − 1; khép kín: = khoảng. Cắt gỗ: số lần cắt = số đoạn − 1 |
| 8 Tổng–hiệu | `Ta có sơ đồ:` → `Số bé là: (tổng − hiệu):2` → `Số lớn là: …` → `Đáp số` | tuổi: hiệu không đổi; "mỗi người thêm $t$" ⇒ tổng thêm $2t$; hai số liên tiếp ⇒ hiệu 1; "giữa chúng có $k$ số lẻ" ⇒ hiệu $2(k+1)$ |
| 9 Lời văn nhân chia | 1 câu nêu quy luật → phép tính → `Đáp số` | tích riêng đặt thẳng cột ⇒ nhân với tổng các chữ số; viết nhầm 45 thành 54 ⇒ tích tăng $(54-45)$ lần; số dư lớn nhất = số chia − 1 |
| 10 Dấu hiệu chia hết | `Ta có … chia hết cho 2 và 5 nên b = 0.` → `Thay b = 0 thì … chia hết cho 9 khi (7 + a) chia hết cho 9.` → `Suy ra a = 2. Vậy số cần tìm là 4320.` | xét 2 và 5 trước rồi 3/9; chia hết 4: hai chữ số cuối; 8: ba chữ số cuối; 45 = 5 và 9; 36 = 4 và 9; 6 = 2 và 3 |
| 11 Chia có dư | `Số nhóm: 253:5 = 50 (dư 3)` → "viên thứ 253 là viên thứ 3 của nhóm ⇒ màu đỏ" | dư 0 ⇒ phần tử cuối nhóm; chữ cái lặp: đếm độ dài cụm (không tính dấu cách) |
| 12 Cấu tạo số | `Gọi số cần tìm là A` → `Ta có: \overline{A3} = A + 417` → `A×10+3 = A+417` → `A×9+3 = 417 (Bớt cả hai vế đi A)` → theo cột → `Đáp số` | thêm $c$ bên phải ⇒ $A\times 10+c$; bên trái số 2 chữ số ⇒ $c\times 100+\overline{ab}$; xoá chữ số ⇒ chiều ngược |
| 13 Trung bình cộng | `Hai lần trung bình cộng … là: 24+28 = 52` → `… là: 52:2 = 26` (có `Ta có sơ đồ:`) | số thứ ba bằng TBC ⇒ TBC = TBC hai số kia; hơn TBC $k$ ⇒ "hai lần TBC = tổng hai số + $k$"; kém ⇒ trừ $k$; dãy cách đều: TBC = (đầu + cuối):2 |
| 14 Rút về đơn vị | `Tóm tắt:` 2 dòng → `Bài giải`: `Một thùng đựng số táo là: 448:8 = 56 (kg)` → nhân hoặc chia | tìm nhiều phần: chia rồi nhân; tìm số phần: chia rồi chia |
| 15 Thống kê, xác suất | trả lời từng ý, liệt kê sự kiện bằng `+` mỗi dòng; `Đáp số: a) …; b) …` | biểu đồ tranh: mỗi hình = 5 đơn vị; "chắc chắn đủ 3 màu" ⇒ xét trường hợp xấu nhất |
| 16 Phân số | rút gọn `\dfrac{51}{57}=\dfrac{51:3}{57:3}=\dfrac{17}{19}` (ghi chia cho mấy); quy đồng ghi $\times$ cả tử lẫn mẫu, kết "Vậy quy đồng… ta được…" | $\dfrac{1313}{3939}$: chia 101 trước; mẫu chung nhỏ nhất khi một mẫu chia hết mẫu kia |
| 17 So sánh phân số | 5 khuôn, nêu tên bước: "Quy đồng mẫu số: …", "Quy đồng tử số: …", "Bước 1: Tìm phần hơn … Bước 2: So sánh phần hơn…", "Bước 1: Tìm phần bù…", "Ta chọn phân số trung gian …" → `Vì … nên …` | tử bằng ⇒ so mẫu; tử − mẫu bằng nhau ⇒ phần bù / phần hơn; một > 1 một < 1 ⇒ so với 1; khác hẳn ⇒ trung gian. Phần hơn ≠ phần bù |
| 18 Cộng trừ phân số | `\dfrac{2}{3}+\dfrac{3}{4}=\dfrac{8}{12}+\dfrac{9}{12}=\dfrac{17}{12}`; tính thuận tiện: nhóm cùng mẫu | số tự nhiên viết thành phân số cùng mẫu; dãy $\dfrac{1}{2\times 3}+…$: viết tử thành hiệu hai mẫu |
| 19 Nhân chia phân số | rút gọn chéo ghi tường minh; lời văn chu vi / diện tích như CĐ5 | $B=\dfrac{1}{2}+\dfrac{1}{4}+…$ ⇒ "$2\times B-B$" |
| 20 Giá trị phân số của một số | `$\dfrac{1}{4}$ của 140 m là: $140\times\dfrac{1}{4}=35$ (m)` | "còn lại" ⇒ $1-(\dfrac{1}{4}+\dfrac{1}{3})$ phần của tổng; "của số còn lại" ⇒ nhân phần còn lại |
| 21 Tìm số biết giá trị phân số | `18 huy hiệu còn lại chiếm số phần tổng số huy hiệu là: 1 − (…) = \dfrac{18}{35}` → `Số huy hiệu lúc đầu là: 18 : \dfrac{18}{35} = 35 (huy hiệu)` | quy mọi phần về cùng một "tổng"; "ít hơn … 39 kg" ⇒ 39 kg ứng với hiệu hai phân số |
| 22 Tỉ số · tổng–tỉ · hiệu–tỉ | `Ta có sơ đồ:` → `Tổng (Hiệu) số phần bằng nhau là: 3+5 = 8 (phần)` → `Số bé là: 96:8×3 = 36` → `Số lớn là: 96−36 = 60` → `Đáp số: Số bé: 36; Số lớn: 60` | tuổi: vẽ sơ đồ ở thời điểm có tỉ số; tổng ẩn (chu vi ⇒ nửa chu vi; TBC ⇒ tổng = TBC × 2); thương 5 ⇒ tỉ số $\dfrac{1}{5}$; "chia dư 5" ⇒ bớt 5 ở tổng |
| 23 Bài toán cơ bản về phân số | như CĐ20/21; "$\dfrac{1}{4}$ số thứ nhất = $\dfrac{2}{7}$ số thứ hai" ⇒ quy đồng tử rồi đọc số phần | — |
| 24 Tính ngược | mô tả lưu đồ bằng lời → tính từ cuối lên, mỗi bước `B là: 20×5 = 100` → `A là: …`; chuyển qua lại nhiều người ⇒ lập bảng rồi "Giải thích bảng" | cộng↔trừ, nhân↔chia; "bán $\dfrac{2}{5}$ số còn lại thì còn 30" ⇒ 30 là $\dfrac{3}{5}$ số còn lại |

**Kiểm riêng** (ngoài §A4): bài viết số ⇒ thử phá điều kiện (bớt một chữ số có còn thoả? đổi hai chữ số cuối có lớn hơn?) · đếm ⇒ liệt kê thật khi kết quả ≤ 12 · tổng–tỉ ⇒ cộng lại ra tổng, chia ra tỉ · tính ngược ⇒ đi xuôi lại ra kết quả cuối.

**(c) Sai lầm cần tránh**
- [07/10] Phần 2 dãy số có dòng "Khoảng cách… là: 16−11=5", "số khoảng cách… là: 85−1=84" ⇒ CĐ6 Phần 2 chỉ dòng phép tính kết quả. Ba ý tách 3 câu thì mỗi câu vẫn đủ 2 phần.
- [07/10] sơ đồ chỉ mô tả bằng lời ⇒ sơ đồ phải là HÌNH máy vẽ (`so-do-doan-thang.mjs`), lời giữ làm alt.
- [07/10] gộp nhiều câu lời giải trên một dòng ⇒ mỗi câu lời giải / mỗi phép tính một dòng.
- [08/10] đoạn thêm / thiếu vẽ dài cố định (tuổi con 8 và đoạn hơn 25 trông bằng nhau) ⇒ sơ đồ đúng tỉ lệ, `gia_tri_phan` bắt buộc, máy kiểm nhãn tổng / hiệu, lệch ⇒ từ chối vẽ.
- [08/10] PTL 1.1c dùng "ước" ⇒ cấm "ước / bội" ở tiểu học.
- [08/10] lọc trùng nguyên văn để lọt (LT 10.12) ⇒ so trùng sau chuẩn hoá (bỏ `$`, ngoặc, `\ `, khoảng trắng).
- [08/10] sách in sẵn phép tính + đáp số trong đề (VD 10.1, 10.2, 20.1, 20.2) hoặc đề in lỗi làm đề–lời giải lệch (LT 16.2c, 17.5c, 17.9b; PCT 6 I.6 thiếu chữ số) ⇒ sửa lỗi in hiển nhiên + `**Ghi chú:**`; không sửa được chắc ⇒ `**Chưa chắc:**`. Sách in lời giải sai (VD 19.2 in 45/28) ⇒ kho ghi kết quả đúng (73/28) + `**Ghi chú:**`.
- [08/10] sơ đồ do chính người soát vẽ ⇒ phải có model khác xem ảnh ký biên bản mới ghi (cổng chặn).
- Quy ước hiểu đề đã dùng (trưởng khối có thể đổi): "hiệu / thương các chữ số" lấy lớn trừ / chia bé · xúc xắc coi là phân biệt · tính cả phân số mẫu 1 · biểu thức không ngoặc tính theo thứ tự thường · góc ~87° trên hình coi là vuông. Dùng quy ước ⇒ ghi `**Ghi chú:**`.

### Hình

**(a) Công cụ được phép**: góc nhọn / vuông / tù / bẹt, đo góc bằng thước đo góc (độ), hai đường thẳng vuông góc / song song, hình bình hành, hình thoi (4 cạnh bằng nhau), khối hộp chữ nhật / lập phương; chu vi, diện tích hình chữ nhật, hình vuông. Không: diện tích tam giác bằng công thức, vận tốc.

**(b) Trình bày bài đọc hình**
- Dữ kiện nằm trong HÌNH ⇒ mở hình xem kỹ trước khi giải: đếm ô / biểu tượng / số đo / chiều cao cột (đếm khoảng kẻ) / vị trí điểm trên lưới / số góc, số cạnh.
- **Phần 2 ghi ra các số đọc từ hình trước khi tính** ("Quan sát biểu đồ, số quyển vở của các lớp 4A, 4B, … lần lượt là: …") — đọc lời giải không cần nhìn hình.
- Phần 1 nói cách đọc hình (đếm gì, nhìn đâu, bẫy) + mấu chốt. Bài đếm góc, gọi tên cạnh: Phần 2 = lập luận ngắn + "Vậy …". Không sơ đồ đoạn thẳng cho bài đọc hình.
- Bài có hình nhiều ý: giữ một câu, Phần 2 ghi a) b) (tách ý chỉ theo §A7 — bài Tính / Tìm $x$).
- Hình đề = hình gốc của sách (EMF → PNG), gắn `anh_de` ở cổng ghi; nguồn hình theo §A8 (hỏng ⇒ vẽ lại bằng code).
- `dap_an` bài hình: số kèm đơn vị (`$350$ g`, `$117$ $cm^2$`) · `Chu vi: $…$ cm; Diện tích: $…$ $cm^2$` · `a) …; b) …` · câu Có/Không mở bằng `Có` / `Không` rồi lí do ngắn · "loại nào": tên loại, số lượng trong ngoặc · điền số vào hình: số ở ô đỉnh tăng dần cách `; ` rồi số ở ô giữa cạnh · gọi tên cạnh theo thứ tự đi vòng (EGHI ⇒ EG, GH, HI, IE) · `… cạnh; … góc`.

**(c) Sai lầm cần tránh**
- [08/10] hình mờ / không chắc đọc đúng / đề nhiều cách hiểu ⇒ soạn theo một cách, ghi `**Chưa chắc:**` nói đọc thế nào, chỗ nào không chắc. Không im lặng chọn.
- [08/10] tự kiểm: thay ngược đáp số + đếm lại hình lần hai.
- [08/10] tam giác trên lưới tính bằng công thức lớp 5 / bài tốc độ dùng $v=s:t$ ⇒ cách lớp 4.

### Phân dạng riêng

- Câu LUYỆN TẬP của CĐ $k$ ⇒ tìm dạng trong chủ đề cùng số trước; nhưng **phương pháp thắng chủ đề** (Thùy 07/10): khớp tên dạng chưa đủ, phải khớp phương pháp giải (bài chu vi / diện tích lõi tổng–hiệu ⇒ dạng tổng–hiệu, kể cả bước cuối là diện tích; "Tìm hai số" giải bằng hiệu số phần ⇒ tỉ số).
- Câu Phiếu tự luyện / Phiếu cuối tuần ⇒ gán theo dấu hiệu đề.
- Rút về đơn vị dạng 1 (tìm nhiều phần) và dạng 2 (tìm số phần) là **một dạng** [07/10].
- Tổng–hiệu ẩn (tuổi lùi / tiến năm, "giữa chúng có $k$ số", ba cạnh HCN, ba số) thuộc dạng tổng–hiệu cơ bản [08/10].
- Tính ngược có phân số thuộc dạng "tính ngược chuỗi phép tính" [08/10].
- CĐ23 không có chủ đề riêng ⇒ rơi về dạng của CĐ20/21/22 theo phương pháp.
- Phân dạng theo bản đồ mới của khối; bảng dấu hiệu theo mã bản đồ cũ `T14T…` không dùng.

### Theo loại nguồn

- Sách Archimedes: 24 CĐ (Kiến thức cần có → Tóm tắt lý thuyết → VÍ DỤ có "Bài làm" → LUYỆN TẬP không lời giải) + 6 Phiếu tự luyện + 35 Phiếu cuối tuần (Phần I trắc nghiệm chỉ ghi đáp số · Phần II tự luận).
- VÍ DỤ có "Bài làm" ⇒ tự giải trước, "Bài làm" là nhân chứng + chuẩn khuôn trình bày (§A4). LUYỆN TẬP / phiếu ⇒ tự giải.

### Công cụ riêng

- `scripts/kho/so-do-doan-thang.mjs mo-ta.json --out so-do.svg` — sơ đồ đoạn thẳng đúng tỉ lệ. Mô tả: `gia_tri_phan` (BẮT BUỘC) · `hang` (`nhan`, `phan`, `them` = đoạn thêm, `bot` = đoạn thiếu nét đứt) · `tong`/`hieu` (máy kiểm khớp) · `dau_hoi` · `tieu_de`. Mẫu: `kho-rules/dai/so-do/4T-*.json`.
- `kho-rules/dai/lo/k4T-kiem.mjs` — bộ kiểm đáp số tính từ ĐỀ.
- `scripts/kho/mathtype-thu/doc-docx.mjs <docx> --ra <thư mục>` — docx MathType OLE ra text + LaTeX.
- `scripts/kho/sach/tach-bai.mjs` — tách bài theo nhãn VD/LT/phiếu.
- `scripts/kho/sach/dau-vao-soan.mjs` (lọc câu đã có, `--khu`, `--co-hinh`) → `lo-tu-soan.mjs` (`--sua`, `--hinh-de`, cổng KaTeX) → `ghi-lo.mjs` (chạy thử rồi `--ghi`).
- Hình đề: `scripts/kho/sach/trich-media.mjs` → manifest `kho-rules/dai/hinh-de/<khối>.json` → `dung-hinh-de.ps1` (EMF → PNG) → trạm `kiem-hinh-de`.

---

## Khối 5

> Chương trình thường. Nguồn: sách đề "Đề kiểm tra Toán 5" (Qbooks, KNTT — 2 cuốn HK1 + HK2, mỗi cuốn 5 đề giữa kì + 15 đề cuối kì, không in lời giải), đề cương / phiếu ôn. Luật GIẢI dùng luật Khối 5T (nguyên tắc gốc, bảng CẤM, cách chốt A–H, định dạng) trừ các điểm dưới.

### Phạm vi kiến thức

- Đúng chương trình Toán 5 KNTT; thuật ngữ, cách gọi theo SGK KNTT 5 ("làm tròn số thập phân", "tỉ lệ bản đồ", "đề-xi-mét khối").
- **Cuối kì I**: HK1 — số thập phân, phép tính STP, đơn vị đo, hình tam giác / hình thang / hình tròn + kiến thức lớp 4 (tổng–hiệu, tổng–tỉ…).
- **Cuối kì II**: + HK2 — tỉ số, tỉ số phần trăm, thể tích, hình hộp – hình lập phương, số đo thời gian, vận tốc, biểu đồ hình quạt…
- **Giữa kì I / giữa kì II**: phần đầu của học kì tương ứng — chưa có luật chi tiết, lô mẫu đầu tiên sẽ rút.
- **Thi vào lớp 6**: bộ đề CLC thuộc **Khối 5T** (mục Theo loại nguồn của 5T).
- **CẤM**: kiến thức lớp 6 trở lên; gọi ẩn / chuyển vế; `⇒ ⇔ ∈ ≤ ≥` trong lập luận; `\widehat`, `\angle` (góc viết như SGK 5: "góc đỉnh A, cạnh AB, AC").

### Phân kho

- Mọi câu `kho=dai` (khối 5 chưa tách kho hình).

### Đại

**(a) Công cụ**: như 5T. Riêng lô sách đề Qbooks: **KHÔNG vẽ sơ đồ** — không viết `Ta có sơ đồ:`; tổng–tỉ / hiệu–tỉ giải theo "tổng số phần bằng nhau", mô tả số phần bằng lời (`Số bé: 2 phần; số lớn: 3 phần.`).

**(b) Trình bày riêng**
- **Tách ý** (cụ thể hoá §A7): tách các bài "Đặt tính rồi tính", "Tính", "Tính giá trị biểu thức", "Tính bằng cách thuận tiện", "Tìm $y$/$x$" — mỗi phép tính một câu, nhãn `Bài 2a`, `Bài 2b`… theo thứ tự đọc (đề không ghi a b thì tự đánh), đề của câu = lời dẫn + phép tính của ý (`Đặt tính rồi tính: $509\times 37$`). Mọi bài khác (điền số / đổi đơn vị "Số?", so sánh >;<;=, đọc viết số, sắp xếp, hoàn thành bảng, lời văn) giữ một câu, Phần 2 ghi `a)` `b)`.
- **Đặt tính**: phép nhân viết cột `\begin{array}{r}…\end{array}`; phép chia ghi các lượt chia (`$88:63=1$ (dư 25), hạ 2 được $252$…`) rồi dòng kết quả.
- Đổi đơn vị một dòng riêng `Đổi: …`. Câu trắc nghiệm: dòng cuối là `Chọn X.`
- **Loại câu**: trắc nghiệm `trac_nghiem` (đủ 4 dòng `A. ` … `D. `) · còn lại `tu_luan`; câu có MỘT kết quả gọn (bài tính, tìm $x$, lời văn một đáp số) ghi `dap_an` (vd `dap_an=600`), bài không có kết quả gọn ghi `dap_an=—`. Câu "Đúng ghi Đ, sai ghi S" ⇒ `tu_luan`, đề đủ mệnh đề, lời giải xét từng mệnh đề, `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
- **Định dạng (máy chặn)**: nhân `\times` (CẤM `\cdot`, dấu chấm) · chia `:` · hỗn số `$3\dfrac{4}{100}$` · dấu phẩy thập phân · đơn vị có mũ `$m^2$`, `$dm^3$` · `$25\%$` · tránh chữ tiếng Việt trong công thức, buộc phải có thì bọc `\text{…}`. Ô trống trong đề viết `…`. Bỏ "(0,5 điểm)", "(1 điểm)" khỏi đề.
- **Đơn vị chép ĐÚNG như sách in** (sách in `km/h` thì đề và lời giải đều `km/h`) [28/10].

**(c) Sai lầm cần tránh**
- [28/10] **HỖN SỐ đọc sai** (2/5 đề đầu): $2\dfrac{8}{9}$ chép thành $2-\dfrac{8}{9}$, $2\dfrac{3}{4}$ thành $\dfrac{2}{4}$ ⇒ mọi biểu thức có phân số / hỗn số ở phần tự luận: cắt phóng to 300 dpi rồi mới chép. Bản máy gõ (`de.json`) hay sai đúng chỗ này — ảnh trang là nguồn chính.
- [28/10] đề in 2 cột ⇒ đánh a b c d theo HÀNG (trái → phải rồi xuống).
- [28/10] phương án A đã đúng sẵn mà đáp án chọn C ⇒ theo §A4 (sửa nhiễu thành sai hẳn + `**Ghi chú:**`).
- [28/10] `**Ghi chú:**` về "máy gõ nhầm" ⇒ xoá; chỉ ghi lỗi đề gốc / điều người duyệt cần biết.
- [08/11] trạm soạn đọc nhầm hỗn số / hàng / số nhiều chữ số, gọi hình mang số liệu là "trang trí" ⇒ trạm kiểm phóng to 300 dpi, kiểm từng hình.

### Hình

- Câu có hình, bảng số liệu, biểu đồ, bảng cần hoàn thành ⇒ dòng `**Hình:** <tên tệp>` (một tệp). Đề vẫn viết phần lời bằng chữ; bảng ngắn thì chép thêm thành chữ ("Bảng: Cam 3,1 kg; Nho 1 kg 900 g; …").
- Hình máy cắt hỏng / thiếu ⇒ tự cắt lại (`pdftoppm -r 150 -png -singlefile -f <tr> -l <tr> -x -y -W -H`), mở ảnh kiểm, đặt tên mới (`p1c4_lai`, không đè). Hình đủ, không dính chữ câu khác, không dính hình trang trí.
- **Hình trang trí** (con vật, nhân vật, đồ vật không mang dữ kiện) ⇒ không đưa vào.
- **Bài yêu cầu VẼ** ⇒ vẫn nhập, lời giải tả từng bước vẽ, `**Ghi chú:** lời giải chưa có hình vẽ`.

### Theo loại nguồn

- **Sách đề không có đáp án**: mọi câu không có nhân chứng ⇒ Opus giải mù (§C5); lệch ⇒ tính lại bằng máy để biết ai sai. Soát từng câu: đề chép đúng ảnh (số, phân số, hỗn số, dấu phẩy, đơn vị, phương án, đủ ý) · đúng kiến thức Toán 5 KNTT · Phần 2 đúng khuôn vở · tách ý · `loai` · hình.
- Tên đề: `# ĐỀ | Đề kiểm tra giữa kì số <n> — Toán 5 học kì <k> (sách Đề kiểm tra Toán 5, Qbooks)` (cuối kì: `Đề kiểm tra cuối kì số <n> — …`) · `bo_sach: KNTT` · `thoi_gian_phut: 40`.
- **Đề cương / phiếu ôn**: thêm `kieu: de_cuong` dưới tiêu đề (`# ĐỀ | Phiếu ôn tập Toán giữa học kì I lớp 5 — Số 2`); nhãn câu giữ như đề gốc.

### Công cụ riêng

- `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k5/<MA>.soan.md --lam-viec "<LV>" --khoi 5 --chi-kiem` — cổng, sửa tới "✔ đạt cổng".
- `pdftoppm -r 300 … -x -y -W -H` — phóng to vùng mờ (toạ độ ×2 so với ảnh 150 dpi).
- Đề mẫu: `kho-rules/dai/lo/k5/HK1-GK01.soan.md` (đơn giản hơn: `kho-rules/dai/lo/k5-on-gki/DE4.soan.md`); đề cương mẫu `kho-rules/dai/lo/k4-k5-de-cuong/L5-PHIEU2.soan.md`.

---

## Khối 5T

> Khối nâng cao tiểu học. Nguồn: "Tài liệu tham khảo Toán 5" (`ten_de_goc = "Toán 5 TLTK · <mã bài>"`). Luật đạt v1 ngày 09/10. **Luật Khối 4T áp cho 5T** (bảng CẤM, khuôn lời văn, sơ đồ, kiểm riêng) trừ chỗ ghi khác ở đây.

### Phạm vi kiến thức

- Không chia theo mốc kì: chuyên đề đang xét + chuyên đề đứng trước + chương trình tiểu học.
- **Nguyên tắc gốc**: lời giải **như một học sinh lớp 5 giỏi viết vào vở**; phụ huynh tiểu học đọc hiểu. Bước chỉ giải được bằng "gọi ẩn lập phương trình" ⇒ đổi sang phương pháp tiểu học (sơ đồ đoạn thẳng / số phần / thử chọn / hiệu không đổi / giả thiết tạm / khử…). Không đổi được / không giải được trong kiến thức tiểu học ⇒ giữ câu, `**Chưa chắc:**` nêu lí do (§A14).
- **31 chuyên đề**: 1 Ôn tập phân số, hỗn số · 2 Ba bài toán về phân số · 3 Công việc chung · 4 Dãy phân số, hỗn số · 5 Tỉ lệ thuận–nghịch (kép) · 6 Ôn tập toán lời văn · 7 Hai hiệu số · 8 Hai tỉ số · 9 Tính ngược · 10 Số thập phân · 11 Đơn vị đo · 12 Phép tính với STP · 13 Bài toán về STP (dãy cách đều, dịch dấu phẩy) · 14 Tỉ số phần trăm · 15 Ba bài toán về % · 16 Dung dịch, quặng, hạt tươi · 17 Bài toán khác về % · 18–19 Tam giác · 20 Hình thang · 21 Hình tròn · 22 Hình khối hộp · 23 Xếp hình đơn vị · 24 Sơn mặt · 25 Vận tốc, quãng đường, thời gian · 26 Cùng chiều, ngược chiều · 27 Dòng nước · 28 Cùng v, s, t · 29 Chuyển động khác (vận tốc TB, tàu có chiều dài) · 30 Giả thiết tạm · 31 Phương pháp khử · Ôn tập (13 mục, bài ON 1…125).
- **CẤM thêm** (ngoài bảng 4T): biểu thức chữ kiểu $100a+10b$, $1,01d+0,1a$ ⇒ phân tích theo HÀNG · "thử $y=0,1,…,9$" liệt kê máy móc ⇒ so sánh từng hàng từ trái sang phải · "hai tỉ số bằng nhau ⇒ tổng tử / tổng mẫu cùng tỉ số" (dãy tỉ số bằng nhau, lớp 7) [09/10] ⇒ hai tam giác chung đáy thì tỉ số diện tích = tỉ số đường cao, quy về tổng–tỉ / hiệu–tỉ. (5T được dùng số thập phân, phần trăm, vận tốc.) Đề có sẵn chữ $y$/$x$ thì dùng bình thường — chỉ cấm TỰ đặt ẩn mới.

### Phân kho

- Mọi câu `kho=dai`.

### Đại

**(a) Công cụ được phép (vì sách 5T làm vậy)**
- **Phương pháp khử (CĐ31)**: được "Gọi giá 1 bút xanh là $X$ (nghìn đồng), giá 1 bút đỏ là $D$" rồi hai dòng $3\times X+7\times D=134\ (1)$ · $3\times X+4\times D=92\ (2)$, nhân một dòng cho cùng hệ số, lấy dòng này trừ dòng kia. Viết $3\times X$, không $3X$. Không "chuyển vế". Chữ đặt theo chữ đầu tên đồ vật.
- **Tỉ số phần trăm (CĐ14–17)** [09/10]: $a\%$ của $M$ viết $M\times a\%$; tìm số biết $b\%$ của nó là $M$ viết $M:b\%$. Không kiểu $200\times 6:100$. **Nhân / chia hai tỉ số phần trăm viết thêm bước thập phân**: $125\%\times 75\%=1,25\times 0,75=0,9375=93,75\%$.
- **Chuyển động (CĐ25–29)**: dòng "Đổi: 2,5 giờ = 2 giờ 30 phút" riêng; cộng / nhân số đo thời gian một dòng. **Bài chuyển động có quãng đường PHẢI có sơ đồ minh hoạ** [09/10]: `Ta có sơ đồ:` ngay sau `Bài giải`, máy vẽ `so-do-chuyen-dong.mjs`; CĐ28 vẽ thêm sơ đồ đoạn thẳng tỉ số.
- **Cấu tạo số (Ôn IV)** [09/10]: bài **thêm / bớt chữ số bên trái, bên phải** là **bài toán tỉ số** ⇒ giải bằng sơ đồ (số cũ 1 phần, số mới 10 phần và $c$…). Bài **đề cho sẵn cấu tạo số** ($\overline{abcd}+\overline{abc}+\overline{ab}+a=3132$, $7\times\overline{ab}=\overline{3ab}$) ⇒ phân tích theo hàng, viết rõ dấu nhân ($\overline{3ab}=300+\overline{ab}$; $\overline{abcd}=a\times 1000+b\times 100+c\times 10+d$), "bớt cả hai vế" như 4T CĐ12 — cấm $100a$, cấm "chuyển vế".
- **Sơ đồ BẮT BUỘC khi**: tổng–hiệu · tổng–tỉ · hiệu–tỉ (kể cả tỉ số ẩn sau quy đồng tử) · hơn/kém trung bình cộng · hai hiệu số (3 hàng: tổng thật, cách thừa `bot` nét đứt, cách thiếu `them`) · dịch dấu phẩy · thêm/bớt chữ số · chuyển động tỉ số · mọi chuyển động có quãng đường. **KHÔNG sơ đồ**: hai tỉ số CĐ8, tính ngược phân số, bài tính, đổi đơn vị. Một hàng hơn 12 phần ⇒ không vẽ (luật CLC ở Khối 6 áp chung).
- **Dạng NHIỀU CÁCH — một cách chính đã chốt** (Thùy 08–10/10). Phần 2 chỉ trình bày cách chính, không nhắc cách khác:

| # | Dạng | Cách chốt |
|---|---|---|
| A | Cộng/trừ hỗn số | Ưu tiên tính riêng phần nguyên và phần phân số; số to bắt buộc cách này; số bé mới đổi ra phân số |
| B | Tỉ lệ thuận / nghịch | Rút về đơn vị (không "gấp mấy lần", không tam suất) |
| C | Tỉ lệ kép | Rút về "1 người trong 1 ngày" |
| D | Tính ngược có phân số | Phân số "… ứng với … (số cam ban đầu)" rồi chia. Sơ đồ lồng nhau chỉ để GV giảng — không vào kho |
| E | Xếp hình lập phương nhỏ | Cạnh lớn gấp cạnh nhỏ mấy lần rồi nhân 3 chiều |
| F | Dãy phân số mẫu gấp đôi | "$2\times B-B$" (mẫu gấp 3: $3\times B-B$ đã dùng ở ON 10, chưa chốt riêng) |
| G | Tìm $a\%$ của một số | $M\times a\%$, chiều ngược $M:b\%$ |
| — | Hai tỉ số (CĐ8) | Phân số của đại lượng không đổi, không sơ đồ |
| H | Đại lượng = TÍCH hai đại lượng, đề cho % thay đổi [10/10] | Tỉ số % từng đại lượng so với lúc đầu rồi nhân/chia (không giả sử "lúc đầu có 100 khán giả"): "Doanh thu sau so với ban đầu: $100\%+8\%=108\%$ · Khán giả: $100\%+20\%=120\%$ · Giá vé: $108\%:120\%=1,08:1,2=0,9=90\%$ · Giá vé sau: $40000\times 90\%=36000$". Mấu chốt nêu công thức gốc (Doanh thu = giá vé × số người) |

  Gặp dạng nhiều cách CHƯA có trong bảng ⇒ chọn cách bám công thức / quan hệ gốc (không giả định số cụ thể), `**Ghi chú:** nhiều cách: …` để trưởng khối chốt thêm dòng vào bảng.

**(b) Trình bày riêng**
- **Phần 1 dạy cách TƯ DUY** (Thùy 04/10), không phải "Phần 2 kèm lời": Mấu chốt (điều phải nhận ra) · vì sao nghĩ ra hướng đó (dấu hiệu nào trong đề) · các bước theo mạch nghĩ. Quy tắc / tính chất dùng (giao hoán, kết hợp, quy tắc thành phần chưa biết, dịch dấu phẩy) nêu ở Phần 1; Phần 2 bài tính chỉ các dòng biến đổi.
- Lập luận (chữ số, so sánh, tìm số thoả điều kiện): biến đổi đi kèm "Vì … nên …" ngắn nhất, kết "Vậy …"; mỗi "Vì … nên …" tự đủ lí do — không "Vì A nên C" khi thiếu B.
- Mọi bước đổi (hỗn số → phân số, thập phân ↔ phân số) một dòng riêng. Dãy cách đều: `Số số hạng: $(4,5-0,5):0,4+1=11$`.
- Diện tích toàn phần / thể tích: không viết $6\times 6\times 6$ cho diện tích toàn phần — tách 2 dòng.
- Sơ đồ: `Ta có sơ đồ:` + mô tả bằng lời trong ngoặc (`(Số bé 1 phần; Số lớn 3 phần; tổng 96)`) + hình máy vẽ đúng tỉ lệ; nhiều sơ đồ một câu ⇒ mảng.
- **Khuôn chuyên đề Số thập phân (CĐ10–13)**: tính chất STP ⇒ đổi về cùng kiểu số, so từng hàng trái sang phải, kết bằng câu · tính thuận tiện ⇒ biến đổi từng dòng · biểu thức hỗn hợp ⇒ mỗi phép tính một dòng, hỗn số / phân số đổi ra STP trước · tìm $y$ ⇒ theo cột, $y$ lặp lại ⇒ đưa về "$y$ nhân với một tổng" · nâng cao cấu tạo STP ⇒ dịch dấu phẩy = gấp / giảm 10, 100 lần ⇒ quy về số phần; bài chữ số lập luận theo hàng + chữ số tận cùng.
- Định dạng: dấu phẩy thập phân · `$25\%$` · không chữ tiếng Việt trong công thức (nói bằng lời ngoài `$…$`) · đơn vị có mũ `$cm^2$`.
- **`dap_an`** (gọn, đúng câu hỏi, có đơn vị): `$6$ km` · `Bình: $31$ viên bi; Minh: $15$ viên bi` · `a) …; b) …` · bài tính `$2\dfrac{3}{4}$` / `$y=3$` · so sánh `$\dfrac{2022}{2023}<\dfrac{2023}{2024}$` · `$10$ giờ $42$ phút` · `$37,5\%$`. Bài tính vẫn PHẢI có `dap_an`. Bài "Tính $A=…$" giữ chữ của đề `$A=\dfrac{15}{34}$`. Nhiều giá trị `$y=7$; $y=8$; $y=9$`. Câu kho cũ giải lại: giữ `dap_an` hiện có, chỉ đổi lời giải; đáp án dạng tập hợp `$y \in \{…\}$` ⇒ `**Ghi chú:**` cho trưởng khối (đổi sang chữ đụng chấm / form MCQ).

**(c) Sai lầm cần tránh**
- [04/10] 271 câu Số thập phân giải kiểu THCS (gọi ẩn, `⇒ ∈ {}`) ⇒ giải lại theo cách HS tiểu học; Phần 1 quan trọng nhất.
- [04/10] giải thích lẫn trong trình bày lời văn ⇒ "1 câu lời giải → 1 phép tính"; giải thích lên Phần 1.
- [04/10] gọi một số là "số tròn" khi nó không tròn ⇒ Phần 1 khớp ĐÚNG đề, không chép khuôn.
- [09/10] cách "để làm quen" (D — sơ đồ lồng) đưa vào kho ⇒ lời giải kho ≠ bài giảng.
- [09/10] tìm $a\%$ viết $\times a:100$ ⇒ $M\times a\%$; nhân hai tỉ số % viết thêm bước thập phân.
- [09/10] bài chuyển động không sơ đồ ⇒ bắt buộc sơ đồ đường đi.
- [09/10] bài thêm bớt chữ số giải kiểu cấu tạo số ⇒ là bài tỉ số, giải sơ đồ.
- [09/10] `dap_an` "Tính A=" thiếu "A=" · chữ tiếng Việt trong công thức (`\text{thừa số cuối}`) · câu ngoài lề "(Sách còn có cách lập tỉ số…)", "(cách ưu tiên của sách)" ⇒ cấm cả ba.
- [09/10] sơ đồ: `tieu_de` > 40 ký tự bị cắt · đã ghi hiệu bằng `them`/`bot` thì không thêm `hieu` lặp · `hieu` luôn là chênh lệch HAI HÀNG ĐẦU · không vẽ sơ đồ mà nhãn tổng là kết quả suy ra sau (lộ đáp số).
- [09/10] đề in lỗi rõ (`5xy+1` thay `5\times y+1`; chính tả) ⇒ soạn theo đề đúng + `**Ghi chú:**`.
- [09/10] đề chỉ là ô trống theo hình ghép, phải đoán bằng mắt (LT 19.7, 19.15) ⇒ viết lại đề nêu rõ dữ kiện từng ý (giữ hình) + `**Ghi chú:**`.
- [09/10] sách in lỗi trong chính VÍ DỤ (VD 1.5a; VD 5.3; VD 26.1) ⇒ không chép VD làm mẫu khi chưa kiểm phép tính.
- [09/10] tách ý sai do sách xếp 2 cột (LT 14.5, 25.3) ⇒ kiểm ý dính nhau khi sách in 2 cột.
- [10/10] giải "% thay đổi của tích" bằng giả sử số cụ thể ⇒ dòng H.
- Quy ước hiểu đề đã dùng: "tỉ số phần trăm số HS nam và số HS nữ" = nam : nữ · sơn mặt: khối đỉnh "sơn hai màu", "mặt xung quanh" = 4 mặt bên · bể coi là chưa có nước nếu đề không nói. Dùng quy ước ⇒ `**Ghi chú:**`.

### Hình

**(a) Công cụ (CĐ18–24)**: ký hiệu $S_{ABC}$; tỉ số diện tích qua chung đường cao / chung đáy; hình tròn $r\times r=28,26:3,14$ (không $r^2$), $\pi$ viết $3,14$; được "Gọi $r$ là bán kính" để viết $r\times r$.

**(b) Trình bày riêng**
- **Tỉ số diện tích viết ĐỦ CÂU** [09/10]: "Tam giác AMC và tam giác ABC có chung đường cao hạ từ A xuống BC, suy ra $\dfrac{S_{AMC}}{S_{ABC}}=\dfrac{MC}{BC}=\dfrac{2}{3}$" — không để lí do trong ngoặc sau công thức.
- Phần tô đậm = hình lớn trừ phần không tô, hoặc cộng các phần — nói rõ cách chia.
- Bài có hình: mở hình xem kỹ (tên điểm, điểm trên cạnh nào, chấm chia đoạn, số đo, vùng tô). Dữ kiện chỉ có trên hình ⇒ được dùng, Phần 2 nêu "Theo hình vẽ, …". Hình lệch chữ ⇒ theo §A4.
- Bài có hình nhiều ý (trừ Tính / Tìm $x$ thuần) giữ MỘT câu, Phần 2 ghi a) b) theo nhãn trên hình ghép.
- Không sơ đồ đoạn thẳng trừ khi bài có thêm phần tổng–hiệu / tỉ rõ ràng.
- Hình sách hỏng (vùng tô thành khối đen) / lệch tên điểm ⇒ vẽ lại bằng code đúng số liệu đề [09/10].

**(c) Sai lầm cần tránh**
- [09/10, LT 19.27–19.30] tìm vị trí giao điểm bằng dãy tỉ số bằng nhau ⇒ cách lớp 5.
- [09/10] VD 18.2 in "AB = 36" không giải được ⇒ sửa đề theo hình + lời giải mẫu, `**Ghi chú:**`.
- [09/10] số đọc từ hình (cạnh, bán kính) ⇒ trạm kiểm mở lại hình đối chiếu; cách đọc còn ngờ ⇒ `**Chưa chắc:**`.

### Phân dạng riêng

- Luật phân dạng 4T áp luôn (phương pháp thắng chủ đề · không khớp thì không ép).
- **Ngoại lệ có chủ ý — "Thay đổi số người"** [11/10 · Thùy]: bài có SỰ KIỆN thêm/bớt người vào dạng này dù lời giải chỉ là một phép tỉ lệ, dù nền là thuận hay nghịch (dấu hiệu đề thắng phương pháp). Gồm ① đổi từ đầu ② đổi giữa chừng (xét phần việc / số gạo CÒN LẠI).
- Tỉ lệ thuận–nghịch: cơ bản thuận = hai đại lượng cùng tăng cùng giảm, rút về 1 đơn vị · cơ bản nghịch = một đại lượng không đổi là tích hai đại lượng kia · tỉ lệ kép = BA đại lượng cùng đổi. Tỉ lệ chỉ là một bước của bài khác (hình, %, chuyển động) ⇒ không thuộc chuyên đề này.
- Công việc chung: cơ bản = người / vòi tham gia suốt từ đầu (kể cả vòi vào trừ vòi ra cùng lúc; bể có sẵn nước) · có thay đổi giữa chừng = giai đoạn đầu và sau khác nhau.
- Tỉ số phần trăm (12 dạng bản đồ mới): cộng trừ nhân chia tỉ số % · tìm % của một số (kể cả nhiều bước) · tìm một số khi biết % · bán hàng cơ bản · lãi theo giá BÁN · giảm giá (vẫn lãi) · giảm giá kép (nhân, không cộng) · doanh thu–chi phí (% hai thừa số) · diện tích (dài × rộng đổi %) · trộn A và B · hỗn hợp tìm ngược. % chỉ là một bước của bài hình / chuyển động ⇒ không vào chuyên đề %.
- [08/11] **Pha loãng / cô đặc là hỗn hợp**: thêm nước cất / thêm muối / đun bay hơi (chất tan không đổi) ⇒ nhóm "Bài toán hỗn hợp": hỏi % sau pha ⇒ "Trộn A và B → hỗn hợp"; hỏi lượng cần thêm ⇒ "Hỗn hợp tìm ngược A, B".
- [08/11] Sau mỗi đợt migration bản đồ phải kiểm lại các dòng gán — dòng gán mất theo nhóm mà câu vẫn `da_duyet` nên nhìn không ra.

### Theo loại nguồn

- **Sách "Toán 5 TLTK"**: 31 CĐ (Kiến thức cần có → Tóm tắt lí thuyết → VÍ DỤ → LUYỆN TẬP không lời giải) + Phần ôn tập. VÍ DỤ có lời giải mẫu ⇒ tự giải trước, lời giải sách là nhân chứng (sách có in sai). VD in đề và bài giải liền nhau / bảng đọc lộn ⇒ `**Chưa chắc:**`.
- **Câu kho cũ giải lại (Số thập phân)**: giữ `dap_an`, chỉ đổi lời giải.
- **Câu máy sinh theo mẫu (clone) chuyên đề phần trăm** [08/11 · Thùy]: tham số "số đẹp" — mọi số tiền là **bội của 1000 đồng**; phần trăm tròn; lãi ngày thường ≤ 100%, lãi còn lại từ 5% đến dưới 100%; nhân/chia hai tỉ số % ra số thập phân hữu hạn. Bộ kiểm độc lập: đọc CHỮ của đề, tính lại bằng phân số BigInt, tính cả chuỗi `a=b=c` mọi dòng Phần 2, "Đáp số" = `dap_an`, card 3–6 bước, KaTeX, không ký hiệu cấm, 0 trùng đề. Cơ cấu: bán hàng cơ bản (giá gốc · lãi · giá bán · tỉ lệ lãi · tỉ lệ bán) mỗi loại 20 câu · lãi theo giá bán ~40 · giảm giá 2 kiểu × 30. Khuôn: lãi theo giá bán ⇒ coi giá bán 100%, giá gốc = (100−a)%; giảm giá kiểu 1 ⇒ coi giá nhập 100%: (100+p)% × (100−d)% − 100%; kiểu 2 ⇒ (100+q)% : (100−d)% − 100%. Ghi `nguon='clone'`, `clone_method='may_sinh_theo_mau'`. Vào kho theo §C6.

**Bộ đề thi vào lớp 6 CLC Hà Nội (kiến thức Toán 5 nâng cao; HS lớp 5 đọc)**
- Chỉ giải 58 đề của `TUYỂN TẬP ĐỀ THI CLC 2025-2026.docx` [10/10 · Thùy]. Phần chuyên đề (738 bài) "cũng là từ đề ra" ⇒ không nhập. Đề cũ 2005–2014, bài trung tâm tự soạn, bài bổ trợ từng HS: ngoài phạm vi. Câu ghi vào **khối 5T** (Thùy 15/11: bộ đề thi vào lớp 6 CLC thuộc 5T).
- Luật giải = luật Khối 5T bên trên (2 phần, card, luật sơ đồ, cách chốt A–H, bảng CẤM tiểu học) + phần riêng dưới.
- Tách ý theo §A7. `ma_nguon` = `"<mã đề> · <số>"` / `"<mã đề> · P<phần>.<số>"`; mã đề = trường + năm bắt đầu năm học (`LTV 2018`, `ARC 2020-CB`, `NTT-MH1`…).
- Kiểu câu: `dien` (`dap_an` gọn như HS ghi vào ô — số + đơn vị; Phần 2 trình bày đầy đủ như tự luận lớp 5) · `trac_nghiem` (giải ra rồi `Chọn B.`; không thử từng phương án trừ bài đúng là "thử chọn") · `tu_luan` (`a) …; b) …`, ý sau dùng lại kết quả ý trước) · `dung_sai` (`a) Đúng; b) Sai; …` đủ mệnh đề; tính số liệu chung trước rồi mỗi mệnh đề một đoạn kết "Đúng." / "Sai.").
- Kiến thức lớp 5: không đặt ẩn / phương trình / chuyển vế, không số âm, không kiến thức lớp 6+ (đồng dạng, Ta-lét, luỹ thừa, căn, đồng dư…), trừ kí hiệu đề đã dùng. Chia hết chỉ dùng dấu hiệu chia hết và phép chia có dư.
- **Sơ đồ quá lớn thì BỎ** [10/10 · Thùy]: một hàng hơn 12 phần ⇒ không vẽ, không ghi "Ta có sơ đồ:", viết bằng lời "… là 83 phần, … là 60 phần". Nhãn sơ đồ không lộ đáp số.
- Câu ngoài khuôn sách (lịch – thứ ngày, suy luận lôgic, đếm, xoá chữ số): Phần 2 lập luận bằng câu văn ngắn + phép tính.
- Định dạng CLC6 (lớp 5): `\dfrac`, nhân `\times`, chia `:`, dấu phẩy thập phân, đơn vị ngoài công thức hoặc `\text{cm}^2`; không chữ Việt trong `$…$`.
- Đề có vấn đề — không bịa dữ kiện: thiếu hình / dữ kiện, số liệu vô lí ⇒ `**Chưa chắc:**` (thiếu gì, đã hiểu thế nào). Đề hỏi lửng ("là:") ⇒ giữ nguyên. TN kết quả không trùng phương án nào ⇒ theo §A4. Có `luu_y_de` (cách hiểu đã chốt) ⇒ làm theo và nói rõ giả thiết trong lời giải.
- Ba nguồn đáp số độc lập: bản soạn (không mở PDF / lời giải sẵn) · code (phân số chính xác; hình dựng toạ độ; đếm vét cạn) · cột Đáp số của sách. Lời giải sẵn có chỗ sai (LTV 2018 câu 13) ⇒ phân xử bằng máy.
- **Đề lấy từ Word** (MathType → LaTeX), PDF để đối chiếu / lấy đáp số (pdftotext vỡ phân số ⇒ nhìn ảnh). Word có lỗi chép so với PDF (mất phân số, đảo 512↔152) ⇒ đối chiếu đề TỪNG câu; lệch ⇒ sửa theo PDF (PDF rõ sai thì không sửa, nói rõ). PDF có hình mà Word thiếu ⇒ bù hình (kể cả bảng số liệu / biểu đồ) [10/10 · Thùy].
- Trạm kiểm phân mức: `sai` (bắt buộc sửa) · `nen_sua` · `hoi` (chỉ báo).
- **Tình trạng ghi kho CLC [21/11 · Thùy: "đẩy toàn bộ câu đề CLC vào bản đồ"]**: 720/805 câu đã ghi vào kho 5T (`dai_cau_hoi`, `ma_cau` `T15T…`, `nguon` theo đề, `ten_de_goc` giữ tên đề) bằng `scripts/kho/de-thi/ghi-clc6.mjs` (idempotent, chạy lại an toàn) + dựng **16/58 đề** trong **Kho đề thi** (`tai_lieu` loại `de_thi`; `toan_de_thi` là bảng cũ, trống). Gán bản đồ 5T bằng `gan-bdm-nhom.mjs`: 415 câu gán chắc, 188 đề xuất chờ duyệt, 117 câu thiếu dạng (suy luận / đếm / lô-gic / trò chơi — chưa có nhóm 5T; luật "không khớp dạng thì không ép" ⇒ ở dạng chờ). 344 câu đã duyệt, 188 câu máy nghi chờ trưởng khối.
- **81 câu / 42 đề CHƯA ghi**: đề có hình in trong Word gốc mà máy không có file (chỉ 6 sơ đồ dựng sẵn) ⇒ script từ chối ghi thay vì mất hình (đúng luật thiếu hình thì không ghi). Cần `TUYỂN TẬP ĐỀ THI CLC 2025-2026.docx` (hoặc 84 ảnh trong đó) rồi chạy lại `ghi-clc6.mjs`. Ngoài ra: 2 TN chưa đủ 4 phương án (TX 2023·1, ARC 2022-CB·25), 3 câu bỏ có chủ ý (LTV 2024·19, LTV 2024·20, NTT 2019·1), 2 câu Đúng/Sai NTL 2025 P1.9/P1.10.
- **Lộ số trong sơ đồ**: nhãn sơ đồ đoạn thẳng ghi số trung gian làm lộ đáp án ⇒ cấm. Đã sửa 6 sơ đồ trong `SUA_SO_DO` của `ghi-clc6.mjs` (chưa nhìn ảnh xác nhận bằng mắt).
- Thời lượng đề mặc định 75 phút ("Lớp 5 CLC = 75'") — chờ Thùy chốt.

**Sách "250+ Bài toán chọn lọc lớp 5" (ME · TKBooks · Trần Nhật Minh) — nguồn thứ ba của 5T, đồng thời là CHUẨN THAM CHIẾU về đề và cách trình bày** [21/11 · Thùy]
- Sách scan 272 trang, 14 chuyên đề: 1 Cấu tạo số · 2 Dãy số · 3 Chẵn lẻ, chữ số tận cùng · 4 Tỉ lệ thuận–nghịch · 5 Phân số, dãy phân số · 6 Lập số, quy tắc đếm · 7 Tỉ số (cơ bản, hai tỉ số) · 8 Tổng–tỉ, hiệu–tỉ · 9 Số thập phân · 10 Tỉ số phần trăm · 11 Diện tích tam giác, hình thang · 12 Hình tròn, hình khối hộp · 13 Chuyển động · 14 Tổng hợp (không lý thuyết). Có lời giải sách cho TỪNG bài (tr.101–272).
- **Cách nhập (Thùy 21/11): chỉ ghép câu + đáp án từ sách, KHÔNG giải lại.** `ten_de_goc = "Toán 5 ME · <mã>"`, mã sách `VD n.k` (ví dụ) · `BT n.k` (bài tập vận dụng). Đã bóc 328 mục (29 VD + 299 BT) vào `kho-rules/dai/lo/me5-250/ME-CDxx.json` (trường `noi_dung`, `dap_an`, `loi_giai_sach`, `co_hinh`, `chua_chac`); ghi chú từng chuyên đề ở `ME-ghi-chu-A…E.md`. Lời giải sách là **nhân chứng đáp số**; mục `chua_chac` (48 mục) và bài có hình (35) phải người xem ảnh trang `trang/p-NNN.jpg` trước khi vào kho.
- **Sách in sai — không chép nguyên** (đã gặp): BT 4.4 "80m mét" · BT 6.9 "+ x + 5 − 8" (đúng +8) · BT 5.6a dấu trừ dư · BT 12.10 "4321cm" · BT 14.12 nhãn $R_1$ ở hàng 2 · BT 2.18 đáp số 555 (tính lại ra 556) và đề in "chữ số thứ 11" (đúng 12). Gặp lệch ⇒ theo §A4: tính bằng máy, sửa theo đề đúng + `**Ghi chú:**`.
- **Khuôn trình bày của sách (dùng làm mẫu cho 5T, nơi hợp luật 5T):**
  - Lời văn: một dòng = "Đại lượng … là: phép tính = kết quả (đơn vị)." rồi "Đáp số: …" (CĐ4, 7, 8, 10, 12, 13); không "Gọi…", không "Thử lại". Khớp luật "1 câu lời giải → 1 phép tính".
  - Tỉ số (CĐ7–8): "Coi số … là 3 phần bằng nhau thì số … là 5 phần như thế." → "Tổng số phần bằng nhau là: …" → "Số … là: 45 : 5 × 2 = 18". Hai tỉ số: nêu "Nhận xét: … không đổi" rồi đổi mỗi tỉ số thành phân số của ĐẠI LƯỢNG KHÔNG ĐỔI (khớp dòng "Hai tỉ số" ở bảng cách chốt). Sách chỉ vẽ sơ đồ ở một số bài (7.10, 8.9, 8.10, 8.15, 4.18, 4.19) — luật sơ đồ 5T ở trên vẫn thắng.
  - Phần trăm (CĐ10): "Coi … là 100% thì … bằng: 100% + 12% = 112%" → "… ứng với 112%" → chia. Nhân/chia hai tỉ số % có bước thập phân. Khớp dòng G, H.
  - Tỉ lệ (CĐ4): rút về đơn vị; có "Nhận xét:" cho tỉ lệ nghịch; đổi đơn vị một dòng riêng. Khớp dòng B, C.
  - Dãy phân số (CĐ5): đặt tên A, "A × n − A" hoặc tách mẫu thành hiệu hai phân số triệt tiêu; "Ta có … Do đó … Vậy". Khớp dòng F.
  - Cấu tạo số / chữ số (CĐ1, 3, 6, 9): sách "Gọi số cần tìm là $\overline{abc}$", "bớt cả hai vế", "Trường hợp 1/2 … (loại)", "Thử lại … (thoả mãn)". **5T giữ luật riêng: cấm $100a+10b$, phân tích theo hàng, viết dấu nhân** (§ Phạm vi kiến thức) — bài cấu tạo số kiểu sách không chép khuôn, soạn theo luật 5T; được giữ "Trường hợp … (loại)" và "Thử lại" khi bài là thử chọn.
  - Hình (CĐ11–12): "Ta có $S_{ABN}=\dfrac12 S_{ABC}$" + lí do; **sách đặt lí do trong ngoặc sau công thức — 5T vẫn viết ĐỦ CÂU** (mục Hình (b)). Hình tròn: $3,14\times r\times r$ (sách làm vậy, khớp).
  - Chuyển động (CĐ13): "Vì trên cùng quãng đường, thời gian và vận tốc tỉ lệ nghịch nên tỉ số thời gian là …" + "Coi thời gian … là 4 phần thì … là 3 phần"; sách luôn có sơ đồ đường đi trong lời giải (khớp luật bắt buộc sơ đồ chuyển động).
  - Ký hiệu đầu dòng của sách (▶ ▸ » ➤ →) và ô "Nhận xét:" / "Quy luật:" / "Cách khác:" là cách trình bày sách giấy — kho 5T KHÔNG chép ký hiệu đầu dòng; "Nhận xét/Quy luật" dạy tư duy thì để ở Phần 1.
- **Bài sách giải bằng gọi ẩn / kiến thức vượt tiểu học** (không nhập nguyên lời giải; nếu nhập thì đổi sang cách tiểu học hoặc `**Chưa chắc:**` §A14): CĐ1 gần hết (gọi chữ số lập đẳng thức; BT 1.24 số thập phân nhân 1111; BT 1.25–1.26 biến đổi phân số) · BT 2.16 (gọi $x$) · BT 3.13 ($n(n+1)$) · 3.14 (giai thừa) · 3.12 (hiệu hai bình phương) · 5.8 (chứng minh bất đẳng thức), 5.11 (biến trong mẫu số) · 6.9, 6.21b · 9.8, 9.16–9.22 · 11.19b (chứng minh) · 14.2, 14.3, 14.19b (gọi ẩn), 14.14 (số dư theo 3), 14.16 (suy luận Olympic).
- **Điểm so với bản đồ 5T:** 14 chuyên đề của sách khớp 5 chủ đề · 160 dạng hiện có (đã dựng từ TLTK + chính sách này ngày 13/11). Chưa có chỗ cho nhóm bài suy luận / trò chơi / bất biến (BT 14.13–14.16) và ma phương, bảng số quy luật (BT 14.3) — để người gán xem khi nhập; đề xuất thêm nhóm khi gán thử ra ≥ 5 câu không vào dạng nào.

### Công cụ riêng

- `scripts/kho/so-do-doan-thang.mjs` — như 4T. Giá trị hàng = phan × gia_tri_phan + them − bot; `tong` = tổng các hàng; `hieu` = chênh lệch hai hàng đầu; số thập phân trong nhãn dùng dấu phẩy. Mẫu: `kho-rules/dai/so-do/5T-LT-6-8.json`, `5T-LT-7-5.json` (hai hiệu số), `5T-LT-13-24.json` (dịch dấu phẩy), `5T-ON-22.json` (thêm chữ số).
- `scripts/kho/so-do-chuyen-dong.mjs` (`"loai": "chuyen_dong"`): `diem` (tên, `x` = vị trí THẬT, `ghi`) · `di` (mũi tên + vận tốc) · `khoang` (nhãn bắt đầu bằng số phải bằng |den − tu|; nhãn có "?" / chữ thì không kiểm) · `vat` (cầu / đoàn tàu, `kieu`: `tau`/`cau`). Mẫu: `5T-LT-26-4.json`, `5T-LT-26-14.json`, `5T-LT-29-7.json`, nhiều sơ đồ `5T-LT-26-12.json`.
- `scripts/kho/mathtype-thu/wmf-mtef.mjs "<docx>" "<txt>" --ra goc-tex.txt` — bóc MTEF trong ảnh WMF ra LaTeX.
- `scripts/kho/sach/tach-bai.mjs goc-tex.txt --sach "Toán 5 TLTK" --ra bai.json` — tách bài.
- `kho-rules/dai/lo/k5T-kiem.mjs` (+ `k5T-kiem-lo5…lo11.mjs`) — kiểm đáp số tính từ đề. `scripts/kho/sach/kiem-p1-card.mjs` — kiểm card Phần 1.
- `scripts/kho/sach/gan-bdm-nhom.mjs <tệp> [--ghi]` — gán bản đồ mới (cao ⇒ gán; vừa ⇒ `dai_bdm_de_xuat`; không dạng ⇒ `dai_bdm_cau_thieu_dang`).
- `scripts/kho/clone/k5T-pt-sinh.mjs` → `k5T-pt-kiem.mjs` → `k5T-pt-ghi.mjs` — sinh / kiểm / ghi câu phần trăm theo mẫu.
- Hình đề: `kho-rules/dai/hinh-de/dung-hinh-de.ps1` + manifest `kho-rules/dai/hinh-de/5T.json`.
- `kho-rules/dai/lo/k5T-card-3-6.json` — bản Phần 1 hiện hành của 836 câu sách (Phần 1 trong `lo/k5T-lo*.json` cũ hơn, không ghi ngược lại).

---
- CLC6: `scripts/kho/mathtype-thu/doc-docx.mjs` · `scripts/kho/de-thi/tach-clc6.mjs` · `scripts/kho/de-thi/dau-vao-clc6.mjs`. `ghi-lo.mjs` của sách chưa nhận `lua_chon` (TN) — mở rộng trước khi ghi TN.


## Khối 6

### Phạm vi kiến thức

- **SGK chuẩn: Kết nối tri thức (KNTT) Toán 6, Tập 1.** Lời giải viết như học sinh lớp 6 viết vào bài kiểm tra, ký hiệu theo SGK, đúng cách trình bày của lý thuyết + "Hướng dẫn giải" trên bản đồ mới K6 (`dai_bdm_nhom.ly_thuyet`) [09/10 · Thùy].
- **Kho K6 cũ (câu duyệt trước 10/2026) KHÔNG còn là nguồn** — có rác đã duyệt (đặt ẩn $N_0$, câu "Xin lỗi, có sự nhầm lẫn"). Ứng viên cũ "đã duyệt" phải kiểm lại từ đầu.
- Whitelist = lý thuyết trên bản đồ K6 của mọi nhóm thuộc phạm vi kì + toàn bộ tiểu học. Cái không có trong lý thuyết bản đồ thì không trích như quy tắc; cần ⇒ tự lập luận trong lời giải; không làm được ⇒ `**Chưa chắc:**`.
- Thứ tự chương KNTT 6 Tập 1: Ch I Tập hợp các số tự nhiên · Ch II Tính chia hết (số nguyên tố, ƯC–BC, ƯCLN–BCNN) · Ch III Số nguyên (Bài 13–17) · Ch IV Một số hình phẳng trong thực tiễn (Bài 18–20) · Ch V Tính đối xứng của hình phẳng (Bài 21–22).
- **Giữa kì I**: Ch I–II + hình trực quan Ch IV (tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi, hình bình hành, hình thang cân; chu vi, diện tích). Không số nguyên âm (Ch III) trừ khi đề cương ghi rõ; không phân số / số thập phân ngoài phần tiểu học.
- **Cuối kì I**: Ch I–V + toàn bộ tiểu học (phân số của một số, tỉ số phần trăm). Bản đồ mới đã có lý thuyết Số nguyên, Nhận biết một số hình phẳng, Tính chất đối xứng (13/11) ⇒ trình bày theo đó; phần bản đồ chưa có (chu vi – diện tích hình phẳng…) theo SGK.
- **Giữa kì II**: xem mục **"Giữa kì II (dự thảo lô mẫu 21/11 — chờ Thùy duyệt)"** ngay dưới Phân kho. **Cuối kì II**: chưa có luật — lô mẫu của ô đó sẽ rút.
- **Thi vào lớp 6 (bộ CLC)**: thuộc **Khối 5T** (Thùy 15/11), không làm ở Khối 6.
- **CẤM ở mọi mốc HK1**: chuyển vế đổi dấu · giá trị tuyệt đối (cấm hẳn) · phân số âm và phép tính phân số Ch VI, số thập phân âm · $(a^m)^n$, $(ab)^n$ như quy tắc có sẵn · dấu hiệu chia hết cho 4, 8, 11, 25 (chỉ 2, 5, 3, 9) · $\text{ƯCLN}(a,b).\text{BCNN}(a,b)=a.b$ và thuật toán Euclid như quy tắc · hằng đẳng thức · đồng dư · $\dfrac{n(n+1)}{2}$ dùng như đã biết · số đo góc, đoạn thẳng – trung điểm (Ch VIII) · "tập nghiệm", "phương trình", phương trình bậc hai, Viète.

### Phân kho

- Số học, số nguyên, toán thực tế về số ⇒ `dai_cau_hoi`, `kho=dai`.
- **Câu hình K6 (cả trong đề thi, đề cương) ⇒ `hinh_hoc`** (CTO phân xử 15/11; bỏ luật cũ "Hình K6 vào hgt"). Cổng `--khoi 6` chưa nhận `hinh_hoc` ⇒ báo điều phối (nợ code), không tự đổi sang `hgt`.
- K6 không có Hình giải tích.

### Giữa kì II (dự thảo lô mẫu 21/11 — chờ Thùy duyệt)

> Lô mẫu của ô (K6 × giữa kì II) rút từ 20 đề thi + 13 đề cương GKII toanmath (Hà Nội, 2024–2026). Mỗi chỗ người duyệt sửa ⇒ một dòng luật ở đây (§C3).

- **Phạm vi = SGK KNTT Toán 6 Tập 2, đến hết trung điểm + xác suất thực nghiệm** (đo trên 33 đề GKII): **Ch VI Phân số** (mở rộng phân số, hai phân số bằng nhau, tính chất cơ bản – rút gọn – quy đồng – so sánh, cộng trừ nhân chia phân số, hỗn số, giá trị phân số của một số, tìm một số biết giá trị phân số của nó) · **Ch VII Số thập phân** (số thập phân, so sánh, cộng trừ nhân chia, làm tròn, tỉ số – tỉ số phần trăm, bài toán về tỉ số phần trăm) · **Ch VIII (đến Bài 37)** điểm – đường thẳng, 3 điểm thẳng hàng, điểm nằm giữa, tia, hai tia đối nhau, đoạn thẳng, độ dài, trung điểm · **Ch IX** thu thập – phân loại dữ liệu, bảng thống kê, biểu đồ tranh, biểu đồ cột (kép), kết quả có thể, xác suất thực nghiệm. Tập 1 (Ch I–V) và tiểu học là nền, dùng được.
- **Góc, số đo góc, đo – vẽ góc: NGOÀI mốc giữa kì II** (chỉ 1/33 đề nhắc). Đề có câu về góc ⇒ vẫn nhập, giải theo SGK Tập 2, `**Chưa chắc:**` nêu "kiến thức góc, có thể ngoài mốc GKII".
- **Mở khoá so với HK1** (cho riêng GKII): phân số (kể cả tử/mẫu âm), số thập phân, đoạn thẳng – trung điểm. **Vẫn CẤM**: chuyển vế đổi dấu, giá trị tuyệt đối, hằng đẳng thức, tập nghiệm / phương trình, và mọi quy tắc ngoài SGK Tập 1–2 (số thập phân âm chỉ dùng đúng phạm vi phép tính Ch VII).
- **Bản đồ dạng K6 hiện chỉ phủ Tập 1 (Ch I–V + đối xứng)** ⇒ câu thuộc 4 chủ đề Tập 2 (Phân số · Số thập phân · Hình cơ bản Ch VIII · Dữ liệu và xác suất): `dang=—` `chac=—`, lý do mở đầu `THIẾU DẠNG: <tên nên có>` (cùng quy ước K7/K8-GKII); **không ép vào dạng Tập 1, không tự bịa mã, không tự thêm dạng vào bản đồ** — điều phối gom các `THIẾU DẠNG` thành đề xuất cho trưởng khối K6. Câu Hình Ch VIII chưa có bài ⇒ bài chờ `HH06000000`. Câu thuộc phần Tập 1 (tìm $x$, luỹ thừa, chia hết, ƯCLN…) phân dạng bình thường theo bản đồ hiện có.
- **Phân kho**: Ch VIII (điểm, đường thẳng, tia, đoạn thẳng, trung điểm) ⇒ `kho=hinh_hoc`; phân số, số thập phân, tỉ số %, thống kê, xác suất thực nghiệm, toán thực tế ⇒ `kho=dai`.
- **Trình bày phần Đại Tập 2**: phân số `\dfrac{a}{b}`, hỗn số `2\dfrac{1}{3}` (đổi hỗn số ⇒ phân số một dòng riêng) · thập phân dấu phẩy viết `2{,}5` · nhân có số thập phân viết dấu chấm CÁCH hai bên: `$2{,}5 . 4$` (phân biệt với dấu phẩy) · chia `:` · `$25\%$` · quy tắc ghi ở Phần 1: "Muốn cộng hai phân số khác mẫu, ta quy đồng mẫu rồi cộng các tử…", "Muốn tìm giá trị phân số $\dfrac{m}{n}$ của số $a$ ta tính $a.\dfrac{m}{n}$", "Muốn tìm một số biết $\dfrac{m}{n}$ của nó bằng $b$ ta tính $b:\dfrac{m}{n}$". Tính hợp lí: đưa phân số về cùng mẫu / đặt thừa số chung / nhóm cặp có tổng nguyên; dãy $\dfrac{k}{a(a+k)}$ cho phép tách $\dfrac{1}{a}-\dfrac{1}{a+k}$ (SGK Tập 2 có bài tương tự; đề nâng cao có thì giải tự lập luận).
- **Hình Ch VIII**: dùng đúng thuật ngữ SGK ("điểm $M$ nằm giữa hai điểm $A$ và $B$", "$M$ là trung điểm của $AB$ ⇒ $MA=MB=\dfrac{AB}{2}$"; "hai tia đối nhau"; "ba điểm thẳng hàng"). Đoạn thẳng: cộng độ dài khi điểm nằm giữa $AM+MB=AB$; trung điểm: chứng minh đủ 2 điều kiện (nằm giữa + cách đều). Bài đếm đoạn thẳng / đường thẳng từ $n$ điểm: liệt kê hoặc công thức $\dfrac{n(n-1)}{2}$ chỉ sau khi tự suy ra bằng ghép cặp.
- **Xác suất thực nghiệm**: công thức SGK = (số lần sự kiện xảy ra) : (tổng số lần thực hiện); viết `$\dfrac{14}{30}=\dfrac{7}{15}$`, kết quả có thể viết tập hợp `$\{S; N\}$`; không dùng xác suất lí thuyết (lớp 7+). Biểu đồ / bảng đọc từ ảnh: ghi `Đọc hình: <các giá trị đọc được>`; giá trị không đọc chắc ⇒ `**Chưa chắc:**`.
- **Quy ước ghi lô mẫu K6-GKII (rút từ 7 trạm soạn B081 21/11)**: (1) câu Hình Ch VIII: `dang=—` `chac=—` — KHÔNG ghi mã `HH06000000` vào `dang=` (ghi.mjs tự đưa vào bài chờ); (2) lí do `THIẾU DẠNG: <tên nên có>` viết ngay dòng ĐẦU của `**Ghi chú:**` của câu đó (và gom bảng cuối tệp ở `## GHI CHÚ CHO NGƯỜI DUYỆT`); (3) đáp số là phân số / hỗn số / nhiều giá trị ⇒ `loai=tu_luan`, `dap_an=$\dfrac{a}{b}$`; chỉ số nguyên hoặc thập phân vừa 4 ô ⇒ `tra_loi_ngan`; (4) phần "hệ T" viết tiếng Việt có nội dung Toán thì NHẬP (chỉ bỏ phần tiếng Anh); (5) đề thiếu điều kiện / mơ hồ ⇒ giải theo cách hiểu thông dụng + `**Chưa chắc:**`; (6) đề in thiếu nhãn (a, b, d) ⇒ giữ nhãn bản in + `**Ghi chú:**`; (7) hai câu dùng chung một hình ⇒ cùng trỏ MỘT tệp ảnh nếu cổng cho phép, không thì nhân bản và ghi `**Ghi chú:**`.
- **Đề nhiều mã** (Mai Dịch ĐỀ 1/2, Phúc Đồng 601/602, Việt Hưng ĐỀ 01/02/dự bị): chỉ nhập mã đầu khi hai mã trùng ≥ 70% (so bằng máy sau chuẩn hoá, bỏ số; luật Theo loại nguồn); ghi vào `bo.md` mã bỏ + lí do + tỉ lệ trùng. Gia Quất T601 / dự phòng đo thật 21–41% (Opus 21/11) ⇒ dưới ngưỡng, nhập đủ cả hai.

### Đại

**(a) Công cụ được phép**
- Tìm $x$ = **tìm thành phần chưa biết** (số hạng = tổng − số hạng kia; số bị trừ = hiệu + số trừ; số trừ = số bị trừ − hiệu; tương tự nhân chia); cô lập $x$: cộng trừ trước, nhân chia sau; coi cả cụm ngoặc / cụm $(x\pm c)^n$ là một thành phần. Phần số nguyên, thật cần thì được cộng / trừ hai vế cùng một số.
- Luỹ thừa: $a^m.a^n=a^{m+n}$, $a^m:a^n=a^{m-n}$, $a^0=1$. $(a^m)^n$ không là quy tắc ⇒ viết ra tích: $(x^{54})^2=x^{54}.x^{54}=x^{108}$ / đổi ra số / đưa về cùng cơ số bằng phép tính.
- Dấu hiệu chia hết: chỉ 2, 5, 3, 9. Tính chất chia hết của tổng / hiệu (chú ý: tổng chia hết không suy ra từng số chia hết).
- Tổng dãy cách đều: tự suy ra bằng ghép cặp rồi mới dùng; số số hạng = (cuối − đầu) : khoảng cách + 1.
- Bài nâng cao: phân phối, gom nhóm, ghép cặp, "nhân hai vế rồi trừ", chia hết của tổng / hiệu, số dư khi chia 2 / 3, **số chính phương chia 3 dư 0 hoặc 1**.
- Số nguyên (từ cuối kì I): số đối, trục số, so sánh, cộng / trừ / nhân / chia hết, quy tắc dấu ngoặc, giao hoán – kết hợp – phân phối, luỹ thừa mũ tự nhiên (cơ số âm: mũ chẵn dương, mũ lẻ âm, viết rõ ngoặc), ước / bội số nguyên, tích bằng 0. Số âm trong phép tính viết trong ngoặc `$(-4)$`, `$5+(-3)$`.
- **Chia hết xét trong $\mathbb{Z}$, dùng ƯỚC NGUYÊN** [13/11 · Thùy; CTO phân xử 15/11]: "tìm $n$ để biểu thức chứa $n$ chia hết cho biểu thức chứa $n$": số chia bằng $-1$ (vd $n-1=-1$ khi $n=0$) vẫn nhận ⇒ **nhận $n=0$**; số bị chia âm cũng nhận. Liệt kê đủ ước nguyên rồi lọc theo điều kiện $n$. Không treo `**Chưa chắc:**` cho chuyện này.
- 0 và 1 không là số nguyên tố, không là hợp số. $\mathbb{N}$ có 0, $\mathbb{N}^*$ không. B(a) có 0; BCNN là số nhỏ nhất **khác 0**.

**(b) Trình bày riêng**
- Phần 1 dùng đúng phần "Dấu hiệu" / "Phương pháp" của lý thuyết nhóm; `**Chú ý:**` lấy từ `##CY` của nhóm khi có. Phần 1 không có đoạn "Thử lại" (hay lộ đáp số) [20/10].
- Phần 2 theo khuôn "Hướng dẫn giải" của nhóm. Bài Tìm $x$ / thực tế kết bằng "Vậy …". Trắc nghiệm: giải ra kết quả rồi đối chiếu, loại phương án bằng LÍ DO, không "thử đáp án"; câu "tìm khẳng định SAI" ⇒ nêu vì sao từng phương án đúng / sai; dòng cuối `Chọn B.` [09/10].
- **Khuôn Phần 2 theo nhóm (bản đồ K6)**:

| Nhóm (mã) | Khuôn Phần 2 | Phần 1 nêu |
|---|---|---|
| Phần tử – tập hợp `NNB00889` | `$5\in A$` · `$10\notin A$` | $\in$ / $\notin$ |
| Mô tả tập hợp `NNB00890` | `$A=\{0; 1; 2; 3; 4; 5\}$` · `$A=\{x\in\mathbb{N}\mid x<6\}$` | mỗi phần tử 1 lần (tập chữ cái: bỏ chữ trùng) |
| Số La Mã `NNB00891` | `Số La Mã X có giá trị là 10. Số La Mã II có giá trị là 2. Do đó, số La Mã XII đọc là 12.` | I=1, V=5, X=10; IV, IX |
| Tính toán số TN `NNB00892` | 1 dòng `$936-54=882$` | — |
| Tính thuận tiện `NNB00893` | chép biểu thức → `$=(25.4).73$` → `$=100.73$` → `$=7300$`; đặt thừa số chung `$=37.(64+36)$`; có tên: `$A=(123+877)+(456+544)$` | chỉ cộng ⇒ gom cặp đuôi tròn; cộng–trừ xen ⇒ gom xen kẽ; toàn nhân ⇒ cặp $2.5$, $4.25$, $8.125$; có số chung ⇒ đặt thừa số chung. Chú ý $a.b+a=a.b+a.1$ |
| Tìm $x$ cộng trừ `NNB00894` | `$x+15=40$` → `$x=40-15$` → `$x=25$` | quy tắc thành phần |
| Tìm $x$ nhân chia `NNB00895` | `$2x-120=122$` → `$2x=122+120$` → `$2x=242$` → `$x=242:2$` → `$x=121$` | cụm chứa $x$ đang là thành phần gì |
| Thực tế 4 phép tính `NNB00896` | `Số tiền … là:` → `$125000.3+50000.1+25000.7=600000$ (đồng)` | đọc "nhiều hơn", "gấp" |
| Biểu thức luỹ thừa `NNB00897` | chép biểu thức → `$=4.9-75:25$` → `$=36-3$` → `$=33$` | luỹ thừa → nhân chia trái sang phải → cộng trừ |
| Thuận tiện luỹ thừa `NNB00898` | `$=4^2.(62+38)$` → `$=4^2.100$` → `$=16.100$` → `$=1600$`; thừa số chung ẩn: đổi $2^4$, $4^2$ về $16$ trước | tìm luỹ thừa giống / bằng nhau |
| Tìm $x$ luỹ thừa `NNB00899` | `$x^3=27$` → `$x^3=3^3$` → `$x=3$` · `$5^{2x-1}=5^3$` → `$2x-1=3$` → … | $x$ ở cơ số / ở số mũ / cụm $(x\pm c)^n$; kiểm $x\in\mathbb{N}$, thử lại. Lý thuyết nhóm còn chữ "chuyển vế" — không theo |
| Biểu thức chứa ngoặc `NNB00900` | mỗi dòng phá MỘT tầng ngoặc từ trong ra | $(\,)\to[\,]\to\{\,\}$ |
| Tìm $x$ chứa ngoặc `NNB00901` | `$6.(x+1)-5=49$` → `$6.(x+1)=49+5$` → `$6.(x+1)=54$` → `$x+1=54:6$` → `$x+1=9$` → `$x=9-1$` → `$x=8$` | tính luỹ thừa vế phải trước |
| Dãy luỹ thừa cùng cơ số `NNB00902` | `Ta có $2A=2.(1+2+\dots+2^{50})=2+2^2+\dots+2^{51}$` → `Suy ra $2A-A=(\dots)-(\dots)$` → `$A=2^{51}-1$` | nhân với cơ số rồi trừ |
| Ước / bội `NNB00904` | `$\text{Ư}(6)=\{1;2;3;6\}$` · `$\text{B}(5)=\{0;5;10;15;20;\dots\}$`; có điều kiện: `Vì $31\le x\le 100$ nên $x\in\{34;51;68;85\}$.` | ước: chia lần lượt 1, 2, 3…; bội: nhân 0, 1, 2… |
| Chia hết của tổng, hiệu `NNB00905` | `Vì $21\vdots 3$, $36\vdots 3$ nên để $A\not\vdots 3$ thì $x\not\vdots 3$.` | tính chất 1, 2 + chú ý |
| Dấu hiệu 2, 5 / 3, 9 `NNB00906–907` | `Vì $\overline{4x12y}$ chia hết cho 2 và 5 nên $y=0$.` → `$\overline{4x120}\vdots 9$ khi $(4+x+1+2+0)\vdots 9$` → `Suy ra $x=2$. Vậy …` | chốt tận cùng bằng 2, 5 trước; rồi tổng chữ số; $0\le x\le 9$ |
| Số nguyên tố `NNB00908` | `Các số nguyên tố là: $2; 5; 23; 41; 47$.` | — |
| Phân tích TSNT `NNB00909` | `$60:2=30$` … `$5:5=1$` → `$\Rightarrow 60=2^2.3.5$` | thừa số tăng dần, gom luỹ thừa |
| $an+b\vdots cn+d$ `NNB00911` | `$x+2=(x-1)+3$` → `Vì … nên $3\vdots(x-1)$` → `$\Rightarrow x-1\in\text{Ư}(3)=\{-3;-1;1;3\}$` → lọc theo điều kiện → `Vậy …` | tách thành bội của số chia + số; hệ số không chia hết ⇒ nhân trước, cuối thử lại; ước NGUYÊN (mục (a)) |
| $ax+by\vdots m$ `NNB00912` | nhân rồi cộng / trừ ra bội của $m$, mỗi bước `Suy ra` / `$\Rightarrow$` | tìm hệ số ghép thành $m(\dots)$ |
| Dãy luỹ thừa chia hết `NNB00913` | `$A=(2+2^2)+(2^3+2^4)+\dots$` → `$A=2.(1+2)+2^3.(1+2)+\dots$` → `$A=3.(2+2^3+\dots)$` → `Suy ra $A$ chia hết cho 3.` | nhóm 2 hay 3; **đếm số số hạng** để nhóm vừa đủ, thừa thì để số hạng đầu riêng |
| Nguyên tố cùng nhau `NNB00916–918` | `Gọi $d=(2n+3,n+1)$.` → `$\begin{cases}\dots\vdots d\\\dots\vdots d\end{cases}$` → `$\Rightarrow 1\vdots d$` → `$\Rightarrow d=1$.` → `Vậy …` | nhân cho hệ số $n$ bằng nhau rồi trừ |
| ƯC `NNB00919` | `$\text{Ư}(16)=\{\dots\}$` → `$\text{Ư}(24)=\{\dots\}$` → `$\text{ƯC}(16;24)=\{1;2;4;8\}$` | — |
| ƯCLN `NNB00920` | `$48=2^4.3$; $60=2^2.3.5$` → `$\text{ƯCLN}(48;60)=2^2.3=12$` | chung, mũ nhỏ nhất |
| Thực tế ƯC/ƯCLN `NNB00921` | `Gọi số phần quà nhiều nhất là $x$ (phần) ($x\in\mathbb{N}^*$, $x<24$)` → `Vì … nên $x\in\text{ƯC}(36, 48, 24)$ mà $x$ lớn nhất nên $x=\text{ƯCLN}(36, 48, 24)$.` → phân tích mỗi số một dòng → `Suy ra $\text{ƯCLN}(\dots)=2^2.3=12$ hay $x=12$` → dòng tính phụ → `Vậy …` | "chia đều" ⇒ ƯC; "nhiều nhất" ⇒ ƯCLN; không hỏi lớn nhất ⇒ ƯC = ước của ƯCLN rồi lọc |
| Tìm $x$ theo ƯCLN `NNB00922` | như NNB00921, không lời văn | ƯC = tập ước của ƯCLN |
| BC / BCNN `NNB00923–924` | `$120=2^3.3.5$; $36=2^2.3^2$` → `$\text{BCNN}(120,36)=2^3.3^2.5=360$` | chung và riêng, mũ lớn nhất |
| Thực tế BC/BCNN `NNB00925` | gọi ẩn + điều kiện → `$x\in\text{BC}(a,b,c)$` → BCNN → `$\text{BC}=\text{B}(\dots)=\{0;\dots\}$` → lọc khoảng → `Vậy …` | "xếp hàng vừa đủ" ⇒ BC; "ít nhất" ⇒ BCNN; "thừa / thiếu $r$" ⇒ $x\mp r\in\text{BC}$ |
| Tìm $x$ theo BCNN `NNB00926` | `Vì $n\vdots 7$, $n\vdots 8$, $n\vdots 12$ nên $n\in\text{BC}(7,8,12)$.` → BCNN → `$\text{BC}(7,8,12)=\text{B}(168)=\{0;168;336;504;\dots\}$` → `Vì $100<n<400$ nên $n\in\{168;336\}$.` | — |

- **Định dạng** [09/10]: **dấu nhân = dấu chấm như SGK** (`$25.4$`, `$2^2.3.5$`, `$6.(x+1)$`, `$(-3).5$`; trước chữ viết liền `$2x$`). CẤM `\cdot`, `\times` (bản đồ còn chỗ `\cdot`/`\times` — chuẩn hoá về `.` khi chép khuôn). `.` giữa hai số là phép nhân; thập phân dùng `,`. Chữ tiếng Việt trong công thức bọc `\text{…}`. Dấu chấm kết câu để ngoài công thức. Đơn vị `$cm^2$`, `(m)`.
- Ký hiệu SGK: `\text{Ư}(a)`, `\text{B}(a)`, `\text{ƯC}`, `\text{ƯCLN}`, `\text{BC}`, `\text{BCNN}` (bản đồ có chỗ gõ `U`, `UC` — chuẩn về chữ Ư) · `\vdots` / `\not\vdots` · `\in` / `\notin` · `\mathbb{N}`, `\mathbb{N}^*`, `\mathbb{Z}` · `\overline{abc}` · `\Rightarrow` · tháp luỹ thừa `a^{b^{c}}`.
- **Tách ý** (cụ thể hoá §A7, §A7): chỉ bài "Thực hiện phép tính / Tính" và "Tìm $x$" — nhãn `Bài 1a`, `Bài 1b`…; đề của câu = lời dẫn + biểu thức của ý. Bài lời văn, hình, tập hợp, chia hết, chứng minh giữ một câu. Ngoại lệ: "Bài" chỉ là vỏ gom 2 BÀI TOÁN khác hẳn (đánh số 1) 2), mỗi bài một bộ dữ kiện) ⇒ mỗi bài một câu `Bài 5.1`, `Bài 5.2`; bài cho chọn 1 trong 2 ⇒ nhập cả hai.
- **Loại câu**: `trac_nghiem` đủ 4 phương án, `dap_an` một chữ cái · `tra_loi_ngan` CHỈ khi đáp số là MỘT số vừa 4 ô (§A10) theo đúng đơn vị đề hỏi (5 chữ số trở lên, tập hợp, nhiều đáp số, biểu thức, phải tự đổi đơn vị mới vừa ⇒ không); `dap_an` chỉ ghi số ($x=5$ ⇒ `5`) · còn lại `tu_luan`, `dap_an=—`.
- **Đúng/Sai nhiều mệnh đề** ⇒ `tu_luan`, đề đủ a) b) c) d), Phần 1 nêu cách kiểm, Phần 2 `a) Đúng.` / `b) Sai.` kèm lí do (tính ra số / phản ví dụ), `**Ghi chú:** câu Đúng/Sai nhập dạng tự luận`.
- Nhãn câu giữ cách đánh số của đề, duy nhất trong tệp.

**(c) Sai lầm cần tránh**
- [09/10] Tìm $x$ viết "chuyển vế, đổi dấu" / dùng ngầm hằng đẳng thức để "ra đẹp" ⇒ tìm thành phần chưa biết.
- [10/10 · Thùy] số nguyên tố $p>3$: $p^2$ chia 3 dư 1 ⇒ dùng tính chất số chính phương chia 3 dư 0 hoặc 1, không khai triển $3k\pm1$.
- [10/10 · Thùy] chia hết cho tích hai số nguyên tố cùng nhau ⇒ chia hết từng số rồi kết luận qua $\text{ƯCLN}=1$ (không viết $8.a$ rồi suy ra $a\vdots 3$); chia hết cho 8 = tích hai số chẵn liên tiếp; $p$ nguyên tố chia 3 dư 1 hoặc 2 ⇒ $p-1$ hoặc $p+1$ chia hết cho 3.
- [10/10] viết sai quy tắc cộng hai số nguyên khác dấu ở Phần 1 ⇒ trạm kiểm soát kĩ quy tắc dấu.
- [10/10] thuật ngữ phải đúng SGK ("phần số tự nhiên"); chép đề không thêm dấu cách vào số, không tự thêm đơn vị.
- [10/10] đọc "không chia hết" thành "chia hết" trên ảnh 150 dpi (lật đáp án Đ/S) ⇒ ký hiệu chia hết ở bất kì đâu phóng to 400 dpi. Số mũ nhỏ, dấu âm, gạch ngang $\overline{abc}$, ngoặc, `⊂ ∈ ∉ ≠ ≤ ≥`, `{ }` không chắc ⇒ phóng to. Lớp chữ PDF mất số mũ (`25.23 : 28` = $2^5.2^3:2^8$) ⇒ lấy từ ẢNH.
- [11/10] dấu `:` trong đề cương: ở bài tập hợp / chia hết là chia hết (gõ `\vdots`); ở bài Tính / Tìm $x$ là phép chia.
- [20/10] kiến thức lớp sau lọt vào (số đo góc, "tập nghiệm", "phương trình", cạnh đối bằng nhau làm dấu hiệu) ⇒ cấm.
- [14/10] bài thực tế có dữ kiện thừa / thiếu: trừ / cộng phần dư TRƯỚC khi lấy ƯC / BC, số tìm được phải lớn hơn số dư. "Số nhỏ nhất chia $a$ dư $m$, chia $b$ dư $n$": kiểm cách đưa về BCNN và số dư < số chia. "Tìm $x$ thoả ƯC / BC": kiểm khoảng và tập đủ.
- [14/10] lý thuyết hay thiếu điều kiện "khác 0", "lớn nhất / nhỏ nhất", $n\in\mathbb{N}^*$, số dư < số chia; nhầm ƯCLN ↔ BCNN, "chia hết" ↔ "chia dư".
- [10/10 · Thùy] mốc "năm nay" = năm hiện hành, ghi hẳn năm vào đề ("2021 là 25 tuổi thì giờ 2026 là 30 tuổi"); bài đếm que / thanh ghép hình phải tính thanh dùng chung; đề "lừa" bằng số nguyên khi HS đã học số nguyên thì không phải đề sai.

### Hình

**(a) Công cụ được phép**
- Hình K6 = hình trực quan Ch IV + tính đối xứng Ch V: nhận biết hình, cạnh / góc / đường chéo, chu vi, diện tích (công thức tiểu học + SGK Ch IV), vẽ bằng thước và êke, trục / tâm đối xứng. Có lý thuyết bản đồ (13/11) thì theo đó.
- [20/10] Hình thoi chỉ dùng "hai đường chéo vuông góc" (SGK Bài 19 không nêu "chia đôi nhau"). Vẽ hình bình hành bằng "đường thẳng tuỳ ý qua F + hai đường song song", không thước đo góc. Không dùng "cạnh đối bằng nhau" làm dấu hiệu nhận biết. Cấm số đo góc.
- [13/11] "Tâm đối xứng của đoạn thẳng": SGK 6 Tập 1 chưa có "trung điểm" (Ch VIII) ⇒ giải bằng "gấp đôi / quay nửa vòng", `**Chưa chắc:**`.

**(b) Trình bày riêng**
- Lời giải Hình K6 là hình trực quan: Phần 1 như §A5 (không dùng Sơ đồ tư duy trừ câu có ý chứng minh). Dấu nhân dấu chấm như Đại.
- Câu đề có hình ⇒ dòng `**Hình:** <tệp>` (nhiều hình nhỏ a) b) c) d) của cùng câu ⇒ một ảnh chung) + ghi chú `Đọc hình: <độ dài, số đo, ký hiệu bằng nhau, vuông góc, song song, tên điểm>`.
- Bài yêu cầu VẼ ⇒ vẫn nhập, lời giải tả từng bước vẽ bằng thước và êke, `**Ghi chú:** lời giải chưa có hình vẽ`.
- **Hình giải** (bài không có hình sẵn mà cần hình để giải): `**Hình giải:** giai_<nhãn>.png`, một tệp / bài, đủ mọi điểm. Câu chỉ hỏi "hình gì / diện tích / chu vi" với số đã cho ⇒ không bắt buộc hình giải.

**(c) Sai lầm cần tránh**
- [10/10] hình cắt dính chữ câu khác / cụt; hình scan méo ⇒ vẽ lại bằng code (§A8 mã b, e).
- [20/10] dùng số đo góc, "đường chéo chia đôi nhau" của hình thoi, "cạnh đối bằng nhau" làm dấu hiệu ⇒ ngoài SGK 6 Tập 1, cấm.

### Theo loại nguồn

**Đề thi (GKI / CKI các trường; toanmath)**
- Bỏ phần riêng tiếng Anh ("Hệ T", Exercise…); phần riêng "hệ chuẩn / hệ A" vẫn làm. Bỏ ma trận / bản đặc tả, hướng dẫn chấm, trang trắng, quảng cáo — chỉ trang ĐỀ là đề.
- **Đề nhiều mã (601/602/603 chỉ đổi số) chỉ nhập mã đầu tiên** [09/10, 13/11 · Thùy]. Cặp đề cùng trường cùng năm trùng ≥ 70% câu (so sau chuẩn hoá, bỏ số) ⇒ một mã; dưới ngưỡng ("Đề số 1/2/3" khác nội dung) ⇒ nhập đủ.
- `bo_sach` = `KNTT` / `Cánh Diều` / `CTST` (đề không ghi ⇒ `KNTT`). Tên đề: `Đề kiểm tra <giữa|cuối> học kì 1 Toán 6 năm <năm học> — <trường/đơn vị> (<mã đề nếu có>)`; `nam` = năm đầu năm học.
- Đề gốc mơ hồ / thừa ⇒ sửa đề cho rõ rồi nhập + `**Ghi chú:**`; bài chưa rõ mốc thời gian / giả thiết ⇒ ghi hẳn năm / giả thiết vào đề [10/10 · Thùy]. Biến lệch ("Cho $x\in\mathbb{N}^*$" mà biểu thức theo $n$) ⇒ sửa tối thiểu + `**Ghi chú:**`.

**Đề cương**
- `kieu: de_cuong`; không có đáp án ⇒ như đề thi không đáp án.
- **Gõ đề**: ĐỦ và ĐÚNG từng chữ, số, số mũ, ngoặc, ký hiệu — không tóm tắt, không chữa, không giải. Có trạm đối chiếu ảnh **trước** khi soạn (người gõ ≠ người đối chiếu).
- Tách ý theo §A7 (§A7): số ý lớn (a…m) cùng lệnh "Tính" vẫn tách từng ý; mọi bài khác giữ một câu.
- Đề cương in `:` cho chia hết ⇒ nhập `\vdots` + `**Ghi chú:** Đề cương in dấu ":" cho phép chia hết — đã nhập thành $\vdots$.`
- "Điền vào chỗ trống" không có A–D ⇒ gõ `…` đúng như đề; loại câu theo luật 4 ô. Trắc nghiệm chỉ 2–3 phương án hay phương án là hình ⇒ giữ đúng như in, `**Ghi chú:**`, không bịa phương án.
- Ví dụ in sẵn lời giải mẫu ⇒ chỉ gõ phần ĐỀ, không chép lời giải mẫu; tự giải độc lập; lỗi trong lời giải mẫu ⇒ `**Ghi chú:**`.
- Chia trạm ≤ ~12 câu (đếm sau tách ý), bài liền nhau cùng trạm, bài nâng cao ở trạm ít câu.

**Bản đồ kiến thức K6 (lý thuyết nhóm · lý thuyết dạng · ví dụ dạng)**
- Lý thuyết NHÓM = kiến thức chung mọi dạng trong nhóm: `##ĐN`/`##ĐL` → `##TC` → `##PP` (mỗi dòng một bước, 3–6 bước, tự đánh số, không gõ "Bước 1") → `##CY`. Lý thuyết nhóm và dạng **KHÔNG chứa ví dụ** (Thùy 19/10; chốt lại 17/11 — `spec-ban-do-toan` §12 L5): nhóm chưa có dạng thì tạo 1 dạng bài để chứa ví dụ, không thêm `##VD` vào lý thuyết nhóm.
- Lý thuyết DẠNG [14/10 · Thùy] = phần riêng của dạng: quy tắc dùng + phương pháp 3–5 bước khớp cách giải trong ví dụ của chính dạng + dấu hiệu nhận biết + bẫy riêng (phân biệt dạng anh em). 1–4 khối, 3–8 dòng (nâng cao ≤ ~15); không chép lại lý thuyết nhóm, không `##VD`.
- Ví dụ DẠNG: 2 ví dụ (dạng rất hẹp / nâng cao khó: 1–2); ví dụ 1 điển hình, ví dụ 2 khó hơn một nấc; số tính tay được; khuôn `##VD` → đề → `**Hướng dẫn giải:**` → lời giải theo khuôn nhóm → "Vậy …". Ví dụ đúng mô tả dạng. Dạng đã có ví dụ: không đè, chỉ bổ sung ví dụ KHÁC. Mỗi ví dụ kèm biểu thức kiểm độc lập trả `true` (BigInt, vét cạn).
- Phương pháp đúng cho MỌI đề thuộc dạng. Sách chỉ là tham khảo — viết lại theo khuôn K6, không chép nguyên văn dài. Nguồn: SGK KNTT 6 tập 1, sách phân dạng KNTT, sách Củng cố, tệp dạng bài `E:\BK ACADEMY\Kho dạng bài\K6\`. K6 được tự soạn lý thuyết / ví dụ theo các nguồn này.
- Mô tả dạng mâu thuẫn tên / không phân biệt được với anh em / ví dụ cũ sai dạng ⇒ ghi `ghi_chu` kèm mã.


### Công cụ riêng

- `node --input-type=module - 6 < scripts/kho/bdm-ly-thuyet.mjs` — đọc lý thuyết bản đồ mới (chỉ đọc).
- `scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp.soan.md> --lam-viec "<LV>" --khoi 6 --chi-kiem` — cổng (card · KaTeX · `Chọn X.` · 4 ô · dấu nhân chấm), sửa tới "✔ đạt cổng".
- `scripts/kho/de-thi/boc-pdf.mjs` → `quyet.mjs` → `ghi.mjs`; `cap-nhat-loi-giai.mjs` — sửa lời giải đề đã ghi; `kho-rules/dai/lo/k6-ghi-het.sh` — ghi tuần tự các đề đã đạt.
- `scripts/kho/sach/kiem-p1-card.mjs` (`kiemP1(phan1)` phải trả mảng rỗng) · `kho-rules/dai/lo/k6-kiem.mjs` — kiểm đáp số viết từ đề.
- `kho-rules/dai/lo/k6/de-cuong/dc-lib.mjs` + `<MA>.build.mjs` — dựng đề cương (kiểm KaTeX, `\cdot`, `\times`, chữ Việt ngoài `\text{}`, thiếu hình), sinh `de.json` + khung `.p<N>.soan.md`.
- `kho-rules/dai/lo/k6/ban-do-moi/kiem-goi.mjs "<goi>" "<out>"` — cổng lý thuyết / ví dụ bản đồ K6.
- `pdftoppm -r <150|260|300|400> -f <tr> -l <tr> -x -y -W -H -png [-singlefile] goc.pdf <ra>` — cắt hình / phóng to.
- Mẫu đã duyệt: `kho-rules/dai/lo/k6/GKI-01.soan.md` (giữa kì); `kho-rules/dai/lo/k6/CKI-*.soan.md` (cuối kì).
- JSON / LaTeX viết bằng `.mjs` với `String.raw` + `JSON.stringify` hoặc Write.

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
- **Hình–Luyện CÂY (`hinh_baitoan` · `hinh_cach_giai`) — chuỗi K7 Tam giác bằng nhau** [21/11 · Thùy chọn làm hình rồi lời giải; script mẫu `scripts/kho/hl-loi-giai-k7-tam-giac-v1.mjs`]:
  - Lời giải của cách mặc định = **Phần 2 thuần** (dòng ngắn + căn cứ, khuôn "Xét … có:"); cây chưa có chỗ lưu sơ đồ tư duy (§A6 chỉ có ở `hinh_hoc_cau_so_do`) và 402 lời giải cây hiện có đều ở dạng này.
  - Whitelist của chuỗi = whitelist K7 (a): c.c.c · c.g.c · g.c.g · (ch - gn) · (ch - cgv) · tam giác cân · trung trực CHỈ định nghĩa · các bài "ba điểm thẳng hàng" dùng ba phương pháp HH00170–172 (hai tia cùng là phân giác thì trùng · cộng góc kề bù + hai điểm khác phía · tiên đề Ơ-clit). Không dùng hình bình hành, đường trung bình, "phân giác = đường cao = trung tuyến" của tam giác cân.
  - **Bài nối bài ⇒ viện số hiển thị**: "(Bài 4)" = số **B…** của `fn_hl_so_hien_thi` (đọc từ DB lúc ghi, KHÔNG gõ tay). Số B đổi khi thêm / xoá bài ⇒ chạy lại script sau khi sửa dữ liệu. Nhóm bài viện đầu ra: "(Bài 1–3)", "(Bài 8 hoặc Bài 10)" cho hai kiểu.
  - Vị trí điểm đề không ghi (A nằm giữa B, F…) ⇒ ghi "(theo hình)" ngay trong dòng. Tia nằm giữa ⇒ nêu điểm khác phía; thẳng hàng bằng cộng góc ⇒ phải nêu hai điểm đầu mút khác phía đối với đường thẳng chung.
  - **Hình cho nút:** `scripts/anh/ve_hinh_k7_tam_giac_v2.mjs` (tra mã nút theo đường tên từ mô hình gốc, gắn `gan_hinh.mjs --bang mohinh`); hình cộng dồn giả thiết, không vẽ điều phải chứng minh (§A8).
  - **Kiểm bắt buộc:** script toạ độ riêng cho chuỗi (đủ 3 cạnh + 3 góc theo thứ tự đỉnh, song song, thẳng hàng, nằm giữa, cùng/khác phía, tia trùng) chạy ≥ 300 bộ số ngẫu nhiên mỗi mô hình, và **thử đảo một khẳng định cho nó bắt** để biết kiểm có cắn.
- Lời giải Hình 7 nhập 07–10/10 (HH00099–HH00104 lô đầu, HH00112) chưa có 2 phần — "khi nào hoàn thiện thì sửa một thể", không sửa lẻ [09/10 · Thùy].
- Mẫu lập luận: `HH00112` (23 câu Ôn tập Chương III), `HH00099–104`; mẫu CKI: `kho-rules/dai/lo/k7/CKI-02`, `CKI-11`, `CKI-19`.

**(c) Sai lầm cần tránh**
- [10/10] cộng góc không nêu tia nằm giữa; khẳng định không kèm lí do trong ngoặc ⇒ chưa đạt.
- [10/10] số đo trên hình vẽ nhỏ ⇒ phóng to trước khi chép; số liệu chỉ có trên hình mà không chép vào đề ⇒ sai luật "đề tự đủ dữ kiện".
- [27/10] dòng dài dày đặc ký hiệu ⇒ dòng ngắn (Hình chung).
- [21/11] giả thiết nút Hình–Luyện viết "Tia $DE$ cắt đường thẳng $AB$ tại $F$" nhưng hình có $D$ nằm giữa $E$ và $F$ ⇒ tia sai hướng (phải là tia $ED$ hoặc "giao điểm của đường thẳng $DE$ và $AB$"); lộ ra khi viết lời giải bằng toạ độ ⇒ **viết giả thiết bằng toạ độ hình trước, không theo trí nhớ của file nguồn**; đã sửa MH.285.
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

## Khối 8T

### Phạm vi kiến thức

- **Bốn quyết định khung** [10/10 · Thùy]:
  - [8T-1] "8T học nâng cao là chính — không cần quan tâm khối 8" ⇒ KHÔNG áp luật thứ tự bài của Khối 8; không chia mốc kì. Kho 8T không chung với khối 8 thường (lọc trùng không so với khối 8).
  - [8T-2] "8T được dùng full công cụ cao cấp — thể hiện rõ trong các cuốn sách rồi" ⇒ **chuẩn kiến thức 8T = chính các quyển sách nguồn — "sách dùng công cụ gì kho dùng nấy"** (CTO phân xử 15/11).
  - [8T-3] Chỉ nhập các cuốn có lời giải chi tiết (6 quyển; bỏ TUHOC). Bài có lời giải dù tắt ⇒ nhập, viết đủ bước · bài chỉ có đáp số ⇒ nhập (đáp số là nhân chứng) · bài không có lời giải lẫn đáp số ⇒ tự giải, không chắc ⇒ `**Chưa chắc:**` (§A14) · bài mất đề do thiếu trang ⇒ không nhập, không dựng đề ngược từ lời giải.
  - [8T-4] Bản đồ thô: chuyên đề = một chuyên đề bồi dưỡng HSG như sách chia; nhóm bài = một kiểu bài cùng mục tiêu + cùng họ phương pháp; mỗi chuyên đề 2–4 nhóm.
- **6 quyển nguồn** (`E:\BK ACADEMY\Tài liệu tham khảo\8T\HSG\`, PDF scan 100%, không lớp chữ): NDT (Nguyễn Đức Tấn; lời giải ngay sau từng bài; tầng cơ bản / nâng cao / đề thi HSG) · TVA (Trần Thị Vân Anh; ví dụ theo "Dạng k", hướng dẫn cuối chuyên đề) · TCDS (Trương Quang An, Văn Phú Quốc — Đại số) · TCHH (Trần Quang Hùng — Hình học) · VHB1, VHB2 (Vũ Hữu Bình; lời giải cuối sách). Thứ tự: Đại / Số học NDT → TVA → TCDS → VHB; Hình TCHH → NDT → VHB. Hình không gian (hình hộp, lăng trụ, hình chóp): không nhập [10/10].
- **Luật kiến thức** [10/10 · Thùy]:
  - [8T-5] Công cụ lời giải sách dùng ⇒ kho dùng thẳng, không chứng minh lại: đồng dư thức, Cô-si (cả dạng có căn), Bu-nhi-a-cốp-xki, Bê-du, Hoóc-ne, Đi-rích-lê, Mê-nê-la-uýt, Xê-va, hệ thức lượng trong tam giác vuông, bất phương trình, giá trị tuyệt đối, phương pháp diện tích, đối xứng.
  - [8T-6] Dùng thì gọi tên và đủ điều kiện: "áp dụng bất đẳng thức Cô-si cho hai số dương $a$, $b$" + khi nào dấu bằng; "theo định lí Mê-nê-la-uýt cho tam giác $ABC$ với cát tuyến $MNP$". Dùng ngầm = lỗi trình bày.
  - [8T-7] Bài có lời giải sách ⇒ TỰ GIẢI TRƯỚC, rồi đọc lời giải sách để lấy hướng / công cụ; lời giải kho đi theo hướng sách. Chỉ đổi hướng khi lời giải sách sai / hổng ⇒ `**Ghi chú:**`. Đáp số vẫn thử bằng máy.
  - [8T-8] Công cụ KHÔNG có trong 6 quyển ⇒ không dùng: tỉ số lượng giác, định lí sin / cô-sin · toạ độ, vectơ · đạo hàm · quy nạp hình thức nếu sách không dùng cho bài đó · công thức nghiệm $\Delta$ (sách phân tích nhân tử) · bất đẳng thức có tên khác (Schur, Chebyshev, AM–GM $n$ số tổng quát…).
  - [8T-9] Bài lẻ sách dùng kiến thức sách ghi "lớp 9" (tứ giác nội tiếp, góc nội tiếp, đường tròn nội tiếp, Vi-ét — TCHH CĐ4 Bài 11, CĐ5 Bài 8, CĐ6 Bài 1, 5) ⇒ nhập, giải theo sách, `cong_cu` có nhãn `lớp 9`.
  - [8T-10] Mỗi câu khai công cụ: dòng `cong_cu: Bê-du · Cô-si hai số` (trống nếu chỉ biến đổi thường) — để xếp theo phương pháp và lọc câu "lớp 9".
  - [8T-11] Trạm kiểm đối chiếu danh mục công cụ từng câu — máy kiểm đáp số không bắt lỗi này.
- **Danh mục công cụ được dùng thẳng [8T-12]**:

| Mảng | Công cụ | Cách viết |
|---|---|---|
| Đa thức | HĐT mở rộng: $(a+b+c)^2$ · $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$ · $a^n-b^n$ · $a^n+b^n$ ($n$ lẻ) · nhị thức Niu-tơn / tam giác Pa-xcan | lần đầu dùng trong một lời giải: viết hẳn đẳng thức |
| Đa thức | chia đa thức một biến (đặt tính) · Bê-du · Hoóc-ne · nghiệm nguyên / hữu tỉ của đa thức hệ số nguyên · hệ số bất định · xét giá trị riêng | "nhẩm nghiệm" viết căn cứ: ước của hệ số tự do / tổng hệ số bằng 0 |
| Số học | tích $n$ số nguyên liên tiếp chia hết cho $n!$ · $a^n-b^n\ \vdots\ (a-b)$ · $a^p-a\ \vdots\ p$ · số dư của số chính phương khi chia 3, 4, 5, 8 · kẹp giữa hai số chính phương liên tiếp · đồng dư $a\equiv b \pmod m$ | viết $\equiv$ như sách |
| Số học | nghiệm nguyên: đưa về tích / ước số · biểu thị một ẩn rồi chia hết · xét số dư · sắp thứ tự ẩn · kẹp · số chính phương | luôn thử lại nghiệm |
| Bất đẳng thức | $a^2+b^2\ge 2ab$ · $(a+b)^2\ge 4ab$ · $\dfrac1a+\dfrac1b\ge\dfrac4{a+b}$ · $a^2+b^2+c^2\ge ab+bc+ca$ · Cô-si hai số, ba số · Bu-nhi-a-cốp-xki · làm trội – làm giảm | mỗi lần dùng: điều kiện của biến + điều kiện dấu bằng |
| Cực trị | GTLN / GTNN gồm HAI điều kiện: bất đẳng thức với mọi giá trị và tồn tại giá trị đạt dấu bằng | bắt buộc mọi bài cực trị |
| Phương trình | bất phương trình bậc nhất, tích, thương · (bất) phương trình chứa giá trị tuyệt đối (chia khoảng, bảng xét dấu) · bậc cao (đặt ẩn phụ, đối xứng) · giải và biện luận theo tham số | — |
| Tổ hợp | Đi-rích-lê · cực hạn · phản chứng · bất biến, tô màu | chỉ rõ "thỏ", "lồng" |
| Hình | đường trung bình tam giác, hình thang · Thalès thuận, đảo, hệ quả · tính chất phân giác · tam giác đồng dạng · Pythagore · bổ đề hình thang · "nửa tam giác đều" · trung tuyến ứng cạnh huyền · phương pháp diện tích · đối xứng trục, tâm · Mê-nê-la-uýt, Xê-va · hệ thức lượng trong tam giác vuông ($h^2=b'c'$, $\dfrac1{h^2}=\dfrac1{b^2}+\dfrac1{c^2}$) | căn cứ trong ngoặc; gọi tên + nêu tam giác, cát tuyến / đường cao nào |

- **Nguyên tắc gốc [8T-13]**: lời giải như HS lớp 8 GIỎI viết vào bài thi HSG: mỗi khẳng định có lí do, công cụ gọi đúng tên; Phần 1 cho thấy *vì sao nghĩ ra*.

### Phân kho

- Đại · Số học · Tổ hợp ⇒ `dai_cau_hoi` khối `8T`, dạng chờ `T18T000000`.
- Hình ⇒ `hinh_hoc_*` khối `8T` [8T-27] — hai tầng Chuyên đề → Bài ("bài" đóng vai nhóm, lý thuyết của bài = tóm tắt công cụ): H1 Tứ giác (`HH00089`–`HH00094`) · H2 Tam giác · H3 Thalès và đồng dạng · H4 Chứng minh quan hệ hình học · H5 Diện tích và tính toán · H6 Cực trị, tập hợp điểm, dựng hình (`HH00125`–`HH00136`); dạng chờ `HH8T000000`.

### Đại (Đại số · Số học · Tổ hợp)

**(a) Công cụ** — [8T-5]–[8T-12].

**(b) Trình bày riêng**
- [8T-15] Phần 1 của bài HSG trả lời "vì sao nghĩ ra". Nguyên liệu: mục "Phân tích" / "Hướng dẫn tìm lời giải" (TCHH), "Nhận xét" (TCDS), "Chú ý" (VHB).
- [8T-16] **Nhịp viết** [10/10 · Thùy: "Bài nào tắt quá thì cần giải chi tiết hơn. Đáp án cho học sinh nâng cao không cần trình bày quá chi li như thường… Nhưng t vẫn muốn có giải hẳn hoi."] ⇒ sách chỉ ghi kết quả / "Tương tự" / "Dễ thấy" ⇒ viết đủ; Phần 2 được gộp hai biến đổi hiển nhiên vào một dòng, không chép quy tắc cơ bản. Mốc: HS giỏi đọc từng dòng không phải nháp thêm.
- [8T-17] Mẫu nhịp (bậc ba nhẩm nghiệm): Mấu chốt "Đa thức bậc ba không có nhân tử chung, không là HĐT ⇒ nhẩm một nghiệm để biết trước một nhân tử, rồi tách hạng tử cho nhân tử đó xuất hiện." · Bước 1 nhẩm nghiệm trong các ước của $-6$: $x=-1$ cho $-1+7-6=0$ ⇒ nhân tử $x+1$ · Bước 2 tách thành từng cặp chứa $x+1$ · Bước 3 phân tích tam thức còn lại · Chú ý: chưa dừng khi còn tam thức bậc hai có nghiệm. Phần 2: $x^3-7x-6=x^3+x^2-x^2-x-6x-6$ / $=x^2(x+1)-x(x+1)-6(x+1)$ / $=(x+1)(x^2-x-6)$ / $=(x+1)(x+2)(x-3)$ (mỗi "/" một dòng).
- [8T-18] Bài nhiều cách ("Cách 1 … Cách 5"): Phần 2 MỘT cách; cách khác đáng dạy nhắc một câu ở `**Chú ý:**`. Mặc định (đề xuất, chưa chốt): tìm hệ số để chia hết / có dư ⇒ giá trị riêng (Bê-du) khi số chia có nghiệm dễ thấy, hệ số bất định khi không · chứng minh bất đẳng thức ⇒ theo cách sách; sách không giải thì xét hiệu · GTNN đa thức ⇒ tách tổng bình phương.
- [8T-19] Tách ý theo §A7: tách Tính / Rút gọn / Phân tích thành nhân tử / Tìm $x$ (giải phương trình) có ý độc lập; đề tự đủ nghĩa (`Phân tích đa thức thành nhân tử: $15x^2+10xy$.`). Đề hỏi gộp ("biểu thức nào trong các biểu thức sau…", "so sánh…") là MỘT câu — không tự đặt lại lời đề. Tách xong: không còn "theo câu a)", "tương tự ý trên".
- [8T-20] Không viện dẫn sách ("theo ví dụ 28", "xem bài 140b") — chứng minh lại tại chỗ hoặc gọi tên công cụ. `**Chú ý:**` là lời dặn cho HS — chuyện sách in sai ghi ở `ghi_chu_nghi` của tệp `.cs.md`.
- [8T-21] **Khuôn Phần 2 theo chuyên đề**:

| Chuyên đề | Khuôn Phần 2 | Mấu chốt / bẫy (Phần 1) |
|---|---|---|
| Phân tích thành nhân tử | chép đề `=` … mỗi biến đổi một dòng, dòng tách / thêm bớt tường minh → tích các nhân tử không phân tích tiếp được. Dòng lí do nhân tử bậc hai không tách được ("vì $x^2-2x+5=(x-1)^2+4>0$") chỉ khi sách có nêu / bài yêu cầu | tổng hệ số bằng 0 ⇒ $x-1$; tổng hệ số bậc chẵn = bậc lẻ ⇒ $x+1$; không nghiệm nguyên ⇒ thử $\dfrac pq$; $(x+a)(x+b)(x+c)(x+d)+e$ ⇒ nhóm cặp tổng bằng nhau rồi đặt ẩn; hoán vị vòng ⇒ thử $a=b$ |
| Chia đa thức · Bê-du · tìm hệ số | "Gọi thương là $Q(x)$, ta có $f(x)=(x-a)Q(x)+r$ với mọi $x$" → thay $x=a$ → giải hệ số → "Vậy …" | chia cho $(x-a)(x-b)$ ⇒ dư $mx+n$, thay hai giá trị |
| Tính giá trị / chứng minh đẳng thức có điều kiện | "Từ giả thiết … suy ra …" → từng bước → "Vậy $A=\dots$" | khai thác giả thiết trước (phân tích nhân tử, bình phương hai vế, thế $c=-a-b$); mẫu bằng 0 phải loại |
| Phân thức, tổng có quy luật | "ĐKXĐ: …" → rút gọn → trả lời từng yêu cầu; tổng dãy: số hạng tổng quát thành hiệu hai phân thức rồi "cộng theo vế" | tìm $x$ nguyên để phân thức nguyên: tách phần nguyên rồi xét ước; đối chiếu ĐKXĐ |
| Phương trình | ĐKXĐ → `\Leftrightarrow` từng dòng → "(nhận)" / "(loại)" → "Vậy tập nghiệm của phương trình là $S=\{\dots\}$"; tham số: chia trường hợp theo hệ số của $x$ | bậc cao: tích hoặc ẩn phụ (đối xứng: chia $x^2$ sau khi xét $x=0$); biện luận $ax=b$ đủ ba trường hợp |
| Giá trị tuyệt đối · bất phương trình | chia khoảng → giải từng khoảng → đối chiếu khoảng → hợp nghiệm; tích / thương: bảng xét dấu | nhân / chia số âm đổi chiều; chưa biết dấu thì không nhân chéo |
| Lập phương trình | "Gọi … là $x$ (đơn vị; điều kiện)" → biểu diễn → lập → giải → đối chiếu → trả lời | chọn ẩn là đại lượng đề hỏi; chuyển động: bảng $s$–$v$–$t$ ở Phần 1 |
| Chia hết số nguyên | biến đổi thành tích / tổng chia hết, mỗi số hạng kèm lí do ("tích ba số nguyên liên tiếp nên chia hết cho 6") → "Vậy $A\ \vdots\ m$ với mọi $n\in\mathbb Z$" | $m$ hợp số ⇒ tách thừa số nguyên tố cùng nhau; hoặc xét số dư của $n$ |
| Số nguyên tố · chính phương | xét trường hợp theo số dư / $p=2$, $p=3$, $p>3$ → loại dần; không chính phương: số dư không có, hoặc kẹp $k^2<A<(k+1)^2$ | "tìm $n$ để … chính phương": đặt $=k^2$, đưa về tích hai số nguyên |
| Nghiệm nguyên | về tích $=$ hằng số → bảng trường hợp ước → "Thử lại: …" → "Vậy các nghiệm nguyên $(x;y)$ là …" | không sót ước âm; nghiệm nguyên giải trọn trên $\mathbb Z$ |
| Bất đẳng thức | biến đổi "$\Leftrightarrow$" tới bất đẳng thức hiển nhiên rồi viết "bất đẳng thức cuối đúng nên bất đẳng thức đã cho đúng"; hoặc xuất phát từ bất đẳng thức đúng. Chuỗi ĐỦ bước; nhân với số dương thì nói rõ. Dòng cuối "Dấu bằng xảy ra khi …" | tương đương chỉ hợp lệ khi MỌI bước là $\Leftrightarrow$ |
| GTLN, GTNN | "$A=(\dots)^2+c\ge c$ với mọi $x$" → "Dấu bằng xảy ra khi $x=\dots$" → "Vậy GTNN của $A$ là $c$, đạt được khi $x=\dots$" | $A\ge 0$ chưa chắc $\min A=0$ (vd $(x-1)^2+(x-3)^2$); có ràng buộc thì thế vào trước |
| Đi-rích-lê, cực hạn | "Xét … (thỏ). Chia thành … (lồng)." → nguyên lí → kết luận | chọn lồng là toàn bộ bài toán |

- [8T-22] Định dạng (ngoài quy ước Khối 8): `\vdots` ($A\ \vdots\ 6$), `\not\vdots` · `a\equiv b \pmod{m}` · ƯCLN viết "ƯCLN$(a;b)$" (không `\gcd`) · giá trị tuyệt đối `\lvert x\rvert` · hệ `\begin{cases}…\end{cases}`, tuyển `\left[\begin{array}{l}…\end{array}\right.` · `$S=\{1;-2\}$`, $(x;y)$ ngăn bằng `;` · `\dfrac{a}{b}` đủ hai cặp ngoặc nhọn; không `\left` `\right` trừ khi ngoặc bao phân số · không `\text{…}` chứa chữ Việt có dấu (viết lời ra ngoài `$`) · tệp `.cs.md` viết LaTeX một dấu `\`.
- [8T-23] Thuật ngữ: "Thalès", "Pythagore"; còn lại phiên âm như SGK: "Đi-rích-lê", "Bê-du", "Hoóc-ne", "Cô-si", "Bu-nhi-a-cốp-xki", "Mê-nê-la-uýt", "Xê-va".
- [8T-24] `dap_an`: phân tích nhân tử ⇒ tích cuối · phương trình ⇒ `$S=\{…\}$` · nghiệm nguyên ⇒ liệt kê cặp · cực trị ⇒ "GTNN bằng … khi …" · tính giá trị ⇒ một số · chứng minh ⇒ không đáp án ngắn.
- [8T-25] Nguồn đề in dưới đề ("Đề thi HSG huyện … 2015–2016", "Toán tuổi thơ") ⇒ giữ, trong ngoặc ở ĐẦU đề: `(Đề thi HSG Quận 1, TP.HCM, 2003 – 2004) Phân tích…`.

**(c) Sai lầm cần tránh**
- [10/10 lô 3] trạm chép tách 3 ý rồi tự đặt lại lời đề ⇒ không tự đặt lại lời đề.
- [10/10 lô 3] lời giải 11b dẫn "theo câu a)" mà 11a là câu riêng ⇒ mỗi câu tự đủ.
- [10/10 lô 3] "Tương tự a)" bị ghi nhầm "không có lời giải" ⇒ "Tương tự" / "HD: …" vẫn là CÓ lời giải (`muc_loi_giai_sach: tat`).
- [10/10 lô 4] đề in 451 giây không có đáp số, lời giải sách ứng 551 giây ⇒ chép đề đúng như in, ghi số liệu nào khớp lời giải; không soạn lời giải "bài toán không có đáp số"; tìm nhân chứng thứ hai (sách in lại bài ở chỗ khác) trước khi coi là chắc.
- [10/10 lô 5–6] đề sách in sai ⇒ kho ghi bản khớp lời giải sách + `sach_in_sai`; chỗ tự suy không có bản in thứ hai (thiếu số mũ) ⇒ `**Chưa chắc:**`.
- [10/10 lô 6] sách in lại bài cũ chỉ khác vài chữ — lọc trùng theo chữ không bắt ⇒ dò bằng công thức dài chung trước khi ghi.
- [10/10 lô 6] thiếu ảnh trang cuối ⇒ sót lời giải và một ý ⇒ dựng dư một trang sau trang cuối của khu.
- [10/10 lô 7] trạm chép tự sửa đề theo lời giải rồi im lặng ("=" in nhầm cho "+") ⇒ sửa thì ghi nguyên văn chỗ sách in + lí do.
- [10/10 lô 8] mép trang mất chữ: chữ thường tự bù theo ngữ cảnh; mất một phần CÔNG THỨC ⇒ dựng lại theo lời giải + ghi chú; không dựng được ⇒ không chép, báo.
- [17/10] sách bỏ sót nghiệm (thiếu $(1;2)$, $(2;1)$; đề nghiệm nguyên mà sách chỉ giải nguyên dương) ⇒ kho giải trọn; máy kiểu `nghiem` không bắt thiếu nghiệm.
- [18/10] sách suy luận hổng ở bất đẳng thức (chỉ đúng khi $x>0$ mà đề không cho) ⇒ không chép theo; chuỗi đủ bước + dấu bằng; cực trị đủ hai điều kiện.
- [18/10] số trang trong `sach_in_sai` / mã câu luôn là trang PDF (= số in chân trang + 1 ở NĐT).
- [10/10] lời giải mang nhãn "13" thực ra của bài 26 (TVA §10) ⇒ ghép đề ↔ lời giải theo số bài VÀ nội dung.
- [13/10] lời giải phải dùng bổ đề chứng minh bằng quy nạp — nặng hơn mức câu luyện ⇒ `**Chưa chắc:**` (giữ hay bỏ câu do trưởng khối quyết).

### Hình

**(a) Công cụ** — dòng Hình của bảng [8T-12]. Không áp luật thứ tự bài. Cấm: tỉ số lượng giác, sin / cô-sin, toạ độ, vectơ.
- Trước khi dùng đồng dạng [14/11]: được dùng tự do tứ giác, tam giác bằng nhau, cân / đều / vuông, Pythagore, tỉ lệ thức, biến đổi đại số. Sách giải bằng đồng dạng mà có lời giải Thalès gọn, tự nhiên (kẻ song song) ⇒ viết lời giải Thalès; dài / gượng hơn hẳn ⇒ `DE_SAU`.

**(b) Trình bày riêng**
- [8T-28] Lấy KHUÔN Hình của Khối 8 (ý Tính ⇒ hướng dẫn bằng lời; ý Chứng minh ⇒ Sơ đồ tư duy; dòng ngắn; căn cứ) — chỉ lấy khuôn, không lấy luật thứ tự bài. Căn cứ: "(gt)", "(c.g.c)", "(hệ quả định lí Thalès)".
- Nhịp HSG [14/11]: gộp bước hiển nhiên, nhưng HS giỏi đọc không phải nháp thêm.
- [8T-29] Đường phụ: Mấu chốt luôn là "kẻ gì, vì dấu hiệu nào" (vd "Khi có góc $60^\circ$, ta nghĩ đến nửa tam giác đều… gợi ý hạ $DH\perp AC$"). Cặp "Phân tích → Giải tóm tắt" của TCHH là mẫu lối viết. Tính góc: kẻ thêm tam giác đều / vuông cân / nửa tam giác đều.
- [8T-30] Cực trị hình: chứng minh $d\ge d_0$ với mọi vị trí → chỉ ra vị trí đạt → kết luận. Tập hợp điểm: phần thuận → giới hạn → phần đảo → kết luận.
- [8T-32] Đồng dạng `\backsim`, `\parallel` (sách gõ `//`), tích độ dài $AB\cdot AC$.
- [8T-33] Đề Hình trong sách hầu như không kèm hình ⇒ hình của câu vẽ bằng code từ đề; hình trong sách chỉ để đối chiếu.

**(c) Sai lầm cần tránh**
- [10/10] TCHH CĐ1 B Bài 1: đề in $2AB$, lời giải $2BC$ ⇒ lệch đề ↔ lời giải sách thì không ghi bừa, `**Chưa chắc:**`.
- [10/10] sách viện dẫn chéo "theo Bài toán 1, 2, 16", "xem bài 140b" ⇒ chứng minh lại tại chỗ.
- Nhánh Hình 8T chưa chạy batch nào (chưa có lý thuyết cho 18 bài) ⇒ batch đầu là lô mẫu; dựng lời giao trạm từ các luật trên, không lấy của Đại.

### Phân dạng riêng

- [8T-26] Xếp theo **MỤC TIÊU của đề** trước: giải phương trình / tìm $x$ ⇒ nhóm phương trình; chứng minh chia hết ⇒ nhóm chia hết; tìm GTLN / GTNN ⇒ nhóm cực trị — dù công cụ là phân tích nhân tử. Đề thuần "phân tích thành nhân tử" ⇒ theo phương pháp khó nhất phải dùng. Không chắc ⇒ để trống (dạng chờ `T18T000000`).
- Trạm kiểm gán MÙ (chỉ mở đề + bảng nhóm); lệch với trạm soạn ⇒ dạng chờ.
- Câu tầng "Bài tập cơ bản" (`tang: co_ban`) ⇒ máy xếp vào chuyên đề "Kiến thức cơ bản" theo bài học chứa nó, bất kể mục tiêu [10/10 · Thùy]: `T18T010601` Nhân, chia đa thức · `010602` HĐT · `010603` Phân tích nhân tử · `010604` Phân thức · `T18T020401` Phương trình bậc nhất · `020402` Lập phương trình · `020403` Bất phương trình. Ghi đúng `tang` theo tiêu đề tầng in trong sách ("Bài tập cơ bản" ⇒ `co_ban` · "Bài tập nâng cao" ⇒ `nang_cao` · "Bài thi chọn HSG" ⇒ `hsg` · "Ôn tập" ⇒ `on_tap`; TVA không chia tầng ⇒ `nang_cao`).
- Ranh giới đã chốt:
  - [10/10 · Thùy: "Ưu tiên các dạng ở đây là dùng biến đổi và phân tích thành nhân tử, chưa có công cụ lớn đâu."] ⇒ chương đa thức – HĐT – nhân tử phân vân giữa "biến đổi" và "công cụ riêng" ⇒ chọn biến đổi: bất đẳng thức chứng minh bằng phân tích nhân tử / HĐT (kể cả bất đẳng thức ba cạnh) ⇒ `T18T030101`, không `030103`.
  - [10/10 · Thùy: "Bậc 3 hầu như là nhẩm nghiệm"] ⇒ phân tích đa thức bậc ba ⇒ `T18T010203`, kể cả khi tách hạng tử cũng ra.
  - Xác định đa thức khi biết các số dư ⇒ `T18T010401` · chứng minh không là lập phương / luỹ thừa bằng kẹp hoặc số dư ⇒ `T18T040102` · từ điều kiện suy ra hệ thức giữa các chữ ⇒ `T18T010302`.
  - Phương trình ĐA THỨC bậc ≥ 3 (kể cả chỉ nhóm hạng tử đưa về tích) ⇒ `T18T020102`; `T18T020101` chỉ cho bậc 1–2 và phương trình chứa ẩn ở mẫu (kể cả khi khử mẫu ra bậc cao / đặt ẩn phụ); có tham số ⇒ `T18T020103` dù dạng nào.
  - Bài làm việc với MỘT phân thức cho trước (rút gọn, ĐKXĐ, tìm $x$ để bằng 0 / nguyên / âm dương, GTNN của kết quả, không phụ thuộc biến) ⇒ `T18T010501`; cho điều kiện giữa $a,b,c$ rồi tính / chứng minh ⇒ `010301` / `010302`.
  - Phương trình chứa giá trị tuyệt đối ⇒ `T18T020104` (có tham số ⇒ `020103`) · bất phương trình bậc nhất (kể cả mẹo cộng 1 vào từng phân số, biện luận) ⇒ `020301` · tích, thương ⇒ `020302` · bài lời văn chỉ yêu cầu LẬP (bất) phương trình ⇒ `020201` chuyển động / `020202` khác.
  - Bài chỉ áp dụng trực tiếp liên hệ thứ tự với phép cộng / nhân ("Cho $a\ge b$, chứng minh $3a-7\ge3b-7$") ⇒ `T18T020403`.
  - Bài "nâng cao" của một bài học cơ bản mà bản đồ không có nhóm chuyên biệt ⇒ nhóm "Kiến thức cơ bản" của bài học đó (chưa chốt).
- Bảng mã nhóm đầy đủ: `kho-rules/dai/lo/k8T-brief-chep-soan.md` §4 (5 chủ đề · 15 chuyên đề · 44 nhóm: `T18T0101xx` HĐT · `0102xx` phân tích nhân tử · `0103xx` biểu thức đặc biệt · `0104xx` chia đa thức · `0105xx` phân thức · `0201xx` phương trình · `0202xx` lập phương trình · `0203xx` bất phương trình · `0301xx` bất đẳng thức · `0302xx` cực trị · `0401xx` chia hết · `0402xx` số nguyên tố, chính phương · `0403xx` nghiệm nguyên · `0501xx` Đi-rích-lê, cực hạn).

### Tình trạng khối 8T — Đại (Thùy chốt 21/11, phiên fill 8T)

- **Bản đồ Đại 8T = 5 chủ đề · 185 dạng.** Thùy chốt dùng tầng dạng đề xuất 14/11 (`kho-rules/dai/lo/k8T/dang/dai-g1..g4.json`): 37 nhóm tách thành 170 dạng; 7 dạng "Cơ bản" giữ nguyên; 8 dạng AM-GM Thùy tự dựng (đã bỏ 4 dạng "tích / bất đối xứng / thêm biểu thức" cũ, gộp vào dạng "tổng / đối xứng"). Mã bất biến: dạng cũ của mỗi nhóm **giữ mã** và thành dạng số 1 của nhóm; dạng 2..n là mã mới. Script: `dang/ghi-dang.mjs` (mã mới ở `dang/dang-ma.json`). Trang xem: `dang/de-xuat-xem.html`.
- **Mô tả · lý thuyết · ví dụ:** cả 184/185 dạng đã có (trừ NDB02755 "AM-GM ngược dấu" — Thùy không soạn Chương 4 sách Mai Thành Luân), cùng lý thuyết 44 nhóm. Sonnet soạn 16 lô (câu thật đã duyệt làm đề mẫu, dạng không có câu mẫu thì tự soạn), mỗi đáp số thử lại bằng máy (Python / sympy) ngay trong lô; **Opus chưa kiểm** — nên rút mẫu. Tệp soạn: `dang/lt-soan/l*.out.txt`; script ghi chỉ điền ô trống và chặn thiếu thẻ: `dang/ghi-ly-thuyet.mjs`. AM-GM: `amgm/ghi-ban-do.mjs` (gộp nội dung cũ theo bản đồ mới).
- **Kho:** 1.070 câu gốc 8T (NĐT D1–D4, ôn tập, PA, PC; TVA §1–3, 8, 9, 10; 50 câu đề thi), 997 đã duyệt, 0 clone, 0 MCQ duyệt. Gán lại vào 170 dạng mới 21/11 bằng **hai trạm Sonnet, lượt 2 mù** (luật [8T-26]): 813 câu xét → hai trạm cùng dạng 629 (419 cả hai mức cao; 210 có mức vừa) · lệch / không dạng nào khớp 184. Cùng dạng ⇒ ghi (419 `ai`, 154 `doi_ung` thay chỗ, 56 giữ nguyên chỗ cũ); câu CHƯA duyệt luôn ghi `doi_ung` (dạng mới chưa được duyệt lý thuyết ⇒ chưa tự vào kho, §A3). Kết quả từng câu: `dang/gan-lai-ket-qua.json`; script `dang/gan-lai.mjs`.
- **Lô nhập AM-GM đầu tiên (21/11, Thùy: "sách nào cũng có Cô-si", không cần sách Mai Thành Luân):** TCDS CĐ4 Phương pháp 3 mục 1 "Hệ quả Cô-si" — 5 ví dụ + 41 bài ⇒ **46 câu** (Bài 39 sách nhảy số). Ba trạm Sonnet chép + soạn từ ảnh (`k8T/TCDS-C4-a|b|c.cs.md`, khu `C4V` ví dụ · `C4B` bài), cổng `lo-tu-chep.mjs` + `ghi-lo.mjs` (`TCDS-C4.json`), ghi thật 46 câu vào kho (chờ duyệt, kiem_may `khong_kiem_duoc` — bài chứng minh máy chưa kiểm; mỗi bất đẳng thức đã thử số ngẫu nhiên ≥ 100.000 bộ trong lô). Gán dạng: Sonnet + **Opus kiểm mù** (cổng bắt buộc model khác trạm làm), cùng dạng 24 câu ⇒ ghi đề xuất dạng chờ duyệt; lệch 22 câu ⇒ dạng chờ (`TCDS-C4.gan1-sonnet.json`, `TCDS-C4.gan2-opus-mu.json`). **Sách in sai cần người duyệt quyết đề** (xem `ghi_chu_nghi` trong tệp `.cs.md`): VD1–3, Bài 3, 7, 8, 11x, 17, 18, 19, 21, 22, 30, 33, 37 (đề in thiếu điều kiện / mẫu — kho giữ bản đề in, lời giải theo bản đúng), 38, 41. Còn lại của TCDS: CĐ4 mục 2 (Bu-nhi-a-cốp-xki) + CĐ4 PP 4 làm trội, CĐ5 mục IV (35 bài + 5 VD, chỉ có đáp số), VHB2, NDT phần C.
- **Lô AM-GM thứ hai (21/11):** TCDS CĐ4 mục 2 Bu-nhi-a-cốp-xki (9 câu) + Phương pháp 4 làm trội (10 câu) + CĐ5 mục IV (VD1–5, Bài 1–35: 40 câu, chỉ có đáp số — kho tự giải, đáp số sách là nhân chứng, máy vét lưới) ⇒ **58 câu mới** (1 câu trùng lô trước: C5B.4 ≡ C4B.28), tổng từ TCDS 104 câu; ghi cùng cách lô đầu (`k8T/TCDS-C45.json`, `TCDS-C4-d`, `TCDS-C5-e|f.cs.md`), chờ duyệt. Gán dạng: 31 câu hai trạm cùng dạng, 28 câu dạng chờ. Trạm gán ghi nhãn "THIẾU DẠNG" khoảng 20 lần cho cùng một kiểu bài: **cực trị / bất đẳng thức tổng phân thức nhiều biến có điều kiện (xyz=1, a+b+c=1…) giải bằng chặn mẫu + bổ đề 1/(x+y)≤… hoặc đổi biến** ⇒ đề xuất thêm dạng (chờ Thùy). **Sách in sai / đề nghi lỗi cần người chốt:** CĐ5 Bài 20 (đề hỏi GTNN nhưng đáp số sách 2/7 là GTLN), Bài 26 (đề in không có GTLN — nghi mất số hạng; kho giữ đề in, đáp án "không có GTLN", `Chưa chắc`), Bài 31 (sách min = 33, máy ra min = 25), Bài 14, VD2, VD3 · CĐ4 Bu-nhi-a-cốp-xki VD4, Bài 1 · làm trội Bài 1b, Bài 5 — mỗi chỗ có `ghi_chu_nghi` trong `.cs.md`.
- **Dạng mới NDB03579 (Thùy gật 21/11):** "Tổng phân thức nhiều biến có điều kiện: chặn từng mẫu, bổ đề, đổi biến" — dạng thứ 4 của nhóm NNB01473 (GTLN/GTNN có điều kiện ràng buộc); bản đồ 8T = **186 dạng**. Thêm bằng `dang/them-dang.mjs` (mã ở `dang/them-dang-ma.json`), lý thuyết + 2 ví dụ (`lt-soan/l17.out.txt`, thử máy 200.000 bộ/ví dụ). Hai trạm (Sonnet + Opus kiểm mù) gán lại 50 câu TCDS còn chờ dạng: 26 câu cùng dạng (21 vào dạng mới) ⇒ ghi đề xuất chờ duyệt (`dang/ghi-de-xuat.mjs`); 24 câu vẫn lệch / không dạng nào khớp (kể cả C5B.20, C5B.26 đề nghi lỗi) ⇒ dạng chờ, trưởng khối gán tay.
- **Lô VHB2 (21/11):** Vũ Hữu Bình, Nâng cao và phát triển Toán 8 tập hai, phần Đại số — chuyên đề "Chứng minh bất đẳng thức" (Ví dụ 88–102, Bài 358–417) + "Tìm GTNN, GTLN" (Ví dụ 103–122, Bài 418–454) ⇒ 177 câu qua cổng, **165 câu mới vào kho** (12 câu trùng nội dung câu sẵn có — NĐT/TVA/TCDS — không chèn), chờ duyệt. Bảy trạm Sonnet chép + soạn từ ảnh (đề PDF 35–71, lời giải cuối sách PDF 155–185; ảnh dựng bằng `pdftoppm -r 150`; tệp `k8T/VHB2-BDT-a..g.cs.md`, lô `VHB2-BDT.json`); lời giải sách nhiều bài chỉ đáp số/tắt ⇒ kho tự giải, máy vét lưới / vét cạn. Gán dạng Sonnet + Opus kiểm mù: 126 câu cùng dạng (74 cao, 52 vừa), 51 câu dạng chờ. Đề / đáp số sách nghi sai cần người chốt (chi tiết `ghi_chu_nghi` trong `.cs.md`): 427a (đề GTNN nhưng chỉ có GTLN), 428b (đáp số sách không khớp đề), 440b (sách 48000, đúng 24000), 452b (sách 499, đúng 500), 385b (">" in nhầm "≥"), 398 (đề mũ 100, lời giải mũ 1000), 414, 417, 94 (dấu "=" thiếu trường hợp), 88–91, 112.
- **Lô TVA §4–§7 (21/11, Thùy: "TVA §4–7"):** Trần Thị Vân Anh, Bồi dưỡng HSG Toán Đại số 8 — §4 Phương trình ax+b=0 (ví dụ Dạng 1–6 + BT 1–30), §5 Giải bài toán bằng cách lập phương trình (ví dụ + BT 1–23; 13 bài "tự giải" không đáp số KHÔNG nhập), §6 Bất phương trình bậc nhất (ví dụ Dạng 1–6 + BT 1–7), §7 Các bài toán số học (ví dụ Dạng 1–4 + BT 1–58) ⇒ 301 câu qua cổng, **299 câu mới vào kho** (2 trùng), chờ duyệt. Mười ba trạm Sonnet chép + soạn từ ảnh (`k8T/TVA-S4..S7-*.cs.md`, lô `TVA-47.json`; khu `T<n>V<k>` ví dụ Dạng k · `T<n>B` bài tập); tên sách ghi kho cùng khuôn lô TVA cũ. Đáp số mỗi câu được máy kiểm trong lô (Fraction, vét cạn); riêng 41 câu phương trình đơn giản có dòng `kiem` máy tự kiểm đạt. Gán dạng Sonnet + Opus kiểm mù: 266 câu cùng dạng (194 cao, 72 vừa), 35 câu dạng chờ. Sách in sai / đề nghi cần người chốt (xem `ghi_chu_nghi` trong `.cs.md`): §4 BT15 (2x⁴=3 sách ghi x=3/2), BT18 (đáp số sách chỉ khớp nếu dấu "−"), VD Dạng 2 số 8 (sách ghi hai nghiệm lặp VD7); §5 BT12 (mất phân số, dựng lại theo đáp số 63), BT23 (mất chữ số), VD Dạng 5 số 2 (sách 10256, đúng 102564); §6 BT 6a (đáp số sách không khớp đề), VD Dạng 1 số 1 (đề thiếu "1" đầu); §7 BT2 (sách thêm đáp số 483978 sai), BT9 (sách thiếu n=310), BT21 (đề 3a−4c, lời giải sách 3a+4c), BT47 (lời giải sách lạc bài), BT58 (sách 26 số nguyên tố, máy 25), VD Dạng 1 số 5 (điều kiện trong ngoặc nhoè, đề kho bỏ), VD Dạng 3 số 2c (sách chia 25, đề chia 125).
- **Hình 8T — lý thuyết bài Thalès (22/11, Thùy: "fill lý thuyết phần Hình trước", bắt đầu từ Thalès):** bài HH00127 "Định lí Thalès (thuận, đảo, hệ quả)" đã có **lý thuyết** (đoạn thẳng tỉ lệ · Thalès thuận · Thalès đảo · Thalès mở rộng gồm dạng kéo dài cùng phía và dạng đồng hồ cát · đảo mở rộng · hệ quả kèm chứng minh KHÔNG dùng đồng dạng · cách dùng · lưu ý) và **5 ví dụ** (thuận · đảo + hệ quả · đồng hồ cát · kéo dài · hệ quả với dãy tỉ số bằng nhau), 4 hình vẽ bằng code (`k8T-thales/lt/ve-thales.mjs` → bucket kho-anh); mô tả bản đồ 14/11 giữ nguyên. Máy kiểm các khẳng định + số liệu ví dụ trên toạ độ ngẫu nhiên: `lt/kiem-thales.mjs` (7.227 phép, 0 lỗi). Nguồn chữ: `lt/lt-thales.md`, `lt/vd-thales.md`; script ghi chỉ điền ô trống: `lt/ghi-lt-thales.mjs`. Còn bài chưa có lý thuyết: HH00161 đường trung bình (làm lần lượt theo lệnh Thùy).
- **Hình 8T — lý thuyết bài phân giác (22/11, Thùy: "phải làm phân giác trong và ngoài, có chứng minh chi tiết của cả 2"):** bài HH00128 "Tính chất đường phân giác" đã có **lý thuyết** (định nghĩa phân giác trong / ngoài · tính chất phân giác trong + chứng minh chi tiết bằng đường song song tạo tam giác cân · tính chất phân giác ngoài ($AB\ne AC$) + chứng minh chi tiết (lấy $F\in AC$, $AF=AB$, $BF\parallel AE$, rồi Thalès) · **cách 2: qua $B$ kẻ đường thẳng song song $AC$ cắt phân giác trong tại $I$, phân giác ngoài tại $K$ ⇒ $BI=BA=BK$, $B$ là trung điểm $IK$, suy ra cả hai tính chất** · định lí đảo + chứng minh · công thức các đoạn $DB, DC, D'B, D'C$ · hai phân giác vuông góc · cách dùng · lưu ý) và **5 ví dụ** (tính phân giác trong · tính phân giác ngoài · chứng minh $\dfrac{1}{DF}=\dfrac{1}{AB}+\dfrac{1}{AC}$ · tính $DE=8$ · đảo), 8 hình vẽ bằng code (`k8T-thales/lt/ve-phangiac.mjs` → bucket kho-anh), chỉ dùng Thalès + tam giác cân, KHÔNG đồng dạng. Máy kiểm trên toạ độ ngẫu nhiên: `lt/kiem-phangiac.mjs` (12.048 phép, 0 lỗi). Nguồn chữ: `lt/lt-phangiac.md`, `lt/vd-phangiac.md`; script ghi chỉ điền ô trống: `lt/ghi-lt-phangiac.mjs` (cờ `--thay` để thay bản cũ của chính phiên này). **Quy ước tên điểm (Thùy 22/11): phân giác trong $AD$, phân giác ngoài $AE$ ($E\in BC$), $C'$ trên tia đối $AC$, điểm phụ khi chứng minh là $F$.**
- **Hình 8T — lý thuyết bài bổ đề hình thang (22/11, Thùy: 3 bổ đề + cặp trung điểm + bài nhỏ $OE=OF$):** bài HH00162 đã có **lý thuyết** — hình thang $ABCD$ ($AB\parallel CD$), $I=AD\cap BC$, $O=AC\cap BD$: **Bổ đề 1** đường thẳng qua $I$ cắt $AB$, $CD$ tại $M$, $N$ thì $\dfrac{MA}{MB}=\dfrac{ND}{NC}$, kèm **Hệ quả 1 (bổ đề cặp trung điểm)**: $M$ là trung điểm $AB$ ⇔ $N$ là trung điểm $CD$; **Bổ đề 2** đường thẳng qua $O$ thì $\dfrac{MA}{MB}=\dfrac{NC}{ND}$ (so le), kèm **Hệ quả 2 (cặp trung điểm mở rộng)**: cũng hai chiều; **Bổ đề 3** đường thẳng $IO$ cắt hai đáy tại trung điểm (chứng minh bằng cách nhân tỉ số của hai bổ đề đầu); **Hệ quả 3** $M$, $N$ trung điểm hai đáy thì $I$, $M$, $O$, $N$ thẳng hàng (chứng minh bằng Hệ quả 1 và 2); **Bổ đề 4** qua $O$ kẻ song song hai đáy cắt $AD$, $BC$ tại $E$, $F$ thì $OE=OF$ và $\dfrac{1}{OE}=\dfrac{1}{AB}+\dfrac{1}{CD}$ — mỗi mục có chứng minh chi tiết chỉ bằng Thalès; kèm **6 ví dụ** (tính $NC$ qua $I$ · tính $ND$ qua $O$ · đảo cặp trung điểm qua $O$ · trung tuyến chia đôi $EF$ · tính $OE$, $EF$ · $A$, $O$, $M$ thẳng hàng) và 10 hình vẽ bằng code (`k8T-thales/lt/ve-bode.mjs`). Máy kiểm toạ độ ngẫu nhiên: `lt/kiem-bode.mjs` (14.297 phép, 0 lỗi). Nguồn chữ: `lt/lt-bode.md`, `lt/vd-bode.md`; ghi: `lt/ghi-lt-bode.mjs`. Mô tả bản đồ 14/11 giữ nguyên. **Cả ba bài Hình 8T đã làm (Thalès, phân giác, bổ đề hình thang) đã áp luật trình bày mới "hết câu xuống dòng" (\A18) bằng công cụ `lt/xuong-dong.mjs`** (chỉ đổi chỗ xuống dòng, tự kiểm chữ không đổi).
- **Hình 8T — lý thuyết bài Mê-nê-la-uýt / Xê-va (22/11, Thùy):** bài HH00131 đã có **lý thuyết** — cát tuyến và nhận xét "số điểm nằm ngoài cạnh là số lẻ" · **Mê-nê-la-uýt** $\dfrac{MB}{MC}\cdot\dfrac{NC}{NA}\cdot\dfrac{PA}{PB}=1$ (chứng minh bằng $CK\parallel AB$ rồi hai lần Thalès) · **Mê-nê-la-uýt đảo** (hai trường hợp, kèm điều kiện lẻ điểm ngoài cạnh) · **Xê-va** (chứng minh bằng hai lần Mê-nê-la-uýt) · **Xê-va đảo** — mỗi mục có chứng minh chi tiết; kèm **6 ví dụ** (tính $MB$ · tính $EA$ · tính $\dfrac{FA}{FC}$ · ba trung tuyến · ba phân giác trong đồng quy · chân ba phân giác ngoài thẳng hàng) và 12 hình vẽ bằng code (`k8T-thales/lt/ve-xeva.mjs`). Chỉ dùng Thalès (bài đứng trước đồng dạng và diện tích trong thứ tự bài [8T-27]). Máy kiểm toạ độ ngẫu nhiên: `lt/kiem-xeva.mjs` (14.030 phép, 0 lỗi). Nguồn chữ: `lt/lt-xeva.md`, `lt/vd-xeva.md`; ghi: `lt/ghi-lt-xeva.mjs`. Mô tả bản đồ 14/11 giữ nguyên. **Còn bài chưa có lý thuyết: HH00161 đường trung bình.**
- **Nợ:** (1) 159 câu lệch / trống hai trạm đã **gỡ gán** (Thùy gật 21/11, `dang/go-gan.mjs`; câu vẫn trong kho, chỉ xoá dòng gán) — cùng 25 câu chưa nhóm lệch = **184 câu chưa có dạng, chờ trưởng khối phân tay** (danh sách: `kq = "cho"` trong `gan-lai-ket-qua.json`); (2) nhãn "THIẾU DẠNG" gặp lại (phân tích phân thức thành tổng, chứng minh đẳng thức phân thức, so sánh số lớn, chia đa thức đặt tính…) ⇒ cân nhắc thêm dạng; (3) 51 dạng 0 câu (8 AM-GM + 43 dạng mới chưa có gốc) và 74 dạng 1–4 câu — **không clone cho đủ 30** (Thùy 21/11: 8T nhiều bài tập thật, fill bằng nhập sách), nhập tiếp TVA §4–7, TCDS, VHB1, VHB2 (Hình: TCHH); (4) AM-GM: không có PDF sách Mai Thành Luân ⇒ lấy bài từ TCDS CĐ4–5 hoặc chờ Thùy cung cấp; (5) chưa kiểm Opus các ví dụ tự soạn, riêng NDB02765 ví dụ 2 thực chất giải bằng sắp thứ tự, không phải Đi-rích-lê.

### Theo loại nguồn

**Sách SCAN (toàn bộ nguồn 8T) [8T-34]**
- Rủi ro chính: chép đề từ ảnh — chép sai đề thì mọi trạm sau đúng với một đề sai. Chép đúng từng kí hiệu (số mũ, chỉ số, dấu trừ, hệ số; "l" ↔ "1"; $\vdots$ nhoè). Ảnh không đọc chắc ⇒ `- khong_doc_duoc: <mô tả>`, không đoán; phóng 400 dpi khi cần. Dựng ảnh 150 dpi (82–92 dpi không đủ đọc số mũ).
- **Kiểm CHÉP bằng máy**: trạm chép ghi riêng đề và `ket_qua_sach` (nguyên văn); máy thay số — hai mẩu chép độc lập trên cùng trang phải bằng nhau; lệch ⇒ mở ảnh quyết. Câu không có kết quả sách ⇒ chỉ còn người đối chiếu ảnh.
- **Hai nhân chứng đáp số**: (a) lời giải / đáp số sách · (b) máy tính lại từ ĐỀ (dòng `kiem` viết từ đề): `bang | <biểu thức>` · `gia_tri | <biểu thức> | x=…` · `nghiem | <vế trái> = <vế phải> | x` · `khong`. Phân tích nhân tử / rút gọn ⇒ ≥ 5 bộ số hữu tỉ BigInt (máy dùng 12) · phương trình ⇒ thay nghiệm + quét nghiệm hữu tỉ · nghiệm nguyên ⇒ vét cạn · chia hết / chính phương ⇒ thử $n$ trên đoạn dài · bất đẳng thức ⇒ lưới + ngẫu nhiên (chỉ bác được) + kiểm điểm dấu bằng · cực trị ⇒ lưới + điểm đạt · hình ⇒ toạ độ ≥ 2 bộ. Lệch (a) với (b) ⇒ tính lại; sách sai thì theo §A4 (giữ kết quả đúng + ghi chú). Máy chưa đọc `\sqrt`, số mũ là chữ; chưa kiểm bất phương trình.
- **Sách in sai**: trạm chép vẫn chép đúng cái sách in ở `## SACH` / `ket_qua_sach`, ghi `ghi_chu_nghi` cụ thể (kèm phản ví dụ); `dap_an` ghi kết quả đúng. Trạm chép không tự thêm điều kiện vào đề; trạm kiểm mở ảnh xác nhận rồi kho ghi bản khớp lời giải sách + `sach_in_sai`. Đề thiếu điều kiện mà lời giải sách có nêu ⇒ trạm kiểm thêm điều kiện vào đề (vd "Cho $a,b,c>0$") + `**Ghi chú:**`.
- Bản scan thiếu trang (VHB1 đề Đại 142–159, ví dụ 43–46, Hình 41–46; TVA trang 32–33): bài mất đề không nhập.
- **Nhãn bài không làm khoá một mình** (đánh lại từ 1, trùng, nhảy số) ⇒ mã nguồn = `<MÃ sách>/<mục>/<loại><số>[<ý>]@p<trang PDF>`; mã câu trong lô `<khu>.<số bài><ý>@p<trang PDF nơi ĐỀ bắt đầu>` (NDT: `D1`–`D4`, `H1`–`H4`, `OT`, `PA` `PB` `PC`; TVA: `T<n>B` bài tập, `T<n>V<k>` ví dụ Dạng k, ý đánh số ⇒ `n<số>`).
- `ten_de_goc` (khoá chống ghi trùng, không đổi): `CĐ BD HSG Toán 8 – Nguyễn Đức Tấn` · `BD HSG Toán 8 Đại số – Trần Thị Vân Anh`.
- Lời giải nằm xa đề (VHB cuối sách, TVA cuối chuyên đề) ⇒ ghép theo số bài VÀ nội dung.
- TVA: ví dụ có lời giải cũng là câu; `## SACH` chép lời giải ví dụ (nhiều "Cách" chép đủ, "Nhận xét" chép cuối); bài tập không có trong "Hướng dẫn và đáp số" ⇒ tự giải theo [8T-3].
- Nhãn "(n)" sau số bài của VHB = số § kiến thức bài cần (gợi ý xếp chuyên đề); `*` = bài khó.
- Phần "đề rèn luyện / đề thi" của một quyển: từng bài xếp vào nhóm theo nội dung; chỉ chép bài của nhánh được giao; bài gộp hai ý mà một ý trùng ⇒ vẫn chép cả bài, ghi chú.
- Trạm chép ghi tệp sau mỗi 4–6 bài; mỗi trạm một § (≈ 4 trang, 10–15 câu), markdown `.cs.md`, không JSON.
- **Lọc trùng** [10/10 · Thùy: "giống hệt nhau mới bỏ, chứ còn form đề khác nhau cứ giữ"] — so với toàn kho Đại 8T + câu cùng lô:

| Mức | Máy nhận bằng gì | Làm gì |
|---|---|---|
| Trùng CHỮ | đề giống sau khi bỏ dòng nguồn, dấu cách, `$`, `\left`, dấu câu | bỏ câu mới |
| Trùng TOÁN | cùng loại lệnh và biểu thức bằng nhau khi thay số, VÀ (cùng tập hạng tử — chỉ đổi thứ tự — HOẶC cùng một bài của cùng sách) | bỏ — cùng lô giữ câu đề ngắn nhất |
| Nghi trùng | cùng khuôn chữ / bộ công thức sau khi thay số bằng `#` và cùng đáp án; hoặc bằng giá trị nhưng viết khác hẳn ở hai bài; hoặc chung công thức dài (`cc:`) | giữ, chỉ liệt kê |

  Đề khác form, khác số, thêm ý / khác giả thiết = biến thể, giữ. Trùng toán chỉ lập được cho câu có `kiem`; bài chứng minh / lời văn chỉ bắt trùng chữ và nghi trùng ⇒ người là lưới cuối (dò theo công thức dài chung).
- Đề thi / đề cương 8T: chưa có luật riêng — lô mẫu đầu tiên sẽ rút; đề rèn luyện trong sách theo luật sách scan.
- Vào kho theo §C6 (§C6), với ngoại lệ tạm thời ở dòng dưới.
- (Thùy 18/11) 8T do Thùy trực tiếp làm ⇒ giữ cơ chế tự duyệt của 8T theo lệnh 10/10; không áp điều kiện "dạng phải có lý thuyết" (56 dạng 8T chưa có lý thuyết). Tạm thời, chưa phải luật cuối.

### Công cụ riêng

- Dựng ảnh: `pdftoppm -r 150 -gray -f <a> -l <b> -png "<pdf>" <KHO_LAM_VIEC>/sach/8T/<MÃ>/trang/p` (máy công ty `C:\Users\WBPC\bk-kho-lam-viec`). `boc-pdf.mjs` không dùng được (30–130 MB, giới hạn 18 MB).
- `kho-rules/dai/lo/k8T-brief-chep-soan.md` — khuôn tệp `.cs.md`: khối `=== <MÃ>` + meta `bai/y/trang/tang`, `nguon_de`, `muc_loi_giai_sach` (`du|tat|dap_so|khong`), `nhom`, `cong_cu`, `kiem`, `ket_qua_sach`, `dap_an`, `ghi_chu_nghi` + `## DE` + `## SACH` + `## GIAI`; bảng mã nhóm. `kho-rules/dai/lo/k8T-giao-viec-mau.md` — mẫu lời giao việc + quy ước quyển TVA. Tệp mẫu đã qua cổng: `kho-rules/dai/lo/k8T/NDT-D1-s5.cs.md`.
- `node scripts/kho/sach/lo-tu-chep.mjs <…cs.md> --khoi 8T --lo <n> --ten <tên> [--sua x.sua.json] [--mu x.mu.json] [--db --sach "<tên sách>"] [--co-ban kho-rules/dai/lo/k8T/<sách>.co-ban.json]` — dựng lô + cổng (khuôn, card, KaTeX, dấu nhân, kiểm chép, kiểm đáp số, lọc trùng). Bẫy: chạy với `--mu` báo "bản gán mù không có câu này" cho câu máy đã lọc trùng ⇒ ghi `bo` cho chúng vào `.sua.json`.
- `kho-rules/dai/lo/k8T-kiem.mjs` (tự thử `k8T-kiem.thu.mjs`) — máy kiểm đáp số.
- `<tên>.sua.json` — nơi trạm kiểm ghi sửa (`noi_dung` / `dap_an` / `loi_giai` / `nhom` / `sach_in_sai` / `bo` / `cho_quyet`), không sửa đè `.cs.md`.
- `node scripts/kho/sach/ghi-lo.mjs <tên>.json --sach "<tên sách>" --kiem kho-rules/dai/lo/k8T-kiem.mjs --so-do kho-rules/dai/so-do --kiem-ngoai <tên>.mu.json --model-lam … --lan-lam "…"` — chạy thử (ROLLBACK) rồi `--ghi`; không `--chua-gan-dang`.
- `scripts/kho/sach/loc-trung.mjs` — lọc trùng 3 mức; quét kho: `--khoi 8T --ra kho-rules/dai/lo/k8T/loc-trung-kho.md`.
- Hồ sơ từng quyển (mục lục theo trang PDF, bẫy đọc): `kho-rules/dai/lo/k8T/ho-so/<MÃ>.md`.
- Hình: `kho-rules/hinh/lo/k8T-thales/nhap_lo.mjs` (bài–ý + sơ đồ tư duy) + `scripts/anh/ve_hinh_lib.mjs`.

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
- Đồ thị, bảng, hình minh hoạ của câu Đại / Hình giải tích ⇒ cắt từ PDF vào `**Hình:**` nếu gốc ổn (§A8).

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

## Khối 11

### Phạm vi kiến thức

- Chương trình 2018, **SGK gốc KNTT 11**. Thứ tự: C1 Hàm số lượng giác và phương trình lượng giác · C2 Dãy số, cấp số cộng, cấp số nhân · C3 Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm · C4 Quan hệ song song trong không gian · C5 Giới hạn, hàm số liên tục (**thuộc Tập 1** — CTO phân xử 15/11) · (HK2) C6 Hàm số mũ – lôgarit · C7 Đạo hàm · C8 Quan hệ vuông góc · C9 Xác suất.
- Giải theo **bộ sách của đề**. Cánh Diều HK1: I Lượng giác · II Dãy số · III Giới hạn, liên tục · IV Quan hệ song song (cả lăng trụ, hình hộp, phép chiếu song song) — thống kê ghép nhóm của Cánh Diều ở HK2. CTST HK1: 1 Lượng giác · 2 Dãy số · 3 Giới hạn · 4 Quan hệ song song · 5 Mẫu ghép nhóm. `bo_sach` trong danh sách đề phần lớn là suy đoán ⇒ đọc nội dung / thứ tự chương trên ảnh rồi chốt, ghi căn cứ ở `**Ghi chú:**`.
- **Luôn được dùng**: toàn bộ lớp ≤ 10 (hàm số bậc nhất – bậc hai, hệ thức lượng trong tam giác, giá trị lượng giác góc $0^\circ$–$180^\circ$…).
- **Giữa kì I / đề cương giữa kì**: tới hết chương đề nêu.
- **Cuối kì I**: C1–C5 theo bộ sách của đề. Đề cương chỉ vài chương ⇒ giải đúng phạm vi đó.
- **Giữa kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **Cuối kì II**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **CẤM trong mọi lời giải HK1**: đạo hàm · mũ – lôgarit lớp 11 · xác suất lớp 11 · quan hệ vuông góc · số phức, công thức Moivre · L'Hôpital · công thức lượng giác chưa học (hạ bậc bậc 3, đặt $t=\tan\frac x2$ — trừ khi mô tả dạng đòi) · định lí ngoài SGK (Menelaus, Ceva… ⇒ tự chứng minh bằng Thales / đường trung bình / tính chất song song). Cấm cả khi dùng ngầm.
- **Câu C1–C2: không dùng đạo hàm, không dùng giới hạn** (kể cả ngầm) để tìm min – max / đơn điệu / khảo sát dãy số.
- **C5 Giới hạn**: chỉ quy tắc giới hạn SGK. CẤM L'Hôpital, đạo hàm, giới hạn đặc biệt $\dfrac{\sin x}{x}$, $(1+\frac1n)^n$, số $e$, khai triển Taylor, mũ – lôgarit lớp 11, định lí kẹp dạng tổng quát (chỉ được nguyên lí $|u_n|\le v_n$, $v_n\to0\Rightarrow u_n\to0$), tích phân — **dù ngắn hơn**.
- **Câu ngoài phạm vi**: có cách giải trong phạm vi ⇒ giải bằng cách đó + `**Ghi chú:**`; không có ⇒ giữ câu + `**Chưa chắc:**` nêu lí do (§A14). Câu hỏi khái niệm đạo hàm (HK2) trong đề HK1 ⇒ giữ + `**Chưa chắc:**` (§A14).

### Phân kho

- `kho=hinh_hoc` cho câu **quan hệ song song / hình học không gian**: giao tuyến, giao điểm, thiết diện, đường thẳng // mặt phẳng, hai mặt phẳng song song, phép chiếu song song, hình chóp / lăng trụ / hình hộp (CTO phân xử 15/11).
- `kho=dai` cho mọi câu còn lại, **kể cả lượng giác C1** — lượng giác K11 hiện nằm bản đồ Đại (`dai_bdm_*`, chủ đề `NCD00090` Lượng giác) ⇒ `dai` (Thùy chốt 15/11).
- K11 không dùng `kho=hgt`. Cổng `--khoi 11` nhận `kho=dai|hinh_hoc`. Câu nhập nhằng (vd toạ độ) ⇒ chọn theo bản chất + `**Ghi chú:**`.

### Đại

**(a) Công cụ được phép / cấm**
- Min – max / đơn điệu ở C1–C2: bị chặn $|\sin x|\le1$; đặt ẩn phụ + khảo sát hàm bậc hai bằng đỉnh parabol / bảng giá trị; $A\sin x+B\cos x=\sqrt{A^2+B^2}\sin(x+\varphi)$.
- Đơn điệu của dãy số: xét hiệu $u_{n+1}-u_n$ (hoặc thương khi $u_n>0$) — không đạo hàm.
- Mẫu ghép nhóm: công thức SGK (trung bình $\bar x=\dfrac{\sum m_in_i}{n}$, trung vị, tứ phân vị, mốt nội suy).
- Giới hạn — được dùng: thay trực tiếp; chia tử, mẫu cho luỹ thừa cao nhất; rút luỹ thừa cao nhất; phân tích nhân tử (kể cả chia Horner); nhân liên hợp (căn bậc hai; căn bậc ba qua $a^3-b^3$); quy tắc tổng / hiệu / tích / thương / căn; bảng quy tắc dấu giới hạn vô cực; $\lim\dfrac1{n^k}=0$, $q^n\to0$ ($|q|<1$), $n^k\to+\infty$, $q^n\to+\infty$ ($q>1$); tổng cấp số nhân lùi vô hạn $S=\dfrac{u_1}{1-q}$; dạng $\infty-\infty$, $0\cdot\infty$ đưa về phân thức; liên tục $\lim\limits_{x\to x_0}f(x)=f(x_0)$; $f(a)\cdot f(b)<0$ ⇒ có nghiệm.
- Giới hạn hàm số định nghĩa qua **dãy**: chứng minh bằng định nghĩa phải lấy dãy $x_n\ne x_0$, $x_n\to x_0$.
- Lớp dưới dùng trong chương giới hạn: hằng đẳng thức, nhân tử, nghiệm bậc hai, dấu nhị thức / tam thức, tổng CSC – CSN, lượng giác tới hết C1–C2 lớp 11.

**(b) Trình bày riêng**
- Định dạng THPT: dấu nhân **`\cdot`** — CẤM `\times`, CẤM dấu chấm làm dấu nhân. Thập phân `2{,}5`. Hệ `$\begin{cases} … \\ … \end{cases}$` cả hệ một dòng. Chữ Việt trong công thức bọc `\text{…}`. **Không dùng `\left` `\right`** — viết ngoặc thường.
- PTLG: họ nghiệm viết đủ $k\in\mathbb{Z}$, **đơn vị radian** (đổi độ → rad rõ ràng, nhất quán). Nghiệm trên khoảng / đoạn ⇒ giải bất phương trình theo $k$ rồi liệt kê / đếm $k$ nguyên.
- Viết `\sin x`, `\cos x`, `\tan x`, `\cot x`; hằng đẳng thức lượng giác ghi **kèm điều kiện xác định** ($\tan x$: $\cos x\neq0$; $\cot x$: $\sin x\neq0$).
- $\Leftrightarrow$ **được dùng** cho biến đổi tương đương PTLG / ĐKXĐ (CTO phân xử 15/11) — mỗi dòng một bước, không nối quá 2 phép.
- Bài thực tế: mô hình hoá rõ (đặt đại lượng · đơn vị · điều kiện) → lập → giải → đối chiếu → **trả lời bằng đơn vị**; cần $\pi$ làm tròn thì nêu rõ; không bịa dữ kiện.
- Giới hạn: `\lim\limits_{n\to+\infty}` (dãy; viết gọn `\lim` khi rõ) / `\lim\limits_{x\to x_0}`, `x_0^+`, `x_0^-`; kết "Vậy $\lim\ldots=\ldots$". Chia cho biểu thức chứa $x$ ⇒ nêu điều kiện khác 0; nhân liên hợp ⇒ nêu biểu thức liên hợp khác 0.
- Mẫu ghép nhóm: chép bảng số liệu thành chữ trong `**Đề:**` (phức tạp thì cắt hình).
- Tách ý theo §A7 (§A7): "Giải các phương trình: a) … b) …" mỗi ý độc lập ⇒ coi là "Tìm $x$", tách `Bài 2a`, `Bài 2b`; dữ kiện chung / ý sau dùng ý trước / bài thực tế ⇒ giữ một câu.
- Thử máy riêng: PTLG ⇒ thay nghiệm vào đề cho nhiều `k` + quét lưới tìm nghiệm sót trên miền đề cho · min – max ⇒ quét ≥ 20000 giá trị · dãy số ⇒ tính 20 số hạng đầu · giới hạn dãy ⇒ tính ở $n$ rất lớn (1e7, sai số 1e-4) · giới hạn hàm ⇒ tính hai phía của điểm · liên tục / tham số ⇒ thay lại.

**(c) Sai lầm cần tránh**
- [24/10] PTLG quên ĐKXĐ của `\tan`, `\cot`, mẫu số ⇒ nêu ĐKXĐ + đối chiếu nghiệm.
- [24/10] quên họ nghiệm thứ hai; gộp / rút họ nghiệm sai; đổi độ ↔ rad quên `k`; đếm nghiệm trên đoạn sót biên ⇒ quét lưới bằng máy.
- [24/10] min – max hàm lượng giác đặt $t=\sin x$ quên $t\in[-1;1]$; xét đỉnh parabol không đối chiếu đoạn ⇒ luôn đối chiếu đoạn của $t$.
- [24/10] dãy số nhầm $u_1$ với $u_0$; công thức $S_n$ dùng sai biến.
- [19/10] $x\to-\infty$ quên $\sqrt{x^2}=|x|=-x$ ⇒ đổi dấu khi rút căn.
- [19/10] dạng $\dfrac L0$ không xét dấu mẫu theo từng bên ⇒ xét dấu mẫu từng phía.
- [28/10] dùng một khuôn "Hướng dẫn" chung theo dạng cho nhiều câu ⇒ Phần 1 là bước nghĩ riêng của TỪNG câu.
- [28/10] Phần 1 lộ đáp số qua loại trừ phương án / nêu số nghiệm, số khoảng ⇒ cấm.
- [14/10] lời giải câu K11 có sẵn trong kho lỗi nhiều (số cuối lời giải ≠ đáp án) ⇒ không lấy làm mẫu; giải lại từ đầu + thử máy.

### Hình

> Hình không gian K11 (kho `hinh_hoc`). Luật Hình chung: mục "Hình — luật chung mọi khối"; dưới đây chỉ phần riêng.

**(a) Công cụ được phép / cấm**
- Whitelist = SGK C4 Quan hệ song song: định lí giao tuyến, đường trung bình, Thales, tính chất song song (đường // đường, đường // mặt, mặt // mặt, phép chiếu song song) + hình phẳng lớp ≤ 10.
- CẤM: quan hệ vuông góc (C8), Menelaus / Ceva (muốn dùng ⇒ tự chứng minh bằng Thales / đường trung bình), toạ độ không gian.

**(b) Trình bày riêng**
- Mọi khẳng định song song / giao tuyến **nêu căn cứ** (định lí giao tuyến, đường trung bình, tính chất…) — không "nhìn hình thấy".
- Tên hình chóp viết `S.ABCD` bình thường (CTO phân xử 15/11).
- "Đường thẳng $d$ // mặt phẳng $(P)$" ⇒ nêu đường thẳng nằm trong $(P)$ song song với $d$.
- **Hình giải bắt buộc** cho câu tự luận mà lời giải cần hình (giao tuyến, thiết diện, chứng minh song song); không bắt buộc cho TN / Đ/S khái niệm ngắn. Đề tự luận không in hình ⇒ không `**Hình:**`, chỉ `**Hình giải:**`.
- Vẽ bằng code, **phép chiếu xiên**: đặt toạ độ 3D $(x,y,z)$ rồi `sx = x + 0.5·y·cos30°`, `sy = −z − 0.5·y·sin30°`; nét khuất `segDash`, nét thấy `seg`; mọi điểm có tên trong lời giải (giao điểm, trung điểm…) dựng bằng PHÉP TÍNH toạ độ; giao tuyến / thiết diện tô đậm; vẽ xong mở ảnh kiểm nét khuất + đủ điểm. Hình đề của câu `hinh_hoc` cũng vẽ lại bằng code theo cách này (Hình chung).
- Thử máy: dựng toạ độ số kiểm song song / giao điểm / thiết diện.

**(c) Sai lầm cần tránh**
- [24/10] nhầm giao tuyến với đường thẳng cắt ⇒ giao tuyến là đường chung của HAI mặt phẳng, chỉ ra hai điểm chung.
- [24/10] thiết diện thiếu một cạnh ⇒ kiểm bằng toạ độ số.
- [24/10] kết luận "đường thẳng // mặt phẳng" mà không nêu đường nằm trong mặt song song với nó ⇒ chưa đạt.

### Phân dạng riêng

- Chủ đề Giới hạn: bảng đích `kho-rules/dai/lo/k11/sach-gioi-han/dich.md` — đọc hết trước câu đầu tiên.
- Không dạng nào khớp ⇒ để trống + ghi bản đồ THIẾU dạng gì (§A3).

### Theo loại nguồn

**Đề thi khuôn Bộ 3 phần**: dùng luật Khối 10 cho khuôn đề thi Bộ 3 phần (tên `… Toán 11 …`, bốn `## PHẦN`, đề nhiều mã lấy mã đầu, bảng đáp án gộp mã lấy đúng cột).

**Đề cương**
- Đầu tệp `kieu: de_cuong`. Mỗi đề minh hoạ × mỗi mục in (Phần I TN · II Đ/S · III TLN · IV tự luận) hoặc mỗi chương = MỘT `## PHẦN n`, đánh số 1, 2, 3… liên tục trong tệp; **tên PHẦN ghi như đề in** kèm tiền tố đề / chương.
- Đề in "Phần 1 TNKQ" gồm cả Đ/S ⇒ tách theo dạng thức thật của từng câu + ghi cách tách. Câu khác dạng thức của PHẦN vẫn được (khai `loai=` đúng theo câu).
- Không đưa lý thuyết, ma trận, đặc tả, bìa, quảng cáo.
- Chia khúc (khi điều phối chia đề cương cho nhiều trạm): khúc chỉ làm câu có số câu in BẮT ĐẦU trên trang của khúc (lấy nốt đuôi chảy sang trang kế); đuôi câu ở đầu trang đầu là của khúc trước.
- Công thức mất / ảnh mờ không đọc chắc ⇒ giữ câu + `**Chưa chắc:**`, không đoán đề (§A14).

**Sách tham khảo (PNL · Từ Tâm · NBV)** — đường JSON câu rời
- `vai=giang` (kho TRÊN LỚP): CHỈ các mục gọi là **"Ví dụ"** (lời giải mẫu); phải có dạng bài — không có dạng ⇒ đổi thành `luyen` + ghi lí do. `vai=luyen` (kho VỀ NHÀ): mọi thứ còn lại (bài tập, TN, Đ/S, TLN, đề ôn tập), kể cả "Bài tập" có lời giải ngay sau. Lý thuyết / ví dụ nhỏ trong khung lý thuyết: KHÔNG nhập.
- Đáp số lệch đáp số in của sách ⇒ kiểm lại bằng máy; vẫn lệch ⇒ giữ kết quả đúng + `**Ghi chú:** LỆCH SÁCH — …` (§A4).
- Câu phụ thuộc hình mà nguồn chữ không cho thấy hình ⇒ giữ câu + `**Chưa chắc:** cần hình` (§A14). Hình chỉ trang trí ⇒ bỏ qua hình.
- Mỗi câu kèm `kiem` = biểu thức JS tự tính lại đáp số cuối **từ dữ kiện đề** (không tautology); TN: kiểm phương án đúng VÀ từng phương án sai; chứng minh / lý thuyết: kiểm ví dụ số.
- Đ/S: dòng cuối nêu cả bốn "Vậy các ý a), b), c), d) lần lượt là …".
- Pha giải mù của trạm kiểm lấy đề bằng `xem-de.mjs` (không lộ lời giải).

### Công cụ riêng

- `scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem` — cổng khuôn tệp soạn (nhận `kho=dai|hinh_hoc`).
- `kho-rules/dai/lo/k11/de-cuong/ghep-k11.mjs <MA> "<LV>" <số tệp> "<tên đề>" "<nguồn>" --chi-kiem` — ghép các khúc `.p<P>` của một đề cương rồi kiểm (chỉ khi chia khúc).
- `kho-rules/dai/lo/k11/sach-gioi-han/kiem.mjs <id>.json` — cổng tệp JSON câu nhập từ sách (khuôn `kiemP1` + chạy `kiem`).
- `kho-rules/dai/lo/k11/sach-gioi-han/xem-de.mjs <id>` — in id + loại + đề cho pha giải mù.
- `kho-rules/dai/lo/k11/sach-gioi-han/dich.md` — bảng đích dạng bài chủ đề Giới hạn.
- `scripts/kho/hinh-luong-giac.mjs <mo-ta.json> <ra>` (loại `do_thi_ham`, hàm `svgDoThiHam`) — vẽ đồ thị hàm số / hình lượng giác.
- `scripts/anh/ve_hinh_lib.mjs` — vẽ hình không gian (chiếu xiên).
- `scripts/docx-doc.mjs` (OMML) · `scripts/kho/mathtype-thu/doc-docx.mjs` (MathType) — đọc sách docx ra chữ + LaTeX.

---

## Khối 12

### Phạm vi kiến thức

- Chương trình Toán 12 (CT 2018), theo **bộ sách của đề** (đề không ghi ⇒ `bo_sach: KNTT`, ghi là suy đoán; ảnh ghi bộ khác ⇒ sửa theo ảnh + `**Ghi chú:**`).
- Thứ tự: HK1 — C1 Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số · C2 Vectơ và hệ toạ độ trong không gian · C3 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm; HK2 — C4 Nguyên hàm – Tích phân · C5 Phương pháp toạ độ trong không gian (mặt phẳng, đường thẳng, mặt cầu) · xác suất có điều kiện, công thức Bayes.
- **Luôn được dùng**: toàn bộ lớp ≤ 11 (đạo hàm, mũ – lôgarit, lượng giác, giới hạn, hình học không gian lớp 11, hình phẳng, parabol / elip lớp 10).
- **Trong chương / giữa kì I**:
  - Chương Hàm số: đạo hàm, đơn điệu, cực trị, GTLN – GTNN, tiệm cận, khảo sát và vẽ đồ thị (bậc ba, bậc nhất / bậc nhất, bậc hai / bậc nhất). Không tích phân, không kiến thức sau chương. Bất đẳng thức Cô-si chỉ khi dạng nói rõ.
  - Chương Vectơ: vectơ trong không gian, tổng – hiệu – tích với một số, tích vô hướng, ba vectơ đồng phẳng, hệ Oxyz, biểu thức toạ độ, tích có hướng (chỉ làm công cụ tính diện tích / thể tích / vuông góc), lực và công. KHÔNG phương trình mặt phẳng / đường thẳng / mặt cầu, góc nhị diện, khoảng cách điểm – mặt.
- **Cuối kì I**: cả 3 chương HK1.
- **Giữa kì II**: 3 chương HK1 **+ C4** (nguyên hàm, tính chất, nguyên hàm hàm sơ cấp: luỹ thừa, $\dfrac1x$, mũ, lượng giác, $\dfrac1{\cos^2x}$, $\dfrac1{\sin^2x}$; tích phân, tính chất; ứng dụng: diện tích hình phẳng, thể tích vật thể theo $S(x)$ / khối tròn xoay, chuyển động, chi phí biên / thực tế) **+ C5 tới đâu THEO ĐỀ** (đề kiểm tra tới đâu là đã học tới đó — đọc ma trận / nội dung câu, ghi rõ từng đề) [15/11].
- **Cuối kì II**: toàn bộ chương trình Toán 12 (CT 2018) + lớp ≤ 11 [05/11]. Danh sách cấm riêng: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **Thi tốt nghiệp THPT**: chưa có luật — lô mẫu đầu tiên sẽ rút.
- **CẤM ở mọi mốc**: công cụ ngoài SGK (L'Hôpital, Cauchy – Schwarz / Jensen không chứng minh…) — muốn dùng phải tự chứng minh bằng cái đã học; cấm cả khi dùng ngầm. Đề tự đòi thứ ngoài SGK mà không có cách trong phạm vi ⇒ giữ câu + `**Chưa chắc:**` (§A14).

### Phân kho

- `kho=hgt` cho MỌI câu **toạ độ Oxyz / vectơ không gian**: phương trình mặt phẳng, đường thẳng, mặt cầu, vectơ pháp tuyến, điểm thuộc mặt phẳng, khoảng cách, vị trí tương đối… Bài cho trong Oxyz / giải bằng toạ độ ⇒ `hgt`.
- `kho=dai` cho mọi câu còn lại: nguyên hàm, tích phân, diện tích, thể tích, chuyển động, chi phí biên, parabol thực tế, hàm số, số đặc trưng, xác suất.
- **Hình không gian thuần** (không toạ độ) ⇒ `hinh_hoc` (CTO phân xử 15/11). Cổng `--khoi 12` CHƯA nhận `hinh_hoc` (nợ code) ⇒ tạm ghi `kho=hgt` + `**Ghi chú:** hình không gian thuần — đúng ra là hinh_hoc, cổng K12 chưa nhận`.
- Câu nhập nhằng ⇒ theo bản chất + `**Ghi chú:**`.

### Đại

**(a) Công cụ được phép / cấm**
- **Nguyên hàm từng phần / đổi biến**: chỉ dùng khi SGK bộ sách của đề có. **KNTT 12 KHÔNG dạy từng phần / đổi biến tổng quát ⇒ KHÔNG dùng.** Đề đòi mà SGK không có ⇒ giải bằng cách SGK cho phép nếu được (vd diện tích phần hình tròn ⇒ hình tròn / hình quạt / tam giác bằng hình học phẳng, không $\int\sqrt{36-x^2}\,dx$ bằng đổi biến lượng giác; $\int f(x+\pi)\,dx$ ⇒ khai triển $f(x+\pi)$ rồi dùng bảng nguyên hàm); không được ⇒ `**Chưa chắc:**`.
- Bài parabol thực tế (cửa, cổng): tự đặt hệ trục, viết parabol từ dữ kiện, **ghi rõ hệ trục trong lời giải**.
- Bài elip (thùng rượu): phương trình chính tắc elip lớp 10 ⇒ $y^2$ theo $x$, $V=\pi\int y^2\,dx$; $1\ \text{dm}^3=1$ lít.
- Tổng dạng $\sum\dfrac1{k(k+1)}$: tách $\dfrac1k-\dfrac1{k+1}$.
- Bài thực tế hàm số: gọi ẩn – đơn vị – điều kiện → lập hàm → khảo sát → đối chiếu miền thực tế → trả lời bằng ngữ cảnh.
- Dùng lý thuyết hàm số phải đúng: điều kiện $a\ne0$, dấu bằng khi xét đơn điệu, nghiệm bội chẵn không đổi dấu, $\Delta'$, $ad-bc$, tiệm cận xiên.

**(b) Trình bày riêng**
- **Lời giải CHI TIẾT như học sinh trình bày** [05/11 · Thùy]: Phần 2 là bản chính — mỗi bước một dòng, kết "Vậy …" (TN: `Chọn X.`). Giữ khuôn 2 phần (CTO phân xử 15/11): Phần 1 NGẮN, không lộ đáp số.
- Định dạng THPT: dấu nhân **`\cdot`** (cổng `--khoi 12` nhận từ 14/11) — CẤM `\times`, CẤM dấu chấm làm dấu nhân. Thập phân `2{,}5`. Hệ `$\begin{cases} … \\ … \end{cases}$` cả hệ một dòng. Chữ Việt trong công thức bọc `\text{…}`. Tên hình chóp `S.ABCD` viết bình thường (CTO phân xử 15/11).
- Lời giải hàm số: tập xác định → $y'$ → giải $y'=0$ → bảng xét dấu / bảng biến thiên (nói bằng chữ hoặc hình) → kết luận bằng lời. Khoảng viết `(-\infty;1)`, `\mathbb{R}`; đạo hàm `y'` / `f'(x)`.
- Làm tròn đúng yêu cầu đề ("hàng phần trăm" ⇒ 2 chữ số thập phân); đề không nêu mà kết quả không đẹp ⇒ §A14.
- Câu tự luận có ý a), b): theo §A7 (§A7) — chỉ tách khi là "Tính" / "Tìm $x$" với các ý độc lập; còn lại giữ MỘT câu, giải lần lượt từng ý.
- Thử máy riêng (dùng **node**, máy không có Python): **mọi đáp số tích phân / diện tích / thể tích thử bằng tích phân số (Simpson)** · nguyên hàm thử bằng đạo hàm số tại vài điểm · hàm số: đạo hàm sai phân, quét lưới tìm nghiệm / cực trị sót, GTLN – GTNN quét mịn, giới hạn / tiệm cận bằng số · **tham số $m$ ⇒ quét** (vd $[-10;10]$ bước nhỏ) · giá trị ĐỌC từ hình kiểm lại bằng công thức.

**(c) Sai lầm cần tránh**
- [21/10] chép quy tắc nhận dạng / đáp án lỗi của sách nguồn ⇒ luôn tự giải lại, không chép lỗi tác giả.
- [15/11] dùng đổi biến / từng phần khi đề theo KNTT ⇒ tìm cách SGK cho phép.
- [15/11] bảng đáp án gộp nhiều mã đề ⇒ lấy đúng cột / dòng của mã đang làm.
- [15/11] đọc sai đồ thị $f'(x)$ / toạ độ trên hình ⇒ phóng to, đọc kĩ; so sánh $f(a)$, $f(b)$, $f(c)$ qua diện tích.

### Hình

> Hình không gian thuần K12 — đúng kho là `hinh_hoc`, tạm ghi `hgt` (mục Phân kho). Luật Hình chung: mục "Hình — luật chung mọi khối".

**(a) Công cụ được phép / cấm**
- Hình không gian lớp 11 (quan hệ song song, quan hệ vuông góc, khoảng cách, góc, thể tích) + hình phẳng. Không toạ độ hoá nếu đề không cho hệ trục (bài giải bằng toạ độ ⇒ kho `hgt` thật).

**(b) Trình bày riêng**
- Hình vẽ: phép chiếu xiên như Khối 11 — đặt toạ độ 3D $(x,y,z)$, `sx = x + 0.5·y·cos30°`, `sy = −z − 0.5·y·sin30°`; nét khuất `segDash`; mọi điểm có tên dựng bằng phép tính toạ độ; mở ảnh kiểm.
- Thử máy: đặt toạ độ cụ thể cho các đỉnh, tính lại độ dài, góc, khoảng cách, thể tích; lời giải tổng hợp phải khớp phép tính toạ độ.

**(c) Sai lầm cần tránh**
- [22/10] dùng kiểu hình của dạng khác (dạng "trong hình hộp" lại dùng lăng trụ / chóp) ⇒ đúng kiểu hình dạng nêu.

### Hình giải tích

**(a) Công cụ được phép / cấm**
- Vị trí tương đối, góc, khoảng cách: theo công thức SGK bộ sách của đề.
- **Vectơ pháp tuyến từ hai vectơ chỉ phương** (CTO phân xử 15/11): hướng dẫn chấm của chính đề dùng **tích có hướng** ⇒ được dùng; không có nhân chứng đó ⇒ tìm bằng hệ phương trình.
- Chương Vectơ (HK1): tích có hướng chỉ làm công cụ tính diện tích / thể tích / vuông góc. Đồng phẳng, tâm tỉ cự, ứng dụng tích có hướng: chỉ ở mức bài tập SGK.

**(b) Trình bày riêng**
- `\overrightarrow{AB}`; toạ độ `A(1;2;3)`, `\vec{a}=(1;-2;3)`.
- Bài thực tế (nhà kho, chóp cụt…): nêu đơn vị, đặt hệ toạ độ, đọc hình kĩ để xác định toạ độ điểm, tính, kết luận bằng ngữ cảnh.
- Thử máy: hình khối ⇒ **đặt toạ độ cụ thể cho các đỉnh** rồi tính lại tích vô hướng, góc, độ dài, đồng phẳng, khoảng cách.

**(c) Sai lầm cần tránh**
- [22/10] góc giữa hai vectơ khác điểm đầu lấy nhầm góc hình học ⇒ đưa về chung gốc.
- [22/10] sai công thức tích có hướng; sai đơn vị lực / công; bỏ sót điều kiện ⇒ thử máy từng đáp số.
- [15/11] hai mặt phẳng in cùng phương trình ⇒ là TRÙNG nhau, không "song song" — giải theo đề in (đề sai ⇒ §A4).

### Phân dạng riêng

- Mỗi dạng chỉ nói về ĐÚNG bài toán của dạng đó; không nâng độ khó vượt khung dạng khi lấy ví dụ từ sách.
- Câu đề học kì / khảo sát (đường JSON) gán thêm nhãn chương: `HS` · `NHTP` · `VT` · `XS` · `SDT` · `PPTD` · `KHAC` (lớp 10–11, hình không gian, hệ thức lượng…).

### Theo loại nguồn

**Đề thi khuôn Bộ 3 phần**
- Đầu tệp: `# ĐỀ | Đề kiểm tra <kì> Toán 12 năm <năm học> — <trường> (Mã đề <mã>)` · `nam:` · `bo_sach:` · `thoi_gian_phut:` (thường 90). KHÔNG có `kieu: de_cuong`.
- `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` · (`## PHẦN 4 | Tự luận | tu_luan` nếu có). Số câu đúng như đề (có đề 16 TN); nhãn như in (mỗi phần đánh lại từ "Câu 1"); Đ/S đủ 4 ý. Đề gom "Phần I TNKQ" gồm 3 mục ⇒ vẫn tách 3 PHẦN + ghi cách tách.
- **Đề nhiều mã ⇒ chỉ lấy MỘT mã (mã đầu).** Chỉ lấy đề của MỘT trường / sở; **bỏ bộ ôn tập nhiều đề** [13/11 · Thùy].
- PDF và Word cùng đề ⇒ dùng PDF làm đề; Word đáp án là nhân chứng. Câu Word hỏng công thức ⇒ giữ câu + `**Chưa chắc:**` (§A14).
- Hình đề (đồ thị $f$ / $f'$, hình phẳng tô đậm, vườn hoa, cửa parabol, thùng rượu, nhà kho, chóp cụt trong Oxyz) ⇒ cắt từ PDF vào `**Hình:**` nếu gốc ổn (§A8). Câu hình không gian thuần: cũng theo §A8.

**Đề học kì / khảo sát — câu rời JSON (nguồn Word, không có ảnh)**
- Câu thiếu dữ kiện / "như hình vẽ" mà chữ không đủ / đề lỗi nặng ⇒ giữ câu, `dap_an: null`, `**Chưa chắc:**` ghi lí do ("cần hình") (§A14). Thà `null` còn hơn đoán.
- Đề lỗi in hiển nhiên / số liệu vô lí mà vẫn giải được ⇒ giải theo ý đề, `de_sai: true` + lí do (§A4).
- `dap_an`: TN = một chữ theo thứ tự `lua_chon`; Đ/S = mảng 4 phần tử `"Đ"` / `"S"` (`null` cho ý không xét được); TLN = chuỗi số **dấu phẩy thập phân**, không đơn vị (§A10).
- Lời giải vẫn đủ 2 phần (CTO phân xử 15/11).

**Đề cương K12**: không làm (§C8).

**Sách tham khảo K12 (Từ Tâm · NBV · PNL)**: lấy ý từ sách được nhưng **tự giải lại đầy đủ**; ví dụ / bài tập theo §A9.

### Công cụ riêng

- `scripts/kho/de-thi/dung-de-tu-soan.mjs <tệp>.soan.md --lam-viec "<LV>" --khoi 12 --chi-kiem` — cổng khuôn (chỉ nhận `kho=dai|hgt` — chưa nhận `hinh_hoc` là nợ code; nhận `\cdot`).
- `kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>` — dựng thư mục làm việc + danh sách đề.
- `node --env-file=.env kho-rules/dai/lo/toanmath/do-trung-batch.mjs --batch <BATCH>` — đo trùng với kho (chỉ đọc DB).
- `kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k11dc` — ghép `_dau-brief.md` của batch lên brief gốc.
- `kho-rules/dai/lo/toanmath/anh-batch.mjs day <BATCH>` — đẩy hình lên kho.
- `kho-rules/dai/lo/k12-hs/kiem.mjs` · `kho-rules/dai/lo/k12-vt/kiem.mjs` — kiểm khuôn tệp lý thuyết + ví dụ; `kho-rules/dai/lo/k12-hs/ve.mjs` — dựng đồ thị / bảng biến thiên từ `[[HINH {json}]]`.

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

# PHẦN D — SỔ SAI LẦM (hậu kiểm)

> Mỗi câu bị báo sai / bị xoá sau khi đã vào kho ⇒ một dòng. Lỗi thành luật thì ghi luật vào Phần A hoặc mục khối ở Phần B và trỏ lại đây.
> Không sửa câu mà không ghi dòng.
> Nguồn dòng mới (21/11): `node scripts/kho/bao-sai.mjs --ds` liệt kê báo cáo đã đóng mà chưa ghi sổ; ghi xong chạy `--da-ghi <id,id> --ghi`. Lỗi cùng kiểu ≥ 3 câu ⇒ `--thong-ke` rồi sửa LUẬT, không vá từng câu (§C7).

| Ngày | Khối · phần | Câu / batch | Sai gì | Lọt ở trạm nào | Luật rút ra (trỏ mục) | Đã quét câu cùng loại? |
|---|---|---|---|---|---|---|
| 08/11 | 8 · Đại | 49/488 câu clone phân tích đa thức thành nhân tử | Câu sinh ra có đáp số sai | Không có nhân chứng thứ hai (một phiên tự làm tự kiểm) | Mọi đáp số phải có nhân chứng máy hoặc Opus (§C6.2) | Đã kiểm lại 488 câu bằng máy tính đại số |
| 21/11 | 8 · Đại · NDB00982 | 5 câu clone nhẩm nghiệm bậc 3: T108030601002 · 003 · 009 · 055 · 056 | Đáp án sai (thêm nghiệm không có, thiếu nghiệm, nghiệm kép bỏ sót; một câu có nghiệm vô tỉ ghi thành số nguyên) | Duyệt theo mẫu Opus giải mù 20%/dạng (lô clone 21/11) — mẫu không trúng 5 câu này | Dạng có nghiệm/tập nghiệm phải có bộ kiểm máy (`k8-fill.mjs` KIEM) chứ không chỉ mẫu 20% | Đã rà 33 câu NDB00982 + NDB00983 bằng vét cạn: chỉ 5 câu này sai, đã sửa đáp án + lời giải (`k8-fill.mjs sua`) |

---

# PHẦN E — DUYỆT TRÊN ERP · QUÉT LẠI KHO (không phát cho trạm giải)

> Cho người duyệt và điều phối. Lệnh cắt luật không đưa phần này vào brief; sửa ở đây không đổi mã luật.
> "Câu vào kho" định nghĩa thế nào, cột dữ liệu, form trắc nghiệm, clone, báo sai: `spec-kho-cau-hoi.md` §1, §2, §5, §6. Ở đây chỉ có LUẬT DUYỆT.
> Gộp từ `spec-kho-chuan.md` (09/09), sửa theo trả lời của Thùy 18/11.

## E1. Duyệt câu — một cửa, một hàng (Thùy 09/09; người duyệt theo 13–15/11 + 18/11)

- **Câu máy gán dạng ở mức tự tin cao + có đáp án đầy đủ + không bị máy nghi thì TỰ VÀO KHO** (§C6, Thùy 18/11) — không qua màn duyệt. Màn duyệt là cho phần còn lại.
- **Một trạng thái chờ duy nhất:** câu chờ duyệt là dòng thật trong bảng câu với `da_duyet = false`, dù vào bằng đường nào (dây chuyền giải bài · nhập trên ERP · clone · nhập từ tệp). Không có bảng nháp riêng cho từng đường.
- **Một màn:** "Duyệt lời giải AI". Các bộ lọc (không phải các hàng riêng): Câu mới · Lời giải mới từ Claude · Nghi sai · Không kiểm được · Tồn đọng · Chưa có dạng · Đúng/Sai.
- **Ai duyệt (Thùy 18/11): CHỈ trưởng khối của đúng (môn × khối) trở lên** được bấm duyệt câu vào kho, kể cả lô mẫu (§C3) — trên màn hoặc qua phiên Claude của chính trưởng khối. Khoá ở hệ thống, không dựa vào phân công miệng — **DB đã khoá từ 21/11** (mig 202611210813: `fn_kho_duyet_cau` / `_ds` / `_menh_de` kiểm `_truong_khoi_tro_len` theo khối của câu; Phó khối, TA, giáo viên không duyệt được; `p_nguoi` phải là chính người đăng nhập; kết nối script không JWT không bị khoá). Người soạn không duyệt câu của mình.
- **Duyệt = chuẩn hoá:** sửa được ngay tại chỗ đề · dạng (ô tìm, không dropdown) · cụm · đáp số · lời giải; lưu là câu vào kho. Hệ tự ghi người duyệt, giờ duyệt, nguồn duyệt.
- **Không có "duyệt tất cả" cho hàng Nghi sai và Không kiểm được** — hai hàng này mở từng câu. Duyệt theo lô chỉ cho câu không mang cờ nghi.
- **Sửa đáp số hoặc lời giải của câu đã có form trắc nghiệm / điền ô ⇒ form bị thu hồi để sinh lại** (`spec-kho-cau-hoi` §6).
- **Từ chối = vào kho rác**, không xoá cứng, mã không cấp lại (§C7).
- **Câu ở dạng chờ không duyệt được** cho tới khi có dạng (§C6).
- **Câu CLONE (Thùy 18/11):** Claude kiểm xong thì TỰ DUYỆT, không qua hàng duyệt của người. **Đường này có từ 21/11** (`scripts/kho/clone/duyet-nhap-clone.mjs`, §C13); bảng nháp clone: `spec-kho-cau-hoi` §8 Q5.
- **Hình — cách giải / biến thể do Claude ghi mà chưa duyệt:** kho hiện nhãn đỏ; KHÔNG in, KHÔNG làm đáp án tham chiếu, KHÔNG làm mẫu cho lượt giải khác (Thùy 09/09).
- **Câu bị BÁO SAI (Thùy 18/11):** Claude tự đọc, tự quyết, tự sửa câu trong kho — KHÔNG có bước người duyệt. Người nhận BÁO CÁO (đã sửa gì, vì sao) và hậu kiểm; sai thì người sửa lại sau. Thay quyết định 17–18/11 giao trưởng khối duyệt báo sai. Câu sai thật ⇒ một dòng Phần D (§C7). **Nút 🚩 báo sai ở mọi nơi thấy câu + luồng báo → Claude sửa → Phần D: xem §C7 (Thùy 21/11).** Còn thiếu: lịch chạy, báo cáo gửi ai (§C10 mục 15).
- **Khi QUÉT / RÀ kho (E2, E4):** máy và AI không sửa đáp số của kho — chỉ đánh dấu nghi kèm lý do; câu lệch rút về hàng chờ. (Khác với câu bị báo sai ở dòng trên.)

## E2. Quét lại kho cũ — ba mức (Thùy 09/09)

- **Mức A — máy tính lại**, chỉ các dạng "đáp số = giá trị một biểu thức": khớp ⇒ ký duyệt nguồn `may`; lệch ⇒ nghi.
- **Mức B — Claude giải lại** theo lô 200–300 câu: khớp ⇒ ký duyệt nguồn `ai`; không khớp ⇒ nghi; không giải được / đề lỗi ⇒ không kiểm được. Ưu tiên câu học sinh đã làm.
- **Mức C — người:** hàng Nghi sai + Không kiểm được, cộng **mẫu 2 %** phần máy / AI đã ký để đo độ tin (máy và AI tách riêng). Độ tin thấp ⇒ mức B chỉ báo, không ký.
- **Hiện trạng 18/11:** mức A 1 lô 1.696 câu (08/09) · mức B 84 lô 16.131 câu (08–14/09: khớp 13.476 · nghi 803 · không kiểm được 1.852) rồi DỪNG · mẫu 2 % chưa làm · còn 353 câu Đại + 1 câu HGT cũ đang "tạm dùng" (`spec-kho-cau-hoi` §8 Q6).
- **(Thùy 18/11) CHƯA quét lại kho cũ hàng loạt lúc này.** Chỉ kiểm khi có báo sai / khi câu sắp vào đề; xong toanmath mới quét. Đường quét về sau = quy trình rà đáp án (E4).

## E3. Lịch sử

| Ngày | Việc | Nay |
|---|---|---|
| 06/09 | Tool "Giải bài kho chung" cho trợ giảng nhận bài giải (`PLAN-giaibai`) | App đã xoá 27/10. Hàm và cột nhận bài còn trong DB, không ai gọi (§C10 mục 17) |
| 09/09 | Kho chuẩn: 2 cửa duyệt, quét 3 mức (`spec-kho-chuan`) | E1, E2 |
| 28/09 | Dừng luồng một phiên tự giải – tự kiểm – tự ghi | §C1 |
| 04/11 | Hai lượt duyệt hàng loạt câu gán dạng mức cao theo lệnh Thùy (K12 NH-TP 1.179 câu · mọi khối K6–K12: Đại 9.844 + HGT 2.405) | — |
| 05/11 | Gán dạng mức cao ⇒ DB tự duyệt nếu đủ đáp án (trigger `_bdm_tu_duyet_sau_gan`, mig 202611051930) | §C6 |
| 13–15/11 | Câu chưa chắc về trưởng khối · một file luật · tự vào kho đòi 4 điều kiện (có nhân chứng đáp số) | §A1; 4 điều kiện đã thay 18/11 |
| 17/11 | Ranh giới với `spec-kho-cau-hoi` (luật ở đây · quy trình, công cụ, dữ liệu ở đó) | đầu file |
| 18/11 | Thùy: tự vào kho theo mức tự tin phân dạng · clone tự duyệt · chỉ trưởng khối đúng khối duyệt · báo sai Claude tự xử · chưa quét kho hàng loạt · cần quy trình rà đáp án kho | §C6, §C7, E1, E2, E4 |
| 20/11 | Thùy xác nhận 3 điểm rà luật 18/11: **(1) chấp nhận hậu kiểm** thay nhân chứng đáp số — vì người dùng luôn nhìn thấy câu, chỉ cần có **chỗ báo câu sai ở mọi nơi người dùng thấy câu** (hiện chỉ HS báo được, trong bài test — `src/lib/baoloi_cau.ts`; kho / builder / bản in chưa có nút báo cho nhân sự) · (2) Phần D phải có dòng cho mỗi câu bị báo sai · (3) hai đường xử câu sai (báo sai: Claude sửa tại chỗ · quét/rà: chỉ đánh dấu) giữ nguyên | E1, §C10 mục 15 |
| 21/11 | Thùy duyệt phương án hoàn thiện: **(1)** lô CLC coi như đã duyệt mẫu (§C9) · **(2)** DB: lô mẫu `kho_lo_mau` + khoá người duyệt = trưởng khối đúng khối (mig 202611210813) · **(3)** báo sai MỌI câu trong kho, 5 loại, trưởng khối sửa/xoá phải báo trước, nối luồng `kho_nhan_xet` của Claude + sổ Phần D (mig 202611210816/0818/0821; `bao-sai.mjs`) · **(4)** công cụ đo tỉ lệ lọt `do-lot.mjs` (mig 202611210824) · **(5)** dọn spec: bảng ĐƯỜNG VÀO KHO (§C6), §C10 | §C6, §C7, §C9, §C10, E1 |

## E4. Rà lại đáp án kho — CHƯA THIẾT KẾ (Thùy 18/11)

- **Yêu cầu của Thùy (18/11):** "Cần có quy trình rà soát lại đáp án các câu trong kho." Câu đã tự vào kho giữ nguyên trong kho trong lúc chờ rà.
- **Khung đã chốt:** máy tính lại đáp số dần, chạy ngoài 17–22 giờ (§C7); câu lệch ⇒ rút về hàng chờ + báo cáo; không sửa đáp số tại chỗ (E1).
- **Chưa có quy trình chi tiết — còn phải quyết trước khi build** (§C10 mục 16):
  - thứ tự khối / nhóm câu rà trước;
  - ngân sách token mỗi ngày;
  - cách ghi vết từng lượt rà (câu nào, lúc nào, kết quả);
  - câu lệch: rút về hàng chờ thế nào, báo cáo gửi ai.
- Chưa có lệnh, chưa có thiết kế được duyệt ⇒ không chạy lượt rà nào.
