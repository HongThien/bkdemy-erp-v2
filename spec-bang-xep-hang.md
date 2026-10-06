# SPEC — Thẻ "BẢNG XẾP HẠNG" (màn chính app HS) — DỰ KIẾN ĐỂ THÙY DUYỆT · 06/10/2026

> Yêu cầu Thùy 06/10: một card **vô cùng quan trọng** ở ngoài màn chính = **Bảng xếp hạng**, chứa **mọi loại xếp hạng của mọi hoạt động ở BK**. File này là **danh sách dự kiến** + nguyên tắc; Thùy gạch/thêm rồi mới build.
> Nhãn dữ liệu: ✅ đã có/đo được ngay · 🔧 cần viết hàm/ghi sự kiện · ⛔ chờ hệ thống khác · 🚫 đề xuất KHÔNG làm.
> Nhãn: **[CÓ SẴN]** đã có màn/hàm · **[MỚI]** chưa có.

## 0. ĐÃ DUYỆT (Thùy 06/10) — thay cho mọi chỗ mâu thuẫn bên dưới
**8 bảng V1:** **A1** Siêng luyện · **A2** Tổng câu đúng · **A3** Tỉ lệ đạt · **A4** Master chủ đề · **A5** Chuỗi làm bài · **B1** MT tháng · **C1** Leo tháp Sinh tồn · **E1** Bộ sưu tập huy hiệu.
**Chưa duyệt ⇒ ngoài V1:** A6, A7, B2–B6, C2–C7, D1–D4, E2, E3.
| # | Quyết định [CEO] |
|---|---|
| 1 | **Phạm vi:** mỗi bảng **luôn có 2 tab: Khối mình · Toàn BK** (không có "Lớp mình") |
| 2 | **Hiện top 20 + vị trí của chính em; vị trí của em CHỈ MÌNH THẤY.** ⇒ bỏ nguyên tắc "ẩn số hạng khi ở nửa dưới": em xếp hạng bao nhiêu cũng hiện số thật, nhưng riêng tư |
| 3 | **Thẻ = 1 ô lớn trong lưới** (thay ô "Bảng xếp hạng" cũ; cả cấp 2 và cấp 3) — không còn "thẻ rộng dưới Thế giới BK" |
| 4 | Cập nhật: bảng tuần/tháng mỗi ngày 05:00; bảng "hôm nay" của game cập nhật ngay |
| 5 | Các nguyên tắc còn lại ở §2 (tên kèm lớp, ẩn tài khoản test, chỉ xếp em có dữ liệu thật, hoà hạng ai sớm hơn đứng trước, tính ở Postgres) **giữ** |

**Hệ quả / điểm CTO cần làm rõ:**
- **"Toàn BK"** của bảng gắn môn (A1–A4, B1, C1) = mọi khối của **môn đó**; của bảng không gắn môn (A5 chuỗi, E1 huy hiệu) = mọi học sinh.
- **Riêng tư thứ hạng:** hàm trả **top 20 + hạng của CHÍNH người gọi**; không có đường xem hạng người khác ngoài top 20. Top 20 "Toàn BK" hiện tên + lớp của học sinh khối khác (cùng chuẩn hiển thị của Thế giới BK; có chế độ hiện Mã HS).
- **B1 Toàn BK:** MT mỗi khối thi **đề khác nhau** ⇒ "Toàn BK" so điểm giữa các đề khác nhau — **[HỎI]** chấp nhận so thẳng điểm, hay xếp theo **phân vị trong khối của mình**? (đề xuất: so thẳng điểm cho đơn giản, ghi chú "đề mỗi khối khác nhau")
- **A1** phụ thuộc định nghĩa "lượt đạt" (Luyện dạng yếu đúng ≥ 7/10, thoả lượt học thật) của hệ nhiệm vụ mới — **chưa build**; bảng tạm đếm trực tiếp từ bài tự luyện đủ điều kiện, sau đổi nguồn.
- **C1 là bảng game DUY NHẤT của V1 và đang ⛔**: Đấu Từ lưu hồ sơ theo thiết bị, điểm do client khai ⇒ phải làm **hồ sơ Đấu Từ theo tài khoản + máy chủ chấm/ghi tầng tháp Sinh tồn** trước. Đây là việc **nặng nhất** của cả thẻ. Cho tới lúc đó C1 hiện "Sắp có".
- **E1** = tổng sao huy hiệu trong mùa (huy hiệu không thưởng, chỉ sưu tập); đợi chốt luật huy hiệu (§12 spec-kinh-te-nhiem-vu.md).
**Thứ tự build [ĐỀ XUẤT]:** ① DB: `bxh_loai` + `fn_bxh(loai, mon, pham_vi, ky)` + 7 bảng không-game (A1–A5, B1, E1) · ② app: ô lớn + màn Bảng xếp hạng (nhóm → bảng → Khối/Toàn BK) + Hướng dẫn chơi + tutorial · ③ C1 sau khi hồ sơ Đấu Từ theo tài khoản xong.

---

## 1. Thẻ ở màn chính
- ~~**Vị trí [ĐỀ XUẤT]:** thẻ rộng ngay dưới thẻ Thế giới BK~~ **[THAY bởi §0 #3: 1 ô lớn trong lưới]**. Thay ô "Bảng xếp hạng" cũ (hiện chỉ cấp 3, "Thi đua tự luyện") — **áp cho cả cấp 2 lẫn cấp 3**.
- **Dòng trạng thái trên thẻ:** thứ hạng nổi bật nhất của em hôm nay (ví dụ "Em đứng hạng 4 khối ở Siêng luyện tháng này"), hoặc "Chưa có hạng — làm 1 lượt luyện để vào bảng".
- **Bên trong:** chọn **nhóm** (Học tập · Kết quả lớp · Game · Lớp với lớp · Sưu tập) → chọn **bảng** → chọn **phạm vi** (Lớp mình · Khối mình · Toàn BK nếu bảng cho phép) và **kỳ** (Hôm nay · Tuần · Tháng · Mùa) → danh sách.

## 2. Nguyên tắc hiển thị [ĐỀ XUẤT — chờ gật]
1. ~~**Top 10 + vị trí của em**~~ **[THAY: Top 20, §0 #2]** (kèm 1 người trên và 1 người dưới em). Không phô danh sách dài.
2. ~~**Không công khai hạng thấp**~~ **[THAY bởi §0 #2: hiện hạng thật, riêng tư]** (đồng luật A8 của Thế giới BK "không hiện điểm kém/hạng thấp"): nếu em ở **nửa dưới** thì **không ghi số hạng**, chỉ ghi "Em cách top 30% còn N điểm" — tạo động lực, không gây xấu hổ.
3. Tên luôn kèm **lớp**; có chế độ hiện **Mã HS** thay tên (đã có ở Thế giới BK). **Ẩn tài khoản test** (`_hs_hien`).
4. **Theo môn × khối** là mặc định (một môn = một trung tâm, CLAUDE §1.6); bảng không-gắn-môn (chuỗi, vào app, game…) ghi "mọi môn".
5. Chỉ xếp những em **có dữ liệu thật** trong kỳ (không có dòng = không có mặt trong bảng; không phải 0 điểm — §1.5).
6. **Hòa hạng** ⇒ ai đạt mốc sớm hơn đứng trước.
7. Mọi con số tính ở **Postgres** (hàm `fn_bxh(loai, mon, pham_vi, ky)` dispatch theo bảng cấu hình `bxh_loai`) — thêm một bảng xếp hạng = thêm 1 dòng cấu hình + 1 hàm đo, không sửa màn. Tính theo đợt (cache) vì quét cả khối.

## 3. Danh sách xếp hạng dự kiến
### Nhóm A — HỌC TẬP (thước đo chăm chỉ tự nguyện)
| # | Bảng | Đo | Phạm vi · Kỳ | Dữ liệu |
|---|---|---|---|---|
| A1 | **Siêng luyện** | số lượt Luyện dạng yếu đạt (≥ 7/10) trong kỳ | Khối × môn · Tuần/Tháng | ✅ nguồn nhiệm vụ mới (🔧 hàm đếm) · **thay** BXH tự luyện cũ |
| A2 | **Tổng câu đúng** | số câu đúng trên app | Khối × môn · Tháng/Mùa | ✅ |
| A3 | **Tỉ lệ đạt** | % dạng "đạt" (≥ 3 câu, đúng ≥ 75%) | Khối × môn · Hiện tại | ✅ `fn_hs_xep_hang_ti_le_dat` **[CÓ SẴN]** |
| A4 | **Master chủ đề** | số chủ đề 100% dạng đạt trong mùa | Khối × môn · Mùa | ✅ (cùng nguồn thành tựu #15 / Hercules) |
| A5 | **Chuỗi làm bài** | chuỗi hiện tại (ngày) | Mọi môn · Hiện tại + Kỷ lục mùa | ✅ `fn_chuoi_cua_toi` |
| A6 | **Siêng nhiệm vụ** | số ngày hoàn thành việc ngày trong tháng / chuỗi việc ngày | Mọi môn · Tháng | 🔧 |
| A7 | **Vào app liên tiếp** | chuỗi ngày mở app | Mọi môn · Hiện tại | 🔧 chưa có log mở app |
### Nhóm B — KẾT QUẢ Ở LỚP (việc bắt buộc)
| # | Bảng | Đo | Phạm vi · Kỳ | Dữ liệu |
|---|---|---|---|---|
| B1 | **MT tháng** | điểm Mock Test | Khối × môn · Tháng | ✅ `fn_bxh_diem_mt_khoi` **[CÓ SẴN]** |
| B2 | **ET tháng** | điểm TB các bài ET trong tháng | Khối × môn · Tháng | ✅ |
| B3 | **Nhất ET** | số lần đứng nhất ET (cộng dồn mùa) | Khối × môn · Mùa | ✅ (cần kiểm cột hạng ET) |
| B4 | **BTVN chuẩn** | tỉ lệ đúng TB + số bài đúng hạn | Khối × môn · Tháng | ✅ |
| B5 | **Elo ET** | Elo theo môn | Khối × môn · Hiện tại | ✅ `gami` |
| B6 | **Cấp Level** | Level EXP (21 mốc) tổng | Khối · Mùa | ✅ |
### Nhóm C — GAME
| # | Bảng | Đo | Phạm vi · Kỳ | Dữ liệu |
|---|---|---|---|---|
| C1 | **Leo tháp Sinh tồn** | tầng cao nhất trong 5 phút (tháp tổng + tháp chủ đề) | Khối × môn · Hôm nay + Kỷ lục | ⛔ Đấu Từ lưu theo thiết bị, điểm do client khai ⇒ cần hồ sơ tài khoản + máy chủ chấm |
| C2 | **Đấu Từ — điểm/XP** | XP / điểm trận / cấp | Khối × môn · Tuần/Mùa | ⛔ như trên |
| C3 | **Giải Vô địch** | bảng nhánh + danh sách nhà vô địch các giải | Khối × môn | ⛔ giải trực tiếp mới là demo |
| C4 | **Nhất buổi học** | số lần Nhất/Nhì/Giải 3 ở game trong buổi | Lớp → Khối · Tháng | ✅ `fn_buoi_giai_chot` |
| C5 | **Nông trại** | cấp nông trại / nhà nông | Khối · Mùa | ⛔ Nông trại lưu trên máy |
| C6 | **Săn quái vật** | số loài thu phục | Khối · Mùa | ⛔ chưa ra mắt |
| C7 | *(sau)* Tháp 50 tầng / tháp Hard | tầng đã qua | — | ⛔ **đã đóng/để sau** (Thùy 06/10) |
### Nhóm D — LỚP VỚI LỚP (đua tập thể)
| # | Bảng | Đo | Dữ liệu |
|---|---|---|---|
| D1 | **Lớp chăm nhất** | trung bình lượt luyện đạt / HS · tháng | 🔧 |
| D2 | **Lớp nộp BTVN đúng hạn** | % bài đúng hạn cả lớp · tháng | ✅ |
| D3 | **Lớp chuyên cần** | % có mặt · tháng | ✅ |
| D4 | **Lớp đua EXP** | EXP TB/HS · tháng | ✅ |
(Gắn quà đua lớp C8 đang chờ Thùy; bảng D chỉ hiện **lớp** — không nêu tên học sinh yếu.)
### Nhóm E — SƯU TẬP
| # | Bảng | Đo | Dữ liệu |
|---|---|---|---|
| E1 | **Bộ sưu tập huy hiệu** | tổng sao huy hiệu trong mùa | ✅ (huy hiệu không thưởng, chỉ sưu tập ⇒ hợp làm bảng) |
| E2 | **Thành tựu mùa** | số thành tựu đạt trong mùa | 🔧 chờ build thành tựu |
| E3 | **Bạn bè** | số bạn (chỉ đếm bạn mới trong mùa) | ✅ — **[HỎI]** có nên xếp hạng không (xem §4) |
### 🚫 Đề xuất KHÔNG làm
- **Bảng đua tháng theo Điểm Rank** — Rank đang ẩn (Thùy 06/10); code giữ ngầm, không lộ.
- **Xếp hạng theo xu / điểm học tập đang có** — tránh tạo áp lực "giàu hơn" và sinh vòng gian lận; xu là ví cá nhân.
- **Xếp hạng điểm thấp / "ít chăm nhất".** Không bao giờ.
- **Xếp hạng theo số bạn / số lượt khoe / số like** — biến Thế giới BK thành cuộc thi nổi tiếng (E3 để Thùy quyết).

## 4. Câu hỏi để Thùy duyệt
1. Duyệt/gạch từng bảng ở §3 (đặc biệt: E3 bạn bè, D1–D4 lớp với lớp có làm V1 không).
2. **Phạm vi:** mặc định **Khối mình**; thêm **Lớp mình**; **Toàn BK** chỉ cho game (C) và Level (B6)? Hay mọi bảng đều có "Toàn BK"?
3. Nguyên tắc 2 (**ẩn hạng khi ở nửa dưới**): gật hay hiện hạng thật cho mọi em?
4. **Thẻ ngoài màn chính:** để rộng dưới thẻ Thế giới BK, hay một ô lớn trong lưới? Thay ô "Bảng xếp hạng" cũ?
5. **Tần suất cập nhật:** mỗi giờ / mỗi ngày (đề xuất: bảng tuần-tháng cập nhật mỗi ngày 05:00; bảng "hôm nay" của game cập nhật ngay).
6. Thưởng cho thứ hạng (quà đua, thành tựu "lọt top")? — **không** thuộc phiên này trừ khi Thùy nêu (đã có thành tựu Top5/Top1 MT).

## 5. Hệ quả kỹ thuật (làm sau khi duyệt)
Bảng `bxh_loai(key, nhom, ten, mon_hay_chung, ky, pham_vi_cho_phep, active)` + hàm `fn_bxh(p_loai, p_mon, p_pham_vi, p_ky)` (security definer, ẩn tài khoản test, lọc theo khối của em) + cache `bxh_chot` (job mỗi ngày — chưa có pg_cron nên gắn vào quy trình chốt hiện có hoặc gọi lười khi mở bảng); app: `BangXepHangHS` (nhóm → bảng → phạm vi/kỳ), thẻ Home, Hướng dẫn chơi + tutorial thêm mục. Bảng ⛔ để "Sắp có" tới khi game có hồ sơ theo tài khoản.
