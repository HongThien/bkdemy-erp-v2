# kho-rules/dai/k8T.md — SPEC khối 8T (Toán 8 nâng cao / bồi dưỡng HSG — Đại · Số học · Tổ hợp · Hình): KHO + BẢN ĐỒ

> **Trạng thái: NHÁP v0 (10/10/2026) — chưa qua CEO, chưa qua lô thử nào.** Mọi lần giải / soát / ghi câu khối 8T PHẢI đọc file này trước.
> Mỗi lần CEO sửa ⇒ ghi §10 (nhật ký) rồi nâng luật ở §1–§4. Đã đi qua đủ dạng **và** một lô qua CEO không sửa gì ⇒ **v1**.
> **Quy trình 3 bước mọi khối: `kho-rules/README.md` §0.** Khối 8T đang ở **BƯỚC 1** (rút luật giải): B1 đọc ✅ (7 quyển, 1.761 trang scan,
> đọc một lượt 10/10) · B2 hồ sơ sách ✅ (§5 + 7 tệp `lo/k8T/ho-so/`) · B3 luật nháp ✅ (file này) · **kế tiếp: CEO trả lời §9 → lô thử Đ1 (§8)**.
>
> **Phạm vi của context này (Thùy 10/10): xây KHO và BẢN ĐỒ của khối 8T.** Kho = bước 1–2 (rút luật → giải toàn bộ tài liệu vào dạng chờ).
> Bản đồ = §6: file này đưa **khung chuyên đề rút từ 7 quyển sách** làm tư liệu / bản đề xuất; **chia tầng và chốt vẫn là việc của CEO**
> (README §0), soạn trên ERP › Học thuật › Bản đồ mới (`spec-ban-do-4-tang.md` §0).
>
> **Khác 4T (đọc `k4T.md` để thấy khuôn gốc):**
> 1. **Nguồn là 7 QUYỂN sách, toàn bộ là PDF SCAN không có lớp chữ** (4T: một quyển Word, máy đọc thẳng 0 hỏng) ⇒ phải có thêm
>    **trạm chép đề từ ảnh** + nhân chứng thứ hai cho việc chép (§7). Đây là chỗ rủi ro mới của 8T.
> 2. **7 quyển phủ chồng nhau** (cùng một chuyên đề có ở 3–5 quyển, và trùng đề ngay trong một quyển) ⇒ **lọc trùng xuyên sách theo NỘI DUNG**;
>    nhãn bài của sách **không dùng làm khoá một mình** (đánh lại từ 1 ở từng mục, có chỗ nhảy số, trùng số) — §5.3.
> 3. **Phần lớn sách CÓ lời giải / đáp số** (trừ 1 quyển) ⇒ có nhân chứng thứ hai cho đáp số như khối 8; nhưng lời giải sách **tắt**
>    ("Dễ thấy", "Tương tự", chỉ "Đáp số") ⇒ kho vẫn viết lại đủ 2 phần.
> 4. **Ranh giới kiến thức không còn là "cấm kiến thức ngoài SGK"** như 4T/8: lớp T được dùng công cụ bồi dưỡng (Bê-du, đồng dư, Cô-si,
>    Menelaus…). Luật lõi của 8T là **3 tầng kiến thức + thứ tự chuyên đề** (§1) — và danh sách tầng B là việc CEO chốt (§9 Q2).
> 5. **Sách viết theo chương trình CŨ (2006)**: có bất phương trình, phương trình chứa dấu giá trị tuyệt đối, dựng hình, đối xứng trục / tâm,
>    diện tích đa giác, quỹ tích, lăng trụ đứng — không còn ở lớp 8 hiện hành; và **thiếu** hàm số bậc nhất, thống kê – xác suất (§5.4, §9 Q1).
> 6. **Hai nhánh, hai đường ghi** (như khối 8): Đại · Số học · Tổ hợp ⇒ `dai_cau_hoi` khối `8T` · Hình ⇒ `hinh_hoc_*` khối `8T` (kho kiểu 1).

## 0. Nguyên tắc gốc

Lời giải viết **như một học sinh lớp 8 GIỎI viết vào bài thi học sinh giỏi**: mỗi khẳng định có lý do, công cụ nào dùng thì gọi đúng tên,
và **chỉ dùng công cụ đã học tới thời điểm đó** theo thứ tự chuyên đề của bản đồ 8T (§1). Phụ huynh / trợ giảng đọc Phần 1 phải hiểu
*vì sao nghĩ ra* — với bài HSG đây là phần đáng tiền nhất: thêm bớt hạng tử nào, kẻ đường phụ nào, vì dấu hiệu gì trong đề.
Bài chỉ giải được bằng kiến thức lớp 9 trở lên (tầng C) ⇒ **không ghi**, đưa vào danh sách "ngoài 8T" (ứng viên 9T), hỏi CEO (CLAUDE.md §1.5).

## 1. ⭐ LUẬT KIẾN THỨC — 3 TẦNG + THỨ TỰ CHUYÊN ĐỀ (luật quan trọng nhất)

### 1.1 Luật

1. **Tầng A — SGK** (lớp 8 hiện hành, Kết nối tri thức, **theo thứ tự bài** — bảng `k8.md` §1.2 — cộng toàn bộ lớp 4–7): dùng thẳng.
   Luật thứ tự bài của khối 8 (CEO 09/10: *"lúc làm bài Tứ giác không được dùng đường trung bình"*) **giữ nguyên** cho 8T ở tầng này.
2. **Tầng B — CÔNG CỤ BỒI DƯỠNG của 8T** (bảng §1.2): dùng được **từ chuyên đề dạy công cụ đó trở đi**, theo thứ tự chuyên đề của bản đồ 8T;
   khi dùng phải **gọi tên** ("theo định lí Bê-du", "áp dụng bất đẳng thức Cô-si cho hai số dương"). Chưa tới chuyên đề đó mà cần ⇒
   **chứng minh nó ngay trong lời giải** bằng cái đã có rồi mới dùng (luật 3 của `k8.md` §1.1), Phần 1 nói rõ *"bài này chưa được dùng X nên ta tự chứng minh"*.
3. **Tầng C — lớp 9 trở lên** (bảng §1.3): **cấm**, kể cả khi lời giải sách dùng. Lời giải sách không miễn luật (như `k8.md` §1.1 luật 4):
   gặp thì giải lại trong A + B; không giải lại được ⇒ không ghi, vào danh sách "ngoài 8T", ghi rõ sách dùng gì.
4. **Chưa có bản đồ thì chưa có thứ tự** ⇒ ở bước 1–2, **mỗi câu khai công cụ tầng B mình đã dùng**: bản soạn có dòng
   `**Công cụ:** Bê-du · Cô-si hai số` (trống nếu chỉ dùng tầng A), lưu trong tệp lô (`.soan.json` → `cong_cu: []`). Bước 3, khi CEO chốt thứ tự
   chuyên đề, máy so "công cụ câu dùng" với "công cụ đã học tới chỗ câu được xếp" ⇒ ra đúng danh sách câu vi phạm, không phải đọc lại cả kho.
   *(Khai thiếu công cụ = lỗi của trạm soạn; trạm soát đọc từng câu để bắt — máy kiểm đáp số không bắt được lỗi này.)*
5. **Câu trong đề tổng hợp / đề thi HSG** (NDT Phụ lục C, Ôn tập cuối năm): whitelist = hết A + hết B. Vẫn cấm tầng C.
6. Người soát (Opus) đọc từng câu đối chiếu §1.2–§1.3. Lưới thô bằng từ khoá cấm (`--cam` của `nhap_hh_tu_draft.mjs`, mẫu khối 8) — không thay được đọc.

### 1.2 Tầng B — công cụ bồi dưỡng (ĐỀ XUẤT, chờ CEO chốt — §9 Q2). Cột "sách dạy ở" = nơi có lý thuyết + ví dụ để rút khuôn

| Mảng | Công cụ | Sách dạy ở | Ghi chú cách viết |
|---|---|---|---|
| Đa thức | HĐT mở rộng: $(a+b+c)^2$ · $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$ · $a^n-b^n$ · $a^n+b^n$ ($n$ lẻ) · nhị thức Niu-tơn / tam giác Pa-xcan | VHB1 §2 · TVA §2 · TCDS CĐ1 VII | Lần đầu dùng trong một chuyên đề: viết hẳn đẳng thức ra |
| Đa thức | Chia đa thức một biến (đặt tính) · **định lí Bê-du** (dư của $f(x)$ chia $x-a$ là $f(a)$) · **sơ đồ Hoóc-ne** · nghiệm nguyên / hữu tỉ của đa thức hệ số nguyên · **hệ số bất định** · xét giá trị riêng | VHB1 CĐ chia hết đa thức + CĐ phân tích · TVA §1, §2 Dạng 8 · TCDS CĐ1 IV–V | "Nhẩm nghiệm" phải viết ra căn cứ: ước của hệ số tự do / tổng hệ số bằng 0 |
| Số học | Tích $n$ số nguyên liên tiếp chia hết cho $n!$ (dùng với $n=2,3$; lớn hơn thì nêu lý do) · $a^n-b^n\ \vdots\ (a-b)$ · $a^p-a\ \vdots\ p$ · tính chất số chính phương theo số dư khi chia 3, 4, 5, 8 · kẹp giữa hai số chính phương liên tiếp | VHB1 CĐ chia hết số nguyên · TVA §7 · TCDS CĐ3, 7, 8 | — |
| Số học | **Đồng dư thức** $a\equiv b \pmod m$ | TCDS CĐ3 (dùng làm công cụ chính) · TVA §7, §10 | ❓ Q2a: cho viết kí hiệu $\equiv$, hay bắt viết "chia cho $m$ dư $r$" như VHB1 |
| Số học | Phương pháp giải phương trình nghiệm nguyên: đưa về tích / ước số · biểu thị một ẩn rồi dùng chia hết · xét số dư · sắp thứ tự ẩn · kẹp | TCDS CĐ9 (6 phương pháp) · TVA §10 | Luôn **thử lại** nghiệm tìm được |
| Bất đẳng thức | $a^2+b^2\ge 2ab$ · $(a+b)^2\ge 4ab$ · $\dfrac1a+\dfrac1b\ge\dfrac4{a+b}$ ($a,b>0$) · $a^2+b^2+c^2\ge ab+bc+ca$ · $2(a^2+b^2)\ge(a+b)^2$ · làm trội – làm giảm | VHB2 CĐ BĐT · TVA §8 · TCDS CĐ4 | Mỗi lần dùng: nêu **điều kiện dấu bằng** |
| Bất đẳng thức | **Cô-si** hai số, ba số · **Bu-nhi-a-cốp-xki** | TCDS CĐ4 III · TVA §8 Cách 5 · VHB2 | ❓ Q2b: Cô-si phát biểu có $\sqrt{ab}$ là lớp 9 — cho dùng dạng **không căn** ($\left(\dfrac{a+b}2\right)^2\ge ab$, $a+b\ge 2$ khi $ab=1$…) hay cho cả dạng căn |
| Cực trị | Định nghĩa GTLN / GTNN gồm **hai** điều kiện: bất đẳng thức với mọi giá trị **và** tồn tại giá trị để dấu bằng xảy ra (VHB2, đầu chuyên đề: chỉ có điều kiện thứ nhất thì *chưa* kết luận được) | VHB2 CĐ cực trị · TCDS CĐ5 · TVA §8 Dạng 2 | Luật trình bày, không phải công cụ — bắt buộc ở mọi bài cực trị |
| Tổ hợp | Nguyên lí **Đi-rích-lê** · nguyên lí cực hạn · phản chứng · bất biến, tô màu | TCDS CĐ10 · TVA §7 Dạng 2 · NDT Phụ lục | Phải chỉ rõ "thỏ" là gì, "lồng" là gì |
| Hình | Đường trung bình của **hình thang** · **hệ quả** định lí Ta-lét · **bổ đề hình thang** · tính chất "nửa tam giác đều" (cạnh đối diện góc $30^\circ$) | VHB1 §2 · VHB2 §13–14 · TCHH CĐ1 C, CĐ4, CĐ7 | Các kết quả này SGK hiện hành không có — ở khối 8 thường phải tự chứng minh (`k8.md` §1.2) |
| Hình | **Phương pháp diện tích** (hai tam giác chung đường cao: tỉ số diện tích = tỉ số đáy; tỉ số diện tích hai tam giác đồng dạng) · công thức diện tích hình thang, hình bình hành, hình thoi | VHB1 §12 + CĐ diện tích · NDT Hình II · TCHH CĐ7 | — |
| Hình | Định lí **Mê-nê-la-uýt**, **Xê-va** | TCHH CĐ4 (có chứng minh) · TUHOC B6 Bài 134–154 | ❓ Q2c: cho dùng thẳng, hay mỗi bài phải chứng minh lại bằng Ta-lét |
| Hình | Đối xứng trục, đối xứng tâm (làm công cụ cực trị, chứng minh) | VHB1 §4, §6 · NDT Hình I §4–5 | Kho Hình 8T đã có bài "Đối xứng tâm" (HH00094) ⇒ đang coi là kiến thức 8T |

### 1.3 Tầng C — cấm ở 8T (gặp trong lời giải sách ⇒ giải lại hoặc không ghi). Đã thấy trong 7 quyển:

| Kiến thức lớp 9+ | Sách dùng ở | Xử lý |
|---|---|---|
| Căn bậc hai làm công cụ biến đổi (khai căn, trục căn, $\sqrt{A^2}=\lvert A\rvert$) · căn bậc ba | TCHH CĐ6 Bài 1, 4 · VHB2 (Cô-si, Hê-rông) | Số $\sqrt2$, $\sqrt3$ xuất hiện như **độ dài** (đường chéo hình vuông, Pythagore) thì được; **biến đổi căn** thì không |
| Phương trình bậc hai giải bằng $\Delta$ · hệ thức Vi-ét | TCHH CĐ6 Bài 1 | Tam thức phân tích được thành nhân tử ⇒ giải như phương trình tích (tầng A) |
| Hệ thức lượng trong tam giác vuông gọi tên ($h^2=b'c'$, $\dfrac1{h^2}=\dfrac1{b^2}+\dfrac1{c^2}$) · tỉ số lượng giác | TCHH CĐ1 A Bài 13, CĐ2 VD8c–Bài 9, CĐ3 II Bài 15–16 · TUHOC B7 Bài 107 | Chứng minh được bằng tam giác đồng dạng ⇒ **tự chứng minh trong lời giải** (luật 2) khi câu đã ở sau chuyên đề Đồng dạng |
| Đường tròn: góc nội tiếp, tứ giác nội tiếp, tiếp tuyến, đường tròn nội / ngoại tiếp | TCHH CĐ4 Bài 11, CĐ5 Bài 8, CĐ6 Bài 1, 5 (sách tự ghi "kiến thức lớp 9") | Không ghi — danh sách "ngoài 8T" |
| Hệ phương trình bậc nhất hai ẩn giải bằng thế / cộng đại số như một bài học | rải rác | Hệ phát sinh trong bài: giải bằng **rút một ẩn rồi thế**, viết từng dòng — được; không gọi tên phương pháp lớp 9 |
| Bất đẳng thức Ơ-đốt – Moóc-đen, công thức Hê-rông, đường thẳng Ơ-le, điểm Giéc-gôn | TCHH CĐ4, CĐ6 | Là **đề bài** (chứng minh công thức) thì xét từng câu; là công cụ thì cấm |

### 1.4 Nội dung sách có mà KHÔNG thuộc lớp 8 hiện hành (không phải lớp 9 — là chương trình cũ) — ❓ Q1: 8T có học không

Bất phương trình bậc nhất một ẩn, bất phương trình tích / thương · phương trình và bất phương trình chứa dấu giá trị tuyệt đối ·
dựng hình bằng thước và compa · tìm tập hợp điểm (quỹ tích) · đa giác, diện tích đa giác (chương riêng) · hình hộp chữ nhật, lăng trụ đứng,
hình chóp cụt đều. Số bài: §6. **v0: KHÔNG chép, KHÔNG giải các khối này cho tới khi CEO trả lời Q1** — riêng *phương pháp diện tích* và
*đối xứng* đã xếp vào tầng B vì các chuyên đề khác cần tới.

## 2. Mỗi lời giải CHIA 2 PHẦN (luật chung README §3) — điểm riêng của 8T

> Giữ nguyên README §3: `**Phần 1. Hướng dẫn**` = `**Mấu chốt:**` → **3–6** đoạn `**Bước k.**` (mỗi bước một card, một ý trọn vẹn, không lộ đáp số) →
> `**Chú ý:**`; `**Phần 2. Trình bày**` = đúng cái HS viết vào bài thi. **Mọi câu** đủ 2 phần. Máy kiểm hình thức: `scripts/kho/sach/kiem-p1-card.mjs`.

- **Phần 1 của bài HSG phải trả lời "vì sao nghĩ ra"**, không chỉ "làm gì". Nguyên liệu có sẵn trong sách: mục **"Phân tích" / "Hướng dẫn tìm lời
  giải"** (TCHH CĐ1 mục C, CĐ3: *"Khi có góc bằng $60^\circ$, ta nghĩ đến việc vận dụng nửa tam giác đều… Từ đó gợi ý cho ta hạ $DH\perp AC$"*),
  **"Nhận xét"** trước lời giải (TCDS CĐ1: *"$x=\pm1,\pm5$ không là nghiệm… nên nếu có nghiệm thì là nghiệm hữu tỉ"*), **"Chú ý"** (VHB).
  Cặp "Phân tích → Giải tóm tắt" của TCHH chính là cặp Phần 1 → Phần 2 của kho — lấy làm mẫu lối viết Hình 8T.
  *(R7: đây là "phân tích – tổng hợp", Pólya gọi là working backwards — `k8.md` §1.6.)*
- **Hình: theo `k8.md` §1.6 và §10** — ý **Tính** ⇒ Phần 1 viết lời; ý **Chứng minh** ⇒ Phần 1 là các bước **phân tích đi lên** ("muốn có X, cần Y") đặt
  trong card, Phần 2 trình bày ngược lại, mỗi dòng có **căn cứ trong ngoặc** ("(gt)", "(c.g.c)", "(hệ quả định lí Ta-lét)"). **Đường phụ**: Bước 1 của
  Phần 1 luôn là "kẻ gì, vì dấu hiệu nào trong đề". **Hình không tách ý** (CEO 21/09).
- **Bài nhiều cách** (sách hay cho "Cách 1 … Cách 5"): Phần 2 trình bày **một** cách; cách khác đáng dạy nhắc **một câu** ở `**Chú ý:**` (như `k4T.md` §1).
  Dạng nào có nhiều cách ngang nhau ⇒ đưa vào bảng §2b, **CEO chốt một cách chính** (tiền lệ `k5T.md` §2b).
- **Tách ý** (README §3): chỉ tách bài **Tính / Rút gọn / Phân tích thành nhân tử / Tìm $x$ (giải phương trình)** có các ý độc lập — mỗi ý một câu.
  Quyển TUHOC phần Đại là đúng loại này ("Bài 5: Tìm $x$, biết 1) … 36) …") ⇒ **đơn vị câu = Ý**. Bài chứng minh nhiều ý, bài lời văn, bài hình: giữ một câu.
- **Không viện dẫn sách** trong lời giải ("theo ví dụ 28", "xem bài 140b") — HS không có cuốn sách; sách viện dẫn chéo rất nhiều (NDT, VHB, TCHH CĐ7)
  ⇒ kết quả được viện dẫn phải **chứng minh lại tại chỗ** hoặc là công cụ tầng B gọi được tên.

### 2a. Khuôn Phần 2 theo CHUYÊN ĐỀ (nháp v0 — rút từ ví dụ có lời giải của sách; chốt qua các lô thử §8)

| Chuyên đề | Khuôn Phần 2 | Mấu chốt / bẫy phải nói ở Phần 1 |
|---|---|---|
| Phân tích thành nhân tử (tách · thêm bớt · đổi biến · hệ số bất định · nhẩm nghiệm · hoán vị vòng) | Chép đề `=` … mỗi phép biến đổi **một dòng**, dòng tách / thêm bớt viết tường minh ($3x^2-7x+17x-5=3x^2-x-6x^2+2x+\dots$) → kết quả. Nhân tử bậc hai còn lại: thêm dòng "vì $x^2-2x+5=(x-1)^2+4>0$ nên không phân tích tiếp được" | Dấu hiệu chọn phương pháp: tổng hệ số bằng 0 ⇒ có nhân tử $x-1$; tổng hệ số bậc chẵn = tổng hệ số bậc lẻ ⇒ $x+1$; không có nghiệm nguyên ⇒ thử nghiệm hữu tỉ $\dfrac pq$; dạng $(x+a)(x+b)(x+c)(x+d)+e$ ⇒ nhóm cặp có tổng bằng nhau rồi đặt ẩn; đa thức hoán vị vòng ⇒ thử $a=b$ |
| Chia đa thức · Bê-du · tìm hệ số để chia hết / dư cho trước | "Gọi thương là $Q(x)$, ta có $f(x)=(x-a)Q(x)+r$ với mọi $x$" → thay $x=a$ → giải ra hệ số → "Vậy …" | Chia cho tích $(x-a)(x-b)$ ⇒ dư bậc nhất $mx+n$, thay hai giá trị. Ba cách (đặt tính · hệ số bất định · giá trị riêng) — ❓ §2b |
| Tính giá trị / chứng minh đẳng thức **có điều kiện** (đối xứng, hoán vị vòng, $a+b+c=0$, $xyz=1$, tỉ lệ thức) | "Từ giả thiết … suy ra …" → biến đổi biểu thức cần tính theo giả thiết, mỗi dòng một bước → "Vậy $A=\dots$" | Khai thác giả thiết **trước** (phân tích giả thiết thành nhân tử, bình phương hai vế, thế $c=-a-b$). Mẫu bằng 0 phải loại: nêu điều kiện |
| Phân thức, biểu thức hữu tỉ, tổng có quy luật | "ĐKXĐ: …" → rút gọn từng dòng → trả lời từng yêu cầu a) b) c). Tổng dạng dãy: viết số hạng tổng quát thành **hiệu hai phân thức** rồi "cộng theo vế" | Tìm $x$ nguyên để phân thức nguyên: tách phần nguyên rồi xét ước; **đối chiếu ĐKXĐ** trước khi kết luận |
| Phương trình (bậc nhất, tích, chứa ẩn ở mẫu, có tham số, bậc cao) | ĐKXĐ (nếu có) → biến đổi `\Leftrightarrow` từng dòng → đối chiếu "(nhận)" / "(loại)" → "Vậy tập nghiệm của phương trình là $S=\{\dots\}$". Có tham số: chia trường hợp theo hệ số của $x$ | Bậc cao: đưa về tích hoặc đặt ẩn phụ (đối xứng: chia hai vế cho $x^2$ sau khi xét $x=0$). Biện luận $ax=b$: đủ ba trường hợp |
| Giải bài toán bằng cách lập phương trình | "Gọi … là $x$ (đơn vị; điều kiện)" → biểu diễn các đại lượng → lập phương trình → giải → đối chiếu điều kiện → trả lời | Chọn ẩn là đại lượng đề **hỏi**; chuyển động: lập bảng $s$–$v$–$t$ ở Phần 1 |
| Chia hết với số nguyên | Biến đổi biểu thức thành tích / tổng các số hạng chia hết, mỗi số hạng **kèm lý do** ("tích ba số nguyên liên tiếp nên chia hết cho 6") → "Vậy $A\ \vdots\ m$ với mọi $n\in\mathbb Z$" | $m$ hợp số ⇒ tách thành các thừa số **nguyên tố cùng nhau** rồi chứng minh từng cái; hoặc xét các số dư của $n$ khi chia cho $m$ |
| Số nguyên tố · số chính phương | Xét trường hợp theo số dư / theo $p=2$, $p=3$, $p>3$ → loại dần → kết luận. Chứng minh không chính phương: chỉ ra số dư mà số chính phương không có, hoặc kẹp $k^2<A<(k+1)^2$ | "Tìm $n$ để … là số chính phương": đặt $=k^2$ rồi đưa về tích hai số nguyên |
| Phương trình nghiệm nguyên | Biến đổi về dạng tích $=$ hằng số → lập **bảng** các trường hợp ước → "Thử lại: …" → "Vậy các nghiệm nguyên $(x;y)$ là …" | Nêu rõ phương pháp chọn và vì sao (hệ số nào chia hết, ẩn nào bậc nhất…). Không sót ước **âm** |
| Bất đẳng thức | Biến đổi tương đương: "$\Leftrightarrow$" tới bất đẳng thức hiển nhiên đúng **rồi viết** "bất đẳng thức cuối đúng nên bất đẳng thức đã cho đúng"; hoặc xuất phát từ bất đẳng thức đúng. Dòng cuối: "Dấu bằng xảy ra khi …" | Biến đổi tương đương chỉ hợp lệ khi **mọi** bước là $\Leftrightarrow$ (nhân hai vế với số dương thì nói rõ dương) |
| Tìm GTLN, GTNN | "$A=(\dots)^2+c\ge c$ với mọi $x$" → "Dấu bằng xảy ra khi $x=\dots$" → "Vậy GTNN của $A$ là $c$, đạt được khi $x=\dots$" — **đủ hai điều kiện** (§1.2) | $A\ge 0$ chưa chắc $\min A=0$ (VHB2: $A=(x-1)^2+(x-3)^2$). Có ràng buộc: thế ràng buộc vào trước |
| Đi-rích-lê, cực hạn | "Xét … (thỏ). Chia thành … (lồng)." → áp dụng nguyên lí → kết luận | Phần 1: cách **chọn lồng** là toàn bộ bài toán |
| Hình — chứng minh | Theo `k8.md` §1.6: "Xét $\triangle\dots$ và $\triangle\dots$ có: … (lý do)" ⇒ … ; mỗi mũi tên của Phần 1 = một bước | Đường phụ + vì sao. Căn cứ nào cũng phải thuộc A hoặc B |
| Hình — tính (góc, độ dài, diện tích) | Các dòng tính, mỗi dòng kèm căn cứ trong ngoặc; đặt ẩn lập phương trình thì "Đặt $EC=x$ ($x>0$)" | Tính góc bằng kẻ thêm tam giác đều / vuông cân / nửa tam giác đều (TCHH CĐ1 C, 5 dạng) |
| Cực trị hình học | Chứng minh $d\ge d_0$ (hoặc $\le$) với mọi vị trí → chỉ ra vị trí đạt được → kết luận vị trí của điểm | Như cực trị đại số: phải có vị trí **đạt** dấu bằng |

### 2b. Dạng có NHIỀU CÁCH — CEO chốt MỘT cách chính (điền dần qua các lô thử)

| # | Dạng | Các cách sách đưa | Claude đề xuất | Chốt |
|---|---|---|---|---|
| A | Tìm hệ số để đa thức chia hết / có dư cho trước | ① đặt tính chia · ② hệ số bất định · ③ giá trị riêng (Bê-du) — TVA §1 | ③ khi số chia có nghiệm dễ thấy; ② khi không | |
| B | Chứng minh bất đẳng thức đại số | ① định nghĩa (xét hiệu) · ② biến đổi tương đương · ③ bất đẳng thức quen thuộc · ④ đổi biến — TVA §8, TCDS CĐ4 | ① xét hiệu là cách mặc định (an toàn về lập luận) | |
| C | Tìm GTNN của tam thức / đa thức hai biến | ① tách thành tổng bình phương · ② đổi biến · ③ miền giá trị | ① | |

## 3. Định dạng (giữ quy ước kho Đại — README §3, `k8.md` §3; chỉ ghi phần riêng 8T)

- **Dấu nhân:** sách dùng dấu chấm ($AB.AC$, $4.100^3$) ⇒ chuẩn hoá như khối 8 (CEO 09/10): giữa **hai số** `\cdot`; số–chữ, chữ–chữ, ngoặc–ngoặc viết liền;
  tích độ dài $AB\cdot AC$. Cổng `--khoi 8` đã chặn `\times` và dấu chấm làm dấu nhân — dùng lại cho 8T.
- **Chia hết** `\vdots` ($A\ \vdots\ 6$), **không chia hết** `\not\vdots`. Đồng dư (nếu Q2a cho): `a\equiv b \pmod{m}`. Ước chung lớn nhất viết chữ
  "ƯCLN$(a;b)$" (memory `luong-b-claude-tu-giai`: không `\gcd`).
- Giá trị tuyệt đối `\lvert x\rvert` (không gõ `|x|` trần — lẫn với ô bảng markdown; trạm chép đã dính, xem hồ sơ TVA §3 bảng bài tập).
- Hệ, tuyển: `\begin{cases}…\end{cases}`, `\left[\begin{array}{l}…\end{array}\right.`. Tập nghiệm $S=\{\dots\}$; nghiệm nguyên $(x;y)$ ngăn bằng `;`.
- Hình: `\widehat{ABC}`, `\triangle`, đồng dạng `\backsim`, song song `\parallel` (sách gõ `//`), vuông góc `\perp`. Chính tả thuật ngữ **thống nhất**:
  "Ta-lét", "Pythagore", "Đi-rích-lê", "Bê-du", "Hoóc-ne", "Cô-si", "Mê-nê-la-uýt", "Xê-va" (sách viết lẫn Thales / Talet / Ta-let, Dirichlet / Drichlet… —
  không thống nhất thì lọc trùng và tìm từ khoá cấm đều hỏng). ❓ Q5: CEO muốn phiên âm hay tên gốc.
- Đáp án (`dap_an`): phân tích nhân tử ⇒ tích cuối cùng; phương trình ⇒ `$S=\{…\}$`; nghiệm nguyên ⇒ liệt kê cặp; cực trị ⇒ "GTNN bằng … khi …";
  chứng minh ⇒ để trống (không có đáp án ngắn).
- Nguồn đề in dưới đề ("Đề thi HSG huyện … 2015–2016", "Toán tuổi thơ") ⇒ **giữ** trong ngoặc đầu đề, như 50 câu 8T đang có ("(Chuyên Trà Vinh 2016 – 2017)").

## 4. Kiểm trước khi ghi

- **Kiểm CHÉP (mới của 8T — nguồn là ảnh):** đề trong kho phải khớp ảnh trang. Hai lượt chép độc lập (hai model khác nhau) → máy so từng công thức
  sau chuẩn hoá → lệch ⇒ model thứ ba / người mở ảnh quyết. Số mũ, chỉ số dưới, dấu $\vdots$ nhoè, "l" ↔ "1", dấu trừ mất là các chỗ scan hay sai
  (hồ sơ NDT §6, TCHH §6). **Chép sai đề thì mọi trạm sau đều đúng với một đề sai** — đáp số vẫn "khớp".
- **Hai nhân chứng cho đáp số:** (a) lời giải / đáp số của sách (chép nguyên văn ở trạm chép, **trạm soạn không được xem trước khi giải xong** — soát mù như K6) ·
  (b) **máy tính lại từ ĐỀ** — `kho-rules/dai/lo/k8T-kiem.mjs`, viết TRƯỚC khi mở bản soạn:
  phân tích nhân tử / rút gọn / đẳng thức ⇒ thay ≥ 5 bộ số hữu tỉ ngẫu nhiên (phân số BigInt, như `k8.md` §4) · phương trình ⇒ thay nghiệm + quét nghiệm hữu tỉ ·
  nghiệm nguyên ⇒ **vét cạn** một miền đủ rộng, so tập nghiệm · chia hết / số chính phương / số nguyên tố ⇒ thử $n$ trong một đoạn dài ·
  bất đẳng thức ⇒ thử lưới + ngẫu nhiên (chỉ **bác** được, không chứng minh được) + kiểm điểm dấu bằng · cực trị ⇒ lưới số + kiểm điểm đạt ·
  hình ⇒ dựng toạ độ ≥ 2 bộ cho điểm "bất kì" (kho kiểu 1).
- **Lệch (a) với (b) ⇒ không ghi**, vào danh sách "sách in sai?". Đã thấy: NDT Phụ lục C Đề 9 bài 2a (cách 2 ghi dư 1987, các cách khác 2002) ·
  TCHH CĐ1 B Bài 1 (đề in $2AB$, lời giải $2BC$) · TVA §10 (lời giải số 13 là của đề bài 26).
- **Bài chứng minh:** máy không xác nhận được lập luận ⇒ **Opus soát mù** là nhân chứng chính; máy chỉ kiểm *mệnh đề* (thử số / toạ độ) để bắt đề chép sai.
- **Quyển TUHOC không có lời giải** ⇒ không có (a): đáp số = máy (b) + **hai lượt giải độc lập** khớp nhau; bài chứng minh hình ⇒ chỉ có soát mù.
- Whitelist (§1): máy không kiểm được; lưới từ khoá cấm + người soát đọc từng câu + dòng `**Công cụ:**`.

## 5. Hồ sơ nguồn (B1–B2 làm 10/10)

**Thư mục:** `E:\BK ACADEMY\Tài liệu tham khảo\8T\HSG\` — 7 PDF, **1.761 trang, scan 100%** (`pdftotext` ra 0 ký tự; quyển TUHOC có vài chữ rác).
Đọc bằng cách dựng ảnh trang (`pdftoppm`) rồi model đọc ảnh — máy này không có khoá Gemini cho `boc-pdf.mjs`, và `boc-pdf.mjs` giới hạn 18 MB/tệp (các quyển 30–130 MB).

### 5.1 Bảy quyển — hồ sơ đầy đủ từng quyển ở `kho-rules/dai/lo/k8T/ho-so/<MÃ>.md` (mục lục theo trang PDF · khuôn · từng chuyên đề: dạng, đếm, kiến thức dùng · lời giải mẫu · bẫy đọc)

| Mã | Sách | Trang PDF | Mảng | Ví dụ có lời giải | Bài tập | Lời giải bài tập |
|---|---|---:|---|---:|---:|---|
| **VHB1** | Nâng cao và phát triển Toán 8, tập 1 — Vũ Hữu Bình (NXB Giáo dục VN) | 226 | Đại · Số học · Hình | 89 | 445 (Đại 275 · Hình 170) | Cuối sách (PDF 117–226); không đều: đủ / tắt / chỉ đáp số / "bạn đọc tự chứng minh" |
| **VHB2** | — tập 2 | 249 | Đại · Hình | 101 | 386 (Đại 179 · Hình 207) | Cuối sách (PDF 138–249); như tập 1 |
| **TCDS** | Tuyển chọn các chuyên đề bồi dưỡng HSG Toán 8 — Đại số — Trương Quang An, Văn Phú Quốc (NXB ĐHQG HN, 2018) | 380 | Đại · Số học · Tổ hợp | 229 | 729 | Ngay sau từng bài; phần lớn tắt / chỉ kết quả |
| **TCHH** | — Hình học — Trần Quang Hùng (chủ biên) | 234 | Hình | 151 | 190 | Ngay sau từng bài (CĐ1–3); **30 bài CĐ4–6 chỉ có đề** |
| **NDT** | Chuyên đề bồi dưỡng HSG Toán 8 — Nguyễn Đức Tấn, Nguyễn Anh Hoàng, Nguyễn Đoàn Vũ (NXB Tổng hợp TP.HCM, 2016) | 330 | Đại · Hình · Số học | 3 | 650 (≈ 1.140 ý, ước) | **Ngay sau từng bài, đủ bước** — quyển có lời giải đầy đủ nhất; 3 tầng cơ bản / nâng cao / đề thi HSG có ghi nguồn |
| **TVA** | Bồi dưỡng HSG Toán Đại số 8 — Trần Thị Vân Anh (NXB ĐHQG HN, 2010) | 231 | Đại · Số học | ≥ 309 | 304 (+ 18 "tự giải" không đáp số) | Cuối từng chuyên đề; tắt ở §1, §5, §6, §10. **Ví dụ chia sẵn theo "Dạng k" + "Phương pháp chung"** |
| **TUHOC** | Bồi dưỡng năng lực tự học Toán 8 — nhóm GV Thăng Long, Đặng Đức Trọng chủ biên (NXB ĐHQG TP.HCM) | 111 ảnh = 219 trang sách (2 trang / ảnh) | Đại · Hình | 0 | Đại ≈ 194 bài = **≈ 3.429 ý** · Hình 706 bài · 136 câu trắc nghiệm | **Không có** (chỉ bảng đáp án chữ cái của 136 câu trắc nghiệm) — ngân hàng đề thuần |
| | **Cộng** | **1.761** | | **≈ 882** | **≈ 2.720 bài có nhãn + TUHOC ≈ 1.036 bài (≈ 5.300 ý)** | |

*(Số đếm là của hồ sơ — đếm theo nhãn bài trên ảnh, do agent Sonnet lập, tôi đối chiếu ảnh gốc ở 10 trang rải cả 7 quyển (mục lục 3 quyển + 7 trang nội dung): khớp. Số chính xác từng bài chỉ có sau trạm chép đề §7.
"Bài" chưa tách ý; số ý Hình của TUHOC ≈ 1.720 là ước.)*

### 5.2 Độ tin của hồ sơ — phần nào CHƯA được đọc lại lần hai (agent ghi theo ghi chép lượt đọc đầu, ảnh sau đó bị gỡ khỏi ngữ cảnh)

VHB1 phần đề Hình PDF 66–116 (chỉ kiểm lại 19 trang) · VHB2 PDF 9–78 · TCDS chuyên đề 1, 2, 4–8 · NDT Đại số PDF 5–100 · TVA PDF 58–166 · TUHOC ảnh 69–88.
Đủ dùng để lập kế hoạch và khung chuyên đề; **không dùng làm số liệu nhập kho** — trạm chép đề đếm lại theo từng bài.

### 5.3 Bẫy đọc / lỗi của nguồn (trạm chép phải xử lý, không đoán — CLAUDE.md "danh tính bám khoá tự nhiên")

- **Bản scan THIẾU trang:** VHB1 — đề bài tập Đại **142–159** (giữa PDF 32 và 33, đã mở ảnh xác nhận), ví dụ 43–45 + đầu ví dụ 46, đề bài tập Hình **41–46** + đầu §5 Hình bình hành
  (lời giải của các bài này vẫn có ở cuối sách) · TVA — trang sách **32–33** (cuối §2 Dạng 8) · TCHH — trang sách 4 và 234 (không có bài). ⇒ ❓ Q6: CEO có bản đủ trang không.
- **Nhãn bài không dùng làm khoá một mình:** đánh lại từ 1 ở từng mục (TCDS, TCHH, TVA, TUHOC, NDT theo chương) · hai dãy số trùng nhau (VHB: Đại và Hình cùng dùng số 60–377) ·
  nhảy / lặp nhãn (TCHH CĐ1 C thiếu Bài 14, CĐ3 II có hai "Bài 14"; TCDS CĐ2 thiếu Bài 9, CĐ4 hai "Bài 11"; TVA §8 hai "Ví dụ 2").
  ⇒ **mã nguồn của một bài = `<MÃ sách>/<mục>/<loại><số>[<ý>]@p<trang PDF>`** (vd `TCHH/CD3-II/BT14@p152`, `VHB2/DAI/BT358`, `TUHOC/A6/B5.17`); trang PDF là phần của khoá.
- **Trùng đề:** ngay trong một quyển (TCHH: ≥ 11 cặp giữa CĐ1–2–3–5; NDT: Phụ lục C lặp Phụ lục A, B và Ôn tập cuối năm; TUHOC: A3 ↔ A7 cùng danh sách biểu thức; TCDS CĐ9 một đề ở hai phương pháp)
  và chắc chắn **giữa các quyển** (cùng lấy đề HSG các tỉnh) ⇒ lọc trùng theo nội dung sau chuẩn hoá (`chuanDe` của `dau-vao-soan.mjs`) trên **toàn bộ 7 quyển + kho khối 8 (~2.700 câu) + 50 câu 8T**.
- **Lời giải nằm xa đề** (VHB cuối sách, TVA cuối chuyên đề) ⇒ trạm chép ghép đề ↔ lời giải theo số bài **và** kiểm bằng nội dung (TVA §10: lời giải 13 thực ra của bài 26).
- **Đề Hình hầu như không kèm hình** (cả 5 quyển có Hình) — hình chỉ nằm trong lời giải ⇒ hình của câu **vẽ bằng code từ đề** (`scripts/anh/ve_hinh_lib.mjs`, memory `hh-hinh-de-ve-bang-code`),
  hình trong sách chỉ để đối chiếu. Ngoại lệ có hình trong đề: TCHH CĐ3 II VD1 · một số bài cơ bản NDT Hình III §1–3, Hình IV · 3 hình trắc nghiệm TUHOC.
- **Mép trang bị cắt:** TVA (mép trái mất 1–2 chữ ở nhiều trang; khung lý thuyết nền xám khó đọc) · TUHOC (dòng đầu trang sách 123–125, 128–129, 190, 198; rìa phải trang 203).
- **Viện dẫn chéo bằng số bài không còn khớp** (NDT "xem bài 140b", "bài 212"; TCHH CĐ7 "theo Bài toán 1, 2, 16"; VHB "~ Bài tập: 463 đến 465" trỏ sang tập khác) ⇒ bỏ khi chép, lời giải phải tự đủ (§2).
- **Nhãn "(n)" sau số bài của VHB** ("Ví dụ 103 (11)") = số § kiến thức mà bài cần — hai agent suy ra độc lập, khớp nhau ⇒ dùng được làm gợi ý xếp chuyên đề; dấu `*` = bài khó.

### 5.4 Sách có gì so với lớp 8 hiện hành

- **Thiếu hẳn:** hàm số bậc nhất và đồ thị · thống kê, xác suất · định lí Pythagore như một bài học (chỉ dùng làm công cụ) · hình chóp tam giác đều / tứ giác đều theo cách dạy mới.
- **Thừa (chương trình cũ):** §1.4.  **Vượt (bồi dưỡng HSG):** §1.2.  **Lớp 9 lọt vào:** §1.3.

## 6. Hiện trạng DB + KHUNG CHUYÊN ĐỀ rút từ sách (tư liệu cho bản đồ — chia tầng là việc của CEO)

### 6.1 Đang có trên DB (đo live 10/10, phiên chỉ đọc)

- **Bản đồ cũ** `dai_ban_do` khối `8T`: 1 chủ đề "Biến đổi biểu thức" · 3 chuyên đề · **3 dạng**: `T18T010101` ứng dụng HĐT bình phương tổng hiệu (0 câu) ·
  `T18T010201` các phương pháp phân tích cơ bản (0 câu) · `T18T010301` biến đổi các biểu thức đặc biệt (**50 câu, 50 đã duyệt**, nguồn `de_thi`, lời giải người viết, **không có 2 phần**).
- **Bản đồ mới** (`dai_bdm_*`): đã chép vỏ — 1 chủ đề, 3 chuyên đề, 3 nhóm (`NNB01382`–`NNB01384`), **0 dạng bài, 0 lý thuyết**.
- **Chưa có dạng chờ** `T18T000000` ⇒ phải tạo trước bước 2 (§8 việc #1). Khối 8 thường: ~2.700 câu Đại (lọc trùng), dạng chờ `T108000000`.
- **Hình** `hinh_hoc_bai` khối `8T`: 6 bài `HH00089`–`HH00094` (Hình thang 0 câu · Hình bình hành 11 · Hình chữ nhật 11 · Hình thoi 7 · Hình vuông 15 · Đối xứng tâm 4) —
  **48 câu, đều đã duyệt, 0 bài có lý thuyết** (`hinh_hoc_bai_ly_thuyet` trống ⇒ chưa có whitelist theo bài). Chưa có dạng chờ Hình 8T.

### 6.2 Khung chuyên đề của 7 quyển (số trong ngoặc = ví dụ + bài tập theo hồ sơ; TUHOC ghi bài / ý)

| # | Chuyên đề (gom theo nội dung) | Có ở sách | Lớp 8 hiện hành? |
|---|---|---|---|
| **ĐẠI SỐ** | | | |
| 1 | Nhân đa thức · hằng đẳng thức (cơ bản → mở rộng) | VHB1 §1–2 (8+59) · NDT Đại I §1–2 (26) · TUHOC A1 (20 bài / 391 ý) | Có + tầng B |
| 2 | Phân tích đa thức thành nhân tử (cơ bản · tách · thêm bớt · đổi biến · hệ số bất định · nhẩm nghiệm · hoán vị vòng · đa thức đặc biệt) | VHB1 §3 + chuyên đề (18+36) · TCDS CĐ1 (30+36) · TVA §2 (≥43+54) · NDT Đại I §3–5 (34) · TUHOC A2, A3 (27 / 812) | Có + tầng B |
| 3 | Chia đa thức · Bê-du · Hoóc-ne · chia hết của đa thức · tìm hệ số | VHB1 §4 + chuyên đề (12+32) · TVA §1 (9+22) · TCDS CĐ3 mục V (4+23) · NDT Đại I §6–7 (21) | Tầng B (chia đa thức một biến nay ở lớp 7) |
| 4 | Phân thức · biến đổi biểu thức hữu tỉ · tổng có quy luật | VHB1 §5–6 (9+75) · TCDS CĐ2 (17+60) · TVA §3 (30+46) · NDT Đại II (52) · TUHOC A4 (12 / 206) | Có |
| 5 | **Biến đổi biểu thức đặc biệt**: tính giá trị / chứng minh đẳng thức có điều kiện (đối xứng, hoán vị vòng, $a+b+c=0$, tỉ lệ thức, hệ đối xứng, tổng sai phân) | TUHOC A10 (**12 dạng sách đặt tên, 464 ý**) · TCDS CĐ2 Dạng 2–4 · VHB1 §2, §6 · *đã có nhóm trên bản đồ, 50 câu* | Tầng B |
| 6 | Phương trình: bậc nhất · tích · chứa ẩn ở mẫu · có tham số · bậc cao | VHB2 §7–9 (14+24) · TCDS CĐ6 phần A.1–A.2 · TVA §4 (45+30) · NDT Đại III §1–4 (49) · TUHOC A5–A8 (25 / 581) | Có (bậc nhất) + tầng B (tham số, bậc cao) |
| 7 | Giải bài toán bằng cách lập phương trình | VHB2 §10 (2+20) · TVA §5 (19+23+13) · NDT Đại III §5 (14) · TUHOC A11 (67) | Có |
| 8 | Bất đẳng thức | VHB2 §11 + chuyên đề (17+69) · TCDS CĐ4 (25+83) · TVA §8 Dạng 1 (38 ví dụ) · NDT Đại IV §1 (14) | Tầng B |
| 9 | Tìm giá trị lớn nhất, nhỏ nhất | VHB2 chuyên đề (20+37) · TCDS CĐ5 (22+63) · TVA §8 Dạng 2 (35 ví dụ; bài tập chung 38 với #8) · VHB1 §2 | Tầng B |
| 10 | Bất phương trình · phương trình, bất phương trình chứa dấu giá trị tuyệt đối | VHB2 §12–15 (10+29) · TCDS CĐ6 A.3 + B · TVA §6 (29+7) · NDT Đại IV §2–3 (28) · TUHOC A9 (32 / **908**) | **Không** (§1.4, Q1) |
| **SỐ HỌC** | | | |
| 11 | Chia hết với số nguyên · số dư · chữ số tận cùng | VHB1 chuyên đề (12+73) · TCDS CĐ3 mục I–IV (17+96) · TVA §7 (44+58) | Tầng B |
| 12 | Số nguyên tố, hợp số | TCDS CĐ7 (7+42) · VHB1, TVA rải trong #11 | Tầng B |
| 13 | Số chính phương | TCDS CĐ8 (17+62) · VHB1 rải trong #11 | Tầng B |
| 14 | Phương trình nghiệm nguyên | TCDS CĐ9 (33+121) · TVA §10 (10+26+5) | Tầng B |
| **TỔ HỢP** | | | |
| 15 | Nguyên lí Đi-rích-lê · cực hạn · hình học tổ hợp | TCDS CĐ10 (17+55) · TVA §7 Dạng 2 (8) · NDT Phụ lục | Tầng B |
| **HÌNH** | | | |
| 16 | Tứ giác: hình thang, đường trung bình, hình bình hành, chữ nhật, thoi, vuông | VHB1 §1–2, 5, 7, 9, 10 (10+64) · NDT Hình I (≈ 65) · TUHOC B1–B5 (415 bài) · TCHH CĐ2 (13+29) | Có + tầng B · *đã có 6 bài, 48 câu* |
| 17 | Tam giác cân, đều · **tính số đo góc bằng kẻ thêm hình** | TCHH CĐ1 (49+68, mục C có 5 dạng + "Phân tích") | Lớp 7 + kỹ thuật HSG |
| 18 | Chứng minh vuông góc – song song · đồng quy – thẳng hàng | TCHH CĐ3 (19+63), CĐ4 (13+10) | Có + tầng B (Mê-nê-la-uýt, Xê-va) |
| 19 | Định lí Ta-lét · đường phân giác · tam giác đồng dạng | VHB2 §13–19 (13+111) · NDT Hình III (73) · TUHOC B6–B7 (291 bài) · TCHH CĐ5 (17+10) | Có |
| 20 | Tính toán hình học · lập phương trình trong hình | TCHH CĐ6 (12+10) · VHB2 chuyên đề (5+11) | Có (nhiều bài dính tầng C — §1.3) |
| 21 | Diện tích · phương pháp diện tích | VHB1 §11–12 + chuyên đề (9+59) · NDT Hình II (44) · TCHH CĐ7 (28) | Tầng B |
| 22 | Cực trị hình học | VHB2 (11+43) · rải ở TCHH | Tầng B |
| 23 | Dựng hình · đối xứng trục, tâm · tìm tập hợp điểm | VHB1 §3, 4, 6 + chuyên đề (11+47) · NDT Hình I §4 (9; §5 Hình bình hành – đối xứng tâm đã tính ở #16) | **Không** (§1.4, Q1) |
| 24 | Hình không gian: hình hộp, lăng trụ đứng, chóp đều, chóp cụt | VHB2 §20–22 (9+42) · NDT Hình IV (30) | Một phần (chỉ hình chóp đều) |
| **TỔNG HỢP** | | | |
| 25 | Đề rèn luyện · ôn tập · trắc nghiệm học kì | NDT Ôn tập cuối năm 33 + Phụ lục A, B, C (130) · TVA §9 (7) · TUHOC trắc nghiệm 136 | Hợp luồng **đề thi** (`spec-de-thi.md`) hơn là luồng sách |

**Đọc bảng này thế nào:** đây là **tư liệu** — sách có gì, dày mỏng ở đâu — không phải bản chia tầng. Hai nhận xét cho người làm bản đồ:
(1) bản đồ Đại 8T hiện mới có câu ở đúng 1 chuyên đề (#5), Hình mới có #16; (2) tên dạng tốt nhất để mượn: **TVA** (mỗi chuyên đề chia sẵn "Dạng k" kèm phương pháp),
**TUHOC A10** (12 dạng biến đổi đặc biệt đặt tên rõ), **TCDS CĐ9** (6 phương pháp nghiệm nguyên), **TCHH CĐ1 mục C** (5 dạng tính góc).
Tên dạng do agent "tự gom" (ghi rõ trong hồ sơ: TCDS CĐ4, 9, 10; TCHH CĐ4–7) **không** phải tên của sách — đừng lấy làm tên trên bản đồ mà không soát.

## 7. Dây chuyền cho sách SCAN (README §2b, đổi trạm 0–1; các trạm sau giữ nguyên)

| # | Trạm | Ai | Làm gì | Bẫy riêng 8T |
|---|---|---|---|---|
| 0 | Dựng ảnh | máy | `pdftoppm -r 150 -gray -png "<pdf>" <KHO_LAM_VIEC>/sach/8T/<MÃ>/trang/p` (TUHOC: 200 dpi vì 2 trang / ảnh). Vân tay SHA-256 tệp gốc ghi cạnh | Bản đọc lướt 10/10 dựng ở 82–105 dpi trong thư mục tạm của phiên — đủ để lập hồ sơ, **không** đủ để chép số mũ |
| 1a | **Chép đề** | **Sonnet** đọc ảnh, mỗi lượt một mục sách | Ra `bai.json` **cùng khuôn `tach-bai.mjs`** (để trạm 1–7 của README §2b dùng lại nguyên): `ma_nguon` (§5.3) · `trang_pdf` · `noi_dung` (LaTeX, nguyên văn sách, chưa chuẩn hoá) · `y[]` · `nguon_de` (dòng in nghiêng dưới đề) · `co_hinh_trong_de` · `loi_giai_sach` (nguyên văn — **cất riêng**, trạm soạn không thấy) · `khong_doc_duoc[]` | Mục nào hồ sơ báo thiếu trang ⇒ ghi `thieu_de`, không dựng đề từ lời giải |
| 1b | **Chép lần hai, độc lập** | model khác (Opus hoặc Haiku đọc ảnh — đo ở lô đầu) | Chỉ chép **đề** → máy so với 1a từng công thức sau chuẩn hoá → danh sách lệch | Hai lượt cùng sai giống nhau thì máy không thấy ⇒ trạm kiểm đáp số (máy tính từ đề, so đáp số sách) là lưới thứ hai |
| 1c | Quyết chỗ lệch | Opus mở ảnh | Sửa `bai.json`, ghi vết vào `bai.sua.json` (đo tỉ lệ chép sai theo sách) | — |
| 2 | Lọc trùng | máy | `dau-vao-soan.mjs` + mở rộng: so trong quyển, **giữa 7 quyển**, với kho khối 8 và 8T. Trùng ⇒ giữ **một** bản (ưu tiên bản có lời giải đủ: NDT › TVA › TCDS / TCHH › VHB › TUHOC), bản kia ghi `trung_voi` | Trùng "gần" (đổi số, đổi tên điểm) **không** gộp — là hai câu |
| 3 | Bộ kiểm đáp số | Opus | `k8T-kiem.mjs` viết **từ đề**, trước khi mở bản soạn và trước khi mở `loi_giai_sach` (§4) | Hàm không kiểm được ⇒ `khong_kiem_duoc` thật, không trả "đạt" giả |
| 4 | Soạn | Sonnet (3 song song) | Brief `kho-rules/dai/lo/k8T-brief-soan.md` (chưa viết — việc #4) chép nguyên §1–§3 file này + lô mẫu CEO đã duyệt. Ra `.soan.json` có thêm `cong_cu[]` (§1.1 luật 4) | Câu chỉ giải được bằng tầng C ⇒ `ghi_chu_nghi`, không cố |
| 5 | Soát | Opus (≠ soạn), **giải mù trước, đọc bản soạn sau**, rồi mới mở `loi_giai_sach` | Ba nguồn đáp số (soạn · soát · sách) lệch nhau ⇒ dừng câu đó. Sửa ghi `.sua.json` | Lỗi whitelist + lỗi lập luận máy không bắt |
| 6 | Dựng lô + cổng ghi | máy | Đại: `lo-tu-soan.mjs` → `ghi-lo.mjs … --chua-gan-dang` vào `T18T000000`, `da_duyet=false`, `nguon_giai='ai'`. Hình: `nhap_hh_tu_draft.mjs` → dạng chờ Hình 8T → `gan_hinh.mjs` (kho kiểu 1) | Không chạy 2 lượt `--ghi` song song (cấp mã câu va nhau) |

**Thứ tự đi qua sách ở bước 1 (rút luật):** quyển có ví dụ giải đủ đi trước để rút khuôn — **TVA → TCDS → VHB (ví dụ) → NDT** cho Đại / Số học; **TCHH → NDT → VHB** cho Hình;
**TUHOC để cuối** (không lời giải, phần Đại phần lớn là luyện kỹ năng — xem Q3).

## 8. Kế hoạch theo quy trình 3 bước

| Bước | Việc của 8T | Trạng thái |
|---|---|---|
| **1. Rút luật giải** | B1 đọc ✅ · B2 hồ sơ ✅ · B3 luật nháp ✅ → **B4 giải một lượt qua mọi dạng**, mỗi lô 10–20 câu lấy từ **ví dụ + bài tập có lời giải** của sách (chép tay đúng các câu của lô, chưa cần trạm chép hàng loạt). Bảng lô dưới | **Chờ CEO trả lời §9 (Q1, Q2 quyết phạm vi lô)** |
| **2. Giải toàn bộ** | Sau v1: trạm chép hàng loạt (§7) từng quyển → dây chuyền README §2b → dạng chờ `T18T000000` / dạng chờ Hình 8T | Sau v1 |
| **3. Xếp vào bản đồ** | CEO soạn bản đồ 8T trên ERP (tư liệu: §6.2) ⇒ Claude xếp câu dạng chờ + 50 câu cũ + 48 câu Hình cũ ⇒ máy soát `cong_cu` theo thứ tự chuyên đề (§1.1 luật 4) ⇒ CEO duyệt | Chờ bản đồ |

**Bảng lô thử — dạng ↔ lô (đánh dấu khi đã qua CEO).** Thứ tự đặt theo cái lớp đang học (học kì 1: đa thức – hằng đẳng thức – phân tích nhân tử; hình: tứ giác) — ❓ Q4.

| Lô | Chuyên đề (§6.2) | Dạng phải phủ (mỗi dạng ≥ 1 câu) | Nguồn câu | Qua CEO |
|---|---|---|---|---|
| **Đ1** | #2 Phân tích nhân tử | đặt nhân tử chung – nhóm – HĐT (1 câu khó) · tách hạng tử · thêm bớt · đổi biến · hệ số bất định · nhẩm nghiệm nguyên / hữu tỉ · hoán vị vòng · $a^3+b^3+c^3-3abc$ · ứng dụng (giải phương trình bậc cao, chứng minh chia hết) | TVA §2 Dạng 1–8 · TCDS CĐ1 I–VII · VHB1 chuyên đề | |
| Đ2 | #1 + #5 HĐT mở rộng · biến đổi đặc biệt | 12 dạng của TUHOC A10 (thế · đối xứng vòng quanh · hoán vị vòng · HĐT bậc hai / bậc ba cho ba số · tỉ lệ thức · tổng đặc biệt · hệ đối xứng…) — có đáp số đối chiếu từ câu cùng dạng ở TCDS CĐ2, VHB1 | TUHOC A10 · TCDS CĐ2 Dạng 3–4 · VHB1 §2 | |
| Đ3 | #3 Chia đa thức · Bê-du | tìm hệ số (3 cách — §2b A) · tìm dư không chia · Hoóc-ne · chứng minh chia hết đa thức · tìm $n$ để $A(n)\ \vdots\ B(n)$ | TVA §1 · VHB1 chuyên đề | |
| Đ4 | #4 Phân thức | rút gọn + câu hỏi phụ · tổng có quy luật · tách thành tổng phân thức · tìm $x$ nguyên để phân thức nguyên · chứng minh đẳng thức | TVA §3 Dạng 1–7 · TCDS CĐ2 Dạng 1–2 | |
| Đ5 | #6 + #7 Phương trình · lập phương trình | chứa ẩn ở mẫu · tham số (biện luận) · bậc cao đưa về tích / đặt ẩn phụ · 8 dạng lời văn của TVA §5 | TVA §4–5 · VHB2 §7–10 · NDT Đại III | |
| Đ6 | #11–13 Chia hết · số nguyên tố · số chính phương | chứng minh chia hết (3 lối) · tìm số dư, chữ số tận cùng · tìm số nguyên tố · chứng minh (không) chính phương · tìm $n$ để là số chính phương | VHB1 chuyên đề · TCDS CĐ3, 7, 8 · TVA §7 | |
| Đ7 | #14 Nghiệm nguyên | 6 phương pháp của TCDS CĐ9 | TCDS CĐ9 · TVA §10 | |
| Đ8 | #8 + #9 Bất đẳng thức · cực trị | xét hiệu · biến đổi tương đương · bất đẳng thức quen thuộc · làm trội · GTNN tam thức, đa thức hai biến, phân thức, có ràng buộc | VHB2 hai chuyên đề · TVA §8 · TCDS CĐ4–5 | |
| Đ9 | #15 Đi-rích-lê | chia hết · hình học tổ hợp · cực hạn | TCDS CĐ10 | |
| **H1** | #16 Tứ giác nâng cao | chứng minh là hình gì · dùng tính chất · thẳng hàng – đồng quy trong tứ giác · tìm điều kiện · bài hình vuông kinh điển (kẻ phụ trên tia đối) | NDT Hình I · TCHH CĐ2 · VHB1 | |
| H2 | #17 Tính số đo góc | 5 dạng TCHH CĐ1 C (vuông cân · đều · cân biết một góc · liên hệ góc · nửa tam giác đều) + chứng minh tam giác cân / đều | TCHH CĐ1 | |
| H3 | #19 Ta-lét · phân giác · đồng dạng | đoạn tỉ lệ · kẻ song song phụ · đẳng thức nghịch đảo $\dfrac1a+\dfrac1b=\dfrac1c$ · ba trường hợp đồng dạng · tỉ số diện tích | VHB2 §13–18 · NDT Hình III · TCHH CĐ5 | |
| H4 | #18 Vuông góc – song song · đồng quy – thẳng hàng | 9 cách chứng minh vuông góc, 5 cách song song (TCHH CĐ3) · thẳng hàng · đồng quy · Mê-nê-la-uýt / Xê-va (tuỳ Q2c) | TCHH CĐ3–4 | |
| H5 | #21 + #22 Diện tích · cực trị hình học | tỉ số diện tích · diện tích ⇒ quan hệ độ dài · cực trị bằng đường vuông góc – đường xiên, bằng đối xứng, bằng bất đẳng thức đại số | VHB1 chuyên đề · VHB2 chuyên đề · TCHH CĐ7 | |
| *(treo)* | #10, #23, #24 | bất phương trình – giá trị tuyệt đối · dựng hình, quỹ tích · hình không gian | — | chờ Q1 |

**Việc kỹ thuật (Claude tự làm, không cần hỏi):**

| # | Việc | Vì sao |
|---|---|---|
| 1 | Migration tạo dạng chờ `T18T000000` (`dai`, khuôn các khối khác) + dạng chờ Hình 8T (khuôn mig `202610100831_hinh_hoc_dang_cho_khoi_8`) | Đường ghi của bước 2 (giải ≠ xếp) |
| 2 | Trạm chép đề từ ảnh (§7 trạm 1a–1c): khuôn `bai.json` + máy so hai lượt chép | Nguồn 8T không có lớp chữ; chưa khối nào chép SÁCH từ scan (K6–K8 mới chép đề thi 2–4 trang) |
| 3 | `kho-rules/dai/lo/k8T-kiem.mjs` (đa thức BigInt lấy từ `k8-kiem` nếu đã có; thêm vét cạn nghiệm nguyên, thử chia hết, lưới bất đẳng thức) | §4 |
| 4 | `kho-rules/dai/lo/k8T-brief-soan.md`, `k8T-brief-soat.md` (khuôn `k8-brief-*.md`) — viết sau lô Đ1 được CEO duyệt | README §4 việc #5 |
| 5 | Lọc trùng xuyên sách + với kho khối 8 (mở rộng `dau-vao-soan.mjs`) | §5.3 |
| 6 | Lý thuyết cho 6 bài Hình 8T đang có (`hinh_hoc_bai_ly_thuyet` trống) — chỉ làm sau khi CEO chốt danh sách bài Hình 8T (Q7) | Kho kiểu 1: lý thuyết = whitelist theo bài |

## 9. Câu hỏi CEO (trả lời xong mới chạy lô thử — Q1, Q2 quyết phạm vi)

| # | Câu hỏi | Vì sao phải hỏi | Mặc định v0 nếu chưa trả lời |
|---|---|---|---|
| **Q1** | **Chương trình của lớp 8T đi theo cái gì?** (a) lớp 8 hiện hành + nâng cao từng bài · (b) trình tự riêng của lớp T. Kéo theo: các khối sách thuộc chương trình cũ (§1.4: bất phương trình, giá trị tuyệt đối, dựng hình, quỹ tích, diện tích đa giác, lăng trụ) **có nhập không**? Và hàm số, thống kê – xác suất (sách không có) lấy nguồn ở đâu? | Đây là câu về *đích* (R1). Kho Hình 8T đang có bài "Đối xứng tâm" — không còn trong SGK hiện hành — nên có dấu hiệu là (b), nhưng tôi không suy ra thay được | Không chép, không giải các khối §1.4 |
| **Q2** | **Danh sách tầng B (§1.2) — 8T được dùng thẳng những công cụ nào?** Riêng: (a) kí hiệu đồng dư $\equiv$ · (b) Cô-si dạng có căn · (c) Mê-nê-la-uýt, Xê-va | Luật lõi của khối; sai ở đây là sai cả kho mà đáp số vẫn đúng | Theo bảng §1.2; (a) viết "chia cho $m$ dư $r$" · (b) chỉ dạng không căn · (c) mỗi bài tự chứng minh bằng Ta-lét |
| **Q3** | **Phạm vi nhập:** cả 7 quyển (6 quyển HSG ≈ 3.600 bài có nhãn; riêng TUHOC ≈ 1.036 bài ≈ 5.300 ý), hay ưu tiên? Đề xuất: 6 quyển HSG trước; **TUHOC phần Đại** (≈ 3.400 ý kiểu "Tìm $x$, biết 1) … 36)", không lời giải, phần lớn ở mức khối 8 thường) để sau hoặc chuyển cho kho khối 8; **TUHOC phần Hình** (706 bài chứng minh, không lời giải) làm sau cùng | Khối lượng gấp ~4 lần 4T (1.250 câu), và TUHOC không có nhân chứng đáp số | 6 quyển HSG trước |
| **Q4** | **Thứ tự chuyên đề** làm trước: theo bảng lô §8 (Đ1 phân tích nhân tử → … · H1 tứ giác → …), hay CEO cần mảng nào gấp cho lớp đang học? | Bước 1 phủ dạng theo thứ tự nào cũng được, nhưng nên ra câu dùng được sớm | Theo §8 |
| **Q5** | Thuật ngữ: phiên âm ("Ta-lét", "Đi-rích-lê", "Cô-si") như SGK và sách VHB, hay tên gốc ("Thalès", "Dirichlet", "Cauchy")? `k8.md` đang viết "Thalès", "Pythagore" | Phải thống nhất một kiểu trong cả kho 8 và 8T (lọc trùng, từ khoá cấm, bản đồ) | Theo `k8.md`: Thalès, Pythagore; các tên khác phiên âm như §3 |
| **Q6** | Có **bản đủ trang** của VHB tập 1 (thiếu đề Đại 142–159, Hình 41–46, ví dụ 43–46) và TVA (thiếu trang sách 32–33) không? | Lời giải còn nhưng mất đề — không dựng đề ngược từ lời giải (§1.5 CLAUDE.md) | Bỏ các bài mất đề, ghi danh sách |
| **Q7** | **Hình 8T tổ chức thành những BÀI nào** trong `hinh_hoc_bai`? Hiện có 6 bài (5 loại tứ giác + đối xứng tâm). Sách HSG chia theo *chuyên đề phương pháp* (tính góc · vuông góc – song song · đồng quy – thẳng hàng · diện tích · cực trị), không theo bài SGK | Kho kiểu 1 gắn câu vào bài, lý thuyết của bài là whitelist; tên bài do CEO đặt (tiền lệ khối 9: 6 bài CEO đặt tên) | Câu Hình giải xong nằm ở dạng chờ Hình 8T |
| **Q8** | 50 câu Đại + 48 câu Hình 8T **đã duyệt** nhưng lời giải chưa có 2 phần: viết lại theo khuôn mới (như 271 câu Số thập phân của 5T), hay để nguyên? | Câu đã duyệt đang được dùng | Để nguyên, ghi sổ; sửa một lượt khi luật lên v1 |

## 10. NHẬT KÝ SỬA (append-only — CEO sửa gì ghi đó, rồi nâng thành luật ở trên)

| Ngày | Câu | CEO sửa gì | Luật rút ra |
|---|---|---|---|
| 10/10 | — | *(ghi việc làm)* Thùy: *"Context này xây kho và bản đồ của khối 8T. Đọc spec khối 4 để hiểu thêm rồi làm spec cho khối 8. Đọc 1 lượt các tài liệu ở đây."* Đọc `k4T.md`, README, `k8.md`, `spec-ban-do-4-tang.md` §0; dựng ảnh 1.761 trang của 7 quyển; 7 agent Sonnet đọc mỗi quyển một lượt, viết hồ sơ `lo/k8T/ho-so/`; tôi đối chiếu ảnh gốc 10 trang (khớp) + xác nhận VHB1 thiếu bài 142–159; đo DB 8T | v0. Luật lõi đề xuất: 3 tầng kiến thức + khai công cụ theo câu (§1) · trạm chép đề hai lượt (§4, §7) · mã nguồn có trang PDF (§5.3) |
