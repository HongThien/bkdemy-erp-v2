# DẠY HÌNH 3D — mô hình không gian tương tác cho bài tập Toán (tài liệu tổng)

> **Đọc file này TRƯỚC khi dựng bất kỳ mô hình 3D nào cho bài tập Toán** (khối tròn xoay, khối tính bằng cắt lát, thiết diện…).
> Mở 09/10/2026 tối. **Trạng thái (10/10 chiều):** bài thiết diện Câu 43 `coc-nghieng.html` (Thùy xem: ok) · **trang chuyên đề tròn xoay** `tron-xoay.html` + dữ liệu `tron-xoay-bai.js`,
> đã có Câu 48 và Câu 49 (§D.7, luật A5 — Thùy chưa xem) · khung chung `khung.js` + `khung.css` (§D.5). Luật: A3 chữ trước số sau · A4 tròn xoay không cắt lát · A5 gom chuyên đề, mỗi bài một địa chỉ để gắn vào app HS.
> Cấu trúc: **Phần A** đã chốt · **Phần B** câu còn mở · **Phần C** kho bài đã giải · **Phần D** các bài đã dựng + khung chung · **Phần S** ⭐ **SỔ TAY DỰNG BÀI** (làm bài mới thì đọc A + S) · **Phần E** đứng trên vai ai · **Phần F** nhật ký quyết định.
> Nguồn đề + hình đã chép vào repo: [`docs/hinh-3d/`](docs/hinh-3d/) (không phụ thuộc ổ E: của máy công ty).

---

## 0. Tóm tắt một màn

- **Đích (Thùy 09/10):** bài tập lớp 12 *ứng dụng tích phân tính thể tích* — vẽ hình các bài này trên bảng **rất khó**. Dựng thành **file HTML hình không gian, xoay được, thao tác được**, để HS hiểu rõ hơn.
- **Nguồn đợt đầu:** NBV *12-18. Ứng dụng TP tính diện tích – thể tích*, file **F. Bài tập nâng cao**, Dạng 2. Trong đó có **10 bài thật sự 3D** (câu 43–50, 52, 53).
- **Đã làm (09/10):** đọc + tự giải cả 10 bài, kiểm bằng tích phân số / Monte Carlo — **10/10 khớp**; bắt được **2 lỗi đáp số của nguồn** (§C.11).
- **Bài mẫu đề xuất: Câu 43 — cốc nước nghiêng** (§D). Bài mẫu thứ hai (loại tròn xoay) nếu cần: **Câu 48**.
- **Đã dựng (10/10):** bài 1 Câu 43 (cắt lát, 6 bước — Thùy xem: ok) · bài 2 Câu 48 (tròn xoay, miền vắt qua trục, 7 bước — chưa xem) · khung chung `toan-site/the-tich/khung.js` + `khung.css`.
- **Việc kế tiếp:** dựng 8 bài còn lại theo **Phần S** (sổ tay + phiếu từng bài), thứ tự 49 → 50 → 52 → 45 → 46 → 47 → 44 → 53; song song chờ Thùy xem lại bài 2 bản 5 bước, soi TV/iPad thật, duyệt câu chữ, thêm mục lục.

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

### A3. Công thức TỔNG QUÁT trước, THAY SỐ sau (Thùy 10/10 — áp cho MỌI mô hình)
- Nguyên văn: *"Chỗ tính tích phân — t muốn có công thức tổng quát, chưa thay số trước để học sinh hình dung ra công thức, rồi mới thay số vào."*
- Cụ thể hoá: mọi đại lượng tính được (diện tích lát S, tích phân V, tỉ số, mực nước…) viết **bằng chữ** (R, h, α…) trước, thành một khối riêng;
  số của đề (R = 6, h = 10) chỉ xuất hiện ở khối **"Thay số"** đặt sau. Riêng bước ra đáp số: công thức chữ hiện sẵn, **bấm mới thay số**
  (nút trong bảng, nút "Tiếp", hoặc phím →) để GV giảng xong công thức rồi mới cho số.
- Hệ quả tốt: công thức chữ lộ ra điều số không lộ — vd tỉ số nước/cốc = 2/(3π) và mực nước h₀ = 2h/(3π) **không phụ thuộc R**.
- Không áp cho tổng n lát ở bước "chồng lát" (bản chất là xấp xỉ bằng số).

### A4. Cắt lát CHỈ cho bài tính theo thiết diện; bài tròn xoay lắp thẳng công thức (Thùy 10/10 — áp cho MỌI mô hình)
- Nguyên văn: *"Các bài mà tròn xoay có hàm riêng thế này không cần dùng cái cắt lát đâu — dùng trực tiếp công thức tròn xoay. Như bài này chia được 3 miền là lắp công thức được rồi.
  Bài cắt lát phù hợp với kiểu bài không dùng công thức tròn xoay mà dùng công thức tính theo thiết diện."*
- **Bài tròn xoay có hàm tường minh** (45, 46, 48, 49, 50, 52): mô hình chỉ cần *đề → quay → (gấp / chia miền nếu cần) → lắp công thức tròn xoay → thay số*.
  KHÔNG dựng bước "cắt một lát", KHÔNG "chồng n lát", không tổng Riemann.
- **Bài tính theo thiết diện S(x)** (43, 44, 47 — không phải tròn xoay): giữ đủ *cắt một lát → chồng lát → tích phân* như bài cốc nghiêng.

### A5. Bài cùng loại gom về MỘT trang chuyên đề; mỗi bài có địa chỉ riêng để gắn vào bài giải trên app HS (Thùy 10/10)
- Nguyên văn: *"Các câu tròn xoay không nên làm HTML riêng mà nên làm 1 file quản trị chung để lựa chọn các bài. Coi như là 1 chuyên đề. Tựa tựa như nhau. Sau này còn nhiều bài nữa cơ."*
  và *"Sau này còn đưa lên app cho học sinh view lại. Các file này đi kèm với bài giải luôn."*
- **Chuyên đề tròn xoay = một trang** `toan-site/the-tich/tron-xoay.html` (động cơ) + **một file dữ liệu** `tron-xoay-bai.js` (mỗi bài một mục). Thêm bài = thêm dữ liệu, KHÔNG viết HTML / hình mới.
- **Mỗi bài có địa chỉ cố định theo `id`:** `tron-xoay.html?bai=<id>`; `id` đã phát hành thì KHÔNG đổi, không dùng lại (app HS sẽ trỏ tới). Thêm `&nhung=1` = chế độ nhúng cạnh bài giải (không nút / bảng chọn bài).
- Vào trang không kèm `bai` ⇒ hiện bảng chọn bài của chuyên đề (GV dùng trên lớp).
- **Bảng chọn bài (Thùy 10/10):** mỗi bài một thẻ **rộng hết chiều ngang**, bên trái là **hình vẽ đồ thị của đề** (trang tự vẽ từ dữ liệu: trục, các đường, miền tô), giữa là tên + mô tả + dữ kiện, phải là nút mở — *"có hình vẽ, đồ thị thì mới tưởng tượng được"*. Không dùng lưới thẻ nhỏ chỉ có chữ.
- Bài thiết diện (43, 44, 47) và mặt cắt (53) hình khối mỗi bài một khác ⇒ **tạm giữ mỗi bài một file**; khi có ≥ 3 bài cùng khuôn mới gom. File riêng cũng phải giữ địa chỉ cố định.
- **Chưa làm (việc của đợt gắn vào app HS):** khoá nối bài ↔ câu trong kho (dùng mã câu, không dùng vị trí), nút mở mô hình cạnh lời giải, deploy site `toan`, soát màn dọc điện thoại. Xem câu mở B7.

---

## Phần B — CÂU CÒN MỞ (bản thử 1 chạy theo cột "Đề xuất của Claude"; Thùy xem 10/10: "còn lại ok rồi" — chưa trả lời từng câu)

| # | Câu hỏi | Đề xuất của Claude | Vì sao quan trọng |
|---|---|---|---|
| **B1** | **Ai dùng, ở đâu?** GV chiếu TV bấm từng bước, hay HS tự mở xoay trên iPad/ở nhà? | **GV chiếu TV là chính** (khớp `spec-toan-du-hanh.md`: "học = cả lớp nhìn TV"), cùng file vẫn chạy được trên iPad cho HS tự xoay | Quyết giao diện: *từng bước có dẫn* (nút to, GV bấm) hay *tự khám phá* |
| **B2** | **Mức độ:** chỉ mô hình xoay + cắt, hay kèm lời giải từng bước gắn vào mô hình? | **Kèm** — công thức S(x) nhảy số theo thanh trượt, tổng lát tiến về tích phân. Giá trị lớn nhất là nối *hình ↔ tích phân*, không phải hình đẹp | Quyết khối lượng mỗi bài (×2–3 lần) |
| **B3** | **Khuôn chung hay từng bài riêng?** | Làm **tay** Câu 43 trước; duyệt xong mới rút khuôn 3 động cơ: *cắt lát S(x)* · *tròn xoay* · *thiết diện*. Khi có khuôn, 9 bài còn lại = khai báo hình + số | Làm khuôn trước khi có mẫu duyệt = đoán yêu cầu |
| **B4** | **Đặt ở đâu?** | Mục mới trong `toan-site/` (cùng tên miền toan.bkacademy.edu.vn), vd `toan-site/the-tich/cau-43.html`. **Không** theo nhịp du hành (trạm → bay → trả lời) — đây là mô hình cho *bài tập*, không phải bài giảng | Domain, mục lục, deploy |
| **B5** | **Bài mẫu:** duyệt Câu 43, hay chọn bài khác? | Câu 43 (lý do §D.1) | — |
| **B6** | **Có đo / ghi DB không?** | Chưa — demo như bài du hành | Nếu đo thì phải theo `mon` + luật §1.6 CLAUDE.md |
| **B7** | **Gắn vào app HS thế nào?** (Thùy 10/10: sau này HS xem lại, đi kèm bài giải) | Trong dữ liệu bài thêm `maCau` (mã câu trong kho); màn lời giải của app HS thấy câu có mô hình thì hiện nút "Xem mô hình 3D" mở `…/tron-xoay.html?bai=<id>&nhung=1`. Cần: câu đã vào kho + site `toan` đã deploy | Quyết khoá nối (mã câu), nơi lưu danh sách câu-có-mô-hình (DB hay file), và có đo lượt xem không (§1.6: có `mon`) |

---

## Phần C — KHO 10 BÀI (đã giải + kiểm số)

### C.0 Phân loại

| Loại | Câu | Cách tính | Cái khó HS gặp → 3D giúp gì |
|---|---|---|---|
| **1. Cắt lát S(x)** (không tròn xoay) | 43 · 44 · 47 | V = ∫ S(x) dx, S(x) = diện tích lát cắt | **Khó tưởng tượng nhất**: lát cắt có hình gì? → kéo thanh trượt thấy lát chạy dọc khối |
| **2. Tròn xoay** | 45 · 46 · 48 · 49 · 50 · 52 | V = π∫ r² hoặc π∫ (R² − r²) — **lắp thẳng công thức, không cắt lát (A4)** | Dễ hơn, trừ **miền vắt qua trục** (48, 49) và **khối có lỗ** (46) → cho quay, gấp phần dưới lên, **chia miền** |
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
  ④ Cắt một lát (3 hướng; khối **công thức tổng quát** S theo R, h rồi khối **thay số** theo vị trí đang kéo) → ⑤ Cộng các lát (n = 4/8/16/32/64, tổng tiến về 240; kết bằng V = ∫S viết theo R, h, chưa có số) →
  ⑥ **Tính thể tích** (tính tích phân bằng chữ cho cả 3 hướng, đều ra V = 2R²h/3 → bấm **"Thay số"** / Tiếp / phím → mới hiện 240 cm³; rồi tỉ số với cả cốc 2/(3π) ≈ 21%, nút "cho nước chảy lại" ra h₀ = 2h/(3π) ≈ 2,12 cm).
  Tích phân theo từng hướng: ⟂ AB: (h/2R)[R²x − x³/3] từ −R tới R · ∥ đáy: đổi biến y = h·cos β ⇒ R²h(1 − 1/3) · ∥ AB: (2h/R)[−(R² − z²)^{3/2}/3] từ 0 tới R.
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
- **Soát bằng máy:** `?buoc=4&huong=y&n=16` mở thẳng một bước · `?buoc=6&thay=1` mở bước 6 đã thay số · `__dbg.run(ms)` tua nhanh hoạt cảnh (**Browser pane ẩn thì `requestAnimationFrame` không chạy** — không tua thì ảnh chụp là khung cũ) · `__dbg.snap()` chụp canvas.
  Đã soát 1280×720, 1920×1080, 1024×768, 375×812: 6 bước, 3 hướng cắt, kéo xoay, cuộn phóng, bấm chip, phím mũi tên, nhảy bước 1 → 5.
- **Chưa làm / chưa biết:** chưa soi **TV và iPad thật** (cảm ứng chụm 2 ngón chưa thử tay) · chưa ai duyệt **câu chữ** · chưa có mục lục · chưa rút khuôn chung · màn 1280×720 bước 4 phải cuộn bảng ~100px mới thấy hết khối thay số (1920×1080 vừa khít).

### D.5 Khung chung — ĐÃ RÚT (10/10 chiều, sau khi bài mẫu được duyệt — đúng đề xuất B3)

- **`toan-site/the-tich/khung.css`** — toàn bộ kiểu dáng (sân khấu, bảng lời giải, thanh bước, khối công thức `.fx`, khối thay số `.fx.num`, dòng tên khối `.lbl2`, khối chỉ hiện sau khi bấm `.subs`).
- **`toan-site/the-tich/khung.js`** — `MoHinh(cfg)` tự dựng khung trang trong `<div id="app">` và lo: three.js + đèn, **nét dày** `mkLine/setLine`, **máy quay** kéo-xoay / chụm / cuộn + các góc đặt sẵn,
  **nhãn và chấm bám điểm 3D** (`label`, `dot`), **thanh bước** + phím ← → / PageUp PageDown / Space, vẽ bảng + KaTeX (`data-tex`, thêm `data-d` = chế độ trình bày), **đồng hồ hoạt cảnh** `clock()` + `anims`, công cụ soát `__dbg.run/snap`.
- **Trang bài chỉ khai:** số liệu · vật thể · `bang(n)` (HTML từng bước) · `sauBang` (gắn sự kiện) · `truocBang` / `khiDoiBuoc` (chuyển bước) · `moiKhung` / `dongBo` (mỗi khung hình) · `tiep` / `nutTiep` (nút Tiếp dùng để "Thay số" ở bước cuối). Mẫu đầy đủ ở đầu `khung.js`.
- Bài 1 đã chuyển sang khung (58 KB → 41 KB), soát lại đủ 6 bước: hành vi không đổi. **Bài mới = chép khung HTML của một bài có sẵn + viết phần riêng**; đừng sửa khung cho riêng một bài — thiếu gì thì thêm tuỳ chọn vào `cfg`.
- **Lỗi ngầm đã sửa ở khung (dính cả bài 1):** hoạt cảnh từng nhận mốc giờ của `requestAnimationFrame` — đó là giờ ĐẦU khung hình, có thể SỚM hơn `t0 = clock()` lấy trong sự kiện bấm cùng khung ⇒ tiến độ âm
  (chồng 80 lát: −0,01 × 80 làm tròn thành lát thứ −1 ⇒ văng lỗi). Giờ vòng lặp luôn gọi `tick(clock())`.

### D.6 Bài 2 — Câu 48, miền vắt qua trục quay — ĐÃ DỰNG (10/10 chiều, Thùy chưa xem)

- **File:** `toan-site/the-tich/mien-vat-qua-truc.html` → `http://localhost:5281/the-tich/mien-vat-qua-truc.html` (launch `toan`).
- **Màu:** xanh = phần của (H) ở TRÊN trục · hồng = phần ở DƯỚI trục · hổ phách = lát cắt · đỏ = phần bị công thức sai trừ đi.
- **5 bước (bản sửa theo A4 — bản đầu có 7 bước, Thùy bỏ "cắt một lát" + "cộng các lát"):** ① Đề bài (hình phẳng đúng như hình trên giấy) → ② Quay quanh Ox (kéo thanh hoặc tự chạy 0 → 360°; ô "nửa vòng: phần dưới đã lên trên" bật ở 180°) →
  ③ **Chia miền** (phần hồng lật quanh Ox lên trên; ba miền đánh số 1, 2, 3 trên hình; mỗi miền một công thức tròn xoay: V₁ = π∫ₐᵖ(g² − f²) · V₂ = π∫ₚ^q g² · V₃ = π∫_q^b f²; rồi thay số a = 1, p = 2, q = 3, b = 6) →
  ④ **Cái bẫy** (không chia miền, áp π∫(g² − f²)dx cho cả đoạn: phần khối giữa hai mặt g và |f| — xanh nơi được cộng, đỏ nơi bị trừ; bấm Thay số ⇒ +108π/5 − 108π/5 = **0**) →
  ⑤ Tính thể tích (V = V₁ + V₂ + V₃ bằng chữ → bấm Thay số ⇒ 64π/5 + 37π/3 + 153π/5 = **836π/15 ≈ 175,09**).
- **Theo luật A3:** ở bài này "chữ" là a, p, q, b, f, g (đề không có tham số R, h): bước 3–5 viết theo chữ trước; bước 4 và 5 phải bấm mới thay số.
- **Kỹ thuật riêng:** mặt tròn xoay là lưới tự dựng theo góc đã quay φ (điểm (x; y; 0) → (x; y·cos φ; y·sin φ)), dựng lại mỗi khung hình khi φ đổi; khối của bước "Cái bẫy" cũng là các lưới ấy (mặt ngoài + mặt trong của từng đoạn), tô đặc.
- **Soát (bản 5 bước):** 1280×720, đủ 5 bước, gấp lên / trả về, hai lần Thay số; 0 lỗi KaTeX, không tràn ngang.
- **Chưa làm / chưa biết:** Thùy chưa xem · chưa soi TV/iPad thật · nhìn dọc trục thì các nhãn a, p, q, b, O, M chồng lên nhau ở tâm · chưa duyệt câu chữ.

### D.7 Trang chuyên đề tròn xoay — ĐÃ DỰNG (10/10 chiều, theo A5)

- **File:** `toan-site/the-tich/tron-xoay.html` (động cơ) + `tron-xoay-bai.js` (dữ liệu) → `http://localhost:5281/the-tich/tron-xoay.html` (bảng chọn bài) · `?bai=48` · `?bai=49` · thêm `&nhung=1` để nhúng.
- **Đã có 6 bài — hết nhóm tròn xoay của tài liệu này:** 48 (ba miền, có lỗ ở miền 1, bẫy ra 0) · 49 (hai miền chạm trục, bẫy ra 16π/15 — bài đầu tiên thêm THUẦN bằng dữ liệu) · 50, 52 (hai thùng rượu — bài thực tế, thêm bước "Đặt hệ trục", 4 bước) · 45 (mũ Noel — bài đầu quay quanh Oy, đề cho mặt cắt) · 46 (bông hoa bốn cánh — khối có lỗ, tính nửa trên rồi nhân 2).
- `mien-vat-qua-truc.html` giờ chỉ là trang chuyển hướng sang `tron-xoay.html?bai=48` (giữ địa chỉ cũ, mang theo tham số).
- **Soát:** 1280×720; bảng chọn bài; cả hai bài đủ 5 bước, gấp lên, hai lần Thay số; `kiem()` lệch < 10⁻¹¹ ở cả hai; chế độ nhúng không có nút chọn bài; địa chỉ cũ chuyển hướng đúng; 0 lỗi KaTeX, không tràn ngang.
- **Chưa làm / chưa biết:** chưa soát 1920×1080 và màn dọc cho trang chuyên đề · chưa có bài quay quanh Oy / bài thực tế (xem S.4b) · chưa gắn vào app HS (B7) · Thùy chưa xem.

### D.8 Đã lên mạng + sổ theo dõi (10/10 chiều)

- **Địa chỉ:** `https://toan.bkacademy.edu.vn/the-tich/tron-xoay.html` (bảng chọn bài) · `…/tron-xoay.html?bai=48` · `…?bai=49` · `…/coc-nghieng.html`. Cả site `toan-site/` (kể cả bài du hành Tam giác bằng nhau) lên cùng lúc.
- **Project Vercel:** `bkdemy-erp-v2-toan-site` (Claude tạo 10/10 bằng CLI theo lời Thùy "có toan.bkacademy.edu.vn rồi, build project đưa lên đấy"; trước đó tên miền mới có bản ghi DNS, chưa gắn project nào).
  **Chưa nối git** ⇒ nút "Create Deployment" trên dashboard KHÔNG dùng được cho project này; deploy bằng lệnh:
  ```
  cd toan-site                                               # trong một bản main SẠCH (đừng deploy từ checkout đang có file sửa dở của phiên khác)
  vercel link --yes --project bkdemy-erp-v2-toan-site        # lần đầu trên mỗi máy / mỗi bản checkout
  vercel deploy --prod --yes
  ```
  `vercel link` đẻ ra `.vercel/`, `.env.local`, `.gitignore` trong `toan-site/` — không commit ba thứ đó. Muốn nút dashboard thì Thùy nối repo + đặt Root Directory `toan-site` trong Settings.
- **Đường vào:** trang chính `https://toan.bkacademy.edu.vn/` có nhóm "Thể tích bằng tích phân" với hai thẻ: *Thể tích khối tròn xoay* (→ bảng chọn bài) và *Cốc nước nghiêng*. Mỗi mô hình có nút "‹ Trang Toán" ở góc trái trên (ẩn khi `nhung=1`). Thêm chuyên đề / bài file riêng mới thì thêm thẻ vào `toan-site/index.html`.
- **Deploy xong phải kiểm:** mở địa chỉ thật, `__dbg.kiem().lech` ≈ 0, không có dải đỏ, không lỗi KaTeX.
- **Sổ theo dõi:** `docs/hinh-3d/so-theo-doi.md` — mô hình nào ứng với câu nào của tài liệu nào, địa chỉ, đáp số, ngày dựng, Thùy đã xem chưa, **mã câu trong kho (để trống tới khi khớp)**. Dựng thêm mô hình = thêm dòng vào sổ trong cùng commit.

---

## Phần S — SỔ TAY DỰNG BÀI (đọc phần này + mở một bài mẫu là đủ để làm bài mới)

> Viết 10/10 sau hai bài đầu, theo yêu cầu Thùy "để làm các câu còn lại nhanh hơn nữa". Mọi luật ở đây rút từ A1–A4 và từ những chỗ đã sai ở hai bài đầu.
> **Bài thiết diện:** chép `coc-nghieng.html`. **Bài tròn xoay: không viết file mới** — thêm một mục dữ liệu vào `tron-xoay-bai.js` (S.4b, luật A5). Khung dùng chung: `khung.js` + `khung.css` (§D.5).

### S.1 Việc đầu tiên: xếp loại → chọn bộ bước (A4)

| Loại | Dấu hiệu trong đề | Bộ bước chuẩn | Bài mẫu để chép |
|---|---|---|---|
| **TX — tròn xoay** | "quay hình phẳng … quanh trục", vật tròn xoay có đường sinh là đồ thị hàm số | ① Đề bài → ② Đặt hệ trục *(chỉ khi đề là bài thực tế chưa có trục)* → ③ Quay quanh trục → ④ Chia miền *(chỉ khi có ≥ 2 miền / phải gấp / có lỗ)* → ⑤ Cái bẫy *(chỉ khi có lỗi kinh điển)* → ⑥ Tính thể tích: công thức chữ → bấm Thay số | **không chép file** — thêm một mục vào `tron-xoay-bai.js` (S.4b) |
| **TD — thiết diện** | khối KHÔNG tròn xoay; đề cho hình dạng mặt cắt, hoặc khối bị cắt bởi mặt phẳng | ① Đề bài → ② Dựng khối *(nghiêng, ghép, quét)* → ③ Khối có hình gì *(nét liền / nét đứt, kích thước)* → ④ Cắt một lát: S theo chữ → thay số → ⑤ Cộng các lát → ⑥ Tính thể tích: tích phân bằng chữ → bấm Thay số | `coc-nghieng.html` |
| **MC — diện tích mặt cắt** | hỏi DIỆN TÍCH thiết diện (không hỏi thể tích) | ① Đề bài → ② Dựng mặt phẳng cắt → ③ Thiết diện là hình gì → ④ Chiếu xuống đáy → ⑤ Tính: công thức chữ → bấm Thay số | chưa có (câu 53) |

- **Bài TX tuyệt đối không có** bước "cắt một lát", "chồng n lát", tổng Riemann (A4). Bài TX một miền (thùng rượu) chỉ 3–4 bước — đừng độn thêm cho đủ.
- Bước nào không có việc thật thì bỏ; tên bước ngắn (≤ 3 từ) vì thanh bước chỉ rộng chừng đó.

### S.2 Luật trình bày bảng lời giải (cột phải)

1. **A3 — chữ trước, số sau.** Mỗi chỗ tính có 2 khối: `.fx` (công thức bằng chữ) đặt trên, `.fx.num` (thay số) đặt dưới, mỗi khối có một dòng tên `.lbl2`.
   Chữ của bài = các tham số đề cho (R, h, a, b…); đề cho hàm cụ thể thì chữ là tên hàm và tên mốc (f, g, a, p, q, b).
2. **Bước ra đáp số phải BẤM mới thay số:** khối số nằm trong `<div class="subs" id="subs" hidden>`, có nút `#bSub` "Thay số ›"; khai `tiep` + `nutTiep` trong `cfg` để nút Tiếp / phím → cũng là Thay số. Trạng thái "đã thay" đặt lại mỗi lần vào bước (`truocBang`).
3. **Viết rõ phép thay**, không nhảy cóc: `S(2,40) = 10/(2·6)·(6² − 2,40²) = 25,20`, không viết thẳng `(5/6)(36 − x²)`.
4. **Chữ lộ ra điều số che mất** thì nói một câu (vd tỉ số nước/cốc = 2/(3π) không phụ thuộc R, h).
5. **Một bảng ≤ một màn 1920×1080** (cao 1005px ở cỡ chữ 21px). Dài quá thì: gom chú thích sang phải dòng công thức (`.fx .r2`), bỏ đoạn văn lặp ý, tách công thức dài thành 2 dòng `aligned`.
6. **Câu chữ:** câu ngắn, có chủ ngữ, không dấu gạch dài trong câu, không ký hiệu lạ (✓ ✗ ▶ ① trong chữ thường hay mất font — dùng CSS / SVG / số thường). Tên điểm, tên hàm đặt trong `<i>`.
7. **KaTeX:** tĩnh thì `data-tex="…"`, thêm `data-d` cho tích phân / phân số to; động thì `tex(el, chuỗi, true|false)`. Số trong công thức dùng `tn()` (ra `2{,}40`), số ngoài công thức dùng `fmt()`.
   **Không đưa chữ có dấu vào `\text{}`** — chú thích tiếng Việt để ở HTML. Dãy biến đổi dùng `\begin{aligned}…\\[0.5em]…\end{aligned}`.
8. **Đề bài viết lại bằng lời của mình** (đúng dữ kiện, không chép nguyên văn sách), kèm dải `.chips` các dữ kiện và ô `V = ?`.

### S.3 Luật hình (cột trái)

- **Toạ độ cảnh = toạ độ toán của lời giải** (đặt trục như lời giải đặt). Bài TX: hình phẳng nằm trong mặt z = 0, máy quay đứng phía +z để hình đầu tiên **giống hệt hình trên giấy** (`goc.phang`).
- **Màu cố định giữa các bài:** xanh `0x5ce1ff` = khối / phần chính · hồng `0xff7ab8` = phần thứ hai (dưới trục, phần gấp) · hổ phách `0xffb547` = thứ đang được chỉ (lát cắt, đường bao, số miền, đường kính) · đỏ `0xff5b5b` = phần bị tính sai / bị trừ · trắng xanh `0xe6efff` = đường, trục.
- **Nét:** đường chính 2,6–3px, đường nhấn 4,5–5px, nét phụ 1,4–2px đứt. Luôn `mkLine` (nét dày), không dùng `THREE.Line` trần.
- **Mặt trong suốt:** `transparent + depthWrite:false + DoubleSide`, độ đục 0,4 (khối) / 0,42 (hình phẳng); thứ cần thấy xuyên qua khối thì `depthTest:false`. Khối đặc so sánh (chồng lát, cái bẫy) dùng `MeshLambertMaterial` không trong suốt.
- **Nét khuất kiểu sách** (chỉ bài TD cần): lượt ghi độ sâu + mỗi cạnh 2 nét — chép nguyên cụm `prepass` / `pair()` ở `coc-nghieng.html`.
- **Nhãn:** `label(html, () => [x, y, z], khiNao, dx, dy, lớp)`; lớp `hot` = hổ phách, `dim` = viên chữ số liệu, `so` = huy hiệu tròn (số miền). Nhãn nào cũng phải có điều kiện hiện theo bước; kiểm chồng nhãn ở góc mặc định của từng bước.
- **Góc nhìn:** mỗi bước có góc mặc định (`gocMacDinh`); đổi bước mà góc mặc định khác thì mới `setView`. Nút góc: "Góc ban đầu / Nhìn thẳng (hoặc Nhìn ngang) / Nhìn dọc trục (hoặc Nhìn từ trên)". Điểm ngắm đặt sao cho hình không chạm tên bài ở góc trái trên.
- **Hoạt cảnh chính của bài** (nghiêng, quay, gấp, quét): có nút chạy / dừng + thanh kéo + 1–2 ô điều kiện bật đúng thời điểm đáng nhìn. Chuyển bước thì tự tua tới trạng thái đích (`khiDoiBuoc`), mở thẳng bằng `?buoc=N` thì vào luôn trạng thái đích, không diễn lại.

### S.4 Bộ khung một file bài (chép từ bài mẫu rồi thay ruột)

```
<head>  … khung.css + (style riêng của bài, vài dòng)
<body>  <div id="app"></div> + three r128 + 5 file Line2 + KaTeX + khung.js
<script>
  1. SỐ LIỆU CỦA BÀI      hằng số, hàm f/g, mốc, màu
  2. KHUNG CHUNG          const M = MoHinh({ nhan, tieuDe, buoc, nutGoc, goc, khung, khungNao, gocMacDinh,
                                             bang, sauBang, truocBang, khiDoiBuoc, moiKhung, dongBo, tiep, nutTiep, phimCach, thamSo })
  3. TRẠNG THÁI           const S = {…}; Object.defineProperty(S, 'step', { get: () => M.step }); let dirty = true
  4. VẬT THỂ              trục, đường, mặt, khối — mọi thứ tạo MỘT lần, bật/tắt ở dongBo()
  5. NHÃN + CHẤM          label(…), dot(…)
  6. ĐỒNG BỘ MỖI KHUNG    function dongBo() { … chỉ đặt visible / opacity / vị trí theo S … }
  7. BẢNG TỪNG BƯỚC       const PANELS = { 1: () => String.raw`…`, … }; function bindPanel() {…}; các sync…()
  8. CHUYỂN BƯỚC          tween, startPlay/stopPlay, truocBang, khiDoiBuoc
  9. CHẠY                 M.start(); Object.assign(window.__dbg, { S, … })
```

- **Không sửa `khung.js` cho riêng một bài.** Thiếu thì thêm tuỳ chọn vào `cfg` hoặc thêm hàm dùng chung, rồi soát lại CẢ các bài cũ.
- **Bài TX không còn file riêng:** mọi hàm tròn xoay (`pts`, `circ`, `strip`, `mkLuoi`, `tween`, hệ trục…) nằm trong động cơ `tron-xoay.html`, bài chỉ là dữ liệu (S.4b).
- **Hàm đang nằm trong bài 1, bài TD nào cũng cần:** `poly/area` theo hướng cắt, `updateSlice`, `buildSlabs/showSlabs/playSlabs`, `pair()` nét khuất. **Câu 47 đã dựng mà CHƯA chuyển:** lát của nó là hình vuông và các lát chồng là hộp, viết thẳng còn ngắn hơn dùng `poly/area` tổng quát; phần thật sự lặp lại giữa hai bài chỉ là `pair()` + lượt ghi độ sâu (~10 dòng, đang chép ở cả hai file). Bài TD thứ ba (câu 44) mới đủ ba mẫu để biết nên rút gì lên `khung.js` — rút lúc đó, rồi soát lại 43 và 47.
- Bẫy JS đã dính: `Object.assign` chép GIÁ TRỊ của getter · tiến độ hoạt cảnh phải lấy từ `clock()` (không dùng mốc giờ rAF) · nối hai tập bằng chỉ số là sai khi một bên đổi độ dài (đếm đỉnh theo từng lát, đừng giả định bằng nhau).

### S.4b Bài tròn xoay: thêm bằng DỮ LIỆU (A5) — không viết HTML

- Mở `toan-site/the-tich/tron-xoay-bai.js`, chép một mục `DS.push({...})` có sẵn (48 = ba miền có lỗ + bẫy; 49 = hai miền chạm trục), sửa. Quy ước từng trường ghi ở đầu file đó.
- **Mọi hàm là bán kính theo toạ độ dọc trục quay** (`truc: 'x'` ⇒ y theo x; `truc: 'y'` ⇒ x theo y). Trường chính:
  `to` (các dải tô của (H), dải `phia: 'duoi'` tự có hoạt cảnh gấp) · `mien` (mỗi miền: đoạn, hàm `ngoai`, hàm `trong` hoặc null, công thức chữ `tex`, dòng thay số `so`) ·
  `chia` (bảng mốc) · `bay` (tuỳ chọn) · `tong` (công thức chữ + kết quả + nguyên hàm) · `dapSo`.
- Trang tự suy ra: bộ bước (có "Chia miền" khi ≥ 2 miền, có "Cái bẫy" khi khai `bay`), mặt tròn xoay, đường gấp, đường bao, số miền trên hình, vạch + nhãn mốc.
- **Tự kiểm:** lúc mở, trang tính lại thể tích từ `mien` (Simpson) và so với `dapSo`; lệch ⇒ dải đỏ ở đáy màn. `__dbg.kiem()` trả số. Đây là nhân chứng thứ hai cho "hình vẽ và lời giải nói cùng một chuyện" — không bỏ `dapSo`.
- **Bài thực tế** (thùng, mũ… — đề chưa có trục): khai thêm `thucTe: { tieuDe, html, tex, soTen, so }` ⇒ trang thêm bước "Đặt hệ trục" và ở bước Đề bài chỉ hiện vật thật (khối đã quay), chưa có trục / đường / nhãn. Mẫu: mục 50, 52.
- Trang tự thêm **mặt đáy phẳng** ở hai đầu khối khi hình phẳng kết thúc bằng một đoạn vuông góc với trục (thùng rượu, bài 49).
- **Quay quanh Oy** (`truc: 'y'`): mọi hàm vẫn là bán kính theo toạ độ dọc trục, tức **x theo y**; đề cho y theo x thì phải đảo hàm trước (đây cũng chính là bước khó của HS — cho nó vào bước Đặt hệ trục). Mẫu: mục 45, 46.
- **Đề cho sẵn hình phẳng** (mặt cắt qua trục, hình hình học — chưa có trục): `thucTe.dePhang: true` ⇒ bước Đề bài hiện hình phẳng + tên điểm (`nhanDiem`), chưa có trục; `thucTe.deCoO: true` nếu điểm O có tên ngay trong đề. Đề vẽ hình ở cả hai bên trục: khai nửa quay ở `to`, nửa kia ở `toMo` (ở đề tô như nhau, từ lúc có trục thì mờ đi), thêm `doiXung: true` cho hình thu nhỏ. Cạnh thẳng không phải đồ thị hàm: `doan`.
- **Đường có tiếp tuyến vuông góc với trục quay ở đầu mút** (đỉnh parabol nằm ngang, điểm cao nhất của cung tròn): `mauDau: true` — không có thì đầu mút bị gãy thành góc nhọn. Hàm có căn phải kẹp `Math.max(0, …)`.
- **Hình đối xứng, chỉ tính một nửa:** miền của nửa kia vẫn khai trong `mien` nhưng thêm `an: true` — không liệt kê, không đánh số, chỉ để trang tự kiểm ra đủ thể tích. Mốc có giá trị không gọn: `moc.gt: '1 + √2'`.
- Thứ động cơ CHƯA có: bước "Cái bẫy" cho bài quay quanh Oy chưa chạy thử · bổ đôi khối để nhìn lỗ (46 hiện dựa vào mặt trong suốt + nút Nhìn dọc trục).

### S.5 Quy trình 8 việc cho một bài (làm đúng thứ tự)

1. **Đọc phiếu của bài ở S.7** + mục C tương ứng + hình gốc ở `docs/hinh-3d/hinh/`.
2. **Giải lại bằng CHỮ trước** (tham số thay cho số của đề) → ra công thức đóng → thay số phải trùng đáp số ở bảng C.0. Thêm 1 dòng kiểm vào `docs/hinh-3d/kiem-dap-so.mjs` nếu công thức chữ là mới.
3. **Viết kịch bản bước** theo S.1 ngay trong đầu file (vài dòng ghi chú): mỗi bước HS thấy gì, bấm gì, bảng hiện gì.
4. **Chép bài mẫu cùng loại**, thay mục 1 (số liệu) và mục 4–5 (vật thể, nhãn) trước cho hình đứng được; rồi mới viết bảng.
5. **Viết bảng từng bước** theo S.2.
6. **Soát bằng máy** (S.6). Sửa tới khi sạch.
7. **Ghi:** thêm một dòng vào **`docs/hinh-3d/so-theo-doi.md`** (bắt buộc — đó là vết để sau này khớp với kho / app) + mục `D.x` trong spec này (bộ bước · số kiểm · chưa làm) + 1 mục DEVLOG. HANDOFF chỉ sửa dòng "đã có những bài nào".
8. **Commit** đúng các file của bài (`git commit -- <đường dẫn>`), push, **deploy** (§D.8), báo Thùy xem bằng địa chỉ thật. **Thùy chưa xem bài N thì vẫn được làm bài N+1** (đã có khung + luật), nhưng góp ý của Thùy ở bài nào thành luật thì sửa hết các bài cũ cùng loại.

### S.6 Soát bằng máy (không bỏ mục nào)

- Mở `http://localhost:5281/the-tich/<file>.html` (launch `toan`; cổng do phiên khác giữ thì `preview_start {url}`), `resize_window` 1280×720 rồi 1920×1080.
- **Từng bước** (`?buoc=N`, và `&thay=1` cho bước có Thay số): `document.querySelectorAll('.katex-error').length === 0` · bảng không tràn ngang (`.fx`: `scrollWidth ≤ clientWidth`) · ở 1920×1080 bảng không phải cuộn (`#panel`: `scrollHeight ≤ clientHeight`, trừ sau khi bấm Thay số) · `read_console_messages` không có lỗi MỚI (bộ đệm console giữ cả lỗi cũ — nhìn số dòng của file).
- **Hoạt cảnh:** pane ẩn thì rAF không chạy ⇒ `__dbg.run(ms)` để tua; ảnh chụp trễ một khung ⇒ `run(200)` thêm rồi chụp lại. Thử kéo thanh, chạy/dừng, bấm lại khi đang chạy, đổi lựa chọn liên tục thật nhanh.
- **Số:** mọi số in trên bảng đối chiếu với phép tính độc lập (node) — ghi các số kiểm vào mục D.x.
- **Đi hết đường:** Tiếp từ bước 1 tới cuối bằng nút, bằng phím →, lùi bằng ←, nhảy chip 1 → cuối, mở thẳng từng bước.
- **Bài cũ:** nếu đã đụng `khung.js` / `khung.css` thì mở lại từng bài cũ, đi hết các bước một lượt.
- Chưa máy nào thay được: TV thật, iPad thật (chụm 2 ngón), người duyệt câu chữ — ghi rõ "chưa" trong D.x.

### S.7 Phiếu dựng 8 bài còn lại (công thức chữ đã kiểm bằng số 10/10)

Thứ tự đề xuất: ~~49 → 50 → 52 → 45 → 46~~ (xong — hết nhóm TX) → ~~47~~ (xong) → **44** (TD, file riêng) rồi **53** (MC).

**Câu 49 — TX, hai miền.** ✅ ĐÃ CÓ (10/10) — mục `id: '49'` trong `tron-xoay-bai.js`: V₁ = π∫ₐᶜ f², V₂ = π∫_c^b g², V = 21π/5; bẫy π∫(f² − g²) = 23π/15 − 7π/15 = 16π/15.

**Câu 50, 52 — TX một miền, bài thực tế (hai thùng rượu).** ✅ ĐÃ CÓ (10/10) — mục `id: '50'`, `'52'`: 4 bước (đề: vật thật → đặt hệ trục → quay → lắp công thức).
- 50: V = 2πb²(d − d³/(3a²)) = 1416π/25 dm³ ≈ 177,9 lít. 52: tính bằng **dm** để ra thẳng lít, V = (πl/15)(8R² + 4Rr + 3r²) = 656π/3 ≈ 686,96; tiền 210·V = 45 920π ⇒ **M = 144 262** (nói rõ với HS: làm tròn sớm ra 144 270).

**Câu 45 — TX quanh Oy, hai miền xếp chồng.** ✅ ĐÃ CÓ (10/10) — mục `id: '45'`: 5 bước (đề: mặt cắt như hình trong sách → đặt hệ trục, viết x theo y → quay → chia miền → tính).
- Chữ: R = OA, h₁ = OO′, h₂ = OB. x = R(1 − √(y/h₂)). V₁ = πR²h₁ (vành mũ = khối trụ), V₂ = π∫₀^{h₂} x² dy = πR²h₂/6, **V = πR²(h₁ + h₂/6)** = 2500π/3 ≈ 2618 cm³. Ghi chú cho HS: thân mũ chỉ bằng 1/6 khối trụ cùng đáy cùng cao.

**Câu 46 — TX quanh Oy, có lỗ.** ✅ ĐÃ CÓ (10/10) — mục `id: '46'`, tên "Bông hoa bốn cánh": 5 bước (đề: hình phẳng → đặt hệ trục, AC là Oy → quay → chia miền → tính).
- Chữ: a = OA. x± = a/2 ± √(a²/2 − (y − a/2)²), c = a/2 + a/√2. V₁ = π∫₀ᵃ x₊² dy, V₂ = π∫ₐᶜ (x₊² − x₋²) dy, **V = 2(V₁ + V₂) = a³(4π/3 + π²/2)**. Thay a = 2: V₁ = 22π/3 + π², V₂ = π² − 2π, V = 32π/3 + 4π² ≈ 72,99.
- KHÔNG làm bước "Cái bẫy" (coi miền 2 là đặc): số xấu, lệch ít (≈ 0,2), không đáng một bước — chỉ ghi ở dòng lưu ý cuối. Cung tròn không cần đường cong tham số: viết hai nhánh x₊, x₋ theo y là đủ.

**Câu 47 — TD, lát hình vuông.** ✅ ĐÃ CÓ (10/10) — file `giao-hai-tru.html`, 7 bước:
① Đề bài (hai khối xếp chữ L như hình trong sách, nét khuất tự tính) → ② Phần chung (tô từng khối xanh / hồng, phần chung vàng nổi qua hai khối; 4 nút xem riêng) → ③ Khối (H) (hệ trục Oxyz, 5 mặt) → ④ Cắt một lát (hình vuông MNQP, thanh kéo x) → ⑤ Cộng các lát (n = 4…64) → ⑥ Tính thể tích → ⑦ Hình cầu (mở rộng).
- Chữ: (H) = {x² + z² ≤ a², x² + y² ≤ a², x, y, z ≥ 0}; S(x) = a² − x²; **V = 2a³/3**. Đáp số theo chữ ⇒ không có nút Thay số; các số in ra (0,40a; 0,84a²; tổng n lát) đều tính theo a.
- Bước ⑦: 1/8 khối cầu nằm trong (H), lát nào cũng theo tỉ số π/4 ⇒ V₈ = πa³/6 ⇒ khối cầu 4πa³/3 (Tổ Hằng, §E). Bước ⑥ có nút so với khối lập phương cạnh a (chiếm đúng 2/3).
- Toạ độ: toán (x đứng, y, z) → cảnh (z, x, y) để giữ tam diện thuận và giống hình lời giải. Bán kính vẽ A = 6 đơn vị cảnh, chỉ để vẽ.
- Số kiểm: cộng 4000 lát ra 0,66666667 (lệch 5·10⁻⁹); 8 lát 0,6680 · 32 lát 0,6667; x = 0,90a ⇒ MN = 0,44a, S = 0,19a².
- **Hai bẫy đã dính:** vật nằm TRONG khối đang có lượt ghi độ sâu (khối cầu ở bước ⑦, phần chung ở bước ②) phải `depthTest: false`, không thì bị chính lượt ấy che mất · công thức KaTeX trong dòng `.r2` tự gãy ở dấu = khi chú thích bên phải dài ⇒ `white-space: nowrap` cho công thức, chú thích xuống dòng bằng `<br>`.
- Chưa: màn dọc; TV / iPad thật; câu chữ chưa ai duyệt; chưa có hoạt cảnh "đẩy hai khối vào nhau" như phiếu cũ ghi (thay bằng tô màu + xem riêng từng khối).

**Câu 44 — TD, lát viên phân.** File `mai-vom.html`.
- Đề: nền sân là elip trục lớn 150 m, trục bé 90 m; cắt bởi mặt phẳng ⟂ trục lớn tại M, N thì thiết diện là phần hình tròn tâm I giới hạn bởi dây MN, góc MIN = 90°. Tính thể tích dưới mái.
- Chữ: bán trục a, b. MN = 2b√(1 − x²/a²); bán kính cung ρ = MN/√2; viên phân 90°: S = (π/4 − 1/2)ρ² ⇒ **S(x) = ((π − 2)/2)·b²(1 − x²/a²)**.
  **V = ∫₋ₐᵃ S dx = (2(π − 2)/3)·a·b²**. Thay a = 75, b = 45: (π − 2)·101 250 ≈ **115 586 m³**.
- Bước: Đề bài (ảnh thật `image1014`, nền elip) → Dựng mái (một cung viên phân chạy dọc trục lớn quét ra mái) → Cắt một lát → Cộng các lát → Tính thể tích.
- Dựng mái: tại x, nửa dây m = b√(1 − x²/a²), tâm cung nằm dưới mặt sân một đoạn m, bán kính m√2; điểm cung (x; m√2·cos θ − m; m√2·sin θ), θ ∈ [−45°; 45°].

**Câu 53 — MC, diện tích thiết diện.** File `tru-cat-nghieng.html`.
- Đề: trụ đáy (O; R), cao 4R; dây AB = R√3 trên đáy (nguồn ghi nhầm a√3); mặt phẳng qua AB, cắt đoạn OO′, nghiêng 60° với đáy. Tính diện tích thiết diện.
- Chữ: R, góc φ, d = khoảng cách từ O tới AB = √(R² − (AB/2)²). Hình chiếu của thiết diện xuống đáy = phần hình tròn phía xa AB:
  S = R²(π − arccos(d/R)) + d√(R² − d²) · thiết diện **S′ = S / cos φ**. Thay AB = R√3 ⇒ d = R/2, φ = 60°: S = (2π/3 + √3/4)R², **S′ = (4π/3 + √3/2)R²**.
- Phải kiểm trước khi dùng công thức: mặt phẳng ra khỏi trụ ở thành bên, độ cao lớn nhất (R + d)·tan φ = 3√3R/2 ≈ 2,6R < 4R — cho HS kéo góc φ để thấy khi nào mặt phẳng chạm đáy trên (lúc đó công thức đổi).
- Bước: Đề bài → Dựng mặt phẳng (kéo góc) → Thiết diện là hình gì (một phần elip, bán trục R/cos φ và R) → Chiếu xuống đáy → Tính diện tích. Nguồn: Cách 1 sai, Cách 2 đúng (§C.11).

### S.8 Khi Thùy góp ý

- Góp ý về **một bài** ⇒ sửa bài đó. Góp ý nghe như **luật chung** (cách trình bày, có/không có một loại bước) ⇒ ghi thành mục A mới, sửa S.1–S.3 cho khớp, sửa hết các bài cũ cùng loại, ghi memory.
- Đã có: A3 (chữ trước, số sau) · A4 (cắt lát chỉ cho bài thiết diện). Hai lần Thùy sửa đều vì t **bê khuôn bài trước sang bài khác loại / trình bày theo thói quen người giải** thay vì theo cách thầy cô giảng ⇒ trước khi viết bảng, tự hỏi: "trên lớp GV có nói bước này không?"

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
| 10/10 | Thùy | Xem bản thử 1: *"Chỗ tính tích phân — muốn có công thức tổng quát, chưa thay số trước để học sinh hình dung ra công thức, rồi mới thay số vào. Còn lại ok rồi."* |
| 10/10 | Claude | Sửa bước 4–5–6 theo luật A3 (khối tổng quát → khối thay số; bước 6 = Tính thể tích, bấm mới thay số). Ghi A3 là luật cho mọi mô hình sau |
| 10/10 chiều | Thùy | "Tiếp tục 1 bài khác nào" |
| 10/10 chiều | Claude | Rút khung chung (`khung.js`, `khung.css`), chuyển bài 1 sang khung; dựng bài 2 = Câu 48 miền vắt qua trục (7 bước, có bước "Cái bẫy"). Chờ Thùy xem |
| 10/10 chiều | Thùy | Xem bài 2: bài tròn xoay có hàm tường minh không cần cắt lát — chia miền rồi lắp thẳng công thức; cắt lát chỉ hợp bài tính theo thiết diện (⇒ A4) |
| 10/10 chiều | Claude | Sửa bài 2 còn 5 bước (bỏ "cắt một lát", "cộng các lát"; bước 3 thành "Chia miền" với 3 công thức; cái bẫy vẽ khối trơn thay vì chồng lát) |
| 10/10 chiều | Thùy | "OK viết spec đi, để làm các câu còn lại nhanh hơn nữa." |
| 10/10 chiều | Claude | Viết Phần S — sổ tay dựng bài: bộ bước theo loại, luật bảng + hình, khung file, quy trình 8 việc, danh mục soát, phiếu dựng 8 bài còn lại (công thức chữ đã kiểm số) |
| 10/10 chiều | Thùy | Các câu tròn xoay không làm HTML riêng — một file chung để chọn bài, coi như một chuyên đề (còn nhiều bài nữa). Sau này đưa lên app cho HS xem lại, đi kèm bài giải (⇒ A5, B7) |
| 10/10 chiều | Claude | Dựng trang chuyên đề `tron-xoay.html` + `tron-xoay-bai.js`; chuyển Câu 48 sang dữ liệu, thêm Câu 49 thuần bằng dữ liệu; địa chỉ theo `id`, chế độ nhúng `nhung=1`, tự kiểm thể tích với `dapSo` |
| 10/10 chiều | Thùy | "Có toan.bkacademy.edu.vn rồi, build project đưa lên đấy thôi." · "Đưa lên app thì cứ từ từ. Khớp sau. Lưu vết để sau này còn track." |
| 10/10 chiều | Claude | Tạo project Vercel `bkdemy-erp-v2-toan-site`, deploy `toan-site/` lên toan.bkacademy.edu.vn (§D.8); lập `docs/hinh-3d/so-theo-doi.md`, thêm trường `maCau: null` vào dữ liệu bài |
| 10/10 chiều | Thùy | Hỏi đã có project Vercel của Toán chưa; trang chính phải có chỗ chọn để sang tròn xoay |
| 10/10 chiều | Claude | Trước 10/10 chưa có project nào giữ tên miền (đã liệt kê hết 22 project); project `bkdemy-erp-v2-toan-site` là cái vừa tạo. Thêm nhóm thẻ vào trang chính + nút về trang chính trong mô hình, deploy lại |
| 10/10 chiều | Thùy | Menu chọn bài phải rõ hơn: thẻ rộng hết chiều ngang, có hình vẽ đồ thị thì mới tưởng tượng được |
| 10/10 chiều | Claude | Bảng chọn bài: mỗi bài một thẻ ngang, hình đồ thị tự vẽ từ dữ liệu bài (ôm sát hình phẳng + gốc toạ độ) |
| 10/10 tối | Thùy | "Làm tiếp đi" |
| 10/10 tối | Claude | Thêm Câu 50, 52 (thùng rượu) vào trang chuyên đề; động cơ thêm bước "Đặt hệ trục" cho bài thực tế + mặt đáy phẳng ở hai đầu khối. Soát lại 48, 49. Deploy |
| 10/10 tối | Thùy | "Tiếp đi" |
| 10/10 tối | Claude | Thêm Câu 45 (mũ Noel), 46 (bông hoa bốn cánh) — hai bài quay quanh Oy; hết nhóm tròn xoay. Động cơ: đề là hình phẳng chưa có trục, nửa hình bên kia trục, đoạn thẳng lẻ + tên điểm, dồn điểm mẫu về đầu mút, miền đối xứng ẩn. Sửa dòng kết quả Câu 48 rơi một gạch chéo. Soát lại 48, 49, 50, 52. Deploy |
| 10/10 tối | Thùy | "Ok" (sau khi t báo làm Câu 47 trước) |
| 10/10 tối | Claude | Dựng Câu 47 `giao-hai-tru.html` (thiết diện, 7 bước, có bước mở rộng ra thể tích hình cầu) + thẻ ở trang chính. Chưa rút hàm lát cắt lên khung (để tới bài 44). Deploy |
