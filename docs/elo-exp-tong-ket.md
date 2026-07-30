# ELO & EXP — Tài liệu tổng kết (training)

> Cập nhật **2026-07-30**. Nguồn code: `src/gami/elo.js` · `src/gami/exp.js` · `src/gami/config.js` · `src/gami/replay.js` · `src/lib/gami.ts`.
> Doc này để **đào tạo** người vận hành (OPS/TA/GV) + tham chiếu kỹ thuật. Số ví dụ là **DỮ LIỆU THẬT** (9A1, tháng 7/2026), verify được.

---

## 0. Hai thước — tách bạch, đừng lẫn

| | **ELO** | **EXP** |
|---|---|---|
| Đo cái gì | **Giỏi/kém** (trình độ) | **Chăm chỉ** (nỗ lực, đi học đều) |
| Tính chất | **Tương đối** trong lớp | **Tuyệt đối**, cộng dồn |
| Có thể ÂM? | **Có** (làm dở thì tụt) | Không (luôn ≥ 0) |
| Chu kỳ | mỗi buổi · reset **NĂM** (niên khóa 1/7) | mỗi tháng · Level reset **MÙA** |
| Nguồn | ET (đấu điểm thô cả lớp) | ET-hạng + BTVN + MT |

**Nguyên tắc vàng:** Elo là *bảng xếp hạng năng lực*; EXP là *huy chương chuyên cần*. Một HS giỏi mà lười → Elo cao, EXP thấp. Một HS chăm mà yếu → EXP cao, Elo thấp. **Không trộn hai tín hiệu.**

Mọi thứ đều **theo MÔN** — Elo/EXP Toán tách hoàn toàn khỏi KHTN (mỗi môn 1 "trung tâm" riêng).

---

## 1. ELO — thước trình độ

### 1.1 Ý tưởng
Elo cờ vua, nhưng **đa người**: mỗi buổi **ET (Entry Test) = một ván đấu cả lớp cùng lúc**. Mỗi HS "đấu" với mọi bạn khác trong buổi qua **điểm thô**. Thắng nhiều hơn *kỳ vọng* → lên; thua kỳ vọng → xuống.

- **Điểm thô ET** = tổng điểm các câu: **đúng = 100 · gần đúng = 50 · sai = 0** (`problemPoints`, ET chỉ tính kết quả). Vd 5 câu → thang 0…500, bước 50.
- Mỗi HS có **1 Elo cho mỗi môn**, khởi điểm **1000**.

### 1.2 Công thức (chốt 2026-07-30)

```
Δ = clamp( K · (A − E) / (N−1) , ±RANK_CAP ) + P
Elo_sau = Elo_trước + Δ
```

| Ký hiệu | Nghĩa | Cách tính |
|---|---|---|
| **A** — *actual* | Thực tế vượt bao nhiêu bạn | mỗi bạn **thua mình +1**, **hoà +0.5** (theo điểm thô) |
| **E** — *expected* | Kỳ vọng vượt bao nhiêu bạn | `E = Σ 1/(1 + 10^((Rⱼ−Rᵢ)/400))` với Rⱼ = Elo bạn kia **TRƯỚC buổi** |
| **N** | Sĩ số có mặt | chia `/(N−1)` để biên độ không phụ thuộc sĩ số |
| **K** | Độ nhạy | `30` |
| **RANK_CAP** | Trần phần hạng | `±20` |
| **P** | Điểm tiến-trình | `+10` cho **mọi HS có mặt** (dời mốc 0, xem 1.5) |

**Config đầy đủ** (`config.js`): `BASE 1000 · SCALE 400 · K 30 · RANK_CAP 20 · PROGRESS_P 10 · LAMBDA 0 · MT_WEIGHT 4`.
**Biên độ mỗi buổi:** `[−10 … +30]`.

> **λ (LAMBDA) = 0**: trước đây có lực "kéo về trung bình lớp", nhưng nó đẻ nghịch lý *điểm cao mà tụt Elo* → đã tắt. Việc "nén khoảng cách / cho cơ hội lật kèo" chuyển sang **soft-reset đầu mùa** (chưa build).

### 1.3 VÍ DỤ THẬT — 9A1, buổi ET **17/6/2026** (14 HS)

Đây là **buổi đầu mùa** nên mọi HS Elo trước = **1000** ⇒ **E = 6.5 giống hệt nhau** (`E = 0.5 × (N−1) = 0.5 × 13`). Nhờ vậy thấy rõ Δ chỉ do **A** (điểm thô) quyết định.

| Hạng | HS | Điểm thô | Elo trước | E | A | **Δ** | Elo sau |
|---|---|---|---|---|---|---|---|
| 1 | Thái Dương | 300 | 1000 | 6.50 | 12.5 | **+24** | 1024 |
| 2 | Lê Thu Trà | 300 | 1000 | 6.50 | 12.5 | **+24** | 1024 |
| 3 | Chu Châu Anh | 250 | 1000 | 6.50 | 10 | **+18** | 1018 |
| 4 | Nguyễn Hữu Thăng | 250 | 1000 | 6.50 | 10 | **+18** | 1018 |
| 5 | Nguyễn Ngọc Hân | 250 | 1000 | 6.50 | 10 | **+18** | 1018 |
| 6 | Phạm Trường Hải | 200 | 1000 | 6.50 | 6 | **+9** | 1009 |
| 7 | Nguyễn Minh Phương | 200 | 1000 | 6.50 | 6 | **+9** | 1009 |
| 8 | Nguyễn Ngọc Trí Anh | 200 | 1000 | 6.50 | 6 | **+9** | 1009 |
| 9 | Nguyễn Minh Vũ | 200 | 1000 | 6.50 | 6 | **+9** | 1009 |
| 10 | Lưu Phương Linh | 200 | 1000 | 6.50 | 6 | **+9** | 1009 |
| 11 | Nguyễn Ngọc Hải Linh | 150 | 1000 | 6.50 | 2 | **+0** | 1000 |
| 12 | Vũ Lê Bình | 150 | 1000 | 6.50 | 2 | **+0** | 1000 |
| 13 | Hoàng Nhật Minh | 150 | 1000 | 6.50 | 2 | **+0** | 1000 |
| 14 | Nguyễn Quỳnh Anh | 100 | 1000 | 6.50 | 0 | **−5** | 995 |

Phân bố điểm thô: 300 (×2) · 250 (×3) · 200 (×5) · 150 (×3) · 100 (×1).

### 1.4 Giải từng dòng (bằng tay, khớp bảng)

**Thái Dương — điểm 300 (cao nhất):**
- **A** = vượt 12 bạn dưới + hoà 1 bạn cũng 300 = `12 + 0.5 = 12.5`
- Δ = `clamp(30 × (12.5 − 6.5) / 13, ±20) + 10` = `clamp(13.85, ±20) + 10` = `13.85 + 10` = **23.85 → +24** ✓

**Phạm Trường Hải — điểm 200 (giữa bảng):**
- **A** = vượt 4 bạn dưới (150×3, 100×1) + hoà 4 bạn cùng 200 = `4 + 2 = 6`
- Δ = `30 × (6 − 6.5) / 13 + 10` = `−1.15 + 10` = **8.85 → +9** ✓ *(A ≈ E ⇒ Δ ≈ P = 10)*

**Nguyễn Quỳnh Anh — điểm 100 (thấp nhất, một mình):**
- **A** = không vượt ai, không hoà ai = `0`
- Δ = `30 × (0 − 6.5) / 13 + 10` = `−15 + 10` = **−5** → Elo `995` ✓

👉 Bài học đọc bảng: **A > E ⇒ Δ > +10** (lên hạng) · **A ≈ E ⇒ Δ ≈ +10** (đúng phận) · **A < E ⇒ Δ < +10, có thể âm** (tụt).

### 1.5 Tính chất (đã kiểm trên 1852 lượt thật)

- **Mốc thắng-thua là +10, không phải 0.** P=10 dời mốc để HS làm đúng-kỳ-vọng vẫn thấy số dương (không nản). Trên +10 = lên trình; dưới +10 = tụt.
- **Underdog:** cùng điểm thô, ai Elo **thấp hơn** ăn **nhiều hơn** (đánh bại kỳ vọng thấp của mình). *(Ở ví dụ trên mọi Elo = 1000 nên chưa thấy; buổi sau sẽ thấy.)*
- **Hoà cả lớp:** ai Elo cao +ít, ai Elo thấp +nhiều, **không ai âm**.
- **Elo CÓ THỂ âm** khi hụt kỳ vọng mạnh (như Quỳnh Anh −5). Đúng bản chất "thước trình".
- **Đơn điệu theo điểm** gần như tuyệt đối; ngoại lệ hiếm = HS Elo rất cao đạt điểm cao *nhưng chỉ hoà ở đỉnh* → coi là "không đạt kỳ vọng" (thắng-kỳ-vọng quan trọng hơn điểm thô — đây là **đặc tính**, không phải lỗi).

### 1.6 Nguồn & reset
- **Chỉ ET** vào Elo. Ingame (chấm lớp) và MT (kiểm tra tháng) **chưa** tính vào Elo.
- **Reset: niên khóa, 1/7 hằng năm.** Dự kiến **soft-reset** (không về phẳng 1000 mà seed theo hạng mùa cũ) — *chưa build, làm trước 1/7/2027*.

---

## 2. EXP — thước chăm chỉ

### 2.1 Ý tưởng
**EXP = chăm chỉ, KHÔNG phải giỏi.** Tính **theo THÁNG**, cho mỗi (HS × môn). Phần "so với lớp" reset mỗi tháng; tổng EXP tích luỹ trong **mùa** để lên **Level**. EXP luôn ≥ 0.

**3 nguồn:** ET (đi học + xếp hạng) + BTVN (nộp bài + thái độ) + MT (điểm kiểm tra tháng).

### 2.2 Công thức

**① ET — hạng buổi → EXP** (`etRankExp`): dải `ET_BANDS = [300, 285, 270, 250, 225, 200]` (6 bậc, tách đỉnh gộp đáy). Buổi >6 HS: hạng 1→300, hạng 2→285, hạng 3..N rải đều 4 bậc cuối `[270, 250, 225, 200]`.

**② BTVN — mỗi bài (1 buổi)** = `300 × timing × thái_độ`:

| Timing (thời điểm nộp) | hệ số | | Thái độ | hệ số |
|---|---|---|---|---|
| nộp đúng hạn | 1.0 | | nghiêm túc | 1.0 |
| nộp muộn | 0.9 | | chưa hết sức | 0.9 |
| xin phép / **không làm** | **0** | | chưa nghiêm túc | 0.7 |
| | | | chống đối | **0** |

**Điều chỉnh cuối tháng** (trên `subtotal` = Σ điểm BTVN cả tháng — **KHÔNG phải từng buổi**):
- `+5%` nếu **không bỏ buổi nào** (full-month).
- `+5%` nếu **độ-đúng TB tháng** của HS vượt lớp **> 5%** · `−5%` nếu kém lớp **> 10%**.
- `−5% × (số bài không làm)`.
- (*Độ-đúng TB tháng* = trung bình cộng độ-đúng của từng buổi BTVN.)

**③ MT — điểm thang 10** (`mtExp`): `EXP = 1000 − ((topĐiểmLớp − điểm)/0.25) × 50`, sàn 0. Top lớp = 1000; tụt mỗi 0.25đ = −50. *(Chưa nối nguồn topĐiểm tự động.)*

### 2.3 VÍ DỤ THẬT — **Thái Dương**, 9A1, Toán, **tháng 7/2026**

**① ET (12 buổi):**

| Ngày | Hạng | EXP | | Ngày | Hạng | EXP |
|---|---|---|---|---|---|---|
| 1/7 | 1/14 | 300 | | 17/7 | 12/13 | 200 |
| 3/7 | 1/15 | 300 | | 20/7 | 14/15 | 200 |
| 6/7 | 10/15 | 225 | | 22/7 | 10/13 | 225 |
| 10/7 | 7/12 | 250 | | 24/7 | 9/14 | 225 |
| 13/7 | 1/15 | 300 | | 27/7 | 7/14 | 250 |
| 15/7 | 14/15 | 200 | | 29/7 | 1/14 | 300 |

**ET tổng = 2975**

**② BTVN (11 bài):** 9 bài *đúng hạn · nghiêm túc* = 300 mỗi bài; 2 bài (10/7, 13/7) *đúng hạn · chưa hết sức* = 270.
- `subtotal = 9×300 + 2×270 = 3240`
- `full-month +5%` (0 buổi bỏ) = `+162`
- `độ-đúng HS 0.845` vs `lớp 0.874` → chênh −2.9%, **trong ngưỡng** → classHi/Lo = `0`
- `miss = 0` → missPenalty = `0`
- **BTVN tổng tháng = 3240 + 162 = 3402**

**③ MT** = 0 (chưa nhập điểm thang-10).

> **TỔNG THÁNG = ET 2975 + BTVN 3402 + MT 0 = `6377`** — **khớp đúng** dòng `gami_exp_ledger` đã lưu (source=`exp_thang`, note=`2026-07`). ✅

### 2.4 LEVEL
Hàm thuần của **EXP tích-luỹ-trong-MÙA** (per môn). `MAX 21` mốc · `BASE_COST 1100` (EXP lên level 1→2) · `GROWTH 0.15` (mỗi level kế đắt thêm 15%). 21 level → gộp thành **7 bậc avatar** (mỗi bậc 3 level). Reset mỗi mùa; huy hiệu/thành tựu giữ vĩnh viễn.

---

## 3. Lưu trữ & kiến trúc

- **Chân lý = `gami_grades`** (điểm thô từng câu). Elo/EXP đều **suy ra** từ đây.
- **Cache (suy ra, ghi lại để đọc nhanh):**
  - `gami_elo` — Elo hiện tại + `sessions_played`, per (HS × môn).
  - `gami_elo_history` — mỗi buổi: `elo_before/after · expected · actual · delta · rank · rank_total`.
  - `gami_exp_ledger` — dòng EXP (`exp_thang` theo tháng · `attend_floor` buổi bù).
- **Engine = MỘT hàm duy nhất** `computeEloUpdate` (elo.js), gọi qua `replayEloEvents` (replay.js). Recalc toàn bộ = `scripts/recalc_elo.mjs`. Test bất biến = `scripts/_test_elo_logic.mjs`.
- **Hướng Mức 2 (pure-derive):** đóng/mở/sửa buổi → *recompute-forward* thay vì vá delta → tự lành, không hoá thạch. Lõi đã xong; wiring đường live chờ phiên riêng (cần RPC atomic + test đóng buổi thật).

---

## 4. Thuật ngữ nhanh (cho training)

| Từ | Nghĩa |
|---|---|
| **ET** | Entry Test — bài đầu buổi, chấm đúng/gần đúng/sai; **nguồn Elo + 1 phần EXP** |
| **MT** | Monthly Test — kiểm tra tháng, điểm thang 10; nguồn EXP (Elo: chưa) |
| **BTVN** | Bài tập về nhà — nộp + thái độ; **nguồn EXP** (không vào Elo vì làm ở nhà) |
| **Ingame** | Chấm bài trên lớp; hiện **không** vào Elo/EXP-model-tháng |
| **điểm thô** | Tổng điểm câu ET (đúng 100 · gần đúng 50 · sai 0) |
| **A / E** | Thực-tế / Kỳ-vọng số bạn vượt trong buổi |
| **Δ (delta)** | Elo thay đổi sau buổi |
| **hạng buổi** | Xếp theo điểm thô giảm dần (hoà → Δ Elo lớn xếp trên) |

---

## 5. Chưa xong / còn chờ

| Việc | Ghi chú |
|---|---|
| Mức 2 wiring đường live | recompute-forward + RPC atomic + runtime test |
| Soft-reset niên khóa | công thức seed + móc chạy, trước 1/7/2027 |
| MT vào Elo | chờ điểm thang-10 ổn (MT_WEIGHT=4 đã sẵn) |
| MT vào EXP | `mtExp` sẵn, cần nguồn topĐiểm lớp |
| ingame vào Elo | chờ data chấm-lớp ổn định |
| `sessions_played` dựng lại sau recalc | semantics đang mờ |
