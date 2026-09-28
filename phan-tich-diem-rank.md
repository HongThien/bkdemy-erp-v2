# Phân tích số liệu ĐIỂM RANK — mô phỏng 3 tháng (detail C1 · C2 · C3, xem trước C4)

> **CTO, 28/09/2026.** Đây là tài liệu **DETAIL**, đi kèm `spec-thanh-tuu-nhiem-vu.md` v4. Phần logic của spec đã chốt (L1–L4) và **không đổi** ở đây.
> Mô phỏng: `node scripts/sim-diem-rank.mjs` — không đụng DB. Mỗi kịch bản chạy 400 lần, lấy trung bình. Đổi tham số rồi chạy lại là ra bảng mới.
> Tham số nền lấy từ **số đo DB thật** (truy vấn chỉ đọc, 28/09).

---

## 0. Kết luận nhanh

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
