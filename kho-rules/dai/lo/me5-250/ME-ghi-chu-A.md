# ME 250+ Bài toán chọn lọc lớp 5 (TKBooks) - ghi chú chép CĐ 1, 2, 3

Nguồn: ảnh trang `trang/p-NNN.jpg`. Tệp dữ liệu: `ME-CD01.json` (28 mục), `ME-CD02.json` (24 mục), `ME-CD03.json` (17 mục). Mã `VD n.k` = ví dụ k của CĐ n; `BT n.k` = Bài k phần "Bài tập vận dụng" CĐ n.

## CĐ1 - Bài toán cấu tạo số (tr.7-11 đề; tr.101-112 đáp án)

1. Các dạng sách liệt kê (mục lý thuyết, tr.8): (i) thay đổi vị trí các chữ số của một số tự nhiên; (ii) thêm, bớt các chữ số ở bên trái, bên phải một số tự nhiên; (iii) viết thêm các chữ số vào giữa một số tự nhiên; (iv) số tự nhiên và tổng các chữ số; (v) tách tích (phép nhân) dựa trên cấu tạo. Kèm kiến thức: cấu tạo hàng của số 2-5 chữ số; phân tích số theo nghìn/trăm/chục/đơn vị, theo "nghìn và đơn vị", "trăm và đơn vị", "chục và đơn vị".
2. Phương pháp chính: sách nêu 2 cách - Cách 1 đưa về dạng toán điển hình; Cách 2 dùng phân tích số để biến đổi quan hệ thành các đẳng thức đơn giản (cho số có số chữ số cụ thể). Thực tế mọi bài giải đều theo Cách 2: đặt số bằng chữ ($\overline{abc}$...), lập đẳng thức theo đề, "bớt cả hai vế", suy ra chữ số, thử chọn/xét trường hợp, rồi thử lại.
3. Cách trình bày lời giải:
   - Khuôn cố định: "Gọi số cần tìm là $\overline{abc}$ (a, b, c là các chữ số và a khác 0)." -> "Theo đề bài ta có: ..." -> chuỗi đẳng thức từng dòng, chú thích trong ngoặc "(bớt cả hai vế cho ...)" -> suy ra số -> "Thử lại: ... (thoả mãn)." -> "Vậy số cần tìm là ...".
   - Dùng mũi tên và ký hiệu đầu dòng (▸, ▶, →, ») để chia ý; trường hợp ghi "Trường hợp 1/2/3", "(loại)", "(thoả mãn)".
   - Dùng dấu gạch ngang trên đầu cho số nhiều chữ số; dùng $\overline{A}$ chữ hoa cho "khối" chữ số (BT 1.1, 1.5, 1.6).
   - Không có sơ đồ đoạn thẳng. Có dùng "chữ ẩn" (a, b, c, d, A) nhưng gắn với cấu tạo số (không phải ẩn x, y).
   - Trích: "Gọi số cần tìm là $\overline{abc}$ (a, b, c là các chữ số và a khác 0)" ; "$\overline{abc} = 1107 : 9$" , "Thử lại: 4123 - 1234 = 2889 (thoả mãn)."
4. Phương pháp vượt tiểu học / gọi ẩn:
   - Hầu hết đều "gọi chữ cái" (ẩn chữ số) và lập phương trình bậc nhất nhiều ẩn trên cấu tạo số rồi biện luận theo điều kiện chữ số (0-9): VD 1.1, VD 1.2, BT 1.4, 1.11-1.15, 1.17-1.24 (mức độ nặng nhất: BT 1.17 biện luận chia hết cho 25, chẵn/lẻ; BT 1.20, 1.21 chặn cận theo từng chữ số).
   - BT 1.25 và 1.26 dùng biến đổi phân số $\dfrac{\overline{ab}}{a+b} = 1 + \dfrac{9}{1+\frac{b}{a}}$ và so sánh giá trị lớn nhất/nhỏ nhất (đại số, vượt chương trình tiểu học).
   - BT 1.24 dùng số thập phân $\overline{a,bcd}$ nhân với 1111.
   - Nhóm BT 1.1-1.3, 1.5-1.10 là dạng "thêm/bớt chữ số ở đầu/cuối" có thể giải bằng sơ đồ đoạn, nhưng sách vẫn giải bằng chữ ẩn.

## CĐ2 - Dãy số (tr.12-17 đề; tr.112-126 đáp án)

1. Các dạng sách liệt kê / công thức ở mục lý thuyết (tr.12): dãy số cách đều (số số hạng = (cuối - đầu) : khoảng cách + 1; tổng = (đầu + cuối) x số số hạng : 2; số hạng thứ n = (n - 1) x khoảng cách + số hạng đầu; số cuối; số hạng đầu khi biết số cuối). Qua bài tập thấy các dạng: tìm quy luật dãy số (tổng 2 số liền trước, nhân, cộng dần...), tìm số hạng đầu/số hạng thứ n, số số hạng và tổng, đánh số trang sách (đếm chữ số), đếm chữ số/đếm chữ số 0, 1 trong dãy, chữ số thứ n của dãy liên tiếp, dãy chữ lặp có chu kỳ, dãy xếp bảng ngoằn ngoèo, đếm số chia hết (loại trừ).
2. Phương pháp chính: công thức dãy cách đều; chia nhóm theo số chữ số (1, 2, 3, 4 chữ số) rồi nhân; chia có dư theo chu kỳ (QUYET TAM HOC GIOI 15 chữ, chu kỳ 10 số của dãy học sinh, hàng 4 cột); ghép cặp cách đều đầu - cuối cho tổng chữ số (BT 2.17); đếm theo hàng (đơn vị, chục, trăm, nghìn) cho số chữ số 0 và 1 (BT 2.11); loại trừ (số chia hết cho 2 trừ số chia hết cho 6).
3. Cách trình bày:
   - Dùng ký hiệu đầu dòng ▶ ▸ » và "→"; hay in nghiêng/tô vàng mục "Quy luật:", "Nhận xét:". Câu kết "Vậy ..." có mũi tên ▶.
   - Công thức nêu bằng chữ rồi thay số: "Số hạng đầu tiên = Số cuối - (Số số hạng - 1) x Khoảng cách = 40 - (10 - 1) x 4 = 4."
   - Nhiều bài có "Cách 1 / Cách 2" (BT 2.13, 2.17, 2.21, 2.22). Có dùng dấu ngoặc nhọn gộp nhóm (BT 2.11, 2.17) - ảnh có, đã ghi chú trong JSON.
   - Không "Thử lại"; không sơ đồ; không gọi ẩn ngoại trừ BT 2.16 (x).
   - Trích: "Từ 10 đến 99 có: (99 - 10) : 1 + 1 = 90 (số có 2 chữ số)." ; "Quy luật: Mỗi số hạng (kể từ số hạng thứ 3) bằng tổng của hai số hạng đứng liền trước nó."
4. Vượt tiểu học / gọi ẩn: BT 2.16 gọi ẩn x, lập (10 + x) x (x - 9) : 2 = 5106 rồi "đoán" x = 101 bằng phân tích 5106 x 2 = 111 x 92 (không giải phương trình bậc hai tổng quát, nhưng là đoán kiểu tích hai thừa số hơn kém 19) - vượt mức. Còn lại phù hợp tiểu học (kể cả công thức tổng dãy cách đều). Bài khó/gần Olympic: BT 2.11b (đếm chữ số 0 và 1 theo hàng), BT 2.17 (ghép cặp), BT 2.19c, BT 2.22 (cách 2 dư 16).

## CĐ3 - Tính chẵn lẻ. Chữ số tận cùng (tr.18-21 đề; tr.127-136 đáp án)

1. Các dạng / kiến thức mục lý thuyết (tr.18): xác định chẵn - lẻ (tổng, hiệu, tích các số chẵn/lẻ); xác định chữ số tận cùng của tổng, của tích (chẵn x tận cùng 5 -> 0; lẻ x tận cùng 5 -> 5; tích tận cùng 1 hay 6; x.a không tận cùng 2, 3, 7, 8). Qua bài tập: chữ số tận cùng của tích/tổng, đếm số chữ số 0 tận cùng (phân tích thừa số 2 và 5), tìm n/K nhỏ nhất/lớn nhất theo số chữ số 0, bài "có hay không" chứng minh bằng chẵn lẻ/chữ số tận cùng, tìm số từ tích đã biết (24 024).
2. Phương pháp chính: chia nhóm các thừa số để chữ số tận cùng lặp (4 x 4 = ...6; nhóm 4 thừa số tận cùng 3 -> 1); đếm thừa số 5 (chia hết 5, 25, 125) ghép với thừa số 2; phản chứng chẵn/lẻ; tận cùng của tích hai số liên tiếp (0, 2, 6); chia hết cho 9 để tìm chữ số bị che.
3. Cách trình bày:
   - Mục "Nhận xét:" (in nghiêng/vàng) trước kết luận; ký hiệu ▸ ▶ » →; kết luận "Vậy ..." có mũi tên.
   - Dùng ký hiệu "$\overline{\ldots 6}$" (số tận cùng 6), "(có 1012 nhóm 4 x 4)", dấu ngoặc nhọn dưới biểu thức ghi số thừa số.
   - Có "Giả sử có số n thỏa mãn, ta có ... " (phản chứng) ở BT 3.13; "Loại" khi mâu thuẫn chẵn - lẻ ở BT 3.11, 3.15.
   - Có "Thử lại" ở BT 3.3, 3.5 (thỏa mãn); không sơ đồ.
   - Trích: "Nhận xét: Chữ số tận cùng của các tích lặp lại theo quy luật: 2; 2; 0; 6; 0." ; "Giả sử có số n thỏa mãn, ta có: ..."
4. Vượt tiểu học / gọi ẩn:
   - BT 3.13 lập n x (n + 1) = 4048 bằng công thức tổng 1 + 2 + ... + n = (1 + n) x n : 2 (gọi ẩn n, nhưng chỉ dùng để chặn chữ số tận cùng).
   - BT 3.14 dùng ký hiệu n! (giai thừa) - kiến thức vượt tiểu học (đề có định nghĩa kèm).
   - BT 3.6, 3.4 (c, d, e) dùng phân tích thừa số nguyên tố 5 theo 25, 125 (công thức Legendre dạng thủ công) - bài khó, nâng cao.
   - BT 3.12 dùng hiệu hai bình phương (a + b)(a - b) với a - b có nghĩa (tìm 1 cặp bằng tích 2024 x 2025 = 4050 x 1012).
   - BT 3.15 xét a < b < a + b và liệt kê phân tích 30 thành tích 3 thừa số - phù hợp.

## Bất thường cần người kiểm (đã ghi `chua_chac` trong JSON)

- VD 1.1: lời giải sách ngắt tr.8 -> tr.9, có thể thiếu dòng nối.
- BT 2.18: (a) đề in "từ chữ số thứ 11" nhưng 3 chữ số 1 liền nhau bắt đầu ở chữ số thứ 12 - ngờ lỗi in; (b) đáp số sách 555, nhưng theo chính phép tính của sách thì 5 chữ số 2 liên tiếp bắt đầu từ chữ số thứ 556 - ngờ sách sai 1 đơn vị.
- BT 2.22: đề ghi "4 cột" nhưng hình có 5 cột A-E.
- Số bài đề khớp số bài đáp án ở cả 3 CĐ (CĐ1: 26, CĐ2: 22, CĐ3: 15 bài tập + 2 ví dụ mỗi CĐ).
