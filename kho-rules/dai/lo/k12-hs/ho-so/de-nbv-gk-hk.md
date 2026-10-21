# Hồ sơ nguồn: bộ đề NBV (giữa kì I + cuối kì I, Toán 12) — các câu Chương 1 Hàm số

Nguồn: `SP/txt/nbv/BO DE GK1/` (10 đề, mã `GK1`) và `SP/txt/nbv/BO DE HK1/` (15 đề: `HK1-CD`, `HK1-CTST`, `HK1-KNTT`, mỗi bộ 5 đề). Dữ liệu từng dòng: `SP/hoso/de-nbv-gk-hk.tsv` (327 dòng, 8 cột).

**Quy ước và độ tin cậy.** Mọi con số dưới đây do script đếm từ file TSV. Cột `muc` (NB/TH/VD/VDC) là **ước** từ vị trí câu trong đề và độ khó, không phải nhãn của nguồn. Tên `kieu` đã gộp về một bộ tên chung sau khi đọc hết 25 đề (bản thô có hơn 200 tên khác nhau, gộp còn 78). Cấu trúc mọi đề: Phần I trắc nghiệm 4 lựa chọn (12 câu), Phần II đúng–sai (2 câu x 4 ý), Phần III trả lời ngắn (4 câu), Phần IV (3 câu, ghi `TL`). Ở bộ HK1, Phần IV có dạng đáp số ngắn (không bắt trình bày), vẫn ghi `TL` theo tên phần trong đề.

Không đưa vào TSV (không thuộc Chương 1 hoặc không chắc): mọi câu vectơ/Oxyz/thống kê; GK1 đề 4 TLN2 (bài số ngày xăng, bất đẳng thức); GK1 đề 9 TLN3 (con lắc, lượng giác); KNTT đề 2 TL3 (robot tránh vật cản); CTST đề 2 TLN3 (parabol – đường tròn, đề bị cắt); CTST đề 5 TLN2 (dây dọi). Công thức trong GK1 đề 6, một phần đề 7 và đề 9 câu 4 là ảnh nên loại hàm được suy từ lời dẫn hoặc lời giải; hai dòng vẫn ghi "(loại hàm chưa rõ)".

## (a) Số câu/ý Hàm số của mỗi đề, chia theo phần

| Bộ | Đề | TN | ĐS (ý) | TLN | TL | Tổng |
|---|---|---:|---:|---:|---:|---:|
| GK1 | 1 | 9 | 4 | 3 | 2 | 18 |
| GK1 | 2 | 9 | 4 | 3 | 2 | 18 |
| GK1 | 3 | 9 | 4 | 2 | 2 | 17 |
| GK1 | 4 | 11 | 4 | 1 | 2 | 18 |
| GK1 | 5 | 11 | 4 | 3 | 2 | 20 |
| GK1 | 6 | 9 | 4 | 2 | 2 | 17 |
| GK1 | 7 | 10 | 4 | 3 | 2 | 19 |
| GK1 | 8 | 8 | 4 | 3 | 2 | 17 |
| GK1 | 9 | 8 | 4 | 2 | 2 | 16 |
| GK1 | 10 | 8 | 4 | 3 | 2 | 17 |
| HK1-CD | 1 | 7 | 4 | 2 | 1 | 14 |
| HK1-CD | 2 | 7 | 4 | 3 | 1 | 15 |
| HK1-CD | 3 | 6 | 0 | 3 | 1 | 10 |
| HK1-CD | 4 | 6 | 0 | 2 | 2 | 10 |
| HK1-CD | 5 | 4 | 0 | 2 | 2 | 8 |
| HK1-CTST | 1 | 4 | 0 | 1 | 1 | 6 |
| HK1-CTST | 2 | 4 | 0 | 0 | 1 | 5 |
| HK1-CTST | 3 | 4 | 0 | 2 | 1 | 7 |
| HK1-CTST | 4 | 6 | 4 | 2 | 1 | 13 |
| HK1-CTST | 5 | 6 | 4 | 2 | 1 | 13 |
| HK1-KNTT | 1 | 7 | 0 | 2 | 1 | 10 |
| HK1-KNTT | 2 | 4 | 0 | 3 | 1 | 8 |
| HK1-KNTT | 3 | 6 | 4 | 2 | 1 | 13 |
| HK1-KNTT | 4 | 6 | 0 | 2 | 2 | 10 |
| HK1-KNTT | 5 | 4 | 0 | 3 | 1 | 8 |

Tổng theo bộ:

| Bộ | Số đề | TN | ĐS (ý) | TLN | TL | Tổng | TB/đề |
|---|---:|---:|---:|---:|---:|---:|---:|
| GK1 | 10 | 92 | 40 | 25 | 20 | 177 | 17.7 |
| HK1-CD | 5 | 30 | 8 | 12 | 7 | 57 | 11.4 |
| HK1-CTST | 5 | 24 | 8 | 7 | 5 | 44 | 8.8 |
| HK1-KNTT | 5 | 27 | 4 | 12 | 6 | 49 | 9.8 |
| HK1 (3 bộ) | 15 | 81 | 20 | 31 | 18 | 150 | 10.0 |

## (b) Mỗi `kieu` xuất hiện trong bao nhiêu đề

Cột "GK1" là số đề trên 10; "HK1" là số đề trên 15, ngoặc là (CD/CTST/KNTT, mỗi bộ trên 5). "NB/TH/VD+" là số dòng theo mức ước (VD+ gồm VD và VDC).

| Kiểu | GK1 /10 | HK1 /15 (CD/CTST/KNTT) | Tổng đề /25 | Dòng | NB/TH/VD+ |
|---|---:|---|---:|---:|---|
| CỰC TRỊ: đọc điểm hoặc giá trị cực trị từ bảng biến thiên | 3 | 2 (2/0/0) | 5 | 5 | 4/1/0 |
| CỰC TRỊ: đếm số cực trị khi cho f'(x) bằng công thức | 1 | 2 (1/0/1) | 3 | 3 | 0/3/0 |
| CỰC TRỊ: đếm số cực trị từ bảng xét dấu của f' | 2 | 1 (1/0/0) | 3 | 3 | 3/0/0 |
| CỰC TRỊ: tìm điểm hoặc giá trị cực trị hàm đa thức cho bằng công thức | 2 | 1 (0/1/0) | 3 | 4 | 0/4/0 |
| CỰC TRỊ: đếm số cực trị của hàm ghép g=f±kx khi cho f' | 1 | 1 (0/1/0) | 2 | 2 | 0/0/2 |
| CỰC TRỊ: đếm số cực trị khi cho đồ thị của f' | 1 | 1 (0/0/1) | 2 | 2 | 1/1/0 |
| CỰC TRỊ: đọc điểm cực trị từ đồ thị | 1 | 1 (1/0/0) | 2 | 2 | 2/0/0 |
| CỰC TRỊ: số cực trị hàm phân thức bậc nhất (không có cực trị) | 2 | 0 (0/0/0) | 2 | 2 | 0/2/0 |
| CỰC TRỊ: tìm điểm cực đại hàm phân thức bậc 2/bậc 1 | 1 | 1 (1/0/0) | 2 | 2 | 0/2/0 |
| CỰC TRỊ: tính khoảng cách giữa hai điểm cực trị hàm bậc 3 | 1 | 1 (0/1/0) | 2 | 2 | 0/2/0 |
| CỰC TRỊ: đếm số điểm cực trị từ đồ thị | 1 | 0 (0/0/0) | 1 | 1 | 1/0/0 |
| CỰC TRỊ: khoảng cách hai điểm cực trị khi biết đồ thị của f' | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| CỰC TRỊ: số cực đại của hàm chứa trị tuyệt đối từ đồ thị | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| CỰC TRỊ: tìm m để hàm bậc 3 có hai cực trị thỏa hệ thức x1, x2 | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| ĐỒ THỊ-BBT: nhận dạng hàm số từ đồ thị | 8 | 13 (4/5/4) | 21 | 28 | 0/27/1 |
| ĐỒ THỊ-BBT: nhận dạng hàm số từ bảng biến thiên | 5 | 0 (0/0/0) | 5 | 5 | 0/3/2 |
| ĐỒ THỊ-BBT: chọn đồ thị đúng của hàm cho công thức | 3 | 1 (0/0/1) | 4 | 5 | 0/5/0 |
| ĐỒ THỊ-BBT: xác định hệ số hàm phân thức từ đồ thị hoặc bảng biến thiên | 2 | 2 (1/0/1) | 4 | 6 | 0/1/5 |
| ĐỒ THỊ-BBT: tìm giao điểm của đồ thị với trục tọa độ | 1 | 2 (0/1/1) | 3 | 3 | 3/0/0 |
| ĐỒ THỊ-BBT: tương giao đường thẳng với đồ thị (bậc 3, phân thức) | 1 | 2 (2/0/0) | 3 | 3 | 0/2/1 |
| ĐỒ THỊ-BBT: xác định dấu các hệ số từ đồ thị | 0 | 3 (1/1/1) | 3 | 3 | 0/1/2 |
| ĐỒ THỊ-BBT: ý khảo sát cơ bản: tập xác định, đạo hàm, nghiệm y'=0 | 2 | 1 (1/0/0) | 3 | 5 | 5/0/0 |
| ĐỒ THỊ-BBT: đếm số giao điểm hoặc số nghiệm f(x)=k | 2 | 0 (0/0/0) | 2 | 2 | 0/2/0 |
| ĐỒ THỊ-BBT: khảo sát và vẽ đồ thị hàm số (bậc 3, phân thức) | 2 | 0 (0/0/0) | 2 | 2 | 0/2/0 |
| ĐỒ THỊ-BBT: kiểm tra bảng biến thiên hoặc đồ thị của hàm cho công thức (ý khảo sát) | 1 | 0 (0/0/0) | 1 | 2 | 0/2/0 |
| ĐỒ THỊ-BBT: tính giá trị hàm bậc 3 xác định từ đồ thị | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| ĐƠN ĐIỆU: đọc khoảng đồng biến hoặc nghịch biến từ bảng biến thiên | 9 | 11 (4/5/2) | 20 | 22 | 21/1/0 |
| ĐƠN ĐIỆU: xét khoảng đồng biến, nghịch biến của hàm cho bằng công thức | 6 | 1 (1/0/0) | 7 | 8 | 0/8/0 |
| ĐƠN ĐIỆU: đọc khoảng đồng biến hoặc nghịch biến từ đồ thị | 2 | 1 (1/0/0) | 3 | 3 | 3/0/0 |
| ĐƠN ĐIỆU: đọc khoảng đơn điệu từ bảng xét dấu đạo hàm | 0 | 3 (1/0/2) | 3 | 3 | 2/1/0 |
| ĐƠN ĐIỆU: xét đơn điệu của f khi cho đồ thị của f' | 1 | 2 (1/0/1) | 3 | 3 | 0/3/0 |
| ĐƠN ĐIỆU: so sánh giá trị hàm tại hai điểm bằng dấu đạo hàm | 1 | 0 (0/0/0) | 1 | 2 | 0/1/1 |
| ĐƠN ĐIỆU: xét đơn điệu của hàm ghép g=f+kx khi cho đồ thị của f' | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| GTLN-GTNN: đọc GTLN, GTNN từ bảng biến thiên (trên đoạn hoặc khoảng) | 5 | 5 (1/2/2) | 10 | 10 | 6/4/0 |
| GTLN-GTNN: tìm GTLN-GTNN hàm đa thức trên đoạn | 5 | 5 (1/1/3) | 10 | 10 | 0/10/0 |
| GTLN-GTNN: đọc GTLN, GTNN từ đồ thị trên đoạn | 4 | 5 (3/1/1) | 9 | 9 | 9/0/0 |
| GTLN-GTNN: tìm GTLN-GTNN hàm phân thức (trên đoạn hoặc khoảng) | 2 | 1 (0/0/1) | 3 | 4 | 0/4/0 |
| GTLN-GTNN: hàm chứa căn trên tập xác định | 1 | 1 (1/0/0) | 2 | 2 | 0/2/0 |
| GTLN-GTNN: tìm GTLN hàm đa thức trên khoảng | 1 | 1 (1/0/0) | 2 | 2 | 0/2/0 |
| GTLN-GTNN: tìm GTLN trên đoạn khi cho đồ thị của f'(x) | 1 | 1 (1/0/0) | 2 | 2 | 0/1/1 |
| GTLN-GTNN: tìm GTLN-GTNN hàm cho công thức trên đoạn (loại hàm chưa rõ) | 2 | 0 (0/0/0) | 2 | 2 | 0/2/0 |
| GTLN-GTNN: đọc từ đồ thị với hàm tịnh tiến g=f+k | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| GTLN-GTNN: hàm chứa trị tuyệt đối trên đoạn | 0 | 1 (0/0/1) | 1 | 1 | 0/1/0 |
| GTLN-GTNN: tìm GTLN trên đoạn khi cho f'(x) bằng công thức | 0 | 1 (0/1/0) | 1 | 1 | 0/1/0 |
| HÀM BẬC 3: tìm m để tâm đối xứng nằm trên trục tung | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| HÀM BẬC 3: viết tiếp tuyến có hệ số góc lớn nhất | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| HÀM HỮU TỈ: tìm tâm đối xứng của đồ thị hàm phân thức | 5 | 2 (1/0/1) | 7 | 8 | 4/4/0 |
| HÀM HỮU TỈ: hình vuông có đỉnh trên đồ thị và trên đường thẳng, tìm diện tích | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| HÀM HỮU TỈ: tìm hệ số biết đồ thị đi qua điểm và có tâm đối xứng | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| THỰC TẾ: chuyển động s(t), v(t): vận tốc, gia tốc, thời điểm cực trị | 4 | 4 (1/1/2) | 8 | 14 | 2/6/6 |
| THỰC TẾ: tối ưu doanh thu theo mức giá (cho thuê, vé, giảm giá) | 2 | 5 (4/0/1) | 7 | 8 | 0/0/8 |
| THỰC TẾ: tối ưu hình học không gian (thể tích hoặc diện tích toàn phần) | 2 | 5 (1/2/2) | 7 | 7 | 0/0/7 |
| THỰC TẾ: tốc độ thay đổi f'(t) trong mô hình (logistic, lây bệnh, doanh số) | 2 | 4 (1/1/2) | 6 | 7 | 0/1/6 |
| THỰC TẾ: tối ưu lợi nhuận từ hàm doanh thu, chi phí, cầu | 1 | 5 (1/2/2) | 6 | 7 | 0/0/7 |
| THỰC TẾ: tối ưu đường đi qua hai môi trường (chi phí hoặc thời gian) | 2 | 3 (1/1/1) | 5 | 5 | 0/0/5 |
| THỰC TẾ: tối ưu hình học phẳng (diện tích lớn nhất hoặc nhỏ nhất) | 2 | 3 (2/0/1) | 5 | 6 | 0/0/6 |
| THỰC TẾ: lập hàm doanh thu, lợi nhuận, chi phí từ dữ kiện | 1 | 3 (0/2/1) | 4 | 8 | 7/1/0 |
| THỰC TẾ: tối ưu chi phí làm bể hình hộp có thể tích cho trước | 2 | 2 (1/1/0) | 4 | 4 | 0/0/4 |
| THỰC TẾ: hàm bậc ba mô hình hình dạng (đảo, quỹ đạo, địa hình) | 0 | 3 (0/1/2) | 3 | 3 | 0/0/3 |
| THỰC TẾ: mô hình y sinh cho sẵn biểu thức, tìm giá trị lớn nhất | 2 | 1 (1/0/0) | 3 | 3 | 0/0/3 |
| THỰC TẾ: mực nước h(t), tìm thời điểm lớn nhất | 1 | 2 (0/0/2) | 3 | 3 | 0/0/3 |
| THỰC TẾ: tối ưu máng, hành lang: thể tích hoặc diện tích thiết diện lớn nhất | 2 | 1 (0/0/1) | 3 | 4 | 0/0/4 |
| THỰC TẾ: tối ưu số máy hoặc mật độ sản xuất | 1 | 2 (0/1/1) | 3 | 4 | 0/0/4 |
| THỰC TẾ: chi phí, lợi nhuận trung bình: tiệm cận ngang hoặc xiên | 2 | 0 (0/0/0) | 2 | 3 | 0/0/3 |
| THỰC TẾ: tối ưu năng lượng cá bơi ngược dòng | 2 | 0 (0/0/0) | 2 | 2 | 0/0/2 |
| THỰC TẾ: chi phí trung bình nhỏ nhất | 0 | 1 (1/0/0) | 1 | 1 | 0/0/1 |
| THỰC TẾ: tốc độ liên quan giữa hai đại lượng | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| TIỆM CẬN: đọc hoặc đếm tiệm cận từ bảng biến thiên | 3 | 6 (2/2/2) | 9 | 10 | 4/6/0 |
| TIỆM CẬN: tìm tiệm cận ngang hàm phân thức | 4 | 3 (1/1/1) | 7 | 7 | 7/0/0 |
| TIỆM CẬN: đếm hoặc xét mệnh đề về tiệm cận của hàm cho bằng công thức | 4 | 0 (0/0/0) | 4 | 5 | 0/5/0 |
| TIỆM CẬN: đọc tiệm cận đứng hoặc ngang từ đồ thị | 2 | 2 (1/0/1) | 4 | 4 | 4/0/0 |
| TIỆM CẬN: tìm tiệm cận xiên hàm phân thức bậc 2/bậc 1 | 4 | 0 (0/0/0) | 4 | 5 | 1/4/0 |
| TIỆM CẬN: tìm tiệm cận đứng hàm phân thức | 3 | 0 (0/0/0) | 3 | 3 | 3/0/0 |
| TIỆM CẬN: tìm tiệm cận xiên hàm dạng ax+b+c/(x-d) | 1 | 2 (0/2/0) | 3 | 3 | 0/3/0 |
| TIỆM CẬN: bài toán hình học gắn với tiệm cận (khoảng cách, diện tích, điểm thuộc) | 1 | 1 (1/0/0) | 2 | 3 | 0/1/2 |
| TIỆM CẬN: tìm m để đồ thị có đúng 2 tiệm cận đứng | 1 | 0 (0/0/0) | 1 | 1 | 0/0/1 |
| TIỆM CẬN: tìm tiệm cận đứng và ngang hàm phân thức | 1 | 0 (0/0/0) | 1 | 1 | 1/0/0 |
| TIỆM CẬN: xác định tiệm cận ngang từ giới hạn cho trước | 1 | 0 (0/0/0) | 1 | 1 | 1/0/0 |

Tổng: 78 kiểu, 327 dòng.

Gộp theo mảng:

| Mảng | GK1 dòng (/177) | HK1 dòng (/150) |
|---|---:|---:|
| ĐƠN ĐIỆU | 23 (13%) | 19 (13%) |
| CỰC TRỊ | 20 (11%) | 11 (7%) |
| GTLN-GTNN | 23 (13%) | 21 (14%) |
| TIỆM CẬN | 29 (16%) | 14 (9%) |
| HÀM HỮU TỈ | 8 (5%) | 2 (1%) |
| ĐỒ THỊ-BBT | 34 (19%) | 31 (21%) |
| THỰC TẾ | 38 (21%) | 52 (35%) |
| HÀM BẬC 3 | 2 (1%) | 0 (0%) |

## (c) Kiểu chỉ xuất hiện ở 1 đề

| Kiểu | Đề | Câu | Mức ước |
|---|---|---|---|
| CỰC TRỊ: đếm số điểm cực trị từ đồ thị | GK1 đề 2 | Câu 2 | NB |
| CỰC TRỊ: khoảng cách hai điểm cực trị khi biết đồ thị của f' | GK1 đề 4 | Câu 1 | VDC |
| CỰC TRỊ: số cực đại của hàm chứa trị tuyệt đối từ đồ thị | GK1 đề 2 | Câu 1 | VD |
| CỰC TRỊ: tìm m để hàm bậc 3 có hai cực trị thỏa hệ thức x1, x2 | GK1 đề 5 | Câu 1 | VD |
| ĐỒ THỊ-BBT: kiểm tra bảng biến thiên hoặc đồ thị của hàm cho công thức (ý khảo sát) | GK1 đề 3 | Câu 1c, Câu 1d | TH, TH |
| ĐỒ THỊ-BBT: tính giá trị hàm bậc 3 xác định từ đồ thị | GK1 đề 5 | Câu 4 | VD |
| ĐƠN ĐIỆU: so sánh giá trị hàm tại hai điểm bằng dấu đạo hàm | GK1 đề 4 | Câu 2, Câu 1c | TH, VD |
| ĐƠN ĐIỆU: xét đơn điệu của hàm ghép g=f+kx khi cho đồ thị của f' | GK1 đề 7 | Câu 1d | VD |
| GTLN-GTNN: đọc từ đồ thị với hàm tịnh tiến g=f+k | GK1 đề 1 | Câu 1 | VD |
| GTLN-GTNN: hàm chứa trị tuyệt đối trên đoạn | HK1-KNTT đề 4 | Câu 2 | TH |
| GTLN-GTNN: tìm GTLN trên đoạn khi cho f'(x) bằng công thức | HK1-CTST đề 3 | Câu 2 | TH |
| HÀM BẬC 3: tìm m để tâm đối xứng nằm trên trục tung | GK1 đề 3 | Câu 11 | VD |
| HÀM BẬC 3: viết tiếp tuyến có hệ số góc lớn nhất | GK1 đề 5 | Câu 12 | VD |
| HÀM HỮU TỈ: hình vuông có đỉnh trên đồ thị và trên đường thẳng, tìm diện tích | GK1 đề 8 | Câu 4 | VDC |
| HÀM HỮU TỈ: tìm hệ số biết đồ thị đi qua điểm và có tâm đối xứng | GK1 đề 3 | Câu 2 | VD |
| THỰC TẾ: chi phí trung bình nhỏ nhất | HK1-CD đề 5 | Câu 1 | VD |
| THỰC TẾ: tốc độ liên quan giữa hai đại lượng | GK1 đề 7 | Câu 2 | VDC |
| TIỆM CẬN: tìm m để đồ thị có đúng 2 tiệm cận đứng | GK1 đề 4 | Câu 2 | VD |
| TIỆM CẬN: tìm tiệm cận đứng và ngang hàm phân thức | GK1 đề 2 | Câu 5 | NB |
| TIỆM CẬN: xác định tiệm cận ngang từ giới hạn cho trước | GK1 đề 8 | Câu 5 | NB |

Có 20 / 78 kiểu chỉ xuất hiện ở đúng 1 đề (đã gộp tên). Xem thêm các kiểu xuất hiện ở đúng 2 đề: 15 kiểu.

## (d) Nhận xét

Các nhận xét dưới đây dựa trên số đếm ở (a)-(c); chữ "ước" nhắc rằng mức NB/TH/VD/VDC là do tôi ước.

**Giữa kì (GK1) khác cuối kì (HK1) thế nào**

1. **Mật độ Hàm số.** GK1 có 177 dòng / 10 đề (17,7 dòng/đề); HK1 có 150 dòng / 15 đề (10,0 dòng/đề). Phần I của GK1 có 8-11 câu Hàm số trên 12 câu (TB 9,2), còn HK1 chỉ 4-7 câu (TB 5,4) vì đề cuối kì chia chỗ cho vectơ và thống kê. Mọi đề GK1 đều có một câu Đúng–Sai thuần Hàm số (4 ý); ở HK1 chỉ 5/15 đề có (CD đề 1-2, CTST đề 4-5, KNTT đề 3), 10 đề còn lại Phần II là vectơ/Oxyz và thống kê.
2. **Cách hỏi.** GK1 thiên về hàm cho bằng công thức, tính tay: xét đơn điệu bằng công thức xuất hiện ở 6/10 đề GK1 nhưng 1/15 đề HK1; tìm tiệm cận xiên hàm bậc 2/bậc 1 ở 4 đề GK1 và 0 đề HK1; tìm tiệm cận đứng, đếm tiệm cận bằng công thức chỉ có ở GK1. HK1 thiên về đọc bảng biến thiên/đồ thị (đọc hoặc đếm tiệm cận từ bảng biến thiên: 6 đề HK1 / 3 đề GK1; nhận dạng hàm từ đồ thị: 13 đề HK1 / 8 đề GK1) và về bài thực tế (THỰC TẾ chiếm 35% dòng HK1, 52/150; GK1 là 21%, 38/177).
3. **Tự luận có nội dung riêng ở GK1.** Chỉ GK1 có câu khảo sát và vẽ đồ thị (đề 1, 6), nhận dạng hàm từ bảng biến thiên ở mức TN (5 đề), đếm nghiệm f(x)=k, tìm tâm đối xứng ở 5/10 đề (HK1: 2/15), và các câu tham số (tâm đối xứng nằm trên Oy, đúng 2 tiệm cận đứng, hai cực trị thỏa hệ thức Viète). HK1 có riêng: hàm bậc ba mô hình hình dạng (đảo, quỹ đạo, địa hình; 3 đề), xác định dấu hệ số từ đồ thị (3 đề), đọc đơn điệu từ bảng xét dấu đạo hàm (3 đề).
4. **Mức độ (ước).** GK1: NB 50, TH 77, VD 46, VDC 4 (VD+VDC = 28%). HK1: NB 44, TH 55, VD 47, VDC 4 (VD+VDC = 34%). Phần III (TLN) gần như toàn bộ là bài thực tế mức VD: 52/56 dòng TLN thuộc THỰC TẾ (24/25 đề có ít nhất một câu TLN thực tế).

**Kiểu nằm ở mức VD/VDC (ước)**

- Khối lớn nhất là THỰC TẾ: 73/101 dòng VD+VDC. Trong THỰC TẾ có 70 dòng VD và 3 VDC, chỉ 17 dòng ở mức NB/TH (chủ yếu là các ý lập hàm doanh thu/lợi nhuận và các ý của câu chuyển động trong Phần II).
- Ngoài THỰC TẾ, 28 dòng VD+ tập trung ở: (i) xác định hệ số hàm phân thức từ đồ thị/bảng biến thiên (5 trên 6 dòng, tức 4/5 đề có kiểu này ở mức VD); (ii) hàm ghép g=f±kx khi cho đồ thị f' (đơn điệu và cực trị: 3 dòng, 2 VD và 1 VDC); (iii) xác định dấu hệ số từ đồ thị (2/3); (iv) bài hình học gắn tiệm cận (2/3); (v) các câu tham số hoặc hàm đặc biệt chỉ gặp một lần: khoảng cách hai cực trị khi biết đồ thị f' (VDC), hình vuông có đỉnh trên đồ thị hàm phân thức (VDC), hàm chứa trị tuyệt đối, tiếp tuyến hệ số góc lớn nhất, tâm đối xứng nằm trên Oy, đúng 2 tiệm cận đứng.
- Các kiểu nền hầu như chỉ ở NB/TH: đọc khoảng đơn điệu, đọc/đếm cực trị, đọc GTLN-GTNN từ bảng/đồ thị, đọc tiệm cận, tìm tiệm cận ngang/đứng/xiên, tâm đối xứng, nhận dạng hàm từ đồ thị (27/28 dòng là TH; 1 dòng VD).

**Lưu ý khi dùng số liệu**

- 20/78 kiểu chỉ thấy ở 1 đề và 15 kiểu ở đúng 2 đề: phần lớn là kiểu mang tính một-lần (câu tham số, hàm ghép, câu "lạ"), nên không nên coi mỗi kiểu là một dạng bài độc lập khi dựng bản đồ; số đề thấy kiểu đó là bằng chứng yếu cho nhóm bài.
- Việc gộp tên kiểu (từ hơn 200 xuống 78) là phán đoán của tôi, ví dụ gộp "nghịch biến" với "đồng biến", "bậc 3" với "trùng phương" ở kiểu GTLN-GTNN đa thức. Muốn tách nhỏ hơn thì dùng cột `ghi_chu` và dòng thô trong TSV.
- Dữ liệu `co_hinh` = 1 nếu đề dùng ảnh bảng biến thiên/đồ thị cho dòng đó (GK1: 76/177 dòng; HK1: 80/150 dòng); câu có phương án là hình (ví dụ "chọn đồ thị đúng") cũng ghi 1.
