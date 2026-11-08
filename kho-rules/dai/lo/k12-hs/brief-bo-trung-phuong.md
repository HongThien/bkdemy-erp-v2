# Brief — BỎ HẾT hàm trùng phương khỏi nội dung K12 Hàm số (22/10)

Thùy: *"Bỏ hết trùng phương."* (giảm tải). Cây `cau-truc.mjs` đã bỏ dạng H2.1.2 "Hàm trùng phương, hàm bậc bốn" và H2.4.5. Việc của bạn: quét NỘI DUNG còn lại trong `ra/J*.txt` và `ra/N*.txt` (KHÔNG đụng `*.goc.txt`, `N2.v2-cu.*`, `J11–J13` — J11–J13 đã sạch) và loại mọi dấu vết hàm trùng phương $y=ax^4+bx^2+c$ (kể cả viết "bậc bốn trùng phương", hàm $y=x^4-2x^2+1$ dạng $x^4,x^2$ chỉ có luỹ thừa chẵn…).

Chỗ đã biết (có thể còn nữa — tự grep `trùng phương`, `x\^4`, `x\^\{4\}` và đọc ví dụ):
- `J1.txt` H1.2.2 (1 ví dụ) · `J2.txt` H2.2.2, H2.3.3 (mỗi dạng 1 ví dụ), lý thuyết **nhóm** H2.1 (khối `=== N H2.1`, dùng cho nhóm P1.3) · `J4.txt` H3.1.1 (1 ví dụ), H3.2.1 (1 ví dụ + lý thuyết nhắc 2 lần) · các khối nhóm khác nếu nhắc.
- `J2.txt` khối H2.1.2 và `J3.txt` khối H2.4.5 là dạng ĐÃ BỎ khỏi cây — để nguyên, không sửa.

## Cách xử lý
1. **Lý thuyết** (nhóm hoặc dạng) có nhắc trùng phương: viết lại câu/ý đó cho không còn nhắc (xoá ý, hoặc thay bằng hàm khác nếu cần thế chỗ). Giữ nguyên các phần còn lại; giữ khuôn ##TC/##PP/##CY, ##PP vẫn 2–7 bước.
2. **Ví dụ** là hàm trùng phương (hoặc hình đồ thị/bảng biến thiên của nó): bỏ ví dụ đó và **viết ví dụ mới cùng kiểu bài** nhưng trên hàm khác (bậc ba, phân thức nhất biến/bậc hai trên bậc nhất, hàm chứa căn…, tuỳ dạng), độ khó tương đương, đủ **2 ví dụ/dạng** (ví dụ 2 khó hơn ví dụ 1 một bậc). Tự tính, kiểm lại kết quả bằng `node` trước khi ghi. Nếu ví dụ cần hình: tự dựng `[[HINH {json}]]` theo `ve.mjs` rồi kiểm bằng `kiem.mjs` (hình vẽ thử được).
3. Ví dụ KHÔNG phải trùng phương (vd bậc bốn tổng quát $x^4-4x^3$, hàm khác) thì GIỮ NGUYÊN.
4. Ví dụ nhóm hàm cho P2 (J11–J13) đã thuần hàm — không sửa.

## Làm việc
- Sửa trực tiếp trong tệp `ra/J*.txt` / `ra/N*.txt` tương ứng bằng công cụ Edit/Write (không heredoc). Lưu ý tệp có thể CRLF.
- Kiểm: `node kho-rules/dai/lo/k12-hs/kiem.mjs kho-rules/dai/lo/k12-hs/ra/<tệp>.txt <mã dạng hoặc nhóm,… ngăn bằng dấu PHẨY>` lỗi 0 với từng khối bạn sửa (chạy từ thư mục repo `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2`; bỏ qua dòng "No character metrics").
- Cuối cùng chạy `grep -rn "trùng phương" kho-rules/dai/lo/k12-hs/ra/J1.txt J2.txt(chỉ ngoài khối H2.1.2) J3.txt(ngoài khối H2.4.5) J4.txt N*.txt` để chắc không còn.
- KHÔNG ghi DB; KHÔNG sửa tệp ngoài `ra/`; có thể dùng thư mục nháp `tam/BP/`.
- Trả lời cuối ≤ 120 từ: danh sách khối đã sửa (mã + sửa gì), số ví dụ mới viết, lỗi 0 chưa, còn nghi chỗ nào.
