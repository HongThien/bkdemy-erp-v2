# Brief trạm ĐỌC — gắn CHƯƠNG + DẠNG cho câu đề thi Vật lý 12

Bối cảnh: trung tâm dựng **bản đồ kiến thức Vật lý 12** bám vào ĐỀ THI THẬT từ 2025 (đề chính thức Bộ GD, minh hoạ, thi thử của sở/trường), không bám sách. Việc của bạn: đọc một lô câu (đã bỏ câu Đúng–Sai), gắn chương + dạng cho từng câu. Sau đó máy đếm tần suất để đề xuất bản đồ.

Thư mục `V` = `C:\Users\WBPC\AppData\Local\Temp\claude\24d31512a800046e\2841adcf-1e74-4adc-8c3a-09e8d60a01a7\scratchpad\vl`

## Đọc
1. **Thực đơn dạng ứng viên:** `V\thuc-don.md` — 4 chương `NHIET` · `KHI` · `TU` · `HN`, cộng `O` (ngoài 4 chương: kiến thức Lý 10/11 hoặc chương khác) và `HONG`. Mỗi dòng `- mã tên` là một DẠNG ứng viên. **Chỉ là gợi ý để gắn nhãn thống nhất, KHÔNG phải đáp án** — câu không khớp sạch dạng nào thì ghi `NEW`, đừng ép.
2. **Lô của bạn:** `V\b1\lo\lo-N.txt`. Mỗi câu bắt đầu bằng `### <id> | <TN|TLN>`, dòng `ĐỀ:` (có thể có `[DẪN CHUNG] …` = đoạn đề chung cho nhiều câu, `[CÂU] …` = phần riêng), và có thể có `LỜI GIẢI:` (đọc để biết CÁCH GIẢI — dạng = cách giải). Công thức dạng ảnh đã mất khi trích (chỗ trống, "A. . B. ."): suy từ lời dẫn + lời giải.

## Ghi `V\b1\kq\lo-N.tsv` (UTF-8, tab, KHÔNG dòng tiêu đề, đúng 1 dòng / câu, đúng thứ tự lô)
`id` ⇥ `chuong` ⇥ `dang` ⇥ `mo_ta` ⇥ `muc` ⇥ `chac` ⇥ `ghi_chu`
- `chuong`: `NHIET` · `KHI` · `TU` · `HN` · `O` · `HONG`.
- `dang`: mã trong thực đơn (vd `K2.1`) · không khớp sạch: `NEW` · không chắc chương: `?`.
- `mo_ta`: để trống nếu `dang` là mã khớp. Nếu `NEW`, `O` hoặc `?`: **một cụm ≤ 14 từ** mô tả KIỂU câu (dấu hiệu đề + việc phải làm, KHÔNG nêu số liệu), chuẩn hoá để câu cùng kiểu có cùng cách viết (đọc lướt cả lô trước khi đặt tên, rồi dùng lại tên đã đặt). Với `O` ghi chủ đề (vd `Lý 11: điện trường`).
- `muc`: 1 nhận biết · 2 thông hiểu · 3 vận dụng · 4 vận dụng cao.
- `chac`: `1` nếu chắc chương và dạng · `0` nếu lưỡng lự (lý do ngắn ở `ghi_chu`, vd "giữa K3.1 và K3.3").
- `ghi_chu`: trống nếu không cần.

## Luật gắn
- **Dạng = cách giải.** Đọc lời giải (nếu có) để biết câu dùng công thức/định luật nào. Hai câu bề ngoài khác (bơm xe vs bọt khí) nhưng cùng giải bằng Boyle ⇒ cùng dạng K2.1, trừ khi thực đơn có dạng riêng cho kiểu thực tế đó (K2.5) và câu đúng kiểu đó.
- **Câu thực tế / thí nghiệm:** gắn theo kiến thức lõi dùng để giải; riêng câu hỏi về DỤNG CỤ, BƯỚC LÀM, XỬ LÝ SỐ LIỆU, SAI SỐ của thí nghiệm thì gắn dạng thí nghiệm (vd N4.7) nếu có, không có thì `NEW` "Thí nghiệm …".
- Câu nhiều bước dùng 2 kiến thức (vd tính nhiệt lượng rồi dùng công suất) ⇒ gắn theo **bước quyết định / khó nhất**, ghi bước kia ở `ghi_chu`.
- Câu TLN thuộc cụm dẫn chung: mỗi câu gắn riêng theo phần nó hỏi.
- Không cần giải lại bài; cần hiểu câu đòi làm gì.

## Cách làm
Read lô theo khoảng (offset/limit) cho tới hết; Write TSV một lần (hoặc nối dần). Tự kiểm bằng `node -e` (đường dẫn kiểu `C:/Users/...`): số dòng TSV = số dòng `### ` trong lô, mỗi dòng 7 cột, id đúng thứ tự. Windows: Bash dùng `/c/Users/...`; không có Python.

## Trả lời cuối (≤ 100 từ)
Số dòng · phân bố chương · số `NEW`/`?`/`O`/`HONG` · các kiểu `NEW` hay lặp (tên chuẩn hoá + số câu) · vấn đề dữ liệu đáng báo.
