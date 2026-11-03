KẾT LUẬN: ĐẠT (sau khi sửa)

Trạm soát Opus · 03/11 · tệp `noi-dung/SDT.txt` (bản gốc trạm soạn: `SDT.goc.txt`)

- 6 nhóm · 10 dạng · 20 ví dụ, cả 20 tính lại bằng máy (script riêng `S\soat-SDT\kt.mjs`, không dùng script trạm soạn) · 0 hình (chương dùng bảng KaTeX) · 22 chỗ sửa.
- Toán: 20/20 đáp số của trạm soạn đều ĐÚNG (R, nhóm chứa, Q1/Q2/Q3, ΔQ, x̄, s², s, so sánh M1/M2, ghép nhóm số liệu thô, độ lệch chuẩn mẫu gốc). Lỗi tìm được là lặp lý thuyết nhóm–dạng, độ khó ví dụ, ca biên, và lý thuyết thiếu ý mà sách có.
- Máy kiểm `kiem-moi.mjs SDT`: lỗi 0, cảnh báo 0 (sau sửa).
- Đối chiếu sách (trạm soạn không đọc): NBV `12-14 SO DAC TRUNG DO PHAN TAN-GHEPNHOM` (A. Lý thuyết, B. Tự luận), Từ Tâm `C3-B1`, `C3-B2` (P1), PNL `Chương 3` (Bài 1 dạng 1–2, Bài 2 dạng 1). Công thức trong sách là ảnh WMF (MathType) nên chỉ đọc được lời; quy ước khớp SGK và khớp tệp soạn: Q_k = u_m + (kn/4 − C)/n_m · h; s² = (1/n)Σn_i(c_i − x̄)² = (1/n)Σn_ic_i² − x̄² (chia n, không n−1); giá trị đại diện = trung điểm; R = đầu mút phải nhóm cuối − đầu mút trái nhóm đầu có dữ liệu.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.1 | lý thuyết nhóm | trình bày (lặp) + thiếu ý sách | Nhóm 1 dạng mà ##PP/##CY của nhóm chép gần y hệt dạng. Viết lại: TC thêm nhóm cuối dạng đoạn, biểu đồ cột, **hiệu chỉnh nhóm số liệu rời rạc** (NBV, PNL), R ghép nhóm ≥ R gốc & nhạy ngoại lệ (Từ Tâm); ##PP đổi thành "Đọc một bảng (biểu đồ) ghép nhóm" |
| C1.1.1 | lý thuyết dạng | trình bày | Nhận 2 bẫy chuyển từ nhóm xuống (tần số 0 ở hai đầu; không dùng giá trị đại diện/tần số) |
| C1.2.1 | lý thuyết dạng | trình bày (lặp) | TC chép lại dòng "nhóm đầu tiên có tích luỹ ≥ kn/4" của nhóm → thay bằng bất đẳng thức cf_{m−1} < kn/4 ≤ cf_m, không cần độ dài nhóm, thứ tự ba nhóm |
| C1.2.2 | lý thuyết dạng | trình bày (lặp) + thiếu ý sách | TC chép lại công thức nội suy → thay bằng ý nghĩa 25/50/75%, soát u_m ≤ Q_k ≤ u_{m+1}, ca biên tích luỹ = kn/4 ⇒ Q_k = u_{m+1}, **giá trị ngoại lệ** Q1 − 1,5ΔQ / Q3 + 1,5ΔQ (mục `gop` NNB01264 đã định gửi vào dạng này) |
| C1.2.2 | lý thuyết dạng (##PP) | trình bày (lặp) | ##PP trùng ##PP nhóm → viết lại thành bảng đổi câu thực tế sang Q1/Q2/Q3 + soát |
| C1.2.2 | ví dụ 2 | ca biên | Tích luỹ đến hết [160;170) đúng bằng n/4 = 20 ⇒ Q1 = 170 rơi đúng đầu mút. Đổi tần số 6;14;30;20;10 → 6;16;28;20;10: Q1 = 168,75, Q3 = 185 (máy kiểm) |
| C1.2.3 | lý thuyết dạng | trình bày (lặp) | TC chép ΔQ = Q3 − Q1 của nhóm → thay: Q1, Q3 có bộ u_m/n_m/C riêng; công thức ΔQ = nh/(2n_m) khi cùng nhóm; giữ phân số khi đề hỏi a/b |
| C1.2.3 | ví dụ 2 | mức độ | VD2 cùng độ khó VD1 (chỉ đổi sang số thập phân). Đổi thành n = 36, hỏi ΔQ = a/b tối giản, tính a+b (kiểu đề "dạng m/n"): ΔQ = 107/126, a+b = 233 |
| C1.2.4 | lý thuyết dạng | trình bày (lặp) | Bỏ dòng định nghĩa ΔQ lặp nhóm, giữ ý "Q2 là dữ kiện thừa" + bẫy Q3−Q2/Q2−Q1 |
| C1.3 | lý thuyết nhóm (##PP) | trình bày (lặp) | ##PP nhóm trùng ##PP C1.3.1 → viết thành nguyên tắc chung (đại diện, trọng số n_i chia n, đi qua s²) |
| C1.3.1 | lý thuyết dạng | trình bày (lặp) | TC chép công thức s² của nhóm → thay: hàng c_i, n_ic_i, n_ic_i²; khi nào dùng công thức nào; máy tính đọc σx |
| C1.3.1 | lý thuyết dạng (##CY) | thiếu bẫy thật | Thêm bẫy đọc s_x (chia n−1) thay vì σ_x trên máy tính |
| C1.3.2 | lý thuyết dạng | trình bày (lặp) | TC chép công thức phương sai của nhóm → thay: s ≥ 0 (căn số học), s = 0 khi mọi số liệu cùng một nhóm, đơn vị s vs s² (lý do dùng s — NBV), tứ phân vị cũng không đo phân tán |
| C1.3.2 | lý thuyết dạng (##CY) | thiếu bẫy thật | Thêm bẫy ±3 và √32 = 4√2 (đề thật có cả hai phương án nhiễu này) |
| C2.1 | lý thuyết nhóm | trình bày (lặp) | Phép biến đổi mẫu có ở cả nhóm lẫn dạng → chỉ giữ ở dạng; ##PP nhóm viết lại thành "chọn tiêu chí so sánh" |
| C2.1.1 | lý thuyết dạng | thiếu ý sách + đề | TC: tịnh tiến / co giãn (s² nhân k²) / nhân tần số (cả R không đổi); **độ rủi ro đầu tư** = độ lệch chuẩn lợi nhuận, không so được khi trung bình khác xa (Từ Tâm dạng 4, NBV; đề T1120000003516) |
| C2.1.1 | lý thuyết dạng (##CY) | trình bày (lặp) | Bẫy 2 trùng TC → thay bằng bẫy "tần số gấp đôi không làm s gấp đôi" (phương án nhiễu 2s1 = s2 trong đề) |
| C2.2.1 | lý thuyết dạng | thiếu ý đề | TC thêm R gốc = x_max − x_min, R ghép ≥ R gốc (đề có câu "hiệu R ghép − R gốc"), công thức sai số tương đối |
| C2.2.1 | lý thuyết dạng (##PP) | trình bày (lặp) | ##PP lặp bước lập bảng của nhóm → tập trung vào bước so với mẫu gốc |
| C2.2.1 | ví dụ 2 | ca biên + trình bày | Dữ liệu cũ 3;3;3;3 ⇒ cả Q1 = 20 và Q3 = 40 rơi đúng đầu mút; dòng Σn_ic_i²/n viết "÷4" khó theo dõi. Đổi dãy số (tần số 2;4;4;2): ΔQ = 15, s ghép ≈ 9,574, s gốc ≈ 9,869, hiệu ≈ −0,3; thêm ý so R ghép = 40 với R gốc = 34 |
| C2.3.1 | lý thuyết dạng + ##PP | trình bày (lặp) | TC/PP chép x̄ của nhóm → thay: đọc biểu đồ cột, x̄ ghép nhóm là xấp xỉ, tìm tần số thiếu từ n; soát x̄ |
| (cuối tệp) | GHI CHÚ CHO CEO | — | Cập nhật: đã đối chiếu sách, ca biên, bỏ dòng "không đọc sách" |

## Kiểm từng ý được giao

- **Đúng dạng:** 10/10 dạng, ví dụ cùng loại câu đề thật (`cau-dang.cjs`, 6–8 câu/dạng). Không lạc dạng.
- **VD2 khó hơn VD1:** đạt ở 9/10 dạng sau sửa; C1.2.3 đã sửa. C1.2.2 VD2 (thực tế, hai ý) khó hơn VD1 về đọc đề dù ít phép tính hơn — chấp nhận.
- **Lý thuyết nhóm vs dạng không lặp:** trước sửa lặp ở 8 dạng (công thức/định nghĩa chép lại); đã gỡ.
- **Ca biên Q1 ở C1.2.2 VD2:** giá trị Q1 = 170 không sai (nội suy liên tục, tính theo nhóm kế tiếp cũng ra 170), nhưng HS dễ nhầm nhóm chứa ⇒ đã đổi số liệu. Cùng lỗi ở C2.2.1 VD2 cũng đã đổi.
- **##PP tạm trong khối nhóm:** máy kiểm bắt buộc mọi khối có ##PP nên nhóm phải có. Hợp lý ở C1.2 (quy trình chung cho 4 dạng). Ở C1.1, C1.3, C2.1, C2.3 ##PP nhóm trùng gần hết ##PP dạng ⇒ đã viết lại thành phương pháp cấp nhóm (đọc bảng, nguyên tắc chung, chọn tiêu chí). C2.2 giữ (lập bảng) và dời phần lặp ở dạng.
- **Sách có, đề hay hỏi, lý thuyết chưa phủ:** đã bổ sung rủi ro đầu tư, R gốc/ R ghép, biểu đồ cột, σx, căn số học. Sách có nhưng đề gần như không hỏi (0 câu): hiệu chỉnh nhóm, giá trị ngoại lệ — chỉ thêm 1 dòng lý thuyết, không thêm ví dụ.

## Cần CEO xem

- C1.2.1: quy ước "nhóm chứa Q_k" khi tích luỹ đúng bằng kn/4 khác nhau giữa các sách (cách "nhóm đầu tiên có tích luỹ ≥ kn/4" chọn nhóm đó; cách theo vị trí x_(n/4), x_(n/4+1) có thể chọn nhóm kế tiếp). Tệp đang theo cách thứ nhất (##CY C1.2.1); giá trị Q_k không đổi. Câu trắc nghiệm "nhóm chứa" rơi đúng ca này có thể có hai đáp án.
- C2.3.1 vẫn chờ CEO chốt H1 (giữ trong SDT hay chuyển về bản đồ lớp 11).
- C1.1: hiệu chỉnh nhóm đặt ở lý thuyết nhóm (1 dòng TC + 1 bước PP); đề K12 không có câu nào cần — nếu CEO muốn gọn thì bỏ được.
