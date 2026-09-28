# Đề xuất HUY HIỆU + MA TRẬN Thành tựu × Huy hiệu (detail C6) — CTO, 28/09/2026 · nháp 3 · môn TOÁN

> **Logic** đã chốt ở `spec-thanh-tuu-nhiem-vu.md` A5:
> - **10 loại huy hiệu** (trang album).
> - Mỗi loại có các **dòng** 5★, phủ **3 phương diện** chăm chỉ / thành tích / tiến bộ — đây là góc nhìn khi thiết kế thành tựu.
> - **Sao thấp = điều kiện đơn · sao cao = nhiều điều kiện.**
> - Thành tựu ↔ Huy hiệu **N–N**.
> - Bản cứng từ 4★, **GV trao**.
>
> **Lịch sử:**
> - Nháp 1: dồn 4–5★ vào 3 huy hiệu lớn — **hiểu sai**.
> - Nháp 2: nhóm theo phương diện — Thùy: *"Ý t không phải 3 loại huy hiệu… Huy hiệu 10 loại như ban đầu."*
> - **Nháp 3:** nhóm theo **10 loại**, trong mỗi loại có dòng cho từng phương diện.
>
> **Giả định** (chờ H7 · H8):
> - 4★ = tháng vượt ngưỡng chính phải đạt đủ thành tựu phụ.
> - 5★ = thành tựu phụ đạt **3 tháng liên tiếp**.
> - Đạt lại thì bản mềm ×2, bản cứng chỉ lần đầu.
>
> **Số đo nền (DB):** Toán mỗi em/tháng ~5–6 buổi · ~5 ET · ~5 BTVN · 1 MT. **Mọi ngưỡng là nháp.**

---

> **⭐ PHASE 1 (Thùy 28/09: "nhiều quá bị ngợp, phase này 6–8 cái"):** chỉ **6 huy hiệu cốt lõi** (Không Nghỉ · Đúng Hẹn · Lên Tay · Tốp Đầu · Bứt Phá · Bền Bỉ) **+ 2 tuỳ chọn** (Lấp Lỗ · Leo Rank). Ma trận phase 1: **`ma-tran-thanh-tuu-huy-hieu.xlsx`** (54 thành tựu × 8 huy hiệu, 40 cấp). Tài liệu dưới đây là **bản đầy đủ 10 loại để mở dần** về sau.

---

## 0. TÊN HUY HIỆU PHASE 1 — theo biểu tượng / vị thần / danh nhân (đề xuất 28/09, chờ Thùy chọn bộ)

> Thùy: *"Đặt tên huy hiệu kêu kêu vào — tốt nhất là tên các biểu tượng, các vị thần, các danh nhân tượng trưng cho loại đấy."*
> **Nguyên tắc:** câu chuyện của nhân vật phải **khớp đúng việc huy hiệu ghi nhận**, để HS nghe tên là hiểu, và nhớ luôn câu chuyện.

| Huy hiệu (mô tả) | **Bộ A — Việt Nam** (danh nhân · truyền thuyết HS học trong SGK) | Câu chuyện khớp | **Bộ B — Thần thoại Hy Lạp** (hợp tên rank tiếng Anh) | Câu chuyện khớp |
|---|---|---|---|---|
| Chuỗi đi học liên tục | **Mạc Đĩnh Chi** | Nhà nghèo vẫn bắt đom đóm làm đèn học, không bỏ buổi nào | **Helios** | Thần Mặt Trời — ngày nào cũng mọc, chưa từng nghỉ |
| BTVN đúng hạn | **Sơn Tinh** | Mang sính lễ đến **sớm, đúng hẹn** nên cưới được Mỵ Nương | **Chronos** | Thần Thời Gian |
| ET giỏi trên lớp | **Lương Thế Vinh** | "Trạng Lường" — thần đồng **Toán** | **Athena** | Nữ thần Trí Tuệ |
| MT top khối | **Nguyễn Hiền** | Trạng nguyên trẻ nhất sử Việt, **đỗ đầu năm 12–13 tuổi** — đúng tuổi HS | **Zeus** | Vua của các vị thần, đứng trên đỉnh Olympus |
| Hạng MT tăng (bứt phá) | **Thánh Gióng** | Cậu bé chưa biết nói bỗng **vươn vai thành tráng sĩ** | **Phoenix** | Phượng hoàng tái sinh từ tro, bay vút lên |
| Ngày pass Thử thách | **Thạch Sanh** | Vượt hết **thử thách** này đến thử thách khác (chằn tinh, đại bàng…) | **Hercules** | 12 kỳ công — 12 thử thách |
| *(tuỳ chọn)* Lấp lỗ yếu → đạt | **Nữ Oa** | **Luyện đá vá trời** — lấp chỗ thủng bầu trời | **Hephaestus** | Thần thợ rèn — rèn lại, sửa chỗ hỏng |
| *(tuỳ chọn)* Leo Rank | **Quang Trung** | Áo vải cờ đào → lên ngôi Hoàng đế — đúng mạch "người thường → đỉnh cao" | **Nike** | Nữ thần Chiến Thắng |

**CTO đề xuất: Bộ A — Việt Nam.**
- **Đúng chữ "danh nhân"** Thùy nói. HS đã học các nhân vật này ở SGK.
- Mỗi huy hiệu là **một câu chuyện có sẵn để GV kể** lúc trao bản cứng. Trao huy hiệu Nguyễn Hiền kèm câu "trạng nguyên 12 tuổi" có sức nặng hơn nhiều.
- **Bản sắc riêng BK**, không ai bảo copy game. Bộ Hy Lạp thì game nào cũng dùng.
- Rank dùng tên tiếng Anh (hành trình thành thần), còn huy hiệu dùng danh nhân Việt ⇒ **2 hệ phân biệt rõ**, không lẫn.

**Lưu ý thiết kế hình.** Với danh nhân có thật (Mạc Đĩnh Chi, Lương Thế Vinh, Nguyễn Hiền, Quang Trung), hình huy hiệu dùng **biểu tượng**, không vẽ chân dung:
- Mạc Đĩnh Chi → đom đóm + ngọn đèn.
- Lương Thế Vinh → bàn tính.
- Nguyễn Hiền → mũ trạng nguyên.
- Quang Trung → cờ đào.

Nhân vật truyền thuyết thì vẽ được: Thánh Gióng cưỡi ngựa sắt · Sơn Tinh + núi · Thạch Sanh + cây cung · Nữ Oa vá trời.

**Hiển thị:** tên lớn là **tên nhân vật**, dòng nhỏ bên dưới là **việc cần làm**. Ví dụ:
> **Thánh Gióng ★★★** — *Hạng MT tăng 6 lần*

---

## 1. THÀNH TỰU PHỤ — điều kiện trong 1 tháng, dùng chung cho 4★ / 5★ (N–N)

| Mã | Thành tựu (trong 1 tháng) | Phương diện |
|---|---|---|
| **A1** | Đi học **đủ mọi buổi** (vắng thì đã học bù) | 🔥 |
| **A2** | Nộp **đủ, đúng hạn** mọi BTVN | 🔥 |
| **A3** | Tự luyện ≥ **100** câu đúng | 🔥 |
| **A4** | Tự luyện ≥ **200** câu đúng | 🔥 |
| **A5** | Pass Thử thách ≥ **10** ngày | 🔥 |
| **A6** | Pass Thử thách ≥ **15** ngày | 🔥 |
| **B1** | ET đúng ≥ 80% ở **≥ 3/4 số bài ET** | ⭐ |
| **B2** | MT **top 30%** khối | ⭐ |
| **B3** | MT **top 10%** khối | ⭐ |
| **B4** | BTVN đúng TB ≥ **85%** | ⭐ |
| **B5** | BTVN đúng TB ≥ **90%** | ⭐ |
| **B6** | ≥ **5** lượt Thử thách 10/10 | ⭐ |
| **C1** | Hạng MT **tăng** so với tháng trước (hoặc giữ top 10%) | 📈 |
| **C2** | Tỉ lệ đúng BTVN **tăng ≥ 5 điểm** (hoặc giữ ≥ 90%) | 📈 |
| **C3** | Lấp ≥ **1** lỗ (dạng yếu → đạt) | 📈 |

---

## 2. 10 LOẠI HUY HIỆU

- **1★–3★:** chỉ số chính, điều kiện đơn, bản mềm.
- **4★ / 5★:** chỉ số chính ở mức cao **+** mã thành tựu phụ ở §1. Có bản cứng.

### 1 · 🏫 CHUYÊN CẦN

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Không Nghỉ** | 🔥 | Chuỗi buổi có mặt liên tục | 10 | 30 | 60 | 90 + A2 | 150 + A2 + A6 |

### 2 · 📝 BÀI VỀ NHÀ

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Đúng Hẹn** | 🔥 | Chuỗi BTVN nộp đủ, đúng hạn | 10 | 30 | 60 | 90 + A1 | 150 + A1 + A4 |
| **Bài Đẹp** | ⭐ | Số bài BTVN đúng ≥ 90% | 5 | 20 | 50 | 75 + B1 | 110 + A2 + B1 + B2 |
| **Khá Lên** | 📈 | Số tháng tỉ lệ đúng BTVN tăng (hoặc giữ ≥ 90%) | 1 | 3 | 6 | 8 + A2 | 10 + A2 + C1 |

### 3 · ⚔️ TRÊN LỚP

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Lên Tay** | ⭐ | Số bài ET đúng ≥ 80% | 3 | 15 | 40 | 60 + B4 | 90 + B3 + B5 |
| **Lên Bảng** | ⭐ | Số lần vào Nhất / Nhì / Giải 3 xếp hạng buổi | 3 | 15 | 40 | 60 + B1 | 90 + A1 + B1 |
| **Vững Bước** | 📈 | Số tháng ET tốt hơn tháng trước (hoặc giữ ≥ 90%) | 1 | 3 | 6 | 8 + C2 | 10 + C1 + C2 |

### 4 · 🎯 THI (MT)

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Dạn Dày** | 🔥 | Số kỳ MT đã dự (kể cả thi lại) | 1 | 4 | 8 | 10 + A1 + A2 | 15 + A1 + A2 + A6 |
| **Tốp Đầu** | ⭐ | Số lần MT top 30% khối | 1 | 3 | 6 | 8 + B3 | 10 + B1 + B3 |
| **Bứt Phá** | 📈 | Số lần hạng MT tăng (hoặc giữ top 10%) | 1 | 3 | 6 | 8 + C2 | 10 + C2 + C3 |

### 5 · 💪 THỬ THÁCH

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Bền Bỉ** | 🔥 | Tổng ngày pass Thử thách | 10 | 40 | 100 | 150 + A2 | 250 + A1 + A2 + A4 |
| **Tuyệt Đối** | ⭐ | Số lượt 10/10 | 5 | 25 | 80 | 120 + B1 | 180 + B1 + B5 |
| **Lên Tầm** | 📈 | Số tháng tỉ lệ pass tăng (hoặc giữ ≥ 90%) | 1 | 3 | 6 | 8 + A5 | 10 + A6 + C3 |

### 6 · 👑 CHINH PHỤC DẠNG

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Khai Phá** | 🔥 | Số dạng đã luyện ≥ 5 câu | 10 | 30 | 60 | 90 + A3 | 130 + A4 + A6 |
| **Kho Dạng** | ⭐ | Số dạng đạt | 5 | 20 | 50 | 75 + B6 | 100 + B2 + B6 |
| **Lấp Lỗ** | 📈 | Số dạng từ yếu → đạt | 1 | 5 | 15 | 25 + A2 | 40 + A2 + A6 |

### 7 · 🏆 RANK

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Leo Rank** | ⭐ | Bậc rank cao nhất trong năm | Captain | Hero | King | Emperor | God of War |
| **Vượt Lên** | 📈 | Số tháng tăng hạng bảng đua tháng (hoặc giữ top 10%) | 1 | 3 | 6 | 8 + C1 | 10 + C1 + C3 |

*Leo Rank không cần thành tựu phụ: bậc rank vốn đã gộp ET + BTVN + MT + Thử thách.*

### 8 · 📜 NHIỆM VỤ

| Dòng | Phương diện | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|---|
| **Về Đích** | 🔥 | Số tháng xong chặng nhiệm vụ 30 cấp | 1 | 3 | 6 | 9 + A1 | 12 + A1 + A2 |

### 9 · 🤝 TẬP THỂ LỚP

| Dòng | Chỉ số chính | 1★ | 2★ | 3★ | 4★ | 5★ |
|---|---|---|---|---|---|---|
| **Lớp Vô Địch** | Số tháng lớp thắng đua lớp (**cả lớp cùng nhận**) | 1 | 3 | 6 | 9 | 12 |

### 10 · ✨ BÍ ẨN & KỶ NIỆM (1 lần, ẩn tới khi đạt, bản mềm)

- **Thám Tử Đề** — báo sai đề, được xác nhận đúng.
- **Thần May Mắn** — trúng trà sữa.
- **Lội Ngược Dòng** — từ nửa dưới lớp lên Nhất buổi trong 4 buổi.
- **Chạm Đáy Bật Lên** — tháng trước chưa có sao Tiến bộ nào, tháng này có.
- **Kỷ niệm:** sự kiện (vd Trung thu 2026) · mùa rank ("Mùa 2026–27").

**Ví dụ đọc theo ý Thùy — "Không Nghỉ 5★":** chuỗi 150 buổi có mặt **và** 3 tháng liền vừa nộp đủ BTVN (A2) vừa pass Thử thách ≥ 15 ngày/tháng (A6). Tức là **đi học đủ + BTVN đủ + luyện app đủ số lượng.**

---

## 3. Ma trận N–N — chiều ngược: 1 thành tựu phụ nuôi những huy hiệu nào

| Mã | Nuôi các cấp huy hiệu | Số cấp |
|---|---|---|
| **A2** BTVN đủ, đúng hạn | Không Nghỉ 4–5★ · Bài Đẹp 5★ · Khá Lên 4–5★ · Dạn Dày 4–5★ · Bền Bỉ 4–5★ · Lấp Lỗ 4–5★ · Về Đích 5★ | **12** |
| **A1** Đi học đủ | Đúng Hẹn 4–5★ · Lên Bảng 5★ · Dạn Dày 4–5★ · Bền Bỉ 5★ · Về Đích 4–5★ | 8 |
| **B1** ET ≥ 80% đa số bài | Bài Đẹp 4–5★ · Lên Bảng 4–5★ · Tốp Đầu 5★ · Tuyệt Đối 4–5★ | 7 |
| **A6** Thử thách ≥ 15 ngày | Không Nghỉ 5★ · Dạn Dày 5★ · Lên Tầm 5★ · Khai Phá 5★ · Lấp Lỗ 5★ | 5 |
| **C1** Hạng MT tăng | Khá Lên 5★ · Vững Bước 5★ · Vượt Lên 4–5★ | 4 |
| **C2** BTVN tăng | Vững Bước 4–5★ · Bứt Phá 4–5★ | 4 |
| **C3** Lấp ≥ 1 lỗ | Bứt Phá 5★ · Lên Tầm 5★ · Vượt Lên 5★ | 3 |
| **A4** Tự luyện ≥ 200 | Đúng Hẹn 5★ · Bền Bỉ 5★ · Khai Phá 5★ | 3 |
| **B3** MT top 10% | Lên Tay 5★ · Tốp Đầu 4–5★ | 3 |
| B2 · B5 · B6 | Bài Đẹp / Kho Dạng · Lên Tay / Tuyệt Đối · Kho Dạng | 2 mỗi mã |
| A3 · A5 · B4 | Khai Phá 4★ · Lên Tầm 4★ · Lên Tay 4★ | 1 mỗi mã |

Trên hệ thống, bảng này và §2 là **một màn Ma trận** (hàng thành tựu × cột huy hiệu-sao, tích ô).

---

## 4. Tổng quan album Toán

| Loại | Dòng | Huy hiệu |
|---|---|---|
| 1 Chuyên cần | 1 | 5 |
| 2 Bài về nhà | 3 | 15 |
| 3 Trên lớp | 3 | 15 |
| 4 Thi (MT) | 3 | 15 |
| 5 Thử thách | 3 | 15 |
| 6 Chinh phục dạng | 3 | 15 |
| 7 Rank | 2 | 10 |
| 8 Nhiệm vụ | 1 | 5 |
| 9 Tập thể lớp | 1 | 5 |
| 10 Bí ẩn & Kỷ niệm | — | 4 + sự kiện |
| **Tổng** | **20 dòng** | **~104** |

**Bản cứng:** đề xuất **1 phôi / loại = 10 phôi** (loại 10 không có bản cứng ⇒ thực tế 9 phôi). Tên dòng + 4★ / 5★ phân biệt bằng **tấm sao gắn thêm / màu viền** ⇒ trung tâm dễ sản xuất.

**Xu** (thứ yếu, trần 5 xu / tháng / môn):
- 3★ = +100 EXP.
- 4★ = +200 EXP.
- 5★ = +300 EXP.

---

## 5. Cần Thùy chốt

1. **Duyệt 10 loại + 20 dòng + ngưỡng + thành tựu phụ.** Thêm / bớt / đổi = tích ô trên màn Ma trận.
2. **H7** — 4★ = đủ thành tựu phụ trong tháng vượt ngưỡng · 5★ = đủ 3 tháng liên tiếp.
3. **H8** — đạt lại: bản mềm ×2, bản cứng chỉ lần đầu.
4. **Bản cứng:** 1 phôi / loại + gắn sao?

Sau đó: **mô phỏng số bản cứng / tháng** trên khối thật để chốt ngưỡng 4★ / 5★.
