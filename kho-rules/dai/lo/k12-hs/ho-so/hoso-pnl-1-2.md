# HỒ SƠ NGUỒN — PNL (Toán 12 – PNL 2026), Chương 1, Bài 1 + Bài 2

Nguồn đọc: `SP\txt\pnl\BAI 1. DON DIEU VA CUC TRI\` và `SP\txt\pnl\BAI 2. MIN MAX\` (chỉ đọc bản _GV). Số liệu "đếm" = đếm bằng script trên các tiêu đề `Câu N` / `Bài tập N` từng phần; phân loại kiểu câu là đọc đề từng câu (không giải bài). Hình (BBT/đồ thị) không xem được — suy từ lời dẫn, ghi "(có hình)".
Viết tắt: **P1** = Phần I (trắc nghiệm nhiều lựa chọn), **P2** = Phần II (đúng-sai, mỗi câu 4 ý a–d), **P3** = Phần III (trả lời ngắn), **TL** = "Bài tập tự luyện" (tự luận). Trích dẫn: `B1D2` = Bài 01_Dạng 02; `Đ01`/`Đ02` = Đề 01/Đề 02.

---

## 1. Cấu trúc nguyên văn

Cấu trúc chung mỗi bài: **A. Lý thuyết cần nhớ** → **B. Phân loại và phương pháp giải toán** (trong mỗi file Dạng chỉ có **1 mục "Dạng N" nội bộ**, trùng tên file; không chia dạng con) → Bài tập tự luận (có lời giải) → Bài tập trắc nghiệm P1/P2/P3 (khuôn đề 2025). Cuối bài có "Đề 0x" tổng hợp 22 câu (12 P1 + 4 P2 + 6 P3, 90 phút). **Tác giả KHÔNG gắn nhãn mức độ** (nhận biết/thông hiểu/vận dụng) trong các file đọc — mức độ phải suy từ vị trí & độ khó (xem cột "mức" bên dưới là ƯỚC LƯỢNG của tôi).

**Bài 01. Tính đơn điệu và cực trị của hàm số** (CHƯƠNG 1 Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số)
- Dạng 01. Lý thuyết về tính đơn điệu, cực trị của hàm số cho trước
- Dạng 02. Tìm tham số m để hàm số đơn điệu trên một khoảng cho trước
- Dạng 03. Tìm tham số m để hàm số có cực trị hoặc đạt cực trị tại điểm cho trước
- Dạng 04. Bài toán thực tế đơn điệu và cực trị nâng cao
- Đề 01. Tính đơn điệu và cực trị của hàm số

**Bài 02. Giá trị lớn nhất – nhỏ nhất của hàm số**
- Dạng 01. Lý thuyết và bài toán tìm max, min của hàm số trên một miền
- Dạng 02. Bài toán tìm max, min của hàm số có chứa tham số
- Dạng 03. Bài toán tối ưu, thực tế liên quan đến max min
- Dạng 04. Bài toán thực tế max min nâng cao
- Đề 02. Max-min của hàm số

**Khối lượng đếm được (mỗi file GV):**

| File | TL (bài / ý) | P1 | P2 | P3 | Tổng câu TN |
|---|---|---|---|---|---|
| B1D1 | 8 bài | 36 | 14 | 10 | 60 |
| B1D2 | 3 bài (18 ý) | 38 | 5 | 8 | 51 |
| B1D3 | 2 bài (12 ý) | 28 | 4 | 8 | 40 |
| B1D4 | 0 | 16 | 5 | 6 | 27 |
| Đ01 | 0 | 12 | 4 | 6 | 22 |
| B2D1 | 4 bài (19 ý) | 34 | 8 | 6 | 48 |
| B2D2 | 2 bài (6 ý) | 15 | 4 | 8 | 27 |
| B2D3 | 2 bài | 12 | 7 | 12 | 31 |
| B2D4 | 30 câu "tự luận" (thực chất trả lời ngắn, không có phương án) | — | — | — | 30 |
| Đ02 | 0 | 12 | 4 | 6 | 22 |

Tổng: Bài 1 = 178 câu TN (60+51+40+27) + 13 bài TL (≈47 ý a–h, kể cả 5 bài thực tế một ý) + Đề 01 (22); Bài 2 = 136 câu (48+27+31+30) + 8 bài TL (≈27 ý) + Đề 02 (22). (Câu P2 tính là 1 câu = 4 ý.) Lưu ý: nhiều câu **trùng/cùng hàm** giữa các file (xem §6).

---

## 2. Các KIỂU CÂU thật sự có trong từng Dạng của tác giả

Quy ước cột: **Kiểu** (tên ngắn) · **Dấu hiệu** · **Cách giải 1 dòng** · **Số câu** (đếm; gồm P1/P2/P3 + TL nếu có) · **Ví dụ** · **Mức** (ước lượng: NB/TH/VD/VDC).

### 2.1 B1D1 — "Dạng 01. Lý thuyết về tính đơn điệu, cực trị của hàm số cho trước" (60 câu TN + 8 bài TL)
Tên dạng nghe như một chuyên đề nhưng THỰC TẾ gom **8 kiểu** (lý thuyết chỉ ở mục A; ở B chỉ ghi quy trình 4 bước TXĐ→y'→BBT→kết luận):

| # | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 1a | Đơn điệu của hàm CHO SẴN CÔNG THỨC | "Hàm số y = … đồng/nghịch biến trên khoảng nào"; hàm bậc 3, trùng phương, bậc1/bậc1, bậc2/bậc1, căn; cả câu "mệnh đề đúng/sai", "đếm số mệnh đề đúng" | y' → dấu y' → khoảng | P1 13 + P2 4 (C1,2,4,5) = **17**; TL: BT2 (4 hàm), BT1 (4 hàm, đơn điệu+cực trị) | `B1D1 P1 C4` (y=(−x+2)/(x−1) "khẳng định đúng"); `C23` (y=√(8+2x−x²)); `P1 C10` (4 mệnh đề, đếm đúng) | NB–TH |
| 1b | Cực trị của hàm CHO SẴN | "Có bao nhiêu điểm cực trị / giá trị cực tiểu / tọa độ điểm cực tiểu của đồ thị" | y'=0, đổi dấu | P1 3 (C27, 29, 32) + P2 2 (C6, C7) = **5**; TL: BT3 (4 hàm) | `P1 C29` (giá trị cực tiểu của y=−x³+3x+4); `P2 C6` (y=√(x²+1), không đạo hàm=0 nhưng có cực trị) | NB–TH |
| 1c | Đọc BBT / bảng xét dấu f' / đồ thị f (có hình) | "Cho bảng xét dấu f'(x) như sau / đồ thị như hình", hỏi khoảng ĐB/NB, số điểm cực trị | đọc hình, không tính | P1 8 (C2,3,5,8,12,14,17,35) + P2 2 (C3,C9) + P3 1 (C6) = **11** | `P1 C2` (bảng xét dấu f', nghịch biến khoảng nào); `P3 C6` (bảng xét dấu, đếm cực trị) | NB |
| 1d | f' cho bằng CÔNG THỨC dạng tích nhân tử | "f'(x) = (x+1)(2x−5)²…", hỏi đơn điệu/số cực trị/cực đại/so sánh f(a),f(b) | lập bảng dấu f' (chú ý nghiệm bội chẵn không đổi dấu) | P1 10 (C11,16,18,19,21,28,30,31,33,34) | `P1 C30` (f'=(x−1)²(x²−5x+6), số cực trị); `C18` (so sánh f(5),f(4),f(3)) | TH |
| 1e | Cho ĐỒ THỊ của f' | "hàm y=f'(x) có đồ thị như hình" → hỏi đơn điệu/cực trị của f | dấu f' từ đồ thị (f' trên/dưới trục Ox, đổi dấu) | P1 2 (C24, C36) + P2 1 (C8) = **3** | `P1 C36` (f' là hàm bậc 3 hình, f bậc 4, số cực trị) | TH |
| 1f | Hình học các điểm cực trị (tính toán) | "độ dài AB, khoảng cách từ O tới AB, diện tích tam giác với 2 trục, bán kính đường tròn nội tiếp tam giác 3 cực trị" | tìm tọa độ cực trị rồi dùng công thức hình tọa độ | P3 4 (C1,3,4,5) | `P3 C4` (y=(x²−4x+5)/(x−1), đường thẳng qua 2 cực trị tạo tam giác với trục, diện tích); `P3 C5` (nội tiếp tam giác 3 cực trị trùng phương) | VD |
| 1g | Tìm hệ số / dấu hệ số từ dữ kiện cực trị (không tham số cần cô lập) | "có 2 điểm cực trị (−1;18), (3;−16) tính a+b+c+d"; "trong a,b,c có bao nhiêu số âm" | y'(x0)=0 + điểm thuộc đồ thị; dấu hệ số qua nghiệm y' | P3 2 (C2, C7) | `P3 C2`; `P3 C7` | VD |
| 1h | Bài toán thực tế "hàm cho sẵn" (đơn điệu/cực trị) | lời văn: lợi nhuận, nồng độ thuốc, chuyển động…, đã cho P(x)/C(t) | đạo hàm, dấu đạo hàm, diễn giải | P2 5 (C10–14) + P3 3 (C8–10, có tham số m phải tìm) = **8**; TL BT4–8 (5 bài) | `P2 C12` (v(C)=0,1C/(C²+0,5), 4 mệnh đề); `P3 C10` (C(v)=2v+m/v, tìm m để chi phí min tại v=…); TL `Bài tập 4` (thể tích nước V(T)) | TH–VD |
Tổng đối chiếu: 17+5+11+10+3+4+2+8 = 60 ✓.

### 2.2 B1D2 — "Dạng 02. Tìm tham số m để hàm số đơn điệu trên một khoảng cho trước" (51 câu TN + 3 bài TL/18 ý)
Lý thuyết tác giả (mục B) = 3 khối: bậc 3 đơn điệu trên ℝ (a, Δ'); bậc1/bậc1 (ad−bc); bậc2/bậc1. Thực tế gom **7 kiểu**:

| # | Kiểu | Dấu hiệu | Cách giải 1 dòng | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 2a | Bậc 3 đơn điệu trên ℝ | y=ax³+…, "đồng/nghịch biến trên ℝ"; hệ số a chứa m (xét a=0); hỏi "số m nguyên / m lớn nhất / tập m = [a;b]" | y'≥0 ∀x ⇔ a>0, Δ'≤0 (+ xét a=0) | P1 11 (C2,3,4,6,9,11,13,14,15,17,27) + P2 1 (C1) + P3 1 (C1) = **13**; TL BT1 a,b,h (3 ý) | `B1D2 P1 C4` (y=(m²−1)x³+(m−1)x²−x nghịch biến ℝ, số m nguyên); `P1 C14` ("giá trị lớn nhất của m") | TH |
| 2b | Bậc 3 đơn điệu trên KHOẢNG/NỬA KHOẢNG con | "nghịch biến trên (−3;0) / (0;5) / [1;+∞)…" | cô lập m: m ≥ g(x) hoặc so sánh nghiệm y' với khoảng; BBT g | P1 3 (C24,26,28) + P2 1 (C2) = **4**; TL BT1 c–g (5 ý) | `P1 C26` (y=2x³−3(m+1)x²+6mx+1 nghịch biến (1;3)) | VD |
| 2c | Bậc1/bậc1 đơn điệu trên TỪNG KHOẢNG XÁC ĐỊNH | "đồng biến trên từng khoảng xác định" | ad−bc>0 (hay <0) | P1 4 (C1,5,7,10) + P2 1 (C3) = **5**; TL BT2 a,b (2 ý) | `P1 C10` (y=(x+m²)/(x+4), đếm m nguyên) | NB–TH |
| 2d | Bậc1/bậc1 đơn điệu trên KHOẢNG con | "(mx+2m+3)/(x+m) nghịch biến trên (2;+∞)" | ad−bc & −d/c ∉ khoảng | P1 4 (C19,22,23,30) + P3 2 (C6,7) = **6**; TL BT2 c–h (6 ý) | `P1 C22`; `P3 C6` (y=(mx+9)/(4x+m) nghịch biến (0;4)) | TH–VD |
| 2e | Bậc2/bậc1 (có m) đơn điệu | "(x²+5x−m−1)/(5x−m) …" từng khoảng xác định hoặc trên khoảng | y' = (tử bậc 2)/(mẫu)² ; cô lập m; điều kiện mẫu khác 0 | P1 6 (C32–36, 38) + P3 1 (C8) = **7**; TL BT3 (2 ý) | `P1 C35`; `P1 C38` (nghịch biến (1;3) VÀ đồng biến (4;6)) | VD |
| 2f | Hàm lượng giác/ln/căn có m → đặt t | y=(2cot x+1)/(cot x+m), (ln x−6)/(ln x−3m), √(1−x)… | đặt t=u(x), đổi khoảng của t, về bậc1/bậc1 hay bậc 3; chú ý u'(x) dấu | P1 6 (C16,18,20,21,29,31) + P2 1 (C5) + P3 1 (C2) = **8** | `P1 C20` (cos x+1)/(10cos x+m); `P1 C31` (ln x); `P2 C5` (cot, 4 ý dẫn dắt "đặt t=cot x") | VD |
| 2g | Hàm "khác" / điều kiện lạ | tuyến tính+lượng giác (√3 sin x+cos x−mx); x+3−m/(x−2); x³+mx−1/(5x⁵); 1/(x²+x+m); "nghịch biến trên khoảng có độ dài 3"; cắt Ox 3 điểm; biểu thức P(m,n) | cô lập m (thường y' ≥ 0 ⇔ m ≥/≤ g(x)), hay phép biến đổi riêng | P1 4 (C8,12,25,37) + P2 1 (C4, không tham số) + P3 3 (C3,4,5) = **8** | `P1 C8`; `P3 C5` (khoảng độ dài =3); `P3 C3` (y=x³−3x²+3m−1 cắt Ox 3 điểm) | VD–VDC |
Tổng 13+4+5+6+7+8+8 = 51 ✓. Chú ý: P1 C37 trong file có chèn lời giải (lỗi biên soạn).

### 2.3 B1D3 — "Dạng 03. Tìm tham số m để hàm số có cực trị hoặc đạt cực trị tại điểm cho trước" (40 câu TN + 2 bài TL/12 ý)
Lý thuyết mục B gồm: cực trị tại x0 (y'(x0)=0 + kiểm tra BBT); biện luận bậc 3 (Δ', a≠0); hệ thức Viet; công thức độ dài/khoảng cách/diện tích; PT đường thẳng qua 2 cực trị. Thực tế gom **8 kiểu** (hầu hết là hàm bậc 3, một ít bậc2/bậc1 và trùng phương):

| # | Kiểu | Dấu hiệu | Cách giải 1 dòng | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 3a | Đạt cực đại/tiểu tại x0 cho trước | "đạt cực tiểu tại x=2", "đạt cực đại tại x=−1" | y'(x0)=0 rồi thử lại bằng y'' hoặc BBT (loại nghiệm) | P1 11 (C1–9, 11 bậc 3 + C10 bậc2/bậc1) ; TL BT1 (4 ý) | `B1D3 P1 C9` (cực tiểu tại x=0, có 2 đáp án m); `P1 C11` ("không tồn tại m") | TH |
| 3b | Điều kiện về SỐ cực trị (có/không/ hai) | "có hai điểm cực trị", "không có cực trị", "có cực đại" | Δ'>0 (≥,≤) & a≠0; xét a=0 suy biến | P2 1 (C1) ; TL BT2 a–d (4 ý) | `P2 C1` (y=(m/3)x³+2x²+mx+1, a chứa m) | TH |
| 3c | Hệ thức Viet giữa x1,x2 | "x1²+x2²=3", "x1+x2−3x1x2=1", "\|x1\|−\|x2\|=−4", "3x_CD²=4x_CT" | Viet từ y'=0 + điều kiện Δ'>0 | P1 6 (C12,13,20,21,22,27) + P3 2 (C2,C8) = **8**; TL BT2 e (1 ý) | `P1 C20` (hàm (2/3)x³−mx²−2(3m²−1)x+2/3, x1x2+2(x1+x2)=1) | VD |
| 3d | Dấu / vị trí hai điểm cực trị (so với trục tung) | "hai điểm cực trị trái dấu / cùng dấu / dương / nằm bên phải Oy" | y'=0 có 2 nghiệm thỏa P<0 / S>0,P>0 + Δ'>0 | P1 5 (C14,15,16,17,23) | `P1 C17` (số m nguyên 2 cực trị trái dấu) | TH–VD |
| 3e | Điều kiện hình học lên 2 điểm cực trị của ĐỒ THỊ | "cực tiểu thuộc đường thẳng d", "O,A,B thẳng hàng", "A,B hai phía Ox / cách đều d", "2y_CĐ+y_CT=4", "hai giá trị cực trị cùng dấu", tam giác ABO cân/vuông, tam giác ABC có diện tích S | tìm tọa độ cực trị (nhớ công thức đường thẳng qua 2 cực trị), thiết lập phương trình theo m | P1 6 (C18,19,24,25,26,28) + P2 1 (C2) + P3 3 (C5,6,7) = **10**; TL BT2 f,g,h (3 ý) | `P1 C28` (A,B cách đều d:y=5x−9); `P3 C7` (đường thẳng qua 2 cực trị tạo tam giác với tia Ox,Oy diện tích 9/4) | VD–VDC |
| 3f | Tìm hệ số từ điểm cực trị | "có điểm cực trị A(−1;29) và đi qua B(2;2)"; "điểm cực tiểu I(1;3), tìm m+n" | hệ phương trình y'(x0)=0, y(x0)=y0 | P3 2 (C1,C3) | `P3 C1`; `P3 C3` | TH–VD |
| 3g | Trùng phương – tam giác 3 cực trị | y=x⁴−2mx²+m−1 có 3 cực trị tạo tam giác diện tích 4√2 | tọa độ 3 điểm cực trị, S=… | P3 1 (C4) | `P3 C4` | VD |
| 3h | Bậc2/bậc1 – cực trị & đường thẳng qua 2 cực trị | "y=(x²+2x+3)/(2x+1)", "(x²−2mx+m+2)/(x−m)": số m, PT đường thẳng qua 2 cực trị | y'=0, đường thẳng = y = (tử')/(mẫu') | P2 2 (C3,C4) | `P2 C4` | VD |
Tổng: 11+1+8+5+10+2+1+2 = 40 ✓.

### 2.4 B1D4 — "Dạng 04. Bài toán thực tế đơn điệu và cực trị nâng cao" (27 câu TN, KHÔNG có TL, không có lý thuyết ngoài 2 dòng "đạo hàm → BBT → kết luận")
Tên "nâng cao" nhưng nội dung là bài toán lời văn cho SẴN hàm; kiểu theo ngữ cảnh:

| # | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 4a | Chuyển động (s→v→a) | "chất điểm/vật/tên lửa/tàu chuyển động theo s(t)=… Hỏi vận tốc max/khoảng v tăng/giảm/gia tốc…" | v=s', a=v', xét hàm v hoặc a trên miền | P1 5 (C1,6,8,10,12) + P2 3 (C1,2,3) + P3 3 (C1,2,4: sao Hỏa, chất điểm, lượng giác) = **11** | `B1D4 P1 C8` (vận tốc giảm trong (a;b), tính 3b−4a); `P3 C4` (x=2sin(πt/4+π/2)) | TH–VD |
| 4b | Tốc độ tăng trưởng/nồng độ/doanh số theo thời gian (hàm có e^t, phân thức) | "nồng độ thuốc C(x)=30x/(x²+2)", "logistic f(t)=5000/(1+5e^−t) tốc độ bán nhanh nhất", "nấm men/virut" | đạo hàm lần 1 → tốc độ; đạo hàm lần 2 → thời điểm tốc độ max | P1 6 (C2,5,7,9,14,15) + P2 1 (C4 kim ngạch) + P3 1 (C3 logistic) = **8** | `P1 C15` (logistic, đạo hàm đạt max tại t≈?); `P1 C9` (virut, khoảng (0;a ln b)) | VD |
| 4c | Kinh tế/chi phí lập luận trên hàm cho sẵn | "lợi nhuận y=−2x⁴+36x²−90, chọn giá", "chi phí bảo trì", "thiệp 20-10", "phà" | khảo sát hàm đã cho (một số phải tự lập hàm từ giả thiết, vd C16) | P1 3 (C3,4,16) + P3 2 (C5,6) = **5** | `P1 C16` (chi phí = 400 + k·v², tìm k rồi tính tổng); `P1 C4` (hầu như chỉ thế x=0) | TH–VD |
| 4d | Hình học/vật lý có hàm bậc 3, ánh sáng | "tia sáng A→mặt phân cách→B (Fermat)", "đường ray tàu lượn bậc ba tìm a,b,c", "công viên: bậc 3 + đường tròn + chi phí cầu" | lập hàm / giải hệ hệ số | P1 2 (C11,13) + P2 1 (C5) = **3** | `P1 C11` (tia sáng); `P2 C5` (4 ý nhiều bước) | VD–VDC |
Tổng 11+8+5+3 = 27 ✓.

### 2.5 B2D1 — "Dạng 01. Lý thuyết và bài toán tìm max, min của hàm số trên một miền" (48 câu TN + 4 bài TL/19 ý)
Lý thuyết: định nghĩa max/min; trên đoạn [a;b]: so sánh f(a), f(x0), f(b); đồng biến/nghịch biến → giá trị ở đầu mút; BĐT Cauchy 2,3,n số (chỉ liệt kê lý thuyết; hầu như không dùng ở bài tập dạng này). Thực tế **9 kiểu**:

| # | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 5a | Đọc max-min từ ĐỒ THỊ (có hình) | "đồ thị như hình, max/min trên [−3;3] bằng", "M+m" | đọc điểm cao/thấp nhất | P1 4 (C1–4) + P2 1 (C8: đồ thị nhiệt độ cả ngày) = **5** | `B2D1 P1 C4` (M+m, hình Visio) | NB |
| 5b | Đọc max-min từ BBT (có hình) | "BBT, M, m trên đoạn…", "x0·f(x0)", khoảng MỞ (tồn tại max/min không?) | đọc BBT; chú ý khoảng mở/giá trị tại đầu mút | P1 3 (C5,7,8) + P2 3 (C1,3,4) = **6** | `P2 C1` (BBT trên (−4;4), 4 phương án max/min); `P2 C4` (cực đại ≠ max) | NB–TH |
| 5c | Max-min từ ĐỒ THỊ/bảng dấu của f' (so sánh f tại mút) | "f' có đồ thị…, max f trên [−2;6] bằng f(?)", "\|f(x)\|" | lập BBT của f, so sánh f(mút) (có thể dùng diện tích/giả thiết f(0)+f(3)=f(2)+f(5)) | P1 1 (C6) + P2 3 (C5,6,7) = **4** | `P2 C6` (f(0)+f(3)=f(2)+f(5)) | VD |
| 5d | Hàm đa thức trên đoạn | y=x³… trên [a;b] | y' → so sánh mút/nghiệm | P1 4 (C9–12); TL BT1 a,b | `P1 C11` | NB |
| 5e | Hàm phân thức / hỗn hợp x+a/x trên đoạn | (x²+3)/(x−1), x+9/(x−1), 4/x+x+1, 2x³+1/(2x) | y' → mút/nghiệm | P1 8 (C13,16,19,20,21,25,28,31) + P3 2 (C4,5) = **10**; TL BT1 c,d,e,f,h | `P1 C19` (đoạn [−4;−1], x+9/(x−1)); `P3 C4` (x²+16/x trên [1;4]) | TH |
| 5f | Hàm căn thức (đoạn hoặc TXĐ) | √(16−x²), x√(16−x²), √(2x+14)+√(5−x), √(x−3)+√(5−x), √(−x²+3x+4) | TXĐ → y' ; có thể dùng Cauchy | P1 6 (C14,17,18,22,24,32); TL BT1 g | `P1 C22` | TH |
| 5g | Hàm lượng giác/mũ/log | x+cos²x, 4x+sin²πx, 2x+cos(πx/2), (1+cos2x)/(2+sin x), sin x·cos²(x/2), e^x(x²−3) | y' → nghiệm trong đoạn (đặt t=sin x nếu cần) | P1 7 (C15,23,26,27,29,30,34) + P3 2 (C2,C3) = **9**; TL BT2 (4 ý), BT3 (2 ý) | `P1 C34`; `P3 C3` (M=a/e^b) | TH–VD |
| 5h | Max/min trên KHOẢNG hoặc ℝ (có tồn tại không) | "trên khoảng (0;+∞)", "trên khoảng (−25; 11/10)" | BBT trên khoảng; xét giới hạn | P1 1 (C33) + P2 1 (C2) = **2**; TL BT1 i,k,l,m (4 ý) | `P2 C2` (x+4/x trên (0;+∞)) | TH |
| 5i | Lạ / thực tế 1 câu | f(b)−f(a) nhỏ nhất với a<b nguyên; thực tế vi khuẩn; liều thuốc | — | P3 C1 (f(b)−f(a)); P3 C6 (vi khuẩn); TL BT4 (liều thuốc) = **2** | `P3 C1` | VDC / TH |
Tổng 5+6+4+(4+10)+6+9+2+2 = 48 ✓ (14=5d+5e... nhóm 5d+5e = 14).

### 2.6 B2D2 — "Dạng 02. Bài toán tìm max, min của hàm số có chứa tham số" (27 câu TN + 2 bài TL/6 ý); KHÔNG có đoạn lý thuyết
| # | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 6a | Bậc1/bậc1 chứa m: max+min = k hoặc min/max = k | "(x−m)/(x+1) trên [0;2]: tổng max+min = 6", "(x−m²)/(x+8) min = −9/2" | hàm đơn điệu trên đoạn ⇒ max/min ở mút; lập phương trình theo m, loại nghiệm sai | P1 7 (C1,7,10,12,13,14,15) + P2 1 (C1) + P3 2 (C5,C8) = **10**; TL BT1 b,d, BT2 b (3 ý) | `B2D2 P1 C15`; `P3 C8` | TH–VD |
| 6b | Đa thức bậc 3 cộng m, max/min trên đoạn hoặc nửa trục | "x³−3x+m", "max trên (−∞;0) = 5 ⇒ min trên (0;+∞)" | BBT của phần không m; max/min dịch theo m | P1 3 (C3,6,9) + P2 1 (C2) + P3 2 (C1,C2) = **6**; TL BT1 c, BT2 a (2 ý) | `P1 C3` (x³−3x+m); `P3 C1` | TH–VD |
| 6c | Chứa \|·\| hoặc bình phương hàm | y=(x³−3x−m+1)², y=\|4x−m\|−x², max của \|f(x)\| | max \|f\| = max{\|max f\|,\|min f\|} | P1 1 (C11) + P3 1 (C3) = **2** (+ ý d của P2 C2) | `P1 C11`; `P3 C3` | VDC |
| 6d | Lượng giác/căn + m | x+√(4−x²)+m có max 3√2; 4x²√(1−x²)… ; (3−m√3 cos x)/(sin x+2) | tìm max thuần túy rồi cộng m / đặt ẩn | P1 2 (C2,5) + P3 3 (C4,6,7) = **5** | `P1 C5`; `P3 C7` | VD–VDC |
| 6e | Phân loại theo m (mx+36/(x+1)) | "khi m≤0…, khi 9/4≤m≤36…" | xét dấu y' theo m: 3 khoảng giá trị m | P2 1 (C3) | `P2 C3` | VDC |
| 6f | Bậc2/bậc1 chứa m | (x²+mx−1)/(x+m), m>0 | y' trên đoạn | P2 1 (C4); TL BT1 a (1 ý) | `P2 C4` | VD |
| 6g | Lạ (hàm hợp / hai tham số) | (x+m)³−3(x+m)+1+n, g(x+f(x)) với f=10^x+x | đổi biến t=x+f(x) (đồng biến) | P1 2 (C4,C8) | `P1 C8` | VDC |
Tổng 10+6+2+5+1+1+2 = 27 ✓.

### 2.7 B2D3 — "Dạng 03. Bài toán tối ưu, thực tế liên quan đến max min" (31 câu TN + 2 bài TL)
Lý thuyết: chuyển động (s', v') & "biểu diễn dữ kiện qua một hàm f(t), khảo sát trên miền điều kiện".
| # | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 7a | Chuyển động: vận tốc/gia tốc lớn nhất | s(t) cho sẵn, tìm v max trong [0;T] | v=s', max v trên đoạn | P1 2 (C1,2) + P3 1 (C9); TL BT1 = **3 + 1TL** | `B2D3 P1 C1` | TH |
| 7b | Mô hình cho sẵn (y tế/sinh học/giao thông) | huyết áp G(x)=0,025x²(30−x), vi khuẩn N(t), lưu lượng xe f(v), nồng độ c(t), xăng V(t) | max/min hàm đã cho trên miền | P1 2 (C3,4) + P2 1 (C1) + P3 3 (C5,7,8) = **6** | `P3 C5` (386v/(v²+2v+5)) | TH |
| 7c | Hình học tối ưu — HỘP CẮT GÓC | cắt 4 góc hình vuông gập thành hộp không nắp, V max | V=x(a−2x)(b−2x), khảo sát | P1 2 (C7,10) + P2 1 (C6) + P3 1 (C2) = **4** | `P2 C6` (tấm nhôm vuông cạnh a: x=a/6, V=2a³/27) | TH |
| 7d | Hình học tối ưu — BỂ/HỐ GA/BỂ CÁ (thể tích cố định, chi phí/diện tích min) | hình hộp không nắp, dài gấp đôi rộng; hố ga trụ; bể 2 ngăn | rút 1 ẩn từ V cố định ⇒ hàm 1 biến (hoặc Cauchy) | P1 2 (C8,9) + P3 3 (C1,6,12) = **5** | `P3 C1` (hố ga hình trụ 3 m³) | VD |
| 7e | Hình học tối ưu — hình phẳng (nội tiếp, chu vi cố định, dây uốn, hàng rào) | tam giác vuông cạnh huyền 5; chữ nhật nội tiếp nửa tròn; dây 6 m uốn tam giác đều+hình vuông; hàng rào chữ E; đất trồng cỏ | lập hàm 1 biến theo 1 cạnh/góc | P1 3 (C5,6,11) + P2 1 (C7) + P3 2 (C4,C11) = **6**; TL BT3 | `P1 C11`; `P3 C4` (dây vuông+tròn) | VD |
| 7f | Hình học — đường đi qua điểm M (AB min) | "đoạn AB đi qua M, chi phí thấp nhất" | y=f(a) hoặc dùng độ dốc | P3 1 (C3) | `P3 C3` | VDC |
| 7g | Kinh tế/chi phí/mật độ nuôi | giá bán-lượng bán tuyến tính, nuôi tôm/cá mật độ x con/m² | lập hàm bậc 2 hoặc bậc 3 theo x | P1 1 (C12) + P2 4 (C2,3,4,5) + P3 1 (C10) = **6** | `P2 C5` (cá chim: giảm 8 con/m², tăng 0,5 kg/con); `P1 C12` (xe gắn máy giá bán) | VD |
Tổng 3+6+4+5+6+1+6 = 31 ✓.

### 2.8 B2D4 — "Dạng 04. Bài toán thực tế max min nâng cao" (30 câu, đề nêu "tự luận" nhưng đều là câu trả lời ngắn có hình)
Phần lý thuyết giống Dạng 03. Kiểu (tất cả đa phần VD–VDC, nhiều hình):
| # | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 8a | Tối ưu hình khối/diện tích/chi phí (đề lạ hơn Dạng 3) | sơn hình vuông+4 tam giác cân; hộp 4000 cm³ ít bìa nhất; lục giác đều gập lăng trụ; hộp quà cắt hình vuông+chữ nhật; bể 288 m³; mảnh đất ao 384 m²; trồng cỏ | lập hàm 1 biến, BBT | **9**: C1,3,4,5,8,11,12,14,24 | `B2D4 C1`; `C14` | VD–VDC |
| 8b | Độ dài/khoảng cách NGẮN NHẤT (hình phẳng & hệ tọa độ) | thang vượt hàng rào; dây xích treo; cầu từ bờ ao tới vườn tròn; cầu EF qua sông; đường dây A–C–B từ hai mô đất; cầu giữa y=e^{x−2} và y=ln(x−5); cáp treo đảo | độ dài như hàm 1 biến; phản xạ; hoặc tiếp tuyến chung | **7**: C2,9,17,18,19,28,30 | `C2` (thang qua hàng rào 2,4 m cách tường 1,5 m); `C28` (cầu giữa hai đồ thị) | VDC |
| 8c | Đường đi nhiều vận tốc (bơi/chạy/ngựa/xe-sa mạc) | 2 môi trường, 2 vận tốc, tìm thời gian/quãng đường nhỏ nhất | t=d1/v1+d2/v2 theo 1 biến (kiểu Fermat) | **5**: C6,7,10,16,20 | `C10` (ngựa đất ướt/khô); `C16` (cánh đồng/đường CD, 4 và 8 km/h) | VDC |
| 8d | Chuyển động hai điểm (khoảng cách nhỏ nhất theo thời gian) | hai chuỗi led chạy trên AB, AC với vận tốc khác nhau | d²(t) bậc 2 theo t | **1**: C13 | `C13` | VD |
| 8e | Parabol / bậc 3 đặt trong hệ tọa độ | cổng parabol chữ nhật nội tiếp; tàu lượn bậc ba; hòn đảo bậc ba (hai điểm cực trị cho trước); vườn parabol+tròn | tìm phương trình rồi tối ưu | **4**: C15,21,23,25 | `C15` (cổng parabol 9m×6m) | VDC |
| 8f | Góc / phối cảnh (góc nhìn, tầm chiếu) | đài quan sát góc nhìn BC lớn nhất; đèn pin chiếu góc 30°/60° | hàm theo góc hoặc đoạn, tan(α−β) | **3**: C22,27,29 | `C22`; `C29` | VDC |
| 8g | Vật lý — tầm xa tia nước | tầm xa R(α), v0=20 m/s | hàm theo α | **1**: C26 | `C26` | VD |
Tổng 9+7+5+1+4+3+1 = 30 ✓. Ghi chú: C24 = `B2D3 P3 C11` (trùng nguyên văn).

---

## 3. Lý thuyết cốt lõi + phương pháp tác giả nêu (ngắn)

**Bài 1**
- Đơn điệu: định nghĩa x1<x2 ⇒ f(x1)<f(x2) (ĐB) / > (NB). Định lí 1: f'≥0 (≤0) trên K, bằng 0 tại hữu hạn điểm ⇒ ĐB (NB).
- Cực trị: định nghĩa theo lân cận (x0−h; x0+h); f cực trị ở x0 ⇒ f'(x0)=0 hoặc không tồn tại; điều kiện đủ: f' ĐỔI DẤU khi qua x0; tên gọi: "điểm cực đại của hàm" ≠ "giá trị cực đại" ≠ "điểm cực đại của đồ thị" (có hình minh họa).
- Quy trình 4 bước (TXĐ → y' → bảng xét dấu/BBT → kết luận).
- Dạng 2 (tham số, đơn điệu): bậc 3 trên ℝ: a>0, Δ'≤0 (xét a=0 khi hệ số a có m); bậc1/bậc1: y'=(ad−bc)/(cx+d)², cần ad−bc>0 (<0); bậc2/bậc1: y' tử bậc 2 ≥0 (≤0) ∀x≠−e/d.
- Dạng 3 (tham số, cực trị): cực trị tại x0 ⇒ y'(x0)=0 rồi LẬP BBT kiểm tra; bậc 3: Δ'=b²−3ac>0, a≠0 ⇒ 2 cực trị; Viet x1+x2=−2b/(3a), x1x2=c/(3a) + 3 hằng đẳng thức; công thức độ dài, khoảng cách điểm–đường, tam giác vuông (tích vô hướng=0), diện tích (định thức); **đường thẳng qua 2 cực trị: y=−(2/9a)(b²−3ac)x + d − bc/(9a)**.
- Dạng 4 (thực tế): "từ công thức cho sẵn đạo hàm và vẽ BBT, từ BBT kết luận"; v=s', a=v'.

**Bài 2**
- Định nghĩa max/min (f(x)≤M ∀x∈D, ∃x0: f(x0)=M). Mặc định tìm trên TXĐ nếu đề không nêu miền.
- Trên đoạn [a;b]: giải f'=0 trong (a;b), điểm đạo hàm không tồn tại, tính f(a), f(x0), f(xi), f(b), lấy lớn nhất/nhỏ nhất. Hàm ĐB trên [a;b]: min=f(a), max=f(b) (NB ngược lại).
- Trên khoảng/miền khác: lập BBT, "điểm cao nhất ⇒ max, thấp nhất ⇒ min".
- BĐT Cauchy 2, 3, n số (a+b≥2√(ab)…) liệt kê làm công cụ đánh giá (dùng thật ở lời giải một số câu tối ưu hình học, vd `B2D3 P3 C11`: x(1−x) ≤ 1/4).
- Tối ưu thực tế: "biểu diễn đại lượng cần max/min qua 1 hàm f(t), khảo sát trên miền điều kiện".

---

## 4. Chỗ tác giả chia nhỏ hơn / gộp hơn bản đồ cũ (đối chiếu `oldmap.md`)

Bản đồ cũ chia theo **đầu vào (hình – công thức)** : Tính đơn điệu 4 nhóm (BBT/đồ thị; hàm cho sẵn; hàm phức tạp khi biết f'; hàm phức tạp khi biết đồ thị/BBT f'), Cực trị 2 nhóm (cho trước; BBT/đồ thị), GTLN-GTNN 3 nhóm (BBT/đồ thị; hàm; ứng dụng). PNL chia theo **mục tiêu/độ khó** (hàm cho trước → có tham số → thực tế → nâng cao).

**PNL GỘP hơn bản cũ:**
1. Đơn điệu + cực trị gộp một dạng ("hàm cho trước", B1D1); bên trong lại gom luôn 5 kiểu "đầu vào" (công thức, BBT/bảng dấu/đồ thị f, f' tích nhân tử, đồ thị f') — tức là PNL KHÔNG tách "BBT/đồ thị" riêng như bản cũ; ba nhóm cũ T112010101/102/201/202 nằm chung một dạng.
2. Toàn bộ thực tiễn (chuyển động, tốc độ thay đổi, kinh tế, hình học) nằm chung "Dạng thực tế" ở 3 chỗ (B1D4, B2D3, B2D4), không tách chuyên đề thực tiễn riêng 10 nhóm như bản cũ; kiểu cũ "T112010607 chuyển động" / "T112010608 tốc độ thay đổi" / "T112010605 kinh tế" / "T112010604 hình học" đều có mặt (xem 4a–4d, 7a–7g).

**PNL CHIA NHỎ HƠN / CÓ MÀ BẢN CŨ KHÔNG CÓ:**
1. **Đơn điệu có tham số m** (B1D2) — 51 câu + 18 ý TL, 7 kiểu: bản cũ **không có nhóm nào** (chỉ có "hàm cho sẵn"/"phức tạp").
2. **Cực trị có tham số m** (B1D3) — 40 câu + 12 ý TL, 8 kiểu: bản cũ chỉ có phần "đường thẳng qua hai điểm cực trị" (T112010511) và "cực trị hàm bậc 3" (T112010505) trong chuyên đề Khảo sát; tức là PNL xếp phần này vào Bài 1 (không phải Khảo sát hàm số) và chia nhỏ hơn (Viet / dấu / hình học đồ thị / hệ số / trùng phương / bậc2/bậc1).
3. **Max-min có tham số m** (B2D2) — 27 câu: bản cũ **không có**.
4. **Hàm phức tạp/hàm hợp biết f'** (bản cũ có 2 nhóm: 63 câu): PNL **gần như không có dạng riêng** — chỉ lẻ tẻ: `B1D1 P2 C3 d` (f(−x)), `Đ01 P2 C1 d` (f'(3x−1)=0), `Đ01 P2 C4 b,c,d` (g=2x−3f(x), f(sin²x), f(2−3x)), `B2D2 P1 C8` (g(x+f(x))) → ≈4 câu. Đáng chú ý: bản cũ có nhiều hơn hẳn.
5. Kiểu B2D4 (30 câu) có nhóm bản cũ không có: **khoảng cách ngắn nhất (8b)**, **đường đi nhiều vận tốc (8c ≈ T112010606 "quãng đường–thời gian" của bản cũ, nhưng ở đây nhiều)**, **parabol/bậc 3 đặt trong hệ tọa độ (8e)**, **góc/phối cảnh (8f)**, **vật lý tầm xa (8g)**.
6. Bản cũ có "Tiệm cận", "Khảo sát và vẽ đồ thị" riêng — thuộc Bài 3, 4 của PNL (không thuộc phạm vi hồ sơ này).
7. Bản cũ có "T112010609 Tốc độ liên quan giữa hai đại lượng (0 câu)": PNL Bài 1–2 có đúng 1 câu gần giống (`B2D4 C13`, led chạy: khoảng cách giữa hai điểm chuyển động).
8. **Hình thức câu**: PNL dùng khuôn 2025 (P2 đúng/sai 4 ý, P3 trả lời ngắn) — P2 là kiểu "một hàm, 4 mệnh đề" nhiều cấp độ từ NB → VD, và có các ý "đếm số m nguyên", "khi m=… thì…" — bản cũ chỉ phân theo dạng, không có chiều "hình thức".

---

## 5. Bảng từng câu — Đề 01 và Đề 02 (tổng hợp bài) → kiểu câu

Ký hiệu kiểu: số kiểu trong §2 (vd 1a = B1D1 kiểu a; 2c = B1D2 kiểu c; 5b = B2D1 kiểu b…).

### Đề 01 (Bài 1) — 12 P1 + 4 P2 + 6 P3
| Câu | Nội dung (rút gọn) | Kiểu |
|---|---|---|
| P1 C1 | BBT hàm y=f(x) xác định x≠−4 (có hình), khoảng đồng biến | 1c |
| P1 C2 | BBT (có hình), điểm cực đại | 1c |
| P1 C3 | y=∛(x²) có bao nhiêu điểm cực trị | 1b (đạo hàm không tồn tại, **lạ** — xem §6) |
| P1 C4 | s(t)=5+8t−2t², vật cách mốc lớn nhất | 4a (chuyển động, cực trị bậc 2) |
| P1 C5 | y=−x³/3+x²+4 đồng biến khoảng | 1a |
| P1 C6 | y=(2x+8)/(5x−9) nghịch biến | 1a |
| P1 C7 | y=(−x²+11x−1)/(x−11) nghịch biến | 1a |
| P1 C8 | y=2x/(x²+8) nghịch biến | 1a |
| P1 C9 | đồ thị bậc ba (có hình), khoảng đồng biến | 1c |
| P1 C10 | x(t)=2sin(πt/2−π/3), vận tốc tăng/giảm trong (2;3) | 4a (lượng giác; **lạ**: đơn điệu của v=x') |
| P1 C11 | giá trị cực tiểu của y=(2x²−2x+2)/(x−1) | 1b |
| P1 C12 | điểm cực tiểu của bậc 3 | 1b |
| P2 C1 | BBT (có hình): ĐB/NB, f(1)<f(3), nghiệm f'(3x−1)=0 | 1c + ý hàm hợp (**lạ**) |
| P2 C2 | y=(2x+1)/(−x+1), 4 mệnh đề đơn điệu | 1a |
| P2 C3 | bảng xét dấu f' (có hình): cực tiểu, cực đại, ĐB, so sánh f(11)>f(7) | 1c |
| P2 C4 | BBT (có hình): g=2x−3f(x), f(sin²x), f(2−3x) | **hàm hợp từ BBT — lạ** (xem §6) |
| P3 C1 | y=(2x²+26x+18)/(x+13), tính P=−2x1+x2 | 1b |
| P3 C2 | y=(mx−3)/(2x−m) đồng biến từng khoảng xác định, đếm m nguyên | 2c |
| P3 C3 | đồ thị f' (có hình), số khoảng đồng biến | 1e |
| P3 C4 | tua du lịch, giảm a nghìn mỗi khách thêm, doanh thu tăng 1–8 khách | 4c (kinh tế, lập hàm doanh thu từng đoạn; **lạ**) |
| P3 C5 | y=x³/3−(m+1)x²+(m²+2m)x−3 nghịch biến (−1;1) | 2b (y' có nghiệm đẹp m, m+2 ⇒ so sánh nghiệm) |
| P3 C6 | Hubble v(t) (hình công thức), khoảng gia tốc tăng, T=a+b | 4a / 4b (đơn điệu của a(t)=v'; hàm cho sẵn) |
Thống kê Đề 01: 1a×4, 1b×5 (kể cả C3), 1c×4 (kể cả P2 C1/C3), 1e×1, 2b×1, 2c×1, 4a×3, 4c×1, hàm hợp×1 (P2 C4). Đề 01 KHÔNG có: Dạng 3 (cực trị chứa tham số m: Viet, hình học), 1d, 1f–1h.

### Đề 02 (Bài 2) — 12 P1 + 4 P2 + 6 P3
| Câu | Nội dung (rút gọn) | Kiểu |
|---|---|---|
| P1 C1 | y=(4−x²)²+1 max trên [−1;1] | 5d |
| P1 C2 | y=x+4/x max trên [1;3] | 5e |
| P1 C3 | đồ thị f trên [−1;5] (có hình), max+min | 5a |
| P1 C4 | f=x³−3x+2 min trên [−3;3] | 5d |
| P1 C5 | bảng xét dấu f' (có hình), max trên (−1;+∞) | 5c |
| P1 C6 | y=(3sin x+2)/(sin x+1) trên [0;π/2], M²+m² | 5g (đặt t) |
| P1 C7 | v(t)=−3t²+12t+1, thời điểm v max | 7a (≈ chuyển động; hàm bậc 2) |
| P1 C8 | bể cá chiều cao 60 cm, V=96000 cm³, giá mặt bên khác đáy, chi phí min | 7d |
| P1 C9 | y=(x+m)/(x+1): min+max = 16/3 | 6a |
| P1 C10 | y=(x+1)/(x−m²) min trên [−3;−2] = 1/2 | 6a |
| P1 C11 | s(t)=−t³/3+6t², vận tốc max trong 9 s | 7a |
| P1 C12 | y=(x−m²+m)/(x+1) min trên [0;1] = −2 | 6a |
| P2 C1 | đồ thị f' (có hình): cực trị, ĐB, f(1)>f(2)>f(4), max trên [−1;4] | 5c (+1e) |
| P2 C2 | y=(x−m²−2)/(x−m): TXĐ, ĐB khi m=1, max, đếm m | 6a (+2c) — **trùng B2D2 P2 C1** |
| P2 C3 | y=x³−3mx²+3(m²−1)x+2025: cực tiểu, ĐB, min trên (0;+∞), đếm m nguyên có min | 6b/5h **hỗn hợp: cực trị+đơn điệu+min trên khoảng — lạ** |
| P2 C4 | tàu đổ bộ Mặt Trăng h(t) 50 s: độ cao max/min, vận tốc max, độ cao khi v max | 4a/7b (mô hình sẵn, chuyển động; cùng họ `B1D4 P3 C1`) |
| P3 C1 | f=x/2−√(x+1) trên [0;3], S=2M−m | 5f (= `B2D1 P1 C14`) |
| P3 C2 | f=x³+(1+m²)x+1, max trên [0;1] ≤7, đếm m nguyên | 6b (= `B2D2 P3 C2`) |
| P3 C3 | (x+m)/(x+1): tổng max+min trên [1;2] = 8, tìm m nguyên | 6a (= `B2D2 P1 C15`/`P3 C5`) |
| P3 C4 | S=6t²−t³, vận tốc max | 7a |
| P3 C5 | 8 máy in, chi phí vận hành, in 50 000 bản, số máy tối ưu | 7g (kinh tế/vận hành — **lạ**) |
| P3 C6 | bể nước mưa V=8 m³, dài=4/3 rộng, nắp hở hình vuông, chi phí min | 7d (= `B2D3 P3 C6`) |
Thống kê Đề 02: 5d×2, 5e×1, 5a×1, 5c×2, 5f×1, 5g×1, 6a×5, 6b×2, 7a×4, 7d×2, 7g×1 (≈). Đề 02 KHÔNG có: 5b (BBT), 5h thuần khoảng, 7c, 7e, 7f, 6c–6g.

---

## 6. Câu "lạ" không vào kiểu nào / nhập nhằng

1. **Hàm hợp từ BBT/đồ thị** — `Đ01 P2 C4` (g(x)=2x−3f(x); f(sin²x); f(2−3x)), `Đ01 P2 C1 d` (nghiệm f'(3x−1)=0), `B1D1 P2 C3 d` (f(−x)), `B2D2 P1 C8` (g(x+f(x)) với f=10^x+x). Kiểu cũ "hàm phức tạp" của bản đồ cũ — PNL có rất ít, nên không thành kiểu riêng.
2. **Đạo hàm không tồn tại vẫn có cực trị** — `Đ01 P1 C3` (y=∛(x²)), `B1D1 P2 C6` (y=√(x²+1) — thực ra cực tiểu ở x=0 y'=0; đây là hàm có đạo hàm). Chưa thấy kiểu "điểm tới hạn không đạo hàm" ở bài tập khác → lạ, 1–2 câu.
3. **Đơn điệu của hàm đạo hàm (vận tốc, gia tốc) trong chuyển động lượng giác** — `Đ01 P1 C10`.
4. **Lập hàm theo từng đoạn (kinh tế có điều kiện)** — `Đ01 P3 C4` (tua du lịch giảm a nghìn mỗi khách thêm; điều kiện "1–8 khách doanh thu tăng").
5. **Đặc biệt trong B1D2**: `P3 C3` (cắt trục hoành tại 3 điểm, 2 điểm hoành độ >1), `P3 C4` (hai tham số m,n; min của P=4(m²+n²)−2m−2n), `P3 C5` (nghịch biến trên khoảng có độ dài =3), `P1 C8` (sin/cos − mx), `P1 C25` (x³+mx−1/(5x⁵)), `P1 C37` (x+1/(x²+x+m) — file có chèn lời giải).
6. **B2D1** `P3 C1` (min f(b)−f(a) với a<b nguyên) — duy nhất; `P2 C8` (đồ thị nhiệt độ trong ngày) — đọc hình thực tế nhưng mang bản chất 5a.
7. **B2D2 `P2 C3`** (mx+36/(x+1), phân loại theo m ba khoảng) và `P1 C11`/`P3 C3` (có bình phương/trị tuyệt đối).
8. **B2D4** các câu hình học tọa độ (C17, C21, C23, C25, C28), câu góc nhìn/đèn pin (C22, C27, C29) — xếp tạm vào 8b/8e/8f nhưng thực ra mỗi câu là một "bài riêng".
9. **Đề 02 P2 C3** (một câu gom: cực trị + đơn điệu + min trên (0;+∞) + đếm m) — đúng kiểu P2 "một hàm tham số nhiều ý": trong kiểu cũ của tôi nó thuộc ít nhất 3 kiểu (3a, 2a, 5h).
10. **Lỗi biên soạn/trùng lặp đáng lưu ý (ảnh hưởng đếm câu):** B1D1 `P1 C8` ≡ `C17` (cùng hình image337); B1D3 `P1 C13` ≡ `C22`; B1D3 `P1 C20` ≡ `P3 C2` ≡ `P3 C8` (cùng hàm (2/3)x³−mx²−2(3m²−1)x+2/3); B2D2 `P1 C3` ≡ `C6` (x³−3x+m, max trên (−∞;0)=5); B2D2 `P3 C5` ≡ `P1 C15`; B2D3 `P3 C11` ≡ B2D4 `C24`; B2D3 `P3 C6` ≡ Đ02 `P3 C6`; Đ02 `P3 C1`≡B2D1 `P1 C14`; Đ02 `P3 C2`≡B2D2 `P3 C2`; Đ02 `P2 C2`≡B2D2 `P2 C1`; Đ02 `P2 C1`≡B2D1 `P2 C7`. Khi nhập kho cần khử trùng (số câu hiệu dụng ít hơn số "đếm" ở §1).

## 7. Điều chưa chắc / không đọc được
- Hình (BBT, đồ thị) không xem được: các câu loại 1c/1e/5a/5b/5c phân loại theo lời dẫn; đáp án/nội dung hình là "(có hình)".
- Vài công thức dạng `[[img:*.wmf]]` (B1D2 P1 C5, C9; B2D1 P1 C7) không đọc được nội dung; phân loại theo lời dẫn ("nghịch biến trên từng khoảng xác định"; "nghịch biến trên [hình]" tôi coi như ℝ cho C9 — chưa chắc).
- "Mức" (NB/TH/VD/VDC) là ước lượng của tôi — tác giả không gắn nhãn mức độ trong các file đã đọc.
- B2D4: nhiều đề bị cắt trong text (bị `...`), chỉ đọc phần đầu mỗi câu; phân loại dựa trên phần đầu + hình đi kèm.
- Số "ý" TL (≈47 ý Bài 1, ≈27 ý Bài 2) đếm tay theo các chữ a–m trong từng bài tập tự luận; số bài (Bài tập N) đếm bằng script.
