KẾT LUẬN: ĐẠT

# Biên bản soát — XS (Xác suất có điều kiện · Toàn phần · Bayes), 03/11

- 6 nhóm · 15 dạng · 30 ví dụ đã kiểm bằng máy (script riêng của trạm soát: `S\soat-XS\kt.mjs`, phân số chính xác BigInt; bài đếm thì liệt kê toàn bộ kết quả, không dùng công thức của trạm soạn) — 45/45 phép kiểm khớp đáp số.
- Hình: 0 (chương không dùng `dothi`/`bbt`); 1 bảng KaTeX (C1.2.1 VD1) — tổng ô = 120 khớp đề.
- Số liệu hợp lệ: mọi xác suất trong [0;1]; P(AB) ≤ min(P(A),P(B)) và P(A∪B) ≤ 1 ở mọi đề ký hiệu; hệ đầy đủ có tổng 1.
- Đối chiếu đề thi thật (`cau-dang.cjs`, 5–6 câu/dạng): 14/15 dạng ví dụ cùng loại và mức với đề thật; C2.2.2 thấp hơn mức đề (xem Cần CEO xem).
- Máy kiểm `kiem-moi.mjs XS`: lỗi 0, cảnh báo 0 (các dòng "No character metrics" là KaTeX báo chữ Việt trong `\text{}`, vô hại).
- Bản gốc trạm soạn: `noi-dung/XS.goc.txt`.
- Số chỗ đã sửa: 9.

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.1.2 | lý thuyết dạng | trình bày (lặp nhóm) | Bỏ dòng chép lại định nghĩa P(A\|B), P(B\|A) của nhóm; thay bằng công thức đổi chiều điều kiện qua P(AB): P(B\|A)=P(B)·P(A\|B)/P(A) (đề thi hay hỏi). |
| C1.1.2 | ví dụ 1 | trình bày | Số liệu cũ P(A)=0,4; P(B)=0,5; P(AB)=0,2 làm A, B tình cờ độc lập (P(A\|B)=P(A)), dễ gây hiểu nhầm; đổi P(AB)=0,15 → 0,3; 0,375; 0,7. |
| C1.1.2 | ví dụ 2 | lạc dạng nhẹ | Đề cũ cho sẵn P(AB) nên P(B\|A) tính thẳng; đổi sang kiểu đề thật (T1120000005538): cho P(A), P(B), P(A\|B) → tìm P(AB), P(B\|A), P(Ā\|B). Đáp số 0,24; 0,48; 0,4. |
| C1.2.1 | lý thuyết dạng | trình bày (lặp nhóm) + thiếu cách giải đề hay hỏi | Thay dòng tỉ lệ % (đã có ở nhóm) bằng ý "mỗi người thuộc ít nhất một nhóm ⇒ n(AB)=n(A)+n(B)−n" (đề thật T1120000004907, T1120000005606). |
| C1.2.2 | lý thuyết dạng | trình bày (lặp nhóm) | Thay dòng định nghĩa không gian mẫu thu hẹp (đã có ở nhóm) bằng n(B)=n(Ω)−n(không có … nào). |
| C1.3 | lý thuyết nhóm | toán (điều kiện) | Thêm điều kiện P(B)>0, P(A)>0 cho P(A\|B)=P(A), P(B\|A)=P(B). |
| C1.3.2 | lý thuyết dạng | trình bày (lặp nhóm) + thiếu cách giải đề hay hỏi | Thay dòng "độc lập ⇔ P(AB)=P(A)P(B)" (đã có ở nhóm) bằng quy tắc nhiều biến cố độc lập và "ít nhất một" = 1−∏P(Āᵢ) (mô tả dạng + đề thật T112000000531). |
| C2.1.2 | lý thuyết dạng | trình bày (lặp nhóm) | Thay dòng công thức toàn phần (đã có ở nhóm) bằng: đề cho P(B̄) thì suy P(B); hai nhánh cùng gốc tổng bằng 1 (đề thật T1120000005246). |
| C2.1.3 | lý thuyết dạng | trình bày (lặp nhóm) | Thay dòng P(A)=ΣP(Bᵢ)P(A\|Bᵢ) (đã có ở nhóm) bằng ý khâu kiểm tra không hoàn hảo (đề thật T1120000004998). |

Đã soát và giữ nguyên (đúng): C1.1.1 (2 VD đúng/sai từng ý, phản ví dụ xúc xắc đúng), C1.1.3, C1.2.1 VD, C1.2.2, C1.3.1, C1.3.2 VD (loại nghiệm x=1,3 đúng), C2.1.1, C2.1.2 VD, C2.1.3 VD, C2.2.1, C2.2.3 (xích hai ngày, 9/11 đúng), C2.3.1, C2.3.2 (45/49 đúng). Lý thuyết C2.1.1, C2.3.1 có nhắc lại công thức của nhóm ở dạng hai nhóm cụ thể — giữ vì đó chính là nội dung dạng (chọn công thức / thay số).

## Cần CEO xem
- C2.2.2: đề thật chủ yếu mức 4 (trò chơi rút thẻ nhiều bước, đi bộ ngẫu nhiên có điểm dừng, rương vàng–bạc); VD1 (đấu 3 ván) mức 2, VD2 (đồng xu lệch tung 3 lần) mức 3 và khá gần C2.1.3 — có cần thay VD2 bằng một trò chơi nhiều tầng thật không.
- C2.2.2: ##TC dùng công thức C_n^k·p^k(1−p)^(n−k) (lược đồ Bernoulli) — không có tên trong SGK Toán 12 CT 2018; giữ hay đổi thành "đếm số thứ tự × tích xác suất".
- C1.3.2: đề thật T1120000005624 (dậy sớm) có số liệu vô lí P(giao)=20% > P(giỏi)=10% — trạm soạn đã ghi; nên sửa đề gốc trong kho.
- C1.1.2: đề thật T1120000005532 cũng vô lí (P(AB)=0,40 > P(A)=0,26) — nên sửa đề gốc trong kho.
