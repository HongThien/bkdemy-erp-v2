# Phân tích số liệu ĐIỂM RANK — mô phỏng 3 tháng (detail C1 · C2 · C3, xem trước C4)

> **CTO, 28/09/2026.** Đây là tài liệu **DETAIL**, đi kèm `spec-thanh-tuu-nhiem-vu.md` v4. Phần logic của spec đã chốt (L1–L4) và **không đổi** ở đây.
> Mô phỏng: `node scripts/sim-diem-rank.mjs` — không đụng DB. Mỗi kịch bản chạy 400 lần, lấy trung bình. Đổi tham số rồi chạy lại là ra bảng mới.
> Tham số nền lấy từ **số đo DB thật** (truy vấn chỉ đọc, 28/09).

---

## ★★★ VÒNG 4 — MÙA 1 NĂM · THANG 10 BẬC "NGƯỜI THƯỜNG → THẦN" (Thùy 28/09)

**Thùy chốt:**
- **Mùa = 1 năm.** Nhiều bậc, mỗi bậc lớn có bậc nhỏ. Theo câu chuyện *người bình thường thành thần*.
- **Bậc thần phải ÍT:** đa số chỉ tới bậc 6–7, bậc 8–9–10 mới là danh giá.

Chạy lại: `node scripts/sim-diem-rank.mjs --nam` (12 tháng, 100 lần/khối).

### Thang đề xuất

**8 bậc cố định** (mỗi bậc 3 sao ★ → ★★★) **+ 2 bậc ghế** (chỉ vài em ngồi).

| # | Bậc | Chương truyện | Ngưỡng (hệ số × điểm tối đa 1 tháng) | Toán | KHTN |
|---|---|---|---|---|---|
| 1 | **Novice** | Người thường | 0 | 0 | 0 |
| 2 | **Soldier** | Chiến binh | 0,6 | 1.500 | 1.125 |
| 3 | **Captain** | Chiến binh | 1,6 | 4.000 | 3.000 |
| 4 | **General** | Chiến binh | 3,0 | 7.500 | 5.625 |
| 5 | **Hero** *(Thùy chốt, thay Master)* | Anh hùng | 4,6 | 11.500 | 8.625 |
| 6 | **Legend** | Anh hùng | 7,0 | 17.500 | 13.125 |
| 7 | **King** | Vương giả | 8,0 | 20.000 | 15.000 |
| 8 | **Emperor** | Vương giả | 9,8 | 24.500 | 18.375 |
| 9 | **God of War** | Thần | **Ghế:** top 3% khối × môn **và** phong độ ≥ 84% | 2 em / khối 54 | 1 em / khối 34 |
| 10 | **Supreme God** | Thần | **Ghế:** hạng 1 khối × môn **và** phong độ ≥ 92% | 1 em | 1 em |

- **Phong độ** = điểm từ đầu mùa ÷ (điểm tối đa 1 tháng × số tháng đã qua).
- Ghế thần **xét lại hằng ngày** và **ngồi được quanh năm**: tháng 1 cũng có thần, tháng 12 cũng có. Bị vượt hoặc tụt phong độ thì rơi về bậc cố định của mình.
- Nếu ghế chỉ mở khi đủ điểm cả năm thì tới tháng 11 mới có thần — đã thử, loại.

### Kết quả — Toán khối 7 (54 em)

| Kiểu HS | Hết T1 | Hết T3 | Hết T6 | Hết T9 | **Hết năm** |
|---|---|---|---|---|---|
| Giỏi toàn diện | Supreme God | Supreme God | Supreme God | Supreme God | **Supreme God** (29.119) |
| Giỏi, cày app điên | God of War | God of War | God of War | God of War | **God of War** (28.156) |
| Trung bình, cày 6 lượt/ngày | Soldier ★ | Captain ★★ | Hero ★ | Legend ★★ | **Emperor ★** (25.225) |
| Khá, chăm | Soldier ★ | Captain ★★ | Hero ★ | Legend ★ | **King ★★★** (24.202) |
| Giỏi, không dùng app | Soldier ★ | Captain ★★ | Hero ★ | Hero ★★★ | **King ★★★** (23.198) |
| Yếu, cày 15 lượt/ngày | Soldier ★ | Captain ★★ | General ★★★ | Hero ★★★ | **King ★★** (22.956) |
| Ốm lỡ MT, thi lại | Soldier ★ | Captain ★★ | General ★★★ | Hero ★★★ | **King ★★** (21.066) |
| Trung bình | Soldier ★ | Captain ★ | General ★★ | Hero ★★ | **Legend ★★** (18.889) |
| Yếu, lười | Novice ★★★ | Soldier ★★★ | Captain ★★★ | General ★★★ | **Hero ★★** (14.662) |
| Vào học tháng 7 | — | — | — | Captain ★★★ | **Hero ★** (13.063) |

**Phân bố cả khối theo bậc lớn:**

| Hết tháng | Novice | Soldier | Captain | General | Hero | Legend | King | Emperor | God of War + Supreme |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 27% | 72% | | | | | | | 2 ghế |
| 3 | | 6% | 93% | | | | | | 2 ghế |
| 6 | | | 3% | 83% | 14% | | | | 2 ghế |
| 9 | | | | 4% | 84% | 10% | 2% | | 2 ghế |
| **12** | | | | | 17% | **41%** | **34%** | **8%** | **2 ghế (~3%)** |

KHTN khối 9 (34 em), hết năm: Hero 28% · **Legend 36% · King 29%** · Emperor 7% · 1–2 ghế thần.

**Đạt đúng đích Thùy đặt:**
- **Đa số (~70%) dừng ở bậc 6–7** (Legend, King).
- **Emperor ~8%.**
- **Thần: 1–2 em mỗi khối.**
- Em yếu lười cả năm vẫn lên được Hero (bậc 5): hành trình ai cũng đi, nhưng lên thần thì không phải ai cũng tới.

### ⚠ Điểm cần biết: giữa năm cả khối đi cùng một đoạn

- Điểm cộng dồn cả năm ⇒ tại một thời điểm, đa số em đứng cùng 1–2 bậc lớn: tháng 6 có 83% ở General, tháng 9 có 84% ở Hero.
- Khác biệt giữa các em lúc đó chỉ thấy qua **sao** (★) và **hạng trong khối**.
- Đây là bản chất của thang cả năm (giống battle pass / Trophy Road): **bậc = hành trình**, còn **đua = hạng**.
- **Q-N2 — ✅ Thùy chốt CÓ: Bảng đua tháng.**
  - Xếp hạng Điểm Rank **kiếm được trong tháng**, theo **khối × môn**.
  - Vinh danh top tháng trên TV. **Không đổi bậc.**
  - Tháng nào cũng có một cuộc đua mới. Gộp với giải thưởng tháng đang có (detail bàn sau).

### Tên gọi

- **Mạch truyện 5 chương:** Người thường (Novice) → Chiến binh (Soldier · Captain · General) → Anh hùng (Hero · Legend) → Vương giả (King · Emperor) → Thần (God of War · Supreme God).
- **Q-N1 — ✅ Thùy chốt: bậc 5 = Hero** (thay Master): tướng quân → anh hùng → huyền thoại.
- Sửa chính tả: **Soldier** (không phải "Sodier").
- **Giữ tên tiếng Anh.** Nếu dịch tiếng Việt thì tránh "Chiến Thần" và "Huyền Thoại" — trùng tên bậc rank của Liên Quân.
- **Mỗi chương một màu / một hình khung:** đồng → bạc → vàng → tím → lửa thần. Nhìn khung là biết em đang ở chương nào.
- **Hết năm:** mùa mới **về lại Novice** (hợp câu chuyện "tái sinh"). Bậc cao nhất năm cũ giữ vĩnh viễn thành huy hiệu, vd *"Mùa 2026–27 · Emperor"*.

---

## ★★ VÒNG 3 — BỘ SỐ ĐÃ CHỐT TOÀN BỘ (Thùy 28/09) · kết quả tính lại

Chạy lại: `node scripts/sim-diem-rank.mjs --chot`. Mỗi khối chạy 400 lần, 60% HS dùng Thử thách.

### Bộ số đã chốt (mỗi môn một bộ, cùng công thức)

| Mục | Toán | KHTN | Chốt |
|---|---|---|---|
| ET | 100 / bài | 100 / bài | D1 |
| BTVN | 100 đúng hạn · 50 muộn | như Toán | D1 |
| MT | Bảng hạng 1–50 × 10 (1.000 → 500). **Hạng quy theo sĩ số dự thi:** `ceil(hạng × 50 / số em thi)` | như Toán | D1 · D4 |
| Lỡ MT | Thi lại, tính hạng bằng điểm thi lại (`diem_thi_lai`) | như Toán | D6 |
| Thử thách, 1 lượt pass | 8/10 = 10 · 9/10 = 20 · 10/10 = 30. **Vô hạn lượt** | như Toán | D1 |
| Trần tháng Thử thách | **500** = ¼ × (500 + 500 + 1.000) | **375** = ¼ × (300 + 200 + 1.000) | D2 · trần ¼ |
| Trần ngày Thử thách | **25** | **19** | D3 |
| Điểm tối đa 1 tháng | **2.500** | **1.875** | — |

### Kết quả — Toán khối 7 (54 em), mùa 3 tháng

| Kiểu HS | Tháng 1 | Hết tháng 2 | **Hết mùa** | Hạng | Bậc T1 → T2 → T3 | % Thử thách |
|---|---|---|---|---|---|---|
| Giỏi toàn diện | 2.434 | 4.862 | **7.279** | 1 | 2 → 4 → **7** | 21% |
| Giỏi, cày app điên | 2.336 | 4.677 | **7.020** | 2 | 2 → 4 → **7** | 21% |
| Trung bình, cày 6 lượt/ngày | 2.091 | 4.190 | **6.298** | 6 | 2 → 4 → **6** | 24% |
| Khá, chăm | 2.021 | 4.032 | **6.039** | 8 | 2 → 4 → **6** | 14% |
| Giỏi, không dùng app | 1.932 | 3.861 | **5.786** | 11 | 2 → 3 → **5** | 0% |
| Yếu, cày 15 lượt/ngày | 1.915 | 3.826 | **5.746** | 12 | 2 → 3 → **5** | 23% |
| Ốm lỡ MT tháng 2, thi lại | 1.762 | 3.509 | **5.259** | 21 | 2 → 3 → **5** | 6% |
| Yếu, cày 3 lượt/ngày | 1.589 | 3.171 | **4.765** | 33 | 2 → 3 → **4** | 7% |
| Trung bình | 1.574 | 3.154 | **4.715** | 35 | 2 → 3 → **4** | 3% |
| Vào học từ tháng 2 | — | 2.165 | **4.340** | 45 | 1 → 2 → **4** | 16% |
| Yếu, lười | 1.217 | 2.439 | **3.667** | 53 | 2 → 2 → **3** | 0% |

**Kiểm D4 — quy hạng theo sĩ số chạy đúng:**
- Cùng một kiểu HS cho ra điểm gần như nhau dù khối lớn hay nhỏ.
  - Giỏi toàn diện: 7.279 (khối 54) · 7.284 (khối 68) · 7.090 (khối 11).
  - Yếu, lười: 3.667 · 3.668 · 3.638.
- MT trung bình của HS nền ~710/tháng ở cả khối 54 lẫn 68.
- Trước D4, khối nhỏ được "cho không" ~860–1.000 điểm MT.

**Kiểm D6 — thi lại chạy đúng:** em ốm lỡ MT tháng 2 vẫn đứng **hạng 21, bậc 5**. Trước D6, em này tụt về hạng ~51.

**KHTN khối 9 (34 em)** cho cùng hình dạng, thang nhỏ hơn: top 5.361 · yếu lười 2.674. Mỗi môn so riêng nên không ảnh hưởng.

### ⚠ Phát hiện mới: mùa 3 tháng thì 2 tháng đầu gần như ai cũng cùng bậc

Phân bố bậc của HS nền, Toán khối 7:

| Mùa 3 tháng | Bậc 1 | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 | Bậc 7 |
|---|---|---|---|---|---|---|---|
| Hết tháng 1 | 1% | **99%** | 0% | 0% | 0% | 0% | 0% |
| Hết tháng 2 | 0% | 4% | **86%** | 10% | 0% | 0% | 0% |
| Hết tháng 3 | 0% | 0% | 7% | 50% | 34% | 9% | 1% |

- Ngưỡng bậc đặt cho điểm **cuối mùa**. Điểm chỉ cộng dồn, nên tháng 1–2 cả khối dồn vào 1 bậc. Bậc chỉ phân hoá ở tháng cuối.
- Với trẻ, như vậy là **2 tháng không có gì để đua**.

**Phương án MÙA 1 THÁNG** (cùng bộ số, ngưỡng = hệ số × điểm tối đa 1 tháng; hệ số bậc 2–6 = 0,4 / 0,56 / 0,68 / 0,76 / 0,84):

| | Bậc 1 | Bậc 2 | Bậc 3 | Bậc 4 | Bậc 5 | Bậc 6 | Bậc 7 (ghế) |
|---|---|---|---|---|---|---|---|
| Ngưỡng Toán | 0 | 1.000 | 1.400 | 1.700 | 1.900 | 2.100 | top 2 & ≥ 2.100 |
| Ngưỡng KHTN | 0 | 750 | 1.050 | 1.275 | 1.425 | 1.575 | top 1 & ≥ 1.575 |
| % em Toán | 1% | 14% | 45% | 22% | 11% | 6% | 1% |
| % em KHTN | 1% | 23% | 39% | 20% | 11% | 7% | 0% |

Bậc cuối tháng của từng kiểu (Toán):

| Bậc | Kiểu HS |
|---|---|
| 7 | Giỏi toàn diện · Giỏi cày điên |
| 6 | Trung bình cày 6 lượt |
| 5 | Khá chăm · Giỏi không app · Yếu cày 15 lượt |
| 4 | Ốm thi lại |
| 3 | Trung bình · Yếu cày 3 lượt |
| 2 | Yếu lười |

⇒ **Phân hoá ngay trong tháng.**

**Đề xuất cho C4: mùa = 1 tháng.**
- Cùng nhịp với những thứ đã chạy theo tháng: MT tháng, giải thưởng tháng, chốt xu tháng.
- Tháng nào cũng có đua, có vinh danh, có "tháng sau gỡ lại".
- Khung mùa mang tên tháng.
- Nếu vẫn muốn mùa dài (3 tháng) thì phải chia **mỗi bậc 3 đoàn** để tháng 1–2 còn thấy lên đoàn. Nhưng vẫn là cả khối cùng một vùng bậc, chỉ khác đoàn.

---

## ★ VÒNG 2 (28/09) — Thùy chốt D2 / D3 / D5 / Q-A

**Thùy chốt:**

| # | Chốt | Hệ quả |
|---|---|---|
| **D2** | **Trần Thử thách CỐ ĐỊNH theo môn.** HS học offline, **không được nghỉ** ⇒ không có ca "bỏ lớp bù app" | Kiểu K7 (hay nghỉ), K11 (bỏ lớp) chỉ còn là tham khảo, không dùng để quyết. Trần tháng = ¼ × (ET + BTVN + MT hạng 1 tối đa của môn): **Toán 500 · KHTN 375** |
| **D3** | Trần ngày = trần tháng ÷ 20: **Toán 25 · KHTN 19** | Thùy nhấn: **Thử thách làm VÔ HẠN lượt, chỉ ĐIỂM có trần** |
| **D5** | **Mỗi môn riêng hoàn toàn:** điểm, ngưỡng bậc, bảng xếp hạng. Hồ sơ ghi "rank X Toán · rank Y KHTN". Không có gì so chung. App cũng riêng từng môn, chỉ chung cổng vào | **Bỏ** đề xuất chuẩn hoá quỹ điểm giữa các môn. Mỗi môn có bộ cấu hình riêng |
| **Q-A** | Không cần đổi logic L4. Thử thách vô hạn lượt ⇒ em yếu cứ làm tới khi pass | Giữ **(a)** |

**Mô phỏng lại (S8–S10 trong `scripts/sim-diem-rank.mjs`)** — trần cố định, trần ngày ÷ 20, 60% HS dùng app. Thêm 2 kiểu:
- **K12:** em yếu cày Thử thách vô hạn, 15 lượt/ngày.
- **K13:** em trung bình cày 6 lượt/ngày.

| Kiểu | Toán 54 em: tổng · hạng | Toán 68 em: tổng · hạng | KHTN 34 em: tổng · hạng | % Thử thách |
|---|---|---|---|---|
| K1 Giỏi toàn diện | 7.210 · **2** | 7.163 · 2 | 5.414 · 2 | 21% |
| K9 Giỏi, cày app điên | 6.973 · 2 | 6.903 · 3 | 5.277 · 2 | 21–22% |
| **K13 Trung bình, cày 6 lượt/ngày** | 6.245 · **6** | 6.064 · 8 | 4.813 · 5 | 23–25% |
| K3 Khá, chăm | 5.992 · 9 | 5.886 · 10 | 4.680 · 6 | 14–15% |
| **K12 Yếu, cày 15 lượt/ngày** | 5.702 · **12** | 5.609 · 13 | 4.471 · 8 | 23–24% |
| K2 Giỏi, **không** dùng app | 5.692 · 12 | 5.667 · 13 | 4.267 · 11 | 0% |
| K5 Yếu, cày 3 lượt/ngày | 4.763 · 30 | 4.643 · 37 | 3.714 · 20 | 7–8% |
| K4 Trung bình | 4.680 · 32 | 4.523 · 41 | 3.716 · 20 | 3–4% |
| K6 Yếu, lười | 3.514 · 50 | 3.406 · 63 | 2.946 · 30 | 0% |

**Đọc kết quả:**

1. **Thử thách vô hạn lượt ⇒ cày là leo.**
   - Em **trung bình** chịu cày 6 lượt/ngày (~60 câu) lên **top 6–8**.
   - Em **yếu** chịu cày 15 lượt/ngày (~150 câu, khoảng 1,5–2 giờ) lên **ngang em giỏi không dùng app** (hạng ~12).
   - Đúng tinh thần "cày càng nhiều càng tốt". Trần giữ cho app không vượt quá ~¼ điểm của em.
2. **Ai chạm trần thì Thử thách chiếm 21–25%.**
   - Em giỏi chạm trần: ~21%, vì điểm ET + BTVN + MT cao.
   - Em yếu / trung bình chạm trần: 23–25%, vì các phần kia thấp hơn.
   - ⇒ "≈20%" đúng ở tầm trung bình. Muốn **đúng 20% với em giỏi nhất** thì giữ nguyên. Muốn **không em nào quá 20%** thì hạ trần xuống ≈ 1/5 thay vì 1/4.
3. **Em giỏi chạm trần tháng vào khoảng ngày 20**, không phải ngày 11 như vòng 1. Trần ngày đã dàn đều ra cả tháng.
4. **Không có mâu thuẫn giữa các môn**, vì mỗi môn so riêng. Mức điểm KHTN thấp hơn Toán (trung vị 3.810 so với 4.815) chỉ vì KHTN ít buổi hơn, và không ảnh hưởng gì (D5).

**Ngưỡng bậc theo từng môn (xem trước C4).** Một **công thức chung** (đối xứng §1.6), ra **con số riêng** cho mỗi môn:
- Ngưỡng = hệ số × **điểm tối đa 1 tháng của môn** (ET + BTVN + MT hạng 1 + trần Thử thách).
- Toán: 500 + 500 + 1.000 + 500 = **2.500**.
- KHTN: 300 + 200 + 1.000 + 375 = **1.875**.

| Bậc | Hệ số (mùa 3 tháng) | Toán | KHTN | Toán: tỉ lệ em đạt | KHTN: tỉ lệ em đạt |
|---|---|---|---|---|---|
| 2 | 0,4 | 1.000 | 750 | ~100% | ~100% |
| 3 | 1,0 | 2.500 | 1.875 | ~100% | ~100% |
| 4 | 1,6 | 4.000 | 3.000 | ~85% | ~90% |
| 5 | 2,0 | 5.000 | 3.750 | ~40% | ~50% |
| 6 | 2,4 | 6.000 | 4.500 | ~9% | ~13% |
| 7 | Ghế: top 3% khối × môn + ≥ bậc 6 | | | 1–2 em | 1 em |

**Còn chờ chốt:**
- **D1** bộ số §0.
- **D4** quy hạng MT theo sĩ số dự thi. Vẫn cần, **ngay trong 1 môn**: Toán có khối 6 em (khối 3) đến 68 em (khối 9); KHTN có khối 9 em đến 34 em. Khối nhỏ thì ai cũng hạng cao, dễ lên bậc hơn khối lớn.
- **D6** thi lại MT.
- **Mới:** trần tháng Thử thách = **¼** (em giỏi nhất đúng 20%, em khác chạm trần tới 25%) hay **⅕** (không em nào quá 20%)?

---

## 0. Kết luận nhanh (vòng 1)

**Bộ số đề xuất** (thang ×10 cho số to, HS thích):

| Nguồn | Điểm |
|---|---|
| ET | **100** / bài |
| BTVN | **100** nộp đúng hạn · **50** nộp muộn · 0 không làm / xin phép |
| MT | **Bảng hạng × 10** ⇒ hạng 1 = 1.000 … hạng cuối = 500 |
| Thử thách (1 lượt pass) | 8/10 = **10** · 9/10 = **20** · 10/10 = **30** |
| Trần tháng Thử thách | **¼ × (ET + BTVN + MT của CHÍNH EM)** ⇒ Thử thách luôn ≤ 20% tổng của em |
| Trần ngày Thử thách | **trần tháng ÷ 20** ⇒ muốn lấy đủ phải làm đều khoảng 20 ngày/tháng |

Mô phỏng 3 tháng, khối Toán 54 em, cho thấy bộ số này **chạy đúng ý**:

- **Top khối** là em giỏi **và** cày app (7.100 điểm).
- Em giỏi **không** dùng app vẫn ở **top 20%** (hạng 8–11), nhưng thua em giỏi có cày **1.400 điểm**. Khoảng chênh đó là động lực để dùng app.
- Em trung bình ở giữa bảng. Em yếu và lười, em nghỉ nhiều ở cuối bảng.
- **Đầu bảng ≈ 2 lần cuối bảng**: đủ phân biệt, không cách quá xa.

**6 phát hiện cần mày quyết** (chi tiết ở §4):

| # | Phát hiện | Đề xuất |
|---|---|---|
| ① | Trần Thử thách **cố định** cho phép em **bỏ lớp, bù bằng app** leo tới hạng 21, và Thử thách chiếm tới 30% | Trần **theo chính em** |
| ② | Em **yếu** cày app gần như **không lên rank** nhờ app. Lý do: đạt 80% trên câu tổng hợp rất khó với em yếu (chỉ ~10% lượt pass) | Đúng luật đã chốt. Có đổi không là câu hỏi Q-A |
| ③ | **Khối nhỏ**: bảng hạng 1–50 khiến ai cũng được 860–1.000 điểm MT, gần như không phân biệt | **Quy hạng theo sĩ số** |
| ④ | **KHTN ít buổi hơn Toán** ⇒ điểm ET/BTVN tối đa chỉ bằng một nửa ⇒ nếu dùng chung ngưỡng bậc thì KHTN thiệt | **Chuẩn hoá theo môn** |
| ⑤ | **Lỡ 1 MT mất khoảng 40% điểm tháng** đó | Cho **thi lại** (có sẵn cột `diem_thi_lai`) |
| ⑥ | Không có trần ngày thì em giỏi **chạm trần tháng sau ~11 ngày**, nửa tháng sau không còn động lực | Trần ngày = trần tháng ÷ 20 |

---

## 1. Số liệu thật của BK (DB, 7–9/2026, chỉ đọc)

| Chỉ số | Toán | KHTN | Ghi chú |
|---|---|---|---|
| Sĩ số khối (cấp 2) | 6: 40 · 7: 54 · 8: 49 · 9: 68 | 7: 9 · 8: 10 · 9: 34 | Anh/Văn: 1–6 em/khối |
| ET / em / tháng | ~4,6 (trung vị 5) | ~2,5 (trung vị 3) | Tháng 8–9 |
| BTVN / em / tháng | ~4,8 | ~2 | ~75% đúng hạn · ~12% muộn · ~8% không làm |
| MT / em / tháng | **1** | **1** | Điểm TB ~7 · 10% thấp nhất ~4 · 10% cao nhất ~9,5 |
| Tỉ lệ có mặt | 85% (T7) → 94% (T9) | | |
| Tự luyện (T9) | 74 / ~300 em dùng · 1.533 lượt · ~9 câu/lượt | 5 em | |
| Lượt / em dùng / tháng | nửa số em ≤ 6 · 25% cao nhất ≥ 19 · 10% cao nhất ≥ 55 · **cao nhất 208** | | Có ngày 1 em làm **84 lượt** |
| % lượt đúng ≥ 80% | **71%** | 21% | Hiện chủ yếu em khá giỏi dùng app |
| Cơ sở | **1** (cột `lop.co_so` trống ở cả 47 lớp) | | ⇒ Q5 cũ tự đóng: không cần tầng cơ sở |

---

## 2. Giả định mô phỏng

- **Tháng chuẩn:**
  - Toán: 5 ET · 5 BTVN · 1 MT · 30 ngày.
  - KHTN: 3 ET · 2 BTVN · 1 MT.
- **Mùa thử:** 3 tháng.
- **Khối:** 11 kiểu học sinh (bảng dưới). Phần còn lại là **học sinh nền**, sinh ngẫu nhiên theo phân bố thật:
  - Năng lực ~ chuẩn(0,72; 0,1).
  - Có mặt: 70% em đi 95% buổi · 20% em đi 85% · 10% em đi 65%.
  - BTVN đúng hạn tương quan với việc đi học.
  - Tỉ lệ dùng app: **25%** (như hiện tại) hoặc **60%** (dự báo khi Thử thách có điểm rank).
  - Mức cày của em dùng app: 0,2 / 0,6 / 1,8 / 5 lượt/ngày, khớp phân bố thật.
- **Làm bài:**
  - Điểm MT = 10 × năng lực + nhiễu. Xếp hạng chỉ giữa những em **có thi** (§1.5).
  - 1 lượt Thử thách = 10 câu, mỗi câu đúng với xác suất bằng năng lực của em. Đúng từ 8/10 là pass.

| Kiểu | Mô tả | Năng lực | Có mặt | BTVN đúng hạn | Thử thách / ngày |
|---|---|---|---|---|---|
| K1 | Giỏi toàn diện | 0,92 | 100% | 100% | 2 |
| K2 | Giỏi, **không** dùng app | 0,92 | 100% | 100% | 0 |
| K3 | Khá, chăm | 0,80 | 95% | 90% | 1 |
| K4 | Trung bình | 0,70 | 90% | 75% | 0,3 |
| K5 | **Yếu, cày app rất nhiều** | 0,55 | 95% | 90% | 3 |
| K6 | Yếu, lười | 0,55 | 80% | 50% | 0 |
| K7 | Hay ốm / nghỉ, lỡ MT tháng 2 | 0,75 | 60% | 60% | 0,5 |
| K8 | Vào học từ tháng 2 | 0,85 | 100% | 95% | 1 |
| K9 | Giỏi, **cày app điên** | 0,88 | 95% | 95% | **8** |
| K10 | Chăm nhưng **không bao giờ thi MT** | 0,80 | 95% | 90% | 1 |
| K11 | Giỏi, **bỏ lớp 50%, bù bằng app** | 0,90 | 50% | 50% | 4 |

---

## 3. Kết quả chính — Toán khối 7 (54 em) · bộ số đề xuất · trần theo em · 60% dùng app

| Kiểu | Tháng 1 | Tháng 2 | Tháng 3 | **Tổng 3 tháng** | Hạng /54 | ET | BTVN | MT | Thử thách | % Thử thách |
|---|---|---|---|---|---|---|---|---|---|---|
| K1 Giỏi toàn diện | 2.376 | 2.379 | 2.367 | **7.122** | 2 | 1.500 | 1.500 | 2.697 | 1.425 | 20% |
| K9 Giỏi, cày app điên | 2.265 | 2.263 | 2.279 | **6.808** | 3 | 1.427 | 1.428 | 2.592 | 1.362 | 20% |
| K3 Khá, chăm | 2.049 | 2.036 | 2.038 | **6.123** | 7 | 1.423 | 1.391 | 2.307 | 1.002 | 16% |
| K2 Giỏi, không dùng app | 1.899 | 1.897 | 1.896 | **5.693** | 11 | 1.500 | 1.500 | 2.693 | 0 | 0% |
| K5 Yếu, cày app rất nhiều | 1.583 | 1.583 | 1.593 | **4.760** | 29 | 1.425 | 1.390 | 1.602 | 343 | 7% |
| K4 Trung bình | 1.571 | 1.554 | 1.550 | **4.674** | 31 | 1.352 | 1.210 | 1.959 | 153 | 3% |
| K8 Vào học từ tháng 2 | — | 2.222 | 2.239 | **4.460** | 36 | 1.000 | 949 | 1.680 | 831 | 19% |
| K11 Giỏi, bỏ lớp, bù app | 1.495 | 1.452 | 1.481 | **4.427** | 34 | 748 | 741 | 2.052 | 886 | 20% |
| K6 Yếu, lười | 1.164 | 1.171 | 1.171 | **3.506** | 50 | 1.201 | 827 | 1.478 | 0 | 0% |
| K10 Không bao giờ thi MT | 1.169 | 1.172 | 1.170 | **3.511** | 50 | 1.426 | 1.390 | 0 | 695 | 20% |
| K7 Hay ốm / nghỉ | 1.256 | 717 | 1.301 | **3.274** | 51 | 896 | 936 | 1.090 | 352 | 11% |

**Phân bố cả khối sau 3 tháng:**

| Mức | 10% | 30% | 50% | 70% | 85% | 95% | Cao nhất |
|---|---|---|---|---|---|---|---|
| Tổng điểm | 3.855 | 4.460 | **4.810** | 5.200 | 5.660 | 6.326 | 7.500 |

**Đọc bảng:**

- **Mỗi tháng** một em chăm đủ lớp nhận khoảng 1.900–2.400 điểm. Cơ cấu:
  - ET + BTVN (chăm chỉ): khoảng 1.000.
  - MT (giỏi): 500–1.000.
  - Thử thách (cày app): 0–475.
- **Ba lực kéo ngang nhau**, không lực nào áp đảo.
- **Nhóm giữa khá sát** (từ mức 30% đến mức 70% chỉ chênh ~740 điểm). Một MT tốt/xấu hoặc một tháng cày app có thể đẩy em lên/xuống 10–15 hạng. Cạnh tranh sẽ sôi ở giữa bảng.

---

## 4. Phát hiện — chi tiết

### ① Trần Thử thách: CỐ ĐỊNH hay THEO CHÍNH EM

| Kiểu | Trần cố định (500/tháng): hạng · % Thử thách | Trần theo em: hạng · % Thử thách |
|---|---|---|
| K11 Giỏi, bỏ lớp bù app | **21** · **30%** | 34 · 20% |
| K10 Không thi MT | 47 · **27%** | 50 · 20% |
| K1 Giỏi toàn diện | 1 · 21% | 1–2 · 20% |

- Trần cố định ⇒ **app thay được lớp**, và "Thử thách ≈ 20%" chỉ đúng với em đi học đủ.
- Trần theo em ⇒ luật 20% **đúng với MỌI em**: không đi học thì không mở được trần app.
- **Đề xuất: theo em.**
- **Cách tính khi đang giữa tháng:** trần = ¼ × (ET + BTVN đã có trong tháng này + MT tháng trước). Như vậy trần tăng dần theo buổi học, và em thấy được ngay "đi học thêm buổi nữa là mở thêm điểm Thử thách".

### ② Em yếu cày app gần như không lên rank nhờ app

- **K5** (năng lực 0,55, 3 lượt/ngày = ~90 lượt/tháng) chỉ pass **~10%** số lượt. Kết quả: ~112 điểm Thử thách/tháng, chiếm 7% tổng.
- **K1** (giỏi, 2 lượt/ngày) chạm trần 475/tháng.
- Đây là **hệ quả đúng** của luật "≥80% mới tính" + "đề giống Tự luyện tổng hợp" (L4). **Rủi ro:** em yếu cày mãi không được gì thì sẽ bỏ app.
- **Q-A cho mày** (đổi logic, nên hỏi chứ tao không tự sửa):
  - (a) **Giữ nguyên.** Em yếu được thưởng qua nhiệm vụ / thành tựu (L2: không vào rank).
  - (b) Thử thách ra câu **theo dạng em đã học** thay vì tổng hợp, để em yếu có cửa pass.

### ③ Khối nhỏ: bảng hạng 1–50 mất tác dụng

- **KHTN khối 8 có 10 em** ⇒ hạng 10 vẫn được 860. Cả khối nằm trong khoảng **860–1.000** ⇒ MT gần như không phân biệt.
- **Toán khối 9 có 68 em** ⇒ hạng 51–68 **đều** được 500 ⇒ cuối bảng dồn cục.
- **Đề xuất: quy hạng theo sĩ số dự thi** — `hạng quy đổi = làm tròn lên(hạng × 50 / số em có thi)`, rồi tra bảng 1–50 như cũ.
  - Hình dạng bảng giữ nguyên. Khối 10 em: hạng 10 → 50 điểm. Khối 68 em: hạng 68 → 50 điểm.
  - Khối đúng 50 em thì y hệt bảng gốc.

### ④ KHTN ít buổi hơn Toán ⇒ điểm tối đa lệch

- 3 tháng: KHTN tối đa ET + BTVN = **1.500**, Toán = **3.000**.
- Rank **so trong cùng môn** nên thứ hạng không sai. Nhưng nếu **ngưỡng bậc** dùng chung cho 4 môn thì em KHTN khó lên bậc hơn em Toán cùng mức chăm.
- **Đề xuất (đúng luật đối xứng §1.6):** mỗi môn **chung một quỹ tháng** — ET 500, BTVN 500, MT 500–1.000.
  - Điểm 1 bài = quỹ ÷ số buổi chuẩn của môn. Ví dụ KHTN: ET ≈ 170/bài, BTVN 250/bài.
  - Vẫn là "điểm cố định", chỉ khác nhau giữa các môn.
  - Cách còn lại: mỗi môn một bộ ngưỡng bậc riêng (rối hơn).

### ⑤ Lỡ 1 MT là mất ~40% điểm tháng

- **K7** lỡ MT tháng 2: điểm tháng 2 còn **717**, so với ~1.280 các tháng có thi.
- **K10** không bao giờ thi MT: đứng hạng ~50 dù chăm.
- Giữ nặng như vậy là đúng nếu mày muốn **MT bắt buộc**. Với em vắng có lý do, đề xuất cho **thi lại** (`diem_thi_lai` đã có trong `diem_thi`), tính hạng bằng điểm thi lại.

### ⑥ Trần ngày

- Em giỏi làm 2 lượt/ngày kiếm khoảng **44 điểm/ngày** ⇒ chạm trần tháng (~475) sau **khoảng 11 ngày**, nửa tháng còn lại không còn động lực.
- Trần ngày = trần tháng ÷ 20 (≈ 25/ngày) ⇒ cần **khoảng 20 ngày làm đều**. Đúng tinh thần "ngày nào cũng vào app".
- Chạm trần ngày thì vẫn làm tiếp được, chỉ không cộng rank. Nhiệm vụ / thành tựu vẫn đếm.

### Phương án trọng số MT (vì sao chọn "cân bằng")

| Phương án (MT hạng 1 → cuối) | K2 giỏi, không app | K5 yếu, cày app | K11 bỏ lớp | Nhận xét |
|---|---|---|---|---|
| A — MT nặng (1.500 → 750) | hạng 10 | 33 | 30 | Giỏi quyết định, chăm/cày bị lu mờ |
| **B — cân bằng (1.000 → 500)** | **11** | **29** | **34** | Ba lực ngang nhau |
| C — MT nhẹ (500 → 250) | 12 | 22 | 42 | Gần như thành "đếm buổi", giỏi ít giá trị |

---

## 5. Xem trước ngưỡng bậc (C4 — chưa chốt, chỉ để hình dung)

Mùa 3 tháng, Toán, 60% dùng app. Điểm chỉ cộng, không trừ.

| Bậc | Ngưỡng (điểm mùa) | Ai tới được |
|---|---|---|
| 1 | 0 | Mọi em |
| 2 | 1.000 | Sau 2–3 tuần đi học đều |
| 3 | 2.500 | Khoảng giữa tháng 2 |
| 4 | 4.000 | ~80% em chăm, cuối mùa |
| 5 | 5.000 | ~40% trên cùng |
| 6 | 6.000 | ~8% trên cùng |
| 7 | **Ghế:** top 3% khối **và** ≥ 6.000 | 1–2 em / khối Toán |

Mùa dài hơn 3 tháng thì nhân ngưỡng theo số tháng. **Chốt ở C4.**

---

## 6. Cần chốt (detail)

| # | Câu hỏi | Đề xuất |
|---|---|---|
| **D1** | Bộ số §0: ET 100 · BTVN 100 / 50 · MT ×10 · Thử thách 10 / 20 / 30 | Như §0 |
| **D2** | Trần Thử thách theo chính em (①) | Có |
| **D3** | Trần ngày = trần tháng ÷ 20 (⑥) | Có |
| **D4** | MT quy hạng theo sĩ số dự thi (③) | Có |
| **D5** | Chuẩn hoá điểm ET / BTVN theo môn (④) | Có |
| **D6** | Lỡ MT có lý do ⇒ thi lại được tính hạng (⑤) | Có |
| **Q-A** | Em yếu gần như không lên rank nhờ app (②) — giữ (a) hay đổi (b)? | Mày quyết. Đây là đổi logic L4 |
