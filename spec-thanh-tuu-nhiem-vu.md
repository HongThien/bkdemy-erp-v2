# Spec — Gamification HS: RANK · THỬ THÁCH · NHIỆM VỤ · VÒNG QUAY · HUY HIỆU · ĐUA LỚP — v5 (tổng kết 28/09/2026)

> **Trạng thái 28/09/2026: THIẾT KẾ PHASE 1 (TOÁN) ĐÃ CHỐT — CHƯA CODE.** Đọc **§0 TỔNG KẾT** ngay dưới. Các phần A–C phía sau là logic chi tiết + lịch sử bàn luận (chỗ nào lệch §0 thì **§0 đúng**).
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


---

## §0 — TỔNG KẾT ĐÃ CHỐT (28/09/2026) · phase 1 chỉ môn TOÁN

**Tài liệu đi kèm:**

| File | Nội dung |
|---|---|
| `phan-tich-diem-rank.md` | Số đo DB + mô phỏng Điểm Rank (vòng 4 = mùa năm) |
| `de-xuat-nhiem-vu.md` | Nhiệm vụ + vòng quay + ngân sách xu |
| `de-xuat-huy-hieu.md` | Huy hiệu: tên, lịch sử, bản đầy đủ 10 loại |
| **`ma-tran-thanh-tuu-huy-hieu.xlsx`** | **Output cuối của huy hiệu** |
| `scripts/sim-diem-rank.mjs` (`--chot`, `--nam`) · `scripts/sim-huy-hieu.mjs` | Mô phỏng, chạy lại được |
| **`spec-huy-hieu-build.md`** | **Huy hiệu: cách đo chính xác 14 thành tựu · schema · RPC · màn** (28/09, sau Q1–Q4) |

### 0.1 Nguyên tắc (Thùy)
- **Game thật** — cày cuốc, đua top. Lấy **cơ chế** game, **không lấy tên** game.
- **Không chống cày.**
- HS học **offline, không được nghỉ.**
- **Mỗi môn riêng hoàn toàn:** điểm, ngưỡng, bảng, hồ sơ "rank X Toán · rank Y KHTN". App cũng riêng, chỉ chung cổng vào.
- Mọi việc học **ghi nhận đủ 3 góc: chăm chỉ · thành tích · tiến bộ.** Phục vụ đủ kiểu người chơi — không phải ai cũng thích xu.
- Tính ở Postgres, **suy động**. Chỉ ghi dòng khi có sự kiện thật (CLAUDE.md §1.5, §2.0, §4).

### 0.2 Điểm Rank (theo môn) — đúng 4 nguồn

| Nguồn | Điểm |
|---|---|
| ET | **100** / bài |
| BTVN | **100** đúng hạn · **50** muộn |
| MT tháng (MT sát hạch tại trung tâm; thi trường không tính) | Bảng hạng 1–50 (`50 + 50·((51−h)/50)^1.5`) **× 10** ⇒ 1.000 → 500 |
| **Thử thách** | 8/9/10 câu đúng = **10 / 20 / 30** |

**Luật MT:**
- Hạng **quy theo sĩ số dự thi:** `ceil(hạng × 50 / số em thi)`.
- **Chỉ em có điểm MT thật mới được điểm.**
- Lỡ MT ⇒ **thi lại**, tính bằng điểm thi lại.

**Thử thách** = kiểu tự luyện thứ 3, 1 lượt **y hệt Tự luyện tổng hợp**:
- Chỉ **pass ≥ 80%** mới có điểm.
- **Vô hạn lượt, chỉ ĐIỂM có trần.**
  - Trần tháng = ¼ × (điểm tối đa ET + BTVN + MT của môn): **Toán 600 · KHTN 375.** *(Toán sửa 28/09: 1 tháng = 8 buổi = 1 MT + 7 ET + 7 BTVN ⇒ tối đa 3 nguồn 2.400; bản trước giả định 5 ET → 500)*
  - Trần ngày = trần tháng ÷ 20 (**30 · 19**).
- ⇒ Em chạm trần: Thử thách chiếm 21–25% Điểm Rank.

**Không cộng Điểm Rank:** có mặt · lên bảng · bổ trợ · Học từ đầu · dạng lên đạt · thưởng nhiệm vụ / thành tựu.

**Elo:** giữ cho việc đang dùng, **không liên quan rank.** Điểm Rank ≠ EXP (EXP → xu là hệ riêng).

### 0.3 Rank — MÙA = 1 NĂM, hành trình "người thường → thần"

**8 bậc cố định (mỗi bậc 3 sao, chỉ lên trong mùa).** Ngưỡng = hệ số × điểm tối đa 1 tháng của môn (**Toán 3.000** · KHTN 1.875 — Toán sửa 28/09 theo 8 buổi/tháng, hệ số giữ nguyên).

| # | Bậc | Hệ số | Ngưỡng Toán | Ngưỡng KHTN |
|---|---|---|---|---|
| 1 | Novice | 0 | 0 | 0 |
| 2 | Soldier | 0,6 | 1.800 | 1.125 |
| 3 | Captain | 1,6 | 4.800 | 3.000 |
| 4 | General | 3,0 | 9.000 | 5.625 |
| 5 | **Hero** | 4,6 | 13.800 | 8.625 |
| 6 | Legend | 7,0 | 21.000 | 13.125 |
| 7 | King | 8,0 | 24.000 | 15.000 |
| 8 | Emperor | 9,8 | 29.400 | 18.375 |

> **⚠ SỬA 28/09 (Thùy): thần KHÔNG còn là ghế.** *"Ghế đấy phải đạt đủ điểm tích luỹ… không phải hạng 1, mà là phải đủ điều kiện điểm. Nên có thể không có God luôn."*
> ⇒ **10 bậc thuần theo điểm tích luỹ mùa** (không top %, không hạng, không phong độ). Ngưỡng co ×0,875 theo năm học thật 10,5 tháng (7 → giữa 5):
> Novice 0 · Soldier 1.575 · Captain 4.200 · General 7.875 · Hero 12.075 · Legend 18.375 · King 21.000 · Emperor 25.725 ·
> **God of War 28.350 (90% tối đa năm)** · **Supreme God 30.240 (96%)** — **2 ngưỡng thần Thùy chốt 28/09.** Bảng + đoạn "ghế" dưới đây là bản cũ.

**2 bậc GHẾ** (xét lại hằng ngày, ngồi được quanh năm, bị vượt / tụt phong độ thì rơi):

| # | Bậc | Điều kiện |
|---|---|---|
| 9 | **God of War** | top 3% khối × môn **và** phong độ ≥ 84% |
| 10 | **Supreme God** | hạng 1 **và** phong độ ≥ 92% |

- Phong độ = điểm từ đầu mùa ÷ (điểm tối đa tháng × số tháng đã qua).
- **Bậc thần phải ít**: đa số chỉ tới 6–7, bậc 8–10 mới danh giá.
  - Mô phỏng hết năm (Toán): Hero 17% · **Legend 41% · King 34%** · Emperor 8% · 1–2 ghế thần / khối.
- **Bảng đua tháng:** xếp Điểm Rank kiếm trong tháng (khối × môn), vinh danh TV, gộp giải tháng. **Không đổi bậc.**
- **Hết năm:** về Novice. Bậc đỉnh năm cũ giữ thành huy hiệu vĩnh viễn.

### 0.4 Nhiệm vụ (mỗi môn 1 bảng · tổng thưởng tối đa 15 xu / tháng / môn)

- Nhiệm vụ lẻ **chỉ cho Điểm Chặng**. **Không cộng Điểm Rank.**
- Thưởng nằm ở **chặng tháng + rương tuần.**

| Tầng | Nhiệm vụ | Điểm Chặng |
|---|---|---|
| **Ngày** (sống 3 ngày) | N1 Thử thách (pass 1 lượt) · N2 Luyện 20 (đúng 20 câu app) · N3 Sửa sai (đúng lại 2 câu thuộc dạng từng sai trong 14 ngày) | +10 / cái |
| **Tuần** (chưa xong dồn tới hết tháng) | T1 BTVN đúng hẹn cả tuần · T2 ≥ 1 bài ET ≥ 80% · T3 Thử thách 4 ngày khác nhau · T4 Lấp 1 lỗ (yếu → đạt) | +40 / cái |
| **Rương tuần** | Xong 12 nhiệm vụ / tuần | +60 · **75 EXP** |
| **Tháng** | M1 MT bứt phá (hạng tăng **hoặc** top 30% khối) · M2 Thử thách 15 ngày | +150 / cái |
| **Chặng tháng** | 30 cấp × 50 Điểm Chặng | **25 EXP / cấp** + mốc 10 / 20 / 30 = **+100 / 150 / 200 EXP** (chỉ EXP, không quà hiện vật) |

### 0.5 Vòng quay may mắn

- **Lượt quay** = xong ≥ 2 nhiệm vụ ngày của môn đó. Tối đa 1 lượt / ngày / môn. Thay điều kiện cũ "tự luyện ≥ 70%".
- **Giải:** 20 / 30 / 50 / 100 / 200 EXP (40 / 35 / 18 / 6 / 1%) ⇒ trung bình ~36 EXP / lượt.
- **Đổi ra xu thật.** Hiện EXP vòng quay nằm riêng `may_man_hs_luot`, không bao giờ thành xu.

### 0.6 Ngân sách xu trên app

- **30 xu / HS / tháng / MÔN** = vòng quay **10** · nhiệm vụ **15** · thành tựu **5**.
- Chặn ở **hàm chốt xu tháng:** `xu app môn X = min(30, ceil(EXP app môn X / 100))`. EXP vẫn ghi đủ.
- Xu từ học trên lớp (~25 / tháng) **không tính** vào trần.
- Bảng đua tháng / đua lớp **không trả xu app** — vinh danh, giải tháng, thưởng tập thể.

### 0.7 Huy hiệu (thành tựu) — phase 1: 8 huy hiệu bộ HY LẠP · bộ VIỆT NAM dành cho GIẢI THƯỞNG

| Huy hiệu | Ghi nhận | Tháng ĐẠT CHUẨN (★1–3) | Tháng HOÀN HẢO (★4–5) = chuẩn + … |
|---|---|---|---|
| **Helios** | chuyên cần | không vắng buổi nào | BTVN đủ đúng hạn + Thử thách ≥ 15 ngày |
| **Chronos** | BTVN | nộp đủ, đúng hạn mọi bài | không vắng + tự luyện ≥ 200 câu đúng |
| **Athena** | ET | ET ≥ 80% ở ≥ ¾ số bài | BTVN đủ đúng hạn + BTVN đúng TB ≥ 85% |
| **Zeus** | MT | MT top 30% khối | ET tốt + BTVN đúng TB ≥ 90% |
| **Phoenix** *(biểu tượng, không phải thần)* | bứt phá | hạng MT tốt hơn tháng đầu năm (hoặc giữ top 10%) | BTVN đủ đúng hạn + không vắng |
| **Hercules** | Thử thách | pass ≥ 10 ngày | ≥ 15 ngày + ≥ 5 lượt 10/10 + BTVN đủ đúng hạn |
| **Hephaestus** | lấp lỗ | lấp ≥ 1 dạng yếu (hoặc hết dạng yếu) | BTVN đủ đúng hạn + Thử thách ≥ 10 ngày |
| **Nike** | đua tháng | top 30% Bảng đua tháng | top 10% + không vắng + BTVN đủ đúng hạn |

**Thang sao** — đếm trong 1 năm học 10 tháng:

| ★1 | ★2 | ★3 | ★4 | ★5 |
|---|---|---|---|---|
| 1 tháng | 2 tháng | 4 tháng | 6 tháng | 9 tháng |
| tháng đạt chuẩn | | | tháng hoàn hảo | |

**Luật:**
- **Sao thấp = điều kiện đơn · sao cao = nhiều điều kiện.**
- **Thành tựu ↔ huy hiệu N–N:** 1 điều kiện nuôi nhiều huy hiệu, 1 huy hiệu dùng nhiều điều kiện.
  - Cấu hình bằng **màn admin Ma trận** (tích ô). Output hiện tại = `ma-tran-thanh-tuu-huy-hieu.xlsx`.
- **Bản mềm ★1–3 · BẢN CỨNG ★4–5, GIÁO VIÊN lớp trao** + bấm "Đã trao" (việc trao **suy động**: đạt ★4/★5 trừ đã trao).
  - Đề xuất 1 phôi / huy hiệu, ★4 / ★5 phân biệt bằng tấm sao / màu viền.
- Đạt rồi **không mất.** Đạt lại năm sau ⇒ bản mềm ×2, bản cứng chỉ lần đầu (**H8 — Thùy chốt 28/09**).
- **Năm huy hiệu = tháng 7 → tháng 4** (10 tháng; giữa tháng 5 nghỉ hè, tháng 5–6 không đếm). **Tính lùi từ 07/2026**; điều kiện của tính năng chưa mở = *không áp dụng* (Thùy 28/09).
- **Album:** % hoàn thành · "Sắp đạt" · "N bạn trong khối có" (< 10% = Hiếm). Ghim 3 huy hiệu khoe hồ sơ + TV lớp.
- **Tên:** nhân vật lớn, việc cần làm nhỏ bên dưới (vd "Phoenix ★★★ — hạng MT tốt hơn đầu năm 4 tháng").
- **EXP** (thứ yếu, trần 5 xu): ★3 = 100 · ★4 = 200 · ★5 = 300 EXP.
- **Mô phỏng** (hiệu chỉnh DB thật):
  - ★3: 25–83% em (Helios = huy hiệu nhập môn).
  - ★4: 2–7% · ★5: 0–2%.
  - **~66 bản cứng / năm** Toán cấp 2 (211 em) ⇒ ~13 / tháng từ tháng 6.
- **Bản đầy đủ 10 loại / ~100 cấp** (`de-xuat-huy-hieu.md`) = **lộ trình mở dần**, không đưa HS ngay (Thùy: nhiều quá bị ngợp).

### 0.7b Hồ sơ khoe (C11 phần profile — Thùy 28/09, mockup chờ Thùy design)
- **Bấm vào avatar là mở** hồ sơ của chính em: đầu hồ sơ (khung avatar theo chương rank, tên, lớp, danh hiệu) · chọn môn · rank mùa · 3 huy hiệu tự chọn khoe · album thu gọn · tháng này (đua tháng / chặng / bản cứng) · kỷ niệm các mùa.
- **Xem tường của nhau (kiểu mạng xã hội) = phase sau.** Phase này chỉ em tự xem + thẻ nhỏ trên TV lớp (hạng thấp không lộ — A8).
- **Danh hiệu = giải thưởng tháng đã trao** (màn Trao giải: Xuất sắc / Tiến bộ / Chăm chỉ của lớp) — hiện giải gần nhất em nhận, vd "Xuất sắc tháng 9". Không chờ C5.
- **Đừng lẫn 3 thứ (Thùy 28/09):** *bậc rank* (Captain, Hero, God of War… — chỉ ở khối Rank) · *huy hiệu* (Helios, Athena… — khối khoe + album) · *danh hiệu* (giải thưởng tháng — ô dưới tên). Mỗi thứ 1 chỗ, không dùng tên của thứ này cho thứ kia.
- Đơn design gửi ChatGPT: `design/DON-HANG-GAMI-HS.md` (Huy hiệu · Nhiệm vụ + Album · Hồ sơ).

### 0.7c "Thế giới BK" — học cùng nhau + kênh khoe (Thùy chốt logic 28/09)
- **Gốc (Thùy):** HS học một mình trên app thấy **cô đơn**; thấy bạn khác cũng đang làm bài, đang đạt thành tích ⇒ hứng thú + động lực; được
  "show hàng" trước bạn bè. **KHÔNG làm mạng xã hội đăng bài** — làm "mạng xã hội khoe", không rủi ro.
  Tên gọi thế giới: *social presence / body doubling* (Forest, Focusmate, "Study With Me") + *khoe tự động, bạn bè bấm tương tác* (Strava Kudos, Duolingo).
- **2 lớp, không lớp nào cho HS gõ chữ tự do:**
  1. **"Đang học cùng em"** (ngay trong màn làm bài): "🟢 N bạn BK đang học lúc này" (realtime presence, không ghi DB) + dòng tin chạy nhẹ
     "X vừa làm xong 10 câu" — **chỉ tin nỗ lực / tin tốt**, không bao giờ hiện điểm kém, câu sai, hạng thấp (luật A8).
  2. **Kênh khoe:** **🌏 Thế giới BK** (toàn trung tâm) + **🏫 Kênh lớp** (mỗi lớp em học — lớp gắn môn ⇒ đúng §1.6). Tin do HỆ THỐNG tự sinh
     từ sự kiện thật: lên bậc rank · huy hiệu ★ · giải tháng · Nhất buổi · đội thắng game buổi · trúng 🧋 · chuỗi nhiệm vụ… Bấm tên ⇒ hồ sơ khoe (§0.7b).
- **Tương tác (Thùy):** KHÔNG chat, KHÔNG chữ tự do; **KHÔNG chỉ 1 nút "chúc mừng"** — em **thả icon trendy** hoặc **chọn câu meme trendy soạn sẵn**.
  Danh mục icon/câu nằm ở **DB, admin sửa được** (theo trend) ⇒ không có nội dung ngoài danh mục ⇒ không cần kiểm duyệt. Người nhận có thông báo.
- **Riêng tư (Thùy):** mỗi em **tự chọn hiện TÊN hoặc hiện MÃ SỐ HS** (`hoc_sinh.ma_hs`, dạng `HS####` — đo 28/09: 338/338 HS đang học có mã, không trùng).
  Áp cho mọi chỗ em xuất hiện trên 2 lớp trên. **Phụ huynh KHÔNG xem** kênh (riêng tư của HS).
- **Luật dữ liệu:** kênh = **SUY RA** từ bảng sự kiện đã có (bài làm, huy hiệu, giải, game…) bằng hàm `fn_*` — **không có bảng "bài đăng"**, không đẻ dòng chờ.
  Chỉ ghi thêm: lượt tương tác (ai · tin nào · icon/câu nào) + lựa chọn tên/mã của em. Nhiều sự kiện là dữ liệu học tập ⇒ mang `mon`; Thế giới gộp mọi môn.
- **Thiết kế cố ý (CTO):** kênh **không bao giờ vắng** (lúc ít người: tổng kết "Hôm nay 87 bạn đã luyện 1.240 câu", không hiện "0 bạn") · phải có loại tin
  **ai chăm cũng đạt** (làm xong bài, chuỗi ngày, tiến bộ so với chính mình) để bạn yếu cũng lên kênh — chỉ khoe bạn giỏi thì bạn yếu càng lạc lõng.
- **Bàn sau (detail):** danh mục icon + câu meme (Thùy chọn) · danh sách loại tin + ngưỡng (vd "10 câu" hay "1 bài") · giới hạn tương tác/ngày
  (chống bấm hàng loạt) · vị trí trên app HS (tab riêng hay ô trên Home).
- **✅ Logic chốt vòng 2 (Thùy "ok" 29/09 — 5 điểm):**
  1. **3 tầng tin:** **S** cực phẩm (lên bậc rank · huy hiệu ★4–5 · giải tháng · 🧋) ⇒ Thế giới, ghim đầu 24h, hiệu ứng lớn ·
     **A** đáng khoe (huy hiệu ★1–3 · Nhất buổi · đội thắng game buổi · **chinh phục 1 dạng** yếu→đạt · chuỗi 7/30 ngày) ⇒ Thế giới + lớp ·
     **B** nỗ lực (xong nhiệm vụ ngày · chuỗi 3 ngày · tiến bộ so với chính mình · xong bài) ⇒ **chỉ kênh lớp** + tin chạy "đang học cùng em".
     Tin B của 1 em trong ngày **gộp thành 1**; Thế giới có trần tin/em/ngày.
  2. **Tương tác:** mỗi em **1 icon / tin** (đổi được) **+ 1 câu meme / tin**; dưới tin: đếm theo icon + vài câu mới nhất (tên/mã) + "+N bạn".
     Danh mục chỉ câu **khen/hype một chiều** (Thùy duyệt từng câu — câu soạn sẵn vẫn có thể thành mỉa mai). **Không cộng EXP** cho việc thả tương tác.
  3. **"👑 Thầy cô khen":** icon RIÊNG chỉ GV/TA thả được, hiện nổi bật trên tin (khen công khai của thầy cô > chục icon bạn bè).
  4. **Thông báo đẩy cho HS** (Web Push, hạ tầng `push.ts`/`push_dang_ky` đang chạy cho app pt/ta ⇒ thêm app `hs`): "🔥 Bình và 4 bạn thả tim…",
     "👑 Cô Lan khen em" — **gom 1–2 lần/ngày quanh 20h** (giờ đông nhất theo §0.10), không bắn từng cái. iPhone phải "Thêm vào MH chính" mới nhận.
  5. **Chủ tin tự quản:** ẩn từng **tương tác** trên tin mình · ẩn từng **tin** của mình. Admin gỡ được mọi tin.
     Chế độ **hiện mã**: avatar chung, bấm vẫn xem hồ sơ khoe (rank/huy hiệu) nhưng **không lộ tên + lớp**.
- **Kỹ thuật (CTO):** tương tác gắn vào **KHOÁ TỰ NHIÊN của sự kiện gốc** (vd `huy_hieu:<id>`, `buoi_giai:<buổi>:<hs>`), không gắn vị trí trong feed
  (CLAUDE.md §2 "danh tính bám khoá tự nhiên"). "Chinh phục dạng": mastery **không lưu** (§1) ⇒ cần nhật ký **append-only** mỗi lần vượt ngưỡng
  (sự kiện thật, không phải lưu mastery) — tốn công hơn các tin khác ⇒ để bước 2.
- **Build 2 bước:** **Bước 1** (~1,5–2 tuần) = tin từ sự kiện ĐÃ CÓ: Nhất buổi · game buổi (Mở Rương/Chiếm Đất/Bắn Quà/🧋) · bài làm · nhiệm vụ ·
  rank · huy hiệu (lõi gamification build 28/09) + icon/meme + 👑 + push HS. **Bước 2** = chinh phục dạng + tiến bộ so với chính mình.

### 0.8 Còn mở — chưa bàn
- **C5** Danh hiệu top theo dạng: logic A4 đã có (Điểm Dạng từ mọi nguồn, chốt tuần) — cấp / %, sàn, tốc độ giảm.
- **C8** Quà đua lớp.
- **C11** Giao diện các màn (app HS: Rank / Nhiệm vụ / Vòng quay / Album · TV · màn GV trao bản cứng · admin Ma trận).
- **C12** Build plan. **Thùy 28/09: làm HẾT trong cùng đợt, không chia đợt ra mắt.** Thứ tự code bên trong đợt:
  1. Điểm Rank + Thử thách + bậc + khoe TV.
  2. Nhiệm vụ + vòng quay + trần xu.
  3. Huy hiệu + ma trận + bản cứng.
  4. Danh hiệu dạng + đua lớp.

### 0.9 Bẫy kỹ thuật khi build (đã soi DB 28/09)
- **Nguồn EXP mới** (`exp_nhiem_vu`, `exp_thanh_tuu`, `exp_may_man`):
  - sửa đủ 4 chỗ đọc viết cứng: `fn_gami_exp_xu_thang` · `fn_gami_exp_chi_tiet_thang` · `fn_hs_vi_xu_cua_toi` · `EXP_NOTE_SOURCES`;
  - loại khỏi delete của `fn_recompute_exp_thang`.
- Trần 30 xu / môn: tính **trong** hàm chốt.
- `qlht_xu_ledger.loai` có CHECK (thiếu loại tự động) + `nguoi_tao NOT NULL FK nhan_su` ⇒ migration nới + nhân sự "hệ thống".
- `may_man_hs_luot` unique `(hoc_sinh_id, ngay)` ⇒ đổi `(…, mon)` khi mở môn 2.
- `fn_bxh_diem_mt_khoi` xếp cả em chưa thi = 0đ (để hiển thị) ⇒ đổi hạng ra Điểm Rank chỉ lấy em có điểm.
- Catalog cũ `thanh_tich_loai` (12 key) + `hoc_sinh_thanh_tich_ghim` ⇒ migrate / dùng lại. **Không đẻ catalog thứ 2.**
- RPC cho HS: `security definer` + `revoke execute … from anon` (bài học 18/09).

---

### 0.10 SỐ NỀN gắn bó app HS — TRƯỚC gamification (đo 28/09/2026, `node scripts/do-gan-bo-app.mjs 2026-08-31 2026-09-27`)
> Mục tiêu cuối (Thùy): tăng gắn bó với app ⇒ thêm động lực học. ⚠ Thùy: app **chưa triển khai hết** (tự luyện, bổ trợ app… mở dần trong tháng 9)
> ⇒ số tăng trong kỳ này phần lớn do **mở tính năng**, không phải do động lực. Đây là **mốc để so**, không phải đánh giá. Đo lại cùng script, cùng cách tính.

- **Hoạt động** = HS bắt đầu 1 bài trên app (`bai_lam.bat_dau_at`, giờ VN). **Tự nguyện** = tự luyện · học-từ-đầu luyện · thử thách (không ai giao).
  Mẫu số: **337 HS đang học, 337 có tài khoản**.

| Tuần (T2) | HS dùng app | lượt | HS **tự nguyện** | lượt tự nguyện |
|---|---|---|---|---|
| 31/08 | 39 (12%) | 230 | 21 | 184 |
| 07/09 | 61 (18%) | 220 | 33 | 116 |
| 14/09 | 120 (36%) | 765 | 82 | 542 |
| **21/09** | **124 (37%)** | **1.619** | **85 (25%)** | **1.301** |

- **Tần suất** (HS-tuần, 4 tuần): **≥3 ngày/tuần 7,1%** · 1–2 ngày 18,4% · **0 ngày 74,5%**.
- **Quay lại:** 70 HS dùng ở 2 tuần đầu ⇒ **62 (89%) còn dùng** ở 2 tuần sau (cỡ mẫu nhỏ, đang giai đoạn mở).
- **Loại bài (4 tuần):** tự luyện áp đảo — 139 HS / 2.104 lượt (75% nộp); ET 42 HS · BTVN 42 · giáo trình 44 · bổ trợ 23.
- **Khối:** 9 dùng ít nhất so với sĩ số (26/76 = 34%) · 6–8 ~50% · 10–11 gần đủ (15/16, 20/21) · 3–5 gần như chưa (0/6, 3/11, 5/20).
- **Giờ:** đỉnh **16–22h**, cao nhất **21h**. Một tối trong tuần 21/09 có **~27–36 HS** làm bài (T2–T5), T6–CN ít hơn.
  Đồng thời cao nhất: **22 HS cùng bắt đầu trong 1 khung 30 phút** (T7 27/09 17:30).
  ⇒ Hệ quả cho §0.7c: "N bạn đang học lúc này" thường chỉ **vài bạn tới ~20** ⇒ phải có số "hôm nay" / "tối nay" làm nền, đúng như thiết kế "kênh không bao giờ vắng".
- **3 chỉ số theo dõi sau ra mắt:** % HS dùng app mỗi tuần (nền 37%) · **% HS-tuần ≥3 ngày (nền 7,1%)** · % HS tự nguyện mỗi tuần (nền 25%).
  Chỉ số chính = **≥3 ngày/tuần** (thói quen), không phải tổng lượt (1 bạn cày 200 lượt làm phồng số).

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
>
> **✅ CHỐT PHASE 1 (Thùy 28/09, vòng sau):**
> - **8 huy hiệu, tên bộ Hy Lạp** — Helios (chuyên cần) · Chronos (BTVN đúng hạn) · Athena (ET) · Zeus (MT top) · **Phoenix** (bứt phá — giữ, là biểu tượng) · Hercules (Thử thách) · Hephaestus (lấp lỗ) · Nike (Bảng đua tháng).
> - **Bộ Việt Nam dành cho GIẢI THƯỞNG.**
> - **Thang sao theo THÁNG trong 1 năm học (10 tháng): ★1/★2/★3/★4/★5 = 1/2/4/6/9 tháng.**
>   - ★1–3 đếm **tháng đạt chuẩn** (1 điều kiện).
>   - ★4–5 đếm **tháng hoàn hảo** (chuẩn + các điều kiện thêm).
>   - ⇒ 5★ = gần như hoàn hảo cả năm.
> - **Mô phỏng** (`scripts/sim-huy-hieu.mjs`, hiệu chỉnh theo DB thật):
>   - ★4 ~2–7% HS · ★5 ~0–2%.
>   - **~66 bản cứng / năm** cho Toán cấp 2 ⇒ ~13 / tháng từ tháng 6.

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
