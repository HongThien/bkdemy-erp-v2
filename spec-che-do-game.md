# spec-che-do-game.md — KHUNG CHẾ ĐỘ GAME HỌC, DÙNG CHUNG MỌI MÔN (Thùy chốt 03/10/2026)

> Khởi nguồn: thiết kế game Đấu Từ (Anh, `spec-dau-tu-vung.md`) ra **6 chế độ** ⇒ Thùy: "các chế độ cho mọi môn, chỉ thay content, chế độ game giữ nguyên".
> 03/10 bàn áp vào Toán để rút **logic tổng quát** ⇒ file này. Toán đã có sẵn một phần (Tự luyện = bản đồ phiêu lưu, Thử thách = Đấu trường).
> **File này = luật chung.** Luật riêng từng chế độ vẫn ở file gốc: Thử thách → `spec-thu-thach-dau-truong.md` · trận/season/kho từ Anh → `spec-dau-tu-vung.md`.
> Giai đoạn đầu (app mới release): **vừa chạy vừa sửa** — số liệu ở "Bàn sau" là mặc định, đo thật rồi chỉnh.

---

# PHẦN A — LOGIC (đã chốt)

## 1. Nguyên tắc

- **Chế độ giữ nguyên mọi môn, chỉ đổi CONTENT** (CLAUDE §1.6 symmetry test). Chỗ cắm content = registry `src/dautu/nguon/index.ts` (1 dòng/môn).
- **Theo MÔN, không theo chế độ:** thời gian/câu, thời gian gốc của tháp, kiểu đố riêng (Anh có đảo chiều Anh↔Việt, sổ nhớ từ, Nối từ).
- **Câu = MCQ tuyệt đối**, chọn qua `_kho_dk_mcq_sql` (luật chung `spec-mcq-form.md`).
- Mọi số liệu nghiệp vụ (chọn câu, chấm, điểm, xếp hạng) tính ở Postgres `fn_*` (CLAUDE §2.0).

## 2. Bản đồ chế độ (sau khi Thùy sắp lại 03/10)

| Khu | Chế độ | Luật chính | Cộng Điểm Rank? |
|---|---|---|---|
| **Luyện tập** | **= Tự luyện** của môn đó (Toán: bản đồ phiêu lưu; Anh: đấu bot luyện tập + góc luyện) | không áp lực, không xếp hạng | không (đã có luật lượt học thật riêng) |
| **PvP** | đấu online 1–1: hàng chờ ngẫu nhiên · mã phòng 6 số / link · mời bạn đang online · **nút "Đấu với bạn bên cạnh"** = tạo phòng ngay (thay cho chế độ 2 người 1 máy) | luật trận §4 | không — điểm season (§6) |
| **Đấu đôi 1 máy** | 2 khu trả lời trên 1 iPad | Anh: giữ. **Môn có công thức (Toán, KHTN): HOLD** — thay bằng PvP 2 iPad ở trên | không |
| **Tournament** | **có người:** giải 8 người loại trực tiếp (như Đấu Từ) · **không đủ người = THỬ THÁCH:** 3 vòng gặp bot Dễ → Vừa → Khó | Thử thách giữ NGUYÊN luật `spec-thu-thach-dau-truong.md`: ngưỡng 60/80/100%, đo ĐỘ CHÍNH XÁC (không đua bấm), 2 lượt/ngày/môn, thua là dừng | **Thử thách: CÓ** (10/20/30, trần tuần) · giải người thật: bàn sau |
| **Leo tháp** | 2 PHẠM VI × 3 kiểu (§3) | xếp hạng thuần | không (hoặc rất ít, có trần — bàn sau) |

- **Vì sao Thử thách vào Tournament mà không vào Tháp** (CTO phản biện, Thùy chốt 03/10):
  1. Thử thách **cá nhân hoá** (dạng của riêng em); tháp cần **cùng chuỗi câu cho mọi người** để bảng xếp hạng công bằng — ghép thì mất một trong hai.
  2. Thử thách đo **độ chính xác**; tháp đo **tốc độ + độ bền** ⇒ Rank sẽ thưởng phản xạ thay vì hiểu bài.
  3. Nhiệm vụ N1/T3/M2, huy hiệu Hercules, chuỗi cần "VƯỢT" rõ ràng (thắng 3 trận); tháp chỉ có "tầng mấy".
  4. Tháp vô hạn lượt ⇒ cày Rank.
  Thử thách vốn đã có hình tournament (3 vòng loại trực tiếp, thua là dừng, càng sâu càng khó) ⇒ ghép vào Tournament.
- Màn Đấu trường đã dựng (boss, 3 trận, đòn theo %) = màn của **Tournament chơi với bot**, chỉ đổi lối vào.

## 3. Leo tháp

- **2 phạm vi:**
  - **Tháp tổng** — toàn diện, mọi dạng của khối (trong phần đã học, §5).
  - **Tháp chủ đề** — mỗi chủ đề 1 tháp riêng ⇒ "ai giỏi chủ đề này nhất". Chỉ mở cho chủ đề mà **phần lớn khối đã học** (không thì bảng xếp hạng toàn em học trước).
- **3 kiểu (mỗi phạm vi):**
  - **Sinh tồn** — tháp hôm nay, 5 phút, leo càng cao càng tốt, sai trừ giờ (như Đấu Từ).
  - **Vô tận · Normal** — câu **làm nhanh** (§5), giờ/câu giảm dần theo tầng, sai/hết giờ là thua.
  - **Vô tận · Hard** — thêm câu **khó / dài** + giới hạn giờ ⇒ thử thách hơn. Toán: giờ của Hard phải đủ để **nháp vài dòng**; độ khó đến từ câu khó + sai là thua, không từ ép giờ quá ngắn.
- Bảng xếp hạng: **Hôm nay / Kỷ lục**, tách **môn + khối + phạm vi + kiểu**. Chỉ hiện top + vị trí của em, không hiện người đứng cuối.

## 4. Luật trận đua (PvP · Tournament người thật)

- 4 đáp án, hai bên trả lời cùng lúc, **ai đúng trước ăn câu**, điểm theo tốc độ (ngưỡng co giãn theo giờ/câu của môn) + chuỗi.
- **SAI = KHOÁ CẢ CÂU với em đó** (mỗi em chỉ 1 lần trả lời/câu); đối thủ vẫn làm tiếp tới hết giờ.
  ⇒ đoán bừa = mất lượt, không còn là lợi thế. **ĐÃ SỬA 03/10 trong code Đấu Từ** (`lib/trongTai.ts` + bot + màn đấu; trước đó theo Bufopia: sai chỉ khoá ĐÁP ÁN đó, bấm tiếp được ⇒ bấm lần lượt 4 đáp án là ăn — với Toán là lỗ hổng lớn). Áp cho MỌI môn (symmetry). Cả 2 cùng sai ⇒ hết câu ngay. Leo tháp vốn đã 1 lần/câu. Góc luyện từ (Anh, tự ôn không thi đấu) vẫn cho chọn lại tới khi đúng.
- Bot (Tournament khi chơi một mình): mức Dễ/Vừa/Khó; luật thắng của Thử thách = **đạt ngưỡng đúng**, không phải đua bấm với bot.

## 5. Chọn câu — luật chung mọi chế độ

- **Phạm vi = DẠNG EM ĐÃ HỌC** (đã đo ≥ 3 lần — cùng định nghĩa Thử thách), không phải "cả khối" (Toán học theo tiến độ lớp; đầu năm ra câu HK2 = bất công + nản):
  - chơi một mình (bot, tháp cá nhân): dạng em đã học;
  - PvP / Tournament người: **giao** dạng đã học của các em trong trận;
  - tháp hôm nay / tháp chủ đề (chuỗi chung): dạng **phần lớn khối đã học**.
- **Câu NHANH vs câu DÀI — đo bằng THỜI GIAN LÀM THẬT**, không đoán theo mức độ: thời gian trả lời đúng (trung vị) của từng dạng trong Tự luyện, tính ở DB.
  - chế độ đua tốc độ (PvP, Tournament người, Sinh tồn, Vô tận Normal) ⇒ dạng **nhanh**;
  - Vô tận Hard ⇒ thêm dạng **dài**;
  - Thử thách (bot) ⇒ giữ luật cũ (2 thấp · 2 vừa · 1 cao theo mức độ dạng, không trùng câu đã gặp).
- Dạng chưa có MCQ không vào game (game chỉ phủ phần chương trình đã có MCQ — đo 03/10: Toán K6 27/46 dạng, K7 32/47, K8 55/60, K9 57/86).

## 6. Đo lường và điểm

- **Mọi câu trả lời trong game được GHI** (môn, dạng, câu, đúng/sai, ms, chế độ, nguồn = `game`) — dòng chỉ ra đời khi em đã trả lời (CLAUDE §1.5).
- **CHƯA tính vào mastery / Điểm Dạng / lượt học thật / chuỗi** (áp lực giờ + có đoán ⇒ tín hiệu nhiễu). **Ngoại lệ: Thử thách** tính như `spec-thu-thach-dau-truong.md` §1.7. Sau một thời gian có dữ liệu ⇒ so độ đúng game vs Tự luyện cùng dạng rồi mới quyết.
- **Điểm Rank chỉ từ Thử thách** (giữ D2). PvP / Tournament người / Tháp ⇒ **điểm season** theo môn (`spec-dau-tu-vung.md` §4: MMR ẩn + điểm season hiện, chống cày, quà cuối season).
- EXP/điểm game **theo môn** (CLAUDE §1.6) — Đấu Từ hiện XP chung mọi môn, sửa khi ghép app HS.

## 7. ⭐ GHÉP VÀO APP HS — khu HỌC TẬP (Thùy chốt 03/10 chiều — mục này ĐÈ các chỗ lệch ở §2–§5)

**Ô "Tự luyện" ngoài Home ⇒ đổi thành "HỌC TẬP"**, chú thích *"Cùng BK chinh phục thế giới"*. Bấm vào ⇒ lưới 5 ô (kiểu 2, như lưới Home) — 4 ô dưới + ô Luyện dạng yếu (§7.2b):

| Ô | Chú thích | Là chế độ nào |
|---|---|---|
| **Học theo chủ đề** | Đánh bại Ác quỷ "Phi Phai", giải cứu BK | Luyện tập = bản đồ phiêu lưu (world map → lục địa → đường dạng bài) |
| **Đấu trường BK** | Ai là người giỏi nhất | PvP + PvE: đấu online (ngẫu nhiên / mã phòng / mời bạn) + đấu bot Dễ/Vừa/Khó |
| **Chinh phục BK** | Nơi một huyền thoại sinh ra | Leo tháp: **tháp tổng ở giữa, tháp chủ đề xung quanh** (đồ hoạ ChatGPT riêng, phải thật ngầu) |
| **Giải Vô địch BK** | Con đường của nhà vô địch | Tournament, **2 chế độ: giải trực tiếp (đăng ký trước) · đấu với máy (= Thử thách cũ, giữ luật + Rank)** |

**7.1 Chọn câu theo độ khó (đè §5):**
- Đấu (Đấu trường PvP/PvE · Giải Vô địch): **chỉ câu đơn giản, làm nhanh**. Toán: **mức 1–2–3**; mức ≥4 cần suy nghĩ/chứng minh ⇒ KHÔNG vào đấu. KHTN: **dạng lý thuyết + tính toán đơn giản**, không bài phức tạp.
- Tháp: **Vô tận Normal = mức 1–3 · Vô tận Hard = có mức 4–5** (mức 4–5 CHỈ xuất hiện ở tháp Hard).
- **Bot PvE:** thời gian bot làm 1 câu = **thời gian trung bình HS thật làm đúng câu đó**; câu chưa có dữ liệu ⇒ trung bình **cụm** ⇒ **dạng**. Tỉ lệ đúng của bot = tỉ lệ đúng thật của câu (cụm/dạng). Giữ 3 mức: **Vừa = HS trung bình** · Dễ chậm hơn + sai nhiều hơn · Khó nhanh hơn + ít sai hơn.
  (Thời gian từng câu: DB chưa lưu thẳng — suy từ hiệu `cham_at` giữa 2 câu liền nhau trong 1 lượt; câu đầu lượt không suy được.)

**7.2 Luyện dạng yếu (Tự luyện tổng hợp cũ):** **80% câu từ dạng YẾU · 20% ngẫu nhiên** (trước: trộn nhiều hơn) — đã có nhiều chế độ ôn rà soát nên luồng này tập trung FIX YẾU.

**7.3 Giải Vô địch BK — giải trực tiếp:**
- Lịch cố định mỗi tuần; **đăng ký trước** (vd thứ 2–4), **thi đấu giờ cố định** (vd thứ 7). Chia bảng **theo môn + khối**.
- Loại trực tiếp; số người lẻ ⇒ nhánh lũy thừa 2, ai không có đối thủ thì tự vào vòng trong; **đối thủ vắng ⇒ tự thắng**.
- **Trận giải KHOÁ THỜI GIAN, không khoá số câu:** tổng **4 phút**, hết giờ **ai nhiều điểm hơn thắng**.
- **Luật lượt (Thùy 03/10 tối) — kiểu "giành quyền trả lời"** (R7: rung chuông / Olympia "giành quyền" / Jeopardy buzzer): 2 em **cùng 1 câu**;
  **AI BẤM TRƯỚC là câu đó KẾT THÚC** (đồng bộ cả 2): bấm đúng ⇒ người bấm thắng lượt · bấm sai ⇒ **ĐỐI THỦ thắng lượt nhưng ÍT điểm hơn** tự trả lời đúng.
  Xong lượt ⇒ cả 2 sang câu kế ngay. (Đoán bừa ⇒ phần lớn là tặng điểm cho đối thủ ⇒ không còn là game nhanh tay.)
  Mặc định (CTO, chỉnh được): tự bấm đúng **+100** · thắng nhờ đối thủ sai **+50** · mỗi câu vẫn có giờ riêng của môn (Toán 45s · KHTN 30s · Anh 12s), hết giờ câu không ai bấm ⇒ 0 điểm, sang câu · hết 4 phút giữa câu ⇒ bỏ câu · hoà ⇒ nhiều câu tự bấm đúng hơn, rồi ít sai hơn.

**7.2b Luyện dạng yếu = Ô RIÊNG** (Thùy 03/10 tối) ⇒ khu Học tập có **5 ô**.
- **Phần thưởng PHẢI có XU** (chuẩn thiết kế).

**7.4 Chinh phục BK (tháp):**
- **2 mode: Sinh tồn · Vô tận.** **Normal / Hard là chế độ TRONG Vô tận**, chuyển qua lại bằng 1 nút.
- **Mỗi tháp 1 bảng xếp hạng riêng** (tháp tổng + từng tháp chủ đề; mỗi tháp tách Sinh tồn / Vô tận Normal / Vô tận Hard).
- **Tháp chủ đề: em học tới đâu mở tới đó** — không chờ cả khối (có chủ đề lớp B/C không học, chỉ A/S học). ⇒ thay luật "phần lớn khối đã học" ở §3/§5.
  Mở cho em khi em đã học **≥ 1/2 số dạng** của chủ đề; **đề tháp = toàn bộ dạng của chủ đề, giống nhau cho mọi người** (BXH công bằng).
- **Vô tận Hard:** giới hạn giờ/câu như thường **+ giới hạn LƯỢT LEO: 3 lượt/ngày** (chống spam, rèn kiên trì) — giỏi thì 1 ngày leo được 3 tầng, không thì không được tầng nào.
  **1 tầng = 1 câu** (mức 4–5). Leo **cộng dồn qua các ngày**: mỗi lượt thử 1 tầng, đúng ⇒ lên 1 tầng và giữ; sai ⇒ mất lượt. BXH Hard = tầng cao nhất đã leo.

---

# PHẦN B — BÀN SAU (CTO điền mặc định, Thùy sửa)

- Tên khu trong app HS (gợi ý: "Đấu") và vị trí ô/lối vào; Tự luyện giữ ở bản đồ phiêu lưu.
- Ngưỡng "phần lớn khối đã học" (gợi ý ≥ 60% HS khối có ≥ 3 lần đo dạng đó).
- Ngưỡng "dạng nhanh" (gợi ý trung vị thời gian đúng ≤ 50% giờ/câu của môn) · giờ/câu của Vô tận Hard.
- PvP: giao dạng đã học quá ít (< N dạng) ⇒ nới thế nào (lấy dạng em thấp hơn đã học? cả khối?).
- Giải 8 người thật có cộng Điểm Rank không (gợi ý: không — để Rank chỉ đo độ chính xác).
- Tháp có cộng chút Điểm Rank + trần không (gợi ý: không).
- Đấu đôi 1 máy cho môn có công thức: nếu mở lại ⇒ đề hiện 1 lần ở giữa nằm ngang, 2 khu bấm trái/phải (không đối diện).

## Demo đã dựng (03/10 tối) — `hs.html?xem=hoc_tap`
- Ô Home "Tự luyện" ⇒ "Học tập" + màn 5 ô (`hoctap/HocTapHS.tsx`, icon MƯỢN — Đơn 14 Kit B). Học theo chủ đề ⇒ bản đồ phiêu lưu · Luyện dạng yếu ⇒ Tự luyện tổng hợp cũ (CHƯA đổi tỉ lệ 80/20) · Đấu trường BK / Chinh phục BK ⇒ khung game Đấu Từ NHÚNG (`dautu.html?nhung=1&vao=chu_de|thap&mon=`, build chung dist-hs) · Giải Vô địch ⇒ màn mới (giải trực tiếp = dữ liệu mẫu, đăng ký chưa lưu) + Đấu với máy = Thử thách cũ.
- CHƯA (logic): chọn câu theo mức độ (đấu 1–3, Hard 4–5) · bot theo thời gian/tỉ lệ đúng thật · luật giành quyền + 4 phút · Hard 3 lượt/ngày cộng dồn · tháp chủ đề theo khối + mở ≥1/2 dạng · Luyện yếu 80/20 · game nhúng còn hồ sơ theo máy (đổi sang tài khoản HS) · giải trực tiếp (đăng ký, lịch, nhánh, điểm danh, xu) ở DB.

## Việc kéo theo (đã biết chỗ)

- **Code Đấu Từ (`src/dautu/`):** trọng tài khoá cả câu khi sai (§4) · Tournament thiếu người ⇒ vào Thử thách · tháp thêm phạm vi chủ đề (`fn_dtv_kho_bo_cau` đã có `p_chu_de`) + Vô tận Normal/Hard · Toán cắm thêm nhánh Hình/HGT.
- **DB:** hàm phân loại dạng nhanh/dài từ thời gian làm thật · bảng ghi câu trả lời game (nguồn `game`) · BXH tháp thêm phạm vi + kiểu.
- **App HS:** lối vào khu Đấu; Thử thách chuyển lối vào sang Tournament (giữ màn + luật).
