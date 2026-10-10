# kho-rules/dai/k8T.md — SPEC khối 8T (Toán 8 nâng cao / bồi dưỡng HSG — Đại · Số học · Tổ hợp · Hình): KHO + BẢN ĐỒ

> **Trạng thái: NHÁP v0.1 (10/10/2026 tối) — CEO đã chốt 4 hướng lớn (§10), chưa qua lô thử nào.** Mọi lần giải / soát / ghi câu khối 8T PHẢI đọc file này trước.
> Mỗi lần CEO sửa ⇒ ghi §10 (nhật ký) rồi nâng luật ở §1–§4. Đã đi qua đủ dạng **và** một lô qua CEO không sửa gì ⇒ **v1**.
> **Quy trình 3 bước mọi khối: `kho-rules/README.md` §0.** Khối 8T đang ở **BƯỚC 1** (rút luật giải): B1 đọc ✅ (7 quyển, 1.761 trang scan,
> đọc một lượt 10/10) · B2 hồ sơ sách ✅ (§5 + 7 tệp `lo/k8T/ho-so/`) · B3 luật nháp ✅ (file này) · **kế tiếp: CEO duyệt đề xuất chia tầng §6.2 → lô thử Đ1 (§8)**.
>
> **Phạm vi của context này (Thùy 10/10): xây KHO và BẢN ĐỒ của khối 8T.** Kho = bước 1–2 (rút luật → giải toàn bộ tài liệu vào dạng chờ).
> Bản đồ = §6.2: **đề xuất chia 3 tầng trên** (Chủ đề → Chuyên đề → Nhóm bài) do CEO yêu cầu 10/10, **chờ CEO duyệt / sửa**.
>
> **⭐ Bốn quyết định của CEO (10/10) — khung của cả file:**
> 1. *"8T học nâng cao là chính — không cần quan tâm khối 8."* ⇒ 8T **không bám** chương trình lớp 8 hiện hành, **không áp** luật "thứ tự bài" của `k8.md`.
> 2. *"8T được dùng full công cụ cao cấp — thể hiện rõ trong các cuốn sách rồi."* ⇒ **chuẩn kiến thức của 8T = chính các quyển sách nguồn** (§1).
> 3. *"Chỉ nhập các cuốn có lời giải chi tiết thôi."* ⇒ nhập **6 quyển**, **bỏ quyển TUHOC** (ngân hàng đề không lời giải) (§5).
> 4. *"8T không cần phân chia quá kĩ như 8 thường."* ⇒ bản đồ 8T thô hơn: đề xuất 5 chủ đề · 14 chuyên đề · 37 nhóm bài cho toàn bộ Đại – Số học – Tổ hợp (§6.2).
>
> **Khác 4T (đọc `k4T.md` để thấy khuôn gốc):**
> 1. **Nguồn là sách PDF SCAN không có lớp chữ** (4T: một quyển Word, máy đọc thẳng 0 hỏng) ⇒ phải có thêm **trạm chép đề từ ảnh** + nhân chứng thứ hai
>    cho việc chép (§7). Đây là chỗ rủi ro mới của 8T.
> 2. **6 quyển phủ chồng nhau** (một chuyên đề có ở 3–5 quyển, và trùng đề ngay trong một quyển) ⇒ **lọc trùng xuyên sách theo NỘI DUNG**;
>    nhãn bài của sách **không dùng làm khoá một mình** (đánh lại từ 1 ở từng mục, có chỗ nhảy số, trùng số) — §5.3.
> 3. **Sách CÓ lời giải / đáp số** ⇒ có nhân chứng thứ hai cho đáp số; nhưng lời giải sách **tắt** ("Dễ thấy", "Tương tự", chỉ "Đáp số") ⇒ kho vẫn viết lại đủ 2 phần.
> 4. **Ranh giới kiến thức ngược với 4T:** 4T cấm mọi thứ ngoài tiểu học; 8T **được dùng mọi công cụ sách dùng** — luật chỉ còn "gọi đúng tên, đủ điều kiện, không dùng thứ sách không dạy" (§1).
> 5. **Hai nhánh, hai đường ghi** (như khối 8): Đại · Số học · Tổ hợp ⇒ `dai_cau_hoi` khối `8T` · Hình ⇒ `hinh_hoc_*` khối `8T` (kho kiểu 1).

## 0. Nguyên tắc gốc

Lời giải viết **như một học sinh lớp 8 GIỎI viết vào bài thi học sinh giỏi**: mỗi khẳng định có lý do, công cụ nào dùng thì gọi đúng tên.
Phụ huynh / trợ giảng đọc Phần 1 phải hiểu *vì sao nghĩ ra* — với bài HSG đây là phần đáng tiền nhất: thêm bớt hạng tử nào, kẻ đường phụ nào,
vì dấu hiệu gì trong đề. **Đi theo hướng giải của sách** (đó chính là "công cụ thể hiện trong sách"), viết lại cho đủ bước.

## 1. ⭐ LUẬT KIẾN THỨC (CEO chốt 10/10 — thay bản đề xuất "3 tầng kiến thức" của v0)

### 1.1 Luật

1. **Chuẩn kiến thức của 8T = 6 quyển sách nguồn.** Công cụ nào **lời giải của sách dùng** thì lời giải kho **được dùng thẳng** — không phải chứng minh lại,
   không xét "lớp 8 hiện hành đã học chưa". Kể cả: đồng dư thức, Cô-si (cả dạng có căn), Bu-nhi-a-cốp-xki, Bê-du, Hoóc-ne, Đi-rích-lê, Mê-nê-la-uýt, Xê-va,
   hệ thức lượng trong tam giác vuông, bất phương trình, giá trị tuyệt đối, phương pháp diện tích, đối xứng. Danh mục: §1.2.
2. **Dùng thì phải gọi tên và đủ điều kiện:** "áp dụng bất đẳng thức Cô-si cho hai số **dương** $a$, $b$" + nêu khi nào xảy ra dấu bằng; "theo định lí Bê-du";
   "theo định lí Mê-nê-la-uýt cho tam giác $ABC$ với cát tuyến $MNP$". Công cụ dùng ngầm, không gọi tên = lỗi trình bày (người soát bắt).
3. **Bài có lời giải của sách ⇒ lời giải kho đi theo hướng đó.** Chỉ đổi hướng khi lời giải sách sai / hổng — khi đó ghi `ghi_chu_nghi` cho CEO biết.
4. **Công cụ KHÔNG có trong 6 quyển ⇒ không dùng** (§1.3) — học sinh 8T không được dạy, lời giải dùng nó thì không học được.
5. **Mỗi câu khai công cụ đã dùng:** bản soạn có dòng `**Công cụ:** Bê-du · Cô-si hai số` (trống nếu chỉ biến đổi thường), lưu trong tệp lô
   (`.soan.json` → `cong_cu: []`). Dùng ở bước 3: xếp câu vào nhóm bài theo **phương pháp** (tiền lệ 4T — CEO 07/10: *"giải bằng tổng hiệu thì phải nằm trong dạng tổng hiệu"*),
   và để lọc ra các câu dùng công cụ "lớp 9" nếu sau này CEO muốn tách (§1.3 dòng cuối).
6. Người soát (Opus) đọc từng câu đối chiếu §1.2–§1.3 — lỗi này máy kiểm đáp số không bắt được.

### 1.2 Danh mục công cụ được dùng thẳng — cột "sách dạy ở" = nơi có lý thuyết + ví dụ để rút khuôn trình bày

| Mảng | Công cụ | Sách dạy ở | Cách viết |
|---|---|---|---|
| Đa thức | HĐT mở rộng: $(a+b+c)^2$ · $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$ · $a^n-b^n$ · $a^n+b^n$ ($n$ lẻ) · nhị thức Niu-tơn / tam giác Pa-xcan | VHB1 §2 · TVA §2 · TCDS CĐ1 VII | Lần đầu dùng trong một lời giải: viết hẳn đẳng thức ra |
| Đa thức | Chia đa thức một biến (đặt tính) · **định lí Bê-du** · **sơ đồ Hoóc-ne** · nghiệm nguyên / hữu tỉ của đa thức hệ số nguyên · **hệ số bất định** · xét giá trị riêng | VHB1 hai chuyên đề · TVA §1, §2 Dạng 8 · TCDS CĐ1 IV–V | "Nhẩm nghiệm" phải viết ra căn cứ: ước của hệ số tự do / tổng hệ số bằng 0 |
| Số học | Tích $n$ số nguyên liên tiếp chia hết cho $n!$ · $a^n-b^n\ \vdots\ (a-b)$ · $a^p-a\ \vdots\ p$ · số dư của số chính phương khi chia 3, 4, 5, 8 · kẹp giữa hai số chính phương liên tiếp | VHB1 chuyên đề chia hết · TVA §7 · TCDS CĐ3, 7, 8 | — |
| Số học | **Đồng dư thức** $a\equiv b \pmod m$ | TCDS CĐ3 · TVA §7, §10 | Viết kí hiệu $\equiv$ như sách |
| Số học | Phương pháp giải phương trình nghiệm nguyên: đưa về tích / ước số · biểu thị một ẩn rồi dùng chia hết · xét số dư · sắp thứ tự ẩn · kẹp · dùng số chính phương | TCDS CĐ9 (6 phương pháp) · TVA §10 | Luôn **thử lại** nghiệm tìm được |
| Bất đẳng thức | $a^2+b^2\ge 2ab$ · $(a+b)^2\ge 4ab$ · $\dfrac1a+\dfrac1b\ge\dfrac4{a+b}$ · $a^2+b^2+c^2\ge ab+bc+ca$ · **Cô-si** hai số, ba số · **Bu-nhi-a-cốp-xki** · làm trội – làm giảm | VHB2 chuyên đề · TVA §8 · TCDS CĐ4 | Mỗi lần dùng: điều kiện của biến + **điều kiện dấu bằng** |
| Cực trị | Định nghĩa GTLN / GTNN gồm **hai** điều kiện: bất đẳng thức với mọi giá trị **và** tồn tại giá trị để dấu bằng xảy ra (VHB2: chỉ có điều kiện thứ nhất thì *chưa* kết luận được) | VHB2 chuyên đề · TCDS CĐ5 · TVA §8 Dạng 2 | Luật trình bày bắt buộc ở mọi bài cực trị |
| Phương trình | Bất phương trình bậc nhất, tích, thương · phương trình / bất phương trình chứa dấu giá trị tuyệt đối (chia khoảng, bảng xét dấu) · phương trình bậc cao (đặt ẩn phụ, đối xứng) · giải và biện luận theo tham số | VHB2 §7–15 · TVA §4, §6 · TCDS CĐ6 · NDT Đại III–IV | — |
| Tổ hợp | Nguyên lí **Đi-rích-lê** · nguyên lí cực hạn · phản chứng · bất biến, tô màu | TCDS CĐ10 · TVA §7 Dạng 2 · NDT Phụ lục | Chỉ rõ "thỏ" là gì, "lồng" là gì |
| Hình | Đường trung bình của tam giác, của hình thang · định lí Thalès, định lí đảo, **hệ quả** · tính chất đường phân giác · tam giác đồng dạng · Pythagore · **bổ đề hình thang** · "nửa tam giác đều" · trung tuyến ứng với cạnh huyền | VHB1, VHB2 · NDT Hình I, III · TCHH CĐ1, 3, 5 | Căn cứ trong ngoặc sau mỗi dòng |
| Hình | **Phương pháp diện tích** (chung đường cao: tỉ số diện tích = tỉ số đáy; tỉ số diện tích hai tam giác đồng dạng) · đối xứng trục, đối xứng tâm | VHB1 §4, 6, 12 + chuyên đề · NDT Hình II · TCHH CĐ7 | — |
| Hình | Định lí **Mê-nê-la-uýt**, **Xê-va** · **hệ thức lượng trong tam giác vuông** ($h^2=b'c'$, $\dfrac1{h^2}=\dfrac1{b^2}+\dfrac1{c^2}$) | TCHH CĐ4 (có chứng minh), CĐ1–3 | Gọi tên + nêu tam giác, cát tuyến / đường cao nào |

### 1.3 Không dùng — công cụ không có trong 6 quyển

Tỉ số lượng giác, định lí sin / cô-sin · toạ độ, vectơ · đạo hàm · quy nạp ở dạng hình thức nếu sách không dùng cho bài đó · công thức nghiệm phương trình bậc hai bằng $\Delta$
(sách phân tích thành nhân tử) · các bất đẳng thức "có tên" khác (Schur, Chebyshev, AM–GM $n$ số tổng quát…).

**Vài bài lẻ sách dùng kiến thức mà chính sách ghi là "lớp 9"** (tứ giác nội tiếp, góc nội tiếp, đường tròn nội tiếp — TCHH CĐ4 Bài 11, CĐ5 Bài 8, CĐ6 Bài 1, 5; Vi-ét ở TCHH CĐ6 Bài 1):
theo luật 1 **vẫn nhập, giải theo sách**, và ghi `cong_cu` có nhãn `lớp 9` để CEO lọc được nếu muốn tách sang 9T.

## 2. Mỗi lời giải CHIA 2 PHẦN (luật chung README §3) — điểm riêng của 8T

> Giữ nguyên README §3: `**Phần 1. Hướng dẫn**` = `**Mấu chốt:**` → **3–6** đoạn `**Bước k.**` (mỗi bước một card, một ý trọn vẹn, không lộ đáp số) →
> `**Chú ý:**`; `**Phần 2. Trình bày**` = đúng cái HS viết vào bài thi. **Mọi câu** đủ 2 phần. Máy kiểm hình thức: `scripts/kho/sach/kiem-p1-card.mjs`.

- **Phần 1 của bài HSG phải trả lời "vì sao nghĩ ra"**, không chỉ "làm gì". Nguyên liệu có sẵn trong sách: mục **"Phân tích" / "Hướng dẫn tìm lời
  giải"** (TCHH CĐ1 mục C, CĐ3: *"Khi có góc bằng $60^\circ$, ta nghĩ đến việc vận dụng nửa tam giác đều… Từ đó gợi ý cho ta hạ $DH\perp AC$"*),
  **"Nhận xét"** trước lời giải (TCDS CĐ1: *"$x=\pm1,\pm5$ không là nghiệm… nên nếu có nghiệm thì là nghiệm hữu tỉ"*), **"Chú ý"** (VHB).
  Cặp "Phân tích → Giải tóm tắt" của TCHH chính là cặp Phần 1 → Phần 2 của kho — lấy làm mẫu lối viết Hình 8T.
  *(R7: đây là "phân tích – tổng hợp"; Pólya gọi là working backwards — `k8.md` §1.6.)*
- **Hình: khuôn trình bày theo `k8.md` §1.6 và §10** (chỉ lấy KHUÔN, không lấy luật thứ tự bài) — ý **Tính** ⇒ Phần 1 viết lời; ý **Chứng minh** ⇒ Phần 1 là các bước
  **phân tích đi lên** ("muốn có X, cần Y") đặt trong card, Phần 2 trình bày ngược lại, mỗi dòng có **căn cứ trong ngoặc** ("(gt)", "(c.g.c)", "(hệ quả định lí Thalès)").
  **Đường phụ**: Bước 1 của Phần 1 luôn là "kẻ gì, vì dấu hiệu nào trong đề". **Hình không tách ý** (CEO 21/09).
- **Bài nhiều cách** (sách hay cho "Cách 1 … Cách 5"): Phần 2 trình bày **một** cách; cách khác đáng dạy nhắc **một câu** ở `**Chú ý:**` (như `k4T.md` §1).
  Dạng nào có nhiều cách ngang nhau ⇒ đưa vào bảng §2b, **CEO chốt một cách chính** (tiền lệ `k5T.md` §2b).
- **Tách ý** (README §3): chỉ tách bài **Tính / Rút gọn / Phân tích thành nhân tử / Tìm $x$ (giải phương trình)** có các ý độc lập — mỗi ý một câu.
  Bài chứng minh nhiều ý, bài lời văn, bài hình: giữ một câu.
- **Không viện dẫn sách** trong lời giải ("theo ví dụ 28", "xem bài 140b") — HS không có cuốn sách; sách viện dẫn chéo rất nhiều (NDT, VHB, TCHH CĐ7)
  ⇒ kết quả được viện dẫn phải **chứng minh lại tại chỗ** hoặc là công cụ §1.2 gọi được tên.

### 2a. Khuôn Phần 2 theo CHUYÊN ĐỀ (nháp — rút từ ví dụ có lời giải của sách; chốt qua các lô thử §8)

| Chuyên đề | Khuôn Phần 2 | Mấu chốt / bẫy phải nói ở Phần 1 |
|---|---|---|
| Phân tích thành nhân tử (tách · thêm bớt · đổi biến · hệ số bất định · nhẩm nghiệm · hoán vị vòng) | Chép đề `=` … mỗi phép biến đổi **một dòng**, dòng tách / thêm bớt viết tường minh ($3x^2-7x+17x-5=3x^2-x-6x^2+2x+\dots$) → kết quả. Nhân tử bậc hai còn lại: thêm dòng "vì $x^2-2x+5=(x-1)^2+4>0$ nên không phân tích tiếp được" | Dấu hiệu chọn phương pháp: tổng hệ số bằng 0 ⇒ có nhân tử $x-1$; tổng hệ số bậc chẵn = tổng hệ số bậc lẻ ⇒ $x+1$; không có nghiệm nguyên ⇒ thử nghiệm hữu tỉ $\dfrac pq$; dạng $(x+a)(x+b)(x+c)(x+d)+e$ ⇒ nhóm cặp có tổng bằng nhau rồi đặt ẩn; đa thức hoán vị vòng ⇒ thử $a=b$ |
| Chia đa thức · Bê-du · tìm hệ số để chia hết / dư cho trước | "Gọi thương là $Q(x)$, ta có $f(x)=(x-a)Q(x)+r$ với mọi $x$" → thay $x=a$ → giải ra hệ số → "Vậy …" | Chia cho tích $(x-a)(x-b)$ ⇒ dư bậc nhất $mx+n$, thay hai giá trị. Ba cách (đặt tính · hệ số bất định · giá trị riêng) — §2b |
| Tính giá trị / chứng minh đẳng thức **có điều kiện** (đối xứng, hoán vị vòng, $a+b+c=0$, $xyz=1$, tỉ lệ thức) | "Từ giả thiết … suy ra …" → biến đổi biểu thức cần tính theo giả thiết, mỗi dòng một bước → "Vậy $A=\dots$" | Khai thác giả thiết **trước** (phân tích giả thiết thành nhân tử, bình phương hai vế, thế $c=-a-b$). Mẫu bằng 0 phải loại: nêu điều kiện |
| Phân thức, tổng có quy luật | "ĐKXĐ: …" → rút gọn từng dòng → trả lời từng yêu cầu a) b) c). Tổng dạng dãy: viết số hạng tổng quát thành **hiệu hai phân thức** rồi "cộng theo vế" | Tìm $x$ nguyên để phân thức nguyên: tách phần nguyên rồi xét ước; **đối chiếu ĐKXĐ** trước khi kết luận |
| Phương trình (bậc nhất, tích, chứa ẩn ở mẫu, có tham số, bậc cao) | ĐKXĐ (nếu có) → biến đổi `\Leftrightarrow` từng dòng → đối chiếu "(nhận)" / "(loại)" → "Vậy tập nghiệm của phương trình là $S=\{\dots\}$". Có tham số: chia trường hợp theo hệ số của $x$ | Bậc cao: đưa về tích hoặc đặt ẩn phụ (đối xứng: chia hai vế cho $x^2$ sau khi xét $x=0$). Biện luận $ax=b$: đủ ba trường hợp |
| Giá trị tuyệt đối · bất phương trình | Chia khoảng theo các giá trị làm biểu thức trong dấu giá trị tuyệt đối bằng 0 → giải trên từng khoảng → **đối chiếu khoảng đang xét** → hợp nghiệm. Bất phương trình tích / thương: **bảng xét dấu** | Nhân / chia hai vế với số âm thì đổi chiều; chưa biết dấu của biểu thức thì không được nhân chéo |
| Giải bài toán bằng cách lập phương trình | "Gọi … là $x$ (đơn vị; điều kiện)" → biểu diễn các đại lượng → lập phương trình → giải → đối chiếu điều kiện → trả lời | Chọn ẩn là đại lượng đề **hỏi**; chuyển động: lập bảng $s$–$v$–$t$ ở Phần 1 |
| Chia hết với số nguyên | Biến đổi biểu thức thành tích / tổng các số hạng chia hết, mỗi số hạng **kèm lý do** ("tích ba số nguyên liên tiếp nên chia hết cho 6") → "Vậy $A\ \vdots\ m$ với mọi $n\in\mathbb Z$" | $m$ hợp số ⇒ tách thành các thừa số **nguyên tố cùng nhau** rồi chứng minh từng cái; hoặc xét các số dư của $n$ khi chia cho $m$ |
| Số nguyên tố · số chính phương | Xét trường hợp theo số dư / theo $p=2$, $p=3$, $p>3$ → loại dần → kết luận. Chứng minh không chính phương: chỉ ra số dư mà số chính phương không có, hoặc kẹp $k^2<A<(k+1)^2$ | "Tìm $n$ để … là số chính phương": đặt $=k^2$ rồi đưa về tích hai số nguyên |
| Phương trình nghiệm nguyên | Biến đổi về dạng tích $=$ hằng số → lập **bảng** các trường hợp ước → "Thử lại: …" → "Vậy các nghiệm nguyên $(x;y)$ là …" | Nêu rõ phương pháp chọn và vì sao (hệ số nào chia hết, ẩn nào bậc nhất…). Không sót ước **âm** |
| Bất đẳng thức | Biến đổi tương đương: "$\Leftrightarrow$" tới bất đẳng thức hiển nhiên đúng **rồi viết** "bất đẳng thức cuối đúng nên bất đẳng thức đã cho đúng"; hoặc xuất phát từ bất đẳng thức đúng. Dòng cuối: "Dấu bằng xảy ra khi …" | Biến đổi tương đương chỉ hợp lệ khi **mọi** bước là $\Leftrightarrow$ (nhân hai vế với số dương thì nói rõ dương) |
| Tìm GTLN, GTNN | "$A=(\dots)^2+c\ge c$ với mọi $x$" → "Dấu bằng xảy ra khi $x=\dots$" → "Vậy GTNN của $A$ là $c$, đạt được khi $x=\dots$" — **đủ hai điều kiện** (§1.2) | $A\ge 0$ chưa chắc $\min A=0$ (VHB2: $A=(x-1)^2+(x-3)^2$). Có ràng buộc: thế ràng buộc vào trước |
| Đi-rích-lê, cực hạn | "Xét … (thỏ). Chia thành … (lồng)." → áp dụng nguyên lí → kết luận | Phần 1: cách **chọn lồng** là toàn bộ bài toán |
| Hình — chứng minh | Theo `k8.md` §1.6: "Xét $\triangle\dots$ và $\triangle\dots$ có: … (lý do)" ⇒ … ; mỗi mũi tên của Phần 1 = một bước | Đường phụ + vì sao |
| Hình — tính (góc, độ dài, diện tích) | Các dòng tính, mỗi dòng kèm căn cứ trong ngoặc; đặt ẩn lập phương trình thì "Đặt $EC=x$ ($x>0$)" | Tính góc bằng kẻ thêm tam giác đều / vuông cân / nửa tam giác đều (TCHH CĐ1 C, 5 dạng) |
| Cực trị hình học · tập hợp điểm | Cực trị: chứng minh $d\ge d_0$ với mọi vị trí → chỉ ra vị trí đạt được → kết luận. Tập hợp điểm: phần thuận → giới hạn → phần đảo → kết luận | Như cực trị đại số: phải có vị trí **đạt** dấu bằng |

### 2b. Dạng có NHIỀU CÁCH — CEO chốt MỘT cách chính (điền dần qua các lô thử)

| # | Dạng | Các cách sách đưa | Claude đề xuất | Chốt |
|---|---|---|---|---|
| A | Tìm hệ số để đa thức chia hết / có dư cho trước | ① đặt tính chia · ② hệ số bất định · ③ giá trị riêng (Bê-du) — TVA §1 | ③ khi số chia có nghiệm dễ thấy; ② khi không | |
| B | Chứng minh bất đẳng thức đại số | ① định nghĩa (xét hiệu) · ② biến đổi tương đương · ③ bất đẳng thức quen thuộc · ④ đổi biến — TVA §8, TCDS CĐ4 | Theo cách của sách ở từng bài; bài sách không giải ⇒ ① xét hiệu | |
| C | Tìm GTNN của tam thức / đa thức hai biến | ① tách thành tổng bình phương · ② đổi biến · ③ miền giá trị | ① | |

## 3. Định dạng (giữ quy ước kho Đại — README §3, `k8.md` §3; chỉ ghi phần riêng 8T)

- **Dấu nhân:** sách dùng dấu chấm ($AB.AC$, $4.100^3$) ⇒ chuẩn hoá như khối 8 (CEO 09/10): giữa **hai số** `\cdot`; số–chữ, chữ–chữ, ngoặc–ngoặc viết liền;
  tích độ dài $AB\cdot AC$. Cổng `--khoi 8` đã chặn `\times` và dấu chấm làm dấu nhân — dùng lại cho 8T.
- **Chia hết** `\vdots` ($A\ \vdots\ 6$), **không chia hết** `\not\vdots`. Đồng dư `a\equiv b \pmod{m}`. Ước chung lớn nhất viết chữ "ƯCLN$(a;b)$" (không `\gcd`).
- Giá trị tuyệt đối `\lvert x\rvert` (không gõ `|x|` trần — lẫn với ô bảng markdown; hồ sơ TVA đã dính).
- Hệ, tuyển: `\begin{cases}…\end{cases}`, `\left[\begin{array}{l}…\end{array}\right.`. Tập nghiệm $S=\{\dots\}$; nghiệm nguyên $(x;y)$ ngăn bằng `;`.
- Hình: `\widehat{ABC}`, `\triangle`, đồng dạng `\backsim`, song song `\parallel` (sách gõ `//`), vuông góc `\perp`.
- **Thuật ngữ thống nhất** (sách viết lẫn Thales / Talet / Ta-let, Dirichlet / Drichlet… — không thống nhất thì lọc trùng và tìm kiếm đều hỏng). v0.1 theo `k8.md`:
  "Thalès", "Pythagore"; các tên khác phiên âm như SGK: "Đi-rích-lê", "Bê-du", "Hoóc-ne", "Cô-si", "Bu-nhi-a-cốp-xki", "Mê-nê-la-uýt", "Xê-va" — ❓ §9 Q3.
- Đáp án (`dap_an`): phân tích nhân tử ⇒ tích cuối cùng; phương trình ⇒ `$S=\{…\}$`; nghiệm nguyên ⇒ liệt kê cặp; cực trị ⇒ "GTNN bằng … khi …";
  chứng minh ⇒ để trống (không có đáp án ngắn).
- Nguồn đề in dưới đề ("Đề thi HSG huyện … 2015–2016", "Toán tuổi thơ") ⇒ **giữ** trong ngoặc đầu đề, như 50 câu 8T đang có ("(Chuyên Trà Vinh 2016 – 2017)").

## 4. Kiểm trước khi ghi

- **Kiểm CHÉP (mới của 8T — nguồn là ảnh):** đề trong kho phải khớp ảnh trang. Hai lượt chép độc lập (hai model khác nhau) → máy so từng công thức
  sau chuẩn hoá → lệch ⇒ model thứ ba / người mở ảnh quyết. Số mũ, chỉ số dưới, dấu $\vdots$ nhoè, "l" ↔ "1", dấu trừ mất là các chỗ scan hay sai
  (hồ sơ NDT §6, TCHH §6). **Chép sai đề thì mọi trạm sau đều đúng với một đề sai** — đáp số vẫn "khớp".
- **Hai nhân chứng cho đáp số:** (a) lời giải / đáp số của sách (chép nguyên văn ở trạm chép) ·
  (b) **máy tính lại từ ĐỀ** — `kho-rules/dai/lo/k8T-kiem.mjs`, viết TRƯỚC khi mở bản soạn:
  phân tích nhân tử / rút gọn / đẳng thức ⇒ thay ≥ 5 bộ số hữu tỉ ngẫu nhiên (phân số BigInt, như `k8.md` §4) · phương trình ⇒ thay nghiệm + quét nghiệm hữu tỉ ·
  nghiệm nguyên ⇒ **vét cạn** một miền đủ rộng, so tập nghiệm · chia hết / số chính phương / số nguyên tố ⇒ thử $n$ trong một đoạn dài ·
  bất đẳng thức ⇒ thử lưới + ngẫu nhiên (chỉ **bác** được, không chứng minh được) + kiểm điểm dấu bằng · cực trị ⇒ lưới số + kiểm điểm đạt ·
  hình ⇒ dựng toạ độ ≥ 2 bộ cho điểm "bất kì" (kho kiểu 1).
- **Lệch (a) với (b) ⇒ không ghi**, vào danh sách "sách in sai?". Đã thấy: NDT Phụ lục C Đề 9 bài 2a (cách 2 ghi dư 1987, các cách khác 2002) ·
  TCHH CĐ1 B Bài 1 (đề in $2AB$, lời giải $2BC$) · TVA §10 (lời giải số 13 là của đề bài 26).
- **Trạm soạn ĐƯỢC đọc lời giải sách** (khác K6–K8, nơi đề không có đáp án nên phải giải mù): CEO chốt đi theo hướng của sách (§1.1 luật 3), việc của trạm soạn là
  **viết lại cho đủ bước + viết Phần 1**. Người soát thì **giải mù trước** rồi mới đọc bản soạn — để bắt chỗ lời giải sách sai mà trạm soạn chép theo.
- **Bài chứng minh:** máy không xác nhận được lập luận ⇒ **Opus soát** là nhân chứng chính; máy chỉ kiểm *mệnh đề* (thử số / toạ độ) để bắt đề chép sai.

## 5. Hồ sơ nguồn (B1–B2 làm 10/10)

**Thư mục:** `E:\BK ACADEMY\Tài liệu tham khảo\8T\HSG\` — 7 PDF, **1.761 trang, scan 100%** (`pdftotext` ra 0 ký tự).
Đọc bằng cách dựng ảnh trang (`pdftoppm`) rồi model đọc ảnh — máy này không có khoá Gemini cho `boc-pdf.mjs`, và `boc-pdf.mjs` giới hạn 18 MB/tệp (các quyển 30–130 MB).

### 5.1 Các quyển — hồ sơ đầy đủ từng quyển ở `kho-rules/dai/lo/k8T/ho-so/<MÃ>.md` (mục lục theo trang PDF · khuôn · từng chuyên đề: dạng, đếm, kiến thức dùng · lời giải mẫu · bẫy đọc)

| Mã | Sách | Trang PDF | Mảng | Ví dụ có lời giải | Bài tập | Lời giải bài tập |
|---|---|---:|---|---:|---:|---|
| **NDT** | Chuyên đề bồi dưỡng HSG Toán 8 — Nguyễn Đức Tấn, Nguyễn Anh Hoàng, Nguyễn Đoàn Vũ (NXB Tổng hợp TP.HCM, 2016) | 330 | Đại · Hình · Số học | 3 | 650 (≈ 1.140 ý, ước) | **Ngay sau từng bài, đủ bước** — đầy đủ nhất; 3 tầng cơ bản / nâng cao / đề thi HSG có ghi nguồn |
| **TVA** | Bồi dưỡng HSG Toán Đại số 8 — Trần Thị Vân Anh (NXB ĐHQG HN, 2010) | 231 | Đại · Số học | ≥ 309 | 304 (+ 18 "tự giải" không đáp số) | Cuối từng chuyên đề; tắt ở §1, §5, §6, §10. **Ví dụ chia sẵn theo "Dạng k" + "Phương pháp chung"** |
| **TCDS** | Tuyển chọn các chuyên đề bồi dưỡng HSG Toán 8 — Đại số — Trương Quang An, Văn Phú Quốc (NXB ĐHQG HN, 2018) | 380 | Đại · Số học · Tổ hợp | 229 | 729 | Ngay sau từng bài; phần lớn tắt / chỉ kết quả |
| **TCHH** | — Hình học — Trần Quang Hùng (chủ biên) | 234 | Hình | 151 | 190 | Ngay sau từng bài (CĐ1–3); **30 bài CĐ4–6 chỉ có đề** |
| **VHB1** | Nâng cao và phát triển Toán 8, tập 1 — Vũ Hữu Bình (NXB Giáo dục VN) | 226 | Đại · Số học · Hình | 89 | 445 (Đại 275 · Hình 170) | Cuối sách (PDF 117–226); không đều: đủ / tắt / chỉ đáp số / "bạn đọc tự chứng minh" |
| **VHB2** | — tập 2 | 249 | Đại · Hình | 101 | 386 (Đại 179 · Hình 207) | Cuối sách (PDF 138–249); như tập 1 |
| | **Cộng 6 quyển nhập** | **1.650** | | **≈ 882** | **≈ 2.700** | |
| ~~TUHOC~~ | Bồi dưỡng năng lực tự học Toán 8 — nhóm GV Thăng Long (NXB ĐHQG TP.HCM) | 111 ảnh | Đại · Hình | 0 | ≈ 1.036 bài (≈ 5.300 ý) | **Không có lời giải ⇒ KHÔNG NHẬP (CEO 10/10).** Hồ sơ vẫn giữ: 12 tên dạng "Biến đổi đại số nâng cao" (A10) dùng làm tư liệu đặt tên |

*(Số đếm là của hồ sơ — đếm theo nhãn bài trên ảnh, do agent Sonnet lập; tôi đối chiếu ảnh gốc ở 10 trang rải cả 7 quyển: khớp. Số chính xác từng bài chỉ có sau trạm chép đề §7. "Bài" chưa tách ý.)*

**Cách hiểu "chỉ nhập cuốn có lời giải chi tiết" ở mức TỪNG BÀI** (Claude hiểu, CEO sửa nếu sai): bài có lời giải — dù tắt — **nhập** (kho viết lại đủ bước) ·
bài chỉ có **đáp số** — **nhập** (đáp số là nhân chứng, lời giải kho tự viết) · bài **không có gì** (30 bài tự luyện TCHH CĐ4–6, 18 bài "tự giải" của TVA, các bài VHB ghi
"bạn đọc tự chứng minh", bài mất đề do thiếu trang) — **không nhập**.

### 5.2 Độ tin của hồ sơ — phần nào CHƯA được đọc lại lần hai (agent ghi theo ghi chép lượt đọc đầu, ảnh sau đó bị gỡ khỏi ngữ cảnh)

VHB1 phần đề Hình PDF 66–116 (chỉ kiểm lại 19 trang) · VHB2 PDF 9–78 · TCDS chuyên đề 1, 2, 4–8 · NDT Đại số PDF 5–100 · TVA PDF 58–166.
Đủ dùng để lập kế hoạch và chia tầng; **không dùng làm số liệu nhập kho** — trạm chép đề đếm lại theo từng bài.

### 5.3 Bẫy đọc / lỗi của nguồn (trạm chép phải xử lý, không đoán — CLAUDE.md "danh tính bám khoá tự nhiên")

- **Bản scan THIẾU trang:** VHB1 — đề bài tập Đại **142–159** (giữa PDF 32 và 33, đã mở ảnh xác nhận), ví dụ 43–45 + đầu ví dụ 46, đề bài tập Hình **41–46** + đầu §5 Hình bình hành
  (lời giải của các bài này vẫn có ở cuối sách) · TVA — trang sách **32–33** (cuối §2 Dạng 8) · TCHH — trang sách 4 và 234 (không có bài).
  ⇒ bài mất đề **không nhập** (không dựng đề ngược từ lời giải), trừ khi CEO có bản đủ trang (§9 Q4).
- **Nhãn bài không dùng làm khoá một mình:** đánh lại từ 1 ở từng mục (TCDS, TCHH, TVA, NDT theo chương) · hai dãy số trùng nhau (VHB: Đại và Hình cùng dùng số 60–377) ·
  nhảy / lặp nhãn (TCHH CĐ1 C thiếu Bài 14, CĐ3 II có hai "Bài 14"; TCDS CĐ2 thiếu Bài 9, CĐ4 hai "Bài 11"; TVA §8 hai "Ví dụ 2").
  ⇒ **mã nguồn của một bài = `<MÃ sách>/<mục>/<loại><số>[<ý>]@p<trang PDF>`** (vd `TCHH/CD3-II/BT14@p152`, `VHB2/DAI/BT358@p38`); trang PDF là phần của khoá.
- **Trùng đề:** ngay trong một quyển (TCHH: ≥ 11 cặp giữa CĐ1–2–3–5; NDT: Phụ lục C lặp Phụ lục A, B và Ôn tập cuối năm; TCDS CĐ9 một đề ở hai phương pháp)
  và chắc chắn **giữa các quyển** (cùng lấy đề HSG các tỉnh) ⇒ lọc trùng theo nội dung sau chuẩn hoá (`chuanDe` của `dau-vao-soan.mjs`) trên **cả 6 quyển + 50 câu Đại và 48 câu Hình 8T đang có**.
- **Lời giải nằm xa đề** (VHB cuối sách, TVA cuối chuyên đề) ⇒ trạm chép ghép đề ↔ lời giải theo số bài **và** kiểm bằng nội dung (TVA §10: lời giải 13 thực ra của bài 26).
- **Đề Hình hầu như không kèm hình** — hình chỉ nằm trong lời giải ⇒ hình của câu **vẽ bằng code từ đề** (`scripts/anh/ve_hinh_lib.mjs`, memory `hh-hinh-de-ve-bang-code`),
  hình trong sách chỉ để đối chiếu. Ngoại lệ có hình trong đề: TCHH CĐ3 II VD1 · một số bài cơ bản NDT Hình III §1–3, Hình IV.
- **Mép trang bị cắt:** TVA (mép trái mất 1–2 chữ ở nhiều trang; khung lý thuyết nền xám khó đọc).
- **Viện dẫn chéo bằng số bài không còn khớp** (NDT "xem bài 140b", "bài 212"; TCHH CĐ7 "theo Bài toán 1, 2, 16"; VHB "~ Bài tập: 463 đến 465" trỏ sang tập khác) ⇒ bỏ khi chép, lời giải phải tự đủ (§2).
- **Nhãn "(n)" sau số bài của VHB** ("Ví dụ 103 (11)") = số § kiến thức mà bài cần — hai agent suy ra độc lập, khớp nhau ⇒ dùng làm gợi ý xếp chuyên đề; dấu `*` = bài khó.

## 6. Hiện trạng DB + ĐỀ XUẤT CHIA TẦNG bản đồ 8T

### 6.1 Đang có trên DB (đo live 10/10, phiên chỉ đọc)

- **Bản đồ cũ** `dai_ban_do` khối `8T`: 1 chủ đề "Biến đổi biểu thức" · 3 chuyên đề · **3 dạng**: `T18T010101` ứng dụng HĐT bình phương tổng hiệu (0 câu) ·
  `T18T010201` các phương pháp phân tích cơ bản (0 câu) · `T18T010301` biến đổi các biểu thức đặc biệt (**50 câu, 50 đã duyệt**, nguồn `de_thi`, lời giải người viết, **không có 2 phần**).
- **Bản đồ mới** (`dai_bdm_*`): đã chép vỏ — 1 chủ đề, 3 chuyên đề, 3 nhóm (`NNB01382`–`NNB01384`), **0 dạng bài, 0 lý thuyết**.
- **Chưa có dạng chờ** `T18T000000` ⇒ phải tạo trước bước 2 (§8 việc #1).
- **Hình** `hinh_hoc_bai` khối `8T`: 6 bài `HH00089`–`HH00094` (Hình thang 0 câu · Hình bình hành 11 · Hình chữ nhật 11 · Hình thoi 7 · Hình vuông 15 · Đối xứng tâm 4) —
  **48 câu, đều đã duyệt, 0 bài có lý thuyết**. Chưa có dạng chờ Hình 8T.

### 6.2 ⭐ ĐỀ XUẤT chia 3 tầng trên (CEO yêu cầu 10/10 — CHỜ CEO DUYỆT / SỬA; chưa ghi gì vào DB)

**Nguyên tắc chia** (theo *"8T không cần phân chia quá kĩ như 8 thường"*):
- **Chuyên đề = một chuyên đề bồi dưỡng HSG** đúng như sách chia (và như lớp T dạy). **Nhóm bài = một kiểu bài cùng mục tiêu + cùng họ phương pháp**, đủ lớn để đo
  (mastery đo ở tầng 3 — `spec-ban-do-4-tang.md` Q2). Mỗi chuyên đề chỉ **2–4 nhóm**. So sánh: khối 8 thường dùng 16 chuyên đề · 41 nhóm chỉ cho 3 chương đầu;
  đề xuất này dùng **14 chuyên đề · 37 nhóm cho toàn bộ** Đại – Số học – Tổ hợp.
- **Từng phương pháp cụ thể** (tách hạng tử · thêm bớt · Cô-si · làm trội…) **không** thành nhóm riêng — nếu sau này cần thì là tầng 4 (dạng bài), chỉ có ý nghĩa cho bổ trợ.
- **Giữ nguyên 3 chuyên đề + 3 nhóm đã có** trên bản đồ (đánh dấu ✔); 50 câu đã duyệt ở lại chỗ cũ.
- Cột "Nguồn" = số ví dụ + bài tập của 6 quyển **trước khi lọc trùng**, ước theo hồ sơ — chỉ để thấy nhóm nào dày, nhóm nào mỏng.

**A. ĐẠI SỐ · SỐ HỌC · TỔ HỢP** (`dai_bdm_*`)

| Chủ đề (tầng 1) | Chuyên đề (tầng 2) | Nhóm bài (tầng 3) | Nguồn (≈ bài) |
|---|---|---|---:|
| **1. Biến đổi biểu thức** ✔ | 1.1 Hằng đẳng thức ✔ | ① Ứng dụng hằng đẳng thức: tính, rút gọn, chứng minh đẳng thức ✔ *(nhóm đang có, tên hiện tại "…bình phương của tổng hiệu" — đề nghị mở rộng tên)* · ② Đưa về tổng các bình phương (tìm $x, y$; chứng minh biểu thức luôn dương) | 90 |
| | 1.2 Phân tích đa thức thành nhân tử ✔ | ① Các phương pháp phân tích cơ bản ✔ · ② Tách hạng tử, thêm bớt hạng tử · ③ Đổi biến, hệ số bất định, nhẩm nghiệm · ④ Đa thức nhiều biến: hoán vị vòng, đa thức đặc biệt | 250 |
| | 1.3 Đa thức và phép chia đa thức | ① Tìm dư: định lí Bê-du, sơ đồ Hoóc-ne · ② Tìm hệ số để chia hết / có dư cho trước; chứng minh đa thức chia hết cho đa thức | 120 |
| | 1.4 Phân thức đại số | ① Rút gọn phân thức và các câu hỏi kèm theo (điều kiện, giá trị, tìm $x$ nguyên để phân thức nguyên) · ② Tổng, tích có quy luật | 200 |
| | 1.5 Biến đổi các biểu thức đặc biệt ✔ | ① Tính giá trị biểu thức có điều kiện ✔ *(nhóm đang có, 50 câu)* · ② Chứng minh đẳng thức có điều kiện (đối xứng, hoán vị vòng, tỉ lệ thức) | 90 + 50 có sẵn |
| **2. Phương trình và bất phương trình** | 2.1 Phương trình một ẩn | ① Phương trình đưa về bậc nhất, phương trình tích, chứa ẩn ở mẫu · ② Phương trình bậc cao · ③ Phương trình có tham số · ④ Phương trình chứa dấu giá trị tuyệt đối | 300 |
| | 2.2 Giải bài toán bằng cách lập phương trình | ① Toán chuyển động · ② Năng suất – công việc và các loại khác | 90 |
| | 2.3 Bất phương trình | ① Bất phương trình bậc nhất, có tham số · ② Bất phương trình tích, thương, chứa dấu giá trị tuyệt đối | 110 |
| **3. Bất đẳng thức và cực trị** | 3.1 Chứng minh bất đẳng thức | ① Xét hiệu, biến đổi tương đương · ② Dùng bất đẳng thức quen thuộc (Cô-si, Bu-nhi-a-cốp-xki) · ③ Làm trội, phản chứng và các kỹ thuật khác | 250 |
| | 3.2 Giá trị lớn nhất, giá trị nhỏ nhất | ① Của đa thức · ② Của phân thức, biểu thức chứa dấu giá trị tuyệt đối · ③ Có điều kiện ràng buộc giữa các biến | 180 |
| **4. Số học** | 4.1 Chia hết | ① Chứng minh chia hết · ② Số dư, chữ số tận cùng, đồng dư · ③ Tìm số, tìm điều kiện để chia hết | 300 |
| | 4.2 Số nguyên tố, số chính phương | ① Số nguyên tố, hợp số · ② Chứng minh một số là (không là) số chính phương · ③ Tìm số để biểu thức là số chính phương | 130 |
| | 4.3 Phương trình nghiệm nguyên | ① Đưa về tích, dùng tính chia hết · ② Dùng bất đẳng thức, xét số dư · ③ Dùng tính chất số chính phương | 195 |
| **5. Tổ hợp và suy luận** | 5.1 Nguyên lí Đi-rích-lê, nguyên lí cực hạn | ① Trong số học và suy luận · ② Trong hình học tổ hợp | 80 |
| **5 chủ đề** | **14 chuyên đề** (3 đã có) | **37 nhóm bài** (3 đã có) | ≈ 2.400 |

**B. HÌNH HỌC** (`hinh_hoc_bai` — Hình tự cấu trúc riêng theo CLAUDE.md §1.6: hai tầng **Chuyên đề → Bài**; "bài" đóng vai nhóm bài, lý thuyết của bài = tóm tắt công cụ)

| Chuyên đề | Bài | Nguồn (≈ bài) |
|---|---|---:|
| H1. Tứ giác | Hình thang, đường trung bình ✔ `HH00089` · Hình bình hành ✔ `090` · Hình chữ nhật ✔ `091` · Hình thoi ✔ `092` · Hình vuông ✔ `093` · Đối xứng trục, đối xứng tâm ✔ `094` *(đang tên "Đối xứng tâm")* | 180 + 48 có sẵn |
| H2. Tam giác | Tam giác cân, tam giác đều, tam giác vuông cân · Tính số đo góc (kẻ thêm hình) | 115 |
| H3. Định lí Thalès và tam giác đồng dạng | Định lí Thalès · Tính chất đường phân giác · Tam giác đồng dạng | 225 |
| H4. Chứng minh quan hệ hình học | Vuông góc, song song · Thẳng hàng, đồng quy (Mê-nê-la-uýt, Xê-va) | 105 |
| H5. Diện tích và tính toán | Diện tích đa giác, phương pháp diện tích · Tính độ dài, góc (đặt ẩn, lập phương trình) | 180 |
| H6. Cực trị và tập hợp điểm | Cực trị hình học · Tìm tập hợp điểm · Dựng hình | 120 |
| **6 chuyên đề** | **18 bài** (6 đã có) | ≈ 925 |

**Để ngoài bản đồ (đề nghị):** *Hình không gian* (hình hộp chữ nhật, lăng trụ đứng, hình chóp — VHB2 §20–22, NDT Hình IV, ≈ 80 bài): không phải nội dung bồi dưỡng HSG, bài chủ yếu là
tính theo công thức ⇒ **không nhập**. · *Đề rèn luyện / ôn tập cuối năm* (NDT Phụ lục C 10 đề, Ôn tập cuối năm): từng bài xếp vào nhóm theo nội dung, không lập chuyên đề "tổng hợp".
❓ §9 Q1 — CEO gật / đổi hai chỗ này.

**Chỗ Claude chưa chắc trong đề xuất** (CEO xem kỹ): (1) 2.1④ phương trình chứa dấu giá trị tuyệt đối đặt ở Phương trình hay gom với 2.3 Bất phương trình;
(2) 1.5 tách 2 nhóm "tính giá trị" / "chứng minh" — 50 câu đang có chưa đọc hết nên chưa biết có câu chứng minh không;
(3) 2.2 chỉ 2 nhóm (sách TVA chia 8 dạng lời văn); (4) H6 gom ba kiểu bài rất khác nhau vì mỗi kiểu ít bài.

## 7. Dây chuyền cho sách SCAN (README §2b, đổi trạm 0–1; các trạm sau giữ nguyên)

| # | Trạm | Ai | Làm gì | Bẫy riêng 8T |
|---|---|---|---|---|
| 0 | Dựng ảnh | máy | `pdftoppm -r 150 -gray -png "<pdf>" <KHO_LAM_VIEC>/sach/8T/<MÃ>/trang/p`. Vân tay SHA-256 tệp gốc ghi cạnh | Bản đọc lướt 10/10 dựng ở 82–92 dpi trong thư mục tạm của phiên — đủ để lập hồ sơ, **không** đủ để chép số mũ |
| 1a | **Chép đề + lời giải sách** | **Sonnet** đọc ảnh, mỗi lượt một mục sách | Ra `bai.json` **cùng khuôn `tach-bai.mjs`** (để trạm 1–7 của README §2b dùng lại nguyên): `ma_nguon` (§5.3) · `trang_pdf` · `noi_dung` (LaTeX, nguyên văn sách, chưa chuẩn hoá) · `y[]` · `nguon_de` (dòng in nghiêng dưới đề) · `co_hinh_trong_de` · `loi_giai_sach` (nguyên văn) · `muc_loi_giai` (đủ / tắt / đáp số / không) · `khong_doc_duoc[]` | Mục nào hồ sơ báo thiếu trang ⇒ ghi `thieu_de`, không dựng đề từ lời giải. `muc_loi_giai = không` ⇒ không nhập (§5.1) |
| 1b | **Chép lần hai, độc lập** | model khác (Opus hoặc Haiku đọc ảnh — đo ở lô đầu) | Chỉ chép **đề** → máy so với 1a từng công thức sau chuẩn hoá → danh sách lệch | Hai lượt cùng sai giống nhau thì máy không thấy ⇒ trạm kiểm đáp số (máy tính từ đề, so đáp số sách) là lưới thứ hai |
| 1c | Quyết chỗ lệch | Opus mở ảnh | Sửa `bai.json`, ghi vết vào `bai.sua.json` (đo tỉ lệ chép sai theo sách) | — |
| 2 | Lọc trùng | máy | `dau-vao-soan.mjs` + mở rộng: so trong quyển, **giữa 6 quyển**, với câu 8T đang có. Trùng ⇒ giữ **một** bản (ưu tiên bản có lời giải đủ: NDT › TVA › TCDS / TCHH › VHB), bản kia ghi `trung_voi` | Trùng "gần" (đổi số, đổi tên điểm) **không** gộp — là hai câu |
| 3 | Bộ kiểm đáp số | Opus | `k8T-kiem.mjs` viết **từ đề**, trước khi mở bản soạn (§4) | Hàm không kiểm được ⇒ `khong_kiem_duoc` thật, không trả "đạt" giả |
| 4 | Soạn | Sonnet (3 song song) | Brief `kho-rules/dai/lo/k8T-brief-soan.md` (chưa viết — việc #4) chép nguyên §1–§3 file này + lô mẫu CEO đã duyệt. **Được đọc `loi_giai_sach`**, viết lại đủ bước + Phần 1. Ra `.soan.json` có thêm `cong_cu[]` | Lời giải sách sai / hổng ⇒ `ghi_chu_nghi`, không chép theo |
| 5 | Soát | Opus (≠ soạn), **giải mù trước, đọc bản soạn sau** | Ba nguồn đáp số (soát · soạn · sách) lệch nhau ⇒ dừng câu đó. Sửa ghi `.sua.json` | Lỗi lập luận + công cụ dùng ngầm máy không bắt |
| 6 | Dựng lô + cổng ghi | máy | Đại: `lo-tu-soan.mjs` → `ghi-lo.mjs … --chua-gan-dang` vào `T18T000000`, `da_duyet=false`, `nguon_giai='ai'`. Hình: `nhap_hh_tu_draft.mjs` → dạng chờ Hình 8T → `gan_hinh.mjs` (kho kiểu 1) | Không chạy 2 lượt `--ghi` song song (cấp mã câu va nhau) |

**Thứ tự đi qua sách:** quyển có lời giải đủ đi trước để rút khuôn — **NDT → TVA → TCDS → VHB** cho Đại / Số học; **TCHH → NDT → VHB** cho Hình.

## 8. Kế hoạch theo quy trình 3 bước

| Bước | Việc của 8T | Trạng thái |
|---|---|---|
| **1. Rút luật giải** | B1 đọc ✅ · B2 hồ sơ ✅ · B3 luật nháp ✅ → **B4 giải một lượt qua mọi nhóm bài**, mỗi lô 10–20 câu lấy từ ví dụ + bài tập có lời giải của sách (chép tay đúng các câu của lô, chưa cần trạm chép hàng loạt). Bảng lô dưới | **Kế tiếp: lô Đ1** (sau khi CEO xem §6.2 — không bắt buộc chờ duyệt xong) |
| **2. Giải toàn bộ** | Sau v1: trạm chép hàng loạt (§7) từng quyển → dây chuyền README §2b → dạng chờ `T18T000000` / dạng chờ Hình 8T | Sau v1 |
| **3. Xếp vào bản đồ** | CEO duyệt §6.2 ⇒ đưa lên ERP › Bản đồ mới ⇒ Claude xếp câu dạng chờ + 50 câu cũ + 48 câu Hình cũ vào nhóm bài (dùng `cong_cu` — phương pháp thắng chủ đề) ⇒ CEO duyệt | Chờ duyệt §6.2 |

**Bảng lô thử — mỗi lô một chuyên đề của §6.2, phủ đủ các nhóm bài (đánh dấu khi đã qua CEO).** Thứ tự mặc định theo bản đồ; CEO đổi nếu lớp cần mảng nào trước (§9 Q2).

| Lô | Chuyên đề | Phải phủ (mỗi mục ≥ 1 câu) | Nguồn câu | Qua CEO |
|---|---|---|---|---|
| **Đ1** | 1.2 Phân tích nhân tử | 4 nhóm; trong đó tách · thêm bớt · đổi biến · hệ số bất định · nhẩm nghiệm nguyên / hữu tỉ · hoán vị vòng · $a^3+b^3+c^3-3abc$ mỗi thứ một câu | TVA §2 Dạng 1–8 · TCDS CĐ1 I–VII · VHB1 chuyên đề | |
| Đ2 | 1.1 + 1.5 Hằng đẳng thức · biểu thức đặc biệt | 4 nhóm; thế · đối xứng · hoán vị vòng · $a+b+c=0$ · tỉ lệ thức · tổng bình phương | TCDS CĐ2 Dạng 3–4 · VHB1 §2 · NDT Đại I §2 | |
| Đ3 | 1.3 Đa thức, phép chia | 2 nhóm; tìm hệ số (3 cách — §2b A) · tìm dư không chia · Hoóc-ne · chứng minh chia hết | TVA §1 · VHB1 chuyên đề | |
| Đ4 | 1.4 Phân thức | 2 nhóm; rút gọn + câu hỏi phụ · tổng có quy luật · tách thành tổng phân thức | TVA §3 · TCDS CĐ2 Dạng 1–2 · NDT Đại II | |
| Đ5 | 2.1 + 2.2 Phương trình · lập phương trình | 6 nhóm | TVA §4–5 · VHB2 §7–10 · NDT Đại III | |
| Đ6 | 2.3 Bất phương trình (+ giá trị tuyệt đối) | 2 nhóm + nhóm 2.1④ | VHB2 §12–15 · TVA §6 · NDT Đại IV | |
| Đ7 | 4.1 + 4.2 Chia hết · số nguyên tố · số chính phương | 6 nhóm | VHB1 chuyên đề · TCDS CĐ3, 7, 8 · TVA §7 | |
| Đ8 | 4.3 Nghiệm nguyên | 3 nhóm, đủ 6 phương pháp của TCDS CĐ9 | TCDS CĐ9 · TVA §10 | |
| Đ9 | 3.1 + 3.2 Bất đẳng thức · cực trị | 6 nhóm | VHB2 hai chuyên đề · TVA §8 · TCDS CĐ4–5 | |
| Đ10 | 5.1 Đi-rích-lê | 2 nhóm + cực hạn | TCDS CĐ10 | |
| **H1** | H1 Tứ giác | chứng minh là hình gì · dùng tính chất · thẳng hàng – đồng quy trong tứ giác · tìm điều kiện · bài hình vuông kinh điển (kẻ phụ trên tia đối) | NDT Hình I · TCHH CĐ2 · VHB1 | |
| H2 | H2 Tam giác, tính góc | 5 dạng TCHH CĐ1 C (vuông cân · đều · cân biết một góc · liên hệ góc · nửa tam giác đều) + chứng minh tam giác cân / đều | TCHH CĐ1 | |
| H3 | H3 Thalès · phân giác · đồng dạng | đoạn tỉ lệ · kẻ song song phụ · đẳng thức nghịch đảo · ba trường hợp đồng dạng · tỉ số diện tích | VHB2 §13–18 · NDT Hình III · TCHH CĐ5 | |
| H4 | H4 Vuông góc – song song · thẳng hàng – đồng quy | 9 cách chứng minh vuông góc, 5 cách song song (TCHH CĐ3) · Mê-nê-la-uýt · Xê-va | TCHH CĐ3–4 | |
| H5 | H5 Diện tích · tính toán | tỉ số diện tích · diện tích ⇒ quan hệ độ dài · đặt ẩn lập phương trình | VHB1 chuyên đề · NDT Hình II · TCHH CĐ6–7 | |
| H6 | H6 Cực trị · tập hợp điểm · dựng hình | cực trị bằng đường vuông góc – đường xiên, bằng đối xứng, bằng bất đẳng thức đại số · tập hợp điểm · dựng hình 4 bước | VHB1 §3 + chuyên đề · VHB2 chuyên đề | |

**Việc kỹ thuật (Claude tự làm, không cần hỏi):**

| # | Việc | Vì sao |
|---|---|---|
| 1 | Migration tạo dạng chờ `T18T000000` (`dai`, khuôn các khối khác) + dạng chờ Hình 8T (khuôn mig `202610100831_hinh_hoc_dang_cho_khoi_8`) | Đường ghi của bước 2 (giải ≠ xếp) |
| 2 | Trạm chép đề từ ảnh (§7 trạm 1a–1c): khuôn `bai.json` + máy so hai lượt chép | Nguồn 8T không có lớp chữ; chưa khối nào chép SÁCH từ scan (K6–K8 mới chép đề thi 2–4 trang) |
| 3 | `kho-rules/dai/lo/k8T-kiem.mjs` (đa thức BigInt; vét cạn nghiệm nguyên; thử chia hết; lưới bất đẳng thức) | §4 |
| 4 | `kho-rules/dai/lo/k8T-brief-soan.md`, `k8T-brief-soat.md` (khuôn `k8-brief-*.md`) — viết sau lô Đ1 được CEO duyệt | README §4 việc #5 |
| 5 | Lọc trùng xuyên sách (mở rộng `dau-vao-soan.mjs`) | §5.3 |
| 6 | Sau khi CEO duyệt §6.2: đưa 11 chuyên đề + 34 nhóm bài mới lên bảng nháp `dai_bdm_*`, 12 bài Hình mới vào `hinh_hoc_bai` — viết migration, CEO gật mới áp | Bước 3 |

## 9. Câu hỏi CEO

**Đã trả lời 10/10** (ghi ở §10): chương trình 8T (nâng cao là chính, không bám khối 8) · công cụ được dùng (trọn bộ theo sách) · phạm vi nhập (chỉ quyển có lời giải) · độ mịn bản đồ (thô hơn khối 8).

**Còn mở:**

| # | Câu hỏi | Mặc định nếu chưa trả lời |
|---|---|---|
| **Q1** | **Duyệt / sửa đề xuất chia tầng §6.2** — kể cả 4 chỗ chưa chắc ghi dưới bảng, và hai mục để ngoài (hình không gian không nhập; đề rèn luyện rải vào các nhóm) | Giải vẫn chạy (câu vào dạng chờ); chưa ghi gì lên bản đồ |
| Q2 | Thứ tự chuyên đề làm trước: theo bảng lô §8 (Đ1 phân tích nhân tử → …), hay lớp đang cần mảng nào gấp? | Theo §8 |
| Q3 | Thuật ngữ: phiên âm ("Đi-rích-lê", "Cô-si") hay tên gốc ("Dirichlet", "Cauchy")? `k8.md` đang viết "Thalès", "Pythagore" | §3: Thalès, Pythagore; còn lại phiên âm |
| Q4 | Có **bản đủ trang** của VHB tập 1 (thiếu đề Đại 142–159, Hình 41–46, ví dụ 43–46) và TVA (thiếu trang sách 32–33) không? | Bỏ các bài mất đề |
| Q5 | 50 câu Đại + 48 câu Hình 8T **đã duyệt** nhưng lời giải chưa có 2 phần: viết lại theo khuôn mới, hay để nguyên? | Để nguyên; sửa một lượt khi luật lên v1 |

## 10. NHẬT KÝ SỬA (append-only — CEO sửa gì ghi đó, rồi nâng thành luật ở trên)

| Ngày | Câu | CEO sửa gì | Luật rút ra |
|---|---|---|---|
| 10/10 | — | *(ghi việc làm)* Thùy: *"Context này xây kho và bản đồ của khối 8T. Đọc spec khối 4 để hiểu thêm rồi làm spec cho khối 8. Đọc 1 lượt các tài liệu ở đây."* Đọc `k4T.md`, README, `k8.md`, `spec-ban-do-4-tang.md` §0; dựng ảnh 1.761 trang của 7 quyển; 7 agent Sonnet đọc mỗi quyển một lượt, viết hồ sơ `lo/k8T/ho-so/`; tôi đối chiếu ảnh gốc 10 trang (khớp) + xác nhận VHB1 thiếu bài 142–159; đo DB 8T | v0. Đề xuất: 3 tầng kiến thức + khai công cụ theo câu · trạm chép đề hai lượt · mã nguồn có trang PDF |
| 10/10 | v0 §9 Q1 (chương trình) | *"8T học nâng cao là chính — không cần quan tâm khối 8."* | Bỏ ràng buộc "lớp 8 hiện hành" và luật thứ tự bài; các khối chương trình cũ (bất phương trình, giá trị tuyệt đối, diện tích, quỹ tích…) nhập như mọi chuyên đề khác. Bỏ mục v0 §1.4 |
| 10/10 | v0 §9 Q2 (công cụ) | *"8T được dùng full công cụ cao cấp — thể hiện rõ trong các cuốn sách rồi."* | §1 viết lại: chuẩn kiến thức = 6 quyển sách; sách dùng gì kho dùng nấy, gọi tên + đủ điều kiện; đi theo hướng giải của sách; chỉ cấm thứ sách không có. Bỏ "3 tầng". `cong_cu` giữ lại cho việc xếp nhóm |
| 10/10 | v0 §9 Q3 (phạm vi) | *"Chỉ nhập các cuốn có lời giải chi tiết thôi."* | Bỏ quyển TUHOC. Ở mức bài: có lời giải / có đáp số ⇒ nhập; không có gì ⇒ không nhập (§5.1 — cách hiểu của Claude). Trạm soạn được đọc lời giải sách (§4) |
| 10/10 | Bản đồ | *"8T không cần phân chia quá kĩ như 8 thường. M đề xuất phân chia 3 tầng trên đi xem nào."* | §6.2: đề xuất 5 chủ đề · 14 chuyên đề · 37 nhóm bài (Đại – Số học – Tổ hợp) + 6 chuyên đề · 18 bài (Hình); nguyên tắc mỗi chuyên đề 2–4 nhóm, phương pháp cụ thể không thành nhóm. **Chờ CEO duyệt** |
