# HS-cau-cuoi — báo cáo

Bảng cuối: `HS-cau-cuoi.tsv` (`id⇥dạng⇥ghi_chú`). Nguồn: `HS-cau.tsv` (ánh xạ sơ bộ) + đọc lại câu. Chỉ đổi khi đã đọc câu và chắc ≥ 90%; còn lại giữ ánh xạ sơ bộ.

## Kiểm đếm

- Tổng dòng: **3761** = số câu không-Đ/S của HS trong `dx/HS-ids.txt` (3768) trừ 7 câu đã loại khỏi kho có trong danh sách (2 câu T1120000005532, T1120000005624 vốn không có trong HS-ids). Mỗi câu đúng 1 dòng.
- Mọi mã dạng trong bảng đều có trong `HS.json` (hoặc là CHUONG:/CHUA).
- 3 câu chưa có trong ánh xạ sơ bộ (mã cũ `?`) đã gán: T1120000005918 → C4.4.4; T1120000005850, T1120000005852 → CHUA (đề trích thiếu câu hỏi).

## Số câu đổi dạng: 104

| cũ → mới | số câu |
|---|---|
| C3.1.2 → C3.1.1 | 17 |
| C4.4.2 → C4.4.5 | 8 |
| C2.2.2 → C2.1.1 | 8 |
| C1.2.2 → C2.4.3 | 8 |
| C1.4.3 → C3.3.2 | 8 |
| C4.4.2 → C4.4.6 | 7 |
| C2.2.5 → C2.2.6 | 6 |
| C2.2.1 → C2.1.1 | 6 |
| C2.5.3 → C2.5.6 | 4 |
| C2.5.3 → C2.5.5 | 3 |
| C2.2.5 → C2.2.2 | 3 |
| — → CHUA | 2 |
| C2.2.5 → C1.3.4 | 2 |
| C4.4.1 → C4.4.5 | 2 |
| C2.2.5 → C2.2.4 | 2 |
| C2.1.3 → C2.1.2 | 2 |
| C1.1.5 → CHUONG:NHTP | 1 |
| C2.1.1 → C2.1.3 | 1 |
| C2.1.3 → C2.4.2 | 1 |
| C4.4.3 → C4.4.6 | 1 |
| C2.1.2 → C3.1.1 | 1 |
| C1.3.6 → C1.1.4 | 1 |
| C1.3.1 → C1.3.6 | 1 |
| C2.1.1 → C2.1.2 | 1 |
| C1.1.1 → CHUONG:O | 1 |
| C4.4.3 → C4.1.1 | 1 |
| C4.1.3 → C4.4.6 | 1 |
| C3.3.1 → CHUONG:NHTP | 1 |
| C1.4.2 → C2.5.4 | 1 |
| — → C4.4.4 | 1 |
| C4.1.1 → CHUONG:SDT | 1 |
| C2.1.3 → CHUONG:VT | 1 |

Chi tiết từng câu:

| id | cũ | mới | lý do |
|---|---|---|---|
| T1120000005850 | — | CHUA | đề trích thiếu (chỉ có "có bảng biến thiên như sau", không có câu hỏi) |
| T1120000006638 | C2.2.5 | C2.2.6 | cực trị theo m nằm trong khoảng |
| T1120000006683 | C2.2.5 | C1.3.4 | GTLN trên nửa khoảng (đa thức có tham số) |
| T112020401351 | C4.4.1 | C4.4.5 | thuế đặc biệt t, tối ưu hai tầng |
| T112000000865 | C3.1.2 | C3.1.1 | giao điểm với trục hoành |
| T112020401078 | C4.4.2 | C4.4.5 | chọn mức thuế xuất khẩu a (cùng khuôn T112020401364) |
| T112010102167 | C2.5.3 | C2.5.6 | BPT chứa m có nghiệm trên đoạn |
| T112000000067 | C1.1.5 | CHUONG:NHTP | tính tích phân |
| T112010401053 | C2.5.3 | C2.5.5 | GTLN của f(u(x))+m từ đồ thị f |
| T112010402127 | C2.2.5 | C1.3.4 | tồn tại GTLN trên khoảng |
| T1120000005652 | C2.5.3 | C2.5.5 | so sánh f(a), f(b) từ đồ thị f′ |
| T112020302067 | C2.1.1 | C2.1.3 | đáp án là hàm bậc hai trên bậc nhất |
| T112000000384 | C2.1.3 | C2.4.2 | tâm đối xứng hàm bậc hai trên bậc nhất |
| T1120000006622 | C2.5.3 | C2.5.6 | biểu thức hai biến có ràng buộc |
| T112020104064 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo bảng biến thiên |
| T112020401107 | C4.4.2 | C4.4.5 | chọn mức thuế T để thuế cao nhất khi lợi nhuận cao nhất |
| T112010401141 | C2.5.3 | C2.5.5 | so sánh f(a), f(b) từ đồ thị f′ |
| T112020401112 | C4.4.2 | C4.4.6 | nhiên liệu tàu theo vận tốc |
| T1120000003719 | C4.4.3 | C4.4.6 | chi phí tàu theo vận tốc |
| T112020105010 | C1.2.2 | C2.4.3 | độ dài AB hai cực trị (bậc hai trên bậc nhất) |
| T112020105026 | C1.2.2 | C2.4.3 | trung điểm AB hai cực trị (bậc hai trên bậc nhất) |
| T1120000006574 | C1.2.2 | C2.4.3 | khoảng cách hai cực trị (bậc hai trên bậc nhất) |
| T1120000005931 | C2.2.5 | C2.2.4 | góc OAB với hai điểm cực trị |
| T1120000003458 | C3.1.2 | C3.1.1 | giao với hai trục |
| T112020105015 | C2.2.5 | C2.2.6 | cực trị theo m, hệ thức Viète |
| T112020201023 | C2.1.2 | C3.1.1 | giao với trục hoành (đọc đồ thị, giống T1120000006184) |
| T112010101044 | C1.3.6 | C1.1.4 | hỏi khoảng đồng biến từ đồ thị |
| T112010401057 | C1.3.1 | C1.3.6 | GTLN–GTNN từ bảng biến thiên |
| T112020202043 | C2.1.1 | C2.1.2 | đáp án là hàm nhất biến |
| T1120000001043 | C3.1.2 | C3.1.1 | giao với trục tung |
| T1120000005878 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T1120000003199 | C1.4.3 | C3.3.2 | chu vi tam giác tiệm cận xiên với hai trục |
| T112020104035 | C2.2.1 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T112010305071 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T112020401059 | C4.4.2 | C4.4.5 | chọn mức thuế xuất khẩu m (cùng khuôn T112020401364) |
| T112000000458 | C3.1.2 | C3.1.1 | giao với trục tung |
| T112000000975 | C3.1.2 | C3.1.1 | giao với trục hoành |
| T112020105007 | C2.2.5 | C2.2.6 | đạt cực trị tại điểm cho trước |
| T112020201026 | C3.1.2 | C3.1.1 | giao với trục hoành (đọc đồ thị) |
| T112000000607 | C3.1.2 | C3.1.1 | giao với trục tung |
| T112020105023 | C2.2.5 | C2.2.6 | không có cực trị theo m |
| T1120000006161 | C3.1.2 | C3.1.1 | giao với trục tung |
| T112020401370 | C4.4.2 | C4.4.5 | thuế phụ thu t lớn nhất |
| T1120000003029 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T1120000006502 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo bảng biến thiên |
| T112020105016 | C1.2.2 | C2.4.3 | độ dài MN hai cực trị (bậc hai trên bậc nhất) |
| T1120000003485 | C2.2.1 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T1120000003004 | C2.2.1 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T1120000004141 | C4.4.1 | C4.4.5 | thuế thu phụ t lớn nhất |
| T1120000004354 | C2.2.1 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T1120000005912 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T112020104084 | C2.5.3 | C2.5.6 | PT chứa m có nghiệm trên đoạn |
| T112020104079 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T1120000004690 | C2.1.3 | C2.1.2 | đáp án là hàm nhất biến |
| T312000000482 | C1.1.1 | CHUONG:O | hình học không gian (góc giữa hai mặt phẳng) |
| T112000000889 | C3.1.2 | C3.1.1 | giao với trục hoành |
| T1120000004272 | C4.4.2 | C4.4.6 | chi phí chuyến xe theo tốc độ |
| T1120000005852 | — | CHUA | đề trích thiếu (chỉ có "có đồ thị như hình vẽ", không có câu hỏi) |
| T112020401296 | C4.4.3 | C4.1.1 | cho sẵn C(v) |
| T112020104041 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo bảng biến thiên |
| T1120000006386 | C2.2.5 | C2.2.6 | đạt cực tiểu tại điểm cho trước |
| T112020104027 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo bảng biến thiên |
| T1120000001175 | C3.1.2 | C3.1.1 | hoành độ giao với trục hoành (đọc đồ thị) |
| T1120000005780 | C2.2.5 | C2.2.6 | có hai cực trị theo m |
| T1120000001507 | C3.1.2 | C3.1.1 | giao với trục tung |
| T112020401261 | C4.4.2 | C4.4.5 | thuế phụ thu t lớn nhất |
| T112010305091 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T1120000006058 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T112000000041 | C3.1.2 | C3.1.1 | giao với trục tung |
| T112020104036 | C2.2.1 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T112020104073 | C2.2.1 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T112010305084 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T112020105021 | C1.2.2 | C2.4.3 | độ dài AB hai cực trị (bậc hai trên bậc nhất) |
| T112020401143 | C4.4.2 | C4.4.6 | xăng ca nô ngược/xuôi dòng theo vận tốc |
| T112010402164 | C2.5.3 | C2.5.6 | biểu thức hai biến có ràng buộc mũ |
| T112020401136 | C4.4.2 | C4.4.6 | nhiên liệu tàu tỉ lệ v³ |
| T112020302031 | C2.1.3 | C2.1.2 | đáp án là hàm nhất biến |
| T112020402058 | C4.1.3 | C4.4.6 | năng lượng cá bơi ngược dòng theo v |
| T1120000001173 | C3.1.2 | C3.1.1 | giao với trục tung |
| T1120000003718 | C1.2.2 | C2.4.3 | khoảng cách hai cực trị (bậc hai trên bậc nhất) |
| T112020105001 | C2.2.5 | C2.2.2 | tìm a, b từ điểm cực trị cho trước (lập hệ) |
| T112000000467 | C3.1.2 | C3.1.1 | giao với trục hoành |
| T112020401172 | C4.4.2 | C4.4.6 | lợi nhuận chuyến tàu theo vận tốc |
| T112020202079 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T112000000202 | C3.1.2 | C3.1.1 | giao với trục hoành |
| T112020401092 | C4.4.2 | C4.4.6 | lợi nhuận chuyến ca nô theo vận tốc |
| T1120000005654 | C1.2.2 | C2.4.3 | đường thẳng qua hai cực trị (bậc hai trên bậc nhất) |
| T112000000031 | C3.3.1 | CHUONG:NHTP | diện tích miền dưới đồ thị (cần tích phân) |
| T1120000005884 | C2.2.5 | C2.2.2 | tìm a, b từ điểm cực tiểu cho trước (lập hệ) |
| T112020401004 | C4.4.2 | C4.4.6 | tàu cao tốc, chi phí theo vận tốc |
| T112020401113 | C4.4.2 | C4.4.5 | thuế phụ thu t lớn nhất |
| T1120000006279 | C1.4.2 | C2.5.4 | tiệm cận của h(x)/f(x) qua đồ thị f |
| T112000000598 | C3.1.2 | C3.1.1 | giao với trục tung |
| T1120000004181 | C2.2.5 | C2.2.2 | tìm a, b từ điểm cực trị rồi tâm đối xứng |
| T1120000005918 | — | C4.4.4 | chia tổng xăng cố định giữa hai tài xế (chưa có mã cũ) |
| T1120000006455 | C1.2.2 | C2.4.3 | đường thẳng qua hai cực trị (bậc hai trên bậc nhất) |
| T112000000593 | C3.1.2 | C3.1.1 | giao với trục hoành |
| T1120000004389 | C4.1.1 | CHUONG:SDT | số trung bình mẫu ghép nhóm |
| T112020401201 | C4.4.2 | C4.4.5 | thuế phụ thu t lớn nhất |
| T1120000004504 | C2.1.3 | CHUONG:VT | vectơ Oxyz vuông góc hai vectơ |
| T112020401052 | C4.4.2 | C4.4.5 | chọn mức thuế T (VAT) để thuế cao nhất khi lợi nhuận cao nhất |
| T112020202037 | C2.2.2 | C2.1.1 | chọn hàm bậc ba theo đồ thị |
| T1120000004183 | C1.4.3 | C3.3.2 | diện tích tam giác tiệm cận xiên với hai trục |
| T112020105013 | C2.2.5 | C2.2.4 | góc OAB với hai điểm cực trị |

## CHUA: 2 câu · CHUONG: 5 câu (CHUONG:NHTP 2, CHUONG:O 1, CHUONG:SDT 1, CHUONG:VT 1)

## Số câu mỗi dạng cuối

| dạng | tên | số câu |
|---|---|---|
| C1.1.1 | Tìm khoảng đơn điệu của hàm đa thức, phân thức | 117 |
| C1.1.2 | Tìm khoảng đơn điệu của hàm căn, mũ, logarit, lượng giác | 26 |
| C1.1.3 | Đọc khoảng đơn điệu từ bảng biến thiên | 163 |
| C1.1.4 | Đọc khoảng đơn điệu từ đồ thị hàm số | 115 |
| C1.1.5 | Suy đơn điệu từ bảng xét dấu hoặc đồ thị f′ | 85 |
| C1.1.6 | Xét đơn điệu khi f′ cho dạng tích | 28 |
| C1.2.1 | Tìm cực trị của hàm đa thức | 85 |
| C1.2.2 | Tìm cực trị của hàm phân thức, căn, mũ, lượng giác | 45 |
| C1.2.3 | Đọc cực trị từ bảng biến thiên | 154 |
| C1.2.4 | Đọc cực trị từ đồ thị hàm số | 98 |
| C1.2.5 | Suy cực trị từ bảng xét dấu hoặc đồ thị f′ | 69 |
| C1.2.6 | Đếm cực trị khi f′ cho dạng tích | 72 |
| C1.3.1 | Tìm GTLN, GTNN của hàm đa thức trên đoạn | 119 |
| C1.3.2 | Tìm GTLN, GTNN của hàm phân thức trên đoạn | 61 |
| C1.3.3 | Tìm GTLN, GTNN của hàm căn, lượng giác, mũ, logarit | 49 |
| C1.3.4 | Tìm GTLN, GTNN trên khoảng hoặc trên ℝ | 21 |
| C1.3.5 | Đọc GTLN, GTNN từ đồ thị | 147 |
| C1.3.6 | Đọc GTLN, GTNN từ bảng biến thiên hoặc bảng xét dấu f′ | 96 |
| C1.4.1 | Tìm tiệm cận đứng, ngang của hàm bậc nhất trên bậc nhất | 183 |
| C1.4.2 | Đếm tiệm cận của hàm phân thức, hàm chứa căn | 42 |
| C1.4.3 | Tìm tiệm cận xiên | 152 |
| C1.4.4 | Đọc tiệm cận từ đồ thị | 83 |
| C1.4.5 | Đọc và đếm tiệm cận từ bảng biến thiên | 102 |
| C1.4.6 | Tìm tiệm cận từ giới hạn cho trước | 24 |
| C1.5.1 | Chọn mệnh đề đúng về đơn điệu, cực trị, GTLN | 9 |
| C1.5.2 | Khảo sát sự biến thiên và vẽ đồ thị hàm số | 3 |
| C2.1.1 | Nhận dạng đồ thị, bảng biến thiên hàm bậc ba | 155 |
| C2.1.2 | Nhận dạng đồ thị hàm bậc nhất trên bậc nhất | 102 |
| C2.1.3 | Nhận dạng đồ thị hàm bậc hai trên bậc nhất | 59 |
| C2.1.4 | Nhận dạng đồ thị, bảng biến thiên hàm trùng phương | 2 ⚠ |
| C2.1.5 | Phân biệt các loại hàm qua dấu hiệu đặc trưng | 6 |
| C2.2.1 | Xét dấu hệ số a, b, c, d của hàm bậc ba | 38 |
| C2.2.2 | Lập công thức hàm bậc ba từ đồ thị hoặc điều kiện | 31 |
| C2.2.3 | Tìm tâm đối xứng (điểm uốn) của đồ thị bậc ba | 17 |
| C2.2.4 | Hai điểm cực trị bậc ba: độ dài, diện tích, đường thẳng | 20 |
| C2.2.5 | Tìm m để hàm đa thức đơn điệu trên ℝ hoặc khoảng | 19 |
| C2.2.6 | Tìm m để hàm đa thức có cực trị thoả điều kiện | 9 |
| C2.3.1 | Xét hệ số của hàm bậc nhất trên bậc nhất | 62 |
| C2.3.2 | Tâm đối xứng của đồ thị hàm nhất biến | 43 |
| C2.3.3 | Tìm tham số cho hàm nhất biến | 19 |
| C2.4.1 | Xét hệ số của hàm bậc hai trên bậc nhất | 21 |
| C2.4.2 | Tâm đối xứng của đồ thị bậc hai trên bậc nhất | 13 |
| C2.4.3 | Hai cực trị và tham số hàm bậc hai trên bậc nhất | 22 |
| C2.5.1 | Xét đơn điệu của hàm hợp f(u(x)) khi biết f′ | 6 |
| C2.5.2 | Đếm cực trị của hàm hợp, hàm chứa trị tuyệt đối | 14 |
| C2.5.3 | GTLN, GTNN chứa tham số trong công thức | 7 |
| C2.5.4 | Tiệm cận của hàm hợp hoặc hàm có tham số | 11 |
| C2.5.5 | GTLN, GTNN của hàm ẩn f(u(x)) từ đồ thị, bảng của f hoặc f′ | 3 |
| C2.5.6 | Ứng dụng max–min: phương trình, bất phương trình chứa m, biểu thức nhiều biến | 4 |
| C3.1.1 | Điểm thuộc đồ thị, giao điểm với trục toạ độ | 24 |
| C3.1.2 | Đếm nghiệm f(x)=m, số giao điểm từ đồ thị | 31 |
| C3.1.3 | Giao điểm thoả hệ thức hoặc điều kiện hình học | 5 |
| C3.2.1 | Viết tiếp tuyến tại điểm hoặc biết hệ số góc | 5 |
| C3.2.2 | Tiếp tuyến cắt hai tiệm cận của hàm nhất biến | 2 ⚠ |
| C3.3.1 | Khoảng cách nhỏ nhất từ điểm trên đồ thị | 13 |
| C3.3.2 | Diện tích, góc tạo bởi tiệm cận và trục toạ độ | 20 |
| C4.1.1 | Tìm GTLN, GTNN của hàm mô hình cho sẵn | 68 |
| C4.1.2 | Tìm tham số của mô hình từ điều kiện | 15 |
| C4.1.3 | Khoảng tăng giảm và ngưỡng của hàm mô hình | 26 |
| C4.1.4 | Giá trị ngưỡng dài hạn của mô hình (tiệm cận) | 29 |
| C4.2.1 | Hộp, bể, lon: vật liệu nhỏ nhất, thể tích lớn nhất | 133 |
| C4.2.2 | Diện tích, chu vi hình phẳng lớn nhất; cắt uốn dây | 58 |
| C4.2.3 | Tối ưu trên parabol, đồ thị đặt trong hệ toạ độ | 16 |
| C4.3.1 | Đường đi qua hai môi trường | 37 |
| C4.3.2 | Max–min của đại lượng hình học theo vị trí, thời gian, góc | 36 |
| C4.3.3 | Thang, sào, xe qua góc hành lang; độ chiếu sáng lớn nhất | 16 |
| C4.4.1 | Giá và lượng cầu tuyến tính: doanh thu, lợi nhuận lớn nhất | 48 |
| C4.4.2 | Lợi nhuận bằng doanh thu trừ chi phí cho sẵn | 112 |
| C4.4.3 | Chi phí trung bình nhỏ nhất | 21 |
| C4.4.4 | Số máy, số lô hàng, phân bổ nguồn lực tối ưu | 25 |
| C4.4.5 | Chọn mức thuế để tiền thuế thu được lớn nhất | 13 |
| C4.4.6 | Chi phí chuyến đi theo vận tốc | 11 |
| C4.5.1 | Tính vận tốc, gia tốc; chiều chuyển động | 51 |
| C4.5.2 | Vận tốc, gia tốc lớn nhất | 46 |
| C4.6.1 | Ý nghĩa của đạo hàm, chi phí biên | 18 |
| C4.6.2 | Thời điểm tốc độ tăng trưởng lớn nhất | 36 |
| C4.6.3 | Tốc độ liên quan giữa hai đại lượng | 8 |

Dạng 0 câu: không có. Dạng < 3 câu: C2.1.4, C3.2.2.

## Ghi chú

- 3 câu thuộc HS nhưng nằm trong danh sách chương khác (KHÔNG có trong HS-ids nên không vào bảng này; sửa ở bảng của chương đó thành `CHUONG:HS`): T112010102173 (VT-ids; khoảng đơn điệu y=x³−3x², gợi ý C1.1.1) · T1120000004463 (PPTD-ids; khoảng nghịch biến y=x³+3x²−9x, gợi ý C1.1.1) · T112020302060 (VT-ids; chọn hàm theo đồ thị, đáp án bậc hai trên bậc nhất, gợi ý C2.1.3).
- Không đổi (chưa chắc ≥ 90%): nhóm C2.1.5 (tiêu chí "chỉ cần nhận ra loại hàm" chưa rõ — đa số câu chọn hàm có phương án lẫn loại; giữ theo loại của đáp án) · khoảng cách từ điểm tới tiệm cận xiên (giữ C1.4.3) · bài "lát cắt vùng đất ven biển" rải ở C2.2.2/C4.1.2/C4.2.3 · T312010802028 (mô tô trong Oxyz, tốc độ thay đổi khoảng cách, giữ C4.6.3).
- Đọc kỹ toàn bộ: C2.2.x, C2.3.3, C2.4.x, C2.5.x, C3.x, C4.4.x, các dạng hiếm; các dạng lớn C1.x, C2.1.x, C4.x rà bằng máy (từ khoá/loại đáp án) rồi đọc câu bị nêu cờ — không đọc từng câu.
