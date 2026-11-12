# Brief trạm CHÉP SÁCH — lý thuyết + ví dụ cho bản đồ Vật lý 12 (Nhiệt + Khí)

Bối cảnh: bản đồ kiến thức Vật lý 12 đã có cây (nhóm bài · dạng bài). Giờ điền **lý thuyết của nhóm bài**, **mô tả nhóm bài**, **ví dụ của dạng bài** bằng nội dung CHÉP TỪ SÁCH "Nắm trọn kiến thức Vật lí 12 – Tập 1" (Đỗ Ngọc Hà). Sách là ảnh scan — đọc bằng Read với tham số `pages` (≤ 20 trang/lần).

Sách: `E:\BK ACADEMY\Vật Lý\VL12\841497160-EBOOK-NẮM-TRỌN-KIẾN-THỨC-MON-VẬT-LI-12-SGK-MỚI-TẬP-1-VẬT-LI-NHIỆT-VA-KHI-LI-TƯỞNG-THẦY-ĐỖ-NGỌC-HA-2 (1).pdf` (số trang PDF = số trang in + 2).
Thư mục `V` = `C:\Users\WBPC\AppData\Local\Temp\claude\24d31512a800046e\2841adcf-1e74-4adc-8c3a-09e8d60a01a7\scratchpad\vl`
Danh sách nhóm/dạng (mã thật trên DB + mô tả nhận biết): `V\nut-nhiet-khi.md` — ĐỌC HẾT trước khi chép. Mã nhóm `LNB…`, mã dạng `LDB…`.

## LUẬT CỨNG (CEO chốt — vi phạm = bỏ cả phần đó)
1. **Ví dụ PHẢI lấy nguyên trong sách** (đề + lời giải của sách). **Không tự bịa, không đổi số, không tự giải thay.** Lời giải sách viết tắt thì chép đúng như vậy (được viết lại cho đủ câu chữ nhưng giữ nguyên các bước và kết quả).
2. **Lý thuyết lấy từ sách** (mục "Kiến thức trọng tâm" và các khung lưu ý/phương pháp của sách). Được rút gọn, sắp lại cho gọn, nhưng KHÔNG thêm kiến thức sách không có. CEO cho phép: phần nhóm cần mà sách KHÔNG có thì được viết theo **SGK Vật lí 12 – Kết nối tri thức** (chương trình 2018), CHỈ khi bạn chắc chắn 100% nội dung đúng như SGK; mỗi khối viết theo SGK phải nằm trong trường riêng `ly_thuyet_sgk` (KHÔNG trộn vào `ly_thuyet` chép từ ebook) để người duyệt biết nguồn. Không chắc ⇒ để trống.
3. Không chắc nội dung thuộc nhóm/dạng nào ⇒ đưa vào `khong_khop` kèm trang, KHÔNG ép.

## Định dạng (bắt buộc — màn hiển thị theo thẻ)
- Công thức LaTeX trong `$…$`, đơn vị dùng `\text{}` (vd `$Q = mc\Delta t$`, `$c = 4200\ \text{J/(kg.K)}$`). Không dùng kí tự Unicode thay LaTeX cho công thức.
- **Lý thuyết** (`ly_thuyet` của NHÓM): mỗi đoạn mở bằng MỘT thẻ đứng đầu dòng, có thể kèm tiêu đề: `##ĐN <tiêu đề>` định nghĩa · `##ĐL <tên định luật>` định luật · `##TC <tiêu đề>` công thức/tính chất/kiến thức cần nhớ · `##CY` chú ý/lưu ý · `##PP <tiêu đề>` phương pháp giải (mỗi dòng không trống = 1 bước, KHÔNG gõ "Bước 1") · `##NX` nhận xét. Khối kết thúc ở **dòng trống**; trong 1 khối KHÔNG có dòng trống. Gạch đầu dòng dùng `- `. **Lý thuyết KHÔNG chứa ví dụ** (không `##VD`, không "Ví dụ", không "Bài giải").
- **Ví dụ** (`vi_du` của DẠNG): mỗi ví dụ là
  ```
  ##VD
  <toàn bộ đề, các phương án A. B. C. D. mỗi phương án 1 dòng, KHÔNG có dòng trống trong đề>

  Bài giải:
  <các dòng lời giải, KHÔNG dòng trống — trừ trước ý b/c/d>
  ```
  Các ví dụ cách nhau 1 dòng trống. Tối đa **3 ví dụ/dạng**, chọn đa dạng (dễ → khó, khác bối cảnh). Câu trắc nghiệm ghi rõ đáp án cuối lời giải ("Chọn B."). **Bỏ ví dụ cần hình vẽ/đồ thị mới hiểu được** (không chèn được hình). **Bỏ ví dụ dạng Đúng–Sai 4 ý.**
- `mo_ta` của NHÓM: 1–2 câu, nhóm này gồm những kiến thức/việc gì (để giáo viên đọc là hiểu phạm vi), viết từ chính nội dung sách + mô tả các dạng con.

## Đầu ra: `V\ebook\<TRAM>.json` (UTF-8, parse được)
```
{ "tram":"A", "trang_doc":"10-36",
  "nhom":[{"id":"LNB…","mo_ta":"…","ly_thuyet":"… (chép ebook)","ly_thuyet_sgk":"… (chỉ phần viết theo SGK KNTT, có thể rỗng)","trang":[12,13]}],
  "dang":[{"id":"LDB…","vi_du":"##VD\n…\n\nBài giải:\n…","so_vd":2,"trang":[20,21]}],
  "khong_khop":[{"trang":30,"noi_dung":"…","goi_y":"…"}],
  "ghi_chu":"…" }
```
Chỉ ghi nhóm/dạng có nội dung từ ĐÚNG khoảng trang của bạn (khoảng trang giao ở dưới). Một nhóm có thể được trạm khác cũng ghi (sách nhắc lại ở chủ đề khác) — cứ ghi phần của bạn, người tổng hợp sẽ gộp.
Tự kiểm bằng `node -e` (đường dẫn `C:/Users/...`): JSON parse được; mọi id có trong nut-nhiet-khi.md; `ly_thuyet` không chứa `##VD`/"Bài giải"; mọi đoạn lý thuyết mở bằng thẻ `##`; mỗi `##VD` đều có "Bài giải:". Không có Python. Không ghi DB, không sửa file nào khác.

## Trả lời cuối (≤ 100 từ)
Trang đã đọc · số nhóm có lý thuyết · số dạng có ví dụ (tổng số VD) · nhóm/dạng trong khoảng trang của bạn mà sách KHÔNG có nội dung · chỗ đọc ảnh không chắc (trang, công thức nào).
