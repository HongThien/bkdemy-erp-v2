# Đề xuất NHIỆM VỤ ngày / tuần / tháng (detail C7 · C10) — CTO, 28/09/2026

> Đi kèm `spec-thanh-tuu-nhiem-vu.md` (logic A6 đã chốt: ngày sống 3 ngày · tuần dồn tới hết tháng · đủ N nhiệm vụ/tuần mở rương ·
> tháng là chặng nhiều cấp · số nhiệm vụ cố định · thưởng EXP → xu, **KHÔNG cộng Điểm Rank** (L2) · mỗi môn riêng).
> Theo luật "logic trước, detail sau":
> - **Phần 1** = 3 điểm logic mới cần gật.
> - **Phần 2** = bộ nhiệm vụ + phần thưởng cụ thể.

---

## 0. Kinh tế xu thật (DB 28/09, chỉ đọc)

| Chỉ số | Giá trị |
|---|---|
| EXP / em / tháng | Toán ~2.100–2.500 (10% cao nhất ~3.000–3.800) · KHTN ~1.100 |
| Xu chốt tháng 8 | TB **25 xu / em** (10% cao nhất 39, cao nhất 47). Quy đổi: `xu = ceil(EXP / 100)` |
| Giá quà (55 món) | 5–60 xu · 25%: ≤ 13 · một nửa: ≤ **22** · 75%: ≤ 35 |
| Đổi quà tháng 9 | 119 em · 165 lượt · 4.311 xu |

⇒ Hiện **1 tháng học đều ≈ 1 món quà cỡ trung**. Nhiệm vụ là nguồn xu thứ hai, nên cần đặt **trần ngân sách** (§2.5).

---

## 1. Logic mới cần Thùy gật (3 điểm)

| # | Điểm logic | Đề xuất | Vì sao |
|---|---|---|---|
| **N-L1** | Nhiệm vụ **theo từng môn** | Mỗi môn **một bảng nhiệm vụ riêng**. Em học Toán + KHTN có 2 bảng | §1.6 + Thùy chốt "mọi thứ riêng từng môn" |
| **N-L2** | Nhiệm vụ lẻ **không trả thưởng trực tiếp**, chỉ cho **Điểm Chặng** | Thưởng nằm ở **cấp chặng tháng** + **rương tuần** (kiểu battle pass) | Một cửa phát thưởng duy nhất ⇒ ngân sách xu **tính trước chính xác**. HS nhìn 1 thanh chặng là biết còn bao nhiêu tới quà |
| **N-L3** | **Bỏ "thẻ nhân đôi Điểm Rank"** (có trong spec v3) | Đạo cụ từ nhiệm vụ chỉ là quà / đồ sưu tập / quyền lợi trong game buổi | Thẻ ×2 rank = nhiệm vụ cộng rank gián tiếp ⇒ **trái L2** |

---

## 2. Bộ nhiệm vụ cụ thể (mỗi môn một bộ giống hệt nhau)

### 2.1 NGÀY — 3 nhiệm vụ, mỗi cái **sống 3 ngày**, +10 Điểm Chặng

| # | Nhiệm vụ | Điều kiện | Nguồn dữ liệu |
|---|---|---|---|
| N1 | **Thử thách** | Pass 1 lượt Thử thách (≥ 80%) | lượt Thử thách |
| N2 | **Luyện 20** | Làm đúng 20 câu trên app (Thử thách, tự luyện, bổ trợ… đều tính) | `bai_lam_cau` |
| N3 | **Sửa sai** | Làm đúng lại 2 câu thuộc **dạng em từng sai** trong 14 ngày (sai ở ET / BTVN / MT / app đều tính). Không có câu sai nào ⇒ tự đổi thành "Ôn 5 câu dạng lâu chưa làm" | `bai_lam_cau` + `gami_grades` |

- Cả 3 đều là việc **ở nhà, trên app**. Việc trên lớp đã có điểm rank và nằm ở nhiệm vụ tuần.
- Sống 3 ngày ⇒ bận 1–2 hôm vẫn gom làm được.

### 2.2 TUẦN — 4 nhiệm vụ, **chưa xong thì dồn tới hết tháng**, +40 Điểm Chặng

| # | Nhiệm vụ | Điều kiện | Mảng |
|---|---|---|---|
| T1 | **BTVN đúng hẹn** | Nộp đúng hạn **mọi** bài BTVN của tuần | Bài về nhà |
| T2 | **ET tốt** | Đạt ≥ 80% đúng ở ít nhất 1 bài ET trong tuần | Trên lớp |
| T3 | **Kiên trì** | Pass Thử thách ở **4 ngày khác nhau** trong tuần | App |
| T4 | **Lấp lỗ** | Đưa 1 dạng từ **yếu → đạt** (mastery) | Tiến bộ |

**Rương tuần:** xong **12 nhiệm vụ** trong tuần (ngày + tuần gộp; tối đa khoảng 25) ⇒ +60 Điểm Chặng + rương.

### 2.3 THÁNG — 2 nhiệm vụ, +150 Điểm Chặng

| # | Nhiệm vụ | Điều kiện |
|---|---|---|
| M1 | **MT bứt phá** | Hạng MT tháng này **cao hơn tháng trước** **hoặc** nằm trong **top 30% khối**. Em giỏi và em đang tiến bộ đều có cửa |
| M2 | **Bền bỉ** | Pass Thử thách ở **15 ngày khác nhau** trong tháng |

### 2.4 CHẶNG THÁNG — 30 cấp × 50 Điểm Chặng = 1.500, reset đầu tháng

| Cấp | Quà (miễn phí, không có bản trả tiền) |
|---|---|
| Mỗi cấp | +30 EXP môn đó (cuối tháng chốt ra xu cùng EXP khác) |
| 10 | Sticker / biểu cảm dùng trên TV lớp |
| 20 | **Quyền "chọn ô trước"** ở Chiếm Đất buổi kế tiếp |
| 30 | **Khung tháng** mang tên tháng (đồ sưu tập, không bao giờ có lại) + 300 EXP |
| Rương tuần | +100 EXP + tỉ lệ nhỏ ra sticker hiếm (**tỉ lệ công khai**, giống `game_lop_thuong`) |

### 2.5 Ai đi được tới đâu (ước lượng 1 tháng, Toán)

| Kiểu HS | Nhiệm vụ làm được | Điểm Chặng | Cấp | EXP từ nhiệm vụ | ≈ Xu thêm |
|---|---|---|---|---|---|
| **Cày đều** (app hầu hết các ngày) | ~75 ngày · ~14 tuần · 4 rương · 2 tháng | ~1.850 | **30** | 900 + 300 + 400 = **1.600** | **+16** |
| **Chăm vừa** (app ~3 ngày/tuần) | ~35 ngày · ~8 tuần · 1–2 rương · 1 tháng | ~900 | **~18** | ~540 + ~150 | **+7** |
| **Không dùng app** (chỉ việc trên lớp) | ~8 tuần (T1, T2, đôi khi T4) · 0–1 tháng | ~400 | **~8** | ~240 | **+2–3** |

**Ngân sách (C10):**
- Tối đa **+16 xu/tháng/môn** cho em cày hết. Em trung bình khoảng +7.
- So với 25 xu hiện có: em cày hết **+64%**, em trung bình **+28%**.
- Tức là em cày đều **thêm được khoảng 1 món quà nhỏ mỗi tháng**.
- Muốn đắt / rẻ hơn thì chỉ cần chỉnh **EXP mỗi cấp** (30 ⇒ 20 hoặc 40), cấu trúc không đổi.

---

## 3. Cần Thùy chốt

| # | Câu | Đề xuất |
|---|---|---|
| N-L1 | Mỗi môn một bảng nhiệm vụ riêng | Có |
| N-L2 | Nhiệm vụ lẻ chỉ cho Điểm Chặng; thưởng qua chặng tháng + rương tuần | Có |
| N-L3 | Bỏ thẻ nhân đôi Điểm Rank | Có |
| N-D1 | Bộ nhiệm vụ §2.1–2.3 | Như bảng |
| N-D2 | Ngân sách: tối đa +16 xu/tháng/môn (30 EXP/cấp) | Như bảng, hoặc chọn mức 20 / 40 EXP/cấp |
| N-D3 | Quà mốc cấp 10 / 20 / 30 (sticker TV · chọn ô trước Chiếm Đất · khung tháng) | Như bảng |
