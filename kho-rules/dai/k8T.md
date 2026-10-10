# kho-rules/dai/k8T.md — SPEC khối 8T (Toán 8 nâng cao / bồi dưỡng HSG — Đại · Số học · Tổ hợp · Hình): KHO + BẢN ĐỒ

> **Trạng thái: v0.2 (10/10/2026 khuya) — CEO đã chốt hướng + DUYỆT BẢN ĐỒ + bảo "add các bài vào kho đi" (§10).** Mọi lần giải / soát / ghi câu khối 8T PHẢI đọc file này trước.
> Mỗi lần CEO sửa ⇒ ghi §10 (nhật ký) rồi nâng luật ở §1–§4 và brief `lo/k8T-brief-chep-soan.md`.
> **Khối 8T KHÔNG đi vòng "lô thử → v1" như 4T/5T:** CEO cho nhập thẳng ⇒ đang ở **BƯỚC 2 + 3 gộp** (README §0): chép – soạn – soát – ghi kho, câu vào **thẳng nhóm bài**
> của bản đồ đã duyệt (hai lượt gán nhóm độc lập phải khớp; lệch ⇒ dạng chờ), `da_duyet=false` — CEO / học thuật duyệt ở màn Duyệt lời giải, sửa gì thì thành luật.
> **Tiến độ + câu treo: §8.** Lô 1–2 = **143 câu** đã ghi (10/10); có lọc trùng từ lô 2. Dây chuyền đã chạy: §7.
>
> **Phạm vi của context này (Thùy 10/10): xây KHO và BẢN ĐỒ của khối 8T.** Bản đồ = §6.2 — **CEO duyệt 10/10, đã lên DB** (mig `202610101403`).
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

- ⭐ **Nhịp viết (CEO 10/10):** *"Bài nào tắt quá thì cần giải chi tiết hơn. Đáp án cho học sinh nâng cao không cần trình bày quá chi li như thường, được sử dụng nhiều
  công cụ hơn và nhịp độ làm bài nhanh hơn. Nhưng t vẫn muốn có giải hẳn hoi."* ⇒ sách chỉ ghi kết quả / "Tương tự" / "Dễ thấy" thì **viết đủ lời giải**; nhưng Phần 2 **không** viết
  kiểu lớp thường: được gộp hai phép biến đổi hiển nhiên vào một dòng, không chép lại quy tắc cơ bản. Mốc: học sinh giỏi đọc từng dòng **không phải tự nháp thêm** mới hiểu
  vì sao dòng dưới suy ra từ dòng trên. Mẫu nhịp viết: `lo/k8T-brief-chep-soan.md` §3.
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

- **Kiểm CHÉP (mới của 8T — nguồn là ảnh):** đề trong kho phải khớp ảnh trang. Cách đang chạy (§7 trạm 2a): trạm chép ghi riêng **đề** và **kết quả của sách**; máy thay số,
  hai mẩu phải bằng nhau — lệch ⇒ người soát mở ảnh quyết. Câu không có kết quả sách (bài chứng minh, sách bỏ dở) ⇒ chỉ còn người soát so ảnh từng câu. Số mũ, chỉ số dưới, dấu $\vdots$ nhoè, "l" ↔ "1", dấu trừ mất là các chỗ scan hay sai
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

### 6.1 Có trên DB TRƯỚC khi lên bản đồ mới (đo live 10/10 chiều — hiện trạng sau đó: §6.2 khung "Trên DB" + §8)

- **Bản đồ cũ** `dai_ban_do` khối `8T`: 1 chủ đề "Biến đổi biểu thức" · 3 chuyên đề · **3 dạng**: `T18T010101` ứng dụng HĐT bình phương tổng hiệu (0 câu) ·
  `T18T010201` các phương pháp phân tích cơ bản (0 câu) · `T18T010301` biến đổi các biểu thức đặc biệt (**50 câu, 50 đã duyệt**, nguồn `de_thi`, lời giải người viết, **không có 2 phần**).
- **Bản đồ mới** (`dai_bdm_*`): đã chép vỏ — 1 chủ đề, 3 chuyên đề, 3 nhóm (`NNB01382`–`NNB01384`), **0 dạng bài, 0 lý thuyết**.
- **Chưa có dạng chờ** `T18T000000` ⇒ phải tạo trước bước 2 (§8 việc #1).
- **Hình** `hinh_hoc_bai` khối `8T`: 6 bài `HH00089`–`HH00094` (Hình thang 0 câu · Hình bình hành 11 · Hình chữ nhật 11 · Hình thoi 7 · Hình vuông 15 · Đối xứng tâm 4) —
  **48 câu, đều đã duyệt, 0 bài có lý thuyết**. Chưa có dạng chờ Hình 8T.

### 6.2 ⭐ Bản đồ 8T — 3 tầng trên (CEO DUYỆT 10/10: *"OK Chia như thế đi"*; đã lên DB bằng mig `202610101403_k8t_ban_do_3_tang`)

> **Trên DB:** mỗi nhóm bài có mặt ở cả bản đồ đang chạy (`dai_ban_do`, mã `T18T0c0d0n` — bảng mã ↔ tên: `lo/k8T-brief-chep-soan.md` §4) lẫn bản nháp `dai_bdm_*`
> (kèm đối ứng dạng cũ → nhóm). Dạng chờ: `T18T000000` (Đại), `HH8T000000` (Hình). 12 bài Hình mới = `HH00125`–`HH00136`.
> 34 dạng mới tạm `muc_do = 4`, `bac_toi_thieu = 'A'` (hai cột bắt buộc, CEO chưa cho giá trị) — **CEO chỉnh ở màn Bản đồ**.
> Đổi tên 4 dòng đã có (ghi trong migration). **Chưa làm:** 12 câu *chứng minh* trong 50 câu cũ vẫn nằm ở nhóm ① "Tính giá trị…" của 1.5 — chuyển sang ② là việc đổi dạng
> của câu đã duyệt (đổi cả mã câu) ⇒ để CEO / học thuật bấm ở màn Duyệt, tôi không tự chuyển.

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

**Để ngoài bản đồ (CEO gật 10/10):** *Hình không gian* (hình hộp chữ nhật, lăng trụ đứng, hình chóp — VHB2 §20–22, NDT Hình IV, ≈ 80 bài): không phải nội dung bồi dưỡng HSG, bài chủ yếu là
tính theo công thức ⇒ **không nhập**. · *Đề rèn luyện / ôn tập cuối năm* (NDT Phụ lục C 10 đề, Ôn tập cuối năm): từng bài xếp vào nhóm theo nội dung, không lập chuyên đề "tổng hợp".

**CEO trả lời 5 chỗ Claude hỏi (10/10):** (1) 2.1④ phương trình chứa dấu giá trị tuyệt đối để ở Phương trình — *OK* · (2) 1.5 tách "tính giá trị" / "chứng minh" — *"Cái đấy là
biến đổi thôi, lúc đấy cũng chưa nghĩ kĩ lắm"* (nhóm cũ chỉ là rổ chung ⇒ giữ cách tách) · (3) 2.2 — *"2 nhóm thôi"* · (4) H6 gom ba kiểu bài — *OK* · (5) Hình không gian không nhập — *OK*.

**⭐ Chuyên đề "Kiến thức cơ bản" (CEO 10/10, mig `202610101427`):** *"Bài tập cơ bản cho vào 1 chuyên đề — gọi là kiến thức cơ bản đi"* (và kho 8T *"không chung với khối 8 thường"*).
Một chuyên đề **dùng chung**, đứng đầu chủ đề 1 và chủ đề 2; nhóm chia theo bài học: `T18T010601` Nhân, chia đa thức · `010602` Hằng đẳng thức · `010603` Phân tích đa thức thành nhân tử ·
`010604` Phân thức đại số · `T18T020401` Phương trình · `020402` Giải bài toán bằng cách lập phương trình · `020403` Bất phương trình. Câu thuộc tầng "Bài tập cơ bản" của sách vào nhóm của
**bài học chứa nó**, bất kể mục tiêu của đề (bài cơ bản "tìm $x$" của bài Phân tích nhân tử vẫn ở nhóm cơ bản Phân tích nhân tử). Bản đồ Đại 8T hiện: 5 chủ đề · 15 chuyên đề · 44 nhóm bài.

**Ranh giới giữa các nhóm đã chốt qua các lô** (ghi cả vào brief §4): phương trình **bậc ≥ 3** ⇒ 2.1② *bậc cao* dù chỉ nhóm hạng tử đưa về tích (lô 1).

## 7. Dây chuyền cho sách SCAN — bản ĐÃ CHẠY ở lô 1 (10/10). Khác README §2b ở các trạm đầu vì nguồn là ảnh

| # | Trạm | Ai | Làm gì | Bẫy / số đo lô 1 |
|---|---|---|---|---|
| 0 | Dựng ảnh | máy | `pdftoppm -r 150 -gray -f <a> -l <b> -png "<pdf>" <KHO_LAM_VIEC>/sach/8T/<MÃ>/trang/p` (máy công ty: `C:\Users\WBPC\bk-kho-lam-viec`) | 150 dpi đọc rõ số mũ; bản 82–92 dpi của lượt đọc hồ sơ không đủ |
| 1 | **Chép + soạn** | **Sonnet**, mỗi agent một § sách (≈ 4 trang, 10–12 bài) — 3 agent song song | Brief **`kho-rules/dai/lo/k8T-brief-chep-soan.md`** (đủ luật, bảng mã nhóm, khuôn tệp). Ra **một tệp `.cs.md`**: mỗi câu một khối `=== <mã>` + dòng meta (`nhom`, `cong_cu`, `kiem`, `ket_qua_sach`, `dap_an`, `ghi_chu_nghi`) + `## DE` (đề) + `## SACH` (nguyên văn lời giải sách) + `## GIAI` (lời giải kho 2 phần) | Dùng **markdown, không JSON** — LaTeX một dấu `\`, model không phải tự thoát kí tự. 4–6 phút / §. Lô 1: sách chỉ ghi đáp số 31 câu, bỏ dở / tắt 13 câu, đủ 28 câu; agent tự phát hiện 3 chỗ sách in sai và 1 đề thiếu điều kiện |
| 2 | Dựng lô + cổng | máy | `node scripts/kho/sach/lo-tu-chep.mjs <…cs.md> --khoi 8T --lo <n> --ten <tên> [--sua x.sua.json] [--mu x.mu.json]` ⇒ `<tên>.bai.json` · `<tên>.de.json` (đề không kèm nhóm) · `<tên>.json` (lô). Cổng: khuôn 2 phần · Phần 1 card 3–6 bước · KaTeX · dấu nhân · **kiểm chép** · **kiểm đáp số** | Một lỗi ⇒ không ra lô. Lô 1: 72/72 qua sau 1 lần sửa |
| 2a | **Kiểm chép** (trong trạm 2) | máy | `ket_qua_sach` (kết quả của sách, chép riêng) phải **bằng đề đã chép** khi máy thay số (`k8T-kiem.mjs`) — hai mẩu chép độc lập trên cùng trang; lệch ⇒ mở ảnh | **Thay cho "chép hai lượt bằng hai model" của bản nháp** — rẻ hơn và bắt được cả lỗi in của sách. Lô 1: 48/72 đối chiếu được, bắt đúng 1 chỗ lệch (bài 55d: **sách in sai**). 24 câu không đối chiếu được (bài chứng minh / sách không ghi kết quả) ⇒ chỉ còn người soát đối chiếu ảnh |
| 2b | **Kiểm đáp số** (trong trạm 2 và ở cổng ghi) | máy | Dòng `kiem` viết từ đề: `bang \| <biểu thức>` · `gia_tri \| <biểu thức> \| x=…` · `nghiem \| <vế trái> = <vế phải> \| x` · `khong`. Máy tính biểu thức LaTeX bằng số hữu tỉ BigInt tại 12 bộ số; tự thử: `node kho-rules/dai/lo/k8T-kiem.thu.mjs` | Lô 1: 55/72 đáp án khớp đề; 17 không kiểm được (chứng minh, căn bậc hai, nghiệm nguyên). `nghiem` **không** bắt được thiếu nghiệm. Máy chưa đọc: `\sqrt`, số mũ là chữ |
| 3 | **Soát** | **Opus** (phiên chính) | Mở ảnh từng trang, so đề từng câu; đọc từng lời giải. Sửa ghi vào `<tên>.sua.json` (`noi_dung` / `dap_an` / `loi_giai` / `nhom` / `sach_in_sai` / `bo`) — không sửa đè `.cs.md` | Lô 1: sửa 4/72 — 1 đề (bỏ ý sách thiếu điều kiện), 2 nhóm (luật bậc ≥ 3), 1 xác nhận sách in sai. **Không sửa lời giải nào** |
| 4 | **Gán nhóm mù** | **model khác, agent riêng** chỉ được mở `<tên>.de.json` + bảng nhóm | Ra `<tên>.mu.json` `{model, lan_chay, cau: {mã: {dang, ly_do}}}`. Chạy lại trạm 2 với `--mu`: nhóm trạm soạn ≠ nhóm gán mù ⇒ câu vào **dạng chờ** | Phiên chính KHÔNG tự gán mù được (đã đọc báo cáo của trạm soạn). Lô 1: 67/72 khớp; 5 lệch ⇒ 2 gỡ bằng luật ranh giới, 3 vào dạng chờ |
| 5 | Cổng ghi | máy | `node scripts/kho/sach/ghi-lo.mjs <tên>.json --sach "<tên sách>" --kiem kho-rules/dai/lo/k8T-kiem.mjs --so-do kho-rules/dai/so-do --kiem-ngoai <tên>.mu.json --model-lam claude-sonnet-5-5 --lan-lam "<mô tả>"` ⇒ chạy thử (ROLLBACK) ⇒ thêm `--ghi` | **Không** `--chua-gan-dang` (câu vào thẳng nhóm). `ghi-lo` nhận `kiem_doc` do lô mang theo (sách scan không có bản tách bằng máy để so chữ). Không chạy 2 lượt `--ghi` song song |

**Tên sách ghi vào `ten_de_goc`** (khoá chống ghi trùng, đừng đổi): NDT = `CĐ BD HSG Toán 8 – Nguyễn Đức Tấn`. Mã câu: `<khu>.<bài><ý>@p<trang PDF>` — khu NDT: `D1`–`D4` Đại chương I–IV · `H1`–`H4` Hình · `OT` ôn tập cuối năm · `PA` `PB` `PC` phụ lục.

**⭐ TỰ DUYỆT (Thùy 10/10: *"bài của 8T, m auto duyệt đưa vào kho luôn nhé"*) — trạm 6, sau cổng ghi:** `node scripts/kho/sach/tu-duyet.mjs <lô.json> … --sach "<tên sách>" [--ghi]` ⇒
`da_duyet = true`, `duyet_nguon = 'ai'` cho các câu của lô. **Không tự duyệt, để người:** câu ở dạng chờ (DB cũng chặn) · câu cổng gắn cờ `nghi` · câu đang chờ CEO quyết
(`cho_quyet` trong `.sua.json` — các câu này có trên trang "câu cần chị xem"). Đây là quyết định RIÊNG của khối 8T; khối khác vẫn theo luật lên cấp của `spec-luong-kho.md` (C9: đo tỉ lệ lọt rồi mới tự duyệt)
— script chỉ chạy cho khối có tên trong `DUOC_TU_DUYET`. Hệ quả phải nhớ: câu vào kho chuẩn ngay, **không còn người đọc trước** — lưới còn lại là máy thay số (≈ 60% câu),
Opus soát đối chiếu ảnh sách (mọi câu), và báo sai từ GV / HS sau khi dùng. Câu chứng minh (máy không kiểm được) chỉ có một lớp là Opus soát.

**⭐ LỌC TRÙNG (Thùy 10/10: *"T nghĩ phải làm lọc trùng đấy"*) — `scripts/kho/sach/loc-trung.mjs`, chạy trong trạm 2 khi thêm `--db --sach "<tên sách>"`:**

| Mức | Máy nhận ra bằng gì | Máy làm gì |
|---|---|---|
| **Trùng CHỮ** | đề giống nhau sau khi bỏ dòng nguồn đề "(Đề thi HSG …)", dấu cách, `$`, `\left`, dấu câu | **bỏ** câu mới, ghi vào `<tên>.trung.json` |
| **Trùng TOÁN** | cùng loại lệnh và biểu thức **bằng nhau khi máy thay số**, VÀ (cùng tập hạng tử — chỉ đổi thứ tự — HOẶC cùng một bài của cùng một sách: sách in sẵn dạng đã tách, vd $x^2+3x+2x+6$ ↔ $x^2+5x+6$) | **bỏ** — trong cùng lô giữ câu có đề ngắn nhất |
| **Nghi trùng** | cùng khuôn chữ / cùng bộ công thức sau khi thay số bằng `#` và cùng đáp án (vd $a^{100}+b^{100}=\dots$, tính $a^{2004}+b^{2004}$ ↔ $a^{2010}+b^{2010}$) · hoặc bằng nhau về giá trị nhưng viết khác hẳn ở hai bài khác nhau | **giữ**, chỉ liệt kê — CEO 10/10: *"Của đề riêng cứ để riêng thôi. Coi như là biến thể"*, *"giống hệt nhau mới bỏ, chứ còn form đề khác nhau cứ giữ"* ⇒ không cần hỏi lại từng nhóm |

- So với **toàn bộ câu đang có trong kho Đại 8T** (đọc DB) + các câu trong cùng lô. Không so với khối 8 thường (CEO 10/10: kho 8T *"không chung với khối 8 thường"*).
- Quét cả kho bất kì lúc nào: `node scripts/kho/sach/loc-trung.mjs --khoi 8T --ra kho-rules/dai/lo/k8T/loc-trung-kho.md`.
- Giới hạn đã biết: trùng toán chỉ lập được cho câu có dòng `kiem` (biến đổi, phương trình, tính giá trị); bài **chứng minh / lời văn** chỉ bắt được trùng chữ và nghi trùng khuôn ⇒ hai sách diễn đạt khác nhau cùng một bài chứng minh thì máy chưa thấy — người duyệt là lưới cuối. Bản đầu của máy coi mọi cặp "bằng nhau về giá trị" là trùng và bỏ nhầm một câu (bài 84b ↔ 57b: hai đề khác nhau cho cùng một đa thức) ⇒ đã hạ xuống mức nghi.

**Câu tầng "Bài tập cơ bản" (CEO 10/10):** thêm `--co-ban kho-rules/dai/lo/k8T/<sách>.co-ban.json` (bảng số bài ↔ nhóm cơ bản) ⇒ câu `tang: co_ban` vào thẳng nhóm *Kiến thức cơ bản* của bài học chứa nó, không qua gán mù (luật máy, biên bản `kiem-dang` cách `code`).

**Chưa có:** nhánh **Hình** (`nhap_hh_tu_draft.mjs` + vẽ hình bằng code) chưa chạy lô nào.

**Thứ tự đi qua sách:** quyển có lời giải đủ đi trước — **NDT → TVA → TCDS → VHB** cho Đại / Số học; **TCHH → NDT → VHB** cho Hình.

## 8. Kế hoạch + TIẾN ĐỘ (cập nhật sau mỗi lô — số đo DB live)

| Lô | Khu sách | Câu ghi | Vào nhóm cơ bản | Máy xác nhận đáp án | Sửa khi soát | Gán nhóm khớp | Tệp (`kho-rules/dai/lo/k8T/`) |
|---|---|---:|---:|---:|---:|---|---|
| 1 (10/10) | NDT Đại I §3–5 — phân tích nhân tử, bài 27–60 | **72** | 34 | 55/72 | 4 | 67/72 | `NDT-D1-s3/s4/s5.cs.md` · `NDT-D1-ptnt.*` |
| 2 (10/10) | NDT Đại I §2 hằng đẳng thức (14–26) · §7 chia đa thức (71–81) · ôn tập chương I (82–89) · ý b bài 35 | **71** | 33 | 40/71 | 3 | 34/38 câu không thuộc tầng cơ bản | `NDT-D1-s2/s7/ot/bs.cs.md` · `NDT-D1-hdt-chia-ot.*` |
| 3 (10/10) | NDT Đại I §1 nhân đa thức (1–13) · §6 chia đơn thức (61–70) · **Đại II phân thức trọn chương** (1–52) | **105** | 51 | 48/105 (kiểm chép + đáp số; riêng đáp số 57) | 4 câu sửa nội dung · 8 chỗ sách in sai | 51/54 câu không thuộc tầng cơ bản | `NDT-D1-s1/s6.cs.md` · `NDT-D2-s1/s2/s3/s4/ot.cs.md` · `NDT-D1s16-D2.*` |
| 4 (10/10) | NDT **Đại III phương trình trọn chương** (1–73): §1 mở đầu · §2 đưa về $ax+b=0$ · §3 tích · §4 chứa ẩn ở mẫu · §5 lập phương trình · ôn tập | **93** | 48 | 49/93 (kiểm chép + đáp số) | 2 câu sửa nội dung · 6 chỗ sách in sai | **45/45** câu không thuộc tầng cơ bản | `NDT-D3-s1…s5.cs.md` · `NDT-D3-ot.cs.md` · `NDT-D3-pt.*` |
| **Tổng** | | **341** | 166 | | | | kho Đại 8T: **390 câu** — 385 đã duyệt (50 cũ người duyệt + **335 mới tự duyệt**) · 5 chưa duyệt (4 câu dạng chờ: 89b + 3 câu lô 3 · bài 73 chương III chờ CEO quyết); 2 câu trùng của lô 1 đã xoá mềm |

Lô 4: lọc trùng không bỏ câu nào; soát đối chiếu ảnh p52–80. Sách in sai (đã mở ảnh): bài 24, 25a (dòng biến đổi), 46 (dấu trong đề), **64** (đề $x+11$, lời giải của sách giải $x+1$ — kho giữ đề, đáp số $S={6}$), **73** (đề 451 giây không có đáp số; lời giải và kết quả 950 m của sách ứng với 551 giây — kho ghi 551 giây, `cho_quyet`, chưa duyệt). Sách bỏ dở, kho soạn tiếp: 23b, 25a, 25b, 33, 35, 48, 49a, 49b. Ranh giới thêm vào brief §4: phương trình chứa ẩn ở mẫu ⇒ `020101` kể cả khi khử mẫu ra bậc cao; có tham số ⇒ `020103`.

Lô 3: lọc trùng không bỏ câu nào. Soát đối chiếu ảnh (Opus, p4–7 · p22–24 · p31–51) sửa 4 câu: bài 5 chương I trạm chép tách 3 ý và tự đặt lại lời đề ⇒ gộp về một câu đúng như sách · bài 11b lời giải dẫn "theo câu a)" trong khi 11a là câu riêng ⇒ viết lại tự đủ · bài 69 đề in $yge0$ làm số chia bằng $0$ ⇒ ghi $y>0$ · bài 7b sách ghi "tương tự a)" bị ghi nhầm là "không có lời giải". Sách in sai (đã mở ảnh): chương II bài 10a, 13, 14, 32b, 34, 51b, 51c. Sách bỏ dở, kho soạn tiếp: chương I 62b, 62c; chương II 17, 22, 40b, 41c, 48, 50, 51a.
**Hai ranh giới xếp nhóm đặt ở lô 3** (ghi vào brief §4): (1) chương phân thức — bài làm việc với MỘT phân thức cho trước (rút gọn, điều kiện xác định, tìm $x$ để bằng $0$ / nguyên / âm dương, GTNN của kết quả) ⇒ `T18T010501`, theo đúng tên nhóm CEO đã duyệt "…và các câu hỏi kèm theo"; (2) **CHỜ CEO xác nhận** — bài tầng "nâng cao" của §1, §6 (nhân đa thức, chia đơn thức) mà bản đồ không có nhóm chuyên biệt ⇒ nhóm "Kiến thức cơ bản › Nhân, chia đa thức" (11 câu, đã tự duyệt; CEO không đồng ý thì chuyển nhóm, mã câu không đổi).

Lọc trùng lô 2: bỏ 1 câu trước khi ghi (bài 17d = 17b đổi thứ tự hạng tử). Sách in sai máy bắt được: 55d, 82c, 84b (đều đã mở ảnh xác nhận; lời giải kho ghi kết quả đúng).

**Còn lại của NDT (≈ 360 bài):** Đại IV bất đẳng thức – bất phương trình (52) · ôn tập cuối năm Đại (20) · phụ lục A (45) + C (60) · **Hình I–III + phụ lục B (≈ 220 bài, nhánh Hình)**. Hình IV (không gian, 30 bài): không nhập.
Sau NDT: TVA → TCDS → VHB1, VHB2 → TCHH.

**Câu treo — cần CEO / người** (trang xem cụ thể, có ảnh sách gốc: `kho-rules/dai/k8T-can-xem.html`, dựng lại bằng `node kho-rules/dai/lo/k8T/can-xem.mjs` — **mỗi lần báo lô phải kèm trang này**, Thùy 10/10: *"Mấy câu sai cần review thì m phải cho t view cụ thể chứ"*):

| Câu | Vì sao | Cần gì |
|---|---|---|
| NDT ôn tập chương I bài 89b — **đã nhập 10/10** với kết quả đúng 14376190 (Thùy: *"Nhập kết quả đúng nhé"*), đang ở dạng chờ `T18T000000` | Hai lượt gán đều không thấy nhóm khớp (tính tích giá trị đa thức theo các nghiệm) | Học thuật chọn nhóm — tôi nghiêng về 1.3 ① *Tìm dư: Bê-du* (cùng ý "giá trị đa thức tại một điểm") |
| Lô 3 — 3 câu hai lượt gán nhóm lệch nhau, đang ở dạng chờ: chương I 11b (`040302` ↔ `040301`) · 13a (`010101` ↔ `010601`) · chương II 34 (`010301` ↔ `030101`) | Trạm soạn và lượt gán độc lập chọn khác nhau | CEO chọn nhóm (trang xem, mục "Cần chị quyết") — tôi nghiêng: 11b → `040302` · 13a → `010601` · 34 → `030101` |
| Lô 4 — bài 73 chương III (`T18T020201004`, chưa duyệt): đề sách in 451 giây không có đáp số | Kết quả 950 m của sách ứng với 551 giây; kho tạm ghi 551 giây | CEO chọn: giữ bản 551 giây (rồi duyệt) hay bỏ câu |
| Lô 3 — luật "bài nâng cao của bài học cơ bản ⇒ nhóm Kiến thức cơ bản" (11 câu) | Tôi tự đặt vì bản đồ không có nhóm chuyên biệt | CEO xác nhận hoặc bác (trang xem, mục "đã làm, chị xem") |
| 41 nhóm mới: mức độ + bậc tối thiểu đang tạm (nâng cao 4 / A · cơ bản 2 / A) | Hai cột bắt buộc, chưa có giá trị thật | CEO chỉnh ở màn Bản đồ |

**Đã chốt 10/10 (Thùy xem trang, trả lời từng thẻ — áp bằng `kho-rules/dai/lo/k8T/ap-chot-2026-10-10.mjs`):** xoá mềm 2 câu trùng (50a, 53a: *"Bỏ câu a"*) · 6 chỗ sách in sai / đề thiếu: đồng ý cách đã sửa · ba câu họ $a^{100}+b^{100}=\dots$ và cặp 84b – 57b: **giữ cả** · 7 câu dạng chờ đã có nhóm (36 → 3.1 ① · 55a → 1.2 ③ · 26b → 1.5 ② · 26d → 4.1 ② · 80a, 80b → 1.3 ① · 86 → 1.5 ②). Dạng chờ `T18T000000` hiện 1 câu (bài 89b).

**Việc kỹ thuật còn lại (Claude tự làm):** nhánh Hình: brief chép–soạn Hình + vẽ hình bằng code + `nhap_hh_tu_draft.mjs` vào bài của bản đồ Hình · lý thuyết cho 18 bài Hình 8T · `k8T-kiem.mjs`: thêm vét cạn cho bài nghiệm nguyên / tìm $n$ để chia hết, `\sqrt` cho đáp án có căn · bảng `--co-ban` cho Đại III–IV và các quyển sau.

## 9. Câu hỏi CEO còn mở

| # | Câu hỏi | Mặc định đang dùng |
|---|---|---|
| Q1 | Thuật ngữ: phiên âm ("Đi-rích-lê", "Cô-si") hay tên gốc ("Dirichlet", "Cauchy")? | §3: Thalès, Pythagore; còn lại phiên âm (tên nhóm trên bản đồ đã ghi theo cách này) |
| Q2 | Có **bản đủ trang** của VHB tập 1 (thiếu đề Đại 142–159, Hình 41–46, ví dụ 43–46) và TVA (thiếu trang sách 32–33) không? | Bỏ các bài mất đề |
| Q3 | 50 câu Đại + 48 câu Hình 8T **đã duyệt** nhưng lời giải chưa có 2 phần: viết lại theo khuôn mới, hay để nguyên? | Để nguyên |
| Q4 | Nhóm của chuyên đề **Kiến thức cơ bản** tôi chia theo bài học (chủ đề 1: Nhân, chia đa thức · Hằng đẳng thức · Phân tích nhân tử · Phân thức; chủ đề 2: Phương trình · Lập phương trình · Bất phương trình) — CEO muốn gộp / đổi tên thì nói | Như vừa nêu |

## 10. NHẬT KÝ SỬA (append-only — CEO sửa gì ghi đó, rồi nâng thành luật ở trên)

| Ngày | Câu | CEO sửa gì | Luật rút ra |
|---|---|---|---|
| 10/10 | — | *(ghi việc làm)* Thùy: *"Context này xây kho và bản đồ của khối 8T. Đọc spec khối 4 để hiểu thêm rồi làm spec cho khối 8. Đọc 1 lượt các tài liệu ở đây."* Đọc `k4T.md`, README, `k8.md`, `spec-ban-do-4-tang.md` §0; dựng ảnh 1.761 trang của 7 quyển; 7 agent Sonnet đọc mỗi quyển một lượt, viết hồ sơ `lo/k8T/ho-so/`; tôi đối chiếu ảnh gốc 10 trang (khớp) + xác nhận VHB1 thiếu bài 142–159; đo DB 8T | v0. Đề xuất: 3 tầng kiến thức + khai công cụ theo câu · trạm chép đề hai lượt · mã nguồn có trang PDF |
| 10/10 | v0 §9 Q1 (chương trình) | *"8T học nâng cao là chính — không cần quan tâm khối 8."* | Bỏ ràng buộc "lớp 8 hiện hành" và luật thứ tự bài; các khối chương trình cũ (bất phương trình, giá trị tuyệt đối, diện tích, quỹ tích…) nhập như mọi chuyên đề khác. Bỏ mục v0 §1.4 |
| 10/10 | v0 §9 Q2 (công cụ) | *"8T được dùng full công cụ cao cấp — thể hiện rõ trong các cuốn sách rồi."* | §1 viết lại: chuẩn kiến thức = 6 quyển sách; sách dùng gì kho dùng nấy, gọi tên + đủ điều kiện; đi theo hướng giải của sách; chỉ cấm thứ sách không có. Bỏ "3 tầng". `cong_cu` giữ lại cho việc xếp nhóm |
| 10/10 | v0 §9 Q3 (phạm vi) | *"Chỉ nhập các cuốn có lời giải chi tiết thôi."* | Bỏ quyển TUHOC. Ở mức bài: có lời giải / có đáp số ⇒ nhập; không có gì ⇒ không nhập (§5.1 — cách hiểu của Claude). Trạm soạn được đọc lời giải sách (§4) |
| 10/10 | Bản đồ | *"8T không cần phân chia quá kĩ như 8 thường. M đề xuất phân chia 3 tầng trên đi xem nào."* | §6.2: đề xuất 5 chủ đề · 14 chuyên đề · 37 nhóm bài (Đại – Số học – Tổ hợp) + 6 chuyên đề · 18 bài (Hình); nguyên tắc mỗi chuyên đề 2–4 nhóm, phương pháp cụ thể không thành nhóm. **Chờ CEO duyệt** |
| 10/10 | Bản đồ §6.2 | *"OK Chia như thế đi. Xong add các bài vào kho đi."* + trả lời 5 chỗ hỏi: (1) OK · (2) *"Cái đấy là biến đổi thôi, lúc đấy cũng chưa nghĩ kĩ lắm"* · (3) *"2 nhóm thôi"* · (4) OK · (5) OK | Bản đồ lên DB (mig `202610101403`): 34 nhóm bài mới + dạng chờ trên `dai_ban_do`, vỏ + đối ứng trên `dai_bdm_*`, 12 bài Hình mới. **Không đi vòng lô thử → v1**: nhập thẳng, câu vào thẳng nhóm bài, `da_duyet=false`, CEO duyệt trên màn Duyệt |
| 10/10 | Nhịp viết lời giải | *"Bài nào tắt quá thì cần giải chi tiết hơn. Đáp án cho học sinh nâng cao ko cần trình bày quá chi li như thường, được sử dụng nhiều công cụ hơn và nhịp độ làm bài nhanh hơn. Nhưng t vẫn muốn có giải hẳn hoi."* | §2 + brief §3: sách tắt ⇒ viết đủ; Phần 2 nhịp nhanh (gộp bước hiển nhiên, không chép quy tắc cơ bản); mốc = học sinh giỏi không phải tự nháp thêm. Bài chỉ có đáp số vẫn nhập, lời giải kho viết đủ |
| 10/10 | Lô 1 (72 câu NDT Đại I §3–5) | *(ghi việc làm — CEO chưa xem)* Chép–soạn bằng 3 agent Sonnet, tôi soát đối chiếu ảnh 11 trang, agent khác gán nhóm mù, ghi kho qua cổng | §7 viết lại theo dây chuyền đã chạy: "kiểm chép" bằng máy (kết quả sách ↔ đề) thay cho chép hai lượt; phiên chính không tự gán mù; luật ranh giới "phương trình bậc ≥ 3 ⇒ bậc cao". **Sai của tôi:** chạy `npm run migrate` khi sổ còn 15 file treo của phiên khác — file đầu lỗi quyền nên chưa áp gì, nhưng suýt áp hộ; từ nay luôn `--status` đọc HẾT rồi `--only <file>` |
| 10/10 | Sau lô 1 | (1) bài 35b: *"ok thêm số dương vào"* · (2) *"Có. chỉ là ko chung với khối 8 thường. Bài tập cơ bản cho vào 1 chuyên đề — gọi là kiến thức cơ bản đi"* · (3) 3 câu dạng chờ: *"OK tý t duyệt"* · (4) 12 câu chứng minh cũ: *"Đổi đi"* · *"T nghĩ phải làm lọc trùng đấy."* | (1) nhập ý b với đề đã sửa (khối riêng `NDT-D1-bs.cs.md`, ghi rõ đề khác sách). (2) mig `202610101427`: chuyên đề dùng chung "Kiến thức cơ bản" 7 nhóm; câu tầng cơ bản xếp theo bài học bằng luật máy (`--co-ban`); chuyển 34 câu lô 1. (4) chuyển 12 câu sang nhóm Chứng minh (mã câu giữ nguyên, `kho_doi_dang_log` ghi vết). Lọc trùng: `loc-trung.mjs` 3 mức (§7), gắn vào trạm dựng lô; quét kho ra 2 bản trùng đã lỡ ghi (chờ gật xoá) + 2 nhóm nghi |
| 10/10 | Lô 2 (71 câu) | *(ghi việc làm — CEO chưa xem)* | Bộ lọc trùng bản đầu coi "bằng nhau về giá trị" là trùng ⇒ bỏ nhầm bài 84b (hai đề khác nhau, cùng đa thức với 57b) — bắt được khi đọc báo cáo trước lúc ghi ⇒ hạ xuống mức NGHI; mức bỏ chỉ còn: cùng tập hạng tử, hoặc cùng bài của cùng sách |
| 10/10 | Trang "câu cần chị xem" | *"Cái kia là biến đổi chứ. hay đề bài thế ?"* · *"Mấy câu sai cần review thì m phải cho t view cụ thể chứ"* | Báo câu treo bằng danh sách chữ là **không đủ**: mỗi lần báo lô kèm trang `k8T-can-xem.html` (ảnh cắt từ sách gốc + đề / đáp án / lời giải trong kho + việc cần quyết), dựng bằng `lo/k8T/can-xem.mjs` |
| 10/10 | 18 thẻ của trang xem | 1–2: *"Bỏ câu a"* · 3: *"Cho thêm điều kiện"* · 4–6: *"Sửa nhé"* · 7–8: OK · 9–11: *"Của đề riêng cứ để riêng thôi. Coi như là biến thể. Giữ nhé"*, *"Form ban đầu khác nhau mà"*, *"Giữ cả. giống hệt nhau mới bỏ. chứ còn form đề khác nhau cứ giữ"* · 12: *"cái sau. Ưu tiên các dạng ở đây là dùng biến đổi và phân tích thành nhân tử, chưa có công cụ lớn đâu"* · 13: *"Nhẩm nghiệm. bậc 3 hầu như là nhẩm nghiệm"* · 14–17: lượt gán thứ hai · 18: lượt thứ nhất | Xoá mềm 2 câu, xếp nhóm 7 câu (`ap-chot-2026-10-10.mjs`). **Luật trùng:** giống hệt (hoặc sách in sẵn dạng đã tách của cùng bài) mới bỏ; đề khác form, đề thi khác nhau khác số = biến thể, giữ. **Luật xếp nhóm** (ghi vào brief §4): chương đa thức – nhân tử ưu tiên nhóm "biến đổi", chưa dùng nhóm "công cụ lớn"; đa thức bậc ba ⇒ nhóm nhẩm nghiệm. Thẻ 9 (bài 89b) tôi không chắc câu trả lời nào là của nó ⇒ hỏi lại, chưa nhập |
| 10/10 | Duyệt | *"bài của 8T, m auto duyệt đưa vào kho luôn nhé"* | `tu-duyet.mjs` (trạm 6): câu qua cổng ⇒ `da_duyet=true`, `duyet_nguon='ai'`; trừ câu dạng chờ / cờ nghi / đang chờ CEO quyết. Áp ngay cho lô 1–2: tự duyệt 141 câu (84 máy đã xác nhận đáp án, 57 chỉ có Opus soát). Quyết định riêng 8T — khác `spec-luong-kho.md` C9, CEO biết và chọn |
| 10/10 | Lô 3 | *"tiếp đi"* | Nhập NĐT Đại I §1, §6 và trọn chương II phân thức: 105 câu qua cổng, tự duyệt 102, 3 câu vào dạng chờ vì hai lượt gán nhóm lệch nhau. Đặt hai ranh giới xếp nhóm (brief §4), một cái chờ CEO xác nhận. Trang xem thêm mục "Cần chị quyết" và "Lô 3 — đã làm, chị xem" |
| 10/10 | Lô 4 | (tiếp theo *"tiếp đi"*) | Nhập trọn chương III phương trình của NĐT: 93 câu qua cổng, tự duyệt 92; bài 73 (đề in sai số liệu) để chờ CEO. 45/45 câu ngoài tầng cơ bản hai lượt gán nhóm khớp |
