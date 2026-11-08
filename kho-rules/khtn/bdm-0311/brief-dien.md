# Brief: điền MÔ TẢ + LÝ THUYẾT + VÍ DỤ cho dạng bài — bản đồ mới KHTN (03/11/2026)

> Thùy 03/11: *"Cần check lại bản đồ KHTN — viết lý thuyết, mô tả, ví dụ của câu hỏi."*
> Người làm: trạm Sonnet. KHÔNG ghi DB, KHÔNG sửa tệp nào ngoài tệp kết quả của bạn.

Gốc repo: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2` · thư mục lô: `kho-rules\khtn\bdm-0311\lo\`

## 1. Việc

Đầu vào `<LO>.in.json`:
```
{ "nhom": [ { nhom_id, khoi, chu_de, chuyen_de, nhom, nhom_mo_ta, nhom_ly_thuyet_hien_co, can_dien_ly_thuyet_nhom } ],
  "dang_bai": [ { dang_id, nhom_id, thu_tu, dang, mo_ta_hien_co, ly_thuyet_hien_co, vi_du_hien_co,
                  can_dien_mo_ta, can_dien_ly_thuyet, can_dien_vi_du, so_cau_da_gan,
                  cau_mau: [ { ma_cau, loai, de, lua_chon?, dap_an?, loi_giai, co_hinh? } ] } ] }
```
- Mỗi `dang_bai`: soạn các trường có `can_dien_*` = true. Trường `false` thì KHÔNG đụng (trả `""`).
- Mỗi `nhom` có `can_dien_ly_thuyet_nhom` = true: soạn LÝ THUYẾT CHUNG của nhóm.
- Đọc HẾT các dạng cùng một nhóm trước khi soạn — mô tả phải phân biệt được dạng này với các dạng anh em.

Ghi `<LO>.out.json` (Write tool, JSON hợp lệ):
```
{ "nhom": [ { "nhom_id": "KNB…", "ly_thuyet": "…|''", "ghi_chu": "…" } ],
  "dang_bai": [ { "dang_id": "KDB…", "mo_ta": "…|''", "ly_thuyet": "…|''", "vi_du": "…|''",
                  "nguon_vi_du": "KC…, KC… | tu_soan | ''", "ghi_chu": "…" } ] }
```
Mỗi nhóm / mỗi dạng của tệp vào đúng một phần tử (kể cả để trống — ghi `ghi_chu` vì sao).

## 2. LUẬT NỘI DUNG

1. **Đúng chương trình KHTN mới (GDPT 2018) của đúng khối** (KNTT / Cánh Diều / CTST). Kiến thức phải ĐÚNG như SGK; không chắc một chi tiết ⇒ bỏ chi tiết đó. Không đưa kiến thức lớp trên.
2. **Bám dữ liệu thật:** lý thuyết nhóm hiện có + câu mẫu và lời giải của chính dạng. Thuật ngữ, kí hiệu, đơn vị theo đúng cách các câu mẫu dùng (vd tên chất IUPAC tiếng Anh như "sodium chloride", "acetic acid" nếu câu dùng vậy).
3. **MÔ TẢ (`mo_ta`)** — viết cho NGƯỜI XẾP CÂU đọc để biết câu nào thuộc dạng này. 2–5 dòng, mỗi ý một dòng:
   - Dòng 1: đề cho gì · hỏi gì · làm bằng cách nào (kiểu bài, không phải chủ đề chung).
   - Các dòng tiếp: những biến thể thuộc dạng (nhận biết / tính toán / giải thích hiện tượng…).
   - Dòng cuối (khi có dạng anh em dễ nhầm): `Lưu ý: … ⇒ thuộc dạng "<tên dạng anh em>".`
   - Không công thức dài, không ví dụ cụ thể trong mô tả.
4. **LÝ THUYẾT (`ly_thuyet`)** — đúng phần kiến thức cần cho DẠNG đó (lý thuyết chung đã nằm ở nhóm thì không chép lại nguyên, chỉ nhắc ý cần dùng). Thường 1–3 khối:
   - `##TC` kiến thức cần nhớ (định nghĩa, tính chất, công thức kèm đơn vị, quy tắc).
   - `##PP` phương pháp làm bài — mỗi dòng 1 bước, KHÔNG gõ "Bước 1", không gạch đầu dòng (hệ tự đánh số). 3–5 bước. Dạng thuần nhận biết/ghi nhớ có thể không cần `##PP`.
   - `##CY` chú ý / lỗi hay mắc (lấy từ lời giải câu mẫu: các phương án nhiễu sai vì sao).
   - Mỗi khối: dòng đầu là thẻ (có thể kèm tên ngắn, vd `##TC Công thức tính áp suất`), các dòng sau là nội dung, **không dòng trống bên trong khối**; giữa hai khối đúng 1 dòng trống.
   - **KHÔNG có ví dụ trong lý thuyết** (không `##VD`, không "Ví dụ", không "Bài giải").
5. **VÍ DỤ (`vi_du`)** — 1–2 ví dụ, độ khó tăng dần, LẤY TỪ `cau_mau` của chính dạng (ghi mã vào `nguon_vi_du`):
   ```
   ##VD
   <đề — liền một khối, KHÔNG dòng trống bên trong; câu trắc nghiệm thì giữ 4 phương án mỗi dòng "A. …", "B. …">

   Bài giải:
   <lời giải từng bước, mỗi bước một dòng; câu trắc nghiệm kết thúc "Chọn B." / "Đáp án: …">
   ```
   - Hai ví dụ cách nhau một dòng trống. Dòng trống trong lời giải chỉ được đặt trước ý b), c), d).
   - Viết lại lời giải cho đủ bước (lời giải gốc hay cắt ngắn / chỉ nói vì sao phương án nhiễu sai). Tính lại mọi con số (dùng `node -e` nếu cần); số không khớp đáp án ⇒ không dùng câu đó.
   - Bỏ câu `co_hinh: true` mà đề không đủ chữ để hiểu. Câu Đúng/Sai 4 mệnh đề không dùng làm ví dụ.
   - Dạng `cau_mau` rỗng: được tự soạn 1 ví dụ đơn giản đúng SGK (`nguon_vi_du: "tu_soan"`), tính kiểm kỹ.
6. **LÝ THUYẾT NHÓM** (khi `can_dien_ly_thuyet_nhom`): theo khuôn các nhóm đã có:
   `##TC 1. Kiến thức cần nhớ` … (dòng trống) `##PP 2. Các bước làm bài` … (nếu hợp) (dòng trống) `##CY 3. Lưu ý` …  — không ví dụ.
7. Công thức trong `$…$` (KaTeX): phân số `\dfrac{a}{b}`, đơn vị `\mathrm{N/m^2}`, chất `\mathrm{H_2SO_4}`, mũi tên phản ứng `\rightarrow` hoặc `\xrightarrow{t^\circ}`. Xuống dòng là `\n` thật trong chuỗi JSON. Không ảnh, không URL, không HTML.

## 3. Tự kiểm trước khi nộp
- JSON hợp lệ; đủ mọi `dang_id`/`nhom_id` của tệp vào; trường `can_dien_*`=false trả `""`.
- Mỗi chuỗi: số `$` chẵn; không thẻ lạ; `ly_thuyet` không chứa `##VD`/"Bài giải"; mỗi `##VD` có "Bài giải:".
- Chạy KaTeX từ thư mục repo cho mọi đoạn `$…$`:
  `node -e "const k=require('katex');const o=require('./kho-rules/khtn/bdm-0311/lo/<LO>.out.json');…k.renderToString(x,{throwOnError:true})…"` — không lỗi.

## 4. Trả lời cuối (≤ 100 từ)
Số dạng điền đủ 3 trường · số dạng thiếu trường nào và vì sao · số nhóm điền lý thuyết · điểm nào trong bản đồ bạn thấy bất thường (dạng trùng nhau, dạng đặt sai nhóm, tên dạng sai kiến thức).
