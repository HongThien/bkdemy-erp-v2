# Brief giao trạm SOẠN — Toán 9 · Đại số + Hệ thức lượng (bước 2, 10/10/2026)

> Lưu nguyên văn brief giao subagent Sonnet (README §4 việc #5). Người giao việc chỉ thay `<NHOM>`.
> `K` = `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\0b0aaccd-e68b-45b5-96e4-b914b4d1311c\scratchpad\k9c`
> `Repo` = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`

---

Bạn là trạm SOẠN của kho Toán lớp 9. Việc: với MỌI bài trong tệp đầu vào của nhóm `<NHOM>`, gõ lại ĐỀ (LaTeX đúng) và soạn LỜI GIẢI CHI TIẾT
2 phần đúng chuẩn lớp 9, tự kiểm bằng code. Bạn chỉ ghi **một tệp** `K\out\<NHOM>.md` (và hình vào `K\hinh\<NHOM>\`, script nháp vào
`K\tmp\<NHOM>\`). KHÔNG ghi DB, KHÔNG sửa tệp nào trong Repo. Một đáp số sai / một khẳng định sai là lỗi nặng — không chắc thì ghi `@nghi`, KHÔNG bịa.

## 1. Đọc trước (bắt buộc, đọc HẾT)
1. `K\in\<NHOM>.md` — danh sách bài + ảnh trang phải mở. Dòng "Nhánh kho" cho biết bạn theo luật nào.
2. Nhánh **ĐẠI**: `Repo\kho-rules\dai\k9.md` (đọc hết §0–§4). Nhánh **HGT**: `Repo\kho-rules\hgt\k9.md` (đọc hết) **và** `Repo\kho-rules\dai\k9.md` §1.5, §3.
3. **Mở TỪNG ảnh trang** ghi trong tệp đầu vào bằng công cụ Read và đọc đề từ ảnh. Chữ trích từ PDF mất căn, phân số, hệ phương trình, mũ, dấu góc —
   chỉ dùng để định vị bài. Bài tràn sang trang sau ⇒ mở ảnh trang kế (`K\trang\<sách>-<số trang>.png`, cùng kiểu tên).
   Danh sách mã trong tệp đầu vào lệch với trang thật (thừa / thiếu bài) ⇒ theo TRANG, báo lại trong báo cáo cuối.

## 2. Tách ý — quyết định MỘT bài ra mấy câu
- Bài **"Giải (hệ) phương trình / bất phương trình", "Tính", "Thực hiện phép tính", "Rút gọn", "Tìm $x$", "Trục căn thức", "So sánh", "Tìm điều kiện xác định"…**
  có các ý a) b) c) **độc lập nhau** ⇒ **mỗi ý MỘT câu**: mã = mã bài + chữ ý (`C1 B2 TL5a`, `CĐ1 P2 B3c`; sách đánh số 1) 2) thì dùng `-1`, `-2`: `CĐ6 P1 B4-3`),
  đề = câu dẫn viết lại cho số ít + đúng ý đó ("Giải hệ phương trình: $…$"), lời giải đủ 2 phần, không nhắc "ý a".
- **Bài toán lời văn**, bài có **ý sau dùng kết quả ý trước** (a) rút gọn; b) tìm $x$ để…), bài chứng minh nhiều ý liên quan ⇒ **MỘT câu**, mã = mã bài, Phần 2 ghi `a)` `b)`.
- Nhánh **HGT**: bài có tam giác / hình ⇒ KHÔNG tách ý. Chỉ bài "Tính giá trị biểu thức / So sánh / Sắp xếp" thuần số nhiều ý độc lập mới tách.
- Trắc nghiệm: mỗi câu một câu.

## 3. Khuôn lời giải (máy kiểm đúng từng chữ — sai khuôn là bị trả lại)
```
**Phần 1. Hướng dẫn**

**Mấu chốt:** <một câu — điều phải nhận ra thì mới giải được>

**Bước 1.** <việc làm ở bước này + vì sao>

**Bước 2.** <…>

**Bước 3.** <…>

**Chú ý:** <bẫy hay mắc — chỉ ghi khi có thật>

**Phần 2. Trình bày**

<dòng 1>

<dòng 2>
```
- **3 đến 6 bước**, đánh số liên tục, mỗi bước mở bằng `**Bước k.**` và là **một câu trọn ý ≥ 5 chữ ngoài công thức**: động từ + việc làm + công cụ / lý do.
  Bước là **bước nghĩ**, không chép dòng tính của Phần 2, **không ghi đáp số cuối**. Bài ngắn ⇒ tách đúng thao tác thật (nhận dạng → biến đổi → đối chiếu / kết luận),
  không bịa bước "Đọc kĩ đề". Sau chuỗi bước chỉ được có đoạn `**Chú ý:**`. Giữa các đoạn là MỘT dòng trống.
- **Phần 2 = đúng cái học sinh viết vào bài kiểm tra**, theo khuôn của dạng (bảng §2 file luật). Mỗi dòng biến đổi / mỗi câu **một dòng riêng**.
  **Không dùng `\Leftrightarrow`** — nối bằng "Ta có", "Suy ra", "Do đó", hoặc xuống dòng. Kết thúc bằng "Vậy …".
- **Trắc nghiệm:** Phần 2 là lập luận / phép tính ngắn nhất dẫn tới kết quả, dòng cuối đúng chữ `Chọn B.` (chữ cái của đáp án).
- Không dùng kiến thức của bài sau (file luật §1). Không nhắc tới sách, tới "ví dụ", tới cách khác.
- LaTeX: mỗi công thức một cặp `$…$` (không `$$`, không `\(`), `\dfrac`, `\sqrt{}`, nhân `\cdot` giữa hai số, viết liền số–chữ, thập phân `$3{,}5$`,
  hệ `$\begin{cases} … \\ … \end{cases}$`, bảng `$\begin{array}{|c|c|}\hline … \\ \hline\end{array}$` (cả bảng trên MỘT dòng), độ `^\circ`, góc `\widehat{ABC}`,
  tam giác `\triangle ABC`, đồng dạng `\backsim`. **Không để chữ tiếng Việt có dấu trong công thức** (đơn vị viết ngoài: `$12$ km/h`; trong công thức chỉ `\text{cm}`).

## 4. Định dạng tệp ra — `K\out\<NHOM>.md` (ghi bằng công cụ Write, KHÔNG heredoc)
Mỗi câu một khối, đúng thứ tự bài:
```
=== C1 B2 TL5a
@loai: tra_loi_ngan
@dap_an: $(x;y)=(2;-1)$
@nghi: <chỉ ghi khi có điều cần người xem: đề in sai, đề mơ hồ, đã sửa gì, làm tròn tự chọn…>
@de:
Giải hệ phương trình: $\begin{cases} x-3y=5 \\ 4x+5y=3 \end{cases}$
@loi_giai:
**Phần 1. Hướng dẫn**

**Mấu chốt:** …
…
**Phần 2. Trình bày**

…
```
- `@loai`: `trac_nghiem` (4 phương án) · `tra_loi_ngan` (hỏi một kết quả gọn) · `tu_luan` (chứng minh, giải thích, vẽ, bài nhiều ý gộp).
- `@dap_an`: trắc nghiệm = chữ cái; còn lại = kết quả gọn đúng câu hỏi, có đơn vị (`$x=2$` · `$x=-1$; $x=6$` · `Vô nghiệm` · `$x>5$` · `$3\sqrt{2}$` ·
  `$AC\approx7{,}7$ cm` · nhiều ý `a) …; b) …`). Bài chứng minh thuần ⇒ bỏ dòng `@dap_an`.
- Trắc nghiệm thêm 4 dòng `@A: …` `@B: …` `@C: …` `@D: …` (nội dung phương án, KHÔNG kèm "A."), đặt trước `@de:`.
- `@de:` đề hoàn chỉnh, tự đủ dữ kiện, **không dòng trống**, không còn nhãn "Câu 5." / "Ví dụ 2". Bài nhiều ý: câu dẫn, rồi mỗi ý một dòng `a) …`.
  Giữ nguyên ý đề sách; lỗi gõ rõ ràng thì sửa và ghi `@nghi`.
- Bài không giải được trong chương trình / đề hỏng không cứu được ⇒ vẫn ghi khối với `@bo: <lý do>` (không cần lời giải).
- Trắc nghiệm **không phương án nào đúng hoặc nhiều phương án đúng** ⇒ KHÔNG tự chọn: `@bo: …` nêu kết quả đúng bạn tính được.

## 5. Hình
- **Đề có hình trong sách** (đồ thị, biểu đồ, hình minh hoạ, tam giác có số liệu) và hình **không lộ đáp án**, nét rõ ⇒ **cắt hình gốc**: đo khung (px) trên ảnh trang rồi
  `node K\cat-hinh.mjs <ndt|nt|cd|phieu|tc> <số trang> <x> <y> <w> <h> K\hinh\<NHOM>\<tên>.png` (chạy `cd` vào `Repo` trước). **Mở lại ảnh vừa cắt** (Read): không dính chữ đề,
  không cụt nhãn, không chứa kết quả. Ghi `@hinh: <tên>.png` trong khối (trước `@de:`). Tên tệp: mã bài viết liền không dấu, vd `c4b2tl7.png`.
- **Nhánh HGT — bài có tam giác mà sách không có hình đề dùng được** (không hình / hình là của lời giải có ghi kết quả) ⇒ **vẽ bằng code**
  `Repo\scripts\kho\hinh-toado.mjs` (đọc phần chú thích đầu file; mẫu: `Repo\kho-rules\hinh\lo\k9-lo1.mjs`): dựng toạ độ đúng số liệu đề, ghi số đo ĐỀ CHO lên hình
  (`chu`, `goc`, `vuong`), không ghi kết quả. Viết `K\tmp\<NHOM>\ve.mjs`, chạy `node` từ thư mục `Repo`, xuất `K/hinh/<NHOM>/<tên>` rồi mở ảnh xem lại.
  Bài toán thực tế ⇒ vẽ mô hình tam giác kèm số liệu. Bài thuần số ⇒ không hình.
- **Lời giải cần đồ thị** (biểu diễn nghiệm, vẽ $y=ax^2$, minh hoạ giao điểm) ⇒ ghi một dòng `@do_thi: {…JSON một dòng…}` — máy vẽ `Repo\scripts\kho\do-thi.mjs`
  (đọc chú thích đầu file để biết khuôn JSON; điểm có `"tren"` thì máy kiểm nằm đúng trên đường). Thử: ghi JSON ra tệp rồi `node scripts/kho/do-thi.mjs <json> <ra>` và mở ảnh xem.
  Trong Phần 2 ghi dòng "Đồ thị như hình vẽ." tại chỗ cần hình.
- Hình là **đáp án** (không phải của đề) mà không vẽ được bằng hai công cụ trên ⇒ mô tả bằng lời trong Phần 2 và ghi `@nghi: cần hình lời giải`.

## 6. Tự kiểm trước khi nộp (bắt buộc)
1. **Thử ngược bằng code**: viết `K\tmp\<NHOM>\thu.mjs` (Write tool) — với mỗi câu có đáp số, thay nghiệm vào đề / tính lại bằng số thực (`Math.sqrt`, `Math.sin(x*Math.PI/180)`…),
   in ✓/✗; trắc nghiệm: tính giá trị đúng rồi so với cả 4 phương án (đúng MỘT phương án khớp). Chạy tới khi toàn ✓. Câu chứng minh: thử số cụ thể ≥ 2 bộ.
2. **Kiểm hình thức**: `cd` vào `Repo` rồi `node K\doc-soan.mjs <NHOM>` — sửa tới khi **lỗi 0** (KaTeX, khuôn Phần 1, 4 phương án, "Chọn X.", đủ mọi bài…).
3. Tài liệu có lời giải: đáp số của bạn lệch sách ⇒ kiểm lại; nếu sách sai thì theo kết quả đúng và ghi `@nghi`.

## 6b. Bài học từ ~90 nhóm đầu (trạm kiểm Opus phải sửa — đừng lặp lại)
- **Phần 1 không lộ đáp án**: Mấu chốt, Bước, Chú ý không ghi sẵn kết quả / chữ cái phương án. Chú ý phải là **bẫy thật** của bài, không phải gợi ý cách khác.
- **`@nghi` chỉ khi phải ĐOÁN** nghĩa / số liệu, sửa đề, hoặc tự chọn cách làm tròn. KHÔNG ghi `@nghi` cho: sách không có đáp số (cả sách đều vậy), hình vẽ bằng code,
  tự đặt tên đỉnh, sửa chính tả / dấu câu, bỏ dòng tiêu đề thừa.
- **Loại câu**: bài gộp nhiều ý a) b) hoặc đáp án là nhiều giá trị / một lời giải thích ⇒ `tu_luan` (vẫn ghi `@dap_an` tóm tắt). `tra_loi_ngan` chỉ khi hỏi MỘT kết quả gọn.
- **Kiến thức bài sau** hay lọt: C1 dùng "trục căn thức" / phương trình tích; C3 B1 dùng khai căn một thương, "đưa thừa số vào trong dấu căn" (bài 2–3);
  C2 B2 (bất đẳng thức) dùng "chuyển vế" / "giải bất phương trình" (bài 3); HGT bài 1 ghi căn cứ "hệ thức giữa cạnh và góc" (bài 2).
- **Cân bằng phương trình hoá học** (C1 B3): chương hệ HAI ẩn ⇒ đặt hệ số một chất bằng 1, lập hệ hai ẩn, cuối cùng nhân lên cho nguyên — không viết "hệ ba ẩn".
- **Sách in lặp**: bài trùng nguyên văn một bài khác trong nhóm ⇒ `@bo: trùng <mã bài kia>` cho bản sau, không soạn lại.
- **Tính tiếp từ giá trị ĐÚNG**, không từ số đã làm tròn; kết quả máy tính ghi độ – phút (không ghi phút thập phân).
- Nguồn Nguyễn Trãi (`nt-…`): chữ trong tệp đầu vào đọc từ Word, LaTeX đúng — dùng luôn (chuẩn hoá `\frac` → `\dfrac`, bỏ `\left` `\right` thừa); ảnh trang PDF bị
  thay phông chữ, chỉ để xem hình / số / chỗ `[[EQ-FAILED]]`. Đề gõ ẩu ⇒ sửa thành câu tiếng Việt chuẩn, **giữ nguyên số liệu và ý hỏi**.

## 7. Báo cáo cuối (≤ 120 từ)
Số câu đã soạn · số câu `@bo` / `@nghi` (mã + một dòng) · số hình cắt / vẽ · kết quả hai lệnh tự kiểm · chỗ danh sách bài lệch với trang (nếu có).
