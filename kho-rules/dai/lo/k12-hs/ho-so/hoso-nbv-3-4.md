# HỒ SƠ NGUỒN — Nguyễn Bảo Vương (NBV) Toán 12: 12-3 GTLN–GTNN và 12-4 Tiệm cận

Thư mục: `SP\txt\nbv\12-3. GTLN-GTNN\` và `SP\txt\nbv\12-4. TIEM CAN\`. Viết tắt: "12-3/C" = file `C. TRAC NGHIEM - CH.txt`; "12-4/C" = `C. BAI TAP TRAC NGHIEM - CH.txt`; 12-4/B, D, E, F tương tự (file đề `... - CH.txt`).
Số câu: ĐẾM bằng grep số "Câu n" (đã đối chiếu với file DA). Cột "số câu theo kiểu" do tôi tự đọc từng câu rồi xếp loại, tổng từng phần đã cộng khớp với số câu thật (không ước lượng). Chỗ "ước lượng" có ghi rõ.

## 0. Tổng số câu đếm được

| Phần | 12-3 GTLN–GTNN | 12-4 Tiệm cận |
|---|---|---|
| A Lý thuyết | định nghĩa + 3 bước + 4 ví dụ | 3 định nghĩa + 6 ví dụ |
| B Tự luận | 33 câu (Dạng 1: câu 1–17, **44 ý** a/b/…; Dạng 2: câu 18–33) | 28 câu (Dạng 1: câu 1–22; Dạng 2: câu 23–28) |
| C Trắc nghiệm | 41 | 75 |
| D Đúng–Sai | 39 câu × 4 ý = 156 ý (đánh số 1–40, **không có Câu 33**) | 32 câu × 4 ý = 128 ý |
| E Trả lời ngắn | 43 | 33 |
| F Nâng cao | 16 | 17 |
| **Tổng câu (B–F)** | **172** | **185** |

Câu đúng–sai tôi phân loại **theo cả câu** (chủ đề chung của câu), nhưng ghi chú các câu mà 4 ý thuộc nhiều kiểu khác nhau (phổ biến: ý a–b là đạo hàm/cực trị, ý c–d mới là GTLN).

---
## 1. Cấu trúc NGUYÊN VĂN tiêu đề của tác giả

### 12-3 GTLN–GTNN
- `PHẦN A. LÝ THUYẾT VÀ VÍ DỤ SÁCH GIÁO KHOA` → mục `1. ĐỊNH NGHĨA`; `2. CÁCH TÌM GIÁ TRỊ LỚN NHẤT VÀ GIÁ TRỊ NHỎ NHẤT CỦA HÀM SỐ TRÊN MỘT ĐOẠN`.
- `B. BÀI TẬP TỰ LUẬN`
  - `Dạng 1. Tìm giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên một khoảng, đoạn hay nửa khoảng`
  - `Dạng 2. Ứng dụng`
- `C. BÀI TẬP TRẮC NGHIỆM` (không chia dạng)
- `D. TRẮC NGHIỆM ĐÚNG SAI` (không chia dạng)
- `E. TRẢ LỜI NGẮN` (không chia dạng)
- `F- BÀI TẬP NÂNG CAO`
  - `Dạng 1. Định m để GTLN-GTNN của hàm số chứa dấu giá trị tuyệt đối thỏa mãn điều kiện cho trước` (câu 1–11). Trong tiêu đề này tác giả liệt kê thêm **8 "Dạng" phương pháp** (đều nằm dưới dạng "|f(x)+m|"; xem mục 3): D1 max=a, D2 min=a, D3 max≤M, D4 min≤a, D5 max đạt min, D6 min đạt min, D7 max ≤ h·min hoặc min+max, D8 min+max=α / min·max=β.
  - `Dạng 2. Dùng phương pháp hàm số để tìm giá trị lớn nhất, giá trị nhỏ nhất của biểu thức` (câu 12–16)

### 12-4 Tiệm cận
- `PHẦN A. LÝ THUYẾT VÀ VÍ DỤ SÁCH GIÁO KHOA` → `1. ĐƯỜNG TIỆM CẬN NGANG`; `2. ĐƯỜNG TIỆM CẬN ĐỨNG`; `3. ĐƯỜNG TIỆM CẬN XIÊN`.
- `B. BÀI TẬP TỰ LUẬN`
  - `Dạng 1. Tìm đường tiệm cận của đồ thị hàm số` (câu 1–22)
  - `Dạng 2. Ứng dụng` (câu 23–28)
- `C. BÀI TẬP TRẮC NGHIỆM`, `D. TRẮC NGHIỆM ĐÚNG SAI`, `E- TRẢ LỜI NGẮN`, `F. BÀI TẬP NÂNG CAO` — **không chia dạng**.

Nhận xét: tác giả chỉ chia thật **2 dạng** ở mỗi chuyên đề (1 = "tính thuần túy", 2 = "ứng dụng"); riêng 12-3/F có thêm bộ 8 dạng "|f+m|" (phương pháp nêu đầy đủ nhưng chỉ ~7 câu minh họa) và 1 dạng "biểu thức nhiều biến". Mọi phân kiểu bên dưới là DO TÔI rút từ đề, không phải của tác giả.

---
## 2. Bảng KIỂU CÂU thật sự có

### 2A. Chuyên đề GTLN–GTNN (12-3)

Ký hiệu cột: B = tự luận (số **ý** ở Dạng 1, số **câu** ở Dạng 2), C/D/E/F = số câu. "–" = không có.

| # | Kiểu câu | Dấu hiệu nhận biết đề | Cách giải 1 dòng | B | C | D | E | F | Ví dụ (file, câu) | Mức |
|---|---|---|---|---|---|---|---|---|---|---|
| K1 | **Đọc GTLN/GTNN từ ĐỒ THỊ** (tìm giá trị, M±m, 2M−m, điểm đạt) | "có đồ thị như hình vẽ… giá trị lớn nhất / M+m / M−m trên đoạn [a;b]" | Nhìn điểm cao/thấp nhất của đồ thị TRONG ĐOẠN, so cả đầu mút | 2 (Câu 1a,b) | 12 (câu 1,3,8,13,17,21,29,30,32,34,37,38) | 3 (D1,2,3 đọc ý) +1 (D13) | – | – | 12-3/C câu 34 ("Tính 2M−m"); 12-3/C câu 29 ("đạt giá trị lớn nhất tại điểm x=?") | NB–TH |
| K2 | **Đọc từ BBT / bảng xét dấu f′** (giá trị, chọn mệnh đề đúng) | "có bảng biến thiên… khẳng định nào đúng", hoặc "bảng xét dấu f′(x)… mệnh đề đúng" | Lập luận trên đoạn/khoảng đã cho; chú ý khoảng MỞ, giá trị lim | – | 11 (câu 2,5,6,9,12,16,18,19,28,36,41) | 5 (D4,5,6 + 10 lẫn kiểu, xem K3) | – | – | 12-3/C câu 19 ("bảng xét dấu đạo hàm… max(0;+∞)=f(1)?"); 12-3/D câu 5 (max/min trên (−∞;0),(0;+∞),R\{0}) | TH |
| K3 | **Đọc từ ĐỒ THỊ f′(x) + giả thiết nối f** (GTLN/GTNN của f) | "đồ thị hàm số y=f′(x)… Biết f(a)+f(b)=f(c)+f(d)… max f(x)=?" | Lập BBT của f từ dấu f′, dùng giả thiết để so sánh f ở các điểm | – | – | 3 (D10,11,14) | – | – | 12-3/D câu 10, câu 11 | VD |
| K4 | **Hàm đa thức trên ĐOẠN** (bậc 3, 4, trùng phương) | "GTLN/GTNN của hàm số y=x³−…+… trên đoạn [a;b]", hoặc M+3m | Quy trình 3 bước: f′=0 trong (a;b) → tính f ở nghiệm & 2 đầu mút → chọn lớn nhất/nhỏ nhất | 14 ý (Câu 2,4a,4b,5a–c,8a,9a,12a,14a–e) | 15 (câu 4,7,10,11,14,20,22,23,25,26,27,31,33,35,39) | 2 (D7,8) + phần của D19 | – | – | 12-3/C câu 26 (x⁴−4x²+3 trên [0;4]); 12-3/B Câu 14 (5 hàm bậc 3) | NB |
| K5 | **Đa thức / hàm trên NỬA KHOẢNG hoặc KHOẢNG (không có đầu mút) → xét giới hạn, có thể KHÔNG tồn tại** | "trên khoảng (a;b)", "nửa khoảng [a;+∞)", "(nếu có)" | Lập BBT có lim ở đầu mở; đầu mở không "đạt" ⇒ có thể không có max/min | trộn trong K4 & K6 (Câu 2, 4a,b,d, 8, 12, 14b, 15a,b, 16a–c) | 2 (câu 15, 24) | trộn (D5,6,16–20…) | – | – | 12-3/C câu 15 (min trên [−1;+∞)); 12-3/B Câu 4d (x+4/(x−1) trên (−∞;1)) | TH |
| K6 | **Phân thức** (bậc1/bậc1, bậc2/bậc1, x+a/x, x/(x²+2)…) | y=(ax+b)/(cx+d) hoặc y=(x²+…)/(x+…) trên đoạn/khoảng | Đạo hàm phân thức; bậc1/bậc1 đơn điệu ⇒ GT ở đầu mút; bậc2/bậc1 lập BBT | 11 ý (4c,4d,5d,8b,9b,12b,16a–d,17b) + 3 ý bậc1/bậc1 (15a–c) | 1 (câu 24) | 4 (D9,12,20,21) | – | – | 12-3/B Câu 16 (4 hàm bậc2/bậc1, đủ loại tập); 12-3/D câu 21 | TH |
| K7 | **Căn thức** | y=x√(a−x²), √(x−1)+√(3−x), √(−x²+9) | Tìm TXĐ rồi đạo hàm (hoặc bất đẳng thức/đặt ẩn) | 5 ý (5e,5g,10a,13,17a) | – | – | – | – | 12-3/B Câu 5e,g; Câu 13 | TH |
| K8 | **Lượng giác** | sin, cos, y=2−sin x, sin2x−x… | Đạo hàm = 0 giải PT lượng giác trên đoạn; hoặc dùng |sin|≤1 nếu không cho tập | 3 ý (6a,6b,10b) | 1 (câu 40) | 4 (D15–18) | – | – | 12-3/B Câu 6a (sin2x−x trên [−π/2;π/2]); 12-3/D câu 16 | TH |
| K9 | **Mũ – logarit** | e^x(x²−5x+7), 3^x+3^−x, x·e^(−2x²), ln(x²+2x+3), −3x+5+x ln x, log₃(x²−2x), 2x−log₅(x+1) | Đạo hàm hàm mũ/log; chú ý TXĐ | 5 ý (3, 7a–d) | – | 3 (D22,23,24) | – | – | 12-3/B Câu 7d; 12-3/D câu 22 | TH |
| K10 | **Hàm chia đoạn (piecewise)** | f(x) = {2x−1 nếu…; x²−5x+9 nếu…} | Xét từng khúc rồi so sánh; xét tại điểm nối | 1 (Câu 11) | – | 1 (D40: có a,b,c tìm từ liên tục) | – | – | 12-3/B Câu 11; 12-3/D câu 40 | TH–VD |
| K11 | **Đạo hàm của hàm giá trị trên đồ thị đã cho / chuyển động: tìm GTLN của f′ (tốc độ)** | "tốc độ lớn nhất", "vận tốc lớn nhất", "gia tốc lớn nhất" cho x(t), s(t), V(t) | Lấy đạo hàm để có v(t)/V′(t), rồi tìm GTLN của v | 4 (B Câu 18c, 24, 27, + 23 lượng giác) | – | 1 (D30) | 3 (E 2, 24, 27) | – | 12-3/B Câu 27 (tốc độ lớn nhất của chất điểm); 12-3/E câu 27 | VD |
| K12 | **Ứng dụng — mô hình cho SẴN công thức** (lợi nhuận, nồng độ, nhiệt, nhiên liệu…) | "…được cho bởi công thức P(s)=…, tìm thời điểm/mức…để lớn nhất/nhỏ nhất" | Đọc hàm từ đề → GTLN/GTNN trên miền thực tế (nhớ ràng buộc t≥0, x nguyên…) | 8 (B Câu 18–23, 25, 26) | – | ~9 (D26–D29, D32, D34, D36, D37, D39) | 5 (E 25,26,31,24 + 8) | – | 12-3/B Câu 20 (lợi nhuận quảng cáo P(s)=…); 12-3/D câu 32 (nồng độ CO₂) | TH–VD |
| K13 | **Ứng dụng — PHẢI LẬP hàm từ HÌNH HỌC** (hộp, bể, lon, sân, hình chữ nhật nội tiếp, tam giác, cổng) | "cắt bốn góc… thể tích lớn nhất", "bể chứa… chi phí nhỏ nhất", "diện tích lớn nhất" | Đặt ẩn → biểu thức 1 biến (từ giả thiết thể tích/diện tích cố định) → GTLN/GTNN | 4 (B Câu 29, 30, 31 + 28 đại số) | – | 3 (D31, 35, 25) | 9 (E 1,3,4,14,15,19,21,23,34) | – | 12-3/B Câu 29 (hộp không nắp); 12-3/E câu 14 (lon sữa, bán kính đáy nhỏ nhất) | VD |
| K14 | **Ứng dụng — LẬP hàm từ KINH TẾ (cầu–giá, "giảm giá bán thêm")** | "mỗi lần giảm giá 20 ngàn thì bán thêm 20 sản phẩm", "tăng 1000đ thì mất 10 khách" | Lập số lượng(x), giá(x) → doanh thu R(x)=giá·SL; bậc 2 ⇒ đỉnh parabol hoặc đạo hàm | 2 (Câu 32, 33) | – | 0 | 4 (E 5, 18, 37, 39) | – | 12-3/E câu 37; 12-3/B Câu 33 (R=PQ, P=√(1500−Q)) | VD |
| K15 | **Ứng dụng — hàm chi phí/lợi nhuận SẴN trong đề, lợi nhuận = doanh thu − chi phí** | "tổng chi phí C(x)=…, giá bán 750 nghìn/kg, lợi nhuận tối đa" | L(x)=giá·x−C(x) (có thể trừ thuế, ràng buộc 1≤x≤20) → GTLN | 1 (B Câu 32) | – | 4 (D26, 27, 34, 39) | 8 (E 6,13,38,40,41,42,43 + 18) | – | 12-3/E câu 6 (thịt trâu sấy); 12-3/E câu 38 (5% thuế) | TH–VD |
| K16 | **Ứng dụng — đường đi / thời gian / chi phí nhỏ nhất qua sông–địa hình (hai vận tốc, hai đơn giá)** | "đi bộ 4 km/h, 8 km/h", "chèo thuyền 6 km/h, chạy 8 km/h", "đường ống dưới sông 8 tỷ/km, trên đất 4 tỷ/km" | Đặt x = vị trí điểm đổi môi trường → tổng thời gian/chi phí f(x) = √(a²+x²)/v₁ + (L−x)/v₂ → min | – | – | 1 (D38 tàu: chi phí nhiên liệu theo vận tốc) | 7 (E 7,10,16,20,35,36,33) | – | 12-3/E câu 7 (đi từ A đến C); 12-3/E câu 35 (ống dẫn dầu) | VD |
| K17 | **Ứng dụng — thang/sào dài nhất qua góc L (điểm chạm)** | "que sào đặt qua hành lang hình chữ L", "thang tựa tường vượt hàng rào/mái che" | l = a/sinθ + b/cosθ (hoặc tương tự) → min l | – | – | – | 3 (E 12, 29, 32) | – | 12-3/E câu 29 (thang xe cứu hỏa) | VDC |
| K18 | **Ứng dụng — khoảng cách ngắn nhất từ điểm đến đồ thị/đường** | "cầu ngắn nhất", "cáp treo ngắn nhất từ O đến đồ thị y=(−x²+2)/x" | d²(x) = (x−x₀)²+(y−y₀)² → min | – | – | 1 (D25) | 3 (E 9, 11, 28) | – | 12-3/E câu 9; 12-3/D câu 25 | VDC |
| K19 | **Ứng dụng — góc lớn nhất** | "góc chiếu sáng NOP lớn nhất" | Đặt tan hoặc hàm góc theo OM → max | – | – | – | 1 (E 22) | – | 12-3/E câu 22 | VD |
| K20 | **Ứng dụng — mô hình khoa học/sinh học cho sẵn với tham số cần tìm (a,b,c hoặc a,b)** | "P(t)=a/(b+e^−0,75t), t=0 có 20 tế bào…", "f(t)=−t³/300+bt²+ct+12000, max=55740 ngày 26/09" | Dùng điều kiện đầu/điều kiện cực trị để tìm tham số rồi tính giá trị | – | – | 0 | 2 (E 17, 30) | – | 12-3/E câu 30; 12-3/E câu 17 (trùng với 12-4/E câu 21) | VDC |
| K21 | **Ứng dụng — bài toán đại số "a+b=4, min a⁴+b⁴"** | "Cho a và b không âm, tổng bằng 4" | Thế b=4−a → hàm 1 biến | 1 (B Câu 28) | – | – | – | – | 12-3/B Câu 28 | TH |
| K22 | **Tham số m trong ĐỀ — |f(x)+m|: max/min bằng a, ≤ a, đạt nhỏ nhất…** | "hàm số y=|x³−3x+m| trên [0;3] có giá trị lớn nhất bằng 16", "max … đạt giá trị nhỏ nhất", "min không vượt quá 10" | Tìm K=max f, k=min f; max|f+m|=max{|m+K|,|m+k|}; xét trường hợp (Cách 1: bất đẳng thức |A|+|B|≥|A−B|; Cách 2: 2 trường hợp) | – | – | – | 1 (E 8: tham số m, "tốc độ bán hàng luôn tăng") | 7 (F 1,2,3,4,5,9,10) | 12-3/F câu 1 (Đề minh họa 2020); 12-3/F câu 4 (max ≤ 30, m nguyên); 12-3/F câu 5 (e^2x−4e^x+m, min=6) | VD–VDC |
| K23 | **GTLN–GTNN hàm HỢP f(u(x)) + hàm phụ cho bởi BBT / đồ thị f′** | "g(x)=f(4x−x²)+(1/3)x³−3x²+8x+1/3 trên [1;3]", "y=f((sin x+√3cos x)/2)", "y=f(−|√3 sin x−cos x|+2)+2cos2x+4sin x−1" | Đặt t=u(x), tìm miền t; dùng BBT/đồ thị f′ để suy max f(t); đôi khi kết hợp BĐT | – | – | – | – | 3 (F 6,7,11) + biến thể 9,10 | 12-3/F câu 6; 12-3/F câu 11 (Chuyên Hà Tĩnh 2022) | VDC |
| K24 | **Tìm hệ số để hai hàm cùng GTNN tại cùng điểm** | "f(x)=x³+ax²+bx+c và g(x)=x+4/x² có cùng GTNN, đạt tại cùng một điểm; A(1;4)∈f" | Tìm điểm cực tiểu của g → điều kiện f′=0, f(x₀)=g(x₀) → a,b,c | – | – | – | – | 1 (F 8) | 12-3/F câu 8 | VDC |
| K25 | **GTLN–GTNN của BIỂU THỨC nhiều biến có ràng buộc** (đặt ẩn / dồn biến → hàm 1 biến) | "x,y thỏa x+y=√(x−1)+√(2y+2); max, min của P…", "x²+y²−xy=1; Q=f((5x−y+2)/(x+y+4))" | Dùng ràng buộc để rút/đặt t=biểu thức đối xứng, tìm miền t, khảo sát P(t) | – | – | – | – | 4 (F 12,13,14,15) | 12-3/F câu 12; 12-3/F câu 14 | VDC |
| K26 | **Cực trị tham số + khoảng cách (câu "lạ" nằm lẫn)** | y = (x²−2m(m+1)x+…)/(x−m), điểm A vừa cực đại vừa cực tiểu, khoảng cách đến đường thẳng d lớn nhất | Không phải GTLN của hàm thông thường: tìm tập điểm cực trị rồi tối ưu khoảng cách | – | – | – | – | 1 (F 16) | 12-3/F câu 16 (Chuyên Quốc Học Huế 2021) | VDC |
| K27 | **Mệnh đề tổng hợp về hàm (đơn điệu, cực trị, GTLN, TC…) — D là "nhồi" nhiều kiến thức** | 4 ý a–d: đạo hàm, đồng biến, cực trị, GTLN | Từng ý theo từng kiểu K1–K9 | – | 1 (C12: "khẳng định sai") | ~12 (D4,5,6,7,8,9,12,13,15,19,20,21: phần lớn ý có GT lớn nhất/nhỏ nhất, còn lại là đơn điệu/cực trị) | – | – | 12-3/D câu 4; 12-3/D câu 12 | TH |
| K28 | **Hàm có tham số k trong phương trình / bất phương trình nghiệm đúng** (trong 1 ý của D) | "Có … giá trị nguyên k để PT 2x³−3x²+2k−1=0 có 3 nghiệm phân biệt trên [−1;3]", "BPT 2a−f(x)≥0 nghiệm đúng ∀x" | Chuyển PT/BPT thành m=f(x) hoặc m≥max f(x) → dùng GTLN–GTNN/BBT | – | – | 2 ý (D19d, D20d) | – | – | 12-3/D câu 19d, 20d | VDC |

Ghi chú đếm: cột D cho kiểu K1–K3 và K12–K18 tôi xếp **theo chủ đề chung của cả câu**; kiểu K4–K9 trong D và K27 là nhóm "hàm cụ thể + 4 ý hỗn hợp" nên các số ở D chỉ để chỉ phạm vi, **tổng D = 39 câu** là con số duy nhất đếm chắc. Phân tách chính xác của D (39 câu):
- Đọc đồ thị/BBT của f (có ý GTLN–GTNN): 7 câu (D1,2,3,4,5,6,13)
- Đọc đồ thị f′ + giả thiết: 3 câu (D10,11,14)
- Hàm đa thức/hữu tỉ cụ thể, ý hỗn hợp: 7 câu (D7,8,9,12,19,20,21)
- Lượng giác: 4 câu (D15,16,17,18)
- Mũ–log: 3 câu (D22,23,24)
- Ứng dụng thực tế (25,26,27,28,29,30,31,32,34,35,36,37,38,39,40): 15 câu
→ 7+3+7+4+3+15 = 39 ✓.

Phân tách chính xác của C (41 câu): Đồ thị 12 (câu 1,3,8,13,17,21,29,30,32,34,37,38) · BBT/bảng xét dấu 11 (2,5,6,9,12,16,18,19,28,36,41) · Hàm cụ thể 18 (đa thức trên đoạn 15: 4,7,10,11,14,20,22,23,25,26,27,31,33,35,39; đa thức nửa khoảng 1: câu 15; phân thức nửa khoảng 1: câu 24; lượng giác trên TXĐ 1: câu 40). 12+11+18 = 41 ✓.

Phân tách chính xác của E (43 câu — **toàn bộ là ứng dụng/tối ưu, KHÔNG có câu "hàm số trần"**):
- Lập hàm hình học: 9 (E 1,3,4,14,15,19,21,23,34)
- Khoảng cách ngắn nhất/điểm trên đường: 3 (E 9,11,28)
- Đường đi–thời gian–chi phí (2 vận tốc/đơn giá): 7 (E 7,10,16,20,33,35,36)
- Thang/sào qua góc: 3 (E 12,29,32)
- Góc lớn nhất: 1 (E 22)
- Kinh tế "giá–số lượng": 4 (E 5,18,37,39)
- Kinh tế "hàm chi phí/doanh thu cho sẵn": 7 (E 6,13,38,40,41,42,43)
- Chuyển động/động năng: 3 (E 2,24,27)
- Mô hình khoa học có tham số/cho sẵn: 6 (E 8,17,25,26,30,31)
→ 9+3+7+3+1+4+7+3+6 = 43 ✓.

Phân tách chính xác của B Dạng 2 (16 câu): mô hình cho sẵn 10 (Câu 18–27, trong đó 18c, 24, 27 là "GTLN của đạo hàm = tốc độ") · lập hàm 6 (Câu 28 đại số; 29 hộp; 30,31 hình; 32 chi phí; 33 doanh thu).

Phân tách chính xác của F (16 câu): |f+m| 7 (1,2,3,4,5,9,10) · hàm hợp với BBT/đồ thị f′ 3 (6,7,11) · hai hàm cùng GTNN 1 (8) · biểu thức nhiều biến 4 (12–15) · cực trị tham số + khoảng cách 1 (16). Tổng 7+3+1+4+1 = 16 ✓.

### 2B. Chuyên đề Tiệm cận (12-4)

| # | Kiểu câu | Dấu hiệu nhận biết đề | Cách giải 1 dòng | B | C | D | E | F | Ví dụ (file, câu) | Mức |
|---|---|---|---|---|---|---|---|---|---|---|
| T1 | **TCN của hàm phân thức bậc1/bậc1 cho BẰNG CÔNG THỨC** | "Đường tiệm cận ngang của đồ thị hàm số y=(2x+1)/(x+1)" | Tỉ số hệ số bậc cao (a/c); hoặc lim x→±∞ | 8 ý (Câu 8a,b,c; 12a,b; 15a,b; 3 ngang) | 8 (câu 3,6,10,33,47,51,62,72) | – | – | – | 12-4/C câu 10 và câu 33 **trùng nhau** (y=(2x+1)/(x+1)); 12-4/C câu 3 (y=1+(2x+1)/(x+2)) | NB |
| T2 | **TCĐ của hàm phân thức bậc1/bậc1 cho bằng công thức** | "Đường tiệm cận đứng của y=(2x+3)/(x+1)" | Nghiệm mẫu không là nghiệm tử | cùng B (Câu 3,12,15…) | 3 (câu 16,21,36) | – | – | – | 12-4/C câu 36 | NB |
| T3 | **Cả TCĐ + TCN (cặp) của y=(ax+b)/(cx+d)** | "Tiệm cận đứng và tiệm cận ngang… lần lượt là" | cả hai quy tắc | 12 ý (Câu 2a,3,8,11a,12a,b,15) | 1 (câu 20) | 2 (D6,D7 lẫn đơn điệu) | – | – | 12-4/C câu 20; 12-4/D câu 7 | NB |
| T4 | **TCX hàm phân thức bậc2/bậc1 (chia đa thức)** | y=(x²−x+2)/(x+1) … "tiệm cận xiên", "đi qua điểm", "a+b" | Chia đa thức: y=ax+b+r/(x+…) ⇒ TCX y=ax+b | 10 ý (Câu 2b,4,9b,9c,11b,13c,13d,14c,16a,b) | 13 (câu 5,12,15,18,27,29,38,45,48,54,58,60,68) | 9 (D9,11,15,16,17,19,21,23,24 — ý TCX là một phần) | 2 (E 3, 9) | – | 12-4/C câu 12 và câu 29 **trùng hàm** (x²−2x+4)/(x−3), khác phương án; 12-4/E câu 9 (A=a+2b) | NB |
| T5 | **TCX cho dạng đã TÁCH phần nguyên (y=ax+b+r/(x+…))** | "y=2x−1+1/x … đường tiệm cận xiên", "y=−7x+(x−1)/x²" | Bỏ phần phân thức còn lại; lim phần phân thức =0 | 4 ý (Câu 9a, 11c-phần, 13a,b) | 5 (câu 7,53,55,59,66) | – | – | – | 12-4/C câu 53 (y=x−1−2/(x+1)); 12-4/C câu 59 | NB |
| T6 | **TC của đồ thị hàm số y=(ax+b)/(cx+d) cho ĐỒ THỊ hoặc BBT (không cho số cụ thể)** | "Hàm số y=(ax+b)/(cx+d) có đồ thị như hình vẽ. Tiệm cận (đứng/ngang)…" | Đọc đường mà đồ thị tiến sát: x=? hoặc y=? | 4 ý (Câu 1a-b,7a-d vẽ) | 11 (câu 1,4,8,19,23,28,32,35,44,64,75) | – | – | – | 12-4/C câu 35; 12-4/C câu 1 (BBT, hỏi TCĐ) | NB |
| T7 | **TCX từ ĐỒ THỊ (hàm bậc2/bậc1)** | "y=(ax²+bx+c)/(mx+n) có đồ thị như hình… tiệm cận xiên" | Đọc đường thẳng xiên mà đồ thị tiến sát | 1 (Câu 5?) | 5 (câu 11,25,31,43,74) | – | – | – | 12-4/C câu 31; 12-4/C câu 74 (đồ thị bất kì) | NB–TH |
| T8 | **Đọc tiệm cận từ đồ thị TỔNG QUÁT hoặc BBT TỔNG QUÁT (hỏi riêng TCĐ hay TCN / đếm)** | "y=f(x) có đồ thị như hình… đường tiệm cận ngang/đứng" , "bao nhiêu đường tiệm cận" | Đọc: x→±∞ ⇒ TCN; điểm mà f→±∞ ⇒ TCĐ | 3 (Câu 5, 17, 21 — đồ thị hoặc BBT) | đồ thị: 6 (câu 2,9,37,42,46,61); BBT riêng lẻ: 2 (22,63) | 5 (D1,3,4,5,18 BBT) | 3 (E 5,6,7) | – | 12-4/C câu 9; 12-4/E câu 6 | TH |
| T9 | **ĐẾM tổng số TC (TCĐ + TCN) từ BBT** | "Tổng số tiệm cận đứng và tiệm cận ngang", "bao nhiêu đường tiệm cận" | Xem lim ở ±∞ (đếm TCN, nhớ đếm HAI phía) và lim tại điểm gián đoạn (đếm TCĐ) | – | 10 (đủ: 13,14,17,30,39,40,50 tổng TCĐ+TCN; 24,26 chỉ TCĐ; 57 chỉ TCN) | – | 2 (E 5, 7) | – | 12-4/C câu 17 và câu 30 (cùng đề, nhiều trường); 12-4/C câu 24 (đếm TCĐ) | TH |
| T10 | **ĐẾM số TC của hàm CỤ THỂ (hữu tỉ, có nghiệm trùng tử–mẫu)** | "Số đường tiệm cận của y=(5x²+8x+2)/(2x²−2)", "(x−2)/(x²−4)" | Rút gọn nghiệm chung; đếm TCĐ (nghiệm mẫu không triệt tiêu) + TCN | 2 (Câu 10a, 14a) | 4 (câu 52,69,70,73) | 3 (D2,D8, D14) | 2 (E 1, 2) | – | 12-4/C câu 69 ((x−2)/(x²−4)); 12-4/E câu 2 | TH |
| T11 | **Hàm CĂN THỨC (dạng √ trên/dưới)** | y=√(x²−16), (√(x²+3))/(x−1), (√(2x+4)−2)/(x²−x), x−1/(√x−1) | Nhân liên hợp; kiểm tra TXĐ một phía; TCN có thể HAI giá trị (±) | 2 ý (10b, 21) | 1 (câu 73) | 5 (D12,13,14,22,25) | 2 (E 4, 31) | – | 12-4/D câu 13; 12-4/D câu 12; 12-4/C câu 73 | TH–VD |
| T12 | **Tiệm cận từ GIỚI HẠN / định nghĩa cho trước** | "y=f(x) thỏa lim = …", "xác định trên (−2;1) và có lim x→−2⁺ f=2, lim x→1⁺ f=−∞" | Đối chiếu trực tiếp định nghĩa TCN/TCĐ (chú ý điều kiện 1 phía & tập xác định) | – | 2 (câu 49, 56) | – | – | – | 12-4/C câu 56 (TXĐ khoảng (−2;1)) | NB–TH |
| T13 | **Chọn hàm số từ tiệm cận / đồ thị (đảo chiều)** | "Đồ thị dưới đây là của hàm số nào", "y=−2x+1 là TCX của hàm nào", "2y+1=0 là TCN của hàm nào" | Thử từng phương án với quy tắc TC | – | 3 (câu 34,41,65) | – | – | – | 12-4/C câu 41; 12-4/C câu 65 | TH |
| T14 | **Hàm hợp / hàm g=1/(f(x)+m) cho qua BBT** (đếm TCĐ, TCN) | "đồ thị hàm số y=1/(2f(x)+3) có bao nhiêu TCĐ", "g(x)=1/(f(x)+2)" | Số nghiệm f(x)=−m tương ứng số TCĐ; TCN: lim f ở ±∞ | 1 (Câu 18: g=1/(2+f)) | 1 (câu 67) | 3 ý (D20c,d; D21d; D22c,d; D25d) | 2 (E 32, 33) | 3 (F 15,16,17) | 12-4/C câu 67; 12-4/F câu 15 (Bình Giang 2019); 12-4/E câu 33 | VD–VDC |
| T15 | **Tâm đối xứng, giao hai TC, tọa độ điểm gắn TC** | "giao điểm hai TC", "tâm đối xứng của đồ thị", "hệ số góc đường qua I và K" | I=(TCĐ ∩ TCN) hoặc (TCĐ ∩ TCX) | 1 (Câu 20) | – | 3 ý (D7c, D15b, D24b, D23c, D25d) | – | – | 12-4/B Câu 20 | TH |
| T16 | **KHOẢNG CÁCH từ điểm M∈(C) đến hai TC: tích hằng số / tổng nhỏ nhất** | "tích khoảng cách từ M đến hai tiệm cận", "tổng khoảng cách nhỏ nhất" | Gọi M(x₀; y₀) rồi tính d₁·d₂ (hằng số) hoặc d₁+d₂ (AM-GM / khảo sát hàm) | 2 (Câu 19, 22) | 0 | 2 ý (D17d, D30d) | 1 (E 11) | 5 (F 5,6,7?,13,3) | 12-4/B Câu 19; 12-4/E câu 11; 12-4/F câu 13 | VD |
| T17 | **DIỆN TÍCH / hình tạo bởi TC và trục tọa độ** | "hai tiệm cận cùng với hai trục tọa độ tạo thành hình chữ nhật/hình thang/tam giác có diện tích …" | Tìm TCĐ, TCN (hoặc TCX) rồi tính diện tích hình giới hạn | 0 | 1 (câu 71) | 2 ý (D23b, D27c) | 2 (E 8, 12) | 2 (F 9: TCX&trục =4; F 3: hình bình hành) | 12-4/C câu 71 (hình chữ nhật); 12-4/E câu 12 (hình thang vuông) | TH–VD |
| T18 | **Tham số m: điều kiện để có đúng k tiệm cận / không có TCĐ / TCX thỏa điều kiện** | "Có bao nhiêu m để đồ thị có đúng hai TC", "hàm số không có TCĐ", "TCX tạo với hai trục tam giác diện tích 8", "TCX cách O một khoảng" | Biện luận theo m: nghiệm mẫu, nghiệm chung; hoặc chia đa thức rồi dùng điều kiện hình học | 0 | 0 | 1 (D26d) | 3 (E 13, 30, 31) | 6 (F 1,2,9,10,11,12) | 12-4/F câu 1 (Chuyên Lê Hồng Phong NĐ 2019); 12-4/E câu 31 (m trong [−5;15], √(mx²−9)) | VDC |
| T19 | **Điểm thuộc đồ thị thỏa điều kiện khoảng cách tới TCĐ/TCX/trục (tối ưu hình học)** | "M∈(C) sao cho d(M,TCĐ)=√2 d(M,TCX)", "hai điểm thuộc hai nhánh khác nhau, khoảng cách nhỏ nhất", "tổng khoảng cách đến 2 trục nhỏ nhất", "tam giác ABI vuông cân" | Tham số hóa M, lập d(x₀) → giải/min | 0 | 0 | 0 | 0 | 5 (F 5,6,7,8,14) | 12-4/F câu 5; 12-4/F câu 7; 12-4/F câu 14 | VDC |
| T20 | **ỨNG DỤNG tiệm cận — "tiến đến ngưỡng / không thể vượt / không thể thấp hơn" (giới hạn dài hạn)** | "khi x đủ lớn…", "nồng độ muối … tiến gần đến mức…", "chi phí trung bình không thể thấp hơn", "số lượng không vượt quá" | Tìm TCN y=a của hàm mô hình; nghĩa thực tế: giá trị ngưỡng | **6 câu** (Câu 23–28; Câu 23,24,25 có "nhận xét") | 0 | 4 (D28, 29, 31, 32) + D30 (chi phí rào) | **16 câu** (E 14–29) | – | 12-4/B Câu 23 (S(x)=200(5−9/(2+x))); 12-4/E câu 17 (nồng độ muối, TCN y=a) | TH |
| T21 | **ỨNG DỤNG — TCĐ trong bài chi phí làm sạch** | "chi phí làm sạch p% lượng dầu C(p)=2000p/(100−p)", "chi phí loại bỏ x% chất ô nhiễm" | TCĐ x=100 ⇒ không thể làm sạch 100% | 1 (Câu 27) | – | 1 (D29) | 1 (E 14) | – | 12-4/B Câu 27; 12-4/E câu 14 | TH |
| T22 | **ỨNG DỤNG — LẬP hàm chi phí/nồng độ rồi tìm tiệm cận** (viết công thức) | "Viết công thức tính chi phí trung bình C(x)…", "nồng độ muối sau khi thêm x ml", "chi phí trung bình mỗi cuốn" | Lập tỉ số (tổng/số lượng) → TCN | 3 (B Câu 25, 26, 28) | – | 2 (D28, D32 phần a) | 6 (E 16–20, 22, 24, 25, 26) | – | 12-4/B Câu 26 (dung dịch muối); 12-4/E câu 24 (cuốn sách, chi phí \overline{ab}) | TH–VD |
| T23 | **Mệnh đề tổng hợp về hàm phân thức (đơn điệu + cực trị + GTLN + tiệm cận + tiếp tuyến)** | 4 ý a–d, 1–2 ý nói tiệm cận, ý còn lại: cực trị/đơn điệu/GTLN/tiếp tuyến | Từng ý theo kiểu cũ | – | – | **9 câu hỗn hợp** (D1,2,3,4,5,10,11,16,19) | – | – | 12-4/D câu 11 (f′, TCX, cực đại, GTLN); 12-4/D câu 19 (đồng biến, cực trị, TCX, tiếp tuyến) | TH |

Phân tách chính xác của C 12-4 (75 câu): T1 8 · T2 3 · T3 1 · T4 13 · T5 5 · T6 11 · T7 5 · T8-đồ thị 6 · T8-BBT TCĐ 2 · T9 10 · T10 4 · T11 1 (câu 73) · T12 2 · T13 3 · T14 1 (câu 67) · T17 1 (câu 71) → 8+3+1+13+5+11+5+6+2+10+4+1+2+3+1+1 = **76**; thực tế câu 73 vừa là T10 (đếm TC) vừa T11 (căn): tôi đếm vào T10 nên T11 trong C = 0, T10 = 4 gồm câu 52, 69, 70, 73. Tổng đúng: 8+3+1+13+5+11+5+6+2+10+4+0+2+3+1+1 = **75** ✓. Bảng trên ghi "1" cho T11 trong C chỉ để chỉ ra có chồng lấn với T10 (không cộng đôi).

Phân tách chính xác của D 12-4 (32 câu): đọc BBT/đồ thị tổng hợp (có TC + cực trị + đơn điệu + GTLN) 8 (D1,2,3,4,5,10,18,20) · hàm bậc1/bậc1 cụ thể 3 (D6,7,27) · hữu tỉ bậc 2/bậc 2 1 (D8) · bậc2/bậc1 TCX + ý hỗn hợp 9 (D9,11,15,16,17,19,21,23,24) · căn thức 5 (D12,13,14,22,25) · hàm có |x| + tham số m 1 (D26) · ứng dụng 5 (D28,29,30,31,32) → 8+3+1+9+5+1+5 = 32 ✓. (**D15 và D24 là cùng một hàm, cùng 4 ý** — trùng đề.)

Phân tách chính xác của E 12-4 (33 câu): đếm TC hàm cụ thể 3 (E1,2,4) · TCX cụ thể 2 (E3,9) · BBT/đồ thị đếm TC 3 (E5,6,7) · tìm hệ số a,b,c từ TC/BBT 2 (E10,13) · diện tích hình tạo bởi TC & trục 2 (E8,12) · tổng khoảng cách nhỏ nhất 1 (E11) · **ứng dụng 16 (E14–29)** · tham số m 2 (E30,31) · hàm hợp 2 (E32,33) → 3+2+3+2+2+1+16+2+2 = 33 ✓.
  Trong 16 câu ứng dụng: nồng độ dung dịch muối/chất khử trùng 5 (16,17,19,20,22) · chi phí trung bình 4 (18,24,25,26 — 26 là giá trị xe) · sản phẩm bán/năng suất nhân viên 5 (15,23,27,28,29) · quần thể nấm men 1 (21) · chi phí làm sạch 1 (14) → 16 ✓.

Phân tách chính xác của F 12-4 (17 câu): tham số m–số tiệm cận 3 (F1,2,12) · khoảng cách/điểm trên (C) liên quan TC 7 (F3,5,6,7,8,13,14) · tham số m + TCX (diện tích, khoảng cách tới O, cực trị) 4 (F4,9,10,11) · hàm hợp 3 (F15,16,17) → 17 ✓.

Phân tách chính xác của B 12-4 Dạng 1 (22 câu): đọc đồ thị 4 (Câu 1, 5, 7, 21) · BBT 2 (Câu 17, 18) · cho công thức: bậc1/bậc1 (3, 8, 12a, 15, 11a, 20, 2a…) · bậc2/bậc1 (4, 6, 9, 13, 16, 14c, 2b) · hữu tỉ khác (10a, 12c,d, 14a,b, 11c) · căn (10b) · hàm nghiêng dạng tách (9a, 13a,b) · tích/tổng khoảng cách (19, 22) · tâm đối xứng (20). Dạng 2 (6 câu): 23, 24 (có "nhận xét"), 25 (viết công thức + đơn điệu), 26 (dung dịch muối: lập + "đạt 10 mg/ml được không"), 27 (chi phí làm sạch: lim vô cực), 28 (chi phí trung bình).

---
## 3. Lý thuyết cốt lõi + bước/“mẹo”/điều kiện tác giả nêu

### 12-3 GTLN–GTNN (A. Lý thuyết)
- Định nghĩa: M = max_D f nếu f(x) ≤ M ∀x∈D **và** ∃x₀∈D: f(x₀)=M (tương tự min). Quy ước: "không nói trên tập D" ⇒ trên TXĐ.
- Chú ý: để tìm GTLN–GTNN trên tập D, thường **lập BBT trên D** để kết luận.
- VD1 √(1−x²): **hai cách** — Cách 1 định nghĩa (f≥0, f≤1, tìm dấu bằng), Cách 2 BBT.
- VD2 y=x−2+1/x trên (0;+∞): **khoảng mở, tính lim hai đầu → BBT**; có min, **không có max**.
- Quy trình trên ĐOẠN [a;b] (hàm liên tục trên [a;b], có đạo hàm trên (a;b) trừ hữu hạn điểm, f′=0 tại hữu hạn điểm): ① Tìm xᵢ∈(a;b) mà f′=0 hoặc không tồn tại; ② Tính f(xᵢ), f(a), f(b); ③ Lấy số lớn nhất = M, nhỏ nhất = m.
- VD3 x⁴−4x²+3 trên [0;4]; VD4 sin x+cos x trên [0;2π] (đều quy trình 3 bước).
- Kí hiệu thực hành: min_D y, max_D y.

### 12-3/F (phương pháp |f(x)+m| — nội dung trong chính phần F)
Đặt K=max_{[α;β]} f, k=min f (K>k). Tác giả nêu:
- D1 max|f+m|=a (a>0): dùng max{|m+K|,|m+k|} ≥ (K−k)/2; TH (K−k)/2≤a ⇒ m∈{−a−k; a−K}, ngược lại vô nghiệm. Cách 2: xét hai trường hợp Max=|m+K| hoặc |m+k|.
- D2 min|f+m|=a: (m+k=a, m+k>0) ∨ (m+K=−a, m+K<0).
- D3 max ≤ M: m+k ≥ −M và m+K ≤ M ⇒ −M−k ≤ m ≤ M−K.
- D4 min ≤ a: ba trường hợp (cùng dấu dương, cùng dấu âm, hoặc (m+K)(m+k)<0).
- D5 max|f+m| đạt min ⇒ m=−(K+k)/2; giá trị min của max = (K−k)/2.
- D6 min|f+m| đạt min ⇒ −K≤m≤−k; giá trị min = 0.
- D7 max ≤ h·min hoặc min+max = …; D8 min+max=α ⇔ |m+K|+|m+k|=α, min·max=β ⇔ |m+K|·|m+k|=β.

### 12-4 Tiệm cận (A. Lý thuyết)
- TCN: y=y₀ nếu lim_{x→+∞} f = y₀ **hoặc** lim_{x→−∞} f = y₀ (nhấn mạnh "hoặc" — có thể hai TCN, VD2: y=±1 cho √(x²+1)/x).
- TCĐ: x=x₀ nếu **ít nhất một** trong bốn giới hạn một phía bằng ±∞ (nêu đủ 4 điều kiện).
- TCX: y=ax+b (a≠0) nếu lim[f(x)−(ax+b)]=0 ở +∞ hoặc −∞. Chú ý: a = lim f(x)/x; b = lim[f(x)−ax]; a=0 ⇒ TCN. **Mẹo thực hành**: hàm phân thức tách y = (đa thức bậc 1) + r/(x+…) ⇒ TCX là phần bậc 1.
- Ví dụ: VD1 (3x−2)/(x+1); VD2 √(x²+1)/x (hai TCN); VD3 (3−x)/(x+2); VD4 (x²+2)/x (TCĐ x=0); VD5 x+1/(x+2); VD6 (x²−x+2)/(x+1) (2 cách: a,b bằng giới hạn; chia đa thức).
- (Tác giả KHÔNG nêu quy tắc "so sánh bậc tử–mẫu" hay quy tắc TCĐ khi tử=0 — chỉ trong lời giải của các phần sau.)

---
## 4. Đối chiếu với bản đồ cũ (oldmap.md)

### 4.1 GTLN–GTNN — bản đồ cũ có 3 nhóm
Cũ: T112010401 (khi biết ĐT/BBT, 156 câu) · T112010402 (khi biết hàm số, 243 câu) · T112010403 (ứng dụng GTLN–GTNN, 13 câu).

**NBV chia nhỏ hơn cũ (trong cùng phạm vi):**
- Trong "khi biết hàm số" NBV phân chia ngầm theo **loại hàm** (đa thức · phân thức · căn · lượng giác · mũ–log · chia đoạn) và theo **loại tập** (đoạn / khoảng-nửa khoảng không có đầu mút ⇒ phải xét giới hạn / không nêu tập). Số đo: B Dạng 1 có 44 ý (đa thức 14, phân thức 14, căn 5, lượng giác 3, mũ–log 5, đồ thị 2, chia đoạn 1).
- Trong "khi biết ĐT/BBT" có thêm **BBT/bảng xét dấu f′** (11 câu 12-3/C) tách khỏi **đồ thị f** (12 câu), và một kiểu mới: **đồ thị f′ + điều kiện f(a)+f(b)=f(c)+f(d)** (D10,11,14).
- "Ứng dụng": NBV có thể chia ít nhất 8 kiểu (K12–K19): mô hình cho sẵn · lập hàm hình học · kinh tế giá–số lượng · hàm chi phí sẵn · đường đi/thời gian · thang qua góc · khoảng cách ngắn nhất · góc lớn nhất · GTLN của đạo hàm (tốc độ) — 12-3 có 43 (E) + 16 (B Dạng 2) + 15 (D) = **74 câu ứng dụng**, trong khi bản cũ nhóm T112010403 chỉ có 13 câu (phần lớn còn nằm trong chuyên đề "Ứng dụng đạo hàm để giải quyết vấn đề thực tiễn", nhóm T112010601–610). ⇒ **NBV không tách "ứng dụng" thành chuyên đề riêng ngoài GTLN–GTNN; toàn bộ tối ưu hóa thực tế nằm ngay trong 12-3.** Đây là điểm cần quyết khi dựng bản đồ mới (gộp vào "GTLN–GTNN" hay giữ chuyên đề "thực tiễn").

**Bản đồ cũ KHÔNG có (NBV có):**
1. **GTLN–GTNN hàm có tham số m dạng |f(x)+m|** (F, 7 câu + 8 "dạng phương pháp"). Không thấy nhóm tương ứng trong bản cũ.
2. **Hàm hợp f(u(x)) với f cho BBT/đồ thị f′** (F 6,7,11 + 9,10).
3. **GTLN–GTNN của biểu thức nhiều biến** (F Dạng 2: câu 12–15).
4. Hai hàm cùng GTNN, tìm hệ số (F 8).
5. **GTLN của đạo hàm (tốc độ, vận tốc, gia tốc)** — chạm sang nhóm cũ T112010607/608 ("Chuyển động", "Tốc độ thay đổi").
6. **Thang/sào qua góc L** (3 câu E) và **góc lớn nhất** (1 câu E) — bản cũ không có nhóm.
7. **Bài toán tham số k trong PT/BPT nghiệm đúng** (2 ý D) — liên quan "ứng dụng GTLN–GTNN" nhưng bản cũ không nêu.

**Bản đồ cũ có mà NBV KHÔNG có:** "Tốc độ liên quan giữa hai đại lượng" (T112010609; NBV 0 câu), "Tối ưu quãng đường–thời gian" có nhưng gộp vào K16. Các nhóm T112010503–513 (Khảo sát, bậc 3, bậc nhất/bậc nhất, tiếp tuyến, hai điểm cực trị…) — nằm ngoài 12-3/12-4 (không có trong nguồn này).

### 4.2 Tiệm cận — bản đồ cũ có 7 nhóm (NNB01178–01184; T112010301–309)
Cũ: ① TCN (hàm số) ② TCĐ ③ TCX ④ TCX khi biết đồ thị/BBT ⑤ Tiệm cận hàm căn thức ⑥ Tìm tiệm cận bằng định nghĩa ⑦ Góc giữa đường thẳng và tiệm cận. (Bản nháp ERP còn có "TCN khi biết đồ thị/BBT", "TCĐ khi biết đồ thị/BBT", "Tiệm cận của hàm hợp".)

**NBV GỘP lại hơn bản cũ:**
- NBV **không tách TCN / TCĐ / TCX thành 3 chuyên mục**: Dạng 1 tự luận chỉ là "Tìm đường tiệm cận của đồ thị" (mỗi câu đòi tìm hết các loại: "Tìm các tiệm cận của đồ thị hàm số"). Các câu hỏi riêng TCN hoặc TCĐ hoặc TCX chỉ xuất hiện ở C (trắc nghiệm).
- NBV **không có nhóm riêng "TCX khi biết đồ thị/BBT"**: 5 câu C (T7) chỉ khác T6 ở loại tiệm cận được hỏi.

**NBV CHIA nhỏ hơn bản cũ (theo chiều khác):**
- Theo **nguồn thông tin** (cho công thức / đồ thị y=(ax+b)/(cx+d) / đồ thị bất kì / BBT / giới hạn): T1–T8, T12.
- **ĐẾM tiệm cận** tách khỏi **TÌM phương trình tiệm cận** (T9, T10): C 14 câu (13,14,17,24,26,30,39,40,50,57 + 52,69,70,73) + nhiều ở E/D.
- **TCX dạng đã tách phần nguyên** (T5) khác TCX phải chia đa thức (T4).
- **Các câu hỏi gắn với hình học của tiệm cận** — bản cũ chỉ có "góc" (1 nhóm), NBV có: giao điểm/tâm đối xứng (T15), khoảng cách từ điểm thuộc (C) tới hai TC (T16, rất nhiều: B19, B22, E11, F5/6/7/13), diện tích hình tạo bởi TC & trục (T17), điểm thỏa điều kiện khoảng cách (T19). Ngược lại **"góc giữa đường thẳng và tiệm cận" hầu như không thấy** — chỉ F11 "tam giác có một góc 60°" (cực trị + TCX + TCĐ + trục hoành, VDC) và B20 "hệ số góc đường thẳng qua I và K".
- **Tham số m** (T18) — chỉ ở D/E/F (cao).
- **Hàm hợp 1/(f+m)** (T14) có ở cả C, D, E, F — cựu nháp chỉ có "Tiệm cận của hàm hợp" 3 câu, NBV có ít nhất 12 câu (C 67; D 20c,d, 21d, 22c,d, 25d; E 32, 33; F 15, 16, 17; B 18).
- **Ứng dụng tiệm cận** — bản cũ chỉ có T112010610 "Tiệm cận và giới hạn dài hạn trong mô hình" (1 câu) trong chuyên đề thực tiễn. NBV có **22 câu ứng dụng giới hạn dài hạn trong E (14–29: 16) + B (6) + D (5)**, một mảng rõ ràng, với các tình huống lặp: nồng độ dung dịch (5), chi phí trung bình (4), sản phẩm/năng suất (5), nấm men (1), làm sạch (1), ô nhiễm, giá trị xe… — **mảng này đáng thành một nhóm bài riêng**.

**Nhóm cũ không thấy trong NBV:** "tìm tiệm cận bằng định nghĩa" (có 2 câu nhỏ C49, C56 — T12); "góc giữa đường thẳng và tiệm cận" (gần như không có); TCX khi biết đồ thị/BBT (chỉ có từ đồ thị: 5 câu C; không thấy TCX qua BBT).

### 4.3 Kiểu GTLN/ tiệm cận cũ không phân biệt nhưng NBV gộp chung
- NBV C 12-4 phần lớn là **dạng "nhận biết 1 tiệm cận"** (T1–T7: 57 câu/75 = 76%); câu đếm (T9, T10: 14) và hàm hợp (1) là phần nhỏ. Tức độ khó tập trung nhiều ở **E/F**.

---
## 5. Câu "lạ" không vào kiểu nào / lẫn lộn

1. **12-3/F câu 16** (Chuyên Quốc Học Huế 2021): hàm có tham số m, điểm cực đại–cực tiểu, rồi khoảng cách tới đường thẳng d lớn nhất — hỗn hợp "cực trị + quỹ tích + tối ưu khoảng cách", không phải GTLN–GTNN chuẩn.
2. **12-3/D câu 19d, 20d**: PT/BPT chứa tham số k "nghiệm đúng" — ý GTLN–GTNN dùng để giải bài tham số.
3. **12-3/D câu 28c** (con tàu, độ cao tăng/giảm) và **D câu 36b, 39b** (số lượng/giá cổ phiếu tăng giảm): ý đơn điệu, không phải GTLN.
4. **12-3/E câu 41** (Mã 0101 BGD 2025): "cần sản xuất ít nhất bao nhiêu sản phẩm để lợi nhuận **lớn hơn 100 triệu**" — bất phương trình, không phải tối ưu; **E câu 42**: doanh thu thấp nhất, biến n **nguyên**, "trong 100 căn hộ đầu" ⇒ rời rạc.
5. **12-3/E câu 33**: tổng độ dài dây xích "a+b√c" — đề mất công thức (EQ-FAILED) và hình; kiểu "đường gấp khúc ngắn nhất qua nhiều điểm".
6. **12-3/E câu 8**: tham số m với "tốc độ bán hàng luôn tăng trong 10 năm đầu" — thực chất là **đơn điệu f′** (f″≥0), không phải GTLN.
7. **12-3/E câu 36**: "thời gian **chậm nhất**" = GTLN của hàm (đảo chiều so với thường tìm nhanh nhất), lẫn nửa hình tròn.
8. **12-3/B câu 28**: bài đại số thuần (a,b≥0, a+b=4 ⇒ min a⁴+b⁴) nằm trong "Ứng dụng".
9. **12-4/F câu 8** (3−2x)/x: "tổng khoảng cách đến hai TRỤC tọa độ nhỏ nhất" — chỉ dùng tiệm cận như hình dạng đồ thị, không phải tính chất TC.
10. **12-4/F câu 4**: y=mx+1/x có cực trị + khoảng cách từ điểm cực tiểu đến TCX — kết hợp cực trị.
11. **12-4/F câu 11**: cực đại–cực tiểu, TCX, TCĐ với trục hoành tạo tam giác vuông có góc 60° (VDC, kết hợp 3 chuyên đề).
12. **12-4/F câu 2**: √(3x+1)+ax+b … không có TCĐ ⇒ a−b: bài "ép nghiệm kép ở tử", khác nhân liên hợp thường.
13. **12-4/E câu 22** (bể khử trùng): hàm nồng độ phải tự LẬP (20t/(300+60t)) rồi tìm giá trị tiến tới "1/a" — lập hàm + TCN.
14. **12-4/D câu 26**: hàm có |x| và tham số m (nửa lạ).
15. **12-4/D câu 25d**: giao TCĐ của f với TCX của hàm g khác ⇒ ghép hai hàm.

### Câu TRÙNG đề / nghi trùng (quan trọng cho thống kê "nhiều câu")
- 12-3/C: câu 7 = câu 25 (x³−3x²−9x+10 trên [−2;2]); câu 31 = câu 33 (x³+3x²−9x−6 trên [−1;2]); câu 9 = câu 41 (cùng BBT [0;3]); câu 10 và 20 (x³+3x−6 trên [1;3]: min và max); câu 5, 6, 18 (cùng BBT [−1;3], hỏi khác).
- 12-3/D câu 37 = 12-4/D câu 31 (y=5−15t/(9t²+1), nồng độ ô nhiễm/oxygen); 12-3/E câu 17 = 12-4/E câu 21 (nấm men, dữ kiện khác); 12-3/E câu 21 mô hình sân điền kinh.
- 12-4/C: câu 10 = câu 33; câu 12 = câu 29 (cùng hàm, khác phương án); câu 17 = câu 30; câu 38 ≈ 12-3? (không); 12-4/D câu 15 = câu 24 (hoàn toàn cùng hàm); 12-4/D câu 32 = 12-4/E câu 16 = 12-4/E câu 15 ≈ 12-4/B Câu 23 (S(x)=200(5−9/(2+x)), E15 hỏi lớn nhất); 12-4/D câu 29 ≈ 12-4/E câu 14 ≈ B Câu 27.
- Lỗi đề in: 12-4/C câu 6 phương án A và B đều "y=−1"; câu 28 phương án A và D cùng "x=2"; câu 58 B và D cùng "y=x−9" — nên khi nhập kho phải kiểm tra phương án.

---
## 6. Chỗ KHÔNG chắc / không đọc được
- Hình (BBT, đồ thị) không xem được: phân loại "đọc từ đồ thị/BBT" dựa vào lời dẫn; một vài câu hỏi về "số tiệm cận" từ BBT có thể thực chất là T8/T9 — chia chắc chắn ở mức tổng, không chắc ở mức tên từng câu.
- Cột D (Đúng–Sai) 12-3 mô tả theo "chủ đề chung của câu" — nhiều câu D có 4 ý khác kiểu; con số theo ý (156 ý, 128 ý) là 4 × số câu, không đếm lại từng ý theo kiểu.
- 12-3/E câu 33 (xích treo) mất công thức, nên cách giải không xác minh.
- Mức độ (NB/TH/VD/VDC) là ƯỚC LƯỢNG dựa vào độ phức tạp đề; tác giả không ghi mức.
- Chưa đọc lời giải từng câu (chỉ đọc đề để phân loại), nên "cách giải 1 dòng" là kỹ thuật chuẩn, chưa đối chiếu cách tác giả giải ở DA (ngoại lệ: F 12-3 đã đọc phương pháp).
