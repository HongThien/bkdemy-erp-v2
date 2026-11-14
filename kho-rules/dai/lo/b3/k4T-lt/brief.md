# Brief — soạn MÔ TẢ · LÝ THUYẾT · VÍ DỤ cho dạng bài bản đồ 4T (Toán 4 nâng cao)

Bạn soạn NHÁP nội dung cho các dạng bài của bản đồ kiến thức khối 4T. Người duyệt là CEO / trưởng khối. Nội dung dùng để:
(1) học sinh lớp 4 đọc lý thuyết + ví dụ trên app, (2) một người khác dựa vào MÔ TẢ + LÝ THUYẾT + VÍ DỤ để xếp từng câu hỏi vào đúng dạng.
Vì (2): **mô tả phải phân biệt được dạng này với các dạng anh em cùng nhóm/chuyên đề.**

## Đọc trước (bắt buộc)
- `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\k4T.md` §0–§3 (cấm/cho phép kiến thức lớp 4, lời giải 2 phần, khuôn trình bày theo chuyên đề, định dạng).
- `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\spec-format-noidung.md` §1 (thẻ `##TC` `##PP` `##CY` `##VD`…).
- MẪU ĐÃ DUYỆT, bắt chước đúng giọng và độ dài: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\scripts\kho\ban-do-4t-tbc-dien.mjs` (đối tượng `NHOM` và `DANG`: lý thuyết nhóm, lý thuyết dạng, ví dụ).
- Trong thư mục lô của bạn: `dang.json` (các dạng cần điền, kèm `thieu` = ô còn trống, `co_san` = chữ đang có, `cau_da_gan` = vài câu thật đã xếp vào dạng) và `sach.txt` (trích nguyên văn chuyên đề sách "Toán arc 4 quyển 1": Kiến thức cần có · Tóm tắt lý thuyết · VÍ DỤ có "Bài làm" · LUYỆN TẬP · phiếu).

## Viết gì cho mỗi dạng (chỉ những ô có trong `thieu`; ô đã có chữ KHÔNG viết lại)
- **mo_ta** (1–3 câu, chữ thường, không thẻ): "Đề bài cho … và hỏi …" + dấu hiệu nhận biết. Nếu dễ lẫn với dạng anh em ⇒ thêm câu "Khác dạng <tên dạng anh em>: …". Không chép tên dạng.
- **ly_thuyet**: thẻ `##PP` (các bước làm, mỗi dòng 1 bước, không đánh số), có thể thêm `##TC <tên>` (công thức/quy tắc cần nhớ) và `##CY` (lỗi hay gặp). Ngắn, đúng trình độ lớp 4.
  Nhiều dạng cùng nhóm dùng chung một phần kiến thức ⇒ viết phần chung vào **lý thuyết NHÓM** (`nhom` ở đầu ra) MỘT lần, lý thuyết dạng chỉ còn phần riêng. Nhóm đã có `nhom_ly_thuyet` thì không viết lý thuyết nhóm.
- **vi_du**: đúng 1 ví dụ: `##VD` + đề (1 đoạn) + dòng `**Hướng dẫn giải:**` + 1–2 câu định hướng (Phần 1) + dòng trống + lời giải trình bày như "Bài làm" của sách, mỗi phép tính / câu lời giải một dòng, dòng trống giữa các dòng, kết thúc `Đáp số: …`.
  Ưu tiên chép đúng một VÍ DỤ hoặc bài LUYỆN TẬP của sách (ghi `nguon_vd`: `"sach VD 16.2"` / `"sach LT 17.4"`); sách không có bài nào đúng dạng ⇒ tự dựng bài mô phỏng đúng khuôn sách (`nguon_vd: "mo_phong"`).
  **Tự kiểm lại mọi phép tính** (tính bằng tay cẩn thận, hoặc chạy node nếu cần). Lời giải của sách nếu sai thì sửa cho đúng và ghi trong `ghi_chu`.

## Luật trình bày (rút từ sách, đã CEO duyệt)
- Công thức trong `$…$` (KaTeX): phân số `\dfrac{a}{b}`, nhân `\times`, chia `:`, số thập phân không dùng (lớp 4). Không dùng ẩn x/y để lập phương trình; "tìm x" chỉ là tìm thành phần chưa biết. Không "ước/bội", không số âm.
- Bài có sơ đồ đoạn thẳng: ghi `Ta có sơ đồ:` rồi 1 dòng mô tả sơ đồ bằng lời (máy vẽ sau), không vẽ ASCII.
- Không chèn câu dẫn kiểu "Bước 1:" trong `##VD`.

## Dạng có tên lạ / chưa rõ nghĩa
Tên dạng quá ngắn (vd "2 đầu", "1 đầu", "0 đầu", "2 cây") ⇒ suy nghĩa từ nhóm/chuyên đề + sách; ghi rõ cách hiểu trong `ghi_chu` để CEO xác nhận. Không đoán được thì để các ô `null` và nói lý do trong `ghi_chu`.

## Đầu ra — ghi `out.json` trong thư mục lô của bạn (công cụ Write, JSON hợp lệ)
```json
{ "nhom": [ { "nhom_id": "NNB…", "ly_thuyet": "##TC …" } ],
  "dang": [ { "id": "NDB…", "mo_ta": "…" | null, "ly_thuyet": "##PP …" | null, "vi_du": "##VD …" | null, "nguon_vd": "sach VD 16.2" | "mo_phong" | null, "ghi_chu": "…" | null } ] }
```
- Mỗi dạng trong `dang.json` đúng 1 phần tử trong `dang`, cùng thứ tự. Ô không cần viết (không nằm trong `thieu`) để `null`.
- Chuỗi JSON: xuống dòng là `\n`, gạch ngược LaTeX phải nhân đôi (`\\dfrac`, `\\times`). Sau khi ghi, ĐỌC LẠI file bằng `node -e "JSON.parse(require('fs').readFileSync('<đường dẫn>','utf8'))"` để chắc JSON hợp lệ.
- Không sửa file nào khác, không ghi DB. Trả lời cuối: số dạng đã điền, số ví dụ lấy từ sách / mô phỏng, các `ghi_chu` quan trọng.
