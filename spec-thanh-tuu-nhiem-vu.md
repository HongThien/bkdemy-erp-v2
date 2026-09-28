# Spec — Gamification HS: RANK · DANH HIỆU TOP DẠNG · THÀNH TỰU · NHIỆM VỤ · ĐUA LỚP — v4 (LOGIC)

> **Trạng thái: v4 — LOGIC ĐÃ CHỐT (Thùy chốt L1–L4 ngày 28/09/2026).** Bước tiếp: bàn detail Phần C. Chưa code.
>
> **Luật tài liệu (Thùy 28/09):** *"Chốt logic thiết kế trước. Detail từng cái bàn sau. Đừng lẫn."*
> - **Phần A** chỉ gồm: có những cấu phần gì, điểm lấy từ đâu, cái gì nối với cái gì.
> - **Mọi con số / tên gọi / danh mục** nằm ở **Phần C (danh sách bàn sau)**, chưa có nội dung.
> - **Ngoại lệ duy nhất:** bảng điểm MT theo thứ hạng (Thùy yêu cầu làm luôn) đặt ở **Phụ lục**, tách hẳn khỏi phần logic.
>
> **Lịch sử (git):**
> - **v1** `b52a4eb` — khung app học. Bị bác.
> - **v2** `123fb12` — khung game, dựa Liên Quân. Thùy sửa 4 ý.
> - **v3** `24eafcc` — Điểm Rank từ mọi hoạt động, thành tựu lên bậc tuần tự, bỏ tên Liên Quân, bỏ chống cày.
> - **v4 (bản này)** — Thùy sửa nguồn Điểm Rank:
>   - Bỏ có mặt / bài trên lớp / lên bảng.
>   - Thay bằng **ET + BTVN (điểm cố định)** và **MT (theo thứ hạng)**.
>   - Thêm **Thử thách** — kiểu tự luyện thứ 3, pass ≥80% mới có điểm, có trần ngày/tháng, chiếm ~20% Điểm Rank.
>   - Tách logic khỏi detail.
>
> **Nguyên tắc chung (đã chốt trước):**
> - Lấy **cơ chế** game (cày cuốc, đua top), **không lấy tên** của game nào.
> - Không chống cày ở phần luyện thường. HS cày càng nhiều càng tốt.
> - Mọi dữ liệu học tập **theo môn** (§1.6 CLAUDE.md).

---

## PHẦN A — LOGIC THIẾT KẾ

### A0. Bản đồ hệ thống

```
                ┌───────────── HOẠT ĐỘNG HỌC (theo môn) ─────────────┐
                │  ET · BTVN · MT · Thử thách (app)   │  mọi câu đúng │
                └──────────────┬──────────────────────┴──────┬────────┘
                               ▼                             ▼
                        ① ĐIỂM RANK                   ② ĐIỂM DẠNG
                     (tích luỹ trong mùa)       (theo từng dạng × khối)
                               ▼                             ▼
                     BẬC RANK MÙA + ghế đỉnh      DANH HIỆU TOP DẠNG (chốt tuần)
                               │                             │
                               └────────────┬────────────────┘
                                            ▼
                                   KHOE (TV lớp · app)
                                   1 danh hiệu + 3 huy hiệu + khung rank

   ③ THÀNH TỰU   — đếm hoạt động, mỗi thành tựu lên bậc tuần tự, không bao giờ mất
   ④ NHIỆM VỤ    — ngày / tuần / tháng, phủ mọi hoạt động → phần thưởng
   ⑤ ĐUA LỚP     — Điểm Rank của lớp so với lớp cùng khối, cùng môn
```

**Ba loại "điểm" tách biệt, không quy đổi sang nhau:**

| Điểm | Dùng để | Đổi ra xu? |
|---|---|---|
| **Điểm Rank** | Leo bậc rank mùa, tranh ghế đỉnh, đua lớp | **Không** |
| **Điểm Dạng** | Tranh danh hiệu top từng dạng | **Không** |
| **EXP → xu** (hệ có sẵn) | Phần thưởng của nhiệm vụ / thành tựu | Có (chốt tháng như hiện nay) |

### A1. ① ĐIỂM RANK — đúng 4 nguồn

| Nguồn | Cách tính (logic) | Tính chất |
|---|---|---|
| **ET** | Mỗi bài ET → **điểm cố định** | Fix |
| **BTVN** | Mỗi bài BTVN → **điểm cố định** | Fix |
| **MT** | **Chỉ bài MT sát hạch tại trung tâm** (`ky_thi.loai='mt_sat_hach'`). Mỗi tháng xếp hạng trong **khối × môn** theo logic bảng xếp hạng MT đang có (`fn_bxh_diem_mt_khoi`: TB điểm MT trong cửa sổ 25 tháng này → hết mùng 10 tháng sau). Thứ hạng → điểm theo **bảng hạng 1–50** (Phụ lục) | Tương đối: phân biệt giỏi/yếu nhưng không cách quá xa |
| **Thử thách** (A2) | Chỉ khi **pass** (≥80% đúng). Đúng càng nhiều càng được nhiều. Có **trần ngày + trần tháng** | Có trần. **Tổng ≈ 20% Điểm Rank** |

- **Chỉ 4 nguồn trên** (L1 — Thùy chốt).
  - **Không** cộng Điểm Rank: có mặt, bài trên lớp (ingame), lên bảng, **bổ trợ**, Học từ đầu, dạng lên đạt.
  - **Không** tính: thi trên trường (`ky_thi.loai='truong'`), khảo sát tháng.
- **Thưởng nhiệm vụ / thành tựu KHÔNG cộng Điểm Rank** (L2 — Thùy chốt). Các hoạt động ngoài 4 nguồn vẫn được thưởng qua nhiệm vụ / thành tựu (EXP → xu, đồ).
- **MT — chỉ em CÓ điểm MT thật mới nhận điểm** (§1.5).
  - `fn_bxh_diem_mt_khoi` hiện xếp cả em chưa thi, coi là 0đ, đứng cuối bảng, để hiển thị bảng xếp hạng.
  - Khi đổi hạng ra Điểm Rank, em không có điểm trong cửa sổ = **không có dòng điểm**, không phải "hạng cuối được 50".
- **Luật 20%:**
  - Trần tháng của Thử thách = **¼ × tổng điểm tối đa ET + BTVN + MT kỳ vọng trong tháng**.
  - ⇒ HS kịch trần thì Thử thách ≈ 20%, ba nguồn kia ≈ 80%.
  - Con số cụ thể suy ra từ công thức này khi chốt điểm fix (Phần C).
- Điểm Rank **chỉ cộng trong mùa**, không trừ.
- **Mỗi môn RIÊNG hoàn toàn** (Thùy 28/09): Điểm Rank, ngưỡng bậc, ghế đỉnh, bảng xếp hạng đều **theo môn**. Không có gì so chung giữa các môn.
  - Hồ sơ HS ghi *"rank X Toán · rank Y KHTN"*.
  - Mỗi môn **một bộ cấu hình** (điểm, trần, ngưỡng) theo **cùng công thức**.
- **Trần Thử thách CỐ ĐỊNH theo môn** (Thùy 28/09 — HS học offline, không được nghỉ, nên không cần trần "theo chính em").

### A2. THỬ THÁCH — tính năng tự luyện thứ 3

Màn Tự luyện (`TuLuyenChuDe.tsx`) có 3 lựa chọn: **Tổng hợp · Theo chủ đề · Thử thách** *(mới)*.

```
Chọn môn → vào Thử thách (1 lượt GIỐNG HỆT Tự luyện tổng hợp: cùng số câu, cùng cách ra câu — L4 Thùy chốt) → làm → nộp
   ├─ đúng ≥ 80%  → PASS → + Điểm Rank (tăng theo số câu đúng)   [nếu chưa chạm trần ngày/tháng]
   └─ đúng < 80%  → không pass → 0 Điểm Rank
Mọi câu (pass hay không) vẫn tính vào mastery và Điểm Dạng như câu tự luyện thường.
```

- **Số lượt Thử thách VÔ HẠN — chỉ ĐIỂM có trần** (Thùy 28/09). Em yếu cứ làm tới khi pass.
- **Chạm trần** ngày/tháng thì vẫn làm Thử thách được, chỉ không cộng thêm Điểm Rank. App báo rõ "Hôm nay em đã lấy đủ điểm Thử thách".
- Theo môn: mỗi môn có trần riêng.

### A3. RANK MÙA

- **Bậc** = f(Điểm Rank tích luỹ trong mùa). **Lên tuần tự**, chỉ lên, không tụt trong mùa.
- **Bậc đỉnh = ghế có hạn:**
  - Điều kiện: Top N Điểm Rank trong **khối × môn**, **và** đạt sàn của bậc ngay dưới.
  - Chốt hằng ngày. Bị vượt thì rơi xuống.
  - Đây là **chỗ duy nhất có tụt**.
- **Mùa:**
  - Thưởng cuối mùa theo **bậc cao nhất** đạt được, là đồ mang tên mùa nên hiếm vĩnh viễn.
  - Mùa mới reset mềm: khởi đầu thấp hơn bậc cũ.
- **Elo giữ nguyên** cho việc đang dùng, **không liên quan** rank.

### A4. DANH HIỆU TOP DẠNG

- **Điểm Dạng** (HS × dạng × môn): cộng theo **câu đúng của dạng đó từ mọi nguồn** (ET, BTVN, MT, tự luyện, Thử thách, bổ trợ…).
- **Phạm vi = khối × môn.** Danh hiệu nhiều cấp: top % → top 3 → số 1 dạng; số 1 môn tính theo tháng.
- **Chốt mỗi tuần.** Bị vượt thì mất danh hiệu và có thông báo kèm nút "luyện dạng này".
- Có **điểm sàn**, để dạng ít người làm không ra top "rẻ".
- Bỏ luyện lâu thì **chỉ điểm đua** giảm. **Mastery không bao giờ giảm.**

### A5. THÀNH TỰU

- Mỗi thành tựu **tự lên bậc tuần tự** Đồng → Bạc → Vàng → Kim Cương (hết bậc này mới hiện bậc sau). **Đạt rồi không bao giờ mất.**
- Chia **nhóm theo mảng hoạt động:** trên lớp · BTVN · thi (MT) · tự luyện / Thử thách · chinh phục dạng · nhiệm vụ. Thêm nhóm ẩn / kỷ niệm (hết mùa thì khoá).
- Thưởng mỗi bậc: EXP / xu / đồ trang trí (Phần C).
- Mỗi thẻ hiện "N bạn trong khối đã đạt".

### A6. NHIỆM VỤ ngày / tuần / tháng

- **Phủ mọi hoạt động:** trên lớp (ET), BTVN, MT / thi, tự luyện, Thử thách, sửa sai, danh hiệu dạng. **Không riêng app.**
- **Ngày:** vài nhiệm vụ, mỗi nhiệm vụ **sống 3 ngày**.
- **Tuần:** vài nhiệm vụ, **chưa làm thì dồn tới hết tháng**. Làm đủ số nhiệm vụ trong tuần thì mở **rương tuần**.
- **Tháng:** một **chặng nhiều cấp**, cấp nào cũng có quà. Có nhiệm vụ tháng gắn với MT.
- Số nhiệm vụ mỗi kỳ **cố định** ⇒ lượng xu phát ra tự có trần.

### A7. ĐUA LỚP

- Các lớp **cùng khối, cùng môn** đua với nhau.
- **Điểm lớp** = Điểm Rank lớp kiếm được trong kỳ ÷ sĩ số.
- Có mốc quà tập thể (em nào có đóng góp cũng nhận) và vinh danh lớp nhất tháng trên TV.

### A8. KHOE

- HS **tự chọn** 1 danh hiệu + 3 huy hiệu thành tựu. Khung avatar theo bậc rank.
- Hiện ở TV lớp (công bố xếp hạng buổi, game buổi), màn thành tích chiếu TV, và header app.
- TV **chỉ xướng tên top**. Hạng thấp chỉ em đó thấy trong app của mình.

### A9. Ràng buộc kỹ thuật (khớp CLAUDE.md)

- **Mọi phép tính ở Postgres (`fn_*`), client chỉ gọi RPC** (§2.0).
- Điểm Rank, Điểm Dạng, tiến độ thành tựu / nhiệm vụ đều **suy động** từ bảng đo (§1.5, §4). Không có bảng `tasks`, không đẻ dòng chờ.
- **Chỉ ghi dòng khi có sự kiện thật:**
  - thành tựu đạt,
  - kết quả chốt (danh hiệu tuần, ghế đỉnh, bậc cuối mùa),
  - thưởng đã phát,
  - lượt Thử thách pass (để tính trần).
- Mọi thứ mang nhãn `mon`, 4 môn chạy y hệt nhau.
- Trọng số, trần, ngưỡng nằm ở **bảng cấu hình**, không viết cứng trong hàm.

---

## PHẦN B — CÂU LOGIC — ✅ ĐÃ CHỐT (Thùy, 28/09/2026)

| # | Câu hỏi | Thùy chốt |
|---|---|---|
| **L1** | Điểm Rank chỉ 4 nguồn hay cả bổ trợ / Học từ đầu / dạng lên đạt? | **Chỉ 4 nguồn** (ET, BTVN, MT, Thử thách). **Bổ trợ không cộng rank** |
| **L2** | Thưởng nhiệm vụ / thành tựu có cộng Điểm Rank? | **Không** |
| **L3** | MT = bài MT sát hạch tháng? Thi trường có tính? | **Đúng, MT = MT sát hạch tại trung tâm. Thi trên trường không tính** |
| **L4** | Thử thách = 1 lượt như Tự luyện tổng hợp, chỉ thêm luật pass 80% + điểm rank? | **Đúng** |

---

## PHẦN C — DETAIL: BÀN SAU (chưa có nội dung, cố ý để trống)

> **28/09:** C1 · C2 · C3 (xem trước C4) đã có **đề xuất + mô phỏng 3 tháng** ở `phan-tich-diem-rank.md` (chạy lại bằng `scripts/sim-diem-rank.mjs`).
> **Đã chốt 28/09 (C1 · C2 · C3):**
> - D1: ET 100 · BTVN 100 / 50 · MT bảng × 10 · Thử thách 10 / 20 / 30.
> - D2: trần Thử thách cố định = ¼.
> - D3: trần ngày = tháng ÷ 20.
> - D4: quy hạng MT theo sĩ số dự thi.
> - D5: mỗi môn riêng.
> - D6: lỡ MT thì thi lại.
> - Q-A: giữ nguyên (Thử thách vô hạn lượt).
>
> **Bước tiếp — C4:** mô phỏng cho thấy mùa 3 tháng làm 2 tháng đầu cả khối cùng bậc ⇒ đề xuất **mùa = 1 tháng** (chờ chốt). Số đo DB: BK có **1 cơ sở** ⇒ không cần tầng cơ sở (A4).

| # | Việc | Thuộc |
|---|---|---|
| C1 | Điểm cố định của 1 ET, 1 BTVN (có phụ thuộc kết quả/thái độ không) | A1 |
| C2 | MT: hạng > 50 được bao nhiêu · khối < 50 HS xử lý thế nào · hoà hạng | A1 / Phụ lục |
| C3 | Thử thách: số câu/lượt · công thức điểm theo số câu đúng · trần ngày · trần tháng (suy từ luật 20%) | A2 |
| C4 | Số bậc rank, ngưỡng từng bậc, N ghế đỉnh, độ dài mùa, mức reset | A3 |
| C5 | Cấp danh hiệu dạng (%), điểm sàn, tốc độ giảm điểm đua khi bỏ luyện | A4 |
| C6 | Danh mục thành tựu + ngưỡng từng bậc + thưởng | A5 |
| C7 | Danh sách nhiệm vụ ngày/tuần/tháng + quà từng cấp chặng + rương tuần | A6 |
| C8 | Quà đua lớp | A7 |
| C9 | **Theme + toàn bộ tên gọi** (điểm, bậc, danh hiệu, nhóm, nhiệm vụ, chặng, rương) | tất cả |
| C10 | Ngân sách xu / tháng | A6 / A5 |
| C11 | Giao diện các màn | tất cả |
| C12 | Thứ tự build | tất cả |

---

## PHỤ LỤC — Bảng điểm MT theo thứ hạng (detail Thùy yêu cầu làm luôn)

**Phạm vi xếp hạng:** mỗi tháng, trong **khối × môn**, theo `rank_now` của `fn_bxh_diem_mt_khoi`.

**Công thức:** `điểm(h) = round( 50 + 50 × ((51 − h) / 50) ^ 1.5 )` với h = 1…50.

- **Hạng 1 = 100 · hạng 50 = 50.** Đầu bảng gấp đôi cuối bảng, *đủ phân biệt, không cách quá xa*.
- Đường cong **dốc ở đầu, thoải ở cuối:**
  - Tốp đầu mỗi hạng chênh ~1,5 điểm (tranh hạng 1–10 có ý nghĩa).
  - Cuối bảng chênh ~0,2–0,5 điểm (hạng 40 hay 45 gần như nhau, không bị dìm).
- Thang **100** là đơn vị tương đối. Khi chốt điểm fix ET/BTVN (C1) thì nhân cả bảng theo 1 hệ số, **hình dạng giữ nguyên**.

| Hạng | Điểm | Hạng | Điểm | Hạng | Điểm | Hạng | Điểm | Hạng | Điểm |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 100 | 11 | 86 | 21 | 73 | 31 | 63 | 41 | 54 |
| 2 | 99 | 12 | 84 | 22 | 72 | 32 | 62 | 42 | 54 |
| 3 | 97 | 13 | 83 | 23 | 71 | 33 | 61 | 43 | 53 |
| 4 | 96 | 14 | 82 | 24 | 70 | 34 | 60 | 44 | 53 |
| 5 | 94 | 15 | 81 | 25 | 69 | 35 | 59 | 45 | 52 |
| 6 | 93 | 16 | 79 | 26 | 68 | 36 | 58 | 46 | 52 |
| 7 | 91 | 17 | 78 | 27 | 67 | 37 | 57 | 47 | 51 |
| 8 | 90 | 18 | 77 | 28 | 66 | 38 | 57 | 48 | 51 |
| 9 | 88 | 19 | 76 | 29 | 65 | 39 | 56 | 49 | 50 |
| 10 | 87 | 20 | 74 | 30 | 64 | 40 | 55 | 50 | 50 |

*Hạng > 50, khối < 50 HS, hoà hạng: bàn ở C2.*
