# Brief trạm ĐỌC (lô bão hoà) — gắn câu đề Vật lý 12 vào CÂY DẠNG hiện có

Bối cảnh: trung tâm đã dựng bản đồ kiến thức Vật lý 12 (cây hiện tại) từ 50 đề thi thật. Giờ đọc thêm từng lô 20 đề để xem cây đã **đủ** chưa: câu nào khớp một dạng trong cây thì gắn; câu nào KHÔNG khớp sạch dạng nào thì ghi `NEW` — số `NEW` là thước đo cây còn thiếu. **Đừng ép câu vào dạng gần đúng** (làm vậy là che mất dạng thiếu); nhưng cũng đừng tạo `NEW` chỉ vì đề đổi bối cảnh/số liệu mà cách giải y hệt một dạng có sẵn.

Thư mục `V` = `C:\Users\WBPC\AppData\Local\Temp\claude\24d31512a800046e\2841adcf-1e74-4adc-8c3a-09e8d60a01a7\scratchpad\vl`

## Đọc
1. **Cây dạng:** `V\cay-v2.md` (đọc HẾT, kể cả mô tả nhận biết từng dạng). Mã dạng dạng `K2.1.3`. Chương: `NHIET` · `KHI` · `TU` · `HN`; `O` = ngoài 4 chương (Lý 10/11, chủ đề khác); `HONG` = đề hỏng.
2. **Lô của bạn:** `V\<LO>\lo\lo-N.txt` — mỗi câu bắt đầu `### <id> | <TN|TLN>`, dòng `ĐỀ:` (có thể có `[DẪN CHUNG] … [CÂU] …`), có thể có `LỜI GIẢI:`. Công thức dạng ảnh có thể mất khi trích: suy từ lời dẫn + lời giải.

## Ghi `V\<LO>\kq\lo-N.tsv` (UTF-8, tab, KHÔNG dòng tiêu đề, đúng 1 dòng / câu, đúng thứ tự lô)
`id` ⇥ `chuong` ⇥ `dang` ⇥ `mo_ta` ⇥ `muc` ⇥ `chac` ⇥ `ghi_chu`
- `dang`: mã dạng trong cây (vd `T2.1.3`) · không khớp sạch: `NEW` · không chắc chương: `?`.
- `mo_ta`: trống nếu khớp mã. Nếu `NEW`/`O`/`?`: **một cụm ≤ 14 từ** mô tả KIỂU câu (dấu hiệu đề + việc phải làm, không số liệu), chuẩn hoá để câu cùng kiểu cùng cách viết. Với `NEW` thêm ở `ghi_chu`: dạng gần nhất trong cây + vì sao không khớp (vd "gần K3.2.2 nhưng là hỗn hợp 2 khí, cần định luật Dalton").
- `muc`: 1 nhận biết · 2 thông hiểu · 3 vận dụng · 4 vận dụng cao.
- `chac`: `1` chắc · `0` lưỡng lự (lý do ở `ghi_chu`).

## Luật gắn
- **Dạng = cách giải.** Nhiều dạng trong cây tách cặp "Nhận biết …" (không tính, chọn phát biểu/công thức/đơn vị) và "Tính …" (thay số): câu chọn công thức ⇒ dạng nhận biết; câu thay số ⇒ dạng tính.
- Câu thực tế/thí nghiệm: theo kiến thức lõi để giải; câu về dụng cụ/bước làm/xử lý số liệu/sai số thí nghiệm nhiệt ⇒ `N4.4.1`, thí nghiệm khác ⇒ `NEW` "Thí nghiệm …".
- Câu dùng 2 kiến thức ⇒ gắn theo bước quyết định/khó nhất, bước kia ghi `ghi_chu`.
- Đoạn ĐỀ dính chữ của câu khác (rác trích) ⇒ gắn theo phần đầu, ghi `ghi_chu`.

## Cách làm
Read lô theo khoảng cho tới hết; ghi TSV; **chỉ ghi đúng file `lo-N.tsv` của bạn** (thư mục `kq` dùng chung — không tạo file tạm trong đó; cần nháp thì dùng `V\<LO>\nhap-N\`). Tự kiểm bằng `node -e` (đường dẫn `C:/Users/...`): số dòng = số `### `, 7 cột, đúng thứ tự id. Không có Python.

## Trả lời cuối (≤ 100 từ)
Số dòng · phân bố chương · số `NEW`/`?`/`O` · **các kiểu `NEW` (tên chuẩn hoá + số câu + dạng gần nhất)** · dạng nào trong cây bạn thấy mô tả mơ hồ/khó phân biệt với dạng cạnh nó.
