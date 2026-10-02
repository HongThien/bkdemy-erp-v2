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
  ⇒ đoán bừa = mất lượt, không còn là lợi thế. **ĐỔI so với code Đấu Từ hiện tại** (theo Bufopia: sai chỉ khoá ĐÁP ÁN đó, bấm tiếp được ⇒ bấm lần lượt 4 đáp án là ăn — với Toán là lỗ hổng lớn). Áp cho MỌI môn (symmetry).
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

---

# PHẦN B — BÀN SAU (CTO điền mặc định, Thùy sửa)

- Tên khu trong app HS (gợi ý: "Đấu") và vị trí ô/lối vào; Tự luyện giữ ở bản đồ phiêu lưu.
- Ngưỡng "phần lớn khối đã học" (gợi ý ≥ 60% HS khối có ≥ 3 lần đo dạng đó).
- Ngưỡng "dạng nhanh" (gợi ý trung vị thời gian đúng ≤ 50% giờ/câu của môn) · giờ/câu của Vô tận Hard.
- PvP: giao dạng đã học quá ít (< N dạng) ⇒ nới thế nào (lấy dạng em thấp hơn đã học? cả khối?).
- Giải 8 người thật có cộng Điểm Rank không (gợi ý: không — để Rank chỉ đo độ chính xác).
- Tháp có cộng chút Điểm Rank + trần không (gợi ý: không).
- Đấu đôi 1 máy cho môn có công thức: nếu mở lại ⇒ đề hiện 1 lần ở giữa nằm ngang, 2 khu bấm trái/phải (không đối diện).

## Việc kéo theo (đã biết chỗ)

- **Code Đấu Từ (`src/dautu/`):** trọng tài khoá cả câu khi sai (§4) · Tournament thiếu người ⇒ vào Thử thách · tháp thêm phạm vi chủ đề (`fn_dtv_kho_bo_cau` đã có `p_chu_de`) + Vô tận Normal/Hard · Toán cắm thêm nhánh Hình/HGT.
- **DB:** hàm phân loại dạng nhanh/dài từ thời gian làm thật · bảng ghi câu trả lời game (nguồn `game`) · BXH tháp thêm phạm vi + kiểu.
- **App HS:** lối vào khu Đấu; Thử thách chuyển lối vào sang Tournament (giữ màn + luật).
