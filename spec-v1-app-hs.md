# App Học sinh — Release V1.0

> Thùy chốt 01/10/2026. File này là **kế hoạch release**: phạm vi, hiện trạng từng hạng mục, định nghĩa "xong", thứ tự làm.
> Luật chi tiết từng tính năng vẫn nằm ở spec riêng (link trong từng mục). Mâu thuẫn ⇒ quyết định mới nhất của Thùy thắng, ghi lại ở đây.
> Nền nghiên cứu cơ chế giữ chân: `design/giu-chan-hoc-sinh-kieu-duolingo.md`.

## 0. Đích và nguyên tắc

**V1.0 gồm 8 hạng mục:**
1. Tutorial cho mọi tính năng.
2. Tính năng tạo động lực: **chuỗi làm bài** + nhiệm vụ ngày / tuần / tháng.
3. Mạng xã hội Thế giới BK.
4. Hệ thống Rank đo hoàn chỉnh.
5. Giao diện toàn app theo style **"Giải cứu thế giới — đánh quái vật"**: 100% UI theo style này.
6. Ít nhất **2 style** để HS chọn.
7. Game tổ hợp Nông trại · Bắt thú · Ấp trứng.
8. Góp ý / báo lỗi: HS báo lỗi hoặc gửi ý tưởng mới.

**Ngoài V1 (đã thiết kế, ghi lại, CHƯA làm):** giải đấu tuần nhóm nhỏ (§10).

**Nguyên tắc:**
- **Màn NGANG trước.** Cấp 1–2 dùng chủ yếu iPad + máy tính ⇒ hoàn thiện khổ ngang (≥ 1024px, iPad ngang 1180×820, PC 1440) trước.
  Cấp 3 dùng điện thoại nhiều hơn ⇒ khổ dọc làm SAU. Trong V1, khổ dọc chỉ cần **không vỡ, đọc và bấm được**, chưa cần đẹp bằng ngang.
- **Một vibe duy nhất.** Mọi màn dựng bằng `skin/KhungHS.tsx` + gói style (`design/STYLE-HS.md`). `npm run check:style-hs` phải ✔ và
  **mốc màu gõ tay về 0** trước release.
- **Một định nghĩa "lượt học thật"** dùng chung cho chuỗi, nhiệm vụ, game, (sau này) giải đấu — §2.
- Mọi phép tính ở Postgres `fn_*` (CLAUDE §2.0). Mọi dữ liệu học có nhãn `mon`; tính năng chạy y hệt mọi môn (§1.6).

## 1. Hiện trạng → còn thiếu → "xong" là gì

| # | Hạng mục | Đã có (01/10) | Còn thiếu cho V1 | Xong khi |
|---|---|---|---|---|
| 1 | Tutorial | Bản demo `hs.html?xem=tutorial`: 6 chặng (Tự luyện · Chủ đề · Thử thách · Nhiệm vụ · Rank · Thế giới), lời thoại ở `tutorial/noiDungTutorial.ts` | Thêm chặng: **chuỗi**, **bản đồ phiêu lưu**, **chọn style**, **game**, **góp ý**. Gắn vào luồng thật: tự mở lần đầu + nút mở lại. Lưu tiến độ ở DB. Màn mô phỏng vẽ lại theo UI phiêu lưu | Em mới vào app được dẫn qua đủ tính năng; mở lại được từ Hồ sơ |
| 2a | Chuỗi làm bài | Chưa có | Toàn bộ (§3) | Ngọn lửa trên Home; đóng băng + sửa chuỗi chạy; mốc 7/30/100 lên Thế giới |
| 2b | Nhiệm vụ | ĐÃ BUILD, mở 01/10 (`spec-thanh-tuu-nhiem-vu.md` §0). Kit hình Đơn 1 đã ghép | Nối N2 "Luyện 20 câu" với "lượt học thật" (§2). Ô Nhiệm vụ trên Home. Vẽ lại theo UI phiêu lưu ("bảng nhiệm vụ của hội") | Chạy với tài khoản HS thật ≥ 1 tuần, số Điểm Chặng khớp tay |
| 3 | Thế giới BK | ĐÃ BUILD 29/09 (`spec-the-gioi-bk.md`) | Hình Đơn 5. Nút 👑 Thầy cô khen ở app GV. Tin chuỗi + lên bậc. Nút khoe ngay ở màn kết quả. Cấp 1 chưa có | Đủ 3 kênh với hình thật; GV khen được; tin chuỗi/bậc tự lên |
| 4 | Rank | Luật + DB + màn `RankHS` ĐÃ BUILD 28/09 (`spec-thanh-tuu-nhiem-vu.md` §0) | Hình bậc + huy hiệu (Đơn 2, 3). Nhật ký lên bậc. Danh hiệu trên Hồ sơ. Ô Rank trên Home. Chọn dạng Tự luyện/Thử thách đang chạy ở client ⇒ xuống DB. Soi bằng tài khoản thật. Chốt tháng 9 (từ 10/10) | Điểm 4 nguồn khớp đối soát tay ở 3 em; lên bậc có hoạt cảnh + tin |
| 5 | UI phiêu lưu | Style Anime RPG đã áp Home + một phần màn con. 11 file còn màu gõ tay (mốc `check-style-hs`) | **Bản đồ phiêu lưu** thay lưới thẻ (§4). Vẽ lại MỌI màn con theo chất phiêu lưu. Cấp 1 (HomeCap1) nhập về UI chung. Mốc màu gõ tay = 0 | Không còn màn nào ra giao diện cũ; check-style-hs mốc rỗng |
| 6 | ≥ 2 style | Chỉ RPG đang dùng (3 hình nền). Style 2 **Thị trấn** đang làm: 27 hình, thiếu 5 icon + 2 nền (`spec-giao-dien-hs.md` §9) | Ghép Thị trấn (`styles/town.ts`, migration nới CHECK skin). Mỗi style phải có **bộ hình phiêu lưu riêng** (bản đồ, quái) — xem §4.4 | Em chọn được 2 style, đổi là đổi hết app |
| 7 | Game tổ hợp | 2 repo riêng: `bk-nong-trai` (nhánh `nhip-ngay`), `bk-bat-thu`. CEO đã chốt gộp, chưa gộp code (`spec-bat-thu.md`) | Gộp 3 chế độ. Cổng học (§2). Bản online (`fn_nt_*`). Cho 5–10 em chơi thử. **Phạm vi game ở V1 cần chốt** (§11) | Theo phạm vi chốt ở §11 |
| 8 | Góp ý / báo lỗi | Nhân sự đã có: bảng `bao_loi` + `ReportButton` + màn `BaoLoiScreen`; GV có `GopY`. HS chưa có | Nút trong app HS (§6) + tab trong màn nhân sự để duyệt | Em gửi được lỗi + ý tưởng kèm ảnh; nhân sự thấy và trả lời |

## 2. Nền chung: "lượt học thật"

Đo 30 ngày (1.869 lượt tự luyện, 01/10):

| Số câu đúng / 10 | Lượt | Giây/câu (trung vị) | % câu đã gặp trước |
|---|---|---|---|
| 0–2 | 179 | 3,4 | 20% |
| 3–4 | 244 | 4,2 | 42% |
| 5–6 | 273 | 16,4 | 25% |
| 7–8 | 353 | 18,7 | 26% |
| 9–10 | 820 | 5,0 | 64% |

⇒ Có 2 kiểu "học giả": **bấm bừa** (0–4 câu, 3–4 giây/câu) và **nhớ đáp án câu cũ** (9–10 câu nhưng 5 giây/câu, 64% câu cũ).
Câu 4 đáp án chiếm 85% câu tự luyện ⇒ bấm bừa thuần có **7,8%** cơ hội đạt 5/10.

**Luật (Thùy chốt 01/10):**
1. Lượt 10 câu, **đúng ≥ 5** mới tính (Thùy 01/10).
2. **KHÔNG ra lại câu em đã gặp khi kho dạng đó chưa hết** (luật mặc định, mọi mode luyện — Thùy 01/10: "không dùng lại nếu chưa hết kho").
   "Đã gặp" = ở BẤT KỲ bài nào (tự luyện, Thử thách, ET, BTVN, bài trên lớp). Hết câu mới thì ra câu gặp LÂU NHẤT trước. Số đếm cho nhiệm vụ /
   giải đấu chỉ lấy câu đúng mà trước đó em chưa làm đúng.
3. **Lượt quá nhanh không tính**: trung bình < 6 giây/câu (từ lúc mở lượt tới câu cuối ÷ số câu). App báo nhẹ "lượt này em làm nhanh quá, chưa tính", không phạt.

Một hàm Postgres (`fn_luot_hoc_that` hoặc view) trả: lượt nào tính, số câu đúng mới. Chuỗi · nhiệm vụ N2 · cổng game · giải đấu (sau) đều đọc hàm này.
Ngưỡng 5/10, 30 ngày, 6 giây nằm ở 1 chỗ cấu hình trong DB.

## 3. Chuỗi làm bài

- **Ngày được tính:** có ≥ 1 lượt học thật (§2) ở phần **luyện thêm**: Tự luyện (Tổng hợp, Chủ đề) và Thử thách. **ET và BTVN KHÔNG tính** (Thùy 01/10).
- **Một chuỗi chung mọi môn** *(đề xuất — chuỗi đo thói quen như ví xu; điểm học vẫn theo môn)*. Chuỗi SUY từ lượt học (mỗi lượt có nhãn môn),
  không lưu ô "chuỗi" riêng.
- **Hiển thị:** ngọn lửa + số ngày ở đầu Home, luôn thấy. Hoạt cảnh mừng mốc **3 · 7 · 14 · 30 · 50 · 100**.
- **Lưới đỡ:** tự đóng băng ngày lớp nghỉ + tuần thi · **2 thẻ đóng băng/tháng** · lỡ 1 ngày sửa được nếu làm bù trong **48 giờ**.
- **Thế giới BK:** mốc 7 = tin A (Lớp + Bạn bè) · mốc 30, 100 = tin S (lên Thế giới). Khoe được như thành tích khác.
- **Không làm:** chuỗi một-một giữa 2 bạn · báo công khai ai đứt chuỗi · nhắc giữ chuỗi sau 22:00.
- Ngày tính theo giờ VN ở Postgres.

## 4. UI "Giải cứu thế giới — đánh quái vật"

### 4.1 Cây kiến thức → bản đồ

| Dữ liệu | Trong phiêu lưu |
|---|---|
| Môn | Một hành trình riêng (chọn môn = chọn hành trình) |
| Chủ đề | **Lục địa** (1 chương) |
| Chuyên đề | **Khu vực** trên bản đồ lục địa |
| Dạng | **Màn đấu** |
| Cụm | **Quái vật** trong màn. Dạng chưa có cụm ⇒ 1 quái mang tên dạng (cụm mới phủ ~20% dạng, gán tới đâu tách quái tới đó) |

Đại khối 9 hiện có: 12 chủ đề · 30 chuyên đề · 86 dạng · 36 cụm.

**Trạng thái màn = mức nắm dạng (HS × dạng), 3 trạng thái:** chưa đo ⇒ **sương mù** · yếu ⇒ **quái còn máu** · đạt ⇒ **chinh phục (cắm cờ)**.
Vùng lớp chưa dạy: **phủ sương nhưng vẫn vào luyện được** (khác "khoá cứng" ở chỗ em muốn học trước thì vẫn bấm vào được). Mặc định CTO 01/10.

Bản đồ đọc cây của MỌI môn qua 1 registry (§1.6). Tiếng Anh: cây phải dựng từ giáo trình tiếng Anh, không bê khuôn Toán.

### 4.2 Mode làm bài → chất phiêu lưu

| Hiện tại | Trong phiêu lưu |
|---|---|
| Tự luyện Chủ đề | Vào **màn đấu**: đánh quái của dạng đó, mỗi câu đúng là 1 đòn, máu quái = khoảng cách tới "đạt" |
| Tự luyện Tổng hợp | **Săn quái lang thang**: gặp quái ở vùng em đang yếu |
| Thử thách | **Đấu trường** |
| Nhiệm vụ | **Bảng nhiệm vụ của hội** |
| Rank | **Cấp bậc chiến binh** (10 bậc đã có) |
| Thế giới BK | **Quảng trường** |
| BTVN · ET · Bài trên lớp | Giữ nghiêm túc (bài bắt buộc), chỉ đổi khung theo style |
| Game tổ hợp | **Căn cứ / làng** của em |

### 4.3 Màn phải vẽ lại (khổ ngang trước)

Home → bản đồ thế giới · bản đồ lục địa · màn đấu (đánh quái) · kết quả lượt (quái mất máu / bị hạ) · Tự luyện · Thử thách · Nhiệm vụ · Rank ·
Hồ sơ · Thế giới BK · Thành tựu/Album · May mắn · Ví xu · Sổ tay · Thông tin học tập · Lịch bổ trợ / ca bổ trợ · Hòm thư · Đổi mật khẩu ·
màn làm bài (BTVN/ET/giáo trình) · Home cấp 1 (nhập về UI chung).

### 4.4 Hình cần đặt (ChatGPT, 1 hình/lượt — luật đơn ở `design/DON-HANG-SKIN-HS.md`)

- **Bản đồ:** mỗi lục địa 1 nền (biome riêng). Khu vực + màn đặt bằng code lên nền.
- **Quái:** **bộ 20–30 loài** + 5–8 boss. KHÔNG vẽ mỗi cụm 1 con (vài trăm cụm). Mỗi cụm gắn cố định 1 loài theo quy tắc trong DB
  (luôn ra đúng con đó). Mỗi loài vài trạng thái: đứng · trúng đòn · bị hạ.
- **Mỗi style 1 bộ** (RPG = quái fantasy; Thị trấn = phiên bản dễ thương). Đổi style là đổi cả bản đồ và quái.

## 5. Hai style

- **Anime RPG** (đang dùng) + **Thị trấn** (đang làm). Cả 2 phải đủ bộ hình phiêu lưu ở §4.4 thì mới tính là "xong".
- Lo-fi, Khối vuông: sau V1.

## 6. Góp ý / báo lỗi cho HS

- Nút cố định trong app HS (góc trên, trong menu ⋯ + ở Hồ sơ): **Báo lỗi** / **Góp ý tưởng**.
- Báo lỗi tự gom ngữ cảnh: màn đang mở, môn, mã HS, lỗi console, kích thước màn, ảnh chụp nếu em đính kèm.
- Dùng lại bảng `bao_loi` (thêm loại `hs_loi` / `hs_y_tuong`) + màn duyệt `BaoLoiScreen` cho nhân sự. Em xem được trạng thái + lời trả lời.
- Nhân sự trả lời ⇒ hiện trong Hòm thư của em. Ý tưởng được chọn ⇒ có thể khen trên Thế giới BK (sau).

## 7. Game tổ hợp

Theo `spec-bat-thu.md` §0–§1 (project riêng `BKGame`, DB + `fn_*` vẫn ở repo này). Cổng học = "lượt học thật" (§2).
Phạm vi V1: **mở dần** (Thùy 01/10). Thùy làm ở context khác, xong thì cập nhật file này.

## 8. Thứ tự làm — **DEADLINE 06/10/2026** (Thùy 01/10)

**Lịch 5 ngày (CTO đề xuất):**

| Ngày | Làm | Cần Thùy |
|---|---|---|
| 01/10 | Lát A (lượt học thật + luật không lặp câu) · đơn ChatGPT bản đồ + quái | Áp migration A · gửi đơn ChatGPT ngay |
| 02/10 | Lát B chuỗi làm bài · lát H góp ý/báo lỗi | Áp migration B |
| 03/10 | Lát C bản đồ phiêu lưu khổ ngang + màn đấu | Tải hình ChatGPT về `design/bk-ui-src/` |
| 04/10 | Lát E vẽ lại màn con (trả nợ 11 file) · ghép hình phiêu lưu | |
| 05/10 | Lát F style 2 (nếu đủ hình) · G Rank/Thế giới phần còn thiếu · I tutorial bản thật | |
| 06/10 | Soi toàn app khổ ngang bằng tài khoản thật · sửa lỗi · release | Duyệt trên iPad · deploy |

**Rủi ro lớn nhất = hình.** Bản đồ, quái, style 2, hình bậc Rank/huy hiệu đều chờ ChatGPT. Hình chưa về thì màn vẫn chạy bằng hình tạm của style RPG,
nhưng chưa đạt "100% vibe". Cấp 1 (HomeCap1) nhập UI chung là việc lớn — nếu trễ thì cấp 1 giữ màn riêng nhưng đổi màu theo style.

**Thứ tự lát:**

| Lát | Việc | Vì sao trước |
|---|---|---|
| A | `fn_luot_hoc_that` (§2) | Nền cho chuỗi, nhiệm vụ, game |
| B | Chuỗi làm bài (§3) | Rẻ, động lực lớn, chỉ cần A |
| C | Bản đồ phiêu lưu bản 1 (khổ ngang): Home = bản đồ, đọc mức nắm dạng, bấm màn ⇒ luyện dạng đó | Xương sống của UI mới |
| D | Đơn ChatGPT: bản đồ + bộ quái (RPG) | Chạy song song C, hình về thì ghép |
| E | Vẽ lại mọi màn con theo chất phiêu lưu + nhập cấp 1 | Đạt "100% UI" |
| F | Style 2 Thị trấn (đủ bộ phiêu lưu) | Cần khung E xong mới ghép hình đúng |
| G | Rank hoàn chỉnh + Thế giới BK phần còn thiếu | Phần lớn là hình + nối nhỏ |
| H | Góp ý / báo lỗi HS | Nhỏ, độc lập — làm xen lúc chờ hình |
| I | Tutorial bản thật | Làm CUỐI vì lời dẫn + mô phỏng phải theo UI đã chốt |
| J | Game tổ hợp | Track riêng ở project BKGame, song song |

**Điều kiện release:** check-style-hs mốc rỗng · soi mọi màn ở 1180×820 và 1440×900 bằng tài khoản HS thật · khổ dọc 390×844 không vỡ ·
đối soát tay Rank / nhiệm vụ / chuỗi ở 3 em · Thùy duyệt trên iPad thật.

## 9. Đo sau release

Hai sổ (theo `design/giu-chan-hoc-sinh-kieu-duolingo.md`):
- **Sổ học (có quyền phủ quyết):** BTVN đúng hạn · tỉ lệ đoán bừa · tiến bộ theo dạng.
- **Sổ thói quen:** tỉ lệ + khối lượng làm thêm tự nguyện · % em có ≥ 4 ngày/tuần.

Thói quen tăng mà sổ học giảm ⇒ không mở rộng. Đo ≥ 8 tuần trước khi kết luận.

## 10. Giải đấu tuần nhóm nhỏ — ĐÃ THIẾT KẾ, CHƯA LÀM (Thùy 01/10)

- **Không ghép theo khối được:** 30 ngày qua chỉ ~90/470 em có tự luyện (khối 6: 14 · khối 7: 22 · khối 9: 18 · khối 10–12: ~0) ⇒ nhóm theo
  khối quá nhỏ.
- **Ghép xuyên khối theo vị thế** (Thùy 01/10: "ghép các học sinh tương đồng vị thế"): vị thế = mức cố gắng tuần trước, hoặc Elo theo phần
  trăm trong khối. Công bằng vì điểm tính trên phần luyện của chính em, không so cùng đề.
- Nhóm 10–15 em, theo môn, mỗi tuần thăng/giáng hạng.
- **Điểm** = số câu đúng mới trong các lượt học thật (§2) — có trần, không đếm số lượng thô.
- Chỉ hiện phần đầu nhóm + vị trí của em. **Không hiện người đứng cuối.**
- Giao diện = "giải đấu trường tuần" trong chất phiêu lưu.

## 11. Đã chốt 01/10

1. Lượt học thật: ≥5/10 · không ra lại câu đã gặp khi kho chưa hết · bỏ lượt trung bình < 6 giây/câu.
2. Chuỗi: Tự luyện + Thử thách (luyện thêm); không tính ET, BTVN.
3. Bản đồ: vùng chưa dạy phủ sương, vẫn vào được (mặc định CTO).
4. Game: mở dần, Thùy làm ở context khác.
5. Deadline 06/10.

## 12. Còn chờ Thùy

- Chuỗi chung mọi môn (CTO đề xuất) hay mỗi môn 1 chuỗi?
- Cấp 1 có nằm trong V1 không (vào UI phiêu lưu chung), hay giữ màn riêng tới V1.1?

## (cũ) Câu hỏi đã gửi 01/10

1. §2: 2 lớp chặn (chỉ đếm câu đúng mới · bỏ lượt < 6 giây/câu)?
2. §3: chuỗi chung mọi môn? Ngày tính có kể BTVN/ET không, hay chỉ phần tự luyện?
3. §4.1: vùng lớp chưa dạy = sương mù (thấy được) hay khoá cứng?
4. §7: game tổ hợp trong V1 tới mức nào: đủ 3 chế độ, hay 1 chế độ (vd nông trại + cổng học) rồi mở dần?
5. Có hạn ngày release V1 không?

## 13. CHIA 3 LUỒNG LÀM SONG SONG (Thùy 01/10 — để kịp 06/10)

Mỗi luồng = 1 context Claude riêng. Ba luồng cùng làm trên `main` của repo này (luồng Game làm chủ yếu ở repo game riêng).
**Luật chung cho cả 3 (bắt buộc):**
- Đầu phiên: `git pull`. Commit **theo đường dẫn** (`git commit -- <file…>`), KHÔNG `git add .` / `git commit -a` — file phiên khác đang sửa
  sẽ bị cuốn theo (đã dính 28/09). Commit xong việc nào push ngay việc đó.
- **Chỉ sửa file trong "vùng của mình"** (bảng dưới). Cần đổi file vùng khác ⇒ ghi yêu cầu vào mục "Hộp thư giữa các luồng" cuối file này,
  luồng chủ file sẽ làm.
- Migration: `npm run new-migration <ten>` (tên timestamp) · thử trong ROLLBACK · áp bằng `node scripts/migrate.mjs --only <file>` (KHÔNG
  `npm run migrate` trần — còn file treo của người khác) · `npm run schema` · commit migration + schema.md cùng lúc.
- Mọi phép tính ở Postgres `fn_*` (CLAUDE §2.0) · dữ liệu học có nhãn `mon` (§1.6) · app HS theo style (`design/STYLE-HS.md`, check:style-hs ✔).
- Trong ngày chỉ APPEND `DEVLOG.md` (ghi rõ tên luồng ở tiêu đề mục: `[Số liệu]` / `[Game]` / `[Giao diện]`). HANDOFF chỉ distill cuối ngày.
- **Hợp đồng trước, mock trước:** luồng Giao diện không chờ luồng Số liệu — dựng màn bằng dữ liệu giả đúng HÌNH DẠNG hợp đồng ở §13.4
  (trang xem thử `hs.html?xem=…`), có hàm thật thì chỉ việc đổi nguồn.

### 13.1 Luồng SỐ LIỆU — "động lực đo đúng"

**Phạm vi:** chuỗi làm bài (§3) · nhiệm vụ nối "lượt học thật" · Rank hoàn chỉnh (nhật ký lên bậc, danh hiệu, chọn dạng xuống DB, chốt tháng) ·
huy hiệu (dữ liệu) · Thế giới BK phần dữ liệu (tin chuỗi, tin lên bậc, 👑 Thầy cô khen ở app GV) · góp ý / báo lỗi của HS (§6 — DB + form) ·
**hàm dữ liệu bản đồ phiêu lưu** (§13.4 `fn_ban_do_phieu_luu`).

**Vùng file:** `supabase/migrations/*` (file mình tạo) · `src/lib/*.ts` của các tính năng trên (`rank.ts`, `nhiemvu*`, `thegioi.ts`, `chuoi.ts` mới,
`baoloi.ts`, `phieuluu.ts` mới) · `src/gami/*` · app GV phần nút khen · `src/screens/baoloi/*` (màn duyệt cho nhân sự) · `scripts/_thu_mig_*.mjs` ·
`spec-thanh-tuu-nhiem-vu.md` · `spec-the-gioi-bk.md` · `spec-huy-hieu-build.md`.
**KHÔNG sửa:** `src/screens/hocsinh/**` (vùng Giao diện) — chỉ xuất hàm trong `src/lib/` đúng hợp đồng §13.4.

**Việc theo thứ tự (deadline 06/10):**
1. (02/10) Chuỗi: `fn_chuoi_cua_toi()` + đóng băng (ngày lớp nghỉ, tuần thi, 2 thẻ/tháng) + sửa chuỗi 48 giờ + tin Thế giới mốc 7/30/100.
2. (02/10) `fn_ban_do_phieu_luu(p_mon)` — giao cho Giao diện càng sớm càng tốt.
3. (03/10) Nhiệm vụ N2 "Luyện 20 câu" đếm câu trong lượt học thật · N1 Thử thách chỉ tính lượt học thật.
4. (03/10) Góp ý / báo lỗi HS: bảng `bao_loi` thêm loại `hs_loi` / `hs_y_tuong`, RPC gửi + xem trạng thái, màn duyệt nhân sự, trả lời vào Hòm thư.
5. (04–05/10) Rank: nhật ký lên bậc + tin Thế giới · danh hiệu Hồ sơ · `chonDangTuLuyen` (JS) xuống DB · 👑 khen ở app GV.
6. (05/10) Đối soát tay Rank / nhiệm vụ / chuỗi ở 3 em thật.

**Đọc trước:** `spec-v1-app-hs.md` (§2, §3, §6, §13) · `spec-thanh-tuu-nhiem-vu.md` §0 · `spec-the-gioi-bk.md` §4b–§5 · HANDOFF mục GAMIFICATION + THẾ GIỚI BK ·
mig `202610011501_luot_hoc_that_khong_lap_cau.sql` (nền đã có).

### 13.2 Luồng GAME — Nông trại · Bắt thú · Ấp trứng

**Phạm vi:** game tổ hợp, mở dần (§7). Thùy tự điều phối luồng này.
**Vùng file:** repo `HongThien/bk-nong-trai`, `HongThien/bk-bat-thu` (project `BKGame`) · trong repo này CHỈ: `spec-bat-thu.md`,
`spec-nong-trai-nhip-ngay.md`, `design/danh-gia-game-*`, migration + hàm `fn_nt_*` / `fn_game_*` của game.
**Nối với app:** cổng học đọc `public._luot_hoc_that()` qua 1 hàm game riêng (vd `fn_game_nang_luong_cua_toi()`), KHÔNG tự đếm lại câu.
Ô vào game trên app HS = việc của luồng Giao diện (ghi yêu cầu ở Hộp thư: id ô, đường dẫn mở game, icon).
**Đọc trước:** `spec-bat-thu.md` §0–§1 · `spec-nong-trai-nhip-ngay.md` · HANDOFF mục GAME BK.

### 13.3 Luồng GIAO DIỆN — "app thành thế giới quái vật"

**Phạm vi:** bản đồ phiêu lưu khổ ngang (§4.1, lát C) · màn đấu (đánh quái khi luyện) · vẽ lại MỌI màn HS theo chất phiêu lưu (§4.2–4.3, lát E;
trả nợ 11 file màu gõ tay) · hiển thị chuỗi trên Home (ngọn lửa, hoạt cảnh mốc) · báo "lượt chưa tính" ở màn kết quả · ghép hình Đơn 6 + các đơn
gami · style 2 Thị trấn (lát F) · tutorial bản thật (lát I — làm CUỐI) · cấp 1 nhập UI chung (nếu kịp).

**Vùng file:** `src/screens/hocsinh/**` (kể cả `HocSinhApp.tsx`, `skin/*`, `tutorial/*`, `gami/*` phần hiển thị) · `src/AppHS.tsx` · `src/main-hs.tsx` ·
`public/bk-ui/hs/**` · `design/STYLE-HS.md` · `design/DON-HANG-*.md` · `spec-giao-dien-hs.md` · `scripts/check-style-hs*`.
**KHÔNG sửa:** `supabase/migrations/*` và `src/lib/*.ts` của luồng Số liệu — cần dữ liệu khác hợp đồng ⇒ ghi Hộp thư.

**Việc theo thứ tự (deadline 06/10):**
1. (01–02/10) Bản đồ phiêu lưu khổ ngang trên dữ liệu GIẢ đúng hợp đồng `fn_ban_do_phieu_luu` (trang `hs.html?xem=phieu_luu`) · Home = bản đồ ·
   ngọn lửa chuỗi trên Home (dữ liệu giả `fn_chuoi_cua_toi`).
2. (03/10) Màn đấu: lượt luyện hiện như trận đánh (quái, thanh máu, mỗi câu đúng 1 đòn) · màn kết quả báo lượt có được tính không
   (`fn_luot_hoc_that_ket_qua` — đã có thật).
3. (03–04/10) Ghép hình Đơn 6 khi về (`design/bk-ui-src/Adventure/`) · đổi nguồn giả → hàm thật.
4. (04/10) Vẽ lại các màn con theo chất phiêu lưu, mốc check-style-hs về 0.
5. (05/10) Style 2 Thị trấn (nếu đủ hình) · tutorial bản thật (thêm chặng chuỗi, bản đồ, chọn style, góp ý; gắn lần đầu vào app).
6. (06/10) Soi toàn app 1180×820 + 1440×900 bằng tài khoản thật · khổ dọc 390×844 không vỡ.

**Đọc trước:** `spec-v1-app-hs.md` (§0, §4, §5, §13) · `design/STYLE-HS.md` · `spec-giao-dien-hs.md` · `design/DON-HANG-SKIN-HS.md` (Đơn 6) ·
HANDOFF mục GIAO DIỆN APP HS · tutorial demo `src/screens/hocsinh/tutorial/`.

### 13.4 HỢP ĐỒNG giữa các luồng (hình dạng dữ liệu — luồng Số liệu làm thật, Giao diện dựng giả theo đúng hình này)

```ts
// fn_chuoi_cua_toi() → jsonb   ✔ ĐÃ CÓ (mig 202610011512 + 1515) · TS: src/lib/chuoi.ts chuoiCuaToi() · chuỗi CHUNG mọi môn (Thùy 01/10)
{ so_ngay: number,                 // chuỗi hiện tại (0 = đứt / chưa có)
  bat_dau: string | null,          // ngày đầu chuỗi hiện tại
  hom_nay_da_tinh: boolean,        // hôm nay đã có lượt học thật
  luot_hom_nay: number,            // số lượt học thật hôm nay
  ky_luc: number,                  // chuỗi dài nhất
  the_dong_bang: number,           // thẻ đóng băng còn trong tháng (2/tháng, tự dùng khi hết hạn sửa)
  ngay_cho_sua: string[],          // ngày lỡ còn sửa được
  luot_can_bu: number,             // cần thêm bấy nhiêu lượt NGOÀI lượt giữ hôm nay để sửa hết
  sua_duoc_den: string | null,     // ISO — hết hạn sửa ngày lỡ cũ nhất
  moc_tiep: number | null,         // 3/7/14/30/50/100/200/365
  bay_ngay: { ngay: string, trang_thai: 'hoc' | 'dong_bang' | 'nghi' | 'trong' | 'cho_sua' | 'dut' }[] }  // 7 ngày, cũ → mới
// Mốc 7 (A) / 30·100·200·365 (S) tự thành tin Thế giới kieu='chuoi', chi_tiet { so_ngay } — khoe được như thành tích khác.

// fn_ban_do_phieu_luu(p_mon text) → jsonb   ✔ ĐÃ CÓ (mig 202610011520) · TS: src/lib/phieuluu.ts banDoPhieuLuu()
{ mon: string, khoi: string | null,
  luc_dia: { ma: string, ten: string, thu_tu: number, biome: string,          // biome cố định theo thứ tự chủ đề (xoay vòng 8 vùng Đơn 6)
    khu_vuc: { ma: string, ten: string, thu_tu: number,
      man: { ma_dang: string, ten: string, thu_tu: number, muc_do: number | null, nhanh: string | null,
        so_cau: number,                          // câu luyện được trên app (màn chỉ hiện khi so_cau > 0 HOẶC em đã có số đo)
        trang_thai: 'chua_do' | 'yeu' | 'dat',   // 3 trạng thái §5 CLAUDE.md
        muc: string | null, mastery: number | null,
        da_day: boolean,                         // false ⇒ phủ sương nhưng vẫn vào được
        la_man_boss: boolean,                    // mỗi khu vực 1 màn boss (mức độ cao nhất)
        quai: { ma: string, ten: string, loai_quai: string, la_boss: boolean }[]  // cụm ⇒ quái; boss = quái cuối của màn boss
      }[] }[] }[] }
// Hình học không có tầng chủ đề ⇒ 1 lục địa "Hình học". Thứ tự lục địa: Đại → Hình GT → Hình học. ~80–130 ms/lần.

// fn_luot_hoc_that_ket_qua(p_bai_lam_id uuid) → jsonb   — ĐÃ CÓ (mig 202610011501)
{ tinh: boolean, ly_do: 'it_cau' | 'duoi_nguong' | 'qua_nhanh' | 'khong_phai_luot_luyen' | null,
  so_cau, dung, dung_moi, giay_tb, thu_thach, mon, ngay, nop_at, nguong: { so_cau_toi_thieu, ti_le_dung, giay_tb_toi_thieu } }
```
`loai_quai` khớp tên file quái của style (Đơn 6: `slime_la`, `slime_lua`, `meo_bang`…); `biome` khớp tên nền (`rung`, `bang`, `nui_lua`, `bien_dao`…).
Gán cố định ở DB (cùng cụm luôn ra cùng con) — luồng Số liệu chọn cách gán, ghi lại ở đây.

### 13.5 Câu lệnh mở đầu cho từng context (dán nguyên vào context mới)

**Context SỐ LIỆU:**
```
Mày là luồng SỐ LIỆU của release App HS V1.0 (deadline 06/10). Đọc CLAUDE.md, HANDOFF.md mục "⭐ RELEASE APP HS V1.0", rồi
spec-v1-app-hs.md §13 (luật chung + §13.1 + §13.4 hợp đồng). Chỉ sửa file trong vùng của luồng Số liệu. Bắt đầu việc 1 (chuỗi
làm bài, fn_chuoi_cua_toi đúng hợp đồng §13.4) rồi việc 2 (fn_ban_do_phieu_luu). Mỗi migration thử ROLLBACK trước, áp --only.
```

**Context GAME:**
```
Mày là luồng GAME của release App HS V1.0. Đọc CLAUDE.md, HANDOFF.md mục "GAME BK" + "⭐ RELEASE APP HS V1.0", spec-v1-app-hs.md §7 + §13
(luật chung + §13.2), spec-bat-thu.md §0–§1. Game làm ở project BKGame; trong repo ERP chỉ sửa spec game + migration fn_nt_*/fn_game_*.
Cổng học đọc public._luot_hoc_that(), không tự đếm câu. Hỏi Thùy phạm vi game cho V1 trước khi code.
```

**Context GIAO DIỆN:**
```
Mày là luồng GIAO DIỆN của release App HS V1.0 (deadline 06/10): biến app HS thành "Giải cứu thế giới — đánh quái vật", KHỔ NGANG
trước. Đọc CLAUDE.md, HANDOFF.md mục "⭐ RELEASE APP HS V1.0" + "GIAO DIỆN APP HS", spec-v1-app-hs.md §4 + §13 (luật chung + §13.3 + §13.4),
design/STYLE-HS.md. Chỉ sửa file vùng Giao diện. Bắt đầu việc 1: bản đồ phiêu lưu khổ ngang trên dữ liệu giả đúng hợp đồng
fn_ban_do_phieu_luu (trang hs.html?xem=phieu_luu) + ngọn lửa chuỗi trên Home. check:style-hs phải ✔ trước mỗi commit.
```

### 13.6 Hộp thư giữa các luồng

*(Luồng nào cần luồng khác làm gì thì ghi 1 dòng: ngày · từ → tới · việc · trạng thái. Luồng nhận làm xong thì sửa trạng thái thành ✔.)*

- 01/10 · Giao diện → Số liệu · `fn_chuoi_cua_toi` đúng §13.4 · ✔ 01/10 (`src/lib/chuoi.ts`)
- 01/10 · Giao diện → Số liệu · `fn_ban_do_phieu_luu` đúng §13.4 · ✔ 01/10 (`src/lib/phieuluu.ts`; loài quái/biome = tên file Đơn 6, xem `_phieu_luu_bo()`)
- 01/10 · Số liệu → Giao diện · Thế giới BK: thêm chữ cho tin `kieu = 'chuoi'` ở `moTaTin()` (`TheGioiHS.tsx`), vd "giữ **chuỗi 7 ngày** 🔥" (`chi_tiet.so_ngay`) — hiện đang ra nguyên chữ "chuoi" · ⏳
- 01/10 · Số liệu → Giao diện · màn kết quả Tự luyện/Thử thách: gọi `ketQuaLuotHocThat(baiLamId)` + `loiLuotKhongTinh()` (`src/lib/chuoi.ts`) báo lượt chưa tính · ⏳
- 01/10 · Số liệu → Giao diện · (sau) ô nhập "Ngày nghỉ của chuỗi" cho quản trị: hàm có sẵn `dsNgayNghiChuoi / themNgayNghiChuoi / goNgayNghiChuoi` — Số liệu tự làm ở màn nhân sự Huy hiệu · ⏳ Số liệu
- 01/10 · Game → Giao diện · ô vào game trên Home (id ô, link, icon) · ⏳ chờ luồng Game gửi chi tiết
