# Hồ sơ nguồn: Nguyễn Bảo Vương (NBV) Toán 12 — chương VECTƠ VÀ HỆ TRỤC TOẠ ĐỘ TRONG KHÔNG GIAN
(NBV8 = 12-8 "Vectơ trong không gian" · NBV9 = 12-9 "Các phép toán vectơ / toạ độ" · NBV10 = hai đề ôn chương)

Nguồn: `scratchpad/vt/txt/NBV8__*, NBV9__*, NBV10__*` (12 tệp). Đã đọc TOÀN BỘ đề + lời giải của A–E (NBV8, NBV9) và hai đề NBV10.
Quy ước viết tắt trong hồ sơ: **B8#12** = tệp B (tự luận) của NBV8, Câu 12; **C9#53** = tệp C (trắc nghiệm) của NBV9, Câu 53; **Đ1-I.3** = NBV10 Đề số 1, Phần I Câu 3; **Đ2-III.6** = Đề số 2, Phần III Câu 6.
Mọi "đếm" là đếm thật (regex `Câu n.` + tự phân loại từng câu; tổng mỗi bảng phân loại đã được kiểm khớp số câu). Phân loại KIỂU là phán đoán của mình ("kiểu do mình rút") — tác giả chỉ chia dạng ở tệp B của NBV8/NBV9, các tệp C/D/E và đề NBV10 không chia dạng.
Hình = ảnh `[[img:…]]` không đọc được → ghi "(trong ảnh)". Mức [NB/TH/VD/VDC] là mình ước theo độ dài lời giải/số bước, KHÔNG phải nhãn của tác giả.

---

## 1. Vai trò từng tệp + số liệu đếm

| Tệp | Vai trò | Số câu | Ghi chú |
|---|---|---|---|
| NBV8 A | Lý thuyết + ví dụ SGK | 4 mục, **11 Ví dụ** | không chia dạng |
| NBV8 B | Tự luận (có lời giải) | **41** câu, **4 dạng** | 41/41 chép từ SGK, nhãn (KNTT12) 20 · (CD12) 6 · (CTST12) 15 |
| NBV8 C | Trắc nghiệm 4 phương án (đáp án + lời giải) | **77** câu | không nhãn nguồn; không chia dạng |
| NBV8 D | Trắc nghiệm đúng–sai | **44** câu × 4 ý = **176 ý** | 4 câu có nhãn trường 2025 (D8#3–6); phần còn lại không nhãn |
| NBV8 E | Trả lời ngắn | **47** câu | 10 câu nhãn trường 2025 (E8#34–43); 9 câu (E8#11–19) mất công thức/số liệu vì WMF |
| NBV9 A | Lý thuyết + ví dụ | 6 mục (I–VI), **10 Ví dụ** | gộp Bài 2 + Bài 3 của chương |
| NBV9 B | Tự luận | **51** câu, **3 dạng** | nhãn (KNTT12) 22 · (CD12) 15 · (CTST12) 12 · không nhãn 2 (B9#24, B9#42) |
| NBV9 C | Trắc nghiệm | **110** câu | 108 câu nhãn đề trường/Sở 2025, 2 không nhãn (C9#97, #98) |
| NBV9 D | Đúng–sai | **43** câu × 4 ý = **172 ý** | 38 câu nhãn 2025, 5 không nhãn (D9#5–9) |
| NBV9 E | Trả lời ngắn | **64** câu | 64/64 nhãn 2025 |
| NBV10 Đề 1 | Đề ôn chương (3 phần, khuôn đề 2025) | **23** câu = I.12 + II.4 (16 ý) + III.6 + 1 "Bonus" | kèm Phiếu trả lời + Lời giải; không nhãn nguồn |
| NBV10 Đề 2 | như trên | **22** câu = I.12 + II.4 (16 ý) + III.6 | kèm Phiếu + Lời giải |

Tổng: **NBV8 = 209 câu + 11 VD**; **NBV9 = 268 câu + 10 VD**; **NBV10 = 45 câu**. Cộng **522 câu** (chưa trừ lặp).
Đại đa số nhãn nguồn ghi năm **2025** (đề thử/Sở/trường); không có đề 2024 trở về trước ở tệp C/D/E của NBV9 → nguồn rất "mới", đúng khuôn đề thi 2025 (TN 4 phương án / Đ-S 4 ý / TLN).

### 1a. Câu LẶP / gần lặp (đã dò bằng đối chiếu từ khoá + đọc lại)
**Lặp nguyên văn (cùng dữ kiện, cùng câu hỏi):**
- C8#71 = C8#74 (chóp O.ABC vuông, OM, góc (BC,OM)); C9#3 = C9#16 (A(1;1;−2), B(2;2;1), tọa độ AB); C9#53 = C9#67 = C9#76 (u=2a−3b+c với a,b,c cụ thể); C9#20 = C9#45 (góc giữa a=(1;−2;1), b=(−2;1;1)); D9#3 = D9#19 (tam giác ABC, đảo thứ tự ý); D9#29 = D9#40 (nhà kho OAFPE, camera, cáp O→E→H); E9#42 = E9#62 (tấm bảng 4 dây I(0;0;9)); E9#54 ≈ E9#57 (máy bay M(500;200;8)→N(800;300;10); chỉ đổi cái cần tính).
- **Chép chéo giữa các tệp:** D8#10–15 = B8#6, #7, #28, #29, #30, #25 (SGK chuyển sang Đ–S); D8#3 = Đ1-II.1; D9#41 = Đ1-II.4; D9#8 = Đ2-II.4; E9#61 = Đ1-III.5 = Đ2-III.5; E9#64 = Đ1-III.6; Đ1-Bonus = B8#41 (CD12); E9#38 = B9#42; C9#14 ≈ Đ1-I.11 (u=2a+3b−2c).
**Gần lặp (cùng khuôn, đổi số/đổi cách hỏi):** C8: #9~#19~#25 (chóp đáy hbh: SA+SC=SB+SD), #22~#35 (hộp, AC1+A1C…), #31~#36 (G0 giao GA với (BCD)), #12~#30 (G trung điểm IJ), #40~#42 (MP tứ diện), #11~#17~#23 (trọng tâm tam giác = 3 câu cùng ý). E8: #22 = #35 (ba lực 100°, 25 N, 12 N, 4 N; một câu làm tròn đơn vị, một câu 0,1), #32 = B8#37 (ba lực 120°, 10/8/6 N), #38 ~ B8#40 (khung sắt ô tô, đổi 4700/3000 → 3500/2500), #39 ~ B8#41 (đèn tròn 3 dây), #16 ~ #46 (đèn chùm 4 xích, ASC=90° / 60°). E9: #6 ~ #21 (GPS 4 vệ tinh, dịch toạ độ), #24 ~ #31 (cabin cáp treo AD=4050/3780 m), #25, #36, #39, #54, #57 (máy bay radar M→N, hỏi sau t phút: 5 câu cùng khuôn), #26, #33, #50, #60, #61 (hai khinh khí cầu/flycam/trực thăng + người quan sát: 5 câu cùng khuôn), C9#24 ~ E9#14 ~ E9#20 (cùng A(1;2;−1), B(2;−1;3), C(−4;7;5)).
→ Số câu "thực sự khác nhau" ước ≈ 90% tổng; chỗ lặp nặng nhất là **E8 phần lực (27 câu chia ~6 khuôn)** và **E9 phần chuyển động/khinh khí cầu (10 câu / 2 khuôn)**.

### 1b. Lỗi nguồn cần biết (đừng tin đáp án NBV mù quáng)
- **E8:** đáp số đầu lời giải lệch kết quả cuối: #20 ghi "25" nhưng √225 = **15**; #21 ghi "1,33" nhưng lời giải ra **6**; #2 lời giải dùng số liệu của #4 (q=2·10⁻¹², E=1,8·10⁵) trong khi đề ghi q=10⁻⁹, E=10⁵; #6 ghi "306" nhưng lời giải ra 69 J (mình tính nhanh: góc (P, d)=50° → ≈257 J); #46 ghi 17 N nhưng lời giải đang tính độ dài SA, không phải lực căng (mình tính: ≈22,6 N).
- **Đ2-I.3:** đáp án in "A" nhưng lời giải chép nhầm từ câu 2; AB+AC+AD = 3AG ⇒ đáp án đúng là **C**.
- **C8:** #36 đề thiếu GD (GA+GB+GC=0), #61 mất dữ kiện ("tam giác x=1,x=-3" do OCR), #23 đề viết "tứ diện ABCD" nhưng dùng điểm S; C9: #10 "A(3;0;01)" gõ sai, #41 hai phương án C, D cùng "18".
- E8#11–19, E9#49–50: công thức/đáp án mất (WMF/ảnh); E9#20, #49, #50 không có đáp án.
→ Khi dùng làm nguồn tạo câu: **chỉ lấy ý tưởng/khuôn đề, tính lại đáp án**.

---

## 2. Cấu trúc nguyên văn của tác giả (bài → lý thuyết → dạng → ví dụ)

### NBV8 — "Vectơ trong không gian" (tương ứng Bài 1 của chương)
- **A. LÝ THUYẾT VÀ VÍ DỤ**
  1. VECTƠ TRONG KHÔNG GIAN — định nghĩa (đoạn thẳng có hướng), độ dài, giá, cùng phương/cùng hướng/ngược hướng/bằng nhau, vectơ-không · **VD1** (tứ diện đều cạnh 1: đếm vectơ từ A, giá trong (ABC), độ dài), **VD2** (lăng trụ: vectơ bằng AA', điểm M' sao cho MM'=AA').
  2. TỔNG VÀ HIỆU HAI VECTƠ — a) tổng (quy tắc ba điểm, hình bình hành, tính chất giao hoán/kết hợp/+0, **quy tắc hình hộp** AB+AD+AA'=AC') · **VD3** (|BC+DD'| lập phương cạnh 1 = √2), **VD4** (CM AC+BD=AD+BC), **VD5** (CM BC+DC+AA'=AC' hộp); b) hiệu (vectơ đối, OB−OA=AB) · **VD6** (chóp đáy hbh: AM, CN đối nhau; SC−AM−AN=SA).
  3. TÍCH CỦA MỘT SỐ VỚI MỘT VECTƠ — định nghĩa, ĐK cùng phương a=kb, tính chất · **VD7** (lăng trụ: CC'=(−2)OM), **VD8** (tứ diện: AB+AC+AD=3AG; chú ý OA+OB+OC=3OG với O tuỳ ý).
  4. TÍCH VÔ HƯỚNG — a) góc giữa hai vectơ (lấy OA=a, OB=b; mẹo: gốc chung khi hai vectơ khác điểm đầu: lấy E sao cho AE=CD) · **VD9** (lập phương: góc (AD,B'C')=0°, (AC,A'D')=45°); b) tích vô hướng a·b=|a||b|cos(a,b), a⊥b⇔a·b=0, a²=|a|² · **VD10** (chóp tứ giác đều cạnh a: AS·BC=a²/2, AS·AC=a²), **VD11** (tứ diện AC,BD⊥AB, M,N trung điểm AB,CD: MN=½(AC+BD) và MN·AB=0).
- **B. TỰ LUẬN (41 câu)** — 4 dạng (tên nguyên văn):
  - Dạng 1. Chỉ ra các yếu tố của vectơ (B8#1–11, 11 câu)
  - Dạng 2. Chứng minh các đẳng thức về vectơ (B8#12–24, 13 câu)
  - Dạng 3. Ứng dụng của tích vô hướng (B8#25–34, 10 câu)
  - Dạng 4. Ứng dụng (B8#35–41, 7 câu)
- **C. BÀI TẬP TRẮC NGHIỆM (77)** · **D. TRẮC NGHIỆM ĐÚNG SAI (44)** · **E. TRẢ LỜI NGẮN (47)** — không chia dạng, trộn mọi nội dung.

### NBV9 — "Các phép toán vectơ / toạ độ" (Bài 2 + Bài 3)
- **A. LÝ THUYẾT** (không có ví dụ riêng "Dạng", chỉ VD gắn mục)
  I. TỌA ĐỘ CỦA MỘT ĐIỂM — hệ trục Oxyz, i,j,k, mặt phẳng toạ độ; toạ độ điểm qua hình chiếu lên (Oxy) rồi Oz, hoặc lên 3 trục · **VD1** (sân tennis: mặt sân thuộc (Oxy), Oz⊥mặt sân), **VD2** (hình chiếu A(4;5;3) lên 3 mặt phẳng toạ độ).
  II. TỌA ĐỘ CỦA MỘT VECTƠ — OM=(a;b;c)⇔M(a;b;c); u=ai+bj+ck; AB=(xB−xA;…) · **VD3** (OM, ON), **VD4** (A1A, A2A từ hình), **VD5** (OA, u theo i,j,k), **VD6** (hbh có 3 đỉnh: AB, tìm D).
  III. BIỂU THỨC TỌA ĐỘ PHÉP CỘNG/TRỪ/NHÂN SỐ — ĐK cùng phương · **VD7** (3a, 2a−b, a+2b−3/2c).
  IV. TỌA ĐỘ TRUNG ĐIỂM, TRỌNG TÂM TAM GIÁC · **VD8** (M trung điểm AB, G trọng tâm).
  V. BIỂU THỨC TOẠ ĐỘ CỦA TÍCH VÔ HƯỚNG — |a|, AB, ⊥, cos(u,v) · **VD9** (A,B,C không thẳng hàng; chu vi; cos ABC).
  VI. CÁCH TÌM TOẠ ĐỘ VECTƠ VUÔNG GÓC VỚI HAI VECTƠ CHO TRƯỚC — **tích có hướng** [u,v] bằng định thức 2×2 · **VD10** (u=(1;−2;3), v=(2;0;−3) ⇒ w=(6;9;4)).
- **B. BÀI TẬP TỰ LUẬN (51 câu)** — 3 dạng:
  - Dạng 1. Tìm toạ độ của điểm, tọa độ của vecto (B9#1–35, 35 câu)
  - Dạng 2. Tích vô hướng và các ứng dụng của tích vô hướng (B9#36–41, 6 câu)
  - Dạng 3. Ứng dụng (B9#42–51, 10 câu)
- **C (110) · D (43) · E (64)** — không chia dạng.

### NBV10 — hai đề ôn chương "ĐỀ ÔN TẬP VECTOR TRONG KHÔNG GIAN"
Mỗi đề: Phần I (12 TN nhiều lựa chọn) · Phần II (4 câu Đ–S × 4 ý) · Phần III (6 TLN; Đề 1 thêm "Câu Bonus"). Sau đề: Phiếu trả lời + Lời giải tham khảo.

---

## 3. Từng dạng của tác giả — phương pháp, ví dụ, KIỂU đề cụ thể

> Tác giả KHÔNG viết khung "phương pháp" riêng cho từng dạng; phần "phương pháp" dưới đây tóm từ lý thuyết A + cách lời giải của tác giả làm (ghi rõ khi là mình rút).

### 3.1 NBV8-B Dạng 1 — Chỉ ra các yếu tố của vectơ (11 câu: B8#1–11; 3 ví dụ SGK trước đó: VD1, VD2, VD6)
Phương pháp (rút từ lời giải): mặt bên của lăng trụ/hộp là hình bình hành ⇒ AA'=BB'=CC'… (vectơ bằng); vectơ đối = đảo đầu cuối; "giá nằm trong mp" = hai đầu mút cùng thuộc mp; độ dài vectơ = độ dài đoạn (Pythagore); tổng 3 vectơ chung gốc ở hộp = đường chéo (quy tắc hộp).
Kiểu:
- **1a** Liệt kê vectơ bằng / đối / cùng phương / có giá trong mp / có điểm đầu cho trước, từ các đỉnh lăng trụ-hộp-chóp — **6 câu** (B8#1, 2, 4, 5, 8, 9) — vd "Cho hình hộp ABCD.A'B'C'D'. Tìm các vectơ bằng BC" [NB].
- **1b** Biểu diễn AC', A'C, AD, BD' qua x=AA', y=AB, z=AD (hoặc z=AC) trong hình hộp — **2 câu** (B8#3, #7) [TH].
- **1c** Tính độ dài vectơ: hộp chữ nhật 1×1×2 (|BD|, |CD'|, |AC'|) và "cho AO=a, tính |AB+AD+AA'|, |C'B'+C'D'+A'A|" — **2 câu** (B8#6, #11) [TH].
- **1d** Rút gọn tổng/hiệu thành 1 vectơ (OA+AB−OC=CB; OA+OB+OC=OE bằng cách dựng hộp OADB.CFEK) — **1 câu** (B8#10) [TH].
Lệch SGK: nhãn (CD12) B8#1 viết "Là vectơ đối của BB" (thiếu dấu ' do OCR).

### 3.2 NBV8-B Dạng 2 — Chứng minh các đẳng thức về vectơ (13 câu: B8#12–24; ví dụ lý thuyết đi kèm: VD4, VD5, VD7, VD8)
Phương pháp: biến đổi vế trái về vế phải bằng quy tắc ba điểm / chèn điểm trung gian; với điểm đặc biệt: M trung điểm AB ⇒ MA+MB=0 (và OA+OB=2OM, ∀O); G trọng tâm ⇒ GA+GB+GC=0; chứng minh EF=… bằng cách viết EF theo hai đường vòng rồi cộng để triệt các cặp trung điểm; Thalès đảo khi có tỉ lệ 2/3.
Kiểu:
- **2a** Chứng minh đẳng thức bốn/năm điểm bất kỳ bằng quy tắc ba điểm (tứ diện: AC+BD=AD+BC; 5 điểm A,B,C,D,E; hộp: BB'−CA=AC'; hai hình bình hành bất kỳ ABCD, A'B'C'D' trong không gian: BB'+DD'=CC') — **5 câu** (B8#12, 15, 18, 20, 21) [TH].
- **2b** Điểm đặc biệt (trung điểm, trọng tâm): GA+GB+GC+GD=0 (G trung điểm MN, M,N trung điểm cạnh đối); EF=½(AB+DC); OA'+OB'+OC'+OD'=4OO'; A'C=3A'G (G trọng tâm AB'D' trong hộp) — **5 câu** (B8#13, 14, 19, 22, 23) [TH–VD].
- **2c** Biểu diễn EF với điểm chia tỉ lệ (AE=⅓AB, CF=⅓CD) hoặc E,F trọng tâm hai mặt (EF=⅔MN=⅓CD) — **2 câu** (B8#16, 17) [VD].
- **2d** cos²x+cos²y+cos²z=1 (góc giữa đường chéo hộp chữ nhật AC' với ba cạnh) — **1 câu** (B8#24) [VD].

### 3.3 NBV8-B Dạng 3 — Ứng dụng của tích vô hướng (10 câu: B8#25–34; VD9–VD11)
Phương pháp: dời vectơ về chung gốc (hình bình hành) để lấy góc: (AB,CD)=(AB,AE) với AE=CD; a·b=|a||b|cos; a⊥b ⇔ a·b=0; khi không biết góc → phân tích vectơ theo 3 cạnh chung gốc rồi khai triển. **Nhận xét của tác giả (B8 sau câu 27): "dùng tích vô hướng để chứng minh hai đường thẳng vuông góc".**
Kiểu:
- **3a** Tích vô hướng + góc trong lập phương/hộp cạnh a: A'B·D'C, D'A·BC, góc (A'D,B'C'), (AD',BD); AC·B'D', BD·B'C', A'B'·AC'; cạnh a√2 — **3 câu** (B8#25, #30, #32) [TH].
- **3b** Hộp có tất cả cạnh bằng a, ba góc ở đỉnh A đều 60° (hình hộp thoi): AB·AD, DA·DC, AA'·AC — **1 câu** (B8#34) [VD].
- **3c** Lăng trụ lục giác đều (cạnh 1) và lăng trụ đứng đáy hình thoi 60°: góc + tích vô hướng — **2 câu** (B8#26, #28) [TH–VD].
- **3d** Chứng minh vuông góc bằng tích vô hướng: AC=AD, BAC=BAD ⇒ AB⊥CD; SA=SB=SC & ba góc đỉnh bằng nhau ⇒ SA⊥BC, SB⊥AC, SC⊥AB — **2 câu** (B8#27, #31) [VD].
- **3e** Hai vectơ cho |a|=1, |b|=2, góc 45°: (a+b)², (a+b)(a−b), (2a−b)(a+3b) — **1 câu** (B8#29) [TH].
- **3f** Tứ diện có AB,AC,AD đôi một vuông góc (AB=AC=AD=1), M trung điểm BC: AM·BD và góc (AM,BD)=120° — **1 câu** (B8#33) [VD].

### 3.4 NBV8-B Dạng 4 — Ứng dụng (7 câu: B8#35–41)
Phương pháp: dịch bài toán thực tế sang vectơ: lực = vectơ; hợp lực = tổng vectơ; cân bằng ⇒ tổng lực căng = −trọng lực; công A = F·d = |F||d|cos.
Kiểu (mỗi câu một tình huống):
- **4a** Độ dịch chuyển thang máy tầng 10→26→18: hai vectơ cùng phương, ngược hướng, a=(−2)b — B8#35 [NB].
- **4b** Trọng lực chia đều cho 3 chân bàn: x=y=z=−⅓u — B8#36 [NB].
- **4c** Hợp lực ba lực (10 N, 8 N hợp 120°; lực thứ ba 6 N vuông góc mặt phẳng hai lực) ≈ 10,95 N — B8#37 [VD].
- **4d** Công của lực kéo tàu–xà lan (2000 N, 3 km, góc 30°) ≈ 5 196 152 J — B8#38 [TH].
- **4e** Lực căng cáp: khung nâng xe hình chóp S.ABCD (B8#39, ≈6255 N), khung sắt hình hộp 4 dây góc 60° (B8#40, tìm trọng lượng ô tô), **đèn tròn treo 3 dây: F(L)=8L/√(L²−324), khảo sát hàm số + tiệm cận, tìm L tối thiểu khi F≤10 N** (B8#41; câu duy nhất NBV8 chạm sang chương Hàm số/đạo hàm) — **3 câu** [VD–VDC].

### 3.5 NBV8-C — 77 trắc nghiệm (không chia dạng; kiểu do mình rút)
Số "mệnh đề sai" ≈ 16 câu; "điền k vào đẳng thức vectơ" 4 câu (C8#17, 21, 26, 28).
| Mã | Kiểu | Số câu | Câu | Đề mẫu |
|---|---|---|---|---|
| A | Khái niệm: đếm vectơ, vectơ bằng/chỉ phương, mệnh đề sai | 4 | 1, 2, 10, 15 | "Tứ diện ABCD: có bao nhiêu vectơ khác 0 mà đầu/cuối là đỉnh?" (A₄²=12) |
| B1 | Chọn đẳng thức đúng/sai bằng quy tắc hộp/ba điểm (hộp, lập phương, lăng trụ) | 10 | 6, 7, 13, 18, 22, 24, 26, 27, 35, 37 | "Hộp: BD−D'D−B'D'=k·BB', k=?" |
| B2 | Biểu diễn vectơ tới điểm đặc biệt trong hộp (tâm O, trung điểm, giao đường chéo mặt, K trung điểm CC1) | 5 | 16, 29, 33, 34, 63 | "AK = AB+AD+½AA1" |
| C1 | Trung điểm hai cạnh đối tứ diện / trung điểm đoạn nối: IJ=½(AC+BD), GA+GB+GC+GD=0, 2MN=… | 8 | 4, 8, 12, 20, 21, 28, 30, 32 | "PI=k(PA+PB+PC+PD), I trung điểm MN" (k=¼) |
| C2 | Đẳng thức bốn điểm / đáy hình bình hành (SA+SC=SB+SD; OA+OC=OB+OD; G thoả GS+GA+…=0) | 5 | 5, 9, 14, 19, 25 | "Chóp đáy hbh: khẳng định đúng?" |
| C3 | Trọng tâm tam giác/tứ diện: SA+SB+SC=3SG; DA+DB+DC=kDG; AG=¼(AB+AC+AD); G0 | 6 | 3, 11, 17, 23, 31, 36 | "G trọng tâm tứ diện: GA=3G0G" |
| D | Phân tích (biểu diễn) vectơ qua 3 vectơ cơ sở trong lăng trụ/tứ diện (B'C, BC', MP, DM, AG, IG, MG) | 9 | 38, 39, 40, 41, 42, 59, 60, 62, 65 | "Lăng trụ, I∈CC', G: GB+GA'+GB'+GC'=0, biểu diễn IG" [VD] |
| **E** | **Ba vectơ ĐỒNG PHẲNG** (nhận biết bộ ba, tìm k để đồng phẳng, điều kiện m+n+p, a,b,c không đồng phẳng) | **14** | 43–50, 64, 66–70 | "Tứ diện: bộ ba vectơ nào đồng phẳng?" ; "MN,AD,BC đồng phẳng ⇒ k=?" |
| F1 | Cặp cạnh đối vuông góc / góc 90° từ giả thiết cạnh bằng nhau | 4 | 51, 52, 54, 56 | "Tứ diện có ABC, ABD đều: góc (AB,CD)" (90°) |
| F2 | Góc giữa hai vectơ trong lập phương/hộp | 2 | 53, 72 | "cos(BD,A'C')" (=0) |
| F3 | Tích vô hướng/cosin trong tứ diện đều, chóp đều/chóp cạnh bằng nhau | 3 | 55, 76, 77 | "MS·CB, M trung điểm CD, chóp tất cả cạnh a" (=−a²/2) |
| F4 | Góc/cos trong chóp tam diện vuông O.ABC và lăng trụ đều/lăng trụ có mặt đều | 4 | 71, 73, 74, 75 | "cos(AB',BC') lăng trụ đều cạnh a" (¼) |
| G | Vật lý: lực hấp dẫn P=mg (táo 102 g); hợp lực ba lực vuông góc đôi một | 2 | 57, 58 | "10 N, 8 N, 5 N vuông góc ⇒ ≈13,7 N" |
| H | Phân giác tam giác phẳng: AD=(5/7)AB+(2/7)AC (AB=2, AC=5) — lớp 10 | 1 | 61 | (đề hỏng OCR) |
(77 = 4+10+5+8+5+6+9+14+4+2+3+4+2+1 ✓.)

### 3.6 NBV8-D — 44 câu Đ–S (176 ý)
Tác giả KHÔNG chia dạng. Kiểu (mình rút):
| Mã | Kiểu | Câu | Số |
|---|---|---|---|
| A | Khái niệm vectơ trong chóp/hộp (bằng nhau, cùng phương, giá nằm trong mp, đếm vectơ) | 1, 2 | 2 |
| B | Đẳng thức vectơ (quy tắc hộp, ba điểm, trung điểm, trọng tâm; tứ diện M,N,I,G; chóp đáy hbh; "nếu ABCD là hình bình hành thì … và ngược lại"; điều kiện hình thang SB+2SD=SA+2SC) | 7, 8, 18, 19, 21–29, 31 | 14 |
| C | Biểu diễn vectơ qua cơ sở (hộp x,y,z; tứ diện a,b,c; lăng trụ trọng tâm G,G', giao I) | 11, 30, 32, 33, 34 | 5 |
| D | Độ dài tổng/hiệu vectơ (chóp tứ giác đều: |SA+SB−SC−SD|=2a√2; hộp chữ nhật) | 9, 10 | 2 |
| E1 | Tứ diện/chóp: cạnh vuông đôi một hoặc cạnh bằng nhau; góc + tích vô hướng nhiều ý | 3, 16, 17, 36, 38, 39, 41, 42, 44 | 9 |
| E2 | Lập phương/hộp/lăng trụ: tích vô hướng, độ dài, góc, cosα (có M,N,P trung điểm) | 4, 5, 12, 14, 15, 20, 37, 40, 43 | 9 |
| E3 | Hai vectơ cho độ dài + góc (a·b, (a+b)², |a+2b|) | 13, 35 | 2 |
| F | Lẫn kiến thức ngoài chương (hộp chữ nhật: thể tích, góc nhị diện, khoảng cách giữa BD và CD' — D8#6) | 6 | 1 |
(Tổng 2+14+5+2+9+9+2+1 = 44 ✓.) D8#36 = VD10 của phần lý thuyết (đổi ý); D8#10–15 = SGK B8#6, 7, 28, 29, 30, 25; D8#15d sửa góc (AD',BD) thành 120° để làm ý SAI (đúng là 60°).

### 3.7 NBV8-E — 47 trả lời ngắn
| Mã | Kiểu | Câu | Số |
|---|---|---|---|
| E1 | Biểu diễn vectơ + tính tổng hệ số (tứ diện/lăng trụ/hai hbh; "12a−3b+6c", "m+n+p", "α+β") | 7, 8, 9, 10, 34 | 5 |
| E2 | Độ dài vectơ/đoạn bằng quy tắc hộp hoặc bình phương vô hướng (hộp chữ nhật, hộp thoi 60°, tứ diện đều, chóp) | 21, 23, 25, 26, 27 | 5 |
| E3 | Góc / tích vô hướng cụ thể (lập phương, M,N trung điểm A'D', C'D') | 30, 31 | 2 |
| E4 | **Cực trị tổng bình phương khoảng cách** P=3MA²+MB²+MC²+MD² (tứ diện đều), P=MS²+MA²+…+MD² (chóp đều) — dùng trọng tâm có trọng số | 28, 29 | 2 |
| E5 | **Hợp lực** của 3 lực (đôi một 60°; 120°+vuông góc; 100°+vuông góc ×2; 110° ×2; ba lực MA,MB,MC cân bằng) | 17, 20, 22, 32, 35, 36, 41, 45 | 8 |
| E6 | **Lực căng dây/xích/cáp** ở trạng thái cân bằng (khung sắt hình hộp, đèn chùm 4 xích, thùng hàng 4 dây, 3 dây 90°, đèn trang trí 3 dây, giá ba chân, giỏ hoa, cân đòn, treo 3 dây vuông góc) | 15, 16, 19, 33, 37, 38, 39, 40, 42, 43, 44, 46, 47 | 13 |
| E7 | Vật lý một công thức: P=mg, F=qE, F=ma, công A=F·d (xe dốc, trượt cầu thang, lực tĩnh điện) | 1, 2, 4, 5, 6, 18 | 6 |
| E8 | Hình học thực tế: tâm khối rubik tứ diện đều (AI=3IG), góc liên kết phân tử CH₄ (≈109°, tứ diện đều + trọng tâm) | 3, 24 | 2 |
| E9 | Đề mất công thức/số liệu (WMF): "tứ diện đều… trung điểm… bằng bao nhiêu", "hộp… tỉ số", "lập phương… giá trị" | 11, 12, 13, 14 | 4 |
(47 = 5+5+2+2+8+13+6+2+4 ✓.) **E5+E6+E7 = 27/47 câu (57%) là bài lực/vật lý.**

### 3.8 NBV9-B Dạng 1 — Tìm toạ độ của điểm, toạ độ của vectơ (35 câu: B9#1–35)
Phương pháp (lý thuyết A9): AB=B−A; trung điểm, trọng tâm theo trung bình toạ độ; hbh ABCD ⇔ AB=DC; a=b ⇔ ba toạ độ bằng nhau; a∥b ⇔ a=kb; u·v=x₁x₂+y₁y₂+z₁z₂; |a|=√(x²+y²+z²); cos=u·v/(|u||v|); vectơ vuông góc cả hai = [u,v].
Kiểu:
- **1a** Lập/mô tả hệ toạ độ gắn vào hình (có/không lập được hệ thoả điều kiện cho trước; chóp tứ giác đều đặt O ở tâm đáy) — **3** (B9#1, 13, 14) [TH].
- **1b** Hình chiếu của điểm lên mặt phẳng toạ độ/trục; đối xứng qua mặt phẳng toạ độ; điểm trên tia/ góc phần tư cho khoảng cách — **4** (B9#2, 3, 12, 15) [NB].
- **1c** Tìm toạ độ đỉnh còn lại của hộp/lăng trụ/tứ diện/hình bình hành từ vài đỉnh (hbh OABD; tứ diện OABC cho G và AB, AC; hộp biết A,B,C,D'; lăng trụ OAB.O'A'B' có O'∈Ox; lập phương gắn hệ) — **8** (B9#4, 9, 10, 11, 16, 20, 24, 34) [TH–VD].
- **1d** Trung điểm / trọng tâm → tìm điểm (P để N là trung điểm MP; C biết G; G∈DI với DG=3IG; công thức trọng tâm tứ diện — chứng minh) — **6** (B9#5, 6, 8, 17, 18, 19) [TH].
- **1e** Chứng minh ba điểm thẳng hàng — **1** (B9#7).
- **1f** Tìm toạ độ vectơ AB rồi suy ra đường thẳng // trục (AB=(9;0;0) ⇒ AB∥Ox; OC=3k ⇒ C∈tia Oz) — **2** (B9#21, 33).
- **1g** Độ dài OA; điểm M trên Ox có hoành độ dương sao cho AM=BC — **2** (B9#22, 31).
- **1h** Phép toán vectơ bằng toạ độ (4a, 3a+b, 2a+3b−½c; u=2a+b−3c; v+2b=a+c; viết a=2i+3j−5k) — **3** (B9#23, 25, 32) [NB].
- **1i** Vectơ vuông góc với hai vectơ cho trước bằng **tích có hướng** (cả khi cho qua điểm của hộp: AC và B'D', AC và BD) — **3** (B9#26, 27, 28) [TH].
- **1j** Tam giác trong toạ độ: không thẳng hàng, chu vi, cos góc / số đo góc (làm tròn 0,1°) — **2** (B9#29, 30) [TH] (thực chất dùng tích vô hướng).
- **1k** Tìm tham số m theo điều kiện (a+b cho trước, a·b=−8, |b|=6) — **1** (B9#35).
(35 = 3+4+8+6+1+2+2+3+3+2+1 ✓.)

### 3.9 NBV9-B Dạng 2 — Tích vô hướng và các ứng dụng (6 câu: B9#36–41)
- **2a** cos(a,b) từ toạ độ — B9#36 [NB].
- **2b** Tam giác trong toạ độ: không thẳng hàng + chu vi + số đo góc (B9#37); tam giác OMN cân nhưng không đều + các góc (B9#38); "giải tam giác ABC" (B9#41) — **3** [TH].
- **2c** Nhiều phép toán + tích vô hướng + cos (B9#39) — **1**; tham số m (a−2b=…, a·b=10, |a|=9) (B9#40) — **1**.

### 3.10 NBV9-B Dạng 3 — Ứng dụng (10 câu: B9#42–51)
- **3a** Lập hệ toạ độ từ mô tả thực tế rồi tính khoảng cách: cột cờ vuông góc mặt sân (B9#47), hai đèn trong góc phòng (B9#49, có chú ý "khoảng cách không phụ thuộc cách chọn hệ"), hai cột 3 m/2 m trên sân (B9#50), dây giữa hai bức tường (B9#51) — **4** [TH].
- **3b** Mô hình hệ trục cho sẵn: camera sân bóng 4 cột cao 30 m, K₀ cách đều 4 đỉnh cột, hạ xuống K₁ cao độ 19 (B9#42); vectơ dịch chuyển máy bay không người lái (nam/đông/độ cao) (B9#43); radar không lưu phạm vi 500 km (B9#45); tàu ngầm có z≤0 (B9#48) — **4** [TH–VD].
- **3c** Lực/vật treo: vật 300 N treo 3 dây P,Q,R,S → toạ độ ba lực căng (B9#44); đèn chùm 160 N, 4 xích, SA=80√2 cm, ASC=90° → toạ độ 4 lực (B9#46) — **2** [VD].

### 3.11 NBV9-C — 110 trắc nghiệm (đều toạ độ Oxyz; 108/110 nhãn 2025)
Gần như TOÀN BỘ là câu nhận biết/thông hiểu 1 bước. Kiểu (do mình rút):
| Mã | Kiểu | Số | Câu |
|---|---|---|---|
| G1 | Đổi giữa biểu diễn theo i,j,k và toạ độ (u=2i−3j+4k ⇒ (2;−3;4); OA=6j+4i−3k; OA=−i+k, OB=… ⇒ AB) | 18 | 9, 25, 26, 31, 39, 42, 56, 58, 69, 83–86, 88, 91, 92, 108, 110 |
| G2 | Toạ độ AB từ hai điểm / điểm từ vectơ (MO; AC cho trước ⇒ C; v=MN ⇒ N) | 10 | 1, 3, 5, 13, 16, 57, 59, 78, 80, 99 |
| G3 | Phép toán tuyến tính trên vectơ toạ độ (a+2b; 2a+3b−2c; a−b+2c; u−v …) | 12 | 4, 14, 27, 44, 51, 53, 64, 67, 76, 79, 102, 109 |
| G4 | Tìm điểm thoả đẳng thức vectơ / hình bình hành (OM=2AB−AC; CE=2EB; ABCD hbh; ABCM) | 8 | 7, 15, 36, 50, 55, 89, 94, 96 |
| G5 | Trung điểm / trọng tâm | 11 | 21, 23, 32, 46, 49, 52, 62, 66, 70, 74, 104 |
| G6 | Độ dài đoạn AB, |a|, |AB+2AC| | 9 | 10, 12, 18, 35, 37, 54, 72, 77, 103 |
| G7 | Hình chiếu vuông góc lên mặt phẳng/trục toạ độ (cả MM' ngắn nhất, vectơ MM') | 11 | 2, 6, 17, 22, 34, 43, 60, 75, 81, 82, 100 |
| G8 | Điểm đối xứng qua trục / qua một điểm rồi tính độ dài | 3 | 11, 30, 87 |
| G9 | Tích vô hướng a·b (từ toạ độ hoặc i,j,k) | 10 | 33, 41, 47, 63, 65, 71, 73, 95, 101, 105 |
| G10 | Góc / cosin giữa hai vectơ | 5 | 19, 20, 28, 45, 61 |
| G11 | Mệnh đề tổng quát về toạ độ (công thức k·a, |a|, a⊥b …) | 2 | 8, 48 |
| G12 | Điểm M thuộc (Oxy)… sao cho A,B,M thẳng hàng | 3 | 40, 68, 97 |
| G13 | Chân đường phân giác trong góc B | 1 | 24 |
| G14 | Chu vi tam giác; tìm m để tam giác vuông tại N | 2 | 90, 93 |
| G15 | Hộp/lập phương/phòng học gắn hệ trục | 3 | 29, 38, 98 |
| G16 | Vectơ pháp tuyến của mp Oxy (k); vectơ vuông góc a,b (tích có hướng) | 2 | 106, 107 |
(110 ✓.) Quan trọng: **C9 không có hình học thuần**, và hầu hết câu chỉ 1 bước ⇒ đủ làm "ngân hàng ĐỌC toạ độ cơ bản".

### 3.12 NBV9-D — 43 câu Đ–S (172 ý)
| Mã | Kiểu | Số | Câu |
|---|---|---|---|
| D1 | Hình học vectơ thuần (không hệ trục: BD·B'C', DO, góc (DA',AC)) | 1 | 1 |
| D2 | Tam giác/tứ diện cho toạ độ điểm: ý a–c cơ bản (trọng tâm, AB, hbh, chu vi, tam giác tù/vuông, chân phân giác, hình chiếu) + **ý d thường là cực trị M∈mp toạ độ hoặc giao đường thẳng với mp toạ độ** | 16 | 2, 3, 6, 11–19, 21, 23, 24, 25 |
| D3 | Đa diện gắn hệ trục (lập phương/hộp/chóp đều/lăng trụ; ý khó: tâm nội tiếp, hình chiếu lên (SCD), sin góc, MN ngắn nhất) | 7 | 4, 5, 8, 9, 10, 20, 22 |
| D4 | **Mô hình nhà/kho/phòng** (hộp chữ nhật + lăng trụ đứng, mái, góc nhị diện, dây cáp ngắn nhất O→E→H→camera, tiền lợp tôn) | 8 | 7, 26, 29, 35, 38, 39, 40, 41 |
| D5 | **Chuyển động thẳng đều** (máy bay, cabin cáp treo, tên lửa, flycam; vận tốc, vị trí sau t, gió) | 7 | 27, 28, 30, 33, 36, 37, 43 |
| D6 | Radar/phạm vi phát hiện + khoảng cách (tháp không lưu 600 km/500 km, hai drone, giàn khoan) | 4 | 31, 32, 34, 42 |
(1+16+7+8+7+4 = 43 ✓.) Có **cặp lặp: D9#3=#19, #29=#40**.

### 3.13 NBV9-E — 64 trả lời ngắn
| Mã | Kiểu | Số | Câu |
|---|---|---|---|
| A | Tìm đỉnh theo điều kiện vectơ (hbh; AD−AB−2AC=0; hộp biết A,B,D,A') | 3 | 2, 14, 19 |
| B | A,B,M thẳng hàng với M∈(Oxy) | 1 | 1 |
| **C** | **Cực trị M∈mặt phẳng toạ độ**: min |MA+2MB−CM|, min MA²+2MB²−MC², max tỉ số (MA/MD)²…, min MA+MB (đối xứng qua mp), min MA·MB+3MB·MC+4MC·MA, min MA²+MB², M,N∈(Oxy) MN=4 | 9 | 3, 4, 5, 8, 12, 13, 15, 17, 18 |
| D | Tâm ngoại tiếp OI², trực tâm H ⇒ quỹ tích đường tròn, hệ MA,MB,MC,MD ⇒ OM (GPS), chân phân giác | 5 | 6, 7, 9, 20, 21 |
| E | Cực trị hình học khác (IN⊥OM & diện tích IMO=8: IN max; thể tích OABC max với |a|+|b|=4) | 2 | 10, 16 |
| F | Vectơ thuần: |a|=1, |b|=2, |a−2b|=√15, (u,v)=60° ⇒ k | 1 | 11 |
| **G** | **Chuyển động thẳng đều**: vị trí/thời gian/quãng (cabin 3 phút x=550; radar A→B 10 phút ⇒ sau 5/10 phút; điểm gần đài nhất; tên lửa 500 m/s; hai tàu/ hai máy bay khoảng cách nhỏ nhất) | 13 | 24, 25, 30, 31, 36, 39, 41, 53–57, 59 |
| H | Hai vật (khinh khí cầu/drone/flycam) + người quan sát trên mặt đất: tổng khoảng cách min (đối xứng qua (Oxy)) | 5 | 26, 33, 50, 60, 61 |
| I | Toạ độ từ mô tả ("cách … về phía Bắc/Tây, cao …") + khoảng cách đơn giản | 5 | 22, 38, 43, 46, 47 |
| J | Vùng phủ sóng hình cầu (wifi/5G), thiên thạch vào khí quyển, tọa độ cầu Trái Đất | 4 | 44, 45, 58, 63 |
| K | Mô hình nhà/công trình (F ngôi nhà, góc dốc mái 26,6°, kim tự tháp trên trụ, nhà sàn, sân trường 4 điểm đồng phẳng) | 7 | 23, 27, 32, 34, 35, 48, 52 |
| L | Lực: giỏ/tấm bảng treo 4 dây (m=15 kg), máy quay ba chân (61,2 N) | 3 | 42, 62, 64 |
| M | Lẻ: bể cá phản xạ (G→đáy→M), cáp xe kéo, cẩu trục tháp, máng trượt cung tròn, vệ tinh, dây dọi → góc đáy bể | 6 | 28, 29, 37, 40, 49, 51 |
(3+1+9+5+2+1+13+5+5+4+7+3+6 = 64 ✓.) **Ứng dụng thực tế = C..M trừ A–F ≈ 43/64 câu (67%).**

### 3.14 NBV10 — hai đề ôn chương
**Đề 1 (23 câu)**
- Phần I (12 TN): vectơ hình học 5 (I.1 SA+SB+SC+SD=4SO; I.4 AB+CD; I.5 |AC+C'D'|; I.7 BD' theo a,b,c; I.10 a·b khi cùng hướng) · toạ độ 7 (I.2 OM,ON theo i,j,k ⇒ MN; I.3 tâm hộp từ A,B,D,C'; I.6 AM=u; I.8 u=i−3k; I.9, I.12 tích vô hướng; I.11 u=2a+3b−2c).
- Phần II (4 Đ–S): II.1 tứ diện AB,AC,AD đôi một vuông góc (=D8#3); II.2 tam giác ABC toạ độ (G, AB, hbh D, M thuộc AB với MA=2MB); II.3 hộp biết A,B,D,D' (AB, C, A', G); II.4 nhà kho OABC (=D9#41).
- Phần III (6 TLN + Bonus): III.1 tham số m để góc (u,v)=45° (đáp −0,45 — có điều kiện 1−2m≥0); III.2 radar giàn khoan, tàu (25;15;0) ⇒ 29,2 km; III.3 A,B,C thẳng hàng ⇒ 2a+b=21; III.4 chân đường cao H trên BC ⇒ P=17(a+b+c)=41; III.5 hai khinh khí cầu + người quan sát (5,1); III.6 máy quay ba chân ⇒ 12√26≈61,2; **Bonus** đèn tròn F(L) tìm L tối thiểu (=B8#41, cần hàm số).
**Đề 2 (22 câu)**
- Phần I (12 TN): vectơ hình học 5 (I.1 AI cùng hướng; I.2 AA'+AD=AD'; I.3 AB+AC+AD=3AG [đáp án in sai]; I.4 2MN=B'D'; I.5 tứ diện đều AB·CA=−2) · toạ độ 7 (I.6 |a|; I.7 a+b; I.8 3a; **I.9 [b,a] tích có hướng**; I.10 c=a+b; I.11 c=xa+yb; I.12 d=xa+yb+zc — giải hệ).
- Phần II (4 Đ–S): II.1 tứ diện M,N,I,G (≈D8#18); II.2 vectơ a,b,c,d (2a, **d=[a,b]**, a+2b, c=2a−3b); II.3 A,B,C (AB, khoảng cách A đến (Oyz), hình thang AB=2CD tìm D, BC cắt (Oxy) tỉ số IB/IC); II.4 chóp S.ABCD SA⊥đáy (=D9#8: C, diện tích SCD, hình chiếu A lên (SCD), sin góc SC–(SBD) — dùng pháp tuyến).
- Phần III (6 TLN): III.1 |a|=7; III.2 góc hai vectơ vận tốc máy bay (7,5°); III.3 góc đường bay–mặt đất (9,69°); III.4 quạt trần phòng học 10×7,2×3,3 (11,1); III.5 hai khinh khí cầu (5,1 — trùng E9#61); III.6 **mặt phẳng (P) qua A(2;0;0), M(1;1;1) cắt tia Oy, Oz — diện tích ABC nhỏ nhất (9,8)** (cần phương trình mặt phẳng, **ngoài chương**).
Đếm theo phần/kiểu (2 đề gộp, 45 câu): TN 24 = vectơ hình học 10 + toạ độ 14; Đ–S 8 = vectơ hình học thuần 2 (Đ1-II.1, Đ2-II.1) + toạ độ 5 (Đ1-II.2, II.3; Đ2-II.2, II.3, II.4) + nhà kho 1 (Đ1-II.4); TLN 13 = tham số/điểm hình học 4 (Đ1-III.1, 3, 4; Đ2-III.1) + chuyển động/radar/khoảng cách/góc 5 (Đ1-III.2, III.5; Đ2-III.2, III.3, III.5) + lực 1 (Đ1-III.6) + hàm số 1 (Bonus) + phòng học 1 (Đ2-III.4) + mặt phẳng 1 (Đ2-III.6).

---

## 4. Bẫy / chú ý / mẹo tác giả nhấn (ghi nguồn)

Từ A8: (1) vectơ-không cùng hướng với MỌI vectơ; hai vectơ-không bằng nhau (A8 §1) · (2) **quy tắc ba điểm, hình bình hành, hình hộp vẫn đúng trong không gian** (A8 §2) · (3) giữ quy ước "góc giữa vectơ bất kỳ và 0 tuỳ ý 0°–180°" (A8 §4) · (4) **muốn xác định góc (AB,CD) lấy E với AE=CD ⇒ (AB,CD)=BAE** (A8 §4a) · (5) a²=|a|²; a⊥b⇔a·b=0; cos(a,b)=a·b/(|a||b|) (A8 §4b) · (6) **trọng tâm tam giác: OA+OB+OC=3OG với O tuỳ ý** (chú ý sau VD8) · (7) **"dùng tích vô hướng để chứng minh hai đường thẳng vuông góc"** (nhận xét sau B8#27).
Từ A9: (8) toạ độ điểm duy nhất; xác định bằng hình chiếu lên (Oxy) rồi Oz **hoặc** lên 3 trục (A9 §I) · (9) hình chiếu lên mp toạ độ: giữ hai toạ độ, toạ độ còn lại =0 (VD2) · (10) vectơ đơn vị i=(1;0;0), j=(0;1;0), k=(0;0;1) · (11) hai vectơ không cùng phương ⇔ [u,v]≠0 (nhận xét A9 §VI) · (12) **toạ độ của đèn phụ thuộc cách chọn hệ, khoảng cách thì KHÔNG** (chú ý sau B9#49) · (13) quy ước định thức 2×2 | a b ; c d | = ad−bc.
Từ lời giải (mẹo hay lặp, mình rút): (14) hộp biết 4 đỉnh: dùng hbh nhiều lần ⇒ AB=DC=A'B'… (B9#4, B9#11) · (15) **cực trị M∈mp toạ độ: chọn điểm I sao cho Σk_i·IA_i=0 (tổng hệ số khác 0) ⇒ Σk_i·MA_i² = (Σk_i)·MI² + const; M = hình chiếu I** (E9#3, 4, 13, 17; D9 ý d nhiều câu) · (16) **min MA+MB, A,B cùng phía mp: lấy đối xứng A qua mp; khác phía: nối thẳng** (E9#12, E9#26, 33, 50, 60, 61) · (17) **cân bằng lực: ΣF_i=−P; các lực căng đối xứng ⇒ 4|SO|=P hoặc F·3·cosα=P** (B8#39–41, E8, E9#64) · (18) "ba lực/hợp lực": cộng hai lực trong mặt phẳng bằng định lý hàm cos rồi cộng với lực vuông góc bằng Pythagore (B8#37, E8#17–41) · (19) chuyển động đều: v=AB/Δt, vị trí sau t = A + (t/Δt)·AB (E9#25 …).
Điểm "bẫy" trong chính nguồn: mệnh đề SAI bằng cách đảo dấu/đổi vectơ (C8 ≈16 câu; D8#15d); nhầm vectơ đối với vectơ bằng (AB và CD trong hình lập phương — C8#2, D8#1d); phân biệt "giá nằm trong mp" với "cùng phương" (D8#1b–c); điều kiện nghiệm khi giải bằng bình phương (Đ1-III.1: 1−2m≥0).

---

## 5. Điểm CHỒNG và KHÁC

**Chồng giữa các tệp/dạng (cùng một kiểu xuất hiện nhiều nơi):**
- **Đẳng thức vectơ trong tứ diện/hộp** (quy tắc ba điểm/hộp/trung điểm/trọng tâm): có ở A8 VD4–8, B8 Dạng 2 (13), C8 (B1+B2+C1+C2+C3 = 34), D8 (B+C = 19), E8 E1 (5), Đ1/Đ2 Phần I-II. → kiểu nặng nhất của toàn NBV8.
- **Tích vô hướng + góc hình học**: B8 Dạng 3 (10), C8 F (13), D8 E (20), E8 E3 (2), A8 VD9–11.
- **Trọng tâm tứ diện / trung điểm hai cạnh đối** xuất hiện ở cả bài 1 (C8 C1/C3) lẫn bài 3 (B9#18, #19, công thức toạ độ trọng tâm tứ diện).
- **"Hộp gắn hệ trục"** là cầu nối Bài 1 ↔ Bài 2: B9#4, 11, 16, 20; D9 D3; Đ1-I.3, II.3.
- **Tam giác trong toạ độ (trọng tâm, hbh, chu vi, cos, chân phân giác)** lặp ở B9 Dạng 1/2, C9, D9 D2, E9 D, Đ1-II.2.
- **Lực** xuất hiện ở NBV8-B Dạng 4, C8 G, E8 E5–E7 (27 câu), B9#44, 46, E9 L, Đ1-III.6/Bonus.
**Kiểu chỉ có ở NBV (so với các bộ khác — cần người thiết kế đối chiếu):**
- **Ba vectơ ĐỒNG PHẲNG** (C8: 14 câu, kèm điều kiện m+n+p / "tìm k để đồng phẳng") — nằm ngoài khuôn SGK 2018 (không có trong B/D/E, không có trong NBV9); đề thi 2025 không ra → khả năng là câu thừa từ chương trình cũ.
- Phân giác tam giác phẳng AD=(5/7)AB+(2/7)AC (C8#61) — lớp 10; điền hệ số k (C8: 4 câu).
- **Cực trị M∈mặt phẳng toạ độ / tổng bình phương có trọng số** (E9: 9 + E8: 2 + D9: ý d của ~9 câu) — mức VDC theo khuôn đề thi 2025.
- **Chuyển động thẳng đều + radar + khinh khí cầu** (E9: 13 + 5 + 4; D9: 7 + 4) — nhóm ứng dụng nặng nhất NBV9.
- **Khung ngôi nhà/nhà kho** có sơ đồ toạ độ (D9: 8; E9: 7; Đ1-II.4) — kèm "góc nhị diện", "dây cáp ngắn nhất O→E→H→camera" (ra ngoài chương).
- Tích có hướng: B9#26–28 (3), C9#107, Đ2-I.9, Đ2-II.2b — **ít** (mới 5–7 câu).
**Nội dung nằm NGOÀI chương (phải loại/để bài khác):** thể tích, góc nhị diện, khoảng cách hai đường thẳng chéo nhau (D8#6, D9#8, #20, #22, #23, #26, #29, #35, #39, #40, E9#27); phương trình mặt phẳng và góc đường–mặt (Đ2-III.6, D9#8d, E9#51–52, Đ2-III.3 chỉ dùng góc đường–mp phẳng toạ độ); khảo sát hàm F(L) (B8#41).
**Khác nhau giữa NBV8 và NBV9:** NBV8 = hình học thuần + vật lý (209 câu, ~17% là bài lực/công: B 7 + C 2 + E 27 = 36); NBV9 = 100% toạ độ, 2/3 câu TLN là mô hình thực tế/cực trị.

---

## 6. Nhận xét cho người thiết kế

**Kiểu nặng nhất về số câu**
- NBV8: đẳng thức vectơ trong tứ diện/hộp (≈ 70 câu qua B,C,D,E: B8 13 + C8 34 + D8 19 + E8 5), tích vô hướng + góc hình học (B8 10 + C8 13 + D8 20 + E8 2 ≈ 45), đồng phẳng (C8 14, một mình), lực/hợp lực/lực căng (E8 27 + B8 4 + C8 2).
- NBV9: đọc toạ độ cơ bản — i,j,k↔toạ độ, AB, a+2b, hình chiếu, trung điểm/trọng tâm, độ dài, tích vô hướng, cos (C9: ~100/110 câu); ứng dụng chuyển động/radar/khinh khí cầu (E9: G 13 + H 5 = 18 câu); cực trị M∈mp toạ độ (E9 9).
**Kiểu chỉ 1–2 câu (cân nhắc gộp vào dạng khác hoặc để tuỳ chọn):** C8#1 (đếm vectơ bằng chỉnh hợp), C8#10 (vectơ chỉ phương), C8#61 (phân giác tam giác phẳng), C9#24 (chân phân giác trong), C9#106 (vectơ pháp tuyến mp Oxy), C9#11/#30 (đối xứng qua trục), B8#24 (cos²), B8#35–36 (thang máy, trọng lực bàn), B8#41 (hàm F(L)), B9#7, B9#19 (CM công thức toạ độ trọng tâm tứ diện), B9#42, E8#3, #24 (rubik, CH₄), E9#16, #44 (toạ độ cầu Trái Đất), E9#45 (thiên thạch), E9#51 (bể nước nghiêng), Đ2-III.6.
**Kiểu CẦN HÌNH 3D (hình hộp, chóp, lăng trụ…):** toàn bộ B8 D1–D3 (34 câu: hộp, lăng trụ, chóp, tứ diện), C8 (hầu hết 77 câu — hộp/tứ diện/chóp; riêng #1, #49, #57–58, #61 không cần), D8 (44/44 có hình), E8 E1–E4 (14 câu), D9 D3–D4 (15 câu), B9 1c + 1a (11 câu: lập hệ gắn hình), D9#26/#29/#35/#39/#40/#41 (nhà kho: lăng trụ đứng gắn Oxyz), Đ1-II.4, B9#44/46 (khung cáp). Với kiểu **"hộp gắn hệ trục"** nên dựng bản đồ có sẵn toạ độ ở đỉnh để HS đọc.
**Kiểu liên quan thực tế (lực, vận tốc, cáp, radar, toạ độ máy bay):**
- Lực/hợp lực/công/lực căng: B8 D4 (7) + C8 G (2) + E8 E5–E7 (27) + B9#44, 46 (2) + E9 L (3) + Đ1-III.6/Bonus (2) ≈ **43 câu**.
- Chuyển động thẳng đều, radar, khinh khí cầu, khoảng cách trong không gian: B9 D3 (b+c ≈ 6) + D9 D5+D6 (11) + E9 G+H+I+J (27) + Đ1-III.2/III.5, Đ2-III.2/III.3/III.5 ≈ **50 câu**.
- Mô hình nhà/kho/phòng/sân: B9 3a (4) + D9 D4 (8) + E9 K (7) + Đ1-II.4, Đ2-III.4 ≈ **21 câu**.
- Gợi ý chuyển thành "chủ đề nhóm": (i) Lực & cân bằng (đối xứng ⇒ tổng = trọng lực), (ii) Chuyển động thẳng đều & radar, (iii) Hai vật + quan sát trên mặt đất (đối xứng qua (Oxy)), (iv) Mô hình công trình (lập hệ rồi lấy toạ độ).
**Độ khó (mình ước):** C9 gần như toàn [NB–TH]; E9#1–#20 [VD], #21–#64 phần lớn [VD]; cực trị M∈mp toạ độ + tổng bình phương có trọng số + tỉ số + quỹ tích trực tâm [VDC] (E9#3–5, 7, 8, 10, 13, 15, 18, D9 ý d). NBV8-B Dạng 2, 3 [TH–VD]; C8 đồng phẳng/biểu diễn nhiều bước [VD].
**Lưu ý cho việc tạo dạng/cụm:**
1. Phần NBV9 không phân biệt Bài 2 (toạ độ) và Bài 3 (biểu thức toạ độ phép toán) — hai bài này đang gộp; nên tách theo lý thuyết A9: §I–II (Bài 2), §III–VI (Bài 3).
2. Dạng "Tìm toạ độ điểm/vectơ" (NBV9 Dạng 1) quá rộng (35 câu, 11 kiểu): nên chẻ ít nhất thành {lập hệ + hình chiếu + đối xứng}, {điểm từ trung điểm/trọng tâm/hbh/hộp}, {phép toán vectơ}, {tích có hướng}, {độ dài/góc/tam giác}.
3. Với NBV8, sách để "Dạng 4. Ứng dụng" riêng 7 câu nhưng phần C/E chứa thêm ~30 câu ứng dụng (lực/công) — kho cần một nhóm "Lực" đủ dày.
4. Đáp án/lời giải NBV có lỗi (xem 1b); khi tạo câu nên **tính lại**.
5. Cực trị M∈mp toạ độ lặp một khuôn giải (điểm I + hình chiếu; hoặc đối xứng) — thích hợp làm một cụm VDC với biến thể số.
6. NBV10: khoảng 9/45 câu (20%) trùng hoặc gần trùng câu đã có ở D8/D9/E9/B8/C9 (Đ1: I.11, II.1, II.4, III.5, III.6, Bonus; Đ2: II.1~, II.4, III.5 — xem 1a); các câu còn lại không thấy ở tệp NBV khác. Hai đề dùng được như "khuôn đề" (12 TN / 4 Đ–S / 6 TLN) hơn là nguồn câu mới; cấu phần mỗi đề ≈ 10 hình học vectơ + 14 toạ độ cho TN.
