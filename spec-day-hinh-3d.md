# DẠY HÌNH 3D — mô hình không gian tương tác cho bài tập Toán (tài liệu tổng)

> **Đọc file này TRƯỚC khi dựng bất kỳ mô hình 3D nào cho bài tập Toán** (khối tròn xoay, khối tính bằng cắt lát, thiết diện…).
> Mở 09/10/2026 tối. **Trạng thái (10/10 rạng sáng): BẢN THỬ 1 của Câu 43 đã dựng** (`toan-site/the-tich/coc-nghieng.html`, §D.4) theo các *đề xuất mặc định* ở Phần B —
> **Thùy CHƯA chốt B1–B6** (Thùy nói "làm tiếp thôi" khi chưa trả lời) ⇒ xem bản thử rồi chốt/sửa. Chưa làm bài thứ hai.
> Cấu trúc: **Phần A** đã chốt · **Phần B** câu còn mở · **Phần C** kho bài đã giải · **Phần D** bài mẫu đề xuất · **Phần E** đứng trên vai ai · **Phần F** nhật ký quyết định.
> Nguồn đề + hình đã chép vào repo: [`docs/hinh-3d/`](docs/hinh-3d/) (không phụ thuộc ổ E: của máy công ty).

---

## 0. Tóm tắt một màn

- **Đích (Thùy 09/10):** bài tập lớp 12 *ứng dụng tích phân tính thể tích* — vẽ hình các bài này trên bảng **rất khó**. Dựng thành **file HTML hình không gian, xoay được, thao tác được**, để HS hiểu rõ hơn.
- **Nguồn đợt đầu:** NBV *12-18. Ứng dụng TP tính diện tích – thể tích*, file **F. Bài tập nâng cao**, Dạng 2. Trong đó có **10 bài thật sự 3D** (câu 43–50, 52, 53).
- **Đã làm (09/10):** đọc + tự giải cả 10 bài, kiểm bằng tích phân số / Monte Carlo — **10/10 khớp**; bắt được **2 lỗi đáp số của nguồn** (§C.11).
- **Bài mẫu đề xuất: Câu 43 — cốc nước nghiêng** (§D). Bài mẫu thứ hai (loại tròn xoay) nếu cần: **Câu 48**.
- **Đã dựng (10/10):** bản thử 1 Câu 43 — 6 bước, xoay được, cắt lát 3 hướng, chồng lát; soát trên máy 4 cỡ màn, 0 lỗi console (§D.4).
- **Việc kế tiếp:** Thùy xem bản thử + chốt B1–B6 → sửa theo góp ý → soi TV/iPad thật → duyệt → mới tính khuôn chung cho 9 bài còn lại.

## 1. Nguồn & cách trích lại

| Mục | Giá trị |
|---|---|
| File gốc | `E:\BK ACADEMY\Tài liệu tham khảo\K12\TOAN 12 NBV NEW FULL\TOAN 12 NBV NEW FULL\12-18. UNG DUNG TP TINH DIEN TICH-THE TICH\12-18. UNG DUNG TP TINH DIEN TICH-THE TICH\F. BAI TAP NANG CAO.docx` (máy công ty). Cùng thư mục có A. Lý thuyết · B. Tự luận · C. TN · D. Đúng/sai · E1–E3. Trả lời ngắn — bản `- CH` = chỉ đề |
| Bản trích trong repo | [`docs/hinh-3d/nguon-12-18F-dang2.md`](docs/hinh-3d/nguon-12-18F-dang2.md) — Dạng 2 nguyên văn, công thức LaTeX · hình ở [`docs/hinh-3d/hinh/`](docs/hinh-3d/hinh/) |
| Lệnh trích | `node scripts/kho/mathtype-thu/doc-docx.mjs "<file.docx>" --ra <thư mục>` — công thức trong file là **MathType OLE** (không phải OMML), `scripts/docx-doc.mjs` đọc ra rỗng. 1321/1327 công thức đọc được |
| Hình EMF/WMF | `scripts/anh/wmf_sang_png.ps1` (gọi qua `-Command`, xem đầu `scripts/anh/docx_trich.mjs`) |
| Cấu trúc file | **Dạng 1** – diện tích: câu 1–42 (phẳng, không cần 3D) · **Dạng 2** – thể tích: câu 43–56, nhưng **51, 54, 55, 56 là bài diện tích phẳng bị xếp nhầm** |

---

## Phần A — ĐÃ CHỐT

### A1. Sản phẩm (Thùy 09/10)
- Mỗi bài = **một file HTML hình không gian**: **xoay được, thao tác được**. Mục đích: HS *thấy* được khối mà bảng/giấy không vẽ nổi.

### A2. Cách làm (Thùy 09/10)
- Claude đọc đề, giải một số bài, **chọn 1 bài làm mẫu → bàn với Thùy → mới dựng**. Mẫu chưa duyệt thì chưa làm bài thứ hai.

---

## Phần B — CÂU CÒN MỞ (Thùy chưa trả lời — bản thử 1 đang chạy theo cột "Đề xuất của Claude")

| # | Câu hỏi | Đề xuất của Claude | Vì sao quan trọng |
|---|---|---|---|
| **B1** | **Ai dùng, ở đâu?** GV chiếu TV bấm từng bước, hay HS tự mở xoay trên iPad/ở nhà? | **GV chiếu TV là chính** (khớp `spec-toan-du-hanh.md`: "học = cả lớp nhìn TV"), cùng file vẫn chạy được trên iPad cho HS tự xoay | Quyết giao diện: *từng bước có dẫn* (nút to, GV bấm) hay *tự khám phá* |
| **B2** | **Mức độ:** chỉ mô hình xoay + cắt, hay kèm lời giải từng bước gắn vào mô hình? | **Kèm** — công thức S(x) nhảy số theo thanh trượt, tổng lát tiến về tích phân. Giá trị lớn nhất là nối *hình ↔ tích phân*, không phải hình đẹp | Quyết khối lượng mỗi bài (×2–3 lần) |
| **B3** | **Khuôn chung hay từng bài riêng?** | Làm **tay** Câu 43 trước; duyệt xong mới rút khuôn 3 động cơ: *cắt lát S(x)* · *tròn xoay* · *thiết diện*. Khi có khuôn, 9 bài còn lại = khai báo hình + số | Làm khuôn trước khi có mẫu duyệt = đoán yêu cầu |
| **B4** | **Đặt ở đâu?** | Mục mới trong `toan-site/` (cùng tên miền toan.bkacademy.edu.vn), vd `toan-site/the-tich/cau-43.html`. **Không** theo nhịp du hành (trạm → bay → trả lời) — đây là mô hình cho *bài tập*, không phải bài giảng | Domain, mục lục, deploy |
| **B5** | **Bài mẫu:** duyệt Câu 43, hay chọn bài khác? | Câu 43 (lý do §D.1) | — |
| **B6** | **Có đo / ghi DB không?** | Chưa — demo như bài du hành | Nếu đo thì phải theo `mon` + luật §1.6 CLAUDE.md |

---

## Phần C — KHO 10 BÀI (đã giải + kiểm số)

### C.0 Phân loại

| Loại | Câu | Cách tính | Cái khó HS gặp → 3D giúp gì |
|---|---|---|---|
| **1. Cắt lát S(x)** (không tròn xoay) | 43 · 44 · 47 | V = ∫ S(x) dx, S(x) = diện tích lát cắt | **Khó tưởng tượng nhất**: lát cắt có hình gì? → kéo thanh trượt thấy lát chạy dọc khối |
| **2. Tròn xoay** | 45 · 46 · 48 · 49 · 50 · 52 | V = π∫ r² (đĩa) hoặc π∫ (R² − r²) (vành khăn) | Dễ hơn, trừ **miền vắt qua trục** (48, 49) và **vành khăn có lỗ** (46) → quay từng phần, thấy phần nào bị nuốt |
| **3. Thiết diện** | 53 | Diện tích mặt cắt (định lý hình chiếu) | Mặt phẳng nghiêng cắt trụ ra hình gì, ra khỏi trụ ở đâu |

Bảng đáp số (đã kiểm: tự giải tay + tích phân số Simpson / Monte Carlo 2·10⁶ điểm — chạy lại: `node docs/hinh-3d/kiem-dap-so.mjs`):

| Câu | Khối | Đáp số |
|---|---|---|
| 43 | Cốc nghiêng → nước thành cái nêm | **240 cm³** |
| 44 | Mái vòm Sport Hub | (π − 2)·101 250 ≈ **115 586 m³** |
| 45 | Mũ Noel | **2500π/3** ≈ 2618 cm³ |
| 46 | Hình vuông + 4 nửa đường tròn quay quanh AC | **32π/3 + 4π²** ≈ 72,99 |
| 47 | Giao 2 khối ¼ trụ | **2a³/3** |
| 48 | Miền parabol – đường thẳng vắt qua Ox | **836π/15** ≈ 175,09 |
| 49 | Miền vắt qua Ox | **21π/5** |
| 50 | Thùng elip | **1416π/25** ≈ 177,9 lít |
| 52 | Thùng parabol ×7 | 82π/375 m³ ≈ 687 lít/thùng · **M = 144 262** (nguồn ghi sai 144 270) |
| 53 | Thiết diện trụ – mặt phẳng 60° | **(4π/3 + √3/2)R²** (nguồn Cách 1 sai) |

### C.1 Câu 43 — Cốc nước nghiêng (loại 1) · hình: `image969` (cốc đứng), `image970` (cốc nghiêng), `image971` (cái nêm)
- **Đề:** cốc trụ, bán kính đáy R = 6 cm, cao h = 10 cm, có nước. Nghiêng cốc tới lúc nước vừa chạm miệng cốc thì mép mặt nước ở đáy trùng đúng một **đường kính đáy**. Tính thể tích nước.
- **Giải:** nước = khối cắt từ trụ bởi mặt phẳng qua đường kính đáy và điểm miệng cốc (**móng guốc Archimedes**), tanα = h/R.
  - *Cách 1* — lát ⊥ đường kính (x ∈ [−R; R]): tam giác vuông, hai cạnh góc vuông √(R² − x²) và √(R² − x²)·h/R ⇒ S(x) = h(R² − x²)/(2R) ⇒ V = 2R²h/3 = **240**.
  - *Cách 2* — lát ⊥ hướng còn lại (x ∈ [0; 10] theo chiều cao): **hình viên phân**, S(x) = 36·arccos(1 − x/10) − 36(1 − x/10)√(1 − (1 − x/10)²) ⇒ ∫₀¹⁰ S = **240**.
  - Hai hướng cắt, hai hình lát khác hẳn, cùng 240 ⇒ minh hoạ trực tiếp **nguyên lý Cavalieri**.
- **Số phụ cho mô hình:** nước khi cốc đứng cao h₀ = 240/(36π) ≈ **2,122 cm**; cốc rỗng 360π ≈ 1131 cm³ ⇒ nước ≈ 21% cốc. Góc nghiêng cuối α = arctan(10/6) ≈ **59,04°**.

### C.2 Câu 44 — Mái vòm Sport Hub (loại 1) · hình: `image1014/1015` (ảnh thật), `image1016`, `image1017/1018`
- **Đề:** nền sân là elip trục lớn 150 m, trục bé 90 m. Cắt bởi mặt phẳng ⊥ trục lớn, cắt elip tại M, N ⇒ thiết diện luôn là **phần hình tròn tâm I giới hạn bởi dây MN, góc MIN = 90°** (hình viên phân). Tính thể tích không gian dưới mái.
- **Giải:** (E): x²/75² + y²/45² = 1 ⇒ MN = 90√(1 − x²/75²), R = MN/√2 ⇒ S(x) = (π/4 − 1/2)R² = (π − 2)·(2025/2)(1 − x²/75²) ⇒ V = ∫₋₇₅⁷⁵ S = (π − 2)·101 250 ≈ **115 586 m³**.
- **3D:** mái vòm dựng từ các hình viên phân co dần về hai đầu; ảnh thật đặt cạnh mô hình.

### C.3 Câu 45 — Mũ Noel (loại 2) · hình: `image1029`, `image1030`
- **Đề:** khối tròn xoay; mặt cắt qua trục: OO' = 5, OA = 10, OB = 20, cung AB là parabol đỉnh A.
- **Giải:** trụ r = 10, h = 5 ⇒ V₁ = 500π. Phần trên: quay miền x = 10 − √(5y), 0 ≤ y ≤ 20 quanh Oy ⇒ V₂ = π∫₀²⁰ (10 − √(5y))² dy = 1000π/3. V = **2500π/3**. (Kiểm chéo bằng vỏ trụ: 2π∫₀¹⁰ x·(x − 10)²/5 dx = 1000π/3.)
- **3D:** cho mặt cắt quay dần quanh trục để "mọc" ra mũ.

### C.4 Câu 46 — Hình vuông + 4 nửa đường tròn quay quanh AC (loại 2) · hình: `image1042`, `image1047`
- **Đề:** hình vuông ABCD cạnh 2√2, phía ngoài vẽ 4 nửa đường tròn đường kính là các cạnh. Quay cả hình quanh AC.
- **Giải:** O = tâm, A(0; 2), B(2; 0), trục quay Oy. Hình đối xứng qua AC và BD ⇒ V = 2(V₁ + V₂), chỉ xét góc phần tư I. Đường tròn đường kính AB: (x − 1)² + (y − 1)² = 2 (đi qua O).
  - 0 ≤ y ≤ 2: lát là **đĩa** bán kính 1 + √(2 − (y − 1)²) ⇒ V₁ = 16π/3 + 2π + π².
  - 2 ≤ y ≤ 1 + √2: lát là **vành khăn** giữa hai nhánh cung ⇒ V₂ = π∫ 4√(2 − (y − 1)²) dy = π² − 2π.
  - V = **32π/3 + 4π²**. (Nguồn: 3 công thức trung gian không đọc được — tự tính lại, khớp đáp số cuối của nguồn.)
- **3D:** điểm HS hay sai = phần trên y = 2 tạo **lỗ rỗng ở giữa** (vành khăn), không phải đĩa đặc → mô hình bổ đôi cho thấy lỗ.

### C.5 Câu 47 — Giao của 2 khối ¼ trụ (loại 1) · hình: `image1092`, `image1093`
- **Đề:** (H) = phần chung của hai khối ¼ trụ bán kính a, hai trục vuông góc. Tính V(H).
- **Giải:** lát ⊥ Ox tại x ∈ [0; a] là **hình vuông** cạnh √(a² − x²) ⇒ V = ∫₀ᵃ (a² − x²) dx = **2a³/3** (= 1/8 khối Steinmetz 16a³/3).
- **3D:** hai ¼ trụ trượt vào nhau, tách phần chung, lát vuông. **Mở rộng đáng làm:** đặt ⅛ hình cầu nội tiếp vào — mỗi lát tròn nội tiếp lát vuông, tỉ số luôn π/4 ⇒ V(⅛ cầu) = π/4 · 2a³/3 = πa³/6 ⇒ ra công thức thể tích cầu (cách của Tổ Hằng, §E).

### C.6 Câu 48 — Miền vắt qua trục, quay quanh Ox (loại 2) · hình: `image1109`, `image1110`
- **Đề:** (H) giới hạn bởi f(x) = x² − 8x + 12 và g(x) = 6 − x (cắt nhau tại x = 1, x = 6). Quay quanh Ox.
- **Giải:** f < 0 trên (2; 6) ⇒ miền **vắt qua trục**. Mỗi lát: nếu đoạn [f; g] nằm một phía trục ⇒ vành khăn; nếu chứa trục ⇒ đĩa bán kính max(|f|, |g|). −f > g ⇔ 3 < x < 6.
  V = π[∫₁² (g² − f²) + ∫₂³ g² + ∫₃⁶ f²] = **836π/15**.
- **Bẫy đắt giá:** áp bừa π∫₁⁶ (g² − f²) dx ra **đúng 0** (vì ∫₁⁶ g² = ∫₁⁶ f² = 125/3) — vô lý tức thì. Mô hình: quay riêng phần trên trục và phần dưới trục (2 màu) → thấy phần dưới lật lên, chồng/nuốt phần trên; chỉ bán kính lớn hơn mới tính.
- (Nguồn ghi "π∫₁²(x² − 8x + 12)dx" thiếu bình phương — giá trị 113π/15 đúng là của ∫f², chỉ lỗi gõ.)

### C.7 Câu 49 — Miền vắt qua trục (loại 2) · hình: `image1123`, `image1126`
- **Đề:** (H) giới hạn bởi y = x² + 1, y = −x − 1, x = −1, x = 1; quay quanh Ox.
- **Giải:** hai đường ở hai phía trục ⇒ lát là đĩa bán kính max(x² + 1, x + 1): [−1; 0] lấy x² + 1, [0; 1] lấy x + 1 ⇒ V = 28π/15 + 7π/3 = **21π/5**. Áp bừa vành khăn ra 16π/15 (sai).

### C.8 Câu 50 — Thùng rượu đường sinh elip (loại 2) · hình: `image1144`, `image1145`
- Elip trục lớn 10 dm, trục bé 6 dm, hai đáy cách nhau 8 dm ⇒ quay y = 3√(1 − x²/25), x ∈ [−4; 4] ⇒ V = 9π∫(1 − x²/25) = **1416π/25 ≈ 177,9 lít**.

### C.9 Câu 52 — Thùng rượu đường sinh parabol (loại 2) · hình: `image1179`, `image1181`
- Bán kính hai đáy 40 cm, giữa 50 cm, dài 100 cm ⇒ f(x) = −0,4x² + 0,5 (m) ⇒ V = π∫ f² dx trên [−0,5; 0,5] = **82π/375 m³ ≈ 686,96 lít**/thùng.
- 7 thùng × 30 nghìn/lít = 45 920π ≈ 144 261,9 nghìn ⇒ **M = 144 262**. Nguồn làm tròn 687 lít **trước** rồi nhân ⇒ 144 270 (sai).
- 50 + 52 đi cặp: cùng "thùng", khác đường sinh → một mô hình có nút đổi elip ↔ parabol.

### C.10 Câu 53 — Thiết diện trụ bởi mặt phẳng nghiêng 60° (loại 3) · hình: `image1201`, `image1224`
- **Đề:** trụ đáy (O; R), (O'; R), OO' = 4R. Trên (O; R) lấy A, B với AB = **R√3** (đề ghi nhầm a√3). Mặt phẳng (P) qua A, B, cắt đoạn OO', tạo với đáy 60° ⇒ thiết diện là một phần elip. Tính diện tích.
- **Giải:** khoảng cách O tới AB = R/2. Mặt phẳng lên cao nhất 3√3R/2 ≈ 2,6R < 4R ⇒ ra khỏi trụ ở **thành bên**, không chạm đáy trên. Hình chiếu thiết diện xuống đáy = phần hình tròn phía xa dây AB: S = 2∫ √(R² − x²) dx trên [−R/2; R] = (2π/3 + √3/4)R². Thiết diện S' = S/cos 60° = **(4π/3 + √3/2)R²**.
- **3D:** kéo góc nghiêng, thấy thiết diện đổi từ elip nguyên sang elip bị cụt; bóng chiếu xuống đáy + công thức S' = S/cosφ.

### C.11 Lỗi của file nguồn (bộ đọc đúng, tác giả sai — đối chiếu bằng tính lại độc lập)
1. **Câu 52:** M = 144 270 ⇒ đúng **144 262** (làm tròn sớm).
2. **Câu 53:** Cách 1 sai hệ số tích phân (viết I = (2π/3 + √3/8)R, đúng (2π/3 + √3/4)R) ⇒ ra (4π/3 + √3/4)R², **mâu thuẫn Cách 2** ngay dưới; Cách 2 đúng. Đề "AB = a√3" ⇒ **R√3**.
3. **Câu 45:** cuối lời giải có dòng "Ghi chú… trường PTTH Quảng Xương… dấu bằng xảy ra" — lạc từ bài khác.
4. **Câu 48:** thiếu bình phương trong ∫f (lỗi gõ, giá trị đúng).
5. **Dạng 2** chứa 4 bài diện tích phẳng (51, 54, 55, 56).

---

## Phần D — BÀI MẪU ĐỀ XUẤT: Câu 43 (cốc nghiêng)

### D.1 Vì sao chọn
1. **Loại khó tưởng tượng nhất** (cắt lát, không tròn xoay) — cái nêm nằm trong khối trụ đang nghiêng, bảng không vẽ nổi.
2. **Có cảnh mà bảng không làm được:** nghiêng cốc từ từ, nước đổi hình từ lớp mỏng 2,12 cm thành cái nêm, **thể tích giữ nguyên**.
3. **Hai cách giải của nguồn = hai hướng cắt**, hai hình lát khác hẳn, cùng 240 → thấy tận mắt nguyên lý Cavalieri.
4. Số đẹp (240), kiểm dễ.
- Mẫu thứ hai nếu cần (loại tròn xoay): **Câu 48** — bẫy "công thức vành khăn ra 0".

### D.2 Kịch bản (nháp — chờ B1/B2)
1. **Cốc đứng có nước** (h₀ ≈ 2,12). Nút **"Nghiêng"** → hoạt cảnh nghiêng, mặt nước luôn nằm ngang, thể tích = 240 suốt; dừng đúng lúc nước chạm miệng và mép nước trùng đường kính đáy (α ≈ 59°).
2. **Nhấc khối nước ra**, xoay tự do. Nút **"Góc nhìn sách"** đưa máy quay về đúng góc vẽ SGK (`image971`), **nét khuất vẽ đứt** — nối hình 3D với hình trên giấy.
3. **Cắt lát:** thanh trượt x chạy dọc đường kính, lát tam giác vuông tô màu; bên cạnh S(x) = ½(36 − x²)·10/6 nhảy số. Nút **"Chồng lát"** 4 → 8 → 16 → 64 lát, tổng tiến về 240 (tổng Riemann → tích phân).
4. **Đổi hướng cắt** (Cách 2): lát hình viên phân, vẫn ra 240.
- Tuỳ chọn: so khối nước với cả cốc (240 / 360π ≈ 21%).

### D.3 Ghi chú kỹ thuật (đề xuất, chưa chốt)
- **Thư viện:** three.js **r128** từ cdnjs — giống `toan-site/tam-giac-bang-nhau.html` (một file HTML, không build).
- **Hoạt cảnh nghiêng giữ thể tích:** gọi θ = góc mặt nước với đáy cốc. Khi tanθ ≤ h₀/R (θ ≤ **19,48°**) mặt nước chỉ cắt thành cốc ⇒ V = πR²·(độ cao mặt nước tại trục) ⇒ độ cao tại trục giữ nguyên 2,122. Sau 19,48° mặt nước cắt đáy theo một dây ⇒ tìm mức nước bằng chia đôi trên V(θ, mức) = 240 (V tính bằng tích phân số các lát). Tới θ = α dây thành đường kính và đỉnh chạm miệng — đúng trạng thái đề.
- **Khối nước** = lưới tự dựng (BufferGeometry từ công thức: mặt đáy nửa đĩa, mặt cong, mặt nghiêng) — cạnh chính xác, dễ vẽ nét khuất; tránh clipping plane (vá mặt cắt khó).
- **Nét khuất:** mẹo vẽ cạnh 2 lần — nét liền `depthFunc` thường + nét đứt `depthFunc = GreaterDepth`.
- **Kiểm:** số trên màn = số §C.1; soi trên 1920×1080 (TV) và iPad; 0 lỗi console.

### D.4 Bản thử 1 — ĐÃ DỰNG (10/10 rạng sáng)

- **File:** `toan-site/the-tich/coc-nghieng.html` (một file, không build). **Xem:** launch `toan` (cổng 5281) → `http://localhost:5281/the-tich/coc-nghieng.html`.
  Chưa có đường dẫn trong mục lục `toan-site/index.html` (chờ B4).
- **Bố cục:** sân khấu 3D bên trái · bảng lời giải bên phải (màn dọc: xếp trên/dưới) · thanh 6 bước ở đáy. Phím ← → hoặc PageUp/PageDown (bút trình chiếu) đổi bước, Space chạy/dừng cảnh nghiêng.
- **6 bước:** ① Đề bài → ② Nghiêng cốc (tự chạy hoặc kéo thanh; 2 ô điều kiện "chạm miệng" + "trùng đường kính" cùng bật ở 59°) → ③ Khối nước (cái nêm nét liền/nét đứt, R, h, α) →
  ④ Cắt một lát (3 hướng, công thức nhảy số) → ⑤ Cộng các lát (n = 4/8/16/32/64, tổng tiến về 240) → ⑥ Kết quả (2R²h/3 = 240, ≈ 21% cốc, nút "cho nước chảy lại" ra h₀ ≈ 2,12 cm).
- **Khác kịch bản D.2:** cắt **3 hướng** thay vì 2 — thêm hướng song song AB (lát **chữ nhật**, S(z) = (10/3)·z·√(36 − z²), tích phân đổi biến ra 240); mỗi hướng có góc nhìn riêng.
  Thêm nút "Nhìn ngang" (thấy đúng tam giác OKI, tan α = h/R) và "Nhìn từ trên".
- **Tổng n lát (quy tắc điểm giữa) — số trên màn phải khớp bảng này:**

  | n | ⟂ AB (tam giác) | ∥ đáy (viên phân) | ∥ AB (chữ nhật) |
  |---|---|---|---|
  | 4 | 247,50 | 238,48 | 248,97 |
  | 8 | 241,88 | 239,59 | 243,09 |
  | 16 | 240,47 | 239,89 | 241,07 |
  | 32 | 240,12 | 239,97 | 240,37 |
  | 64 | 240,03 | 239,99 | 240,13 |

- **Kỹ thuật đã dùng (chạy được):** three r128 (cdnjs) + nét dày `Line2` (jsdelivr `three@0.128.0/examples/js/lines/*`, thiếu thì lùi về nét 1px) + KaTeX 0.16.9.
  Nét khuất: vẽ khối nêm một lượt **chỉ ghi độ sâu** (`colorWrite:false`, `polygonOffset`), mỗi cạnh vẽ 2 lần — nét liền `LessEqualDepth`, nét đứt `GreaterDepth`; đường sinh biên tính theo vị trí máy quay.
  Nước lỏng ↔ nêm đông cứng chỉ đổi cho nhau ở đúng góc α (hai hình trùng khít) nên mọi lần chuyển bước đều đi qua α. Lát cắt vẽ `depthTest:false` để thấy xuyên qua khối.
  `r128` cần tự gán `material.defines.USE_DASH = ''` thì `LineMaterial` mới ra nét đứt.
- **Soát bằng máy:** `?buoc=4&huong=y&n=16` mở thẳng một bước · `__dbg.run(ms)` tua nhanh hoạt cảnh (**Browser pane ẩn thì `requestAnimationFrame` không chạy** — không tua thì ảnh chụp là khung cũ) · `__dbg.snap()` chụp canvas.
  Đã soát 1280×720, 1920×1080, 1024×768, 375×812: 6 bước, 3 hướng cắt, kéo xoay, cuộn phóng, bấm chip, phím mũi tên, nhảy bước 1 → 5.
- **Chưa làm / chưa biết:** chưa soi **TV và iPad thật** (cảm ứng chụm 2 ngón chưa thử tay) · chưa ai duyệt **câu chữ** · chưa có mục lục · chưa rút khuôn chung · B1–B6 chưa chốt.

---

## Phần E — Đứng trên vai ai (R7)

| Ý trong bài | Tên gọi / lý thuyết | Dùng vào đâu |
|---|---|---|
| Hai khối có mọi lát cùng độ cao bằng diện tích thì bằng thể tích | **Nguyên lý Cavalieri** (1635) — Trung Quốc gọi **nguyên lý Tổ Hằng** (祖暅, thế kỷ V–VI) | Câu 43 hai hướng cắt; mở rộng Câu 47 → thể tích cầu |
| Khối cắt từ trụ bởi mặt phẳng qua đường kính đáy | **Móng guốc Archimedes** (*ungula*) — Archimedes tính được thể tích khối này trong *Phương pháp* mà chưa có tích phân | Câu 43 |
| Giao hai trụ vuông góc | **Khối Steinmetz** / 牟合方蓋 "mâu hợp phương cái" (Lưu Huy đặt tên; cha con Tổ Xung Chi – Tổ Hằng dùng để ra thể tích cầu) | Câu 47 |
| π∫r², π∫(R² − r²) | **Phương pháp đĩa / vành khăn** (disk / washer method) | Loại 2; bẫy miền vắt qua trục |
| Chồng n lát mỏng → tích phân | **Tổng Riemann** | Nút "Chồng lát" |
| Diện tích mặt nghiêng = diện tích hình chiếu / cos φ | **Định lý hình chiếu** | Câu 53 |

---

## Phần F — Nhật ký quyết định

| Ngày | Ai | Nội dung |
|---|---|---|
| 09/10 tối | Thùy | Mở luồng: bài tập thể tích K12 khó vẽ trên bảng → HTML 3D xoay/thao tác được. Giao Claude đọc + giải + chọn mẫu, rồi bàn |
| 09/10 tối | Claude | Trích file F (MathType), giải + kiểm 10 bài, bắt 2 lỗi đáp số nguồn, đề xuất mẫu Câu 43 (+ Câu 48), đưa 6 câu hỏi B1–B6. Chưa code |
| 10/10 rạng sáng | Thùy | "Làm tiếp thôi" (chưa trả lời B1–B6) |
| 10/10 rạng sáng | Claude | Dựng bản thử 1 Câu 43 theo đề xuất mặc định của Phần B (§D.4); thêm hướng cắt thứ ba (chữ nhật). Chờ Thùy xem + chốt |
