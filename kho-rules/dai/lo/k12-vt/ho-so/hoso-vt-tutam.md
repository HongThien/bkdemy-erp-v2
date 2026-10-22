# HỒ SƠ NGUỒN — Toán Từ Tâm, Toán 12, Chương 2 "Vectơ và hệ trục toạ độ trong không gian"

Thư mục đọc: `scratchpad\vt\txt\TT__*` (6 tệp). Mọi con số dưới đây ĐẾM bằng grep trên tệp, không ước lượng. Hình `[[img]]` và khung "Phương pháp" / "Chú ý" (đều là ảnh) không đọc được → ghi "(trong ảnh)".

## (0) VAI TRÒ TỆP + SỐ LIỆU ĐẾM

| Tệp | Vai trò | Số liệu |
|---|---|---|
| `TT__C2-B1-…-P1` | Bài 1 · A. Lý thuyết (4 mục) + B. Các dạng (PP + Ví dụ có lời giải) | 4 Dạng · **11 Ví dụ** |
| `TT__C2-B1-…-P2` | Bài 1 · C. Luyện tập, mọi câu có lời giải | **45 câu**: TN 24 (C1–24) · Đ/S 8 (C25–32) · TLN 13 (C33–45) |
| `TT__C2-B2-…-P1` | Bài 2 · Lý thuyết (2 mục) + 3 Dạng | 3 Dạng · **10 Ví dụ** (Ví dụ "1.4" đánh số 2 lần: 5 ví dụ ở Dạng 1) |
| `TT__C2-B2-…-P2` | Bài 2 · Luyện tập | **44 câu**: TN 24 · Đ/S 8 (C25–32) · TLN 12 (C33–44) |
| `TT__C2-B3-…-P1` | Bài 3 · Lý thuyết (3 mục) + 6 Dạng | 6 Dạng · **22 Ví dụ** |
| `TT__C2-B3-…-P2` | Bài 3 · Luyện tập | **26 câu**: TN 15 · Đ/S 5 (C16–20) · TLN 6 (C21–26) |

**Tổng chương:** 13 Dạng của tác giả · 43 Ví dụ · **115 câu luyện** = TN 63 + Đ/S 21 (= 84 mệnh đề a–d) + TLN 31.
- **P2 KHÔNG gắn nhãn dạng** (chỉ P1 có "Dạng 1, 2…"). Mọi "kiểu" của P2 dưới đây là **kiểu do mình rút** từ nội dung câu. Mã kiểu: `1A…1K` (Bài 1), `2A…2J` (Bài 2), `3A…3I` (Bài 3). Mỗi câu P2 gán đúng MỘT kiểu chính (tổng khớp 45 / 44 / 26); câu Đ/S lai gán theo ý chủ đạo và ghi chú.
- Mỗi tệp chỉ có 1 bản (không có bản HS, không có tệp trùng trong 6 tệp `TT__`).
- Câu Đ/S: mỗi câu 4 mệnh đề (a)(b)(c)(d), mỗi mệnh đề có "Chọn ĐÚNG/SAI". TLN: lời giải có dòng "Trả lời: số".
- Lỗi/in sai của sách (đã tự soát, có thể ảnh hưởng khi dùng làm nguồn): xem mục (3).
- Công thức hỏng khi đổi chữ: B2-P1 Ví dụ 3.1 (đáp án mất `[[EQ-FAILED]]`), B3-P1 Ví dụ 3.4 (hệ M∈BC mất `EQ-FAILED`), B1-P2 Câu 29(c) (mất 1 dòng).

---
## (1) CẤU TRÚC NGUYÊN VĂN (thứ tự tác giả)

**Bài 1. VECTƠ & CÁC PHÉP TOÁN TRONG KHÔNG GIAN** (tiêu đề tệp: "VECTƠ và CÁC PHÉP TOÁN TRONG KHÔNG GIAN")
- A. Lý thuyết: 1. Khái niệm vectơ trong không gian; hai vectơ cùng phương, cùng hướng, bằng nhau; vectơ-không · 2. Tổng và hiệu của hai vectơ (quy tắc ba điểm, hình bình hành, hình hộp, hiệu) · 3. Tích của một số với một vectơ · 4. Tích vô hướng của hai vectơ (góc giữa hai vectơ, công thức, quy ước).
- B. Dạng 1. Sử dụng các định nghĩa · Dạng 2. Tổng và hiệu của hai vectơ · Dạng 3. Tích của một số với một vectơ · Dạng 4. Tích vô hướng và góc của hai vectơ.
- C. Luyện tập: A. Trắc nghiệm · B. Đúng/sai · C. Trả lời ngắn (45 câu).

**Bài 2. TỌA ĐỘ CỦA VECTƠ TRONG KHÔNG GIAN**
- A. Lý thuyết: 1. Hệ toạ độ trong không gian (Oxyz, i, j, k) · 2. Toạ độ của điểm và vectơ (OM = x i + y j + z k; hoành/tung/cao độ).
- B. Dạng 1. Tọa độ điểm · Dạng 2. Tọa độ vectơ · Dạng 3. Bài toán thực tế.
- C. Luyện tập (44 câu).

**Bài 3. BIỂU THỨC TỌA ĐỘ CỦA CÁC PHÉP TOÁN VECTƠ**
- A. Lý thuyết: 1. Biểu thức toạ độ của tổng, hiệu, tích số-vectơ (+ nhận xét cùng phương) · 2. Biểu thức toạ độ của tích vô hướng · 3. Vận dụng (toạ độ vectơ AB; trung điểm; trọng tâm tam giác).
- B. Dạng 1. Tọa độ tổng hiệu vectơ · Dạng 2. Tọa độ điểm – vectơ thỏa điều kiện · Dạng 3. Độ dài vectơ · Dạng 4. Sự cùng phương của hai vectơ · Dạng 5. Tích vô hướng và ứng dụng · Dạng 6. Tâm tỷ cự.
- C. Luyện tập (26 câu).

Tổng 4 + 3 + 6 = **13 dạng của tác giả**. Tên dạng KHÔNG có "Chuyên đề/Nhóm" — chỉ 3 bài phẳng.

---
## (2)+(3) TỪNG BÀI → TỪNG DẠNG: PHƯƠNG PHÁP + KIỂU ĐỀ

Quy ước: `VDx.y` = Ví dụ trong P1. "C12" = Câu 12 của P2 (đánh số liên tục TN → Đ/S → TLN). Mức: NB/TH/VD/VDC chỉ là ước lượng của mình. Các hình (hộp, lăng trụ, chóp, tứ diện) hầu như luôn có hình vẽ (trong ảnh).

### BÀI 1 — VECTƠ & CÁC PHÉP TOÁN (P1: 11 VD · P2: 45 câu)

**Lý thuyết cốt lõi:** vectơ = đoạn thẳng có hướng; độ dài, giá, cùng phương (giá song song/trùng), bằng nhau (cùng độ dài + cùng hướng), đối nhau, vectơ-không (cùng phương, cùng hướng với mọi vectơ); tổng qua dựng AB+BC=AC, giao hoán, kết hợp; quy tắc ba điểm · hình bình hành (AB+AD=AC) · **hình hộp (AB+AD+AA'=AC')** · hiệu (AB−AC=CB); tích k·a (hướng theo dấu k, độ dài |k||a|); góc (u,v)=∠BAC, 0°≤…≤180°, tích vô hướng u·v=|u||v|cos(u,v), u²=|u|², u⊥v ⇔ u·v=0. Khung "Chú ý" và "Phương pháp" là ảnh.

**Dạng 1 — Sử dụng các định nghĩa.** PP: nhắc lại định nghĩa (trong ảnh). Ví dụ 2: VD1.1 (hộp: chỉ ra vectơ cùng phương / bằng / ngược hướng với AB, AA'), VD1.2 (chóp đều S.ABCD, M,N,P,Q trung điểm cạnh bên → tính |MN|,|MP|,|MS| theo a,h).
Kiểu P2:
- **1A "Khái niệm vectơ trên hình hộp/chóp"** (cùng phương, bằng, đối nhau, điểm đầu–cuối, vectơ-không, đếm số vectơ) — **8 câu**: TN 1,2,3,4,15; Đ/S 25,28; TLN 33. NB. Mẫu: C4 "Hộp chữ nhật: BA bằng vectơ nào? (A'B', CD, BC, AB)"; C33 "đếm vectơ đối của AB trong hộp" (đáp án 4). Đ/S 25 còn kèm (c) "số vectơ khác 0 có đầu–cuối là đỉnh hộp = A₈²" và (d) |BD'|=√29 (độ dài, trộn sang 1F).

**Dạng 2 — Tổng và hiệu của hai vectơ.** PP: 3 quy tắc (ba điểm, hình bình hành, hình hộp) + quy tắc hiệu; mẹo chuyển vectơ bằng nhau về cùng gốc (AB+A'D'=AB+AD). Ví dụ 4: VD2.1 (lập phương cạnh 2: |BA+BC+BB'|=2√3; |BC−BA+C'A|=2), VD2.2 (CM tứ diện AC+BD=AD+BC), VD2.3 (CM hộp: AB+AD+AE+GH+GB=0), VD2.4 (3 lực đôi một vuông 10N,8N,5N → hợp lực 3√21≈14 N, "quy tắc hộp chữ nhật").
Kiểu P2:
- **1B "Chọn đẳng thức đúng/sai hoặc tính tổng – hiệu bằng quy tắc"** — **9 câu**: TN 5,6,7,8,9,12,16,17; Đ/S 26. NB–TH. Mẫu: C7 "Hộp: mệnh đề đúng? AB+AD+AA'=AC' …"; C17 "BD−D'D−B'D'=k·BB', k=?" (k=1); Đ/S 26 (4 đẳng thức hộp, (a)(c) đúng).
- **1F "Độ dài của vectơ tổng (đường chéo hộp, kèm định lý cos ở đáy hình bình hành)"** — **1 câu**: TN 23 (hộp đứng đáy hbh ∠DAB=120°, AB=25, AD=12, AA'=12 → |AB+AD+AA'|=√613). VD. (Có thêm 1F phụ trong Đ/S 25(d), 32(c).)
- **1G "Lực – gia tốc – công – cáp (thực tế)"** — **4 câu**: TN 22 (F=ma, m=0,5 kg, a=20 → 10 N), TN 24 (cầu trượt dài 3,5 m nghiêng 30°, m=25 kg → 3 khẳng định: P=245 N, góc(d,P)=60°, công=428,75 J; đáp án "2"), TLN 38 (3 lực trên cạnh AB, AD, AA' độ lớn 2,3,4 N → |F|=√29≈5,385 N), TLN 44 (khung sắt chứa ô tô, 4 dây cáp EA..ED bằng nhau, góc 60° với (ABCD), mỗi lực căng 4700 N, khung nặng 3000 N → trọng lượng xe ≈13281 N). TH–VDC (C44 là VDC, lập luận lực cân bằng).

**Dạng 3 — Tích của một số với một vectơ.** PP: tính chất (k(a+b)=ka+kb …, a cùng phương b ⇔ a=kb, A,B,C thẳng hàng ⇔ AB=k·AC) + **hệ quả: I trung điểm AB ⇔ IA+IB=0 ⇔ 2OI=OA+OB; G trọng tâm ΔABC ⇔ GA+GB+GC=0 ⇔ 3OG=OA+OB+OC** (mọi O). Ví dụ 2: VD3.1 (tứ diện, G trọng tâm BCD, O trung điểm AG: CM 3OA+OB+OC+OD=0 và 3MA+MB+MC+MD=6MO — nêu 2 cách), VD3.2 (hộp; AM=x·AC, DN=y·DC'; biểu diễn BD', MN theo a=BA, b=BC, c=BB'; tìm x,y để MN∥BD' → x=2/3, y=1/3, tỉ số 1/3; dùng "a,b,c không cùng phương" ⇒ đồng nhất hệ số).
Kiểu P2:
- **1C "Trung điểm / trọng tâm: tổng nhiều vectơ về tâm; IJ=½(…)"** — **5 câu**: TN 10 (chóp đáy hbh: SA+SB+SC+SD=4SO), TN 11 (AB+DC=2MN, M,N trung điểm AD,BC), TN 18 (tứ diện, I,J trung điểm AB,CD: tìm đẳng thức SAI của IJ), Đ/S 27 (lăng trụ, M trung điểm BB', G trọng tâm ABC: BM=½BB'; AM=…; MA+MB+MC=3MG), TLN 40 (DA+DB+DC=k·DG, k=3). NB–TH.
- **1D "Biểu diễn một vectơ qua vectơ cơ sở / tìm hệ số"** — **3 câu**: TN 19 (hộp ABCD.EFGH, O trung điểm CH: BO theo BA,BC,BF), TLN 34 (MN=a·AB+b·AC+c·AD → a+b+c=1,5), TLN 39 (AG=k(a+b+c), G trọng tâm BCD, k=1/3). TH.
- **1E "Điều kiện đồng phẳng của ba vectơ"** — **1 câu**: TLN 37 (a,b,c không đồng phẳng; x=2a−b−c, y=−a+2b+c, z=a+4b+mc đồng phẳng → m=1; lời giải: x=αy+βz, đồng nhất hệ số). **Lý thuyết P1 (phần chữ) KHÔNG có mục "đồng phẳng"** → đề lấy kiến thức ngoài khung lý thuyết chữ (tác giả chỉ dùng "không cùng phương" ở VD3.2).

**Dạng 4 — Tích vô hướng và góc của hai vectơ.** PP: góc (u,v)=∠BAC bằng cách dời về cùng gốc (dựng điểm đối xứng khi vectơ ngược hướng); chú ý 0°≤(u,v)≤180°, cùng hướng 0°, ngược hướng 180°, vuông 90°, u²=|u|²; "Phương pháp" thêm 1 khung ảnh (image261). Ví dụ 3: VD4.1 (lập phương: 4 góc (AB,A'D')=90°, (AB,A'C')=45°, (AB,D'C')=0°, (AD,C'B')=180°), VD4.2 (tứ diện đều: (AB,BC)=120°, (CH,AC)=150°), VD4.3 (CM IJ⊥AB từ AC·AB=BD·AB=0, 2IJ=AC+BD).
Kiểu P2:
- **1H "Góc giữa hai vectơ ở hình đặc biệt (dời về cùng gốc)"** — **7 câu**: TN 13,14,20,21; Đ/S 29,31; TLN 35. NB–TH. Mẫu: C13 "lập phương: góc (AB,AD)"; C20 "lập phương: khẳng định SAI trong 4 góc (…(A'A,CB')=135° — dời C'C thành CE, E đối xứng)"; C21 "tứ diện đều: góc(AB,CD)=90°" (chứng minh bằng tích vô hướng qua trung điểm CD); C35 "tan góc(AD',A'C')"=√3≈1,732. Đ/S 29 (chóp tứ giác đều S.ABCD cạnh đáy a, cạnh bên 2a: (a) góc(AD,CB)=180°, (b) góc(BD,BO)=0°, (c) cos(BA,CS)=1/4 bằng định lý cos tam giác SCD, (d) góc(AO,SD)=90° bằng tích vô hướng); Đ/S 31 (hộp chữ nhật đáy vuông, góc giữa các tổng vectơ; (d) SAI vì OA'C' không vuông).
- **1I "Tính tích vô hướng cụ thể trên hình (cạnh a, góc 60°)"** — **2 câu**: Đ/S 30 (tứ diện đều S.ABC cạnh a, M trung điểm BC: SA·SB=SB·SC=…=a²/2; AM=−SA+½SB+½SC; góc(SA,BC)=90°; AM·SC=a²/4≠0), Đ/S 32 (lập phương: AB·DC'; AB'·B'D'; |D'A'+C'C+AB|=a√3; |OA'+OB'+OC'+OD'|=4a) — lai với 1B/1F. TH–VD.
- **1J "Chứng minh vuông góc / góc giữa hai đường thẳng chéo nhau bằng tích vô hướng"** (dữ kiện kiểu "SA=SB=SC, góc ở đỉnh bằng nhau"; "CA=CB, SA=SB") — **4 câu**: TLN 41 (S.ABC: góc(SC,AB)=90°), 42 (S.ABCD đáy vuông, cạnh bên = a; M,N trung điểm AD, SD: góc(MN,SC)=90° nhờ ΔSAC vuông tại S), 43 (S.ABC: SA=SB, CA=CB: SC⊥AB, dùng định lý cos để khử), 45 (tứ diện AB=AC=AD, ∠BAC=∠BAD=60°, ∠CAD=90°: IJ⊥CD). VD–VDC. **Tất cả đáp án 90°** (đáp án giống nhau, chỉ đổi đề).
- **1K "Tích vô hướng đại số (không hình): |a|,|b|,góc → điều kiện vuông, tìm k"** — **1 câu**: TLN 36 (|a|=2,|b|=5, góc 120°; u=ka−b ⊥ v=a+2b → k=−4,5). Trùng số liệu với B3-VD5.5 (|u|=2,|v|=5, 120°). TH.

**Tổng B1-P2 (đếm lại):** 1A 8 · 1B 9 · 1C 5 · 1D 3 · 1E 1 · 1F 1 · 1G 4 · 1H 7 · 1I 2 · 1J 4 · 1K 1 = **45** ✓ (TN 24 · Đ/S 8 · TLN 13).

---
### BÀI 2 — TỌA ĐỘ CỦA VECTƠ (P1: 10 VD · P2: 44 câu)

**Lý thuyết cốt lõi:** hệ Oxyz (ba trục đôi một vuông, i,j,k đơn vị); OM = x i + y j + z k ⇒ M(x;y;z) (hoành độ, tung độ, cao độ); a = a₁i+a₂j+a₃k ⇒ a=(a₁;a₂;a₃). **P1 không viết công thức AB=(xB−xA;…) trong lý thuyết/Dạng** (công thức đó nằm ở Bài 3, mục "Vận dụng") nhưng VD2.2–2.3 và P2 C6 dùng ngay.

**Dạng 1 — Tọa độ điểm.** PP: OM=m₁i+m₂j+m₃k ⇒ M(m₁;m₂;m₃); **MO=… ⇒ đảo dấu**; M∈Ox→(x;0;0)…; M∈(Oxy)→(x;y;0)… Ví dụ 5: VD1.1 (⑴ MO=2i−3k → M(−2;0;3); ⑵ OM=2OA+i với A(2;−3;1) → M(4;−4;5)), VD1.2 (cho M,N → toạ độ OM, ON), VD1.3 (hình chiếu M(−2;5;3) lên 3 trục), VD1.4 (a: biểu diễn OA, u theo i,j,k), VD1.4' (đánh số lặp: A(4;5;3), hình vẽ với L,K,H,A₁,A₂,A₃, tìm A₁A, A₂A = OL, OH).
Kiểu P2:
- **2A "Biểu thức i,j,k ↔ toạ độ điểm/vectơ (kể cả đảo chiều AO, MO, thứ tự lộn)"** — **6 câu**: TN 1,2,5,13,17; TLN 33. NB. Mẫu: C2 "AO=i−2j+3k, A=?" → (−1;2;−3); C13 "MO=3k−2i+4j" → M(2;−4;−3); C33 "OA=3i+4j−5k, S=100x+1000y+10z=4250".
- **2B "Điểm thuộc trục/mặt phẳng toạ độ; hình chiếu; điểm đối xứng (qua trục, qua mặt)"** — **8 câu**: TN 3,4,9,10,19,20; Đ/S 25,28. NB–TH. Mẫu: C20 "A(1;2;3) đối xứng qua Oz → (−1;−2;3)" (lời giải: H(0;0;3) trung điểm); Đ/S 28 "OM=2i+j+k: hình chiếu lên Ox, Oy, (Oxy)". (a) 25(d): đối xứng qua (Oyz) là (−2;4;6).

**Dạng 2 — Tọa độ vectơ.** PP: a=b ⇔ ba toạ độ bằng nhau; ABCD hbh ⇔ AB=DC. Ví dụ 3: VD2.1 (⑴ a=3i+2j−k → (3;2;−1); ⑵ tìm x,y,z để b=(x+2y−z−1; x−y+3z+1; 3x−y−z−6)=a → (2;1;0): hệ 3 phương trình bậc nhất 3 ẩn), VD2.2 (M(1;1;1),N(2;3;4),P(7;7;5): Q để MNPQ hbh → (6;5;2)), VD2.3 (hộp, cho A,B,D,D' → C' (6;−4;8): hai bước BC=AD rồi CC'=DD').
Kiểu P2:
- **2C "Toạ độ vectơ AB = B − A (A cho dưới dạng i,j,k)"** — **3 câu**: TN 6,7,15. NB. Mẫu: C6 "A(2;−1;0),B(1;1;−3) → AB=(−1;2;−3)".
- **2D "Hai vectơ bằng nhau / thuộc trục có tham số x,y"** — **3 câu**: TN 14 (OM=(2x−4)i−4j+(y−1)k, M∈Oy → x+2y=4), TN 16 (a=(2;−2;1)=b=(x−1;x²−3;y) → x−y=0; có nghiệm kép x=±1 phải loại), TN 18 (OBM'A hbh, M' hình chiếu M lên (Oxy) → x+y=4). TH.
- **2E "Tìm đỉnh còn lại của hình bình hành"** — **3 câu**: TN 11 (A(1;2;−1),B(2;−1;3),C(−3;5;1) → D(−4;8;−3)), TN 21 (A(1;0;3),B(2;3;−4),C(−3;1;2) → D(−4;−2;9), có bước kiểm A,B,C không thẳng hàng), Đ/S 26 (OABC hbh với A(1;2;3),B(5;0;−1), C(a;b;c): a+b+c=2). TH.

**Dạng 3 — Bài toán thực tế.** Ví dụ 2 (mỗi ví dụ = bài lượng giác dựng toạ độ): VD3.1 (xe kéo cáp AB, hệ Oxyz, OB=15, ∠HOB=30°, OA=10 → AB; đáp số mất), VD3.2 (máy bay cất cánh, OM=14, ∠NOB=32°, ∠MOC=65° → M(12,7;10,8;5,9) bằng 2 tam giác vuông liên tiếp).
Kiểu P2:
- **2H "Thực tế dựng toạ độ bằng lượng giác (cần trục, radar, giá đỡ chịu lực, nhà gỗ)"** — **6 câu**: TN 22,23,24 (chung 1 đề "cần trục chân đế": KM=OK=50 m, (k,KM)=60°, (i,OH)=45° → z_M=75; H(25√6/2; 25√6/2; 0); KM=(25√6/2; 25√6/2; 25)), Đ/S 32 (giá đỡ chịu 2 lực: phân tích F₁=250N, F₂=400N theo góc 35°/25° và 45°/60°; lực tổng hợp ≈485,297 N; góc với Oy), TLN 42 (radar: máy bay A(800;500;7)→B(940;550;9) trong 10 phút, sau 5 phút nữa C → x+y+z=1594; dùng BC=½AB), TLN 44 (nhà gỗ lăng trụ tam giác, A'(240;450;0), B'(120;450;300) → a+b+c=1013). VD–VDC.

**Kiểu P2 vượt khung P1 của Bài 2 (cần "gắn hệ trục vào hình"):**
- **2G "Gắn hệ trục vào hình khối rồi tìm toạ độ đỉnh/vectơ"** — **8 câu**: TN 8 (lập phương cạnh 1: AC=(1;1;0)), Đ/S 27 (hộp A≡O, B(3;0;0), D(0;3;0), D'(0;3;3): AB, A', trung điểm M của DD', C'), Đ/S 29 (lập phương cạnh 4: toạ độ D,C,A',C'), Đ/S 30 (hộp chữ nhật A≡O, AB=3,AC=5,AA'=6 → AD=4 bằng Pytago; AM với M trung điểm C'D'), TLN 34 (hộp chữ nhật OABC.EFGH, H(0;8;7)), TLN 39 (chóp đáy hình thoi cạnh 5, OA=OS=4, OB,OC,OS cùng hướng i,j,k → AM với M trung điểm SC; a+b+c=8), TLN 40 (tứ diện SABC, ABC vuông tại B, SA⊥(ABC); D sao cho SBCD hbh → 8), TLN 41 (chóp S.ABC đáy đều cạnh 2, SA⊥đáy, SA=1; S(a;√b;c) → 4). Dạng này dùng "vectơ cùng hướng i với độ dài d ⇒ d·i". TH–VD.
- **2J "Cho vài đỉnh hộp/lăng trụ → tìm đỉnh khác, tổng vectơ, trọng tâm"** — **4 câu**: TN 12 (A(1;0;1),B(2;1;2),D(1;−1;1),C'(4;5;−5) → A'(3;5;−6) bằng quy tắc hộp), Đ/S 31 (cùng A,B,D nhưng cho D'(3;4;−6): AB; C; A'; trọng tâm A'B'C), TLN 38 (A,B,D,D'(0;3;−3) → trọng tâm A'B'C → AG, S=1), TLN 43 (hộp OABC.O'A'B'C': d=OB+OC+OA'+OB' → a+b+c=33). VD.
- **2I "Điểm chia theo tỉ số / cực trị khoảng cách (thuộc Dạng 6 của Bài 3)"** — **3 câu**: TLN 35 (AM=2MB, |OM|=3), TLN 36 (M∈(Oxy), min |MA+MB|, T=a+b+c=2: I trung điểm → M là hình chiếu của I), TLN 37 (M∈(Oxz), min S=2MA·MB+MB·MC+3MC·MA = 6a²+6c²−14a−20c+22 → T=6a−5b+3c=12). VD–VDC. **Tâm tỷ cự/cực trị KHÔNG nằm trong P2 của Bài 3 (chỉ ở đây).**

**Tổng B2-P2 (đếm lại):** 2A 6 · 2B 8 · 2C 3 · 2D 3 · 2E 3 · 2G 8 · 2H 6 · 2I 3 · 2J 4 = **44** ✓ (TN 24 · Đ/S 8 · TLN 12).

---
### BÀI 3 — BIỂU THỨC TỌA ĐỘ CỦA CÁC PHÉP TOÁN VECTƠ (P1: 22 VD · P2: 26 câu)

**Lý thuyết cốt lõi:** a±b, k·a theo toạ độ; a cùng phương b (b≠0) ⇔ a=k·b (3 toạ độ cùng tỉ lệ); a·b=a₁b₁+a₂b₂+a₃b₃; AB=(x_B−x_A;…); trung điểm M; trọng tâm G của ΔABC (và của tứ diện ở Dạng 2⑸).

**Dạng 1 — Tọa độ tổng hiệu vectơ.** PP: công thức tổng/hiệu/số nhân + điều kiện cùng phương. VD1.1 (a=(2;−1;5), b=(0;−2;−4): a+b, a−b, 5a, 2a−½b), VD1.2 (A,B,C tạo thành tam giác ⇔ AB, AC không cùng phương: 3/4=6/8≠6/9).
Kiểu P2:
- **3A "Phép toán toạ độ cơ bản (u±v, k·a, tổ hợp, tìm b từ đẳng thức)"** — **6 câu**: TN 1,2,3,4,5; Đ/S 16. NB. Mẫu: C4 "u=2a−3b+c" → (5;3;−9); C5 "b−a+2c=0 → b=a−2c".
- **3B "Toạ độ AB, trung điểm, hình chiếu, đối xứng (nhắc lại Bài 2)"** — **5 câu**: TN 6,7,8,9,10 (C9 đối xứng qua Oy; C10 u=2BA−OB).

**Dạng 2 — Tọa độ điểm – vectơ thỏa điều kiện.** PP: ⑴⑵ công thức tích vô hướng và vuông góc *(sách in a·b=a₁a₂+b₁b₂+c₁c₂ — sai ký hiệu, xem (3))*, ⑶⑷⑸ trung điểm / trọng tâm ΔABC / trọng tâm tứ diện + hệ thức vectơ ∀M: MA+MB=2MI, MA+MB+MC=3MG, MA+…+MD=4MG. Ví dụ 5: VD2.1 (u=BC−3AO), VD2.2 (D sao cho AB=2DC; lời giải ghi "ABCD là hình bình hành" — sai vì tỉ số 2), VD2.3 (I trung điểm MN với M,N trung điểm AB,CD → I(1;1;1)), VD2.4 (chân đường cao từ O của ΔOAB: K=A+k·AB, OK·AB=0 → k=13/33), VD2.5 (ΔABC, A cho, G cho → AB+AC=3AG=(0;−9;9) bằng M trung điểm BC).
Kiểu P2:
- **3F "Hình hộp/hbh cho toạ độ vài đỉnh → đỉnh còn lại"** — **1 câu**: TLN 21 (A(1;2;−1),C(3;−4;1),B'(2;−1;3),D'(0;3;5) → A'(0;4;3), x+y+z=7; dùng quy tắc hộp tại đỉnh A').
- **3E "Điểm chia theo tỉ số (CE=2EB; MC=2MB) → toạ độ + đại lượng"** — **2 câu**: TLN 22 (B(1;2;−3), C(7;4;−2), CE=2EB → x+y+z=3), TLN 23 (**trùng hệt VD3.4**: M∈BC, MC=2MB, AM=√29≈5,4).
- **3H "Hỗn hợp trên một ΔABC: trọng tâm · hbh · AM=3CB · M∈Ox, BM⊥AC"** — **1 câu**: Đ/S 18 (A(−1;0;3),B(4;2;0),C(3;1;−3); 4 ý (a)(b) đúng, (c)(d) sai vì tính nhầm: sách ghi "a+b+c=−13" vs tính ra 17; "4a²+b²+c²=162" vs 81).
- *(Không có câu P2 nào cho "chân đường cao" (VD2.4), "AB+AC từ trọng tâm" (VD2.5), "u=BC−3AO" thuần.)*

**Dạng 3 — Độ dài vectơ.** PP: AB=√((x_B−x_A)²+…); |a|=√(a₁²+a₂²+a₃²). VD3.1 (AB=√6), VD3.2 (chu vi ΔABC = √3+√10+2√5), VD3.3 (diện tích ΔABC: kiểm tra không cùng phương + AB·AC=0 ⇒ vuông tại A, S=½AB·AC=√30/2), VD3.4 (M∈BC, MC=2MB, AM=√29).
Kiểu P2:
- **3C "Độ dài đoạn / chu vi"** — **2 câu**: TN 11 (AB=5), TN 12 (hbh MNPQ có M,N,P; chu vi=√456+√440, a−b=16).

**Dạng 4 — Sự cùng phương của hai vectơ.** PP: a=b ⇔ 3 toạ độ bằng; a=k·b ⇔ 3 toạ độ tỉ lệ. VD4.1 (a cùng phương vectơ nào trong b,c,d — a=(4;1;−2): c=2a? và d=−a), VD4.2 (b=(m+1;2n;10) cùng phương a=(1;1;5) → m=n=1), VD4.3 (A,B,M thẳng hàng, M(x;y;1) → x=−4,y=7), VD4.4 (AB cắt (Oxz) tại M, tỉ số AM/BM=1/2; đặt M(x;0;z), AM=k·AB).
Kiểu P2:
- **3D "Cùng phương / thẳng hàng; giao điểm đường thẳng AB với trục hay mặt phẳng toạ độ; tỉ số"** — **4 câu**: TN 13 (vectơ nào cùng phương u=(1;−2;3)), TN 14 (AB∩Ox: C(−1/3;0;0)), Đ/S 19 (4 ý: v cùng phương AB tìm n=−1/2; D để ABCD hbh; E(x;y;−2) thẳng hàng; M∈(Oxy) thẳng hàng — ý (d) SAI vì dấu M(−2;−7;0)), TLN 25 (**trùng hệt VD4.4**: AM/BM=0,5).

**Dạng 5 — Tích vô hướng và ứng dụng.** PP: cos(a,b)=(a·b)/(|a||b|); a·b>0 ⇒ góc nhọn, <0 ⇒ tù; vuông ⇔ a·b=0; **bài toán độ dài–tích vô hướng khi chỉ biết |u|=m,|v|=n, góc α: bình phương |u+v|²=u²+2u·v+v² (3 bước "Hướng giải quyết")**. VD5.1 (cos(a,b) với a=(−3;4;0), b=(5;0;12) = −3/13), VD5.2 (cos∠BAC=9/(2√35)), VD5.3 (u=2a+3mb ⊥ v=ma−b), VD5.4 (u=(1;1;−2), v=(1;0;m), góc 45° → m=2−√6, **có điều kiện 1−2m≥0 khi bình phương**), VD5.5 (|u|=2,|v|=5, 120° → |u+v|=√19; không có toạ độ).
Kiểu P2:
- **3G "Tích vô hướng / cos góc / vuông góc / tìm tham số"** — **4 câu**: TN 15 (IA·BA=6, I trung điểm AB), Đ/S 17 (a=(2;1;0),b=(−1;0;−2),c=(m;−2;4): −2a+b; b⊥c ⇒ m=−8; cos(a,b)=−2/5; |c|=2|a| ⇒ m=0), Đ/S 20 (A,B,C: AB·BC=−52; ∠ABC nhọn; cos(AB,AC); ΔABD vuông tại B ⇒ x=−6), TLN 26 (**trùng hệt VD5.4**: số m làm góc 45° → 1).
- *(Không có câu P2 nào dạng VD5.5 "biết |u|,|v|,α tính |u±v|" — kiểu này sang Bài 1 TLN 36 dạng đại số.)*

**Dạng 6 — Tâm tỷ cự.** PP (rất đầy đủ, dạng tổng quát): (i) min |Σkᵢ·MAᵢ| : tìm I sao cho Σkᵢ·IAᵢ=0, |Σ|=|k||MI| (k=Σkᵢ≠0), M là hình chiếu của I lên d / (P); (ii) min Σkᵢ·MAᵢ² (k>0): Σ=k·MI²+Σkᵢ·IAᵢ²; (iii) k<0 ⇒ GTLN. VD6.1 (4 điểm A,B,C,D, M∈(Oyz) để |MA+MB+MC+MD| nhỏ nhất: G trọng tâm tứ diện (có kiểm tra không đồng phẳng bằng tích hỗn tạp [AB,AC]·AD=−4), M=(0;1;4)), VD6.2 (OA=i+j−3k, B(2;2;1), M∈Oy để MA²+MB² nhỏ nhất: **Cách 1** hàm bậc hai theo y; **Cách 2** trung điểm I + MA²+MB²=2MI²+9 → M(0;3/2;0)).
Kiểu P2:
- **3I "Tâm đường tròn nội tiếp (tâm tỷ cự có hệ số = độ dài cạnh)"** — **1 câu**: TLN 24 (M(2;2;1), N(−8/3;4/3;8/3), O; I tâm nội tiếp ΔOMN, IE với E(2;2;3) = 3). Chứng minh kèm công thức a·IO+b·IM+c·IN=0 (dòng "Áp dụng công thức trong tam giác" — trong lời giải, KHÔNG có ở lý thuyết). VDC.
- *Cực trị tâm tỷ cự (VD6.1/6.2) có 3 câu đúng kiểu này nhưng nằm ở B2-P2 (2I TLN 36, 37, +35 chia tỉ số), không ở B3-P2.*

**Tổng B3-P2 (đếm lại):** 3A 6 · 3B 5 · 3C 2 · 3D 4 · 3E 2 · 3F 1 · 3G 4 · 3H 1 · 3I 1 = **26** ✓ (TN 15 · Đ/S 5 · TLN 6).

---
## (3) BẪY / CHÚ Ý / MẸO tác giả nhấn (và lỗi in sai)

Nhấn mạnh có chữ trong tệp:
1. **Quy ước vectơ-không**: độ dài 0, cùng phương và cùng hướng với mọi vectơ (B1-P1 mục 1 & Dạng 1).
2. **Quy tắc hộp**: AB+AD+AA'=AC' (cùng đỉnh); khác quy tắc hbh. Các đề hộp luôn đưa nhiều vectơ cùng gốc về đường chéo (B1-P2 C7, C12, VD2.3).
3. **Góc giữa hai vectơ ≠ góc hai đường thẳng**: phải dời về cùng gốc; ngược hướng ⇒ 180° (VD4.1⑷ 180°; C20 135°; VD4.2 120°, 150°). Tác giả giải bằng cách "gọi A' đối xứng …".
4. **Đồng nhất hệ số** chỉ được khi "a,b,c không cùng phương/không đồng phẳng" (VD3.2).
5. **Tâm tỷ cự**: bước 1 "gọi I thoả Σk·IA=0", bước 2 quy tắc ba điểm, bước 3 hình chiếu / dựa MI nhỏ nhất. Khi k<0 ⇒ GTLN (Chú ý B3-P1).
6. **Bài toán |u±v|**: bình phương, thay u²=|u|², u·v=|u||v|cos (3 bước).
7. Mọi "Chú ý" và "Phương pháp" thực sự ở dạng ảnh → mẹo của tác giả có thể nhiều hơn; ghi nhận thiếu.

Lỗi / lệch của sách (nên biết khi dùng làm nguồn đề, nhiều chỗ ĐÃ TỰ TÍNH LẠI):
- **B1-P2 C3**: phương án B và C trùng chữ (cùng BA). **C18** ("đẳng thức SAI"): phương án C và D in giống nhau; mình kiểm cả 4 phương án đều đúng (AD+DC=AC nên C=D=½(AC+BD)=A=B), lời giải chọn D rồi kết luận đẳng thức sai là ½(AB+CD) — biểu thức này không nằm trong 4 phương án ⇒ câu hỏng. **C24 (cầu trượt)**: mệnh đề 2 ghi "30°", lời giải tính 60° → mệnh đề sai (đúng với đáp án "2"); đề nên nêu rõ.
- **B1-P2 C36**: câu đề nói "Trong không gian với hệ tọa độ Oxyz" nhưng không có toạ độ.
- **B2-P2 C3**: dòng giải thích ghi "Điểm thuộc trục Oy là P(0;0;6)" trong khi đáp án chọn A=M(0;5;0) — dòng giải thích lệch. **C32(d)**: đề "16,145°", lời giải tính 15,145° ⇒ chọn SAI. **C27(c)**: đề M(0;3;−3), lời giải tính M(0;3;3/2) ⇒ SAI.
- **B2-P2 C37**: bước cuối viết (b−5/3)² nhưng là (c−5/3)² (typo); kết quả T=12 đúng (mình tính lại).
- **B2-P1** VD1.4 đánh số 2 lần; lời giải VD1.3 viết M''', M'' nhập nhằng.
- **B3-P1** Dạng 2⑴⑵ in a·b=a₁a₂+b₁b₂+c₁c₂ (ký hiệu sai, đúng là a₁b₁+a₂b₂+a₃b₃). **VD2.2**: ghi "ABCD là hình bình hành ⇔ AB=2DC" (sai: hbh phải AB=DC; đề bài thực ra là AB=2DC, không phải hbh). **VD5.3**: sách ghi `9m²√2 − 6m − 6√2 = 0` và `m=(±√26+√2)/6`; mình triển khai lại ra **9√2·m² − 2m − 6√2 = 0** (hệ số m là −2) ⇒ đáp án sách khả nghi, cần tính lại trước khi dùng. **VD2.4**: ghi K(−k+1; −4k+1; 4k−1) nhưng dòng sau dùng −4k+2 (typo).
- **B3-P2 C17(c)**: đề cho cos(a,b)=2/5, lời giải tính −2/5 (dấu in bị lẫn thành "−" giữa dòng) ⇒ SAI. **C18(c)**: đề a+b+c=−13, tính ra 17 ⇒ SAI. **C19(d)**: M(−2;7;0) vs tính (−2;−7;0) ⇒ SAI. **C25** lời giải viết AB/BM thay AM/BM (typo).

---
## (4) CHỒNG VÀ KHÁC

**Câu / ví dụ lặp (đếm):**
- **Trùng NGUYÊN bộ giữa P1 và P2 của cùng bài:** B3-P2 **C23 ≡ VD3.4** (M∈BC, MC=2MB, AM=√29), **C25 ≡ VD4.4** (AB cắt (Oxz), tỉ số AM/BM), **C26 ≡ VD5.4** (m để góc 45°) → 3/26 câu B3-P2 chính là ví dụ P1. B1-P2 **C20** trùng 2/4 góc của VD4.1. B1-P2 C38 ≈ VD2.4 (3 lực vuông trên cạnh hộp chữ nhật). B1-P2 C39/C40 ≈ VD3.1 (trọng tâm → hệ số). B1-P2 C21, C41, C43, C45 ≈ VD4.3 (chứng minh ⊥ bằng tích vô hướng).
- **Trong P2 cùng bài:** B1: C6≈C9 (AB+AD=AC); C4≈C15≈Đ/S28(a); C11≈C18≈C34 (MN, IJ = ½(…)); C41≈C43≈C45 (góc SC–AB / IJ–CD, đáp án đều 90°). B2: **C12 ≡ Đ/S31(c)** (cùng A,B,D → A'(3;5;−6)); C27≈C38 (A(0,0,0),B(3,0,0),D(0,3,0), D'(0;3;±3)); C11≈C21 (tìm D hbh); C9≈Đ/S28(b), C10≈Đ/S25(c)(d), C1≈C13≈C2 (i,j,k→toạ độ). B3: C1–C5 chung khuôn; C14≈Đ/S19(c)(d).
- **Chéo bài:** B2 C11 và B3-VD2.2 dùng cùng A(1;2;−1),B(2;−1;3),C(−3;5;1) (hbh vs AB=2DC). B2 C35 ≈ B3 C22 (AM=2MB vs CE=2EB). B1 TLN 36 và B3-VD5.5 cùng số (2, 5, 120°). B2 C36–37 là kiểu B3-Dạng 6. B3 TN6–10 lặp Bài 2 (hình chiếu, đối xứng, AB, trung điểm).

**Một kiểu xuất hiện ở nhiều dạng:**
- **"Cùng phương / thẳng hàng"** có ở B1-Dạng 3 (a=kb, A,B,C thẳng hàng), B3-Dạng 1⑷, B3-Dạng 4, B3-Dạng 2 (VD2.4 K∈AB).
- **"Trung điểm / trọng tâm"**: B1-Dạng 3 (hệ quả vectơ), B3-Lý thuyết mục 3 + Dạng 2⑶⑷⑸ (toạ độ), B2-P2 TLN 31/38 (trọng tâm A'B'C), B3-Dạng 6 (trọng tâm tứ diện làm điểm I).
- **"Hình bình hành → đỉnh còn lại"**: B2-Dạng 2 (VD2.2), B2-P2 TN 11,21 / Đ/S 26, B3-Dạng 2 (VD2.2), B3-P2 Đ/S 18(b),19(b).
- **"Tích vô hướng"**: B1-Dạng 4 (hình, góc, độ dài) và B3-Dạng 5 (toạ độ); cùng khái niệm, hai khuôn đề khác hẳn.
- **"Tìm đỉnh hộp"** (quy tắc hộp ↔ toạ độ): B1 (hình) → B2 (VD2.3, TN12, Đ/S 31) → B3 (TLN21): ba bài, cùng một kiểu đề, mức tăng dần.

**Chỉ tác giả này có / lệch khung:**
- Điều kiện **đồng phẳng của ba vectơ** (B1-TLN37) — không có trong lý thuyết P1.
- **Tâm đường tròn nội tiếp bằng a·IO+b·IM+c·IN=0** (B3 TLN24) — không có trong lý thuyết.
- **Tích hỗn tạp [AB,AC]·AD** (B3-VD6.1) — kiểm tra bốn điểm không đồng phẳng; kiến thức nằm ngoài chương trình hiện hành, chỉ xuất hiện 1 chỗ.
- **Thực tế**: có hẳn 1 Dạng riêng (B2-Dạng 3) + nhiều câu P2 (lực, cầu trượt, cần trục, radar, giá đỡ, nhà gỗ); tổng **10 câu P2** thuộc "thực tế" (B1: 4 = 1G; B2: 6 = 2H) + 3 ví dụ P1 (VD2.4, VD3.1, VD3.2).
- **Đếm vectơ bằng chỉnh hợp A₈²** (B1 Đ/S 25(c)) — kiểu tổ hợp xen vào.
- Đề "đếm số khẳng định đúng" (B1 TN 24) và đề "cho 3 mệnh đề, đếm đúng".
- Lời giải TLN của sách dùng "Cách 1 / Cách 2" ở VD6.2, VD3.1(2) → tác giả có 2 phương pháp song song.

---
## (5) NHẬN XÉT CHO NGƯỜI THIẾT KẾ

**Kiểu nặng nhất về số câu (P2, 115 câu):** 
1. Bài 1 — **1B** (9), **1A** (8), **1H** (7), **1C** (5) = 29/45; hình hộp/lập phương là cảnh nền của ~20 câu.
2. Bài 2 — **2B** (8: điểm thuộc trục/mặt, hình chiếu, đối xứng), **2G** (8: gắn hệ trục vào hình), **2A** (6), **2H** (6: thực tế) = 28/44.
3. Bài 3 — **3A** (6), **3B** (5), **3D** (4), **3G** (4) = 19/26.
→ Đối chiếu nhanh: toàn chương thiên về **thao tác cơ bản (nhận biết–thông hiểu)**; VDC hầu như chỉ ở 1G(C44), 2I(C36,37), 3I(C24), 1E(C37), 1J(C43).

**Kiểu chỉ 1–2 câu (cần quyết định giữ/gộp):** 1E (đồng phẳng, 1) · 1F (độ dài tổng, 1) · 1K (tích vô hướng đại số, 1) · 1I (2) · 3F (1) · 3H (1) · 3I (1) · 3C (2) · 3E (2). Trong P1 nhưng KHÔNG có câu P2: chứng minh đẳng thức vectơ (VD2.2, 2.3), độ dài vectơ theo a,h trong chóp đều (VD1.2), diện tích tam giác (VD3.3), chu vi (có 1 câu: TN12), chân đường cao (VD2.4), AB+AC từ trọng tâm (VD2.5), |u+v| khi biết độ dài–góc (VD5.5), hình chiếu lên trục (VD1.3 — có ở 2B).

**Kiểu cần hình 3D:**
- Bài 1: **39/45 câu** cần hình khối — hộp/lập phương/hộp chữ nhật/hộp đứng 20 · lăng trụ 3 · tứ diện (kể tứ diện đều) 8 · chóp 8. Chỉ 6 câu không cần hình khối: TN 2,3,22, TN 24 (cầu trượt: hình phẳng), TLN 36, TLN 37.
- Bài 2: **~17/44** cần hình/hệ trục dựng sẵn (2G 8 + 2J 4 + cần trục 3 + giá đỡ + nhà gỗ + …): hộp/lập phương dựng toạ độ từ cạnh; chóp & tứ diện vuông để chọn hệ trục. 27 câu thuần toạ độ không cần hình.
- Bài 3: gần như **0** (chỉ TLN 21 hộp và Đ/S 18 hbh). Toàn là tính toạ độ thuần.
→ Cần module vẽ hộp/chóp/tứ diện/lăng trụ có tên đỉnh (ABCD.A'B'C'D', S.ABCD, ABCD, ABC.A'B'C') + hệ trục Oxyz lên hình; khối lượng hình tập trung ở Bài 1 và 2G/2J.

**Kiểu liên quan thực tế (vật lý / kỹ thuật):** lực hợp (VD2.4, TLN38), lực căng cáp nâng khung (TLN44), định luật II Newton (TN22), công của trọng lực trên cầu trượt (TN24), lực phân tích Descartes (Đ/S 32 giá đỡ), cần trục (TN22–24), radar máy bay (TLN42), công trường cáp (VD3.1), máy bay cất cánh (VD3.2), nhà gỗ (TLN44). Yêu cầu lượng giác (sin/cos góc 30°,45°,60°) và hình vẽ → **10 câu thực tế P2 + 3 VD P1**.

**Điểm cần lưu ý khi phân chiều học (Bài 1/2/3):**
- Ranh giới 3 bài nhòe: B2-P2 chứa kiểu của B3 (2I = Dạng 6; C35 chia tỉ số); B3-P2 chứa kiểu của B2 (3B). Khi gắn câu vào bản đồ, nên dựa vào **phép toán cần dùng** (toạ độ điểm/vectơ cơ bản · AB=B−A · trung điểm/trọng tâm · tích vô hướng · cực trị) hơn là bài sách.
- Khung đề **Đ/S** hay dùng "một đề có 4 ý lấy cùng 1 hình/1 bộ toạ độ" (Đ/S 25, 27, 28, 29, 30, 31) ⇒ dạng "tách ý": mỗi ý thuộc một kiểu khác nhau, nên gán dạng theo từng ý.
- Mọi đáp số TLN của Bài 1 (góc) dồn vào 90° (41, 42, 43, 45) ⇒ cần đa dạng hoá khi sinh câu, đừng sao nguyên.
- Phương pháp của tác giả P1 (khung "Phương pháp") dạng ảnh ⇒ lý thuyết nhóm/dạng của sách này thiếu nửa phần chữ; có thể cần đọc ảnh nếu muốn chép nguyên.
