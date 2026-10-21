# HỒ SƠ NGUỒN — PNL (Toán 12 – PNL 2026), Chương 1 Hàm số: Bài 3 (Tiệm cận), Bài 4 (Khảo sát), Bài 5 (UDĐH giải bài thực tế)

Đọc: các file `_GV` trong `SP\txt\pnl\BAI 3.*`, `BAI 4.*`, `BAI 5.*` (file "Đề khảo sát chất lượng chương hàm số_GV" nằm TRONG thư mục BAI 5; ngoài thư mục bài không có file nào). Bỏ `_HS`.
Quy ước viết tắt: `B3-D2` = `Bài 03_Dạng 02…_GV.txt`; `Đ3/Đ4/Đ5` = `Đề 03/04/05_…_GV.txt`; `ĐKS` = `Đề khảo sát chất lượng chương hàm số_GV.txt`. Trích câu: `TL-n` = Bài tập tự luận số n; `I-n`/`II-n`/`III-n` = Phần I (nhiều lựa chọn) / II (đúng-sai, mỗi câu 4 ý) / III (trả lời ngắn), Câu n.
Cách đếm: tổng số câu từng file = ĐẾM bằng script (đếm dòng bắt đầu "Câu n:"/"Bài tập n" theo phần). Số câu theo KIỂU = tôi đọc đề từng câu và phân loại tay ("đếm tay", tổng đã đối chiếu khớp tổng file; ranh giới giữa 2 kiểu gần nhau có thể lệch ±1–2). Hình (BBT/đồ thị) không xem được — chỉ suy từ lời dẫn.

---
## 0. Số câu đếm được

| File | TL (bài tập) | Phần I | Phần II | Phần III | Tổng |
|---|---|---|---|---|---|
| B3-D1 TCĐ&TCN | 3 | 30 | 4 | 10 | 47 |
| B3-D2 TCĐ&TCX | 2 | 11 | 6 | 5 | 24 |
| B3-D3 tiệm cận có tham số | 2 | 13 | 4 | 8 | 27 |
| B3-D4 hình học & thực tế | 4 | 15 | 13 | 14 | 46 |
| Đ3 | – | 12 | 4 | 6 | 22 |
| B4-D1 bậc ba | 1 (4 ý) | 24 | 5 | 8 | 38 |
| B4-D2 bậc1/bậc1 | 3 | 24 | 4 | 12 | 43 |
| B4-D3 bậc2/bậc1 | 2 | 8 | 10 | 10 | 30 |
| B4-D4 thực tế | 6 | 8 | 6 | 22 | 42 |
| Đ4 | – | 12 | 4 | 6 | 22 |
| B5-D1 tốc độ thay đổi | 5 | 16 | 8 | 17 | 46 |
| B5-D2 tối ưu đơn giản | 6 | 12 | 4 | 11 | 33 |
| B5-D3 tăng trưởng | 24 câu (không chia phần; toàn tự luận/đáp số) | | | | 24 |
| B5-D4 kinh tế–sản xuất | 52 câu (không chia phần) | | | | 52 |
| B5-D5 tốc độ các đại lượng | 15 câu (không chia phần) | | | | 15 |
| Đ5 | – | 12 | 4 | 6 | 22 |
| ĐKS | – | 12 | 4 | 6 | 22 |
| **Tổng ba bài (không tính Đề)** | | | | | **B3 = 144, B4 = 153, B5 = 170** |
(B3: 47+24+27+46; B4: 38+43+30+42; B5: 46+33+24+52+15. Cộng 5 Đề/ĐKS = 110 câu. Cộng tất cả = 577.)

Lưu ý chất lượng nguồn: có nhiều câu TRÙNG LẶP trong cùng chương — bể muối 5000 lít/30 g/lít/25 lít/phút xuất hiện ≥4 lần ở B3-D4 (TL-4, I-2, II-7, II-12); dân số "f(t)=(26t+10)/(t+5)" xuất hiện ≥8 lần (B3-D4 I-6, II-9, II-13; B4-D4 TL-2; B5-D1 II-1; B5-D3 C6, C10); B3-D3 I-5≡III-5, I-7≡III-7; B3-D4 II-2≡B3-D1 II-2; B5-D4 C1≡C11; ba câu "đơn đặt hàng bóng rổ/tennis/pickleball – số máy" lặp (B5-D1 III-17, B5-D4 C17/C30/C50, B4-D4 III-5). Một số lỗi đề/đánh số (B3-D1 TL-2 ghi "xác định tiệm cận ngang" nhưng giải TCĐ; B4-D4 III nhảy từ C20 sang C22; B4-D3 II-8,II-10 có hai ý "c)"). Các số thập phân trong text bị mất dấu phẩy (vd "0013" = 0,013) — chỉ ảnh hưởng đọc đề, không ảnh hưởng phân loại.

---
## 1. CẤU TRÚC NGUYÊN VĂN (tên Dạng lấy từ tên file / tiêu đề trong file)

### Bài 03 — ĐƯỜNG TIỆM CẬN CỦA ĐỒ THỊ HÀM SỐ
- Dạng 01. Lý thuyết và bài toán tìm tiệm cận đứng và tiệm cận ngang của ĐTHS (tiêu đề trong file: "Dạng 1: Bài toán tìm tiệm cận đứng và tiệm cận ngang của đồ thị hàm số")
- Dạng 02. Bài toán tìm tiệm cận đứng và tiệm xiên của ĐTHS (tiêu đề: "Dạng 2: Bài toán tìm tiệm cận đứng và tiệm cận xiên của đồ thị hàm số")
- Dạng 03. Bài toán về đường tiệm cận của ĐTHS có chứa tham số
- Dạng 04. Bài toán đường tiệm cận liên quan đến hình học và thực tế
- Đề 03 — Đường tiệm cận của đồ thị hàm số

### Bài 04 — KHẢO SÁT SỰ BIẾN THIÊN VÀ VẼ ĐỒ THỊ HÀM SỐ
- Dạng 01. Lý thuyết và toán khảo sát sự biến thiên và vẽ ĐTHS bậc ba
- Dạng 02. Khảo sát và vẽ đồ thị hàm số phân thức hữu tỉ bậc nhất trên bậc nhất
- Dạng 03. Khảo sát và vẽ đồ thị hàm số phân thức hữu tỉ bậc hai trên bậc nhất
- Dạng 04. Ứng dụng khảo sát hàm số vào bài toán thực tế
- Đề 04 — Khảo sát sự biến thiên và vẽ đồ thị hàm số

### Bài 05 — ỨNG DỤNG ĐẠO HÀM GIẢI BÀI TOÁN THỰC TIỄN (thư mục: "UDDH GIAI BAI THUC TE")
- Dạng 01. Lý thuyết và ứng dụng đạo hàm để giải bài toán tốc độ thay đổi của một đại lượng
- Dạng 02. Một số bài toán tối ưu đơn giản
- Dạng 03. Bài toán thực tế tăng trường [sic] (tiêu đề trong file: "Bài toán thực tế tăng trưởng")
- Dạng 04. Bài toán kinh tế và tối ưu hóa trong sản xuất
- Dạng 05. Bài toán tốc độ thay đổi của các đại lượng
- Đề 05 — Ứng dụng đạo hàm để giải quyết một số bài toán thực tiễn
- Đề khảo sát chất lượng chương hàm số (đề tổng hợp cả chương: đơn điệu, cực trị, GTLN-NN, tiệm cận, khảo sát, thực tế)

Cách tổ chức mỗi file Dạng: Lý thuyết/Phương pháp ngắn → BÀI TẬP TỰ LUẬN (có lời giải đầy đủ) → TRẮC NGHIỆM theo 3 phần I/II/III (khuôn đề tốt nghiệp 2025). Riêng B5-D3, D4, D5 chỉ là một danh sách "Câu 1…n" phẳng (dạng đáp số).

---
## 2. CÁC KIỂU CÂU THẬT SỰ CÓ (theo Dạng của tác giả)

Mức độ: NB = nhận biết; TH = thông hiểu; VD = vận dụng; VDC = vận dụng cao (tôi gán theo độ dài lời giải/số bước, không phải nhãn của tác giả).

### BÀI 3 — TIỆM CẬN

#### B3-D1 (47 câu): TCĐ & TCN
| Mã | Kiểu | Dấu hiệu nhận biết | Cách giải 1 dòng | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 3.1.a | Tìm TCN/TCĐ của một hàm cụ thể (phân thức đơn giản, một đường) | "Tiệm cận ngang/đứng của đồ thị hàm số y=… là" | TCN: lim ±∞ hữu hạn (so bậc); TCĐ: nghiệm mẫu không là nghiệm tử | 10 (I-1,2,3,4,5,6,7,27 + TL-1, TL-2) | I-1 "y=(x-2)/(x²-4) có TCN" ; I-3 "đồ thị hàm số nào có TCN" | NB |
| 3.1.b | Đọc/đếm tiệm cận từ BBT hoặc đồ thị (có hình) | "Cho hàm số có bảng biến thiên… số TCĐ/TCN / tổng số tiệm cận / mệnh đề đúng" | Đọc lim ở ±∞ và ở điểm gián đoạn từ BBT | 9 (I-8..13, II-1, II-4, III-5) | I-10 "tổng số TCN và TCĐ" (có hình) ; II-4 gồm cả ý hàm hợp "đồ thị y=1/(f(x)+2) có hai TCĐ" | NB–TH (ý hàm hợp VD) |
| 3.1.c | Đếm tổng TCĐ+TCN của phân thức hữu tỉ (phải loại nghiệm trùng tử/mẫu) | "Tổng số đường tiệm cận đứng và tiệm cận ngang của y=(…)/(…)" | Phân tích nhân tử, rút gọn; so bậc tử–mẫu cho TCN | 12 (I-14,15,16,21,22,23,25,26; II-3; III-3; TL-3; +B3-D2 III-1) | I-15 "(x²-3x+2)/(x²-1)" ; III-3 "(x³-9x)/(x³-x²-5x-3)" | TH |
| 3.1.d | Đếm riêng TCĐ của phân thức (có nghiệm bội/trùng tử) | "có bao nhiêu đường tiệm cận đứng" | Nghiệm mẫu trừ nghiệm tử | 4 (I-18,19,28,29) | I-19 "(x²-1)/(3-2x-5x²)" | TH |
| 3.1.e | Tiệm cận hàm chứa căn / trị tuyệt đối | √ hoặc \|x\| trên tử/mẫu; đếm TC | Tìm TXĐ trước (căn làm mất/thêm TCĐ, TCN hai phía khác nhau) | 4 (I-17,20,24,30) | I-24 "(√(x+9)-3)/(x²+x)" ; I-20 có "x²-\|x\|-2" | TH–VD |
| 3.1.f | Bậc1/bậc1: tìm tiệm cận để tính biểu thức/diện tích/giao điểm | "giao điểm I(a;b) của hai tiệm cận", "hình chữ nhật tạo bởi hai tiệm cận và trục toạ độ" | TCĐ x=-d/c, TCN y=a/c | 3 (II-2, III-2, III-4) | III-4 "diện tích hình chữ nhật … y=(2x+1)/(x+3)" | TH |
| 3.1.g | Tìm hệ số a,b từ tiệm cận/BBT cho trước (hàm bậc1/bậc1, bậc2/bậc2) | "biết đồ thị có TCĐ x=2 và TCN y=3. Tính a-2b" | Đồng nhất a/c, -d/c; hàm bậc 2/2: lim = tỉ số hệ số bậc cao | 3 (III-1, III-9, III-10) | III-1 "y=(ax+1)/(bx-2)" ; III-10 "y=(ax²+x-1)/(4x²+bx+9), a.b=4" | VD |
| 3.1.h | Khoảng cách từ điểm M∈(C) đến hai tiệm cận (tích, tổng min, số điểm M) | "tích/tổng khoảng cách từ M bất kì thuộc (C) đến hai tiệm cận" | Đặt M(x₀; ax₀+b/…), tích = hằng; tổng min dùng AM-GM/khảo sát | 3 (III-6,7,8) | III-6 (tích = hằng), III-7 (tổng min) | VD |
| **Σ** | | | | **48** (47 + 1 câu mượn từ B3-D2) | | |

Tự luận B3-D1: 3 bài (TCN, TCĐ, "TCĐ+TCN" cho 8 hàm) — nằm trong 3.1.a/3.1.c.

#### B3-D2 (24 câu): TCĐ & TCX
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 3.2.a | Tìm phương trình TCX của hàm cụ thể | "tiệm cận xiên của đồ thị hàm số y=… là" | Chia đa thức: y=a'x+b'+e/(mx+n) (hoặc a=lim f/x, b=lim(f-ax)) | 12 (I-1,2,5,6,7,8,9,10; TL-1, TL-2; III-2; II-6) | I-6 "f(x)=2x-1-1/(x+1)" (đã tách sẵn) ; I-8 "(x²+3x)/(x-2)" ; II-6 có hình + lim f/x, lim(f-x) | NB–TH |
| 3.2.b | TCX gắn hình học: diện tích tam giác OAB, giao điểm TCĐ–TCX, vuông góc/song song, điểm thuộc TCX | "tiệm cận xiên cắt hai trục tại A,B; diện tích OAB", "giao điểm hai tiệm cận nằm trên parabol…" | Tìm TCX/TCĐ rồi dùng toạ độ | 8 (I-3,4,11; II-1,2,3,5; II-4) | II-1 (4 ý: không TCN / S=1 / giao điểm ∈ y=x² / vuông góc) ; II-4 là hàm căn √(4x²+8x-12): HAI TCX | TH–VD |
| 3.2.c | TCX + tham số m (diện tích tam giác = k; góc giữa hai tiệm cận; cực trị…) | "tìm m sao cho TCX tạo với hai trục tam giác diện tích 4" ; "góc giữa hai TC = 45°" | TCX theo m rồi giải phương trình | 3 (III-3,4,5) | III-3 ; III-5 "góc giữa hai đường tiệm cận" | VD–VDC |
| 3.2.d | (lẻ) Đếm TCĐ+TCN | – | – | 1 (III-1) | "(x²+2x+3)/(x²-4)" | TH |
| **Σ** | | | | **24** | | |

#### B3-D3 (27 câu): Tiệm cận có THAM SỐ
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 3.3.a | Điều kiện để có / không có / có đúng k đường tiệm cận | "tìm m để đồ thị có hai TCĐ / đúng hai tiệm cận / đúng một TCĐ / không có TCĐ" ; đếm m nguyên | Điều kiện nghiệm mẫu (Δ) + loại nghiệm trùng tử; TCN luôn có khi bậc tử ≤ bậc mẫu | 16 (TL-1, TL-2; I-2,3,4,6,7,8,9,11; II-3; III-1,2,6,7,8) | I-4 "(x-1)/(x²+4x-m-3) hai TCĐ, m nguyên ∈[-10;10]" ; III-8 "bộ (a;b) nguyên để có đúng hai tiệm cận" ; I-6 có căn √(x+1) | VD (một số VDC) |
| 3.3.b | Tiệm cận cho trước ⇒ tìm tham số (TCĐ x=5, TCN y=1, TCĐ đi qua điểm, nhận trục Ox,Oy làm tiệm cận) | "có TCĐ là x=5", "TCN đi qua A(1;-3)", "nhận trục hoành và trục tung làm hai tiệm cận" | Đồng nhất tiệm cận với giá trị cho trước | 5 (I-1, I-5, II-1, III-3, III-5) | I-5/III-5 "(2m-n)x²+mx+1 / (x²+mx+n-6) nhận Ox, Oy là tiệm cận" | TH–VD |
| 3.3.c | Tham số + hình học tiệm cận (hình chữ nhật/tam giác với trục, tiếp tuyến, góc, tâm đối xứng, qua điểm) | "tiệm cận cùng hai trục tạo hình chữ nhật diện tích 8", "tiệm cận xiên tạo với hai trục tam giác", "góc 45°" | Tiệm cận theo m + công thức diện tích/góc | 6 (I-10,12,13; II-2,4; III-4) | I-13 "x-1/(x-m) hcn S=5, tổng các m" ; II-4 "(mx²+(3m²-2)x-2)/(x+3m)" | VD–VDC |
| **Σ** | | | | **27** | | |

(Lưu ý: kiểu 3.3.a có 3 biến thể cấu trúc: mẫu bậc 2 theo m; TỬ có m (mx²-1…) ⇒ phải xét m=0 và nghiệm tử trùng nghiệm mẫu; mẫu bậc 3 / hai tham số.)

#### B3-D4 (46 câu): Hình học & thực tế
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 3.4.a | Hình học tiệm cận thuần (khoảng cách, tổng/min khoảng cách, hình chữ nhật/tam giác/hình thang với trục, giao điểm tiệm cận, tâm đối xứng, m để diện tích = …) | "khoảng cách từ M đến tiệm cận", "hai tiệm cận cùng hai trục tạo hình thang vuông", "d₁+d₂ nhỏ nhất" | Tìm tiệm cận rồi dùng công thức khoảng cách/diện tích; min bằng AM-GM | 10 (TL-1, TL-2; I-15; II-1,2,3,4; III-1,3,5) | II-4 "d₁+d₂ min = 4√2" ; III-1 hình thang vuông ; TL-1 "m để hcn có diện tích 2024" | TH–VD |
| 3.4.b | Mô hình thực tế cho SẴN công thức phân thức → tìm TCN/TCĐ và ĐỌC Ý NGHĨA lim (giá trị bão hoà/giới hạn dài hạn/không vượt quá) | "nồng độ… không vượt quá…", "khi t đủ lớn tiến gần…", "dân số không thể vượt quá 26 nghìn" | lim t→+∞ ⇒ TCN = giá trị giới hạn; điểm làm mẫu=0 ⇒ TCĐ = giá trị không đạt được (100% ô nhiễm) | 24 (TL-4; I-1..14; II-5..13) | I-1 oxygen y=5-15t/(9t²+1); I-8 chi phí C(x)=300x/(100-x) (TCĐ x=100: không thể loại 100%) ; II-9 dân số ; I-12 Newton F=G m₁m₂/r²; I-13 hệ số Lorentz γ(v) (TCĐ v=c) | NB–TH |
| 3.4.c | Tự lập hàm từ tình huống rồi tìm tiệm cận (bể pha muối, chi phí trung bình, chu vi, hộp) | "lượng muối/thể tích → nồng độ f(t)=30t/(200+t)", "chi phí trung bình C̄(x)=C(x)/x", "chu vi P(x) của vườn diện tích không đổi" | Lập f(t)=tử/mẫu theo t rồi lim; C̄(x)=C(x)/x có TCX khi C bậc 2 | 10 (TL-3; III-2,6,7,8,9,11,12,13,14) | III-8 "bể 1000 lít, nồng độ 15 g/l, 20 lít/phút" ; III-7 "C(x)=0.001x²+3x+1000, chi phí trung bình ⇒ TCX" | VD |
| 3.4.d | Tham số m: số TCĐ của hàm căn √(4x-x²)… | "tập S các m để (Cₘ) có đúng hai TCĐ" | Điều kiện nghiệm mẫu trong miền xác định | 1 (III-4) | "(12+√(4x-x²))/√(x²-6x+2m)" | VDC |
| 3.4.e | Cônic có tiệm cận xiên (ống khói hypebol) | "mặt cắt là hypebol x²/27²-y²/40²=1" | a=lim f/x, b=lim(f-ax) trên nhánh | 1 (III-10) | III-10 | VD |
| **Σ** | | | | **46** | | |

Bài toán thực tế ở B3-D4 THỰC CHẤT thuộc 2 loại mô hình: (i) hàm phân thức bậc nhất/bậc nhất hoặc bậc 2/bậc 1 mô tả đại lượng "bão hoà" (nồng độ, dân số, sản lượng) ⇒ chỉ cần TCN; (ii) chi phí trung bình / chu vi (bậc 2 / bậc 1) ⇒ cần TCX. Không có bài tối ưu ở đây — thuần giới hạn.

#### Đ3 (22 câu) — xem §5.

---
### BÀI 4 — KHẢO SÁT HÀM SỐ

#### B4-D1 (38 câu): Bậc ba
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 4.1.a | Khảo sát & vẽ đồ thị bậc 3 (tự luận 3 bước) | "Khảo sát sự biến thiên và vẽ đồ thị: y=x³-3x²+1…" | TXĐ → y' → lim → BBT → điểm đặc biệt (4 ý phủ 4 trường hợp: a>0 / a<0 / y'≥0 / y' có nghiệm kép) | 1 bài (4 ý) | TL-1 a–d | TH |
| 4.1.b | Đọc ĐỒ THỊ/BBT bậc ba ⇒ dấu hệ số a,b,c,d | "đồ thị y=ax³+bx²+cx+d như hình. Mệnh đề nào đúng / có bao nhiêu hệ số âm / số lớn nhất trong a,b,c,d" | a từ hướng; d từ giao Oy; b,c từ y'=0 (tổng/tích hai nghiệm cực trị) | 14 (I-1,4,6,7,8,9,10,11,14,15,16,18 ; I-13, I-17) | I-13 "trong a,b,c,d có bao nhiêu số âm" | TH–VD |
| 4.1.c | Đọc đồ thị/BBT ⇒ giá trị cụ thể (hệ số, f(x₀), cực trị, GTLN, hệ thức) – dạng đúng/sai | "đồ thị như hình. a) cực tiểu tại x=1 b) cắt Oy tại (0;1) … d) 2a+3b+c=9" | Tìm a,b,c,d từ điểm đặc biệt + cực trị | 4 (II-1,2,3,4) | II-1 ; II-3 BBT | TH–VD |
| 4.1.d | Chọn hàm số/đồ thị ứng với BBT hoặc đồ thị | "Bảng biến thiên ở hình bên là của hàm số nào", "đường cong trong hình là đồ thị của hàm nào" | Loại trừ theo a, điểm đi qua, cực trị | 4 (I-2,3,5,12) | I-2 ; I-12 (BBT→đồ thị) | NB–TH |
| 4.1.e | Tính chất đồ thị bậc 3 có tham số m (số cực trị, tâm đối xứng, đường thẳng qua hai cực trị) | "y=x³-3m²x+2024: luôn có hai cực trị / tâm đối xứng cố định / S=a+b" | y'=0, uốn, chia y cho y' | 1 (II-5) | II-5 | VD |
| 4.1.f | TƯƠNG GIAO đồ thị bậc 3 với đường thẳng/trục Ox: số nghiệm theo m | "cắt đường thẳng y=… tại ba điểm phân biệt", "pt x³-3x²-m²+5m=0 có ba nghiệm" | Lập pt hoành độ; bài tách m: lập BBT hàm vế trái; hoặc Viète | 14 (I-19..24; III-1..8) | III-4 "pt x³-3x²-m²+5m=0 có 3 nghiệm, m nguyên" ; III-3 "đồ thị và y=m có nhiều nhất mấy giao điểm" | VD |
|  | – biến thể f1: đếm số m nguyên (3 nghiệm phân biệt) | | | ~3 (III-1,2,4) | | VD |
|  | – biến thể f2: ràng buộc hoành độ (x₁+x₂=2x₃, x₁²+x₂²+x₃²≥…, cấp số cộng…) bằng Viète | | | ~6 (I-19,20,22,23,24; III-7) | I-19 | VDC |
|  | – biến thể f3: HÌNH HỌC trên 3 giao điểm A,B,C (trung điểm, tam giác, hình chiếu B′C′, tam giác ABK…) | | | ~5 (I-21; III-5,6,8 …) | III-6, III-8 | VDC |
| **Σ** | | | | **38** | | |

#### B4-D2 (43 câu): Bậc1/bậc1
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 4.2.a | Khảo sát & vẽ (4 ý: c>0,ad-bc>0 / <0 …) | TL-1 | – | 1 bài (4 ý) | TL-1 | TH |
| 4.2.b | Khảo sát bài toán thực tế mô hình bậc1/bậc1 (trộn dung dịch KOH; điện trở song song) | "nồng độ KOH sau khi trộn x ml", "R=R₁R₂/(R₁+R₂) với R₁=8" | Lập C(x)=(tử)/(mẫu) rồi khảo sát; giải thích giới hạn | 2 (TL-2, TL-3) | TL-2 | TH–VD |
| 4.2.c | Chọn hàm ứng với BBT/đồ thị | "hàm số nào có BBT như hình / đồ thị dạng như hình" | Loại trừ bằng TCĐ, TCN, dấu y′ | 8 (I-1,3,5,7,13,14,16,18) | I-1 | NB–TH |
| 4.2.d | Đọc đồ thị/BBT y=(ax+b)/(cx+d) ⇒ dấu hoặc giá trị a,b,c,d (T=a-3b-2c, a+2b+3c, ab, đếm số dương) | "đồ thị như hình. Tìm khẳng định đúng / giá trị biểu thức" | TCĐ, TCN, giao Ox/Oy | 19 (I-2,4,6,8,9,10,11,12,15,17,19,20,21,22,23,24 ; II-1,2,3) | I-9 "T=a-3b-2c=-3" (có lời giải trong file) ; I-19/20/23 là BBT với ẩn trong (ax+1)/(bx+c) ; II-3 cho đồ thị của f′ | TH–VD |
| 4.2.e | Tham số m: tính chất hàm (TCN, giao điểm tiệm cận, TCĐ qua điểm, đồng biến) | "y=(mx-1)/(2x+m)" | – | 1 (II-4) | II-4 | TH |
| 4.2.f | TƯƠNG GIAO đường thẳng với đồ thị 1/1: đúng hai điểm phân biệt, hoành độ dương, AB=…, trung điểm, đúng một điểm chung | "đường thẳng d:y=x+m cắt (C) tại hai điểm A,B sao cho AB=4" | pt bậc 2 hoành độ; Δ>0 và điều kiện loại nghiệm mẫu; Viète | 9 (III-2,3,4,5,7,8,10,11,12) | III-4, III-11 "AB=4"; III-8≡III-2 | VD–VDC |
| 4.2.g | (lẻ) Hệ số/đồ thị có tham số: cắt Oy ở tung độ -4; đồ thị của bậc2/bậc1 cắt y=m; tồn tại duy nhất đường thẳng… | – | – | 3 (III-1, III-6, III-9) | III-6 (hàm bậc2/bậc1 lọt vào đây) | VD |
| **Σ** | | | | **43** | | |

#### B4-D3 (30 câu): Bậc2/bậc1
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 4.3.a | Khảo sát & vẽ (4 ý) + tham số m (khảo sát với m=1; m để hai cực trị cách đều đường thẳng) | TL-1, TL-2 | y=a'x+b'+e/(mx+n); y′=0 ⇒ hai cực trị | 2 bài | TL-2b | TH–VD |
| 4.3.b | Chọn hàm ứng với BBT (4) hoặc đồ thị (4) | "BBT sau là của một trong bốn hàm số sau" | Tiệm cận xiên + cực trị | 8 (I-1..8) | I-1 | NB–TH |
| 4.3.c | Tính chất đồ thị hàm cụ thể – đúng/sai (TXĐ, TCX, TCĐ, tâm đối xứng, cực trị, giao Ox, tiếp tuyến tại giao Oy, GTNN trên đoạn, 4 nghiệm \|…\|) | "Cho y=(x²+4x+5)/(x+2): a) TXĐ b) TCX … d) tâm đối xứng I(-2;0)" | tính y′, cực trị, tâm đối xứng = giao hai tiệm cận | 7 (II-1,2,3,4,5,7,10) | II-4 "hai điểm cực trị nằm 2 phía Oy / không cắt Ox" | TH–VD |
| 4.3.d | Tính chất có tham số m (TCX khi m=1, góc hai tiệm cận 45°, cực đại cực tiểu thì m>4, tiếp tuyến song song, điểm M gần tâm đối xứng nhất) | "(Cₘ)…khi m<-1 hàm đạt CĐ, CT trong miền x>0" | – | 3 (II-6,8,9) | II-8 d) "IM ngắn nhất" | VD–VDC |
| 4.3.e | Cặp điểm đối xứng qua tâm; điểm gần/cách đường thẳng nhỏ nhất; điểm nguyên | "bao nhiêu cặp điểm đối xứng qua I", "số điểm có toạ độ nguyên thuộc đồ thị" | Đặt toạ độ, dùng tâm đối xứng/AM-GM/ước số | 3 (III-1,2,10) | III-10 "2x²+3x+10 /(x+2) nguyên" | VD–VDC |
| 4.3.f | Tương giao đường thẳng với đồ thị (trung điểm AB, AB=√6, số m nguyên) | "đường thẳng y=-2x+m cắt tại A,B, trung điểm thuộc Oy" | Viète | 4 (III-3,6,7,8) | III-6, III-7 | VD |
| 4.3.g | Hai cực trị cách đều đường thẳng (m) | "hai điểm cực trị cách đều Δ: 2x+y+1=0" | y′=0, toạ độ hai cực trị | 1 (III-5) | | VD |
| 4.3.h | Đọc đồ thị: hệ số a,b,c,d của y=ax+b+1/(x+c) hoặc (ax²+bx+c)/(mx+n) | "tổng a+b+c", "trong b,c,m,n bao nhiêu số dương" | – | 2 (III-4, III-9) | | VD |
| **Σ** | | | | **30** | | |

#### B4-D4 (42 câu): Ứng dụng khảo sát vào bài toán thực tế
Trong file, các câu thực tế này thực chất thuộc 6 loại mô hình:
| Mã | Mô hình thật sự | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 4.4.a | Chuyển động s(t), h(t) ⇒ v, a, khoảng đơn điệu của h, vận tốc nhỏ nhất (đạo hàm của hàm bậc 3) | "tàu đổ bộ Mặt Trăng h(t)=-0.01t³+…", "vật chuyển động s=t³-6t²+42t+1" | v=s′, a=v′, BBT của v hoặc h | 8 (TL-5; II-1,2,4,5; III-1,3,6) | TL-5 ; II-2 | TH–VD |
| 4.4.b | Kinh tế (hàm cầu, chi phí biên, chi phí trung bình, lợi nhuận max, chi phí máy) | "lợi nhuận P(x)=-0.3x³+…", "chi phí C̄(x)=2x-230+7200/x min", "chi phí biên" | C′(x₀)≈C(x₀+1)-C(x₀); max/min bằng BBT | 12 (I-1,2,3,6,7,8; II-3,6; III-2,5,8,9) | I-2 "chi phí biên chiếc bánh thứ 501" ; II-6 giày | TH–VD |
| 4.4.c | Sinh–hoá–dân số (nồng độ thuốc, tốc độ phản ứng, dân số, tốc độ đánh máy, thang điểm HS) – KHI BIẾT HÀM hoặc CẦN TÌM HÀM từ số liệu | "c(t)=t/(t²+1)", "tìm f(t) ‘gần’ các điểm A(5;38)… (bảng 1)", "f(x)=x³+ax²+bx+c từ 3 dữ kiện tháng" | Max/min hoặc tìm hệ số bằng hệ pt; lim ⇒ TCN | 7 (TL-2, TL-4, TL-6; I-4; III-7, III-16, III-17) | TL-4 (mô hình hoá bảng số liệu bằng hàm hữu tỉ) | VD–VDC |
| 4.4.d | Công trình / địa hình mô hình hoá bằng ĐỒ THỊ BẬC BA (hồ nước, đường cao tốc nối hai sườn đồi, cầu hẻm núi, đảo, lát cắt vùng đất, tàu lượn, cáp treo) | "đồ thị hàm số bậc ba như hình, đơn vị 100 m", "tìm hàm bậc ba từ A,B và góc dốc" | Tìm a,b,c,d từ điểm + cực trị; sau đó cực trị / khoảng cách điểm–đường | 8 (TL-1, TL-3; III-10,14,18,19,20,22) | TL-3 "hàm bậc ba nối hai sườn đồi" ; III-14 "cầu ngắn nhất từ đảo ra đường" | VDC |
| 4.4.e | Đường cong HỮU TỈ bậc2/bậc1 mô tả quỹ đạo (thuyền, hai tàu hai nhánh, máy bay, bờ hồ, cầu trượt) | "(C): y=(x²+x+1)/(x+1) mô tả chuyển động tàu; trạm tại I(-1;-1)", "khoảng cách ngắn nhất giữa hai tàu ở hai nhánh" | Khoảng cách điểm–điểm / điểm–tiệm cận, AM-GM, đối xứng qua tâm | 5 (III-4,11,12,13,23) | III-11 (nhánh trái–phải) | VDC |
| 4.4.f | Tối ưu hình học/chi phí (vườn chu vi P(x) và tiệm cận xiên; chia công viên MN) | – | – | 2 (I-5, III-15) | I-5 | VD |
| **Σ** | | | | **42** | | |

Điểm cần chú ý: B4-D4 gần như KHÔNG có bài "khảo sát để vẽ"; tên Dạng là "Ứng dụng khảo sát hàm số", nhưng nội dung là bài toán thực tế dùng BBT/tìm hệ số hàm bậc ba/bậc 2/1.

#### Đ4 (22 câu) — xem §5.

---
### BÀI 5 — ỨNG DỤNG ĐẠO HÀM GIẢI BÀI TOÁN THỰC TẾ

#### B5-D1 (46 câu): Tốc độ thay đổi của một đại lượng (thực chất là Dạng "tốc độ + cực trị hàm mô hình cho sẵn")
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 5.1.a | Chuyển động s(t): vận tốc/gia tốc tại t, v lớn nhất trong khoảng, h lớn nhất (ném lên), điện lượng→cường độ dòng điện | "chất điểm chuyển động s(t)=…; vận tốc lớn nhất trong 10 giây đầu", "Q(t)=2t²+t ⇒ I(4)" | v=s′, a=v′; v max: xét v′=0 trên khoảng | 10 (TL-1; I-1,3; II-4,5; III-1,2,3,4,16) | I-3 ; III-2 | TH–VD |
| 5.1.b | Ý nghĩa f′ trong sinh/hoá/dân số/dịch tễ: tốc độ tăng dân số, tốc độ truyền bệnh max, tốc độ phản ứng, tốc độ tăng của quần thể nấm, tốc độ bơm nước | "f′(t) biểu thị tốc độ tăng dân số… vào năm 1998 là bao nhiêu", "tốc độ truyền bệnh lớn nhất vào ngày thứ", "Pt=a/(b+e^-0.75t) tìm a,b" | Tính f′(t₀); tốc độ max ⇒ f″=0 | 9 (TL-2,4,5; I-5,7; II-1,2,3; III-5) | II-1 ; I-5 | TH–VD |
| 5.1.c | Chi phí biên (C′(x₀) và so sánh với chi phí đơn vị thứ x₀+1) | "hàm chi phí biên", "C′(200) giải thích ý nghĩa" | C′(x) | 1 (TL-3) | TL-3 | TH |
| 5.1.d | Cực trị của hàm mô hình CHO SẴN (công suất P=12I-0.5I², huyết áp, thủy triều cos, nhiệt độ phòng, vi khuẩn, ho–khí quản, nước 1 kg, quảng cáo N(x), phúc lợi n(t)) | "công suất tối đa", "nhiệt độ thấp nhất", "ở nhiệt độ nào nước có khối lượng riêng lớn nhất" | y′=0, BBT/giá trị biên | 10 (I-2,4,6,9; III-6,7,9,12,13,15) | I-6 "h=3cos(πt/6+π/3)+12 khi nào cao nhất" ; III-12 "V=0.99987-…t³" | TH–VD |
| 5.1.e | Tối ưu GIÁ–CẦU tuyến tính ("cứ tăng/giảm giá a thì giảm/tăng b khách") – cho thuê căn hộ/khách sạn/tour/bưởi/vé xe/cước thuê bao; doanh thu hoặc lợi nhuận max | "nếu cho thuê 2 000 000 thì đủ 50 căn; cứ tăng 100 000 thì bỏ trống 2 căn" | Lập R(x)=(p₀±ax)(q₀∓bx) bậc 2, đỉnh parabol; lợi nhuận: trừ chi phí | 11 (I-10,11,12,13,14,15; II-6,8; III-8,10,14) | I-10, III-10 ; II-8 độc quyền P=400-2Q có thuế | TH–VD |
| 5.1.f | Mật độ cá (thả giảm n con/m² thì mỗi con tăng 0.5 kg) | "ao 50 m², mật độ 20 con/m², giảm 8 con thì tăng 0.5 kg" | f(n)=n(P₀+kΔ) bậc 2 | 2 (I-8, I-16) | I-16 | TH |
| 5.1.g | Lợi nhuận từ C(x) và giá bán cho sẵn | "tổng chi phí x mét vải C(x)=x³-3x²-20x+500, bán 220 nghìn/mét" | L=px-C(x), L′=0 | 1 (II-7) | II-7 | TH |
| 5.1.h | Số máy tối ưu (chi phí thiết lập + giám sát) | "đơn đặt hàng 8000 quả bóng tennis, mỗi máy 30 quả/giờ" | C(n)=chi phí máy+giám sát×thời gian | 1 (III-17) | | VD |
| 5.1.i | Tối ưu năng lượng (cá hồi bơi ngược dòng) | "E(v)=c·v³·t, t=300/(v-6)" | lập hàm 1 biến rồi đạo hàm | 1 (III-11) | | VD |
| **Σ** | | | | **46** | | |

#### B5-D2 (33 câu): Tối ưu đơn giản (HÌNH HỌC/VẬT LÝ)
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 5.2.a | Hộp/bể/lăng trụ/chóp từ tấm vật liệu: thể tích max khi diện tích cho trước, hoặc chi phí min khi thể tích cho trước | "55 m² kính làm bể cá không nắp dài gấp đôi rộng", "bể trụ chi phí đáy/nắp/bên", "tấm kẽm gập lăng trụ khuyết hai đáy", "cắt 4 góc tấm bìa" | Biểu diễn V hoặc S qua 1 biến, max/min | 10 (TL-3; I-2,5,7,9,10; II-2,3; III-3,4) | II-2 (chóp tứ giác từ bìa, 4 ý) ; III-4 tấm bìa 900 cm² | TH–VD |
| 5.2.b | Cắt dây thành hai phần (vuông+tròn / vuông+tam giác đều): tổng diện tích max/min | "sợi dây 60 cm cắt hai đoạn: uốn hình vuông và vòng tròn" | S(x) bậc 2 | 4 (TL-5; II-1; III-1,2) | II-1 | TH |
| 5.2.c | Diện tích/chu vi hình phẳng max (khung cửa sổ, hcn nội tiếp nửa đường tròn, hàng rào chữ E, tiết diện xà từ khúc gỗ, rào hình thang cân dọc sông) | – | S(x), x∈D | 8 (TL-1, TL-4, TL-6; I-3, I-6, I-8, I-11; III-5) | TL-6 "khung cửa sổ nửa hình tròn" | TH–VD |
| 5.2.d | Đường đi/thời gian ngắn nhất (qua sông, chèo thuyền, bơi–chạy, trạm bơm cung cấp nước) | "bờ sông rộng 3 km, chèo thuyền v₁ rồi đi bộ v₂ ⇒ T(x)=√(x²+9)/3+(8-x)/8" | Lập T(x), min | 3 (TL-2; I-4; II-4) | II-4 | VD |
| 5.2.e | Cực trị khoảng cách giữa hai vật chuyển động (hai xe vuông góc, máy bay–xe) | "12 giờ 7 phút… anh Hùng A→C, anh Quang B", "xe 40 km/h hướng Đông và máy bay 100 km/h hướng Bắc" | d²(t) bậc 2 | 2 (III-7, III-8) | | VD–VDC |
| 5.2.f | Sào/ống dài nhất qua góc hành lang chữ L; gara ô tô (hình học–đạo hàm nâng cao) | "hành lang chữ L, que sào a=24, b=3", "ống thép cứng qua góc" | L(θ)=a/sinθ+b/cosθ min | 3 (I-12, III-6, III-9) | I-12 (TABLE máy tính trong lời giải) | VDC |
| 5.2.g | Góc nhìn max | "màn ảnh cao 14 m đặt cao 18 m so với tầm mắt" | tan(góc) | 1 (I-1) | | VDC |
| 5.2.h | Quỹ đạo vật lí (xe tăng bắn đầu đạn, vận động viên trượt tuyết) | – | – | 2 (III-10, III-11) | | VDC |
| **Σ** | | | | **33** | | |

#### B5-D3 (24 câu): Tăng trưởng (logistic, dịch bệnh, nồng độ bể)
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 5.3.a | Mô hình logistic f=a/(1+b·e^-t): thời điểm/giá trị TỐC ĐỘ lớn nhất | "tuân theo quy luật logistic… f′(t) biểu thị tốc độ bán hàng. Sau bao lâu tốc độ lớn nhất" | f′(t) max ⇒ f″=0 ⇔ t=ln b | 4 (C1,2,15,17) | C2 ; C17 chiều cao cây | VD |
| 5.3.b | Dịch bệnh bậc 3 f=-x³+18x²: tốc độ truyền max; khoảng tốc độ giảm | "số người nhiễm… tốc độ truyền bệnh lớn nhất vào ngày" | f′ là bậc 2 ⇒ đỉnh | 2 (C3, C13) | C13 "n-m" | TH–VD |
| 5.3.c | Năng suất nuôi cá theo mật độ | như 5.1.f | – | 2 (C4, C16) | | TH |
| 5.3.d | Tốc độ liên quan nhẹ: bán kính vệt dầu | "r tăng 2 m/h ⇒ S′ khi r=25" | S=πr², S′=2πr·r′ | 1 (C5) | | TH |
| 5.3.e | Tiệm cận/giới hạn dài hạn trong mô hình hữu tỉ: dân số, nồng độ muối, nồng độ chất khử trùng không vượt ngưỡng p | "tăng theo t nhưng không vượt ngưỡng p gam/lít", "đồ thị có TCN y=a" | lim t→+∞ | 5 (C6,11,14,20,24) | C14 "bể 160 lít, +10 lít & 21 g/phút" | TH |
| 5.3.f | Cực trị hàm mô hình cho sẵn (nồng độ hoá chất, số cá thể theo nhiệt độ, nồng độ thuốc, động năng dao động) | "C(t)=4t/(64+t³) cao nhất", "300·e^(t/5-3t²/100)" | y′=0 | 4 (C8,12,21,22) | C21 | TH–VD |
| 5.3.g | Tìm hàm/hệ số từ dữ kiện rồi tính | "xác định hàm C(x)=(ax+b)/(-x+d) từ đồ thị", "S(t)=(at²+b)/(ct²+d) qua hai mốc 4 tuần, 6 tuần", "cực đại 55740 con" | Giải hệ pt hệ số | 3 (C7, C9, C23) | C23 mô hình hoá tốc độ đánh máy | VD |
| 5.3.h | Giải f′(t)=k hoặc f(t)=k (tốc độ = 0.075 nghìn/năm; huyết áp = 80 mmHg) | – | giải phương trình | 2 (C10, C19) | | TH |
| 5.3.i | Tối ưu năng lượng cá hồi | – | – | 1 (C18) | | VD |
| **Σ** | | | | **24** | | |

#### B5-D4 (52 câu): Kinh tế – tối ưu hoá sản xuất
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 5.4.a | Lợi nhuận max: doanh thu F(x) & chi phí (tổng hoặc bình quân G(x)) cho BẰNG CÔNG THỨC | "sản xuất không quá 500 sản phẩm… doanh thu F(x)=x³-1999x²+…; chi phí bình quân G(x)=x+1000+250000/x" | L=F−x·G (hoặc F−C), L′=0 trong [1;N] | 13 (C1,2,11,12,15,22,24,25,26,34,45,46,52) | C1≡C11 ; C2 có giảm giá 1%/2% theo bậc thang | VD |
| 5.4.b | Lợi nhuận max CÓ THUẾ/phụ thu (thuế/sp, thuế xuất khẩu, tối đa hoá cả thuế nhà nước) | "mức thuế t/sp: thuế thu được cũng đạt max khi lợi nhuận max" | L(x)−t·x rồi tối ưu t | 5 (C3, C18, C20, C38, C40) | C18 độc quyền, thuế phụ thu | VDC |
| 5.4.c | Giá–cầu tuyến tính ("cứ tăng/giảm giá a thì bán thêm/bớt b"): buffet, villa, gạo, cá, rau, điện thoại, máy lọc không khí, vé bóng đá; + tăng ca lao động; + tuần làm việc | "nhà hàng buffet giá 200 ngàn bán 100 suất; cứ giảm 10 ngàn bán thêm 10 suất" | R(x)=(p₀−ax)(q₀+bx), đỉnh; có thể phải trừ chi phí; có thể có phần "rau thừa thu mua giá rẻ" | 13 (C7,13,21,23,28,31,35,39,43,49,51 + C9, C14) | C21≡C31≡C51 (ba lần, đổi số) ; C13/C23 có thêm doanh thu bán phụ phẩm | TH–VD |
| 5.4.d | Giá theo số lượng hành khách trong chuyến xe (giá mỗi người (44−x)²/2, sức chứa 16/29 người) | "doanh thu/chi phí tối thiểu của cả đoàn" | R=x·(giá), biên [x_min;x_max] | 2 (C19, C42) | C42 "ít nhất bao nhiêu nghìn để cả đoàn về khách sạn" | VD |
| 5.4.e | Số máy móc tối ưu (thiết lập + giám sát) | "8000 quả bóng… mỗi máy 30 quả/giờ; chi phí thiết lập mỗi máy…; người giám sát 192 nghìn/giờ" | C(n)=a·n+b·(T/n) | 4 (C17, C27, C30, C50) | C30≡C50 | VD |
| 5.4.f | Lô hàng/tồn kho tối ưu (EOQ) | "nhập 600 điện thoại chia lô; chi phí vận chuyển mỗi lô + lưu kho", "C=19200000/x²+27x/(x+3000)" | chi phí trung bình/ngày hoặc cả năm min | 3 (C29, C36, C41) | C36, C41 | VD |
| 5.4.g | Ý nghĩa đạo hàm trong kinh tế: tốc độ thay đổi doanh thu max (R′ max), tốc độ bán hàng logistic max, tốc độ tăng chi phí theo thời gian (hàm hợp C(x(t))) | "R(t) của McDonald’s: tốc độ thay đổi doanh thu lớn nhất vào năm nào", "x(t)=20t+40, C=√(5x²+60) ⇒ C′(t)" | f″=0; (C∘x)′=C′·x′ | 3 (C10, C44, C48) | C48 | VD |
| 5.4.h | Chi phí trung bình dài hạn tiệm cận đường thẳng y=ax+b | "chi phí xuất bản C(x)=x²-2000x+10⁸ + phát hành; M(x) tiệm cận y=ax+b" | chia đa thức (kiểu B3-D2) | 1 (C16) | | VD |
| 5.4.i | Lẻ: lợi nhuận hai mặt hàng + ràng buộc vốn (hàm hai biến Cobb–Douglas) ; phân bổ thời gian làm bài thi ; vi mạch hình chữ nhật ; phân chia vốn đầu tư (tỉ lệ lợi nhuận/vốn) ; ít nhất bao nhiêu phần ăn/ngày để lãi ≥135 triệu ; phạt công nhân vi phạm ; taxi hàm giá cước theo đoạn (giải ngược) ; hàm chi phí qua đồ thị bậc2/bậc1 | – | mỗi câu một mô hình riêng | 8 (C4,5,6,8,32,33,37,47) | C6 "21 câu vận dụng, 40 phút"; C47 hàm phân khúc | VDC |
| **Σ** | | | | **52** | | |

#### B5-D5 (15 câu): Tốc độ liên quan (related rates) — HOÀN TOÀN LÀ KIỂU MỚI
| Mã | Kiểu | Dấu hiệu | Cách giải | Số câu | Ví dụ | Mức |
|---|---|---|---|---|---|---|
| 5.5.a | Khoảng cách thay đổi (máy bay–ra đa; trạm radar) | "máy bay ở độ cao 10 km, khi cách ra đa 16 km thì khoảng cách thay đổi 546 km/h. Tìm vận tốc máy bay" | Pythagoras theo t, đạo hàm hai vế | 2 (C1, C4) | C1 | VD–VDC |
| 5.5.b | Thang/thanh trượt (tường–sàn), tam giác vuông trượt, hai thanh bản lề | "thang dài 9 m, đầu dưới ra xa 2 m/s; khi đầu trên cao 3 m thì tốc độ", "thanh AB=4 m", "lăng trụ tam giác vuông ABC trượt", "hai thanh gắn bản lề" | x²+y²=L² ⇒ x·x′+y·y′=0 | 4 (C2, C13, C11, C15) | C2, C13 | VD |
| 5.5.c | Dây qua ròng rọc / dây gấp khúc kéo qua tường | "hai thùng nối bằng dây 15 m qua ròng rọc P", "sợi dây kéo qua tường ABCD dài 20 m" | độ dài dây không đổi ⇒ đạo hàm hai vế | 2 (C3, C6) | | VDC |
| 5.5.d | Thể tích nước dâng (chậu chóp cụt đều, chậu bán cầu, bể hình thang cân, bể bơi lăng trụ + rò rỉ) | "bơm nước lưu lượng 0.5 lít/phút; đến phút 10 thì tốc độ dâng mực nước" | V(h) ⇒ V′=V′(h)·h′ ⇒ h′=Q/V′(h) | 5 (C5, C8, C9, C10, C14) | C5 ≡ C14 (đổi số) | VDC |
| 5.5.e | Diện tích thay đổi theo thời gian (vùng tối trên mảnh đất) | "tốc độ giảm cạnh AD là 2 cm/s ⇒ tốc độ giảm diện tích phần tối" | S(t) theo cạnh x(t) | 1 (C7) | | VD |
| 5.5.f | Bóng của đầu nến (cọc–bóng) | "hai ngọn nến cháy, bóng đầu nến thứ nhất" | tam giác đồng dạng + đạo hàm | 1 (C12) | | VDC |
| **Σ** | | | | **15** | | |

(Lưu ý: ở cả 15 câu, bước 1 là tự thiết lập quan hệ giữa các đại lượng theo t, bước 2 đạo hàm hai vế theo t (có đạo hàm hàm hợp), bước 3 thay giá trị tức thời — đúng như phương pháp ghi trong file.)

---
## 3. LÝ THUYẾT CỐT LÕI + PHƯƠNG PHÁP TÁC GIẢ NÊU (ngắn)

**Bài 3 (B3-D1 lý thuyết):**
- TCN: y=m nếu lim_{x→+∞}f=m hoặc lim_{x→-∞}f=m (hai phía xét riêng). Bước: tính hai giới hạn ±∞; phía nào hữu hạn thì có TCN phía đó.
- TCĐ: x=a nếu một trong bốn giới hạn một bên tại a là ±∞. Bước: tìm nghiệm mẫu, tính giới hạn một bên.
- TCX: y=ax+b (a≠0) nếu lim [f(x)−(ax+b)]=0. Bước: a=lim f/x, b=lim [f−ax] (xét +∞ và -∞). Lưu ý: a=0 ⇒ trùng TCN. Hàm (ax²+bx+c)/(mx+n): chia đa thức ⇒ f=a′x+b′+e/(mx+n), e≠0 ⇒ y=a′x+b′.
- Lưu ý riêng: y=(ax+b)/(cx+d) luôn có TCĐ x=-d/c, TCN y=a/c (khi ad−bc≠0).
- B3-D3 (tham số): KHÔNG có lý thuyết riêng (chỉ có tiêu đề); B3-D4: "Xác định tiệm cận; dùng giả thiết khoảng cách, góc, diện tích… để lập phương trình tìm ẩn".

**Bài 4:**
- 3 bước khảo sát: TXĐ → sự biến thiên (y′, giới hạn/tiệm cận, BBT) → điểm đặc biệt & vẽ.
- Bậc ba: y′=0 hai nghiệm phân biệt (2 cực trị) / nghiệm kép / vô nghiệm; không cực trị ⇔ b²−3ac≤0; hai cực trị ⇔ a≠0 và b²−3ac>0; tâm đối xứng = trung điểm hai cực trị, hoành độ -b/(3a); tiếp tuyến tại tâm đối xứng có hệ số góc nhỏ nhất (a>0) hoặc lớn nhất (a<0).
- Bậc1/bậc1: y′=(ad−bc)/(cx+d)²; đồ thị nhận giao hai tiệm cận làm tâm đối xứng; TCN y=a/c, TCĐ x=-d/c; giao Ox x=-b/a, giao Oy y=b/d.
- Bậc2/bậc1 (tử không chia hết mẫu): y′=(am x²+2an x+bn−mc)/(mx+n)²; hai cực trị ⇔ y′=0 hai nghiệm phân biệt; tâm đối xứng = giao TCĐ & TCX.
- B4-D4: "đề cho hình vẽ thực tế ⇒ biểu diễn hàm theo ẩn → đạo hàm, lập BBT → kết luận".

**Bài 5:**
- Đạo hàm f′(a) là tốc độ thay đổi tức thời. Ứng dụng: s′=v, v′=a=s″; C′(t) = tốc độ phản ứng; P′(t) = tốc độ tăng trưởng quần thể; C′(x) = chi phí biên ≈ chi phí sản xuất thêm đơn vị thứ x+1 (có nêu trong SGK Toán 11 KNTT).
- Quy trình tối ưu 3 bước: (1) xác định đại lượng Q cần max/min, (2) chọn ẩn x, biểu diễn Q=Q(x), tìm TXĐ thực tế, (3) tìm GTLN/GTNN và kết luận. Khó khăn lớn nhất = lập hàm.
- B5-D4: Lợi nhuận = Doanh thu − Chi phí; nếu có thuế/nhập–xuất khẩu thì lập thêm; dùng BBT.
- B5-D5: 3 bước (quan hệ theo t ⇒ đạo hàm hai vế, nhớ đạo hàm hàm hợp ⇒ thay giá trị tại t₀).
- B5-D3: không có lý thuyết riêng (chỉ danh sách câu).

---
## 4. SO VỚI BẢN ĐỒ CŨ (oldmap.md: 7 nhóm tiệm cận; 11 nhóm khảo sát; 10 nhóm thực tế)

### 4.1 Tiệm cận (cũ: TCN · TCĐ · TCX · TCX khi biết đồ thị/BBT · căn thức · bằng định nghĩa · góc giữa đường thẳng và tiệm cận)
Tác giả CHIA THEO ĐỐI TƯỢNG LỚN KHÁC: (1) TCĐ+TCN, (2) TCĐ+TCX, (3) THAM SỐ, (4) HÌNH HỌC & THỰC TẾ. Hệ quả:
- **Tác giả có mà bản đồ cũ KHÔNG CÓ:** (a) *Tiệm cận có tham số* (27 câu, nguyên một Dạng, 3 biến thể kiểu 3.3.a/b/c) — bản cũ không có nhóm nào; (b) *Hình học tiệm cận* (khoảng cách điểm–tiệm cận, hcn/tam giác/hình thang tạo bởi tiệm cận và trục; ≥ ~35 câu rải B3-D1/D2/D3/D4) — bản cũ chỉ có "góc giữa đường thẳng và tiệm cận" (10 câu) mà tác giả hầu như không có (chỉ B3-D2 III-5, B3-D3 II-4/c, ~2–3 câu); (c) *Đếm tổng số tiệm cận của phân thức (loại nghiệm trùng)* như một kiểu riêng; (d) *tiệm cận của mô hình thực tế = giới hạn dài hạn/giá trị bão hoà* (24 câu) — bản cũ chỉ có nhóm "Tiệm cận và giới hạn dài hạn trong mô hình" (1 câu); (e) cônic có TCX (hypebol, 1–2 câu), TCX của hàm √(4x²+…) có hai TCX.
- **Bản cũ có mà tác giả KHÔNG tách riêng:** "Tìm tiệm cận bằng định nghĩa" (chỉ lướt qua bằng cách tính giới hạn trong các bài tự luận), "TCX khi biết đồ thị/BBT" (gần như không có: B3-D2 II-6 là 1 câu duy nhất có hình), "Tiệm cận của hàm căn thức" (4–6 câu nằm lẫn trong 3.1.e và 3.3.a).
- **Gộp hơn:** TCN và TCĐ không tách; TCX luôn đi với TCĐ.
- **Tách mịn hơn:** đọc tiệm cận từ BBT/đồ thị (9 câu) được tách ra thành kiểu trong cùng Dạng 1; tách "đếm TC" khỏi "tìm phương trình TC".

### 4.2 Khảo sát (cũ: hệ số / đồ thị / cực trị cho bậc 3; hệ số / đồ thị / khoảng cách 2 tiệm cận cho 1/1; hệ số / đồ thị cho 2/1; PT đường thẳng qua 2 cực trị; tiếp tuyến; khoảng cách đến tiệm cận)
Tác giả CHIA THEO HÌNH DẠNG HÀM (bậc 3 / 1-1 / 2-1) và trong mỗi hình dạng LẶP lại cùng một bộ kiểu (khảo sát–vẽ, chọn hàm theo BBT/đồ thị, đọc hệ số, tương giao, đúng/sai tính chất). Cụ thể:
- **Tác giả có mà bản cũ KHÔNG có (hoặc không tách):** (a) *Khảo sát và VẼ đồ thị* dạng tự luận 3 bước (mỗi hình dạng 1 bài, 4 ý); (b) *Chọn hàm số ứng với BBT/đồ thị* (≥ 20 câu: 4.1.d 4, 4.2.c 8, 4.3.b 8…) ; (c) *Tương giao với đường thẳng* tách thành 3 biến thể (đếm m nguyên / ràng buộc hoành độ Viète / hình học trên A,B,C): bậc 3 14 câu, 1/1 9 câu, 2/1 4 câu — bản cũ chỉ có "đồ thị bậc 3 / 1-1 / 2-1" chung; (d) *Cặp điểm đối xứng qua tâm, điểm gần đường thẳng nhất, điểm nguyên* (4.3.e); (e) *Hai điểm cực trị cách đều đường thẳng* (4.3.g, TL 4.3-2b); (f) *Hàm cho bằng đồ thị của f′* (B4-D2 II-3).
- **Bản cũ có mà tác giả hầu như KHÔNG có:** "PT đường thẳng qua hai điểm cực trị" (chỉ B4-D1 II-5/d và vài ý) — bản cũ có 20 câu (15 đã duyệt); "Phương trình tiếp tuyến" (tác giả chỉ ~6 dòng đề: B4-D3 II-5/b,7/b,9/d, Đ4 II-2/c) ; "Khoảng cách đến hai tiệm cận bậc 1/1" (bản cũ có nhóm riêng, 0 câu): tác giả có ở B3-D1 III-6,7,8 (3 câu) thuộc Bài 3, không phải Bài 4.
- **"Hệ số" (bản cũ tách riêng 3 nhóm 28+22+16 câu):** tác giả GỘP chung vào "đọc đồ thị/BBT ⇒ dấu hệ số" (14+19 câu) — nhưng đây vẫn là kiểu lớn nhất của Bài 4 (≥ 37/153 câu), nên giữ nhóm riêng cũng hợp lý.
- **"Cực trị bậc 3" (cũ T112010505):** tác giả chỉ có 1 câu tham số (4.1.e).

### 4.3 Thực tế (cũ 10 nhóm: mô hình có sẵn · biểu thức có sẵn · tối ưu cho sẵn · hình học · kinh tế · quãng đường–thời gian · chuyển động s–v–a · tốc độ thay đổi · tốc độ liên quan · tiệm cận dài hạn)
Tác giả chia Bài 5 thành 5 Dạng; so với bản cũ:
- **Khớp rõ:** 5.1.a (s–v–a ⇒ cũ T607) ; 5.1.b (tốc độ thay đổi ⇒ cũ T608) ; 5.5 (tốc độ liên quan ⇒ cũ T609 — bản cũ có nhóm nhưng 0 câu; tác giả có nguyên một Dạng 15 câu có 6 biến thể) ; 5.2.a–c (hình học ⇒ cũ T604) ; 5.4 (kinh tế ⇒ cũ T605) ; 5.2.d (quãng đường–thời gian ⇒ cũ T606) ; 5.3.e + 3.4.b (tiệm cận dài hạn ⇒ cũ T610).
- **Tác giả có mà bản cũ không tách (nên thêm):** (a) *Giá–cầu tuyến tính* (≈ 24 câu: 5.1.e 11 + 5.4.c 13; bản cũ gộp vào "kinh tế") ; (b) *Logistic/tốc độ tăng trưởng max* (5.3.a, 4 câu + 5.4.g 1 câu) ; (c) *Số máy móc tối ưu* (5.1.h + 5.4.e = 5 câu) và *lô hàng/EOQ* (3 câu) ; (d) *Lợi nhuận có thuế* (5 câu) ; (e) *Chi phí biên / ý nghĩa f′ trong kinh tế* (5.1.c, B4-D4 I-2) ; (f) *Cắt dây thành hai hình* (4–5 câu, kiểu lặp rất rõ) ; (g) *Hộp từ tấm vật liệu / bể chứa* (10 câu) ; (h) *Sào qua góc hành lang chữ L / gara* (3 câu) ; (i) *Góc nhìn* (1 câu) ; (j) *Khoảng cách giữa hai vật chuyển động* (2 câu) ; (k) *Mô hình hoá bằng hàm bậc ba (địa hình, công trình)* — B4-D4 4.4.d (8 câu) ; (l) *Quỹ đạo bậc2/bậc1 (thuyền, máy bay)* — 4.4.e (5 câu) ; (m) *Tìm hàm/hệ số từ dữ kiện số liệu* (5.3.g, 4.4.c) ; (n) *Hàm cầu p(x), x(p) — đọc tính đơn điệu* (Đ5 I-5, I-11).
- **Bản cũ phân theo "có sẵn mô hình/có sẵn biểu thức" (T601/T602: 614 câu)** — một trục phân loại KHÁC hẳn: tác giả phân theo NỘI DUNG toán (giá–cầu, cắt dây, hộp, tốc độ liên quan…), không theo "đề cho sẵn hàm hay phải lập hàm". Nhưng cả tác giả cũng phân biệt ngầm: *đề cho sẵn hàm* (5.1.d, 5.3.f) vs *phải lập hàm* (5.2, 5.1.e, 5.4.c).

---
## 5. BẢNG TỪNG CÂU CÁC ĐỀ (Đ3, Đ4, Đ5, ĐKS) → KIỂU CÂU
(Mã kiểu theo §2; "mới" = chưa nằm trong bảng §2 nhưng là kiểu ngoài chương đã nêu trong ĐKS.)

### Đ3 — Đường tiệm cận (22 câu)
| Câu | Nội dung rút gọn | Kiểu |
|---|---|---|
| I-1 | TCN của (3x+1)/(x-1) | 3.1.a |
| I-2 | TCĐ của (2x-2)/(x+1) | 3.1.a |
| I-3 | lim f=1 (+∞), -1 (−∞) ⇒ mệnh đề | 3.1.b (lý thuyết giới hạn) |
| I-4 | BBT: tổng TCN+TCĐ | 3.1.b |
| I-5 | hàm nào có một tiệm cận | 3.1.a (chọn hàm) |
| I-6 | BBT: tổng TCĐ+TCN | 3.1.b |
| I-7 | 2y+1=0 là TCN của hàm nào | 3.1.a (chọn hàm) |
| I-8 | khoảng cách từ M(2;-1) đến TCX của y=2x-1+3/(x+3) | 3.2.b (TCX hình học) |
| I-9 | TCX của y=x+m+3/(m-x) đi qua M(1;2) tìm m | 3.2.c / 3.3.b (TCX có tham số) |
| I-10 | m để (x²…+m)/(x-m) không có TCĐ | 3.3.a (tử có m) |
| I-11 | m để mx²+6x-2 /(x+2) có TCĐ, không TCX | 3.3.a |
| I-12 | chi phí trung bình đồ chơi (50 000 + 5x)/x ⇒ TCN | 3.4.c |
| II-1 | BBT: đơn điệu, TCN, hai TCĐ, GTLN | 3.1.b (kèm đơn điệu/GTLN) |
| II-2 | đồ thị: liên tục, đơn điệu, không TCN, khoảng cách hai TCĐ=2 | 3.1.b |
| II-3 | (x²-2x+2)/(x+2): số TC, giao điểm, khoảng cách O–TCX, qua điểm | 3.2.b |
| II-4 | (x²+mx-1)/(x-1)(Cₘ): TCX, qua M, tam giác S=8, giao ∈ parabol | 3.2.c |
| III-1 | m để hcn tạo bởi TC và trục có S=2 | 3.3.c |
| III-2 | chi phí loại x% ô nhiễm, C(50) | 3.4.b |
| III-3 | dân số P(t)=40t/(t²+10)-50/(t+1)+70 ⇒ dân số dự kiến lâu dài | 3.4.b |
| III-4 | nồng độ thuốc C(t)=0.4/(t^1.2+1)+0.013 ⇒ nồng độ tồn dư | 3.4.b |
| III-5 | hai loài P(t),Q(t) – dự kiến lâu dài (xem đề) | 3.4.b (chưa đọc đủ) |
| III-6 | m để khoảng cách O đến TCX nhỏ nhất | 3.3.c (min) |

### Đ4 — Khảo sát (22 câu)
| Câu | Nội dung | Kiểu |
|---|---|---|
| I-1 | BBT ⇒ hàm nào | 4.2.c / 4.3.b |
| I-2 | y=(ax+b)/(cx-1) đồ thị ⇒ S=a+b+c | 4.2.d |
| I-3 | đồ thị ⇒ hàm nào | 4.1.d / 4.2.c |
| I-4 | f=(ax-6)/(bx-c) BBT ⇒ đếm số âm | 4.2.d |
| I-5 | đồ thị ⇒ hàm nào | 4.1.d / 4.2.c |
| I-6 | bậc 3 đồ thị ⇒ đếm số dương | 4.1.b |
| I-7 | hàm nào có BBT | 4.2.c |
| I-8 | bể 100 lít +20 lít +10 g/phút ⇒ nồng độ f(t) | 4.4 (mô hình hữu tỉ, nồng độ) → tương ứng 3.4.c, 5.3.e |
| I-9 | hồ tôm 30 khối +4 khối +3 kg ⇒ nồng độ không vượt quá | cùng loại I-8 |
| I-10 | (Cₘ) có bao nhiêu đồ thị đi qua (0;1) | 4.3.d (tham số, đơn giản) |
| I-11 | f=(ax+b)/(cx+1) BBT ⇒ tập b | 4.2.d |
| I-12 | bậc 3 cắt Ox, Oy tại A,B ⇒ S_OAB=8 | 4.1.f (tương giao với trục + hình học) |
| II-1 | x³-6x²-15x+20: giao Oy, đồng biến, điểm uốn, GTNN | 4.1.c |
| II-2 | 2x³+(m-1)x²+(m+2)x+1: tương giao, tiếp tuyến song song, hai cực trị | 4.1.e |
| II-3 | (3x+2)/(x+2): TC, tâm, giao d, ABCD hình bình hành | 4.2.f (tương giao) |
| II-4 | (-x²-3x+4)/(x-3) | 4.3.c (≡ B4-D3 II-4: câu trùng) |
| III-1 | m để TCX tạo tam giác S=2 | 3.2.c |
| III-2 | chi phí TB vợt cầu lông (5x+1)/x ⇒ lim | 4.4.b + 3.4.c |
| III-3 | tấm nhôm cắt 4 góc ⇒ hộp, x để V max | 5.2.a |
| III-4 | mương dẫn nước: tổng AB+BC+CD ngắn nhất | 5.2.c |
| III-5 | NaOH trộn ⇒ nồng độ luôn lớn hơn số a | 4.2.b |
| III-6 | bìa vuông cắt tam giác cân ⇒ chóp tứ giác đều V max | 5.2.a |

### Đ5 — UDĐH bài thực tế (22 câu)
| Câu | Nội dung | Kiểu |
|---|---|---|
| I-1 | đồ thị tốc độ xe đua ⇒ tốc độ nhỏ nhất | (mới) đọc đồ thị — gần 5.1.a |
| I-2 | h=32.5t-4.9t² ⇒ vận tốc sau 3 giây | 5.1.a |
| I-3 | P=120e^0.15t ⇒ tốc độ tăng trưởng tại t=0 | 5.1.b |
| I-4 | hàm chi phí biên C(x)=…+0.025x³ | 5.1.c |
| I-5 | x=(250-p)/(0.01p): khẳng định (đơn điệu của cầu) | (mới) hàm cầu — gần 5.1.b |
| I-6 | thùng dầu hộp đáy vuông V=30 dm³, giá vật liệu khác nhau | 5.2.a |
| I-7 | xe 16 chỗ, đoàn 22 người, giá (40-x)²/2 | 5.4.d |
| I-8 | p(x)=1000-25x ⇒ hàm doanh thu | 5.1.c (lý thuyết kinh tế) |
| I-9 | C(v)=5400/v+1.5v ⇒ tốc độ tiết kiệm xăng nhất | 5.1.d |
| I-10 | N(t)=100e^0.012t ⇒ năm nào tốc độ tăng > … | 5.1.b |
| I-11 | p=354/(1+0.01x): số lượng khi giá tăng | (mới) hàm cầu |
| I-12 | xô nhôm S(x)=πx²+20000/x ⇒ x để ít nguyên liệu | 5.1.d / 5.2.a |
| II-1 | y=t³-12t+3: gia tốc, vận tốc, hướng, quãng đường | 5.1.a |
| II-2 | nhà máy A–B: P(x)=45-0.001x², lợi nhuận H(x), max | 5.4.a |
| II-3 | cửa sổ bán nguyệt + hcn, dây thép 8 m | 5.2.c |
| II-4 | C(x)=0.0005x²+0.15x+5 ⇒ chi phí TB giảm khi x ≤ 100 | 5.1.d / 5.4.a |
| III-1 | dệt vải lụa: lợi nhuận tối đa | 5.1.g |
| III-2 | hộp không nắp V=4000 ⇒ x để tốn ít bìa | 5.2.a |
| III-3 | hai thành phố A, B qua sông: cầu EF ⇒ đường ngắn nhất | 5.2.d |
| III-4 | f=500(t²+me^-t) logistic, m≤0 | 5.3.a (biến thể, có tham số) |
| III-5 | A, B hai phía một bờ sông, người lấy nước | 5.2.d |
| III-6 | cá hồi E(v)=c·v³·t, 100 km, dòng 5 km/h | 5.1.i |

### ĐKS — Đề khảo sát chất lượng chương Hàm số (22 câu)
(Có đủ cả 6 mảng của cả chương, không riêng Bài 3–5.)
| Câu | Nội dung | Kiểu / chuyên đề |
|---|---|---|
| I-1 | f′(x)=-x²-4 ⇒ mệnh đề | Tính đơn điệu — từ f′ |
| I-2 | BBT ⇒ giá trị cực tiểu | Cực trị — đọc BBT |
| I-3 | đồ thị f trên [-1;3] ⇒ GTLN của g(x)=f(sin x+1) | GTLN–GTNN hàm hợp, đọc đồ thị |
| I-4 | TCX của (-x²-3x+4)/(x+2) | 3.2.a |
| I-5 | đồ thị ⇒ hàm nào | 4.1.d / 4.2.c |
| I-6 | đồ thị có TCĐ x=1, đi xuống: đơn điệu | Đơn điệu — đọc đồ thị (có TCĐ) |
| I-7 | điểm cực đại của đồ thị (x²+2x+2)/(x+1) | Cực trị — khi biết hàm (bậc2/bậc1); gần 4.3.c |
| I-8 | đơn điệu của (2x+4)/(1-x) | Đơn điệu — khi biết hàm |
| I-9 | s(t)=t³+3t-1 ⇒ v(5) | 5.1.a |
| I-10 | đồ thị ⇒ hàm nào | 4.x.d (chọn hàm) |
| I-11 | V(T) (nước 1 kg) BBT ⇒ khoảng thể tích giảm | Đơn điệu — đọc BBT thực tế (ứng dụng 5.1.d) |
| I-12 | N(t)=-t³+12t² ⇒ khoảng số ca tăng | Đơn điệu — thực tế (5.3.b) |
| II-1 | đồ thị của f′ (bậc ba): đơn điệu, cực trị, f′(2), g(x)=f(x)-x²/2+x | Đơn điệu/cực trị từ ĐỒ THỊ f′ (hàm phức tạp) |
| II-2 | đồ thị liên tục: không có đạo hàm tại ±2, cực trị, min, không max | Cực trị/GTNN — đọc đồ thị có điểm nhọn |
| II-3 | (x²+4x-1)/(x-1): đơn điệu, cực đại (-1;2), TCĐ, TCX | 4.3.c |
| II-4 | tàu: chi phí nhiên liệu 480/x+0.03x² … vận tốc min | 5.1.d / 5.1.e-ish (hàm lập từ dữ kiện); ≡ B4-D4 II-3 |
| III-1 | (x²+4x+2)/(x+2): trục đối xứng y=ax+b | 4.3.e (đối xứng) |
| III-2 | hai điểm M,N đối xứng qua I | 4.3.e |
| III-3 | cầu p=60/(1+0.2x): giá khi bán 10 đơn vị | 4.4.b (hàm cầu cho sẵn, tính giá trị) |
| III-4 | thuyền thu sóng tốt nhất (khoảng cách ngắn nhất tới trạm) | 4.4.e |
| III-5 | điện trở song song 10 Ω: R=10x/(x+10) ⇒ giới hạn | 4.2.b |
| III-6 | ông Vinh đào vàng: chạy qua M,N bờ biển; nồng độ chất độc y=50log(t+2) | 5.2.d (đường đi ngắn nhất) + hàm log |

---
## 6. CÂU "LẠ" KHÔNG VÀO KIỂU NÀO (hoặc phải ghép gượng)
- B3-D1 II-4 d) "đồ thị y=1/(f(x)+2) có hai TCĐ": **tiệm cận của hàm hợp 1/(f+2) từ BBT** — chỉ 1 ý duy nhất trong cả 3 bài (bản nháp mới của trung tâm có nhóm "Tiệm cận của hàm hợp 3 câu").
- B3-D4 III-10 (ống khói hypebol): cônic có TCX; B3-D2 II-4: √(4x²+8x−12) có **hai** TCX.
- B3-D3 III-8 (a;b nguyên, đúng hai tiệm cận, mẫu bậc 3 tham số kép) — VDC không có dạng khác ở chương.
- B4-D2 III-1 ("tồn tại duy nhất đường thẳng d … sao cho (Cₘ) …") và III-9 (tìm m nguyên dương để cắt Oy ở -4): hai câu tham số rời, không thuộc kiểu nào của Dạng.
- B4-D3 II-10 (c) "pt x²+3x+3=m|x+2| có 4 nghiệm": **biện luận nghiệm bằng đồ thị chứa trị tuyệt đối** — chỉ 1 ý.
- B4-D3 II-7 (hàm y=x−1/(x+1)): tồn tại hai tiếp tuyến vuông góc; OA⊥OB — ý hình học tọa độ khác thường.
- B4-D4 III-15 (chia công viên MN), III-16 (thang đo điểm f=x³+ax²+bx+c từ 3 dữ kiện), I-5 (chu vi vườn P(x) ⇒ TCX).
- B5-D4 (8 câu "lẻ" 5.4.i): hai mặt hàng + ràng buộc vốn (2 biến – Cobb–Douglas); phân bổ thời gian làm bài thi; vi mạch; ROI đầu tư điện mặt trời; phạt công nhân; taxi hàm phân khúc (giải ngược x từ f(x)); hàm chi phí đồ thị. 
- B5-D4 C47 (hàm phân khúc giá cước taxi, giải f(x)=475 000): không dùng đạo hàm.
- B5-D3 C22 (dao động điều hoà, động năng max) và C19 (huyết áp lượng giác = 80 mmHg): lượng giác, chỉ có 1–2 câu.
- B5-D3 C9 (quần thể sinh vật theo ngày, đề dài – hàm chưa đọc đủ); B5-D2 III-10 (xe tăng/đầu đạn, III-11 trượt tuyết): vật lí quỹ đạo, đề dài.
- Đ4 I-8, I-9, III-2, III-5 và ĐKS III-5: mô hình hữu tỉ thực tế nằm trong Đề KHẢO SÁT (Bài 4) chứ không phải Bài 3 — tác giả đặt chúng trong Bài 4 dù cùng loại với 3.4.b/5.3.e (nghĩa là không phân định rõ ranh giới giữa các Bài).
- Các kiểu CỦA BÀI 1–2 xuất hiện ở ĐKS (đơn điệu từ f′/từ đồ thị f′/hàm hợp; GTLN của g(x)=f(sin x+1)) – ngoài phạm vi hồ sơ này, ghi để bên Bài 1–2 đối chiếu.

---
## 7. GHI CHÚ ĐỘ TIN CẬY
- Tổng số câu từng file: ĐẾM bằng script (chắc). Số câu theo kiểu: đếm tay từ đề (đã đối chiếu tổng khớp từng file), nhưng nhiều câu đề dài nên tôi chỉ đọc phần đầu + phần cuối câu hỏi; ranh giới kiểu (vd 4.1.f f2/f3; 5.4.a/5.4.b; 3.3.a/3.3.c) có thể lệch ±1–2.
- Mọi bảng BBT/đồ thị/hình vẽ: KHÔNG xem được — kiểu "đọc đồ thị/BBT" suy từ lời dẫn.
- Không đọc đầy đủ lời giải; B5-D3 C9 và Đ3 III-5 chỉ nhìn đề rút gọn.
- Mức độ NB/TH/VD/VDC: tôi tự gán theo độ dài và số bước giải, KHÔNG phải nhãn của tác giả (nguồn không ghi mức).
