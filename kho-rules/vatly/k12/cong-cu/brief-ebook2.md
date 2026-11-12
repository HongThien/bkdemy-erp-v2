# Brief trạm CHÉP SÁCH TẬP 2 — lý thuyết + ví dụ cho bản đồ Vật lý 12 (Từ trường + Hạt nhân)

Bối cảnh: bản đồ kiến thức Vật lý 12 đã có cây (nhóm bài · dạng bài). Điền **lý thuyết + mô tả của nhóm bài** và **ví dụ của dạng bài** bằng nội dung CHÉP TỪ SÁCH "Nắm trọn kiến thức Vật lí 12 – Tập 2: Từ trường và Vật lí hạt nhân" (Đỗ Ngọc Hà). Sách là ảnh scan — đọc bằng Read với tham số `pages` (≤ 20 trang/lần; đọc từng cụm nhỏ 5–10 trang cho rõ).

Sách: `E:\BK ACADEMY\Vật Lý\VL12\Nắm Trọn Kiến Thức Môn Vật Lý 12 2026 - Tập 2 Từ Trường Và Vật Lý Hạt Nhân (Thầy Đỗ Ngọc Hà).pdf`
**Số trang PDF = số trang in − 1** (trang in 8 = PDF 7). Mọi số trang trong brief/đầu ra là trang PDF.
Thư mục `V` = `C:\Users\WBPC\AppData\Local\Temp\claude\24d31512a800046e\2841adcf-1e74-4adc-8c3a-09e8d60a01a7\scratchpad\vl`
Danh sách nhóm/dạng (mã thật trên DB + mô tả nhận biết): `V\nut-tu-hn.md` — ĐỌC HẾT trước khi chép. Mã nhóm `LNB…`, mã dạng `LDB…`.

Cấu trúc mỗi chủ đề của sách: I. Kiến thức trọng tâm → Ví dụ mẫu (có lời giải ngay) → Bài tập tự luyện (đề) ; lời giải tự luyện ở phần B "ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI" cuối sách (trang giao bên dưới).

## LUẬT CỨNG (CEO chốt — vi phạm = bỏ cả phần đó)
1. **Ví dụ PHẢI lấy nguyên trong sách** (đề + lời giải của sách). **Không tự bịa, không đổi số, không tự giải thay.** Lời giải sách viết tắt thì chép đúng (được viết lại cho đủ câu chữ nhưng giữ nguyên các bước và kết quả). Nếu sách có lỗi in hiển nhiên (số không khớp phép tính) thì sửa VÀ ghi rõ vào `sua_in` (trang, sách in gì, sửa thành gì, kiểm lại thế nào); không chắc thì bỏ ví dụ đó.
2. **Lý thuyết lấy từ sách** (mục "Kiến thức trọng tâm" và các khung lưu ý/phương pháp). Được rút gọn, sắp lại, nhưng KHÔNG thêm kiến thức sách không có. Phần nhóm cần mà sách KHÔNG có thì được viết theo **SGK Vật lí 12 – Kết nối tri thức** (chương trình 2018), CHỈ khi chắc chắn 100%; khối đó để trong trường riêng `ly_thuyet_sgk`. Không chắc ⇒ để trống.
3. Không chắc nội dung thuộc nhóm/dạng nào ⇒ đưa vào `khong_khop` kèm trang, KHÔNG ép.

## Chọn ví dụ (tối đa 3 / dạng, đa dạng dễ → khó, khác bối cảnh)
- Ưu tiên "Ví dụ mẫu" có lời giải ngay trong chủ đề.
- Dạng còn thiếu ⇒ lấy **Bài tập tự luyện**: đề ở trang chủ đề + lời giải ở phần B, ghép theo (chủ đề, phần ①trắc nghiệm/②đúng-sai/③trả lời ngắn, số câu) — kiểm 2 lần, không chắc ghép đúng ⇒ bỏ. Phần B chỉ có bảng đáp án (không giải thích): dùng được cho dạng NHẬN BIẾT, lời giải ghi đúng `Chọn X.`; dạng TÍNH cần lời giải có bước, chỉ có chữ cái ⇒ bỏ.
- **Bỏ ví dụ cần hình vẽ/đồ thị mới hiểu** (không chèn được hình) — chỉ giữ nếu đề đã tả đủ bằng chữ. **Bỏ câu Đúng–Sai 4 ý.**
- Mỗi dạng ghi `nguon` cho từng ví dụ (nối " | "), vd `"Ví dụ mẫu 3 — tr.12"` hoặc `"BT tự luyện CĐ2 phần ① câu 7 — đề tr.25, giải tr.170"`.

## Định dạng (bắt buộc — màn hiển thị theo thẻ)
- Công thức LaTeX trong `$…$`, đơn vị dùng `\text{}` (vd `$F = BIl\sin\alpha$`, `$B = 0{,}5\ \text{T}$`, `$^{235}_{92}\text{U}$`). Không dùng kí tự Unicode thay LaTeX cho công thức. Vectơ `$\vec{B}$`.
- **Lý thuyết** (`ly_thuyet` của NHÓM): mỗi đoạn mở bằng MỘT thẻ đứng đầu dòng, có thể kèm tiêu đề: `##ĐN <tiêu đề>` định nghĩa · `##ĐL <tên>` định luật/quy tắc · `##TC <tiêu đề>` công thức/tính chất/kiến thức cần nhớ · `##CY` chú ý · `##PP <tiêu đề>` phương pháp giải (mỗi dòng không trống = 1 bước, KHÔNG gõ "Bước 1") · `##NX` nhận xét. Khối kết thúc ở **dòng trống**; trong 1 khối KHÔNG có dòng trống. Gạch đầu dòng `- `. **Lý thuyết KHÔNG chứa ví dụ** (không `##VD`, "Ví dụ", "Bài giải"). Không nhắc tới "Hình 1-2" (không có hình).
- **Ví dụ** (`vi_du` của DẠNG): mỗi ví dụ là
  ```
  ##VD
  <toàn bộ đề, phương án A. B. C. D. mỗi phương án 1 dòng, KHÔNG dòng trống trong đề>

  Bài giải:
  <lời giải, KHÔNG dòng trống — trừ trước ý b/c/d>
  ```
  Các ví dụ cách nhau 1 dòng trống. Trắc nghiệm ghi đáp án cuối lời giải ("Chọn B.").
- `mo_ta` của NHÓM: 1–2 câu, nhóm gồm những kiến thức/việc gì (giáo viên đọc là hiểu phạm vi).

## Đầu ra: `V\ebook2\<TRAM>.json` (UTF-8, parse được)
```
{ "tram":"P", "trang_doc":"7-16,166-167",
  "nhom":[{"id":"LNB…","mo_ta":"…","ly_thuyet":"…","ly_thuyet_sgk":"","trang":[7,8]}],
  "dang":[{"id":"LDB…","vi_du":"##VD\n…\n\nBài giải:\n…","so_vd":2,"trang":[12,13],"nguon":"… | …"}],
  "khong_khop":[{"trang":30,"noi_dung":"…","goi_y":"…"}],
  "sua_in":["…"],
  "ghi_chu":"…" }
```
Chỉ ghi nhóm/dạng có nội dung từ ĐÚNG khoảng trang của bạn. Nhóm có thể bị trạm khác cũng ghi — cứ ghi phần của bạn, người tổng hợp gộp. Ghi JSON bằng Write tool (escape `\` trong LaTeX thành `\` trong JSON).
Tự kiểm bằng `node -e` (đường dẫn `C:/Users/...`): JSON parse được; mọi id có trong nut-tu-hn.md; `ly_thuyet` không chứa `##VD`/"Bài giải"; mọi đoạn lý thuyết mở bằng thẻ `##`; mỗi `##VD` có "\n\nBài giải:"; đề ví dụ không có dòng trống. Không có Python. Không ghi DB, không sửa file nào khác.

## Trả lời cuối (≤ 100 từ)
Trang đã đọc · số nhóm có lý thuyết · số dạng có ví dụ (tổng VD) · dạng được giao mà sách KHÔNG có ví dụ dùng được (lý do) · chỗ sửa lỗi in · chỗ đọc ảnh không chắc.
