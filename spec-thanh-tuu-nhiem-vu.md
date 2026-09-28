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

- **Mùa = 1 NĂM** (Thùy 28/09). Thang bậc theo câu chuyện **"người bình thường thành thần"**.
- **Thang 10 bậc (tên đang bàn — `phan-tich-diem-rank.md` vòng 4):**
  - **8 bậc cố định**, mỗi bậc **3 sao**: Novice → Soldier → Captain → General → **Hero** → Legend → King → Emperor.
    - Bậc = f(Điểm Rank cộng dồn trong năm). **Lên tuần tự**, chỉ lên, không tụt trong mùa.
  - **2 bậc ghế** (God of War, Supreme God) — **bậc thần phải ÍT**; đa số chỉ tới bậc 6–7, bậc 8–10 là danh giá:
    - Điều kiện: top trong **khối × môn** **và** **phong độ** cao (điểm từ đầu mùa so với mức tối đa có thể kiếm tới lúc đó).
    - Xét lại hằng ngày, ngồi được quanh năm. Bị vượt thì rơi về bậc cố định.
    - Đây là **chỗ duy nhất có tụt**.
- **Bảng đua tháng** (Thùy 28/09):
  - Xếp hạng Điểm Rank **kiếm được trong tháng** theo khối × môn.
  - Vinh danh top tháng trên TV, gộp với giải thưởng tháng.
  - **Không đổi bậc** — bậc là hành trình cả năm, bảng tháng là cuộc đua mỗi tháng.
- **Hết năm:**
  - Thưởng theo **bậc cao nhất** đạt được trong năm, là đồ mang tên mùa nên hiếm vĩnh viễn.
  - Mùa mới **về lại Novice** ("tái sinh"). Bậc đỉnh năm cũ giữ thành huy hiệu vĩnh viễn.
- **Elo giữ nguyên** cho việc đang dùng, **không liên quan** rank.

### A4. DANH HIỆU TOP DẠNG

- **Điểm Dạng** (HS × dạng × môn): cộng theo **câu đúng của dạng đó từ mọi nguồn** (ET, BTVN, MT, tự luyện, Thử thách, bổ trợ…).
- **Phạm vi = khối × môn.** Danh hiệu nhiều cấp: top % → top 3 → số 1 dạng; số 1 môn tính theo tháng.
- **Chốt mỗi tuần.** Bị vượt thì mất danh hiệu và có thông báo kèm nút "luyện dạng này".
- Có **điểm sàn**, để dạng ít người làm không ra top "rẻ".
- Bỏ luyện lâu thì **chỉ điểm đua** giảm. **Mastery không bao giờ giảm.**

### A5. THÀNH TỰU

> **Thùy 28/09 — định hướng:**
> - Phần thưởng chính của thành tựu là **HUY HIỆU**, xu chỉ là thứ yếu.
> - Hướng tới người thích **sưu tập** (Collector), nhưng gami phải phục vụ **đủ các kiểu người chơi** — không phải ai cũng thích xu.
> - Cùng 1 thành tựu, càng lên cao **huy hiệu càng lên sao**. Ví dụ: đi học liên tục 10 buổi = 1★, 30 buổi = 2★…
> - Có **bộ sưu tập** huy hiệu. **Cấp thấp = bản mềm** trên app; **cấp cao = trung tâm làm BẢN CỨNG tặng HS.**

**A5.1 — Huy hiệu (đơn vị của hệ thành tựu)**

- **1 thành tựu = 1 dòng huy hiệu, 5 sao.** Lên sao **tuần tự** 1★ → 5★: hết sao này mới hiện thanh tiến độ tới sao sau.
- Hình huy hiệu **đổi theo sao**: cùng một hình, sao càng cao càng hoành tráng.
- **Đạt rồi không bao giờ mất.**
- **Không reset** theo mùa rank: huy hiệu là của em mãi mãi. Riêng nhóm Kỷ niệm có huy hiệu giới hạn thời gian.
- **Theo môn** (§1.6): album Toán riêng, album môn khác riêng. Giai đoạn đầu chỉ Toán.

**A5.2 — Bản mềm / bản cứng**

| Sao | Dạng | Trao thế nào |
|---|---|---|
| 1★ – 3★ | **Bản mềm** — hiện trong album + có thể ghim khoe | Tự động khi đạt |
| **4★ – 5★** | Bản mềm **+ BẢN CỨNG** (huy hiệu thật, cài cặp / áo) | Hệ **tự sinh việc "trao huy hiệu"** cho **GV lớp của môn đó** (Thùy chốt). Trao xong bấm **"Đã trao"** (giống nút trà sữa) |

- Việc trao **suy động theo invariant (§4):** *(HS đạt 4★/5★) TRỪ (đã có dòng "đã trao")* = việc còn treo. Không đẻ dòng chờ.
- Ngưỡng 4★ / 5★ phải đặt sao cho **số bản cứng mỗi tháng nằm trong khả năng in / mua** của trung tâm. Sẽ ước lượng bằng mô phỏng như Điểm Rank trước khi chốt.
- Bản cứng là thứ **đeo được ra ngoài lớp** ⇒ khoe offline trước bạn bè, phụ huynh. Đây là lợi thế BK học trực tiếp có mà game online không có.

**A5.3 — Album bộ sưu tập**

- Lưới **mọi dòng huy hiệu × 5 sao**. Sao chưa đạt hiện **bóng mờ**. Huy hiệu bí ẩn hiện **"???"**.
- **% hoàn thành album** (vd "Album Toán: 23 / 60 sao"). Mỗi nhóm có thanh hoàn thành riêng.
- Mỗi huy hiệu đã đạt hiện: ngày đạt · **"N bạn trong khối có"** (hiếm < 10% gắn nhãn *Hiếm*) · đã nhận bản cứng chưa.
- Mục **"Sắp đạt"** ở đầu album: 3–5 huy hiệu gần lên sao nhất, ghi kiểu *"còn 2 buổi nữa"*.

**A5.4 — Phục vụ đủ kiểu người chơi** (Bartle + Collector)

| Kiểu người | Thích | Hệ đáp ứng bằng |
|---|---|---|
| **Collector** — sưu tập | Lấp đầy album | Album % hoàn thành · nhóm huy hiệu · bản cứng để giữ |
| **Achiever** — chinh phục | Mốc khó, sao cao | Dòng 5★ cày cả năm · nhãn *Hiếm* |
| **Competitor** — đua top | Hơn người khác | Huy hiệu gắn **rank / danh hiệu top dạng / bảng đua tháng** |
| **Explorer** — khám phá | Điều bất ngờ | Nhóm **Bí ẩn**: ẩn tới khi đạt |
| **Socializer** — thể hiện | Được nhìn thấy | **Ghim 3 huy hiệu** lên hồ sơ + TV lớp · bản cứng đeo ngoài đời · huy hiệu **tập thể lớp** |

**A5.5 — 10 LOẠI HUY HIỆU · mỗi loại phủ 3 PHƯƠNG DIỆN** (Thùy chốt 28/09)

> *"1 việc cần ghi nhận các phương diện: **chăm chỉ, thành tích, tiến bộ**."* — BTVN làm đủ là 1 huy hiệu, điểm cao là 1 huy hiệu khác.
> *"Ý t không phải 3 loại huy hiệu, mà thành tựu phải để ý cả 3 phương diện. Huy hiệu 10 loại như ban đầu."*

**Cấu trúc:**
- **LOẠI huy hiệu** = trang album.
- Mỗi loại có **các DÒNG huy hiệu**, mỗi dòng **5★**.
- **3 phương diện là GÓC NHÌN khi thiết kế thành tựu**, không phải cách chia huy hiệu. Trong mỗi loại, cố gắng có dòng cho cả 3 phương diện; ô nào vô nghĩa thì bỏ, **không ép cho đủ**.

| # | Loại huy hiệu | 🔥 Chăm chỉ | ⭐ Thành tích | 📈 Tiến bộ |
|---|---|---|---|---|
| 1 | 🏫 **Chuyên cần** | Chuỗi buổi có mặt liên tục | — | — |
| 2 | 📝 **Bài về nhà** | Chuỗi BTVN nộp đủ, đúng hạn | Số bài BTVN đúng ≥ 90% | Tỉ lệ đúng BTVN tăng (tháng) |
| 3 | ⚔️ **Trên lớp** | — | ET ≥ 80% · Nhất / lên bảng xếp hạng buổi | ET tốt hơn tháng trước |
| 4 | 🎯 **Thi (MT)** | Số kỳ MT đã dự | MT top khối | Hạng MT tăng |
| 5 | 💪 **Thử thách** | Tổng ngày pass | Số lượt 10/10 | Tỉ lệ pass tăng (tháng) |
| 6 | 👑 **Chinh phục dạng** | Số dạng đã luyện | Số dạng đạt | Lấp lỗ (yếu → đạt) |
| 7 | 🏆 **Rank** | — | Bậc cao nhất trong năm | Tăng hạng bảng đua tháng |
| 8 | 📜 **Nhiệm vụ** | Số tháng xong chặng 30 | — | — |
| 9 | 🤝 **Tập thể lớp** | Lớp thắng đua lớp tháng (cả lớp cùng nhận) | | |
| 10 | ✨ **Bí ẩn & Kỷ niệm** | Ẩn tới khi đạt · sự kiện · mùa | | |

**Luật tiến bộ:** so với **chính em**, không so với bạn. Em đã ở đỉnh thì **giữ vững cũng tính là tiến bộ** — không phạt em giỏi.

> **⭐ PHASE 1 — chỉ 6–8 huy hiệu** (Thùy 28/09: *"Nhiều quá bị ngợp. Chọn loại dễ đo, ảnh hưởng lớn nhất… phase này 6–8 cái thôi"*).
> - Bảng 10 loại ở trên là **bản đầy đủ để mở dần** về sau.
> - Phase 1 chọn theo 2 tiêu chí: **dễ đo** (dữ liệu có sẵn, đo chắc) + **ảnh hưởng lớn** (kéo đúng hành vi cốt lõi).
>
> | # | Huy hiệu | Đo | Vì sao chọn |
> |---|---|---|---|
> | 1 | **Không Nghỉ** | Chuỗi buổi có mặt | Đi học là nền, `buoi_hoc_hs` chắc chắn |
> | 2 | **Đúng Hẹn** | Chuỗi BTVN nộp đủ, đúng hạn | BTVN mới ~75% đúng hạn ⇒ còn nhiều chỗ kéo lên |
> | 3 | **Lên Tay** | Số bài ET đúng ≥ 80% | Học tốt trên lớp, `gami_grades` có sẵn |
> | 4 | **Tốp Đầu** | Số lần MT top 30% khối | MT là thước đo chính, hàm xếp hạng có sẵn |
> | 5 | **Bứt Phá** | Số lần hạng MT tăng | Đường cho **em đang lên**, cùng nguồn MT |
> | 6 | **Bền Bỉ** | Tổng ngày pass Thử thách | Kéo HS vào app đều đặn, đúng mục tiêu gami |
> | +7 | *Lấp Lỗ* (tuỳ chọn) | Số dạng từ yếu → đạt | Ảnh hưởng lớn nhất tới học thật, nhưng đo khó hơn (cần lịch sử mastery) |
> | +8 | *Leo Rank* (tuỳ chọn) | Bậc rank cao nhất năm | Dễ đo **khi hệ rank đã chạy** |
>
> - Mỗi huy hiệu 5★ (1–3★ điều kiện đơn, 4–5★ nhiều điều kiện) ⇒ **30–40 cấp**, **6–8 phôi bản cứng**.
> - Ma trận phase 1: `ma-tran-thanh-tuu-huy-hieu.xlsx`.

**A5.6 — Sao thấp ĐIỀU KIỆN ĐƠN · sao cao NHIỀU ĐIỀU KIỆN** (Thùy chốt 28/09)

> *"Huy hiệu bậc thấp là điều kiện đơn, bậc cao phải là nhiều điều kiện."*
> *Ví dụ chăm chỉ 5★: vừa đi học đủ, làm BTVN đủ, còn cần thêm tự luyện và Thử thách đạt tiêu chuẩn số lượng.*

**Áp cho MỌI dòng huy hiệu:**

| Sao | Điều kiện | Dạng |
|---|---|---|
| 1★ · 2★ · 3★ | **ĐƠN:** chỉ số chính của dòng (vd chuỗi 10 / 30 / 60 buổi có mặt) | Bản mềm |
| **4★ · 5★** | **NHIỀU:** chỉ số chính ở mức cao **VÀ** các **thành tựu phụ** lấy từ hoạt động / phương diện khác (vd Chuyên cần 5★ = chuỗi 150 buổi **VÀ** BTVN đủ **VÀ** Thử thách ≥ 15 ngày/tháng) | Bản mềm **+ BẢN CỨNG (GV trao)** |

- ⇒ Sao cao **toàn diện**: không cày lệch 1 mảng mà lên được.
- ⇒ Mọi em có đường lên sao cao qua dòng hợp với mình: em chăm → dòng chăm chỉ; em giỏi → dòng thành tích; em đang lên → dòng tiến bộ.

**UI:** mỗi cấp 4★ / 5★ hiện **checklist điều kiện** (✓ chuỗi 150 buổi · ✓ BTVN đủ · ☐ Thử thách 9/15 ngày…) ⇒ HS biết còn thiếu đúng mảng nào.

**Bản cứng:** đề xuất **1 phôi / loại (10 phôi)**. Tên dòng + cấp 4★ / 5★ phân biệt bằng tấm sao gắn thêm / màu viền ⇒ trung tâm dễ sản xuất.

Danh sách dòng + ngưỡng + thành tựu phụ (detail): `de-xuat-huy-hieu.md`.

**A5.7 — MÔ HÌNH: THÀNH TỰU ↔ HUY HIỆU là liên kết N–N** (Thùy chốt 28/09)

> *"Hệ thống thành tựu – huy hiệu là liên kết n–n. 1 thành tựu có thể là điều kiện của nhiều huy hiệu, và 1 huy hiệu dùng n thành tựu để xét."*

**Hai thực thể tách riêng:**

| Thực thể | Là gì | Ví dụ |
|---|---|---|
| **THÀNH TỰU** | Một **điều kiện đo được** trên dữ liệu thật: 1 chỉ số + ngưỡng + kỳ xét. HS **đạt / chưa đạt** | "Đi học đủ mọi buổi trong tháng" · "Chuỗi 30 bài BTVN đúng hạn" · "Thử thách pass ≥ 15 ngày trong tháng" · "Lấp 3 lỗ" |
| **HUY HIỆU (× sao)** | **Phần thưởng** sưu tập được. Mỗi **cấp sao** của huy hiệu = **một TẬP thành tựu** phải đạt đủ (VÀ) | "Chăm chỉ 5★" = {đi học đủ · BTVN đủ · tự luyện ≥ N · Thử thách ≥ M} |

**Liên kết N–N:**
- **1 huy hiệu dùng N thành tựu.** Tầng 1 (1–3★) thường 1 thành tựu / sao. Tầng 2 (4–5★) dùng nhiều.
- **1 thành tựu dùng cho N huy hiệu.** Vd "Đi học đủ tháng" vừa là 2★ của "Chăm chỉ — Trên lớp", vừa nằm trong bộ điều kiện của **Chăm chỉ 4★** và **Chăm chỉ 5★**.
- ⇒ HS làm **một việc**, có thể **tiến gần nhiều huy hiệu cùng lúc**. Album hiện rõ "việc này giúp em tiến tới huy hiệu X, Y".

**Hệ quả kỹ thuật** — để lập plan; đúng §2.0 / §1.5 / §4 CLAUDE.md:

| Bảng / hàm | Vai trò |
|---|---|
| `thanh_tuu` (catalog) | key · môn · **loại chỉ số** (đi học / BTVN / ET / MT / Thử thách / dạng / rank / nhiệm vụ…) · **ngưỡng** · **kỳ xét** (trọn đời / tháng / N tháng liên tiếp) · ẩn? |
| `huy_hieu` · `huy_hieu_cap` | Dòng huy hiệu (phương diện, hoạt động, hình) · từng cấp sao (bản cứng?) |
| `huy_hieu_cap_dieu_kien` | **Bảng nối N–N** (cap_id, thanh_tuu_key) |
| **1 hàm đánh giá chung** `fn_thanh_tuu_dat(hs, key)` | Dispatch theo **loại chỉ số** qua registry (như registry môn) — **thêm thành tựu / đổi điều kiện huy hiệu = sửa bảng cấu hình, KHÔNG sửa code** |
| Ghi khi đạt thật (append, không xoá) | `hs_thanh_tuu_dat` (hs, key, kỳ, dat_at) · `hs_huy_hieu_dat` (hs, cap_id, lần, dat_at, **trao_at** — GV bấm "Đã trao") |
| Việc trao bản cứng | **Suy động:** đạt cấp có bản cứng **TRỪ** đã có `trao_at` (§4 invariant) |
| Catalog cũ `thanh_tich_loai` (12 key) + `hoc_sinh_thanh_tich_ghim` | Migrate vào `thanh_tuu` / huy hiệu. Ghim khoe dùng lại |
| **Màn "Ma trận Thành tựu × Huy hiệu"** (admin, Thùy chốt 28/09) | Hàng = thành tựu · cột = huy hiệu × sao · **tích ô = nối điều kiện** (ghi bảng nối N–N). Nhìn 1 màn thấy: huy hiệu X cần gì, thành tựu Y nuôi những huy hiệu nào. Bản nháp ma trận: `de-xuat-huy-hieu.md` |
- **Ngoài ma trận:**
  - 🤝 **Tập thể lớp** — cả lớp cùng nhận khi thắng đua lớp tháng (Socializer).
  - ✨ **Bí ẩn & Kỷ niệm** — ẩn tới khi đạt (vd báo sai đề được xác nhận, trúng trà sữa) · huy hiệu sự kiện / mùa (Explorer).
- Phương diện ↔ kiểu người chơi:
  - Chăm chỉ → Collector.
  - Thành tích → Achiever · Competitor.
  - Tiến bộ → mọi HS, nhất là HS yếu đang lên.

**A5.6 — Xu (thứ yếu)**

- Trong trần 5 xu / tháng / môn (đã chốt).
- Chỉ **3★ trở lên** có EXP thưởng. Sao thấp chỉ có huy hiệu.

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

### B2 — Câu logic THÀNH TỰU — ✅ Thùy chốt 28/09

H1–H6 đồng ý theo đề xuất, trừ H4:
- **H4 = GIÁO VIÊN trao bản cứng** — việc trao hiện cho GV lớp của môn đó.
- **Thêm luật 3 phương diện** (A5.5).
- **Thêm luật sao** (A5.6): 1–3★ điều kiện đơn; 4–5★ nhiều điều kiện — áp cho MỌI dòng. Huy hiệu vẫn **10 loại** (A5.5); 3 phương diện là góc nhìn thiết kế thành tựu.

**Còn mở (chờ Thùy):**

| # | Câu | CTO đề xuất |
|---|---|---|
| **H7** | Tầng 2 xét trong **kỳ** nào? | **4★ = đạt đủ bộ điều kiện trong 1 tháng · 5★ = đạt đủ bộ điều kiện cao hơn trong 3 tháng liên tiếp.** "Đủ" phải có khung thời gian; 3 tháng liên tiếp thì 5★ mới thật sự hiếm |
| **H8** | Đạt 4★ / 5★ **lần 2, lần 3** thì sao? | Bản mềm ghi **×2, ×3** (Collector thích). **Bản cứng chỉ trao lần đầu** |

| # | Câu | CTO đề xuất |
|---|---|---|
| **H1** | Mỗi dòng huy hiệu mấy sao? | **5 sao.** Đủ dài để cày cả năm; khung 5 cấp đã có sẵn mẫu trong `Student badge design.zip` (chỉ dùng khung + sao, không bắt buộc hình chim) |
| **H2** | Bản cứng từ mấy sao? | **4★ và 5★.** Ngưỡng chốt sau khi ước lượng số lượng bản cứng / tháng |
| **H3** | Huy hiệu vĩnh viễn, không reset theo mùa rank? | **Có.** Chỉ nhóm Kỷ niệm có giới hạn thời gian |
| **H4** | Trao bản cứng: hệ tự sinh việc cho OPS / GV, trao xong bấm "Đã trao"? | **Có.** Ai trao: OPS hay GV lớp — Thùy chọn |
| **H5** | 10 nhóm ở A5.5 — thêm / bớt? | Như bảng |
| **H6** | Có huy hiệu **tập thể lớp** (cả lớp cùng nhận khi thắng đua lớp tháng)? | **Có** — cho kiểu Socializer |

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
> **C4:**
> - Thùy chốt **mùa = 1 năm**, thang 10 bậc "người thường → thần" (8 cố định × 3 sao + 2 ghế thần). Bậc thần ít; đa số dừng ở bậc 6–7.
> - Ngưỡng đề xuất + mô phỏng 12 tháng: `phan-tich-diem-rank.md` vòng 4.
> - ✅ Đã chốt: bậc 5 = **Hero** · **có Bảng đua tháng** (không đổi bậc).
>
> **C9:** theme = hành trình "người thường → thần", tên tiếng Anh.
>
> **C7 · C10 (28/09):** đề xuất nhiệm vụ + vòng quay + ngân sách xu ở `de-xuat-nhiem-vu.md` (vòng 2).
> - ✅ Chốt: **trần xu app 30 / HS / tháng MỖI MÔN**.
> - ✅ **Phạm vi triển khai: tạm thời chỉ TOÁN.** Thiết kế vẫn đối xứng; môn khác bật sau bằng cờ cấu hình theo môn.
> - Chờ chốt: B-L3..7, chia 10 / 15 / 5, bảng thưởng vòng quay.
>
> Số đo DB: BK có **1 cơ sở** ⇒ không cần tầng cơ sở (A4).

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
