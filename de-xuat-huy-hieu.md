# Đề xuất HUY HIỆU + MA TRẬN Thành tựu × Huy hiệu (detail C6) — CTO, 28/09/2026 · bản nháp 1 · môn TOÁN

> Logic đã chốt ở `spec-thanh-tuu-nhiem-vu.md` A5:
> - Huy hiệu 5★ tuần tự, vĩnh viễn, theo môn.
> - 3 phương diện: Chăm chỉ / Thành tích / Tiến bộ.
> - Tầng 1 (1–3★) = điều kiện đơn, bản mềm. Tầng 2 (4–5★) = nhiều điều kiện, **bản cứng GV trao**.
> - Thành tựu ↔ Huy hiệu **N–N**.
>
> **Giả định trong nháp này** (chờ Thùy ở H7 · H8):
> - 4★ = đạt đủ bộ điều kiện trong **1 tháng**.
> - 5★ = đạt đủ bộ điều kiện 5★ **3 tháng liên tiếp**.
> - Đạt lại thì bản mềm ghi ×2, bản cứng chỉ trao lần đầu.
>
> **Số đo nền (DB):** Toán mỗi em/tháng ~5–6 buổi · ~5 ET · ~5 BTVN · 1 MT. Mọi ngưỡng là **nháp**, sẽ mô phỏng số bản cứng/tháng trước khi chốt.

---

## 1. TẦNG 1 — 1★ / 2★ / 3★ (điều kiện đơn · bản mềm)

Mỗi ô = 1 dòng huy hiệu. Mỗi sao = **1 thành tựu** (quan hệ 1–1 nên không cần ma trận).

| Hoạt động | 🔥 Chăm chỉ | ⭐ Thành tích | 📈 Tiến bộ |
|---|---|---|---|
| 🏫 **Trên lớp** | **Không Nghỉ** — chuỗi buổi có mặt liên tục: **10 / 30 / 60** | **Lên Tay** — số bài ET đúng ≥ 80%: **3 / 15 / 40** | **Vững Bước** — số tháng ET tốt hơn tháng trước (hoặc giữ ≥ 90%): **1 / 3 / 6** |
| 📝 **BTVN** | **Đúng Hẹn** — chuỗi BTVN nộp đủ, đúng hạn: **10 / 30 / 60** | **Bài Đẹp** — số bài BTVN đúng ≥ 90%: **5 / 20 / 50** | **Khá Lên** — số tháng tỉ lệ đúng BTVN tăng (hoặc giữ ≥ 90%): **1 / 3 / 6** |
| 🎯 **MT** | **Dạn Dày** — số kỳ MT đã dự (kể cả thi lại): **1 / 4 / 8** | **Tốp Đầu** — số lần MT vào top 30% khối: **1 / 3 / 6** | **Bứt Phá** — số lần hạng MT tăng so với tháng trước: **1 / 3 / 6** |
| 💪 **Thử thách** | **Bền Bỉ** — tổng số ngày pass Thử thách: **10 / 40 / 100** | **Tuyệt Đối** — số lượt 10/10: **5 / 25 / 80** | **Lên Tầm** — số tháng tỉ lệ pass tăng (hoặc giữ ≥ 90%): **1 / 3 / 6** |
| 👑 **Kiến thức (dạng)** | **Khai Phá** — số dạng đã luyện ≥ 5 câu: **10 / 30 / 60** | **Kho Dạng** — số dạng đạt: **5 / 20 / 50** | **Lấp Lỗ** — số dạng từ yếu → đạt: **1 / 5 / 15** |
| 🏆 **Rank** | — | **Leo Rank** — bậc cao nhất trong năm: **Captain / Hero / King** | **Vượt Lên** — số tháng tăng hạng bảng đua tháng: **1 / 3 / 6** |
| 📜 **Nhiệm vụ** | **Về Đích** — số tháng xong chặng 30 cấp: **1 / 3 / 6** | — | — |

⇒ **18 dòng huy hiệu tầng 1 × 3 sao = 54 huy hiệu bản mềm.**

Tên huy hiệu là tên tạm. Theme "người thường → thần" có thể áp lên tên sau.

---

## 2. TẦNG 2 — 4★ / 5★: MA TRẬN Thành tựu × Huy hiệu (nhiều điều kiện · bản cứng)

**3 huy hiệu lớn:** 🔥 **CHĂM CHỈ** · ⭐ **THÀNH TÍCH** · 📈 **TIẾN BỘ**.

- ✓ = thành tựu đó là **điều kiện** của cấp huy hiệu đó.
- Mỗi cấp cần **đạt TẤT CẢ ô ✓** trong cột.
- Mọi thành tựu dưới đây tính **trong 1 tháng**. Cột 5★ = đạt đủ cột đó **3 tháng liên tiếp**.

| # | Thành tựu (xét trong 1 tháng) | 🔥 4★ | 🔥 5★ | ⭐ 4★ | ⭐ 5★ | 📈 4★ | 📈 5★ |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|
| A1 | Đi học **đủ mọi buổi** (vắng thì đã học bù) | ✓ | ✓ | | ✓ | | |
| A2 | Nộp **đủ, đúng hạn** mọi BTVN | ✓ | ✓ | | ✓ | ✓ | ✓ |
| A3 | Tự luyện ≥ **100** câu đúng | ✓ | | | | | |
| A4 | Tự luyện ≥ **200** câu đúng | | ✓ | | | | |
| A5 | Pass Thử thách ≥ **10** ngày | ✓ | | | | | |
| A6 | Pass Thử thách ≥ **15** ngày | | ✓ | | | ✓ | ✓ |
| A7 | Xong **chặng nhiệm vụ 30 cấp** | | ✓ | | | | |
| B1 | ET đúng ≥ 80% ở **≥ 3/4 số bài ET** | | | ✓ | ✓ | | |
| B2 | MT **top 30%** khối | | | ✓ | | | |
| B3 | MT **top 10%** khối | | | | ✓ | | |
| B4 | BTVN đúng TB ≥ **85%** | | | ✓ | | | |
| B5 | BTVN đúng TB ≥ **90%** | | | | ✓ | | |
| B6 | ≥ **5** lượt Thử thách 10/10 | | | ✓ | | | |
| B7 | **Top 10%** bảng đua tháng khối | | | | ✓ | | |
| C1 | Hạng MT **tăng** so với tháng trước (hoặc giữ top 10%) | | | | | ✓ | ✓ |
| C2 | Tỉ lệ đúng BTVN **tăng ≥ 5 điểm** (hoặc giữ ≥ 90%) | | | | | ✓ | ✓ |
| C3 | Lấp ≥ **1** lỗ (yếu → đạt) | | | | | ✓ | |
| C4 | Lấp ≥ **2** lỗ | | | | | | ✓ |
| C5 | Hạng bảng đua tháng **tăng** (hoặc giữ top 10%) | | | | | | ✓ |
| | **Số điều kiện** | **4** | **5** | **4** | **6** | **5** | **6** |

**Đọc ma trận theo chiều N–N:**

- **1 huy hiệu ← nhiều thành tựu.** Ví dụ 🔥 Chăm chỉ 5★ = A1 + A2 + A4 + A6 + A7, giữ 3 tháng liền. Đúng ví dụ của Thùy: đi học đủ + BTVN đủ + tự luyện + Thử thách đủ số lượng.
- **1 thành tựu → nhiều huy hiệu:**
  - **A2** (BTVN đủ, đúng hạn) nằm trong 5 cột. Chăm chỉ ai cũng cần; Thành tích 5★ và Tiến bộ cũng đòi, vì giỏi hay tiến bộ mà bỏ bài thì không tính.
  - **A6** (Thử thách 15 ngày) nuôi cả Chăm chỉ 5★ lẫn Tiến bộ 4★ / 5★.
  - **A1** (đi học đủ) cũng là điều kiện của Thành tích 5★.
- **Em yếu vẫn có đường tới bản cứng:** cột 📈 Tiến bộ không đòi điểm cao hay top. Chỉ đòi **hơn chính em** + làm bài đủ + luyện đều.

---

## 3. Ngoài ma trận

- 🤝 **Tập thể lớp:** "Lớp Vô Địch": cả lớp nhận khi lớp **thắng đua lớp tháng**. Sao theo số tháng thắng: 1 / 3 / 6. Bản mềm.
- ✨ **Bí ẩn** (ẩn tới khi đạt, 1 lần, bản mềm):
  - **Thám Tử Đề** — báo sai đề, được xác nhận đúng.
  - **Thần May Mắn** — trúng trà sữa ở game buổi.
  - **Lội Ngược Dòng** — từ nửa dưới lớp lên Nhất buổi trong 4 buổi.
  - **Chạm Đáy Bật Lên** — tháng trước chưa có sao Tiến bộ nào, tháng này đạt Tiến bộ 4★.
- 🎉 **Kỷ niệm:** huy hiệu sự kiện (vd Trung thu 2026) · huy hiệu mùa rank ("Mùa 2026–27").

---

## 4. Tổng quan album Toán

| Tầng | Số huy hiệu | Dạng |
|---|---|---|
| Tầng 1 — 18 dòng × 3 sao | 54 | Bản mềm |
| Tầng 2 — 3 huy hiệu × 2 sao | 6 | Bản mềm + **bản cứng (6 mẫu)** |
| Tập thể + Bí ẩn + Kỷ niệm | ~8+ | Bản mềm |
| **Tổng** | **~68** | Album "Toán: x / 68" |

**Xu** (thứ yếu, trần 5 xu / tháng / môn): chỉ từ **3★** trở lên có EXP.
- 3★ = +100 EXP.
- 4★ = +200 EXP.
- 5★ = +300 EXP.
- Chặn ở hàm chốt tháng như đã chốt.

---

## 5. Bước tiếp

1. Thùy duyệt ma trận: thêm / bớt thành tựu, tick lại ô, chỉnh ngưỡng.
2. Chốt **H7** (kỳ xét 4★ = 1 tháng · 5★ = 3 tháng liên tiếp) và **H8** (đạt lại ×2, bản cứng chỉ lần đầu).
3. **Mô phỏng số bản cứng / tháng** trên khối thật (như Điểm Rank), để trung tâm biết cần làm bao nhiêu huy hiệu mỗi mẫu.
