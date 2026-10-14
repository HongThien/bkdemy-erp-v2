# Brief: điền LÝ THUYẾT + VÍ DỤ cho các DẠNG BÀI của bản đồ kiến thức mới lớp 7 (phần Đại) — 14/10/2026

> CEO (Thùy) 14/10: *"Bản đồ kiến thức lớp 7 mới phần đại số đã fill xong dạng bài và mô tả. M hãy fill lý thuyết và ví dụ tương ứng với mỗi
> dạng bài. Lấy từ bản đồ cũ — lấy từ tài liệu trong folder tham khảo. Nếu vẫn không chắc chắn / không có thì để trống."*
> Người làm: trạm Sonnet. KHÔNG ghi DB (tôi — trạm điều phối — kiểm rồi mới ghi). KHÔNG sửa tệp nào của repo ngoài tệp kết quả của bạn.

## 1. Việc phải làm

Mỗi nhóm dạng (`G1`…`G4`) có tệp vào `Repo\kho-rules\dai\lo\k7-bdm\<G>.in.json`:

```
{ "nhom":     [ { nhom_id, nhom, nhom_mo_ta, nhom_ly_thuyet_ban_do_moi, bang_cu: [ { ma_dang_cu, ten_cu, noi_dung_cu } ] } ],
  "dang_bai": [ { dang_id, nhom_id, chuyen_de, dang, mo_ta, ly_thuyet_hien_co, vi_du_hien_co, can_dien_ly_thuyet, can_dien_vi_du } ] }
```

Với MỖI `dang_bai` có `can_dien_ly_thuyet` hoặc `can_dien_vi_du` = true, tìm nguồn và soạn nội dung ĐÚNG CHO DẠNG ĐÓ (không phải cả nhóm).
Trường đã có nội dung (`false`) thì KHÔNG đụng. Kết quả ghi vào `Repo\kho-rules\dai\lo\k7-bdm\<G>.out.json`:

```
[ { "dang_id": "NDB00793", "ly_thuyet": "<chuỗi, '' nếu để trống>", "vi_du": "<chuỗi, '' nếu để trống>",
    "nguon_ly_thuyet": "cu:T107010103 | pdf-kntt tr.12 | pdf-ndt tr.40 | '' ", "nguon_vi_du": "…", "ghi_chu": "…" } ]
```
Mỗi dạng một phần tử (kể cả dạng để trống cả hai trường — ghi `ghi_chu` vì sao).

## 2. LUẬT (quan trọng nhất)

1. **KHÔNG BỊA. Không chắc / không có nguồn ⇒ để chuỗi rỗng `""`.** Mọi câu lý thuyết và mọi ví dụ phải truy được về một nguồn thật (ghi vào `nguon_*`).
   Không tự "nghĩ ra" ví dụ, không tự viết lý thuyết "chắc đúng". Công thức toán đúng nhưng không có trong nguồn ⇒ vẫn để trống.
2. **Thứ tự nguồn:**
   1. `bang_cu[*].noi_dung_cu` (lý thuyết + ví dụ đã có trong bản đồ cũ của chính nhóm này) — ưu tiên nhất. Cắt đúng phần ứng với DẠNG
      (nhóm có thể gồm vài dạng: vd "Cộng trừ" vs "Nhân chia"). Chép nguyên văn, sửa tối thiểu (thiếu `$`, lệch dấu).
   2. Tài liệu trong `E:\BK ACADEMY\Tài liệu tham khảo\K7\`:
      - `phan-dang-va-bai-tap-mon-toan-7-tap-1-sach-ket-noi-tri-thuc-voi-cuoc-song.pdf` (131 trang, **KNTT**, Chương 1 Số hữu tỉ, Chương 2 Số thực… — ưu tiên số 1 trong tài liệu)
      - `ly-thuyet-va-phan-dang-bai-tap-toan-7-hoc-ki-1-ngo-duc-tai.pdf` (321 trang)
      - `chuyen-de-hoc-tap-toan-7-tap-1-chuong-trinh-moi-thong-nhat-sgk-le-minh-kha.pdf` (728 trang; có chuyên đề nâng cao — dãy phân số…)
      - `tai-lieu-hoc-tap-mon-toan-7-hoc-ki-1-nam-hoc-2025-2026.docx` (5,5 MB; công thức là ảnh WMF — chỉ dùng khi PDF không có)
   3. Không có ở đâu ⇒ `""`.
3. **Cách đọc PDF:** `pdftotext -layout -f P -l P "<pdf>" -` để TÌM trang chứa dạng (grep từ khoá), nhưng pdftotext làm vỡ phân số / số mũ / căn ⇒
   **xem ảnh trang để chép công thức**: `pdftoppm -r 110 -png -f P -l P "<pdf>" "<thư mục tạm>\tr"` rồi Read ảnh. Thư mục tạm: `C:\Users\WBPC\AppData\Local\Temp\k7bdm_<G>\` (tự tạo).
4. **Đúng dạng.** Ví dụ phải đúng DẠNG theo `mo_ta` (vd dạng "Hiệu – Tích dạng chuẩn" thì ví dụ tử số = hiệu hai thừa số mẫu, tử giống nhau; không đưa ví dụ
   của dạng "Nhân và Chia tử"). Lý thuyết phải đúng phạm vi dạng; lý thuyết chung của cả nhóm đã nằm ở nhóm — chỉ chép phần cần để làm dạng đó.
5. **Kiến thức lớp 7 / KNTT** — nguồn nâng cao (Lê Minh Khá, Ngô Đức Tài) dùng được cho dãy phân số nâng cao; nhưng nếu ví dụ dùng kiến thức lớp 8+ (hằng đẳng thức,
   phương trình bậc hai, Pytago…) thì KHÔNG đưa vào.
6. **Mỗi ví dụ phải kèm lời giải (Hướng dẫn giải) đầy đủ từng bước**; ví dụ chỉ có đề / chỉ có đáp số ⇒ bỏ. Kiểm đáp số bằng `node -e` (phân số chính xác) trước
   khi đưa vào; ví dụ trong nguồn mà tính lại ra lệch ⇒ KHÔNG đưa, ghi `ghi_chu`.
7. **Số lượng:** lý thuyết = đủ để học sinh hiểu dạng (thường 1–3 khối `##TC` / `##PP` / `##CY`); ví dụ = 1–3 ví dụ tiêu biểu theo độ khó tăng dần (nếu nguồn có).
   Không nhồi.

## 3. ĐỊNH DẠNG (đúng như các dạng CEO đã nhập)

**Lý thuyết** (`ly_thuyet`) — các khối bắt đầu bằng dấu hiệu (cách nhau một dòng trống):
- `##TC` + nội dung = **Tính chất / định nghĩa / quy tắc**
- `##PP` + nội dung = **Phương pháp giải** (thường "Bước 1. … Bước 2. …")
- `##CY` + nội dung = **Chú ý**
Chữ ngay sau dấu hiệu có thể là tiêu đề (`##PPPhương pháp giải:` hoặc `##PP Để so sánh …:`), như bản đồ cũ. Công thức trong `$…$`, phân số `\dfrac{a}{b}`,
số mũ `a^{n}`, hỗn số `1\dfrac{1}{5}`, tập `\mathbb{Q}`; xuống dòng bằng `\n`. KHÔNG ảnh (không có URL).

**Ví dụ** (`vi_du`) — mỗi ví dụ một khối bắt đầu bằng `##VD` (cách nhau một dòng trống):
```
##VD
Ví dụ 1: So sánh các số hữu tỉ: $\dfrac{-3}{4}$ và $\dfrac{-2}{3}$;
**Hướng dẫn giải:**
Ta có: $\dfrac{-3}{4} = \dfrac{-9}{12}$; $\dfrac{-2}{3} = \dfrac{-8}{12}$, mà $\dfrac{-9}{12} < \dfrac{-8}{12} \Rightarrow \dfrac{-3}{4} < \dfrac{-2}{3}$.
```
Dòng lời giải: mỗi bước một dòng; dấu nhân là `\cdot` hoặc `.` đúng như nguồn (CEO không ép chuẩn ở bản đồ này).
Tham khảo: đọc `dang_bai` ở `in.json` đã có `ly_thuyet_hien_co` / `vi_du_hien_co` của các dạng CEO đã điền — bắt chước cách cắt và cách viết.

## 4. Tự kiểm trước khi nộp

- Chạy `node -e` đọc lại `<G>.out.json` hợp lệ JSON; mỗi `dang_id` có trong `<G>.in.json`; không ghi vào trường mà `can_dien_*` = false.
- Số `$` chẵn trong từng chuỗi; không còn `⟦`, `\n` thừa, ký tự lạ từ pdftotext (ligature, số mũ dính chữ).
- Mỗi chuỗi không rỗng có `nguon_*` tương ứng.

## 5. Trả lời cuối (≤ 150 từ)

Số dạng bạn đã điền đủ LT+VD · chỉ LT · chỉ VD · để trống (kèm lý do 1 dòng cho mỗi dạng trống) · chỗ nào nguồn mâu thuẫn bản đồ cũ.
