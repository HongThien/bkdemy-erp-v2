# kho-rules/dai/k4T.md — Luật GÁN DẠNG + GIẢI + TRÌNH BÀY khối 4T (Toán 4 nâng cao)

> **Trạng thái: NHÁP v0 (07/10) — chờ CEO duyệt lô giải thử `k4T-mau-thu.md`.** Theo `spec-luong-kho.md` C10: mọi lần
> gán dạng / giải câu 4T PHẢI đọc file này trước. **Mỗi lần CEO sửa một chỗ ⇒ ghi vào §7 (nhật ký) rồi nâng luật ở §1–§5.**
> Lặp cho tới khi một lô đi qua mà CEO không sửa gì ⇒ v1.
>
> **Nguồn gốc:** `E:\BK ACADEMY\Tài liệu tham khảo\4T\Toán arc 4 quyển 1  2023.docx` (Archimedes, 2.787 đoạn, 1.095 công
> thức MathType đọc thẳng 0 hỏng, 52 hình). Cấu trúc sách: 24 chuyên đề (Kiến thức cần có → Tóm tắt lý thuyết → VÍ DỤ có
> "Bài làm" → LUYỆN TẬP không lời giải) + 6 Phiếu tự luyện + 35 Phiếu cuối tuần (Phần I trắc nghiệm chỉ ghi đáp số · Phần II
> tự luận). **Lời giải mẫu = các "Bài làm" trong VÍ DỤ** — đó là chuẩn trình bày của 4T, luật dưới đây rút từ đó.
> Bản chép local: `<KHO_LAM_VIEC>/…/4T/mt/goc.txt` (dựng lại bằng `node scripts/kho/mathtype-thu/doc-docx.mjs <docx> --ra <thư mục>`).

## 0. Nguyên tắc gốc

Lời giải viết **như một học sinh lớp 4 giỏi viết vào vở**, đúng kiến thức lớp 4. Phụ huynh đọc phải hiểu. Sách 4T không có
số thập phân, không có số âm, không có phương trình. Gặp bước chỉ giải được bằng đại số ⇒ đổi sang cách tiểu học (sơ đồ đoạn
thẳng, số phần bằng nhau, tính ngược, lập bảng, thử chọn có lập luận). Không đổi được ⇒ làn 🔴 hỏi người, không ghi.

## 1. CẤM / CHO PHÉP (ranh giới kiến thức 4T — rút từ chính "Bài làm" của sách)

| Cấm | Thay bằng |
|---|---|
| `⇒ ⇔ ∈ { } ∀ ≤ ≥` trong lập luận | chữ: "nên", "vậy", "suy ra", "không lớn hơn" |
| Tự đặt ẩn $x$ rồi **chuyển vế đổi dấu / chia hai vế** kiểu đại số | sơ đồ đoạn thẳng · số phần · tính ngược từ cuối |
| Số âm, luỹ thừa, số thập phân, phần trăm | — (4T chưa học) |
| Công thức tổ hợp ($A^k_n$, "chỉnh hợp") | đếm theo **từng hàng**: "Chữ số hàng trăm có … cách chọn…" (VD 2.1) |
| Chia hết: "đồng dư", "mod" | "chia cho 9 dư bấy nhiêu thì tổng chữ số chia 9 dư bấy nhiêu" (CĐ11) |
| Phân số: "quy đồng rồi so tử" viết tắt | ghi rõ phép nhân cả tử lẫn mẫu: $\dfrac{3}{5}=\dfrac{3\times 3}{5\times 3}=\dfrac{9}{15}$ (VD 17.1) |

**CHO PHÉP vì sách làm vậy (khác luật 5T):**
- **Cấu tạo số (CĐ12):** được "Gọi số cần tìm là $A$ / $\overline{ab}$ ($a$ khác $0$; $a,b<10$)", viết $\overline{A3}=A\times 10+3$,
  rồi **"Bớt cả hai vế đi $A$"** (ghi chú trong ngoặc) → $A\times 9=414$ → $A=414:9$. Đây là phân tích cấu tạo số, không phải
  giải phương trình. KHÔNG được "chuyển vế", KHÔNG được "$9A=414$" (phải viết $A\times 9$).
- **Tìm $y$ / tìm $m$ (CĐ4, 16, 18, 19):** đề có sẵn chữ thì dùng chữ đó; viết **theo cột, mỗi dòng một bước**, dạng
  `$\begin{array}{l} m=35-20 \\ m=15 \end{array}$` như VD 4.2. Có thể nêu quy tắc thành phần chưa biết ở Phần 1.
- **Đếm số (CĐ2):** nhân các số cách chọn: $3\times 2\times 1=6$ (số) — kèm giải thích từng hàng.
- **"Cách 1 / Cách 2"** khi sách có 2 cách (VD 19.3, 20.3): chỉ trình bày **một** cách ở Phần 2; cách kia nhắc 1 câu ở Phần 1
  nếu đáng dạy.

## 1.5 ⭐ Mỗi lời giải CHIA 2 PHẦN (giữ nguyên quyết định CEO 04/10 cho tiểu học)

| Phần | Viết gì | Không viết gì |
|---|---|---|
| `**Phần 1. Hướng dẫn**` | **Mấu chốt** là gì · **vì sao nghĩ ra** (dấu hiệu trong đề) · các bước theo mạch nghĩ · "Chú ý" nếu có bẫy | — |
| `**Phần 2. Trình bày**` | **Đúng cái HS viết vào bài thi**, theo khuôn của chuyên đề (§2) | Không giải thích dài, không "Ta có nhận xét" |

- Phần 1 là phần quan trọng nhất. Bài quá dễ (1–2 phép tính) thì Phần 1 ngắn nhưng vẫn nêu mấu chốt.
- Bài **lời văn**: Phần 2 = `Bài giải` → mỗi bước **1 câu lời giải + 1 phép tính (đơn vị)** → `Đáp số: …`.
  Câu lời giải theo mẫu sách: *"Số ki-lô-gam gạo loại II là:"*, *"Tổng số phần bằng nhau là:"*, *"Tuổi con hiện nay là:"*.
- Bài **lập luận** (viết số, chữ số, chia hết): Phần 2 = **lập luận ngắn + kết luận**, đúng mẫu VD 1.1: "Số tự nhiên lớn nhất
  khi nó nhiều chữ số nhất và chữ số lớn nhất đứng ở hàng cao nhất… Ta có: $19=0+1+2+3+4+9$. Sắp xếp… được số cần tìm là 943210."
- Bài **tính / tính thuận tiện / tìm $y$**: Phần 2 chỉ có các dòng biến đổi, **mở bằng dòng chép lại nguyên biểu thức của đề**.
- Bài **có tỉ số / số phần** (tổng–hiệu, tổng–tỉ, hiệu–tỉ, TBC, tính ngược): Phần 2 PHẢI có dòng `Ta có sơ đồ:` + **HÌNH sơ đồ
  đoạn thẳng** (CEO 07/10: "có vẽ được hình không" ⇒ phải vẽ). Hình do máy vẽ từ mô tả có cấu trúc:
  `node scripts/kho/so-do-doan-thang.mjs mo-ta.json --out so-do.svg` (mô tả: hàng = đại lượng, `phan` = số phần bằng nhau,
  `them` = đoạn thêm của tổng–hiệu, `tong`/`hieu` = ngoặc, `dau_hoi` = hàng cần tìm, `tieu_de` = thời điểm "Sau 5 năm nữa").
  Khi ghi kho: SVG lên storage → `anh_dap_an`; mô tả bằng lời (`Tuổi con: 1 phần; Tuổi mẹ: 4 phần`) vẫn ghi ngay sau
  `Ta có sơ đồ:` để làm alt và để in giấy khi chưa có hình. Hạn chế hiện tại: app HS hiển thị `anh_dap_an` **dưới** lời giải,
  không đúng vị trí dòng "Ta có sơ đồ:" — việc sửa app ghi ở `kho-rules/README.md` §4.
- Bài **nhiều ý a) b) c)**: nếu các ý **độc lập** (mỗi ý một dạng, vd LT 6.6 a/b/c) ⇒ **tách thành các câu riêng** khi vào kho
  (memory `tach-y-hinh-vs-dai`); nếu ý sau dùng kết quả ý trước ⇒ giữ một câu, Phần 2 ghi a) b) c).
- Ghi chung vào 1 ô `loi_giai`, nhãn in đậm `**…**`.

## 2. Khuôn trình bày theo CHUYÊN ĐỀ của sách (rút từ "Bài làm" trong VÍ DỤ)

| CĐ sách | Chủ đề bản đồ | Khuôn Phần 2 | Mấu chốt / bẫy phải nói ở Phần 1 |
|---|---|---|---|
| 1 Viết số theo điều kiện | `T14T01` | Câu lập luận "lớn nhất khi NHIỀU chữ số nhất và chữ số lớn đứng hàng cao" / "nhỏ nhất khi ÍT chữ số nhất và chữ số nhỏ đứng hàng cao" → `Ta có: 19 = 9+8+2` → "Sắp xếp… được số cần tìm là …" | Tổng cho trước: lớn nhất ⇒ chọn chữ số **nhỏ** (0;1;2;…) để nhiều chữ số; nhỏ nhất ⇒ chọn chữ số **lớn** (9;8;…) để ít chữ số. "Khác nhau" ⇒ không lặp. Số nhỏ nhất **không bắt đầu bằng 0**. Chẵn/lẻ ⇒ xét hàng đơn vị trước. Tích chữ số ⇒ tách thừa số 1 chữ số |
| 2 Đếm số và chữ số | `T14T02` | "Gọi số có ba chữ số có dạng $\overline{abc}$ ($a$ khác $0$)" → mỗi hàng "có … cách chọn" → phép nhân `(số)` | Có chữ số 0 ⇒ hàng cao nhất bớt 1 cách. "Khác nhau" ⇒ hàng sau bớt dần. Số lẻ/chẵn ⇒ chọn hàng đơn vị **trước** |
| 3 Đo lường | `T14T03` | Đổi từng dòng `1 kg 6 hg = 160 dag`; lời văn thì đổi về **cùng đơn vị** ở dòng đầu (`2 tấn = 2000 kg`) | Bảng đơn vị: khối lượng/độ dài liền kề gấp 10; diện tích gấp **100**. Thế kỉ: năm 1990 ⇒ thế kỉ XX. Lịch: 7 ngày một vòng |
| 4 Kỹ năng tính toán | `T14T04` · `T14T09` | Tính giá trị: `Nếu m=105, n=182 thì …=…=…`. Tìm $m$: theo cột. Thay đổi thành phần: 1 câu nêu quy luật ("thêm 21 vào số hạng ⇒ tổng tăng 21") → 1 phép tính → `Đáp số` | Trừ một tổng/một hiệu: $a-(b-c)=a-b+c$. Thêm vào **số trừ** ⇒ hiệu **giảm**. Gấp một số hạng lên $k$ lần ⇒ tổng tăng $(k-1)$ lần số hạng đó |
| 5 Chu vi, diện tích | `T14T05` | Lời văn: `Bài giải` từng bước, đơn vị `(cm)`, `($cm^2$)` | Chu vi bằng nhau ⇒ nửa chu vi = dài + rộng. "Tăng rộng thêm 4 cm thành hình vuông" ⇒ dài − rộng = 4 |
| 6 Dãy số cách đều | `T14T06` | **Chỉ dòng phép tính kết quả** (CEO 07/10): `Số hạng thứ 85 của dãy là: $11+(85-1)\times 5=431$` · `Số số hạng của dãy là: $(199-1):2+1=100$` · `Tổng … là: $(11+506)\times 100:2=25850$`. KHÔNG có dòng "Khoảng cách là: 16−11=5", KHÔNG có dòng "số khoảng cách là: 85−1=84" — những thứ đó nằm ở Phần 1 | Ba công thức (số số hạng · số hạng thứ $n$ · tổng) đều từ "khoảng cách × (số khoảng)"; số khoảng = số số hạng − 1. Trước khi hỏi "số X là số hạng thứ mấy" phải kiểm X có thuộc dãy không |
| 7 Trồng cây | `T14T07` | `Số khoảng cách: 450:5=90 (khoảng)` → `Số cây một bên: 90+1=91` → hai bên `×2` | 2 đầu đều trồng: cây = khoảng + 1; 1 đầu: = khoảng; không đầu nào: = khoảng − 1; **khép kín: = khoảng**. Cắt gỗ = "trồng cây không đầu": số lần cắt = số đoạn − 1 |
| 8 Tổng – hiệu | `T14T08` | `Ta có sơ đồ:` (mô tả) → `Số bé là: (tổng − hiệu):2` → `Số lớn là: …` → `Đáp số` | Tuổi: **hiệu không đổi** theo thời gian; tổng đổi theo "mỗi người thêm $t$" ⇒ tổng thêm $2t$. "Hai số tự nhiên liên tiếp" ⇒ hiệu 1; "giữa chúng có $k$ số lẻ" ⇒ hiệu $2(k+1)$ |
| 9 Lời văn nhân chia | `T14T09` (thiếu dạng, xem §5) | 1 câu nêu quy luật thành phần → phép tính → `Đáp số` | Tích riêng đặt thẳng cột ⇒ số bị nhân với **tổng các chữ số** của thừa số (VD 9.3). Viết nhầm 45 thành 54 ⇒ tích tăng $(54-45)$ lần số đó. Số dư lớn nhất = số chia − 1 |
| 10 Dấu hiệu chia hết | `T14T10` | `Ta có … chia hết cho 2 và 5 nên b = 0.` → `Thay b = 0 thì … chia hết cho 9 khi (7 + a) chia hết cho 9.` → `Suy ra a = 2. Vậy số cần tìm là 4320.` (VD 10.3) | Xét **2 và 5 trước** (chốt hàng đơn vị) rồi 3/9 (tổng chữ số). Chia hết 4: hai chữ số cuối; 8: ba chữ số cuối. 45 = 5 và 9; 36 = 4 và 9; 6 = 2 và 3 |
| 11 Chia có dư | `T14T11` | Dãy lặp: `Số nhóm: 253:5 = 50 (dư 3)` → "viên thứ 253 là viên thứ 3 của nhóm ⇒ màu đỏ" | Dư 0 ⇒ phần tử **cuối** của nhóm. Chữ cái lặp: đếm độ dài cụm (không tính dấu cách) |
| 12 Cấu tạo số | `T14T12` | `Gọi số cần tìm là A` → `Ta có: \overline{A3} = A + 417` → `A×10+3 = A+417` → `A×9+3 = 417 (Bớt cả hai vế đi A)` → theo cột → `Đáp số` | Thêm chữ số $c$ bên phải ⇒ số mới $=A\times 10+c$; bên trái số có 2 chữ số ⇒ $=c\times 100+\overline{ab}$; xoá chữ số ⇒ chiều ngược |
| 13 Trung bình cộng | `T14T13` | `Hai lần trung bình cộng … là: 24+28 = 52` → `… là: 52:2 = 26` (VD 13.4–13.6, có `Ta có sơ đồ:`) | Số thứ ba bằng TBC ⇒ TBC = TBC hai số kia. Hơn TBC $k$ ⇒ "hai lần TBC = tổng hai số + $k$"; kém ⇒ trừ $k$. Dãy cách đều: TBC = (đầu + cuối):2 |
| 14 Rút về đơn vị | `T14T14` | `Tóm tắt:` 2 dòng → `Bài giải`: `Một thùng đựng số táo là: 448:8 = 56 (kg)` → bước 2 nhân hoặc chia | Dạng 1 (tìm nhiều phần): chia rồi **nhân**; dạng 2 (tìm số phần): chia rồi **chia** |
| 15 Thống kê, xác suất | `T14T15` | Trả lời từng ý a) b) c), liệt kê sự kiện bằng dấu `+` mỗi dòng (VD 15.3); `Đáp số: a) …; b) …` | Biểu đồ tranh: mỗi hình = 5 đơn vị. "Chắc chắn đủ 3 màu" ⇒ xét trường hợp xấu nhất |
| 16 Phân số | `T14T16` | Rút gọn: `\dfrac{51}{57}=\dfrac{51:3}{57:3}=\dfrac{17}{19}` (ghi rõ chia cho mấy). Quy đồng: ghi $\times$ cả tử lẫn mẫu; kết bằng câu "Vậy quy đồng… ta được…" | $\dfrac{1313}{3939}$: chia cho 101 trước. Mẫu số chung nhỏ nhất khi một mẫu chia hết mẫu kia |
| 17 So sánh phân số | `T14T17` | 5 khuôn, mỗi khuôn **nêu tên bước**: "Quy đồng mẫu số: …", "Quy đồng tử số: …", "Bước 1: Tìm phần hơn … Bước 2: So sánh phần hơn…", "Bước 1: Tìm phần bù…", "Ta chọn phân số trung gian …" → `Vì … nên …` | Chọn khuôn theo dấu hiệu: tử bằng ⇒ so mẫu; tử − mẫu bằng nhau ⇒ phần bù/phần hơn; một phân số > 1 và một < 1 ⇒ so với 1; khác hẳn ⇒ trung gian |
| 18 Cộng trừ phân số | `T14T18` | Một dòng quy đồng rồi tính: `\dfrac{2}{3}+\dfrac{3}{4}=\dfrac{8}{12}+\dfrac{9}{12}=\dfrac{17}{12}`. Tính thuận tiện: nhóm cùng mẫu | Số tự nhiên viết thành phân số cùng mẫu ($4=\dfrac{12}{3}$). Dãy $\dfrac{1}{2\times 3}+…$: viết tử thành hiệu hai mẫu (VD 19.3) |
| 19 Nhân chia phân số | `T14T18` · `T14T19` | Rút gọn chéo ghi tường minh. Lời văn chu vi/diện tích với phân số như CĐ5 | $B=\dfrac{1}{2}+\dfrac{1}{4}+…$: Cách 1 viết mỗi số hạng thành hiệu; Cách 2 "$2\times B - B$" |
| 20 Giá trị phân số của một số | `T14T20` | `$\dfrac{1}{4}$ của 140 m là: $140\times\dfrac{1}{4}=35$ (m)` | Nhiều bước: "còn lại" ⇒ $1-(\dfrac{1}{4}+\dfrac{1}{3})$ phần của **tổng**; "của số còn lại" ⇒ nhân với phần còn lại |
| 21 Tìm số biết giá trị phân số | `T14T21` | `18 huy hiệu còn lại chiếm số phần tổng số huy hiệu là: 1 − (…) = \dfrac{18}{35} (số huy hiệu)` → `Số huy hiệu lúc đầu là: 18 : \dfrac{18}{35} = 35 (huy hiệu)` | Luôn quy mọi phần về **cùng một "tổng"**; "ít hơn … 39 kg" ⇒ 39 kg ứng với **hiệu** hai phân số |
| 22 Tỉ số · tổng–tỉ · hiệu–tỉ | `T14T22` | `Ta có sơ đồ:` → `Tổng (Hiệu) số phần bằng nhau là: 3+5 = 8 (phần)` → `Số bé là: 96:8×3 = 36` → `Số lớn là: 96−36 = 60` → `Đáp số: Số bé: 36; Số lớn: 60` | Tuổi: hiệu không đổi ⇒ vẽ sơ đồ ở **thời điểm có tỉ số**. Tổng ẩn (chu vi ⇒ nửa chu vi; TBC ⇒ tổng = TBC × 2). Thương 5 ⇒ tỉ số $\dfrac{1}{5}$; "chia dư 5" ⇒ bớt 5 ở tổng |
| 23 Bài toán cơ bản về phân số | — (xem §5) | Như CĐ20/21; tỉ số từ "$\dfrac{1}{4}$ số thứ nhất = $\dfrac{2}{7}$ số thứ hai" ⇒ quy đồng **tử** rồi đọc số phần (VD 23.3) | |
| 24 Tính ngược | `T14T23` | Sơ đồ/lưu đồ mô tả bằng lời → tính **từ cuối lên**, mỗi bước một dòng `B là: 20×5 = 100` → `A là: …`. Chuyển qua lại nhiều người ⇒ **lập bảng** rồi "Giải thích bảng" (VD 24.3) | Phép ngược: cộng↔trừ, nhân↔chia. "Bán $\dfrac{2}{5}$ số còn lại thì còn 30" ⇒ 30 là $\dfrac{3}{5}$ của số còn lại |

## 3. Định dạng (giữ quy ước kho Đại)

- **Mỗi câu lời giải / mỗi phép tính một dòng riêng**, các dòng cách nhau bằng dòng trống (`\n\n`) — CEO 07/10 "sau mỗi câu
  thì phải xuống dòng"; không gộp hai câu lời giải trên một dòng, kể cả khi trích trong chat. Phân số `\dfrac`. Mỗi công thức
  một cặp `$…$`.
- Dấu nhân `\times`, dấu chia `:` (không `\div`, không `/`). Số lớn **không** chèn dấu cách ngăn hàng nghìn trong công thức
  (`25850`, không `25 850`) — sách in có khoảng trắng nhưng app so đáp số bằng máy.
- Đơn vị trong ngoặc sau phép tính: `$448:8=56$ (kg)`. Đáp số có đơn vị: `Đáp số: 336 kg táo`.
- Số có gạch ngang: `$\overline{abc}$`, **không** `\text{abc}` bên trong (sách gõ `\overline{\text{abc}}`, chuẩn hoá về `\overline{abc}`).
- Đáp án (`dap_an`) của bài lời văn = số kèm đơn vị đúng câu hỏi; bài nhiều ý tách câu thì mỗi câu một đáp án.

## 4. Kiểm trước khi ghi

- Mọi đáp số **thay ngược vào đề** để kiểm (tổng–tỉ: cộng lại ra tổng, chia ra tỉ; tính ngược: đi xuôi lại ra kết quả cuối).
- Bài viết số: **thử phá** điều kiện (bớt một chữ số có còn thoả không? đổi hai chữ số cuối có lớn hơn không?).
- Đếm: liệt kê thật khi kết quả ≤ 12 để đối chiếu.
- Lệch với đáp án gốc (nếu có) ⇒ không ghi, báo người.

## 5. GÁN DẠNG — sách ↔ bản đồ 4T (`dai_ban_do`, khối `4T`, 77 dạng + dạng chờ `T14T000000`)

Bản đồ 4T được dựng từ chính quyển này: **chuyên đề 1–22 ↔ chủ đề `T14T01`–`T14T22` cùng số**, chuyên đề 24 ↔ `T14T23`.
Luật gán:

1. Câu trong LUYỆN TẬP của chuyên đề $k$ ⇒ tìm dạng **trong chủ đề cùng số** trước; chỉ khi không khớp mới nhìn chủ đề khác.
   **Nhưng PHƯƠNG PHÁP thắng chủ đề** (điều 3): giải bằng tổng–hiệu thì vào dạng tổng–hiệu dù câu nằm ở chuyên đề Chu vi (CEO 07/10).
2. Câu trong PHIẾU TỰ LUYỆN / PHIẾU CUỐI TUẦN ⇒ không có chủ đề gợi ý, gán theo **dấu hiệu đề** (bảng dưới).
3. Khớp **tên dạng** chưa đủ: phải khớp **phương pháp giải** (lời giải dùng khuôn nào). Vd "Tìm hai số" mà giải bằng
   "hiệu số phần" ⇒ CĐ22 dù đề không nhắc chữ "tỉ số". **Bài chu vi/diện tích mà lõi là tổng–hiệu** (nửa chu vi + hơn kém;
   "tăng rộng thêm $k$ thì thành hình vuông") ⇒ `T14T080101`, kể cả khi bước cuối là tính diện tích (CEO 07/10, LT 5.4).
4. Không có dạng ⇒ `T14T000000` + ghi vào danh sách thiếu (bên dưới), **không ép** vào dạng gần giống.
5. Bài nhiều ý độc lập ⇒ tách rồi gán từng ý (vd LT 6.6: a → `060101`, b → `060103`, c → `060104`).

**Dấu hiệu nhận dạng (các chủ đề có nhiều dạng):**

| Dạng | Dấu hiệu trong đề |
|---|---|
| `010101` lớn nhất, biết **tổng** chữ số **và số chữ số** | "lớn nhất, có N chữ số, tổng các chữ số bằng S" |
| `010102` lớn nhất, biết **tích** chữ số và số chữ số | "lớn nhất, có N chữ số, tích các chữ số là P" |
| `010103` lớn nhất, biết tổng chữ số (không cho N) | "lớn nhất, có các chữ số khác nhau, tổng bằng S" |
| `010104` lớn nhất / nhỏ nhất chỉ biết số chữ số (+ chẵn/lẻ/tròn chục/một hàng cho trước) | LT 1.3 |
| `010105` nhỏ nhất, biết tổng và số chữ số | LT 1.6 |
| `010106` nhỏ nhất, biết tổng (không cho N) | LT 1.9 |
| `010107` lập từ **các chữ số cho trước** | "Từ các chữ số 0;2;5;9;6;8, viết số…" (LT 1.4), xoá chữ số giữ thứ tự (LT 1.13–1.15) |
| `020101` đếm, chữ số đều khác 0, không điều kiện | VD 2.1 |
| `020102` đếm, có chữ số 0 | "Từ 0;1;2;3 lập được bao nhiêu số…" |
| `020103` đếm có điều kiện (lẻ, chẵn, < 4000, tổng chữ số…) | PCT 3 bài 7, bài 10 |
| `060101` / `060102` / `060103` / `060104` | "số hạng thứ n" / "có bao nhiêu số" / "tính tổng" / "số X là số hạng thứ bao nhiêu" |
| `070101` / `070102` | đường thẳng (2 đầu, 1 đầu, không đầu, cắt gỗ) / khép kín (xung quanh sân, ao) |
| `100101` / `100102` / `100103` | nhận biết trong danh sách / tìm chữ số $a,b$ trong $\overline{2a3b}$ / lập số từ chữ số cho trước |
| `110101`…`110105` | nhận biết số dư / tìm $\overline{56a}$ chia 5 dư 3 / đếm số chia hết–có dư trong đoạn / dãy lặp (bi, chữ) / chia cho nhiều số cùng dư |
| `170101`…`170205` | quy đồng mẫu / quy đồng tử / so với 1 / trung gian / phần bù cùng tử 1 (`170203`) / phần bù khác tử (`170204`) / sắp xếp. Phần hơn ⇒ dạng chờ |
| `180101`…`180302` | cộng trừ 2 phân số / nhiều phân số / thuận tiện tổng hiệu / chuỗi tích / thuận tiện nhân / biểu thức nhân / biểu thức chia / thuận tiện chia |
| `190101`…`190204` | dãy tích đơn ($\dfrac{2\times 3\times 4}{3\times 4\times 5}$) / dãy tích kép / hiệu-tích chuẩn ($\dfrac{1}{2\times 3}$) / tử chưa chuẩn ($\dfrac{3}{1\times 4}$) / mẫu chưa chuẩn ($\dfrac{1}{6}+\dfrac{1}{12}$) / tìm $x$ |
| `200101` / `200102` | một bước "$\dfrac{m}{n}$ của a" / nhiều bước ("còn lại", "của số còn lại") |
| `210101` / `210102` / `210103` | hai đại lượng / ba đại lượng / biết tổng–hiệu các thành phần ("sáng bán ít hơn chiều 39 kg") |
| `220101`…`220104` | cho thẳng tổng (hiệu) + tỉ / tổng ẩn (chu vi, TBC, tuổi sau n năm) / hiệu ẩn / tỉ số ẩn ("gấp 7 lần", "thương là 5", "viết thêm chữ số 0") |
| `220201`…`220203` | nhiều đại lượng: quy về nhỏ nhất / tỉ số đôi một / "$\dfrac{1}{4}$ số này = $\dfrac{2}{7}$ số kia" |
| `220301` / `220302` | chuyển từ A sang B rồi có tỉ số / tăng giảm từng đại lượng rồi có tỉ số |

**Chỗ bản đồ CHƯA có dạng (câu rơi vào `T14T000000`, chờ CEO lập dạng):**

| Chủ đề | Thiếu | Câu trong sách |
|---|---|---|
| `T14T03` Đo lường (chỉ có "đổi đơn vị khối lượng") | đổi đơn vị độ dài / diện tích / thời gian · phép tính với số đo · lịch–thế kỉ · cân đĩa | LT 3.1–3.15, PCT 5, 7, 8 |
| `T14T04` Tính toán | tính giá trị biểu thức chứa chữ · tính thuận tiện **cộng trừ** (kết hợp, trừ một tổng/hiệu, 19+199+1999) · tìm $y$ với số tự nhiên · điền chữ số vào dấu * | LT 4.1–4.9, 4.20, hầu hết PCT |
| `T14T09` Quan hệ đại lượng (chỉ có "phép cộng") | thay đổi thành phần phép **trừ / nhân / chia** · tích riêng thẳng cột · viết nhầm thừa số · số dư lớn nhất | LT 4.12–4.19, LT 9.1–9.19, PCT 14 |
| `T14T05` Chu vi diện tích (chỉ có "chu vi cơ bản") | diện tích HCN/HV · thay đổi kích thước **không quy về tổng–hiệu** (vd LT 5.7 "tăng rộng 5 dm thì diện tích tăng 45 dm²"; còn "tăng rộng thành hình vuông" ⇒ `080101`) · hình ghép / cắt góc / tô màu trên lưới ô vuông · lát gạch | LT 5.2–5.20, PCT 7, 8, 12, 13 |
| `T14T08` Tổng hiệu (chỉ "cơ bản") | tổng–hiệu **ẩn** (tuổi, giữa chúng có k số, xoá chữ số, ba số) | LT 8.4–8.20 |
| `T14T12` Cấu tạo số (chỉ "thêm bên trái") | thêm/xoá chữ số **bên phải** · thêm **vào giữa** · thay chữ số · $\overline{ab}=k\times(a+b)+r$ | LT 12.1–12.18 |
| `T14T13` TBC (chỉ "của một nhóm") | hơn/kém TBC · bằng TBC · TBC dãy cách đều · thêm số thứ n đổi TBC | LT 13.2–13.20 |
| `T14T14` Rút về đơn vị (chỉ "một đại lượng" — gồm cả dạng 1 và dạng 2 "tìm số phần", CEO 07/10) | hai đại lượng ("dép và giày") · năng suất thay đổi (14.14–14.20) | LT 14.4–14.20 |
| `T14T15` Thống kê (chỉ "đại lượng cơ bản") | xác suất / liệt kê sự kiện · "bốc ít nhất bao nhiêu để chắc chắn" | LT 15.11–15.15 |
| `T14T17` So sánh | **phần hơn** (sách tách phần hơn và phần bù). Tra kho 07/10: `170203`/`170204` cùng TÊN "phần bù" nhưng câu thật khác nhau — `170203` = phần bù cùng tử 1 ($dfrac{33}{34}$ và $dfrac{34}{35}$), `170204` = phần bù khác tử, phải so tiếp ($dfrac{4}{5}$ và $dfrac{7}{9}$) ⇒ nên đổi tên `170204`, và phần hơn vẫn thiếu · viết phân số nằm giữa hai phân số | LT 17.9–17.10, 17.15–17.16 |
| `T14T16` Phân số | tìm $y$ từ hai phân số bằng nhau · phân số bằng nhau / tối giản (nhận biết) · lập phân số theo điều kiện | LT 16.1–16.4, 16.11–16.15 |
| CĐ 23 "Bài toán cơ bản về phân số" | không có chủ đề riêng; câu rơi về `T14T20`/`T14T21`/`T14T22` theo phương pháp | LT 23.1–23.15 |
| `T14T23` Tính ngược (chỉ "chuỗi phép tính") | chuyển qua lại giữa 2–3 người · tính ngược với phân số · bảng (VD 24.3) | LT 24.4–24.17 |

## 6. Hồ sơ nguồn — đếm nhanh để lên kế hoạch nhập

| Phần sách | Số bài (ý nhỏ chưa tách) | Có lời giải mẫu |
|---|---|---|
| VÍ DỤ 24 chuyên đề | ~60 | **Có** ("Bài làm") — dùng làm mẫu, cũng nhập kho với `nguon_giai='nguoi'` |
| LUYỆN TẬP 24 chuyên đề | ~330 | Không — **lô giải chính** (skill 4) |
| 6 Phiếu tự luyện | 30 | Không |
| 35 Phiếu cuối tuần (10 TN + 3 TL mỗi phiếu) | ~455 | Không; Phần I chỉ cần đáp số nhưng kho vẫn cần lời giải |
| Hình | 52 ảnh (`image*.emf/png`) | Câu có hình: cắt từ docx (`word/media/`), chưa vẽ lại |

## 7. NHẬT KÝ SỬA (append-only — CEO sửa gì ghi đó, rồi nâng thành luật ở trên)

| Ngày | Câu | CEO sửa gì | Luật rút ra |
|---|---|---|---|
| 07/10 | Lô 1, câu 7 (dãy số) | Phần 2 của em có dòng "Khoảng cách… là: 16−11=5" và "số khoảng cách… là: 85−1=84" — CEO: *"Cái m đang viết là hướng dẫn. Trình bày không cần viết số khoảng cách hay tính khoảng cách."* Ba ý tách 3 câu thì **mỗi câu vẫn đủ 2 phần**. | §2 CĐ6 sửa: Phần 2 chỉ còn dòng phép tính kết quả `Số hạng thứ 85 của dãy là: $11+(85-1)\times 5=431$`; khoảng cách / số khoảng cách nói ở Phần 1. Áp tương tự CĐ7 (trồng cây): số khoảng cách là bước trung gian **được** ghi vì sách ghi, nhưng "khoảng cách giữa hai cây" không ghi. |
| 07/10 | Lô 1, câu 8 (tổng–hiệu) | CEO hỏi *"m có vẽ được hình không"* ⇒ sơ đồ đoạn thẳng phải là HÌNH, không chỉ mô tả bằng lời. | Có máy vẽ: `scripts/kho/so-do-doan-thang.mjs` (mô tả JSON → SVG). §1.5 sửa: bài có sơ đồ ⇒ Phần 2 ghi `Ta có sơ đồ:` + **hình SVG** (lưu `anh_dap_an`), dòng mô tả bằng lời giữ lại làm alt. |
| 07/10 | Cả lô | *"Sau mỗi câu thì phải xuống dòng."* | §3: mỗi câu lời giải / mỗi phép tính **một dòng riêng** (dòng trống giữa các dòng), kể cả khi trích dẫn trong chat. |
| 07/10 | Cả lô | *"Còn lại khá ổn."* 11/13 câu không sửa. | Giữ nguyên luật §1, §1.5, §2 (trừ CĐ6). |
| 07/10 | Lô 2, câu 4 (LT 5.4 chu vi → tổng–hiệu) | Trả lời câu hỏi gán dạng: *"Giải bằng tổng hiệu thì phải nằm trong dạng tổng hiệu."* | §5 điều 1 + 3: phương pháp thắng chủ đề cùng số. Áp luôn câu 5 (LT 5.9, "tăng rộng thành hình vuông" ⇒ tổng–hiệu rồi tính diện tích): từ dạng chờ ⇒ `080101`. |
| 07/10 | Lô 2, câu 13 (LT 14.13 rút về đơn vị dạng 2) | *"Chung dạng."* | Dạng 1 và dạng 2 của sách cùng `T14T140101`; bỏ "dạng 2" khỏi bảng thiếu §5. |
| 07/10 | Lô 2 cả lô | *"Khá ok rồi."* Không sửa nội dung lời giải câu nào. | Lô 2 = lô đầu tiên không bị sửa trình bày. Chờ CEO quyết lên v1 hay chạy thêm lô 3. |
