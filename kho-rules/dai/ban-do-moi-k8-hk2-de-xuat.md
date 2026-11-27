# Bản đồ mới K8 — ĐỀ XUẤT các chủ đề học kì II còn THIẾU (27/11/2026, chờ Thùy chốt)

**Vai trò:** Claude chỉ ĐỀ XUẤT; Thùy / trưởng khối quyết cấu trúc (`spec-ban-do-toan.md` §0, §2.8). Chưa ghi gì vào DB.

## 0. Nguồn và cách đọc

- **SGK:** Toán 8 tập 2 Kết nối tri thức (`Downloads\sach-giao-khoa-toan-8-tap-2-…pdf`, 142 trang). **Là bản scan, không có lớp chữ** nên em mới đọc được **mục lục** (trang 3, ảnh): Ch VI bài 21–24 · Ch VII bài 25–29 · Ch VIII bài 30–32 · Ch IX bài 33–37 · Ch X bài 38–39. **Chưa đọc nội dung từng bài** (máy không có OCR). Dạng bên dưới lấy theo tên bài trong mục lục + ma trận / bảng đặc tả in trong đề + câu hỏi thật.
- **Đề thật:** **GKII** 33 đề + **CKII** 19 đề Toán 8 Hà Nội (2024–25, 2025–26) ở `Downloads\GKII`, `Downloads\CKII`, trích chữ bằng `pdftotext`. Chỉ đếm từ khoá + đọc các câu hỏi khớp; **chưa đọc từng đề**. 16/33 đề GKII và 7/19 đề CKII là scan ⇒ số đếm là **cận dưới** (CKII đọc được 12 đề).
- **Phạm vi GKII** (đọc từ ma trận): chủ yếu Ch IV Thalès · ĐTB · phân giác, Ch V thống kê, Ch VIII xác suất, hàm số bậc nhất; một số trường thêm phương trình bậc nhất, phân thức, vài trường chạm đồng dạng.
- **Cấu trúc CKII điển hình** (Đa Tốn, Tam Hưng, Chúc Sơn, Hai Bà Trưng…): TN 8 câu (PT bậc nhất, xác suất, đồng dạng phối cảnh, hình chóp) · **Bài 1 biểu thức phân thức** (tính giá trị · chứng minh B = … · rút gọn P = A·B · tìm x để P = k / x nguyên / GTNN) · **Bài 2 giải PT + hàm số bậc nhất** · **Bài 3 lập PT (chuyển động có nghỉ)** · **Bài 4 hình chóp tứ giác đều (diện tích xung quanh) + chứng minh tam giác đồng dạng 3 ý** · **Bài 5 vận dụng cao** (GTLN diện tích, đẳng thức).
- **Kho:** K8 chỉ có bản đồ Đại Ch I–III (3 chủ đề, 24 nhóm, ~55 dạng). Chưa có câu HK2 có dạng để đo ⇒ đề xuất dựa vào đề thi + mục lục SGK.
- Ký hiệu nguồn: **[SGK]** = tên bài trong mục lục SGK (chưa đọc nội dung) · **[Đề]** = thấy trong đề thật (đã đọc câu hỏi) · **[◇]** = mở rộng, **chưa thấy trong mẫu đã đọc** — Thùy cân nhắc.
- Luật bản đồ: mã gốc bất biến; dạng mới phải có **mô tả nhận biết** ngay lúc tạo; "nguồn bản đồ phải lấy từ đề thi thật" (K12 05/11). Bản **rút gọn** theo ý Thùy: chương đơn giản (thống kê, xác suất) chỉ vài dạng.

## 1. Hiện trạng K8 (đo 27/11, `bdm-ly-thuyet.mjs 8`)

Đã có (nhánh Đại): CĐ 1 **Đơn thức – đa thức** (Ch I), CĐ 2 **Hằng đẳng thức** (Ch II), CĐ 3 **Phân tích đa thức thành nhân tử** (Ch II–III). Hình K8 đã có bài HH00058–66, HH00111 (tứ giác), HH00142 Thalès, HH00143 đường trung bình, HH00144 phân giác.

**Chưa có chủ đề nào** cho: dữ liệu và biểu đồ (Ch V) · phân thức đại số (Ch VI) · phương trình bậc nhất / lập phương trình / hàm số bậc nhất (Ch VII) · xác suất (Ch VIII) · hình chóp (Ch X). Tam giác đồng dạng + Pythagore (Ch IX) là Hình.

Việc cũ còn treo (HK1, không nằm trong bản này): đề xuất dạng thiếu Ch I–III của 20/10 (`ban-do-moi-k8-de-xuat-dang-thieu.md`, 17 dạng D1–D17 chưa được chốt).

## 2. Chủ đề 4 — Dữ liệu và biểu đồ (Ch V tập 1) *(rút gọn: 1 chuyên đề, 1 nhóm, 4 dạng)*

Thấy trong đề: **thống kê / biểu đồ có trong ≥ 13 / 33 đề GKII và ≥ 6 / 19 đề CKII**; hình quạt ≥ 9 đề GKII, biểu đồ tranh ≥ 6, cột kép ≥ 4, đoạn thẳng ≥ 3, "số liệu không hợp lí" ≥ 8.

**CĐ 4.1 (mới) Thu thập, phân loại, biểu diễn và phân tích dữ liệu → Nhóm 1 (mới) Dữ liệu và biểu đồ**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Phân loại dữ liệu; nhận biết số liệu không hợp lí; chọn biểu đồ phù hợp | Cho dãy dữ liệu / bảng (chiều cao, điểm, tuổi…) ⇒ phân loại, chỉ ra số liệu không hợp lí (âm, vô lí), chọn dạng biểu đồ phù hợp. | Đề (chiều cao "−150"; "bạn Hiếu muốn lập biểu đồ tỉ lệ %…"; "Cho các dãy dữ liệu sau") |
| 2 | Đọc và phân tích biểu đồ cột, cột kép, tranh, đoạn thẳng | Cho biểu đồ ⇒ đọc giá trị, so sánh, tìm lớn nhất / nhỏ nhất, hiệu giữa hai năm, lập bảng số liệu; biểu đồ tranh có quy ước 1 biểu tượng = k đơn vị. | Đề (kim ngạch xuất khẩu; vé bán theo ngày; biểu đồ tranh học lực; đoạn thẳng xếp loại lớp 8A) |
| 3 | Đọc và phân tích biểu đồ hình quạt tròn | Cho hình quạt (% từng phần) ⇒ phần lớn nhất / nhỏ nhất, tính số lượng thật từ tổng đã biết, lập bảng. | Đề (thị trường cung cấp cà phê; tỉ lệ ngân sách) |
| 4 | Tính tỉ số phần trăm, so sánh, nhận xét từ số liệu | Tỉ số % của hai đại lượng, tăng / giảm theo % giữa các năm; tính tổng, hiệu. | Đề (câu "tính tỉ số phần trăm … so với …"; "tổng số học sinh đạt từ 7 điểm trở lên") |

## 3. Chủ đề 5 — Phân thức đại số (Ch VI, bài 21–24)

Thấy trong đề: gần như **mọi đề CKII đọc được đều có "Bài 1: cho biểu thức A, B …"** (≥ 8 / 12); GKII chỉ ≥ 4 / 33 (trắc nghiệm ĐKXĐ, rút gọn, và một đề Đông Anh).

**CĐ 5.1 (mới) Phân thức đại số**

**Nhóm 1 (mới) — Khái niệm, tính chất cơ bản (bài 21, 22)**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Nhận biết phân thức; điều kiện xác định; tính giá trị | Chọn biểu thức là phân thức; tìm ĐKXĐ (mẫu ≠ 0); tính giá trị tại giá trị cho trước (đối chiếu ĐKXĐ). | Đề ("Điều kiện xác định của phân thức…", "Tính giá trị của biểu thức A tại x = 0") |
| 2 | Hai phân thức bằng nhau; tính chất cơ bản; rút gọn; quy đồng | Kiểm tra A/B = C/D bằng A·D = B·C; nhân / chia cả tử và mẫu; phân tích thành nhân tử rồi rút gọn; quy đồng mẫu. | Đề ("Rút gọn phân thức (3−x)²/…") · [SGK 22] |

**Nhóm 2 (mới) — Phép tính và biểu thức (bài 23, 24)**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Cộng, trừ, nhân, chia hai phân thức | Cùng mẫu / khác mẫu; chia = nhân nghịch đảo; kết quả rút gọn. | [SGK 23–24] · Đề |
| 2 | Rút gọn biểu thức; chứng minh B = …; tính P = A·B | Biểu thức nhiều phép tính phân thức (có ngoặc) rút gọn đến kết quả cho sẵn ("Chứng minh B = (x+3)/(x−3)"). **Dạng gặp nhiều nhất ở CKII.** | Đề |
| 3 | Tìm x để biểu thức bằng giá trị cho trước; x nguyên để giá trị nguyên; GTLN, GTNN | "Cho Q = A·B, tìm x để Q = 2/3"; "tìm x nguyên lớn nhất để P là số nguyên âm"; "tìm giá trị nhỏ nhất của N". | Đề |
| 4 | Bài toán thực tế viết phân thức theo x | Lập phân thức: thời gian = quãng đường / vận tốc, năng suất…; tính tổng hoặc giá trị. | Đề (ô tô đi từ A đến B, Đông Anh) |

## 4. Chủ đề 6 — Phương trình bậc nhất và hàm số bậc nhất (Ch VII, bài 25–29)

Tách **2 chuyên đề**.

### CĐ 6.1 (mới) Phương trình bậc nhất một ẩn (bài 25, 26)

Thấy trong đề: **giải phương trình ≥ 10 / 19 đề CKII, lập phương trình ≥ 7 / 19** (GKII: ≥ 5 và ≥ 2).

**Nhóm 1 (mới) — Giải phương trình bậc nhất một ẩn**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Nhận biết phương trình bậc nhất; kiểm tra một số có là nghiệm | Chọn PT dạng ax + b = 0 (a ≠ 0); thay số kiểm tra nghiệm. | Đề ("… là phương trình bậc nhất một ẩn", "x = 3 là nghiệm của phương trình") |
| 2 | Giải phương trình bậc nhất ax + b = 0 | Chuyển vế, chia hai vế cho hệ số. | Đề ("2x − 5 = 0") |
| 3 | Giải phương trình đưa được về bậc nhất | Mở ngoặc, quy đồng khử mẫu số, thu gọn hai vế (kể cả x² hai vế triệt tiêu: x² + 3x − 8 = x(x+1)). | Đề |
| 4 | Phương trình chứa tham số | Tìm m để phương trình nhận nghiệm cho trước. | Đề ("Giá trị của m để 2x − m = x + 1 có nghiệm x = −2") |

**Nhóm 2 (mới) — Giải bài toán bằng cách lập phương trình**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Toán chuyển động | Quãng đường – vận tốc – thời gian; đi – nghỉ – về, gặp nhau, xuôi – ngược dòng. | Đề (**gặp nhiều nhất ở CKII**: "đi xe máy từ A đến B 40 km/h, nghỉ 30 phút, về 50 km/h…") |
| 2 | Toán năng suất, công việc | Số sản phẩm theo ngày, làm chung / làm riêng. | [SGK 26] · Đề |
| 3 | Toán số học, phần trăm, giá cả, tình huống khác | Số tự nhiên, tăng / giảm theo %, lãi suất, giá giảm, tuổi, hình chữ nhật. | [SGK 26] · Đề |

> **Hỏi Thùy:** giữ 3 dạng lập PT hay gộp còn 1? Đề thật chỉ cho đúng 1 bài 1,0–1,5 điểm, đa số là chuyển động.

### CĐ 6.2 (mới) Hàm số bậc nhất và đồ thị (bài 27–29)

Thấy trong đề: hàm số bậc nhất có trong ≥ 7 / 33 đề GKII và ≥ 7 / 19 đề CKII; "song song" ≥ 13 / 33 GKII, 9 / 19 CKII.

**Nhóm 1 (mới) — Hàm số, đồ thị và hệ số góc**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Khái niệm hàm số; mặt phẳng toạ độ; hàm số bậc nhất; tính giá trị | Cho y = f(x): có phải hàm số, có phải bậc nhất (a ≠ 0); tính f(a); bảng giá trị; xác định toạ độ điểm trên mặt phẳng Oxy. | [SGK 27–28] · Đề ("Hoàn thành bảng sau", "Cho hàm số y = f(x) = 4 − 3x…") |
| 2 | Điểm thuộc đồ thị | Điểm M(x₀; y₀) có thuộc đồ thị không; chọn điểm thuộc đồ thị; điểm thuộc đồ thị chứa tham số. | Đề ("Điểm nào thuộc đồ thị y = −5x + 3") |
| 3 | Vẽ đồ thị y = ax + b | Lập bảng / lấy hai điểm (giao với hai trục), vẽ đường thẳng. | Đề (**gặp nhiều nhất**: "Vẽ đồ thị hàm số y = x + 3") |
| 4 | Hệ số góc của đường thẳng | Đọc hệ số góc, nhận biết góc nhọn / tù theo dấu a; tìm a khi biết hệ số góc. | Đề ("hệ số góc của đường thẳng y = −2x + 5") |
| 5 | Xác định hàm số bậc nhất khi biết điều kiện | Đồ thị đi qua một hoặc hai điểm, có hệ số góc cho trước ⇒ tìm a, b (hoặc m). | Đề ("(d) đi qua A(1; 4) tìm m", "Tìm a, b … đi qua A(1; 5)") |

**Nhóm 2 (mới) — Vị trí hai đường thẳng và ứng dụng**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Hai đường thẳng song song, cắt nhau, trùng nhau; tìm m | (d): y = ax + b, (d′): y = a′x + b′; a = a′ & b ≠ b′ (song song), a ≠ a′ (cắt), cả hai bằng (trùng); có tham số m (nhớ a ≠ 0). | Đề (**≥ 22 đề nhắc song song**: "xác định m để (d′) song song với (d)") |
| 2 | Giao điểm; giao với các trục; diện tích, chu vi tam giác tạo với hai trục | Giao điểm hai đường thẳng (vd "cắt (d₁) tại điểm có tung độ bằng 7"); A, B là giao điểm với Ox, Oy ⇒ OA, OB, AB ⇒ diện tích / chu vi tam giác OAB. | Đề (Hai Bà Trưng; đề minh hoạ Nghĩa Tân) |
| 3 | Bài toán thực tế quy về hàm số bậc nhất | Lập y = ax + b (giá, cước, lãi, vé…), tính y khi biết x hoặc ngược lại; "y có là hàm số bậc nhất của x không"; so sánh chi phí hai phương án. | Đề ("Lập hàm số y theo x, giá ban đầu ly trà sữa 25 000 đồng", "so sánh chi phí khi x = 50") |

## 5. Chủ đề 7 — Xác suất (Ch VIII, bài 30–32) *(rút gọn: 1 chuyên đề, 1 nhóm, 4 dạng)*

Thấy trong đề: **xác suất ≥ 13 / 33 đề GKII và ≥ 9 / 19 đề CKII**; xác suất thực nghiệm ≥ 7 GKII. Thường 1 câu TN + 1 bài 1,0–1,5 điểm.

**CĐ 7.1 (mới) Xác suất của biến cố → Nhóm 1 (mới) Xác suất của biến cố**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Kết quả có thể và kết quả thuận lợi của biến cố | Liệt kê kết quả có thể của phép thử, đếm kết quả thuận lợi cho biến cố. | [SGK 30] · Đề |
| 2 | Tính xác suất bằng tỉ số | P = số kết quả thuận lợi / số kết quả có thể: thẻ đánh số, đồng xu, xúc xắc, vòng quay chia hình quạt, chọn một em; có cả chọn hai đối tượng. | Đề (**nhiều nhất**: "chia hết cho 5", "chia 6 dư 1", "mũi tên chỉ vào hình quạt…", "chọn ngẫu nhiên hai câu lạc bộ") |
| 3 | Xác suất thực nghiệm và mối liên hệ với xác suất | Tung đồng xu / gieo xúc xắc n lần ⇒ xác suất thực nghiệm = số lần xuất hiện / n; so sánh với xác suất lí thuyết. | Đề ("11 lần mặt N … xác suất thực nghiệm", "gieo xúc xắc 50 lần") |
| 4 | Xác suất từ bảng số liệu hoặc biểu đồ | Chọn ngẫu nhiên một ngày / em / công nhân từ bảng, biểu đồ ⇒ xác suất. | Đề ("xác suất chọn được một ngày bán trên 150 vé", "chọn ngẫu nhiên một bạn nữ lớp 8C") |

## 6. Chủ đề 8 — Hình chóp (Ch X, bài 38–39) *(rút gọn: 1 chuyên đề, 2 nhóm, 5 dạng)*

Thấy trong đề: **hình chóp ≥ 5 / 19 đề CKII** (0 / 33 GKII, đúng vì Ch X học sau); thường là TN 1–2 câu + bài thực tế 1,0 điểm (lồng đèn, chụp đèn, vật trang trí, tính diện tích giấy / sơn). Đặt ở nhánh Đại (dạng–câu), như K9 đặt hình trụ – nón – cầu.

**CĐ 8.1 (mới) Hình chóp**

| # | Nhóm › Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Hình chóp tam giác đều › Nhận biết yếu tố, tính diện tích xung quanh và thể tích | Đỉnh, đáy, mặt bên, cạnh bên, trung đoạn, chiều cao; Sxq = ½·(chu vi đáy)·trung đoạn; V = ⅓·S đáy·h. | [SGK 38] · Đề (ma trận Đa Tốn) |
| 2 | Hình chóp tứ giác đều › Nhận biết yếu tố, các mặt bên | Đáy hình vuông, mặt bên là các tam giác cân bằng nhau; phân biệt trung đoạn với chiều cao. | Đề ("Hình chóp tứ giác đều có các mặt bên là…") |
| 3 | Hình chóp tứ giác đều › Tính thể tích | V = ⅓·a²·h khi biết cạnh đáy, chiều cao. | Đề ("thể tích … chiều cao 6 cm, cạnh đáy 4 cm") |
| 4 | Hình chóp tứ giác đều › Tính diện tích xung quanh, toàn phần | Cho cạnh đáy a, trung đoạn d ⇒ Sxq = 2ad, Stp = Sxq + a². | Đề (**nhiều nhất**: lồng đèn đáy 25 cm, trung đoạn 32 cm) |
| 5 | Hình chóp › Bài toán thực tế; tính độ dài bằng Pythagore | Lồng đèn, chụp đèn, mái lều, vật trang trí: tính giấy / sơn / thể tích chứa; thiếu trung đoạn hoặc chiều cao thì tính bằng Pythagore. | Đề (Chúc Sơn "sơn các mặt xung quanh", Phúc Lợi) |

## 7. Phần ngoài khuôn "dạng–câu" — Hình (Ch IV tập 1 + Ch IX tập 2)

Không đề xuất dạng ở đây vì thuộc khuôn **Hình–Học** (bài học → câu, `hinh_hoc_*`):

- **Đã có bài:** Thalès (HH00142), đường trung bình (HH00143), tính chất đường phân giác (HH00144), tứ giác (HH00058–66, HH00111). Thấy GKII: **ĐTB ≥ 11 / 33, Thalès ≥ 11, phân giác ≥ 8** — nhập thẳng vào các bài đó.
- **Chưa có bài: Ch IX (bài 33–37) — tam giác đồng dạng, ba trường hợp đồng dạng, Pythagore và ứng dụng, trường hợp đồng dạng của tam giác vuông, hình đồng dạng (phối cảnh).** Đề CKII: **đồng dạng ≥ 10 / 19**, gần như đề nào cũng có bài hình 2,5–3,0 điểm dạng "cho tam giác nhọn có hai đường cao BD, CE cắt nhau tại H: chứng minh ΔADB ∽ ΔAEC; chứng minh HE·HC = HD·HB; …"; TN thêm "hình đồng dạng phối cảnh". Theo `spec-giai-bai.md` mục Khối 8, câu Hình này ghi `dang=HH08000000` (chờ). **Đề xuất dựng 1 bài chờ riêng K8** theo mẫu `bdm-k9-hk2-dung.mjs` ("Hình học học kì II — chờ vào kho hình"); **Thùy duyệt thì em dựng cùng lượt dựng bản đồ**.
- **Bài vận dụng cao cuối đề** (0,5 điểm: diện tích hàng rào lớn nhất, đẳng thức 1/a+1/b+1/c = …, GTNN): nhập vào nhóm GTLN – GTNN và "Bài toán thực tế ứng dụng GTLN" đã có (NNB01396 · NDB01356); không đề xuất dạng mới.

## 8. Việc còn lại / cần Thùy quyết (theo thứ tự ưu tiên)

1. **SGK tập 2 là bản scan** — em mới đọc mục lục. Muốn đối chiếu từng bài (tên khái niệm, ví dụ) thì cần bản có chữ (hoặc cho em phép đọc ảnh từng bài, tốn nhiều lượt). Có cần không, hay dạng theo đề là đủ?
2. **Duyệt cấu trúc** §2–§6: 5 chủ đề mới (4 Dữ liệu, 5 Phân thức, 6 PT bậc nhất + hàm số, 7 Xác suất, 8 Hình chóp), 6 chuyên đề, 10 nhóm, **34 dạng**. Không còn dạng [◇]: mọi dạng đều đã thấy trong đề hoặc là tên bài SGK. Dạng "PT chứa tham số" và "thực tế phân thức" có thể bỏ nếu muốn rút gọn thêm.
3. **Lập PT**: 3 dạng hay gộp thành 1?
4. **Hình (Ch IX)**: đồng ý dựng 1 bài chờ K8 như K9?
5. Thứ tự dựng: giải đề HK2 (Việc 2) chạy trước, câu HK2 ghi `dang=—` + `THIẾU DẠNG` đến khi Thùy duyệt bản đồ này; sau khi dựng thì phân lại câu theo `spec-ban-do-toan.md` §3.4.
6. Sau khi chốt: ghi dạng + mô tả (chỉ ô trống), điền lý thuyết + ví dụ theo `ban-do-moi-k8-ghi-chu.md`. **Chưa làm gì ở DB.**

## 9. Số lượng

| Chủ đề | Chuyên đề (mới) | Nhóm (mới) | Dạng đề xuất |
|---|---|---|---|
| 4 Dữ liệu và biểu đồ | 1 | 1 | **4** |
| 5 Phân thức đại số | 1 | 2 | **6** |
| 6 PT bậc nhất và hàm số bậc nhất | 2 | 4 | **15** (CĐ 6.1: 7 · CĐ 6.2: 8) |
| 7 Xác suất | 1 | 1 | **4** |
| 8 Hình chóp | 1 | 2 | **5** |
| **Cộng** | 6 | 10 | **34 dạng** |
