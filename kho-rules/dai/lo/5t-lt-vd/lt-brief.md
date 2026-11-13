# Brief — soạn MÔ TẢ · LÝ THUYẾT · VÍ DỤ cho dạng bài bản đồ 5T (Toán lớp 5 nâng cao, luyện thi vào lớp 6 CLC)

Bạn là giáo viên Toán tiểu học nâng cao. Với MỖI dạng bài trong file đầu vào (JSON, mảng), soạn 3 mục: **mô tả** (dấu hiệu nhận dạng), **lý thuyết**, **ví dụ**. Nội dung dành cho giáo viên/học sinh lớp 5 và dùng để máy phân loại câu hỏi vào đúng dạng — nên mô tả phải đủ rõ để PHÂN BIỆT dạng này với dạng bên cạnh trong cùng nhóm.

## Đọc trước khi viết
- File đầu vào của bạn (đường dẫn trong lời giao việc): mỗi dạng có `ten`, `nhom`, `chuyen_de`, `chu_de`, `goi_y`, `nguon`, và `cau_mau` (câu đã giải thật, nếu có — DÙNG làm gốc cho ví dụ và cho lý thuyết; lời giải trong đó đã được duyệt).
- Sách Toán 5 TLTK (văn bản, công thức đã đổi sang LaTeX): `C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/d532fb34-bd0a-4e16-85e7-c5c7fe27a551/scratchpad/tltk/goc-tex.txt` — tìm theo "CHUYÊN ĐỀ n" / "TÓM TẮT LÍ THUYẾT" / "VÍ DỤ" / "Bài làm" (dùng Grep rồi Read đoạn cần, KHÔNG đọc cả file). Cột `nguon` ghi "TLTK CĐ n" = chuyên đề n.
- Ghi chú về sách "250+ Bài toán chọn lọc lớp 5" (ME): `.../scratchpad/me-1.md` (CĐ1–4), `me-2.md` (CĐ5–7), `me-3.md` (CĐ7–10), `me-4.md` (CĐ11–14) — mỗi chuyên đề có dạng bài, phương pháp, danh sách bài rút gọn. Cột `nguon` ghi "ME CĐ n".
- Mẫu định dạng đúng: `.../scratchpad/mau-lt.json` (3 dạng của khối khác đã soạn xong — bắt chước CẤU TRÚC thẻ, không bắt chước nội dung cấp THCS).
- Luật trình bày 5T: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/k5T.md` §0, §1, §1.5, §3 (đọc nhanh).

## Mỗi mục viết thế nào
**mo_ta** (1–3 câu, 25–220 chữ): đề cho gì · hỏi gì · phương pháp giải chính · điểm khác với dạng gần nó. Không chép lại tên dạng.

**ly_thuyet**: chuỗi các KHỐI, mỗi khối mở bằng một thẻ ở dòng đầu, các khối cách nhau đúng MỘT dòng trống; TRONG một khối không có dòng trống. Thẻ dùng được: `##ĐN` (định nghĩa) · `##TC` (tính chất / công thức / quy tắc cần nhớ) · `##PP` (phương pháp: MỖI DÒNG KHÔNG TRỐNG = 1 bước, KHÔNG gõ "Bước 1") · `##CY` (chú ý, bẫy hay gặp) · `##NX` (nhận xét). Ít nhất `##TC` hoặc `##PP`, và nên có `##CY`. TUYỆT ĐỐI không đặt ví dụ / "Bài giải" / `##VD` trong lý thuyết. 80–900 chữ.

**vi_du**: 1–2 ví dụ. Mỗi ví dụ:
```
##VD
<đề bài — TOÀN BỘ đề (cả ý a) b) c)) liền nhau, KHÔNG có dòng trống>
**Hướng dẫn giải:**
<lời giải: mỗi câu lời giải ngắn + một phép tính, mỗi dòng một bước, KHÔNG dòng trống giữa các bước (chỉ chừa dòng trống trước ý b), c), d) nếu đề có nhiều ý)>
Đáp số: ...
```
Nếu có `cau_mau`: lấy đề của câu mẫu làm ví dụ 1 (giữ đúng số liệu), lời giải lấy từ "Phần 2. Trình bày" của câu mẫu (bỏ dòng "Bài giải", giữ các dòng phép tính và "Đáp số"). Nếu không có `cau_mau`: tự soạn ví dụ vừa sức lớp 5, SỐ ĐẸP, và TỰ KIỂM đáp số bằng cách tính lại từng bước (sai số là lỗi nặng nhất). Ví dụ lấy từ sách TLTK/ME thì giữ số liệu của sách nhưng PHẢI tự giải và kiểm lại (sách ME chỉ in đề, không in lời giải; sách TLTK có lỗi in).

## Luật nội dung (tiểu học — vi phạm là hỏng)
- Công thức LaTeX trong `$...$`, mỗi công thức một cặp; phân số `\dfrac{a}{b}`; nhân `\times`; chia dùng dấu `:` (KHÔNG `\div`, KHÔNG `/`); phần trăm `$25\%$`; dấu phẩy thập phân `,`; số lớn không chèn dấu cách trong công thức (`25850`); đơn vị để ngoài hoặc trong ngoặc sau phép tính `(đồng)`.
- CẤM ký hiệu: `⇒ ⇔ ∈ ∀ ≤ ≥ { }` trong lập luận (dùng chữ "nên", "suy ra", "vậy"); CẤM gọi ẩn $x,k$ lập phương trình, chuyển vế, nhân hai vế (dùng sơ đồ đoạn thẳng, số phần bằng nhau, rút về đơn vị, giả thiết tạm…). Đề có sẵn chữ cái (tìm $y$, số $\overline{abc}$) thì dùng bình thường. KHÔNG ước/bội/ƯCLN/BCNN dạng ký hiệu lớp 6 nếu không cần (dùng "chia hết cho", "chia cho … dư …").
- Tìm $a\%$ của $M$ viết $M\times a\%$; tìm số biết $b\%$ của nó là $M$ viết $M:b\%$.
- Phép nhân/chia hai tỉ số phần trăm viết thêm bước đổi số thập phân: $125\%\times 75\%=1,25\times 0,75=0,9375=93,75\%$.
- Không dùng hình vẽ (không có ảnh): bài hình thì mô tả bằng lời + số đo, chọn ví dụ nói rõ không cần nhìn hình.
- Không bịa nguồn, không chép nguyên đoạn dài của sách: viết lại bằng lời của bạn.

## Định dạng tệp kết quả (QUAN TRỌNG — để máy đọc)
Ghi MỘT tệp văn bản (công cụ Write) tại đường dẫn được giao. Mỗi dạng là một khối:
```
=== NDB02927
@@mo_ta
<mô tả>
@@ly_thuyet
##TC
...

##PP
...

##CY
...
@@vi_du
##VD
...
```
- Dòng `=== <id>` dùng ĐÚNG id trong đầu vào; đủ MỌI dạng, đúng thứ tự, không bỏ sót, không thêm.
- Viết LaTeX bình thường (KHÔNG nhân đôi dấu `\`), vì đây không phải JSON.
- Không dùng dòng nào bắt đầu bằng `===` hoặc `@@` trong nội dung.
Khi xong, trả lời ĐÚNG một dòng: số dạng đã ghi / tổng, và id nào em không chắc đáp số hay nội dung (nếu có).
