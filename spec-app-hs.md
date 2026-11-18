# spec-app-hs.md — APP HỌC SINH: mọi tính năng, kể cả game (spec #12 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 18/11/2026** (bảng A12.0 + B9.0, thắng mọi dòng thân spec còn trái). **Nguồn CHƯA lưu trữ** — còn 2 file chưa đọc hết (dòng dưới); tới khi rà xong, chỗ nào spec này không nói thì file nguồn vẫn đúng.
> **MỘT file, hai phần — sửa phần nào đọc phần đó:** **PHẦN A = app học** (mục A0–A13) · **PHẦN B = game** (mục B0–B10). Luật kinh tế chung (xu · EXP · Rank · bảng xếp hạng) ở Phần A; luật chơi từng game ở Phần B.
> **`design/STYLE-HS.md` GIỮ RIÊNG** (cổng `npm run check:style-hs`) — không gộp vào đây.
> **Chưa đọc hết khi dựng nháp (KHÔNG lưu trữ các file này trước khi rà nốt):** `spec-thanh-tuu-nhiem-vu.md` dòng 305–681 (phần A / B / C) · `spec-huy-hieu-build.md` (mới đọc mục lục) · các file lịch sử Elo / EXP trong `_luu-tru/`. Chưa mở app bằng tài khoản HS thật — "em thấy gì" suy từ code.
> **Ngoài repo, không đối chiếu:** code Nông trại (`BKGame/NongTrai`), bắt thú, Lunar Cherry.

## Mục lục

**Phần A — App học**
- A0. Đích + release V1.0
- A1. Nền: style · màn ngang · lời chữ · công tắc · hiệu năng
- A2. Home + điều hướng + chọn môn
- A3. Làm bài trên app — phần em THẤY và BẤM
- A4. Tự luyện · Học theo chủ đề · Học từ đầu
- A5. Bản đồ phiêu lưu (Thùy chốt qua mockup 01/10)
- A6. Sổ tay · Ôn thi · Mục tiêu tuần
- A7. Kinh tế: xu · EXP · ĐHT · nhiệm vụ · chuỗi · vòng quay · đổi quà
- A8. Thành tựu · Huy hiệu · Rank · Bảng xếp hạng
- A9. Thế giới BK · Hòm thư · Góp ý
- A10. Tutorial + Lộc dẫn truyện (Thùy 07–08/10)
- A11. Bảng · hàm · trigger (tên đúng DB 18/11)
- A12. Lệch + câu hỏi cho Thùy
- A13. Khi Thùy duyệt — file nguồn chuyển `_luu-tru/`

**Phần B — Game**
- B0. Bảng tổng — game nào đang sống (DB 18/11; 364 em đang học)
- B1. Luật chung mọi game
- B2. Chế độ game học (Thùy chốt 03/10 — khung chung mọi môn)
- B3. Đấu trường / đấu từ vựng (`src/dautu`, trang `dautu.html`, nhúng vào app HS)
- B4. Nông trại BK (đang chạy) + bắt thú đã gộp
- B5. Làng BK · BK World (nháp — chưa chạy)
- B6. Game buổi học · Bắn quà · Catan · sự kiện · mini game
- B7. Hướng dẫn chơi + duyệt
- B8. Bảng · hàm · trigger (DB 18/11)
- B9. Lệch + câu hỏi
- B10. Khi Thùy duyệt — file nguồn chuyển vào `_luu-tru/`

---

# PHẦN A — APP HỌC (nháp 18/11) · spec #12 `spec-app-hs.md`

> **Trạng thái: NHÁP 18/11/2026 — chờ Thùy trả lời 10 câu ở A12.1.** Phần B (mọi GAME) do file `spec-app-hs.B.NHAP.md` giữ; hai phần ghép thành `spec-app-hs.md`.
> Chỗ nguồn mâu thuẫn nhau / nguồn ≠ DB-code / luật không có ngày chốt ⇒ **không tự chọn**, ghi A12. Việc code / DB từ các quyết định chỉ làm khi Thùy ra lệnh.
> **Gộp từ:** `spec-v1-app-hs.md` (trừ §7 game, mục 9 đấu từ vựng → Phần B) · `spec-giao-dien-hs.md` · `spec-so-tay-cong-thuc.md` · `spec-the-gioi-bk.md` · `spec-on-thi-gk1.md` ·
> `spec-kinh-te-nhiem-vu.md` (trừ §13 Tháp tháng → Phần B) · `spec-thanh-tuu-nhiem-vu.md` (§0 + A/B; phần Thử thách → Phần B) · `spec-bang-xep-hang.md` · `spec-huy-hieu-build.md` ·
> `_luu-tru/BUILD-BACKLOG-HS-06-10.md` · `_luu-tru/spec-qlht-hien-trang.md` · `_luu-tru/bkdemy_gami_spec_*` · `_luu-tru/de-xuat-huy-hieu.md` · `de-xuat-nhiem-vu.md` · `phan-tich-diem-rank.md` (ba nhóm sau: chỉ lịch sử, không lấy luật) ·
> HANDOFF (mục 28/09 → 17/11) · DEVLOG 28/09 → 17/11 (quyết định có ngày, ghi `(Thùy dd/mm)`) · quyết định 17–18/11 ở `spec-mastery.md` · `spec-bo-tro.md` · `spec-builder.md` · `spec-tro-giang.md` · `spec-quan-ly-chat-luong.md`.
> **Đối chiếu DB 18/11 ~12:45** (chỉ đọc: đếm dòng, `pg_proc`, `pg_trigger`, CHECK, bảng cấu hình) + code `src/screens/hocsinh/**` · `src/lib/*`. Số trong file là số ngày 18/11; "30 ngày" = 19/10 → 18/11.
>
> **Ranh giới (chỉ trỏ, không chép):**
> đo, mức đạt / yếu, HS yếu ⇒ `spec-mastery.md` · logic bổ trợ (mức, vòng đời case, nội dung ca) ⇒ `spec-bo-tro.md` · soạn / phát hành bài, mã đề ⇒ `spec-builder.md` ·
> chọn câu MCQ, báo sai phía kho ⇒ `spec-kho-cau-hoi.md` · luật Mục tiêu tuần ⇒ `spec-van-hanh-tuan.md` §4 · tủ quà phía vận hành ⇒ `spec-van-hanh-trung-tam.md` §8 ·
> chấm, duyệt báo sai phía nhân sự ⇒ `spec-tro-giang.md` · `spec-quan-ly-chat-luong.md` §3 · app phụ huynh ⇒ #13 · **luật style ⇒ `design/STYLE-HS.md` (GIỮ RIÊNG, cổng `npm run check:style-hs`)** ·
> **mọi GAME** (6 chế độ game học, tháp, Đấu trường / đấu từ vựng, Làng BK, BK World, bắt thú, Nông trại, game buổi học, hướng dẫn chơi) ⇒ **Phần B**. Phần A chỉ giữ **luật kinh tế chung** (xu · EXP · ĐHT · trần) mà game phải theo.

**Mục lục Phần A:** A0 Đích + V1.0 · A1 Nền (style · màn ngang · lời chữ · công tắc · hiệu năng) · A2 Home + điều hướng · A3 Làm bài trên app · A4 Tự luyện + Học từ đầu · A5 Bản đồ phiêu lưu ·
A6 Sổ tay · Ôn thi · Mục tiêu tuần · A7 Kinh tế · A8 Thành tựu · Huy hiệu · Rank · Bảng xếp hạng · A9 Thế giới BK · Hòm thư · Góp ý · A10 Tutorial · A11 Bảng & hàm · A12 Lệch + câu hỏi · A13 File nguồn lưu trữ.

---

## A0. Đích + release V1.0

- **Đích (Thùy 28/09):** tăng **gắn bó với app** ⇒ em có thêm động lực học. Chỉ số chính = **% HS-tuần dùng app ≥ 3 ngày / tuần** (nền 28/09: 7,1 %), không phải tổng lượt.
- **Hai sổ đo sau release (Thùy 01/10):** *sổ học* (BTVN đúng hạn · tỉ lệ đoán bừa · tiến bộ theo dạng — có quyền phủ quyết) và *sổ thói quen* (làm thêm tự nguyện · % em ≥ 4 ngày / tuần). Thói quen tăng mà sổ học giảm ⇒ không mở rộng. Đo ≥ 8 tuần.
- **Nguyên tắc (Thùy 28/09 – 07/10):** lấy **cơ chế** game, không lấy tên game · mọi dữ liệu học theo **môn**, tính năng chạy y hệt mọi môn · việc **bắt buộc** (BTVN · ET · MT) không nằm trong nhiệm vụ — nhiệm vụ chỉ đo phần **tự nguyện** ·
  **mở dần từng phần** bằng công tắc ("HS đỡ ngợp", 07/10) · mọi con số tính ở Postgres.
- **Số dùng app (18/11):** 364 em đang học · mở app 7 ngày **201 em (55 %)** · 30 ngày **303 em (83 %)** · có làm bài trên app 7 / 30 ngày **218 / 273 em**.

### Release V1.0 (Thùy 01/10, hạn gốc 06/10) — đã / chưa, đối chiếu code + DB 18/11

| # | Hạng mục | Đã có (18/11) | Còn thiếu |
|---|---|---|---|
| 1 | **Tutorial** mọi tính năng | ✅ Lộc dẫn truyện, 16 chặng, tự mở lần đầu, tiến độ theo tài khoản, tin mới tự mở (A10) | Menu xem lại cho màn cấp 1 · chặng Rank / Thế giới mô phỏng cũ |
| 2a | **Chuỗi làm bài** | ✅ DB + banner Home + mốc + thẻ đóng băng + sửa 48 giờ; đang mở | Bảng **ngày nghỉ rỗng** (câu 10) |
| 2b | **Nhiệm vụ** ngày / tuần / tháng | ✅ hệ mới 06/10 + 13/10, đang mở (Toán) | KHTN chưa bật |
| 3 | **Thế giới BK** | ✅ 3 kênh, khoe, cảm xúc, bình luận, bạn bè; mở lại 09/10 | Nút 👑 Thầy cô khen (0 lượt) · push · sticker / hình |
| 4 | **Rank** đo hoàn chỉnh | DB tính ngầm; **ẩn khỏi HS từ 06/10** | ⇒ câu 3 |
| 5 | UI **"Giải cứu thế giới"** 100 % | Bản đồ phiêu lưu 2D + màn đấu + khu Học tập; mọi cấp chung một Home | `check:style-hs` đang **RỚT 1 file**, mốc màu gõ tay còn 12 file (A1.1) |
| 6 | **≥ 2 style** | ✅ 5 style game (RPG · Khối vuông · Lo-fi · Đáng yêu · Halloween) + Tối giản | **Thị trấn chưa dựng** ⇒ câu 2 |
| 7 | Game tổ hợp | → **Phần B** (Nông trại mở 23/10) | → Phần B |
| 8 | **Góp ý / báo lỗi** | ✅ nút + bạn robot + "Góp ý của em" + màn nhân sự | **105 góp ý chưa ai xử lý** ⇒ câu 5 |
| 9 | Đấu từ vựng | → **Phần B** | → Phần B |

- **Ngoài V1, đã thiết kế, chưa làm:** giải đấu tuần nhóm nhỏ (ghép xuyên khối theo vị thế, nhóm 10–15 em, điểm = câu đúng mới trong lượt học thật, không hiện người cuối — Thùy 01/10).

## A1. Nền: style · màn ngang · lời chữ · công tắc · hiệu năng

### A1.1 Style (luật ở `design/STYLE-HS.md` — không chép)
- **Một style = một gói trọn** (`skin/styles/<id>.ts` + `public/bk-ui/hs/skin/<id>/`); đổi style là đổi HẾT (Home + mọi màn con). Màn mới chỉ dựng bằng `skin/KhungHS.tsx`; cấm màu gõ tay, cấm `if (skin === …)`, cấm màu theo giới tính (Thùy 29/09).
- **Skin không khoá theo tuổi** — mọi style mở cho mọi em (Thùy 28/09). **Mọi cấp dùng chung một giao diện** (Thùy 11/10: "tất cả các cấp UI giống nhau luôn").
- **Em chọn ở nút Hình nền; lựa chọn theo TÀI KHOẢN** (`hs_giao_dien`, chỉ có dòng khi em đã chọn; trigger ghi vết mọi lần đổi = "phiếu bầu" thay cho hỏi HS — Thùy 28/09). Mặc định RPG.
- **Đang có 6 style:** RPG (mặc định) · Khối vuông (03/10) · Lo-fi (12/10) · Đáng yêu (13/10) · Halloween (25/10, chỉ tối) · Tối giản (không tính là style game — Thùy 02/10). Em đã chọn: RPG 117 · Đáng yêu 72 · Khối vuông 62 · Lo-fi 35 · Tối giản 31 · Halloween 29 (3 em còn giữ skin cũ đã xoá ⇒ tự ra RPG).
- **Hình gamification (huy hiệu, bậc rank) là MỘT bộ chung mọi style** — đổi style không đổi thứ em đã đạt (CTO 29/09, Thùy không bác).
- **Thêm ô chức năng ⇒ mỗi style phải có icon cho ô đó.** Thêm style ⇒ migration nới CHECK `hs_giao_dien.skin` trước khi deploy.
- **Cổng:** `npm run check:style-hs` phải ✔ trước commit đụng `src/screens/hocsinh/`. 18/11: **RỚT** `CaBoTroHS.tsx` (3 > mốc 2); mốc màu gõ tay còn ở 12 file (nhiều nhất `HocSinhApp.tsx` 67).
- Đồ hoạ tự thích ứng theo máy (3 mức Thấp · Vừa · Cao, tự đo, em chỉnh tay được, lưu theo máy — Thùy 01/10) ⇒ áp cho cảnh 3D còn giữ; bản đồ hiện dùng 2D (A5).

### A1.2 Màn ngang trước (Thùy 01/10)
- Cấp 1–2 dùng iPad + máy tính ⇒ hoàn thiện khổ **ngang** (≥ 1024 px; soi 1180×820 và 1440×900) trước. Khổ dọc 390×844: **không vỡ, đọc và bấm được**, chưa cần đẹp bằng ngang.
- Màn **ngoài** (Home · khu Học tập · bản đồ) dùng tranh nền; màn **trong** kín màn hình + nền đơn sắc của style (06/10).

### A1.3 Lời chữ (Thùy 03/10)
- **Bản gốc FORMAL** (`skin/loi.ts` `LOI_FORMAL`), style game ghi đè từng khoá (`Skin.loi`); khoá không ghi đè ⇒ rơi về formal. Màn mới có chữ giọng game ⇒ thêm khoá + bản formal trước. Không gõ chữ game thẳng trong màn. Chỉ đổi câu chữ, không đổi logic.

### A1.4 Công tắc tính năng (Thùy 07/10)
- Nguồn = DB: `tinh_nang` (`mo_tu`: trống = đóng; ngày ≤ hôm nay = mở mọi lớp) + `tinh_nang_lop` (mở thử / đóng riêng một lớp) + vết tự ghi. Em thấy nếu **bất kỳ lớp nào** của em mở. Đổi không cần deploy. Lỗi gọi ⇒ app mở hết.
- **Ô đóng = ẨN HẲN** (không ô khoá); riêng Chinh phục BK · Giải Vô địch = "Sắp ra mắt". **Không bao giờ gate việc thầy cô giao:** bài trên lớp · ET · BTVN · bổ trợ · kiểm tra lại.
- **Đang MỞ (18/11):** Học tập · Sổ tay (09/10) · Nhiệm vụ + quay may mắn · Chuỗi · Thành tựu · Ví xu · Bảng xếp hạng · Thế giới BK (09/10) · Trò chơi + Nông trại (23/10) · bình luận tự do (03/11).
  **Đang ĐÓNG:** Thông tin học tập (Thùy 07/10: "bỏ luôn, nằm hết ở BXH") · Rank · Thư viện BK · Đề thi thử · Chinh phục BK · Giải Vô địch.
- Nút **"Bắt buộc cập nhật app HS"** (03/11): máy đang mở app tự tải bản mới khi em ở màn chính. Chưa thử vòng thật.

### A1.5 Hiệu năng Home (CLAUDE §2.0, đợt 4 — 14/11)
- Mở app = **1 lượt gọi** `fn_hs_khoi_dong` (hồ sơ, lớp–môn, style, nhân vật, số góp ý chưa đọc + phần màn chính). Mỗi lần về màn chính = **1 lượt** `fn_hs_man_chinh` (chuỗi · công tắc · tutorial · Elo / kỳ thi). Hàm gộp chỉ gọi lại hàm lẻ; lỗi ⇒ rơi về gọi lẻ.
- Mọi hàm Home < 30 ms (thẻ Thế giới ~80 ms, đọc bảng tin lưu sẵn). Số của nhiệm vụ / chuỗi đọc bảng chụp `hs_so_luu`; bảng xếp hạng đọc `bxh_luu` (ghi "số tính lúc…").
- **Còn ~8 lượt gọi lẻ** lúc mở Home: hòm thư · thành tựu chờ nhận · Thế giới · rank + nhiệm vụ · bổ trợ · học từ đầu · may mắn · ghi mở app (A12.2).
- Khối bổ trợ chỉ hỏi lại ở màn chính / màn lịch: 15 giây khi hôm nay có buổi, 60 giây khi không. Luật chung: một cửa polling `src/lib/poll.ts`, không polling ngắn cho số tính sẵn.

## A2. Home + điều hướng + chọn môn

- **Một Home cho mọi khối.** Từ trên xuống: tên + lớp (bấm avatar ⇒ **Hồ sơ**) → **Việc tiếp theo** (ca / bài gần nhất: gì · mấy giờ · phòng · hạn) → banner **Chuỗi** → lưới ô → menu ⋯. Bỏ lời chào viết tay, khẩu hiệu, màu theo giới tính; chữ chính ≥ 15 px (Thùy 28/09).
- **Chọn môn** (`ThanhChonMon`): chip môn theo lớp em đang học; đổi môn ⇒ mọi ô học tập, bảng xếp hạng, mục tiêu tuần đổi theo. Ví xu · chuỗi · Thế giới (kênh Thế giới) · huy hiệu-bảng E1 không theo môn.
- **Ô việc thầy cô giao (luôn hiện):** Bài tập trên lớp (giáo trình) · ET · BTVN · Bổ trợ (ca / lịch) · Kiểm tra lại · Bổ trợ Đuổi (khi có mục tiêu) · Ôn thi (khi có đề đã duyệt).
- **Ô theo công tắc:** Học tập · Mục tiêu tuần (13/11, ngay sau Học tập) · Nhiệm vụ · Bảng xếp hạng (1 ô **lớn**, Thùy 06/10) · Sổ tay · Thế giới BK · Trò chơi · Thành tựu · Ví xu. Ô May mắn **không** ở Home (vòng quay tự bật — A7.4).
- **Khu Học tập** (Thùy 03/10) = 5 ô: Học theo chủ đề (A5) · Luyện dạng yếu (A4) · Đấu trường BK · Chinh phục BK · Giải Vô địch BK (3 ô sau → Phần B).
- **Hồ sơ** (Thùy 28/09): đổi ảnh đại diện · điểm học tập (ĐHT) · 3 huy hiệu khoe · album · đồ hoạ · góp ý. Ba thứ không lẫn: **bậc rank** · **huy hiệu** · **danh hiệu** (= giải thưởng tháng). Danh hiệu + "kỷ niệm các mùa" chưa có nguồn DB ⇒ ô ẩn.
- **Riêng tư (Thùy 28/09):** điểm của ai người đó thấy; không có nút tuỳ chọn. Phụ huynh không xem Thế giới BK.
- **Rời màn rồi quay lại = đúng chỗ cũ**; sau khi làm xong một việc không tải lại cả danh sách (CLAUDE §2 React).

## A3. Làm bài trên app — phần em THẤY và BẤM

**Luật chung**
- **Giấy và app giống hệt** (Thùy 29/09): cùng thứ tự câu, cùng thứ tự đáp án, **không xáo**. Hai em cạnh nhau khác đề ⇒ **mã đề**; mã đề của em **đông cứng lúc mở bài lần đầu**, em không dò được mã của bạn (`spec-builder.md` §2.5–§2.6, §10).
- Mỗi bài có nhãn môn. Loại bài (`bai_test.loai`, có CHECK): `giao_trinh` · `btvn` · `et` · `de_thi` · `tu_luyen` · `bo_tro` · `bo_tro_test` · `retest` · `bu_luyen` · `bu_test` · `htd_luyen` · `htd_test` · `on_thi_luyen` · `thi_thu`. Thêm loại ⇒ migration nới CHECK + quyết tường minh là **test hay luyện** (`spec-mastery.md` §2).
- **Chỉ bài TEST tính mastery** (Thùy 17/11): ET · BTVN · giáo trình · đề thi lớp · `bo_tro_test` · `bu_test` · `htd_test`. **Không tính:** tự luyện (mọi khối), mọi bài luyện, retest, ôn thi, thi thử, game.
- Bài thi (ET · đề thi · test bổ trợ · retest · thi thử): em không tự đặt giờ / tự mở lại; nộp qua máy chủ.

| Bài | Em thấy / bấm | Ghi chú |
|---|---|---|
| **Bài tập trên lớp** (giáo trình) | Danh sách theo buổi → làm → biết đúng / sai ngay | 30 ngày: 85 lượt / 32 em |
| **BTVN** | Làm trên app (trắc nghiệm · đúng–sai · trả lời ngắn), biết kết quả ngay; bài tự luận nộp ảnh (qua app PH) ⇒ bài đã chấm trả về **Hòm thư** | 294 lượt / 63 em. Chấm ảnh bằng máy là việc **người bấm chạy** (`spec-tro-giang.md`) |
| **ET** | Mỗi buổi một ET; làm trong giờ, nộp một lần | 103 lượt / 28 em (phần lớn ET làm giấy) |
| **Đề thi thử lớp giao** | Thầy cô phát hành cho lớp (ô đang đóng) | — |
| **Ca bổ trợ yếu** (L2–L4, ca khối) | Lịch bổ trợ trên Home → TA điểm danh ⇒ nút **"Vào ca"** → **luyện → test**; trắc nghiệm trước, cả dạng không có thì trả lời ngắn | luyện 534 lượt / 46 em · test 141 lượt / 119 em |
| **Sau giờ** (L1) | Không làm bài trên app, không đo. **Ca sau giờ sẽ hiện trong lịch trên app** (Thùy 17/11) — chưa build | A12.2 |
| **Bù** | Luyện + test bù trên app | 79 + 121 lượt / 19 em |
| **Bổ trợ Đuổi** | Mục tiêu = đúng các dạng giáo viên chọn; em tự làm ở nhà: đọc lý thuyết → luyện → test từng dạng; ô hiện "Đã xong x / y dạng" | 26 + 43 lượt / 8 em. Luật Đuổi **chưa chốt** (`spec-bo-tro.md` §7.4) |
| **Kiểm tra lại** (retest) | Banner trên Home khi có bài | luật đang HOLD (`spec-bo-tro.md`) |

**Báo sai — em bấm ở đâu, thấy trả lời ở đâu**
- Ngay dưới câu vừa làm, hai nút: **🚩 "Em nghĩ mình đúng"** (máy chấm sai câu trả lời của em) và **🚩 "Em nghĩ đề hoặc đáp án sai"** (chọn lý do: thiếu dữ kiện · hình lỗi · công thức lỗi · đáp án sai · lời giải sai · khác; tối đa 10 câu / ngày — Thùy 10/10).
- **Trưởng khối duyệt trong 48 giờ** (Thùy 17/11). Được chấp nhận ⇒ máy chấm lại mọi bài cùng đáp án + em nhận thư ở **Hòm thư**. Trường hợp còn lại em thấy gì ⇒ câu 6.
- Tồn 18/11: **814** báo "em nghĩ mình đúng" chưa duyệt (cũ nhất 22/08) · **88** báo "đề sai" chưa xử lý.

## A4. Tự luyện · Học theo chủ đề · Học từ đầu

- **Hai lối tự luyện** (khu Học tập): **Luyện dạng yếu** (máy chọn dạng em đang yếu; màn giới thiệu "Sẵn sàng chưa?" → khung đấu có boss → kết quả) và **Học theo chủ đề** (em chọn dạng trên bản đồ — A5). 30 ngày: **4.962 lượt / ~190 em**; 73 % là Luyện dạng yếu.
  Theo khối (lượt / em): K3 53 / 2 · K4 377 / 16 · 4T 590 / 13 · K5 148 / 17 · 5T 583 / 8 · K6 412 / 22 · **K7 1.709 / 42** · K8 564 / 25 · K9 355 / 26 · K10 96 / 9 · K11 73 / 8 · K12 2 / 1.
- **Chỉ hiện / luyện DẠNG LỚP ĐÃ HỌC** (13/10); lớp chưa có số đo ⇒ không lọc. **Máy chủ chọn dạng** — em không tự gửi danh sách dạng (01/10).
- **Chọn câu:** trắc nghiệm trước; cả dạng không có ⇒ câu trả lời ngắn có đáp án (`spec-kho-cau-hoi.md`). **Không ra lại câu em đã gặp khi kho dạng đó chưa hết**; hết thì ra câu gặp lâu nhất trước (Thùy 01/10).
- **⭐ Hai ngưỡng, đừng lẫn:**
  - **Lượt học thật** (Thùy 01/10) — nền của **chuỗi**, cổng game, điểm rank: lượt **≥ 5 câu · đúng ≥ 50 %** (5 / 10) **· trung bình ≥ 6 giây / câu**. Lượt không tính ⇒ app báo nhẹ "lượt này em làm nhanh quá, chưa tính", không phạt. Ngưỡng ở một chỗ trong DB.
  - **Lượt đạt** (Thùy 06/10) — nền của **nhiệm vụ**, vòng quay, thành tựu luyện: là lượt **Luyện dạng yếu**, thoả lượt học thật **và đúng ≥ 7 / 10**.
- **Tự luyện KHÔNG tính mastery, mọi khối** (Thùy 17/11). Tự luyện chỉ được **đếm** làm hoạt động (nhiệm vụ, chuỗi, thành tựu, bảng xếp hạng, "Việc của con" ở Mục tiêu tuần). Em thấy tiến bộ tự luyện bằng gì ⇒ **câu 1**.
- **Học từ đầu:** từ 15/10 thống nhất thành **Bổ trợ Đuổi** (A3) — dạng ngoài mục tiêu giáo viên đặt thì ẩn. Màn lý thuyết của nó còn hiện thẻ `##TC` trần; đã chốt làm **khung thẻ theo style**, chưa build (`spec-ban-do-toan.md` L7).

## A5. Bản đồ phiêu lưu (Thùy chốt qua mockup 01/10)

- **Cây kiến thức → bản đồ:** môn = một hành trình · **chủ đề = lục địa** · **chuyên đề = vùng** trong lục địa · **dạng = chặng** trên con đường · **cụm = quái** của chặng. Lục địa / vùng to nhỏ theo số dạng; vị trí cố định để em nhớ đường. Đọc cây của mọi môn qua một nguồn (Tiếng Anh dựng cây riêng, không bê khuôn Toán).
- **Trạng thái chặng = mức nắm dạng:** chưa đo ⇒ **sương mù** · yếu ⇒ **quái còn máu** · đạt ⇒ **cắm cờ**. Vùng lớp chưa dạy: phủ sương nhưng **vẫn vào được** (không khoá cứng). Hero đứng trước chặng đầu tiên còn quái.
- **Đội hình quái:** cụm theo thứ tự học là elite, **cụm cuối là boss của chặng**; ít nhất 3 quái (thiếu thì thêm con tạm), **tối đa 7**; **không hiện tên cụm**. Mỗi cụm gắn cố định một loài (luôn ra đúng con đó). Quái cuối trận random giữa các boss thầy cô (Thùy · Minh Quân · Trang · Cường).
- **Số câu một lượt = số cụm thật × 2, kẹp 5 – 10.**
- **Trong trận:** đúng ⇒ quái mất 1 máu; sai ⇒ quái hồi 1 máu (tối đa hồi thêm 2); hero không có máu, không "chết"; hạ hết sớm vẫn làm hết lượt ("ôn cho chắc"). Máu cả dạng chia đều đội hình (chưa đo theo cụm).
- **Đồ hoạ (Thùy 01/10 khuya):** thế giới + lục địa + chặng = **ảnh tĩnh, code thêm hiệu ứng** (không 3D nặng máy); màn đấu 2.5D. Mỗi style một bộ bản đồ + quái; style chưa có bộ riêng ⇒ chạy như Tối giản (danh sách).
- **⚠ Sau luật 17/11:** trạng thái chặng đọc mastery, mà mastery không còn tính tự luyện ⇒ em đánh quái xong **cờ không cắm, máu không đổi** cho tới bài test kế tiếp ⇒ **câu 1**. Câu treo từ 01/10 "lượt không tính thì quái có mất máu không" gộp vào câu này.
- Chủ đề không phải kiến thức khối ("Đề thi đầu vào") đang hiện trên bản đồ — chờ ẩn (A12.2).

## A6. Sổ tay · Ôn thi · Mục tiêu tuần

### A6.1 Sổ tay kiến thức (Thùy 03/10)
- Em quên gì ⇒ gõ **tên** (tên sách, tên dân gian, không dấu) ⇒ thấy ngay. **Một ô tìm chung**: kết quả **Công thức trước**, rồi **Lý thuyết** (từ bản đồ); mỗi kết quả có nhãn loại + nhãn **Lớp X**.
- **Không chọn khối:** tìm ra toàn bộ kiến thức của môn ở **các lớp ≤ lớp em đang học** (lớp theo môn đó); cây duyệt chỉ hiện lớp của em. Luật nằm ở DB, client không gửi khối.
- **Một khuôn mục cho mọi môn:** tóm tắt · công thức · kí hiệu · ý chính · bảng · ví dụ từng bước · hay nhầm · liên quan; màn đọc là màn riêng nền sáng. **ERP là gốc** (nạp một lần, sửa trên màn Sổ tay ERP; app chỉ đọc mục **đã duyệt**, có kho rác, sửa mục đã duyệt ⇒ tự về chờ duyệt).
- **Cổng kiểm:** ≥ 2 quyển độc lập ghi giống nhau ⇒ tự qua; còn lại giáo viên duyệt. Hình KHTN vẽ bằng mã (chép nguyên bộ vẽ, không sửa tay).
- **Số:** KHTN 6–9 = **807 mục đã duyệt** · Toán 12 = **77 thẻ vẫn chờ duyệt từ 03/10** (em chưa thấy thẻ nào; 19 hình chưa vẽ).
- Chưa làm: ghi lượt tìm không ra kết quả · nối thẻ ↔ dạng bài · lớp 10–11.

### A6.2 Ôn thi (Thùy 16/10)
- Nguồn = **Kho đề thi**; em chỉ thấy đề **đã duyệt**, đúng **khối**, môn đang chọn. Hai tab:

| | Đề cương → **Luyện tập** | Đề thi trường → **Thi thử** |
|---|---|---|
| Cách làm | Từng câu, chấm ngay; có nút **"Bỏ qua, xem đáp án"** | Một lượt có đồng hồ, nộp một lần; trước khi vào có hộp hỏi "Em đã sẵn sàng chưa?" |
| Tự luận | xem lời giải | **chụp ảnh nộp kèm**; có hướng dẫn lần đầu |
| Mastery | **Không** | **Không** (Thùy 23/10) |
| Chấm | máy, tức thì | trắc nghiệm máy chấm ngay; tự luận người chấm từ ảnh; điểm tổng có sau |

- 30 ngày: Luyện tập 92 lượt / 43 em · Thi thử 55 lượt / 37 em.
- **Bàn sau (chưa chốt):** xếp hạng theo đề + quà · thang điểm tự luận · số lần thi thử một đề · đề thiếu thời gian.

### A6.3 Mục tiêu tuần (luật ở `spec-van-hanh-tuan.md` §4 — đây chỉ phần hiển thị)
- Ô **Mục tiêu tuần** ở Home, theo môn đang chọn; cùng dữ liệu, cùng cấu trúc với app PH và Phòng làm việc. Chỉ hiện khi lớp đã **công bố**.
- Em thấy: tiến độ tuần · các nhóm bài (dạng ẩn mặc định, bấm "Chi tiết" mới hiện, mỗi dạng một dòng) · "Việc của con" · hạng trong lớp. **Nhiệm vụ = chơi, Mục tiêu tuần = học — tách riêng** (Thùy 13/11).
- Tuần 16/11: 349 tờ Toán · 54 KHTN · 20 Tiếng Anh · 6 Văn. Nút "Xem lại bài trên lớp" / "Luyện tập" chưa nhảy đúng nhóm (A12.2).

## A7. Kinh tế: xu · EXP · ĐHT · nhiệm vụ · chuỗi · vòng quay · đổi quà

### A7.1 Ba đồng (Thùy 06/10)
| Đồng | Từ đâu | Dùng | Luật |
|---|---|---|---|
| **EXP** | Trên lớp (ET · BTVN · hoạt động lớp · tham dự) + trên app (nhiệm vụ · vòng quay · thành tựu) | Đổi ra xu | Theo **môn**. **100 EXP = 1 xu**, đổi **ngay** (không chờ chốt tháng), tính trên tổng EXP tháng |
| **ĐHT** (điểm học tập) | Lượt đạt + việc tuần / tháng | **Chỉ** để chơi / mua trong game (→ Phần B) | Kiếm tối đa 3.000 / tháng; **số dư tối đa 6.000**; phần dư mất. **Một chiều:** học → ĐHT → game; không đổi ra xu, không mua bằng xu |
| **Xu** | EXP đổi + giải thưởng tháng + game + thầy cô cộng / trừ | Đổi quà tại trung tâm | **Một ví chung mọi môn**, một sổ chỉ thêm; số dư = tổng sổ |

- **Ba cách kiếm xu, mỗi cách một trần riêng** (Thùy 06/10): nhiệm vụ **20 xu / tháng** · vòng quay **10 xu / tháng** · thành tựu **không trần** (tổng tự nhiên ≈ 305 xu / năm) · huy hiệu **không thưởng** · game → Phần B (Nông trại 20 xu / tháng, ≤ 4 xu / ngày — Thùy 13/10, 23/10). EXP lớp **không trần**.
- Cộng EXP đã cắt trần từng nguồn rồi mới quy ra xu **một lần** (không làm tròn riêng từng nguồn). Cách làm tròn ⇒ câu 9.
- **Xu tháng 08 đóng băng** (16/10). Em nghỉ học ⇒ ví về 0 (dòng sổ riêng). Giải thưởng tháng tự cộng **30 xu / giải cho khối 3–7**; khối 8–12 trao tiền mặt, không xu (13/10).
- **Không xếp hạng theo xu / ĐHT** (06/10).
- **Số (tháng 10, xu theo nguồn):** BTVN 5.291 · ET 4.969 · hoạt động lớp 1.472 · **thành tựu 817** · **nhiệm vụ 735** (131 em) · tham dự 232 · **vòng quay 232** (119 em) ⇒ lớp ≈ 11.960, app ≈ 1.780 (13 %). 30 ngày: giải thưởng +1.350 · Nông trại +448 · **đổi quà −9.788 (282 lượt)**. Tổng số dư 25.561 xu / 375 ví, trung vị 56.

### A7.2 Ví xu
- Em xem: số dư · xu theo từng nguồn trong tháng · lịch sử đổi quà · các hoạt động kiếm điểm. Mở ví ⇒ đồng bộ EXP → xu của chính em.

### A7.3 Nhiệm vụ (Thùy 06/10, sửa 13/10) — chỉ đếm **lượt đạt** (A4)
| Tầng | Việc | EXP | ĐHT |
|---|---|---|---|
| Ngày | Đạt 1 lượt — **tối đa 2 lượt / ngày** | 40 / lượt | 40 / lượt |
| Tuần 1 | Có lượt đạt ở **5 ngày** khác nhau | 100 | 50 |
| Tuần 2 | Tổng **6 lượt đạt** trong tuần | 100 | 50 |
| Tháng | Có lượt đạt ở **20 ngày** | 300 | 200 |

- Tuần = 4 khối cố định trong tháng (1–7 · 8–14 · 15–21 · 22–hết). Mọi việc là **đếm sự kiện**, suy ở DB; không có bảng nhiệm vụ. Trần 2.000 EXP / tháng.
- Màn Nhiệm vụ có nút **"Làm luôn ›"** = đường tắt vào Luyện dạng yếu.
- Mỗi môn một cấu hình; **đang bật: Toán. KHTN chưa bật.** Hệ cũ (N1–N3 · T1–T4 · rương · Chặng) đã thay, không chạy song song.

### A7.4 Vòng quay May mắn (Thùy 06/10)
- **1 lượt / ngày / em**, mở bởi **lượt đạt đầu tiên** trong ngày; ô không nằm ở Home — **tự hiện lời mời quay** ngay khi đủ điều kiện; chưa quay thì giữ tới hết ngày, không tích.
- Giải 10 / 20 / 30 / 50 / 100 / 200 EXP = 35 / 30 / 20 / 10 / 4 / 1 %; không có ô trượt; trần 1.000 EXP / tháng. Kết quả do DB quyết, app chỉ chạy hoạt hình. Bảng giải ở bảng cấu hình.
- 30 ngày: 126 em quay, 31.290 EXP.

### A7.5 Chuỗi làm bài (Thùy 01/10)
- **Ngày được tính:** có ≥ 1 **lượt học thật** ở phần luyện thêm (tự luyện, Đấu trường). **ET và BTVN không tính; mở app không tính.**
- **Một chuỗi chung mọi môn.** Chuỗi **suy** từ lượt học, không lưu ô "chuỗi".
- **Hiển thị:** banner ngọn lửa + số ngày ở Home, luôn thấy; 7 ngày gần nhất; hoạt cảnh mốc 3 · 7 · 14 · 30 · 50 · 100.
- **Lưới đỡ:** tự đóng băng **ngày nghỉ** (bảng ngày nghỉ, nhân sự nhập) · **2 thẻ đóng băng / tháng** (tự dùng) · lỡ 1 ngày **sửa được trong 48 giờ** bằng cách làm bù.
- **Thế giới BK:** mốc 7 = tin A · mốc 30, 100, 200, 365 = tin S.
- **Không làm:** chuỗi đôi giữa 2 bạn · báo công khai ai đứt chuỗi · nhắc giữ chuỗi sau 22:00.
- **Số:** 71 em đang có chuỗi · 40 em ≥ 7 ngày · dài nhất 63 ngày · 71 em từng chạm mốc 7, 30 em chạm mốc 30. **Bảng ngày nghỉ: 0 dòng** ⇒ câu 10.

### A7.6 Đổi quà phía học sinh
- Hiện tại em **ra tủ quà gặp nhân sự vận hành** để đổi; app chỉ cho xem số dư + lịch sử. 30 ngày: 256 lượt đã giao (8.901 xu); 82 món, giá trung vị 22 xu. **Em tự xem tủ / tự đặt trên app: chưa có** ⇒ câu 7. Luật tủ quà, đơn đặt, duyệt 3 ngày ⇒ `spec-van-hanh-trung-tam.md` §8.

## A8. Thành tựu · Huy hiệu · Rank · Bảng xếp hạng

### A8.1 Thành tựu (Thùy 06/10)
- **Nhiệm vụ = lặp theo ngày / tuần / tháng. Thành tựu = mốc.** Đạt là đạt, không có mức thấp / cao; mỗi bậc là một thành tựu riêng, **thưởng EXP riêng, một lần trong mùa** (mất chuỗi cày lại tới bậc cũ không thưởng lại).
- Bốn kiểu: **tháng** (đạt lại mỗi tháng thì thưởng lại) · **liên tiếp** · **tích luỹ** · **một lần**. **Mùa = 01/07 → 30/06**; hết mùa reset, lịch sử giữ.
- EXP ghi vào **tháng ĐẠT**, không phải tháng bấm nhận (Thùy 16/10). Em bấm **Nhận** ở màn Thành tựu; Home có chấm báo "chờ nhận".
- **Danh mục sống ở bảng `thanh_tuu_loai` + `thanh_tuu_bac`** (16 loại):

| Mã | Thành tựu | Bậc → EXP | Đang chạy |
|---|---|---|---|
| TT04 | Vào app liên tiếp | 7 / 14 / 30 / 60 / 90 / 150 / 210 / 300 ngày → 30 … 400 | ✅ (61 em) |
| TT05 | Chuỗi làm bài | cùng bậc → 100 … 800 | ✅ (76 em) |
| TT06 | Nhiệm vụ ngày liên tiếp | 7 / 14 / 30 / 60 / 90 → 100 / 200 / 500 / 600 / 800 | ✅ (30 em) |
| TT07 | Luyện yếu đạt liên tiếp | **5 / 10 / 20 lượt** → 200 / 300 / 1.000 (Thùy 16/10, cũ 3 / 5 / 10) | ✅ (69 em) |
| TT08 | Tổng câu luyện đạt | 1.000 / 2.000 / 5.000 / 10.000 → 100 / 200 / 300 / 400 | ✅ (11 em) |
| TT09 · TT10 | Top 5 · Top 1 khối (MT tháng) | 300 · 700 | ✅ (85 · 44 em) |
| TT12 | MT 10 điểm | 800 | ✅ (5 em) |
| TT16 | Giải thưởng tháng | 1 / 3 / 6 giải, không EXP | ✅ (69 em) |
| TT01 · TT02 · TT03 | BTVN 7 lần / tháng · BTVN đủ + trung bình > 80 % · ET đủ + trung bình > 80 % | 150 · 300 · 300 | ⏸ chưa bật |
| TT11 | ET 10 điểm | 200 | ⏸ |
| TT13 | Trọn bộ dạng của khối cùng "đạt" một lúc (khối > 10 dạng) | 1.000 | ⏸ |
| TT14 | Có 10 / 20 / … / 50 bạn (chỉ bạn kết mới trong mùa) | 1 **xu** / bậc | ⏸ |
| TT15 | (Ẩn) Master một chủ đề — hiện "đã mở N / M" | 1.000 / chủ đề | ⏸ |

- **143 / 364 em (39 %)** đã đạt ít nhất một thành tựu. 7 loại chưa bật ⇒ câu 8.
- Màn "Thành tựu" còn chứa **giải thưởng cuối tháng** (Xuất sắc · Tiến bộ · Chăm chỉ) do nhân sự công bố; có "Tin mới" khi em vào app.

### A8.2 Huy hiệu
- **Khung (Thùy 28/09):** 8 huy hiệu Hy Lạp theo môn (Helios · Chronos · Athena · Zeus · Phoenix · Hercules · Hephaestus · Nike), tối đa 5 sao, năm huy hiệu = tháng 7 → tháng 4, đạt rồi không mất, em ghim 3 cái khoe ở Hồ sơ, Album có "Sắp đạt". Thêm huy hiệu thứ 9 **Vinh danh** (giải tháng, 13/10).
- **Thùy 06/10: huy hiệu chỉ để SƯU TẬP — không thưởng EXP / xu.** Bốn cái đổi cách đếm: **Phoenix** (mỗi kỳ MT hạng tăng so với kỳ trước, hoặc đang ở top 10 khối) · **Hercules** (số chủ đề master; sao theo 10 / 20 / 40 / 70 / 100 % số chủ đề của khối, làm tròn lên) · **Hephaestus** (cuối tháng ≥ 80 % dạng đạt và 0 dạng yếu) · **Nike** (vượt hết tháp 50 tầng — tháp chưa mở ⇒ "Sắp có").
- **Chưa chốt từ 06/10:** thang sao 1 / 2 / 4 / 6 / 9 · bản cứng ★4–5 giữ hay bỏ · Helios / Chronos / Athena / Zeus có đổi không.
- **Thùy 15/11: "tạm thời chưa dùng".** DB: **0 em có huy hiệu**, chưa chốt tháng nào; em vẫn mở được Album (trống, mở mất 2–4 giây) ⇒ câu 4.

### A8.3 Rank (Thùy 28/09) — **đang ẨN khỏi học sinh từ 06/10, DB vẫn tính ngầm**
- Điểm Rank theo môn, đúng 4 nguồn: ET 100 / bài · BTVN 100 đúng hạn, 50 muộn · MT tháng theo hạng (1.000 → 500, hạng quy theo sĩ số dự thi; chỉ em có điểm thật) · Thử thách (→ Phần B; chỉ lượt học thật).
- **10 bậc thuần theo điểm tích luỹ mùa**, không ghế, không top % ("có thể không có God luôn"): Novice 0 · Soldier 1.575 · Captain 4.200 · General 7.875 · Hero 12.075 · Legend 18.375 · King 21.000 · Emperor 25.725 · God of War 28.350 · Supreme God 30.240 (Toán; môn khác theo hệ số × điểm tối đa tháng). Mùa = một năm; hết năm về Novice.
- Điểm Rank ≠ EXP ≠ Elo. Không cộng Điểm Rank: có mặt · bổ trợ · học từ đầu · thưởng nhiệm vụ / thành tựu.
- Số ngầm (Toán): 66 em đã qua Novice — Soldier 23 · Captain 42 · General 1. KHTN chưa bật ⇒ câu 3.

### A8.4 Bảng xếp hạng (Thùy 06/10)
- **Một ô lớn ở Home**, đi theo môn đang chọn. Mỗi bảng 2 tab: **Khối mình · Toàn BK** (không có "Lớp mình").
- **Top 20 + hạng của chính em; hạng của em chỉ mình em thấy**, hiện số thật dù thấp. Tên luôn kèm lớp; ẩn tài khoản test; chỉ xếp em **có dữ liệu thật** trong kỳ; hoà hạng ⇒ ai đạt sớm hơn đứng trước.
- **Số tính sẵn** (`bxh_luu`), màn ghi "số tính lúc…"; làm mới theo bộ điều phối 06–23 giờ.
- **8 bảng V1** (danh mục sống ở `bxh_loai`): A1 Siêng luyện ✅ · A2 Tổng câu đúng ✅ · A3 Tỉ lệ đạt ✅ · A5 Chuỗi ✅ · B1 MT tháng ✅ (Toàn BK so thẳng điểm) · C1 Leo tháp Sinh tồn ✅ (→ Phần B) · **A4 Master chủ đề ⏸ "Sắp có"** · **E1 Bộ sưu tập huy hiệu ⏸**.
- **Không làm:** xếp hạng theo Điểm Rank (đang ẩn) · theo xu / ĐHT · điểm thấp / "ít chăm nhất" · số bạn / số like.

## A9. Thế giới BK · Hòm thư · Góp ý

### A9.1 Thế giới BK (Thùy 28–29/09; mở lại 09/10)
- **Vì sao:** em học một mình thấy cô đơn; thấy bạn cũng đang học, được khen ⇒ có động lực. Làm **"mạng xã hội KHOE"**, không phải mạng đăng bài.
- **Ba kênh:** 🌏 Thế giới (toàn trung tâm, gộp mọi môn) · 🤝 Bạn bè · 🏫 Lớp (mỗi lớp em học).
- **Tin do hệ thống tự sinh từ sự kiện thật — không có bảng "bài đăng".** Ba tầng: **S** (giải tháng, huy hiệu ★4–5, mốc chuỗi 30+, trúng quà lớn…) lên Thế giới, ghim 24 giờ · **A** (Nhất buổi, đội thắng, chuỗi 7…) · **B** nỗ lực (chỉ Lớp + Bạn bè). **Thế giới chỉ tự đăng tin S**; Lớp + Bạn bè có hạn mức: mỗi em ≤ 1 tin tự động / ngày / kênh, mỗi kênh ≤ 6 tin tự động / ngày.
- **Đăng bài khoe (Thùy 29/09):** thành tích đủ chuẩn trong 3 ngày ⇒ app mời "Khoe"; em chọn một câu dẫn soạn sẵn; **tối đa 3 bài / em / ngày**, mỗi thành tích khoe một lần, em tự gỡ được. Bài khoe lên cả Thế giới.
- **Chỉ tin tốt:** không bao giờ hiện điểm kém, câu sai, hạng thấp. Phải có loại tin ai chăm cũng đạt.
- **Tương tác y hệt Facebook** (Thùy 29/09): mỗi em 1 cảm xúc / tin (bấm Thích, giữ ra dải cảm xúc); bình luận bằng **câu soạn sẵn / sticker, chạm là gửi**, tối đa 3 / em / tin. **Bình luận gõ tự do mở từ 03/11** có lọc từ cấm (thêm từ = thêm dòng). Thả tương tác **không cộng EXP**.
- **👑 Thầy cô khen:** icon riêng chỉ nhân sự thả được — hàm có, **0 lượt**, chưa có nút ở app GV.
- **Danh tính:** em tự chọn hiện **tên (luôn kèm lớp)** hoặc **mã HS** (ẩn cả tên lẫn lớp). Chủ tin ẩn được tin / tương tác trên tin mình; admin gỡ được mọi tin.
- **Bạn bè:** kết bạn 2 chiều, chỉ HS BK, tìm theo tên / mã / lớp; không chat, không nhắn tin.
- Tin đọc từ bảng lưu sẵn (11/11). **Số 30 ngày:** 144 bài khoe / 59 em · 107 lượt cảm xúc · 422 bình luận (188 gõ tự do tính từ đầu; 9 lần bị chặn) · 474 cặp bạn, 353 lời mời chờ.
- **Chưa làm:** "N bạn đang học cùng em" trong màn làm bài · thông báo đẩy (app HS chưa có đăng ký push nào) · sticker / hình riêng · giới hạn số bạn, chặn.

### A9.2 Hòm thư
- Chuông ở đầu Home, chấm đỏ khi có thư chưa đọc; mở hòm là đọc hết. Gồm: thư thật (báo sai được chấp nhận, trả lời góp ý) · **bài BTVN ảnh đã trả** (suy ra, không lưu thư) · **Tin mới** (giải thưởng, Nông trại…; 73 tin đã gửi).

### A9.3 Góp ý / báo lỗi (Thùy 01/10)
- Lối vào: **bạn robot góc dưới trái màn chính** ("Góp ý ở đây nhé" — để em nhận ra chỗ góp ý, không thưởng xu, 03/11) · menu ⋯ · Hồ sơ.
- Hai loại: **Báo lỗi** · **Góp ý tưởng**; ≥ 10 chữ, tối đa 1.500, ảnh tuỳ chọn, **5 lần / ngày**; tự gom màn đang mở, môn, kích thước màn, lỗi console.
- Em xem lại ở **"Góp ý của em"**: trạng thái + lời trả lời, chấm đỏ khi có trả lời mới; trả lời cũng vào Hòm thư.
- **Số:** 105 góp ý (54 báo lỗi · 51 ý tưởng), **tất cả còn "mới"**, cũ nhất 07/10, mới 5 cái có lời trả lời ⇒ câu 5.

## A10. Tutorial + Lộc dẫn truyện (Thùy 07–08/10)

- **Lộc = người dẫn hoạt hình** của mọi style. Tiến độ theo **tài khoản** (xem / bỏ qua từng chặng).
- **Lần đầu tự mở 5 chặng lõi:** Học tập · Luyện dạng yếu · Chuỗi · Nhiệm vụ mỗi ngày · Huy hiệu. Các chặng còn lại Lộc kể dần ở góc màn chính. Bỏ qua lần đầu ⇒ bỏ qua mọi chặng đang mở.
- **Chỉ kể tính năng đang MỞ** (lọc theo công tắc). **Tính năng mới mở** ⇒ Lộc đứng góc màn chính kể đúng phần mới; **đợt cập nhật** ⇒ chặng "Có gì mới" tự mở một lần (mẫu 03/11).
- Cuối chặng có nút **"Thử ngay"** vào màn thật; menu ⋯ "Hướng dẫn của Lộc" xem lại. Lời thoại ở `tutorial/noiDungTutorial.ts` (bản nháp Claude, Thùy sửa).
- **Số (16 chặng):** chặng được xem nhiều nhất "Học tập" 191 em xem / 148 bỏ qua; các chặng khác 33–100 em xem, 122–233 bỏ qua.
- Thi thử có hướng dẫn riêng lần đầu (A6.2). Hướng dẫn chơi game → Phần B.

## A11. Bảng · hàm · trigger (tên đúng DB 18/11)

| Mảng | Bảng | Hàm chính | Trigger / ghi vết |
|---|---|---|---|
| Home · style · công tắc | `hs_giao_dien` · `hs_nhan_vat_chinh` · `tinh_nang` · `tinh_nang_lop` · `hs_ep_cap_nhat` · `hs_mo_app` · `lich_thi_lon` | `fn_hs_khoi_dong` · `fn_hs_man_chinh` · `fn_hs_home_912` · `fn_hs_tinh_nang_mo` · `fn_hs_luu_giao_dien` · `fn_hs_mo_app` | `hs_giao_dien_log_trg` · `hs_nhan_vat_chinh_log_trg` · `tinh_nang_vet` · `tinh_nang_lop_vet` |
| Làm bài | `bai_test` · `bai_test_cau` · `bai_lam` · `bai_lam_cau` · `bai_test_report` · `bai_cau_bao_loi` · `thi_thu_anh` | `tu_luyen_sinh` · `tu_luyen_chu_de_sinh` · `tu_luyen_chu_de_ds_dang` · `fn_hs_lich_bo_tro` · `fn_hs_bu_dang` · `fn_hs_bao_loi_cau` · `fn_hs_on_thi_ds / _xem / _luyen_sinh` · `fn_hs_thi_thu_bat_dau / _diem` · `htd_*` · `fn_duoi_*` | — |
| Lượt · chuỗi | `tu_luyen_dang_lan` · `tu_luyen_so_cau` · `chuoi_moc_dat` · `chuoi_ngay_nghi` · `hs_so_luu` | `_luot_hoc_that` · `_luot_hoc_that_nguong` · `_luot_tinh` · `fn_luot_hoc_that_ket_qua` · `fn_chuoi_cua_toi` | — |
| Bản đồ | (đọc cây bản đồ + mastery lưu sẵn) | `fn_ban_do_phieu_luu` · `fn_ban_do_phieu_luu_man` · `_phieu_luu_bo` | — |
| Sổ tay | `sotay_cong_thuc` · `sotay_ct_chu_de` · `sotay_ct_hinh` · `sotay_ct_lich_su` | `hs_sotay_tim_ct` · `hs_sotay_tim_lt` · `hs_sotay_cay_hs` · `hs_sotay_muc_cay` · `hs_sotay_muc` | `sotay_cong_thuc_truoc_ghi` · `sotay_cong_thuc_lich_su` |
| Mục tiêu tuần | `mtt_*` (→ #7) | `fn_mtt_cua_toi` · `fn_mtt_cac_tuan` · `fn_mtt_top` · `fn_mtt_dang_tinh_trang` | → #7 |
| Xu · EXP · ĐHT | `gami_exp_ledger` · `qlht_xu_ledger` · `xu_thanh_phan` · `dht_tieu` · `nhiem_vu_cau_hinh` · `may_man_hs_cau_hinh` · `may_man_hs_luot` | `fn_hs_vi_xu_cua_toi` · `fn_xu_dong_bo_cua_toi` · `_xu_dong_bo` · `fn_xu_tu_exp` · `fn_exp_app_thang` · `fn_gami_exp_xu_thang` · `fn_hs_nhiem_vu_cua_toi` · `_nv_luot_dat` · `fn_may_man_hs_quay` · `fn_dht_cua_toi` · `fn_dht_tieu` | sổ xu chỉ thêm |
| Thành tựu · huy hiệu · rank | `thanh_tuu_loai` · `thanh_tuu_bac` · `thanh_tuu_dat` · `huy_hieu` · `huy_hieu_dieu_kien` · `huy_hieu_thang_sao` · `hs_huy_hieu_dat` · `hs_huy_hieu_khoe` · `hs_thanh_tuu_thang` · `rank_cau_hinh` · `rank_bac` · `rank_len_bac` · `gami_mua` · `hs_giai_thuong` · `hs_tin_moi` | `fn_thanh_tuu_cua_toi` · `fn_thanh_tuu_nhan` · `fn_thanh_tuu_cho_nhan` · `fn_hs_album` · `fn_hs_ho_so` · `fn_hs_khoe_dat` · `fn_hs_rank_cua_toi` · `fn_rank_mua` · `fn_hs_len_bac_moi` | — |
| Bảng xếp hạng | `bxh_loai` · `bxh_luu` · `bxh_luu_tinh` | `fn_bxh` · `fn_bxh_danh_muc` · `_bxh_lam_moi` | — |
| Thế giới BK | `the_gioi_tin_luu` · `the_gioi_bai_khoe` · `the_gioi_khen` · `the_gioi_binh_luan` · `the_gioi_bl_chan` · `the_gioi_an_tin` · `the_gioi_cai_dat` · `the_gioi_danh_muc` · `ban_be_loi_moi` · `tu_cam` | `fn_the_gioi_home` · `fn_the_gioi_kenh` · `fn_the_gioi_khoe` · `fn_the_gioi_tha` · `fn_the_gioi_binh_luan` · `fn_the_gioi_binh_luan_chu` · `fn_ban_be_*` · `_the_gioi_tin_lam_moi` | mọi bảng `the_gioi_*` + `ban_be_loi_moi` có `*_log` → `the_gioi_log` |
| Hòm thư · góp ý · tutorial | `thong_bao_hs` · `hs_tin_moi` · `bao_loi` (+ cột `hoc_sinh_id`) · `bao_loi_tra_loi` · `hs_tutorial` | `fn_hs_gui_gop_y` · `fn_hs_gop_y_cua_toi` · `fn_hs_gop_y_chua_doc` · `fn_hs_tutorial_cua_toi` · `fn_hs_tutorial_ghi` | `trg_bao_loi_hs_hom_thu` · `trg_log_bao_loi` |

- Việc theo lịch (một dòng ở bộ điều phối `tinh_san_dang_ky`): `the_gioi_tin` · `bxh` · `tu_luyen_so_cau` · `mastery` · `lop_dang_da_hoc` · `muc_tieu_tuan`.
- Code: `src/screens/hocsinh/**` · `src/lib/{hs_home,tuluyen,chuoi,nhiemvu,vixu_hs,thanhtuu_moi,huyhieu,rank,bxh,thegioi,thongbaohs,tinmoi_hs,gopy_hs,baoloi_cau,tutorial_hs,giaodien_hs,tinhnang,phieuluu,sotay,sotayCongThuc,onthi,hoctudau,mucTieuTuan}.ts` · `scripts/check-style-hs.mjs` (+ `.moc.json`).

## A12. Lệch + câu hỏi cho Thùy

### A12.0 THÙY CHỐT 18/11 (Phần A) — câu 8 · 9 · 10 Thùy trả lời riêng, còn lại "theo ý m" = theo đề xuất

| Câu | Luật chốt | Việc code / DB (chờ lệnh) |
|---|---|---|
| 1 | Giữ MỘT mức đạt / yếu. App HS thêm **dấu "đã luyện" riêng trên từng dạng** (vd "đã luyện đạt 3 lượt — chờ bài kiểm tra để cắm cờ"; quái sang trạng thái "đã yếu đi"). Chỉ app HS dùng; giáo viên KHÔNG dùng để đánh giá. | dấu đã luyện ở bản đồ phiêu lưu / màn dạng |
| 2 | Hạng mục "≥ 2 style" của V1.0 **coi là xong**; style Thị trấn gác lại, không thuộc V1. | — |
| 3 | **Rank tiếp tục ẩn**, vẫn tính ngầm; rút Rank khỏi danh sách V1.0. Mở lại là quyết định riêng. | — |
| 4 | **Ẩn Album huy hiệu**, bỏ chặng tutorial Huy hiệu, ẩn bảng xếp hạng "Bộ sưu tập huy hiệu" tới khi bật lại. | ẩn 3 chỗ |
| 5 | Góp ý / báo lỗi của HS: **một người phụ trách, hạn 7 ngày**; Claude gom ý trùng + soạn sẵn lời trả lời, người đó duyệt theo lô; 105 cái tồn xử lý một lượt. *Ai phụ trách: Thùy chưa chỉ tên.* | việc tồn (invariant) + lô trả lời |
| 6 | **Mọi báo sai đều có thư trả lời** trong Hòm thư (đúng / chưa đúng kèm một dòng lý do / đề đã sửa). | thư cho ca "em sai" và "đề đã sửa" |
| 7 | Em **xem tủ quà + giá trên app**; đổi vẫn tại tủ. Đặt quà trên app: để sau. | màn tủ quà chỉ đọc |
| 8 | **"Chưa vội"** — KHÔNG bật thêm thành tựu; giữ 9 loại đang chạy. | — |
| 9 | **"Làm tròn xuống"** — quy EXP ra xu làm tròn XUỐNG (250 EXP ⇒ 2 xu; 99 EXP ⇒ 0 xu). *Phần lẻ có cộng dồn sang tháng sau không: Thùy chưa nói — hỏi lại khi sửa.* **Code đang làm tròn LÊN.** | sửa hàm quy EXP → xu |
| 10 | **"Không có buổi học diễn ra thì hệ thống tự nhận diện nghỉ chứ"** — chuỗi tự đóng băng vào ngày KHÔNG có buổi học diễn ra; **không ai phải nhập lịch nghỉ**. *Tôi hiểu: ngày cả trung tâm không có buổi học nào (lễ, Tết) = ngày nghỉ. Nếu ý là "ngày LỚP EM không có buổi" thì khác hẳn (em học 2 buổi / tuần) — xác nhận khi sửa.* | chuỗi đọc lịch buổi học thay bảng nhập tay |

### A12.1 Mười câu hỏi gốc (ĐÃ TRẢ LỜI ở A12.0 — giữ làm bối cảnh)

**1. Tự luyện không còn tính vào mức đạt / yếu — vậy trên app em thấy "mình luyện có tác dụng" bằng gì?**
Ví dụ: một em lớp 7 yếu dạng "Cộng trừ số hữu tỉ", tối nay Luyện dạng yếu 3 lượt đều 9 / 10. Sáng mai mở bản đồ: quái của dạng đó **vẫn còn nguyên máu**, dạng vẫn nằm trong danh sách yếu, cho tới khi em làm ET hoặc BTVN có dạng đó. 30 ngày qua có 4.962 lượt tự luyện của khoảng 190 em.
(a) Giữ một mức đạt / yếu như đã chốt; app thêm một **dấu "đã luyện"** riêng trên từng dạng (ví dụ "đã luyện đạt 3 lượt — chờ bài kiểm tra để cắm cờ"), quái đổi sang trạng thái "đã yếu đi". Dấu này chỉ app HS dùng, giáo viên không dùng để đánh giá.
(b) Không thêm gì: em thấy tiến bộ qua nhiệm vụ, chuỗi, thành tựu, bảng Siêng luyện như đang chạy.
Đang chạy: (b). **Đề xuất: (a)** — không đụng mastery, nhưng em thấy ngay việc mình vừa làm có kết quả.

**2. Hạng mục "ít nhất 2 style" của V1.0 đã coi là xong chưa, và style Thị trấn có làm nữa không?**
Ngày 01/10 chốt 2 style của V1 là RPG + Thị trấn. Thực tế đã có 5 style game (RPG · Khối vuông · Lo-fi · Đáng yêu · Halloween) + Tối giản, 346 em đã tự chọn; riêng **Thị trấn chưa dựng** (hình về 27 / 34 từ 29/09).
(a) Coi hạng mục đã xong; Thị trấn gác lại, không thuộc V1. (b) Vẫn phải dựng Thị trấn thì V1 mới xong.
**Đề xuất: (a).**

**3. Rank: tiếp tục ẩn, mở lại, hay tắt hẳn?**
Rank ẩn khỏi học sinh từ 06/10 nhưng máy vẫn tính ngầm: 66 em Toán đã lên bậc (42 em Captain) mà không em nào biết. V1.0 có hạng mục "Rank đo hoàn chỉnh".
(a) Tiếp tục ẩn, vẫn tính ngầm; rút Rank khỏi danh sách V1.0. (b) Mở lại cho học sinh. (c) Tắt cả phần tính ngầm.
Đang chạy: (a) nhưng V1.0 vẫn ghi là phải có. **Đề xuất: (a)** — mở lại là một quyết định riêng sau khi chốt Đấu trường (Phần B), vì một nguồn điểm Rank nằm ở đó.

**4. Huy hiệu "tạm thời chưa dùng" (15/11) — có ẩn hẳn khỏi app không?**
Hiện em vẫn bấm vào Album được: 8 huy hiệu trống, chưa em nào có sao, mở mất 2–4 giây; chặng tutorial "Huy hiệu" còn là một trong 5 chặng Lộc kể cho em mới.
(a) Ẩn Album, bỏ chặng tutorial Huy hiệu khỏi 5 chặng đầu, ẩn bảng xếp hạng "Bộ sưu tập huy hiệu" cho tới khi bật lại. (b) Giữ như hiện nay.
**Đề xuất: (a).** Ba câu cũ về huy hiệu (thang sao, bản cứng, 4 huy hiệu chưa đổi) để tới lúc bật lại.

**5. Góp ý / báo lỗi của học sinh — ai trả lời, trong bao lâu?**
Từ 07/10 các em đã gửi 105 góp ý (54 báo lỗi, 51 ý tưởng). Tất cả vẫn ở trạng thái "mới", mới 5 cái có lời trả lời. Màn "Góp ý của em" hứa với em là có trạng thái + lời trả lời.
(a) Giao một người phụ trách (Thùy chỉ tên), hạn 7 ngày; Claude gom các góp ý trùng và soạn sẵn lời trả lời, người đó bấm duyệt theo lô. (b) Không hứa trả lời từng cái: app chỉ ghi "BK đã nhận", chỉ trả lời góp ý được chọn làm.
Đang chạy: không ai được giao. **Đề xuất: (a)**, và 105 cái tồn xử lý một lượt theo lô.

**6. Em bấm "báo sai" rồi thì nhận được trả lời trong trường hợp nào?**
Ví dụ: em bấm "Em nghĩ mình đúng". Nếu trưởng khối đồng ý, em có thư trong Hòm thư. Nếu trưởng khối thấy em sai, hoặc em báo "đề sai" và đề được sửa — theo code hiện tại em **không nhận được gì**. Đang tồn 814 + 88 cái.
(a) Mọi báo sai đều có thư trả lời trong Hòm thư (đúng / chưa đúng kèm một dòng lý do / đề đã sửa, cảm ơn em). (b) Chỉ báo khi em đúng, như đang chạy.
**Đề xuất: (a)** — em báo mà không ai trả lời thì lần sau không báo nữa.

**7. Học sinh có được xem tủ quà và đặt quà trên app không?**
Hiện em phải ra tủ quà gặp nhân sự để đổi (30 ngày: 256 lượt, 8.901 xu); app chỉ có số dư và lịch sử. Tủ có 82 món, giá phổ biến 22 xu; số dư phổ biến của một em là 56 xu.
(a) Cho em **xem** tủ quà + giá trên app (biết mình còn thiếu bao nhiêu xu), đổi vẫn tại tủ. (b) Cho em **đặt** trên app, Lộc duyệt trong 3 ngày rồi giao. (c) Giữ như hiện nay.
**Đề xuất: (a) trước** — rẻ, tạo mục tiêu để dành xu; (b) làm sau khi quy trình duyệt đơn của Lộc chạy ổn.

**8. Bảy thành tựu chưa bật — bật tiếp cái nào?**
Đang chạy 9 loại (143 em đã đạt ít nhất một cái). Chưa bật: BTVN 7 lần / tháng · BTVN đủ và trung bình > 80 % · ET đủ và trung bình > 80 % · ET 10 điểm · trọn bộ dạng của khối · nhiều bạn BK (trả xu) · thành tựu ẩn master chủ đề. Ba cái đầu vướng định nghĩa: tháng có 8 buổi thì "7 BTVN" là em nộp ≥ 7 bài, hay nộp đủ mọi bài được giao?
(a) Bật 4 cái dễ đo (ba cái tháng với nghĩa "nộp ≥ 7 bài trong tháng" + ET 10 điểm); 3 cái còn lại để sau vì dính luật đo mới và cách trả xu. (b) Dừng ở 9 loại.
**Đề xuất: (a).**

**9. Quy EXP ra xu: làm tròn lên có phải cố ý không?**
Ví dụ: tháng này em có 250 EXP ⇒ hiện nhận 3 xu (làm tròn lên); 99 EXP ⇒ 1 xu. Câu này treo từ 16/10.
(a) Giữ làm tròn lên (em luôn được lợi phần lẻ, tối đa 1 xu / môn / tháng). (b) Làm tròn xuống, phần lẻ cộng dồn sang tháng sau.
Đang chạy: (a). **Đề xuất: (a)** — số chênh nhỏ, đổi thì phải giải thích cho các em.

**10. Chuỗi làm bài: ai nhập ngày nghỉ để chuỗi không đứt oan?**
Luật 01/10: ngày lớp nghỉ và tuần thi thì chuỗi tự đóng băng. Bảng ngày nghỉ hiện **chưa có dòng nào**; 71 em đang giữ chuỗi, em dài nhất 63 ngày; Tết sắp tới.
(a) Lộc nhập lịch nghỉ + tuần thi mỗi đầu tháng (thành một việc của Lộc, quá hạn thì hiện đỏ). (b) Bỏ lưới này, chỉ giữ 2 thẻ đóng băng / tháng + sửa trong 48 giờ.
**Đề xuất: (a).**

### A12.2 Lệch kỹ thuật (không cần Thùy quyết — CTO làm khi có lệnh)

1. `check:style-hs` **RỚT** ở `CaBoTroHS.tsx` (3 màu gõ tay > mốc 2); mốc còn 12 file (`HocSinhApp.tsx` 67 · `MayManHS.tsx` 17 · `DoiMatKhau.tsx` 12…).
2. Home còn ~8 lượt gọi lẻ ngoài 2 RPC gộp (hòm thư, thành tựu chờ nhận, Thế giới, rank + nhiệm vụ, bổ trợ, học từ đầu, may mắn, ghi mở app) — trái "một màn một lượt gọi".
3. `fn_hs_album` 1,9–3,7 giây (bảng chốt tháng trống ⇒ tính sống 5 tháng mỗi lượt mở).
4. Hòm thư + báo sai **đọc / ghi thẳng bảng** từ client (`thong_bao_hs` select + update; `bai_test_report` insert) — nên qua hàm. `thong_bao_hs` thuộc `postgres` ⇒ tài khoản đối chiếu đọc ra 0 dòng (không phải bằng chứng bảng rỗng).
5. Phát hành bài + chấm BTVN / giáo trình còn ở client (`spec-builder.md` L5).
6. App HS hiện thẻ `##TC` trần ở lý thuyết (`HocTuDau.tsx`) — đã chốt làm khung thẻ theo style, chưa build.
7. **Ca sau giờ hiện trong lịch trên app** (Thùy 17/11) — chưa build; thân `fn_hs_lich_bo_tro` chưa thấy nhắc ca sau giờ (cần mở màn kiểm).
8. `nhiem_vu_cau_hinh` còn 15 cột của hệ nhiệm vụ cũ (N2, N3, rương, Chặng…) và `tran_xu_app = 100000` (trần chung không còn tác dụng); `may_man_hs_cau_hinh` còn 4 dòng tỉ lệ cũ. Dọn phải theo Luật xoá.
9. `hs_giao_dien.skin` còn nhận 4 giá trị style đã xoá (3 em đang giữ); CHECK chưa có `town`.
10. `bao_loi.loai` chỉ có `bug` · `yeu_cau` (không phải `hs_loi` / `hs_y_tuong` như nguồn ghi) — góp ý HS nhận ra bằng cột `hoc_sinh_id`. Spec ghi theo DB.
11. Vòng quay: `may_man_hs_luot` unique theo (em, ngày) — đúng luật "1 lượt / ngày / em"; mở môn 2 không cần đổi.
12. Thế giới BK: hàm 👑 Thầy cô khen có, chưa có nút ở app GV · push cho app HS chưa có đăng ký nào · chữ tin `len_bac` không dùng khi Rank ẩn.
13. Sổ tay Toán 12: 77 thẻ chờ giáo viên duyệt từ 03/10, 19 hình chưa vẽ · chưa có trong `smoke:sotay`.
14. Bản đồ: chủ đề "Đề thi đầu vào" đang hiện · style ngoài RPG chưa đủ bộ hình phiêu lưu thì chạy như danh sách.
15. Mục tiêu tuần: nút "Xem lại bài trên lớp" / "Luyện tập" chưa nhảy đúng nhóm.
16. Chưa ai kiểm bằng tài khoản HS thật: nút "Vào ca" · nút "Bắt buộc cập nhật app" · hộp Lộc trên màn chính · ô đóng ẩn đúng ở mọi khối.
17. Hồ sơ: ô danh hiệu + "kỷ niệm các mùa" chưa có nguồn (cần chốt bậc cao nhất cuối mùa trước 30/06/2027 nếu Rank mở lại).

### A12.3 Tôi đang hiểu thế này — không hỏi, sai thì Thùy sửa

- **Cấp 1 đã vào giao diện chung** (Thùy 11/10) ⇒ câu treo "cấp 1 có nằm trong V1 không" coi như đã trả lời.
- **Thông tin học tập bỏ hẳn** khỏi app HS (Thùy 07/10); Thư viện BK tạm ẩn, chưa có ngày mở.
- **Hạn 06/10 của V1.0 đã qua**; V1.0 không còn là một ngày, mà là bảng "đã / chưa" ở A0.
- Hệ nhiệm vụ 28/09 (Điểm Chặng, rương tuần), ngân sách "30 xu / môn / tháng", thưởng EXP của huy hiệu, 2 bậc "ghế" của Rank, skin theo 3 nhóm tuổi: **đã bị các chốt sau thay** — không đưa vào spec.
- Nhiệm vụ, Rank, thành tựu gắn môn mới chạy cho **Toán**; bật môn khác = bật cấu hình, không viết lại.
- Quà theo hạng thi thử, giải đấu tuần nhóm nhỏ, thẻ story, tổng kết tháng, hẹn giờ tập trung, khởi động trước buổi, tổ học: **ý tưởng đã ghi, chưa chốt, không làm**.

## A13. Khi Thùy duyệt — file nguồn chuyển `_luu-tru/`

| File | Ghi chú |
|---|---|
| `spec-v1-app-hs.md` | trọn (§7 + mục 9 đã sang Phần B; §13 chia luồng là lịch sử) |
| `spec-giao-dien-hs.md` | trọn (luật style vẫn ở `design/STYLE-HS.md`; đơn hình ở `design/DON-HANG-*.md` — giữ nguyên) |
| `spec-so-tay-cong-thuc.md` · `spec-the-gioi-bk.md` · `spec-on-thi-gk1.md` · `spec-bang-xep-hang.md` · `spec-huy-hieu-build.md` | trọn |
| `spec-kinh-te-nhiem-vu.md` | trọn (§13 Tháp tháng nằm ở Phần B) |
| `spec-thanh-tuu-nhiem-vu.md` | trọn (phần Thử thách nằm ở Phần B; mô phỏng, phụ lục điểm MT là lịch sử) |

- **Giữ nguyên, không gộp:** `design/STYLE-HS.md` · `design/DON-HANG-*.md` · `design/THE-GIOI-BK-danh-muc-tuong-tac.md` · `design/giu-chan-hoc-sinh-kieu-duolingo.md` · `scripts/check-style-hs*`.
- Sau khi ghép A + B: sửa `SPEC-INDEX.md` (dòng #12 + bảng B) và CLAUDE.md §7 (gộp các dòng `spec-v1-app-hs` · `spec-che-do-game`… thành một dòng trỏ `spec-app-hs.md`).

---

# PHẦN B — GAME (nháp 18/11/2026, chờ Thùy duyệt)

> Phần B của `spec-app-hs.md` (spec #12). Phần A = app học (Home, làm bài, tự luyện, bản đồ phiêu lưu, sổ tay, ôn thi, xu / EXP / nhiệm vụ / chuỗi, thành tựu, Rank, bảng xếp hạng, Thế giới BK, tutorial).
> **Gộp từ:** `spec-che-do-game` · `spec-thu-thach-dau-truong` · `spec-dau-tu-vung` · `spec-nong-trai-nhip-ngay` · `spec-bk-world` · `spec-bat-thu` · `spec-lang-bk` · nháp `spec-game-ban-qua` · `spec-game-buoi-hoc` · `spec-game-catan` · `HUONG-DAN-CHOI-DUYET` (phần game) · mục game của HANDOFF + DEVLOG 23/09 → 17/11.
> **Đối chiếu:** DB thật (đọc 18/11 trưa, role `claude_build`, chỉ đọc) + code `src/dautu`, `src/screens/hocsinh`, `games-site/`, `public/games/nong-trai/`.
> **Ngoài repo, KHÔNG đối chiếu được:** code game Nông trại (`BKGame/NongTrai`, repo `bk-nong-trai` — chỉ thấy bản đã chép vào `public/games/nong-trai/`) · bắt thú / BK World (`BKGame/BatThu`, repo `bk-bat-thu`) · Lunar Cherry.
> **Ranh giới (chỉ trỏ):** đo, mastery → `spec-mastery.md` · chọn câu, MCQ → `spec-kho-cau-hoi.md` · luật xu / EXP / ĐHT / nhiệm vụ / chuỗi / Rank / bảng xếp hạng → **Phần A** · bài học tương tác 3D (du hành, hình 3D) → spec #17, **không phải game** · vận hành sự kiện → `spec-van-hanh-trung-tam.md` §7 · style màn → `design/STYLE-HS.md` · đồ hoạ game 3D → `design/nghien-cuu-do-hoa-little-habitats.md` · `spec-lunar-cherry.md` là project riêng ngoài ERP · nội dung môn Anh gác lại (17/11).
> Chữ **TỰ ĐẶT** = số CTO đặt để chạy thử, chưa ai chốt. Chữ **nháp** = chưa chốt, không làm theo khi chưa có lệnh.

**Mục lục:** B0 bảng tổng · B1 luật chung · B2 chế độ game học · B3 Đấu trường / đấu từ vựng · B4 Nông trại (+ bắt thú) · B5 Làng BK · BK World · B6 game buổi học · Bắn quà · Catan · sự kiện · mini game · B7 hướng dẫn chơi + duyệt · B8 bảng · hàm · trigger · B9 lệch + câu hỏi · B10 file vào `_luu-tru/`.

---

## B0. Bảng tổng — game nào đang sống (DB 18/11; 364 em đang học)

| Game | Trạng thái | Số chơi thật | Nguồn | Mục |
|---|---|---|---|---|
| **Nông trại BK** | **ĐANG CHẠY** (mở mọi lớp 23/10) | 189 trại · 191 em có giờ chơi · 7 ngày: 100 em, 310 ngày-chơi · TB **3,7 phút** / ngày chơi · xu đã trả 448 (T10 214 / 42 em · T11 234 / 39 em) | DB `nt_*` | B4 |
| ↳ thăm vườn bạn | ĐANG CHẠY | 2.465 việc: bắt sâu 869 · trộm 780 · tưới 694 · chó đuổi 122 | `nt_ban_viec` | B4.5 |
| ↳ Tăng tốc bằng Toán | ĐANG CHẠY | 215 lượt nộp · 26 em · 200 đạt | `nt_tang_toc_*` | B4.6 |
| ↳ Câu cá | ĐANG CHẠY (lên 14/11) | 58 bản lưu đã có sổ cá | `nt_luu.state.ca` | B4.7 |
| **Đấu trường — đấu với máy** (Toán) | **ĐANG CHẠY, đang tụt** | 1.887 trận · 91 em · 30 ngày 841 / 69 em · 7 ngày 49 / 19 em (tuần 12/10: 704 trận → tuần 09/11: 79) | `dtv_tran` | B3 |
| ↳ KHTN | ĐANG CHẠY, rất ít | 53 trận · 7 em | `dtv_tran` | B3 |
| ↳ Tiếng Anh | ĐANG CHẠY, rất ít | 88 trận · 7 em + khách | `dtv_tran` | B3 |
| **Đấu trường — đấu online** | ĐANG CHẠY, gần tắt | Toán 543 trận · 61 em · 30 ngày 203 · **7 ngày 2** | `dtv_tran` `mang` | B3 |
| Giải 8 người (trong Đấu trường) | ĐÃ BUILD, gần như chưa ai chơi | 16 trận · 4 em | `dtv_tran` `giai` | B3 |
| Nối từ · Góc luyện từ (Anh) | ĐÃ BUILD CHƯA EM NÀO CHƠI | 8 trận, toàn khách | `dtv_tran` | B3 |
| **Chinh phục BK** (leo tháp) | ĐÃ BUILD, CHƯA MỞ (công tắc `chinh_phuc` đóng) | 29 lượt, toàn khách thử · 0 em | `dtv_thap_luot` | B2.3 |
| **Giải Vô địch BK** — giải trực tiếp | MỚI SPEC (màn dữ liệu mẫu, công tắc đóng) | 0 | code | B2.5 |
| **Thử thách** — bản cũ 10 câu | ĐANG CHẠY, gần tắt | 596 lượt · 75 em · 30 ngày 28 / 7 em · 7 ngày 1 | `thu_thach_luot` | B2.4 |
| Thử thách — luật 3 trận (02/10) | MỚI SPEC (màn xem thử, chưa có DB) | 0 | code | B2.4 |
| **Game buổi học — Mở Rương** | **ĐANG CHẠY** | 865 lượt · 221 em · 116 buổi · 30 ngày 492 lượt / 67 buổi | `buoi_game_luot` | B6.1 |
| Game buổi học — Chiếm Đất | ĐANG CHẠY | 138 lượt · 63 em · 13 buổi | `buoi_game_luot` | B6.1 |
| Game buổi học — Bắn Quà | ĐÃ BUILD CHƯA LỚP NÀO CHƠI | 1 ván thử, chưa chốt | `buoi_ban_qua` | B6.2 |
| Game buổi học — Đoán Số | MỚI SPEC (chờ luật Thùy) | 0 | — | B6.1 |
| Game sự kiện (Trung thu 26/09, BK Escape) | ĐÃ CHẠY 1 lần | không đếm được (bảng `sk_*` của `postgres`) | — | B6.4 |
| Xếp Chữ · Hình Nhân · Giải mã · Cờ Tỉ Phú | ĐÃ BUILD, không nằm trong app HS | Xếp Chữ 11 dòng bảng xếp hạng · Hình Nhân 1 | `game_xep_chu_*` · `game_bxh_*` | B6.5 |
| BK Catan | NHÁP — game của **nhân viên**, không phải HS | — | `games-site/` | B6.3 |
| Bắt thú / BK World ("Săn lùng Quái Vật") | ĐÃ BUILD bản lưu trên máy, CHƯA vào app (thẻ "Sắp ra mắt") | ngoài repo | — | B4.9 · B5 |
| Làng BK | NHÁP (logic 12/10 + bản thử kỹ thuật `lang-bk-spike/`) | 0 | — | B5 |

---

## B1. Luật chung mọi game

1. **Game KHÔNG tính mastery** (Thùy 17–18/11): mastery một bản, chỉ bài test; tự luyện và mọi game — kể cả Thử thách, Tăng tốc bằng Toán — không tính, mọi khối. Luật đo: `spec-mastery.md`. *(Câu "Thử thách vẫn tính mastery" của 02/10 và 03/10 hết hiệu lực.)*
2. **Câu trả lời trong game vẫn được ghi lại** (môn, câu, đúng / sai, số mili-giây, chế độ) — dòng chỉ ra đời khi em đã trả lời. Mục đích: sau này so độ đúng game với bài test rồi mới bàn có dùng không.
3. **Xáo:** bài thường trên app **không xáo** (giấy và app giống hệt). **Ngoại lệ duy nhất: game Đấu trường xáo vị trí phương án mỗi đề** (Thùy 03/11 — em thuộc vị trí).
4. **Câu trong game = trắc nghiệm 4 đáp án**, chọn qua điều kiện chung của kho (`spec-kho-cau-hoi.md`). Dạng chưa có câu trắc nghiệm thì không vào game.
5. **Phạm vi câu = dạng lớp em đã học** (Thùy 14/10; 03/11: "ngẫu nhiên hoàn toàn các câu đã học", không cho chọn chủ đề lẻ để tránh học thuộc).
6. **Chế độ giữ nguyên mọi môn, chỉ đổi nội dung.** Thêm môn = thêm một dòng ở chỗ khai báo nguồn câu (`src/dautu/nguon/index.ts`). Không có nhánh riêng cho Toán.
7. **Kinh tế:** game chỉ phát những khoản ghi ở bảng dưới. Luật xu / EXP / ĐHT, tỉ lệ đổi, chốt tháng ⇒ **Phần A**.

| Game | Phát gì | Trần | Số thật |
|---|---|---|---|
| Nông trại | xu vào ví thật (100 EXP game = 1 xu, **tỉ lệ cố định** — Thùy 05/11) | 20 xu / tháng · 4 xu / ngày chơi · chỉ ngày chơi ≥ 5 phút | 448 xu từ 23/10 |
| Nông trại | **tiêu** điểm học tập (ĐHT): mọi khoản mua trong game trả bằng ĐHT | theo số dư ĐHT (Phần A) | 63.501 ĐHT · 110 em |
| Game buổi học | EXP của môn, nguồn "Trên lớp" | mỗi em 1 lượt / buổi (100–400 EXP theo giải) | 30 ngày: 116.080 EXP · 194 em |
| Game buổi học | quà thật "trà sữa" (rút thêm) | Nhất 1 % · Nhì 0,5 % · Giải 3 0,1 % mỗi lượt | 3 em trúng, **0 đã trao** |
| Đấu trường · tháp | **không xu, không EXP ví** — chỉ điểm trận, cấp trong game, bảng xếp hạng | — | — |
| Thử thách | Điểm Rank (Rank đang đóng) | → Phần A | — |
| Bắt thú · Làng BK | chưa chạy | — | — |

8. **Chỉnh nhịp xu của game bằng lượng game phát ra** (sản lượng cây, số lượt câu), **không bằng trần** — trần chỉ là lưới an toàn (Thùy 05/11, 07/11).
9. **Chống gian lận — máy chủ quyết mọi thứ có giá trị.** Hiện trạng:
   - Nông trại: giờ, số phút chơi, xu, ĐHT, trộm / giúp bạn do máy chủ tính. **Trạng thái vườn (cây, kho, cấp) do máy em gửi lên nguyên khối** — máy chủ chỉ chặn ghi đè bản mới hơn.
   - Đấu với máy (Toán, KHTN) và tháp khi em đăng nhập: máy chủ chọn đề, chấm từng câu.
   - Đấu online, giải, môn Anh, khách chưa đăng nhập: **máy em tự chấm** (xem B9 câu 3).
   - Game buổi học: máy chủ rút EXP + quà. Riêng Bắn Quà điểm thô đến từ TV, giáo viên xem rồi mới chốt.
10. **Lưu trạng thái ở DB theo tài khoản.** Không bao giờ lặng lẽ rơi về bản lưu trên máy: không nối được máy chủ thì báo "Chưa kết nối được" + nút Thử lại (bài học 03/11 — em thấy "về cấp 1" dù dữ liệu máy chủ còn nguyên).
11. **Giờ chơi:** Nông trại 30 phút / ngày, máy chủ đo. Các game khác chưa có giới hạn (B9 câu 4).
12. **Tải DB:** app HS và ERP chung một DB. 75 % nhịp Nông trại và 69 % trận Đấu trường rơi vào 17–22 giờ ⇒ không chạy lô máy, truy vấn nặng trong khung này; hàm game gọi chỉ tốn theo một em; số xếp hạng đọc bảng tính sẵn (`spec-kien-truc.md`).
13. **Bật / tắt game = công tắc tính năng ở DB** (`tinh_nang`, không cần deploy). Riêng Nông trại có thêm công tắc bảo trì.
14. **Đồ hoạ:** hình game 3D dựng bằng code; quái, boss do Thùy thiết kế; được lấy cơ chế, số liệu, bố cục của game mẫu (Hay Day, Palworld…), hình tự làm.

---

## B2. Chế độ game học (Thùy chốt 03/10 — khung chung mọi môn)

### B2.1 Khu Học tập trên app — 5 ô

| Ô | Là gì | Trạng thái |
|---|---|---|
| Học theo chủ đề | bản đồ phiêu lưu = Luyện tập | → Phần A |
| Luyện dạng yếu | 80 % câu dạng yếu · 20 % ngẫu nhiên; thưởng phải có xu | → Phần A |
| **Đấu trường BK** | đấu online + đấu với máy Dễ / Vừa / Khó | đang chạy (B3) |
| **Chinh phục BK** | leo tháp: tháp tổng ở giữa, tháp chủ đề xung quanh | đã build, công tắc đóng ("Sắp ra mắt") |
| **Giải Vô địch BK** | giải trực tiếp (đăng ký trước) · đấu với máy = Thử thách | công tắc đóng |

- Đấu đôi hai em một máy: môn Anh giữ; môn có công thức (Toán, KHTN) **tạm dừng**, thay bằng đấu hai iPad.

### B2.2 Luật trận đua (đấu với máy · online · giải)

- Bốn đáp án, hai bên trả lời cùng lúc, **ai đúng trước ăn câu**. Điểm theo tốc độ 100 / 70 / 50 + thưởng chuỗi.
- **Sai = khoá cả câu với em đó** (mỗi em một lần trả lời / câu); cả hai cùng sai thì hết câu.
- **Sai bị trừ đúng bằng điểm câu đúng cùng tốc độ** (100 / 70 / 50), tổng trận được âm; máy sai cũng bị trừ (Thùy 03/11 — không trừ thì bấm bừa là lời).
- Giờ mỗi câu theo môn: Toán 45 giây · KHTN, Vật lý, Hoá học 30 giây · Anh 12 giây.
- Câu trong trận đua: chỉ câu làm nhanh. Toán mức 1–3; KHTN lý thuyết + tính đơn giản.
- Máy đấu ba mức. Đích (chưa làm): thời gian và tỉ lệ đúng của máy lấy từ số thật của học sinh trên câu đó; Vừa = học sinh trung bình.

### B2.3 Leo tháp (Chinh phục BK) — đã build, chưa mở

- Hai phạm vi: **tháp tổng** (mọi dạng đã học của khối) · **tháp chủ đề** (mỗi chủ đề một tháp).
- Hai mode: **Sinh tồn** (tháp hôm nay, 5 phút, sai trừ giờ) · **Vô tận** — trong Vô tận có **Normal** (mức 1–3, giờ mỗi câu giảm dần, sai là thua) và **Hard** (có mức 4–5, một tầng = một câu, **3 lượt leo / ngày**, tầng cộng dồn qua các ngày).
- Mỗi tháp một bảng xếp hạng riêng, tách Sinh tồn / Normal / Hard, có Hôm nay và Kỷ lục; chỉ hiện top + vị trí của em.
- Tháp chủ đề mở cho em khi em đã học ≥ 1/2 số dạng của chủ đề; đề tháp giống nhau cho mọi người.
- Tháp không cộng Rank, không xu.
- **Đã có:** Sinh tồn + Vô tận, máy chủ chấm, theo bản đồ mới K6–12 (26/10), bảng xếp hạng "Leo tháp Sinh tồn". **Chưa có:** Normal / Hard tách riêng, 3 lượt / ngày, mở theo ≥ 1/2 dạng.

### B2.4 Thử thách = giải đấu với máy

- **Luật Thùy chốt 02/10 (chưa code):** 3 trận liên tiếp × 5 câu; ngưỡng thắng 60 % → 80 % → 100 %; thua là dừng; 2 lượt / ngày / môn, chưa đóng lượt 1 thì chưa mở lượt 2; có nút Bỏ cuộc; quá 30 phút không làm ⇒ máy chủ tính thua; máy chủ chọn 15 câu một lần (mỗi trận 2 thấp · 2 vừa · 1 cao, không trùng); cần ≥ 5 dạng đã học mới mở. Đo **độ chính xác**, không đua bấm. Điểm Rank 10 / 20 / 30, trần tuần ⇒ Phần A.
- **Đang chạy:** bản cũ — một lượt 10 câu, đúng ≥ 8 là vượt, không giới hạn lượt. Màn 3 trận + hoạt cảnh mới chỉ là trang xem thử (dữ liệu giả).
- Hoạt cảnh sau mỗi trận (sét, thiên thạch, cầu lửa…), boss, nhân vật: giữ như thiết kế 02/10 — chi tiết ở `_luu-tru/spec-thu-thach-dau-truong.md` §4.

### B2.5 Giải Vô địch BK — giải trực tiếp (mới spec)

- Lịch cố định mỗi tuần: đăng ký trước, thi giờ cố định; chia bảng theo môn + khối; loại trực tiếp; đối thủ vắng ⇒ tự thắng.
- Trận khoá **4 phút**, hết giờ ai nhiều điểm hơn thắng.
- Luật lượt "giành quyền trả lời": hai em cùng một câu, **ai bấm trước là câu kết thúc** — bấm đúng +100; bấm sai ⇒ đối thủ +50 (số TỰ ĐẶT).
- Chưa có gì ở DB (đăng ký, lịch, nhánh, thưởng).

---

## B3. Đấu trường / đấu từ vựng (`src/dautu`, trang `dautu.html`, nhúng vào app HS)

- **Gốc:** game Đấu Từ vựng (Thùy 02/10, mẫu Bufopia) — mục đích ôn từ + học từ mới, lớp 3–9, **không thưởng xu theo trận**, quà chỉ trao cuối mùa. 03/10 thành khung chung mọi môn.
- **Môn đang cắm:** Tiếng Anh (bộ từ đóng sẵn trong app: 16 chủ đề × 60 từ) · Toán · KHTN · Vật lý · Hoá học (lấy câu từ kho).
- **Chế độ đã có:** đấu với máy 3 mức · online (ghép ngẫu nhiên / mã phòng 6 số / mời bạn) · giải 8 người · leo tháp · riêng Anh: nối từ, góc luyện (ôn từ yếu, thẻ ghi nhớ, góp từ).
- **Người chơi:** em đăng nhập ⇒ theo tài khoản; chưa đăng nhập ⇒ "khách" theo máy (23 hồ sơ khách / 196).
- **Máy chủ chấm:** đấu với máy Toán, KHTN và tháp của em đăng nhập. Đề do máy chủ sinh, xáo phương án bằng khoá bí mật của đề, chấm từng câu, mỗi câu một lần; "bỏ qua" chỉ được sau ≥ 2 giây.
- **Mùa bảng xếp hạng:** mùa 1 bắt đầu 03/11 (reset bảng sau khi đổi luật trừ điểm + xáo; giữ cấp).
- **Chưa làm (so với thiết kế 02/10):** điểm xếp hạng mùa + bậc + quà cuối mùa · đấu "bóng ma" (đấu lại bản ghi trận thật của bạn) · giờ vàng · trọng tài máy chủ cho online / giải · kho từ Anh theo sách ở DB · mức nhớ từng từ tính ở DB (đang lưu trong hồ sơ).

---

## B4. Nông trại BK (đang chạy) + bắt thú đã gộp

### B4.1 Mục tiêu và nhịp (Thùy 29–30/09)

- Tạo thói quen vào app mỗi ngày. **Vào 1 lần / ngày, một phiên 10–15 phút.** Cây chín theo **ngày**, không theo giờ; không chuỗi máy kiểu Hay Day.
- Nối với việc học: **mọi khoản mua trong game trả bằng điểm học tập (ĐHT)** (12/10). Thưởng nỗ lực, không thưởng điểm số.
- **Ngày nông trại đổi lúc 5 giờ sáng** giờ Việt Nam. Cây không héo, không chết.
- Chơi màn ngang; một khung nhìn thấy trọn trại (không bản đồ rộng).

### B4.2 Xu — luật đang chạy

| Luật | Giá trị | Chốt |
|---|---|---|
| Tỉ lệ | 100 EXP game = 1 xu, phần lẻ giữ lại | cố định (05/11) |
| Trần tháng | **20 xu / em / tháng** | 12/10 · 07/11 "thiết kế để em chỉ kiếm tối đa 20 xu" |
| Trần ngày | 4 xu × số ngày chơi ≥ 5 phút (cộng dồn) | 23/10 "tránh rủi ro lỗi game" — xem B9 câu 6 |
| Điều kiện | ngày đó chơi ≥ 5 phút (máy chủ đo) | 13/10 — xem B9 câu 5 |
| Ngân sách thiết kế | ≈ 2.000 EXP / tháng cho em chăm nhất, đủ 12 ô: cây + máy chế biến ≈ 1.500 · gà, bò ≈ 200 · giúp bạn, hái trộm ≈ 300 | 07/11 |
| Chỉnh nhịp | bằng sản lượng cây, **không** bằng trần | 05/11 |

- Trần của Nông trại là trần riêng, không ăn vào trần xu theo môn của app.
- **Hết hiệu lực** (số 30/09 trong spec cũ): trần 30 xu / tháng (mùa đầu 45) · trần chi 5 xu / tháng · "điểm chăm chỉ" (đã thay bằng ĐHT) · bonus mùa đầu +60 % / +30 % (tạm bỏ 23/10) · bắt đầu 4 ô.

### B4.3 Ruộng, cây, chăm sóc

- **Bắt đầu 8 ô, tối đa 12** (Thùy 07/11). Ô 9–12 mở theo cấp 12 / 14 / 16 / 18 + trả 30 / 40 / 50 / 60 ĐHT.
- Mua theo bịch hạt: 1 bịch = 1 ô; mỗi ngày mua tối đa số bịch = số ô.
- 13 loại cây, chín sau 1–3 ngày. **Tưới** đủ mọi ngày +80 % · **bón** +25 % (một lần / vụ) · **sâu** còn lại lúc thu −20 % / con.
- Cấm bán phân bón khi chơi theo tài khoản (lỗi 07/11: mua bằng ĐHT, bán ra EXP ⇒ đổi ĐHT thành xu; đã thu hồi 46 em).
- Cấp nông trại đi theo số ngày chăm vườn: trần 8 điểm nhà nông / ngày.

### B4.4 Con vật, máy chế biến, nhà

- Gà (cấp 4), bò (cấp 10): cho ăn mỗi ngày ⇒ trứng, sữa.
- Máy chế biến (03/11): bánh mì, bánh ngô, khoai nghiền, bánh bí — tính theo phút, bán hơn bán thẳng khoảng 30 %.
- Thú cưng mua bằng ĐHT: chó, mèo, chim + 10 "bạn đồng hành" lấy từ BK World (chỉ xem, chưa có kỹ năng).
- Nhà: 3 kiểu (Gỗ · Việt · Nhật) × 4 mức, "phải lộng lẫy" (Thùy 14/11); em tự chọn kiểu, tự trang trí sân, biển cổng tên em. Cách nâng mức nhà: **chưa chốt**.

### B4.5 Bạn cùng lớp

- Chỉ bạn cùng lớp. **Giúp 10 lượt / ngày** (tưới hộ, bắt sâu hộ), mỗi lượt +1 EXP (07/11). **Hái trộm 3 lượt / ngày**: chỉ ô chín từ hôm trước chủ chưa hái; mỗi lượt 1 quả; mỗi ô mất tối đa 20 %; ô dưới 3 quả không hái được. Chó giữ vườn đuổi trộm.
- Trộm là chuyển đồ giữa các em, không đẻ thêm xu.

### B4.6 Tăng tốc bằng Toán (03/11)

- Ở máy chế biến: 3 câu trắc nghiệm mức 2–3 trong dạng em đã làm; đúng ≥ 2 ⇒ giảm 50 % thời gian còn lại. Chờ 60 giây giữa hai lượt, tối đa 5 lượt / ngày, đề hạn 10 phút. Không đẻ thêm EXP. Không tính mastery (B1.1).

### B4.7 Câu cá (14/11)

- Cá bán ra EXP: 4 bậc, giá 10 / 20 / 30 / 40, xác suất 70 / 25 / 4 / 1 %; có sổ tay sưu tập; 10 loài trước, sau lên khoảng 20.
- **3 lượt câu / ngày — TỰ ĐẶT** (≈ 41 EXP / ngày ≈ 1.200 EXP / tháng nếu câu trúng hết) — B9 câu 7.
- Máy chủ chưa biết gì về cá (bản lưu ghi nguyên).

### B4.8 Kỹ thuật

- Game là web tĩnh ở repo riêng → chép vào `public/games/nong-trai/` bằng `scripts/dong-bo-nong-trai.mjs` → app HS nhúng, nói chuyện bằng tin nhắn giữa hai khung. Sửa game = commit repo game + chép + commit ERP.
- Số luật tồn tại hai nơi (game + DB: bảng cây, luật trộm / giúp) ⇒ đổi phải đổi cả hai, có test so khớp (`scripts/test-nt-ban.mjs`).
- Công tắc bảo trì: bật ⇒ không vào được game, không ghi bản lưu.

### B4.9 Bắt thú (gộp với Nông trại 01/10) — chưa vào app

- **Thùy chốt:** kiểu Palworld (đánh cho yếu rồi ném bóng) · gộp với Nông trại thành một game · em chơi vì có bạn + để kiếm xu · không chat gõ tự do · phase đầu chỉ bắt thú + ấp trứng, thú phải **dễ thương** · cưỡi thú là tính năng quan trọng · 4 tầng thú (thường · săn mồi đỉnh · thần thoại · truyền thuyết) · 4 khuôn dáng (4 chân · bay · bơi · bò trườn) · quy trình làm một con thú (research tỉ lệ → dựng theo mẫu → Thùy sửa).
- Đã duyệt hình: Cáo Lửa · Cừu Mây · Băng Thần Mã · Thiên Kình. Bản 3 màn lưu trên máy đã chạy được ở repo game (02–03/10).
- Trên app HS: thẻ "Săn lùng Quái Vật — Sắp ra mắt".
- **Xu khi bắt thú: nguồn vênh — B9 câu 8.**

---

## B5. Làng BK · BK World (nháp — chưa chạy)

- **BK World (Thùy 01–02/10):** học ra **điểm học tập** → mua hạt → trồng → bán lấy xu; nông sản chế bóng → vé vào hang → bắt thú → lai hai thú ra trứng → ấp ra loài mới theo công thức; có shiny, alpha. Ba màn: trang trại · bắt thú · ấp trứng; thú bắt được đi dạo ở trại. Thùy chốt: thú, trứng **không bán ra xu** · chưa cho đổi / tặng thú · điểm học tập một nguồn · mỗi loài một hang riêng, có truyện · mỗi lần vào hang 3 lần ném · 4 loại vé theo 4 tầng thú. Số (giá bóng, tỉ lệ) đều TỰ ĐẶT.
- **Làng BK (Thùy 12/10, khối 4–8):** thế giới sống kiểu Stardew, là **đích phase 2**. Đã chốt: hai phố theo khối (4–5 · 6–8) nối bằng quảng trường · mọi lớp có nhà lớp · nông trại = kiếm xu, nhà cửa = tiêu xu · gộp nông trại, thú, ấp trứng vào Làng · chat chỉ emote + câu soạn sẵn · không rương / trứng ngẫu nhiên mua bằng xu · phố phải ra phố, nhà có biển tên, nhiều kiểu nhiều cỡ · 3D khối ghép, máy quay chếch cố định. Kinh tế **tạm gác** ("thiết kế game trước"). Chỉ bắt đầu khi có 4–6 tuần số liệu app và bản online đã chạy với 5–10 em thật.
- Đã có: bản thử kỹ thuật `lang-bk-spike/` (phố 60 nhà + 25 nhân vật). Chưa đo trên iPad gen 7.
- Thiết kế chi tiết (không gian, vòng chơi, mốc M0–M4): `_luu-tru/spec-lang-bk.md`, `_luu-tru/spec-bk-world.md`, `_luu-tru/spec-bat-thu.md` — không chép lại ở đây.

---

## B6. Game buổi học · Bắn quà · Catan · sự kiện · mini game

### B6.1 Game buổi học (Thùy 27–28/09 — đang chạy)

- Một bộ code, hai bộ luật: bản sự kiện (mặc định) và bản buổi học (`?che_do=lop`). Bản buổi học: **kết quả rút ở máy chủ, TV chỉ diễn**.
- **Xếp hạng buổi:** giáo viên chọn 1 Nhất + 1 Nhì (lớp trên 10 em có mặt: tối đa 2 Nhì); em có mặt còn lại = Giải 3; em vắng không có giải. Gợi ý chỉ từ điểm bài trên lớp của chính buổi. Chốt là khoá; đã có em chơi thì không mở lại. Không ảnh hưởng Elo.
- **Mỗi em 1 lượt / buổi**, giáo viên chọn game. Em không bao giờ mất EXP.
- **Mở Rương:** Nhất → rương Vàng 200–400 EXP (TB 300) · Nhì → Bạc 200–300 (TB 250) · Giải 3 → Gỗ 100–200 (TB 175). TB cả lớp khoảng 200 EXP / em / buổi.
- **Chiếm Đất:** ô ★ / ★★ / ★★★ = Giải 3 / Nhì / Nhất, EXP y hệt Mở Rương, chọn ô bất kì.
- **Trà sữa** (quà thật, rút thêm, mọi game lớp): Nhất 1 % · Nhì 0,5 % · Giải 3 0,1 % mỗi lượt ("jackpot thì phải khó").
- **Đoán Số bản lớp:** chờ Thùy viết luật.
- EXP ghi nguồn "Trên lớp", đúng môn của lớp, cuối tháng chốt thành xu như nguồn khác (Phần A).
- Hai cách chiếu: TV riêng · chiếu chung một màn trong ERP.

### B6.2 Bắn Quà (Thùy 28/09 — đã build, chưa lớp nào chơi)

- Bắn pháo kiểu Worms / GunBound, 2D. Chỉnh góc + kéo lực; gió đổi mỗi lượt; địa hình phá được; 10 loại đạn đã cân cho điểm trung bình bằng nhau.
- **Cá nhân:** mỗi em 1 phát, mỗi lượt bàn chơi trả về nguyên trạng; xếp hạng theo điểm ⇒ EXP Nhất 300 → cuối 100 (TB 200). Vòng quay đạn: mỗi em 3 loại, giải cao dễ ra đạn đặc biệt.
- **Đội (2–4 đội, hỗn chiến):** cả đội chung một xe, thay nhau bắn; giáo viên đặt giờ; xếp theo tổng sát thương gây ra; đội nhất rương Vàng, còn lại rương Bạc, mở một lần cả đội chung quà; bắn trúng đội mình không mất máu.
- Chia đội: ngẫu nhiên hoặc giáo viên tự xếp. Mỗi buổi chỉ một game.

### B6.3 BK Catan (nháp v0.3, 24/09) — **không thuộc app HS**

- Game giải trí cho **nhân viên BK**, không gắn học tập, không xu. Catan lai 4X, 4 người hoặc 2 đấu 2, 25 lượt. Luật + 6 lần mô phỏng: `_luu-tru/spec-game-catan.md`. Đề nghị không giữ trong spec app HS (B9 câu 1).

### B6.4 Game sự kiện (Trung thu 26/09 · BK Escape)

- Phần em chơi: 5 game iPad 40 giây / trận (Đập Chuột · Tìm Nhân Vật Ẩn · Tìm Điểm Khác Nhau · Xếp Tháp · Mê Cung) + 4 game TV (Đoán Số · Chiếm Đất · Đua · Mở Rương). Một lượt = 3 ván, xu sự kiện trả ngay sau mỗi ván (Nhất 5 · Nhì 3 · còn lại 2). **Xu sự kiện là tiền riêng, không vào ví xu của em.**
- BK Escape: 4 chữ × 4 câu, chỉ câu đố kinh điển.
- Luật từng game: `games-site/luat-choi.html`. Vận hành (check-in, hàng đợi, vòng quay, vai): `spec-van-hanh-trung-tam.md` §7.

### B6.5 Mini game web khác (`games-site/`, không nằm trong app HS)

- Xếp Chữ · Hình Nhân Nhảy Múa · Giải mã · Cờ Tỉ Phú: game giải trí máy cá nhân, bảng xếp hạng theo tên tự gõ, không đăng nhập, không xu. Chưa có quyết định đưa vào app HS (B9 câu 1).

---

## B7. Hướng dẫn chơi + duyệt

- **Nguồn thật là code**, không phải file `.md`: hướng dẫn ở `src/screens/hocsinh/huongdan/noiDungHuongDan.ts`, tutorial ở `src/screens/hocsinh/tutorial/noiDungTutorial.ts`. `HUONG-DAN-CHOI-DUYET.md` là bản xuất để Thùy đọc duyệt (`node scripts/xuat-huong-dan-md.mjs`) — sửa chữ ở nguồn rồi xuất lại, không sửa tay bản xuất.
- **Luật giọng:** thân bài trang trọng ở mọi style; style game chỉ đổi tên + dòng tóm tắt. Số chưa chốt thì không nêu.
- Hướng dẫn chỉ kể tính năng **đang mở** (đọc công tắc tính năng). Tính năng mới mở ⇒ Lộc (người dẫn) kể đúng phần mới, một lần.
- Mục game trong hướng dẫn: "Thử thách" · "Đấu trường, Chinh phục, Giải vô địch" · "Trò chơi". Chặng tutorial game: `thu_thach` · `dau_chinh_phuc` · `nong_trai` · tin mới `moi_0311`.
- Bản xuất hiện có ghi "số liệu theo 03/10" ⇒ **đã cũ ở mục Trò chơi** (B9 lệch L7).

---

## B8. Bảng · hàm · trigger (DB 18/11)

| Mảng | Bảng | Hàm chính |
|---|---|---|
| Đấu trường · tháp | `dtv_nguoi_choi` · `dtv_de` (đề máy chủ, cột `xao`) · `dtv_tran` · `dtv_thap_luot` · `dtv_cau_log` (nhật ký câu) · `dtv_mua` · `dtv_gop_tu` · `dtv_gop_y` | `fn_dtv_de_moi` · `fn_dtv_de_tran_moi` · `fn_dtv_de_lay` · `fn_dtv_cham` · `fn_dtv_cham_tran` · `fn_dtv_tran_ket` · `fn_dtv_thap_ket` · `fn_dtv_ghi_tran_mon` · `fn_dtv_thap_ghi_mon` · `fn_dtv_ghi_cau` · `fn_dtv_bxh` · `fn_dtv_thap_bxh_mon` · `fn_dtv_kho_khoi` / `_chu_de` / `_bo_cau` · `fn_dtv_ho_so*` |
| Thử thách (bản cũ) | `thu_thach_luot` | `thu_thach_sinh` · `thu_thach_luot_do` · `fn_thu_thach_sinh_tu_dong` |
| Nông trại | `nt_luu` (bản lưu, 1 dòng / em) · `nt_gio_choi` (1 dòng / em / ngày) · `nt_xu` · `nt_dht` · `nt_dht_so_du_luu` · `nt_ban_viec` · `nt_cay` · `nt_cau_hinh` · `nt_tang_toc_de` / `_nop` · `nt_thu_hoi_phan` | `fn_nt_nhip` · `fn_nt_luu_doc` / `_ghi` · `fn_nt_xu_dong_bo` · `fn_nt_dht_dong_bo` · `fn_nt_ban_ds` / `_vuon` / `_giup` / `_trom` · `fn_nt_viec_ve_toi` · `fn_nt_tang_toc_de` / `_nop` · `fn_nt_cau_hinh_dat` · `_nt_luat` · `_nt_bao_tri` |
| ĐHT (Phần A giữ luật) | `dht_tieu` · `dht_hoan` | `fn_dht_cua_toi` · `fn_dht_tieu` |
| Game buổi học | `buoi_game_luot` · `buoi_game_qua` · `game_lop_thuong` · `game_lop_qua_dac_biet` · `buoi_giai_log` | `fn_buoi_giai_chot` / `_mo_lai` / `_tinh_hinh` · `fn_buoi_game_choi` · `fn_buoi_game_qua_trao` · `_game_lop_rut_exp` / `_rut_qua` |
| Bắn Quà | `buoi_ban_qua` · `buoi_ban_qua_hs` · `buoi_ban_qua_doi` · `ban_qua_quay` | `fn_ban_qua_chia_doi` / `_bat_dau` / `_chot` / `_tinh_hinh` |
| Mini game web | `game_xep_chu_man` / `_cau` · `game_bxh_man` / `_cau` | `fn_xep_chu_*` · `fn_game_bxh_*` |
| Sự kiện | `sk_*` (10 bảng, chủ `postgres`) | `fn_sk_*` |
| Công tắc | `tinh_nang` · `tinh_nang_lop` · `tinh_nang_log` | `fn_hs_tinh_nang_mo` · `fn_tinh_nang_dat` |

- **Trigger trên bảng game:** `thu_thach_luot` → lên bậc Rank · `sk_dang_ky`, `sk_phan_cong` → ghi log. Các bảng game khác không có trigger.
- **Mọi bảng game đã bật RLS.** Hàm game mà người chưa đăng nhập gọi được (có trong danh sách cho phép): nhóm `fn_dtv_*` (hồ sơ khách, ghi trận, ghi tháp, kho câu, bảng xếp hạng) + `fn_xep_chu_*` + `fn_game_bxh_*`. Nhóm `fn_nt_*` không cho người chưa đăng nhập.
- **CHECK cần nhớ khi thêm loại:** `dtv_tran.che_do` (bot · doi · mang · giai · on_tap · noi_tu) · `dtv_de.che_do` (song_con · vo_tan · bot) · `nt_ban_viec.loai` · `qlht_xu_ledger.loai` (có `nong_trai`).
- Bảng xếp hạng game làm mới qua bộ điều phối tính sẵn (10 phút / lần, 6–23 giờ).

---

## B9. Lệch + câu hỏi

### B9.1 Luật cũ đã bị luật mới hơn thay (ghi nhận, không hỏi)

| Chỗ | Cũ | Hiện hành |
|---|---|---|
| Thử thách tính mastery (02/10, 03/10) | có | **không** — game không tính mastery (17–18/11) |
| Phạm vi câu game (03/10) | dạng em đã đo ≥ 3 lần | dạng **lớp** đã học (14/10) |
| Tháp chủ đề mở khi (03/10 sáng) | phần lớn khối đã học | em học ≥ 1/2 dạng (03/10 chiều) |
| Sai trong trận đua (Bufopia) | khoá một đáp án | khoá cả câu (03/10) + trừ điểm (03/11) |
| Trần xu Nông trại (30/09) | 30 / tháng, mùa đầu 45 | 20 / tháng (12/10) |
| Tiền mua trong Nông trại (30/09) | xu + "điểm chăm chỉ" | chỉ ĐHT (12/10) |
| Số ô đầu (30/09) | 4 | 8 (07/11) |
| Giúp bạn (30/09) | 5 lượt, không EXP | 10 lượt, 1 EXP / lượt (03/11, 07/11) |
| Nhà nông trại (30/09) | 4 kiểu × 10 mức | 3 kiểu × 4 mức (14/11) |
| Bắt thú và Nông trại (30/09) | hai game độc lập | gộp một game (01/10); gộp tất cả vào Làng BK (12/10) |
| "Chung trần 30 / 45 xu" trong BK World, Làng BK | 30 / 45 | nếu làm thì theo trần đang chạy (20) |

### B9.0 THÙY CHỐT 18/11 (Phần B) — câu 1 · 4 · 5 Thùy trả lời riêng, còn lại "theo ý m" = theo đề xuất

| Câu | Luật chốt | Việc code / DB |
|---|---|---|
| 1 | Giữ / dừng theo bảng đề xuất: **giữ** Nông trại · đấu với máy · Mở Rương / Chiếm Đất; đấu online + giải 8 người giữ nguyên không làm thêm; tháp mở thử một khối; Thử thách 3 trận chỉ làm khi mở Giải Vô địch; Bắn Quà thử 1 lớp; Đoán Số bản lớp bỏ; mini game web + Catan ra khỏi spec app HS. **Thùy báo lỗi: "Chiếm Đất hiện EXP trước khi hoạt cảnh xong".** | ✅ lỗi Chiếm Đất ĐÃ SỬA 18/11 (màn giáo viên `XepHangBuoi.tsx`: đồng hồ dự phòng 25 giây tự hiện EXP — Chiếm Đất em còn phải chọn ô nên bị lộ; nay dự phòng 3 phút, bình thường chờ TV báo xong). Chờ deploy ERP; chưa thử trên TV thật. |
| 2 | **Nông trại là gốc, thêm dần.** Bản 3 màn (01/10) và Làng BK (12/10) là nháp, không làm khi chưa có lệnh. | — |
| 3 | **Khoá ngay chỗ lộ đáp án Đấu trường** (đấu online · giải Toán / KHTN · khách tạm ngừng tới khi chấm ở máy chủ). | áp bản vá `202610071540_dtv_khoa_kho_bo_cau.sql` — CHƯA áp, chờ lệnh riêng (làm ngừng 3 chế độ) |
| 4 | **"Chúng nó chơi vào giờ ra chơi mà"** — KHÔNG chặn, KHÔNG báo giáo viên. Giới hạn 30 phút / ngày của Nông trại giữ như cũ. | — |
| 5 | **"Không có luật đủ 5 phút nhận xu. Mục tiêu là chơi 5 phút, không liên quan cái này."** — nhận xu KHÔNG phụ thuộc số phút chơi. **Code đang trái:** cấu hình "phút tối thiểu để tính ngày chơi" = 5 ⇒ 116 / 191 em (30 ngày) không ngày nào đủ ⇒ không nhận xu. | đặt cấu hình về 0 — CHƯA áp (hệ chặn lệnh đổi cấu hình xu đang chạy khi chưa có lệnh rõ); chờ Thùy nói "sửa" |
| 6 | Giữ **trần 4 xu / ngày chơi** làm lưới an toàn (cùng trần 20 xu / tháng). | — |
| 7 | Câu cá **3 lượt / ngày**, đo một tháng. | — |
| 8 | Bắt thú **không trả xu trực tiếp** (theo 01/10); chưa gấp. | — |
| 9 | Đấu trường giữ bảng xếp hạng, **chưa có mùa giải kèm quà**. | — |

### B9.2 Câu hỏi gốc (ĐÃ TRẢ LỜI ở B9.0 — giữ làm bối cảnh)

**Câu 1 — Game nào giữ, game nào dừng?**
Có nhiều game đã làm nhưng gần như không ai chơi, hoặc chưa mở. Ví dụ: Thử thách tuần trước chỉ có 2 lượt; đấu online 7 ngày qua chỉ 2 trận; tháp chưa mở cho em nào.
Đề xuất CTO cho từng game — Thùy sửa cột cuối:

| Game | Đang thế nào | Đề xuất |
|---|---|---|
| Nông trại | 100 em / tuần | giữ, làm tiếp |
| Đấu với máy | 19 em / tuần, tụt dần | giữ |
| Game buổi học (Mở Rương, Chiếm Đất) | 67 buổi / tháng | giữ |
| Đấu online + giải 8 người | 2 trận / tuần | giữ nguyên, **không làm thêm** |
| Chinh phục BK (tháp) | làm xong, chưa mở | mở thử một khối rồi quyết |
| Thử thách bản 10 câu | 2 lượt / tuần | dừng làm thêm; luật 3 trận chỉ làm khi mở Giải Vô địch |
| Giải Vô địch trực tiếp | mới có màn mẫu | để sau |
| Bắn Quà | xong, chưa lớp nào chơi | thử 1 lớp rồi quyết |
| Đoán Số bản lớp | chờ luật | bỏ khỏi danh sách |
| Xếp Chữ, Hình Nhân, Giải mã, Cờ Tỉ Phú | nằm ở trang game riêng | không thuộc app HS, chỉ ghi tên |
| BK Catan | game của nhân viên | đưa ra khỏi spec app HS |
- a) Theo bảng đề xuất. b) Thùy sửa từng dòng.

**Câu 2 — Game lớn đi hướng nào: Nông trại hiện tại, hay bản 3 màn, hay Làng BK?**
01/10 Thùy chốt gộp bắt thú với Nông trại thành một game 3 màn; 12/10 chốt gộp hết vào Làng BK. Nhưng cái đang chạy cho học sinh là Nông trại riêng, và mỗi tuần vẫn thêm thứ mới vào nó (câu cá, nhà, thú cưng).
- a) Nông trại hiện tại là gốc, thêm dần từng phần; bắt thú và Làng BK là việc sau, chưa có ngày. b) Dừng thêm vào Nông trại, chuyển sang bản 3 màn có bắt thú. c) Dừng cả hai, dồn sức làm Làng BK.
- Đề xuất CTO: a — thứ duy nhất có 100 em chơi mỗi tuần.

**Câu 3 — Có khoá ngay chỗ lộ đáp án của Đấu trường không?**
Hiện ai cũng gọi được một hàm trả về câu hỏi **kèm đáp án** của kho Toán / KHTN (kể cả người chưa đăng nhập). Đấu online và giải thì máy của em tự chấm rồi báo điểm lên. Ví dụ: một em rành máy tính xem được đáp án trước, hoặc tự báo mình thắng. Bản khoá đã soạn từ 07/10 nhưng chưa áp.
- a) Khoá ngay ⇒ đấu online + giải của Toán / KHTN và khách chưa đăng nhập tạm không chơi được, cho tới khi làm xong phần máy chủ chấm trận online. Đấu với máy và tháp không ảnh hưởng. b) Để nguyên vì đấu online chưa có thưởng.
- Đề xuất CTO: a — đấu online chỉ còn 2 trận / tuần, còn đáp án lộ là lộ cả kho.

**Câu 4 — Có chặn game trong giờ em đang có buổi học không?**
Đo 30 ngày: khoảng 115 trận Đấu trường (18 em) và 92 lần mở Nông trại (50 em) rơi đúng vào khung giờ buổi học của lớp em đó. Số này là ước lượng — không biết hôm đó em có mặt không, hay giáo viên cho chơi lúc nghỉ.
- a) Chặn: trong giờ buổi học của lớp em, game báo "Đang giờ học", trừ game giáo viên mở. b) Không chặn, chỉ báo cho giáo viên / trưởng khối. c) Để nguyên.
- Đề xuất CTO: b trước — số liệu chưa đủ chắc để chặn.
- Kèm theo: giới hạn 30 phút / ngày hiện chỉ áp Nông trại. Đấu trường, tháp chưa giới hạn. Giữ vậy hay giới hạn chung?

**Câu 5 — Nông trại: giữ điều kiện "chơi đủ 5 phút mới được nhận xu" không?**
Thiết kế là mỗi ngày 10–15 phút. Thực tế trung bình **3,7 phút** một ngày chơi. Trong 30 ngày, 116 / 191 em không có ngày nào đủ 5 phút ⇒ các em này không nhận được xu nào dù có trồng và bán. Chỉ 39–42 em / tháng nhận được xu.
- a) Giữ 5 phút (muốn em ở lại lâu hơn). b) Hạ còn 2–3 phút. c) Bỏ điều kiện phút, chỉ cần có vào chăm vườn.
- Đề xuất CTO: b.

**Câu 6 — Nông trại: giữ trần 4 xu / ngày không?**
13/10 Thùy nói "không có trần một ngày, vì cây 3 ngày mới xong". 23/10 Thùy nói "áp trần một ngày 4 xu tránh rủi ro lỗi game". 07/11 Thùy nói "khoá trần vô lý, vấn đề là tỉ trọng EXP". Đang chạy: 4 xu / ngày. Ví dụ: em thu cây 3 ngày được 6 xu một lúc ⇒ hôm đó nhận 4, còn 2 xu phải hôm sau vào chơi mới nhận.
- a) Giữ 4 xu / ngày làm lưới an toàn. b) Bỏ trần ngày, chỉ còn 20 xu / tháng.
- Đề xuất CTO: a — lỗi phân bón 07/11 cho thấy lưới an toàn có ích.

**Câu 7 — Câu cá: mỗi ngày mấy lượt?**
Thùy đã chốt cá bán ra EXP. Số lượt / ngày thì CTO tự đặt là 3 (em câu trúng hết được khoảng 12 xu / tháng, cộng vào khoảng 20 xu từ trồng trọt ⇒ em chăm sẽ chạm trần 20 xu sớm hơn).
- a) Giữ 3 lượt. b) 2 lượt. c) 3 lượt nhưng giảm giá cá.
- Đề xuất CTO: a, đo một tháng rồi chỉnh.

**Câu 8 — Bắt được thú thì có được xu không?** *(hai lời Thùy vênh nhau)*
30/09: "nông sản bán luôn được 3 xu; làm bóng đi bắt thì bắt được thưởng 4–5 xu, nhưng có thể hụt — như đầu tư". 01/10: "không trả xu trực tiếp"; thú không bán ra xu; xu chỉ đến từ nhiệm vụ của nhân vật trong game, tính chung trần với Nông trại.
- a) Theo 01/10: bắt thú không ra xu; xu chỉ từ nhiệm vụ, chung trần 20 xu / tháng. b) Theo 30/09: bắt được là có xu.
- Đề xuất CTO: a. Chưa gấp — chỉ cần khi bắt thú vào app.

**Câu 9 — Đấu trường có mùa giải và quà không?**
Thiết kế 02/10: trận cho điểm xếp hạng theo mùa, hết mùa mới trao quà. Hiện chỉ có bảng xếp hạng (mùa 1 từ 03/11), không có quà, không xu.
- a) Giữ như hiện tại: chơi vui + bảng xếp hạng, không quà. b) Làm mùa 1 tháng, cuối mùa top mỗi khối nhận quà / xu.
- Đề xuất CTO: a cho tới khi câu 3 xong (máy chủ chưa chấm thì không nên có quà).

### B9.3 Lệch kỹ thuật (CTO xử lý, không cần Thùy quyết — trừ khi ghi rõ)

| # | Lệch | Mức |
|---|---|---|
| L1 | Bản khoá `202610071540` treo trong sổ từ 07/10: hàm kho câu của Đấu trường trả đáp án cho mọi người. Liên quan câu 3. **Cẩn thận: `npm run migrate` trần sẽ áp file này** | cao |
| L2 | Đấu online, giải, môn Anh, khách: điểm trận do máy em tính rồi ghi lên (trái luật "tính ở DB"). Hàm ghi trận, ghi tháp mở cho người chưa đăng nhập | cao |
| L3 | Nông trại: bản lưu vườn (cấp, kho, cây) do máy em gửi nguyên khối; máy chủ không kiểm lại. Xu được chặn bằng trần, nhưng cấp và đồ thì sửa được | vừa |
| L4 | Sổ xu Nông trại tháng 11 lệch 7 xu ở 7 em: `nt_xu` ghi 241, sổ ví ghi 234 (mỗi em lệch đúng 1). Nghi do lượt thu hồi phân bón 07/11 giữ tối thiểu 1 | vừa |
| L5 | Nông trại gọi máy chủ **30 giây / lần** khi đang chơi (đo giờ chơi). Luật kiến trúc cấm hỏi lại chu kỳ ngắn ⇒ cần ghi là ngoại lệ có lý do hoặc giãn ra | vừa |
| L6 | 3 quà trà sữa đã trúng, **chưa đánh dấu đã trao** | thấp — báo Lộc |
| L7 | Chữ hiển thị sai: thẻ Nông trại (`dsGame.ts`) và mục 17 hướng dẫn còn ghi "bản thử, lưu trên thiết bị, chưa nối xu" — đã sai từ 12/10. Mục Thử thách ghi "sắp nâng cấp" | thấp |
| L8 | Điểm kinh nghiệm Đấu trường là **một số chung mọi môn** (`dtv_nguoi_choi.xp`) — trái luật nhãn môn. Trận, tháp, nhật ký câu thì đã có môn | thấp |
| L9 | Luật Nông trại tồn tại hai nơi (game + DB). Câu cá chỉ có ở game, máy chủ chưa biết | thấp |
| L10 | Thử thách: DB + màn đang chạy là bản 10 câu; luật 3 trận chưa có bảng, chưa có hàm | theo câu 1 |
| L11 | Mức nhớ từ (Anh) lưu trong hồ sơ, không tính lại từ nhật ký như thiết kế | gác cùng môn Anh |
| L12 | Bảng `sk_*` do `postgres` sở hữu ⇒ phiên Claude đọc ra 0 dòng; không xác nhận được số liệu sự kiện | ghi nhận |
| L13 | `public/games/nong-trai/` (khoảng 9 MB) đi theo mọi bản build của repo, kể cả ERP, app PH | thấp |

---

## B10. Khi Thùy duyệt — file nguồn chuyển vào `_luu-tru/`

| File | Ghi chú |
|---|---|
| `spec-che-do-game.md` | → B1, B2 |
| `spec-thu-thach-dau-truong.md` | → B2.4 (giữ làm tham chiếu hoạt cảnh §4) |
| `spec-dau-tu-vung.md` | → B3 (phần kho từ Anh: gác cùng môn Anh) |
| `spec-nong-trai-nhip-ngay.md` | → B4 (số 30/09 đã cũ — bảng B9.1) |
| `spec-bk-world.md` · `spec-bat-thu.md` · `spec-lang-bk.md` | → B4.9, B5 (bản thiết kế chi tiết chỉ còn ở `_luu-tru/`) |
| `spec-game-buoi-hoc.md` · `spec-game-ban-qua.md` | → B6.1, B6.2 |
| `spec-game-catan.md` | → B6.3 (theo câu 1: ra khỏi spec app HS) |

- **Giữ tại chỗ:** `HUONG-DAN-CHOI-DUYET.md` (bản xuất tự sinh từ code) · `design/STYLE-HS.md` · `design/nghien-cuu-do-hoa-little-habitats.md` · `design/BANG-GIA-THU-CUNG-NONG-TRAI.md`.
- **Đã ở `_luu-tru/`:** `spec-game-bat-quai.md` · `luat-choi-game.md`.
- **Phải sửa theo khi chuyển:** dòng trỏ trong `CLAUDE.md` §7 (`spec-che-do-game.md`) · `SPEC-INDEX.md` bảng A dòng 12 + bảng B · chú thích trỏ tên file cũ trong code không sửa (tra `SPEC-INDEX.md`).
