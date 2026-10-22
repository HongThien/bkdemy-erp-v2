# HỒ SƠ NGUỒN — PNL (Toán 12 – PNL 2026), Chương 2 "Vectơ và hệ toạ độ trong không gian", Bài 1 + Bài 2 + Bài 3

Nguồn đọc: 9 tệp `PNL__*` (bản GV) trong `…/scratchpad/vt/txt/`, gồm 6 tệp "Dạng" (mỗi Bài 2 tệp) + 3 tệp "Đề". Không có tệp trùng nội dung với nhau (đã kiểm), nhưng **nhiều câu bị lặp giữa các tệp** (xem §1.3).
Số liệu "đếm" = đếm bằng script trên các tiêu đề `Câu N` (theo từng PHẦN) và `Bài tập N`; phân loại kiểu là **mình đọc đề từng câu rồi tự gom** (không phải nhãn của tác giả). Hình không đọc được — ghi "(có hình)".
Viết tắt: **P1** = Phần I (trắc nghiệm 4 phương án, đáp án đúng gạch chân `[[u]]`), **P2** = Phần II (đúng–sai, mỗi câu 4 ý a–d), **P3** = Phần III (trả lời ngắn), **TL** = "Bài tập tự luận" (có lời giải). Trích dẫn: `B1D1` = Bài 01_Dạng 01; `B3D2` = Bài 03_Dạng 02; `Đ01/Đ02/Đ03` = Đề 01/02/03. Ví dụ `B1D1·P1·C8` = Phần I, Câu 8 của B1D1. Mức khó (NB/TH/VD/VDC) là **ƯỚC LƯỢNG của mình** — tác giả không gắn nhãn mức độ ở đâu cả.

**Cảnh báo chất lượng nguồn (đọc trước):**
- Công thức MathType lỗi bị cắt (`EQ-FAILED`) → vài chỗ mất ký hiệu; một số câu sót chữ (xem §4.3).
- **B2D2 nhắc "như hình bên/hình vẽ" 11 lần mà trong bản chữ có 0 ảnh** → 17 câu TN + 2 TL của B2D2 đều thiếu hình gốc (hệ trục đặt ở đâu chỉ biết qua lời dẫn "gốc O trùng A…" khi có, còn lại phải xem lại sách).
- Mất hẳn hình ở các đề thực tế (sân cầu lông, máy bay, ngôi nhà, cáp xe…); ghi "(có hình)" khi đề gọi hình.
- Dấu thập phân trong nguồn là dấu phẩy (`3,5 m`, `9,8 m/s²`); bản mình trích bên dưới có thể làm rớt dấu — số liệu đề mẫu chỉ nhằm nhận dạng kiểu, **không dùng để nhập lại**.

---

## 1. Vai trò từng tệp + số liệu ĐẾM

### 1.1 Bảng đếm (mỗi tệp)

| Tệp | Vai trò | TL (tiêu đề / ≈ý) | P1 | P2 | P3 | TN tổng |
|---|---|---|---|---|---|---|
| **B1D1** Bài 01·Dạng 01 "Lý thuyết và xác định, chứng minh đẳng thức, độ dài vectơ" | Mở Bài 1: **Lý thuyết A (4 mục)** + "Dạng 1" | 8 / ≈20 | 24 | 12 | 10 | **46** |
| **B1D2** Bài 01·Dạng 02 "Xác định góc và tính tích vô hướng của hai vectơ" | "Dạng 2" của Bài 1, **không có lý thuyết** | 6 / ≈12 | 24 | 4 | 6 | **34** |
| **B2D1** Bài 02·Dạng 01 "Lý thuyết và toạ độ điểm, toạ độ vectơ trong không gian" | Mở Bài 2: **Lý thuyết A (3 mục)** + "Dạng 1" | 6 / ≈7 | 30 | 7 | 8 | **45** |
| **B2D2** Bài 02·Dạng 02 "Toạ độ hoá một số hình học không gian" | "Dạng 2" Bài 2, không lý thuyết, có 3 gạch phương pháp | 2 / 2 | 6 | 3 | 8 | **17** |
| **B3D1** Bài 03·Dạng 01 "Lý thuyết và toạ độ của các phép toán vectơ" | Mở Bài 3: **Lý thuyết A (4 mục)** + "Dạng 1" | 6 / ≈12 | 30 | 6 | 9 | **45** |
| **B3D2** Bài 03·Dạng 02 "Tích vô hướng, tích có hướng của hai vectơ và ứng dụng" | "Dạng 2" Bài 3, không lý thuyết | 5 / ≈9 | 30 | 6 | 8 | **44** |
| **Đ01** "Bài 01 – Vectơ trong không gian – Đề số 01" | Đề kiểm tra 90 phút (12 TN + 4 Đ-S + 6 TLN) | 0 | 12 | 4 | 6 | **22** |
| **Đ02** "Bài 02 – Hệ trục toạ độ trong không gian – Đề số 02" | như trên | 0 | 12 | 4 | 6 | **22** |
| **Đ03** "Bài 03 – Biểu thức toạ độ của các phép toán vectơ – Đề số 03" | như trên | 0 | 12 | 4 | 6 | **22** |
| **Tổng** | | **33 / ≈62** | **180** | **50** | **67** | **297** |

(Đã đối chiếu: 46+34+45+17+45+44 = 231 câu TN ở 6 tệp Dạng + 66 câu ở 3 Đề = 297; cộng 33 tiêu đề TL = **330 mục**. P2 = 50 câu = 200 ý a–d.)

**Số "Dạng" của tác giả = 6** (2 mỗi Bài; mỗi tệp chỉ có **1** mục "Dạng N" nội bộ, không chia dạng con). **Số "Ví dụ" = 0** — PNL không có thẻ "Ví dụ"; chỗ tương đương là **33 "Bài tập tự luận" có lời giải** + toàn bộ câu TN đều có lời giải. Số câu tự luận (đếm theo tiêu đề): 8+6+6+2+6+5 = 33 (có 2 chỗ **trùng nhãn số**: `B1D1` có hai "Bài tập 6", `B1D2` có hai "Bài tập 5").

Theo Bài: Bài 1 = 102 TN + 14 TL = 116 mục; Bài 2 = 84 TN + 8 TL = 92 mục; Bài 3 = 111 TN + 11 TL = 122 mục.

### 1.2 Mức độ / thang điểm
- Không có nhãn NB/TH/VD/VDC. Khuôn đề 2025: P1 (4 chọn 1) → P2 (4 ý Đ/S) → P3 (đáp số). Thứ tự P1 trong mỗi tệp **đi từ dễ lên khó** rõ rệt (xem §3: vd `B2D1` P1 C1–C13 là hình chiếu/cộng trừ thuần, C25–C30 là hệ thức–đồng phẳng–thẳng hàng–hình thang).
- Đề 90 phút nhưng 22 câu (không có cột điểm/mức trong nguồn).

### 1.3 Câu LẶP (đếm bằng script so chuỗi + so dãy số, rồi đọc lại bằng tay)
**A. Bản sao nguyên số liệu (có thể bỏ khi lập kho) — 14 cặp:**
1. `B2D1·P1·C18` = `C19` (y hệt, kể cả đáp án).
2. `B3D2·P1·C3` = `C11` (tích có hướng u=(1;2;3), v=(0;−1;1)).
3. `B3D2·P1·C8` = `C10` (a·b với (−1;3;2),(−3;−1;2) → 4).
4. `B3D2·TL·BT3` = `B3D2·P1·C5` (vectơ p cùng hướng [m,n], |p|=15).
5. `B3D1·P3·C7` = `B3D2·P1·C29` (hình thang A(1;2;1),B(2;0;−1),C(6;1;0), S=6√2).
6. `B3D1·P1·C17` = `B3D1·P3·C5` (M∈AB, MA=2MB, A(1;2;3), B(−2;−4;9)).
7. `B1D1·P1·C21` = `B1D2·P2·C4` (đèn chùm 5 kg, bốn đoạn xích, ASC=60°).
8. `B1D1·P2·C12` = `B1D2·P3·C6` (ô tô trong khung sắt hình hộp, cần cẩu).
9. `B2D1·P2·C2` = `B3D2·P2·C1` (a=(−1;1;0), b=(1;1;0), c=(1;1;1)).
10. `B3D1·P2·C3` ≈ `Đ03·P2·C1` (cùng A(1;−2;3),B(−2;1;2),C(3;−1;2); Đ03 đổi ý d thành chân đường cao).
11. `B1D1·P1·C8` = `Đ01·P1·C8` (lăng trụ, M trung điểm BB′, CA=a, CB=b, AA′=c).
12. `B1D1·P2·C8` (đầu bài AM=3MD, BN=3NC) = `Đ01·P3·C1` (hỏi lại thành phân tích MN theo PQ, DC).
13. `B2D2·TL·BT2` = `Đ02·P3·C3` (máy bay, OM=14, NOB=32°, MOC=65°).
14. `B1D2·P3·C2` / `C4` (cùng 1 kịch bản cầu trượt, hai câu hỏi nối tiếp) — tính là 1 cặp.

**B. Cùng kịch bản, ĐỔI SỐ hoặc đổi câu hỏi (≈14 câu):** radar máy bay A(800;500;7)→B(940;550;·) trong 10 phút: `B2D1·P3·C5` · `Đ02·P3·C4` · `Đ03·P3·C5`; máy bay OM + hai góc: thêm `B2D2·P1·C6` (OM=50, 64°, 48°); đèn tròn 3 dây: `B1D1·P1·C20` · `Đ03·P3·C6`; đèn chùm: thêm `Đ01·P3·C5` (cân đòn tay, ASC=90°); hai khí cầu/máy bay không người lái xuất phát cùng chỗ: `B3D1·P2·C6` · `B3D2·P3·C6/C7/C8` · `Đ02·P3·C5` (5 câu); "hình thang ABCD có đáy AD/AB–CD, S=kS_ABC hoặc cho S": `B3D1·P1·C27,C29`, `B3D1·P3·C6,C7,C9`, `B3D2·P1·C29` (6 câu, một khuôn).

→ **Khoảng 297 câu TN nhưng số câu "đề khác nhau thật" nhỏ hơn ≈5–10%** (về lượng); số *kiểu* thì ít hơn nhiều (xem §6).

---

## 2. Cấu trúc nguyên văn của tác giả (theo thứ tự)

**CHƯƠNG 2 — VECTƠ VÀ HỆ TOẠ ĐỘ TRONG KHÔNG GIAN** (nguồn ghi "CHƯƠNG 2"). Mỗi Bài: A. **LÝ THUYẾT CẦN NHỚ** (chỉ nằm trong tệp "Dạng 01") → B. **PHÂN LOẠI VÀ PHƯƠNG PHÁP GIẢI TOÁN** (chứa "Dạng N") → *Bài tập tự luận* → *Bài tập trắc nghiệm* P1/P2/P3 → cuối Bài có "Đề 0x".

**Bài 01. VECTƠ TRONG KHÔNG GIAN**
- A. Lý thuyết (4 mục): 1) Vectơ trong KG (định nghĩa, giá, cùng phương, bằng nhau, vectơ-không) · 2) Tổng và hiệu (quy tắc ba điểm, hình bình hành, **quy tắc hình hộp** AB+AD+AA′=AC′, tính chất giao hoán/kết hợp, vectơ đối, OB−OA=AB) · 3) Tích số với vectơ (định nghĩa, điều kiện cùng phương, **hệ thức trung điểm / trọng tâm** IA+IB=0, GA+GB+GC=0, AI=½AB, GA=−⅔AK…, tính chất, **ba điểm thẳng hàng ⇔ AB=kAC**) · 4) Tích vô hướng (góc giữa hai vectơ 0°–180°, định nghĩa u·v=|u||v|cos, u²=|u|², cos(u,v)=u·v/(|u||v|), u⊥v⇔u·v=0, giao hoán/phân phối/kết hợp với số).
- B. **Dạng 1: Xác định vectơ, chứng minh đẳng thức vectơ, độ dài vectơ** (`B1D1`) — không có gạch phương pháp, vào thẳng bài tập.
- **Dạng 2: Xác định góc và tính tích vô hướng của hai vectơ** (`B1D2`) — nhãn "Dạng 2: …", không lý thuyết, không phương pháp.
- Đề 01 (22 câu).

**Bài 02. TOẠ ĐỘ CỦA VECTƠ TRONG KHÔNG GIAN**
- A. Lý thuyết (3 mục): 1) Hệ trục toạ độ Oxyz (3 trục đôi một vuông góc, i,j,k, i²=j²=k²=1, i·j=…=0, mặt phẳng toạ độ) · 2) Toạ độ của điểm (chiếu M xuống Oxy rồi xuống Oz; bộ (a;b;c)) · 3) Toạ độ của vectơ (u=ai+bj+ck; toạ độ M cũng là toạ độ OM; i=(1;0;0)…).
- B. **Dạng 1: Toạ độ điểm, toạ độ vectơ** (`B2D1`) — có 5 gạch kết quả cần nhớ (xem §3).
- **Dạng 2: Toạ độ hoá một số hình học không gian** (`B2D2`) — 3 gạch phương pháp.
- Đề 02 (22 câu).

**Bài 03. BIỂU THỨC TOẠ ĐỘ CỦA CÁC PHÉP TOÁN VECTƠ**
- A. Lý thuyết (4 mục): 1) cộng, trừ, nhân số (a±b, ka) · 2) tích vô hướng toạ độ (a·b=xx′+yy′+zz′; cùng phương ⇔ ∃k; vuông góc; |a|=√(x²+y²+z²); cos(a,b); AB=√(…)) · 3) **tích có hướng** [a,b] (công thức bằng định thức 2×2, vuông góc với cả a và b; a,b không cùng phương ⇔ [a,b]≠0) · 4) toạ độ **trung điểm, trọng tâm tam giác**.
- B. **Dạng 1: Toạ độ của các phép toán vectơ, toạ độ điểm, độ dài đoạn thẳng** (`B3D1`).
- **Dạng 2: Tích vô hướng, tích có hướng của hai vectơ và ứng dụng** (`B3D2`).
- Đề 03 (22 câu).

**Lỗ hổng lý thuyết ↔ bài tập (rất quan trọng cho người thiết kế):**
- **"Đồng phẳng" KHÔNG có trong lý thuyết Bài 1** (không định nghĩa, không điều kiện c=ma+nb) nhưng bài tập đòi hỏi: `B1D1·P1·C16–C19`, `P2·C7,C8`, `P3·C3,C9,C10`; ở Bài 3: `B3D2·P1·C6,C7,C27`. Lời giải tự dùng "∃x,y: AP=xAM+yAN" / "[a,b]·c=0".
- **Tâm tỉ cự / điều kiện min của Σ MA²** không có trong lý thuyết nhưng có ở `B1D1·P3·C2,C5,C8`, `B3D1·P3·C8`, `Đ03·P1·C12`.
- **Ứng dụng tích có hướng** (diện tích tam giác ½|[AB,AC]|, thể tích hộp |[a,b]·c|, thể tích tứ diện, đường cao, thể tích chóp) — **lý thuyết Bài 3 chỉ có [a,b] chứ không nêu công thức ứng dụng**; công thức nằm trong lời giải `B3D2`.
- Công thức **hình học dùng cho toạ độ hoá** (tâm đường tròn ngoại tiếp, trực tâm, phân giác, mặt cầu) cũng chỉ xuất hiện trong lời giải.

---

## 3. Từng dạng: phương pháp tác giả + CÁC KIỂU ĐỀ (kiểu do mình gom)

Quy ước cột: **Kiểu** · **Số câu** (TN, theo vị trí) · **Đề mẫu ngắn** · **Mức** (ước lượng).

### 3.1 B1D1 — "Dạng 1: Xác định vectơ, chứng minh đẳng thức vectơ, độ dài vectơ" (46 TN + 8 TL)
**Phương pháp tác giả:** không gạch phương pháp. Lời giải dùng nhất quán: quy tắc ba điểm / hình bình hành / **quy tắc hình hộp**; hệ thức trung điểm, trọng tâm (tam giác, **tứ diện** GA+GB+GC+GD=0 ⇒ MA+MB+MC+MD=4MG); chọn 3 vectơ cơ sở (a,b,c) xuất phát từ một đỉnh để phân tích; đồng phẳng bằng hệ số x,y; tổng vectơ vuông góc ⇒ độ dài bằng Pitago.

| # | Kiểu | Số câu | Đề mẫu | Mức |
|---|---|---|---|---|
| a | **Phân tích vectơ theo cơ sở a,b,c** (tứ diện/lăng trụ/hộp; G trọng tâm, M trung điểm) | 9 (P1 C1,2,3,6,7,8,9,11,12) | "Tứ diện ABCD, AB=a, AC=b, AD=c, G trọng tâm BCD ⇒ AG=⅓(a+b+c)" | TH |
| b | **Đẳng thức vectơ đúng/sai** (quy tắc hình hộp/hbh/trọng tâm) | 10 (P1 C4,5,10 + P2 C1,2,3,4,5,6,11) | P2 C3: "hình hộp tâm O: AC′=AB+AD+AA′, AB+AA′=AD+DD′…" | NB–TH |
| c | **Xác định điểm** từ hệ thức vectơ | 3 (P1 C13,14,15) | "AN=AB+AC−AD ⇒ N là đỉnh hbh CDBN"; "tổng 8 vectơ MA…=0 ⇒ M là trung điểm nối hai tâm đáy" | TH |
| d | **Đồng phẳng** (điều kiện / suy luận trên a,b,c không đồng phẳng / trong tứ diện) | 6 (P1 C16–19; P2 C7,C8) | "a,b,c không đồng phẳng, x=2a+b, y=a−b−c, z=−3b−2c ⇒ x,y,z đồng phẳng" | TH–VD |
| e | **Độ dài vectơ tổng/hiệu** trong hộp/lập phương | 2 (P2 C9,C10) | "hộp chữ nhật AB=a, AD=a√3, AA′=2a: |AB+AD|, |AB+A′D′+CC′|" | TH |
| f | **Vật lí – lực/công thức vật lí** | 6 (P1 C20–24; P2 C12) | C20 đèn tròn treo 3 dây, F1⊥F2⊥F3, |F|=15 N ⇒ trọng lượng 15√3; C22 F=ma; C23 P=mg; C24 F=qE; P2 C12 ô tô cần cẩu | TH–VD |
| g | Tìm hệ số / tỉ số bằng phân tích + đồng phẳng / giao điểm | 4 (P3 C3,7,9,10) | "mặt phẳng (AMN) cắt SC tại P ⇒ SP/SC" ; "AI=aAA′+bAB+cAD" | VD |
| h | Vuông góc / song song tìm tham số | 2 (P3 C1,C6) | "AN⊥AM tìm k" ; "MN//BD′ tìm k+l" | VD |
| i | Tích vô hướng tính trực tiếp | 1 (P3 C4) | "SC·AB, tứ diện SA=SB=SC=AB=AC=2, BC=2√2" | VD |
| j | **Cực trị / tâm tỉ cự** | 3 (P3 C2,5,8) | "M thay đổi trên SO sao cho MS²+MA²+…+MD² min ⇒ SM/SO=4/5" ; C8: 1/SA₁²+… min (Cauchy–Schwarz) | VDC |
Tổng: 9+10+3+6+2+6+4+2+1+3 = 46 ✓.

**TL của B1D1 (8 tiêu đề):** BT1 khái niệm vectơ trên tứ diện đều (đếm, giá nằm trong mp, độ dài) · BT2 lăng trụ: vectơ bằng nhau, tìm M′ (MM′=AA′) · BT3 chóp đáy hbh: CM vectơ đối, SA+SB+SC+SD=4SO, SD−BN−CM=SC (3 ý) · BT4 lập phương: tổng, 4 đẳng thức CM, A′C=3A′G, độ dài u (6 ý) · BT5 ba lực đôi một vuông góc 2/3/4 N: hợp lực √29 · BT6 tứ diện AC,BD⊥AB: MN=½(AC+BD), MN·AB=0 · BT6′ khối Rubik tứ diện đều cao 8 cm: d(trọng tâm,mặt)=2 cm (tỉ cự AI=3IG) · BT7 ba dây cân bằng ⇒ cùng mặt phẳng.

### 3.2 B1D2 — "Dạng 2: Xác định góc và tính tích vô hướng của hai vectơ" (34 TN + 6 TL)
**Phương pháp (suy từ lời giải, không có gạch):** u·v=|u||v|cos(u,v); biểu diễn vectơ cần tính qua 3 cạnh xuất phát từ một đỉnh đã biết góc; AB·CD=AB·(AD−AC) rồi cộng tích vô hướng cạnh–cạnh; công A=F·d; hợp lực 3 lực dùng hình hộp hoặc ĐL côsin.

| # | Kiểu | Số câu | Đề mẫu | Mức |
|---|---|---|---|---|
| a | **Tích vô hướng đại số** (cho |a|,|b|, góc hoặc |a±b|; tìm góc / độ dài / cos / k để vuông góc) | 9 (P1 C1–C8; P2 C1) | C6: |a|=4,|b|=3,|a−b|=4 ⇒ cosα=… | NB–TH |
| b | **Góc giữa hai vectơ / hai đường thẳng trong hình** (tứ diện đều, chóp đáy vuông, lăng trụ, lập phương) | 14 (P1 C9–16,18,19,20,23,24; P3 C1) | C9: AB=AC=AD, BAC=BAD=60° ⇒ góc (AB,CD); C19: cos(MN,AC′) trong lập phương | TH–VD |
| c | **Tính tích vô hướng trong hình** | 3 (P1 C17,C22; P2 C2) | C22: lập phương ABCD.EFGH: AB·EG | TH |
| d | **Công thức diện tích = tích vô hướng** (S=½√(AB²AC²−(AB·AC)²)) | 1 (P1 C21) | chọn công thức đúng | TH |
| e | **Vật lí**: trọng lực, công, hợp lực | 7 (P2 C3,C4; P3 C2–C6) | P3 C4: công trọng lực em nhỏ trượt cầu trượt 3,5 m, nghiêng 30° | TH–VD |
Tổng: 9+14+3+1+7 = 34 ✓.
TL (6 tiêu đề): BT1 góc cặp vectơ trong lập phương · BT2 chóp tứ giác đều cạnh a: AS·BC, AS·AC · BT3 lăng trụ tứ giác đều (3 cặp) · BT4 lập phương cạnh 5: góc, tích vô hướng, AC′⊥BD · BT5 công của trọng lực xe 15 tấn xuống dốc 5° · BT5′ 3 lực (F1,F2 hợp 135°, F3⊥mặt) → cường độ hợp lực.

### 3.3 B2D1 — "Dạng 1: Toạ độ điểm, toạ độ vectơ" (45 TN + 6 TL)
**Phương pháp tác giả (gạch "cần chú ý"):**
- u = ai+bj+ck ⇒ u=(a;b;c); hai vectơ bằng nhau ⇔ từng toạ độ bằng nhau.
- OM=(a;b;c) ⇒ M(a;b;c); **AB=(x_B−x_A; y_B−y_A; z_B−z_A)**.
- **Chiếu M(a;b;c) lên mặt phẳng toạ độ hoặc trục thì thành phần bị khuyết bằng 0** (ví dụ M(1;2;3) chiếu lên Oxy ⇒ (1;2;0)).
- **Tứ giác ABCD là hình bình hành ⇔ AD=BC**.

| # | Kiểu | Số câu | Đề mẫu | Mức |
|---|---|---|---|---|
| a | **Hình chiếu lên trục/mp toạ độ** | 7 (P1 C1,2,3,5,8,9,12) | "hình chiếu của A(1;2;5) lên trục Ox" | NB |
| b | **Đối xứng** qua điểm / qua trục | 3 (P1 C14,21,24) | "A′ đối xứng A(2;1;1) qua B(−1;2;1)" ; "M(2;−1;−3) đối xứng qua Oy" | TH |
| c | Đọc toạ độ từ biểu diễn i,j,k | 4 (P1 C6,15,16; P2 C5) | "a=−i+2j−3k ⇒ toạ độ" ; P2 C5 thêm tham số m,n, b=0, a=b | NB |
| d | **Cộng/trừ/nhân số** các vectơ toạ độ | 6 (P1 C4,7,10,13,18,19) | "u=a−2b, a=(1;1;−2), b=(−2;1;4)" | NB |
| e | Toạ độ AB / AB=a ⇒ B | 2 (P1 C11,C23) | "AB=a(−3;2;1), A(4;6;−3) ⇒ B" | NB |
| f | **Hình bình hành / hình hộp** tìm đỉnh | 6 (P1 C17,20,22,28; P2 C3,C7) | "ABCD hbh, A,B,C cho ⇒ D" ; "hộp ABCD.A′B′C′D′, A,B,D,C′ ⇒ A′" | TH |
| g | **Hệ thức vectơ ⇒ điểm/điểm cố định** | 3 (P1 C25,26,29) | "IA+3IB=0, tính a+2b+2c" ; "MA+2MB−MC=0 ⇒ M" | TH–VD |
| h | **Đồng phẳng 4 điểm / thẳng hàng 3 điểm** với tham số | 2 (P1 C27,C30) | "O,A,B,C đồng phẳng tìm m" ; "A,B,C thẳng hàng tìm x+y" | VD |
| i | Câu Đ/S tổng hợp (cộng trừ, cùng phương, góc, độ dài, vuông góc, hộp, chóp toạ độ hoá) | 4 (P2 C1,2,4,6) | P2 C1: "a−2b, B để a=AB, cùng phương hướng, góc a,b=120°" | TH |
| j | **Thực tế** (radar, cáp, công, tốc độ) | 4 (P3 C5,6,7,8) | "radar thấy máy bay A→B trong 10′, 10′ nữa ở D, tính x+y+z" (có hình ở C6,C7) | TH |
| k | Tham số / chia đoạn | 4 (P3 C1–C4) | "|u|=|v| có bao nhiêu m" ; "M∈AB, MA=2MB ⇒ a+b+c" ; "tam giác MNP vuông tại N tìm m" | TH–VD |
Tổng: 7+3+4+6+2+6+3+2+4+4+4 = 45 ✓.
TL (6): BT1 chiếu A lên 3 mp toạ độ · BT2 hộp chữ nhật OABC.O′A′B′C′ (đặt trục, tìm A,B,B′) · BT3 hộp chữ nhật A làm gốc: AB,AC,AC′,AM · BT4 AB, D để ABCD hbh · BT5 CE=2EB tìm E · BT6 hộp ABCD.A′B′C′D′ tìm A′ từ A,B,D,C′.

### 3.4 B2D2 — "Dạng 2: Toạ độ hoá một số hình học không gian" (17 TN + 2 TL) — *thiếu hình trong bản chữ*
**Phương pháp tác giả (3 gạch):** (1) chọn điểm có **ba đường đôi một vuông góc** làm gốc toạ độ; (2) xây toạ độ các điểm trên hình theo hệ trục vừa chọn; (3) toạ độ các điểm đặc biệt (trung điểm, trọng tâm, tâm…).
| # | Kiểu | Số câu | Đề mẫu | Mức |
|---|---|---|---|---|
| A | Hộp chữ nhật/lập phương, gốc tại đỉnh | 3 (P1 C2,C3; P3 C5) + TL1 | "lập phương cạnh 2, O≡A ⇒ B′(2;0;2)" ; "MQ hoành độ, M,Q trung điểm cạnh" | NB–TH |
| B | Gốc tại **tâm đáy** (hình vuông/hình thoi/tam giác đều) | 3 (P1 C4; P2 C2; P3 C2) | "chóp tứ giác đều, cạnh đáy a√2, cạnh bên a√5, O tâm ⇒ SC" ; "lập phương gốc O tâm ABCD, đúng/sai A,AC′,D′,BD′" | TH |
| C | **Tứ diện/chóp có 3 cạnh vuông góc tại một đỉnh** (OABC, SA⊥đáy hình chữ nhật…) | 7 (P1 C5; P2 C1; P3 C1,3,4,6,8) | "S.ABCD, SA⊥đáy, AB=1, AD=2, SA=3, gốc A ⇒ D,C,S,I" ; "SC⊥(ABC), ABC vuông tại A, M,N chia SA,BC ⇒ tung độ NB" | TH–VD |
| D | **Lăng trụ đáy đều**, gốc ở trung điểm cạnh/chân đường cao | 2 (P2 C3; P3 C7) | "A′ chiếu lên (ABC) trùng trung điểm M của BC ⇒ tung độ A′B" | VD |
| E | **Toạ độ hoá bài thực tế** (có hình) | 2 (P1 C1,C6) + TL2 | "sân cầu lông: toạ độ B của trụ AB" ; "máy bay OM=50, ∠(i,OH)=64°, ∠(OH,OM)=48° ⇒ M" | TH |
Tổng: 3+3+7+2+2 = 17 ✓. TL: BT1 hộp chữ nhật AB=AA′=2, AD=4: toạ độ 8 đỉnh + E (tâm), F (trung điểm AC′) · BT2 máy bay OM=14, NOB=32°, MOC=65° ⇒ M.
Nhận xét kiểu P3: 8/8 câu hỏi dạng "khi a=1 hãy tính … của vectơ XY / thành phần toạ độ"; tức là **toạ độ hoá xong hỏi một thành phần của một vectơ** (đã giấu bước toạ độ hoá, chỉ lấy kết quả).

### 3.5 B3D1 — "Dạng 1: Toạ độ của các phép toán vectơ, toạ độ điểm, độ dài đoạn thẳng" (45 TN + 6 TL)
**Phương pháp:** không gạch riêng; dùng công thức Lý thuyết A (đặc biệt: cùng phương ⇔ toạ độ tỉ lệ / tồn tại k; **trung điểm; trọng tâm**).
| # | Kiểu | Số câu | Đề mẫu | Mức |
|---|---|---|---|---|
| a | Phép toán/độ dài vectơ toạ độ | 3 (P1 C1,12,13) | "u=3a+2b−c" | NB |
| b | **Trung điểm** đoạn thẳng | 3 (P1 C9,11,16) | "I trung điểm MN, M,N trung điểm AB,CD" | NB |
| c | **Trọng tâm** (tam giác/tứ diện, ngược từ G) | 4 (P1 C4,5,7,18) | "G tứ diện: GA+GB+GC+GD=0" ; "G(1;−2;3), A(a;0;0)… ⇒ a+b+c" | TH |
| d | Hình bình hành / hình chữ nhật tìm D | 3 (P1 C3,10,19) | "ABCM hbh ⇒ M, P=a²+b²−c²" | TH |
| e | Hệ thức vectơ ⇒ điểm (IA+kIB=0, MA=kMB) | 4 (P1 C6,8,14,17) | "M∈AB, MA=2MB ⇒ độ dài OM" | TH |
| f | **Thẳng hàng / cùng phương** (tham số) | 3 (P1 C2,22,23) | "A,B,M(x;y;1) thẳng hàng" ; "cặp vectơ nào cùng phương" | TH |
| g | **Điểm trên trục/mp toạ độ** (cách đều, giao với mp, chia tỉ số) | 5 (P1 C15,20,21,26,28) | "M∈Oz cách đều A,B" ; "AB cắt (Oxz) tại M, AM/BM=?" ; "AM=MN=NP=PB" | TH–VD |
| h | a=b tìm tham số | 1 (P1 C24) | "a=(−1;2x−1;1−3z)=b=(2+3y;−1;−2), T=x+2y²+3z³" | TH |
| i | Chân đường phân giác trong | 1 (P1 C25) | chân phân giác góc B | VD |
| j | **Hình thang** cho diện tích | 2 (P1 C27,C29) | "ABCD hình thang đáy AD, S_ABCD=3S_ABC" | VDC |
| k | Hình vuông + giao điểm | 1 (P1 C30) | "AM=BN=⅓BC, I=AN∩DM" | VDC |
Tổng P1: 3+3+4+3+4+3+5+1+1+2+1 = 30 ✓.
P2 (6): C1–C4 "tam giác/tứ giác ABC…" (trọng tâm, trung điểm, hbh D, thẳng hàng, vuông tại A, |GC|) · C5 hộp từ 4 điểm A,B,C,D′ (tâm M,N, độ dài) · C6 hai khí cầu hệ toạ độ (có hình).
P3 (9): C1 AB · C2 G tứ diện · C3 thẳng hàng x+y · C4 "MA·MA→=4MB·MB→" · C5 OM² · C6 "số điểm D để ABCD là hình thang đáy AB,CD và ∠D=45°" · C7 hình thang vuông tại A,B (S=6√2) · C8 **min Q=2|MA+MB+MC|+3|MB+MC|, M∈Ox** · C9 hình thang đáy AD, S=4S_ABC.
TL (6): BT1 u,v biểu diễn i,j,k, a=2u+⅓v · BT2 d=2a−⅕b+3c · BT3 c=2p−3q+r, cặp cùng phương · BT4 ba điểm không thẳng hàng, G, D hbh, E=BC∩(Oxz) · BT5 u=2AB+AC−5BC, 2NA=−NB · BT6 phòng học 8×6×3, treo đèn giữa trần (có hình).

### 3.6 B3D2 — "Dạng 2: Tích vô hướng, tích có hướng của hai vectơ và ứng dụng" (44 TN + 5 TL)
**Phương pháp (suy từ lời giải):** a·b=xx′+yy′+zz′; [a,b] theo định thức; đồng phẳng ⇔ [a,b]·c=0; bốn điểm đồng phẳng ⇔ [AB,AC]·AD=0; **S_ABC=½|[AB,AC]|; V hộp=|[AB,AD]·AA′|; V tứ diện=⅙|[AB,AC]·AD|**; hình thang ABCD đáy AB,CD: DC=kAB (k>0), S=S_ABC+S_ADC.
| # | Kiểu | Số câu | Đề mẫu | Mức |
|---|---|---|---|---|
| a | Tích vô hướng toạ độ | 4 (P1 C1,8,9,10) | "u·v với u=(−3;1;−1), v=(1;0;5)" | NB |
| b | Tích có hướng: công thức / tính | 3 (P1 C2,3,11) + C5 (p cùng hướng [m,n]) | "[u,v] với u=(1;2;3), v=(0;−1;1)" | NB–TH |
| c | **Góc** cos(a,b), cos(AB,BC) | 2 (P1 C4,C20) | "cos góc a=(−1;2;0), b=(0;−2;1)" | TH |
| d | Tích vô hướng **đại số** (|u|,|v|, góc cho trước; vuông góc tìm k; độ dài tổng) | 3 (P1 C19,21,25) | "|u|=2,|v|=1, góc 2π/3, kp⊥q" | TH |
| e | **Vuông góc tìm tham số** | 2 (P1 C14,24) | "a=(3;−2;m), b=(2;m;−1) vuông góc ⇒ m" | NB–TH |
| f | **Đồng phẳng / tứ diện** | 3 (P1 C6,7,27) | "a,b,c đồng phẳng tìm m" ; "A,B,C,D tạo tứ diện ⇔ m≠6" | TH |
| g | **Diện tích tam giác** | 3 (P1 C12,13,15) | "S tam giác ABC" ; "tam giác MNP là hình chiếu của A lên 3 trục" | TH |
| h | **Thể tích hình hộp** | 1 (P1 C30) | từ AB,AD,AC′ | VD |
| i | Độ dài vectơ, trung tuyến | 2 (P1 C16,C22) | "AM trung tuyến, AB=(−3;0;4), AC=(5;−2;4)" | NB–TH |
| j | Điểm trên trục thoả điều kiện | 3 (P1 C17,18,23) | "M∈Ox cách đều A,B" ; "C∈Oy sao cho ABC vuông tại A" | TH |
| k | Tâm đặc biệt (trực tâm, tâm ngoại tiếp) | 2 (P1 C26,28) | "trực tâm H" ; "tâm ngoại tiếp OAB, T=a²+b²+c²" | VD |
| l | Hình thang cho diện tích | 1 (P1 C29) | A(1;2;1),B(2;0;−1),C(6;1;0), S=6√2 | VDC |
Tổng P1: 4+4+2+3+2+3+3+1+2+3+2+1 = 30 ✓ (b gồm cả C5).
P2 (6): C1 a,b,c (độ dài, cos, vuông góc) · C2 u,v tham số m (độ dài, bằng nhau, vuông) · C3 tam giác ABC (vuông, chu vi, diện tích, **tâm ngoại tiếp**) · C4 tứ diện (cạnh đối bằng nhau, góc AB–CD, **khoảng cách AB–CD**, **bán kính mặt cầu ngoại tiếp**) · C5 ABC (diện tích, hbh, đường cao, thể tích chóp) · C6 **ngôi nhà (có hình): góc dốc mái = góc nhị diện** (lệch hẳn chương).
P3 (8): C1 a·(2a+b) · C2 |u+2v| · C3 M∈Oy, S_MBC=3 · C4 D∈Oy, V tứ diện=5 (tổng tung độ) · C5 "MA²+MC²=MB², tính MP" (mặt cầu) · C6, C7 hai khí cầu/máy bay không người lái cách xuất phát Bắc/Tây/Đông/Nam + độ cao · C8 ba máy bay thẳng hàng, máy bay thứ ba chính giữa.
TL (5): BT1 a+b+c, 2a−3b−5c, a·(−b), 2a·c · BT2 chóp SA⊥hcn toạ độ hoá, BD, SC, góc (BD,SC) · BT3 p cùng hướng [m,n], |p|=15 · BT4 **phân tử NH₃** hình chóp tam giác đều (khoảng cách H–H, N–H; góc liên kết 107°) · BT5 giàn khoan, ra-đa tầm 30 km phát hiện tàu (25;15;−10) hay không.

### 3.7 Ba Đề (cùng khuôn 12 + 4 + 6)
**Đ01 — Vectơ trong KG** (22): phân tích/biểu diễn 5 (P1 C1,8,10; P2 C3; P3 C1) · đẳng thức đúng/sai 5 (P1 C3,4,5,7; P2 C2) · độ dài vectơ 5 (P1 C2,6,9; P3 C3,C4) · góc/tích vô hướng 5 (P1 C11,12; P2 C1,C4; P3 C2) · vật lí 2 (P3 C5 cân đòn tay 4 xích ASC=90°; C6 lực cản không khí F1=kF2 tỉ lệ bình phương vận tốc 900→920 km/h). `Đ01·P3·C4` **hỏng ký tự** (xem §4.3).
**Đ02 — Hệ trục toạ độ** (22): P1: AB (C1), hbh D (C2), hộp C (C3), P đối xứng M qua N rồi KP (C4), OB (C5), đối xứng qua trục Oy (C6), tâm I hbh (C7), đối xứng qua (Oxz) (C8), hộp chữ nhật gốc A (C9), gốc B (C10), x=αa+βb+γc (C11), hộp B′ từ A,B,C,D′ (C12); P2: tam giác ABC (cân, hbh), lý thuyết i,OA,B, hình chiếu M, tổng hợp (OM, A, hình chiếu G, w); P3: **C1 chân đường cao H** (cần tích vô hướng, vượt Bài 2) · C2 căn lều gỗ (lăng trụ đứng, có hình) · C3 máy bay OM=14 · C4 radar · C5 khí cầu **tối ưu vị trí tiếp liệu** (min tổng khoảng cách) · C6 chậu cây bốn chân |F1+2F2+3F3+4F4|.
**Đ03 — Biểu thức toạ độ** (22): P1: phép toán/vô hướng (C1,2,3,6,10) · trung điểm, trọng tâm (C4,5) · đối xứng (C7,8) · hbh (C9) · góc (C11) · **min MA²+MB² trên (Oxy)** (C12); P2: A,B,C (AB=3AC?, thẳng hàng, **chân đường cao**) · trung điểm/độ dài/cosBAC/hình chiếu trọng tâm · OA=3i−k (thẳng hàng, đối xứng, **min ΣMA² trên (Oxy)**) · trung điểm/ΣOA/góc/**min |3IB−IC| trên (Oxz)**; P3: cùng phương · AM=3MB · vuông tại A · **GM ngắn nhất, M∈(Oxy)** · radar khoảng cách tới O · đèn tròn: F(L) và L tối thiểu khi lực tối đa 10 N (đổi inch↔cm).

---

## 4. Bẫy / chú ý / mẹo tác giả nhấn mạnh (chép ngắn)

### 4.1 Từ phần lý thuyết/gạch phương pháp
- B1 (lý thuyết): "vectơ đối của AB là BA — **dùng để làm mất dấu trừ trước vectơ**" (ghi chú: −AB=BA).
- B1: quy ước k·a=0 nếu k=0 hoặc a=0; k·a=0 ⇒ k=0 hoặc a=0; "hai vectơ cùng phương ⇔ ∃k: a=kb (b≠0)".
- B1: **"Ba điểm phân biệt A,B,C thẳng hàng ⇔ ∃k≠0: AB=kAC"** (đặt ở mục 4 Tích vô hướng cho tiện nhưng là hệ quả mục 3).
- B2D1: chiếu điểm lên mp/trục thì **thành phần bị khuyết = 0**; hbh ABCD ⇔ **AD=BC** (không phải AB=CD cùng chiều đọc).
- B2D2: gốc toạ độ phải là điểm có **ba đường đôi một vuông góc**.
- B3 (lý thuyết): **"a không cùng phương với b ⇔ [a,b]≠0"** (đặt sau định nghĩa tích có hướng).

### 4.2 Từ cách giải (lời giải nêu rõ)
- `B1D1·P3·C8`: dùng hệ thức trọng tâm tứ diện + Cauchy–Schwarz (16 ≤ 50·P ⇒ P ≥ 8/25) — **không kiểm tra điều kiện xảy ra dấu bằng** (người đọc nên chú ý thêm).
- `B1D1·P3·C1`: nhắc "các vectơ AB, AA′, AD đôi một vuông góc ⇒ tích vô hướng chéo bằng 0, AB²=AA′²=AD² (lập phương)".
- `B3D1·P3·C4`: "MA·MA→=4MB·MB→" ⇒ MA→ cùng hướng MB→ ⇒ **MA=2MB và B là trung điểm AM** (đừng chia 2 trường hợp M∈AB hay M∈ngoài).
- `B3D2·P1·C29` / `B3D1·P3·C7`: hình thang đáy AB,CD ⇒ **DC cùng hướng AB (k>0)** để loại nghiệm; diện tích = S_ABC + S_ADC.
- `B1D2` (cầu trượt): góc giữa trọng lực và độ dời = **60°** (= 90° − 30° dốc).

### 4.3 Lỗi biên soạn trong nguồn (cần cảnh giác khi nhập)
- `B1D2·P1·C5`: "|a|=|b|=1 và a·b=3" **mâu thuẫn** (|a·b| ≤ 1); lời giải vẫn tính ra √124.
- `B1D2·P3·C2/C4`: lời giải ghi **P=mg·cos60°=122,5 N** (sai: trọng lực P=mg=245 N; đối số cos60° chỉ dùng cho công); công tính ra 214,375 J **bị nhân cos60° hai lần** (đáp án đúng ≈428,75 J). → đáp án sách sai, không dùng nguyên.
- `B1D1·TL·BT3`: "hình lăng trụ S.ABCD" — phải là **hình chóp**.
- `B1D1·P1·C23`: đáp án không có gạch chân (đáp số đúng A≈1,029 N).
- `B1D1·P1·C17,C18,C19`: ba câu đồng phẳng liên tiếp nhưng khác kiểu (C16 = điều kiện lý thuyết; C17–C18 = suy luận x,y,z; C19 = mệnh đề sai).
- `Đ01·P3·C4`: đề **hỏng ký tự** ("hình lập phương B′C có đường chéo A′C=3/16 … điểm 20 thỏa mãn OS = ΣOA…") — không đọc được.
- `Đ03·P2·C1` d: đáp án "chân đường cao (−47/29; 13/29; 2)" — có thể dùng đối chiếu `B3D1·P2·C3`.
- `B2D1·P1·C30` có dòng lời giải chèn vào giữa các lựa chọn (không có tiêu đề "Lời giải").
- `B3D2·TL·BT4` sai chính tả "hdrogen"; BT4 và BT5 mượn **nguyên đề SGK** (NH₃ và "H.2.52 giàn khoan").
- Nhãn lặp: `B1D1·TL` hai "Bài tập 6"; `B1D2·TL` hai "Bài tập 5". Mỗi tệp Đề có **tiêu đề lặp hai lần** (người đọc bản chữ có thể tưởng nhầm hai đề).

---

## 5. Điểm CHỒNG và KHÁC

### 5.1 Chồng nhau (cùng một kiểu xuất hiện ở nhiều dạng/bài)
| Kiểu | Xuất hiện ở | Ghi chú |
|---|---|---|
| **Đồng phẳng** | B1D1 (6 câu, lý thuyết) · B3D2 (3 câu, bằng [a,b]·c=0) · B2D1 (P1 C27 O,A,B,C đồng phẳng) | 3 chỗ, 3 cách giải khác nhau (hệ số x,y / toạ độ / tích hỗn tạp) |
| **Phân tích vectơ → toạ độ** | B1D1 (a) ↔ B2D1 (c,d) | chung bản chất "biểu diễn theo cơ sở" |
| **Hình bình hành tìm đỉnh** | B2D1 (f, 6 câu) ↔ B3D1 (d, 3 câu) ↔ Đ02 P1 (C2,3,7,12) ↔ Đ03 P1 C9 | lặp ~14 lần xuyên bộ — thuần AD=BC |
| **Trung điểm/trọng tâm** | B1D1 (hệ thức) ↔ B3D1 (b,c, toạ độ) | một ở cấp vectơ, một ở cấp toạ độ |
| **Hệ thức vectơ → điểm** | B1D1 (c: xác định điểm) ↔ B2D1 (g) ↔ B3D1 (e) | bốn tầng độ khó: hình/tọa độ/chia tỉ số |
| **Thẳng hàng ⇔ AB=kAC** | B1 lý thuyết · B2D1 (h) · B3D1 (f) · Đ03 P3 C1 | |
| **Hình thang cho diện tích** | B3D1 (5 câu) ↔ B3D2 (1 câu) | một khuôn "DC=kAB, S=S_ABC+S_ADC" |
| **Min Σ MA² / |ΣMA|** | B1D1 P3 · B3D1 P3 C8 · Đ03 P1 C12, P2 C3d, C4d, P3 C4 · Đ02 P3 C5 | không có trong lý thuyết (tâm tỉ cự) |
| **Vật lí: lực & công** | B1D1, B1D2, Đ01 (hợp lực/trọng lực); B2D1 P3 C7, B3D2 TL BT4,BT5 | 42 mục (xem §6) |
| **Radar / khí cầu / máy bay** | B2D1, B2D2, B3D1, B3D2, Đ02, Đ03 | cùng bộ vài kịch bản đổi số |

### 5.2 Khác (kiểu chỉ có ở PNL, hoặc chỉ ở một chỗ)
- Chỉ ở **B1D1 P3**: bài đồng phẳng/giao điểm tìm hệ số (C3, C9, C10), tỉ số MN∥BD′ (C6), min tổng bình phương và Cauchy (C2, C8) — nặng đại số, nằm ngay chương vectơ **không toạ độ**.
- Chỉ ở **B2D2**: toàn dạng toạ độ hoá hình đa diện (7 câu C + 3 câu A) — chỉ có 1 dạng theo tác giả, nên mọi hình (chóp tứ giác đều, lăng trụ đều, chóp SA⊥đáy…) gom chung.
- Chỉ ở **B3D2 P2**: bốn câu Đ/S tích hợp nâng cao (ngoại tiếp, khoảng cách hai đường chéo nhau, bán kính mặt cầu ngoại tiếp tứ diện C4; góc nhị diện C6) — kiến thức **vượt chương** (khoảng cách chéo nhau, mặt cầu ngoại tiếp, nhị diện chưa học).
- Chỉ ở **B3D2**: trọng tâm là "tích có hướng": diện tích, thể tích hộp/tứ diện, đồng phẳng; không có tài liệu tương ứng trong lý thuyết.
- Chỉ ở **B1D2 / Đ01**: công sinh bởi lực F·d, hợp lực ba lực không đồng phẳng (quy tắc hình hộp), lực cản ∝ v².
- Chỉ ở **Đ02/Đ03**: "tối ưu hoá" (vị trí tiếp liệu khí cầu; hàm lực căng F(L) theo độ dài dây; min tổng khoảng cách).

---

## 6. Nhận xét cho người thiết kế

**Nặng nhất về số câu (cả bộ, ước lượng theo kiểu):**
1. **Hình bình hành/hình hộp tìm đỉnh** (toạ độ AD=BC): ≈ 14 câu TN rải B2D1 (6), B3D1 (3), Đ02 (4), Đ03 (1) — nhưng 1 kiểu giải; dạng đơn giản nhất, nên cân nhắc *một dạng* với nhiều mức (tìm đỉnh thứ tư / hình hộp / đối xứng).
2. **Góc giữa hai vectơ/hai đường trong hình** (B1D2 b) 14 câu + các dạng đại số a (9) + vật lí e (7) ⇒ Bài 1·Dạng 2 là dạng "nặng" nhất về tích vô hướng.
3. **Phân tích vectơ theo 3 vectơ cơ sở** (B1D1 a, 9 câu + 5 ở Đề + 4 câu P3 đồng phẳng) ≈ 18–20 câu cùng một ý tưởng.
4. **Hình chiếu/đối xứng/cộng trừ vectơ toạ độ** (B2D1 a,b,c,d,e = 22 câu) ≈ 25–30 câu kể cả Đề — đều ở mức NB, 1 bước.
5. **Điểm trên trục/mp toạ độ + chia tỉ số + trung điểm/trọng tâm** (B3D1 b,c,e,g = 16 + Đề) ≈ 22 câu.
6. **Thực tế/vật lí** tổng 42 mục: B1D1 9 · B1D2 9 · B3D2 6 · B2D1 4 · B2D2 3 · B3D1 2 · Đ01 2 · Đ02 5 · Đ03 2.

**Chỉ 1–2 câu (cân nhắc gộp hoặc bỏ):** chân đường phân giác trong (`B3D1·P1·C25`) · hình vuông + giao điểm (`B3D1·P1·C30`) · góc nhị diện của mái nhà (`B3D2·P2·C6`) · khoảng cách chéo nhau (`B3D2·P2·C4c`) · mặt cầu ngoại tiếp tứ diện (`B3D2·P2·C4d`) · ngoại tiếp tam giác (`B3D2·P1·C28`, `P2·C3d`) · trực tâm (`B3D2·P1·C26`) · thể tích hình hộp (`B3D2·P1·C30`) · "đồng phẳng với tham số" (`B1D1·P3·C3,C9,C10`, 3 câu nhưng cực khó) · bất đẳng thức Cauchy (`B1D1·P3·C8`) · tính khoảng cách tâm tứ diện Rubik (`B1D1·TL·BT6′`).

**Kiểu cần hình 3D (hình hộp, chóp, lăng trụ, tứ diện, hình thoi, ngôi nhà…)**: ≈ **toàn bộ Bài 1** (B1D1 + B1D2 + Đ01 = 102 TN + 14 TL, trừ các câu "đại số thuần" B1D2·a (9 câu) và vật lí đơn giản P1 C22–C24 của B1D1), **toàn B2D2** (17 TN + 2 TL, nhưng *mất hình* trong bản chữ), B2D1 (P2 C3,C4,C7; P3 C6 + TL2,3,6), B3D1 (P2 C5; P3 C6,7; TL6), B3D2 (P1 C30; P2 C3–C6; TL2,TL4). **Tối thiểu cần 4 khuôn hình**: (i) tứ diện/chóp, (ii) hình hộp/lập phương/hộp chữ nhật, (iii) lăng trụ đứng/xiên (đáy tam giác đều/hình thoi), (iv) hệ trục Oxyz có điểm.
**Kiểu liên quan thực tế (lực, vận tốc, cáp, toạ độ máy bay…) — 42 mục** gồm: lực & hợp lực/lực căng (đèn tròn, đèn chùm, cân đòn tay, ô tô–cần cẩu, ba dây cân bằng, chậu cây 4 chân, trọng lực) · công sinh bởi lực (xe xuống dốc, cầu trượt, thiết bị dò biển f·d, lực tĩnh điện) · chuyển động (radar máy bay, vận tốc gấp 3, hai khí cầu/máy bay không người lái) · bố cục không gian (sân cầu lông, phòng học, ngôi nhà, căn lều gỗ, giàn khoan, cáp xe tải) · phân tử NH₃ (hoá học). Nhiều kịch bản **lặp lại** (§1.3), nên khi lập dạng chỉ cần giữ **5–6 kịch bản gốc**: *lực → hợp lực*, *công = F·d*, *radar/vận tốc → toạ độ sau t*, *khí cầu → khoảng cách*, *toạ độ hoá nhà/phòng*, *tối ưu hoá vị trí*.

**Gợi ý cấu trúc (theo bằng chứng trong nguồn, không phải thiết kế):**
- Tác giả chỉ có **6 "Dạng" thô** nhưng bên trong mỗi dạng có **5–11 kiểu thật** (§3). Nếu người thiết kế cần tối đa 4 tầng, nên tách thành nhóm kiểu cụ thể như bảng §3 (đặc biệt B1D1 [10 kiểu], B2D1 [11 kiểu], B3D1 [11 kiểu], B3D2 [12 kiểu]).
- **Chèn 3 mảng lý thuyết còn thiếu** vì bài tập đã đòi: *đồng phẳng* (Bài 1), *tâm tỉ cự & Σ MA²* (Bài 1/3), *ứng dụng tích có hướng* (Bài 3: S, V, đồng phẳng) — nguồn PNL không có đoạn lý thuyết nào cho ba thứ này.
- **Mức khó**: trong cả bộ chỉ ≈ 15–20% VD/VDC (ước lượng) (chủ yếu B1D1·P3, B3D1·P1 C25–C30, P3 C6–C9, B3D2·P1 C26–C30, P2 C3–C6, Đ03). Phần lớn NB–TH. Dạng "đại số thuần" `B1D2·a` (9 câu, không cần hình) và `B3D2·a,b,e` (NB) có thể làm "dạng nền" cho bé.
- **Nguồn tạo dạng** (để so với đề thi): kiểu chỉ có ở sách (vật lí/thực tế ~ tất cả 42 mục; Cauchy/tâm tỉ cự; tích hợp vượt chương ở B3D2·P2); kiểu rất có thể có ở đề thi chuẩn GDPT (hình chiếu/đối xứng/hbh tìm D/trọng tâm/trung điểm/thẳng hàng/cùng phương/vuông góc tìm m/diện tích tam giác/thể tích hộp–tứ diện; phân tích vectơ theo cơ sở; góc giữa hai đường qua tích vô hướng) — **phần xác nhận bằng đề thi để người thiết kế đối chiếu**, không khẳng định trong hồ sơ này.
- **Cảnh báo dữ liệu**: nếu muốn nhập kho từ PNL, nên loại 14 cặp trùng (§1.3A), cảnh giác 3 câu có lời giải sai (`B1D2·P1·C5`, `P3·C2`, `P3·C4`) và 1 đề hỏng ký tự (`Đ01·P3·C4`); bản chữ B2D2 phải bổ sung hình.
