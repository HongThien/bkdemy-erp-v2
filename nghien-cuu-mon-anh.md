# Nghiên cứu MÔN TIẾNG ANH — cần thêm gì để xây như môn Toán

> **Trạng thái: NGHIÊN CỨU (Sparring/Planning) 30/09/2026. Chưa build gì.**
>
> **CEO đã trả lời §8 (30/09):**
> - Khối 9 trước.
> - Tài liệu GV là đồ sưu tầm.
> - KP phải viết rõ ra trước.
> - Nghe để sau.
> - **Tiếng Anh không giống Toán, không bê khuôn Toán sang.**
>
> ⇒ **§5 bên dưới ĐÃ BỊ THAY** bởi `spec-anh-ban-do-k9.md` (bản đồ 100 KP, dựng theo cách GV, trung tâm và giáo trình tiếng Anh chia; đã kiểm bằng 3 đề thật).
> Nguồn: 3 luồng research web (đề thi, khung chuẩn, SGK) + đọc toàn bộ tài liệu GV gửi (zip 12 unit lớp 9 + PDF Collo Check)
> + dò hiện trạng code/DB. Chỗ nào chưa xác minh thì ghi rõ.

---

## 0. Kết luận 1 trang

1. **Đích rất rõ và đứng yên:** đề Tiếng Anh vào 10 Hà Nội gồm **40 câu trắc nghiệm, làm trong 60 phút**, **không có nghe, không có tự luận**, và có **12 dạng câu cố định**. Năm 2026 giữ nguyên cấu trúc 2025.
   ⚠ Năm 2027 Hà Nội **chưa công bố** môn thi thứ 3. Khối 9 hiện tại thi vào tháng 5–6/2027.
2. **"Tiếng Anh có chuẩn chung": ĐÚNG, và còn đúng hơn Toán.**
   - Chương trình GDPT 2018 liệt kê điểm ngữ pháp **từng lớp**.
   - Từ năm học 2026–2027 cả nước dùng **một bộ SGK** (Kết nối tri thức). Dòng tiếng Anh của bộ này là **Global Success**, **đúng bộ tài liệu GV vừa gửi**.
   - Mức độ thì có sẵn khung quốc tế: CEFR, CEFR-J, EGP, GSE.
3. **"Dễ hơn Toán": đúng một nửa.**
   - **Dễ hơn hẳn ở dây chuyền kho.** 4 trạm nặng nhất của Toán gần như biến mất: giải bài, vẽ hình, chuyển câu sang trắc nghiệm, LaTeX. Lý do: tài liệu có sẵn đáp án, và đề thi vốn đã là trắc nghiệm.
   - **Khó hơn ở bản đồ và đo lường**, vì 4 điểm:
     - (a) knowledge point của tiếng Anh **không phải "dạng bài"**;
     - (b) từ vựng có **hàng nghìn mục và bị quên dần**;
     - (c) đọc hiểu là **cụm câu dùng chung một đoạn văn**;
     - (d) lỗi đặc trưng của câu trắc nghiệm tiếng Anh là **"2 đáp án cùng đúng"**, máy không tự tính ra để bắt như ở Toán.
4. **Tài liệu GV gửi đủ tốt để làm hạt giống cho khối 9:**
   - Gồm 12 unit, **khoảng 1.800 câu trắc nghiệm có đáp án** (đếm thô bằng máy), **472 từ + 127 cụm từ**, 32 file nghe.
   - Khớp **11/12 dạng** của đề Hà Nội.
   - Nhưng chỉ lướt Unit 1 đã thấy **4 câu hỏng** ⇒ **bắt buộc qua cổng kiểm** như kho Toán.
5. **Code hiện có 0 thứ cho môn Anh.** Nguy hiểm hơn: ~15 hàm SQL và registry TS đang viết kiểu *"không phải KHTN thì là Toán"*. Thêm Anh mà không dọn trước thì dữ liệu Anh **lặng lẽ rơi vào bảng Đại số, không báo lỗi**. Đây là lần đầu luật đối xứng môn (ADR-mon) bị thử thật.

---

## 1. Đích — đề thi và chuẩn đầu ra

### 1.1 Đề Tiếng Anh vào 10 công lập Hà Nội (2025 = 2026)

- 40 câu × 0,25 điểm, 60 phút, 24 mã đề. Thứ tự các nhóm câu bị trộn theo mã đề; số câu mỗi dạng không đổi.
- Đề minh hoạ công bố ngày 29/08/2024. Năm 2026 Sở **không ra đề minh hoạ mới** và "bám sát đề minh hoạ đã công bố".

| # | Dạng | Số câu | Nhóm năng lực |
|---|---|---|---|
| 1 | Phát âm (phần gạch chân) | 2 | Ngữ âm 10% |
| 2 | Trọng âm | 2 | |
| 3 | Hoàn thành câu (ngữ pháp · từ vựng · giao tiếp) | 8 | Từ vựng–Ngữ pháp–Giao tiếp 30% |
| 4 | Điền từ vào thông báo | 4 | |
| 5 | Sắp xếp câu thành đoạn/hội thoại | 1 | Viết 30% |
| 6 | Chọn câu chủ đề / câu mở–kết đoạn | 1 | |
| 7 | Điền từ vào đoạn văn | 6 | |
| 8 | Chọn câu gần nghĩa nhất | 2 | |
| 9 | Viết câu từ từ gợi ý (dạng trắc nghiệm) | 2 | |
| 10 | Hiểu biển báo / thông báo | 2 | Đọc 30% |
| 11 | Đọc hiểu 1 bài | 6 | |
| 12 | Chọn câu/cụm điền vào đoạn | 4 | |

- **Mức độ tư duy:** Nhận biết 20% · Thông hiểu 40% · Vận dụng 40%. Việc chia câu theo nhóm năng lực là t suy ra vì khớp đúng 4/12/12/12; chưa thấy bảng đặc tả gốc của Sở.
- **So với trước 2025:**
  - *Bỏ:* tìm lỗi sai.
  - *Thêm:* biển báo, điền thông báo, sắp xếp đoạn, câu chủ đề, điền câu vào đoạn.
  - *Giảm:* câu ngữ pháp đơn lẻ, khoảng 14 → 8.
  - Năm 2026 câu hỏi "đặt trong ngữ cảnh nhiều hơn".
- **Điểm số:** Sở chưa công bố phổ điểm môn Anh (năm 2025 lẫn 2026). Giáo viên ước đỉnh phổ ở 6–8 điểm. Trường top cần trung bình 8–8,5 điểm mỗi môn.

### 1.2 Các kỳ thi liên quan

| Kỳ thi | Hình thức | Mức | Ghi chú |
|---|---|---|---|
| Chuyên Anh (4 trường của Sở) | 150 phút, trắc nghiệm + tự luận, **có nghe, có viết luận** | B2–C1 (phân tích của TAK12, không phải Sở) | Điểm chuyên hệ số 2 |
| Chuyên Ngoại ngữ (ĐHNN) | Anh chung 60 phút trắc nghiệm + Ngoại ngữ chuyên 90 phút | chưa xác minh | |
| HSG thành phố lớp 9 | 150 phút, có nghe | — | **Không cộng điểm** vào 10 năm 2025–26 |
| Tốt nghiệp THPT từ 2025 | 40 câu/50 phút, **chỉ còn đọc** | B1 | Năm 2025: TB 5,38, 38% dưới 5 |
| Cambridge A2 Key / B1 PET, TOEFL Junior | 4 kỹ năng | A2 / B1 | Chưa thấy giá trị tuyển sinh công lập Hà Nội |
| IOE | Online lớp 1–12 | — | 3,2 triệu thí sinh; không có quyền lợi tuyển sinh |

- **Tính liên thông:** đề vào 10 đã chứa sẵn các dạng con của đề THPT (điền thông báo, sắp xếp đoạn, điền câu vào đoạn, đọc hiểu). Vì vậy một kho khối 9 làm đúng sẽ dùng tiếp được cho khối 10–12.

### 1.3 Chuẩn đầu ra quốc gia (CT GDPT 2018, TT 32/2018)

- Hết THCS đạt **Bậc 2 (≈ A2)**; hết THPT đạt **Bậc 3 (≈ B1)**, theo Khung 6 bậc của TT 01/2014.
- Lớp 6–9 học 105 tiết/năm. THCS có **khoảng 800–1000 từ** Bậc 2.
- Chương trình xếp nội dung **"đồng tâm xoắn ốc"**: mỗi điểm ngữ pháp lặp lại và mở rộng qua các lớp. Điều này hợp với cách "suy mastery động từ mọi lần đo" của v2.
- Ngữ pháp **có danh sách theo từng lớp** (lớp 9 ở tr.39–40). Từ vựng **không có danh sách** (chỉ ghi "theo chủ điểm"). Ngữ âm chỉ ghi chung chung.

---

## 2. Chuẩn chung để đứng trên vai (R7)

| Nguồn | Cho cái gì | Vai trò đề xuất | Quyền dùng |
|---|---|---|---|
| **CT GDPT 2018 môn Anh** | Ngữ pháp theo lớp, chủ điểm, bậc đầu ra | **Xương sống: phạm vi từng khối** | Văn bản công khai |
| **Global Success 6–9** (SGK thống nhất từ 2026–27, QĐ 3588/QĐ-BGDĐT 26/12/2025) | 12 unit/lớp, thứ tự dạy, từ vựng từng unit | **Thứ tự chủ đề** (thứ Toán đang thiếu, spec-luong-kho C8) | Tài liệu GV đã theo sẵn |
| **CEFR-J** (Nhật) | Wordlist khoảng 7.800 từ + Grammar Profile, có nhãn CEFR; ngữ liệu gốc là SGK châu Á | Nhãn mức độ cho từ và ngữ pháp | **Dùng thương mại được**, chỉ cần ghi nguồn |
| English Grammar Profile (Cambridge) | Hơn 1.200 điểm ngữ pháp A1–C2, rút từ bài viết thật của người học | Tham chiếu chi tiết nhất | Chỉ miễn phí khi phi thương mại |
| Pearson GSE | Thang 10–90, hơn 1.600 mục tiêu học; Pearson đồng biên soạn Global Success | Tham chiếu mục tiêu | Chỉ miễn phí khi phi thương mại |
| English Vocabulary Profile · Oxford 3000/5000 | Mức CEFR gán theo từng **nghĩa** của từ | Tra mức từ | Chỉ tra online / PDF |

**Lý thuyết đo lường nên dùng tên** (để làm sau không phải tự nghĩ lại):

| Lý thuyết | Dùng vào việc |
|---|---|
| **Q-matrix** (Tatsuoka) | Nối 1 câu ↔ nhiều knowledge point |
| **Testlet** (Wainer & Kiely 1987) | Cụm câu dùng chung một đoạn văn thì không độc lập nhau |
| **IRT/Rasch ↔ Elo** (Duolingo Birdbrain) | Đo năng lực HS và độ khó câu cùng lúc (v2 đã có Elo theo môn) |
| **Spaced repetition / Half-Life Regression** (Settles & Meeder, ACL 2016; có mã nguồn mở) | Trí nhớ từ vựng suy giảm theo thời gian |
| **Receptive vs productive vocabulary** (Nation; Laufer & Nation 1999) | "Nhận ra từ" khác "tự dùng được từ" |
| **Cambridge Learner Corpus error coding** (Nicholls 2003) | Danh mục mã lỗi sẵn có (sai dạng động từ, sai giới từ, sai từ loại…). Đây chính là `ma_loi` của môn Anh |

---

## 3. Tài liệu GV gửi — đánh giá

### 3.1 Có gì

| Thành phần | Số lượng | Ghi chú |
|---|---|---|
| Bài tập bổ trợ **Form 2025**, Unit 1–12 (Global Success 9) | 12 unit × (bản HS + bản GV) .docx | Bản GV có đáp án tô màu và transcript bài nghe |
| Bài tập bổ trợ bản cũ, Unit 1–4 | 4 unit | **Đã bị bản Form 2025 thay thế** (bản cũ không có biển báo, điền thông báo, điền câu vào đoạn) |
| Từ vựng (bảng Word / loại từ / IPA / nghĩa) | **472 từ + 127 cụm** | 19–64 từ mỗi unit |
| Ngữ pháp | 1–3 điểm mỗi unit | Khớp danh sách ngữ pháp lớp 9 của CT GDPT 2018 |
| Câu trắc nghiệm | **khoảng 1.800** (đếm thô) | Ngoài ra còn khoảng 40–60 câu tự luận mỗi unit (chia động từ, word form, viết lại câu) |
| File nghe | 32 (21,5 MB) | Mỗi unit 2 bài: chọn A–D và Đúng/Sai |
| PDF "Collo Check T1" | 6 trang (Unit 1–6) | **Chỉ có ảnh, không có lớp chữ.** Dạng phiếu: cho IPA + hình → HS viết từ + nghĩa. Là mẫu **phiếu giấy**, không phải dữ liệu |

Mỗi unit có cấu trúc cố định:

- Từ vựng
- Ngữ pháp
- Nghe (2 bài)
- Ngữ âm (phát âm, trọng âm)
- Từ vựng & Ngữ pháp (trắc nghiệm, điền, đồng/trái nghĩa, word form)
- Giao tiếp
- Đọc (biển báo, thông báo, đoạn văn, đọc hiểu, điền câu)
- Viết (viết câu từ gợi ý, sắp xếp từ, viết lại câu, sắp xếp đoạn)

### 3.2 Khớp với 12 dạng đề Hà Nội

- **Có đủ:** phát âm · trọng âm · hoàn thành câu · giao tiếp · điền thông báo · điền đoạn văn · câu gần nghĩa · biển báo · đọc hiểu · điền câu vào đoạn · sắp xếp đoạn.
- **Thiếu hoặc lệch:**
  - *Câu chủ đề / mở–kết đoạn:* chưa thấy bài riêng.
  - *Viết câu từ gợi ý:* tài liệu có nhưng ở dạng **tự luận**, trong khi đề thi dạng **trắc nghiệm**.
- **Có thêm:** phần nghe (đề không thi), đồng/trái nghĩa đứng riêng.

### 3.3 Chất lượng — lướt Unit 1 đã thấy 4 câu hỏng

| Câu | Lỗi |
|---|---|
| Sắp xếp đoạn "banh mi", câu 1 | Phương án **A = B = C** (cùng là "c – e – a – b – d"); đáp án ghi B |
| "Do you have any tips on how ___ stronger neighborhood bonds?" | Phương án **B và D cùng là "to build"** |
| "Can you tell me ___ to join the local book club?" | Đáp án ghi *how*, nhưng *where* và *when* cũng đúng ngữ pháp và hợp nghĩa |
| "Let's decide ___ to organize the summer festival." | Đáp án ghi *where*, nhưng *what* cũng đúng |

Ngoài ra:

- Có lỗi đánh máy ("Lan will you join…", "tum up").
- PDF Collo Check đánh số sai: Unit 2 có 2 câu số 12; Unit 6 đánh lại từ 1 ở phần II.

⇒ Dạng lỗi "**nhiều đáp án cùng đúng**" là lỗi điển hình của câu trắc nghiệm tiếng Anh. **Không có phép tính nào để máy tự kiểm** như ở Toán. Phải dùng một giám khảo độc lập, được giao đúng việc "đi tìm đáp án đúng thứ 2", cộng người duyệt. Đây chính là luật cổng ghi của `spec-luong-kho.md`: không có biên bản kiểm thì không ghi.

### 3.4 Định dạng kỹ thuật (quyết định cách nhập)

- **Đáp án nằm trong ĐỊNH DẠNG**, không nằm trong chữ:
  - Đáp án = phương án được **tô màu**, và màu không thống nhất giữa các unit (U1 vàng, U9 xanh ngọc).
  - Câu phát âm: **phần gạch chân chính là đề bài**, cũng chỉ tồn tại ở dạng định dạng.
- **Số thứ tự câu** là đánh số tự động của Word; bóc chữ ra là mất.
- **Biển báo** là ảnh nhúng. **Transcript** bài nghe chỉ có trong bản GV.
- ⇒ Phải đọc **thẳng file .docx** (đọc được định dạng), **không đi qua PDF/OCR**. Đây là điểm ngược với Toán, nơi Word MathType buộc phải qua PDF. Ở Anh, Word lại là nguồn tốt nhất.

---

## 4. "Dễ hơn Toán" — đúng ở đâu, sai ở đâu

| Khâu | Toán | Anh | Kết luận |
|---|---|---|---|
| Đáp án | Khoảng 50% tài liệu không có đáp án ⇒ **giải bài là đường chính** | Bản GV có đáp án | **Dễ hơn** — không cần trạm giải |
| Vẽ hình | Ảnh cắt từ PDF không đạt, phải vẽ lại | Chỉ có ảnh biển báo | **Dễ hơn** |
| Chuyển sang trắc nghiệm | Phải sinh phương án nhiễu theo lỗi (form TN, điền ô) | Đề thi và tài liệu vốn đã là trắc nghiệm | **Dễ hơn** — luật "bổ trợ chỉ dùng trắc nghiệm" tự thoả |
| Hiển thị | LaTeX | Gạch chân, đoạn văn có chỗ trống đánh số, ảnh, (audio) | Ngang nhau — việc khác |
| **Bản đồ KP** | KP = "dạng bài", một chiều | KP ≠ dạng đề. Có **2 trục**: *điểm ngôn ngữ* × *dạng đề* | **Khó hơn** — xem §5 |
| Gán nhãn | 1 câu → 1 dạng | 1 câu thường chạm nhiều KP (ngữ pháp + từ vựng + ngữ cảnh) | **Khó hơn** — cần luật chọn "KP chính" |
| **Kiểm đáp án** | Tính lại bằng máy được | Lỗi "2 đáp án cùng đúng" chỉ có phán đoán mới bắt được | **Khó hơn** |
| Đo mastery | (HS × dạng), vài trăm dạng | Ngữ pháp/kỹ năng: như Toán. **Từ vựng: hàng nghìn mục và bị quên** | **Khó hơn** ở từ vựng |
| Sinh câu mới | Phải giải + kiểm | AI viết tiếng Anh rất tốt, nhưng dễ tạo câu 2 đáp án đúng | Dễ sinh, khó kiểm |

---

## 5. ~~Mô hình bản đồ đề xuất~~ — ĐÃ THAY bằng `spec-anh-ban-do-k9.md` (CEO 30/09: không bê khuôn Toán)

### 5.1 KP = điểm ngôn ngữ / kỹ năng, KHÔNG phải dạng đề

- GV Anh ở Việt Nam quen nghĩ theo "dạng bài": phát âm, word form, đồng nghĩa, điền thông báo… Nhưng đó là **hình thức câu hỏi**.
- Nếu lấy nó làm KP, bản đồ chỉ còn khoảng 15 ô. Mastery kiểu "điền đoạn văn 60%" không cho biết phải dạy lại cái gì.
  - Cùng một câu điền đoạn văn: có câu hỏi đại từ quan hệ, có câu hỏi giới từ, có câu hỏi collocation.
- **Đề xuất nhánh** (tầng cao nhất của cây, theo ADR-mon §3):

| Nhánh | Ví dụ KP |
|---|---|
| **Ngữ âm** | Đuôi -ed; đuôi -s/-es; nguyên âm *a/o/u/ea*; trọng âm từ 2 âm tiết; trọng âm theo hậu tố |
| **Từ vựng** | Cấu tạo từ: hậu tố danh từ hoá -tion/-ment/-ness; cụm động từ *look/get/take*; collocation *make/do*; từ vựng chủ điểm Unit n |
| **Ngữ pháp** | Mệnh đề quan hệ: *whose*; câu điều kiện loại 1 + động từ tình thái; *wish* + quá khứ đơn; mạo từ; lượng từ; so sánh kép |
| **Giao tiếp** | Đáp lời mời; khen–đáp lời khen; xin/cho lời khuyên; đồng ý–phản đối |
| **Đọc** | Ý chính/tiêu đề; chi tiết; quy chiếu đại từ; từ trong ngữ cảnh; suy luận; câu NOT true; biển báo |
| **Viết (liên kết)** | Trình tự đoạn và từ nối; câu chủ đề; biến đổi câu tương đương; nối câu |
| *(sau)* Nghe · Nói | — |

- **Quy mô khối 9 (ước lượng, chưa đếm):**
  - Ngữ pháp THCS khoảng 40–60 điểm (CT liệt kê mỗi lớp khoảng một chục mục). Phải có **cả lớp 6–8**: 8 câu ngữ pháp của đề thi hỏi so sánh, mạo từ, lượng từ, là những điểm không nằm trong danh sách lớp 9.
  - Ngữ âm khoảng 15–25 luật.
  - Kỹ năng đọc khoảng 7.
  - Giao tiếp khoảng 10–15 chức năng.
  - Từ vựng: 12 bộ theo unit + khoảng 10–15 mẫu cấu tạo từ.

### 5.2 Dạng đề là THUỘC TÍNH của câu, không phải KP

- Mỗi câu mang 1 nhãn dạng đề (12 dạng Hà Nội + các dạng luyện tập).
- Từ đó có **góc nhìn thứ 2** miễn phí: "em yếu dạng *điền câu vào đoạn*". Đây là ngôn ngữ phụ huynh và GV hiểu ngay.
- Góc nhìn này cũng dùng để **dựng đề thi thử đúng ma trận** 40 câu.

### 5.3 Mỗi câu có 1 KP CHÍNH ⇒ giữ nguyên engine (HS × KP) của Toán

- **Phép thử chọn KP chính:** *"HS chọn sai câu này thì sai vì không biết cái gì?"*. Câu trả lời thường chính là cái các phương án nhiễu nhắm vào.
- KP phụ chỉ là nhãn tra cứu, giai đoạn 1 **không tính vào mastery**.
- Như vậy `fn_mastery_cells` và bổ trợ yếu chạy **y hệt Toán**, đúng luật đối xứng.
- Q-matrix đầy đủ (1 câu tính cho nhiều KP) để sau, khi có đủ dữ liệu.

### 5.4 Ngữ liệu chung (testlet) là thực thể mới

- Đoạn văn, thông báo, biển báo, (audio + transcript) là **cha**; 4–6 câu con trỏ tới nó.
- App hiện nguyên cụm, **không xáo** (đúng luật "giấy và app giống hệt").
- Ngữ liệu có nhãn riêng: chủ đề, độ dài, mức CEFR.
- Toán đã có tiền lệ gần giống (Hình: bài → ý, `mo_hinh_id`), nhưng Đại thì chưa.

### 5.5 Từ vựng hai tầng

- **Tầng bản đồ:** KP "Từ vựng Unit n" và các mẫu cấu tạo từ, đo như mọi KP khác.
- **Tầng từng từ (làm sau):** sổ (HS × từ) có ôn giãn cách (Half-Life Regression), tách **nhận ra** với **tự dùng được**.
  - Phiếu Collo Check (nhìn IPA → viết từ) là kiểu đo "tự dùng được", dùng trên giấy.
  - Trên app theo luật chỉ trắc nghiệm thì đo "nhận ra".

---

## 6. Cần THÊM gì so với Toán

**Tri thức**
- Bản đồ khối 6–9 theo §5: nhánh → chủ điểm/unit → KP, có nhãn CEFR và **thứ tự unit** lấy từ Global Success.
- Hồ sơ KP (giải thích ngắn, ví dụ, lỗi hay gặp).
- Danh mục mã lỗi theo CLC error coding.
- **GV Anh làm chủ học thuật**, duyệt bản đồ lẫn câu (tương đương B6 của Toán).

**Dây chuyền kho** (theo khung trạm T0–T8 của `spec-luong-kho.md`, bỏ các trạm không cần)
- Trạm đọc **.docx có định dạng**: màu tô = đáp án, gạch chân = đề phát âm, ảnh nhúng, gắn transcript với audio.
- Trạm gán nhãn: KP chính + dạng đề + ngữ liệu.
- **Trạm kiểm "tìm đáp án thứ 2"**: giám khảo độc lập. Đây là trạm quan trọng nhất của môn Anh.
- Giải thích ngắn "vì sao chọn đáp án này". Tài liệu GV không có; AI viết được, nhưng vẫn phải qua kiểm.
- (Sau) Sinh thêm câu cho KP thiếu câu.

**Đo lường**
- Góc nhìn theo dạng đề (§5.2).
- (Sau) sổ từ + ôn giãn cách.
- (Sau) độ khó từng câu theo kiểu Elo/IRT, dựa trên nền Elo theo môn đã có.

**App học sinh**
- Hiện **đoạn văn có chỗ trống đánh số**, gạch chân, ảnh biển báo.
- Màn **thi thử 40 câu / 60 phút** đúng ma trận Hà Nội.
- (Sau) trình phát audio. Hiện `src/` **không có** thẻ `<audio>` nào.

**Hạ tầng code** (việc kỹ thuật, CTO tự làm theo R2 — liệt kê để CEO thấy khối lượng)
- **Gom registry môn→bảng về một nguồn.** Hiện đang tản ở:
  - `src/lib/tailieu.ts:13` (`khoCuaMon`) và `src/lib/kho/api.ts:1304` (`khoTbls`): đều mặc định về `dai`;
  - các hàm SQL `_kho_*_tbl`, `fn_giaibai_mon`, `_de_thi_kho`, `_troly_ten_dang`: "không phải KHTN thì là Toán";
  - union cố định 3 bảng Toán trong `fn_nhiem_vu_hoan_thanh` và `fn_thanh_tuu_thang`;
  - 7 hằng số danh sách môn nằm rải ở các màn.
  - Đây là "Lệch 2" của ADR-mon, đã biết từ 29/06 mà chưa làm.
- **Nhãn môn lệch nhau:** `'Tiếng Anh'` (DB, `mon.ts`) và `'Anh'` (TKB, Phân công, Lớp, trợ lý…) ⇒ thống nhất về một nhãn.
- Tiền tố mã dạng **`E`** (đã chốt trong HANDOFF, chưa làm). `fn_mastery_cells` gom theo `ma_dang` mà không có `mon`, nên mã phải duy nhất xuyên môn.
- Nới CHECK của `kho_kiem_lo.kho`, `kho_sua_log.mon`, `kho_doi_dang_log.mon` (hiện chỉ nhận `dai/hgt/khtn`).
- **Đề thi đang là `toan_de_thi`**, với 1 cột FK riêng cho mỗi nhánh. Muốn làm đề Anh thì phải tổng quát hoá theo môn.

---

## 7. Cái KHÔNG cần (bớt được so với Toán)

- Trạm **giải bài AI** và lời giải chi tiết: chỉ cần giải thích ngắn.
- **Vẽ hình**, **form trắc nghiệm / điền ô**, LaTeX.
- **Nghe ở giai đoạn 1**: đề vào 10 không thi nghe. Nghe chỉ cần cho chuyên Anh, HSG, Cambridge.
- Chấm trả lời ngắn và chuẩn hoá đáp án: giai đoạn 1 chỉ có trắc nghiệm.
  - ⚠ Bộ chuẩn hoá hiện tại (`smartNormalize` / `fn_tln_normalize`) là kiểu Toán: bỏ đơn vị, bỏ khoảng trắng. **Không được** áp nguyên cho tiếng Anh khi sau này có câu gõ tay.

---

## 8. Câu hỏi cho CEO (R1 — đích / hiện tại)

1. **Đích đợt 1:** chỉ **khối 9 thi vào 10 hệ thường** (đề xuất: thị trường lớn nhất, tài liệu có sẵn, đề 100% trắc nghiệm)? Hay rộng hơn ngay: khối 6–9 / chuyên Anh?
2. **Hiện tại:**
   - Trung tâm đang có bao nhiêu lớp và HS Anh?
   - **GV Anh nào đủ sức làm chủ học thuật** (duyệt bản đồ + duyệt câu)?
   - Bộ tài liệu này do GV đó tự soạn hay sưu tầm? Trong tên file có chữ "Giaoandethitienganh info".
3. **Chốt nguyên tắc KP = điểm ngôn ngữ, dạng đề = thuộc tính** (§5.1–5.2). Cần CEO và GV Anh cùng gật, vì GV quen nghĩ theo dạng bài.
4. **Nghe:** đồng ý **để sau** giai đoạn 1 không? (Đề vào 10 không thi nghe.)

---

## 9. Lộ trình đề xuất — chưa làm gì trước khi CEO gật §8

| Pha | Việc | Ra được gì |
|---|---|---|
| **P0 — Nền** | Gom registry môn (đụng cả Toán, phải làm cẩn thận). Cùng GV Anh chốt khung bản đồ khối 9 từ CT GDPT 2018 + 12 unit + 12 dạng đề | Thêm Anh không còn rơi vào bảng Toán; có bản đồ khung |
| **P1 — Kho khối 9** | Nhập 12 unit Form 2025 qua cổng kiểm (máy tìm đáp án thứ 2 + GV duyệt) | Kho chuẩn khối 9; **đếm được tỉ lệ câu hỏng thật** của tài liệu |
| **P2 — App** | Luyện theo KP (bổ trợ trắc nghiệm chạy ngay) + đề thi thử 40 câu đúng ma trận + màn theo dõi 2 góc (KP / dạng đề) | HS khối 9 luyện được trên app |
| **P3 — Mở rộng** | Khối 6–8, sổ từ + ôn giãn cách, nghe (audio), chuyên Anh/HSG | |

---

## 10. Nguồn

**Đề thi vào 10 Hà Nội**
- [Dân trí — đáp án đề minh hoạ 2025](https://dantri.com.vn/giao-duc/goi-y-dap-an-mon-tieng-anh-de-minh-hoa-thi-vao-10-cua-ha-noi-nam-2025-20240829141242538.htm)
- [Sở GD Hà Nội — công bố đề và đáp án 2025](https://hanoi.edu.vn/phong-quan-ly-thi-va-kdcl/ha-noi-cong-bo-de-thi-va-dap-an-cac-mon-toan-ngu-van-ngoai-ngu-khong-chuyen-ky/ctmb/552/16329)
- [LangGo — đề 2025](https://langgo.edu.vn/de-thi-tieng-anh-vao-10-ha-noi-2025) · [Loigiaihay — đề 2025](https://loigiaihay.com/de-thi-vao-10-mon-anh-ha-noi-2025-co-dap-an-va-loi-giai-chi-tiet-a186049.html) · [Loigiaihay — đề 2026](https://loigiaihay.com/de-thi-vao-10-mon-anh-ha-noi-2026-co-dap-an-va-loi-giai-chi-tiet-a194304.html)
- [VnExpress — 24 mã đề 2026](https://vnexpress.net/24-ma-de-tieng-anh-thi-vao-lop-10-o-ha-noi-nam-2026-chi-tiet-kem-dap-an-5080013.html) · [Đời sống & Pháp luật — Sở nói về đề 2026](https://doisongphapluat.com.vn/so-gd-dt-ha-noi-noi-gi-ve-de-thi-lop-10-thpt-2026-a722993.html)
- [VTV — Ngoại ngữ là môn thứ 3 năm học 2026–27](https://vtv.vn/ha-noi-chot-ngoai-ngu-la-mon-thi-thu-ba-vao-lop-10-nam-hoc-20262027-100260129185846256.htm) · [Dân trí 08/09/2026 — chỉ đạo tuyển sinh 2027–28](https://dantri.com.vn/giao-duc/chi-dao-moi-nhat-cua-ha-noi-ve-tuyen-sinh-lop-10-nam-hoc-2027-2028-20260908151509896.htm)
- [Nhân Dân — các dạng bài mới](https://nhandan.vn/de-tieng-anh-thi-lop-10-ha-noi-co-cac-dang-bai-moi-tiem-can-cach-danh-gia-hien-dai-post885262.html)

**Các kỳ thi khác**
- [Nhân Dân — 4 trường chuyên Hà Nội](https://nhandan.vn/tuyen-sinh-vao-lop-10-bon-truong-chuyen-cua-ha-noi-nam-hoc-2025-2026-post861560.html) · [TAK12 — phân tích đề chuyên Anh](https://tak12.com/news/n/1755/phan-tich-de-thi-vao-lop-10-chuyen-anh-cua-so-gddt-ha-noi-qua-cac-nam)
- [FLSS — chuyên Ngoại ngữ 2025](https://flss.vnu.edu.vn/thong-bao-ve-viec-tuyen-sinh-lop-10-truong-thpt-chuyen-ngoai-ngu-nam-2025/)
- [Phổ điểm THPT 2025](https://chinhsachcuocsong.vnanet.vn/pho-diem-thi-tot-nghiep-thpt-2025-hon-38-thi-sinh-co-diem-duoi-trung-binh-mon-tieng-anh/64643.html) · [IZONE — cấu trúc đề THPT 2025](https://www.izone.edu.vn/blog/cau-truc-moi-de-thi-tieng-anh-thpt-quoc-gia-2025/)
- [Cambridge Key — format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/format/) · [Cambridge Preliminary — format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/preliminary/format/)

**Chương trình và SGK**
- [CT GDPT 2018 môn Tiếng Anh (PDF)](https://dienbien.edu.vn/uploads/doi-moi-chuong-trinh-gdpt/22ct_tieng-anh-3_12.pdf)
- [Báo Chính phủ — SGK thống nhất từ 2026–27 (QĐ 3588)](https://baochinhphu.vn/ket-noi-tri-thuc-voi-cuoc-song-la-sach-giao-khoa-thong-nhat-toan-quoc-tu-nam-hoc-20262027-10225122622052997.htm) · [NXBGD — Global Success](https://nxbgd.vn/bai-viet/global-success-bo-sach-giao-khoa-tieng-anh-cua-nguoi-viet-nam)

**Khung chuẩn quốc tế**
- [CEFR-J download](https://www.cefr-j.org/download_eng.html) · [English Profile (EGP/EVP)](https://en.wikipedia.org/wiki/English_Profile) · [Pearson GSE — cho nhà giáo dục](https://www.pearson.com/languages/why-pearson/the-global-scale-of-english/educators.html)

**Mô hình đo**
- [Half-Life Regression (ACL 2016)](https://aclanthology.org/P16-1174/) · [Duolingo Birdbrain (IEEE Spectrum)](https://spectrum.ieee.org/duolingo)
