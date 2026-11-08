# Brief: điền LÝ THUYẾT + VÍ DỤ cho các DẠNG BÀI của bản đồ kiến thức mới LỚP 10 (Toán) — 14/10/2026

> CEO (Thùy) 14/10: *"bản đồ lớp 10 mới đã xong dạng bài và mô tả. M điền lý thuyết và ví dụ nhé. Tham khảo từ bản đồ cũ và các quyển sách mà t gửi."*
> Người làm: trạm Sonnet. KHÔNG ghi DB (trạm điều phối kiểm rồi mới ghi). KHÔNG sửa tệp nào của repo ngoài tệp kết quả của bạn.

Gốc repo: `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2` · thư mục việc: `kho-rules\dai\lo\k10-bdm\`
Gốc nguồn (scratch): `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\356cff98-f6c7-4114-8b48-84450569e612\scratchpad`  (gọi tắt `$SC`)

## 1. Việc phải làm

Mỗi nhóm có tệp vào `kho-rules\dai\lo\k10-bdm\<G>.in.json`:

```
{ "nhom":     [ { nhom_id, chu_de, chuyen_de, nhom, nhom_mo_ta, nhom_ly_thuyet_hien_co, can_dien_ly_thuyet_nhom, bang_cu:[{ma_dang_cu, ten_cu, noi_dung_cu}] } ],
  "dang_bai": [ { dang_id, nhom_id, chuyen_de, nhom, dang, mo_ta, ly_thuyet_hien_co, vi_du_hien_co, can_dien_ly_thuyet, can_dien_vi_du, bang_cu_dang:[…] } ],
  "bang_cu_hgt_chung": [ … ]   // chỉ nhóm Véc tơ: nội dung bản đồ cũ (hgt) của các dạng véc tơ cũ — dùng làm tham khảo }
```

- Với MỖI `dang_bai` có `can_dien_ly_thuyet` hoặc `can_dien_vi_du` = true: soạn nội dung ĐÚNG CHO DẠNG ĐÓ.
- Với MỖI `nhom` có `can_dien_ly_thuyet_nhom` = true: soạn LÝ THUYẾT CHUNG của cả nhóm (định nghĩa, tính chất, công thức nền; không chép phương pháp từng dạng).
- Trường đã có nội dung (`false`) thì KHÔNG đụng.

Kết quả ghi vào `kho-rules\dai\lo\k10-bdm\<G>.out.json`:

```
{ "nhom":     [ { "nhom_id": "NNB01521", "ly_thuyet": "<chuỗi hoặc ''>", "nguon": "...", "ghi_chu": "…" } ],
  "dang_bai": [ { "dang_id": "NDB00901", "ly_thuyet": "<chuỗi, '' nếu để trống>", "vi_du": "<chuỗi, '' nếu để trống>",
                  "nguon_ly_thuyet": "cu:T110010101 | NBV 10-13 A.LY THUYET | PNL Bài 01 Dạng 01 | TT C1-B1-P1 | ''", "nguon_vi_du": "…", "ghi_chu": "…" } ] }
```
Mỗi nhóm / mỗi dạng một phần tử (kể cả để trống — ghi `ghi_chu` vì sao).

## 2. LUẬT (quan trọng nhất)

1. **KHÔNG BỊA. Không chắc / không có nguồn ⇒ để chuỗi rỗng `""`.** Mọi câu lý thuyết và mọi ví dụ phải truy được về một nguồn thật (ghi `nguon_*`).
   Công thức toán đúng nhưng không có trong nguồn ⇒ vẫn để trống. Lý thuyết cơ bản chung (định nghĩa, công thức) mà ≥ 2 nguồn cùng nói thì được tổng hợp lại gọn.
2. **Thứ tự nguồn:**
   1. `bang_cu` / `bang_cu_dang` / `bang_cu_hgt_chung` (bản đồ cũ — đã duyệt) — ưu tiên nhất. Cắt đúng phần ứng với DẠNG; chép nguyên văn, sửa tối thiểu.
   2. Tài liệu K10 đã được trích sẵn ra TEXT (công thức đã là LaTeX, KHÔNG cần xem ảnh; thẻ `[[b]]…[[/b]]`, `[[u]]`, `[[mau:…]]`, `[[nen:…]]`, `[[img:…]]` là định dạng — BỎ khi chép). Chỉ ĐỌC, không sửa:
      - `$SC\txt2\` — tên tệp `NBV__<chương>__<phần>.txt` (sách Nguyễn Bảo Vương: `A. LY THUYET` = lý thuyết; `B. TU LUAN` = bài tự luận **có lời giải**; `C/D/E` = trắc nghiệm / đúng sai / trả lời ngắn **có lời giải**; `... - DA` = bản đáp án có lời giải; `... - CH` đã bị loại) · `PNL__…_GV.txt` (Phan Nhật Linh 2026, bản GV — lý thuyết cần nhớ + ví dụ + bài tập có lời giải theo dạng) · `TT__…` (Toán Từ Tâm: `P1` lý thuyết + các dạng + ví dụ có lời giải, `P2` luyện tập trắc nghiệm có lời giải, `P3-GHÉP GV` bản gộp).
      - Véc tơ: `$SC\txt\nbv\`, `$SC\txt\pnl\`, `$SC\txt\tt\` (cùng quy cách; NBV 10-13 Khái niệm, 10-14 Tổng hiệu, 10-15 Tích số–véc tơ, 10-16 Tích vô hướng, 10-17 Toạ độ, 10-18 ôn tập). Riêng nhóm Véc tơ: tệp Từ Tâm là `txt\tt\C5-B*-…-P1.txt` / `-P3-GHÉP GV.txt`.
      Dùng `grep`/Read để tìm; mỗi tệp có thể 30–140 KB, chỉ đọc phần liên quan (Read với offset/limit).
   3. Không có ở đâu ⇒ `""`.
3. **Đúng dạng.** Ví dụ phải đúng DẠNG theo tên + `mo_ta` của dạng (không đưa ví dụ của dạng bên cạnh). Lý thuyết đúng phạm vi dạng; lý thuyết chung của nhóm nằm ở nhóm.
4. **Chương trình Toán 10 mới (2018):** KNTT / Cánh Diều / CTST đều dùng được; chỉ nội dung thuộc lớp 10.
5. **Mỗi ví dụ phải kèm lời giải (Hướng dẫn giải) đầy đủ từng bước**; ví dụ chỉ có đề / chỉ có đáp số ⇒ bỏ. Tính lại đáp số (node -e nếu cần) trước khi đưa;
   ví dụ trong nguồn mà tính lại ra lệch ⇒ KHÔNG đưa, ghi `ghi_chu`. Ví dụ phụ thuộc HÌNH VẼ mà đề không mô tả đủ bằng chữ ⇒ bỏ (kho không đưa ảnh vào cột này).
6. **Số lượng:** lý thuyết = đủ để học sinh hiểu dạng (thường 1–3 khối `##TC` / `##PP` / `##CY`); ví dụ = 1–3 ví dụ tiêu biểu, độ khó tăng dần. Không nhồi.
7. Trong cùng nhóm, đừng dùng một ví dụ cho 2 dạng nếu còn ví dụ khác.

## 3. ĐỊNH DẠNG (đúng như các dạng CEO đã nhập ở K7/K8)

**Lý thuyết** (`ly_thuyet`) — các khối bắt đầu bằng dấu hiệu, cách nhau một dòng trống:
- `##TC` + nội dung = **Tính chất / định nghĩa / quy tắc / công thức**
- `##PP` + nội dung = **Phương pháp giải** (thường "Bước 1. … Bước 2. …")
- `##CY` + nội dung = **Chú ý**
Công thức trong `$…$` (KaTeX): phân số `\dfrac{a}{b}`, véc tơ `\overrightarrow{AB}`, `\vec{a}`, góc `\widehat{ABC}`; xuống dòng bằng `\n`. KHÔNG ảnh (không URL).

**Ví dụ** (`vi_du`) — mỗi ví dụ một khối bắt đầu `##VD`, cách nhau một dòng trống:
```
##VD
Ví dụ 1: Cho tam giác $ABC$ có trọng tâm $G$. Chứng minh $\overrightarrow{GA}+\overrightarrow{GB}+\overrightarrow{GC}=\vec{0}$.
**Hướng dẫn giải:**
Gọi $M$ là trung điểm $BC$. Ta có $\overrightarrow{GB}+\overrightarrow{GC}=2\overrightarrow{GM}$ …
```
Mỗi bước một dòng.

## 4. Tự kiểm trước khi nộp

- Đọc lại `<G>.out.json` hợp lệ JSON; mọi `dang_id`/`nhom_id` có trong `<G>.in.json`; không ghi vào trường mà `can_dien_*` = false.
- Số `$` chẵn trong từng chuỗi; không còn thẻ `[[...]]`, ký tự lạ; mỗi chuỗi không rỗng có `nguon_*`.
- Kiểm KaTeX: từ thư mục repo, `katex.renderToString(x,{throwOnError:true})` cho mọi đoạn `$…$` — không lỗi.

## 5. Trả lời cuối (≤ 150 từ)

Số dạng bạn đã điền đủ LT+VD · chỉ LT · chỉ VD · để trống (lý do 1 dòng mỗi dạng trống) · số nhóm đã điền LT · chỗ nào nguồn mâu thuẫn bản đồ cũ.
